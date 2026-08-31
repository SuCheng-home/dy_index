(function () {
  'use strict'

  function defineValue(target, name, value) {
    Object.defineProperty(target, name, {
      configurable: true,
      writable: true,
      value: value,
    })
  }

  function toInteger(value) {
    var number = Number(value)
    if (number !== number || number === 0) return 0
    return number < 0 ? Math.ceil(number) : Math.floor(number)
  }

  function at(index) {
    if (this == null) throw new TypeError('Array.prototype.at called on null or undefined')

    var target = Object(this)
    var length = Math.min(Math.max(toInteger(target.length), 0), 9007199254740991)
    var relativeIndex = toInteger(index)
    var actualIndex = relativeIndex >= 0 ? relativeIndex : length + relativeIndex

    if (actualIndex < 0 || actualIndex >= length) return undefined
    return target[actualIndex]
  }

  if (!Array.prototype.at) defineValue(Array.prototype, 'at', at)

  if (!String.prototype.at) {
    defineValue(String.prototype, 'at', function (index) {
      if (this == null) throw new TypeError('String.prototype.at called on null or undefined')

      var value = String(this)
      var relativeIndex = toInteger(index)
      var actualIndex = relativeIndex >= 0 ? relativeIndex : value.length + relativeIndex

      if (actualIndex < 0 || actualIndex >= value.length) return undefined
      return value.charAt(actualIndex)
    })
  }

  if (!Object.hasOwn) {
    defineValue(Object, 'hasOwn', function (target, property) {
      if (target == null) throw new TypeError('Object.hasOwn called on null or undefined')
      return Object.prototype.hasOwnProperty.call(Object(target), property)
    })
  }

  // replaceChildren 需要 Chromium 86+，低版本极速内核（Chromium 78~85）会在
  // 渲染企业微信登录二维码等容器时抛错。
  var replaceChildren = function () {
    while (this.firstChild) this.removeChild(this.firstChild)
    for (var i = 0; i < arguments.length; i++) {
      var node = arguments[i]
      this.appendChild(typeof node === 'string' ? document.createTextNode(node) : node)
    }
  }

  var nodeHosts = [
    typeof Element !== 'undefined' ? Element.prototype : null,
    typeof Document !== 'undefined' ? Document.prototype : null,
    typeof DocumentFragment !== 'undefined' ? DocumentFragment.prototype : null,
  ]

  for (var hostIndex = 0; hostIndex < nodeHosts.length; hostIndex++) {
    var host = nodeHosts[hostIndex]
    if (host && !host.replaceChildren) defineValue(host, 'replaceChildren', replaceChildren)
  }

  // 入场动画兜底：区块由客户端脚本把 opacity 从 0 改为 1，
  // 若客户端脚本在旧内核上未能执行，页面会只剩首屏、其余全空白。
  // 这里在 load 之后确认未完成 hydration 时取消隐藏，保证内容可读。
  var REVEAL_FALLBACK_DELAY = 2000
  var REVEAL_MATCHERS = [
    '[style="opacity:0"]',
    '[style^="opacity:0;"]',
    '[style*=";opacity:0;"]',
    '[style$=";opacity:0"]',
  ]

  function isHydrated() {
    return document.documentElement.getAttribute('data-hydrated') === '1'
  }

  function removeWhenHydrated(styleNode) {
    var attempts = 0
    var timer = setInterval(function () {
      attempts++
      if (isHydrated()) {
        if (styleNode.parentNode) styleNode.parentNode.removeChild(styleNode)
        clearInterval(timer)
      } else if (attempts > 20) {
        clearInterval(timer)
      }
    }, 500)
  }

  function injectRevealFallback() {
    var head = document.head || document.getElementsByTagName('head')[0]
    if (!head) return

    var css = REVEAL_MATCHERS.join(',') + '{opacity:1 !important;transform:none !important}'
    var style = document.createElement('style')
    style.setAttribute('data-reveal-fallback', '1')
    if (style.styleSheet) {
      style.styleSheet.cssText = css
    } else {
      style.appendChild(document.createTextNode(css))
    }

    head.appendChild(style)
    removeWhenHydrated(style)
  }

  function scheduleRevealFallback() {
    setTimeout(function () {
      if (!isHydrated()) injectRevealFallback()
    }, REVEAL_FALLBACK_DELAY)
  }

  if (window.addEventListener) {
    window.addEventListener('load', scheduleRevealFallback, false)
  } else if (window.attachEvent) {
    window.attachEvent('onload', scheduleRevealFallback)
  } else {
    setTimeout(scheduleRevealFallback, 5000)
  }
})()
