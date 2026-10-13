<template>
    <div class="guide_day_wrap" style="padding:10px">
        <div class="guide_content_box">
            <div class="time_header">
                <!-- <el-button @click="$router.back()" type="default" size="medium">返回</el-button> -->
                <el-select v-model="schoolName" placeholder="请选择学期" @change="changeTeam" size="medium">
                    <el-option v-for="item in schoolYearList" :key="item.schoolTimeCode" :label="item.label"
                               :value="item.schoolTimeName">
                    </el-option>
                </el-select>
                <el-select v-model="selectWeek" placeholder="请选择周次" @change="changeWeek" size="medium">
                    <el-option v-for="item in weekList" :key="item.value" :label="item.label"
                               :value="item.value">
                    </el-option>
                </el-select>
                <el-button type="primary" v-if="guideGroupList.length" size="medium" @click="exportExcel('#outTable', '护导按周统计.xlsx')">导出
                </el-button>
            </div>

            <div class="guide_statistics_box">
                <el-table stripe :data="guideGroupList" border :height="maxH" id="outTable">
                    <el-table-column prop="guideName" label="护导岗" align="center"></el-table-column>
                    <el-table-column :label="`${weekDayItem.weekNamer}`"
                                     v-for="(weekDayItem, index) in weekDayNumList" align="center" :key="index">
                        <template slot-scope="scope">
                            <template
                                v-if="scope.row.timeNumRecords[index] && scope.row.timeNumRecords[index].managerUserId">
                                <div class="chose_teacher"
                                     @click="getWeekDayGuide(scope.row.timeNumRecords[index], scope.row.guideName, weekDayItem.weekNamer)">
                                    <div>
                                        <div>{{scope.row.timeNumRecords[index].managerUserName}}</div>
                                        <div>到({{scope.row.timeNumRecords[index].comeCount}})&nbsp;缺({{scope.row.timeNumRecords[index].absenceCount}})&nbsp;被替({{scope.row.timeNumRecords[index].postCount}})</div>
                                    </div>
                                </div>
                            </template>

                            <div class="no_chose_teacher" v-else>未安排护导员</div>

                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>
    </div>
</template>

