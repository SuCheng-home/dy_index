<template>
    <div class="page">
        <div class="header">
            <el-row>
                <el-col :span="19">
                    <el-button size="medium" type="danger" @click="batchDeleteHandler" :loading="deleteLoading">删除</el-button>
                </el-col>
                <el-col :span="5">
                    <el-input placeholder="请输入新闻标题" v-model.trim="searchName" size="medium" 
                      @keyup.enter.native="searchNameHandler">
                        <el-button  slot="append" icon="el-icon-search" @click="searchNameHandler"
                                :loading="searchLoading"></el-button>
                    </el-input>
                </el-col>
            </el-row>
        </div>
        <div>
            <el-table
                    ref="multipleTable"
                    :data="dataList"
                    border
                    style="width: 100%"
                    @select="selectionChangeHandler"
                    @select-all="selectionChangeHandler"
                    :height="maxH"
            >
                <el-table-column
                        type="selection"
                        align="center"
                        width="65px"
                        :resizable="false"
                >
                </el-table-column>
                <el-table-column
                        label="新闻标题"
                        show-overflow-tooltip
                        :resizable="false"
                >
                    <template slot-scope="scope">
                        <router-link class="link-type"
                                     :to="{ path: 'newsApprovalDetail', query: { newsId: scope.row.id } }">
                            {{ scope.row.title }}
                        </router-link>
                    </template>
                </el-table-column>
                <el-table-column
                        label="创建时间"
                        align="center"
                        width="180px"
                        :resizable="false"
                >
                    <template slot-scope="scope">
                        <span>{{scope.row.createTime | trimTime}}</span>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="createUser"
                        label="创建人"
                        align="center"
                        width="120px"
                        :resizable="false"
                >
                </el-table-column>
                <el-table-column
                        label="状态"
                        align="center"
                        width="120px"
                        :resizable="false"
                >
                    <template slot-scope="scope">
                        <el-tag  size="mini" :type="scope.row.state | stateToType">{{ scope.row.state | stateToText }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column
                        label="操作"
                        align="center"
                        width="200px"
                        :resizable="false"
                >
                    <template slot-scope="scope">
                        <el-button size="small" type="text" @click="deleteHandler(scope.$index, scope.row)" class="buttontextred">删除
                        </el-button>
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
                        :total="total"
                >
                </el-pagination>
            </div>
        </div>
    </div>
</template>

<script>
    import windowResizeMixin from '@/mixins/windowResize';
    import {getNewsListByApprUser, delNewsByIds} from '@/api/news';

    export default {
        data: function () {
            return {
                deleteLoading: false,
                searchLoading: false,
                searchName: '',
                pageSize: 20,
                pageNo: 1,
                dataList: [],
                selected: [],
                total: 0
            };
        },
        mixins: [windowResizeMixin],
        created: function () {
            this.getNewsListByApprUserFunc();
        },
        methods: {
            getNewsListByApprUserFunc(){
                getNewsListByApprUser({
                    fromType: 1,
                    pageNo: this.pageNo,
                    pageSize: this.pageSize,
                    searchName: this.searchName
                }).then((res) => {
                    this.searchLoading = false;
                    this.dataList = res.data.data.dataList;
                    if(this.dataList.length==0&&this.pageNo!==1){
                        this.pageNo--;
                        this.getNewsListByApprUserFunc();
                    }
                    this.total = res.data.data.pagination.total;
                })
                .catch(() => {
                    this.$message.error('error');
                    this.searchLoading = false;
                });
            },
            selectionChangeHandler(selection) {
                this.selected = selection;
            },
            searchNameHandler() {
                this.searchLoading = true;
                this.pageNo = 1;
                this.getNewsListByApprUserFunc();
                    
            },
            deleteHandler(index, row) {
                this.$confirm('是否确定要删除该新闻', '删除', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                })
                    .then(() => {
                        delNewsByIds({idStr: row.id})
                            .then((res) => {
                                    const data = res.data;
                                    if (data.result) {
                                        this.$message({
                                            message: '删除成功',
                                            type: 'success'
                                        });
                                        this.getNewsListByApprUserFunc();
                                    } else {
                                        this.$message.error('error');
                                    }
                                }, () => {
                                    this.$message.error('error');
                                }
                            );
                    }).catch(() => {
                });
            },
            batchDeleteHandler() {
                if (this.selected.length === 0) {
                    this.$message.error('请选择要删除的新闻');
                } else {
                    this.$confirm('是否确定要删除这些新闻', '删除', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        this.deleteLoading = true;
                        const idArr = [];
                        this.selected.forEach((item) => {
                            idArr.push(item.id);
                        });
                        delNewsByIds({
                            idStr: idArr.join(',')
                        }).then((res) => {
                            this.deleteLoading = false;
                            const data = res.data;
                            if (data.result) {
                                this.$message({
                                    message: '删除成功',
                                    type: 'success'
                                });
                                this.getNewsListByApprUserFunc();
                            } else {
                                this.deleteLoading = false;
                                this.$message.error(data.msg);
                            }
                        }, (error) => {
                            this.deleteLoading = false;
                            this.$message.error(error.msg);
                        });
                    }).catch(() => {
                    });


                }
            },
            sizeChangeHandler(pageSize) {
                this.pageNo = 1;
                this.pageSize = pageSize;
                this.getNewsListByApprUserFunc();
            },
            currentChangeHandler(pageNo) {
                this.pageNo = pageNo;
                this.getNewsListByApprUserFunc();
            },
            jumpEditPageHandler(state, id) {
                if (state === 1 || state === 3) {
                    this.$router.push({path: 'newsEdit', query: {newsId: id}})
                }
            },
        },
        filters: {
            trimTime(datetime) {
                return datetime.slice(0, datetime.lastIndexOf('.'));
            },
            stateToType(state) {
                const typeArr = ['gray', 'primary', 'danger', 'success'];
                return typeArr[state - 1];
            },
            stateToText(state) {
                const stateTextArr = ['未提交', '待审核', '被驳回', '已发布'];
                return stateTextArr[state - 1];
            }
        }

    }
</script>

<style lang="scss" scoped>
    .page {
        padding:12px;
    }

    .header {
        margin-bottom: 10px;
    }

    .search-input {
        vertical-align: middle;
    }
</style>
