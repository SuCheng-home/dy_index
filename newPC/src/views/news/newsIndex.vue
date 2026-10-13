<template>
    <div class="page">
        <div class="header">
            <el-row>
                <el-col :span="19">                   
                    <!---->
                    <template>
                        <el-date-picker
                            v-model="daterange"
                            type="daterange" class="mywidthdaterange"
                            size="medium"
                            range-separator="-"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            :clearable="false"
                            @change="findDate()"
                            >
                        </el-date-picker>
                    </template>
                     <el-button type="primary" size="medium" @click="jumpToPage('newsAdd')">新增</el-button>
                    <el-button type="danger" size="medium" @click="batchDeleteHandler" :loading="deleteLoading" class="btnLeftLine">删除</el-button>
                    <a :href="exportURL" download="导出结果" target="_blank" v-if="dataList.length">
                        <el-button size="medium" class="btnLeftLine" type="primary" icon="upload">导出</el-button>
                    </a>
                </el-col>
                <el-col :span="5">
                    <el-input size="medium" placeholder="新闻标题/发布人" v-model.trim="searchTitle" 
                      @keyup.enter.native="searchTitleHandler">
                        <el-button slot="append" icon="el-icon-search" @click="searchTitleHandler"></el-button>
                    </el-input>
                </el-col>
            </el-row>
            
            
        </div>
        <div>
            <el-table
                    :data="dataList"
                    border
                    style="width: 100%"
                    @select="selectionChangeHandler"
                    @select-all="selectionChangeHandler"
                    :height="maxH"
            >
                <el-table-column
                        type="selection"
                        align="center"
                        width="65px"
                        :resizable="false"
                >
                </el-table-column>
                <el-table-column
                        label="新闻标题"
                        show-overflow-tooltip
                        :resizable="false"
                >
                    <template slot-scope="scope">
                        <router-link class="link-type" :to="{ path: 'newsDetail', query: { newsId: scope.row.id } }">
                            {{ scope.row.title }}
                        </router-link>
                    </template>
                </el-table-column>
                <el-table-column
                        label="发布时间"
                        align="center"
                        width="160px"
                        :resizable="false"
                        show-overflow-tooltip
                >
                    <template slot-scope="scope">
                        <span>{{(!scope.row.releaseDate?"--":scope.row.releaseDate)| trimTime}}</span>
                    </template>
                </el-table-column>
                <el-table-column
                        label="发布人"
                        align="center"
                        width="100px"
                        :resizable="false"
                >
                    <template slot-scope="scope">
                        {{scope.row.createUser}}
                    </template>
                </el-table-column>
                <el-table-column
                        label="状态"
                        align="center"
                        width="100px"
                        :resizable="false"
                >
                    <template slot-scope="scope">
                        <el-tag  size="mini" :type="scope.row.state | stateToType">{{ scope.row.state | stateToText }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column
                        label="阅读数"
                        align="center"
                       width="80px"
                        :resizable="false"
                >
                    <template slot-scope="scope">
                        <span>{{ scope.row.state !== 3 ? scope.row.viewCount : '0' }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                        label="评论数"
                        align="center"
                        width="80px"
                        :resizable="false"
                >
                    <template slot-scope="scope">
                        <span v-if="scope.row.journalismCommentCount==0">{{scope.row.journalismCommentCount}}</span>
                        <router-link class="link-type" :to="{ path: 'commonList', query: { journalismId: scope.row.id } }"  v-else>
                            {{ scope.row.journalismCommentCount }}
                        </router-link>
                    </template>
                </el-table-column>
                <el-table-column
                        label="操作"
                        align="center"
                        width="250px"
                        :resizable="false"
                >
                    <template slot-scope="scope">
                        <el-button size="small" type="text"   @click="topJournalism({id:scope.row.id,isTop:1})" v-if="scope.row.isTop==0&&scope.row.state==4">置顶</el-button>
                         <el-button size="small" type="text" @click="topJournalism({id:scope.row.id,isTop:0})"  v-if="scope.row.isTop==1&&scope.row.state==4" class="buttontextred">取消置顶</el-button>
                        <el-button
                                size="small"
                                type="text"
                                @click="jumpToPage('newsRebut',{newsId:scope.row.id})" v-if="scope.row.state==3">驳回原因
                        </el-button>
                        <el-button
                                size="small"
                                type="text"
                                @click="jumpToPage('newsEdit',{newsId:scope.row.id})" v-if="scope.row.state==1||scope.row.state==3">编辑
                        </el-button>
                        <el-button
                                size="small"
                                type="text"
                                @click="revokeHandler(scope.row.id)" v-if="scope.row.state==2&&(userInfo.name.indexOf(scope.row.createUser)!==-1)">撤回审批
                        </el-button>
                        <el-button
                                size="small"
                                type="text"
                                @click="jumpToPage('newsReleaseEdit',{newsId:scope.row.id})" v-if="scope.row.state==4">编辑
                        </el-button>
                        <el-button size="small" type="text" @click="deleteHandler(scope.row.id)" class="buttontextred">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination-container">
                <el-pagination
                        @size-change="sizeChangeHandler"
                        @current-change="currentChangeHandler"
                        :current-page.sync="pageNo"
                        :page-sizes="[10 , 20, 30, 50]"
                        :page-size="pageSize"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="total"
                >
                </el-pagination>
            </div>
        </div>
    </div>
</template>

<script>
    import windowResizeMixin from '@/mixins/windowResize';
    import {getNewsList, delNewsByIds,revoke,topJournalism} from '@/api/news';
    import {mapGetters} from 'vuex';
    export default {
        data: function () {
            return {
                daterange:[new Date(), new Date()],
                deleteLoading: false,
                searchLoading: false,
                searchTitle: '',
                pageSize: 20,
                pageNo: 1,
                dataList: [],
                selected: [],
                total: 0,
                exportURL:''
            };
        },
        mixins: [windowResizeMixin],
        created: function () {
            this.daterange[0] = new Date(this.$moment().set('date', 1).valueOf());
            this.startDate = this.$moment(this.daterange[0]).format('YYYY-MM-DD'); //时间
            this.endDate = this.$moment(this.daterange[1]).format('YYYY-MM-DD');
            this.getNewsListFunc();
        },
        computed: {
            ...mapGetters([
                'userInfo'
            ])
        },
        methods: {
            topJournalism(query){
                // revoke()
                this.$confirm('是否确定要'+(query.isTop==0?'取消置顶':'置顶')+'该新闻', query.isTop==0?'取消置顶':'置顶', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    topJournalism(query)
                    .then((res) => {
                        const data = res.data;
                        if (data.result) {
                            this.$message({
                                message: (query.isTop==0?'取消置顶':'置顶')+'成功',
                                type: 'success'
                            });
                            this.getNewsListFunc();
                        } else {
                            this.$message({
                                message: `${data.msg}`,
                                type: 'error'
                            });
                        }
                    })
                    .catch(() => {
                        this.$message({
                            message: `${data.msg}`,
                            type: 'error'
                        });
                    });
                }).catch(() => {
                });
            },
            revokeHandler(id){
                // revoke()
                this.$confirm('是否确定要撤回该新闻审批', '撤回审批', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    revoke({
                        newsId: id
                    })
                    .then((res) => {
                        const data = res.data;
                        if (data.result) {
                            this.$message({
                                message: '撤回审批成功',
                                type: 'success'
                            });
                            this.getNewsListFunc();
                        } else {
                            this.$message({
                                message: `${data.msg}`,
                                type: 'error'
                            });
                        }
                    })
                    .catch(() => {
                        this.$message({
                            message: `${data.msg}`,
                            type: 'error'
                        });
                    });
                }).catch(() => {
                });
            },
            getNewsListFunc(){
                if(this.startDate=='Invalid date'||this.startDate==''){
                    this.$message({
                        type: 'error',
                        message: '开始时间不能为空！'
                    });
                    return false;
                }
                if(this.endDate=='Invalid date'||this.endDate==''){
                    this.$message({
                        type: 'error',
                        message: '结束时间不能为空！'
                    });
                    return false;
                }
                if(this.$moment(this.endDate).format('YYYY-MM-DD')<this.$moment(this.startDate).format('YYYY-MM-DD')){
                    this.$message({
                        type: 'error',
                        message: '开始时间不能大于结束时间！'
                    });
                    return false;
                }
                getNewsList({
                    pageSize: this.pageSize,
                    pageNo: this.pageNo,
                    searchTitle: this.searchTitle,
                    startDate: this.startDate,
                    endDate: this.endDate
                }).then(res=>res.data).then(data=> {
                    if (data.code===200) {
                        this.dataList = data.data.dataList;
                        if(this.dataList.length==0&&this.pageNo!==1){
                            this.pageNo--;
                            this.getNewsListFunc();
                        }
                        this.total = data.data.pagination.total;
                        /*导出*/
                        this.exportURL=global.BasePath+'structure/news/downloadNewsList?startDate='+this.startDate+'&endDate='+this.endDate+'&searchTitle='+this.searchTitle+'&token='+this.$store.getters.token;
                    } else {
                        this.$message.error('error');
                    }
                })
                .catch(() => {
                    this.$message.error('error');
                });
            },
            findDate(){
                this.startDate = this.$moment(this.daterange[0]).format('YYYY-MM-DD'); //时间
                this.endDate = this.$moment(this.daterange[1]).format('YYYY-MM-DD'); //时间
                this.getNewsListFunc();
            },
            jumpToPage(path, query = {}) {
                this.$router.push({
                    path,
                    query
                })
            },
            selectionChangeHandler(selection) {
                this.selected = selection;
            },
            searchTitleHandler() {
                this.pageNo = 1;
                this.getNewsListFunc();
            },
            deleteHandler(id) {
                this.$confirm('是否确定要删除该新闻', '删除', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.delNewsByIdsFunc(id);
                }).catch(() => {
                });
            },
            delNewsByIdsFunc(id){
                delNewsByIds({
                    idStr: id
                })
                .then((res) => {
                    this.deleteLoading = false;
                    const data = res.data;
                    if (data.result) {
                        this.$message({
                            message: '删除成功',
                            type: 'success'
                        });
                        this.getNewsListFunc();
                    } else {
                        this.deleteLoading = false;
                        this.$message.error('error');
                    }
                })
                .catch(() => {
                    this.$message.error('error');
                });
            },
            batchDeleteHandler() {
                if (this.selected.length === 0) {
                    this.$message.error('请选择要删除的新闻');
                } else {
                    this.$confirm('是否确定要删除这些新闻', '删除', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        this.deleteLoading = true;
                        let arr = this.selected.map(obj => {
                            return obj.id
                        });
                        this.delNewsByIdsFunc(arr.toString());
                    }).catch(() => {
                    });
                }
            },
            sizeChangeHandler(pageSize) {
                this.pageNo = 1;
                this.pageSize = pageSize;
                this.getNewsListFunc();
            },
            currentChangeHandler(pageNo) {
                this.pageNo = pageNo;
                this.getNewsListFunc();
            },
            jumpEditPageHandler(state, id) {
                if (state !== 2) {
                    this.$router.push({path: 'newsEdit', query: {newsId: id}})
                }
            }
        },
        
        filters: {
            trimTime(datetime) {
                return datetime.slice(0, 19);
            },
            stateToType(state) {
                const typeArr = ['gray', 'primary', 'danger', 'success'];
                return typeArr[state - 1];
            },
            stateToText(state) {
                const stateTextArr = ['未发布', '待审核', '被驳回', '已发布'];
                return stateTextArr[state - 1];
            }
        }
    }
</script>

<style lang="scss" scoped>
    .page {
        padding:12px;
    }

    .header {
        margin-bottom:10px;
       
    }

    .search-input {
        vertical-align: middle;
    }
</style>
