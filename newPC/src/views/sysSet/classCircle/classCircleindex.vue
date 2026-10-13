<template>
    <div class="classCircleindex">
        <div class="ketangSetup-header">
            <el-button @click="$router.back()" type="default" size="medium">返回</el-button>
            <el-button type="primary" size="medium" @click="Preservation()">保存</el-button>
        </div>
        <div class="classCircleindex-main" :style="{height: `${containerHeight}px`}">
            <el-form ref="query" label-width="180px" class="demo-ruleForm mydemo-ruleForm">
                <el-form-item label="评论权限">
                    <el-checkbox v-model="numone">学生家长</el-checkbox>
                </el-form-item>
                <el-form-item label="发帖权限">
                    <el-checkbox v-model="numtwo" disabled>班主任</el-checkbox>
                    <el-checkbox v-model="numthree">任课老师</el-checkbox>
                    <el-checkbox v-model="numfive">学生家长</el-checkbox>
                </el-form-item>
                <el-form-item label="加精权限">
                    <el-checkbox v-model="numSeven" disabled>班主任</el-checkbox>
                    <el-checkbox v-model="numSix">任课老师</el-checkbox>
                </el-form-item>
                <el-form-item label="家长发帖需要班主任审核">
                    <el-switch
                        v-model="needApprove" :active-value="1" :inactive-value="0">
                    </el-switch>
                </el-form-item>
                <el-form-item label="帖子类型">
                    <div class="circleplus">
                        <div class="circle plus" @click="deleteType(item.id)" :key="index" v-for="(item,index) in list">
                            <i class="fa fa-trash-o" aria-hidden="true"></i>{{item.optionName}}
                        </div>
                        <div class="circle  post-add" title="点击添加帖子类型" @click="addTypes()">
                            <i class="fa fa-plus" aria-hidden="true"></i>
                        </div>

                    </div>
                </el-form-item>
                <el-form-item label="班级圈是否关联学生（仅限教师发帖）">
                    <el-switch
                        v-model="isRelatedStus" :active-value="1" :inactive-value="0">
                    </el-switch>
                </el-form-item>
            </el-form>
            <el-dialog title="新增类型" :visible.sync="dialogVisible" width="60%">
                <el-form :model="numberValidateForm" ref="numberValidateForm" label-width="100px" class="demo-ruleForm">
                    <el-form-item label="类型名称" prop="name" :rules="[{ required: true, message: '类型名称不能为空'}]">
                        <el-input type="name" v-model.trim="numberValidateForm.name" :maxlength="10"
                                  placeholder="请输入类型名称"></el-input>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="dialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="submitForm('numberValidateForm')">确 定</el-button>
                </span>
            </el-dialog>

        </div>
    </div>
</template>

