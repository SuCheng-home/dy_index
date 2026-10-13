<template>
  <div>
    <div style="padding:12px 12px 10px 12px;overflow: hidden;">
      <el-row>
        <el-col :span="19">
          <el-select size="medium" v-model="status" @change="searchIt">
            <el-option v-for="(item, index) in statusList" :key="index" :label="item.label" :value="item.status"></el-option>
          </el-select>
        </el-col>
        <el-col :span="5">
          <el-input placeholder="请输入考核员" v-model.trim="search" size="medium">
            <el-button slot="append" icon="el-icon-search" @click="searchIt"></el-button>
          </el-input>
        </el-col>
      </el-row>
    </div>
    <div style="padding:0 12px">
      <el-table :data="tableData" border :height="maxH" style="width:100%">
        <el-table-column label="考核任务" show-overflow-tooltip>
          <template slot-scope="scope">
        <span>{{ scope.row.taskName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="类型">
          <template slot-scope="scope">
            <span>{{ scope.row.typeName}}</span>
          </template>
        </el-table-column>
        <el-table-column label="考核时间">
          <template slot-scope="scope">
            <span>{{ scope.row.assessDate}}</span>
          </template>
        </el-table-column>
        <el-table-column label="考核员">
          <template slot-scope="scope">
            <span>{{ scope.row.userName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="审核员">
          <template slot-scope="scope">
            <span>{{ scope.row.auditUserName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="上报时间">
          <template slot-scope="scope">
            <span>{{ scope.row.reportDate | filterDate }}</span>
          </template>
        </el-table-column>
        <el-table-column label="审核状态">
          <template slot-scope="scope">
            <el-tag  size="mini" type="success" plain v-if="scope.row.auditState===3">已通过</el-tag>
            <el-tag  size="mini" type="danger" plain v-else-if="scope.row.auditState===2">驳回</el-tag>
            <el-tag  size="mini" type="warning" plain v-else-if="scope.row.auditState===1">待审核</el-tag>
            <el-tag  size="mini" type="info" plain v-else-if="scope.row.state===1">未上报</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="text" @click="goCheck(scope.row)">查看</el-button>
            <el-badge   v-if="scope.row.updateAuditingCount > 0"  :value="scope.row.updateAuditingCount" class="item">
              <el-button type="text"  @click="goPerformanceEditRecord(scope.row.id)">绩效修改</el-button>
            </el-badge>
            <el-button v-else type="text"  @click="goPerformanceEditRecord(scope.row.id)">绩效修改</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div style="margin-top: 15px;padding-left:15px">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="10"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </div>
  </div>
</template>
<script>
  import {getCheckList} from '@/api/performance'
  import mixin from "@/mixins/windowResize";

  export default {
    data() {
      return {
        pageSize: 10,
        pageNo: 1,
        total: '',
        search: '',
        status: 0,
        tableData: [],
        statusList: [
          { label: '全部状态', status: 0 },
          { label: '待审核', status: 1 },
          { label: '驳回', status: 2 },
          { label: '通过', status: 3 },
          // { label: '未上报', status: 4 }
        ]
      }
    },
    filters: {
      filterDate(date) {
        return date ? date.slice(0, 19) : '--';
      }
    },
    mixins: [mixin],
    created() {
      this.getCheckList()
    },
    methods: {
      //搜索
      searchIt() {
        this.pageNo = 1;
        this.getCheckList();
      },
      goPerformanceEditRecord(id) {
         this.$router.push({
          path: 'performanceEditRecord',
          query: {
            id: id
          }
        })
      },
      goCheck(data) {
        sessionStorage.setItem('checkInfo', JSON.stringify(data));
        this.$router.push({
          path: 'check',
          query: {
            taskId: data.id
          }
        })
      },
      getCheckList() {
        getCheckList(
          {
            pageSize: this.pageSize,
            pageNo: this.pageNo,
            searchName: this.search,
            status: this.status
          }).then(res => {
          this.tableData = res.data.data.dataList;
          this.total = res.data.data.pagination.total;
        })
      },
      //分页操作
      handleSizeChange(val) {
        this.pageSize = val;
        this.getCheckList()
      },
      handleCurrentChange(val) {
        this.pageNo = val;
        this.getCheckList()
      }
    }
  }
</script>

<style lang="scss" scoped>
/deep/ .el-badge__content.is-fixed {
  top: 10px !important;
  right: 3px !important
}
</style>


