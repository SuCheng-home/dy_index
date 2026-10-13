<template>
<div class="growthArchivesindextwodetails"  >
     <div class="top"> 
         <el-button @click="$router.back()" type="default" size="medium">返回</el-button>    
      </div>
     <div class="subject" :style="`height: ${nobottommaxH}px;`">
         <div class="subject-box" v-if="activityPhotoList.length">
              <div class="top-name" >
               <i class="el-icon-picture-outline"></i> 照片
              </div>
              <div class="box-ul">
                 <image-previewer tag="richtext">
                  <div class="box-ul-box" v-for="(item,index) in activityPhotoList" :key="index">
                    <div class="box-li" >
                      <div class="box-li-pop"></div>                       
                        <img :src="item.fileUrl+(funwidthheight(item.photoDetails)==1?'?imageView2/q/100/w/240':'?imageView2/q/100/h/220')" :class="{'width' : funwidthheight(item.photoDetails)==1, 'heigth': funwidthheight(item.photoDetails)==2}"  alt="">
                        <i class="el-icon-star-on" :class="{'color':item.isStar==2}" @click="starOrCancelStarActivityFiles(1,index,item)"></i>                                               
                    </div>
                    <div class="input">
                       <el-input :disabled="!myishide" size="medium" placeholder="请输入评语（0~15）" @change="addActivityFileStuComments(item.fileStuList[0])" maxlength="15" v-model.trim="item.fileStuList[0].comment"></el-input>
                    </div>                   
                  </div>
                   </image-previewer>
                  
              </div>
         </div>
         <div class="subject-box" v-if="activityVideoList.length">
              <div class="top-name" >
               <i class="el-icon-video-play"></i> 视频
              </div>
              <div class="box-ul">
                <div class="box-ul-box" v-for="(item,index) in activityVideoList" :key="index">
                  <div class="box-li" >
                        <div class="box-li-pop"></div>
                        <video :src="item.fileUrl" controls="controls"></video>
                        <i class="el-icon-star-on"  :class="{'color':item.isStar==2}" @click="starOrCancelStarActivityFiles(2,index,item)"></i>                       
                  </div>
                   <div class="input">
                       <el-input :disabled="!myishide" size="medium" placeholder="请输入评语（0~15）" @change="addActivityFileStuComments(item.fileStuList[0])" maxlength="15" v-model.trim="item.fileStuList[0].comment"></el-input>
                    </div>                   
                  </div>
              </div>
         </div>
         <!-- <div class="subject-box" v-if="activityVoiceList.length">
              <div class="top-name" >
               <i class="el-icon-microphone"></i> 音频
              </div>
              <div class="box-ul">
                <div class="box-ul-box" v-for="(item,index) in activityVoiceList" :key="index">
                  <div class="box-li-audio">
                        <div class="right_icons_wrap">
                        <img class="img" src="https://cdnfile-10043692.file.myqcloud.com/admin/images/resource_manage/audio.png" alt="">
                        &nbsp;&nbsp;
                            <audio :id="'audio'+index" :src="item.fileUrl" controls style="display: none;"></audio>
                            <i class="el-icon-star-on"  :class="{'color':item.isStar==2}" @click="starOrCancelStarActivityFiles(3,index,item)"></i>                                                     
                            <a :href="item.fileUrl"   target="_blank" class="icon_box">
                                <i class="el-icon-download"></i>&nbsp;&nbsp;&nbsp;&nbsp;
                            </a>
                             <span class="icon_box" @click="audioPlay(index)" v-if="item.isPauseNow">
                                 <i class="el-icon-video-play"></i>&nbsp;&nbsp;&nbsp;&nbsp;
                            </span>
                            <span class="icon_box" @click="audioPause(index)" v-else>
                                 <i class="el-icon-video-pause"></i>&nbsp;&nbsp;&nbsp;&nbsp;
                            </span>
                        </div>
                     </div>
                   <div class="input">
                       <el-input :disabled="!myishide"  size="medium" placeholder="请输入评语（0~15）" @change="addActivityFileStuComments(item.fileStuList[0])" maxlength="15" v-model.trim="item.fileStuList[0].comment"></el-input>
                    </div>                   
                  </div>
              </div>
         </div> -->
         <default-page Mes="暂无照片,视频" v-if="myisnum==0"></default-page>
     </div> 
