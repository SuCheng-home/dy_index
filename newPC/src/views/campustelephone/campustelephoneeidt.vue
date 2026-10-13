<template>
    <div class="campustelephoneadd">
        <div class="top">
            <el-button @click="$router.back()" type="default" size="medium">返回</el-button>
            <el-button type="primary" size="medium" @click="updateTelephoneDevices()">保存</el-button>
        </div>
        <div class="subject" :style="`height: ${nobottommaxH}px;`">
            <el-form ref="ruleForm" :model="ruleForm" label-width="140px" :rules="rules">
                <el-form-item label="名称" prop="name">
                    <el-input v-model.trim="ruleForm.name" placeholder="请输入名称" :maxlength="30"></el-input>
                </el-form-item>
                <el-form-item label="类型" prop="mark">
                    <el-select v-model="ruleForm.mark" placeholder="请选择类型" disabled>
                        <el-option label="QJ" value="QJ"></el-option>
                        <el-option label="KE" value="KE"></el-option>
                        <el-option label="XunZhen" value="XunZhen"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="MAC">
                    {{ruleForm.mac}}
                </el-form-item>
                <el-form-item label="KEY" >
                    <el-input v-model.trim="ruleForm.devicesKey" placeholder="请输入KEY" :maxlength="50"></el-input>
                </el-form-item>
                <el-form-item label="APK版本">
                    <el-input v-model.trim="ruleForm.apkVersion" placeholder="请输入APK版本" :maxlength="50"></el-input>
                </el-form-item>

            </el-form>

        </div>
    </div>
</template>
<script>
    import {updateTelephoneDevices, getTelephoneDevicesInfo} from "@/api/campustelephone";
    import mixin from "@/mixins/windowResize";

    export default {
        data() {
            return {
                ruleForm: {
                    apkVersion: "", //		APK版本	string
                    devicesKey: "", //		设备key	string
                    mac: "", //	设备mac	string
                    mark: "QJ", //		设备类型标识	string
                    name: "", //		设备名称	string
                    id: this.$route.query.id
                },
                rules: {
                    name: [{required: true, message: "请输入名称", trigger: "blur"}],
                    mark: [{required: true, message: '请选择类型', trigger: 'change'}],
                    devicesKey: [{required: true, message: "请输入KEY", trigger: "blur"}],
                    apkVersion: [{required: true, message: "请输入APK版本", trigger: "blur"}],
                },
            };
        },
        mixins: [mixin],
        created() {
            getTelephoneDevicesInfo(this.ruleForm.id).then(res => {
                let data = res.data.data;
                this.ruleForm.apkVersion = data.apkVersion;
                this.ruleForm.name = data.name;
                this.ruleForm.mark = data.mark;
                this.ruleForm.devicesKey = data.devicesKey;
                this.ruleForm.mac = data.mac;
            });
        },
        methods: {

            updateTelephoneDevices() {
                this.$refs["ruleForm"].validate(valid => {
                    if (valid) {
                        updateTelephoneDevices(this.ruleForm)
                            .then(res => res.data)
                            .then(data => {
                                if (data.result) {
                                    this.$message({
                                        message: "新增成功！",
                                        type: "success",
                                        duration: 1000
                                    });
                                    this.$router.back();
                                } else {
                                    this.$message({
                                        type: "error",
                                        message: data.msg
                                    });
                                }
                            })
                            .catch(() => {
                            });
                    }
                });
            }
        }
    };
</script>
<style lang="scss" scoped>
    .campustelephoneadd {
        padding: 12px;

        .top {
            border-bottom: 1px solid #e7eaec;
            padding-bottom: 10px;
        }

        .subject {
            overflow: auto;

            .el-form {
                padding-top: 20px;
                width: 810px;
                margin: 0 auto;

                .el-input, .el-select {
                    width: 100%;
                }
            }
        }
    }
</style>
