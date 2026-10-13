<template>
	<div class="common_wrap">
		<div class="header">
			<el-row>
				<el-col :span="19">
					<div style="width:50px;height:10px" v-if="!isManager"></div>
					<el-button size="medium" type="primary" v-if="isManager" @click="toAddPage">新增</el-button>
					<el-button size="medium" type="danger" v-if="isManager" @click="batchDeleteHandler">删除</el-button>
				</el-col>
				<el-col :span="5">
					<el-input size="medium" placeholder="请输入批次名称" v-model="searchName" @keyup.enter.native="searchList">
						<el-button slot="append" icon="el-icon-search" size="medium" @click="searchList"></el-button>
					</el-input>
				</el-col>
			</el-row>
		</div>
		<el-table :data="dataList" :height="maxH" style="width: 100%" border @selection-change="handleSelectionChange">
			<el-table-column type="selection" align="center" width="55" :selectable="canSelect"></el-table-column>
			<el-table-column label="批次名称" align="center" show-overflow-tooltip>
				<template slot-scope="scope">
					<span class="link" @click="toInfoPage(scope.row.id)">{{ scope.row.name }}</span>
				</template>
			</el-table-column>
			<el-table-column label="创建人" align="center" prop="createUserName"></el-table-column>
			<el-table-column label="创建时间" align="center">
				<template slot-scope="scope">
					<span>{{ scope.row.createTime }}</span>
				</template>
			</el-table-column>
			<el-table-column label="师徒人数" align="center">
				<template slot-scope="scope">
					<span>{{ scope.row.masterPrenticeList.length }}对</span>
				</template>
			</el-table-column>
			<el-table-column label="状态" align="center">
				<template slot-scope="scope">
					<span>
						<el-tag  size="mini" type="info" v-if="scope.row.batchState === 1" >草稿</el-tag>
						<el-tag  size="mini" type="primary" v-else-if="scope.row.batchState === 2" >培养计划</el-tag>
						<el-tag  size="mini" type="primary" v-else-if="scope.row.batchState === 3" >帮扶记录</el-tag>
						<el-tag  size="mini" type="primary" v-else-if="scope.row.batchState === 4" >学习总结</el-tag>
					</span>
				</template>
			</el-table-column>
			<el-table-column width="140" label="操作" align="center">
				<template slot-scope="scope">
					<el-button type="text" size="small" @click="toEditPage(scope.row.id, scope.row.batchState)" v-if="isManager">编辑</el-button>
					<el-button v-if="scope.row.batchState === 1 && isManager" type="text" size="small" @click="deleteHandler(scope.row.id)" style="color: red" class="buttontextred">删除</el-button>
					<el-button type="text" size="small" v-if="!isManager">--</el-button>
				</template>
			</el-table-column>
		</el-table>
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
import { managerBatchList, batchDeleteBatchByIds, possessRole } from '@/api/qlthSetting'
export default {
	name: 'multiList',
	data() {
		return {
			uploadPath: '',
			uploadData: '',
			searchName: '',
			dataList: [],
			typeList: { 1: '中小学' },
			multipleSelection: [],
			isManager: true
		}
	},
	filters: {
		timeFilter(time) {
			return time ? time.substring(0, 19) : ''
		}
	},
	activated() {
		this.queryListFunc()
	},
	created() {
		this.uploadPath = global.BasePath + 'structure/repastManagement/uploadRepastUser'
		this.uploadData = {
			token: this.$store.getters.token
		}
		this.queryListFunc()
		this.possessRole()
	},
	name: 'batchManage',
	mixins: [windowResize, baseMixin],
	methods: {
		possessRole() {
			possessRole(this.$store.getters.userInfo.id).then(res => {
				this.isManager = res.data.data.result
			})
		},
		canSelect(row, index) {
			if (row.batchState === 1) {
				return true
			}
		},
		toAddPage() {
			this.$router.push('batchAdd')
		},
		toInfoPage(id) {
			this.$router.push({ path: 'batchDetail', query: { id: id } })
		},
		toEditPage(id, batchState) {
			this.$router.push({ path: 'batchAdd', query: { id: id, batchState: batchState } })
		},
		handleSelectionChange(val) {
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
				this.$message.error('请选择要删除的批次！')
			} else {
				this.deleteHandler(this.multipleSelection.map(({ id }) => id).join(','))
			}
		},
		deleteHandler(ids) {
			this.$confirm('确认要删除选中的批次吗？', '删除', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning',
				lockScroll: false
			}).then(() => {
				batchDeleteBatchByIds({
					idStr: ids
				}).then(() => {
					this.$message.success('删除成功！')
					this.queryListFunc()
				})
			})
		},
		queryListFunc() {
			managerBatchList({
				searchName: this.searchName,
				pageNo: this.pagination.pageNo,
				pageSize: this.pagination.pageSize
			}).then(res => {
				this.dataList = res.data.data.dataList
				this.pagination.total = res.data.data.pagination.total
			})
		}
	}
}
</script>
<style lang="scss" scoped>
.common_wrap {
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