</div> 
</template>
<script>
import { getGrowthArchivesActivityInfo,addActivityFileStuComment,possessRole,starOrCancelStarActivityFile} from "@/api/growthArchives";
import mixin from "@/mixins/windowResize";
import ImagePreviewer from "@/components/ImagePreviewer/ImagePreviewer.vue";
import DefaultPage from "@/components/DefaultPage";
let is_playFinish;
export default {
  components: { ImagePreviewer,DefaultPage},
  data() {
    return {
      activityPhotoList: [],
      activityVideoList: [],
      activityVoiceList: [],
      id: this.$route.query.id,
      stuId:this.$route.query.stuId,
      myishide:false,
      myisnum: 1,
    };
  },
  mixins: [mixin],
  created() {
       possessRole('11,131,10086').then(res => {
         this.myishide = res.data.data.result;
    });
    this.getGrowthArchivesActivityInfos();
  },
  methods: {
    //加精
    starOrCancelStarActivityFiles(num,index,obj){
      if(!this.myishide){
        return;
      }
      let isStar=obj.isStar==1?2:1;
      let name=obj.isStar==1?'加精':'取消加精';
       this.$confirm("确认要"+name+"吗？", name, {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        lockScroll: false
      }).then(() => {         
           starOrCancelStarActivityFile(obj.id,isStar).then(res => {
            if (res.data.code === 200) {
              this.$message.success(name+"成功！");
               if(num==1){
                 this.activityPhotoList[index].isStar=isStar;
               }else if(num==2){
                 this.activityVideoList[index].isStar=isStar;
               }else{
                 this.activityVoiceList[index].isStar=isStar;
               }
            } else {
              this.$message.error(res.data.msg);
            }
          });
        })
        .catch(() => {});
    },
    //新增评语
    addActivityFileStuComments(obj){
      addActivityFileStuComment(obj).then(res => {});
    },
    audioPlay(index) {
      let $this = this;
      for (let i = 0; i < $this.activityVoiceList.length; i++) {
        $this.activityVoiceList[i].isPauseNow = true;
        let myaudioBtn = document.getElementById("audio" + i);
        myaudioBtn.pause();
      }
      let audioBtn = document.getElementById("audio" + index);
      audioBtn.play();
      is_playFinish = setInterval(() => {
        if (audioBtn.ended) {
          window.clearInterval(is_playFinish);
        }
      }, 1000);
      $this.activityVoiceList[index].isPauseNow = false;
    },
    audioPause(index) {
      this.activityVoiceList[index].isPauseNow = true;
      let audioBtn = document.getElementById("audio" + index);
      audioBtn.pause();
      window.clearInterval(is_playFinish);
    },
    //判断宽高
    funwidthheight(obj) {
      let width = JSON.parse(obj).width - 0;
      let height = JSON.parse(obj).height - 0;
      return width > height ? 2 : 1;
    },
    //获取详情
    getGrowthArchivesActivityInfos() {
      getGrowthArchivesActivityInfo(this.id)
        .then(res => res.data)
        .then(data => {
          let mydata = data.data;
          for (let i = 0; i < mydata.activityVoiceList.length; i++) {
            mydata.activityVoiceList[i].isPauseNow = true;
          }
           for(let i=0;i<mydata.activityPhotoList.length;i++){
             if(!mydata.activityPhotoList[i].fileStuList.length){
                mydata.activityPhotoList[i].fileStuList.push({
                   activityId:this.id,
                   stuId:this.stuId,
                   comment:'',
                   fileId:mydata.activityPhotoList[i].id
                });
             }           
          }
          for(let i=0;i<mydata.activityVoiceList.length;i++){
              if(!mydata.activityVoiceList[i].fileStuList.length){
                mydata.activityVoiceList[i].fileStuList.push({
                   activityId:this.id,
                   stuId:this.stuId,
                   comment:'',
                   fileId:mydata.activityVoiceList[i].id
                });
             }       
          }
          for(let i=0;i<mydata.activityVideoList.length;i++){
           if(!mydata.activityVideoList[i].fileStuList.length){
                mydata.activityVideoList[i].fileStuList.push({
                   activityId:this.id,
                   stuId:this.stuId,
                   comment:'',
                   fileId:mydata.activityVideoList[i].id
                });
             }      
          }
          this.myisnum = mydata.activityVoiceList.length + mydata.activityVideoList.length + mydata.activityPhotoList.length;
          this.activityPhotoList = mydata.activityPhotoList;
          this.activityVideoList = mydata.activityVideoList;
          this.activityVoiceList = mydata.activityVoiceList;
        });
    }
  }
};
</script>
<style lang="scss" scoped>
.growthArchivesindextwodetails {
  padding: 15px;
  .top {
    border-bottom: 1px solid #e7eaec;
    padding-bottom: 10px;
  }
  .demo-ruleForm {
    max-height: 400px;
    overflow: auto;
    .el-form-item {
      margin-bottom: 0px;
    }
  }
  .subject {
    overflow: auto;
    padding: 10px 0 30px 0;
    .top-name {
      color: #606266;
      background-color: #d9ecff;
      padding: 8px 5px;
      font-size: 15px;
      line-height: 20px;
      i {
        color: #409EFF;
        font-size: 20px;
        float: left;
        margin-right: 5px;
      }
    }
    .box-ul {
      overflow: hidden;
      .box-ul-box{
        width:240px;
        margin: 8px;
        float:left;
        overflow:hide;
        .input{
          margin-top: 8px;
          float: left;
          width: 100%;
        }
      }
      .box-li {
        width: 240px;
        height: 200px;
        border: 1px solid #F2F6FC;
        display: flex;
        justify-content: center;
        align-items: center;
        overflow: hidden;
        float: left;
        border-radius: 5px;
        cursor: pointer;
        position: relative;
        .width {
          width: 240px;
          min-height: 200px;
        }
        .heigth {
          height: 200px;
        }
        video {
          width: 100%;
          height: 200px;
          background: #000;
          display: block;
          position: absolute;
          top: 0;
        }
        .el-icon-star-on {
           color: #DCDFE6;
          position: absolute;
          top: 5px;
          right: 10px;
          font-size: 28px;
          cursor: pointer;
          z-index: 1000;
        }
        .box-li-pop{
            top: 0px;
            width: 240px;
            z-index: 10;
            height: 36px;
            background: rgba(0,0,0,0.4);
            position: absolute;
        }
        .color{          
           color: #e6a23c;
        }
        .foot {
          position: absolute;
          bottom: 0;
          left: 0;
          height: 36px;
          line-height: 36px;
          color: #fff;
          width: 100%;
          background: rgba(255, 255, 255, 0.4);
          text-align: right;
          padding: 0 10px;
        }
        .foot-video {
          background: #d9ecff;
          color: #409EFF;
        }
      }
      .box-li-audio {
        width: 240px;
        float: left;
        padding: 5px;
        color: #409EFF;
        line-height: 30px;
        font-size: 12px;
        border: 1px #409EFF solid;
        margin: 8px 0;
        border-radius: 3px;
        i {
          font-size: 16px;
          line-height: 30px;
          cursor: pointer;
        }
        img {
          float: left;
          width: 30px;
        }
        .icon_box {
          float: right;
        }
        .el-icon-star-on {
         color: #DCDFE6;
          font-size: 20px;
          line-height: 30px;
        }
        .color{          
           color: #e6a23c;
        }
      }
    }
  }
}
</style>