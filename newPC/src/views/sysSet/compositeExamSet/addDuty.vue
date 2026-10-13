<template>
    <div class="addDuty">
        <div class="el-row">
            <div class="top">
                <el-button @click="$router.back()" type="default" size="medium">返回</el-button>
                <el-button size="medium" type="primary" @click.native="addDutySave()">下一步</el-button>
            </div>
        </div>
        <div class="main-wrap scrollBar" :style="{'height':nobottommaxH+'px'}">
            <el-form :label-position="labelPosition" :model="ruleForm" ref="ruleForm" label-width="120px"
                     class="demo-ruleForm">
                <el-row>
                    <el-col :span="14">
                        <el-form-item label="检查组名称" class="is-required">
                            <el-input v-model.trim="ruleForm.groupName" placeholder="请输入检查组名称（1-15个字符）"
                                      :maxlength="15"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="24">
                    <el-col :span="13">
                        <el-form-item label="检查范围" class="is-required">
                            <address-book v-model="ruleForm.twoAddress" :config="ruleForm.configData"
                                          ref="address"></address-book>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="24">
                    <el-col :span="13">
                        <el-form-item label="检查方式" class="is-required">
                            <el-radio-group v-model="ruleForm.isStar">
                                <el-radio :label="1">打星</el-radio>
                                <el-radio :label="2">评分</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                </el-row>
                
                 <el-row :gutter="24">
                    <el-col :span="8">
                        <el-form-item label="" class="is-required">
                             <el-checkbox v-model="ruleForm.isDefaultScore">设置默认分数</el-checkbox>
                        </el-form-item>
                    </el-col>
                     <el-col :span="8" v-if="ruleForm.isDefaultScore">
                        <el-form-item label="默认分数" class="is-required">
                            <el-input-number v-model.trim="ruleForm.defaultScore" size="medium" :precision="1" placeholder='请输入数字' :step="0.1" :max="100" :min="0"></el-input-number>
                        </el-form-item>
                    </el-col>                    
                </el-row>               
                <el-row v-if="ruleForm.events==1">
                    <el-col :span="24">
                        <el-form-item label="" label-width="0px" prop="groupName">
                            <el-checkbox v-model="ruleForm.events">是否记录大事记</el-checkbox>
                        </el-form-item>
                    </el-col>
                </el-row>
                <!--xin增-->
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="" label-width="0px" prop="groupName">
                            <el-checkbox v-model="ruleForm.isRemind">提醒检查员 <span
                                style="color:red">默认17:00提醒检查员确认检查数据</span></el-checkbox>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="" label-width="0px" prop="groupName">
                            <el-checkbox v-model="ruleForm.isFeedback">是否记录反馈</el-checkbox>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row v-if="ruleForm.isFeedback">
                    <el-col :span="24">
                        <el-form-item label="" label-width="0px" prop="groupName">
                            <el-checkbox v-model="ruleForm.noCheck">推送记录反馈</el-checkbox>
                            <div class="short-book" v-if="ruleForm.noCheck">
                                <address-book v-model="ruleForm.feedbackUser" :config="configPushData"
                                              ref="address"></address-book>
                            </div>
                            &nbsp;&nbsp;<span style="color:red">实时推送问题反馈</span>
                        </el-form-item>

                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="" label-width="0px" prop="groupName">
                            <el-checkbox v-model="ruleForm.isPush">是否推送问题反馈</el-checkbox>
                            <div class="short-book" v-if="ruleForm.isPush">
                                <address-book v-model="ruleForm.pushUser" :config="configPushData"
                                              ref="address"></address-book>
                            </div>
                            &nbsp;&nbsp;<span style="color:red">21:00点推送问题反馈</span>
                        </el-form-item>

                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="" label-width="0px" prop="groupName">
                            <el-checkbox v-model="ruleForm.isPushResult">推送检查结果</el-checkbox>
                            <div class="short-book" v-if="ruleForm.isPushResult">
                                <address-book v-model="ruleForm.pushResultUser" :config="configPushData"
                                              ref="address"></address-book>
                            </div>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24" v-if="ruleForm.isPushResult">
                        <el-form-item label="推送结果时间" prop="groupName">
                            <el-radio-group v-model="ruleForm.pushResultTime">
                                <el-radio label="12:00">12:00</el-radio>
                                <el-radio label="17:00">17:00</el-radio>
                                <el-radio label="18:00">18:00</el-radio>
                                <el-radio label="19:00">19:00</el-radio>
                                <el-radio label="20:00">20:00</el-radio>
                                <el-radio label="21:00">21:00</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                </el-row>
               
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="" label-width="0px" prop="groupName">
                            <el-checkbox v-model="ruleForm.isInitScore" :true-label="1" :false-label="2">
                                自动初始化分数（默认早上6:30初始化全校班级检查分数）
                            </el-checkbox>
                        </el-form-item>
                    </el-col>
                </el-row>
                 <el-row>
                    <el-col :span="24"  >
                        <el-form-item label="" label-width="0px" prop="groupName">
                            <el-checkbox v-model="ruleForm.isRemindClassHeader" :true-label="1" :false-label="2">提醒班主任
                            </el-checkbox>
                        </el-form-item>
                    </el-col>
                </el-row>
                 <el-row :gutter="24" v-if="ruleForm.isRemindClassHeader==1">
                   <el-col :span="13">
                        <el-form-item label-width="50px" class="is-required">
                           <el-checkbox v-model="ruleForm.isPraiseScore">表扬提醒(勾选后达到该分数给班主任发送提醒)</el-checkbox>
                        </el-form-item>
                    </el-col>
                     <el-col :span="11" v-if="ruleForm.isPraiseScore">
                        <el-form-item label-width="0px" class="is-required">
                             <el-input-number v-model.trim="ruleForm.praiseScore" size="medium" :precision="1" placeholder='请输入数字' :step="0.1" :max="100" :min="0"></el-input-number>
                            分
                             </el-form-item>
                    </el-col>
                    <el-col :span="13">
                        <el-form-item  label-width="50px" class="is-required">
                            <el-checkbox v-model="ruleForm.isCriticismScore">批评提醒(勾选后低于该分数给班主任发送提醒)</el-checkbox>
                        </el-form-item>
                    </el-col>
                   
                    <el-col :span="11" v-if="ruleForm.isCriticismScore">
                        <el-form-item label-width="0px" class="is-required">
                            <el-input-number v-model.trim="ruleForm.criticismScore" size="medium" :precision="1" placeholder='请输入数字' :step="0.1" :max="100" :min="0"></el-input-number>
                          分
                           </el-form-item>
                    </el-col>
                </el-row>
                 <el-form-item label="提醒抄送"  v-if="ruleForm.isRemindClassHeader==1">
                            <el-checkbox v-model="ruleForm.isRemindClassHeaderElse" :true-label="1" :false-label="2">抄送副班主任
                            </el-checkbox>
                            <el-checkbox v-model="ruleForm.isRemindGradeHeade" :true-label="1" :false-label="2">抄送年级长
                            </el-checkbox>
                            <el-checkbox v-model="ruleForm.isRemindTh" :true-label="1" :false-label="2">抄送任课教师（仅关联课表生效)
                            </el-checkbox>
                            <el-checkbox v-model="ruleForm.isRemindElseUser" :true-label="1" :false-label="2">抄送其他人员
                            </el-checkbox>
                            <div v-if="ruleForm.isRemindElseUser==1"><address-book v-model="ruleForm.elseUserJson" title="抄送其他人员" :config="newconfigPushData"
                                              ref="address"></address-book></div>
                </el-form-item>
                
            </el-form>
        </div>
    </div>
