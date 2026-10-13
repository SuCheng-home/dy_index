<template>
    <div class="restaurantRefunddetails">
        <div class="top">
            <el-col :span="24">
                <el-button size="medium" @click="$router.back()">返回</el-button>  
                <el-button size="medium" type="primary" @click="refreshReturnRecordStatus()" >刷新</el-button>   
                <el-input  size="medium" class="search-input search-input--right" style="width:20%" placeholder="请输入姓名" icon="el-icon-search" @change="handleInputChange" v-model.trim="query.searchName">
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
                 <el-table-column  prop="breakMealCount"  width="120" label="课间餐停伙次数"  v-if="breakMeal==1"></el-table-column>
                <el-table-column  prop="breakMeakPrice"  label="课间餐餐标"  v-if="breakMeal==1"></el-table-column>
                <el-table-column  prop="lunchCount" width="110"  label="午餐停伙次数" v-if="lunch==1"></el-table-column>
                <el-table-column  prop="lunchPrice"  label="午餐餐标"  v-if="lunch==1"></el-table-column>
                <el-table-column  prop="supperCount" width="110"  label="晚餐停伙次数" v-if="stuSupper==1"></el-table-column>
                <el-table-column  prop="supperPrice"  label="晚餐餐标"  v-if="stuSupper==1"></el-table-column>
                <el-table-column  prop="totalPrice"  label="应退金额"></el-table-column>
                <el-table-column   label="实退金额">
                  <template slot-scope="scope"><span >{{scope.row.status==2?scope.row.totalPrice:"--"}}</span></template>
                </el-table-column>
                <el-table-column   label="退费状态">
                  <template slot-scope="scope">
                     <el-tag  size="mini" type="success" v-if="(scope.row.status==2)">已退费</el-tag>
                     <el-tag  size="mini"  v-if="(scope.row.status==1)">退费中</el-tag>
                     <el-tag  size="mini" type="danger" v-if="(scope.row.status==3||scope.row.status==0)">退费失败</el-tag>
                  </template>    
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
import {queryReturnRecordByBatchId,getFireSet,updateRefund,refreshReturnRecordStatus} from '@/api/restaurantRefund';
import {queryDeadlineTimeChargeNotice} from '@/api/campusFees';
import _ from "lodash";
import mixin from "@/mixins/windowResize";
export default {
  name: "restaurantRefunddetails",
  data: function() {
    return {
      dateList: [], //表格主题数据
      total: null,
      query: {
        pageNo: 1, //页数
        pageSize: 20, //条数
        searchName: "",
        batchId:this.$route.query.id,
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
     getFireSet().then(res => {
          let data = res.data.data;
          this.breakMeal=data.breakMeal;
          this.lunch=data.lunch;  
          this.stuBreakfast=data.stuBreakfast;   
          this.stuSupper=data.stuSupper;      
      });
    this.queryReturnRecordByBatchIds();
    queryDeadlineTimeChargeNotice().then(res => {
        let data= res.data.data;       
        this.allend=!data;
      }); 
  },
  methods: {
    refreshReturnRecordStatus() {
        this.$confirm('是否刷新退费记录状态？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          refreshReturnRecordStatus(this.$route.query.id).then(res => {
          if (res.data.code === 200 && res.data.result) {
            this.$message.success('刷新成功');
            this.queryReturnRecordByBatchIds();
          } else {
            this.$message.warning(res.data.msg);
          }
        });
        }).catch(() => {
        });
      },
    //退款
    updateRefunds(obj){
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
       this.$confirm("是否确认退费吗？", "退费", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          updateRefund(obj.cId,obj.totalPrice,obj.userId)
            .then(res => {
              if (res.data.code === 200) {
                this.$message({
                  type: "success",
                  message: "退费成功！"
                });
                this.queryReturnRecordByBatchIds();
              }
            })
            .catch(function() {});
        })
        .catch(() => {});
   
    },
    //搜索
    handleInputChange() {
        this.queryReturnRecordByBatchIds();
      },
    //获取列表
    queryReturnRecordByBatchIds() {
      this.dateList = [];
      queryReturnRecordByBatchId(this.query).then(res => {
          let data = res.data.data;
          this.dateList = data.dataList;
          this.total = data.pagination.total;
      });
    },
    //切换页码
    handleSizeChange(val) {
      this.query.pageSize = val;
      this.queryReturnRecordByBatchIds();
    },
    handleCurrentChange(val) {
      this.queryReturnRecordByBatchIds();
    }
  }
};
</script>
<style scoped="scoped">
.restaurantRefunddetails {
  padding:12px;
}
.restaurantRefunddetails .top {
  padding-bottom: 10px;
  overflow: hidden;
}
.is-link {
  color: #20a0ff;
  cursor: pointer;
}
</style>
