<template>
  <div class="taskList">
      <div class="header">
          <el-row>
              <el-col :span="19">
                  <el-button type="primary" size="medium" @click="jumpTo('taskAdd')">发布任务</el-button>
                  <el-button type="danger" size="medium"   @click="deleteMoreHandler">删除</el-button>
              </el-col>
              <el-col :span="5">
                  <el-input class="search-input"
                            placeholder="任务主题" icon="search" size="medium" @keyup.enter.native="handleInputChange"
                            v-model.trim="listQuery.theme">
                      <el-button slot="append" icon="el-icon-search" @click="handleInputChange"></el-button>
                  </el-input>
              </el-col>
          </el-row>
      </div>
      <div class="main-wrap">
          <el-table
              ref="multipleTable"
              :data="taskList"
              :height="nobottommaxH - 25"
              v-loading="listLoading"
              border stripe
              style="width: 100%"
              @selection-change="handleSelectionChange">
              <el-table-column align="center"
                               type="selection"
                               width="55" :selectable="selectable">
              </el-table-column>
              <el-table-column
                  label="任务主题" show-overflow-tooltip width="200">
                  <template slot-scope="scope">
                <span class="link-type" @click="jumpTo('taskDetail',{id:scope.row.id})">
                    {{ scope.row.title }}
                </span>
                  </template>
              </el-table-column>
              <el-table-column align="center"
                               label="已完成人数"
                               width="100">
                  <template slot-scope="scope">
                <span v-if="scope.row.type==0">
                  <span class="link-type" @click="jumpTo('getStuFinishCount',{id:scope.row.id})" v-if="scope.row.finishCount!==0">
                    {{ scope.row.finishCount }}
                  </span>
                  <span v-else>{{ scope.row.finishCount }}</span>
                </span>
                      <span v-else>
                   <span class="link-type" @click="jumpTo('getTeaFinishCount',{id:scope.row.id})" v-if="scope.row.finishCount!==0">
                    {{ scope.row.finishCount }}
                    </span>
                    <span v-else>{{ scope.row.finishCount }}</span>
                </span>
                  </template>
              </el-table-column>
              <el-table-column align="center"
                               label="未完成人数" show-overflow-tooltip width="100">
                  <template slot-scope="scope">
                <span v-if="scope.row.type==0">
                  <span class="link-type" @click="jumpTo('getStuUnfinishCount',{id:scope.row.id})" v-if="scope.row.unfinishCount!==0">
                    {{ scope.row.unfinishCount }}
                  </span>
                  <span v-else>{{ scope.row.unfinishCount }}</span>
                </span>
                      <span v-if="scope.row.type==1">
                  <span class="link-type" @click="jumpTo('getTeaUnfinishCount',{id:scope.row.id})" v-if="scope.row.unfinishCount!==0">
                      {{ scope.row.unfinishCount }}
                  </span>
                  <span v-else>{{ scope.row.unfinishCount }}</span>
                </span>
                  </template>
              </el-table-column>
              <el-table-column align="center"
                               label="发布时间" show-overflow-tooltip>
                  <template slot-scope="scope">
                <span v-if="scope.row.taskState==1">
                  --
                </span>
                      <span v-else-if="scope.row.taskState==2">
                  {{ scope.row.releaseDateTime|filterTime }}
                </span>
                  </template>
              </el-table-column>
              <el-table-column
                  label="班级" align="center" show-overflow-tooltip>
                  <template slot-scope="scope">
                <span v-if="scope.row.type==0">
                  {{scope.row.departName}}
                </span>
                      <span v-else-if="scope.row.type==1">
                  --
                </span>
                  </template>
              </el-table-column>
              <el-table-column
                  label="任务类型" align="center" show-overflow-tooltip>
                  <template slot-scope="scope">
                <span v-if="scope.row.type==0">
                  学生任务
                </span>
                      <span v-else-if="scope.row.type==1">
                  教师任务
                </span>
                  </template>
              </el-table-column>
              <el-table-column
                  label="状态" align="center">
                  <template slot-scope="scope">
                      <el-tag  size="mini" type="warning" v-if="scope.row.taskState==1">未发布</el-tag>
                      <el-tag  size="mini" v-else >已发布</el-tag>
                  </template>
              </el-table-column>
              <el-table-column label="操作" width="160" align="center">
                  <template slot-scope="scope">
                      <div>
                          <el-button size="small" type="text" @click="jumpTo('taskEdit',{id:scope.row.id})"
                                     :disabled="scope.row.taskState!==1">
                              编辑
                          </el-button>
                          <el-button size="small" type="text" @click="deleteHandler(scope.row.id)" :disabled="scope.row.taskState!==1" class="buttontextred">
                              删除
                          </el-button>
                      </div>
                  </template>
              </el-table-column>
          </el-table>
          <el-pagination
              class="pagination-container"
              v-show="!listLoading"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page.sync="listQuery.pageNo"
              :page-sizes="[10,20,30, 50]"
              :page-size="listQuery.pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="total">
          </el-pagination>
      </div>
  </div>
