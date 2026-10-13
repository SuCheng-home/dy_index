<template>
	<el-dialog title="头像拍摄" class="capture-avatar" :visible.sync="dialogVisible" :width="dialogWidth + 'px'" :close-on-click-modal="false" :before-close="handleClose">
		<div class="show-picture">
			<div
				v-if="dialogVisible"
				class="capture-box"
				:style="{
					height: computedHeight + 'px'
				}"
			>
				<transition name="el-fade-in-linear">
					<video v-show="!captured" ref="video" class="picture-video" :width="computedWidth" :height="computedHeight" autoplay></video>
				</transition>
				<transition name="el-fade-in-linear">
					<img v-show="captured" :src="captureUrl" class="picture-canvas" :width="computedWidth" :height="computedHeight" alt="" />
				</transition>
			</div>
			<div class="capture-tool">
				<template v-if="captured">
					<span class="capture-btn re-capture" title="重新拍照" @click="handleCapture"></span>
					<el-button size="mini" type="primary" @click="handleSave">保存</el-button>
				</template>
				<span v-else class="capture-btn" title="拍照" @click="handleCapture"></span>
			</div>
		</div>
	</el-dialog>
</template>

<script>
export default {
	name: 'capture-dialog',
	props: {
		// 对话框宽度
		dialogWidth: {
			type: [String, Number],
			default: 600
		},
		// 摄像头宽度
		captureWdith: {
			type: [String, Number],
			default: 360
		},
		// 摄像头高度
		captureHeight: {
			type: [String, Number],
			default: 360
		},
		// 头像尺寸  1： 1寸 2：2寸
		avatarSize: {
			type: [String, Number],
			default: null
		},
		// 图片类型
		imageType: {
			type: String,
			default: 'jpeg'
		},
		// 保存截图
		saveHandler: {
			type: Function,
			default: null
		}
	},
	data() {
		return {
			dialogVisible: false,
			captured: false,
			showCaptureImage: false,
			MediaStreamTrack: null,
			captureUrl: '', // 截图地址
			captureFile: null, // 截图文件
			sizeConfig: {
				// 1寸
				1: { width: 295, height: 413 },
				// 2寸
				2: { width: 413, height: 626 }
			}
		}
	},
	computed: {
		sized() {
			return this.sizeConfig[this.avatarSize] || null
		},
		computedWidth() {
			if (this.sized) return this.sized.width
			else return this.captureWdith
		},
		computedHeight() {
			if (this.sized) return this.sized.height
			else return this.captureHeight
		}
	},
	created() {
		this.pollfillApi()
	},
	methods: {
		// 兼容处理
		pollfillApi() {
			// 老的浏览器可能根本没有实现 mediaDevices，所以我们可以先设置一个空的对象
			if (navigator.mediaDevices === undefined) {
				console.log('老的浏览器')
				navigator.mediaDevices = {}
			}
			if (navigator.mediaDevices.getUserMedia === undefined) {
				console.log('老的浏览器11')
				navigator.mediaDevices.getUserMedia = function(constraints) {
					// 首先，如果有getUserMedia的话，就获得它
					const getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia
					// 一些浏览器根本没实现它 - 那么就返回一个error到promise的reject来保持一个统一的接口
					if (!getUserMedia) {
						return Promise.reject(new Error('getUserMedia is not implemented in this browser'))
					}
					// 否则，为老的navigator.getUserMedia方法包裹一个Promise
					return new Promise(function(resolve, reject) {
						getUserMedia.call(navigator, constraints, resolve, reject)
					})
				}
			}
		},
		showDialog() {
			this.dialogVisible = true
			this.$nextTick(() => this.initCapture())
		},
		// 摄像头初始化
		initCapture() {
			this.captureUrl = '' // 截图地址
			this.captureFile = null // 截图文件
			this.captured = false
			const constraints = {
				video: { width: this.computedWidth, height: this.computedHeight },
				audio: false
			}
			// 获得video摄像头区域
			const video = this.$refs.video
			navigator.mediaDevices
				.getUserMedia(constraints)
				.then(MediaStream => {
					this.MediaStreamTrack = typeof MediaStream.stop === 'function' ? MediaStream : MediaStream.getTracks()[0]
					// 旧的浏览器可能没有srcObject
					if ('srcObject' in video) {
						video.srcObject = MediaStream
					} else {
						// 防止在新的浏览器里使用它，应为它已经不再支持了
						video.src = window.URL.createObjectURL(MediaStream)
					}
					video.play()
				})
				.catch(err => {
					console.log(err)
					this.$message.error('访问媒体设备失败')
				})
		},
		// 拍照
		handleCapture() {
			if (this.captured) {
				this.initCapture()
				this.captured = false
			} else {
				// 获得Canvas对象
				const canvas = document.createElement('canvas')
				canvas.width = this.computedWidth
				canvas.height = this.computedHeight
				const ctx = canvas.getContext('2d')
				ctx.drawImage(this.$refs.video, 0, 0, this.computedWidth, this.computedHeight)
				this.MediaStreamTrack && this.MediaStreamTrack.stop()
				this.captured = true
				this.$nextTick(() => {
					this.captureUrl = canvas.toDataURL(`image/${this.imageType}`)
					this.captureFile = this.urlToBlob(this.captureUrl, this.imageType)
				})
			}
		},
		// 保存
		async handleSave() {
			try {
				if (this.saveHandler) {
					await this.saveHandler({
						captureUrl: this.captureUrl,
						captureFile: this.captureFile
					})
					this.handleClose()
				}
			} catch (err) {
				console.log(err)
			}
		},
		handleClose() {
			this.$emit('close')
			this.dialogVisible = false
			this.$nextTick(() => {
				this.MediaStreamTrack && this.MediaStreamTrack.stop()
				this.MediaStreamTrack = null
			})
		},
		urlToBlob(dataurl, fileType) {
			const _dataurl = dataurl
				.replace('-', '+')
				.replace('_', '/')
				.split(';base64,')[1] // 以防生成的url字符串不规范
			const raw = window.atob(_dataurl) // 用decodeURIComponent防止base64编码错误
			const rawlength = raw.length
			const uint8array = new Uint8Array(rawlength)
			for (let i = 0; i < rawlength; i++) {
				uint8array[i] = raw.charCodeAt(i)
			}
			const blob = new Blob([uint8array], { type: 'image/' + fileType })
			return blob
		}
	}
}
</script>

