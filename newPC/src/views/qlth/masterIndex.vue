<template>
	<div class="common_wrap">
		<div class="header">
			<el-row>
				<el-col :span="19">
					&nbsp;
				</el-col>
				<el-col :span="5">
					<el-input size="medium" placeholder="请输入批次名称" v-model="searchName" @keyup.enter.native="searchList">
						<el-button slot="append" icon="el-icon-search" size="medium" @click="searchList"></el-button>
					</el-input>
				</el-col>
			</el-row>
		</div>
		<el-table :data="dataList" :height="maxH" style="width: 100%" border>
			<el-table-column label="批次名称" align="center" width="350px" show-overflow-tooltip>
				<template slot-scope="scope">
					<span class="link" @click="toInfoPage(scope.row)">{{ scope.row.name }}</span>
				</template>
			</el-table-column>
			<el-table-column label="创建人" align="center" prop="createUserName"></el-table-column>
			<el-table-column label="创建时间" align="center">
				<template slot-scope="scope">
					<span>{{ scope.row.createTime || '--' }}</span>
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
import { masterBatchList } from '@/api/qlthSetting'

export default {
	name: 'commonList',
	data() {
		return {
			searchName: '',
			dataList: [],
			pagination: {
				pageSize: 10,
				pageNo: 1,
				total: 0
			}
		}
	},

	created() {
		this.masterBatchList()
	},
	mixins: [windowResize, baseMixin],
	methods: {
		masterBatchList() {
			masterBatchList({
				pageNo: this.pagination.pageNo,
				pageSize: this.pagination.pageSize,
				searchName: this.searchName
			}).then(res => {
				this.dataList = res.data.data.dataList
				this.pagination.total = res.data.data.pagination.total
			})
		},
		toInfoPage(data) {
			this.$router.push({ path: 'masterDetail', query: { id: data.id, planState: data.planState, recordState: data.recordState } })
		},

		searchList() {
			this.pagination.pageNo = 1
			this.masterBatchList()
		},
		sizeChangeHandler() {
			this.pagination.pageNo = 1
			this.masterBatchList()
		},
		currentChangeHandler() {
			this.masterBatchList()
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
