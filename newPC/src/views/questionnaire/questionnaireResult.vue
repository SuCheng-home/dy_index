<template>
    <div class="page">
        <back-tool>
            <el-button type="primary" size="medium" @click="jumpToPage('questionnaireUserList', {voteId, sendUserType})">查看用户问卷</el-button>
            <a :href="exportByQuestionUrl" download="按题目导出" target="_blank">
                <el-button size="medium" class="filter-item" type="primary">按题目导出</el-button>
            </a>
            <a :href="exportByOptionUrl" download="按选项导出" target="_blank">
                <el-button size="medium" class="filter-item" type="primary">按选项导出</el-button>
            </a>
            <!-- 191 客服角色 -->
            <!-- 2026-02-04 隐藏客服角色的权限 -->
            <!-- <a v-if="isShowByRole(191) || anonymous == 2" :href="exportByUserUrl" download="按用户导出" target="_blank"> -->
            <a v-if="anonymous == 2" :href="exportByUserUrl" download="按用户导出" target="_blank">
                <el-button size="medium" class="filter-item" type="primary">按用户导出</el-button>
            </a>
            &nbsp;
            <el-select v-if="sendUserType === 2" v-model="classId" @change="getVoteResultByVoteIdFunc" placeholder="请选择">
                <el-option label="全部班级" :value="0">
                </el-option>
                <el-option :label="classItem.className" :value="classItem.classId" :key="index" v-for="(classItem, index) in classList"></el-option>
            </el-select>
        </back-tool>
        <div class="questionnaire-container" :style="{height: `${maxH + 40}px`}">
            <div class="questionnaire-title">{{voteTitle}}</div>
            <pre class="questionnaire-desc">{{voteDesc}}</pre>
            <div class="questionnaire-info">
                <template v-if="!isArea">
                    本次问卷调查范围
                    <template v-if="sendUserType === 1">
                        <span v-for="item in thScope.userList">{{item.name}}</span><span v-for="item in thScope.groupList">{{item.name}}</span><span v-for="item in thScope.departList">{{item.name}}</span>
                    </template>
                    <template v-else>
                        <span v-for="item in stuDepart">{{item.name}}</span><span v-for="item in stuUser">{{item.name}}</span><span v-for="item in stuGroupJson">{{item.name}}</span>
                    </template>
                    。
                </template>
                共发<span>{{voteTotalCount}}份</span>，回收<span>{{voteCount}}</span>份，有效<span>{{voteCount}}</span>份，回收率<span>{{voteRate}}%</span>。本次调查答卷人&nbsp;&nbsp;<span v-if="isShowResult === 2">不</span>允许&nbsp;&nbsp;查看，<span v-if="maxVoteCount !== 0">限选{{maxVoteCount}}人，</span><span v-if="anonymous === 2">实名</span><span v-else>匿名</span>

            </div>
            <div class="questionnaire-end-time">
                截止时间：<span>{{expriyDate | trimDate}}</span>&nbsp;&nbsp;问卷类型：<span v-if="sendUserType === 1">老师问卷</span><span v-else>学生问卷</span>
            </div>
            <div class="questionnaire-content">
                <div class="question-item" v-for="(questionItem, index) in topicList">
                    <template v-if="questionItem.topType === 14 || questionItem.topType === 21">
                        <div class="question-item__title">{{questionItem.topicSeq}}.{{questionItem.topicTitle}}<span class="question-item__type">({{questionItem.topType | getTypeName}})</span>
                        </div>
                        <div v-if="anonymous === 2" @click="optionItem.voteSelectedCount !==0 ? jumpToPage('questionnaireUserListByQuestion', {optionId: optionItem.id, voteId, isHaveReason: optionItem.isHaveReason, type: questionItem.topType , sendUserType}) : null" class="question-item__choice question-item__choice--link question-item__choice--noback" v-for="(optionItem, index) in questionItem.optionList">
                            <el-tooltip class="item" effect="dark" placement="top">
                                <span slot="content" v-html="parseFillblank(optionItem.optionTitle)"></span>
                                <span class="question-item__choice-name" v-html="parseFillblank(optionItem.optionTitle)"></span>
                            </el-tooltip>
                            <span class="question-item__vote-count">共计{{optionItem.voteSelectedCount}}人作答</span>
                        </div>
                        <div v-else class="question-item__choice question-item__choice--noback">
                            <el-tooltip class="item" effect="dark" placement="top">
                                <span slot="content" v-html="parseFillblank(optionItem.optionTitle)"></span>
                                <span class="question-item__choice-name" v-html="parseFillblank(optionItem.optionTitle)"></span>
                            </el-tooltip>
                            <span class="question-item__vote-count">共计{{optionItem.voteSelectedCount}}人作答</span>
                        </div>
                    </template>
                    <template v-else-if="questionItem.topType === 6">
                        <div class="question-item__title">{{questionItem.topicSeq}}.<span v-html="parseFillblank(questionItem.topicTitle)"></span><span class="question-item__type">({{questionItem.topType | getTypeName}})</span>
                            <span v-if="anonymous === 2 && questionItem.answerCount != 0" class="answer-link" @click="jumpToPage('questionnaireAnswerResult', {topicId: questionItem.id, voteId, sendUserType, type: questionItem.topType})">共计{{questionItem.answerCount}}人作答，查看详情</span>
                            <span v-else>共计{{questionItem.answerCount}}人作答</span>
                        </div>
                    </template>
                    <template v-else-if="answerTypeList.indexOf(questionItem.topType) !== -1">
                        <div class="question-item__title">{{questionItem.topicSeq}}.{{questionItem.topicTitle}}<span class="question-item__type">({{questionItem.topType | getTypeName}})</span>
                            <span v-if="anonymous === 2 && questionItem.answerCount != 0" class="answer-link" @click="jumpToPage('questionnaireAnswerResult', {topicId: questionItem.id, voteId, sendUserType, type: questionItem.topType})">共计{{questionItem.answerCount}}人作答，查看详情</span>
                            <span v-else>共计{{questionItem.answerCount}}人作答</span>
                        </div>
                    </template>

                    <template v-if="optionTypeList.indexOf(questionItem.topType) !== -1">
                        <div class="question-item__title">{{questionItem.topicSeq}}.{{questionItem.topicTitle}}<span class="question-item__type">({{questionItem.topType | getTypeName}})</span>
                            <div class="score-info" v-if="questionItem.topType === 24">共计{{questionItem.count}}票，得分{{questionItem.score}}分，均分{{questionItem.avg}}分</div>
                        </div>
                        <div v-if="anonymous === 2" @click="optionItem.voteSelectedCount !==0 ? jumpToPage('questionnaireUserListByQuestion', {optionId: optionItem.id, voteId, type: questionItem.topType, isHaveReason: optionItem.isHaveReason, sendUserType}) : null" :class="['question-item__choice', optionItem.voteSelectedCount !==0 ? 'question-item__choice--link' : '']" v-for="(optionItem, index) in questionItem.optionList">
                            <el-tooltip class="item" effect="dark" placement="top">
                                <span slot="content" v-html="parseFillblank(optionItem.optionTitle)"></span>
                                <span class="question-item__choice-name" v-html="parseFillblank(optionItem.optionTitle)"></span>
                            </el-tooltip>
                            <span class="question-item__progress-bar" :style="{width: `${optionItem.percent}%`}"></span>
                            <span class="question-item__vote-count">{{optionItem.voteSelectedCount}}票（{{optionItem.percent}}%）</span>
                        </div>
                        <div v-else class="question-item__choice">
                            <el-tooltip class="item" effect="dark" placement="top">
                                <span slot="content" v-html="parseFillblank(optionItem.optionTitle)"></span>
                                <span class="question-item__choice-name" v-html="parseFillblank(optionItem.optionTitle)"></span>
                            </el-tooltip>
                            <span class="question-item__progress-bar" :style="{width: `${optionItem.percent}%`}"></span>
                            <span class="question-item__vote-count">{{optionItem.voteSelectedCount}}票（{{optionItem.percent}}%）</span>
                        </div>
                    </template>
                </div>
                <div class="total-score" v-if="totalAvgScore !== 0">
                    均分总计：{{totalAvgScore}}分
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import BackTool from '@/components/BackTool';
    import {getVoteResultByVoteId, getVoteClassListByVoteId} from '@/api/questionnaire';
    import {isShowByRole} from '@/utils';
    import mixin from '@/mixins/windowResize';
    export default {
        name: 'questionnaireResult',
         mixins: [mixin],
        data() {
            return {
                isArea: this.$route.query.isArea == 1,

                voteId: this.$route.query.voteId,
                totalAvgScore: 0,
                sendUserType: parseInt(this.$route.query.sendUserType),
                classList: [],
                currentClass: null,
                anonymous: null,
                expriyDate: '',
                topicList: [],
                voteDesc: '',
                voteTitle: '',
                classId: 0,
                isShowResult: 2,
                voteCount: 0,
                voteTotalCount: 0,
                stuDepart: [],
                stuGroupJson:[],
                stuUser: [],
                thScope: {},
                optionTypeList: [1, 2, 3, 4, 24, 22, 23],
                answerTypeList: [5, 6, 9, 10, 11, 12, 15, 16, 17, 18, 19],
                maxVoteCount: 0
            }
        },
        components: {
            BackTool
        },
        computed: {
            voteRate() {
                return this.voteTotalCount !== 0 ? Math.floor(this.voteCount / this.voteTotalCount * 1000) / 10 : 0;
            },
            exportByQuestionUrl() {
                const baseHref = global.command === 'production' ? 'https://www.zhxiaoyuan.cn/module-web/' : 'https://www.weixiaojia.net/module-web/';
                return `${baseHref}structure/voteTwo/exportVoteTopicResult?voteId=${this.voteId}&schoolYear=${this.$store.getters.selectedSchoolYear}&token=${this.$store.getters.token}`;
            },
            exportByOptionUrl() {
                const baseHref = global.command === 'production' ? 'https://www.zhxiaoyuan.cn/module-web/' : 'https://www.weixiaojia.net/module-web/';
                return `${baseHref}structure/voteTwo/exportVoteOptionResult?voteId=${this.voteId}&schoolYear=${this.$store.getters.selectedSchoolYear}&token=${this.$store.getters.token}`;
            },
            exportByUserUrl() {
                const baseHref = global.command === 'production' ? 'https://www.zhxiaoyuan.cn/module-web/' : 'https://www.weixiaojia.net/module-web/';
                return `${baseHref}structure/voteTwo/exportVoteTwoUserListAll?voteId=${this.voteId}&schoolYear=${this.$store.getters.selectedSchoolYear}&token=${this.$store.getters.token}`;
            }
        },
        filters: {
            getTypeName(type) {
                return ['', '单选', '多选', '图片单选', '图片多选', '简答题', '填空', '', '', '地址', '单图上传', '多图上传', '评分', '', '多项填空', '手机号', '邮箱', '身份证', '日期', '时间', '', '多项填空', '下拉单选' ,'下拉多选' ,'评分单选'][type];
            },
            trimDate(value) {
                return value ? value.slice(0, value.lastIndexOf('.')) : '';
            }
        },
        created() {
            if(this.sendUserType === 2) {
                getVoteClassListByVoteId({
                    voteId: this.voteId
                })
                    .then(res => res.data)
                    .then(data => {
                        this.classList = data.data;
                        this.getVoteResultByVoteIdFunc();
                    })
            } else {
                this.getVoteResultByVoteIdFunc();
            }

        },
        methods: {
            isShowByRole,
            parseFillblank(title) {
                return title.replace(/{(\d+?)}/g, function(_, num) {
                    return `<input type="text" style="border: 0;border-bottom: 1px solid #000;background-color: transparent;" disabled="disabled" class="blank" maxlength="${num}" style="width: ${num * 20}px" />`
                });
            },
            getVoteResultByVoteIdFunc() {
                getVoteResultByVoteId({
                    classId: this.classId,
                    voteId: this.voteId
                })
                    .then(res =>res.data)
                    .then(data => {
                        const pageData = data.data;
                        this.anonymous = pageData.anonymous;
                        this.expriyDate = pageData.expriyDate;
                        this.isShowResult = pageData.isShowResult;
                        this.maxVoteCount = pageData.maxVoteCount;
                        let totalCount = 0, totalScore = 0, rawAvg = 0;
                        pageData.topicList.forEach(topicItem => {
                            let count = 0, score = 0, avg = 0;
                            topicItem.optionList.forEach(optionItem => {
                                optionItem.percent = pageData.voteCount !== 0 ? Math.floor(optionItem.voteSelectedCount / pageData.voteCount * 10000) / 100 : 0;
                                if(topicItem.topType === 24) {
                                    count += optionItem.voteSelectedCount;
                                    score += optionItem.voteSelectedCount * optionItem.score;
                                }
                            });
                            topicItem.count = count;
                            topicItem.score = score;
                            avg = count === 0 ? 0 : Math.round(score / count * 100) / 100;
                            rawAvg += count === 0 ? 0 : score / count;
                            topicItem.avg = avg;
                            totalCount += count;
                            totalScore += score;
                        });

                        this.topicList = pageData.topicList;

                        this.voteDesc = pageData.voteDesc;
                        this.voteTitle = pageData.voteTitle;
                        this.voteCount = pageData.voteCount;
                        this.voteTotalCount = pageData.voteTotalCount;
                        this.totalAvgScore = rawAvg === 0 ? 0 : Math.round(rawAvg * 100) / 100;

                        if(!this.isArea) {
                            this.stuDepart = JSON.parse(pageData.stuDepartJson);
                            this.thScope = JSON.parse(pageData.thScopeJson);
                            this.stuUser = JSON.parse(pageData.stuUserJson || '[]');
                            this.stuGroupJson = JSON.parse(pageData.stuGroupJson || '[]');

                        }
                    })
            },
            jumpToPage (path, query = {}) {
                this.$router.push({
                    path,
                    query
                })
            }
        },

    }
