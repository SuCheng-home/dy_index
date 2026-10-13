<template>
	<div class="maintainEattingUser">
		<div class="header">
			<el-row>
				<el-col :span="19">
					<el-button size="medium" @click="$router.back()">返回</el-button>
					<el-button size="medium" type="primary" @click="goNewEatingUser">增加就餐人员</el-button>
					<el-button size="medium" type="primary" @click="batchChangeDate">批量修改就餐开始日期</el-button>
					<el-button size="medium" type="primary" @click="batchDeleteHandler">移除</el-button>
					<el-button size="medium" type="primary" @click="updateStuLearNumInfoList" v-if="restaurantType==2">刷新姓名学号</el-button>
					<a :href="exportUrl" target="_blank"><el-button size="medium" type="primary">导出</el-button></a>
				</el-col>
				<el-col :span="5">
					<el-input size="medium" placeholder="请输入姓名" v-model="searchName" @keyup.enter.native="searchList">
						<el-button slot="append" icon="el-icon-search" size="medium" @click="searchList"></el-button>
					</el-input>
				</el-col>
			</el-row>
		</div>
		<el-table :data="dataList" :height="maxH" style="width: 100%" border @selection-change="handleSelectionChange">
			<el-table-column type="selection" align="center" width="100"></el-table-column>
			<el-table-column label="姓名" align="center" width="350px" show-overflow-tooltip>
				<template slot-scope="scope">
					<span>{{ scope.row.userName }}</span>
				</template>
			</el-table-column>
			<el-table-column :label="$route.query.restaurantType == 1 ? '部门' : '班级'" align="center" prop="className"></el-table-column>
			<el-table-column label="就餐开始日期" align="center" prop="repastDate"></el-table-column>
			<el-table-column label="操作" align="center">
				<template slot-scope="scope">
					<el-button type="text" size="small" @click="editDate(scope.row.id, scope.row.repastDate)">修改就餐开始日期</el-button>
					<el-button type="text" size="small" style="color: red" @click="deleteHandler(scope.row.id)">移除</el-button>
				</template>
			</el-table-column>
		</el-table>

		<address-book ref="addressBook" v-show="addressBookShow" v-model="stuAddressData" :config="stuConfigData" :isSchoolManager="true" @input="addNotEating"></address-book>
		<div class="pagination-container">
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
		</div>
		<el-dialog title="修改就餐时间" :visible.sync="dialogFormVisible">
			<el-form :model="formData" ref="dialogForm" :rules="rules">
				<el-form-item label="开始日期" :label-width="80" prop="startDate">
					<el-date-picker v-model="formData.startDate" type="date" placeholder="选择日期"></el-date-picker>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="dialogFormVisible = false">取 消</el-button>
				<el-button type="primary" @click="confirmDate">确 定</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
