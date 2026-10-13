<template>
    <div>
        <div v-show="isStartBeh == 2">
            <div class="app-container calendar-list-container">
                <backtool>
                    <el-input class="search-input search-input--right"
                              size="medium"
                              placeholder="请输入学生姓名" icon="el-icon-search" @keyup.enter.native="handleInputChange"
                              v-model.trim="searchTitle">
                        <el-button slot="append" icon="el-icon-search" @click="handleInputChange"></el-button>
                    </el-input>
                </backtool>
                <div class="filter-container">
                    评优活动：{{activityName}}
                    <el-tabs v-model="activeName" @tab-click="tabClickHanlder">
                        <el-tab-pane v-for="(awardItem, awardIndex) in awardList" :label="`${awardItem.applyAwardName}(${awardItem.voteCount}/${awardItem.studentList.length})`" :name="`${awardIndex}`"></el-tab-pane>
                    </el-tabs>
                </div>
                <div>
                    <el-table v-if="awardList[activeName]" stripe :data="awardList[activeName].studentList.filter(item => item.studentName.includes(searchTitle))" border fit highlight-current-row
                              style="width: 100%">
                        <el-table-column align="center" label="学生姓名" show-overflow-tooltip>
                            <template slot-scope="scope">
                    <span >
                        {{scope.row.studentName}}
                    </span>
                            </template>
                        </el-table-column>
                        <el-table-column align="center" label="荣誉分数">
                            <template slot-scope="scope">
                                <span v-if="scoringFormula==1">{{scope.row.honTotalMaxScore ? scope.row.honTotalMaxScore.toFixed(2) : '0.00'}}</span>
                                <span v-if="scoringFormula==2">{{scope.row.honTotalMaxScoreFormulaTw ? (scope.row.honTotalMaxScoreFormulaTw-0).toFixed(2) : '0.00'}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column align="center" label="申报时间">
                            <template slot-scope="scope">
                                <span>{{scope.row.updateTime | trimTime}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column align="center" label="评语">
                            <template slot-scope="scope">
                                <span v-if="scope.row.stuBehActivityTh">{{scope.row.stuBehActivityTh.behContent}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column show-overflow-tooltip align="center" label="是否投票">
                            <template slot-scope="scope">
                                <i v-if="scope.row.stuBehActivityTh && scope.row.stuBehActivityTh.isVote == 2" class="el-icon-success" style="font-size: 16px;color: #409EFF"></i>
                            </template>
                        </el-table-column>

                    </el-table>
                </div>
            </div>

        </div>
        <div v-show="isStartBeh == 1">
            <div class="app-container calendar-list-container">
                <backtool>
                </backtool>
                <default-page Mes="暂未开启评比"></default-page>
            </div>
        </div>
    </div>
</template>

<script>
    import baseMixin from '@/mixins/baseMixin';
    import mixin from '@/mixins/windowResize';
    import {
        getStuBehListByTh,
        getStuBehActivity
    } from '@/api/studentAwarding';
    import DefaultPage from '@/components/DefaultPage';

    export default {
        name: 'studentAwardingTeacherShowList',

        mixins: [baseMixin, mixin],
        components: {DefaultPage},
        filters: {
            trimTime(datetime){
                return datetime ? datetime.slice(0, datetime.lastIndexOf('.')) : '--';
            }
        },
        created() {
            this.init();
        },
        data() {
            return {
                isStartBeh: this.$route.query.isStartBeh,

                classId: this.$route.query.classId,
                id: this.$route.query.id,
                activityName: this.$route.query.activityName,
                className: this.$route.query.className,
                curriculumId: this.$route.query.curriculumId,
                awardList: [],
                currInfo: {},
                isShowCommentDialog: false,
                activeName: 0,
                searchTitle: '',
                scoringFormula:1
            }
        },
        methods: {
            tabClickHanlder() {

            },
            init() {
                getStuBehActivity({
                    activityId: this.id
                })
                    .then(res => res.data)
                    .then(data => {
                       this.scoringFormula =data.data.scoringFormula
                        this.currInfo = JSON.parse(data.data.thCurrJson).find(({curriculumId}) => curriculumId == this.curriculumId);
                        const awardList = JSON.parse(data.data.behProjectJson);
                        const funcList = [];
                        awardList.forEach(awardItem => {
                            funcList.push( getStuBehListByTh({
                                activityId: this.id,
                                applyAwardCode: awardItem.applyAwardCode,
                                classId: this.classId,
                                curriculumId: this.curriculumId,
                                voteCount: 0
                            })
                                .then(res => res.data)
                                .then(data => data.data))
                        });

                        Promise.all(funcList)
                            .then(arr => {
                                arr.forEach((item, index) => {
                                    awardList[index].studentList = item;
                                    awardList[index].handleCount = item.filter(item => item.stuBehActivityTh && item.stuBehActivityTh.behContent).length;
                                    awardList[index].voteCount = item.filter(item => item.stuBehActivityTh && item.stuBehActivityTh.isVote == 2).length;
                                });
                                this.awardList = awardList;
                            })
                    })
            },
        }
    }
</script>

<style scoped>
    .filter-container {
        padding-top: 10px;
        font-size: 20px;
        padding-bottom: 14px;
    }
    .section-title {
        padding: 16px 10px;
        background: #ECF8FF;
        margin-bottom: 5px;
    }

    .section-title__score {
        float: right;
    }

</style>
