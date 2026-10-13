<template>
  <div class="tenEventStaDetail">
    <div class="el-row menu-tools">
      <el-button size="medium" @click="goback()">返回</el-button>
    </div>
    <div class="mainWrap" :tenEventDetail="tenEventDetail">
      <div class="mainCont">
        <h2>{{tenEventDetail.schoolTimeName}}</h2>
        <div class="smallTitle">{{tenEventDetail.stuName}}&nbsp;&nbsp;{{tenEventDetail.createTime|filterTime}}</div>
        <div class="title"><span class="square"></span>学生提交信息</div>
        <div class="section">
          <div class="secTitle">{{tenEventDetail.thingName}}</div>
          <div class="secTxt">{{tenEventDetail.content}}</div>
          <div class="newEventPhoto" v-if="photoUrlArr.length!==0">
            <image-previewer class="image-plate" :images="photoUrlArr" tag="span"> </image-previewer>
          </div>
        </div>
        <div class="title"><span class="square"></span>老师点评</div>
        <div class="section" v-if="!tenEventDetail.reviewContent">
          <p class="noreview">
            暂无
          </p>
        </div>
        <div class="section" v-if="tenEventDetail.reviewContent">
          <div class="teacTitle">{{tenEventDetail.updateUserName}}&nbsp;&nbsp;{{tenEventDetail.updateTime|filterTime}}</div>
          <div class="secTxt">{{tenEventDetail.reviewContent}}</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import mixin from '@/mixins/windowResize';
import moment from 'moment';
import ImagePreviewer from '@/components/ImagePreviewer/ImagePreviewer.vue';
import {getThingById} from '@/api/tenEventStatistic';
export default {
  components:{
    ImagePreviewer
  },
  data(){
    return{
      id:this.$route.query.id,
      tenEventDetail:{},
      photoUrlArr:[]
    }
  },
  created(){
    this.getThingByIdFunc();
  },
  mounted(){

  },
  filters:{
    filterTime(date){
      return date?moment(new Date(Number(date))).format('YYYY-MM-DD HH:mm:ss'):'';
    }
  },
  mixins: [mixin],
  methods:{
    getThingByIdFunc(){
      getThingById({
        id:this.id
      }).then(res=>res.data)
      .then(data=>{
        if(data.code===200){
          this.tenEventDetail=data.data;
          this.photoUrlArr = this.tenEventDetail.photoList.map((entry) => ({
              src: entry.photoUrl
          }));
        }
      })
    },
    goback(){
      this.$router.back();
    }
  }
}
</script>
<style lang="scss" scoped>
.tenEventStaDetail{
  padding:12px;
  box-sizing: border-box;
}
.menu-tools {
  border-bottom: 1px solid #e7eaec;
  padding-bottom: 10px;
}
.mainWrap{
  width:100%;
  padding:20px 0;
  box-sizing: border-box;
  overflow-x: hidden;
  overflow-y: auto;
}
.mainCont{
  width:810px;
  margin:0 auto;
  h2{
    text-align: center;
    font-size:24px;
    color: #2f4050;
    font-weight: normal;
  }
  .smallTitle{
    font-size:13px;
    text-align: center;
    color:#999;
    margin-bottom:30px;
  }
  .title{
    width:100%;
    box-sizing: border-box;
    padding:0px 0  20px;
    font-size:16px;
    .square{
      display: inline-block;
      width:10px;
      height:10px;
      background: #20A0FF;
      margin: 15px 8px 0 0;
    }
  }
  .section{
    padding-left:20px;
    box-sizing: border-box;
    .secTitle{
      font-size:16px;
    }
    .secTxt{
      font-size:14px;
      margin-bottom: 10px;
      margin-top:10px;
      color:#333;
    }
    .teacTitle{
      font-size:13px;
      color:#999;
    }
  }
  .noreview{
    width: 40px;
    text-align: center;
    font-size: 14px;
    background: #D8D8D8;
    color: #fff;
    margin:0;
  }
}
</style>
<style scoped>
.newEventPhoto .images {
    width: 100px;
    height: 100px;
    margin: 5px;
    display: inline-block;
}

.newEventPhoto {
  min-height: 110px;
}
</style>
