<template>
    <div class="supply_class_add">
        <div class="header">
            <el-button @click="goBack" size="medium">返回</el-button>
            <el-button type="primary" @click="saveSupply(1)" size="medium">存草稿</el-button>
            <el-button type="primary" @click="saveSupply(2)" size="medium">发布</el-button>
            <div class="button_wrap" v-show="!supplyId">
                <span class="tab_left" @click="addReplace">代课</span>
                <span @click="indexChange">调课</span>
                <span class="tab_right  tab_color ">其他</span>
            </div>
        </div>
        <div class="supply_add_box" :style="`height: ${nobottommaxH}px;`">
            <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="140px" class="demo-ruleForm">
                <el-form-item label="代课老师" prop="addressData">
                    <address-book v-model="ruleForm.addressData" :config="teacherConfigData"></address-book>
                </el-form-item>
                <el-form-item label="日期" prop="supplyDate">
                    <el-date-picker v-model="ruleForm.supplyDate" type="date" placeholder="选择日期" :clearable="false"
                                    @change="changeDate" ></el-date-picker>
                </el-form-item>
                <el-form-item label="代课方式" prop="substituteType">
                    <el-select v-model="ruleForm.substituteType" placeholder="请选择代课方式">
                        <el-option label="按节次" :value="1"></el-option>
                        <el-option label="按天" :value="2"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="节次" prop="sectionId" v-if="ruleForm.substituteType === 1">
                    <el-select v-model="ruleForm.sectionId" placeholder="请选择节次" @change="changeSection">
                        <el-option v-for="item in schoolSectionList" :key="item.sectionId" :label="item.sectionNoName"
                                   :value="item.sectionId">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="天数" prop="substituteDayNum" v-else-if="ruleForm.substituteType === 2">
                    <el-input-number v-model="ruleForm.substituteDayNum" :min="0.5" :step="0.5" label="天数" step-strictly></el-input-number>
                </el-form-item>
                <el-form-item label="原因">
                    <el-radio v-model="ruleForm.reasonType" label="因公">因公</el-radio>
                     <el-radio v-model="ruleForm.reasonType" label="因私">因私</el-radio>
                </el-form-item>
                <el-form-item label="备注">
                    <el-input type="textarea" v-model="ruleForm.reason"></el-input>
                </el-form-item>
                <el-form-item label="图片" prop="pic">
                        <uploader multiple pathPrefix="daiketiaoke" module="daiketiaoke" moduleCode="2009" v-model="adjustPics" :extList="['bmp', 'png', 'jpg', 'jpeg', 'gif']" showMode="image" :showModeCover="false" showResult="image" ></uploader>
                    </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
    import mixins from '@/mixins/windowResize';
    import AddressBook from '@/components/AddressBook/indexExpand';
    import Uploader from '@/components/Uploader/WebUploader';
    import {
        getSchoolClassNoJSONArray,
        addOtherSupplyClass,
        editOtherSupplyClass,
        getSupplyAdjustClassInfo
    } from '@/api/supplyClass';

    export default {
        name: "supplyClassAddReplace",
        components: {
            AddressBook,Uploader
        },
        data() {
            return {
                supplyId: 0,
                supplyDateOptions: {
                    disabledDate(time) {
                        return time.getTime() < Date.now() - 8.64e7;
                    }
                },
                teacherConfigData: {
                    title: '选择老师',
                    depart: {target: 'user', departType: 't', userTypes: '1'},
                    // SingleChose: true,
                    group: false
                },
                schoolSectionList: [],
                ruleForm: {
                    addressData: {
                        userJson: []
                    },
                    supplyDate: '',
                    sectionId: '',
                    substituteType: 1,
                    substituteDayNum: 0.5,
                    reason: '',
                    reasonType:""
                },
                rules: {
                    addressData: [
                        {required: true}
                    ],
                    supplyDate: [
                        {required: true, message: '请选择日期！'}
                    ],
                    sectionId: [
                        {required: true, message: '请选择节次！'}
                    ],
                    substituteDayNum: [
                        {required: true, message: '请选择天数！'}
                    ]
                },
                adjustPics:[]
            }
        },
        mixins: [mixins],
        created() {
            this.supplyId = this.$route.query.id || 0;
            if (this.supplyId) {
                this.getSupplyAdjustClassInfo();
            }
            this.getSchoolClassNoJSONArray();
        },
        methods: {
            // 详情
            getSupplyAdjustClassInfo() {
                getSupplyAdjustClassInfo(this.supplyId).then(res => {
                    const data = res.data.data;
                    if (res.data.code === 200) {
                        this.ruleForm = {
                            substituteType: data.substituteType,
                            substituteDayNum: data.substituteDayNum,
                            supplyDate: data.supplyDate,
                            sectionId: data.supplyClassNo,
                            reason: data.reason,
                            reasonType:data.reasonType,
                            addressData: {
                                userJson: []
                            }
                        };
                        if(data.adjustPics){
                            for(let i=0;i<JSON.parse(data.adjustPics).length;i++){
                                this.adjustPics.push({
                                    fileUrl:JSON.parse(data.adjustPics)[i].picUrl
                                })
                            }
                        }
                        this.ruleForm.addressData.userJson = data.supplyTeacherList;
                    }
                }).then(() => {
                }).catch();
            },
            goBack() {
                this.$router.back();
            },
            addReplace() {
                this.$router.replace({path: 'addReplace'});
            },
            indexChange() {
                this.$router.replace({path: 'addChange'});
            },
            saveSupply(state) {
                this.$refs['ruleForm'].validate((valid) => {
                    if (valid) {
                        if (!this.ruleForm.addressData.userJson || !this.ruleForm.addressData.userJson.length) {
                            this.$message({
                                message: '请选择代课老师！',
                                type: 'warning'
                            });
                            return;
                        }
                          let myadjustPics=[]
                        for(let i=0;i<this.adjustPics.length;i++){
                               myadjustPics.push({
                                    picUrl:this.adjustPics[i].fileUrl
                                })
                            }

                        let query = {
                            adjustPics: JSON.stringify(myadjustPics),
                            reason: this.ruleForm.reason,
                            reasonType: this.ruleForm.reasonType,
                            substituteType: this.ruleForm.substituteType,
                            substituteDayNum: this.ruleForm.substituteType === 2 ? this.ruleForm.substituteDayNum : '',
                            createUserType: 1, // 教务处创建
                            state: state,
                            type: 3,
                            id: this.supplyId,
                            typeName: '其他',
                            supplyTeacherJson: JSON.stringify(this.ruleForm.addressData.userJson),
                            supplyDate: this.$moment(this.ruleForm.supplyDate).format("YYYY-MM-DD"),
                            supplyClassNo: this.ruleForm.substituteType === 1 ? this.ruleForm.sectionId : '',
                            supplyClassNoName: this.ruleForm.substituteType === 1 ? this.schoolSectionList[this.schoolSectionList.map(item => item.sectionId).indexOf(this.ruleForm.sectionId)].sectionNoName : '',
                        };
                        if (this.supplyId) {
                            this.editOtherSupplyClass(query);
                        } else {
                            this.addOtherSupplyClass(query);
                        }
                    }
                });
            },
            addOtherSupplyClass(query) {
                addOtherSupplyClass(query).then(res => {
                    const data = res.data;
                    if (res.data.code === 200) {
                        const msgText = query.state === 2 ? '发布' : '保存';
                        this.$message({
                            message: msgText + '成功',
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
            editOtherSupplyClass(query) {
                editOtherSupplyClass(query).then(res => {
                    const data = res.data;
                    if (res.data.code === 200) {
                        const msgText = query.state === 2 ? '发布' : '保存';
                        this.$message({
                            message: msgText + '成功',
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

            getSchoolClassNoJSONArray() {
                getSchoolClassNoJSONArray().then(res => {
                    const data = res.data;
                    if (res.data.code === 200 && data.data.length) {
                        this.schoolSectionList = data.data;
                        if (!this.supplyId) {
                            this.ruleForm.sectionId = data.data[0].sectionId || '';
                        }
                    }
                }).catch();
            },

        }
    }
</script>

<style lang="scss" scoped>
    .supply_class_add {
        padding:12px;

        .demo-ruleForm {
            width: 810px;
            margin: 0 auto;
        }

        .el-input, .el-select {
            width: 100%;
        }

        .header {
            padding-bottom: 10px;
            border-bottom: 1px solid #eee;

            .button_wrap {
                width: 50%;
                margin-right: 20%;
                overflow: hidden;
                float: right;

                span {
                    width: 33%;
                    line-height: 34px;
                    float: left;
                    text-align: center;
                    background: #fff;
                    border: 1px solid #bfcbd9;
                    cursor: pointer;
                }

                .tab_left {
                    border-radius: 4px 0 0 4px;
                }

                .tab_right {
                    border-radius: 0 4px 4px 0;
                }

                .tab_color {
                    color: #fff;
                    background-color: #409eff;
                    border-color: #409eff;
                    -webkit-box-shadow: -1px 0 0 0 #409eff;
                    box-shadow: -1px 0 0 0 #409eff;
                }
            }
        }

        .supply_add_box {
            padding: 20px;
        }
    }
</style>
