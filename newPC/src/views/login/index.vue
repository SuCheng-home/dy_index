<template>
	<div class="login-container main-login" id="mainLogin">
		<div class="wrap-footer">
			<div id="footer">
				<div class="inner-footer">
					<div class="foot">
						<a href="https://beian.miit.gov.cn/" target="_blank">
						{{myis?"苏ICP备15026634号-4":"苏ICP备15026634号-1"}}
						</a>
						<!-- | 联系方式：13255273810 -->
					</div>
				</div>
			</div>
		</div>
		<div class="login-box">
			<a v-if="false" class="qywx-link" :href="qywxLink">
				<img src="https://cdnfile-10043692.file.myqcloud.com/qywx_logo.png" />
				<span class="qywx-link__text">企业微信登录</span>
			</a>
			<div class="login-tabs">
				<div class="login-tab">
					<div class="login-tab-link" :class="{ 'login-tab-linked': loginType == 0 }" @click="switchToQrCode">扫码登录</div>
				</div>
				<div class="login-tab">
					<div class="login-tab-link" :class="{ 'login-tab-linked': loginType == 1 }" @click="loginType = 1">账号登录</div>
				</div>
			</div>
			<div class="login-main">
				<div class="login-code" id="login-code" v-show="loginType == 0"></div>
				<div class="login-account" v-show="loginType == 1">
					<el-form autoComplete="on" :model="loginForm" :rules="loginRules" ref="loginForm" label-position="left" label-width="0px" class="card-box login-form">
						<el-form-item prop="account" class="white-back">
							<span class="svg-container">
								<i class="icon iconfont icon-identification"></i>
							</span>
							<el-input type="text" v-model="loginForm.account" auto-complete="off" placeholder="手机号码"></el-input>
						</el-form-item>
						<el-form-item prop="password" class="white-back">
							<span class="svg-container">
								<i class="icon iconfont icon-password"></i>
							</span>
							<el-input type="password" v-model="loginForm.password" auto-complete="off" placeholder="密码" @keyup.enter.native="handleLogin"></el-input>
						</el-form-item>
						<el-form-item>
							<el-button type="primary" style="width:100%;" @click.native.prevent="handleLogin">
								登录
							</el-button>
						</el-form-item>
					</el-form>
				</div>
			</div>
		</div>
		<div class="slogan-box"></div>
		<el-dialog title="选择学校" :visible.sync="dialogChoseSchoolVisible" :close-on-press-escape="false" :close-on-click-modal="false" :modal-append-to-body="false" @close="dialogChoseSchoolClose">
			<div class="school-box el-table__body-wrapper" :class="{ 'school-box-center': schoolList.length < 5 }">
				<div class="school-item" :class="{ 'school-chosed': item.checked }" :key="item.id" v-for="item in schoolList" @click="chosedSchool(item)">
					<div class="school-logo" :style="{ backgroundImage: 'url(' + item.squareLogoUrl + ')' }"></div>
					<div class="school-name">{{ item.name }}</div>
				</div>
				<div class="clear"></div>
			</div>
			<div slot="footer" class="dialog-footer">
				<div style="float:left;">
					<el-input v-if="schoolSourceList.length > 10" placeholder="学校名称" v-model="filterText" icon="el-icon-search"></el-input>
				</div>
				<el-button @click="dialogChoseSchoolVisible = false">取 消</el-button>
				<el-button type="primary" @click="loginForChosedSchoold">进 入</el-button>
			</div>
		</el-dialog>
		<el-dialog title="首次登录需修改密码" :visible.sync="dialogResetPwdVisible" :close-on-press-escape="false" :close-on-click-modal="false" :modal-append-to-body="false" @close="dialogResetPwdClose">
			<div class="change-passbox">
				<el-form :model="rulePwdForm" status-icon :rules="pwdRules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
					<el-form-item label="当前密码" prop="currentPwd">
						<el-input type="password" v-model="rulePwdForm.currentPwd" auto-complete="off" placeholder="当前密码"></el-input>
					</el-form-item>
					<el-form-item label="新密码">
						<password-input ref="passwordInput" :oldPassword="oldPass" v-model="rulePwdForm.pass"></password-input>
					</el-form-item>
					<el-form-item label="确认密码" prop="checkPass">
						<el-input type="password" v-model="rulePwdForm.checkPass" auto-complete="off" placeholder="确认密码"></el-input>
					</el-form-item>
				</el-form>
			</div>
			<span slot="footer" class="dialog-footer">
				<el-button @click="dialogResetPwdVisible = false">取 消</el-button>
				<el-button type="primary" @click="resetPass">确 定</el-button>
			</span>
		</el-dialog>
		<el-dialog title="您是第一次使用微信登录，请验证您的微信账号" size="tiny" :visible.sync="dialogBindWxVisible" :close-on-press-escape="false" :close-on-click-modal="false" :modal-append-to-body="false" @close="dialogChoseSchoolClose">
			<div class="change-passbox">
				<el-form :model="wxLoginForm" status-icon :rules="wxLoginFormRule" ref="wxLoginFormRuleForm" label-width="100px" class="demo-ruleForm">
					<el-form-item label="手机号码" prop="mobile">
						<el-input type="text" v-model="wxLoginForm.mobile" auto-complete="off" placeholder="当前您的手机号码">
							<el-button type="danger" slot="append" :disabled="codeFlag" @click="getCode">
								{{ codeBtnTxt }}
							</el-button>
						</el-input>
					</el-form-item>
					<el-form-item label="验证码" prop="code">
						<el-input type="text" v-model="wxLoginForm.code" auto-complete="off" placeholder="您手机上收到的验证码"></el-input>
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
import { mapGetters } from 'vuex'
import { login, loginForChosedSchoold, modifyPassword, getWXInitData, loginForWX, getCode, wxBind, loginWx } from '@/api/login'
import { encrypt } from '@/utils/utils'
import PasswordInput from '@/components/PasswordInput/PasswordInput'

