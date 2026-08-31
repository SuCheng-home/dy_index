/**
 * Tailwind v4 面向 Chromium 111+ 输出 CSS，低版本极速内核（360 极速 / 安全浏览器的
 * Chromium 78~103）会因为以下写法拿不到样式。本插件在 Tailwind 之后做降级：
 *
 * 1. @layer（Chromium 99+）：约 9 成产物被包在 @layer 里，旧内核会整块当成未知
 *    at-rule 丢弃，页面几乎没有任何样式 —— 原地展开，顺序不变，层叠结果一致。
 * 2. 逻辑属性（Chromium 87+：padding-inline / margin-block / inset / inline-size 等）：
 *    在原声明前补一份等价的物理长写，旧内核用长写，新内核仍以后面的逻辑属性为准。
 * 3. 独立变换属性（Chromium 104+：translate / rotate / scale）：克隆一份用 transform
 *    合成的规则，包进 `@supports not (translate: 0px)`。新内核该条件为假，整块被忽略，
 *    因此不存在「transform 与独立属性叠加」的风险。
 *
 * 站点是 LTR（zh-CN），因此 inline-start 一律映射为 left；产物里带 [dir=rtl] 的规则
 * 只涉及 rotate，不受该假设影响。
 */

const LOGICAL_MAP = {
  'inset-inline': ['left', 'right'],
  'inset-block': ['top', 'bottom'],
  'inset-inline-start': ['left'],
  'inset-inline-end': ['right'],
  'inset-block-start': ['top'],
  'inset-block-end': ['bottom'],
  'margin-inline': ['margin-left', 'margin-right'],
  'margin-block': ['margin-top', 'margin-bottom'],
  'margin-inline-start': ['margin-left'],
  'margin-inline-end': ['margin-right'],
  'margin-block-start': ['margin-top'],
  'margin-block-end': ['margin-bottom'],
  'padding-inline': ['padding-left', 'padding-right'],
  'padding-block': ['padding-top', 'padding-bottom'],
  'padding-inline-start': ['padding-left'],
  'padding-inline-end': ['padding-right'],
  'padding-block-start': ['padding-top'],
  'padding-block-end': ['padding-bottom'],
  'inline-size': ['width'],
  'block-size': ['height'],
  'min-inline-size': ['min-width'],
  'min-block-size': ['min-height'],
  'max-inline-size': ['max-width'],
  'max-block-size': ['max-height'],
  'border-inline': ['border-left', 'border-right'],
  'border-block': ['border-top', 'border-bottom'],
  'border-inline-start': ['border-left'],
  'border-inline-end': ['border-right'],
  'border-block-start': ['border-top'],
  'border-block-end': ['border-bottom'],
}

for (const suffix of ['width', 'style', 'color']) {
  LOGICAL_MAP[`border-inline-${suffix}`] = [`border-left-${suffix}`, `border-right-${suffix}`]
  LOGICAL_MAP[`border-block-${suffix}`] = [`border-top-${suffix}`, `border-bottom-${suffix}`]
  LOGICAL_MAP[`border-inline-start-${suffix}`] = [`border-left-${suffix}`]
  LOGICAL_MAP[`border-inline-end-${suffix}`] = [`border-right-${suffix}`]
  LOGICAL_MAP[`border-block-start-${suffix}`] = [`border-top-${suffix}`]
  LOGICAL_MAP[`border-block-end-${suffix}`] = [`border-bottom-${suffix}`]
}

const TRANSFORM_PROPS = ['translate', 'rotate', 'scale']
// 所有降级规则共用同一串 transform，各自只写自己的 --legacy-* 变量，
// 这样多个工具类（如 -translate-x-1/2 + hover:scale-105）仍能叠加生效。
const LEGACY_TRANSFORM =
  'translate(var(--legacy-tx), var(--legacy-ty)) rotate(var(--legacy-rotate)) ' +
  'scale(var(--legacy-sx), var(--legacy-sy))'
// 独立变换属性从 Chromium 104 起支持，用它区分新旧内核
const TRANSFORM_GUARD = 'not (translate: 0px)'

/** 按顶层空格切分属性值，忽略 calc()/var() 内部的空格 */
function splitTopLevel(value) {
  const parts = []
  let depth = 0
  let current = ''

  for (const char of value) {
    if (char === '(') depth++
    else if (char === ')') depth--

    if (depth === 0 && /\s/.test(char)) {
      if (current) parts.push(current)
      current = ''
    } else {
      current += char
    }
  }

  if (current) parts.push(current)
  return parts
}

/** inset 简写按 margin 的 1~4 值规则展开 */
function expandInset(parts) {
  const [top, right = top, bottom = top, left = right] = parts
  return [
    ['top', top],
    ['right', right],
    ['bottom', bottom],
    ['left', left],
  ]
}

function flattenLayers(root, stats) {
  for (let pass = 0; pass < 10; pass++) {
    const layers = []
    root.walkAtRules('layer', (atRule) => layers.push(atRule))
    if (layers.length === 0) break

    for (const atRule of layers) {
      if (atRule.nodes) {
        atRule.replaceWith(atRule.nodes)
        stats.layers++
      } else {
        // `@layer components;` 这类声明语句直接删掉
        atRule.remove()
        stats.layerStatements++
      }
    }
  }
}

