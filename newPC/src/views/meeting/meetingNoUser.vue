<template>
  <div class="meetingUser">
    <div class="header">
      <el-row>
        <el-col :span="19">
          <el-button type="default" size="medium" @click="$router.back()">返回</el-button>
          <template v-if="isCanAskLeav==1">
            <el-select v-model="listQuery.stateType" placeholder="请选择签到状态"  size="medium"   @change="stateChange">
              <el-option v-for="statusItem in statusList" :key="statusItem.code" :label="statusItem.value" :value="statusItem.code">
                </el-option>
            </el-select>
          </template>
          <template v-if="meetingType==1">
            <el-select v-model="listQuery.signDate" placeholder="请选择会议日期"  size="medium"   @change="timeChange">
              <el-option v-for="statusItem in timeList" :key="statusItem.signDate" :label="statusItem.signDate" :value="statusItem.signDate">
                </el-option>
            </el-select>
          </template>
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
        :data="meetingUser"
        :height="maxH"
        v-loading="listLoading"
        border stripe
        style="width: 100%">
        <el-table-column
          label="头像" width="120" show-overflow-tooltip align="center">
          <template slot-scope="scope">
            <span>
              <img :src="scope.row.avatar" class="imgSize">
            </span>
          </template>
        </el-table-column>
        <el-table-column
          label="姓名" width="120">
          <template slot-scope="scope">{{ scope.row.userName }}</template>
        </el-table-column>
        <el-table-column
          label="手机号" width="200">
          <template slot-scope="scope">{{ scope.row.mobile }}</template>
        </el-table-column>
        <el-table-column
          label="单位/部门" show-overflow-tooltip>
          <template slot-scope="scope">{{ scope.row.departName }}</template>
        </el-table-column>
        <el-table-column
          label="签到状态" width="140" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.signStatus==0">缺勤</span>
            <span v-else-if="scope.row.signStatus==1">请假/未审核</span>
            <span v-else-if="scope.row.signStatus==2">请假/审核通过</span>
            <span v-else-if="scope.row.signStatus==3">请假/审核不通过</span>
            <span v-else>缺勤</span>
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
import {getMeetingSignDateList,getNotSignUserPageList} from '@/api/metting';
export default {
  data(){
    return{
      meetingUser:[],
      meetingId:this.$route.query.id,
      meetingType:this.$route.query.meetingType,
      isCanAskLeav:this.$route.query.isCanAskLeav,
      listQuery:{
        pageNo:1,
        pageSize:20,
        stateType:0,
        searchName:'',
        signDate:''
      },
      statusList:[
        {
          code:0,
          value:"全部状态"
        },
        {
          code:1,
          value:"缺勤"
        },
        {
          code:2,
          value:"请假/未审核"
        },
        {
          code:3,
          value:"请假/审核不通过"
        },
        {
          code:4,
          value:"请假/审核通过"
        },
      ],
      total:null,
      listLoading:false,
      timeList:[]
    }
  },
  created(){
  },
  mounted(){
    if(this.meetingType==1){
      this.getMeetingSignDateListFunc();
    }else{
      this.getNotSignUserPageListFunc();
    }
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
    timeChange(val){
      this.listQuery.signDate=val;
      this.getNotSignUserPageListFunc();
    },
    stateChange(val){
      this.listQuery.stateType=val;
      this.getNotSignUserPageListFunc();
    },
    getMeetingSignDateListFunc(){
      getMeetingSignDateList({
        meetingId:this.meetingId
      }).then(res=>res.data)
      .then(data=>{
        if(data.code===200){
          this.timeList=data.data;
          if(this.meetingType==1){
            this.listQuery.signDate=this.timeList[0].signDate;
            this.getNotSignUserPageListFunc();
          }
        }
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
           this.getNotSignUserPageListFunc();
        },
        // 这是我们为用户停止输入等待的毫秒数
        500
    ),
    handleSizeChange(val){
      this.listQuery.pageNo=1;
      this.listQuery.pageSize=val;
      this.getNotSignUserPageListFunc();
    },
    handleCurrentChange(val){
      this.listQuery.pageNo=val;
      this.getNotSignUserPageListFunc();
    }, 
    getNotSignUserPageListFunc(){
      //列表
      this.listLoading=true;
      getNotSignUserPageList({
        pageNo:this.listQuery.pageNo,
        pageSize:this.listQuery.pageSize,
        stateType:this.listQuery.stateType,
        meetingId:this.meetingId,
        signDate:this.listQuery.signDate,
        searchName:this.listQuery.searchName
      }).then(res=>res.data).then(data=>{
        if(data.code===200){
          this.listLoading=false;
          let meetingData=data.data;
          this.meetingUser=meetingData.dataList;
          if(this.meetingUser.length==0&&this.listQuery.pageNo!==1){
            this.listQuery.pageNo--;
            this.getNotSignUserPageListFunc();
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
.meetingUser{
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

