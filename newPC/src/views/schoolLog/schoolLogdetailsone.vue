<template>
    <div class="schoolLogdetails">
        <el-tabs type="border-card" v-model="activeName" @tab-click="campusCrdindex()">
            <el-tab-pane label="校务日志" name="one">
                <div class="top">
                    <el-button @click="$router.back()" type="default" size="medium">返回</el-button>
                    <el-button type="primary" size="medium" v-if="isNeedSend&&state==1" @click="publishSchoolLogs()">
                        发布
                    </el-button>
                    <el-button type="primary" size="medium" @click="printStatistics">打印</el-button>
                </div>
                <div class="content" :style="`height:${maxH-30}px`" ref="print">
                    <div class="ul">
                        <div class="h3">{{query.recordDate}}&nbsp;&nbsp;&nbsp;&nbsp;{{query.recordWeek}}&nbsp;&nbsp;&nbsp;&nbsp;<span
                            v-if="schoolType==1">园务日志</span> <span v-else>校务日志</span></div>
                        <div class="time"><span>{{query.departName || createName}}&nbsp;&nbsp;&nbsp;&nbsp;</span>{{query.createTime.split(".")[0]}}
                        </div>
                        <div v-if="isAddAttendanceData">
                            <div class="li">
                                <span class="name">教职工&nbsp;&nbsp;&nbsp;&nbsp;</span>共出勤 {{inputobj.teacherWorkNum}} 人
                                共请假 {{inputobj.teacherLeaveNum}} 人
                            </div>
                            <div class="li">
                                <span class="name">教职工请假明细&nbsp;&nbsp;&nbsp;&nbsp;</span>
                                <span v-for="(item,index) in inputobj.teacherleaveList" :key="index">
                                {{item.leaveTypeName}}：{{item.peopleCount}} 人&nbsp;&nbsp;&nbsp;&nbsp;
                            </span>
                            </div>
                            <div class="li">
                                <span class="name">学生&nbsp;&nbsp;&nbsp;&nbsp;</span>共出勤 {{inputobj.studentWorkNum}} 人
                                共请假 {{inputobj.studentLeaveNum}} 人
                            </div>
                            <div class="li">
                                <span class="name">学生请假明细&nbsp;&nbsp;&nbsp;&nbsp;</span>
                                <span v-for="(item,index) in inputobj.studentleaveList" :key="index">
                               {{item.leaveTypeName}}：{{item.peopleCount}} 人&nbsp;&nbsp;&nbsp;&nbsp;
                            </span>
                            </div>
                        </div>
                        <div class="li" v-if="query.content">
                            <span class="name">日志内容&nbsp;&nbsp;&nbsp;&nbsp;</span>
                            <image-previewer tag="richtext">
                                <span v-html="query.content"></span>
                            </image-previewer>
                        </div>
                        <div class="li" v-if="fileJson&&fileJson.length!==0">
                            <span class="name">附件&nbsp;&nbsp;&nbsp;&nbsp;</span>
                            <file-list :fileList="fileJson"></file-list>
                        </div>
                        <div class="li" v-if="picsJson&&picsJson.length!==0">
                            <span class="name">图片&nbsp;&nbsp;&nbsp;&nbsp;</span>
                            <image-previewer tag="richtext">
                               <img :src="item" style="width:60px;height: 60px;margin-right: 10px;" alt="" :key="index" v-for="(item, index) in picsJson">
                            </image-previewer> 
                        </div>
                        <div class="li" v-if="state==2&&isOpenForTeacher==1">
                            <span class="name">阅读情况&nbsp;&nbsp;&nbsp;&nbsp;</span>
                            <el-button size="medium" :disabled="!readCount" type="text" @click="schoolLogReadlist()">
                                已读：{{readCount}}
                            </el-button>&nbsp;&nbsp;&nbsp;&nbsp;
                            <el-button size="medium" :disabled="!notReadCount" type="text"
                                       @click="schoolLogUnreadlist()">未读：{{notReadCount}}
                            </el-button>
                        </div>
                    </div>
                </div>
            </el-tab-pane>
            <el-tab-pane label="检查数据" name="two" v-if="isAddCheckData"></el-tab-pane>
            <el-tab-pane label="外出日程" name="three" v-if="isAddCalendarData"></el-tab-pane>
        </el-tabs>

    </div>
