(function () {
  'use strict'

  var ua = navigator.userAgent || ''
  var isTridentUA = ua.indexOf('MSIE ') > -1 || ua.indexOf('Trident/') > -1
  var isIEDocumentMode = typeof document.documentMode !== 'undefined'

  if (!isTridentUA && !isIEDocumentMode) return

  var body = document.body
  if (!body) return

  var children = body.childNodes
  for (var i = 0; i < children.length; i++) {
    var node = children[i]
    if (node.nodeType === 1 && node.tagName !== 'SCRIPT' && node.style) {
      node.style.display = 'none'
    }
  }

  body.style.background = '#FDFBF7'
  body.style.margin = '0'

  var notice = document.createElement('div')
  notice.style.cssText =
    'margin:0 auto;padding:80px 24px;max-width:640px;text-align:center;' +
    'font-family:"Microsoft YaHei",SimSun,sans-serif;color:#1F2937;line-height:1.9'
  notice.innerHTML =
    '<div style="font-size:26px;font-weight:bold;color:#1D4E89;margin-bottom:24px">江苏省丹阳高级中学</div>' +
    '<div style="font-size:18px;font-weight:bold;margin-bottom:16px">当前浏览器处于「兼容模式」（IE 内核），无法正常显示本站</div>' +
    '<div style="font-size:15px;text-align:left;display:inline-block">' +
    '<div style="margin-bottom:10px">请按以下任一方式访问：</div>' +
    '<div style="margin-bottom:8px">1. 360 浏览器用户：点击地址栏右侧的内核切换图标（闪电 / e 字样），选择「极速模式」，然后刷新页面。</div>' +
    '<div style="margin-bottom:8px">2. 使用 Chrome、Edge 或新版 360 浏览器打开本站。</div>' +
    '</div>'

  body.appendChild(notice)
  document.title = '请切换到极速模式浏览本站 - 江苏省丹阳高级中学'
})()
