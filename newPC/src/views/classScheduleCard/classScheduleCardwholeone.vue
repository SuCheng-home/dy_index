<template>
  <div class="classScheduleCardwholeone"> 
    <el-tabs type="border-card"  v-model="activeName" @tab-click="classScheduleCard()">
      <el-tab-pane label="按班级" name="one">
        <div class="top">
             <el-button @click="classScheduleCardindex()" type="default" size="medium">返回</el-button> 
        </div> 
        <div class="box-body" :style="`height: ${maxH}px;`">
            <div class="listbox" :key="gradeIndex" v-for="(grade,gradeIndex) in datalist">
                 <div class="box-top">{{grade.name}}</div>
                 <div class="box-ul">
                         <div :key="index"  v-for="(item,index) in grade.list"  class="box-li contentInfo" @click="classScheduleCardwholeonedetails(item.id)">
                              <img src="https://cdnfile-10043692.file.myqcloud.com/admin/images/class/class.png" alt="">
                              {{item.departName}}
                        </div>
                 </div>
            </div>
            <default-page Mes="暂无课程表" v-if="ishide"></default-page>
        </div>            
    </el-tab-pane>
    <el-tab-pane label="按老师" name="two"></el-tab-pane>
    </el-tabs> 
     
  </div>
</template>
<script>
import mixin from '@/mixins/windowResize';
import {schoolClassSchedule} from "@/api/classScheduleCard";
import DefaultPage from "@/components/DefaultPage";
export default {
  data(){
    return{ 
      activeName:'one', 
      datalist:[],
      ishide:false    
    }
  },
  created(){
      this.schoolClassSchedules();
  },
  mixins: [mixin],
  components: { DefaultPage},
  methods:{  
    //获取班级列表
    schoolClassSchedules() {
      schoolClassSchedule().then(res => {
        let data = res.data.data;
        this.datalist = [];
        for (let key in data) {
          this.datalist.push({
            name: JSON.parse(key).name,
            list: data[key]
          });
        }
        if(this.datalist.length==0){
          this.ishide=true;
        }
      });
    },    
    //跳转详情
    classScheduleCardwholeonedetails(id){
        this.$router.push({
        path: "classScheduleCardwholeonedetails",
        query: { id: id}
      });
    },
    //卡
    classScheduleCard(){     
      if(this.activeName=='two'){
            this.$router.push({
            path: "classScheduleCardwholetwo"
          });
      }     
    },
    //返回  
    classScheduleCardindex(){     
       this.$router.push({
            path: "classScheduleCardindex"
          });  
    },
  }
}
</script>

<style lang="scss" scoped>
.classScheduleCardwholeone{
  padding: 12px;
  box-sizing: border-box;
  .top{
    padding-bottom: 10px;
    overflow: hidden;
    border-bottom: 1px solid #e7eaec;
  }
  .box-body {
  overflow: auto;
  padding-top: 30px;
}
.contentInfo {
  color: #303133;
}
.box-ul {
  overflow: auto;
}
.box-top {
  line-height: 20px;
  font-size: 16px;
  border-left: 4px solid #409eff;
  padding-left: 10px;
}
.box-li {
  width: 120px;
  text-align: center;
  margin: 10px 20px;
  cursor: pointer;
  float: left;
  height: 150px;
  font-size: 14px;
  line-height: 24px;
}
.box-li img {
  width: 100px;
  margin: 0 10px;
}
  
}
</style>
