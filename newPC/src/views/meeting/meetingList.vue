<template>
  <div class="meetingList">
    <div class="header">
      <el-row>
        <el-col :span="19">
          <el-button type="primary" size="medium" @click="jumpTo('meetingAdd')">新建会议</el-button>
          <el-button type="danger" size="medium"   @click="deleteMoreHandler">删除</el-button>
        </el-col>
        <el-col :span="5">
          <el-input class="search-input"
                    placeholder="会议主题" icon="search" size="medium" @keyup.enter.native="handleInputChange"
                    v-model.trim="listQuery.theme">
              <el-button slot="append" icon="el-icon-search" @click="handleInputChange"></el-button>
          </el-input>
        </el-col>
      </el-row>
    </div>
    <div class="main-wrap">
      <el-table
        ref="multipleTable"
        :data="meetingList"
        :height="maxH"
        v-loading="listLoading"
        border stripe
        style="width: 100%"
        @selection-change="handleSelectionChange">
        <el-table-column
          type="selection"
          width="55" :selectable="selectable">
        </el-table-column>
        <el-table-column
          label="标题" show-overflow-tooltip width="200">
          <template slot-scope="scope">
            <span class="link-type" @click="jumpTo('meetingDetail',{id:scope.row.id})">
                {{ scope.row.theme }}
            </span>
          </template>
        </el-table-column>
        <el-table-column
          label="创建人"
          width="100">
          <template slot-scope="scope">{{ scope.row.createUserName }}</template>
        </el-table-column>
        <el-table-column
          label="创建时间" show-overflow-tooltip>
          <template slot-scope="scope">{{ scope.row.createTime|filterTime }}</template>
        </el-table-column>
        <el-table-column
          label="开始时间" show-overflow-tooltip>
          <template slot-scope="scope">{{ scope.row.startTime|filterStartTime }}</template>
        </el-table-column>
        <el-table-column
          label="会议地点" show-overflow-tooltip>
          <template slot-scope="scope">{{ scope.row.place }}</template>
        </el-table-column>
        <el-table-column
          label="会议状态">
          <template slot-scope="scope">
            <el-tag  size="mini" type="warning" v-if="scope.row.status==0">未发布</el-tag>
            <el-tag  size="mini" type="success" v-if="scope.row.status==1">已发布</el-tag>
            <el-tag  size="mini" type="warning" v-if="scope.row.status==2">未开始</el-tag>
            <el-tag  size="mini" v-if="scope.row.status==3">进行中</el-tag>
            <el-tag  size="mini" type="info" v-if="scope.row.status==4">已结束</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          label="会议类型">
          <template slot-scope="scope">
            <span v-if="scope.row.meetingType==0">单次会议</span>
            <span v-if="scope.row.meetingType==1">常规例会</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="160" align="center">
          <template slot-scope="scope">
            <div v-if="scope.row.meetingType==0">
              <el-button size="small" type="text" @click="jumpTo('meetingEdit',{id:scope.row.id})" :disabled="scope.row.status!==0">
                  编辑
              </el-button>
              <el-button size="small" type="text" @click="deleteHandler(scope.row.id)" :disabled="scope.row.status!==0" class="buttontextred">
                  删除
              </el-button>
            </div>
            <div v-if="scope.row.meetingType==1">
              <el-button size="small" type="text" @click="jumpTo('meetingEdit',{id:scope.row.id})">
                  编辑
              </el-button>
              <el-button size="small" type="text" @click="deleteHandler(scope.row.id)" :disabled="scope.row.status!==0" class="buttontextred">
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
import {getMeetingPageList,deleteMeeting} from '@/api/metting';
export default {
  data(){
    return{
      meetingList:[],
      listQuery:{
        pageNo:1,
        pageSize:20,
        status:0,
        theme:''
      },
      total:null,
      listLoading:false,
      multipleSelection: []
    }
  },
  created(){
    this.getMeetingPageListFunc();
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
    handleInputChange:_.debounce(
        function () {
          this.listQuery.pageNo=1;
           this.getMeetingPageListFunc();
        },
        // 这是我们为用户停止输入等待的毫秒数
        500
    ),
    jumpTo(path,query={}){
      this.$router.push({
        path,
        query
      })
    },
    deleteMoreHandler(){
      //多个删除
      if (this.multipleSelection && this.multipleSelection.length) {
        this.$confirm('是否删除所选会议？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(() => {
            let arr = this.multipleSelection.map(obj => {
                return obj.id
            });
            this.delMettingFunc(arr.toString());
        }).catch(() => {
            this.$message({
                type: 'info',
                message: '已取消删除'
            });
        });
      }else{
        this.$message({
            message: '请选择要删除的会议!',
            type: 'warning'
        });
      }
    },
    selectable(row) {
        // 判断复选框是否可选
      if((row.meetingType==0&&row.status==0)||(row.meetingType==1&&row.status==0)){
        return true;
      }
       //return row.homeworkState === 1;
    },
    deleteHandler(id){
      //单个删除
      this.$confirm('是否删除该会议？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.delMettingFunc(id);
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });          
      });
    },
    delMettingFunc(id){
      deleteMeeting({
        meetingIds:id
      }).then(res => res.data).then(data=>{
        if(data.code===200){
          this.$message({
            message: '删除成功',
            type: 'success'
          });
          this.getMeetingPageListFunc();
        }
      }).catch(() => {});
    },
    handleSizeChange(val){
      this.listQuery.pageNo=1;
      this.listQuery.pageSize=val;
      this.getMeetingPageListFunc();
    },
    handleCurrentChange(val){
      this.listQuery.pageNo=val;
      this.getMeetingPageListFunc();
    },
    handleSelectionChange(val){
      this.multipleSelection = val;
    },    
    getMeetingPageListFunc(){
      //列表
      this.listLoading=true;
      getMeetingPageList({
        pageNo:this.listQuery.pageNo,
        pageSize:this.listQuery.pageSize,
        status:this.listQuery.status,
        theme:this.listQuery.theme
      }).then(res=>res.data).then(data=>{
        if(data.code===200){
          this.listLoading=false;
          let meetingData=data.data;
          this.meetingList=meetingData.dataList;
          if(this.meetingList.length==0&&this.listQuery.pageNo!==1){
            this.listQuery.pageNo--;
            this.getMeetingPageListFunc();
          }
          this.total=meetingData.pagination.total;
        }else{
          this.listLoading=false;
        }
      }).catch(()=>{
        this.listLoading=false;
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.meetingList{
  padding:12px;
  box-sizing: border-box;
  .header{
    margin-bottom:10px;
  }
  .main-wrap{
    padding-top: 0px !important;
  }
}
</style>

