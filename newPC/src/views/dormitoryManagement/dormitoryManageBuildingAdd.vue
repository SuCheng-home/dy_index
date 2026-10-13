<template>
    <div class="building_add_wrap">
        <div class="header">
            <el-button @click="goBack" size="medium" >返回</el-button>
            <el-button type="primary" @click="saveNewBuilding"  size="medium">保存</el-button>
        </div>
        <div class="building_add_msg_box">
            <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="140px" class="demo-ruleForm">
                <el-row :gutter="50">
                    <el-col :span="12" :offset="4">
                        <el-form-item label="楼宇名称" prop="name">
                            <el-input v-model.trim="ruleForm.name" :maxlength="20"></el-input>
                        </el-form-item>
                        <el-form-item label="负责人" prop="managerData">
                            <address-book v-model="ruleForm.managerData" :config="managerConfigData" mode="organization" @input="changeManager"></address-book>
                        </el-form-item>
                        <el-form-item label="负责人联系方式" prop="managerMobile">
                            <el-input v-model.trim="ruleForm.managerMobile" :maxlength="20"></el-input>
                        </el-form-item>
                        <el-form-item label="楼层" prop="floorNum" v-show="!buildingId">
                            <el-input-number v-model.trim="ruleForm.floorNum" :step="1" step-strictly controls-position="right" :min="1" :max="10"></el-input-number>
                        </el-form-item>
                        <el-form-item label="楼层" prop="floorNum" v-show="!!buildingId">
                            <div>{{ruleForm.floorNum}}楼</div>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </div>
    </div>
</template>

<script>
    import AddressBook from '@/components/AddressBook/indexExpand';
    import {addDormBuilding, editDormBuilding, getDormBuildingInfo} from '@/api/dormitoryManage';

    export default {
        name: "dormitoryManageBuildingAdd",
        props: ['currentBuilding'],
        components: {
            AddressBook
        },
        data() {
            return {
                buildingId: 0,
                managerConfigData: {
                    title: '请选择负责人',
                    depart: { target: 'user', departType: 't', userTypes: '1' },
                    SingleChose: true,
                    group: false
                },
                ruleForm: {
                    name: '',
                    managerData: {
                        userJson: []
                    },
                    managerMobile: '',
                    floorNum: 1
                },
                rules: {
                    name: [
                        {required: true, message: '请输入宿舍楼名称！', trigger: 'blur'},
                        {min: 1, max: 20, message: '长度在 1 到 20 个字符！', trigger: 'blur'}
                    ],
                    managerData: [
                        {required: true}
                    ],
                    managerMobile: [
                        {required: true, message: '请输入负责人手机号码！', trigger: 'blur'},
                        {pattern: /^1[345789]\d{9}$/, message: '请输入正确的手机号！', trigger: 'blur'}
                    ],
                    floorNum: [
                        {required: true, message: '请输入楼层数！', trigger: 'blur'}
                    ]
                }
            }
        },
        created() {
            if (this.$route.query.id) {
                this.buildingId = this.$route.query.id;
                this.getDormBuildingInfo();
            }
        },
        methods: {
            goBack() {
                this.$router.replace('building');
            },
            saveNewBuilding() {
                this.$refs['ruleForm'].validate((valid) => {
                    if (valid) {
                        if (!this.ruleForm.managerData.userJson || !this.ruleForm.managerData.userJson.length) {
                            this.$message({
                                message: '请选择负责人！',
                                type: 'warning'
                            });
                            return;
                        }

                        let query = {
                            managerJson: JSON.stringify(this.ruleForm.managerData.userJson),
                            managerMobile: this.ruleForm.managerMobile,
                            name: this.ruleForm.name,
                        };

                        if (this.buildingId) { // 编辑
                            query.id = this.buildingId;
                            this.editDormBuilding(query);
                        } else {
                            query.floorNum = this.ruleForm.floorNum;
                            this.addDormBuilding(query);
                        }
                    }
                });
            },
            addDormBuilding(query) {
                addDormBuilding(query).then(res => {
                    const data = res.data;
                    if (res.data.code === 200) {
                        this.$message({
                            message: '保存成功',
                            type: 'success'
                        });
                        this.$emit('buildingChange', 'add');
                        this.$router.replace('building');
                    } else {
                        this.$message({
                            message: data.msg,
                            type: 'warning'
                        });
                    }
                }).catch();
            },
            editDormBuilding(query) {
                editDormBuilding(query).then(res => {
                    const data = res.data;
                    if (res.data.code === 200) {
                        this.$message({
                            message: '保存成功',
                            type: 'success'
                        });
                        this.$emit('buildingChange', data.data.id);
                        this.$router.replace('building');
                    } else {
                        this.$message({
                            message: data.msg,
                            type: 'warning'
                        });
                    }
                }).catch();
            },
            getDormBuildingInfo() {
                getDormBuildingInfo(this.buildingId).then(res => {
                    const data = res.data.data;
                    if (res.data.code === 200) {
                        this.ruleForm.name = data.name;
                        this.ruleForm.floorNum = data.floorNum;
                        this.ruleForm.managerMobile = data.managerMobile;
                        this.ruleForm.managerData.userJson = JSON.parse(data.managerJson);
                    }
                }).catch();
            },
            changeManager() {
                if (!!this.ruleForm.managerData.userJson.length) {
                    this.ruleForm.managerMobile = this.ruleForm.managerData.userJson[0].mobile || '';
                }
            }
        }
    }
</script>

<style lang="scss" scoped>
    .building_add_wrap{
        .header{
            padding: 10px;
            border-bottom: 1px solid #eee;
        }

        .building_add_msg_box{
            padding-top: 20px;
        }
    }
</style>
