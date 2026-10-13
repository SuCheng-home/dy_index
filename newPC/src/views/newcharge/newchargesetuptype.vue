<template>
<div class="newchargesetupaddgh"  >
     <div class="top"> 
         <el-button @click="$router.back()" type="default" size="medium">返回</el-button> 
         <el-button type="primary" size="medium"   @click="updateChargeTypeBatch()">保存</el-button>     
      </div>
     <div class="subject" :style="`height: ${nobottommaxH}px;`">
         <div class="name">请选择可用的收费类型</div>
         <el-checkbox-group v-model="checkList">
            <el-checkbox v-for="item in NoticeType" :label="item.code" :value="item.code" :key="item.code">{{item.value}}</el-checkbox>
        </el-checkbox-group>
        <div class="name red">注意：请确保此处勾选的收费类型与商户中配置的收费类型一致，避免收费无法使用。</div>
        
     </div>
</div> 
</template>
<script>
import { queryChargeNoticeType,queryChargeTypeList,updateChargeTypeBatch} from "@/api/newcharge";
import mixin from "@/mixins/windowResize";
export default {
  data() {
    return {
     NoticeType:[],
     checkList:[]
    };
  },
  mixins: [mixin],
  created() {
     	queryChargeNoticeType().then(res => {
			let data = res.data.data
			this.NoticeType = data
		})
       queryChargeTypeList().then(res => {
			let data = res.data.data;
            for(let i=0;i<data.length;i++){
                this.checkList.push(data[i].typeId)
            }
		})
  },
  methods: {
      updateChargeTypeBatch() {
           if (this.checkList.length == 0) {
        this.$message({
          type: "warning",
          message: "请选择收费类型！"
        });
        return;
      }
      let list=[];
      for(let i=0;i<this.checkList.length;i++){
          for(let j=0;j<this.NoticeType.length;j++){
              if(this.checkList[i]==this.NoticeType[j].code){
                  list.push({
                      typeId:this.NoticeType[j].code,
                      typeName:this.NoticeType[j].value
                  })
              }
          }
      }
          updateChargeTypeBatch(list)
            .then(res => res.data)
            .then(data => {
              if (data.result) {
                this.$message({
                  message: "保存成功！",
                  type: "success",
                  duration: 1000
                });               
                this.$router.back();
              } else{
                   this.$message({
                    type: "error",
                    message:data.msg
                  });
              }
            })
            .catch(() => {});
    }
  }
};
</script>
<style lang="scss" scoped>
.newchargesetupaddgh {
  padding:12px;
  .top {
    border-bottom: 1px solid #e7eaec;
    padding-bottom: 10px;
  }
  .subject{
       width: 810px;
      margin: 0px auto;
  }
  .name{
         font-size: 16px;
    line-height: 36px;
    padding: 15px 0;
    color: #303133;
      
  }
  .red{
      color:#F56C6C;
  }
  
}
</style>