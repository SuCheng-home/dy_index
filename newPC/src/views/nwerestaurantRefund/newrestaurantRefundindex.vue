<template>
    <div class="restaurantRefundindex">
        <div class="top">
            <el-col :span="24">
                <el-button type="primary"   size="medium" @click="newrestaurantRefundadd()">退费</el-button> 
                <el-input class="search-input search-input--right"  size="medium" placeholder="请输入退费名称" icon="el-icon-search" @change="handleInputChange" v-model.trim="query.searchName">
                    <el-button slot="append" icon="el-icon-search" @click="handleInputChange"></el-button>
                </el-input>
            </el-col>
        </div>
        <div class="time-table">
            <el-table stripe :data="dateList"  border fit highlight-current-row style="width: 100%" :height="maxH">
                <el-table-column align="center" label="退费名称" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span class="link-type" @click="newrestaurantRefunddetails(scope.row.id,scope.row.fireType,scope.row.status)">{{scope.row.title}}</span>
                    </template>
                </el-table-column>
                <el-table-column  prop="cName"  label="收费名称"  show-overflow-tooltip></el-table-column>
                <el-table-column   label="停伙时段"   width="240">
                     <template slot-scope="scope">
                       {{scope.row.startDate}}~{{scope.row.endDate}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="类型" width="120px">
                    <template slot-scope="scope">
                       <el-tag  size="mini" v-if="scope.row.fireType==1" type="success">老师</el-tag>
                       <el-tag  size="mini" v-if="scope.row.fireType==2" type="success">学生</el-tag>
                    </template>
                </el-table-column>
                <el-table-column  prop="fireCount"  label="停伙总次数"></el-table-column>
                <el-table-column  prop="userCount"  label="应退费人数"></el-table-column>
                <el-table-column  prop="totalPrice"  label="应退费金额"></el-table-column>
                <el-table-column  prop="realUserCount"  label="实退费人数"></el-table-column>
                <el-table-column  prop="totalReturnMoney"  label="实退费金额"></el-table-column>  
                <el-table-column align="center" label="状态" width="120px">
                    <template slot-scope="scope">
                       <el-tag  size="mini" v-if="scope.row.status==1" >已确认</el-tag>
                       <el-tag  size="mini" v-if="scope.row.status==2" type="success">已退费</el-tag>
                       <el-tag  size="mini" v-if="scope.row.status==0" type="warning">确认中</el-tag>
                    </template>
                </el-table-column>     
                 <el-table-column align="center" label="操作" width="120px">
                    <template slot-scope="scope">
                       <el-button size="small" type="text"  :disabled="scope.row.status==2"  @click.native="deleteFireReturnBatchByIds(scope.row.id)" class="buttontextred">删除</el-button>
                    </template>
                </el-table-column>         
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
import {queryReturnBatch,deleteFireReturnBatchById} from '@/api/newrestaurantRefund';
import _ from "lodash";
import mixin from "@/mixins/windowResize";
export default {
  name: "newrestaurantRefundindex",
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
     deleteFireReturnBatchByIds(id){
           this.$confirm("确认要删除吗？", "删除", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        lockScroll: false
      }).then(() => {         
          deleteFireReturnBatchById(id).then(res => {
            if (res.data.code === 200) {
              this.$message.success("删除成功！");
               this.handleInputChange();
            } else {
              this.$message.error(res.data.msg);
            }
          });
        })
        .catch(() => {});
        },
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
    newrestaurantRefunddetails(id,fireType,status) {
      this.$router.push({
        path: "newrestaurantRefunddetails",
        query: {
          id: id,
          fireType:fireType,
          status:status
        }
      });
    },
    //退费
    newrestaurantRefundadd(){
      this.$router.push({
        path: "newrestaurantRefundadd"
      });
    },
    //就餐停伙  
     newrestaurantRefundregister(){
      this.$router.push({
        path: "newrestaurantRefundregister"
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
  height: 46px;
}
.is-link {
  color: #67c23a;
  cursor: pointer;
}
</style>
