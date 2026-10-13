<template>
  <div class="page">
    <div class="header">
      <el-row>
                <el-col :span="19">
      <template>
        <el-select style="width: 195px;" size="medium" v-model="schoolName" placeholder="请选择学期" @change="changeSchool">
          <el-option v-for="item in schoolYearList" :key="item.schoolTimeCode" :label="item.label" :value="item.schoolTimeName">
          </el-option>
        </el-select>
      </template>
      <el-date-picker  style="width: 250px;" size="medium" ref="date" v-model="date" type="daterange" class="mywidthdaterange" :editable="false" :clearable='false' align="right"
                      unlink-panels placeholder="选择时间范围" :picker-options="shortcutOptions" @change="dateChange">
      </el-date-picker>
      <el-select  style="width: 140px;" size="medium" v-model="departSelect" placeholder="请选择部门" @change="getApplicationList">
        <el-option v-for="item in departList" :key="item.value" :label="item.label" :value="item.value">
        </el-option>
      </el-select>
       <a :href="exportUrl" download="导出结果" target="_blank" v-if="applyList.length">
        <el-button type="primary" size="medium" icon="upload">导出</el-button>
      </a>
                </el-col>
                <el-col :span="5">
                    <el-input class="search-input"
                              placeholder="请输入申请人姓名" icon="search" size="medium" @keyup.enter.native="getApplicationList"
                              v-model.trim="teacherName">
                        <el-button slot="append" icon="el-icon-search" @click="getApplicationList"></el-button>
                    </el-input>
                </el-col>
            </el-row>



    </div>
    <el-table stripe :data="applyList" v-loading.body="listLoading" border style="width: 100%" :height="maxH">
      <el-table-column label="申请人">
        <template slot-scope="scope">
          <span style="cursor:pointer;color: #337ab7;" @click="toApplyDetail(scope.row.id)">{{scope.row.createUserName}}</span>
        </template>
      </el-table-column>
      <el-table-column label="录制主题">
        <template slot-scope="scope">
          <span class="two_line_hide" :title="scope.row.recordingName">{{scope.row.recordingName}}</span>
        </template>
      </el-table-column>
      <el-table-column label="录制地点">
        <template slot-scope="scope">
          <span class="two_line_hide" :title="scope.row.recordingPlace">{{scope.row.recordingPlace}}</span>
        </template>
      </el-table-column>
      <el-table-column label="录制时间" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{scope.row.recordingTime | time}}</span>
        </template>
      </el-table-column>
      <el-table-column label="录制时长">
        <template slot-scope="scope">
          <span>{{scope.row.recordingDuration}}分钟</span>
        </template>
      </el-table-column>
      <el-table-column label="所属部门" prop="departmentName">
      </el-table-column>
      <el-table-column label="审批人">
        <template slot-scope="scope">
          <span>{{scope.row.approverName ? scope.row.approverName : '--'}}</span>
        </template>
      </el-table-column>
      <el-table-column label="审批意见">
        <template slot-scope="scope">
          <span class="two_line_hide" :title="scope.row.approvalContent">{{scope.row.approvalContent ? scope.row.approvalContent : '--'}}</span>
        </template>
      </el-table-column>
      <el-table-column label="审批状态">
        <template slot-scope="scope">
          <template v-if="scope.row.state===2">
            <el-tag  size="mini" type="warning">未审批</el-tag>
          </template>
          <template v-else-if="scope.row.state===3">
            <el-tag  size="mini" type="success">通过</el-tag>
          </template>
          <template v-else-if="scope.row.state===4">
            <el-tag  size="mini" type="danger">驳回</el-tag>
          </template>
        </template>
      </el-table-column>
    </el-table>
    <div class="footer_wrap">
      <el-radio-group v-model="showState" @change="stateChange" style="float: left;">
        <el-radio label="0">全部</el-radio>
        <el-radio label="2">待审核</el-radio>
        <el-radio label="3">通过</el-radio>
        <el-radio label="4">驳回</el-radio>
      </el-radio-group>
      <div v-show="!listLoading" style="float: right;">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                       :current-page.sync="pageNo" :page-sizes="[10,20,30,50]"
                       :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper"
                       :total="total">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
  import {getSchoolTimeList, findDepartList, getApplicationList} from '@/api/record';
  import { pickerOptions } from '@/utils';
  import mixin from '@/mixins/windowResize';

  export default {
    name: 'recordList',
    data() {
      return {
        listLoading:false,
        pageNo: 1,
        pageSize: 20,
        total: null,
        showState: '0',
        schoolName: '',
        schoolTimeCode: '',
        schoolYearList: [],
        departSelect: '',
        departList: [
          {
            label: '全部部门',
            value: ''
          }
        ],
        exportUrl: '',
        shortcutOptions: {
          shortcuts: pickerOptions
        },
        date: [],
        teacherName: '',
        applyList: []
      }
    },
    mixins: [mixin],
    created() {
      this.getSchoolTimeList();
    },
    filters: {
      time(time = +new Date()) {
        let date = new Date(time + 8 * 3600 * 1000); // 增加8小时
        return date.toJSON().substr(0, 16).replace('T', ' ');
      }
    },
    methods: {
      toApplyDetail(id) {
        this.$router.push({path: 'recordDetail', query: {id: id}});
      },
      dateChange(val) {
        this.getApplicationList();
      },
      changeSchool(val) {
        const self = this;
        this.schoolName = val;
        self.date = [];
        this.schoolYearList.forEach(function (item) {
          if (item.schoolTimeName == val) {
            self.schoolTimeCode = item.id;
            self.date.push(item.startDate);
            self.date.push(item.endDate);
          }
        });
        this.getApplicationList();
      },
      getSchoolTimeList() {
        getSchoolTimeList().then(res => {
          this.schoolYearList = res.data.data;
          const self = this;
          this.schoolYearList.forEach(function (item) {
            if (item.isCurrent == 1) {
              self.schoolName = item.schoolTimeName;
              self.schoolTimeCode = item.id;
               if(item.startDate>(this.$moment(new Date()).format('YYYY-MM-DD')+"")){
                             self.date = [new Date(),item.startDate];
                            }else{
                              self.date = [item.startDate,new Date()];
                            }
            }
          });
          this.findDepartList();
        }).catch();
      },
      findDepartList() {
        let self = this;
        findDepartList().then(res => {
          if (JSON.parse(JSON.stringify(res.data)).code === 200) {
            JSON.parse(JSON.stringify(res.data)).data.forEach((item) => {
              let query = {};
              query.label = item.name;
              query.value = item.id.toString();
              self.departList.push(query);
            });
            this.getApplicationList();
          }
        }).catch();
      },
      getApplicationList() {
        let query = {};
        query.createUserName = this.teacherName;
        query.departmentId = this.departSelect;
        query.endDateStr = this.getStrDate(this.date[1]);
        query.pageNo = this.pageNo;
        query.pageSize = this.pageSize;
        query.schoolTimeId = this.schoolTimeCode;
        query.startDateStr = this.getStrDate(this.date[0]);
        query.state = parseInt(this.showState);
        this.listLoading = true;
        getApplicationList(query).then(res => {
          if (JSON.parse(JSON.stringify(res.data)).code === 200) {
            let data = JSON.parse(JSON.stringify(res.data)).data;
            this.total = data.pagination.total;
            this.applyList = data.dataList;
          }
          this.exportUrl = global.BasePath + 'structure/recordingApplication/export?token='
            + this.$store.getters.token + '&createUserName=' + this.teacherName + '&departmentId=' + this.departSelect
            + '&startDateStr=' + this.getStrDate(this.date[0]) + '&endDateStr=' + this.getStrDate(this.date[1]) + '&pageNo=' + this.pageNo + '&pageSize=' + this.pageSize
            + '&schoolTimeId=' + this.schoolTimeCode + '&state=' + this.showState;
          this.listLoading = false;
        }).catch(() => {
          this.listLoading = false;
        });
      },
      getStrDate(date) {
        const data = new Date(date);
        const strDate = data.getFullYear() + "-" + this.fillZero(data.getMonth() + 1) + "-" + this.fillZero(data.getDate());
        return strDate;
      },
      fillZero(n) {
        return n < 10 ? '0' + n : n;
      },
      stateChange(val){
        this.showState = val;
        this.getApplicationList();
      },
      handleSizeChange(val) {
        this.pageSize = val;
        this.getApplicationList();
      },
      handleCurrentChange(val) {
        this.pageNo = val;
        this.getApplicationList();
      },
    }
  }
</script>

<style scoped>
  .page {
    padding:12px;
  }

  .header {
    margin-bottom: 10px;
  }

  .footer_wrap{
    padding: 20px;
  }

  .two_line_hide{
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
</style>
