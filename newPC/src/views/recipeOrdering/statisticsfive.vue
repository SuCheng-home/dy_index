<template>
<div class="statisticsfive">
 <el-tabs type="border-card" v-model="activeName"  @tab-click="activeNamefun()">
  <el-tab-pane label="学生订餐统计" name="one"></el-tab-pane>
  <el-tab-pane label="班级订餐汇总" name="five">
       <div class="top">
        <el-select   v-model="query.schoolTimeId"  placeholder="请选择学期"  @change="changeSchool()" size="medium">
            <el-option v-for="(item,index) in schoolYearList" :key="index" :label="item.schoolTimeName" :value="item.id" ></el-option>
        </el-select>
        <el-select v-model="query.week" placeholder="请选择食谱周次" size="medium" @change="weekfun()">
            <el-option   v-for="item in weeklist" :key="item.week"  :label="'第'+item.week+'周'" :value="item.week"></el-option>
        </el-select>   
       <el-select class="selectWidth" size="medium" v-model="query.setType" placeholder="请选择类型" @change="classOrderAnalysiss()">
                <el-option label="早餐" :value="1"> </el-option>
                <el-option label="午餐" :value="2"> </el-option>
                <el-option label="晚餐" :value="3"> </el-option>
        </el-select>
        <el-select  size="medium" v-model="query.gradeId" placeholder="请选择年级" @change="classOrderAnalysiss()">
                      <el-option label="全部年级" :value="0"></el-option>
                      <el-option v-for="item in gradeList" :key="item.id" :label="item.name" :value="item.id">
                      </el-option>
        </el-select> 
         <el-button type="primary" size="medium" @click="printStatistics">打印</el-button>
            <!-- 前端导出 -->
         <el-button type="primary" size="medium"  @click="exportExcel('#outTable', `班级订餐汇总.xlsx`)"   v-if="dataList.length>0">导出</el-button>
        </div> 
    <el-table border fit stripe ref="table"  highlight-current-row style="width: 100%;" :height="maxH-20" :data="dataList"  :span-method="objectSpanMethod">     
           <el-table-column  label="年级" fixed align="center" show-overflow-tooltip width="120px">
                <template slot-scope="scope">
                    <span>{{scope.row.gradeName}}</span>
                </template>
           </el-table-column>
           <el-table-column  label="班级" fixed align="center" show-overflow-tooltip  width="120px">
               <template slot-scope="scope">
                    <span>{{scope.row.className}}</span>
                </template>
           </el-table-column>
            <el-table-column :label="items.name" v-for="(items,indexs) in titleList" :key="indexs" align="center" show-overflow-tooltip>
               <el-table-column  :label="item.bigname" v-for="(item,index) in items.list" :key="index" align="center" show-overflow-tooltip>
                     <template slot-scope="scope">
                        <span>{{scope.row.countList[item.bignum]}}</span>
                    </template>
               </el-table-column>
            </el-table-column>
    </el-table>
    <div  style="display: none;"   id="outTable" >
          <el-table border fit stripe   highlight-current-row style="width: 100%;" ref="print"  :data="dataList"  :span-method="objectSpanMethod">     
           <el-table-column  label="年级" >
                <template slot-scope="scope">
                    <span>{{scope.row.gradeName}}</span>
                </template>
           </el-table-column>
           <el-table-column  label="班级" >
               <template slot-scope="scope">
                    <span>{{scope.row.className}}</span>
                </template>
           </el-table-column>
            <el-table-column :label="items.name" v-for="(items,indexs) in titleList" :key="indexs" align="center" show-overflow-tooltip>
               <el-table-column  :label="item.bigname" v-for="(item,index) in items.list" :key="index" align="center" show-overflow-tooltip>
                     <template slot-scope="scope">
                        <span>{{scope.row.countList[item.bignum]}}</span>
                    </template>
               </el-table-column>
            </el-table-column>
    </el-table>
                
        </div> 
  </el-tab-pane>
  <el-tab-pane label="教师订餐统计" name="two"></el-tab-pane>
  <el-tab-pane label="食材消耗统计" name="three"></el-tab-pane>
  <el-tab-pane label="菜品评价统计" name="four"></el-tab-pane>
