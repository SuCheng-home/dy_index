<template>
  <div class="report_school_receipt_wrap">
    <div class="header">
      <el-button size="medium" @click="goBack">返回</el-button>
      <el-button type="primary" size="medium" :loading="tableIsLoading" v-if="notReportList.length"
                 @click="exportExcel('#outTable', `${reportDate}未上报学生明细.xlsx`)">导出</el-button>
    </div>
    <div class="school_receipt_box">
      <el-table stripe :data="notReportList" border style="width: 100%;" :height="nobottommaxH" id="outTable" v-loading="tableIsLoading" element-loading-text="拼命加载中">
        <el-table-column label="姓名" prop="userName"></el-table-column>
        <el-table-column label="班级">
          <template slot-scope="scope">
            <span>{{scope.row.className || '--'}}</span>
          </template>
        </el-table-column>
        <el-table-column label="昵称" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{scope.row.nick || '--'}}</span>
          </template>
        </el-table-column>
        <el-table-column label="家长手机号" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{scope.row.mobile || '--'}}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
  import mixins from '@/mixins/windowResize';
  import baseMixin from '@/mixins/baseMixin';
  import {getNotReportUserList} from "@/api/schoolManage/diseaseReport";

  export default {
    name: "diseaseReportSchoolStuNotReport",
    data() {
      return {
        tableIsLoading: false,
        reportDate: '',
        notReportList: []
      }
    },
    mixins: [mixins, baseMixin],
    created() {
      this.reportDate = this.$route.query.reportDate;
      this.getNotReportUserList()
    },
    methods: {
      goBack() {
        this.$router.back()
      },
      getNotReportUserList() {
        this.tableIsLoading = true;
        getNotReportUserList({
          createDate: this.reportDate,
          userType: 2
        }).then(res => {
          if (res.data.code === 200) {
            this.notReportList = res.data.data
          }
          this.tableIsLoading = false;
        }).catch()
      }
    }
  }
</script>

<style lang="scss" scoped>
  .report_school_receipt_wrap {
    padding:12px;
    .header {
      padding-bottom: 10px;
    }
  }
</style>
