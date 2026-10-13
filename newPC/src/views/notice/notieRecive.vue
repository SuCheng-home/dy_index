<!--用户接收的通知列表-->
<template>
    <div id="noticeReceive" class="app-container calendar-list-container">
        <div class="filter-container">
            <el-row>
                <el-col :span="19">
                    <el-button type="default" @click="$router.back()" size="medium" v-show="isStandalone">返回</el-button>
                    &nbsp;
                    <span v-if="!$store.getters.schoolInfo.accessDate||isMoreThanOneYearAgo($store.getters.schoolInfo.accessDate)" class="important-hint">超过一年的数据已归档</span>
                </el-col>
                <el-col :span="5">
                    <el-input @keyup.enter.native="handleFilter" size="medium" placeholder="标题/发布人/时间"
                              icon="el-icon-search"
                              v-model="listQuery.searchTitle">
                        <el-button slot="append" icon="el-icon-search" @click="handleFilter"></el-button>
                    </el-input>
                </el-col>
            </el-row>
        </div>
        <el-table stripe :key='tableKey' :data="list" v-loading.body="listLoading" border fit highlight-current-row
                  style="width: 100%" :height="`${nobottommaxH - 25}px`">
            <el-table-column align="center" label="序号" width="65">
                <template slot-scope="scope">
                    <span>{{(listQuery.pageNo-1)*listQuery.pageSize+scope.$index+1}}</span>
                </template>
            </el-table-column>
            <el-table-column min-width="300px" label="标题" show-overflow-tooltip>
                <template slot-scope="scope">
                    <span class="link-type" @click="loadNoticeDetail(scope.row.id)">
                       <i class="el-icon-s-flag" style="color:#F56C6C" v-if="scope.row.top==1"></i> <i
                        class="el-icon-paperclip" v-if="scope.row.attachmentNum != 0"></i>{{scope.row.noticeTitle}}
                    </span>
                </template>
            </el-table-column>
            <el-table-column width="180px" align="center" label="发布时间">
                <template slot-scope="scope">
                    <span>{{scope.row.releaseDate|trimTime }}</span>
                </template>
            </el-table-column>
            <el-table-column width="120px" show-overflow-tooltip align="center" label="发布人">
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
                    <div v-if="scope.row.noticeType != 2">
                        <span
                            :class="{'is-active': scope.row.readCount != 0 && scope.row.createUserId == userInfo.id, 'meta-info-item': true}"
                            @click="toReadList(1, scope.row.readCount, scope.row.createUserId == userInfo.id, scope.row.id)">{{scope.row.readCount}}</span>
                    </div>
                    <div v-else>
                        <span>{{scope.row.readCount}}</span>
                    </div>
                </template>
            </el-table-column>
            <el-table-column align="center" label="未读" width="85">
                <template slot-scope="scope">
                    <div v-if="scope.row.noticeType != 2">
                        <span
                            :class="{'is-active': scope.row.notReadCount != 0 && scope.row.createUserId == userInfo.id, 'meta-info-item': true}"
                            @click="toReadList(0, scope.row.notReadCount, scope.row.createUserId == userInfo.id, scope.row.id)">{{scope.row.notReadCount}}</span>
                    </div>
                    <div v-else>
                        <span>{{scope.row.notReadCount}}</span>
                    </div>
                </template>
            </el-table-column>
             <el-table-column align="center" label="已确认" width="85">
                <template slot-scope="scope">
                    <span :class="{ 'link-type':scope.row.readSignCount>0}" @click="readSignCountlist(scope.row)">{{scope.row.isSign!=0?scope.row.readSignCount:"--"}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="回复" width="95">
                <template slot-scope="scope">
                    <span :class="{ 'link-type':scope.row.replyNum>0}" @click="loadNoticeReplyList(scope.row)">{{scope.row.replyNum}}</span>
                </template>
            </el-table-column>
        </el-table>
        <div v-show="!listLoading" class="pagination-container">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                           :current-page.sync="listQuery.pageNo" :page-sizes="[10,20,30, 50]"
                           :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper"
                           :total="total">
            </el-pagination>
        </div>

    </div>
</template>

<script>
    import {getUserReceiveNoticeList} from '@/api/notice';
    import mixin from '@/mixins/windowResize';
    import debounce from 'lodash/debounce';
    import {mapGetters} from 'vuex';
    import moment from 'moment';
    export default {
        name: 'table_demo',
        data() {
            return {
                list: null,
                total: null,
                listLoading: false,
                tableKey: 1,
                listQuery: {
                    pageNo: 1,
                    pageSize: 20,
                    searchTitle: '',
                    noticeType: 0
                },
                cutH: 225,
            }
        },
        created() {
            this.isStandalone ? this.listQuery.pageSize = 10 : this.listQuery.pageSize = 20;
            this.getList();
        },
        computed: {
            ...mapGetters(['isStandalone', 'userInfo'])
        },
        mixins: [mixin],
        filters: {
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
            jumpToPage(path, query = {}) {
                this.$router.push({
                    path,
                    query
                })
            },
            toReadList(isRead, count, isOwnCreate, id) {
                if (count != 0 && (isOwnCreate || this.isOpenForTeacher == 1)) {
                    this.jumpToPage('noticeReadList', {
                        id,
                        isRead,
                        noticeState: this.noticeState,
                        isOwnCreate: isOwnCreate ? 1 : 0
                    })
                }
            },
            getList() {
                this.listLoading = true;
                getUserReceiveNoticeList({
                    ...this.listQuery,
                    receiveUserId: this.userInfo.id
                }).then(res => {
                    let data = res.data.data;
                    this.list = data.dataList;
                    this.total = data.pagination.total;
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
            loadNoticeDetail(id) {//加载添加页面
                this.$router.push({path: 'noticeDetail', query: {id: id, isReceive: 1}});
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
        }
    }
</script>
<style lang="scss" scoped>
    .pagination-container {
        margin-top: 10px;
    }

    .is-active {
        color: #409EFF;
        cursor: pointer;
    }
</style>
<style lang="scss">
    @import "../../styles/mixin";

    .filter-container {
        @include clearfix;
    }
</style>
