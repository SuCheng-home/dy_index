<template>
  <div class="taskAdd">
    <div class="el-row menu-tools">
      <el-button size="medium" @click="$router.back()">返回</el-button>
      <el-button type="primary" size="medium"   :loading="save_loading" @click="insertActivity(1)">保存</el-button>
      <el-button type="primary" size="medium"   :loading="save_loading" @click="insertActivity(2)">发布</el-button>
      <el-button type="primary" size="medium" :loading="save_loading"   @click="insertActivity(-1)">预览</el-button>
    </div>
    <div class="main-wrap scrollBar" :style="{'height':nobottommaxH+'px'}">
      <el-form :model="ruleForm" ref="ruleForm" label-width="140px" class="demo-ruleForm">
        <el-form-item label="任务主题" class="is-required">
          <el-input v-model.trim="ruleForm.title" placeholder="任务主题(1-30个字符)" :maxlength="30"></el-input>
        </el-form-item>
        <el-form-item label="任务类型" class="is-required">
          <el-radio-group v-model="ruleForm.type" @change="activityHandler">
            <el-radio :label="0">学生任务</el-radio>
            <el-radio :label="1">教师任务</el-radio>
          </el-radio-group>
        </el-form-item>
        <div class="" v-show="ruleForm.type==0">
          <el-form-item label="选择班级" class="applyWrap is-required clearfix">
            <el-select class="selectWidth" v-model="ruleForm.departId" placeholder="请选择班级" @change="changeClass">
              <el-option
                v-for="classItem in classList"
                :key="classItem.classId"
                :label="classItem.className"
                :value="classItem.classId">
              </el-option>
            </el-select>
          </el-form-item>
        </div>
        <el-form-item label="选择教师" class="is-required" v-show="ruleForm.type==1">
          <address-book v-model="ruleForm.activityScopes" :config="activityScopeData" ></address-book>
        </el-form-item>
        <el-form-item label="图片" class="taskEditPicBox" v-if="picJson&&picJson.length!==0">
          <uploader pathPrefix="renwu" module="renwu" moduleCode="1214" multiple v-model="picJson" :extList="['jpeg', 'jpg', 'bmp', 'gif', 'png']" showMode="image" showModeCover="false" showResult="image" ></uploader>
        </el-form-item>
        <el-form-item label="附件">
          <uploader pathPrefix="renwu" module="renwu" moduleCode="1214" :multiple="true" :extList="allFileTypeList" v-model="fileJson" ></uploader>
        </el-form-item>
        <el-form-item label="任务内容" >
          <br/>
          <ueditor class="rich-editor" style="width: 740px;position: relative;right: 70px;" ref="ueditor" :defaultMes="ruleForm.content"  @editModel="richTextEditHandler"></ueditor>     
        </el-form-item>
        
      </el-form>
    </div>
  </div>
