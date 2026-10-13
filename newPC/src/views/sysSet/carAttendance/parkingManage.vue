<template>
	<div class="common_wrap-carAttendance">
		<div class="header">
			<el-row>
				<el-col :span="19">
					<el-button size="medium" @click="$router.back()">返回</el-button>
					<el-button size="medium" type="primary" @click="addIt">新增</el-button>
					<!-- <a target="_blank" :href="exportUrl" download="">
						<el-button type="primary" size="medium">导出</el-button>
					</a> -->
				</el-col>
				<!-- <el-col :span="5">
					<el-input size="medium" placeholder="请输入教师姓名" v-model="searchName" @keyup.enter.native="queryListFunc">
						<el-button slot="append" icon="el-icon-search" size="medium" @click="queryListFunc"></el-button>
					</el-input>
				</el-col> -->
			</el-row>
		</div>
		<el-table :data="dataList" :height="maxH - 19" style="width: 100%" border>
			<el-table-column label="停车场名称" align="center" width="350px" show-overflow-tooltip>
				<template slot-scope="scope">
					<span>{{ scope.row.carPlaceName }}</span>
				</template>
			</el-table-column>
			<el-table-column label="编号" align="center" prop="className" show-overflow-tooltip>
				<template slot-scope="scope">
					<span>
						{{ scope.row.carPlaceCode }}
					</span>
				</template>
			</el-table-column>

			<el-table-column width="140" label="操作" align="center">
				<template slot-scope="scope">
					<el-button type="text" size="small" @click="deleteHandler(scope.row.id)" style="color: red" class="buttontextred">删除</el-button>
				</template>
			</el-table-column>
		</el-table>
		<!-- <div class="pagination-container">
			<el-pagination
				@size-change="sizeChangeHandler"
				@current-change="currentChangeHandler"
				:current-page.sync="pagination.pageNo"
				:page-sizes="[10, 20, 30, 50]"
				:page-size.sync="pagination.pageSize"
				layout="total, sizes, prev, pager, next, jumper"
				:page-count="pagination.pages"
				:total="pagination.total"
			></el-pagination>
		</div> -->
		<el-dialog title="新增" :visible.sync="dialogFormVisible">
			<el-form :model="query" :rules="rules" ref="dialogForm">
				<el-form-item label="停车场名称:" :label-width="formLabelWidth" prop="carPlaceName">
					<el-input v-model="query.carPlaceName" placeholder="请输入" maxlength="20" show-word-limit></el-input>
				</el-form-item>
				<el-form-item label="编号:" :label-width="formLabelWidth" prop="carPlaceCode">
					<el-input v-model="query.carPlaceCode" placeholder="请输入" maxlength="50" show-word-limit></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="dialogFormVisible = false">取 消</el-button>
				<el-button type="primary" @click="confirmAdd">确 定</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
import windowResize from '@/mixins/windowResize'
import baseMixin from '@/mixins/baseMixin'
import AddressBook from '@/components/AddressBook/indexExpand'
import { getCarPlaceList, addCarPlace, delCarPlace } from '@/api/carAttendance'
export default {
	name: 'parkingManage',
	data() {
		return {
			query: {
				carPlaceCode: '',
				carPlaceName: ''
			},
			// exportUrl: '',
			isAdd: '',
			formLabelWidth: '120px',
			dialogFormVisible: false,
			rules: {
				carPlaceCode: [{ required: true, message: '请填写编号', trigger: 'blur' }],
				carPlaceName: [{ required: true, message: '请填写停车场名称', trigger: 'blur' }]
			},
			dataList: [],
			pagination: {
				pageNo: 1,
				pageSize: 10,
				total: 0
			}
		}
	},
	components: {
		AddressBook
	},
	watch: {
		dialogFormVisible(val) {
			if (val) {
				this.$refs.dialogForm && this.$refs.dialogForm.clearValidate()
			} else {
				this.$nextTick(() => {
					this.query.carPlaceCode = ''
					this.query.carPlaceName = ''
				})
			}
		}
	},
	created() {
		this.queryListFunc()
	},
	mixins: [windowResize, baseMixin],
	methods: {
		//新建确认
		confirmAdd() {
			this.$refs.dialogForm.validate(valid => {
				if (valid) {
					addCarPlace({ carPlaceCode: this.query.carPlaceCode, carPlaceName: this.query.carPlaceName }).then(res => {
						this.queryListFunc().then(res => {
							this.$message.success('新增成功!')
							this.query.carPlaceCode = ''
							this.query.carPlaceName = ''
							this.dialogFormVisible = false
						})
					})
				}
			})
		},
		addIt() {
			this.dialogFormVisible = true
			this.isAdd = true
		},
		searchList() {
			this.pagination.pageNo = 1
			this.queryListFunc()
		},
		sizeChangeHandler() {
			this.pagination.pageNo = 1
			this.queryListFunc()
		},
		currentChangeHandler() {
			this.queryListFunc()
		},
		deleteHandler(id) {
			this.$confirm('确认要删除该停车场地点信息吗？', '删除', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning',
				lockScroll: false
			}).then(() => {
				delCarPlace({
					carPlaceId: id
				}).then(() => {
					this.queryListFunc().then(res => {
						this.$message.success('删除成功!')
					})
				})
			})
		},
		queryListFunc() {
			return getCarPlaceList().then(res => {
				this.dataList = res.data.data
				// this.exportUrl = global.BasePath + 'structure/car/exportCarUserList?userName=' + this.searchName + '&token=' + this.$store.getters.token
				return res
			})
		}
	}
}
</script>
<style>
.common_wrap-carAttendance .el-dialog {
	width: 700px !important;
}
</style>
<style lang="scss" scoped>
.common_wrap-carAttendance {
	padding: 12px;

	.header {
		padding-bottom: 10px;
		overflow: hidden;
	}

	.pagination-container {
		margin-top: 10px;
	}
}
</style>
