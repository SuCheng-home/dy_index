<template>
    <div id="questionnaireDetail" class="page">
        <back-tool>
             <el-button type="primary" size="medium"   @click="print()">打印</el-button>
            <el-button type="primary" size="medium" @click="toAccounting" v-if="isFromBatch && isNormal&&num==2&&isShowByPermission('/evaluateTw/evaluateTwManger')">查看结果</el-button>
            <el-button type="primary" size="medium" @click="evTeaTempDetailinfo" v-if="isByQues&&num==2&&isShowByPermission('/evaluateTw/evaluateTwManger')" >按老师统计</el-button>
            <el-button type="primary" size="medium" @click="numstatistics" v-if="isByQues&&num==2&&isShowByPermission('/evaluateTw/evaluateTwManger')" >分数统计</el-button>
            <el-button type="primary" size="medium" @click="newevTeaTempDetailinfo"  v-if="isByOpt&&num==2&&isShowByPermission('/evaluateTw/evaluateTwManger')" >老师统计明细</el-button>
        </back-tool>
        <div class="questionnaire-container">
            <div class="questionnaire-header" ref="print">
                <div class="questionnaire-title">{{tempTitle}}</div>
                <div class="questionnaire-desc">{{tempDesc}}</div>
                <div class="questionnaire-curr" v-if="isByQues || isByOpt">
                    科目：<span class="curr-item" v-for="currItem in currJson">{{currItem.currName}}</span>
                </div>
                <div class="questionnaire-content">
                    <template v-for="(questionItem, questionIndex) in topicList">
                        <div
                            :key="questionIndex" v-if="questionItem.topicType === 1"
                            class="question-item quetion-item--single-choice"
                        >
                            <div class="question-item__title">
                                {{questionItem.topicNum}}.<span class="request-hint"
                                                                v-if="questionItem.isHaveToDo === 0">*</span>{{questionItem.topicTitle}}&nbsp;&nbsp;
                                <el-tag type="primary">单选</el-tag>&nbsp;&nbsp;
                            </div>
                            <template v-if="isNormal || isByQues">
                                <div class="question-item__choice"
                                     v-for="(optionItem, optionIndex) in questionItem.optionList">
                                    <el-radio :value="false" :label="optionItem.optionTitle"/>
                                </div>
                            </template>
                            <template v-else>
                                <div class="question-item__choice" v-for="(currItem) in currJson">
                                    <el-radio :value="false" :label="currItem.currName"/>
                                </div>
                            </template>
                        </div>
                        <div
                            :key="questionIndex" v-if="questionItem.topicType === 24"
                            class="question-item quetion-item--single-choice"
                        >
                            <div class="question-item__title">
                                {{questionItem.topicNum}}.<span class="request-hint"
                                                                v-if="questionItem.isHaveToDo === 0">*</span>{{questionItem.topicTitle}}&nbsp;&nbsp;
                                <el-tag type="primary">评分单选</el-tag>&nbsp;&nbsp;
                                <el-tag v-if="questionItem.limitSelect !== 0" type="primary">
                                    限选{{questionItem.limitSelect}}
                                </el-tag>
                            </div>
                            <div class="question-item__choice"
                                 v-for="(optionItem, optionIndex) in questionItem.optionList">
                                <el-radio :value="false" :label="optionItem.optionTitle"/>&nbsp;&nbsp;&nbsp;&nbsp;
                                <span class="question-item__score">{{optionItem.score}}分</span>
                            </div>
                        </div>
                        <div
                            :key="questionIndex" v-if="questionItem.topicType === 2"
                            class="question-item quetion-item--multiple-choice"
                        >
                            <div class="question-item__title">
                                {{questionItem.topicNum}}.<span class="request-hint"
                                                                v-if="questionItem.isHaveToDo === 0">*</span>{{questionItem.topicTitle}}&nbsp;&nbsp;
                                <el-tag type="primary">多选</el-tag>&nbsp;&nbsp;
                                <el-tag v-if="questionItem.limitSelect !== 0" type="primary">
                                    限选{{questionItem.limitSelect}}
                                </el-tag>
                            </div>
                            <template v-if="isNormal || isByQues">
                                <div class="question-item__choice"
                                     v-for="(optionItem, optionIndex) in questionItem.optionList">
                                    <el-checkbox :value="false" :label="optionItem.optionTitle"/>
                                </div>
                            </template>

                            <template v-else>
                                <div class="question-item__choice" v-for="(currItem) in currJson">
                                    <el-checkbox :value="false" :label="currItem.currName"/>
                                </div>
                            </template>
                        </div>
                        <div
                            :key="questionIndex" v-if="questionItem.topicType === 3"
                            class="question-item quetion-item--pic-multiple-choice"
                        >
                            <div class="question-item__title">{{questionItem.topicNum}}.<span class="request-hint"
                                                                                              v-if="questionItem.isHaveToDo === 0">*</span>{{questionItem.topicTitle}}&nbsp;&nbsp;
                                <el-tag type="primary">单选</el-tag>&nbsp;&nbsp;
                                <el-tag v-if="questionItem.limitSelect !== 0" type="primary">
                                    限选{{questionItem.limitSelect}}
                                </el-tag>
                            </div>
                            <image-previewer tag="richtext" viewclass="question-item__choice-pic"
                                             :images="questionItem.picList">
                                <div class="question-pic-container">
                                    <div class="question-item__choice"
                                         v-for="(optionItem, optionIndex) in questionItem.optionList">
                                        <div class="question-item__choice-pic"
                                             :style="{backgroundImage: `url(${optionItem.optionPicUrl})`}"></div>
                                        <img :src="optionItem.optionPicUrl" class="print-only question-pic"/>
                                        <div>
                                            <el-radio :value="false" :label="optionItem.optionTitle"/>
                                        </div>
                                    </div>
                                </div>
                            </image-previewer>
                        </div>
                        <div
                            :key="questionIndex" v-if="questionItem.topicType === 4"
                            class="question-item quetion-item--pic-multiple-choice"
                        >
                            <div class="question-item__title">
                                {{questionItem.topicNum}}.<span class="request-hint"
                                                                v-if="questionItem.isHaveToDo === 0">*</span>{{questionItem.topicTitle}}&nbsp;&nbsp;
                                <el-tag type="primary">多选</el-tag>&nbsp;&nbsp;
                                <el-tag v-if="questionItem.limitSelect !== 0" type="primary">
                                    限选{{questionItem.limitSelect}}
                                </el-tag>
                            </div>
                            <image-previewer tag="richtext" viewclass="question-item__choice-pic"
                                             :images="questionItem.picList">
                                <div class="question-pic-container">
                                    <div class="question-item__choice"
                                         v-for="(optionItem, optionIndex) in questionItem.optionList">
                                        <div class="question-item__choice-pic"
                                             :style="{backgroundImage: `url(${optionItem.optionPicUrl})`}"></div>
                                        <img :src="optionItem.optionPicUrl" class="print-only question-pic"/>
                                        <div>
                                            <el-checkbox :value="false" :label="optionItem.optionTitle"/>
                                        </div>
                                    </div>
                                </div>

                            </image-previewer>
                        </div>
                        <div
                            :key="questionIndex" v-if="questionItem.topicType === 5"
                            class="question-item question-item--qna"
                        >
                            <div class="question-item__title">
                                {{questionItem.topicNum}}.<span class="request-hint"
                                                                v-if="questionItem.isHaveToDo === 0">*</span>{{questionItem.topicTitle}}&nbsp;&nbsp;
                                <el-tag type="primary">简答</el-tag>&nbsp;&nbsp;
                            </div>
                            <div class="question-item__answer-area">
                                <el-input type="textarea" :rows="5" :disabled="true"></el-input>
                            </div>
                        </div>
                    </template>

                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import baseMixin from '@/mixins/baseMixin';
    import mixin from '@/mixins/windowResize';
    import {querySchoolAllCourse} from '@/api/common/common';
    import {getEvaluateTwTemp} from '@/api/evTea';
    import BackTool from '@/components/BackTool';
    import ImagePreviewer from '@/components/ImagePreviewer/ImagePreviewer.vue';
    import Uploader from '@/components/Uploader/WebUploader';
    import {mapGetters} from 'vuex';
    import {isShowByPermission} from '@/utils';
    export default {
        components: {
            BackTool,
            ImagePreviewer,
            Uploader
        },
        computed: {
            ...mapGetters(['userInfo']),
            currJson() {
                const currJson = [];
                this.checkedCurr.forEach(id => {
                    const currItem = this.currList.find(item => item.id == id);
                    if (currItem) {
                        currJson.push({
                            currId: currItem.id,
                            currName: currItem.name,
                            currOrder: currItem.order
                        });
                    }
                });
                return currJson;
            }
        },
        mixins: [mixin, baseMixin],
        data: function () {
            return {
                num:this.$route.query.num,
                isFromBatch: this.$route.query.isFromBatch == 1,
                batchId: this.$route.query.batchId,

                checkedCurr: [],
                currList: [],

                id: this.$route.query.id,

                tempTitle: '',
                tempDesc: '',

                topicList: [],

                questionItemList: [],
                isDialogShow: false,
                batchAddQuestionContent: '',
                batchAddCurrentQuestion: null,

                currentQuestion: {},
                previousQuestion: {},
                currentQuestionIndex: 0,
                currentOption: {},

                isNormal: this.$route.query.isNormal == 1,
                isByQues: this.$route.query.isByQues == 1,
                isByOpt: this.$route.query.isByOpt == 1
            }
        },
        created() {
            getEvaluateTwTemp({
                tempId: this.id
            })
                .then(res => res.data)
                .then(data => {
                    const pageData = data.data;
                    pageData.topicList.forEach(topicItem => {
                        if (topicItem.topicType === 4 || topicItem.topicType === 3) {
                            topicItem.picList = topicItem.optionList.map(item => ({src: item.optionPicUrl}));
                        }
                        topicItem.optionList.forEach(optionItem => {
                            optionItem.blankSelect = JSON.parse(optionItem.blankSelect);
                        })
                    });
                    this.checkedCurr = JSON.parse(pageData.currJson).map(item => item.currId);
                    this.topicList = pageData.topicList;
                    this.tempDesc = pageData.tempDesc;
                    this.tempTitle = pageData.tempTitle;

                });
            if (this.isByQues || this.isByOpt) {
                querySchoolAllCourse()
                    .then(res => res.data)
                    .then(data => {
                        this.currList = data.data;
                    })
            }

        },
        methods: {
            isShowByPermission,
             //打印
    print() {
      this.$print(this.$refs.print);
    },
            toAccounting() {
                let url = '';
                if(this.isNormal) {
                    url = 'evTeaAccounting';
                } else if(this.isByQues) {
                    url = 'evTeaAccountingByQues';
                } else {
                    url = 'evTeaAccountingByOpt';
                }
                this.jumpToPage(url, {
                    batchId: this.batchId,
                    batchTempId: this.id
                });
            },
            evTeaTempDetailinfo(){
                this.jumpToPage('evTeaTempDetailinfo', {
                    batchId: this.batchId,
                    batchTempId: this.id
                });
            },
            numstatistics(){
                this.jumpToPage('numstatistics', {
                    batchId: this.batchId,
                    batchTempId: this.id
                });
            },
            newevTeaTempDetailinfo(){
                this.jumpToPage('newevTeaTempDetailinfo', {
                    batchId: this.batchId,
                    teacherUserId: 0,
                     batchTempId: this.id
                });
            },
        }
    }
