<template>
    <div class="dic_add_wrap">
        <div class="header_btn_box">
            <el-button size="medium" @click.native="goBack">返回</el-button>
            <el-button type="primary" size="medium" @click.native="toDicAdd">保存</el-button>
        </div>
        <div class="dic_add_box">
            <el-form :model="dictionaryInfo" :rules="dictionaryRules" ref="dictionaryForm" label-width="140px">
                <el-row :gutter="50">
                    <el-col :span="12" :offset="4">
                        <el-form-item label="字典编码" prop="code">
                            <el-input v-model.trim="dictionaryInfo.code" maxlength="100" placeholder="唯一，添加后不可修改" @input="enMakeOut" :disabled="!!dicInfoId"></el-input>
                        </el-form-item>
                        <el-form-item label="字典值" prop="value">
                            <el-input v-model.trim="dictionaryInfo.value" maxlength="100" placeholder="字典值"></el-input>
                        </el-form-item>
                        <el-form-item label="排序号" prop="sort">
                            <el-input-number v-model="dictionaryInfo.sort" controls-position="right" :min="0" :max="1000" :step="1" :step-strictly="true"></el-input-number>
                        </el-form-item>
                        <el-form-item label="字典描述" prop="remark">
                            <el-input type="textarea" v-model.trim="dictionaryInfo.remark" maxlength="1000"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </div>
    </div>
</template>

<script>
    import {saveDicValue, getDicValueInfoById} from '@/api/systemSet/schoolDictionary';

    export default {
        name: "schoolDictionaryAdd",
        data() {
            return {
                dicInfoId: 0,
                dictionaryInfo: {
                    code: '',
                    value: '',
                    remark: '',
                    sort: '',
                },
                dictionaryRules: {
                    code: [
                        {required: true, message: '请输入字典编码', trigger: 'blur'},
                        {min: 1, max: 100, message: '请输入 100 个以内有效字符', trigger: 'blur'}
                    ],
                    value: [
                        {required: true, message: '请输入字典值', trigger: 'blur'},
                        {min: 1, max: 100, message: '请输入 100 个以内有效字符', trigger: 'blur'}
                    ],
                    sort: [
                        { required: true, message: '请填写排序号' }
                    ]
                }
            }
        },
        created() {
            if (!!this.$route.query.dicId) {
                this.dicInfoId = this.$route.query.dicId;
                this.getDicValueInfoById();
            }
        },
        methods: {
            goBack() {
                this.$router.back();
            },
            enMakeOut() {
                this.dictionaryInfo.code = this.dictionaryInfo.code.replace(/[^\w\.\/]/ig,'');
            },
            getDicValueInfoById() {
                getDicValueInfoById(this.$route.query.dicId).then(res => {
                    const data = res.data.data;
                    if (res.data.code === 200) {
                        this.dictionaryInfo = {
                            code: data.code,
                            value: data.value,
                            remark: data.remark,
                            sort: data.sort
                        };
                    }
                }).catch();
            },
            toDicAdd() {
                this.$refs['dictionaryForm'].validate((valid) => {
                    if (valid) {
                        let query = {
                            code: this.dictionaryInfo.code,
                            value: this.dictionaryInfo.value,
                            remark: this.dictionaryInfo.remark,
                            sort: this.dictionaryInfo.sort,
                            dictionaryCode: this.$route.query.dictionaryCode
                        };
                        let typeText = '新增';

                        if (!!this.dicInfoId) {
                            query.id = this.dicInfoId;
                            typeText = '修改';
                        }
                        this.saveDicValue(query, typeText);
                    } else {
                        return false;
                    }
                })
            },
            saveDicValue(query, text) {
                saveDicValue(query).then(res => {
                    const data = res.data;
                    if (data.code === 200) {
                        this.$message({
                            type: 'success',
                            message: '字典' + text + '成功!'
                        });
                        this.$router.back();
                    } else {
                        this.$message({
                            type: 'warning',
                            message: data.msg
                        });
                    }
                }).catch();
            },
        }
    }
</script>

<style lang="scss" scoped>
    .dic_add_wrap{
        .header_btn_box{
            padding-bottom: 10px;
            border-bottom: 1px solid #eee;
        }
        .dic_add_box{
          padding-top:20px;
        }
    }
</style>
