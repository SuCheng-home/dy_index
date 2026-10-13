<template>
    <div class="restaurantRefundindex">
        <div class="top">
           <el-button @click="$router.back()" type="default" size="medium">返回</el-button> 
                <el-button type="primary"   size="medium" @click="newrefundadd()">新建退款</el-button> 
        </div>
        <div class="time-table">
            <el-table stripe :data="dateList"  border fit highlight-current-row style="width: 100%" :height="maxH">
                <el-table-column align="center" label="名称" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span class="link-type" @click="newrefunddetails(scope.row.batchSn)">{{scope.row.refundname}}</span>
                    </template>
                </el-table-column>
                 <el-table-column align="center" label="时间" show-overflow-tooltip>
                    <template slot-scope="scope">
                     {{scope.row.createTime}}
                    </template>
                </el-table-column>
                <el-table-column  prop="createUserName"  label="创建人" align="center" ></el-table-column>
                <el-table-column  prop="count"  label="退款人数" align="center" ></el-table-column>
                <el-table-column  prop="countFee"  label="退款总金额" align="center" ></el-table-column>
                <el-table-column  prop="refundedCount"  label="已退款人数" align="center" ></el-table-column>  
                <el-table-column  prop="refundedCountFee"  label="已退款金额" align="center" ></el-table-column> 
                <el-table-column align="center" label="状态" width="120px">
                    <template slot-scope="scope">
                      <el-tag  size="mini" v-if="!scope.row.submited" type="info">草稿</el-tag>
                       <el-tag  size="mini" v-if="scope.row.submited" type="success">已发起退款</el-tag>
                    </template>
                </el-table-column>     
                 <el-table-column align="center" label="操作" width="120px">
                    <template slot-scope="scope">
                       <el-button size="small" type="text"  :disabled="scope.row.submited"  @click.native="refundPublish(scope.row.batchSn)" >发起退款</el-button>
                       <el-button size="small" type="text"  :disabled="scope.row.submited"  @click.native="deleteRefundsourceByBatchSn(scope.row.batchSn)"  class="buttontextred" >删除</el-button>
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
import {queryRefundsourceList,refundPublish,deleteRefundsourceByBatchSn} from '@/api/campusFees';
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
        cid:this.$route.query.id
      }
    };
  },
  mixins: [mixin],
  //获取渲染数据当数据加载完成后执行(生命周期中的钩子函数)
  created() {
    this.queryRefundsourceLists();
  },
  methods: {
      handleSizeChange(val) {
                this.query.pageSize = val;
                this.queryRefundsourceLists();
            },
    handleCurrentChange(val) {
                this.query.pageNo = val;
                this.queryRefundsourceLists();
    },
     refundPublish(batchSn){
           this.$confirm("确认要发起退款吗？", "删除", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        lockScroll: false
      }).then(() => {         
          refundPublish(batchSn).then(res => {
            if (res.data.code === 200) {
              this.$message.success("发起退款成功！");
               this.queryRefundsourceLists();
            } else {
              this.$message.error(res.data.msg);
            }
          });
        })
        .catch(() => {});
        },
        deleteRefundsourceByBatchSn(batchSn){
           this.$confirm("确认要删除吗？", "删除", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        lockScroll: false
      }).then(() => {         
          deleteRefundsourceByBatchSn(batchSn).then(res => {
            if (res.data.code === 200) {
              this.$message.success("删除成功！");
               this.queryRefundsourceLists();
            } else {
              this.$message.error(res.data.msg);
            }
          });
        })
        .catch(() => {});
        },
    //获取列表
    queryRefundsourceLists() {
      this.dateList = [];
      queryRefundsourceList(this.query).then(res => {
          let data = res.data.data;
          this.dateList = data.dataList;
          this.total = data.pagination.total;
      });
    },
    //详情
    newrefunddetails(batchSn) {
      this.$router.push({
        path: "newrefunddetails",
        query: {
          batchSn: batchSn,
          cid:this.$route.query.id
        }
      });
    },
    //新增
    newrefundadd(){
      this.$router.push({
        path: "newrefundadd",
        query: {
          id: this.$route.query.id,
          num: this.$route.query.num
        }
      });
    },
  }
};
</script>
<style scoped="scoped">
.restaurantRefundindex {
  padding:12px;
}
.restaurantRefundindex .top {
  padding-bottom: 10px;
}
</style>
