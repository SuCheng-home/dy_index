<template>
    <div class="all-container">
        <app-header>
            <span>{{className}}&nbsp;&nbsp;</span>
            <span slot="sub">{{curriculumName}}（ <span v-if="isMorning==1">上午</span>
                <span v-if="isMorning==2">下午</span>
                <span v-if="isMorning==3">早自习</span>
                <span v-if="isMorning==4">午自习</span>
                <span v-if="isMorning==5">晚自习</span>&nbsp;第{{sectionNo}}节）</span>
        </app-header>
        <app-footer active="attendance" :routeQueryArgs="{isMorning, classId, curriculumId, curriculumName, className, sectionNo}"></app-footer>
        <div class="class_position">
            <div class="teacher">
                讲台
            </div>
            <table class="student_table">

                <tbody>
                <tr v-for="rowItem in studentList.setSeatStuMap">
                    <td v-for="studentItem in rowItem">
                        <div @click="onStudentItemClick(studentItem)" v-if="studentItem.studentName"
                             class="student_item">
                            <div class="photo"
                                 :style="{backgroundImage: `url(${studentItem.avatar})`}"></div>
                            <span class="num">{{studentItem.studentNo.slice(-2)}}</span>
                            <span class="name">{{studentItem.studentName.slice(0, 4)}}</span>
                            <span v-if="studentItem.status != 0" class="attendance-state" :style="{backgroundImage: `url(${getStateBackgoundImage(studentItem.status)})`}"></span>
                        </div>
                        <div class="empty_item" v-else>
                            <div class="photo"></div>
                            <span class="name">空座位</span>
                        </div>
                    </td>
                </tr>

                </tbody>
            </table>
        </div>
        <div class="operation-container">
            <button type="button" class="confirm-btn" @click="allAttending">全部到勤</button>
        </div>
        <el-dialog title="考勤状态选择" :visible.sync="isShowEvaluateDialog" width="480px">
            <div class="dialog-content">
                <div style="height: 320px;overflow-y: auto;">
                    <ul class="page-modal__content">
                        <li class="modal-item modal-item--1" @click="onStateItemClick(1)">
                            <img src="https://cdnfile-10043692.file.myqcloud.com/classroom_assessment/attendance-state1.png">
                            <span class="modal-item__desc">到勤</span>
                        </li>

                        <li class="modal-item modal-item--2" @click="onStateItemClick(2)">
                            <img src="https://cdnfile-10043692.file.myqcloud.com/classroom_assessment/attendance-state4.png">
                            <span class="modal-item__desc">缺勤</span>
                        </li>

                        <li class="modal-item modal-item--3" @click="onStateItemClick(3)">
                            <img src="https://cdnfile-10043692.file.myqcloud.com/classroom_assessment/attendance-state3.png">
                            <span class="modal-item__desc">请假</span>
                        </li>
                        <li class="modal-item modal-item--4" @click="onStateItemClick(4)">
                            <img src="https://cdnfile-10043692.file.myqcloud.com/classroom_assessment/attendance-state2.png">
                            <span class="modal-item__desc">迟到</span>
                        </li>
                    </ul>
                </div>
            </div>

        </el-dialog>
    </div>

</template>

