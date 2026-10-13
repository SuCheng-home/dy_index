<template>
	<div class="common_wrap">
		<div class="header">
			<el-row>
				<el-col>
					<el-date-picker v-model="dateRange" size="medium" :clearable="false" @change="queryListFunc" type="daterange" class="mywidthdaterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
					<a :href="exportUrl" target="_blank" v-if="dataList.length">
						<el-button size="medium" type="primary">导出</el-button>
					</a>
				</el-col>
			</el-row>
		</div>
		<div v-if="titleList" style="margin: 15px 0;font-weight: bold;font-size: 17px">
			<span>{{ start }}</span>
			到
			<span>{{ end }}</span>
			共计加餐
			<span style="color:#409EFF">{{ addMealCount }}</span>
			份。
		</div>
		<el-table :data="dataList" :height="maxH - 54" style="width: 100%" border>
			<el-table-column label="申请人" align="center" width="350px" show-overflow-tooltip>
				<template slot-scope="scope">
					<span>{{ scope.row.createUser }}</span>
				</template>
			</el-table-column>
			<el-table-column label="加餐时间" align="center" prop="className">
				<template slot-scope="scope">
					<span>{{ scope.row.addMealDate || '--' }}</span>
				</template>
			</el-table-column>
			<el-table-column label="加餐份数" align="center">
				<template slot-scope="scope">
					<span>{{ scope.row.addMealCount }}</span>
				</template>
			</el-table-column>
			<el-table-column width="500" label="备注" align="center" show-overflow-tooltip>
				<template slot-scope="scope">
					{{ scope.row.remark || '--' }}
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
import { reportAddAnalysis } from '@/api/mealSuspend'
export default {
	name: 'commonList',
	data() {
		return {
			start: '',
			end: '',
			addMealCount: 0,
			eatingAddressUrl: '',
			detailUrl: '',
			titleList: '',
			formData: {
				fireType: 1,
				schoolTimeId: 0,
				mealType: 0
			},
			dateRange: [],
			restaurantIds: [],
			isAdd: '',
			formLabelWidth: '120px',
			dialogFormVisible: false,
			searchName: '',
			pickOptions: {
				disabledDate(time) {
					return time.getTime() <= Date.now() - 60 * 60 * 24 * 1000
				}
			},
			pagination: {
				pageNo: 1,
				pageSize: 10,
				total: 0,
				pages: 0
			},

			eattingAddressList: [],
			termList: [],
			dataList: [
				{
					name: '名称名称名称',
					type: 1,
					className: '一（1）班',
					status: 1,
					time: '2022-01-01 12:34:56.0'
				}
			],
			typeList: { 1: '中小学' }
		}
	},
	filters: {
		timeFilter(time) {
			return time ? time.substring(0, 19) : ''
		}
	},
	watch: {
		dialogFormVisible(val) {
			if (val) {
				this.$refs.dialogForm && this.$refs.dialogForm.clearValidate()
			}
		}
	},
	created() {
		this.dateRange = [this.$moment().startOf('month'), new Date()]
		this.queryListFunc()
	},
	mixins: [windowResize, baseMixin],
	methods: {
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

		queryListFunc() {
			let startDate = this.dateRange[0] ? this.$moment(this.dateRange[0]).format('YYYY-MM-DD') : ''
			let endDate = this.dateRange[1] ? this.$moment(this.dateRange[1]).format('YYYY-MM-DD') : ''
			reportAddAnalysis({ pageSize: this.pagination.pageSize, pageNo: this.pagination.pageNo, startDate: startDate, endDate: endDate }).then(res => {
				this.dataList = res.data.data.dataList
				this.pagination.total = res.data.data.pagination.total
				this.pagination.pages = res.data.data.pagination.pages
				this.titleList = res.data.data.titleList
				this.exportUrl = global.BasePath + `structure/report/downReportAdd?endDate=${endDate}&startDate=${startDate}&pageSize=${this.pagination.pageSize}&pageNo=${this.pagination.pageNo}&token=${this.$store.getters.token}`
				this.addMealCount = 0
				this.dataList.forEach(v => {
					this.addMealCount += v.addMealCount
				})
				this.start = this.$moment(this.dateRange[0]).format('YYYY-MM-DD')
				this.end = this.$moment(this.dateRange[1]).format('YYYY-MM-DD')
			})
		}
	}
}
</script>
<style lang="scss" scoped>
.common_wrap {
	padding: 12px;

	.header {
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