</template>
<script>
    import AddressBook from '@/components/AddressBook/indexExpand';
    import {addDuty} from '@/api/compositeExamSet';
    import mixin from '@/mixins/windowResize';

    const Events = {OK: 1, NO: 2};//是否记录大事记（1-记录；2-不记录）
    const IsPush = {OK: 1, NO: 0};//是否推送大事记及问题反馈（0-不推；1-推送）
    const IsFeedback = {OK: 1, NO: 0};//	是否记录反馈（0-不记；1-记）
    const IsPushResult = {OK: 1, NO: 0};//	是否推送检查结果（0-不推；1-推送）
    const IsRemind = {OK: 0, NO: 1};//	0:提醒 1:不提醒(☆)
    export default {
        components: {
            AddressBook,
        },
        data() {
            return {
                tabPosition: 1,
                currentIndex: 1,
                labelPosition: 'left',
                maxScore: 5,
                scoreMaxArr: [{
                    value: 1,
                    label: 1
                }, {
                    value: 2,
                    label: 2
                }, {
                    value: 3,
                    label: 3
                }, {
                    value: 4,
                    label: 4
                }, {
                    value: 5,
                    label: 5
                }],
                ruleForm: {
                    groupName: '',
                    alwaysDuty: false,
                    groupSubName: '',
                    defaultScore: 0,
                    praiseScore: 0,
                    criticismScore: 0,
                    twoAddress: {},
                    configData: {
                        title: '请选择检查范围',
                        depart: {
                            target: 'depart',
                            departType: 's',
                            userTypes: '3',
                            isIgnoreDepart: true,
                            notCheckSchool: true
                        }
                    },
                    events: false,
                    isPush: false,
                    isFeedback: false,
                    isPushResult: false,
                    pushResultUser: {},
                    pushUser: {},
                    noCheck: false,
                    feedbackUser: {},
                    isRemind: false,
                    pushResultTime: "21:00",
                    isStar: 1,
                    step: 1,
                    isInitScore: 2,
                    isRemindClassHeader: 2,
                    isCriticismScore:false,
                    isDefaultScore:false,
                    isPraiseScore:false,
                    isRemindClassHeaderElse: 2,//	是否推送副班主任 1推送 2不推送	number	2023-11-13
                    isRemindElseUser: 2,//	是否推送其他人员 1推送 2不推送	number	2023-11-13
                    isRemindGradeHeade: 2,//	是否推送年级组长 1推送 2不推送	number	2023-11-13
                    isRemindTh: 2,//	是否推送任课老师 1推送 2不推送	number	2023-11-13
                    elseUserJson:{},
                    
                },
                 newconfigPushData: {
                    title: '抄送其他人员设置',
                    depart: {target: 'user', departType: 't', userTypes: '1'},
                    group: true
                },
                configPushData: {
                    title: '推送人设置',
                    depart: {target: 'user', departType: 't', userTypes: '1'},
                    group: true
                },
                configDataPeople: {title: '请选择检查人员', depart: {target: 'user', departType: 't', userTypes: '1'}},
                tableStr: [],
                lastClassIds: [],
                lastGradeIds: [],
                lastPushUser: [],
                lastFeedbackUser: [],
                lastPushResultUser: [],
                lastMonCheckUser: [],
                lastTuesdayCheckUser: [],
                lastWednesdayCheckUser: [],
                lastThursdayCheckUser: [],
                lastFridayCheckUser: []
            }
        },
        created() {
            this.ruleForm.defaultScore = 1;
            this.ruleForm.praiseScore = 1;
            this.ruleForm.criticismScore = 1;
            if (this.ruleForm.alwaysDuty) {
                this.tableStr.unshift({
                    groupName: '总值班',
                    groupType: 1,
                    monCheckUser: {},
                    tuesdayCheckUser: {},
                    wednesdayCheckUser: {},
                    thursdayCheckUser: {},
                    fridayCheckUser: {},
                });
            } else {
                this.tableStr.shift();
            }
        },
        mixins: [mixin],
        watch: {
            'ruleForm.alwaysDuty': function (value, oldValue) {
                if (value) {
                    this.tableStr.unshift({
                        groupName: '总值班',
                        groupType: 1,
                        monCheckUser: {},
                        tuesdayCheckUser: {},
                        wednesdayCheckUser: {},
                        thursdayCheckUser: {},
                        fridayCheckUser: {},
                    });
                } else {
                    this.tableStr.shift();
                }
            }
        },
        methods: {
            delGroup(index) {
                this.tableStr.splice(index, 1);
                this.currentIndex--;
            },
            addGroup() {
                if (this.tableStr) {
                    this.tableStr.push({
                        groupName: `分组${this.currentIndex}`,
                        groupType: 2,
                        delBtn: false,
                        monCheckUser: {},
                        tuesdayCheckUser: {},
                        wednesdayCheckUser: {},
                        thursdayCheckUser: {},
                        fridayCheckUser: {},
                    });
                    this.currentIndex++;
                }

            },
            addDutySave() {
                //保存
                let flag = true;
                if (this.ruleForm.groupName === "") {
                    this.$alert('请输入检查组名称！', '提示', {
                        type: 'error'
                    }, {
                        confirmButtonText: '确定'
                    });
                    return false;
                }
                if(this.ruleForm.isDefaultScore){
                    if (!this.ruleForm.defaultScore) {
                    this.$message({
                        type: 'error',
                        message: '请输入默认分'
                    });
                    return false;
                  }
                }else{
                    this.ruleForm.defaultScore=0
                }
                if(this.ruleForm.isPraiseScore&&(this.ruleForm.isRemindClassHeader==1)){
                   if (!this.ruleForm.praiseScore) {
                    this.$message({
                        type: 'error',
                        message: '请输入表扬分数'
                    });
                    return false;
                }
                }else{
                    this.ruleForm.praiseScore=0
                }
                if(this.ruleForm.isCriticismScore&&(this.ruleForm.isRemindClassHeader==1)){
                    if (!this.ruleForm.criticismScore) {
                    this.$message({
                        type: 'error',
                        message: '请输入批评分数'
                    });
                    return false;
                }
                }else{
                  this.ruleForm.criticismScore=0
                }
               if(this.ruleForm.isDefaultScore&&this.ruleForm.isCriticismScore&&(this.ruleForm.isRemindClassHeader==1)){
                   if (Number(this.ruleForm.defaultScore) <= Number(this.ruleForm.criticismScore)) {
                    this.$alert('批评分数应小于默认分数！', '提示', {
                        type: 'error'
                    }, {
                        confirmButtonText: '确定'
                    });
                    return false;
                }
               }
               if(this.ruleForm.isDefaultScore&&this.ruleForm.isPraiseScore&&(this.ruleForm.isRemindClassHeader==1)){
                  if (Number(this.ruleForm.praiseScore) < Number(this.ruleForm.defaultScore)) {
                    this.$alert('表扬分数应大于等于默认分数！', '提示', {
                        type: 'error'
                    }, {
                        confirmButtonText: '确定'
                    });
                    return false;
                }
               }
               if((this.ruleForm.isRemindClassHeader==1)&&(!this.ruleForm.isCriticismScore)&&(!this.ruleForm.isPraiseScore)){
                    this.$alert('表扬分和批评分至少勾选一个！', '提示', {
                        type: 'error'
                    }, {
                        confirmButtonText: '确定'
                    });
                    return false;
               }
               
                if (this.ruleForm.isPush) {
                    if (!this.ruleForm.pushUser.userJson || this.ruleForm.pushUser.userJson.length === 0) {
                        this.$alert('请选择推送人！', '提示', {
                            type: 'error'
                        }, {
                            confirmButtonText: '确定'
                        });
                        return false;
                    }
                }
                if (this.ruleForm.isFeedback && this.ruleForm.noCheck) {
                    if (!this.ruleForm.feedbackUser.userJson || this.ruleForm.feedbackUser.userJson.length === 0) {
                        this.$alert('请选择反馈推送人！', '提示', {
                            type: 'error'
                        }, {
                            confirmButtonText: '确定'
                        });
                        return false;
                    }
                }
                if (this.ruleForm.isPushResult) {
                    if (!this.ruleForm.pushResultUser.userJson || this.ruleForm.pushResultUser.userJson.length === 0) {
                        this.$alert('请选择检查结果推送人！', '提示', {
                            type: 'error'
                        }, {
                            confirmButtonText: '确定'
                        });
                        return false;
                    }
                }

                if (!this.ruleForm.twoAddress.departJson || this.ruleForm.twoAddress.departJson.length === 0) {
                    this.$alert('请选择检查范围！', '提示', {
                        type: 'error'
                    }, {
                        confirmButtonText: '确定'
                    });
                    return false;
                }
                if((this.ruleForm.isRemindElseUser==1)&&(this.ruleForm.isRemindClassHeader==1)&&(this.ruleForm.elseUserJson.userJson.length === 0)){
                   this.$alert('请选择抄送其他人员！', '提示', {
                        type: 'error'
                    }, {
                        confirmButtonText: '确定'
                    });
                    return false;
                }

                // if (this.tableStr.length === 0) {
                //     this.$alert('请设置值班人员信息！', '提示', {
                //         type: 'error'
                //     }, {
                //         confirmButtonText: '确定'
                //     });
                //     return false;
                // }

                if (this.ruleForm.twoAddress.departJson) {
                    this.lastClassIds = [];
                    this.lastGradeIds = [];
                    this.ruleForm.twoAddress.departJson.forEach((item) => {
                        if (item.type == 3) {
                            this.lastGradeIds.push(item.id);
                        } else if (item.type = 4) {
                            this.lastClassIds.push(item.id);
                        }
                    });
                    this.lastGradeIds = this.lastGradeIds.join(",");
                    this.lastClassIds = this.lastClassIds.join(",");
                }

                if (this.ruleForm.pushUser.userJson) {
                    this.lastPushUser = [];
                    this.ruleForm.pushUser.userJson.forEach((item) => {
                        this.lastPushUser.push(item.id);
                    });
                    this.lastPushUser = this.lastPushUser.join(",");
                }

                if (this.ruleForm.feedbackUser.userJson) {
                    this.lastFeedbackUser = [];
                    this.ruleForm.feedbackUser.userJson.forEach((item) => {
                        this.lastFeedbackUser.push(item.id);
                    });
                    this.lastFeedbackUser = this.lastFeedbackUser.join(",");
                }

                if (this.ruleForm.pushResultUser.userJson) {
                    this.lastPushResultUser = [];
                    this.ruleForm.pushResultUser.userJson.forEach((item) => {
                        this.lastPushResultUser.push(item.id);
                    });
                    this.lastPushResultUser = this.lastPushResultUser.join(",");
                }

                const groupArray = [];
                this.tableStr.forEach((item, index) => {
                    if (item.groupName == '') {
                        this.$alert('请填写组名！', '提示', {
                            type: 'error'
                        }, {
                            confirmButtonText: '确定'
                        });
                        flag = false;
                    }
                    groupArray.push(item.groupName);
                    if (item.monCheckUser) {
                        this.lastMonCheckUser = [];
                        if (item.monCheckUser.userJson && item.monCheckUser.userJson.length !== 0) {
                            item.monCheckUser.userJson.forEach((item) => {
                                this.lastMonCheckUser.push(item.id);
                            })

                        }
                        this.lastMonCheckUser = this.lastMonCheckUser.join(",");
                        item.monCheckUser = this.lastMonCheckUser;


                    }
                    if (item.tuesdayCheckUser) {
                        this.lastTuesdayCheckUser = [];
                        if (item.tuesdayCheckUser.userJson && item.tuesdayCheckUser.userJson.length !== 0) {
                            item.tuesdayCheckUser.userJson.forEach((item) => {
                                this.lastTuesdayCheckUser.push(item.id);
                            })
                        }

                        this.lastTuesdayCheckUser = this.lastTuesdayCheckUser.join(",");
                        item.tuesdayCheckUser = this.lastTuesdayCheckUser;
                    }
                    if (item.wednesdayCheckUser) {
                        this.lastWednesdayCheckUser = [];
                        if (item.wednesdayCheckUser.userJson && item.wednesdayCheckUser.userJson.length !== 0) {
                            item.wednesdayCheckUser.userJson.forEach((item) => {
                                this.lastWednesdayCheckUser.push(item.id);
                            })
                        }
                        this.lastWednesdayCheckUser = this.lastWednesdayCheckUser.join(",");
                        item.wednesdayCheckUser = this.lastWednesdayCheckUser;
                    }
                    if (item.thursdayCheckUser) {
                        this.lastThursdayCheckUser = [];
                        if (item.thursdayCheckUser.userJson && item.thursdayCheckUser.userJson.length !== 0) {
                            item.thursdayCheckUser.userJson.forEach((item) => {
                                this.lastThursdayCheckUser.push(item.id);
                            })
                        }
                        this.lastThursdayCheckUser = this.lastThursdayCheckUser.join(",");
                        item.thursdayCheckUser = this.lastThursdayCheckUser;
                    }
                    if (item.fridayCheckUser) {
                        this.lastFridayCheckUser = [];
                        if (item.fridayCheckUser.userJson && item.fridayCheckUser.userJson.length !== 0) {
                            item.fridayCheckUser.userJson.forEach((item) => {
                                this.lastFridayCheckUser.push(item.id);
                            })
                        }
                        this.lastFridayCheckUser = this.lastFridayCheckUser.join(",");
                        item.fridayCheckUser = this.lastFridayCheckUser;
                    }

                });
                for (let i = 0; i < groupArray.length; i++) {
                    if (groupArray[i] == groupArray[i + 1]) {
                        this.$alert('组名重复,请重新填写！', '提示', {
                            type: 'error'
                        }, {
                            confirmButtonText: '确定'
                        });
                        flag = false;
                    }
                }
                if (flag) {
                    let params = new URLSearchParams();                   
                    params.append('dutyName', this.ruleForm.groupName);
                    params.append('alwaysDuty', this.ruleForm.alwaysDuty ? "总值班" : '');
                    params.append('defaultScore', this.ruleForm.defaultScore);
                    params.append('praiseScore', this.ruleForm.praiseScore);
                    params.append('criticismScore', this.ruleForm.criticismScore);
                    params.append('classIds', this.lastClassIds);
                    params.append('gradeIds', this.lastGradeIds);
                    params.append('isRemind', this.ruleForm.isRemind ? IsRemind.OK : IsRemind.NO);
                    params.append('events', this.ruleForm.events ? Events.OK : Events.NO);
                    params.append('isPush', this.ruleForm.isPush ? IsPush.OK : IsPush.NO);
                    params.append('isFeedback', this.ruleForm.isFeedback ? IsFeedback.OK : IsFeedback.NO);
                    params.append('isPushResult', this.ruleForm.isPushResult ? IsPushResult.OK : IsPushResult.NO);
                    params.append('pushResultUser', this.lastPushResultUser);
                    params.append('feedbackUser', this.lastFeedbackUser);
                    params.append('pushUser', this.lastPushUser);
                    params.append('tableStr', JSON.stringify(this.tableStr));
                    params.append('step', this.ruleForm.step);
                    params.append('isStar', this.ruleForm.isStar);
                    params.append('pushResultTime', this.ruleForm.isPushResult ? this.ruleForm.pushResultTime : "");
                    params.append('isInitScore', this.ruleForm.isInitScore);
                    params.append('isRemindClassHeader',this.ruleForm.isRemindClassHeader);
                    params.append('isPraiseScore', this.ruleForm.isRemindClassHeader==1?(this.ruleForm.isPraiseScore?1:2):2);
                    params.append('isDefaultScore', this.ruleForm.isDefaultScore?1:2);
                    params.append('isCriticismScore', this.ruleForm.isRemindClassHeader==1?(this.ruleForm.isCriticismScore?1:2):2);
                     params.append('isRemindClassHeaderElse',this.ruleForm.isRemindClassHeader==1?this.ruleForm.isRemindClassHeaderElse:2);
                     params.append('isRemindElseUser',this.ruleForm.isRemindClassHeader==1?this.ruleForm.isRemindElseUser:2);
                     params.append('isRemindGradeHeade',this.ruleForm.isRemindClassHeader==1?this.ruleForm.isRemindGradeHeade:2);
                     params.append('isRemindTh',this.ruleForm.isRemindClassHeader==1?this.ruleForm.isRemindTh:2);
                     params.append('elseUserJson',JSON.stringify( (this.ruleForm.isRemindElseUser==1&&this.ruleForm.isRemindClassHeader==1)?this.ruleForm.elseUserJson.userJson:[]));
                    addDuty(params).then(res => {
                        let data = res.data;
                        if (data.code === 200) {
                            this.$message({
                                type: 'success',
                                message: '值班表设置成功！'
                            });

                            this.$router.replace({
                                path: 'editDutytwo',
                                query: {
                                    dutyId: data.data.id
                                }
                            })
                        }
                    })
                }


            }
        }

    }
