<template>
  <div class="app-container">
    <div class="">
      <el-row style="padding-bottom:10px">
        <el-col :span="24">
          <el-button size="medium" @click="$router.back()">返回</el-button>
        </el-col>
      </el-row>
    </div>
    <div>
      <el-table stripe :data="list" v-loading.body="listLoading" border fit highlight-current-row
                ref="mainTable" :height="nobottommaxH">

        <el-table-column prop="title" label="名称" width="150">
          <template slot-scope="scope">
            <router-link :to="{ path: 'homeworkStatisDetail',query:{id:scope.row.id}}">
              <span class="link-type">{{scope.row.title}}作业</span>
            </router-link>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip label="班级/学生">
          <template slot-scope="scope">
            <span>{{!scope.row.className? scope.row.stuNames:scope.row.className}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="releaseDateTime" align="center" width="130" label="发布时间">
          <template slot-scope="scope">
            <span>{{scope.row.releaseDateTime === undefined ? "暂未发布" : scope.row.releaseDateTime|formatTimeMap}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="status" align="center" label="状态" width="100">
          <template slot-scope="scope">
            <el-tag  size="mini" :type="scope.row.homeworkState === 1?'gray':'success'">
              {{scope.row.homeworkState|statusMap}}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="readCount" align="center" label="已读人数" width="100">
          <template slot-scope="scope">
            <span v-if="scope.row.readCount === 0">{{scope.row.readCount}}</span>
            <span v-else class="link-type"
                  @click="jumpToList(scope.row.id, 0)">{{scope.row.readCount}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="unReadCount" align="center" label="未读人数" width="100">
          <template slot-scope="scope">
            <span v-if="scope.row.homeworkState !== 2">0</span>
            <span v-else>
                              <span v-if="scope.row.unReadCount === 0">{{scope.row.unReadCount}}</span>
                        <span v-else class="link-type"
                              @click="jumpToList(scope.row.id, 2)">{{scope.row.unReadCount}}</span>
                        </span>

          </template>
        </el-table-column>
        <el-table-column prop="finishCount" align="center" label="提交人数" width="100">
          <template slot-scope="scope">
            <span v-if="scope.row.finishCount === 0">{{scope.row.finishCount}}</span>
            <span v-else class="link-type">
                            <a
                              href="javascript:" @click="homeworkFinishHandle(scope.row,1)"
                            >
                                {{scope.row.finishCount}}
                            </a>
                        </span>

          </template>
        </el-table-column>
        <el-table-column prop="replyCount" align="center" label="回复条数" width="100">
          <template slot-scope="scope">
            <span v-if="scope.row.replyCount===0">{{scope.row.replyCount}}</span>
            <span v-else class="link-type"
                  @click="jumpToList(scope.row.id, 1)">{{scope.row.replyCount}}</span>
          </template>
        </el-table-column>
      </el-table>

      <div v-show="!listLoading" class="pagination-container">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="pageNo"
          :page-sizes="[10,20,30, 50]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        >
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
  import {getPubHomeworkList, getHomeworkById} from '@/api/homework';
  import mixin from '@/mixins/windowResize';

  const statusMap = {
    1: "草稿",
    2: "已发布",
  };
  export default {
    data: function () {
      return {
        currUserId: this.$route.query.id,
        startTime: this.$route.query.startTime,
        endTime: this.$route.query.endTime,
        list: null,
        total: 0,
        listLoading: true,
        pageNo: 1,
        pageSize: 20
      }
    },
    mixins: [mixin],
    created() {
      this.list = [];
      this.getPubHomeworkListFunc();
    },
    filters: {
      statusMap(type) {
        return statusMap[type]
      },
      formatTimeMap(type) {
        if (type.indexOf("-") === -1) {
          return "暂未发布"
        } else {
          return type.substring(0, 10)
        }

      }
    },
    methods: {
      homeworkFinishHandle(homework, type) {
        getHomeworkById({
          homeworkId: homework.id
        }, sessionStorage.getItem("homeworkschoolTimeId"))
          .then(res => res.data)
          .then(data => {
            this.sendClass = data.data.departs;
            if (homework.publishType === 0 && homework.walkClassIds.length == 0 && this.sendClass && this.sendClass.length !== 1) {
              this.$router.push({
                path: 'homeworkClassList',
                query: {
                  type: type,
                  homeworkId: homework.id,
                  statis: 1
                }
              })
            } else {
              this.$router.push({
                path: 'homeworkManageFinishList',
                query: {
                  type: type,
                  homeworkId: homework.id,
                  statis: 1
                }
              })
            }
          }).catch(() => {
          this.$message({
            message: data.msg,
            type: 'warning'
          });
        })
      },
      jumpToList(id, type) {
        this.$router.push({
          path: 'homeworkManageReplyList',
          query: {
            homeworkId: id,
            type,
            statis: 1
          }
        });
      },
      getPubHomeworkListFunc() {
        this.listLoading = true;
        getPubHomeworkList({
          pageNo: this.pageNo,
          pageSize: this.pageSize,
          currUserId: this.currUserId,
          startTime: this.startTime,
          endTime: this.endTime,
        }, sessionStorage.getItem("homeworkschoolTimeId")).then(res => res.data)
          .then(data => {
            if (data.code === 200) {
              const tableData = data.data;
              this.list = tableData.dataList;
              this.total = tableData.pagination.total;
              this.listLoading = false;
            }
          })
      },
      handleSizeChange(val) {
        this.pageNo = 1;
        this.pageSize = val;
        this.getPubHomeworkListFunc();
      },
      handleCurrentChange(val) {
        this.pageNo = val;
        this.getPubHomeworkListFunc();
      }
    }
  }
</script>
<style lang="scss" scoped>
  .redColor {
    color: red;
  }

  .filter-item {
    margin-left: 5px;
  }

  .recipe_img_wrapper img {
    width: 200px;
  }
</style>
