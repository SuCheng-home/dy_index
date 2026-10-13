<template>
    <div class="generationrefundlist">
        <div class="top">
                <el-button  @click="$router.back()"  size="medium">返回</el-button> 
                 <el-button  size="medium" type="primary"  @click="addPayRefundapplys()">下一步</el-button>  
        </div>
        <div class="time-table">
            <el-table stripe :data="dateList"  border fit highlight-current-row style="width: 100%" :height="nobottommaxH">
                <el-table-column  prop="userName"  label="姓名" align="center" ></el-table-column>
                <el-table-column  prop="className"  label="班级" align="center"  v-if="fireType==2" show-overflow-tooltip></el-table-column>
                <el-table-column  prop="className"  label="部门" align="center"  v-if="fireType!=2" show-overflow-tooltip></el-table-column>
               
                <el-table-column  prop="breakfastCount" width="110" align="center" v-if="(fireType==2)&&(getFireSetobj.stuBreakfastCheck==1)"  label="早餐停伙次数" ></el-table-column>
                <el-table-column  prop="breakfastPrice"  label="早餐餐标" v-if="(fireType==2)&&(getFireSetobj.stuBreakfastCheck==1)" align="center"  >
                     <template slot-scope="scope">
                        <span>{{getFireSetobj.stuBreakfastPrice}}</span>
                    </template>
                </el-table-column>
               
                <el-table-column  prop="breakfastCount" width="110" align="center" v-if="(fireType!=2)&&(getFireSetobj.breakfastCheck==1)"  label="早餐停伙次数" ></el-table-column>
                <el-table-column  label="早餐餐标" v-if="(fireType!=2)&&(getFireSetobj.breakfastCheck==1)" align="center"  >
                      <template slot-scope="scope">
                        <span>{{getFireSetobj.breakfastPrice}}</span>
                    </template>
                </el-table-column>

                <el-table-column  prop="lunchCount" width="110" align="center" v-if="((fireType!=2)&&(getFireSetobj.teacherLunch==1))||((fireType==2)&&(getFireSetobj.lunch==1))"  label="午餐停伙次数" ></el-table-column>
                <el-table-column    label="午餐餐标" align="center" v-if="((fireType!=2)&&(getFireSetobj.teacherLunch==1))||((fireType==2)&&(getFireSetobj.lunch==1))" >
                     <template slot-scope="scope">
                        <span>{{fireType==2?getFireSetobj.lunchPrice:getFireSetobj.teacherLunchPrice}}</span>
                    </template>
                </el-table-column>

                <el-table-column  prop="breakCount"  width="120" label="课间餐停伙次数" align="center"   v-if="(getFireSetobj.breakMealCheck==1)&&(fireType==2)"></el-table-column>
                <el-table-column   label="课间餐餐标" align="center"   v-if="(getFireSetobj.breakMealCheck==1)&&(fireType==2)">
                 <template slot-scope="scope">
                        <span>{{getFireSetobj.breakMealPrice}}</span>
                    </template>
                </el-table-column>


               <el-table-column  prop="supperCount" width="110" align="center" v-if="(fireType==2)&&(getFireSetobj.stuSupperCheck==1)"  label="晚餐停伙次数" ></el-table-column>
                <el-table-column   label="晚餐餐标" v-if="(fireType==2)&&(getFireSetobj.stuSupperCheck==1)" align="center"  >
                     <template slot-scope="scope">
                        <span>{{getFireSetobj.stuSupperPrice}}</span>
                    </template>
                </el-table-column>
                <el-table-column  prop="supperCount" width="110" align="center" v-if="(fireType!=2)&&(getFireSetobj.supperCheck==1)"  label="晚餐停伙次数" ></el-table-column>
                <el-table-column  label="晚餐餐标" v-if="(fireType!=2)&&(getFireSetobj.supperCheck==1)" align="center"  >
                      <template slot-scope="scope">
                        <span>{{getFireSetobj.supperPrice}}</span>
                    </template>
                </el-table-column>

                <el-table-column  prop="totalPrice"  label="应退金额" align="center" ></el-table-column>
            </el-table>
        </div>
          <el-dialog title="未绑卡用户" :close-on-press-escape='false' :close-on-click-modal='false' :visible.sync="mymsgpop" width="500px" :lock-scroll="false" :modal-append-to-body='false'>
		  <div v-html="mymsg"></div>
			<span slot="footer" class="dialog-footer">
				<el-button type="primary" @click="mymsgpop=false">确 定</el-button>
			</span>
		</el-dialog> 
    </div>
