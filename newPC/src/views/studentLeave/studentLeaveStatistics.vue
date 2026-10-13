<template>
  <div class="leaveContent">
    <div class="header">
      <el-row>
        <el-col :span="19">
          <el-date-picker v-model="dateRange" type="daterange" class="right-line mywidthdaterange" size="medium"  :clearable="false"
                          range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" @change="findDate()">
          </el-date-picker>
          <el-select v-model="selectLeaveState" placeholder="请选择请假状态" size="medium">
            <el-option v-for="item in leaveStateList" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
          <el-button type="primary" class="right-line" size="medium" @click="examHandler">统计</el-button>
        </el-col>
        <el-col :span="5">
          <el-input size="medium" class="search-input" placeholder="请输入学生姓名" v-model.trim="listQuery.studentName"
                    @change="examHandler">
            <el-button size="medium" slot="append" icon="el-icon-search" @click="examHandler"></el-button>
          </el-input>
        </el-col>
      </el-row>
    </div>

    <div>
      <el-table stripe :data="dataList" border fit highlight-current-row style="width: 100%" :height="maxH">
        <el-table-column align="center" label="学生姓名" show-overflow-tooltip>
          <template slot-scope="scope">
            <span class="link-type" @click="productJump(scope.row.id)">{{scope.row.studentName}}</span>
            <span></span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="班级" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{scope.row.className}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="是否住校生" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{scope.row.isStay === 1 ? '是' : '否'}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="请假类型" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{scope.row.leaveTypeName}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="体温" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{scope.row.animal}}℃</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="创建时间" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{scope.row.createTime | leaveDateFilter}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="请假时间" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{scope.row.startTime | leaveDateFilter}}&nbsp;至&nbsp;{{scope.row.endTime | leaveDateFilter}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="请假状态" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{scope.row.leaveStateName}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="放行人" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{scope.row.releaseUserName || '--'}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="放行时间" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{scope.row.releaseTime | leaveDateFilter}}</span>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-container">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                       :current-page.sync="listQuery.pageNo" :page-sizes="[10, 20, 30, 50]"
                       :page-size.sync="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper"
                       :total="total">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
  import mixin from '@/mixins/windowResize';
  import baseMixin from '@/mixins/baseMixin';
  import moment from "moment";
  import {getStuAskleaveThreeListByNum} from '@/api/studentLeave';

  export default {
    name: "studentLeaveStatistics",
    data() {
      return {
        dateRange: [],
        dataList: [],
        selectLeaveState: 0,
        leaveStateList: [
          {
            value: 0,
            label: '全部状态'
          },
          {
            value: 1,
            label: '待确认'
          },
          {
            value: 2,
            label: '确认请假'
          },
          {
            value: 3,
            label: '确认不请假'
          },
          {
            value: 4,
            label: '申请接离'
          },
          {
            value: 5,
            label: '放行'
          }
        ],
        listQuery: {
          pageNo: 1,
          pageSize: 20,
          startDate: '',
          endDate: '',
          studentName: ''
        },
        total: 0
      }
    },
    mixins: [baseMixin, mixin],
    filters: {
      leaveDateFilter(date) {
        if (date) {
          return date.substring(0, 16);
        }
        return '--';
      }
    },
    created() {
      this.dateRange = [new Date(moment().set('date', 1).valueOf()), new Date()];
      this.findDate();
      this.userFireAnalysisFunc();
    },
    methods: {
      findDate() {
        this.listQuery.startDate = this.$moment(this.dateRange[0]).format('YYYY-MM-DD'); //时间
        this.listQuery.endDate = this.$moment(this.dateRange[1]).format('YYYY-MM-DD'); //时间
      },
      examHandler() {
        this.listQuery.pageNo = 1;
        this.userFireAnalysisFunc();
      },
      handleSizeChange(val) {
        this.listQuery.pageNo = 1;
        this.listQuery.pageSize = val;
        this.userFireAnalysisFunc();
      },
      handleCurrentChange(val) {
        this.listQuery.pageNo = val;
        this.userFireAnalysisFunc();
      },
      // 获取数据列表
      userFireAnalysisFunc() {
        getStuAskleaveThreeListByNum({
          startDate: this.listQuery.startDate,
          endDate: this.listQuery.endDate,
          pageNo: this.listQuery.pageNo,
          pageSize: this.listQuery.pageSize,
          leaveState: this.selectLeaveState,
          studentName: this.listQuery.studentName
        }).then(res => res.data).then(data => {
          if (data.code === 200) {
            this.dataList = data.data.dataList;
            this.total = data.data.pagination.total;
          } else {
            this.$message({
              type: 'error',
              message: data.msg
            });
          }
        }).catch(() => {
        })
      },
      productJump(id) {
        this.$router.push({
          path: 'studentLeaveInfo',
          query: {
            askId: id
          }
        });
      }
    }
  }
</script>

<style lang="scss" scoped>
  .leaveContent {
    padding:12px;
    box-sizing: border-box;

    .header {
      margin-bottom: 10px;
      font-size: 14px;

     
    }
  }

</style>
