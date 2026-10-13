<template>
  <div class="classroomEvaluationdetails">
    <div class="header">
      <el-button  @click="$router.back()" type="default" size="medium">返回</el-button>
        <el-select class="filter-item"  size="medium"  v-model="behTypeId" placeholder="请选择考核项" @change="changebehTypeId()">
           <el-option v-for="item in behaviorTypeList" :key="item.id" :label="item.title"  :value="item.id"></el-option>
        </el-select>  
    </div>
    <div class="schoolWrap scrollStyle">        							
           <el-table  :data="datalist"  border stripe  :height="nobottommaxH">
                <el-table-column  prop="studentName" label="姓名" align="center" min-width="100"> </el-table-column>
                <el-table-column  prop="createUserName" label="考评老师" align="center" min-width="100"> </el-table-column>
                <el-table-column  prop="behTypeName" label="考评项" align="center" min-width="100"> </el-table-column>
                <el-table-column  label="类型" align="center" min-width="100"> 
                       <template slot-scope="scope">
                               <span v-if="scope.row.type==1">减分项</span><span v-if="scope.row.type==0">加分项</span>  
                    </template> 
                </el-table-column>
                <el-table-column  prop="typeMark" label="备注" align="center" min-width="100" show-overflow-tooltip > </el-table-column>
                <el-table-column  prop="stepScore" label="分数" align="center" min-width="100"> </el-table-column>
                <el-table-column  prop="behDate" label="考评日期" align="center" min-width="100"> </el-table-column>
                <el-table-column   label="节次" align="center" min-width="100">
                     <template slot-scope="scope">
                       {{scope.row.morningName}}
                    </template> 
                </el-table-column>
            </el-table>   
    </div>
  </div>
</template>
<script>
import mixins from '@/mixins/windowResize';
import {getSchoolBehaviorStuListInfoType,classBehEvalCurrBehTypeStuScore,getSchoolBehaviorInstallNew} from '@/api/classroomEvaluation';
export default {
  data(){
    return{
      behTypeId:0,     
      behaviorTypeList:[{id:0,title:'全部考核项'}],
      query:this.$route.query,
      datalist:[]
    }
  },
  created(){      
    classBehEvalCurrBehTypeStuScore(this.query.classId,this.query.currId,this.query.schoolTimeCode,this.query.startDate,this.query.endDate).then(res=>res.data).then(data=>{
               if(data.code===200){                   
                     for(let i=0;i<data.data.behaviorTypeList.length;i++){
                       if(data.data.behaviorTypeList[i].type==0){
                            this.behaviorTypeList.push({id:data.data.behaviorTypeList[i].id,title:data.data.behaviorTypeList[i].title+'（加）'})
                       }else{
                           this.behaviorTypeList.push({id:data.data.behaviorTypeList[i].id,title:data.data.behaviorTypeList[i].title+'（减）'})
                       }
                           
                     };
                     this.getSchoolBehaviorStuListInfoTypes() 
                    //  getSchoolBehaviorInstallNew().then(res=>res.data).then(data=>{
                    //     if(data.code===200){
                    //           if(data.data.eleTypeMark==2) {
                    //               this.behaviorTypeList.push({id:'-2',title:'其它（加）'})
                    //               this.behaviorTypeList.push({id:'-3',title:'其它（减）'})
                    //           }
                                        
                    //           }
                                
                    //       })
                                                  
                    }
                })
  },
  mixins:[mixins],
  methods:{    
    //获取列表
    getSchoolBehaviorStuListInfoTypes(){     
        getSchoolBehaviorStuListInfoType(this.behTypeId,this.query.currId,this.query.schoolTimeCode,this.query.studentId).then(res=>res.data).then(data=>{
               if(data.code===200){
                    this.datalist=data.data;              
                    }
                })
    },
    //切换类型
    changebehTypeId(){
         this.getSchoolBehaviorStuListInfoTypes() 
    }
  }
}
</script>
<style lang="scss" scoped>
.classroomEvaluationdetails{
  padding:12px;
  box-sizing: border-box;
  font-size:14px; 
    .red{
            color: #f56c6c;  
    }
    .green{
      color: #67c23a;
    }
  .header{
    padding-bottom:10px;
    
  }
}
</style>

