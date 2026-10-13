<template>
    <div class="advice_type_wrap">
        <div class="header">
            <el-button @click="goBack" size="medium">返回</el-button>
            <el-button type="primary" size="medium" @click="saveAdviceType">保存</el-button>
        </div>
        <div class="advice_type_add_msg_box">
            <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="140px" class="demo-ruleForm">
                        <el-form-item label="类型名称" prop="typeName">
                            <el-input v-model.trim="ruleForm.typeName" :maxlength="20"></el-input>
                        </el-form-item>
                        <el-form-item label="类型负责人" prop="typeManagerData">
                            <address-book v-model="ruleForm.typeManagerData" :config="managerConfigData" mode="organization"></address-book>
                        </el-form-item>
                        <el-form-item label=" ">
                            <el-checkbox v-model="isShowPhoneNumber">显示联系电话</el-checkbox>
                        </el-form-item>
                        <el-form-item label="联系电话" prop="phoneNumber" v-show="isShowPhoneNumber">
                            <el-input v-model.trim="ruleForm.phoneNumber" :maxlength="11"></el-input>
                        </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
    import AddressBook from '@/components/AddressBook/indexExpand';
    import {addAdviceType, updateAdviceType, getAdviceTypeById} from '@/api/systemSet/adviceSet';

    export default {
        name: "adviceTypeAdd",
        components: {
            AddressBook
        },
        data() {
            return {
                adviceTypeId: 0,
                isShowPhoneNumber: false,
                managerConfigData: {
                    title: '请选择负责人',
                    depart: { target: 'user', departType: 't', userTypes: '1' },
                    group: false
                },
                ruleForm: {
                    typeName: '',
                    typeManagerData: {
                        userJson: []
                    },
                    phoneNumber: ''
                },
                rules: {
                    typeName: [
                        {required: true, message: '请输入类型名称！', trigger: 'blur'},
                        {min: 1, max: 20, message: '长度在 1 到 20 个字符！', trigger: 'blur'}
                    ],
                    typeManagerData: [
                        {required: true}
                    ]
                }
            }
        },
        created() {
            if (this.$route.query.id) {
                this.adviceTypeId = this.$route.query.id;
                this.getAdviceTypeById();
            }
        },
        methods: {
            goBack() {
                this.$router.back();
            },
            saveAdviceType() {
                this.$refs['ruleForm'].validate((valid) => {
                    if (valid) {
                        if (!this.ruleForm.typeManagerData.userJson || !this.ruleForm.typeManagerData.userJson.length) {
                            this.$message({
                                message: '请选择类型负责人！',
                                type: 'warning'
                            });
                            return;
                        }

                        const reg = /^1[345789]\d{9}$/;
                        if (this.isShowPhoneNumber && !this.ruleForm.phoneNumber) {
                            this.$message({
                                message: '请输入联系电话！',
                                type: 'warning'
                            });
                            return;
                        } else if (this.isShowPhoneNumber && !reg.test(this.ruleForm.phoneNumber)) {
                            this.$message({
                                message: '请输入正确的手机号！',
                                type: 'warning'
                            });
                            return;
                        }

                        let query = {
                            isDisplayPhoneNumber: this.isShowPhoneNumber ? 2 : 1,
                            managerUserIds: this.ruleForm.typeManagerData.userJson.map(item => item.id).toString(),
                            managerUserNames: this.ruleForm.typeManagerData.userJson.map(item => item.name).toString(),
                            phoneNumber: this.isShowPhoneNumber ? this.ruleForm.phoneNumber : '',
                            typeName: this.ruleForm.typeName,
                        };

                        if (this.adviceTypeId) { // 编辑
                            query.id = this.adviceTypeId;
                            this.updateAdviceType(query);
                        } else {
                            this.addAdviceType(query);
                        }
                    }
                });
            },
            addAdviceType(query) {
                addAdviceType(query).then(res => {
                    const data = res.data;
                    if (res.data.code === 200) {
                        this.$message({
                            message: '保存成功',
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
            updateAdviceType(query) {
                updateAdviceType(query).then(res => {
                    const data = res.data;
                    if (res.data.code === 200) {
                        this.$message({
                            message: '保存成功',
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
            getAdviceTypeById() {
                getAdviceTypeById(this.adviceTypeId).then(res => {
                    const data = res.data.data;
                    if (res.data.code === 200) {
                        this.ruleForm.typeName = data.typeName;
                        if (data.isDisplayPhoneNumber === 2) {
                            this.isShowPhoneNumber = true;
                            this.ruleForm.phoneNumber = data.phoneNumber;
                        }
                        this.ruleForm.typeManagerData = {
                            userJson: data.mangerUserList
                        };
                    }
                }).catch();
            }
        }
    }
</script>

<style lang="scss" scoped>
    .advice_type_wrap{
        padding:12px;
        .header{
            padding-bottom: 10px;
            border-bottom: 1px solid #eee;
        }
        .demo-ruleForm{
            width: 810px;
            margin: 0 auto;
        }
        .advice_type_add_msg_box{
            padding-top: 20px;
        }
    }
</style>
