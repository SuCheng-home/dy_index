<template>
  <div class="readPunchClockStatisticsReadBook">
      <div class="header">
          <div class="search_line_wrap">
              <el-select v-model="selectTeam" size="medium" placeholder="请选择学期" >
                  <el-option v-for="item in teamList" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
              </el-select>
              <el-select v-model="selectWeek" placeholder="请选择周次" size="medium" >
                  <el-option v-for="item in weekList" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
              </el-select>
              <el-date-picker v-model="dateRange" type="daterange" class="mywidthdaterange" size="medium" :clearable="false" placeholder="选择日期范围"></el-date-picker>
          </div>
          <div class="search_line_wrap">
              <el-select v-model="selectGrade" placeholder="请选择年级" size="medium">
                  <el-option v-for="item in gradeList" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
              </el-select>
              <el-select v-model="selectClass" placeholder="请选择班级" size="medium">
                  <el-option label="全部班级" :value="0"></el-option>
                  <el-option v-for="item in classList" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
              </el-select>
              <div style="display: inline-block;">
                  <el-input placeholder="" v-model="searchName" size="medium">
                      <i slot="suffix" class="el-input__icon el-icon-search" @click="getStuReadBooks"></i>
                  </el-input>
              </div>
          </div>

      </div>
      <div class="body" :style="`height: ${maxH - 70}px;`">
          <div class="read_book_wrap clearfix custom—scrollbar" v-if="readBookList && readBookList.length" >
              <div class="read_book_item" :key="index" v-for="(item, index) in readBookList">
                  <img :src="item.bookLogo" alt="">
                  <div>{{item.bookName}}</div>
              </div>
          </div>
          <div class="no_book_msg" v-else>暂无书籍</div>

      </div>
    
  </div>
</template>

