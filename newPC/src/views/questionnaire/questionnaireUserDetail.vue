<template>
    <div class="page">
        <back-tool>
        </back-tool>
        <div class="questionnaire-container" :style="{height: `${maxH + 40}px`}">
            <div class="questionnaire-title">{{voteTitle}}</div>
            <pre class="questionnaire-desc">{{voteDesc}}</pre>
            <div class="questionnaire-content">
                <template v-for="(questionItem, questionIndex) in topicList">
                    <div
                            :key="questionIndex" v-if="questionItem.topType === 1"
                            class="question-item quetion-item--single-choice"
                    >
                        <div class="question-item__title">
                            {{questionItem.topicSeq}}.
                            <span class="request-hint" v-if="questionItem.isHaveToDo === 0">*</span>
                            {{questionItem.topicTitle}}&nbsp;&nbsp;
                            <el-tag type="primary">单选</el-tag>&nbsp;&nbsp;
                        </div>
                        <div class="question-item__choice radius" v-for="(optionItem, optionIndex) in questionItem.optionList">
                            <el-checkbox :true-label="1" :false-label="0" :value="optionItem.isSelected" :label="optionItem.optionTitle" />
                            <div v-if="optionItem.isHaveReason === 1 && optionItem.isSelected === 1" class="question-item__answer-area">
                                {{optionItem.optionAnswer}}
                            </div>
                        </div>
                    </div>
                    <div
                        :key="questionIndex" v-if="questionItem.topType === 22"
                        class="question-item quetion-item--single-choice"
                    >
                        <div class="question-item__title">
                            {{questionItem.topicSeq}}.
                            <span class="request-hint" v-if="questionItem.isHaveToDo === 0">*</span>
                            {{questionItem.topicTitle}}&nbsp;&nbsp;
                            <el-tag type="primary">单选</el-tag>&nbsp;&nbsp;
                        </div>
                        <div class="question-item__choice">
                            <el-select disabled v-model="questionItem.selectedOptionId">
                                <el-option :label="optionItem.optionTitle" v-for="(optionItem, optionIndex) in questionItem.optionList" :value="optionItem.id"></el-option>
                            </el-select>

                        </div>
                    </div>
                    <div
                        :key="questionIndex" v-else-if="questionItem.topType === 24"
                        class="question-item quetion-item--single-choice"
                    >
                        <div class="question-item__title">
                            {{questionItem.topicSeq}}.
                            <span class="request-hint" v-if="questionItem.isHaveToDo === 0">*</span>
                            {{questionItem.topicTitle}}&nbsp;&nbsp;
                            <el-tag type="primary">评分单选</el-tag>&nbsp;&nbsp;
                        </div>
                        <div class="question-item__choice radius" v-for="(optionItem, optionIndex) in questionItem.optionList">
                            <el-checkbox :true-label="1" :false-label="0" :value="optionItem.isSelected" :label="`${optionItem.optionTitle} （${optionItem.score}分）`" />
                            <div v-if="optionItem.isHaveReason === 1 && optionItem.isSelected === 1" class="question-item__answer-area">
                                {{optionItem.optionAnswer}}
                            </div>
                        </div>
                    </div>
                    <div
                            :key="questionIndex" v-if="questionItem.topType === 12"
                            class="question-item quetion-item--rate"
                    >
                        <div class="question-item__title">{{questionItem.topicSeq}}.
                            <span class="request-hint" v-if="questionItem.isHaveToDo === 0">*</span>
                            {{questionItem.topicTitle}}&nbsp;&nbsp;
                            <el-tag type="primary">评分</el-tag>&nbsp;&nbsp;
                        </div>
                        <div>
                            <el-rate :value="questionItem.topicAnswer"></el-rate>
                        </div>
                    </div>
                    <div
                            :key="questionIndex" v-if="questionItem.topType === 14"
                            class="question-item quetion-item--single-fill"
                    >
                        <div class="question-item__title">
                            {{questionItem.topicSeq}}.
                            {{questionItem.topicTitle}}&nbsp;&nbsp;
                            <el-tag type="primary">多项填空</el-tag>&nbsp;&nbsp;
                        </div>
                        <div class="question-item__choice" v-for="(optionItem, optionIndex) in questionItem.optionList">
                            <span class="request-hint" v-if="optionItem.isHaveReason === 1">*</span>
                            <span v-html="parseFillblank(optionItem.optionAnswer)"></span>
                        </div>
                    </div>

                    <div
                            :key="questionIndex" v-if="questionItem.topType === 2"
                            class="question-item quetion-item--multiple-choice"
                    >
                        <div class="question-item__title">
                            {{questionItem.topicSeq}}.
                            <span class="request-hint" v-if="questionItem.isHaveToDo === 0">*</span>
                            {{questionItem.topicTitle}}&nbsp;&nbsp;
                            <el-tag type="primary">多选</el-tag>&nbsp;&nbsp;
                        </div>
                        <div class="question-item__choice" v-for="(optionItem, optionIndex) in questionItem.optionList">
                            <el-checkbox :true-label="1" :false-label="0" :value="optionItem.isSelected" :label="optionItem.optionTitle" />
                            <div v-if="optionItem.isHaveReason === 1 && optionItem.isSelected === 1" class="question-item__answer-area">
                                {{optionItem.optionAnswer}}
                            </div>
                        </div>
                    </div>
                    <div
                        :key="questionIndex" v-if="questionItem.topType === 22"
                        class="question-item quetion-item--single-choice"
                    >
                        <div class="question-item__title">
                            {{questionItem.topicSeq}}.
                            <span class="request-hint" v-if="questionItem.isHaveToDo === 0">*</span>
                            {{questionItem.topicTitle}}&nbsp;&nbsp;
                            <el-tag type="primary">单选</el-tag>&nbsp;&nbsp;
                        </div>
                        <div class="question-item__choice">
                            <el-select disabled v-model="questionItem.selectedOptionId">
                                <el-option :label="optionItem.optionTitle" v-for="(optionItem, optionIndex) in questionItem.optionList" :value="optionItem.id"></el-option>
                            </el-select>

                        </div>
                    </div>
                    <div
                            :key="questionIndex" v-if="questionItem.topType === 21"
                            class="question-item quetion-item--multiple-fill"
                    >
                        <div class="question-item__title">
                            {{questionItem.topicSeq}}.
                            {{questionItem.topicTitle}}&nbsp;&nbsp;
                            <el-tag type="primary">多项填空</el-tag>&nbsp;&nbsp;
                        </div>
                        <div class="question-item__choice" v-for="(optionItem, optionIndex) in questionItem.optionList">
                            <span class="request-hint" v-if="optionItem.isHaveReason === 1">*</span>
                            <span v-html="parseFillblank(optionItem.optionAnswer)"></span>
                        </div>
                    </div>

                    <div
                            :key="questionIndex" v-if="questionItem.topType === 3"
                            class="question-item quetion-item--pic-multiple-choice"
                    >
                        <div class="question-item__title">{{questionItem.topicSeq}}.
                            <span class="request-hint" v-if="questionItem.isHaveToDo === 0">*</span>
                            {{questionItem.topicTitle}}&nbsp;&nbsp;
                            <el-tag type="primary">单选</el-tag>&nbsp;&nbsp;
                        </div>
                        <image-previewer tag="richtext" viewclass="question-item__choice-pic" :images="questionItem.picList">
                            <div class="question-item__choice radius" v-for="(optionItem, optionIndex) in questionItem.optionList">
                                <div class="question-item__choice-pic" :style="{backgroundImage: `url(${optionItem.optionPicUrl})`}"></div>
                                <div>
                                    <el-checkbox :true-label="1" :false-label="0" :value="optionItem.isSelected" :label="optionItem.optionTitle" />
                                </div>
                                <div v-if="optionItem.isHaveReason === 1 && optionItem.isSelected === 1" class="question-item__answer-area">
                                    {{optionItem.optionAnswer}}
                                </div>
                            </div>
                        </image-previewer>

                    </div>
                    <div
                            :key="questionIndex" v-if="questionItem.topType === 4"
                            class="question-item quetion-item--pic-multiple-choice"
                    >
                        <div class="question-item__title">
                            {{questionItem.topicSeq}}.
                            <span class="request-hint" v-if="questionItem.isHaveToDo === 0">*</span>
                            {{questionItem.topicTitle}}&nbsp;&nbsp;
                            <el-tag type="primary">多选</el-tag>&nbsp;&nbsp;
                        </div>
                        <image-previewer tag="richtext" viewclass="question-item__choice-pic" :images="questionItem.picList">
                            <div class="question-item__choice" v-for="(optionItem, optionIndex) in questionItem.optionList">
                                <div class="question-item__choice-pic" :style="{backgroundImage: `url(${optionItem.optionPicUrl})`}"></div>
                                <div><el-checkbox :true-label="1" :false-label="0" :value="optionItem.isSelected" :label="optionItem.optionTitle" /></div>
                                <div v-if="optionItem.isHaveReason === 1 && optionItem.isSelected === 1" class="question-item__answer-area">
                                    {{optionItem.optionAnswer}}
                                </div>
                            </div>
                        </image-previewer>
                    </div>
                    <div
                            :key="questionIndex" v-if="questionItem.topType === 5"
                            class="question-item question-item--qna"
                    >
                        <div class="question-item__title">
                            {{questionItem.topicSeq}}.
                            <span class="request-hint" v-if="questionItem.isHaveToDo === 0">*</span>
                            {{questionItem.topicTitle}}&nbsp;&nbsp;
                            <el-tag type="primary">简答</el-tag>&nbsp;&nbsp;
                        </div>
                        <div class="question-item__answer-area">
                            {{questionItem.topicAnswer}}
                        </div>
                    </div>

                    <div
                            :key="questionIndex" v-if="questionItem.topType === 6"
                            class="question-item question-item--qna"
                    >
                        <div class="question-item__title">
                            {{questionItem.topicSeq}}.
                            <span class="request-hint" v-if="questionItem.isHaveToDo === 0">*</span>
                            <span v-html="parseFillblank(questionItem.topicAnswer)"></span>
                            <el-tag type="primary">填空</el-tag>&nbsp;&nbsp;
                        </div>
                    </div>

                    <div
                            :key="questionIndex" v-if="questionItem.topType === 9"
                            class="question-item question-item--qna"
                    >
                        <div class="question-item__title">
                            {{questionItem.topicSeq}}.
                            <span class="request-hint" v-if="questionItem.isHaveToDo === 0">*</span>
                            {{questionItem.topicTitle}}&nbsp;&nbsp;
                            <el-tag type="primary">地址</el-tag>&nbsp;&nbsp;
                        </div>
                        <div class="question-item__answer-area">
                            {{questionItem.topicAnswer}}
                        </div>
                    </div>

                    <div
                            :key="questionIndex" v-if="questionItem.topType === 7"
                            class="question-item question-item--qna"
                    >
                        <div class="question-item__title">
                            {{questionItem.topicTitle}}&nbsp;&nbsp;
                        </div>
                    </div>

                    <div
                            :key="questionIndex" v-if="questionItem.topType === 10"
                            class="question-item question-item--qna"
                    >
                        <div class="question-item__title">
                            {{questionItem.topicSeq}}.
                            <span class="request-hint" v-if="questionItem.isHaveToDo === 0">*</span>
                            {{questionItem.topicTitle}}&nbsp;&nbsp;
                            <el-tag type="primary">单图上传</el-tag>&nbsp;&nbsp;
                        </div>
                        <div class="question-item__answer-area">
                            <image-previewer tag="richtext" viewclass="pic-item" :images="questionItem.picList">
                                <div class="pic-item" v-for="picItem in JSON.parse(questionItem.topicAnswer)" :style="{backgroundImage: `url(${picItem})`}"></div>
                            </image-previewer>
                        </div>
                    </div>

                    <div
                            :key="questionIndex" v-if="questionItem.topType === 11"
                            class="question-item question-item--qna"
                    >
                        <div class="question-item__title">
                            {{questionItem.topicSeq}}.
                            <span class="request-hint" v-if="questionItem.isHaveToDo === 0">*</span>
                            {{questionItem.topicTitle}}&nbsp;&nbsp;
                            <el-tag type="primary">多图上传</el-tag>&nbsp;&nbsp;
                        </div>
                        <div class="question-item__answer-area">
                            <image-previewer tag="richtext" viewclass="pic-item" :images="questionItem.picList">
                                <div class="pic-item" v-for="picItem in JSON.parse(questionItem.topicAnswer)" :style="{backgroundImage: `url(${picItem})`}"></div>
                            </image-previewer>
                        </div>
                    </div>

                    <div
                            :key="questionIndex" v-if="questionItem.topType === 8"
                            class="question-item question-item--qna"
                    >
                        <div class="divider"></div>
                    </div>

                    <div
                            :key="questionIndex" v-if="questionItem.topType === 15"
                            class="question-item question-item--qna"
                    >
                        <div class="question-item__title">
                            {{questionItem.topicSeq}}.
                            <span class="request-hint" v-if="questionItem.isHaveToDo === 0">*</span>
                            {{questionItem.topicTitle}}&nbsp;&nbsp;
                            <el-tag type="primary">手机号</el-tag>&nbsp;&nbsp;
                        </div>
                        <div class="question-item__answer-area">
                            {{questionItem.topicAnswer}}
                        </div>
                    </div>

                    <div
                            :key="questionIndex" v-if="questionItem.topType === 16"
                            class="question-item question-item--qna"
                    >
                        <div class="question-item__title">
                            {{questionItem.topicSeq}}.
                            <span class="request-hint" v-if="questionItem.isHaveToDo === 0">*</span>
                            {{questionItem.topicTitle}}&nbsp;&nbsp;
                            <el-tag type="primary">邮箱</el-tag>&nbsp;&nbsp;
                        </div>
                        <div class="question-item__answer-area">
                            {{questionItem.topicAnswer}}
                        </div>
                    </div>

                    <div
                            :key="questionIndex" v-if="questionItem.topType === 17"
                            class="question-item question-item--qna"
                    >
                        <div class="question-item__title">
                            {{questionItem.topicSeq}}.
                            <span class="request-hint" v-if="questionItem.isHaveToDo === 0">*</span>
                            {{questionItem.topicTitle}}&nbsp;&nbsp;
                            <el-tag type="primary">身份证</el-tag>&nbsp;&nbsp;
                        </div>
                        <div class="question-item__answer-area">
                            {{questionItem.topicAnswer}}
                        </div>
                    </div>

                    <div
                            :key="questionIndex" v-if="questionItem.topType === 18"
                            class="question-item question-item--qna"
                    >
                        <div class="question-item__title">
                            {{questionItem.topicSeq}}.
                            <span class="request-hint" v-if="questionItem.isHaveToDo === 0">*</span>
                            {{questionItem.topicTitle}}&nbsp;&nbsp;
                            <el-tag type="primary">日期</el-tag>&nbsp;&nbsp;
                        </div>
                        <div class="question-item__answer-area">
                            {{questionItem.topicAnswer}}
                        </div>
                    </div>

                    <div
                            :key="questionIndex" v-if="questionItem.topType === 19"
                            class="question-item question-item--qna"
                    >
                        <div class="question-item__title">
                            {{questionItem.topicSeq}}.
                            <span class="request-hint" v-if="questionItem.isHaveToDo === 0">*</span>
                            {{questionItem.topicTitle}}&nbsp;&nbsp;
                            <el-tag type="primary">时间</el-tag>&nbsp;&nbsp;
                        </div>
                        <div class="question-item__answer-area">
                            {{questionItem.topicAnswer}}
                        </div>
                    </div>

                </template>

            </div>
        </div>
    </div>
