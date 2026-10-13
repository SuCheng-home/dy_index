<template>
  <div class="schoolTotal">
    <div class="header">
      <el-row>
        <el-col :span="24">
          <el-button  @click="goBack" type="default" size="medium">返回</el-button>
        </el-col>
      </el-row>
    </div>
    <div class="schoolWrap scrollStyle" :style="`height:${nobottommaxH}px`">
      <div class="title"><span class="square"></span>汇总</div>
      <div class="text">
        <h3>总计上报荣誉&nbsp;&nbsp;{{AllTotal}}</h3>
        <div class="gradeList clearfix">
          <ul>
            <li v-for="(gradeItem,gradeIndex) in HonorGradeChar" :key="gradeIndex"> 
              <span class="title">{{gradeItem.name}}:</span>
              <span class="text">{{gradeItem.y}}</span>
            </li>
          </ul>
        </div>
        <div class="picBox clearfix">
          <div class="picItem honourAllChar" id="honourAllChar">
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import mixins from '@/mixins/windowResize';
import echarts from 'echarts';
import {getSchoolHonorClassTypeChar} from '@/api/honour/index';
export default {
  data(){
    return{
      startDate:this.$route.query.startDate,
      endDate:this.$route.query.endDate,
      honorTypeId:this.$route.query.honorTypeId,
      schoolTimeId:this.$route.query.schoolTimeId,
      gradeId:this.$route.query.gradeId,
      AllTotal:0,
      HonorGradeChar:[],
      honourAllChars:null
    }
  },
  created(){
    this.getSchoolHonorClassTypeCharFunc();
  },
  mounted(){

  },
  mixins:[mixins],
  methods:{
    ModuleGradeCharFunc(array){
      this.honourAllChars = echarts.init(document.getElementById('honourAllChar'));
      this.honourAllChars.setOption({
            title : {
                text: '荣誉等级分布图',
                textStyle: {
                  fontSize: 18,
                  color: '#333',

                  width: '100%'
                },
                x:'center'
            },
            tooltip : {
                trigger: 'item',
                formatter: "{a} <br/>{b} :{d}%"
            },
            color: [
              "#7CB5EC","#434348","#90ED7D","#F7A35C","#8085E9","#F15C80"
            ],
            legend: {
                x : 'center',
                y : 'bottom',
                data: array.map(item=>{return item.name})
            },
            series : [
                {
                    name: '',
                    type: 'pie',
                    radius : '50%',
                    center: ['45%', '50%'],
                    data:array.map(item=>({
                      value:item.y,
                      name:item.name
                    })),
                    label: { normal: { formatter: '{b}:{c}'}},
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
      this.honourAllChars.on("click",this.honourAllDetail);
    },
    honourAllDetail(params){
      let classId=this.HonorGradeChar[params.dataIndex].id;
      if(classId){
        this.$router.push({
            path: 'classHonorList',
            query: {classId:classId,honorTypeId: this.honorTypeId,gradeId: this.gradeId,schoolTimeId:this.schoolTimeId,startDate:this.startDate,endDate:this.endDate}
        });
      }
    },
    getSchoolHonorClassTypeCharFunc(){
      getSchoolHonorClassTypeChar({
        startDate:this.startDate,
        endDate:this.endDate,
        honorTypeId:this.honorTypeId,
        schoolTimeId:this.schoolTimeId,
        gradeId:this.gradeId
      }).then(res=>res.data)
      .then(data=>{
        if(data.code===200){
          this.HonorGradeChar=data.data;
          let aa=this.HonorGradeChar.map(item=>item.y);
          this.AllTotal=aa.reduce(function(prev,next){
            return prev+next
          });
          this.ModuleGradeCharFunc(this.HonorGradeChar);
            //this.classCode=this.classList[0].id;
        }
      })
    },
    goBack(){
      //this.$router.back();
      this.$router.push({
        path:'gradeStatistics',
        query:{
          schoolTimeId:this.schoolTimeId,
          startDateNew:this.startDate,
          endDateNew:this.endDate
        }
      })
    }, 
  }
}
</script>
<style lang="scss" scoped>
.clearfix:after{
    content:'';
    display: block;
    height:0;
    clear: both;
    visibility: hidden;
}
.schoolTotal{
  padding:12px;
  box-sizing: border-box;
  font-size:14px;
  .header{
    padding-bottom:10px;
    border-bottom:1px solid  #e7eaec;
    
  }
  .schoolWrap{
    overflow-x: hidden;
    overflow-y: auto;
    padding-top:10px;
    box-sizing: border-box;
    .title{
      line-height:34px;
      height:34px;
      .square{
        display: inline-block;
        width:10px;
        height:10px;
        background: #ACD6FF;
        margin: 15px 8px 0 0;
      }
    }
    .text{
      padding-left:18px;
      box-sizing: border-box;
      h3{
        font-size:16px;
      }

    }
  }
  .gradeList{
    width:100%;
    li{
      float:left;
      font-size:15px;
      margin-right:15px;
      .title{
      }
      .text{
        padding-left:0;
      }
    }
  }
  .picBox{
    padding-top:30px;
    padding-bottom:30px;
    .picItem{
      width:800px;
      height:460px;
      margin:0 auto;
    }
  }
}
</style>

