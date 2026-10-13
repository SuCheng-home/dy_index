<template>
    <div id="evTeaList" class="app-container calendar-list-container">
        <div class="filter-container">
            <el-row>
                <el-col :span="19">
                    <div class="btns">
                        <el-button type="primary" size="medium" @click="jumpToPage('matchActivityAddEdit')">新建</el-button>
                    </div>
                </el-col>
                <el-col :span="5">
                    <el-input size="medium"
                              placeholder="请输入活动标题" icon="el-icon-search" @keyup.enter.native="handleFilter"
                              v-model="title">
                        <el-button slot="append" icon="el-icon-search" @click="handleFilter"></el-button>
                    </el-input>
                </el-col>
            </el-row>
        </div>
        <el-table stripe :data="dataList" border fit highlight-current-row
                  style="width: 100%" :height="maxH">
            <el-table-column align="center" label="活动标题" show-overflow-tooltip>
                <template slot-scope="scope">
                    <span class="link-type" @click="jumpToPage('matchActivityDetail', {id: scope.row.id})">
                        {{scope.row.title}}
                    </span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="创建人" show-overflow-tooltip prop="createUser">
            </el-table-column>
            <el-table-column show-overflow-tooltip align="center" label="上报时间">
                <template slot-scope="scope">
                    {{scope.row.startReport | trimTimeMinute}} 至 {{scope.row.endReport | trimTimeMinute}}
                </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip align="center" label="活动类型">
                <template slot-scope="scope">
                    <template>
                        <span>{{scope.row.activityName}}</span>
                    </template>
                </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip align="center" prop="joinUserCount" label="参与人数">
            </el-table-column>
            <el-table-column show-overflow-tooltip align="center" label="作品数">
                <template slot-scope="scope">
                    <template>
                        <span class="link-type" @click="jumpToPage('matchActivityWorkList', {activityId: scope.row.id, status: scope.row.status})">{{scope.row.workCount}}</span>
                    </template>
                </template>
            </el-table-column>
            <el-table-column class-name="status-col" align="center" label="状态">
                <template slot-scope="scope">
                    <el-tag  size="mini" type="primary" v-if="scope.row.status == 0">草稿</el-tag>
                    <el-tag  size="mini" type="primary" v-if="scope.row.status == 1">草稿</el-tag>
                    <el-tag  size="mini" type="primary" v-else-if="scope.row.status == 2">已发布</el-tag>
                    <el-tag  size="mini" type="primary" v-else-if="scope.row.status == 3">未开始</el-tag>
                    <el-tag  size="mini" type="success" v-else-if="scope.row.status == 4">进行中</el-tag>
                    <el-tag  size="mini" type="danger" v-else-if="scope.row.status == 5">已结束</el-tag>

                </template>
            </el-table-column>

            <el-table-column align="center" label="操作">
                <template slot-scope="scope">
                    <el-button :disabled="scope.row.status == 5" size="small" type="text"
                               @click="jumpToPage('matchActivityAddEdit', {id: scope.row.id})">编辑
                    </el-button>
                    <el-button size="small" type="text"
                               @click.native="delWonderfulActivityByIdFunc(scope.row.id)" class="buttontextred">删除
                    </el-button>
                    <el-button :disabled="scope.row.status != 0 && scope.row.status != 1" size="small" type="text"
                               @click="puiblishFunc(scope.row.id)">发布
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
        getUserWonderfulActivityPageList,
        delWonderfulActivityById,
        delWonderfulByActivityByIds,
        publishWonderfulActivityById
    } from '@/api/matchActivity';
    export default {
        name: 'matchActivityList',
        data() {
            return {
                dataList: [],
                title: '',
                tableKey: 0,
                selected: []
            }
        },
        activated() {
            this.getList();
        },
        created() {
            this.getList();

        },
        mixins: [mixin, baseMixin],
        filters: {

            trimTime(datetime) {
                return datetime ? datetime.slice(0, datetime.lastIndexOf('.')) : '--';
            },
            trimTimeMinute(datetime) {
                return datetime ? datetime.slice(0, datetime.lastIndexOf(':')) : '--';
            }
        },
        methods: {
            isShowByPermission,
            puiblishFunc(id) {
                publishWonderfulActivityById({id})
                    .then(res => res.data)
                    .then(data => {
                        if(data.result) {
                            this.$message.success('发布成功');
                            this.getList();
                        } else {
                            this.$message.error(data.msg);
                        }
                    })
            },
            delWonderfulByActivityByIdsFunc() {
                if(this.selected.length === 0) {
                    this.$message.error('请选择要删除的活动');
                } else {
                    this.$confirm('是否确定删除选中的活动?', '删除', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        delWonderfulByActivityByIds({
                            ids: this.selected.join(',')
                        })
                            .then(res => res.data)
                            .then(data => {
                                if(data.result) {
                                    this.$message.success('删除成功');
                                    this.getList();
                                }
                            });
                    });

                }
            },
            getList() {
                getUserWonderfulActivityPageList({
                    pageNo: this.pagination.pageNo,
                    pageSize: this.pagination.pageSize,
                    title: this.title
                })
                    .then(res => res.data)
                    .then(data => {
                        this.dataList = data.data.dataList;
                        this.pagination.total = data.data.pagination.total;
                    })
            },
            delWonderfulActivityByIdFunc(id) {
                this.$confirm('是否确定删除该活动?', '删除', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    delWonderfulActivityById({
                        id
                    })
                        .then(res => res.data)
                        .then(data => {
                            if(data.result) {
                                this.$message.success('删除成功');
                                this.getList();
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
