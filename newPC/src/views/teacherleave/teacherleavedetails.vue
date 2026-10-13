<template>
    <div class="teacherleavedetails">
        <div class="top">
            <el-button @click="$router.back()" type="default" size="medium">返回</el-button>
        </div>
        <div class="subject " :style="`height: ${nobottommaxH}px;`">
            <div class="body">
                <el-form label-width="140px">
                    <div class="section-title">请假信息</div>
                    <div class="section section--leave">
                        <el-form-item label="请假人">
                            {{ teacherName }}
                        </el-form-item>
                        <el-form-item label="请假类型">
                            {{ leaveTypeName }}
                        </el-form-item>
                         
                        <el-form-item v-show="leaveType == 1 && sickTypeName" label="疾病类型">
                            {{ sickTypeName }}
                        </el-form-item>
                        <el-form-item label="请假开始日期">{{ time }}{{ '(' + weekDay + ')' }}{{ isClassHour == 0 ?
                            isMorningTxt : '' }}
                        </el-form-item>
                        <template v-if="isClassHour == 2">
                            <el-form-item label="请假开始时间">
                                {{ leaveStartTime }}
                            </el-form-item>
                            <el-form-item label="请假结束时间">
                                {{ leaveEndTime }}
                            </el-form-item>
                            <el-form-item label="请假时长（小时）">
                                {{ leaveCount }}
                            </el-form-item>
                        </template>
                        <el-form-item v-else label="请假时长">
                            <span v-html="leaveCount"></span>
                        </el-form-item>
                        <el-form-item label="是否由学校安排课务"  v-show="showAdjustable == 2">
                            <span>{{isAdjustable == 1 ? '否' : '是'}}</span>
                        </el-form-item>
                        <el-form-item label="工作安排"  v-if="adjustableRemark">
                            <span>{{adjustableRemark}}</span>
                        </el-form-item>
                        <div v-if="isDeductionOn">
                            <!-- <el-form-item  label="请假抵扣">
                                 {{leaveState==2?'已抵扣':'未抵扣'}}
                           </el-form-item> -->
                           <el-form-item  label="是否抵扣">
                                 <div v-show="isDeduction != 2">
                                   否
                                </div>
                                 <div v-show="isDeduction == 2">
                                    <div class="deduction-item" :key='index' v-for="(item,index) in deductionList">
                                        {{item.deductionName}}*{{item.sendNum}}张
                                    </div>
                                </div>
                           </el-form-item>    
                        </div>
                        

                        <el-form-item v-show="leaveState == 1" label="审批结果">
                            审批中
                        </el-form-item>
                        <el-form-item label="请假内容">
                            {{ content }}
                        </el-form-item>
                        <el-form-item v-show="askleavePhotoJson.length > 0" label="请假图片">
                            <image-previewer tag="richtext">
                                <img class="img" v-for="(photoItem, index) in askleavePhotoJson" :key="index"
                                     :src="photoItem"/>
                            </image-previewer>
                        </el-form-item>
                        <el-form-item v-show="leaveState == 4" label="销假时间">
                            {{ herTime | formatTimeFilter }}
                        </el-form-item>
                        <el-form-item v-show="leaveState == 4" label="销假内容">
                            {{ herContent }}
                        </el-form-item>
                        <el-form-item v-show="leaveState == 4 && askleaveHerPhotoJson.length > 0" label="销假图片">
                            <image-previewer tag="richtext">
                                <img class="img" v-for="(photoItem, index) in askleaveHerPhotoJson" :key="index"
                                     :src="photoItem"/>
                            </image-previewer>
                        </el-form-item>
                    </div>
                    <div class="section-title" v-if="batchTime">审批信息</div>
                    <div class="section section--batch" v-if="batchTime">
                        <el-form-item v-show="leaveState != 1" label="审批人">
                            {{ batchUserName }}
                        </el-form-item>
                        <el-form-item v-show="leaveState != 1" label="审批时间">
                            {{ batchTime | formatTimeFilter }}
                        </el-form-item>
                        <el-form-item label="审批结果">
                            <span v-if="leaveState == 2">{{ leaveStateName }}</span>
                            <span v-if="leaveState == 3">{{ leaveStateName }}</span>
                            <span v-if="leaveState == 4">通过</span>
                        </el-form-item>
                        <el-form-item v-show="leaveState != 1" label="审批意见">
                            {{ batchContent.length > 0 ? batchContent : '无' }}
                        </el-form-item>
                    </div>

                    <div class="section-title" v-if="stopFire === 2 && stopFireList && stopFireList.length">停伙情况</div>
                    <div class="section section--diet" v-if="stopFire === 2 && stopFireList && stopFireList.length">
                        <el-form-item label=""
                                      style="margin-left: -86px;">
                            <template v-for="item in stopFireList">
                                <div class="fire-item" v-if="item.state - 1 !== 0">{{ item.date }}&nbsp;&nbsp;&nbsp;&nbsp;{{
                                    ['停伙', '未停伙', '不供餐'][item.state - 1] || '' }}
                                </div>
                                <template v-else>
                                    <div v-for="item2 in item.fireList" class="fire-item">{{ item2.fireDate }}&nbsp;&nbsp;&nbsp;&nbsp;{{
                                        ['早餐', '午餐', '课间餐', '晚餐'][item2.mealType] || '' }}停伙
                                    </div>
                                </template>
                            </template>
                        </el-form-item>
                    </div>

                </el-form>
            </div>
        </div>
    </div>
