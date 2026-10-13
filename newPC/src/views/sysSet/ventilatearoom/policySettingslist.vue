<template>
  <div class="policySettingslist">
    <div class="el-row menu-tools">
      <el-button  @click="$router.back()" size="medium">返回</el-button>
      <el-button type="primary" size="medium"   @click="policySettingsadd()">新增打卡策略</el-button>
      <el-button type="primary" size="medium"   @click="ventilatearoomDictionarieslist()">打卡项设置</el-button>      
    </div>
     <div class="subject" :style="`height:${nobottommaxH}px`" >
         <div class="ul">
         <div class="li" v-for="(item,index) in dataList" :key="index" >
           <el-tooltip class="item" effect="dark" content="编辑" placement="top">
             <i class="el-icon-edit"  @click="policySettingseidt(item.id)"></i>
          </el-tooltip>
           <el-tooltip class="item" effect="dark" content="删除" placement="top">
             <i class="el-icon-delete" @click="deleteStategyByIds(item.id)"></i>
          </el-tooltip>           
           <span>{{item.strategyName}}</span>           
         </div>
       </div>
        <div class="Notime" v-if="dataList.length==0">暂无数据</div> 
    </div>      
  </div>
</template>
<script>
import mixins from "@/mixins/windowResize";
import baseMixin from "@/mixins/baseMixin";
import {listStrategyBySchoolId,deleteStategyById} from '@/api/ventilatearoom';
export default {
  data() {
    return {
      dataList: []
    };
  },
  mixins: [mixins, baseMixin],
  created() {
      this.queryPlaceBySchoolIds();
  },
  methods: {
      //字典设置
    ventilatearoomDictionarieslist(){
       this.$router.push({ path: "ventilatearoomDictionarieslist" });
    },
    //新增
    policySettingsadd() {
      this.$router.push({ path: "policySettingsadd" });
    },
    //编辑
    policySettingseidt(id) {
      this.$router.push({
        path: "policySettingseidt",
        query: { id: id }
      });
    },
    //获取列表
    queryPlaceBySchoolIds() {
      this.datalist = [];
        listStrategyBySchoolId().then(res => {
                       this.dataList = res.data.data;
         });
    },   
    //删除
    deleteStategyByIds(id) {
      this.$confirm("该策略删除关联场所也将被删除，确认要删除吗？", "删除", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {         
          deleteStategyById(id).then(res => {
            if (res.data.code === 200) {
              this.$message.success("删除成功");
               this.queryPlaceBySchoolIds();
            } else {
              this.$message.error(res.data.msg);
            }
          });
        })
        .catch(() => {});
    }
  }
};
</script>
<style lang="scss" scoped>
.policySettingslist {
  padding:12px;
  box-sizing: border-box;
  .menu-tools {
    border-bottom: 1px solid #e7eaec;
    padding-bottom: 10px;
  }
  .subject{
    overflow: auto;
    .ul{
      overflow: auto;      
      .li{
        float: left;
        width: 240px;
        height: 100px;
        line-height: 24px;
        padding: 25px 20px;
        margin: 10px;
        border-radius: 5px;
        color: #409eff;
        background: #ecf5ff;
        border: 1px solid #b3d8ff;
        font-size: 23px;
        text-align: center;
        position: relative;
        cursor: pointer;
        i{
          position: absolute;
          top: 5px;
          right: 5px;
          font-size: 20px;
          color: #f56c6c; 
          
        }
        .el-icon-edit{
            position: absolute;
            right: 35px;
            color: #409eff;
        }
      }
    }
    .Notime{
      text-align: center;
      color: #666;
      line-height: 280px;
      font-size: 16px;
    }
  }
}
</style>


