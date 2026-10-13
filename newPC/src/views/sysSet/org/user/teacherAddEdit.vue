<template>
    <div class="app-container calendar-list-container panel-box">
        <backtool>
            <el-button size="medium" :loading="addLoading" type="primary" @click="saveHandler()">
                保存
            </el-button>
        </backtool>
        <div class="content-box org-teacher">
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                <div class="section-title">基础信息</div>
                <div class="section-content">
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="姓名" prop="name">
                                <el-input v-model="ruleForm.name" placeholder="姓名" :maxlength="10"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="手机号码" prop="mobile">
                                <el-input v-model="ruleForm.mobile" placeholder="手机号码"  :maxlength="14"
                                          :disabled="!!ruleForm.id && !isMobileChangeValid()"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="性别" prop="gender">
                                <el-select v-model="ruleForm.gender" placeholder="请选择">
                                    <el-option v-for="item in genderList" :key="item.value" :label="item.label"
                                               :value="item.value"></el-option>
                                </el-select>
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
                                <el-input v-model="ruleForm.cardId" placeholder="证件号"  :maxlength="30"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="教师类型">
                                <el-select v-model="ruleForm.peopleSchoolState" placeholder="请选择">
                                    <el-option :key="-1" label="请选择"
                                               :value="''"></el-option>
                                    <el-option :key="1" label="教师" value="1"></el-option>
                                    <el-option :key="2" label="职工" value="2"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="角色" prop="roleList">
                                <chose-role :userType="roleUserType" :chosedRoles="chosedRoles" :source="source"
                                            :userId="ruleForm.id"
                                            v-model="ruleForm.roleList"></chose-role>
                            </el-form-item>
                        </el-col>
                    </el-row>                    
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="职务">
                                <el-select v-model="ruleForm.position" placeholder="请选择">
                                    <el-option :key="-1" label="请选择"
                                               :value="''"></el-option>
                                    <el-option v-for="[value, label] in positionConstants" :key="value" :label="label"
                                               :value="value"></el-option>
                                </el-select>
                            </el-form-item>

                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="人员状态">
                                <el-select v-model="ruleForm.peopleState" placeholder="请选择">
                                    <el-option :key="-1" label="请选择"
                                               :value="''"></el-option>
                                    <el-option v-for="[value, label] in peopleStateConstants" :key="value" :label="label"
                                               :value="value"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="所在部门" prop="departData">  
                                <address-book v-model="ruleForm.departData"  @confirm="mainDepartIdfun()" :config="ruleForm.departConfig"></address-book>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="发布范围" prop="releaseDepartData">
                                <address-book v-model="ruleForm.releaseDepartData"
                                              :config="ruleForm.releaseDepartConfig"></address-book>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row >
                         <el-col :span="12" v-if="ruleForm.departData.departJson.length">
                           <el-form-item label="主部门设置" class="is-required">  
                            <div   v-for="item in ruleForm.departData.departJson" :key="item.id">
                                {{item.name}}
                                <el-tag type="success" v-if="item.id==ruleForm.mainDepartId" size="mini">主部门</el-tag>
                                <el-button  v-if="item.id!=ruleForm.mainDepartId" @click="ruleForm.mainDepartId=item.id" style="float: right;top: 7px;position: relative;" type="text" size="mini">设为主部门</el-button>
                            </div>

                        </el-form-item>
                        </el-col>
                        <el-col :span="12" v-if="!isEdit">
                            <el-form-item label="用户名">
                                <el-input v-model="ruleForm.loginname" placeholder="用户名"  :maxlength="50"></el-input>
                            </el-form-item>

                        </el-col>
                    </el-row>
                </div>
            </el-form>
        </div>
    </div>