</template>

<script>
import mixin from '@/mixins/windowResize';
    import ImagePreviewer from '@/components/ImagePreviewer/ImagePreviewer.vue';
    import baseMixin from '@/mixins/baseMixin';
    import moment from 'moment';
    import BackTool from '@/components/BackTool';
    import {getVoteByVoteIdAndUserId} from '@/api/questionnaire';

    export default {
        name: "questionnaireUserDetail",
         mixins: [mixin],
        data: function() {
            return {
                expriyDate: '',
                voteId: this.$route.query.voteId,
                userId: this.$route.query.userId,
                voteTitle: '',
                voteDesc: '',
                sendUserType: null,
                anonymous: null,
                topicList: [],
                voteStatus: null,
                isShowResult: null,
                maxVoteCount: 0,
                stuDepartJson: '{}',
                thScopeJson: '{}',

            }
        },
        mixins: [baseMixin],
        components: {
            BackTool,
            ImagePreviewer
        },
        created() {
            getVoteByVoteIdAndUserId({
                voteId: this.voteId,
                userId: this.userId
            })
                .then(res => res.data)
                .then(data => {
                    const pageData = data.data;
                    pageData.topicList.forEach(item => {
                        if (item.topType === 4 || item.topType === 3) {
                            item.picList = item.optionList.map(item => ({src: item.optionPicUrl}));
                        }
                        if(item.topType === 10 || item.topType === 11) {
                            if(item.topicAnswer !== '' && item.topicAnswer !== '[]') {
                                item.picList = JSON.parse   (item.topicAnswer).map(item => ({src: item}));
                            }
                        }
                        if (item.topType === 18) {
                            item.topicAnswer = this.$moment(item.topicAnswer).format('YYYY-MM-DD');
                        }
                        // if (item.topType === 19) {
                        //     item.topicAnswer = this.$moment(item.topicAnswer).format('HH:mm');
                        // }
                        if(item.topType === 22) {
                            item.selectedOptionId = item.optionList.find(optionItem => optionItem.isSelected == 1).id;
                        }
                        if(item.topType === 23) {
                            const selectedOptionId = [];
                            item.optionList.forEach(optionItem => {
                                if(optionItem.isSelected == 1) {
                                    selectedOptionId.push(optionItem.id);
                                }
                            });
                            item.selectedOptionId = selectedOptionId;
                        }
                    });
                    this.voteTitle = pageData.voteTitle;
                    this.voteDesc = pageData.voteDesc;
                    this.sendUserType = pageData.sendUserType;
                    this.expriyDate = pageData.expriyDate;
                    this.anonymous = pageData.anonymous;
                    this.topicList = pageData.topicList;
                    this.stuDepartJson = pageData.stuDepartJson;
                    this.thScopeJson = pageData.thScopeJson;
                    this.voteStatus = pageData.voteStatus;
                    this.isShowResult = pageData.isShowResult;
                    this.maxVoteCount = pageData.maxVoteCount;
                });

        },
        methods: {
            parseFillblank(title) {
                return title.replace(/{(.+?)}/g, (_, content) => {
                    return `<span style="border-bottom: 1px solid #000;">${content}</span>`;
                })
            },
            parseFillblankInput(title) {
                return title.replace(/{(\d)}/g, function(_, num) {
                    return `<input type="text" style="border: 0;border-bottom: 1px solid #000; background: transparent;" disabled class="blank" maxlength="${num}" style="width: ${num * 20}px" />`
                });
            }
        }
    }
