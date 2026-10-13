<template>
  <div class="detail-container">
    <!--主体内容-->
    <div class="detail-wrapper">
      <div class="detail-wrap">
        <div class="sitemenu">
          <span class="fa fa-map-marker icon fl"></span>
          <span class="fl name">位置：</span>
          <div class="list-title">
            <el-breadcrumb separator-class="el-icon-arrow-right">
              <el-breadcrumb-item :to="{ path: '/webTwo/main/index' }">首页</el-breadcrumb-item>
              <template v-if="query.id&&query.firstColumn" v-for="navItem in columnList" >
                <el-breadcrumb-item v-if="navItem.id==query.id">{{navItem.name}}</el-breadcrumb-item>
              </template>
              <template v-if="this.query.id && this.query.parentsid">
                <el-breadcrumb-item>{{query.columnName}}</el-breadcrumb-item>
              </template>
              <template v-if="query.id && query.secondColumn&&query.type">
                <el-breadcrumb-item>{{query.columnName}}</el-breadcrumb-item>
              </template>
            </el-breadcrumb>
          </div>
          
        </div>
        <div class="new-details"  v-if="query.id&&query.firstColumn" :firstColumnContent="firstColumnContent">
          <div class="top-title">
            <h2>{{firstColumnContent.name}}</h2>
          </div>
          <div class="right-time">
            <span>{{firstColumnContent.createTime|filterTime}}</span>
          </div>
          <div class="new-detail" v-html="firstColumnContent.content">
          </div>
          <div class="share-box" style="margin-bottom:10px;margin-top:10px;">
            <vshare :vshareConfig="vshareConfig"></vshare>
          </div>
        </div>
        <div class="new-details" v-loading.body="listLoading" v-if="query.id&&query.parentsid" :detailContent="detailContent">
          <div class="top-title">
            <h2>{{detailContent.title}}</h2>
            <h4 class="h4" v-if="detailContent.titleMark">{{detailContent.titleMark}}</h4>
          </div>
          <div class="right-time">
            <span>{{detailContent.createTime|filterTime}}</span>
          </div>
          <div class="new-detail" v-html="detailContent.content"></div>
          <div class="share-box" style="margin-bottom:10px;margin-top:10px;">
            <vshare :vshareConfig="vshareConfig"></vshare>
          </div>
        </div>
        
        <div class="new-details"  v-if="query.id&&query.onlyDetail" :detailContentOne="detailContentOne">
          <div class="top-title">
            <h2>{{detailContentOne.title}}</h2>
            <h4 class="h4" v-if="detailContentOne.titleMark">{{detailContentOne.titleMark}}</h4>
          </div>
          <div class="right-time">
            <span>{{detailContentOne.createTime|filterTime}}</span>
          </div>
          <div class="new-detail"  v-html="detailContentOne.content">
          </div>
          <div class="share-box" style="margin-bottom:10px;margin-top:10px;">
            <vshare :vshareConfig="vshareConfig"></vshare>
          </div>
        </div>
        <div class="new-details"  v-if="query.id && query.secondColumn&&query.type" :moudledetailContent="moudledetailContent">
          <div class="top-title">
            <h2>{{moudledetailContent.name}}</h2>
          </div>
          <div class="right-time">
            <span>{{moudledetailContent.createTime|filterTime}}</span>
          </div>
          <div class="new-detail"  v-html="moudledetailContent.content">
          </div>
          <div class="share-box" style="margin-bottom:10px;margin-top:10px;">
            <vshare :vshareConfig="vshareConfig"></vshare>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import {mapGetters} from 'vuex';
