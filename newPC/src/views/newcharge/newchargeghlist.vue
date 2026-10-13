<template>
<div class="newchargenhlist"  >
     <div class="top"> 
         <el-button @click="$router.back()" type="default" size="medium">返回</el-button> 
         <el-button type="primary" size="medium"   @click="newchargesetupaddgh()">新增</el-button>
      </div>
     <div class="subject" :style="`height: ${nobottommaxH}px;`">
         <el-table stripe  :data="dataList" border fit highlight-current-row  style="width: 100%" >
                <el-table-column  label="APPID" align="center">
                    <template slot-scope="scope">
                       <span >{{scope.row.appId}}</span>
                    </template>
                </el-table-column>
                <el-table-column  label="merId" align="center">
                    <template slot-scope="scope">
                       <span >{{scope.row.merId}}</span>
                    </template>
                </el-table-column>
                <el-table-column  label="收费类型" align="center">
                    <template slot-scope="scope">
                      <span  v-if="scope.row.typeName">
                       {{scope.row.typeName}}
                      </span>    
                      <span v-else>----</span>  
                    </template>
                </el-table-column>
                <el-table-column  label="支付方式" align="center" >
                    <template slot-scope="scope">
                       <span v-if="scope.row.epayPayType==1">EPay ；</span>
                       <span v-if="scope.row.wxPayType==1">微信支付</span>
                    </template>
                </el-table-column>
                 <el-table-column align="center" label="操作" width="180">
                   <template slot-scope="scope">
                         <el-button type="text" size="small" @click.native.prevent="deleteIcbcSetting(scope.row.id)" class="buttontextred">删除</el-button>
                         <!-- <el-button type="text" size="small" @click.native.prevent="newchargesetupeidtgh(scope.row.id)">编辑</el-button> -->
                    </template>
                </el-table-column>
            </el-table>
     </div>
</div> 
</template>
<script>
import {queryIcbcSettingList,deleteIcbcSetting} from "@/api/newcharge";
import mixin from "@/mixins/windowResize";
export default {
  data() {
    return {    
      dataList: []     
    };
  },
  mixins: [mixin],
  created() {
      this.queryIcbcSettingList();
  },
  methods: {
      queryIcbcSettingList(){
        queryIcbcSettingList().then(res => {
          if (res.data.code === 200) {
            this.dataList = res.data.data;
          }
        })
        .catch(function() {});
      },
      deleteIcbcSetting(id){
          this.$confirm("此操作将永久删除, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          deleteIcbcSetting(id)
            .then(res => {
              if(res.data.code==200){
                 this.$message({
                type: "success",
                message: "删除成功!"
              });
              this.queryIcbcSettingList();

              }else{
               this.$message({
                  type: "error",
                  message:res.data.msg,
                });
              } 
            })
            .catch();
        })
        .catch(() => {});
      },
      newchargesetupaddgh(){
        this.$router.push({path:'newchargesetupaddgh'});
      },
      newchargesetupeidtgh(id){
         this.$router.push({path: 'newchargesetupeidtgh', query: {id:id}}); 
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