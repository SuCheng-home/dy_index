<template>
  <div class="duty_school_wrap">
    <div class="header">
      <el-date-picker v-model.trim="reportDate" size="medium" type="date" :clearable="false" placeholder="请选择日期" @change="changeReportDate"></el-date-picker>
      <el-button type="primary" size="medium" @click="addWatchSchool" v-if="localDate === dateStr(reportDate) && !!signSchoolInfo.manSchool && signSchoolInfo.manSchool.isReport !== 2">上报</el-button>
      <a class="export-btn" :href="exportUrl" download="导出" target="_blank" v-if="allPersonnelList.length">
        <el-button class="filter-item" type="primary" size="medium" icon="upload">导出</el-button>
      </a>
      <span class="sign_tag" v-if="signSchoolInfo.manSchool && signSchoolInfo.manSchool.isReport === 2">已上报</span>
      <span class="sign_tag no_sign_tag" v-else>未上报</span>
    </div>

    <div class="school_index_box">
      <div class="top_title">值班签到统计</div>
      <div class="duty_content">
        <div class="on_duty_manager_name">
          值班负责人：
          <span :key="index" v-for="(item, index) in signSchoolInfo.mangerList">{{item.teacherUserName}}&nbsp;&nbsp;&nbsp;</span>
          <span v-if="!signSchoolInfo.mangerList || !signSchoolInfo.mangerList.length">-</span>
        </div>
        <div class="on_duty_teacher_list clearfix">
          <div class="duty_teacher_block" :key="index" v-for="(item, index) in signSchoolInfo.teacherCallList">
            <div class="teacher_name">
              <span>{{item.teacherUserName}}</span>
              <span class="sign_tag" v-if="item.callSatus === 2">已签</span>
              <span class="sign_tag no_sign_tag" v-else>未签</span>
            </div>
            <div class="teacher_sign_time"><span v-show="item.callSatus === 2">{{item.createTime | formatTimeMap}}</span>&nbsp;</div>
          </div>
        </div>
      </div>
      <div class="top_title">进出校数据统计</div>
      <div class="school_count_box clearfix">
        <div class="school_count_block">
          <div class="school_count_num">{{(!!signSchoolInfo.manSchool && !!signSchoolInfo.manSchool.peopleTimeCount) ? signSchoolInfo.manSchool.peopleTimeCount : 0}}</div>
          <div class="teacher_sign_time">进校总人次</div>
        </div>
        <div class="school_count_block">
          <div class="school_count_num">{{(!!signSchoolInfo.manSchool && !!signSchoolInfo.manSchool.schInPeopleTimeCount) ? signSchoolInfo.manSchool.schInPeopleTimeCount : 0}}</div>
          <div class="teacher_sign_time">校内人员进校人次</div>
        </div>
        <div class="school_count_block">
          <div class="school_count_num">{{(!!signSchoolInfo.manSchool && !!signSchoolInfo.manSchool.schOutPeopleTimeCount) ? signSchoolInfo.manSchool.schOutPeopleTimeCount : 0}}</div>
          <div class="teacher_sign_time">校外人员进校人次</div>
        </div>
      </div>
    </div>

    <div class="table_top_header">
      <el-select v-model="selectPersonnelType" size="medium" placeholder="请选择人员类型" style="margin-right: 10px;" @change="changePersonType">
        <el-option v-for="item in personnelTypeList" :key="item.value" :label="item.label" :value="item.value">
        </el-option>
      </el-select>
      <el-input class="search-input" size="medium" style="width: 240px !important;" placeholder="请输入姓名" icon="el-icon-search" @change="handleInputChange" v-model.trim="searchName">
        <el-button slot="append" icon="el-icon-search" size="medium" @click="handleInputChange"></el-button>
      </el-input>
    </div>

    <div class="school_receipt_box">
      <el-table stripe :data="allPersonnelList" border style="width: 100%;min-height: 150px;" :height="maxH-300" id="outTable">
        <el-table-column label="姓名">
          <template slot-scope="scope">
            <span>{{scope.row.userName}}</span>
          </template>
        </el-table-column>
        <el-table-column label="身份">
          <template slot-scope="scope">
            <span v-if="scope.row.userType === 1">校内人员</span>
            <span v-else-if="scope.row.userType === 2">校外人员</span>
            <span v-else>--</span>
          </template>
        </el-table-column>
        <el-table-column label="联系方式" prop="mobile"></el-table-column>
        <el-table-column label="体温情况（℃）">
          <template slot-scope="scope">
            <span>{{scope.row.animal}}℃</span>
          </template>
        </el-table-column>
        <el-table-column label="入校时间">
          <template slot-scope="scope">
            <span>{{scope.row.intTime | formatTime}}</span>
          </template>
        </el-table-column>
        <el-table-column label="事由" prop="reason" show-overflow-tooltip></el-table-column>
        <el-table-column label="出校时间">
          <template slot-scope="scope">
            <span>{{scope.row.outTime | formatTime}}</span>
          </template>
        </el-table-column>
      </el-table>
      <div style="margin-top: 10px;">
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
  import moment from "moment";
  import mixins from '@/mixins/windowResize';
  import baseMixin from '@/mixins/baseMixin';
  import {getWatchSchool, getManUserList, addWatchSchool} from "@/api/schoolManage/onDutyStatistics";

  export default {
    name: "onDutySchoolIndex",
    data() {
      return {
        localDate: '',
        reportDate: '',
        searchName: '',
        exportUrl: '',
        allPersonnelList: [],
        personnelTypeList: [
          {
            label: '全部人员类型',
            value: 0
          },
          {
            label: '校内人员',
            value: 1
          },
          {
            label: '校外人员',
            value: 2
          }
        ],
        selectPersonnelType: 0,
        signSchoolInfo: {}
      }
    },
    mixins: [mixins, baseMixin],
    filters: {
      formatTimeMap(type) {
        if (type) {
          return type.substring(11,19);
        }
        return ' ';
      },
      formatTime(date) {
        if (date) {
          return date.substring(11, 16);
        }
        return '--';
      }
    },
    created() {
      // 判断校端还是区端进来的，区端拿上一级的schoolId，校端通过store获取
      this.localDate = this.getDate(0);
      this.reportDate = this.getDate(0);
      this.changeReportDate()
    },
    methods: {
      goBack() {
        this.$router.back()
      },
      changeReportDate() {
        this.exportUrl = `${global.BasePath}structure/campusMan/exportWatchSchool?createDate=${this.reportDate}&token=${this.$store.getters.token}`;
        this.getWatchSchool();
        this.searchName = '';
        this.selectPersonnelType = 0;
        this.getManUserList()
      },
      changePersonType() {
        this.searchName = '';
        this.getManUserList()
      },
      handleInputChange() {
        this.getManUserList()
      },
      getWatchSchool() {
        getWatchSchool(this.dateStr(this.reportDate)).then(res => {
          if (res.data.code === 200) {
            this.signSchoolInfo = res.data.data
          }
        }).catch()
      },
      getManUserList() {
        let query = {
          createDate: this.dateStr(this.reportDate),
          pageNo: this.pagination.pageNo,
          pageSize: this.pagination.pageSize,
          searchTitle: this.searchName,
          userType: this.selectPersonnelType
        };
        getManUserList(query).then(res => {
          const data = res.data;
          if (res.data.code === 200) {
            this.allPersonnelList = data.data.dataList;
            this.pagination.total = data.data.pagination.total;
          } else {
            this.$message({
              message: data.msg,
              type: 'warning'
            });
          }
        }).catch()
      },
      addWatchSchool() {
        addWatchSchool({createDate: this.localDate}).then(res => {
          if (res.data.code === 200) {
            this.$message({
              type: 'success',
              message: '上报成功!'
            });
            this.changeReportDate()
          } else {
            this.$message({
              type: "error",
              message: res.data.msg
            });
          }
        }).catch()
      },
      dateStr(val) {
        return moment(val).format("YYYY-MM-DD")
      },
      sizeChangeHandler() {
        this.getManUserList();
      },
      currentChangeHandler() {
        this.getManUserList();
      }
    }
  }
