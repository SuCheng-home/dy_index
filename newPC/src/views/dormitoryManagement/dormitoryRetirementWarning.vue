<template>
    <div class="retire_warn_setting_wrap">
        <div class="header">
            <el-button @click="goBack" size="medium">返回</el-button>
            <el-button type="primary" @click.native="saveReadClockInSet" size="medium">保存</el-button>
        </div>
        <div class="retire_content_box" :style="`height: ${boxH - 101}px;`">
            <el-form label-width="140px" class="demo-ruleForm">
                <el-form-item>
                    <div class="retire_warn_box">
                        <el-checkbox v-model="isRetirement">
                            <span class="is_warn_btn">归寝预警</span>
                        </el-checkbox>
                    </div>

                    <div v-show="isRetirement">
                        <div class="top_title">推送规则</div>
                        <div class="check_box_wrap">
                            <el-checkbox-group v-model="selectDay">
                                <el-checkbox :label="item.id" :key="index" v-for="(item, index) in weekDayList">{{item.name}}</el-checkbox>
                            </el-checkbox-group>
                        </div>
                        <div class="check_box_wrap">
                            <div class="grade_time_line" :key="index" v-for="(item, index) in gradeList">
                                {{item.gradeName}}
                                <el-time-picker v-model="item.warnTime" placeholder="选择时间" format="HH:mm" :clearable="false" class="grade_push_time"></el-time-picker>
                                推送尚未归寝人员名单
                            </div>
                        </div>

                        <div class="top_title">推送人员</div>
                        <div class="check_box_wrap">
                            <el-checkbox-group v-model="checkPushList">
                                <el-checkbox :label="1">楼宇负责人</el-checkbox>
                                <el-checkbox :label="2">班主任</el-checkbox>
                                <el-checkbox :label="3">家长</el-checkbox>
                                <el-checkbox :label="4">其他人员</el-checkbox>
                            </el-checkbox-group>
                        </div>
                        <div class="address_config_box" v-show="isPushOther">
                            其他人员：<address-book v-model="pushOtherData" :config="pushOtherConfigData"></address-book>
                        </div>
                    </div>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
    import mixins from '@/mixins/windowResize';
    import moment from "moment";
    import AddressBook from '@/components/AddressBook/indexExpand';
    import { listGradeBySchoolType } from '@/api/systemSet/readPunchClockSet';
    import { getSchoolDormWarnSetInfo, saveDormWarnSet } from '@/api/dormitoryManage';

    export default {
        name: 'dormitoryRetirementWarning',
        components: {
            AddressBook
        },
        data() {
            return {
                isRetirement: false,
                isPushOther: false,
                pushOtherData: {
                    userJson: []
                },
                pushOtherConfigData: {
                    title: '选择人员',
                    depart: {target: 'user', departType: 'all', userTypes: '1,2,3,5,6'},
                    group: true
                },
                selectDay: [],
                weekDayList: [
                    {
                        id: 1,
                        name: '周一'
                    },
                    {
                        id: 2,
                        name: '周二'
                    },
                    {
                        id: 3,
                        name: '周三'
                    },
                    {
                        id: 4,
                        name: '周四'
                    },
                    {
                        id: 5,
                        name: '周五'
                    },
                    {
                        id: 6,
                        name: '周六'
                    },
                    {
                        id: 7,
                        name: '周日'
                    }
                ],
                selectGrade: [],
                gradeList: [],
                checkPushList: []
            };
        },
        mixins: [mixins],
        watch: {
            checkPushList(list) {
                if (!!list.length && list.indexOf(4) > -1) {
                    this.isPushOther = true;
                } else {
                    this.isPushOther = false;
                }
            }
        },
        created() {
            this.getSchoolDormWarnSetInfo();
        },
        methods: {
            goBack() {
                this.$router.back();
            },
            // 预警详情
            getSchoolDormWarnSetInfo() {
                getSchoolDormWarnSetInfo().then(res => {
                    const data = res.data.data;
                    if (res.data.code === 200 && data.id && !!data.warnTimeList.length) {
                        this.isRetirement = !!data.isWarn;
                        this.selectDay = data.sendWeek.split(',').map(item => parseInt(item));
                        this.checkPushList = data.sendUserTypes.split(',').map(item => parseInt(item));
                        this.pushOtherData = {
                            userJson: data.sendOtherUsers ? JSON.parse(data.sendOtherUsers) : []
                        };
                        let newGradeArray = [];
                        data.warnTimeList.forEach((item) => {
                            newGradeArray.push({
                                warnTime: moment('2019-11-11 ' + item.warnTime + ':00').format("YYYY-MM-DD HH:mm:ss"),
                                gradeLevel: item.gradeLevel,
                                gradeName: item.gradeName
                            });
                        });
                        this.gradeList = newGradeArray.sort(this.sortGradeNumber);
                    } else {
                        let schoolType = this.$store.getters.schoolInfo.type;
                        this.listGradeBySchoolType(schoolType);
                    }
                }).catch();
            },
            sortGradeNumber(x,y){
                return x.gradeLevel-y.gradeLevel
            },
            listGradeBySchoolType(type) {
                listGradeBySchoolType(type).then(res => {
                    let data = res.data.data;
                    if (res.data.code === 200) {
                        data.forEach((item) => {
                            this.gradeList.push({
                                warnTime: '2019-11-11 22:00:00',
                                gradeLevel: item.level,
                                gradeName: item.name
                            });
                        });
                    }
                }).catch();
            },
            saveReadClockInSet() {
                if (this.isRetirement && !this.selectDay.length) {
                    this.$message({
                        message: '请选择周次！',
                        type: 'warning'
                    });
                    return;
                }
                let canSave = true;
                if (this.isRetirement) {
                    this.gradeList.forEach((item) => {
                        if (!item.warnTime) {
                            canSave = false;
                        }
                    });
                }
                if (!canSave) {
                    this.$message({
                        message: '请将时间补充完整！',
                        type: 'warning'
                    });
                    return;
                }
                if (this.isRetirement && !this.checkPushList.length) {
                    this.$message({
                        message: '请选择推送人员！',
                        type: 'warning'
                    });
                    return;
                }
                if (this.isRetirement && this.checkPushList.indexOf(4) > -1 && !this.pushOtherData.userJson.length) {
                    this.$message({
                        message: '请选择其他人员！',
                        type: 'warning'
                    });
                    return;
                }

                let query = {
                    isWarn: 0,
                    sendOtherUsers: '',
                    sendUserTypes: '',
                    sendWeek: '',
                    warnTimeJson: '',
                };
                if (this.isRetirement) {
                    let warnTimeArray = [];
                    this.gradeList.forEach((item) => {
                        warnTimeArray.push({
                            warnTime: this.getHourMinuteStr(item.warnTime),
                            gradeLevel: item.gradeLevel,
                            gradeName: item.gradeName
                        })
                    });
                    query.isWarn = 1;
                    if (this.isPushOther) {
                        query.sendOtherUsers = JSON.stringify(this.pushOtherData.userJson);
                    }
                    query.sendUserTypes = this.checkPushList.toString();
                    query.sendWeek = this.selectDay.toString();
                    query.warnTimeJson = JSON.stringify(warnTimeArray);
                }

                saveDormWarnSet(query).then(res => {
                    let data = res.data;
                    if (data.code === 200) {
                        this.$message({
                            message: '设置成功！',
                            type: 'success'
                        });
                        this.$router.back();
                    } else {
                        this.$message({
                            message: data.msg,
                            type: 'warning'
                        });
                    }
                }).catch();
            },
            getHourMinuteStr(n) {
                const data = new Date(n);
                return this.fillZero(data.getHours()) + ":" + this.fillZero(data.getMinutes());
            },
            fillZero(n) {
                return n < 10 ? '0' + n : n;
            }
        }
    }
</script>

<style lang="scss" scoped>
    .retire_warn_setting_wrap{
        padding:12px;
        .demo-ruleForm{
            width:810px;
            margin:0 auto;
        }
        .header{
            padding-bottom: 10px;
            border-bottom: 1px solid #eee;
        }
        .retire_content_box{
            overflow:  hidden auto;
            .retire_warn_box{
                padding-top: 10px;
                .is_warn_btn{
                    font-size: 16px;
                    font-weight: 700;
                }
            }
            .top_title{
                height: 30px;
                line-height: 30px;
                margin-top: 10px;
                font-size: 16px;
                font-weight: 700;
            }
            .check_box_wrap{
                margin-left: 30px;
                .grade_time_line{
                    margin-bottom: 10px;
                    .grade_push_time{
                        margin: 0 10px;
                    }
                }
            }
            .address_config_box{
                width: 450px;
                margin-left: 50px;
            }
        }
    }
</style>
