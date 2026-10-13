<template>
    <div class="login-container page" id="classroomEvaluationAppLogin">
        <div class="header">
            <h1>
                <img class="logo-image" src="https://cdnfile-10043692.file.myqcloud.com/schoollogo/defaultschoollogo.png">智慧校园课堂
            </h1>
        </div>
        <div class="left-container">
            <img src="https://cdnfile-10043692.file.myqcloud.com/admin/images/class_assessment%20/client-background.png">
        </div>
        <div class="login-box">
            <div class="login-box__inner">
                <div class="login-tabs">
                    <div class="login-tabs__line"></div>
                    <div class="login-tab">
                        <div class="login-tab-link" :class="{'login-tab-linked':loginType==0}" @click="loginType=0">扫码登录
                        </div>
                    </div>
                    <div class="login-tab">
                        <div class="login-tab-link" :class="{'login-tab-linked':loginType==1}" @click="loginType=1">账号登录
                        </div>
                    </div>
                </div>
                <div class="login-main">
                    <div class="login-item" v-show="loginType==0">
                        <div id="qrcode-container">
                            <div class="login-code" id="login-code"></div>
                        </div>
                        <img src="https://cdnfile-10043692.file.myqcloud.com/admin/images/class/mobile.png">
                    </div>
                    <div class="login-account" v-show="loginType==1">
                        <el-form autoComplete="on" :model="loginForm" :rules="loginRules" ref="loginForm"
                                 label-position="left" label-width="0px" class="card-box login-form">
                            <el-form-item prop="account" class="white-back">
                                <el-input type="text" v-model="loginForm.account" auto-complete="off"
                                          placeholder="请输入您的手机号..."></el-input>
                            </el-form-item>
                            <el-form-item prop="password" class="white-back">
                                <el-input type="password" v-model="loginForm.password" auto-complete="off"
                                          placeholder="密码" @keyup.enter.native="handleLogin"></el-input>
                            </el-form-item>
                            <div class="form-btn-area">
                                <el-button type="primary" style="width:100%;" :loading="loading"
                                           @click.native.prevent="handleLogin">
                                    登录
                                </el-button>
                            </div>
                        </el-form>
                    </div>
                </div>
            </div>
        </div>

        <el-dialog title="选择学校" :visible.sync="dialogChoseSchoolVisible" :close-on-press-escape='false'
                   :close-on-click-modal='false' :modal-append-to-body='false' @close="dialogChoseSchoolClose">
            <div class="school-box el-table__body-wrapper" :class="{ 'school-box-center': schoolList.length<5}">
                <div class="school-item" :class="{ 'school-chosed': item.checked}" :key="item.id"
                     v-for="item in schoolList" @click="chosedSchool(item)">
                    <div class="school-logo" :style="{backgroundImage:'url('+item.squareLogoUrl+')'}"></div>
                    <div class="school-name">{{item.name}}</div>
                </div>
                <div class="clear"></div>
            </div>
            <div slot="footer" class="dialog-footer">
                <div style="float:left;">
                    <el-input v-if="schoolSourceList.length>10" placeholder="学校名称" v-model="filterText"
                              icon="el-icon-search"></el-input>
                </div>
                <el-button @click="dialogChoseSchoolVisible = false">取 消</el-button>
                <el-button type="primary" :loading="choseSchoolloading" @click="loginForChosedSchoold">进 入</el-button>
            </div>
        </el-dialog>
        <el-dialog title="首次登录需修改密码" :visible.sync="dialogResetPwdVisible" :close-on-press-escape='false'
                   :close-on-click-modal='false' :modal-append-to-body='false' @close="dialogResetPwdClose">
            <div class="change-passbox">
                <el-form :model="rulePwdForm" status-icon :rules="pwdRules" ref="ruleForm" label-width="100px"
                         class="demo-ruleForm">
                    <el-form-item label="当前密码" prop="currentPwd">
                        <el-input type="password" v-model="rulePwdForm.currentPwd" auto-complete="off"
                                  placeholder="当前密码"></el-input>
                    </el-form-item>
                    <el-form-item label="新密码">
                        <password-input ref="passwordInput" :oldPassword="oldPass"
                                        v-model="rulePwdForm.pass"></password-input>
                    </el-form-item>
                    <el-form-item label="确认密码" prop="checkPass">
                        <el-input type="password" v-model="rulePwdForm.checkPass" auto-complete="off"
                                  placeholder="确认密码"></el-input>
                    </el-form-item>
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogResetPwdVisible = false">取 消</el-button>
                <el-button type="primary" @click="resetPass">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog title="您是第一次使用微信登录，请验证您的微信账号" size="tiny" :visible.sync="dialogBindWxVisible"
                   :close-on-press-escape='false' :close-on-click-modal='false' :modal-append-to-body='false'
                   @close="dialogChoseSchoolClose">
            <div class="change-passbox">
                <el-form :model="wxLoginForm" status-icon :rules="wxLoginFormRule" ref="wxLoginFormRuleForm"
                         label-width="100px" class="demo-ruleForm">

                    <el-form-item label="手机号码" prop="mobile">
                        <el-input type="text" v-model="wxLoginForm.mobile" auto-complete="off" placeholder="当前您的手机号码">
                            <el-button type="danger" slot="append" :disabled="codeFlag" @click="getCode">
                                {{codeBtnTxt}}
                            </el-button>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="验证码" prop="code">
                        <el-input type="text" v-model="wxLoginForm.code" auto-complete="off"
                                  placeholder="您手机上收到的验证码"></el-input>
                    </el-form-item>
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogBindWxVisible = false">取 消</el-button>
                <el-button type="primary" @click="bindWx">确 定</el-button>
            </span>
        </el-dialog>
        <div class="footer">
            南京微研网络有限公司&nbsp;&nbsp;研发
        </div>
    </div>
