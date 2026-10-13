<template>
    <div class="campustelephonfour">
        <div class="top">
            <el-date-picker v-model="daterange" size="medium" type="daterange" class="mywidthdaterange" range-separator="-" start-placeholder="开始日期" @change="getVisitorListfun()" end-placeholder="结束日期" :clearable="false"  ></el-date-picker>
              <el-input class="search-input" style="width:20%;float: right;"  placeholder="请输入人员名称" icon="search" size="medium" @change="getVisitorListdun()"
                          v-model.trim="pagination.keywords">
                    <el-button slot="append" icon="el-icon-search" @click="getVisitorListfun()"></el-button>
            </el-input>
        </div>
        <el-table stripe :data="dataList" border fit highlight-current-row  :height="maxH">
                <el-table-column align="center" label="班级" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span >{{scope.row.classDepartName}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="人员编号" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span >{{scope.row.loginName}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="人员姓名" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span >{{scope.row.userName}}</span>
                    </template>
                </el-table-column>
                </el-table-column>
                 <el-table-column align="center" label="卡号" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span >{{scope.row.sid}}</span>
                    </template>
                </el-table-column>
                 <el-table-column align="center" label="公话名称" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span >{{scope.row.devicesName}}</span>
                    </template>
                </el-table-column>                
                 <el-table-column align="center" label="通话日期" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span >{{scope.row.createTime?scope.row.createTime.substring(0, 10):"----"}}</span>
                    </template>
                </el-table-column> 
                <el-table-column align="center" label="接听人" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span >{{scope.row.calledSalutation}}</span>
                    </template>
                </el-table-column>    
                <el-table-column align="center" label="通话类型" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span >{{scope.row.callType}}</span>
                    </template>
                </el-table-column>    
                <el-table-column align="center" label="接听电话" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span >{{scope.row.calledPhoneNumber}}</span>
                    </template>
                </el-table-column>   
                 <el-table-column align="center" label="通话开始时间" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span >{{scope.row.startTime?scope.row.startTime.substring(0, 19):"----"}}</span>
                    </template>
                </el-table-column> 
                <el-table-column align="center" label="通话结束时间" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span >{{scope.row.endTime?scope.row.endTime.substring(0, 19):"----"}}</span>
                    </template>
                </el-table-column>    
                 <el-table-column align="center" label="通话时长（分钟）" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span >{{scope.row.callLen}}</span>
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
import {getTelephoneUserCallRecordForPage} from "@/api/campustelephone";
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
      getTelephoneUserCallRecordForPage(this.pagination)
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