<style lang="scss" scoped>
.capture-avatar {
	/deep/ .el-dialog {
		border-radius: 8px;
		overflow: hidden;
	}
	/deep/ .el-dialog__header {
		text-align: center;
		background: #f9fbff;
	}
	/deep/ .el-dialog__body {
		padding: 0;
	}
	.show-picture {
		overflow: hidden;
		text-align: center;
		.capture-box {
			position: relative;
			background-color: #000;
			.picture-video {
				display: block;
				margin: 0 auto;
			}
			.picture-canvas {
				cursor: pointer;
				background-color: #fff;
			}
		}
		.capture-tool {
			position: relative;
			display: flex;
			justify-content: flex-end;
			align-items: center;
			height: 70px;
			padding: 0 20px;
			background: #e5e5e4;
			.el-button {
				width: 80px;
			}
			.capture-btn {
				position: absolute;
				top: 50%;
				left: 50%;
				transform: translate(-50%, -50%);
				width: 58px;
				height: 58px;
				border-radius: 50%;
				cursor: pointer;
				background: url('https://cdnfile-10043692.cos.ap-shanghai.myqcloud.com/productVersion/components/captureAvatar/capture.png') no-repeat center;
				background-size: 100% 100%;
			}
			.re-capture {
				background: url('https://cdnfile-10043692.cos.ap-shanghai.myqcloud.com/productVersion/components/captureAvatar/re-capture.png') no-repeat center;
			}
		}
	}
}
</style>
