<template>
    <div class="page">
        <div class="header">
            <back-tool>
                <el-button  size="medium" type="primary" @click="jumpToPage('schoolTimeAdd')">增加学期</el-button>
            </back-tool>
        </div>
        <div>
            <el-table
                    :data="dataList"
                    border
                    style="width: 100%"
                    :height="maxH"
            >
                <el-table-column
                        label="学期"
                        show-overflow-tooltip
                        :resizable="false"
                >
                    <template slot-scope="scope">
                        <a class="link-type" href="javascript:;" @click="jumpToPage('schoolTimeSet',{schoolTimeId:scope.row.id})">
                            {{ scope.row.schoolTimeName }}
                        </a>
                        <!-- <router-link class="link-type" :to="{ path: 'schoolTimeSet', query: { schoolTimeId: scope.row.id } }">
                            
                        </router-link> -->
                    </template>
                </el-table-column>
                <el-table-column
                        label="开学时间"
                        align="center"
                        width="240px"
                        :resizable="false"
                >
                    <template slot-scope="scope">
                        <span>{{scope.row.startDate }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="createUser"
                        label="	结束时间"
                        align="center"
                        width="240px"
                        :resizable="false"
                >
                    <template slot-scope="scope">
                        <span>{{scope.row.endDate }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                        label="操作"
                        align="center"
                        width="300px"
                        :resizable="false"
                >
                    <template slot-scope="scope">
                        <el-button
                                size="small"
                                type="text"
                                @click="jumpToPage('schoolTimeSet', { schoolTimeId: scope.row.id })"
                        >校历设置
                        </el-button>
                        <el-button
                                size="small"
                                type="text"
                                @click="jumpToPage('schoolTimeEdit', {id: scope.row.id})"
                        >编辑
                        </el-button>
                        <el-button size="small" type="text" @click="setCurrentTerm(scope.row.id)" v-if="scope.row.isCurrent === 0">设为当前学期
                        </el-button>
                        <el-button size="small" type="text" @click="syncSchoolCalendarFunc(scope.row.term,scope.row.schoolYear)" v-if="scope.row.isCurrent === 1">同步校历
                        </el-button>
                        <div class="term-hint" :class="scope.row.isCurrent === 1 ? 'term-hint--current' : ''"></div>
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
                        :page-count="pages"
                        :total="total"
                >
                </el-pagination>
            </div>
        </div>
    </div>

</template>

<script>
    import windowResizeMixin from '@/mixins/windowResize';
    import { querySchoolTimeListBySchoolId, setIsCurrent ,syncSchoolCalendar} from '@/api/schoolTimeList';
    import BackTool from '@/components/BackTool';
    export default {
        components: {
            BackTool
        },
        data: function() {
            return {
                dataList: [],
                searchLoading: false,
                pageSize: 20,
                pageNo: 1,
                pages: 1,
                total: 0
            }
        },
        mixins: [windowResizeMixin],
        methods: {
            querySchoolTimeListBySchoolIdHandler(){
                querySchoolTimeListBySchoolId({
                    pageNo: this.pageNo,
                    pageSize: this.pageSize
                }).then(res => res.data)
                .then(data => {
                    if(data.result) {
                        this.dataList = data.data.dataList;
                        this.total = data.data.pagination.total;
                        this.pages = data.data.pagination.pages;
                    }
                })
                .catch(() => {
                    this.$message.error('error');
                })
            },
            syncSchoolCalendarFunc(term,schoolYear){
                this.$confirm('同步本学期校历吗?', '提示', {
                    type: 'warning'
                }).then(() => {
                    syncSchoolCalendar({
                        term:term,
                        schoolYear:schoolYear
                    }).then(res=>{
                        if(res.data.code===200){
                            this.$message({
                                type: 'success',
                                message: '同步成功!'
                            });
                            this.querySchoolTimeListBySchoolIdHandler();
                        }
                    })
                }).catch(() => {
                    
                });
            },
            jumpToPage(path, query) {
                // if (query === undefined || query === null) {
                //     query = {}
                // }
                this.$router.push({
                    path:path,
                    query:query
                })
            },
            sizeChangeHandler(pageSize) {
                this.pageNo = 1;
                this.pageSize = pageSize;
                this.querySchoolTimeListBySchoolIdHandler();
            },
            currentChangeHandler(pageNo) {
                this.pageNo = pageNo;
                this.querySchoolTimeListBySchoolIdHandler();
            },
            setCurrentTerm(id) {
                setIsCurrent({
                    id
                })
                    .then(res => res.data)
                    .then(data => {
                        if(data.result ) {
                            this.$message({
                                message: '设置成功',
                                type: 'success'
                            });
                            this.querySchoolTimeListBySchoolIdHandler();
                        }
                    })
                    .catch(() => {
                        this.$message.error('error');
                    });
            }
        },
        created() {
            this.querySchoolTimeListBySchoolIdHandler();
                
        }
    }
</script>

<style scoped>
    .page {
        padding:12px;
    }

    .search-input {
        margin-left: 10px;
        width: 220px;
    }
    .term-hint {
        width: 10px;
        height: 10px;
        float: right;
        margin-right: 10px;
        line-height: 37px;
        display: block;
        float: right;
        border-radius: 20px;
        margin: 10px;
    }
    .term-hint--current {
        background-color: #F00;
    }
</style>
