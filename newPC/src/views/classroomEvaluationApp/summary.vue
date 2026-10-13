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
        <app-footer active="summary"
                    :routeQueryArgs="{isMorning, classId, curriculumId, curriculumName, className, sectionNo}"></app-footer>
        <div class="class_position">
            <h3 class="hint-title">今日{{curriculumName}}得分汇总</h3>
            <h2 class="content-title">得分统计</h2>

            <div class="student_table" v-if="buffList && buffList.length !== 0">

                <div class="student_table__item" v-for="studentItem in buffList">
                    <div class="student_item student_item--sum">
                        <div class="photo" :style="{backgroundImage: `url(${studentItem.avatar})`}"></div>
                        <span class="name">{{studentItem.studentName}}</span>
                        <span class="score--plus">+{{studentItem.totalScore}}</span>
                    </div>
                </div>
            </div>

            <div v-else class="no-data-hint">暂无任何学生加分</div>


            <h2 class="content-title">扣分统计</h2>
            <div class="student_table" v-if="debuffList && debuffList.length !== 0">

                <div class="student_table__item" v-for="studentItem in debuffList">
                    <div class="student_item student_item--sum">
                        <div class="photo" :style="{backgroundImage: `url(${studentItem.avatar})`}"></div>
                        <span class="name">{{studentItem.studentName}}</span>
                        <span class="score--minus">{{studentItem.totalScore}}</span>
                    </div>
                </div>
            </div>
            <div v-else class="no-data-hint">暂无任何学生扣分</div>

        </div>
    </div>
</template>

<script>
    import AppHeader from './components/AppHeader';
    import AppFooter from './components/AppFooter';
    import {getSchoolBehaviorStuListByDate} from '@/api/classroomEvaluationApp';

    export default {
        name: "summary",
        components: {
            AppHeader,
            AppFooter,
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

                buffList: [],
                debuffList: []
            }
        },
        created() {
            getSchoolBehaviorStuListByDate({
                curriculumId: this.curriculumId,
                classId: this.classId
            })
                .then(res => res.data)
                .then(data => {
                    this.buffList = data.data.schoolBehaviorStuAddList;
                    this.debuffList = data.data.schoolBehaviorStuLessList;

                })
        }
    }
</script>

<style scoped>
    body, h1, h2, h3, h4, h5, h6, ul, ol, p {
        font-family: "Microsoft YaHei";
        margin: 0;
        padding: 0;
        font-weight: normal;
    }
    .hint-title {
        text-align: center;
        padding: 5px 0;
    }
    .content-title {
        border-left: 3px solid #0099e8;
        padding-left: 10px;
        font-size: 14px;
        line-height: 1em;
        color: #333;
        margin-bottom: 25px;
        margin-left: 20px;
        font-weight: bold;
    }
    .student_table {
        margin: 10px auto 0 auto;
    }
    .student_table__item {
        display: inline-block;
        width: 10%;
    }
    .student_item.student_item--sum {
        margin: 0 auto;
        width: 100px;
        height: 80px;
        text-align: center;
        position: relative;
        cursor: auto;
    }
    .student_item div.photo, .empty_item .photo {
        margin: 0 auto;
        width: 50px;
        height: 50px;
        border-radius: 50%;
    }
    .student_item .name {
        position: relative;
        z-index: 800;
    }
    .score--plus {
        color: #fff;
        background-color: #0099e8;
        padding: 0 5px;
        font-size: 14px;
        font-weight: bold;
    }
    .no-data-hint {
        text-align: center;
        padding: 20px;
        font-size: 18px;
    }
    .photo {
        background: no-repeat center center / cover;
    }
    .score--minus {
        color: #fff;
        background-color: #FF3B3B;
        padding: 0 5px;
        font-size: 14px;
        font-weight: bold;
    }
</style>
