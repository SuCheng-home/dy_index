<template>
<div class="foodReservationordertwo"  >
    <el-tabs type="border-card"  v-model="activeName" @tab-click="tabsfun()">
      <el-tab-pane label="订单记录" name="one"></el-tab-pane>
      <el-tab-pane label="按老师统计" name="two">
          <div class="top"> 
                    <el-row >
                        <el-col :span="19">   
                           <el-date-picker
                v-model="daterange" size="medium"
                type="daterange" class="mywidthdaterange"
                range-separator="-"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :clearable="false"  @change="searchHandler()"
            >
            </el-date-picker> 
         <a :href="exportURL" download="导出" target="_blank" v-if="dataList.length">
                <el-button class="filter-item" type="primary" size="medium" icon="upload">导出</el-button>
            </a>                       
                        </el-col>
                        <el-col :span="5">
                          <el-input size="medium"  placeholder="请输入姓名" v-model.trim="pagination.searchName" @change="searchHandler"><el-button slot="append" icon="el-icon-search" @click="searchHandler"></el-button></el-input>
                        </el-col>
                    </el-row>                    
            </div>            
             <el-table stripe :data="dataList" border fit highlight-current-row   style="width: 100%" :height="maxH-70"> 
            <el-table-column align="center" label="订单人" show-overflow-tooltip>
                <template slot-scope="scope">
                    <span class="link-type" @click="foodReservationorderpersonal(scope.row.userName,scope.row.userId)">{{scope.row.userName}}</span>
                </template>
            </el-table-column>
             <el-table-column align="center" label="订单总额（元）" show-overflow-tooltip>
                <template slot-scope="scope">
                    <span>{{scope.row.totalAmount/100}}</span>
                </template>
            </el-table-column>
             <el-table-column align="center" label="实际总额（元）" show-overflow-tooltip>
                <template slot-scope="scope">
                    <span v-if="(scope.row.totalAmount-scope.row.refundAmount)/100">{{(scope.row.totalAmount-scope.row.refundAmount)/100}}</span>
                    <span v-else>--</span>
                </template>
            </el-table-column>
             <el-table-column align="center" label="共支付（元）" show-overflow-tooltip>
                <template slot-scope="scope">
                    <span v-if="scope.row.paidAmount/100">{{scope.row.paidAmount/100}}</span>
                    <span v-else>--</span>
                </template>
            </el-table-column>           
        </el-table>
        <div class="pagination-container">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="pagination.pageNo" :page-sizes="[10,20,30, 50]" :page-size.sync="pagination.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="pagination.total"> </el-pagination>
        </div>
      </el-tab-pane>
      <el-tab-pane label="签收单" name="three"></el-tab-pane>
      <el-tab-pane label="食品统计" name="four"></el-tab-pane>
    </el-tabs>
</div> 
</template>
<script>
import { queryTeacherAnalysisByDateRange} from "@/api/foodReservation";
import mixin from "@/mixins/windowResize";
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      dataList: [],
      activeName: "two",
      daterange: [new Date(), new Date()],
      pagination: {
        pageNo: 1,
        pageSize: 20,
        total: null,
        searchName: "",
        schoolId: "",
        endDate: "",
        startDate: ""
      },
      typelist:[],
      exportURL:''
    };
  },
  mixins: [mixin],
  computed: {
    ...mapGetters(["schoolInfo"])
  },
  created() {
    this.pagination.schoolId = this.schoolInfo.id;
    this.daterange[0] = new Date(moment() .set("date", 1).valueOf());
    this.queryTeacherAnalysisByDateRanges();
  },
  methods: {
    foodReservationorderpersonal(name,id){
       this.$router.push({ path:'foodReservationorderpersonal',query: {name:name,id: id,startDate:this.pagination.startDate,endDate:this.pagination.endDate} })
    },
     tabsfun(){
                if(this.activeName=='one'){
                    this.$router.push({ path:'foodReservationorderone' })
                }else if(this.activeName=='three'){
                    this.$router.push({ path:'foodReservationorderthree' })
                }else if(this.activeName=='four'){
                    this.$router.push({ path:'foodReservationorderfour' })
                }

            },
    //搜索
    searchHandler() {
      this.pagination.pageNo = 1;
      this.queryTeacherAnalysisByDateRanges();
    },
    //码数
    handleSizeChange() {
      this.pagination.pageNo = 1;
      this.queryTeacherAnalysisByDateRanges();
    },
    //页数
    handleCurrentChange() {
      this.queryTeacherAnalysisByDateRanges();
    },
    queryTeacherAnalysisByDateRanges() {
      this.pagination.startDate = moment(this.daterange[0]).format("YYYY-MM-DD");
      this.pagination.endDate = moment(this.daterange[1]).format("YYYY-MM-DD");
      this.exportURL = global.BasePath + 'structure/pastry/downTeacherAnalysisByDateRange?endDate=' + this.pagination.endDate+'&searchName=' + this.pagination.searchName +'&schoolId=' + this.pagination.schoolId +'&typeId=' + this.pagination.typeId +'&startDate=' + this.pagination.startDate + '&token=' + this.$store.getters.token;
      queryTeacherAnalysisByDateRange(this.pagination)
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
.foodReservationordertwo {
  padding: 12px;
  .top {
    padding-bottom: 10px;
  }
}
</style>