import {getSchooWebColumnById,getSecondColumnInfo,getSchoolWebModuleMessageById,getSchoolWebModuleById} from '@/api/firstPage';
export default {
  data(){
    return{
      query:null,
      listLoading:true,
      detailContent:{},
      detailContentOne:{},
      moudledetailContent:{},
      firstColumnContent:{},
      vshareConfig:{
        share: [{bdSize: 16}],
        shareList:['more','sqq','qzone','tsina','weixin']
      }
    }
  },
  beforeCreate(){
    window._bd_share_main =""; 
  },
  mounted(){
    
  },
  watch:{
    '$route':{
      handler:function(to,from){
        if(to.query){
          this.query=to.query;
          //一级栏目
          if(this.query.id && this.query.firstColumn){
            this.$store.dispatch('getSchooWebColumnByIdFunc',{
              columnId:this.query.id
            }).then(res=>res.data)
            .then(data=>{
              if(data.code===200){
                //console.log("sd",data.data)
                this.firstColumnContent=data.data;
              }
            })
          }
          //查询首页列表的消息详情
          if(this.query.id && this.query.parentsid){
            this.getSchoolWebModuleMessageByIdFunc(this.query.id);
          }
          if(this.query.id && this.query.onlyDetail){
            this.getSchoolWebModuleMessageByIdOneFunc(this.query.id);
          }
          if(this.query.id && this.query.secondColumn&&this.query.type){
            this.getSchoolWebModuleByIdFunc(this.query.id);
          }
        }
      },
      immediate: true
    }
  },
  filters:{
    filterTime(date){
      if(date){
        return date==''?'':date.slice(0,19);
      }
    }
  },
  methods:{
    getSchoolWebModuleByIdFunc(id){
      getSchoolWebModuleById({
        moduleId:id
      }).then(res=>{
        //console.log("wss",res.data.data);
        this.moudledetailContent=res.data.data;
      })
    },
    getSchoolWebModuleMessageByIdFunc(id){
      this.listLoading = true;
      getSchoolWebModuleMessageById({
        messageId:id
      }).then(res=>{
        //console.log("wss",res.data.data);
        this.detailContent=res.data.data;
        //this.logoUrl=res.data.data.logoUrl;
        this.listLoading = false;
      })
    },
    getSchoolWebModuleMessageByIdOneFunc(id){
      getSchoolWebModuleMessageById({
        messageId:id
      }).then(res=>{
        //console.log("wss",res.data.data);
        this.detailContentOne=res.data.data;
      })
    }
  },
  computed:{
    ...mapGetters([
      'columnList',
      'firstlogoUrl',
      'firstcontent',
      'initPhoto'
    ])
  }
}
</script>

<style lang="scss" scoped>
@import '../../../styles/mixin.scss';
.detail-container{
  width:100%;
  min-width:1200px;
  height:auto;
}
.banner-container{
  width:100%;
  min-width:1200px;
  background:#fff;
  height:280px;
  overflow:hidden;
  .banner-wrap{
    width:1200px;
    height:280px;
    margin:0 auto;
    overflow:hidden;
    &>img{
      display:block;
      max-width:100%;
      width:100%;
      height:100%;
    }
  }
}
.line-space{
  width:100%;
  min-width:1200px;
  background:#fff;
  height: 2px;
}
.detail-wrapper{
  width:100%;
  min-width:1200px;
  height:auto;
  background-color:#E5E5E5;
  .detail-wrap{
    width:1200px;
    height: auto;
    margin:0 auto;
    padding-top:10px;
    .sitemenu{
      width:100%;
      height:45px;
      border-bottom:4px solid $column-bottom;
      &>.fl{
        float:left;
        display:block;
      }
      &>.icon{
        font-size:24px;
        // color:#006442;
        font-weight: bold;
        margin: 4px 6px 0 12px;
      }
      &>.name{
        margin:8px 0 0 0;
      }
      &>.list-title{
        padding:11px 0 0 0;
        width:60%;
      }
    }
    .new-details{
      width:100%;
      height:auto;
      padding:20px 40px;
      min-height:480px;
      background:#fff;
      overflow: hidden;
      box-sizing: border-box;
      position: relative;
      .top-title{
        width:100%;
        text-align: center;
        h2{
          margin-top:10px;
          font-size:26px;
        }
        .h4{
          margin-top:0px;
          padding-top:0px;
          font-size:16px;
        }
      }
      .right-time{
        width: 880px;
        line-height: 36px;
        margin: 0px auto 10px;
        text-align: right;
        color: #888;
      }
      
    }
    .new-detail{
      min-height:400px;
      img{
         display:block;
          max-width:70%;
          width:auto;
          height:auto;
          text-align:center;
          margin:0 auto;
      }
    }
  }
 }
</style>
<style>
.detail-container .el-breadcrumb__inner a:hover, .detail-container .el-breadcrumb__inner.is-link:hover{
  color:#4AAB26;
  cursor: pointer;
}
.detail-container .el-breadcrumb__inner{
  color:#333;
}
.new-detail img{
  display:block;
  max-width:70%;
  width:auto;
  height:auto;
  text-align:center;
  margin:0 auto;
}
  
.new-detail ol,.new-detail ul{
  padding-left: 30px;
}
.new-detail td, .new-detail th {
    padding: 5px 10px;
    border: 1px solid #DDD;
}
.new-detail p{
  margin: 10px 0 0px;
}
.new-detail p:first-child{
  margin: 0px 0 0px;
}
</style>
<style>
.bds_more{
  display: none;
}
.bdshare-button-style0-16 a, .bdshare-button-style0-16 .bds_more{
  float:right;
}
</style>