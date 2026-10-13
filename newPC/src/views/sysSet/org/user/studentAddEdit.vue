<template>
    <div class="app-container calendar-list-container panel-box">
        <backtool>
            <el-button size="medium" :loading="addLoading" type="primary" @click="saveHandler()">
                保存
            </el-button>
        </backtool>
        <div class="content-box org-teacher" :style="{'height':nobottommaxH+'px'}" style="overflow: auto">
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm" >
                <div class="section-title">基础信息</div>
                <div class="section-content">
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
                            <el-form-item label="学号" prop="learnNum">
                                <el-input v-model="ruleForm.learnNum" :maxlength="50" @blur="learnNumBlurHandler" placeholder="学号"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="出生日期">
                                <el-date-picker v-model="ruleForm.birthDate" type="date" placeholder="出生日期"
                                                :clearable='false'></el-date-picker>
                            </el-form-item>
                        </el-col>

                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="身份证件">
                                <el-select v-model="ruleForm.cardType" placeholder="请选择">
                                    <el-option :key="-1" label="请选择"
                                               :value="''"></el-option>
                                    <el-option v-for="item in cardTypeList" :key="item.code" :label="item.value"
                                               :value="item.code"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="证件号" prop="cardId">
                                <el-input v-model="ruleForm.cardId" placeholder="证件号"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row >
                        <el-col v-if="schoolInfo.type != 1" :span="12">
                            <el-form-item label="学籍号">
                                <el-input v-model="ruleForm.learnJi" placeholder="学籍号"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="学生状态">
                                <el-select v-model="ruleForm.regdPopulation" placeholder="请选择">
                                    <el-option label="在籍" :value="1"></el-option>
                                    <el-option label="不在籍" :value="2"></el-option>
                                    <el-option label="休学" :value="3"></el-option>
                                    <el-option label="转出" :value="4"></el-option>
                                    <el-option label="毕业" :value="5"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row >
                        <el-col :span="12">
                            <el-form-item label="学生头像">
                                <uploader pathPrefix="orgManagement" :extList="['bmp', 'png', 'jpg', 'jpeg']" showResult="image" showMode="image" v-model="photos" :multiple="false"></uploader>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </div>
            </el-form>
        </div>
    </div>
