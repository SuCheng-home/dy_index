<template>
  <div class="check_wrap">
    <div class="header">
      <el-button size="medium" @click="goBack">返回</el-button>
      <el-button type="primary" size="medium" @click="passAll()"
                 v-if="!(checkInfo.state === 2 && (checkInfo.auditState === 2 || checkInfo.auditState === 3))">全部审批通过
      </el-button>
      <el-button type="danger" size="medium" @click="rejectTask()"
                 v-if="!(checkInfo.state === 2 && (checkInfo.auditState === 2 || checkInfo.auditState === 3))">退回
      </el-button>
    </div>

    <el-table :data="tableData" border :height="maxH-1" style="width:100%" v-if="showTable">
      <el-table-column label="教师姓名">
        <template slot-scope="scope">
          <span>{{ scope.row.userName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="部门" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ scope.row.departNames }}</span>
        </template>
      </el-table-column>
      <template v-for="(item, index) in titleList">
        <el-table-column :width="item.pointType === 2 ? 220 : 180">
          <template slot="header" slot-scope="scope">
            <span>{{ item.itemName }}</span>
            <el-popover v-if="item.pointType === 2" placement="top" width="200" trigger="hover"
                        :content="'现金分值：' + item.cashScore + '元/分'">
              <i slot="reference" class="el-icon-question"></i>
            </el-popover>
          </template>
          <template slot-scope="scope">
            <span v-if="item.pointType === 1">{{ scope.row.pointList[index].point ? scope.row.pointList[index].point : '0' }}元</span>
            <span v-else>{{ scope.row.pointList[index].score }}*{{ item.cashScore }}={{ (scope.row.pointList[index].score * item.cashScore).toFixed(2) }}元</span>
          </template>
        </el-table-column>
        <el-table-column :width="200" :label="item.itemName + '备注'" v-if="item.haveRemark === 1">
          <template slot-scope="scope">
						<span>
							{{ scope.row.pointList[index].remark ? scope.row.pointList[index].remark : '--' }}
						</span>
          </template>
        </el-table-column>
      </template>
      <el-table-column label="合计">
        <template slot-scope="scope">
          <span>{{ scope.row.totalPoint ? scope.row.totalPoint : '0.0' }}元</span>
        </template>
      </el-table-column>

      <el-table-column label="备注" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.remark ? scope.row.remark : '--' }}
        </template>
      </el-table-column>

      <el-table-column label="审核意见" show-overflow-tooltip>
        <template slot-scope="scope">
          <span v-if="checkInfo.state === 2 && (checkInfo.auditState === 2 || checkInfo.auditState === 3)">{{ scope.row.auditRemark }}</span>
          <el-input v-else v-model="scope.row.auditRemark" @keyup.native="setAuditRemark(scope.row)" autocomplete="off"
                    placeholder="请输入审核意见"></el-input>
        </template>
      </el-table-column>
    </el-table>
    <div style="margin-top: 15px;">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                     :page-sizes="[10, 20, 30, 40]" :page-size="10" layout="total, sizes, prev, pager, next, jumper"
                     :total="total"></el-pagination>
    </div>
  </div>
</template>

<script>
  import {queryReportUserByReportId, setAuditRemark, passAll, rejectTask} from '@/api/performance'
  import mixin from '@/mixins/windowResize'

  export default {
    data() {
      return {
        showTable: false,
        total: '',
        pageSize: 10,
        pageNo: 1,
        search: '',
        checkInfo: {},
        tableData: []
      }
    },
    created() {
      this.checkInfo = JSON.parse(sessionStorage.getItem('checkInfo'));
      this.queryReportUserByReportId()
    },
    mixins: [mixin],
    methods: {
      goBack() {
        this.$router.back()
      },
      queryReportUserByReportId() {
        queryReportUserByReportId({
          pageNo: this.pageNo,
          pageSize: this.pageSize,
          departId: 0,
          searchName: this.search,
          taskId: this.checkInfo.taskId,
          reportId: this.checkInfo.id
        }).then(res => {
          this.tableData = res.data.data.dataList;
          this.titleList = res.data.data.titleList;
          this.total = res.data.data.pagination.total;
          this.showTable = false;
          this.$nextTick(() => {
            this.showTable = true;
          })
        })
      },
      //备注设置
      setAuditRemark(data) {
        setAuditRemark({
          auditRemark: data.auditRemark,
          id: data.id
        }).then(res => {
        })
      },
      //全部审核通过
      passAll() {
        this.$confirm('是否全部审核通过?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$message({
            type: 'success',
            message: '操作成功!'
          });
          passAll({
            id: this.checkInfo.id,
            taskId: this.checkInfo.taskId,
            auditState: 3
          }).then(res => {
            this.$router.push('performanceCheck')
          })
        }).catch(() => {
        })
      },
      //驳回
      rejectTask() {
        let flag = this.tableData.some(v => v.auditRemark);
        if (flag) {
          this.$confirm('退回后,考核员需根据审核意见修改重新上传', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$message({
              type: 'success',
              message: '已驳回成功!'
            });
            rejectTask({
              id: this.checkInfo.id
            }).then(res => {
              this.$router.back()
            })
          }).catch(() => {})
        } else {
          this.$confirm('退回操作,请至少对一名教师填写审核意见,其他人审核意见默认为空', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {}).catch(() => {})
        }
      },
      //分页操作
      handleSizeChange(val) {
        this.pageSize = val;
        this.queryReportUserByReportId()
      },
      handleCurrentChange(val) {
        this.pageNo = val;
        this.queryReportUserByReportId()
      }
    }
  }
</script>

<style lang="scss" scoped>
  .check_wrap {
    padding: 12px;

    .header {
      margin-bottom: 10px;
    }
  }
</style>
