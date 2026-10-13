<template>
<div class="newchargenhlist"  >
     <div class="top"> 
         <el-button @click="$router.back()" type="default" size="medium">返回</el-button> 
         <el-button type="primary" size="medium"   @click="newchargesetupaddnh()">新增</el-button>
      </div>
     <div class="subject" :style="`height: ${nobottommaxH}px;`">
         <el-table stripe  :data="dataList" border fit highlight-current-row  style="width: 100%" >
                <el-table-column  label="商户号" align="center">
                    <template slot-scope="scope">
                       <span >{{scope.row.merchantId}}</span>
                    </template>
                </el-table-column>
                <el-table-column  label="项目代码" align="center">
                    <template slot-scope="scope">
                       <span >{{scope.row.projectCode}}</span>
                    </template>
                </el-table-column>
                <el-table-column  label="证书" align="center">
                    <template slot-scope="scope">
                      <el-button type="text" size="small" v-if="!scope.row.withoutCert">
                        <a :href="scope.row.certPath" target="_blank" download="examName"> 下载 <i class="el-icon-download"></i></a>
                      </el-button>    
                      <span v-else>----</span>  
                    </template>
                </el-table-column>
                <el-table-column  label="证书密码" align="center" >
                    <template slot-scope="scope">
                       <span >{{scope.row.keystorePassword}}</span>
                    </template>
                </el-table-column>
                <el-table-column  label="可收费类型" align="center">
                    <template slot-scope="scope">
                       <span >{{scope.row.typeNames}}</span>
                    </template>
                </el-table-column>
                 <el-table-column  label="是否农行账户" align="center">
                  <template slot-scope="scope">
                    <el-tag  size="mini"  v-if="scope.row.nonAbcAccout">非农行账户</el-tag>
                    <el-tag  size="mini"   type="warning" v-else>农行账户</el-tag>
                  </template>
                </el-table-column>
                 <el-table-column align="center" label="操作" width="180">
                   <template slot-scope="scope">
                         <el-button type="text" size="small" @click.native.prevent="deleteAbcSettings(scope.row.id)" class="buttontextred">删除</el-button>
                         <!-- <el-button type="text" size="small" @click.native.prevent="newchargesetupeidtnh(scope.row.id)">编辑</el-button> -->
                    </template>
                </el-table-column>
            </el-table>
     </div>
</div> 
</template>
<script>
import {queryAbcSettingList,deleteAbcSetting} from "@/api/newcharge";
import mixin from "@/mixins/windowResize";
export default {
  data() {
    return {    
      dataList: []     
    };
  },
  mixins: [mixin],
  created() {
      this.queryAbcSettingLists();
  },
  methods: {
      queryAbcSettingLists(){
        queryAbcSettingList().then(res => {
          if (res.data.code === 200) {
            this.dataList = res.data.data;
          }
        })
        .catch(function() {});
      },
      deleteAbcSettings(id){
          this.$confirm("此操作将永久删除, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          deleteAbcSetting(id)
            .then(res => {
              this.$message({
                type: "success",
                message: "删除成功!"
              });
              this.queryAbcSettingLists();
            })
            .catch();
        })
        .catch(() => {});
      },
      newchargesetupaddnh(){
        this.$router.push({path:'newchargesetupaddnh'});
      },
      newchargesetupeidtnh(id){
         this.$router.push({path: 'newchargesetupeidtnh', query: {id:id}}); 
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