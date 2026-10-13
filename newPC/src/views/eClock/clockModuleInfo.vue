<template>
  <div class="clock_info_wrap">
    <common-header show-back show-border></common-header>
    <div class="clock_info_inner_box" :style="{'height':nobottommaxH+'px'}">
      <div class="clock_info_box">
        <el-form label-width="120px">
          <el-form-item label="模板名称">{{tempInfo.title}}</el-form-item>
          <el-form-item label="排序">{{tempInfo.orderNum}}</el-form-item>
          <el-form-item label="介绍">{{tempInfo.content}}</el-form-item>
          <el-form-item label="每日提醒">
            <span v-if="tempInfo.isRemind===2">{{tempInfo.remindTime}}</span>
            <span v-else>不提醒</span>
          </el-form-item>
          <el-form-item label="允许补卡">{{tempInfo.isMakeCard===2 ? '允许' : '不允许'}}</el-form-item>
          <el-form-item label="最终成果上传">{{tempInfo.isAchievementis===2 ? '上传' : '不上传'}}</el-form-item>
          <el-form-item label="成果内容">
            <span v-if="tempInfo.isPhoto===2">图片&nbsp;&nbsp;</span>
            <span v-if="tempInfo.isText===2">文本&nbsp;&nbsp;</span>
            <span v-if="tempInfo.isVideo===2">视频&nbsp;&nbsp;</span>
            <span v-if="tempInfo.isVoice===2">语音</span>
          </el-form-item>
          <el-form-item label="评分总分">{{tempInfo.score}}</el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
  import mixin from '@/mixins/windowResize'
  import CommonHeader from './components/CommonHeader'
  import {getEcardTemp} from '@/api/eClock'

  export default {
    name: "clockModuleInfo",
    components: {CommonHeader},
    data() {
      return {
        moduleId: this.$route.query.moduleId,
        tempInfo: {}
      }
    },
    created() {
      this.getEcardTemp();
    },
    mixins: [mixin],
    methods: {
      getEcardTemp() {
        getEcardTemp({ecardTempId: this.moduleId}).then(res => res.data).then(data => {
          if (data.code === 200) {
            this.tempInfo = data.data;
          } else {
            this.$message({type: 'error', message: data.msg})
          }
        }).catch(() => {})
      }
    }
  }
</script>

<style lang="scss" scoped>
  .clock_info_wrap{
    padding: 12px;
    .clock_info_inner_box{
      overflow: hidden auto;
      .clock_info_box{
        width: 810px;
        margin: 15px auto;
      }
    }
  }
</style>
