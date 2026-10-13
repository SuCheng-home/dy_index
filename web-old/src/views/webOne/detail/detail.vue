<template>
  <div class="detail-container">
    <div class="banner-container" v-if="query.id&&query.firstColumn">
      <div class="banner-wrap">
        <img v-if="firstlogoUrl" :src="firstlogoUrl" alt="">
        <img v-else :src="initPhoto" alt="">
      </div>
    </div>
    <div class="banner-container" v-if="this.query.id && this.query.parentsid">
      <div class="banner-wrap">
        <img :src="initPhoto" alt="">
      </div>
    </div>
    <!-- <div class="line-space" v-if="query.id&&query.parentsid"></div> -->
    <!--主体内容-->
    <div class="detail-wrapper">
      <div class="detail-wrap">
        <div class="sitemenu">
          <span class="fa fa-map-marker icon fl"></span>
          <span class="fl name">位置：</span>
          <div class="list-title">
            <el-breadcrumb separator-class="el-icon-arrow-right">
              <el-breadcrumb-item :to="{ path: '/webOne/main/index' }">首页</el-breadcrumb-item>
              <template v-if="query.id&&query.firstColumn" v-for="navItem in columnList" >
                <el-breadcrumb-item v-if="navItem.id==query.id">{{navItem.name}}</el-breadcrumb-item>
              </template>
              <template v-if="this.query.id && this.query.parentsid">
                <el-breadcrumb-item>{{query.columnName}}</el-breadcrumb-item>
              </template>
            </el-breadcrumb>
          </div>
          
        </div>
        <div class="new-details"  v-if="query.id&&query.firstColumn" :firstColumnContent="firstColumnContent">
          <div class="top-title">
            <h2>{{firstColumnContent.name}}</h2>
          </div>
          <div class="right-time" style="text-align:right">
            <span>{{firstColumnContent.createTime|filterTime}}</span>
          </div>
          <div class="new-detail" v-html="firstColumnContent.content">
          </div>
        </div>
        <div class="new-details" v-if="query.id&&query.parentsid">
          <div class="top-title">
            <h2>{{detailContent.title}}</h2>
            <h4 class="h4" v-if="detailContent.titleMark">{{detailContent.titleMark}}</h4>
          </div>
          <div class="right-time">
            <span class="text-line">发布日期：{{detailContent.createTime|filterTime}}</span>
            <span class="text-line">浏览次数：{{detailContent.readCount}}</span>
            <span class="text-line">发布用户名：{{detailContent.createUserName}}</span>
          </div>
          <div class="new-detail"  v-html="detailContent.content">
          </div>
          <div label="上传附件" class="file-line" v-if="detailContent.fileJson&&detailContent.fileJson.length!==0">
            <div class="file-list">
                <template  v-for="(item,itemIndex) in JSON.parse(detailContent.fileJson)">
                    <div v-if="getFileSuffix(item.fileName)==='doc'||getFileSuffix(item.fileName)=='docx'" class="file-item" :key="itemIndex">
                        <span class="file-item-img file-item-img-word"></span>
                        <span class="file-item-des">
                            <a class="link-type" :href="item.url">{{item.fileName}}</a>
                        </span>
                    </div>
                    <div v-if="getFileSuffix(item.fileName)=='ppt'||getFileSuffix(item.fileName)=='pptx'" class="file-item" :key="itemIndex">
                        <span class="file-item-img file-item-img-ppt"></span>
                        <span class="file-item-des">
                            <a class="link-type" :href="item.url">{{item.fileName}}</a>
                        </span>
                    </div>
                    <div v-if="getFileSuffix(item.fileName)=='pdf'" class="file-item" :key="itemIndex">
                        <span class="file-item-img file-item-img-pdf"></span>
                        <span class="file-item-des">
                            <a class="link-type" :href="item.url">{{item.fileName}}</a>
                        </span>
                    </div>
                    <div v-if="getFileSuffix(item.fileName)=='xls'||getFileSuffix(item.fileName)=='xlsx'" class="file-item" :key="itemIndex">
                        <span class="file-item-img file-item-img-excel"></span>
                        <span class="file-item-des">
                            <a class="link-type" :href="item.url">{{item.fileName}}</a>
                        </span>
                    </div>
                    <div v-if="getFileSuffix(item.fileName)=='zip'||getFileSuffix(item.fileName)=='rar'" class="file-item" :key="itemIndex">
                        <span class="file-item-img file-item-img-zip"></span>
                        <span class="file-item-des">
                            <a class="link-type" :href="item.url" :download="item.fileName">{{item.fileName}}</a>
                        </span>
                    </div>
                </template>
            </div>
          </div>
          <div class="message-space"></div>
          <div class="nextMsg" :nextMessage="nextMessage" v-if="nextMessage&&Object.keys(nextMessage)!==0">
            上一篇：<a href="javascript:;" @click="toJumpNext(query,nextMessage)" v-if="nextMessage.messageType==1">{{nextMessage.title}}</a>
            <a :href="nextMessage.messageUrl" target="_blank" v-if="nextMessage.messageType==2">{{nextMessage.title}}</a> 
          </div>
          <div class="lastMsg" :lastMessage="lastMessage" v-if="lastMessage&&Object.keys(lastMessage)!==0">
            下一篇：<a href="javascript:;" @click="toJumpLast(query,lastMessage)" v-if="lastMessage.messageType==1">{{lastMessage.title}}</a>
            <a :href="lastMessage.messageUrl" target="_blank" v-if="lastMessage.messageType==2">{{lastMessage.title}}</a> 
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import {mapGetters} from 'vuex';
import {getSchooWebColumnById,getSecondColumnInfo,getSchoolWebModuleMessageById,getLastAndNextSchoolMessage} from '@/api/firstPage';
export default {
  data(){
    return{
      query:null,
      listLoading:true,
      detailContent:'',
      lastMessage:[],
      nextMessage:[],
      firstColumnContent:{},
      createTime:'',
      moduleId:''
    }
  },
  mounted(){
    
  },
  filters:{
    filterTime(date){
      if(date){
        return date==''?'':date.slice(0,19);
      }
    }
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
            this.getSchoolWebModuleMessageByIdFunc(this.query.parentsid,this.query.id);
          }
        }
      },
      immediate: true
    }
  },
  methods:{
    getFileSuffix(fileName){
      if(fileName){
        return fileName.replace(/.+\./, "").toLowerCase();
      }
    },
    toJumpNext(query,nextMessage){
      if(query&&nextMessage){
        this.$router.push({
          path:'/webOne/main/detail',
          query:{parentsid:query.parentsid,columnName:query.columnName,id:nextMessage.id}
        })
      }
    },
    toJumpLast(query,lastMessage){
      if(query&&lastMessage){
        this.$router.push({
          path:'/webOne/main/detail',
          query:{parentsid:query.parentsid,columnName:query.columnName,id:lastMessage.id}
        })
      }
    },
    getLastAndNextSchoolMessageFunc(){
      getLastAndNextSchoolMessage({
        createTime:this.createTime,
        moduleId:this.moduleId
      }).then(res=>res.data)
      .then(data=>{
        if(data.code===200){
          console.log("下一个",data.data);
          this.lastMessage=data.data.lastMessage;//上一条
          this.nextMessage=data.data.nextMessage;//下一条
        }
      })
    },
    getSchoolWebModuleMessageByIdFunc(parentsid,id){
      this.listLoading = true;
      getSchoolWebModuleMessageById({
        messageId:id
      }).then(res=>{
        //console.log("wss",res.data.data);
        this.moduleId=parentsid;
        this.detailContent=res.data.data;
        this.createTime=this.detailContent.createTime.slice(0,19);
        this.getLastAndNextSchoolMessageFunc();
        //this.logoUrl=res.data.data.logoUrl;
        this.listLoading = false;
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
    .sitemenu{
      width:100%;
      height:35px;
      border-bottom:4px solid $column-bottom;
      &>.fl{
        float:left;
        display:block;
      }
      &>.icon{
        font-size:24px;
        // color:$golbal-color;
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
    .new-detail{
      width:100%;
      height:auto;
      padding:20px 20px 0 20px;
      min-height:480px;
      background:#fff;
      overflow: hidden;
      img{
        display:block;
        max-width:100%;
        width:100%;
        height:auto;
      }
    }
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
      text-align: center;
      color: #888;
    }
    
  }
  .new-detail{
    min-height:400px;
    img{
      display:inline-block;
      max-width:100%;
      font-size:0;
      height:auto;
    }
  }
  .message-space{
    border-top:1px dashed gray;
    box-sizing: border-box;
    padding:10px 0 0 0;
    margin-top:10px;
  }
  .nextMsg{
  // margin-top:20px;
    margin-bottom:10px;
  }
  .file-item-img-word {
  background-image: url(https://cdnfile-10043692.file.myqcloud.com/admin/images/upload/word.png);
}

.file-item-img-ppt {
  background-image: url(https://cdnfile-10043692.file.myqcloud.com/admin/images/upload/ppt.png);
}

.file-item-img-pdf {
  background-image: url(https://cdnfile-10043692.file.myqcloud.com/admin/images/upload/pdf.png);
}

.file-item-img-excel {
  background-image: url(https://cdnfile-10043692.file.myqcloud.com/admin/images/upload/excle.png);
}
.file-item-img-zip {
  background-image: url(https://cdnfile-10043692.file.myqcloud.com/admin/images/upload/ZIP.png);
}
.file-item-img-txt {
  background-image: url(https://cdnfile-10043692.file.myqcloud.com/admin/images/upload/txt.png);
}
.file-item-img {
  height: 28px;
  width: 28px;
  display: block;
  float: left;
  background-position: center center;
  background-size: cover;
}

.file-item {
  height: 30px;
  display: block;
  margin-left: 4px;
  margin-top: 4px;
  margin-bottom:10px;
}

.file-item-des {
  float:left;
  padding-left: 4px;
  line-height: 30px;
  padding-right: 4px;
}
</style>
<style>
.detail-container .el-breadcrumb__inner a:hover, .detail-container .el-breadcrumb__inner.is-link:hover{
  /* color:#E60012; */
  /* cursor: pointer; */
}
.detail-container .el-breadcrumb__inner{
  color:#333;
}
.new-detail img{
  display:block;
  max-width:100%;
  height:auto;
}
  
.new-detail ol,.new-detail ul{
  padding-left: 30px;
}
.new-detail td, .new-detail th {
    padding: 5px 10px;
    border: 1px solid #DDD;
}
.new-detail p{
  margin: 0 0 10px;
}
</style>