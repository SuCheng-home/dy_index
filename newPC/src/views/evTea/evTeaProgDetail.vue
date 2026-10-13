<!--用户已发送通知列表-->
<template>
    <div id="noticeIndex" class="app-container calendar-list-container">
        <backtool>
            <el-button type="primary" size="medium" @click="notifyAll">提醒未上报</el-button>
            <el-select v-model="isVote" @change="getList">
                <el-option :value="0" label="全部评价状态"></el-option>
                <el-option :value="2" label="已评"></el-option>
                <el-option :value="1" label="未评"></el-option>
            </el-select>
            <el-input class="search-input search-input--right" size="medium"
                      placeholder="姓名搜索" icon="el-icon-search" @keyup.enter.native="handleFilter"
                      v-model="studentName">
                <el-button slot="append" icon="el-icon-search" @click="handleFilter"></el-button>
            </el-input>
        </backtool>
        <el-table stripe :data="dataList" border fit highlight-current-row
                  style="width: 100%" :height="maxH"
                  @select="selectionChangeHandler"
                  @select-all="selectionChangeHandler"
        >
            <el-table-column align="center" label="学生姓名" show-overflow-tooltip>
                <template slot-scope="scope">
                    {{scope.row.studentName}}
                </template>
            </el-table-column>
            <el-table-column align="center" label="班级" prop="className">
            </el-table-column>
            <el-table-column show-overflow-tooltip align="center" label="评教人">
                <template slot-scope="scope">
                    <span>{{scope.row.createUserName || '--'}}</span>
                </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip align="center" label="评教时间">
                <template slot-scope="scope">
                    <span v-if="scope.row.voteTime">{{scope.row.voteTime | trimTime}}</span>
                    <span v-else>--</span>
                </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip align="center" label="评教状态">
                <template slot-scope="scope">
                    <template>
                        <el-tag  size="mini" v-if="scope.row.isVote == 1 || scope.row.isVote == 3">未评</el-tag>
                        <el-tag  size="mini" type="success" v-else>已评</el-tag>
                    </template>
                </template>
            </el-table-column>

            <el-table-column align="center" label="操作">
                <template slot-scope="scope">
                    <el-button size="small" type="text"
                               :disabled="!!scope.row.voteTime"
                               @click.native="remindToStuParentFunc(scope.row.studentId)">提醒
                    </el-button>
                    <el-button size="small" type="text" v-if=" scope.row.isVote == 2&&isShowByPermission('/evaluateTw/evaluateTwManger')"
                               @click.native="resetEvaluateTwBatchUser(scope.row.studentId)">重置
                    </el-button>
                    <el-button size="small" type="text" v-if="isShowByPermission('/evaluateTw/evaluateTwManger')" class="buttontextred" @click.native="delEvaluateTwBatchUser(scope.row.studentId)">删除
                    </el-button>
                </template>
            </el-table-column>

        </el-table>
    </div>
</template>

<script>
    import debounce from 'lodash/debounce';
    import mixin from '@/mixins/windowResize';
    import baseMixin from '@/mixins/baseMixin';
    import {isShowByPermission} from '@/utils';
    import {
        getEvaluateTwBatchUserList,
        remindToStuParent,delEvaluateTwBatchUser,resetEvaluateTwBatchUser
    } from '@/api/evTea';

    export default {
        data() {
            return {
                dataList: [],
                studentName: '',
                id: this.$route.query.id,
                batchTitle: this.$route.query.batchTitle,
                classId: this.$route.query.classId,
                isVote: 0,
                selected: []
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
        methods: {
              resetEvaluateTwBatchUser(studentId) {
                this.$confirm('是否重置?', '重置', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    resetEvaluateTwBatchUser({
                        batchId:this.$route.query.id,
                        studentId:studentId
                    })
                        .then(res => res.data)
                        .then(data => {
                            if(data.result) {
                                this.$message.success('重置成功');
                                this.getList();
                            } else {
                                this.$message.error(data.msg);
                            }
                        })
                }).catch(() => {
                });
            },
             delEvaluateTwBatchUser(studentId) {
                this.$confirm('是否删除?', '删除', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    delEvaluateTwBatchUser({
                        batchId:this.$route.query.id,
                        studentId:studentId
                    })
                        .then(res => res.data)
                        .then(data => {
                            if(data.result) {
                                this.$message.success('删除成功');
                                this.getList();
                            } else {
                                this.$message.error(data.msg);
                            }
                        })
                }).catch(() => {
                });
            },
            isShowByPermission,
            notifyAll() {
                this.remindToStuParentFunc(0);
            },
            selectable(row) {
                return !row.voteDate;
            },
            selectionChangeHandler(selection) {
                this.selected = selection;
            },
            getList() {
                getEvaluateTwBatchUserList({
                    batchId: this.id,
                    classId: this.classId,
                    studentName: this.studentName,
                    isVote: this.isVote
                })
                    .then(res => res.data)
                    .then(data => {
                        this.dataList = data.data;
                    })
            },
            remindToStuParentFunc(studentId) {
                remindToStuParent({
                    batchId: this.id,
                    batchTitle: this.batchTitle,
                    classId: this.classId,
                    studentId
                })
                    .then(res => res.data)
                    .then(data => {
                        if(data.result) {
                            this.$message.success('提醒成功');
                        }
                    });
            },
           
            handleFilter: debounce(function () {
                this.getList();
            }, 500),
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
</style>
