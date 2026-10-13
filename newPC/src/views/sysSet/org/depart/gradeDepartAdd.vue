<template>
    <div class="app-container calendar-list-container">
        <backtool>
            <el-button type="primary" size="medium" :loading="saveLoading" @click="saveDepart">保存</el-button>
        </backtool>
        <div class="form-depart">
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="140px" class="demo-ruleForm">
                <el-form-item label="名称" prop="name">
                    <el-input v-model="ruleForm.name" placeholder="不能超过30个字"></el-input>
                </el-form-item>
                <el-form-item label="编码" prop="code">
                    <el-input v-model="ruleForm.code" placeholder="只能输入数字"></el-input>
                </el-form-item>
                <el-form-item label="排序" prop="order">
                    <el-input v-model="ruleForm.order" placeholder="只能输入大于或等于0的数字（由小到大排序）"></el-input>
                </el-form-item>
                <el-form-item label="学段" prop="learningStages" v-if="[6, 9, 12].includes(schoolInfo.type)">
                    <el-select v-model="ruleForm.learningStages" placeholder="请选择">
                        <el-option :key="-1" label="请选择"
                                   :value="''"></el-option>
                        <el-option v-for="[value, label] in schoolTypeConstants" :key="value" :label="label"
                                   :value="value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="学段" prop="learningStages" v-else>
                    {{['', '幼儿园', '小学', '初中', '高中'][ruleForm.learningStages]}}
                </el-form-item>
                <el-form-item label="年级" prop="standardGrade">
                    <el-select v-if="ruleForm.learningStages == 1" v-model="ruleForm.standardGrade" placeholder="请选择">
                        <el-option label="托班" value="0101"></el-option>
                        <el-option label="小班" value="0102"></el-option>
                        <el-option label="中班" value="0103"></el-option>
                        <el-option label="大班" value="0104"></el-option>
                    </el-select>
                    <el-select v-if="ruleForm.learningStages == 2" v-model="ruleForm.standardGrade" placeholder="请选择">
                        <el-option label="一年级" value="0201"></el-option>
                        <el-option label="二年级" value="0202"></el-option>
                        <el-option label="三年级" value="0203"></el-option>
                        <el-option label="四年级" value="0204"></el-option>
                        <el-option label="五年级" value="0205"></el-option>
                        <el-option label="六年级" value="0206"></el-option>
                    </el-select>
                    <el-select v-if="ruleForm.learningStages == 3" v-model="ruleForm.standardGrade" placeholder="请选择">
                        <el-option label="初一" value="0301"></el-option>
                        <el-option label="初二" value="0302"></el-option>
                        <el-option label="初三" value="0303"></el-option>
                        <el-option label="初四" value="0304"></el-option>
                    </el-select>
                    <el-select v-if="ruleForm.learningStages == 4" v-model="ruleForm.standardGrade" placeholder="请选择">
                        <el-option label="高一" value="0401"></el-option>
                        <el-option label="高二" value="0402"></el-option>
                        <el-option label="高三" value="0403"></el-option>
                        <el-option label="高四" value="0404"></el-option>
                    </el-select>
                </el-form-item>


            </el-form>
        </div>

    </div>
</template>
<script>
    import {mapGetters} from 'vuex';
    import Backtool from "@/components/BackTool";
    import {departAdd} from '@/api/systemSet/org.js';

    export default {
        components: {
            Backtool
        },
        data() {
            var checkDepartName = (rule, value, callback) => {
                if (!value || value.trim().length === 0) {
                    this.ruleForm.name = '';
                    callback(new Error('请输入部门名称！'));
                } else if (value.trim().length > 30) {
                    callback(new Error('长度在 1 到 30 个字符！'));
                } else {
                    callback();
                }
            };
            var checkOrder = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('不能为空'));
                }
                let g = /^[0-9]*[0-9][0-9]*$/;
                if (!g.test(value)) {
                    callback(new Error('请输入正整数或0'));
                } else {
                    if (value.length > 10) {
                        callback(new Error('长度不能超过10！'));
                    } else {
                        callback();
                    }
                }
            };
            var checkCode = (rule, value, callback) => {
                if (value != '') {
                    let g = /^[0-9]*[0-9][0-9]*$/;
                    if (!g.test(value)) {
                        callback(new Error('请输入正整数或0'));
                    } else {
                        if (value.length > 10) {
                            callback(new Error('长度不能超过10！'));
                        } else {
                            callback();
                        }
                    }
                } else {
                    callback();
                }
            };
            return {
                schoolTypeConstants: new Map([
                    ['1', '幼儿园'],
                    ['2', '小学'],
                    ['3', '初中'],
                    ['4', '高中'],
                ]),
                pid: this.$route.query.pid,
                type: this.$route.query.type,
                saveLoading: false,
                ruleForm: {
                    name: '',
                    order: 100,
                    code: '',
                    learningStages: '',
                    standardGrade: ''
                },
                rules: {
                    name: [
                        {required: true, validator: checkDepartName, trigger: "blur"}
                    ],
                    order: [
                        {required: true, validator: checkOrder, trigger: 'blur'}
                    ],
                    code: [
                        {validator: checkCode, trigger: 'blur'}
                    ],
                    learningStages: [
                        {required: true, message: '请选择学段', trigger: 'blur'}
                    ],
                    standardGrade: [
                        {required: true, message: '请选择年级', trigger: 'blur'}
                    ]
                }
            };
        },
        computed: {
            ...mapGetters(['schoolInfo'])
        },
        mounted() {
            if (![6, 9, 12].includes(this.schoolInfo.type)) {
                this.ruleForm.learningStages = this.schoolInfo.type;
            }
        },
        methods: {
            saveDepart() {
                this.$refs['ruleForm'].validate(valid => {
                    if (valid) {
                        this.saveLoading = true;
                        let query = {
                            name: this.ruleForm.name,
                            order: this.ruleForm.order,
                            code: this.ruleForm.code,
                            pid: this.pid,
                            type: this.type,
                            learningStages: this.ruleForm.learningStages,
                            standardGrade: this.ruleForm.standardGrade
                        };
                        departAdd(query).then(res => {
                            let data = res.data;
                            if (data.result) {
                                this.$message({
                                    type: 'success',
                                    message: '添加成功!',
                                    duration: 1000,
                                    onClose: () => {
                                        this.$router.back();
                                        this.saveLoading = false;
                                    }
                                });
                            } else {
                                this.$alert(data.msg, '提示', {
                                    confirmButtonText: '确定',
                                    onClose: () => {
                                        this.saveLoading = false;
                                    }
                                });
                            }
                        }).catch();
                    } else {
                        return false;
                    }
                });
            }
        }
    };
</script>
<style scoped>
    .form-depart {
        margin: 10px auto;
        width: 810px;
    }
</style>
