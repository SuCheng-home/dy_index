<template>
    <div class="attendance_rule_wrap">
        <back-tool>
            <el-button type="primary" size="medium" @click.native="saveNewRule">保存</el-button>
        </back-tool>
        <div class="rule_add_box">
            <el-form label-width="140px">
                <el-form-item label="规则名称" :required="true">
                    <el-input maxlength="20" v-model="ruleName" placeholder="请输入规则名称"></el-input>
                </el-form-item>
                <el-form-item label="考勤地点" :required="true">
                    <el-checkbox-group v-model="checkAddressList">
                        <el-checkbox :label="item.id" :key="index" v-for="(item, index) in attendanceAddressList">{{item.address}}</el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item label="清零时间">
                    凌晨
                </el-form-item>
                <el-form-item label="签到签退时间规则">
                    <el-radio-group v-model="defaultSame">
                        <el-radio :label="1">每天考勤时间相同</el-radio>
                        <el-radio :label="0">每天考勤时间不完全相同</el-radio>
                    </el-radio-group>
                </el-form-item>
                <template v-if="defaultSame === 1">
                    <el-form-item label="签到时间" :required="true">
                        <el-time-picker v-model="sameTimeSignMsg.signInDate" placeholder="选择时间" format="HH:mm"></el-time-picker>
                        <el-checkbox v-model="sameTimeSignMsg.remindSignIn">开启提醒</el-checkbox>
                        <span v-if="sameTimeSignMsg.remindSignIn">
                            提醒时间：提前
                            <el-input-number v-model="sameTimeSignMsg.remindSignInDate" :min="1" :max="100" label="输入时间"></el-input-number>
                            分钟
                        </span>
                    </el-form-item>
                    <el-form-item label="">
                        <el-checkbox v-model="sameTimeSignMsg.signOut">是否签退</el-checkbox>
                    </el-form-item>
                    <template v-if="sameTimeSignMsg.signOut">
                        <el-form-item label="签退时间" :required="true">
                            <el-time-picker v-model="sameTimeSignMsg.signOutDate" placeholder="选择时间" format="HH:mm"></el-time-picker>
                            <el-checkbox v-model="sameTimeSignMsg.remindSignOut">开启提醒</el-checkbox>
                            <span v-if="sameTimeSignMsg.remindSignOut">
                            提醒时间：延后
                            <el-input-number v-model="sameTimeSignMsg.remindSignOutDate" :min="1" :max="100" label="输入时间"></el-input-number>
                            分钟
                        </span>
                        </el-form-item>
                    </template>
                </template>
                <template v-if="defaultSame === 0">
                    <div class="week_day_sign_Item" :key="index" v-for="(item, index) in ruleDateList">
                        <el-form-item label="适应周次" :required="true">
                            <el-checkbox-group v-model="item.weekDays" @change="changeWeekDay">
                                <el-checkbox :label="weekItem.id" :key="weekIndex" v-for="(weekItem, weekIndex) in weekDayList" :disabled="isDisabledWeekDay(item.weekDays, weekItem.id)">{{weekItem.name}}</el-checkbox>
                            </el-checkbox-group>
                        </el-form-item>
                        <el-form-item label="签到时间" :required="true">
                            <el-time-picker v-model="item.signInDate" placeholder="选择时间" format="HH:mm"></el-time-picker>
                            <el-checkbox v-model="item.remindSignIn">开启提醒</el-checkbox>
                            <span v-if="item.remindSignIn">
                                提醒时间：提前
                                <el-input-number v-model="item.remindSignInDate" :min="1" :max="100" label="输入时间"></el-input-number>
                                分钟
                            </span>
                        </el-form-item>
                        <el-form-item label="">
                            <el-checkbox v-model="item.signOut">是否签退</el-checkbox>
                        </el-form-item>
                        <template v-if="item.signOut">
                            <el-form-item label="签退时间" :required="true">
                                <el-time-picker v-model="item.signOutDate" placeholder="选择时间" format="HH:mm"></el-time-picker>
                                <el-checkbox v-model="item.remindSignOut">开启提醒</el-checkbox>
                                <span v-if="item.remindSignOut">
                                    提醒时间：延后
                                    <el-input-number v-model="item.remindSignOutDate" :min="1" :max="100" label="输入时间"></el-input-number>
                                    分钟
                                </span>
                            </el-form-item>
                        </template>
                        <div class="el-icon-circle-plus-outline" v-if="index === 0" @click="addWeekDayItem"></div>
                        <div class="el-icon-circle-close" v-else-if="index > 0" @click="delWeekDayItem(index)"></div>
                    </div>
                </template>
                <el-form-item label="补卡次数">
                       <el-checkbox  :true-label="2" :false-label="1" v-model="sameTimeSignMsg.isMarkCard">限制次数</el-checkbox>
                         &nbsp; &nbsp; &nbsp;<el-input-number v-if="sameTimeSignMsg.isMarkCard==2" v-model="sameTimeSignMsg.markCardLimit" :min="1" :max="100" ></el-input-number>
                </el-form-item>
                <!-- <el-form-item label="补卡审核" :required="true">
                     <el-radio-group v-model="sameTimeSignMsg.markCardBatchbType">
                        <el-radio :label="1">不审批</el-radio>
                        <el-radio :label="2">部门负责人</el-radio>
                        <el-radio :label="3">指定人员</el-radio>
                    </el-radio-group>
                </el-form-item> -->
                 <el-form-item  :required="true" label="审核人" prop="addressDataprop" v-if="sameTimeSignMsg.markCardBatchbType==3">
                <address-book v-model="addressData" :config="configData"></address-book>
             </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
    import BackTool from '@/components/BackTool';
    import mixins from '@/mixins/windowResize';
    import {queryAttendanceAddressBySchoolId, getAttendanceRuleById, insertAttendanceRule, editAttendanceRule} from '@/api/systemSet/teacherAttendanceSet';
    import AddressBook from "@/components/AddressBook/indexExpand";
    export default {
        name: "teacherAttendanceSetRuleAdd",
        components: {
            BackTool,AddressBook
        },
        data() {
            return {
                addressData: {departJson:[],groupJson:[],userJson:[]},
                configData: {
                    title: "审核人",
                    depart: { target: "user", departType: "t", userTypes: "1" },
                    group: false
                },
                weekDayList: [
                    {
                        name: '周日',
                        id: 7
                    },
                    {
                        name: '周一',
                        id: 1
                    },
                    {
                        name: '周二',
                        id: 2
                    },
                    {
                        name: '周三',
                        id: 3
                    },
                    {
                        name: '周四',
                        id: 4
                    },
                    {
                        name: '周五',
                        id: 5
                    },
                    {
                        name: '周六',
                        id: 6
                    }
                ],
                checkWeekList: [],
                checkAddressList: [],
                attendanceAddressList: [],
                ruleName: '',
                defaultSame: 1, // 是否统一时间,默认统一
                resetDate: '', // 清零时间
                sameTimeSignMsg: {
                    signInDate: '', // 签到时间
                    remindSignIn: false, // 是否提醒签到  1提醒 0不提醒
                    remindSignInDate: 5, // 提醒签到时间提前多少
                    signOut: false, //是否签退，0代表不需要，1代表需要
                    signOutDate: '', // 签退时间
                    remindSignOut: false, // 是否提醒签退  1提醒 0不提醒
                    remindSignOutDate: 5, // 提醒签退延后多少
                    isMarkCard:1,//	是否允许补卡 2 允许 1 否	number	2024-11-18
                    markCardBatchUserJson:1,//	补卡审批人son	array<object>	2024-11-18
                    markCardBatchbType:1,//	补卡审批类型 1 不审批 2 部门负责人 3 指定人员	number	2024-11-18
                    markCardLimit:0,//	补卡限制次数	number	2024-11-18
                },
                ruleDateList: [{
                    signInDate: '',
                    remindSignIn: false,
                    remindSignInDate: 5,
                    signOut: false,
                    signOutDate: '',
                    remindSignOut: false,
                    remindSignOutDate: 5,
                    weekDays: []
                }],
                ruleId: 0
            }
        },
        created() {
            this.ruleId = this.$route.query.ruleId;
            this.queryAttendanceAddressBySchoolId();
        },
        mixins:[mixins],
        methods: {
            queryAttendanceAddressBySchoolId() {
                queryAttendanceAddressBySchoolId().then(res => {
                    const data = res.data;
                    if (data.code === 200) {
                        this.attendanceAddressList = data.data;
                        if (this.ruleId) { // 编辑
                            this.getAttendanceRuleById();
                        }
                    }
                }).catch(() => {});
            },
            getAttendanceRuleById() {
                getAttendanceRuleById(this.ruleId).then(res => {
                    const data = res.data.data;
                    if (res.data.code === 200) {
                        this.ruleName = data.ruleName;
                        data.addressList.forEach((item) => {
                            this.checkAddressList.push(item.id);
                        });
                        this.resetDate = data.resetDate;
                        this.defaultSame = data.defaultSame;
                        this.sameTimeSignMsg.isMarkCard=data.isMarkCard||1
                        this.sameTimeSignMsg.markCardBatchbType=data.markCardBatchbType||1
                        this.sameTimeSignMsg.markCardLimit=data.markCardLimit||0
                        this.addressData.userJson=data.markCardBatchUserJson?JSON.parse(data.markCardBatchUserJson):[]
                        if (data.defaultSame === 1) {
                            this.sameTimeSignMsg.signInDate = new Date(2019, 7, 1, `${parseInt(data.signInDate.split(':')[0])}`, `${parseInt(data.signInDate.split(':')[1])}`);
                            this.sameTimeSignMsg.remindSignIn = !!data.remindSignIn;
                            this.sameTimeSignMsg.remindSignInDate = data.remindSignInDate;
                            this.sameTimeSignMsg.signOut = !!data.signOut;
                            this.sameTimeSignMsg.signOutDate = new Date(2019, 7, 1, `${parseInt(data.signOutDate.split(':')[0])}`, `${parseInt(data.signOutDate.split(':')[1])}`);
                            this.sameTimeSignMsg.remindSignOut = !!data.remindSignOut;
                            this.sameTimeSignMsg.remindSignOutDate = data.remindSignOutDate;
                        } else {
                            let newRuleDateArray = [];
                            data.ruleDateList.forEach((item) => {
                                let newRuleJson = {};
                                newRuleJson.signInDate = new Date(2019, 7, 1, `${parseInt(item.signInDate.split(':')[0])}`, `${parseInt(item.signInDate.split(':')[1])}`);
                                newRuleJson.remindSignIn = !!item.remindSignIn;
                                newRuleJson.remindSignInDate = item.remindSignInDate;
                                newRuleJson.signOut = !!item.signOut;
                                newRuleJson.signOutDate = new Date(2019, 7, 1, `${parseInt(item.signOutDate.split(':')[0])}`, `${parseInt(item.signOutDate.split(':')[1])}`);
                                newRuleJson.remindSignOut = !!item.remindSignOut;
                                newRuleJson.remindSignOutDate = item.remindSignOutDate;

                                newRuleJson.weekDays = item.weekDays.split(',').map((miniItem) => {return parseInt(miniItem)});
                                newRuleDateArray.push(newRuleJson);
                            });
                            this.ruleDateList = newRuleDateArray;
                            this.initCheckWeekList();
                        }
                    }
                }).catch(() => {});
            },
            saveNewRule() {
                // 判断字段符合要求
                if (!this.ruleName.trim()) {
                    this.showWarnMsg('请输入规则名称！');
                    return;
                }
                if (!this.checkAddressList || !this.checkAddressList.length) {
                    this.showWarnMsg('请选择考勤地点！');
                    return;
                }
                let isContinueMsg = '';
                if (this.defaultSame === 1) {
                    if (!this.sameTimeSignMsg.signInDate) {
                        isContinueMsg = '请选择签到时间！';
                    } else if (this.sameTimeSignMsg.remindSignIn && !this.sameTimeSignMsg.remindSignInDate) {
                        isContinueMsg = '请输入签到提醒时间！';
                    } else if (this.sameTimeSignMsg.signOut && !this.sameTimeSignMsg.signOutDate) {
                        isContinueMsg = '请选择签退时间！';
                    } else if (this.sameTimeSignMsg.signOut && this.sameTimeSignMsg.remindSignOut && !this.sameTimeSignMsg.remindSignOutDate) {
                        isContinueMsg = '请输入签退提醒时间！';
                    }
                } else {
                    this.ruleDateList.forEach((item) => {
                        if (!isContinueMsg) {
                            if (!item.weekDays || !item.weekDays.length) {
                                isContinueMsg = '请选择适应周次！';
                            } else if (!item.signInDate) {
                                isContinueMsg = '请选择签到时间！';
                            } else if (item.remindSignIn && !item.remindSignInDate) {
                                isContinueMsg = '请输入签到提醒时间！';
                            } else if (item.signOut && !item.signOutDate) {
                                isContinueMsg = '请选择签退时间！';
                            } else if (item.signOut && item.remindSignOut && !item.remindSignOutDate) {
                                isContinueMsg = '请输入签退提醒时间！';
                            }
                        }
                    });
                }

                if (isContinueMsg) {
                    this.showWarnMsg(isContinueMsg);
                    return;
                }
                 if (this.sameTimeSignMsg.markCardBatchbType==3 && !this.addressData.userJson.length) {
                    this.showWarnMsg('请选择审核人！');
                    return;
                }
                // 字段组合
                let query = {};
                query.ruleName = this.ruleName;
                query.addressIds = this.checkAddressList.toString();
                query.defaultSame = this.defaultSame;
                query.resetDate = this.resetDate; // 清零时间

                // 默认
                let initRuleJson = {
                    signInDate: '',
                    remindSignIn: 0,
                    remindSignInDate: 0,
                    signOut: 0,
                    signOutDate: '',
                    remindSignOut: 0,
                    remindSignOutDate: 0,
                    isMarkCard:this.sameTimeSignMsg.isMarkCard,
                    markCardBatchbType:this.sameTimeSignMsg.markCardBatchbType,
                    markCardLimit:this.sameTimeSignMsg.isMarkCard==2?this.sameTimeSignMsg.markCardLimit:0,
                    markCardBatchUserJson:this.sameTimeSignMsg.markCardBatchbType==3?JSON.stringify(this.addressData.userJson):[]
                };

                Object.assign(query, initRuleJson);
                query.ruleDateListJson = '';

                if (this.defaultSame === 1) {
                    query.signInDate = this.getHourMinuteStr(this.sameTimeSignMsg.signInDate);
                    if (this.sameTimeSignMsg.remindSignIn) {
                        query.remindSignIn = 1;
                        query.remindSignInDate = this.sameTimeSignMsg.remindSignInDate;
                    }
                    if (this.sameTimeSignMsg.signOut) {
                        query.signOut = 1;
                        query.signOutDate = this.getHourMinuteStr(this.sameTimeSignMsg.signOutDate);
                    }
                    if (this.sameTimeSignMsg.remindSignOut && this.sameTimeSignMsg.signOut) {
                        query.remindSignOut = 1;
                        query.remindSignOutDate = this.sameTimeSignMsg.remindSignOutDate;
                    }
                } else {
                    let newRuleDateList = [];
                    this.ruleDateList.forEach((item) => {
                        let newRuleDateJson = {};
                        Object.assign(newRuleDateJson, initRuleJson);

                        newRuleDateJson.signInDate = this.getHourMinuteStr(item.signInDate);
                        if (item.remindSignIn) {
                            newRuleDateJson.remindSignIn = 1;
                            newRuleDateJson.remindSignInDate = item.remindSignInDate;
                        }
                        if (item.signOut) {
                            newRuleDateJson.signOut = 1;
                            newRuleDateJson.signOutDate = this.getHourMinuteStr(item.signOutDate);
                        }
                        if (item.remindSignOut && item.signOut) {
                            newRuleDateJson.remindSignOut = 1;
                            newRuleDateJson.remindSignOutDate = item.remindSignOutDate;
                        }
                        newRuleDateJson.weekDays = item.weekDays.toString();
                        newRuleDateList.push(newRuleDateJson);
                    });

                    query.ruleDateListJson = JSON.stringify(newRuleDateList);
                }


                if (this.ruleId) { // 编辑
                    query.id = parseInt(this.ruleId);
                    this.editAttendanceRule(query);
                } else { // 新增
                    this.insertAttendanceRule(query);
                }
            },
            insertAttendanceRule(query) {
                insertAttendanceRule(query).then(res => {
                    const data = res.data;
                    if (data.code === 200) {
                        this.$message({
                            type: 'success',
                            message: '规则新增成功'
                        });
                        this.$router.back();
                    }
                }).catch(() => {});
            },
            editAttendanceRule(query) {
                editAttendanceRule(query).then(res => {
                    const data = res.data;
                    if (data.code === 200) {
                        this.$message({
                            type: 'success',
                            message: '规则编辑成功'
                        });
                        this.$router.back();
                    }
                }).catch(() => {});
            },
            changeWeekDay(val) {
                // 增加
                val.forEach((item) => {
                    if (this.checkWeekList.indexOf(item) < 0) {
                        this.checkWeekList.push(item);
                    }
                });
                let newArray = [];
                this.ruleDateList.forEach((item) => {
                    newArray.push.apply(newArray, item.weekDays);
                });
                this.checkWeekList.forEach((checkItem, checkIndex) => {
                    if (newArray.indexOf(checkItem) < 0) {
                        this.checkWeekList.splice(checkIndex, 1);
                    }
                });
            },
            addWeekDayItem() {
                if (this.checkWeekList.length > 6 || this.ruleDateList.length > 6) {
                    return;
                }
                // 判断条件
                let initRuleJson = { // 添加的时候初始化
                    signInDate: '',
                    remindSignIn: false,
                    remindSignInDate: 5,
                    signOut: false,
                    signOutDate: '',
                    remindSignOut: false,
                    remindSignOutDate: 5,
                    weekDays: []
                };

                this.ruleDateList.push(initRuleJson);
            },
            delWeekDayItem(weekIndex) {
                if (this.ruleDateList.length > 2) {
                    this.ruleDateList.splice(weekIndex, 1);
                    this.initCheckWeekList();
                }
            },
            initCheckWeekList() {
                let newArray = [];
                this.ruleDateList.forEach((item) => {
                    newArray.push.apply(newArray, item.weekDays);
                });
                this.checkWeekList = newArray;
            },
            isDisabledWeekDay(list, weekDayId) {
                let isDis = false;
                if ((list.indexOf(weekDayId) < 0) && (this.checkWeekList.indexOf(weekDayId) > -1)) {
                    isDis = true;
                }
                return isDis;
            },
            showWarnMsg(msg) {
                this.$message({
                    type: 'warning',
                    message: msg
                });
            },
            getHourMinuteStr(n) {
                const data = new Date(n);
                return this.fillZero(data.getHours()) + ":" + this.fillZero(data.getMinutes());
            },
            fillZero(n) {
                return n < 10 ? '0' + n : n;
            },
        }
    }
</script>

<style lang="scss">
    .rule_add_box .el-form-item__label {
        font-weight: bold;
    }
</style>
<style lang="scss" scoped>
    .attendance_rule_wrap{
        padding:12px;
        .el-form{
            width:810px;
            margin: 0 auto;
        }
        .rule_add_box{
            margin: 20px;
            .week_day_sign_Item{
                position: relative;
                width: 900px;
                margin-bottom: 20px;
                margin-left: 80px;
                padding: 19px 0 0;
                border: 1px solid #ddd;
                .el-icon-circle-plus-outline{
                    position: absolute;
                    top: 46%;
                    right: -40px;
                    color: #409EFF;
                    font-size: 24px;
                    cursor: pointer;
                }
                .el-icon-circle-close{
                    position: absolute;
                    top: 46%;
                    right: -40px;
                    color: #F56C6C;
                    font-size: 24px;
                    cursor: pointer;
                }
            }
        }
    }
</style>
