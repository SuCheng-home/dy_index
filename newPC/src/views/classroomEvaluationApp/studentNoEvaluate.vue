<template>
    <div>
        <app-header>
            <span>{{className}}&nbsp;&nbsp;</span>
            <span slot="sub">{{curriculumName}}（ <span v-if="isMorning==1">上午</span>
                <span v-if="isMorning==2">下午</span>
                <span v-if="isMorning==3">早自习</span>
                <span v-if="isMorning==4">午自习</span>
                <span v-if="isMorning==5">晚自习</span>&nbsp;第{{sectionNo}}节）</span>
        </app-header>
        <app-footer active="studentNoEvaluate" :routeQueryArgs="{isMorning, classId, curriculumId, curriculumName, className, sectionNo}"></app-footer>
        <div class="student-list">

            <div @click="onStudentItemClick(studentItem)" v-for="studentItem in studentList"
                 class="student_item">
                <div class="photo"
                     :style="{backgroundImage: `url(${studentItem.avatar})`}"></div>
                <span class="num">{{studentItem.studentNo.slice(-2)}}</span>
                <span class="name">{{studentItem.studentName.slice(0, 4)}}</span>
                <span class="score">{{Math.floor((studentItem.totalScore-0)+(studentItem.initSchTimeScore-0))}}</span>
            </div>

        </div>
        <el-dialog title="点评" :visible.sync="isShowEvaluateDialog" width="480px">
            <div class="dialog-content">
                <div v-if="buffList && buffList.length !== 0">
                    <h2 class="page-modal__content-type">真棒</h2>
                    <ul class="page-modal__content buff">
                        <li class="modal-item" @click="onModalItemClick(item)" v-for="item in buffList">
                            <img
                                src="https://cdnfile-10043692.file.myqcloud.com/admin/images/classroomEvaluation/buff-item.png">
                            <span class="modal-item__desc">{{item.title}}</span>
                        </li>
                        <li class="modal-item" @click="onModalItemMiscClick(0)" v-if="setting.eleTypeMark == 2">
                            <img
                                src="https://cdnfile-10043692.file.myqcloud.com/admin/images/classroomEvaluation/buff-item.png">
                            <span class="modal-item__desc">其他</span>
                        </li>
                    </ul>
                </div>
                <div v-if="debuffList && debuffList.length !== 0">
                    <h2 class="page-modal__content-type">加油</h2>
                    <ul class="page-modal__content debuff">

                        <li class="modal-item" @click="onModalItemClick(item)" v-for="item in debuffList">
                            <img
                                src="https://cdnfile-10043692.file.myqcloud.com/admin/images/classroomEvaluation/penalty-item.png">
                            <span class="modal-item__desc">{{item.title}}</span>
                        </li>
                        <li class="modal-item" @click="onModalItemMiscClick(1)" v-if="setting.eleTypeMark == 2">
                            <img
                                src="https://cdnfile-10043692.file.myqcloud.com/admin/images/classroomEvaluation/penalty-item.png">
                            <span class="modal-item__desc">其他</span>
                        </li>
                    </ul>
                </div>
            </div>

        </el-dialog>
        <el-dialog title="其他备注" :visible.sync="isShowMiscDialog" width="480px">
            <el-form ref="form" :model="formData" :rules="rules" label-width="80px">
                <el-form-item label="名称" prop="typeMark">
                    <el-input type="textarea" :rows="5" v-model.trim="formData.typeMark" @blur="formData.typeMark = formData.typeMark.trim()"
                              placeholder="请输入其它备注"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button size="medium" @click="isShowMiscDialog = false">取 消</el-button>
                <el-button size="medium" type="primary" @click="onEvaluateMiscConfirm">确 定</el-button>
              </span>
        </el-dialog>
        <score-display ref="scoreDisplay"></score-display>
    </div>
</template>

