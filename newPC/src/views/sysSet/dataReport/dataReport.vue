<template>
    <div class="app-container calendar-list-container">
        <backtool>
            <el-button type="primary" @click.native="preservation()" size="medium">保存</el-button>
        </backtool>
        <div style="width:810px;margin:20px auto;">
            <el-form label-width="140px" class="demo-ruleForm">
                <el-form-item>
                    <div>
                        <el-checkbox v-model="isSendParent">是否发送家长（周日上午 10：00）</el-checkbox>
                    </div>
                    <div>
                        <el-checkbox v-model="isSendTeacher">是否发送任课老师（周一上午 10：00）</el-checkbox>
                    </div>
                    <div>
                        <el-checkbox v-model="isSendClassHeader">是否发送班主任（周一上午 10：00）</el-checkbox>
                    </div>
                    <el-checkbox v-model="isSendManger">是否发送校领导（周一上午 10：00）</el-checkbox>
                </el-form-item>
                <el-form-item label="推送人员" v-if="isSendManger">
                    <address-book v-model="addressData" :config="configData"></address-book>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>
<script>
    import Backtool from "@/components/BackTool";
    import AddressBook from "@/components/AddressBook/indexExpand";
    import {
        addAndUpdateDataReportInit, getDataReportInit
    } from "@/api/systemSet/dataReport";

    export default {
        components: {
            AddressBook,
            Backtool
        },
        data() {
            return {
                isSendParent: false,
                isSendManger: false,
                isSendTeacher: false,
                isSendClassHeader: false,
                leaveTypeList: [],
                configData: {
                    title: "推送人",
                    depart: {target: "all", departType: "all", userTypes: "1,3"},
                    group: true
                },
                addressData: {
                    departJson: [],
                    groupJson: [],
                    userJson: []
                }
            };
        },
        created() {
            getDataReportInit()
                .then(res => {
                    let data = res.data.data;
                    if (data.isSendManger == 2) {
                        this.isSendManger = true;
                    }
                    if (data.isSendParent == 2) {
                        this.isSendParent = true;
                    }
                    if (data.isSendTeacher == 2) {
                        this.isSendTeacher = true;
                    }
                    if (data.isSendClassHeader == 2) {
                        this.isSendClassHeader = true;
                    }
                    this.addressData = {
                        departJson: JSON.parse(data.reportDepartJson),
                        groupJson: JSON.parse(data.reportGroupJson),
                        userJson: JSON.parse(data.reportUserJson)
                    };
                })
                .catch();
        },
        methods: {
            preservation() {
                let isSendManger = 1;
                let isSendParent = 1;
                let isSendTeacher = 1;
                let isSendClassHeader = 1;
                if (this.isSendManger) {
                    isSendManger = 2;
                    if ((this.addressData.departJson.length == 0) && (this.addressData.groupJson.length == 0) && (this.addressData.userJson.length == 0)) {
                        this.$message({
                            message: '推送人不能为空！',
                            type: 'warning'
                        });
                        return
                    }
                } else {
                    this.addressData.departJson = [];
                    this.addressData.groupJson = [];
                    this.addressData.userJson = [];
                }
                if (this.isSendParent) {
                    isSendParent = 2;
                }
                if (this.isSendTeacher) {
                    isSendTeacher = 2;
                }
                if (this.isSendClassHeader) {
                    isSendClassHeader = 2;
                }
                let departJson = JSON.stringify(this.addressData.departJson); //部门json字符串
                let groupJson = JSON.stringify(this.addressData.groupJson); //群组json字符串
                let userJson = JSON.stringify(this.addressData.userJson); //用户json字符串
                addAndUpdateDataReportInit({
                    isSendManger: isSendManger,
                    isSendParent: isSendParent,
                    isSendTeacher: isSendTeacher,
                    isSendClassHeader: isSendClassHeader,
                    reportDepartJson: departJson,
                    reportGroupJson: groupJson,
                    reportUserJson: userJson
                })
                    .then(res => {
                        let data = res.data;
                        if (data.code == 200) {
                            this.$message({
                                message: '设置成功！',
                                type: 'success'
                            });
                            this.$router.back();
                        }
                    })
                    .catch();
            }
        }
    };
</script>
