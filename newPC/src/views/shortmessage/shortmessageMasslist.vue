<template>
    <div class="shortmessageMasslist">
        <div class="top">
            <el-button @click="$router.back()" type="default" size="medium">返回</el-button>  
            <el-button type="primary" size="medium" @click="shortmessageMassadd()">短信群发</el-button>           
        </div>
        <el-table stripe :data="dataList" border fit highlight-current-row  :height="maxH">            			
                <el-table-column align="center" label="模板名称" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span >{{scope.row.templateName}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="发送人数" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span >{{scope.row.sendUserCount}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="操作员" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span >{{scope.row.createUserName}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="发送时间" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span >{{scope.row.createTime.substring(0, 19)}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="成功人数" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span >{{scope.row.successUserCount}}</span>
                    </template>
                </el-table-column>
                 <el-table-column align="center" label="失败人数" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span >{{scope.row.errorUserCount}}</span>
                    </template>
                </el-table-column>
                 <el-table-column align="center" label="计费条数" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span >{{scope.row.usedCount}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作" align="center">
                    <template slot-scope="scope">
                         <el-button   type="text" @click="shortmessageMasslistdetails(scope.row.id,scope.row.moduleCode)" size="small">查看详情</el-button>
                    </template>
            </el-table-column> 
            </el-table>
            <div class="pagination-container">
                <el-pagination @size-change="listPageByModelfun" @current-change="listPageByModelfun"
                               :current-page.sync="pagination.pageNo" :page-sizes="[10, 20, 30, 50]"
                               :page-size.sync="pagination.pageSize" layout="total, sizes, prev, pager, next, jumper"
                               :total="pagination.total">
                </el-pagination>
            </div>
    </div>
</template>
<script>
import moment from "moment";
import { listPageByModel} from "@/api/shortmessage";
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
        total: null
      },
      orderDetailsList: [],
      dialogTableVisible: false,
      content: ""
    };
  },
  mixins: [baseMixin, mixin],
  created() {
    this.listPageByModelfun();
  },
  methods: {
    listPageByModelfun() {
      listPageByModel(this.pagination)
        .then(res => res.data)
        .then(data => {
          this.pagination.total = data.data.pagination.total;
          this.dataList = data.data.dataList;
        });
    },
    shortmessageMasslistdetails(id,moduleCode){
         this.$router.push({path: 'shortmessageMasslistdetails',query:{id:id,moduleCode:moduleCode}});
    },
    shortmessageMassadd(){
         this.$router.push({path: 'shortmessageMassadd'});
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
