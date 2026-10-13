<template>
<div class="evaluateCumulativeindex" >
     <div class="subject" :style="`height:${notbmaxH}px`">
        <div class="listbox">
            <div class="box-top">所带班级</div>
            <div  class="box-ul">
                <div class="box-ul-li"  v-for="(item,index) in datalist" :key="index" @click="evaluateCumulativelist(item.classId,item.className)">
                    <img src="https://cdnfile-10043692.file.myqcloud.com/admin/images/class/class.png" alt="">
                    <p>{{item.className}}</p>
                </div>
             </div>
        </div> 
         <default-page Mes="暂无班级" v-if="ishide==2"></default-page>   
     </div>
</div> 
</template>
<script>
import mixin from "@/mixins/windowResize";
import {getClassAndGradeByManagerId} from '@/api/evaluateCumulative';
import DefaultPage from "@/components/DefaultPage";
export default {
  data() {
    return {
      datalist: [],
      ishide:0
    };
  },
  mixins: [mixin],
  components: { DefaultPage},
  mounted() {
    this.getClassAndGradeByManagerIds();
  },
  methods: {
    getClassAndGradeByManagerIds(){
      getClassAndGradeByManagerId(this.$store.getters.userInfo.id).then(res=>res.data)
                .then(data=>{
                    if(data.code===200){
                       let mydata=data.data;
                       this.datalist=mydata;
                      // if(mydata.length==1){
                      //   this.$router.replace({path:"evaluateCumulativelist",query:{classId:mydata[0].classId,name:mydata[0].className}});
                      // }                   
                    }
                })
    },
    evaluateCumulativelist(classId,name){
      this.$router.push({
                    path: 'evaluateCumulativelist',
                    query: {classId:classId,name:name}
                });
    },
  }
};
</script>
<style lang="scss" scoped>
.evaluateCumulativeindex {
  padding:12px;
  .top {
    border-bottom: 1px solid #e7eaec;
    padding-bottom: 10px;
  }
  .subject {
    overflow: auto;
    padding-top: 30px;
     .Notime{
      text-align: center;
      color: #666;
      line-height: 280px;
      font-size: 16px;
    }
    .box-top {
      line-height: 20px;
    font-size: 16px;
    border-left: 4px solid #409eff;
    padding-left: 10px;
    }
    .box-ul {
      overflow: auto;      
      .box-ul-li {
        width: 120px;
        text-align: center;
        margin: 10px 30px;
        cursor: pointer;
        float: left;
        height: 160px;
        font-size: 14px;
        img {
          width: 100px;
          margin: 0 10px;
        }
      }
    }
  }
}
</style>