<script>
    import {
        deleteClassCircleOption,
        addClassCircleOption,
        addClassCircleRole,
        getClassCircleOptionList,
        getClassCircleSetInfo,
        getClassCircleCommentSetInfo,
        getClassCircleDigestSetInfo
    } from "@/api/classCircle";

    export default {
        name: "classCircleindex",
        data() {
            return {
                containerHeight: "",
                dialogVisible: false,
                numone: false,
                numtwo: true,
                numthree: false,
                numfive: false,
                numSeven: true,
                numSix: false,
                numberValidateForm: {
                    name: ""
                },
                list: [],
                needApprove: 0,
                isRelatedStus: 0
            };
        },
        created() {
        },
        mounted() {
            this.containerHeight = window.innerHeight - 200;
            this.getClassCircleOptionLists();
            this.getClassCircleDigestSetInfos();
            getClassCircleSetInfo()
                .then(res => {
                    console.log('res', res)
                    this.needApprove = res.data.data.postSetInfo.needApprove;
                    this.isRelatedStus = res.data.data.postSetInfo.isRelatedStus;
                    if (res.data.data.roleList.length > 0) {
                        for (let i = 0; i < res.data.data.roleList.length; i++) {
                            if (res.data.data.roleList[i].roleId == '11') {
                                this.numtwo = true
                            }
                            ;
                            if (res.data.data.roleList[i].roleId == '52') {
                                this.numthree = true
                            }
                            ;
                            if (res.data.data.roleList[i].roleId == '5') {
                                this.numfive = true
                            }
                            ;
                        }
                    }
                })
                .catch(function () {
                });
            getClassCircleCommentSetInfo()
                .then(res => {
                    if (res.data.data.ptComment == 1) {
                        this.numone = true;
                    }
                })
                .catch(function () {
                });
        },
        methods: {
            //获取加精权限
            getClassCircleDigestSetInfos() {
                getClassCircleDigestSetInfo()
                    .then(res => {
                        if (res.data.data.norThDigest == 1) {
                            this.numSix = true
                        }
                        ;
                    })
                    .catch(function () {
                    });
            },
            //保存
            Preservation() {
                let objone = {};
                let objtwo = [];
                let objthree = {}
                if (this.numone) {
                    objone = {thComment: 1, ptComment: 1};
                } else {
                    objone = {thComment: 1, ptComment: 0};
                }
                ;
                if (this.numSix) {
                    objthree = {heaThDigest: 1, norThDigest: 1};
                } else {
                    objthree = {heaThDigest: 1, norThDigest: 0};
                }
                ;
                if (this.numtwo) {
                    objtwo.push({roleId: "11"});
                }
                ;
                if (this.numthree) {
                    objtwo.push({roleId: "52"});
                }
                ;
                if (this.numfive) {
                    objtwo.push({roleId: "5"});
                }
                ;
                addClassCircleRole(JSON.stringify(objone), JSON.stringify(objthree), JSON.stringify(objtwo), this.needApprove, this.isRelatedStus)
                    .then(res => {
                        if (res.data.code === 200) {
                            this.$message({
                                type: "success",
                                message: "保存成功！"
                            });
                        }
                    })
                    .catch(function () {
                    });
            },
            //获取类型列表
            getClassCircleOptionLists() {
                getClassCircleOptionList()
                    .then(res => {
                        this.list = res.data.data;
                    })
                    .catch(function () {
                    });
            },
            //删除
            deleteType(id) {
                this.$confirm("是否确认要删除该类型吗？", "删除", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                })
                    .then(() => {
                        deleteClassCircleOption(id)
                            .then(res => {
                                if (res.data.code === 200) {
                                    this.$message({
                                        type: "success",
                                        message: "删除成功！"
                                    });
                                    this.getClassCircleOptionLists();
                                }
                            })
                            .catch(function () {
                            });
                    })
                    .catch(() => {
                    });
            },
            //新增
            addTypes() {
                this.dialogVisible = true;
            },
            submitForm(formName) {
                this.$refs[formName].validate(valid => {
                    if (valid) {
                        //新增
                        addClassCircleOption(this.numberValidateForm.name)
                            .then(res => {
                                if (res.data.code === 200) {
                                    this.$message({
                                        type: "success",
                                        message: "新增成功！"
                                    });
                                    this.numberValidateForm.name = "";
                                    this.dialogVisible = false;
                                    this.getClassCircleOptionLists();
                                }
                            })
                            .catch(function () {
                            });
                    }
                });
            }
        }
    };
</script>

<style lang="scss" scoped>
    .classCircleindex {
        padding:12px;
    }

    .mydemo-ruleForm {
        width: 810px;
        margin: 0 auto;
    }

    .classCircleindex-main {
        border-top: 1px #eee solid;
        padding-top: 20px;
        margin-top: 10px;
        overflow: auto;

        .circle {
            width: 180px;
            height: 60px;
            border: 1px solid #31b231;
            border-radius: 15px;
            line-height: 60px;
            float: left;
            margin: 0 10px 10px 0;
            text-align: center;
            color: #fff;
            background-color: rgb(49, 178, 49);
            cursor: pointer;

            i {
                display: none;
            }
        }

        .circle:hover {
            background-color: #74b974;
            cursor: pointer;

            i {
                display: inline-block;
            }
        }

        .post-add {
            background: #fff;
            color: #ccc;
            border: 2px #ddd solid;

            i {
                display: inline-block;
            }
        }

        .post-add:hover {
            background: #fff;
            color: #ccc;
            border: 2px #ddd solid;
        }
    }
</style>