export default {
	components: { PasswordInput },
	name: 'login',
	created() {
		window.sessionStorage.setItem('pc_login_type', 'normal')
		this.wxcode = this.$route.query.code
		this.wxloginType = this.$route.query.loginType
		if (this.wxloginType && this.wxcode) {
			loginForWX(this.wxcode, 'WXLOGINNEW', this.wxloginType)
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
			loginForWX(this.wxcode, 'WXLOGINNEW')
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
        this.myis=window.location.href.indexOf('www.zhxiaoyuan.cn') !== -1
		getWXInitData()
			.then(res => {
				this.wxInitData = res.data.data
				this.initWxLogin()
			})
			.catch()

		getWXInitData('provider').then(res => {
			const data = res.data.data
			const qywxState = 'WXLOGINCOMMON_www.zhxiaoyuan.cn/'
			this.qywxLink = `https://open.work.weixin.qq.com/wwopen/sso/3rd_qrConnect?appid=${data.appid}&redirect_uri=${data.redirect_url}&state=${qywxState}&usertype=member`
		})
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
				callback(new Error('手机号码格式不正确！'))
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
			qywxLink: '',
            myis:false,
			oldPass: '',
			wxInitData: null,

			password: '',
			filterText: '',
			loginForm: {
				account: '',
				password: ''
			},
			loginRules: {
				account: [{ required: true, message: '手机号码不能为空！', trigger: 'blur' }],
				password: [{ required: true, message: '密码不能为空！', trigger: 'blur' }]
			},
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
				currentPwd: [{ validator: validateNowPass, trigger: 'blur' }],
				checkPass: [{ validator: validateNewPass2, trigger: 'blur' }]
			},
			userId: '', //当前的userId，如果是需要首次修改密码时，需要userId参数
			loginType: 0, //登录方式，默认0 0扫码登录 1帐号登录
			wxloginType: '',
			wxcode: '', //微信登录的code
			wxLoginForm: {
				mobile: '',
				code: ''
			},
			wxLoginFormRule: {
				mobile: [{ validator: checkMobile, trigger: 'blur' }],
				code: [{ validator: checkCode, trigger: 'blur' }]
			},
			timeMax: 60, //获取验证码计时
			codeFlag: false,
			codeBtnTxt: '获取验证码',
			wxToken: '', //微信token
			timer: null //计时器
		}
	},
	computed: {
		...mapGetters(['auth_type', 'schoolInfo'])
	},
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
	methods: {
		initWxLogin() {
			if (!this.wxInitData) return
			const container = document.getElementById('login-code')
			if (container) container.innerHTML = ''
			const data = this.wxInitData
			new WxLogin({
				id: 'login-code',
				appid: data.appid,
				scope: 'snsapi_login',
				redirect_uri: data.redirect_url,
				state: 'WXLOGINNEW',
				style: 'black',
				href: 'https://cdnfile-10043692.file.myqcloud.com/vuewxcep/common_css/new_wx_login.css'
			})
		},
		switchToQrCode() {
			this.loginType = 0
			this.$nextTick(() => {
				this.initWxLogin()
			})
		},
		handleLogin() {
			this.oldPass = this.loginForm.password
			this.$refs.loginForm.validate(valid => {
				if (valid) {
					this.loading = true
					this.wxToken = '' //将wxtoken置为空，防止触发微信扫码逻辑
					login(this.loginForm.account, encrypt(this.loginForm.password))
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
			this.schoolList.forEach(function(item) {
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
					this.loading = false
					if (this.schoolInfo.type === 5) {
						if (global.command === 'production') {
							window.location = 'http://www.zhxiaoyuan.cn/boe/#/boe/homePage'
						} else {
							window.location = 'http://www.weixiaojia.net/boe/#/boe/homePage'
						}
					} else {
					    console.log('success')
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
									onClose: function() {
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
						.catch(err => {})
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
					wxBind(this.wxLoginForm.code.trim(), this.wxLoginForm.mobile.trim(), this.wxToken)
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
					getCode(this.wxLoginForm.mobile.trim())
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
			this.timer = setInterval(function() {
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
	destroyed() {}
}
</script>

<style lang="scss">
@import '../../../src/styles/mixin.scss';
#mainLogin {
	.tips {
		font-size: 14px;
		color: #fff;
		margin-bottom: 5px;
	}

	&.login-container {
		@include relative;
		height: 100vh;
		min-height: 720px;
		overflow: hidden;
		background-image:
			linear-gradient(90deg, rgba(24, 29, 34, 0.08) 0%, rgba(24, 29, 34, 0.18) 46%, rgba(24, 29, 34, 0.48) 100%),
			url("https://cdnfile-10043692.file.myqcloud.com/productVersion/common/danyang/省丹中画册/%E7%AC%AC21%E9%A1%B5-150.PNG");
		background-position: center center;
		background-size: cover;
		background-repeat: no-repeat;
		&:before {
			content: '';
			position: absolute;
			top: 0;
			right: 0;
			bottom: 0;
			left: 0;
			background: linear-gradient(180deg, rgba(255, 255, 255, 0.06) 0%, rgba(0, 0, 0, 0.28) 100%);
			pointer-events: none;
		}
		.login-form input:-webkit-autofill {
			-webkit-box-shadow: 0 0 0 1000px #fff inset !important;
			-webkit-text-fill-color: #3b2723 !important;
		}
		.login-form input {
			border: 0;
			-webkit-appearance: none;
			border-radius: 0;
			padding: 12px 5px 12px 15px;
			color: #3b2723;
			height: 47px;
		}
		.login-form .el-input {
			display: inline-block;
			height: 47px;
			width: 85%;
		}
		.svg-container {
			height: 40px;
			padding: 6px 5px 6px 15px;
			color: #a16b2a;
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
			padding: 34px 38px 15px 38px;
			margin: 26px auto 0 auto;
		}

		.login-form .el-form-item {
			border: 1px solid rgba(139, 26, 26, 0.12);
			background: rgba(255, 255, 255, 0.84);
			border-radius: 6px;
			color: #3b2723;
		}
		.login-form .white-back.el-form-item {
			border: 1px solid rgba(139, 26, 26, 0.12);
			background: rgba(255, 255, 255, 0.92);
			border-radius: 6px;
			color: #3b2723;
			box-shadow: 0 8px 24px rgba(67, 36, 20, 0.08);
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
			width: 440px;
			height: 540px;
			background-color: rgba(255, 251, 244, 0.9);
			border: 1px solid rgba(255, 255, 255, 0.56);
			border-radius: 8px;
			position: absolute;
			z-index: 2000;
			right: 9%;
			top: 50%;
			transform: translateY(-50%);
			box-shadow: 0 26px 70px rgba(32, 22, 16, 0.34);
			-webkit-backdrop-filter: blur(12px);
			backdrop-filter: blur(12px);
			overflow: hidden;
			&:before {
				content: '';
				position: absolute;
				top: 0;
				right: 0;
				left: 0;
				height: 4px;
				background: linear-gradient(90deg, #8b1a1a 0%, #d4af37 100%);
			}
			.qywx-link {
				position: absolute;
				right: 34px;
				bottom: 28px;
				display: inline-flex;
				align-items: center;
				gap: 7px;
				color: #8b1a1a;
				font-size: 14px;
				text-decoration: none;
				img {
					width: 16px;
					vertical-align: middle;
					display: inline-block;
				}
				.qywx-link__text {
					margin: 0;
					display: inline-block;
					vertical-align: middle;
				}
			}
		}

		.login-tabs {
			width: 100%;
			height: 112px;
			padding: 34px 42px 0 42px;
			box-sizing: border-box;
		}

		.login-tab {
			position: relative;
			width: 50%;
			float: left;
			height: 66px;
		}

		.login-tab-link {
			display: inline-block;
			position: relative;
			left: auto;
			bottom: auto;
			margin: 0;
			font-size: 18px;
			height: 40px;
			line-height: 40px;
			border-bottom: 2px solid transparent;
			color: #74655e;
			letter-spacing: 2px;
			font-weight: 500;
			cursor: pointer;
		}

		.login-tab-linked {
			border-bottom: 2px solid #8b1a1a;
			color: #8b1a1a;
			font-weight: 600;
		}

		.login-main {
			height: 365px;
			padding-bottom: 54px;
			box-sizing: border-box;
		}

		.login-main .el-button--primary {
			color: #fff;
			background-color: #8b1a1a;
			border-color: #8b1a1a;
			height: 44px;
			width: 100%;
			border-radius: 6px;
			font-size: 16px;
			letter-spacing: 4px;
			box-shadow: 0 12px 22px rgba(139, 26, 26, 0.22);
		}

		.login-main .el-button--primary:hover,
		.login-main .el-button--primary:focus {
			background-color: #6b1010;
			border-color: #6b1010;
		}

		.slogan-box {
			display: none;
		}

		.login-code {
			width: 100%;
			height: 100%;
			display: flex;
			align-items: center;
			justify-content: center;
			padding-top: 8px;
			box-sizing: border-box;
		}
		.wrap-footer {
			color: #fff;
			position: absolute;
			text-align: center;
			width: 100%;
			bottom: 26px;
			z-index: 2;
			text-shadow: 0 2px 8px rgba(0, 0, 0, 0.55);
			a {
				color: rgba(255, 255, 255, 0.9);
			}
		}
	}
}

@media screen and (max-width: 1500px) {
	#mainLogin {
		&.login-container {
			.login-box {
				right: 6%;
			}
		}
	}
}

@media screen and (max-width: 900px) {
	#mainLogin {
		&.login-container {
			min-height: 640px;
			background-position: center center;
			.login-box {
				width: calc(100% - 36px);
				max-width: 420px;
				height: 520px;
				right: 18px;
				left: 18px;
				top: 50%;
				margin: 0 auto;
			}
			.login-tabs {
				padding-left: 30px;
				padding-right: 30px;
			}
			.login-form {
				padding-left: 28px;
				padding-right: 28px;
			}
			.login-main {
				height: 345px;
				padding-bottom: 48px;
			}
			.wrap-footer {
				bottom: 14px;
				font-size: 12px;
			}
		}
	}
}
</style>
