<template>
    <div>
        <div class="menu-tools">
            <el-button @click="$emit('back')" type="default" size="medium">返回</el-button>
            <el-button class="filter-item" type="primary" @click="onSave" size="medium">保存</el-button>
        </div>
        <div style="width: 810px;padding-top:20px;margin: 0 auto;">
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="160px" class="demo-ruleForm">
                <el-form-item label="类型名称" prop="name">
                    <el-input v-model="ruleForm.name" placeholder="请输入类型名称" size="medium"></el-input>
                </el-form-item>
                <el-form-item label="审核方式" prop="approveType">
                    <el-radio-group v-model="ruleForm.approveType">
                        <el-radio :label="1">级部主任/副主任</el-radio>
                        <el-radio :label="2">部门主任/副主任</el-radio>
                        <el-radio :label="3">教研组</el-radio>
                        <el-radio :label="4">指定审核人</el-radio>
                        <el-radio :label="5">无需审核</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item v-if="ruleForm.approveType == 4" label="审核人" prop="userJson">
                    <address-book v-model="userJson" :config="configData" ref="address"></address-book>
                </el-form-item>
                <el-form-item label="排序号" prop="order" >
                    <el-input-number v-model="ruleForm.order" size="medium" :min="1" placeholder="请输入排序好"></el-input-number>
                </el-form-item>

                 <el-form-item label="申请数量是否限制" prop="isLimit" v-if="currentNodeData.kind==2">
                    <el-radio-group v-model="ruleForm.isLimit">
                        <el-radio :label="1">不限制</el-radio>
                        <el-radio :label="2">按角色限制</el-radio>
                        <el-radio :label="3">按部门限制</el-radio>
                        <el-radio :label="4">按办公室限制</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="老师限制数量" prop="thLimitCount" v-if="ruleForm.isLimit==2&&currentNodeData.kind==2">
                    <el-input-number v-model="ruleForm.thLimitCount" size="medium" :min="1" placeholder="请输入老师限制数量"></el-input-number>
                </el-form-item>
                <el-form-item label="备课组长限制数量" prop="prepareTeamManLimitCount" v-if="ruleForm.isLimit==2&&currentNodeData.kind==2">
                    <el-input-number v-model="ruleForm.prepareTeamManLimitCount" size="medium" :min="1" placeholder="请输入备课组长限制数量"></el-input-number>
                </el-form-item>
                <el-form-item label="部门主任限制数量" prop="mangerLimitCount" v-if="ruleForm.isLimit==2&&currentNodeData.kind==2">
                    <el-input-number v-model="ruleForm.mangerLimitCount" size="medium" :min="1" placeholder="请输入部门主任限制数量"></el-input-number>
                </el-form-item>
                <el-form-item label="超额申请人限制数量" prop="applyLimitCount" v-if="ruleForm.isLimit==2&&currentNodeData.kind==2">
                    <el-input-number v-model="ruleForm.applyLimitCount" size="medium" :min="1" placeholder="请输入超额申请人限制数量"></el-input-number>
                </el-form-item>

                <el-form-item label="部门限制数量" prop="departLimitCount" v-if="ruleForm.isLimit==3&&currentNodeData.kind==2">
                    <el-input-number v-model="ruleForm.departLimitCount" size="medium" :min="1" placeholder="请输入部门限制数量"></el-input-number>
                </el-form-item>
                <el-form-item label="办公室限制数量" prop="officeLimitCount" v-if="ruleForm.isLimit==4&&currentNodeData.kind==2">
                    <el-input-number v-model="ruleForm.officeLimitCount" size="medium" :min="1" placeholder="请输入办公室限制数量"></el-input-number>
                </el-form-item>
                <el-form-item v-if="ruleForm.isLimit != 1&&currentNodeData.kind==2" label="超额审核人" prop="newuserJson">
                    <address-book v-model="newuserJson" :config="newconfigData" ref="address"></address-book>
                </el-form-item>

            </el-form>
        </div>
    </div>
</template>

