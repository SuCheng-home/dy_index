<template>
    <div class="teacher-detail app-container calendar-list-container panel-box">
        <backtool>
            <el-button size="medium" type="primary" v-if="isShowByPermission('/userDepart/manage')"
                       @click="isShowChangeLoginnameDialog = true">修改用户名
            </el-button>
            <reset-password :userId="id"></reset-password>
        </backtool>
        <div :style="{'height':nobottommaxH+'px'}" style="overflow: auto">
            <div class="main-container">
                <div class="header-section">
                    <div class="avatar" :style="{backgroundImage: `url(${avatar})`}"></div>
                    <div>{{name}}（<span v-html="loginname"></span>）<span class="class-name"
                                       v-if="departs && departs.length !== 0">{{departs[0].name}}</span></div>
                </div>
                <div class="section">
                    <div class="section-title">
                        <img src="https://cdnfile-10043692.file.myqcloud.com/vuewxcep/common_img/user_role.png"
                             class="section-title__icon"/>
                        <span class="section-title__text">基础信息</span>
                        <span class="edit-btn-container" v-if="isShowByPermission('/userDepart/manage')"
                              @click="jumpToPage('studentAddEdit', {userType, id, departId})">
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
                                    <span class="label">用户名：</span>
                                    <span class="value" v-html="loginname"></span>
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
                                <el-col v-if="schoolInfo.type != 1" :span="12">
                                    <span class="label">学籍号：</span>
                                    <span class="value">{{learnJi}}</span>
                                </el-col>
                                <el-col :span="12">
                                    <span class="label">是否在籍：</span>
                                    <span class="value">{{regdPopulation | zaijiFilter}}</span>
                                </el-col>
                            </el-row>
                        </div>
                        <div class="row">
                            <el-row :gutter="10">
                                <el-col :span="12">
                                    <span class="label">学号：</span>
                                    <span class="value">{{learnNum}}</span>
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
                              @click="jumpToPage('studentArchiveAddEdit', {id})">
                            编辑&nbsp;&gt;
                        </span>
                    </div>
                    <div class="section-content">
                        <div class="row">
                            <el-row :gutter="10">
                                <el-col :span="12">
                                    <span class="label">国籍：</span>
                                    <span class="value">
                                        {{nationalityText}}
                                    </span>
                                </el-col>
                                <el-col :span="12">
                                    <span class="label">民族：</span>
                                    <span class="value">
                                        {{nationText}}&nbsp;&nbsp;&nbsp;&nbsp;
                                    </span>
                                </el-col>
                            </el-row>
                        </div>
                    </div>
                    <div class="section-content">
                        <div class="row">
                            <el-row :gutter="10">
                                <el-col :span="12">
                                    <span class="label">港澳台侨外：</span>
                                    <span class="value">
                                        {{hk_tw_macaoText}}&nbsp;&nbsp;&nbsp;&nbsp;
                                    </span>
                                </el-col>
                                <el-col :span="12">
                                    <span class="label">出生所在地：</span>
                                    <span class="value">
                                        {{birthPlace}}
                                    </span>
                                </el-col>
                            </el-row>
                        </div>
                    </div>
                    <div class="section-content">
                        <div class="row">
                            <el-row :gutter="10">
                                <el-col :span="12">
                                    <span class="label">籍贯：</span>
                                    <span class="value">
                                        {{nativenPlace}}
                                    </span>
                                </el-col>
                                <el-col :span="12">
                                    <span class="label">血型：</span>
                                    <span class="value">
                                        {{bloodTypeText}}&nbsp;&nbsp;&nbsp;&nbsp;
                                    </span>
                                </el-col>
                            </el-row>
                        </div>
                    </div>
                    <div class="section-content">
                        <div class="row">
                            <el-row :gutter="10">
                                <el-col :span="12">
                                    <span class="label">户口性质：</span>
                                    <span class="value">
                                        {{accountNatureText}}&nbsp;&nbsp;&nbsp;&nbsp;
                                    </span>
                                </el-col>
                                <el-col :span="12">
                                    <span class="label">非农业户口类型：</span>
                                    <span class="value">
                                        {{nonAgricultureText}}&nbsp;&nbsp;&nbsp;&nbsp;
                                    </span>
                                </el-col>
                            </el-row>
                        </div>
                    </div>
                    <div class="section-content">
                        <div class="row">
                            <el-row :gutter="10">
                                <el-col :span="12">
                                    <span class="label">户口所在地：</span>
                                    <span class="value">
                                        {{houseRegistration}}
                                    </span>
                                </el-col>
                                <el-col :span="12">
                                    <span class="label">家庭地址：</span>
                                    <span class="value">
                                        {{address}}
                                    </span>
                                </el-col>
                            </el-row>
                        </div>
                    </div>
                    <div class="section-content">
                        <div class="row">
                            <el-row :gutter="10">
                                <el-col :span="12">
                                    <span class="label">入校日期：</span>
                                    <span class="value">
                                        {{startSchoolDate | dateFilter}}&nbsp;&nbsp;&nbsp;&nbsp;
                                    </span>
                                </el-col>
                                <el-col :span="12">
                                    <span class="label">就读方式：</span>
                                    <span class="value">
                                        {{attendSchoolTypeText}}&nbsp;&nbsp;&nbsp;&nbsp;
                                    </span>
                                </el-col>
                            </el-row>
                        </div>
                    </div>
                    <div class="section-content">
                        <div class="row">
                            <el-row :gutter="10">
                                <el-col :span="12">
                                    <span class="label">是否独生子女：</span>
                                    <span class="value">
                                        {{isOnlyChild == 1 ? '是' : isOnlyChild == 2 ? '否' : ''}}&nbsp;&nbsp;&nbsp;&nbsp;
                                    </span>
                                </el-col>
                                <el-col :span="12">
                                    <span class="label">是否留守儿童：</span>
                                    <span class="value">
                                        {{isStayChild == 1 ? '是' : isStayChild == 2 ? '否' : ''}}&nbsp;&nbsp;&nbsp;&nbsp;
                                    </span>
                                </el-col>
                            </el-row>
                        </div>
                    </div>
                    <div class="section-content">
                        <div class="row">
                            <el-row :gutter="10">
                                <el-col :span="12">
                                    <span class="label">进城务工人员子女：</span>
                                    <span class="value">
                                        {{isMigrantMorker == 1 ? '是' : isMigrantMorker == 2 ? '否' : ''}}&nbsp;&nbsp;&nbsp;&nbsp;
                                    </span>
                                </el-col>
                                <el-col :span="12">
                                    <span class="label">健康状况：</span>
                                    <span class="value">
                                        {{healthTypeText}}&nbsp;&nbsp;&nbsp;&nbsp;
                                    </span>
                                </el-col>
                            </el-row>
                        </div>
                    </div>
                    <div class="section-content">
                        <div class="row">
                            <el-row :gutter="10">
                                <el-col :span="12">
                                    <span class="label">是否残疾幼儿：</span>
                                    <span class="value">
                                        {{isDisabilityChild == 1 ? '是' : isDisabilityChild == 2 ? '否' : ''}}&nbsp;&nbsp;&nbsp;&nbsp;
                                    </span>
                                </el-col>
                                <el-col :span="12" v-if="isDisabilityChild == 1">
                                    <span class="label">残疾幼儿类别：</span>
                                    <span class="value">
                                        {{disabilityChildTypeText}}&nbsp;&nbsp;&nbsp;&nbsp;
                                    </span>
                                </el-col>
                            </el-row>
                        </div>
                    </div>
                    <div class="section-content">
                        <div class="row">
                            <el-row :gutter="10">
                                <el-col :span="12">
                                    <span class="label">是否孤儿：</span>
                                    <span class="value">
                                        {{isOrphan == 1 ? '是' : isOrphan == 2 ? '否' : ''}}&nbsp;&nbsp;&nbsp;&nbsp;
                                    </span>
                                </el-col>
                                <el-col :span="12">
                                    <span class="label">一寸照片：</span>
                                    <span class="value">
                                        <image-previewer tag="richtext">
                                            <img class="idPhoto" :src="idPhoto"/>
                                        </image-previewer>
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
                        <span class="section-title__text">家长信息</span>
                        <span class="edit-btn-container"
                              @click="jumpToPage('parents', {studentId: id, studentName: name})">
                            维护家长信息&nbsp;&gt;
                        </span>
                    </div>
                    <div class="section-content">
                        <div class="parent-item" v-for="parentItem in parentList">
                            <div class="parent-item__avatar"
                                 :style="{backgroundImage: `url(${parentItem.avatar})`}"></div>
                            <div class="parent-item__info">
                                <div class="parent-item__info-upper">
                                    <span class="parent-item__nick">{{parentItem.name}}</span>&nbsp;|
                                    <span class="parent-item__gender">{{parentItem.gender == 1 ? '男' : parentItem.gender == 2 ? '女' : ''}}</span>
                                </div>
                                <div class="parent-item__info-lower">
                                    <span>{{parentItem.mobile}}</span>&nbsp;&nbsp;
                                    <span>
                                        <el-tag v-if="parentItem.status==1" size="mini" plain type="success">关注</el-tag>
                                        <el-tag v-if="parentItem.status==2" size="mini" plain type="gray">禁用</el-tag>
                                        <el-tag v-if="parentItem.status==4" size="mini" plain type="danger">未关注</el-tag>
                                        <el-tag v-if="parentItem.status==5" size="mini" plain type="gray">退出</el-tag>
                                    </span>
                                </div>
                            </div>
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
                        <el-input type="text" :maxlength="40" v-model="formData.loginname" @change="formData.loginname = formData.loginname.trim()"
                                  auto-complete="off"></el-input>
                    </el-form-item>
                     <el-form-item label="" v-if="schoolInfo.syncForWx== 1">
                      <el-checkbox v-model="formData.onlyModifySys">仅修改系统用户名，不修改企业微信端</el-checkbox>
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
     import ResetPassword from './resetPassword';
    import Backtool from "@/components/BackTool";
    import ImagePreviewer from "@/components/ImagePreviewer/ImagePreviewer.vue";

    import {mapGetters} from 'vuex';
    import {getUserDetail, getStuDetailArchive, updateLoginname} from '@/api/systemSet/org';
    import mixin from '@/mixins/windowResize';
    import {getValueFromDicCode, parseToConstants} from '@/utils/utils';

    export default {
        components: {
            Backtool,
            ImagePreviewer,
            ResetPassword
        },
        data() {
            return {
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
                departId: this.$route.query.departId,
                name: '',
                loginname: '',
                avatar: '',
                gender: '',
                birthDate: '',
                learnNum: '',
                cardTypeText: '',
                cardId: '',
                learnJi: '',
                regdPopulation: '1',


                nationalityText: '',
                nationText: '',
                hk_tw_macaoText: '',
                birthPlace: '',
                nativenPlace: '',
                bloodTypeText: '',
                accountNatureText: '',
                nonAgricultureText: '',
                houseRegistration: '',
                address: '',
                startSchoolDate: '',
                attendSchoolTypeText: '',
                isOnlyChild: '',
                isStayChild: '',
                isMigrantMorker: '',
                healthTypeText: '',
                isDisabilityChild: '',
                isOrphan: '',
                disabilityChildTypeText: '',
                idPhoto: '',
                parentList: [],
                departs: []
            }
        },
        mixins: [mixin],
        filters: {
            genderFilter(value) {
                return ['', '男', '女'][value];
            },
            zaijiFilter(value) {
                return value ? ['', '在籍', '不在籍', '休学', '转出', '毕业'][value] : '';
            },
            dateFilter(value) {
                return value ? value.split(' ')[0] : '';
            }
        },
        computed: {
            ...mapGetters(['schoolInfo'])
        },
        created() {
            this.getUserDetailFunc();

            getStuDetailArchive({
                userId: this.id
            })
                .then(res => res.data)
                .then(data => {
                    const pageData = data.data;
                    getValueFromDicCode(pageData.nationality, 'nationality')
                        .then(text => {
                            this.nationalityText = text;
                        });
                    getValueFromDicCode(pageData.nation, 'national')
                        .then(text => {
                            this.nationText = text;
                        });
                    getValueFromDicCode(pageData.hk_tw_macao, 'hk_tw_macao')
                        .then(text => {
                            this.hk_tw_macaoText = text;
                        });
                    getValueFromDicCode(pageData.bloodType, 'bloodType')
                        .then(text => {
                            this.bloodTypeText = text;
                        });
                    getValueFromDicCode(pageData.healthType, 'healthType')
                        .then(text => {
                            this.healthTypeText = text;
                        });
                    if (pageData.isDisabilityChild == 1) {
                        getValueFromDicCode(pageData.disabilityChildType, 'disabilityChildType')
                            .then(text => {
                                this.disabilityChildTypeText = text;
                            });
                    }

                    this.birthPlace = pageData.birthPlace;
                    this.nativenPlace = pageData.nativenPlace;
                    this.accountNatureText = parseToConstants(pageData.accountNature, 'accountnatureConstants');
                    this.nonAgricultureText = parseToConstants(pageData.nonAgriculture, 'nonagricultureConstants');
                    this.houseRegistration = pageData.houseRegistration;
                    this.address = pageData.address;
                    this.startSchoolDate = pageData.startSchoolDate;
                    this.attendSchoolTypeText = parseToConstants(pageData.attendSchoolType, 'attendSchoolTypeConstants');
                    this.isOnlyChild = pageData.isOnlyChild;
                    this.isStayChild = pageData.isStayChild;
                    this.isMigrantMorker = pageData.isMigrantMorker;
                    this.isDisabilityChild = pageData.isDisabilityChild;
                    this.isOrphan = pageData.isOrphan;
                    this.idPhoto = pageData.idPhoto;
                })
        },
        methods: {
            isShowByPermission,
            jumpToPage(path, query) {
                if (query === null || query === undefined) {
                    query = {};
                }
                this.$router.push({
                    path,
                    query
                })
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
                    this.username = data.username;
                    this.learnNum = data.learnNum;
                    this.gender = data.gender;
                    this.birthDate = data.birthDate;
                    this.cardId = data.cardId;
                    this.learnJi = data.learnJi;
                    this.regdPopulation = data.regdPopulation;

                    getValueFromDicCode(data.cardType, 'cardType')
                        .then(text => {
                            this.cardTypeText = text;
                        });
                    this.formData.loginname = data.loginname;
                    this.parentList = data.relatives;
                    this.departs = data.departs;

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

        .class-name {
            margin-left: 20px;
            font-size: 16px;
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
        width: 10em;
        text-align: right;
        display: inline-block;
        vertical-align: top;
    }

    .value {
        display: inline-block;
        width: 18em;
        vertical-align: top;

    }

    .edit-btn-container {
        float: right;
        color: #76C1E0;
        cursor: pointer;
        margin-top: 10px;
    }

    .idPhoto {
        width: 60px;
    }

    .parent-item {
        width: 33%;
        margin: 10px 0;

        @include middleIB;

        & > * {
            @include middleIB;

        }

        .parent-item__avatar {
            @include wh(70px, 70px);
            @include cover-bg;
            border-radius: 50%;
            margin-right: 5px;
        }

        .parent-item__info-upper {
            font-size: 16px;
            font-weight: bold;
            margin-bottom: 10px;
        }

        .parent-item__gender {
            color: #999;
        }

        .parent-item__info-lower {
            font-size: 12px;
        }
    }

    .idPhoto {
        max-width: 100px;
    }
</style>


