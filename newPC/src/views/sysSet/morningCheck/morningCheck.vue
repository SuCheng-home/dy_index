<template>
    <div class="morningCheck">
        <div class="el-row menu-tools">
            <el-button @click="$router.back()" size="medium">返回</el-button>
            <el-button type="primary" size="medium"   @click="addAndUpdateStuMoringCheckInits()">保存
            </el-button>
        </div>
        <div class="main-wrap">
            <el-form ref="ruleForm" :model="ruleForm" label-width="140px" class="demo-ruleForm">
                <el-form-item label="学生状态" required>
                    <el-checkbox-group v-model="typeCodeList">
                        <el-checkbox :label="100" disabled>到勤体温正常</el-checkbox>
                        <el-checkbox :label="102" disabled>到勤体温异常</el-checkbox>
                        <el-checkbox :label="101" disabled>未到</el-checkbox>
                        <el-checkbox :label="103" >迟到</el-checkbox>
                        <el-checkbox :label="0" >事假</el-checkbox>
                        <el-checkbox :label="1" >病假</el-checkbox>
                        <el-checkbox :label="20" >休学</el-checkbox>
                        <el-checkbox :label="21" >防疫</el-checkbox>
                        <el-checkbox :label="30" >停课</el-checkbox>
                        <el-checkbox :label="4" >其他</el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item label="" prop="groupName">
                    <el-checkbox v-model="ruleForm.isSendClassHead">提醒班主任晨检</el-checkbox>
                </el-form-item>
                <el-form-item label="晨检提醒时间" label-width="140px" v-if="ruleForm.isSendClassHead">
                    <el-select v-model="ruleForm.remindTime" placeholder="请选择提醒时间">
                        <el-option label="每天早上7:00定时提醒" value="07:00"></el-option>
                        <el-option label="每天早上7:30定时提醒" value="07:30"></el-option>
                        <el-option label="每天早上8:00定时提醒" value="08:00"></el-option>
                        <el-option label="每天早上8:30定时提醒" value="08:30"></el-option>
                        <el-option label="每天早上9:00定时提醒" value="09:00"></el-option>
                        <el-option label="每天早上9:30定时提醒" value="09:30"></el-option>
                    </el-select>
                </el-form-item>
                 <el-form-item label="" prop="groupName">
                    <el-checkbox v-model="ruleForm.isSendClassHeadNoon">提醒班主任午检</el-checkbox>
                </el-form-item>
                <el-form-item label="午检提醒时间" label-width="140px" v-if="ruleForm.isSendClassHeadNoon">
                    <el-select v-model="ruleForm.remindTimeNoon" placeholder="请选择提醒时间">
                        <el-option label="12:00" value="12:00"></el-option>
                        <el-option label="12:30" value="12:30"></el-option>
                        <el-option label="13:00" value="13:00"></el-option>
                        <el-option label="13:30" value="13:30"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="" prop="groupName">
                    <el-checkbox v-model="ruleForm.isSendReportMor">推送晨检报告<span style="color:red">（每天上午9:00）</span>
                    </el-checkbox>
                    <el-checkbox v-model="ruleForm.isSendReport">推送午检报告<span style="color:red">（每天下午14:00）</span>
                    </el-checkbox>
                </el-form-item>
                <el-form-item label="推送人员" prop="groupName" v-if="ruleForm.isSendReport||ruleForm.isSendReportMor">
                    <address-book v-model="ruleForm.addressData" :config="configPushData" ref="address"></address-book>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>
