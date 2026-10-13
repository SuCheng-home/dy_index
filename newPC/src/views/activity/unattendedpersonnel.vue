<template>
  <div class="signUserList">
    <div class="header">
      <el-row>
        <el-col :span="19">
          <el-button type="default" size="medium" @click="$router.back()">返回</el-button>       
          <!-- <a :href="exportUrl" download="导出结果" target="_blank"  v-if="meetingUser.length">
              <el-button type="primary" size="medium" icon="upload">导出未签到人员</el-button>
          </a> -->
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
          <template slot-scope="scope">{{ scope.row.userName }}</template>
        </el-table-column>
        <el-table-column
          label="手机号" align="center">
          <template slot-scope="scope">{{ scope.row.mobile }}</template>
        </el-table-column>
        <el-table-column
          label="单位/部门" show-overflow-tooltip align="center">
          <template slot-scope="scope">{{ scope.row.departName }}</template>
        </el-table-column>
          <el-table-column
          label="签到场次" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.activitySignNo}}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
import mixin from '@/mixins/windowResize';
import _ from 'lodash';
import {getNotSignUserList} from '@/api/activity';
export default {
  data(){
    return{
      activityId:this.$route.query.activityId,
      activityTitle:this.$route.query.activityTitle,
      signTimeId:this.$route.query.signTimeId,
      activityType:this.$route.query.activityType,
      meetingUser:[],
      exportUrl: ''
    }
  },
  created(){
    this.meetingUser=[];
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
        getNotSignUserList({
          activityId:this.activityId,
          signTimeId:this.signTimeId
        }).then(res=>res.data).then(data=>{
          if(data.code===200){
            this.listLoading=false;
            let meetingData=data.data;
            this.meetingUser=meetingData;
            this.exportUrl = `${global.BasePath}structure/activity/downloadSignXls?token=${this.$store.getters.token}&activityId=${this.activityId}&signTimeId=${this.signTimeId}`;
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
