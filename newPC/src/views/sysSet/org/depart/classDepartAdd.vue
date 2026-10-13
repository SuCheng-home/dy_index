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
                <el-form-item label="排序" prop="order">
                    <el-input v-model="ruleForm.order" placeholder="只能输入大于或等于0的数字（由小到大排序）"></el-input>
                </el-form-item>
                <el-form-item label="编码" prop="code">
                    <el-input v-model="ruleForm.code" placeholder="只能输入数字"></el-input>
                </el-form-item>
                <el-form-item v-if="schoolInfo.syncForWx == 2" label="微信ID">
                    <el-input v-model="ruleForm.wxDepartId" placeholder="以企业微信后台的部门id为准，填写到此处"></el-input>
                </el-form-item>
            </el-form>
        </div>

    </div>
</template>
<script>
    import {mapGetters} from 'vuex';
    import Backtool from "@/components/BackTool";
    import {getOrder, departAdd} from '@/api/systemSet/org.js';

    export default {
        components: {
            Backtool
        },
        data() {
            var checkOrder = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('不能为空'));
                }
                let g = /^[0-9]*[0-9][0-9]*$/;
                if (!g.test(value)) {
                    callback(new Error('请输入正整数'));
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
                        callback(new Error('请输入正整数'));
                    } else {
                        if (value.length > 10) {
                            callback(new Error('长度不能超过10！'));
                        } else {
                            callback();
                        }
                    }
                } else {
                    callback(new Error('请输入编码！'));
                }
            };
            return {
                saveLoading: false,
                ruleForm: {
                    pid: '',
                    type: '',
                    name: "",
                    order: 1,
                    code: '',
                    wxDepartId: ''
                },
                rules: {
                    name: [
                        {required: true, message: "请输入班级名称", trigger: "blur"},
                        {min: 1, max: 20, message: "长度在 1 到 30 个字符", trigger: "blur"}
                    ],
                    order: [
                        {required: true, validator: checkOrder, trigger: 'blur'}
                    ],
                    code: [
                        {required: true, validator: checkCode, trigger: 'blur'}
                    ]
                }
            };
        },
        computed: {
            ...mapGetters(['schoolInfo'])
        },
        created() {
            this.pid = this.$route.query.pid;
            this.type = this.$route.query.type;
            getOrder({
                pid: this.pid
            })
                .then(res => res.data)
                .then(data => {
                    this.$set(this.ruleForm, 'order', data.data);
                })
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
                            wxDepartId: this.ruleForm.wxDepartId
                        };
                        departAdd(query).then(res => {
                            let data = res.data;
                            if (data.code == 200) {
                                let _this = this;
                                this.$message({
                                    type: 'success',
                                    message: '添加成功!',
                                    duration: 1000,
                                    onClose: function () {
                                        _this.$router.back();
                                        _this.saveLoading = false;
                                    }
                                });
                            } else {
                                let _this = this;
                                this.$alert(data.msg, '提示', {
                                    confirmButtonText: '确定',
                                    onClose: function () {
                                        _this.saveLoading = false;
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
        margin-top: 10px;
        width: 810px;
    }
</style>
