<template>
	<div class="file_box_wrap clearfix">
		<template v-if="multiple || value.length === 0">
			<span v-if="isShowProgress">{{ progress }}</span>
			<div v-if="showMode === 'button' && !isShowProgress && !disabled">
				<label class="upload-btn">
					上传
					<input type="file" ref="imgUpload" multiple @change="upload" style="display:none;" size="small" />
				</label>
			</div>
		</template>

		<template v-if="value.length !== 0">
			<div class="upload-list-container" v-if="showResult === 'list'">
				<div :class="['upload-file-item', !disabled ? 'upload-file-item--active' : '']" :key="index" v-for="(item, index) in value">
					<div class="img_box" :class="`${getImgType(item.fileName)}-icon`"></div>

					<div class="file_title" v-if="item.fileName">
						<a :href="item.fileUrl || item.accessUrl" download="">
							{{ item.fileName | getFileName }}
						</a>
					</div>

					<div v-if="!disabled" class="icon--success"></div>
					<div v-if="!disabled" class="icon--del" title="删除" @click="deleteItem(index)"></div>
				</div>
			</div>

			<div class="upload-block-container clearfix" v-else-if="showResult === 'image' || showMode === 'cover'">
				<div v-if="progressShow">{{ progress }}</div>
				<div class="upload-file-item" :key="index" v-for="(item, index) in value">
					<img :src="getImgCover(item.fileUrl)" alt="" />
					<div class="file-name" v-if="item.fileName">{{ item.fileName | getFileName }}</div>
					<i v-if="!disabled && showMode !== 'cover'" class="icon--block-del" title="删除" @click="deleteItem(index)"></i>
					<label class="upload-mask" for="imgUpload" v-if="showMode === 'cover' && showModeCover"></label>
				</div>
			</div>
		</template>

		<label class="img-uploader" v-if="(showModeCover || multiple || value.length === 0) && (showMode === 'image' || showMode === 'cover')" :class="showModeCover == true ? 'img-upload-cover' : ''">
			<span>+</span>
			<input type="file" id="imgUpload" name="img-upload" :disabled="disabled" ref="imgUpload" multiple @change="upload" style="display:none;" size="small" />
		</label>
	</div>
</template>

<script>
//腾讯云 COS JS SDK（XML API）
import Cos from 'cos-js-sdk-v5'
//获取签名等信息
import { getWxCosFileSign } from '@/api/common/common'
import _ from 'lodash'

