<template>
    <div class="studentLeaveDetail" :studentLeaver="studentLeaver">
        <div class="leaveAddHeade">
            <div class="menu-tools">
                <el-button size="medium" @click="goBack">返回</el-button>
                <el-button type="primary" v-if="studentLeaver.leaveType !== 7&&studentLeaver.leaveType !== 8&&studentLeaver.leaveType !== 9&&studentLeaver.leaveType !== 10 && studentLeaver.isClassHour == 0 && isEdit" size="medium" @click="editFunc">提交</el-button>
            </div>
        </div>
        <div class="mainWrap" :style="`height:${nobottommaxH}px`">
            <div class="leaveAdd">
                <el-form ref="ruleForm" label-width="140px" class="demo-ruleForm">
                    <el-form-item label="请假人">
                        {{ studentLeaver.studentName }}
                    </el-form-item>
                    <el-form-item label="性别">
                        {{ ['--', '男', '女'][studentLeaver.gender] }}
                    </el-form-item>
                    <el-form-item label="手机号">
                        {{ studentLeaver.mobile || '--' }}
                    </el-form-item>
                    <el-form-item label="请假内容">
                        {{ studentLeaver.content }}
                    </el-form-item>
                    <el-form-item label="就读类型" v-if="isLiveRemind == 2&&studentLeaver.leaveType !== 8&&studentLeaver.leaveType !== 9&&studentLeaver.leaveType !== 10">
                        {{ ['', '走读', '住宿'][studentLeaver.liveType] }}
                    </el-form-item>
                    <el-form-item label="请假类型">
                        {{ studentLeaver.leaveTypeName }}
                    </el-form-item>
                    <el-form-item label="家长联系方式" v-if="studentLeaver.mobile">
                        {{ studentLeaver.mobile }}
                    </el-form-item>
                    <!-- <el-form-item label="是否停午餐伙" v-if="studentLeaver.stopFire==2">
                        停伙
                    </el-form-item>
                    <el-form-item label="是否停课间餐" v-if="studentLeaver.stopFireClassNum==2">
                        停伙
                    </el-form-item> -->
                    <el-form-item label="疾病类型" v-if="studentLeaver.sickTypeName">
                        {{ studentLeaver.sickTypeName }}
                    </el-form-item>
                    <el-form-item label="病假症状" v-if="studentLeaver.symptomJson">
                        {{ studentLeaver.symptomJson }}
                    </el-form-item>
                     <el-form-item label="最高体温（°C）" v-if="studentLeaver.temperature">
                          {{studentLeaver.temperature}}
                     </el-form-item>
                     <el-form-item label="24小时内几次（次）" v-if="studentLeaver.sickNum">
                            {{studentLeaver.sickNum}}
                     </el-form-item>
                    <el-form-item label="就医情况" v-if="studentLeaver.medicalType">
                        {{ studentLeaver.medicalType }}
                    </el-form-item>
                    <el-form-item label="就诊医院" v-if="studentLeaver.hospital">
                        {{ studentLeaver.hospital }}
                    </el-form-item>
                    <el-form-item label="开始时间" v-if="studentLeaver.leaveType !== 7&&studentLeaver.leaveType !== 8&&studentLeaver.leaveType !== 9&&studentLeaver.leaveType !== 10">{{ studentLeaver.startDate }}{{
                        getWeekDay(studentLeaver.startDate) }}&nbsp;&nbsp;{{ studentLeaver.isMorningName != '节次' ?
                        studentLeaver.isMorningName : '' }}
                    </el-form-item>
                    <el-form-item label="开始时间" v-if="studentLeaver.leaveType == 7||studentLeaver.leaveType !== 8||studentLeaver.leaveType !== 9||studentLeaver.leaveType !== 10">{{ studentLeaver.startDate }}{{
                        getWeekDay(studentLeaver.startDate) }}
                    </el-form-item>
                    <el-form-item label="请假时长" v-if="studentLeaver.leaveType !== 7&&studentLeaver.leaveType !== 8&&studentLeaver.leaveType !== 9&&studentLeaver.leaveType !== 10">
						<span v-if="studentLeaver.isClassHour == 0">
                            <span v-if="!isEdit">{{ studentLeaver.leaveDateCount }}天</span>
                            <el-input-number size="medium" v-else v-model="timeDuration" :min="0.5" step-strictly :step="0.5" :max="studentLeaver.leaveDateCount"
                                               label="请假时长"></el-input-number>
                        </span>
                        <span v-else>{{ studentLeaver.classHourCount }}节</span>
                    </el-form-item>
                    <el-form-item label="停伙情况" v-if="isShowStopFire && datelist.length">
                        <div v-for="(items, indexs) in datelist" :key="indexs">
                            {{ items.date }}
                            <span v-if="items.state == 1">
								<span v-for="(item, index) in items.fireList" :key="index">
									<span v-if="item.mealType == 0">
										早餐停伙
									</span>
									<span v-if="item.mealType == 1">
										午餐停伙
									</span>
									<span v-if="item.mealType == 2">
										课间餐停伙
									</span>
									<span v-if="item.mealType == 3">
										晚餐停伙
									</span>
								</span>
							</span>
                            <span v-if="items.state == 2">未停伙</span>
                            <span v-if="items.state == 3">不供餐</span>
                        </div>
                    </el-form-item>
                    <el-form-item label="请假附件"
                                  v-if="studentLeaver.askPhotoList && studentLeaver.askPhotoList.length > 0">
                        <image-previewer tag="richtext">
                            <div>
                                <img style="width: 100px!important;height: 100px;margin-right: 10px;"
                                     v-for="picItem in studentLeaver.askPhotoList"
                                     :src="picItem.fileUrl || picItem.accessUrl" :key="picItem.id"/>
                            </div>
                        </image-previewer>
                    </el-form-item>
                </el-form>
            </div>
        </div>
    </div>