</template>
<script>
    import {mapGetters} from 'vuex';
    import Backtool from "@/components/BackTool";
    import AddressBook from '@/components/AddressBook/indexExpand';
    import ChoseRole from '@/components/ChoseRole';
    import {addTeacher, getUserDetail, queryDepartById, updateTeacher} from '@/api/systemSet/org';
    import {idcardValidator} from '@/utils/validate';
    import {findDicsByCode} from '@/api/common/common';
    import {positionConstants, peopleStateConstants} from '@/utils/constants';

    function getIdsByArrayData(data) {
        let ids = '';
        if (data) {
            ids = data.map(function (item) {
                return item.id
            }).toString();
        }
        return ids;
    }

    export default {
        components: {
            Backtool,
            AddressBook,
            ChoseRole
        },
        computed: {
            ...mapGetters(['schoolInfo'])
        },
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
            var checkMobile = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('手机不能为空！'));
                }
                let g = /^0?1[3456789][0-9]\d{8}$/;
                if (!g.test(value)) {
                    callback(new Error('手机号码格式不正确！'));
                } else {
                    callback();
                }
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
            var checkDepartData = (rule, value, callback) => {
                if (value.departJson.length === 0) {
                    return callback(new Error('部门不能为空！'));
                } else {
                    callback();
                }
            };
            var releaseDepartValidator = (rule, value, callback) => {
                if (value.departJson.length === 0) {
                    return callback(new Error('发布范围不能为空！'));
                } else {
                    callback();
                }
            };
            var checkRoleList = (rule, value, callback) => {
                if (value.length === 0) {
                    return callback(new Error('角色不能为空！'));
                } else {
                    callback();
                }
            };
            return {
                positionConstants,
                peopleStateConstants,

                addLoading: false,
                source: this.$route.query.source,
                cardTypeList: [],
                genderList: [{
                    value: '1',
                    label: '男'
                }, {
                    value: '2',
                    label: '女'
                }],
                status: 4,
                departId: '',
                chosedRoles: [],
                roleUserType: 'add',
                isEdit: !!this.$route.query.id,
                ruleForm: {
                    id: this.$route.query.id ? Number.parseInt(this.$route.query.id) : 0,
                    peopleSchoolState: '',
                    userType: '',
                    name: '',
                    peopleState: '',
                    birthDate: '',
                    cardId: '',
                    cardType: '',
                    gender: '',
                    mobile: '',
                    username: '',
                    position: '',
                    mainDepartId:'',
                    departData: {departJson: []},
                    departConfig: {title: '请选择所在部门', depart: {target: 'depart', departType: 't', userTypes: '1,3'}},
                    releaseDepartData: {},
                    releaseDepartConfig: {
                        title: '请选择发布范围',
                        depart: {target: 'depart', departType: 'all', userTypes: '1,3'}
                    },
                    roleList: [],
                    loginname: ''
                },
                rules: {
                    name: [
                        {required: true, validator: checkName, trigger: 'blur'}
                    ],
                    mobile: [
                        {required: true, validator: checkMobile, trigger: 'blur'}
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
                        {validator: cardValidator, trigger: 'blur'}
                    ],
                    departData: [
                        {required: true, validator: checkDepartData, trigger: 'blur'}
                    ],
                    roleList: [
                        {required: true, validator: checkRoleList, trigger: 'blur'}
                    ],
                    username: [
                        {required: true, message: '请填写用户名', trigger: 'blur'}
                    ],
                    position: [
                        {required: true, message: '请选择职务', trigger: 'blur'}
                    ],
                    peopleState: [
                        {required: true, message: '请选择人员状态', trigger: 'blur'}
                    ],
                    peopleSchoolState: [
                        {required: true, message: '请选择教师类型', trigger: 'blur'}
                    ],
                    releaseDepartData: [
                        {required: true, validator: releaseDepartValidator, trigger: 'blur'}
                    ]
                }
            }
        },
        created() {
            if (this.source === 'teacher') {
                this.chosedRoles = [3];
            }
            if (this.source === 'outside') {
                this.chosedRoles = [79];
                this.ruleForm.departConfig = {
                    title: '请选择所在部门',
                    depart: {target: 'depart', departType: 'outside', userTypes: '1'}
                };
            }
            if (this.source === 'import') {
                this.chosedRoles = [80];
            }
            if (this.isEdit) {//如果是编辑
                this.ruleForm.userType = this.$route.query.userType;
                this.roleUserType = 'edit';
                this.getUserDetailFunc();
            } else {
                this.departId = this.$route.query.departId;
                queryDepartById(this.departId).then(res => {
                    let data = res.data.data;
                    let defualtDepartData = {
                        departJson: [{
                            id: data.id,
                            name: data.name,
                            type: data.type,
                            wxDepartId: data.wxDepartId,
                            dataType: 'depart'
                        }]
                    };
                    this.ruleForm.releaseDepartData = defualtDepartData;
                    this.ruleForm.departData = defualtDepartData;
                    this.ruleForm.mainDepartId=defualtDepartData[0].id
                }).catch();
            }
            findDicsByCode({
                dicCode: 'cardType'
            })
                .then(res => res.data)
                .then(data => {
                    this.cardTypeList = data.data;
                });
        },
        methods: {
            mainDepartIdfun(){              
                if(this.ruleForm.departData.departJson.length){
                    if(!this.ruleForm.mainDepartId){
                      this.ruleForm.mainDepartId=this.ruleForm.departData.departJson[0].id
                    }else{
                        let is=true;
                        for(let i=0;i<this.ruleForm.departData.departJson.length;i++){
                            if(this.ruleForm.departData.departJson[i].id==this.ruleForm.mainDepartId){
                                is=false
                            }
                        }
                        if(is){
                            this.ruleForm.mainDepartId=this.ruleForm.departData.departJson[0].id
                        }

                    }                    
                }else{
                  this.ruleForm.mainDepartId=''
                }

            },
            isMobileChangeValid() {
                let isValid = true;
                if(this.schoolInfo.clientType == 1 || this.schoolInfo.clientType == 12) {
                    isValid = this.status != 1 || this.schoolInfo.syncForWx != 1;
                }
                return isValid;
            },
            saveHandler() {
                this.$refs['ruleForm'].validate(valid => {
                    if (valid) {
                        this.addLoading = true;
                        const args = {
                            birthDate: !this.ruleForm.birthDate ? '' : this.$moment(this.ruleForm.birthDate).format('YYYY-MM-DD'),
                            cardId: this.ruleForm.cardId,
                            gender: this.ruleForm.gender,
                            mobile: this.ruleForm.mobile.trim(),
                            name: this.ruleForm.name.trim(),
                            username: this.ruleForm.username.trim(),
                            cardType: this.ruleForm.cardType,
                            position: this.ruleForm.position,
                            peopleSchoolState: this.ruleForm.peopleSchoolState,
                            peopleState: this.ruleForm.peopleState,
                            departIds:( getIdsByArrayData(this.ruleForm.departData.departJson)).split(','),
                            releaseDepartIds: (getIdsByArrayData(this.ruleForm.releaseDepartData.departJson)).split(','),
                            roleIds: (getIdsByArrayData(this.ruleForm.roleList)).split(','),
                            mainDepartId:this.ruleForm.mainDepartId
                        };
                        if(this.isEdit) {
                            args.id = this.ruleForm.id;
                        } else {
                            args.loginname = this.ruleForm.loginname;
                            args.source = this.source;
                        }
                        new Promise(resolve => {
                            if(this.isEdit) {
                                updateTeacher(args).then(res => {
                                    resolve(res.data);
                                });
                            } else {
                                addTeacher(args).then(res => {
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
                    userId: this.ruleForm.id,
                    userType: this.ruleForm.userType,
                    convertConstant: '2'
                }).then(res => {
                    let data = res.data.data;                   
                    this.ruleForm.birthDate = data.birthDate == null ? '' : data.birthDate;
                    this.ruleForm.cardId = data.cardId == null || data.cardId == 0 ? '' : data.cardId;
                    this.ruleForm.cardType = data.cardType == null || data.cardType == 0 ? '' : data.cardType;
                    this.ruleForm.gender = data.gender == null || data.gender == 0 ? '' : data.gender.toString();
                    this.ruleForm.mobile = data.mobile == null ? '' : data.mobile;
                    this.ruleForm.name = data.name == null ? '' : data.name;
                    this.ruleForm.username = data.username == null ? '' : data.username;
                    this.ruleForm.position = data.position == null || data.position == 0 ? '' : data.position;
                    this.ruleForm.peopleState = data.peopleState == null || data.peopleState == 0 ? '' : data.peopleState;
                    this.ruleForm.peopleSchoolState = data.peopleSchoolState == null || data.peopleSchoolState == 0 ? '' : data.peopleSchoolState;
                    this.ruleForm.departData = {departJson: this.getAddresDepartJson(data.departs)};
                    this.ruleForm.releaseDepartData = {departJson: this.getReleaseAddresDepartJson(data.userGrants)};
                    this.chosedRoles = data.roles;
                    this.status = data.status;
                    this.ruleForm.mainDepartId = data.mainDepart? data.mainDepart.id :  this.ruleForm.departData.departJson[0].id;
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
