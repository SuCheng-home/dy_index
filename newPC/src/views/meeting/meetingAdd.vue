<template>
    <div class="meetingAdd">
        <div class="el-row menu-tools">
            <el-button type="default" size="medium" @click="$router.back()">返回</el-button>
            <el-button type="primary" size="medium"   :loading="save_loading" @click="insertMeeting(0)">
                保存
            </el-button>
            <el-button type="primary" size="medium"   :loading="save_loading" @click="insertMeeting(1)">
                发布
            </el-button>
            <el-button type="primary" size="medium" :loading="save_loading"   @click="insertMeeting(2)">
                预览
            </el-button>
        </div>
        <div class="main-wrap scrollBar" :style="{'height':nobottommaxH+'px'}">
            <el-form :model="ruleForm" ref="ruleForm" label-width="140px" class="demo-ruleForm">
                <el-form-item label="会议主题" class="is-required">
                    <el-input v-model.trim="ruleForm.theme" placeholder="会议主题(1-50个字符)" :maxlength="50"></el-input>
                </el-form-item>
                <el-form-item label="会议地点" class="is-required">
                    <el-input v-model.trim="ruleForm.place" placeholder="会议地点(1-50个字符)" :maxlength="50"></el-input>
                </el-form-item>
                <el-form-item label="会议形式">
                    <el-radio-group v-model="ruleForm.meetingType">
                        <el-radio :label="0">单次会议</el-radio>
                        <el-radio :label="1">常规例会</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="是否允许请假">
                    <el-radio-group v-model="ruleForm.isCanAskLeav">
                        <el-radio :label="0">不允许</el-radio>
                        <el-radio :label="1">允许</el-radio>
                    </el-radio-group>
                </el-form-item>
                <!--是否允许请假-->
                <el-form-item label="请假审批人" v-show="ruleForm.isCanAskLeav==1" class="is-required">
                    <address-book v-model="ruleForm.leavExamData" :config="leaveConfigData"></address-book>
                </el-form-item>
                <!--单次会议-->
                <div v-show="ruleForm.meetingType==0">
                    <el-form-item label="会议时间" class="is-required">
                        <el-date-picker
                            v-model="ruleForm.startTime" format="yyyy-MM-dd HH:mm" size="medium" :clearable="false"
                            placeholder="开始时间≥当前时间" type="datetime">
                        </el-date-picker>
                        <span>—</span>
                        <el-date-picker
                            v-model="ruleForm.endTime" format="yyyy-MM-dd HH:mm" size="medium" :clearable="false"
                            type="datetime" placeholder="结束时间>开始时间">
                        </el-date-picker>
                    </el-form-item>
                </div>
                <!--常规例会-->
                <div v-show="ruleForm.meetingType==1">
                    <el-form-item label="会议周次" class="is-required">
                        <el-checkbox-group v-model="ruleForm.weeks">
                            <el-checkbox v-for="weekItem in weekList" :key="weekItem.code"
                                         :label="weekItem.value"></el-checkbox>
                        </el-checkbox-group>
                    </el-form-item>
                    <el-form-item label="会议时间" class="is-required">
                        <el-time-picker
                            v-model="ruleForm.beginTime" size="medium" :clearable="false" format="HH:mm"
                            placeholder="开始时间">
                        </el-time-picker>
                        <span>—</span>
                        <el-time-picker
                            v-model="ruleForm.finishTime" size="medium" :clearable="false" format="HH:mm"
                            placeholder="结束时间">
                        </el-time-picker>
                    </el-form-item>
                    <el-form-item label="执行时间" class="is-required">
                        <el-date-picker
                            v-model="ruleForm.startTime2" type="date" size="medium" :clearable="false"
                            format="yyyy-MM-dd" placeholder="开始时间">
                        </el-date-picker>
                        <span>—</span>
                        <el-date-picker
                            v-model="ruleForm.endTime2" type="date" size="medium" :clearable="false" format="yyyy-MM-dd"
                            placeholder="结束时间">
                        </el-date-picker>
                    </el-form-item>
                </div>
                <el-form-item label="签到时间限制">
                    <el-checkbox v-model="ruleForm.isSignLimit"></el-checkbox>
                </el-form-item>
                <div v-show="ruleForm.isSignLimit">
                    <el-form-item label=" ">
                        <el-time-picker
                            v-model="ruleForm.bSignTime" size="medium" :clearable="false" format="HH:mm"
                            placeholder="签到开始时间">
                        </el-time-picker>
                        <span>—</span>
                        <el-time-picker
                            v-model="ruleForm.eSignTime" size="medium" :clearable="false" format="HH:mm"
                            placeholder="签到结束时间">
                        </el-time-picker>
                    </el-form-item>
                </div>
                <el-form-item label="发送提醒">
                    <el-radio-group v-model="ruleForm.isRemind">
                        <el-radio :label="2">不发送</el-radio>
                        <el-radio :label="1">发送</el-radio>                        
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="签到方式">
                    <el-radio-group v-model="ruleForm.signType">
                        <el-radio :label="1">扫码签到</el-radio>
                        <el-radio :label="2">人脸识别签到</el-radio>
                    </el-radio-group>
                </el-form-item>
                <div v-show="ruleForm.signType==1">
                    <el-form-item label="签到位置限制">
                    <el-radio-group v-model="ruleForm.isAddressLimit">
                        <el-radio :label="0">不限制</el-radio>
                        <el-radio :label="2">限制</el-radio>                        
                    </el-radio-group>
                </el-form-item>
                    <div v-if="ruleForm.isAddressLimit==2">
                         <el-form-item label="签到半径" :required="true">
                            <el-radio-group v-model="ruleForm.rangeVal">
                                <el-radio :label="item" :key="index" v-for="(item, index) in rangeList">{{item}}</el-radio>
                            </el-radio-group>
                            <span style="margin-left: 20px;">
                                自定义<el-input-number v-model="ruleForm.rangeVal"  :min="1" :max="100000" size="small" label="签到半径" style="margin: 0 10px;"></el-input-number>米
                            </span>
                        </el-form-item>
                        <el-form-item label="地点搜索" :required="true">
                            <gaode-map-input v-model="position" ref="amap"></gaode-map-input>
                        </el-form-item>
                    </div>
                   
                </div>
                <el-form-item label="人脸识别设备" v-show="ruleForm.signType==2">
                    <div class="equipmentBox">
                        <div class="for-box" v-for="(item,index) in saveDeviceList" :key="index">
                            <img
                                src="https://cdnfile-10043692.file.myqcloud.com/admin/images/systemSetup/scancodeEquipment.png"
                                class="upload-img">
                            <a href="javascript:void(0);" class="file_del" @click="minuEquipment(index);"> 删除</a>
                            <span class="file-name" title="">{{item.equipmentName}}</span>
                        </div>
                    </div>
                    <a href="javascript:;" title="点击添加设备" class="file" @click="deviceShow">+</a>
                </el-form-item>
                <el-form-item label="参会人员" class="is-required">
                    <address-book v-model="ruleForm.meetUserData" :config="meetUserConfigData"></address-book>
                </el-form-item>
                <el-form-item label="介绍" class="is-required">
                    <br />
                    <ueditor style="width: 740px;position: relative;right: 70px;" class="rich-editor" ref="ueditor" :defaultMes="ruleForm.describe"
                             @editModel="richTextEditHandler"></ueditor>
                </el-form-item>
                <el-form-item label="附件">
                    <uploader pathPrefix="huiyiqiandao" module="huiyiqiandao" moduleCode="1221" :multiple="true" :extList="allFileTypeList"
                              v-model="fileJson"></uploader>
                </el-form-item>
            </el-form>
        </div>
        <!--弹窗-->
        <el-dialog
            title="人脸识别设备选择"
            :visible.sync="dialogVisible" class="campuList-dialog-box" :close-on-press-escape="false"
            :close-on-click-modal="false" :modal-append-to-body="false" :show-close="false">
            <el-form class="card-dialog-padding" ref="ruleDialogForm">
                <el-form-item label="人脸识别设备">
                    <el-select v-model="deviceId" placeholder="请选择">
                        <el-option
                            v-for="item in deviceList"
                            :key="item.equipmentId"
                            :label="item.equipmentName"
                            :value="item.equipmentId">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="closeDialog">取 消</el-button>
                <el-button type="primary" @click="sureHandler">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
    import mixin from '@/mixins/windowResize';
    import {mapGetters} from 'vuex';
    import AddressBook from '@/components/AddressBook/indexExpand';
    import Ueditor from "@/components/Ueditor";
    import Uploader from '@/components/Uploader/WebUploader';
    import {getSchoolYearDate, getScancodeByType, addMeeting} from '@/api/metting';
    import GaodeMapInput from '@/components/GaodeMapInput'
    export default {
        components: {
            AddressBook,
            Ueditor,
            Uploader,
            GaodeMapInput
        },
        data() {
            return {
                save_loading: false,
                ruleForm: {
                    theme: '',
                    place: '',
                    meetingType: 0,//会议类型 0单次会议 1常规例会
                    isCanAskLeav: 0,//是否允许请假 0不允许 1允许
                    leavExamData: {
                        userJson: []
                    },
                    leavExamJson: "",
                    leavExamIds: '',
                    startTime: new Date(),//单会议时间
                    endTime: new Date(),
                    weeks: [],//常规
                    beginTime: '',
                    finishTime: '',
                    startTime2: '',
                    endTime2: '',
                    isSignLimit: false,//签到时间限制 0不限制 1限制
                    bSignTime: '',//签到开始时间
                    eSignTime: '',
                    signType: 1,//会议签到方式 1扫码签到 2人脸识别
                    equipmentIds: '',
                    equipmentJson: '',
                    describe: '',
                    meetUserData: {},
                    meetingScopes: '',
                    weekIds: '',
                    weekNames: '',
                    address: '',
                    rangeVal: 500,
                    addressDesc: '',
                    lng: 116.404,
                    lat: 39.915,
                    isAddressLimit:0,
                    isRemind:2
                },
                position: [116.404, 39.915],
                rangeList: [100, 200, 300, 500, 800, 1000, 1500, 2000, 3000],
                leaveConfigData: {
                    title: '请选择请假审批人员',
                    depart: {target: "user", departType: "t", userTypes: "1"},
                    group: false
                },
                meetUserConfigData: {
                    title: '请选择参会人员',
                    depart: {target: 'all', departType: 't', userTypes: '1'},
                    group: true
                },
                weekList: [
                    {code: 1, value: "周一"},
                    {code: 2, value: "周二"},
                    {code: 3, value: "周三"},
                    {code: 4, value: "周四"},
                    {code: 5, value: "周五"},
                    {code: 6, value: "周六"},
                    {code: 7, value: "周日"}
                ],
                schoolYearList: [],
                dialogVisible: false,
                deviceId: '',
                deviceList: [],
                saveDeviceList: [],
                allFileTypeList: ['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'pdf'],
                fileJson: [],
            }
        },
        created() {
            this.saveDeviceList = [];
            //获取当前学期开始结束时间
            this.getSchoolYearDateFunc();
            this.getScancodeByTypeFunc();
        },
        mounted() {

        },
        mixins: [mixin],
        computed: {
            ...mapGetters([
                'userInfo'
            ])
        },
        methods: {
            richTextEditHandler(content) {
                this.ruleForm.describe = content;
            },
            minuEquipment(index) {
                this.saveDeviceList.splice(index, 1);
            },
            sureHandler() {
                this.dialogVisible = false;
                let flag = true;
                if (this.saveDeviceList.length) {
                    this.saveDeviceList.forEach(saveItem => {
                        if (saveItem.equipmentId == this.deviceId) {
                            this.$message({
                                type: "error",
                                message: `${saveItem.equipmentName}已被添加，不可重复添加！`
                            });
                            flag = false;
                        }
                    })
                }
                if (flag) {
                    let deviceItem = this.deviceList.find(item => item.equipmentId == this.deviceId);
                    this.saveDeviceList.push(deviceItem);
                }
            },
            closeDialog() {
                //关闭弹窗
                this.dialogVisible = false;
            },
            getScancodeByTypeFunc() {
                getScancodeByType({
                    equipType: 10002,
                    useType: 24
                }).then(res => res.data)
                    .then(data => {
                        if (data.code === 200) {
                            this.deviceList = data.data;
                            this.deviceId = this.deviceList[0].equipmentId;
                        }
                    })
            },
            deviceShow() {
                //显示弹窗
                this.dialogVisible = true;
            },
            getSchoolYearDateFunc() {
                getSchoolYearDate({
                    schoolId: this.userInfo.schoolId
                }).then(res => res.data)
                    .then(data => {
                        if (data.code === 200) {
                            const schoolDate = data.data;
                            this.ruleForm.startTime2 = schoolDate.startDate;
                            this.ruleForm.endTime2 = schoolDate.endDate;
                        }
                    })
            },
            insertMeeting(status) {
                if (this.ruleForm.theme == "") {
                    this.$message({
                        type: "error",
                        message: "请输入会议主题！"
                    });
                    return false;
                }
                if (this.ruleForm.place == "") {
                    this.$message({
                        type: "error",
                        message: "请输入会议地点！"
                    });
                    return false;
                }
                if (this.ruleForm.isCanAskLeav == 1 && Object.keys(this.ruleForm.leavExamData.userJson).length == 0) {
                    this.$message({
                        type: "error",
                        message: "请选择请假审批人！"
                    });
                    return false;
                }
                if (this.ruleForm.meetingType == 0) {
                    if (this.$moment(this.ruleForm.startTime).format('YYYY-MM-DD HH:mm') <= this.$moment(new Date()).format('YYYY-MM-DD HH:mm')) {
                        this.$message({
                            type: "error",
                            message: "会议开始时间应大于当前时间！"
                        });
                        return false;
                    }
                    if (this.$moment(this.ruleForm.endTime).format('YYYY-MM-DD HH:mm') <= this.$moment(this.ruleForm.startTime).format('YYYY-MM-DD HH:mm')) {
                        this.$message({
                            type: "error",
                            message: "会议结束时间应大于会议开始时间！"
                        });
                        return false;
                    }
                }
                if (this.ruleForm.meetingType == 1) {
                    if (this.ruleForm.weeks && this.ruleForm.weeks.length == 0) {
                        this.$message({
                            type: "error",
                            message: "请设置会议周次！"
                        });
                        return false;
                    }
                    if (this.ruleForm.beginTime == '') {
                        this.$message({
                            type: "error",
                            message: "请设置会议开始时间！"
                        });
                        return false;
                    }
                    if (this.ruleForm.finishTime == '') {
                        this.$message({
                            type: "error",
                            message: "请设置会议结束时间！"
                        });
                        return false;
                    }
                    if (this.$moment(this.ruleForm.beginTime).format('HH:mm') >= this.$moment(this.ruleForm.finishTime).format('HH:mm')) {
                        this.$message({
                            type: "error",
                            message: "会议结束时间应大于会议开始时间！"
                        });
                        return false;
                    }
                    if (this.ruleForm.startTime2 == '') {
                        this.$message({
                            type: "error",
                            message: "请输入会议执行开始时间！"
                        });
                        return false;
                    }
                    if (this.ruleForm.endTime2 == '') {
                        this.$message({
                            type: "error",
                            message: "请输入会议执行结束时间！"
                        });
                        return false;
                    }
                    if (this.$moment(this.ruleForm.startTime2).format('YYYY-MM-DD') >= this.$moment(this.ruleForm.endTime2).format('YYYY-MM-DD')) {
                        this.$message({
                            type: "error",
                            message: "会议执行结束时间应大于会议执行开始时间！"
                        });
                        return false;
                    }
                }
                if (this.ruleForm.isSignLimit) {
                    if (this.ruleForm.bSignTime == '') {
                        this.$message({
                            type: "error",
                            message: "请设置会议签到开始时间！"
                        });
                        return false;
                    }
                    if (this.ruleForm.eSignTime == '') {
                        this.$message({
                            type: "error",
                            message: "请设置会议签到结束时间！"
                        });
                        return false;
                    }
                    if (this.$moment(this.ruleForm.bSignTime).format('HH:mm') >= this.$moment(this.ruleForm.eSignTime).format('HH:mm')) {
                        this.$message({
                            type: "error",
                            message: "会议签到开始时间不能大于会议签到结束时间！"
                        });
                        return false;
                    }
                }
                if (this.ruleForm.signType == 2) {
                    if (this.saveDeviceList && this.saveDeviceList.length == 0) {
                        this.$message({
                            type: "error",
                            message: "请选择人脸识别设备！"
                        });
                        return false;
                    }
                }else{
                    if(this.ruleForm.isAddressLimit==2){
                        this.ruleForm.addressDesc = this.$refs.amap.getLocationText();
                        this.ruleForm.lng = this.position[0];
                        this.ruleForm.lat = this.position[1];
                        this.ruleForm.address = this.$refs.amap.getLocationText();
                        if (!this.ruleForm.addressDesc || !this.ruleForm.lng || !this.ruleForm.lat) {
                                this.$message({
                                    type: 'error',
                                    message: '请选择地点位置！'
                                });
                                return;
                            }
                    }
                   
                }
                if (Object.keys(this.ruleForm.meetUserData).length == 0) {
                    this.$message({
                        type: "error",
                        message: "请选择参会人员！"
                    });
                    return false;
                }
                if (this.ruleForm.describe == '') {
                    this.$message({
                        type: "error",
                        message: "请输入会议介绍！"
                    });
                    return false;
                }


                //是否允许请假  请假审批人
                if (this.ruleForm.isCanAskLeav == 1) {
                    if (this.ruleForm.leavExamData.userJson.length !== 0) {
                        this.ruleForm.leavExamJson = JSON.stringify(this.ruleForm.leavExamData.userJson);
                    }
                }
                //会议类型 0单次会议 1常规例会
                if (this.ruleForm.meetingType == 0) {
                    this.ruleForm.startTime = this.$moment(this.ruleForm.startTime).format('YYYY-MM-DD HH:mm') + ":00";
                    this.ruleForm.endTime = this.$moment(this.ruleForm.endTime).format('YYYY-MM-DD HH:mm') + ":00";
                    this.ruleForm.weekIds = '';
                    this.ruleForm.weekNames = '';
                    // this.ruleForm.beginTime='';
                    // this.ruleForm.finishTime='';
                } else {
                    this.ruleForm.startTime = '';
                    this.ruleForm.endTime = '';
                    var weekCode = [];
                    var weekValue = [];
                    this.weekList.forEach(item => {
                        this.ruleForm.weeks.forEach(subItem => {
                            if (item.value == subItem) {
                                weekCode.push(item.code);
                                weekValue.push(item.value);
                            }
                        })
                    })
                    this.ruleForm.weekIds = weekCode.toString();
                    this.ruleForm.weekNames = weekValue.toString();
                    // this.ruleForm.beginTime=this.$moment(this.ruleForm.beginTime).format('HH:mm');
                    // this.ruleForm.finishTime=this.$moment(this.ruleForm.finishTime).format('HH:mm');
                    this.ruleForm.startTime = this.$moment(this.ruleForm.startTime2).format('YYYY-MM-DD') + " 00:00:00";
                    this.ruleForm.endTime = this.$moment(this.ruleForm.endTime2).format('YYYY-MM-DD') + " 23:59:59";
                }
                //会议签到 扫码签到 人脸识别签到
                if (this.ruleForm.signType == 2) {
                    this.ruleForm.equipmentIds = this.saveDeviceList.map(item => item.equipmentId).toString();
                    this.ruleForm.equipmentJson = JSON.stringify(this.saveDeviceList);
                } else {
                    this.ruleForm.equipmentIds = '';
                    this.ruleForm.equipmentJson = '';
                }
                this.ruleForm.meetingScopes = JSON.stringify(this.ruleForm.meetUserData);
                this.ruleForm.describe = this.$refs.ueditor.getContent();
                this.save_loading = true;
                addMeeting({
                    theme: this.ruleForm.theme,
                    place: this.ruleForm.place,
                    meetingType: this.ruleForm.meetingType,
                    isCanAskLeav: this.ruleForm.isCanAskLeav,
                    startTime: this.$moment(this.ruleForm.startTime).format('YYYY-MM-DD HH:mm'),
                    endTime: this.$moment(this.ruleForm.endTime).format('YYYY-MM-DD HH:mm'),
                    isSignLimit: this.ruleForm.isSignLimit ? 1 : 0,
                    beginTime: this.ruleForm.meetingType == 1 ? this.$moment(this.ruleForm.beginTime).format('HH:mm') : '',
                    finishTime: this.ruleForm.meetingType == 1 ? this.$moment(this.ruleForm.finishTime).format('HH:mm') : '',
                    signType: this.ruleForm.signType,
                    isRemind: this.ruleForm.isRemind,
                    address: this.ruleForm.address,
                    addressDesc: this.ruleForm.addressDesc,
                    lat: this.ruleForm.lat,
                    lng: this.ruleForm.lng,
                    isAddressLimit: this.ruleForm.isAddressLimit,
                    rangeVal: this.ruleForm.rangeVal,
                    describe: this.ruleForm.describe,
                    leavExamJson: this.ruleForm.leavExamJson,
                    bSignTime: this.ruleForm.isSignLimit ? this.$moment(this.ruleForm.bSignTime).format('HH:mm') : '',
                    eSignTime: this.ruleForm.isSignLimit ? this.$moment(this.ruleForm.eSignTime).format('HH:mm') : '',
                    equipmentIds: this.ruleForm.equipmentIds,
                    equipmentJson: this.ruleForm.equipmentJson,
                    meetingScopes: this.ruleForm.meetingScopes,
                    filesJson: JSON.stringify(this.fileJson),
                    weekIds: this.ruleForm.weekIds,
                    weekNames: this.ruleForm.weekNames,
                    status: status
                }).then(res => res.data)
                    .then(data => {
                        if (data.code === 200) {
                            if (status == 0) {
                                this.$message({
                                    type: "success",
                                    message: "保存成功!"
                                });
                            } else if (status == 1) {
                                this.$message({
                                    type: "success",
                                    message: "发布成功!"
                                });
                            } else if (status == 2) {
                                this.$message({
                                    type: "success",
                                    message: "保存成功!预览会议请到手机端查看!"
                                });
                            }
                            this.$router.push({
                                path: 'meetingList'
                            })
                        } else {
                            this.save_loading = false;
                        }
                    }).catch(() => {
                    this.save_loading = false;
                })
            }
        }
    }
</script>
<style lang="scss" scoped>
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

    .el-form-item.is-required .el-form-item__label:before {
        content: "*";
        color: #ff4949;
        margin-right: 4px;
    }

    .meetingAdd {
        padding:12px;
        box-sizing: border-box;

        .menu-tools {
            border-bottom: 1px solid #e7eaec;
            padding-bottom: 10px;
        }

        .main-wrap {
            width: 100%;
            padding-top: 20px;
            padding-bottom: 10px;
            box-sizing: border-box;

            .demo-ruleForm {
                width: 810px;
                box-sizing: border-box;
                margin: 0 auto;
            }

            .file {
                position: relative;
                display: inline-block;
                background: #fff;
                border: 1px dashed #ccc;
                color: #fff;
                text-decoration: none;
                text-indent: 0;
                width: 50px;
                height: 50px;
                font-size: 30px;
                text-align: center;
                font-weight: bold;
                cursor: pointer;
                color: #000;
                padding-top: 3px;
                margin-top: 10px;
            }

            .for-box {
                min-width: 100px;
                width: auto;
                height: 70px;
                float: left;
                margin-bottom: 10px;
                margin-top: 10px;

                .upload-img {
                    width: 50px;
                    height: 50px;
                    vertical-align: middle;
                }

                .file_del {
                    text-decoration: none;
                    color: #337ab7;
                }

                .file-name {
                    display: block;
                    width: 100px;
                    line-height: 20px;
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                }
            }
        }
    }
</style>