</template>

<script>
import mixin from '@/mixins/windowResize';
import _ from 'lodash';
import {getCreateTaskPageList,getTeacherTaskPageList,deleteTask} from '@/api/task';
export default {
  data(){
    return{
      listQuery:{
        theme:'',
        pageNo:1,
        pageSize:20
      },
      total:0,
      multipleSelection: [],
      taskList:[],
      listLoading:false
    }
  },
  created(){
    this.getCreateTaskPageListFunc();
    
  },
  mixins:[
    mixin
  ],
  mounted(){

  },
  filters:{
    filterTime(date){
      return date?date.slice(0,19):''
    },
    filterStartTime(date){
      return date?date.slice(0,16):''
    }
  },
  methods:{
    getCreateTaskPageListFunc(){
      //列表
      this.listLoading=true;
      getCreateTaskPageList({
        pageNo:this.listQuery.pageNo,
        pageSize:this.listQuery.pageSize,
        searchName:this.listQuery.theme,
        taskState:0
      }).then(res=>res.data).then(data=>{
        if(data.code===200){
          this.listLoading=false;
          let activityData=data.data;
          this.taskList=activityData.dataList;
          if(this.taskList.length==0&&this.listQuery.pageNo!==1){
            this.listQuery.pageNo--;
            this.getCreateTaskPageListFunc();
          }
          this.total=activityData.pagination.total;
        }else{
          this.listLoading=false;
        }
      }).catch(()=>{
        this.listLoading=false;
      })
    },
    jumpTo(path,query={}){
      this.$router.push({
        path,
        query
      })
    },
    //发布任务
    handleSelectionChange(val){
      this.multipleSelection = val;
    },   
    deleteMoreHandler(){
      //多个删除
      if (this.multipleSelection && this.multipleSelection.length) {
        this.$confirm('是否删除所选任务？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(() => {
            let arr = this.multipleSelection.map(obj => {
                return obj.id
            });
            this.delTaskFunc(arr.toString());
        }).catch(() => {
            this.$message({
                type: 'info',
                message: '已取消删除'
            });
        });
      }else{
        this.$message({
            message: '请选择要删除的任务!',
            type: 'warning'
        });
      }
    },
    deleteHandler(id){
      //单个删除
      this.$confirm('是否删除该任务？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.delTaskFunc(id);
      }).catch(() => {
              
      });
    },
    delTaskFunc(id){
      deleteTask({
        taskIds:id
      }).then(res => res.data).then(data=>{
        if(data.code===200){
          this.$message({
            message: '删除成功',
            type: 'success'
          });
          this.getCreateTaskPageListFunc();
        }
      }).catch(() => {});
    },
    selectable(row) {
      if(row.taskState==1){
        return true;
      }
    },
    handleSizeChange(val){
      this.listQuery.pageNo=1;
      this.listQuery.pageSize=val;
      this.getCreateTaskPageListFunc();
    },
    handleCurrentChange(val){
      this.listQuery.pageNo=val;
      this.getCreateTaskPageListFunc();
    },
    handleInputChange:_.debounce(
      function () {
        this.listQuery.pageNo=1;
        this.getCreateTaskPageListFunc();
      },
      // 这是我们为用户停止输入等待的毫秒数
      500
    )
  }
}
</script>

<style lang="scss" scoped>
.taskList{
  padding: 12px;
  box-sizing: border-box;
  .header{
    margin-bottom:10px;
  }
  .main-wrap{
    padding-top: 0px !important;
  }
}
</style>
<style lang="scss">
.taskList .search-input{
  margin:0;
}
</style>
