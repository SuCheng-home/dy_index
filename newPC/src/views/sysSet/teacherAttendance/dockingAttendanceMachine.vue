<template>
    <div class="docking_attendance_box">
        <backtool>
            <el-button type="primary" size="medium" :loading="save_loading" @click.native="saveDockingMsg">保存
            </el-button>
            <el-button type="primary" size="medium" :loading="save_loading" @click.native="delCheckWorkInit">清除
            </el-button>
        </backtool>
        <div class="machine_box">
            <el-form :model="ruleForm" ref="dockingRuleForm" :rules="rules" label-width="140px">
                <el-form-item label="appId" prop="appId">
                    <el-input v-model.trim="ruleForm.appId" placeholder="请输入appId"></el-input>
                </el-form-item>
                <el-form-item label="secretId" prop="secretId">
                    <el-input v-model.trim="ruleForm.secretId" placeholder="请输入secretId"></el-input>
                </el-form-item>
                <el-form-item label="corpId" prop="corpId">
                    <el-input v-model.trim="ruleForm.corpId" placeholder="请输入corpId"></el-input>
                </el-form-item>
                <el-form-item label="考勤版本">
                    <el-select v-model="ruleForm.checkVision" placeholder="请选择">
                        <el-option v-for="(item, index) in visionList" :key="index" :label="item.label"
                                   :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
    import Backtool from '@/components/BackTool';
    import {addAndUpdateCheckWorkInit, getCheckWorkInitBySchoolId, delCheckWorkInit} from '@/api/systemSet/dockingAttendanceMachine';

    export default {
        name: 'dockingAttendanceMachine',
        components: {
            Backtool
        },
        data() {
            return {
                visionList: [
                    {
                        value: 1,
                        label: '考勤版本一'
                    },
                    {
                        value: 2,
                        label: '考勤版本二'
                    }
                ],
                save_loading: false,
                ruleForm: {
                    appId: '',
                    secretId: '',
                    corpId: '',
                    checkVision: 1,
                },
                rules: {
                    appId: [
                        {required: true, message: '请输入appId！', trigger: 'blur'}
                    ],
                    secretId: [
                        {required: true, message: '请输入secretId！', trigger: 'blur'}
                    ],
                    corpId: [
                        {required: true, message: '请输入corpId！', trigger: 'blur'}
                    ]
                }
            }
        },
        created() {
            this.getCheckWorkInitBySchoolId();
        },
        methods: {
            saveDockingMsg() {
                this.$refs.dockingRuleForm.validate((valid) => {
                    if (valid) {
                        let query = {
                            appId: this.ruleForm.appId,
                            secretId: this.ruleForm.secretId,
                            corpId: this.ruleForm.corpId,
                            checkVision: this.ruleForm.checkVision
                        };
                        this.addAndUpdateCheckWorkInit(query);
                    }
                });
            },
            addAndUpdateCheckWorkInit(query) {
                addAndUpdateCheckWorkInit(query).then(res => {
                    if (res.data.code === 200) {
                        this.$message({
                            type: 'success',
                            message: '设置成功！'
                        });
                        this.$router.back();
                    } else {
                        this.$message({
                            type: 'warning',
                            message: res.data.msg
                        });
                    }
                })
            },
            getCheckWorkInitBySchoolId() {
                getCheckWorkInitBySchoolId().then(res => {
                    const data = res.data.data;
                    if (res.data.code === 200 && data) {
                        this.ruleForm.appId = data.appId;
                        this.ruleForm.secretId = data.secretId;
                        this.ruleForm.corpId = data.corpId;
                        this.ruleForm.checkVision = data.checkVision;
                    } else {
                        this.ruleForm.appId = '';
                        this.ruleForm.secretId = '';
                        this.ruleForm.corpId = '';
                        this.ruleForm.checkVision = 1;
                    }
                })
            },
            delCheckWorkInit() {
                this.$confirm('此操作将永久清除对接考勤机设置, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    delCheckWorkInit().then(res => {
                        if (res.data.code === 200) {
                            this.$message({
                                type: 'success',
                                message: '清除成功！'
                            });
                            this.getCheckWorkInitBySchoolId();
                        } else {
                            this.$message({
                                type: 'warning',
                                message: res.data.msg
                            });
                        }
                    })
                }).catch(() => {
                });
            }
        }
    }
</script>

<style lang="scss" scoped>
    .docking_attendance_box {
        padding:12px;

        .machine_box {
            width: 800px;
            margin: 20px auto;
        }
        .el-select{
            width:100%;
        }
    }
</style>
