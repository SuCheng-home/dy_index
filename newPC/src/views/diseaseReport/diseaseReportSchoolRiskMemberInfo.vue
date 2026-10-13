<template>
  <div class="report_school_receipt_wrap">
    <div class="header">
      <el-button size="medium" @click="goBack">返回</el-button>
    </div>
    <div class="school_receipt_box">
      <el-table stripe :data="riskMemberList" border style="width: 100%;" :height="maxH-1">
        <el-table-column label="姓名" prop="userName"></el-table-column>
        <el-table-column label="人员类别">
          <template slot-scope="scope">
            <span>{{userType === 1 ? '老师' : '学生'}}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
  import mixins from '@/mixins/windowResize';
  import {getDiseaseReportRiskUserListByDateSchool} from "@/api/schoolManage/diseaseReport";

  export default {
    name: "diseaseReportSchoolRiskMemberInfo",
    data() {
      return {
        userType: this.$route.query.userType,
        riskMemberList: []
      }
    },
    mixins: [mixins],
    created() {
      this.getDiseaseReportRiskUserListByDateSchool()
    },
    methods: {
      goBack() {
        this.$router.back()
      },
      getDiseaseReportRiskUserListByDateSchool() {
        getDiseaseReportRiskUserListByDateSchool({
          createDate: this.$route.query.createDate,
          searchType: this.$route.query.searchType,
          userType: this.userType,
          yiqingAddress: this.$route.query.yiqingAddress
        }).then(res => {
          if (res.data.code === 200) {
            this.riskMemberList = res.data.data
          }
        }).catch()
      },
      dateStr(val) {
        return moment(val).format("YYYY-MM-DD")
      }
    }
  }
</script>

<style lang="scss" scoped>
  .report_school_receipt_wrap {
    .header {
      padding: 12px 12px 10px 12px;
      border-bottom: 1px solid #eee;
    }

    .school_receipt_box {
      padding:12px;
    }
  }
</style>
