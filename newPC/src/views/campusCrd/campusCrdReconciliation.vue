<template>
  <div class="campusCrdReconciliation"> 
    <!-- <el-tabs type="border-card"  v-model="activeName" @tab-click="campusCrdindex()">
      <el-tab-pane label="学生卡" name="one"></el-tab-pane>
      <el-tab-pane label="老师卡" name="two"  v-if="isShowByPermission('/campusCard/isManager')"></el-tab-pane>
      <el-tab-pane label="班级卡" name="three" v-if="isShowByPermission('/campusCard/isManager')"></el-tab-pane> -->
<!--      <el-tab-pane label="班级卡扫码动态" name="four" v-if="isShowByPermission('/elasticSchool/threeCard')"></el-tab-pane>-->
<!--      <el-tab-pane label="班级卡扫码静态" name="five" v-if="isShowByPermission('/elasticSchool/threeCard')"></el-tab-pane>-->
<!--      <el-tab-pane label="社团卡扫码" name="six" v-if="isShowByPermission('/elasticSchool/threeCard')"></el-tab-pane>-->
       <!-- <el-tab-pane label="一卡通对账" name="seven" > -->
            <div class="top">
                <a target="_blank" :href="exportURL" download="导出" v-if="dataList.length">
                                <el-button class="filter-item" type="primary" size="medium" icon="upload">导出</el-button>
                            </a>
                <el-checkbox v-model="pagination.stateReal" @change="listRechargeThirds()">只显示充值记录异常数据</el-checkbox>
                <el-input class="search-input search-input--right" size="medium" placeholder="请输入充值人姓名或订单号" v-model.trim="pagination.search" @input="listRechargeThirds()">
                    <el-button slot="append" icon="el-icon-search" @click="listRechargeThirds()"></el-button>
                </el-input>
            </div>  
            <el-table stripe :data="dataList" border fit highlight-current-row  :height="maxH">            			
                <el-table-column align="center" label="订单号" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span  :class="{'red' : scope.row.state==3}">{{scope.row.orderNo}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="充入账号" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span :class="{'red' : scope.row.state==3}">{{scope.row.loginName}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="充值人" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span :class="{'red' : scope.row.state==3}">{{scope.row.userName}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="所在班级/部门" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span :class="{'red' : scope.row.state==3}">{{scope.row.departName}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="交易流水号" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span :class="{'red' : scope.row.state==3}">{{scope.row.transNo}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="充值渠道（终端）" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span  :class="{'red' : scope.row.state==3}">{{scope.row.rechargeTypeName}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="支付时间" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span :class="{'red' : scope.row.state==3}">{{scope.row.updateTime}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="充值金额（元）" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span :class="{'red' : scope.row.state==3}">{{scope.row.moneyY}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="实际到账时间" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span v-if="scope.row.state==5" :class="{'red' : scope.row.state==3}">{{scope.row.rechargeTime?scope.row.rechargeTime.split(".")[0]:"----"}}</span>
                        <span v-else :class="{'red' : scope.row.state==3}">----</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="实际到账金额（元）" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span v-if="scope.row.state==5" :class="{'red' : scope.row.state==3}">{{scope.row.amount2}}</span>
                        <span v-else :class="{'red' : scope.row.state==3}">----</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="160" align="center">
                    <template slot-scope="scope">
                          <el-button  v-if="scope.row.state==3" size="small" @click="getUpdatetOrders(scope.row.orderNo)" type="text">重试</el-button>  
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination-container">
                <el-pagination @size-change="listRechargeThirds" @current-change="listRechargeThirds"
                               :current-page.sync="pagination.pageNo" :page-sizes="[10, 20, 30, 50]"
                               :page-size.sync="pagination.pageSize" layout="total, sizes, prev, pager, next, jumper"
                               :total="pagination.total">
                </el-pagination>
            </div>      
       <!-- </el-tab-pane> -->
    <!-- </el-tabs>   -->
  </div>
</template>
<script>
import mixin from "@/mixins/windowResize";
import { mapGetters } from "vuex";
import {listRechargeThird,getUpdatetOrder} from "@/api/campusCrd";
import { isShowByPermission } from "@/utils/utils";
export default {
  data() {
    return {
      dataList: [],
      activeName: "seven",
       pagination: {
        pageNo: 1,
        pageSize: 20,
        total: null,
        search: "",
        stateReal:false        
      },
      exportURL:""
    };
  },
  created() {
      this.listRechargeThirds();
  },
  computed: {
    ...mapGetters(["userInfo"])
  },
  mixins: [mixin],
  methods: {
       //重试
    getUpdatetOrders(sid) {
      this.$confirm("确认要重试吗？", "重试", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        lockScroll: false
      }).then(() => {         
          getUpdatetOrder(sid).then(res => {
            if (res.data.code === 200) {
              this.$message.success("重试成功");
            } else {
              this.$message.error(res.data.msg);
            }
          });
        })
        .catch(() => {});
    },
    isShowByPermission,
    listRechargeThirds(){        
       this.exportURL=global.newcard+'structure/oneCartoon/listRechargeThirdExport?stateReal='+(this.pagination.stateReal?2:1)+'&token='+ this.$store.getters.token;
       listRechargeThird(this.pagination)
        .then(res => res.data)
        .then(data => {
          this.pagination.total = data.data.pagination.total;
          this.dataList = data.data.dataList;
        });
    },
    //卡
    campusCrdindex() {
      if (this.activeName == "one") {
        this.$router.push({
          path: "campusCrdindexone"
        });
      }
      if (this.activeName == "three") {
        this.$router.push({
          path: "campusCrdindexthree"
        });
      }
      if (this.activeName == "four") {
        this.$router.push({
          path: "campusCrdindexfour"
        });
      }
      if (this.activeName == "five") {
        this.$router.push({
          path: "campusCrdindexfive"
        });
      }
      if (this.activeName == "six") {
        this.$router.push({
          path: "campusCrdindexsix"
        });
      }
      if (this.activeName == "two") {
        this.$router.push({
          path: "campusCrdindextwo"
        });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.campusCrdReconciliation {
  padding: 12px;
  box-sizing: border-box;
  .top {
    padding-bottom: 10px;
    overflow: hidden;
    .search-input--right {
      width: 20% !important;
      float: right;
    }
  }
  .red{
      color:#F56C6C;
  }
}
</style>
