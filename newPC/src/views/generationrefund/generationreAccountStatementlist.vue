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
                   <div class="h3">{{pagination.billdate}}批量退费对账单</div>
                </el-col>
                <!-- <el-col :span="5">
                    <el-input class="search-input"   placeholder="请输入缴费用户" icon="search" size="medium" @change="queryBillmchListfun()"
                                v-model.trim="pagination.uname">
                            <el-button slot="append" icon="el-icon-search" @click="queryBillmchListfun()"></el-button>
                    </el-input>
                </el-col> -->
            </el-row>  
        </div>
        <el-table stripe :data="dataList" border fit highlight-current-row  :height="maxH">            			
                <el-table-column align="center" label="交易流水号" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span >{{scope.row.responsesn}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="用户编号" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span >{{scope.row.merhId}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="交易金额" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span >{{scope.row.fee}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="交易时间" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span >{{scope.row.billTime}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="退费批次" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span >{{scope.row.refundName}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="关联系统用户" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span >{{scope.row.uname}}</span>
                    </template>
                </el-table-column>
                 <el-table-column align="center" label="关联系统班级/部门" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span >{{scope.row.departName}}</span>
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
import {queryRefundbilldetailList} from "@/api/newcharge";
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
        merhId:this.$route.query.mertId,
        billdate:this.$route.query.date.split("-")[0]+this.$route.query.date.split("-")[1]+this.$route.query.date.split("-")[2]
      },
    };
  },
  mixins: [baseMixin, mixin],
  created() {
    this.queryBillmchListfun();
  },
  methods: {
    queryBillmchListfun() {    
      this.exportUrl = `${global.newcharge}abcpay/refundBill/exportRefundbilldetailList?billdate=${
        this.pagination.billdate
      }&merhId=${
        this.pagination.merhId
      }&billdateformat=${
        this.$route.query.date
      }&token=${this.$store.getters.token}`;
      queryRefundbilldetailList(this.pagination)
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
