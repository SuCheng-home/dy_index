<template>
  <div class="calendar-list-container">
    <div class="body">
      <div class="main-top-title">
      <h2>用户统计</h2>
    </div>
    <div class="header clearfix">
      <el-radio-group class="daysBtn" size="medium" v-model="listQuery.days" @change="daysChange">
        <el-radio-button label="7">7天</el-radio-button>
        <el-radio-button label="14">14天</el-radio-button>
        <el-radio-button label="30">30天</el-radio-button>
      </el-radio-group>
      <div class="daysBtn ">
        <el-date-picker size="medium" class="btnLeftLine" v-model.trim="listQuery.startDate" type="date" value-format="yyyy-MM-dd"  placeholder="请选择开始日期"> </el-date-picker>  
        <el-date-picker size="medium" class="btnLeftLine" v-model.trim="listQuery.endDate" type="date"  placeholder="请选择结束日期" value-format="yyyy-MM-dd"> </el-date-picker>  
        <el-button type="primary btnLeftLine" size="medium" @click="userTotalHandler">搜索</el-button>
      </div>
    </div>
    <div class="userCount" id="userCount"></div>
    <!--登录-->
    <div class="main-top-title">
      <h2>用户登录统计</h2>
    </div>
    <div class="header clearfix">
      <el-radio-group class="daysBtn" size="medium" v-model="loginQuery.days" @change="loginChange">
        <el-radio-button label="7">7天</el-radio-button>
        <el-radio-button label="14">14天</el-radio-button>
        <el-radio-button label="30">30天</el-radio-button>
      </el-radio-group>
      <div class="daysBtn ">
        <el-date-picker class="btnLeftLine" size="medium" v-model.trim="loginQuery.startDate" type="date" value-format="yyyy-MM-dd"  placeholder="请选择开始日期"> </el-date-picker>  
        <el-date-picker class="btnLeftLine" size="medium" v-model.trim="loginQuery.endDate" type="date"  placeholder="请选择结束日期" value-format="yyyy-MM-dd"> </el-date-picker>  
        <el-button type="primary btnLeftLine" size="medium"  @click="loginTotalHandler">搜索</el-button>
      </div>
    </div>
    <div class="loginCount" id="loginCount"></div>
     <div class="main-top-title">
        <h2>用户关注率</h2>
      </div>
    <!--用户关注率-->
    <div class="box-san">       
      <div class="userRate" id="userRate"></div>
    </div> 
    <!--教师关注率-->
    <div class="box-san">       
        <div class="teacherRate" id="teacherRate"></div>
    </div>    
    <!--家长关注率-->
    <div class="box-san">    
    <div class="parentRate" id="parentRate"></div>
    </div>
    </div>
  </div>
