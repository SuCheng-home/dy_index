<template>
    <div class="all-container">
        <app-header>请选择您的班级</app-header>
        <div class="main-container">
            <h2 class="content-title">我的班级</h2>
            <ul>

                <li @click="onClassItemClick(classItem)" class="class-item" v-for="classItem in classList">
                    <div class="class-item__inner">
                        <h3 :title="classItem.className">{{classItem.className}}</h3>
                        <div class="class-info-container">
                            <div class="class-photo" style="background-image: url(https://cdnfile-10043692.file.myqcloud.com/admin/images/classroomEvaluation/class-bg.png)"></div>
                            <div class="class-info">
                                <div class="subject-info" :title="classItem.curriculumName">{{classItem.curriculumName}}
                                </div>
                                <div class="student-count"><span class="hint-text">学生：</span><span>{{classItem.stuCount}}人</span>
                                </div>
                                <div class="behavior-info"><span class="hint-text">本周表现</span><span class="behavior-info-detail"><i class="icon fa fa-smile-o"></i><span>{{classItem.addScore}}</span><i class="icon fa fa-frown-o"></i><span>{{classItem.lessScore}}</span></span>
                                </div>
                            </div>
                        </div>
                    </div>
                </li>
            </ul>

            <h2 class="content-title">课后服务</h2>
            <ul>
                <li @click="afterClassClick(classItem)" class="class-item" v-for="classItem in afterClassList">
                    <div class="class-item__inner">
                        <h3 :title="classItem.afterClassName">{{classItem.afterClassName}}</h3>
                        <div class="class-info-container">
                            <div class="class-photo" style="background-image: url(https://cdnfile-10043692.file.myqcloud.com/admin/images/classroomEvaluation/class-bg.png)"></div>
                            <div class="class-info">
                                <div class="subject-info">学生：{{classItem.stuCount}}人
                                </div>
                                <div class="student-count"><span class="hint-text" style="margin-left: 10px;">{{dateStr}}</span>
                                </div>
<!--                                <div class="behavior-info"><span class="hint-text">本周表现</span><span class="behavior-info-detail"><i class="icon fa fa-smile-o"></i><span>{{classItem.addScore}}</span><i class="icon fa fa-frown-o"></i><span>{{classItem.lessScore}}</span></span>-->
<!--                                </div>-->
                            </div>
                        </div>
                    </div>
                </li>
            </ul>
        </div>
        <a class="logout-link" @click="logout">
            <img src="https://cdnfile-10043692.file.myqcloud.com/admin/images/class/exit.png">
            登录退出
        </a>
        <el-dialog title="选择节次" :visible.sync="isShowSectionDialog" width="480px">
            <div class="dialog-content">
                <div v-if="sectionData.earlySectionNoList && sectionData.earlySectionNoList.length !== 0">
                    <h2 class="page-modal__content-type">早自习</h2>
                    <ul class="page-modal__content">
                        <li @click="onSectionItemClick(sectionItem)" class="modal-item" v-for="sectionItem in sectionData.earlySectionNoList">
                            <span class="modal-item__desc">第{{sectionItem.sectionNo}}节</span>
                        </li>
                    </ul>
                </div>
                <div v-if="sectionData.morningSectionNoList && sectionData.morningSectionNoList.length !== 0">
                    <h2 class="page-modal__content-type">上午</h2>
                    <ul class="page-modal__content">
                        <li @click="onSectionItemClick(sectionItem)" class="modal-item" v-for="sectionItem in sectionData.morningSectionNoList">
                            <span class="modal-item__desc">第{{sectionItem.sectionNo}}节</span>
                        </li>
                    </ul>
                </div>
                 <div v-if="sectionData.noonSectionNoList && sectionData.noonSectionNoList.length !== 0">
                    <h2 class="page-modal__content-type">午自习</h2>
                    <ul class="page-modal__content">
                        <li @click="onSectionItemClick(sectionItem)" class="modal-item" v-for="sectionItem in sectionData.noonSectionNoList">
                            <span class="modal-item__desc">第{{sectionItem.sectionNo}}节</span>
                        </li>
                    </ul>
                </div>
                <div v-if="sectionData.afternoonSectionNoList && sectionData.afternoonSectionNoList.length !== 0">
                    <h2 class="page-modal__content-type">下午</h2>
                    <ul class="page-modal__content">
                        <li @click="onSectionItemClick(sectionItem)" class="modal-item" v-for="sectionItem in sectionData.afternoonSectionNoList">
                            <span class="modal-item__desc">第{{sectionItem.sectionNo}}节</span>
                        </li>
                    </ul>
                </div>
                 <div v-if="sectionData.nightSectionNoList && sectionData.nightSectionNoList.length !== 0">
                    <h2 class="page-modal__content-type">晚自习</h2>
                    <ul class="page-modal__content">
                        <li @click="onSectionItemClick(sectionItem)" class="modal-item" v-for="sectionItem in sectionData.nightSectionNoList">
                            <span class="modal-item__desc">第{{sectionItem.sectionNo}}节</span>
                        </li>
                    </ul>
                </div>
            </div>

        </el-dialog>
    </div>
</template>

