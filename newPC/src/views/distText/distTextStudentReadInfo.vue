<!--用户已发送通知列表-->
<template>
    <div id="noticeIndex" class="app-container calendar-list-container">
        <backtool>
          <el-select size="medium" @change="handleSearch" v-model="isRead" placeholder="请选择">
            <el-option label="全部阅读状态" :value="0"></el-option>
            <el-option label="未阅读" :value="1"></el-option>
            <el-option label="已阅读" :value="2"></el-option>
        </el-select>
            <el-select size="medium" @change="handleSearch" v-model="isReceipt" placeholder="请选择">
            <el-option label="全部回执状态" :value="0"></el-option>
            <el-option label="未回执" :value="1"></el-option>
            <el-option label="已回执" :value="2"></el-option>
        </el-select>
           <el-input size="medium" style="width: 210px;" placeholder="请输入接收单位" @input="handleSearch"
                           v-model="userName"></el-input>
        </backtool>

        <el-table stripe :data="dataList" border fit highlight-current-row
                  style="width: 100%" :height="maxH">
            <el-table-column align="center" label="接收单位/人员">
                <template slot-scope="scope">
                    {{scope.row.userName}}
                </template>
            </el-table-column>
            <el-table-column label="阅读状态" show-overflow-tooltip>
                <template slot-scope="scope">
                    <el-tag  size="mini"  v-if="scope.row.isRead == 2" type="success">已读</el-tag>
                    <el-tag  size="mini"  v-else type="danger">未读</el-tag>
                </template>
            </el-table-column>
            <el-table-column label="是否回执">
                <template slot-scope="scope">
                    <el-tag  size="mini"  v-if="scope.row.isReceipt == 2" type="success">已回执</el-tag>
                    <el-tag  size="mini"  v-else type="danger">未回执</el-tag>
                </template>
            </el-table-column>
            <el-table-column label="阅读时间">
                <template slot-scope="scope">
                    <span>
                        {{scope.row.readTime | secondFilter}}
                    </span>
                </template>
            </el-table-column>
            <el-table-column label="回执内容">
                <template slot-scope="scope">
                    {{scope.row.isReceipt == 2 ? scope.row.receiptContent : '--'}}
                </template>
            </el-table-column>

            <el-table-column label="回执附件">
                <template slot-scope="scope" v-if="scope.row.receiptFilesJson && scope.row.receiptFilesJson.length !== 0">
                    <uploader only-display buttonText="上传正文" buttonMode="none" :useDelete="false"
                              :useSuccessIcon="false" resultMode="list" accept="*/*"
                              pathPrefix="distText" :multiple="true" downloadable
                              :value="scope.row.receiptFilesJson"></uploader>
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
        getForwardScopeUserReadReceiptDataPageList,
    } from '@/api/distText';
    import Uploader from '@/components/Uploader/WebUploader2';

    export default {
        data() {
            return {
                id: this.$route.query.id,
                forwardId: this.$route.query.forwardId,

                dataList: [],
                userName: '',
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
        components: {Uploader},
        mixins: [mixin, baseMixin],
        filters: {

            secondFilter(datetime) {
                return datetime ? datetime.slice(0, datetime.lastIndexOf(':')) : '--';
            }
        },
        methods: {
            isShowByPermission,
            handleSearch() {
                this.userName = this.userName.trim();
                this.getList();
            },
            getList() {
                getForwardScopeUserReadReceiptDataPageList({
                    docId: this.id,
                    isRead: this.isRead,
                    isReceipt: this.isReceipt,
                    pageNo: this.pagination.pageNo,
                    pageSize: this.pagination.pageSize,
                    userName: this.userName,
                    forwardId: this.forwardId
                })
                    .then(res => res.data)
                    .then(data => {
                        data.data.dataList.forEach(item => {
                            if(item.isReceipt == 2) {
                                item.receiptFilesJson = JSON.parse(item.receiptFilesJson);
                            }
                        });
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
