<template>
    <div class="campusList">
        <div class="card-list">
            <div class="header">
                <el-button class="bind-btn" type="primary" @click="bindDialog">绑卡</el-button>
                <a href="javascript:;" class="goLogin" @click="goLogin">
                    <i class="fa fa-home fa-fw"></i>
                    返回登录页
                </a>
            </div>
            <div class="main">
                <div class="main-item" :studentInfo="studentInfo">
                    <div class="head">
                        <span class="color-block"></span>
                        学生信息
                    </div>
                    <div class="cont-ul">
                        <li>
                            <div class="left-title">学号</div>
                            <div class="right-text">{{studentInfo.learnNum}}</div>
                        </li>
                        <li>
                            <div class="left-title">姓名</div>
                            <div class="right-text">{{studentInfo.name}}</div>
                        </li>
                    </div>
                </div>
                <div class="main-item">
                    <div class="head">
                        <span class="color-block"></span>
                        已绑定校园卡信息
                    </div>
                    <div class="cont-ul">
                        <div class="no-date-card" v-if="sidList.length==0">
                            暂无校园卡!
                        </div>
                        <ul>
                            <li v-for="(item,index) in sidList" :key="index">
                                <div class="left-title">校园卡{{index+1}}</div>
                                <div class="right-text">
                                    <div class="card-num">{{item}}</div>
                                    <a class="card-btn" href="javascript:;" @click="lostBind(item)">解绑</a>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
        <el-dialog
            title="绑卡（如无读卡器请认真核对卡号）"
            :visible.sync="dialogVisible" class="campuList-dialog-box" :close-on-press-escape="false"
            :close-on-click-modal="false" :modal-append-to-body="false" :show-close="false">
            <el-form :model="ruleForm" class="card-dialog-padding" :rules="rules" ref="ruleDialogForm">
                <el-form-item label="卡号" prop="cardNum">
                    <el-input class="card-input" :maxlength="30" v-model="ruleForm.cardNum"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="closeDialog">取 消</el-button>
                <el-button type="primary" @click="sureBtn">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
    import {getStudentInfoAndCardById, addCampusCard, deleteCampusCard} from '@/api/campusCard';

    export default {
        data() {
            return {
                dialogVisible: false,
                ruleForm: {
                    cardNum: ''
                },
                rules: {
                    cardNum: [
                        {required: true, message: '卡号不能为空！', trigger: 'blur'},
                    ]
                },
                studentId: null,
                schoolId: null,
                studentInfo: {},
                sidList: [],
                teacherId: null,
                teacherName: null,
                s: null
            }
        },
        created() {

        },
        mounted() {
            if (JSON.stringify(this.$route.params) !== '{}') {
                localStorage.setItem("campusParams", JSON.stringify(this.$route.params));
            }
            var campusDataInfo = JSON.parse(localStorage.getItem('campusParams'));
            this.studentId = campusDataInfo.id;
            this.schoolId = campusDataInfo.parentList[0].schoolId;
            this.teacherId = campusDataInfo.parentList[0].id;
            this.teacherName = campusDataInfo.parentList[0].name;
            this.getStudentInfoAndCardByIdFunc();
            this.s = localStorage.getItem('s');
        },
        methods: {
            closeDialog() {
                this.dialogVisible = false;
                this.ruleForm.cardNum = '';
            },
            lostBind(item) {
                this.$confirm('确定解绑卡号为' + item + '的校园卡吗?', '提示', {
                    type: 'error'
                }).then(() => {
                    deleteCampusCard({
                        schoolId: this.schoolId,
                        sid: item,
                        userId: this.teacherId,
                        userName: this.teacherName,
                    }).then(res => {
                        let data = res.data;
                        if (data.code === 200) {
                            this.$message({
                                message: data.msg,
                                type: 'success'
                            });
                            this.getStudentInfoAndCardByIdFunc();
                        } else {
                            this.$message.error(data.msg);
                        }
                    })
                }).catch(() => {
                });

            },
            goLogin() {
                this.$router.push({
                    path: '/campusCard',
                    query: {
                        s: this.s
                    }
                })
                localStorage.removeItem("campusParams");
                localStorage.removeItem("s");
            },
            bindDialog() {
                if (this.sidList.length >= 5) {
                    this.$alert('每个学生最多只能绑定5张卡！', '提示', {
                        type: 'error'
                    }, {
                        confirmButtonText: '确定'
                    });
                    return false;
                }
                this.dialogVisible = true;
                setTimeout(function () {
                    document.querySelector(".el-input__inner").focus();
                }, 100);
            },
            getStudentInfoAndCardByIdFunc() {
                getStudentInfoAndCardById({
                    studentId: this.studentId,
                    schoolId: this.schoolId
                }).then(res => {
                    let data = res.data;
                    if (data.code === 200) {
                        this.studentInfo = data.data.studentInfo;
                        this.sidList = data.data.sidList;
                    }
                })
            },
            sureBtn() {
                this.$refs.ruleDialogForm.validate((valid) => {
                    if (valid) {
                        var This = this;
                        if (this.ruleForm.cardNum.replace(/^(\s|\xA0)+|(\s|\xA0)+$/g, '') == '') {
                            this.dialogVisible = false;
                            this.ruleForm.cardNum = '';
                            this.$message.error('卡号不能为空格!');
                            return false;
                        }
                        this.sidList.map(function (val) {
                            if (This.ruleForm.cardNum == val) {
                                This.dialogVisible = false;
                                return false;
                            }
                        })
                        addCampusCard({
                           classDepartId: this.studentInfo.classId,
                            gradeId: this.studentInfo.gradeId,
                            schoolId: this.schoolId,
                            sid: this.ruleForm.cardNum,
                            userId: this.studentInfo.id,
                            userName: this.studentInfo.name,
                            loginname: this.studentInfo.loginname,
                            teacherId: this.teacherId,
                            teacherName: this.teacherName,
                            cardType:1
                        }).then(res => {
                            let data = res.data;
                            if (data.code === 200) {
                                this.ruleForm.cardNum = '';
                                this.dialogVisible = false;
                                this.$message({
                                    message: data.msg,
                                    type: 'success'
                                });
                                this.getStudentInfoAndCardByIdFunc();
                            } else {
                                this.ruleForm.cardNum = '';
                                this.dialogVisible = false;
                                this.$message.error(data.msg);
                            }
                        })
                    } else {
                        return false;
                    }
                })
            }
        }
    }
