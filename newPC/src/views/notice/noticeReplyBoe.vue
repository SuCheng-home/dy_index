<!--通知的回复列表-->
<template>
    <div class="app-container calendar-list-container">
        <backtool>
            <a :href="exportAllUrl" target="_blank" download="全部导出">
                <el-button type="primary" size="medium">全部导出</el-button>
            </a>
            <a v-if="exportIds.length>0" :href="exportChosedUrl" target="_blank" download="选择导出">
                <el-button type="primary" size="medium">选择导出</el-button>
            </a>
            <el-button v-if="exportIds.length === 0" type="primary" size="medium" @click="noChoseInfo">选择导出</el-button>
            <el-input class="search-input search-input--right" size="medium" style="width:20%" placeholder="回复人姓名" v-model="searchName"
                      @keyup.enter.native="handleInputChange">
                <el-button slot="append" icon="el-icon-search" @click="handleInputChange"></el-button>
            </el-input>
        </backtool>

        <el-table stripe :key='replyNoticeTable' :data="list" border fit highlight-current-row style="width: 100%"
                  :height="maxH" @selection-change="selectionChange">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column align="center" label="序号" width="65">
                <template slot-scope="scope">
                    <span>{{(pagination.pageNo-1)*pagination.pageSize+scope.$index+1}}</span>
                </template>
            </el-table-column>
            <el-table-column min-width="280px" label="回复内容" show-overflow-tooltip>
                <template slot-scope="scope">
                    <span>{{scope.row.replyContext}}</span>
                </template>
            </el-table-column>
            <el-table-column width="100px" align="center" label="图片">
                <template slot-scope="scope">
                    <span v-if="scope.row.replyPhotoList&&scope.row.replyPhotoList.length>0" class="link-type">
                        <image-previewer
                            :images="getViewPic(scope.row.replyPhotoList)"
                            tag="img"
                            text="预览"
                        >
						</image-previewer>
                    </span>
                    <span v-else>--</span>
                </template>
            </el-table-column>
            <el-table-column width="120px" show-overflow-tooltip align="center" label="回复人">
                <template slot-scope="scope">
                    <span>{{scope.row.replyUserName}}</span>
                </template>
            </el-table-column>
            <el-table-column width="200px" align="center" label="时间">
                <template slot-scope="scope">
                    <span>{{scope.row.replyTime }}</span>
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
    import {findAreaNoticeReplyListByPage} from '@/api/notice';
    import Backtool from '@/components/BackTool';
    import {mapGetters} from 'vuex';
    import mixin from '@/mixins/windowResize';
    import baseMixin from '@/mixins/baseMixin';
    import debounce from 'lodash/debounce';
    import ImagePreviewer from '@/components/ImagePreviewer/ImagePreviewer.vue';

    export default {
        components: {
            Backtool,
            ImagePreviewer
        },
        data() {
            return {
                searchName: '',
                replyNoticeTable: '3',
                list: null,
                exportAllUrl: '',
                exportChosedUrl: '',
                exportIds: '',
                noticeId: this.$route.query.id
            }
        },
        mixins: [mixin, baseMixin],
        filters: {
            trimTime(datetime) {
                return datetime ? datetime.slice(0, datetime.lastIndexOf('.')) : '--';
            }
        },
        computed: {
            ...mapGetters(['isStandalone'])
        },
        created() {
            this.isStandalone ? this.pagination.pageSize = 10 : this.pagination.pageSize = 20;
            this.getList();
            this.exportAllUrl = global.BasePath + 'structure/notice/exportReplyListBySchoolId?noticeId=' + this.noticeId + '&token=' + this.$store.getters.token;

        },
        methods: {
            getList() {
                findAreaNoticeReplyListByPage({
                    noticeId: this.noticeId,
                    pageNo: this.pagination.pageNo,
                    pageSize: this.pagination.pageSize,
                    searchName: this.searchName
                }).then(res => {
                    let data = res.data.data;
                    this.list = data.dataList;
                    this.pagination.total = data.pagination.total;
                });
            },
            handleSizeChange(pageSize) {
                this.pagination.pageSize = pageSize;
                this.getList();
            },
            handleCurrentChange(pageNo) {
                this.pagination.pageNo = pageNo;
                this.getList();
            },
            goback() {
                this.$router.back();
            },
            handleInputChange() {
                this.pagination.pageNo = 1;
                this.getList();
            },
            selectionChange(selection) {
                let array = [];
                selection.forEach(function (item) {
                    array.push(item.id);
                });
                this.exportIds = array.toString();
                this.exportChosedUrl = global.BasePath + 'structure/notice/exportReplyListBySchoolId?noticeId=' + this.noticeId + '&token=' + this.$store.getters.token + '&replyIds=' + this.exportIds;
               
            },
            noChoseInfo() {
                this.$message({
                    message: '请选择要导出的数据！',
                    type: 'warning'
                });
            },
            getViewPic(picList) {
                return picList.map(function (item) {
                    return {'src': item.accessUrl}
                });
            }
        }
    }
</script>
<style scoped>
    .menu-tools {
        border-bottom: 1px solid #e7eaec;
    }
</style>
