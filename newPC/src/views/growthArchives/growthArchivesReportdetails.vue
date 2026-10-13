<template>
<div class="growthArchivesReportdetails"  >
     <div class="top"> 
         <el-button @click="$router.back()" type="default" size="medium">返回</el-button> 
         <el-button type="primary" size="medium" @click="growthArchivesclassliststu()">活动数据分析</el-button>  
         <el-button type="primary" size="medium"  @click="popfun(1)">移动</el-button> 
         <el-button type="primary" size="medium" @click="popfun(2)">复制</el-button>
      </div>
     <div class="subject" :style="`height: ${nobottommaxH}px;`">
        <el-checkbox-group v-model="checkList">
          <div class="subject-box" v-if="activityPhotoList.length">
              <div class="top-name" >
               <i class="el-icon-picture-outline"></i> 照片
              </div>
              <div class="box-ul">
                 <image-previewer tag="richtext">
                  <div class="box-li" v-for="(item,index) in activityPhotoList" :key="index">                       
                         <img :src="item.fileUrl+(funwidthheight(item.photoDetails)==1?'?imageView2/q/100/w/240':'?imageView2/q/100/h/220')" :class="{'width' : funwidthheight(item.photoDetails)==1, 'heigth': funwidthheight(item.photoDetails)==2}"  alt="">
                       <i class="el-icon-star-on" v-if="item.isStar==2"></i>
                        <el-checkbox :label="item.id">勾选</el-checkbox> 
                        <div class="foot">
                              <span @click.stop="dialogVisiblefun(item.fileStuList)">
                                 <i class="el-icon-user" ></i>&nbsp;{{item.stuCount}}&nbsp;&nbsp;&nbsp;&nbsp;
                            </span>
                            <span @click.stop="growthArchivesLeavingamessage(item.id)">
                               <i class="el-icon-chat-dot-round" ></i>&nbsp;{{item.messageCount}}
                            </span> 
                                                                                
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
                  <div class="box-li" v-for="(item,index) in activityVideoList" :key="index">
                        <video :src="item.fileUrl" controls="controls"></video>
                        <i class="el-icon-star-on" v-if="item.isStar==2"></i>
                        <el-checkbox :label="item.id">勾选</el-checkbox>
                        <div class="foot foot-video">
                                <span @click.stop="dialogVisiblefun(item.fileStuList)">
                                 <i class="el-icon-user" ></i>&nbsp;{{item.stuCount}}&nbsp;&nbsp;&nbsp;&nbsp;
                              </span>
                              <span @click.stop="growthArchivesLeavingamessage(item.id)">
                                <i class="el-icon-chat-dot-round" ></i>&nbsp;{{item.messageCount}}
                              </span>   
                                                                              
                        </div>
                  </div>
              </div>
         </div>
         <!-- <div class="subject-box" v-if="activityVoiceList.length">
              <div class="top-name" >
               <i class="el-icon-microphone"></i> 音频
              </div>
              <div class="box-ul">
                  <div class="box-li-audio" v-for="(item,index) in activityVoiceList" :key="index">
                        <el-checkbox :label="item.id">勾选</el-checkbox> 
                        <div class="right_icons_wrap">
                        <img class="img" src="https://cdnfile-10043692.file.myqcloud.com/admin/images/resource_manage/audio.png" alt="">
                        &nbsp;&nbsp;
                            <audio :id="'audio'+index" :src="item.fileUrl" controls style="display: none;"></audio>
                            <i class="el-icon-star-on" ></i>
                            <span @click="dialogVisiblefun(item.fileStuList)">
                                 <i class="el-icon-user" ></i>&nbsp;{{item.stuCount}}&nbsp;&nbsp;&nbsp;&nbsp;
                            </span>
                            <span @click="growthArchivesLeavingamessage(item.id)">
                               <i class="el-icon-chat-dot-round" ></i>&nbsp;{{item.messageCount}}
                            </span>                
                            <a :href="item.fileUrl" target="_blank" class="icon_box">
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
              </div>
         </div> -->
        </el-checkbox-group>
         
     </div>  
     <el-dialog title="评语" :close-on-press-escape='false' :close-on-click-modal='false' :visible.sync="dialogVisible" width="700px" :lock-scroll="false" :modal-append-to-body='false'>
			  <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                <el-form-item :label="item.stuName"   v-for="(item,index) in poplist" :key="index">
                    {{item.comment?item.comment:'----'}}
                </el-form-item>                
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
                </span>
	</el-dialog> 
   <el-dialog :title="num==1?'移动':'复制'" :close-on-press-escape='false' :close-on-click-modal='false' :visible.sync="dialogVisiblepop" width="400px" :lock-scroll="false" :modal-append-to-body='false'>
			  目标活动&nbsp;&nbsp; <el-select v-model="targetId" size="medium" placeholder="请选择">
                    <el-option v-for="item in targetIdlist"   :key="item.id" :label="item.activityName" :value="item.id">
                    </el-option>
                  </el-select>
     <span slot="footer" class="dialog-footer">
                   <el-button size="medium" type="default"  @click="dialogVisiblepop = false">取消</el-button>
                    <el-button type="primary" size="medium" @click="dialogVisiblepopfun()">确 定</el-button>
      </span>
	</el-dialog> 
