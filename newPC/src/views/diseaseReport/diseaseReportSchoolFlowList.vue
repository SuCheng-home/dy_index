<template>
  <div class="flow_list_wrap">
    <div class="header">
      <el-button size="medium" @click="goBack">返回</el-button>
      <el-button size="medium" type="primary" @click="printHandler">打印</el-button>
      <el-button size="medium" v-if="flowList.length" type="primary" @click="exportExcel('#outTable', `${schoolName}流动人员情况汇总表.xlsx`)">导出</el-button>
    </div>

    <div class="flow_list_box">
      <el-table stripe :data="flowList" border style="width: 100%;" :height="maxH" id="outTable" ref="print">
        <el-table-column align="center">
          <template slot="header">
            <div style="padding: 10px;font-size: 24px;">{{schoolName}}流动人员情况汇总表</div>
          </template>
          <el-table-column align="center">
            <template slot="header">
              <span>上报单位：{{schoolName}}</span>
              <span>截止日期：{{nowDate}}</span>
            </template>
            <el-table-column align="center" label="日期">
              <template slot-scope="scope">
                <span style="color: #409eff;cursor:pointer;" @click="toMobileWorkerInfoPage(scope.row.createDate)">{{scope.row.createDate}}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="总数" prop="count"></el-table-column>
            <el-table-column align="center" label="已核查数">
              <el-table-column align="center" label="公安推送">0</el-table-column>
              <el-table-column align="center" label="自查" prop="count"></el-table-column>
            </el-table-column>
            <el-table-column align="center" label="未离宁" prop="weiliningCount"></el-table-column>
            <el-table-column align="center" label="离宁回我区" prop="lininghuiwoquCount"></el-table-column>
            <el-table-column align="center" label="离宁不在我区">
              <el-table-column align="center" :label="`计划回${areaName}`">
                <template slot-scope="scope">
                  <span>{{scope.row.count - scope.row.weiliningCount - scope.row.lininghuiwoquCount}}</span>
                </template>
              </el-table-column>
              <el-table-column align="center" :label="`不回${areaName}`">0</el-table-column>
            </el-table-column>
            <el-table-column align="center" label="联系不上" prop="contactCountNot"></el-table-column>
            <el-table-column align="center" label="来自湖北、温州">
              <el-table-column align="center" label="总数" prop="hubeiCount"></el-table-column>
              <el-table-column align="center" label="当日管理" prop="hubeiNowManCount"></el-table-column>
              <el-table-column align="center" label="解除14天隔离" prop="hubeijiechuCount"></el-table-column>
            </el-table-column>
            <el-table-column align="center" label="来自关注六市">
              <el-table-column align="center" label="总数" prop="hubeiCountNot"></el-table-column>
              <el-table-column align="center" label="当日管理" prop="hubeiNowManCountNot"></el-table-column>
              <el-table-column align="center" label="解除14天隔离" prop="hubeijiechuCountNot"></el-table-column>
            </el-table-column>
            <el-table-column align="center" label="来自其他地区">
              <el-table-column align="center" label="总数">
                <template slot-scope="scope">
                  <span>{{scope.row.goNameJingCount - scope.row.hubeiCount - scope.row.hubeiCountNot}}</span>
                </template>
              </el-table-column>
            </el-table-column>
            <el-table-column align="center" label="备注" prop="createUserName" show-overflow-tooltip></el-table-column>
          </el-table-column>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
  import mixins from '@/mixins/windowResize';
  import baseMixin from '@/mixins/baseMixin';
  import moment from "moment";
  import {getDiseaseReprtSchoolDateList} from "@/api/schoolManage/diseaseReport";

  export default {
    name: "diseaseReportSchoolFlowList",
    data() {
      return {
        flowList: [],
        postCodeList: [],
        areaName: '',
        schoolName: '',
        nowDate: ''
      }
    },
    mixins: [mixins, baseMixin],
    created() {
      this.schoolName = this.$store.getters.schoolInfo.name;
      this.areaName = this.$route.query.areaName;
      this.nowDate = moment().format("YYYY-MM-DD");
      this.getDiseaseReprtSchoolDateList();
    },
    methods: {
      goBack() {
        this.$router.back()
      },
      getDiseaseReprtSchoolDateList() {
        getDiseaseReprtSchoolDateList(this.$store.getters.schoolInfo.id).then(res => {
          if (res.data.code === 200) {
            this.flowList = res.data.data;
          }
        }).catch()
      },
      printHandler(){
        this.$print(this.$refs.print);
      },
      toMobileWorkerInfoPage(date) {
        this.$router.push({path: 'schoolFlowInfoList', query: {reportDate: date, areaName: this.areaName}});
      }
    }
  }
</script>

<style lang="scss" scoped>
  .flow_list_wrap {
    .header {
      padding: 12px 12px 10px 12px;
      border-bottom: 1px solid #eee;
    }

    .flow_list_box {
      padding:12px;
    }
  }
</style>
