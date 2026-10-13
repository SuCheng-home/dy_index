<template>
    <div id="evTeaList" class="app-container calendar-list-container">
        <div class="filter-container">
            <el-row>
                <el-col :span="19">
                    <div class="btns">
                         &nbsp;
                    </div>
                </el-col>
                <el-col :span="5">
                    <el-input size="medium" placeholder="请输入主题" icon="el-icon-search" @keyup.enter.native="handleFilter"  v-model="title">
                        <el-button slot="append" icon="el-icon-search" @click="handleFilter"></el-button>
                    </el-input>
                </el-col>
            </el-row>
        </div>
        <el-table stripe :data="dataList" border fit highlight-current-row
                  style="width: 100%" :height="maxH">
            <el-table-column align="center" label="主题" show-overflow-tooltip>
                <template slot-scope="scope">
                    <span class="link-type" @click="newreleaseTemplateinfo(scope.row.id)">
                        {{scope.row.title}}
                    </span>
                </template>
            </el-table-column>
             <el-table-column show-overflow-tooltip align="center" label="时间">
                <template slot-scope="scope">
                    <template>
                        <span>{{scope.row.pushTime}}</span>
                    </template>
                </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip align="center" prop="readCount" label="阅读">
            </el-table-column>
            <el-table-column class-name="status-col" align="center" label="状态">
                <template slot-scope="scope">
                    <el-tag  size="mini"  type="info" v-if="scope.row.status == 1">草稿</el-tag>
                    <el-tag  size="mini" type="primary" v-if="scope.row.status == 2">已发布</el-tag>
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
                :total="pagination.total"
            >
            </el-pagination>
        </div>
    </div>
</template>

<script>
    import mixin from '@/mixins/windowResize';
    import baseMixin from '@/mixins/baseMixin';
    import {isShowByPermission} from '@/utils';
    import {geMsgList,delMsg} from '@/api/releaseTemplate';
    export default {
        name: 'matchActivityList',
        data() {
            return {
                dataList: [],
                title: '',
                moduleCode:this.$route.query.newmoduleCode,
                pagination:{
                    pageNo:1,
                    pageSize:20,
                    total:0
                }

            }
        },
        activated() {
            this.geMsgList();
        },
        created() {
            this.geMsgList();

        },
        mixins: [mixin, baseMixin],
        filters: {
            trimTime(datetime) {
                return datetime ? datetime.slice(0, datetime.lastIndexOf('.')) : '--';
            }
        },
        methods: {
            releaseTemplateadd(id) {
                this.$router.push({
                    path: "releaseTemplateadd",
                    query: {id:id,newmoduleCode:this.moduleCode}
                });
            },
            newreleaseTemplateinfo(id) {
                this.$router.push({
                    path: "newreleaseTemplateinfo",
                    query: {id:id,newmoduleCode:this.moduleCode}
                });
            },
            isShowByPermission,
            geMsgList() {
                geMsgList({
                    pageNo: this.pagination.pageNo,
                    pageSize: this.pagination.pageSize,
                    title: this.title,
                    moduleCode:this.moduleCode,
                    userId:this.$store.getters.userInfo.id,
                    status:2
                })
                    .then(res => res.data)
                    .then(data => {
                        this.dataList = data.data.dataList;
                        this.pagination.total = data.data.pagination.total;
                    })
            },
            delMsg(id) {
                this.$confirm('是否确定删除该活动?', '删除', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    delMsg(id)
                        .then(res => res.data)
                        .then(data => {
                            if(data.result) {
                                this.$message.success('删除成功');
                                this.geMsgList();
                            }
                        })
                }).catch(() => {
                });

            },
             handleFilter() {
                 this.pagination.pageNo = 1;
                this.geMsgList();
            },
            sizeChangeHandler(pageSize) {
                this.pagination.pageSize = pageSize;
                this.pagination.pageNo = 1;
                this.geMsgList();
            },
            currentChangeHandler(pageNo) {
                this.pagination.pageNo = pageNo;
                this.geMsgList();            
            }
        }
    }
</script>
<style lang="scss">
    @import "../../styles/mixin";
    #evTeaList {
        .pagination-container {
            margin-top: 10px;
        }
        .el-icon-paperclip {
            margin-right: 3px;
        }
        .filter-container {
            @include clearfix;
        }
        .btns {
            height: 36px;
        }
    }

</style>
