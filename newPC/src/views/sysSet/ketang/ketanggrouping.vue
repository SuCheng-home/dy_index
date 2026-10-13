<template>
  <div class="ketanggrouping">
    <div class="header">
        <el-button  @click="$router.back()" type="default" size="medium">返回</el-button>
          <el-button type="primary" size="medium"  @click="addSchoolBehaviorRankInit()">保存</el-button>
    </div>
    <div>
     <div class="main-wrap scrollBar" :style="{'height':nobottommaxH+'px'}">
      <el-form :model="ruleForm" ref="ruleForm" label-width="10px" class="demo-ruleForm">
        <el-form-item :key="item.index" v-for="item in datalist" >
            {{'第'+item.rank+'名：'}}&nbsp;&nbsp;&nbsp;&nbsp;
            按节次 <el-input-number v-model.trim="item.sectionNoScore"  size="small" @change="funnum()"  :precision="0" :min="0" :max="100000" label="分数"></el-input-number>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            按天 <el-input-number v-model.trim="item.dayScore"  :min="0" size="small" @change="funnum()"  :precision="0" :max="100000" label="分数"></el-input-number>
        </el-form-item>
       
      </el-form>
    </div>
      
    </div>
  </div>
</template>
<script>
import mixins from "@/mixins/windowResize";
import {getSchoolBehaviorRankInitList,addSchoolBehaviorRankInit} from "@/api/ketang";
export default {
  data() {
    return {
      datalist: [],
      type:1
    };
  },
  created() {
      getSchoolBehaviorRankInitList(this.type)
      .then(res => {
         let data=res.data.data;
         if(data.length){
            this.datalist=data
         }else{
            for(let i=1;i<9;i++){
                this.datalist.push({type:1,rank:i,dayScore:0,sectionNoScore:0})
            }
         }
      })
      .catch(function() {});
  },
  mixins: [mixins],
  methods: {
    funnum(){
      for(let i=0;i<this.datalist.length-1;i++){
        this.datalist[i].sectionNoScore=this.datalist[i].sectionNoScore?this.datalist[i].sectionNoScore:0
        this.datalist[i].dayScore=this.datalist[i].dayScore?this.datalist[i].dayScore:0
      }
    },
      addSchoolBehaviorRankInit(){
          for(let i=0;i<this.datalist.length-1;i++){
              if(this.datalist[i].sectionNoScore<this.datalist[i+1].sectionNoScore){
                  this.$message({
                         type: "error",
                       message:'第'+this.datalist[i].rank+'名按天分数要大于'+'第'+this.datalist[i+1].rank+'名'
                });
                  return
              }
              if(this.datalist[i].dayScore<this.datalist[i+1].dayScore){
                  this.$message({
                         type: "error",
                       message:'第'+this.datalist[i].rank+'名按节次分数要大于'+'第'+this.datalist[i+1].rank+'名'
                });
                  return
              }
          }
          addSchoolBehaviorRankInit(this.datalist).then(res => res.data)
                    .then(data => {
                        if (data.code === 200) {
                            this.$message({
                                type: 'success',
                                message: '设置成功！'
                            });
                        } else {
                            this.$message.error(data.msg);
                        }
         })
      }
  }
};
</script>
<style lang="scss" scoped>
.ketanggrouping {
    padding:12px;
  box-sizing: border-box;
  .header {
    padding-bottom: 10px;
     border-bottom: 1px #eee solid;
  }
  .demo-ruleForm{
      width:500px;
      box-sizing: border-box;
      margin:20px auto;
    }
}
</style>