</script>

<style lang="scss" scoped>
  .duty_school_wrap {
    padding:12px;
    .header {
      padding-bottom: 10px;
      border-bottom: 1px solid #eee;
      .sign_tag{
        height: 14px;
        line-height: 14px;
        margin: 3px 0 3px 14px;
        padding: 2px 10px;
        font-size: 12px;
        color: #67c23a;
        background: #f0f9eb;
        border: 1px solid #67c23a;
        box-sizing: content-box;
        border-radius: 3px;
      }
      .no_sign_tag{
        color: #e6a23c;
        background: #fdf6ec;
        border: 1px solid #e6a23c;
      }
    }

    .school_index_box{
      padding: 10px 20px;
      .top_title{
        height: 20px;
        line-height: 20px;
        margin: 5px 15px;
        padding-left: 8px;
        border-left: 4px solid #409eff;
        color: #333;
      }
      .duty_content{
        padding: 10px 20px;
        .on_duty_manager_name{
          height: 20px;
          line-height: 20px;
          padding-left: 10px;
          color: #666;
        }
        .on_duty_teacher_list{
          margin-top: 10px;
          .duty_teacher_block{
            width: 150px;
            float: left;
            margin-right: 20px;
            margin-bottom: 5px;
            padding: 5px 10px;
            .teacher_name{
              height: 26px;
              color: #333;
              span{
                max-width: 65px;
                height: 26px;
                line-height: 26px;
                display: inline-block;
                overflow: hidden;
              }
              .sign_tag{
                height: 14px;
                line-height: 14px;
                margin: 3px 0 3px 14px;
                padding: 2px 10px;
                font-size: 12px;
                color: #67c23a;
                background: #f0f9eb;
                border: 1px solid #67c23a;
                box-sizing: content-box;
                border-radius: 3px;
              }
              .no_sign_tag{
                color: #e6a23c;
                background: #fdf6ec;
                border: 1px solid #e6a23c;
              }
            }
            .teacher_sign_time{
              height: 20px;
              line-height: 20px;
              margin-top: 5px;
              color: #999;
            }
          }
        }
      }
      .school_count_box{
        .school_count_block{
          width: 150px;
          float: left;
          text-align: center;
          margin-top: 10px;
          margin-left: 25px;
          padding: 5px 0;
          color: #fff;
          background: #409efa;
          border-radius: 5px;
          .school_count_num{
            width: 100%;
            height: 40px;
            line-height: 40px;
            font-size: 36px;
            overflow: hidden;
          }
          .teacher_sign_time{
            width: 100%;
            height: 30px;
            line-height: 30px;
            overflow: hidden;
          }
        }
      }
    }

    .table_top_header{
      padding: 5px 20px;
    }
    .school_receipt_box {
      padding: 10px 20px;
    }
  }
</style>
