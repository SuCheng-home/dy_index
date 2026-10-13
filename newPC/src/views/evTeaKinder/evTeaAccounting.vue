<!--用户已发送通知列表-->
<template>
    <div class="app-container calendar-list-container">
        <backtool>
            <a :href="tableExportURL" download="导出" target="_blank">
                <el-button class="filter-item" type="primary" size="medium" icon="upload">导出</el-button>
            </a>
            <div class="batch-list">
                <el-tabs v-model="templateId" @tab-click="onTabClick">
                    <el-tab-pane :label="tempItem.tempTitle" :name="tempItem.id"
                                 v-for="(tempItem, index) in [...templateList, ...classTemplateList]">
                    </el-tab-pane>

                </el-tabs>
            </div>
            <el-input v-if="dataList && dataList[0] && dataList[0].tempTeacherName" class="search-input search-input--right" size="medium" placeholder="请输入教师姓名"
                      v-model="teacherUserName"
                      @keyup.enter.native="handleInputChange">
                <el-button slot="append" size="medium" icon="el-icon-search" @click="handleInputChange"></el-button>
            </el-input>
        </backtool>
        <el-table stripe :data="dataList" border highlight-current-row ref="table"
                  style="width: 100%" :height="maxH"
        >
            <el-table-column
                :resizable="false"
                label="老师姓名"
                align="center"
                v-if="dataList && dataList[0] && dataList[0].tempTeacherName"
                fixed
                key="c1"
            >
                <template slot-scope="scope">
                    {{scope.row.tempTeacherName}}
                </template>
            </el-table-column>
            <el-table-column
                label="班级"
                align="center"
                :resizable="false"
                key="c2"
                fixed
                prop="className"
            >
            </el-table-column>
            <el-table-column key="c3" align="center" label="班级总人数" prop="stuCount" :resizable="false">
            </el-table-column>
            <el-table-column key="c4" align="center" label="参评人数" prop="voteCount" :resizable="false">
            </el-table-column>
            <template v-for="(titleItem, titleIndex) in titleList">
                <el-table-column :key="`ans${titleIndex}`" :resizable="false" show-overflow-tooltip align="center"
                                 :label="`题目${titleItem.topicNum}`" v-if="titleItem.topicType == 5">
                    <template slot-scope="scope">
                        <div class="text-btn" @click="showDetail(scope.row.topicList[titleIndex], scope.row)">
                            查看
                        </div>
                    </template>
                </el-table-column>
                <el-table-column :key="`opt${titleIndex}`" :resizable="false" show-overflow-tooltip align="center"
                                 :label="`题目${titleItem.topicNum}`" v-else>
                    <el-table-column
                        :resizable="false"
                        :key="`opt{optionIndex}`"
                        prop="province"
                        :label="`选项${optionItem.optionNum}`"
                        v-for="(optionItem, optionIndex) in titleItem.optionList"
                    >
                        <template slot-scope="scope">
                            <div v-if="scope.row.voteCount">
                                {{scope.row.topicList[titleIndex].optionList[optionIndex].voteCount}}/{{parseInt(scope.row.topicList[titleIndex].optionList[optionIndex].voteCount
                                / scope.row.voteCount * 10000) / 100}}%
                            </div>
                            <div v-else>
                                0/0%
                            </div>
                        </template>
                    </el-table-column>
                </el-table-column>
            </template>
        </el-table>
        <div  class="pagination-container">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                           :current-page.sync="pagination.pageNo" :page-sizes="[10,20,30, 50]"
                           :page-size="pagination.pageSize" layout="total, sizes, prev, pager, next, jumper"
                           :total="pagination.total">
            </el-pagination>
        </div>
        <el-dialog :title="'问答题'" :visible.sync="isShowDetail" size="tiny"
                   width="800px"
                   :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false">
            <div class="ques-detail">
                当前题目：题目{{currentTopicItem.topicNum}}
            </div>
            <div>
                <el-table stripe :data="currentTopicDetail" border fit highlight-current-row
                          style="width: 100%" :height="400"
                >
                    <el-table-column
                        type="index"
                        label="序号"
                        align="center"
                        width="100">
                    </el-table-column>
                    <el-table-column align="center" label="答案文本" show-overflow-tooltip prop="optionAnswer">
                        <template slot-scope="scope">
                            {{ scope.row.topicAnswer}}
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="isShowDetail = false" size="medium">取 消</el-button>
                <a :href="exportUrl" target="_blank" download="问答题统计"
                   v-if="currentTopicItem.topicType == 5">
                    <el-button type="primary" size="medium">导出</el-button>
                </a>
                <el-button type="primary" @click="isShowDetail= false" size="medium">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import mixin from '@/mixins/windowResize';
    import baseMixin from '@/mixins/baseMixin';
    import {isShowByPermission} from '@/utils';
    import {
        getEvaluateStaticThList,
        getEvaluateTwBatch,
        getEvaluateStaticInfoList
    } from '@/api/evTeaKinder';

    export default {
        data() {
            return {
                dataList: [],
                titleList: [],
                batchId: this.$route.query.batchId,
                isVote: 0,
                classIds: [],
                allClassList: [],
                currentTopicItem: {},
                currentTopicDetail: [],
                isShowDetail: false,
                exportUrl: '',
                anonymous: 1,
                templateList: [],
                classTemplateList: [],
                templateId: this.$route.query.batchTempId || '',
                teacherUserName: '',
            }
        },
        mounted() {
            this.templateId = this.$route.query.batchTempId || '';

            getEvaluateTwBatch({
                batchId: this.batchId
            })
                .then(res => res.data)
                .then(data => {

                    const pageData = data.data;
                    this.anonymous = data.data.anonymous;
                    const templateList = JSON.parse(pageData.tempJson);
                    this.templateList = templateList;
                    const classTemplateList = JSON.parse(pageData.tempClassJson);
                    this.classTemplateList = classTemplateList;
                    if (templateList.length !== 0) {
                        if(!this.templateId) {
                            this.templateId = templateList[0].id;
                        }
                        this.getList();
                    } else if(classTemplateList.length !== 0) {
                        if(!this.templateId) {
                            this.templateId = classTemplateList[0].id;
                        }
                        this.getList();
                    }
                });
            setTimeout(() => {
                this.$refs.table.doLayout();
            }, 400);
        },
        activated() {
            setTimeout(() => {
                this.$refs.table.doLayout();
            }, 400);
        },
        computed: {
            tableExportURL() {
                const prefix = global.command === 'production' ? 'https://www.xjleyuan.com/growth-web/' : 'https://www.xwweixiao.com/growth-web/';
                return `${prefix}structure/evaluateTw/exportEvaluateStaticThList?` +
                    `batchId=${this.batchId}&batchTempId=${this.templateId}&teacherUserName=${this.teacherUserName}&token=${this.$store.getters.token}`;
            }
        },
        mixins: [mixin, baseMixin],
        filters: {
            trimTime(datetime) {
                return datetime ? datetime.slice(0, datetime.lastIndexOf('.')) : '--';
            }
        },
        methods: {
            isShowByPermission,
            handleInputChange() {
                this.pagination.pageNo = 1;
                this.getList();
            },
            onTabClick(item) {
                this.templateId = item.name;
                this.getList();
            },
            showDetail(topicItem, item) {
                const prefixUrl = global.command === 'production' ? 'https://www.xjleyuan.com/growth-web/' : 'https://www.xwweixiao.com/growth-web/';
                this.exportUrl = `${prefixUrl}structure/evaluateTw/exprotEvaluateStaticInfoList?` +
                    `batchId=${this.batchId}&batchTempId=${this.templateId}&classId=${item.classId}&teacherUserId=${item.tempTeacherId}&topicNum=${topicItem.topicNum}&topicType=${topicItem.topicType}&optionNum=0` +
                    `&token=${this.$store.getters.token}`;

                getEvaluateStaticInfoList({
                    batchId: this.batchId,
                    batchTempId: this.templateId,
                    classId: item.classId,
                    teacherUserId: item.tempTeacherId,
                    topicNum: topicItem.topicNum,
                    topicType: topicItem.topicType,
                    optionNum: 0
                })
                    .then(res => res.data)
                    .then(data => {
                        this.currentTopicItem = topicItem;
                        this.currentTopicDetail = data.data;
                        this.isShowDetail = true;
                    })
            },
            selectable(row) {
                return !row.voteDate;
            },
            getList() {
                getEvaluateStaticThList({
                    batchId: this.batchId,
                    batchTempId: this.templateId,
                    pageNo: this.pagination.pageNo,
                    pageSize: this.pagination.pageSize,
                    teacherUserName: this.teacherUserName,
                })
                    .then(res => res.data)
                    .then(data => {
                        this.dataList = data.data.dataList;
                        this.titleList = data.data.titleList;
                        this.pagination.total = data.data.pagination.total;
                        setTimeout(() => {
                            this.$refs.table.doLayout();
                        }, 400);
                    })
            },
            sizeChangeHandler(pageSize) {
                this.pagination.pageSize = pageSize;
                this.pagination.pageNo = 1;
                this.getList();
            },
            currentChangeHandler(pageNo) {
                this.pagination.pageNo = pageNo;
                this.getList();
            },
            jumpToPage(path, query = {}) {
                this.$router.push({
                    path,
                    query
                })
            },
            handleSizeChange(val) {
                this.pagination.pageSize = val;
                this.getList();
            },
            handleCurrentChange(val) {
                this.pagination.pageNo = val;
                this.getList();
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

    .batch-list {
        display: inline-block;
        vertical-align: middle;
        margin-left: 10px;
        height: 36px;
        line-height: 36px;
        margin-top: -5px;
    }
</style>
