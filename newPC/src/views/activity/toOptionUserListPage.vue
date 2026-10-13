<template>
  <div class="toOptionUserListPage">
    <div class="header">
      <el-row>
        <el-col :span="24">
          <el-button size="medium" type="default" @click="$router.back()">返回</el-button>
          <template>
            <el-select v-model="listQuery.stateType" placeholder="请选择签到状态"  size="medium"   @change="stateChange">
              <el-option label="全部签到状态" :value="0"></el-option>
              <el-option v-for="statusItem in statusList" :key="statusItem.id" :label="statusItem.optionName" :value="statusItem.id">
                </el-option>
            </el-select>
          </template>
          <div v-if="topicName" class="topicName">
            {{topicName}}
          </div>
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
          label="姓名" align="center" width="160">
          <template slot-scope="scope">{{ scope.row.userName }}</template>
        </el-table-column>
        <el-table-column
          label="联系方式" align="center">
          <template slot-scope="scope">{{ scope.row.mobile }}</template>
        </el-table-column>
        <el-table-column
          label="选项" show-overflow-tooltip align="center">
          <template slot-scope="scope">{{ scope.row.optionName }}</template>
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
import {getActivityResearchInfo,getResearchUserPageList} from '@/api/activity';
export default {
  data(){
    return{
      activityId:this.$route.query.activityId,
      optionId:this.$route.query.optionId,
      listQuery:{
        pageNo:1,
        pageSize:20,
        stateType:0,
      },
      statusList:[],
      total:0,
      listLoading:false,
      meetingUser:[],
      exportUrl: '',
      topicName:''
    }
  },
  created(){
    this.meetingUser=[];
    this.listQuery.stateType=Number(this.optionId);
    this.getActivityResearchInfoFunc();
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
      getResearchUserPageList({
        activityId:this.activityId,
        pageNo:this.listQuery.pageNo,
        pageSize:this.listQuery.pageSize,
        optionId:this.listQuery.stateType,
      }).then(res=>res.data).then(data=>{
        if(data.code===200){
          this.listLoading=false;
          let meetingData=data.data;

          this.meetingUser=meetingData.dataList;
          this.total=meetingData.pagination.total;
        }else{
          this.listLoading=false;
        }
      }).catch(()=>{
        this.listLoading=false;
      })
    },
    getActivityResearchInfoFunc(){
      getActivityResearchInfo({
        activityId:this.activityId
      }).then(res=>res.data)
      .then(data=>{
        if(data.code===200&&data.data){
          const statusData=data.data;
          this.topicName=statusData.topicName;
          if(statusData.topicOptionList&&statusData.topicOptionList.length!==0){  
            this.statusList=statusData.topicOptionList;
          }
        }
      }).catch(()=>{
        this.$message({
            message: `${data.msg}`,
            type: 'warn'
        });
      })
    },
    stateChange(val){
      this.listQuery.stateType=val;
      this.twoTypeFunc();
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
.toOptionUserListPage{
  padding:12px;
  box-sizing: border-box;
  .header{
    margin-bottom:10px;
    position: relative;
    .topicName{
      position: absolute;
      left:50%;
      top:0;
      font-size:18px;
      color:#333;
      max-width:540px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      line-height: 40px;
      font-weight: bold;
      transform: translate(-50%,0)
    }
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
.toOptionUserListPage .search-input{
  margin: 0;
}
</style>
