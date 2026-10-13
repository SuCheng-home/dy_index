## Capture-Avatar
> 头像拍摄上传

### Attributes
| 名称 | 描述 | 类型 | 必填 | 默认值 |
| --- | --- | --- | --- | --- |
| dialogWidth | 对话框宽度 | [String, Number] | false | 600 |
| captureWdith | 摄像头宽度 | [String, Number] | false | 360 |
| captureHeight | 摄像头高度 | [String, Number] | false | 360 |
| avatarSize | 头像尺寸(1： 1寸 2：2寸) | [String, Number] | false | null |
| imageType | 图片类型 | String | false | jpeg |
| saveHandler | 保存截图的自定义事件。接收一个默认参数 data(拍摄图片对象)， 需要返回一个 Promise。如果 Promise 的状态是 fullfiled，则会自动关闭对话框 | Function | false | null |


### Events
| 名称 | 描述 | 参数 |
| --- | --- | --- |
| close | 对话框关闭事件 | - |
