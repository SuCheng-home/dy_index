<template>
    <div class="parentResourcesadd">
        <div class="top">
            <el-button @click="$router.back()" type="default" size="medium">返回</el-button>
            <el-button type="primary" size="medium" @click="addCircleTopics(1)">保存</el-button>
        </div>
        <div class="subject Dictionariesadd" :style="`height: ${nobottommaxH}px;`">
            <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="140px" class="demo-ruleForm">
                <el-form-item label="资源名称" prop="name">
                    <el-input type="input" v-model.trim="ruleForm.name" placeholder="请输入资源名称" :maxlength="20"></el-input>
                </el-form-item>
                <el-form-item label="审核人" prop="addressDataprop">
                    <address-book v-model="addressData" :config="managerConfigData" :isSchoolManager="true"></address-book>
                </el-form-item>
                <el-form-item label="序号" prop="orderNum">
                    <el-input-number v-model="ruleForm.orderNum" :min="1" :max="100000"></el-input-number>
                </el-form-item>  
                 <el-form-item label="资源状态" class="is-required">
                            <el-radio-group v-model="ruleForm.status">
                                <el-radio :label="1">可用</el-radio>
                                <el-radio :label="2">不可用</el-radio>
                            </el-radio-group>
                        </el-form-item>  
                <el-form-item label="资源封面" class="is-required">
                    <div class="image-upload-container">
                        <div class="image-upload-container__inner">
                            <uploader ref="coverUploader" pathPrefix="ziyuanyuyue" module="ziyuanyuyue" moduleCode="1207" :extList="['bmp', 'png', 'jpg', 'jpeg', 'gif']" showResult="image" showMode="button" v-model="images" :multiple="false"></uploader>
                            <div v-show="images.length !== 0" class="image-upload__delete" @click="deleteCover">删除图片</div>
                        </div>
                        <div class="cover-hint">
                            <i class="el-icon-info"></i>
                            规格建议:360*180
                        </div>
                    </div>
                </el-form-item>                           
                <el-form-item class="new-editor" label="资源介绍" prop="introduce">
                    <ueditor class="rich-editor new-editor" ref="ueditor" :defaultMes="ruleForm.introduce" @editModel="richTextEditHandler"></ueditor>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>
