<template>
  <div class="taskList">
      <div class="header">
          <el-row>
              <el-col :span="19">
                  &nbsp;
              </el-col>
              <el-col :span="5">
                  <el-input class="search-input"
                            placeholder="任务主题" icon="search" size="medium" @keyup.enter.native="handleInputMyChange"
                            v-model.trim="listQueryMy.theme">
                      <el-button slot="append" icon="el-icon-search" @click="handleInputMyChange"></el-button>
                  </el-input>
              </el-col>
          </el-row>
      </div>
      <div class="main-wrap">
          <el-table
              ref="multipleTable"
              :data="mytaskList"
              :height="nobottommaxH - 25"
              v-loading="myListLoading"
              border stripe
              style="width: 100%">
              <el-table-column
                  label="任务主题" show-overflow-tooltip width="200">
                  <template slot-scope="scope">
                <span class="link-type" @click="jumpTo('myTaskDetail',{id:scope.row.id})">
                    {{ scope.row.title }}
                </span>
                  </template>
              </el-table-column>
              <el-table-column align="center"
                               label="发布人" show-overflow-tooltip>
                  <template slot-scope="scope">{{ scope.row.createUser}}</template>
              </el-table-column>
              <el-table-column align="center"
                               label="发布时间" show-overflow-tooltip>
                  <template slot-scope="scope">{{ scope.row.releaseDateTime|filterTime }}</template>
              </el-table-column>
              <el-table-column
                  label="完成状态" align="center">
                  <template slot-scope="scope">
                      <el-tag  size="mini" type="warning" v-if="scope.row.taskState==1">未完成</el-tag>
                      <el-tag  size="mini"  v-else-if="scope.row.taskState==2">已完成</el-tag>
                  </template>
              </el-table-column>
          </el-table>
          <el-pagination
              class="pagination-container"
              v-show="!myListLoading"
              @size-change="handleSizeChangeMy"
              @current-change="handleCurrentChangeMy"
              :current-page.sync="listQueryMy.pageNo"
              :page-sizes="[10,20,30, 50]"
              :page-size="listQueryMy.pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="totalMy">
          </el-pagination>
      </div>
  </div>
</template>

<script>
import mixin from '@/mixins/windowResize';
import _ from 'lodash';
import {getTeacherTaskPageList} from '@/api/task';
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
      listLoading:false,
      mytaskList:[],
      myListLoading:false,
      listQueryMy:{
        pageNo:1,
        pageSize:20,
        theme:''
      },
      totalMy:0
    }
  },
  created(){
    this.getTeacherTaskPageListFunc();
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
    
    jumpTo(path,query={}){
      this.$router.push({
        path,
        query
      })
    },
    //我的任务
    handleInputMyChange:_.debounce(
      function () {
        this.listQueryMy.pageNo=1;
        this.getTeacherTaskPageListFunc();
      },
      // 这是我们为用户停止输入等待的毫秒数
      500
    ),
    getTeacherTaskPageListFunc(){
      //列表
      this.myListLoading=true;
      getTeacherTaskPageList({
        pageNo:this.listQueryMy.pageNo,
        pageSize:this.listQueryMy.pageSize,
        searchName:this.listQueryMy.theme
      }).then(res=>res.data).then(data=>{
        if(data.code===200){
          this.myListLoading=false;
          let activityData=data.data;
          this.mytaskList=activityData.dataList;
          if(this.mytaskList.length==0&&this.listQueryMy.pageNo!==1){
            this.listQueryMy.pageNo--;
            this.getTeacherTaskPageListFunc();
          }
          this.totalMy=activityData.pagination.total;
        }else{
          this.myListLoading=false;
        }
      }).catch(()=>{
        this.myListLoading=false;
      })
    },
    handleSizeChangeMy(val){
      this.listQueryMy.pageNo=1;
      this.listQueryMy.pageSize=val;
      this.getTeacherTaskPageListFunc();
    },
    handleCurrentChangeMy(val){
      this.listQueryMy.pageNo=val;
      this.getTeacherTaskPageListFunc();
    },
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
