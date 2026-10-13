<!--用户已发送通知列表-->
<template>
    <div id="noticeIndex" class="app-container calendar-list-container">
        <div class="filter-container">
            <el-row>
                <el-col :span="19">
                    <el-select v-model.trim="deptClassId" @change="getList" size="medium"
                               placeholder="请选择">
                        <el-option :label="departItem.name" :value="departItem.id"
                                   v-for="departItem in classList"></el-option>
                    </el-select>
                    <span v-if="!$store.getters.schoolInfo.accessDate||isMoreThanOneYearAgo($store.getters.schoolInfo.accessDate)" class="important-hint">超过一年的数据已归档</span>
                </el-col>
                <el-col :span="5">
                    <el-input size="medium"
                              placeholder="标题/发布人/发布时间" icon="el-icon-search" @keyup.enter.native="handleFilter"
                              v-model="listQuery.searchTitle">
                        <el-button slot="append" icon="el-icon-search" @click="handleFilter"></el-button>
                    </el-input>
                </el-col>
            </el-row>
        </div>
        <el-table stripe :key='tableKey' :data="list" v-loading.body="listLoading" border fit highlight-current-row
                  style="width: 100%" :height="nobottommaxH - 25">
            <el-table-column align="center" label="序号" width="65">
                <template slot-scope="scope">
                    <span>{{(listQuery.pageNo-1)*listQuery.pageSize+scope.$index+1}}</span>
                </template>
            </el-table-column>
            <el-table-column min-width="150px" label="标题" show-overflow-tooltip>
                <template slot-scope="scope">
                    <span class="link-type" @click="loadNoticeDetail(scope.row.id)">
                        <i class="el-icon-paperclip" v-if="scope.row.attachmentNum != 0"></i>{{scope.row.noticeTitle}}
                    </span>
                </template>
            </el-table-column>
            <el-table-column width="180px" align="center" label="发布时间">
                <template slot-scope="scope">
                    <span>{{scope.row.releaseDate|trimTime }}</span>
                </template>
            </el-table-column>
            <el-table-column width="140px" show-overflow-tooltip align="center" label="发布人">
                <template slot-scope="scope">
                    <template v-if="scope.row.inscribe==0">
                        <span>{{scope.row.releaseUserName}}</span>
                    </template>
                    <template v-if="scope.row.inscribe==1">
                        <span>{{scope.row.departName}}</span>
                    </template>
                </template>
            </el-table-column>
            <el-table-column align="center" label="已读" width="85">
                <template slot-scope="scope">
                    <span :class="{ 'link-type':scope.row.readCount>0}" @click="loadNoticeReadList(scope.row,1)">{{scope.row.readCount}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="未读" width="85">
                <template slot-scope="scope">
                    <span v-bind:class="{ 'link-type':scope.row.notReadCount>0}"
                          @click="loadNoticeReadList(scope.row,0)">{{scope.row.notReadCount}}</span>
                </template>
            </el-table-column>
             <el-table-column align="center" label="已确认" width="85">
                <template slot-scope="scope">
                    <span :class="{ 'link-type':scope.row.readSignCount>0}" @click="readSignCountlist(scope.row)">{{scope.row.isSign!=0?scope.row.readSignCount:"--"}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="回复" width="85">
                <template slot-scope="scope">
                    <span :class="{ 'link-type':scope.row.replyNum>0}" @click="loadNoticeReplyList(scope.row)">{{scope.row.replyNum}}</span>
                </template>
            </el-table-column>
            <el-table-column class-name="status-col" label="状态" width="90">
                <template slot-scope="scope">
                    <template v-if="scope.row.noticeState===1&&scope.row.isSendOntime==0">
                        <el-tag  size="mini" type="gray">未发布
                        </el-tag>
                    </template>
                    <template v-if="scope.row.noticeState===1&&scope.row.isSendOntime==1">
                        <el-tag  size="mini" type="gray">未发布
                            <i class="el-icon-time"></i>
                        </el-tag>
                    </template>
                    <template v-if="scope.row.noticeState===1&&scope.row.isSendOntime==2">
                        <el-tag  size="mini" type="success">发布中</el-tag>
                    </template>
                    <template v-if="scope.row.noticeState===2">
                        <el-tag  size="mini" type="success">已发布</el-tag>
                    </template>
                </template>
            </el-table-column>

<!--            <el-table-column align="center" label="操作" width="120">-->
<!--                <template slot-scope="scope">-->
<!--                    <el-button size="small" type="text"-->
<!--                               @click.native="jumpToPage('noticeAdd', {copyId: scope.row.id})">复制-->
<!--                    </el-button>-->
<!--                    <el-button size="small" type="text" :disabled="scope.row.noticeState===2||scope.row.isSendOntime==2"-->
<!--                               @click.native="editNotice(scope.row)">编辑-->
<!--                    </el-button>-->
<!--                    <el-button v-if="isShowByPermission('/notice/noticeDel')" size="small" type="text"-->
<!--                               @click.native="delNoticeList(scope.row.id)" class="buttontextred">删除-->
<!--                    </el-button>-->
<!--                </template>-->
<!--            </el-table-column>-->

        </el-table>
        <div v-show="!listLoading">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                           :current-page.sync="listQuery.pageNo" :page-sizes="[10,20,30, 50]"
                           :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper"
                           :total="total">
            </el-pagination>
        </div>

    </div>
</template>

<script>
    import {getManageAndOtherDepart} from '@/api/homework';
    import {getClassReceiveNoticeList, delNoticeList} from '@/api/notice';
    import mixin from '@/mixins/windowResize';
    import debounce from 'lodash/debounce';
    import {isShowByPermission} from '@/utils';
    import {mapGetters} from 'vuex';
    import moment from 'moment';
    export default {
        name: 'table_demo',
        data() {
            return {
                list: null,
                total: 0,
                listLoading: false,
                listQuery: {
                    pageNo: 1,
                    pageSize: 20,
                    searchTitle: ''
                },
                tableKey: 0,
                cutH: 225,
                classList: [],
                deptClassId: ''
            }
        },
        computed: {
            ...mapGetters(['isStandalone'])
        },
        created() {
            this.isStandalone ? this.listQuery.pageSize = 10 : this.listQuery.pageSize = 20;
            getManageAndOtherDepart(2)
                .then(res => res.data)
                .then(data => {
                    this.classList = data.data.filter(item => item.type == 4);
                    this.deptClassId = this.classList[0].id;
                    this.getList();

                });
        },
        mixins: [mixin],
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
            }
        },
        methods: {
              isMoreThanOneYearAgo(dateString) {
                 if(dateString){
                        const date = moment(dateString);
                        const now = moment();
                        return date.isBefore(now.subtract(1, 'years'));
                 }                
            },
            isShowByPermission,
            getList() {
                this.listLoading = true;
                getClassReceiveNoticeList({
                    ...this.listQuery,
                    deptClassId: this.deptClassId,
                    noticeType: 0
                }).then(res => {
                    let data = res.data.data;
                    this.list = data.dataList;
                    this.total = data.pagination.total;
                    this.listLoading = false;
                }).catch(err => {
                    this.listLoading = false;
                });
            },
            handleFilter: debounce(function () {
                this.listQuery.pageNo = 1;
                this.getList();
            }, 500),
            handleSizeChange(val) {
                this.listQuery.pageSize = val;
                this.getList();
            },
            handleCurrentChange(val) {
                this.listQuery.pageNo = val;
                this.getList();
            },
            editNotice(row) {
                if (row.noticeState != 2) {
                    this.$router.push({path: 'noticeAdd', query: {id: row.id}});
                }

            },
            delNoticeList(id) {
                this.$confirm('此操作将永久删除此消息, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    delNoticeList(id.toString()).then(res => {
                        this.getList();
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                    }).catch();

                }).catch(() => {
                });

            },
            loadNoticeDetail(id) {//加载添加页面
                this.$router.push({path: 'noticeDetail', query: {id: id, fromSend: 1}});
            },
            loadNoticeReadList(row, isRead) {//加载已读未读页面
                //isRead 1 为已读 0 为未读
                if (isRead == 1) {
                    if (row.readCount) {
                        this.$router.push({
                            path: 'noticeReadList',
                            query: {id: row.id, isRead: isRead, noticeState: row.noticeState, isClass: 1, classId: this.deptClassId}
                        });
                    }
                } else {
                    if (row.notReadCount) {
                        this.$router.push({
                            path: 'noticeReadList',
                            query: {id: row.id, isRead: isRead, noticeState: row.noticeState,isOwnCreate:row.createUserId == this.$store.getters.userInfo.id}
                        });
                    }
                }


            },
            loadNoticeReplyList(row) {//加载回复列表页面
                if (row.replyNum) {
                    let type = this.createUserId == this.$store.getters.userInfo.id ? 1 : 2;
                    this.$router.push({path: 'noticeReply', query: {id: row.id, type: type}});
                }
            },
               readSignCountlist(row) {//加载回复列表页面
                if (row.readSignCount) {
                    let type = this.createUserId == this.$store.getters.userInfo.id ? 1 : 2;
                    this.$router.push({path: 'readSignCountlist', query: {id: row.id, type: type}});
                }
            },
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
    .pagination-container {
        margin-top: 10px;
    }
    .el-icon-paperclip {
        margin-right: 3px;
    }
</style>
