<template>
  <div class="healthTeaTotalList">
    <div class="header">
      <el-row>
        <el-col :span="24">
          <el-button @click="$router.back()" size="medium">返回</el-button>
          <a :href="exportUrl" download="导出结果" v-if="teacherList.length" target="_blank" style="margin-left:10px;">
              <el-button type="primary" size="medium" icon="upload">导出</el-button>
          </a>
          <div class="topTitle">{{day}}教职工体温打卡</div>
        </el-col>
      </el-row>
    </div>
    <div class="main-wrap">
      <el-table
        ref="multipleTable"
        :data="teacherList"
        :height="maxH"
        v-loading="listLoading"
        border stripe
        style="width: 100%">
        <el-table-column
          label="姓名">
          <template slot-scope="scope">
            <span v-if="parseFloat(scope.row.morningTemp)<37.3&&parseFloat(scope.row.noonTemp)<37.3">
              {{ scope.row.teacherName }}
            </span>
            <span class="spanColor" v-if="parseFloat(scope.row.morningTemp)>=37.3||parseFloat(scope.row.noonTemp)>=37.3">
              {{ scope.row.teacherName }}
            </span>
          </template>
        </el-table-column>
        <el-table-column
          label="晨检体温(℃)">
          <template slot-scope="scope">
            <span v-if="parseFloat(scope.row.morningTemp)<37.3">
              {{ scope.row.morningTemp?scope.row.morningTemp +'℃':'--'}}
            </span>
            <span class="spanColor" v-if="parseFloat(scope.row.morningTemp)>=37.3">
              {{ scope.row.morningTemp?scope.row.morningTemp +'℃':'--'}}
            </span>
          </template>
        </el-table-column>
        <el-table-column
          label="午检体温(℃)" show-overflow-tooltip>
          <template slot-scope="scope">
            <span v-if="parseFloat(scope.row.noonTemp)<37.3">
              {{ scope.row.noonTemp?scope.row.noonTemp +'℃':'--'}}
            </span>
            <span class="spanColor" v-if="parseFloat(scope.row.noonTemp)>=37.3">
              {{ scope.row.noonTemp?scope.row.noonTemp +'℃':'--'}}
            </span>
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
import {getSchoolThDayTempPageList} from '@/api/healthNewCheck';
export default {
  data(){
    return{
      day:this.$route.query.day,
      listQuery:{
        pageNo:1,
        pageSize:20
      },
      total:null,
      listLoading:false,
      teacherList:[],
      exportUrl:''
    }
  },
  created(){
    this.getSchoolThDayTempPageListFunc();
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
    jumpTo(path,query={}){
      this.$router.push({
        path,
        query
      })
    },
    handleSizeChange(val){
      this.listQuery.pageNo=1;
      this.listQuery.pageSize=val;
      this.getSchoolThDayTempPageListFunc();
    },
    handleCurrentChange(val){
      this.listQuery.pageNo=val;
      this.getSchoolThDayTempPageListFunc();
    }, 
    getSchoolThDayTempPageListFunc(){
      //列表
      this.listLoading=true;
      getSchoolThDayTempPageList({
        pageNo:this.listQuery.pageNo,
        pageSize:this.listQuery.pageSize,
        day:this.day,
      }).then(res=>res.data).then(data=>{
        if(data.code===200){
          this.listLoading=false;
          let meetingData=data.data;
          this.teacherList=meetingData.dataList;
          if(this.teacherList.length==0&&this.listQuery.pageNo!==1){
            this.listQuery.pageNo--;
            this.getSchoolThDayTempPageListFunc();
          }
          this.total=meetingData.pagination.total;
          this.exportUrl = `${global.BasePath}structure/temperatureReport/exportTeacherTemp?token=${this.$store.getters.token}&reportDate=${this.day}`;
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
.healthTeaTotalList{
  padding:12px;
  box-sizing: border-box;
  .header{
    margin-bottom:10px;
    position: relative;
    .topTitle{
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
  .spanColor{
    color:#f66c6c;
  }
}
</style>

