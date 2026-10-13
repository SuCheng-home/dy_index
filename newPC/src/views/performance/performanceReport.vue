<template>
  <div>
    <div style="padding:12px 12px 10px 12px;overflow: hidden;">
      <el-input placeholder="请输入考核任务" style="float:right;width:350px" v-model="search" class="input-with-select"
                size="medium">
        <el-button slot="append" @click="searchIt()" icon="el-icon-search"></el-button>
      </el-input>
    </div>
    <div class="tableArea" style="padding:0 12px">
      <el-table :data="tableData" border :height="maxH-1" style="width:100%">
        <el-table-column label="考核任务">
          <template slot-scope="scope">
						<span
              style="margin-left: 10px;overflow: hidden;
              text-overflow:ellipsis;
              white-space: nowrap;"
            >
							{{ scope.row.taskName }}
						</span>
          </template>
        </el-table-column>
        <el-table-column label="类型" width="180">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.typeName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="考核时间" width="240">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.assessDate }}</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" width="180">
          <template slot-scope="scope">
            <el-tag size="mini" type="info" v-if="scope.row.state === 1" plain>未上报</el-tag>
            <el-tag size="mini" type="success" key=""
                    v-if="scope.row.state === 2 && scope.row.auditState !== 2 && scope.row.auditState !== 3" plain>已上报
            </el-tag>
            <el-tag size="mini" type="danger" v-if="scope.row.state === 2 && scope.row.auditState === 2" plain>驳回
            </el-tag>
            <el-tag size="mini" type="success" v-if="scope.row.state === 2 && scope.row.auditState === 3" plain>同意
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180">
          <template slot-scope="scope">
            <el-button type="text" @click="goReportSet(scope.row)">{{scope.row.state === 2 ? '查看' : '上报'}}</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div style="position:absolute;bottom:30px;padding-left:15px">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                     :page-sizes="[10, 20, 30, 40]" :page-size="10" layout="total, sizes, prev, pager, next, jumper"
                     :total="total"></el-pagination>
    </div>
  </div>
</template>

<script>
  import {getReportTaskList, cancelAppearPerformanceAssess} from '@/api/performance'
  import mixin from '@/mixins/windowResize'

  export default {
    data() {
      return {
        pageNo: 1,
        pageSize: 10,
        total: '',
        formInline: {
          user: '',
          region: ''
        },
        search: '',
        tableData: []
      }
    },
    filters: {
      filterDate(date) {
        return date ? date.slice(0, 19) : '';
      }
    },
    created() {
      this.getReportTaskList()
    },
    mixins: [mixin],
    methods: {
      searchIt() {
        this.pageNo = 1;
        this.getReportTaskList()
      },
      //获取任务列表
      getReportTaskList() {
        getReportTaskList({
          pageNo: this.pageNo,
          pageSize: this.pageSize,
          searchName: this.search
        }).then(res => {
          this.tableData = res.data.data.dataList;
          this.total = res.data.data.pagination.total;
        })
      },
      goReportSet(data) {
        sessionStorage.setItem('taskInfo', JSON.stringify(data));
        this.$router.push({
          path: 'reportList',
          query: {
            taskId: data.taskId,
            taskRelativeId: data.id,
            userId: data.userId,
            state: data.state
          }
        })
      },
      //分页操作
      handleSizeChange(val) {
        this.pageNo = 1;
        this.pageSize = val;
        this.getReportTaskList()
      },
      handleCurrentChange(val) {
        this.pageNo = val;
        this.getReportTaskList()
      }
    }
  }
</script>

<style scoped></style>
