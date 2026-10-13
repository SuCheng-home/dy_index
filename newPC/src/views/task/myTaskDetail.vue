 <!--通知的详情-->
<template>
    <div class="taskDetail">
      <div class="el-row menu-tools">
        <el-button size="medium" @click="$router.back()">返回</el-button>
        <el-button type="primary" size="medium"    @click="jumpTo('uploadTask',{id:taskId})" v-if="subTaskDetail.submitStatus==1">上交任务</el-button>
      </div>
      <div class="main-wrap scrollBar" :style="{'height':nobottommaxH+'px'}">
          <div class="demo-ruleForm">
            <div class="title">{{ taskDetail.title }}</div>
            <!-- <div class="meta-info">
              <span>
                <span v-if="taskDetail.isInscribe === 0">{{ taskDetail.createUserName }}</span>
                <span v-else>{{ taskDetail.departName }}</span>
              </span>
              <span v-if="taskDetail.sendDate">
                  {{taskDetail.sendDate|filterDate}}
              </span>
            </div> -->
            <div class="myaddress-box" >
              <image-previewer  tag="richtext">
                <div class="task-content" v-html="taskDetail.content"></div>
              </image-previewer>
            </div>    
            <div class="row" v-if="picJson&&picJson.length!==0">
              <div class="col-lg-12">
                <h2>图片</h2>
                <div class="upload-image-container">
                  <image-previewer  tag="richtext">
                    <ul class="upload-image-ul">
                      <li v-for="(pic,picIndex) in picJson" :key="picIndex">
                        <img class="view-img" :src="pic.picUrl" alt=""> 
                      </li>
                    </ul>
                  </image-previewer>
                </div>
              </div>
            </div>
            <div class="row" v-if="fileJson&&fileJson.length!==0">
              <div class="col-lg-12" >
                <h2>附件</h2>
                <div class="social-feed-box">
                  <file-list :fileList="fileJson"></file-list>
                </div>
              </div>
            </div>
            <div class="submitWrap" v-if="subTaskDetail.submitStatus==2">
              <div class="big-title">
                <span class="mudule-info">
                  <span  class="color-block"></span><span v-if="subTaskDetail.userName">({{subTaskDetail.userName}})</span>上交内容
                </span>
              </div>
              <div class="text-box">
                {{subTaskDetail.content}}
              </div>
              <div class="row" v-if="subPicsJson&&subPicsJson.length!==0">
                <div class="col-lg-12" >
                  <image-previewer tag="richtext">
                    <ul class="pic-box clearfix">
                      <li v-for="(pic,picIndex) in subPicsJson" :key="picIndex"> 
                        <img :src="pic.fileUrl" class="view-img">
                      </li>
                    </ul>
                  </image-previewer>
                </div>
              </div>
              <div class="row" v-if="subFilesJson&&subFilesJson.length!==0">
                <div class="col-lg-12" style="margin-bottom:10px;">
                  <div class="social-feed-box">
                    <file-list :fileList="subFilesJson"></file-list>
                  </div>
                </div>
              </div>
              <div class="row video-box clearfix" v-if="subVideosJson&&subVideosJson.length!==0">
                <div v-for="(video,videoIndex) in subVideosJson" :key="videoIndex">
                  <video  class="video-item" id="myVideo" :src="video.fileUrl" controls="controls"></video>
                </div>
              </div>
            </div>
          </div>
      </div>
    </div>
