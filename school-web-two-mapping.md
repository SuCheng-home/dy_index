# 根目录网站 `schoolWebTwo` 对照关系

## 站点上下文

- 正式环境服务:
  - 登录: `https://www.zhxiaoyuan.cn/ucenter-web/login`
  - 网站接口: `https://www.zhxiaoyuan.cn/wxcepClient1/`
- 目标站点:
  - `schoolId = 7439`
  - `webId = 57`
  - `domainName = sdz.zhxiaoyuan.cn`
  - `templateTypePc = 100001`
  - `templateTypeMb = 100001`
- 鉴权约定:
  - 教师登录 AES 密码加密
  - 结构接口 token 走 query 参数
- 管理态网站上下文:
  - 登录后通过 `POST getSchoolWebSettingBySchoolId` 拉取当前学校网站列表
  - 默认选中 `webId=57`，若列表中不存在则选第一个网站
  - 切换网站只写入管理后台 session，不改变公开前台默认根目录站点
- 公开前台网站上下文:
  - 按旧版 `web-old` 传参方式先调用 `common/schoolWebTwo/getSchoolWebSettingByDomainName?domain=访问域名`
  - 后续公开首页模板使用返回的 `id/templateTypePc`，不在公开调用点硬编码 `webId=57`
  - 本地 `localhost` 预览时兜底到 `SCHOOL_WEB_TWO_PUBLIC_DOMAIN` 或 `sdz.zhxiaoyuan.cn`

## 接口到后台模块

| 接口 | 后台模块 | 说明 |
| --- | --- | --- |
| `getSchoolWebSettingById` / `updateSchoolWebSetting` | 网站设置 | 管理站点名、关键字、域名、Logo、备案、地址 |
| `getSchooWebColumnListByWebId` / `addSchooWebColumn` / `updateSchooWebColumn` / `delSchooWebColumnById` | 一级栏目 | 根目录一级菜单 |
| `getSchoolWebModuleListByColumnId` / `addSchoolWebModule` / `updateSchoolWebModule` / `delSchoolWebModuleById` | 二级模块 | 一级栏目下的二级菜单 |
| `getSchoolWebModuleMessageList` / `getSchoolWebModuleMessageById` / `addSchoolWebModuleMessage` / `updateSchoolWebModuleMessage` | 模块消息 | 模块列表内容与详情页内容 |
| `updateSchoolWebModuleMessageTop` / `batchSchoolWebModuleMessage` / `moveSchoolWebModuleMessage` / `delSchoolWebModuleMessageByIds` | 消息扩展操作 | 置顶、审批、移动、批量删除 |
| `getSchoolWebSuspendMessageList` / `addSchoolWebSuspendMessage` / `updateSchoolWebSuspendMessage` | 悬浮消息 | 后台悬浮消息维护 |
| `getSchoolWebLetterBoxList` / `updateSchoolWebLetterBox` | 校长信箱 | 留言列表与回复 |
| `getWebAccessNumberList` | 访问统计 | 按日期趋势折线图 |
| `getSchoolWebTemplatePcTw` / `addAndUpdateSchoolWebTemplatePcTw` | PC 模板 JSON | 直接编辑原始模板 |
| `getSchoolWebTemplateMbTw` / `addAndUpdateSchoolWebTemplateMbTw` | 移动端模板 JSON | 直接编辑原始模板 |
| `addSchoolWebSetting` / `getSchoolWebSettingBySchoolId` / `delSchoolWebSettingById` | 网站设置补充 | 新增站点、按学校读取站点、删除当前站点 |
| `getSchoolWebModuleListByWebId` / `getSchoolWebModuleList` | 模块辅助查询 | 全站模块、当前创建人模块 |
| `getSchoolWebColumnAndMessageUrlListByWebId` | URL 资源 | URL 型栏目和消息候选资源 |
| `getModuleMessageListByModuleId` / `getSchoolWebCreateUserMessageList` | 消息辅助查询 | 按模块直接查消息、当前创建人消息列表 |
| `delSchoolWebSuspendMessageByIds` / `getSchoolWebSuspendMessageListByTime` | 悬浮消息补充 | 批量删除、公开有效悬浮消息 |
| `getPublicSchoolWebLetterBoxList` / `getSchoolWebLetterBoxById` | 校长信箱补充 | 公开信箱列表、信箱详情 |
| `getSchoolWebTemplatePc` / `addAndUpdateSchoolWebTemplatePc` | 普通 PC 模板 JSON | 版本一 PC 模板原始 JSON |
| `getSchoolWebTemplateMb` / `addAndUpdateSchoolWebTemplateMb` | 普通移动端模板 JSON | 版本一移动端模板原始 JSON |

## 内部管理接口补齐

