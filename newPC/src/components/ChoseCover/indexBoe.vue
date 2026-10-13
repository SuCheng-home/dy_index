<template>
    <div class="chose-covers">
        <div>
            <img :src="value" class="logo-image form-item--cover"/>
            <el-button class="form-item--cover" @click="showCoverChooser = true">选择封面</el-button>
            <br/>

        </div>
        <el-dialog class="cover-chooser" title="选择封面" :visible.sync="showCoverChooser" @close="dialogCloseHandler">
            <div class="cover-body">
                <el-radio-group v-model="currentCover">
                    <div class="cover-item" :key="coverItem" v-for="coverItem in sourceCover">
                        <el-radio class="cover-item__radio" :label="coverItem">
                            <img :src="coverItem" class="aaa"/>
                        </el-radio>
                    </div>
                    <div class="cover-item">
                        <el-radio v-if="customCoverUrl !== ''" class="cover-item__radio custom-cover__radio"
                                  :label="customCoverUrl">
                            <i></i>
                        </el-radio>
                        <el-upload
                            class="logo-uploader"
                            :style="customCoverUrl == '' ? 'padding:0px': 'padding:20px'"
                            :action="`${ basePath }common/addImageUp`"
                            :show-file-list="false"
                            :on-success="coverUploadSuccessHandler"
                            :before-upload="beforeAvatarUpload"
                        >
                            <img v-if="customCoverUrl !== ''" class="logo-image file_img" :src="customCoverUrl"/>
                            <div v-else class="upload-hint">+</div>
                        </el-upload>
                    </div>
                </el-radio-group>
            </div>


            <span slot="footer" class="dialog-footer">
                    <span class="form-item--cover image-hint">请使用900*500像素或同比例的图片以获得最佳效果</span>
                    <el-button type="default" @click="showCoverChooser=false">取消</el-button>
                    <el-button type="primary" @click="confirmClickHandler">确定</el-button>
                </span>
        </el-dialog>
    </div>
</template>
<script>
    export default {
        props: {
            value: {
                type: String,
                default: ''
            },
            sourceCover: {
                type: Array,
                default: function () {
                    return []
                }
            }
        },
        watch: {
            value(val) {
                if (val.length > 0) {
                    this.currentCover = val;
                }
            }
        },
        data() {
            return {
                customCoverUrl: '',
                basePath: global.BasePath,
                showCoverChooser: false,
                currentCover: ''
            }
        },
        created() {
            this.currentCover = this.sourceCover.length > 0 ? this.sourceCover[0] : ''
        },
        methods: {
            confirmClickHandler() {
                this.showCoverChooser = false;
                this.$emit('input', this.currentCover);
            },
            coverUploadSuccessHandler(res) {
                this.customCoverUrl = res.data.url;
            },
            dialogCloseHandler() {

            },
            beforeAvatarUpload(file) {
                const isJPG = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg';
                const isLt2M = file.size / 1024 / 1024 < 2;

                if (!isJPG) {
                    this.$message.error('请上传图片格式文件!');
                }
                if (!isLt2M) {
                    this.$message.error('图片上传不能超过2MB!');
                }
                return isJPG && isLt2M;
            }
        }
    }
</script>

<style lang="scss" scoped>
    .chose-covers {
        .image-hint {
            color: #ff4949;
            float: left;
        }

        .el-radio-group {
            display: flex !important;
            flex-wrap: wrap !important;
            justify-content: space-between !important;
        }

        .cover-item {
            width: 49%;
            box-sizing: border-box;
            position: relative;
            text-align: center;
            margin-bottom: 20px;
            background-color: #E8E8E8;
        }

        .el-radio {
            width: 100%;
            height: 100%;
            padding: 20px;
            position: relative;
            box-sizing: border-box;
        }

        .form-container {
            width: 80%;
            padding-top: 20px;
        }

        .logo-image {
            width: 250px;
            height: 120px;
        }

        .rich-editor {
            line-height: 1em;
        }

        .logo-uploader {
            height: 216px;
            background-color: #fff !important;
        }

        .upload-hint {
            width: 100% !important;
            height: 216px;
            border: 1px dashed #ccc;
            font-size: 60px;
            color: #ccc;
            line-height: 216px;
            box-sizing: border-box;
        }

        .cover-item img.logo-image {
            position: absolute;
            left: 0;
            top: 0;
        }

        /*.custom-cover__radio {*/
        /*  position: absolute;*/
        /*  right: 25px;*/
        /*  top: 2px;*/
        /*}*/
        .form-item--cover {
            vertical-align: middle;
        }

        .dialog-button-container {
            margin-top: 10px;
            text-align: right;
        }

        .cover-body {
            max-height: 500px;
            overflow-y: auto;
        }
    }

    .chose-covers /deep/ .el-radio__input {
        position: absolute;
        top: 0;
        left: 0;
    }

    .chose-covers /deep/ .el-upload {
        display: inherit;
        width: 100%;
        height: 100%;
        box-sizing: border-box;
    }

    .chose-covers /deep/ .el-radio-group {
        display: flex !important;
        flex-wrap: wrap !important;
        justify-content: space-between !important;
    }

    .chose-covers /deep/ .cover-item:last-child .el-radio .el-radio__input .el-radio__inner {
        z-index: 999;
        position: absolute;
        left: 25px;
        top: -2px;
    }

    .chose-covers /deep/ .el-upload .file_img {
        width: 100%;
        height: 100%;
    }

    .chose-covers /deep/ .el-radio__label {
        width: 100%;
        padding-left: 0;

        img {
            width: 100%;
        }
    }
</style>