</template>

<script>
    import {mapGetters} from 'vuex';
    import {
        login,
        loginForChosedSchoold,
        modifyPassword,
        getWXInitData,
        loginForWX,
        getCode,
        wxBind,
        loginWx
    } from '@/api/login';
    import {encrypt} from '@/utils/utils';
    import PasswordInput from '@/components/PasswordInput/PasswordInput'

    export default {
        components: {PasswordInput},
        name: 'login',
        created() {
            window.sessionStorage.setItem('pc_login_type', 'kindergarten');
            this.wxcode = this.$route.query.code;
            if (this.wxcode) {//如果是微信登录
                loginForWX(this.wxcode, 'WXLOGINNEW').then(res => {
                    let data = res.data;
                    if (data.code === 1060) {//是不是首次绑定微信帐号
                        this.dialogBindWxVisible = true;
                        this.wxToken = data.data.loginWxToken == null ? '' : data.data.loginWxToken;
                    } else {
                        this.loginPackge(data);
                    }
                }).catch();
            }
        },
        mounted() {
            sessionStorage.isFirstLoad = '1';
            document.title = '智慧校园课堂评价';
            localStorage.setItem("growthBookobj", null);//清除成长册缓存
            const styleHref = 'https://cdnfile-10043692.file.myqcloud.com/admin/css/Login_scan/login_page.css';

            getWXInitData().then(res => {
                let data = res.data.data;
                new WxLogin({
                    id: "login-code",
                    appid: data.appid,
                    scope: "snsapi_login",
                    redirect_uri: data.redirect_url,
                    state: `WXLOGINCOMMON_${window.location.hostname}${window.location.pathname}`,
                    style: "black",
                    href: styleHref
                });
            }).catch();
        },
        data() {
            const validateAccount = (rule, value, callback) => {
                if (value.length === 0) {
                    callback(new Error('请输入手机号码！'));
                } else {
                    callback();
                }
            };
            const validatePass = (rule, value, callback) => {
                if (value.length === 0) {
                    callback(new Error('密码不能为空！'));
                } else {
                    callback();
                }
            };
            const validateNewPass = (rule, value, callback) => {
                if (!value) {
                    callback(new Error('请输入密码！'));
                }
                if (value == this.rulePwdForm.currentPwd) {
                    callback(new Error('新旧密码不能相同！'));
                }
                let g = /^(?![\d]+$)(?![a-zA-Z]+$)(?![!@#$%]+$)[\da-zA-Z!@#$%]{6,20}$/;
                if (!g.test(value)) {
                    callback(new Error('密码的格式不正确！'));
                } else {
                    callback();
                }
            };
            const validateNewPass2 = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请再次输入密码！'));
                } else if (value !== this.rulePwdForm.pass) {
                    callback(new Error('两次输入密码不一致!'));
                } else {
                    callback();
                }
            };
            const validateNowPass = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入密码！'));
                }
                if (value != this.oldPass) {
                    callback(new Error('当前密码不正确！'));
                } else {
                    callback();
                }
            };
            const checkMobile = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('手机不能为空！'));
                }
                const g = /^0?1[345789][0-9]\d{8}$/;
                if (!g.test(value)) {
                    callback(new Error('手机号码格式不正确！'));
                } else {
                    callback();
                }
            };
            const checkCode = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('验证码不能为空！'));
                } else {
                    callback();
                }
            };
            return {
                oldPass: '',


                filterText: '',
                loginForm: {
                    account: '',
                    password: ''
                },
                loginRules: {
                    account: [
                        {required: true, message: '手机号码不能为空！', trigger: 'blur'}
                    ],
                    password: [
                        {required: true, message: '密码不能为空！', trigger: 'blur'}
                    ]
                },
                loading: false,//登录按钮加载
                choseSchoolloading: false,//选择学校加载
                showDialog: false,
                dialogChoseSchoolVisible: false,//控制显示选择学校的弹出层
                schoolList: [],//筛选后的数据，用于绑定
                schoolSourceList: [],//学校集合源数据，保留检索的所有学校
                dialogResetPwdVisible: false,//控制显示设置首次密码的弹出层
                dialogBindWxVisible: false,
                rulePwdForm: {
                    currentPwd: '',
                    pass: '',
                    checkPass: ''
                },
                pwdRules: {
                    currentPwd: [
                        {validator: validateNowPass, trigger: 'blur'}
                    ],
                    checkPass: [
                        {validator: validateNewPass2, trigger: 'blur'}
                    ]
                },
                userId: '',//当前的userId，如果是需要首次修改密码时，需要userId参数
                loginType: 0,//登录方式，默认0 0扫码登录 1帐号登录
                wxcode: '',//微信登录的code
                wxLoginForm: {
                    mobile: '',
                    code: ''
                },
                wxLoginFormRule: {
                    mobile: [
                        {validator: checkMobile, trigger: 'blur'}
                    ],
                    code: [
                        {validator: checkCode, trigger: 'blur'}
                    ]
                },
                timeMax: 60,//获取验证码计时
                codeFlag: false,
                codeBtnTxt: '获取验证码',
                wxToken: '',//微信token
                timer: null//计时器
            }
        },
        computed: {
            ...mapGetters([
                'auth_type'
            ])
        },
        watch: {
            filterText(val) {//过滤学校
                if (val === '') {//如果数据为空的话，则显示所有
                    this.schoolList = this.schoolSourceList;
                } else {
                    this.schoolList = this.schoolSourceList.filter(function (item) {
                        return item.name.indexOf(val) >= 0;
                    });
                }

            }
        },
        methods: {
            handleLogin() {
                this.oldPass = this.loginForm.password;
                this.$refs.loginForm.validate(valid => {
                    if (valid) {
                        this.loading = true;
                        this.wxToken = '';//将wxtoken置为空，防止触发微信扫码逻辑
                        login(this.loginForm.account, encrypt(this.loginForm.password)).then(res => {
                            let data = res.data;
                            this.loginPackge(data);
                        }).catch(() => {
                            this.loading = false;
                        });
                    } else {
                        return false;
                    }
                });
            },
            packageShoolList(data) {//处理返回的多学校数据，主要添加checked属性，用于标记是否被选中
                let schoolArray = [];
                if (data) {
                    for (let i = 0; i < data.length; i++) {
                        schoolArray.push({
                            id: data[i].id,
                            name: data[i].name,
                            squareLogoUrl: data[i].squareLogoUrl,
                            checked: i === 0
                        });
                    }
                }
                return schoolArray;
            },
            chosedSchool(checkedData) {
                let chosedAfterArray = [];
                this.schoolList.forEach(function (item) {
                    chosedAfterArray.push({
                        id: item.id,
                        name: item.name,
                        squareLogoUrl: item.squareLogoUrl,
                        checked: checkedData.id === item.id
                    });
                });
                this.schoolList = chosedAfterArray;
            },
            loginForChosedSchoold() {//多学校的登录方式
                this.choseSchoolloading = true;
                let choedSchool = this.schoolList.filter(item => item.checked);
                if (choedSchool.length > 0) {
                    if (this.wxToken == '') {//如果是帐号登录
                        loginForChosedSchoold(this.loginForm.account, encrypt(this.loginForm.password), choedSchool[0].id).then(res => {
                            let data = res.data;
                            if (data.code === 1052) {//如果是首次密码登录
                                //重置密码
                                this.dialogResetPwdVisible = true;
                                this.userId = data.data.loginUserId;
                            }
                            if (data.code === 200) {//如果是登录成功
                                this.loginSuccess(data.data);
                            }

                        }).catch();
                    } else {//如果是微信扫码
                        loginWx(choedSchool[0].id, this.wxToken).then(res => {
                            let data = res.data;
                            if (data.code === 200) {
                                this.loginSuccess(data.data);
                            } else {
                                this.$message({
                                    message: data.msg,
                                    type: 'error'
                                });
                            }
                        }).catch();
                    }

                }
            },
            loginPackge(data) {//登录处理，
                if (data.code === 1055) {//如果存在多学校
                    //选择学校
                    this.wxToken = data.data.loginWxToken == null ? '' : data.data.loginWxToken;
                    this.schoolSourceList = this.packageShoolList(data.data.loginSchoolIds);
                    this.schoolList = this.schoolSourceList;
                    this.dialogChoseSchoolVisible = true;

                } else {//如果是一个学校
                    if (data.code === 1052) {//如果是首次密码登录
                        //重置密码
                        this.dialogResetPwdVisible = true;
                    }
                    if (data.code === 200) {//如果是登录成功
                        this.loginSuccess(data.data);
                    }
                }
                this.userId = data.data.loginUserId;
            },
            loginSuccess(data) {
                this.$store.dispatch('SetLoginInfo', data).then(() => {
                    this.loading = false;
                    this.$router.push('/classroomEvaluationApp/classList');
                }).catch(error => {
                    alert(error);
                    this.loading = false;
                });
            },
            resetPass() {
                const isPassValid = this.$refs['passwordInput'].validate();
                this.$refs.ruleForm.validate(valid => {
                    if (valid && isPassValid) {
                        modifyPassword(encrypt(this.rulePwdForm.pass), encrypt(this.rulePwdForm.currentPwd), this.userId).then(res => {
                            let data = res.data;
                            if (data.code === 200) {
                                this.$message({
                                    message: '修改成功,请重新登录！',
                                    type: 'success',
                                    duration: 3000,
                                    onClose: function () {
                                        location.reload();
                                    }
                                });

                            } else {
                                this.$message({
                                    message: data.msg,
                                    type: 'error'
                                });
                            }
                        }).catch(err => {
                        });
                    }
                });
            },
            dialogChoseSchoolClose() {
                this.loading = false;
            },
            dialogResetPwdClose() {
                this.loading = false;
                this.choseSchoolloading = false;
            },
            bindWx() {//绑定微信
                this.$refs.wxLoginFormRuleForm.validate(valid => {
                    if (valid) {
                        wxBind(this.wxLoginForm.code.trim(), this.wxLoginForm.mobile.trim(), this.wxToken).then(res => {
                            let data = res.data;

                            if (data.code === 200 || data.code === 1055) {
                                this.loginPackge(data);
                            } else {
                                this.$message({
                                    message: data.msg,
                                    type: 'error'
                                });
                            }
                        }).catch();
                    }
                });
            },
            getCode() {
                this.$refs.wxLoginFormRuleForm.validateField('mobile', valid => {
                    if (valid == '') {
                        this.codeFlag = true;
                        this.setTimeBtn();
                        getCode(this.wxLoginForm.mobile.trim()).then(res => {
                            let data = res.data;
                            if (data.code === 200) {
                                this.$message({
                                    message: '验证码已发送成功，请在微信上查看！',
                                    type: 'success'
                                });
                            } else {
                                this.$message({
                                    message: data.msg,
                                    type: 'error'
                                });
                            }
                        }).catch();
                    }
                });
            },
            setTimeBtn() {
                let _this = this;
                this.timer = setInterval(function () {
                    _this.timeMax--;
                    if (_this.timeMax == 0) {
                        _this.codeFlag = false;
                        _this.timeMax = 60;
                        _this.codeBtnTxt = '获取验证码';
                        window.clearInterval(_this.timer)
                    } else {
                        _this.codeBtnTxt = '重新获取(' + _this.timeMax + ')';
                    }
                }, 1000);
            }
        }
    }