</script>

<style>
.question-item__choice.radius .el-checkbox__inner{
   border-radius: 50%;
}
.question-item__choice.radius .el-checkbox__input.is-checked .el-checkbox__inner:after{
    transform: translate(-50%, -50%) scale(1);
}
.question-item__choice.radius .el-checkbox__inner::after{
    width: 4px;
    height: 4px;
    border-radius: 100%;
    background-color: #fff;
    content: "";
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%) scale(0);
    transition: transform .15s ease-in;
}
</style>
<style scoped lang="scss">
    @import "../../styles/mixin";

    .divider {
        border-bottom: 1px solid #999;
    }
    .page {
        padding:12px;
    }
    .questionnaire-container {
        border: 1px solid #DBDBDB;
        width: 1024px;
        margin: 10px auto;
        box-sizing: border-box;
        padding: 10px 30px;
        height: 600px;
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
        .questionnaire-content {
            margin-top: 10px;
            border-top: 1px solid #DBDBDB;
            padding-top: 30px;
        }
        .question-item {
            @include clearfix;
            & > * {
                margin: 5px 0;
            }
            .question-item__type {
                font-size: 12px;
            }
            .question-item__choice-pic {
                @include cover-bg;
                @include wh(150px, 150px);
                margin-bottom: 5px;
            }
        }
        .quetion-item--pic-multiple-choice, .quetion-item--pic-multiple-choice {
            .question-item__choice {
                float: left;
                margin-right: 10px;
            }
        }
    }
    .pic-item {
        float: left;
        @include cover-bg;
        @include wh(150px, 150px);
        margin: 0 10px 10px 0;
    }
    .request-hint {
        color: red;
    }
</style>
