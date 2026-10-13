<template>
  <div class="activityAdd">
    <div class="el-row menu-tools">
      <el-button  size="medium" @click="$router.back()">返回</el-button>
      <el-button type="primary" size="medium"   :loading="save_loading" @click="insertActivity()">提交</el-button>
    </div>
    <div class="main-wrap scrollBar" :style="{'height':nobottommaxH+'px'}">
      <el-form :model="ruleForm" ref="ruleForm" label-width="140px" class="demo-ruleForm">
        <el-form-item label="内容">
          <el-input type="textarea" :rows="5" v-model.trim="ruleForm.replyContent" :maxlength="500" ></el-input>
        </el-form-item>
        <el-form-item label="图片">
            <uploader pathPrefix="renwu" module="renwu" moduleCode="1214" multiple v-model="picFiles" :extList="['jpeg', 'jpg', 'bmp', 'gif', 'png']" showMode="image" showResult="image" :lineList="false"></uploader>
        </el-form-item>
        <el-form-item label="附件">
          <uploader pathPrefix="renwu" module="renwu" moduleCode="1214" :multiple="true" :extList="allFileTypeList" v-model="fileJson" ></uploader>
        </el-form-item>
        <el-form-item label="视频">
          <uploader pathPrefix="renwu" module="renwu" moduleCode="1214" :multiple="true" :extList="['mp4','flv']"  v-model="videoJson" ></uploader>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import mixin from '@/mixins/windowResize';
import {mapGetters} from 'vuex';
import Uploader from '@/components/Uploader/WebUploader';
import {thSubmitTask} from '@/api/task';
export default {
  components:{
    Uploader
  },
  data(){
    return{
      taskId:this.$route.query.id,
      save_loading:false,
      ruleForm:{
        replyContent:'',
      },
      picFiles:[],
      allFileTypeList: ['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'pdf'],
      fileJson:[],
      videoJson:[]
    }
  },
  created(){
  },
  mounted(){
  },
  mixins:[mixin],
  methods:{
    insertActivity(){
      if (this.ruleForm.replyContent==''&&this.picFiles.length==0&&this.fileJson.length==0&&this.videoJson.length==0) {
        this.$message({
          type: "error",
          message: "内容、图片、附件、视频不能全为空！"
        });
        return false;
      }
      this.save_loading = true;
      thSubmitTask({
        taskId:this.taskId,
        submitStatus:2,
        content:this.ruleForm.replyContent,
        picsJson:this.picFiles.length!==0?JSON.stringify(this.picFiles):'',
        filesJson:this.fileJson.length!==0?JSON.stringify(this.fileJson):'',
        videosJson:this.videoJson.length!==0?JSON.stringify(this.videoJson):'',
      }).then(res=>res.data)
      .then(data=>{
        if(data.code===200){
          this.$message({
            type: "success",
            message: "提交成功!"
          });
          this.$router.push({
            path:'myTaskList'
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
.activityAdd{
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

.activityAdd .el-checkbox{
  margin-right:20px;
}
.activityAdd {
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

</style>
