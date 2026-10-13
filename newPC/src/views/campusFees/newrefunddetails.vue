<template>
    <div class="restaurantRefundindex">
        <div class="top">
           <el-button @click="$router.back()" type="default" size="medium">返回</el-button> 
            <a :href="downLoadHref" v-if="dateList.length" target="_blank" download="examName"><el-button type="primary"  size="medium">导出</el-button></a>
        </div>
        <div class="time-table">
            <el-table stripe :data="dateList"  border fit highlight-current-row style="width: 100%" :height="maxH">
                <el-table-column align="center" label="姓名" show-overflow-tooltip>
                    <template slot-scope="scope">
                        {{scope.row.uname}}
                    </template>
                </el-table-column>
                 <el-table-column align="center" label="班级/部门" show-overflow-tooltip>
                    <template slot-scope="scope">
                     {{scope.row.deptName}}
                    </template>
                </el-table-column>
                 <el-table-column align="center" label="退费来源"   show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span >{{scope.row.chargeType}}</span>
                    </template>
                </el-table-column>                
                <el-table-column align="center" label="退费时间">
                    <template slot-scope="scope">
                        <span>{{scope.row.createTime}}</span>
                    </template>
                </el-table-column>  
                  <el-table-column align="center" label="订单号" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span >{{scope.row.orderId}}</span>
                    </template>
                </el-table-column> 
                <el-table-column   label="缴费金额" align="center" >
                     <template slot-scope="scope">
                     {{scope.row.paymoney/100}}
                    </template>
                </el-table-column>
                <el-table-column    label="退款金额" align="center" >
                      <template slot-scope="scope">
                     {{scope.row.refundMoney/100}}
                    </template>
                </el-table-column>
                <el-table-column  prop="refundRemark"  label="退款备注" align="center" ></el-table-column>
                <el-table-column align="center" label="退款状态" width="120px">
                    <template slot-scope="scope">
                      <el-tag  size="mini"  v-if="scope.row.status==0" type="info">草稿</el-tag>
                       <el-tag  size="mini" v-if="scope.row.status==1" type="warning">退款中</el-tag>
                       <el-tag  size="mini" v-if="scope.row.status==2" type="success">退款成功</el-tag>
                         <el-tooltip class="item" effect="dark"  v-if="scope.row.status==3" :content="scope.row.reason" placement="top">
                            <el-tag  size="mini"  type="danger">退款失败</el-tag>
                        </el-tooltip>  
                      
                    </template>
                </el-table-column>       
            </el-table>
        </div>
        <div class="pagination-container">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                           :current-page.sync="query.pageNo" :page-sizes="[10,20,30,50]"
                           :page-size="query.pageSize" layout="total, sizes, prev, pager, next, jumper"
                           :total="total">
            </el-pagination>
        </div>
    </div>
</template>
<script>
import {queryRefundDetailList} from '@/api/campusFees';
import mixin from "@/mixins/windowResize";
export default {
  name: "newrestaurantRefundindex",
  data: function() {
    return {
      dateList: [], //表格主题数据
      total: null,
      query: {
        pageNo: 1, //页数
        pageSize: 20, //条数
        batchSn:this.$route.query.batchSn
      },
        downLoadHref: global.BasePath + "chargeNoticeProduct/exportRefundList?batchSn=" +this.$route.query.batchSn+"&cid=" +this.$route.query.cid +"&token=" +this.$store.getters.token,//导出全部名单
    };
  },
  mixins: [mixin],
  //获取渲染数据当数据加载完成后执行(生命周期中的钩子函数)
  created() {
    this.queryRefundDetailLists();
  },
  methods: {
   handleSizeChange(val) {
                this.query.pageSize = val;
                this.queryRefundDetailLists();
            },
            handleCurrentChange(val) {
                this.query.pageNo = val;
                this.queryRefundDetailLists();
            },
    //获取列表
    queryRefundDetailLists() {
      this.dateList = [];
      queryRefundDetailList(this.query).then(res => {
          let data = res.data.data;
          this.dateList = data.dataList;
          this.total = data.pagination.total;
      });
    },
  }
};
</script>
<style scoped="scoped">
.restaurantRefundindex {
  padding:12px;
}
.restaurantRefundindex .top {
  padding-bottom: 10px;
}
</style>
