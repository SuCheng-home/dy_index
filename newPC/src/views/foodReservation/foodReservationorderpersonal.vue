<template>
<div class="foodReservationorderpersonal"  >
    <div class="top"> 
                    <el-row >
                        <el-col :span="6"> 
                            <el-button @click="$router.back()" type="default" size="medium">返回</el-button>  
                        </el-col>
                        <el-col :span="12">
                        <div class="top-name">{{name}} {{pagination.startDate}} 到 {{pagination.endDate}} 日订单列表</div>
                        </el-col>
                    </el-row>                    
            </div>         
             <el-table stripe :data="dataList" border fit highlight-current-row   style="width: 100%" :height="maxH">  
            <el-table-column align="center" label="订单号" show-overflow-tooltip>
                <template slot-scope="scope">
                    <span class="link-type" @click="foodReservationorderdetails(scope.row.id)">{{scope.row.orderNo}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="订单人" show-overflow-tooltip>
                <template slot-scope="scope">
                    <span>{{scope.row.userName}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="下单时间" show-overflow-tooltip>
                <template slot-scope="scope">
                    <span>{{scope.row.createDate.split('.')[0]}}</span>
                </template>
            </el-table-column>
             <el-table-column align="center" label="订单总额（元）" show-overflow-tooltip>
                <template slot-scope="scope">
                    <span>{{scope.row.totalAmount/100}}</span>
                </template>
            </el-table-column>
             <el-table-column align="center" label="退单/退款金额（元）" show-overflow-tooltip>
                <template slot-scope="scope">
                    <span v-if="(scope.row.refundAmount/100)">{{scope.row.refundAmount/100}}</span>
                    <span v-else>--</span>
                </template>
            </el-table-column>
             <el-table-column align="center" label="已支付金额（元）" show-overflow-tooltip>
                <template slot-scope="scope">
                    <span v-if="(scope.row.typePayWay==1)&&(scope.row.paidAmount/100)">{{scope.row.paidAmount/100}}</span>
                    <span v-else>--</span>
                </template>
            </el-table-column>
           
        </el-table>
        <div class="pagination-container">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="pagination.pageNo" :page-sizes="[10,20,30, 50]" :page-size.sync="pagination.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="pagination.total"> </el-pagination>
        </div>
</div> 
</template>
<script>
import { queryOrderListByUserIdAndDateRange} from "@/api/foodReservation";
import mixin from "@/mixins/windowResize";
export default {
  data() {
    return {
      name:this.$route.query.name,
      dataList: [],
      pagination: {
        pageNo: 1,
        pageSize: 20,
        total: null,
        endDate: this.$route.query.endDate,
        startDate:this.$route.query.startDate,
        userId:this.$route.query.id
      },
    };
  },
  mixins: [mixin],
  created() {
      this.queryOrderListByUserIdAndDateRanges();
  },
  methods: {
    foodReservationorderdetails(orderId){
     this.$router.push({ path:'foodReservationorderdetails',query: {orderId: orderId}})
    },
    //码数
    handleSizeChange() {
      this.pagination.pageNo = 1;
      this.queryOrderListByUserIdAndDateRanges();
    },
    //页数
    handleCurrentChange() {
      this.queryOrderListByUserIdAndDateRanges();
    },
    queryOrderListByUserIdAndDateRanges() {
     queryOrderListByUserIdAndDateRange(this.pagination)
        .then(res => res.data)
        .then(data => {
          this.pagination.total = data.data.pagination.total;
          this.dataList = data.data.dataList;
          this.titleList=data.data.titleList;
        });
    },
  }
};
</script>
<style lang="scss" scoped>
.foodReservationorderpersonal {
  padding:12px;
  .top {
    padding-bottom: 10px;
  }
    .top-name{
    line-height: 36px;
    text-align: center;
    font-size: 18px;
  }
}
</style>