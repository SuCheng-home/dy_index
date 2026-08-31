const BLOCKED_TAGS = /<\/?(?:script|iframe|object|embed|link|meta|base|form|input|button|textarea|select|svg|math|link)(?:\s[\s\S]*?)?>/gi
const EVENT_ATTR = /\s+on[a-z]+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi
const JS_URL_ATTR = /\s(?:href|src|xlink:href|action)\s*=\s*(['"]?)\s*(?:javascript|vbscript|data):[\s\S]*?\1/gi
const SRCDOC_ATTR = /\s+srcdoc\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi
const STYLE_BLOCK = /<style[\s\S]*?>[\s\S]*?<\/style>/gi

export function sanitizeRichHtml(html: string | null | undefined) {
  if (!html) return ""
  return html
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(STYLE_BLOCK, "")
    .replace(BLOCKED_TAGS, "")
    .replace(EVENT_ATTR, "")
    .replace(JS_URL_ATTR, "")
    .replace(SRCDOC_ATTR, "")
}
