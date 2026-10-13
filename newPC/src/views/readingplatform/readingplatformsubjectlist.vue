<template>
    <div class="readingplatformsubjectlist">
        <div class="header">
           <el-button @click="$router.back()" type="default" size="medium">返回</el-button>
           <el-button type="primary" size="medium" @click="jumpTo('readingplatformsubjectadd',{platBookId:listQuery.platBookId})">新建</el-button>                    
        </div>
            <el-table
                ref="multipleTable"
                :data="dataList"
                :height="maxH"
                border
                style="width: 100%"
              >      		
                <el-table-column  label="任务名称" show-overflow-tooltip align="center">
                    <template slot-scope="scope">
                        <span  class="link"  @click="jumpTo('readingplatformsubjectdetails',{id:scope.row.id})">{{ scope.row.taskName }}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="任务设计人"  >
                    <template slot-scope="scope">{{ scope.row.taskDesigners?scope.row.taskDesigners:"----" }}</template>
                </el-table-column>
                <el-table-column align="center" label="题型"  >
                    <template slot-scope="scope">
                        <span v-if="scope.row.taskNature==1">简答题</span>
                        <span v-if="scope.row.taskNature==2">判断题</span>
                        <span v-if="scope.row.taskNature==3">选择题</span>
                        </template>
                </el-table-column>
                <el-table-column align="center" label="答题方式" >
                    <template slot-scope="scope">
                        <span v-if="scope.row.taskNature==1">
                            <span v-if="scope.row.taskType==0">不限制</span>
                         <span v-if="scope.row.taskType==1">图文</span>
                         <span v-if="scope.row.taskType==2">语音</span>
                         <span v-if="scope.row.taskType==3">视频</span>
                        </span>
                         <span v-else>
                             ----
                        </span>
                        
                    </template>
                </el-table-column>
                <el-table-column align="center" label="任务奖励积分">
                    <template slot-scope="scope">{{ scope.row.points }}</template>
                </el-table-column>
                <el-table-column label="操作" width="160" align="center">
                    <template slot-scope="scope">
                        <div>
                            <el-button size="small" type="text" @click="jumpTo('readingplatformsubjecteidt',{id:scope.row.id,platBookId:listQuery.platBookId})"
                                      >
                                编辑
                            </el-button>
                            <el-button size="small" type="text" @click="deleteHandler(scope.row.id)" class="buttontextred">
                                删除
                            </el-button>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination
                class="pagination-container"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page.sync="listQuery.pageNo"
                :page-sizes="[10,20,30, 50]"
                :page-size="listQuery.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
            </el-pagination>
    </div>
</template>
<script>
    import mixin from '@/mixins/windowResize';
    import {delReadPlatBookTask, getReadPlatBookTaskListPc} from '@/api/readingplatform';
    export default {
        data() {
            return {
                dataList: [],
                listQuery: {
                    pageNo: 1,
                    pageSize: 20,
                    platBookId:this.$route.query.id
                },
                total: null,
            }
        },
        created() {
            this.getSchoolActivityPageListFunc();
        },
        mixins: [
            mixin
        ],
        methods: {
            jumpTo(path, query = {}) {
                this.$router.push({
                    path,
                    query
                })
            },
            deleteHandler(id) {
                //单个删除
                this.$confirm('是否删除？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    delReadPlatBookTask(id).then(res => res.data).then(data => {
                    if (data.code === 200) {
                        this.$message({
                            message: '删除成功',
                            type: 'success'
                        });
                        this.getSchoolActivityPageListFunc();
                    }
                }).catch(() => {
                });
                }).catch(() => {

                });
            },
            handleSizeChange(val) {
                this.listQuery.pageNo = 1;
                this.listQuery.pageSize = val;
                this.getSchoolActivityPageListFunc();
            },
            handleCurrentChange(val) {
                this.listQuery.pageNo = val;
                this.getSchoolActivityPageListFunc();
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            getSchoolActivityPageListFunc() {
                getReadPlatBookTaskListPc(this.listQuery).then(res => res.data).then(data => {
                    if (data.code === 200) {
                        let activityData = data.data;
                        this.dataList = activityData.dataList;
                        if (this.dataList.length == 0 && this.listQuery.pageNo !== 1) {
                            this.listQuery.pageNo--;
                            this.getSchoolActivityPageListFunc();
                        }
                        this.total = activityData.pagination.total;
                    } else {
                    }
                }).catch(() => {
                })
            }
        }
    }
</script>
<style lang="scss" scoped>
    .readingplatformsubjectlist {
        padding:12px;
        box-sizing: border-box;
        .header {
            margin-bottom: 10px;
        }
        .link {
            color: #409eff;
            cursor: pointer;
        }
    }
</style>
