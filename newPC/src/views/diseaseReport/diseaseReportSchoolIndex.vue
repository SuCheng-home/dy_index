<template>
  <div class="report_school_wrap">
    <div class="header">
      <el-date-picker v-model.trim="reportDate" type="date" :clearable="false" size="medium"
                      placeholder="请选择日期" @change="changeReportDate"></el-date-picker>
      <el-button size="medium" type="primary" @click="viewReceipt">风险排查单查看</el-button>
      <el-button size="medium" type="primary" @click="refreshTodayReport">重置当日学校上报</el-button>
      <el-button size="medium" type="primary" @click="toSchoolReport">健康卡信息统计表</el-button>
      <el-button size="medium" type="primary" @click="toStuNoReport">未上报学生明细</el-button>
      <el-button size="medium" type="primary" @click="toRiskList">风险人员统计</el-button>
    </div>
    <div class="school_info_box" :style="{'height':nobottommaxH+'px'}" style="overflow: auto">
      <div class="school_title">{{schoolName}}{{dateStr(reportDate)}}疫情汇总</div>
      <div class="top_title">
        学生上报汇总
        <span @click="toStuInfo">学生上报详情</span>
      </div>
      <div class="sum_num_list clearfix">
        <div class="sum_block">
          <div class="sum_num">{{reportInfo.countSt || 0}}</div>
          <div class="sum_text">学生总数</div>
        </div>
        <div class="sum_block">
          <div class="sum_num">{{reportInfo.reportCountSt || 0}}</div>
          <div class="sum_text">已上报学生</div>
        </div>
        <div class="sum_block">
          <div class="sum_num">{{reportInfo.reportCountNotSt || 0}}</div>
          <div class="sum_text">未上报学生</div>
        </div>
        <div class="sum_block">
          <div class="sum_num">{{reportInfo.jiechujingwaiCountSt || 0}}</div>
          <div class="sum_text">14天接触境外归来</div>
        </div>
        <div class="sum_block">
          <div class="sum_num">{{reportInfo.jiechujingwaiPCountSt || 0}}</div>
          <div class="sum_text">同住人14天接触境外归来</div>
        </div>
        <div class="sum_block">
          <div class="sum_num">{{reportInfo.jiechuBeijingCountSt || 0}}</div>
          <div class="sum_text">14天内接触过高、中风险区</div>
        </div>
        <div class="sum_block">
          <div class="sum_num">{{reportInfo.jiechuBeijingPCountSt || 0}}</div>
          <div class="sum_text">同住人14天内接触过高、中风险区</div>
        </div>
        <div class="sum_block">
          <div class="sum_num">{{reportInfo.atShengNotShiCountSt || 0}}</div>
          <div class="sum_text">不在本市人数（省内）</div>
        </div>
        <div class="sum_block">
          <div class="sum_num">{{reportInfo.renlikaiBenShengCountSt || 0}}</div>
          <div class="sum_text">不在本市人数（省外）</div>
        </div>
        <div class="sum_block">
          <div class="sum_num">{{reportInfo.rengGuoWaiCountSt || 0}}</div>
          <div class="sum_text">仍在境外人数</div>
        </div>
      </div>

      <div class="top_title">
        教职工上报汇总
        <span @click="toTeacherInfo">教职工上报详情</span>
      </div>
      <div class="sum_num_list clearfix">
        <div class="sum_block">
          <div class="sum_num">{{reportInfo.countTh || 0}}</div>
          <div class="sum_text">教职工总数</div>
        </div>
        <div class="sum_block">
          <div class="sum_num">{{reportInfo.reportCountTh || 0}}</div>
          <div class="sum_text">已上报教职工</div>
        </div>
        <div class="sum_block">
          <div class="sum_num">{{reportInfo.reportCountNotTh || 0}}</div>
          <div class="sum_text">未上报教职工</div>
        </div>
        <div class="sum_block">
          <div class="sum_num">{{reportInfo.jiechujingwaiCountTh || 0}}</div>
          <div class="sum_text">14天接触境外归来</div>
        </div>
        <div class="sum_block">
          <div class="sum_num">{{reportInfo.jiechujingwaiPCountTh || 0}}</div>
          <div class="sum_text">同住人14天接触境外归来</div>
        </div>
        <div class="sum_block">
          <div class="sum_num">{{reportInfo.jiechuBeijingCountTh || 0}}</div>
          <div class="sum_text">14天内接触过高、中风险区</div>
        </div>
        <div class="sum_block">
          <div class="sum_num">{{reportInfo.jiechuBeijingPCountTh || 0}}</div>
          <div class="sum_text">同住人14天内接触过高、中风险区</div>
        </div>
        <div class="sum_block">
          <div class="sum_num">{{reportInfo.atShengNotShiCountTh || 0}}</div>
          <div class="sum_text">不在本市人数（省内）</div>
        </div>
        <div class="sum_block">
          <div class="sum_num">{{reportInfo.renlikaiBenShengCountTh || 0}}</div>
          <div class="sum_text">不在本市人数（出省）</div>
        </div>
        <div class="sum_block">
          <div class="sum_num">{{reportInfo.rengGuoWaiCountTh || 0}}</div>
          <div class="sum_text">仍在境外人数</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import moment from "moment";
  import baseMixin from '@/mixins/baseMixin';
  import {getDiseaseReportSchool, retDiseaseSchoolReport} from "@/api/schoolManage/diseaseReport";
  import mixin from '@/mixins/windowResize';

  export default {
    name: "diseaseReportSchoolIndex",
    data() {
      return {
        schoolName: '',
        reportDate: '',
        reportInfo: {}
      }
    },
    mixins: [baseMixin,mixin],
    created() {
      this.schoolName = this.$store.getters.schoolInfo.name;
      this.reportDate = moment().format("YYYY-MM-DD");
      this.getDiseaseReportSchool()
    },
    methods: {
      viewReceipt() {
        this.$router.push({path: 'schoolReceipt', query: {reportDate: this.dateStr(this.reportDate)}});
      },
      refreshTodayReport() {
        // 确认重置？
        this.$confirm('是否确认要重置当日学校上报？', '重置当日学校上报', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.retDiseaseSchoolReport();
        })
      },
      toSchoolReport() {
        this.$router.push({path: 'schoolReport', query: {reportDate: this.dateStr(this.reportDate)}});
      },
      toStuInfo() {
        this.$router.push({path: 'schoolListStu', query: {reportDate: this.dateStr(this.reportDate)}});
      },
      toStuNoReport() {
        this.$router.push({path: 'schoolStuNotReport', query: {reportDate: this.dateStr(this.reportDate)}});
      },
      toRiskList() {
        this.$router.push({path: 'schoolRiskMemberList', query: {reportDate: this.dateStr(this.reportDate)}});
      },
      toTeacherInfo() {
        this.$router.push({path: 'schoolListTh', query: {reportDate: this.dateStr(this.reportDate)}});
      },
      changeReportDate() {
        this.getDiseaseReportSchool()
      },
      getDiseaseReportSchool() {
        getDiseaseReportSchool(this.dateStr(this.reportDate)).then(res => {
          if (res.data.code === 200 && res.data.data) {
            this.reportInfo = res.data.data
          } else {
            this.reportInfo = {}
          }
        }).catch(() => {
        })
      },
      // 重置
      retDiseaseSchoolReport() {
        retDiseaseSchoolReport(this.dateStr(new Date())).then(res => {
          if (res.data.code === 200) {
            this.getDiseaseReportSchool();
            this.$message({
              message: '重置成功',
              type: 'success'
            });
          } else {
            this.$message({
              message: res.data.msg,
              type: 'error'
            });
          }
        }).catch()
      },
      dateStr(val) {
        return moment(val).format("YYYY-MM-DD")
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
    visibility: hidden
  }

  .clearfix {
    zoom: 1;
  }
</style>
<style lang="scss" scoped>
  .report_school_wrap {
    padding:12px;
    .header {
      padding-bottom: 10px;
      border-bottom: 1px solid #eee;
    }

    .school_info_box {
      padding: 10px 25px;

      .school_title {
        height: 30px;
        line-height: 30px;
        text-align: center;
        margin-bottom: 30px;
        font-size: 20px;
        font-weight: 700;
      }

      .top_title {
        height: 20px;
        line-height: 24px;
        margin-bottom: 10px;
        padding-left: 10px;
        border-left: 4px solid #409eff;
        font-size: 16px;
        font-weight: 700;

        span {
          margin-left: 20px;
          color: #409eff;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
        }
      }

      .sum_num_list {
        margin-bottom: 20px;

        .sum_block {
          text-align: center;
          float: left;
          margin-top: 10px;
          margin-left: 20px;
          padding: 8px 6px;
          border-radius: 5px;
          background: #EFF6FE;

          .sum_num {
            width: 145px;
            height: 50px;
            line-height: 50px;
            margin-bottom: 5px;
            font-size: 40px;
            font-weight: 700;
            color: #409EFF;
          }

          .sum_text {
            height: 36px;
            line-height: 18px;
            width: 145px;
            color: #83BBFF;
            overflow: hidden;
          }
        }
      }
    }
  }
</style>
