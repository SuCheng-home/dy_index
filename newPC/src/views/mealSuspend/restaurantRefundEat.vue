<template>
    <div class="restaurantRefundEat">
      <el-tabs type="border-card"  v-model="activeName" @tab-click="tabsfun()">
      <el-tab-pane label="登记统计" name="one"></el-tab-pane>
      <el-tab-pane label="停伙就餐统计" name="two">
        <div class="top">              
            <el-col :span="24">     
                <el-date-picker   v-model="daterange" type="daterange" class="right-line mywidthdaterange"   size="medium"  range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" :clearable="false" @change="findDate()"></el-date-picker>
                 <a :href="downLoadHref" target="_blank" download="examName" v-if="dateList.length"> <el-button  size="medium" type="primary">导出</el-button></a>   
                <el-input class="search-input search-input--right" size="medium" placeholder="请输入姓名" icon="el-icon-search" @change="handleInputChange" v-model.trim="query.searchName">
                    <el-button slot="append" size="medium" icon="el-icon-search" @click="handleInputChange"></el-button>
                </el-input>
            </el-col>
        </div>
        <div class="time-table">
            <el-table stripe :data="dateList"  border fit highlight-current-row style="width: 100%" :height="maxH-70">  
                <el-table-column  prop="userName" align="center" label="姓名" show-overflow-tooltip></el-table-column>
                <el-table-column  prop="repastDate"  align="center" label="日期" show-overflow-tooltip></el-table-column>
                <el-table-column  align="center" label="就餐类型" show-overflow-tooltip>
                   <template slot-scope="scope">
                           <span v-if="scope.row.mealType==0">早餐</span>
                           <span v-if="scope.row.mealType==1">午餐</span>
                           <span v-if="scope.row.mealType==2">午间餐</span>
                           <span v-if="scope.row.mealType==3">晚餐</span>
                    </template>
                </el-table-column>
                <el-table-column  align="center" label="停伙时间"  show-overflow-tooltip>
                  <template slot-scope="scope">
                          {{scope.row.fireCreateDate.split('.')[0]}}
                    </template>
                </el-table-column>
                <el-table-column  align="center" label="就餐时间" show-overflow-tooltip>
                  <template slot-scope="scope">
                          {{scope.row.createDate.split('.')[0]}}
                    </template>
                </el-table-column>   
                <el-table-column  prop="restaurantName" align="center" label="就餐地点" show-overflow-tooltip></el-table-column>             
            </el-table>
        </div>
        <div class="pagination-container">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                           :current-page.sync="query.pageNo" :page-sizes="[10,20,30, 50]"
                           :page-size="query.pageSize" layout="total, sizes, prev, pager, next, jumper"
                           :total="total">
            </el-pagination>
        </div>
      </el-tab-pane>
</el-tabs>
        
    </div>
</template>
<script>
import moment from "moment";
import {queryRepastUserFire} from '@/api/restaurantRefund';
import _ from "lodash";
import mixin from "@/mixins/windowResize";
export default {
  name: "restaurantRefundindex",
  data: function() {
    return {
      daterange:[new Date(), new Date()],
      dateList: [], //表格主题数据     
      total: null,
      query: {
        pageNo: 1, //页数
        pageSize: 20, //条数
        searchName: "",
        startDate:'',
        endDate:'',
        departId:0,//	部门id，0代表全部	number
        repastType:2,//	就餐类型，1就餐，0不就餐，0全部	number	
      },
      downLoadHref:'',
      activeName:'two'
    };
  },
  mixins: [mixin],
  //获取渲染数据当数据加载完成后执行(生命周期中的钩子函数)
  created() {
    this.daterange[0] = new Date(this.$moment().set('date', 1).valueOf());
    this.query.startDate = this.$moment(this.daterange[0]).format('YYYY-MM-DD'); //时间
    this.query.endDate = this.$moment(this.daterange[1]).format('YYYY-MM-DD');
    this.queryRepastUserFires();
   
  },
  methods: {
    //时间
    findDate(){
      this.query.startDate = this.$moment(this.daterange[0]).format('YYYY-MM-DD'); //时间
      this.query.endDate = this.$moment(this.daterange[1]).format('YYYY-MM-DD'); //时间
      this.query.pageNo=1;
      this.queryRepastUserFires();
    },  
    //搜索
    handleInputChange() {
        this.query.pageNo = 1;
        this.queryRepastUserFires();
      },
    //获取列表
    queryRepastUserFires() {
      this.dateList = [];
      this.downLoadHref =
        global.BasePath +
        "structure/repastManagement/downRepastUserFire?endDate=" +
        this.query.endDate +      
        "&searchName=" +
        this.query.searchName +
         "&startDate=" +
        this.query.startDate +
        "&token=" +
        this.$store.getters.token;
      queryRepastUserFire(this.query).then(res => {
          let data = res.data.data;
          this.dateList = data.dataList;
          this.total = data.pagination.total;
      });
    },
    //切换页码
    handleSizeChange(val) {
       this.query.pageNo = 1;
      this.query.pageSize = val;
      this.queryRepastUserFires();
    },
    handleCurrentChange(val) {
      this.queryRepastUserFires();
    },    
    //登记  
    tabsfun(){
      if(this.activeName=='one'){
        this.$router.push({
        path: "restaurantRefundregister"
      })
      }      
    },
   
  }
};
</script>
<style scoped="scoped">
.restaurantRefundEat {
  padding: 12px; 
}
.search-input--right{
        width: 25% !important;
}
.el-select{
    width:120px;
}
.top { 
 padding-bottom: 10px;
 overflow: hidden;
}
.top-top{
    margin-bottom: 10px;
    overflow: hidden;
}
.button{
    box-sizing: border-box;
    width: 50%;
    text-align: center;   
    float: left;
    height: 36px;
    line-height: 36px;
    border: 1px solid #dcdfe6;
    color: #606266;
    cursor:pointer ;
}
.button-box{
    border-radius: 5px;
    overflow: hidden;
}
.color{
    color: #fff;
    background: #409eff;
    border: 1px #409eff solid;
}
</style>
