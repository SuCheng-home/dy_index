<template>
    <div class="temperatureSetup">
        <div class="el-row menu-tools">
            <el-button @click="$router.back()" size="medium">返回</el-button>
            <el-button type="primary" size="medium"   @click="saveSchoolTemperatureSetInfos()">保存
            </el-button>
        </div>
        <div class="main-wrap">
            <div class="ul" style="width:810px;margin:10px auto;">
                <div class="li"> &nbsp; &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;&nbsp;
                    &nbsp;
                    <el-checkbox v-model="ruleForm.mSendSys">体温枪检测温度更新至晨检体温数据</el-checkbox>
                </div>
                <div class="li" v-if="ruleForm.mSendSys"><span> * </span>晨检时间 &nbsp; &nbsp;
                    <el-time-select placeholder="开始时间" v-model="ruleForm.mStartTime"
                                    :picker-options="{ start: '04:00', step: '00:05', end: '12:00',maxTime:ruleForm.mEndTime }"
                                    :clearable="false" :editable="false"></el-time-select>&nbsp;至&nbsp;
                    <el-time-select placeholder="结束时间" v-model="ruleForm.mEndTime"
                                    :picker-options="{start: '04:00', step: '00:05', end: '12:00',minTime: ruleForm.mStartTime }"
                                    :clearable="false" :editable="false"></el-time-select>

                </div>
                <div class="li"> &nbsp; &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;&nbsp;
                    &nbsp;
                    <el-checkbox v-model="ruleForm.nSendSys">体温枪检测温度更新至午检体温数据</el-checkbox>
                </div>
                <div class="li" v-if="ruleForm.nSendSys"><span> * </span>午检时间 &nbsp; &nbsp;
                    <el-time-select placeholder="开始时间" v-model="ruleForm.nStartTime"
                                    :picker-options="{ start: '12:00', step: '00:05', end: '15:00',maxTime:ruleForm.nEndTime }"
                                    :clearable="false" :editable="false"></el-time-select>&nbsp;至&nbsp;
                    <el-time-select placeholder="结束时间" v-model="ruleForm.nEndTime"
                                    :picker-options="{start: '12:00', step: '00:05', end: '15:00',minTime: ruleForm.nStartTime }"
                                    :clearable="false" :editable="false"></el-time-select>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import {saveSchoolTemperatureSetInfo, getSchoolTemperatureSetInfo} from '@/api/temperatureSetup';

    export default {
        data() {
            return {
                ruleForm: {
                    id: '',//	主键ID	string
                    mEndTime: '',//	晨检时间结束时间	string
                    mSendSys: false,//	体温枪检测温度更新至晨检体温数据 0否 1是	number
                    mStartTime: '',//	晨检时间开始时间	string
                    nEndTime: '',//	午检时间结束时间	string
                    nSendSys: false,//	体温枪检测温度更新至午检体温数据 0否 1是	number
                    nStartTime: '',//	午检时间开始时间	string
                }
            }
        },
        created() {
            this.getSchoolTemperatureSetInfos();
        },
        methods: {
            //获取详情
            getSchoolTemperatureSetInfos() {
                getSchoolTemperatureSetInfo().then(res => res.data)
                    .then(data => {
                        if (data.data.id) {
                            let detailObject = data.data;
                            this.ruleForm.id = data.data.id;
                            this.ruleForm.mSendSys = detailObject.mSendSys == 1 ? true : false;
                            this.ruleForm.nSendSys = detailObject.nSendSys == 1 ? true : false;
                            this.ruleForm.mEndTime = detailObject.mEndTime;
                            this.ruleForm.mStartTime = detailObject.mStartTime;
                            this.ruleForm.nEndTime = detailObject.nEndTime;
                            this.ruleForm.nStartTime = detailObject.nStartTime;
                        }
                    }).catch(() => {
                })
            },
            //保存
            saveSchoolTemperatureSetInfos() {
                if (!this.ruleForm.mStartTime && this.ruleForm.mSendSys) {
                    this.$message({message: '晨检开始时间不能为空！', type: 'error'});
                    return false;
                }
                if (!this.ruleForm.mEndTime && this.ruleForm.mSendSys) {
                    this.$message({message: '晨检结束时间不能为空！', type: 'error'});
                    return false;
                }
                if (!this.ruleForm.nStartTime && this.ruleForm.nSendSys) {
                    this.$message({message: '午检开始时间不能为空！', type: 'error'});
                    return false;
                }
                if (!this.ruleForm.nEndTime && this.ruleForm.nSendSys) {
                    this.$message({message: '午检结束时间不能为空！', type: 'error'});
                    return false;
                }
                let obj = {
                    id: this.ruleForm.id,
                    mSendSys: this.ruleForm.mSendSys ? 1 : 0,
                    nSendSys: this.ruleForm.nSendSys ? 1 : 0,
                    mStartTime: this.ruleForm.mStartTime,//	推送时间	string
                    mEndTime: this.ruleForm.mEndTime,//	推送时间	string
                    nStartTime: this.ruleForm.nStartTime,//	推送时间	string
                    nEndTime: this.ruleForm.nEndTime,//	推送时间	string

                };
                saveSchoolTemperatureSetInfo(obj).then(res => res.data).then(data => {
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
    .temperatureSetup {
        padding:12px;
        box-sizing: border-box;

        .menu-tools {
            border-bottom: 1px solid #e7eaec;
            padding-bottom: 10px;
        }

        .main-wrap {
            padding: 20px;

            .ul {
                font-size: 14px;

                .li {
                    line-height: 36px;
                    padding: 10px 0;

                    span {
                        color: #f56c6c
                    }

                    .el-date-editor.el-input {
                        width: 300px;
                    }
                }

            }
        }

    }
</style>


