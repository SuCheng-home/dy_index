<!--查询用户的未读及已读通知列表-->
<template>
    <div class="app-container calendar-list-container">
        <backtool></backtool>
        <el-table stripe :key='tableKey' :data="list" v-loading.body="listLoading" border fit highlight-current-row
                  style="width: 100%" :height="maxH">
            <el-table-column align="center" label="序号" width="65">
                <template slot-scope="scope">
                    <span>{{(listQuery.pageNo-1)*listQuery.pageSize+scope.$index+1}}</span>
                </template>
            </el-table-column>
            <el-table-column min-width="300px" label="标题" show-overflow-tooltip>
                <template slot-scope="scope">
                    <span class="link-type" @click="loadNoticeDetail(scope.row.id)">
                        <i class="el-icon-paperclip" v-if="scope.row.attachmentNum != 0"></i>{{scope.row.noticeTitle}}
                    </span>
                </template>
            </el-table-column>
            <el-table-column width="180px" align="center" label="时间">
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
            <el-table-column align="center" label="已读" width="95">
                <template slot-scope="scope">
                    <span>{{scope.row.readCount}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="未读" width="95">
                <template slot-scope="scope">
                    <span>{{scope.row.notReadCount}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="回复" width="95">
                <template slot-scope="scope">
                    <span>{{scope.row.replyNum}}</span>
                </template>
            </el-table-column>
        </el-table>
        <div v-show="!listLoading" class="pagination-container">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                           :current-page.sync="listQuery.pageNo" :page-sizes="[10, 20, 30, 50]"
                           :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper"
                           :total="total">
            </el-pagination>
        </div>
    </div>
</template>
<script>
    import {getUserReadNoticeList} from '@/api/notice';
    import Backtool from '@/components/BackTool';
    import {mapGetters} from 'vuex';
    import mixin from '@/mixins/windowResize';

    export default {
        components: {
            Backtool
        },
        data() {
            return {
                list: null,
                listLoading: false,
                total: null,
                listQuery: {
                    pageNo: 1,
                    pageSize: 20,
                    startDate: '',
                    endDate: '',
                    searchTitle: '',
                    isRead: '',
                    userId: ''
                },
                tableKey: 3
            }
        },
        filters: {
            trimTime(datetime){
                return datetime ? datetime.slice(0, datetime.lastIndexOf('.')) : '--';
            }
        },
        mixins: [mixin],
        computed: {
            ...mapGetters(['isStandalone'])
        },
        created() {
            this.isStandalone ? this.listQuery.pageSize = 10 : this.listQuery.pageSize = 20;
            this.listQuery.startDate = this.$route.query.startDate || '';
            this.listQuery.endDate = this.$route.query.endDate || '';
            this.listQuery.searchTitle = this.$route.query.searchTitle == undefined ? '' : this.$route.query.searchTitle;
            this.listQuery.isRead = this.$route.query.isRead;
            this.listQuery.userId = this.$route.query.userId;
            this.getList();
        },
        methods: {
            getList() {
                this.listLoading = true;
                getUserReadNoticeList(this.listQuery).then(res => {
                    let data = res.data.data;
                    this.list = data.dataList;
                    this.total = data.pagination.total;
                    this.listLoading = false;
                });
            },
            handleSizeChange(val) {
                this.listQuery.pageSize = val;
                this.getList();
            },
            handleCurrentChange(val) {
                this.listQuery.pageNo = val;
                this.getList();
            },
            loadNoticeDetail(id) {//加载添加页面
                this.$router.push({path:'noticeDetail', query: {id}});
            },
            goback() {
                this.$router.back();
            }
        }
    }
</script>
<style scoped>
    .menu-tools {
        border-bottom: 1px solid #e7eaec;
    }
</style>
