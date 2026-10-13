<template>
    <div class="nonTaxRefundIndex">
        <div class="top">          
            <el-button @click="nonTaxRefundAdd()" type="primary" size="medium" >新建</el-button>
             <el-input class="search-input" style="width:20%;float: right;"  
                          placeholder="请输入收费名称" icon="search" size="medium" @change="batchFeelist()"
                          v-model.trim="pagination.serchval">
                    <el-button slot="append" icon="el-icon-search" @click="batchFeelist()"></el-button>
            </el-input>
        </div>
        <el-table stripe :data="dataList" border fit highlight-current-row  :height="maxH"> 
                <el-table-column align="center" label="收费名称" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span class="link-type" @click="nonTaxRefundList(scope.row.id,scope.row.status,scope.row.chargeName)">{{scope.row.chargeName}}</span>
                    </template>
                </el-table-column> 
                 <el-table-column align="center" label="创建人" width="120" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span>{{scope.row.createUserName}}</span>
                    </template>
                </el-table-column> 
                <el-table-column align="center" label="发布时间" width="180" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span>{{scope.row.submitTime?scope.row.submitTime.slice(0,19):"----"}}</span>
                    </template>
                </el-table-column>  
                <el-table-column align="center" label="状态" width="130">
                    <template slot-scope="scope">
                        <el-tag  size="mini" type="info"     v-if="scope.row.status==1">草稿</el-tag>
                        <el-tag  size="mini" type="success"  v-else="scope.row.status==2">已发布</el-tag>
                    </template>
                </el-table-column>
                 <el-table-column align="center" label="操作" width="130px" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <el-button type="text" size="small" @click="batchFeedelete(scope.row.id)"  class="buttontextred">删除</el-button>
                        <!-- <el-button type="text" size="small" @click="nonTaxRefundEidt(scope.row.id)" >编辑</el-button> -->
                         </template>
                </el-table-column> 
            </el-table>
            <div class="pagination-container">
                <el-pagination @size-change="batchFeelist" @current-change="batchFeelist"
                               :current-page.sync="pagination.pageNo" :page-sizes="[10, 20, 30, 50]"
                               :page-size.sync="pagination.pageSize" layout="total, sizes, prev, pager, next, jumper"
                               :total="pagination.total">
                </el-pagination>
            </div>
    </div>
</template>
<script>
import {
  batchFeelist,
  batchFeedelete
} from "@/api/campusFees";
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
        serchval: ""
      },
    };
  },
  mixins: [baseMixin, mixin],
  created() {
    this.batchFeelist();
  },
  methods: {
    batchFeedelete(id){
         this.$confirm('此操作将永久删除, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    batchFeedelete(id).then(res => {
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                        this.batchFeelist();
                    }).catch();

                }).catch(() => {
                });
    },
    batchFeelist() {
      batchFeelist(this.pagination)
        .then(res => res.data)
        .then(data => {
          this.pagination.total = data.data.pagination.total;
          this.dataList = data.data.dataList;
        });
    },
    nonTaxRefundAdd() {
      this.$router.push({
        path: "nonTaxRefundAdd"
      });
    },
    nonTaxRefundEidt(id){
        this.$router.push({
        path: "nonTaxRefundAdd",
         query: {id:id}
      });
    },
     nonTaxRefundList(id,status,chargeName){
        this.$router.push({
        path: "nonTaxRefundList",
         query: {pid:id,status:status,chargeName:chargeName}
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.nonTaxRefundIndex {
  padding:12px;
  .top {
    padding-bottom: 10px;
  }
}
</style>
