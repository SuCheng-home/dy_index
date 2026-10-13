<template>
    <div class="today_attendance_list">

        <div class="header">
            <el-row>
                <el-col :span="19">
                    <el-button type="default" size="medium" @click="$router.back()">返回</el-button>
                    <el-select v-model="departId" placeholder="请选择部门" size="medium" style="width: 120px;"
                               @change="changeDepart">
                        <el-option label="全部部门" :value="0"></el-option>
                        <el-option v-for="item in departList" :key="item.id" :label="item.name"
                                   :value="item.id"></el-option>
                    </el-select>
                    <el-select v-model="type" placeholder="请选择状态" size="medium" style="width: 120px;"
                               @change="changeDepart">
                        <el-option label="全部状态" :value="0"></el-option>
                        <el-option label="签到正常" :value="3"></el-option>
                        <el-option label="迟到" :value="1"></el-option>
                        <el-option label="签到未签" :value="4"></el-option>
                        <el-option label="签退正常" :value="5"></el-option>
                        <el-option label="早退" :value="2"></el-option>
                        <el-option label="签退未签" :value="6"></el-option>
                    </el-select>
                </el-col>
                <el-col :span="5">
                    <el-input
                        placeholder="请输入姓名" icon="search" size="medium"
                        @keyup.enter.native="todayAttendanceTypeAnalysis"
                        v-model.trim="searchName">
                        <el-button slot="append" icon="el-icon-search" @click="todayAttendanceTypeAnalysis"></el-button>
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
                <!--                <template v-if="type === 3 || type === 4 || type === 1">-->

                <template v-if="type == 1 || type == 3 || type == 4 || type == 0">
                    <el-table-column label="应签到时间" align="center" key="col3">
                        <template slot-scope="scope">{{scope.row.ruleSignInDate | secondFilter}}</template>
                    </el-table-column>
                    <!--                </template>-->
                    <!--                <template v-if="type === 3 || type === 1">-->
                    <el-table-column v-if="type == 1" label="迟到时长" align="center" key="col4">
                        <template slot-scope="scope">{{getChidaoDuration(scope.row)}}</template>
                    </el-table-column>
                    <el-table-column :label="type === 1 ? '迟到时间' : '实签到时间'" align="center" key="col5">
                        <template slot-scope="scope">{{scope.row.userSignInDate | secondFilter}}</template>
                    </el-table-column>
                    <el-table-column label="签到地点" align="center" key="col6"
                                     show-overflow-tooltip>
                        <template slot-scope="scope">{{scope.row.userSignInAddress || '--'}}</template>
                    </el-table-column>
                </template>
                <template v-if="type == 2 || type == 5 || type == 6 || type == 0">
                    <el-table-column label="应签退时间" align="center" key="col7">
                        <template slot-scope="scope">{{scope.row.ruleSignOutDate | secondFilter}}</template>
                    </el-table-column>
                    <el-table-column v-if="type == 2" label="早退时长" align="center" key="col8">
                        <template slot-scope="scope">{{getZaotuiDuration(scope.row)}}</template>
                    </el-table-column>
                    <!--                </template>-->
                    <!--                <template v-if="type === 5 || type === 2">-->
                    <el-table-column :label="type === 2 ? '早退时间' : '实签退时间'" align="center" key="col9">
                        <template slot-scope="scope">{{scope.row.userSignOutDate | secondFilter}}</template>
                    </el-table-column>
                    <el-table-column label="签退地点" align="center"
                                     key="col10"
                                     show-overflow-tooltip>
                        <template slot-scope="scope">{{scope.row.userSignOutAddress || '--'}}</template>
                    </el-table-column>
                </template>
                <!--                </template>-->

                <!--                <template v-if="type === 5 || type === 6 || type === 2">-->

                <!--                </template>-->
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
    import {todayAttendanceTypeAnalysis, queryDepartByTypes} from '@/api/schoolManage/teacherAttendanceStatistics';

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
                departId: 0,
                departList: [],
                searchName: '',
                typeAttendanceList: [],
                type: 0,
                date: this.$route.query.date || moment().format('YYYY-MM-DD')
            }
        },
        created() {
            this.type = parseInt(this.$route.query.type);
            this.todayAttendanceTypeAnalysis();
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
                const hours = moment(item.ruleSignOutDate).diff(item.userSignOutDate, 'hours');
                const minutes = moment(item.ruleSignOutDate).diff(item.userSignOutDate, 'minutes');
                const seconds = moment(item.ruleSignOutDate).diff(item.userSignOutDate, 'seconds');
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
                this.todayAttendanceTypeAnalysis();
            },
            todayAttendanceTypeAnalysis() {
                let query = {
                    pageNo: this.pageNo,
                    pageSize: this.pageSize,
                    searchName: this.searchName,
                    departId: this.departId,
                    type: this.type,
                    startDate: this.date,
                    endDate: this.date
                };
                todayAttendanceTypeAnalysis(query).then(res => {
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
                this.todayAttendanceTypeAnalysis();
            },
            handleSizeChange(val) {
                this.pageSize = val;
                this.pageNo = 1;
                this.todayAttendanceTypeAnalysis();
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
