<template>
<div class="deliverySettings"  >
    <div class="top"> 
        <el-button @click="$router.back()" type="default" size="medium">返回</el-button> 
        <el-button type="primary" size="medium"  @click="addSarahInits()">保存</el-button>       
    </div>
    <div class="subject" :style="`height: ${nobottommaxH}px;`">
        <div class="body">
              <el-checkbox v-model="isCater">不需要配送</el-checkbox>
              <div style="font-size: 14px; padding-top:10px">
                 <el-checkbox v-model="isLimit">工餐申请时间限制</el-checkbox>
                 <span v-if="isLimit">
                   &nbsp;&nbsp;
                   <el-time-select :editable="false" :clearable="false" size="medium"  v-model="limitTime"  :picker-options="{  start: '00:00',  step: '00:5',    end: '23:55'   }" placeholder="选择时间"></el-time-select>
                   &nbsp;&nbsp;后不允许申请当天及第二天用餐
                 </span>
              </div>              
        </div>        
    </div>    
</div> 
</template>
<script>
import { addSarahInit, getSarahInit } from "@/api/workingMeal";
import mixin from "@/mixins/windowResize";
export default {
  data() {
    return {
      isCater: false,
      stuFireDate:'',
      isLimit:false,
      limitTime:'08:30'
    };
  },
  mixins: [mixin],
  created() {
    this.getSarahInits();
  },
  methods: {
    getSarahInits() {
      getSarahInit()
        .then(res => {
          let data = res.data.data;
         if(data){
              this.isCater=(data.isCater==2);
              this.isLimit=(data.isLimit==2);
              this.limitTime=data.limitTime?data.limitTime:'08:30'
         }
        })
        .catch(err => {});
    },
    addSarahInits() {
      addSarahInit({ isCater: this.isCater ? 2 : 1,isLimit: this.isLimit ? 2 : 1,limitTime:this.limitTime})
        .then(res => {
          if (res.data.code == 200) {
            this.$message({
              message: "保存成功！",
              type: "success",
              duration: 1000
            });
            this.$router.back();
          } else {
            this.$message.error(res.data.msg);
          }
        })
        .catch(err => {});
    }
  }
};
</script>
<style lang="scss" scoped>
.deliverySettings {
  padding:12px;
  * {
    word-break: break-all;
    word-wrap: break-word;
  }
  .top {
    border-bottom: 1px solid #e7eaec;
    padding-bottom: 10px;
  }
  .subject {
    padding-top: 10px;
    overflow: auto;
    .body {
      width: 810px;
      margin: 0 auto;
      padding-top: 20px;
    }
  }
}
</style>