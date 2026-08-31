"use client"

import { useEffect } from "react"

/**
 * 在 hydration 完成后给 <html> 打标，供 /legacy-browser-polyfills.js 判断
 * 客户端脚本是否正常执行；未打标时该脚本会取消入场动画的隐藏状态。
 */
export function HydrationBeacon() {
  useEffect(() => {
    document.documentElement.setAttribute("data-hydrated", "1")
  }, [])

  return null
}
