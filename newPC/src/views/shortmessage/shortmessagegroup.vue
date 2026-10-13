<template>
    <div class="shortmessageMasslist">
        <div class="top">
            <el-button @click="$router.back()" type="default" size="medium">返回</el-button>  
            <el-button type="primary" size="medium" @click="shortmessagegroupadd(0)">添加群组</el-button>           
        </div>
        <el-table stripe :data="dataList" border fit highlight-current-row  :height="maxH">            			
                <el-table-column align="center" label="组名称" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span class="link-type" @click="shortmessagegroupinfo(scope.row.id)">{{scope.row.groupName}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="人数" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span >{{scope.row.sendNum}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="创建人" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span >{{scope.row.createUser}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="创建时间" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span >{{scope.row.createTime.substring(0, 19)}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作" align="center">
                    <template slot-scope="scope">
                         <el-button   type="text" @click="shortmessagegroupadd(scope.row.id)" size="small">编辑</el-button>
                         <el-button size="small" type="text" @click="deleteSmsMobileGroupById(scope.row.id)" class="buttontextred">删除</el-button>
                    </template>
            </el-table-column> 
            </el-table>
            <div class="pagination-container">
                <el-pagination @size-change="getSchoolSmsMobileGroupPageList" @current-change="getSchoolSmsMobileGroupPageList"
                               :current-page.sync="pagination.pageNo" :page-sizes="[10, 20, 30, 50]"
                               :page-size.sync="pagination.pageSize" layout="total, sizes, prev, pager, next, jumper"
                               :total="pagination.total">
                </el-pagination>
            </div>
    </div>
</template>
<script>
import moment from "moment";
import {getSchoolSmsMobileGroupPageList,deleteSmsMobileGroupById} from "@/api/shortmessage";
import baseMixin from "@/mixins/baseMixin";
import mixin from "@/mixins/windowResize";
export default {
  name: "statisticsIndex",
  data() {
    return {
      daterange: [new Date(), new Date()],
      dataList: [],
      exportUrl: "",
      pagination: {
        pageNo: 1,
        pageSize: 20,
        total: null,
        groupName:""
      },
      orderDetailsList: [],
      dialogTableVisible: false,
      content: ""
    };
  },
  mixins: [baseMixin, mixin],
  created() {
    this.getSchoolSmsMobileGroupPageList();
  },
  methods: {
    getSchoolSmsMobileGroupPageList() {
      getSchoolSmsMobileGroupPageList(this.pagination)
        .then(res => res.data)
        .then(data => {
          this.pagination.total = data.data.pagination.total;
          this.dataList = data.data.dataList;
        });
    },
    deleteSmsMobileGroupById(id) {
                this.$confirm('是否删除此群组', '删除', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    deleteSmsMobileGroupById(id)
                        .then(res => res.data)
                        .then(data => {
                            if(data.result) {
                                this.$message({
                                    type: 'success',
                                    message: '删除成功!'
                                });
                                this.getSchoolSmsMobileGroupPageList();
                            }
                        })
                });

            },
    shortmessagegroupinfo(id){
         this.$router.push({path: 'shortmessagegroupinfo',query:{id:id}});
    },
    shortmessagegroupadd(id){
         this.$router.push({path: 'shortmessagegroupadd',query:{id:id}});
    }
  }
};
</script>

<style lang="scss" scoped>
.shortmessageMasslist {
  padding:12px;
  .top {
    padding-bottom: 10px;
  }
}
</style>
