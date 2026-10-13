<!--用户已发送通知列表-->
<template>
    <div id="noticeIndex" class="app-container calendar-list-container">
        <backtool>
          <el-select size="medium" @change="handleSearch" v-model="isRead" placeholder="请选择">
            <el-option label="全部阅读状态" :value="0"></el-option>
            <el-option label="未阅读" :value="1"></el-option>
            <el-option label="已阅读" :value="2"></el-option>
        </el-select>
            ：<el-select size="medium" @change="handleSearch" v-model="isReceipt" placeholder="请选择回执状态">
            <el-option label="全部回执状态" :value="0"></el-option>
            <el-option label="未回执" :value="1"></el-option>
            <el-option label="已回执" :value="2"></el-option>
        </el-select>
            <el-input size="medium" style="width: 210px;" placeholder="请输入接收单位" @input="handleSearch"
                           v-model="scopeName"></el-input>
            <el-button size="medium" type="primary" @click="downloadFeedback">下载回执文件</el-button>
        </backtool>

        <el-table stripe :data="dataList" border fit highlight-current-row
                  style="width: 100%" :height="maxH">
            <el-table-column label="接收单位/人员">
                <template slot-scope="scope">
                    {{scope.row.scopeName}}
                </template>
            </el-table-column>
            <el-table-column label="阅读状态" show-overflow-tooltip>
                <template slot-scope="scope">
                    <el-tag  size="mini"  v-if="scope.row.isRead == 2" type="success">已读</el-tag>
                    <el-tag  size="mini"  v-else type="danger">未读</el-tag>
                </template>
            </el-table-column>
            <el-table-column label="阅读时间">
                <template slot-scope="scope">
                    <span>
                        {{scope.row.readTime | secondFilter}}
                    </span>
                </template>
            </el-table-column>
            <el-table-column label="阅读数">
                <template slot-scope="scope">
                 <span class="link-type"
                       @click="jumpToPage('distTextStudentReadInfo', {forwardId: scope.row.id, id})">{{scope.row.readCount}}/{{scope.row.receiverCount}}</span>
                </template>
            </el-table-column>
            <el-table-column label="回执状态">
                <template slot-scope="scope">
                    <el-tag  size="mini"  v-if="scope.row.isReceipt == 2" type="success">已回执</el-tag>
                    <el-tag  size="mini"  v-else type="danger">未回执</el-tag>
                </template>
            </el-table-column>
            <el-table-column label="回执数">
                <template slot-scope="scope">
                 <span class="link-type"
                       @click="jumpToPage('distTextStudentReadInfo', {forwardId: scope.row.id, id})">{{scope.row.receiptCount}}/{{scope.row.receiverCount}}</span>
                </template>
            </el-table-column>
        </el-table>
        <div class="pagination-container">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                           :current-page.sync="pagination.pageNo" :page-sizes="[10, 20, 30, 50]"
                           :page-size="pagination.pageSize" layout="total, sizes, prev, pager, next, jumper"
                           :total="pagination.total">
            </el-pagination>
        </div>
    </div>
</template>

<script>
    import mixin from '@/mixins/windowResize';
    import baseMixin from '@/mixins/baseMixin';
    import {isShowByPermission} from '@/utils';
    import {mapGetters} from 'vuex';
    import {
        getSchoolForwardReadReceiptDataPageList,
        downloadForwardScopeReceiptFilesList
    } from '@/api/distText';

    export default {
        data() {
            return {
                id: this.$route.query.id,
                isBranch: this.$route.query.isBranch == 1,

                dataList: [],
                scopeName: '',
                duration: [],
                cutH: 170,
                isRead: 0,
                isReceipt: 0
            }
        },
        computed: {
            ...mapGetters(['isStandalone'])
        },
        created() {
            this.getList();
        },
        mixins: [mixin, baseMixin],
        filters: {
            secondFilter(datetime) {
                return datetime ? datetime.slice(0, datetime.lastIndexOf(':')) : '--';
            }
        },
        methods: {
            isShowByPermission,
            downloadFeedback() {
                downloadForwardScopeReceiptFilesList({
                    docId: this.id
                }).then(res => res.data).then(data => {
                    if (data.result) {
                        if (data.data.key) {
                            const prefixUrl = global.command === 'production' ? 'https://www.zhxiaoyuan.cn/' : 'http://api.weixiaojia.net/';
                            window.open(`${prefixUrl}thunder/archive/getArchiveByKey?archiveName=${data.data.zipName}&key=${data.data.key}&token=${this.$store.getters.token}`, "_blank");
                        } else {
                            this.$message.error('暂无数据');
                        }
                    } else {
                        this.$message.error(data.msg);
                    }
                })
            },
            handleSearch() {
                this.scopeName = this.scopeName.trim();
                this.getList();
            },
            getList() {
                getSchoolForwardReadReceiptDataPageList({
                    docId: this.id,
                    isRead: this.isRead,
                    isReceipt: this.isReceipt,
                    pageNo: this.pagination.pageNo,
                    pageSize: this.pagination.pageSize,
                    scopeName: this.scopeName,
                    isBranch: this.isBranch ? 2 : 1
                })
                    .then(res => res.data)
                    .then(data => {
                        this.dataList = data.data.dataList;
                        this.pagination.total = data.data.pagination.total;
                    })
            },
            handleSizeChange(val) {
                this.pagination.pageSize = val;
                this.getList();
            },
            handleCurrentChange(val) {
                this.pagination.pageNo = val;
                this.getList();
            },
        }
    }
</script>
<style lang="scss" scoped>
    .pagination-container {
        margin-top: 10px;
    }

</style>
