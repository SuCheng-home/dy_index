"use client"

import { type MouseEvent, useRef, useState } from "react"
import { FileText, Loader2, Trash2, Upload, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"

export type ManagedFile = {
  fileUrl: string
  fileName: string
  id?: string
}

type CosSignPayload = {
  bucketName: string
  expiredTime: number
  credentials: {
    tmpSecretId: string
    tmpSecretKey: string
    sessionToken: string
  }
}

type ManagedUploaderProps = {
  value: ManagedFile[]
  onChange: (value: ManagedFile[]) => void
  mode?: "image" | "file"
  multiple?: boolean
  max?: number
  acceptExtensions?: string[]
  sysBucket?: 1 | 2
  buttonText?: string
  disabled?: boolean
  compact?: boolean
  logoMode?: boolean
}

const imageExtensions = ["jpeg", "jpg", "bmp", "gif", "png", "webp"]
const defaultFileExtensions = ["doc", "docx", "xls", "xlsx", "ppt", "pptx", "pdf", "txt", "zip", "rar", "mp3", "mp4", "flv", "mpeg", "wmv", "png", "jpg", "jpeg", "gif", "bmp"]

function extOf(fileName: string) {
  return fileName.includes(".") ? fileName.split(".").pop()?.toLowerCase() ?? "" : ""
}

function isImageUrl(url: string) {
  const cleanUrl = url.split("?")[0]
  return imageExtensions.includes(extOf(cleanUrl))
}

function toCosKey(fileName: string) {
  const ext = extOf(fileName)
  const year = new Date().getFullYear()
  const timestamp = Date.now()
  const random = String(Math.floor(Math.random() * 100000)).padStart(6, "0")
  if (imageExtensions.includes(ext)) {
    return `/wangzhan/${year}/${timestamp}/${timestamp}${random}.${ext}`
  }
  return `/wangzhan/${year}/${timestamp}/${fileName}`
}

function toDisplayUrl(location: string) {
  const raw = location.startsWith("http") ? location : `http://${location}`
  return isImageUrl(raw) ? raw.replace(/\.cos\.ap-.+?\./, ".picsh.") : raw
}

async function requestJson<T>(input: RequestInfo, init?: RequestInit): Promise<T> {
  const response = await fetch(input, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  })
  const json = await response.json()
  if (!response.ok || json?.result === false || json?.code !== 200) {
    throw new Error(json?.msg || "请求失败")
  }
  return json.data as T
}

export function parseManagedFiles(value: string | null | undefined): ManagedFile[] {
  if (!value) return []
  try {
    const parsed = JSON.parse(value)
    if (!Array.isArray(parsed)) return []
    return parsed.map((item) => ({
      fileUrl: String(item.fileUrl ?? item.url ?? ""),
      fileName: String(item.fileName ?? item.name ?? item.fileUrl ?? item.url ?? "附件"),
      id: item.id ? String(item.id) : "",
    })).filter((item) => item.fileUrl)
  } catch {
    return []
  }
}

export function stringifyManagedFiles(files: ManagedFile[]) {
  return JSON.stringify(files.map((file) => ({
    fileUrl: file.fileUrl,
    fileName: file.fileName,
    id: file.id ?? "",
  })))
}

