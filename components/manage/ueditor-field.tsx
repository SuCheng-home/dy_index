"use client"

import { useEffect, useRef, useState } from "react"
import { Loader2 } from "lucide-react"

type UEditorInstance = {
  ready: (callback: () => void) => void
  setContent: (value: string) => void
  getContent: () => string
  setHeight: (height: number) => void
  addListener: (event: string, callback: () => void) => void
  destroy?: () => void
}

type UEditorGlobal = {
  getEditor: (id: string, config?: Record<string, unknown>) => UEditorInstance
  delEditor?: (id: string) => void
  registerUI?: (...args: unknown[]) => void
  ui?: {
    Dialog: new (...args: unknown[]) => unknown
    Button: new (...args: unknown[]) => unknown
  }
}

declare global {
  interface Window {
    UE?: UEditorGlobal
    UEDITOR_HOME_URL?: string
    basePath?: string
  }
}

const scriptPromises = new Map<string, Promise<void>>()

function loadScript(src: string, id: string) {
  const existingPromise = scriptPromises.get(src)
  if (existingPromise) return existingPromise

  const promise = new Promise<void>((resolve, reject) => {
    const existing = document.getElementById(id) as HTMLScriptElement | null
    if (existing?.dataset.loaded === "true") {
      resolve()
      return
    }
    if (existing) {
      existing.addEventListener("load", () => resolve(), { once: true })
      existing.addEventListener("error", () => reject(new Error(`加载 ${src} 失败`)), { once: true })
      return
    }

    const script = document.createElement("script")
    script.src = src
    script.id = id
    script.async = false
    script.onload = () => {
      script.dataset.loaded = "true"
      resolve()
    }
    script.onerror = () => reject(new Error(`加载 ${src} 失败`))
    document.head.appendChild(script)
  })
  scriptPromises.set(src, promise)
  return promise
}

function register135Editor(homeUrl: string) {
  const ue = window.UE
  if (!ue?.registerUI || !ue.ui?.Dialog || !ue.ui?.Button) return

  ue.registerUI(
    "135editor",
    (editor: { options?: Record<string, unknown> }, uiName: string) => {
      const dialog = new ue.ui!.Dialog({
        iframeUrl: `${String(editor.options?.UEDITOR_HOME_URL ?? homeUrl)}dialogs/135editor/135EditorDialogPage.html`,
        editor,
        name: uiName,
        title: "此功能用于选择模版样式，内容维护建议在当前编辑器中进行！",
      }) as { fullscreen?: boolean; draggable?: boolean; render?: () => void; open?: () => void }
      dialog.fullscreen = true
      dialog.draggable = false
      return new ue.ui!.Button({
        name: `btn-dialog-${uiName}`,
        className: "edui-for-135editor",
        title: "此功能用于选择模版样式，内容维护建议在当前编辑器中进行！",
        onclick: () => {
          dialog.render?.()
          dialog.open?.()
        },
      })
    },
    undefined,
  )
}

export function UEditorField({
  value,
  onChange,
  height = 420,
}: {
  value: string
  onChange: (value: string) => void
  height?: number
}) {
  const editorIdRef = useRef(`ueditor_${Math.random().toString(36).slice(2)}`)
  const editorRef = useRef<UEditorInstance | null>(null)
  const onChangeRef = useRef(onChange)
  const lastValueRef = useRef(value)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    onChangeRef.current = onChange
  }, [onChange])

  useEffect(() => {
    let disposed = false
    const homeUrl = "/api/manage/ueditor-assets/"
    window.UEDITOR_HOME_URL = homeUrl
    window.basePath = "https://www.zhxiaoyuan.cn/wxcepClient1/"
    try {
      if (window.top) {
        window.top.basePath = "https://www.zhxiaoyuan.cn/wxcepClient1/"
      }
    } catch {
      // Ignore cross-window restrictions in embedded previews.
    }

    async function init() {
      try {
        setError("")
        setLoading(true)
        await loadScript(`${homeUrl}ueditor.config.js`, "ueditor-config-script")
        await loadScript(`${homeUrl}ueditor.all.js`, "ueditor-main-script")
        if (disposed) return
        if (!window.UE) {
          throw new Error("富文本编辑器脚本已加载，但 UE 对象不可用")
        }

        register135Editor(homeUrl)
        window.UE.delEditor?.(editorIdRef.current)
        const editor = window.UE.getEditor(editorIdRef.current, {
          UEDITOR_HOME_URL: homeUrl,
          initialFrameWidth: "100%",
          initialFrameHeight: height,
          autoHeightEnabled: false,
          serverUrl: "https://www.zhxiaoyuan.cn/wxcepClient1/resources/pulg/ueditor1_4_3_3/jsp/controller.jsp",
        })
        editor.ready(() => {
          if (disposed) return
          editorRef.current = editor
          editor.setHeight(height)
          editor.setContent(lastValueRef.current || "")
          editor.addListener("contentChange", () => {
            const next = editor.getContent()
            lastValueRef.current = next
            onChangeRef.current(next)
          })
          setLoading(false)
        })
      } catch (loadError) {
        if (!disposed) {
          setError(loadError instanceof Error ? loadError.message : "富文本编辑器加载失败")
          setLoading(false)
        }
      }
    }

    init()

    return () => {
      disposed = true
      const editor = editorRef.current
      const editorId = editorIdRef.current
      editorRef.current = null
      if (window.UE?.delEditor) {
        window.UE.delEditor(editorId)
      } else if (editor?.destroy) {
        editor.destroy()
      }
    }
  }, [height])

  useEffect(() => {
    if (value === lastValueRef.current) return
    lastValueRef.current = value
    const editor = editorRef.current
    if (editor) {
      editor.setContent(value || "")
    }
  }, [value])

  return (
    <div className="manage-ueditor-field min-w-0 max-w-full space-y-2 overflow-hidden">
      <script id={editorIdRef.current} data-name="content" type="text/plain" />
      {loading ? (
        <div className="flex min-h-[160px] items-center justify-center rounded-md border border-slate-200 bg-slate-50 text-sm text-slate-500">
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          正在加载富文本编辑器…
        </div>
      ) : null}
      {error ? <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div> : null}
      <style jsx global>{`
        .edui-button.edui-for-135editor .edui-button-wrap .edui-button-body .edui-icon {
          background-image: url("https://cdnfile-10043692.file.myqcloud.com/httpsresources/editor-135-icon.png") !important;
          background-size: 85%;
          background-position: center;
          background-repeat: no-repeat;
        }
        .manage-ueditor-field,
        .manage-ueditor-field .edui-editor,
        .manage-ueditor-field .edui-editor-iframeholder {
          width: 100% !important;
          max-width: 100% !important;
          box-sizing: border-box;
        }
        .manage-ueditor-field .edui-editor {
          overflow: hidden;
        }
        .manage-ueditor-field .edui-editor-toolbarbox {
          max-width: 100%;
          overflow: visible;
        }
        .manage-ueditor-field .edui-editor-toolbarboxouter,
        .manage-ueditor-field .edui-editor-toolbarboxinner {
          width: 100% !important;
          white-space: normal !important;
        }
        .manage-ueditor-field .edui-toolbar {
          display: flex !important;
          flex-wrap: wrap !important;
          align-items: center;
          gap: 2px 0;
          width: 100% !important;
          white-space: normal !important;
        }
        .manage-ueditor-field .edui-toolbar .edui-box {
          flex: 0 0 auto;
        }
        .manage-ueditor-field .edui-editor-iframeholder iframe {
          width: 100% !important;
        }
      `}</style>
    </div>
  )
}