<script>
  import mixin from '@/mixins/windowResize';
  import {getSchoolTimeAllList, getSeveralWeekListBySchoolTImeId, getStuReadBooks, getSchoolGradeClass} from "@/api/readPunchClock";

  export default {
    name: 'readPunchClockStatisticsReadBook',
    data() {
      return {
        allTeamList: [],
        allWeekList: [],
        endDate: '',
        startDate: '',
        searchName: '',
        teamList: [],
        selectTeam: 0,
        weekList: [],
        selectWeek: 0,
        gradeList: [],
        selectGrade: 0,
        classList: [],
        selectClass: null,
        dateRange: [],
        gradeIds: [],
        readBookList: [],
        activeName:'three'
      }
    },
    mixins: [mixin],
    watch: {
      dateRange() {
        this.getStuReadBooks();
      },
      selectTeam(teamVal) {
        this.changeSchoolTimeRange(teamVal);
        this.getSeveralWeekListBySchoolTImeId(teamVal);
      },
      selectWeek(weekVal) {
        this.changeWeekTimeRange(weekVal);
      },
      selectGrade(gradeVal) {
        let gradeIndex = this.gradeIds.indexOf(gradeVal);
        if (gradeIndex > -1) {
          this.classList = JSON.parse(JSON.stringify(this.gradeList[gradeIndex])).childrenList;
          if (this.selectClass === 0) {
            this.getStuReadBooks();
          }
          this.selectClass = 0;
        }
      },
      selectClass() {
        this.getStuReadBooks();
      }
    },
    created() {
      this.getSchoolTimeAllList();
      this.getSchoolGradeClass();
    },
    methods: {
       tabsfun(){
        if(this.activeName=='one'){
          this.$router.push({path: 'weekPlanIndex'});
        }
        if(this.activeName=='two'){
          this.$router.push({path: 'punchClockIndex'});
        }
      },
      getSchoolTimeAllList() {
        getSchoolTimeAllList().then((res) => {
          const data = res.data.data;
          if (res.data.code === 200) {
            this.allTeamList = data;
            data.forEach((item) => {
              this.teamList.push({
                value: item.id,
                label: item.schoolTimeName,
                startDate: item.startDate,
                endDate: item.endDate
              });
              if (item.isCurrent === 1) {
                this.selectTeam = item.id;
              }
            });
            if (!this.selectTeam) {
              this.selectTeam = this.teamList[0].value;
            }
          }
        }).catch(() => {});
      },
      getSeveralWeekListBySchoolTImeId(schoolTimeId) {
        getSeveralWeekListBySchoolTImeId(schoolTimeId).then((res) => {
          const data= res.data.data;
          this.allWeekList = data;
          this.weekList = [{
            value: 0,
            label: '全部周次',
            startDate: this.startDate,
            endDate: this.endDate
          }];

          if (res.data.code === 200) {
            data.forEach((item) => {
              this.weekList.push({
                value: item.week,
                label: '第'+ item.week + '周',
                startDate: item.startDate,
                endDate: item.endDate
              });
            });
          }
          if (this.selectWeek === 0) {
            this.changeWeekTimeRange(this.selectWeek);
          }
          this.selectWeek = 0;
        }).catch(() => {});
      },
      getSchoolGradeClass() {
        getSchoolGradeClass().then((res) => {
          const data= res.data.data;
          if (res.data.code === 200) {
            this.gradeIds = [];
            data.forEach((item) => {
              let newArray = [];
              item.classList.forEach((item) =>{
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
        }).catch(() => {});
      },
      getStuReadBooks() {
        if (!this.selectTeam || !this.selectGrade || !this.dateRange.length) {
          return;
        }
        let query = {
          classId: this.selectClass,
          endDate: this.dateFormat(this.dateRange[1]),
          gradeId: this.selectGrade,
          schoolTimeId: this.selectTeam,
          searchName: this.searchName,
          startDate: this.dateFormat(this.dateRange[0]),
          week: this.selectWeek
        };

        getStuReadBooks(query).then((res) => {
          let data = res.data.data;
          if (res.data.code === 200) {
            this.readBookList = data;
          }
        }).catch(() => {});
      },
      changeSchoolTimeRange(schoolTimeId) {
        this.allTeamList.forEach((item) => {
          if (item.id === schoolTimeId) {
            this.startDate = item.startDate;
            this.endDate = item.endDate;
          }
        });
      },
      changeWeekTimeRange(weekId) {
        if (weekId === 0) {
          this.changeSchoolTimeRange(this.selectTeam);
          this.dateRange = [this.startDate, this.endDate];
        } else {
          this.allWeekList.forEach((item) => {
            if (item.week === weekId) {
              this.startDate = item.startDate;
              this.endDate = item.endDate;
              this.dateRange = [this.startDate, this.endDate];
            }
          });
        }
      },
      fillZero(n) {
        return n < 10 ? '0' + n : n;
      },
      dateFormat(n) {
        let data = new Date(n);
        data.setTime(data.getTime());
        let dateStr = data.getFullYear() + "-" + this.fillZero(data.getMonth() + 1) + "-" + this.fillZero(data.getDate());
        return dateStr;
      },
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
    visibility: hidden;
  }

  .clearfix {
    zoom: 1;
  }
  /* 自定义滚动条 start */
  .custom—scrollbar {
    overflow-x: hidden;
    overflow-y: auto;
  }

  .custom—scrollbar::-webkit-scrollbar {
    width: 6px;
    background-color: #F5F5F5;
  }

  .custom—scrollbar::-webkit-scrollbar-thumb {
    background-color: #999;
  }

  .custom—scrollbar::-webkit-scrollbar-track {
    background-color: #F5F5F5;
  }

  /* 自定义滚动条 end */
</style>
<style lang="scss" scoped>
.readPunchClockStatisticsReadBook{
  padding: 12px;
}
.body{
  overflow:auto;
}
  .header {
    border-bottom: 1px solid #e7eaec;
     padding-bottom:5px;
    .statistics_title {
      display: flex;
      margin: 10px 0;
      .btn_group {
        flex: 1;
        text-align: center;
        .btn {
          height: 40px;
          line-height: 40px;
          border: 1px solid #ccc;
          border-left-width: 0;
          color: #333;
          cursor: pointer;
        }
        .btn_selected {
          color: #fff;
          background: #409EFF;
          border: 1px solid #409EFF;
        }
      }
      .btn_group:first-child {
        .btn {
          border-radius: 4px 0 0 4px;
          border-left-width: 1px;
        }
      }
      .btn_group:last-child {
        .btn {
          border-radius: 0 4px 4px 0;
        }
      }
    }
  }
  .search_line_wrap{
    padding: 5px 0px;
  }
  .read_book_wrap{
    width: 100%;
    margin: 30px auto;
    overflow-x: hidden;
    overflow-y: auto;
    .read_book_item{
      float: left;
      width: 120px;
      height: 190px;
      margin-bottom: 25px;
      margin-left: 36px;
      img{
        display: block;
        width: 100%;
        height: 160px;
      }
      div{
        height: 30px;
        line-height: 30px;
        font-size: 14px;
        text-align: center;
        color: #666;
      }
    }
  }
  .no_book_msg{
    padding: 30px;
    text-align: center;
    color: #666;
  }
</style>
