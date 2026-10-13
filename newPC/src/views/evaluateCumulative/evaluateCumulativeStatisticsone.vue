<template>
  <div class="evaluateCumulativeStatisticsone">
     <el-tabs type="border-card"  v-model="activeName" @tab-click="tabsfun()">
      <el-tab-pane label="按老师统计" name="one">
         <div class="header">          
      <el-date-picker size="medium" v-model="daterange" type="daterange" class="mywidthdaterange" range-separator="-"  start-placeholder="开始日期" end-placeholder="结束日期" @change="timefun()" :clearable="false"> </el-date-picker>
      <el-select v-model="query.type" placeholder="请选择"  size="medium" @change="timefun">
                    <el-option label="全校老师" value="0"></el-option>
                    <el-option label="班主任" value="1"></el-option>
                    <el-option label="任课老师" value="2"></el-option>
                </el-select>
      <a :href="downLoadHref" v-if="dataList.length" target="_blank" download="examName"><el-button type="primary"  size="medium">导出</el-button></a> 
          </div>
          <div class="body">
            <el-table  :data="dataList"  border stripe  :height="maxH-70">
                <el-table-column   prop="operateUser" label="姓名"  align="center" show-overflow-tooltip> </el-table-column>
                <el-table-column   prop="className" label="所在部门"  align="center" show-overflow-tooltip> </el-table-column>
                <el-table-column   prop="teachCourses" label="所教班级/所教课程"  align="center" show-overflow-tooltip> </el-table-column>
                <el-table-column   prop="operateCount" label="助力次数"  align="center" show-overflow-tooltip> </el-table-column>
                
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
      <el-tab-pane label="按学生统计" name="two"></el-tab-pane>
    </el-tabs> 
  </div>
</template>
<script>
import mixins from "@/mixins/windowResize";
import {
  getCurrentSchoolTimeBySchoolId,
  getSchoolTeacherAssessDataPageList
} from "@/api/evaluateCumulative";
export default {
  data() {
    return {
      activeName: "one",
      daterange: [],
      dataList: [],
      query: {
        startDate: "",
        endDate: "",
        pageNo: 1, //页数
        pageSize: 20, //条数
        type: '0'
      },
      downLoadHref: "",
      total: null
    };
  },
  mixins: [mixins],
  created() {
    getCurrentSchoolTimeBySchoolId().then(res => {
      this.daterange = [
        res.data.data.startDate,
        this.$moment().format("YYYY-MM-DD")
      ];
      this.getSchoolTeacherAssessDataPageLists();
    });
  },
  methods: {
    getSchoolTeacherAssessDataPageLists() {
      this.dataList = [];
      this.query.startDate = this.$moment(this.daterange[0]).format(
        "YYYY-MM-DD"
      ); //时间
      this.query.endDate = this.$moment(this.daterange[1]).format("YYYY-MM-DD"); //时间
      this.downLoadHref =
        global.BasePath +
        "structure/cumulAssess/downloadTeacherAssessDataList?endDate=" +
        this.query.endDate +
        "&startDate=" +
        this.query.startDate +
        "&type=" +
        this.query.type +
        "&token=" +
        this.$store.getters.token;
      getSchoolTeacherAssessDataPageList(this.query).then(res => {
        let data = res.data.data;
        this.dataList = data.dataList;
        this.total = data.pagination.total;
      });
    },
    //切换条数
    handleSizeChange(val) {
      this.query.pageNo = 1;
      this.query.pageSize = val;
      this.getSchoolTeacherAssessDataPageLists();
    },
    //切换页数
    handleCurrentChange(val) {
      this.query.pageNo = val;
      this.getSchoolTeacherAssessDataPageLists();
    },
    timefun(){
       this.query.pageNo = 1;
      this.getSchoolTeacherAssessDataPageLists();
    },
    tabsfun() {
      if (this.activeName == "two") {
        this.$router.replace({ path: "evaluateCumulativeStatisticstwo" });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.evaluateCumulativeStatisticsone {
  padding: 12px;
  .header {
    padding-bottom: 10px;
  }
}
</style>
