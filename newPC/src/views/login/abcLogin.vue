<template>
    <div class="main-container">
        <div class="general-container">
            <div class="index-text"></div>
            <div class="login-container">
                <div class="left-panel"></div>
                <div class="right-panel">
                    <div class="title">
                        <i class="icon title-icon"></i>
                        智慧校园管理平台
                    </div>
                    <div class="tab-container login-form-item">
                        <div @click="changeTab(0)" :class="['tab-item', loginType == 0 ? 'tab-item--active' : '']">
                            扫码登录
                        </div>
                        <div @click="changeTab(1)" :class="['tab-item', loginType == 1 ? 'tab-item--active' : '']">
                            账号登录
                        </div>
                    </div>
                    <div class="login-main login-form-item">
                        <div class="login-code" id="login-code" v-show="loginType == 0"></div>
                        <div class="login-account" v-show="loginType == 1">
                            <el-form autoComplete="off" :model="loginForm" :rules="loginRules" ref="loginForm"
                                     label-position="left" label-width="0px" class="card-box login-form">
                                <el-form-item prop="account" class="form-item--account">
                                    <el-input type="text" v-model="loginForm.account" auto-complete="off"
                                              placeholder="手机号码">
                                        <i slot="prefix" class="login-icon login-icon--account"></i>
                                    </el-input>
                                </el-form-item>
                                <el-form-item prop="password" class="form-item--pass">
                                    <el-input type="password" v-model="loginForm.password" auto-complete="off"
                                              placeholder="密码" @keyup.enter.native="handleLogin">
                                        <i slot="prefix" class="login-icon login-icon--pass"></i>
                                    </el-input>
                                </el-form-item>
                                <el-form-item>
                                    <el-button type="primary"
                                               style="width:100%;border-radius: 19px;background: #5282F0;"
                                               @click.native.prevent="handleLogin">
                                        登录
                                    </el-button>
                                </el-form-item>
                            </el-form>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <el-dialog title="选择学校" :visible.sync="dialogChoseSchoolVisible" :close-on-press-escape="false"
                   :close-on-click-modal="false" :modal-append-to-body="false" @close="dialogChoseSchoolClose">
            <div class="school-box el-table__body-wrapper" :class="{ 'school-box-center': schoolList.length < 5 }">
                <div class="school-item" :class="{ 'school-chosed': item.checked }" :key="item.id"
                     v-for="item in schoolList" @click="chosedSchool(item)">
                    <div class="school-logo" :style="{ backgroundImage: 'url(' + item.squareLogoUrl + ')' }"></div>
                    <div class="school-name">{{ item.name }}</div>
                </div>
                <div class="clear"></div>
            </div>
            <div slot="footer" class="dialog-footer">
                <div style="float:left;">
                    <el-input v-if="schoolSourceList.length > 10" placeholder="学校名称" v-model="filterText"
                              icon="el-icon-search"></el-input>
                </div>
                <el-button @click="dialogChoseSchoolVisible = false">取 消</el-button>
                <el-button type="primary" @click="loginForChosedSchoold">进 入</el-button>
            </div>
        </el-dialog>
        <el-dialog title="首次登录需修改密码" :visible.sync="dialogResetPwdVisible" :close-on-press-escape="false"
                   :close-on-click-modal="false" :modal-append-to-body="false" @close="dialogResetPwdClose">
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
                   :close-on-press-escape="false" :close-on-click-modal="false" :modal-append-to-body="false"
                   @close="dialogChoseSchoolClose">
            <div class="change-passbox">
                <el-form :model="wxLoginForm" status-icon :rules="wxLoginFormRule" ref="wxLoginFormRuleForm"
                         label-width="100px" class="demo-ruleForm">
                    <el-form-item label="手机号码" prop="mobile">
                        <el-input type="text" v-model="wxLoginForm.mobile" auto-complete="off" placeholder="当前您的手机号码">
                            <el-button type="danger" slot="append" :disabled="codeFlag" @click="getCode">
                                {{ codeBtnTxt }}
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
    } from '@/api/login'
    import { encrypt } from '@/utils/utils'
    import PasswordInput from '@/components/PasswordInput/PasswordInput';

    export default {
        name: "abcLogin",
        components: {PasswordInput},
        watch: {
            filterText(val) {
                //过滤学校
                if (val === '') {
                    //如果数据为空的话，则显示所有
                    this.schoolList = this.schoolSourceList
                } else {
                    this.schoolList = this.schoolSourceList.filter(function(item) {
                        return item.name.indexOf(val) >= 0
                    })
                }
            }
        },
        data() {
            const validateAccount = (rule, value, callback) => {
                if (value.length === 0) {
                    callback(new Error('请输入手机号码！'))
                } else {
                    callback()
                }
            }
            const validatePass = (rule, value, callback) => {
                if (value.length === 0) {
                    callback(new Error('密码不能为空！'))
                } else {
                    callback()
                }
            }
            const validateNewPass = (rule, value, callback) => {
                if (!value) {
                    callback(new Error('请输入密码！'))
                }
                if (value == this.rulePwdForm.currentPwd) {
                    callback(new Error('新旧密码不能相同！'))
                }
                let g = /^(?![\d]+$)(?![a-zA-Z]+$)(?![!@#$%]+$)[\da-zA-Z!@#$%]{6,20}$/
                if (!g.test(value)) {
                    callback(new Error('密码的格式不正确！'))
                } else {
                    callback()
                }
            }
            const validateNewPass2 = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请再次输入密码！'))
                } else if (value !== this.rulePwdForm.pass) {
                    callback(new Error('两次输入密码不一致!'))
                } else {
                    callback()
                }
            }
            const validateNowPass = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入密码！'))
                }
                if (value != this.oldPass) {
                    callback(new Error('当前密码不正确！'))
                } else {
                    callback()
                }
            }
            const checkMobile = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('手机不能为空！'))
                }
                const g = /^0?1[345789][0-9]\d{8}$/
                if (!g.test(value)) {
                    callback(new Error('手机号码格式不正确！'));
                } else {
                    callback()
                }
            }
            const checkCode = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('验证码不能为空！'))
                } else {
                    callback()
                }
            }

            return {
                oldPass: '',

                password: '',
                filterText: '',
                loading: false, //登录按钮加载
                choseSchoolloading: false, //选择学校加载
                showDialog: false,
                dialogChoseSchoolVisible: false, //控制显示选择学校的弹出层
                schoolList: [], //筛选后的数据，用于绑定
                schoolSourceList: [], //学校集合源数据，保留检索的所有学校
                dialogResetPwdVisible: false, //控制显示设置首次密码的弹出层
                dialogBindWxVisible: false,
                rulePwdForm: {
                    currentPwd: '',
                    pass: '',
                    checkPass: ''
                },
                pwdRules: {
                    currentPwd: [{validator: validateNowPass, trigger: 'blur'}],
                    checkPass: [{validator: validateNewPass2, trigger: 'blur'}]
                },
                userId: '', //当前的userId，如果是需要首次修改密码时，需要userId参数

                wxLoginForm: {
                    mobile: '',
                    code: ''
                },
                wxLoginFormRule: {
                    mobile: [{validator: checkMobile, trigger: 'blur'}],
                    code: [{validator: checkCode, trigger: 'blur'}]
                },
                timeMax: 60, //获取验证码计时
                codeFlag: false,
                codeBtnTxt: '获取验证码',
                wxToken: '', //微信token
                timer: null, //计时器


                loginType: 0,
                loginForm: {
                    account: '',
                    password: '',

                },
                loginRules: {
                    account: [{required: true, message: '手机号码不能为空！', trigger: 'blur'}],
                    password: [{required: true, message: '密码不能为空！', trigger: 'blur'}]
                },

                wxcode: '',
                wxloginType: '',

            }
        },
        created() {
            window.sessionStorage.setItem('pc_login_type', 'normal')
            this.wxcode = this.$route.query.code
            this.wxloginType = this.$route.query.loginType
            if (this.wxloginType && this.wxcode) {
                loginForWX(this.wxcode, 'WXLOGINNEW', this.wxloginType, 2)
                    .then(res => {
                        let data = res.data
                        if (data.code === 1060) {
                            //是不是首次绑定微信帐号
                            this.dialogBindWxVisible = true
                            this.wxToken = data.data.loginWxToken == null ? '' : data.data.loginWxToken
                        } else {
                            this.loginPackge(data)
                        }
                    })
                    .catch()
            }
            if (!this.wxloginType && this.wxcode) {
                //如果是微信登录
                loginForWX(this.wxcode, 'WXLOGINNEW', '', 2)
                    .then(res => {
                        let data = res.data
                        if (data.code === 1060) {
                            //是不是首次绑定微信帐号
                            this.dialogBindWxVisible = true
                            this.wxToken = data.data.loginWxToken == null ? '' : data.data.loginWxToken
                        } else {
                            this.loginPackge(data)
                        }
                    })
                    .catch()
            }
        },
        mounted() {
            document.title = '智慧校园'
            sessionStorage.setItem('standalone', 0)

            getWXInitData()
                .then(res => {
                    let data = res.data.data
                    new WxLogin({
                        id: 'login-code',
                        appid: data.appid,
                        scope: 'snsapi_login',
                        redirect_uri: data.redirect_url,
                        state: 'WXLOGINNEW-ABC',
                        style: 'black',
                        href: 'https://cdnfile-10043692.file.myqcloud.com/vuewxcep/common_css/new_wx_login.css'
                    })
                })
                .catch()

        },
        computed: {
            ...mapGetters(['auth_type', 'schoolInfo'])
        },
        methods: {
            changeTab(tab) {
                this.loginType = tab;
            },
            handleLogin() {
                this.oldPass = this.loginForm.password
                this.$refs.loginForm.validate(valid => {
                    if (valid) {
                        this.loading = true
                        this.wxToken = '' //将wxtoken置为空，防止触发微信扫码逻辑
                        login(this.loginForm.account, encrypt(this.loginForm.password), 2)
                            .then(res => {
                                let data = res.data
                                this.loginPackge(data)
                            })
                            .catch(() => {
                                this.loading = false
                            })
                    } else {
                        return false
                    }
                })
            },
            packageShoolList(data) {
                //处理返回的多学校数据，主要添加checked属性，用于标记是否被选中
                let schoolArray = []
                if (data) {
                    for (let i = 0; i < data.length; i++) {
                        schoolArray.push({
                            id: data[i].id,
                            name: data[i].name,
                            squareLogoUrl: data[i].squareLogoUrl,
                            checked: i === 0
                        })
                    }
                }
                return schoolArray
            },
            chosedSchool(checkedData) {
                let chosedAfterArray = []
                this.schoolList.forEach(function (item) {
                    chosedAfterArray.push({
                        id: item.id,
                        name: item.name,
                        squareLogoUrl: item.squareLogoUrl,
                        checked: checkedData.id === item.id
                    })
                })
                this.schoolList = chosedAfterArray
            },
            loginForChosedSchoold() {
                //多学校的登录方式
                this.choseSchoolloading = true
                let choedSchool = this.schoolList.filter(item => item.checked)
                if (choedSchool.length > 0) {
                    if (this.wxToken == '') {
                        //如果是帐号登录
                        loginForChosedSchoold(this.loginForm.account, encrypt(this.loginForm.password), choedSchool[0].id)
                            .then(res => {
                                let data = res.data
                                if (data.code === 1052) {
                                    //如果是首次密码登录
                                    //重置密码
                                    this.dialogResetPwdVisible = true
                                    this.userId = data.data.loginUserId
                                }
                                if (data.code === 200) {
                                    //如果是登录成功
                                    this.loginSuccess(data.data)
                                }
                            })
                            .catch()
                    } else {
                        //如果是微信扫码
                        loginWx(choedSchool[0].id, this.wxToken)
                            .then(res => {
                                let data = res.data
                                if (data.code === 200) {
                                    this.loginSuccess(data.data)
                                } else {
                                    this.$message({
                                        message: data.msg,
                                        type: 'error'
                                    })
                                }
                            })
                            .catch()
                    }
                }
            },
            loginPackge(data) {
                //登录处理，
                if (data.code === 1055) {
                    //如果存在多学校
                    //选择学校
                    this.wxToken = data.data.loginWxToken == null ? '' : data.data.loginWxToken
                    this.schoolSourceList = this.packageShoolList(data.data.loginSchoolIds)
                    this.schoolList = this.schoolSourceList
                    this.dialogChoseSchoolVisible = true
                } else if (data.code == 1005) {
                    this.$message.error(data.msg)
                } else {
                    //如果是一个学校
                    if (data.code === 1052) {
                        //如果是首次密码登录
                        //重置密码
                        this.dialogResetPwdVisible = true
                    }
                    if (data.code === 200) {
                        //如果是登录成功
                        this.loginSuccess(data.data)
                    }
                }
                this.userId = data.data.loginUserId
            },
            loginSuccess(data) {
                this.$store
                    .dispatch('SetLoginInfo', data)
                    .then(() => {
                        this.loading = false;
                        console.log('abcabc')
                        console.log('this.schoolInfo.type', this.schoolInfo.type)
                        if (this.schoolInfo.type === 5) {
                            if (global.command === 'production') {
                                window.location = 'http://www.zhxiaoyuan.cn/boe/#/boe/homePage'
                            } else {
                                window.location = 'http://www.weixiaojia.net/boe/#/boe/homePage'
                            }
                        } else {
                            this.$router.push('/main')
                        }
                    })
                    .catch(() => {
                        this.loading = false
                    })
            },
            resetPass() {
                const isPassValid = this.$refs['passwordInput'].validate()
                this.$refs.ruleForm.validate(valid => {
                    if (valid && isPassValid) {
                        modifyPassword(encrypt(this.rulePwdForm.pass), encrypt(this.rulePwdForm.currentPwd), this.userId)
                            .then(res => {
                                let data = res.data
                                if (data.code === 200) {
                                    this.$message({
                                        message: '修改成功,请重新登录！',
                                        type: 'success',
                                        duration: 3000,
                                        onClose: function () {
                                            location.reload()
                                        }
                                    })
                                } else {
                                    this.$message({
                                        message: data.msg,
                                        type: 'error'
                                    })
                                }
                            })
                            .catch(err => {
                            })
                    }
                })
            },
            dialogChoseSchoolClose() {
                this.loading = false
            },
            dialogResetPwdClose() {
                this.loading = false
                this.choseSchoolloading = false
            },
            bindWx() {
                //绑定微信
                this.$refs.wxLoginFormRuleForm.validate(valid => {
                    if (valid) {
                        wxBind(this.wxLoginForm.code.trim(), this.wxLoginForm.mobile.trim(), this.wxToken, 2)
                            .then(res => {
                                let data = res.data

                                if (data.code === 200 || data.code === 1055) {
                                    this.loginPackge(data)
                                } else {
                                    this.$message({
                                        message: data.msg,
                                        type: 'error'
                                    })
                                }
                            })
                            .catch()
                    }
                })
            },
            getCode() {
                this.$refs.wxLoginFormRuleForm.validateField('mobile', valid => {
                    if (valid == '') {
                        this.codeFlag = true
                        this.setTimeBtn()
                        getCode(this.wxLoginForm.mobile.trim(), 2)
                            .then(res => {
                                let data = res.data
                                if (data.code === 200) {
                                    this.$message({
                                        message: data.msg,
                                        type: 'success'
                                    })
                                } else {
                                    this.$message({
                                        message: data.msg,
                                        type: 'error'
                                    })
                                }
                            })
                            .catch()
                    }
                })
            },
            setTimeBtn() {
                let _this = this
                this.timer = setInterval(function () {
                    _this.timeMax--
                    if (_this.timeMax == 0) {
                        _this.codeFlag = false
                        _this.timeMax = 60
                        _this.codeBtnTxt = '获取验证码'
                        window.clearInterval(_this.timer)
                    } else {
                        _this.codeBtnTxt = '重新获取(' + _this.timeMax + ')'
                    }
                }, 1000)
            }
        },
    }
