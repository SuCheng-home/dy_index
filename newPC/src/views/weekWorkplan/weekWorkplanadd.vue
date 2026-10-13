<template>
  <div  class="weekWorkplanadd" style="padding-top: 10px;">  
       <backtool>
          <el-button type="primary" v-if="num==3&&isnum==0"  size="medium" @click="updateSubmitteds(0)">保存草稿</el-button> 
          <el-button type="primary" v-if="num==3&&isnum==0&&!toExamine" size="medium" @click="updateSubmitteds(1)">确认发布</el-button>
          <el-button type="primary" v-if="num==3&&isnum==0&&toExamine" size="medium" @click="updateSubmitteds(2)">提交审核</el-button> 
          <el-button type="primary" v-if="num==3&&(isnum==1||isnum==2)" size="medium"  @click="updateSubmitteds(isnum)">保存修改</el-button>  
          <el-button type="primary" v-if="num==0" size="medium" @click="updateSubmitteds(0)">保存草稿</el-button> 
          <el-button type="primary" v-if="(num==0)&&!toExamine" size="medium"  @click="updateSubmitteds(1)">确认发布</el-button>
          <el-button type="primary" v-if="(num==0)&&toExamine" size="medium"  @click="updateSubmitteds(2)">提交审核</el-button>
          <el-button type="primary" v-if="num==1||num==2" size="medium"  @click="updateSubmitteds(num)">保存修改</el-button>  
        </backtool>
    <div class="subject"   :style="`height: ${nobottommaxH}px;`">  
            <div class="subject-top">
                <div>
                    周次： <el-select v-if="num==3" v-model="datalist.weekId" placeholder="请选择周次" @change="changeWeek()">
                            <el-option :label="item.weekName" :value="item.weekId" :key="index"  v-for="(item,index) in Weeklist"></el-option>
                           </el-select>
                           <span v-if="num!=3">{{weekName}}</span>
                </div>
                <div>日期：{{dayMap.mon}}—{{dayMap.sun}}</div>
                   
            </div>
            <div class="ul">
                <div class="li">
                    <div class="li-top"><span></span>周一
                    （{{dayMap.mon}}）
                    </div>
                    <el-input type="textarea" :rows="4"  placeholder="请输入周一计划"  v-model="datalist.mondayPlan[0].content"></el-input>
                </div>
                <div class="li">
                    <div class="li-top"><span></span>周二
                     （{{dayMap.tue}}）
                    </div>
                    <el-input type="textarea" :rows="4"  placeholder="请输入周二计划"  v-model="datalist.tuesdayPlan[0].content"></el-input>
                </div>
                <div class="li">
                    <div class="li-top"><span></span>周三
                     （{{dayMap.wed}}）
                    </div>
                    <el-input type="textarea" :rows="4"  placeholder="请输入周三计划"  v-model="datalist.wednesdayPlan[0].content"></el-input>
                </div>
                <div class="li">
                    <div class="li-top"><span></span>周四
                     （{{dayMap.thu}}）
                    </div>
                    <el-input type="textarea" :rows="4"  placeholder="请输入周四计划"  v-model="datalist.thursdayPlan[0].content"></el-input>
                </div>
                <div class="li">
                    <div class="li-top"><span></span>周五
                     （{{dayMap.fri}}）
                    </div>
                    <el-input type="textarea" :rows="4"  placeholder="请输入周五计划"  v-model="datalist.fridayPlan[0].content"></el-input>
                </div>
                <div class="li">
                    <div class="li-top"><span></span>周六
                     （{{dayMap.sat}}）
                    </div>
                    <el-input type="textarea" :rows="4"  placeholder="请输入周六计划"  v-model="datalist.saturdayPlan[0].content"></el-input>
                </div>
                <div class="li">
                    <div class="li-top"><span></span>周日
                     （{{dayMap.sun}}）
                    </div>
                    <el-input type="textarea" :rows="4"  placeholder="请输入周日计划"  v-model="datalist.sundayPlan[0].content"></el-input>
                </div>
                <div class="li">
                    <div class="li-top"><span></span>备注</div>
                    <el-input type="textarea" :rows="4"  placeholder="请输入备注"  v-model="datalist.remarks"></el-input>
                </div>                
            </div>
                    
    </div>
  
  </div>
