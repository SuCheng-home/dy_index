<template>
    <div class="read_task_wrap">
        <div class="header">
             <el-button  size="medium" @click="$router.back()">返回</el-button>
            <el-button size="medium" type="primary" @click="homeworkdesignadd()">上传设计</el-button>
        </div>
          <el-table stripe :data="dataList" border :height="nobottommaxH">
                 <el-table-column align="center" label="书籍" show-overflow-tooltip>
                     {{name}}
                 </el-table-column>
                <el-table-column align="center" label="主题" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span style="color: #409eff;cursor:pointer;" @click="homeworkdesigninfo(scope.row.id)">{{scope.row.title || '--'}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" prop="createUserName" label="设计人" show-overflow-tooltip>                
                    <template slot-scope="scope">
                        <span v-for="(item, index) in JSON.parse(scope.row.thJson)" :key="index">
                            {{item.name}}
                        </span>
                    </template>
                </el-table-column>
                <el-table-column align="center" prop="homeworkCount" label="作业上传数" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" prop="goodHomeworkCount" label="优秀作业数" show-overflow-tooltip></el-table-column>
              
                <el-table-column align="center" label="状态">
                    <template slot-scope="scope">
                        <el-tag  size="mini" v-if="scope.row.state === 2"  type="info">未上架</el-tag>
                        <el-tag  size="mini" v-if="scope.row.state === 1" >已上架</el-tag>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="操作">
                    <template slot-scope="scope">
                        <el-button size="small" type="text" @click.native="stuhomework(scope.row.id)">学生作业</el-button>
                        <el-button size="small" type="text" @click.native="homeworkdesignadd(scope.row.id)">编辑</el-button>
                        <el-button size="small" type="text" @click.native="delLanguageBookHomework(scope.row.id)" class="buttontextred">删除</el-button>
                        <el-button size="small" type="text" @click.native="updateLanguageBookHomework(scope.row.id,1)"  v-if="scope.row.state === 2">上架</el-button>
                       <el-button size="small" type="text" @click.native="updateLanguageBookHomework(scope.row.id,2)"  v-if="scope.row.state === 1">下架</el-button>
                    </template>
                </el-table-column>
            </el-table>
    </div>
</template>

<script>
    import mixins from '@/mixins/windowResize';
    import {delLanguageBookHomework,getLanguageBookHomeworkList,updateLanguageBookHomework} from '@/api/stackRoom';

    export default {
        name: "readTaskIndex",
        data() {
            return {
                bookId: this.$route.query.bookId,
                name: this.$route.query.name,
                todayDate: this.$moment(new Date()).format('YYYY-MM-DD'),
                pagination: {
                    pageNo: 1,
                    pageSize: 20,
                    total: null
                },
                dataList: []
            }
        },
        mixins: [mixins],
        created() {
            this.getLanguageBookHomeworkList();
        },
        methods: {
            homeworkdesignadd(homeworkId) {
                if (homeworkId) {
                    this.$router.push({path: 'homeworkdesignadd', query: {homeworkId: homeworkId,bookId:this.bookId}})
                } else {
                    this.$router.push({path: 'homeworkdesignadd', query: {bookId:this.bookId}})
                }
            },
            homeworkdesigninfo(homeworkId) {
                this.$router.push({path: 'homeworkdesigninfo', query: {homeworkId: homeworkId,bookId:this.bookId}})
            },
             stuhomework(homeworkId) {
                this.$router.push({path: 'stuhomework', query: {homeworkId: homeworkId,bookId:this.bookId}})
            },
            // 发布任务
            updateLanguageBookHomework(homeworkId,state) {
                this.$confirm('是否'+(state==1?'上架':'下架')+'当前设计？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                     updateLanguageBookHomework({
                        bookId: this.bookId,
                        state: state,
                        id:homeworkId
                    }).then(res => {
                        if (res.data.code === 200 && res.data.result) {
                            this.$message.success('操作成功');
                            this.getLanguageBookHomeworkList();
                        } else {
                            this.$message.warning(res.data.msg);
                        }
                    });
                }).catch(() => {
                });
            },
            toTaskRecord(taskId, startDate, endDate) {
                this.$router.push({
                    path: 'readTaskRecords',
                    query: {taskId: taskId, startDate: startDate, endDate: endDate}
                })
            },
            getLanguageBookHomeworkList() {
                getLanguageBookHomeworkList(this.bookId).then(res => {
                    let data = res.data.data;
                    if (res.data.code === 200 && res.data.result) {
                        this.dataList = data
                    }
                });
            },
            // 删除
            delLanguageBookHomework(homeworkId) {
                this.$confirm('是否删除当前设计？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                      delLanguageBookHomework(homeworkId).then(res => {
                    if (res.data.code === 200 && res.data.result) {
                        this.$message.success('删除成功');
                        this.getLanguageBookHomeworkList();
                    } else {
                        this.$message.warning(res.data.msg);
                    }
                });
                }).catch(() => {
                });
            },
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