export default {
	name: 'WebUploader',
	props: {
		picOperationRule: {
			type: String,
			default: 'imageMogr2/thumbnail/640x/'
		},
		pathPrefix: {
			type: String,
			default: 'uploadFiles'
		}, //路径前缀（相当于模块名称）
		successCallback: {
			type: Function,
			default: function() {}
		},
		value: {
			type: Array,
			default: function() {
				return []
			}
		},
		multiple: {
			type: Boolean,
			default: false
		}, //多图
		showResult: {
			type: String,
			default: 'list'
		},
		showMode: {
			type: String,
			default: 'button'
		},
		showModeCover: {
			type: Boolean,
			default: false
		},
		disabled: {
			type: Boolean,
			default: false
		},
		mode: {
			type: String,
			default: 'pic'
		},
		deleteFlag: {
			type: Boolean,
			default: false
		},
		isDeleteCosUrl: {
			type: Boolean,
			default: true
		},
		extList: {
			type: Array,
			default: function() {
				return ['mp4', 'flv', 'mpeg', 'wmv']
			}
		} //文件格式
	},
	filters: {
		getFileName(value) {
			const arr = value.split('/')
			return arr[arr.length - 1]
		}
	},
	data() {
		return {
			cos: null,
			isShowProgress: false,
			progress: 0,
			progressShow: false,
			files: [],
			bucket: '', // 存储桶名称，需修改
			region: 'ap-shanghai'
		}
	},
	mounted() {
		//以上主要是做初始化，初始化成功即可使用腾讯云cos上传（yjx可能描述不是很准确大致）
		//获取签名等信息
		getWxCosFileSign()
			.then(res => res.data)
			.then(data => {
				if (data.result) {
					const pageData = JSON.parse(data.data)
					this.bucket = pageData.bucketName
					//实例化COS对象
				
					//实例化COS对象
                        if(this.bucket=='wxtestfile-1251008840'||this.bucket=='wxcepfile-1251008840'){
                            this.cos = new COS({
                            Domain:global.command === 'production' ?'cos.zhxiaoyuan.cn':'cos.weixiaojia.net',
                            // 必选参数
                            getAuthorization: function (options, callback) {
                                callback({
                                    TmpSecretId: pageData.credentials.tmpSecretId,// 你的固定密钥SecretId，需修改
                                    TmpSecretKey: pageData.credentials.tmpSecretKey,// 你的固定密钥SecretKey，需修改
                                    XCosSecurityToken: pageData.credentials.sessionToken,
                                    ExpiredTime: pageData.expiredTime
                                });
                            }
                        });
                        }else{
                            this.cos = new COS({
                            // 必选参数
                            getAuthorization: function (options, callback) {
                                callback({
                                    TmpSecretId: pageData.credentials.tmpSecretId,// 你的固定密钥SecretId，需修改
                                    TmpSecretKey: pageData.credentials.tmpSecretKey,// 你的固定密钥SecretKey，需修改
                                    XCosSecurityToken: pageData.credentials.sessionToken,
                                    ExpiredTime: pageData.expiredTime
                                });
                            }
                        });
                        }
				} else {
					this.$message.error(data.msg)
				}
			})
	},
	methods: {
		getImgCover(rawUrl) {
			const url = rawUrl.indexOf('?') !== -1 ? rawUrl.slice(0, rawUrl.indexOf('?')) : rawUrl
			const fileExt = url.replace(/.+\./, '').toLowerCase() //正则表达式获取后缀
			let cover = ''
			switch (fileExt) {
				case 'mp4':
				case 'flv':
				case 'mpeg':
				case 'wmv':
					cover = require('../../assets/images/common/video-default-cover.png')
					break
				case 'png':
				case 'bmp':
				case 'jpg':
				case 'jpeg':
				case 'gif':
					cover = url
					break
				default:
					cover = url
					break
			}
			return cover
		},
		getImgType(url) {
			const videoTypes = ['mp4', '3gp', 'rmvb', 'rm', 'mov', 'avi', 'flv', 'mpeg', 'wmv']
			const picTypes = ['png', 'bmp', 'jpg', 'jpeg', 'gif']
			url = url || ''
			// 图片等返回url，其他的返回对应的文件类型的图标和类型
			const fileExt = url.replace(/.+\./, '').toLowerCase() //正则表达式获取后缀
			let cover = ''
			if (videoTypes.indexOf(fileExt) > -1) {
				cover = 'mp4'
			} else if (picTypes.indexOf(fileExt) > -1) {
				cover = 'pic'
			} else {
				cover = fileExt
			}
			return cover // 返回文件类型对应的图片class
		},
		deleteItem(index) {
			const path = (this.value[index].fileUrl || this.value[index].accessUrl).replace(/\.picsh\./, '.cos.ap-shanghai.')
			let Key = path.slice(path.indexOf('myqcloud.com') + 13)
			if (this.isDeleteCosUrl) {
				//加一个外部删除
				if (this.deleteFlag) {
					this.$emit('outDelete', {
						deleteIndex: index,
						value: this.value
					})
					return false
				}
				this.cos.deleteObject(
					{
						Bucket: this.bucket,
						Region: this.region,
						Key: window.decodeURI(Key)
					},
					(err, data) => {
						if (err) {
							this.$message.error(err)
						} else {
							this.value.splice(index, 1)
							console.log(this.value)
							this.$emit('delete', {
								deleteIndex: index,
								value: this.value
							})
						}
					}
				)
			} else {
				this.value.splice(index, 1)
				this.$emit('delete', {
					deleteIndex: index,
					value: this.value
				})
			}
		},
		upload(event) {
			//多图或多文件同时上传取第一个
			const file = this.$refs.imgUpload.files[0]
			const fileExt = file.name.replace(/.+\./, '').toLowerCase() //正则表达式获取后缀
			if (this.extList.indexOf(fileExt) === -1) {
				this.$message({
					message: `请上传后缀名为[${this.extList.join(', ')}]的文件`,
					type: 'error'
				})
			} else {
				//格式正确
				this.progressShow = true
				const timestamp = new Date().valueOf()
				let Key = ''
				let isPic = false
				if (/(jpe?g|png|bmp|gif)$/.test(fileExt)) {
					isPic = true
					Key = `/${this.pathPrefix}/${timestamp}/${timestamp}${('' + _.random(1, 100000)).padStart(6, '0')}.${fileExt}`
				} else {
					Key = `/${this.pathPrefix}/${timestamp}/${file.name}`
				}
				//上传对象
				const putObjectArgs = {
					Bucket: this.bucket,
					Region: this.region,
					Key,
					Body: file,
					onTaskReady(taskId) {},
					onProgress: progressData => {
						this.progress = `${progressData.percent * 100}%`
					},
					Headers: {}
				}
				if (isPic && this.picOperationRule) {
					putObjectArgs.Headers['Pic-Operations'] = `{"is_pic_info": 1, "rules": [{"fileid": "${Key}", "rule": "${this.picOperationRule}"}]}`
				}
				this.cos.putObject(putObjectArgs, (err, data) => {
					if (err) {
						this.$message.error(err.error)
					} else {
						this.progressShow = false
						let fileUrl = `https://${data.Location}`
						if (/\.(jpe?g|png|bmp|gif)$/.test(fileUrl)) {
							fileUrl = fileUrl.replace(/\.cos\.ap-.+?\./, '\.picsh\.')
						}

						const fileObj = {
							fileUrl,
							fileName: file.name,
							id: ''
						}
						//加一个外部新增
						if (this.deleteFlag) {
							this.value.splice(0, this.value.length)
							this.value.push(fileObj)
							this.$emit('outInput', this.value)
							return false
						}
						// if (this.showMode !== 'cover') {
						// 	this.value.push(fileObj)
						// } else {
						// 	this.value.splice(0, this.value.length)
						// 	this.value.push(fileObj)
						// }

						this.value.push(fileObj)

						this.successCallback(fileObj)
						this.$emit('input', this.value)
						console.log(this.value, '123')
					}
				})
				event.target.value = ''
			}
			return false
		}
	}
}
</script>

