<template>
<div class="statisticsone">
 <el-tabs type="border-card" v-model="activeName"  @tab-click="activeNamefun()">
  <el-tab-pane label="学生订餐统计" name="one"></el-tab-pane>
  <el-tab-pane label="班级订餐汇总" name="five"></el-tab-pane>
  <el-tab-pane label="教师订餐统计" name="two">
      <div class="top">
        <el-select   v-model="query.schoolTimeId"  placeholder="请选择学期"  @change="changeSchool" size="medium">
            <el-option v-for="(item,index) in schoolYearList" :key="index" :label="item.schoolTimeName" :value="item.id" ></el-option>
        </el-select>
        <el-select v-model="query.week" placeholder="请选择食谱周次" size="medium" @change="switchfun()">
            <el-option   v-for="item in weeklist" :key="item.week"  :label="'第'+item.week+'周'" :value="item.week"></el-option>
        </el-select>   
       <el-select class="selectWidth" size="medium" v-model="query.setType" placeholder="请选择类型" @change="switchfun()">
                <el-option label="早餐" :value="1"> </el-option>
                <el-option label="午餐" :value="2"> </el-option>
                <el-option label="晚餐" :value="3"> </el-option>
        </el-select>
               <a :href="downLoadHref" target="_blank" download="examName" v-if="dataList.length"><el-button type="primary"  size="medium">导出</el-button></a>
      </div> 
      <div class="top-num">
        <span v-for="item in titleList" :key="item.id" >{{item.name}}：{{item.orderCount}}份</span>
      </div>
      <el-table border fit stripe  highlight-current-row style="width: 100%;" :height="maxH-120" :data="dataList">     
      <el-table-column align="center" label="姓名" show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.userName}}</template>
      </el-table-column>      
      <el-table-column align="center" :label="item" show-overflow-tooltip v-for="(item,index) in numlist" :key="index">
        <template slot-scope="scope">{{ scope.row.orderSetList[index].name}}</template>
      </el-table-column>
      <el-table-column align="center" label="订餐总次数" show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.totalCount}}</template>
      </el-table-column>
    </el-table>
    <div class="pagination-container">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="query.pageNo"
        :page-sizes="[10,20,30, 50]"
        :page-size="query.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
      </div>
  </el-tab-pane>
  <el-tab-pane label="食材消耗统计" name="three"></el-tab-pane>
  <el-tab-pane label="菜品评价统计" name="four"></el-tab-pane>
</el-tabs>
</div> 
</template>
<script>
import mixin from "@/mixins/windowResize";
import { mapGetters } from "vuex";
import {
  queryTeacherOrderAnalysis,
  getSchoolTimeAllList,
  getSeveralWeekListBySchoolTImeId
} from "@/api/recipeOrdering";
export default {
  data() {
    return {
      activeName: "two",
      query: {
        pageNo: 1, //	页	number
        pageSize: 20, //	页数	number
        setType: 1, //	套餐类型，1早餐，2午餐，3晚餐	number
        schoolTimeId: '', //	学期id	number
        searchName: "", //	搜索	string
        setType: 1, //	套餐类型，1早餐，2午餐，3晚餐	number
        week: 0 //	周
      },
      dataList: [],
      total: null,
      numlist: [
        "星期一",
        "星期二",
        "星期三",
        "星期四",
        "星期五",
        "星期六",
        "星期日"
      ],
      titleList: [],
      downLoadHref: "",
      schoolYearList: [],
      weelist:[],
    };
  },
  mixins: [mixin],
  computed: {
    ...mapGetters(["userInfo","schoolInfo"])
  },
  mounted() {
    this.getSchoolTimeAllListFunc();
  },
  methods: {    
    //获取学期
    getSchoolTimeAllListFunc() {
      //学期列表
      getSchoolTimeAllList()
        .then(res => res.data)
        .then(data => {
          this.schoolYearList = data.data;
          this.schoolYearList.forEach(item => {
            if (item.isCurrent == 1) {
              this.query.schoolTimeId = item.id;
              this.getSeveralWeekListBySchoolTImeIds();
            }
          });
        });
    },
     //获取年级
    changeSchool() {
      this.query.pageNo = 1;
      this.getSeveralWeekListBySchoolTImeIds();
    },
    //获取周
    getSeveralWeekListBySchoolTImeIds() {
        getSeveralWeekListBySchoolTImeId(this.query.schoolTimeId).then(res => res.data)
        .then(data => {
             let mydata=data.data;
             this.weeklist=mydata;
             this.query.week=1;
           for (let i = 0; i < mydata.length; i++) {
            if (mydata[i].nowWeek == 1) {
              this.query.week = mydata[i].week;
            }
          }
          this.queryTeacherOrderAnalysiss();
        });
    },
    activeNamefun() {
      if (this.activeName == "one") {
        this.$router.push({
          path: "statisticsone"
        });
      }
      if (this.activeName == "two") {
        this.$router.push({
          path: "statisticstwo"
        });
      }
      if (this.activeName == "three") {
        this.$router.push({
          path: "statisticsthree"
        });
      }
      if (this.activeName == "four") {
        this.$router.push({
          path: "statisticsfour"
        });
      }
      if (this.activeName == "five") {
        this.$router.push({
          path: "statisticsfive"
        });
      }
    },
    handleSizeChange(val) {
      this.query.pageNo = 1;
      this.query.pageSize = val;
      this.queryTeacherOrderAnalysiss();
    },
    handleCurrentChange(val) {
      this.query.pageNo = val;
      this.queryTeacherOrderAnalysiss();
    },
    queryTeacherOrderAnalysiss() {
       this.downLoadHref=global.BasePath + "structure/meal/downTeacherOrderAnalysis?setType=" +this.query.setType+"&schoolTimeId=" +this.query.schoolTimeId+"&searchName=" +this.query.searchName+"&week=" +this.query.week +"&token=" +this.$store.getters.token;
      queryTeacherOrderAnalysis(this.query)
        .then(res => res.data)
        .then(data => {
          if (data.code === 200 && data.data) {
            let myData = data.data;
            this.dataList = myData.dataList;
            this.titleList = myData.titleList;
            this.total = myData.pagination.total;
          }
        })
        .catch(() => {});
    },
    switchfun() {
      this.query.pageNo = 1;
      this.queryTeacherOrderAnalysiss();
    }
  }
};
</script>
<style lang="scss" scoped>
.statisticsone {
  padding: 12px;
  .top {
    padding-bottom: 10px;
    border-bottom: 1px solid #e7eaec;
    .el-select {  
       width: 190px;
     }
  }
  * {
    box-sizing: border-box;
    word-break: break-all;
    word-wrap: break-word;
  }
  .top-name {
    font-size: 24px;
    text-align: center;
    line-height: 60px;
    color: #606266;
  }
  .top-num {
    font-size: 15px;
    line-height: 30px;
    height: 60px;
    color: #606266;
    overflow:auto;
    span {
      margin-right: 20px;
    }
  }
}
</style>