</template>
<script>
    import windowResize from "@/mixins/windowResize";
    import ImagePreviewer from '@/components/ImagePreviewer/ImagePreviewer.vue';
    import {publishSchoolLog, getSchoolLogDetail, getReadAndNotReadByLogId} from '@/api/schoolLog';
    import FileList from '@/components/FileList/FileList.vue';
    export default {
        components: {ImagePreviewer,FileList},
        data() {
            return {
                activeName: 'one',
                schoolType: '',
                id: this.$route.query.id,
                isAddAttendanceData: false,//	是否添加考勤数据 1添加 2不添加	number	@mock=1
                isAddCalendarData: false,	//是否添加日程数据 1添加 2不添加	number	@mock=1
                isAddCheckData: false,	//是否添加检查数据 1添加 2不添加	number	@mock=1
                isNeedSend: false,	//是否需要发送 1需要 2不需要	number	@mock=1
                state: 2,
                inputobj: {
                    studentLeaveNum: 0,	//	学生请假总人数	number	@mock=0
                    studentWorkNum: 0,	//	学生出勤数 默认学生总数-请假人数	number	@mock=3759
                    studentleaveList: [],	//	学生请假明细 List
                    teacherLeaveNum: 0,	//	老师请假总人数	number	@mock=0
                    teacherWorkNum: 0,	//	老师出勤数 默认教职工总人数-请假人数	number	@mock=42
                    teacherleaveList: [],	//	老师请假明细 List
                },
                query: {
                    content: '',	//	内容	string	@mock=<p>内容11</p>
                    createTime: '',	//	创建时间	string	@mock=2019-11-25 10:46:18
                    departName: '',	//	落款部门名称	string	@mock=
                    recordDate: '',	//	记录日期	string	@mock=2019-11-25
                },
                createName: '',
                fileJson: [],
                isOpenForTeacher: 2,
                notReadCount: 0,
                readCount: 0,
                picsJson:[]
            }
        },
        mixins: [windowResize],
        created() {
            this.getSchoolLogDetails();
            this.getReadAndNotReadByLogIds();
        },
        methods: {
            getReadAndNotReadByLogIds() {
                getReadAndNotReadByLogId(this.id).then(res => {
                    if (res.data.code === 200) {
                        let mydata = res.data.data;
                        this.readCount = mydata.readCount;
                        this.notReadCount = mydata.notReadCount;
                    }
                    ;
                }).catch(err => {
                });
            },
            //打印
            printStatistics() {
                this.$print(this.$refs.print);
            },
            //获取详情
            getSchoolLogDetails() {
                getSchoolLogDetail(this.id).then(res => {
                    if (res.data.code === 200) {
                        let mydata = res.data.data.schoolLog;
                        this.schoolType = res.data.data.schoolType;
                        this.picsJson= mydata.picsJson?JSON.parse(mydata.picsJson):[];
                        this.inputobj.studentLeaveNum = mydata.studentLeaveNum;
                        this.inputobj.studentWorkNum = mydata.studentWorkNum;
                        this.inputobj.studentleaveList = mydata.studentleaveList;
                        this.inputobj.teacherLeaveNum = mydata.teacherLeaveNum;
                        this.inputobj.teacherWorkNum = mydata.teacherWorkNum;
                        this.inputobj.teacherleaveList = mydata.teacherleaveList;
                        this.query.content = mydata.content;
                        this.query.createTime = mydata.createTime;
                        this.query.recordDate = mydata.recordDate;
                        this.query.recordWeek = mydata.recordWeek;
                        this.createName = mydata.createName;
                        this.isOpenForTeacher = mydata.isOpenForTeacher;
                        if (mydata.inscribe == 2) {
                            this.query.departName = mydata.departName;
                        }
                        this.state = mydata.state;
                        if (mydata.isAddAttendanceData == 1) {
                            this.isAddAttendanceData = true;
                        }
                        if (mydata.isAddCalendarData == 1) {
                            this.isAddCalendarData = true;
                        }
                        if (mydata.isAddCheckData == 1) {
                            this.isAddCheckData = true;
                        }
                        ;
                        if (mydata.isNeedSend == 1) {
                            this.isNeedSend = true;
                        }
                        ;
                        this.fileJson = mydata.filesJson ? JSON.parse(mydata.filesJson) : [];
                    }
                    ;
                }).catch(err => {
                });
            },
            //发布
            publishSchoolLogs() {
                this.$confirm('是否发布此日志', '发布', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    publishSchoolLog(this.id).then(res => res.data).then(data => {
                        if (data.result) {
                            let _this = this;
                            this.$message({
                                message: '发布成功！',
                                type: 'success',
                                duration: 1000,
                                onClose: function () {
                                    _this.$router.back();
                                }
                            });
                        }
                    })
                });
            },
            campusCrdindex() {
                if (this.activeName == 'two') {
                    this.schoolLogdetailstwo()
                }
                if (this.activeName == 'three') {
                    this.schoolLogdetailsthree()
                }
            },
            //检查数据
            schoolLogdetailstwo() {
                this.$router.replace({
                    path: 'schoolLogdetailstwo',
                    query: {id: this.id}
                });
            },
            //已读
            schoolLogReadlist() {
                this.$router.push({
                    path: 'schoolLogReadlist',
                    query: {id: this.id}
                });
            },
            //未读
            schoolLogUnreadlist() {
                this.$router.push({
                    path: 'schoolLogUnreadlist',
                    query: {id: this.id}
                });
            },
            //外出日程
            schoolLogdetailsthree() {
                this.$router.replace({
                    path: 'schoolLogdetailsthree',
                    query: {id: this.id}
                });
            }

        },
    }
