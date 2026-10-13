<template>
    <div class="teacher-detail app-container calendar-list-container panel-box">
        <backtool>
            <reset-password :userId="id"></reset-password>
            <el-button size="medium" type="primary" v-if="isShowByPermission('/userDepart/manage')"
                       @click="isShowChangeLoginnameDialog = true">修改用户名
            </el-button>
        </backtool>
        <div :style="{'height':nobottommaxH+'px'}" style="overflow: auto">
            <div class="main-container">
                <div class="header-section">
                    <div class="avatar" :style="{backgroundImage: `url(${avatar})`}"></div>
                    <div>{{name}}（<span v-html="loginname"></span>）</div>
                </div>
                <div class="section">
                    <div class="section-title">
                        <img src="https://cdnfile-10043692.file.myqcloud.com/vuewxcep/common_img/user_role.png"
                             class="section-title__icon"/>
                        <span class="section-title__text">基础信息</span>
                        <span class="edit-btn-container" v-if="isShowByPermission('/userDepart/manage')"
                              @click="jumpToPage('teacherAddEdit', {userType, id})">
                            编辑&nbsp;&gt;
                        </span>
                    </div>
                    <div class="section-content">
                        <div class="row">
                            <el-row :gutter="10">
                                <el-col :span="12">
                                    <span class="label">姓名：</span>
                                    <span class="value">{{name}}</span>
                                </el-col>
                                <el-col :span="12">
                                    <span class="label">手机号码：</span>
                                    <span class="value">{{mobile}}</span>
                                </el-col>
                            </el-row>
                        </div>
                        <div class="row">
                            <el-row :gutter="10">
                                <el-col :span="12">
                                    <span class="label">性别：</span>
                                    <span class="value">{{gender | genderFilter}}</span>
                                </el-col>
                                <el-col :span="12">
                                    <span class="label">出生日期：</span>
                                    <span class="value">{{birthDate}}</span>
                                </el-col>
                            </el-row>
                        </div>
                        <div class="row">
                            <el-row :gutter="10">
                                <el-col :span="12">
                                    <span class="label">身份证件类别：</span>
                                    <span class="value">{{cardTypeText}}</span>
                                </el-col>
                                <el-col :span="12">
                                    <span class="label">证件号：</span>
                                    <span class="value">{{cardId}}</span>
                                </el-col>
                            </el-row>
                        </div>
                        <div class="row">
                            <el-row :gutter="10">
                                <el-col :span="12">
                                    <span class="label">用户名：</span>
                                    <span class="value" v-html="loginname"></span>
                                </el-col>
                                <el-col :span="12">
                                    <span class="label">角色：</span>
                                    <span class="value">
                                        <span class="value--role">
                                             <template v-for="item in chosedRoles" >
                                            {{item.name}}&nbsp;&nbsp;&nbsp;&nbsp;
                                        </template>
                                        </span>
                                       <div class="show-all-role" @click="isShowAllRole = true">查看全部</div>
                                    </span>
                                </el-col>
                            </el-row>
                        </div>
                        <div class="row">
                            <el-row :gutter="10">
                                <el-col :span="12">
                                    <span class="label">所在部门：</span>
                                    <span class="value">
                                        <template v-for="item in departs" >
                                            {{item.name}}&nbsp;&nbsp;&nbsp;&nbsp;
                                        </template>
                                    </span>
                                </el-col>
                                <el-col :span="12">
                                    <span class="label">发布范围：</span>
                                    <span class="value">
                                        <template v-for="item in releaseDepartData" >
                                            {{item.departName}}&nbsp;&nbsp;&nbsp;&nbsp;
                                        </template>
                                    </span>
                                </el-col>
                            </el-row>
                        </div>
                        <div class="row">
                            <el-row :gutter="10">
                                <el-col :span="12">
                                    <span class="label">主部门：</span>
                                    <span class="value" v-if="mainDepart">
                                        {{mainDepart.name}}
                                    </span>
                                </el-col>
                                <el-col :span="12">
                                    <span class="label">职务：</span>
                                    <span class="value">
                                        {{positionText}}
                                    </span>
                                </el-col>
                                
                            </el-row>
                        </div>
                        <div class="row">
                            <el-row :gutter="10">
                                <el-col :span="12">
                                    <span class="label">人员状态：</span>
                                    <span class="value">
                                        {{peopleStateText}}
                                    </span>
                                </el-col>
                                <el-col :span="12">
                                    <span class="label">教师类型：</span>
                                    <span class="value">
                                        {{peopleSchoolStateText}}
                                    </span>
                                </el-col>

                            </el-row>
                        </div>
                    </div>
                </div>
                <div class="section">
                    <div class="section-title">
                        <img src="https://cdnfile-10043692.file.myqcloud.com/vuewxcep/common_img/user_role.png"
                             class="section-title__icon"/>
                        <span class="section-title__text">档案信息</span>
                        <span class="edit-btn-container" v-if="isShowByPermission('/userDepart/manage')"
                              @click="jumpToPage('teacherArchiveAddEdit', {id})">
                            编辑&nbsp;&gt;
                        </span>
                    </div>
                    <div class="section-content">
                        <div class="row">
                            <el-row :gutter="10">
                                <el-col :span="12">
                                    <span class="label">民族：</span>
                                    <span class="value">
                                        {{nationText}}
                                    </span>
                                </el-col>
                                <el-col :span="12">
                                    <span class="label">籍贯：</span>
                                    <span class="value">
                                        {{nativenPlace}}&nbsp;&nbsp;&nbsp;&nbsp;
                                    </span>
                                </el-col>
                            </el-row>
                        </div>
                    </div>
                    <div class="section-content">
                        <div class="row">
                            <el-row :gutter="10">
                                <el-col :span="12">
                                    <span class="label">政治面貌：</span>
                                    <span class="value">
                                        {{politicalCodeText}}&nbsp;&nbsp;&nbsp;&nbsp;
                                    </span>
                                </el-col>
                                <el-col :span="12">
                                    <span class="label">专业：</span>
                                    <span class="value">
                                        {{majorText}}
                                    </span>
                                </el-col>
                            </el-row>
                        </div>
                    </div>
                    <div class="section-content">
                        <div class="row">
                            <el-row :gutter="10">
                                <el-col :span="12">
                                    <span class="label">学历：</span>
                                    <span class="value">
                                        {{educationText}}
                                    </span>
                                </el-col>
                                <el-col :span="12">
                                    <span class="label">学位：</span>
                                    <span class="value">
                                        {{degreeText}}&nbsp;&nbsp;&nbsp;&nbsp;
                                    </span>
                                </el-col>
                            </el-row>
                        </div>
                    </div>
                    <div class="section-content">
                        <div class="row">
                            <el-row :gutter="10">
                                <el-col :span="12">
                                    <span class="label">职称：</span>
                                    <span class="value">
                                        {{professionalTitleText}}&nbsp;&nbsp;&nbsp;&nbsp;
                                    </span>
                                </el-col>
                                <el-col :span="12">
                                    <span class="label">荣誉称号：</span>
                                    <span class="value">
                                        {{honoraryTitle}}&nbsp;&nbsp;&nbsp;&nbsp;
                                    </span>
                                </el-col>
                            </el-row>
                        </div>
                    </div>
                    <div class="section-content">
                        <div class="row">
                            <el-row :gutter="10">
                                <el-col :span="12">
                                    <span class="label">教师编制：</span>
                                    <span class="value">
                                        {{teacherOrgText}}&nbsp;&nbsp;&nbsp;&nbsp;
                                    </span>
                                </el-col>
                                <el-col :span="12">
                                    <span class="label">从教年月：</span>
                                    <span class="value">
                                        {{teachDate}}&nbsp;&nbsp;&nbsp;&nbsp;
                                    </span>
                                </el-col>
                            </el-row>
                        </div>
                    </div>
                    <div class="section-content">
                        <div class="row">
                            <el-row :gutter="10">
                                <el-col :span="12">
                                    <span class="label">教师资格证：</span>
                                    <span class="value">
                                        {{certificateTypeText}}&nbsp;&nbsp;&nbsp;&nbsp;
                                    </span>
                                </el-col>
                                <el-col :span="12">
                                    <span class="label">教师资格证号：</span>
                                    <span class="value">
                                        {{certificateNum}}&nbsp;&nbsp;&nbsp;&nbsp;
                                    </span>
                                </el-col>
                            </el-row>
                        </div>
                    </div>
                    <div class="section-content">
                        <div class="row">
                            <el-row :gutter="10">
                                <el-col :span="12">
                                    <span class="label">具有上岗资质：</span>
                                    <span class="value">
                                        {{isPermission == 1 ? '是' : '否'}}&nbsp;&nbsp;&nbsp;&nbsp;
                                    </span>
                                </el-col>
                            </el-row>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <el-dialog title="修改用户名" :visible.sync="isShowChangeLoginnameDialog" :close-on-press-escape='false'
                   width="700px"
                   :close-on-click-modal='false' :modal-append-to-body='false'>
            <div class="change-passbox">
                <el-form :model="formData" status-icon :rules="rules" ref="ruleForm" label-width="100px">
                    <el-form-item label="用户名" prop="loginname">
                        <el-input type="text" :maxlength="40" v-model="formData.loginname"
                                  auto-complete="off" @change="formData.loginname = formData.loginname.trim()"></el-input>
                    </el-form-item>
                    <el-form-item label="" v-if="schoolInfo.syncForWx== 1">
                      <el-checkbox v-model="formData.onlyModifySys">仅修改系统用户名，不修改企业微信端</el-checkbox>
                    </el-form-item>
                    <el-form-item label="" v-if="schoolInfo.syncForWx== 1" label="备注">
                   该账号具有老师身份，修改用户名需要重新关注！
                    </el-form-item>
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="isShowChangeLoginnameDialog = false">取 消</el-button>
                <el-button type="primary" @click="changeLoginname">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog title="全部角色" :visible.sync="isShowAllRole">
            <div class="all_role_list">
                <div class="line_box" :key="item.moduleId" v-for="item in roleList">
                    <div class="module_name">{{item.moduleName}}</div>
                    <div class="module_role_list">
                        <el-tag style="margin-right: 5px;" :key="indexd" v-for="(roleItem,indexd) in item.data">{{roleItem.name}}</el-tag>
                    </div>
                </div>
            </div>
        </el-dialog>
    </div>
