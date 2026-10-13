<template>
    <div class="campusCircleadd">
        <div class="top">
            <el-button @click="$router.back()" type="default" size="medium">返回</el-button>
            <el-button type="primary" size="medium" @click="addCircleTopics(1)">保存</el-button>
            <el-button type="primary" size="medium" @click="addCircleTopics(2)">发布</el-button>
        </div>
        <div class="subject Dictionariesadd" :style="`height: ${nobottommaxH}px;`">
            <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="140px" class="demo-ruleForm">
                <el-form-item label="圈子主题" prop="title">
                    <el-input type="input" v-model.trim="ruleForm.title" placeholder="请输入圈子主题" :maxlength="20"></el-input>
                </el-form-item>
                <el-form-item label="主题封面">
                    <div class="image-upload-container">
                        <div class="image-upload-container__inner">
                            <uploader ref="coverUploader" pathPrefix="xiaoyuanquan2" module="xiaoyuanquan2" moduleCode="20220729" :extList="['bmp', 'png', 'jpg', 'jpeg', 'gif']" showResult="image" showMode="button" v-model="images" :multiple="false"></uploader>
                            <div v-show="images.length !== 0" class="image-upload__delete" @click="deleteCover">删除图片</div>
                        </div>
                        <div class="cover-hint">
                            <i class="el-icon-info"></i>
                            规格建议:360*180
                        </div>
                    </div>
                </el-form-item>
                <el-form-item label="圈子图标">
                    <img class="logoUrl" :src="ruleForm.topicLogo" alt="" />
                    <el-button type="primary" plain size="small" @click="imgpop = true">切换图标</el-button>
                </el-form-item>
                <el-form-item label="发布范围(学生)">
                    <address-book v-model="stuAddressData" :config="studentConfigData" :isSchoolManager="true"></address-book>
                </el-form-item>
                <el-form-item label="发布范围(老师)">
                    <address-book v-model="teacherAddressData" :config="teacherConfigData" :isSchoolManager="true"></address-book>
                </el-form-item>
                <el-form-item label="圈子管理员" prop="addressDataprop">
                    <address-book v-model="addressData" :config="managerConfigData" :isSchoolManager="true"></address-book>
                </el-form-item>
                <el-form-item label="是否审批">
                    <el-checkbox v-model="ruleForm.needAudit">需要审批</el-checkbox>
                </el-form-item>
                <!-- <el-form-item label="截止时间" >
              <el-date-picker :editable="false"   v-model.trim="ruleForm.offDate" type="date" placeholder="请选择截止时间" format="yyyy-MM-dd" />
            </el-form-item> -->
                <el-form-item class="new-editor" label="圈子介绍" prop="content">
                    <ueditor class="rich-editor new-editor" ref="ueditor" :defaultMes="ruleForm.content" @editModel="richTextEditHandler"></ueditor>
                </el-form-item>
            </el-form>
        </div>
        <el-dialog title="圈子图标" :close-on-press-escape="false" :close-on-click-modal="false" :visible.sync="imgpop" width="800px" :lock-scroll="false" :modal-append-to-body="false">
            <div class="img-list-box">
                <div class="img" v-for="item in logoUrllist" :key="item.id">
                    <el-radio v-model="ruleForm.logoCode" :label="item.code" border>
                        <img :src="item.remark" alt="" />
                    </el-radio>
                </div>
            </div>
            <span slot="footer" class="dialog-footer">
				<el-button @click="imgpop = false">取 消</el-button>
				<el-button type="primary" @click="imgpopfun()">确 定</el-button>
			</span>
        </el-dialog>
    </div>
