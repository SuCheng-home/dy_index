<template>
  <div  style="    padding: 12px;">
    <div class="header">
      <el-row>
        <el-col :span="19">
          <el-select v-model="searchState" placeholder="请选择" @change="changeState" size="medium">
            <el-option
              v-for="item in searchStateList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <el-button type="primary" size="medium" @click="addAdvice()">新建</el-button>
          <a :href="exportTableUrl" download="导出" target="_blank" v-if="tableData.length">
            <el-button type="primary" size="medium">导出</el-button>
          </a>
        </el-col>
        <el-col :span="5">
          <el-input size="medium" v-model.trim="searchName" placeholder="请输入学生姓名" @keyup.enter.native="SearchList">
            <el-button size="medium" slot="append" icon="el-icon-search" @click="SearchList"></el-button>
          </el-input>
        </el-col>
      </el-row>
    </div>
    <el-table
      :data="tableData"
      border
      :stripe='true'
      :height="`${boxH - 220}px`"
      class="orderListTable">
      <!-- <el-table-column
        prop="authCode"
        label="预约验证码"
        align="center">
      </el-table-column> -->
      <el-table-column
        prop="stuName"
        label="学生姓名"
        align="center">
      </el-table-column>
       <el-table-column
        prop="className"
        label="班级"
        align="center">
      </el-table-column>
      <el-table-column
        prop="stuSex"
        label="性别"
        align="center">
      </el-table-column>
      <el-table-column
        prop="stuAge"
        label="年龄"
        align="center">
      </el-table-column>
      <el-table-column
        prop="renderOrderDate"
        label="面询时间"
        align="center"
        width="300">
      </el-table-column>
      <el-table-column
        prop="meetTeacherName"
        label="面询老师"
        align="center">
         <template slot-scope="scope">
           <span>{{scope.row.meetTeacherName? scope.row.meetTeacherName : '--' }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="面询状态"
        align="center">
          <template slot-scope="scope">
            <el-tag  size="mini"  v-if="scope.row.state==1">待分配</el-tag>
            <el-tag  size="mini" v-if="scope.row.state==2" >待面询</el-tag>
            <el-tag  size="mini" v-if="scope.row.state==3" >结案</el-tag>
            <el-tag  size="mini" v-if="scope.row.state==4"  type="warning">流失</el-tag>
            <el-tag  size="mini" v-if="scope.row.state==5" >转介</el-tag>
         </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="LinkToDetail(scope.row)">详情</el-button>
          <el-button type="text" size="small" v-if="scope.row.state==1"
                     @click="SetDistributionShow(true,scope.row)">分配
          </el-button>
          <el-button v-if="scope.row.state==1" type="text" style="color: red" size="small" @click="deleteIt(scope.row)" class="buttontextred">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                   :current-page.sync="listQuery.pageNo" :page-sizes="[10,20,30,50]"
                   :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper"
                   :total="total" class="list-pagination">
    </el-pagination>

    <el-dialog
      title="面询安排"
      v-if="distributionIsShow"
      :visible.sync="distributionIsShow">
       <span>预约面询时间:&nbsp;&nbsp;{{distributionDate[0]}}&nbsp;&nbsp;&nbsp;&nbsp;{{distributionDate[1]}}</span>
        <!-- :picker-options="pickerOptions" -->
      <!-- <div class="detail-titleCon">
        <div class="detail-titleConLeft"></div>
        <div class="detail-titleConText">上午</div>
      </div> -->
      <!-- <div class="cutLine"></div> -->
      <div class="distribution-flexCon">
        <div class="distribution-con" :class="item.isCheck?'distribution-conOn':'distribution-conOff'"
             v-if="teacherList.length>0" v-for="(item,index) in teacherList" :key="index+'AM'"
             @click="SetAmCheck(index)">
          <div class="distribution-topCon">
            <div>{{item.teacherName}}</div>
            <!-- <div>{{item.amConfirmedCount}}/{{item.amAllotCount}}</div> -->
            <div>{{item.allotCount}}</div>     
          </div>
          <!-- <div class="distribution-bottomCon">
            <el-time-picker
              v-if="item.AMisCheck"
              is-range
              v-model="item.AMvalue"
              size="mini"
              value-format="HH:mm:ss"
              range-separator="~"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              placeholder="选择时间范围">
            </el-time-picker>
          </div> -->
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
              <el-button @click="distributionIsShow = false">取 消</el-button>
              <el-button type="primary" @click="SentDistribution()">确 定</el-button>
            </span>
    </el-dialog>
  </div>
</template>

<script>
  import {querySubscribeByState,deleteSubscribeById, getTeacherAllotMeetCount, allotMeet} from '@/api/psychological';
  import baseMixin from '@/mixins/baseMixin';
  import windowResizeMixin from '@/mixins/windowResize';
  const _ = require('lodash');
  export default {
    mixins: [windowResizeMixin, baseMixin],
    data() {
      return {
        searchStateList: [{
          value: 0,
          label: '全部面询状态'
        }, {
          value: 1,
          label: '待分配'
        }, {
          value: 2,
          label: '待面询'
        }, {
          value: 3,
          label: '结案'
        }, {
          value: 4,
          label: '流失'
        }, {
          value: 5,
          label: '转介'
        }],//搜索条件-面询状态数据源
        searchState: 0,//搜索条件-面询状态
        searchName: '',//搜索条件-学生姓名
        tableData: [],//表格数据源
        distributionIsShow: false,//分配模态框是否显示
        distributionDate: [],//分配面询日期选择值
        listQuery: {
          pageNo: 1,//当前页数
          pageSize: 20//每页条数
        },//分页相关
        total: null,//数据总条数
        selectId: '',//当前分配的数据主键
        teacherList: [],//所选日期教师数据源
        exportTableUrl: '',//导出地址
        // pickerOptions: {
        //   disabledDate(time) {
        //     return (time.getTime() < Date.now()) || (time.getDay() != 0 && time.getDay() != 6)
        //   },//分配老师时间选择器选择规则

        // }
      };
    },
    created() {
      this.GetOderList();
      // this.distributionDate = this.GetWeekDay();
      // this.ChangeDate(this.distributionDate);
    },
    methods: {
      deleteIt(item) {
        this.$confirm('是否删除该条数据?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteSubscribeById(item.id).then(res => {
              this.GetOderList()
              this.$message({
              type: 'success',
              message: '删除成功!'
            });
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
      },
      // 新建咨询
      addAdvice() {
         this.$router.push('addAdvice')
      },
      //获取列表
      GetOderList() {
        this.exportTableUrl = `${global.BasePath}structure/psychological/downSubscribeByState?searchName=${this.searchName}&state=${this.searchState}&token=${this.$store.getters.token}`;
        querySubscribeByState(this.listQuery.pageNo, this.listQuery.pageSize, this.searchName, this.searchState)
          .then(res => res.data)
          .then(data => {
            this.tableData = data.data.dataList.map(v =>
              Object.assign({}, v, {
                renderOrderTime: this.SetRenderOrderTime(v.saturdayOrder, v.sundayOrder),
                renderOrderDate: v.meetDate+' '+v.meetDateRange
              }));
            this.total = data.data.pagination.total;
          });
      },
      //匹配预约时间渲染
      SetRenderOrderTime(e, v) {
        let tempOrderArr = [];
        switch (e) {
          case 1 :
            tempOrderArr.push('周六-上午');
            break;
          case 2 :
            tempOrderArr.push('周六-下午');
            break;
          case 3 :
            tempOrderArr.push('周六-上午 周六-下午');
            break;
        }
        switch (v) {
          case 1 :
            tempOrderArr.push('周日-上午');
            break;
          case 2 :
            tempOrderArr.push('周日-下午');
            break;
          case 3 :
            tempOrderArr.push('周日-上午 周日-下午');
            break;
        }
        return tempOrderArr.join(' ')
      },
      //跳转详情
      LinkToDetail(e) {
        this.$router.push({
          path: 'orderDetail',
          query: {id: e.id}
        });
      },
      //判断预约时间周几
      SetRenderWeekDay(e) {
        return e == 1 ? '周六-上午' : e == 2 ? '周六-下午' : e == 3 ? '周日-上午' : '周日-下午'
      },
      //显示分配模态框
      SetDistributionShow(e, v) {
        this.distributionDate = [v.meetDate , v.meetDateRange]
        this.ChangeDate(v.meetDate, e)
        if (v) {
          this.selectId = v.id;
        }
      },
      //每页条数更改
      handleSizeChange(val) {
        this.listQuery.pageSize = val;
        this.GetOderList();
      },
      //当前页码更改
      handleCurrentChange(val) {
        this.listQuery.pageNo = val;
        this.GetOderList();
      },
      //点击搜索
      changeState() {
        this.searchName = '';
        this.listQuery.pageNo = 1;
        this.GetOderList();
      },
      //点击搜索
      SearchList() {
        this.listQuery.pageNo = 1;
        this.GetOderList();
      },
      //选择分配日期
      ChangeDate(e,show) {
        if (e) {
          getTeacherAllotMeetCount(e)
            .then(res => res.data)
            .then(data => {
              this.distributionIsShow = show;
              this.teacherList = data.data.map(v =>
                Object.assign({}, v, {
                  isCheck: false,     
                }));
            });
        }

      },
      //获取最近的周末
      GetWeekDay() {
        let _date = new Date();
        let _nowTime = _date.getTime();
        let _week = _date.getDay();
        let _dayLongTime = 24 * 60 * 60 * 1000;
        let _furtureSundayTimes = _nowTime + (7 - _week) * _dayLongTime;
        let _furtureSaturdayTimes = _nowTime + (6 - _week) * _dayLongTime;
        _furtureSundayTimes = new Date(_furtureSundayTimes);
        _furtureSaturdayTimes = new Date(_furtureSaturdayTimes);
        // staurday
        let _satYear = _furtureSaturdayTimes.getFullYear();
        let _satMonth = _furtureSaturdayTimes.getMonth() + 1;
        let _satDay = _furtureSaturdayTimes.getDate();
        //sunday
        let _sunYear = _furtureSundayTimes.getFullYear();
        let _sunMonth = _furtureSundayTimes.getMonth() + 1;
        let _sunDay = _furtureSundayTimes.getDate();
        _satMonth = _satMonth >= 10 ? _satMonth : '0' + _satMonth;
        _satDay = _satDay >= 10 ? _satDay : '0' + _satDay;
        _sunMonth = _sunMonth >= 10 ? _sunMonth : '0' + _sunMonth;
        _sunDay = _sunDay >= 10 ? _sunDay : '0' + _sunDay;
        let _mealSunDay = _satYear + '-' + _satMonth + '-' + _satDay;
        let _mealSaturDay = _sunYear + '-' + _sunMonth + '-' + _sunDay;
        return _mealSaturDay > _mealSunDay ? _mealSunDay : _mealSaturDay
      },
      //设置上午医生
      SetAmCheck(e) {
        for (let i = 0; i < this.teacherList.length; i++) {
          this.teacherList[i].isCheck = false;
          this.teacherList[i].isCheck = e == i ? true : false
        }
        this.teacherList = Object.assign([], this.teacherList)
      },
      getHMStr(time) {
        if (time.length) {
          return time.substr(0, 5);
        } else {
          return this.$moment(time).format('HH:mm');
        }
      },
      //确认分配
      SentDistribution() {
        if (_.findIndex(this.teacherList, function (o) {
          return o.isCheck
        }) == -1) {
          this.$message.error('请选择面询老师');
          return;
        }
        let tempSelectData = _.find(this.teacherList, function (o) {
          return o.isCheck 
        });
        let tempData = {
          meetTeacherId: tempSelectData.teacherId,
          meetTeacherName: tempSelectData.teacherName,
          subscribeId: this.selectId
        };
        allotMeet(tempData)
          .then(res => res.data)
          .then(data => {
            if (data.result) {
              this.distributionIsShow = false;
              this.selectId = ''
              this.GetOderList();
              this.$message({
                message: '分配成功',
                type: 'success'
              });
            }
          });
      }
    }
  };
</script>

<style scoped>
  .header {
    padding-bottom: 10px;
  }

  .detail-titleCon {
    display: flex;
    margin-top: 20px;
  }

  .detail-titleConLeft {
    width: 3px;
    height: 20px;
    background: #409EFF;
  }

  .detail-titleConText {
    margin-left: 10px;
    margin-bottom: 10px;
    line-height: 20px;
  }

  .cutLine {
    width: 100%;
    height: 1px;
    background: #dcdfe6;
  }

  .distribution-con {
    width: 280px;
    padding: 10px;
    margin-top: 10px;
    cursor: pointer;
    margin-right: 10px;
  }

  .distribution-conOn {
    border: 1px solid #409EFF;
  }

  .distribution-conOff {
    border: 1px solid #bcbcbc;
  }

  .distribution-topCon {
    display: flex;
    justify-content: space-between;
    padding: 10px;
  }

  .distribution-bottomCon {
    display: flex;
    justify-content: space-between;
  }

  .distribution-time {
    line-height: 28px;
    margin: 0 10px;
  }

  .list-pagination {
    margin-top: 10px;
    margin-left: 20px;
  }

  .distribution-con .el-date-editor .el-range-separator {
    width: 15%;
  }

  .distribution-flexCon {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    /* justify-content: space-between; */
    margin-top: 20px;
  }

  .export-btn {
    margin-right: 10px;
  }
</style>