</script>
<style lang="scss" scoped>
    .schoolLogdetails {
        padding: 12px;

        .top {
            * {
                box-sizing: border-box;
                overflow: hidden;
            }

            padding: 0 0 10px 0;
            border-bottom: 1px solid #e7eaec;

            .button {
                margin-bottom: 20px;
                width: 100%;
                margin: 10px auto;
                overflow: hidden;
                margin-top: 0;

                p {
                    padding: 0;
                    margin: 0;
                }

                span {
                    color: #222;
                    width: 33%;
                    padding: 10px 0;
                    font-size: 14px;
                    line-height: 16px;
                    text-align: center;
                    border: 1px #ddd solid;
                    float: left;
                    cursor: pointer;
                }

                .left {
                    border-radius: 5px 0 0 5px;
                }

                .right {
                    border-radius: 0 5px 5px 0;
                }

                .color {
                    color: #fff;
                    background-color: #409eff;
                    border-color: #409eff;
                }

            }
        }

        .content {
            overflow: auto;
            padding-top: 20px;

            .ul {
                width: 810px;
                margin: 0 auto;
            }

            .time {
                text-align: right;
                color: #888;
                font-size: 12px;
                line-height: 12px;
                padding-bottom: 20px;
                padding: 10px 32%;
            }

            .h3 {
                text-align: center;
                font-size: 24px;
                line-height: 50px;
            }

            .li {
                overflow: hidden;
                position: relative;
                padding: 0px 0 0px 150px;
                min-height: 40px;
                color: #999;
                line-height: 40px;
                margin: 10px 0;

                .name {
                    position: absolute;
                    line-height: 40px;
                    color: #222;
                    font-size: 14px;
                    width: 140px;
                    text-align: right;
                    left: 0;
                    top: 0px;
                }

                .li-input {
                    float: left;
                    width: 200px;
                }
            }
        }
    }
</style>
