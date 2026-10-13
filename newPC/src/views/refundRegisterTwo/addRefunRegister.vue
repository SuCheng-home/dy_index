<template>
	<div class="refund_register_add">
		<!-- <div class="header">
			<el-row>
				<el-col :span="19">
					<el-button  size="medium" @click="$router.back()">返回</el-button>
				</el-col>
			</el-row>
		</div> -->
		<div class="title">退费信息登记</div>
		<div class="form_wrap">
			<el-form :model="formData" :rules="formRule" ref="formRegister" label-width="120px" class="demo-ruleForm">
				<el-form-item label="考生姓名" prop="stuName">
					<span>{{ formData.stuName }}</span>
				</el-form-item>
				<el-form-item label="准考证号" prop="stuName">
					<span>{{ formData.rechargeNo }}</span>
				</el-form-item>
				<el-form-item label="身份证号" prop="stuName">
					<span>{{ formData.idCard }}</span>
				</el-form-item>
				<el-form-item label="报名方式" prop="stuName">
					<span>{{ formData.enrollType }}</span>
				</el-form-item>
				<el-form-item label="退费金额" prop="stuName">
					<span>{{ formData.refundMoney + '元' }}</span>
				</el-form-item>
				<el-form-item label="手机号" prop="mobile">
					<el-input v-model.trim="formData.mobile" v-if="state == 1"></el-input>
					<span v-else>{{ formData.mobile }}</span>
				</el-form-item>
				<el-form-item label="银行卡号" prop="accountCardNo">
					<el-input v-model.trim="formData.accountCardNo" maxlength="19" show-word-limit v-if="state == 1"></el-input>
					<span v-else>{{ formData.accountCardNo }}</span>
				</el-form-item>
				<el-form-item label="开户行" prop="accountBankName">
					<el-select v-model="formData.accountBankCode" placeholder="请选择" @change="selectBank" v-if="state == 1">
						<el-option v-for="item in bankList" :key="item.value" :label="item.value" :value="item.code"></el-option>
					</el-select>
					<span v-else>{{ formData.accountBankName }}</span>
				</el-form-item>
				<el-form-item label="持卡人" prop="accountName">
					<el-input v-model.trim="formData.accountName" v-if="state == 1"></el-input>
					<span v-else>{{ formData.accountName }}</span>
				</el-form-item>
			</el-form>
			<div class="btn_area">
				<div class="btn_item" v-if="state === 2 && formData.isRefund !== 2" @click="state = 1">
					编辑
				</div>
				<div class="btn_item" v-if="state === 1 && formData.isRefund !== 2" @click="submitRefunRegister">
					提交
				</div>
			</div>

			<div class="tips" v-if="isExist">
				<div class="tips_title">
					备注：
				</div>
				<div class="tips_content">
					请认真核实，确认填写的银行卡号和持卡人信息为考生本人,勿复制粘贴银行卡号，并在填写银行卡号后仔细核对，确保卡号信息正确。
				</div>
				<!-- <div class="tips_content">
					提交后不可修改，请确保信息准确。
				</div> -->
			</div>
		</div>
	</div>
