<template>
    <div class="read_task_wrap">
        <div class="header">
            <el-button size="medium" type="primary" @click="addTask('')">创建</el-button>
        </div>
        <div class="read_task_box">
            <el-table stripe :data="readTaskList" border :height="maxH">
                <el-table-column align="center" label="主题" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span style="color: #409eff;cursor:pointer;" @click="toTaskInfo(scope.row.id)">{{scope.row.title || '--'}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" prop="bookName" label="阅读书籍"
                                 show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="阅读周期">
                    <template slot-scope="scope">
                        <span>{{scope.row.startDate}}~{{scope.row.endDate}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="发布范围" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span>{{scope.row.classNames}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="状态">
                    <template slot-scope="scope">
                        <el-tag  size="mini" v-if="scope.row.state === 1"  type="info">草稿</el-tag>
                        <el-tag  size="mini" v-else-if="scope.row.state === 2 && todayDate < scope.row.startDate"
                                type="info">未开始
                        </el-tag>
                        <el-tag  size="mini" v-else-if="scope.row.state === 2 && todayDate > scope.row.endDate" 
                                type="success">已结束
                        </el-tag>
                        <el-tag  size="mini" v-else-if="scope.row.state === 2" >进行中</el-tag>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="操作">
                    <template slot-scope="scope">
                        <el-button size="small" type="text" @click.native="addTask(scope.row.id)"
                                   v-if="scope.row.state === 1">编辑
                        </el-button>
                        <el-button size="small" type="text" @click.native="delCurrentTask(scope.row.id)" class="buttontextred">删除
                        </el-button>
                        <el-button size="small" type="text" @click.native="sendTask(scope.row.id)"
                                   v-if="scope.row.state === 1">
                            发布
                        </el-button>
                        <el-button size="small" type="text"
                                   @click.native="toTaskRecord(scope.row.id, scope.row.startDate, scope.row.endDate)"
                                   v-else-if="scope.row.state === 2 && todayDate >= scope.row.startDate">打卡记录
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination-container" style="margin-top: 15px;">
                <el-pagination @size-change="sizeChangeHandler" @current-change="currentChangeHandler"
                               :current-page.sync="pagination.pageNo" :page-sizes="[10, 20, 30, 50]"
                               :page-size.sync="pagination.pageSize"
                               layout="total, sizes, prev, pager, next, jumper"
                               :total="pagination.total">
                </el-pagination>
            </div>
        </div>
    </div>
</template>

<script>
    import mixins from '@/mixins/windowResize';
    import {getLanguageBookTaskList, delLanguageBookTask, sendLanguageBookTask} from '@/api/stackRoom';

    export default {
        name: "readTaskIndex",
        data() {
            return {
                todayDate: this.$moment(new Date()).format('YYYY-MM-DD'),
                pagination: {
                    pageNo: 1,
                    pageSize: 20,
                    total: null
                },
                readTaskList: []
            }
        },
        mixins: [mixins],
        created() {
            this.getLanguageBookTaskList();
        },
        methods: {
            addTask(taskId) {
                if (taskId) {
                    this.$router.push({path: 'readTaskAdd', query: {taskId: taskId}})
                } else {
                    this.$router.push({path: 'readTaskAdd'})
                }
            },
            toTaskInfo(taskId) {
                this.$router.push({path: 'readTaskInfo', query: {taskId: taskId}})
            },
            // 发布任务
            sendTask(taskId) {
                this.$confirm('是否发布当前任务？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.sendLanguageBookTask(taskId);
                }).catch(() => {
                });
            },
            sendLanguageBookTask(taskId) {
                sendLanguageBookTask({
                    id: taskId,
                    state: 2
                }).then(res => {
                    if (res.data.code === 200 && res.data.result) {
                        this.$message.success('发布成功');
                        this.getLanguageBookTaskList();
                    } else {
                        this.$message.warning(res.data.msg);
                    }
                });
            },
            toTaskRecord(taskId, startDate, endDate) {
                this.$router.push({
                    path: 'readTaskRecords',
                    query: {taskId: taskId, startDate: startDate, endDate: endDate}
                })
            },
            getLanguageBookTaskList() {
                getLanguageBookTaskList({
                    pageNo: this.pagination.pageNo,
                    pageSize: this.pagination.pageSize
                }).then(res => {
                    let data = res.data.data;
                    if (res.data.code === 200 && res.data.result) {
                        this.readTaskList = data.dataList.map(item => {
                            item.classNames = JSON.parse(item.classJson).map(minItem => minItem.name).toString();
                            return item;
                        });
                        this.pagination.total = data.pagination.total;
                    }
                });
            },
            // 删除
            delCurrentTask(taskId) {
                this.$confirm('是否删除当前任务？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.delLanguageBookTask(taskId);
                }).catch(() => {
                });
            },
            delLanguageBookTask(taskId) {
                delLanguageBookTask({taskId: taskId}).then(res => {
                    if (res.data.code === 200 && res.data.result) {
                        this.$message.success('删除成功');
                        this.getLanguageBookTaskList();
                    } else {
                        this.$message.warning(res.data.msg);
                    }
                });
            },
            sizeChangeHandler() {
                this.pagination.pageNo = 1;
                this.getLanguageBookTaskList();
            },
            currentChangeHandler() {
                this.getLanguageBookTaskList();
            }
        }
    }
</script>

<style lang="scss" scoped>
    .read_task_wrap {
        padding: 12px;

        .header {
            padding-bottom: 10px;
        }
    }
</style>