<script>
    import AddressBook from '@/components/AddressBook/indexExpand';
    import {
        addType,
        updateType
    } from '@/api/printApplication';

    export default {
        name: "printTypeAddEdit",
        components: {AddressBook},
        data() {
            const userJsonValidator = (rule, value, callback) => {
                if(
                    this.userJson.departJson.length === 0 &&
                    this.userJson.groupJson.length === 0 &&
                    this.userJson.userJson.length === 0
                ) {
                    callback(new Error('请选择审核人'));
                } else {
                    callback();
                }
            };
            const newuserJsonValidator = (rule, value, callback) => {
                if(
                    this.newuserJson.departJson.length === 0 &&
                    this.newuserJson.groupJson.length === 0 &&
                    this.newuserJson.userJson.length === 0
                ) {
                    callback(new Error('请选择超额审核人'));
                } else {
                    callback();
                }
            };

            return {
                isEdit: false,
                editId: '',
                ruleForm: {
                    name: '',
                    approveType: 1,
                    order: 1,
                    departLimitCount:undefined,
                    mangerLimitCount:undefined,
                    thLimitCount:undefined,
                    prepareTeamManLimitCount:undefined,
                    officeLimitCount:undefined,
                    applyLimitCount:undefined,
                    isLimit:1
                },
                configData: {title: '请选择审核人', depart: {target: 'user', departType: 't', userTypes: '1', notCheckSchool: true}},
                userJson: {
                    departJson: [],
                    groupJson: [],
                    userJson: []
                },
                newconfigData: {title: '请选择超额审核人', depart: {target: 'user', departType: 't', userTypes: '1', notCheckSchool: true}},
                newuserJson: {
                    departJson: [],
                    groupJson: [],
                    userJson: []
                },
                rules: {
                    name: [
                        { required: true, message: "请填写类型名称！", trigger: "blur" }
                    ],
                    approveType: [
                        { required: true, message: "请选择审核方式！", trigger: "blur" }
                    ],
                     isLimit: [
                        { required: true, message: "请选择申请数量是否限制！", trigger: "blur" }
                    ],
                    userJson: [
                        { required: true, validator: userJsonValidator, trigger: "blur" }
                    ],
                    newuserJson: [
                        { required: true, validator: newuserJsonValidator, trigger: "blur" }
                    ],
                    order: [
                        { required: true, message: "请填写排序号！", trigger: "blur" }
                    ],
                   mangerLimitCount : [
                        { required: true, message: "请填写部门主任限制数量！", trigger: "blur" }
                    ],
                    departLimitCount: [
                        { required: true, message: "请填写部门限制数量！", trigger: "blur" }
                    ],
                    applyLimitCount: [
                        { required: true, message: "请填写超额申请人限制数量！", trigger: "blur" }
                    ],
                    officeLimitCount: [
                        { required: true, message: "请填写办公室限制数量！", trigger: "blur" }
                    ],
                    thLimitCount: [
                        { required: true, message: "请填写老师限制数量！", trigger: "blur" }
                    ],
                    prepareTeamManLimitCount: [
                        { required: true, message: "请填写备课组长限制数量！", trigger: "blur" }
                    ],
                }
            }
        },
        props: {
            currentNodeData: {
                type: Object,
                default: function() {
                    return {}
                }
            },
            editItem: {
                type: Object,
                required: true
            }
        },
        watch: {
            editItem(editItem) {
                 if(editItem) {
                    this.isEdit = true;
                    this.editId = editItem.id;
                    this.ruleForm = {
                        name: editItem.name,
                        approveType: editItem.approveType,
                        departLimitCount: editItem.departLimitCount||undefined,
                        mangerLimitCount: editItem.mangerLimitCount||undefined,
                        applyLimitCount: editItem.applyLimitCount||undefined,
                        officeLimitCount: editItem.officeLimitCount||undefined,
                        thLimitCount: editItem.thLimitCount||undefined,
                        prepareTeamManLimitCount: editItem.prepareTeamManLimitCount||undefined,
                        isLimit: editItem.isLimit||1,
                        order: editItem.order
                    };
                    this.userJson = {
                        departJson: [],
                        groupJson: [],
                        userJson: JSON.parse(editItem.approveUserJson)
                    };
                     this.newuserJson = {
                        departJson: [],
                        groupJson: [],
                        userJson: editItem.limitBatchUser?JSON.parse(editItem.limitBatchUser):[]
                    };
                } else {
                    this.clear();
                }
            }
        },
        methods: {
            clear() {
                this.isEdit = false;
                this.ruleForm = {
                    name: '',
                    approveType: 1,
                    order: 1,
                    departLimitCount:undefined,
                    officeLimitCount:undefined,
                    mangerLimitCount:undefined,
                    applyLimitCount:undefined,
                    thLimitCount:undefined,
                    prepareTeamManLimitCount:undefined,
                    isLimit:1
                };
                this.userJson = {
                    departJson: [],
                    groupJson: [],
                    userJson: []
                };
                 this.newuserJson = {
                    departJson: [],
                    groupJson: [],
                    userJson: []
                };
            },
            onSave() {
                this.$refs.ruleForm.validate(isValid => {
                    if(isValid) {
                        const args = {
                            approveType: this.ruleForm.approveType,
                            approveTypeName: ['', '级部主任/副主任', '部门主任/副主任', '教研组', '指定审核人']
                                [this.ruleForm.approveType],
                            name: this.ruleForm.name,
                            order: this.ruleForm.order,
                            pid: this.currentNodeData.id,
                            pname: this.currentNodeData.name,
                            departLimitCount: this.ruleForm.departLimitCount,
                            officeLimitCount: this.ruleForm.officeLimitCount,
                            mangerLimitCount: this.ruleForm.mangerLimitCount,
                            applyLimitCount:this.ruleForm.applyLimitCount,
                            thLimitCount: this.ruleForm.thLimitCount,
                            prepareTeamManLimitCount: this.ruleForm.prepareTeamManLimitCount,
                            isLimit: this.ruleForm.isLimit,
                            approveUserJson: this.ruleForm.approveType == 4 ? this.userJson.userJson : [],
                            limitBatchUser: this.ruleForm.isLimit != 1 ? this.newuserJson.userJson : []
                        };
                        if(this.isEdit) {
                            args.id = this.editId;
                        } else {
                            args.kind = this.currentNodeData.kind;
                        }
                        new Promise(resolve => {
                            if(this.isEdit) {
                                updateType(args)
                                    .then(resolve)
                            } else {
                                addType(args)
                                    .then(resolve)
                            }
                        })

                            .then(res => res.data)
                            .then(data => {
                                if(data.result) {
                                    this.$message.success('保存成功');
                                    this.$emit('addSuccess');
                                } else {
                                    this.$message.error(data.msg);
                                }
                            })
                    }
                })
            }
        }
    }
</script>

<style scoped>
    .menu-tools {
        border-bottom: 1px solid #e7eaec;
        padding-bottom: 10px;
    }
</style>
