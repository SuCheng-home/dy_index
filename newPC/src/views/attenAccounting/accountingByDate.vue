<template>
    <div class="today_statistics_wrap">
        <div class="top_header">
            <el-row>
                <el-col :span="20">
                    <!--                    <el-button @click="$router.back()" v-if="code==2" type="default" size="medium">返回</el-button>-->
                    <!--                    <el-button type="primary" size="medium" @click.native="toAttendanceStatistics">考勤统计</el-button>-->
                    <el-radio-group size="medium" v-model="active" @change="onTabChange">
                        <el-radio-button label="date">当日统计</el-radio-button>
                        <el-radio-button label="month">当月统计</el-radio-button>
                    </el-radio-group>                     
                    <el-date-picker
                        size="medium"
                        @change="getData"
                        format="yyyy-MM-dd"
                        value-format="yyyy-MM-dd"
                        v-model="date"
                        align="right"
                        type="date"
                        placeholder="选择日期"
                    >
                    </el-date-picker>
                    <el-button size="medium" class="filter-item" type="primary" @click="accountingByDateinfo()">出勤明细</el-button>
                </el-col>

            </el-row>
        </div>
        <div class="today_statistics_card clearfix">
            <div class="title">今日教师出勤</div>
            <div class="panel-contianer">
                <div class="panel-item panel-item--1">
                    <div class="item_title"><span class="color-band"></span>签到</div>
                    <div class="sign_condition_wrap">
                        <div class="sign_text_line">
                            <div class="sign_text_item">正常</div>
                            <div class="sign_text_item">
                                <span v-if="todayAttendanceList.signInNormalDay != 0" class="link" @click="toTodayAttendanceStatistics(3)">{{todayAttendanceList.signInNormalDay}}</span>
                                <span v-else>{{todayAttendanceList.signInNormalDay}}</span>
                            </div>
                        </div>
                        <div class="sign_text_line">
                            <div class="sign_text_item">迟到</div>
                            <div class="sign_text_item">
                                <span v-if="todayAttendanceList.lateDay != 0" class="link" @click="toTodayAttendanceStatistics(1)">{{todayAttendanceList.lateDay}}</span>
                                <span v-else>{{todayAttendanceList.lateDay}}</span>
                            </div>
                        </div>
                        <div class="sign_text_line">
                            <div class="sign_text_item">未签</div>
                            <div class="sign_text_item">
                                <span v-if="todayAttendanceList.signInAbsentDay != 0" class="link" @click="toTodayAttendanceStatistics(4)">{{todayAttendanceList.signInAbsentDay}}</span>
                                <span v-else>{{todayAttendanceList.signInAbsentDay}}</span>
                            </div>
                        </div>
                        <div class="sign_text_line">
                            <div class="sign_text_item">请假</div>
                            <div class="sign_text_item">
                                <span v-if="todayAttendanceList.signInAskLeaveDay != 0" class="link" @click="toLeavePage()">{{todayAttendanceList.signInAskLeaveDay}}</span>
                                <span v-else>{{todayAttendanceList.signInAskLeaveDay}}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="panel-contianer">
                <div class="panel-item panel-item--2">
                    <div class="item_title"><span class="color-band"></span>签退</div>
                    <div class="sign_condition_wrap">
                        <div class="sign_text_line">
                            <div class="sign_text_item">正常</div>
                            <div class="sign_text_item">
                                <span v-if="todayAttendanceList.signOutNormalDay != 0" class="link" @click="toTodayAttendanceStatistics(5)">{{todayAttendanceList.signOutNormalDay}}</span>
                                <span v-else>{{todayAttendanceList.signOutNormalDay}}</span>
                            </div>
                        </div>
                        <div class="sign_text_line">
                            <div class="sign_text_item">早退</div>
                            <div class="sign_text_item">
                                <span v-if="todayAttendanceList.leaveEarlyDay != 0" class="link" @click="toTodayAttendanceStatistics(2)">{{todayAttendanceList.leaveEarlyDay}}</span>
                                <span v-else>{{todayAttendanceList.leaveEarlyDay}}</span>
                            </div>
                        </div>
                        <div class="sign_text_line">
                            <div class="sign_text_item">未签</div>
                            <div class="sign_text_item">
                                <span v-if="todayAttendanceList.signOutAbsentDay != 0" class="link" @click="toTodayAttendanceStatistics(6)">{{todayAttendanceList.signOutAbsentDay}}</span>
                                <span v-else>{{todayAttendanceList.signOutAbsentDay}}</span>
                            </div>
                        </div>
                        <div class="sign_text_line">
                            <div class="sign_text_item">请假</div>
                            <div class="sign_text_item">
                                <span v-if="todayAttendanceList.signOutAskLeaveDay != 0" class="link" @click="toLeavePage()">{{todayAttendanceList.signOutAskLeaveDay}}</span>
                                <span v-else>{{todayAttendanceList.signOutAskLeaveDay}}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="panel-contianer">
                <div class="panel-item panel-item--3">
                    <div class="item_title"><span class="color-band"></span>请假</div>
                    <div class="sign_condition_wrap">
                        <div :key="index" v-for="(item,index) in typeListArray">
                            <div class="sign_text_line" v-if="item.peopleCount!=0">
                                <div class="sign_text_item">{{item.leaveTypeName}}</div>
                                <div class="sign_text_item">
                                    <span @click="toLeavePage(item.leaveTypeId)">{{item.peopleCount}}</span>
                                </div>
                            </div>
                        </div>
                        <div class="norecord" v-if="tatalPeopleCount==0">暂无请假记录</div>
                    </div>

                </div>
            </div>
            <div class="panel-contianer">
                <div class="panel-item panel-item--4">
                    <div class="item_title"><span class="color-band"></span>外出</div>
                    <div class="sign_condition_wrap">
                        <div>
                            <div class="sign_text_line" style="margin-top: 48px;">
                                <div class="sign_text_item">外出</div>
                                <div class="sign_text_item">
                                    <span v-if="outCount != 0" class="link" @click="jumpToPage('outApplyStatistics/outApplyList', {startDate: date, endDate: date})">{{outCount}}</span>
                                    <span v-else>{{outCount}}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
            <div class="panel-contianer">
                <div class="panel-item panel-item--5">
                    <div class="item_title"><span class="color-band"></span>加班</div>
                    <div class="sign_condition_wrap">
                        <div>
                            <div class="sign_text_line" style="margin-top: 48px;">
                                <div class="sign_text_item">加班</div>
                                <div class="sign_text_item">
                                    <span v-if="extraCount != 0" class="link" @click="jumpToPage('extraWork/extraWorklistone', {startDate: date, endDate: date})">{{extraCount}}</span>
                                    <span v-else>{{extraCount}}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
             <div class="panel-contianer">
                <div class="panel-item panel-item--3"  style="height: 180px;">
                    <div class="item_title"><span class="color-band"></span>异常</div>
                    <div class="sign_condition_wrap">
                        <div>
                            <div class="sign_text_line" style="margin-top: 48px;">
                                <div class="sign_text_item">异常</div>
                                <div class="sign_text_item">
                                    <span v-if="newextraCount != 0" class="link" @click="jumpToPage('abnormal', {startDate: date, endDate: date,type:1})">{{newextraCount}}</span>
                                    <span v-else>{{newextraCount}}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

        </div>
    </div>
