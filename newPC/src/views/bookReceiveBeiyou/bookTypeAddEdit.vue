<template>
    <div class="page news-add-page">
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
                    <el-form-item label="类型名称" prop="typeName">
                        <el-input v-model="formData.typeName" :maxlength="5" placeholder="请输入名称" @blur="formData.typeName = formData.typeName.trim()"></el-input>
                    </el-form-item>
                    <el-form-item label="负责人" prop="addressData">
                        <address-book v-model="formData.addressData" :config="configData"></address-book>
                    </el-form-item>
                    <el-form-item label="排序" prop="orderNo">
                        <el-input v-model="formData.orderNo" :maxlength="10"></el-input>
                    </el-form-item>

                </el-form>
            </div>
        </div>
    </div>
</template>

<script>
    import AddressBook from '@/components/AddressBook/indexExpand';
    import mixin from '@/mixins/windowResize';
    import BackTool from '@/components/BackTool';
    import {getSimpleRule} from '@/utils/validate';
    import {
        insertBookType,
        editBookType,
        getBookTypeById
    } from '@/api/bookReceiveBeiyou';


    export default {
        components: {
            BackTool,
            AddressBook
        },
        data() {
            const addressDataValidator = (rule, value, callback) => {
                if(!this.formData.addressData.userJson || this.formData.addressData.userJson.length === 0) {
                    callback(new Error('负责人不能为空'));
                } else {
                    callback();
                }
            };
            return {
                id: this.$route.query.id,
                isEdit: !!this.$route.query.id,
                configData: {
                    title: '负责人',
                    depart: {target: 'user', departType: 't', userTypes: '1'},
                    group: false
                },
                formData: {
                    typeName: '',
                    addressData: {},
                    orderNo: ''
                },
                rules: {
                    typeName: getSimpleRule('名称', false),
                    orderNo: getSimpleRule('排序', false, 'unsignedInteger'),
                    addressData: [{
                        required: true, validator: addressDataValidator
                    }]
                }
            }
        },
        mounted() {
            if(this.isEdit) {
                getBookTypeById({
                    id: this.id
                })
                    .then(res => res.data)
                    .then(data => {
                        const pageData = data.data;
                        this.formData = {
                            typeName: pageData.typeName,
                            orderNo: pageData.orderNo,
                            addressData: {
                                userJson: JSON.parse(pageData.userJson)
                            },
                        }
                    })
            }

        },
        mixins:[mixin],

        methods: {
            saveHandler() {
                this.$refs.form.validate(isValid => {
                    if(isValid) {
                        const args = {
                            typeName: this.formData.typeName,
                            orderNo: this.formData.orderNo,
                            userJson: JSON.stringify(this.formData.addressData.userJson)
                        };
                        new Promise(resolve => {
                            if(this.isEdit) {
                                args.id = this.id;
                                editBookType(args)
                                    .then(res => res.data)
                                    .then(resolve)
                            } else {
                                insertBookType(args)
                                    .then(res => res.data)
                                    .then(resolve)
                            }
                        })
                            .then(data => {
                                if(data.result) {
                                    this.$message.success(`${this.isEdit ? '编辑' : '新增'}成功`);
                                    this.$router.back();
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
            borderNo-radius: 20px;
        }
    }
    .page{
        padding:12px;
    }
    .news-add-page {
        .image-hint {
            color: #ff4949;
        }
        .main-wrap{
            width:100%;
            padding-top:20px;
            padding-bottom:10px;
            overflow-x: hidden;
            overflow-y: auto;
            box-sizing: borderNo-box;
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
        borderNo: 1px solid #d0d0d0;
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
        borderNo: 1px dashed #ccc;
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
    .news-add-page .new-editor .el-form-item__error{
        left:-69px !important;
    }
</style>
