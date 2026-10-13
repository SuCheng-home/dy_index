<template>
    <div class="page homeworkManageReplyList">
        <div class="top"> 
            <el-row >
                        <el-col :span="19">     
                            <el-button @click="$router.back()" type="default" size="medium">返回</el-button>
                            
            <el-button v-if="type === 1&&statis!==1" type="primary"  size="medium" @click="isDialogShow = true">回复</el-button>
            <a :href="exportURL" download="导出结果" target="_blank">
                <el-button v-if="type === 1"  size="medium" type="primary">导出全部</el-button>
            </a>                      
                        </el-col>
                        <el-col :span="5">
                            <el-input v-if="type != 2" placeholder="请输入查询姓名"  size="medium" v-model="searchString" 
                      @keyup.enter.native="searchStringHandler">
                <el-button slot="append" icon="el-icon-search" @click="searchStringHandler"
                           :loading="searchLoading"></el-button>
            </el-input>
                        </el-col>
                    </el-row>
             
      </div>
        <div v-if="type === 0">
            <el-table
                :data="dataList"
                border
                style="width: 100%"
                :height="maxH"
            >
                <el-table-column
                    label="姓名"
                    show-overflow-tooltip
                    :resizable="false"
                    prop="studentName"
                >
                </el-table-column>
                <el-table-column
                    label="阅读时间"
                    align="center"
                    :resizable="false"
                >
                    <template slot-scope="scope">
                        <span>{{scope.row.readTime | formatTime}}</span>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination-container">
                <el-pagination
                    @size-change="sizeChangeHandler"
                    @current-change="currentChangeHandler"
                    :current-page.sync="pageNo"
                    :page-sizes="[10 , 20, 30, 50]"
                    :page-size="pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :page-count="pages"
                    :total="total"
                >
                </el-pagination>
            </div>
        </div>
        <el-table v-if="type === 2"
                  stripe
                  :data="dataList"
                  border
                  style="width: 100%"
                  :height="maxH"
        >
            <el-table-column
                label="姓名"
                show-overflow-tooltip
                :resizable="false"
                prop="studentName"
            >
            </el-table-column>
            <el-table-column
                label="班级"
                align="center"
                :resizable="false"
            >
                <template slot-scope="scope">
                    <span>{{scope.row.className}}</span>
                </template>
            </el-table-column>
        </el-table>
        <div v-if="type === 1">
            <el-table
                :data="dataList"
                border
                style="width: 100%"
                :height="maxH"
            >
                <el-table-column
                    label="姓名"
                    show-overflow-tooltip
                    :resizable="false"
                    prop="createUserName"
                >
                </el-table-column>
                <el-table-column
                    label="内容"
                    show-overflow-tooltip
                    :resizable="false"
                    prop="content"
                >
                </el-table-column>
                <el-table-column
                    label="时间"
                    align="center"
                    :resizable="false"
                >
                    <template slot-scope="scope">
                        <span>{{scope.row.createTime | formatTime}}</span>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination-container">
                <el-pagination
                    @size-change="sizeChangeHandler"
                    @current-change="currentChangeHandler"
                    :current-page.sync="pageNo"
                    :page-sizes="[10 , 20, 30, 50]"
                    :page-size="pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :page-count="pages"
                    :total="total"
                >
                </el-pagination>
            </div>

            <el-dialog title="回复" :visible.sync="isDialogShow" @close="replyContent = ' '">
                <el-input
                    type="textarea"
                    :rows="3"
                    placeholder="请填写回复内容（1-500个字符）"
                    :maxlength="500"
                    v-model="replyContent"
                >
                </el-input>
                <span class="reject-reason-validate-hint">
                    {{ replyContent.length === 500 ? '最多输入500字符' : '' }}
                    {{ replyContent.length === 0 ? '不能为空' : '' }}
                </span>
                <div class="reject-button-container">
                    <el-button type="primary" :loading="replyLoading" @click="confirmClickHandler">确定</el-button>
                    <el-button type="default" :loading="replyLoading" @click="cancelClickHandler">取消</el-button>
                </div>
            </el-dialog>

        </div>
    </div>
</template>

