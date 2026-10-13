<template>
    <div class="homeVisitindex">
        <div class="top">          
            <el-button @click="homeVisitadd()" type="primary" size="medium"  v-if="ispossessRole">创建家访批次</el-button>
             <el-input class="search-input" style="width:20%;float: right;"
                          placeholder="家访批次名称" icon="search" size="medium" @change="getSchoolHomeVisitBatchPageListfun()"
                          v-model.trim="pagination.batchName">
                    <el-button slot="append" icon="el-icon-search" @click="getSchoolHomeVisitBatchPageListfun()"></el-button>
            </el-input>
        </div>
        <el-table stripe :data="dataList" border fit highlight-current-row  :height="maxH">            			
                <el-table-column align="center" label="家访名称" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span class="link-type" @click="homeVisitdetails(scope.row.id)">{{scope.row.batchName}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="前调截止时间" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span>{{scope.row.tuneEndTime?scope.row.tuneEndTime.slice(0,16):''}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="前调进度">
                    <template slot-scope="scope">
                        <span class="link-type" v-if="scope.row.state!=1" @click="pretunelist(scope.row.id)">{{scope.row.receiptCount}}/{{scope.row.allCount}}</span>
                       <span v-else>----</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="家访进度">
                    <template slot-scope="scope">
                        <span class="link-type" v-if="scope.row.state!=1" @click="speedofprogresslist(scope.row.id)">{{scope.row.visitCount}}/{{scope.row.allCount}}</span>
                        <span v-else>----</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="状态" width="100">
                    <template slot-scope="scope">
                        <el-tag  size="mini" type="gray" v-if="scope.row.state==1">草稿</el-tag>
                        <el-tag  size="mini" type="success"  v-if="scope.row.state!=1">已发布</el-tag>
                    </template>
                </el-table-column>
                 <el-table-column align="center" label="操作" width="170px" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <el-button type="text" size="small" @click="delHomeVisitBatchByIds(scope.row.id)" v-if="ispossessRole" class="buttontextred">删除</el-button>
                        <el-button type="text" size="small" @click="homeVisiteidt(scope.row.id)" v-if="ispossessRole">编辑</el-button>
                        <el-button type="text" size="small" :disabled="scope.row.state==1||timefun(scope.row.tuneEndTime)" @click="homeVisitrecordlist(scope.row.id)">家访记录</el-button>
                    </template>
                </el-table-column> 
            </el-table>
            <div class="pagination-container">
                <el-pagination @size-change="getSchoolHomeVisitBatchPageListfun" @current-change="getSchoolHomeVisitBatchPageListfun"
                               :current-page.sync="pagination.pageNo" :page-sizes="[10, 20, 30, 50]"
                               :page-size.sync="pagination.pageSize" layout="total, sizes, prev, pager, next, jumper"
                               :total="pagination.total">
                </el-pagination>
            </div>
    </div>
</template>
<script>
import {
  getSchoolHomeVisitBatchPageList,
  delHomeVisitBatchById,possessRole
} from "@/api/homeVisit";
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
        batchName: ""
      },
      ispossessRole:false
    };
  },
  mixins: [baseMixin, mixin],
  created() {
    this.getSchoolHomeVisitBatchPageListfun();
    //判断是不是管理员
			possessRole().then(res=>{
				this.ispossessRole= res.data.data.result;
			});
  },
  methods: {
    timefun(tuneEndTime){      
       return moment(tuneEndTime).format('YYYY-MM-DD HH:mm')>moment(new Date()).format('YYYY-MM-DD HH:mm');
    },
   //删除
    delHomeVisitBatchByIds(id){
         this.$confirm('此操作将永久删除此批次, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    delHomeVisitBatchById(id).then(res => {
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                        this.getSchoolHomeVisitBatchPageListfun();
                    }).catch();

                }).catch(() => {
                });
    },
    getSchoolHomeVisitBatchPageListfun() {
      getSchoolHomeVisitBatchPageList(this.pagination)
        .then(res => res.data)
        .then(data => {
          this.pagination.total = data.data.pagination.total;
          this.dataList = data.data.dataList;
        });
    },
    homeVisitadd() {
      this.$router.push({
        path: "homeVisitadd"
      });
    },
    homeVisiteidt(id){
        this.$router.push({
        path: "homeVisiteidt",
         query: {id:id}
      });
    },
     homeVisitdetails(id){
        this.$router.push({
        path: "homeVisitdetails",
         query: {id:id}
      });
    },
    speedofprogresslist(id) {
      this.$router.push({
        path: "speedofprogresslist",
        query: { id: id }
      });
    },
     pretunelist(id) {
      this.$router.push({
        path: "pretunelist",
        query: { id: id }
      });
    },
    homeVisitrecordlist(id) {
      this.$router.push({
        path: "homeVisitrecordlist",
        query: { id: id }
      });
    },
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
