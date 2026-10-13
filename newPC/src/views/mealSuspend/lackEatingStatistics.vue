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
			共计缺餐
			<span style="color:#409EFF">{{ missMealCount }}</span>
			份，缺水果
			<span style="color:#409EFF">{{ missFruitCount }}</span>
			份，水果不达标
			<span style="color:#409EFF">{{ badFruitCount }}</span>
			份。
		</div>
		<el-table :data="dataList" :height="maxH - 44" style="width: 100%" border>
			<el-table-column label="班级" align="center" show-overflow-tooltip>
				<template slot-scope="scope">
					<span>{{ scope.row.className }}</span>
				</template>
			</el-table-column>
			<el-table-column label="上报人" align="center" prop="className">
				<template slot-scope="scope">
					<span>{{ scope.row.createUser }}</span>
				</template>
			</el-table-column>
			<el-table-column label="缺餐" align="center">
				<template slot-scope="scope">
					<span>{{ scope.row.missMealCount }}</span>
				</template>
			</el-table-column>
			<el-table-column label="缺水果" align="center">
				<template slot-scope="scope">
					<span>{{ scope.row.missFruitCount }}</span>
				</template>
			</el-table-column>
			<el-table-column label="水果不达标" align="center">
				<template slot-scope="scope">
					<span>{{ scope.row.badFruitCount }}</span>
				</template>
			</el-table-column>
			<el-table-column label="上报时间" align="center">
				<template slot-scope="scope">
					<span>{{ scope.row.createDate.slice(0, -2) }}</span>
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
import { reportMissAnalysis } from '@/api/mealSuspend'
export default {
	name: 'commonList',
	data() {
		return {
			exportUrl: '',
			titleList: '',
			dateRange: [],
			pagination: {
				pageNo: 1,
				pageSize: 10,
				total: 0,
				pages: 0
			},
			dataList: [],
			missMealCount: 0,
			missFruitCount: 0,
			badFruitCount: 0,
			start: '',
			end: ''
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
			reportMissAnalysis({ pageSize: this.pagination.pageSize, pageNo: this.pagination.pageNo, startDate: startDate, endDate: endDate }).then(res => {
				this.dataList = res.data.data.dataList
				this.pagination.total = res.data.data.pagination.total
				this.pagination.pages = res.data.data.pagination.pages
				this.titleList = res.data.data.titleList
				this.exportUrl = global.BasePath + `structure/report/downReportMiss?endDate=${endDate}&startDate=${startDate}&pageSize=${this.pagination.pageSize}&pageNo=${this.pagination.pageNo}&token=${this.$store.getters.token}`

				this.missMealCount = 0
				this.missFruitCount = 0
				this.badFruitCount = 0
				this.dataList.forEach(v => {
					this.missMealCount += v.missMealCount
					this.missFruitCount += v.missFruitCount
					this.badFruitCount += v.badFruitCount
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
