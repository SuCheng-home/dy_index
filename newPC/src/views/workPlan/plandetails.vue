<template>
  <div  class="planAdd" style="padding:12px;">  
     <backtool>
           <el-button type="primary" size="medium"  @click="print()" >打印</el-button>
       </backtool> 
    <div class="subject"  :style="`height: ${maxH}px;`" >  
      <div  ref="print" class="print">
        <h3>{{ruleForm.title}}</h3>
         <div class="time">{{ruleForm.startDate}}至{{ruleForm.endDate}}</div>
          <div class="boxtable">
               <table border="1" cellspacing="0" width="100%">
                    <tr> <th>序号</th><th >负责人</th> <th style="width: 500px;">计划内容</th> </tr>
                    <tr :key="index"  v-for="(item,index) in dataList">
                          <td>{{item.num}}</td>
                          <td>{{item.nuame}}</td>
                          <td>{{item.planContent}}</td> 
                     </tr>                    
                </table>
         </div>      
      </div>
         
    </div>
  
  </div>
</template>
<script>
import mixin from '@/mixins/windowResize';
 import Backtool from '@/components/BackTool';
import moment from "moment";
import AddressBook from '@/components/AddressBook/indexExpand';
import {
  getWorkPlan
} from "@/api/workPlan";
export default {
  name: "dataAnalysis",
  components: {
    AddressBook,
     Backtool
  },
  data() {
    
    return {     
      ruleForm: {
        id:this.$route.query.id,
        startDate: "",
        endDate: "",
        title:''    
      },
       dataList: [],//计划数组
    };
  },
  mixins: [mixin],
  created() {    
   getWorkPlan(this.ruleForm.id)
            .then(res => {
              this.ruleForm.startDate=res.data.data.startDate;
              this.ruleForm.endDate=res.data.data.endDate;
              this.ruleForm.title=res.data.data.title;
              for(let i=0;i<res.data.data.workPlanDetailModelList.length;i++){
                var obj ={
                      planContent:res.data.data.workPlanDetailModelList[i].planContent,
                      nuame:res.data.data.workPlanDetailModelList[i].dutyUserName,
                      num:i+1,
                };
                this.dataList.push(obj)
              }
              
            }) .catch(err => {});     
   
  },
  methods: {
      //打印
     print() {
                this.$print(this.$refs.print)
     },
  }
};
</script>
<style scoped>
.subject {
  padding: 10px;
  word-break:break-all;   word-wrap:break-word;
  overflow: auto;
}
h3{
  text-align: center;
    font-size: 26px;
    margin: 10px 0 0 0 ;
}
.time{
   text-align: right;
    padding-right: 30%;
    color: #999;
    line-height: 40px;
}
.boxtable{
    width: 800px;
    margin: 10px auto;
}
.boxtable th,.boxtable td{
    padding: 8px 5px ;
    line-height: 20px;
    text-align: center;
    min-width: 100px;
}
.print{
    word-break:break-all;   word-wrap:break-word;
    overflow:auto;
}

</style>