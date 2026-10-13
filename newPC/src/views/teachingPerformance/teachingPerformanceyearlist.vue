<template>
    <div class="app-container ">
        <div class="filter-container">
            <el-button @click="$router.back()" type="default" size="medium">返回</el-button> 
            <el-select v-model="listQuery.schoolYearId" placeholder="请选择学年" @change="handleFilter" size="medium">
                  <el-option v-for="item in schoolYearList" :key="item.id" :label="item.year+'学年'" :value="item.id">
                  </el-option>
              </el-select>   
              <el-button type="primary" size="medium" @click="generateYearTeacherAppraises()">生成教师学年绩效评估</el-button>
               <a :href="downLoadHref" v-if="dataList.length" target="_blank" download="examName"><el-button type="primary"  size="medium">导出</el-button></a>
              <el-input class="search-input" style="width:20%;float: right;"
                  placeholder="请输入教师姓名" icon="search" size="medium" @change="handleFilter"
                  v-model.trim="listQuery.searchName">
            <el-button slot="append" icon="el-icon-search" @click="handleFilter"></el-button>
        </el-input>       
        </div>
        <el-table stripe :data="dataList"  :height="`${maxH}px`" border style="width: 100%" >            
            <el-table-column label="序号" type="index" width="50"></el-table-column> 
            <el-table-column label="教师" align="center" show-overflow-tooltip>
                <template slot-scope="scope">
                        {{scope.row.teacherName}}
                </template>
            </el-table-column>  
            <el-table-column label="班级" align="center" show-overflow-tooltip>
                <template slot-scope="scope">
                        {{scope.row.classNames}}
                </template>
            </el-table-column>
            <el-table-column label="学科" align="center" show-overflow-tooltip>
                <template slot-scope="scope">
                        {{scope.row.currNames}}
                </template>
            </el-table-column>
            <el-table-column label="教师个人绩效综合值" align="center" show-overflow-tooltip>
                <template slot-scope="scope">
                        {{scope.row.teacherSynthesize}}
                </template>
            </el-table-column>
            <el-table-column label="综合名次" align="center" show-overflow-tooltip>
                <template slot-scope="scope">
                        {{scope.row.orderNo}}
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
    import {queryTeacherAppraiseYearAnalysis,getSchoolYear,getCurrentSchoolTimeBySchoolId,generateYearTeacherAppraise} from '@/api/teachingPerformance';
    import mixin from '@/mixins/windowResize';
    import {mapGetters} from 'vuex';
    export default {
        data() {
            return {
                listQuery: {
                    pageNo: 1,
                    pageSize: 20,
                    schoolId: '',
                    schoolYearId:'',
                    searchName:''
                },
                dataList: [],               
                total: null,
                schoolYearList:[],
                downLoadHref:'',
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
                    this.queryTeacherAppraiseYearAnalysiss();
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
            generateYearTeacherAppraises(id){
               this.$confirm('此操作将生成教师学年绩效评估, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    generateYearTeacherAppraise(this.listQuery.schoolId,this.listQuery.schoolYearId).then(res => {
                        this.$message({
                            type: 'success',
                            message: '生成成功!'
                        });
                        this.queryTeacherAppraiseYearAnalysiss();
                    }).catch();

                }).catch(() => {
                });
            },
            //获取列表          
            queryTeacherAppraiseYearAnalysiss() {
                this.downLoadHref = `${global.BasePath}structure/teacherAppraise/downTeacherAppraiseYearAnalysis?token=${this.$store.getters.token}&schoolId=${this.listQuery.schoolId}&schoolYearId=${this.listQuery.schoolYearId}&searchName=${this.listQuery.searchName}`;
                queryTeacherAppraiseYearAnalysis(this.listQuery)
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
                this.queryTeacherAppraiseYearAnalysiss();
            }, 
            //切换码数          
            handleSizeChange(val) {
                this.listQuery.pageNo=1;
                this.listQuery.pageSize = val;
                this.queryTeacherAppraiseYearAnalysiss();
            },
            //切换页数
            handleCurrentChange(val) {
                this.listQuery.pageNo = val;
                this.queryTeacherAppraiseYearAnalysiss();
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
