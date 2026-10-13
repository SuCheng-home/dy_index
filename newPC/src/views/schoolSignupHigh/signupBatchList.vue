<!--用户已发送通知列表-->
<template>
    <div id="noticeIndex" class="app-container calendar-list-container">
        <div class="filter-container">
            <el-row>
                <el-col :span="19">
                    <el-button type="primary" @click="jumpToPage('signupBatchAddEdit')" size="medium">新建</el-button>
                    <el-button type="danger" size="medium"
                               @click="batchDelete">
                        删除
                    </el-button>
                </el-col>
                <el-col :span="5">
                    <!--                    <el-input size="medium"-->
                    <!--                              placeholder="标题/发布人/发布时间" icon="el-icon-search" @keyup.enter.native="handleFilter"-->
                    <!--                              v-model="searchTitle">-->
                    <!--                        <el-button slot="append" icon="el-icon-search" @click="handleFilter"></el-button>-->
                    <!--                    </el-input>-->
                </el-col>
            </el-row>
        </div>
        <el-table stripe :data="list" border fit highlight-current-row
                  style="width: 100%" :height="nobottommaxH - 25"
                  @select="handleSelectionChange" @select-all="handleSelectionChange">
            <el-table-column type="selection" align="center" width="65px" :resizable="false">
            </el-table-column>
            <el-table-column label="主题" show-overflow-tooltip>
                <template slot-scope="scope">
                    <span class="link-type" @click="jumpToPage('signupBatchDetail', {noticeId: scope.row.id})">
                        {{scope.row.title}}
                    </span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="登记开始时间">
                <template slot-scope="scope">
                    <span>{{scope.row.startTime }}</span>
                </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip align="center" label="登记截止时间">
                <template slot-scope="scope">
                    <span>{{scope.row.endTime }}</span>
                </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip align="center" label="出生日期限制">
                <template slot-scope="scope">
                    <span v-if="scope.row.beginBirthDate">{{scope.row.beginBirthDate }} ~ {{scope.row.endBirthDate }}</span>
                     <span v-else>不限制</span>
                </template>
            </el-table-column>
            <el-table-column class-name="status-col" label="状态">
                <template slot-scope="scope">
                    <el-tag v-if="scope.row.state == 1">未发布</el-tag>
                    <el-tag v-else size="mini" type="success">已发布</el-tag>
                </template>
            </el-table-column>
            <el-table-column align="center" label="发布人" prop="createUserName">
            </el-table-column>
            <el-table-column align="center" label="发布时间">
                <template slot-scope="scope">
                    {{scope.row.publishTime | trimTime}}
                </template>
            </el-table-column>
            <el-table-column align="center" label="操作">
                <template slot-scope="scope">
                    <el-button size="small" type="text"
                               @click="jumpToPage('signupBatchAddEdit', {noticeId: scope.row.id})">编辑
                    </el-button>
                    <el-button size="small" type="text"
                               @click.native="deleteFunc(scope.row.id)"  class="buttontextred">删除
                    </el-button>
                </template>
            </el-table-column>

        </el-table>
        <div>
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                           :current-page.sync="pagination.pageNo" :page-sizes="[10,20,30, 50]"
                           :page-size="pagination.pageSize" layout="total, sizes, prev, pager, next, jumper"
                           :total="pagination.total">
            </el-pagination>
        </div>

    </div>
</template>

<script>
    import {getEnrollStuNoticPageList, delNoticeByIds} from '@/api/schoolSignupHigh';
    import mixin from '@/mixins/windowResize';
    import baseMixin from '@/mixins/baseMixin';
    import debounce from 'lodash/debounce';
    import {isShowByPermission} from '@/utils';

    export default {
        name: 'signpBatchList',
        data() {
            return {
                list: [],
                cutH: 225,
                selection: [],
                searchTitle: ''
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
            isShowByPermission,
            handleSelectionChange(val) {
                this.selection = val
            },
            getList() {
                getEnrollStuNoticPageList({
                    pageNo: this.pagination.pageNo,
                    pageSize: this.pagination.pageSize,
                    searchTitle: this.searchTitle
                })
                    .then(res => res.data)
                    .then(data => {
                        const pageData = data.data;
                        this.list = pageData.dataList;
                        this.pagination.total = pageData.pagination.total;
                    }).catch(err => {
                });
            },
            handleFilter: debounce(function () {
                this.pagination.pageNo = 1;
                this.getList();
            }, 500),
            handleSizeChange(val) {
                this.pagination.pageSize = val;
                this.getList();
            },
            handleCurrentChange(val) {
                this.pagination.pageNo = val;
                this.getList();
            },
            batchDelete() {
                if (this.selection.length === 0) {
                    this.$message.error('请选择至少一个要删除的条目');
                } else {
                    this.deleteFunc(this.selection.map(item => item.id).join(','));
                }
            },
            deleteFunc(ids) {
                this.$confirm('是否确认删除?', '删除', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    delNoticeByIds({ids})
                        .then(res => {
                            this.getList();
                            this.$message({
                                type: 'success',
                                message: '删除成功!'
                            });
                        }).catch();

                }).catch(() => {
                });

            },
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
