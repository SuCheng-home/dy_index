<template>
    <div class="page">
        <div class="header">
            <el-row>
                <el-col :span="19">
                    <el-date-picker
                        size="medium"
                        @change="getList"
                        format="yyyy-MM"
                        value-format="yyyy-MM"
                        v-model="date"
                        align="right"
                        :clearable="false"
                        type="month"
                        placeholder="选择日期"
                    >
                    </el-date-picker>
                    <a :href="exportUrl" download="导出结果" target="_blank">
                        <el-button class="filter-item" size="medium" type="primary">导出</el-button>
                    </a>
                     <el-button class="filter-item" size="medium" @click="accountingByPersoninfo()" type="primary">查看明细</el-button>
                </el-col>
                <el-col :span="5">
                    <el-input placeholder="请输入姓名" icon="el-icon-search" size="medium" class="search-input"
                              v-model.trim="searchName" @keyup.enter.native="searchHandler">
                        <el-button slot="append" icon="el-icon-search" @click="searchHandler"></el-button>
                    </el-input>
                </el-col>
            </el-row>
        </div>
        <div>
            <el-table :data="dataList" border stripe :height="maxH" style="width: 100%">
                <el-table-column label="姓名" align="center" prop="userName"></el-table-column>
                <el-table-column label="部门" align="center" prop="userDepartNames"
                                 show-overflow-tooltip></el-table-column>
                <el-table-column label="正常出勤次数" align="center" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span class="link-type" @click="jumpToPage('teacherAttendanceStatisticsAllTypesList', {date, userName: scope.row.userName})">{{scope.row.attendDay}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="缺勤次数" align="center">
                    <template slot-scope="scope">
                        <span class="link-type" @click="jumpToPage('teacherAttendanceStatisticsAllTypesList', {date, userName: scope.row.userName})">{{scope.row.absentDay}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="缺卡次数" align="center"
                                 show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span class="link-type" @click="jumpToPage('teacherAttendanceStatisticsAllTypesList', {date, userName: scope.row.userName})">{{scope.row.exceptionDay}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="迟到次数" align="center">
                    <template slot-scope="scope">
                        <span class="link-type" @click="jumpToPage('teacherAttendanceStatisticsAllTypesList', {date, userName: scope.row.userName})">{{scope.row.lateDay}}</span>
                    </template>
                </el-table-column>

                <el-table-column label="早退次数" align="center"
                                 show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span class="link-type" @click="jumpToPage('teacherAttendanceStatisticsAllTypesList', {date, userName: scope.row.userName})">{{scope.row.leaveEarlyDay}}</span>
                    </template>
                </el-table-column>
                 <el-table-column label="补卡" align="center" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span >{{scope.row.markCount}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="请假次数" align="center"
                                 show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span class="link-type" @click="toLeavePage(scope.row.userName)">{{scope.row.leaveCount}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="请假时长" align="center"
                                 show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span class="link-type" @click="toLeavePage(scope.row.userName)">{{scope.row.leaveStrInfo || ''}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="已抵扣时长" align="center"
                                 show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span class="link-type" @click="jumpToPage('overtimeDeduction/statistics', {date, userName: scope.row.userName, isShowBack: 1})">{{scope.row.deductionStrInfo || ''}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="未抵扣" align="center"
                                 show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span class="link-type" @click="jumpToPage('overtimeDeduction/statistics', {date, userName: scope.row.userName, isShowBack: 1})">{{scope.row.nowCanUseStrInfo || ''}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="加班时长" align="center"
                                 show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span class="link-type" v-if="scope.row.workDayTime != 0 || scope.row.workTime != 0" @click="jumpToPage('extraWork/extraWorklistone', {date, userName: scope.row.userName})">
                            <span v-if="scope.row.workDayTime">{{scope.row.workDayTime}}天</span><span v-if="scope.row.workTime">{{scope.row.workTime}}小时</span>
                        </span>
                    </template>
                </el-table-column>
                <el-table-column label="外出次数" align="center"
                                 show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span class="link-type" @click="jumpToPage('outApplyStatistics/outApplyList', {date, userName: scope.row.userName})">{{scope.row.outCount || 0}}</span>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination-container">
                <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                               :current-page.sync="pagination.pageNo" :page-sizes="[10,20,30,50]"
                               :page-size="pagination.pageSize" layout="total, sizes, prev, pager, next, jumper"
                               :total="pagination.total">
                </el-pagination>
            </div>
        </div>
    </div>
</template>

<script>
    import {isShowByPermission} from '@/utils';
    import baseMixin from '@/mixins/baseMixin';
    import mixin from "@/mixins/windowResize";

    import {
        teacherAnalysisCollect
    } from '@/api/schoolManage/teacherAttendanceStatistics';
    import moment from "moment";

    export default {
        data() {
            return {
                date: moment().format('YYYY-MM'),
                searchName: '',
                dataList: []
            }
        },
        mixins: [baseMixin, mixin],
        computed: {
            exportUrl() {
                return `${global.BasePath}structure/attendance/downTeacherAnalysisCollect?startDate=${this.date}-01&endDate=${moment(`${this.date}-01`).endOf('month').format('YYYY-MM-DD')}&searchName=${this.searchName}&token=${this.$store.getters.token}&schoolTimeId=${this.schoolTimeCode}`
            }
        },
        created() {
            this.getList();
        },
        methods: {
            toLeavePage(userName) {
                if(isShowByPermission('/thAskLeaveFour/getStatisticsList')) {
                    this.jumpToPage('teacherLeave4/leaveTable', {date: this.date, userName})
                } else {
                    this.jumpToPage('teacherleave/teacherleavelist', {date: this.date, userName})
                }
            },
            accountingByPersoninfo() {
                this.$router.push({path: 'accountingByPersoninfo',query:{date:this.date}})
            },
            searchHandler() {
                this.pagination.pageNo = 1;
                this.getList();
            },
            handleCurrentChange(val){
                this.pagination.pageNo=val;
                this.getList();
            },
            handleSizeChange(val){
                this.pagination.pageSize=val;
                this.pagination.pageNo=1;
                this.getList();
            },
            getList() {
                teacherAnalysisCollect({
                    startDate: `${this.date}-01`,
                    endDate: moment(`${this.date}-01`).endOf('month').format('YYYY-MM-DD'),
                    pageNo: this.pagination.pageNo,
                    pageSize: this.pagination.pageSize,
                    searchName: this.searchName
                })
                    .then(res => res.data)
                    .then(data => {
                        this.dataList = data.data.dataList;
                        this.pagination.total = data.data.pagination.total;
                    })
            }
        }
    }
</script>

<style scoped>
    .page {
        height: 100%;
        padding: 12px;
    }

    .header {
        padding-bottom: 10px;
        border-bottom: 1px solid #e7eaec;
        background: #fff;
    }

    .clearfix:after {
        content: "";
        display: block;
        font-size: 0;
        height: 0;
        clear: both;
        visibility: hidden;
    }

    .clearfix {
        zoom: 1;
    }

    .section {
        border: 1px solid rgba(221, 221, 221, 1);
        float: left;
        padding: 12px 5px;
        box-sizing: border-box;
    }

    .section--atten, .section--leave {
        width: 48.4%;
        height: 320px;
        margin-bottom: 30px;

    }

    .section--leave {
        margin-left: 3%;

    }

    .section--dikou {
        width: 68%;
        height: 320px;
        margin-right: 3%;
    }

    .section--out, .section--extra {
        width: 29%;
        height: 145px;
    }

    .section--out {
        margin-bottom: 30px;
    }

    #atten-chart {
        width: 100%;
        height: 230px;
        margin-top: 26px;
    }

    #leave-chart {
        width: 100%;
        height: 250px;
    }

    .section__title {
        text-align: center;
        font-weight: bold;
        color: #333;
        font-size: 20px;

    }

    .color-band {
        border-left: 3px solid rgba(47, 149, 255, 1);
        padding-left: 5px;
    }

</style>
<style lang="scss" scoped>
    .title {
        color: rgba(55, 96, 141, 1);
        font-size: 26px;
        font-weight: bold;
        text-align: center;
        width: 100%;
        margin-bottom: 20px;
    }

    .data-item {
        display: inline-block;
        text-align: center;
        width: 24.5%;
        height: 60px;
        margin-top: 36px;

        &:nth-child(1) {
            color: #2EC7C9;
        }

        &:nth-child(2) {
            color: #FFB980;
        }

        &:nth-child(3) {
            color: #5AB1EF;
        }

        &:nth-child(4) {
            color: #B6A2DE;
        }

        .data-item__data {
            font-size: 36px;
            margin-bottom: 5px;
        }

        .data-item__text {
            color: #5F5F5F;
        }
    }

    .data-item__data-text {
        font-size: 14px;
        color: #5F5F5F;
        margin-right: -10px;
    }

    .data-item.data-item--standalone {
        width: 100%;
        cursor: pointer;
    }

    .main {
        padding: 20px 0;
        min-width: 1000px;
        max-width: 1500px;
        margin: 0 auto;
    }
</style>
