<template>
    <div class="schoolLogindex">
        <div class="top">           
            <el-button type="primary" size="medium" @click="schoolLogadd()">新建</el-button>
              <a :href="downLoadHref" v-if="dataList.length" target="_blank" download="examName"> <el-button type="primary"  size="medium">导出</el-button></a>   
            <el-button type="primary" size="medium" @click="schoolLogSetup()">设置</el-button>
            <el-input class="search-input search-input--right" size="medium"  placeholder="请输入日期" v-model.trim="recordDate" @change="searchHandler"><el-button slot="append" icon="el-icon-search" @click="searchHandler"></el-button></el-input>
        </div>
        <el-table stripe :data="dataList" border fit highlight-current-row   style="width: 100%" :height="`${maxH}px`">            					              
            <el-table-column align="center" label="日期" width="100" show-overflow-tooltip>
                <template slot-scope="scope">
                    <span class="link" @click="schoolLogdetailsone(scope.row.id)">{{scope.row.recordDate}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="星期" width="100" show-overflow-tooltip>
                <template slot-scope="scope">
                    <span>{{scope.row.recordWeek}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="教职工出勤人数" show-overflow-tooltip>
                <template slot-scope="scope">
                    <span>{{scope.row.teacherWorkNum}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="学生出勤人数" show-overflow-tooltip>
                <template slot-scope="scope">
                    <span>{{scope.row.studentWorkNum}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="创建人" show-overflow-tooltip>
                <template slot-scope="scope">
                    <span>{{scope.row.createName}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="创建时间" show-overflow-tooltip>
                <template slot-scope="scope">
                    <span>{{scope.row.createTime.split(".")[0]}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center"  label="状态" width="100"  show-overflow-tooltip>
                <template slot-scope="scope">
                    <el-tag  size="mini"  type="info" v-if="scope.row.state==1">草稿</el-tag>
                    <el-tag  size="mini"  type="success" v-if="scope.row.state==2">已发布</el-tag>
                </template>
            </el-table-column>
            <el-table-column align="center" label="操作" width="150">
                <template slot-scope="scope">
                    <el-button size="small" type="text"  @click.native="schoolLogdetailsone(scope.row.id)">详情 </el-button>
                    <el-button size="small" type="text"  @click.native="schoolLogeidt(scope.row.id)" :disabled="scope.row.state==2">编辑 </el-button>
                    <el-button size="small" type="text"  @click.native="delSchoolLogs(scope.row.id)" class="buttontextred">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="pagination-container">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="pagination.pageNo" :page-sizes="[10,20,30, 50]" :page-size.sync="pagination.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="pagination.total"> </el-pagination>
        </div>
    </div>
</template>
<script>
    import windowResize from "@/mixins/windowResize";
    import {findSchoolLogListByPage, delSchoolLog} from '@/api/schoolLog';
    export default {
        data() {
            return {
                recordDate: '',
                dataList: [],
                downLoadHref:'',
                pagination:{
                   pageNo:1,
                   pageSize:20,
                   total:null
                }
            }
        },
        mixins: [windowResize],       
        created() {
            this.findSchoolLogListByPages()
        },
        methods: {
            //搜索
            searchHandler() {
                this.pagination.pageNo = 1;
                this.findSchoolLogListByPages();
            },
            //码数
            handleSizeChange() {
                this.pagination.pageNo = 1;
                this.findSchoolLogListByPages();
            },
            //页数
            handleCurrentChange() {
                this.findSchoolLogListByPages();
            },
            //获取列表
            findSchoolLogListByPages() {
                this.downLoadHref =global.BasePath+"structure/schoolLog/exportSchoolLog?recordDate="+this.recordDate+"&token=" +this.$store.getters.token;
                findSchoolLogListByPage(this.pagination.pageNo, this.pagination.pageSize, this.recordDate)
                    .then(res => res.data)
                    .then(data => {
                        this.pagination.total = data.data.pagination.total;
                        this.dataList = data.data.dataList;
                    })
            },
            //删除
            delSchoolLogs(id) {
                this.$confirm('是否删除此日志', '删除', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    delSchoolLog(id).then(res => res.data).then(data => {
                            if(data.result) {
                                  this.$message({type: 'success', message: '删除成功!' });
                                  this.findSchoolLogListByPages();
                           }
                        })
                });
            },
            //新增
             schoolLogadd() {
                this.$router.push({path: 'schoolLogadd'});
            },
            //设置
             schoolLogSetup() {
                this.$router.push({path: 'schoolLogSetup'});
            },
            //编辑
             schoolLogeidt(id) {
                this.$router.push({path: 'schoolLogeidt', query: {id: id}});
            },
            //详情
             schoolLogdetailsone(id) {
                this.$router.push({path: 'schoolLogdetailsone', query: {id: id}});
            },
        },
    }
</script>

<style lang="scss" scoped>
   .schoolLogindex{
       padding:12px;
       .top{
           padding-bottom: 10px;
       }
       .link{
           color: #409EFF;
           cursor:pointer;
       }
       .pagination-container{
        margin-top: 10px !important;
       }
   }
  
   
</style>