</template>
<script>
import mixin from '@/mixins/windowResize';
import Backtool from '@/components/BackTool';
import DefaultPage from "@/components/DefaultPage";
import ImagePreviewer from '@/components/ImagePreviewer/ImagePreviewer.vue';
import {mapGetters} from 'vuex';
import {getTaskDetailInfoById,getUserSubmitTaskInfo} from '@/api/task';
import FileList from '@/components/FileList/FileList.vue';
export default {
  components: {
      Backtool,
      DefaultPage,
      ImagePreviewer,
      FileList
  },
  computed: {
      ...mapGetters(['userInfo'])
  },
  data() {
    return {
      taskId:this.$route.query.id,
      userId:this.$route.query.userId?this.$route.query.userId:0,
      taskDetail:{},
      departJson:'',
      groupJson:'',
      userJson:'',
      fileJson:[],
      picJson:[],
      subTaskDetail:{},
      subPicsJson:[],
      subFilesJson:[],
      subVideosJson:[]
    }
  },
  filters: {
    trimTime(datetime) {
        return datetime ? datetime.slice(0, datetime.lastIndexOf('.')) : '--';
    }
  },
  mixins:[mixin],
  created() {
    this.getTaskDetailInfoByIdFunc();
  },
  methods: {
    jumpTo(path,query={}){
      this.$router.push({
        path,
        query
      })
    },
    getUserSubmitTaskInfoFunc(){
      getUserSubmitTaskInfo({
        taskId:this.taskId,
        userId:this.userId
      }).then(res =>res.data)
      .then(data=>{
        if(data.code===200){
          const subTaskData=data.data;
          this.subTaskDetail=data.data;
          if(subTaskData.picsJson&&subTaskData.picsJson.length!==0){
            const subTaskCommon=JSON.parse(subTaskData.picsJson);
            subTaskCommon.forEach(item=>{
              if(!item.fileUrl){
                item.fileUrl=item.picUrl;
              }
            })
            this.subPicsJson=subTaskCommon;
          }else{
            this.subPicsJson=[];
          }
          if(subTaskData.videosJson&&subTaskData.videosJson.length!==0){
            const subTaskVideo=JSON.parse(subTaskData.videosJson);
            subTaskVideo.forEach(item=>{
              if(!item.fileUrl){
                item.fileUrl=item.videoUrl;
              }
            })
            this.subVideosJson=subTaskVideo;
          }else{
            this.subVideosJson=[];
          }
          this.subFilesJson=subTaskData.filesJson.length!==0?JSON.parse(subTaskData.filesJson):'';
        }
      })
    },
    getTaskDetailInfoByIdFunc(){
      getTaskDetailInfoById({
        taskId:this.taskId
      }).then(res =>res.data)
      .then(data=>{
        if(data.code===200){
          const taskData=data.data;
          this.taskDetail=taskData;
          if(taskData.departJson||taskData.groupJson||taskData.userJson){
            this.departJson=taskData.departJson?JSON.parse(taskData.departJson):'';
            this.groupJson=taskData.groupJson?JSON.parse(taskData.groupJson):'';
            this.userJson=taskData.userJson?JSON.parse(taskData.userJson):'';

          }
          this.fileJson=taskData.filesJson?JSON.parse(taskData.filesJson):[];
          this.picJson=taskData.picsJson?JSON.parse(taskData.picsJson):[];
          
          this.getUserSubmitTaskInfoFunc();
        }
      }).catch(()=>{})
    },
  }
}
</script>
<style lang="scss" scoped>
.clearfix:after{
  content: '';
  display: block;
  height: 0;
  visibility: hidden;
  clear: both;
}
ul,li{
  list-style: none;
}
.taskDetail{
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
      .title {
          line-height: 1.2em;
          font-size: 26px;
          text-align: center;
          color: rgb(47, 64, 80);
          margin: 20px 0 20px;
      }
      .myaddress-box{
        overflow: hidden;
      }
      .read-section{
        margin-top:20px;
        .span-line{
          margin-right:20px;
          span{
            color:#337ab7;
          }
        }
      }
    }
  }
}

  .demo-ruleForm h1 {
      font-size: 38px;
      color: rgb(47, 64, 80);
      line-height: 1.1em;
  }

  .demo-ruleForm h2 {
      font-size: 16px;
      font-weight: normal;
      color: rgb(47, 64, 80);
  }

  .demo-ruleForm hr {
      height: 1px;
      border: 0;
      border-top: 1px solid #d0d0d0;
  }
  .demo-ruleForm-title {
      text-align: center;
  }
  .demo-ruleForm p {
      font-size: 15px;
      line-height: 26px;
      color: #676A6C;
      word-wrap: break-word;
      word-break: break-all;
  }

  .sub-title {
      text-align: right;
      color: #676A6C
  }

  .hasread-small {
      border: 1px solid #e7eaec;
      padding: 2px;
      border-radius: 2px;
      display: inline-block;
      padding-right: 4px;
  }

  .notice-content {
      min-height: 100px;
  }

  .has-img {
      min-height: 250px;
  }

  .clear {
      clear: both;
  }

  .file-list,
  .range-list {
      margin: 10px;
  }

  .demo-ruleForm .social-feed-box:last-child {
      margin-bottom: 0;
      border-bottom: 1px solid rgb(231, 234, 236);
  }

  .range-item {
      height: 30px;
      display: block;
      float: left;
      margin-left: 4px;
      margin-top: 4px;
      margin-right: 20px;
  }

  .range-item-img {
      height: 28px;
      width: 28px;
      display: block;
      float: left;
      background-position: center center;
      background-size: cover;
  }

  .range-item-des {
      padding-left: 4px;
      line-height: 30px;
      padding-right: 4px;
      color: #676A6C;
      font-size: 13px;
  }

  .social-feed-box ,.upload-image-container{
      border: 1px solid #e7eaec;
      background: #fff;
      margin-bottom: 15px;
      font-size:14px;
  }
  .upload-image-container {
    li{
      display: inline-block;
      border: 1px solid #ccc;
      margin-right: 10px;
      width: 112px;
      height: 112px;
      position: relative;
      span,img{
        display: block;
        background-size: cover;
        background-repeat: no-repeat;
        background-position: center center;
        margin-left: 5px;
        margin-top: 5px;
        margin-bottom: 5px;
        width: 100px;
        height: 100px;
      }
    }
    
  }
  .upload-image-ul{
    padding:10px 10px 0;
  }
  .file-item-img {
      height: 28px;
      width: 28px;
      display: block;
      float: left;
      background-position: center center;
      background-size: cover;
  }

  .file-item {
      height: 30px;
      display: block;
      border-bottom: 1px solid #e7eaec;
      margin-left: 4px;
      margin-top: 4px;
  }

  .file-item-des {
      padding-left: 4px;
      line-height: 30px;
      padding-right: 4px;
  }

  .departName {
      padding: 2px 4px;
  }

  .img-item {
      width: 160px;
      height: 200px;
      float: left;
      margin-right: 10px;
      margin-top: 10px;
  }
  .page-main--scroller {
      overflow-y: auto;
      height: 600px;
      overflow-x: hidden;
  }
  .page-main--scroller::-webkit-scrollbar {
      width: 6px;
  }
  .page-main--scroller::-webkit-scrollbar-thumb {
      background: #99a9bf;
      border-radius: 20px;
  }
  .page-main--scroller::-webkit-scrollbar-track-piece {
      background: #d3dce6;
  }
