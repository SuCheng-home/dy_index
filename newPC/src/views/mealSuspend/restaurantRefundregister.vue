<template>
	<div class="restaurantRefundregister">
		<el-tabs type="border-card" v-model="activeName" @tab-click="tabsfun()">
			<el-tab-pane label="登记统计" name="one">
				<div class="top">
					<el-col :span="24">
						<!-- <el-button size="medium" @click="$router.back()">返回</el-button> -->
						<el-select v-model="query.schoolTimeId" placeholder="请选择" @change="queryListFunc" size="medium" style="width:200px">
							<el-option :label="item.schoolTimeName" :value="item.id" v-for="item in termList" :key="item.id"></el-option>
						</el-select>
						<el-select size="medium" class="filter-item" v-model="query.repastType" placeholder="请选择类型" @change="handleInputChange()">
							<el-option v-for="item in repastTypelist" :key="item.id" :label="item.name" :value="item.id"></el-option>
						</el-select>
						<el-select size="medium" class="filter-item" v-model="query.departId" placeholder="请选择部门" @change="handleInputChange()">
							<el-option v-for="item in departIdlist" :key="item.id" :label="item.name" :value="item.id"></el-option>
						</el-select>

						<el-date-picker v-model="daterange" type="daterange" class="mywidthdaterange right-line" style="width:220px" size="medium" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" :clearable="false" @change="findDate()"></el-date-picker>
						<a :href="downLoadHref" target="_blank" download="examName" v-if="dateList.length"><el-button size="medium" type="primary">导出</el-button></a>
						<el-button size="medium" type="primary" @click="restaurantRefundcharget()">收费</el-button>
						<el-input class="search-input search-input--right" size="medium" style="width:20%" placeholder="请输入姓名" icon="el-icon-search" @change="handleInputChange" v-model.trim="query.searchName">
							<el-button slot="append" size="medium" icon="el-icon-search" @click="handleInputChange"></el-button>
						</el-input>
					</el-col>
				</div>
				<div class="time-table">
					<el-table stripe :data="dateList" border fit highlight-current-row style="width: 100%" :height="maxH - 70">
						<el-table-column prop="userName" label="姓名" align="center" width="80" show-overflow-tooltip></el-table-column>
						<el-table-column prop="className" label="部门" align="center" width="100" show-overflow-tooltip></el-table-column>
						<el-table-column prop="totalCount" label="供餐天数" align="center" width="80" show-overflow-tooltip></el-table-column>
						<el-table-column prop="repastMilkCount" label="牛奶登记" align="center" width="80" show-overflow-tooltip></el-table-column>
						<el-table-column align="center" label="早餐">
							<el-table-column prop="breakfastFireCount" align="center" label="停伙" min-width="50px"></el-table-column>
							<el-table-column prop="breakfastCount" align="center" label="实就餐" min-width="50px"></el-table-column>
							<el-table-column prop="repastBreakfastCount" align="center" label="登记" min-width="50px"></el-table-column>
							<el-table-column prop="breakfastTotalPrice" align="center" label="费用" min-width="50px"></el-table-column>
						</el-table-column>
						<el-table-column align="center" label="午餐">
							<el-table-column prop="lunchFireCount" align="center" label="停伙" min-width="50px"></el-table-column>
							<el-table-column prop="lunchCount" align="center" label="实就餐" min-width="50px"></el-table-column>
							<el-table-column prop="repastLunchCount" align="center" label="登记" min-width="50px"></el-table-column>
							<el-table-column prop="lunchTotalPrice" align="center" label="费用" min-width="50px"></el-table-column>
						</el-table-column>
						<el-table-column align="center" label="晚餐">
							<el-table-column prop="supperFireCount" align="center" label="停伙" min-width="50px"></el-table-column>
							<el-table-column prop="supperCount" align="center" label="实就餐" min-width="50px"></el-table-column>
							<el-table-column prop="repastSupperCount" align="center" label="登记" min-width="50px"></el-table-column>
							<el-table-column prop="supperTotalPrice" align="center" label="费用" min-width="50px"></el-table-column>
						</el-table-column>
						<el-table-column prop="repastFireCount" align="center" label="停伙就餐" width="80" show-overflow-tooltip></el-table-column>
						<el-table-column prop="totalPrice" align="center" label="总费用" width="70" show-overflow-tooltip></el-table-column>
					</el-table>
				</div>
				<div class="pagination-container">
					<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="query.pageNo" :page-sizes="[10, 20, 30, 50]" :page-size="query.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
				</div>
			</el-tab-pane>
			<el-tab-pane label="停伙就餐统计" name="two"></el-tab-pane>
		</el-tabs>
	</div>
