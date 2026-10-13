<template>
  <div>
    <div class="newDetail-containers" v-if="(query.id&&query.secondColumn&&query.type==1&&!query.moduleOnly&&!special)" :secondModuleContent="secondModuleContent">
      <div class="top-title" >
        <h2>{{secondModuleContent.name}}</h2>
        <h4 class="h4" v-if="secondModuleContent.titleMark">{{secondModuleContent.titleMark}}</h4>
      </div>
      <div class="right-time">
        <span class="text-line">发布日期：{{secondModuleContent.createTime|filterTime}}</span>
        <span class="text-line">浏览次数：{{detailContent.readCount}}</span>
        <span class="text-line">发布用户名：{{detailContent.createUserName}}</span>
      </div>
      <div class="newDetail-container" v-html="secondModuleContent.content">
      </div>
      <div class="share-box" style="margin-bottom:10px;margin-top:10px;">
        <vshare :vshareConfig="vshareConfig"></vshare>
      </div>
    </div>
    
    <!--nav下面的详情-->
    <div class="newDetail-containers" v-if="(query.id&&query.secondColumn&&query.type==2&&!query.moduleOnly)||(query.id&&query.secondColumn&&query.type==3&&!query.moduleOnly)" :detailContent="detailContent">
      <div class="share-wrap">
        <div class="top-title">
          <h2>{{detailContent.title}}</h2>
          <h4 class="h4" v-if="detailContent.titleMark">{{detailContent.titleMark}}</h4>
        </div>
        <div class="right-time">
          <span class="text-line">发布日期：{{detailContent.createTime|filterTime}}</span>
          <span class="text-line">浏览次数：{{detailContent.readCount}}</span>
          <span class="text-line">发布用户名：{{detailContent.createUserName}}</span>
        </div>
        <div class="newDetail-container"  v-html="detailContent.content">
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
        <div class="share-box">
          <vshare :vshareConfig="vshareConfig"></vshare>
        </div>
      </div>
      <div class="message-space"></div>
      <div class="nextMsg" :nextMessage="nextMessage" v-if="nextMessage&&Object.keys(nextMessage)!==0">
        上一篇：<a href="javascript:;" @click="toJumpNextSecond(query,nextMessage)" v-if="nextMessage.messageType==1">{{nextMessage.title}}</a>
        <a :href="nextMessage.messageUrl" target="_blank" v-if="nextMessage.messageType==2">{{nextMessage.title}}</a> 
      </div>
      <div class="lastMsg" :lastMessage="lastMessage" v-if="lastMessage&&Object.keys(lastMessage)!==0">
        下一篇：<a href="javascript:;" @click="toJumpSecond(query,lastMessage)" v-if="lastMessage.messageType==1">{{lastMessage.title}}</a>
        <a :href="lastMessage.messageUrl" target="_blank" v-if="lastMessage.messageType==2">{{lastMessage.title}}</a> 
      </div>
    </div>
    <!--特殊处理-->
    <div class="newDetail-containers-ts" v-if="(this.query.id&&this.query.secondColumn&&special)" :secondModuleContent="secondModuleContent">
      <div class="newDetail-container" v-html="secondModuleContent.content">
      </div>
      <div class="share-box" style="margin-bottom:10px;margin-top:10px;">
        <vshare :vshareConfig="vshareConfig"></vshare>
      </div>
    </div>
    <!--首页栏目下面的消息跳转做特殊处理-->
    <div class="newDetail-containers" v-if="(query.messageId&&query.messageType&&query.id&&query.moduleType==2||query.messageId&&query.messageType&&query.id&&query.moduleType==3)" :detailContent="detailContent">
      <div class="share-wrap">
        <div class="top-title">
          <h2>{{detailContent.title}}</h2>
          <h4 class="h4" v-if="detailContent.titleMark">{{detailContent.titleMark}}</h4>
        </div>
        <div class="right-time">
          <span class="text-line">发布日期：{{detailContent.createTime|filterTime}}</span>
          <span class="text-line">浏览次数：{{detailContent.readCount}}</span>
          <span class="text-line">发布用户名：{{detailContent.createUserName}}</span>
        </div>
        <div class="newDetail-container"  v-html="detailContent.content">
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
        <div class="share-box">
          <vshare :vshareConfig="vshareConfig"></vshare>
        </div>
      </div>
      <div class="message-space"></div>
      <div class="nextMsg" :nextMessage="nextMessage" v-if="nextMessage&&Object.keys(nextMessage)!==0">
        上一篇：<a href="javascript:;" @click="toJumpNext(nextMessage)" v-if="nextMessage.messageType==1">{{nextMessage.title}}</a>
        <a :href="nextMessage.messageUrl" target="_blank" v-if="nextMessage.messageType==2">{{nextMessage.title}}</a> 
      </div>
      <div class="lastMsg" :lastMessage="lastMessage" v-if="lastMessage&&Object.keys(lastMessage)!==0">
        下一篇：<a href="javascript:;" @click="toJump(lastMessage)" v-if="lastMessage.messageType==1">{{lastMessage.title}}</a>
        <a :href="lastMessage.messageUrl" target="_blank" v-if="lastMessage.messageType==2">{{lastMessage.title}}</a> 
      </div>
    </div>


    <div class="newDetail-containers" v-if="(this.query.id&&this.query.messageType&&query.moduleOnly&&!query.messageId)" :detailContent="detailContent">
      <div class="share-wrap">
        <div class="top-title">
          <h2>{{detailContent.title}}</h2>
          <h4 class="h4" v-if="detailContent.titleMark">{{detailContent.titleMark}}</h4>
        </div>
        <div class="right-time">
          <span class="text-line">发布日期：{{detailContent.createTime|filterTime}}</span>
          <span class="text-line">浏览次数：{{detailContent.readCount}}</span>
          <span class="text-line">发布用户名：{{detailContent.createUserName}}</span>
        </div>
        <div class="newDetail-container"  v-html="detailContent.content">
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
        <div class="share-box">
          <vshare :vshareConfig="vshareConfig"></vshare>
        </div>
      </div>
      <div class="message-space"></div>
      <div class="nextMsg" :nextMessage="nextMessage" v-if="nextMessage&&Object.keys(nextMessage)!==0">
        上一篇：<a href="javascript:;" @click="toJumpNext2(query,nextMessage)" v-if="nextMessage.messageType==1">{{nextMessage.title}}</a>
        <a :href="nextMessage.messageUrl" target="_blank" v-if="nextMessage.messageType==2">{{nextMessage.title}}</a> 
      </div>
      <div class="lastMsg" :lastMessage="lastMessage" v-if="lastMessage&&Object.keys(lastMessage)!==0">
        下一篇：<a href="javascript:;" @click="toJump2(query,lastMessage)" v-if="lastMessage.messageType==1">{{lastMessage.title}}</a>
        <a :href="lastMessage.messageUrl" target="_blank" v-if="lastMessage.messageType==2">{{lastMessage.title}}</a> 
      </div>
    </div>
  </div>
