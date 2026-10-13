<template>
    <div class="app-container calendar-list-container">
        <backtool>
            <el-button type="primary" size="medium" :loading="save_loading" @click.native="addAndUpdateStuAskleaveInit">
                保存
            </el-button>
            <el-button size="medium" @click.native="loadAskleaveGroupPage()">班级分组设置</el-button>
        </backtool>
        <div class="mainWrap" :style="`height:${nobottommaxH}px`">
            <el-form :model="ruleForm" ref="ruleForm" :rules="rules" label-width="140px" class="demo-ruleForm"
                     style="width:810px;margin:10px auto;">
                <div class="big-title"><span class="mudule-info"><span class="color-block"></span>审批设置 </span></div>
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="需要审批">
                            <el-tooltip :content="ruleForm.isBatch?'需要审批':'不需要审批' " placement="top">
                                <el-switch v-model="ruleForm.isBatch"></el-switch>
                            </el-tooltip>
                        </el-form-item>
                    </el-col>
                    <el-col :span="4">
                        <el-form-item v-show="ruleForm.isBatch" label="长期请假">
                            <el-tooltip :content="ruleForm.isLongAskleave?'长期请假需指定审批人':'长期请假不需指定审批人'" placement="top">
                                <el-switch v-model="ruleForm.isLongAskleave"></el-switch>
                            </el-tooltip>
                        </el-form-item>

                    </el-col>
                    <el-col :span="8">
                        <el-form-item v-show="ruleForm.isBatch&&ruleForm.isLongAskleave" label="时间">
                            <el-select v-model="ruleForm.dayCount" placeholder="请选择">
                                <el-option v-for="item in dayList" :key="item.value" :label="item.label"
                                           :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item v-show="ruleForm.isBatch&&ruleForm.isLongAskleave" label="审批人" prop="addressData">
                            <address-book v-model="ruleForm.addressData" :config="configData"></address-book>
                        </el-form-item>
                    </el-col>
                </el-row>
                <div class="big-title"><span class="mudule-info"><span class="color-block"></span>请假类型设置</span></div>
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="请假类型" prop="checkedLeaveTypeList">
                            <el-checkbox-group v-model="ruleForm.checkedLeaveTypeList">
                                <el-checkbox v-for="item in leaveTypeList" :label="item.label" :key="item.key"
                                             @change="leaveTypeChange"></el-checkbox>
                            </el-checkbox-group>
                            <!-- type="checkedLeaveTypeList"  -->
                        </el-form-item>
                    </el-col>
                    <el-row v-show="istwoshow">
                        <el-col :span="6">
                            <el-form-item label="事假可选事由">
                                <el-tooltip :content="ruleForm.reasonHav?'请事假时需要选择事由':'请事假时不需要选择事由' " placement="top">
                                    <el-switch v-model="ruleForm.reasonHav"></el-switch>
                                </el-tooltip>
                            </el-form-item>
                        </el-col>
                        <el-col :span="18">
                            <el-form-item v-show="ruleForm.reasonHav" label-width="0" prop="reasonHavlist">
                                <el-checkbox-group v-model="ruleForm.reasonHavlist">
                                    <el-checkbox v-for="item in reasonJsonlist" :label="item.value"
                                                 :key="item.code"></el-checkbox>
                                </el-checkbox-group>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-col :span="14" v-if="showSickTypeRemindFlag==1||showSickTypeRemindFlag==3">
                        <el-form-item label="推送班主任">
                            <el-tooltip :content="ruleForm.isSendClassHeader?'推送班主任':'不推送班主任' " placement="top">
                                <el-switch v-model="ruleForm.isSendClassHeader"></el-switch>
                            </el-tooltip>
                        </el-form-item>
                    </el-col>
                    <el-col :span="14" v-if="showSickTypeRemindFlag==1||showSickTypeRemindFlag==2">
                        <el-col :span="7">
                            <el-form-item label="病假抄送" prop="isSickTypeRemind">
                                <el-tooltip :content="ruleForm.isSickTypeRemind?'需要抄送':'不需要抄送' " placement="top">
                                    <el-switch v-model="ruleForm.isSickTypeRemind"></el-switch>
                                </el-tooltip>
                            </el-form-item>
                        </el-col>
                        <el-col :span="14">
                            <el-form-item v-show="ruleForm.isSickTypeRemind" label="病假抄送人"
                                          prop="remindSickTypeUserData">
                                <address-book v-model="ruleForm.remindSickTypeUserData"
                                              :config="configData"></address-book>
                            </el-form-item>
                        </el-col>

                    </el-col>
                    <el-col :span="14" v-show="isShowAffairLeaveSubs">
                        <el-col :span="7">
                            <el-form-item label="事假抄送"  prop="isThingRemind">
                                <el-tooltip :content="ruleForm.isThingRemind?'需要抄送':'不需要抄送' " placement="top">
                                    <el-switch v-model="ruleForm.isThingRemind"></el-switch>
                                </el-tooltip>
                            </el-form-item>
                        </el-col>
                        <el-col :span="14">
                            <el-form-item v-show="ruleForm.isThingRemind" label="事假抄送人" prop="remindThingUserJson" >
                                <address-book v-model="ruleForm.remindThingUserJson" :config="configData"></address-book>
                            </el-form-item>
                        </el-col>

                    </el-col>
                </el-row>
                <el-row v-show="isoneshow">
                    <el-col :span="6">
                        <el-form-item label="病假需要分类">
                            <el-tooltip :content="ruleForm.isSickTypeGroup?'请病假时需要选择疾病类型':'请病假时不需要选择疾病类型' "
                                        placement="top">
                                <el-switch v-model="ruleForm.isSickTypeGroup"></el-switch>
                            </el-tooltip>
                        </el-form-item>
                    </el-col>
                    <el-col :span="18">
                        <el-form-item v-show="ruleForm.isSickTypeGroup" label-width="0" prop="checkedSickTypeList">
                            <el-checkbox-group v-model="ruleForm.checkedSickTypeList">
                                <el-checkbox v-for="item in sickTypeList" :label="item.value"
                                             :key="item.code"></el-checkbox>
                            </el-checkbox-group>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row v-show="isoneshow">
                    <el-col :span="6">
                        <el-form-item label="病假需要症状">
                            <el-tooltip :content="ruleForm.symptomHav?'请病假时需要选择症状':'请病假时不需要选择症状' " placement="top">
                                <el-switch v-model="ruleForm.symptomHav"></el-switch>
                            </el-tooltip>
                        </el-form-item>
                    </el-col>
                    <el-col :span="18">
                        <el-form-item v-show="ruleForm.symptomHav" label-width="0" prop="symptomHavlist">
                            <el-checkbox-group v-model="ruleForm.symptomHavlist">
                                <el-checkbox v-for="item in symptomList" :label="item.value"
                                             :key="item.code"></el-checkbox>
                            </el-checkbox-group>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row v-show="isoneshow">
                    <el-col :span="4">
                        <el-form-item label="就医情况">
                        </el-form-item>
                    </el-col>
                    <el-col :span="20">
                        <el-form-item label-width="0" prop="medicalTypeJson">
                            <el-checkbox-group v-model="ruleForm.medicalTypeJson">
                                <el-checkbox v-for="item in medicalTypeJsonList" :label="item.value"
                                             :key="item.code"></el-checkbox>
                            </el-checkbox-group>
                        </el-form-item>
                    </el-col>
                </el-row>
                <div class="big-title"><span class="mudule-info"><span class="color-block"></span>提醒及预警</span></div>
                <el-row>
                    <el-col :span="4">
                        <el-form-item label="提醒任课老师">
                            <el-tooltip :content="ruleForm.isSendTeacher?'需要提醒任课老师':'不需要提醒任课老师' " placement="top">
                                <el-switch v-model="ruleForm.isSendTeacher"></el-switch>
                            </el-tooltip>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row>
                    <el-col :span="4">
                        <el-form-item label="班级预警设置">
                            <el-tooltip :content="ruleForm.isSendClassWarn?'需要预警':'不需要预警' " placement="top">
                                <el-switch v-model="ruleForm.isSendClassWarn"></el-switch>
                            </el-tooltip>
                        </el-form-item>

                    </el-col>
                    <el-col :span="10">
                        <el-form-item v-show="ruleForm.isSendClassWarn" label="预警数量">
                            <el-input-number size="small" :min="1" v-model="ruleForm.classWarnCount"></el-input-number>
                        </el-form-item>
                    </el-col>
                    <el-col :span="10">
                        <el-form-item v-show="ruleForm.isSendClassWarn" label="预警提醒人" prop="sendClassUserJsonData">
                            <address-book v-model="ruleForm.sendClassUserJsonData" :config="configData"></address-book>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="4">
                        <el-form-item label="学校预警设置">
                            <el-tooltip :content="ruleForm.isSendSchoolWarn?'需要预警':'不需要预警' " placement="top">
                                <el-switch v-model="ruleForm.isSendSchoolWarn"></el-switch>
                            </el-tooltip>
                        </el-form-item>
                    </el-col>
                    <el-col :span="10">
                        <el-form-item v-show="ruleForm.isSendSchoolWarn" label="预警数量">
                            <el-input-number size="small" :min="1" v-model="ruleForm.schoolWarnCount"></el-input-number>
                        </el-form-item>
                    </el-col>
                    <el-col :span="10">
                        <el-form-item v-show="ruleForm.isSendSchoolWarn" label="预警提醒人" prop="sendSchoolUserJsonData">
                            <address-book v-model="ruleForm.sendSchoolUserJsonData" :config="configData"></address-book>
                        </el-form-item>
                    </el-col>
                </el-row>
                <div class="big-title"><span class="mudule-info"><span class="color-block"></span>其他设置</span></div>
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="上课时间">
                            <el-time-select :clearable='false' placeholder="起始时间" v-model="ruleForm.startTime"
                                            :picker-options="{ start: '07:00',step: '00:15', end: '19:00',maxTime: ruleForm.endTime }">
                            </el-time-select>
                            --
                            <el-time-select :clearable='false' placeholder="结束时间" v-model="ruleForm.endTime"
                                            :picker-options="{start: '07:00',step: '00:15', end: '19:00', minTime: ruleForm.startTime }">
                            </el-time-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="需要销假">
                            <el-tooltip :content="ruleForm.isHer?'需要销假':'不需要销假' " placement="top">
                                <el-switch v-model="ruleForm.isHer"></el-switch>
                            </el-tooltip>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="显示停伙">
                            <el-tooltip :content="ruleForm.showStopFire?'显示停伙':'不显示停伙' " placement="top">
                                <el-switch v-model="ruleForm.showStopFire"></el-switch>
                            </el-tooltip>
                            <el-checkbox v-model="ruleForm.showStopLimit" v-if="ruleForm.showStopFire">
                                请假根据停伙设置规则生成停伙数据
                            </el-checkbox>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="20">
                        <el-form-item label="住宿生请假" prop="liveRemindUserJson">
                            <el-tooltip :content="ruleForm.isLiveRemind ? '需要' : '不需要' " placement="top">
                                <el-switch v-model="ruleForm.isLiveRemind"></el-switch>
                            </el-tooltip>
                            <div v-show="ruleForm.isLiveRemind">
                                住宿生请假抄送人&nbsp;<address-book style="display: inline-block;vertical-align: middle;width: 220px;" v-model="ruleForm.liveRemindUserJson" :config="configData"></address-book>
                            </div>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>

        </div>
    </div>