</template>

<script>
    import {isShowByPermission} from '@/utils';

    import {
        todayAttendanceAnalysis,
        getStatisticsTypeCount,
        getOutApplyCount,
        getExtraUserCountBySchoolIdAndDateRange,getGateInfoExceptionCount
    } from '@/api/schoolManage/teacherAttendanceStatistics';
    import moment from "moment";

    export default {
        name: "teacherAttendanceStatisticsIndex",
        data() {
            return {
                todayAttendanceList: {},
                typeListArray: [],
                tatalPeopleCount: '0',
                code: 0,
                active: 'date',
                date: moment().format('YYYY-MM-DD'),
                outCount: 0,
                extraCount: 0,
                extraCount:0,
                newextraCount:0
            }
        },
        created() {
            this.getData();

            if ((this.$route.query.code) && (this.$route.query.code == 2)) {
                this.code = this.$route.query.code;
            }
        },
        methods: {
            toLeavePage(leaveType) {
                if(isShowByPermission('/thAskLeaveFour/getStatisticsList')) {
                    this.jumpToPage('teacherLeave4/leaveTable', {startDate: this.date, endDate: this.date, leaveType})
                } else {
                    this.jumpToPage('teacherleave/teacherleavelist', {startDate: this.date, endDate: this.date, leaveType})
                }
            },
            accountingByDateinfo(){
               this.jumpToPage('accountingByDateinfo');
            },
            onTabChange() {
                if (this.active === 'month') {
                    this.jumpToPage('accountingByMonth');
                }
            },
            jumpToPage(path, query = {}) {
                this.$router.push({
                    path,
                    query
                })
            },
            getData() {
                this.todayAttendanceAnalysis();
                this.getStatisticsTypeCounts();
                this.getOutApplyCount();
                this.getExtraUserCountBySchoolIdAndDateRange();
                this.getGateInfoExceptionCount()
            },
            getStatisticsTypeCounts() {
                getStatisticsTypeCount(this.date).then(res => {
                    if (res.data.code == 200) {
                        this.typeListArray = res.data.data.typeListArray;
                        this.tatalPeopleCount = res.data.data.tatalPeopleCount;
                    }
                }).catch(() => {
                });
            },
            getGateInfoExceptionCount() {
                getGateInfoExceptionCount({
                    startDate: this.date,
                    endDate: this.date
                })
                    .then(res => res.data)
                    .then(data => {
                        this.newextraCount = data.data;
                    })
            },
            getExtraUserCountBySchoolIdAndDateRange() {
                getExtraUserCountBySchoolIdAndDateRange({
                    startDate: this.date,
                    endDate: this.date
                })
                    .then(res => res.data)
                    .then(data => {
                        this.extraCount = data.data;
                    })
            },
            todayAttendanceAnalysis() {
                todayAttendanceAnalysis({
                    date: this.date
                }).then(res => {
                    const data = res.data;
                    if (data.code === 200) {
                        this.todayAttendanceList = data.data;
                    }
                }).catch(() => {
                });
            },
            getOutApplyCount() {
                getOutApplyCount({
                    startDate: this.date,
                    endDate: this.date
                })
                    .then(res => res.data)
                    .then(data => {
                        this.outCount = data.data;
                    })
            },
            toAttendanceStatistics() {
                this.$router.push({path: 'teacherAttendanceStatisticsList'});
            },
            toTodayAttendanceStatistics(type) {
                this.$router.push({path: 'teacherAttendanceStatisticsTodayList', query: {type: type, date: this.date}});
            }
        }
    }