| 内部接口 | 对应远端接口 | 页面入口 |
| --- | --- | --- |
| `POST /api/manage/site-setting` | `addSchoolWebSetting` | 网站设置 / 调用新增网站设置 |
| `GET /api/manage/site-setting/list` | `getSchoolWebSettingBySchoolId` | 网站设置 / 网站下拉 |
| `PATCH /api/manage/site-setting/select` | `getSchoolWebSettingById` | 网站设置 / 切换当前管理网站 |
| `GET /api/manage/auth/session` | 本地 cookie session | Header / 当前教师姓名 |
| `DELETE /api/manage/site-setting` | `delSchoolWebSettingById` | 网站设置 / 删除当前网站 |
| `GET /api/manage/site-setting/by-school` | `getSchoolWebSettingBySchoolId` | 接口补全 / 站点按校查询 |
| `GET /api/manage/modules/by-web` | `getSchoolWebModuleListByWebId` | 接口补全 / 模块查询 |
| `GET /api/manage/modules/creator` | `getSchoolWebModuleList` | 接口补全 / 模块查询 |
| `GET /api/manage/modules/url-resources` | `getSchoolWebColumnAndMessageUrlListByWebId` | 接口补全 / 模块查询 |
| `GET /api/manage/messages/by-module` | `getModuleMessageListByModuleId` | 接口补全 / 消息查询 |
| `GET /api/manage/messages/creator` | `getSchoolWebCreateUserMessageList` | 接口补全 / 消息查询 |
| `POST /api/manage/suspend-messages/batch-delete` | `delSchoolWebSuspendMessageByIds` | 悬浮消息 / 批量删除 |
| `GET /api/manage/suspend-messages/public` | `getSchoolWebSuspendMessageListByTime` | 接口补全 / 公开接口 |
| `GET /api/manage/letterbox/public` | `getPublicSchoolWebLetterBoxList` | 接口补全 / 公开接口 |
| `GET/PATCH /api/manage/templates/pc` | `getSchoolWebTemplatePc` / `addAndUpdateSchoolWebTemplatePc` | 接口补全 / 普通模板 |
| `GET/PATCH /api/manage/templates/mb` | `getSchoolWebTemplateMb` / `addAndUpdateSchoolWebTemplateMb` | 接口补全 / 普通模板 |

## 接口到前台路由

| 前台路由 | 数据来源 | 当前真实样本 |
| --- | --- | --- |
| `/` | `getSchoolWebSettingByDomainName(domain)` + `getSchoolWebTemplatePcHome(webId, templateType)` | `sdz.zhxiaoyuan.cn -> webId=57` |
| `/news` | 首页模板首个一级栏目首个模块的消息列表 | 一级栏目 `592`，模块 `1139` |
| `/news/[id]` | `getSchoolWebModuleMessageById` + `getLastAndNextSchoolMessage` | `69849` |
| `/site/[columnId]` | `getSchooWebColumnById` + `getSchoolWebModuleListByColumnId` | `593` 学校概况 |
| `/site/[columnId]/[moduleId]` | `getSchoolWebModuleById` + `getSchoolWebModuleMessageList` | `593/1142` 学校简介 |
| `/site/message/[messageId]` | `getSchoolWebModuleMessageById` | `69849` |

## 公开主站数据约束

- 主站公开页的后台驱动内容均来自 `common/schoolWebTwo/*` 免鉴权接口，包括站点设置、首页模板、一级菜单、二级菜单、栏目详情、模块详情、模块消息列表和消息详情。
- Header 导航和页面侧栏优先尝试实时栏目接口：`getSchooWebColumnListByWebId(webId)` 读取一级栏目，再逐个调用 `getSchoolWebModuleListByColumnId(columnId)` 读取二级模块。
- 当前目标站的 `common/schoolWebTwo/getSchooWebColumnListByWebId` 可能返回 404；失败或空数组时按旧版首页模板接口 `getSchoolWebTemplatePcHome.columnList` 兜底，不调用后台 token 或 `structure` 接口。
- 模块消息列表传参按旧版保持 `pageNo/pageSize/moduleId`，不额外拼接固定 `webId/schoolId`。
- 浏览器侧 Header 会请求内部代理 `GET /api/public/navigation?domain=当前域名`，F12 Network 中应观察该请求；接口返回 `data.source` 标识当前使用 `common`、`template` 或 `empty` 数据源。
- `requestSchoolWeb` 的公开请求使用 `cache: "no-store"`，不依赖 Next fetch 缓存。
- 已移除主站 `localStorage` 配置缓存入口；`lib/root-site-config.ts` 仅保留类型定义，不再导出默认静态栏目树。
- 真实接口约束不覆盖纯展示型视觉模块；“流金岁月-回忆篇”、办学特色、校园风采、校长致辞、页脚视觉信息等保持原有展示样式和本地视觉资源。
- 展示型模块内如有链接，应优先指向真实 `/site/[columnId]` 或 `/site/[columnId]/[moduleId]` 路由。

## 当前真实栏目映射

| 一级栏目 ID | 一级栏目名称 | 二级模块样本 |
| --- | --- | --- |
| `592` | 新闻中心 | `1139 校园新闻`、`1140 通知公告`、`1141 公共信息` |
| `593` | 学校概况 | `1142 学校简介`、`1144 名师风采`、`1145 校史长廊` |
| `594` | 学生发展 | `1147 校园之星`、`1148 国旗下讲话` |
| `595` | 教学工作 | `1149 教研组之窗` |
| `596` | 教育科研 | `1150 大成教育`、`1151 课题研究`、`1152 教研通讯`、`1153 教师发展` |
| `598` | 招生服务 | `1154 招生招聘` |
| `599` | 社团专栏 | `1155 方案计划` |
| `600` | 党建工作 | `1156 党务公开` |
| `601` | 教工之家 | 暂无模块 |
| `602` | 国际交流 | 暂无模块 |
| `603` | 挂牌督导 | 暂无模块 |

## 当前真实消息样本

- 模块 `1139 校园新闻`
  - `69849` 双高合作|天工开物 探寻中华造物之美
  - `69850` 省丹中举行2024年度“大成青年”表彰暨文化艺术节展演
- 模块 `1140 通知公告`
  - `69893` 第五期“青少年信息学奥林匹克竞赛培训班”学员选拔方案
- 模块 `1154 招生招聘`
  - `69851` 江苏省丹阳高级中学2025年公开招聘优秀青年人才公告

## 实施结论

- 一级菜单应直接使用真实 `column`，不再兼容仓库中旧的 `/about`、`/party`、`/teaching` 等手写静态栏目树。
- 二级菜单应直接使用真实 `module`，根据 `type` 决定展示型、列表型、图片型或外链型渲染。
- 详情页正文必须保留后台 HTML 和 inline style，仅做响应式容器包裹。
