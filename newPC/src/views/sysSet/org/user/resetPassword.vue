<template>
  <span>
             <el-button type="primary" @click="dialogResetVisible = true" size="medium">密码重置</el-button>

      <el-dialog title="密码重置" :visible.sync="dialogResetVisible" :close-on-press-escape='false'
                 width="700px"
                 :close-on-click-modal='false' :modal-append-to-body='false'>
            <div class="change-passbox">
                <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px"
                         class="demo-ruleForm">
                    <el-form-item label="密码">
                        <password-input ref="passwordInput" v-model="ruleForm.pass"></password-input>
                    </el-form-item>
                    <el-form-item label="确认密码" prop="checkPass">
                        <el-input type="password" v-model="ruleForm.checkPass" auto-complete="off"></el-input>
                    </el-form-item>
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogResetVisible = false">取 消</el-button>
                <el-button type="primary" @click="resetPass">确 定</el-button>
            </span>
        </el-dialog>
  </span>
</template>
<script>
    import PasswordInput from '@/components/PasswordInput/PasswordInput';
    import {resetPass} from '@/api/systemSet/org.js';
    import {encrypt} from '@/utils/utils';

    export default {
        props: {
            userId: {
                type: Number,
                default: 0
            }
        },
        data() {
            var validatePass2 = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请再次输入密码'));
                } else if (value !== this.ruleForm.pass) {
                    callback(new Error('两次输入密码不一致!'));
                } else {
                    callback();
                }
            };
            return {
                dialogResetVisible: false,
                ruleForm: {
                    pass: '',
                    checkPass: ''
                },
                rules: {
                    checkPass: [
                        {validator: validatePass2, trigger: 'blur'}
                    ]
                }
            };
        },
        components: {PasswordInput},
        methods: {
            resetPass() {
                const isPassValid = this.$refs['passwordInput'].validate();
                this.$refs['ruleForm'].validate(valid => {
                    if (valid && isPassValid) {
                        resetPass(this.userId, encrypt(this.ruleForm.pass)).then(res => {
                            let data = res.data;
                            if (data.code == 200) {
                                this.dialogResetVisible = false;
                                let _this = this;
                                this.$message({
                                    message: '重置密码成功！',
                                    type: 'success',
                                    duration: 1000,
                                    onClose: function () {
                                        _this.dialogResetVisible = false;
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
    };
</script>
<style scoped>
    .sns-btn-div {
        height: 80px;
        padding-left: 20px;
        padding-top: 20px;
    }

    .bs-callout {
        padding: 20px;
        margin: 20px 0;
        border: 1px solid #eee;
        border-left-width: 5px;
        border-radius: 3px;
    }

    .bs-callout-danger {
        border-left-color: #ce4844;
    }

    .info-title {
        height: 30px;
        line-height: 30px;
    }

    .change-passbox {
        width: 94%;
    }
</style>
