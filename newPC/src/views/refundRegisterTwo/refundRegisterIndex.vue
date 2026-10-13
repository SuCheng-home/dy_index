<template>
	<div class="refund_register_wrap">
		<div class="header">
			<el-row>
				<el-col :span="19">
					<el-select v-model="state" placeholder="请选择" size="medium" @change="changeState">
						<el-option v-for="item in stateList" :key="item.value" :label="item.label" :value="item.value"></el-option>
					</el-select>
					<!-- <el-button type="primary" size="medium" @click="$router.push('/refunRegisterLogin')">前往(框架外新增)</el-button>
					<el-button type="primary" size="medium" @click="$router.push('refunRegisterLogin')">前往(框架内新增)</el-button> -->
					<!-- <el-button type="primary" size="medium" @click="showAddBox">新增</el-button> -->
					<a :href="exportUrl" download="导出" target="_blank" v-if="dataList.length">
						<el-button type="primary" size="medium">导出</el-button>
					</a>
				</el-col>
				<el-col :span="5">
					<el-input size="medium" v-model.trim="stuName" placeholder="请输入考生姓名或准考证号" @keyup.enter.native="searchStuName">
						<el-button size="medium" slot="append" icon="el-icon-search" @click="searchStuName"></el-button>
					</el-input>
				</el-col>
			</el-row>
		</div>
		<el-table stripe :data="dataList" border fit highlight-current-row :height="maxH">
			<el-table-column align="center" label="考生姓名" show-overflow-tooltip>
				<template slot-scope="scope">
					<span>{{ scope.row.stuName }}</span>
				</template>
			</el-table-column>
			<el-table-column align="center" label="准考证号" show-overflow-tooltip>
				<template slot-scope="scope">
					<span>{{ scope.row.rechargeNo }}</span>
				</template>
			</el-table-column>
			<el-table-column align="center" label="身份证号" show-overflow-tooltip>
				<template slot-scope="scope">
					<span>{{ scope.row.idCard || '--' }}</span>
				</template>
			</el-table-column>
			<el-table-column align="center" label="报名方式" show-overflow-tooltip>
				<template slot-scope="scope">
					<span>{{ scope.row.enrollType || '--' }}</span>
				</template>
			</el-table-column>
			<el-table-column align="center" label="退费金额" show-overflow-tooltip>
				<template slot-scope="scope">
					<span>{{ scope.row.refundMoney ? scope.row.refundMoney + '元' : '--' }}</span>
				</template>
			</el-table-column>
			<el-table-column align="center" label="开户行" show-overflow-tooltip>
				<template slot-scope="scope">
					<span>{{ scope.row.accountBankName || '--' }}</span>
				</template>
			</el-table-column>
			<el-table-column align="center" label="银行卡号" show-overflow-tooltip>
				<template slot-scope="scope">
					<span>{{ scope.row.accountCardNo || '--' }}</span>
				</template>
			</el-table-column>
			<el-table-column align="center" label="手机号" show-overflow-tooltip>
				<template slot-scope="scope">
					<span>{{ scope.row.mobile || '--' }}</span>
				</template>
			</el-table-column>
			<el-table-column align="center" label="持卡人" show-overflow-tooltip>
				<template slot-scope="scope">
					<span>{{ scope.row.accountName || '--' }}</span>
				</template>
			</el-table-column>
			<el-table-column align="center" label="状态">
				<template slot-scope="scope">
					<!-- <el-tag  size="mini" type="success" v-if="scope.row.isRefund === 2">已退费</el-tag> -->
					<el-tag  size="mini" type="success" v-if="scope.row.state === 2">已登记</el-tag>
					<el-tag  size="mini" v-else>未登记</el-tag>
				</template>
			</el-table-column>
			<!-- <el-table-column align="center" label="操作" show-overflow-tooltip>
				<template slot-scope="scope">
					<el-button type="text" size="small" @click="refundSign(scope.row.id)" v-show="scope.row.isRefund !== 2 && scope.row.state === 2">已退费</el-button>
					<el-button type="text" size="small" @click="showEditBox(scope.row.id)" v-show="scope.row.isRefund !== 2">编辑</el-button>
					<el-button type="text" size="small" @click="delRefundRegisterByIds(scope.row.id)" v-show="scope.row.isRefund !== 2" class="buttontextred">删除</el-button>
					<span v-show="scope.row.isRefund === 2">--</span>
				</template>
			</el-table-column> -->
		</el-table>
		<div class="pagination-container">
			<el-pagination @size-change="getSchoolRefundRegisterPageList" @current-change="getSchoolRefundRegisterPageList" :current-page.sync="pagination.pageNo" :page-sizes="[10, 20, 30, 50]" :page-size.sync="pagination.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="pagination.total"></el-pagination>
		</div>

		<el-dialog :title="`${isAddState ? '新增' : '编辑'}`" @close="closeBox" :visible.sync="isShowDialog" size="tiny" width="800px" :close-on-press-escape="false" :close-on-click-modal="false">
			<el-form :model="refundInfo" :rules="editFormRule" ref="editRegister" label-width="120px" class="demo-ruleForm" v-if="!isAddState">
				<el-form-item label="准考证号">
					<el-input v-model.trim="refundInfo.rechargeNo" :maxlength="20" disabled></el-input>
				</el-form-item>
				<el-form-item label="考生姓名">
					<el-input v-model.trim="refundInfo.stuName" :maxlength="10" disabled></el-input>
				</el-form-item>
				<el-form-item label="身份证号">
					<el-input v-model.trim="refundInfo.idCard" :maxlength="10" disabled></el-input>
				</el-form-item>
				<el-form-item label="报名方式">
					<el-radio v-model="refundInfo.enrollType" label="PC">PC</el-radio>
					<el-radio v-model="refundInfo.enrollType" label="mobile">mobile</el-radio>
				</el-form-item>
				<el-form-item label="退费金额" prop="refundMoney">
					<el-input-number v-model="refundInfo.refundMoney" :min="0" label="退费金额"></el-input-number>
					&nbsp;元
				</el-form-item>
				<el-form-item label="开户行" prop="accountBankCode">
					<el-select v-model="refundInfo.accountBankCode" placeholder="请选择" @change="selectBank">
						<el-option v-for="item in bankList" :key="item.value" :label="item.value" :value="item.code"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="银行卡号" prop="accountCardNo">
					<el-input v-model.trim="refundInfo.accountCardNo" :maxlength="19"></el-input>
				</el-form-item>
				<el-form-item label="手机号" prop="mobile">
					<el-input v-model.trim="refundInfo.mobile" :maxlength="11"></el-input>
				</el-form-item>
				<el-form-item label="持卡人" prop="accountName">
					<el-input v-model.trim="refundInfo.accountName" :maxlength="11"></el-input>
				</el-form-item>
			</el-form>
			<el-form :model="refundInfo" :rules="commitFormRule" ref="confirmRegister" label-width="120px" class="demo-ruleForm" v-else>
				<el-form-item label="考生姓名" prop="stuName">
					<el-input v-model.trim="refundInfo.stuName" :maxlength="10"></el-input>
				</el-form-item>
				<el-form-item label="准考证号" prop="rechargeNo">
					<el-input v-model.trim="refundInfo.rechargeNo" :maxlength="20"></el-input>
				</el-form-item>
				<el-form-item label="身份证号" prop="idCard">
					<el-input v-model.trim="refundInfo.rechargeNo" :maxlength="20"></el-input>
				</el-form-item>
				<el-form-item label="报名方式">
					<el-radio v-model="refundInfo.enrollType" label="PC">PC</el-radio>
					<el-radio v-model="refundInfo.enrollType" label="mobile">mobile</el-radio>
				</el-form-item>
				<el-form-item label="退费金额" prop="refundMoney">
					<el-input-number v-model="refundInfo.refundMoney" :min="0" label="退费金额"></el-input-number>
					&nbsp;元
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="isShowDialog = false">取 消</el-button>
				<el-button type="primary" @click="confirmBox" :disabled="btnLoading">确 定</el-button>
			</div>
		</el-dialog>
	</div>
