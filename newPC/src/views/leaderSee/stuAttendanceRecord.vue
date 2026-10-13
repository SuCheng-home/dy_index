<template>
  <div class="stu_attendance_record_wrap">
    <div class="header">
      <el-row>
        <el-col :span="19">
          <el-date-picker v-model="dateRange" type="daterange" class="mywidthdaterange" :clearable="false" size="medium"
                          placeholder="选择日期范围"></el-date-picker>
         
          <el-select v-model="selectGrade" placeholder="请选择年级" size="medium" style="width: 150px;">
            <el-option v-for="item in gradeList" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
          <el-select v-model="selectClass" placeholder="请选择班级" size="medium" style="width: 150px;">
            <el-option label="全部班级" :value="0" v-show="isSchoolManager"></el-option>
            <el-option v-for="item in classList" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="5">
          <el-input size="medium"
                    placeholder="请输入学生姓名" icon="el-icon-search" @keyup.enter.native="getStuTransferRecord"
                    v-model.trim="searchName">
            <el-button slot="append" icon="el-icon-search" @click="getStuTransferRecord"></el-button>
          </el-input>
        </el-col>
      </el-row>
    </div>
    <div>
      <el-table stripe :data="stuAttendanceList" border :height="maxH">
        <el-table-column prop="stuName" label="学生姓名"></el-table-column>
        <el-table-column prop="className" label="所在班级"></el-table-column>
        <el-table-column label="考勤类型">
          <template slot-scope="scope">
            <span v-if="scope.row.stateAttendance">
            <span v-if="scope.row.stateAttendance === 1">签到</span>
            <span v-else-if="scope.row.stateAttendance === 2">签退</span>
            <span v-else-if="scope.row.stateAttendance === 3">迟到</span>
            <span v-else-if="scope.row.stateAttendance === 4">早退</span>
            </span>
            <span v-else>
                 <span v-if="scope.row.state === 1">签到</span>
            <span v-else-if="scope.row.state=== 2">签退</span>
            </span>
            
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="考勤时间"></el-table-column>
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
  import mixin from '@/mixins/windowResize';
  import {getSchoolGradeClass} from "@/api/common/common";
  import {getStuTransferRecordList, getDepartListByUserId} from "@/api/leaderSee";
  import {possessRole} from '@/api/supplyClass';

  export default {
    name: 'stuAttendanceRecord',
    data() {
      return {
        allTeamList: [],
        allWeekList: [],
        endDate: '',
        startDate: '',
        searchName: '',
        gradeList: [],
        selectGrade: 0,
        classList: [],
        selectClass: 0,
        dateRange: [],
        gradeIds: [],
        pagination: {
          pageNo: 1,
          pageSize: 20,
          total: null
        },
        stuAttendanceList: [],
        isSchoolManager: true
      }
    },
    mixins: [mixin],
    watch: {
      dateRange() {
        this.getStuTransferRecord();
      },
      selectGrade(gradeVal) {
        let gradeIndex = this.gradeIds.indexOf(gradeVal);
        if (gradeIndex > -1) {
          this.classList = JSON.parse(JSON.stringify(this.gradeList[gradeIndex])).childrenList;
          if (this.isSchoolManager) {
            if (this.selectClass === 0) {
              this.getStuTransferRecord();
            }
            this.selectClass = 0;
          } else {
            this.selectClass = this.classList[0].value;
          }
        }
      },
      selectClass() {
        this.getStuTransferRecord();
      }
    },
    created() {
      this.dateRange = [this.$moment().format("YYYY-MM-DD"), this.$moment().format("YYYY-MM-DD")];
      let roleId = '2';
      possessRole(roleId).then(res => {
        if (res.data.code === 200 && res.data.data) {
          if (!!res.data.data.result) {
            this.getSchoolGradeClass();
          } else {
            this.isSchoolManager = false;
            this.getDepartListByUserId();
          }
        }
      }).catch(err => {
      });
    },
    methods: {
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
            if (this.gradeList.length) {
              this.selectGrade = this.gradeList[0].value;
            }
          }
        }).catch(() => {
        });
      },
      // 班主任所负责班级
      getDepartListByUserId() {
        getDepartListByUserId().then(res => {
          if (JSON.parse(JSON.stringify(res.data)).code === 200) {
            this.gradeIds = [];
            JSON.parse(JSON.stringify(res.data)).data.forEach((item) => {
              if (this.gradeIds.indexOf(item.pid) < 0) {
                this.gradeIds.push(item.pid);
                this.gradeList.push({
                  value: item.pid,
                  label: item.parentDepart.name,
                  childrenList: [{
                    value: item.id,
                    label: item.name
                  }]
                });
              } else {
                this.gradeList[this.gradeIds.indexOf(item.pid)].childrenList.push({
                  value: item.id,
                  label: item.name
                });
              }
            });
            if (this.gradeList.length) {
              this.selectGrade = this.gradeList[0].value;
            }
          }
        }).catch();
      },
      getStuTransferRecord() {
        if (!this.selectGrade || !this.dateRange.length) {
          return;
        }
        let query = {
          classId: this.selectClass,
          endDate: this.$moment(this.dateRange[1]).format('YYYY-MM-DD'),
          gradeId: this.selectGrade,
          pageNo: this.pagination.pageNo,
          pageSize: this.pagination.pageSize,
          stuName: this.searchName,
          startDate: this.$moment(this.dateRange[0]).format('YYYY-MM-DD')
        };
        this.getStuTransferRecordList(query);
      },
      getStuTransferRecordList(query) {
        getStuTransferRecordList(query).then((res) => {
          const data = res.data.data;
          if (res.data.code === 200) {
            this.stuAttendanceList = data.dataList;
            this.pagination.total = data.pagination.total;
          }
        }).catch(() => {
        });
      },
      sizeChangeHandler() {
        this.pagination.pageNo = 1;
        this.getStuTransferRecord();
      },
      currentChangeHandler() {
        this.getStuTransferRecord();
      }
    }
  }
</script>

<style lang="scss" scoped>
  .stu_attendance_record_wrap {
    padding:12px;

    .header {
      padding-bottom: 10px;
    }
  }
</style>
