<template>
    <div class="homeVisitadd">
       <div class="header"> 
         <el-button @click="fanhui()" type="default" size="medium">返回</el-button> 
      </div>
      <div class="body" :style="`height: ${nobottommaxH}px;`">
          <div class="ul">
              <div class="li" :class="{'color' : mynun==1}" @click="routefun('comprehensivepracticeStatisticsdetailsone',1)">活动介绍</div>
              <div class="li" :class="{'color' : mynun==2}" @click="routefun('comprehensivepracticeStatisticsdetailstwo',2)">活动分组</div>
              <div class="li" :class="{'color' : mynun==3}" @click="routefun('comprehensivepracticeStatisticsdetailsthree',3)">活动阶段</div>
              <div class="li" :class="{'color' : mynun==4}" @click="routefun('comprehensivepracticeStatisticsdetailsfour',4)">活动评分</div>
          </div>
        <div class="router-box">
              <router-view></router-view>
        </div>
       
      </div>
    </div>
</template>

<script>
    import mixin from '@/mixins/windowResize';
    import {} from '@/api/comprehensivepractice';
    export default {
        data() {
            return {
                mynun:1
            }
        },
        mounted() {
            
        },
        mixins:[mixin],
        methods: {
           fanhui(){
                this.$router.replace({
                    path:'/main/stuEvaluate/comprehensivepractice/comprehensivepracticeStatistics',
                    query: {id:this.$route.query.id}
                })
           },
           routefun(route,num){
               this.mynun=num;
                this.$router.replace({
                            path: route,
                            query: {id:this.$route.query.id,teacherId:this.$route.query.teacherId}
                    })            
            },
            tofun(){

            }
        }
    }
</script>

<style lang="scss" scoped>
.homeVisitadd {
  padding:12px;
  .header {
    padding-bottom: 10px;
    border-bottom: 1px solid #eee;
  }
  .body{
      overflow: auto;
      padding-left: 140px;
      position: relative;
      .ul{
          position: absolute;
          top:0;
          left: 0;
          width: 120px;
          padding: 10px;
          .li{
            background-color: #ecf5ff;
            display: inline-block;
            height: 36px;
            line-height: 36px;
            font-size: 14px;
            color: #409eff;
            border: 1px solid #d9ecff;
            border-radius: 4px;
            box-sizing: border-box;
            white-space: nowrap;
            text-align:  center;
            margin: 5px 0;
            width: 120px;
            cursor:pointer;
          }
          .color{
              background-color: #409eff;
              color:#fff;
              border: 1px solid #409eff;
          }
      }
  }
}
</style>