export function ManagedUploader({
  value,
  onChange,
  mode = "image",
  multiple = false,
  max = 5,
  acceptExtensions,
  sysBucket = 2,
  buttonText,
  disabled = false,
  compact = false,
  logoMode = false,
}: ManagedUploaderProps) {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState("")
  const [error, setError] = useState("")
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const allowedExtensions = acceptExtensions ?? (mode === "image" ? imageExtensions : defaultFileExtensions)

  async function handleUpload(files: FileList | null) {
    const file = files?.[0]
    if (!file || disabled) return
    const ext = extOf(file.name)
    if (!allowedExtensions.includes(ext)) {
      setError(`请上传后缀名为 ${allowedExtensions.join(", ")} 的文件`)
      return
    }
    if (multiple && value.length >= max) {
      setError(`最多上传 ${max} 个文件`)
      return
    }

    setUploading(true)
    setError("")
    setProgress("0%")
    try {
      const sign = await requestJson<CosSignPayload>(`/api/manage/upload/sign?sysBucket=${sysBucket}`)
      const { default: COS } = await import("cos-js-sdk-v5")
      const cos = new COS({
        getAuthorization: (_options: unknown, callback: (data: {
          TmpSecretId: string
          TmpSecretKey: string
          XCosSecurityToken: string
          ExpiredTime: number
        }) => void) => {
          callback({
            TmpSecretId: sign.credentials.tmpSecretId,
            TmpSecretKey: sign.credentials.tmpSecretKey,
            XCosSecurityToken: sign.credentials.sessionToken,
            ExpiredTime: sign.expiredTime,
          })
        },
      })
      const key = toCosKey(file.name)
      const uploadResult = await new Promise<{ Location: string }>((resolve, reject) => {
        cos.putObject({
          Bucket: sign.bucketName,
          Region: "ap-shanghai",
          Key: key,
          Body: file,
          onProgress: (data: { percent?: number }) => {
            setProgress(`${Math.round((data.percent ?? 0) * 100)}%`)
          },
        }, (err: Error | null, data: { Location: string }) => {
          if (err) reject(err)
          else resolve(data)
        })
      })
      const nextFile = {
        fileUrl: toDisplayUrl(uploadResult.Location),
        fileName: file.name,
        id: "",
      }
      const nextValue = multiple ? [...value, nextFile].slice(0, max) : [nextFile]
      onChange(nextValue)
      await requestJson("/api/manage/upload/file-record", {
        method: "POST",
        body: JSON.stringify({
          fileId: "",
          fileSize: file.size,
          fileUrl: nextFile.fileUrl,
          moduleCode: "2056",
          moduleName: "wangzhan",
        }),
      })
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "上传失败")
    } finally {
      setUploading(false)
      setProgress("")
      if (inputRef.current) inputRef.current.value = ""
    }
  }

  async function removeFile(index: number) {
    const next = [...value]
    const [removed] = next.splice(index, 1)
    onChange(next)
    if (removed?.fileUrl) {
      try {
        await requestJson(`/api/manage/upload/file-record?fileUrl=${encodeURIComponent(removed.fileUrl)}`, { method: "DELETE" })
      } catch {
        // File record deletion is best-effort; business form state should stay responsive.
      }
    }
  }

  function handleRemoveClick(event: MouseEvent<HTMLButtonElement>, index: number) {
    event.preventDefault()
    event.stopPropagation()
    removeFile(index)
  }

  return (
    <div className="space-y-3">
      {/* Image lightbox preview */}
      <Dialog open={!!previewImage} onOpenChange={(open) => { if (!open) setPreviewImage(null) }}>
        <DialogContent
          className="z-[10001] max-w-4xl border-0 bg-black/90 p-2"
          overlayClassName="z-[10000] bg-black/60"
          showCloseButton={false}
        >
          <DialogTitle className="sr-only">图片预览</DialogTitle>
          <button
            type="button"
            onClick={() => setPreviewImage(null)}
            className="absolute right-3 top-3 z-10 rounded-full bg-white/20 p-1.5 text-white hover:bg-white/40"
          >
            <X className="h-4 w-4" />
          </button>
          {previewImage ? (
            <img src={previewImage} alt="预览" className="max-h-[80vh] w-full object-contain" />
          ) : null}
        </DialogContent>
      </Dialog>

      {mode === "image" && logoMode ? (
        <div className="space-y-2">
          {value.map((file, index) => (
            <div key={`${file.fileUrl}-${index}`} className="group relative overflow-hidden rounded-md border border-slate-200 bg-slate-50">
              {isImageUrl(file.fileUrl) ? (
                <div className="relative">
                  <img
                    src={file.fileUrl}
                    alt={file.fileName}
                    className="max-h-24 w-auto max-w-full cursor-zoom-in object-contain p-2"
                    onClick={(e) => {
                      const target = e.target as HTMLElement
                      if (!target.closest('button')) {
                        setPreviewImage(file.fileUrl)
                      }
                    }}
                  />
                  {!disabled ? (
                    <button
                      type="button"
                      onClick={(event) => handleRemoveClick(event, index)}
                      className="absolute right-1.5 top-1.5 rounded bg-white/95 p-1 text-slate-500 shadow hover:text-red-600"
                      title="删除"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  ) : null}
                </div>
              ) : (
                <div className="flex items-center gap-2 px-3 py-2 text-xs text-slate-500">
                  <FileText className="h-4 w-4 shrink-0" />
                  <span className="min-w-0 flex-1 truncate">{file.fileName}</span>
                  {!disabled ? (
                    <button
                      type="button"
                      onClick={(event) => handleRemoveClick(event, index)}
                      className="shrink-0 text-slate-400 hover:text-red-600"
                      title="删除"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  ) : null}
                </div>
              )}
            </div>
          ))}
          {(multiple || value.length === 0) && value.length < max && !disabled ? (
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="flex h-10 items-center gap-2 rounded-md border border-dashed border-slate-300 bg-white px-4 text-xs text-slate-500 hover:border-slate-500 hover:text-slate-900"
            >
              {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
              <span>{uploading ? progress || "上传中" : buttonText || "上传图片"}</span>
            </button>
          ) : null}
        </div>
      ) : mode === "image" ? (
        <div className="flex flex-wrap gap-3">
          {value.map((file, index) => (
            <div key={`${file.fileUrl}-${index}`} className="group relative h-28 w-32 overflow-hidden rounded-md border border-slate-200 bg-slate-50">
              {isImageUrl(file.fileUrl) ? (
                <>
                  <img
                    src={file.fileUrl}
                    alt={file.fileName}
                    className="h-full w-full cursor-zoom-in object-cover"
                    onClick={(e) => {
                      const target = e.target as HTMLElement
                      if (!target.closest('button')) {
                        setPreviewImage(file.fileUrl)
                      }
                    }}
                  />
                  {!disabled ? (
                    <button
                      type="button"
                      onClick={(event) => handleRemoveClick(event, index)}
                      className="absolute right-1 top-1 rounded bg-white/95 p-1 text-slate-700 shadow hover:text-red-600"
                      title="删除"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  ) : null}
                </>
              ) : (
                <div className="flex h-full flex-col items-center justify-center gap-1 px-2 text-xs text-slate-500">
                  <FileText className="h-5 w-5" />
                  <span className="line-clamp-2 text-center">{file.fileName}</span>
                </div>
              )}
            </div>
          ))}
          {(multiple || value.length === 0) && value.length < max && !disabled ? (
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className={`${compact ? "h-20 w-24" : "h-28 w-32"} flex flex-col items-center justify-center gap-2 rounded-md border border-dashed border-slate-300 bg-white text-xs text-slate-500 hover:border-slate-500 hover:text-slate-900`}
            >
              {uploading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Upload className="h-5 w-5" />}
              <span>{uploading ? progress || "上传中" : buttonText || "上传图片"}</span>
            </button>
          ) : null}
        </div>
      ) : (
        <div className="space-y-2">
          {value.map((file, index) => (
            <div key={`${file.fileUrl}-${index}`} className="flex items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm">
              <FileText className="h-4 w-4 text-slate-500" />
              <a href={file.fileUrl} target="_blank" rel="noreferrer" className="min-w-0 flex-1 truncate text-slate-700 hover:text-primary">
                {file.fileName}
              </a>
              {!disabled ? (
                <button
                  type="button"
                  onClick={(event) => handleRemoveClick(event, index)}
                  className="text-slate-400 hover:text-red-600"
                  title="删除"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              ) : null}
            </div>
          ))}
          {(multiple || value.length === 0) && value.length < max && !disabled ? (
            <Button type="button" variant="outline" onClick={() => inputRef.current?.click()} disabled={uploading}>
              {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
              {uploading ? progress || "上传中" : buttonText || "上传附件"}
            </Button>
          ) : null}
        </div>
      )}
      <input ref={inputRef} type="file" className="hidden" onChange={(event) => handleUpload(event.target.files)} />
      {error ? <div className="text-xs text-red-600">{error}</div> : null}
    </div>
  )
}

export function ImageUploadField({
  value,
  alt,
  onChange,
  logoMode,
}: {
  value?: string
  alt?: string
  onChange: (value: string) => void
  logoMode?: boolean
}) {
  const files = value ? [{ fileUrl: value, fileName: alt || value }] : []
  return (
    <ManagedUploader value={files} onChange={(next) => onChange(next[0]?.fileUrl ?? "")} mode="image" max={1} buttonText="上传图片" compact={!logoMode} logoMode={logoMode} />
  )
}
