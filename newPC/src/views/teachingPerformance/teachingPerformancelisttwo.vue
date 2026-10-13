<template>
  <div class="teachingPerformancelisttwo">
     <el-tabs type="border-card"  v-model="activeName" @tab-click="tabsfun()">
      <el-tab-pane label="绩效汇总表" name="one"></el-tab-pane>
      <el-tab-pane label="绩效评估表" name="two">
            <div class="header">   
             <el-button @click="$router.back()" type="default" size="medium">返回</el-button>        
             <a :href="downLoadHref" target="_blank" download="examName" v-if="dataList.length"><el-button type="primary"  size="medium">导出</el-button></a> 
              <el-input class="search-input" style="width:20%;float: right;"
                  placeholder="请输入教师名字" icon="search" size="medium" @change="timefun"
                  v-model.trim="query.searchName">
            <el-button slot="append" icon="el-icon-search" @click="timefun"></el-button>
        </el-input>   
          </div>
          <div class="body">
            <el-table  :data="dataList"  border stripe  :height="maxH-70">
                  <el-table-column label="序号" type="index" width="50"></el-table-column> 
            <el-table-column label="教师" align="center" show-overflow-tooltip >
                <template slot-scope="scope">
                        {{scope.row.teacherName}}
                </template>
            </el-table-column>  
            <el-table-column label="班级" align="center" show-overflow-tooltip>
                <template slot-scope="scope">
                        {{scope.row.classNames}}
                </template>
            </el-table-column>
            <el-table-column label="学科" align="center" show-overflow-tooltip>
                <template slot-scope="scope">
                        {{scope.row.currNames}}
                </template>
            </el-table-column>           
            <el-table-column label="教师个人绩效综合值" align="center" show-overflow-tooltip>
                <template slot-scope="scope">
                        {{scope.row.teacherSynthesize}}
                </template>
            </el-table-column>
            <el-table-column label="综合名次" align="center" show-overflow-tooltip >
                <template slot-scope="scope">
                        {{scope.row.orderNo}}
                </template>
            </el-table-column>
            <el-table-column label="奖项" align="center" >
                <template slot-scope="scope">
                        <span v-if="scope.row.awards==0">无奖项</span>
                        <span v-if="scope.row.awards==1">卓越奖</span>
                        <span v-if="scope.row.awards==2">优秀奖</span>
                        <span v-if="scope.row.awards==3">及格奖</span>
                </template>
            </el-table-column>
            </el-table> 
              <div class="pagination-container">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                           :current-page.sync="query.pageNo" :page-sizes="[10,20,30, 50]"
                           :page-size="query.pageSize" layout="total, sizes, prev, pager, next, jumper"
                           :total="total">
            </el-pagination>  
           </div> 
          </div>
      </el-tab-pane>
    </el-tabs> 
  </div>
</template>
<script>
import mixins from "@/mixins/windowResize";
import {queryTeacherAppraiseAnalysis} from "@/api/teachingPerformance";
export default {
  data() {
    return {
      activeName: "two",
      dataList: [],
      query: {
        pageNo: 1, //页数
        pageSize: 20, //条数
        batchId: this.$route.query.id,
        searchName:''
      },
      downLoadHref: "",
      total: null
    };
  },
  mixins: [mixins],
  created() {
    this.queryTeacherAppraiseAnalysiss();
  },
  methods: {
    queryTeacherAppraiseAnalysiss() {
      this.dataList = [];      
      this.downLoadHref =
        global.BasePath +
        "structure/teacherAppraise/downTeacherAppraiseAnalysis?batchId=" +
        this.query.batchId +
        "&searchName=" +
        this.query.searchName +        
        "&token=" +
        this.$store.getters.token;
      queryTeacherAppraiseAnalysis(this.query).then(res => {
        let data = res.data.data;
        this.dataList = data.dataList;
        this.total = data.pagination.total;
      });
    },
    //切换条数
    handleSizeChange(val) {
      this.query.pageNo = 1;
      this.query.pageSize = val;
      this.queryTeacherAppraiseAnalysiss();
    },
    //切换页数
    handleCurrentChange(val) {
      this.query.pageNo = val;
      this.queryTeacherAppraiseAnalysiss();
    },
    timefun(){
       this.query.pageNo = 1;
      this.queryTeacherAppraiseAnalysiss();
    },
    tabsfun() {
      if (this.activeName == "one") {
        this.$router.replace({ path: "teachingPerformancelistone", query: {id: this.$route.query.id} });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.teachingPerformancelisttwo {
  padding: 12px;
  .header {
    padding-bottom: 10px;
  }
}
</style>
