<template>
    <div class="merchantstatisticslist">
        <div class="top">
            <el-button @click="$router.back()" type="default" size="medium">返回</el-button> 
            <el-date-picker v-model="daterange" size="medium" type="daterange" class="mywidthdaterange" range-separator="-" start-placeholder="开始日期" @change="queryBillFlowListfun()" end-placeholder="结束日期" :clearable="false"  ></el-date-picker>
            <el-select class="selectWidth" size="medium" style="width:120px" v-model="pagination.revenue" @change="queryBillFlowListfun()" >
                <el-option label='全部收支类型' :value="0"> </el-option>
                <el-option label='收' :value="1"> </el-option>
                <el-option label='支' :value="2"> </el-option>
            </el-select> 
        </div>
        <el-table stripe :data="dataList" border fit highlight-current-row  :height="maxH">  
         			
                <el-table-column align="center" label="收支名称" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span >{{scope.row.detailName}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="收支类型" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span >{{scope.row.revenue?"收":"支"}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="金额(元)" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span >{{scope.row.amount}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="操作人" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span >{{scope.row.operuname}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="操作时间" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span >{{scope.row.balmodTime}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="监管账户" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span >{{scope.row.merName}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="交易状态" show-overflow-tooltip>
                    <template slot-scope="scope">
                         <el-tag  size="mini"   type="danger" v-if="!scope.row.alter">失败</el-tag>
                        <el-tag  size="mini"  type="success" v-if="scope.row.alter">成功</el-tag>
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
import {querySubmerhDetailListBySchoolId} from "@/api/newcharge";
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
        revenue: 0,
        balmodTimeStart: "",
        balmodTimeEnd: "",
        subMerId: this.$route.query.subMerId,
      },
      merIdlist:[],
      withdtotal:""
    };
  },
  mixins: [baseMixin, mixin],
  created() {
    this.daterange[0] = new Date(moment().set("date", 1).valueOf()); 
    this.queryBillFlowListfun();   
  },
  methods: {
    queryBillFlowListfun() {
      this.pagination.balmodTimeStart = moment(this.daterange[0]).format(
        "YYYY-MM-DD"
      );
      this.pagination.balmodTimeEnd = moment(this.daterange[1]).format(
        "YYYY-MM-DD"
      );
      querySubmerhDetailListBySchoolId(this.pagination)
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
.merchantstatisticslist {
  padding:12px;
  .top {
    padding-bottom: 10px;
  }
}
</style>