</script>


<style scoped lang="scss">
    @import "../../styles/mixin";

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


        .questionnaire-title {
            color: #4C4C4C;
            font-size: 32px;
            text-align: center;
            font-weight: bold;
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

    img.question-pic {
        @include wh(150px, 150px);
    }

    .question-pic-container {
        @include clearfix;
    }

    .blank {
        border: 0 !important;
        border-bottom: 1px solid #000 !important;
    }

    .divider {
        border: 1px solid #999;
    }

    .upload-hint {
        width: 160px;
        height: 190px;
        float: left;
        border: 1px solid #ccc;
        margin-right: 10px;
        margin-bottom: 10px;
        background: url(../../assets/images/picinput.png) no-repeat;
        background-position: center center;
        cursor: pointer;
    }

    .request-hint {
        margin-right: 5px;
        color: red;
    }

    .question-item__score {
        font-size: 14px;
        color: #606266;
    }

    .questionnaire-sub {
        & > * {
            @include middleIB;
            text-align: center;

            &:nth-child(1) {
                width: 40%;
            }

            &:nth-child(2) {
                width: 19%;
            }

            &:nth-child(3) {
                width: 40%;
            }
        }
    }

    .questionnaire-header {
        page-break-after: always;
        & > * {
            margin: 5px 0;
        }
    }

    .curr-item {
        margin-right: 10px;
    }
</style>
<style lang="scss">

    #questionnaireDetail {
        .el-checkbox__label {
            white-space: normal;
        }

        .img-upload {
            width: 160px;
            height: 190px;
            float: left;
            border: 1px solid #ccc;
            margin-right: 10px;
            margin-bottom: 10px;
            background: url(../../assets/images/picinput.png) no-repeat center center;
            cursor: pointer;
        }
    }

    @media print {
        *{
            
            margin: 0;
          padding: 0;
        }
        .question-item {
            clear: both;
        }
        .question-item__choice {
            float: left;
            margin-right: 10px;
        }
        .print-container, .questionnaire-title {
            width: 100% !important;
        }
        .questionnaire-title {
            text-align: center !important;
            font-size: 26px !important;
        }
    }

</style>
