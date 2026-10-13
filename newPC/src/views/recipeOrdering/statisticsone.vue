<template>
<div class="statisticsone">
 <el-tabs type="border-card" v-model="activeName"  @tab-click="activeNamefun()">
  <el-tab-pane label="学生订餐统计" name="one">
     <div class="top">
        <el-select   v-model="query.schoolTimeId"  placeholder="请选择学期"  @change="changeSchool" size="medium">
            <el-option v-for="(item,index) in schoolYearList" :key="index" :label="item.schoolTimeName" :value="item.id" ></el-option>
        </el-select>
        <el-select v-model="query.week" placeholder="请选择食谱周次" size="medium" @change="switchfunbig()">
            <el-option   v-for="item in weeklist" :key="item.week"  :label="'第'+item.week+'周'" :value="item.week"></el-option>
        </el-select>   
       <el-select class="selectWidth" size="medium" v-model="query.setType" placeholder="请选择类型" @change="switchfun()">
                <el-option label="早餐" :value="1"> </el-option>
                <el-option label="午餐" :value="2"> </el-option>
                <el-option label="晚餐" :value="3"> </el-option>
        </el-select>
        <el-select  size="medium" v-model="query.gradeId" placeholder="请选择年级" @change="getMealMenuGradeClassByWeeks()">
                      <el-option label="全部年级" :value="0"></el-option>
                      <el-option v-for="item in gradeList" :key="item.id" :label="item.name" :value="item.id">
                      </el-option>
        </el-select>
        <el-select  size="medium" v-model="query.classId" placeholder="请选择班级" @change="switchfun()" v-if="query.gradeId">
                      <el-option label="全部班级" :value="0"></el-option>
                      <el-option v-for="item in classList" :key="item.id" :label="item.name" :value="item.id">
                      </el-option>
                  </el-select>
               <a :href="downLoadHref" target="_blank" download="examName" v-if="dataList.length"><el-button type="primary"  size="medium">导出</el-button></a>
      </div> 
      <div class="top-num">
        <span v-for="(item,index) in titleList" :key="index" >{{item.name}}：{{item.orderCount}}{{(index==(titleList.length-1))?'':'份'}}</span>
        <!-- <span v-for="item in titleList" :key="item.id" >{{item.name}}：{{item.orderCount}}份</span> -->
      </div>
      <el-table border fit stripe  highlight-current-row style="width: 100%;" :height="maxH-120" :data="dataList">     
      <el-table-column align="center" label="姓名" show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.userName}}</template>
      </el-table-column>
      <el-table-column align="center" label="所在班级" show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.departName}}</template>
      </el-table-column>
      <el-table-column align="center" :label="item" show-overflow-tooltip v-for="(item,index) in numlist" :key="index">
        <template slot-scope="scope">{{ scope.row.orderSetList[index].name}}</template>
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
  <el-tab-pane label="班级订餐汇总" name="five"></el-tab-pane>
  <el-tab-pane label="教师订餐统计" name="two"></el-tab-pane>
  <el-tab-pane label="食材消耗统计" name="three"></el-tab-pane>
  <el-tab-pane label="菜品评价统计" name="four"></el-tab-pane>
</el-tabs>
</div> 
</template>
<script>
import mixin from "@/mixins/windowResize";
import { mapGetters } from "vuex";
import {
  queryStuOrderAnalysis,
  getSchoolTimeAllList,
  getSeveralWeekListBySchoolTImeId,
  getMealMenuGradeByWeek,
  getMealMenuGradeClassByWeek,possessRole
} from "@/api/recipeOrdering";
export default {
  data() {
    return {
      activeName: "one",
      query: {
        pageNo: 1, //	页	number
        pageSize: 20, //	页数	number
        setType: 1, //	套餐类型，1早餐，2午餐，3晚餐	number
        classId: 0, //	班级id,全部时传0	number
        gradeId: 0, //	年级id,全部传0	number
        schoolTimeId: '', //	学期id	number
        searchName: "", //	搜索	string
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
      gradeList:[],
      classList:[],
    };
  },
  mixins: [mixin],
  computed: {
    ...mapGetters(["userInfo","schoolInfo"])
  },
  mounted() {
    this.possessRoles();
    
  },
  methods: {
     possessRoles() {
      possessRole("10069,191").then(res => {
        if (res.data.code === 200) {
          if(!res.data.data.result){
             this.$router.replace({path: "statistics"});
          }else{
              this.getSchoolTimeAllListFunc();
          }
        }
      });
    },
    //获取年级
    getMealMenuGradeByWeeks(){
        this.gradeList=[];
         getMealMenuGradeByWeek(this.query.schoolTimeId,this.query.week).then(res => res.data).then(data => {
            this.gradeList = data.data;
       });

    },
    //获取班级
    getMealMenuGradeClassByWeeks(){
    if(this.query.gradeId!=0){        
       getMealMenuGradeClassByWeek(this.query.gradeId,this.query.schoolTimeId,this.query.week).then(res => res.data).then(data => {
            this.classList = data.data;
       });
      }else{
        this.classList=[]
      }
      this.query.classId=0;
      this.switchfun();
    },
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
          this.getMealMenuGradeByWeeks()
          this.queryStuOrderAnalysiss();
        });
    },
    //获取年级
    changeSchool() {
      this.query.pageNo = 1;
      this.query.classId = 0;
      this.query.gradeId = 0;
      this.getMealMenuGradeByWeeks()
      this.getSeveralWeekListBySchoolTImeIds();
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
      this.queryStuOrderAnalysiss();
    },
    handleCurrentChange(val) {
      this.query.pageNo = val;
      this.queryStuOrderAnalysiss();
    },
    queryStuOrderAnalysiss() {
       this.downLoadHref=global.BasePath + "structure/meal/downStuOrderAnalysis?classId=" +this.query.classId+"&setType=" +this.query.setType+"&gradeId=" +this.query.gradeId+"&schoolTimeId=" +this.query.schoolTimeId+"&searchName=" +this.query.searchName+"&week=" +this.query.week +"&token=" +this.$store.getters.token;
      queryStuOrderAnalysis(this.query)
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
      this.queryStuOrderAnalysiss();
    },
    switchfunbig(){
      this.query.pageNo = 1;
      this.query.classId = 0;
      this.query.gradeId = 0;
      this.getMealMenuGradeByWeeks();
      this.switchfun();
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
