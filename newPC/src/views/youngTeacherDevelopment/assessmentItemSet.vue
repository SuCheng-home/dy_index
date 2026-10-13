<template>
    <div class="check_item_wrap">
        <div class="header">
            <el-button @click="goBack()">返回</el-button>
        </div>
        <div class="check_item_box clearfix">
            <div class="check_item" :key="index" v-for="(item, index) in checkItemList" @click="toCheckInfo(item.id)" :style="`background: url('${item.logoUrl}') no-repeat center center / cover;`">
                <div class="check_name">{{item.dimensionName}}</div>
                <i class="el-icon-edit" @click.stop="toEditCheckItem(item)"></i>
                <i class="el-icon-delete" @click.stop="toDelCheckItem(item.id)"></i>
            </div>
            <div class="check_add_btn" @click="toAddCheckItem">+</div>
        </div>
        <el-dialog title="考核维度设置" :visible.sync="dialogVisible" size="tiny" :close-on-press-escape='false'
                   :close-on-click-modal='false' :modal-append-to-body='false' top="10%">
            <div class="examForm">
                <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="80px">
                    <el-form-item label="名称" prop="name">
                        <el-input v-model.trim="ruleForm.name" :maxlength="20" placeholder="请输入名称"></el-input>
                    </el-form-item>
                    <el-form-item label="初始分" prop="initScore">
                        <el-input-number v-model="ruleForm.initScore" controls-position="right" :min="1" :max="100"></el-input-number>
                    </el-form-item>
                    <el-form-item label=" ">
                        <el-checkbox v-model="isCheckedOther">增加“其他”考核项</el-checkbox>
                    </el-form-item>
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addCheck" :loading="addCheckLoading">确认</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import {getSchoolYoungTeacherDimensionList, addYoungTeacherDimension, editYoungTeacherDimension, delYoungTeacherDimension} from '@/api/youngTeacherDevelopment';

    export default {
        name: "assessmentItemSet",
        data() {
            return {
                dimensionId: '',
                addCheckLoading: false,
                checkItemList: [1,2,3],
                dialogVisible: false,
                ruleForm: {
                    name: '',
                    initScore: 1,
                    logoUrl: 'https://cdnfile-10043692.file.myqcloud.com/cover/teacher_evaluation.png',
                    type: 1
                },
                isCheckedOther: false,
                rules: {
                    name: [
                        {required: true, message: '请输入名称！', trigger: 'blur'},
                        {min: 1, max: 20, message: '长度在 1 到 20 个字符！', trigger: 'blur'}
                    ],
                    initScore: [
                        {required: true, message: '请输入初始分！', trigger: 'blur'},
                    ]
                }
            }
        },
        created() {
            this.getSchoolYoungTeacherDimensionList();
        },
        methods: {
            goBack() {
                this.$router.back();
            },
            getSchoolYoungTeacherDimensionList() {
                getSchoolYoungTeacherDimensionList().then(res => {
                    let data = res.data.data;
                    if (res.data.code === 200) {
                        this.checkItemList = data;
                    }
                }).catch(() => {});
            },
            toAddCheckItem() {
                this.dimensionId = '';
                this.ruleForm.name = '';
                this.ruleForm.initScore = 1;
                this.dialogVisible = true;
            },
            toEditCheckItem(item) {
                this.dimensionId = item.id;
                this.ruleForm.name = item.dimensionName;
                this.ruleForm.initScore = item.initScore;
                this.isCheckedOther = !!item.isOtherType;
                this.dialogVisible = true;
            },
            addCheck() {
                this.$refs['ruleForm'].validate(valid => {
                    if (valid) {
                        let query = {
                            dimensionName: this.ruleForm.name,
                            initScore: this.ruleForm.initScore,
                            isOtherType: this.isCheckedOther ? 1 : 0,
                            logoUrl: this.ruleForm.logoUrl,
                            type: this.ruleForm.type
                        };
                        if (!this.dimensionId) {
                            this.addYoungTeacherDimension(query);
                        } else {
                            query.id = this.dimensionId;
                            this.editYoungTeacherDimension(query);
                        }
                    }
                });
            },
            addYoungTeacherDimension(query) {
                this.addCheckLoading = true;
                addYoungTeacherDimension(query).then(res => {
                    if (res.data.code === 200) {
                        this.$message({
                            message: '考核项添加成功！',
                            type: 'success'
                        });
                        this.initDialogBox();
                    } else {
                        this.$message.error(res.data.msg);
                    }
                    this.addCheckLoading = false;
                }).catch(() => {
                    this.addCheckLoading = false;
                });
            },
            editYoungTeacherDimension(query) {
                this.addCheckLoading = true;
                editYoungTeacherDimension(query).then(res => {
                    if (res.data.code === 200) {
                        this.$message({
                            message: '考核项修改成功！',
                            type: 'success'
                        });
                        this.initDialogBox();
                    } else {
                        this.$message.error(res.data.msg);
                    }
                    this.addCheckLoading = false;
                }).catch(() => {
                    this.addCheckLoading = false;
                });
            },
            initDialogBox() {
                this.ruleForm.name = '';
                this.ruleForm.initScore = 1;
                this.ruleForm.type = 1;
                this.dialogVisible = false;
                this.getSchoolYoungTeacherDimensionList();
            },
            toDelCheckItem(id) {
                this.$confirm('是否确认要删除该考核项？', '删除考核项', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.delYoungTeacherDimension(id);
                })
            },
            delYoungTeacherDimension(id) {
                delYoungTeacherDimension(id).then(res => {
                    if (res.data.code === 200) {
                        this.$message({
                            message: '考核项删除成功！',
                            type: 'success'
                        });
                        this.getSchoolYoungTeacherDimensionList();
                    } else {
                        this.$message.error(res.data.msg);
                    }
                }).catch(() => {
                });
            },
            toCheckInfo(id) {
                this.$router.push({path: 'addAndSubtractSet', query: {id: id}});
            }
        }
    }
</script>

<style scoped>
    .clearfix:after {
        content: "";
        display: block;
        font-size: 0;
        height: 0;
        clear: both;
        visibility: hidden;
    }

    .clearfix {
        zoom: 1;
    }
</style>
<style lang="scss" scoped>
    .check_item_wrap{
        .header{
            padding:12px;
            border-bottom: 1px solid #eee;
        }
        .check_item_box{
            padding: 20px;
            .check_item{
                float: left;
                width: 200px;
                height: 150px;
                margin-right: 20px;
                margin-bottom: 20px;
                box-shadow: 0 0 10px #ddd;
                position: relative;
                cursor: pointer;
                .check_name{
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    width: 100%;
                    height: 24px;
                    line-height: 24px;
                    text-align: center;
                    font-size: 14px;
                    color: #fff;
                    background-color: rgba(0, 0, 0, 0.2);
                }
                i{
                    position: absolute;
                    top: 10px;
                    right: 35px;
                    font-weight: 700;
                    color: #409EFF;
                    cursor: pointer;
                    display: none;
                }
                .el-icon-delete{
                    right: 10px;
                    color: #F56C6C;
                }
                &:hover{
                    i{
                        display: block;
                    }
                }
            }
            .check_add_btn{
                float: left;
                width: 200px;
                height: 150px;
                line-height: 150px;
                text-align: center;
                font-size: 30px;
                box-sizing: border-box;
                border: 1px solid #ccc;
                color: #999;
                cursor: pointer;
            }
        }
        .examForm{
            padding: 0 15px;
        }
    }
</style>