</template>
<script>
    import {getTeacherAskleaveInfo, getFireAnalysisByUserIdAndDateRange,isOpenModule} from '@/api/teacherleave'
    import {getTeacherAskleaveInitInfo} from '@/api/systemSet/TeacherLeave3Set'
    import mixin from '@/mixins/windowResize'
    import ImagePreviewer from '@/components/ImagePreviewer/ImagePreviewer'

    export default {
        data() {
            return {
                weekDay: '',
                id: this.$route.query.id,
                teacherName: '',
                leaveTypeName: '',
                isAdjustable:1,
                sickTypeName: '',
                leaveType: '',
                time: '',
                isClassHour: '',
                isMorningTxt: '',
                classHourCount: '',
                endTime: '',
                startTime: '',
                leaveState: '',
                leaveStateName: '', //状态
                content: '',
                askleavePhotoJson: [],
                batchUserName: '',
                batchTime: '',
                batchContent: '',
                herTime: '',
                stopFire: '',
                stopFireList: [],
                herContent: '',
                askleaveHerPhotoJson: [],
                leaveCount: '',
                timeCount: '',

                timeLength: '',
                leaveStartTime: '',
                leaveEndTime: '',
                showAdjustable:1,
                 isDeductionOn: false,
                 isDeduction: 1,
                 deductionList: [],
                 adjustableRemark:''
            }
        },
        name: 'teacherleavedetails',
        components: {ImagePreviewer},
        mixins: [mixin],
        filters: {
            formatTimeFilter(date) {
                let time = date
                let option = ''
                if (time == '' || time == null) {
                    return ''
                }
                //time格式为 	2017-08-08 12:25:51.0
                time = time.substring(0, 19)
                time = time.replace(new RegExp('-', 'gm'), '/')
                const d = new Date(time)
                const now = Date.now()

                const diff = (now - d) / 1000

                if (diff < 30) {
                    return '刚刚'
                } else if (diff < 3600) {
                    // less 1 hour
                    return Math.ceil(diff / 60) + '分钟前'
                } else if (diff < 3600 * 24) {
                    return Math.ceil(diff / 3600) + '小时前'
                } else if (diff < 3600 * 24 * 2) {
                    return '1天前'
                }
                if (option) {
                    return parseTime(time, option)
                } else {
                    return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() + ' ' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds()
                }
            }
        },
        created() {
            this.getTeacherAskleaveInfos()
        },
        methods: {
            //获取详情
            getTeacherAskleaveInfos() {
                getTeacherAskleaveInitInfo()
                    .then(res => {
                        const infoData = res.data.data
                        if (res.data.code === 200) {
                            this.stopFire = infoData.showStopFire;
                            this.showAdjustable=infoData.showAdjustable;
                            this.isDeductionOn = infoData.isDeduction == 2;
                            getTeacherAskleaveInfo(this.id)
                                .then(res => res.data)
                                .then(data => {
                                    let mydata = data.data
                                      this.adjustableRemark=mydata.adjustableRemark
                                    this.teacherName = mydata.teacherName
                                    this.leaveTypeName = mydata.leaveTypeName
                                    this.isAdjustable=mydata.isAdjustable;
                                    this.sickTypeName = mydata.sickTypeName
                                    this.leaveType = mydata.leaveType
                                    this.time = mydata.startDate
                                     this.isDeduction = mydata.isDeduction;
                                      if(mydata.deductionJson) {
                                            this.deductionList = JSON.parse(mydata.deductionJson);
                                        }
                                    let weekDay = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
                                    this.weekDay = weekDay[new Date(mydata.startDate.replace(/\-/g, '/')).getDay()]
                                    this.classHourCount = mydata.classHourCount
                                    this.isClassHour = mydata.isClassHour
                                    this.startTime = this.$moment(mydata.startTime).format('HH:mm')
                                    this.endTime = this.$moment(mydata.endTime).format('HH:mm')
                                    this.leaveState = mydata.leaveState
                                    this.leaveStateName = mydata.leaveStateName
                                    this.batchTime = mydata.batchTime == null ? '' : mydata.batchTime
                                    this.askleavePhotoJson = mydata.askleavePhotoJson != null && mydata.askleavePhotoJson.length > 0 ? JSON.parse(mydata.askleavePhotoJson) : []
                                    this.batchUserName = mydata.batchUserName
                                    this.content = mydata.content
                                    this.batchContent = mydata.batchContent == null ? '' : mydata.batchContent
                                    this.herTime = mydata.herTime == null ? '' : mydata.herTime
                                    this.herContent = mydata.herContent
                                    this.askleaveHerPhotoJson = mydata.askleaveHerPhotoJson != null && mydata.askleaveHerPhotoJson.length > 0 ? JSON.parse(mydata.askleaveHerPhotoJson) : []
                                    this.timeCount = mydata.leaveDateCount
                                    if (mydata.isMorning == 0) {
                                        this.isMorningTxt = ' 上午'
                                    } else {
                                        this.isMorningTxt = ' 下午'
                                    }
                                    if (this.isClassHour == 0) {
                                        //如果按天请假
                                        this.leaveCount = this.timeCount + '天'
                                    } else if (this.isClassHour == 1) {
                                        this.leaveCount = `${this.classHourCount}节次<span class='time-small'>(${mydata.classHourName})</span>`
                                    } else if (this.isClassHour == 2) {
                                        this.timeTypeValue = 2;
                                        this.leaveStartTime = mydata.startTime.slice(11, 16);
                                        this.leaveEndTime = mydata.endTime.slice(11, 16);
                                        this.leaveCount = (mydata.timeLenth / 60).toFixed(2)-0;
                                    }

                                    if (this.stopFire === 2) {
                                        this.getFireAnalysisByUserIdAndDateRange(mydata.teacherId, mydata.startDate, mydata.endDate)
                                    }
                                })
                        }
                    })
                    .catch()
            },
            getFireAnalysisByUserIdAndDateRange(userId, startDate, endDate) {
                isOpenModule()
                .then(res => res.data)
                .then(newmydata => {
                    if(newmydata.data.isOpen){
                         getFireAnalysisByUserIdAndDateRange({
                    startDate: startDate,
                    endDate: endDate,
                    userId: userId,
                    myis:newmydata.data.isOpen
                })
                    .then(res => {
                        if (res.data.code === 200) {
                            this.stopFireList = res.data.data
                        }
                    })
                    .catch()
                        
                    }
                     
                    
                })
              isOpenModule(1225)
                .then(res => res.data)
                .then(newmydata => {
                    if(newmydata.data.isOpen){
                         getFireAnalysisByUserIdAndDateRange({
                    startDate: startDate,
                    endDate: endDate,
                    userId: userId,
                    myis:false
                })
                    .then(res => {
                        if (res.data.code === 200) {
                            this.stopFireList = res.data.data
                        }
                    })
                    .catch()
                        
                    }
                     
                    
                })
            }
        }
    }
</script>
<style lang="scss" scoped>
    .section-title {
        font-size: 18px;
        font-weight: bold;
        margin: 12px 0;
        padding-left: 6px;
        border-left: 3px solid #2F95FF;
    }
    .section {
        padding: 20px 0;
    }
    .section--leave {
        background-color: #EFFAFF;
    }
    .section--batch {
        background-color: #FFFFD8;
    }
    .section--diet {
        background-color: #CCFFFF;
    }
    .teacherleavedetails {
        padding: 12px;

        .top {
            border-bottom: 1px solid #e7eaec;
            padding-bottom: 10px;
        }

        .subject {
            padding-top: 10px;
            overflow: auto;

            .body {
                width: 810px;
                margin: 0 auto;

                .el-form-item {
                    margin-bottom: 0;

                    .img {
                        width: 80px;
                        height: 80px;
                        margin-right: 15px;
                    }
                }
            }
        }
    }
</style>
