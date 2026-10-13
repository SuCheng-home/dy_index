<template>
    <div class="restaurantRefundindex">
        <div class="top">
            <el-col :span="24">
                <!-- <el-button  @click="$router.back()"  size="medium">返回</el-button> -->
                <el-button type="primary" @click="restaurantRefundadd()" size="medium">退费</el-button>
                <!-- <el-button type="primary" @click="restaurantRefundregister()">就餐停伙</el-button>                 -->
                <el-input class="search-input search-input--right" style="width:20%" size="medium"  placeholder="请输入收费名称" icon="el-icon-search" @change="handleInputChange" v-model.trim="query.searchName">
                    <el-button slot="append" icon="el-icon-search" @click="handleInputChange"></el-button>
                </el-input>
            </el-col>
        </div>
        <div class="time-table">
            <el-table stripe :data="dateList"  border fit highlight-current-row style="width: 100%" :height="maxH">
                <el-table-column align="center" label="收费名称" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span class="is-link" @click="restaurantRefunddetails(scope.row.id)">{{scope.row.cName}}</span>
                    </template>
                </el-table-column>
                <el-table-column   label="停伙时段"   width="240">
                     <template slot-scope="scope">
                       {{scope.row.startDate}}~{{scope.row.endDate}}
                    </template>
                </el-table-column>
                <el-table-column  prop="fireCount"  label="停伙总次数"></el-table-column>
                <el-table-column  prop="userCount"  label="应退费人数"></el-table-column>
                <el-table-column  prop="totalPrice"  label="应退费金额"></el-table-column>
                <el-table-column  prop="realUserCount"  label="实退费人数"></el-table-column>
                <el-table-column  prop="totalReturnMoney"  label="实退费金额"></el-table-column>
            </el-table>
        </div>
        <div class="pagination-container">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                           :current-page.sync="query.pageNo" :page-sizes="[10,20,30, 50]"
                           :page-size="query.pageSize" layout="total, sizes, prev, pager, next, jumper"
                           :total="total">
            </el-pagination>
        </div>
    </div>
</template>
<script>
import moment from "moment";
import {queryReturnBatch} from '@/api/restaurantRefund';
import _ from "lodash";
import mixin from "@/mixins/windowResize";
export default {
  name: "restaurantRefundindex",
  data: function() {
    return {
      dateList: [], //表格主题数据
      total: null,
      query: {
        pageNo: 1, //页数
        pageSize: 20, //条数
        searchName: ""
      }
    };
  },
  mixins: [mixin],
  //获取渲染数据当数据加载完成后执行(生命周期中的钩子函数)
  created() {
    this.queryReturnBatchs();
  },
  methods: {
    //搜索
    handleInputChange() {
        this.queryReturnBatchs();
      },
    //获取列表
    queryReturnBatchs() {
      this.dateList = [];
      queryReturnBatch(this.query).then(res => {
          let data = res.data.data;
          this.dateList = data.dataList;
          this.total = data.pagination.total;
      });
    },
    //切换页码
    handleSizeChange(val) {
      this.query.pageSize = val;
      this.queryReturnBatchs();
    },
    handleCurrentChange(val) {
      this.queryReturnBatchs();
    },
    //详情
    restaurantRefunddetails(id) {
      this.$router.push({
        path: "restaurantRefunddetails",
        query: {
          id: id
        }
      });
    },
    //退费
    restaurantRefundadd(){
      this.$router.push({
        path: "restaurantRefundadd"
      });
    },
    //就餐停伙
     restaurantRefundregister(){
      this.$router.push({
        path: "restaurantRefundregister"
      });
    }
  }
};
</script>
<style scoped="scoped">
.restaurantRefundindex {
  padding:12px;
}
.restaurantRefundindex .top {
  padding-bottom: 10px;
  overflow: hidden;
}
.is-link {
  color: #20a0ff;
  cursor: pointer;
}
</style>
