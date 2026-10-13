<template>
    <div class="file_box_wrap clearfix">
        <template v-if="multiple || value.length === 0">
            <span v-if="isShowProgress">{{progress}}</span>
            <div v-if="showMode === 'button' && !isShowProgress">
                <label class="upload-btn">上传
                    <input type="file" ref="imgUpload" multiple @change="upload" style="display:none;" size="small">
                </label>
            </div>
        </template>

        <div class="upload_file_wrap" v-if="lineList && (uploadResult || value.length !== 0)">
            <div class="upload_file_item" :key="index" v-for="(item, index) in value">
                <div class="img_box" :class="`${getImgType(item.url)}_icon`"></div>
                <div class="file_title">{{decodeURI(item.url) | getFileName}}</div>
                <div class="success_icon"></div>
                <div class="del_icon" title="删除" @click="deleteItem(index)"></div>
            </div>
        </div>

        <div class="upload_block_file_wrap clearfix" v-if="!lineList && (uploadResult || value.length !== 0)">
            <div class="upload_file_item" :key="index" v-for="(item, index) in value">
                <img :src="getImgCover(item.url)" alt="">
                <div>{{decodeURI(item.url) | getFileName}}</div>
                <i class="del" title="删除" @click="deleteItem(index)"></i>
            </div>
        </div>

        <template v-if="(multiple || value.length === 0) && showMode === 'image'">
            <label class="img-upload">
                <input type="file" ref="imgUpload" multiple @change="upload" style="display:none;" size="small">
            </label>
        </template>
    </div>
</template>

<script>
    import {loadScript} from '@/utils/utils';
    import {getUpload} from '@/api/common/common';

    export default {
        props: {
            value: {
                type: Array,
                default: function () {
                    return []
                }
            },
            multiple: {
                type: Boolean,
                default: false
            },
            lineList: {
                type: Boolean,
                default: true
            },
            showMode: {
                type: String,
                default: 'button'
            },
            mode: {
                type: String,
                default: 'pic'
            },
            extList: {
                type: Array,
                default: function () {
                    return [
                        'mp4',
                        'flv',
                        'mpeg',
                        'wmv'
                    ]
                }
            }
        },
        data() {
            return {
                isShowProgress: false,
                progress: 0,
                cos: null,
                bucket: '',
                appid: '',
                region: '',
                cosSign: '',
                myFolder: '',
                modelfolder: '',
                fileName: '',
                imgText: '',
                progressShow: false,
                uploadResult: false,
                progressbar: 0,
                converInfo: '',
                fileInfo: null,
                videoTypes: ['mp4', '3gp', 'rmvb', 'rm', 'mov', 'avi', 'flv', 'mpeg', 'wmv'],
                picTypes: ['png', 'bmp', 'jpg', 'jpeg', 'gif'],
            }
        },
        created() {

        },
        mounted() {
            loadScript('https://cdnfile-10043692.file.myqcloud.com/admin/js/cos-js-sdk-v4.js')
                .then(() => {
                    this.getUploadFunc();
                })
        },
        filters: {
            getFileName(value) {
                const arr = value.split('/');
                return arr[arr.length - 1];
            }
        },
        methods: {
            deleteItem(index) {
                this.value.splice(index, 1);
                this.$emit('delete', {
                    deleteIndex: index,
                    value: this.value
                });
            },
            getUploadFunc() {
                let _this = this;
                getUpload().then(res => {
                    let data = res.data.data;
                    _this.bucket = data.cosBucket;
                    _this.appid = data.cosAppid;
                    _this.region = data.cosRegion;
                    _this.cosSign = data.cosSign;
                    _this.myFolder = '/' + data.myFolder;//需要操作的目录
                    _this.modelfolder = '/' + data.modelfolder;//模块目录
                    //特别注意: JS-SDK使用之前请先到console.qcloud.com/cos 对相应的Bucket进行跨域设置
                    _this.cos = new CosCloud({
                        appid: _this.appid,// APPID 必填参数
                        bucket: _this.bucket,//bucketName 必填参数
                        region: _this.region,//地域信息 必填参数 华南地区填gz 华东填sh 华北填tj
                        getAppSign: function (callback) {//获取签名 必填参数
                            callback(_this.cosSign);

                        },
                        getAppSignOnce: function (callback) {//获取签名 必填参数
                            callback(_this.cosSign);
                        },
                    });
                })
            },
            upload(e) {
                const file = this.$refs.imgUpload.files[0];
                this.fileInfo = Object.assign({}, {
                    name: file.name,
                    size: file.size,
                    type: file.type
                });
                this.fileName = file.name;
                let strFileName = this.fileName.replace(/^.+?\\([^\\]+?)(\.[^\.\\]*?)?$/gi, "$1");  //正则表达式获取文件名，不带后缀
                let fileExt = this.fileName.replace(/.+\./, "").toLowerCase();   //正则表达式获取后缀
                if (this.extList.indexOf(fileExt) === -1) {
                    this.$message({
                        message: `请上传后缀名为[${this.extList.join(', ')}]的文件`,
                        type: 'error'
                    });
                } else if (strFileName.length > 0) {
                    this.imgText = strFileName;
                    this.progressShow = true;
                    this.uploadFileCos(file, this.successCallBack, this.errorCallBack, this.progressCallBack);
                    e.target.value = '';
                }
                return false;
            },
            uploadFileCos(Cosfile, successCallBack, errorCallBack, progressCallBack) {
                let _this = this;
                var timestamp = (new Date()).valueOf();
                var newFolder = '/' + timestamp + '/';//填你需要创建的文件夹，记得用斜杠包一下
                _this.cos.createFolder(function (result) {
                    _this.cos.uploadFile(successCallBack, errorCallBack, progressCallBack, _this.bucket, _this.myFolder + _this.modelfolder + newFolder + Cosfile.name, Cosfile, 1);//insertOnly==0 表示允许覆盖文件 1表示不允许
                }, function (result) {

                }, _this.bucket, _this.myFolder + _this.modelfolder + newFolder);
            },
            successCallBack(result) {
                if (result.code == 0) {
                    this.progressShow = false;
                    this.uploadResult = true;
                    const fileTitle = this.imgText;
                    let hash = {};
                    hash.url = result.data.source_url;
                    hash.id = result.data.vid;
                    hash.fileInfo = this.fileInfo;
                    this.value.push(hash);
                    this.$emit('input', this.value);

                }
            },
            errorCallBack(result) {
            },
            progressCallBack(curr, sha1) {
                this.isShowProgress = true;
                let sha1CheckProgress = ((sha1 * 100).toFixed(2) || 100) + '%';
                this.progress = '上传进度:' + sha1CheckProgress;
                if ((sha1 * 100).toFixed(0) === '100') {
                    this.progress = this.progress + '  转码中，请稍后...';
                }
                if (curr == 1) {
                    this.isShowProgress = false;
                }
            },
            // 获取文件图标
            getImgType(url) {
                if (!url) {
                    return '';
                }
                // 图片等返回url，其他的返回对应的文件类型的图标和类型
                const fileExt = url.replace(/.+\./, "").toLowerCase();   //正则表达式获取后缀
                let cover = '';
                if (this.videoTypes.indexOf(fileExt) > -1) {
                    cover = 'mp4';
                } else if (this.picTypes.indexOf(fileExt) > -1) {
                    cover = 'pic';
                } else {
                    cover = fileExt;
                }
                return cover; // 返回文件类型对应的图片class
            },
            getImgCover(url) {
                const fileExt = url.replace(/.+\./, "").toLowerCase();   //正则表达式获取后缀
                let cover = '';
                switch (fileExt) {
                    case 'mp4':
                    case 'flv':
                    case 'mpeg':
                    case 'wmv':
                        cover = require('../../assets/images/common/video-default-cover.png');
                        break;
                    case 'png':
                    case 'bmp':
                    case 'jpg':
                    case 'jpeg':
                    case 'gif':
                        cover = url;
                        break;
                }
                return cover;
            }
        }
    }
