<template>
  <div class="physicalHeadlth">
    <div class="sideBar" :style="`height:${mainHeight}px`">
      <ul>
        <li>
            <router-link active-class="active" to="/main/physicalHealth/fitnessList">数据汇总</router-link>
        </li>
        <li>
            <router-link active-class="active" to="/main/physicalHealth/batchImport">批量导入</router-link>
        </li>
        <li>
            <router-link active-class="active" to="/main/physicalHealth/itemEnter">按项录入</router-link>
        </li>
        <li>
            <router-link active-class="active" to="/main/physicalHealth/studentEnter">按学生录入</router-link>
        </li>
      </ul>
    </div>
    <div class="fitness-content clearfix" :style="`height:${mainHeight}px`">
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
.physicalHeadlth{
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
  .fitness-content{
    float: right;
    width: 88%;
    overflow-y: auto;
    background-color: #fff;
  }
}
</style>