</script>

<style scoped>
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

    .color-band {
        border-left: 3px solid #fff;
        margin-right: 10px;
    }
</style>
<style lang="scss" scoped>
    .title {
        color: rgba(55, 96, 141, 1);
        font-size: 26px;
        font-weight: bold;
        text-align: center;
        margin-bottom: 10px;
    }

    .today_statistics_wrap {
        height: 100%;
        padding: 12px;
        overflow-x: auto;

        .sign_condition_wrap {
            height: 180px;
            overflow: hidden;
            font-size: 20px;
        }

        .norecord {
            font-size: 20px;
            text-align: center;
            color: #606266;
            line-height: 180px;
        }

        .top_header {
            padding-bottom: 10px;
            border-bottom: 1px solid #e7eaec;
            background: #fff;
        }

        .today_statistics_card {
            padding: 20px 0;
            min-width: 1000px;
            max-width: 1300px;
            margin: 0 auto;

            .panel-contianer {
                width: 33.3%;
                margin-bottom: 20px;
                float: left;
            }

            .panel-item {
                width: 330px;
                height: 220px;
                margin: 0 auto;
                color: #fff;
                font-weight: bold;
                box-sizing: border-box;
                padding: 0 20px;
                border-radius: 10px;

                &.panel-item--1 {
                    background: no-repeat center center / cover url(https://cdnfile-10043692.file.myqcloud.com/admin/images/attenAccounting/panel_1.png);
                }

                &.panel-item--2 {
                    background: no-repeat center center / cover url(https://cdnfile-10043692.file.myqcloud.com/admin/images/attenAccounting/panel_2.png);
                }

                &.panel-item--3 {
                    background: no-repeat center center / cover url(https://cdnfile-10043692.file.myqcloud.com/admin/images/attenAccounting/panel_3.png);
                }

                &.panel-item--4 {
                    background: no-repeat center center / cover url(https://cdnfile-10043692.file.myqcloud.com/admin/images/attenAccounting/panel_4.png);
                    height: 180px;
                }

                &.panel-item--5 {
                    background: no-repeat center center / cover url(https://cdnfile-10043692.file.myqcloud.com/admin/images/attenAccounting/panel_5.png);
                    height: 180px;
                }

                .item_title {
                    padding: 10px 10px 10px 0;
                    border-bottom: 1px solid #eee;
                }

                .sign_condition_wrap {
                    padding-top: 2px;

                    .sign_text_line {
                        display: flex;
                        padding: 10px;

                        .sign_text_item {
                            flex: 1;
                            text-align: center;

                            span.link {
                                font-weight: bold;
                                color: #fff;
                            }
                            .link {
                                cursor: pointer;
                            }
                        }
                    }
                }
            }
        }
    }
</style>
