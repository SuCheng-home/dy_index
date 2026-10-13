<template>
    <div class="app-container calendar-list-container">
        <backtool>
            <el-button type="primary" size="medium" v-if="ruleForm.addType=='add'" :loading="saveLoading" @click="saveDepart">保存
            </el-button>
            <el-button type="primary" size="medium" v-if="ruleForm.addType=='edit'" :loading="saveLoading" @click="updateDepart">保存
            </el-button>
        </backtool>
        <div class="form-depart">
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="140px" class="demo-ruleForm">
                <el-form-item label="名称" prop="name">
                    <el-input v-model="ruleForm.name" placeholder="不能超过30个字"></el-input>
                </el-form-item>
                <el-form-item label="编码" prop="code">
                    <el-input v-model="ruleForm.code" placeholder="只能输入数字"></el-input>
                </el-form-item>
                <el-form-item v-if="schoolInfo.syncForWx == 2" label="微信ID">
                    <el-input v-model="ruleForm.wxDepartId" placeholder="以企业微信后台的部门id为准，填写到此处"></el-input>
                </el-form-item>
                <el-form-item label="排序" prop="order">
                    <el-input v-model="ruleForm.order" placeholder="只能输入大于或等于0的数字（由小到大排序）"></el-input>
                </el-form-item>
            </el-form>
        </div>

    </div>
</template>
<script>
    import {mapGetters} from 'vuex';

    import Backtool from "@/components/BackTool";
    import {departAdd, getDeptInAndMaster, departUpdate} from '@/api/systemSet/org.js';

    export default {
        components: {
            Backtool,
        },
        computed: {
            ...mapGetters(['schoolInfo'])
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
                    callback();
                }
            };
            return {
                saveLoading: false,
                addType: '',
                ruleForm: {
                    pid: '',
                    type: '',
                    name: "",
                    order: 100,
                    code: '',
                    wxDepartId: ''
                },
                rules: {
                    name: [
                        {required: true, message: "请输入名称", trigger: "blur"},
                        {min: 1, max: 30, message: "长度在 1 到 30 个字符", trigger: "blur"}
                    ],
                    order: [
                        {required: true, validator: checkOrder, trigger: 'blur'}
                    ],
                    code: [
                        {validator: checkCode, trigger: 'blur'}
                    ]
                }
            };
        },
        created() {
            this.ruleForm.pid = this.$route.query.pid;
            this.ruleForm.type = this.$route.query.type;
            this.ruleForm.addType = this.$route.query.addType;
            if (this.ruleForm.addType == 'edit') {//如果是修改部门
                getDeptInAndMaster(this.ruleForm.pid).then(res => {
                    let data = res.data.data;
                    this.ruleForm.name = data.depart.name;
                    this.ruleForm.order = data.depart.order;
                    this.ruleForm.code = data.depart.code == null ? '' : data.depart.code;
                    this.ruleForm.wxDepartId = data.depart.wxDepartId;
                }).catch();
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
                            pid: this.ruleForm.pid,
                            type: this.ruleForm.type,
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
            },
            updateDepart() {
                this.$refs['ruleForm'].validate(valid => {
                    if (valid) {
                        this.saveLoading = true;
                        let query = {
                            id: this.ruleForm.pid,
                            name: this.ruleForm.name,
                            order: this.ruleForm.order,
                            code: this.ruleForm.code,
                            wxDepartId: this.ruleForm.wxDepartId
                        };
                        departUpdate(query).then(res => {
                            let data = res.data;
                            if (data.code == 200) {
                                let _this = this;
                                this.$message({
                                    type: 'success',
                                    message: '修改成功!',
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
        margin: 10px auto;
        width: 810px;
    }
</style>
