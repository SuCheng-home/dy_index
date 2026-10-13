<template>
<div class="interactUserWrap" id="interactUserList">
  <div class="interactUserList" >
    <div class="message-stop-btn" @click="stopHandler()">{{handlerText}}</div>
    <div class="message-item clearfix" v-for="(item,index) in interactList" :key="index">
      <div class="message-item-header" :style="`background-image: url(${item.avatar})`"></div>
      <div class="message-item-cotent">
        <div class="message-item-name">{{item.userName}}<span class="message-item-name-time">（{{item.messageTime|filterTime2}}）</span>：
          <span class="message-item-floor"></span>
        </div>
        <div class="message-item-sayContent">
          {{item.userMessage}}
        </div>
      </div>
    </div>
  </div>
</div>
</template>
<script>
import mixin from '@/mixins/windowResize';
import {mapGetters} from 'vuex';
import {getActivityAskMapData} from '@/api/activity';
export default {
  data(){
    return{
      activityId:this.$route.query.activityId,
      maxId:this.$route.query.maxId,
      interactList:[],
      timer:null,
      handlerText:"暂停提问"
    }
  },
  created(){
    this.interactList=[];
  },
  mounted(){
    this.getActivityAskMapDataFunc();
    this.timer=setInterval(()=>{
      this.getActivityAskMapDataFunc();
      var ele = document.getElementById('interactUserList');
      ele.scrollTop=ele.scrollHeight;
    },3000);
  },
  beforeDestroy() {//取消监听事件
    clearInterval(this.timer);
  },
  mixins:[mixin],
  filters:{
    filterDate(date){
      return date?date.slice(0,19):'';
    },
    filterDate2(date){
      return date?date.slice(0,16):'';
    },
    filterTime2(date){
      return date?date.slice(11,16):''
    },  
    filterDate3(date){
      return date?date.slice(0,10):'';
    }
  },
  methods:{
    stopHandler(){
      if(this.handlerText=='暂停提问'){
        clearInterval(this.timer);
        this.handlerText="开始提问";
      }else{
        this.handlerText="暂停提问";
        this.timer=setInterval(()=>{
          this.getActivityAskMapDataFunc();
          var ele = document.getElementById('interactUserList');
          ele.scrollTop=ele.scrollHeight;
        },3000);
      }
    },
    getActivityAskMapDataFunc(){
      getActivityAskMapData({
        activityId:this.activityId,
        maxId:this.maxId
      }).then(res=>res.data)
      .then(data=>{
        if(data.code===200&&data.data){
          this.interactList=[...this.interactList,...data.data.interactList];
          this.maxId=data.data.maxId;
        }
      })
    },
    jumpTo(path,query={}){
      this.$router.push({
        path,
        query
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.scrollBar {
  overflow-x: hidden;
  overflow-y: auto;
  &::-webkit-scrollbar-track-piece {
      background: #d3dce6;
  }
  &::-webkit-scrollbar {
      width: 6px;
  }
  &::-webkit-scrollbar-thumb {
      background: #99a9bf;
      border-radius: 20px;
  }
}
.clearfix:after {
    content: "";
    height: 0;
    display: block;
    clear: both;
    visibility: hidden;
}
.el-form-item.is-required .el-form-item__label:before {
    content: "*";
    color: #ff4949;
    margin-right: 4px;
}
.interactUserWrap{
  width:100%;
  min-height:100vh;
  overflow-x: hidden;
  overflow-y: scroll;
  background:#6699CC;
}
.interactUserList{
  color:#333;
  position: relative;
  box-sizing: border-box;
  width: 70%;
  margin:0 auto;
  margin-top:100px;
  margin-bottom:100px;
  .message-stop-btn{
    width: 60px;
    height: 60px;
    background-color: #fff;
    border-radius: 30px;
    position: fixed;
    top: 20px;
    right: 20px;
    border: 1px solid #fff;
    cursor: pointer;
    color: #0072E3;
    font-size: 13px;
    line-height: 60px;
    text-align: center;
  }
  .message-item{
    min-height: 140px;
    border-radius: 5px;
    border: 1px solid #E0E0E0;
    background-color: #fff;
    margin-top: 10px;
    animation: sign-fade-in 3s;
    .message-item-header{
      width: 100px;
      height: 100px;
      background-position: center center;
      background-size: cover;
      background-color: #f1f1f1;
      border-radius: 50px;
      margin: 20px;
      float: left;
      overflow: hidden;
    }
    .message-item-cotent{
      margin-top: 20px;
      padding-right: 20px;
      width: 80%;
      float: left;
      margin-bottom: 20px;
      letter-spacing: 4px;
      .message-item-name{
        color: #4986c5;
      }
      .message-item-sayContent{
        margin-top: 10px;
        color: #4986c5;
        word-wrap: break-word;
        word-break: break-all;
      }
    }
  }
} 
@keyframes  sign-fade-in{
    from {opacity: 0;transform:scale(0,0); }
    to {opacity: 1;transform:scale(1,1); }
}

</style>