<script>
    import AppHeader from './components/AppHeader';
    import AppFooter from './components/AppFooter';

    import {
        getSchoolBehaviorStuCallListBySeat,
        batchAddAndUpdateSchoolBehaviorStuCallList,
    } from "@/api/classroomEvaluationApp";

    export default {
        name: "attendance",
        components: {
            AppHeader,
            AppFooter
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
                isShowEvaluateDialog: false,

                studentItem: null,
                modalItem: null,

            }
        },
        created() {
            this.getSchoolBehaviorStuCallListBySeatFunc();


        },
        mounted() {
            setTimeout(() => {


            }, 3000)
        },
        methods: {
            getStateBackgoundImage(status) {
                return [
                    '',
                    'https://cdnfile-10043692.file.myqcloud.com/classroom_assessment/attendance-state1.png',
                    'https://cdnfile-10043692.file.myqcloud.com/classroom_assessment/attendance-state4.png',
                    'https://cdnfile-10043692.file.myqcloud.com/classroom_assessment/attendance-state3.png',
                    'https://cdnfile-10043692.file.myqcloud.com/classroom_assessment/attendance-state2.png'][status];
            },
            getSchoolBehaviorStuCallListBySeatFunc() {
                getSchoolBehaviorStuCallListBySeat({
                    classId: this.classId,
                    curriculumId: this.curriculumId,
                    isMorning: this.isMorning,
                    sectionNo: this.sectionNo,

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
            onStateItemClick(status) {
                batchAddAndUpdateSchoolBehaviorStuCallList([{
                    curriculumId: this.curriculumId,
                    curriculumName: this.curriculumName,
                    isMorning: this.isMorning,
                    sectionNo: this.sectionNo,
                    status,
                    statusName: ['', '到勤', '缺勤', '请假', '迟到'][status],
                    studentId: this.studentItem.studentId
                }])
                    .then(res => res.data)
                    .then(data => {
                        if(data.result) {
                            this.isShowEvaluateDialog = false;
                            this.getSchoolBehaviorStuCallListBySeatFunc();
                        }
                    })
            },
            allAttending() {
                const args = [];
                Object.keys(this.studentList.setSeatStuMap).forEach(key => {
                    this.studentList.setSeatStuMap[key].forEach(({studentId}) => {
                        args.push({
                            curriculumId: this.curriculumId,
                            curriculumName: this.curriculumName,
                            isMorning: this.isMorning,
                            sectionNo: this.sectionNo,
                            status: 1,
                            statusName: '到勤',
                            studentId
                        })
                    });
                })

                batchAddAndUpdateSchoolBehaviorStuCallList(args)
                    .then(res => res.data)
                    .then(data => {
                        if(data.result) {
                            this.getSchoolBehaviorStuCallListBySeatFunc();
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

    .student_table {
        margin: 10px auto 0 auto;

        td {
            width: 150px;
        }

        .student_item {
            cursor: pointer;

            .score {
                position: absolute;
                width: 40px;
                background-color: #CCEBFA;
                color: #0099e8;
                left: 20px;
                bottom: 23px;
                font-size: 12px;
                border-radius: 11px;
                z-index: 700;
                padding: 1px 0;
            }
        }

        .student_item, .empty_item {
            margin: 0 auto;
            width: 80px;
            height: 80px;
            text-align: center;
            position: relative;
        }

        .photo {
            @include cover-bg;
        }

        .student_item div.photo, .empty_item .photo {
            margin-bottom: 5px;
        }

        .student_item div.photo, .empty_item .photo {
            margin: 0 auto;
            width: 50px;
            height: 50px;
            border-radius: 50%;
        }

        .empty_item .photo {
            background: url(https://cdnfile-10043692.file.myqcloud.com/admin/images/classroomEvaluation/empty-seat.png) no-repeat center center / cover;
        }

        .num {
            font-size: 13px;
            line-height: 15px;
        }

        .student_item .name, .empty_item .name {
            font-size: 13px;
            line-height: 15px;
        }

        .student_item div.photo, .empty_item .photo {
            margin-bottom: 5px;
        }
    }

    .page-modal__content li {
        width: 40%;
        margin: 0 2% 30px 2%;
        text-align: center;
        display: inline-block;
        cursor: pointer;
    }
    .page-modal__content img {
        box-shadow: #666 0 0 10px;
        width: 60%;
        border-radius: 50%;
    }
    .page-modal__content .modal-item__desc {
        font-size: 12px;
        display: block;
        text-align: center;
        white-space: nowrap;
    }
    .modal-item--1 img {
        background-color: #24B7EB;
    }
    .modal-item--2 img {
        background-color: #B18BBE;
    }
    .modal-item--3 img {
        background-color: #FFBF1C;
    }
    .modal-item--4 img {
        background-color: #EA5655;
    }
    .attendance-state {
        position: absolute;
        width: 20px;
        height: 20px;
        background: no-repeat center center / cover;
        right: 10px;
        top: 0;
        border-radius: 50%;
        z-index: 700;
    }
    .operation-container {
        text-align: center;
        height: 40px;
        box-sizing: border-box;
        padding: 2px;
        line-height: 35px;
        position: relative;
        .confirm-btn {
            border: 0;
            width: 80px;
            color: #fff;
            background-color: #0099E7;
            padding: 5px 0;
            border-radius: 5px;
            font-size: 14px;
        }
    }
</style>
