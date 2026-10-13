<template>
    <div id="evTeaList" class="app-container calendar-list-container">
        <div class="filter-container">
            <el-row>
                <el-col :span="19">
                    <div class="btns">
                        <el-button type="primary" size="medium" @click="releaseTemplateadd()">新增</el-button>
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
                    <span class="link-type" @click="releaseTemplateinfo(scope.row.id)">
                        {{scope.row.title}}
                    </span>
                </template>
            </el-table-column>
            <!-- <el-table-column align="center" label="地点" show-overflow-tooltip prop="adress">
            </el-table-column> -->
            <el-table-column show-overflow-tooltip align="center" label="参与人员">
                <template slot-scope="scope">
                    <template v-if="scope.row.scopeLimit==2">
                        <span  v-for="(appointerEntry, index) in JSON.parse(scope.row.departJson||'[]')" :key="index">&nbsp;{{appointerEntry.name}}&nbsp;</span>
                        <span  v-for="(appointerEntry, index) in JSON.parse(scope.row.userJson||'[]')" :key="index">&nbsp;{{appointerEntry.name}}&nbsp;</span>
                    </template>
                    <template v-if="scope.row.scopeLimit==1">
                       <span v-if="scopeSch==1">&nbsp;全校&nbsp;</span>
                       <span v-if="scopeTh==1">&nbsp;老师&nbsp;</span>
                       <span v-if="scopeSt==1">&nbsp;学生&nbsp;</span>
                       
                    </template>
                </template>
            </el-table-column>
             <el-table-column show-overflow-tooltip align="center" label="时间">
                <template slot-scope="scope">
                    <template>
                        <span>{{scope.row.pushTime||'--'}}</span>
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

            <el-table-column align="center" label="操作">
                <template slot-scope="scope">
                    <el-button :disabled="scope.row.status == 5" size="small" type="text"  @click="releaseTemplateadd(scope.row.id)">编辑</el-button>
                    <el-button size="small" type="text" @click.native="delMsg(scope.row.id)" class="buttontextred">删除</el-button>
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
    import {geMsgList,delMsg,getMsgInit} from '@/api/releaseTemplate';
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
                },
                scopePh:2,
                scopeSch:2,
                scopeSt:2,
                scopeTh:2,

            }
        },
        activated() {
            this.geMsgList();
        },
        created() {
            this.geMsgList();
             getMsgInit(this.$route.query.newmoduleCode)
                    .then(data => {
                        this.scopePh=data.data.data.scopePh
                        this.scopeSch=data.data.data.scopeSch
                        this.scopeSt=data.data.data.scopeSt
                        this.scopeTh=data.data.data.scopeTh
                    })

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
            releaseTemplateinfo(id) {
                this.$router.push({
                    path: "releaseTemplateinfo",
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
                    userId:0,
                    status:0
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
