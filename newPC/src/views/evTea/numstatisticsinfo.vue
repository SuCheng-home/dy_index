<template>
    <div class="numstatisticsinfo">
        <div class="top">  
          <el-button @click="$router.back()" type="default" size="medium">返回</el-button>  
          <a :href="exportUrl" target="_blank">
                    <el-button type="primary" size="medium">导出</el-button>
                </a>
             <el-input class="search-input" style="width:20%;float: right;"
                          placeholder="请输入老师姓名（全称）" icon="search" size="medium" @change="getStaticScoreListByBatchTempId()"
                          v-model.trim="pagination.teacherUserName">
                    <el-button slot="append" icon="el-icon-search" @click="getStaticScoreListByBatchTempId()"></el-button>
            </el-input>
        </div>
        <el-table stripe :data="dataList" border fit highlight-current-row  :height="maxH">     
             <el-table-column align="center" label="老师姓名" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span>{{scope.row.tempTeacherName}}</span>
                    </template>
                </el-table-column>  
                <el-table-column align="center" label="班级" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span>{{scope.row.className}}</span>
                    </template>
                </el-table-column>  
                <el-table-column align="center" label="学科" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span>{{scope.row.tempCurrName}}</span>
                    </template>
                </el-table-column>     
                <el-table-column align="center" label="评教人数" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span>{{scope.row.peopleCount}}</span>
                    </template>
                </el-table-column>  
                <el-table-column align="center" label="问题数" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span>{{scope.row.topicCount}}</span>
                    </template>
                </el-table-column>  
                <el-table-column align="center" label="投票总数" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span>{{scope.row.stuCount}}</span>
                    </template>
                </el-table-column>  
                <el-table-column align="center" label="总得分" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span>{{scope.row.score}}</span>
                    </template>
                </el-table-column> 
                <el-table-column align="center" label="平均分" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span>{{(scope.row.score/scope.row.peopleCount).toFixed(2)-0}}</span>
                    </template>
                </el-table-column> 
            </el-table>
            <div class="pagination-container">
                <el-pagination @size-change="getStaticScoreListByBatchTempId" @current-change="getStaticScoreListByBatchTempId"
                               :current-page.sync="pagination.pageNo" :page-sizes="[10, 20, 30, 50]"
                               :page-size.sync="pagination.pageSize" layout="total, sizes, prev, pager, next, jumper"
                               :total="pagination.total">
                </el-pagination>
            </div>
    </div>
</template>
<script>
import {getStaticScoreListByBatchTempId} from '@/api/evTea';
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
        teacherUserName: this.$route.query.teacherUserName,
        batchId:this.$route.query.batchId,   
        batchTempId:this.$route.query.batchTempId,  
      },
      exportUrl: '',
    };
  },
  mixins: [baseMixin, mixin],
  created() {
    this.getStaticScoreListByBatchTempId();
  },
  methods: {
    getStaticScoreListByBatchTempId() {
       this.exportUrl = `${global.BasePath}structure/evaluateTw/exportStaticScoreListByBatchTempId?` +
                `batchId=${this.pagination.batchId}&batchTempId=${this.pagination.batchTempId}&teacherUserName=${this.pagination.teacherUserName}` +
                `&token=${this.$store.getters.token}`
      getStaticScoreListByBatchTempId(this.pagination)
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
.numstatisticsinfo {
  padding:12px;
  .top {
    padding-bottom: 10px;
    overflow:hidden;
  }
}
</style>
