<template>
	<div class="refund_register_wrap">
		<div class="header">
			<el-row>
				<el-col :span="19">
					<el-select v-model="state" placeholder="请选择" size="medium" @change="changeState">
						<el-option v-for="item in stateList" :key="item.value" :label="item.label" :value="item.value"></el-option>
					</el-select>

					<el-button type="primary" size="medium" @click="showAddBox">新增</el-button>
					<a :href="exportUrl" download="导出" target="_blank" v-if="dataList.length">
						<el-button type="primary" size="medium">导出</el-button>
					</a>
				</el-col>
				<el-col :span="5">
					<el-input size="medium" v-model.trim="stuName" placeholder="请输入学生姓名" @keyup.enter.native="searchStuName">
						<el-button size="medium" slot="append" icon="el-icon-search" @click="searchStuName"></el-button>
					</el-input>
				</el-col>
			</el-row>
		</div>
		<el-table stripe :data="dataList" border fit highlight-current-row :height="maxH">
			<el-table-column align="center" label="学生姓名" show-overflow-tooltip>
				<template slot-scope="scope">
					<span>{{ scope.row.stuName }}</span>
				</template>
			</el-table-column>
			<el-table-column align="center" label="身份证号" show-overflow-tooltip>
				<template slot-scope="scope">
					<span>{{ scope.row.rechargeNo }}</span>
				</template>
			</el-table-column>
			<el-table-column align="center" label="班级名称" show-overflow-tooltip>
				<template slot-scope="scope">
					<span>{{ scope.row.className || '--' }}</span>
				</template>
			</el-table-column>
			<el-table-column align="center" label="退款账户户名" show-overflow-tooltip>
				<template slot-scope="scope">
					<span>{{ scope.row.accountName || '--' }}</span>
				</template>
			</el-table-column>
			<el-table-column align="center" label="退款账户卡号" show-overflow-tooltip>
				<template slot-scope="scope">
					<span>{{ scope.row.accountCardNo || '--' }}</span>
				</template>
			</el-table-column>
			<el-table-column align="center" label="联系方式" show-overflow-tooltip>
				<template slot-scope="scope">
					<span>{{ scope.row.mobile || '--' }}</span>
				</template>
			</el-table-column>
			<el-table-column align="center" label="登记时间" show-overflow-tooltip>
				<template slot-scope="scope">
					<span v-if="scope.row.state === 2 || scope.row.isRefund === 2">{{ scope.row.updateTime | timeFilter }}</span>
					<span v-else>--</span>
				</template>
			</el-table-column>
			<el-table-column align="center" label="状态">
				<template slot-scope="scope">
					<el-tag  size="mini" type="success" v-if="scope.row.isRefund === 2">已退费</el-tag>
					<el-tag  size="mini" v-else-if="scope.row.state === 2">已提交</el-tag>
					<el-tag  size="mini" type="info" v-else>未提交</el-tag>
				</template>
			</el-table-column>
			<el-table-column align="center" label="操作" show-overflow-tooltip>
				<template slot-scope="scope">
					<el-button type="text" size="small" @click="refundSign(scope.row.id)" v-show="scope.row.isRefund !== 2 && scope.row.state === 2">已退费</el-button>
					<el-button type="text" size="small" @click="showEditBox(scope.row.id)" v-show="scope.row.isRefund !== 2">编辑</el-button>
					<el-button type="text" size="small" @click="delRefundRegisterByIds(scope.row.id)" v-show="scope.row.isRefund !== 2" class="buttontextred">删除</el-button>
					<span v-show="scope.row.isRefund === 2">--</span>
				</template>
			</el-table-column>
		</el-table>
		<div class="pagination-container">
			<el-pagination @size-change="getSchoolRefundRegisterPageList" @current-change="getSchoolRefundRegisterPageList" :current-page.sync="pagination.pageNo" :page-sizes="[10, 20, 30, 50]" :page-size.sync="pagination.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="pagination.total"></el-pagination>
		</div>

		<el-dialog :title="`${isAddState ? '新增' : '编辑'}`" :visible.sync="isShowDialog" size="tiny" width="800px" :close-on-press-escape="false" :close-on-click-modal="false">
			<el-form :model="refundInfo" :rules="editFormRule" ref="editRegister" label-width="120px" class="demo-ruleForm" v-if="!isAddState">
				<el-form-item label="学生姓名" prop="stuName">
					<el-input v-model.trim="refundInfo.stuName" :maxlength="10" disabled></el-input>
				</el-form-item>
				<el-form-item label="身份证号" prop="rechargeNo">
					<el-input v-model.trim="refundInfo.rechargeNo" :maxlength="20" disabled></el-input>
				</el-form-item>
				<el-form-item label="班级名称" prop="className">
					<el-input v-model.trim="refundInfo.className" :maxlength="20"></el-input>
				</el-form-item>
				<el-form-item label="退款账户户名" prop="accountName">
					<el-input v-model.trim="refundInfo.accountName" :maxlength="10"></el-input>
				</el-form-item>
				<el-form-item label="退款账户卡号" prop="accountCardNo">
					<el-input v-model.trim="refundInfo.accountCardNo" :maxlength="19"></el-input>
				</el-form-item>
				<el-form-item label="联系方式" prop="mobile">
					<el-input v-model.trim="refundInfo.mobile" :maxlength="11"></el-input>
				</el-form-item>
			</el-form>
			<el-form :model="refundInfo" :rules="commitFormRule" ref="confirmRegister" label-width="120px" class="demo-ruleForm" v-else>
				<el-form-item label="学生姓名" prop="stuName">
					<el-input v-model.trim="refundInfo.stuName" :maxlength="10"></el-input>
				</el-form-item>
				<el-form-item label="身份证号" prop="rechargeNo">
					<el-input v-model.trim="refundInfo.rechargeNo" :maxlength="20"></el-input>
				</el-form-item>
				<el-form-item label="班级名称" prop="className">
					<el-input v-model.trim="refundInfo.className" :maxlength="20"></el-input>
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
import { getSchoolRefundRegisterPageList, addRefundRegister, editRefundRegister, delRefundRegisterById, getRefundRegisterInfoById, refundSign } from '@/api/refundRegister'
import baseMixin from '@/mixins/baseMixin'
import mixin from '@/mixins/windowResize'

