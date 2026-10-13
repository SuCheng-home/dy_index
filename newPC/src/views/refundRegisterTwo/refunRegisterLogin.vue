<template>
	<div class="out_wrap">
		<default-page :Mes="message" v-if="!isOpen"></default-page>
		<div class="refund_register_add" v-else>
			<div class="title">退费信息登记</div>
			<div class="form_wrap">
				<el-form :model="formData" :rules="formRule" ref="formRegister" label-width="120px" class="demo-ruleForm">
					<el-form-item label="考生姓名" prop="stuName">
						<el-input v-model.trim="formData.stuName"></el-input>
					</el-form-item>
					<el-form-item label="准考证号" prop="rechargeNo">
						<el-input v-model.trim="formData.rechargeNo"></el-input>
					</el-form-item>
					<el-form-item label="身份证号" prop="idCard">
						<el-input v-model.trim="formData.idCard"></el-input>
					</el-form-item>
				</el-form>
				<div class="nextBtn" @click="goAddRefunRegister">
					下一步
				</div>
			</div>
			<div class="tips" v-if="isExist">
				考生信息不存在！如果您已成功登记，登记信息已进入退款流程！
			</div>
		</div>
	</div>
</template>
<script>
import { getRefundRegisterInfo } from '@/api/refundRegister'
import { getSchoolDicDetailsByTypeCode2 } from '@/api/common/common'
import DefaultPage from '@/components/DefaultPage'

export default {
	name: 'refundRegisterAdd',
	data() {
		const idCardValidator = (rule, value, callback) => {
			var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
			if (this.formData.idCard == '') {
				callback(new Error('身份证号不能为空！'))
			} else if (reg.test(this.formData.idCard) === false) {
				callback(new Error('身份证号格式不正确！'))
			} else {
				callback()
			}
		}
		return {
			message: '',
			isOpen: true,
			isExist: false,
			formData: {
				rechargeNo: '', //准考证号
				stuName: '',
				schoolId: this.$route.query.sid || 672,
				idCard: ''
			},
			formRule: {
				stuName: [{ required: true, message: '请填写考生姓名', trigger: 'blur' }], //校验银行卡号
				rechargeNo: [{ required: true, message: '请填写准考证号', trigger: 'blur' }], //校验开户行
				idCard: [{ required: true, validator: idCardValidator, trigger: 'blur' }] //校验身份证
			}
		}
	},
	computed: {},
	created() {
		this.getSchoolDicDetailsByTypeCode2()
	},
	components: {
		DefaultPage
	},
	methods: {
		getSchoolDicDetailsByTypeCode2() {
			getSchoolDicDetailsByTypeCode2({
				typeCode: 'refundRegisterTwo',
				schoolId: this.$route.query.sid
			}).then(res => {
				let data = res.data.data
				if (data.length) {
					this.isOpen = false
					this.message = data.find(v => {
						return v.code === 'isOpenRefundRegisterTwo'
					}).remark
				}
			})
		},
		goAddRefunRegister() {
			this.$refs['formRegister'].validate(valid => {
				if (valid) {
					getRefundRegisterInfo(this.formData).then(res => {
						if (res.data.data && res.data.data.enrollType && res.data.data.enrollType.toUpperCase() === 'PC') {
							this.$alert('您的信息已完成登记,请及时关注退款到账情况。', {
								confirmButtonText: '确定'
							})
							// this.$message.warning('退费信息已收集，系统会原订单退回，请关注账单情况。')
						} else if (res.data.data && res.data.data.enrollType && res.data.data.enrollType === 'noPubPay') {
							this.$alert('未查询到您的网上缴费信息，请联系您的报考单位。', {
								confirmButtonText: '确定'
							})
						} else if (res.data.data && res.data.data.enrollType && res.data.data.enrollType === 'enlist') {
							this.$alert('未查询到您的网上缴费信息，请联系您的报考单位。', {
								confirmButtonText: '确定'
							})
						} else if (res.data.result) {
							this.$router.push({
								path: 'addRefunRegister',
								query: {
									stuName: this.formData.stuName,
									rechargeNo: this.formData.rechargeNo,
									sid: this.$route.query.sid,
									idCard: this.formData.idCard
								}
							})
						} else {
							this.isExist = true
						}
					})
				}
			})
		}
	}
}
</script>
<style lang="scss" scoped>
/deep/ .el-message-box {
	vertical-align: top !important;
}
.out_wrap {
	text-align: center;
	width: 100%;
	height: 100vh;
	overflow: hidden;
	background-color: #f8f8f8;
}
.refund_register_add {
	width: 760px;
	margin: 100px auto;
	height: 550px;
	border-radius: 15px;
	background-color: #fff;
	box-shadow: 0 10px 30px 0 #0000001a;
	padding: 15px;
	.title {
		padding-top: 40px;
		margin-bottom: 60px;
		font-size: 30px;
		font-weight: bold;
		text-align: center;
	}
	.form_wrap {
		padding: 0px 30px;

		.el-form-item {
			margin-bottom: 40px;
		}
		.nextBtn {
			width: 300px;
			height: 50px;
			border-radius: 10px;
			text-align: center;
			margin: 0 auto;
			margin-top: 70px;
			margin-bottom: 10px;
			line-height: 50px;
			cursor: pointer;
			color: #fff;
			background: #409eff;
		}
	}
	.header {
		padding-bottom: 10px;
		margin-bottom: 10px;
		border-bottom: 1px solid #e7eaec;
	}
	.tips {
		font-size: 15px;
		text-align: center;
		margin: 37px auto;
		color: #f56c6c;
	}
}
</style>
