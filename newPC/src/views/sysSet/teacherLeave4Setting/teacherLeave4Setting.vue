<template>
    <div class="main-container">
        <div class="el-row menu-tools">
            <el-button  @click="$router.back()" size="medium">返回</el-button>
            <el-button type="primary" size="medium"   @click="saveHandler()">保存</el-button>
            <el-button type="primary" size="medium"   @click.native="jumpToPage('rulelist')">请假规则设置</el-button>
        </div>
        <el-form ref="form" :model="formData" :rules="formRule" label-width="140px">
                <div>
                <div class="title">工作时间设置</div>
                <div>
                    <el-form-item label="上午：" prop="amDuration">
                        <el-time-picker
                            v-model="formData.amStartTime"
                            format="HH:mm"
                            value-format="HH:mm"
                            placeholder="任意时间点"
                            :picker-options="{
                              selectableRange: '00:00:00 - 12:00:00'
                            }"
                        >
                        </el-time-picker>
                        <el-time-picker
                            v-model="formData.amEndTime"
                            format="HH:mm"
                            value-format="HH:mm"
                            placeholder="任意时间点"
                            :picker-options="{
                              selectableRange: '00:00:00 - 12:00:00'
                            }"
                        >
                        </el-time-picker>
                    </el-form-item>
                    <el-form-item label="下午：" prop="pmDuration">
                        <el-time-picker
                            v-model="formData.pmStartTime"
                            format="HH:mm"
                            value-format="HH:mm"
                            placeholder="任意时间点"
                            :picker-options="{
                              selectableRange: '12:00:00 - 23:59:59'
                            }"
                        >
                        </el-time-picker>
                        <el-time-picker
                            v-model="formData.pmEndTime"
                            format="HH:mm"
                            value-format="HH:mm"
                            placeholder="任意时间点"
                            :picker-options="{
                              selectableRange: '12:00:00 - 23:59:59'
                            }"
                        >
                        </el-time-picker>
                    </el-form-item>
                </div>
            </div>
            <div>
                <div class="title">请假类型设置</div>
                <div>
                    <el-form-item label="请假类型：" prop="leaveType">
                        <el-checkbox-group v-model="formData.leaveType">
                                <el-checkbox :label="leaveTypeItem.code" v-for="(leaveTypeItem,indexa) in leaveTypeList" :key="indexa">{{leaveTypeItem.value}}</el-checkbox>
                        </el-checkbox-group>
                    </el-form-item>
                </div>
            </div>
             <div>
                <div class="title">请假方式设置</div>
                <div>
                    <el-form-item  >
                      <el-checkbox v-model="formData.askTypeTimeLeng" :true-label="2" :false-label="1">时长</el-checkbox>
                       <!-- <el-checkbox v-model="formData.askTypeClassHonr" :true-label="2" :false-label="1">节次</el-checkbox> -->
                       <el-checkbox v-model="formData.askTypeDay" :true-label="2" :false-label="1">按天</el-checkbox>
                    </el-form-item>
                </div>
            </div>
            <div v-show="formData.leaveType.includes('1')">
                <div class="title">
                    <el-checkbox v-model="formData.isSickTypeGroup" :true-label="1" :false-label="2"></el-checkbox>&nbsp;&nbsp;病假需要分类
                </div>
                <div v-show="formData.isSickTypeGroup == 1">
                    <el-form-item label="请假类型：" prop="sickType">
                        <el-checkbox-group v-model="formData.sickType">
                            <el-checkbox :label="sickItem.code" v-for="(sickItem,indexa) in sicTypeList" :key="indexa">{{sickItem.value}}</el-checkbox>
                        </el-checkbox-group>
                    </el-form-item>
                </div>
            </div>
            <div>
                <div class="title">
                    <el-checkbox v-model="formData.showStopFire" :true-label="2" :false-label="1"></el-checkbox>&nbsp;&nbsp;显示停伙
                </div>
            </div>
            <div>
                <div class="title">
                    <el-checkbox v-model="formData.remindBatch" :true-label="2" :false-label="1"></el-checkbox>&nbsp;&nbsp;是否每天定时提醒处理
                </div>
            </div>
            <div>
                <div class="title">
                    <el-checkbox v-model="formData.remindSickFile" :true-label="2" :false-label="1"></el-checkbox>&nbsp;&nbsp;每天定时提醒上传病假材料
                </div>
            </div>
            <div>
                <div class="title">
                    <el-checkbox v-model="formData.showAdjustable" :true-label="2" :false-label="1"></el-checkbox>&nbsp;&nbsp;课务安排
                </div>
            </div>
        </el-form>
    </div>
</template>

