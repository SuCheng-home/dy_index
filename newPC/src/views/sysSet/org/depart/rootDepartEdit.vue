<template>
    <div class="app-container calendar-list-container">
        <backtool>
            <el-button type="primary" size="medium" :loading="saveLoading" @click="updateDepart">修改</el-button>
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
                <el-form-item label="负责人" prop="addressName">
                    <span class="address_text">{{ruleForm.addressName}}</span>
                </el-form-item>
                <el-form-item label="其他负责人" prop="otherAddressName">
                    <span class="address_text">{{ruleForm.otherAddressName}}</span>
                </el-form-item>
             
            </el-form>
        </div>

    </div>
</template>
<script>
    import {mapGetters} from 'vuex';

    import Backtool from "@/components/BackTool";
    import {
        queryDepartById,
        departUpdate,
        queryOtherManager,
        queryManager,
        getDeptInAndMaster
    } from '@/api/systemSet/org.js';

    export default {
        components: {
            Backtool
        },
        data() {
            var checkCode = (rule, value, callback) => {
                if (value != '') {
                    let g = /^[0-9]*[0-9][0-9]*$/;
                    if (!g.test(value)) {
                        callback(new Error('请输入正整数！'));
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
                ruleForm: {
                    id: '',
                    name: "",
                    order: 100,
                    code: '',
                    wxDepartId: '',
                    addressName: '暂无',
                    otherAddressName: '暂无'
                },
                rules: {
                    name: [
                        {required: true, message: "请输入部门名称", trigger: "blur"},
                        {min: 1, max: 20, message: "长度在 1 到 30 个字符", trigger: "blur"}
                    ],
                    code: [
                        {required: true,validator: checkCode, trigger: 'blur'}
                    ]
                }
            };
        },
        computed: {
            ...mapGetters(['schoolInfo'])
        },
        created() {
            this.ruleForm.id = this.$route.query.pid;
            getDeptInAndMaster(this.ruleForm.id).then(res => {
                let data = res.data.data;
                this.ruleForm.name = data.depart.name;
                this.ruleForm.order = data.depart.order;
                this.ruleForm.code = data.depart.code == null ? '' : data.depart.code;
                this.ruleForm.wxDepartId = data.depart.wxDepartId;

                this.ruleForm.addressName = data.manager ? data.manager.name : '暂无';

                let names = '';
                data.otherManager.forEach((item, index) => {
                    names += item.name;
                    if (index < data.otherManager.length - 1) {
                        names += '，';
                    }
                });
                names ? this.ruleForm.otherAddressName = names : '';
            }).catch();
        },
        methods: {
            updateDepart() {
                this.$refs['ruleForm'].validate(valid => {
                    if (valid) {
                        this.saveLoading = true;
                        let query = {
                            id: this.ruleForm.id,
                            name: this.ruleForm.name,
                            order: this.ruleForm.order,
                            code: this.ruleForm.code,
                            wxDepartId: this.ruleForm.wxDepartId
                        };
                        departUpdate(query).then(res => {
                            let data = res.data;
                            this.saveLoading = false;
                            if (data.code == 200) {
                                let _this = this;
                                this.$message({
                                    type: 'success',
                                    message: '修改成功!',
                                    duration: 1000,
                                    onClose: function () {
                                        _this.$router.back();
                                    }
                                });
                            } else {
                                this.$alert(data.msg, '提示', {
                                    confirmButtonText: '确定'
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

    .address_text {
        color: #999;
    }
</style>