<style lang="scss">
.upload-mask {
	position: absolute;
	left: 0;
	right: 0;
	top: 0;
	bottom: 0;
}

.img-uploader {
	text-align: center;
	line-height: 70px;
	font-size: 30px;
	color: #ccc;
	width: 70px;
	height: 70px;
	display: block;
	float: left;
	margin: 0 1% 0 0;
	border: 1px dashed #ccc;
	// background-position: center center;
	// background-size: cover;
	// background-image: url(../../assets/images/common/upload_img.png);
}

.upload-btn {
	padding: 10px 20px;
	font-size: 14px;
	border-radius: 4px;
	color: #fff;
	background-color: #409eff;
	border-color: #409eff;
	display: inline-block;
	line-height: 1;
	white-space: nowrap;
	cursor: pointer;
	-webkit-appearance: none;
	text-align: center;
	-webkit-box-sizing: border-box;
	box-sizing: border-box;
	outline: 0;
	margin: 0;
	-webkit-transition: 0.1s;
	transition: 0.1s;
	font-weight: 500;
}

.upload-list-container {
	overflow: hidden;
	margin-top: 5px;
	margin-bottom: 10px;

	.upload-file-item {
		width: 100%;
		height: 26px;
		line-height: 26px;
		margin-top: 5px;
		display: flex;

		.img_box {
			width: 24px;
			height: 24px;
			margin: 1px;
			background: url('https://cdnfile-10043692.file.myqcloud.com/file-icons.png') no-repeat;
			background-position: 0 -86px;
			background-size: 68px 680px;
		}

		.file_title {
			max-width: 580px;
			margin-left: 5px;
			overflow: hidden;
			white-space: nowrap;
			text-overflow: ellipsis;
			word-wrap: break-word;
		}

		.icon--success {
			width: 24px;
			height: 24px;
			margin: 1px;
			background: url(../../assets/images/common/success.png) no-repeat;
			background-position: center center;
			background-size: 15px;
		}

		.icon--del {
			background: url(../../assets/images/common/close.png) no-repeat;
			width: 24px;
			height: 16px;
			background-position: center -7px;
			background-size: 10px;
			display: none;
		}

		.ppt-icon {
			background-position: 0 0;
		}

		.pptx-icon {
			background-position: 0 0;
		}

		.mp4-icon {
			background-position: 0 -43px;
		}

		.zip-icon {
			background-position: 0 -129px;
		}

		.rar-icon {
			background-position: 0 -129px;
		}

		.pic-icon {
			background-position: 0 -258.5px;
		}

		.doc-icon {
			background-position: 0 -301.5px;
		}

		.docx-icon {
			background-position: 0 -301.5px;
		}

		.xls-icon {
			background-position: 0 -344.5px;
		}

		.xlsx-icon {
			background-position: 0 -344.5px;
		}

		.pdf-icon {
			background-position: 0 -387.5px;
		}

		.txt-icon {
			background-position: 0 -430.5px;
		}

		.mp3-icon {
			background-position: 0 -474px;
		}
	}

	.upload-file-item--active {
		cursor: pointer;

		&:hover {
			.file_title {
				color: #409eff;
			}

			.icon--success {
				display: none;
			}

			.icon--del {
				display: block;
			}
		}
	}
}

.upload-block-container {
	float: left;

	.upload-file-item {
		float: left;
		position: relative;
		width: 90px;
		height: 110px;
		margin-right: 10px;
		overflow: hidden;

		img {
			display: block;
			width: 80px;
			height: 80px;
			margin: 0 5px 5px;
		}

		div {
			height: 20px;
			line-height: 20px;
			margin: 0 5px;
			overflow: hidden;
			white-space: nowrap;
			text-overflow: ellipsis;
		}

		.icon--block-del {
			position: absolute;
			top: 0;
			right: 0;
			width: 24px;
			height: 24px;
			display: block;
			background-size: cover;
			background-position: center center;
			background-image: url(../../assets/images/common/wxcep_phone_close.png);
			cursor: pointer;
		}
	}
}

.img-upload-cover {
	display: none !important;
}
</style>
