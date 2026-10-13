<template>
    <div class="yaxingList" id="yaxingList">
        <div class="header">
            <el-button type="primary" size="medium"   @click="jumpToPage('yaxingAddEdit')">新增</el-button>

            <el-input placeholder="请输入标题" size="medium" v-model="searchTitle" class="search-input search-input--right"
                      @keyup.enter.native="searchTitleHandler">
                <el-button slot="append" icon="el-icon-search" @click="searchTitleHandler"></el-button>
            </el-input>
        </div>
        <div class="leaveList">
            <el-table stripe :data="dataList" border fit highlight-current-row style="width: 100%"
                      :height="maxH">
                <el-table-column align="center" label="标题" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span class="link-type" @click="jumpToPage('yaxingDetail', {id: scope.row.id})">{{scope.row.title}}</span>
                        <span></span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="创建时间" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span>{{scope.row.createTime | timeSuffixFilter}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="状态" show-overflow-tooltip>
                    <template slot-scope="scope">
                        &nbsp;&nbsp;<el-tag  size="mini" v-if="scope.row.state == 1">草稿</el-tag>
                        <el-tag  size="mini" v-else type="success">已发布</el-tag>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="操作" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <el-button
                            size="small"
                            type="text"
                            @click="jumpToPage('yaxingAddEdit', {id: scope.row.id})">编辑
                        </el-button>
                        <el-button
                            size="small"
                            type="text"
                            @click="deleteHandler(scope.row.id)" class="buttontextred">删除
                        </el-button>
                        <el-button
                            size="small"
                            type="text"
                            :disabled="scope.row.state != 1"
                            @click="publishHandler(scope.row.id)">发布
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination-container">
                <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                               :current-page.sync="pagination.pageNo" :page-sizes="[10, 20, 30, 50]"
                               :page-size.sync="pagination.pageSize" layout="total, sizes, prev, pager, next, jumper"
                               :total="pagination.total">
                </el-pagination>
            </div>
        </div>
    </div>
</template>

<script>
    import mixin from '@/mixins/windowResize';
    import baseMixin from '@/mixins/baseMixin';

    import {
        listByModelAndPage,
        publishYaxing,
        deleteYaxing
    } from '@/api/yaxing';
    export default {
        name: "yaxingList",
        data() {
            return {
                searchTitle: '',
                type: this.$route.params.type,
                dataList: []
            }
        },
        watch: {
            '$route.params.type'(type) {
                if(type && type != this.type) {
                    this.type = type;
                    this.listByModelAndPageFunc();
                }
            }
        },
        mixins: [baseMixin, mixin],
        mounted() {
            this.listByModelAndPageFunc();
        },
        methods: {
            listByModelAndPageFunc() {
                listByModelAndPage({
                    pageNo: this.pagination.pageNo,
                    pageSize: this.pagination.pageSize,
                    state: '',
                    type: this.type,
                    title: this.searchTitle
                })
                    .then(res => res.data)
                    .then(data => {
                        this.dataList = data.data.dataList;
                        this.pagination.total = data.data.pagination.total;
                    })
            },
            searchTitleHandler() {
                this.pagination.pageNo = 1;
                this.listByModelAndPageFunc();
            },
            handleSizeChange() {
                this.pagination.pageNo = 1;
                this.listByModelAndPageFunc();
            },
            handleCurrentChange() {
                this.listByModelAndPageFunc();
            },
            deleteHandler(id) {
                this.$confirm('确认删除该条目吗？', '删除', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    deleteYaxing({
                        id
                    })
                        .then(res => res.data)
                        .then(data => {
                            if(data.result) {
                                this.$message.success('删除成功');
                                this.listByModelAndPageFunc();
                            } else {
                                this.$message.error(data.msg);
                            }
                        })
                        .catch(error => {
                            this.$message.error(error);
                        })
                });
            },
            publishHandler(id) {
                this.$confirm('确认发布该条目吗？', '删除', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    publishYaxing({
                        id
                    })
                        .then(res => res.data)
                        .then(data => {
                            if(data.result) {
                                this.$message.success('发布成功');
                                this.listByModelAndPageFunc();
                            } else {
                                this.$message.error(data.msg);
                            }
                        })
                        .catch(error => {
                            this.$message.error(error);
                        })
                });
            }
        }
    }
</script>

<style lang="scss" scoped>
    #yaxingList {
        padding:12px;
        box-sizing: border-box;
        .header {
            margin-bottom: 10px;
            font-size:14px;
            .el-input{
                width:auto;
            }
        }
        .search-input {
            float: right;
        }
    }

</style>