</template>
<script>
import echarts from 'echarts';
import {statisticsSchool,getUserCount,getUserLoginCount} from '@/api/system';
export default{
  data(){
    return{
      listQuery:{
        days:null,
        startDate:'',
        endDate:''
      },
      loginQuery:{
        days:null,
        startDate:'',
        endDate:''
      },
      attendUsers:[],
      notAttendUsers:[],
      attendParentUsers:[],
      notAttendParentUsers:[],
      attendTeacherUsers:[],
      notAttendTeacherUsers:[],
      userTime:[],

      loginTotal:[],
      loginUsersTotal:[],
      loginPCTotal:[],
      loginPCUsersTotal:[],
      loginMobileTotal:[],
      loginMobileUsersTotal:[],
      loginTime:[],

      PieattendUsers:null,
      PienotAttendUsers:null,
      PieattendTeacherUsers:null,
      PienotAttendTeacherUsers:null,
      PieattendParentUsers:null,
      PienotAttendParentUsers:null,
      userCounts:null,
      userLogins:null,
      userRates:null,
      teacherRates:null,
      parentRates:null,
    }
  },
  created(){
    this.listQuery.days=7;
    this.loginQuery.days=7;
    this.statisticsSchoolFunc();
  },
  mounted(){

  },
  methods:{
    getUserLoginCountFunc(logindays){
      /*用户登录统计动态查询*/
      this.loginTotal=[];
      this.loginUsersTotal=[];
      this.loginPCTotal=[];
      this.loginPCUsersTotal=[];
      this.loginMobileTotal=[];
      this.loginMobileUsersTotal=[];
      this.loginTime=[];
      var This=this;
      getUserLoginCount({
        days:logindays?this.loginQuery.days:"-"+this.loginQuery.days,
        startDate:this.loginQuery.startDate,
        endDate:this.loginQuery.endDate
      }).then(res=>res.data)
      .then(data=>{
        if(data.code===200){
          let userLoginCountList=data.data;
          if(userLoginCountList&&userLoginCountList.length!==0){
            userLoginCountList.forEach((item,index)=>{
              this.loginTotal.push(item.loginTotal);
              this.loginUsersTotal.push(item.loginUsersTotal);
              this.loginPCTotal.push(item.loginPCTotal);
              this.loginPCUsersTotal.push(item.loginPCUsersTotal);
              this.loginMobileTotal.push(item.loginMobileTotal);
              this.loginMobileUsersTotal.push(item.loginMobileUsersTotal);
              this.loginTime.push(item.createTime);
              This.userLoginFunc();
            })
          }
        }
      })
    },
    getUserCountFunc(listdays){
      /*用户数据统计动态查询*/
      this.attendUsers=[];
      this.notAttendUsers=[];
      this.attendParentUsers=[];
      this.notAttendParentUsers=[];
      this.attendTeacherUsers=[];
      this.notAttendTeacherUsers=[];
      this.userTime=[];
      var This=this;
      getUserCount({
        days:listdays?this.listQuery.days:"-"+this.listQuery.days,
        startDate:this.listQuery.startDate,
        endDate:this.listQuery.endDate
      }).then(res=>res.data)
      .then(data=>{
        if(data.code===200){
          let userCountList=data.data;
          if(userCountList&&userCountList.length!==0){
            userCountList.forEach((item,index)=>{
              this.attendUsers.push(item.attendUsers);
              this.notAttendUsers.push(item.notAttendUsers);
              this.attendParentUsers.push(item.attendParentUsers);
              this.notAttendParentUsers.push(item.notAttendParentUsers);
              this.attendTeacherUsers.push(item.attendTeacherUsers);
              this.notAttendTeacherUsers.push(item.notAttendTeacherUsers);
              this.userTime.push(item.createTime);
            })
            This.userCountFunc();
          }
        }
      })
    },
    parentRateFunc(){
      this.parentRates = echarts.init(document.getElementById('parentRate'));
      this.parentRates.setOption({
            title : {
            text: '智慧校园家长用户关注率',
            x:'center'
        },
        tooltip : {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        color: ['#7CB5EC', '#434348'],//每个区域的颜色
        series : [
            {
                name: '家长用户关注情况',
                type: 'pie',
                radius : '40%',
                center: ['50%', '55%'],
                data:[
                    {value:this.PieattendParentUsers, name:'已关注'},
                    {value:this.PienotAttendParentUsers, name:'未关注'}
                ],
                label: { normal: { formatter: '{b}:{c}人 ({d}%) '}},
                itemStyle: {
                    emphasis: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }
        ]
      })
    },
    teacherRateFunc(){
      this.teacherRates = echarts.init(document.getElementById('teacherRate'));
      this.teacherRates.setOption({
            title : {
            text: '智慧校园教师用户关注率',
            x:'center'
        },
        tooltip : {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        color: ['#7CB5EC', '#434348'],//每个区域的颜色
        series : [
            {
                name: '教师用户关注情况',
                type: 'pie',
                radius : '40%',
                center: ['50%', '55%'],
                data:[
                    {value:this.PieattendTeacherUsers, name:'已关注'},
                    {value:this.PienotAttendTeacherUsers, name:'未关注'}
                ],
                label: { normal: { formatter: '{b}:{c}人 ({d}%) '}},
                itemStyle: {
                    emphasis: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }
        ]
      })
    },
    userRateFunc(){
      this.userRates = echarts.init(document.getElementById('userRate'));
      this.userRates.setOption({
            title : {
            text: '智慧校园用户关注率',
            x:'center'
        },
        tooltip : {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        color: ['#7CB5EC', '#434348'],//每个区域的颜色
        series : [
            {
                name: '用户关注情况',
                type: 'pie',
                radius : '40%',
                center: ['50%', '55%'],
                data:[
                    {value:this.PieattendUsers, name:'已关注',selected:true},
                    {value:this.PienotAttendUsers, name:'未关注'}
                ],
                label: { normal: { formatter: '{b}:{c}人 ({d}%) '}},
                itemStyle: {
                    emphasis: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }
        ]
      })
    },
    userCountFunc(){
      this.userCounts = echarts.init(document.getElementById('userCount'));
      let aa={
          interval:0
        };
      if(this.userTime.length>14){
        aa.rotate=35;
      }else{
        aa.rotate=0;
      }
      this.userCounts.setOption({
        title: {
          text: '用户统计',
          x: 'center' 
        },
        tooltip: {
            trigger: 'axis'
        },
        color: [
          "#BEDAF6",
          "#818FA0",
          "#7CB5EC",
          "#5C5C61",
          "#90ED7D",
          "#F15C80"
        ],
        legend: {
          x: "center",
          y: "bottom",
          data:['已关注的总用户数','未关注的总用户数','已关注老师数','未关注老师数','已关注家长数','未关注家长数']
        },
        grid: {
            left: '3%',
            right: '6%',
            bottom: '7%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: this.userTime,
            axisLabel:aa
        },
        yAxis: {
          name:'人数',
          type: 'value'
        },
        series: [
            {
                name:'已关注的总用户数',
                type:'line',
                data:this.attendUsers
            },
            {
                name:'未关注的总用户数',
                type:'line',
                data:this.notAttendUsers
            },
            {
                name:'已关注老师数',
                type:'line',
                data:this.attendTeacherUsers
            },
            {
                name:'未关注老师数',
                type:'line',
                data:this.notAttendTeacherUsers
            },
            {
                name:'已关注家长数',
                type:'line',
                data:this.attendParentUsers
            },
            {
                name:'未关注家长数',
                type:'line',
                data:this.notAttendParentUsers
            }
        ]
      })
    },  
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
      this.getUserCountFunc(listdays);
    },
    loginTotalHandler(){
      if(this.loginQuery.startDate==''){
        this.$message({
            type: 'error',
            message: '开始时间不能为空！'
        });
        return false;
      }
      if(this.loginQuery.endDate==''){
        this.$message({
            type: 'error',
            message: '结束时间不能为空！'
        });
        return false;
      }
      if(this.$moment(this.loginQuery.endDate).format('YYYY-MM-DD')<this.$moment(this.loginQuery.startDate).format('YYYY-MM-DD')){
        this.$message({
            type: 'error',
            message: '开始时间不能大于结束时间！'
        });
        return false;
      }
      this.loginQuery.startDate=this.$moment(this.loginQuery.startDate).format("YYYY-MM-DD");
      this.loginQuery.endDate=this.$moment(this.loginQuery.endDate).format("YYYY-MM-DD");
      this.loginQuery.days='';
      let logindays=1;
      this.getUserLoginCountFunc(logindays);
    },
    userLoginFunc(){
      this.userLogins = echarts.init(document.getElementById('loginCount'));
      let aa={
          interval:0
        };
      if(this.loginTime.length>14){
        aa.rotate=35;
      }else{
        aa.rotate=0;
      }
      this.userLogins.setOption({
        title: {
          text: '用户登录统计',
          x: 'center' 
        },
        tooltip: {
            trigger: 'axis'
        },
        color: [
          "#7CB5EC",
          "#5C5C61",
          "#90ED7D",
          "#F7A35C",
          "#8085E9",
          "#F15C80"
        ],
        legend: {
          x: "center",
          y: "bottom",
          data:['总次数','总用户数','PC总次数','Mobile总次数','PC总用户数','Mobile总用户数']
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
            data: this.loginTime,
            axisLabel:aa
        },
        yAxis: {
          name:'人数',
          type: 'value'
        },
        series: [
            {
                name:'总次数',
                type:'line',
                data:this.loginTotal
            },
            {
                name:'总用户数',
                type:'line',
                data:this.loginUsersTotal
            },
            {
                name:'PC总次数',
                type:'line',
                data:this.loginPCTotal
            },
            {
                name:'Mobile总次数',
                type:'line',
                data:this.loginMobileTotal
            },
            {
                name:'PC总用户数',
                type:'line',
                data:this.loginPCUsersTotal
            },
            {
                name:'Mobile总用户数',
                type:'line',
                data:this.loginMobileUsersTotal
            }
        ]
      })
    },
    daysChange(val){
      if(val==''||val==null){
        
      }else{
        this.listQuery.days=val;
        this.listQuery.startDate='';
        this.listQuery.endDate='';
        this.getUserCountFunc();
      }
    },
    loginChange(val){
      if(val==''||val==null){

      }else{
        this.loginQuery.days=val;
        this.loginQuery.startDate='';
        this.loginQuery.endDate='';
        this.getUserLoginCountFunc();
      }
    },
    statisticsSchoolFunc(){
      let This=this;
      this.attendUsers=[];
      this.notAttendUsers=[];
      this.attendParentUsers=[];
      this.notAttendParentUsers=[];
      this.attendTeacherUsers=[];
      this.notAttendTeacherUsers=[];
      this.userTime=[];
      this.loginTotal=[];
      this.loginUsersTotal=[];
      this.loginPCTotal=[];
      this.loginPCUsersTotal=[];
      this.loginMobileTotal=[];
      this.loginMobileUsersTotal=[];
      this.loginTime=[];
      statisticsSchool().then(res=>res.data)
      .then(data=>{
        if(data.code===200){
          let userCount=data.data.userCount;
          let userLogin=data.data.userLogin;
          let attentionRate=data.data.attentionRate;
          if(userCount&&userCount.length!==0){
            userCount.forEach((item,index)=>{
              this.attendUsers.push(item.attendUsers);
              this.notAttendUsers.push(item.notAttendUsers);
              this.attendParentUsers.push(item.attendParentUsers);
              this.notAttendParentUsers.push(item.notAttendParentUsers);
              this.attendTeacherUsers.push(item.attendTeacherUsers);
              this.notAttendTeacherUsers.push(item.notAttendTeacherUsers);
              this.userTime.push(item.createTime);
            })
          }
          if(userLogin&&userLogin.length!==0){
            userLogin.forEach((item,index)=>{
              this.loginTotal.push(item.loginTotal);
              this.loginUsersTotal.push(item.loginUsersTotal);
              this.loginPCTotal.push(item.loginPCTotal);
              this.loginPCUsersTotal.push(item.loginPCUsersTotal);
              this.loginMobileTotal.push(item.loginMobileTotal);
              this.loginMobileUsersTotal.push(item.loginMobileUsersTotal);
              this.loginTime.push(item.createTime);
            })
          }
          if(Object.keys(attentionRate).length!==0){
            this.PieattendUsers=attentionRate.attendUsers;
            this.PienotAttendUsers=attentionRate.notAttendUsers;
            this.PieattendTeacherUsers=attentionRate.attendTeacherUsers;
            this.PienotAttendTeacherUsers=attentionRate.notAttendTeacherUsers;
            this.PieattendParentUsers=attentionRate.attendParentUsers;
            this.PienotAttendParentUsers=attentionRate.notAttendParentUsers;
          }
          This.userCountFunc();
          This.userLoginFunc();
          This.userRateFunc();
          This.teacherRateFunc();
          This.parentRateFunc();
          
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.box-san{
  width: 33%;
  float: left;
}
.body{
  height: 100%;
  width: 100%;
  overflow: auto;
  padding:12px;
}
.main-top-title{
  margin: 20px 0;
  width:100%;
  text-align: left;
  position: relative;
  box-sizing: border-box;
  h2{
    width:100%;
    height: 40px;
    border: 1px solid #ccc;
    font-size: 16px;
    line-height: 40px;
    font-weight: 700;
    padding-left: 20px;
    background-color: #EEF1F6;
    box-sizing: border-box;
  }
}
.header {
  margin-bottom: 20px;
  .daysBtn{
    float:left;
  }
}
.userCount{
  width:100%;
  height:400px;
  margin-top:20px;
}
.loginCount{
  width:100%;
  height:400px;
  margin-top:20px;
}
.userRate{
  width:100%;
  height:400px;
  margin-top:20px;
}
.teacherRate{
  width:100%;
  height:400px;
  margin-top:20px;
}
.parentRate{
  width:100%;
  height:400px;
  margin-top:20px;
}
.clearfix:after{
  content:'';
  clear: both;
  display: block;
  height:0;
  line-height:0;
  visibility: hidden;
}
</style>