</template>
<script>
    import {getDicByCode} from '@/utils/utils';
    import mixin from '@/mixins/windowResize';
    import Backtool from '@/components/BackTool';
    import AddressBook from '@/components/AddressBook/indexExpand';
    import {getStuAskleaveInitInfo, addAndUpdateStuAskleaveInit} from '@/api/systemSet/StuLeave2Set';
    import {findDicsByCode} from '@/api/system';

    const ISBatch = {OK: 1, NO: 2};//1代表需要审批,2代表不需要审批
    const ISSickTypeGroup = {OK: 1, NO: 2};//是否疾病分类(1需要分组，2不需要分组)
    const ISHer = {OK: 1, NO: 2};//是否销假（1代表需要销假，2代表不需要销假）
    const ShowStopFire = {OK: 2, NO: 1};//(1代表不需要，2代表需要)
    const ISLongAskleave = {OK: 1, NO: 2};//(1代表需要，2 代表不需要）
    const IsSickTypeRemind = {OK: 2, NO: 1};//病假是否需要抄送1代表不需要，2代表需要
    const IsSendClassHeader = {OK: 2, NO: 1};//是否推送班主任1不推送，2推送


    const IsSendClassWarn = {OK: 2, NO: 1};//是否需要发送班级预警1代表不需要，2代表需要
    const IsSendSchoolWarn = {OK: 2, NO: 1};//是否需要发送学校预警1代表不需要，2代表需要
    const IsSendTeacher = {OK: 1, NO: 2};//否抄送老师1代表需要，2代表不需要
    export default {
        components: {
            AddressBook,
            Backtool
        },
        watch: {
            'ruleForm.addressData': {
                handler: function (val, oldVal) {
                    this.$refs.ruleForm.validateField('addressData');
                },
                deep: true
            },
            'ruleForm.remindSickTypeUserData': {
                handler: function (val, oldVal) {
                    this.$refs.ruleForm.validateField('remindSickTypeUserData');
                },
                deep: true
            },
            'ruleForm.sendClassUserJsonData': {
                handler: function (val, oldVal) {
                    this.$refs.ruleForm.validateField('sendClassUserJsonData');
                },
                deep: true
            },
            'ruleForm.sendSchoolUserJsonData': {
                handler: function (val, oldVal) {
                    this.$refs.ruleForm.validateField('sendSchoolUserJsonData');
                },
                deep: true
            },
            'ruleForm.liveRemindUserJson': {
                handler: function (val, oldVal) {
                    this.$refs.ruleForm.validateField('liveRemindUserJson');
                },
                deep: true
            }

        },
        computed: {
            isShowAffairLeaveSubs() {
                return this.ruleForm.checkedLeaveTypeList.includes('事假');
            }
        },
        data() {
            var validateAddress = (rule, value, callback) => {
                if ((value.userJson == undefined || value.userJson.length == 0) && this.ruleForm.isLongAskleave) {
                    callback(new Error('请选择审批人！'));
                } else {
                    callback();
                }
            };

            var validateRemindSickTypeUser = (rule, value, callback) => {
                if ((value.userJson == undefined || value.userJson.length == 0) && this.ruleForm.isSickTypeRemind) {
                    callback(new Error('请选择病假抄送人！'));
                } else {
                    callback();
                }
            };
            var validateSendClassUserJson = (rule, value, callback) => {
                if ((value.userJson == undefined || value.userJson.length == 0) && this.ruleForm.isSendClassWarn) {
                    callback(new Error('请选择预警提醒人！'));
                } else {
                    callback();
                }
            };
            var validateSendSchoolUserJson = (rule, value, callback) => {
                if ((value.userJson == undefined || value.userJson.length == 0) && this.ruleForm.isSendSchoolWarn) {
                    callback(new Error('请选择预警提醒人！'));
                } else {
                    callback();
                }
            };
            var validateRemindThingUserJson = (rule, value, callback) => {
                if ((value.userJson == undefined || value.userJson.length == 0) && this.ruleForm.isThingRemind) {
                    callback(new Error('请选择事假抄送人！'));
                } else {
                    callback();
                }
            };
            var validateLiveRemindUserJson = (rule, value, callback) => {
                if ((value.userJson == undefined || value.userJson.length == 0) && this.ruleForm.isLiveRemind) {
                    callback(new Error('请选择住宿生请假抄送人！'));
                } else {
                    callback();
                }
            }
            var validateCheckedSickTypeList = (rule, value, callback) => {
                if (this.ruleForm.isSickTypeGroup) {
                    if (value.length == 0) {
                        callback(new Error('至少选择一个疾病分类！'));
                    } else {
                        callback();
                    }
                } else {
                    callback();
                }

            };
            var symptomHavlistfun = (rule, value, callback) => {
                if (this.ruleForm.symptomHav) {
                    if (value.length == 0) {
                        callback(new Error('至少选择一个疾病症状！'));
                    } else {
                        callback();
                    }
                } else {
                    callback();
                }

            };
            var medicalTypeJsonfun = (rule, value, callback) => {
                if (value.length == 0) {
                    callback(new Error('至少选择一个就医情况！'));
                } else {
                    callback();
                }

            };
            var reasonHavlistfun = (rule, value, callback) => {
                if (this.ruleForm.reasonHav) {
                    if (value.length == 0) {
                        callback(new Error('至少选择一个事假事由！'));
                    } else {
                        callback();
                    }
                } else {
                    callback();
                }

            };
            return {
                save_loading: false,
                isoneshow: true,
                istwoshow: true,
                ruleForm: {
                    // id: '',
                    isLiveRemind: false,
                    isBatch: false, //yjx审批
                    isLongAskleave: false, //长期请假
                    isHer: false, //需要销假
                    showStopFire: false,
                    isSickTypeGroup: false, //病假需要分类
                    startTime: '07:00', //上课时间开始时间
                    endTime: '19:00', //上课时间开始时间
                    dayCount: '',
                    checkedLeaveTypeList: [], //请假类型
                    addressData: {userJson: []},  //请假审批人
                    remindSickTypeUserData: {userJson: []}, //病假抄送人
                    isSendClassHeader: false,
                    sendClassUserJsonData: {userJson: []}, //班级预警提醒人
                    sendSchoolUserJsonData: {userJson: []}, //学校预警提醒人
                    liveRemindUserJson: {userJson: []},
                    isSickTypeRemind: false, //病假抄送
                    isSendClassWarn: false, //班级预警设置
                    isSendSchoolWarn: false, //学校预警设置
                    classWarnCount: 1, //班级预警数量
                    schoolWarnCount: 1, //学校预警数量
                    checkedSickTypeList: [], //病假类型
                    isSendTeacher: false,//提醒任课老师
                    symptomHav: false,//是否需要症状
                    symptomHavlist: [],//选中
                    medicalTypeJson: [],
                    reasonHav: false,
                    reasonHavlist: [],
                    showStopLimit: false,
                    isThingRemind: false,
                    remindThingUserJson: {userJson: []}
                },
                rules: {
                    checkedLeaveTypeList: [
                        {type: 'array', required: true, message: '请至少选择一个请假类型！', trigger: 'change'}
                    ],
                    addressData: [
                        {validator: validateAddress, trigger: 'change'}
                    ],
                    remindSickTypeUserData: [
                        {validator: validateRemindSickTypeUser, trigger: 'change'}
                    ],
                    remindThingUserJson: [
                        {validator: validateRemindThingUserJson, trigger: 'change'}
                    ],
                    sendClassUserJsonData: [
                        {validator: validateSendClassUserJson, trigger: 'change'}
                    ],
                    sendSchoolUserJsonData: [
                        {validator: validateSendSchoolUserJson, trigger: 'change'}
                    ],
                    liveRemindUserJson: [
                        {validator: validateLiveRemindUserJson, trigger: 'change'}
                    ],
                    checkedSickTypeList: [
                        {validator: validateCheckedSickTypeList, trigger: 'change'}
                    ],
                    symptomHavlist: [
                        {validator: symptomHavlistfun, trigger: 'change'}
                    ],
                    medicalTypeJson: [
                        {validator: medicalTypeJsonfun, trigger: 'change'}
                    ],
                    reasonHavlist: [
                        {validator: reasonHavlistfun, trigger: 'change'}
                    ],
                }, dayList: [{
                    value: 1,
                    label: '1天'
                },
                    {
                        value: 2,
                        label: '2天'
                    }, {
                        value: 3,
                        label: '3天'
                    }, {
                        value: 5,
                        label: '5天'
                    }, {
                        value: 10,
                        label: '10天'
                    }, {
                        value: 15,
                        label: '15天'
                    }],
                configData: {title: '审批人', depart: {target: 'user', departType: 't', userTypes: '1'}},
                addressDefualt: {},
                //leaveTypeList: [{ label: '事假', key: 0 }, { label: '课后服务', key: 7 }, { label: '病假', key: 1 }],
                leaveTypeList: [],
                sickTypeList: [],
                showSickTypeRemindFlag: false,//控制显示病假抄送
                symptomList: [],
                medicalTypeJsonList: [],
                reasonJsonlist: []
            }
        },
        created() {
            getDicByCode('stuLeaveType')
                .then(data => {
                    data.forEach(item => {
                        item.key = item.code;
                        item.label = item.value;
                    });
                    this.leaveTypeList = data;
                })
            getStuAskleaveInitInfo().then(res => {
                let data = res.data.data;
                // this.ruleForm.id = data.id;
                const ruleForm = {};
                ruleForm.isBatch = data.isBatch === ISBatch.OK ? true : false;
                ruleForm.isLongAskleave = data.isLongAskleave === ISLongAskleave.OK ? true : false;
                ruleForm.dayCount = data.dayCount;
                if (data.batchUserJson) {
                    ruleForm.addressData = {userJson: JSON.parse(data.batchUserJson)};
                } else {
                    ruleForm.addressData = {userJson: []};
                }
                ruleForm.startTime = data.startTime;
                ruleForm.endTime = data.endTime;
                ruleForm.showStopLimit = data.showStopLimit == 2;
                ruleForm.isHer = data.isHer === ISHer.OK ? true : false;
                ruleForm.showStopFire = data.showStopFire === ShowStopFire.OK ? true : false;
                ruleForm.isSendTeacher = data.isSendTeacher == IsSendTeacher.OK ? true : false;
                ruleForm.isLiveRemind = data.isLiveRemind == 2;

                if (data.leaveTypeJson) {
                    ruleForm.checkedLeaveTypeList = this.getCheckedTypeList(JSON.parse(data.leaveTypeJson));
                } else {
                    ruleForm.checkedLeaveTypeList = this.getCheckedTypeList([]);
                }
                if (data.sickTypeJson) {
                    ruleForm.checkedSickTypeList = this.getSickTypeList(JSON.parse(data.sickTypeJson));
                } else {
                    ruleForm.checkedSickTypeList = this.getSickTypeList([]);
                }
                if (data.symptomJson) {
                    ruleForm.symptomHavlist = this.getSickTypeList(JSON.parse(data.symptomJson));
                } else {
                    ruleForm.symptomHavlist = this.getSickTypeList([]);
                }
                if (data.medicalTypeJson) {
                    ruleForm.medicalTypeJson = this.getSickTypeList(JSON.parse(data.medicalTypeJson));
                } else {
                    ruleForm.medicalTypeJson = this.getSickTypeList([]);
                }
                if (data.reasonJson) {
                    ruleForm.reasonHavlist = this.getSickTypeList(JSON.parse(data.reasonJson));
                } else {
                    ruleForm.reasonHavlist = this.getSickTypeList([]);
                }
                if (data.remindSickTypeUserJson) {
                    ruleForm.remindSickTypeUserData = {userJson: JSON.parse(data.remindSickTypeUserJson)};
                } else {
                    ruleForm.remindSickTypeUserData = {userJson: []};
                }
                if (data.remindThingUserJson) {
                    ruleForm.remindThingUserJson = {userJson: JSON.parse(data.remindThingUserJson)};
                } else {
                    ruleForm.remindThingUserJson = {userJson: []};
                }
                if (data.sendClassUserJson) {
                    ruleForm.sendClassUserJsonData = {userJson: JSON.parse(data.sendClassUserJson)};
                } else {
                    ruleForm.sendClassUserJsonData = {userJson: []};
                }
                if (data.sendSchoolUserJson) {
                    ruleForm.sendSchoolUserJsonData = {userJson: JSON.parse(data.sendSchoolUserJson)};
                } else {
                    ruleForm.sendSchoolUserJsonData = {userJson: []};
                }
                if(data.liveRemindUserJson && data.isLiveRemind == 2) {
                    console.log('JSON.parse(data.liveRemindUserJson)', JSON.parse(data.liveRemindUserJson))
                    ruleForm.liveRemindUserJson = {userJson: JSON.parse(data.liveRemindUserJson)};
                } else {
                    ruleForm.liveRemindUserJson = {userJson: []};
                }


                ruleForm.isSickTypeRemind = data.isSickTypeRemind == IsSickTypeRemind.OK ? true : false;

                ruleForm.isThingRemind = data.isThingRemind == 2;

                ruleForm.isSendClassHeader = data.isSendClassHeader == IsSendClassHeader.OK ? true : false;

                ruleForm.isSendClassWarn = data.isSendClassWarn == IsSendClassWarn.OK ? true : false;
                ruleForm.classWarnCount = data.classWarnCount;
                ruleForm.isSendSchoolWarn = data.isSendSchoolWarn == IsSendSchoolWarn.OK ? true : false;
                ruleForm.schoolWarnCount = data.schoolWarnCount;
                if (ruleForm.checkedLeaveTypeList.indexOf("病假") !== -1) {
                    ruleForm.isSickTypeGroup = data.isSickTypeGroup === ISSickTypeGroup.OK ? true : false;
                    if (data.symptomHav == 2) {
                        ruleForm.symptomHav = true;
                    } else {
                        ruleForm.symptomHav = false;
                    }
                }
                if (ruleForm.checkedLeaveTypeList.indexOf("事假") !== -1) {
                    if (data.reasonHav == 2) {
                        ruleForm.reasonHav = true;
                    } else {
                        ruleForm.reasonHav = false;
                    }
                }
                this.ruleForm = ruleForm;
                this.leaveTypeChange();

            }).catch();

            findDicsByCode('sicktypeName').then(res => {
                this.sickTypeList = res.data.data;
            }).catch();
            findDicsByCode('stusymptom').then(res => {
                this.symptomList = res.data.data;
            }).catch();
            findDicsByCode('stumedicaltype').then(res => {
                this.medicalTypeJsonList = res.data.data;
            }).catch();
            findDicsByCode('stureason').then(res => {
                this.reasonJsonlist = res.data.data;
            }).catch();
        },
        mixins: [mixin],
        methods: {
            addAndUpdateStuAskleaveInit() {
                this.$refs['ruleForm'].validate((valid) => {
                    if (valid) {
                        let query = {
                            isBatch: this.ruleForm.isBatch ? ISBatch.OK : ISBatch.NO,
                            isLongAskleave: this.ruleForm.isLongAskleave ? ISLongAskleave.OK : ISLongAskleave.NO,
                            dayCount: this.ruleForm.dayCount,
                            batchUserJson: this.ruleForm.addressData.userJson,
                            startTime: this.ruleForm.startTime,
                            endTime: this.ruleForm.endTime,
                            isHer: this.ruleForm.isHer ? ISHer.OK : ISHer.NO,
                            showStopFire: this.ruleForm.showStopFire ? ShowStopFire.OK : ShowStopFire.NO,
                            isSendTeacher: this.ruleForm.isSendTeacher ? IsSendTeacher.OK : IsSendTeacher.NO,
                            leaveTypeJson: this.getLeaveTypeJson(),//请假类型
                            sickTypeJson: this.getSickTypeJson(),//疾病类型分类
                            isSickTypeRemind: this.ruleForm.isSickTypeRemind ? IsSickTypeRemind.OK : IsSickTypeRemind.NO,
                            isThingRemind: this.ruleForm.isThingRemind ? 2 : 1,
                            remindSickTypeUserJson: this.ruleForm.remindSickTypeUserData.userJson,
                            remindThingUserJson: this.ruleForm.remindThingUserJson.userJson,
                            isSendClassHeader: this.ruleForm.isSendClassHeader ? IsSendClassHeader.OK : IsSendClassHeader.NO,
                            isSickTypeGroup: this.ruleForm.isSickTypeGroup ? ISSickTypeGroup.OK : ISSickTypeGroup.NO,//是否疾病分类(1需要分组，2不需要分组)
                            isSendClassWarn: this.ruleForm.isSendClassWarn ? IsSendClassWarn.OK : IsSendClassWarn.NO,
                            classWarnCount: this.ruleForm.classWarnCount,
                            sendClassUserJson: this.ruleForm.sendClassUserJsonData.userJson,
                            isSendSchoolWarn: this.ruleForm.isSendSchoolWarn ? IsSendSchoolWarn.OK : IsSendSchoolWarn.NO,
                            isLiveRemind: this.ruleForm.isLiveRemind ? 2 : 1,
                            schoolWarnCount: this.ruleForm.schoolWarnCount,
                            sendSchoolUserJson: this.ruleForm.sendSchoolUserJsonData.userJson,
                            liveRemindUserJson: this.ruleForm.isLiveRemind ? this.ruleForm.liveRemindUserJson.userJson : [],
                            symptomHav: this.ruleForm.symptomHav ? 2 : 1,
                            symptomJson: this.symptomJsonfun(),//症状
                            medicalTypeJson: this.medicalTypeJsonfun(),//就医情况
                            reasonHav: this.ruleForm.reasonHav ? 2 : 1,
                            reasonJson: this.reasonJsonfun(),
                            showStopLimit: (this.ruleForm.showStopLimit && this.ruleForm.showStopFire) ? 2 : 1

                        };

                        // params.append('showStopFire',  1);//未对接，暂时写死
                        addAndUpdateStuAskleaveInit(query).then(res => {
                            let _this = this;
                            this.$message({
                                message: '保存成功！',
                                type: 'success',
                                onClose: function () {
                                    _this.$router.back();
                                }
                            });
                        }).catch();
                    }
                });
            },
            getCheckedTypeList(list) {
                let array = new Array();
                if (list) {
                    list.forEach(function (item) {
                        if (item.stuAskleaveSickTypeName) {
                            array.push(item.stuAskleaveSickTypeName);
                        } else {
                            array.push(item.stuAskleaveTypeName);
                        }
                    });
                }

                return array;
            },
            getSickTypeList(list) {
                let array = new Array();
                if (list) {
                    list.forEach(function (item) {
                        if (item.stuAskleaveSickTypeName) {
                            array.push(item.stuAskleaveSickTypeName);
                        } else {
                            array.push(item.stuAskleaveTypeName);
                        }

                    });
                }
                return array;
            },
            getLeaveTypeJson() {
                let array = new Array();
                let _this = this;
                this.ruleForm.checkedLeaveTypeList.forEach(function (itemName) {
                    for (let j = 0; j < _this.leaveTypeList.length; j++) {
                        if (itemName == _this.leaveTypeList[j].label) {
                            array.push({
                                stuAskleaveTypeId: _this.leaveTypeList[j].key,
                                stuAskleaveTypeName: _this.leaveTypeList[j].label
                            });
                        }
                    }

                });
                return array;
            },
            getSickTypeJson() {
                let array = new Array();
                let _this = this;
                this.ruleForm.checkedSickTypeList.forEach(function (itemName) {
                    for (let j = 0; j < _this.sickTypeList.length; j++) {
                        if (itemName == _this.sickTypeList[j].value) {
                            array.push({
                                stuAskleaveTypeId: _this.sickTypeList[j].code,
                                stuAskleaveTypeName: _this.sickTypeList[j].value
                            });
                        }
                    }
                });

                return array;
            },
            symptomJsonfun() {
                let array = new Array();
                let _this = this;
                 this.symptomList.forEach(function (itemName) {
                    for (let j = 0; j < _this.ruleForm.symptomHavlist.length; j++) {
                        if (itemName.value == _this.ruleForm.symptomHavlist[j]) {
                            array.push({
                                stuAskleaveTypeId:itemName.code,
                                stuAskleaveTypeName: itemName.value
                            });
                        }
                    }
                });
                // this.ruleForm.symptomHavlist.forEach(function (itemName) {
                //     for (let j = 0; j < _this.symptomList.length; j++) {
                //         if (itemName == _this.symptomList[j].value) {
                //             array.push({
                //                 stuAskleaveTypeId: _this.symptomList[j].code,
                //                 stuAskleaveTypeName: _this.symptomList[j].value
                //             });
                //         }
                //     }
                // });
                return array;
            },
            medicalTypeJsonfun() {
                let array = new Array();
                let _this = this;
                this.ruleForm.medicalTypeJson.forEach(function (itemName) {
                    for (let j = 0; j < _this.medicalTypeJsonList.length; j++) {
                        if (itemName == _this.medicalTypeJsonList[j].value) {
                            array.push({
                                stuAskleaveTypeId: _this.medicalTypeJsonList[j].code,
                                stuAskleaveTypeName: _this.medicalTypeJsonList[j].value
                            });
                        }
                    }
                });
                return array;
            },
            reasonJsonfun() {
                let array = new Array();
                let _this = this;
                this.ruleForm.reasonHavlist.forEach(function (itemName) {
                    for (let j = 0; j < _this.reasonJsonlist.length; j++) {
                        if (itemName == _this.reasonJsonlist[j].value) {
                            array.push({
                                stuAskleaveTypeId: _this.reasonJsonlist[j].code,
                                stuAskleaveTypeName: _this.reasonJsonlist[j].value
                            });
                        }
                    }
                });
                return array;
            },
            loadAskleaveGroupPage() {
                this.$router.push({path: 'askleaveGroup'});
            },
            leaveTypeChange() {
                if (this.ruleForm.checkedLeaveTypeList.indexOf("事假") !== -1) {
                    this.istwoshow = true;
                    // this.ruleForm.reasonHav=true;
                } else {
                    this.istwoshow = false;
                    // this.ruleForm.reasonHav=false;
                }
                if (this.ruleForm.checkedLeaveTypeList.indexOf("病假") !== -1 && this.ruleForm.checkedLeaveTypeList.indexOf("课后服务") !== -1) {
                    this.showSickTypeRemindFlag = 1;
                    this.isoneshow = true;
                    // this.ruleForm.isSickTypeGroup=true;
                    // this.ruleForm.symptomHav=true;
                } else if (this.ruleForm.checkedLeaveTypeList.indexOf("病假") !== -1) {
                    this.showSickTypeRemindFlag = 2;
                    // this.ruleForm.isSickTypeGroup=true;
                    this.isoneshow = true;
                    // this.ruleForm.symptomHav=true;
                } else if (this.ruleForm.checkedLeaveTypeList.indexOf("课后服务") !== -1) {
                    this.showSickTypeRemindFlag = 3;
                    // this.ruleForm.isSickTypeGroup=false;
                    this.isoneshow = false;
                    // this.ruleForm.symptomHav=false;


                } else {
                    this.showSickTypeRemindFlag = 4;
                    // this.ruleForm.isSickTypeGroup=false;
                    // this.ruleForm.symptomHav=false;
                    this.isoneshow = false;

                }
                ;
            }
        }
    }
</script>
<style scoped>
    .el-date-editor.el-input__inner {
        width: 160px;
    }

    .big-title {
        margin-bottom: 6px;
    }

    .big-title .mudule-info {
        height: 40px;
        font-size: 15px;
        font-weight: 700;
        line-height: 40px;
        color: #676a6c;
    }

    .big-title .mudule-info .color-block {
        width: 4px;
        display: inline-block;
        margin-right: 12px;
        vertical-align: middle;
        margin-top: 12px;
        height: 16px;
        background: #409EFF;
    }

    .color-block {
        float: left;
        width: 10px;
        height: 10px;
        background-color: #ACD6FF;
        margin: 15px 8px 0 0;
    }

    .form-title {
        padding-left: 30px;
        margin-bottom: 10px;
    }

    .mainWrap {
        overflow-x: hidden;
        overflow-y: auto;
    }
</style>
