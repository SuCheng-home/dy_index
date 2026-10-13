<template>
    <div class="nonTaxRefundList">
        <div class="top">          
           <el-button @click="$router.back()" type="default" size="medium">返回</el-button> 
           <el-button @click="batchFeesubmit()" type="primary" size="medium" v-if="status==1">发布</el-button>
           <el-button @click="sendNotify()" type="primary" size="medium" v-if="status==2">推送未缴提醒</el-button>
           <el-button @click="nonTaxRefundAdd()" type="primary" size="medium" >补录</el-button>
           <el-input class="search-input" style="width:20%;float: right;"  
                          placeholder="请输入姓名" icon="search" size="medium" @change="finaceOrderlist()"
                          v-model.trim="pagination.serchval">
                    <el-button slot="append" icon="el-icon-search" @click="finaceOrderlist()"></el-button>
            </el-input>
        </div>
        <el-table stripe :data="dataList" border fit highlight-current-row  :height="maxH"> 
                 <el-table-column align="center" label="学号"  show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span>{{scope.row.loginname}}</span>
                    </template>
                </el-table-column> 
                  <el-table-column align="center" label="姓名"  show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span>{{scope.row.uName}}</span>
                    </template>
                </el-table-column> 
                  <el-table-column align="center" label="班级"  show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span>{{scope.row.departName}}</span>
                    </template>
                </el-table-column> 
                <el-table-column align="center" label="缴款码"  show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span>{{scope.row.orderId}}</span>
                    </template>
                </el-table-column> 
                 <el-table-column align="center" label="账单金额（元）"  show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span>{{scope.row.payMoney/100}}</span>
                    </template>
                </el-table-column>
                 <el-table-column align="center" label="发送状态"  v-if="status==2">
                    <template slot-scope="scope">
                        <el-tag  size="mini" type="danger"     v-if="scope.row.sendStatus==1">未发送</el-tag>
                        <el-tag  size="mini" type="success"  v-else="scope.row.sendStatus==2">已发送</el-tag>
                    </template>
                </el-table-column>
                 <el-table-column align="center" label="支付状态"  v-if="status==2">
                    <template slot-scope="scope">
                        <el-tag  size="mini" type="danger"     v-if="scope.row.status==1">未支付</el-tag>
                        <el-tag  size="mini" type="success"  v-else="scope.row.status==2">已支付</el-tag>
                    </template>
                </el-table-column>
                 <el-table-column align="center" label="备注"  show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span>{{scope.row.content}}</span>
                    </template>
                </el-table-column>
                  <el-table-column align="center" label="操作" width="160px" >
                    <template slot-scope="scope">                        
                        <el-button type="text" size="small"  v-if="scope.row.status==1" @click="nonTaxRefundListeidt(scope.row.id)" >编辑</el-button>
                        <el-button type="text" size="small"  v-if="scope.row.status==1" @click="finaceOrderdelete(scope.row.id)"  class="buttontextred">删除</el-button>
                         <el-button type="text" size="small" v-if="scope.row.status==1&&status==2" @click="updateStatus(scope.row.id)" >标记已缴</el-button>
                    </template>
                </el-table-column> 
            </el-table>
            <div class="pagination-container">
                <el-pagination @size-change="finaceOrderlist" @current-change="finaceOrderlist"
                               :current-page.sync="pagination.pageNo" :page-sizes="[10, 20, 30, 50]"
                               :page-size.sync="pagination.pageSize" layout="total, sizes, prev, pager, next, jumper"
                               :total="pagination.total">
                </el-pagination>
            </div>
    </div>
</template>
<script>
import {
  finaceOrderlist,
  batchFeesubmit,sendNotify,finaceOrderdelete,updateStatus
} from "@/api/campusFees";
import baseMixin from "@/mixins/baseMixin";
import mixin from "@/mixins/windowResize";
export default {
  name: "statisticsIndex",
  data() {
    return {
      dataList: [],
      status:this.$route.query.status,
      pagination: {
        pageNo: 1,
        pageSize: 20,
        total: null,
        serchval: "",
        pid:this.$route.query.pid
      },
    };
  },
  mixins: [baseMixin, mixin],
  created() {
    this.finaceOrderlist();
  },
  methods: {
    nonTaxRefundAdd(){
        this.$router.push({
        path: "nonTaxRefundAdd",
        query: {id:this.$route.query.pid,chargeName:this.$route.query.chargeName}
      });
    },
    nonTaxRefundListeidt(id){
        this.$router.push({
        path: "nonTaxRefundListeidt",
        query: {id:id}
      });
    },
     updateStatus(id){
         this.$confirm('是否标记已缴单?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'success'
                }).then(() => {
                    updateStatus(id,2).then(res => {
                        this.$message({
                            type: 'success',
                            message: '标记已缴成功!'
                        });
                        this.finaceOrderlist();
                    }).catch();

                }).catch(() => {
                });
    },
    finaceOrderdelete(id){
         this.$confirm('是否删除订单?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'danger'
                }).then(() => {
                    finaceOrderdelete(id).then(res => {
                        this.$message({
                            type: 'success',
                            message: '删除订单成功!'
                        });
                        this.finaceOrderlist();
                    }).catch();

                }).catch(() => {
                });
    },
     sendNotify(){
         this.$confirm('是否推送未缴提醒?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    sendNotify(this.pagination.pid).then(res => {
                        this.$message({
                            type: 'success',
                            message: '推送未缴提醒成功!'
                        });
                        this.finaceOrderlist();
                    }).catch();

                }).catch(() => {
                });
    },
    batchFeesubmit(){
         this.$confirm('是否发布?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    batchFeesubmit(this.pagination.pid).then(res => {
                        this.$message({
                            type: 'success',
                            message: '发布成功!'
                        });
                        this.status=2
                        this.finaceOrderlist();
                    }).catch();

                }).catch(() => {
                });
    },
      finaceOrderlist() {
      finaceOrderlist(this.pagination)
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
.nonTaxRefundList {
  padding:12px;
  .top {
    padding-bottom: 10px;
  }
}
</style>
