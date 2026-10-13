<template>
    <div class="restaurantRefundindex">
        <div class="top">
                <el-button type="primary"   size="medium" @click="generationrefundadd()">发起退费</el-button> 
                <el-button type="primary"   size="medium" @click="generationreAccountStatement()">对账单</el-button> 
        </div>
        <div class="time-table">
            <el-table stripe :data="dateList"  border fit highlight-current-row style="width: 100%" :height="maxH">
                <el-table-column align="center" label="退费名称" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span class="link-type" @click="generationrefunddetails(scope.row.applyBatchSn,scope.row.status,scope.row.totalfee,scope.row.refundName,scope.row.refundUser)">{{scope.row.refundName}}</span>
                    </template>
                </el-table-column>
                 <el-table-column align="center" label="批次编号" show-overflow-tooltip>
                    <template slot-scope="scope">
                     {{scope.row.applyBatchSn}}
                    </template>
                </el-table-column>
                <el-table-column  prop="createTime"  label="创建时间"></el-table-column>
                <el-table-column align="center" label="类型">
                    <template slot-scope="scope">
                       <el-tag  size="mini" v-if="scope.row.refundUser==2" type="success">老师</el-tag>
                       <el-tag  size="mini" v-if="scope.row.refundUser==1" type="success">学生</el-tag>
                    </template>
                </el-table-column>
                 <el-table-column align="center" label="退费方式">
                    <template slot-scope="scope">
                       <el-tag  size="mini" v-if="scope.row.refundType==1" >按银行卡退费</el-tag>
                       <el-tag  size="mini" v-if="scope.row.refundType==2" >按订单退费</el-tag>
                    </template>
                </el-table-column>
                <el-table-column  prop="total"  label="应退费人数"></el-table-column>
                <el-table-column  prop="totalfee"  label="应退费金额"></el-table-column>
                <el-table-column  prop="refundedTotal"  label="已退款人数"></el-table-column>
                <el-table-column  prop="refundedTotalfee"  label="已退款金额"></el-table-column>  
                <el-table-column  prop="auditor"  label="审核人"></el-table-column> 
                <el-table-column align="center" label="状态" width="120px">
                    <template slot-scope="scope">
                      <el-tag  size="mini" v-if="scope.row.status==1" >处理中</el-tag>
                       <el-tag  size="mini" v-if="scope.row.status==2" type="success">已就绪</el-tag>
                       <el-tag  size="mini" v-if="scope.row.status==3" type="warning">待审核</el-tag>
                       <el-tag  size="mini" v-if="scope.row.status==4" type="danger">被驳回</el-tag>
                       <el-tag  size="mini" v-if="scope.row.status==6" type="danger">退费失败</el-tag>
                       <el-tag  size="mini" v-if="scope.row.status==5" type="success">已退款</el-tag>
                    </template>
                </el-table-column>     
                 <el-table-column align="center" label="操作" width="120px">
                    <template slot-scope="scope">
                       <el-button size="small" type="text"  :disabled="scope.row.status>1"  @click.native="deletePayRefundapplys(scope.row.id)" class="buttontextred">删除</el-button>
                    </template>
                </el-table-column>         
            </el-table>
        </div>
        <div class="pagination-container">
            <el-pagination @size-change="queryPayRefundapplyLists()" @current-change="queryPayRefundapplyLists()"
                           :current-page.sync="query.pageNo" :page-sizes="[10,20,30, 50]"
                           :page-size="query.pageSize" layout="total, sizes, prev, pager, next, jumper"
                           :total="total">
            </el-pagination>
        </div>
    </div>
</template>
<script>
import {queryPayRefundapplyList,deletePayRefundapply} from '@/api/generationrefund';
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
      }
    };
  },
  mixins: [mixin],
  //获取渲染数据当数据加载完成后执行(生命周期中的钩子函数)
  created() {
    this.queryPayRefundapplyLists();
  },
  methods: {
     deletePayRefundapplys(id){
           this.$confirm("确认要删除吗？", "删除", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        lockScroll: false
      }).then(() => {         
          deletePayRefundapply(id).then(res => {
            if (res.data.code === 200) {
              this.$message.success("删除成功！");
               this.queryPayRefundapplyLists();
            } else {
              this.$message.error(res.data.msg);
            }
          });
        })
        .catch(() => {});
        },
    //获取列表
    queryPayRefundapplyLists() {
      this.dateList = [];
      queryPayRefundapplyList(this.query).then(res => {
          let data = res.data.data;
          this.dateList = data.dataList;
          this.total = data.pagination.total;
      });
    },
    //详情
    generationrefunddetails(applyBatchSn,status,totalfee,refundName,refundUser) {
      this.$router.push({
        path: "generationrefunddetails",
        query: {
          applyBatchSn: applyBatchSn,
          status: status,
          totalfee: totalfee,
          refundName: refundName,
          refundUser:refundUser
        }
      });
    },
    //新增
    generationrefundadd(){
      this.$router.push({
        path: "generationrefundadd"
      });
    },
    generationreAccountStatement(){
      this.$router.push({
        path: "generationreAccountStatement"
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