</template>
<script>
    import {isShowByPermission} from '@/utils';
    import {mapGetters} from 'vuex';
    import Backtool from "@/components/BackTool";
    import ResetPassword from '@/views/sysSet/org/user/resetPassword';//重设密码
    import {getUserDetail, getUserDetailArchive, updateLoginname} from '@/api/systemSet/org';
    import mixin from '@/mixins/windowResize';
    import {getValueFromDicCode, parseToConstants} from '@/utils/utils';
    import {
        queryRoleAndModuleByUserId
    } from "@/api/systemSet/org.js";

    export default {
        components: {
            Backtool,
            ResetPassword
        },
        data() {
            return {
                isShowAllRole: false,
                isShowChangeLoginnameDialog: false,
                formData: {
                    loginname: '',
                    onlyModifySys:false
                },
                rules: {
                    loginname: [
                        {required: true, message: '请填写用户名', trigger: 'blur'}
                    ],
                },

                id: this.$route.query.id,
                userType: this.$route.query.userType,
                avatar: '',
                name: '',
                birthDate: '',
                cardId: '',
                cardTypeText: '',
                gender: 0,
                mobile: '',
                loginname: '',
                departs: [],
                releaseDepartData: {},
                mainDepart:{name:''},
                roleList: [],
                chosedRoles: [],
                source: '',
                nationText: '',
                nativenPlace: '',
                peopleStateText: '',
                politicalCodeText: '',
                peopleSchoolStateText: '',
                educationText: '',
                degreeText: '',
                majorText: '',
                positionText: '',
                honoraryTitle: '',
                professionalTitleText: '',
                teacherOrgText: '',
                certificateTypeText: '',
                certificateNum: '',
                teachDate: '',
                isPermission: 2               

            }
        },
        mixins: [mixin],
        filters: {
            genderFilter(value) {
                return ['', '男', '女'][value];
            },
        },
        computed: {
            ...mapGetters(['schoolInfo'])
        },
        created() {
            this.getUserDetailFunc();
            getUserDetailArchive({
                userId: this.id,
            })
                .then(res => res.data)
                .then(data => {
                    const pageData = data.data;
                    getValueFromDicCode(pageData.nation, 'national')
                        .then(text => {
                            this.nationText = text;
                        });
                    this.nativenPlace = pageData.nativenPlace;
                    this.politicalCodeText = parseToConstants(pageData.politicalCode, 'politicalCodeConstants');
                    this.educationText = parseToConstants(pageData.education, 'educationConstants');
                    this.degreeText = parseToConstants(pageData.degree, 'educationDegreeConstants');
                    this.majorText = parseToConstants(pageData.major, 'teacherMajorConstants');
                    this.professionalTitleText = parseToConstants(pageData.professionalTitle, 'honoraryTitleConstants');
                    this.teacherOrgText = parseToConstants(pageData.teacherOrg, 'teacherOrgConstants');
                    this.certificateTypeText = parseToConstants(pageData.certificateType, 'teacherCertTypeConstants');
                    this.certificateNum = pageData.certificateNum;
                    this.honoraryTitle = pageData.honoraryTitle;
                    this.teachDate = pageData.teachDate;
                    this.isPermission = pageData.isPermission;
                });
        },
        methods: {
            isShowByPermission,
            queryRoleAndModuleByUserIdFunc() {
                queryRoleAndModuleByUserId({
                    userId: this.id,
                    source: this.source || 'teacher'
                })
                    .then(res => {
                        let data = res.data.data;
                        let newArray = [];
                        data.forEach(item => {
                            let newItemArray = [];
                            let lineData = JSON.parse(JSON.stringify(item)).data;
                            lineData.forEach(roleItem => {
                                if (this.chosedRoles.map(item => item.id).indexOf(roleItem.id) > -1) {
                                    newItemArray.push(roleItem);
                                }
                            });
                            if (newItemArray.length) {
                                newArray.push({
                                    moduleName: item.moduleName,
                                    data: newItemArray
                                });
                            }
                        });
                        this.roleList = newArray;
                    })
                    .catch();
            },
            getUserDetailFunc() {
                getUserDetail({
                    userId: this.id,
                    userType: this.userType,
                    convertConstant: '2'
                }).then(res => {
                    let data = res.data.data;
                    this.avatar = data.avatar;
                    this.name = data.name;
                    this.loginname = data.loginname;
                    this.mobile = data.mobile;
                    this.gender = data.gender;
                    this.birthDate = data.birthDate;
                    this.cardId = data.cardId;
                    this.departs = data.departs;
                    this.positionText = parseToConstants(data.position, 'positionConstants');
                    this.peopleSchoolStateText = ['', '教师', '职工'][data.peopleSchoolState];
                    getValueFromDicCode(data.cardType, 'cardType')
                        .then(text => {
                            this.cardTypeText = text;
                        });
                    this.peopleStateText = parseToConstants(data.peopleState, 'allPeopleStateConstants');

                    this.releaseDepartData = data.userGrants;
                    this.mainDepart=data.mainDepart;
                    this.chosedRoles = data.roles;
                    this.formData.loginname = data.loginname;
                    this.checkUserSource(this.chosedRoles);//检查用户身份
                    this.queryRoleAndModuleByUserIdFunc();

                }).catch();
            },
            changeLoginname() {
                this.$refs.ruleForm.validate(isValid => {
                    if(isValid) {
                        updateLoginname({
                            userId: this.id,
                            loginname: this.formData.loginname,
                            onlyModifySys: this.formData.onlyModifySys
                        })
                            .then(res => res.data)
                            .then(data => {
                                if (data.result) {
                                    this.isShowChangeLoginnameDialog = false;
                                    this.$message.success('修改成功');
                                    this.getUserDetailFunc();
                                } else {
                                    this.$message.error(data.msg);
                                }
                            });
                    }
                });
            },
            jumpToPage(path, query) {
                if (query === null || query === undefined) {
                    query = {};
                }
                this.$router.push({
                    path,
                    query
                })
            },
            checkUserSource(data) {
                if (data) {
                    data.forEach(function (item) {
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
<style lang="scss" scoped>
    @import "../../../../styles/mixin";

    .teacher-detail {
        overflow-x: auto;

    }

    .main-container {
        margin: 10px auto;
        width: 1050px;
        border: 1px solid #E0E0E0;
    }

    .header-section {
        background-color: #E6F3F9;
        height: 100px;
        line-height: 98px;
        font-size: 22px;
        color: #0099E7;

        & > * {
            @include middleIB;
        }
    }

    .avatar {
        width: 70px;
        height: 70px;
        border: 2px solid #fff;
        @include cover-bg;
        border-radius: 50%;
        margin-left: 25px;
        margin-right: 52px;
    }

    .section-title__icon {
        width: 30px;
        height: 30px;
        position: relative;
        top: 4px;
    }

    .section-title__text {
        font-size: 20px;
        margin-top: 20px;
        line-height: 30px;
        color: #76C1E0;
    }

    .section {
        padding: 44px 30px 0 30px;
        margin-top: -20px;

        &:first-of-type {
            margin-top: 0 !important;

        }
    }

    .row {
        margin: 20px 0;
    }

    .label {
        width: 7em;
        text-align: right;
        display: inline-block;
        vertical-align: top;
    }

    .value {
        display: inline-block;
        width: 22em;
        vertical-align: top;

    }

    .edit-btn-container {
        float: right;
        color: #76C1E0;
        cursor: pointer;
        margin-top: 10px;
    }

    .value--role {
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
        float: left;
        margin-right: 20px;
        max-height: 54px;
    }

    .show-all-role {
        cursor: pointer;
        clear: both;
        color: #76C1E0;
        margin-top: 10px;
    }

    ul, ol {
        list-style-type: none;
    }

    .role-list {
        @include clearfix;
    }

    .role-item {
        float: left;
        margin-right: 10px;
    }

    .all_role_list {
        .line_box {
            display: flex;
            margin-bottom: 10px;

            .module_name {
                width: 130px;
                margin-right: 20px;
                text-align: right;
                font-weight: 700;
                line-height: 32px;
            }

            .module_role_list {
                flex: 1;
            }
        }
    }
</style>


