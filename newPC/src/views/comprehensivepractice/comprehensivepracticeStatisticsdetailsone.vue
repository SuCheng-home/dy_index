<template>
<div class="homeVisitadd"  v-loading="loading">   
     <div class="body " :style="`height: ${maxH}px;`">
          <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="140px" class="demo-ruleForm">
            <el-form-item label="活动名称">
              {{ruleForm.activityName}}
            </el-form-item>   
            <el-form-item label="实践类型" prop="typeCode">
            {{ruleForm.typeName}}
            </el-form-item>  
          <el-form-item label="阶段设置" >
             <div class="ul">
               <div class="li"  v-for="(item,index) in ruleForm.activityStageList" :key="index"> 
                   第 {{index+1}} 阶段：
                   {{item.stageName}}
               </div>
             </div>          
          </el-form-item>
            <el-form-item class="new-editor" label="活动介绍" >
                <image-previewer tag="richtext">
                    <div v-html="ruleForm.introduce"></div>
                </image-previewer>               
             </el-form-item>
             <el-form-item label="" v-if="ruleForm.filesJson.length">
                 <file-list :fileList="ruleForm.filesJson"></file-list>
                </el-form-item>
      </el-form>
     </div>
</div> 
</template>
<script>
import mixin from "@/mixins/windowResize";
import moment from "moment";
import RangeList from "@/components/RangeList/RangeList";
import FileList from '@/components/FileList/FileList.vue';
import ImagePreviewer from "@/components/ImagePreviewer/ImagePreviewer.vue";
import {getPracticeActivityInfoById} from "@/api/comprehensivepractice";
export default {
  components: { RangeList,FileList,ImagePreviewer},
  data() {
     return {
      ruleForm: {
        activityName: "",
        mainUserJson: { departJson: [], groupJson: [], userJson: [] },
        filesJson:[],
        state:1,
        typeName:"",
        introduce:"",
        activityStageList:[]
      }      
    };
  },
  mixins: [mixin],
  created() {
    this.getPracticeActivityInfoByIds();
  },
  methods: {
        getPracticeActivityInfoByIds(){
      getPracticeActivityInfoById(this.$route.query.id).then(res => res.data).then(data => {
            let mydata=data.data;
            this.ruleForm.activityName=mydata.activityName;
            this.ruleForm.introduce=mydata.introduce;
            this.ruleForm.filesJson=JSON.parse(mydata.filesJson);
            this.ruleForm.scopeType=mydata.scopeType;
             this.ruleForm.typeName=mydata.typeName;
            this.ruleForm.activityStageList=mydata.activityStageList;
            this.$set( this.ruleForm, "mainUserJson",JSON.parse(mydata.mainUserJson))
        })
    },
  }
};
</script>
<style lang="scss" scoped>
.homeVisitadd {
  padding:12px;
  .header {
    padding-bottom: 10px;
    border-bottom: 1px solid #eee;
  }
  .body {
    overflow: auto;
    .demo-ruleForm {
      margin: 20px auto;
      .ul{
        .li{
          .el-input{
            width: 400px;
          }
          i{
            font-size: 22px;
            margin: 5px;
            color: #F56C6C;
          }
        }
      }
    }
  }
}
</style>