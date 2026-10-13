<template>
  <div class="report_school_receipt_wrap">
    <div class="header">
      <el-button size="medium" @click="goBack">返回</el-button>
      <el-date-picker v-model.trim="reportDate" type="date" :clearable="false" size="medium"
                      placeholder="请选择日期" @change="changeDate"></el-date-picker>
      <el-button type="primary" @click="printHandler" size="medium">打印</el-button>
    </div>
    <div class="school_receipt_box" :style="`height: ${nobottommaxH}px;`">
      <div ref="print">
        <el-table stripe :data="teacherRiskList" border style="width: 100%;" :span-method="objectSpanMethod">
          <el-table-column :label="`${$moment(reportDate).format('YYYY-MM-DD')} 教师风险人员统计`" align="center">
            <el-table-column label=" ">
              <template slot-scope="scope">
                <span>{{getSickNum(scope.row.addRessType)}}</span>
              </template>
            </el-table-column>
            <el-table-column label="风险区">
              <template slot-scope="scope">
                <span>{{scope.row.addRessName || '--'}}</span>
              </template>
            </el-table-column>
            <el-table-column label="接触人数" show-overflow-tooltip>
              <template slot-scope="scope">
                <span @click="toRiskMemberInfo(scope.row, 1, 1)" v-if="scope.row.jieChuCount && scope.row.addRessName !== '总计'" style="color:#409eff;cursor: pointer;">{{scope.row.jieChuCount}}</span>
                <span v-else>{{scope.row.jieChuCount || 0}}</span>
              </template>
            </el-table-column>
            <el-table-column label="旅行人数" show-overflow-tooltip>
              <template slot-scope="scope">
                <span @click="toRiskMemberInfo(scope.row, 2, 1)" v-if="scope.row.lvXingCount && scope.row.addRessName !== '总计'" style="color:#409eff;cursor: pointer;">{{scope.row.lvXingCount}}</span>
                <span v-else>{{scope.row.lvXingCount || 0}}</span>
              </template>
            </el-table-column>
          </el-table-column>
        </el-table>
        <el-table stripe :data="stuRiskList" border style="width: 100%;margin-top: 20px;" :span-method="objectSpanMethod">
          <el-table-column :label="`${$moment(reportDate).format('YYYY-MM-DD')} 学生风险人员统计`" align="center">
            <el-table-column label=" ">
              <template slot-scope="scope">
                <span>{{getSickNum(scope.row.addRessType)}}</span>
              </template>
            </el-table-column>
            <el-table-column label="风险区">
              <template slot-scope="scope">
                <span>{{scope.row.addRessName || '--'}}</span>
              </template>
            </el-table-column>
            <el-table-column label="接触人数">
              <template slot-scope="scope">
                <span @click="toRiskMemberInfo(scope.row, 1, 2)" v-if="scope.row.jieChuCount && scope.row.addRessName !== '总计'" style="color:#409eff;cursor: pointer;">{{scope.row.jieChuCount}}</span>
                <span v-else>{{scope.row.jieChuCount || 0}}</span>
              </template>
            </el-table-column>
            <el-table-column label="旅行人数">
              <template slot-scope="scope">
                <span @click="toRiskMemberInfo(scope.row, 2, 2)" v-if="scope.row.lvXingCount && scope.row.addRessName !== '总计'" style="color:#409eff;cursor: pointer;">{{scope.row.lvXingCount}}</span>
                <span v-else>{{scope.row.lvXingCount || 0}}</span>
              </template>
            </el-table-column>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
  import mixins from '@/mixins/windowResize';
  import {getDiseaseReportRiskByDateSchool} from "@/api/schoolManage/diseaseReport";

  export default {
    name: "diseaseReportSchoolRiskMemberList",
    data() {
      return {
        numH: 0,
        numM: 0,
        numL: 0,
        reportDate: '',
        teacherRiskList: [],
        stuRiskList: []
      }
    },
    mixins: [mixins],
    created() {
      this.reportDate = this.$route.query.reportDate || new Date();
      this.getDiseaseReportRiskByDateSchool(1);
      this.getDiseaseReportRiskByDateSchool(2);
    },
    methods: {
      goBack() {
        this.$router.back()
      },
      toRiskMemberInfo(item, type, userType) {
        if (item.addRessName !== '总计') {
          this.$router.push({
            path: 'schoolRiskMemberInfo',
            query: {
              createDate: this.$moment(this.reportDate).format('YYYY-MM-DD'),
              searchType: type,
              userType: userType,
              yiqingAddress: item.addRessName
            }
          })
        }
      },
      printHandler(){
        this.$print(this.$refs.print);
      },
      changeDate() {
        this.getDiseaseReportRiskByDateSchool(1);
        this.getDiseaseReportRiskByDateSchool(2);
      },
      getDiseaseReportRiskByDateSchool(type) {
        getDiseaseReportRiskByDateSchool({
          createDate: this.$moment(this.reportDate).format('YYYY-MM-DD'),
          userType: type
        }).then(res => {
          const data = res.data.data;
          if (res.data.code === 200) {
            if (type === 1) {
              this.numH = 0;
              this.numM = 0;
              this.numL = 0;
              this.teacherRiskList = this.getNewAllList(data);
              this.teacherRiskList.forEach((item) => {
                if (this.getSickNum(item.addRessType) === '高风险') {
                  this.numH++;
                } else if (this.getSickNum(item.addRessType) === '中风险') {
                  this.numM++;
                } else {
                  this.numL++;
                }
              })
            } else if (type === 2) {
              this.stuRiskList = this.getNewAllList(data);
            }
          }
        }).catch()
      },
      getNewAllList(data) {
        let newList = [];
        let newListH = [];
        let newListM = [];
        let newListL = [];
        data.forEach((item) => {
          if (this.getSickNum(item.addRessType) === '高风险') {
            newListH.push(item)
          } else if (this.getSickNum(item.addRessType) === '中风险') {
            newListM.push(item)
          } else {
            newListL.push(item)
          }
        });
        newList = [...this.getTotalList(newListH), ...this.getTotalList(newListM), ...this.getTotalList(newListL)];
        return newList;
      },
      getTotalList(list) {
        if (list.length) {
          let jieChuTotalCount = 0;
          let lvXingTotalCount = 0;
          list.forEach((item) => {
            jieChuTotalCount += item.jieChuCount;
            lvXingTotalCount += item.lvXingCount;
          });
          list.push({
            addRessName: '总计',
            addRessType: list[0].addRessType,
            jieChuCount: jieChuTotalCount,
            lvXingCount: lvXingTotalCount
          });
          return list;
        }
        return [];
      },
      objectSpanMethod({ row, column, rowIndex, columnIndex }) {
        if (columnIndex === 0) {
          if (rowIndex === 0) {
            return {
              rowspan: this.numH,
              colspan: 1
            };
          } else if (rowIndex === this.numH) {
            return {
              rowspan: this.numM,
              colspan: 1
            };
          } else if (rowIndex === this.numH + this.numM) {
            return {
              rowspan: this.numL,
              colspan: 1
            };
          } else {
            return {
              rowspan: 0,
              colspan: 0
            };
          }
        }
      },
      getSickNum(initNum) {
        if (Number(initNum) < 20000) {
          return '高风险';
        } else if (Number(initNum) > 29999) {
          return '低风险';
        } else {
          return '中风险';
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

    .school_receipt_box{
      overflow-x: hidden;
      overflow-y: auto;
    }
  }
</style>
