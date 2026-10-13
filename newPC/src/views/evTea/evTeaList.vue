<!--用户已发送通知列表-->
<template>
    <div id="evTeaList" class="app-container calendar-list-container">
        <div class="filter-container">
            <el-row>
                <el-col :span="19">
                    <div class="btns">
                        <el-button type="primary" size="medium" v-if="isShowByPermission('/evaluateTw/evaluateTwManger')" @click="jumpToPage('evTeaAddEdit')">创建评教评学</el-button>
                    </div>
                </el-col>
                <el-col :span="5">
                    <el-input size="medium"
                              placeholder="请输入主题搜索" icon="el-icon-search" @keyup.enter.native="handleFilter"
                              v-model="batchTitle">
                        <el-button slot="append" icon="el-icon-search" @click="handleFilter"></el-button>
                    </el-input>
                </el-col>
            </el-row>
        </div>
        <el-table stripe :data="dataList" border fit highlight-current-row
                  style="width: 100%" :height="maxH">
            <el-table-column align="center" label="主题" show-overflow-tooltip>
                <template slot-scope="scope">
                    <span class="link-type" @click="jumpToPage('evTeaDetail', {id: scope.row.id})">
                        {{scope.row.batchTitle}}
                    </span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="范围" show-overflow-tooltip>
                <template slot-scope="scope">
                    <span v-for="scopeItem in scope.row.stuScopeText">{{scopeItem }}&nbsp;&nbsp;&nbsp;&nbsp;</span>
                </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip align="center" prop="createUserName" label="创建人">
            </el-table-column>
            <el-table-column show-overflow-tooltip align="center" label="发布时间">
                <template slot-scope="scope">
                    <template>
                        <span>{{scope.row.createTime | trimTime}}</span>
                    </template>
                </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip align="center" label="截止时间">
                <template slot-scope="scope">
                    <template>
                        <span>{{scope.row.deadline | trimTimeMinute}}</span>
                    </template>
                </template>
            </el-table-column>
            <el-table-column class-name="status-col" align="center" label="状态">
                <template slot-scope="scope">
                    <el-tag  size="mini" v-if="scope.row.state == 1">未发布</el-tag>
                    <el-tag  size="mini" type="success" v-else>已发布</el-tag>
                </template>
            </el-table-column>

            <el-table-column align="center" label="操作" v-if="isShowByPermission('/evaluateTw/evaluateTwManger')">
                <template slot-scope="scope">
                    <el-button size="small" type="text" :disabled="scope.row.noticeState===2||scope.row.isSendOntime==2"
                               @click="jumpToPage('evTeaAddEdit', {id: scope.row.id})">编辑
                    </el-button>
                    <el-button  size="small" type="text"
                               @click.native="delNoticeList(scope.row.id)" class="buttontextred">删除
                    </el-button>
                </template>
            </el-table-column>

        </el-table>
        <div class="pagination-container">
            <el-pagination
                @size-change="sizeChangeHandler"
                @current-change="currentChangeHandler"
                :current-page.sync="pagination.pageNo"
                :page-sizes="[10 , 20, 30, 50]"
                :page-size="pagination.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="pagination.total"
            >
            </el-pagination>
        </div>
    </div>
</template>

<script>
    import debounce from 'lodash/debounce';
    import mixin from '@/mixins/windowResize';
    import baseMixin from '@/mixins/baseMixin';
    import {isShowByPermission} from '@/utils';
    import {
        getEvaluateTwBatchList,
        delEvaluateTwBatch
    } from '@/api/evTea';
    export default {
        data() {
            return {
                dataList: [],
                batchTitle: '',
                tableKey: 0,
            }
        },
        created() {
            this.getList();
        },
        mixins: [mixin, baseMixin],
        filters: {
            statusFilter(status) {
                const statusMap = {
                    published: 'success',
                    draft: 'gray',
                    deleted: 'danger'
                };
                return statusMap[status]
            },
            trimTime(datetime) {
                return datetime ? datetime.slice(0, datetime.lastIndexOf('.')) : '--';
            },
            trimTimeMinute(datetime) {
                return datetime ? datetime.slice(0, datetime.lastIndexOf(':')) : '--';
            }
        },
        methods: {
            isShowByPermission,
            getList() {
                getEvaluateTwBatchList({
                    pageNo: this.pagination.pageNo,
                    pageSize: this.pagination.pageSize,
                    batchTitle: this.batchTitle
                })
                    .then(res => res.data)
                    .then(data => {
                        data.data.dataList.forEach(item => {
                            item.stuScopeText = JSON.parse(item.stuScope).map(item => item.className);
                        });
                        this.dataList = data.data.dataList;
                        this.pagination.total = data.data.pagination.total;
                    })
            },
            delNoticeList(id) {
                this.$confirm('是否确定删除该评教评学?', '删除', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    delEvaluateTwBatch({
                        batchId: id
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
            handleFilter: debounce(function () {
                this.pagination.pageNo = 1;
                this.getList();
            }, 500),
            sizeChangeHandler(pageSize) {
                this.pagination.pageSize = pageSize;
                this.pagination.pageNo = 1;
                this.getList();
            },
            currentChangeHandler(pageNo) {
                this.pagination.pageNo = pageNo;
                this.getList();            },
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
    @import "../../styles/mixin";
    #evTeaList {
        .pagination-container {
            margin-top: 10px;
        }
        .el-icon-paperclip {
            margin-right: 3px;
        }
        .filter-container {
            @include clearfix;
        }
        .btns {
            height: 36px;
        }
    }

</style>
