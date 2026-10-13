<template>
    <div class='cancel'>
        <div class="header">
            <el-button size="medium" @click="goBack">返回</el-button>&nbsp;
            <el-button
                size="medium"
                type="primary"
                @click="sure"
                :loading="loading"
            >保存
            </el-button>
        </div>
        <div class="form">
            <el-form ref="form" :model="formData" label-width="100px" :rules="rules">
                <el-form-item label="撤销密码：" prop="password">
                    <el-input v-model.number="formData.password" placeholder="请输入6位纯数字组合"  maxlength="6"
                              show-word-limit></el-input>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>
<script>
    import {getReadIndependWord, addReadIndependWord} from '@/api/readBookBeiyou';

    export default {
        data() {
            const removePasswordValidator = (rule, value, callback) => {
                if (value === '') {
                    callback();
                } else {
                    if (!/^\d{6}$/.test(value)) {
                        callback(new Error('移除密码必须是六位纯数字'));
                    } else {
                        callback();
                    }
                }
            };
            return {
                loading: false,
                classId: this.$route.query.classId,
                formData: {
                    password: '',
                },
                rules: {
                    password: [{validator: removePasswordValidator, trigger: 'blur'}],
                },
            }
        },
        created() {
            this.getReadIndependWord()
        },
        methods: {
            getReadIndependWord() {
                getReadIndependWord({
                    classId: this.classId
                }).then(res => {
                    if (res.data.code === 200 && res.data.result) {
                        this.formData.password = res.data.data ? res.data.data.password : ""
                    } else {
                        this.$message.warning(res.data.msg);
                    }
                })
            },
            sure() {
                this.$refs['form'].validate((valid) => {
                    if (valid) {
                        this.loading = true
                        addReadIndependWord({
                            classId: this.classId,
                            password: this.formData.password,
                        }).then(res => {
                            if (res.data.code === 200 && res.data.result) {
                                this.$message.success('保存成功')
                                this.getReadIndependWord()
                            } else {
                                this.$message.warning(res.data.msg);
                            }
                            this.loading = false
                        }).catch(() => {
                            this.loading = false
                        })
                    } else {
                        return false;
                    }
                })
            },
            goBack() {
                this.$router.back()
            }
        },
    }
</script>
<style lang="scss" scoped>
    .cancel {
        padding:12px;
    }
   .header {
    border-bottom: 1px solid #e7eaec;
  }
    .header {
        padding-bottom: 10px;
    }

    .form {
        width: 810px;
        margin: 20px auto;
    }
</style>
