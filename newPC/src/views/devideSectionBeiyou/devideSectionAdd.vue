<template>
    <div class="page section-add-page">
        <back-tool>
            <el-button size="medium" type="primary" @click="saveHandler()">保存</el-button>
        </back-tool>
        <div class="main-wrap" :style="`height: ${nobottommaxH}px;`">
            <div class="article-container">
                <el-form
                    :model="formData"
                    label-width="140px"
                    :rules="rules"
                    ref="form"
                >
                    <el-form-item label="分区" prop="sectionId">
                        <el-select size="medium" v-model="formData.sectionId" placeholder="请选择分区">
                            <el-option
                                v-for="item in sectionTypeList"
                                :key="item.code"
                                :label="item.value"
                                :value="item.code">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="最大人数" prop="stuLimitCount">
                        <el-input-number v-model="formData.stuLimitCount" :min="1" :step="1" step-strictly :max="200" label="最大人数"></el-input-number>
                    </el-form-item>
                    <el-form-item label="分区背景图" prop="coverUrl">
                        <uploader pathPrefix="zizhufenqu" module="zizhufenqu" moduleCode="20210705" useSysBucket :multiple="false" v-model="files"
                                  :extList="['jpeg', 'jpg', 'bmp', 'gif', 'png']" showMode="image"
                                  showResult="image"></uploader>
                    </el-form-item>
                </el-form>
            </div>
        </div>
    </div>
</template>

<script>
    import Uploader from '@/components/Uploader/WebUploader';
    import mixin from '@/mixins/windowResize';
    import _ from 'lodash';
    import BackTool from '@/components/BackTool';
    import {findSchoolDicsByCode} from '@/api/common/common';
    import {
        addClassAutonomyZone
    } from '@/api/devideSectionBeiyou';

    export default {
        components: {
            BackTool,
            Uploader
        },
        data() {
            const imageValidator = (rule, value, callback) => {
                if (this.files.length === 0) {
                    callback(new Error('分区背景图不能为空'));
                } else {
                    callback();
                }
            };
            return {
                classId: this.$route.query.classId,
                sectionCodeUsed: [],
                sectionTypeList: [],
                files: [],
                formData: {
                    sectionId: '',
                    stuLimitCount: 8
                },
                rules: {
                    coverUrl: [{
                        required: true,
                        validator: imageValidator,
                    }],
                    sectionId: [{
                        required: true, message: '分区不能为空', trigger: 'blur'
                    }],
                    stuLimitCount: [{
                        required: true, message: '最大人数不能为空', trigger: 'blur'
                    }],
                }
            }
        },
        created() {
            const sectionCodeUsed = sessionStorage.getItem('sectionCodeUsed');
            if (sectionCodeUsed) {
                this.sectionCodeUsed = sectionCodeUsed.split(',');
                sessionStorage.removeItem('sectionCodeUsed');
            }
            findSchoolDicsByCode({
                dicCode: 'autonomyZoneTypes'
            })
                .then(res => res.data)
                .then(data => {
                    const pageData = _.differenceWith(data.data, this.sectionCodeUsed, function (v1, v2) {
                        return v1.code == v2;
                    });
                    this.sectionTypeList = pageData;
                    if (pageData.length !== 0) {
                        this.formData.sectionId = pageData[0].code;
                    }
                })
        },
        mixins: [mixin],

        methods: {
            saveHandler() {
                this.$refs.form.validate(isValid => {
                    const typeObj = this.sectionTypeList.find(item => item.code == this.formData.sectionId);
                    if (isValid) {
                        addClassAutonomyZone({
                            classId: this.classId,
                            typeCode: this.formData.sectionId,
                            typeName: typeObj.value,
                            zoneLogo: this.files[0].fileUrl,
                            stuLimitCount: this.formData.stuLimitCount
                        })
                            .then(res => res.data)
                            .then(data => {
                                if (data.result) {
                                    this.$message.success('添加成功');
                                    setTimeout(() => {
                                        this.$router.back();
                                    }, 1000);
                                } else {
                                    this.$message.error(data.msg);
                                }
                            })
                    }
                })
            }
        }
    }
</script>

<style lang="scss" scoped>
    .el-button + .el-button {
        margin-left: 0;
    }

    .scrollBar {
        overflow-x: hidden;
        overflow-y: auto;

        &::-webkit-scrollbar-track-piece {
            background: #d3dce6;
        }

        &::-webkit-scrollbar {
            width: 6px;
        }

        &::-webkit-scrollbar-thumb {
            background: #99a9bf;
            border-radius: 20px;
        }
    }

    .page {
        padding:12px;
    }

    .section-add-page {
        .image-hint {
            color: #ff4949;
        }

        .main-wrap {
            width: 100%;
            padding-top: 20px;
            padding-bottom: 10px;
            overflow-x: hidden;
            overflow-y: auto;
            box-sizing: border-box;
        }

        .article-container {
            width: 810px;
            margin: 0 auto;
            font-size: 15px;
            line-height: 26px;
            color: #676A6C;
        }

        .logo-image {
            width: 180px;
            height: 100px;
        }

        .rich-editor {
            line-height: 1em;
        }
    }

    .logo-uploader {
        height: 216px;
    }

    .img-item {
        width: 160px;
        height: 200px;
        float: left;
        margin-right: 10px;
        margin-top: 10px;
        background-position: center center;
        background-size: cover;
        position: relative;
        border: 1px solid #d0d0d0;
    }

    .img-box-item-close {
        width: 36px;
        height: 36px;
        display: block;
        float: right;
        background-size: cover;
        background-position: center center;
        background-image: url(https://cdnfile-10043692.file.myqcloud.com/vuewxcep/common_img/wxcep_phone_close.png);
        cursor: pointer;
    }

    .upload-hint {
        width: 405px;
        height: 216px;
        border: 1px dashed #ccc;
        font-size: 60px;
        color: #ccc;
        line-height: 216px;
    }

    .custom-cover__radio {
        position: absolute;
        right: 25px;
        top: 2px;
    }

    .form-item--cover {
        vertical-align: middle;
    }

    .dialog-button-container {
        margin-top: 10px;
        text-align: right;
    }

    .campusFeesadd .my-ueditor-box {
        position: relative;
        width: 740px;
        float: right;

    }
</style>
<style scoped>
    .section-add-page .new-editor .el-form-item__error {
        left: -69px !important;
    }
</style>
