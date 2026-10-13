<template>
    <div class="activityMyList">
        <div class="top">
            <el-row>
                <el-col :span="19">
                    <el-button type="primary" size="medium" @click="jumpTo('activityAdd')">新建活动</el-button>
                    <el-button type="danger" size="medium"   @click="deleteMoreHandler">删除</el-button>
                </el-col>
                <el-col :span="5">
                    <el-input class="search-input"
                              placeholder="活动主题" icon="search" size="medium" @keyup.enter.native="handleInputChange"
                              v-model.trim="listQuery.theme">
                        <el-button slot="append" icon="el-icon-search" @click="handleInputChange"></el-button>
                    </el-input>
                </el-col>
            </el-row>
        </div>
        <div class="main-wrap">
            <el-table
                ref="multipleTable"
                :data="activityMyList"
                :height="maxH"
                v-loading="listLoading"
                border stripe
                style="width: 100%"
                @selection-change="handleSelectionChange">
                <el-table-column align="center"
                                 type="selection"
                                 width="55" :selectable="selectable">
                </el-table-column>
                <el-table-column
                    label="标题" show-overflow-tooltip width="200">
                    <template slot-scope="scope">
                    <span class="link-type" @click="jumpTo('activityDetail',{id:scope.row.id})">
                        {{ scope.row.theme }}
                    </span>
                    </template>
                </el-table-column>
                <el-table-column align="center"
                                 label="创建人"
                                 width="100">
                    <template slot-scope="scope">{{ scope.row.createUserName }}</template>
                </el-table-column>
                <el-table-column align="center"
                                 label="创建时间" show-overflow-tooltip>
                    <template slot-scope="scope">{{ scope.row.createTime|filterTime }}</template>
                </el-table-column>
                <el-table-column align="center"
                                 label="开始时间" show-overflow-tooltip>
                    <template slot-scope="scope">{{ scope.row.startTime|filterTime }}</template>
                </el-table-column>
                <el-table-column
                    label="活动类型" align="center" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span v-if="scope.row.activityType==0">内部活动</span>
                        <span v-if="scope.row.activityType==1">外部活动</span>
                    </template>
                </el-table-column>
                <el-table-column
                    label="活动地点" align="center" show-overflow-tooltip>
                    <template slot-scope="scope">{{ scope.row.place }}</template>
                </el-table-column>
                <el-table-column
                    label="活动状态" align="center">
                    <template slot-scope="scope">
                        <el-tag  size="mini" type="warning" v-if="scope.row.status==0">未发布</el-tag>
                        <el-tag  size="mini" type="success" v-else-if="scope.row.status==-1">定时发送中</el-tag>
                        <el-tag  size="mini" type="warning" v-else-if="scope.row.status==2">未开始</el-tag>
                        <el-tag  size="mini" v-else-if="scope.row.status==3">进行中</el-tag>
                        <el-tag  size="mini" type="info" v-else-if="scope.row.status==4">已结束</el-tag>
                        <el-tag  size="mini" v-else>进行中</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="160" align="center">
                    <template slot-scope="scope">
                        <div>
                            <el-button size="small" type="text" @click="jumpTo('activityEdit',{id:scope.row.id})"
                                       :disabled="scope.row.status!==0">
                                编辑
                            </el-button>
                            <el-button size="small" type="text" @click="deleteHandler(scope.row.id)" class="buttontextred">
                                删除
                            </el-button>
                            <el-button size="small" type="text"
                                       @click="jumpTo('activityMaterialList',{activityId:scope.row.id,fromType:0})">
                                资料管理
                            </el-button>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination
                class="pagination-container"
                v-show="!listLoading"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page.sync="listQuery.pageNo"
                :page-sizes="[10,20,30, 50]"
                :page-size="listQuery.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
            </el-pagination>
        </div>
    </div>
</template>
<script>
    import mixin from '@/mixins/windowResize';
    import _ from 'lodash';
    import {getSchoolActivityPageList, deleteActivity} from '@/api/activity';

    export default {
        data() {
            return {
                activityMyList: [],
                listQuery: {
                    pageNo: 1,
                    pageSize: 20,
                    theme: ''
                },
                total: null,
                listLoading: false,
                multipleSelection: []
            }
        },
        created() {
            this.getSchoolActivityPageListFunc();
        },
        mounted() {

        },
        mixins: [
            mixin
        ],
        filters: {
            filterTime(date) {
                return date ? date.slice(0, 19) : ''
            },
            filterStartTime(date) {
                return date ? date.slice(0, 16) : ''
            }
        },
        methods: {
            handleInputChange: _.debounce(
                function () {
                    this.listQuery.pageNo = 1;
                    this.getSchoolActivityPageListFunc();
                },
                // 这是我们为用户停止输入等待的毫秒数
                500
            ),
            jumpTo(path, query = {}) {
                this.$router.push({
                    path,
                    query
                })
            },
            deleteMoreHandler() {
                //多个删除
                if (this.multipleSelection && this.multipleSelection.length) {
                    this.$confirm('是否删除所选活动？', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        let arr = this.multipleSelection.map(obj => {
                            return obj.id
                        });
                        this.delMettingFunc(arr.toString());
                    }).catch(() => {
                        this.$message({
                            type: 'info',
                            message: '已取消删除'
                        });
                    });
                } else {
                    this.$message({
                        message: '请选择要删除的活动!',
                        type: 'warning'
                    });
                }
            },
            selectable(row) {
                if (row.status == 0) {
                    return true;
                }
            },
            deleteHandler(id) {
                //单个删除
                this.$confirm('是否删除该活动？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.delMettingFunc(id);
                }).catch(() => {

                });
            },
            delMettingFunc(id) {
                deleteActivity({
                    activityIds: id
                }).then(res => res.data).then(data => {
                    if (data.code === 200) {
                        this.$message({
                            message: '删除成功',
                            type: 'success'
                        });
                        this.getSchoolActivityPageListFunc();
                    }
                }).catch(() => {
                });
            },
            handleSizeChange(val) {
                this.listQuery.pageNo = 1;
                this.listQuery.pageSize = val;
                this.getSchoolActivityPageListFunc();
            },
            handleCurrentChange(val) {
                this.listQuery.pageNo = val;
                this.getSchoolActivityPageListFunc();
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            getSchoolActivityPageListFunc() {
                //列表
                this.listLoading = true;
                getSchoolActivityPageList({
                    pageNo: this.listQuery.pageNo,
                    pageSize: this.listQuery.pageSize,
                    theme: this.listQuery.theme,
                    moduleType: 1
                }).then(res => res.data).then(data => {
                    if (data.code === 200) {
                        this.listLoading = false;
                        let activityData = data.data;
                        this.activityMyList = activityData.dataList;
                        if (this.activityMyList.length == 0 && this.listQuery.pageNo !== 1) {
                            this.listQuery.pageNo--;
                            this.getSchoolActivityPageListFunc();
                        }
                        this.total = activityData.pagination.total;
                    } else {
                        this.listLoading = false;
                    }
                }).catch(() => {
                    this.listLoading = false;
                })
            }
        }
    }
</script>
<style lang="scss" scoped>
    .activityMyList {
        padding:12px;
        box-sizing: border-box;

        .top {
            margin-bottom: 10px;
        }

        .main-wrap {
            padding-top: 0px !important;
        }

    }
</style>
<style scoped>
    .activityMyList .search-input {
        margin: 0;
    }
</style>