function downgradeLogicalProps(root, stats) {
  root.walkDecls((decl) => {
    const prop = decl.prop.toLowerCase()

    if (prop === 'inset') {
      for (const [physical, value] of expandInset(splitTopLevel(decl.value))) {
        decl.cloneBefore({ prop: physical, value })
      }
      stats.logical++
      return
    }

    const targets = LOGICAL_MAP[prop]
    if (!targets) return

    // 值个数与目标个数一致时按位拆（padding-block: 1px 2px），
    // 否则整值复制（padding-inline: calc(...) / border-inline: 1px solid red）
    const parts = splitTopLevel(decl.value)
    targets.forEach((physical, index) => {
      const value = targets.length === parts.length ? parts[index] : decl.value
      decl.cloneBefore({ prop: physical, value })
    })
    stats.logical++
  })
}

/** 把同一条规则内声明过的自定义属性回填进值里，用于把 105% 之类的字面量取出来 */
function resolveInRule(rule, value, depth = 0) {
  const match = /^var\(\s*(--[\w-]+)\s*\)$/.exec(value.trim())
  if (!match || depth > 3) return value

  let resolved = null
  rule.each((node) => {
    if (node.type === 'decl' && node.prop === match[1]) resolved = node.value
  })
  return resolved === null ? value : resolveInRule(rule, resolved, depth + 1)
}

/** scale() 在 Chromium 104 之前不接受百分比，需要换算成数字 */
function toScaleNumber(value) {
  const match = /^(-?[\d.]+)%$/.exec(value.trim())
  if (!match) return value
  return String(Number(match[1]) / 100)
}

function isInsideKeyframes(node) {
  for (let parent = node.parent; parent; parent = parent.parent) {
    if (parent.type === 'atrule' && /keyframes$/i.test(parent.name)) return true
  }
  return false
}

function downgradeTransformProps(root, postcss, stats) {
  const targets = []
  root.walkRules((rule) => {
    // @keyframes 内部不能插 @supports，且关键帧里用的是 transform，跳过
    if (isInsideKeyframes(rule)) return
    if (rule.parent && rule.parent.type === 'atrule' && rule.parent.name === 'supports') return
    if (rule.some((node) => node.type === 'decl' && TRANSFORM_PROPS.includes(node.prop.toLowerCase()))) {
      targets.push(rule)
    }
  })

  for (const rule of targets) {
    const legacy = postcss.rule({ selector: rule.selector })

    for (const node of rule.nodes) {
      if (node.type !== 'decl') continue
      const prop = node.prop.toLowerCase()
      if (!TRANSFORM_PROPS.includes(prop)) continue

      const parts = splitTopLevel(node.value)
      if (prop === 'translate') {
        legacy.append({ prop: '--legacy-tx', value: parts[0] || '0' })
        legacy.append({ prop: '--legacy-ty', value: parts[1] || '0' })
      } else if (prop === 'scale') {
        const sx = toScaleNumber(resolveInRule(rule, parts[0] || '1'))
        const sy = toScaleNumber(resolveInRule(rule, parts[1] || parts[0] || '1'))
        legacy.append({ prop: '--legacy-sx', value: sx })
        legacy.append({ prop: '--legacy-sy', value: sy })
      } else {
        legacy.append({ prop: '--legacy-rotate', value: parts[0] || '0deg' })
      }
    }

    if (legacy.nodes.length === 0) continue

    legacy.append({ prop: 'transform', value: LEGACY_TRANSFORM })
    rule.after(postcss.atRule({ name: 'supports', params: TRANSFORM_GUARD, nodes: [legacy] }))
    stats.transforms++
  }

  if (stats.transforms > 0) {
    // 自定义属性会继承，必须像 Tailwind 那样在全局重置一遍，
    // 否则父元素的 --legacy-tx 会漏到只想旋转的子元素上
    const defaults = postcss.rule({ selector: '*, ::before, ::after' })
    defaults.append({ prop: '--legacy-tx', value: '0' })
    defaults.append({ prop: '--legacy-ty', value: '0' })
    defaults.append({ prop: '--legacy-rotate', value: '0deg' })
    defaults.append({ prop: '--legacy-sx', value: '1' })
    defaults.append({ prop: '--legacy-sy', value: '1' })
    root.prepend(postcss.atRule({ name: 'supports', params: TRANSFORM_GUARD, nodes: [defaults] }))
  }
}

export default function postcssLegacyChromium() {
  return {
    postcssPlugin: 'postcss-legacy-chromium',
    OnceExit(root, { postcss }) {
      const stats = { layers: 0, layerStatements: 0, logical: 0, transforms: 0 }

      flattenLayers(root, stats)
      downgradeLogicalProps(root, stats)
      downgradeTransformProps(root, postcss, stats)

      if (process.env.NODE_ENV === 'production') {
        console.log(
          `[legacy-chromium] @layer 展开 ${stats.layers} 块 / 移除声明 ${stats.layerStatements} 条，` +
            `逻辑属性降级 ${stats.logical} 条，变换属性兜底 ${stats.transforms} 条`
        )
      }
    },
  }
}
