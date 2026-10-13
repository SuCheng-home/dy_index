<template>
    <div class="app-container calendar-list-container">
        <backtool>
            <el-button type="primary" size="medium" @click.native="addandUpdateStuAskleaveGroup">保存</el-button>
        </backtool>
        <div style="width:810px;margin:10px auto;">
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="140px" class="demo-ruleForm">
                <el-form-item label="组名称" prop="title">
                    <el-input v-model="ruleForm.title"></el-input>
                </el-form-item>
                <el-form-item label="负责人员" prop="addressData" required>
                    <address-book v-model="ruleForm.addressData" :config="ruleForm.configData"></address-book>
                </el-form-item>
                <el-form-item label="班级" prop="checkedGroupClassList" required>
                    <class-column v-model="ruleForm.checkedGroupClassList"></class-column>
                </el-form-item>
            </el-form>
        </div>

    </div>
</template>
<script>
    import Backtool from '@/components/BackTool';
    import AddressBook from '@/components/AddressBook/indexExpand';
    import ClassColumn from '@/components/ClassColumn';
    import {
        getStuAskleaveGroupList,
        addStuAskleaveGroup,
        updateAskleaveGroup,
        getStuAskleaveGroupInfo
    } from '@/api/systemSet/StuLeave2Set';

    export default {
        components: {
            Backtool,
            AddressBook,
            ClassColumn
        },
        data() {
            var validateAddress = (rule, value, callback) => {
                if (value.userJson == undefined || value.userJson == '[]') {
                    callback(new Error('选择负责人员！'));
                } else {
                    callback();
                }
            };
            var validateClass = (rule, value, callback) => {
                if (value.length == 0) {
                    callback(new Error('选择班级！'));
                } else {
                    callback();
                }
            };
            return {
                ruleForm: {
                    groupId: '',
                    title: '',
                    configData: {title: '负责人员', depart: {target: 'user', departType: 't', userTypes: '1'}},
                    addressData: {},
                    checkedGroupClassList: []
                },
                rules: {
                    title: [
                        {required: true, message: '请输入检查组名称！', trigger: 'blur'},
                        {min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur'}
                    ],
                    checkedGroupClassList: [
                        {validator: validateClass, trigger: 'input'}
                    ],
                    addressData: [{validator: validateAddress, trigger: 'input'}]
                }

            }
        },
        created() {
            this.ruleForm.groupId = this.$route.query.groupId;
            if (this.ruleForm.groupId) {
                getStuAskleaveGroupInfo(this.ruleForm.groupId).then(res => {
                    let data = res.data.data;
                    this.ruleForm.groupId = data.id;
                    this.ruleForm.title = data.title;
                    this.ruleForm.checkedGroupClassList = JSON.parse(data.classJson);
                    //this.$refs.address.setdefault({ departJson: JSON.stringify([]), userJson: , groupJson: JSON.stringify([]) });
                    this.ruleForm.addressData = {userJson: JSON.parse(data.insUserJson)};
                }).catch();
            }
        },
        methods: {
            getAddressData(data) {
                this.ruleForm.addressData = data;
            },
            addandUpdateStuAskleaveGroup() {
                this.$refs['ruleForm'].validate((valid) => {
                    if (!valid) {
                        return;
                    }
                    if (this.ruleForm.groupId) {
                        if (this.ruleForm.title.trim().length == 0) {
                            this.$message.error('请填写组名称！');
                            return;
                        }
                        let query = {
                            id: this.ruleForm.groupId,
                            title: this.ruleForm.title,
                            classJson: this.ruleForm.checkedGroupClassList,
                            insUserJson: JSON.stringify(this.ruleForm.addressData.userJson)
                        };
                        updateAskleaveGroup(query).then(res => {
                            let data = res.data;
                            if (data.code == 200) {
                                let _this = this;
                                this.$message({
                                    message: '保存成功！',
                                    type: 'success',
                                    onClose: function () {
                                        _this.$router.back();
                                    }
                                });
                            } else {
                                this.$message({
                                    message: data.msg,
                                    type: 'error'
                                });
                            }

                        }).catch()
                    } else {
                        if (this.ruleForm.title.trim().length == 0) {
                            this.$message.error('请填写组名称！');
                            return;
                        }

                        let query = {
                            title: this.ruleForm.title,
                            classJson: this.ruleForm.checkedGroupClassList,
                            insUserJson: JSON.stringify(this.ruleForm.addressData.userJson)
                        };
                        addStuAskleaveGroup(query).then(res => {
                            let data = res.data;
                            if (data.code == 200) {
                                let _this = this;
                                this.$message({
                                    message: '保存成功！',
                                    type: 'success',
                                    onClose: function () {
                                        _this.$router.back();
                                    }
                                });
                            } else {
                                this.$message({
                                    message: data.msg,
                                    type: 'error'
                                });
                            }

                        }).catch();
                    }
                });

            }
        }
    }
</script>
