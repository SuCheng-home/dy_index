<template>
    <div>
        <div class="resume-content el-table__body-wrapper"
             :style="{'height':isStandalone?(nobottommaxH+90):(nobottommaxH-70)+'px'}">
            <div class="resume-box">
                <div class="resume-top-box">
                    <div class="resume-top-box-top">
                        <div class="photo" :style="{backgroundImage:'url('+avatar+')'}"></div>
                        <div class="user-loginname">
                            <el-tooltip class="item" effect="dark" :content="name+'('+loginname+')'"
                                        placement="top-start">
                                <span>{{name}}({{loginname}})</span>
                            </el-tooltip>
                        </div>
                        <div class="div-button" v-if="isShowByPermission('/personalCenter/manage')">
                            <el-button type="primary" @click="syncUserInfo">与微信同步</el-button>
                            <el-button type="primary" @click="dialogVisible=true" v-if="!isBindingWx">绑定微信登录该学校
                            </el-button>
                            <el-button type="primary" @click="removeBindingWXs()" v-else>解除微信登录</el-button>
                        </div>
                    </div>
                </div>
                <div class="resume-details-box">
                    <div style="margin-bottom: 30px;">
                        <div class="user-info">
                            <img class="user-info-flag"
                                 src="https://cdnfile-10043692.file.myqcloud.com/vuewxcep/common_img/user_depart.png"/>
                            <span>所在部门</span>
                        </div>
                        <div class="info-list">
                            <span class="info-list-item" :key="item.id" v-for="item in departs">{{item.name}}</span>
                        </div>
                        <div class="user-info">
                            <img class="user-info-flag"
                                 src="https://cdnfile-10043692.file.myqcloud.com/vuewxcep/common_img/user_class.png"/>
                            <span>所教班级/课程</span>
                        </div>
                        <div class="info-list">
                            <span class="info-list-item" :key="item.classId" v-for="item in clsCourse">{{item.className+' / '+item.courseName}}</span>
                        </div>
                        <div class="user-info">
                            <img class="user-info-flag"
                                 src="https://cdnfile-10043692.file.myqcloud.com/vuewxcep/common_img/user_role.png"/>
                            <span>角色</span>
                        </div>
                        <div class="info-list">
                            <template v-if="roles.length < 5">
                                <span class="info-list-item" :key="item.id" v-for="item in roles">{{item.name}}</span>
                            </template>
                            <template v-else>
                                <span class="info-list-item" v-if="index < 10" :key="index"
                                      v-for="(item, index) in roles">{{item.name}}</span>
                                <span class="info-list-item-more" @click="dialogFormVisible = true">更多>></span>
                            </template>
                        </div>

                    </div>
                </div>
                <div class="resume-details-edit">
                    <div class="user-info">
                        <img class="user-info-flag"
                             src="https://cdnfile-10043692.file.myqcloud.com/mobile/images/Presentation/gerenxinxi.png"/>
                        <span>个人信息</span>
                        <span class="edit_btn" v-if="isShowByPermission('/personalCenter/manage')"
                              @click="loadEdit">修改<i class="el-icon-arrow-right"></i></span>
                    </div>
                    <div class="info-list">
                        <table class="other-table">
                            <tr>
                                <td class="other-table-left">性&nbsp;&nbsp;&nbsp;&nbsp;别：</td>
                                <td class="other-table-right">{{gender}}</td>
                                <td class="other-table-left">手机号码：</td>
                                <td class="other-table-right">{{mobile}}</td>
                            </tr>
                            <tr>
                                <td class="other-table-left">邮&nbsp;&nbsp;&nbsp;&nbsp;箱：</td>
                                <td class="other-table-right">{{email}}</td>
                                <td class="other-table-left">主教课程：</td>
                                <td class="other-table-right">{{mainTeachCourse ? mainTeachCourse : '-'}}</td>
                            </tr>
                            <tr>
                                <td class="other-table-left">出生日期：</td>
                                <td class="other-table-right">{{birthDate ? birthDate : '-'}}</td>
                                <td class="other-table-left">政治面貌：</td>
                                <td class="other-table-right">{{politicalCode ? politicalCode : '-'}}</td>
                            </tr>
                            <tr>
                                <td class="other-table-left">教师类型：</td>
                                <td class="other-table-right">{{filterTeacherType(teacherType)}}</td>
                                <td class="other-table-left">身份证号：</td>
                                <td class="other-table-right">{{cardId ? cardId : '-'}}</td>
                            </tr>
                            <tr>
                                <td class="other-table-left">职&nbsp;&nbsp;&nbsp;&nbsp;务：</td>
                                <td class="other-table-right">{{position ? position : '-'}}</td>
                            </tr>
                            <tr>
                                <td class="other-table-left">所在学校：</td>
                                <td class="other-table-right">{{schoolInfoname}}</td>
                            </tr>
                        </table>
                    </div>
                    <div class="user-info">
                        <img class="user-info-flag"
                             src="https://cdnfile-10043692.file.myqcloud.com/mobile/images/Presentation/guganjiaoshi.png"/>
                        <span>骨干信息</span>
                        <span class="edit_btn" v-if="isShowByPermission('/personalCenter/manage')"
                              @click="backbone">修改<i class="el-icon-arrow-right"></i></span>
                    </div>
                    <div class="info-list">
                        <table class="other-table">
                            <tr>
                                <td class="other-table-left">教师骨干类别：</td>
                                <td class="other-table-right">{{userTypeName}}</td>
                                <td class="other-table-left" v-if="userType==200">骨干类型：</td>
                                <td class="other-table-right">{{backboneTypeName ? backboneTypeName : '-'}}</td>
                            </tr>
                            <tr v-if="userType==200">
                                <td class="other-table-left">骨干评定时间：</td>
                                <td class="other-table-right">{{backboneTypeDate}}</td>
                                <td class="other-table-left">骨干证书：</td>
                                <td class="other-table-right">
                                    <image-previewer tag="richtext"><span class="img">
                                            <img :src="certificateFileUrl">
                                        </span>
                                    </image-previewer>
                                </td>
                            </tr>

                        </table>
                    </div>
                    <div class="user-info" v-if="showFaceBox">
                        <img class="user-info-flag"
                             src="https://cdnfile-10043692.file.myqcloud.com/mobile/images/personal_infor/faceManage.png"/>
                        <span>人脸相片</span>
                        <span class="edit_btn" @click="editUserFace">修改<i class="el-icon-arrow-right"></i></span>
                    </div>
                    <div class="info-list" v-if="showFaceBox">
                        <div class="face_img_list" v-if="faceList && faceList.length">
                            <img :src="item.imageUrl" :key="index" alt="" v-for="(item, index) in faceList"
                                 class="face_img_item">
                        </div>
                        <div class="no_upload_photo" v-else>
                            暂未上传人脸照片
                        </div>
                    </div>
                </div>
            </div>

        </div>
        <el-dialog title="查看用户角色" :visible.sync="dialogFormVisible" :close-on-press-escape='false'
                   :close-on-click-modal='false' :modal-append-to-body='false' width="810px">
            <div class="all_role_list">
                <div class="line_box" :key="index" v-for="(item, index) in showRoleList">
                    <div class="module_name">{{item.moduleName}}</div>
                    <div class="module_role_list">
                        <span class="role_item_box" :key="index + roleIndex" v-for="(roleItem, roleIndex) in item.data">{{roleItem.name}}</span>
                    </div>
                </div>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
            </div>
        </el-dialog>
        <el-dialog title="请输入登录密码" :visible.sync="dialogVisible" width="50%">
            <el-form :model="numberValidateForm" ref="numberValidateForm" label-width="100px" class="demo-ruleForm">
                <el-form-item label="密码" prop="password" :rules="[ { required: true, message: '请输入密码!'}]">
                    <el-input type="password" v-model.trim="numberValidateForm.password" autocomplete="off"></el-input>
                </el-form-item>

            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="dialogVisibles('numberValidateForm')">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog title="扫描二维码" :visible.sync="erdialogVisible" width="50%">
            <div class="login-code" id="login-code"></div>
        </el-dialog>

    </div>
