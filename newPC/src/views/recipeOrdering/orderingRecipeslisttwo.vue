<template>
<div class="orderingRecipeslisttwo">
 <el-tabs type="border-card" v-model="activeName"  @tab-click="activeNamefun()">
  <el-tab-pane label="教师订餐统计" name="one" v-if="menuType==1||menuType==2||menuType==4"></el-tab-pane>
  <el-tab-pane label="学生订餐统计" name="two" v-if="menuType==1||menuType==3||menuType==4">
      <div class="top">
             <el-button @click="$router.back()" type="default" size="medium">返回</el-button>
              <el-select class="selectWidth" size="medium" v-model="query.setType" placeholder="请选择类型" @change="switchfun()">
                <el-option label="早餐" :value="1"> </el-option>
                <el-option label="午餐" :value="2"> </el-option>
                <el-option label="晚餐" :value="3"> </el-option>
              </el-select>
              <el-select class="selectWidth" size="medium" v-model="query.weekDay" placeholder="请选择星期" @change="switchfun()" >
                <el-option label="星期一" :value="1"> </el-option>
                <el-option label="星期二" :value="2"> </el-option>
                <el-option label="星期三" :value="3"> </el-option>
                <el-option label="星期四" :value="4"> </el-option>
                <el-option label="星期五" :value="5"> </el-option>
                <el-option label="星期六" :value="6"> </el-option>
                <el-option label="星期日" :value="7"> </el-option>
              </el-select>
               <el-select  size="medium" v-model="query.gradeId" placeholder="请选择年级" @change="getMealMenuGradeClasss()">
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
      <div class="top-name">第{{week}}周 星期{{numlist[query.weekDay-1]}}  {{name}}  <span v-if="query.setType==1">早餐</span><span v-if="query.setType==2">午餐</span><span v-if="query.setType==3">晚餐</span> 订餐情况</div>
      <div class="top-num">
        <span v-for="(item,index) in titleList" :key="index" >{{item.name}}：{{item.orderCount}}{{(index==(titleList.length-1))?'':'份'}}</span>
      </div>
      <el-table border fit stripe  highlight-current-row style="width: 100%;" :height="maxH-150" :data="dataList">     
      <el-table-column align="center" label="姓名" show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.userName}}</template>
      </el-table-column>
      <el-table-column align="center" label="所在班级" show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.departName ? scope.row.departName:'----'}}</template>
      </el-table-column>
      <el-table-column align="center" label="所选套餐" show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.name ? scope.row.name:'----'}}</template>
      </el-table-column>
      <el-table-column align="center" label="签名" show-overflow-tooltip>
        <template slot-scope="scope">
           {{ scope.row.takeFlag==1? scope.row.userName:''}}
        </template>
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
  <el-tab-pane label="菜品评价统计" name="three"></el-tab-pane>
