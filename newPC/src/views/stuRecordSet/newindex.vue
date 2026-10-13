<template>
	<div class="stuAskleave-list-index">
		<el-row style="padding-bottom: 10px">
			<el-col :span="24">
				<el-date-picker size="medium" type="daterange" style="width: 220px;" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd" :clearable="false" v-model="form.daterange" @change="handleDateRange"></el-date-picker>
				<el-select class="el-select-short" size="medium" placeholder="请选择" v-model="form.groupId" @change="handleUserAskleaveGroup">
					<el-option v-for="(item, idx) in userAskleaveGroupList" :key="idx" :label="item.title" :value="item.id"></el-option>
				</el-select>
				<el-select class="el-select-short" size="medium" placeholder="请选择" v-model="pagination.classId" @change="filterSearch">
					<el-option  label="全部班级" :value="0"></el-option>
					<el-option v-for="(item, idx) in checkedGroupClassList" :key="idx" :label="item.name" :value="item.id"></el-option>
				</el-select>
				<el-select class="el-select-short" v-model="pagination.leaveState" size="medium" placeholder="请选择请假状态" @change="filterSearch()">
						<el-option :key="0" label="全部状态" :value="0"></el-option>
						<el-option :key="1" label="未审批" :value="1"></el-option>
						<el-option :key="2" label="同意" :value="2"></el-option>
						<el-option :key="3" label="销假" :value="3"></el-option>
						<el-option :key="5" label="已撤回" :value="5"></el-option>
					</el-select>
				<a :href="exportUrl" target="_blank" download="examName">
					<el-button type="primary" size="medium">导出</el-button>
				</a>
				<a :href="exportUrltwo" target="_blank" download="examName">
					<el-button type="primary" size="medium">导出（症状）</el-button>
				</a>
				 <el-input class="search-input" style="width:20%;    float: right;"  placeholder="请输入学生姓名" icon="search" size="medium" @change="filterSearch()" v-model.trim="pagination.studentName">
                <el-button slot="append" icon="el-icon-search" @click="filterSearch()"></el-button>
            </el-input>    
			</el-col>
		</el-row>

		<el-table border fit stripe highlight-current-row style="width: 100%" :height="maxH" :data="tabList" v-loading.body="tabLoading">
			<el-table-column align="center" label="姓名" show-overflow-tooltip>
				<template slot-scope="scope">
					{{ scope.row.studentName || '--' }}
				</template>
			</el-table-column>
			<el-table-column align="center" label="性别" show-overflow-tooltip>
				<template slot-scope="scope">
					{{ scope.row.gender | filertGender }}
				</template>
			</el-table-column>
			<el-table-column align="center" label="班级" show-overflow-tooltip>
				<template slot-scope="scope">
					{{ scope.row.className || '--' }}
				</template>
			</el-table-column>
			<el-table-column align="center" label="类型" show-overflow-tooltip>
				<template slot-scope="scope">
					{{ scope.row.leaveTypeName || '--' }}
				</template>
			</el-table-column>
			<el-table-column v-if="isSickTypeGroup == 1" align="center" label="疾病类型" show-overflow-tooltip>
				<template slot-scope="scope">
					{{ scope.row.sickTypeName || '--' }}
				</template>
			</el-table-column>
			<el-table-column v-if="isSickType" align="center" label="疾病症状" show-overflow-tooltip>
				<template slot-scope="scope">
					{{ scope.row.symptomJson || '--' }}
				</template>
			</el-table-column>
<!--			<el-table-column align="center" label="就医情况" show-overflow-tooltip>-->
<!--				<template slot-scope="scope">-->
<!--					{{ scope.row.medicalType || '&#45;&#45;' }}-->
<!--				</template>-->
<!--			</el-table-column>-->