</template>

<script>
    import {
        getSelfDetail,
        queryRoleAndModuleBySchoolId
    } from "@/api/systemSet/org.js";
    import mixin from "@/mixins/windowResize";
    import ResetPassword from "@/views/sysSet/org/user/resetPassword"; //重设密码
    import ImagePreviewer from '@/components/ImagePreviewer/ImagePreviewer.vue';
    import {encrypt} from '@/utils/utils';
    import {
        mapGetters
    } from 'vuex';
    import {
        getFaceUserByUserId,
        syncUserInfo,
        isInstallFaceBase,
        removeBindingWX,
        verify,
        bindingWx,
        isBindingWx, getUserBackboneInfo
    } from "@/api/faceManage";
    import {getWXInitData} from "@/api/login";
    import {isShowByPermission} from '@/utils';

    export default {
        name: "personalInfoIndex",
        components: {
            ResetPassword, ImagePreviewer
        },
        computed: {
            ...mapGetters(['schoolInfo', 'isStandalone'])
        },
        data() {
            return {
                schoolInfoname: '',
                cutH: 160,
                avatar: "",
                gender: 0,
                mobile: "",
                email: "",
                birthDate: "",
                name: "",
                cardId: "",
                loginname: "",
                departs: [],
                clsCourse: [],
                roles: [],
                education: "",
                degree: "",
                mainTeachCourse: "",
                politicalCode: "",
                position: "",
                teacherType: "",
                id: 0,
                type: "",
                faceList: [],
                showFaceBox: false,
                dialogFormVisible: false,
                showRoleList: [],
                isBindingWx: false,
                dialogVisible: false,
                erdialogVisible: false,
                numberValidateForm: {
                    password: ""
                },
                isNewPc: 0,
                backboneTypeDate: '',
                backboneTypeName: '',
                certificateFileUrl: '',
                userTypeName: '',
                userType: '',
                teacherTypeList: [
                    {
                        id: 100,
                        name: '普通老师（学科）'
                    },
                    {
                        id: 200,
                        name: '骨干老师（学科）'
                    },
                    {
                        id: 300,
                        name: '普通老师（德育）'
                    },
                    {
                        id: 400,
                        name: '骨干老师（德育）'
                    }
                ]
            };
        },
        mixins: [mixin],
        created() {
            this.schoolInfoname = this.schoolInfo.name;
            this.getSelfDetail();
            this.isInstallFaceBase();
            this.getUserBackboneInfos();
            if (this.$route.query.newPcid) {
                this.isNewPc = this.$route.query.newPcid;
            }
            isBindingWx()
                .then(res => {
                    this.isBindingWx = res.data.data.isBindingWx;
                })
                .catch(() => {
                });
            if (this.$route.query.code) {
                bindingWx(this.$route.query.code)
                    .then(res => {
                        if (res.data.code === 200) {
                            this.$message({
                                type: "success",
                                message: "绑定成功!"
                            });
                            this.getSelfDetail();
                            isBindingWx()
                                .then(res => {
                                    this.isBindingWx = res.data.data.isBindingWx;
                                })
                                .catch(() => {
                                });
                        }
                    })
                    .catch(() => {
                    });
            }
        },
        methods: {
            isShowByPermission,
            filterTeacherType(typeCode) {
                if (typeCode) {
                    const teacherTypeText = this.teacherTypeList[this.teacherTypeList.map(item => item.id).indexOf(parseInt(typeCode))].name;
                    return teacherTypeText;
                }
                return '-';
            },
            isInstallFaceBase() {
                isInstallFaceBase()
                    .then(res => {
                        if (res.data.code === 200 && res.data.data === "true") {
                            // 已安装
                            this.getFaceList();
                        }
                    })
                    .catch(() => {
                    });
            },
            loadEdit() {
                this.$router.push({
                    path: "personalInfoEdit",
                    query: {id: this.id, userType: this.type}
                });
            },
            getSelfDetail() {
                getSelfDetail("1")
                    .then(res => {
                        let data = res.data.data;
                        this.avatar = data.avatar;
                        if (data.gender === 0) {
                            this.gender = "未知";
                        }
                        if (data.gender === 1) {
                            this.gender = "男";
                        }
                        if (data.gender === 2) {
                            this.gender = "女";
                        }
                        this.mobile = data.mobile;
                        this.email = data.email;
                        this.birthDate = data.birthDate;
                        this.name = data.name;
                        this.cardId = data.cardId;
                        this.loginname = data.loginname;
                        this.departs = data.departs;
                        this.clsCourse = data.clsCourse;
                        this.roles = data.roles;
                        this.education = data.education;
                        this.mainTeachCourse = data.mainTeachCourse;

                        this.politicalCode = data.politicalCode;
                        this.degree = data.degree;
                        this.position = data.position;
                        if (data.teacherType == 0) {
                            this.teacherType = '100'
                        } else {
                            this.teacherType = data.teacherType
                        }
                        ;
                        this.id = data.id;
                        this.type = data.type;
                        this.queryRoleAndModuleBySchoolId();
                    })
                    .catch();
            },
            syncUserInfo() {
                syncUserInfo()
                    .then(res => {
                        if (res.data.code === 200) {
                            this.$message({
                                message: "同步成功",
                                type: "success"
                            });
                        }
                    })
                    .catch(() => {
                    });
            },
            getFaceList() {
                getFaceUserByUserId(parseInt(this.$store.getters.userInfo.id))
                    .then(res => {
                        let data = res.data.data;
                        if (res.data.code === 200 && data) {
                            this.faceList = [
                                {
                                    imageUrl: data.imageUrl
                                }
                            ];
                            this.showFaceBox = true;
                        }
                    })
                    .catch(() => {
                    });
            },
            editUserFace() {
                this.$router.push({
                    path: "faceManageUserEdit",
                    query: {
                        id: parseInt(this.$store.getters.userInfo.id),
                        isPersonal: 1
                    }
                });
            },
            queryRoleAndModuleBySchoolId() {
                queryRoleAndModuleBySchoolId()
                    .then(res => {
                        let data = res.data.data;
                        let newArray = new Array();
                        data.forEach(item => {
                            let newItemArray = new Array();
                            let lineData = JSON.parse(JSON.stringify(item)).data;
                            lineData.forEach(roleItem => {
                                if (this.roles.map(item => item.id).indexOf(roleItem.id) > -1) {
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

                        this.showRoleList = newArray;
                    })
                    .catch();
            },
            //验证密码
            dialogVisibles(formName) {
                let $this = this;
                $this.$refs[formName].validate(valid => {
                    if (valid) {
                        verify(encrypt($this.numberValidateForm.password))
                            .then(res => {
                                if (res.data.code === 200) {
                                    $this.$message({
                                        type: "success",
                                        message: "密码正确!"
                                    });
                                    $this.erdialogVisible = true;
                                    $this.dialogVisible = false;
                                    getWXInitData()
                                        .then(res => {
                                            let data = res.data.data;
                                            new WxLogin({
                                                id: "login-code",
                                                appid: data.appid,
                                                scope: "snsapi_login",
                                                redirect_uri: data.redirect_url,
                                                state: `WXLOGINNEWBINDOLD_${window.location.hostname}${window.location.pathname}`,
                                                style: "black",
                                                href: "https://cdnfile-10043692.file.myqcloud.com/vuewxcep/common_css/new_wx_login.css"
                                            });
                                        })
                                        .catch();
                                } else {
                                    $this.$message.error("密码错误请重新输入!");
                                    $this.numberValidateForm.password = "";
                                }
                            })
                            .catch(err => {
                            });
                    }
                });
            },
            //解除绑定
            removeBindingWXs() {
                this.$confirm("确定要解除绑定吗？", "提示", {
                    type: "warning"
                })
                    .then(() => {
                        removeBindingWX()
                            .then(res => {
                                if (res.data.code === 200) {
                                    this.$message({
                                        type: "success",
                                        message: "解除绑定成功!"
                                    });
                                    this.getSelfDetail();
                                    isBindingWx()
                                        .then(res => {
                                            this.isBindingWx = res.data.data.isBindingWx;
                                        })
                                        .catch(() => {
                                        });
                                }
                            })
                            .catch(err => {
                            });
                    })
                    .catch(() => {
                    });
            },
            //获取骨干信息
            getUserBackboneInfos() {
                getUserBackboneInfo(this.$store.getters.userInfo.id).then(res => {
                    let data = res.data.data;
                    if (data != null) {
                        this.backboneTypeDate = data.backboneTypeDate;
                        this.backboneTypeName = data.backboneTypeName;
                        this.certificateFileUrl = data.certificateFileUrl;
                        this.userTypeName = data.userTypeName;
                        this.userType = data.userType;
                    }
                })
                    .catch(() => {
                    });
            },
            //编辑骨干信息
            backbone() {
                this.$router.push({
                    path: "backbone",
                });
            },

        }
    };
</script>

<style scoped>
    .resume-box {
        width: 1050px;
        margin: 0 auto;
        border: 1px solid #e0e0e0;
        background-color: #e6f3f9;
    }

    .resume-top-box {
        overflow: hidden;
    }

    .resume-top-box .photo {
        float: left;
        width: 80px;
        height: 80px;
        margin: 10px 20px;
    }

    .resume-top-box .user-loginname {
        line-height: 100px;
        float: left;
    }

    .resume-top-box .div-button {
        float: right;
        margin: 30px 10px;
    }

    .resume-details-edit {
        background: #fff;
        padding: 20px 0;
    }

    .img img {
        widows: 60px;
        height: 60px;
    }

    .login-code {
        width: 100%;
        height: 100%;
        text-align: center;
        padding-top: 20px;
    }

    .resume-content {
        overflow-y: auto;
        margin-bottom: 20px;
        padding-top: 8px;
    }


    .resume-box-left {
        width: 260px;
        height: 100%;
        float: left;
        background-color: #e6f3f9;
    }

    .resume-box-right {
        width: 548px;
        height: 100%;
        float: left;
        background-color: #fff;
    }

    .photo-box {
        width: 100%;
        height: 240px;
        background-color: #cae6f2;
        padding-top: 40px;
        position: relative;
    }

    .photo-white-border {
        width: 126px;
        height: 126px;
        background-color: #ffffff;
        margin: 0 auto;
        border-radius: 50%;
        padding-top: 3px;
        padding-left: 3px;
    }

    .photo {
        width: 120px;
        height: 120px;
        background-position: center center;
        background-size: cover;
        border-radius: 50%;
    }

    .triangle-bottom {
        width: 0;
        height: 0;
        border-left: 18px solid transparent;
        border-right: 18px solid transparent;
        border-top: 22px solid #cae6f2;
        position: absolute;
        left: 45%;
        bottom: -16px;
    }

    .triangle-right {
        width: 0;
        height: 0;
        border-top: 18px solid transparent;
        border-left: 22px solid #cae6f2;
        border-bottom: 18px solid transparent;
        position: absolute;
        top: 45%;
        right: -16px;
    }

    .user-info-flag {
        width: 30px;
        height: 30px;
        position: relative;
        top: 4px;
        border-radius: 50%;
    }

    .user-info {
        font-size: 20px;
        margin-top: 20px;
        line-height: 30px;
        color: #76c1e0;
        padding-left: 30px;
    }

    .info-table {
        width: 100%;
    }

    .info-table tr {
        height: 40px;
        line-height: 40px;
    }

    .info-table-left {
        width: 100px;
        text-align: right;
        font-weight: bold;
        color: #3c3c3c;
        font-size: 15px;
    }

    .info-table-right {
        text-align: left;
        font-size: 12px;
        color: #6c6c6c;
    }

    .info-table-div {
        padding-top: 20px;
    }

    .user-name {
        width: 100%;
        height: 240px;
        height: 150px;
    }

    .user-loginname {
        font-size: 24px;
        color: #0099e6;
        font-weight: bolder;
        height: 100%;
        line-height: 240px;
        text-align: left;
        padding-left: 30px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .info-list {
        padding-right: 30px;
        padding-left: 55px;
        min-height: 40px;
        overflow: hidden;
    }

    .info-list-item {
        padding: 2px 4px;
        background-color: #fff;
        margin-left: 5px;
        margin-top: 6px;
        border-radius: 2px;
        font-size: 14px;
        display: inline-block;
        color: #3c3c3c;
    }

    .info-list-item-more {
        margin-left: 6px;
        font-size: 13px;
        color: #0099e6;
        cursor: pointer;
        margin-right: 20px;
        float: right;
        margin-top: 10px;
    }

    .other-table {
        width: 100%;
        font-size: 14px;
    }

    .other-table tr {
        height: 30px;
        line-height: 30px;
    }

    .other-table-left {
        width: 16%;
        text-align: right;
        color: #3c3c3c;
    }

    .other-table-right {
        width: 34%;
        text-align: left;
        color: #6c6c6c;
    }

    .face_img_list {
        margin-top: 10px;
        margin-bottom: 20px;
    }

    .face_img_item {
        width: 75px;
        height: 105px;
        margin: 5px 10px;
    }

    .edit_btn {
        float: right;
        margin-top: 10px;
        margin-right: 50px;
        font-size: 16px;
        cursor: pointer;
        color: #0099e6;
    }

    .no_upload_photo {
        margin-top: 10px;
        margin-left: 35px;
        color: #999;
    }
</style>

<style lang="scss" scoped>
    .all_role_list {
        .line_box {
            display: flex;
            padding: 5px;

            .module_name {
                width: 130px;
                margin-right: 20px;
                text-align: right;
                font-weight: 700;
            }

            .module_role_list {
                flex: 1;
                color: #999;

                .role_item_box {
                    margin-right: 10px;
                }
            }
        }
    }
</style>
