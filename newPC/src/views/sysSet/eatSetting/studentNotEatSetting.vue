<template>
	<div class="common_wrap">
		<div class="header">
			<el-row>
				<el-col :span="19">
					<el-button size="medium" @click="$router.back()">返回</el-button>
					<el-button size="medium" type="primary" @click="$refs.addressBook.dialogTableVisible = true">增加不就餐人员</el-button>
					<el-button size="medium" type="primary" @click="batchDeleteHandler">移除</el-button>
					<a :href="exportUrl" target="_blank"><el-button size="medium" type="primary">导出</el-button></a>
				</el-col>
				<el-col :span="5">
					<el-input size="medium" placeholder="请输入姓名" v-model="searchName" @keyup.enter.native="searchList">
						<el-button slot="append" icon="el-icon-search" size="medium" @click="searchList"></el-button>
					</el-input>
				</el-col>
			</el-row>
		</div>
		<el-table :data="dataList" :height="maxH - 55" style="width: 100%" border @selection-change="handleSelectionChange">
			<el-table-column type="selection" align="center"></el-table-column>
			<el-table-column label="姓名" align="center" show-overflow-tooltip>
				<template slot-scope="scope">
					<span>{{ scope.row.userName }}</span>
				</template>
			</el-table-column>
			<el-table-column label="班级" align="center" prop="className"></el-table-column>
			<el-table-column width="140" label="操作" align="center">
				<template slot-scope="scope">
					<el-button type="text" size="small" @click="deleteHandler(scope.row.id)">移除</el-button>
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
	</div>
</template>

<script>
import windowResize from '@/mixins/windowResize'
import baseMixin from '@/mixins/baseMixin'
import AddressBook from '@/components/AddressBook/indexExpand'
import { addNoRepastUser, queryNoRepastUser, deleteRepastUserByIds } from '@/api/eatSetting'
export default {
	name: 'multiList',
	data() {
		return {
			exportUrl: '',
			addressBookShow: false,
			searchName: '',
			dataList: [],
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
	created() {
		this.queryListFunc()
	},
	mounted() {
		this.exportUrl = global.BasePath + 'structure/repastManagement/downNoRepastUser?isTeacher=0&token=' + this.$store.getters.token
	},
	mixins: [windowResize, baseMixin],
	methods: {
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
				addNoRepastUser({ departIds: departIds.join(','), userIds: userIds.join(','), isTeacher: 0 })
					.then(res => {
						this.$message.success('添加成功！')
						this.stuAddressData = []
						this.queryListFunc()
					})
					.catch(err => {
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
				this.$message.error('请选择要移除的项')
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
		queryListFunc() {
			queryNoRepastUser({
				isTeacher: 0,
				searchName: this.searchName,
				pageNo: this.pagination.pageNo,
				pageSize: this.pagination.pageSize
			}).then(data => {
				this.dataList = data.data.data.dataList
				this.pagination.total = data.data.data.pagination.total
			})
		}
	}
}
</script>
<style lang="scss" scoped>
.common_wrap {
	// padding: 12px;

	.header {
		padding-bottom: 10px;
		overflow: hidden;
	}

	.pagination-container {
		margin-top: 10px;
	}
}
</style>
