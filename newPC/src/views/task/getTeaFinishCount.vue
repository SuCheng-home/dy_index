<template>
  <div class="signUserList">
    <div class="header">
      <el-row>
        <el-col :span="19">
          <el-button size="medium" @click="$router.back()">返回</el-button>
        </el-col>
        <el-col :span="5">
          <el-input class="search-input"
                    placeholder="搜索姓名" icon="search" size="medium" @keyup.enter.native="handleInputChange"
                    v-model.trim="listQuery.searchName">
              <el-button slot="append" icon="el-icon-search" @click="handleInputChange"></el-button>
          </el-input>
        </el-col>
      </el-row>
    </div>
    <div class="main-wrap">
      <el-table
        ref="multipleTable"
        :data="finishList"
        :height="maxH"
        v-loading="listLoading"
        border stripe
        style="width: 100%">
        <el-table-column
          label="教师姓名" align="center">
          <template slot-scope="scope">
            <span class="link-type" @click="jumpTo('myTaskDetail',{id:scope.row.taskId,userId:scope.row.studentId})">
              {{ scope.row.userName }}
            </span>
          </template>
        </el-table-column>
        <el-table-column
          label="联系方式" align="center">
          <template slot-scope="scope">{{ scope.row.mobile }}</template>
        </el-table-column>
        <el-table-column
          label="完成时间" show-overflow-tooltip align="center">
          <template slot-scope="scope">{{ scope.row.submitTime| filterStartTime}}</template>
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
import {getTaskFinishPageList} from '@/api/task';
export default {
  data(){
    return{
      taskId:this.$route.query.id,
      listQuery:{
        pageNo:1,
        pageSize:20,
        searchName:''
      },
      statusList:[],
      total:0,
      listLoading:false,
      finishList:[]
    }
  },
  created(){
    this.finishList=[];
    this.twoTypeFunc();
  },
  mounted(){
    
  },
  mixins:[
    mixin
  ],
  filters:{
    filterTime(date){
      return date?date.slice(0,19):''
    },
    filterStartTime(date){
      return date?date.slice(0,16):''
    }
  },
  methods:{
    twoTypeFunc(){
      this.listLoading=true;
      getTaskFinishPageList({
        taskId:this.taskId,
        pageNo:this.listQuery.pageNo,
        pageSize:this.listQuery.pageSize,
        searchName:this.listQuery.searchName,
        submitStatus:2
      }).then(res=>res.data).then(data=>{
        if(data.code===200){
          this.listLoading=false;
          let meetingData=data.data;
          this.finishList=meetingData.dataList;
          this.total=meetingData.pagination.total;
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
    handleInputChange:_.debounce(
        function () {
          this.listQuery.pageNo=1;
           this.twoTypeFunc();
        },
        // 这是我们为用户停止输入等待的毫秒数
        500
    ),
    handleSizeChange(val){
      this.listQuery.pageNo=1;
      this.listQuery.pageSize=val;
      this.twoTypeFunc();
    },
    handleCurrentChange(val){
      this.listQuery.pageNo=val;
      this.twoTypeFunc();
    }
  }
}
</script>
<style lang="scss" scoped>
.signUserList{
  padding:12px;
  box-sizing: border-box;
  .header{
    margin-bottom:10px;
  }
  .main-wrap{
    padding-top:0 !important;
    .imgSize{
      width: 25px;
      height: 25px;
    }
  }
}
</style>

<style scoped>
.signUserList .search-input{
  margin: 0;
}
</style>
