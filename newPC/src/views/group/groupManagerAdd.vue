<template>
    <div class="app-container">
        <el-row style="padding-bottom:20px">
                <backtool>
                    <el-button  size="medium" v-if="JSON.stringify($route.query) === '{}'" class="filter-item" type="primary"
                               :loading="isShowBtnLoading" @click="handleAddGroupSure('form')">保存
                    </el-button>
                    <el-button  size="medium" v-else class="filter-item" type="primary" :loading="isShowBtnLoading"
                               @click="handleEditGroupSure('form')">保存
                    </el-button>
                </backtool>
        </el-row>
        <div class="body">
           <el-form ref="form" :model="ruleForm" :rules="rules" label-width="140px">
                <el-form-item label="常用组名称" prop="groupName">
                    <el-input v-model="ruleForm.groupName" auto-complete="off" placeholder="10个字以内"
                            :maxlength="10"></el-input>
                </el-form-item>
                <el-form-item label="类型" prop="type">
                  <el-radio-group v-model="ruleForm.type" :disabled="isEditGroup">
                    <el-radio :label="1">教师</el-radio>
                    <el-radio :label="3">家长</el-radio>
                    <el-radio :label="2">学生</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="管理人" prop="addressData1">
                    <address-book v-model="ruleForm.addressData1" :config="configData" :isSchoolManager="true"></address-book>
                    <span style="color:#e64340">提醒：若删除本人管理权，将无权再管理此常用组，慎删！</span>
                </el-form-item>
                <el-form-item label="使用人" prop="addressData2">
                    <address-book v-model="ruleForm.addressData2" :config="configData" :isSchoolManager="true"></address-book>
                </el-form-item>
           </el-form>
        </div>

    </div>
</template>
<script>
    import {addGroup, editGroup} from '@/api/group';
    import AddressBook from '@/components/AddressBook/indexExpand';
    export default {
        data: function () {
            const validateAddressData1 = (rule, value, callback) => {
                if (value.userJson && value.userJson.length) {
                    return callback()
                } else {
                    return callback(new Error('请选择管理人'));
                }
            };
            const validateAddressData2 = (rule, value, callback) => {
                if (value.userJson && value.userJson.length) {
                    return callback()
                } else {
                    return callback(new Error('请选择使用人'));
                }
            };
            return {
              isEditGroup: false,
                ruleForm: {
                    groupName: '',
                    addressData1: {},
                    addressData2: {},
                    type: 1
                },
                rules: {
                    groupName: [
                        {required: true, message: '请输入常用组名称', trigger: 'blur'},
                    ],
                    addressData1: [
                        {validator: validateAddressData1, trigger: 'change', required: true}
                    ],
                    addressData2: [
                        {validator: validateAddressData2, trigger: 'change', required: true}
                    ]
                },
                form: {
                    groupName: '',
                    groupId: '',
                    managerSelected: '',
                    employeeSelected: '',
                    type: 1
                },
                configData: {title: '选择用户', depart: {target: 'user', departType: 't', userTypes: '1', notCheckSchool: true}},
                isShowBtnLoading: false
            }
        },
        components: {
            AddressBook
        },
        watch: {
            ruleForm: {
                handler(curVal) {
                    this.form.groupName = curVal.groupName;
                    this.form.type = curVal.type;
                },
                deep: true
            }
        },
        mounted() {
            let query = this.$route.query;
            this.ruleForm.addressData1 = {userJson: [this.$store.state.user.userInfo]};//默认选中当前用户
            this.ruleForm.addressData2 = {userJson: [this.$store.state.user.userInfo]};//默认选中当前用户
            if (JSON.stringify(query) !== '{}') {//根据有没有query判断是新建还是编辑
              this.isEditGroup = true;
              this.form.groupName = query.name;
              this.ruleForm.groupName = query.name;
              this.form.groupId = query.id;
              this.form.type = query.type || 1;
              this.ruleForm.type = query.type || 1;
              this.ruleForm.addressData1 = {userJson: query.groupManagers};
              this.ruleForm.addressData2 = {userJson: query.groupCanusers};
            }
        },
        methods: {
            handleAddGroupSure(formName) {
                /* employeeSelected 使用人id
                 * managerSelected  管理人id
                 * groupName        群组名称
                 */
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.isShowBtnLoading = true;
                        this.form.managerSelected = this.ruleForm.addressData1.userJson.map(res => {
                            return res.id
                        }).toString();
                        this.form.employeeSelected = this.ruleForm.addressData2.userJson.map(res => {
                            return res.id
                        }).toString();
                        const that = this;
                        addGroup(this.form).then(res => {
                            if (res.data.code === 200) {
                                this.$message({
                                    type: 'success',
                                    message: "保存成功"
                                });
                                this.$router.push({path: 'groupManagerIndex'})
                            } else {
                              this.$message({
                                type: 'warning',
                                message: res.data.msg
                              });
                              this.isShowBtnLoading = false;
                            }
                        }).catch(function () {
                            that.isShowBtnLoading = false;
                        })
                    } else {
                        return false
                    }
                })
            },
            handleEditGroupSure(formName) {
                /*employeeSelected 使用人id
                 *managerSelected  管理人id
                 *groupName        群组名称
                 *groupId          常用组id
                 */
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.isShowBtnLoading = true;
                        this.form.managerSelected = this.ruleForm.addressData1.userJson.map(res => {
                            return res.id
                        }).toString();
                        this.form.employeeSelected = this.ruleForm.addressData2.userJson.map(res => {
                            return res.id
                        }).toString();
                        const that = this;
                        editGroup(this.form).then(res => {
                            if (res.data.code === 200) {
                                this.$message({
                                    type: 'success',
                                    message: "保存成功"
                                });
                                this.$router.push({path: 'groupManagerIndex'})
                            } else {
                              this.$message({
                                type: 'warning',
                                message: res.data.msg
                              });
                              this.isShowBtnLoading = false;
                            }
                        }).catch(function () {
                            that.isShowBtnLoading = false;
                        })
                    } else {
                        return false
                    }
                })
            }
        }
    }
</script>
<style lang="scss" scoped>
  .body{
      width: 810px;
      margin: 0 auto;
  }
</style>


