<template>
  <div class="achieve_info_wrap">
    <common-header show-back show-border>
      <el-button type="primary" size="medium" @click="addScore" v-if="achieveInfo.achievementisState===2 && taskInfo.score">保存</el-button>
      <el-button type="primary" size="medium" @click="changeScore" v-if="achieveInfo.achievementisState===4 && taskInfo.score">修改评分</el-button>
    </common-header>
    <div class="clock_info_inner_box" :style="{'height':nobottommaxH+'px'}">
      <div class="achieve_box">
        <div class="title_box">
          <div class="achieve_title">{{achieveInfo.userName}} - {{achieveInfo.classDepartName}}</div>
          <div class="achieve_desc">{{achieveInfo.createTime | dateFilter}}</div>
        </div>
        <div class="achieve_content">
          <div class="tip_input" v-if="taskInfo.isText===2">
            {{achieveInfo.textJson}}
          </div>
          <div class="tip_pic" v-if="taskInfo.isPhoto===2">
            <image-previewer tag="richtext">
              <div class="clearfix">
                <el-image class="img_block" :src="picItem" fit="cover" v-for="(picItem, picIndex) in photoList" :key="picIndex"></el-image>
              </div>
            </image-previewer>
          </div>
          <div class="tip_video" v-if="taskInfo.isVideo===2 && videoList && videoList.length">
            <video :src="item.videoUrl" controls class="video_show" v-for="(item, index) in videoList" :key="index"></video>
          </div>
          <div class="tip_voice" v-if="taskInfo.isVoice===2 && audioList && audioList.length">
            <audio class="audio" :src="item" controls="controls" v-for="(item, index) in audioList" :key="index"></audio>
          </div>
        </div>
      </div>
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="55px" class="demo-ruleForm" v-if="taskInfo.score">
        <el-form-item label="评分" prop="batchScore">
          <template v-if="achieveInfo.achievementisState===2">
            <el-input-number v-model="ruleForm.batchScore" :precision="1" :step="0.1" :min="0.1" :max="taskInfo.score" step-strictly></el-input-number>
          </template>
          <template v-else>{{achieveInfo.batchScore | scoreFilter}}</template>
        </el-form-item>
        <el-form-item label="评价" prop="batchContent">
          <template v-if="achieveInfo.achievementisState===2">
          <el-input v-model.trim="ruleForm.batchContent" type="textarea" :autosize="{ minRows: 3, maxRows: 5}"
                    placeholder="请填写评价介绍" :maxlength="200" show-word-limit></el-input>
          </template>
          <template v-else>{{achieveInfo.batchContent || '--'}}</template>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
  import mixin from '@/mixins/windowResize'
  import CommonHeader from './components/CommonHeader'
  import ImagePreviewer from '@/components/ImagePreviewer/ImagePreviewer.vue';
  import {getEcardUser, updateEcardUser} from '@/api/eClock'

  export default {
    name: "clockCardAchieveInfo",
    components: {CommonHeader, ImagePreviewer},
    data() {
      return {
        cardId: this.$route.query.cardId,
        userId: this.$route.query.userId,
        achieveInfo: {},
        taskInfo: {},
        photoList: [],
        videoList: [],
        audioList: [],
        ruleForm: {
          batchScore: '1.0',
          batchContent: ''
        },
        rules: {
          batchScore: [
            {required: true, message: "请输入评分", trigger: "blur"}
          ]
        }
      }
    },
    created() {
      this.taskInfo = JSON.parse(sessionStorage.getItem('taskInfo'));
      this.getEcardUser();
    },
    filters: {
      dateFilter(value) {
        return value ? value.substring(0, 16) : '';
      },
      scoreFilter(value) {
        return value ? parseFloat(value).toFixed(1) : '';
      }
    },
    mixins: [mixin],
    methods: {
      changeScore() {
        this.achieveInfo.achievementisState = 2;
      },
      addScore() {
        this.$refs.ruleForm.validate((isValid) => {
          if (isValid) {
            this.updateEcardUser();
          }
        });
      },
      getEcardUser() {
        getEcardUser({eCardId: this.cardId, userId: this.userId}).then(res => res.data).then(data => {
          if (data.code === 200) {
            this.achieveInfo = data.data;
            if (this.taskInfo.isPhoto===2) {
              this.photoList = JSON.parse(data.data.photoJson);
            }
            if (this.taskInfo.isVideo===2) {
              this.videoList = JSON.parse(data.data.videoJson);
            }
            if (this.taskInfo.isVoice===2) {
              this.audioList = JSON.parse(data.data.voiceJson);
            }
            if (this.taskInfo.score) {
              this.ruleForm.batchScore = this.achieveInfo.batchScore;
              this.ruleForm.batchContent = this.achieveInfo.batchContent;
            }
          } else {
            this.$message({type: 'error', message: data.msg})
          }
        }).catch(() => {})
      },
      updateEcardUser() {
        updateEcardUser({...this.ruleForm, ...{achievementisState: 4, eCardId: this.cardId, userId: this.userId, sendUserType: this.taskInfo.sendUserType}}).then(res => res.data).then(data => {
          if (data.code === 200) {
            this.$message({type: 'success', message: '保存成功!'});
            this.getEcardUser();
          } else {
            this.$message({type: 'error', message: data.msg})
          }
        }).catch();
      }
    }
  }
</script>

<style scoped>
  .clearfix:after {
    content: "";
    display: block;
    font-size: 0;
    height: 0;
    clear: both;
    visibility: hidden;
  }
  .clearfix {
    zoom: 1;
  }
</style>
<style lang="scss" scoped>
  .achieve_info_wrap{
    padding: 12px;
    .clock_info_inner_box{
      overflow: hidden auto;

      .achieve_box{
        width: 810px;
        margin: 15px auto;
        .title_box{
          padding: 10px 15px 0;
          .achieve_title{
            line-height: 16px;
            font-size: 15px;
            margin-bottom: 10px;
            color: #333;
          }
          .achieve_desc{
            line-height: 15px;
            font-size: 12px;
            color: #5F5F5F;
          }
        }
        .achieve_content{
          /*padding-bottom: 10px;*/
          padding: 10px 15px;
          .tip_input{
            padding: 5px 0;
            .input_box{
              background-color: #f8f8f8;
            }
          }
          .tip_pic{
            padding: 5px 0;
            overflow: hidden;
            .img_block{
              width: 100px;
              height: 100px;
              float:left;
              margin-right: 15px;
              margin-bottom: 15px;
            }
          }
          .tip_video{
            background-color: #f8f8f8;
            overflow: hidden;
            .video_up{
              width: 100%;
              padding: 5px 8px;
            }
            .video_show{
              width: 100%;
            }
          }
          .tip_voice{
            padding: 5px 0;
            overflow: hidden;
          }
        }
      }

      .demo-ruleForm{
        width: 810px;
        margin: 15px auto;
      }
    }
  }
</style>
