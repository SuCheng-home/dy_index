<template>
  <div>
    <div class="newDetail-container module-show" v-if="(query.id&&query.secondColumn)" :secondColumnContent="secondColumnContent">
      <div class="top-title">
        <h2>{{secondColumnContent.name}}</h2>
      </div>
      <div class="right-time">
        <span>{{secondColumnContent.createTime|filterTime}}</span>
      </div>
      <div class="new-detail" v-html="secondColumnContent.content">
      </div>
    </div>
    <div class="newDetailWrap" v-if="(query.id&&query.messageType&&!query.indexid)" :detailContent="detailContent"> 
      <div class="top-title">
        <h2>{{detailContent.title}}</h2>
        <h4 class="h4" v-if="detailContent.titleMark">{{detailContent.titleMark}}</h4>
      </div>
      <div class="right-time">
        <span class="text-line">发布日期：{{detailContent.createTime|filterTime}}</span>
        <span class="text-line">浏览次数：{{detailContent.readCount}}</span>
        <span class="text-line">发布用户名：{{detailContent.createUserName}}</span>
      </div>
      <div class="newDetail-container" v-html="detailContent.content"></div>
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
    <div class="newDetailWrap" v-if="(query.id&&query.messageType&&query.indexid)" :detailContent="detailContent"> 
      <div class="top-title">
        <h2>{{detailContent.title}}</h2>
        <h4 class="h4" v-if="detailContent.titleMark">{{detailContent.titleMark}}</h4>
      </div>
      <div class="right-time">
        <span class="text-line">发布日期：{{detailContent.createTime|filterTime}}</span>
        <span class="text-line">浏览次数：{{detailContent.readCount}}</span>
        <span class="text-line">发布用户名：{{detailContent.createUserName}}</span>
      </div>
      <div class="newDetail-container" v-html="detailContent.content"></div>
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
        上一篇：<a href="javascript:;" @click="moduleJumpNext(query,nextMessage)" v-if="nextMessage.messageType==1">{{nextMessage.title}}</a>
        <a :href="nextMessage.messageUrl" target="_blank" v-if="nextMessage.messageType==2">{{nextMessage.title}}</a> 
      </div>
      <div class="lastMsg" :lastMessage="lastMessage" v-if="lastMessage&&Object.keys(lastMessage)!==0">
        下一篇：<a href="javascript:;" @click="moduleJumpLast(query,lastMessage)" v-if="lastMessage.messageType==1">{{lastMessage.title}}</a>
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
      detailContent:'',
      createTime:'',
      moduleId:'',
      lastMessage:[],
      nextMessage:[],
      secondColumnContent:{}
    }
  },
  mounted(){
   
  },
  watch:{
    '$route':{
      handler:function(to,from){
        if(to.query){
          this.query=to.query;
          if(this.query.id&&this.query.secondColumn){
            //console.log(this.query.type);
            if(this.query.type==1){
              this.$store.dispatch('getSchoolWebModuleByIdFunc',{
                moduleId:this.query.id
              }).then(res=>res.data)
              .then(data=>{
                if(data.code===200){
                  //console.log("sd",data.data)
                  this.secondColumnContent=data.data;
                }
              })
            }
          }
          if(this.query.id&&this.query.messageType){
            //console.log("dd");
            this.getSchoolWebModuleMessageByIdFunc(this.query.parentid,this.query.id);
          }
        }
      },
      immediate: true
    }
  },
  filters:{
    filterTime(dateTime){
      return dateTime?dateTime.slice(0,19):''
    }
  },
  methods:{
    moduleJumpNext(query,nextMessage){
      if(query&&nextMessage){
        this.$router.push({path:'/webOne/main/column/newdetail',query:{indexid:query.indexid,columnName:query.columnName,parentid:query.parentid,type:query.type,id:nextMessage.id,messageType:nextMessage.messageType}})
      }
    },
    moduleJumpLast(query,lastMessage){
      if(query&&lastMessage){
        this.$router.push({path:'/webOne/main/column/newdetail',query:{indexid:query.indexid,columnName:query.columnName,parentid:query.parentid,type:query.type,id:lastMessage.id,messageType:lastMessage.messageType}})
      }
    },
    toJumpNext(query,nextMessage){
      if(query&&nextMessage){
        this.$router.push({
          path:'/webOne/main/column/newdetail',
          query:{parentsid:query.parentsid,parentid:query.parentid,id:nextMessage.id,messageType:nextMessage.messageType}
        })
      }
    },
    toJumpLast(query,lastMessage){
      if(query&&lastMessage){
        this.$router.push({
          path:'/webOne/main/column/newdetail',
          query:{parentsid:query.parentsid,parentid:query.parentid,id:lastMessage.id,messageType:lastMessage.messageType}
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
    getFileSuffix(fileName) {
      if(fileName){
        return fileName.replace(/.+\./, "").toLowerCase();
      }
    },
    getSchoolWebModuleMessageByIdFunc(moduleId,id){
      getSchoolWebModuleMessageById({
        messageId:id
      }).then(res=>{
        this.moduleId=moduleId;
        //console.log(res.data.data)
        this.detailContent=res.data.data;
        this.createTime=this.detailContent.createTime.slice(0,19);
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
.newDetail-container{
  padding:20px 0;
  min-height:500px;
  overflow:hidden;
}
.module-show{
  padding:10px 0;
  min-height:500px;
  overflow:hidden;
}
.top-title{
  width:100%;
  text-align: center;
  h2{
    margin-top:0px;
    padding-top:20px;
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
.module-show .right-time{
  text-align: right;
}
.nextMsg{
 // margin-top:20px;
  margin-bottom:10px;
}
.newDetailWrap{
  padding-bottom:20px;
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
  margin: 0 0 10px;
}
.newDetail-container img{
  display:block;
  max-width:100%;
  height:auto;
}

</style>