</template>
<script>
import { getRefundRegisterInfo, submitRefundRegisterInfo } from '@/api/refundRegister'
import { findCommonSchoolDicsByCode } from '@/api/common/common'
import baseMixin from '@/mixins/baseMixin'
import mixin from '@/mixins/windowResize'
export default {
	name: 'refundRegisterAdd',
	data() {
		const accountNameValidator = (rule, value, callback) => {
			if (this.formData.idCard.slice(6, 10) >= 2004) {
				if (!this.formData.accountName) {
					callback(new Error('持卡人不能为空！'))
				} else {
					callback()
				}
			} else {
				if (this.formData.accountName !== this.formData.stuName) {
					callback(new Error('持卡人与考生姓名不一致！'))
				} else if (!this.formData.accountName) {
					callback(new Error('持卡人不能为空！'))
				} else {
					callback()
				}
			}
		}
		const accountCardNoValidator = (rule, value, callback) => {
			let reg = /^\d+$/
			if (!value) {
				callback(new Error('银行卡号不能为空！'))
			}
			if (!reg.test(value)) {
				callback(new Error('银行卡号格式不正确！'))
			} else {
				callback()
			}
		}
		const mobileValidator = (rule, value, callback) => {
			console.log(value)
			let reg = /^0?1[3456789][0-9]\d{8}$/
			if (!value) {
				callback(new Error('手机号码不能为空！'))
			}
			if (!reg.test(value)) {
				callback(new Error('手机号码格式不正确！'))
			} else {
				callback()
			}
		}
		return {
			bankList: [],
			isExist: true,
			btnLoading: false,
			isShowDialog: false,
			isAddState: true,
			stuName: '',
			state: 0,
			stateList: [
				{ value: 0, label: '全部状态' },
				{ value: 2, label: '已提交' },
				{ value: 1, label: '未提交' },
				{ value: 3, label: '已退费' }
			],
			dataList: [],
			pagination: {
				pageNo: 1,
				pageSize: 20,
				total: null
			},
			refundInfo: {},
			formData: {
				mobile: '',
				accountCardNo: '', //卡号
				accountBankName: '', //开户行名称
				accountBankCode: '', //开户行code
				accountName: '', //持卡人
				rechargeNo: '', //准考证号
				stuName: '',
				id: ''
			},
			formRule: {
				mobile: [{ required: true, validator: mobileValidator, trigger: 'blur' }], //校验手机号
				accountCardNo: [{ required: true, validator: accountCardNoValidator, trigger: 'blur' }], //校验银行卡号
				accountBankName: [{ required: true, message: '请填写开户银行', trigger: 'blur' }], //校验开户行
				accountName: [{ required: true, validator: accountNameValidator, trigger: 'blur' }] //校验持卡人
			},
			currentId: 0
		}
	},
	mixins: [baseMixin, mixin],
	filters: {
		timeFilter(datetime) {
			return datetime ? datetime.substring(0, datetime.lastIndexOf('.')) : '--'
		}
	},
	computed: {},
	created() {
		this.formData.stuName = this.$route.query.stuName
		this.formData.rechargeNo = this.$route.query.rechargeNo
		this.formData.id = this.$route.query.id
		this.formData.idCard = this.$route.query.idCard
		this.findCommonSchoolDicsByCode()
	},
	methods: {
		selectBank(val) {
			this.formData.accountBankName = this.bankList.find(v => v.code == val).value
		},
		findCommonSchoolDicsByCode() {
			findCommonSchoolDicsByCode({
				dicCode: 'accountBankType'
			}).then(res => {
				this.bankList = res.data.data
				this.getRefundRegisterInfo()
			})
		},
		// 提交申请
		submitRefunRegister() {
			this.$refs['formRegister'].validate(valid => {
				if (valid) {
					submitRefundRegisterInfo({ ...this.formData, state: 2 }).then(res => {
						if (res.data.result) {
							this.$alert('您的信息已完成登记，请及时关注退款到账情况。', {
								confirmButtonText: '确定'
							})
							this.getRefundRegisterInfo()
						}
					})
				} else {
				}
			})
		},
		//详情
		getRefundRegisterInfo() {
			getRefundRegisterInfo({ idCard: this.$route.query.idCard, schoolId: this.$route.query.sid, stuName: this.$route.query.stuName, rechargeNo: this.$route.query.rechargeNo })
				.then(res => {
					if (res.data.code === 200 && res.data.result) {
						this.formData = res.data.data
						this.state = this.formData.state
					}
				})
				.catch()
		}
	}
}
</script>

<style lang="scss" scoped>
.refund_register_add {
	padding: 15px;
	.btn_area {
		margin-top: 10px;
		.btn_item {
			cursor: pointer;
			margin: 0 auto;
			width: 300px;
			height: 45px;
			text-align: center;
			background-color: #409eff;
			border-radius: 10px;
			line-height: 45px;
			color: #fff;
		}
	}
	.title {
		font-size: 30px;
		font-weight: bold;
		margin: 50px auto;
		text-align: center;
	}
	.form_wrap {
		padding: 0px 15px;
		width: 810px;
		margin: 0px auto;
	}
	.header {
		padding-bottom: 10px;
		margin-bottom: 10px;
		border-bottom: 1px solid #e7eaec;
	}
	.tips {
		font-size: 15px;
		margin: 70px 40px;

		width: 500px;
		.tips_title {
		}
		.tips_content {
			margin: 10px 0;
			padding-left: 30px;
		}
	}
}
</style>
