<template>
	<div class="leaveContent">
		<div class="header">
			<el-row>
				<el-col :span="19">
                    <el-button type="default" size="medium" @click="$router.back()" v-if="isShowBack">返回</el-button>
                    <el-date-picker
                        format="yyyy-MM-dd"
                        value-format="yyyy-MM-dd"
                        v-model="daterange" type="daterange" class="right-line mywidthdaterange" size="medium"  range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" :clearable="false" @change="findDate()"></el-date-picker>
                    <el-select size="medium" v-model="leaveType" placeholder="请选择请假类型"  style="width: 120px;" @change="handleCurrentChange(1)">
                        <el-option label="全部请假类型" :value="-1">
                        </el-option>
                        <el-option v-for="item in leaveTypeList" :label="item.leaveTypeName" :value="item.leaveTypeId">
                        </el-option>
                    </el-select>
                    <el-select size="medium" v-model="leaveState" placeholder="请选择状态"  style="width: 120px;" @change="handleCurrentChange(1)">
                        <el-option label="未审批" :value="1"></el-option>
                        <el-option label="已审批" :value="2"></el-option>
                        <el-option label="销假" :value="4"></el-option>
                    </el-select>
					 <el-select v-model="listQuery.departId" placeholder="请选择部门" size="medium" style="width: 120px;"  @change="handleCurrentChange(1)">
                        <el-option label="全部部门" :value="0"></el-option>
                        <el-option v-for="item in departList" :key="item.departId" :label="item.departName"
                                   :value="item.departId"></el-option>
                    </el-select>
					<el-button size="medium" v-if="isShowByPermission('/teacherAskleave/addEleeacherAskleave')" class="filter-item" type="primary" @click="daiLeaveAdd()">代请假</el-button>
                    <a class="export-btn" :href="exportUrl" download="导出结果" target="_blank" v-if="dataList.length">
						<el-button size="medium" class="filter-item" type="primary" icon="upload">导出</el-button>
					</a>
				</el-col>
                <el-col :span="5">
                    <el-input placeholder="请输入姓名" icon="el-icon-search" size="medium" class="search-input"
                              v-model.trim="teacherName" @keyup.enter.native="handleFilter">
                        <el-button slot="append" icon="el-icon-search" @click="handleFilter"></el-button>
                    </el-input>
                </el-col>

			</el-row>
		</div>
		<div class="leaveList">
			<el-table stripe :data="dataList" border fit highlight-current-row style="width: 100%" :height="maxH">
				<el-table-column align="center" label="姓名" show-overflow-tooltip>
					<template slot-scope="scope">
                        <span class="link-type" @click="teacherleavedetails(scope.row.id)">
                            {{ scope.row.teacherName }}
                        </span>
					</template>
				</el-table-column>
                <el-table-column align="center" label="部门" show-overflow-tooltip>
                    <template slot-scope="scope">
                        {{ scope.row.departName }}
                    </template>
                </el-table-column>
				<el-table-column align="center" label="类型" show-overflow-tooltip>
					<template slot-scope="scope">
						{{ scope.row.leaveTypeName }}
					</template>
				</el-table-column>
				<el-table-column align="center" label="内容" show-overflow-tooltip>
					<template slot-scope="scope">
                        {{ scope.row.content }}
					</template>
				</el-table-column>
				<el-table-column align="center" label="开始时间" show-overflow-tooltip>
					<template slot-scope="scope">
						<span v-if="scope.row.isClassHour == 0">{{ scope.row.startDate }}{{ getWeekDay(scope.row.startDate) }}{{ scope.row.isMorningName != '节次' ? scope.row.isMorningName : '' }}</span>
						<span v-else>{{ scope.row.startDate }}{{ getWeekDay(scope.row.startDate) }}</span>
					</template>
				</el-table-column>
				<el-table-column align="center" label="请假时长" show-overflow-tooltip>
					<template slot-scope="scope">
						<span v-if="scope.row.isClassHour == 0">{{ scope.row.leaveDateCount }}天</span>
						<span v-else-if="scope.row.isClassHour == 1">第{{ scope.row.classHourName }}节</span>
                        <span v-else>{{ scope.row.timeLenth | getHour }}小时({{scope.row.startTime.slice(11, 16)}}-{{scope.row.endTime.slice(11, 16)}})</span>
                    </template>
				</el-table-column>
				 <el-table-column align="center" label="是否抵扣" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span >{{ scope.row.isDeduction==1?'否':'是'}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="审批人" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span >{{ scope.row.batchUserName }}</span>
                    </template>
                </el-table-column>
				<el-table-column align="center" label="状态" show-overflow-tooltip>
					<template slot-scope="scope">
						<el-tag  size="mini" type="danger" v-if="scope.row.leaveStateName == '驳回'">驳回</el-tag>
						<el-tag  size="mini" type="warning" v-else-if="scope.row.leaveState == 1">未审批</el-tag>
						<el-tag  size="mini" type="success" v-else-if="scope.row.leaveStateName == '同意'">同意</el-tag>
						<el-tag  size="mini" type="danger" v-else-if="scope.row.leaveStateName == '销假'">销假</el-tag>
					</template>
				</el-table-column>
			</el-table>
			<div class="pagination-container">
				<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.pageNo" :page-sizes="[10, 20, 30, 50]" :page-size.sync="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
			</div>
		</div>
	</div>
</template>

<script>
import mixin from '@/mixins/windowResize'
import baseMixin from '@/mixins/baseMixin'
import moment from 'moment'
import { getTeacherAskleaveList,getDepartList } from '@/api/teacherleave'
import { getTeacherAskleaveInitInfo } from '@/api/systemSet/TeacherLeave3Set'
import { isShowByPermission } from "@/utils";
export default {
	data() {
		return {
			daterange: [moment().format('YYYY-MM-DD'), moment().format('YYYY-MM-DD')],
			dataList: [],
			departList:[],
			listQuery: {
				pageNo: 1,
				pageSize: 20,
				startDate: '',
				endDate: '',
				departId:0
			},
			total: 0,
			leaveType: -1,
			leaveState: 2,
			leaveTypeList: [],
			isShowBack: false,
			teacherName: ''
		}
	},
    name: 'teacherleavelist',
	mixins: [baseMixin, mixin],
	activated() {
		const refresh = sessionStorage.getItem('refresh-leave-list')
		if (+refresh === 1) {
			sessionStorage.removeItem('refresh-leave-list')
			this.leaveType = this.$route.query.leaveType === undefined || this.$route.query.leaveType === null ? -1 : parseInt(this.$route.query.leaveType)
			this.leaveState = this.$route.query.leaveState || 2
			this.teacherName = this.$route.query.userName || ''
			if(this.$route.query.startDate) {
				this.daterange = [this.$route.query.startDate, this.$route.query.endDate]
				this.listQuery.startDate = this.$route.query.startDate //时间
				this.listQuery.endDate = this.$route.query.endDate
				this.isShowBack = true;
			} else if(this.$route.query.date) {
				this.daterange = [`${this.$route.query.date}-01`, moment(`${this.$route.query.date}-01`).endOf('month').format('YYYY-MM-DD')];
				this.listQuery.startDate = `${this.$route.query.date}-01` //时间
				this.listQuery.endDate = moment(`${this.$route.query.date}-01`).endOf('month').format('YYYY-MM-DD')
				this.isShowBack = true;
			} else {
				this.daterange[0] = moment().set('date', 1).format('YYYY-MM-DD')
				this.listQuery.startDate = this.$moment(this.daterange[0]).format('YYYY-MM-DD') //时间
				this.listQuery.endDate = this.$moment(this.daterange[1]).format('YYYY-MM-DD')
			}
		}
		this.getDepartList()
		this.init();
	},
	filters: {
		trimTime(dateTime) {
			return dateTime.slice(11, 16)
		},
        getHour(minute) {
		    return ((minute / 60).toFixed(2))-0;
        }
	},
	computed: {
		getWeekDay() {
			return function(val) {
				let weekDay = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
				return '(' + weekDay[new Date(val.replace(/\-/g, '/')).getDay()] + ')'
			}
		},
        exportUrl() {
            return global.BasePath + 'structure/teacherAskleave/exportTeacherAskleaveList?startDate=' + this.listQuery.startDate+ '&departId=' + this.listQuery.departId + '&endDate=' + this.listQuery.endDate + '&token=' + this.$store.getters.token + '&leaveType=' + this.leaveType + '&leaveState=' + this.leaveState + '&teacherName=' + this.teacherName;
        }
	},
	methods: {
		isShowByPermission,
	    init() {
	        getTeacherAskleaveInitInfo()
                .then(res => res.data)
                .then(data => {
                    this.leaveTypeList = data.data.leaveTypeList;
                })
            this.getTeacherAskleaveLists()
        },
		findDate() {
			this.listQuery.startDate = this.$moment(this.daterange[0]).format('YYYY-MM-DD') //时间
			this.listQuery.endDate = this.$moment(this.daterange[1]).format('YYYY-MM-DD') //时间
			this.listQuery.departId=0;			
			this.getDepartList()
			this.getTeacherAskleaveLists()
		},
		getDepartList(){
			this.departList=[]
              getDepartList(this.listQuery)
				.then(res => res.data)
				.then(data => {
					if (data.code === 200) {
						this.departList = data.data
					} else {
						this.$message({
							type: 'error',
							message: data.msg
						})
					}
				})
				.catch(() => {})
		},
        handleFilter() {
            this.listQuery.pageNo = 1
            this.getTeacherAskleaveLists()
        },
		handleSizeChange(val) {
			this.listQuery.pageNo = 1
			this.listQuery.pageSize = val
			this.getTeacherAskleaveLists()
		},
		handleCurrentChange(val) {
			this.listQuery.pageNo = val
			this.getTeacherAskleaveLists()
		},
		//详情
		teacherleavedetails(id) {
			this.$router.push({
				path: 'teacherleavedetails',
				query: { id: id }
			})
		},
		daiLeaveAdd() {
			this.$router.push({
				path: 'daiLeaveAdd',
			})
		},
		// 获取数据列表
		getTeacherAskleaveLists() {
			getTeacherAskleaveList({
                ...this.listQuery,
                teacherName: this.teacherName,
                leaveType: this.leaveType,
                leaveState: this.leaveState
            })
				.then(res => res.data)
				.then(data => {
					if (data.code === 200) {
						let tableData = data.data
						this.dataList = tableData.dataList
						this.total = tableData.pagination.total
					} else {
						this.$message({
							type: 'error',
							message: data.msg
						})
					}
				})
				.catch(() => {})
		}
	}
}
</script>
<style lang="scss" scoped>
.leaveContent {
	padding: 12px;
	box-sizing: border-box;

	.header {
		margin-bottom: 10px;
		font-size: 14px;

	}
}
</style>
