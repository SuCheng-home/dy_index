<template>
  <div class="report_school_receipt_wrap">
    <div class="header">
      <el-button size="medium" @click="goBack">返回</el-button>
      <el-date-picker v-model.trim="reportDate" type="date" :clearable="false" size="medium"
                      placeholder="请选择日期" @change="changeReportDate"></el-date-picker>
      <el-button type="primary" size="medium" v-if="reportReceiptList.length"
                 @click="exportExcel('#outTable', `${dateStr(reportDate)}风险排查单.xlsx`)">导出</el-button>
    </div>
    <div class="school_receipt_box">
      <el-table stripe :data="reportReceiptList" border style="width: 100%;" :height="nobottommaxH" id="outTable">
        <el-table-column label="姓名" prop="userName"></el-table-column>
        <el-table-column label="身份">
          <template slot-scope="scope">
            <span v-if="scope.row.userType === 1 || scope.row.userType === 13">老师</span>
            <span v-else-if="scope.row.userType === 2">学生</span>
          </template>
        </el-table-column>
        <el-table-column label="班级">
          <template slot-scope="scope">
            <span>{{scope.row.className || '--'}}</span>
          </template>
        </el-table-column>
        <el-table-column label="情况" show-overflow-tooltip>
          <template slot-scope="scope">
            <span v-if="scope.row.jiechuwuhan === 2 || scope.row.jiechuwuhanP === 2 || scope.row.jiechuBeijing === 2 || scope.row.jiechuLBeijing === 2 || scope.row.jiechuBeijingP === 2 || scope.row.jiechuLBeijingP === 2">接触过疫区人员；</span>
            <span v-if="scope.row.jiechujingwai === 2 || scope.row.jiechujingwaiP === 2">接触过海外人员；</span>
            <span v-if="scope.row.fever === 2 || scope.row.feverP === 2">有发热、咳嗽、干咳、腹泻等症状</span>
          </template>
        </el-table-column>
        <el-table-column label="体温" show-overflow-tooltip>
          <template slot-scope="scope">
            <span v-if="!!scope.row.animal" :style="`${scope.row.animal >= 37.3 ? 'color: red;' : ''}`">{{scope.row.animal}}℃</span>
            <span v-else-if="scope.row.sickFever === 2 && scope.row.animalHeat === 2" style="color: red;">低烧（37.3—38度）</span>
            <span v-else-if="scope.row.sickFever === 2 && scope.row.animalHeat === 3" style="color: red;">中度发烧（38.1—39度）</span>
            <span v-else-if="scope.row.sickFever === 2 && scope.row.animalHeat === 4" style="color: red;">高烧（39.1—42度）</span>
            <span v-else>正常（36.5——37.2度）</span>
          </template>
        </el-table-column>
        <el-table-column label="现居住地" show-overflow-tooltip>
          <template slot-scope="scope">
            <span v-if="scope.row.liveNameS === '海外'">{{scope.row.live}}</span>
            <span v-else>{{scope.row.liveNameS}} {{scope.row.liveNameC}} {{scope.row.liveNameQ}} {{scope.row.live}}</span>
          </template>
        </el-table-column>
        <el-table-column label="联系电话" prop="mobile" show-overflow-tooltip></el-table-column>
        <el-table-column label="证件号" prop="idCard" show-overflow-tooltip></el-table-column>
        <el-table-column label="返回本市日期">
          <template slot-scope="scope">
            <span>{{(scope.row.comeDateType !== 2 && scope.row.comeDate) ? scope.row.comeDate : '--'}}</span>
          </template>
        </el-table-column>
        <el-table-column label="具体行程" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{scope.row.trafficTool}}</span>
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
  import {getDiseaseReportReceipts} from "@/api/schoolManage/diseaseReport";

  export default {
    name: "diseaseReportSchoolReceipt",
    data() {
      return {
        reportDate: '',
        reportReceiptList: []
      }
    },
    mixins: [mixins, baseMixin],
    created() {
      this.reportDate = this.$route.query.reportDate;
      this.getDiseaseReportReceipts()
    },
    methods: {
      goBack() {
        this.$router.back()
      },
      changeReportDate() {
        this.getDiseaseReportReceipts()
      },
      getDiseaseReportReceipts() {
        getDiseaseReportReceipts(this.dateStr(this.reportDate)).then(res => {
          if (res.data.code === 200) {
            this.reportReceiptList = res.data.data
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
    padding:12px;
    .header {
      padding-bottom: 10px;
    }
  }
</style>