</script>
<style lang="scss" scoped>
    .el-input-number--medium{
        width: 130px;
    }
    .top {
        padding-bottom: 10px;
        border-bottom: 1px solid #e7eaec;
    }

    .scrollBar {
        overflow-x: hidden;
        overflow-y: auto;

        &::-webkit-scrollbar-track-piece {
            background: #d3dce6;
        }

        &::-webkit-scrollbar {
            width: 6px;
        }

        &::-webkit-scrollbar-thumb {
            background: #99a9bf;
            border-radius: 20px;
        }
    }

    .clearfix:after {
        content: "";
        height: 0;
        display: block;
        clear: both;
        visibility: hidden;
    }

    ul, li {
        list-style: none;
    }

    .addDuty {
        padding: 12px;
    }

    .el-form {
        width: 810px;
        margin: 0 auto;
    }

    .main-wrap {
        padding-top: 20px;
    }

    .addDuty_btn {
        height: 36px;
        line-height: 36px;
        color: #20a0ff;
        font-size: 14px;
        cursor: pointer;

        i {
            font-weight: bold;
        }
    }

    .addDuty_btn:hover {
        color: #000;
    }

    .table {
        width: 100%;
        max-width: 100%;
        margin-bottom: 20px;
        font-size: 14px;
    }

    .table > .thead > .tr > .th, .table > .tbody > .tr > .td {
        float: left;
        width: 16%;
    }

    .del-btn {
        float: left;
        width: 30px;
        height: 30px;
        text-align: center;
        line-height: 30px;
        margin-top: 10px;
        color: red;
        cursor: pointer;
    }

    .table > .tbody > .tr > .td, .table > .tbody > .tr > .th, .table > .tfoot > .tr > .td, .table > .tfoot > .tr > .th, .table > .thead > .tr > .td {
        padding: 8px;
        line-height: 1.42857143;
        vertical-align: top;
        border-top: 1px solid #ddd;
    }

    .table > .thead > .tr > .th {
        padding: 8px;
        line-height: 1.42857143;
        vertical-align: top;
        box-sizing: border-box;
        border-bottom: 1px solid #ddd;
        text-align: center;
    }

    .table .td > div {
        height: 100%;
        line-height: 34px;

        .chose-teacher-hint {
            color: #8E8E8E;
            line-height: 34px;
            cursor: pointer;
        }
    }

    .el-form-item.is-required .el-form-item__label:before {
        content: "*";
        color: #ff4949;
        margin-right: 4px;
    }

    .el-form-item__error {
        color: #ff4949;
        font-size: 12px;
        line-height: 1;
        padding-top: 4px;
        position: absolute;
        top: 100%;
        left: 0;
    }

    .short-book {
        width: 334px;
        display: inline-block;
        vertical-align: middle;
        margin: 0 8px;
    }
</style>
<style scoped>
    .addDuty .address-box {
        height: 300px !important;
    }
</style>
