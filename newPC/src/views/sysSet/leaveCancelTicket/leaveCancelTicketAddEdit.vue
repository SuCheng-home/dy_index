<template>
    <div class="app-container calendar-list-container">
        <back-tool>
            <el-button class="filter-item" size="medium" type="primary" @click="saveFunc()" :loading="listLoading">保存
            </el-button>
        </back-tool>
        <div style="padding-top:20px;">
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="140px"
                     style="width:810px;margin:10px auto;">
                <el-form-item label="抵扣条名称：" prop="deductionName">
                    <el-input v-model="ruleForm.deductionName" :maxlength="20" placeholder="请填写内容"></el-input>
                </el-form-item>
                <el-form-item label="抵扣条类型：" prop="typeCode">
                    <el-radio-group v-model="ruleForm.typeCode">
                        <el-radio :label="1">1小时</el-radio>
                        <el-radio :label="2">半天</el-radio>
                        <el-radio :label="3">1天</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="抵扣请假类型：" prop="leaveType">
                    <el-checkbox-group v-model="ruleForm.leaveType">
                        <el-checkbox v-for="item in leaveTypeList" :label="item.key" name="checkList" :key="item.key">
                            {{item.label}}
                        </el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item label="有效期：" prop="validityTime">
                    <el-radio-group v-model="ruleForm.validityTime">
                        <el-radio :label="1">当月</el-radio>
                        <el-radio :label="2">本学期</el-radio>
                        <el-radio :label="3">不限制</el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-form>
        </div>

    </div>

</template>

<script>
    import BackTool from '@/components/BackTool';
    import {
        addOvertimeDeductionType,
        editOvertimeDeductionType,
        getOvertimeDeductionTypeInfoById
    } from '@/api/leaveCancelTicket';
    import {findDicsByCode} from '@/api/common/common';

    export default {
        components: {
            BackTool
        },
        data() {

            const leaveTypeValidator = (rule, value, callback) => {
                if (this.ruleForm.leaveType.length === 0) {
                    callback(new Error('至少选择请假类型！'));
                } else {
                    callback();
                }

            };
            return {
                id: this.$route.query.id,
                isEdit: !!this.$route.query.id,

                leaveTypeList: [],
                listLoading: false,
                ruleForm: {
                    deductionName: '',
                    validityTime: 1,
                    leaveType: [],
                    typeCode: 1
                },
                rules: {
                    deductionName: [{
                        required: true, message: '请输入抵扣条名称', trigger: 'blur'
                    }],
                    validityTime: [{
                        required: true, message: '请选择有效期', trigger: 'blur'
                    }],
                    leaveType: [{
                        required: true, validator: leaveTypeValidator
                    }],
                    typeCode: [{
                        required: true, message: '请选择抵扣条类型', trigger: 'blur'
                    }],
                },
            }
        },
        // 获取渲染数据当数据加载完成后执行(生命周期中的钩子函数)
        created() {
            findDicsByCode({
                dicCode: 'teacherAskLeave1'
            }).then(res => {
                const data = res.data.data;
                if (res.data.code === 200) {
                    this.leaveTypeList = data.map((item) => {
                        return {
                            label: item.value,
                            key: item.code
                        }
                    });
                }
            }).catch();
            if(this.isEdit) {
                getOvertimeDeductionTypeInfoById({
                    id: this.id
                })
                    .then(res => res.data)
                    .then(data => {
                        const pageData = data.data;
                        pageData.leaveType = pageData.leaveCodes.split(',');
                        this.ruleForm = pageData;

                    })
            }

        },
        mounted() {
        },
        methods: {
            saveFunc() {
                this.$refs.ruleForm.validate((valid) => {
                    if (valid) {
                        const leaveCodes = [],
                            leaveNames = [];
                        this.ruleForm.leaveType.forEach(code => {
                            const obj = this.leaveTypeList.find(item => item.key == code);
                            if(obj) {
                                leaveCodes.push(obj.key);
                                leaveNames.push(obj.label);
                            }
                        });
                        const args = {
                            deductionName: this.ruleForm.deductionName,
                            validityTime: this.ruleForm.validityTime,
                            leaveCodes,
                            leaveNames,
                            typeName: ['', '一小时', '半天', '一天'][this.ruleForm.typeCode],
                            typeCode: this.ruleForm.typeCode,
                        }
                        new Promise(resolve => {
                            if(this.isEdit) {
                                args.id = this.id;
                                editOvertimeDeductionType(args)
                                    .then(res => res.data)
                                    .then(resolve)
                            } else {
                                addOvertimeDeductionType(args)
                                    .then(res => res.data)
                                    .then(resolve)
                            }
                        })
                            .then(data => {
                                if(data.result) {
                                    this.$message.success(`${this.isEdit ? '编辑' : '新增'}成功`);
                                    setTimeout(() => {
                                        this.$router.back();
                                    }, `1000`);
                                } else {
                                    this.$message.error(data.msg);
                                }
                            })
                    }
                })
            },

        }
    }
</script>

<style scoped="scoped">
    .filter-container {
        margin-bottom: 20px;
    }

    .el-select {
        width: 100%;
    }
</style>