</template>
<script>
import mixin from '@/mixins/windowResize';
import {mapGetters} from 'vuex';
import AddressBook from '@/components/AddressBook/indexExpand';
import Ueditor from "@/components/Ueditor";
import Uploader from '@/components/Uploader/WebUploader';
import {queryAllClassCourse,getTaskDetailInfoById,editTask} from '@/api/task';
export default {
  components:{
    AddressBook,
    Ueditor,
    Uploader
  },
  data(){
    return{
      taskId:this.$route.query.id,
      save_loading:false,
      ruleForm:{
        type:0,
        title:'',
        activityScopes:{},
        activityScope:'',
        departJson:'',
        groupJson:'',
        userJson:'',
        departId:null,
        departName:'',
        content:''
      },
      classList: [], //下拉框  落款部门
      activityScopeData:{
        title: '请选择发布范围',
        depart: {target: 'all', departType: 't', userTypes: '1'},
        group: true
      },
      allFileTypeList: ['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'pdf'],
      fileJson:[],
      picJson:[],
      taskDetail:{}
    }
  },
  created(){
    this.queryAllClassCourseFunc();
  },
  mounted(){
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  mixins:[mixin],
  methods:{
    //处理图片名
    fileNameUse(file){
      return file.indexOf('?') !== -1 ?file.slice(0, file.indexOf('?')) : file;
    },
    getTaskDetailInfoByIdFunc(){
      getTaskDetailInfoById({
        taskId:this.taskId
      }).then(res =>res.data)
      .then(data=>{
        if(data.code===200){
          const taskData=data.data;
          this.taskDetail=taskData;
          this.ruleForm.title=taskData.title;
          this.ruleForm.type=taskData.type;
          if(taskData.departId){
            this.ruleForm.departId=taskData.departId;
            this.ruleForm.departName=taskData.departName;
          }
          if(taskData.departJson||taskData.groupJson||taskData.userJson){
            this.ruleForm.activityScopes={
              departJson:taskData.departJson?JSON.parse(taskData.departJson):'',
              groupJson:taskData.groupJson?JSON.parse(taskData.groupJson):'',
              userJson:taskData.userJson?JSON.parse(taskData.userJson):''
            }
          }
          this.ruleForm.content=taskData.content;
          this.$refs.ueditor.setContent(taskData.content);
          this.fileJson=taskData.filesJson?JSON.parse(taskData.filesJson):[];
          if(taskData.picsJson.length!==0){
            const fileList=JSON.parse(taskData.picsJson);
            fileList.forEach(item => {
              let fileName=this.fileNameUse(item.picUrl).replace(/.+\//, "");
              item.fileUrl=item.picUrl;
              item.fileName=fileName;
            });
            this.picJson=fileList;
          }else{
            this.picJson=[];
          }
        }
      }).catch(()=>{})
    },
    activityHandler(val){
      this.ruleForm.type=val;
    },
    changeClass(val){
      //切换部门
      this.ruleForm.departId=val;
      let classItem=this.classList.find((item)=>item.classId==val);
      this.ruleForm.departName=classItem.className;
    },
    queryAllClassCourseFunc(){
      queryAllClassCourse({
        teacherId:this.userInfo.id
      }).then(res =>res.data)
      .then(data=>{
        if(data.code===200){
          this.classList=data.data;
          this.ruleForm.departId=this.classList[0].classId;
          this.ruleForm.departName=this.classList[0].className;
          this.getTaskDetailInfoByIdFunc();
        }
      }).catch(()=>{})
    },
    richTextEditHandler(content) {
      this.ruleForm.content = content;
    },
    insertActivity(taskState){
      if (this.ruleForm.title == "") {
        this.$message({
          type: "error",
          message: "请输入任务主题！"
        });
        return false;
      }
      if(this.ruleForm.type==0){
        if(this.classList&&this.classList.length==0){
          this.$message({
            type: "error",
            message: "请确认你是否有所教班级！"
          });
          return false;
        }
      }else if(this.ruleForm.type==1){
        if (Object.keys(this.ruleForm.activityScopes).length==0) {
          this.$message({
            type: "error",
            message: "请选择教师范围！"
          });
          return false;
        }
        if(this.ruleForm.activityScopes.departJson.length==0&&this.ruleForm.activityScopes.groupJson.length==0&&this.ruleForm.activityScopes.userJson.length==0){
          this.$message({
            type: "error",
            message: "请选择教师范围！"
          });
          return false;
        }
      }
      
      if(this.ruleForm.content==''&&(this.fileJson.length==0)){
        this.$message({
          type: "error",
          message: "请填写任务内容或上传任务附件"
        });
        return false;
      }
     
      if(Object.keys(this.ruleForm.activityScopes).length!==0){
        if(this.ruleForm.activityScopes.departJson.length==0){
          this.ruleForm.departJson='';
        }else{
          this.ruleForm.departJson=JSON.stringify(this.ruleForm.activityScopes.departJson);
        }
        if(this.ruleForm.activityScopes.groupJson.length==0){
          this.ruleForm.groupJson='';
        }else{
          this.ruleForm.groupJson=JSON.stringify(this.ruleForm.activityScopes.groupJson);
        }
        if(this.ruleForm.activityScopes.userJson.length==0){
          this.ruleForm.userJson='';
        }else{
          this.ruleForm.userJson=JSON.stringify(this.ruleForm.activityScopes.userJson);
        }
      }
      this.ruleForm.content=this.$refs.ueditor.getContent();
      //任务类型 0学生任务 1教师例会
      if(this.ruleForm.type===0){
        this.ruleForm.activityScopes={};
        this.ruleForm.groupJson='';
        this.ruleForm.userJson='';
        this.ruleForm.departJson='';
      }else{
        this.ruleForm.departId=0;
        this.ruleForm.departName='';
      }
      this.save_loading = true;
      editTask({
        id:this.taskId,
        title:this.ruleForm.title,
        type:this.ruleForm.type,
        departId:this.ruleForm.departId,
        departName:this.ruleForm.departName,
        departJson:this.ruleForm.departJson,
        groupJson:this.ruleForm.groupJson,
        userJson:this.ruleForm.userJson,
        content:this.ruleForm.content,
        filesJson:this.fileJson?JSON.stringify(this.fileJson):'',
        picsJson:this.picJson?JSON.stringify(this.picJson):'',
        taskType:0,
        taskState:taskState,
      }).then(res=>res.data)
      .then(data=>{
        if(data.code===200){
          if(taskState==1){
            this.$message({
              type: "success",
              message: "保存成功!"
            });
          }else if(taskState==2){
            this.$message({
              type: "success",
              message: "发布成功!"
            });
          }else if(taskState==-1){
            this.$message({
              type: "success",
              message: "保存成功!预览任务请到手机端查看!"
            });
          }
          this.$router.push({
            path:'taskList'
          })
        }else{
          this.save_loading = false;
        }
      }).catch(()=>{
        this.save_loading = false;
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.scrollBar {
  overflow-x: hidden;
  overflow-y: auto;
  &::-webkit-scrollbar-track-piece {
      background: #d3dce6;
  }
  &::-webkit-scrollbar {
      width: 6px;
  }
  &::-webkit-scrollbar-thumb {
      background: #99a9bf;
      border-radius: 20px;
  }
}
.clearfix:after {
    content: "";
    height: 0;
    display: block;
    clear: both;
    visibility: hidden;
}
textarea{
  resize: none;
}
.el-form-item.is-required .el-form-item__label:before {
    content: "*";
    color: #ff4949;
    margin-right: 4px;
}
.applyWrap{
  .el-checkbox{
    float:left;
  }
}
.applyBox{
  float: left;
  span{
    display: inline-block;
    height:36px;
    margin-right:6px;
  }
  span.is-required:before{
    content: "*";
    color: #ff4949;
    margin-right: 4px;
  }
}
.taskAdd{
  padding:12px;
  box-sizing: border-box;
  .menu-tools {
    border-bottom: 1px solid #e7eaec;
    padding-bottom: 10px;
  }
  .main-wrap{
    width:100%;
    padding-top:20px;
    padding-bottom:10px;
    box-sizing: border-box;
    .demo-ruleForm{
      width:810px;
      box-sizing: border-box;
      margin:0 auto;
      .addIsSignBtn{
        font-size: 20px;
        color: #409eff;
        cursor: pointer;
      }
    }
    .rearchBox{
      width:658px;
      .el-input{
        width:460px;
      }
      .topicTab{
        margin-bottom:10px;
      }
    }
    .selectWidth{
      width:100%;
    }
    .file{
      position: relative;
      display: inline-block;
      background: #fff;
      border: 1px dashed #ccc;
      color: #fff;
      text-decoration: none;
      text-indent: 0;
      width: 50px;
      height: 50px;
      font-size: 30px;
      text-align: center;
      font-weight: bold;
      cursor: pointer;
      color:#000;
      padding-top:3px;
      margin-top:10px;
    }
    .for-box{
      min-width: 100px;
      width: auto;
      height: 70px;
      float: left;
      margin-bottom: 10px;
      margin-top: 10px;
      .upload-img{
        width: 50px;
        height: 50px;
        vertical-align: middle;
      }
      .file_del{
        text-decoration: none;
        color: #337ab7;
      }
      .file-name{
        display: block;
        width: 100px;
        line-height: 20px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    }
  }
} 
textarea{
  resize: none;
}
</style>
<style lang="scss">

.taskAdd .el-checkbox{
  margin-right:20px;
}
.taskAdd {
  .activityLogo {
    .upload-file-item {
        width:200px !important; 

      img {
        width:100% !important;
        min-height:110px;
        margin:0;
        border: 1px dashed #1fc7cb;
        box-sizing:border-box;
        margin:0 !important;
      }
      .file-name {
          display: none;
      }
    }
  }
}
.taskEditPicBox .img-upload,.taskEditPicBox .file-name{
  display:none;
}
</style>
