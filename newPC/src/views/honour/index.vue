<template>
  <div class="honourContainer">
    <div class="sideBar" :style="`height:${mainHeight}px`">
      <ul>
        <li>
          <router-link active-class="active" to="/main/honour/schoolTotal">全校汇总</router-link>
        </li>
        <li>
          <router-link active-class="active" to="/main/honour/studentList">学生明细</router-link>
        </li>
        <li>
          <router-link active-class="active" to="/main/honour/classStatistics">班级统计</router-link>
        </li>
        <li>
          <router-link active-class="active" to="/main/honour/gradeStatistics">年级统计</router-link>
        </li>
      </ul>
    </div>
    <div class="honour-content clearfix" :style="`height:${mainHeight}px`">
      <router-view></router-view>
    </div>
  </div>
</template>
<script>
import mixins from '@/mixins/windowResize';
export default {
  data(){
    return{
      
    }
  },
  created(){

  },
  mounted(){

  },
  mixins:[mixins]
}
</script>
<style lang="scss" scoped>
.honourContainer{
  .sideBar{
    float: left;
    width: 12%;
    background-color: #eef1f6;
    ul {
      margin: 0;
      li {
        a {
          text-decoration: none;
          display: block;
          height: 56px;
          line-height: 56px;
          font-size: 14px;
          color: #48576a;
          padding: 0 20px;
          cursor: pointer;
          position: relative;
          transition: border-color .3s,background-color .3s,color .3s;
          box-sizing: border-box;
          white-space: nowrap;
          &:hover {
              background-color: #d1dbe5;
          }
        }
        a.active{
          color: #20a0ff;
        }
      }
    }
  }
  .honour-content{
    float: right;
    width: 88%;
    background-color: #fff;
    box-sizing: border-box;
  }
}
</style>