<script>
    import BackTool from '@/components/BackTool';
    import windowResizeMixin from '@/mixins/windowResize';
    import {formatTime} from '@/filters'
    import {getReadList, getReplyPageListByHId, addReplyInfo, getUnReadStudentList} from '@/api/homework';

    export default {
        data: function () {
            return {
                type: Number.parseInt(this.$route.query.type), // 0 已读列表 1 回复列表
                homeworkId: this.$route.query.homeworkId,
                statis:this.$route.query.statis?this.$route.query.statis:0,
                searchString: '',
                pageSize: 20,
                pageNo: 1,
                pages: 1,
                dataList: [],
                total: 0,
                searchLoading: false,
                isDialogShow: false,
                replyContent: ' ',
                replyLoading: false,
                exportURL: `${global.homeworkfetch}structure/homeWork/exportHomeworkReply?homeworkId=${this.$route.query.homeworkId}&schoolTimeId=${sessionStorage.getItem("homeworkschoolTimeId")}&token=${this.$store.getters.token}`
            }
        },
        created: function () {
            if (this.type === 0) {
                this.getReadListHandler()
                    .then((res) => {
                        const data = res.data;
                        if (data.result) {
                            this.dataList = data.data.dataList;
                            this.total = data.data.pagination.total;
                            this.pages = data.data.pagination.pages;
                        } else {
                            this.$message.error('error');
                        }
                    })
                    .catch(() => {
                        this.$message.error('error');
                    });
            } else if (this.type === 1) {
                this.getReplyListHandler()
                    .then((res) => {
                        const data = res.data;
                        if (data.result) {
                            this.dataList = data.data.dataList;
                            this.total = data.data.pagination.total;
                            this.pages = data.data.pagination.pages;
                        } else {
                            this.$message.error('error');
                        }
                    })
                    .catch(() => {
                        this.$message.error('error');
                    });
            } else {

                getUnReadStudentList(this.homeworkId,sessionStorage.getItem("homeworkschoolTimeId"))
                    .then((res) => {
                        const data = res.data;
                        if (data.result) {
                            this.dataList = data.data;
                        } else {
                            this.$message.error('error');
                        }
                    })
                    .catch(() => {
                        this.$message.error('error');
                    });
            }
        },
        methods: {
            getReadListHandler() {
                return getReadList({
                    homeworkId: this.homeworkId,
                    pageSize: this.pageSize,
                    pageNo: this.pageNo,
                    userName: this.searchString
                },sessionStorage.getItem("homeworkschoolTimeId"));
            },
            getReplyListHandler() {
                return getReplyPageListByHId({
                    homeworkId: this.homeworkId,
                    pageSize: this.pageSize,
                    pageNo: this.pageNo,
                    searchName: this.searchString
                },sessionStorage.getItem("homeworkschoolTimeId"));
            },
            searchStringHandler() {
                this.searchString = this.searchString.trim();
                this.searchLoading = true;
                this.pageNo = 1;
                if (this.type === 0) {
                    this.getReadListHandler().then((res) => {
                        this.searchLoading = false;
                        this.dataList = res.data.data.dataList;
                        this.pages = res.data.data.pagination.pages;
                        this.total = res.data.data.pagination.total;
                    }).catch(() => {
                        this.$message.error('error');
                        this.searchLoading = false;
                    });
                } else if (this.type === 1) {
                    this.getReplyListHandler().then((res) => {
                        this.searchLoading = false;
                        this.dataList = res.data.data.dataList;
                        this.pages = res.data.data.pagination.pages;
                        this.total = res.data.data.pagination.total;
                    }).catch(() => {
                        this.$message.error('error');
                        this.searchLoading = false;
                    });
                }
            },
            sizeChangeHandler(pageSize) {
                this.pageNo = 1;
                this.pageSize = pageSize;
                if (this.type === 0) {
                    this.getReadListHandler()
                        .then((res) => {
                            const data = res.data;
                            if (data.result) {
                                this.dataList = data.data.dataList;
                                this.pages = data.data.pagination.pages;
                            } else {
                                this.$message.error('error');
                            }
                        })
                        .catch(() => {
                            this.$message.error('error');
                        });
                } else if (this.type === 1) {
                    this.getReplyListHandler()
                        .then((res) => {
                            const data = res.data;
                            if (data.result) {
                                this.dataList = data.data.dataList;
                                this.pages = data.data.pagination.pages;
                            } else {
                                this.$message.error('error');
                            }
                        })
                        .catch(() => {
                            this.$message.error('error');
                        });
                }
            },
            currentChangeHandler(pageNo) {
                this.pageNo = pageNo;
                if (this.type === 0) {
                    this.getReadListHandler()
                        .then((res) => {
                            const data = res.data;
                            if (data.result) {
                                this.dataList = data.data.dataList;
                            } else {
                                this.$message.error('error');
                            }
                        })
                        .catch(() => {
                            this.$message.error('error');
                        });
                } else if (this.type === 1) {
                    this.getReplyListHandler()
                        .then((res) => {
                            const data = res.data;
                            if (data.result) {
                                this.dataList = data.data.dataList;
                            } else {
                                this.$message.error('error');
                            }
                        })
                        .catch(() => {
                            this.$message.error('error');
                        });
                }
            },

            cancelClickHandler() {
                this.isDialogShow = false;
            },
            confirmClickHandler() {
                this.replyContent = this.replyContent.trim();
                if (this.replyContent.length !== 0) {
                    this.replyLoading = true;
                    addReplyInfo({
                        homeworkId: this.homeworkId,
                        content: this.replyContent
                    },sessionStorage.getItem("homeworkschoolTimeId"))
                        .then((res) => {
                            this.replyLoading = false;
                            const data = res.data;
                            if (data.result) {
                                this.$message.success('回复成功！');
                                this.isDialogShow = false;
                                this.getReplyListHandler()
                                    .then((res) => {
                                        const data = res.data;
                                        if (data.result) {
                                            this.dataList = data.data.dataList;
                                        } else {
                                            this.$message.error('error');
                                        }
                                    })
                                    .catch(() => {
                                        this.$message.error('error');
                                    });
                            }
                        })
                        .catch(() => {
                            this.replyLoading = false;
                            this.isDialogShow = false;
                        });
                }
            },
        },
        filters: {formatTime},
        mixins: [windowResizeMixin],
        components: {
            BackTool
        }
    }
</script>

<style lang="scss">
    .homeworkManageReplyList {
        padding:12px;

        .header {
            padding-bottom: 20px;
        }
        .top{
            padding-bottom: 10px;
        }

        .search-input {
            margin-left: 10px;
            width: 220px;
        }

        .reject-container li {
            margin-bottom: 5px;
            border-bottom: 1px solid #e7eaec;
            padding: 10px 0;

            .reject-info {
                font-size: 13px;
                text-align: right
            }
        }

        textarea.reject-reason {
            width: 100%;
            height: 100px;
        }

        .reject-reason-validate-hint {
            height: 20px;
            line-height: 20px;
            color: #ff0000;
        }

        .reject-button-container {
            margin-top: 10px;
            text-align: right;
        }
    }
</style>
