<template>
  <div class="stu_attendance_detail_wrap app-container">
    <div class="header">
      <el-row>
        <el-col :span="19">
          <!-- <el-button size="medium" @click="goBack">返回</el-button> -->
          <el-date-picker v-model="dateRange" type="daterange" class="mywidthdaterange"  size="medium" :clearable="false" style="width: 260px;"
                          placeholder="选择日期范围" @change="changeDate()"></el-date-picker>
          <el-select v-model="selectGrade" placeholder="请选择年级" size="medium" style="width: 160px;">
            <el-option label="全部年级" :value="0"></el-option>
            <el-option v-for="item in gradeList" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
          <el-select v-model="selectClass" placeholder="请选择班级" size="medium" style="width: 160px;">
            <el-option label="全部班级" :value="0"></el-option>
            <el-option v-for="item in classList" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
          <a :href="exportURL" download="导出结果" target="_blank" v-if="dataList.length">
            <el-button class="filter-item" size="medium" type="primary" icon="upload">导出</el-button>
          </a>
        </el-col>
        <el-col :span="5">
          <el-input placeholder="学生姓名" v-model="searchName" size="medium" @keyup.enter.native="getStatistics">
            <el-button size="medium" slot="append" icon="el-icon-search" @click="getStatistics"></el-button>
          </el-input>
        </el-col>
      </el-row>
    </div>
    <div class="offset_table_wrap">
      <el-table stripe :data="dataList" border style="width: 100%;" :height="maxH - 20">
        <el-table-column prop="stuName" label="学生姓名" show-overflow-tooltip></el-table-column>
        <el-table-column prop="className" label="班级"></el-table-column>
        <el-table-column label="签到次数">
          <template slot-scope="scope">
            <span>{{scope.row.inCount || 0}}</span>
          </template>
        </el-table-column>
        <el-table-column label="签退次数">
          <template slot-scope="scope">
            <span>{{scope.row.outCount || 0}}</span>
          </template>
        </el-table-column>
        <el-table-column label="请假次数">
          <template slot-scope="scope">
            <span>{{scope.row.leaveCount || 0}}</span>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-container" style="margin-top: 15px;">
        <el-pagination @size-change="sizeChangeHandler" @current-change="currentChangeHandler"
                       :current-page.sync="pagination.pageNo" :page-sizes="[10, 20, 30, 50]"
                       :page-size.sync="pagination.pageSize" layout="total, sizes, prev, pager, next, jumper"
                       :total="pagination.total">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
  import mixins from '@/mixins/windowResize';
  import {possessRole, getSchoolGradeClass, queryAllClassCourse, statisticsSummary} from "@/api/schoolManage/stuAttendanceRecord";

  export default {
    name: "stuAttendanceRecordSum",
    data() {
      return {
        pagination: {
          pageNo: 1,
          pageSize: 10,
          total: null
        },
        dateRange: [],
        exportURL: '',
        searchName: '',
        gradeIds: [],
        gradeList: [],
        selectGrade: 0,
        classList: [],
        selectClass: 0,
        dataList: []
      }
    },
    mixins: [mixins],
    watch: {
      selectGrade(gradeVal) {
        let gradeIndex = this.gradeIds.indexOf(gradeVal);
        if (gradeIndex > -1) {
          this.classList = JSON.parse(JSON.stringify(this.gradeList[gradeIndex])).childrenList;
        } else {
          this.classList = [];
        }
        this.selectClass = 0;
        this.getStatistics();
      },
      selectClass() {
        this.getStatistics();
      }
    },
    created() {
      this.dateRange = [this.$moment().format("YYYY-MM-DD"), this.$moment().format("YYYY-MM-DD")];
      this.possessRole();
    },
    methods: {
      goBack() {
        this.$router.back();
      },
      changeDate() {
        this.getStatistics();
      },
      possessRole() {
        possessRole('2,20241125').then(res => res.data).then(data => {
          if (data.code === 200 && data.data.result) {
            this.getSchoolGradeClass();
          } else {
            this.queryAllClassCourse();
          }
        });
      },
      // 所有班级
      getSchoolGradeClass() {
        getSchoolGradeClass().then(res => res.data).then(data => {
          if (data.code === 200) {
            this.gradeIds = [];
            data.data.forEach((item) => {
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
            this.getStatistics();
          }
        });
      },
      // 所教班级
      queryAllClassCourse() {
        queryAllClassCourse(this.$store.getters.userInfo.id).then(res => res.data).then(data => {
          if (data.code === 200) {
            this.gradeIds = [];
            data.data.forEach((item) => {
              let gradeIndex = this.gradeIds.indexOf(item.gradeId);
              let newClassJson = {
                label: item.className,
                value: item.classId,
              };
              if (gradeIndex < 0) {
                this.gradeIds.push(item.gradeId);
                this.gradeList.push({
                  label: item.gradeName,
                  value: item.gradeId,
                  childrenList: [newClassJson]
                });
              } else {
                this.gradeList[gradeIndex].childrenList.push(newClassJson)
              }
            });
            this.getStatistics();
          }
        });
      },
      getStatistics() {
        if (!this.dateRange.length) {
          return;
        }

        this.exportURL = global.BasePath + 'structure/stuTransfer/exportStatisticsSummary?classId='
          + this.selectClass + '&gradeId=' + this.selectGrade
          + '&startDate=' + this.dateFormat(this.dateRange[0]) + '&endDate=' + this.dateFormat(this.dateRange[1])
          + '&stuName=' + this.searchName + '&token=' + this.$store.getters.token;

        let query = {
          gradeId: this.selectGrade,
          classId: this.selectClass,
          stuName: this.searchName,
          endDate: this.dateFormat(this.dateRange[1]),
          startDate: this.dateFormat(this.dateRange[0]),
          pageNo: this.pagination.pageNo,
          pageSize: this.pagination.pageSize
        };

        this.statisticsSummary(query);
      },
      statisticsSummary(query) {
        statisticsSummary(query).then(res => {
          const data = res.data.data;
          if (res.data.code === 200) {
            this.dataList = data.dataList;
            this.pagination.total = data.pagination.total;
          } else {
            this.$message({
              message: data.msg,
              type: 'warning'
            });
          }
        }).catch();
      },
      sizeChangeHandler() {
        this.pagination.pageNo = 1;
        this.getStatistics();
      },
      currentChangeHandler() {
        this.getStatistics();
      },
      dateFormat(n) {
        let data = new Date(n);
        data.setTime(data.getTime());
        let dateStr = data.getFullYear() + "-" + this.fillZero(data.getMonth() + 1) + "-" + this.fillZero(data.getDate());
        return dateStr;
      },
      fillZero(n) {
        return n < 10 ? '0' + n : n;
      }
    }
  }
</script>

<style lang="scss" scoped>
  .stu_attendance_detail_wrap {
    .header {
      margin-bottom: 10px;
      overflow: hidden;
    }
  }
</style>
