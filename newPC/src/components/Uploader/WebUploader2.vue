<template>
    <div>
        <div v-if="resultMode === 'image'" class="upload-block-container">
            <div class="upload-file-item" :key="index" v-for="(item, index) in value">
                <img :src="getImgCover(item.fileUrl)" alt=""/>
                <el-tooltip class="item" effect="dark" :content="item.fileName" placement="top" v-if="item.fileName">
                    <div class="file-name">
                        {{ item.fileName }}
                    </div>
                </el-tooltip>
                <i class="icon--block-delete" v-if="useDelete" title="删除" @click="deleteItem(index)"></i>
            </div>
        </div>
        <label v-if="buttonMode === 'image'" :class="['img-upload']" :for="fileInputId"
               :style="{ backgroundImage: `url(${imageButtonUrl || require('../../assets/images/common/upload_img.png')})` }"></label>
        <label v-if="buttonMode === 'button'" :for="fileInputId"
               :class="[resultMode === 'image' ? 'button--image' : '']" type="primary" class="upload-btn">{{ buttonText
            }}</label>
        <input type="file" :id="fileInputId" name="file-input" class="file-input" :ref="fileInputId"
               :multiple="multiple" @change="uploadFunc" :accept="accept"/>
        <div v-if="resultMode === 'list'" class="upload-list-container">
            <div :class="['upload-file-item', 'upload-file-item--active']" :key="index" v-for="(item, index) in value">
                <div class="img_box" :class="`${getImgType(item.fileName || item.fileUrl)}-icon`"></div>
                <div class="file-title" v-if="item.fileName || item.fileUrl">
                    <span v-if="!downloadable">
                        {{ item.fileName ? item.fileName : item.fileUrl.slice(item.fileUrl.lastIndexOf('/') + 1) }}
                    </span>
                    <a v-else :href="item.fileUrl" target="_blank">
                        {{ item.fileName ? item.fileName : item.fileUrl.slice(item.fileUrl.lastIndexOf('/') + 1) }}
                    </a>
                </div>
                <div class="icon--success"  v-if="useSuccessIcon"></div>
                <div v-if="useDelete" class="icon--delete" title="删除" @click="deleteItem(index)"></div>
            </div>
        </div>
    </div>
</template>

<script>
    import CosUploader from '@/utils/CosUploader'
    import _ from 'lodash';

    export default {
        name: 'WebUploader2',
        data() {
            return {
                cos: null,
                fileInputId: `fileInput_${_.random(1, 100000, false)}`

            }
        },
        filters: {
            getFileName(value) {
                const arr = value.split('/')
                return arr[arr.length - 1]
            }
        },
        props: {
            value: {
                type: Array,
                required: true
            },
            multiple: {
                type: Boolean,
                default: false
            },
            resultMode: {
                type: String,
                default: 'image'
            },
            buttonMode: {
                type: String,
                default: 'image'
            },
            buttonText: {
                type: String,
                default: '上传'
            },
            imageButtonUrl: {
                type: String,
                default: ''
            },
            useDelete: {
                type: Boolean,
                default: true
            },
            extList: {
                type: Array,
                default: function () {
                    return []
                }
            },
            successCallback: {
                type: Function,
                default: function () {
                }
            },
            successAllCallback: {
                type: Function,
                default: function () {
                }
            },
            deleteCallback: {
                type: Function,
                default: function () {
                }
            },
            useDeleteCosUrl: {
                type: Boolean,
                default: true
            },
            picOperationRule: {
                type: String,
                default: ''
            },
            accept: {
                type: String,
                default: 'image/*'
            },
            useForceAll: {
                type: Boolean,
                default: false
            },
            pathPrefix: {
                type: String,
                default: ''
            },
            downloadable: {
                type: Boolean,
                default: false
            },
            useSuccessIcon: {
                type: Boolean,
                default: false
            },
            onlyDisplay: {
                type: Boolean,
                default: false
            },
            module: {
                type: String,
                default: ''
            },
            moduleCode: {
                type: String,
                default: ''
            }
        },
        mounted() {
            // 初始化
            if(!this.onlyDisplay) {
                this.cos = new CosUploader(this.pathPrefix, true, true, this.module, this.moduleCode, 1);
                this.cos.init();
            }

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
                    case 'xls':
                    case 'xlsx':
                        cover = 'https://cdnfile-10043692.file.myqcloud.com/admin/images/upload/excle.png'
                        break
                    case 'pdf':
                        cover = 'https://cdnfile-10043692.file.myqcloud.com/admin/images/upload/pdf.png'
                        break
                    case 'ppt':
                    case 'pptx':
                        cover = 'https://cdnfile-10043692.file.myqcloud.com/admin/images/upload/ppt.png'
                        break
                    case 'doc':
                    case 'docx':
                        cover = 'https://cdnfile-10043692.file.myqcloud.com/admin/images/upload/word.png'
                        break
                    case 'mp3':
                        cover = 'https://cdnfile-10043692.cos.ap-shanghai.myqcloud.com/voice-icon2.png'
                        break
                    default:
                        cover = rawUrl
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
            uploadFunc() {
                let fileList = this.$refs[this.fileInputId].files
                let isValid = true
                for (let index = 0; index < fileList.length; index++) {
                    const file = fileList[index]
                    if (isValid) {
                        const fileExt = file.name.replace(/.+\./, '').toLowerCase()
                        if (this.extList.length !== 0 && !this.extList.includes(fileExt) && !this.useForceAll) {
                            this.$message({
                                message: `请上传后缀名为[${this.extList.join(', ')}]的文件`,
                                type: 'error'
                            })
                            isValid = false
                        }
                    }
                }
                if (this.useForceAll) {
                    fileList = fileList.filter(file => {
                        const fileExt = file.name.replace(/.+\./, '').toLowerCase()
                        return this.length === 0 || this.extList.includes(fileExt)
                    })
                    if (fileList.length === 0) {
                        this.$message({
                            message: `请上传后缀名为[${this.extList.join(', ')}]的文件`,
                            type: 'error'
                        })
                        isValid = false
                    }
                }
                if (isValid) {
                    const uploadFuncList = []
                    for (let index = 0; index < fileList.length; index++) {
                        const file = fileList[index]
                        uploadFuncList.push(this.cos.upload(file, this.picOperationRule))
                    }
                    Promise.all(uploadFuncList)
                        .then(dataList => {
                            dataList.forEach((data, index) => {
                                let fileUrl = `https://${data.Location}`
                                if (/\.(jpe?g|png|bmp|gif)$/.test(fileUrl)) {
                                    fileUrl = fileUrl.replace(/\.cos\.ap-.+?\./, '\.picsh\.')
                                }
                                const fileObj = {
                                    fileUrl,
                                    fileName: fileList[index].name,
                                    id: ''
                                }
                                this.value.push(fileObj)
                                this.successCallback(fileObj)
                                this.$emit('input', this.value)
                            })
                            this.successAllCallback(this.value)
                        })
                        .catch(error => {
                            this.$message.error(error)
                        })
                }
            },
            deleteItem(index) {
                this.cos
                    .delete(this.value[index].fileUrl)
                    .then(() => {
                        this.value.splice(index, 1)
                        const obj = {
                            deleteIndex: index,
                            value: this.value
                        }
                        this.deleteCallback(obj)
                        this.$emit('delete', obj)
                    })
                    .catch(error => {
                        this.$message.error(error)
                    })
            }
        }
    }
