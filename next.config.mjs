/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "http",
        hostname: "**.myqcloud.com",
      },
      {
        protocol: "https",
        hostname: "**.myqcloud.com",
      },
      {
        protocol: "https",
        hostname: "wx.qlogo.cn",
      },
      {
        protocol: "https",
        hostname: "cos.zhxiaoyuan.cn",
      },
      {
        protocol: "https",
        hostname: "wework.qpic.cn",
      },
      {
        protocol: "http",
        hostname: "cdnfile-10043692.file.myqcloud.com",
      },
    ],
  },
}

export default nextConfig