<script>
    import windowResizeMixin from '@/mixins/windowResize';
    import baseMixin from '@/mixins/baseMixin';
    import {getSchoolTimeList} from '@/api/record';
    import {getSchoolGuideRemindSetInfo} from '@/api/systemSet/guide';
    import {getGuideStaticsDataByWeek, getGuideDayNoList,getSeveralWeekListBySchoolTimeIdContainHoliday} from '@/api/guide';

    export default {
        name: "guideStatisticsWeek",
        data() {
            return {
                guideType: 0,
                schoolName: '',
                schoolTimeCode: '',
                schoolYearList: [],
                selectWeek: null,
                weekList: [],
                weekNameList: ['一', '二', '三', '四', '五'],
                weekDayNumList: [],
                guideGroupList: []
            }
        },
        mixins: [windowResizeMixin, baseMixin],
        created() {
            if (window.sessionStorage.getItem('guideType') === '0' || window.sessionStorage.getItem('guideType') === '1') {
                this.guideType = Number(window.sessionStorage.getItem('guideType')) || 0;
            } else {
                this.getSchoolGuideRemindSetInfo();
            }
            this.getSchoolTimeList();
        },
        methods: {
            getSchoolGuideRemindSetInfo() {
                getSchoolGuideRemindSetInfo().then(res => {
                    let data = res.data.data;
                    if (res.data.code === 200) {
                        this.guideType = data.guideType;
                        window.sessionStorage.setItem('guideType', data.guideType);
                    }
                }).catch(() => {
                });
            },
            getWeekDayGuide(guideItem, guideName, weekNum) {
                this.$router.push({
                    path: 'guideStatisticsGuideInfo',
                    query: {
                        guideName: guideName,
                        guideType: this.guideType,
                        stationId: guideItem.stationId,
                        manageUserId: guideItem.managerUserId,
                        managerUserName: guideItem.managerUserName,
                        schoolTimeId: this.schoolTimeCode,
                        weekId: this.selectWeek,
                        weekNumber: guideItem.weekNumber,
                        weekName: weekNum
                    }
                });
            },
            // 学期
            getSchoolTimeList() {
                getSchoolTimeList().then(res => {
                    this.schoolYearList = res.data.data;
                    const self = this;
                    this.schoolYearList.forEach((item) => {
                        if (item.isCurrent === 1) {
                            self.schoolName = item.schoolTimeName;
                            self.schoolTimeCode = item.id;
                            this.getSeveralWeekListBySchoolTimeIdContainHoliday(item.id);
                        }
                    });
                }).catch();
            },
            changeTeam(val) {
                this.schoolName = val;
                this.schoolYearList.forEach((item) => {
                    if (item.schoolTimeName === val) {
                        this.schoolTimeCode = item.id;
                        this.getSeveralWeekListBySchoolTimeIdContainHoliday(item.id);
                    }
                });
            },
            // 周次
            getSeveralWeekListBySchoolTimeIdContainHoliday(schoolTimeId) {
                getSeveralWeekListBySchoolTimeIdContainHoliday(schoolTimeId).then((res) => {
                    const data = res.data.data;
                    if (res.data.code === 200) {
                        let mynum=0
                        for(let i=0;i<data.length;i++){
                            if(data[i].weekType==0){
                                mynum=data[i].week
                            }
                        }
                        this.weekList = data.map(item => {
                            return {
                                value: item.week,
                                label: (item.weekType==0?'第':item.weekType==1?"预":"加")+(item.weekType==0?item.week:item.weekType==1?(-item.week):item.week-mynum)+'周'
                            }
                        });
                        if (data.map(item => item.nowWeek).indexOf(1) > -1) {
                            this.selectWeek = data[data.map(item => item.nowWeek).indexOf(1)].week;
                        } else {
                            this.selectWeek = data[0].week;
                        }
                        this.getGuideStaticsDataByWeek();
                        this.getGuideDayNoList();
                    }
                }).catch(() => {
                });
            },
            changeWeek() {
                this.getGuideStaticsDataByWeek();
                this.getGuideDayNoList();
            },
            getGuideStaticsDataByWeek() {
                getGuideStaticsDataByWeek({
                    schoolTimeId: this.schoolTimeCode,
                    weekNo: this.selectWeek
                }).then(res => {
                    const data = res.data.data;
                    this.guideGroupList = [];
                    if (res.data.code === 200) {
                        data.forEach((item) => {
                            let newTimeRecord = [];
                            this.weekNameList.forEach((weekItem, weekIndex) => {
                                if (item.timeNumRecords.map(time => time.weekNumber).indexOf(weekIndex + 1) > -1) {
                                    newTimeRecord.push(item.timeNumRecords[item.timeNumRecords.map(time => time.weekNumber).indexOf(weekIndex + 1)])
                                } else {
                                    newTimeRecord.push({})
                                }
                            });
                            item.newTimeRecord = newTimeRecord;
                            this.guideGroupList.push(item);
                        });
                    }
                })
            },
            getGuideDayNoList() {
                getGuideDayNoList({
                    schoolTimeId: this.schoolTimeCode,
                    weekNo: this.selectWeek
                }).then(res => {
                    const data = res.data.data;
                    if (res.data.code === 200) {
                        this.weekDayNumList = data;
                    }
                })
            },
            getViewPic(picList) {
                if (picList) {
                    return picList.map((item) => {
                        return {'src': item.picUrl}
                    });
                }
                return [];
            }
        }
    }
</script>

<style lang="scss" scoped>
    .guide_day_wrap {
        .guide_content_box {
            .time_header {
                padding-bottom: 10px;
            }

            .guide_statistics_box {
                overflow-x: hidden;
                overflow-y: auto;

                .chose_teacher {
                    line-height: 25px;
                    color: #409eff;
                    cursor: pointer;
                }

                .no_chose_teacher {
                    line-height: 50px;
                    color: #F56C6C;
                }
            }
        }
    }
</style>