export default {
	name: 'refundRegisterIndex',
	data() {
		return {
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
			commitFormRule: {
				stuName: [{ required: true, message: '请填写学生姓名', trigger: 'blur' }],
				rechargeNo: [{ required: true, message: '请填写充值编号', trigger: 'blur' }]
			},
			editFormRule: {
				accountName: [{ required: true, message: '请填写退款账户户名', trigger: 'blur' }],
				accountCardNo: [{ required: true, message: '请填写退款账户卡号', trigger: 'blur' }],
				mobile: [{ required: true, message: '请填写联系方式', trigger: 'blur' }]
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
			return `${global.BasePath}structure/refundRegister/exportRefundRegisterDatas?state=${this.state === 3 ? 0 : this.state}&isRefund=${this.state === 3 ? 2 : this.state === 0 ? 0 : 1}&stuName=${this.stuName}&token=${this.$store.getters.token}`
		}
	},
	created() {
		this.getSchoolRefundRegisterPageList()
	},
	methods: {
		showAddBox() {
			this.isAddState = true;
			this.refundInfo = {
				stuName: '',
				rechargeNo: '',
				className: '',
				schoolId: '',
				accountName: '',
				accountCardNo: '',
				mobile: ''
			};
			this.isShowDialog = true
		},
		showEditBox(id) {
			this.isAddState = false;
			this.currentId = id;
			this.getRefundRegisterInfoById();
			this.isShowDialog = true
		},
		changeState() {
			this.pagination.pageNo = 1;
			this.getSchoolRefundRegisterPageList()
		},
		searchStuName() {
			this.pagination.pageNo = 1;
			this.getSchoolRefundRegisterPageList()
		},
		getSchoolRefundRegisterPageList() {
			getSchoolRefundRegisterPageList({
				pageNo: this.pagination.pageNo,
				pageSize: this.pagination.pageSize,
				stuName: this.stuName,
				state: this.state === 3 ? 0 : this.state,
				isRefund: this.state === 3 ? 2 : this.state === 0 ? 0 : 1
			})
				.then(res => res.data)
				.then(data => {
					if (data.code === 200) {
						this.pagination.total = data.data.pagination.total;
						this.dataList = data.data.dataList
					}
				})
		},
		confirmBox() {
			if (this.isAddState) {
				this.$refs['confirmRegister'].validate(valid => {
					if (valid) {
						let query = this.refundInfo;
						query.state = 1;
						this.addRefundRegister(query)
					}
				})
			} else {
				this.$refs['editRegister'].validate(valid => {
					if (valid) {
						const g = /^0?1[345789][0-9]\d{8}$/;
						if (this.refundInfo.mobile && !g.test(this.refundInfo.mobile)) {
							this.$message.warning('手机号码格式不正确！');
							return
						}
						let query = this.refundInfo;
						query.state = 2;
						this.editRefundRegister(query)
					}
				})
			}
		},
		addRefundRegister(query) {
			if (this.btnLoading) {
				return
			}
			this.btnLoading = true;
			addRefundRegister(query).then(res => {
				if (res.data.code === 200 && res.data.result) {
					this.$message.success('添加成功');
					this.isShowDialog = false;
					this.pagination.pageNo = 1;
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
			this.btnLoading = true;
			editRefundRegister(query).then(res => {
				if (res.data.code === 200 && res.data.result) {
					this.$message.success('保存成功');
					this.isShowDialog = false;
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
					delRefundRegisterById({ id: id })
						.then(res => {
							if (res.data.code === 200 && res.data.result) {
								this.$message({
									type: 'success',
									message: '删除成功!'
								});
								this.pagination.pageNo = 1;
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
					refundSign({ ids: id })
						.then(res => {
							if (res.data.code === 200 && res.data.result) {
								this.$message({
									type: 'success',
									message: '操作成功!'
								});
								this.pagination.pageNo = 1;
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
			getRefundRegisterInfoById({ id: this.currentId })
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