</div> 
</template>
<script>
import { getGrowthArchivesActivityInfo,getCanOperateActivityListByActivityId,copyActivityFiles,moveActivityFiles} from "@/api/growthArchives";
import mixin from "@/mixins/windowResize";
import ImagePreviewer from "@/components/ImagePreviewer/ImagePreviewer.vue";
let is_playFinish;
export default {
  components: { ImagePreviewer },
  data() {
    return {
      activityPhotoList: [],
      activityVideoList: [],
      activityVoiceList: [],
      id: this.$route.query.id,
      poplist: [],
      dialogVisible: false,
      checkList:[],
      num:1,
      dialogVisiblepop:false,
      targetIdlist:[],
      targetId:""
    };
  },
  mixins: [mixin],
  created() {
    this.getGrowthArchivesActivityInfos();
  },
  methods: {
    dialogVisiblepopfun(){
      if(this.num==1){
         moveActivityFiles(this.checkList.toString(","),this.id,this.targetId)
        .then(res => res.data)
        .then(data => {
            if (data.code === 200) {
                this.$message({
                  type: "success",
                  message: "移动成功!"
                });
                this.dialogVisiblepop=false;
                this.checkList=[];
                 this.getGrowthArchivesActivityInfos();
              }
        });

      }else{
  copyActivityFiles(this.checkList.toString(","),this.id,this.targetId)
        .then(res => res.data)
        .then(data => {
            if (data.code === 200) {
                this.$message({
                  type: "success",
                  message: "复制成功!"
                });
                this.checkList=[];
                this.dialogVisiblepop=false;
                 this.getGrowthArchivesActivityInfos();
              }
        });

      }
      
    },
    popfun(num){
      if(this.checkList.length==0){
        this.$message({type: "warning",message: "至少勾选一个移动的文件!"});
        return;
      }
      getCanOperateActivityListByActivityId(this.id)
        .then(res => res.data)
        .then(data => {
            if(data.length>0){
              this.num=num;
              this.dialogVisiblepop=true;
              this.targetIdlist=data;
              this.targetId=data[0].id;
            }else{
                this.$message({type: "warning",message: "暂无可操作活动!"});
            }
        });
      
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
    dialogVisiblefun(list) {
      this.poplist = list;
      if (this.poplist.length) {
        this.dialogVisible = true;
      }
    },
    //判断宽高
    funwidthheight(obj) {
      let width = JSON.parse(obj).width - 0;
      let height = JSON.parse(obj).height - 0;
      return width > height ? 2 : 1;
    },
    //数据分析
    growthArchivesclassliststu() {
      this.$router.push({
        path: "growthArchivesclassliststu",
        query: { id: this.id }
      });
    },
    growthArchivesLeavingamessage(fileId) {
      this.$router.push({
        path: "growthArchivesLeavingamessage",
        query: { fileId: fileId, id: this.$route.query.id}
      });
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
          this.activityPhotoList = mydata.activityPhotoList;
          this.activityVideoList = mydata.activityVideoList;
          this.activityVoiceList = mydata.activityVoiceList;
        });
    }
  }
};
</script>
<style lang="scss" scoped>
.growthArchivesReportdetails {
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
      .box-li {
        width: 240px;
        height: 200px;
        display: flex;
        justify-content: center;
        border: 1px solid #F2F6FC;
        align-items: center;
        overflow: hidden;
        float: left;
        margin: 8px;
        border-radius: 5px;
        cursor: pointer;
        position: relative;
        .el-checkbox{
            position: absolute;
            left:5px;
            bottom:10px
          }
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
          color: #e6a23c;
          position: absolute;
          top: 5px;
          right: 10px;
          font-size: 28px;
          cursor: pointer;
          z-index: 1000;
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
          font-size: 15px;
        }
        .foot-video {
          background: #d9ecff;
          color: #409EFF;
        }
      }
      .box-li-audio {
        width: 260px;
        float: left;
        padding: 5px;
        color: #409EFF;
        line-height: 30px;
        font-size: 12px;
        border: 1px #409EFF solid;
        margin: 8px;
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
          color: #e6a23c;
          font-size: 20px;
          line-height: 30px;
        }
      }
    }
  }
}
</style>