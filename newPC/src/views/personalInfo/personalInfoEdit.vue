<template>
    <div id="personalInfoEdit" class="app-container calendar-list-container">
        <backtool>
            <el-button v-if="ruleForm.id" :loading="addLoading" type="primary" @click="updateTeacher">保存</el-button>
        </backtool>
        <div class="content-box org-teacher">
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="姓名" prop="name">
                            <el-input v-model="ruleForm.name" placeholder="姓名"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="性别" prop="gender">
                            <el-select v-model="ruleForm.gender" placeholder="请选择">
                                <el-option v-for="item in genderList" :key="item.value" :label="item.label"
                                           :value="item.value"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="手机号码" prop="mobile">
                            <el-input v-model.trim="ruleForm.mobile" class="mobile-input" placeholder="手机号码"
                                      auto-complete="off" @click.native="mobileClick"
                                      :readonly="!checkMobileReadonly()"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="邮箱">
                            <el-input v-model="ruleForm.email" placeholder="邮箱"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="主教学科" prop="mainTeachCourse">
                            <el-select v-model="ruleForm.mainTeachCourse" placeholder="请选择">
                                <el-option v-for="item in mainTeachCourseList" :key="item.id" :label="item.name"
                                           :value="item.id"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="出生日期" prop="birthDate">
                            <el-date-picker v-model="ruleForm.birthDate" type="date" placeholder="出生日期"
                                            :clearable='false'></el-date-picker>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="政治面貌" prop="politicalCode">
                            <el-select v-model="ruleForm.politicalCode" placeholder="请选择">
                                <el-option v-for="item in politicalCodeList" :key="item.value" :label="item.label"
                                           :value="item.value"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="身份证" prop="cardId">
                            <el-input v-model="ruleForm.cardId" placeholder="请输入身份证号"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="教师类型" prop="teacherType">
                            <el-select v-model="ruleForm.teacherType" placeholder="请选择" @change="teacherTypeChange">
                                <el-option v-for="item in teacherTypeList" :key="item.value" :label="item.label"
                                           :value="item.value"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                    </el-col>
                </el-row>
                <el-row v-show="showPhoto">
                    <el-col :span="12">
                        <el-form-item label="发证日期" prop="deriveTime">
                            <el-date-picker v-model="deriveTime" type="date" placeholder="发证日期"
                                            :clearable='false'></el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                    </el-col>
                </el-row>
                <el-row :gutter="50" v-show="showPhoto">
                    <el-col :span="12">
                        <el-form-item label="证书照片" prop="filePaths">
                            <uploader pathPrefix="renlian" module="renlian" moduleCode="20190509" useSysBucket
                                      :multiple="false" showResult="image" :showModeCover="true" showMode="cover"
                                      :extList="['png', 'jpg', 'image', 'jpeg', 'gif']" v-model="filePaths"
                                      @input="changeCoverLogo"></uploader>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </div>
    </div>
</template>

