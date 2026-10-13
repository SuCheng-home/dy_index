<template>
  <div class="page">
    <div class="header">
      <el-button @click="goBack()" size="medium">返回</el-button>
      <el-button type="primary" @click="printHandler" size="medium">打印</el-button>
    </div>
    <div class="table_wrap" ref="print">
      <table>
        <thead>
        <tr>
          <th colspan="4">
            视频录制申请表
          </th>
        </tr>
        </thead>
        <tbody>
          <tr>
            <td>申请人</td>
            <td>{{applicationData.createUserName}}</td>
            <td>录制主题</td>
            <td>{{applicationData.recordingName}}</td>
          </tr>
          <tr>
            <td>录制时间</td>
            <td>{{applicationData.recordingTime}}</td>
            <td>录制地点</td>
            <td>{{applicationData.recordingPlace}}</td>
          </tr>
          <tr>
            <td>录制时长</td>
            <td>{{applicationData.recordingDuration}}分</td>
            <td>所属部门</td>
            <td>{{applicationData.departmentName}}</td>
          </tr>
          <tr style="height: 100px;">
            <td>审批意见</td>
            <td colspan="3">{{applicationData.approvalContent}}</td>
          </tr>
          <tr>
            <td>审批状态</td>
            <td>
              <span v-if="applicationData.state === 2">审核中</span>
              <span v-else-if="applicationData.state === 3">通过</span>
              <span v-else-if="applicationData.state === 4">驳回</span>
            </td>
            <td>落款</td>
            <td>
              <span v-if="applicationData.approverName && applicationData.approverTime">
                {{applicationData.approverName}}&nbsp;&nbsp;{{applicationData.approverTime | time}}
              </span>
              <span v-else>&nbsp;</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
  import {getRecordingApplication} from '@/api/record';

  export default {
    name: 'recordDetail',
    data() {
      return {
        applicationData: {}
      }
    },
    created() {
      let id = parseInt(this.$route.query.id);
      this.getRecordDetail(id);
    },
    filters: {
      time(time = +new Date()) {
        let date = new Date(time + 8 * 3600 * 1000); // 增加8小时
        return date.toJSON().substr(0, 16).replace('T', ' ');
      }
    },
    methods: {
      goBack() {
        this.$router.back();
      },
      getRecordDetail(id) {
        getRecordingApplication(id).then(res => {
          let data = res.data.data;
          if (res.data.code === 200) {
            this.applicationData = data;
            this.applicationData.recordingTime = this.time(data.recordingTime);
          }
        }).catch(() => {});
      },
      time(time = +new Date()) {
        let date = new Date(time + 8 * 3600 * 1000); // 增加8小时
        return date.toJSON().substr(0, 16).replace('T', ' ');
      },
      printHandler(){
        this.$print(this.$refs.print);
      },
    }
  }
</script>

<style scoped>
  .page {
    padding:12px;
  }

  .header {
    margin-bottom: 10px;
  }
  table{
    width: 100%;
    box-sizing: border-box;
    border-collapse:collapse;
  }
  table th, table td{
    height: 40px;
  }
  table th{
    text-align: center;
    border: 1px solid #ddd;
  }
  table td{
    width: 25%;
    border: 1px solid #ddd;
  }
  table tr td:nth-child(2n-1){
    text-align: center;
  }
  table tr td:nth-child(2n){
    padding-left: 10px;
  }
</style>