</script>

<style rel="stylesheet/scss" lang="scss">
    @import "../../../src/styles/mixin.scss";

    #classroomEvaluationAppLogin {
        body, h1, h2, h3, h4, h5, h6, ul, ol, p {
            margin: 0;
            padding: 0;
            font-weight: normal;
        }
        .header h1 {
            height: 70px;
        }
        &.login-container.page {
            position: absolute;
            left: 0;
            right: 0;
            top: 0;
            bottom: 0;
            background: #0099E7 no-repeat url(https://cdnfile-10043692.file.myqcloud.com/admin/images/class_assessment%20/client-general-bg.jpg) center center / 100% 100%;
        }
        .login-box {
            float: left;
            width: 380px !important;
            height: 360px !important;
            background-color: #fff;
            margin: 20px 0 0 40px;
            position: relative;
        }
        .login-tab-link {
        }
        .login-tabs, .login-tab {
        }
        .login-code {
            padding: 0 !important;
        }
        .tips {
            font-size: 14px;
            color: #fff;
            margin-bottom: 5px;
        }

        &.login-container {
            @include relative;

            .login-form input:-webkit-autofill {
                -webkit-box-shadow: 0 0 0 1000px #fff inset !important;
                -webkit-text-fill-color: #304E72 !important;
            }

            .login-form input {
                border: 0;
                -webkit-appearance: none;
                border-radius: 0;
                padding: 12px 5px 12px 15px;
                color: #304E72;
                height: 42px;
                background: #e6f5fc;
            }

            .login-form .el-input {
                display: inline-block;
                height: 42px;
            }

            .svg-container {
                height: 40px;
                padding: 6px 5px 6px 15px;
                color: #889aa4;
            }

            .svg-container i {
                font-size: 24px;
            }

            .title {
                font-size: 26px;
                color: #eeeeee;
                margin: 0 auto 40px auto;
                text-align: center;
                font-weight: bold;
            }

            .login-form {
                width: 100%;
                padding: 16px 26px 15px 26px;
                margin: 5px auto;
            }

            .login-form .el-form-item {
                border: 1px solid #e3e3e3;
                border-radius: 5px;
                color: #454545;
                margin: 34px 0!important;
            }

            .login-form .white-back.el-form-item {
                border: 1px solid #e3e3e3;
                background: #fff;
                border-radius: 5px;
                color: #454545;
            }

            .forget-pwd {
                color: #fff;
            }

            .school-box-center {
                display: flex;
                justify-content: center;
                flex-wrap: wrap;
            }

            .school-box {
                max-height: 450px;
            }

            .school-item {
                width: 140px;
                height: 140px;
                float: left;
                text-align: center;
                cursor: pointer;
                margin-left: 10px;
                margin-bottom: 10px;
                border-radius: 4px;
                border: 2px solid #fff;
            }

            .school-logo {
                width: 100px;
                height: 100px;
                margin: 4px auto;
                background-position: center center;
                background-size: cover;
            }

            .clear {
                clear: both;
            }

            .school-chosed {
                border: 2px solid #20a0ff;
            }

            .school-name {
                height: 30px;
                line-height: 30px;
            }

            .login-box {
                float: left;
                width: 380px;
                height: 360px;
                background-color: #fff;
                margin: 20px 0 0 40px;
                position: relative;

                .login-box__inner {
                    // background-color: #DCECFC;
                    height: 100%;
                }
            }

            .login-tabs {
                width: 100%;
                position: relative;
                border-bottom: 1px solid #ddd;
                text-align: center;
                .login-tabs__line {
                    position: absolute;
                    width: 86%;
                    left: 8%;
                    bottom: 0;
                    /*border: 1px solid #fff;*/
                }
            }

            .login-tab {
                display: inline-block;
                /* width: 80px; */
                color: #aaa;
                font-size: 18px;
            }

            .login-tab-link {
                display: inline-block;
                /* width: 80px; */
                padding: 20px 0;
                margin: 0 40px;
                color: #aaa;
                font-size: 18px;
                border-top: 3px solid #fff;
                border-bottom: 3px solid #fff;
                cursor: pointer;
            }

            .login-tab-linked {
                color: #0099E7;
                border-bottom: 2px solid #0099E7;
            }

            .login-main {
            }

            .login-main .el-button--primary {
                border: 0;
                width: 200px !important;
                color: #fff;
                background-color: #e96e00;
                padding: 10px 0;
                margin: 0 auto;
                border-radius: 5px;
            }

            .slogan-box {
                width: 430px;
                position: absolute;
                top: 12%;
                left: 10%;

                .slogan-box__logo {
                    background: no-repeat url(https://cdnfile-10043692.file.myqcloud.com/vuewxcep/common_img/kindergarten_logo.png) center center / 100% 100%;
                    width: 430px;
                    height: 155px;
                }

                .slogan-box__title {
                    color: #fff;
                    font-size: 34px;
                    text-align: center;
                    letter-spacing: 5px;
                }
            }


            .login-code {
                width: 100%;
                height: 100%;
                text-align: center;
                padding-top: 20px;

            }

            .wrap-footer {
                color: #333;
                position: absolute;
                text-align: center;
                width: 100%;
                bottom: 10%;
            }
        }

        .inner-footer {
            color: #fff;
        }

        .footer {
            position: absolute;
            bottom: 50px;
            left: 50%;
            transform: translateX(-50%);
            font-size: 14px;
            color: #fff;
        }
        .left-container {
            text-align: right;
        }
        .left-container img {
            width: 420px;
            margin: -10px 40px 0 0;
        }
        .left-container, .right-container {
            float: left;
            width: 50%;
        }
        .header {
            padding: 10px 10px;
            margin-bottom: 60px;
            .logo-image {
                width: 45px;
                height: 45px;
                vertical-align: middle;
                margin-right: 20px;
            }
            h1 {
                font-size: 18px;
                color: #fff;
            }
        }
        .login-item {
            width: 100%;
            height: 298px;
            overflow: hidden;
            position: absolute;
            left: 0;
            top: 61px;
            text-align: center;
        }
        #qrcode-container {
            float: left;
            width: 50%;
            margin-top: 26px;
            position: relative;
            left: 10px;
        }
        .login-item img {
            float: right;
            width: 50%;
            margin-top: 12px;
        }
        .form-btn-area {
            position: absolute;
            width: 100%;
            left: 0;
            bottom: 0;
            padding: 13px;
            box-sizing: border-box;
            border-top: 1px solid #ddd;
            text-align: center;
        }
    }

</style>