<script>
    import {mapGetters} from 'vuex';
    import Backtool from '@/components/BackTool';
    import Uploader from '@/components/Uploader/WebUploader';
    import {checkIDCard} from '@/utils';
    import {getSelfDetail} from '@/api/systemSet/org.js';
    import {updateUserSelf, getCourseList, getDiplomaDetail, addDiploma, updateDiploma} from '@/api/faceManage';

    export default {
        name: 'personalInfoEdit',
        components: {
            Backtool,
            Uploader
        },
        data() {
            var checkName = (rule, value, callback) => {
                if (!value || value.trim().length == 0) {
                    return callback(new Error('姓名不能为空！'));
                }
                if (value.length > 20) {
                    return callback(new Error('姓名长度不能超过20！'));
                }
                // let g = /^[\u3000-\u9FA5A-Za-z0-9-_]+$/;
                // if (!g.test(value)) {
                //     return callback(new Error('姓名不正确，限定中文、英文、数字！'));
                // } else {
                //     callback();
                // }
                 callback();
            };
            var checkMobile = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('手机不能为空！'));
                }
                let g = /^0?1[3|4|5|7|8][0-9]\d{8}$/;
                if (!g.test(value)) {
                    callback(new Error('手机号码格式不正确！'));
                } else {
                    callback();
                }
            };
            var checkEmail = (rule, value, callback) => {
                if (value == null || value.length == 0) {
                    callback();
                } else {
                    let g = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;
                    if (!g.test(value)) {
                        callback(new Error('邮箱格式不正确！'));
                    } else {
                        callback();
                    }
                }
            };
            return {
                currentStatus: 1,
                currentType: 1,

                addLoading: false,
                genderList: [
                    {
                        value: 0,
                        label: '请选择性别'
                    }, {
                        value: 1,
                        label: '男'
                    }, {
                        value: 2,
                        label: '女'
                    }
                ],
                politicalCodeList: [
                    {
                        value: '0',
                        label: '请选择'
                    }, {
                        value: '1',
                        label: '中共党员'
                    }, {
                        value: '2',
                        label: '中共预备党员'
                    }, {
                        value: '4',
                        label: '群众'
                    }, {
                        value: '5',
                        label: '民革会员'
                    }, {
                        value: '6',
                        label: '民盟盟员'
                    }, {
                        value: '7',
                        label: '民建会员'
                    }, {
                        value: '8',
                        label: '民进会员'
                    }, {
                        value: '9',
                        label: '农工党党员'
                    }, {
                        value: '10',
                        label: '致公党党员'
                    }, {
                        value: '11',
                        label: '九三学社社员'
                    }, {
                        value: '12',
                        label: '台盟盟员'
                    }, {
                        value: '13',
                        label: '无党派民主人士'
                    }
                ],
                teacherTypeList: [
                    {
                        value: '100',
                        label: '普通老师（学科）'
                    },
                    {
                        value: '200',
                        label: '骨干老师（学科）'
                    },
                    {
                        value: '300',
                        label: '普通老师（德育）'
                    },
                    {
                        value: '400',
                        label: '骨干老师（德育）'
                    }
                ],
                mainTeachCourseList: [],
                ruleForm: {
                    id: '',
                    userType: '',
                    cardId: '',
                    name: '',
                    birthDate: '',
                    gender: 0,
                    mobile: '',
                    email: '',
                    teacherType: '',
                    politicalCode: '0',
                    mainTeachCourse: '',
                },
                rules: {
                    name: [
                        {required: true, validator: checkName, trigger: 'blur'}
                    ],
                    mobile: [
                        {required: true, validator: checkMobile, trigger: 'blur'}
                    ],
                    email: [
                        {required: true, validator: checkEmail, trigger: 'blur'}
                    ],
                },
                filePaths: [],
                deriveTime: '',
                isNewPhoto: true,
                editPhotoId: 0,
                showPhoto: false
            }
        },
        created() {
            this.ruleForm.id = this.$route.query.id;
            this.ruleForm.userType = this.$route.query.userType;
            this.getCourseList();
            this.setDetail();
        },
        computed: {
            ...mapGetters(['schoolInfo', 'userInfo'])
        },
        methods: {
            checkIDCard,
            mobileClick() {
                if (!this.checkMobileReadonly()) {
                    let isExternalContact = false;
                    if (this.schoolInfo.isExternalContact == 1) {
                        isExternalContact = true;
                    }
                    if (isExternalContact) {
                        // 新家校提示
                        this.$message.error("您已登录过企业微信，需由成员自行修改手机号");
                    } else {
                        this.$message.error("新家校模式下未关注的家长以及已关注的老师不允许修改手机号");
                    }
                }
            },
            checkMobileReadonly() {
                let canModify = false;

                if (this.schoolInfo.isExternalContact != 2 && this.currentStatus == 4) {
                    canModify = true;
                }
                if (this.schoolInfo.isExternalContact == 2 && this.currentType == 3 && this.currentStatus == 1) {
                    canModify = true;
                }
                return canModify;
            },
            updateTeacher() {
                this.$refs['ruleForm'].validate(valid => {
                    if (valid) {
                        if (this.ruleForm.cardId.trim() && !this.checkIDCard(this.ruleForm.cardId.trim())) {
                            this.$message({
                                message: '请输入正确的身份证号码！',
                                type: 'error'
                            });
                            return;
                        }
                        if ((this.ruleForm.teacherType === '200' || this.ruleForm.teacherType === '400') && !this.deriveTime) {
                            this.$message({
                                message: '请选择证书发证日期！',
                                type: 'info'
                            });
                            return;
                        }
                        if ((this.ruleForm.teacherType === '200' || this.ruleForm.teacherType === '400') && !this.filePaths) {
                            this.$message({
                                message: '请上传证书照片！',
                                type: 'info'
                            });
                            return;
                        }
                        this.addLoading = true;
                        let query = {};
                        query.birthDate = this.ruleForm.birthDate === '' ? '' : this.$moment(this.ruleForm.birthDate).format('YYYY-MM-DD');
                        query.cardId = this.ruleForm.cardId.trim();
                        query.email = this.ruleForm.email;
                        query.gender = this.ruleForm.gender;
                        query.id = parseInt(this.ruleForm.id);
                        query.mainTeachCourse = this.ruleForm.mainTeachCourse.toString();
                        query.mobile = this.ruleForm.mobile.trim();
                        query.name = this.ruleForm.name.trim();
                        query.politicalCode = this.ruleForm.politicalCode;
                        query.teacherType = this.ruleForm.teacherType;


                        updateUserSelf(query).then(res => {
                            let data = res.data;
                            if (data.code === 200) {
                                let _this = this;
                                this.$message({
                                    message: '修改成功！',
                                    type: 'success',
                                    duration: 1000,
                                    onClose: function () {
                                        _this.addLoading = false;
                                        _this.$router.back();
                                    }
                                });
                            } else {
                                this.addLoading = false;
                                this.$message({
                                    message: data.msg,
                                    type: 'error'
                                });
                            }

                        }).catch(err => {
                            this.addLoading = false;
                        });
                    }
                });
            },
            getCourseList() {
                getCourseList().then(res => {
                    let data = res.data.data;
                    this.mainTeachCourseList = data;
                }).catch();
            },
            setDetail() {
                getSelfDetail(2).then(res => {
                    let data = res.data.data;
                    this.currentStatus = data.status;
                    this.currentType = data.type;
                    this.ruleForm.birthDate = data.birthDate == null ? '' : data.birthDate;
                    this.ruleForm.email = data.email == null ? '' : data.email;
                    this.ruleForm.gender = data.gender == null ? '' : data.gender;
                    this.ruleForm.mobile = data.mobile == null ? '' : data.mobile;
                    this.ruleForm.name = data.name == null ? '' : data.name;
                    this.ruleForm.cardId = data.cardId == null ? '' : data.cardId;
                    this.ruleForm.politicalCode = data.politicalCode == null ? '' : data.politicalCode;
                    if (data.mainTeachCourse) {
                        this.ruleForm.mainTeachCourse = data.mainTeachCourse
                    }
                    ;
                    if (!data.teacherType) {
                        this.teacherType = '100'
                    } else {
                        this.ruleForm.teacherType = data.teacherType;
                        if (this.ruleForm.teacherType === '200' || this.ruleForm.teacherType === '400') {
                            this.showPhoto = true;
                            this.getDiplomaDetail(this.ruleForm.teacherType);
                        } else {
                            this.showPhoto = false;
                        }
                    }
                    ;
                }).catch();
            },
            teacherTypeChange(val) {
                if (val === '200' || val === '400') {
                    this.showPhoto = true;
                    this.getDiplomaDetail(val);
                } else {
                    this.showPhoto = false;
                }
            },
            getDiplomaDetail(type) {
                getDiplomaDetail({
                    teacherType: type,
                    userId: this.ruleForm.id
                }).then(res => {
                    let data = res.data.data;
                    if (res.data.code === 200 && !data) {
                        this.isNewPhoto = true;
                        this.deriveTime = '';
                        this.filePaths = [];
                    } else if (res.data.code === 200) {
                        this.isNewPhoto = false;
                        this.editPhotoId = data.id;
                        this.filePaths = [{
                            fileUrl: data.filePaths
                        }];
                        let deriveDate = new Date(data.deriveTime);
                        this.deriveTime = this.getStrDate(deriveDate);
                    }
                }).catch(() => {
                });
            },
            changeCoverLogo() {
                if (this.isNewPhoto) {
                    this.addDiploma();
                } else {
                    this.updateDiploma();
                }
            },
            addDiploma() {
                if (!this.deriveTime.length) {
                    this.deriveTime = this.getStrDate(this.deriveTime)
                }
                let query = {
                    deriveTime: this.deriveTime,
                    filePaths: this.filePaths,
                    teacherType: this.ruleForm.teacherType,
                    userId: this.ruleForm.id
                };
                addDiploma(query).then(res => {
                    if (res.data.code === 200) {
                        this.$message({
                            message: '证书上传成功！',
                            type: 'success'
                        });
                        this.editPhotoId = res.data.data;
                    }
                }).catch(() => {
                });
            },
            updateDiploma() {
                if (!this.deriveTime.length) {
                    this.deriveTime = this.getStrDate(this.deriveTime)
                }
                if (!this.filePaths.length) {
                    return;
                }
                let query = {
                    deriveTime: this.deriveTime,
                    filePaths: this.filePaths[0].fileUrl,
                    teacherType: this.ruleForm.teacherType,
                    id: this.editPhotoId
                };
                updateDiploma(query).then(res => {
                    if (res.data.code === 200) {
                        this.$message({
                            message: '证书上传成功！',
                            type: 'success'
                        });

                    }
                }).catch(() => {
                });
            },
            getStrDate(data) {
                let strDate = data.getFullYear() + "-" + this.fillZero(data.getMonth() + 1) + "-" + this.fillZero(data.getDate());
                return strDate;
            },
            fillZero(n) {
                return n < 10 ? '0' + n : n;
            }
        }
    }
</script>
<style scoped>
    .content-box {
        width: 1260px;
        margin: 40px auto 0;
    }

    .expend-tools {
        padding-left: 60px;
    }

    .org-teacher .el-select {
        width: 100%;
    }

    .org-teacher .el-date-editor.el-input {
        width: 100%;
    }
</style>
<style scoped>
    #personalInfoEdit .mobile-input [readonly="readonly"] {
        background-color: #ddd;
    }
</style>
