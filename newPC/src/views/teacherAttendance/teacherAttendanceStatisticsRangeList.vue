<template>
    <div class="today_attendance_list">
        <div class="header">
            <el-row>
                <el-col :span="19">
                    <el-button type="default" size="medium" @click="$router.back()">返回</el-button>
                   <el-date-picker @change="attendanceTypeAnalysis" v-model="timeRange" type="daterange" class="mywidthdaterange" size="medium" :clearable="false" style="margin-right: 8px;"
                                range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期">
                </el-date-picker>
                 <a :href="exportURL" download="导出结果" target="_blank"  v-if="typeAttendanceList.length">
                    <el-button class="filter-item" size="medium" type="primary" icon="upload">导出</el-button>
                </a>
                </el-col>
                <el-col :span="5">
                    <el-input
                              placeholder="请输入姓名" icon="search" size="medium" @keyup.enter.native="attendanceTypeAnalysis"
                              v-model.trim="searchName">
                        <el-button slot="append" icon="el-icon-search" @click="attendanceTypeAnalysis"></el-button>
                    </el-input>
                </el-col>
            </el-row>
        </div>

        <div>
            <el-table ref="multipleTable" :data="typeAttendanceList" border stripe :height="maxH" style="width: 100%">
                <el-table-column label="姓名" align="center" prop="userName"></el-table-column>
                <el-table-column label="所在部门" align="center" prop="userDepartNames" show-overflow-tooltip></el-table-column>
                <el-table-column label="日期" align="center" prop="todayDate" show-overflow-tooltip></el-table-column>
                <template v-if="type === 1 || type === 4">
                    <el-table-column label="应签到时间" align="center">
                        <template slot-scope="scope">{{scope.row.ruleSignInDate | secondFilter}}</template>
                    </el-table-column>
                </template>
                <template v-if="type === 1 || type === 3 || type === 4 || type === 5">
                    <el-table-column :label="type === 1 ? '迟到时间' : '实签到时间'" align="center">
                        <template slot-scope="scope">
                            <span v-if="scope.row.signInState===3"><el-tag  size="mini"  type="warning">请假</el-tag></span>
                            <span v-else>{{scope.row.userSignInDate | secondFilter}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="签到地点" align="center" prop="userSignInAddress" show-overflow-tooltip></el-table-column>
                </template>


                <template v-if="type === 2 || type === 4">
                    <el-table-column label="应签退时间" align="center">
                        <template slot-scope="scope">{{scope.row.ruleSignOutDate | secondFilter}}</template>
                    </el-table-column>
                </template>
                <template v-if="type === 2 || type === 3 || type === 4 || type === 5">
                    <el-table-column :label="type === 2 ? '早退时间' : '实签退时间'" align="center">
                        <template slot-scope="scope">
                            <span v-if="scope.row.signOutState===3"><el-tag  size="mini"  type="warning">请假</el-tag></span>
                            <span v-else>{{scope.row.userSignOutDate | secondFilter}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="签退地点" align="center" prop="userSignOutAddress" show-overflow-tooltip></el-table-column>
                </template>

            </el-table>
            <div v-show="!listLoading" class="pagination-container">
                <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                               :current-page.sync="pageNo" :page-sizes="[10,20,30,50]"
                               :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper"
                               :total="total">
                </el-pagination>
            </div>
        </div>
    </div>
</template>

<script>
    import BackTool from '@/components/BackTool';
    import mixins from '@/mixins/windowResize';
    import {attendanceTypeAnalysis} from '@/api/schoolManage/teacherAttendanceStatistics';

    export default {
        name: "teacherAttendanceStatisticsRangeList",
        components: {
            BackTool
        },
        data() {
            return {
                exportURL: '',
                timeRange: [],
                pageNo:1,
                pageSize:20,
                total:null,
                listLoading:false,
                searchName: '',
                typeAttendanceList: [],
                type: 0,
            }
        },
        created() {
            this.type = parseInt(this.$route.query.type);
            if(this.$route.query.startDate) {
                this.timeRange = [this.$route.query.startDate, this.$route.query.endDate];
            } else {
                this.timeRange = [sessionStorage.getItem('startDate'), sessionStorage.getItem('endDate')];
            }
            this.attendanceTypeAnalysis();
        },
        mixins:[mixins],
        filters: {
            secondFilter(datetime) {
                return datetime ? datetime.slice(0, datetime.lastIndexOf(':')) : '--';
            }
        },
        methods: {
            attendanceTypeAnalysis() {
                let date1 = this.dateFormat(this.timeRange[0]);
                let date2 = this.dateFormat(this.timeRange[1]);
                this.changeExportURL();
                let query = {
                    pageNo: this.pageNo,
                    pageSize: this.pageSize,
                    searchName: this.searchName,
                    startDate: date1,
                    endDate: date2,
                    type: parseInt(this.$route.query.type)
                };
                sessionStorage.setItem('afterStartDate', date1);
                sessionStorage.setItem('afterEndDate', date2);
                attendanceTypeAnalysis(query).then(res => {
                    const data = res.data;
                    if (data.code === 200) {
                        this.typeAttendanceList = data.data.dataList;
                        this.total = data.data.pagination.total;
                    }
                }).catch(() => {});
            },
            handleCurrentChange(val){
                this.pageNo=val;
                this.attendanceTypeAnalysis();
            },
            handleSizeChange(val){
                this.pageSize=val;
                this.pageNo=1;
                this.attendanceTypeAnalysis();
            },
            changeExportURL() {
                this.exportURL = global.BasePath + 'structure/attendance/downAttendanceTypeAnalysis?startDate='
                    +  this.dateFormat(this.timeRange[0]) + '&endDate='+ this.dateFormat(this.timeRange[1])
                    +'&searchName='+ this.searchName +'&type=' + this.$route.query.type + '&token='+this.$store.getters.token;
            },
            fillZero(n) {
                return n < 10 ? '0' + n : n;
            },
            dateFormat(n) {
                let data = new Date(n);
                data.setTime(data.getTime());
                let dateStr = data.getFullYear() + "-" + this.fillZero(data.getMonth() + 1) + "-" + this.fillZero(data.getDate());
                return dateStr;
            }
        },
        destroyed() {
            sessionStorage.removeItem('startDate');
            sessionStorage.removeItem('endDate');
        }
    }
</script>

<style lang="scss" scoped>
    .today_attendance_list{
        padding:12px;
    }
    .header {
    padding-bottom: 10px;
    }
</style>
