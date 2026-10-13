<template>
<div class="foodReservationorderfour"  >
    <el-tabs type="border-card"  v-model="activeName" @tab-click="tabsfun()">
      <el-tab-pane label="订单记录" name="one"></el-tab-pane>
      <el-tab-pane label="按老师统计" name="two" v-if="isShowByPermission('/pastry/teacherOrderAnalysis')"></el-tab-pane>
      <el-tab-pane label="签收单" name="three"></el-tab-pane>
      <el-tab-pane label="食品统计" name="four">
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
            <el-select v-model="pagination.typeId" size="medium" placeholder="请选择食品分类" @change="searchHandler()">
                <el-option :label="item.typeName" :value="item.id"  v-for="(item,index) in typelist" :key="index"></el-option>
         </el-select>  
         <a :href="exportURL" download="导出" target="_blank" v-if="dataList.length">
                <el-button class="filter-item" type="primary" size="medium" icon="upload">导出</el-button>
            </a>                       
                        </el-col>
                        <el-col :span="5">
                          <!-- <el-input size="medium"  placeholder="请输入名称" v-model.trim="pagination.searchName" @change="searchHandler"><el-button slot="append" icon="el-icon-search" @click="searchHandler"></el-button></el-input> -->
                        </el-col>
                    </el-row>                    
            </div>          
             <el-table stripe :data="dataList" border fit highlight-current-row   style="width: 100%" :height="maxH-100">  
            <el-table-column align="center" label="食品名称" show-overflow-tooltip>
                <template slot-scope="scope">
                    <span>{{scope.row.pastryName}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="数量" show-overflow-tooltip>
                <template slot-scope="scope">
                    <span>{{scope.row.quantity}}</span>
                </template>
            </el-table-column>
        </el-table>
        <div class="pagination-container">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="pagination.pageNo" :page-sizes="[10,20,30, 50]" :page-size.sync="pagination.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="pagination.total"> </el-pagination>
        </div>
      </el-tab-pane>
    </el-tabs>
</div> 
</template>
<script>
import { queryPastryAnalysisByTypeIdAndDateRange,getTypeListByUserId} from "@/api/foodReservation";
import mixin from "@/mixins/windowResize";
import { isShowByPermission} from "@/utils";
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      dataList: [],
      activeName: "four",
      daterange: [new Date(), new Date()],
      pagination: {
        pageNo: 1,
        pageSize: 20,
        total: null,
        searchName: "",
        schoolId: "",
        typeId: "",
        endDate: "",
        startDate: ""
      },
      titleList:0,
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
    this.getTypeListByUserIds();
  },
  methods: {
    isShowByPermission,
     tabsfun(){
                if(this.activeName=='two'){
                    this.$router.push({ path:'foodReservationordertwo' })
                }else if(this.activeName=='three'){
                    this.$router.push({ path:'foodReservationorderthree' })
                }else if(this.activeName=='one'){
                    this.$router.push({ path:'foodReservationorderone' })
                }

            },
    //搜索
    searchHandler() {
      this.pagination.pageNo = 1;
      this.queryPastryAnalysisByTypeIdAndDateRanges();
    },
    //码数
    handleSizeChange() {
      this.pagination.pageNo = 1;
      this.queryOrderListByTypeIdAndDateRanges();
    },
    //页数
    handleCurrentChange() {
      this.queryPastryAnalysisByTypeIdAndDateRanges();
    },
    queryPastryAnalysisByTypeIdAndDateRanges() {
      this.pagination.startDate = moment(this.daterange[0]).format("YYYY-MM-DD");
      this.pagination.endDate = moment(this.daterange[1]).format("YYYY-MM-DD");
      this.exportURL = global.BasePath + 'structure/pastry/downPastryAnalysisByTypeIdAndDateRange?endDate=' + this.pagination.endDate+'&searchName=' + this.pagination.searchName +'&schoolId=' + this.pagination.schoolId +'&typeId=' + this.pagination.typeId +'&startDate=' + this.pagination.startDate + '&token=' + this.$store.getters.token;
      queryPastryAnalysisByTypeIdAndDateRange(this.pagination)
        .then(res => res.data)
        .then(data => {
          this.pagination.total = data.data.pagination.total;
          this.dataList = data.data.dataList;
          this.titleList=data.data.titleList;
        });
    },
    //获取类型
    getTypeListByUserIds() {
      getTypeListByUserId()
        .then(res => res.data)
        .then(data => {
          this.typelist = data.data;
          if (this.typelist.length) {
            this.pagination.typeId = this.typelist[0].id;
            this.bigishide = 1;
            this.queryPastryAnalysisByTypeIdAndDateRanges();
          }
        });
    }
  }
};
</script>
<style lang="scss" scoped>
.foodReservationorderfour {
  padding: 12px;
  .top {
    padding-bottom: 10px;
  }
}
</style>