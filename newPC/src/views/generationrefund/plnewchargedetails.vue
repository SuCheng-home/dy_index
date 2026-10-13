<template>
    <div class="plnewchargedetails">
        <div class="top">
            <el-date-picker v-model="daterange" size="medium" type="daterange" class="mywidthdaterange" range-separator="-" start-placeholder="开始日期" @change="queryPayRefundapplyDetailListByDate()" end-placeholder="结束日期" :clearable="false"  ></el-date-picker>
               <a  :href="exportUrl" download="导出" target="_blank" v-if="dataList.length">
                        <el-button class="filter-item" type="primary" icon="upload" size="medium">导出</el-button>
                    </a>   
         </div>
        <el-table stripe :data="dataList" border fit highlight-current-row  :height="maxH">            			
                <el-table-column align="center" label="姓名" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span >{{scope.row.uname}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="部门班级" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span >{{scope.row.departName}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="退款卡号" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span >{{scope.row.refundAcct}}</span>
                    </template>
                 </el-table-column>
                <el-table-column align="center" label="持卡人姓名" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span >{{scope.row.refundaAcctName}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="应退金额（元）" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span >{{scope.row.fee}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="实退金额（元）" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span >{{scope.row.refundedfee}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="批次" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span >{{scope.row.refundName}}</span>
                    </template>
                </el-table-column>
                 <el-table-column align="center" label="退款进度" width="120px">
                    <template slot-scope="scope">
                      <el-tag  size="mini" v-if="scope.row.status==1" >申请通过</el-tag>
                       <el-tag  size="mini" v-if="scope.row.status==2" type="danger">申请未通过</el-tag>
                       <el-tag  size="mini" v-if="scope.row.status==3" type="warning">请求中</el-tag>
                       <el-tag  size="mini" v-if="scope.row.status==4" type="success">交易成功</el-tag>
                       <el-tooltip class="item" effect="dark" v-if="scope.row.status==5" :content="scope.row.reason" placement="top">
                          <el-tag size="mini"  type="danger">交易失败</el-tag>
                       </el-tooltip>
                    </template>
                </el-table-column>   
                <el-table-column align="center" label="时间" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span >{{scope.row.createTime}}</span>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination-container">
                <el-pagination @size-change="queryPayRefundapplyDetailListByDate" @current-change="queryPayRefundapplyDetailListByDate"
                               :current-page.sync="pagination.pageNo" :page-sizes="[10, 20, 30, 50]"
                               :page-size.sync="pagination.pageSize" layout="total, sizes, prev, pager, next, jumper"
                               :total="pagination.total">
                </el-pagination>
            </div>
    </div>
</template>
<script>
import moment from "moment";
import {queryPayRefundapplyDetailListByDate} from "@/api/newcharge";
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
        end:'',
        start:''
      },
       exportUrl: "",
    };
  },
  mixins: [baseMixin, mixin],
  created() {
    this.daterange[0] = new Date(moment().set("date", 1).valueOf());
    this.queryPayRefundapplyDetailListByDate();
  },
  methods: {
    queryPayRefundapplyDetailListByDate() {
      this.pagination.start = moment(this.daterange[0]).format(
        "YYYY-MM-DD"
      );
      this.pagination.end = moment(this.daterange[1]).format(
        "YYYY-MM-DD"
      );
       this.exportUrl = `${global.newcharge}abcpay/refundapplyDetail/exportPayRefundapplyDetailListByDate?start=${
        this.pagination.start
      }&end=${
        this.pagination.end
      }&token=${this.$store.getters.token}`;
      queryPayRefundapplyDetailListByDate(this.pagination)
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
.plnewchargedetails {
  padding:12px;
  .top {
    padding-bottom: 10px;
  }
}
</style>
