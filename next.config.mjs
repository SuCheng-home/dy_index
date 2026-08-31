/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
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
  async headers() {
    return [
      {
        // 双核浏览器在读取 head 中的 meta 之前就要决定内核，这里再用响应头声明一次
        source: "/:path*",
        headers: [
          {
            key: "X-UA-Compatible",
            value: "IE=edge,chrome=1",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
        ],
      },
    ]
  },
}

export default nextConfig
