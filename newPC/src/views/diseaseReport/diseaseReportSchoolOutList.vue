<template>
  <div class="report_school_receipt_wrap">
    <div class="header">
      <el-button size="medium" @click="goBack">返回</el-button>
      <el-button size="medium" v-if="reportSchoolOutList.length" type="primary" @click="exportExcel('#outTable', `${dateStr(reportDate)}${userType === 2 ? '学生' : '老师'}去过境外或接触过境外归来人员统计.xlsx`)">导出</el-button>
    </div>
    <div class="school_receipt_box">
      <el-table stripe :data="reportSchoolOutList" border style="width: 100%;" :height="maxH-1" id="outTable">
        <el-table-column label="姓名" prop="userName"></el-table-column>
        <el-table-column label="班级">
          <template slot-scope="scope">
            <span>{{scope.row.className || '--'}}</span>
          </template>
        </el-table-column>
        <el-table-column label="联系方式" prop="mobile" show-overflow-tooltip></el-table-column>
        <el-table-column label="旅行或接触时间">
          <template slot-scope="scope">
            <span>{{scope.row.goGuoWaiDate || '--'}}</span>
          </template>
        </el-table-column>
        <el-table-column label="旅行或接触地点" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{scope.row.guoWaiAddress || '--'}}</span>
          </template>
        </el-table-column>
        <el-table-column label="返回时间">
          <template slot-scope="scope">
            <span>{{(scope.row.comeDateType !== 2 && scope.row.comeDate) ? scope.row.comeDate : '--'}}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
  import moment from "moment";
  import mixins from '@/mixins/windowResize';
  import baseMixin from '@/mixins/baseMixin';
  import {getGoGuoWaiUserList} from "@/api/schoolManage/diseaseReport";

  export default {
    name: "diseaseReportSchoolOutList",
    data() {
      return {
        userType: '',
        reportDate: '',
        reportSchoolOutList: []
      }
    },
    mixins: [mixins, baseMixin],
    created() {
      this.reportDate = this.$route.query.reportDate;
      this.userType = this.$route.query.userType;
      this.getGoGuoWaiUserList()
    },
    methods: {
      goBack() {
        this.$router.back()
      },
      getGoGuoWaiUserList() {
        getGoGuoWaiUserList({
          createDate: this.dateStr(this.reportDate),
          userType: this.userType
        }).then(res => {
          if (res.data.code === 200) {
            this.reportSchoolOutList = res.data.data
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