</el-tabs>
</div> 
</template>
<script>
import mixin from "@/mixins/windowResize";
  import baseMixin from '@/mixins/baseMixin';
import { mapGetters } from "vuex";
import {
  classOrderAnalysis,
  getSchoolTimeAllList,
  getSeveralWeekListBySchoolTImeId,
  getMealMenuGradeByWeek
} from "@/api/recipeOrdering";
export default {
  data() {
    return {
      activeName: "five",
      query: {
        gradeId: 0, //	年级id,全部传0	number
        schoolTimeId: "", //	学期id	number
        setType: 1, //	套餐类型，1早餐，2午餐，3晚餐	number
        week: 0 //	周
      },
      dataList: [],
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
      schoolYearList: [],
      weelist: [],
      gradeList: [],
      timer: null
    };
  },
  mixins: [mixin,baseMixin],
  computed: {
    ...mapGetters(["userInfo", "schoolInfo"])
  },
  mounted() {
    this.getSchoolTimeAllListFunc();
    this.$nextTick(() => {
      this.timer = setTimeout(() => {
        this.$refs.table.doLayout();
      }, 300);
    });
  },
  beforeDestroy() {
    clearTimeout(this.timer);
  },
  methods: {
      //打印
            printStatistics() {
                this.$print(this.$refs.print);
            },
       objectSpanMethod({ row, column, rowIndex, columnIndex }) {
        if (columnIndex === 0) {
          if (row.index===0) {
            return {
              rowspan: row.num,
              colspan: 1
            };
          } else {
            return {
              rowspan: 0,
              colspan: 0
            };
          }
        }
    },
    classOrderAnalysiss() {
      classOrderAnalysis(this.query)
        .then(res => res.data)
        .then(data => {
          if (data.code === 200 && data.data) {
            let myData = data.data;
            let num = 0;
            this.titleList = [];
            this.dataList = [];
            for (let key in myData.setMap) {
              let list = [];
              for (let i = 0; i < myData.setMap[key].length; i++) {
                list.push({
                  bigname: myData.setMap[key][i].name,
                  bignum: num,
                  bigi: i,
                  biglength: myData.setMap[key].length + 1
                });
                num++;
              }
              list.push({
                bigname: "未订餐",
                bignum: num,
                bigi: 666,
                biglength: myData.setMap[key].length + 1
              });
              num++
              this.titleList.push({
                name: this.numlist[key - 1],
                list: list
              });
            }
            for (let i = 0; i < myData.gradeObjectList.length; i++) {
              for (
                let j = 0;
                j < myData.gradeObjectList[i].classObjectList.length;
                j++
              ) {
                this.dataList.push({
                  gradeName: myData.gradeObjectList[i].gradeName,
                  className:
                    myData.gradeObjectList[i].classObjectList[j].className,
                  countList:
                    myData.gradeObjectList[i].classObjectList[j].countList,
                  index: j,
                  num: myData.gradeObjectList[i].classObjectList.length
                });
              }
            }
            this.$nextTick(() => {
              this.timer = setTimeout(() => {
                this.$refs.table.doLayout();
              }, 300);
            });
          }
        })
        .catch(() => {});
    },
    //获取年级
    getMealMenuGradeByWeeks() {
      this.gradeList=[];
      getMealMenuGradeByWeek(this.query.schoolTimeId,this.query.week)
        .then(res => res.data)
        .then(data => {
          this.gradeList = data.data;
        });
    },
    weekfun(){
      this.query.pageNo = 1;
      this.query.gradeId = 0;
         this.getMealMenuGradeByWeeks();
         this.classOrderAnalysiss();
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
      getSeveralWeekListBySchoolTImeId(this.query.schoolTimeId)
        .then(res => res.data)
        .then(data => {
          let mydata = data.data;
          this.weeklist = mydata;
          this.query.week = 1;
          for (let i = 0; i < mydata.length; i++) {
            if (mydata[i].nowWeek == 1) {
              this.query.week = mydata[i].week;
            }
          }
          this.getMealMenuGradeByWeeks();
          this.classOrderAnalysiss();
        });
    },
    //获取年级
    changeSchool() {
      this.query.gradeId = 0;
      this.getMealMenuGradeByWeeks();
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
    }
  }
};
</script>
<style lang="scss" scoped>
.statisticsfive {
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