</template>
<script>
import { getSchoolRefundRegisterPageList2, addRefundRegister2, editRefundRegister2, delRefundRegisterById2, getRefundRegisterInfoById2, refundSign2 } from '@/api/refundRegister'
import { findCommonSchoolDicsByCode } from '@/api/common/common'
import { mobileValidator } from '@/utils/validate'
import baseMixin from '@/mixins/baseMixin'
import mixin from '@/mixins/windowResize'

export default {
	name: 'refundRegisterIndex',
	data() {
		const idCardValidator = (rule, value, callback) => {
			var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
			if (this.refundInfo.idCard == '') {
				callback(new Error('身份证号不能为空！'))
			} else if (reg.test(this.refundInfo.idCard) === false) {
				callback(new Error('身份证号格式不正确！'))
			} else {
				callback()
			}
		}
		const accountNameValidator = (rule, value, callback) => {
			if (this.refundInfo.accountName !== this.refundInfo.stuName) {
				callback(new Error('持卡人与考生姓名不一致！'))
			} else if (this.refundInfo.accountName == '') {
				callback(new Error('持卡人不能为空！'))
			} else {
				callback()
			}
		}
		const refundMoneyValidator = (rule, value, callback) => {
			console.log(value)
			if (!value) {
				callback(new Error('请输入退费金额'))
			} else {
				callback()
			}
		}
		return {
			typeList: [
				{ label: 'PC', code: 'PC' },
				{ label: 'mobile', code: 'mobile' }
			],
			enrollType: '',
			bankList: [],
			btnLoading: false,
			isShowDialog: false,
			isAddState: true,
			stuName: '',
			state: 0,
			stateList: [
				{ value: 0, label: '全部状态' },
				{ value: 2, label: '已登记' },
				{ value: 1, label: '未登记' }
				// { value: 3, label: '已退费' }
			],
			dataList: [],
			pagination: {
				pageNo: 1,
				pageSize: 20,
				total: null
			},
			refundInfo: {},
			commitFormRule: {
				stuName: [{ required: true, message: '请填写学生姓名', trigger: 'blur' }],
				rechargeNo: [{ required: true, message: '请填写准考证号', trigger: 'blur' }],
				idCard: [{ required: true, validator: idCardValidator, trigger: 'blur' }], //校验身份证
				refundMoney: [{ required: true, validator: refundMoneyValidator, trigger: 'change' }]
			},
			editFormRule: {
				accountCardNo: [{ required: true, message: '请填写银行卡号', trigger: 'blur' }],
				accountBankCode: [{ required: true, message: '请选择开户行', trigger: 'blur' }],
				mobile: [{ required: true, validator: mobileValidator, trigger: 'blur' }], //校验手机号
				accountName: [{ required: true, validator: accountNameValidator, trigger: 'blur' }],
				refundMoney: [{ required: true, validator: refundMoneyValidator, trigger: 'change' }]
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
	computed: {
		exportUrl() {
			return `${global.BasePath}structure/refundRegisterTwo/exportRefundRegisterDatas?state=${this.state !== 3 ? this.state : 0}&isRefund=${[0, 2, 1].includes(this.state) ? 0 : 2}&stuName=${this.stuName}&token=${this.$store.getters.token}`
		}
	},
	watch: {
		'refundInfo.accountBankCode': {
			handler(newVal, oldVal) {
				if (newVal && !oldVal) {
					this.$nextTick(v => {
						this.$refs['editRegister'].validateField('accountBankCode')
					})
				}
			},
			deep: true
		},
		isAddState: {
			handler(newVal, oldVal) {
				if (newVal) {
					this.$nextTick(v => {
						this.$refs['confirmRegister'].clearValidate()
					})
				} else {
					this.$nextTick(v => {
						this.$refs['editRegister'].validateField('refundMoney')
					})
				}
			},
			deep: true
		}
	},
	created() {
		this.getSchoolRefundRegisterPageList()
		this.findCommonSchoolDicsByCode()
	},
	methods: {
		selectBank(val) {
			this.refundInfo.accountBankName = this.bankList.find(v => v.code == val).value
		},
		findCommonSchoolDicsByCode() {
			findCommonSchoolDicsByCode({
				dicCode: 'accountBankType'
			}).then(res => {
				this.bankList = res.data.data
			})
		},
		closeBox() {
			if (this.isAddState) {
				this.$refs['confirmRegister'].clearValidate()
				this.isShowDialog = false
			} else {
				this.$refs['editRegister'].clearValidate()
				this.isShowDialog = false
			}
		},
		cancelBox() {
			if (this.isAddState) {
				this.$refs['confirmRegister'].clearValidate()
				this.isShowDialog = false
			} else {
				this.$refs['editRegister'].clearValidate()
				this.refundInfo = {}
				this.isShowDialog = false
			}
		},
		showAddBox() {
			this.isAddState = true
			this.refundInfo = {
				stuName: '',
				rechargeNo: '',
				schoolId: '',
				accountName: '',
				accountCardNo: '',
				mobile: '',
				enrollType: 'PC',
				refundMoney: ''
			}
			this.isShowDialog = true
		},
		showEditBox(id) {
			this.isAddState = false
			this.currentId = id
			this.getRefundRegisterInfoById()
			this.isShowDialog = true
		},
		changeState() {
			this.pagination.pageNo = 1
			this.getSchoolRefundRegisterPageList()
		},
		searchStuName() {
			this.pagination.pageNo = 1
			this.getSchoolRefundRegisterPageList()
		},
		getSchoolRefundRegisterPageList() {
			getSchoolRefundRegisterPageList2({
				pageNo: this.pagination.pageNo,
				pageSize: this.pagination.pageSize,
				stuName: this.stuName,
				state: this.state !== 3 ? this.state : 0,
				isRefund: [0, 2, 1].includes(this.state) ? 0 : 2 //状态为0，1，2时  退费状态置为全部
			})
				.then(res => res.data)
				.then(data => {
					if (data.code === 200) {
						this.pagination.total = data.data.pagination.total
						this.dataList = data.data.dataList
					}
				})
		},
		confirmBox() {
			if (this.isAddState) {
				this.$refs['confirmRegister'].validate(valid => {
					if (valid) {
						let query = this.refundInfo
						query.state = 1
						this.addRefundRegister(query)
					}
				})
			} else {
				this.$refs['editRegister'].validate(valid => {
					if (valid) {
						let query = this.refundInfo
						query.state = 2
						this.editRefundRegister(query)
					}
				})
			}
		},
		addRefundRegister(query) {
			if (this.btnLoading) {
				return
			}
			this.btnLoading = true
			addRefundRegister2(query).then(res => {
				if (res.data.code === 200 && res.data.result) {
					this.$message.success('添加成功')
					this.isShowDialog = false
					this.pagination.pageNo = 1
					this.getSchoolRefundRegisterPageList()
				} else {
					this.$message.warning(res.data.msg)
				}
				this.btnLoading = false
			})
		},

		editRefundRegister(query) {
			if (this.btnLoading) {
				return
			}
			this.btnLoading = true
			editRefundRegister2(query).then(res => {
				if (res.data.code === 200 && res.data.result) {
					this.$message.success('保存成功')
					this.isShowDialog = false
					this.getSchoolRefundRegisterPageList()
				} else {
					this.$message.warning(res.data.msg)
				}
				this.btnLoading = false
			})
		},
		//删除
		delRefundRegisterByIds(id) {
			this.$confirm('此操作将删除此条登记信息, 是否继续?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			})
				.then(() => {
					delRefundRegisterById2({ id: id })
						.then(res => {
							if (res.data.code === 200 && res.data.result) {
								this.$message({
									type: 'success',
									message: '删除成功!'
								})
								this.pagination.pageNo = 1
								this.getSchoolRefundRegisterPageList()
							} else {
								this.$message.warning(res.data.msg)
							}
						})
						.catch()
				})
				.catch(() => {})
		},
		//删除
		refundSign(id) {
			this.$confirm('此操作将标记选中的学生为已退费, 是否继续?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			})
				.then(() => {
					refundSign2({ ids: id })
						.then(res => {
							if (res.data.code === 200 && res.data.result) {
								this.$message({
									type: 'success',
									message: '操作成功!'
								})
								this.pagination.pageNo = 1
								this.getSchoolRefundRegisterPageList()
							} else {
								this.$message.warning(res.data.msg)
							}
						})
						.catch()
				})
				.catch(() => {})
		},
		//详情
		getRefundRegisterInfoById() {
			getRefundRegisterInfoById2({ id: this.currentId })
				.then(res => {
					if (res.data.code === 200 && res.data.result) {
						this.refundInfo = res.data.data
					}
				})
				.catch()
		}
	}
}
</script>

<style lang="scss" scoped>
.refund_register_wrap {
	padding: 12px;

	.header {
		margin-bottom: 10px;
	}
}
</style>