import windowResize from '@/mixins/windowResize'
import baseMixin from '@/mixins/baseMixin'
import AddressBook from '@/components/AddressBook/indexExpand'
import { addNoRepastUser, queryRepastUserByRestaurantId, deleteRepastUserByIds, updateRepastDate, batchUpdateRepastDate,updateStuLearNumInfoList } from '@/api/eatSetting'
export default {
	name: 'multiList',
	data() {
		return {
			restaurantType: this.$route.query.restaurantType,
			isBatchChange: false,
			dialogFormVisible: false,
			exportUrl: '',
			addressBookShow: false,
			searchName: '',
			dataList: [
			],
			rules: {
				startDate: [{ required: true, message: '请选择开始日期！', trigger: 'change' }]
			},
			editId: '',
			formData: {
				startDate: ''
			},
			typeList: { 1: '中小学' },
			multipleSelection: [],
			stuAddressData: [],
			stuConfigData: {
				title: '请选择学生',
				depart: {
					target: 'all',
					departType: 's',
					userTypes: '2'
					// notCheckSchool: true
				},
				group: true
				// SingleChose: true
			}
		}
	},
	components: {
		AddressBook
	},
	filters: {
		timeFilter(time) {
			return time ? time.substring(0, 19) : ''
		}
	},
	watch: {
		dialogFormVisible: {
			handler(val) {
				if (val) {
					this.$nextTick(() => {
						this.$refs['dialogForm'] && this.$refs['dialogForm'].clearValidate()
					})
				}
			},
			deep: true
		}
	},
	created() {
		this.queryListFunc()
	},
	mounted() {
		this.exportUrl = global.BasePath + 'structure/repastManagement/downRestaurantUser?restaurantId=' + this.$route.query.id + '&token=' + this.$store.getters.token
	},
	mixins: [windowResize, baseMixin],
	methods: {
		updateStuLearNumInfoList() {
			this.$confirm('确认要刷新姓名学号？', '复制', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning',
				lockScroll: false
			})
				.then(() => {
					updateStuLearNumInfoList().then(() => {
						this.$message.success('刷新姓名学号成功！')
						this.queryListFunc()
					})
				})
				.catch(() => {
					this.$message.info('已取消操作！')
				})
		},
		editDate(id, repastDate) {
			this.dialogFormVisible = true
			this.formData.startDate = repastDate
			this.isBatchChange = false
			this.editId = id
		},
		confirmDate() {
			this.$refs['dialogForm'].validate(isTrue => {
				if (isTrue) {
					if (!this.isBatchChange) {
						updateRepastDate({ repastDate: this.$moment(this.formData.startDate).format('YYYY-MM-DD'), repastUserId: this.editId }).then(res => {
							this.queryListFunc()
							this.$message.success('修改成功！')
							this.dialogFormVisible = false
						})
					} else {
						this.batchUpdateRepastDate()
					}
				}
			})
		},
		addNotEating(e) {
			console.log(e)
			if (!e.departJson.length && !e.groupJson.length && !e.userJson.length) {
				this.$message({
					type: 'warning',
					message: '请选择要添加的不就餐人员'
				})
				this.$refs.addressBook.dialogTableVisible = true
				return
			} else {
				let departIds = []
				e.departJson.forEach(v => {
					departIds.push(v.id)
				})
				let userIds = []
				e.userJson.forEach(v => {
					userIds.push(v.id)
				})
				addNoRepastUser({ departIds: departIds.join(','), userIds: userIds.join(','), isTeacher: 0 }).then(res => {
					this.$message.success('添加成功！')
					this.stuAddressData = []
					this.queryListFunc()
				})
			}
		},
		toAddPage() {
			// this.$router.push({path: ''})
		},
		toEditPage(id) {
			// this.$router.push({path: '', query: {id: id}})
		},
		handleSelectionChange(val) {
			console.log(val)
			this.multipleSelection = val
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
		batchDeleteHandler() {
			if (!this.multipleSelection.length) {
				this.$message.warning('请选择要移除的项')
			} else {
				this.deleteHandler(this.multipleSelection.map(({ id }) => id).join(','))
			}
		},
		deleteHandler(ids) {
			this.$confirm('确认要移除吗？', '移除', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning',
				lockScroll: false
			}).then(() => {
				deleteRepastUserByIds({ repastUserIds: ids }).then(res => {
					this.$message.success('移除成功！')
					this.pagination.pageNo = 1
					this.queryListFunc()
				})
			})
		},
		batchChangeDate() {
			if (!this.multipleSelection.length) {
				this.$message.warning('请选择要批量修改的项')
			} else {
				this.formData.startDate = ''
				this.dialogFormVisible = true
				this.isBatchChange = true
			}
		},
		batchUpdateRepastDate() {
			console.log('666')
			this.$confirm('确认要批量修改吗？', '批量修改', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning',
				lockScroll: false
			})
				.then(() => {
					console.log(this.multipleSelection.map(({ id }) => id).join(','))
					let ids = this.multipleSelection.map(({ id }) => id).join(',')
					batchUpdateRepastDate({ repastUserIds: ids, repastDate: this.$moment(this.formData.startDate).format('YYYY-MM-DD') }).then(res => {
						this.pagination.pageNo = 1
						this.queryListFunc()
						this.$message.success('批量修改成功！')
						this.dialogFormVisible = false
					})
				})
				.catch(() => {
					this.$message.info('已取消操作！')
				})
		},
		queryListFunc() {
			queryRepastUserByRestaurantId({
				restaurantType: this.$route.query.restaurantType,
				restaurantId: this.$route.query.id,
				searchName: this.searchName,
				pageNo: this.pagination.pageNo,
				pageSize: this.pagination.pageSize
			}).then(res => {
				this.dataList = res.data.data.dataList
				this.pagination.total = res.data.data.pagination.total
			})
		},
		goNewEatingUser() {
			this.$router.push({
				path: 'addEatingUser',
				query: {
					id: this.$route.query.id,
					restaurantType: this.$route.query.restaurantType
				}
			})
		}
	}
}
</script>
<style>
.maintainEattingUser .el-dialog {
	width: 500px !important;
}
</style>
<style lang="scss" scoped>
.maintainEattingUser {
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
