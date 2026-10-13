<!--通知的回复列表-->
<template>
    <div class="app-container calendar-list-container">
        <backtool>
             <a :href="exportAllUrl" v-if="!mynew" target= "_blank" download="全部导出"><el-button type="primary" size="medium">全部导出</el-button></a>
            <a v-if="exportIds.length>0&&!mynew" :href="exportChosedUrl" target= "_blank"  download="选择导出"><el-button size="medium" type="primary">选择导出</el-button></a>
            <el-button v-if="exportIds.length === 0&&!mynew"  size="medium" type="primary" @click="noChoseInfo">选择导出</el-button>
            <el-input class="search-input search-input--right" placeholder="回复人姓名" size="medium"  v-model="listQuery.searchTitle"   @keyup.enter.native="handleInputChange">
                <el-button slot="append" icon="el-icon-search" @click="handleInputChange"></el-button>
            </el-input>
        </backtool>
      
        <el-table stripe :key='replyNoticeTable' :data="list" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%" :height="maxH" @selection-change="selectionChange">
            <el-table-column type="selection" width="55" v-if="!mynew"></el-table-column>
            <el-table-column align="center" label="序号" width="65">
                <template slot-scope="scope">
                    <span>{{(listQuery.pageNo-1)*listQuery.pageSize+scope.$index+1}}</span>
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
                    <span>{{scope.row.replyTime|trimTime }}</span>
                </template>
            </el-table-column>

        </el-table>
        <div v-show="!listLoading" class="pagination-container">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.pageNo" :page-sizes="[10,20,30, 50]" :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>
        </div>
    </div>
</template>
<script>
import { getReplyNoticeList,getReplyNoticeListnew} from '@/api/notice';
import Backtool from '@/components/BackTool';
import {mapGetters} from 'vuex';
import mixin from '@/mixins/windowResize';
import debounce from 'lodash/debounce';
import ImagePreviewer from '@/components/ImagePreviewer/ImagePreviewer.vue';
export default {
    components: {
        Backtool,
        ImagePreviewer
    },
    data() {
        return {
            replyNoticeTable: '3',
            list: null,
            total: null,
            listLoading: false,
            listQuery: {
                pageNo: 1,
                pageSize: 20,
                searchTitle: '',
                noticeId: '',
                type:'1'
            },
            exportAllUrl:'',
            exportChosedUrl:'',
            exportIds:'',
            mynew:this.$route.query.mynew||0
        }
    },
    mixins: [mixin],
    filters: {
        trimTime(datetime){
            return datetime ? datetime.slice(0, datetime.lastIndexOf('.')) : '--';
        }
    },
    computed: {
        ...mapGetters(['isStandalone'])
    },
    created() {
        this.isStandalone ? this.listQuery.pageSize = 10 : this.listQuery.pageSize = 20;
        this.listQuery.noticeId = this.$route.query.id;
        this.listQuery.type=this.$route.query.type;
        this.getList();
        this.exportAllUrl=global.BasePath + 'structure/notice/exportNoticeReply?noticeId='+this.listQuery.noticeId+'&token=' + this.$store.getters.token;
        
    },
    methods: {
        getList() {
            this.listLoading = true;
            if(this.mynew){
                 getReplyNoticeListnew(this.listQuery).then(res => {
                let data = res.data.data;
                this.list = data.dataList;
                this.total = data.pagination.total;
                this.listLoading = false;
            });

            }else{
                getReplyNoticeList(this.listQuery).then(res => {
                let data = res.data.data;
                this.list = data.dataList;
                this.total = data.pagination.total;
                this.listLoading = false;
            });
            }
           
        },
        handleSizeChange(val) {
            this.listQuery.pageSize = val;
            this.getList();
        },
        handleCurrentChange(val) {
            this.listQuery.pageNo = val;
            this.getList();
        },
        goback() {
            this.$router.back();
        },
        handleInputChange:debounce(function(val) {
            this.listQuery.pageNo = 1;
            this.getList();
        },500),
        selectionChange(selection){
            let array = [];
            selection.forEach(function(item){
                array.push(item.id);
            });
            this.exportIds=array.toString();
            this.exportChosedUrl=global.BasePath + 'structure/notice/exportNoticeReply?noticeId='+this.listQuery.noticeId+'&token=' + this.$store.getters.token+'&replyIds='+this.exportIds;
        },
        noChoseInfo(){
            this.$message({
              message: '请选择要导出的数据！',
              type: 'warning'
            });
        },
        getViewPic(picList){
           return picList.map(function(item){
               return {'src':item.accessUrl}
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
