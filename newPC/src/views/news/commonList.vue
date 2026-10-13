<template>
  <div class="commonList">
    <div class="header">
      <el-row>
        <el-col :span="19">
          <el-button  size="medium" @click="$router.back()">返回</el-button>
        </el-col>
        <el-col :span="5">
          <el-input class="search-input"
                    placeholder="请输入评论人姓名" icon="search" size="medium" @keyup.enter.native="handleInputChange"
                    v-model.trim="listQuery.searchName">
              <el-button slot="append" icon="el-icon-search" @click="handleInputChange"></el-button>
          </el-input>
        </el-col>
      </el-row>
    </div>
    <div class="main-wrap">
      <el-table
        ref="multipleTable"
        :data="meetingUser"
        :height="maxH"
        v-loading="listLoading"
        border stripe
        style="width: 100%">
        <el-table-column
          label="头像" width="80" show-overflow-tooltip align="center">
          <template slot-scope="scope">
            <span>
              <img :src="scope.row.userAvatar" class="imgSize">
            </span>
          </template>
        </el-table-column>
        <el-table-column
          label="姓名"
          width="140">
          <template slot-scope="scope">{{ scope.row.userName }}</template>
        </el-table-column>
        <el-table-column
          label="评论时间" show-overflow-tooltip>
          <template slot-scope="scope">{{ scope.row.commentDate|filterTime }}</template>
        </el-table-column>
        <el-table-column
          label="内容" show-overflow-tooltip>
          <template slot-scope="scope">{{ scope.row.content }}</template>
        </el-table-column>
        <el-table-column
                label="操作"
                align="center"
                width="160px"
                :resizable="false"
        >
            <template slot-scope="scope">
                <el-button size="small" type="text" @click="deleteHandler(scope.row.id)">删除
                </el-button>
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
import {queryCommentLst,deleteJournalismCommentById} from '@/api/news';
export default {
  data(){
    return{
      meetingUser:[],
      journalismId:this.$route.query.journalismId,
      listQuery:{
        pageNo:1,
        pageSize:20,
        searchName:'',
      },
      total:null,
      listLoading:false,
      timeList:[]
    }
  },
  created(){
  },
  mounted(){
    this.queryCommentLstFunc();
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
    deleteHandler(id){
      this.$confirm('是否确定要删除该新闻', '删除', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
      }).then(() => {
          this.deleteJournalismCommentByIdFunc(id);
      }).catch(() => {
      });
    },
    deleteJournalismCommentByIdFunc(id){
        deleteJournalismCommentById({
            commentId: id
        })
        .then((res) => {
            this.deleteLoading = false;
            const data = res.data;
            if (data.result) {
                this.$message({
                    message: '删除成功',
                    type: 'success'
                });
                this.queryCommentLstFunc();
            } else {
                this.deleteLoading = false;
                this.$message.error('error');
            }
        })
        .catch(() => {
            this.$message.error('error');
        });
    },
    timeChange(val){
      this.listQuery.signDate=val;
      this.queryCommentLstFunc();
    },
    stateChange(val){
      this.listQuery.stateType=val;
      this.queryCommentLstFunc();
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
           this.queryCommentLstFunc();
        },
        // 这是我们为用户停止输入等待的毫秒数
        500
    ),
    handleSizeChange(val){
      this.listQuery.pageNo=1;
      this.listQuery.pageSize=val;
      this.queryCommentLstFunc();
    },
    handleCurrentChange(val){
      this.listQuery.pageNo=val;
      this.queryCommentLstFunc();
    }, 
    queryCommentLstFunc(){
      //列表
      this.listLoading=true;
      queryCommentLst({
        pageNo:this.listQuery.pageNo,
        pageSize:this.listQuery.pageSize,
        journalismId:this.journalismId,
        searchName:this.listQuery.searchName
      }).then(res=>res.data).then(data=>{
        if(data.code===200){
          this.listLoading=false;
          let meetingData=data.data;
          this.meetingUser=meetingData.dataList;
          if(this.meetingUser.length==0&&this.listQuery.pageNo!==1){
            this.listQuery.pageNo--;
            this.queryCommentLstFunc();
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
.commonList{
  padding:12px;
  box-sizing: border-box;
  .header{
    margin-bottom:10px;
  }
  .main-wrap{
    padding-top: 0!important;
    .imgSize{
      width: 25px;
      height: 25px;
    }
  }
}
</style>