.submitWrap{
  color:#333;
  .big-title{
    margin-top:20px;
    margin-bottom:6px;
    .mudule-info{
      height: 40px;
      font-size: 15px;
      font-weight: 700;
      line-height: 40px;
      color: #676a6c;
      .color-block{
        width: 4px;
        display: inline-block;
        margin-right: 12px;
        vertical-align: middle;
        margin-top: -3px;
        height: 16px;
        background: #409EFF;
      }
    }
  }
  .text-box{
    word-break: break-all;
    line-height:26px;
    margin-bottom:10px;
  }
  .pic-box{
    li{
      float: left;
      display: block;
      border: 1px solid #ccc;
      margin-right: 10px;
      width: 102px;
      height: 102px;
      position: relative;
      border: 1px solid #e7eaec;
      border-radius: 3px;
      margin-right: 10px;
      margin-bottom: 10px;
      .view-img{
        display: block;
        width: 100%;
        height: 100%;
      }
    }
  }
  .video-box{
    margin-bottom:10px;
    .video-item{
      float:left;
      width: 46%;
      height: 200px;
      border:1px solid #dadada;
      position: relative;
      border-radius:6px;
      box-sizing: border-box;
      margin-bottom:20px;
      margin-right:20px;
      video{
        width:100%;
        height:100%;
      }
    }
  }
}
  
</style>
<style lang="scss">
.task-content{
  min-height:200px;
  p{
    padding:0;
    margin:0;
  }
  .file-item{
    margin-bottom:10px;
  }
}
.task-content ol,.task-content ul{
  padding-left: 30px;
}
.task-content td, .task-content th {
    padding: 5px 10px;
    border: 1px solid #DDD;
}
.task-content table {
    border-collapse: collapse;
    border-spacing: 0;
    margin-bottom: 10px;
}
.task-content p{
  margin: 0 0 10px;
}
.task-content img{
  display:block;
  max-width:100%;
  height:auto;
}
</style>

