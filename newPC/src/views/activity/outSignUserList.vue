<template>
  <div class="signUserList">
    <div class="header">
      <el-row>
        <el-col :span="19">
          <el-button  size="medium" @click="$router.back()">返回</el-button>
          <template>
            <el-select v-model="listQuery.stateType" placeholder="请选择签到状态"  size="medium"   @change="stateChange">
              <el-option label="全部签到状态" :value="0"></el-option>
              <el-option v-for="statusItem in statusList" :key="statusItem.id" :label="statusItem.signNo" :value="statusItem.id">
                </el-option>
            </el-select>
          </template>
          <a :href="exportUrl" download="导出结果" target="_blank"  v-if="meetingUser.length">
              <el-button type="primary" size="medium" icon="upload">导出签到统计</el-button>
          </a>
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
          label="头像" width="80" show-overflow-tooltip align="center">
          <template slot-scope="scope">
            <span>
              <img :src="scope.row.avatar" class="imgSize">
            </span>
          </template>
        </el-table-column>
        <el-table-column
          label="姓名" align="center">
          <template slot-scope="scope">{{ scope.row.realName }}</template>
        </el-table-column>
        <el-table-column
          label="手机号" align="center">
          <template slot-scope="scope">{{ scope.row.realMobile }}</template>
        </el-table-column>
        <el-table-column
          label="所在省份" align="center">
          <template slot-scope="scope">{{ scope.row.city }}</template>
        </el-table-column>
        <el-table-column
          label="所在单位" align="center">
          <template slot-scope="scope">{{ scope.row.unit }}</template>
        </el-table-column>
        <el-table-column
          label="签到时间" show-overflow-tooltip align="center">
          <template slot-scope="scope">{{ scope.row.signTime|filterTime }}</template>
        </el-table-column>
        <el-table-column
          label="签到场次" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.signNo}}</span>
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
import {getActivitySignTimeList,getActivitySignUserPageList,getWxsmpActivitySignPageList} from '@/api/activity';
export default {
  data(){
    return{
      activityId:this.$route.query.activityId,
      activityTitle:this.$route.query.activityTitle,
      signTimeId:this.$route.query.signTimeId,
      activityType:this.$route.query.activityType,
      listQuery:{
        pageNo:1,
        pageSize:20,
        searchName:'',
        stateType:0,
        signNo:''
      },
      statusList:[],
      total:0,
      listLoading:false,
      meetingUser:[],
      exportUrl: ''
    }
  },
  created(){
    this.meetingUser=[];
    this.listQuery.stateType=Number(this.signTimeId);
    this.getActivitySignTimeListFunc();
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
      getWxsmpActivitySignPageList({
        activityId:this.activityId,
        pageNo:this.listQuery.pageNo,
        pageSize:this.listQuery.pageSize,
        signTimeId:this.listQuery.stateType,
        userName:this.listQuery.searchName
      }).then(res=>res.data).then(data=>{
        if(data.code===200){
          this.listLoading=false;
          let meetingData=data.data;
          this.meetingUser=meetingData.dataList;
          this.total=meetingData.pagination.total;
          this.exportUrl = `${global.BasePath}structure/activity/downloadWxsmpSignXls?token=${this.$store.getters.token}&activityId=${this.activityId}&signNo=${this.listQuery.signNo}&signTimeId=${this.listQuery.stateType}`;
        }else{
          this.listLoading=false;
        }
      }).catch(()=>{
        this.listLoading=false;
      })
     
    },
    getActivitySignTimeListFunc(){
      getActivitySignTimeList({
        activityId:this.activityId
      }).then(res=>res.data)
      .then(data=>{
        if(data.code===200){
          this.statusList=data.data;
        }
      }).catch(()=>{
        this.$message({
            message: `${data.msg}`,
            type: 'warn'
        });
      })
    },
    stateChange(val){
      if(val==0){
        this.listQuery.stateType=val;
        this.listQuery.signNo=0;
        this.twoTypeFunc();
      }else{
        this.listQuery.stateType=val;
        let stateItem=this.statusList.find(item=>item.id==this.listQuery.stateType);
        this.listQuery.signNo=stateItem.signNo;
        this.twoTypeFunc();
      }
      
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
