<template>
  <div>
    <div style="padding:12px 12px 10px 12px">
      <el-row>
        <el-col :span="19">
          <el-button type="primary" @click="goNewTask()" size="medium">新建任务</el-button>
        </el-col>
        <el-col :span="5">
          <el-input placeholder="请输入考核任务" v-model="search" class="input-with-select" size="medium">
            <el-button slot="append" @click="searchIt()" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
      </el-row>
    </div>
    <div class="table" style="padding:0 12px;">
      <el-table :data="tableData" border :height="maxH-1" style="width: 100%">
        <el-table-column label="考核任务" show-overflow-tooltip>
          <template slot-scope="scope">
            <span class="taskName" @click="goTaskDetail(scope.row.id)" style="color:#409eff;cursor: pointer;">{{scope.row.taskName}} </span>
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
        <el-table-column label="发布时间">
          <template slot-scope="scope">
            <span>{{ scope.row.createDate | filterDate}}</span>
          </template>
        </el-table-column>
        <el-table-column label="发布状态">
          <template slot-scope="scope">
            <el-tag  size="mini" type="info"  v-if="scope.row.taskState==1" plain>草稿</el-tag>
            <el-tag  size="mini" type="success"  v-else plain>已发布</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="考核状态">
          <template slot-scope="scope">
            <el-tag  size="mini" type="info" key=""  v-if="scope.row.finishState===1" plain>未完成</el-tag>
            <el-tag  size="mini" type="success"  v-else plain>已完成</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <span>
              <el-button type="text" v-if="scope.row.taskState===1" @click="goEdit(scope.row.id)">编辑</el-button>
              <el-button type="text" v-if="scope.row.taskState===1" @click="publishTaskById(scope.row.id)">发布</el-button>
              <el-button type="text" v-if="scope.row.finishState===1 && scope.row.taskState!==1" @click="goCheckList(scope.row)">上报详情</el-button>
              <el-button type="text" v-if="scope.row.finishState===2 && scope.row.taskState!==1" @click="goDetail(scope.row)">考核详情</el-button>
              <el-button type="text" @click="deleteTaskById(scope.row.id)" class="buttontextred">删除</el-button>
            </span>
          </template>
        </el-table-column>
      </el-table>
      <div style="margin-top: 15px;">
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
  </div>
</template>
<script>
  import {getTestList, deleteTaskById, publishTaskById} from '@/api/performance.js'
  import mixin from "@/mixins/windowResize";

  export default {
    data() {
      return {
        pageSize: 10,
        pageNo: 1,
        select: '',
        name: '',
        total: '',
        search: '',
        formInline: {
          user: '',
          region: ''
        },
        tableData: []
      }
    },
    filters: {
      filterDate(date) {
        return date ? date.slice(0, 19) : '';
      }
    },
    created() {
      this.getTestList()
    },
    mixins: [mixin],
    methods: {
      searchIt() {
        this.pageNo = 1;
        this.getTestList()
      },
      goNewTask() {
        this.$router.push('newTask')
      },
      goCheckList(data) {
        this.$router.push(
          {
            path: 'checkListTwo',
            query: {taskId: data.id, taskName: data.taskName}
          })
      },
      goDetail(data) {
        this.$router.push(
          {
            path: 'testDetail',
            query: data
          })
      },
      //获取任务列表
      getTestList() {
        getTestList({
          pageSize: this.pageSize,
          pageNo: this.pageNo,
          searchName: this.search
        }).then(res => {
          this.tableData = res.data.data.dataList;
          this.total = res.data.data.pagination.total
        })
      },
      //根据id删除任务
      deleteTaskById(id) {
        this.$confirm('此操作将永久删除该考核任务, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteTaskById(id).then(res => {
            this.getTestList();
            this.$message({
              type: 'success',
              message: '删除考核任务成功!'
            });
          })
        }).catch(() => {
        });
      },
      //发布任务
      publishTaskById(id) {
        this.$confirm('是否确认发布考核任务, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          publishTaskById({id: id}).then(res => {
            this.getTestList();
            this.$message({
              type: 'success',
              message: '发布考核任务成功!'
            });
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消发布'
          });
        });
      },
      //去编辑页
      goEdit(id) {
        this.$router.push({
          path: 'editTask',
          query: {
            id: id
          }
        })
      },
      goTaskDetail(id) {
        this.$router.push({
          path: 'taskDetail',
          query: {
            id: id
          }
        })
      },
      handleSizeChange(val) {
        this.pageSize = val;
        this.getTestList()
      },
      handleCurrentChange(val) {
        this.pageNo = val;
        this.getTestList()
      }
    }
  }
</script>

<style scoped>
</style>