</template>
<script>
import mixin from '@/mixins/windowResize';
import Backtool from '@/components/BackTool';
import {getWeeks,detailWeeklyWorkPlan,getWeekDate,updateSubmitted,saveWeeklyWorkPlan,detailByWeekId,getSchoolTimeAllList,queryReviewSetting} from "@/api/weekWorkplan";
import {
  queryDepartByUserId,
  addWorkPlan,
  getDepartListByUserId,
  getDepartListByOtherManId
} from "@/api/workPlan";
export default {
  name: "weekWorkplanadd",
  components: {
    Backtool
  },
  data() {    
    return {
     id:this.$route.query.id,
     num:this.$route.query.num,
     isnum:2,
     weekName:'',//周次     
     Weeklist:[],
     schoolTimeId:'',
     dayMap: {
            mon:'',//周一的日期
            sun:''//周日的日期
       },  
     datalist:{             
       remarks:'',//备注
       weekId:'',//周次id
       mondayPlan:[{content:'',id:''}],//周一
       tuesdayPlan:[{content:'',id:''}],//周二
       wednesdayPlan:[{content:'',id:''}],//周三
       thursdayPlan:[{content:'',id:''}],//周四
       fridayPlan:[{content:'',id:''}],//周五
       saturdayPlan:[{content:'',id:''}],//周六
       sundayPlan:[{content:'',id:''}],//周日
       id:this.$route.query.id,
       saveType:0,
     },
    toExamine:false
    };
  },
  mixins: [mixin],
  created() {
      queryReviewSetting().then(res => {
         this.toExamine=(res.data.data.status==1)
         }).catch(err => {});
      getSchoolTimeAllList()
      .then(res => {
        for (let item of res.data.data) {
          if (item.isCurrent == 1) {
            this.schoolTimeId = item.id;   
          }
        };  
         //获取周次
    getWeeks()
      .then(res => {
        this.Weeklist=res.data.data;
        this.datalist.weekId=res.data.data[1].weekId;
        this.getWeekDates();    
         if(this.id!=0){
         this.detailWeeklyWorkPlans() 
      }else{
          this.detailByWeekIds()
      }    

      })
      .catch(err => {});
      })
      .catch(err => {});
   
     
  },
  methods: {
    //切换周次
        changeWeek(){
            if(this.num==3){
                this.detailByWeekIds()
            };
           this.getWeekDates();           
        },
    //获取详情
    detailByWeekIds(){
       
        detailByWeekId(this.datalist.weekId,this.schoolTimeId).then(res => {
            if(res.data.data==null){
                  this.datalist.remarks='';
                  this.datalist.id='';                 
                  this.datalist.mondayPlan[0].id='';                 
                  this.datalist.tuesdayPlan[0].id='';                  
                  this.datalist.sundayPlan[0].id='';                  
                  this.datalist.saturdayPlan[0].id='';                  
                  this.datalist.fridayPlan[0].id='';
                  this.datalist.mondayPlan[0].content='';
                  this.datalist.tuesdayPlan[0].content='';
                  this.datalist.sundayPlan[0].content='';
                  this.datalist.saturdayPlan[0].content='';
                  this.datalist.fridayPlan[0].content='';
                  this.datalist.thursdayPlan[0].content='';                  
                  this.datalist.wednesdayPlan[0].content='';
                  this.datalist.wednesdayPlan[0].id='';
                  this.datalist.thursdayPlan[0].id='';
                  this.isnum=0;
            }else{
                    this.datalist.remarks=res.data.data.remarks;
                    this.weekName=res.data.data.weekName;
                    this.datalist.weekId=res.data.data.weekId;
                    this.datalist.id=res.data.data.id;
                    this.isnum=res.data.data.status;
                    if(res.data.data.mondayPlan.length>0){
                        this.datalist.mondayPlan[0].content=res.data.data.mondayPlan[0].content;
                        this.datalist.mondayPlan[0].id=res.data.data.mondayPlan[0].id;
                    }else{
                        this.datalist.mondayPlan[0].content='';
                        this.datalist.mondayPlan[0].id='';
                    };
                    if(res.data.data.tuesdayPlan.length>0){
                        this.datalist.tuesdayPlan[0].content=res.data.data.tuesdayPlan[0].content;
                        this.datalist.tuesdayPlan[0].id=res.data.data.tuesdayPlan[0].id;
                    }else{
                        this.datalist.tuesdayPlan[0].content='';
                        this.datalist.tuesdayPlan[0].id='';
                    };
                    if(res.data.data.wednesdayPlan.length>0){
                        this.datalist.wednesdayPlan[0].content=res.data.data.wednesdayPlan[0].content;
                        this.datalist.wednesdayPlan[0].id=res.data.data.wednesdayPlan[0].id;
                    }else{
                        this.datalist.wednesdayPlan[0].content='';
                        this.datalist.wednesdayPlan[0].id='';
                    };
                    if(res.data.data.thursdayPlan.length>0){
                        this.datalist.thursdayPlan[0].content=res.data.data.thursdayPlan[0].content;
                        this.datalist.thursdayPlan[0].id=res.data.data.thursdayPlan[0].id;
                    }else{
                        this.datalist.thursdayPlan[0].content='';
                        this.datalist.thursdayPlan[0].id='';
                    };
                    if(res.data.data.fridayPlan.length>0){
                        this.datalist.fridayPlan[0].content=res.data.data.fridayPlan[0].content;
                        this.datalist.fridayPlan[0].id=res.data.data.fridayPlan[0].id;
                    }else{
                        this.datalist.fridayPlan[0].content='';
                        this.datalist.fridayPlan[0].id='';
                    };
                    if(res.data.data.saturdayPlan.length>0){
                        this.datalist.saturdayPlan[0].content=res.data.data.saturdayPlan[0].content;
                        this.datalist.saturdayPlan[0].id=res.data.data.saturdayPlan[0].id;
                    }else{
                        this.datalist.saturdayPlan[0].content='';
                        this.datalist.saturdayPlan[0].id='';
                    };
                    if(res.data.data.sundayPlan.length>0){             
                        this.datalist.sundayPlan[0].content=res.data.data.sundayPlan[0].content;
                        this.datalist.sundayPlan[0].id=res.data.data.sundayPlan[0].id;
                    }else{
                        this.datalist.sundayPlan[0].content='';
                        this.datalist.sundayPlan[0].id='';
                    };
            }
        
      })
      .catch(err => {});
    },
    //获取时间
    getWeekDates(){
        getWeekDate(this.datalist.weekId).then(res => {         
              this.dayMap=res.data.data
      })
      .catch(err => {});
    },
    //获取详情 
    detailWeeklyWorkPlans(){
       detailWeeklyWorkPlan(this.id).then(res => {
        this.datalist.remarks=res.data.data.remarks;
        this.weekName=res.data.data.weekName;
        this.datalist.weekId=res.data.data.weekId;
        this.getWeekDates(); 
        if(res.data.data.mondayPlan.length>0){
            this.datalist.mondayPlan[0].content=res.data.data.mondayPlan[0].content;
            this.datalist.mondayPlan[0].id=res.data.data.mondayPlan[0].id;
        };
         if(res.data.data.tuesdayPlan.length>0){
             this.datalist.tuesdayPlan[0].content=res.data.data.tuesdayPlan[0].content;
              this.datalist.tuesdayPlan[0].id=res.data.data.tuesdayPlan[0].id;
        };
         if(res.data.data.wednesdayPlan.length>0){
            this.datalist.wednesdayPlan[0].content=res.data.data.wednesdayPlan[0].content;
            this.datalist.wednesdayPlan[0].id=res.data.data.wednesdayPlan[0].id;
        };
         if(res.data.data.thursdayPlan.length>0){
            this.datalist.thursdayPlan[0].content=res.data.data.thursdayPlan[0].content;
             this.datalist.thursdayPlan[0].id=res.data.data.thursdayPlan[0].id;
        };
         if(res.data.data.fridayPlan.length>0){
            this.datalist.fridayPlan[0].content=res.data.data.fridayPlan[0].content;
             this.datalist.fridayPlan[0].id=res.data.data.fridayPlan[0].id;
        };
         if(res.data.data.saturdayPlan.length>0){
             this.datalist.saturdayPlan[0].content=res.data.data.saturdayPlan[0].content;
             this.datalist.saturdayPlan[0].id=res.data.data.saturdayPlan[0].id;
        };
         if(res.data.data.sundayPlan.length>0){             
             this.datalist.sundayPlan[0].content=res.data.data.sundayPlan[0].content;
             this.datalist.sundayPlan[0].id=res.data.data.sundayPlan[0].id;
        };
      })
      .catch(err => {});
    },
    //保存编辑
    updateSubmitteds(num){
        this.datalist.saveType=num;         
        if((this.datalist.mondayPlan[0].content=='')&&(this.datalist.tuesdayPlan[0].content=='')&&(this.datalist.sundayPlan[0].content=='')&&(this.datalist.saturdayPlan[0].content=='')&&(this.datalist.fridayPlan[0].content=='')&&(this.datalist.thursdayPlan[0].content=='')&&(this.datalist.wednesdayPlan[0].content=='')){
           this.$message({
                  type: "warning",
                  message: "至少计划一天!"
                });
          return
        }
        if(!this.datalist.id){
            //新建
            if(this.datalist.id==0){
                 this.datalist.id='';
            }
          saveWeeklyWorkPlan(this.datalist).then(res => {  
               if(res.data.code==200){                           
                                 this.$message({
                                  message: "操作成功！",
                                  type: "success",
                                  duration: 1000
                                });
                                this.$router.back();
                          }else{
                             this.$message.error(res.data.msg);
                              this.$router.back();
                          }
                    })
                .catch(err => {});
        }else{
            //有id
              updateSubmitted(this.datalist).then(res => {
                if(res.data.code==200){                           
                                 this.$message({
                                  message: "操作成功！",
                                  type: "success",
                                  duration: 1000
                                });
                                this.$router.back();
                          }else{
                             this.$message.error(res.data.msg);
                              this.$router.back();
                          }
                    })
                .catch(err => {});
        }
       
             
    }
  }
};
</script>
<style scoped>
.weekWorkplanadd{
    padding:12px;
}
.weekWorkplanadd .top {
  border-bottom: 1px solid #e7eaec;
  padding: 10px 0;
}
.weekWorkplanadd .subject {
  padding-top: 10px;
  overflow: auto;
}
.weekWorkplanadd .subject-top{
    overflow: hidden;
    line-height: 36px;
    margin: 15px auto;
    width: 810px;
}
.weekWorkplanadd .subject-top>div{
    width: 40%;
    float: left;
}
.ul .li{
   margin: 0 auto;
     width: 810px;
}
.ul .li .li-top{
    height: 40px;
    line-height: 40px;
    background-color: #ecf8ff;
}
.ul .li .li-top span{
    width: 3px;
    height: 15px;
    background-color: #20a0ff;
    display: block;
    float: left;
    margin: 12.5px 10px 12.5px 15px;
}
</style>