</script>
<style lang="scss" scoped>
    @import "../../../src/styles/mixin.scss";

    ul, li {
        list-style-type: none;
    }

    .campusList {
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        width: 100%;
        min-width: 800px;
        height: 100%;
        background: url("https://cdnfile-10043692.file.myqcloud.com/admin/images/timg.jpg") center center no-repeat;
    }

    .card-list {
        width: 740px;
        height: 550px;
        position: absolute;
        left: 50%;
        top: 50%;
        margin: -275px 0 0 -370px;
        border-radius: 12px;
        overflow: hidden;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
        background: #fff;

        .header {
            width: 100%;
            height: 58px;
            padding-top: 10px;
            border: 1px solid #eee;
            padding-left: 0 20px;
        }

        .bind-btn {
            margin-left: 20px;
        }

        .main {
            height: 480px;
            overflow-x: hidden;
            overflow-y: auto;
        }

        .main-item {
            width: 100%;
            padding-left: 20px;
            padding-top: 20px;
            box-sizing: border-box;

            .head {
                font-size: 20px;
                font-weight: bold;
                color: #666;
                line-height: 34px;

                .color-block {
                    display: inline-block;
                    vertical-align: middle;
                    width: 12px;
                    height: 12px;
                    background-color: #ACD6FF;
                    margin-right: 10px;
                }
            }

            .cont-ul {
                line-height: 24px;
                padding-left: 29px;

                .no-date-card {
                    font-weight: bold;
                    font-size: 14px;
                    color: #666;
                    line-height: 24px;
                }

                ul {
                    padding: 0;
                    margin: 0;
                }

                li {
                    padding-top: 10px;
                    @include clearfix;

                    .left-title {
                        float: left;
                        width: 110px;
                        font-weight: bold;
                        color: #666;
                        font-size: 14px;
                    }

                    .right-text {
                        float: left;
                        display: block;
                        font-size: 14px;
                        color: #555;
                    }
                }
            }

            .card-num {
                float: left;
            }

            .card-btn {
                float: left;
                display: block;
                margin-left: 30px;
                color: #428bca;
            }

        }
    }

    .goLogin {
        position: absolute;
        right: 23px;
        top: 21px;
        line-height: 20px;
        color: #20A0FF;
        font-size: 14px;

        i {
            font-size: 20px;
            vertical-align: middle;
            margin-top: -3px;
        }
    }

    .goLogin:hover {
        color: #4db3ff;
    }

    .card-dialog-padding {
        padding: 20px 20px 10px;
    }

    .card-input {
        width: 70%;
    }

</style>
<style scoped>
    .card-dialog-padding .el-form-item__label {
        width: 60px;
        text-align: left;
    }

    .card-dialog-padding .el-form-item__error {
        left: 59px;
    }

    .campuList-dialog-box .el-dialog--small {
        width: 540px !important;
    }
</style>
