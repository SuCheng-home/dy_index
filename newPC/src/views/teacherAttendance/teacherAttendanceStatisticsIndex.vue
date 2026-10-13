<template>
    <div class="today_statistics_wrap">
        <div class="top_header">
            <el-row>
                <el-col :span="4">
                     <el-button @click="$router.back()" v-if="code==2" type="default" size="medium">返回</el-button>
                    <el-button type="primary" size="medium" @click.native="toAttendanceStatistics">考勤统计</el-button>
                </el-col>
                <el-col :span="16">
                    <div class="top_header_title">今日考勤</div>
                </el-col>
            </el-row>
        </div>
        <div class="today_statistics_card clearfix">
            <div class="today_statistics_item">
                <div class="item_title"><i class="el-icon-menu"></i>签到</div>
                <div class="sign_condition_wrap">
                    <div class="sign_text_line">
                        <div class="sign_text_item">正常</div>
                        <div class="sign_text_item"><span @click="toTodayAttendanceStatistics(3)">{{todayAttendanceList.signInNormalDay}}</span></div>
                    </div>
                    <div class="sign_text_line">
                        <div class="sign_text_item">迟到</div>
                        <div class="sign_text_item"><span @click="toTodayAttendanceStatistics(1)">{{todayAttendanceList.lateDay}}</span></div>
                    </div>
                    <div class="sign_text_line">
                        <div class="sign_text_item">未签</div>
                        <div class="sign_text_item"><span @click="toTodayAttendanceStatistics(4)">{{todayAttendanceList.signInAbsentDay}}</span></div>
                    </div>
                </div>
            </div>
            <div class="today_statistics_item">
                <div class="item_title"><i class="el-icon-menu"></i>签退</div>
                <div class="sign_condition_wrap">
                    <div class="sign_text_line">
                        <div class="sign_text_item">正常</div>
                        <div class="sign_text_item"><span @click="toTodayAttendanceStatistics(5)">{{todayAttendanceList.signOutNormalDay}}</span></div>
                    </div>
                    <div class="sign_text_line">
                        <div class="sign_text_item">早退</div>
                        <div class="sign_text_item"><span @click="toTodayAttendanceStatistics(2)">{{todayAttendanceList.leaveEarlyDay}}</span></div>
                    </div>
                    <div class="sign_text_line">
                        <div class="sign_text_item">未签</div>
                        <div class="sign_text_item"><span @click="toTodayAttendanceStatistics(6)">{{todayAttendanceList.signOutAbsentDay}}</span></div>
                    </div>
                </div>
            </div>
            <div class="today_statistics_item" >
                <div class="item_title"><i class="el-icon-menu"></i>请假</div>
                <div class="sign_condition_wrap">
                    <div :key="index" v-for="(item,index) in typeListArray">
                       <div class="sign_text_line"   v-if="item.peopleCount!=0">
                            <div class="sign_text_item">{{item.leaveTypeName}}</div>
                            <div class="sign_text_item">{{item.peopleCount}}</div>
                        </div>
                    </div>  
                     <div class="norecord" v-if="tatalPeopleCount==0">暂无请假记录</div> 
                </div>
                  
            </div>
        </div>
    </div>
</template>

<script>
    import {todayAttendanceAnalysis,getStatisticsTypeCount} from '@/api/schoolManage/teacherAttendanceStatistics';
    import moment from "moment";

    export default {
        name: "teacherAttendanceStatisticsIndex",
        data() {
            return {
                todayAttendanceList: {},
                typeListArray:[],
                tatalPeopleCount:'0',
                code:0
            }
        },
        created() {
            this.todayAttendanceAnalysis();
            this.getStatisticsTypeCounts();
            if((this.$route.query.code)&&(this.$route.query.code==2)){
                this.code=this.$route.query.code;
            }
        },
        methods: {
            getStatisticsTypeCounts(){
                 getStatisticsTypeCount(this.$moment().format("YYYY-MM-DD")).then(res => {
                     if(res.data.code==200){
                        this.typeListArray = res.data.data.typeListArray;
                        this.tatalPeopleCount = res.data.data.tatalPeopleCount;
                     }                    
                }).catch(() => {});
            },
            todayAttendanceAnalysis() {
                todayAttendanceAnalysis().then(res => {
                    const data = res.data;
                    if (data.code === 200) {
                        this.todayAttendanceList = data.data;
                    }
                }).catch(() => {});
            },
            toAttendanceStatistics() {
                this.$router.push({path: 'teacherAttendanceStatisticsList'});
            },
            toTodayAttendanceStatistics(type) {
                this.$router.push({path: 'teacherAttendanceStatisticsTodayList', query: {type: type}});
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
</style>
<style lang="scss" scoped>
    .today_statistics_wrap{
        height: 100%;
        padding:12px;
        .sign_condition_wrap{
            height: 180px;
            overflow: auto;
        }
         .norecord{
            font-size: 20px;
            text-align: center;
            color:#606266;
            line-height: 180px;
        }
        .top_header{
            padding-bottom: 10px;
            border-bottom: 1px solid #e7eaec;
            background: #fff;
            .top_header_title{
                height: 36px;
                line-height: 36px;
                text-align: center;
                font-weight: 700;
            }
        }
        .today_statistics_card{
            padding: 20px;
            .today_statistics_item{
                width: 450px;
                height: 240px;
                float: left;
                margin-top: 20px;
                margin-left: 60px;
                background-color: #ecf5ff;
                .item_title{
                    padding: 10px;
                    border-bottom: 1px solid #eee;
                    i{
                        color: #409EFF;
                        margin-right: 6px;
                        font-size: 16px;
                    }
                }
                .sign_condition_wrap{
                    .sign_text_line{
                        display: flex;
                        padding: 20px;
                        .sign_text_item{
                            flex: 1;
                            text-align: center;
                            span{
                                color: #409EFF;
                                cursor: pointer;
                            }
                        }
                    }
                }
            }
        }
    }
</style>
