<template>
  <div class="clock_info_wrap">
    <common-header show-back show-border>
      <el-button type="primary" size="medium" @click="toClockPage" v-if="isShowByPermission('/ecard/ecardTempList')">打卡统计</el-button>
      <el-button type="primary" size="medium" @click="toScorePage" v-if="taskInfo.isCardBatch===2 && isShowByPermission('/ecard/ecardTempList')">打卡评分统计</el-button>
      <el-button type="primary" size="medium" @click="toAchievePage" v-if="taskInfo.isAchievementis===2">成果统计</el-button>
    </common-header>
    <div class="clock_info_inner_box" :style="{'height':nobottommaxH+'px'}">
      <div class="clock_info_box">
        <el-form label-width="120px">
          <el-form-item label="任务名称">{{taskInfo.title}}</el-form-item>
          <el-form-item label="介绍">{{taskInfo.content}}</el-form-item>
          <el-form-item label="图片" v-if="photoList && photoList.length">
            <image-previewer tag="richtext">
              <div class="clearfix">
                <el-image class="img_block" :src="picItem.fileUrl" fit="cover" v-for="(picItem, picIndex) in photoList" :key="picIndex"></el-image>
              </div>
            </image-previewer>
          </el-form-item>
          <el-form-item label="附件" v-if="fileList && fileList.length">
            <file-list :fileList="fileList"></file-list>
          </el-form-item>
          <el-form-item label="日常调查" v-if="subjectList && subjectList.length">
            <subject-show :list="subjectList"></subject-show>
          </el-form-item>
          <el-form-item label="发布对象">
            <span>{{ taskInfo.sendUserType===1 ? '教师' : '学生' }}</span>
          </el-form-item>
          <el-form-item label="对象范围">
            <span>{{ getScopeInfo(taskInfo.sendUserType) }}</span>
          </el-form-item>
          <el-form-item label="起止时间">
            <span>{{ taskInfo.dateJson | dateFilter }}</span>
          </el-form-item>
          <el-form-item label="每日提醒">
            <span v-if="taskInfo.isRemind===2">{{taskInfo.remindTime}}</span>
            <span v-else>不提醒</span>
          </el-form-item>
          <el-form-item label="允许补卡">{{taskInfo.isMakeCard===2 ? '允许' : '不允许'}}</el-form-item>
          <el-form-item label="打卡评分">{{taskInfo.isCardBatch===2 ? '是' : '否'}}&nbsp;&nbsp;{{taskInfo.isBatchShow===2 ? '打卡评分互相可见' : ''}}</el-form-item>
          <el-form-item label="打卡评分总分" v-if="taskInfo.isCardBatch===2">{{taskInfo.cardScore || 0}}</el-form-item>
          <el-form-item label="最终成果上传">{{taskInfo.isAchievementis===2 ? '上传' : '不上传'}}</el-form-item>
          <template v-if="taskInfo.isAchievementis===2">
            <el-form-item label="上传时间">{{taskInfo.achuevStartDate}}~{{taskInfo.achuevEndDate}}</el-form-item>
            <el-form-item label="成果内容">
              <span v-if="taskInfo.isPhoto===2">图片&nbsp;&nbsp;</span>
              <span v-if="taskInfo.isText===2">文本&nbsp;&nbsp;</span>
              <span v-if="taskInfo.isVideo===2">视频&nbsp;&nbsp;</span>
              <span v-if="taskInfo.isVoice===2">语音</span>
            </el-form-item>
            <el-form-item label="评分总分">{{taskInfo.score}}</el-form-item>
          </template>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
  import mixin from '@/mixins/windowResize'
  import { isShowByPermission } from "@/utils/utils";
  import ImagePreviewer from '@/components/ImagePreviewer/ImagePreviewer.vue';
  import FileList from '@/components/FileList/FileList.vue';
  import CommonHeader from './components/CommonHeader'
  import SubjectShow from './components/SubjectShow'
  import {getEcard} from '@/api/eClock'

  export default {
    name: "clockInfo",
    components: {ImagePreviewer, FileList, CommonHeader, SubjectShow},
    data() {
      return {
        cardId: this.$route.query.cardId,
        taskInfo: {},
        subjectList: [],
        photoList: [],
        fileList: []
      }
    },
    created() {
      this.getEcard();
    },
    filters: {
      dateFilter(date) {
        return date ? JSON.parse(date).toString() : date;
      }
    },
    mixins: [mixin],
    methods: {
      isShowByPermission,
      toClockPage() {
        sessionStorage.setItem('taskInfo', JSON.stringify(this.taskInfo));
        this.$router.push({path: 'clockCardStatistics', query: {cardId: this.cardId}})
      },
      toScorePage() {
        sessionStorage.setItem('taskInfo', JSON.stringify(this.taskInfo));
        this.$router.push({path: 'clockCardScore', query: {cardId: this.cardId, sendUserType: this.taskInfo.sendUserType}})
      },
      toAchievePage() {
        sessionStorage.setItem('taskInfo', JSON.stringify(this.taskInfo));
        this.$router.push({path: 'clockCardAchieve', query: {cardId: this.cardId, sendUserType: this.taskInfo.sendUserType}})
      },
      getEcard() {
        getEcard({eCardId: this.cardId}).then(res => res.data).then(data => {
          if (data.code === 200) {
            this.taskInfo = data.data;
            if (data.data.photoJson) {
              this.photoList = JSON.parse(data.data.photoJson);
            }
            if (data.data.fileJson) {
              this.fileList = JSON.parse(data.data.fileJson);
            }
            if (data.data.topicJson) {
              JSON.parse(data.data.topicJson).forEach((item) => {
                this.subjectList.push({
                  title: item.topicTitle,
                  type: item.topType,
                  optionList: item.optionList.map(i => i.optionTitle)
                })
              });
            }
          } else {
            this.$message({type: 'error', message: data.msg})
          }
        }).catch(() => {})
      },
      getScopeInfo(val) {
        if (val === 1 && this.taskInfo.thScopeJson) {
          const newUsers = JSON.parse(this.taskInfo.thScopeJson).userJson.map(i => i.name);
          const newDeparts = JSON.parse(this.taskInfo.thScopeJson).departJson.map(i => i.name);
          return [...newUsers, ...newDeparts].toString();
        } else if (this.taskInfo.stuDepartJson) {
          return JSON.parse(this.taskInfo.stuDepartJson).map(i => i.name).toString();
        }
        return '';
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
  .clock_info_wrap{
    padding: 12px;
    .clock_info_inner_box{
      overflow: hidden auto;
      .clock_info_box{
        width: 810px;
        margin: 15px auto;
        .img_block{
          width: 100px;
          height: 100px;
          float:left;
          margin-right: 15px;
          margin-bottom: 15px;
        }
      }
    }
  }
</style>