<script>
    import AddressBook from '@/components/AddressBook/indexExpand';
    import {addAndUpdateStuMoringCheckInit, getStuMoringCheckInit} from '@/api/morningCheck';

    const typeNameMapping = {
        100: '到勤体温正常',
        102: '到勤体温异常',
        101: '未到',
        103: '迟到',        
        0: '事假',
        1: '病假',
        20: '休学',
        21: '防疫',
        30: '停课',
        4: '其他'
    }

    export default {
        components: {AddressBook},
        data() {
            return {
                ruleForm: {
                    isSendReport: false,
                    isSendReportMor:false,
                    isSendClassHead: false,
                    isSendClassHeadNoon:false,
                    remindTime: '07:00',
                    remindTimeNoon:'12:00',
                    addressData: {
                        departJson: [],
                        groupJson: [],
                        userJson: []
                    },
                },
                typeCodeList: [100, 101,102],
                configPushData: {
                    title: '请选择推送人员',
                    depart: {target: 'all', departType: 't', userTypes: '1'},
                    group: 'show'
                },
            }
        },
        created() {
            this.getStuMoringCheckInits()
        },
        methods: {
            //获取详情
            getStuMoringCheckInits() {
                getStuMoringCheckInit().then(res => res.data)
                    .then(data => {
                        if (data.code === 200) {
                            let detailObject = data.data;
                            this.ruleForm.isSendReport = detailObject.isSendReport == 2 ? true : false;
                            this.ruleForm.isSendReportMor = detailObject.isSendReportMor == 2 ? true : false;
                            this.ruleForm.isSendClassHead = detailObject.isSendClassHead == 2 ? true : false;
                            this.ruleForm.isSendClassHeadNoon = detailObject.isSendClassHeadNoon == 2 ? true : false;
                            this.ruleForm.remindTime = detailObject.remindTime;
                            this.ruleForm.remindTimeNoon = detailObject.remindTimeNoon||'12:00';
                            
                            this.ruleForm.addressData.departJson = JSON.parse(detailObject.reportDepartJson);
                            this.ruleForm.addressData.groupJson = JSON.parse(detailObject.reportGroupJson);
                            this.ruleForm.addressData.userJson = JSON.parse(detailObject.reportUserJson);
                            if(detailObject.typeJson) {
                                this.typeCodeList = JSON.parse(detailObject.typeJson).map(item => item.typeCode);
                            }
                            let is=true;
                            for(let i=0;i<this.typeCodeList.length;i++){
                                if(this.typeCodeList[i]==102){
                                    is=false
                                }
                            }
                            if(is){
                                this.typeCodeList.push(102)
                            }
                        }
                    }).catch(() => {
                })
            },
            //保存
            addAndUpdateStuMoringCheckInits() {
                if (this.ruleForm.isSendReport||this.ruleForm.isSendReportMor) {
                    if ((this.ruleForm.addressData.departJson.length == 0) && (this.ruleForm.addressData.groupJson.length == 0) && (this.ruleForm.addressData.userJson.length == 0)) {
                        this.$message({
                            message: '推送人员不能为空！',
                            type: 'error'
                        });
                        return false;
                    }
                } else {
                    this.ruleForm.addressData = {departJson: [], groupJson: [], userJson: []}
                }
                let obj = {
                    isSendClassHead: this.ruleForm.isSendClassHead ? 2 : 1,//	是否发送班主任1代表不发送，2代表发送	number
                    isSendClassHeadNoon: this.ruleForm.isSendClassHeadNoon ? 2 : 1,//	是否发送班主任1代表不发送，2代表发送	number
                    isSendReport: this.ruleForm.isSendReport ? 2 : 1,//	是否推送报告，1代表不推送，2代表推送	number
                    isSendReportMor: this.ruleForm.isSendReportMor ? 2 : 1,//	是否推送报告，1代表不推送，2代表推送	number
                    remindTime: this.ruleForm.remindTime,//	推送时间	string
                    remindTimeNoon: this.ruleForm.remindTimeNoon,//	推送时间	string
                    reportDepartJson: this.ruleForm.addressData.departJson,//	推送部门json	string
                    reportGroupJson: this.ruleForm.addressData.groupJson,//	推送群组Json	string
                    reportUserJson: this.ruleForm.addressData.userJson,//	报告推送人员json	string
                };
                const typeJson = [];
                this.typeCodeList.forEach(typeCode => {
                    typeJson.push({
                        typeCode,
                        typeName: typeNameMapping[typeCode]
                    });
                })
                obj.typeJson = typeJson;
                addAndUpdateStuMoringCheckInit(obj).then(res => res.data).then(data => {
                    if (data.code === 200) {
                        this.$message({message: '操作成功！', type: 'success'});
                        this.$router.back();
                    }
                }).catch(() => {
                })

            }
        }
    }
</script>
<style lang="scss" scoped>
    .morningCheck {
        padding:12px;
        box-sizing: border-box;

        .menu-tools {
            border-bottom: 1px solid #e7eaec;
            padding-bottom: 10px;
        }
        .main-wrap {
            padding-top: 20px;
            padding-left: 20px;
            width: 810px;
            box-sizing: border-box;
            margin: 0 auto;
        }
    }
</style>


