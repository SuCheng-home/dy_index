<template>
<div class="evaluateCumulativelist"  >
     <div class="top"> 
          <el-row>
            <el-col :span="6">
               <el-button @click="$router.back()" type="default" size="medium">返回</el-button>
            </el-col>
            <el-col :span="12">            
               <div class="name">{{name}}</div>
            </el-col>
        </el-row>
      </div>
     <div class="subject Dictionariesadd" :style="`height: ${nobottommaxH}px;`">
        <div class="ul">
            <div class='li' v-for="(item, index) in datalist" :key="index" @click="evaluateCumulativedetails(item.stuId)">
                <img :src="item.stuLogo" alt="">
               <div>
                 {{item.stuName}}
                 <div class="right">{{item.nowMedal}}</div>
               </div>
            </div>
        </div>        
     </div>     
</div> 
</template>
<script>
import {getSchoolStuAssessPointList} from '@/api/evaluateCumulative';
import mixin from "@/mixins/windowResize";
export default {
  data() {
    return {
      datalist: [],
      name: this.$route.query.name,
      classId: this.$route.query.classId
    };
  },
  mixins: [mixin],
  created() {
    this.getSchoolStuAssessPointLists();
  },
  methods: {
     getSchoolStuAssessPointLists(){
                getSchoolStuAssessPointList(this.classId).then(res=>res.data)
                .then(data=>{
                    if(data.code===200){
                        this.datalist=data.data
                      for(let i=0;i<this.datalist.length;i++){
                          if(!this.datalist[i].nowMedal){
                              this.datalist[i].nowMedal='暂无'
                          }
                      }
                    }
                })
            },
      evaluateCumulativedetails(id){
      this.$router.push({
                    path: 'evaluateCumulativedetails',
                    query: {id:id}
                });
    },
   
  }
};
</script>
<style lang="scss" scoped>
.evaluateCumulativelist {
  padding:12px;
  .top {
    border-bottom: 1px solid #e7eaec;
    padding-bottom: 10px;
    .name{
        line-height: 36px;
        font-size: 20px;
        text-align: center;
        
    }
  }
  .subject {
    padding-top: 10px;
    overflow: auto;
    .ul{
      overflow: hidden;
      .li{
               float: left;
    width: 100px;
    margin: 10px 15px;
    line-height: 15px;
    font-size: 14px;
    color: #606266;
    color: #409eff;
    background: #ecf5ff;
    padding: 5px 10px;
    border-radius: 8px;
    height: 110px;
    cursor:pointer;
        img{
          width: 60px;
          height: 60px;
          border-radius: 50%;
          margin: 5px 10px;
        }
        .right{
          float: right;
          line-height: 15px;
        }    
      }
    }
    
  }
   
}
</style>