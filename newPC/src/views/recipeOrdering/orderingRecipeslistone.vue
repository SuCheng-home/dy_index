<template>
<div class="orderingRecipeslistone">
 <el-tabs type="border-card" v-model="activeName"  @tab-click="activeNamefun()">
  <el-tab-pane label="教师订餐统计" name="one" v-if="menuType==1||menuType==2||menuType==4">
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
               <a :href="downLoadHref" target="_blank" download="examName" v-if="dataList.length"><el-button type="primary"  size="medium">导出</el-button></a>
      </div> 
      <div class="top-name">第{{week}}周 星期{{numlist[query.weekDay-1]}} <span v-if="query.setType==1">早餐</span><span v-if="query.setType==2">午餐</span><span v-if="query.setType==3">晚餐</span> 订餐情况</div>
      <div class="top-num">
        <span v-for="item in titleList" :key="item.id" >{{item.name}}：{{item.orderCount}}份</span>
      </div>
      <el-table border fit stripe  highlight-current-row style="width: 100%;" :height="maxH-150" :data="dataList">     
      <el-table-column align="center" label="姓名" show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.userName}}</template>
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
  <el-tab-pane label="学生订餐统计" name="two" v-if="menuType==1||menuType==3||menuType==4"></el-tab-pane>
  <el-tab-pane label="菜品评价统计" name="three"></el-tab-pane>
</el-tabs>
</div> 
</template>
<script>
import mixin from "@/mixins/windowResize";
import {mapGetters} from 'vuex';
import {queryTeacherOrderSetByMenuId} from "@/api/recipeOrdering";
export default {
  data() {
    return {
      activeName:'one', 
      week:this.$route.query.week,
      menuType:this.$route.query.menuType,
      query: {
        mealMenuId:this.$route.query.id,//	食谱id	number	
        pageNo:1,//	页	number	
        pageSize:20,//	页数	number	
        setType:1,//	套餐类型，1早餐，2午餐，3晚餐	number	
        weekDay:1//	周几	number
      }, 
      dataList: [],
      total:null,
      numlist:['一','二','三','四','五','六','日'],
      titleList:[],
      downLoadHref:'',
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
    if(this.menuType==3){
      this.$router.replace({
            path: "orderingRecipeslisttwo",
            query: {id: this.$route.query.id,week:this.$route.query.week,menuType:this.$route.query.menuType}
          });
    }
    this.queryTeacherOrderSetByMenuIds();
  },
  methods: {
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
      this.queryTeacherOrderSetByMenuIds();
    },
    handleCurrentChange(val) {
      this.query.pageNo = val;
      this.queryTeacherOrderSetByMenuIds();
    },
    queryTeacherOrderSetByMenuIds() {
      let sheetTitle="第"+this.week+"周 星期"+this.numlist[this.query.weekDay-1];
      if(this.query.setType==1){
        sheetTitle+='早餐 订餐情况'
      }
      if(this.query.setType==2){
        sheetTitle+='午餐 订餐情况'
      }
      if(this.query.setType==3){
        sheetTitle+='晚餐 订餐情况'
      }
     this.downLoadHref=global.BasePath + "structure/meal/downTeacherWeekOrderSet?mealMenuId=" +this.query.mealMenuId+"&setType=" +this.query.setType+"&weekDay=" +this.query.weekDay+"&sheetTitle=" +sheetTitle +"&token=" +this.$store.getters.token;
      queryTeacherOrderSetByMenuId(this.query).then(res => res.data).then(data => {
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
      this.queryTeacherOrderSetByMenuIds();
    },
  }
};
</script>
<style lang="scss" scoped>
.orderingRecipeslistone{
    padding: 12px;
    .top {
        padding-bottom: 10px;
        border-bottom: 1px solid #e7eaec;
    }
    *{
        box-sizing: border-box;
        word-break:break-all;   word-wrap:break-word;
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
