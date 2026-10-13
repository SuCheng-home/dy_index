<template>
<div class="recordbookclassdetailsdetails" >
     <div class="top"> 
          <el-button  @click="$router.back()" type="default" size="medium">返回</el-button>
          <el-button type="primary" size="medium" @click="remindRecords()"  v-if="isShowByPermission('/structure/scoreBook/remindRecord')">录分通知</el-button> 
          <el-button type="primary" size="medium" v-if="state==0&&isShowByPermission('/structure/scoreBook/openScoreBook')" @click="openScoreBooks()">开启录分</el-button>
          <el-button type="primary" size="medium" v-if="state==1&&isShowByPermission('/structure/scoreBook/closeScoreBook')" @click="closeScoreBooks()">关闭录分</el-button>  
          <el-button type="primary" size="medium" @click="recordbookRecorddetails()">成绩查看</el-button>
     </div>        
     <div class="subject" :style="`height:${maxH+50}px`">
       <div class="h3">{{query.className}}  {{query.name}}</div>
       <div class="ul">
         <div class="li" v-for="(item,index) in dataList" :key="index" @click="recordbookRecord(item.currId)">
           <div class="img"><img :src="item.currLogo" alt=""></div>           
           <div>{{item.currName}}</div>
           <el-button type="primary" plain size="mini" v-if="item.state==0" :disabled="state==0">录分</el-button>
           <el-button type="text"  size="mini" v-else :disabled="state==0">已录入</el-button>
         </div>
       </div>                
     </div>
</div> 
</template>
<script>
import mixin from "@/mixins/windowResize";
import { isShowByPermission } from "@/utils";
import { getCanLookCurr,closeScoreBook,openScoreBook,remindRecord } from "@/api/recordbook";
export default {
  data() {
    return {
      dataList: [],
      query:this.$route.query,
      state:'0'
    };
  },
  mixins: [mixin],
  mounted() {
    this.getCanLookCurrs()
  },
  methods: {
    isShowByPermission,
    //获取详情
    getCanLookCurrs(){
      getCanLookCurr(this.query.id).then(res => {
        let mydata = res.data.data;
        this.dataList=mydata.currList;
        this.state=mydata.state;
      });
    },
    //录分通知
    remindRecords(){
      this.$confirm("确定要发布录分通知吗？", "提示", { type: "warning" })
        .then(() => {
          remindRecord(this.query.id)
            .then(res => {
              if (res.data.code === 200) {
                this.$message({
                  type: "success",
                  message: "发布成功!"
                });
                this.getCanLookCurrs();
              }
            })
            .catch(function(error) {});
        })
        .catch(() => {});      
    },
     //关闭录分
    closeScoreBooks(){
      this.$confirm("确定要关闭录分吗？", "提示", { type: "warning" })
        .then(() => {
          closeScoreBook(this.query.id)
            .then(res => {
              if (res.data.code === 200) {
                this.$message({
                  type: "success",
                  message: "关闭成功!"
                });
                this.getCanLookCurrs();
              }
            })
            .catch(function(error) {});
        })
        .catch(() => {});      
    },
    //开启录分
    openScoreBooks(){
      this.$confirm("确定要开启录分吗？", "提示", { type: "warning" })
        .then(() => {
          openScoreBook(this.query.id)
            .then(res => {
              if (res.data.code === 200) {
                this.$message({
                  type: "success",
                  message: "开启成功!"
                });
                this.getCanLookCurrs();
              }
            })
            .catch(function(error) {});
        })
        .catch(() => {});      
    },
    //查看详情
    recordbookRecorddetails(){
       this.$router.push({
                    path: 'recordbookRecorddetails',
                    query: {id:this.query.id,name:this.query.className+this.query.name}
                });
    },
    //录分
    recordbookRecord(currId){
      if(this.state==1){
         this.$router.push({
                    path: 'recordbookRecord',
                    query: {id:this.query.id,currId:currId,name:this.query.className+this.query.name}
                });
      }
       
    },
  }
};
</script>
<style lang="scss" scoped>
.recordbookclassdetailsdetails {
  padding:12px;
  .top {
    border-bottom: 1px solid #e7eaec;
    padding-bottom: 10px;
  }
  .subject{
    overflow: auto;
    .h3{
     text-align: center;
    padding: 20px;
    font-size: 24px;
    line-height: 30px;
    }
    .ul{
      overflow: auto;
      *{
        box-sizing: border-box;
      }
      .li{
        float: left;
        width: 120px;
        margin: 5px 10px;
        text-align: center;
        border-radius: 3px;
        color: #666;
        background: #fff;
        border: 1px solid #b3d8ff;
        position: relative;
        cursor: pointer;
        padding: 10px;
        line-height: 30px;
        font-size: 14px;
        .img{
          width: 60px;
          height: 80px;
          margin: 0 auto;
          img{
            width: 100%;
            max-height: 100%;
            margin: auto 0;
          }
        }   
      }
    }
  }
  
}
</style>