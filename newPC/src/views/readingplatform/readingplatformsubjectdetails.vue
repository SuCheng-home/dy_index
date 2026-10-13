<template>
<div class="readingplatformsubjectadd"  >
     <div class="top">
         <el-button @click="$router.back()" type="default" size="medium">返回</el-button>
         <el-button type="primary" size="medium"   @click="readingplatformsubjecteidt()">编辑</el-button>
      </div>
     <div class="subject Dictionariesadd" :style="`height: ${nobottommaxH}px;`">
            <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="140px" class="demo-ruleForm">
            <el-form-item label="任务名称" prop="taskName">
              {{ruleForm.taskName}}
            </el-form-item>
             <el-form-item label="任务设计人">
             {{ruleForm.taskDesigners?ruleForm.taskDesigners:"----"}}
            </el-form-item>
             <el-form-item label="任务奖励积分" prop="points">
                     {{ruleForm.points}}
                </el-form-item>
            <el-form-item class="new-editor" label="任务描述" prop="remarks">
               <image-previewer tag="richtext">
                <div v-html="ruleForm.remarks"></div>
               </image-previewer>
             </el-form-item>
             <el-form-item label="题型设置">
                 <span v-if="ruleForm.taskNature==1">简答题</span>
                 <span v-if="ruleForm.taskNature==2">判断题</span>
                 <span v-if="ruleForm.taskNature==3">选择题</span>
            </el-form-item>
             <el-form-item label="答题方式" v-if="ruleForm.taskNature==1">
                 <span v-if="ruleForm.taskType==0">不限制</span>
                 <span v-if="ruleForm.taskType==1">图文</span>
                 <span v-if="ruleForm.taskType==2">语音</span>
                 <span v-if="ruleForm.taskType==3">视频</span>
            </el-form-item>
             <el-form-item label="正确答案" v-if="ruleForm.taskNature==2">
                 <span v-if="rightandwrong==1">对</span>
                 <span v-if="rightandwrong==2">错</span>
            </el-form-item>
             <el-form-item label="选项及答案" v-if="ruleForm.taskNature==3">
               <div class="ul">
                   <image-previewer tag="richtext">
                       <div class="li" v-for="(item,index) in bigoptionList" :key="index">
                       <el-checkbox disabled v-model="item.isRight"></el-checkbox>&nbsp;&nbsp;
                       {{item.optionTitle}}
                      <img v-if="item.imglist[0]" :src="item.imglist[0].fileUrl " alt="">
                     </div>
                   </image-previewer>
               </div>
            </el-form-item>
      </el-form>
     </div>
</div>
</template>
<script>
import mixin from "@/mixins/windowResize";
import Ueditor from "@/components/Ueditor";
import ImagePreviewer from "@/components/ImagePreviewer/ImagePreviewer.vue";
import {updateReadPlatBookTask,getReadPlatBookTaskById} from '@/api/readingplatform';
import Uploader from "@/components/Uploader/WebUploader";
export default {
  components: {Ueditor,Uploader,ImagePreviewer},
  data() {

    return {
      ruleForm: {
        optionList:[],
        platBookId:this.$route.query.platBookId,//	书籍ID	number
        points:"",//	任务积分	number
        remarks:"",//	任务描述	string
        sourceType:1,//	来源类型，1管理员，2老师，3学生	number
        taskDesigners:"",//	任务设计人	string
        taskName:"",//	任务名称	string
        taskNature:1,//	1代表问答题，2代表判断题，3代表选择题	number
        taskType:0,//	0不限制，1图文，2语3视频	number
        id:this.$route.query.id
      },
      rightandwrong:1,
      bigoptionList:[],
    };
  },
  mixins: [mixin],
  created() {
     getReadPlatBookTaskById(this.$route.query.id).then(res=>res.data)
      .then(data=>{
        let mydata=data.data;
         this.ruleForm.remarks=mydata.remarks;
         this.ruleForm.points=mydata.points;
         this.ruleForm.taskName=mydata.taskName;
         this.ruleForm.taskNature=mydata.taskNature;
         this.ruleForm.taskType=mydata.taskType;
         this.ruleForm.taskDesigners=mydata.taskDesigners;
         if(mydata.taskNature==2){
            this.rightandwrong=(mydata.optionList[0].isRight==2)?2:1
         }
          if(mydata.taskNature==3){

           for(let i=0;i<mydata.optionList.length;i++){
               this.bigoptionList.push({
                   isRight:mydata.optionList[i].isRight==1,imglist:mydata.optionList[i].optionPicUrl?[{id:"",fileUrl:mydata.optionList[i].optionPicUrl,fileName:"123"}]:[],optionTitle:mydata.optionList[i].optionTitle
               })
           }
         }
      })
  },
  methods: {
    readingplatformsubjecteidt(){
      this.$router.push({
        path: "readingplatformsubjecteidt",
        query:this.$route.query
    })
   }
  }
};
</script>

<style lang="scss" scoped>
.readingplatformsubjectadd {
  padding:12px;
  .top {
    border-bottom: 1px solid #e7eaec;
    padding-bottom: 10px;
  }
  .subject {
    padding-top: 10px;
    overflow: auto;
    .demo-ruleForm {
      width: 810px;
      margin: 0 auto;
      .el-tag {
         cursor:pointer;
      }
      .ul{
          min-height: 150px;
          .li{
              padding: 10px;
              border:1px #e7eaec solid;
              border-radius: 3px;
              margin: 10px 0;
              height: 102px;
              width: 500px;
              img{
                  width: 80px;
                  height: 80px;
                  float: right;
              }

          }
      }
    }
  }
}
</style>
