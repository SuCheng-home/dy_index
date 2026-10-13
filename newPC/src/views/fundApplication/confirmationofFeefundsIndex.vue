<template>
    <div class="confirmationofFeefundsIndex">
        <div class="top">          
            <el-button @click="confirmationofFeefundsAdd()" type="primary" size="medium" >资金确认申请</el-button>
             <el-input class="search-input" style="width:20%;float: right;"
                          placeholder="请输入内容" icon="search" size="medium" @change="getFundChargeApplyList()"
                          v-model.trim="pagination.title">
                    <el-button slot="append" icon="el-icon-search" @click="getFundChargeApplyList()"></el-button>
            </el-input>
        </div>
        <el-table stripe :data="dataList" border fit highlight-current-row  :height="maxH">  
                <el-table-column align="center" label="资金确认主题" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span class="link-type" @click="confirmationofFeefundsInfo(scope.row.id)">{{scope.row.title}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="资金确认主题" show-overflow-tooltip>
                    <template slot-scope="scope">
                      <div v-for="item in JSON.parse(scope.row.chargeJson)" :key="item.cid">
                                    {{item.chargeName}}：{{item.amount/100}}元；
                                </div>
                    </template>
                </el-table-column>
                <el-table-column
                    label="	确认单"
                    align="center"
                    width="100px"
                    :resizable="false"
            >
                <template slot-scope="scope">
                     <a :href="JSON.parse(scope.row.fileJson)[0].fileUrl"  target="_blank"  >
                        <span class="link-type" >
                       点击查看
                    </span>
                   </a>
                </template>
            </el-table-column>
               <el-table-column align="center" label="收费总金额（元）" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span>{{scope.row.amount/100}}</span>
                    </template>
                </el-table-column>   
                <el-table-column align="center" label="状态" width="130">
                    <template slot-scope="scope">
                        <el-tag  size="mini" type="info" v-if="scope.row.applyState==1">草稿</el-tag>
                        <el-tag  size="mini" type="warning" v-else-if="scope.row.applyState==2">待审核</el-tag>
                        <el-tag  size="mini" type="danger"  v-else-if="scope.row.applyState==4">驳回</el-tag>
                        <el-tag  size="mini" type="success"  v-else>同意</el-tag>
                    </template>
                </el-table-column>
                 <el-table-column align="center" label="操作" width="130px" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <el-button type="text" size="small" @click="delFundChargeApply(scope.row.id)" v-if="scope.row.applyState==1||scope.row.applyState==4" class="buttontextred">删除</el-button>
                        <el-button type="text" size="small" @click="confirmationofFeefundsEidt(scope.row.id)" v-if="scope.row.applyState==1">编辑</el-button>
                        <el-button type="text" size="small" @click="updateFundChargeApply(scope.row.id)" v-if="scope.row.applyState==2">撤回</el-button>
                         </template>
                </el-table-column> 
            </el-table>
            <div class="pagination-container">
                <el-pagination @size-change="getFundChargeApplyList" @current-change="getFundChargeApplyList"
                               :current-page.sync="pagination.pageNo" :page-sizes="[10, 20, 30, 50]"
                               :page-size.sync="pagination.pageSize" layout="total, sizes, prev, pager, next, jumper"
                               :total="pagination.total">
                </el-pagination>
            </div>
    </div>
</template>
<script>
import {
  getFundChargeApplyList,
  delFundChargeApply,updateFundChargeApply
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
        title: "",
        applyState:0,
        schoolId:this.$store.getters.schoolInfo.id
      },
      ispossessRole:false
    };
  },
  mixins: [baseMixin, mixin],
  created() {
    this.getFundChargeApplyList();
  },
  methods: {
   updateFundChargeApply(id){
         this.$confirm('是否撤回?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    updateFundChargeApply({applyState:5,id:id}).then(res => {
                        this.$message({
                            type: 'success',
                            message: '撤回成功!'
                        });
                        this.getFundChargeApplyList();
                    }).catch();

                }).catch(() => {
                });
    },
    delFundChargeApply(id){
         this.$confirm('此操作将永久删除此申请, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    delFundChargeApply(id).then(res => {
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                        this.getFundChargeApplyList();
                    }).catch();

                }).catch(() => {
                });
    },
    getFundChargeApplyList() {
      getFundChargeApplyList(this.pagination)
        .then(res => res.data)
        .then(data => {
          this.pagination.total = data.data.pagination.total;
          this.dataList = data.data.dataList;
        });
    },
    confirmationofFeefundsAdd() {
      this.$router.push({
        path: "confirmationofFeefundsAdd"
      });
    },
    confirmationofFeefundsEidt(id){
        this.$router.push({
        path: "confirmationofFeefundsEidt",
         query: {id:id}
      });
    },
     confirmationofFeefundsInfo(id){
        this.$router.push({
        path: "confirmationofFeefundsInfo",
         query: {id:id}
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.confirmationofFeefundsIndex {
  padding:12px;
  .top {
    padding-bottom: 10px;
  }
}
</style>
