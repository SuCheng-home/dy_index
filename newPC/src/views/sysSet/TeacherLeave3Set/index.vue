<template>
    <div class="app-container calendar-list-container">
        <backtool>
            <el-button type="primary" size="medium" :loading="save_loading"
                       @click.native="saveFunc">保存
            </el-button>
            <el-button type="primary" size="medium" :loading="save_loading"
                       @click.native="jumpToPage('leaveSettingRuleList')">请假规则设置
            </el-button>
        </backtool>
        <div style="width:810px;margin:10px auto 0 auto;">
            <el-form :model="ruleForm" ref="ruleForm" :rules="rules" label-width="140px" class="demo-ruleForm">
                 <el-form-item label="上午：" prop="amDuration">
                        <el-time-picker
                            v-model="ruleForm.amStartTime"
                            format="HH:mm"
                            value-format="HH:mm"
                            placeholder="任意时间点"
                            :picker-options="{
                              selectableRange: '06:00:00 - 12:00:00'
                            }"
                        >
                        </el-time-picker>
                        <el-time-picker
                            v-model="ruleForm.amEndTime"
                            format="HH:mm"
                            value-format="HH:mm"
                            placeholder="任意时间点"
                            :picker-options="{
                              selectableRange: '06:00:00 - 12:00:00'
                            }"
                        >
                        </el-time-picker>
                    </el-form-item>
                    <el-form-item label="下午：" prop="pmDuration">
                        <el-time-picker
                            v-model="ruleForm.pmStartTime"
                            format="HH:mm"
                            value-format="HH:mm"
                            placeholder="任意时间点"
                            :picker-options="{
                              selectableRange: '12:00:00 - 22:00:00'
                            }"
                        >
                        </el-time-picker>
                        <el-time-picker
                            v-model="ruleForm.pmEndTime"
                            format="HH:mm"
                            value-format="HH:mm"
                            placeholder="任意时间点"
                            :picker-options="{
                              selectableRange: '12:00:00 - 22:00:00'
                            }"
                        >
                        </el-time-picker>
                    </el-form-item>
                <el-form-item label="审批人">
                    <!-- <address-book ref="address" @AddressValue="getAddressData" :default="addressDefualt" :config="configData"></address-book> -->
                    <address-book v-model="addressData" :config="configData"></address-book>
                </el-form-item>
                <el-form-item prop="checkList" label="请假类型">
                    <el-checkbox-group v-model="ruleForm.checkList" @change="typeChangeHandler">
                        <el-checkbox v-for="item in leaveTypeList" :label="item.key" name="checkList" :key="item.key">
                            {{item.label}}
                        </el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                <div v-show="isShowDiseaseSetting">
                    <el-form-item label="病假需要分类" prop="checkedSickTypeList">
                        <el-tooltip :content="ruleForm.isSickTypeGroup?'请病假时需要选择疾病类型':'请病假时不需要选择疾病类型' " placement="top">
                            <el-switch v-model="ruleForm.isSickTypeGroup"></el-switch>
                        </el-tooltip>
                        <span style="margin-left: 10px;" v-show="ruleForm.isSickTypeGroup">
                            <el-checkbox v-for="item in sickTypeList" :label="item.code"
                                         v-model="ruleForm.checkedSickTypeList"
                                         :key="item.code">{{item.value}}</el-checkbox>
                        </span>
                    </el-form-item>
                </div>
                <el-form-item label="销假">
                    <el-tooltip :content="ruleForm.isHer?'需要销假':'不需要销假' " placement="top">
                        <el-switch v-model="ruleForm.isHer"></el-switch>
                    </el-tooltip>
                </el-form-item>
                <el-form-item label="抄送" prop="scribe">
                    <el-button type="primary" size="small" :loading="save_loading"
                               @click.native="scribeRuleAddEdit()">添加规则
                    </el-button>
                    <div v-for="(ruleItem, index) in scribeRuleList">
                        <div class="rule-part">
                            <span>{{ruleItem.minHour}}</span>
                            <span>{{ruleItem.minSymbol == 1 ? '<' : '≤'}}</span>
                            <span>请假时长（小时）</span>
                            <span>{{ruleItem.maxSymbol == 1 ? '<' : '≤'}}</span>
                            <span>{{ruleItem.maxHour}}</span>
                        </div>
                        <div class="rule-part">
                            抄送：<span v-if="ruleItem.pushType == 1">部门主任</span><span v-if="ruleItem.pushType == 1 && ruleItem.scribeJson.userJson.length !== 0">，</span>{{ruleItem.scribeJson.userJson.map(item => item.name).join('，')}}<span>
                            <i class="fa fa-edit" @click="scribeRuleAddEdit(index)"></i>
                            <i class="fa fa-trash" @click="deleteRule(index)"></i>
                        </span>
                        </div>
                    </div>
                </el-form-item>
                <el-form-item label="课务安排">
                   <el-checkbox v-model="ruleForm.showAdjustable">显示需要调课</el-checkbox>
                   <el-checkbox v-model="ruleForm.adjustableRimnd" v-if="ruleForm.showAdjustable">调课需要抄送</el-checkbox>
                  
                </el-form-item>
                <el-form-item label="调课抄送人员" v-if="ruleForm.showAdjustable&&ruleForm.adjustableRimnd">
                  <address-book v-model="newaddressData" :config="newconfigData"></address-book>
                </el-form-item>
                <el-form-item label="抄送固定人员">
                  <address-book v-model="twonewaddressData" :config="twonewconfigData"></address-book>
                </el-form-item>
                  <el-form-item label="请假抵扣">
                    <el-tooltip :content="ruleForm.isDeduction == 2 ? '开启请假抵扣':'关闭请假抵扣' " placement="top">
                        <el-switch v-model="ruleForm.isDeduction"
                                   :active-value="2"
                                   :inactive-value="1"
                        ></el-switch>
                    </el-tooltip>
                </el-form-item>
                  <el-form-item label="每月限额" class="is-required" v-if="ruleForm.isDeduction==2">
                   &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<=&nbsp;&nbsp;<el-input-number strict-step style="width: 160px;"   :precision="0" size="medium" v-model="ruleForm.deductionMonLimtHonor" :min='1' :max='999'></el-input-number>小时
                </el-form-item>
                  <el-form-item label="每学期限额" class="is-required" v-if="ruleForm.isDeduction==2">
                   &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<=&nbsp;&nbsp;<el-input-number strict-step style="width: 160px;"   :precision="0" size="medium" v-model="ruleForm.deductionSchTimeLimtHonor" :min='0' :max='999'></el-input-number>小时（0不限制）
                </el-form-item>
                <el-form-item label="上下午范围" prop="timeSectionScope">
                    <div>
                        <div>
                            上午&nbsp;&nbsp;=&nbsp;&nbsp;<el-input-number strict-step style="width: 160px;" size="medium" v-model="ruleForm.moringHour"
                                                                        :min='1' :max='999'></el-input-number>小时
                        </div>
                        <div>
                            下午&nbsp;&nbsp;=&nbsp;&nbsp;<el-input-number strict-step style="width: 160px;" size="medium" v-model="ruleForm.afterNoonHour"
                                                                        :min='1' :max='999'></el-input-number>小时
                        </div>
                    </div>
                </el-form-item>
               
                <el-form-item label="显示停伙">
                    <el-tooltip :content="ruleForm.showStopFire?'需要停伙':'不需要停伙' " placement="top">
                        <el-switch v-model="ruleForm.showStopFire"></el-switch>
                    </el-tooltip>
                </el-form-item>
                <el-form-item label="请假方式" prop="leaveApplyType">
                    <el-checkbox v-model="ruleForm.isDateAsk" :true-label="2" :false-label="1">
                        按时段请假
                    </el-checkbox>
                    <el-checkbox v-model="ruleForm.isClassHourAsk" :true-label="2" :false-label="1">
                        按课时请假
                    </el-checkbox>
                    <el-checkbox v-model="ruleForm.isTimeLenth" :true-label="2" :false-label="1">
                        按时长请假
                    </el-checkbox>
                </el-form-item>
            </el-form>
        </div>
        <el-dialog :title="`${editRuleIndex !== null ? '编辑' : '添加'}规则`" :visible.sync="isShowRuleAddEditDialog"
                   size="tiny"
                   width="700px"
                   :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false">
            <div class="form-line">
                <el-input-number strict-step :step="0.5" style="width: 160px;" size="medium" v-model="addEditRuleForm.minHour" :min='0'
                                 :max='addEditRuleForm.maxHour'></el-input-number>
                <el-select style="width: 80px;" v-model="addEditRuleForm.minSymbol" size="medium">
                    <el-option :value="1" label="<"></el-option>
                    <el-option :value="2" label="≤"></el-option>
                </el-select>
                请假时长（小时）
                <el-select style="width: 80px;" v-model="addEditRuleForm.maxSymbol" size="medium">
                    <el-option :value="1" label="<"></el-option>
                    <el-option :value="2" label="≤"></el-option>
                </el-select>
                <el-input-number strict-step :step="0.5" style="width: 160px;" size="medium" v-model="addEditRuleForm.maxHour"
                                 :min='addEditRuleForm.minHour' :max='9999'></el-input-number>
            </div>
            <div class="form-line">
                <el-radio v-model="addEditRuleForm.pushType" :label="1">
                    抄送部门主任
                </el-radio>
                <el-radio v-model="addEditRuleForm.pushType" :label="2">
                    指定抄送
                </el-radio>
            </div>
            <div class="form-line" v-show="addEditRuleForm.pushType == 2">
                指定抄送
                <div class="address-book-container">
                    <address-book v-model="addEditRuleAddressData" :config="configData"></address-book>
                </div>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="isShowRuleAddEditDialog = false" size="medium">取 消</el-button>
                <el-button type="primary" @click="scribeRuleAddEditConfirm()" size="medium">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
    import Backtool from '@/components/BackTool';
    import AddressBook from '@/components/AddressBook/indexExpand';
    import {getTeacherAskleaveInitInfo, addAndUpdateTeacherAskleaveInit} from '@/api/systemSet/TeacherLeave3Set';
    import {findDicsByCode} from '@/api/common/common';

    const ISHER = {OK: 1, NO: 2};
    export default {
        components: {
            AddressBook,
            Backtool
        },
        data() {
             const durationValidator1 = (rule, value, callback) => {
                if (!this.ruleForm.amEndTime || !this.ruleForm.amStartTime) {
                    return callback(new Error("请选择时间！"));
                } else if(this.ruleForm.amStartTime >= this.ruleForm.amEndTime) {
                    return callback(new Error('开始时间应小于结束时间'));
                } else {
                    return callback();
                }
            };
            const durationValidator2 = (rule, value, callback) => {
                if (!this.ruleForm.pmEndTime || !this.ruleForm.pmStartTime) {
                    return callback(new Error("请选择时间！"));
                } else if(this.ruleForm.pmStartTime >= this.ruleForm.pmEndTime) {
                    return callback(new Error('开始时间应小于结束时间'));
                } else {
                    return callback();
                }
            };
            const validateCheckedSickTypeList = (rule, value, callback) => {
                if (this.ruleForm.isSickTypeGroup) {
                    if (value.length === 0) {
                        callback(new Error('至少选择一个疾病分类！'));
                    } else {
                        callback();
                    }
                } else {
                    callback();
                }
            };
            const leaveApplyTypeValidator = (rule, value, callback) => {
                if (this.ruleForm.isDateAsk == 1 && this.ruleForm.isClassHourAsk == 1 && this.ruleForm.isTimeLenth == 1) {
                    callback(new Error('至少选择一种请假方式！'));
                } else {
                    callback();
                }
            };
            const scribeValidator = (rule, value, callback) => {
                if (this.scribeRuleList && this.scribeRuleList.length !== 0) {
                    let errorText = '';
                    this.scribeRuleList.forEach((item, index) => {
                        if(item.maxSymbol == 1 && item.minSymbol == 1 && item.minHour == item.maxHour) {
                            errorText = '规则时间段设置错误';
                        } else if(item.pushType == 2 && (!item.scribeJson.userJson || item.scribeJson.userJson.length == 0)) {
                            errorText = '请选择抄送人';
                        } else if(index !== 0) {
                            if(item.minHour < this.scribeRuleList[index - 1].maxHour) {
                                errorText = '规则时间段存在重合';
                            } else if (item.minSymbol == 2 && this.scribeRuleList[index - 1].maxSymbol == 2 && item.minHour == this.scribeRuleList[index - 1].maxHour) {
                                errorText = '规则时间段存在重合';
                            }
                        }
                    });
                    if(errorText) {
                        callback(new Error(errorText))
                    } else {
                        callback();
                    }
                } else {
                    callback();
                }
            };
            const timeSectionScopeValidator = (rule, value, callback) => {
                if (!this.ruleForm.moringHour) {
                    callback(new Error('请设置上午范围'))
                } else if(!this.ruleForm.afterNoonHour) {
                    callback(new Error('请设置下午范围'))
                } else {
                    callback();
                }
            };
            return {
                isShowDiseaseSetting: false,
                save_loading: false,
                ruleForm: {
                    id: '',
                    isHer: false,
                    showStopFire: false,
                    isSickTypeGroup: false,
                    checkList: [],
                    checkedSickTypeList: [], //病假类型
                    isDateAsk: 2,
                    isClassHourAsk: 2,
                    isTimeLenth: 2,
                    isDeduction: 1,
                    moringHour: 1,
                    afterNoonHour: 1,
                    adjustableRimnd:false,
                    showAdjustable:false,
                    deductionMonLimtHonor:8,
                    deductionSchTimeLimtHonor:0,
                    amStartTime: '',
                    amEndTime: '',
                    pmEndTime: '',
                    pmStartTime: '',
                },
                rules: {
                    checkList: [
                        {type: 'array', required: true, message: '请至少选择一个请假类型！', trigger: 'change'}
                    ],
                    checkedSickTypeList: [
                        {validator: validateCheckedSickTypeList, trigger: 'change'}
                    ],
                    leaveApplyType: [{
                        validator: leaveApplyTypeValidator, trigger: 'change', required: true
                    }],
                    scribe: [{
                        validator: scribeValidator, trigger: 'change', required: false
                    }],
                    timeSectionScope: [{
                        validator: timeSectionScopeValidator, trigger: 'change', required: true
                    }],
                    amDuration: [
                        { required: true, validator: durationValidator1},
                    ],
                    pmDuration: [
                        { required: true, validator: durationValidator2},
                    ],
                },
                leaveTypeList: [],
                sickTypeList: [],
                configData: {title: '审批人', depart: {target: 'user', departType: 't', userTypes: '1'}},
                addressData: {
                    userJson: []
                },
                newconfigData: {title: '抄送人员', depart: {target: 'user', departType: 't', userTypes: '1'}},
                newaddressData: {
                    userJson: []
                },
                twonewconfigData: {title: '抄送固定人员', depart: {target: 'user', departType: 't', userTypes: '1'}},
                twonewaddressData: {
                    userJson: []
                },
                // sendAddressData: {
                //     userJson: []
                // },
                editRuleIndex: null,

                scribeRuleList: [],
                isShowRuleAddEditDialog: false,
                addEditRuleAddressData: {
                    userJson: []
                },
                addEditRuleForm: {
                    minHour: 0,
                    maxHour: 8,
                    minSymbol: 1,
                    maxSymbol: 1,
                    pushType: 1
                }
            }
        },
        created() {
            findDicsByCode({
                dicCode: 'sicktypeName'
            }).then(res => {
                this.sickTypeList = res.data.data;
            }).catch();
            findDicsByCode({
                dicCode: 'teacherAskLeave1'
            }).then(res => {
                const data = res.data.data;
                if (res.data.code === 200) {
                    this.leaveTypeList = data.map((item) => {
                        return {
                            label: item.value,
                            key: item.code
                        }
                    });
                }
            }).catch();
            getTeacherAskleaveInitInfo().then(res => {
                const data = res.data.data;
                console.log('data', data)
                let scribeRuleList = [];
                if(data.ruleJson) {
                    const ruleJson = JSON.parse(data.ruleJson);
                    ruleJson.forEach(item => {
                        item.scribeJson = {
                            groupJson: [],
                            userJson: item.userJson,
                            departJson: []
                        };
                    });
                    scribeRuleList = ruleJson;
                }

                if (res.data.code === 200) {
                    this.ruleForm.id = data.id;
                    this.ruleForm.checkList = this.getCheckedTypeList(JSON.parse(data.leaveTypeJson || '[]'));
                    this.ruleForm.isHer = data.isHer === ISHER.OK;
                    this.ruleForm.showStopFire = data.showStopFire === 2;
                    this.ruleForm.checkedSickTypeList = this.getSickTypeList(JSON.parse(data.sickTypeJson || '[]'));
                    this.addressData = {userJson: data.batchUserList};
                    this.newaddressData = {userJson: data.adjustableRimndJson?JSON.parse(data.adjustableRimndJson):[]};
                    this.twonewaddressData = {userJson: data.remindUserJson?JSON.parse(data.remindUserJson):[]};
                    this.isShowDiseaseSetting = this.ruleForm.checkList && this.ruleForm.checkList.indexOf('1') !== -1;
                    this.ruleForm.isSickTypeGroup = data.isSickTypeGroup === 1;
                    this.ruleForm.isDateAsk = data.isDateAsk;
                    this.ruleForm.isClassHourAsk = data.isClassHourAsk;
                    this.ruleForm.isTimeLenth = data.isTimeLenth;
                    this.ruleForm.isDeduction = data.isDeduction;
                    this.ruleForm.afterNoonHour = data.afterNoonHour;
                    this.ruleForm.moringHour = data.moringHour;
                    this.scribeRuleList = scribeRuleList;
                    this.ruleForm.adjustableRimnd = data.adjustableRimnd==2;
                    this.ruleForm.showAdjustable = data.showAdjustable==2;
                    this.ruleForm.deductionMonLimtHonor = data.deductionMonLimtHonor;
                    this.ruleForm.deductionSchTimeLimtHonor = data.deductionSchTimeLimtHonor||0;
                    this.ruleForm.amStartTime = data.amStartTime||'';
                     this.ruleForm.amEndTime = data.amEndTime||'';
                    this.ruleForm.pmStartTime = data.pmStartTime||'';
                    this.ruleForm.pmEndTime = data.pmEndTime||'';
                }
            }).catch();
        },
        methods: {
            jumpToPage(path, query = {}) {
                this.$router.push({
                    path,
                    query
                })
            },
            deleteRule(index) {
                this.scribeRuleList.splice(index, 1);
            },
            scribeRuleAddEdit(editRuleIndex = null) {
                if (editRuleIndex !== null) {
                    this.editRuleIndex = editRuleIndex;
                    this.addEditRuleForm = {
                        minHour: this.scribeRuleList[editRuleIndex].minHour,
                        maxHour: this.scribeRuleList[editRuleIndex].maxHour,
                        minSymbol: this.scribeRuleList[editRuleIndex].minSymbol,
                        maxSymbol: this.scribeRuleList[editRuleIndex].maxSymbol,
                        pushType: this.scribeRuleList[editRuleIndex].pushType
                    };
                    this.addEditRuleAddressData = {
                        userJson: this.scribeRuleList[editRuleIndex].userJson || []
                    }
                } else {
                    this.addEditRuleForm = {
                        minHour: 0,
                        maxHour: 8,
                        minSymbol: 1,
                        maxSymbol: 1,
                        pushType: 1
                    };
                    this.addEditRuleAddressData = {
                        userJson: []
                    }
                }
                this.editRuleIndex = editRuleIndex;
                this.isShowRuleAddEditDialog = true;
            },
            scribeRuleAddEditConfirm() {
                const obj = JSON.parse(JSON.stringify(this.addEditRuleForm));
                obj.scribeJson = obj.pushType == 2 ? JSON.parse(JSON.stringify(this.addEditRuleAddressData)) : {
                    userJson: []
                };
                if (this.editRuleIndex === null) {
                    this.scribeRuleList.push(obj);
                } else {
                    this.$set(this.scribeRuleList, this.editRuleIndex, obj);
                }
                this.isShowRuleAddEditDialog = false;
            },
            getSickTypeList(list) {
                let array = [];
                if (list) {
                    list.forEach(function (item) {
                        array.push(item.thAskleaveTypeId);
                    });
                }
                return array;
            },
            typeChangeHandler(val) {
                this.isShowDiseaseSetting = val && val.indexOf('1') !== -1;
            },
            saveFunc() {
                let self = this;
                this.$refs['ruleForm'].validate((valid) => {
                    if (valid) {
                        const sickTypeJson = [];
                        if (this.ruleForm.checkList && this.ruleForm.checkList.indexOf('1') !== -1 && this.ruleForm.isSickTypeGroup) {
                            this.ruleForm.checkedSickTypeList.forEach(sickCode => {
                                const sickObj = this.sickTypeList.find(sickItem => sickItem.code == sickCode);
                                if (sickObj) {
                                    sickTypeJson.push({
                                        thAskleaveTypeId: sickObj.code,
                                        thAskleaveTypeName: sickObj.value
                                    });
                                }
                            });
                        }
                        const ruleJson = [];
                        this.scribeRuleList.forEach(item => {
                            const obj = {
                                maxSymbol: item.maxSymbol,
                                minHour: item.minHour,
                                maxHour: item.maxHour,
                                minSymbol: item.minSymbol,
                                pushType: item.pushType,
                                userJson: item.scribeJson.userJson
                            };
                            ruleJson.push(obj);
                        })
                        if(!this.ruleForm.showAdjustable){
                           this.ruleForm.adjustableRimnd=false;
                        }
                        if(!this.ruleForm.adjustableRimnd){
                           this.newaddressData.userJson=[]
                        }
                        if(this.ruleForm.adjustableRimnd&& this.newaddressData.userJson.length==0){
                             this.$message.error('请选择调课抄送人员');
                            return
                        }
                        const query = {
                             amStartTime: this.ruleForm.amStartTime,
                            amEndTime: this.ruleForm.amEndTime,
                            pmEndTime: this.ruleForm.pmEndTime,
                            pmStartTime: this.ruleForm.pmStartTime,
                            id: this.ruleForm.id,
                            adjustableRimnd: this.ruleForm.adjustableRimnd ? 2 : 1,
                            showAdjustable: this.ruleForm.showAdjustable ? 2 : 1,
                            deductionMonLimtHonor:this.ruleForm.deductionMonLimtHonor,
                            deductionSchTimeLimtHonor:this.ruleForm.deductionSchTimeLimtHonor,
                            adjustableRimndJson: JSON.stringify(this.newaddressData.userJson),
                            remindUserJson: JSON.stringify(this.twonewaddressData.userJson),

                            leaveTypeJson: JSON.stringify(this.getLeaveTypeJson()),
                            batchUserJson: JSON.stringify(this.addressData.userJson),
                            isHer: this.ruleForm.isHer ? ISHER.OK : ISHER.NO,
                            showStopFire: this.ruleForm.showStopFire ? 2 : 1,
                            isSickTypeGroup: this.ruleForm.checkList && this.ruleForm.checkList.indexOf('1') !== -1 && this.ruleForm.isSickTypeGroup ?
                                1 : 2,
                            sickTypeJson: JSON.stringify(sickTypeJson),
                            isClassHourAsk: this.ruleForm.isClassHourAsk,
                            isTimeLenth: this.ruleForm.isTimeLenth,
                            isDateAsk: this.ruleForm.isDateAsk,
                            afterNoonHour: this.ruleForm.afterNoonHour,
                            moringHour: this.ruleForm.moringHour,
                            isDeduction: this.ruleForm.isDeduction,
                            ruleJson: JSON.stringify(ruleJson)
                        };
                        console.log('query', query);
                        addAndUpdateTeacherAskleaveInit(query).then(res => {
                            this.$message({
                                message: res.data.msg,
                                type: 'success',
                                onClose: function () {
                                    self.$router.back();
                                }
                            });
                        }).catch();
                    }
                });
            },
            getCheckedTypeList(list) {
                let array = [];
                list.forEach((item) => {
                    array.push(item.leaveTypeId);
                });
                return array;
            },
            getLeaveTypeJson() {
                let array = [];
                let self = this;
                const checkedTypeList = self.leaveTypeList.map(itemType => itemType.key);
                this.ruleForm.checkList.forEach(function (itemId) {
                    if (checkedTypeList.indexOf(itemId) > -1) {
                        const checkIndex = checkedTypeList.indexOf(itemId);
                        array.push({
                            leaveTypeId: self.leaveTypeList[checkIndex].key,
                            leaveTypeName: self.leaveTypeList[checkIndex].label
                        });
                    }
                });
                return array;
            }

        }
    }
</script>

<style>
    .rule-part {
        display: inline-block;
        min-width: 14em;
    }

    .address-book-container {
        display: inline-block;
        vertical-align: middle;
        width: 300px;
    }

    .form-line {
        line-height: 40px;
        margin: 10px 0;
    }

    .fa {
        margin-left: 4px;
        color: #409EFF;
        cursor: pointer;
    }
    .fa-trash {

    }
</style>
