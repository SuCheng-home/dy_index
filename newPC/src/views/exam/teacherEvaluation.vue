<template>
    <div class="app-container teacherEvaluation">
        <backtool>
            <el-button class="filter-item" size="medium" type="primary" @click="submitForm('ruleForm')">保存</el-button>
            <el-button class="filter-item" size="medium" type="primary" @click="insertTeacherComment()">录入评语库</el-button>
            <el-button class="filter-item" size="medium" type="primary" @click="dialogFormVisiblefun()">评语模板</el-button>
        </backtool>
        <div class="body"  :style="`height: ${nobottommaxH}px;`">
                 <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="140px" class="demo-ruleForm">
                    <el-form-item label="评语" prop="comment">
                        <el-input type="textarea" v-model.trim="ruleForm.comment" :maxlength="200"></el-input>
                    </el-form-item>
                </el-form>
        </div>
       
        <el-dialog title="评语模板" :visible.sync="dialogFormVisible">
            <template>
                <el-radio-group v-model="radio">
                    <el-radio :key="index" v-for="(item, index) in list" :label="item.content">{{item.content}}</el-radio>
                </el-radio-group>
            </template>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="determine">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
    import Backtool from '@/components/BackTool';
    import {
        stuScoreAnanlysisBySchoolTimeIdData,
        saveStuComment,
        insertTeacherComment,
        chooseComment
    } from '@/api/systemSet/exam';
    import mixin from '@/mixins/windowResize';
    export default {
        components: {
            Backtool
        },
        data() {
            return {
                radio: '',
                dialogFormVisible: false,
                list: [],
                ruleForm: {
                    comment: ''
                },
                rules: {
                    comment: [
                        {required: true, message: '请填写评语', trigger: 'blur'}
                    ]
                }
            }

        },
         mixins: [mixin],
        created() {
            let stuId = this.$route.query.stuId;
            let schoolTimeId = this.$route.query.schoolTimeId;
            stuScoreAnanlysisBySchoolTimeIdData(schoolTimeId, stuId).then(res => {
                let data = res.data.data;
                this.ruleForm.comment = data.teacherComment.comment;
            }).catch();
        },

        methods: {
            dialogFormVisiblefun(){
                this.dialogFormVisible=true;
                 chooseComment().then(res => {
                                let data = res.data.data;
                                this.list = data;
                                this.radio = data[0].content;
                            }).catch();
            },
            submitForm(formName) {
                let comment = this.ruleForm.comment;
                if (comment) {                    
                    let stuId = this.$route.query.stuId;
                    let schoolTimeId = this.$route.query.schoolTimeId;
                    let comment = this.ruleForm.comment;
                    this.$refs[formName].validate((valid) => {
                        if (valid) {
                            saveStuComment(schoolTimeId, stuId, comment).then(res => {
                                if (res.data.code === 200) {
                                    this.$message({
                                        type: 'success',
                                        message: '评价成功!'
                                    });
                                    this.$router.back();
                                }
                            }).catch();
                        } else {

                            return false;
                        }
                    });
                } else {
                    this.$message('请填写评语后保存！');
                }

            },
            insertTeacherComment() {
                let comment = this.ruleForm.comment;
                if (comment) {
                    insertTeacherComment(comment).then(res => {
                        if (res.data.code === 200) {
                            this.$message({
                                type: 'success',
                                message: '录入成功!'
                            });

                           
                        }

                    }).catch();
                } else {
                    this.$message('请填写评语后录入！');
                }

            },
            determine() {
                this.dialogFormVisible = false;
                this.ruleForm.comment = this.radio;
                this.$message({
                    type: 'success',
                    message: '操作成功!'
                });

            }
        }
    }
</script>
<style scoped>
    .teacherEvaluation .el-radio {
        white-space: normal;
        width: 100%;
    }
    .teacherEvaluation .el-textarea__inner {
        height: 150px;
    }
    .teacherEvaluation .el-radio + .el-radio {
        margin-left: 0;
        margin-top: 15px;
        width: 100%;
    }
    .teacherEvaluation .el-radio-group{
        width: 100%
    }

    .teacherEvaluation .el-radio-group .el-radio__label {
        font-size: 14px;
        padding-left: 5px;
        display: inline-block;
        width: 80%;
        line-height: 24px;
    }

    .teacherEvaluation .el-radio__input {
        float: left;
        margin-top: 3px;
    }
    .teacherEvaluation .body{
       width: 810px;
       margin: 0 auto;
       padding-top: 20px;
    }
</style>
