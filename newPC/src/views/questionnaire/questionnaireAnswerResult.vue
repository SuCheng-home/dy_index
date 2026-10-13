<template>
    <div class="page">
        <back-tool>
            <a :href="exportUrl" download="导出" target="_blank"  v-if="answerList.length">
                <el-button  size="medium" class="filter-item" type="primary">导出</el-button>
            </a>

            <el-select @change="changeClass" value="0"  size="medium" v-if="sendUserType === 2" v-model="classId"  placeholder="请选择">
                <el-option label="全部班级" :value="0">
                </el-option>
                <el-option :label="classItem.className" :value="classItem.classId" :key="index" v-for="(classItem, index) in classList"></el-option>
            </el-select>
        </back-tool>
        <div class="answer-info-container">
            <div class="question-title">答题结果</div>
            <ul class="answer-container" v-if="type === 6">
                <li class="answer-item" v-for="(answer, index) in answerList" :key="index">
                    <div v-html="parseFillblank(answer.topicAnswer)"></div>
                    <div class="answer-item__user-name">{{answer.userName}}</div>
                </li>
            </ul>
            <ul class="answer-container" v-else-if="type === 10 || type === 11">

                <li class="answer-item" v-for="(answer, index) in answerList" :key="index">
                    <div class="pic-container">
                        <image-previewer tag="richtext" viewclass="pic-item" :images="answer.picList">
                            <div class="pic-item" v-for="picItem in JSON.parse(answer.topicAnswer)" :style="{backgroundImage: `url(${picItem})`}"></div>
                        </image-previewer>
                    </div>
                    <div class="answer-item__user-name">{{answer.userName}}</div>
                </li>
            </ul>
            <ul class="answer-container" v-else>
                <li class="answer-item" v-for="(answer, index) in answerList" :key="index">
                    <div>{{answer.topicAnswer}}</div>
                    <div class="answer-item__user-name">{{answer.userName}}</div>
                </li>
            </ul>
            <div class="pagination-container">
                <el-pagination
                        @size-change="sizeChangeHandler"
                        @current-change="currentChangeHandler"
                        :current-page.sync="pagination.pageNo"
                        :page-sizes="[10 , 20, 30, 50]"
                        :page-size="pagination.pageSize"
                        layout="total, sizes, prev, pager, next, jumper"
                        :page-count="pagination.pages"
                        :total="pagination.total"
                >   
                </el-pagination>
            </div>
        </div>
    </div>
</template>

<script>
    import ImagePreviewer from '@/components/ImagePreviewer/ImagePreviewer.vue';
    import BackTool from '@/components/BackTool'
    import windowResizeMixin from '@/mixins/windowResize';
    import {getTopicAnswerList, getVoteClassListByVoteId} from '@/api/questionnaire';
    import baseMixin from '@/mixins/baseMixin';

    export default {
        name: "questionnaireAnswerResult",
        mixins: [windowResizeMixin, baseMixin],
        data: function() {
            return {
                type: parseInt(this.$route.query.type),
                voteId: this.$route.query.voteId,
                topicId: this.$route.query.topicId,
                sendUserType: parseInt(this.$route.query.sendUserType),
                answerList: [],
                classId: 0,
                classList: []
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
                        this.getTopicAnswerListFunc();
                    })
            } else {
                this.getTopicAnswerListFunc();
            }
        },
        computed: {
            exportUrl: function() {
                const baseHref = global.command === 'production' ? 'https://www.zhxiaoyuan.cn/module-web/' : 'https://www.weixiaojia.net/module-web/';
                return `${baseHref}structure/voteTwo/exportTopicAnswerList?classId=${this.classId}&sendUserType=${this.sendUserType}&topicId=${this.topicId}&schoolYear=${this.$store.getters.selectedSchoolYear}&token=${this.$store.getters.token}`;
            }
        },
        methods: {
            parseFillblank(title) {
                return title.replace(/{(.+?)}/g, (_, content) => {
                    return `<span style="border-bottom: 1px solid #000;">${content}</span>`;
                })
            },
            changeClass() {
                this.pagination.pageNo = 1;
                this.getTopicAnswerListFunc();
            },
            sizeChangeHandler(pageSize) {
                this.pagination.pageSize = pageSize;
                this.pagination.pageNo = 1;
                this.getTopicAnswerListFunc();
            },
            currentChangeHandler(pageNo) {
                this.pagination.pageNo = pageNo;
                this.getTopicAnswerListFunc();
            },
            getTopicAnswerListFunc() {
                getTopicAnswerList({
                    classId: this.classId,
                    pageNo: this.pagination.pageNo,
                    pageSize: this.pagination.pageSize,
                    topicId: this.topicId
                })
                    .then(res => res.data)
                    .then(data => {
                        if(this.type === 11 || this.type === 10) {
                            data.data.dataList.forEach(item => {
                                if(item.topicAnswer && item.topicAnswer !== '[]') {
                                    item.picList = JSON.parse(item.topicAnswer).map(item => ({src: item}));
                                } else {
                                    item.picList = [];
                                }
                            })
                        }
                        if (this.type === 18) {
                            data.data.dataList.forEach(item => {
                                if(!!item.topicAnswer) {
                                    item.topicAnswer = this.$moment(item.topicAnswer).format('YYYY-MM-DD')
                                }
                            })
                        }
                        if (this.type === 19) {
                            data.data.dataList.forEach(item => {
                                if(!!item.topicAnswer) {
                                }
                            });
                        }
                        this.answerList = data.data.dataList;
                        this.pagination.total = data.data.pagination.total;
                        this.pagination.pages = data.data.pagination.pages;
                    })
            }
        },
        components: {
            BackTool,
            ImagePreviewer
        }
    }
</script>

<style lang="scss" scoped>

    @import "../../styles/mixin";
    @include globalstyle;
    .page {
        padding:12px;
    }
    .answer-info-container {
        width: 70%;
        margin: 10px auto 0 auto;
        .question-title {
            text-align: center;
            font-size: 30px;
        }
        .answer-container {
            padding: 0 10px;
        }
        .answer-item {
            padding: 8px;
            border-bottom: 1px solid #ddd;
            .answer-item__user-name {
                text-align: right;
            }
        }
    }
    .pic-container {
        @include clearfix;
        .pic-item {
            @include wh(150px, 150px);
            @include cover-bg;
            float: left;
            margin: 0 10px 10px 0;
        }
    }
    .pagination-container {
        margin-top: 0 !important;
    }
    .answer-container {
        margin: 5px 0 !important;
    }
</style>