<script>
    import AppHeader from './components/AppHeader';
    import AppFooter from './components/AppFooter';
    import ScoreDisplay from './components/ScoreDisplay';

    import {
        getSchoolBehaviorStuListOrderStuNo,
        getSchoolBehaviorTypeListBySchoolId,
        getSchoolBehaviorTypeCurrListBySchoolId,
        addSchoolBehaviorStu,
        getSchoolBehaviorInstallNew
    } from "@/api/classroomEvaluationApp";

    export default {
        name: "studentNoEvaluate",
        components: {
            AppHeader,
            AppFooter,
            ScoreDisplay
        },
        data() {
            return {
                isMorning: this.$route.query.isMorning,
                sectionNo: this.$route.query.sectionNo,
                classId: this.$route.query.classId,
                curriculumId: this.$route.query.curriculumId,
                gradeId: this.$route.query.gradeId,
                curriculumName: this.$route.query.curriculumName,
                className: this.$route.query.className,

                studentList: [],
                buffList: [],
                debuffList: [],
                isShowEvaluateDialog: false,

                studentItem: null,
                modalItem: null,

                setting: null,

                isShowMiscDialog: false,
                myisyes:true,
                formData: {
                    typeMark: ''
                },
                rules: {
                    typeMark: [
                        {required: true, message: "请输入其它备注", trigger: "blur"},
                    ],
                }
            }
        },
        created() {
            getSchoolBehaviorInstallNew()
                .then(res => res.data)
                .then(data => {
                    this.setting = data.data;
                    if (this.setting.isCurr == 1) {
                        //全校相同
                        getSchoolBehaviorTypeListBySchoolId({
                            type: 0
                        }) //加分
                            .then(res => res.data)
                            .then(data => {
                                this.buffList = data.data;
                            });
                        getSchoolBehaviorTypeListBySchoolId({
                            type: 1
                        }) //减分
                            .then(res => res.data)
                            .then(data => {
                                this.debuffList = data.data;
                            });
                    } else {
                        getSchoolBehaviorTypeCurrListBySchoolId({
                            type: 0,
                            curriculumId: this.curriculumId
                        }) //加分
                            .then(res => res.data)
                            .then(data => {
                                this.buffList = data.data;
                            });
                        getSchoolBehaviorTypeCurrListBySchoolId({
                            type: 1,
                            curriculumId: this.curriculumId
                        }) //减分
                            .then(res => res.data)
                            .then(data => {
                                this.debuffList = data.data;
                            });
                    }
                });
            this.getSchoolBehaviorStuListOrderStuNoFunc();


        },
        mounted() {
            setTimeout(() => {


            }, 3000)
        },
        methods: {
            getSchoolBehaviorStuListOrderStuNoFunc() {
                getSchoolBehaviorStuListOrderStuNo({
                    classId: this.classId
                })
                    .then(res => res.data)
                    .then(data => {
                        this.studentList = data.data;
                    });
            },
            onStudentItemClick(studentItem) {
                this.studentItem = studentItem;
                this.isShowEvaluateDialog = true;
            },
            onModalItemClick(modalItem = null) {
                if (modalItem) {
                    this.modalItem = modalItem;
                }
                if (this.modalItem&&this.myisyes) {
                    this.myisyes=false;
                    addSchoolBehaviorStu({
                        behTypeId: this.modalItem.id,
                        behTypeName: this.modalItem.title,
                        behaviorWay: 0,
                        curriculumId: this.curriculumId,
                        curriculumName: this.curriculumName,
                        isMorning: this.isMorning,
                        sectionNo: this.sectionNo,
                        stepScore: `${this.modalItem.type == 1 ? '-' : ''}${this.modalItem.stepScore}`,
                        studentId: this.studentItem.studentId,
                        type: this.modalItem.type,
                        typeMark: this.formData.typeMark
                    })
                        .then(res => res.data)
                        .then(data => {
                            this.formData.typeMark = '';
                            this.isShowEvaluateDialog = false;
                            
                            setTimeout(() => {
                              this.myisyes=true;
                            }, 1000);
                            if (data.result) {
                                this.$refs.scoreDisplay.displayScore({
                                    studentName: this.studentItem.studentName,
                                    scoreName: this.modalItem.title,
                                    scoreNum: this.modalItem.stepScore,
                                    type: this.modalItem.type
                                });
                                this.getSchoolBehaviorStuListOrderStuNoFunc();
                            } else if(data.code == 1005) {
                                this.$refs.scoreDisplay.displayScore({
                                    studentName: this.studentItem.studentName,
                                    scoreName: data.msg,
                                    scoreNum: '',
                                    type: this.modalItem.type
                                });
                            }

                        })
                } else {
                }

            },
            onModalItemMiscClick(type) {
                this.modalItem = {
                    type,
                    id: type == 1 ? -3 : -2,
                    title: '其它',
                    stepScore: 1
                };
                this.isShowMiscDialog = true;
            },
            onEvaluateMiscConfirm() {
                this.$refs.form.validate(isValid => {
                    if(isValid) {
                        this.isShowMiscDialog = false;
                        this.isShowEvaluateDialog = false;
                        this.onModalItemClick();
                    }
                })
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import "../../../src/styles/mixin.scss";

    .teacher {
        width: 110px;
        height: 43px;
        margin: 0 auto;
        padding: 5px;
        text-align: center;
        line-height: 33px;
        background: url(https://cdnfile-10043692.file.myqcloud.com/admin/images/classroomEvaluation/platform.png) left top / 100% 100% no-repeat;
        font-size: 14px;
        color: #fff;
    }

    .class_position {
        height: 550px;
        overflow-y: auto;
    }

    .class_position {
        margin-top: 5px;
        clear: both;
    }

    .student-list .student_item {
        float: left;
        cursor: pointer;
        width: 100px;
        height: 80px;
        margin: 10px 14px;
        position: relative;
        font-size: 14px;
    }
    .student-list .student_item div.photo {
        margin: 0 auto;
        width: 50px;
        height: 50px;
        border-radius: 50%;
    }
    .student-list .student_item .name {
        position: absolute;
        top: 58px;
        right: 0;
        width: 55px;
        text-align: left;
        font-size: 13px;
        line-height: 15px;
    }
    .student_item .name, .empty_item .name {
        position: relative;
        z-index: 800;
    }
    .student_item .photo {
        @include cover-bg;
    }
    .student-list .student_item .num {
        position: absolute;
        top: 58px;
        left: 0;
        width: 35px;
        text-align: right;
        font-size: 13px;
        line-height: 15px;
    }
    .student-list .student_item .score {
        position: absolute;
        width: 40px;
        background-color: #CCEBFA;
        color: #0099e8;
        left: 30px;
        bottom: 22px;
        font-size: 12px;
        border-radius: 11px;
        z-index: 700;
        text-align: center;
        padding: 1px 0;
    }

    .dialog-content {
        height: 320px;
        overflow-y: auto;

        .page-modal__content-type {
            border-left: 3px solid #0099e8;
            height: 20px;
            font-size: 14px;
            line-height: 20px;
            margin: 0 20px;
            padding: 0 10px;
        }

        .page-modal__content {
            padding: 10px;
            overflow-y: auto;

            img {
                width: 80%;
                border-radius: 50%;
            }

            .modal-item__desc {
                font-size: 12px;
                display: block;
                text-align: center;
                white-space: nowrap;
            }
        }

        li {
            width: 15%;
            margin: 0 2% 10px 2%;
            text-align: center;
            display: inline-block;
            cursor: pointer;
        }
    }
</style>
