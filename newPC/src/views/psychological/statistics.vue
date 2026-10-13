<template>
	<div class="tao_statistics"  style="    padding: 12px;">
		<el-tabs v-model="activeName" type="border-card" @tab-click="SetCharts">
			<el-tab-pane label="面询统计" name="first">
				<div class="header">
					<el-row>
						<el-col :span="19">
							<el-date-picker @change="SearchStatistics" size="medium" :clearable="false" v-model="searchTime" type="daterange" class="mywidthdaterange" value-format="yyyy-MM-dd" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
							<el-select v-model="searchSure" placeholder="请选择" size="medium" @change="SearchStatistics">
								<el-option v-for="item in searchSureList" :key="item.value" :label="item.label" :value="item.value"></el-option>
							</el-select>
							<a :href="exportTableUrl" download="导出" target="_blank" v-if="tableData.length">
								<el-button type="primary" size="medium">导出</el-button>
							</a>
						</el-col>
						<el-col :span="5">
							<el-input size="medium" v-model.trim="searchName" placeholder="请输入学生/老师姓名" class="search-input" @keyup.enter.native="SearchStatistics">
								<el-button size="medium" slot="append" icon="el-icon-search" @click="SearchStatistics"></el-button>
							</el-input>
						</el-col>
					</el-row>
				</div>
				<el-table :data="tableData" border :height="`${boxH - 310}px`" :stripe="true" style="width: 100%">
					<!-- <el-table-column
                      prop="authCode"
                      label="验证码"
                      align="center">
                    </el-table-column> -->
					<el-table-column prop="stuName" label="学生姓名" align="center"></el-table-column>
					<el-table-column prop="className" label="班级" align="center"></el-table-column>
					<el-table-column prop="stuSex" label="性别" align="center"></el-table-column>
					<el-table-column prop="stuAge" label="年龄" align="center"></el-table-column>
					<el-table-column prop="renderCreateDate" label="面询时间" align="center"></el-table-column>
					<el-table-column prop="meetTeacherName" label="面询老师" width="240" align="center"></el-table-column>
					<el-table-column prop="renderState" label="面询状态" align="center">
						<template slot-scope="scope">
							<el-tag  size="mini" v-if="scope.row.state == 3" >结案</el-tag>
							<el-tag  size="mini" v-if="scope.row.state == 4"  type="warning">流失</el-tag>
							<el-tag  size="mini" v-if="scope.row.state == 5" >转介</el-tag>
						</template>
					</el-table-column>
					<el-table-column label="操作" align="center">
						<template slot-scope="scope">
							<el-button type="text" size="small" @click="LinkToDetail(scope.row)">详情</el-button>
							<el-button type="text" size="small" v-if="scope.row.appraiseJson || isOverTime(scope.row)" @click="EvaluateDetail(scope.row)">查看评价</el-button>
						</template>
					</el-table-column>
				</el-table>
				<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.pageNo" :page-sizes="[10, 20, 30, 50]" :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total" class="list-pagination"></el-pagination>
			</el-tab-pane>
			<el-tab-pane label="工作量统计" name="second">
				<div class="header">
					<el-row>
						<el-col :span="19">
							<el-date-picker v-model="workLoadData.searchTime" size="medium" :clearable="false" @change="SearchWorkLoad" type="daterange" class="mywidthdaterange" value-format="yyyy-MM-dd" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
							<a :href="workLoadData.exportTableUrl" download="导出" target="_blank" v-if="workLoadData.tableData.length">
								<el-button type="primary" size="medium">导出</el-button>
							</a>
						</el-col>
						<!-- <el-col :span="5">
                            <el-input size="medium" v-model.trim="searchName2" placeholder="请输入学生/老师姓名" class="search-input" @keyup.enter.native="SearchWorkLoad">
                                <el-button size="medium" slot="append" icon="el-icon-search" @click="SearchWorkLoad"></el-button>
                            </el-input>
                        </el-col> -->
					</el-row>
				</div>
				<el-table :data="workLoadData.tableData" border :height="`${boxH - 270}px`" :stripe="true" style="width: 100%">
					<el-table-column prop="meetTeacherName" label="面询老师" align="center"></el-table-column>
					<el-table-column prop="finishCount" label="面询结案数" align="center"></el-table-column>
					<!-- <el-table-column
                      prop="continueCount"
                      label="面询续约数"
                      align="center">
                    </el-table-column> -->
					<el-table-column prop="referralCount" label="面询转介数" align="center"></el-table-column>
					<el-table-column prop="loseCount" label="面询流失数" align="center"></el-table-column>
				</el-table>
			</el-tab-pane>
			<el-tab-pane label="问题统计" name="third">
				<div class="header">
					<el-date-picker v-model="questionData.searchTime" size="medium" :clearable="false" type="daterange" class="mywidthdaterange" value-format="yyyy-MM-dd" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
					<div class="header_text">年龄：</div>
					<el-input v-model="questionData.searchStartAge" size="medium" placeholder="请输入年龄" class="age_num_box"></el-input>
					<div class="header_text">-</div>
					<el-input v-model="questionData.searchEndAge" size="medium" placeholder="请输入年龄" class="age_num_box"></el-input>
					<div class="header_text">岁</div>
					<el-button type="primary" size="medium" @click="SearchQuestion">搜索</el-button>
					<a :href="questionData.exportTableUrl" download="导出" target="_blank">
						<el-button type="primary" size="medium">导出</el-button>
					</a>
				</div>
				<div class="statisticsTabCon" :style="`height: ${boxH - 280}px`">
					<div class="chart_container" id="repairLineChart" style="height: 500px;margin-top: 10px;"></div>
				</div>
			</el-tab-pane>
		</el-tabs>
		<el-dialog title="查看评价" :visible.sync="evaluateIsShow">
			<div v-for="(item, index) in evaluateData" :key="index + 'evalueate'">
				<div class="evaluateDetail">{{ index + 1 }}.{{ item.value }}</div>
				<div class="evaluateDetail">
					<span v-if="item.remark == 2">{{ item.answer }}</span>
					<span v-if="item.remark == 1">{{ item.answer }}分</span>
					<span v-if="item.remark == 3">{{ item.answer == 1 ? '满意' : item.answer == 2 ? '一般' : '不满意' }}</span>
				</div>
			</div>
		</el-dialog>
		<el-dialog title="查看评价" :visible.sync="goodEvaluateIsShow">
			<div v-for="(item, index) in list" :key="index + 'evalueate'">
				<div class="evaluateDetail">{{ index + 1 }}.{{ item.value }}</div>
				<div class="evaluateDetail">
					<span v-if="item.remark == 2">无</span>
					<span v-if="item.remark == 1">10分</span>
					<span v-if="item.remark == 3">满意</span>
				</div>
			</div>
		</el-dialog>
	</div>
