<template>
    <div class="transactionFlow">
        <div class="top">
            <!-- <el-button @click="$router.back()" type="default" size="medium">返回</el-button>  -->
            <el-date-picker style="width:220px" v-model="daterange" size="medium" type="daterange" class="mywidthdaterange" range-separator="-" start-placeholder="开始日期" @change="queryBillFlowListfun()" end-placeholder="结束日期" :clearable="false"  ></el-date-picker>
            <el-select class="selectWidth" size="medium" style="width:80px" v-model="pagination.transferFlag" @change="queryBillFlowListfun()" >
                <el-option label='收费' :value="1"> </el-option>
                <el-option label='退费' :value="2"> </el-option>
            </el-select>
             
             <el-checkbox v-model="pagination.paidByBilled" v-if="pagination.transferFlag==1"  @change="queryBillFlowListfun()">对账更新状态</el-checkbox>
             <el-checkbox v-model="pagination.notOneDate" v-if="pagination.transferFlag==1"  @change="queryBillFlowListfun()">交易会计日期不同</el-checkbox>
            <el-checkbox v-model="pagination.repeat" v-if="pagination.transferFlag==1"  @change="queryBillFlowListfun()">只显示订单号重复数据</el-checkbox>
            <a class="export-btn" :href="exportUrl" download="导出" target="_blank" v-if="dataList.length">
                <el-button class="filter-item" type="primary" icon="upload" size="medium">导出</el-button>
            </a>            
            <el-input class="search-input" style="width:20%;float: right;"  placeholder="请输入交易人/订单号" icon="search" size="medium" @change="queryBillFlowListfun()"
                          v-model.trim="pagination.searchVal">
                    <el-button slot="append" icon="el-icon-search" @click="queryBillFlowListfun()"></el-button>
            </el-input>
        </div>
        <el-table stripe :data="dataList" border fit highlight-current-row  :height="maxH">            			
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
                        <span >{{scope.row.uName||scope.row.uname}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="交易商户" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span v-if="scope.row.mchType==1" >微信商户</span>
                        <span v-if="scope.row.mchType==2" >建行商户</span>
                        <span v-if="scope.row.mchType==3" >工行商户</span>
                        <span v-if="scope.row.mchType==4" >建融慧学</span>
                        <span v-if="scope.row.mchType==5" >农行商户</span>
                        <span v-if="scope.row.mchType==6" >农行二级商户</span>
                    </template>
                </el-table-column>
                  <el-table-column align="center" label="费用名称" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span >{{scope.row.goodsName}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="订单来源" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span >{{scope.row.moudelName}}</span>
                    </template>
                </el-table-column>
                <el-table-column property="date" label="对账状态">
                        <template slot-scope="scope">
                            <el-tag  size="mini"  v-if="scope.row.billStatus==2">已对账</el-tag>
                            <el-tag  size="mini" type="warning"   v-if="scope.row.billStatus==1">未对账</el-tag>                        
                       </template>
                </el-table-column>
                <el-table-column align="center" label="对账时间" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span >{{scope.row.billTime}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="160" align="center">
                    <template slot-scope="scope">
                         <el-tooltip class="item" effect="dark" :content="scope.row.refundReason" placement="top"  v-if="scope.row.repeatOrder&&scope.row.refundStatus==3">
                            <el-button  style="color: #F56C6C;" size="small" type="text">退费失败</el-button>
                        </el-tooltip>                     
                        <el-button size="small" @click="updateBillflowRefunds(scope.row.id)" type="text" v-if="scope.row.repeatOrder&&(scope.row.refundStatus==3||scope.row.refundStatus==1)">退费</el-button>
                        <el-button  style="color: #67C23A" size="small" type="text" v-if="scope.row.repeatOrder&&scope.row.refundStatus==2">退费成功</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination-container">
                <el-pagination @size-change="queryBillFlowListfun" @current-change="queryBillFlowListfun"
                               :current-page.sync="pagination.pageNo" :page-sizes="[10, 20, 30, 50]"
                               :page-size.sync="pagination.pageSize" layout="total, sizes, prev, pager, next, jumper"
                               :total="pagination.total">
                </el-pagination>
            </div>
    </div>
</template>
<script>
import moment from "moment";
import { queryBillFlowList, updateBillflowRefund } from "@/api/newcharge";
import baseMixin from "@/mixins/baseMixin";
import mixin from "@/mixins/windowResize";
export default {
  name: "statisticsIndex",
  data() {
    return {
      daterange: [new Date(), new Date()],
      dataList: [],
      exportUrl: "",
      pagination: {
        pageNo: 1,
        pageSize: 20,
        total: null,
        searchVal: "",
        tradeDateStart: "",
        tradeDateEnd: "",
        repeat: false,
        transferFlag: 1,
        paidByBilled:false,
        notOneDate:false
      },
      orderDetailsList: [],
      dialogTableVisible: false,
      content: ""
    };
  },
  mixins: [baseMixin, mixin],
  created() {
    this.daterange[0] = new Date(moment().set("date", 1).valueOf());
    this.queryBillFlowListfun();
  },
  methods: {
    queryBillFlowListfun() {
      this.pagination.tradeDateStart = moment(this.daterange[0]).format(
        "YYYY-MM-DD"
      );
      this.pagination.tradeDateEnd = moment(this.daterange[1]).format(
        "YYYY-MM-DD"
      );
      this.exportUrl = `${
        global.newcharge
      }orderpay/billflow/billFlowListExport?tradeDateEnd=${
        this.pagination.tradeDateEnd
      }&tradeDateStart=${this.pagination.tradeDateStart}&repeat=${
        this.pagination.transferFlag == 1 ? this.pagination.repeat : false
      }&transferFlag=${this.pagination.transferFlag}&notOneDate=${this.pagination.notOneDate}&paidByBilled=${this.pagination.paidByBilled}&searchVal=${
        this.pagination.searchVal
      }&token=${this.$store.getters.token}`;
      queryBillFlowList(this.pagination)
        .then(res => res.data)
        .then(data => {
          this.pagination.total = data.data.pagination.total;
          this.dataList = data.data.dataList;
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
                this.queryBillFlowListfun();
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
<style>
.transactionFlow .el-checkbox{
  margin-right: 5px;
}
</style>

<style lang="scss" scoped>
.transactionFlow {
  padding:12px;
  .top {
    padding-bottom: 10px;
  }
}
</style>