</template>

<script>
import {mapGetters} from 'vuex';
import {getSchoolWebModuleById,getSchoolWebModuleMessageById,getLastAndNextSchoolMessage} from '@/api/firstPage';
export default {
  data(){
    return{
      query:null,
      detailContent:{},
      secondModuleContent:{},
      special:false,
      createTime:'',
      moduleId:'',
      lastMessage:{},
      nextMessage:{},
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
          if(this.query.id&&this.query.secondColumn&&!this.query.moduleOnly){
            if(this.query.type==1){
              this.$store.dispatch('getSchoolWebModuleByIdFunc',{
                moduleId:this.query.id
              }).then(res=>res.data)
              .then(data=>{
                if(data.code===200){
                  this.secondModuleContent=data.data;
                  //加一个判断作为校史介绍和领导班子的特殊处理
                  if(this.secondModuleContent.name.indexOf("校史介绍")!==-1||this.secondModuleContent.name.indexOf("领导班子")!==-1){
                    this.special=true;
                  }else{
                    this.special=false;
                  }
                }
              })
            }else if(this.query.type==2&&!this.query.moduleOnly||this.query.type==3&&!this.query.moduleOnly){
              this.getSchoolWebModuleMessageByIdFunc(this.query.parentid,this.query.id);
            }
          }
          /*首页栏目下面的消息跳转做特殊处理*/
          if(this.query.messageId&&this.query.messageType&&this.query.id&&this.query.moduleType==2){
            this.getSchoolWebModuleMessageByIdFunc(this.query.id,this.query.messageId);
          }else if(this.query.messageId&&this.query.messageType&&this.query.id&&this.query.moduleType==3){
            this.getSchoolWebModuleMessageByIdFunc(this.query.id,this.query.messageId);
          }else if(this.query.id&&this.query.messageType&&this.query.moduleOnly&&!this.query.messageId){
            this.getSchoolWebModuleMessageByIdFunc(this.query.moduleOnly,this.query.id);
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
    getFileSuffix(fileName) {
      if(fileName){
        return fileName.replace(/.+\./, "").toLowerCase();
      }
    },
    toJumpSecond(query,lastMessage){
     if(query&&lastMessage){
       this.$router.push({
        path:'/webTwo/main/column/newdetail',
        query:{
          parentsid:query.parentsid,
          parentid:query.parentid,
          secondColumn:query.secondColumn,
          type:query.type,
          id:lastMessage.id,
          messageType:lastMessage.messageType
        }
      })
     }
    },
    toJumpNextSecond(query,nextMessage){
      if(query&&nextMessage){
        this.$router.push({
          path:'/webTwo/main/column/newdetail',
          query:{
            parentsid:query.parentsid,
            parentid:query.parentid,
            secondColumn:query.secondColumn,
            type:query.type,
            id:nextMessage.id,
            messageType:nextMessage.messageType
          }
        })
      }
    },
    toJump(lastMessage){
      this.$router.push({
        path:'/webTwo/main/column/newdetail',
        query:{
          id:this.query.id,
          columnName:this.query.columnName,
          moduleType:this.query.moduleType,
          messageId:lastMessage.id,
          messageType:lastMessage.messageType
        }
      })
    },
    toJumpNext(nextMessage){
      this.$router.push({
        path:'/webTwo/main/column/newdetail',
        query:{
          id:this.query.id,
          columnName:this.query.columnName,
          moduleType:this.query.moduleType,
          messageId:nextMessage.id,
          messageType:nextMessage.messageType
        }
      })
    },
    toJump2(query,lastMessage){
      this.$router.push({
        path:'/webTwo/main/column/newdetail',
        query:{
          indexid:query.indexid,
          columnName:query.columnName,
          moduleOnly:query.moduleOnly,
          id:lastMessage.id,
          messageType:lastMessage.messageType,
          type:query.type,
          secondColumn:query.secondColumn
        }
      })
    },
    toJumpNext2(query,nextMessage){
     // path:url,query:{indexid:parquery.indexid,columnName:parquery.columnName,id:query.id,messageType:query.messageType,moduleOnly:parquery.id
      this.$router.push({
        path:'/webTwo/main/column/newdetail',
        query:{
          indexid:query.indexid,
          columnName:query.columnName,
          moduleOnly:query.moduleOnly,
          id:nextMessage.id,
          messageType:nextMessage.messageType,
          type:query.type,
          secondColumn:query.secondColumn
        }
      })
    },
    getLastAndNextSchoolMessageFunc(){
      getLastAndNextSchoolMessage({
        createTime:this.createTime,
        moduleId:this.moduleId
      }).then(res=>res.data)
      .then(data=>{
        if(data.code===200){
          this.lastMessage=data.data.lastMessage;//上一条
          this.nextMessage=data.data.nextMessage;//下一条
        }
      })
    },
    getSchoolWebModuleMessageByIdFunc(moduleId,id){
      var that=this;
      getSchoolWebModuleMessageById({
        messageId:id
      }).then(res=>{
        this.moduleId=moduleId;
        this.detailContent=res.data.data;
        this.createTime=res.data.data.createTime.slice(0,19);
        this.getLastAndNextSchoolMessageFunc();
      })
    }
  },
  computed:{
    ...mapGetters([
      'secondcontent'
    ])
  }
}
</script>

<style lang="scss" scoped>
.newDetail-containers{
  padding: 20px 25px;
  overflow:hidden;
}
.newDetail-containers-ts{
  padding:0;
  overflow: hidden;
  position: relative;
}
.newDetail-container{
  min-height:400px;
  overflow: hidden;
}
.top-title{
  width:100%;
  text-align: center;
  h2{
    margin-top:0px;
    padding-top:0px;
    font-size:26px;
  }
  .h4{
    margin-top:0px;
    padding-top:0px;
    font-size:16px;
  }
}
.right-time{
  width: 780px;
  line-height: 36px;
  margin: 0px auto 10px;
  text-align: center;
  color: #888;
  .text-line{
    margin-right:20px;
  }
}
.nextMsg{
  // margin-top:20px;
  margin-bottom:10px;
}
.message-space{
  border-top:1px dashed gray;
  box-sizing: border-box;
  padding:10px 0 0 0;
  margin-top:10px;
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
<style lang="scss" >
.newDetail-container ol,.newDetail-container ul{
  padding-left: 30px;
}
.newDetail-container td, .newDetail-container th {
    padding: 5px 10px;
    border: 1px solid #DDD;
}
.newDetail-container p{
  margin: 10px 0 0px;
}
.newDetail-container p:first-child{
  margin: 0px 0 0px;
}
.newDetail-container img{
  display:block;
  max-width:70%;
  width:auto;
  height:auto;
  text-align:center;
  margin:0 auto;
}
.file-line{
  margin-top:10px;
  margin-bottom:10px;
}
</style>
<style>
.bds_more{
  display: none;
}
.share-box{
  position: absolute;
  right: 2px;
  padding-left: 4px;
  bottom: 2px;
}
.share-wrap{
  position: relative;
}

</style>


