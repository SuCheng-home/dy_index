<template>
    <div class="app-container ">
        <div class="filter-container">
             <el-select v-model="listQuery.schoolYearId" placeholder="请选择学年" @change="handleFilter" size="medium">
                  <el-option v-for="item in schoolYearList" :key="item.id" :label="item.year+'学年'" :value="item.id">
                  </el-option>
              </el-select>  
            <el-button type="primary" size="medium" @click="teachingPerformanceadd()">创建绩效表</el-button> 
            <el-button type="primary" size="medium" @click="teachingPerformanceyearlist()">教师学年绩效评估表</el-button>                      
        </div>
        <el-table stripe :data="dataList"  :height="`${maxH}px`" border style="width: 100%" > 
            <el-table-column  label="主题" show-overflow-tooltip>
                <template slot-scope="scope">
                    <span class="link-type" @click="teachingPerformancelistone(scope.row.id)">{{scope.row.themeName}}</span>
                </template>
            </el-table-column>  
            <el-table-column label="绩效MAX" align="center" width="120">
                <template slot-scope="scope">
                        {{scope.row.performanceMax}}
                </template>
            </el-table-column>   
            <el-table-column label="绩效MIN" align="center" >
                <template slot-scope="scope">
                        {{scope.row.performanceMin}}
                </template>
            </el-table-column>  
            <el-table-column label="均分第一增加百分比" align="center" >
                <template slot-scope="scope">
                        {{scope.row.avgPercent}}%
                </template>
            </el-table-column>
            <el-table-column label="优秀率第一增加百分比" align="center" >
                <template slot-scope="scope">
                        {{scope.row.goodPercent}}%
                </template>
            </el-table-column>
            <el-table-column label="R" align="center" >
                <template slot-scope="scope">
                        {{scope.row.rValue}}
                </template>
            </el-table-column>
            <el-table-column label="M" align="center" >
                <template slot-scope="scope">
                        {{scope.row.mValue}}
                </template>
            </el-table-column>
             <el-table-column label="绩效评估方式" align="center" >
                <template slot-scope="scope">
                        <span v-if="scope.row.appraiseWay==1">占比</span>
                        <span v-if="scope.row.appraiseWay==0">均分</span>
                </template>
            </el-table-column>
            <el-table-column label="操作" align="center" width="120">
                 <template slot-scope="scope">
                         <el-button  @click.native.prevent="teachingPerformancedetails(scope.row.id)"  type="text" size="small">详情</el-button>
                         <el-button  @click.native.prevent="deleteTeacherAppraiseBatchs(scope.row.id)"  type="text" size="small" class="buttontextred">删除</el-button>
                 </template>
            </el-table-column>
        </el-table>
        <el-pagination
            class="pagination-container"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page.sync="listQuery.pageNo"
            :page-sizes="[10, 20, 30, 50]"
            :page-size="listQuery.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
        </el-pagination>
    </div>
</template>
<script>
    import {queryTeacherAppraiseBatch,deleteTeacherAppraiseBatch,getSchoolYear,getCurrentSchoolTimeBySchoolId} from '@/api/teachingPerformance';
    import mixin from '@/mixins/windowResize';
    import {mapGetters} from 'vuex';
    export default {
        data() {
            return {
                listQuery: {
                    pageNo: 1,
                    pageSize: 20,
                    schoolId: '',
                    schoolYearId:''
                },
                dataList: [],               
                total: null,
                schoolYearList:[]
            }
        },
        computed: {...mapGetters(['schoolInfo']),},
        created() {
           this.listQuery.schoolId=this.schoolInfo.id;
           this.getSchoolYearFunc();
           this.getCurrentSchoolTimeBySchoolIds();           
        },
       
        mixins: [mixin],       
        methods: { 
            //获取当前学年
            getCurrentSchoolTimeBySchoolIds(){
                  getCurrentSchoolTimeBySchoolId().then(res=>{                
                    let mydata=res.data.data;
                    this.listQuery.schoolYearId=mydata.schoolYearId;
                    this.queryTeacherAppraiseBatchs();
                }).catch();
            },          
            //获取学年列表
            getSchoolYearFunc(){
                getSchoolYear().then(res=>res.data).then(data=>{
                    if(data.code===200){
                       this.schoolYearList=data.data;                    
                    }
                }).catch(()=>{})
                }, 
            //删除
            deleteTeacherAppraiseBatchs(id){
               this.$confirm('此操作将永久删除此批次, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    deleteTeacherAppraiseBatch(id).then(res => {
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                        this.queryTeacherAppraiseBatchs();
                    }).catch();

                }).catch(() => {
                });
            },
            //获取列表          
            queryTeacherAppraiseBatchs() {
                queryTeacherAppraiseBatch(this.listQuery)
                    .then(res => res.data)
                    .then(data => {
                        this.dataList = data.data.dataList;
                        this.total = data.data.pagination.total;
                    }).catch(err => {
                })
            },
            //切换学年
            handleFilter (){
                this.listQuery.pageNo=1;
                this.queryTeacherAppraiseBatchs();
            }, 
            //切换码数          
            handleSizeChange(val) {
                this.listQuery.pageNo=1;
                this.listQuery.pageSize = val;
                this.queryTeacherAppraiseBatchs();
            },
            //切换页数
            handleCurrentChange(val) {
                this.listQuery.pageNo = val;
                this.queryTeacherAppraiseBatchs();
            },            
            //教师学年绩效评估表
            teachingPerformanceyearlist(){
               this.$router.push({
                    path: "teachingPerformanceyearlist"
                });
            },
            //新增   
            teachingPerformanceadd(){
               this.$router.push({
                    path: "teachingPerformanceadd"
                });
            },
            //详情   
            teachingPerformancedetails(id){
                this.$router.push({
                    path: "teachingPerformancedetails",
                    query: {id: id}
                });
            },
            //列表
            teachingPerformancelistone(id){
                this.$router.push({
                    path: "teachingPerformancelistone",
                    query: {id: id}
                });
            },
        }
    }
</script>
<style lang="scss" scoped>
    .pagination-container {
        margin-top: 10px;
    }
    .filter-container{
        padding-bottom: 10px;
        overflow: hidden;
    }
</style>