<script>
    import moment from 'moment';
    import AppHeader from './components/AppHeader';
    import {mapGetters } from 'vuex';

    import {
        getsectionNoList,
        classListTw,
        isSetupClassRatingModule,
        getAfterBehaviorClassList
    } from "@/api/classroomEvaluationApp";

    export default {
        name: "classEvaluateAppClassList",
        components: {AppHeader},
        data() {
            return {
                classList: [],
                afterClassList: [],
                sectionData: {},
                isShowSectionDialog: false,
                classItem: null,
                isclass: 0,
                dateStr: this.$moment().format('YYYY-MM-DD')
            }
        },
        computed: {
            ...mapGetters(['userInfo'])
        },
        mounted() {
            classListTw({
                startDate: moment().startOf('week').format('YYYY-MM-DD'),
                endDate: moment().endOf('week').format('YYYY-MM-DD')

            })
                .then(res => res.data)
                .then(data => {
                    this.classList = data.data;
                });
            getsectionNoList()
                .then(res => res.data)
                .then(data => {
                    this.sectionData = data.data;
                });

            isSetupClassRatingModule()
                .then(res => res.data)
                .then(data => {
                    this.isclass = data.data;
                });

            getAfterBehaviorClassList()
                .then(res => res.data)
                .then(data => {
                    this.afterClassList = data.data;
                });
        },
        methods: {
            onClassItemClick(classItem) {
                this.classItem = classItem;
                this.isShowSectionDialog = true;
            },
            afterClassClick(classItem) {
                this.$router.push({
                    path: '/classroomEvaluationApp/afterStudentNoEvaluate',
                    query: classItem
                })
            },
            onSectionItemClick(sectionItem) {
                this.jumpToPage('studentEvaluate', {
                    isMorning: sectionItem.isMoring,
                    sectionNo: sectionItem.sectionNo,
                    className: this.classItem.className,
                    classId: this.classItem.classId,
                    curriculumId: this.classItem.curriculumId,
                    gradeId: this.classItem.gradeId,
                    curriculumName: this.classItem.curriculumName
                });
            },
            jumpToPage(path, query = {}) {
                this.$router.push({
                    path,
                    query
                })
            },
            logout() {
                this.$store.dispatch("LogOut").then(() => {
                    this.$router.push('login')
                });
            },
        }
    }
</script>

<style lang="scss" scoped>
    @import "../../../src/styles/mixin.scss";

    @include reset;
    .main-container {
        padding: 18px 20px;
        background-color: #E5F6FC;
    }
    .all-container {
        width: 100vw;
        height: 100vh;
        background-color: #E5F6FC;
    }
    .content-title {
        border-left: 3px solid #0099e8;
        padding-left: 10px;
        font-size: 14px;
        line-height: 1em;
        color: #333;
        margin-bottom: 25px;
    }
    ul {
        margin: 0 -1%;
    }
    .class-item {
        border: 1px solid #E2E2E2;
        display: inline-block;
        width: 22%;
        margin: 0 1% 10px 1%;
        border-radius: 10px;
        box-shadow: 0 1px 1px 0 rgba(0,0,0,.1);
        background-color: #fff;

        .class-item__inner {
            padding: 0;
            display: block;
            border-radius: 10px;
        }
        h3 {
            font-size: 14px;
            padding: 10px;
            border-bottom: 1px solid #E2E2E2;
            box-sizing: content-box;
        }
        .class-info-container {
            padding: 10px;
        }
        .class-photo {
            width: 70px;
            height: 70px;
            display: inline-block;
            vertical-align: middle;
            border-radius: 50%;
            background: no-repeat center center / cover;
        }
        .class-info {
            width: 65%;
            padding-left: 10px;
            display: inline-block;
            vertical-align: middle;
            font-size: 14px;
            * {
                white-space: nowrap;
                text-overflow: ellipsis;
                overflow: hidden;
            }
            & > * {
                margin: 5px 0;
            }
            .subject-info {
                font-size: 16px;
                margin: 0 0 14px 10px;
            }
            .student-count {
                color: #888;
                font-size: 12px;
            }
            .behavior-info, .student-count {
                color: #888;
                font-size: 12px;
            }
            .hint-text {
                margin-right: 10px;
            }
            .icon {
                font-size: 14px;
                display: inline-block;
                margin-right: 5px;
            }
            .fa-smile-o {
                color: #71D3FC;
            }
            .fa-frown-o {
                color: #FFA6A6;
                margin-left: 10px;
            }
        }
        .behavior-info-detail > * {
            display: inline-block;
            vertical-align: middle;
            line-height: 1em;
        }
    }
    .logout-link {
        position: fixed;
        right: 66px;
        bottom: 45px;
        color: #00AAEE;
        border-radius: 5px;
        font-size: 14px;
        z-index: 3000;
        img {
            width: 24px;
            height: 24px;
            vertical-align: middle;
        }
    }
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
    }
    .page-modal__content li {
        width: 20%;
        margin: 12px 2% 12px 2%;
        text-align: center;
        display: inline-block;
        cursor: pointer;
        .modal-item__desc {
            font-size: 14px;
            display: block;
            text-align: center;
            white-space: nowrap;
            padding: 10px;
            border: 1px solid #0099e8;
            border-radius: 20px;
            color: #0099e8;
        }
    }
    .dialog-content {
        height: 320px;
        overflow-y: auto;
        overflow-x: hidden;
    }
</style>