</template>

<script>
import { queryStatisticsList, queryWorkLoadList, queryQuestionData } from '@/api/psychological'
import { findSchoolDicsByCodeStructure } from '@/api/common/common'
import echarts from 'echarts'
import baseMixin from '@/mixins/baseMixin'
import windowResizeMixin from '@/mixins/windowResize'
const _ = require('lodash')
export default {
	mixins: [windowResizeMixin, baseMixin],
	data() {
		return {
			goodEvaluateIsShow: false,
			activeName: 'first',
			searchTime: [], //搜索条件-日期
			searchSure: 0, //搜索条件-是否面询
			list: '',
			searchSureList: [
				{
					value: 0,
					label: '全部面询状态'
				},
				{
					value: 3,
					label: '结案'
				},
				{
					value: 4,
					label: '流失'
				},
				{
					value: 5,
					label: '转介'
				}
			], //搜索条件-面询状态数据源
			searchName: '', //搜索条件-老师姓名
			searchName2: '', //工作量搜索姓名
			listQuery: {
				pageNo: 1, //当前页数
				pageSize: 20 //每页条数
			}, //分页相关
			exportTableUrl: '', //导出地址
			total: null, //数据总条数
			tableData: [], //表格数据源
			evaluateIsShow: false, //是否显示评价
			evaluateData: [], //评价数据源
			workLoadData: {
				searchTime: [], //搜索条件-日期
				searchName: '', //搜索条件-姓名
				tableData: [], //表格数据源
				exportTableUrl: '' //导出地址
				// pageNo: 1,//当前页数
				// pageSize: 20,//每页条数
				// total:null,//总条数
			},
			questionData: {
				searchTime: [], //搜索条件-日期
				searchStartAge: 3, //搜索条件-起始年龄
				searchEndAge: 18, //搜索条件-终止年龄
				tableData: [], //表格数据源
				exportTableUrl: '' //导出地址
				// pageNo: 1,//当前页数
				// pageSize: 20,//每页条数
				// total:null,//总条数
			},
			repairLineChart: null
		}
	},
	computed: {
		isOverTime() {
			return function(data) {
				if ((data.state === 3 || data.state === 5) && data.operationList.length) {
					let date = data.operationList[data.operationList.length - 1].createDate.slice(0, -2)
					console.log(date, '111')
					return new Date().getTime() - new Date(date.replace(/-/g, '/')).getTime() > 1000 * 60 * 60 * 24
				} else {
					return false
				}
			}
		}
	},
	created() {
		this.SetDate()
		this.GetEvaluateList()
	},
	methods: {
		//获取评价代码项
		GetEvaluateList() {
			findSchoolDicsByCodeStructure({ dicCode: 'psychologicalAppraise' })
				.then(res => res.data)
				.then(data => {
					if (data.result) {
						this.list = data.data.map(v =>
							Object.assign({}, v, {
								answer: ''
							})
						)
					}
				})
		},
		//设置默认日期
		SetDate() {
			let nowDate = new Date()
			let firstDay = new Date(nowDate.getFullYear(), nowDate.getMonth(), 1)
			let lastDay = new Date(nowDate.getFullYear(), nowDate.getMonth() + 1, 0)
			let tempFirstDayDay = firstDay.getDate() < 10 ? '0' + firstDay.getDate() : firstDay.getDate()
			let tempLastDayDay = nowDate.getDate() < 10 ? '0' + nowDate.getDate() : nowDate.getDate()
			this.searchTime[0] = nowDate.getFullYear() + '-' + (nowDate.getMonth() + 1) + '-' + tempFirstDayDay
			this.searchTime[1] = nowDate.getFullYear() + '-' + (nowDate.getMonth() + 1) + '-' + tempLastDayDay
			this.workLoadData.searchTime[0] = nowDate.getFullYear() + '-' + (nowDate.getMonth() + 1) + '-' + tempFirstDayDay
			this.workLoadData.searchTime[1] = nowDate.getFullYear() + '-' + (nowDate.getMonth() + 1) + '-' + tempLastDayDay
			this.questionData.searchTime[0] = nowDate.getFullYear() + '-' + (nowDate.getMonth() + 1) + '-' + tempFirstDayDay
			this.questionData.searchTime[1] = nowDate.getFullYear() + '-' + (nowDate.getMonth() + 1) + '-' + tempLastDayDay
			this.GetStatisticsList()
			this.GetWorkLoadList()
		},
		//获取面询统计列表
		GetStatisticsList() {
			let startDate = this.searchTime && this.searchTime.length > 0 ? this.searchTime[0] : '2000-01-01'
			let endDate = this.searchTime && this.searchTime.length > 0 ? this.searchTime[1] : '2050-01-01'
			this.exportTableUrl = `${global.BasePath}structure/psychological/downSubscribeAnalysis?startDate=${startDate}&endDate=${endDate}&searchName=${this.searchName}&state=${this.searchSure}&token=${this.$store.getters.token}`
			queryStatisticsList(this.listQuery.pageNo, this.listQuery.pageSize, this.searchTime, this.searchSure, this.searchName)
				.then(res => res.data)
				.then(data => {
					this.tableData = data.data.dataList.map(v =>
						Object.assign({}, v, {
							renderCreateDate: v.meetDate + ' ' + v.meetDateRange
							// renderState:_.find(this.searchSureList,function(o){ return o.value == v.state }).label
						})
					)
					this.total = data.data.pagination.total
				})
		},
		//跳转详情
		LinkToDetail(e) {
			this.$router.push({
				path: 'orderDetail',
				query: { id: e.id }
			})
		},
		//搜索面询统计
		SearchStatistics() {
			this.listQuery.pageNo = 1
			this.GetStatisticsList()
		},
		//每页条数更改
		handleSizeChange(val) {
			this.listQuery.pageSize = val
			this.GetStatisticsList()
		},
		//当前页码更改
		handleCurrentChange(val) {
			this.listQuery.pageNo = val
			this.GetStatisticsList()
		},
		//查看评价
		EvaluateDetail(e) {
			if (e.appraiseJson&&JSON.parse(e.appraiseJson).length) {
				this.evaluateData = JSON.parse(e.appraiseJson)
				this.evaluateIsShow = true
			} else {
				this.goodEvaluateIsShow = true
			}
		},
		//获取工作量列表
		GetWorkLoadList() {
			let startDate = this.workLoadData.searchTime && this.workLoadData.searchTime.length > 0 ? this.workLoadData.searchTime[0] : '2000-01-01'
			let endDate = this.workLoadData.searchTime && this.workLoadData.searchTime.length > 0 ? this.workLoadData.searchTime[1] : '2050-01-01'
			this.workLoadData.exportTableUrl = `${global.BasePath}structure/psychological/downTeacherWorkAnalysis?startDate=${startDate}&endDate=${endDate}&token=${this.$store.getters.token}`
			queryWorkLoadList(this.workLoadData.searchTime)
				.then(res => res.data)
				.then(data => {
					this.workLoadData.tableData = data.data.map(v =>
						Object.assign({}, v, {
							// renderOrderTime:this.SetRenderOrderTime(v.saturdayOrder,v.sundayOrder),
							// renderState:_.find(this.searchSureList,function(o){ return o.value == v.state }).label
						})
					)
					// this.total=data.data.pagination.total;
				})
		},
		//搜索工作量
		SearchWorkLoad() {
			this.GetWorkLoadList()
		},
		//获取问题统计
		GetQuestionData() {
			let startDate = this.questionData.searchTime && this.questionData.searchTime.length > 0 ? this.questionData.searchTime[0] : '2000-01-01'
			let endDate = this.questionData.searchTime && this.questionData.searchTime.length > 0 ? this.questionData.searchTime[1] : '2050-01-01'
			this.questionData.exportTableUrl = `${global.BasePath}structure/psychological/downIllnessAnalysis?startDate=${startDate}&endDate=${endDate}&startAge=${this.questionData.searchStartAge}&endAge=${this.questionData.searchEndAge}&token=${this.$store.getters.token}`
			queryQuestionData(this.questionData.searchTime, this.questionData.searchStartAge, this.questionData.searchEndAge)
				.then(res => res.data)
				.then(data => {
					let xAxis = []
					let series = []
					data.data.map(v => {
						xAxis.push(v.illnessType)
						series.push(v.count)
					})
					this.repairLineChart = echarts.init(document.getElementById('repairLineChart'))
					this.drawRepairLineChart(xAxis, series)
				})
		},
		//绘制柱状图
		drawRepairLineChart(e, v) {
			let chartOption = {
				xAxis: {
					type: 'category',
					data: e
				},
				yAxis: {
					type: 'value'
				},
				series: [
					{
						data: v,
						type: 'bar',
						itemStyle: {
							barBorderColor: '#409EFF',
							color: '#409EFF'
						},
						label: {
							show: true,
							position: 'top'
						},
						barMaxWidth: 30
					}
				]
			}
			this.repairLineChart.setOption(chartOption)
		},
		//点击标签栏
		SetCharts(e) {
			if (e.name == 'third' && !this.repairLineChart) {
				this.GetQuestionData()
			}
		},
		//搜索问题
		SearchQuestion() {
			this.GetQuestionData()
		}
	}
}
</script>

<style scoped>
.tao_statistics .header {
	 padding-bottom: 10px;
}
.header_text {
	display: inline-flex;
	margin: 5px;
}
.age_num_box {
	display: inline-flex;
	width: 140px;
}
.list-pagination {
	margin-top: 10px;
}
.evaluateDetail {
	margin-bottom: 10px;
}
.statisticsTabCon {
	min-height: 600px;
}
</style>
