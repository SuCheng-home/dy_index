<!--用户已发送通知列表-->
<template>
    <div id="noticeIndex" class="app-container calendar-list-container">
        <div class="filter-container">
            <el-row>
                <el-col :span="19">
                    <el-button type="default" @click="$router.back()" size="medium">返回</el-button>
                </el-col>
                <el-col :span="5">
                    <el-input size="medium"
                              placeholder="学生姓名" icon="el-icon-search" @keyup.enter.native="handleFilter"
                              v-model="stuName">
                        <el-button slot="append" icon="el-icon-search" @click="handleFilter"></el-button>
                    </el-input>
                </el-col>
            </el-row>
        </div>

        <el-table stripe :data="list" border fit highlight-current-row
                  style="width: 100%" :height="nobottommaxH - 25">
            <el-table-column align="center" label="登记ID号">
                <template slot-scope="scope">
                    <span>{{scope.row.stuOrderNo }}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="学生姓名" show-overflow-tooltip>
                <template slot-scope="scope">
                    <span class="link-type" @click="jumpToPage('signupStuDetail', {id: scope.row.stuId, noticeId})">
                        {{scope.row.stuName}}
                    </span>
                </template>
            </el-table-column>

            <el-table-column show-overflow-tooltip align="center" label="签到时间">
                <template slot-scope="scope">
                    <span>{{scope.row.signTime | trimTime }}</span>
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
    import {getEnrollNoticeActivitySignPageList} from '@/api/schoolSignupHigh';
    import mixin from '@/mixins/windowResize';
    import baseMixin from '@/mixins/baseMixin';
    import debounce from 'lodash/debounce';
    import {isShowByPermission} from '@/utils';

    export default {
        name: 'queryMeetingList',
        data() {
            return {
                activityId: this.$route.query.activityId,
                noticeId: this.$route.query.noticeId,
                list: [],
                cutH: 225,
                selection: [],
                stuName: '',
                state: 0
            }
        },
        created() {
            this.getList();
        },
        mixins: [mixin, baseMixin],
        filters: {
            trimTime(datetime) {
                return datetime ? datetime.slice(0, datetime.lastIndexOf(':')) : '--';
            }
        },
        methods: {
            isShowByPermission,
            handleSelectionChange(val) {
                this.selection = val
            },
            getList() {
                getEnrollNoticeActivitySignPageList({
                    pageNo: this.pagination.pageNo,
                    pageSize: this.pagination.pageSize,
                    stuName: this.stuName,
                    activityId: this.activityId,
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
            deleteFunc(ids) {
                this.$confirm('是否确认删除?', '删除', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    deleteEnrollNoticeActivityById({ids})
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
