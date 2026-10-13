<template>
    <div class="read_task_wrap">
        <div class="header">
             <el-button  size="medium" @click="$router.back()">返回</el-button>
            <el-button size="medium" type="primary" @click="stuhomeworkadd()">上传作业</el-button>
        </div>
          <el-table stripe :data="dataList" border :height="nobottommaxH">
                <el-table-column align="center" label="作业主题" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span style="color: #409eff;cursor:pointer;" @click="stuhomeworkinfo(scope.row.id)">{{scope.row.title || '--'}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center"  label="学生姓名" show-overflow-tooltip>
                      <template slot-scope="scope">
                            <span v-for="(item, index) in JSON.parse(scope.row.stuJson)" :key="index">
                                {{item.name}}&nbsp;&nbsp;
                            </span>
                    </template>
                </el-table-column>
                <el-table-column align="center"  label="班级" show-overflow-tooltip>
                    <template slot-scope="scope">
                      {{scope.row.classJson}}
                     </template>
                </el-table-column>
                <el-table-column align="center"  label="上传时间" show-overflow-tooltip>
                     <template slot-scope="scope">
                        <span>{{scope.row.createTime.substring(0, 19)}}</span>
                    </template>
                </el-table-column>
               <el-table-column align="center"  label="点赞数" show-overflow-tooltip>
                     <template slot-scope="scope">
                        <span>{{scope.row.praiseCount||0}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="状态">
                    <template slot-scope="scope">
                        <el-tag  size="mini" v-if="scope.row.state === 2"  type="info">未加精</el-tag>
                        <el-tag  size="mini" v-if="scope.row.state === 1" >已加精</el-tag>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="操作">
                    <template slot-scope="scope">
                        <el-button size="small" type="text" @click.native="stuhomeworkadd(scope.row.id)"  >编辑</el-button>
                        <el-button size="small" type="text" @click.native="delLanguageBookHomeworkStu(scope.row.id)" class="buttontextred">删除</el-button>
                        <el-button size="small" type="text" @click.native="updateLanguageBookHomeworkStu(scope.row.id,1)"  v-if="scope.row.state === 2">加精</el-button>
                       <el-button size="small" type="text" @click.native="updateLanguageBookHomeworkStu(scope.row.id,2)"  v-if="scope.row.state === 1">取消加精</el-button>
                    </template>
                </el-table-column>
            </el-table>
    </div>
</template>

<script>
    import mixins from '@/mixins/windowResize';
    import {delLanguageBookHomeworkStu,getLanguageBookHomeworkStuList,updateLanguageBookHomeworkStu} from '@/api/stackRoom';

    export default {
        name: "readTaskIndex",
        data() {
            return {
                bookId: this.$route.query.bookId,
                homeworkId: this.$route.query.homeworkId,
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
            this.getLanguageBookHomeworkStuList();
        },
        methods: {
            stuhomeworkadd(homeworkStuId) {
                if (homeworkStuId) {
                    this.$router.push({path: 'stuhomeworkadd', query: {homeworkStuId: homeworkStuId,bookId:this.bookId,homeworkId:this.homeworkId}})
                } else {
                    this.$router.push({path: 'stuhomeworkadd', query: {bookId:this.bookId,homeworkId:this.homeworkId}})
                }
            },
            stuhomeworkinfo(homeworkStuId) {
                this.$router.push({path: 'stuhomeworkinfo', query: {homeworkStuId: homeworkStuId,bookId:this.bookId,homeworkId:this.homeworkId}})
            },
            // 发布任务
            updateLanguageBookHomeworkStu(homeworkStuId,state) {
                this.$confirm('是否'+(state==1?'加精':'取消加精')+'当前作业？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                     updateLanguageBookHomeworkStu({
                        bookId: this.bookId,
                        state: state,
                        id:homeworkStuId,
                        homeworkId:this.homeworkId
                    }).then(res => {
                        if (res.data.code === 200 && res.data.result) {
                            this.$message.success('操作成功');
                            this.getLanguageBookHomeworkStuList();
                        } else {
                            this.$message.warning(res.data.msg);
                        }
                    });
                }).catch(() => {
                });
            },
            getLanguageBookHomeworkStuList() {
                getLanguageBookHomeworkStuList(this.homeworkId).then(res => {
                    let data = res.data.data;
                    if (res.data.code === 200 && res.data.result) {
                        this.dataList = data
                    }
                });
            },
            // 删除
            delLanguageBookHomeworkStu(homeworkStuId) {
                this.$confirm('是否删除当前作业？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                      delLanguageBookHomeworkStu(homeworkStuId).then(res => {
                    if (res.data.code === 200 && res.data.result) {
                        this.$message.success('删除成功');
                        this.getLanguageBookHomeworkStuList();
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
