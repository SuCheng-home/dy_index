<template>
  <div class="app-container">
    <div class="header">
      <el-row>
        <el-col :span="24">
          <el-button type="default" size="medium" @click="goback()">返回</el-button>
        </el-col>
      </el-row>
    </div>
    <div class="module-main" :style="`height: ${nobottommaxH}px;`">
      <div class="examTotal clearfix">
        <el-radio-group class="daysBtn" size="medium" v-model="listQuery.days" @change="daysChange">
          <el-radio-button label="7">7天</el-radio-button>
          <el-radio-button label="14">14天</el-radio-button>
          <el-radio-button label="30">30天</el-radio-button>
        </el-radio-group>
        <div class="daysBtn ">
          <el-date-picker class="btnLeftLine" size="medium" v-model.trim="listQuery.startDate" type="date" value-format="yyyy-MM-dd"  placeholder="请选择开始日期"> </el-date-picker>  
          <el-date-picker class="btnLeftLine" size="medium" v-model.trim="listQuery.endDate" type="date"  placeholder="请选择结束日期" value-format="yyyy-MM-dd"> </el-date-picker>  
          <el-button type="primary btnLeftLine" size="medium"  @click="userTotalHandler">搜索</el-button>
        </div>
      </div>
      <div class="examCount" id="examCount"></div>
      <div class="userCont-wrap">
       <div class="userCount" id="userCount"></div>
       <a :href="exportURL" download="导出结果" target="_blank"  class="exportBtn">
          <el-button class="filter-item" type="primary" size="medium" >导出</el-button>
      </a>
      </div>
    </div>
  </div>
</template>
<script>
import echarts from 'echarts';
import mixin from "@/mixins/windowResize";
import {statisticsList} from '@/api/system';
export default{
  data(){
    return{
      moduleCode:this.$route.query.moduleCode,
      modulename:this.$route.query.modulename,
      listQuery:{
        days:7,
        startDate:'',
        endDate:''
      },
      useCountData:[],
      userTotalData:[],
      exportURL:'',
      days:''
    }
  },
  mixins: [mixin],
  created(){
    this.listQuery.days=7;
    this.statisticsListFunc();
  },
  mounted(){
  },
  methods:{
    userTotalHandler(){
      if(this.listQuery.startDate==''){
        this.$message({
            type: 'error',
            message: '开始时间不能为空！'
        });
        return false;
      }
      if(this.listQuery.endDate==''){
        this.$message({
            type: 'error',
            message: '结束时间不能为空！'
        });
        return false;
      }
      if(this.$moment(this.listQuery.endDate).format('YYYY-MM-DD')<this.$moment(this.listQuery.startDate).format('YYYY-MM-DD')){
        this.$message({
            type: 'error',
            message: '开始时间不能大于结束时间！'
        });
        return false;
      }
      this.listQuery.startDate=this.$moment(this.listQuery.startDate).format("YYYY-MM-DD");
      this.listQuery.endDate=this.$moment(this.listQuery.endDate).format("YYYY-MM-DD");
      this.listQuery.days='';
      let listdays=1;
      this.statisticsListFunc(listdays);
    },
    daysChange(val){
      if(val==''){

      }else{
         this.listQuery.days=val;
        this.listQuery.startDate='';
        this.listQuery.endDate='';
        this.statisticsListFunc();
      }
    },
    statisticsListFunc(listdays){
      this.days=listdays?this.listQuery.days:'-'+this.listQuery.days;
      statisticsList({
        days:this.days,
        startDate:this.listQuery.startDate,
        endDate:this.listQuery.endDate,
        moduleCode:this.moduleCode
      }).then(res=>res.data)
      .then(data=>{
        if(data.code===200){
          let moduleDataStatistics=data.data.moduleDataStatistics;
          let highchartsColumnList=data.data.highchartsColumnList;
          this.moduleDataStatistics(moduleDataStatistics);
          this.highchartsColumnList(highchartsColumnList);
          this.exportURL=global.BasePath+'modulestatistics/exportModuleDataStatisticsUserList?moduleCode='+this.moduleCode+'&startDate='+this.listQuery.startDate+'&endDate='+this.listQuery.endDate+'&days='+this.days+'&token='+this.$store.getters.token;
        }
      })
    },
    moduleDataStatistics(array){
      this.useCountData=echarts.init(document.getElementById('examCount'));
      const chartOption={
        title: {
          text: this.modulename+'使用统计',
          x: 'center' 
        },
        tooltip: {
            trigger: 'axis'
        },
        color: [
          "#7CB5EC",
          "#90ED7D"
        ],
        legend: {
          x: "center",
          y: "bottom",
          data:['创建','阅读']
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '7%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data:array.map(item=>{
              return item.statisticDate
            })
        },
        yAxis: {
          name:'次数',
          type: 'value'
        },
        series: [
            {
                name:'创建',
                type:'line',
                data:array.map(item=>{
                  return item.creationCount
                })
            },
            {
                name:'阅读',
                type:'line',
                data:array.map(item=>{
                  return item.readerCount
                })
            }
        ]
      };
      this.useCountData.setOption(chartOption);
    },
    highchartsColumnList(array){
      this.userTotalData = echarts.init(document.getElementById('userCount'));
      this.userTotalData.setOption({
        title: {
          text: this.modulename+'用户使用统计',
          x: 'center' 
        },
        tooltip : {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow',
                label: {
                    show: true
                }
            }
        },
        color:["#7CB5EC"],
        calculable : true,
        grid: {
            top: '15%',
            left: '3%',
            right: '6%',
            containLabel: true
        },
        xAxis: [
            {
                type : 'category',
                splitLine: {show:false},
                data : array.map(item=>{
                  return item.name
                })
            }
        ],
        yAxis: [
            {   
                name:'次数',
                type : 'value'      
            }
        ],
        dataZoom: [
            {
                type:'slider',
                show: true,
                start: 0,
                end: 100
            }
        ],
        series : [
            {
                name: '创建数量',
                type: 'bar',
                label: {
                    normal: {
                        show: true,
                        position: 'top'
                    }
                },
                
                data: array.map(item=>{
                  return item.y
                })
            }
        ]
      })
    },
    goback(){
      this.$router.push({
        path:'index'
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.header{
  border-bottom: 1px solid #e7eaec;
  padding-bottom:10px;
}
.module-main{
  overflow: auto;
}
.examTotal{
  padding-top:20px;
}
.clearfix:after{
  content: '';
  display: block;
  clear: both;
  visibility: hidden;
  height:0;
}
.daysBtn{
  float:left;
}
.examCount{
  width:100%;
  height:400px;
  margin-top:20px;
}
.userCount{
  width:100%;
  height:400px;
  margin-top:20px;
}
.userCont-wrap{
  position: relative;
}
.exportBtn{
  position: absolute;
  left:50%;
  top:-5px;
  z-index:999;
  margin-left:120px;
}
</style>
