<template>
  <div class="clock_module_list_wrap">
    <common-header show-back show-search @search="nameSearch" placeholder="请输入姓名">
      <el-date-picker v-model="dateRange" type="daterange" class="mywidthdaterange" size="medium" range-separator="-" start-placeholder="开始日期"
                      end-placeholder="结束日期" :clearable="false" @change="changeDate"></el-date-picker>
      <el-select v-model="listQuery.sendUserType" size="medium" @change="changeUserType" style="width: 150px;">
        <el-option label="全部类型" :value="0"></el-option>
        <el-option label="老师" :value="1"></el-option>
        <el-option label="学生" :value="2"></el-option>
      </el-select>
      <template v-if="listQuery.sendUserType===2">
        <el-select v-model="listQuery.gradeId" placeholder="请选择年级" size="medium" style="width: 150px;" @change="changeGrade">
          <el-option label="全部年级" :value="0"></el-option>
          <el-option v-for="item in gradeList" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
        <el-select v-model="listQuery.classDeaprtId" placeholder="请选择班级" size="medium" style="width: 150px;" @change="getEcardUserstatisticsList">
          <el-option label="全部班级" :value="0"></el-option>
          <el-option v-for="item in classList" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </template>

      <a :href="exportUrl" v-if="dataList && dataList.length" target="_blank" download="examName">
        <el-button type="primary" size="medium">导出</el-button>
      </a>
    </common-header>
    <div>
      <el-table stripe :data="dataList" border fit highlight-current-row style="width: 100%" :height="maxH-20">
        <el-table-column align="center" label="姓名" show-overflow-tooltip width="400px">
          <template slot-scope="scope">
            <span>{{ scope.row.userName }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="部门/班级">
          <template slot-scope="scope">
            <span>{{ scope.row.classDepartName }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="参与活动数">
          <template slot-scope="scope">
            <span>{{ scope.row.batchCount || '0'}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="成果总得分">
          <template slot-scope="scope">
            <span>{{ scope.row.totalScore || '--'}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="成果平均分">
          <template slot-scope="scope">
            <span>{{ scope.row.avgScore || '--'}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="打卡率">
          <template slot-scope="scope">
            <span>{{cardPercent(scope.row.cardCount, scope.row.totalCount)}}%</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="打卡平均分">
          <template slot-scope="scope">
            <span>{{scope.row.carAvgScore | filterScore}}</span>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-container" style="text-align: right;">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                       :current-page.sync="listQuery.pageNo" :page-sizes="[20, 30, 50, 100]"
                       :page-size.sync="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper"
                       :total="total"></el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
  import mixin from '@/mixins/windowResize'
  import baseMixin from '@/mixins/baseMixin'
  import CommonHeader from './components/CommonHeader'
  import {getSchoolGradeClass} from "@/api/common/common"
  import {getEcardUserstatisticsList} from '@/api/eClock'

  export default {
    name: 'clockScore',
    components: {CommonHeader},
    data() {
      return {
        dateRange: [this.$route.query.startDate, this.$route.query.endDate],
        cardId: this.$route.query.startDate,
        listQuery: {
          classDeaprtId: 0,
          gradeId: 0,
          sendUserType: 0,
          pageNo: 1,
          pageSize: 20,
          userName: ''
        },
        total: null,
        exportUrl: '',
        dataList: [],
        gradeList: [],
        gradeIds: [],
        classList: [],
        curDateStr: this.$moment().format('YYYY-MM-DD')
      }
    },
    mixins: [baseMixin, mixin],
    filters: {
      filterScore(date) {
        return date ? parseFloat(date).toFixed(1) : '--';
      }
    },
    created() {
      this.getSchoolGradeClass();
      this.getEcardUserstatisticsList();
    },
    methods: {
      cardPercent(num, total) {
        if (num && total) {
          return parseFloat(num/total*100).toFixed(1);
        }
        return 0;
      },
      nameSearch(val) {
        this.listQuery.userName = val;
        this.getEcardUserstatisticsList();
      },
      changeDate() {
        this.listQuery.pageNo = 1;
        this.getEcardUserstatisticsList()
      },
      changeUserType() {
        this.listQuery.pageNo = 1;
        this.listQuery.gradeId = 0;
        this.listQuery.classDeaprtId = 0;
        this.classList = [];
        this.getEcardUserstatisticsList()
      },
      changeGrade(gradeVal) {
        let gradeIndex = this.gradeIds.indexOf(gradeVal);
        if (gradeIndex > -1) {
          this.classList = JSON.parse(JSON.stringify(this.gradeList[gradeIndex])).childrenList;
          this.listQuery.classDeaprtId = 0;
        }
        this.getEcardUserstatisticsList();
      },
      // 学校年级班级
      getSchoolGradeClass() {
        getSchoolGradeClass().then((res) => {
          const data = res.data.data;
          if (res.data.code === 200) {
            this.gradeIds = [];
            data.forEach((item) => {
              let newArray = [];
              item.classList.forEach((item) => {
                newArray.push({
                  label: item.name,
                  value: item.id,
                });
              });
              this.gradeList.push({
                label: item.name,
                value: item.id,
                childrenList: newArray
              });
              this.gradeIds.push(item.id);
            });
          }
        }).catch(() => {
        });
      },
      // 获取数据列表
      getEcardUserstatisticsList() {
        const query = {
          ...this.listQuery,
          ...{
            startDate: this.$moment(this.dateRange[0]).format('YYYY-MM-DD'),
            endDate: this.$moment(this.dateRange[1]).format('YYYY-MM-DD')
          }
        };
        this.exportUrl = global.BasePath + "structure/ecard/exportEcardUserstatisticsListAll?classDeaprtId=" + query.classDeaprtId + '&gradeId=' + query.gradeId + '&sendUserType=' + query.sendUserType + '&startDate=' + query.startDate + '&endDate=' + query.endDate + '&userName=' + query.userName + "&token=" + this.$store.getters.token;
        getEcardUserstatisticsList(query).then(res => res.data).then(data => {
          if (data.code === 200 && data.result) {
            this.dataList = data.data.dataList;
            this.total = data.data.pagination.total;
          } else {
            this.$message({type: 'error', message: res.data.msg})
          }
        }).catch(() => {})
      },
      handleSizeChange(val) {
        this.listQuery.pageNo = 1;
        this.listQuery.pageSize = val;
        this.getEcardUserstatisticsList();
      },
      handleCurrentChange(val) {
        this.listQuery.pageNo = val;
        this.getEcardUserstatisticsList();
      }
    }
  }
</script>

<style lang="scss" scoped>
  .clock_module_list_wrap {
    padding: 12px;
    box-sizing: border-box;
  }
</style>
