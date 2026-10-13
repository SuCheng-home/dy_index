<template>
    <div class="today_attendance_list">

        <div class="header">
            <el-row>
                <el-col :span="19">
                    <el-button type="default" size="medium" @click="$router.back()">返回</el-button>
                      <el-date-picker v-if="type==2" @change="changeDepart" v-model="timeRange" type="daterange" class="mywidthdaterange" size="medium" :clearable="false" style="margin-right: 8px;"
                                range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
                    <el-select v-model="departId" placeholder="请选择部门" size="medium" 
                               @change="changeDepart">
                        <el-option label="全部部门" :value="''"></el-option>
                        <el-option v-for="item in departList" :key="item.id" :label="item.name"
                                   :value="item.id"></el-option>
                    </el-select>
                </el-col>
                <el-col :span="5">
                    <el-input
                        placeholder="请输入姓名" icon="search" size="medium"
                        @keyup.enter.native="getGateInfoExceptionList"
                        v-model.trim="searchName">
                        <el-button slot="append" icon="el-icon-search" @click="getGateInfoExceptionList"></el-button>
                    </el-input>
                </el-col>
            </el-row>
        </div>
        <div>
            <el-table ref="multipleTable" :data="typeAttendanceList" border stripe :height="maxH" style="width: 100%">
                <el-table-column label="姓名" align="center" prop="userName"></el-table-column>
                <el-table-column label="所在部门" align="center" prop="userDepartNames"
                                 show-overflow-tooltip></el-table-column>
                <el-table-column label="日期" align="center" prop="todayDate" show-overflow-tooltip></el-table-column>
                  <el-table-column label="外出时间" align="center" key="col3">
                        <template slot-scope="scope">{{scope.row.userSignOutDate?scope.row.userSignOutDate.slice(11, 19):""}}</template>
                    </el-table-column>
                 <el-table-column label="外出打卡位置" align="center">
                        <template slot-scope="scope">{{scope.row.userSignOutAddress}}</template>
                    </el-table-column>
                 <el-table-column label="返回时间" align="center">
                        <template slot-scope="scope">{{scope.row.userSignInDate?scope.row.userSignInDate.slice(11, 19):""}}</template>
                    </el-table-column>
                <el-table-column label="返回打卡位置" align="center">
                        <template slot-scope="scope">{{scope.row.userSignInAddress}}</template>
                    </el-table-column>
                <el-table-column label="外出时长" align="center">
                        <template slot-scope="scope">{{getZaotuiDuration(scope.row)}}</template>
                    </el-table-column>
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
    import moment from 'moment';
    import BackTool from '@/components/BackTool';
    import mixins from '@/mixins/windowResize';
    import {getGateInfoExceptionList, queryDepartByTypes} from '@/api/schoolManage/teacherAttendanceStatistics';

    export default {
        name: "teacherAttendanceStatisticsTodayList",
        components: {
            BackTool
        },
        data() {
            return {
                pageNo: 1,
                pageSize: 20,
                total: null,
                listLoading: false,
                departId: '',
                departList: [],
                searchName: '',
                typeAttendanceList: [],
                type: 0,
                startDate: this.$route.query.startDate || moment().format('YYYY-MM-DD'),
                endDate: this.$route.query.endDate || moment().format('YYYY-MM-DD'),
                 timeRange: [],
            }
        },
        created() {
            this.type = parseInt(this.$route.query.type);
             if(this.$route.query.startDate) {
                this.timeRange = [this.$route.query.startDate, this.$route.query.endDate];
            } else {
                this.timeRange = [sessionStorage.getItem('startDate'), sessionStorage.getItem('endDate')];
            }
            this.getGateInfoExceptionList();
            this.queryDepartByTypes();
        },
        mixins: [mixins],
        filters: {
            secondFilter(datetime) {
                return datetime ? datetime.slice(0, datetime.lastIndexOf(':')) : '--';
            }
        },
        methods: {
            getZaotuiDuration(item) {
                 let text = '';
                const hours = Math.floor(item.timeLength / 60);
                const minutes = item.timeLength % 60;
                if(hours>0) {
                    text += `${hours}小时`;
                }
                if(minutes>0) {
                    text += `${minutes % 60}分钟`;
                }
                return text;
            },
            getChidaoDuration(item) {
                let text = '';
                const hours = moment(item.userSignInDate).diff(item.ruleSignInDate, 'hours');
                const minutes = moment(item.userSignInDate).diff(item.ruleSignInDate, 'minutes');
                const seconds = moment(item.userSignInDate).diff(item.ruleSignInDate, 'seconds');
                if(hours) {
                    text += `${hours}小时`;
                }
                if(minutes) {
                    text += `${minutes % 60}分钟`;
                }
                if(seconds) {
                    text += `${seconds % 60}秒`;
                }
                return text;
            },
            queryDepartByTypes() {
                queryDepartByTypes({types: 7}).then(res => {
                    const data = res.data.data;
                    if (res.data.code === 200 && data && data.length) {
                        this.departList = data;
                    }
                }).catch()
            },
            changeDepart() {
                this.pageNo = 1;
                this.getGateInfoExceptionList();
            },
             fillZero(n) {
                return n < 10 ? '0' + n : n;
            },
            dateFormat(n) {
                let data = new Date(n);
                data.setTime(data.getTime());
                let dateStr = data.getFullYear() + "-" + this.fillZero(data.getMonth() + 1) + "-" + this.fillZero(data.getDate());
                return dateStr;
            },
            getGateInfoExceptionList() {
                 let date1 = this.dateFormat(this.timeRange[0]);
                let date2 = this.dateFormat(this.timeRange[1]);
                let query = {
                    pageNo: this.pageNo,
                    pageSize: this.pageSize,
                    userName: this.searchName,
                    userDepartIds: this.departId,
                    startDate: date1,
                    endDate: date2
                };
                getGateInfoExceptionList(query).then(res => {
                    const data = res.data;
                    if (data.code === 200) {
                        this.typeAttendanceList = data.data.dataList;
                        this.total = data.data.pagination.total;
                    }
                }).catch(() => {
                });
            },
            handleCurrentChange(val) {
                this.pageNo = val;
                this.getGateInfoExceptionList();
            },
            handleSizeChange(val) {
                this.pageSize = val;
                this.pageNo = 1;
                this.getGateInfoExceptionList();
            },
        }
    }
</script>

<style lang="scss" scoped>
    .today_attendance_list {
        padding: 12px;
    }

    .header {
        padding-bottom: 10px;
    }
</style>
