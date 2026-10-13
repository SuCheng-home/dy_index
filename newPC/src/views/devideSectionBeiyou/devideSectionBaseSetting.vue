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
                    <el-form-item label="移除密码" prop="removePwd">
                        <el-input v-model.trim="formData.removePwd" @blur="formData.removePwd = formData.removePwd.trim()" placeholder="请输入6位纯数字组合" :maxlength="6"></el-input>
                    </el-form-item>
                    <el-form-item label="自动结束时间" prop="autoEndTime">
                        <el-time-picker
                            v-model="formData.autoEndTime"
                            :clearable="false"
                            value-format="HH:mm"
                            format="HH:mm"
                            placeholder="任意时间点">
                        </el-time-picker>
                    </el-form-item>
                    <el-form-item label="一键移除">
                        <el-switch
                            v-model="formData.oneKeyRemove"
                            :active-value="2"
                            :inactive-value="1"
                        >
                        </el-switch>
                    </el-form-item>
                </el-form>
            </div>
        </div>
    </div>
</template>

<script>
    import Uploader from '@/components/Uploader/WebUploader';
    import mixin from '@/mixins/windowResize';
    import BackTool from '@/components/BackTool';
    import {
        getClassAutonomyZoneBasicInfo,
        saveClassAutonomyZoneBasic
    } from '@/api/devideSectionBeiyou';

    export default {
        components: {
            BackTool,
            Uploader
        },
        data: function () {
            const removePwdValidator = (rule, value, callback) => {
                if (this.formData.removePwd === '') {
                    callback();
                } else {
                    if (!/^\d{6}$/.test(this.formData.removePwd)) {
                        callback(new Error('移除密码必须是六位纯数字'));
                    } else {
                        callback();
                    }
                }
            };
            return {
                classId: this.$route.query.classId,
                id: '',
                formData: {
                    removePwd: '',
                    autoEndTime: '16:00',
                    oneKeyRemove: 1
                },
                rules: {
                    removePwd: [{
                        validator: removePwdValidator, trigger: 'blur'
                    }],
                    autoEndTime: [{
                        required: true, message: '自动结束时间不能为空', trigger: 'blur'
                    }]
                }
            }
        },
        created() {
            getClassAutonomyZoneBasicInfo({
                classId: this.classId
            })
                .then(res => res.data)
                .then(data => {
                    const formData = data.data;
                    if(!formData.id) {
                        formData.removePwd = '';
                        formData.autoEndTime = '16:00';
                        formData.oneKeyRemove = 1;
                        formData.id = '';
                    }
                    this.id = formData.id;
                    this.formData = formData;
                })
        },
        mixins:[mixin],

        methods: {
            saveHandler() {
                this.$refs.form.validate(isValid => {
                    if(isValid) {
                        const args = {
                            classId: this.classId,
                            autoEndTime: this.formData.autoEndTime,
                            id: this.id,
                            oneKeyRemove: this.formData.oneKeyRemove,
                            removePwd: this.formData.removePwd
                        };
                        saveClassAutonomyZoneBasic(args)
                            .then(res => res.data)
                            .then(data => {
                                if(data.result) {
                                    this.$message.success('设置成功');
                                    setTimeout(() => {
                                        this.$router.back();
                                    }, 1000);
                                } else {
                                    this.$message.error(data.msg);
                                }
                            });
                    }
                })
            }
        }
    }
</script>

<style lang="scss" scoped>
    .el-button+.el-button {
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
    .page{
        padding:12px;
    }
    .section-add-page {
        .image-hint {
            color: #ff4949;
        }
        .main-wrap{
            width:100%;
            padding-top:20px;
            padding-bottom:10px;
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
    .campusFeesadd .my-ueditor-box{
        position: relative;
        width: 740px;
        float:right;

    }
</style>
<style scoped>
    .section-add-page .new-editor .el-form-item__error{
        left:-69px !important;
    }
</style>
