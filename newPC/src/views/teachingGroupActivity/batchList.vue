<template>
    <div id="teacherCommentIndex" class="app-container calendar-list-container">
        <div class="filter-container">
            <el-row>
                <el-col :span="19">
                    <el-button type="primary" size="medium" @click="jumpToPage('batchAddEdit')">新增批次</el-button>
                    <el-button type="danger" size="medium" @click="batchDeleteHandler">删除</el-button>
                </el-col>
                <el-col :span="5">
                    <el-input size="medium" placeholder="请输入内容" v-model.trim="searchTitle"
                              @keyup.enter.native="handleSizeChange">
                        <el-button slot="append" icon="el-icon-search" @click="handleSizeChange"></el-button>
                    </el-input>
                </el-col>
            </el-row>
        </div>
        <el-table stripe :data="dataList" border fit highlight-current-row
                  @select="selectionChangeHandler"
                  @select-all="selectionChangeHandler"
                  style="width: 100%" :height="maxH">
            <el-table-column align="center"
                             type="selection"
                             width="55">
            </el-table-column>
            <el-table-column label="学期" show-overflow-tooltip prop="termName">
            </el-table-column>
            <el-table-column align="center" label="批次名称">
                <template slot-scope="scope">
                    <span class="link" @click="jumpToPage('batchDetail', {id: scope.row.id})">
                        {{scope.row.batchName}}
                    </span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="创建人" prop="createUserName">
            </el-table-column>
            <el-table-column align="center" label="创建时间" prop="createTime">
            </el-table-column>
            <el-table-column align="center" label="状态">
                <template slot-scope="scope">
                    aa
                </template>
            </el-table-column>
            <el-table-column align="center" label="操作" width="150px">
                <template slot-scope="scope">
                    <el-button size="small" type="text"
                               @click.native="jumpToPage('batchAddEdit', {id: scope.row.id})">编辑
                    </el-button>
                    <el-button size="small" type="text"
                               @click.native="batchDelete(scope.row.id)">删除
                    </el-button>
                </template>
            </el-table-column>

        </el-table>
        <div class="pagination-container">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                           :current-page.sync="pagination.pageNo" :page-sizes="[10,20,30, 50]"
                           :page-size="pagination.pageSize" layout="total, sizes, prev, pager, next, jumper"
                           :total="pagination.total">
            </el-pagination>
        </div>
    </div>
</template>

<script>
    import {
        queryTeacherComment,
        batchDeleteTeacherComment,
    } from '@/api/teacherComment';
    import mixin from '@/mixins/windowResize';
    import baseMixin from '@/mixins/baseMixin';

    export default {
        name: 'teachingGroupActivityBatchList',
        mixins: [mixin, baseMixin],
        data() {
            return {
                dataList: [{
                    termName: '2021-2022学年第2学期',
                    batchName: '批次名称',
                    createUserName: '创建人',
                    createTime: 'aaa',
                    state: 1,
                    id: 1
                }],

                searchTitle: ''
            }
        },
        created() {
            // this.queryTeacherCommentFunc();
        },
        methods: {
            selectionChangeHandler(selection) {
                this.selected = selection;
            },
            queryTeacherCommentFunc() {
                queryTeacherComment({
                    pageNo: this.pagination.pageNo,
                    pageSize: this.pagination.pageSize,
                    searchName: ''
                })
                    .then(res => res.data)
                    .then(data => {

                        this.dataList = data.data.dataList;
                        this.pagination.total = data.data.pagination.total;
                    })
            },
            handleSizeChange(val){
                this.pagination.pageNo = 1;
                this.pagination.pageSize = val;
                this.queryTeacherCommentFunc();
            },
            handleCurrentChange(val){
                this.pagination.pageNo = val;
                this.queryTeacherCommentFunc();
            },
            batchDeleteHandler() {
                if(!this.selected || this.selected.length == 0) {
                    this.$message.error('请选择要删除的批次');
                } else {
                    this.batchDelete(this.selected.map(item => item.id).join(','))
                        .then(() => {
                            this.selected = [];
                        });
                }
            },
            batchDelete(ids) {
                this.$confirm(`是否要删除${`${ids}`.includes(',') ? '选中的' : '该'}批次`,  '删除', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    return batchDeleteTeacherComment({
                        ids
                    })
                        .then(res => res.data)
                        .then(data => {
                            if(data.result) {
                                this.$message.success('删除成功');
                                this.queryTeacherCommentFunc();
                            } else {
                                this.$message.error(data.msg);
                            }
                        })
                });

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
