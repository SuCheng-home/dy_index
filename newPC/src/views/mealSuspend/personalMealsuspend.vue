<template>
	<div class="common_wrap">
		<div class="header">
			<el-row>
				<el-col>
					<el-button @click="$router.back()" size="medium">返回</el-button>
					&nbsp;&nbsp;{{ titleList }}
				</el-col>
			</el-row>
		</div>
		<el-table :data="dataList" :height="maxH" style="width: 100%" border>
			<el-table-column label="姓名" align="center" show-overflow-tooltip>
				<template slot-scope="scope">
					<span>{{ scope.row.userName }}</span>
				</template>
			</el-table-column>
			<el-table-column label="就餐地点" align="center" show-overflow-tooltip>
				<template slot-scope="scope">
					<span>{{ scope.row.restaurantName }}</span>
				</template>
			</el-table-column>
			<el-table-column label="停伙日期" align="center" show-overflow-tooltip>
				<template slot-scope="scope">
					<span>{{ scope.row.fireDate }}</span>
				</template>
			</el-table-column>
			<el-table-column label="停伙类型" align="center" show-overflow-tooltip>
				<template slot-scope="scope">
					<span>{{ scope.row.fireType === 1 ? '老师' : '学生' }}</span>
				</template>
			</el-table-column>
			 <el-table-column align="center" label="餐次">
                    <template slot-scope="scope">
                         <span v-if="scope.row.mealType==0">早餐</span>
                         <span v-if="scope.row.mealType==1">午餐</span>
                         <span v-if="scope.row.mealType==2">课间餐</span>
                         <span v-if="scope.row.mealType==3">晚餐</span>
                    </template>
                </el-table-column>
			<el-table-column label="备注" align="center" width="400" show-overflow-tooltip>
				<template slot-scope="scope">
					<span>{{ scope.row.remark || '--' }}</span>
				</template>
			</el-table-column>
			<el-table-column align="center" label="停伙方式" >
                     <template slot-scope="scope">
                         <el-tag  size="mini" v-if="scope.row.operateType == 1">代停伙</el-tag>
                        <el-tag  size="mini"  type="success" v-if="scope.row.operateType == 0">自己申请</el-tag>
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
import { statisticsUserFire } from '@/api/mealSuspend'
export default {
	name: 'commonList',
	data() {
		return {
			titleList: '',
			searchName: '',
			pagination: {
				pageNo: 1,
				pageSize: 10,
				total: 0,
				pages: 0
			},
			dataList: []
		}
	},

	created() {
		this.queryListFunc()
	},
	mixins: [windowResize, baseMixin],
	methods: {
		sizeChangeHandler() {
			this.pagination.pageNo = 1
			this.queryListFunc()
		},
		currentChangeHandler() {
			this.queryListFunc()
		},

		queryListFunc() {
			statisticsUserFire({ pageSize: this.pagination.pageSize, pageNo: this.pagination.pageNo, userId: this.$route.query.userId, schoolTimeId: this.$route.query.schoolTimeId, startDate: this.$route.query.startDate, endDate: this.$route.query.endDate, fireType: this.$route.query.fireType }).then(
				res => {
					this.dataList = res.data.data.dataList
					this.pagination.total = res.data.data.pagination.total
					this.pagination.pages = res.data.data.pagination.pages
					this.titleList = `从${this.$route.query.startDate}至${this.$route.query.endDate}共停伙${this.dataList.length}次，退伙明细如下:`
				}
			)
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
		.rowSpan {
			font-size: 14px;
			margin-left: 10px;
			color: #606266;
		}
	}

	.pagination-container {
		margin-top: 10px;
	}
}
</style>
