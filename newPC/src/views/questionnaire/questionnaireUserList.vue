<template>
    <div class="page">
        <back-tool>
            <el-select value="0" size="medium" @change="changeHandler" v-if="sendUserType === 2" v-model="classId"  placeholder="请选择">
                <el-option label="全部班级" :value="0">
                </el-option>
                <el-option :label="classItem.className" :value="classItem.classId" :key="index" v-for="(classItem, index) in classList"></el-option>
            </el-select>
             <el-select v-model="isVote" @change="changeHandler" size="medium" placeholder="请选择">
                <el-option label="已完成" :value="1"></el-option>
                <el-option label="未完成" :value=0></el-option>
            </el-select>
            <a :href="exportUrl" download="导出" target="_blank" v-if="userList.length">
                <el-button class="filter-item" type="primary" size="medium">导出</el-button>
            </a>
            <el-button type="primary" v-show="!isEnd && isVote === 0" @click.native="notifyAll" size="medium">提醒全部</el-button>
            <el-button type="danger" @click.native="batchDelete" size="medium">删除</el-button>

            <el-input placeholder="用户姓名" size="medium" v-model.trim="userName" class="search-input"
                      @keyup.enter.native="changeHandler">
                <el-button slot="append" icon="el-icon-search" @click="changeHandler"></el-button>
            </el-input>
        </back-tool>
        <div>
            <el-table
                    :data="userList"
                    border
                    style="width: 100%"
                    :height="maxH"
                    @select="selectionChangeHandler"
                    @select-all="selectionChangeHandler"
            >
                <el-table-column
                    type="selection"
                    align="center"
                    width="65px"
                    :resizable="false"
                >
                </el-table-column>
                <el-table-column
                        label="答卷人"
                        show-overflow-tooltip
                        :resizable="false"
                >
                    <template slot-scope="scope">
                        <router-link v-if="anonymous === 2 && isVote === 1" class="link-type" :to="{ path: 'questionnaireUserDetail', query: { userId: scope.row.userId, voteId: scope.row.voteId } }">
                            {{ scope.row.userName }}
                        </router-link>
                        <span v-else>{{ scope.row.userName }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                        v-if="isVote === 1"
                        label="答卷时间"
                        align="center"
                        :resizable="false"
                        prop="voteTime"
                >
                    <template slot-scope="scope">
                        {{scope.row.voteTime | trimTime}}
                    </template>
                </el-table-column>
                <el-table-column
                        label="操作"
                        align="center"
                        :resizable="false"
                >
                    <template slot-scope="scope">
                        <el-button v-show="isVote === 1 && (!isEnd || isShowByRole(191))" size="small" type="text" @click="resetHandler(scope.row.userId)">重置
                        </el-button>
                        <el-button size="small" type="text" @click="deleteHandler(scope.row.userId)">删除
                        </el-button>
                        <el-button v-show="!isEnd && isVote === 0" size="small" type="text" @click="notify(scope.row.userId, scope.row.userName)">提醒
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
                        :page-count="pagination.pages"
                        :total="pagination.total"
                >
                </el-pagination>
            </div>
        </div>
    </div>
</template>

<script>
    import moment from 'moment';
    import windowResizeMixin from '@/mixins/windowResize';
    import BackTool from '@/components/BackTool';
    import {isShowByRole} from '@/utils';
    import {
        getVoteClassListByVoteId,
        getVoteTwoActionList,
        deleteUser,
        deleteUserList,
        resetUserVote,
        remindSendMessagetoUserList,
        getVoteTwoById,
        remindSendMessagetoUser
    } from '@/api/questionnaire';
    export default {
        name: "questionnaireUserList",
        mixins: [windowResizeMixin],
        components: {
            BackTool
        },
        data: function() {
            return {
                voteId: this.$route.query.voteId,
                sendUserType: parseInt(this.$route.query.sendUserType),
                logoUrl: '',
                userName: '',
                anonymous: null,
                isVote: 1,
                userList: [],
                pagination: {
                    pages: 10,
                    total: 0,
                    pageSize: 20,
                    pageNo: 1
                },
                classId: 0,
                classList: [],

                isEnd: false,
                selected: []
            }
        },
        computed: {
            exportUrl() {
                const baseHref = global.command === 'production' ? 'https://www.zhxiaoyuan.cn/module-web/' : 'https://www.weixiaojia.net/module-web/';
                return `${baseHref}structure/voteTwo/exportVoteTwoActionList?voteId=${this.voteId}&schoolYear=${this.$store.getters.selectedSchoolYear}&isVote=${this.isVote}&sendUserType=${this.sendUserType}&token=${this.$store.getters.token}`;
            }
        },
        created() {
            getVoteTwoById({
                voteId: this.voteId
            })
                .then(res => res.data)
                .then(data => {
                    this.logoUrl = data.data.logoUrl;
                    this.anonymous = data.data.anonymous;
                    this.isEnd = moment().format('YYYY-MM-DD HH:mm') > data.data.expriyDate;
                });
            if(this.sendUserType === 2) {
                getVoteClassListByVoteId({
                    voteId: this.voteId
                })
                    .then(res => res.data)
                    .then(data => {
                        this.classList = data.data;
                        this.getVoteTwoActionListFunc();
                    })
            } else {
                this.getVoteTwoActionListFunc();
            }
        },
        filters: {
            trimTime(datetime) {
                return datetime.slice(0, datetime.lastIndexOf('.'));
            }
        },
        methods: {
            isShowByRole,
            batchDelete() {
                if(this.selected.length === 0) {
                    this.$message.error('请选择要删除的用户');
                } else {
                    this.$confirm('确认要删除么?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        deleteUserList({
                            voteId: this.voteId,
                            userIds: this.selected.join(',')
                        })
                            .then(() => {
                                this.$message.success('删除成功');
                                this.getVoteTwoActionListFunc();
                            })
                    });
                }

            },
            selectionChangeHandler(selection) {
                this.selected = selection.map(item => item.userId);
            },
            notifyAll() {
                remindSendMessagetoUserList({
                    sendUserType: this.sendUserType,
                    voteId: this.voteId,
                    logoUrl: this.logoUrl
                })
                    .then(res => res.data)
                    .then(data => {
                        if(data.result) {
                            this.$message({
                                message: '提醒成功',
                                type: 'success',
                                duration: 1000
                            });
                        }
                    })
            },
            notify(userId, userName) {
                remindSendMessagetoUser({
                    sendUserType: this.sendUserType,
                    voteId: this.voteId,
                    userId,
                    userName,
                    logoUrl: this.logoUrl
                })
                    .then(res => res.data)
                    .then(data => {
                        if(data.result) {
                            this.$message({
                                message: '提醒成功',
                                type: 'success',
                                duration: 1000
                            });
                        }
                    })
            },
            changeHandler() {
                this.pagination.pageNo = 1;
                this.getVoteTwoActionListFunc();
            },
            getVoteTwoActionListFunc() {
                this.selected = [];
                getVoteTwoActionList({
                    classId: this.classId,
                    isVote: this.isVote,
                    pageNo: this.pagination.pageNo,
                    pageSize: this.pagination.pageSize,
                    userName: this.userName,
                    voteId: this.voteId
                })
                    .then(res => res.data)
                    .then(data => {
                        this.userList = data.data.dataList;
                        this.pagination.pages = data.data.pagination.pages;
                        this.pagination.total = data.data.pagination.total;
                    })
            },
            deleteHandler(userId) {
                this.$confirm('是否确定要删除该用户', '删除', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    // 删除回调
                    deleteUser({
                        voteId: this.voteId,
                        userId
                    })
                        .then(res => res.data)
                        .then(data => {
                            if(data.result) {
                                this.$message({
                                    message: '删除成功',
                                    type: 'success',
                                    duration: 1000
                                });
                                this.getVoteTwoActionListFunc();
                            }
                        })
                }).catch(() => {
                });
            },
            resetHandler(userId) {
                this.$confirm('是否确定要重置该用户', '重置', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    // 删除回调
                    resetUserVote({
                        voteId: this.voteId,
                        userId
                    })
                        .then(res => res.data)
                        .then(data => {
                            if(data.result) {
                                this.$message({
                                    message: '重置成功',
                                    type: 'success',
                                    duration: 1000
                                });
                                this.getVoteTwoActionListFunc();
                            }
                        })
                }).catch(() => {
                });
            },
            currentChangeHandler(pageNo) {
                this.pagination.pageNo = pageNo;
                this.getVoteTwoActionListFunc();
            },
            sizeChangeHandler(pageSize) {
                this.pagination.pageNo = 1;
                this.pagination.pageSize = pageSize;
                this.getVoteTwoActionListFunc();
            },
            jumpToPage (path, query = {}) {
                this.$router.push({
                    path,
                    query
                })
            },
        }
    }
</script>

<style lang="scss" scoped>
    @import "../../styles/mixin";

    @include globalstyle;
    .page {
        padding:12px;
    }

    .search-input {
        vertical-align: middle;
        margin-left: 10px;
        width: 20%;
        float: right;
    }
</style>
