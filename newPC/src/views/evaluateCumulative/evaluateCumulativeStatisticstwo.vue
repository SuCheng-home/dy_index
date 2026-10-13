<template>
  <div class="evaluateCumulativeStatisticstwo">
     <el-tabs type="border-card"  v-model="activeName" @tab-click="tabsfun()">
      <el-tab-pane label="按老师统计" name="one"></el-tab-pane>
      <el-tab-pane label="按学生统计" name="two">
           <div class="header"> 
             <el-select v-model="query.gradeId" placeholder="请选择"  size="medium" @change="queryClassByGradeIds">
                    <el-option label="全部年级" value="0"></el-option>
                     <el-option v-for="item in gradeList" :key="item.id" :label="item.name" :value="item.id"></el-option>
             </el-select>
             <el-select v-model="query.classId" placeholder="请选择"  size="medium" @change="timefun" v-if="query.gradeId!=0">
                    <el-option label="全部班级" value="0"></el-option>
                     <el-option v-for="item in classList" :key="item.id" :label="item.name" :value="item.id"></el-option>
             </el-select>
             <el-date-picker
                    v-model="daterange"
                    type="daterange" class="mywidthdaterange"
                    range-separator="-"  size="medium"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期" @change="timefun"
                    :clearable="false" :editable="false" 
                >
                </el-date-picker>
              <a :href="exportUrl" download="导出" v-if="dataList.length" target="_blank" style="margin-left:10px;">
              <el-button type="primary" size="medium" icon="upload">导出</el-button>
          </a>
          </div>
          <div class="body">
            <el-table  :data="dataList"  border stripe  :height="maxH-70">
                <el-table-column   prop="stuName" label="姓名"  align="center" show-overflow-tooltip> </el-table-column>
                <el-table-column   prop="className" label="班级"  align="center" show-overflow-tooltip> </el-table-column>
                <el-table-column   prop="starNum" label="已获得星数"  align="center" show-overflow-tooltip> </el-table-column>
                <el-table-column   prop="stuPoint" label="当前积分"  align="center" show-overflow-tooltip> </el-table-column>
                <el-table-column   prop="flowerNum" label="已获得花朵数"  align="center" show-overflow-tooltip> </el-table-column>
                <el-table-column   prop="nowMedal" label="称号"  align="center" show-overflow-tooltip> </el-table-column>                
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
import {getSchoolStuPointPageList,querySchoolGrade,queryClassByGradeId,getCurrentSchoolTimeBySchoolId} from "@/api/evaluateCumulative";
export default {
  data() {
    return {
      activeName: "two",
      dataList: [],
      query: {
        pageNo: 1, //页数
        pageSize: 20, //条数
        gradeId: '0',
        classId:'0',
        startDate:"",
        endDate:""
      },
      total: null,
      gradelist:[],
      exportUrl:'',
      daterange:[]
    };
  },
  mixins: [mixins],
  created() {
     getCurrentSchoolTimeBySchoolId().then(res => {
      this.daterange = [
        res.data.data.startDate,
        this.$moment().format("YYYY-MM-DD")
      ];
      this.getSchoolStuPointPageLists();
     querySchoolGrade().then(res => res.data).then(data => {
                    this.gradeList = data.data;
       });
    });
   
  },
  methods: {
    getSchoolStuPointPageLists() {
      this.dataList = []; 
      if(this.daterange[0]){
        this.query.startDate=this.$moment(this.daterange[0]).format( "YYYY-MM-DD")
        this.query.endDate=this.$moment(this.daterange[1]).format( "YYYY-MM-DD")
      }
      this.exportUrl=`${global.BasePath}structure/cumulAssess/downloadStuAssessPointDataList?token=${this.$store.getters.token}&gradeId=${this.query.gradeId}&classId=${this.query.classId}&startDate=${this.query.startDate}&endDate=${this.query.endDate}`;   
      getSchoolStuPointPageList(this.query).then(res => {
        let data = res.data.data;
        this.dataList = data.dataList;
        this.total = data.pagination.total;
      });
    },
    //切换条数
    handleSizeChange(val) {
      this.query.pageNo = 1;
      this.query.pageSize = val;
      this.getSchoolStuPointPageLists();
    },
    //切换页数
    handleCurrentChange(val) {
      this.query.pageNo = val;
      this.getSchoolStuPointPageLists();
    },
    //获取班级
    queryClassByGradeIds(){
      if(this.query.gradeId!=0){        
         queryClassByGradeId(this.query.gradeId).then(res => res.data).then(data => {
                    this.classList = data.data;
       });
      }else{
        this.classList=[]
      }
      this.query.classId='0';
      this.getSchoolStuPointPageLists();
       
    },
    timefun(){
       this.query.pageNo = 1;
       this.getSchoolStuPointPageLists();
    },
    tabsfun() {
      if (this.activeName == "one") {
        this.$router.replace({ path: "evaluateCumulativeStatisticsone" });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.evaluateCumulativeStatisticstwo {
  padding: 12px;
  .header {
    padding-bottom: 10px;
  }
}
</style>
