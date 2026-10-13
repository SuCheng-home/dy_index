<template>
  <div style="padding:15px">
    <div style="margin-bottom:10px">
      <el-row>
        <el-col :span="19">
          <el-button @click="$router.back()" size="medium">返回</el-button>
          <template v-if="taskInfo.reportState===1">
            <el-button type="primary" @click="toAddReport" size="medium">新建上报</el-button>
            <el-button type="primary" @click="endReport" size="medium" v-if="tableData && tableData.length">完成上报</el-button>
          </template>
        </el-col>
        <el-col :span="5">
<!--          <el-input placeholder="请输入教师姓名" v-model.trim="listQuery.searchName" size="medium">-->
<!--            <el-button slot="append" icon="el-icon-search" @click="searchIt()"></el-button>-->
<!--          </el-input>-->
        </el-col>
      </el-row>
    </div>
    <el-table :data="tableData" border :height="maxH-1" style="width:100%">
      <el-table-column prop="taskName" label="考核任务"></el-table-column>
      <el-table-column label="考核项">
        <template slot-scope="scope">
          <span>{{ scope.row.itemList | filterItemName }}</span>
        </template>
      </el-table-column>
<!--      <el-table-column label="被考核人员">-->
<!--        <template slot-scope="scope">-->
<!--          {{ scope.row | filterUser }}-->
<!--        </template>-->
<!--      </el-table-column>-->
      <el-table-column prop="auditUserName" label="审核员"></el-table-column>
      <el-table-column prop="createDate" label="上报时间">
        <template slot-scope="scope">
          <span>{{ scope.row.createDate | filterDate }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="desContent" label="状态">
        <template slot-scope="scope">
          <el-tag size="mini" type="warning" v-if="scope.row.state === 1">未提交</el-tag>
          <el-tag size="mini" type="danger" v-else-if="scope.row.state === 2 && scope.row.auditState === 2">驳回</el-tag>
          <el-tag size="mini" type="success" v-else-if="scope.row.state === 2 && scope.row.auditState === 3">已通过</el-tag>
          <el-tag size="mini" v-else-if="scope.row.state === 2 && scope.row.auditState === 1">未审核</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="text" @click="goWritePerformance(scope.row.id)" v-if="scope.row.state === 1 || (scope.row.state === 2 && scope.row.auditState === 2)">填报绩效</el-button>
          <el-button type="text" @click="goWritePerformance(scope.row.id)" v-else>查看</el-button>
          <el-button type="text" style="color:red" size="medium" v-if="scope.row.state === 1" @click="deleteReport(scope.row.id)" class="buttontextred">删除</el-button>
          <el-button type="text" size="medium"  v-else-if="scope.row.state === 2 && scope.row.auditState === 1" @click="cancelReportPerformanceAssess(scope.row.id)">撤回</el-button>
          <el-button type="text" size="medium" v-else-if="scope.row.state === 2 && scope.row.auditState === 3" @click="goEditPerformance(scope.row)">修改绩效</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
  import {
    getReportByRelativeId,
    deleteReport,
    submitRecord,
    finishReport,
    cancelReportPerformanceAssess
  } from '@/api/performance'
  import mixin from '@/mixins/windowResize'

  export default {
    name: 'reportList',
    data() {
      return {
        taskRelativeId: this.$route.query.taskRelativeId,
        userId: this.$route.query.userId,
        taskId: this.$route.query.taskId,
        taskInfo: {},
        isEdit: false,
        useDataList: '',
        ids: [],
        editInfo: '',
        teacherOptions: [],
        testOptions: [],
        editTitle: '添加修改',
        formLabelWidth: '120px',
        flag: true,
        total: '',
        pageSize: 10,
        pageNo: 1,
        editData: {
          itemId: '',
          userId: '',
          remark: '',
          point: '',
          haveRemark: '',
          updatePoint: '',
          updateRemark: '',
          cashScore: '',
          score: '',
          updateScore: '',
          pointType: ''
        },
        editId: '',
        dialogFormVisible: false,
        search: '',
        tableData: [],
        listQuery: {
          pageNo: 1,
          pageSize: 10,
          searchName: '',
          taskId: this.$route.query.taskId,
          haveRemark: ''
        }
      }
    },
    mixins: [mixin],
    filters: {
      filterItemName(val) {
        if (val && val.length) {
          return val.map(i => i.itemName).toString();
        }
        return '--';
      },
      filterDate(date) {
        return date ? date.slice(0, 19) : '--';
      },
      filterUser(val) {
        return '';
      }
    },
    created() {
      this.taskInfo = JSON.parse(sessionStorage.getItem('taskInfo')) || {};
      this.getReportByRelativeId()
    },
    methods: {
      goEditPerformance(data) {
        this.$router.push({
          path: 'editPerformance',
          query: {
            taskId: data.taskId,
            taskRelativeId: data.relativeId,
            reportId: data.id
          }
        })
      },
      toAddReport() {
        this.$router.push({
          path: 'reportSet',
          query: this.$route.query
        })
      },
      endReport() {
        this.$confirm('完成上报后不可新增上报, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          finishReport({
            relativeId: this.taskRelativeId,
            taskId: this.taskId
          }).then(res => {
            if (res.data.code === 200) {
              this.$message({
                type: 'success',
                message: '操作成功!'
              });
              this.getReportByRelativeId();
              this.taskInfo.reportState = 2;
              sessionStorage.setItem('taskInfo', JSON.stringify(this.taskInfo));
            } else {
              this.$message.error(res.data.msg);
            }
          })
        }).catch(() => {})
      },
      // 删除
      deleteReport(id) {
        this.$confirm('此操作将删除该上报, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteReport({
            reportId: id,
            taskId: this.taskId
          }).then(res => {
            this.getReportByRelativeId();
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
          })
        }).catch(() => {})
      },
      // 撤回
      cancelReportPerformanceAssess(id) {
        this.$confirm('此操作将撤回该上报, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          cancelReportPerformanceAssess({
            reportId: id,
          }).then(res => {
            this.getReportByRelativeId();
            this.$message({
              type: 'success',
              message: '撤回成功!'
            })
          })
        }).catch(() => {})
      },
      // 路由填报绩效
      goWritePerformance(reportId) {
        this.$router.push({
          path: 'writePerformance',
          query: {
            ...this.$route.query,
            ...{
              reportId: reportId
            }
          }
        })
      },
      getReportByRelativeId() {
        getReportByRelativeId({
          relativeId: this.taskRelativeId
        }).then(res => {
          this.tableData = res.data.data
        })
      },
      handleSelectionChange(val) {
        console.log(val);
        this.ids = [];
        val.forEach(v => {
          this.ids.push(v.id)
        })
      },
      submitIt() {
        if (this.ids.length == 0) {
          this.$message({
            type: 'warning',
            message: '请勾选数据!'
          });
          return
        }
        this.$confirm('是否提交至审核?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            submitRecord({
              ids: this.ids.toString()
            }).then(res => {
              this.$message({
                type: 'success',
                message: '提交成功!'
              });
              this.getReportByRelativeId()
            })
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '已取消操作'
            })
          })
      },
      searchIt() {
        this.listQuery.pageNo = 1;
        this.getReportByRelativeId()
      },
      //编辑考核项
      openEdit(args) {
        this.isEdit = true;
        this.editId = args.id;
        this.editInfo = args;
        this.editData.remark = args.remark;
        this.editData.point = args.point;
        this.editData.updatePoint = args.updatePoint;
        this.editData.updateRemark = args.updateRemark;
        this.editData.updateScore = args.updateScore;
        this.editData.cashScore = args.cashScore;
        this.editData.pointType = args.pointType;
        this.editData.score = args.score;
        this.editData.userId = args.userId;
        this.editData.itemId = args.itemId
      },
      //分页操作
      handleSizeChange(val) {
        this.listQuery.pageNo = 1;
        this.listQuery.pageSize = val;
        this.getReportByRelativeId()
      },
      handleCurrentChange(val) {
        this.listQuery.pageNo = val;
        this.getReportByRelativeId()
      }
    }
  }
</script>

<style lang="scss" scoped>
  /deep/ .el-dialog {
    width: 600px;
  }
</style>
