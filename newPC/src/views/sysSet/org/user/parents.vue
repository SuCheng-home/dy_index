<template>
    <div id="parentsOrg" class="app-container calendar-list-container">
        <backtool>
            <el-button type="primary" @click="addParent" size="medium" v-if="isShowByPermission('/userDepart/manage')">
                新建家长
            </el-button>
        </backtool>
        <div class="content">
            <el-table stripe key='parentsTable' :data="list" v-loading.body="listLoading" border fit
                      highlight-current-row style="width: 100%" :height="nobottommaxH">
                <el-table-column type="selection" width="55"
                                 v-if="isShowByPermission('/userDepart/manage')"></el-table-column>
                <el-table-column align="center" label="头像" width="70">
                    <template slot-scope="scope">
                        <img :src="scope.row.avatar" class="org-avatar"/>
                    </template>
                </el-table-column>
                <el-table-column label="姓名" min-width="150">
                    <template slot-scope="scope">
                        <span>{{scope.row.nick}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="用户名" min-width="150">
                    <template slot-scope="scope">
                        <span>{{scope.row.loginname}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="性别" width="150">
                    <template slot-scope="scope">
                        <span class="gender masculinity" v-if="scope.row.gender==1"><i class="fa fa-mars"
                                                                                       aria-hidden="true"></i></span>
                        <span class="gender femininity" v-if="scope.row.gender==2"><i class="fa fa-venus"
                                                                                      aria-hidden="true"></i></span>
                        <span v-if="scope.row.gender==0">--</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="手机号码" width="150">
                    <template slot-scope="scope">
                        <span>{{scope.row.mobile}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="tag" align="center" label="状态" width="250" :filter-multiple='false'>
                    <template slot-scope="scope">
                        <el-tag  size="mini" v-if="scope.row.status==1" type="success">关注</el-tag>
                        <el-tag  size="mini" v-if="scope.row.status==2" type="gray">禁用</el-tag>
                        <el-tag  size="mini" v-if="scope.row.status==4" type="danger">未关注</el-tag>
                    </template>
                </el-table-column>

                <el-table-column align="center" label="操作" width="150" v-if="isShowByPermission('/userDepart/manage')">
                    <template slot-scope="scope">
                        <el-button size="small" type="text"
                                   @click.native="changeParentLoginname(scope.row)">修改用户名
                        </el-button>
                        <el-button size="small" type="text" :disabled="scope.row.noticeState===2"
                                   @click.native="updateParent(scope.row)">编辑
                        </el-button>
                        <el-button size="small" type="text" @click.native="deleteParent(scope.row)" class="buttontextred">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>


        <el-dialog :title="flag=='add'?'新建家长':'修改家长'" :visible.sync="dialogFormVisible" :close-on-press-escape='false'
                   :close-on-click-modal='false' :modal-append-to-body='false' width="720px"
                   :before-close="isDialogFormVisible">
            <div class="form-box parent-form-box">
                <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                    <div class="layout">
                        <el-form-item label="姓名" prop="name">
                            <el-input v-model.trim="ruleForm.name" placeholder="姓名"></el-input>
                        </el-form-item>
                        <el-form-item label="称呼" prop="nick">
                            <el-select v-model="ruleForm.nick" placeholder="请选择" @change="nickChange">
                                <el-option v-for="item in nickList" :key="item.value" :label="item.label"
                                           :value="item.label"></el-option>
                            </el-select>
                        </el-form-item>
                    </div>
                    <div class="layout">
                        <el-form-item label="手机" prop="mobile">
                            <el-input v-model.trim="ruleForm.mobile" class="mobile-input" auto-complete="off"
                                      @click.native="mobileClick"
                                      :readonly="flag != 'add' && !isMobileChangeValid()"></el-input>
                        </el-form-item>
                        <el-form-item label="性别" prop="gender">
                            <el-select v-model="ruleForm.gender" placeholder="请选择">
                                <el-option v-for="item in genderList" :key="item.value" :label="item.label"
                                           :value="item.value"></el-option>
                            </el-select>
                        </el-form-item>
                    </div>
                    <div class="layout">
                        <el-form-item label="身份证" prop="cardId">
                            <el-input v-model.trim="ruleForm.cardId" placeholder="请输入身份证"></el-input>
                        </el-form-item>
                        <el-form-item label="学历" prop="education">
                            <el-select v-model="ruleForm.education" placeholder="请选择学历">
                                <el-option v-for="item in educationList" :key="item.value" :label="item.label"
                                           :value="item.value"></el-option>
                            </el-select>
                        </el-form-item>
                    </div>
                    <div class="layout">
                        <el-form-item label="工作单位" prop="company">
                            <el-input v-model.trim="ruleForm.company" placeholder="请输入工作单位"></el-input>
                        </el-form-item>
                        <el-form-item label="职务" prop="occupation">
                            <div class="occupation">
                                <el-input v-model.trim="ruleForm.occupation" placeholder="请输入职务"></el-input>
                            </div>
                        </el-form-item>
                    </div>
                    <div class="layout">
                        <el-form-item label="居住住址" prop="address">
                            <el-input v-model.trim="ruleForm.address" placeholder="请输入居住住址"></el-input>
                        </el-form-item>
                        <el-form-item label="家长关注账号" v-if="schoolInfo.tencentSchoolVersion == 2">
                            <el-input v-model.trim="ruleForm.externalUserid" placeholder="请输入家长关注账号"></el-input>
                        </el-form-item>
                    </div>

                </el-form>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="isDialogFormVisible">取 消</el-button>
                <el-button type="primary" :loading="saveLoading" @click="addOrUpdateParent">确 定</el-button>
            </div>
        </el-dialog>
        <el-dialog title="修改用户名" :visible.sync="isShowChangeLoginnameDialog" :close-on-press-escape='false'
                   width="700px"
                   :close-on-click-modal='false' :modal-append-to-body='false'>
            <div class="change-passbox">
                <el-form :model="formData" status-icon :rules="loginnameRule" ref="ruleForm" label-width="100px">
                    <el-form-item label="用户名" prop="loginname">
                        <el-input type="text" :maxlength="40" v-model="formData.loginname"
                                  auto-complete="off"></el-input>
                    </el-form-item>
                     <el-form-item label="" v-if="schoolInfo.syncForWx== 1">
                      <el-checkbox v-model="formData.onlyModifySys">仅修改系统用户名，不修改企业微信端</el-checkbox>
                    </el-form-item>
                     <el-form-item label="" v-if="schoolInfo.syncForWx== 1&&(schoolInfo.isExternalContact== 1||userInfo.type=='13')" label="备注">
                    由于家长在企业微信通讯录中，修改用户名需要重新关注！
                    </el-form-item>
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="isShowChangeLoginnameDialog = false">取 消</el-button>
                <el-button type="primary" @click="changeLoginname">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
    import {isShowByPermission} from '@/utils';

    import Backtool from "@/components/BackTool";
    import mixin from "@/mixins/windowResize";
    import {queryParent, addParent, updateParent, deleteParent, updateLoginname} from "@/api/systemSet/org.js";
    import {mapGetters} from 'vuex';

    export default {
        components: {
            Backtool
        },
        mixins: [mixin],
        data() {
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
            const checkCardId = (rule, value, callback) => {
                if (!value) {
                    return callback();
                }
                let g = /^[1-9][0-9]{5}(19|20)[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|31)|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|[1-2][0-9]))[0-9]{3}([0-9]|x|X)$/
                if (!g.test(value)) {
                    callback(new Error('身份证格式不正确！'));
                } else {
                    callback();
                }
            }
            const checkCompany = (rule, value, callback) => {
                if (value.trim().length > 50) {
                    callback(new Error('工作单位最大长度不能超过50!!'));
                } else {
                    callback();
                }
            }
            const checkOccupation = (rule, value, callback) => {
                if (value.trim().length > 50) {
                    callback(new Error('职务最大长度不能超过50!!'));
                } else {
                    callback();
                }
            }
            const checkNname = (rule, value, callback) => {
                if (value.trim().length > 20) {
                    callback(new Error('姓名最大长度不能超过20!!'));
                } else {
                    callback();
                }
            }
            return {
                isShowChangeLoginnameDialog: false,
                formData: {
                    loginname: '',
                     onlyModifySys:false
                },
                currentParentId: '',

                currentStatus: 1,
                currentType: 1,

                saveLoading: false,
                list: null,
                listLoading: false,
                dialogFormVisible: false,
                studentId: '',
                studentName: '',
                flag: '',
                status: 4,
                genderList: [
                    {
                        value: 1,
                        label: '男'
                    }, {
                        value: 2,
                        label: '女'
                    }],
                nickList: [
                    {
                        gender: 1,
                        value: 0,
                        label: '爸爸'
                    }, {
                        gender: 2,
                        value: 1,
                        label: '妈妈'
                    }, {
                        gender: 1,
                        value: 2,
                        label: '爷爷'
                    },
                    {
                        gender: 2,
                        value: 3,
                        label: '奶奶'
                    }, {
                        gender: 1,
                        value: 4,
                        label: '外公'
                    }, {
                        gender: 2,
                        value: 5,
                        label: '外婆'
                    }, {
                        gender: 1,
                        value: 6,
                        label: '家长'
                    }],
                educationList: [
                    {value: 0, label: '无'},
                    {value: 1, label: '小学'},
                    {value: 2, label: '初中'},
                    {value: 3, label: '中专'},
                    {value: 4, label: '高职'},
                    {value: 5, label: '高中'},
                    {value: 6, label: '大学专科'},
                    {value: 7, label: '大学本科'},
                    {value: 8, label: '研究生/硕士'},
                    {value: 9, label: '研究生/博士'},
                    {value: 10, label: '研究生/博士后'}
                ],
                ruleForm: {
                    nick: '爸爸',
                    mobile: '',
                    gender: 1,
                    id: '',
                    name: '',//姓名
                    cardId: '',
                    education: 0, //学历
                    company: '',//工作单位
                    occupation: '',//职务
                    externalUserid: '',
                    address: ''
                },
                rules: {
                    nick: [
                        {required: true, message: "请选择称呼！", trigger: "blur"}
                    ],
                    mobile: [
                        {required: true, validator: checkMobile, trigger: 'blur'}
                    ],
                    gender: [
                        {required: true, message: "请选择性别！", trigger: 'blur'}
                    ],
                    cardId: [
                        {validator: checkCardId, trigger: 'blur'}
                    ],
                    company: [
                        // {max: 50, message: '工作单位最大长度不能超过50!',trigger: 'blur'}
                        {validator: checkCompany, trigger: 'blur'}
                    ],
                    occupation: [
                        // {max: 50, message: '工作单位最大长度不能超过50!',trigger: 'blur'}
                        {validator: checkOccupation, trigger: 'blur'}
                    ],
                    name: [
                        // {max: 50, message: '工作单位最大长度不能超过50!',trigger: 'blur'}
                        {validator: checkNname, trigger: 'blur'}
                    ],

                },
                loginnameRule: {
                    loginname: [
                        {required: true, message: '请填写用户名', trigger: 'blur'}
                    ],
                }
            };
        },
        computed: {
            ...mapGetters(['schoolInfo', 'userInfo'])
        },
        created() {
            this.studentId = this.$route.query.studentId;
            this.studentName = this.$route.query.studentName;
            this.getList();
        },
        methods: {
            isShowByPermission,
            changeParentLoginname(item) {
                this.isShowChangeLoginnameDialog = true;
                this.formData.loginname = item.loginname;
                this.currentParentId = item.id;
            },
            changeLoginname() {
                updateLoginname({
                    userId: this.currentParentId,
                    loginname: this.formData.loginname,
                    onlyModifySys: this.formData.onlyModifySys
                })
                    .then(res => res.data)
                    .then(data => {
                        if (data.result) {
                            this.isShowChangeLoginnameDialog = false;
                            this.$message.success('修改成功');
                            this.getList();
                        } else {
                            this.$message.error(data.msg);
                        }
                    });
            },
            mobileClick() {
                if (!this.checkMobileReadonly() && this.flag !== 'add') {
                    let isExternalContact = false;
                    if (this.schoolInfo.isExternalContact == 1) {
                        isExternalContact = true;
                    }
                    if (isExternalContact) {
                        // 新家校提示
                        this.$message.error("该成员已登录过企业微信，需由成员自行修改手机号");
                    } else {
                        this.$message.error("新家校模式下未关注的家长以及已关注的老师不允许修改手机号");
                    }
                }
            },
            isMobileChangeValid() {
                let isValid = true;
                if(this.schoolInfo.schoolType == 12) {
                    isValid = this.checkMobileReadonly() && this.schoolInfo.syncForWx == 2;
                } else {
                    isValid = this.checkMobileReadonly();
                }
                return isValid;
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
            isDialogFormVisible() {
                this.dialogFormVisible = false;
                this.$refs['ruleForm'].resetFields();
            },
            getList() {
                this.listLoading = true;
                queryParent(this.studentId).then(res => {
                    let data = res.data.data;
                    this.list = data;
                    this.listLoading = false;
                })
                    .catch(err => {
                        this.listLoading = false;
                    });
            },
            addParent() {
                this.ruleForm.gender = 1;
                this.status = 4;
                this.ruleForm.gender = 1;
                this.ruleForm.mobile = '';
                this.ruleForm.nick = '爸爸';
                this.ruleForm.cardId = '';//身份证
                this.ruleForm.name = '';//姓名
                this.ruleForm.education = 0; //学历
                this.ruleForm.company = ''; //单位
                this.ruleForm.occupation = ''; //职务
                this.ruleForm.address = '';
                this.ruleForm.externalUserid = '';
                this.flag = 'add';
                this.dialogFormVisible = true;
            },
            updateParent(row) {
                this.currentStatus = row.status;
                this.currentType = row.type;

                this.ruleForm.gender = row.gender; //性别
                this.ruleForm.mobile = row.mobile;// 手机号
                let nickName = row.nick ? row.nick.replace(this.studentName, '') : '';

                //处理nickList，将列表中不存在的昵称放入集合中，为了兼容老数据
                let commanList = this.nickList.filter(function (item) {
                    return item.label == nickName;
                });
                if (commanList.length == 0) {//如果不存在相同数据
                    let arry = this.nickList;
                    this.nickList = arry.concat([{gender: row.gender, value: 7, label: nickName}]);
                }
                this.ruleForm.id = row.id;
                this.ruleForm.nick = nickName;
                this.flag = 'edit';
                this.dialogFormVisible = true;
                this.ruleForm.cardId = row.cardId //身份证
                this.ruleForm.education = row.education == null ? 0 : parseInt(row.education);  // 学历
                this.ruleForm.name = row.parentName == null ? '' : row.parentName // 姓名
                this.ruleForm.company = row.parentUnit == null ? '' : row.parentUnit
                this.ruleForm.occupation = row.parentPosition == null ? '' : row.parentPosition// 姓名
                this.ruleForm.externalUserid = row.externalUserid == null ? '' : row.externalUserid// 姓名
                this.ruleForm.address = row.address == null ? '' : row.address
                this.status = row.status;
            },
            addOrUpdateParent() {
                this.$refs['ruleForm'].validate(valid => {
                    if (valid) {
                        this.saveLoading = true;
                        if (this.flag == 'add') {
                            let query = {
                                gender: parseInt(this.ruleForm.gender),
                                mobile: this.ruleForm.mobile,
                                nick: this.ruleForm.nick,
                                studentId: this.studentId,
                                studentName: this.studentName,
                                parentName: this.ruleForm.name, //家长姓名
                                cardId: this.ruleForm.cardId, //身份证
                                education: this.ruleForm.education,//学历
                                parentUnit: this.ruleForm.company,// 单位
                                parentPosition: this.ruleForm.occupation,//职务
                                address: this.ruleForm.address,
                                externalUserid: this.ruleForm.externalUserid
                            };
                            addParent(query).then(res => {
                                let data = res.data;
                                let _this = this;
                                if (data.code == 200) {
                                    this.$message({
                                        message: '添加成功！',
                                        type: 'success',
                                        duration: 1000,
                                        onClose: function () {
                                            _this.getList();
                                            _this.saveLoading = false;
                                            _this.dialogFormVisible = false;
                                        }
                                    });
                                } else {
                                    this.saveLoading = false;
                                    this.$message({
                                        message: data.msg,
                                        type: 'error',
                                    });
                                }

                            }).catch(err => {
                                this.saveLoading = false;
                            });
                        } else {
                            let query = {
                                id: this.ruleForm.id,
                                gender: this.ruleForm.gender,
                                mobile: this.ruleForm.mobile, //手机
                                nick: this.ruleForm.nick,//昵称
                                studentId: this.studentId,
                                studentName: this.studentName,
                                parentName: this.ruleForm.name, //家长姓名
                                cardId: this.ruleForm.cardId, //身份证
                                education: this.ruleForm.education,//学历
                                parentUnit: this.ruleForm.company,// 单位
                                parentPosition: this.ruleForm.occupation,//职务
                                address: this.ruleForm.address,
                                externalUserid: this.ruleForm.externalUserid

                            };
                            updateParent(query).then(res => {
                                let data = res.data;
                                let _this = this;
                                if (data.code == 200) {
                                    this.$message({
                                        message: '修改成功！',
                                        type: 'success',
                                        duration: 1000,
                                        onClose: function () {
                                            _this.getList();
                                            _this.saveLoading = false;
                                            _this.dialogFormVisible = false;
                                        }
                                    });
                                } else {
                                    this.saveLoading = false;
                                    this.$message({
                                        message: data.msg,
                                        type: 'error',
                                    });
                                }

                            }).catch(err => {
                                this.saveLoading = false;
                            });
                        }

                    }
                });
            },
            deleteParent(row) {
                this.$confirm('确认要删除么?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let query = {
                        parentId: row.id,
                        parentLoginname: row.loginname,
                        parentType: row.type,
                        studentId: this.studentId
                    };
                    deleteParent(query)
                        .then(res => res.data)
                        .then(data => {
                            if (data.code == 200) {
                                this.getList();
                            } else {
                                this.$message.error(data.msg);
                            }
                        })
                })
            },
            nickChange(val) {
                if (val) {
                    let gender = this.getGender(val);
                    this.ruleForm.gender = gender;
                }

            },
            getGender(val) {
                let currentNickItem = this.nickList.filter(function (item) {
                    return item.label == val;
                });
                return currentNickItem[0].gender;
            }
        }
    };
</script>
<style scoped>
    .gender {
        font-weight: bolder;
        font-size: 16px;
    }

    .masculinity {
        color: #20a0ff;
    }

    .femininity {
        color: #ff7575;
    }

    .form-box {
        width: 500px;
    }

    .org-avatar {
        width: 25px;
        height: 25px;
        position: relative;
        top: 4px;
    }

    .parent-form-box .el-select {
        width: 100%;
    }

    .layout {
        display: flex;
        width: 100%;
        justify-content: space-between;
    }

    .layout /deep/ .el-input__inner {
        width: auto;
    }

    .occupation /deep/ .el-input__inner {
        width: 219px;
    }
</style>
<style scoped>
    #parentsOrg .mobile-input [readonly="readonly"] {
        background-color: #ddd;
    }
</style>