</script>

<style lang="scss">
    .img-upload {
        width: 70px;
        height: 70px;
        display: block;
        float: left;
        margin: 0 1% 0 0;
        background-position: center center;
        background-size: cover;
        background-image: url(../../assets/images/common/upload_img.png);
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
        -webkit-transition: .1s;
        transition: .1s;
        font-weight: 500;
    }

    .upload_file_wrap {
        overflow: hidden;
        margin-top: 5px;

        .upload_file_item {
            width: 100%;
            height: 26px;
            line-height: 26px;
            margin-top: 5px;
            display: flex;
            cursor: pointer;

            .img_box {
                width: 24px;
                height: 24px;
                margin: 1px;
                background: url("https://cdnfile-10043692.file.myqcloud.com/file-icons.png") no-repeat;
                background-position: 0 -86px;
                background-size: 68px 680px;
            }

            .file_title {
                flex: 1;
                margin-left: 5px;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
            }

            .success_icon {
                width: 24px;
                height: 24px;
                margin: 1px;
                background: url(../../assets/images/common/success.png) no-repeat;
                background-position: center center;
                background-size: 15px;
            }

            .del_icon {
                background: url(../../assets/images/common/close.png) no-repeat;
                width: 24px;
                height: 16px;
                background-position: center -7px;
                background-size: 10px;
                display: none;
            }

            .ppt_icon {
                background-position: 0 0;
            }

            .pptx_icon {
                background-position: 0 0;
            }

            .mp4_icon {
                background-position: 0 -43px;
            }

            .zip_icon {
                background-position: 0 -129px;
            }

            .rar_icon {
                background-position: 0 -129px;
            }

            .pic_icon {
                background-position: 0 -258.5px;
            }

            .doc_icon {
                background-position: 0 -301.5px;
            }

            .docx_icon {
                background-position: 0 -301.5px;
            }

            .xls_icon {
                background-position: 0 -344.5px;
            }

            .xlsx_icon {
                background-position: 0 -344.5px;
            }

            .pdf_icon {
                background-position: 0 -387.5px;
            }

            .txt_icon {
                background-position: 0 -430.5px;
            }

            .mp3_icon {
                background-position: 0 -474px;
            }

            &:hover {
                .file_title {
                    color: #409EFF;
                }

                .success_icon {
                    display: none;
                }

                .del_icon {
                    display: block;
                }
            }
        }
    }

    .upload_block_file_wrap {
        float: left;

        .upload_file_item {
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

            .del {
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
</style>
