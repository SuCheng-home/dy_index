<template>
  <div class="classScheduleCardwholetwo"> 
    <!-- <el-tabs type="border-card"  v-model="activeName" @tab-click="classScheduleCard()">
      <el-tab-pane label="按班级" name="one"></el-tab-pane>
      <el-tab-pane label="按老师" name="two"> -->
           <div class="top">             
                <el-col :span="19">
                  &nbsp;
                   <!-- <el-button @click="classScheduleCardindex()" type="default" size="medium">返回</el-button> -->
                </el-col>
                <el-col :span="5">
                    <el-input placeholder="老师姓名" size="medium"  v-model.trim="name" >
                         <el-button slot="append" icon="el-icon-search"></el-button>
                    </el-input>
                </el-col> 
        </div> 
        <div class="box-body" :style="`height: ${maxH}px;`">
             <div class="box-ul">
                         <div :key="index" v-show="item.name.indexOf(name) !=-1" v-for="(item,index) in datalist"  class="box-li " @click="classScheduleCardwholetwodetails(item.id,item.name)">
                              <img :src="item.avatar" alt="">
                              {{item.name}}
                        </div>
                 </div>
        </div>    
      <!-- </el-tab-pane>
    </el-tabs>  -->
     
  </div>
</template>
<script>
import mixin from '@/mixins/windowResize';
import {listUsersByType} from "@/api/classScheduleCard";
export default {
  data(){
    return{ 
      activeName:'two', 
      datalist:[],
      name:''    
    }
  },
  created(){
      this.listUsersByTypes();
  },
  mixins: [mixin],
  methods:{  
    //获取班级列表
    listUsersByTypes() {
      listUsersByType().then(res => {
        let data = res.data.data;
        this.datalist=data;
      });
    },    
    //跳转详情
    classScheduleCardwholetwodetails(id,name){
        this.$router.push({
        path: "classScheduleCardwholetwodetails",
        query: { id: id,name:name}
      });
    },
    //跳转
    classScheduleCard(){     
      if(this.activeName=='one'){
            this.$router.push({
            path: "classScheduleCardwholeone"
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
.classScheduleCardwholetwo{
  padding: 12px;
  box-sizing: border-box;
  .top{
    padding-bottom: 10px;
    overflow: hidden;
    border-bottom: 1px solid #e7eaec;
  }
  .box-body {
  overflow: auto;
}
.contentInfo {
  color: #303133;
}
.box-ul {
  overflow: auto;
}

.box-li {
    width: 80px;
    text-align: center;
    margin: 6px;
    cursor: pointer;
    float: left;
    height: 95px;
    font-size: 13px;
    line-height: 24px;
    color: #409eff;
    background: #ecf5ff;
    padding: 10px 0;
    border-radius: 5px;
}
.box-li img {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  margin: 0 15px;
}
  
}
</style>
