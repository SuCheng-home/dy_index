<template>
    <div id="noticeAll" class="app-container allNoticeList">
        <div class="filter-container">
            <el-row>
                <el-col :span="19">
                    <span class="important-hint">超过一年的归档数据</span>
                </el-col>
                <el-col :span="5">
                    <el-input size="medium"
                              placeholder="标题/发布人/发布时间" v-model.trim="listQuery.searchTitle"
                              @keyup.enter.native="handleFilter"
                    >
                        <el-button slot="append" icon="el-icon-search" @click="handleFilter"></el-button>
                    </el-input>
                </el-col>
            </el-row>

        </div>
        <el-table stripe :data="allNoticeList" v-loading.body="listLoading" :height="`${nobottommaxH - 25}px`" border
                  style="width: 100%"
                  @select="handleSelectionChange" @select-all="handleSelectionChange">
           
            <el-table-column label="标题" show-overflow-tooltip>
                <template slot-scope="scope">
                    <span class="link-type" @click="loadNoticeDetail(scope.row.id)">
                        <i class="el-icon-s-flag" style="color:#F56C6C" v-if="scope.row.top==1"></i>
                        <i class="el-icon-paperclip" v-if="scope.row.attachmentNum != 0"></i>{{scope.row.noticeTitle}}                        
                    </span>
                </template>
            </el-table-column>
            <el-table-column label="发布人" align="center" show-overflow-tooltip>
                <template slot-scope="scope">
                    <span v-if="scope.row.inscribe==1">{{scope.row.departName}}</span>
                    <span v-if="scope.row.inscribe==0">{{scope.row.createUser}}</span>
                </template>
            </el-table-column>
            <el-table-column label="发布时间" align="center" show-overflow-tooltip>
                <template slot-scope="scope">
                    <span>{{scope.row.releaseDate|trimTime}}</span>
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
            <el-table-column align="center" label="回复" width="85">
                <template slot-scope="scope">
                    <span :class="{ 'link-type':scope.row.replyNum>0}" @click="loadNoticeReplyList(scope.row)">{{scope.row.replyNum}}</span>
                </template>
            </el-table-column>
            <el-table-column label="状态" align="center" width="110">
                <template slot-scope="scope">
                    <template v-if="scope.row.noticeState==1&&scope.row.isSendOntime==2">
                        <el-tag  size="mini" type="success">发布中</el-tag>
                    </template>
                    <template v-if="scope.row.noticeState==1">
                        <el-tag  size="mini" type="gray">未发布</el-tag>
                    </template>
                    <template v-if="scope.row.noticeState==2">
                        <el-tag  size="mini" type="success">已发布</el-tag>
                    </template>
                </template>
                <el-tag  size="mini"></el-tag>
            </el-table-column>
        </el-table>
        <el-pagination
            class="pagination-container"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page.sync="listQuery.pageNo"
            :page-sizes="[10, 20, 30, 50]"
            :page-size="listQuery.pageSize"
            layout="sizes, prev, pager, next"
            :total="total">
        </el-pagination>
    </div>
</template>
<script>
    import {getAllPublishNoticeListnew} from '@/api/notice';
    import mixin from '@/mixins/windowResize';
    import debounce from 'lodash/debounce';
    import {mapGetters} from 'vuex';

    export default {
        data() {
            return {
                listQuery: {
                    pageNo: 1,
                    pageSize: 20,
                    searchTitle: ''
                },
                listLoading: false,
                allNoticeList: [],
                total: null,
                deleteLoading: false,
                selected: [],
                cutH: 225
            }
        },
        created() {
            this.isStandalone ? this.listQuery.pageSize = 10 : this.listQuery.pageSize = 20;
            this.getAllPublishNoticeListnew();
        },
        mixins: [mixin],
        computed: {
            ...mapGetters(['isStandalone'])
        },
        filters: {
            trimTime(datetime) {
                return datetime ? datetime.slice(0, datetime.lastIndexOf('.')) : '--';
            }
        },
        methods: {
              updateTopStates(id,num) {
                this.$confirm('是否'+(num==0?"取消":"")+'置顶?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    updateTopState(id,num).then(res => {
                        this.$message({
                            type: 'success',
                            message: (num==0?"取消置顶":"置顶")+'成功!'
                        });
                        this.selected = [];
                         this.getAllPublishNoticeListnew();
                    }).catch();

                }).catch(() => {
                });

            },
            loadNoticeReadList(row, isRead) {//加载已读未读页面
                //isRead 1 为已读 0 为未读
                if (isRead == 1) {
                    if (row.readCount) {
                        this.$router.push({
                            path: 'noticeReadList',
                            query: {id: row.id, isRead: isRead, noticeState: row.noticeState,mynew:1}
                        });
                    }
                } else {
                    if (row.notReadCount) {
                        this.$router.push({
                            path: 'noticeReadList',
                            query: {id: row.id, isRead: isRead, noticeState: row.noticeState,mynew:1}
                        });
                    }
                }


            },
            loadNoticeReplyList(row) {//加载回复列表页面
                if (row.replyNum) {
                    let type = this.createUserId == this.$store.getters.userInfo.id ? 1 : 2;
                    this.$router.push({path: 'noticeReply', query: {id: row.id, type: type,mynew:1}});
                }
            },
           
            handleSelectionChange(val) {
                this.selected = val;
            },
            loadNoticeDetail(id) {
                this.$router.push({
                    path:
                        'noticeDetail', query: {id: id, isAll: 1,mynew:1}
                });
            },
            getAllPublishNoticeListnew() {
                this.listLoading = true;
                getAllPublishNoticeListnew(this.listQuery)
                    .then(res => res.data)
                    .then(data => {
                        this.allNoticeList = data.data.dataList;
                        this.total = data.data.pagination.total;
                        this.listLoading = false;
                    }).catch(err => {
                    this.listLoading = false;
                })
            },
            handleFilter: debounce(function () {
                this.listQuery.pageNo = 1;
                this.getAllPublishNoticeListnew();
            }, 500),
            handleSizeChange(val) {
                this.listQuery.pageSize = val;
                this.getAllPublishNoticeListnew();
            },
            handleCurrentChange(val) {
                this.listQuery.pageNo = val;
                this.getAllPublishNoticeListnew();
            }
        }
    }
</script>
<style lang="scss" scoped>
    .pagination-container {
        margin-top: 10px;
    }
</style>