<script>
    import {getDicByCode} from '@/utils/utils';
    import {
        addAndUpdateThAskLeaveFourInit,
        getThAskLeaveFourInit
    } from '@/api/systemSet/teacherLeave4Setting';

    export default {
        name: "teacherLeave4Setting",
        data() {
            const durationValidator1 = (rule, value, callback) => {
                if (!this.formData.amEndTime || !this.formData.amStartTime) {
                    return callback(new Error("请选择时间！"));
                } else if(this.formData.amStartTime >= this.formData.amEndTime) {
                    return callback(new Error('开始时间应小于结束时间'));
                } else {
                    return callback();
                }
            };
            const durationValidator2 = (rule, value, callback) => {
                if (!this.formData.pmEndTime || !this.formData.pmStartTime) {
                    return callback(new Error("请选择时间！"));
                } else if(this.formData.pmStartTime >= this.formData.pmEndTime) {
                    return callback(new Error('开始时间应小于结束时间'));
                } else {
                    return callback();
                }
            };
            const leaveTypeValidator = (rule, value, callback) => {
                if(this.formData.leaveType.length === 0) {
                    return callback(new Error("请选择请假类型！"));
                } else {
                    return callback();
                }
            };
            const sickTypeValidator = (rule, value, callback) => {
                if(this.formData.leaveType.includes('1') && this.formData.isSickTypeGroup == 1 && this.formData.sickType.length === 0) {
                    return callback(new Error("请选择疾病类型！"));
                } else {
                    return callback();
                }
            };
            return {
                leaveTypeList: [],
                sicTypeList: [],
                formData: {
                    amStartTime: '',
                    amEndTime: '',
                    pmEndTime: '',
                    pmStartTime: '',
                    isSickTypeGroup: 2,
                    leaveType: [],
                    sickType: [],
                    showStopFire: 1,
                    remindBatch: 2,
                    remindSickFile:1,
                    showAdjustable:1,
                    askTypeClassHonr:1,
                    askTypeDay:1,
                    askTypeTimeLeng:1
                },
                formRule: {
                    amDuration: [
                        { required: true, validator: durationValidator1},
                    ],
                    pmDuration: [
                        { required: true, validator: durationValidator2},
                    ],
                    leaveType: [
                        { required: true, validator: leaveTypeValidator},
                    ],
                    sickType: [
                        { required: true, validator: sickTypeValidator},
                    ]
                },
            }
        },
        created() {
            getDicByCode('teacherAskLeave1')
                .then(leaveTypeList => {
                    this.leaveTypeList = leaveTypeList;
                });
            getDicByCode('sicktypeName')
                .then(sicTypeList => {
                    this.sicTypeList = sicTypeList;
                });
            getThAskLeaveFourInit()
                .then(res => res.data)
                .then(data => {
                    const pageData = data.data;
                    this.formData.amStartTime = pageData.amStartTime;
                    this.formData.askTypeClassHonr = pageData.askTypeClassHonr;
                    this.formData.askTypeDay = pageData.askTypeDay;
                    this.formData.askTypeTimeLeng = pageData.askTypeTimeLeng;
                    this.formData.remindSickFile = pageData.remindSickFile;
                    this.formData.amEndTime = pageData.amEndTime;
                    this.formData.pmStartTime = pageData.pmStartTime;
                    this.formData.pmEndTime = pageData.pmEndTime;
                    this.formData.isSickTypeGroup = pageData.isSickTypeGroup;
                    this.formData.leaveType = pageData.leaveTypeList.map(({leaveTypeId}) => `${leaveTypeId}`);
                    this.formData.sickType = pageData.sickList.map(({sickType}) => `${sickType}`);
                    this.formData.showStopFire = pageData.showStopFire;
                    this.formData.remindBatch = pageData.remindBatch;
                    this.formData.showAdjustable = pageData.showAdjustable||1;
                });
        },
        methods: {
             jumpToPage(path, query = {}) {
                this.$router.push({
                    path,
                    query
                })
            },
            saveHandler() {
                if(this.formData.askTypeClassHonr==1&&this.formData.askTypeDay==1&&this.formData.askTypeTimeLeng==1){
                     this.$message({message: '请选择请假方式',type: 'warn'});
                     return
                }
                this.$refs.form.validate((isVaid) => {
                    if(isVaid) {
                        const leaveTypeJson = [];
                        this.leaveTypeList.forEach(item => {
                            if(this.formData.leaveType.includes(item.code)) {
                                leaveTypeJson.push({
                                    leaveTypeId: item.code,
                                    leaveTypeName: item.value
                                });
                            }
                        });
                        const sickTypeJson = [];
                        if(this.formData.leaveType.includes('1') && this.formData.isSickTypeGroup == 1) {
                            this.sicTypeList.forEach(item => {
                                if(this.formData.sickType.includes(item.code)) {
                                    sickTypeJson.push({
                                        sickType: item.code,
                                        sickTypeName: item.value
                                    });
                                }
                            })

                        }
                        const args = {
                            amStartTime: this.formData.amStartTime,
                            amEndTime: this.formData.amEndTime,
                            pmEndTime: this.formData.pmEndTime,
                            pmStartTime: this.formData.pmStartTime,
                            leaveTypeJson,
                            sickTypeJson,
                            isSickTypeGroup: this.formData.isSickTypeGroup,
                            showStopFire: this.formData.showStopFire,
                            remindBatch: this.formData.remindBatch,
                            remindSickFile:this.formData.remindSickFile,
                            showAdjustable:this.formData.showAdjustable,
                            askTypeClassHonr:this.formData.askTypeClassHonr,
                            askTypeDay:this.formData.askTypeDay,
                            askTypeTimeLeng:this.formData.askTypeTimeLeng,
                        };
                        addAndUpdateThAskLeaveFourInit(args)
                            .then(res => res.data)
                            .then(data => {
                                if(data.result) {
                                    this.$message.success('设置成功');
                                    setTimeout(() => {
                                        this.$router.back();
                                    }, 500);
                                }
                            })
                    }
                })
            }
        }
    }
</script>

<style lang="scss" scoped>
    .main-container {
        padding:12px;
        box-sizing: border-box;
        .menu-tools {
            border-bottom: 1px solid #e7eaec;
            padding-bottom: 10px;
        }
    }
    .title {
        height: 20px;
        line-height: 20px;
        margin: 15px 0;
        padding-left: 8px;
        border-left: 4px solid #409eff;
        color: #333;
    }
    .el-form{
        width: 810px;
       margin: 0 auto;
    }
</style>
