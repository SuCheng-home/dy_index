<template>
    <div class="homeVisitindex">
        <div class="top">    
             <el-input class="search-input" style="width:20%;float: right;"
                          placeholder="请输入项目名称" icon="search" size="medium" @change="getFundApplyListBySchBatch()"
                          v-model.trim="pagination.useInfo">
                    <el-button slot="append" icon="el-icon-search" @click="getFundApplyListBySchBatch()"></el-button>
            </el-input>
        </div>
        <el-table stripe :data="dataList" border fit highlight-current-row  :height="maxH">     
             <el-table-column align="center" label="编号" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span>{{scope.row.orderNum}}</span>
                    </template>
                </el-table-column>       			
                <el-table-column align="center" label="项目名称" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span class="link-type" @click="fundApplicationApprovalinfo(scope.row.id)">{{scope.row.useInfo}}</span>
                    </template>
                </el-table-column>
               <el-table-column align="center" label="收费金额（元）" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span>{{scope.row.amount/100}}</span>
                    </template>
                </el-table-column>   
                <el-table-column align="center" label="申请人" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span>{{scope.row.createUserName}}</span>
                    </template>
                </el-table-column>  
                <el-table-column align="center" label="复核状态" >
                    <template slot-scope="scope">
                        <el-tag  size="mini" type="info" v-if="scope.row.applyState==1">草稿</el-tag>
                        <el-tag  size="mini" type="warning" v-else-if="scope.row.applyState==2">待复核</el-tag>
                        <el-tag  size="mini" type="danger"  v-else-if="scope.row.applyState==3">退回</el-tag>
                        <el-tag  size="mini" type="success"  v-else>同意</el-tag>
                    </template>
                </el-table-column>
                 <!-- <el-table-column align="center" label="教育局审批状态" width="130">
                    <template slot-scope="scope">
                        <el-tag  size="mini" type="danger" v-if="scope.row.applyState==5">退回</el-tag>
                        <el-tag  size="mini" type="success" v-else-if="scope.row.applyState>5">同意</el-tag>
                    </template>
                </el-table-column>
                  <el-table-column align="center" label="银行出账状态" width="130">
                    <template slot-scope="scope">
                        <el-tag  size="mini" type="danger" v-if="scope.row.applyState==7">退回</el-tag>
                        <el-tag  size="mini" type="success" v-else-if="scope.row.applyState==8">出账</el-tag>
                    </template>
                </el-table-column> -->
                 <el-table-column align="center" label="操作" width="140px" show-overflow-tooltip>
                    <template slot-scope="scope">
                             <el-button type="text" size="small" @click="fundApplicationApprovalinfo(scope.row.id)" :disabled="scope.row.applyState!=2">复核</el-button>
                         </template>
                </el-table-column> 
            </el-table>
            <div class="pagination-container">
                <el-pagination @size-change="getFundApplyListBySchBatch" @current-change="getFundApplyListBySchBatch"
                               :current-page.sync="pagination.pageNo" :page-sizes="[10, 20, 30, 50]"
                               :page-size.sync="pagination.pageSize" layout="total, sizes, prev, pager, next, jumper"
                               :total="pagination.total">
                </el-pagination>
            </div>
    </div>
</template>
<script>
import {
  getFundApplyListBySchBatch
} from "@/api/fundApplication";
import baseMixin from "@/mixins/baseMixin";
import mixin from "@/mixins/windowResize";
export default {
  name: "statisticsIndex",
  data() {
    return {
      dataList: [],
      pagination: {
        pageNo: 1,
        pageSize: 20,
        total: null,
        useInfo: "",
        type:2
      },
      ispossessRole:false
    };
  },
  mixins: [baseMixin, mixin],
  created() {
    this.getFundApplyListBySchBatch();
  },
  methods: {
    getFundApplyListBySchBatch() {
      getFundApplyListBySchBatch(this.pagination)
        .then(res => res.data)
        .then(data => {
          this.pagination.total = data.data.pagination.total;
          this.dataList = data.data.dataList;
        });
    },
    
     fundApplicationApprovalinfo(id){
        this.$router.push({
        path: "newfundApplicationApprovalinfo",
         query: {id:id}
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.homeVisitindex {
  padding:12px;
  .top {
    padding-bottom: 10px;
    overflow:hidden;
  }
}
</style>
