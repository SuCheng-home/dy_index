<!--用户已发送通知列表-->
<template>
    <div id="noticeIndex" class="app-container calendar-list-container">
        <div class="filter-container">
            <el-button-group v-if="isShowByPermission('/notice/approval') && isShowByPermission('/notice/submit')" style="position: relative;left: -100px">
                <el-button size="medium" :type="activeIndex === 0 ? 'primary' : 'default'" style="width: 150px;" @click="findList(1, 1, 0)">待处理</el-button>
                <el-button size="medium" :type="activeIndex === 1 ? 'primary' : 'default'" style="width: 150px;" @click="findList(1, 2, 1)">已读</el-button>
                <el-button size="medium" :type="activeIndex === 2 ? 'primary' : 'default'" style="width: 150px;" @click="findList(0, 2, 2)">未读</el-button>
            </el-button-group>
            <el-button-group v-else-if="isShowByPermission('/notice/approval')" style="position: relative;left: -100px">
                <el-button size="medium" :type="activeIndex === 0 ? 'primary' : 'default'" style="width: 150px;" @click="findList(1, 1, 0)">待处理</el-button>
                <el-button size="medium" :type="activeIndex === 1 ? 'primary' : 'default'" style="width: 150px;" @click="findList(2, 1, 1)">所有发文</el-button>
            </el-button-group>
            <el-button-group v-else-if="isShowByPermission('/notice/submit')" style="position: relative;left: -100px">
                <el-button size="medium" :type="activeIndex === 0 ? 'primary' : 'default'" style="width: 150px;" @click="findList(0, 2, 0)">未读</el-button>
                <el-button size="medium" :type="activeIndex === 1 ? 'primary' : 'default'" style="width: 150px;" @click="findList(1, 2, 1)">已读</el-button>
            </el-button-group>
            <el-button-group v-else style="position: relative;left: -100px">
                <el-button size="medium" :type="activeIndex === 0 ? 'primary' : 'default'" style="width: 150px;" @click="findList(0, 3, 0)">未读</el-button>
                <el-button size="medium" :type="activeIndex === 1 ? 'primary' : 'default'" style="width: 150px;" @click="findList(1, 3, 1)">已读</el-button>
            </el-button-group>
            <el-input class="search-input search-input--right"  size="medium" style="width:20%"
                      placeholder="标题/发布人/发布时间" icon="el-icon-search" @keyup.enter.native="searchHandler"
                      v-model.trim="searchContent">
                <el-button slot="append" icon="el-icon-search" @click="searchHandler"></el-button>
            </el-input>
        </div>
        <el-table stripe :data="dataList" border fit highlight-current-row
                  style="width: 100%" :height="`${maxH}px`">
            <el-table-column align="center" label="序号" width="65">
                <template slot-scope="scope">
                    <span>{{(pagination.pageNo - 1) * pagination.pageSize+scope.$index + 1}}</span>
                </template>
            </el-table-column>
            <el-table-column min-width="150px" label="标题" show-overflow-tooltip>
                <template slot-scope="scope">
                    <span class="link-type" @click="jumpToPage('noticeDetailBoe', {id: scope.row.id})">{{scope.row.noticeTitle}}</span>
                </template>
            </el-table-column>
            <el-table-column width="200px" align="center" label="发布时间">
                <template slot-scope="scope">
                    <span>{{scope.row.releaseDate|trimTime }}</span>
                </template>
            </el-table-column>
            <el-table-column width="200px" show-overflow-tooltip align="center" label="发布人">
                <template slot-scope="scope">
                    <template v-if="scope.row.inscribe==0">
                        <span>{{scope.row.releaseUserName}}</span>
                    </template>
                    <template v-if="scope.row.inscribe==1">
                        <span>{{scope.row.departName}}</span>
                    </template>
                </template>
            </el-table-column>
            <el-table-column align="center" label="附件" width="200px" prop="fileCount">
            </el-table-column>
            <el-table-column align="center" label="回复" width="200px">
                <template slot-scope="scope">
                    <span :class="{ 'link-type':scope.row.replyNum>0}" @click="loadNoticeReplyList(scope.row)">{{scope.row.replyNum}}</span>
                </template>
            </el-table-column>
        </el-table>
        <div class="pagination-container">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                           :current-page.sync="pagination.pageNo" :page-sizes="[10,20,30, 50]"
                           :page-size="pagination.pageSize" layout="total, sizes, prev, pager, next, jumper"
                           :total="pagination.total">
            </el-pagination>
        </div>

    </div>
</template>

<script>
    import {findAreaNoticeList2ByPage} from '@/api/notice';
    import baseMixin from '@/mixins/baseMixin';
    import mixin from '@/mixins/windowResize';
    import {isShowByPermission} from '@/utils';
    import {mapGetters} from 'vuex';

    export default {
        name: 'noticeFromBoe',
        data() {
            return {
                searchContent: '',
                dataList: [],
                activeIndex: 0,
                readState: 0,
                userType: 1
            }
        },
        computed: {
            ...mapGetters(['isStandalone'])
        },
        created() {
            this.isStandalone ? this.pagination.pageSize = 10 : this.pagination.pageSize = 20;
            if(this.isShowByPermission('/notice/approval')) {
                this.userType = 1;
                this.readState = 1;
            } else if(this.isShowByPermission('/notice/submit')) {
                this.userType = 2;
                this.readState = 0;
            } else {
                this.readState = 0;
                this.userType = 3;
            }
            this.findAreaNoticeList2ByPageFunc();
        },
        mixins: [mixin, baseMixin],
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
            isShowByPermission,
            findAreaNoticeList2ByPageFunc() {
                findAreaNoticeList2ByPage({
                    pageNo: this.pagination.pageNo,
                    pageSize: this.pagination.pageSize,
                    readState: this.readState,
                    userType: this.userType,
                    searchContent: this.searchContent
                })
                    .then(res => res.data)
                    .then(data => {
                        this.dataList = data.data.dataList;
                        this.pagination.total = data.data.pagination.total;
                    })
            },
            findList(readState, userType, activeIndex) {
                this.pagination.pageNo = 1;
                this.userType = userType;
                this.activeIndex = activeIndex;
                this.readState = readState;
                this.findAreaNoticeList2ByPageFunc();
            },
            searchHandler() {
                this.pagination.pageNo = 1;
                this.findAreaNoticeList2ByPageFunc();
            },
            handleSizeChange(pageSize) {
                this.pagination.pageSize = pageSize;
                this.findAreaNoticeList2ByPageFunc();
            },
            handleCurrentChange(pageNo) {
                this.pagination.pageNo = pageNo;
                this.findAreaNoticeList2ByPageFunc();
            },
            loadNoticeReplyList(row) {//加载回复列表页面
                if (row.replyNum) {
                    let type = this.createUserId == this.$store.getters.userInfo.id ? 1 : 2;
                    this.$router.push({path: 'noticeReplyBoe', query: {id: row.id, type: type}});
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
<style scoped lang="scss">
    @import "../../styles/mixin.scss";
    .app-container {
        position: relative;
    }

    .filter-container {
        width: 100%;
        text-align: center;
        top: 20px;
        right: 0;
    }
    .pagination-container {
        margin-top: 12px !important;
    }
    .header-line {
        @include clearfix;
        margin-bottom: 5px;
    }
</style>
