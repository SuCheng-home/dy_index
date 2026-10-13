<template>
    <div class="app-container calendar-list-container">
        <backtool>
            <el-button type="primary" size="medium" :disabled="saveLoading" @click="onSave">创建</el-button>
        </backtool>
        <div class="form-depart">
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="140px" class="demo-ruleForm">
                <el-form-item label="班级起始序号" prop="order">
                    <el-input v-model="ruleForm.order" placeholder="不能超过30个字"></el-input>
                </el-form-item>
                <el-form-item label="班级数量" prop="num">
                    <el-input v-model="ruleForm.num" placeholder="只能输入数字"></el-input>
                </el-form-item>
            </el-form>
        </div>

    </div>
</template>
<script>
    import {mapGetters} from 'vuex';
    import Backtool from "@/components/BackTool";
    import {getOrder, addBatch} from '@/api/systemSet/org.js';

    export default {
        components: {
            Backtool
        },
        data() {
            var checkCode = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('不能为空'));
                }
                let g = /^[0-9]*[0-9][0-9]*$/;
                if (!g.test(value)) {
                    callback(new Error('请输入正整数'));
                } else {
                    if (value.length > 2) {
                        callback(new Error('长度不能超过2！'));
                    } else {
                        callback();
                    }
                }
            };
            return {
                saveLoading: false,
                pid: this.$route.query.pid,
                ruleForm: {
                    order: 1,
                    num: 1
                },
                rules: {
                    order: [
                        {required: true, validator: checkCode, trigger: 'blur'}
                    ],
                    num: [
                        {required: true, validator: checkCode, trigger: 'blur'}
                    ]
                }
            };
        },
        created() {
            getOrder({
                pid: this.pid
            })
                .then(res => res.data)
                .then(data => {
                    this.$set(this.ruleForm, 'order', data.data);
                })
        },
        methods: {
            onSave() {
                this.$refs['ruleForm'].validate(valid => {
                    if (valid) {
                        this.saveLoading = true;
                        addBatch({
                            num: this.ruleForm.num,
                            order: this.ruleForm.order,
                            pid: this.pid
                        })
                            .then(res => res.data)
                            .then(data => {
                                if(data.result) {
                                    this.$message.success('创建成功');
                                    setTimeout(() => {
                                        this.$router.back();
                                    }, 1000);
                                } else {
                                    this.saveLoading = false;
                                    this.$message.error(data.msg);
                                }
                            })
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