</template>
<script>
    import Backtool from "@/components/BackTool";
    import Uploader from '@/components/Uploader/WebUploader';

    import {mapGetters} from 'vuex';
    import {addStudent, getUserDetail, updateStudent} from '@/api/systemSet/org';
    import {findDicsByCode} from '@/api/common/common';
    import {idcardValidator} from '@/utils/validate';
    import {positionConstants} from '@/utils/constants';
    import mixin from '@/mixins/windowResize';

    export default {
        components: {
            Backtool,
            Uploader
        },
        computed: {
            ...mapGetters(['schoolInfo'])
        },
        mixins: [mixin],
        data() {
            var checkName = (rule, value, callback) => {
                if (!value || value.trim().length === 0) {
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
            const cardValidator = (rule, value, callback) => {
                if (!value || value.trim().length === 0) {
                    callback();
                } else if (this.ruleForm.cardType == 1) {
                    idcardValidator(rule, value, callback)
                } else {
                    callback();
                }
            };
            return {
                positionConstants,

                addLoading: false,
                cardTypeList: [],

                photos: [],
                genderList: [{
                    value: '1',
                    label: '男'
                }, {
                    value: '2',
                    label: '女'
                }],
                departId: this.$route.query.departId,
                id: this.$route.query.id ? Number.parseInt(this.$route.query.id) : 0,
                wxDepartId: this.$route.query.wxId ? Number.parseInt(this.$route.query.wxId) : 0,
                userType: this.$route.query.userType,

                isEdit: !!this.$route.query.id,
                ruleForm: {
                    learnNum: '',
                    name: '',
                    birthDate: '',
                    cardId: '',
                    cardType: '',
                    gender: '',
                    learnJi: '',
                    regdPopulation: 1

                },
                rules: {
                    name: [
                        {required: true, validator: checkName, trigger: 'blur'}
                    ],
                    gender: [
                        {required: true, message: '请选择性别', trigger: 'blur'}
                    ],
                    birthDate: [
                        {required: true, message: '请选择出生日期', trigger: 'blur'}
                    ],
                    cardType: [
                        {required: true, message: '请选择证件类型', trigger: 'blur'}
                    ],
                    cardId: [
                        { validator: cardValidator, trigger: 'blur'}
                    ],
                    learnNum: [
                        {required: true, message: '请填写学号', trigger: 'blur'}
                    ],
                    learnJi: [
                        {required: true, message: '请填写学籍号', trigger: 'blur'}
                    ],
                }
            }
        },
        created() {
            if (this.isEdit) {//如果是编辑
                this.getUserDetailFunc();
            }
            findDicsByCode({
                dicCode: 'cardType'
            })
                .then(res => res.data)
                .then(data => {
                    this.cardTypeList = data.data;
                })
        },
        methods: {
            saveHandler() {
                this.$refs['ruleForm'].validate(valid => {
                    if (valid) {
                        this.addLoading = true;
                        const args = {
                            birthDate: this.ruleForm.birthDate ? this.$moment(this.ruleForm.birthDate).format('YYYY-MM-DD') : '',
                            cardId: this.ruleForm.cardId,
                            gender: this.ruleForm.gender,
                            name: this.ruleForm.name.trim(),
                            learnNum: this.ruleForm.learnNum,
                            cardType: this.ruleForm.cardType,
                            learnJi: this.ruleForm.learnJi,
                            departId: this.departId,
                            wxDepartId: this.wxDepartId,
                            regdPopulation: this.ruleForm.regdPopulation
                        };
                        if(this.isEdit) {
                            args.id = this.id;
                            if(this.photos && this.photos.length !== 0) {
                                args.avatar = this.photos[0].fileUrl;
                            } else {
                                args.avatar = '';
                            }
                        }
                        new Promise(resolve => {
                            if(this.isEdit) {
                                updateStudent(args).then(res => {
                                    resolve(res.data);
                                });
                            } else {
                                addStudent(args).then(res => {
                                    resolve(res.data);
                                });
                            }
                        })
                            .then(data => {
                                this.addLoading = false;
                                if(data.result) {
                                    this.$message({
                                        message: `${this.isEdit ? '编辑' : '新增'}成功！`,
                                        type: 'success',
                                        duration: 1000,
                                        onClose: () => {
                                            this.$router.back();
                                        }
                                    });
                                } else {
                                    this.$message.error(data.msg);
                                }
                            })
                            .catch(() => {
                                this.addLoading = false;
                            })
                    }
                });
            },
            getUserDetailFunc() {
                getUserDetail({
                    userId: this.id,
                    userType: this.userType,
                    convertConstant: '2'
                }).then(res => {
                    let data = res.data.data;
                    this.ruleForm.birthDate = data.birthDate == null ? '' : data.birthDate;
                    this.ruleForm.cardId = data.cardId == null || data.cardId == 0 ? '' : data.cardId;
                    this.ruleForm.cardType = data.cardType == null || data.cardType == 0 ? '' : data.cardType;
                    this.ruleForm.gender = data.gender == null || data.gender == 0 ? '' : data.gender.toString();
                    this.ruleForm.name = data.name == null ? '' : data.name;
                    this.ruleForm.learnNum = data.learnNum == null ? '' : data.learnNum;
                    this.ruleForm.learnJi = data.learnJi == null ? '' : data.learnJi;
                    this.ruleForm.regdPopulation = data.regdPopulation ? parseInt(data.regdPopulation) : 1;
                    if(data.avatar) {
                        this.photos = [{
                            fileUrl: data.avatar
                        }]
                    }

                    this.checkUserSource(this.chosedRoles);//检查用户身份
                }).catch();
            },
            getAddresDepartJson(departList) {//根据所在部门返回集合组装成地址簿的集合数据
                let departJson = [];
                if (departList) {
                    departList.forEach(function (item) {
                        departJson.push({
                            id: item.id,
                            name: item.name,
                            type: item.type,
                            wxDepartId: item.wxDepartId,
                            dataType: 'depart'
                        });
                    });
                }
                return departJson;
            },
            getReleaseAddresDepartJson(departList) {//根据发布范围返回集合组装成地址簿的集合数据
                let departJson = [];
                if (departList) {
                    departList.forEach(function (item) {
                        departJson.push({id: item.grantId, name: item.departName, dataType: 'depart'});
                    });
                }
                return departJson;
            },
            checkUserSource(data) {
                if (data) {
                    data.forEach((item) => {
                        if (item.constantId == 4) {//如果是老师
                            this.source = 'teacher';
                        }
                        if (item.constantId == 79) {//如果是园外用户
                            this.source = 'outside';
                        }
                        if (item.constantId == 80) {//如果是流入用户
                            this.source = 'import';
                        }
                        if (item.constantId == 81) {//如果是流出用户
                            this.source = 'outflow';
                        }
                    });
                }
            },
            learnNumBlurHandler() {
                this.ruleForm.learnNum = this.ruleForm.learnNum.replace(/[^\w]/g, '');
            }

        }
    }
</script>
<style scoped>
    .content-box {
            width: 810px;
    padding-top: 20px;
    margin: 0 auto;
}
    .section-title{
        line-height: 20px;
        font-size: 16px;
        border-left: 4px solid #409EFF;
        padding-left: 10px;
    }
    .el-select,.el-input {
    width: 100%;
}
</style>