</script>

<style scoped lang="scss">
    @import "../../styles/mixin";

    .main-container {
        height: 100%;
    }
    .general-container {
        background: no-repeat center center / 100% 100% url(https://cdnfile-10043692.cos.ap-shanghai.myqcloud.com/admin/images/abc/general_bg2.png);
        height: 100%;
        position: relative;
    }

    .index-text {
        position: absolute;
        @include wh(300px, 100px);
        top: 40px;
        left: 110px;
        background: no-repeat center center / contain url(https://cdnfile-10043692.cos.ap-shanghai.myqcloud.com/admin/images/abc/index_text.png);
    }

    .login-container {
        @include center;
        @include wh(1234px, 616px);
        background: #fff;
        border-radius: 15px;
    }

    .left-panel {
        @include wh(533px, 425px);
        background: no-repeat center center / cover url(https://cdnfile-10043692.cos.ap-shanghai.myqcloud.com/admin/images/abc/index_img.png);
        margin: 84px 0 0 113px;
        float: left;
    }

    .right-panel {
        float: right;
        width: 532px;
        height: 100%;

    }

    .title {
        color: #565656;
        font-size: 18px;
        font-family: Microsoft YaHei;
        font-weight: bold;
        line-height: 35px;
        text-align: center;
        margin-top: 60px;
    }

    .title-icon {
        @include wh(26px, 26px);
        background: no-repeat center center / cover url(https://cdnfile-10043692.cos.ap-shanghai.myqcloud.com/admin/images/abc/index_icon.png);
        @include middleIB;
        margin-right: 10px;
    }

    .login-form-item {
        width: 348px;
        margin: 0 auto;
    }

    .tab-container {
        border-bottom: 1px solid #DCDEE2;
        @include clearfix;

        .tab-item {
            width: 86px;
            text-align: center;
            line-height: 1em;
            font-size: 16px;
            font-family: SimHei;
            font-weight: 400;
            padding-bottom: 18px;
            margin-top: 60px;
            color: #304E72;

            &:nth-child(1) {
                float: left;
            }

            &:nth-child(2) {
                float: right;
            }

            margin-bottom: -1px;
            box-sizing: border-box;

            &:not(.tab-item--active) {
                cursor: pointer;
            }
        }

        .tab-item--active {
            color: #54A5FF;
            border-bottom: 2px solid #409EFF;
        }
    }

    .login-icon {
        @include wh(15px, 15px);
        @include middleIB;
        background: no-repeat center center / contain;
        margin-left: 5px;
        position: relative;
        top: -2px;

        &.login-icon--account {
            background-image: url(https://cdnfile-10043692.cos.ap-shanghai.myqcloud.com/admin/images/abc/account_icon.png);
        }

        &.login-icon--pass {
            background-image: url(https://cdnfile-10043692.cos.ap-shanghai.myqcloud.com/admin/images/abc/pass_icon.png);
        }
    }

    .form-item--account {
        margin: 52px 0;
    }

    .form-item--pass {
        margin-bottom: 52px;
    }

    @media (max-height: 780px) {
        .index-text {
            height: 60px;
            top: 10px;
            left: 250px;
        }
    }

    #login-code {
        margin-top: 10px;
        margin-left: 26px;
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

</style>
