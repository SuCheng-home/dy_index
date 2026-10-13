<!--用户已发送通知列表-->
<template>
    <div id="noticeIndex" class="app-container calendar-list-container">
        <div class="filter-container">
            <el-row>
                <el-col :span="19">
                    <el-button type="primary" @click="jumpToPage('queryMeetingAddEdit', {noticeId})" size="medium">创建活动</el-button>
                    <el-select size="medium" v-model="noticeId" placeholder="请选择报名批次" @change="getList">
                        <el-option v-for="item in noticeList" :key="item.id" :label="item.title"
                                   :value="item.id"></el-option>
                    </el-select>
                    <el-select size="medium" v-model="state" placeholder="请选择状态" @change="handleFilter">
                        <el-option label="全部状态" :value="0"></el-option>
                        <el-option label="草稿" :value="1"></el-option>
                        <el-option label="未开始" :value="3"></el-option>
                        <el-option label="进行中" :value="4"></el-option>
                        <el-option label="已结束" :value="5"></el-option>
                    </el-select>
                </el-col>
                <el-col :span="5">
                    <el-input size="medium"
                              placeholder="活动名称" icon="el-icon-search" @keyup.enter.native="handleFilter"
                              v-model="activityName">
                        <el-button slot="append" icon="el-icon-search" @click="handleFilter"></el-button>
                    </el-input>
                </el-col>
            </el-row>
        </div>

        <el-table stripe :data="list" border fit highlight-current-row
                  style="width: 100%" :height="nobottommaxH - 25"
                  @select="handleSelectionChange" @select-all="handleSelectionChange">
            <el-table-column label="活动名称" show-overflow-tooltip>
                <template slot-scope="scope">
                    <span class="link-type" @click="jumpToPage('queryMeetingDetail', {id: scope.row.id, noticeId})">
                        {{scope.row.activityName}}
                    </span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="签到开始时间">
                <template slot-scope="scope">
                    <span>{{scope.row.signSTime | trimTime }}</span>
                </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip align="center" label="签到截止时间">
                <template slot-scope="scope">
                    <span>{{scope.row.signETime | trimTime }}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="已签到人数">
                <template slot-scope="scope">
                    {{scope.row.signStuCount}}
                </template>
            </el-table-column>
            <el-table-column class-name="status-col" label="状态">
                <template slot-scope="scope">
                    <el-tag v-if="scope.row.state == 1">未发布</el-tag>
                    <el-tag v-else size="mini" type="success">已发布</el-tag>
                </template>
            </el-table-column>

            <el-table-column align="center" label="操作">
                <template slot-scope="scope">
                    <el-button size="small" type="text"
                               :disabled="scope.row.state == 1"
                               @click="jumpToPage('queryMeetingSignList', {activityId: scope.row.id, noticeId})">查看
                    </el-button>
                    <el-button size="small" type="text"
                               :disabled="scope.row.state == 2"
                               @click="jumpToPage('queryMeetingAddEdit', {id: scope.row.id})">编辑
                    </el-button>
                    <el-button size="small" type="text"
                               @click.native="deleteFunc(scope.row.id)" class="buttontextred">删除
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
    import {
        getEnrollNoticeActivityPageList,
        deleteEnrollNoticeActivityById,
        getSchoolPublishEnrollNoticeList
    } from '@/api/schoolSignupHigh';
    import mixin from '@/mixins/windowResize';
    import baseMixin from '@/mixins/baseMixin';
    import {isShowByPermission} from '@/utils';

    export default {
        name: 'queryMeetingList',
        data() {
            return {
                noticeId: '',
                noticeList: [],
                list: [],
                cutH: 225,
                selection: [],
                activityName: '',
                state: 0
            }
        },
        created() {
            getSchoolPublishEnrollNoticeList()
                .then(res => res.data)
                .then(data => {
                    this.noticeList = data.data;
                    if(data.data.length !== 0) {
                        this.noticeId = data.data[0].id;
                    }
                    this.getList();
                });
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
                getEnrollNoticeActivityPageList({
                    pageNo: this.pagination.pageNo,
                    pageSize: this.pagination.pageSize,
                    activityName: this.activityName,
                    noticeId: this.noticeId,
                    state: this.state
                })
                    .then(res => res.data)
                    .then(data => {
                        const pageData = data.data;
                        this.list = pageData.dataList;
                        this.pagination.total = pageData.pagination.total;
                    }).catch(err => {
                });
            },
            handleFilter () {
                this.pagination.pageNo = 1;
                this.getList();
            },
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
