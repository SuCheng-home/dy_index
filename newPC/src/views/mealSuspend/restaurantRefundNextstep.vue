<template>
    <div class="restaurantRefundNextstep">
        <div class="top">
            <el-col :span="5">
                <el-button  @click="$router.back()" size="medium">返回</el-button>   
                 <el-button type="primary" @click="submitReturnMoneys()" size="medium">提交退费</el-button>  
            </el-col>
            <el-col :span="14">
                <div class="h3">{{myquery.name}} <span>{{myquery.startDate}}~{{myquery.endDate}}</span></div>
            </el-col>
             <el-col :span="5">    
                <el-input  placeholder="请输入姓名" icon="el-icon-search" @change="handleInputChange" v-model.trim="query.searchName">
                    <el-button slot="append" icon="el-icon-search" @click="handleInputChange"></el-button>
                </el-input>
            </el-col>
        </div>
        <div class="time-table">
            <el-table stripe :data="dateList"  border fit highlight-current-row style="width: 100%" :height="maxH">  
                <el-table-column  prop="userName"  label="姓名"></el-table-column>
                <el-table-column  prop="className"  label="班级"  show-overflow-tooltip></el-table-column>
                <el-table-column  prop="orderId"  label="缴费单号"  show-overflow-tooltip></el-table-column>
                <el-table-column  prop="breakfastCount" width="110"  label="早餐停伙次数" v-if="stuBreakfast==1"></el-table-column>
                <el-table-column  prop="breakfastPrice"  label="早餐餐标"  v-if="stuBreakfast==1"></el-table-column>
                 <el-table-column  prop="breakMealCount"  label="课间餐停伙次数"  v-if="breakMeal==1"></el-table-column>
                <el-table-column  prop="breakMealPrice"  label="课间餐餐标"  v-if="breakMeal==1"></el-table-column>
                <el-table-column  prop="fireCount"  label="午餐停伙次数" v-if="lunch==1"></el-table-column>
                <el-table-column  prop="lunchPrice"  label="午餐餐标"  v-if="lunch==1"></el-table-column>
                <el-table-column  prop="supperCount" width="110"  label="晚餐停伙次数" v-if="stuSupper==1"></el-table-column>
                <el-table-column  prop="supperPrice"  label="晚餐餐标"  v-if="stuSupper==1"></el-table-column>
               
                <el-table-column  prop="totalPrice"  label="应退金额">
                  <template slot-scope="scope">{{(scope.row.totalPrice-0).toFixed(2)-0}}</template>
                </el-table-column>
            </el-table>
        </div>
        <div class="pagination-container">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                           :current-page.sync="query.pageNo" :page-sizes="[10,20,30, 50]"
                           :page-size="query.pageSize" layout="total, sizes, prev, pager, next, jumper"
                           :total="total">
            </el-pagination>
        </div>
    </div>
</template>
<script>
import moment from "moment";
import {queryStuRepastFireByCIdAndDateRange,getFireSet,submitReturnMoney} from '@/api/restaurantRefund';
import {queryDeadlineTimeChargeNotice} from '@/api/campusFees';
import _ from "lodash";
import mixin from "@/mixins/windowResize";
export default {
  name: "restaurantRefundNextstep",
  data: function() {
    return {
      dateList: [], //表格主题数据
      total: null,
      myquery:this.$route.query,
      query: {
        pageNo: 1, //页数
        pageSize: 20, //条数
        searchName: "",
        startDate:this.$route.query.startDate,
        cId:this.$route.query.id,
        endDate:this.$route.query.endDate
      },
      breakMeal:1,
      lunch:1,
      stuBreakfast:1,
      stuSupper:1,
      allend:false
    };
  },
  mixins: [mixin],
  //获取渲染数据当数据加载完成后执行(生命周期中的钩子函数)
  created() {
     queryDeadlineTimeChargeNotice().then(res => {
        let data= res.data.data;       
        this.allend=!data;
      }); 
    getFireSet().then(res => {
          let data = res.data.data;
          this.breakMeal=data.breakMeal;
          this.lunch=data.lunch;    
          this.stuBreakfast=data.stuBreakfast;   
          this.stuSupper=data.stuSupper;    
      });
    this.queryStuRepastFireByCIdAndDateRanges();
  },
  methods: {
    //退费
    submitReturnMoneys(){
      if(this.dateList.length==0){
        this.$message({
            type: "warning",
            message: "暂无退费人员！"
          });
          return;
      }
      if(this.allend){
        this.$message({
            type: "warning",
            message: "尚有未截止的收费，请全部截止后再进行退费！"
          });
          return;
      }
      this.$confirm("是否确认退费？", "退费", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          submitReturnMoney(this.myquery)
            .then(res => {
              if (res.data.code === 200) {
                this.$message({
                  type: "success",
                  message: "退费成功！"
                });
              }else{
                this.$message({
                  type: "warning",
                  message: res.data.msg
                });                 
              };
            })
            .catch(function() {});
             this.$router.replace({ path: "restaurantRefundindex" })
        })
        .catch(() => {});
    },
    //搜索
    handleInputChange(){
     this.queryStuRepastFireByCIdAndDateRanges();
    },
    //获取列表
    queryStuRepastFireByCIdAndDateRanges() {
      this.dateList = [];
      queryStuRepastFireByCIdAndDateRange(this.query).then(res => {
          let data = res.data.data;
          this.dateList = data.dataList;
          this.total = data.pagination.total;
      });
    },
    //切换页码
    handleSizeChange(val) {
      this.query.pageSize = val;
      this.queryStuRepastFireByCIdAndDateRanges();
    },
    handleCurrentChange(val) {
      this.queryStuRepastFireByCIdAndDateRanges();
    }
  }
};
</script>
<style scoped="scoped">
.restaurantRefundNextstep {
  padding:12px;
}
.restaurantRefundNextstep .top {
 overflow: hidden;
 padding-bottom: 10px;
}
.h3{
    line-height: 36px;
    font-size: 22px;
    color: #444;
    font-weight: 600;
    text-align: center;
}
.h3 span{
    font-size: 16px;
    color: #999;
    margin-left: 10px;
    font-weight: 400;
}
</style>
