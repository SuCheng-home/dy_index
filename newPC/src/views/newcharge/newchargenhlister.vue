<template>
<div class="newchargenhlist"  >
     <div class="top"> 
         <el-button @click="$router.back()" type="default" size="medium">返回</el-button> 
         <el-button type="primary" size="medium"   @click="newchargesetupaddnher()">新增</el-button>
      </div>
     <div class="subject" :style="`height: ${nobottommaxH}px;`">
         <el-table stripe  :data="dataList" border fit highlight-current-row  style="width: 100%" >
                <el-table-column  label="二级商户名称" align="center">
                    <template slot-scope="scope">
                       <span >{{scope.row.subMerName}}</span>
                    </template>
                </el-table-column>
                <el-table-column  label="二级商户编号" align="center">
                    <template slot-scope="scope">
                       <span >{{scope.row.subMerId}}</span>
                    </template>
                </el-table-column>
                <el-table-column  label="收款账号" align="center" >
                    <template slot-scope="scope">
                       <span >{{scope.row.account}}</span>
                    </template>
                </el-table-column>
                <el-table-column  label="收款账户名" align="center">
                    <template slot-scope="scope">
                       <span >{{scope.row.accountName}}</span>
                    </template>
                </el-table-column>
                 <el-table-column  label="他行行号" align="center">
                    <template slot-scope="scope">
                       <span >{{scope.row.recBankNo}}</span>
                    </template>
                </el-table-column>
                 <el-table-column  label="监管账户" align="center">
                    <template slot-scope="scope">
                       <span >{{scope.row.merName}}</span>
                    </template>
                </el-table-column>
                 <el-table-column  label="缴费类型名称" align="center">
                    <template slot-scope="scope">
                       <span >{{scope.row.typeList[0].typeName}}</span>
                    </template>
                </el-table-column>
                 <el-table-column align="center" label="操作" width="180">
                   <template slot-scope="scope">
                         <el-button type="text" size="small" @click.native.prevent="deleteAbcsubmerh(scope.row.id)" class="buttontextred">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
     </div>
</div> 
</template>
<script>
import {queryAbcsubmerhList,deleteAbcsubmerh} from "@/api/newcharge";
import mixin from "@/mixins/windowResize";
export default {
  data() {
    return {    
      dataList: []     
    };
  },
  mixins: [mixin],
  created() {
      this.queryAbcsubmerhList();
  },
  methods: {
      queryAbcsubmerhList(){
        queryAbcsubmerhList().then(res => {
          if (res.data.code === 200) {
            this.dataList = res.data.data;
          }
        })
        .catch(function() {});
      },
      deleteAbcsubmerh(id){
          this.$confirm("此操作将永久删除, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          deleteAbcsubmerh(id)
            .then(res => {
              this.$message({
                type: "success",
                message: "删除成功!"
              });
              this.queryAbcsubmerhList();
            })
            .catch();
        })
        .catch(() => {});
      },
      newchargesetupaddnher(){
        this.$router.push({path:'newchargesetupaddnher'});
      }
  }
};
</script>
<style lang="scss" scoped>
.newchargenhlist {
  padding:12px;
  .top {
    padding-bottom: 10px;
  }
  .subject {
    overflow: auto;
   
  }
}
</style>