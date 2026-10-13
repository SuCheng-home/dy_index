<template>
    <div class="add_subtract_wrap">
        <div class="header">
            <el-button @click="goBack()">返回</el-button>
        </div>
        <div class="item_set_wrap">
            <div class="header_title">加分项</div>
            <div class="score_list clearfix">
                <div class="score_item" :key="index" v-for="(item, index) in addCheckItemList">
                    <div class="score_item_name">{{item.title}}({{item.stepScore}}分)</div>
                    <div class="score_mask">
                        <i class="el-icon-delete" @click.stop="toDelCheckItem(item.id, 0)"></i>
                    </div>
                </div>
                <div class="score_item item_add_btn" @click="toAddCheckItem(0)">+</div>
            </div>
        </div>
        <div class="item_set_wrap subtract_score_wrap">
            <div class="header_title">减分项</div>
            <div class="score_list clearfix">
                <div class="score_item" :key="index" v-for="(item, index) in cutCheckItemList">
                    <div class="score_item_name">{{item.title}}({{item.stepScore}}分)</div>
                    <div class="score_mask">
                        <i class="el-icon-delete" @click.stop="toDelCheckItem(item.id, 1)"></i>
                    </div>
                </div>
                <div class="score_item item_add_btn" @click="toAddCheckItem(1)">+</div>
            </div>
        </div>
        <el-dialog :title="scoreTypeName" :visible.sync="dialogVisible" size="tiny" :close-on-press-escape='false'
                   :close-on-click-modal='false' :modal-append-to-body='false' top="10%">
            <div class="examForm">
                <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="80px">
                    <el-form-item label="名称" prop="name">
                        <el-input v-model.trim="ruleForm.name" :maxlength="10" placeholder="请输入名称"></el-input>
                    </el-form-item>
                    <el-form-item label="默认分" prop="stepScore">
                        <el-input-number v-model="ruleForm.stepScore" controls-position="right" :min="1" :max="100"></el-input-number>
                    </el-form-item>
                    <el-form-item label=" ">
                        <div class="exam_text">注：评价时可修改默认分</div>
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
    import {getDimensionTypeList, addYoungTeacherDimensionType, delYoungTeacherType} from '@/api/youngTeacherDevelopment';

    export default {
        name: "addAndSubtractSet",
        data() {
            return {
                addCheckLoading: false,
                addCheckItemList: [],
                cutCheckItemList: [],
                type: 0,
                scoreTypeName: '加分项',
                dialogVisible: false,
                ruleForm: {
                    name: '',
                    stepScore: 1
                },
                rules: {
                    name: [
                        {required: true, message: '请输入名称！', trigger: 'blur'},
                        {min: 1, max: 10, message: '长度在 1 到 10 个字符！', trigger: 'blur'}
                    ],
                    stepScore: [
                        {required: true, message: '请输入分数！', trigger: 'blur'},
                    ]
                }
            }
        },
        watch: {
            type(val) {
                this.scoreTypeName = !val ? '加分项' : '减分项'
            }
        },
        created() {
            this.getDimensionTypeList(0);
            this.getDimensionTypeList(1);
        },
        methods: {
            goBack() {
                this.$router.back();
            },
            getDimensionTypeList(num) {
                getDimensionTypeList({
                    dimensionId: this.$route.query.id,
                    type: num
                }).then(res => {
                    let data = res.data.data;
                    if (res.data.code === 200) {
                        if (num === 0) {
                            this.addCheckItemList = data;
                        } else if (num === 1) {
                            this.cutCheckItemList = data;
                        }
                    }
                }).catch(() => {});
            },
            toAddCheckItem(num) {
                this.type = num;
                this.ruleForm.name = '';
                this.ruleForm.stepScore = 1;
                this.dialogVisible = true;
            },
            toDelCheckItem(id, type) {
                const typeText = !type ? '加分项' : '减分项';
                this.$confirm('是否确认要删除该'+ typeText +'？', '删除' + typeText, {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.delYoungTeacherType(id, type, typeText);
                })
            },
            delYoungTeacherType(id, type, typeText) {
                delYoungTeacherType(id).then(res => {
                    if (res.data.code === 200) {
                        this.$message({
                            message: typeText + '删除成功！',
                            type: 'success'
                        });
                        this.getDimensionTypeList(type);
                    } else {
                        this.$message.error(res.data.msg);
                    }
                }).catch(() => {
                });
            },
            addCheck() {
                this.$refs['ruleForm'].validate(valid => {
                    if (valid) {
                        let query = {
                            dimensionId: this.$route.query.id,
                            title: this.ruleForm.name,
                            stepScore: this.ruleForm.stepScore,
                            type: this.type
                        };
                        this.addYoungTeacherDimensionType(query);
                    }
                });
            },
            addYoungTeacherDimensionType(query) {
                this.addCheckLoading = true;
                addYoungTeacherDimensionType(query).then(res => {
                    if (res.data.code === 200) {
                        this.$message({
                            message: this.scoreTypeName + '添加成功！',
                            type: 'success'
                        });
                        this.getDimensionTypeList(query.type);
                        this.ruleForm.name = '';
                        this.ruleForm.stepScore = 1;
                        this.ruleForm.type = 0;
                        this.dialogVisible = false;
                    } else {
                        this.$message.error(res.data.msg);
                    }
                    this.addCheckLoading = false;
                }).catch(() => {
                    this.addCheckLoading = false;
                });
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
    .add_subtract_wrap{
        .header{
            padding:12px;
            border-bottom: 1px solid #eee;
        }

        .item_set_wrap{
            padding: 20px;
            .header_title{
                height: 20px;
                line-height: 20px;
                padding-left: 10px;
                font-weight: 700;
                border-left: 4px solid #67C23A;
            }
            .score_list{
                padding: 10px 0;
                .score_item{
                    position: relative;
                    float: left;
                    width: 160px;
                    height: 50px;
                    line-height: 50px;
                    text-align: center;
                    margin: 10px;
                    color: #fff;
                    background: #67C23A;
                    border-radius: 5px;
                    overflow: hidden;
                    transition: .2s ease-in-out;
                    .score_item_name{
                        width: 100%;
                        height: 100%;
                        overflow: hidden;
                        white-space: nowrap;
                        text-overflow: ellipsis;
                    }
                    .score_mask{
                        position: absolute;
                        top: 100%;
                        left: 0;
                        width: 100%;
                        height: 100%;
                        /*background: rgba(0,0,0,.5);*/
                        i{
                            color: #F56C6C;
                            cursor: pointer;
                        }
                        /*.el-icon-delete{*/
                        /*    margin-left: 15px;*/
                        /*    color: #F56C6C;*/
                        /*}*/
                    }
                    &:hover{
                        color: #e1f3d8;
                        background: #e1f3d8;
                        .score_mask{
                            top: 0;
                        }
                    }
                }
                .item_add_btn{
                    border: 1px solid #eee;
                    /*box-sizing: border-box;*/
                    color: #ccc;
                    background: #fff;
                    cursor: pointer;
                    &:hover{
                        color: #ccc;
                        background: #fff;
                    }
                }
            }
        }

        .subtract_score_wrap{
            .header_title{
                border-left: 4px solid #E6A23C;
            }
            .score_list{
                .score_item{
                    background: #E6A23C;
                    &:hover{
                        color: #fdf6ec;
                        background: #fdf6ec;
                    }
                }
                .item_add_btn{
                    color: #ccc;
                    background: #fff;
                    &:hover{
                        color: #ccc;
                        background: #fff;
                    }
                }
            }
        }

        .examForm{
            padding: 0 15px;
            .exam_text{
                color: #F56C6C;
            }
        }
    }
</style>
