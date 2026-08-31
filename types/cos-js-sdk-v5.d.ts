declare module "cos-js-sdk-v5" {
  type CosAuthorization = {
    TmpSecretId: string
    TmpSecretKey: string
    XCosSecurityToken: string
    ExpiredTime: number
  }

  type CosOptions = {
    getAuthorization: (options: unknown, callback: (data: CosAuthorization) => void) => void
  }

  type PutObjectOptions = {
    Bucket: string
    Region: string
    Key: string
    Body: File | Blob
    Headers?: Record<string, string>
    onProgress?: (data: { percent?: number }) => void
  }

  export default class COS {
    constructor(options: CosOptions)
    putObject(options: PutObjectOptions, callback: (error: Error | null, data: { Location: string }) => void): void
  }
}
