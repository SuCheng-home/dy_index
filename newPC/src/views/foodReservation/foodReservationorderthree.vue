<template>
<div class="foodReservationorderthree"  >
    <el-tabs type="border-card"  v-model="activeName" @tab-click="tabsfun()">
      <el-tab-pane label="订单记录" name="one"></el-tab-pane>
      <el-tab-pane label="按老师统计" name="two" v-if="isShowByPermission('/pastry/teacherOrderAnalysis')"></el-tab-pane>
      <el-tab-pane label="签收单" name="three">
          <div class="top"> 
                    <el-row >
                        <el-col :span="19">   
                         <el-date-picker type="date" v-model="time" placeholder="选择日期" @change="searchHandler" size="medium" >
            </el-date-picker>
            <el-select v-model="pagination.typeId" size="medium" placeholder="请选择食品分类" @change="searchHandler()">
                <el-option :label="item.typeName" :value="item.id"  v-for="(item,index) in typelist" :key="index"></el-option>
         </el-select>  
          <el-button class="filter-item" type="primary" size="medium" @click="print()">打印</el-button>
         <a :href="exportURL" download="导出" target="_blank" v-if="dataList.length">
                <el-button class="filter-item" type="primary" size="medium" icon="upload">导出</el-button>
            </a>                       
                        </el-col>
                        <el-col :span="5">
                          <el-input size="medium"  placeholder="请输入姓名" v-model.trim="pagination.searchName" @change="searchHandler"><el-button slot="append" icon="el-icon-search" @click="searchHandler"></el-button></el-input>
                        </el-col>
                    </el-row>                    
            </div>
            <div style="    display: none;">
               <div ref="print" id="print" >
               <div class="titleList" style="line-height: 40px;text-align: center;">{{pagination.date}}签收单</div> 
               <table border="1"  style="border-collapse: collapse;">
  <tr>
    <th>订单人</th>
    <th>下单时间</th>
    <th>订单详情</th>
    <th>订单金额（元）</th>
    <th>实际支付金额（元）</th>
    <th>签字</th>
  </tr>
  <tr v-for="(items,indexs) in dataList" :key="indexs">
    <td>{{items.userName}}</td>
    <td>{{items.createDate.split('.')[0]}}</td>
    <td> <span v-for="(item,index) in items.orderPastryList" :key="index">
                       {{item.pastryName}}  x{{item.quantity}};
                    </span></td>
    <td>{{items.totalAmount/100}}</td>
    <td>
        <span v-if="items.typePayWay==1">{{(items.paidAmount)/100}}</span>
        <span v-else>--</span>
    </td>
    <td></td>
  </tr>
</table>           
             
            </div>
            </div>
            
             <div class="titleList" style="line-height: 40px;text-align: center;">{{pagination.date}}签收单</div>            
             <el-table stripe :data="dataList" border fit highlight-current-row   style="width: 100%" :height="maxH-50"> 
            <el-table-column align="center" label="订单人" show-overflow-tooltip>
                <template slot-scope="scope">
                    <span>{{scope.row.userName}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="下单时间" show-overflow-tooltip>
                <template slot-scope="scope">
                      <span>{{scope.row.createDate.split('.')[0]}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="订单详情" show-overflow-tooltip>
                <template slot-scope="scope">
                    <span v-for="(item,index) in scope.row.orderPastryList" :key="index">
                       {{item.pastryName}}  x{{item.quantity}};
                    </span>
                </template>
            </el-table-column>
             <el-table-column align="center" label="订单金额（元）" show-overflow-tooltip>
                <template slot-scope="scope">
                    <span>{{scope.row.totalAmount/100}}</span>
                </template>
            </el-table-column>
             <el-table-column align="center" label="实际支付金额（元）" show-overflow-tooltip>
                <template slot-scope="scope">
                    <span v-if="scope.row.typePayWay==1">{{(scope.row.paidAmount)/100}}</span>
                    <span v-else>--</span>
                </template>
            </el-table-column>
             <el-table-column align="center" label="签字" show-overflow-tooltip>
                <template slot-scope="scope">
                    <span></span>
                </template>
            </el-table-column>
           
        </el-table>
           
      </el-tab-pane>
      <el-tab-pane label="食品统计" name="four"></el-tab-pane>
    </el-tabs>
</div> 
</template>
<script>
import {
  queryOrderListByTypeIdAndDate,
  getTypeListByUserId
} from "@/api/foodReservation";
import mixin from "@/mixins/windowResize";
import { isShowByPermission} from "@/utils";
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      dataList: [],
      activeName: "three",
      time: new Date(),
      pagination: {
        searchName: "",
        schoolId: "",
        typeId: "",
        date: ""
      },
      typelist: [],
      exportURL: ""
    };
  },
  mixins: [mixin],
  computed: {
    ...mapGetters(["schoolInfo"])
  },
  created() {
    this.pagination.schoolId = this.schoolInfo.id;
    this.pagination.date = moment(this.time).format("YYYY-MM-DD");
    this.getTypeListByUserIds();
  },
  methods: {
    isShowByPermission,
    print() {
      this.$print(this.$refs.print);
    },
    tabsfun() {
      if (this.activeName == "two") {
        this.$router.push({ path: "foodReservationordertwo" });
      } else if (this.activeName == "one") {
        this.$router.push({ path: "foodReservationorderone" });
      } else if (this.activeName == "four") {
        this.$router.push({ path: "foodReservationorderfour" });
      }
    },
    //搜索
    searchHandler() {
      this.queryOrderListByTypeIdAndDates();
    },
    queryOrderListByTypeIdAndDates() {
      this.pagination.date = moment(this.time).format("YYYY-MM-DD");
      this.exportURL =
        global.BasePath +
        "structure/pastry/downOrderListByTypeIdAndDate?date=" +
        this.pagination.date +
        "&searchName=" +
        this.pagination.searchName +
        "&schoolId=" +
        this.pagination.schoolId +
        "&typeId=" +
        this.pagination.typeId +
        "&token=" +
        this.$store.getters.token;
      queryOrderListByTypeIdAndDate(this.pagination)
        .then(res => res.data)
        .then(data => {
          this.dataList = data.data;
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
            this.queryOrderListByTypeIdAndDates();
          }
        });
    }
  }
};
</script>
<style lang="scss" scoped>
.foodReservationorderthree {
  padding: 12px;
  .titleList {
    font-size: 18px;
  }
}
</style>