</script>

<style lang="scss" scoped>
    .upload-list-container {
        overflow: hidden;
        margin-bottom: 5px;

        .upload-file-item {
            width: 100%;
            height: 26px;
            line-height: 26px;
            margin-top: 5px;
            display: flex;
            position: relative;

            .img_box {
                width: 24px;
                height: 24px;
                margin: 1px;
                background: url('https://cdnfile-10043692.file.myqcloud.com/file-icons.png') no-repeat;
                background-position: 0 -86px;
                background-size: 68px 680px;
            }

            .file-title {
                flex: 1;
                margin-left: 5px;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
            }
            .file-title span, .file-title a {
                display: inline-block;
                width: 100%;
            }

            .icon--success {
                width: 24px;
                height: 24px;
                margin: 1px;
                background: url(../../assets/images/common/success.png) no-repeat;
                background-position: center center;
                background-size: 15px;
            }

            .icon--delete {
                background: url(../../assets/images/common/close.png) no-repeat;
                width: 24px;
                height: 18px;
                background-position: center -11px;
                background-size: 13px;
                display: none;
                margin-top: 3px;
                position: relative;
                left: -2px;
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
    }

    .upload-file-item {
        float: left;
        position: relative;
        width: 90px;
        height: 100px;
        margin-right: 10px;
        overflow: hidden;
    }

    // .img-upload.upload-file-item {
    //     width: 70px;
    //     height: 70px;
    //     display: block;
    //     float: left;
    //     margin: 0 1% 0 0;
    //     background-position: center center;
    //     background-size: cover;
    // }
    .img-upload {
        width: 70px;
        height: 70px;
        display: block;
        float: left;
        margin: 0 1% 0 0;
        background-position: center center;
        background-size: cover;
        cursor: pointer;
    }

    .file-name {
        line-height: 1.2em;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        width: 100%;
    }

    .upload-file-item--active {
        cursor: pointer;

        &:hover {
            .file-title {
                color: #409EFF;
            }

            .icon--success {
                display: none;
            }

            .icon--delete {
                display: block;
            }
        }
    }

    .upload-file-item img {
        display: block;
        width: 70px;
        height: 70px;
        margin: 0 auto;
    }

    .icon--block-delete {
        position: absolute;
        top: 0;
        right: 10px;
        width: 24px;
        height: 24px;
        display: block;
        background-size: cover;
        background-position: center center;
        background-image: url(../../assets/images/common/wxcep_phone_close.png);
        cursor: pointer;
    }

    .file-input {
        display: none;
    }

    .upload-btn {
        padding: 10px 20px;
        font-size: 14px;
        border-radius: 4px;
        color: #fff;
        background-color: #409EFF;
        border-color: #409EFF;
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

    .button--image {
        margin-top: 50px;
    }
</style>
