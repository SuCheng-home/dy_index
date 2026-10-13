<template>
    <div class="newchargechargedetails">
        <div class="top">
             <el-row>
                <el-col :span="5">
                <el-button @click="$router.back()" type="default" size="medium">返回</el-button> 
                    <a class="export-btn" :href="exportUrl" download="导出" target="_blank" v-if="dataList.length">
                        <el-button class="filter-item" type="primary" icon="upload" size="medium">导出</el-button>
                    </a>   
                </el-col>
                <el-col :span="14">
                   <div class="h3">{{pagination.billdate}}银行账单明细</div>
                </el-col>
                <el-col :span="5">
                    <el-input class="search-input"   placeholder="请输入缴费用户" icon="search" size="medium" @change="queryBillmchListfun()"
                                v-model.trim="pagination.uname">
                            <el-button slot="append" icon="el-icon-search" @click="queryBillmchListfun()"></el-button>
                    </el-input>
                </el-col>
            </el-row>  
        </div>
        <el-table stripe :data="dataList" border fit highlight-current-row  :height="maxH">            			
                <el-table-column align="center" label="交易日期" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span >{{scope.row.billdate}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="缴费用户" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span >{{scope.row.uname}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="流水号" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span >{{scope.row.tradeNo}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="缴费项目名称" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span >{{scope.row.paymentItem}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="支付金额（元）" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span >{{scope.row.payFee}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="退款金额（元）" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span >{{scope.row.refundFee}}</span>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination-container">
                <el-pagination @size-change="queryBillmchListfun" @current-change="queryBillmchListfun"
                               :current-page.sync="pagination.pageNo" :page-sizes="[10, 20, 30, 50]"
                               :page-size.sync="pagination.pageSize" layout="total, sizes, prev, pager, next, jumper"
                               :total="pagination.total">
                </el-pagination>
            </div>
    </div>
</template>
<script>
import moment from "moment";
import {queryBillmchList} from "@/api/newcharge";
import baseMixin from "@/mixins/baseMixin";
import mixin from "@/mixins/windowResize";
export default {
  name: "statisticsIndex",
  data() {
    return {
      dataList: [],
      exportUrl: "",
      pagination: {
        pageNo: 1,
        pageSize: 20,
        total: null,
        uname: "",
        id:this.$route.query.dataid,
        billdate:this.$route.query.date
      },
    };
  },
  mixins: [baseMixin, mixin],
  created() {
    this.queryBillmchListfun();
  },
  methods: {
    queryBillmchListfun() {    
      this.exportUrl = `${global.newcharge}orderpay/bill/billmchListExport?billdate=${
        this.pagination.billdate
      }&uname=${this.pagination.uname}&id=${
        this.pagination.id
      }&token=${this.$store.getters.token}`;
      queryBillmchList(this.pagination)
        .then(res => res.data)
        .then(data => {
          this.pagination.total = data.data.pagination.total;
          this.dataList = data.data.dataList;
        });
    },
   
  }
};
</script>

<style lang="scss" scoped>
.newchargechargedetails {
  padding:12px;
  .top {
    padding-bottom: 10px;
  }
  .h3{
      font-size: 20px;
      line-height: 32px;
      text-align: center;
      color:#606266;
  }
}
</style>