<!--			<el-table-column align="center" label="家长联系方式" show-overflow-tooltip>-->
<!--				<template slot-scope="scope">-->
<!--					{{ scope.row.mobile || '&#45;&#45;' }}-->
<!--				</template>-->
<!--			</el-table-column>-->
			<el-table-column align="center" label="内容" show-overflow-tooltip>
				<template slot-scope="scope">
					<span class="link-type" @click="gotoDetail(scope.row)">
						{{ scope.row.content }}
					</span>
				</template>
			</el-table-column>
			<el-table-column align="center" label="开始日期" show-overflow-tooltip>
				<template slot-scope="scope">
					{{ scope.row.startDate + getWeekDay(scope.row.startDate) || '--' }} &nbsp;
					{{ scope.row.isMorningName != '节次' ? scope.row.isMorningName : '' }}
				</template>
			</el-table-column>
			<el-table-column align="center" label="请假时长" show-overflow-tooltip>
				<template slot-scope="scope">
					<span v-if="scope.row.isClassHour == 0">{{ scope.row.leaveDateCount | filterLeaveDateCount }}天</span>
					<span v-else>{{ scope.row.classHourCount }}节</span>
				</template>
			</el-table-column>
            <el-table-column align="center" label="就诊医院" show-overflow-tooltip>
                <template slot-scope="scope">
                    {{ scope.row.hospital || '--' }}
                </template>
            </el-table-column>
			  <el-table-column align="center" label="状态" show-overflow-tooltip>
                   <template slot-scope="scope">
                      <el-tag type="danger"  size="mini" v-if="scope.row.leaveStateName=='驳回'">驳回</el-tag>
                      <el-tag type="warning" size="mini" v-if="scope.row.leaveStateName=='未审批'">未审批</el-tag>
                      <el-tag type="success" size="mini" v-if="scope.row.leaveStateName=='同意'">同意</el-tag>
                      <el-tag type="danger" size="mini" v-if="scope.row.leaveStateName=='销假'">销假</el-tag>
					  <el-tag type="danger" size="mini" v-if="scope.row.leaveStateName=='撤销'">撤销</el-tag>
                   </template>
               </el-table-column>
		</el-table>

		<el-pagination style="margin-top: 20px" layout="total, sizes, prev, pager, next, jumper" :current-page.sync="pagination.pageNo" :page-size="pagination.pageSize" :page-sizes="pagination.pageSizes" :total="pagination.total" @size-change="handleSizeChange" @current-change="handleCurrentChange"></el-pagination>
	</div>
</template>

<script>
/* utils */
import mixin from '@/mixins/windowResize'
import { isShowByPermission } from '@/utils'
import moment from 'moment'
import { mapGetters } from 'vuex'
/* components */

/* api */
import { getUserAskleaveGroupList, getStuAskleaveListByClassIds, getStuAskleaveInitInfo,getStuAskleaveGroupInfo} from '@/api/stuAskleave'