</template>
<script>
import {getFireSet} from '@/api/newrestaurantRefund';
import mixin from "@/mixins/windowResize";
import {fireAnalysisByFireTypeAndDateRange,addPayRefundapply} from "@/api/generationrefund";
export default {
  name: "generationrefundlist",
  data: function() {
    return {
      dateList: [], //表格主题数据
      total: null,
      query: {
        fireType:this.$route.query.refundUser==1?2:1,
        searchName:"",
        endDate:this.$route.query.endDate,
        startDate:this.$route.query.startDate
      },
      getFireSet:{
          
      },
      fireType:this.$route.query.refundUser==1?2:1,
      list:[],
      mymsg:"",
      mymsgpop:false
      
    };
  },
  mixins: [mixin],
  //获取渲染数据当数据加载完成后执行(生命周期中的钩子函数)
  created() {     
     getFireSet().then(res => {
          let data = res.data.data;
          this.getFireSetobj=data;     
          this.fireAnalysisByFireTypeAndDateRanges();
      });
  },
  methods: {
    
    //获取列表
    fireAnalysisByFireTypeAndDateRanges() {
      this.dateList = [];
      fireAnalysisByFireTypeAndDateRange(this.query).then(res => {
          let data = res.data.data;
          for(let i=0;i<data.length;i++){
              //老师
              if(this.fireType==1){
                 data[i].totalPrice=0;
                 if(this.getFireSetobj.breakfastCheck==1&&data[i].breakfastCount){
                     data[i].totalPrice=data[i].totalPrice+data[i].breakfastCount*this.getFireSetobj.breakfastPrice;
                 }
                  if(this.getFireSetobj.supperCheck==1&&data[i].supperCount){
                     data[i].totalPrice=data[i].totalPrice+data[i].supperCount*this.getFireSetobj.supperPrice;
                 }
                   if(data[i].lunchCount){
                     data[i].totalPrice=data[i].totalPrice+data[i].lunchCount*this.getFireSetobj.teacherLunchPrice;
                 }
              }
              //学生
              if(this.fireType==2){
                 data[i].totalPrice=0;
                 //早餐
                 if(this.getFireSetobj.stuBreakfastCheck==1&&data[i].breakfastCount){
                     data[i].totalPrice=data[i].totalPrice+data[i].breakfastCount*this.getFireSetobj.stuBreakfastPrice;
                 }
                 if(this.getFireSetobj.stuSupperCheck==1&&data[i].supperCount){
                     data[i].totalPrice=data[i].totalPrice+data[i].supperCount*this.getFireSetobj.stuSupperPrice;
                 }
                 if(this.getFireSetobj.breakMealCheck==1&&data[i].breakCount){
                     data[i].totalPrice=data[i].totalPrice+data[i].breakCount*this.getFireSetobj.breakMealPrice;
                 }
                 if(data[i].lunchCount){
                     data[i].totalPrice=data[i].totalPrice+data[i].lunchCount*this.getFireSetobj.lunchPrice;
                 }
              }
               data[i].totalPrice=(Math.floor(data[i].totalPrice*100))/100;
               this.list.push({
                    departId:this.fireType==1?data[i].classId:data[i].classId,//	部门/班级id	number	
                    departName:this.fireType==1?data[i].className:data[i].className,//	部门/班级名称	string	
                    fee:data[i].totalPrice,//	申请退款额度	number	单位元精确到分
                    uid:data[i].userId,//	用户id	number	
                    uname:data[i].userName,//	用户名称	string	
                    loginname:data[i].stuNo,
               })
          }
          this.dateList = data;
      });
    },
     //保存
    addPayRefundapplys() {
      let $this = this;
     
             addPayRefundapply({detailList:this.list,refundapply:{
                 datasource:2,
                 merhId:this.$route.query.merhId,
                 moduleCode:this.$route.query.moduleCode,
                 refundName:this.$route.query.refundName,
                 refundUser:this.$route.query.refundUser,
                 refundType:1,
                 moduledata:{
                    endDate:this.$route.query.endDate,
                    startDate:this.$route.query.startDate
                 }                 
             }})
              .then(res => {
                this.is = true;
                if (res.data.code === 200) {
                  this.$message({
                    type: "success",
                    message: "操作成功!"
                  });
                  this.$router.replace({
                    path:'generationrefunddetails',
                    query: { 
                        id: res.data.data
                    }
                })
                }else{
                  this.mymsg=res.data.msg
                  this.mymsgpop=true
                }
              })
              .catch(function() {
              });
    }
  }
};
</script>
<style scoped="scoped">
.generationrefundlist {
  padding:12px;
}
.generationrefundlist .top {
 padding-bottom: 10px
}
</style>