</template>
<script>
    import { insertCircleTopic, listValue, getCircleTopicInfoById, editCircleTopic } from '@/api/schoolCircle'
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
                    return callback(new Error('请选择发布范围'))
                }
            }
            return {
                studentConfigData: {
                    title: '发布范围(学生)',
                    depart: { target: 'depart', departType: 's', userTypes: '2', notCheckSchool: true },
                    group: {
                        groupTarget: 'group',
                        groupScope: [2]
                    }
                },
                teacherConfigData: {
                    title: '发布范围(老师)',
                    depart: { target: 'all', departType: 't', userTypes: '1', notCheckSchool: true, isIgnoreDepart: true },
                    // SingleChose: true,
                    group: {
                        groupTarget: 'group',
                        groupScope: [1]
                    }
                },
                managerConfigData: {
                    title: '圈子管理员',
                    depart: { target: 'all', departType: 't', userTypes: '1', notCheckSchool: true, isIgnoreDepart: true },
                    // SingleChose: true,
                    group: {
                        groupTarget: 'group',
                        groupScope: [1]
                    }
                },
                addressData: { departJson: [], groupJson: [], userJson: [] },
                stuAddressData: { departJson: [], groupJson: [], userJson: [] },
                teacherAddressData: { departJson: [], groupJson: [], userJson: [] },
                ruleForm: {
                    title: '',
                    content: '',
                    stuDepartJson: '',
                    teacherJson: '',
                    teacherDepartJson: '',
                    manageUserJson: '',
                    state: 1,
                    topicLogo: '',
                    logoCode: '',
                    topicCover: '',
                    needAudit: false,
                    stuGroupJson: '',
                    teacherGroupJson: ''
                },
                logoUrllist: [],
                images: [
                    {
                        fileName: '',
                        fileUrl: 'https://cdnfile-10043692.cos.ap-shanghai.myqcloud.com/admin/images/newbox/xiaoyuanquan.jpg',
                        id: ''
                    }
                ],
                imgpop: false,
                rules: {
                    title: [{ required: true, message: '请输入圈子主题', trigger: 'blur' }],
                    addressDataprop: [{ validator: addressDatapropfun, trigger: 'blur', required: true }],
                    content: [{ required: true, message: '圈子介绍不能为空', trigger: 'change' }]
                },
                logoCode: ''
            }
        },
        mixins: [mixin],
        created() {
            this.listValues()
            this.$route.query.id && this.getCircleTopicInfoById()
        },
        methods: {
            getCircleTopicInfoById() {
                getCircleTopicInfoById({ topicId: this.$route.query.id }).then(res => {
                    let dataDetail = res.data.data
                    this.ruleForm.title = dataDetail.title
                    this.ruleForm.content = dataDetail.content
                    this.ruleForm.stuDepartJson = dataDetail.stuDepartJson.length ? JSON.parse(dataDetail.stuDepartJson) : ''
                    this.ruleForm.teacherJson = dataDetail.teacherJson.length ? JSON.parse(dataDetail.teacherJson) : ''
                    this.ruleForm.teacherDepartJson = dataDetail.teacherDepartJson.length ? JSON.parse(dataDetail.teacherDepartJson) : ''
                    this.ruleForm.manageUserJson = JSON.parse(dataDetail.manageUserJson)
                    this.addressData.userJson = JSON.parse(dataDetail.manageUserJson)
                    this.addressData = {
                        departJson: dataDetail.manageDepartJson ? JSON.parse(dataDetail.manageDepartJson) : [],
                        userJson: dataDetail.manageUserJson ? JSON.parse(dataDetail.manageUserJson) : [],
                        groupJson: dataDetail.manageGroupJson ? JSON.parse(dataDetail.manageGroupJson) : []
                    }

                    this.stuAddressData = {
                        departJson: dataDetail.stuDepartJson.length ? JSON.parse(dataDetail.stuDepartJson) : [],
                        userJson: [],
                        groupJson: dataDetail.stuGroupJson.length ? JSON.parse(dataDetail.stuGroupJson) : []
                    }
                    this.teacherAddressData = {
                        departJson: dataDetail.teacherDepartJson.length ? JSON.parse(dataDetail.teacherDepartJson) : [],
                        userJson: dataDetail.teacherJson.length ? JSON.parse(dataDetail.teacherJson) : [],
                        groupJson: dataDetail.teacherGroupJson.length ? JSON.parse(dataDetail.teacherGroupJson) : []
                    }
                    this.ruleForm.state = dataDetail.state
                    this.ruleForm.topicLogo = dataDetail.topicLogo
                    this.ruleForm.topicCover = dataDetail.topicCover
                    this.ruleForm.logoCode = dataDetail.logoCode

                    this.images = [
                        {
                            fileName: '',
                            fileUrl: dataDetail.topicCover,
                            id: ''
                        }
                    ]
                    this.ruleForm.needAudit = dataDetail.needAudit === 1
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
                if (!this.stuAddressData.departJson.length && !this.stuAddressData.groupJson.length && !this.teacherAddressData.userJson.length && !this.teacherAddressData.departJson.length && !this.teacherAddressData.groupJson.length) {
                    this.$message({
                        message: '请选择选择发布范围（老师或学生）！',
                        type: 'warning'
                    })
                    return
                }
                this.$refs.ruleForm.validate(valid => {
                    if (valid) {
                        this.ruleForm.topicCover = this.images[0].fileUrl
                        this.ruleForm.state = state
                        this.ruleForm.stuDepartJson = this.stuAddressData.departJson.length ? JSON.stringify(this.stuAddressData.departJson) : ''
                        this.ruleForm.teacherJson = this.teacherAddressData.userJson.length ? JSON.stringify(this.teacherAddressData.userJson) : ''
                        this.ruleForm.manageUserJson = JSON.stringify(this.addressData.userJson)
                        this.ruleForm.manageDepartJson = JSON.stringify((this.addressData.departJson));
                        this.ruleForm.manageGroupJson = JSON.stringify((this.addressData.groupJson));
                        this.ruleForm.teacherDepartJson = this.teacherAddressData.departJson.length ? JSON.stringify(this.teacherAddressData.departJson) : ''
                        this.ruleForm.needAudit = this.ruleForm.needAudit ? 1 : 0;
                        this.ruleForm.stuGroupJson = this.stuAddressData.groupJson.length ? JSON.stringify(this.stuAddressData.groupJson) : '';
                        this.ruleForm.teacherGroupJson = this.teacherAddressData.groupJson.length ? JSON.stringify(this.teacherAddressData.groupJson) : '';

                        new Promise((r, j) => {
                            if (!this.$route.query.id) {
                                insertCircleTopic(this.ruleForm)
                                    .then(res => res.data)
                                    .then(data => {
                                        r(data)
                                    })
                                    .catch(() => {})
                            } else {
                                editCircleTopic({ ...this.ruleForm, id: this.$route.query.id })
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
            imgpopfun() {
                this.imgpop = false
                for (let i = 0; i < this.logoUrllist.length; i++) {
                    if (this.ruleForm.logoCode == this.logoUrllist[i].code) {
                        this.ruleForm.topicLogo = this.logoUrllist[i].remark
                    }
                }
            },
            deleteCover() {
                this.$refs.coverUploader.deleteItem(0)
            },
            richTextEditHandler(content) {
                this.ruleForm.content = content
            },
            listValues() {
                listValue()
                    .then(res => res.data)
                    .then(data => {
                        this.logoUrllist = data.data.dataList
                        this.logoCode = this.logoUrllist[0].code
                        this.ruleForm.logoCode = this.logoUrllist[0].code
                        this.ruleForm.topicLogo = this.logoUrllist[0].remark
                        // this.$route.query.id && this.getCircleTopicInfoById()
                    })
            }
        }
    }
</script>

<style>
    .campusCircleadd .upload-block-container,
    .campusCircleadd .upload-file-item {
        height: 90px !important;
        width: 180px !important;
    }
    .campusCircleadd .icon--block-del {
        display: none !important;
    }
    .campusCircleadd .image-upload__delete {
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
    .campusCircleadd .upload-file-item img {
        width: 100% !important;
        height: 100% !important;
        border: 1px dashed #409eff;
        margin: 0 !important;
    }
</style>
<style lang="scss" scoped>
    .campusCircleadd {
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