export default {
	name: 'mentalEducationPopularizationIndex',
	mixins: [mixin],
	components: {},
	filters: {
		filterLeaveDateCount(val) {
			if (String(val).indexOf('.') == -1) {
				val += '.0'
				return val
			} else return val
		},
		filertGender(val) {
			if (val !== null && val !== undefined && val !== '') {
				return ['--', '男', '女'][val]
			} else {
				return '--'
			}
		},
		filterDate(val) {
			return val ? moment(val).format('YYYY-MM-DD HH:mm:ss') : '--'
		}
	},
	watch: {},
	data() {
		return {
			schoolId: '',
			isSickTypeGroup: 0,
			isSickType: false,
			exportUrl: '',
			exportUrltwo:"",
			// 请假班级组
			userAskleaveGroupList: [],
			// 是否正在加载数据 { Boolean }
			tabLoading: false,
			// 表格数据 { Array }
			tabList: [],
			// 分页
			pagination: {
				pageNo: 1,
				pageSize: 20,
				pageSizes: [10, 20, 30, 50],
				total: 0,
				classId: 0,
				leaveState: 0,
				studentName:""
			},
			// 请求表单
			form: {
				daterange: [this.$moment().format('YYYY-MM-DD'), this.$moment().format('YYYY-MM-DD')],
				groupId: ''
			},
			checkedGroupClassList:[]
		}
	},
	computed: {
		...mapGetters(['userInfo', 'schoolInfo']),
		getWeekDay() {
			return function(val) {
				let weekDay = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
				return '(' + weekDay[new Date(val.replace(/\-/g, '/')).getDay()] + ')'
			}
		}
	},
	created() {
		this.getUserAskleaveGroupList()
	},
	methods: {
		getStuAskleaveGroupInfo(){
             getStuAskleaveGroupInfo(this.form.groupId).then(res => {
                    let data = res.data.data;
                    this.checkedGroupClassList = JSON.parse(data.classJson);
                }).catch();
		},
		isShowByPermission,
		getStuAskleaveInitInfoFunc() {
			getStuAskleaveInitInfo({
				schoolId: this.schoolInfo.id
			})
				.then(res => res.data)
				.then(data => {
					this.isSickTypeGroup = data.data.isSickTypeGroup
					this.isSickType = data.data.symptomHav == 2
				})
		},
		getUserAskleaveGroupList() {
			getUserAskleaveGroupList()
				.then(res => {
					let _res = res.data
					if (_res.code != 200) return Promise.reject(_res.msg)
					else return _res.data
				})
				.then(data => {
					if (Array.isArray(data) && data.length) this.userAskleaveGroupList = [...data]
					else this.userAskleaveGroupList = [{ id: 0, title: '全部' }]
					this.form.groupId = this.userAskleaveGroupList[0].id
					this.schoolId = this.userAskleaveGroupList[0].schoolId
					this.getStuAskleaveInitInfoFunc();
					this.getStuAskleaveListByClassIds();
					this.getStuAskleaveGroupInfo();
				})
				.catch(msg => {
					this.$message({
						message: msg,
						type: 'error'
					})
				})
		},
		// 根据开始日期结束日期及班级组查询学生请假统计列表
		getStuAskleaveListByClassIds() {
			let startDate = this.form.daterange[0] || ''
			let endDate = this.form.daterange[1] || '';
			this.exportUrltwo= `${global.BasePath}structure/stuAskleave/exportStuAskleaveListByClassIdsNew?groupId=${this.form.groupId}&startDate=${startDate}&studentName=${this.pagination.studentName}&leaveState=${this.pagination.leaveState}&classId=${this.pagination.classId}&endDate=${endDate}&token=${this.$store.getters.token}`
			this.exportUrl = `${global.BasePath}structure/stuAskleave/exportClassStuAskleaveList?groupId=${this.form.groupId}&startDate=${startDate}&studentName=${this.pagination.studentName}&leaveState=${this.pagination.leaveState}&classId=${this.pagination.classId}&endDate=${endDate}&token=${this.$store.getters.token}`
			getStuAskleaveListByClassIds({
				groupId: this.form.groupId,
				startDate:startDate,
				endDate:endDate,
				pageNo: this.pagination.pageNo,
				pageSize: this.pagination.pageSize,
				classId:this.pagination.classId,
				leaveState:this.pagination.leaveState,
				studentName:this.pagination.studentName
			})
				.then(res => {
					let _res = res.data
					if (_res.code != 200) return Promise.reject(_res.msg)
					else return _res.data
				})
				.then(data => {
					if (data) {
						let { stuAskleaveList, pagination } = data
						this.tabList = [...stuAskleaveList]
						this.pagination.total = pagination.total
					}
					
				})
				.catch(msg => {
					this.$message({
						message: msg,
						type: 'error'
					})
				})
		},

		// 检索条件 改变
		filterSearch() {
			this.pagination.pageNo = 1
			this.getStuAskleaveListByClassIds()
		},
		// 日期范围改变
		handleDateRange() {
			this.filterSearch()
		},
		// 班级组改变
		handleUserAskleaveGroup() {
			this.schoolId = this.userAskleaveGroupList.find(item => item.id == this.form.groupId).schoolId;
			this.pagination.classId=0;
			this.getStuAskleaveGroupInfo();
			this.getStuAskleaveInitInfoFunc()
			this.filterSearch()
		},
		// 分页 - pageSize 改变
		handleSizeChange(pageSize) {
			this.pagination.pageSize = pageSize
			this.getStuAskleaveListByClassIds()
		},
		// 分页 - currentPage 改变
		handleCurrentChange(pageNo) {
			this.pagination.pageNo = pageNo
			this.getStuAskleaveListByClassIds()
		},
		gotoDetail(item) {
			this.$router.push({
				path: 'newdetail',
				query: {
					askId: item.id
				}
			})
		}
	}
}
</script>
<style lang="scss" scoped>
.stuAskleave-list-index {
	padding: 12px;
      .el-select-short{
			width: 150px;
		}
	.filter-wrapper {
		margin-bottom: 10px;
	}

	.el-table__body-wrapper {
		.delete-btn {
			color: #f56c6c;
		}
	}
}
</style>
