<template>
<div class="readingplatformsubjectadd"  >
     <div class="top"> 
         <el-button @click="$router.back()" type="default" size="medium">返回</el-button> 
         <el-button type="primary" size="medium"   @click="addCircleTopics()">保存</el-button>   
      </div>
     <div class="subject Dictionariesadd" :style="`height: ${nobottommaxH}px;`">
            <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="140px" class="demo-ruleForm">
            <el-form-item label="任务名称" prop="taskName">
              <el-input type="input" size="medium" v-model.trim="ruleForm.taskName" placeholder="请输入任务名称" :maxlength="20"></el-input>
            </el-form-item> 
             <el-form-item label="任务设计人">
              <el-input type="input" size="medium" v-model.trim="ruleForm.taskDesigners" placeholder="请输入任务设计人" :maxlength="10"></el-input>
            </el-form-item>  
             <el-form-item label="任务奖励积分" prop="points">
                     <el-input-number size="medium" v-model="ruleForm.points" :precision="0" :step="1" :min="1" :max="100" placeholder="请输入积分"></el-input-number>
                </el-form-item>          
            <el-form-item class="new-editor" label="任务描述" prop="remarks">
                        <ueditor  class="rich-editor new-editor" ref="ueditor" :defaultMes="ruleForm.remarks" @editModel="richTextEditHandler"></ueditor>
             </el-form-item>
             <el-form-item label="题型设置">
                <el-radio v-model="ruleForm.taskNature" :label="1" disabled >简答题</el-radio>
                <el-radio v-model="ruleForm.taskNature" :label="2" disabled >判断题</el-radio>
                <el-radio v-model="ruleForm.taskNature" :label="3" disabled >选择题</el-radio>
            </el-form-item> 
             <el-form-item label="答题方式" v-if="ruleForm.taskNature==1">
                <el-select v-model="ruleForm.taskType" size="medium" placeholder="请选择答题方式">
                    <el-option label="不限制" :value="0"> </el-option>
                    <el-option label="图文" :value="1"> </el-option>
                    <el-option label="语音" :value="2"> </el-option>
                    <el-option label="视频" :value="3"> </el-option>
                </el-select>
            </el-form-item> 
             <el-form-item label="正确答案" v-if="ruleForm.taskNature==2">
                <el-radio v-model="rightandwrong" :label="1">对</el-radio>
                <el-radio v-model="rightandwrong" :label="2">错</el-radio>
            </el-form-item> 
             <el-form-item label="选项及答案" v-if="ruleForm.taskNature==3">
                <div><el-tag @click="pushfun()">新增选项(勾选即是答案,可多选) <i class="el-icon-plus"></i></el-tag></div>
               <div class="ul">
                    <div class="li" v-for="(item,index) in bigoptionList" :key="index">
                       <el-checkbox v-model="item.isRight"></el-checkbox>&nbsp;&nbsp;
                       <el-input type="input" size="medium" v-model.trim="item.optionTitle" placeholder="请输入" :maxlength="200"></el-input>
                        <i class="el-icon-delete" @click="fundelete(index)"></i>
                       <uploader ref="coverUploader" module="yuedupingtai" moduleCode="2017" pathPrefix="yuedupingtai" :extList="['bmp', 'png', 'jpg', 'jpeg', 'gif']" showResult="image" showMode="button" v-model="item.imglist" :multiple="false"></uploader>
                     </div>
               </div>
            </el-form-item>
      </el-form>
     </div>    
</div> 
</template>
<script>
import mixin from "@/mixins/windowResize";
import Ueditor from "@/components/Ueditor";
import {updateReadPlatBookTask,getReadPlatBookTaskById} from '@/api/readingplatform';
import Uploader from "@/components/Uploader/WebUploader";
export default {
  components: {Ueditor,Uploader},
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
      rules: {
        taskName: [{ required: true, message: "请输入任务名称", trigger: "blur" }],
        points:  [{ required: true, message: "请输入任务积分", trigger: "blur" }],
        remarks: [{ required: true, message: "任务描述不能为空", trigger:"change"}]
      },
      bigoptionList:[],
    };
  },
  mixins: [mixin],
  created() {
     getReadPlatBookTaskById(this.$route.query.id).then(res=>res.data)
      .then(data=>{
        let mydata=data.data;
         this.ruleForm.remarks=mydata.remarks;
         this.$refs.ueditor.setContent(this.ruleForm.remarks);
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
      pushfun(){
         this.bigoptionList.push({
             isRight:false,imglist:[],optionTitle:""
         })
      },
      fundelete(index){
         this.bigoptionList.splice(index,1)
      },
    addCircleTopics(state) {
        if(this.ruleForm.taskNature==2){
            let list=[];
            list.push({
                isRight:this.rightandwrong==1?1:2,optionPicUrl:"",optionTitle:"对"
            })
            list.push({
                isRight:this.rightandwrong==2?1:2,optionPicUrl:"",optionTitle:"错"
            })
            this.ruleForm.optionList=list;
        }
        if(this.ruleForm.taskNature==3){
            let list=[];
            let num=0
             if(this.bigoptionList.length<1){
                 this.$message({
                        message: "选项至少两个！",
                        type: "warning"
                        });
                    return;
            }
            for(let i=0;i<this.bigoptionList.length;i++){
                num=num+(this.bigoptionList[i].isRight-0);
                if(!this.bigoptionList[i].optionTitle){
                     this.$message({
                        message: "选项"+(i+1)+"不能为空！",
                        type: "warning"
                        });
                    return;
                }
                list.push({
                     isRight:this.bigoptionList[i].isRight?1:2,optionPicUrl:this.bigoptionList[i].imglist.length?this.bigoptionList[i].imglist[0].fileUrl:"",optionTitle:this.bigoptionList[i].optionTitle
                })
            }
            if(num==0){
                 this.$message({
                        message: "选项至少一个正确答案！",
                        type: "warning"
                        });
                    return;
            }
            this.ruleForm.optionList=list;
        }
      this.$refs.ruleForm.validate(valid => {
        if (valid) {         
          updateReadPlatBookTask(this.ruleForm)
            .then(res => res.data)
            .then(data => {
              if (data.result) {
                this.$message({
                  message: "新增成功！",
                  type: "success",
                  duration: 1000
                });
                this.$router.back();
              }
            })
            .catch(() => {});
        }
      });
    },
    deleteCover() {
      this.$refs.coverUploader.deleteItem(0);
    },
    richTextEditHandler(content) {
      this.ruleForm.remarks = content;
    }   
  }
};
</script>

<style scoped>
.readingplatformsubjectadd .clearfix{
    float: right;
}
.readingplatformsubjectadd .file-name{
    display: none;
}
</style>
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
              .el-input{
                  width: 320px;
              }
              .el-icon-delete{
                  float: right;
                  font-size: 20px;
                  position: relative;
                  top:10px;
                  color:#F56C6C;
                  margin-left: 5px;
              }
               .image-upload-container {
                display: inline-block;
                vertical-align: top;
                .image-upload-container__inner {
                position: relative;
                }
                .cover-hint {
                position: relative;
                margin-top: 5px;
                font-size: 12px;
                i {
                    margin-right: 5px;
                }
                }
            }
          }
      }
    }
  }
}
</style>
