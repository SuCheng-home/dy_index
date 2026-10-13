<template>
<div class="sourceSettings"  >
     <div class="top"> 
              <el-button @click="$router.back()" type="default" size="medium">返回</el-button> 
              <el-button type="primary" size="medium"   @click="insertBatchs()">保存</el-button>  
          
      </div>
     <div class="subject" :style="`height: ${maxH}px;`">
            <el-checkbox-group v-model="checkList">
                <el-checkbox :label="item.code" v-for="(item,index) in sourcelist" :key="index">{{item.value}}</el-checkbox>
            </el-checkbox-group>
     </div>
   
</div> 
</template>
<script>
import {listValue,listBySchoolId,insertBatch} from "@/api/campusCrd";
import mixin from "@/mixins/windowResize";
export default {
  data() {
    return {
      sourcelist: [],
      checkList:[]
    };
  },
  mixins: [mixin],
  created() {
     listValue().then(res=>res.data).then(data=>{
        if(data.code===200){
           this.sourcelist=data.data.dataList;
         }
      })
    listBySchoolId().then(res=>res.data).then(data=>{
        if(data.code===200){
          let mydata=data.data;
          for(let i=0;i<mydata.length;i++){
            this.checkList.push(mydata[i].code)
          }
         }
      })
  },
  methods: {  
    //保存
    insertBatchs() {
      if(!this.checkList.length){
        this.$message.error('请至少选择一个来源');
           return;
      }
      this.$confirm("确认要保存吗？", "保存", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        lockScroll: false
      }).then(() => {    
        let list=[];
        for(let i=0;i<this.checkList.length;i++){
          for(let j=0;j<this.sourcelist.length;j++){
            if(this.checkList[i]==this.sourcelist[j].code){
              list.push({
                code:this.sourcelist[j].code,
                value:this.sourcelist[j].value
              })
            }
          }
        } 
          insertBatch(list).then(res => {
            if (res.data.code === 200) {
              this.$message.success("保存成功");
               this.$router.back();
            } else {
              this.$message.error(res.data.msg);
            }
          });
        })
        .catch(() => {});
    },
  
  }
};
</script>
<style lang="scss" scoped>
.sourceSettings {
  padding:12px;
  .top {
    border-bottom: 1px solid #e7eaec;
    padding-bottom: 10px;
    overflow: hidden;
  } 
  .subject{
      width: 810px;
      margin: 20px auto;
  }
}
</style>