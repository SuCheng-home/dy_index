<template>
    <div class="dataPushindex">
        <div class="top">          
            <el-button @click="dataPushadd()" type="primary" size="medium" >新建推送批次</el-button>
             <el-input class="search-input" style="width:20%;float: right;"
                          placeholder="推送批次名称" icon="search" size="medium" @change="getSchoolDataSendBatchPageList()"
                          v-model.trim="pagination.batchName">
                    <el-button slot="append" icon="el-icon-search" @click="getSchoolDataSendBatchPageList()"></el-button>
            </el-input>
        </div>
        <el-table stripe :data="dataList" border fit highlight-current-row  :height="maxH">            			
                <el-table-column align="center" label="主题" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span class="link-type" @click="dataPushinfo(scope.row)">{{scope.row.batchName}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="分类" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span>{{scope.row.groupName}}</span>
                    </template>
                </el-table-column>               
                <el-table-column align="center" label="状态" width="100">
                    <template slot-scope="scope">
                        <el-tag  size="mini" type="info" v-if="scope.row.state==1">草稿</el-tag>
                        <el-tag  size="mini" type="success"  v-if="scope.row.state!=1">已发布</el-tag>
                    </template>
                </el-table-column>
                  <el-table-column align="center" label="发布人" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span>{{scope.row.pushUserName||'----'}}</span>
                    </template>
                </el-table-column>
                  <el-table-column align="center" label="发布时间" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span>{{scope.row.pushTime?scope.row.pushTime.slice(0,16):'----'}}</span>
                    </template>
                </el-table-column>
                 <el-table-column align="center" label="操作" width="170px" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <el-button type="text" size="small" @click="deleteDataSendBatchById(scope.row.id)" class="buttontextred">删除</el-button>
                        <el-button type="text" size="small" @click="dataPusheidt(scope.row.id)" v-if="scope.row.state==1">编辑</el-button>
                        <el-button type="text" size="small" @click="pushDateSendBatch(scope.row)" v-if="scope.row.state==1">发布</el-button>
                    </template>
                </el-table-column> 
            </el-table>
            <div class="pagination-container">
                <el-pagination @size-change="getSchoolDataSendBatchPageList" @current-change="getSchoolDataSendBatchPageList"
                               :current-page.sync="pagination.pageNo" :page-sizes="[10, 20, 30, 50]"
                               :page-size.sync="pagination.pageSize" layout="total, sizes, prev, pager, next, jumper"
                               :total="pagination.total">
                </el-pagination>
            </div>
    </div>
</template>
<script>
import {getSchoolDataSendBatchPageList,deleteDataSendBatchById,pushDateSendBatch} from "@/api/dataPush";
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
    };
  },
  mixins: [baseMixin, mixin],
  created() {
    this.getSchoolDataSendBatchPageList();
  },
  methods: {
      pushDateSendBatch(obj){
         this.$confirm('此操作将发布此批次, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    pushDateSendBatch({
                        batchName:obj.batchName,
                        groupName:obj.groupName,
                        id:obj.id,
                        state:2
                    }).then(res => {
                        this.$message({
                            type: 'success',
                            message: '发布成功!'
                        });
                        this.getSchoolDataSendBatchPageList();
                    }).catch();

                }).catch(() => {
                });
    },
   //删除
    deleteDataSendBatchById(id){
         this.$confirm('此操作将永久删除此批次, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    deleteDataSendBatchById(id).then(res => {
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                        this.getSchoolDataSendBatchPageList();
                    }).catch();

                }).catch(() => {
                });
    },
    getSchoolDataSendBatchPageList() {
      getSchoolDataSendBatchPageList(this.pagination)
        .then(res => res.data)
        .then(data => {
          this.pagination.total = data.data.pagination.total;
          this.dataList = data.data.dataList;
        });
    },
    dataPushadd() {
      this.$router.push({
        path: "dataPushadd"
      });
    },
    dataPusheidt(id){
        this.$router.push({
        path: "dataPusheidt",
         query: {id:id}
      });
    },
     dataPushinfo(obj){
        this.$router.push({
        path: "dataPushinfo",
         query: {id:obj.id,batchName:obj.batchName,state:obj.state,groupName:obj.groupName}
      });
    },
  }
};
</script>

<style lang="scss" scoped>
.dataPushindex {
  padding:12px;
  .top {
    padding-bottom: 10px;
  }
}
</style>
