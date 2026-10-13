<template>
    <div class="attendance_list">
        <el-row>
            <el-col :span="24">
                <backtool>
                    <el-date-picker v-model="timeRange" type="daterange" class="mywidthdaterange" size="medium" :clearable="false" style="margin-right: 8px;"
                                    range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期">
                    </el-date-picker>
                    <el-button type="primary" size="medium" @click="attendanceAnalysis">检索</el-button>
                    <el-button type="primary" size="medium" @click="toAllTypesStatistics">统计汇总</el-button>
                </backtool>
            </el-col>
        </el-row>
        <div>
            <el-table ref="multipleTable" :data="attendanceList" border stripe :height="nobottommaxH" style="width: 100%">
                <el-table-column label="事由" align="center" prop="typeName"></el-table-column>
                <el-table-column label="次数" align="center">
                    <template slot-scope="scope">
                        <span class="type_count" @click="toTypeRangeList(scope.row.type)">{{scope.row.typeCount}}</span>
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script>
    import BackTool from '@/components/BackTool';
    import mixins from '@/mixins/windowResize';
    import {attendanceAnalysis} from '@/api/schoolManage/teacherAttendanceStatistics';

    export default {
        name: "teacherAttendanceStatisticsList",
        components: {
            BackTool
        },
        data() {
            return {
                timeRange: [],
                attendanceList: []
            }
        },
        created() {
            if (sessionStorage.getItem('afterStartDate')) {
                this.timeRange = [sessionStorage.getItem('afterStartDate'), sessionStorage.getItem('afterEndDate')];
            } else {
                this.timeRange = [new Date(), new Date()];
            }
            this.attendanceAnalysis();
        },
        mixins:[mixins],
        methods: {
            attendanceAnalysis() {
                let query = {
                    startDate: this.dateFormat(this.timeRange[0]),
                    endDate: this.dateFormat(this.timeRange[1])
                };
                attendanceAnalysis(query).then(res => {
                    const data = res.data.data;
                    if (res.data.code === 200) {
                        this.attendanceList = [
                            { typeName: '迟到', type: 1, typeCount: data.lateDay},
                            { typeName: '早退', type: 2, typeCount: data.leaveEarlyDay},
                            { typeName: '到勤', type: 3, typeCount: data.attendDay},
                            { typeName: '缺勤', type: 4, typeCount: data.absentDay},
                            { typeName: '异常', type: 5, typeCount: data.exceptionDay},
                            // { typeName: '请假', type: 1, typeCount: data.askLeaveDay}
                        ];
                    }
                }).catch(() => {});
            },
            toAllTypesStatistics() {
                sessionStorage.setItem('startDate', this.dateFormat(this.timeRange[0]));
                sessionStorage.setItem('endDate', this.dateFormat(this.timeRange[1]));
                this.$router.push({path: 'teacherAttendanceStatisticsAllTypesList'});
            },
            toTypeRangeList(type) {
                sessionStorage.setItem('startDate', this.dateFormat(this.timeRange[0]));
                sessionStorage.setItem('endDate', this.dateFormat(this.timeRange[1]));
                this.$router.push({path: 'teacherAttendanceStatisticsRangeList', query: {type: type}});
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
            sessionStorage.removeItem('afterStartDate');
            sessionStorage.removeItem('afterEndDate');
        }
    }
</script>

<style lang="scss" scoped>
    .attendance_list{
        padding:12px;
        .type_count{
            color: #409EFF;
            cursor: pointer;
        }
    }
</style>
