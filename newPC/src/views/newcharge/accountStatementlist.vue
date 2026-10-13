<template>
    <div class="accountStatementlist">
        <div class="top">
            <el-button @click="$router.back()" type="default" size="medium">返回</el-button>            
        </div>
        <el-table stripe :data="dataList" border fit highlight-current-row  :height="nobottommaxH">            			
                <el-table-column align="center" label="订单号" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span >{{scope.row.orderNo}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="交易流水号" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span >{{scope.row.outTradeNo}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="交易金额（元）" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span >{{scope.row.fee}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="交易时间" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span >{{scope.row.tradeTime}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="交易人" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span >{{scope.row.uname}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="交易商户" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span v-if="scope.row.mchType==1" >建行商户</span>
                        <span v-if="scope.row.mchType==2" >微信商户</span>
                        <span v-if="scope.row.mchType==3" >工行商户</span>
                        <span v-if="scope.row.mchType==4" >建融会学</span>
                        <span v-if="scope.row.mchType==5" >农行商户</span>
                        <span v-if="scope.row.mchType==6" >农行二级商户</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="订单来源" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span >{{scope.row.moudelName}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="160" align="center">
                    <template slot-scope="scope">
                         <el-tooltip class="item" effect="dark" :content="scope.row.refundReason" placement="top"  v-if="scope.row.refundStatus==3">
                            <el-button  style="color: #F56C6C;" size="small" type="text">退费失败</el-button>
                        </el-tooltip>                     
                        <el-button size="small" @click="updateBillflowRefunds(scope.row.id)" type="text" v-if="(scope.row.refundStatus==3||scope.row.refundStatus==1)">退费</el-button>
                        <el-button  style="color: #67C23A" size="small" type="text" v-if="scope.row.refundStatus==2">退费成功</el-button>
                    </template>
                </el-table-column>
            </el-table>
    </div>
</template>
<script>
import moment from "moment";
import { queryRepeatBillFlowList, updateBillflowRefund } from "@/api/newcharge";
import baseMixin from "@/mixins/baseMixin";
import mixin from "@/mixins/windowResize";
export default {
  name: "statisticsIndex",
  data() {
    return {
      dataList: [],
      id:this.$route.query.id
    };
  },
  mixins: [baseMixin, mixin],
  created() {
    this.queryRepeatBillFlowLists();
  },
  methods: {
    queryRepeatBillFlowLists() {     
      queryRepeatBillFlowList(this.id)
        .then(res => res.data)
        .then(data => {
          this.dataList=data.data;
        });
    },
    updateBillflowRefunds(id) {
      this.$confirm("是否退费?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          updateBillflowRefund(id)
            .then(res => {
              if (res.data.result) {
                this.$message({
                  type: "success",
                  message: "退费成功!"
                });
                this.queryRepeatBillFlowLists();
              } else {
                this.$message({
                  message: res.data.msg,
                  type: "warning"
                });
              }
            })
            .catch();
        })
        .catch(() => {});
    }
  }
};
</script>

<style lang="scss" scoped>
.accountStatementlist {
  padding:12px;
  .top {
    padding-bottom: 10px;
  }
}
</style>
