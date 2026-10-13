<template>
    <div class="chose-cover">
        <div>
            <img :src="value" class="logo-image form-item--cover"/>
            <el-button class="form-item--cover" size="medium" @click="showCoverChooser = true" type="primary">选择封面</el-button>
            <br/>
        </div>
        <el-dialog class="cover-chooser" width="700px" title="选择封面" :visible.sync="showCoverChooser" @close="dialogCloseHandler">
            <div class="cover-body">
                <el-radio-group v-model="currentCover" style="width:100%">
                    <div class="cover-item" :key="coverItem" v-for="coverItem in sourceCover">
                        <el-radio class="cover-item__radio" :label="coverItem">
                            <img :src="coverItem"/>
                        </el-radio>
                    </div>
                    <div class="cover-item">
                        <el-radio v-if="files && files.length !== 0" class="cover-item__radio custom-cover__radio"
                                  :label="customCoverUrl">
                            <i></i>
                        </el-radio>
                        <uploader
                            :pathPrefix="module"
                            :module="module"
                            :moduleCode="moduleCode"
                            useSysBucket
                            @input="coverUploadSuccessHandler"
                            :extList="['png', 'jpg', 'jpeg', 'bmp', 'gif']"
                            showMode="image"
                            showResult="image"
                            :value="files" :multiple="false">
                        </uploader>
                    </div>
                </el-radio-group>
            </div>
            <span slot="footer" class="dialog-footer">
                    <span class="form-item--cover image-hint">请使用900*500像素或同比例的图片以获得最佳效果</span>
                    <el-button type="default" size="medium" @click="showCoverChooser=false">取消</el-button>
                    <el-button type="primary" size="medium" @click="confirmClickHandler">确定</el-button>
                </span>
        </el-dialog>
    </div>
</template>
<script>
    import Uploader from '@/components/Uploader/WebUploader';
    export default {
        props: {
            module: {
                type: String,
                default: ''
            },
            moduleCode: {
                type: String,
                default: ''
            },
            value: {
                type: String,
                default: ''
            },
            sourceCover: {
                type: Array,
                default: function () {
                    return []
                }
            },
            prefixPath: {
                type: String,
                default: ''
            }
        },
        watch: {
            value(val) {
                if (val.length > 0) {
                    this.currentCover = val;
                }
            }
        },
        components: {Uploader},
        data() {
            return {
                files: [],
                customCoverUrl: '',
                showCoverChooser: false,
                currentCover: ''
            }
        },
        created() {
            this.currentCover = this.sourceCover.length > 0 ? this.sourceCover[0] : '';
        },
        methods: {
            confirmClickHandler() {
                this.showCoverChooser = false;
                this.$emit('input', this.currentCover);
            },
            coverUploadSuccessHandler() {
                this.customCoverUrl = this.files[0].fileUrl;
            },
            dialogCloseHandler() {
                this.files = [];
            }
        }
    }
</script>

<style lang="scss">
    .chose-cover {
        .image-hint {
            color: #ff4949;
            float: left;
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

        .cover-item {
            float: left;
            width: 49%;
            box-sizing: border-box;
            position: relative;
            text-align: center;
            margin-bottom: 20px;
        }

        .cover-item__radio .el-radio__input {
            position: absolute;
            left: 15px;
            top: 5px;
        }

        .cover-item img {
            box-sizing: border-box;
            padding: 20px;
            background-color: #E8E8E8;
            width: 285px;
            height: 154px;
        }

        .logo-uploader {
            height: 216px;
        }


        .upload_block_file_wrap .upload_file_item {
            width: 100%;
            height: 156px;
        }
        .upload_block_file_wrap .upload_file_item img {
            width: 285px;
            height: 154px;
            font-size: 60px;
            color: #ccc;
            line-height: 154px;
            margin-left: 22px;
            background-size: auto;
            background-repeat: no-repeat;
            cursor: pointer;
        }
        .upload_block_file_wrap .upload_file_item .del {
            right: 15px;
        }

        .cover-item img.logo-image {
            width: 405px;
            height: 214px;
        }

        .custom-cover__radio {
            position: absolute;
            left: 15px;
            z-index: 6000;
            top: 2px;
        }

        .form-item--cover {
            vertical-align: middle;
            margin-left: 10px;
        }

        .dialog-button-container {
            margin-top: 10px;
            text-align: right;
        }

        .cover-body {
            max-height: 500px;
            overflow-y: auto;
        }
        .upload-block-container {
            .upload-file-item {
                width: 285px;
                height: 154px;
                font-size: 60px;
                color: #ccc;
                line-height: 154px;
                margin-left: 22px;
                background-size: auto;
                background-repeat: no-repeat;
                cursor: pointer;
                i, .file-name {
                    display: none;
                }
                img {
                    width: 100%;
                    height: 100%;
                    margin: 0 ;
                }
            }
        }

    }
</style>

