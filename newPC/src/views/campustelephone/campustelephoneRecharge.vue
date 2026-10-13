<template>
    <div class="campustelephonfour">
        <div class="top">
            <el-date-picker v-model="daterange" size="medium" type="daterange" class="mywidthdaterange" range-separator="-" start-placeholder="开始日期" @change="getVisitorListfun()" end-placeholder="结束日期" :clearable="false"  ></el-date-picker>
              <a :href="exportUrl" target="_blank" download="导出结果" v-if="dataList.length">
                                <el-button type="primary" size="medium">导出</el-button>
                            </a>
              <el-input class="search-input" style="width:20%;float: right;"  placeholder="请输入充值人或订单号" icon="search" size="medium" @change="getVisitorListdun()"
                          v-model.trim="pagination.keywords">
                    <el-button slot="append" icon="el-icon-search" @click="getVisitorListfun()"></el-button>
            </el-input>
        </div>
          <el-table stripe :data="dataList" border fit highlight-current-row  :height="maxH">
                <el-table-column align="center" label="订单号" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span >{{scope.row.orderNo}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="充值人" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span >{{scope.row.userName}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="部门" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span >{{scope.row.classDepartName}}</span>
                    </template>
                </el-table-column>
                </el-table-column>
                 <el-table-column align="center" label="交易流水号" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span >{{scope.row.transNo}}</span>
                    </template>
                </el-table-column>             
                 <el-table-column align="center" label="订单创建时间" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span >{{scope.row.createTime?scope.row.createTime.substring(0, 19):"----"}}</span>
                    </template>
                </el-table-column> 
                <el-table-column align="center" label="充值包名称" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span >{{scope.row.packageName}}</span>
                    </template>
                </el-table-column>    
                <el-table-column align="center" label="金额(元)" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span >{{scope.row.money/100}}</span>
                    </template>
                </el-table-column>     
                 <el-table-column align="center" label="到账时间" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span >{{scope.row.updateTime?scope.row.updateTime.substring(0, 19):"----"}}</span>
                    </template>
                </el-table-column> 
                 <el-table-column align="center" label="充值后时长(分钟)" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span >{{scope.row.surplusCallLen}}</span>
                    </template>
                </el-table-column>   
            </el-table>
            <div class="pagination-container">
                <el-pagination @size-change="getVisitorListfun" @current-change="getVisitorListfun"
                               :current-page.sync="pagination.pageNo" :page-sizes="[10, 20, 30, 50]"
                               :page-size.sync="pagination.pageSize" layout="total, sizes, prev, pager, next, jumper"
                               :total="pagination.total">
                </el-pagination>
            </div>
    </div>
</template>
<script>
import moment from "moment";
import {getTelephoneUserRechargeRecordForPage} from "@/api/campustelephone";
import baseMixin from "@/mixins/baseMixin";
import mixin from "@/mixins/windowResize";
export default {
  data() {
    return {
      daterange: [new Date(), new Date()],
      dataList: [],
      exportUrl: "",
      pagination: {
        pageNo: 1,
        pageSize: 20,
        total: null,
        keywords: "",
        startDate: "",
        endDate: "",
      },
      selected: [],
      exportUrl:""
    };
  },
  mixins: [baseMixin, mixin],
  created() {
    this.daterange[0] = new Date(moment().set("date", 1).valueOf());
    this.getVisitorListfun();
  },
  methods: {
       
    getVisitorListfun() {
      this.pagination.startDate = moment(this.daterange[0]).format(
        "YYYY-MM-DD"
      );
      this.pagination.endDate = moment(this.daterange[1]).format(
        "YYYY-MM-DD"
      );
        this.exportUrl = `${global.newcard}structure/telephoneUser/exportTelephoneUserRechargeRecord?token=${this.$store.getters.token}&endDate=${this.pagination.endDate}&startDate=${this.pagination.startDate}`;
      getTelephoneUserRechargeRecordForPage(this.pagination)
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
.campustelephonfour {
  padding:12px;
  .top {
    padding-bottom: 10px;
  }
  .img{
      height: 20px;
  }
}
</style>
