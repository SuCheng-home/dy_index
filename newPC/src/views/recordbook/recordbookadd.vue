<template>
<div class="recordbookadd" >
     <div class="top"> 
          <el-button  @click="$router.back()" type="default" size="medium">返回</el-button>  
     </div>        
     <div class="subject" :style="`height:${maxH+50}px`">
                
     </div>
</div> 
</template>
<script>
import mixin from "@/mixins/windowResize";
import { lostDeclareDetails } from "@/api/recordbook";
export default {
  data() {
    return {
      dataList: []
    };
  },
  mixins: [mixin],
  mounted() {
  },
  methods: {
   
  }
};
</script>
<style lang="scss" scoped>
.recordbookadd {
  padding:12px;
  .top {
    border-bottom: 1px solid #e7eaec;
    padding-bottom: 10px;
  }
}
</style>