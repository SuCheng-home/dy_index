<template>
<div class="orderingRecipeslistthree">
 <el-tabs type="border-card" v-model="activeName"  @tab-click="activeNamefun()">
  <el-tab-pane label="教师订餐统计" name="one" v-if="menuType==1||menuType==2||menuType==4"></el-tab-pane>
  <el-tab-pane label="学生订餐统计" name="two" v-if="menuType==1||menuType==3||menuType==4"></el-tab-pane>
  <el-tab-pane label="菜品评价统计" name="three">
       <div class="top">
             <el-button @click="$router.back()" type="default" size="medium">返回</el-button>
              <a :href="downLoadHref" target="_blank" download="examName" v-if="dataList.length"><el-button type="primary"  size="medium">导出</el-button></a>
      </div> 
    
      <el-table border fit stripe  highlight-current-row style="width: 100%;" :height="maxH-10" :data="dataList">     
      <el-table-column align="center" label="菜品名称" show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.name}}</template>
      </el-table-column>
      <el-table-column align="center" label="综合评分" show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.appraiseLevelAvg>-1 ? scope.row.appraiseLevelAvg:'----'}}</template>
      </el-table-column>
    </el-table>
  </el-tab-pane>
</el-tabs>
</div> 
</template>
<script>
import mixin from "@/mixins/windowResize";
import {mapGetters} from 'vuex';
import {getMealMenuFoodAndAppraise} from "@/api/recipeOrdering";
export default {
  data() {
    return {
      activeName:'three', 
      week:this.$route.query.week,
      mealMenuId:this.$route.query.id,//	食谱id	number
      dataList: [],
      downLoadHref:'',
      menuType:this.$route.query.menuType
    };
  },
  mixins: [mixin],
  computed:{
    ...mapGetters(['userInfo'])
  },
  mounted() {
    this.getMealMenuFoodAndAppraises();
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
    getMealMenuFoodAndAppraises() {      
     this.downLoadHref=global.BasePath + "structure/meal/downMealMenuFoodAndAppraise?mealMenuId=" +this.mealMenuId+"&token=" +this.$store.getters.token;
      getMealMenuFoodAndAppraise(this.mealMenuId).then(res => res.data).then(data => {
          if (data.code === 200 && data.data) {
            let myData = data.data;
            this.dataList = myData;
          }
        })
        .catch(() => {});
    },
  }
};
</script>
<style lang="scss" scoped>
.orderingRecipeslistthree{
    padding: 12px;
    .top {
        padding-bottom: 10px;
    }
    *{
        box-sizing: border-box;
        word-break:break-all;   word-wrap:break-word;
    }
   
    
}
</style>
