<template>
<div class="statisticsone">
 <el-tabs type="border-card" v-model="activeName"  @tab-click="activeNamefun()">
  <el-tab-pane label="学生订餐统计" name="one"></el-tab-pane>
  <el-tab-pane label="班级订餐汇总" name="five"></el-tab-pane>
  <el-tab-pane label="教师订餐统计" name="two"></el-tab-pane>
  <el-tab-pane label="食材消耗统计" name="three">
      <div class="top">
        <el-select   v-model="query.schoolTimeId"  placeholder="请选择学期"  @change="changeSchool" size="medium">
            <el-option v-for="(item,index) in schoolYearList" :key="index" :label="item.schoolTimeName" :value="item.id" ></el-option>
        </el-select>
        <el-select v-model="query.week" placeholder="请选择食谱周次" size="medium" @change="switchfun()">
            <el-option    label="全部食谱周次" :value="0"></el-option>
            <el-option   v-for="item in weeklist" :key="item.week"  :label="'第'+item.week+'周'" :value="item.week"></el-option>
        </el-select> 
        <a :href="downLoadHref" target="_blank" download="examName" v-if="dataList.length"><el-button type="primary"  size="medium">导出</el-button></a>
      </div> 
      <el-table border fit stripe  highlight-current-row style="width: 100%;" :height="maxH-10" :data="dataList">     
      <el-table-column align="center" label="食材名称" show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.materialName}}</template>
      </el-table-column> 
      <el-table-column align="center" label="消耗量（kg）" show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.totalWeight}}</template>
      </el-table-column>
    </el-table>
  </el-tab-pane>
  <el-tab-pane label="菜品评价统计" name="four"></el-tab-pane>
</el-tabs>
</div> 
</template>
<script>
import mixin from "@/mixins/windowResize";
import { mapGetters } from "vuex";
import {
  getOrderMaterialAnalysis,
  getSchoolTimeAllList,
  getSeveralWeekListBySchoolTImeId
} from "@/api/recipeOrdering";
export default {
  data() {
    return {
      activeName: "three",
      query: {
        schoolTimeId: '', //	学期id	number
        searchName: "", //	搜索	string
        week: 0 //	周
      },
      dataList: [],
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
          this.getOrderMaterialAnalysiss();
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
    getOrderMaterialAnalysiss() {
        this.dataList=[];
       this.downLoadHref=global.BasePath + "structure/meal/downOrderMaterialAnalysis?schoolTimeId=" +this.query.schoolTimeId+"&searchName=" +this.query.searchName+"&week=" +this.query.week +"&token=" +this.$store.getters.token;
      getOrderMaterialAnalysis(this.query)
        .then(res => res.data)
        .then(data => {
          if (data.code === 200 && data.data) {
            let myData = data.data;
            this.dataList = myData;
          }
        })
        .catch(() => {});
    },
    switchfun() {
      this.query.pageNo = 1;
      this.getOrderMaterialAnalysiss();
    }
  }
};
</script>
<style lang="scss" scoped>
.statisticsone {
  padding: 12px;
  .top {
    padding-bottom: 10px;
    .el-select {  
       width: 190px;
     }
  }
  * {
    box-sizing: border-box;
    word-break: break-all;
    word-wrap: break-word;
  }  
}
</style>
