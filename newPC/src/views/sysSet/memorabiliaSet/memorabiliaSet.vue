<template>
    <div class="memorabiliaSet">
        <div class="el-row menu-tools">
            <el-button type="default" size="medium" @click="$router.back()">返回</el-button>
            <el-button
                type="primary"
                size="medium"
                 
                :loading="save_loading"
                @click="saveHandler()"
            >保存
            </el-button>
        </div>
        <div class="main-wrap">
            <el-form ref="ruleForm" :model="ruleForm" class="demo-ruleForm">
                <el-form-item label label-width="140px" prop="groupName">
                    <el-checkbox v-model="ruleForm.isSet">
                        推送大事记
                        <span style="color:red">（默认晚上20:00推送）</span>
                    </el-checkbox>
                </el-form-item>
                <el-form-item label="推送范围" label-width="140px" prop="groupName" v-if="ruleForm.isSet">
                    <address-book v-model="ruleForm.addressData" :config="configPushData" ref="address"></address-book>
                </el-form-item>
                <el-form-item label-width="140px" prop="groupName">
                    <el-checkbox
                        :true-label="1"
                        :false-label="2"
                        v-model="ruleForm.isAdministrativeInspection"
                    >行政巡查
                    </el-checkbox>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>
<script>
    import AddressBook from "@/components/AddressBook/indexExpand";
    import {
        insertOrUpdateBigEventNoteSet,
        getBySchoolId,
    } from "@/api/memorabilia";

    export default {
        components: {
            AddressBook,
        },
        data() {
            return {
                save_loading: false,
                ruleForm: {
                    isSet: false,
                    addressData: {
                        departJson: [],
                        groupJson: [],
                        userJson: [],
                    },
                    isAdministrativeInspection: false,
                },
                configPushData: {
                    title: "推送范围设置",
                    depart: {target: "all", departType: "t", userTypes: "1"},
                },
                detailData: {},
            };
        },
        created() {
            this.getBySchoolIdFunc();
        },

        methods: {
            getBySchoolIdFunc() {
                getBySchoolId()
                    .then((res) => res.data)
                    .then((data) => {
                        if (data.code === 200) {
                            let detailObject = data.data;
                            this.detailData = data.data;
                            this.ruleForm.isSet = detailObject.isSet == 1 ? true : false;
                            this.ruleForm.addressData = JSON.parse(
                                detailObject.publishUserJson
                            );
                            this.ruleForm.isAdministrativeInspection =
                                detailObject.isAdministrativeInspection;
                        }
                    })
                    .catch(() => {
                    });
            },
            saveHandler() {
                if (this.ruleForm.isSet) {
                    if (
                        this.ruleForm.addressData.departJson.length == 0 &&
                        this.ruleForm.addressData.groupJson.length == 0 &&
                        this.ruleForm.addressData.userJson.length == 0
                    ) {
                        this.$message({
                            message: "推送范围不能为空！",
                            type: "error",
                        });
                        return false;
                    }
                } else {
                    this.ruleForm.addressData = {
                        departJson: [],
                        groupJson: [],
                        userJson: [],
                    };
                }
                insertOrUpdateBigEventNoteSet({
                    isSet: this.ruleForm.isSet ? 1 : 2,
                    publishUserJson: this.ruleForm.addressData,
                    isAdministrativeInspection: this.ruleForm.isAdministrativeInspection,
                })
                    .then((res) => res.data)
                    .then((data) => {
                        if (data.code === 200) {
                            this.$message({
                                message: "操作成功！",
                                type: "success",
                            });
                            this.$router.back();
                        }
                    })
                    .catch(() => {
                    });
            },
        },
    };
</script>
<style lang="scss" scoped>
    .memorabiliaSet {
        padding:12px;
        box-sizing: border-box;

        .menu-tools {
            border-bottom: 1px solid #e7eaec;
            padding-bottom: 10px;
        }
        .demo-ruleForm {
            padding-top: 20px;
            padding-left: 20px;
            width: 810px;
            box-sizing: border-box;
            margin: 0 auto;
        }
    }
</style>


