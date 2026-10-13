<template>
    <div class="all_type_attendance_list">
        <div class="header">
            <el-row>

                <el-col :span="19">
                    <el-button type="default" size="medium" @click="$router.back()" v-if="isShowBack">返回</el-button>
                    <el-date-picker v-model="timeRange" type="daterange" class="mywidthdaterange" size="medium" :clearable="false"
                                    style="margin-right: 8px;"
                                    @change="attendanceUserAnalysis"
                                    range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期">
                    </el-date-picker>
                    <a :href="exportURL" download="导出结果" target="_blank" v-if="analysisList.length">
                        <el-button class="filter-item" size="medium" type="primary" icon="upload">导出</el-button>
                    </a>

                </el-col>
                <el-col :span="5">
                    <el-input
                        placeholder="请输入姓名" icon="search" size="medium" @keyup.enter.native="attendanceUserAnalysis"
                        v-model.trim="searchName">
                        <el-button slot="append" icon="el-icon-search" @click="attendanceUserAnalysis"></el-button>
                    </el-input>
                </el-col>
            </el-row>
        </div>
        <div>
            <el-table ref="multipleTable" :data="analysisList" border stripe :height="maxH" style="width: 100%">
                <el-table-column label="姓名" align="center" prop="userName"></el-table-column>
                <el-table-column label="所在部门" align="center" prop="userDepartNames"
                                 show-overflow-tooltip></el-table-column>
                <el-table-column label="迟到" align="center">
                    <template slot-scope="scope">
                        <span class="sign_count" @click="addCondition(1, scope.row.userId, scope.row.lateDay)">{{scope.row.lateDay}}次</span>
                    </template>
                </el-table-column>
                <el-table-column label="早退" align="center">
                    <template slot-scope="scope">
                        <span class="sign_count" @click="addCondition(2, scope.row.userId, scope.row.leaveEarlyDay)">{{scope.row.leaveEarlyDay}}次</span>
                    </template>
                </el-table-column>
                <el-table-column label="到勤" align="center">
                    <template slot-scope="scope">
                        <span class="sign_count" @click="addCondition(3, scope.row.userId, scope.row.attendDay)">{{scope.row.attendDay}}次</span>
                    </template>
                </el-table-column>
                <el-table-column label="缺勤" align="center">
                    <template slot-scope="scope">
                        <span class="sign_count" @click="addCondition(4, scope.row.userId, scope.row.absentDay)">{{scope.row.absentDay}}次</span>
                    </template>
                </el-table-column>
                <el-table-column label="签到缺卡" align="center">
                    <template slot-scope="scope">
                        <span class="sign_count" @click="addCondition(7, scope.row.userId, scope.row.signInAbsentDay)">{{scope.row.signInAbsentDay}}次</span>
                    </template>
                </el-table-column>
                 <el-table-column label="签退缺卡" align="center">
                    <template slot-scope="scope">
                        <span class="sign_count" @click="addCondition(8, scope.row.userId, scope.row.signOutAbsentDay)">{{scope.row.signOutAbsentDay}}次</span>
                    </template>
                </el-table-column>
                <!--<el-table-column label="请假" align="center">-->
                <!--<template slot-scope="scope">-->
                <!--<span class="sign_count" @click="addCondition(6, scope.row.userId, scope.row.askLeaveTime)">{{scope.row.askLeaveTime ? scope.row.askLeaveTime : '0分钟'}}</span>-->
                <!--</template>-->
                <!--</el-table-column>-->
                <el-table-column label="异常外出" align="center">
                    <template slot-scope="scope">
                        <span class="sign_count" @click="addCondition(9, scope.row.userId, scope.row.schOutExptionCount,scope.row.userName)">{{scope.row.schOutExptionCount}}次</span>
                    </template>
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

        <el-dialog title="详情" :visible.sync="isShowTypeTable" v-if="isShowTypeTable" :close-on-press-escape="false"
                   :close-on-click-modal="false" :show-close="false">
            <template v-if="isShowTypeTable">
                <div style="max-height: 400px;overflow-y: auto;">
                    <el-table :data="typeTableList">
                        <el-table-column label="日期" width="120">
                            <template slot-scope="scope">{{scope.row.todayDate}}</template>
                        </el-table-column>
                        <template v-if="type === 1">
                            <el-table-column label="应签到时间" width="120">
                                <template slot-scope="scope">{{scope.row.ruleSignInDate | secondFilter}}</template>
                            </el-table-column>
                            <el-table-column label="实签到时间" width="120">
                                <template slot-scope="scope">{{scope.row.userSignInDate | secondFilter}}</template>
                            </el-table-column>
                            <el-table-column property="userSignInAddress" label="签到地点"
                                             show-overflow-tooltip></el-table-column>
                            <el-table-column property="ruleName" label="考勤规则" show-overflow-tooltip></el-table-column>
                            <el-table-column align="center" label="操作" width="120" v-if="isShowByPermission('/attendance/attendanceMark')">
                                <template slot-scope="scope">
                                    <el-button size="small" type="text" @click="supplementSign(scope.row.id)">补签
                                    </el-button>
                                </template>
                            </el-table-column>
                        </template>

                        <template v-else-if="type === 2">
                            <el-table-column label="应签退时间" width="120">
                                <template slot-scope="scope">{{scope.row.ruleSignOutDate | secondFilter}}</template>
                            </el-table-column>
                            <el-table-column label="实签退时间" width="120">
                                <template slot-scope="scope">{{scope.row.userSignOutDate | secondFilter}}</template>
                            </el-table-column>
                            <el-table-column property="userSignOutAddress" label="签退地点"
                                             show-overflow-tooltip></el-table-column>
                            <el-table-column property="ruleName" label="考勤规则" show-overflow-tooltip></el-table-column>
                            <el-table-column align="center" label="操作" width="120" v-if="isShowByPermission('/attendance/attendanceMark')">
                                <template slot-scope="scope">
                                    <el-button size="small" type="text" @click="supplementSign(scope.row.id)">补签
                                    </el-button>
                                </template>
                            </el-table-column>
                        </template>

                        <template v-else-if="type === 3">
                            <el-table-column label="实签到时间" width="120">
                                <template slot-scope="scope">{{scope.row.userSignInDate | secondFilter}}</template>
                            </el-table-column>
                            <el-table-column property="userSignInAddress" label="签到地点"
                                             show-overflow-tooltip></el-table-column>
                            <el-table-column label="实签退时间" width="120">
                                <template slot-scope="scope">{{scope.row.userSignOutDate | secondFilter}}</template>
                            </el-table-column>
                            <el-table-column property="userSignOutAddress" label="签退地点"
                                             show-overflow-tooltip></el-table-column>
                            <el-table-column property="ruleName" label="考勤规则" show-overflow-tooltip></el-table-column>
                        </template>

                        <template v-else-if="type === 4">
                            <el-table-column label="应签到时间">
                                <template slot-scope="scope">{{scope.row.ruleSignInDate | secondFilter}}</template>
                            </el-table-column>
                            <el-table-column label="应签退时间">
                                <template slot-scope="scope">{{scope.row.ruleSignOutDate | secondFilter}}</template>
                            </el-table-column>
                            <el-table-column property="ruleName" label="考勤规则" show-overflow-tooltip></el-table-column>
                            <el-table-column align="center" label="操作" v-if="isShowByPermission('/attendance/attendanceMark')">
                                <template slot-scope="scope">
                                    <el-button size="small" type="text"   @click="supplementSign(scope.row.id)">补签
                                    </el-button>
                                </template>
                            </el-table-column>
                        </template>

                        <template v-else-if="type === 7||type === 8">
                            <el-table-column label="实签到时间" width="120" v-if="type===7">
                                <template slot-scope="scope">
                                    <span v-if="scope.row.signInState===3"><el-tag size="mini"
                                                                                   type="warning">请假</el-tag></span>
                                    <span v-else>{{scope.row.userSignInDate | secondFilter}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column property="userSignInAddress" label="签到地点"  v-if="type===7"
                                             show-overflow-tooltip></el-table-column>
                            <el-table-column label="实签退时间" width="120"   v-if="type===8">
                                <template slot-scope="scope">
                                    <span v-if="scope.row.signOutState===3"><el-tag size="mini"
                                                                                    type="warning">请假</el-tag></span>
                                    <span v-else>{{scope.row.userSignOutDate | secondFilter}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column property="userSignOutAddress" label="签退地点"  v-if="type===8"
                                             show-overflow-tooltip></el-table-column>
                            <el-table-column property="ruleName" label="考勤规则" show-overflow-tooltip></el-table-column>
                            <el-table-column align="center" label="操作" width="120" v-if="isShowByPermission('/attendance/attendanceMark')">
                                <template slot-scope="scope">
                                    <el-button size="small" type="text" @click="supplementSign(scope.row.id)">补签
                                    </el-button>
                                </template>
                            </el-table-column>
                        </template>
                        <template v-else-if="type===9">
                             <!-- <el-table-column label="姓名" align="center" prop="userName"></el-table-column>
                <el-table-column label="所在部门" align="center" prop="userDepartNames"
                                 show-overflow-tooltip></el-table-column> -->
                <!-- <el-table-column label="日期" align="center" prop="todayDate" show-overflow-tooltip></el-table-column> -->
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
                        </template>
                    </el-table>
                </div>
                <div slot="footer" class="dialog-footer">
                    <a :href="userExportURL" download="导出结果" target="_blank">
                        <el-button class="filter-item" size="medium" type="primary" icon="upload">导出</el-button>
                    </a>
                    <el-button size="medium" @click="closeTypeTable">关 闭</el-button>
                </div>
            </template>
        </el-dialog>
    </div>
</template>

<script>
    import BackTool from '@/components/BackTool';
    import mixins from '@/mixins/windowResize';
    import { isShowByPermission } from "@/utils";
    import {
        attendanceUserAnalysis,
        attendanceTypeUser,
        attendanceRetroactive,
        getGateInfoExceptionList
    } from '@/api/schoolManage/teacherAttendanceStatistics';

    export default {
        name: "teacherAttendanceStatisticsAllTypesList",
        components: {
            BackTool
        },
        data() {
            return {
                exportURL: '',
                userExportURL: '',
                timeRange: [],
                pageNo: 1,
                pageSize: 20,
                total: null,
                listLoading: false,
                searchName: '',
                analysisList: [],
                type: 0,
                userId: '',
                isShowTypeTable: false,
                typeTableList: [],
                isShowBack: false,
                userName:""
            }
        },
        created() {
            if (sessionStorage.getItem('startDate')) {
                this.timeRange = [sessionStorage.getItem('startDate'), sessionStorage.getItem('endDate')];
                this.isShowBack = true;
            } else if (this.$route.query.date) {
                this.timeRange = [`${this.$route.query.date}-01`, moment(`${this.$route.query.date}-01`).endOf('month').format('YYYY-MM-DD')];
                this.isShowBack = true;
            } else {
                this.timeRange = [moment().startOf('month').format('YYYY-MM-DD'), moment().endOf('month').format('YYYY-MM-DD')];
            }
            if (this.$route.query.userName) {
                this.searchName = this.$route.query.userName;
            }
            this.attendanceUserAnalysis();
        },
        filters: {
            secondFilter(datetime) {
                return datetime ? datetime.slice(0, datetime.lastIndexOf(':')) : '--';
            }
        },
        mixins: [mixins],
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
            isShowByPermission,
            attendanceUserAnalysis() {
                let date1 = this.dateFormat(this.timeRange[0]);
                let date2 = this.dateFormat(this.timeRange[1]);
                this.changeExportURL();
                let query = {
                    pageNo: this.pageNo,
                    pageSize: this.pageSize,
                    searchName: this.searchName,
                    startDate: date1,
                    endDate: date2
                };
                sessionStorage.setItem('afterStartDate', date1);
                sessionStorage.setItem('afterEndDate', date2);
                attendanceUserAnalysis(query).then(res => {
                    const data = res.data;
                    if (data.code === 200) {
                        this.analysisList = data.data.dataList;
                        this.total = data.data.pagination.total;
                    }
                }).catch(() => {
                });
            },
            addCondition(type, userId, count,userName) {
                // 弹出
                if (!count) {
                    return;
                }
                this.userName=userName
                this.type = type;
                this.userId = userId;
                this.attendanceTypeUser();
            },
            attendanceTypeUser() {  getGateInfoExceptionList
                if(this.type==9){
                     let query = {
                    startDate: this.dateFormat(this.timeRange[0]),
                    endDate: this.dateFormat(this.timeRange[1]),                  
                    userId: this.userId,
                    userDepartIds:"",
                    pageSize:1000,
                    pageNo:1,
                    userName:""
                };
                 getGateInfoExceptionList(query).then(res => {
                    const data = res.data;
                    if (data.code === 200) {
                        this.typeTableList = data.data.dataList;
                    }
                }).catch(() => {
                });

                }else{
                    let query = {
                    startDate: this.dateFormat(this.timeRange[0]),
                    endDate: this.dateFormat(this.timeRange[1]),
                    type: this.type,
                    userId: this.userId
                };
                attendanceTypeUser(query).then(res => {
                    const data = res.data;
                    if (data.code === 200) {
                        this.typeTableList = data.data;
                    }
                }).catch(() => {
                });

                }
                
                this.changeUserExportURL();
                this.isShowTypeTable = true;
            },
            supplementSign(id) {
                attendanceRetroactive({
                    recordId: id,
                    type: this.type
                }).then(res => {
                    const data = res.data;
                    if (data.code === 200) {
                        this.$message({
                            message: '补签成功',
                            type: 'success'
                        });
                        this.attendanceTypeUser();
                    }
                }).catch(() => {
                });
            },
            closeTypeTable() {
                this.isShowTypeTable = false;
                this.typeTableList = [];
                this.attendanceUserAnalysis();
            },
            handleCurrentChange(val) {
                this.pageNo = val;
                this.attendanceUserAnalysis();
            },
            handleSizeChange(val) {
                this.pageSize = val;
                this.pageNo = 1;
                this.attendanceUserAnalysis();
            },
            changeExportURL() {
                this.exportURL = global.BasePath + 'structure/attendance/downAttendanceUserAnalysis?startDate='
                    + this.dateFormat(this.timeRange[0]) + '&endDate=' + this.dateFormat(this.timeRange[1])
                    + '&searchName=' + this.searchName + '&token=' + this.$store.getters.token;
            },
            changeUserExportURL() {
                if(this.type==9){
                    this.userExportURL =global.BasePath + 'structure/gateNew/exportGateInfoExceptionList?startDate='
                    +  this.dateFormat(this.timeRange[0]) + '&endDate='+ this.dateFormat(this.timeRange[1])
                    +'&userName='+ this.userName + '&token='+this.$store.getters.token;

                }else{
                    this.userExportURL = global.BasePath + 'structure/attendance/downAttendanceTypeUser?startDate='
                    + this.dateFormat(this.timeRange[0]) + '&endDate=' + this.dateFormat(this.timeRange[1])
                    + '&type=' + this.type + '&userId=' + this.userId + '&token=' + this.$store.getters.token;
                }                
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
    .all_type_attendance_list {
        padding: 12px;

        .sign_count {
            color: #409EFF;
            cursor: pointer;
        }

        .header {
            padding-bottom: 10px;
        }
    }
</style>