</el-tabs>
</div> 
</template>
<script>
import mixin from "@/mixins/windowResize";
import {mapGetters} from 'vuex';
import {queryStuOrderSetByMenuId,getMealMenuGradeClass,getMealMenuGrade} from "@/api/recipeOrdering";
export default {
  data() {
    return {
      activeName:'two', 
      week:this.$route.query.week,
      menuType:this.$route.query.menuType,
      name:'',
      query: {
        mealMenuId:this.$route.query.id,//	食谱id	number	
        pageNo:1,//	页	number	
        pageSize:20,//	页数	number	
        setType:1,//	套餐类型，1早餐，2午餐，3晚餐	number	
        weekDay:1,//	周几	number
        classId:0,
        gradeId:0
      }, 
      dataList: [],
      total:null,
      numlist:['一','二','三','四','五','六','日'],
      titleList:[],
      downLoadHref:'',
      gradeList:[],
      classList:[],
    };
  },
  mixins: [mixin],
  computed:{
    ...mapGetters(['userInfo'])
  },
  mounted() {
    let myDate = new Date();
    let wk = myDate.getDay();
    this.query.weekDay=wk==0?7:wk;
    this.queryStuOrderSetByMenuIds();
    this.querySchoolGrades();    
  },
  methods: {
      querySchoolGrades(){
         getMealMenuGrade(this.$route.query.id).then(res => res.data).then(data => {
                    this.gradeList = data.data;
       });
      },
    //获取班级
    getMealMenuGradeClasss(){
      if(this.query.gradeId!=0){        
         getMealMenuGradeClass(this.query.gradeId,this.$route.query.id).then(res => res.data).then(data => {
            this.classList = data.data;
       });
      }else{
        this.classList=[]
      }
      this.query.classId=0;
      this.switchfun();
    },
      activeNamefun(){
         if(this.activeName=='one'){
           this.$router.replace({
            path: "orderingRecipeslistone",
            query: {id: this.$route.query.id,week:this.$route.query.week,menuType:this.$route.query.menuType}
          });
         }
         if(this.activeName=='two'){
           this.$router.replace({
            path: "orderingRecipeslisttwo",
            query: {id: this.$route.query.id,week:this.$route.query.week,menuType:this.$route.query.menuType}
          });
         }
         if(this.activeName=='three'){
           this.$router.replace({
            path: "orderingRecipeslistthree",
            query: {id: this.$route.query.id,week:this.$route.query.week,menuType:this.$route.query.menuType}
          });
         }
      },
      handleSizeChange(val) {
      this.query.pageNo = 1;
      this.query.pageSize = val;
      this.queryStuOrderSetByMenuIds();
    },
    handleCurrentChange(val) {
      this.query.pageNo = val;
      this.queryStuOrderSetByMenuIds();
    },
    queryStuOrderSetByMenuIds() {
        if(this.query.gradeId==0){
            this.name=''
        }else{
           if( this.query.classId==0){
               for(let i=0;i<this.gradeList.length;i++){
                   if(this.query.gradeId==this.gradeList[i].id){
                       this.name=this.gradeList[i].name;
                   }
               }
           }else{
               for(let i=0;i<this.classList.length;i++){
                   if(this.query.classId==this.classList[i].id){
                       this.name=this.classList[i].name;
                   }
               }
           }
        }
      let sheetTitle="第"+this.week+"周 星期"+this.numlist[this.query.weekDay-1]+this.name;
      if(this.query.setType==1){
        sheetTitle+='早餐 订餐情况'
      }
      if(this.query.setType==2){
        sheetTitle+='午餐 订餐情况'
      }
      if(this.query.setType==3){
        sheetTitle+='晚餐 订餐情况'
      }
     this.downLoadHref=global.BasePath + "structure/meal/downStuWeekOrderSet?mealMenuId=" +this.query.mealMenuId+"&setType=" +this.query.setType+"&weekDay=" +this.query.weekDay+"&classId=" +this.query.classId+"&gradeId=" +this.query.gradeId+"&sheetTitle=" +sheetTitle +"&token=" +this.$store.getters.token;
      queryStuOrderSetByMenuId(this.query).then(res => res.data).then(data => {
          if (data.code === 200 && data.data) {
            let myData = data.data;
            this.dataList = myData.dataList;
            this.titleList=myData.titleList;
            this.total = myData.pagination.total;
          }
        })
        .catch(() => {});
    },
    switchfun() {
      this.query.pageNo = 1;
      this.queryStuOrderSetByMenuIds();
    },
  }
};
</script>
<style lang="scss" scoped>
.orderingRecipeslisttwo{
    padding: 12px;
    .top {
        padding-bottom: 10px;
        border-bottom: 1px solid #e7eaec;
    }
    *{
        box-sizing: border-box;
        word-break:break-all;   word-wrap:break-word;
    }
    .el-select {
    width: 200px;
}
    .top-name{        
        font-size: 24px;
        text-align: center;
        line-height: 60px;
        color: #606266;
    }
    .top-num{
        font-size: 16px;
        line-height: 30px;
        height:30px;
        color: #606266;
        span{
          margin-right:30px;
        }
    }
    
}
</style>
