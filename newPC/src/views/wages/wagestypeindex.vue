<template>
  <div class="wagestypeindex">
    <div class="wagestypeindex-top">
         <el-button  @click="$router.back()" type="default" size="medium">返回</el-button>
         <el-button type="primary"  size="medium" @click="wagestypeadd()">新增</el-button>
    </div>     
    <div class="subject">
      <el-table :data="dataList" border :height="nobottommaxH">
                <el-table-column label="分类名称" show-overflow-tooltip >
                    <template slot-scope="scope">
                        <span class="link-type" @click="wagestypedetails(scope.row.id)">{{scope.row.payrollType}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="分类描述"  show-overflow-tooltip>
                    <template slot-scope="scope">{{scope.row.payrollTypeDes}}</template>
                </el-table-column>
                <el-table-column label="排序值"  align="center" width="150">
                    <template slot-scope="scope">{{scope.row.orderNo}}</template>
                </el-table-column>               
                <el-table-column label="操作"   align="center" width="200">
                    <template slot-scope="scope">
                        <el-button type="text" size="small" @click="wagestypeeidt(scope.row.id)">编辑</el-button>
                        <el-button  @click="deletePayrollTypes(scope.row.id)" type="text" size="small" class="buttontextred">删除</el-button>                       
                    </template>
                </el-table-column>          
            </el-table>
     </div>
  </div>
</template>
<script>
  import mixin from '@/mixins/windowResize';
  import {payrollTypeList,deletePayrollType} from "@/api/wages";
  export default {
    data() {
      return {
       dataList:[]
      }
    },
    mixins: [mixin],
    created() {
        this.payrollTypeLists();
    },
    methods: {  
        //获取列表
        payrollTypeLists(){
                payrollTypeList().then(res => res.data).then(data => {
                            if(data.code==200) {
                               this.dataList=data.data;  
                            };                            
                        })
        },
        //删除
        deletePayrollTypes(id){
            this.$confirm('是否删除', '删除', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    deletePayrollType(id).then(res => res.data).then(data => {
                            if(data.result) {
                                  this.$message({type: 'success', message: '删除成功!' });
                                  this.payrollTypeLists();
                           }
                        })
                });
        },
        //新增
        wagestypeadd(){
           this.$router.push({path: "wagestypeadd"});
        },
        //编辑
            wagestypeeidt(id){
            this.$router.push({
                path: "wagestypeeidt",
                query: {id: id}
            });
            },
        //编辑
        wagestypedetails(id){
             this.$router.push({
                path: "wagestypedetails",
                query: {id: id}
            });
        }
    }
  };
</script>

<style lang="scss" scoped>
.wagestypeindex{
    padding:12px;
    .wagestypeindex-top{
       padding-bottom: 10px;
    }
}
</style>