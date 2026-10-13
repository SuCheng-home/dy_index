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
        <div class="evaluate-big-box">
            <div class="evaluate-subject">

                <div class="bonuspoints">
                    <div class="name">真棒</div>
                    <div class="boxs">
                        <div v-for="scoreItem in buffList" class="box" @click="onModalItemClick(scoreItem)">
                            {{scoreItem.title}}
                        </div>
                        <div class="box" v-if="setting.eleTypeMark == 2" @click="onModalItemMiscClick(0)">
                            其他
                        </div>
                    </div>
                </div>
                <div class="Subtraction">
                    <div class="name">加油</div>
                    <div class="boxs">
                        <div class="box" v-for="scoreItem in debuffList" @click="onModalItemClick(scoreItem)">
                            {{scoreItem.title}}
                        </div>
                        <div class="box" v-if="setting.eleTypeMark == 2" @click="onModalItemMiscClick(1)">
                            其他
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <el-dialog title="学生" :visible.sync="isShowStudentDialog" width="1050px">
            <div class="page-modal-box">
                <label :class="['label', checkedStudent.includes(studentItem.studentId) ? 'label-color' : '']"
                       v-for="studentItem in studentList">
                    <img :src="studentItem.avatar" alt="">
                    <input type="checkbox" :value="studentItem.studentId" v-model="checkedStudent" class="box-checkbox"><i
                    class=" fa fa-check fa-lg"></i>
                    <span class="num">{{studentItem.studentNo.slice(-2)}}</span>
                    <div class="box-name">{{studentItem.studentName}}</div>
                </label>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button size="medium" @click="isShowStudentDialog = false">取 消</el-button>
                <el-button size="medium" type="primary" @click="onStudentConfirm">确 定</el-button>
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
        <app-footer active="scoreItemEvaluate"
                    :routeQueryArgs="{isMorning, classId, curriculumId, curriculumName, className, sectionNo}"></app-footer>
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
        batchAddSchoolBehaviorStuList,
        getSchoolBehaviorInstallNew
    } from "@/api/classroomEvaluationApp";

    export default {
        name: "scoreItemEvaluate",
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

                checkedStudent: [],
                studentList: [],
                buffList: [],
                debuffList: [],
                isShowStudentDialog: false,

                studentItem: null,
                modalItem: null,

                setting: null,

                isShowMiscDialog: false,
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
            onModalItemClick(modalItem) {
                this.modalItem = modalItem;
                this.isShowStudentDialog = true;

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
                        this.isShowStudentDialog = true;
                    }
                })

            },
            onStudentConfirm() {
                if(this.checkedStudent.length === 0) {
                    this.$message.error('请选择评价学生');
                } else {
                    const args = [];
                    this.checkedStudent.forEach(studentId => {
                        const studentObj = this.studentList.find(item => item.studentId == studentId);
                        args.push({
                            behTypeId: this.modalItem.id,
                            behTypeName: this.modalItem.title,
                            behaviorWay: 0,
                            curriculumId: this.curriculumId,
                            curriculumName: this.curriculumName,
                            isMorning: this.isMorning,
                            sectionNo: this.sectionNo,
                            stepScore: `${this.modalItem.type == 1 ? '-' : ''}${this.modalItem.stepScore}`,
                            type: this.modalItem.type,
                            typeMark: this.formData.typeMark,
                            studentId
                        });

                    });
                    this.formData.typeMark = '';
                    this.checkedStudent = [];
                    batchAddSchoolBehaviorStuList(args)
                        .then(res => res.data)
                        .then(data => {
                            if(data.result) {
                               
                                this.isShowStudentDialog = false;

                                if (data.result) {
                                    this.$refs.scoreDisplay.displayScore({
                                        studentName: this.modalItem.title,
                                        scoreName: this.modalItem.type == 0 ? '加分' : '减分',
                                        scoreNum: this.modalItem.stepScore,
                                        type: this.modalItem.type
                                    });
                                    this.getSchoolBehaviorStuListOrderStuNoFunc();
                                }
                            }
                        })
                }

            }
        }
    }
</script>

<style lang="scss" scoped>
    .evaluate-big-box {
        height: 550px;
        box-sizing: border-box;
        overflow-y: auto;
    }

    .evaluate-subject {
        max-width: 1280px;
        margin: 0 auto;
        box-sizing: border-box;
        padding: 10px 20px;
    }

    .name {
        border-left: 5px solid #0099e8;
        font-size: 24px;
        color: #666;
        font-weight: 600;
        line-height: 40px;
        margin-top: 10px;
        padding-left: 20px;
    }

    .boxs {
        overflow: hidden;
        padding: 20px;
    }

    .box {
        background-color: rgb(49, 178, 49);
        cursor: pointer;
        width: 22%;
        height: 60px;
        border: 1px solid #31B231;
        border-radius: 15px;
        line-height: 60px;
        float: left;
        margin: 5px 1%;
        text-align: center;
        color: #fff;
    }

    .Subtraction .box {
        background-color: rgb(228, 165, 49);
        border: 1px solid #E4A531;
    }

    .page-modal-box {
        height: 350px;
        overflow: auto;
        border-bottom: 1px #eee solid;
        padding-bottom: 5px;

        .label-color {
            border: 1px #04BE02 solid;

        }

        label.label-color i {
            color: #04BE02;
            border: 1px #04BE02 solid;
        }

        label {
            height: 100px;
            position: relative;
            float: left;
            width: 6.5%;
            margin: 5px 0.3%;
            padding: 0;
            border: 1px #eee solid;
            box-sizing: border-box;
            cursor: pointer;

            img {
                display: block;
                border-radius: 50%;
                margin: 0px auto;
                margin-top: 15px;
                width: 50px;
                height: 50px;
            }

            .box-checkbox {
                position: absolute;
                right: 0;
                top: 0;
                opacity: 0;
            }

            i {
                position: absolute;
                right: 3px;
                top: 3px;
                border: 1px #ccc solid;
                font-size: 15px;
                height: 16px;
                width: 16px;
                margin: 0;
                padding: 0;
                border-radius: 50%;
                line-height: 16px;
                text-align: center;
                color: #fff;
            }

            .num {
                float: left;
                line-height: 16px;
                font-size: 13px;
                padding-left: 3px;
            }

            .box-name {
                font-size: 13px;
                line-height: 15px;
                text-align: center;
                color: #666;
                font-weight: 600;
            }
        }
    }
</style>
