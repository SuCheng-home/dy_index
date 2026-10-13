<!--用户已发送通知列表-->
<template>
    <div id="noticeIndex" class="app-container calendar-list-container">
        <backtool>
            <a :href="exportUrl" target="_blank" download="导出" v-if="dataList.length">
                <el-button type="primary" size="medium">导出</el-button>
            </a>
            <el-input class="search-input search-input--right" size="medium"
                      placeholder="请输入老师姓名" icon="el-icon-search" @keyup.enter.native="handleInputChange"
                      v-model="teacherUserName">
                <el-button slot="append" icon="el-icon-search" @click="handleInputChange"></el-button>
            </el-input>
        </backtool>
        <el-tabs v-model="activeName" @tab-click="tabsfun()" v-if="hasOpt && hasQues">
            <el-tab-pane label="学科-题目" name="1">
            </el-tab-pane>
            <el-tab-pane label="学科-选项" name="2"></el-tab-pane>
        </el-tabs>
        <el-table stripe :data="dataList" border fit highlight-current-row
                  style="width: 100%" :height="hasOpt && hasQues ? (maxH - 40) : maxH"
        >
            <el-table-column
                label="任课老师"
                align="center"
            >
                <template slot-scope="scope">
                    <span class="text-btn"
                          @click="jumpToPage('evTeaAccountingByQuesDetail', {teacherUserId: scope.row.tempTeacherId, batchId})">
                        {{scope.row.tempTeacherName}}
                    </span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="投票数" prop="stuCount">
            </el-table-column>
            <el-table-column align="center" label="投票人数" prop="peopleCount">
            </el-table-column>
            <el-table-column show-overflow-tooltip align="center" :label="`选项${optionIndex + 1}`"
                             v-for="(optionNum, optionIndex) in opionNumList">
                <template slot-scope="scope">
                    <span>{{scope.row.voteCountList[optionIndex]}}</span> /
                    <span>{{scope.row.voteCountList[optionIndex] == 0 ? '--' : `${(scope.row.voteCountList[optionIndex] / scope.row.stuCount * 100).toFixed(2)}%`}}</span>
                </template>
            </el-table-column>
        </el-table>
        <div class="pagination-container">
            <el-pagination
                @size-change="sizeChangeHandler"
                @current-change="currentChangeHandler"
                :current-page.sync="pagination.pageNo" :page-sizes="[10,20,30, 50]"
                :page-size.sync="pagination.pageSize" layout="total, sizes, prev, pager, next, jumper"
                :total="pagination.total">
            </el-pagination>
        </div>
    </div>
</template>

<script>
    import _ from "lodash";
    import mixin from '@/mixins/windowResize';
    import baseMixin from '@/mixins/baseMixin';
    import {isShowByPermission} from '@/utils';
    import {
        getEvaluateCurrTopicStaticList,
    } from '@/api/evTea';

    export default {
        data() {
            return {
                dataList: [],
                opionNumList: [],
                studentName: '',
                batchId: this.$route.query.batchId,
                teacherUserName: '',
                currentTopicItem: {},
                currentTopicDetail: [],
                isShowDetail: false,
                activeName: '1',
                hasQues: this.$route.query.hasQues == 1,
                hasOpt: this.$route.query.hasOpt == 1,

            }
        },
        created() {
            this.getList();
        },
        mixins: [mixin, baseMixin],
        filters: {
            trimTime(datetime) {
                return datetime ? datetime.slice(0, datetime.lastIndexOf('.')) : '--';
            }
        },
        computed: {
            exportUrl() {
                return `${global.BasePath}structure/evaluateTw/exportEvaluateCurrTopicStaticList?batchId=${this.batchId}&token=${this.$store.getters.token}&teacherUserName=${this.teacherUserName}`
            }
        },
        methods: {
            isShowByPermission,
            tabsfun() {
                if (this.activeName == '1') {
                    this.$router.replace({
                        path: 'evTeaAccountingByQues', query: {
                            batchId: this.batchId,
                            hasQues: this.hasQues ? 1 : 0,
                            hasOpt: this.hasOpt ? 1 : 0
                        }
                    });
                } else if (this.activeName == '2') {
                    this.$router.push({
                        path: 'evTeaAccountingByOpt', query: {
                            batchId: this.batchId,
                            hasQues: this.hasQues ? 1 : 0,
                            hasOpt: this.hasOpt ? 1 : 0
                        }
                    });
                }
            },
            handleInputChange: _.debounce(
                function () {
                    this.getList();
                },
                500
            ),
            getList() {
                getEvaluateCurrTopicStaticList({
                    batchId: this.batchId,
                    teacherUserName: this.teacherUserName,
                    pageNo: this.pagination.pageNo,
                    pageSize: this.pagination.pageSize
                })
                    .then(res => res.data)
                    .then(data => {
                        const pageData = data.data;
                        if (pageData.dataList && pageData.dataList.length !== 0) {
                            this.opionNumList = pageData.dataList[0].voteCountList;
                        }
                        this.dataList = pageData.dataList;
                        this.pagination.total = pageData.pagination.total;
                    })
            },
            sizeChangeHandler(pageSize) {
                this.pageSize = pageSize;
                this.pageNo = 1;
                this.getList();
            },
            currentChangeHandler(pageNo) {
                this.pageNo = pageNo;
                this.getList();
            },
            jumpToPage(path, query = {}) {
                this.$router.push({
                    path,
                    query
                })
            }
        }
    }
</script>
<style lang="scss">
    .pagination-container {
        margin-top: 10px;
    }

    .el-icon-paperclip {
        margin-right: 3px;
    }

    .text-btn {
        color: #409EFF;
        cursor: pointer;
    }

    .ques-detail {
        margin-bottom: 10px;
    }
</style>
