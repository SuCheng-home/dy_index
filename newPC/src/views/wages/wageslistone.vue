<template>
  <div class="wageslistone">
    <div class="wageslistone-top">
        <el-button  @click="$router.back()" type="default" size="medium">返回</el-button>
        <!-- <el-button type="primary"  size="medium" @click="sendBatchPayrolls()">发布</el-button> -->
        <el-button type="primary"  size="medium" @click="wageslistoneadd()">补录</el-button> 
    </div>     
    <div class="subject">
            <el-table :data="dataList" border :height="maxH"    >
                <el-table-column label="姓名"  align="center"  min-width="100" :key="Math.random()"  fixed>
                    <template slot-scope="scope">
                        <span class="link-type" @click="wageslistonedetails(scope.row.id)">{{scope.row.userName}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="身份证"  :key="Math.random()" show-overflow-tooltip min-width="200" fixed>
                    <template slot-scope="scope">{{scope.row.userIdNumber|hideInfo}}</template>
                </el-table-column>
                <el-table-column :label="item.title" :key="index+num"  align="center" v-for="(item,index) in tablist" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span v-if="scope.row.dataList[index+2].dataVal">{{scope.row.dataList[index+2].dataVal}}</span>
                        <span v-else>----</span>                    
                    </template>
                </el-table-column>                            
                <el-table-column label="操作"  align="center" :key="Math.random()"  min-width="100" fixed="right">
                    <template slot-scope="scope">
                        <!-- <el-button type="text" size="small" @click="sendUserPayrolls(scope.row.id)">发布</el-button> -->
                        <el-button type="text" size="small" @click="wageslistoneeidt(scope.row.id)">编辑</el-button>
                        <el-button  @click="deletePayrolls(scope.row.id)" type="text" size="small" class="buttontextred">删除</el-button>                       
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
   import {queryPayroll,deletePayroll,sendBatchPayroll,sendUserPayroll} from "@/api/wages";
  export default {
    name: 'wagesindex',   
    data() {
      return {
       dataList:[],
       tablist:[],
       num:0,
       query:{
            pageNo:1,
            pageSize:20,
            total:null,
            batchId:this.$route.query.batchId
       }
      }
    },
    mixins: [mixin],
//过滤器
filters:{
      hideInfo(val) {
        let str = [null,undefined,""];
        if (!str.includes(val) && val.length > 9) {
          let valLen = val.length;
          const  numt = 1;
          const  num = 2;
          let  numf = 2;
          if (valLen > 26) {
            numf=numf*2;
          }
          if (valLen % 2 == 0) {
            return val.substring(0,valLen/num-numf)+"******"+val.substring((valLen/num)+numf);
          }else {
            valLen += numt;
            return val.substring(0,(valLen/num)-numf-numt)+"******"+val.substring((valLen/num)+numf-numt);
          }
        }else {
          return val;
        }
     },
},
    created() {
        this.queryPayrolls();
    },
    methods: {  
           //获取列表
           queryPayrolls(){
              queryPayroll(this.query)
                    .then(res => res.data)
                    .then(data => {
                        this.query.total = data.data.pagination.total;
                        this.dataList = data.data.dataList;
                        this.tablist=[];
                        for(let i=2;i<this.dataList[0].dataList.length;i++){
                            this.tablist.push(this.dataList[0].dataList[i])
                        };
                        this.num=1
                    })
           },
           //删除
            deletePayrolls(id) {
                this.$confirm('是否删除', '删除', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    deletePayroll(id).then(res => res.data).then(data => {
                            if(data.result) {
                                  this.$message({type: 'success', message: '删除成功!' });
                                  this.queryPayrolls();
                           }
                        })
                });
            },
             //发布
            sendBatchPayrolls() {
                this.$confirm('是否发布全部', '发布', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    sendBatchPayroll(this.query.batchId).then(res => res.data).then(data => {
                            if(data.result) {
                                  this.$message({type: 'success', message: '发布成功!' });
                                  this.$router.back();
                           }
                        })
                });
            },
            //个人发布
             sendUserPayrolls(id) {
                this.$confirm('是否发布', '发布', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    sendUserPayroll(id).then(res => res.data).then(data => {
                            if(data.result) {
                                  this.$message({type: 'success', message: '发布成功!' });
                                  this.queryPayrolls();
                           }
                        })
                });
            },
           //码数
            handleSizeChange() {
                this.query.pageNo = 1;
                this.queryPayrolls();
            },
            //页数
            handleCurrentChange() {
                this.queryPayrolls();
            },            
            //补录
            wageslistoneadd(){
                this.$router.push({
                    path: "wageslistoneadd",
                    query: {batchId: this.query.batchId}
               });
            },
            //编辑
            wageslistoneeidt(payrollId){
                this.$router.push({
                    path: "wageslistoneeidt",
                    query: {payrollId: payrollId}
               });
            },            
            //详情
            wageslistonedetails(payrollId){
                this.$router.push({
                    path: "wageslistonedetails",
                    query: {payrollId: payrollId}
               });
            }
    }
  };
</script>

<style lang="scss" scoped>
.wageslistone{
    padding:12px;
    .wageslistone-top{
       padding-bottom: 10px;
    }
}
</style>