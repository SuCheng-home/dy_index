<template>
  <div class="teachingPerformancelistone">
     <el-tabs type="border-card"  v-model="activeName" @tab-click="tabsfun()">
      <el-tab-pane label="绩效汇总表" name="one">
         <div class="header">   
             <el-button @click="$router.back()" type="default" size="medium">返回</el-button>        
             <a :href="downLoadHref" target="_blank" download="examName" v-if="dataList.length"><el-button type="primary"  size="medium">导出</el-button></a> 
              <el-input class="search-input" style="width:20%;float: right;"
                  placeholder="请输入班级名称" icon="search" size="medium" @change="timefun"
                  v-model.trim="query.searchName">
            <el-button slot="append" icon="el-icon-search" @click="timefun"></el-button>
        </el-input>   
          </div>
          <div class="body">
            <el-table  :data="dataList"  border stripe  :height="maxH-70">
                <el-table-column   prop="className" label="班级"  align="center" show-overflow-tooltip> </el-table-column>
                <el-table-column   prop="currName" label="学科"  align="center" show-overflow-tooltip> </el-table-column>
                <el-table-column   prop="classAvgScore" label="均分"  align="center" show-overflow-tooltip> </el-table-column>
                <el-table-column   prop="classPassRate" label="及格率"  align="center" show-overflow-tooltip>
                     <template slot-scope="scope">
                       {{scope.row.classPassRate}}%
                    </template>
                 </el-table-column>
                <el-table-column   prop="classGoodRate" label="优秀率"  align="center" show-overflow-tooltip> 
                    <template slot-scope="scope">
                       {{scope.row.classGoodRate}}%
                    </template>
                </el-table-column>
                <el-table-column   prop="standardDeviation" label="标准差"  align="center" show-overflow-tooltip> </el-table-column>
                <el-table-column   prop="firstExamAvgPercent" label="本次均分比"  align="center" show-overflow-tooltip> </el-table-column>
                <el-table-column   prop="secondExamAvgPercent" label="上次均分比"  align="center" show-overflow-tooltip> </el-table-column>
                <el-table-column   prop="classBoostPercent" label="班级推进率"  align="center" show-overflow-tooltip>
                     <template slot-scope="scope">
                       {{scope.row.classBoostPercent}}%
                    </template>
                </el-table-column>
                <el-table-column   prop="classOriginal" label="班级绩效原始值"  align="center" show-overflow-tooltip> </el-table-column>
                <el-table-column   prop="classSynthesize" label="班级绩效综合值"  align="center" show-overflow-tooltip> </el-table-column>
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
      <el-tab-pane label="绩效评估表" name="two"></el-tab-pane>
    </el-tabs> 
  </div>
</template>
<script>
import mixins from "@/mixins/windowResize";
import {queryTeacherAppraiseClass} from "@/api/teachingPerformance";
export default {
  data() {
    return {
      activeName: "one",
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
    this.queryTeacherAppraiseClasss();
  },
  methods: {
    queryTeacherAppraiseClasss() {
      this.dataList = [];      
      this.downLoadHref =
        global.BasePath +
        "structure/teacherAppraise/downTeacherAppraiseClass?batchId=" +
        this.query.batchId +
        "&searchName=" +
        this.query.searchName +        
        "&token=" +
        this.$store.getters.token;
      queryTeacherAppraiseClass(this.query).then(res => {
        let data = res.data.data;
        this.dataList = data.dataList;
        this.total = data.pagination.total;
      });
    },
    //切换条数
    handleSizeChange(val) {
      this.query.pageNo = 1;
      this.query.pageSize = val;
      this.queryTeacherAppraiseClasss();
    },
    //切换页数
    handleCurrentChange(val) {
      this.query.pageNo = val;
      this.queryTeacherAppraiseClasss();
    },
    timefun(){
       this.query.pageNo = 1;
      this.queryTeacherAppraiseClasss();
    },
    tabsfun() {
      if (this.activeName == "two") {
        this.$router.replace({ path: "teachingPerformancelisttwo", query: {id: this.$route.query.id} });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.teachingPerformancelistone {
  padding: 12px;
  .header {
    padding-bottom: 10px;
  }
}
</style>