<script>
    import {updateParentResource,addParentResource,getParentResource} from '@/api/resourceOrder'
    import mixin from '@/mixins/windowResize'
    import moment from 'moment'
    import AddressBook from '@/components/AddressBook/indexExpand'
    import Ueditor from '@/components/Ueditor'
    import Uploader from '@/components/Uploader/WebUploader'
    export default {
        components: { AddressBook, Ueditor, Uploader },
        data() {
            const addressDatapropfun = (rule, value, callback) => {
                if (this.addressData.userJson.length !== 0 || this.addressData.departJson.length !== 0 || this.addressData.groupJson.length !== 0) {
                    return callback()
                } else {
                    return callback(new Error('请选择审核人'))
                }
            }
            return {             
                managerConfigData: {
                    title: '审核人',
                    depart: { target: 'user', departType: 't', userTypes: '1', notCheckSchool: true, isIgnoreDepart: true },
                    group: true,
			    	notCheckSchool: true
                },
                addressData: {departJson: [], groupJson: [], userJson: [] },
                ruleForm: {
                    name: '',
                    introduce: '',
                    batchUserJson: '',
                    status: 1,
                    orderNum:1,
                    cover:''
                },
                images: [],
                rules: {
                    orderNum: [{ required: true, message: '请输入序号', trigger: 'blur' }],
                    name: [{ required: true, message: '请输入资源名称', trigger: 'blur' }],
                    addressDataprop: [{ validator: addressDatapropfun, trigger: 'blur', required: true }],
                    introduce: [{ required: true, message: '资源介绍不能为空', trigger: 'change' }]
                },
            }
        },
        mixins: [mixin],
        created() {
            this.$route.query.id && this.getParentResource()
        },
        methods: {
            getParentResource() {
                getParentResource(this.$route.query.id).then(res => {
                    let dataDetail = res.data.data
                    this.ruleForm.orderNum = dataDetail.orderNum
                    this.ruleForm.name = dataDetail.name
                     this.$refs.ueditor.setContent(dataDetail.introduce);
                    this.ruleForm.introduce = dataDetail.introduce
                    this.addressData ={departJson: [], groupJson: [], userJson: JSON.parse(dataDetail.batchUserJson) }
                     
                    this.ruleForm.status = dataDetail.status
                    this.images = [
                        {
                            fileName: '',
                            fileUrl: dataDetail.cover,
                            id: ''
                        }
                    ]
                })
            },
            confirmAddress(data) {
                console.log(data)
            },
            addCircleTopics(state) {
                if (this.images.length == 0) {
                    this.$message({
                        message: '请选择封面！',
                        type: 'warning'
                    })
                    return
                }
                this.$refs.ruleForm.validate(valid => {
                    if (valid) {
                        this.ruleForm.cover = this.images[0].fileUrl
                        this.ruleForm.batchUserJson = JSON.stringify(this.addressData.userJson)                      
                        new Promise((r, j) => {
                            if (!this.$route.query.id) {
                                addParentResource(this.ruleForm)
                                    .then(res => res.data)
                                    .then(data => {
                                        r(data)
                                    })
                                    .catch(() => {})
                            } else {
                                updateParentResource({ ...this.ruleForm, id: this.$route.query.id })
                                    .then(res => res.data)
                                    .then(data => {
                                        r(data)
                                    })
                                    .catch(() => {})
                            }
                        }).then(data => {
                            if (data.result) {
                                this.$message({
                                    message: '操作成功！',
                                    type: 'success',
                                    duration: 1000
                                })
                                this.loading = false
                                this.$router.back()
                            }
                        })
                    }
                })
            },         
            deleteCover() {
                this.$refs.coverUploader.deleteItem(0)
            },
            richTextEditHandler(introduce) {
                this.ruleForm.introduce = this.$refs.ueditor.getContent();
                // this.ruleForm.introduce = introduce
            },
          
        }
    }
</script>

<style>
    .parentResourcesadd .upload-block-container,
    .parentResourcesadd .upload-file-item {
        height: 90px !important;
        width: 180px !important;
    }
    .parentResourcesadd .icon--block-del {
        display: none !important;
    }
    .parentResourcesadd .image-upload__delete {
        height: 40px;
        line-height: 40px;
        background-color: #409efe;
        color: #fff;
        text-align: center;
        position: absolute;
        bottom: 0;
        width: 100%;
        cursor: pointer;
    }
    .parentResourcesadd .upload-file-item img {
        width: 100% !important;
        height: 100% !important;
        border: 1px dashed #409eff;
        margin: 0 !important;
    }
</style>
<style lang="scss" scoped>
    .parentResourcesadd {
        padding: 12px;
        .top {
            border-bottom: 1px solid #e7eaec;
            padding-bottom: 10px;
        }
        .img-list-box {
            overflow: hidden;
            .img {
                float: left;
                position: relative;
                margin: 8px;
                img {
                    width: 100px;
                    height: 100px;
                    border-radius: 50%;
                }
                .el-radio.is-bordered {
                    height: 130px;
                }
            }
        }
        .subject {
            padding-top: 10px;
            overflow: auto;
            .demo-ruleForm {
                width: 810px;
                margin: 0 auto;
                .logoUrl {
                    width: 80px;
                    float: left;
                    margin-right: 10px;
                }
                .image-upload-container {
                    display: inline-block;
                    vertical-align: top;
                    .image-upload-container__inner {
                        position: relative;
                    }
                    .cover-hint {
                        position: relative;
                        margin-top: 5px;
                        font-size: 12px;
                        i {
                            margin-right: 5px;
                        }
                    }
                }
            }
        }
    }
</style>
