<template>
  <div class="wagesindex">
    <div class="wagesindex-top">
        <el-button type="primary"  size="medium" @click="wagesImport()">导入工资</el-button>
        <el-button type="primary"  size="medium" @click="wagestypeindex()">工资类型</el-button> 
    </div>     
    <div class="subject">
            <el-table :data="dataList" border :height="maxH">
                <el-table-column label="年度月份"  align="center"  min-width="100">
                    <template slot-scope="scope">
                        <span class="link-type" @click="wageslist(scope.row.id,scope.row.status)">{{scope.row.monthDate}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="薪资类型"   show-overflow-tooltip min-width="200">
                    <template slot-scope="scope">{{scope.row.payrollType}}</template>
                </el-table-column>
                <el-table-column label="创建人"  align="center"  width="120">
                    <template slot-scope="scope">{{scope.row.createUserName}}</template>
                </el-table-column>
                <el-table-column label="发放人数"  align="center"  width="100">
                    <template slot-scope="scope">{{scope.row.count}}</template>
                </el-table-column>                
                <el-table-column label="状态"  align="center"  width="100">
                    <template slot-scope="scope">
                        <el-tag  size="mini" v-if="scope.row.status==1"  type="gray">已发布</el-tag>
                        <el-tag  size="mini" v-if="scope.row.status==0"  type="danger">未发布</el-tag>
                    </template>
                </el-table-column>  
                <el-table-column label="创建时间"  align="center"  width="180">
                    <template slot-scope="scope">{{scope.row.createDate.split('.')[0]}}</template>
                </el-table-column>              
                <el-table-column label="操作"   align="center"  min-width="150">
                    <template slot-scope="scope">
                        <!-- :disabled="scope.row.status==1" -->
                        <el-button type="text" size="small"  @click="sendBatchPayrolls(scope.row.id)">发布</el-button>
                        <el-button type="text" size="small" @click="wagesSupplement(scope.row.id)">补录</el-button>
                        <el-button  @click="deletePayrollBatchs(scope.row.id)" type="text" size="small" class="buttontextred" >删除</el-button>                       
                    </template>
                </el-table-column>          
            </el-table>
            <div class="pagination-container">
                <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="query.pageNo" :page-sizes="[10,20,30, 50]" :page-size.sync="query.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="query.total"> </el-pagination>
            </div>
        </div>
  </div>
</template>
<script>
  import mixin from '@/mixins/windowResize';
   import {queryPayrollBatch,deletePayrollBatch,sendBatchPayroll} from "@/api/wages";
  export default {
    name: 'wagesindex',   
    data() {
      return {
       dataList:[],
       query:{
            pageNo:1,
            pageSize:20,
            total:null
       }
      }
    },
    mixins: [mixin],
    created() {
        this.queryPayrollBatchs();
    },
    methods: {  
           //获取列表
           queryPayrollBatchs(){
              queryPayrollBatch(this.query)
                    .then(res => res.data)
                    .then(data => {
                        this.query.total = data.data.pagination.total;
                        this.dataList = data.data.dataList;
                    })
           },
           //发布
            sendBatchPayrolls(id) {
                this.$confirm('是否发布全部', '发布', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    sendBatchPayroll(id).then(res => res.data).then(data => {
                            if(data.result) {
                                  this.$message({type: 'success', message: '发布成功!' });
                                  this.queryPayrollBatchs();
                           }
                        })
                });
            },
           //删除
            deletePayrollBatchs(id) {
                this.$confirm('是否删除', '删除', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    deletePayrollBatch(id).then(res => res.data).then(data => {
                            if(data.result) {
                                  this.$message({type: 'success', message: '删除成功!' });
                                  this.queryPayrollBatchs();
                           }
                        })
                });
            },
           //码数
            handleSizeChange() {
                this.query.pageNo = 1;
                this.queryPayrollBatchs();
            },
            //页数
            handleCurrentChange() {
                this.queryPayrollBatchs();
            },
            //跳转导入
            wagesImport(){
                this.$router.push({path: "wagesImport"});
            },
            //类型
            wagestypeindex(){
                this.$router.push({path: "wagestypeindex"});
            },
            //补录
            wagesSupplement(batchId){
                this.$router.push({
                    path: "wagesSupplement",
                    query: {batchId: batchId}
               });
            },
            //未发布
            wageslist(batchId,num){
                if(num==0){
                    this.$router.push({
                        path: "wageslistone",
                        query: {batchId: batchId}
                    });
                }else{
                    this.$router.push({
                        path: "wageslisttwo",
                        query: {batchId: batchId}
                    });
                }
               
            }
    }
  };
</script>

<style lang="scss" scoped>
.wagesindex{
    padding:12px;
    .wagesindex-top{
       padding-bottom: 10px;
    }
}
</style>