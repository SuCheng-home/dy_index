<template>
<div class="sortinglist"  >
     <div class="top"> 
         <el-button @click="$router.back()" type="default" size="medium">返回</el-button> 
         <el-date-picker v-model="pagination.withdDate" size="medium" type="date"   :clearable="false" @change="queryWithdBatchList()"></el-date-picker>
         <span style="color: #606266;">{{name}}</span>
      </div>
     <div class="subject" >
        <el-table stripe :data="dataList" border fit highlight-current-row  :height="maxH">            			
                <el-table-column align="center" label="清分日期" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span >{{scope.row.withdDate}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="清分金额" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span>{{scope.row.totalfee?scope.row.totalfee:"----"}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="清分人" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span>{{scope.row.withduname?scope.row.withduname:"----"}}</span>
                    </template>
                </el-table-column>
               <el-table-column align="center" label="交易状态">
                    <template slot-scope="scope">
                        <el-tooltip class="item" effect="dark"  v-if="scope.row.status==4" :content="scope.row.reason" placement="top">
                            <el-tag  size="mini" type="danger"  >出金失败</el-tag>
                        </el-tooltip>                 
                        <el-tag  size="mini" type="success" v-if="scope.row.status==3">已出金</el-tag>
                        <el-tag  size="mini" type="warning"  v-if="scope.row.status==1">申请中</el-tag>
                        <el-tag  size="mini" type="warning"  v-if="scope.row.status==2">处理中</el-tag>
                        <el-tag  size="mini"  v-if="scope.row.status==5">已撤回</el-tag>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination-container">
                <el-pagination @size-change="queryWithdBatchList" @current-change="queryWithdBatchList"
                               :current-page.sync="pagination.pageNo" :page-sizes="[10, 20, 30, 50]"
                               :page-size.sync="pagination.pageSize" layout="total, sizes, prev, pager, next, jumper"
                               :total="pagination.total">
                </el-pagination>
            </div> 
     </div>
</div> 
</template>
<script>
import {queryWithdBatchList} from "@/api/newcharge";
import mixin from "@/mixins/windowResize";
export default {
  data() {
    return {
      datalist: [],
       name: this.$route.query.name,
        pagination: {
                pageNo: 1,
                pageSize: 20,
                total: null,
                withdDate: new Date(),
                subMerId: this.$route.query.id
            }
      
    };
  },
  mixins: [mixin],
  created() {
    this.queryWithdBatchList();
  },
  methods: {    
    queryWithdBatchList() {
      this.pagination.withdDate = moment(this.pagination.withdDate).format("YYYY-MM-DD");
       queryWithdBatchList(this.pagination)
                    .then(res => res.data)
                    .then(data => {
                        this.dataList = data.data.dataList;
                        this.pagination.total = data.data.pagination.total;
                    })
    }
  }
};
</script>


<style lang="scss" scoped>
.sortinglist {
  padding:12px;
  .top {
    padding-bottom: 10px;
  }
}
</style>