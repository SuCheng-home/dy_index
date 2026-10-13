<template>
  <div class="report_school_receipt_wrap">
    <div class="header">
      <el-button @click="goBack" size="medium">返回</el-button>
      <el-date-picker v-model.trim="reportDate" type="date" :clearable="false" size="medium"
                      placeholder="请选择日期" @change="getSchoolDiseaseReportHealByDate"></el-date-picker>
      <el-button type="primary" size="medium" v-if="reportReportList.length"
                 @click="exportExcel('#outTable', `${dateStr(reportDate)}中小学师生健康卡信息统计表.xlsx`)">导出</el-button>
    </div>
    <div class="school_receipt_box">
      <el-table stripe :data="reportReportList" border style="width: 100%;" :height="nobottommaxH" id="outTable">
        <el-table-column label="人员类别">
          <template slot-scope="scope">
            <span v-if="scope.row.userType === 1 || scope.row.userType === 13">老师</span>
            <span v-else-if="scope.row.userType === 2">学生</span>
          </template>
        </el-table-column>
        <el-table-column label="师生及同住家人14天内接触过境外归来人员数" align="center">
          <el-table-column label="师生员工">
            <template slot-scope="scope">
              <span>{{scope.row.jiechujingwaiCount || 0}}</span>
            </template>
          </el-table-column>
          <el-table-column label="同住家人">
            <template slot-scope="scope">
              <span>{{scope.row.jiechujingwaiPCount || 0}}</span>
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="师生及同住家人14天内接触过高、中风险区人员数" align="center">
          <el-table-column label="师生员工">
            <template slot-scope="scope">
              <span>{{scope.row.jiechuBeijingCount || 0}}</span>
            </template>
          </el-table-column>
          <el-table-column label="同住家人">
            <template slot-scope="scope">
              <span>{{scope.row.jiechuBeijingPCount || 0}}</span>
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="不在本市数">
          <template slot-scope="scope">
            <span>{{scope.row.atNanjingNotCount || 0}}</span>
          </template>
        </el-table-column>
        <el-table-column label="仍在境外人数" show-overflow-tooltip>
          <template slot-scope="scope">
            <span style="color: #409eff;cursor:pointer;" @click="showOutMember(scope.row.rengGuoWaiCount, scope.row.learningStages, scope.row.userType)">{{scope.row.rengGuoWaiCount || 0}}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog title="仍在境外" :visible.sync="isShowOutMemberBox"  width="70%">
      <el-row :gutter="12">
        <el-col :span="8" :key="index" v-for="(item, index) in outAddressList" style="margin-bottom: 15px;">
          <el-card shadow="hover">
            <div class="out_name">{{item.userName}}</div>
            <div class="out_name" :title="item.live">{{item.live}}</div>
          </el-card>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
  import mixins from '@/mixins/windowResize';
  import baseMixin from '@/mixins/baseMixin';
  import {getSchoolDiseaseReportHealByDate, getSchoolDiseaseReportHaiWaiList} from "@/api/schoolManage/diseaseReport";

  export default {
    name: "diseaseReportSchoolReport",
    data() {
      return {
        isShowOutMemberBox: false,
        reportDate: '',
        reportReportList: [],
        outAddressList: []
      }
    },
    mixins: [mixins, baseMixin],
    created() {
      this.reportDate = this.$route.query.reportDate || new Date();
      this.getSchoolDiseaseReportHealByDate()
    },
    methods: {
      goBack() {
        this.$router.back()
      },
      getSchoolDiseaseReportHealByDate() {
        getSchoolDiseaseReportHealByDate(this.dateStr(this.reportDate)).then(res => {
          if (res.data.code === 200) {
            this.reportReportList = res.data.data
          }
        }).catch()
      },
      getSchoolDiseaseReportHaiWaiList(learningStages, userType) {
        let query = {
          createDate: this.dateStr(this.reportDate),
          learningStages: learningStages,
          userType: userType
        };
        getSchoolDiseaseReportHaiWaiList(query).then(res => {
          if (res.data.code === 200) {
            this.outAddressList = res.data.data
          }
        }).catch()
      },
      dateStr(val) {
        return this.$moment(val).format("YYYY-MM-DD")
      },
      showOutMember(num, learningStages, userType) {
        if (!!num) {
          this.isShowOutMemberBox = true;
          this.getSchoolDiseaseReportHaiWaiList(learningStages, userType);
        }
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
    .out_name{
      width: 100%;
      height: 20px;
      line-height: 20px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      word-break: break-all;
    }
  }
</style>