</template>
<script>
    import mixin from '@/mixins/windowResize'
    import ImagePreviewer from '@/components/ImagePreviewer/ImagePreviewer.vue'
    import {getStuAskleaveInfo, getFireAnalysisByUserIdAndDateRange,isOpenModule, getStuAskleaveInitInfo, updateStuAskLeaveListByBatch} from '@/api/studentLeave'

    export default {
        components: {
            ImagePreviewer
        },
        data() {
            return {
                isEdit: this.$route.query.isEdit == 1,
                askId: this.$route.query.askId,
                startDate: this.$route.query.startDate,
                endDate: this.$route.query.endDate,
                studentLeaver: {},
                datelist: [],
                isShowStopFire: false,
                timeDuration: 0.5,
                isLiveRemind: 1
            }
        },
        created() {
            this.getStuAskleaveInfoFunc()
            getStuAskleaveInitInfo()
                .then(res => res.data)
                .then(data => {
                    this.isShowStopFire = data.data.showStopFire === 2
                    this.isLiveRemind = data.data.isLiveRemind;
                })
        },
        mixins: [mixin],
        computed: {
            getWeekDay() {
                return function (val) {
                    let weekDay = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
                    return '(' + weekDay[new Date(val.replace(/\-/g, '/')).getDay()] + ')'
                }
            }
        },
        methods: {
            goBack() {
                this.$router.push({
                    path: 'studentLeaveIndex',
                    query: {
                        startDate: this.startDate,
                        endDate: this.endDate
                    }
                })
            },
            getStuAskleaveInfoFunc() {
                getStuAskleaveInfo({
                    askId: this.askId
                })
                    .then(res => res.data)
                    .then(data => {
                        if (data.code === 200) {
                            this.studentLeaver = data.data;
                            this.timeDuration = data.data.leaveDateCount;
                            isOpenModule()
                .then(res => res.data)
                .then(newmydata => {
                    if(newmydata.data.isOpen){
                         getFireAnalysisByUserIdAndDateRange({
                                startDate: data.data.startDate,
                                userId: data.data.studentId,
                                endDate: data.data.endDate,
                                myis:newmydata.data.isOpen
                            })
                                .then(res => {
                                    let mydata = res.data.data
                                    this.datelist = mydata
                                })
                                .catch()
                        
                    }
                     
                })
                isOpenModule(1225)
                .then(res => res.data)
                .then(newmydata => {
                    if(newmydata.data.isOpen){
                         getFireAnalysisByUserIdAndDateRange({
                                startDate: data.data.startDate,
                                userId: data.data.studentId,
                                endDate: data.data.endDate,
                                myis:false
                            })
                                .then(res => {
                                    let mydata = res.data.data
                                    this.datelist = mydata                     
                                })
                                .catch()
                        
                    }
                     
                })
                          
                        }
                    })
            },
            editFunc() {
                const args = {
                    id: this.askId,
                    isClassHour: this.studentLeaver.isClassHour,
                    isMorning: this.studentLeaver.isMorning,
                    leaveType: this.studentLeaver.leaveType,
                    studentId: this.studentLeaver.studentId,
                };
                let startDate = '';
                let endDate = '';
                let classHourCount = 0
                let startTime = ""
                let endTime = ""
                let classHourName = ""
                startTime = ""
                startDate = this.studentLeaver.startDate;
                startTime = this.$moment(this.studentLeaver.startTime).format('YYYY-MM-DD HH:mm:ss');
                endTime = ""
                classHourName = ""
                if (this.leaveType == 7) {
                    args.leaveDateCount = 0;
                } else {
                    args.leaveDateCount = this.timeDuration
                }
                args.startDate = startDate;
                args.endDate = endDate;
                args.classHourName = classHourName;
                args.classHourCount = classHourCount;
                args.startTime = startTime;
                args.endTime = endTime;
                console.log(args);

                updateStuAskLeaveListByBatch(args)
                    .then(res => res.data)
                    .then(data => {
                        if (data.result) {
                            this.$message.success( "编辑成功！");
                            setTimeout(() => {
                                this.$router.back()
                            }, 500);
                        } else {
                            this.$message.error( data.msg);
                        }
                    })
            }

        }
    }
</script>
<style lang="scss" scoped>
    .studentLeaveDetail {
        padding: 12px;
        box-sizing: border-box;

        .header {
            margin-bottom: 10px;
            font-size: 14px;
        }

        .leaveAdd {
            width: 810px;
            margin: 0 auto;
            color: #333;
        }

        .leaveTime {
            display: flex;
        }

        .mainWrap {
            padding-top: 20px;
            overflow-x: hidden;
            overflow-y: auto;
        }
    }

    .menu-tools {
        border-bottom: 1px solid #e7eaec;
        padding-bottom: 10px;
    }
</style>
<style scoped>
    .studentLeaveDetail .el-form-item__label {
        font-weight: bold;
        color: #666;
        padding-right: 20px;
    }

    .studentLeaveDetail .el-form-item {
        margin-bottom: 0px;
    }
</style>