</template>
<script>
import moment from 'moment'
import { queryRepastUserFireAnalysis, queryDepartByType } from '@/api/restaurantRefund'
import { getSchoolTimeAllList } from '@/api/mealSuspend'

import _ from 'lodash'
import mixin from '@/mixins/windowResize'
export default {
	name: 'restaurantRefundindex',
	data: function() {
		return {
			daterange: [new Date(), new Date()],
			dateList: [], //表格主题数据
			repastTypelist: [
				{ id: 2, name: '全部就餐状态' },
				{ id: 0, name: '不就餐' },
				{ id: 1, name: '就餐' }
			],
			departIdlist: [{ id: 0, name: '全部部门' }],
			total: null,
			termList: [],
			query: {
				pageNo: 1, //页数
				pageSize: 20, //条数
				searchName: '',
				schoolTimeId: '',
				startDate: '',
				endDate: '',
				departId: 0, //	部门id，0代表全部	number
				repastType: 2 //	就餐类型，1就餐，0不就餐，0全部	number
			},
			downLoadHref: '',
			activeName: 'one'
		}
	},
	mixins: [mixin],
	//获取渲染数据当数据加载完成后执行(生命周期中的钩子函数)
	created() {
		this.daterange[0] = new Date(
			this.$moment()
				.set('date', 1)
				.valueOf()
		)
		this.query.startDate = this.$moment(this.daterange[0]).format('YYYY-MM-DD') //时间
		this.query.endDate = this.$moment(this.daterange[1]).format('YYYY-MM-DD')
		this.getSchoolTimeAllList()
		queryDepartByType().then(res => {
			let data = res.data.data
			for (let i = 0; i < data.length; i++) {
				this.departIdlist.push(data[i])
			}
		})
	},
	methods: {
		getSchoolTimeAllList() {
			getSchoolTimeAllList().then(res => {
				this.termList = res.data.data
				this.query.schoolTimeId = res.data.data.find(v => v.isCurrent).id
				this.queryRepastUserFireAnalysiss()
			})
		},
		//时间
		findDate() {
			this.query.startDate = this.$moment(this.daterange[0]).format('YYYY-MM-DD') //时间
			this.query.endDate = this.$moment(this.daterange[1]).format('YYYY-MM-DD') //时间
			this.query.pageNo = 1
			this.queryRepastUserFireAnalysiss()
		},
		//搜索
		handleInputChange() {
			this.query.pageNo = 1
			this.queryRepastUserFireAnalysiss()
		},
		//获取列表
		queryRepastUserFireAnalysiss() {
			this.dateList = []
			this.downLoadHref =
				global.BasePath +
				'structure/repastManagement/downRepastUserFireAnalysis?departId=' +
				this.query.departId +
				'&endDate=' +
				this.query.endDate +
				'&repastType=' +
				this.query.repastType +
				'&searchName=' +
				this.query.searchName +
				'&startDate=' +
				this.query.startDate +
				'&schoolTimeId=' +
				this.query.schoolTimeId +
				'&token=' +
				this.$store.getters.token
			queryRepastUserFireAnalysis(this.query).then(res => {
				let data = res.data.data
				this.dateList = data.dataList
				this.total = data.pagination.total
			})
		},
		//切换页码
		handleSizeChange(val) {
			this.query.pageNo = 1
			this.query.pageSize = val
			this.queryRepastUserFireAnalysiss()
		},
		handleCurrentChange(val) {
			this.queryRepastUserFireAnalysiss()
		},
		//就餐停伙
		tabsfun() {
			if (this.activeName == 'two') {
				this.$router.push({
					path: 'restaurantRefundEat'
				})
			}
		},
		//收费
		restaurantRefundcharget() {
			this.$router.push({
				path: 'restaurantRefundcharget',
				query: {
					searchName: this.query.searchName,
					startDate: this.query.startDate,
					endDate: this.query.endDate,
					departId: this.query.departId, //	部门id，0代表全部	number
					repastType: this.query.repastType //	就餐类型，1就餐，0不就餐，0全部	number
				}
			})
		}
	}
}
</script>
<style scoped="scoped">
.restaurantRefundregister {
	padding: 12px;
}
.el-select {
	width: 100px;
}
.top {
	padding-bottom: 10px;
	overflow: hidden;
}
.top-top {
	margin-bottom: 10px;
	overflow: hidden;
}
.button {
	box-sizing: border-box;
	width: 50%;
	text-align: center;
	float: left;
	height: 36px;
	line-height: 36px;
	border: 1px solid #dcdfe6;
	color: #606266;
	cursor: pointer;
}
.button-box {
	border-radius: 5px;
	overflow: hidden;
}
.color {
	color: #fff;
	background: #409eff;
	border: 1px #409eff solid;
}
</style>
