<template>
    <div class="homeVisitindex">
        <div class="top">          
            <el-button @click="fundApplicationadd()" type="primary" size="medium" >资金支出申请</el-button>
             <el-input class="search-input" style="width:20%;float: right;"
                          placeholder="请输入用途" icon="search" size="medium" @change="getFundApplyListByApply()"
                          v-model.trim="pagination.useInfo">
                    <el-button slot="append" icon="el-icon-search" @click="getFundApplyListByApply()"></el-button>
            </el-input>
        </div>





        <el-table stripe :data="dataList" border fit highlight-current-row  :height="maxH">     
             <el-table-column align="center" label="编号" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span>{{scope.row.orderNum}}</span>
                    </template>
                </el-table-column>       			
                <el-table-column align="center" label="资金用途" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span class="link-type" @click="fundApplicationinfo(scope.row.id)">{{scope.row.useInfo}}</span>
                    </template>
                </el-table-column>
               <el-table-column align="center" label="申请金额（元）" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span>{{scope.row.amount/100}}</span>
                    </template>
                </el-table-column>   
                <el-table-column align="center" label="创建人" width="110" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span>{{scope.row.createUserName}}</span>
                    </template>
                </el-table-column>  
                <!-- <el-table-column align="center" label="创建时间" width="180" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span>{{scope.row.createTime?scope.row.createTime.slice(0,19):"----"}}</span>
                    </template>
                </el-table-column>   -->
                <el-table-column align="center" label="复核状态" width="130">
                    <template slot-scope="scope">
                        <el-tag  size="mini" type="info" v-if="scope.row.applyState==1">草稿</el-tag>
                        <el-tag  size="mini" type="warning" v-else-if="scope.row.applyState==2">待复核</el-tag>
                        <el-tag  size="mini" type="danger"  v-else-if="scope.row.applyState==3">退回</el-tag>
                        <el-tag  size="mini" type="success"  v-else>同意</el-tag>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="复核人" width="110" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span>{{scope.row.schBatchUserName}}</span>
                    </template>
                </el-table-column>
                 <!-- <el-table-column align="center" label="教育局审批状态" width="130">
                    <template slot-scope="scope">
                        <el-tag  size="mini" type="danger" v-if="scope.row.applyState==5">退回</el-tag>
                        <el-tag  size="mini" type="success" v-else-if="scope.row.applyState>5">同意</el-tag>
                    </template>
                </el-table-column> -->
                  <el-table-column align="center" label="银行出账状态" width="130" >
                    <template slot-scope="scope">
                        <el-tag  size="mini" type="danger" v-if="scope.row.applyState==7">退回</el-tag>
                        <el-tag  size="mini" type="success" v-else-if="scope.row.applyState==8">已出账</el-tag>
                    </template>
                </el-table-column>
                 <el-table-column align="center" label="操作" width="130px" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <el-button type="text" size="small" @click="delFundApply(scope.row.id)" v-if="scope.row.applyState==1||scope.row.applyState==3" class="buttontextred">删除</el-button>
                        <el-button type="text" size="small" @click="fundApplicationeidt(scope.row.id)" v-if="scope.row.applyState==1">编辑</el-button>
                         </template>
                </el-table-column> 
            </el-table>
            <div class="pagination-container">
                <el-pagination @size-change="getFundApplyListByApply" @current-change="getFundApplyListByApply"
                               :current-page.sync="pagination.pageNo" :page-sizes="[10, 20, 30, 50]"
                               :page-size.sync="pagination.pageSize" layout="total, sizes, prev, pager, next, jumper"
                               :total="pagination.total">
                </el-pagination>
            </div>
    </div>
</template>
<script>
import {
  getFundApplyListByApply,
  delFundApply
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
        type:3
      },
      ispossessRole:false
    };
  },
  mixins: [baseMixin, mixin],
  created() {
    this.getFundApplyListByApply();
  },
  methods: {
    delFundApply(id){
         this.$confirm('此操作将永久删除此申请, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    delFundApply(id).then(res => {
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                        this.getFundApplyListByApply();
                    }).catch();

                }).catch(() => {
                });
    },
    getFundApplyListByApply() {
      getFundApplyListByApply(this.pagination)
        .then(res => res.data)
        .then(data => {
          this.pagination.total = data.data.pagination.total;
          this.dataList = data.data.dataList;
        });
    },
    fundApplicationadd() {
      this.$router.push({
        path: "twofundApplicationadd"
      });
    },
    fundApplicationeidt(id){
        this.$router.push({
        path: "twofundApplicationeidt",
         query: {id:id}
      });
    },
     fundApplicationinfo(id){
        this.$router.push({
        path: "twofundApplicationinfo",
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
  }
}
</style>
