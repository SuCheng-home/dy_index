<template>
  <div class="studentLeaveDetail" :studentLeaver="studentLeaver">
    <div class="header">
      <el-button size="medium" @click="goBack">返回</el-button>
    </div>
    <div class="mainWrap" :style="`height:${nobottommaxH}px`">
      <div class="leave_info_box">
        <el-form ref="ruleForm" label-width="140px" class="demo-ruleForm">
          <el-form-item label="请假人">{{studentLeaver.studentName}}</el-form-item>
          <el-form-item label="班级">{{studentLeaver.className}}</el-form-item>
          <el-form-item label="是否住校生">{{studentLeaver.isStay === 1 ? '是' : '否'}}</el-form-item>
          <el-form-item label="请假类型">{{studentLeaver.leaveTypeName}}</el-form-item>
          <el-form-item label="症状" v-if="studentLeaver.leaveType === 1 && studentLeaver.sickTypeName">{{studentLeaver.sickTypeName}}</el-form-item>
          <el-form-item label="体温">{{studentLeaver.animal}}℃</el-form-item>
          <el-form-item label="创建时间">{{studentLeaver.createTime | leaveDateFilter}}</el-form-item>
          <el-form-item label="请假时间">
            {{studentLeaver.startTime | leaveDateFilter}}&nbsp;至&nbsp;{{studentLeaver.endTime | leaveDateFilter}}
          </el-form-item>
          <el-form-item label="请假事由">{{studentLeaver.content}}</el-form-item>
          <el-form-item label="请假状态">{{studentLeaver.leaveStateName}}</el-form-item>
          <el-form-item label="放行人" v-if="studentLeaver.leaveState === 5">{{studentLeaver.releaseUserName}}
          </el-form-item>
          <el-form-item label="放行时间" v-if="studentLeaver.leaveState === 5">
            {{studentLeaver.releaseTime | leaveDateFilter}}
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script>
  import mixin from '@/mixins/windowResize';
  import {getStuAskleaveThree} from '@/api/studentLeave';

  export default {
    name: 'studentLeaveInfo',
    data() {
      return {
        askId: this.$route.query.askId,
        studentLeaver: {}
      }
    },
    filters: {
      leaveDateFilter(date) {
        if (date) {
          return date.substring(0, 16);
        }
        return '';
      }
    },
    created() {
      this.getStuAskLeaveThree();
    },
    mixins: [mixin],
    methods: {
      goBack() {
        this.$router.back();
      },
      getStuAskLeaveThree() {
        getStuAskleaveThree(this.askId).then(res => res.data).then(data => {
          if (data.code === 200) {
            this.studentLeaver = data.data;
          }
        });
      }
    }
  }
</script>
<style lang="scss" scoped>
  .studentLeaveDetail {
    padding:12px;
    box-sizing: border-box;

    .header {
      border-bottom: 1px solid #eee;
      padding-bottom: 10px;
    }

    .mainWrap {
      padding-top: 20px;
      overflow-x: hidden;
      overflow-y: auto;

      .leave_info_box {
        width: 810px;
        margin: 0 auto;
        color: #333;
      }

      .leaveTime {
        display: flex;
      }
    }
  }


</style>
<style scoped>
  .studentLeaveDetail .el-form-item__label {
    font-weight: bold;
    color: #666;
    padding-right: 20px;
  }

  .studentLeaveDetail .el-form-item {
    margin-bottom: 0px;
  }
</style>
