<template>
    <div id="questionnaire" class="page">
        <back-tool>
        </back-tool>
        <div class="question-container"  :style="{'height':(nobottommaxH-20)+'px'}" style="overflow: auto">
            <div class="body">
                 <div class="questionnaire-title">
                {{voteTitle}}
            </div>
            <div class="questionnaire-info">
                截止时间：{{expriyDate | trimDate}}
            </div>
            <pre class="questionnaire-desc">
                {{voteDesc}}
            </pre>

            <div class="question-item" v-for="(questionItem, index) in topicList">
                <template v-if="optionTypeList.indexOf(questionItem.topType) !== -1">
                    <div class="question-item__title">
                        {{questionItem.topicSeq}}.{{questionItem.topicTitle}}（{{questionItem.topType | getTypeName}}）
                    </div>
                    <div class="quesiton-item__choice" v-for="(optionItem, index) in questionItem.optionList">
                        <div>{{optionItem.optionTitle}}</div>
                        <div>
                            <div class="question-item__progress-bar">
                                <div class="question-item__progress-bar--full"
                                     :style="{width: `${optionItem.percent}%`}"></div>
                            </div>
                            <div class="question-item__count">{{optionItem.voteSelectedCount}}票</div>
                        </div>
                    </div>
                </template>
                <template v-if="questionItem.topType === 14 || questionItem.topType === 21">
                    <div class="question-item__title">
                        {{questionItem.topicSeq}}.{{questionItem.topicTitle}}（{{questionItem.topType | getTypeName}}）
                    </div>
                    <div class="quesiton-item__choice" v-for="(optionItem, index) in questionItem.optionList">
                        <div v-html="parseFillblank(optionItem.optionTitle)"></div>
                        <div>
                            （略）
                        </div>
                    </div>
                </template>
                <template v-if="questionItem.topType === 6">
                    <div class="question-item__title">
                        {{questionItem.topicSeq}}.<span v-html="parseFillblank(questionItem.topicTitle)"></span>（{{questionItem.topType | getTypeName}}）（略）
                    </div>
                </template>
                <template v-if="answerTypeList.indexOf(questionItem.topType) !== -1">
                    <div class="question-item__title">
                        {{questionItem.topicSeq}}.{{questionItem.topicTitle}}（{{questionItem.topType | getTypeName}}）（略）
                    </div>
                </template>
                <template v-if="questionItem.topType === 7">
                    <div class="question-item__title">
                        {{questionItem.topicTitle}}
                    </div>
                </template>
                <template v-if="questionItem.topType === 8">
                    <div class="divider">
                    </div>
                </template>
            </div>
            </div>
           
        </div>
    </div>
</template>

<script>
    import BackTool from '@/components/BackTool';
    import {getVoteResultByVoteId} from '@/api/questionnaire';
    import mixin from '@/mixins/windowResize';

    export default {
        name: "stuQuestionnaireAccounting",
        data: function () {
            return {
                voteId: this.$route.query.voteId,
                anonymous: null,
                expriyDate: '',
                topicList: [],
                voteDesc: '',
                voteTitle: '',
                optionTypeList: [1, 2, 3, 4, 24, 22, 23],
                answerTypeList: [5, 9, 10, 11, 12, 15, 16, 17, 18, 19]
            }
        },
        created() {
            this.getVoteResultByVoteIdFunc();
        },
        mixins: [mixin],
        filters: {
            getTypeName(type) {
                return ['', '单选', '多选', '图片单选', '图片多选', '简答题', '填空', '', '', '地址', '单图上传', '多图上传', '评分', '', '多项填空', '手机号', '邮箱', '身份证', '日期', '时间', '地理位置', '多项填空','下拉单选','下拉多选', '单选'][type];
            },
            trimDate(value) {
                return value ? value.slice(0, value.lastIndexOf('.')) : '';
            }
        },
        components: {BackTool},
        methods: {
            parseFillblank(title) {
                return title.replace(/{(\d+?)}/g, function(_, num) {
                    return `<input type="text" disabled="disabled" class="blank" maxlength="${num}" style="width: ${num * 20}px;" />`
                });
            },
            getVoteResultByVoteIdFunc() {
                getVoteResultByVoteId({
                    classId: 0,
                    voteId: this.voteId
                })
                    .then(res => res.data)
                    .then(data => {
                        const pageData = data.data;
                        this.anonymous = pageData.anonymous;
                        this.expriyDate = pageData.expriyDate;
                        this.isShowResult = pageData.isShowResult;

                        pageData.topicList.forEach(topicItem => {
                            let sum = 0;
                            topicItem.optionList.forEach(optionItem => {
                                sum += optionItem.voteSelectedCount;
                            });
                            topicItem.optionList.forEach(optionItem => {
                                optionItem.percent = sum !== 0 ? Math.floor(optionItem.voteSelectedCount / sum * 10000) / 100 : 0;
                            });
                        });

                        this.topicList = pageData.topicList;

                        this.voteDesc = pageData.voteDesc;
                        this.voteTitle = pageData.voteTitle;
                        this.voteCount = pageData.voteCount;
                        this.voteTotalCount = pageData.voteTotalCount;
                    })
            },
        }
    }
</script>

<style scoped>
    .page {
        padding:12px;
    }
    .questionnaire-title {
        text-align: left;
        font-size: 25px;
        font-weight: 400;
        color: #000;
        margin: 1em 15px 0 15px;
        height: auto;
        word-break: break-all;
    }

    .questionnaire-desc, .questionnaire-info, .question-container {
        margin-top: .77em;
        margin-bottom: .3em;
        padding-left: 15px;
        padding-right: 15px;
        color: #888;
        font-size: 14px;
        word-wrap: break-word;
        word-break: break-all;
    }
    .question-item {
        margin-top: 10px;
        padding-left: 15px;
        padding-right: 15px;
    }
    .question-item__title {
        color: #000;
    }

    .quesiton-item__choice {
        margin: 10px 0;
        font-size: 12px;
        color: #888;
        word-break: break-all;
    }

    .question-item__progress-bar, .question-item__count {
        display: inline-block;
        vertical-align: middle;
    }

    .question-item__progress-bar {
        width: 90%;
        position: relative;
        height: 25px;
        background-color: #EBEBEB;
    }

    .question-item__count {
        margin-left: 10px;
    }

    .question-item__progress-bar--full {
        position: absolute;
        left: 0;
        top: 0;
        bottom: 0;
        background-color: #D4EBF8;
    }
    .divider {
        border: 1px solid #999;
    }
    .body{
        width:810px;
        margin:0 auto;
    }
</style>
