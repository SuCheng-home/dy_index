<template>
    <div class="restaurantRefunddetails">
        <div class="top">
            <el-col :span="24">
                <el-button  @click="$router.back()"  size="medium">返回</el-button> 
                 <el-button  size="medium" type="primary"  @click="returnMoneys()" v-if="status!=2">提交退费</el-button>  
                 <el-button size="medium" type="primary" @click="refreshReturnRecordStatus()"  v-if="status==2" >刷新</el-button> 
                <a :href="downLoadHref" target="_blank" download="examName" v-if="dateList.length"><el-button type="primary"  size="medium">导出</el-button></a>   
                <el-input class="search-input search-input--right"  size="medium"  placeholder="请输入姓名" icon="el-icon-search" @change="handleInputChange" v-model.trim="query.searchName">
                    <el-button slot="append" icon="el-icon-search"  size="medium"  @click="handleInputChange"></el-button>
                </el-input>
            </el-col>
        </div>
        <div class="time-table">
            <el-table stripe :data="dateList"  border fit highlight-current-row style="width: 100%" :height="maxH">
                <el-table-column  prop="userName"  label="姓名" align="center" ></el-table-column>
                <el-table-column  prop="className"  label="班级" align="center"  v-if="fireType==2" show-overflow-tooltip></el-table-column>
                <el-table-column  prop="className"  label="部门" align="center"  v-if="fireType!=2" show-overflow-tooltip></el-table-column>
                <el-table-column  prop="orderId"  label="缴费单号" align="center"   show-overflow-tooltip></el-table-column>

                <el-table-column  prop="breakfastCount" width="110" align="center" v-if="(fireType==2)&&(getFireSetobj.stuBreakfastCheck==1)"  label="早餐停伙次数" ></el-table-column>
                <el-table-column  prop="breakfastPrice"  label="早餐餐标" v-if="(fireType==2)&&(getFireSetobj.stuBreakfastCheck==1)" align="center"  ></el-table-column>
                <el-table-column  prop="breakfastCount" width="110" align="center" v-if="(fireType!=2)&&(getFireSetobj.breakfastCheck==1)"  label="早餐停伙次数" ></el-table-column>
                <el-table-column  prop="breakfastPrice"  label="早餐餐标" v-if="(fireType!=2)&&(getFireSetobj.breakfastCheck==1)" align="center"  ></el-table-column>

                <el-table-column  prop="lunchCount" width="110" align="center"   label="午餐停伙次数" v-if="((fireType!=2)&&(getFireSetobj.teacherLunch==1))||((fireType==2)&&(getFireSetobj.lunch==1))"></el-table-column>
                <el-table-column  prop="lunchPrice"  label="午餐餐标" align="center"  v-if="((fireType!=2)&&(getFireSetobj.teacherLunch==1))||((fireType==2)&&(getFireSetobj.lunch==1))"></el-table-column>

                <el-table-column  prop="breakMealCount"  width="120" label="课间餐停伙次数" align="center"   v-if="(getFireSetobj.breakMealCheck==1)&&(fireType==2)"></el-table-column>
                <el-table-column  prop="breakMealPrice"  label="课间餐餐标" align="center"   v-if="(getFireSetobj.breakMealCheck==1)&&(fireType==2)"></el-table-column>


               <el-table-column  prop="supperCount" width="110" align="center" v-if="(fireType==2)&&(getFireSetobj.stuSupperCheck==1)"  label="晚餐停伙次数" ></el-table-column>
                <el-table-column  prop="supperPrice"  label="晚餐餐标" v-if="(fireType==2)&&(getFireSetobj.stuSupperCheck==1)" align="center"  ></el-table-column>
                <el-table-column  prop="supperCount" width="110" align="center" v-if="(fireType!=2)&&(getFireSetobj.supperCheck==1)"  label="晚餐停伙次数" ></el-table-column>
                <el-table-column  prop="supperPrice"  label="晚餐餐标" v-if="(fireType!=2)&&(getFireSetobj.supperCheck==1)" align="center"  ></el-table-column>

                <el-table-column  prop="totalPrice"  label="应退金额" align="center" >
                   <template slot-scope="scope">{{(scope.row.totalPrice-0).toFixed(2)-0}}</template>
                </el-table-column>
                <el-table-column   label="实退金额" align="center" >
                  <template slot-scope="scope"><span v-if="scope.row.refundMoney">{{(scope.row.refundMoney-0).toFixed(2)-0}}</span><span v-if="!scope.row.refundMoney">----</span></template>
                </el-table-column>
                <el-table-column   label="退费状态" v-if="status==2" align="center" >
                  <template slot-scope="scope">
                     <el-tag  size="mini" type="success" v-if="scope.row.status==2">已退费</el-tag>
                     <el-tag  size="mini"  v-if="scope.row.status==1">退费中</el-tag>
                     <el-tag  size="mini" type="danger" v-if="scope.row.status==3||scope.row.status==0">退费失败</el-tag>
                  </template>    
                </el-table-column>   
                <el-table-column prop="confirmUserName"  align="center"  label="确认人" ></el-table-column>                                       
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
import {queryReturnRecordByBatchId,getFireSet,returnMoney,remindConfirmReturnMoney,refreshReturnRecordStatus} from '@/api/newrestaurantRefund';
import {queryDeadlineTimeChargeNotice} from '@/api/campusFees';
import _ from "lodash";
import mixin from "@/mixins/windowResize";
export default {
  name: "newrestaurantRefunddetails",
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
      status:this.$route.query.status,      
      fireType:this.$route.query.fireType,
      downLoadHref:'',
      allend:false,
      getFireSetobj:{}
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
          this.getFireSetobj=data;     
      });
    this.queryReturnRecordByBatchIds();
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
    //退费
    returnMoneys(){
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
          returnMoney(this.$route.query.id)
            .then(res => {
              if (res.data.code== 200) {
                this.$message({
                  type: "success",
                  message: "退费成功！"
                });  
                this.status=2;  
                this.queryReturnRecordByBatchIds();    
              }else{
                if(res.data.code== 201){
                   this.remindConfirmReturnMoneys(res.data.data)
                }
                if(res.data.code== 202){
                    this.$message({
                      type: "warning",
                      message: res.data.data
                    });  
                }  
                if(res.data.code== 1005){
                    this.$message({
                      type: "warning",
                      message: res.data.msg
                    });  
                    this.status=2;   
                    this.queryReturnRecordByBatchIds();
                }               
              };
            })
            .catch(function() {});
            
        })
        .catch(() => {});
    },
    remindConfirmReturnMoneys(name){
         this.$confirm(name, "提醒", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          remindConfirmReturnMoney(this.$route.query.id)
            .then(res => {
              if (res.data.code== 200) {
                this.$message({
                  type: "success",
                  message: "提醒成功！"
                });        
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
      this.downLoadHref=global.BasePath + "structure/fire/downReturnRecordByBatchId?batchId=" +this.query.batchId+"&schoolId=" +this.$store.getters.schoolInfo.id+"&fireType=" +this.fireType+"&searchName=" +this.query.searchName +"&token=" +this.$store.getters.token;
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
  height: 46px;
}
.is-link {
  color: #20a0ff;
  cursor: pointer;
}
</style>