</script>

<style lang="scss" scoped>
    @import "../../styles/mixin";

    @include globalstyle;
    .page {
        padding:12px;
    }
    .questionnaire-container {
        border: 1px solid #DBDBDB;
        width: 1024px;
        margin: 10px auto;
        box-sizing: border-box;
        padding: 10px 30px;
        overflow-y: auto;

        & > * {
            margin: 10px 0;
        }
        .questionnaire-title {
            color: #4C4C4C;
            font-size: 22px;
            text-align: center;
        }
        .questionnaire-info {
            span {
                color: #55a1e3;
                margin: 0 5px;
            }
        }
        .questionnaire-end-time {
            span {
                color: #55a1e3;
                margin: 0 5px;
            }
        }
        .questionnaire-content {
            border-top: 2px solid #55A1E3
        }
        .question-item {
            margin-bottom: 50px;
            &:last-child {
                margin-bottom: 0;
            }
        }
        .question-item__title {
            line-height: 40px;
            /*height: 40px;*/
            margin-bottom: 5px;
        }
        .question-item__choice {
            box-sizing: border-box;
            padding: 0 10px;
            position: relative;
            margin-left: 25px;
            line-height: 40px;
            height: 40px;
            margin-bottom: 5px;
            overflow: hidden;
            background-color: #EBEEF5;
            box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0);
            clear: both;
            &.question-item__choice--link {
                cursor: pointer;
                color: #337ab7;
                &:hover {
                    color: #000;
                }
            }
            &.question-item__choice--noback {
                background-color: transparent;
            }
        }
        .question-item__choice-name {
            position: relative;
            z-index: 200;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            max-width: 80%;
            display: block;
            float: left;
        }
        .question-item__progress-bar {
            position: absolute;
            left: 0;
            top: 0;
            bottom: 0;
            z-index: 100;
            background: #D4EBF8;
        }
        .question-item__vote-count {
            float: right;
            position: relative;
            z-index: 200;
        }
        .question-item__type {
            font-size: 12px;
        }
        .answer-link {
            float: right;
            font-size: 12px;
            color: #337ab7;
            cursor: pointer;
            &:hover {
                color: #000;
            }
        }
    }
    .score-info, .total-score {
        float: right;
    }
</style>
