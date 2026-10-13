<template>
    <div class="transactionFlow">
        <div class="top">
            <!-- <el-button @click="$router.back()" type="default" size="medium">返回</el-button>  -->
            <el-date-picker v-model="daterange" size="medium" type="daterange" class="mywidthdaterange" range-separator="-" start-placeholder="开始日期" @change="queryBillFlowListfun()" end-placeholder="结束日期" :clearable="false"  ></el-date-picker>
            <el-select class="selectWidth" size="medium" style="width:150px" v-model="pagination.tradeType" @change="queryBillFlowListfun()" >
                <el-option label='订单收款' :value="1"> </el-option>
                <el-option label='代收收款' :value="2"> </el-option>
                <el-option label='原路退款（订单退款）' :value="3"> </el-option>
                <el-option label='代付退款' :value="4"> </el-option>
            </el-select>
            <el-select class="selectWidth" size="medium" style="width:150px" v-model="pagination.success" @change="queryBillFlowListfun()" >
                <el-option label='下发失败' :value="0"> </el-option>
                <el-option label='下发成功' :value="1"> </el-option>
            </el-select>                  
            <el-input class="search-input" style="width:20%;float: right;"  placeholder="请输入订单号" icon="search" size="medium" @change="queryBillFlowListfun()"
                          v-model.trim="pagination.orderNo">
                    <el-button slot="append" icon="el-icon-search" @click="queryBillFlowListfun()"></el-button>
            </el-input>
        </div>
        <el-table stripe :data="dataList" border fit highlight-current-row  :height="maxH">            			
                <el-table-column align="center" label="订单号" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span >{{scope.row.orderNo}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="订单金额（元）" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span >{{scope.row.orderfee}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="订单来源" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span >{{scope.row.moduleName}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="交易类型" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span v-if="scope.row.tradeType==1">订单收款</span>
                        <span v-if="scope.row.tradeType==2">代收收款</span>
                        <span v-if="scope.row.tradeType==3">原路退款（订单退款）</span>
                        <span v-if="scope.row.tradeType==4">代付退款</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="交易标识" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span >{{scope.row.tradeNo}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="交易金额（元）" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span >{{scope.row.tradefee}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="交易人" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span >{{scope.row.tradeName}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="交易时间" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span >{{scope.row.tradeDate}}</span>
                    </template>
                </el-table-column>
                <el-table-column property="date" label="下发状态">
                        <template slot-scope="scope">
                            <el-tag  size="mini"  v-if="scope.row.success">下发成功</el-tag>
                            <el-tag  size="mini" type="warning" v-else >下发失败</el-tag>                        
                       </template>
                </el-table-column>
                <el-table-column align="center" label="最近下发时间" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span >{{scope.row.updateTime}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="160" align="center">
                    <template slot-scope="scope">   
                        <el-button size="small" @click="updateRetry(scope.row.id)" type="text" v-if="!scope.row.success">重新下发</el-button>
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
import { queryDispatchrecordList, updateRetry } from "@/api/newcharge";
import baseMixin from "@/mixins/baseMixin";
import mixin from "@/mixins/windowResize";
export default {
  name: "statisticsIndex",
  data() {
    return {
      daterange: [new Date(), new Date()],
      dataList: [],
      pagination: {
        pageNo: 1,
        pageSize: 20,
        total: null,
        orderNo: "",
        tradeDateStart: "",
        tradeDateEnd: "",
        success: 0,
        tradeType: 1
      }
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
      queryDispatchrecordList(this.pagination)
        .then(res => res.data)
        .then(data => {
          this.pagination.total = data.data.pagination.total;
          this.dataList = data.data.dataList;
        });
    },
    updateRetry(id) {
      this.$confirm("是否重新下发?", "重新下发", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          updateRetry(id)
            .then(res => {
              if (res.data.result) {
                this.$message({
                  type: "success",
                  message: "重新下发成功!"
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

<style lang="scss" scoped>
.transactionFlow {
  padding:12px;
  .top {
    padding-bottom: 10px;
  }
}
</style>
