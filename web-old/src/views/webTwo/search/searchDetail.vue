<template>
  <div class="search-container">
    <div class="search-wrap">
      <div class="search-content">
        <div class="search-main">
          <div class="detail-wrap">
            <div class="top-title" >
              <h2>{{detailContentOne.title}}</h2>
              <h4 class="h4" v-if="detailContentOne.titleMark">{{detailContentOne.titleMark}}</h4>
            </div>
            <div class="right-time">
              <span class="text-line">发布日期：{{detailContentOne.createTime|filterTime}}</span>
              <span class="text-line">浏览次数：{{detailContentOne.readCount}}</span>
              <span class="text-line">发布用户名：{{detailContentOne.createUserName}}</span>
            </div>
            <div class="new-detail"  v-html="detailContentOne.content">
            </div>
            <div label="上传附件" class="file-line" v-if="detailContentOne.fileJson&&detailContentOne.fileJson.length!==0">
              <div class="file-list">
                  <template  v-for="(item,itemIndex) in JSON.parse(detailContentOne.fileJson)">
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
            <div class="share-box" style="margin-top:10px;">
              <vshare :vshareConfig="vshareConfig"></vshare>
            </div>
          </div>
          <!---->
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import {mapGetters} from 'vuex';
import {getSchoolWebSearch,getSchoolWebModuleMessageById} from '@/api/firstPage';
export default{
  data(){
    return{
      detailContentOne:'',
      query:'',
      vshareConfig:{
        share: [{bdSize: 16}],
        shareList:['more','sqq','qzone','tsina','weixin']
      }
    }
  },
  beforeCreate(){
    window._bd_share_main =""; 
  },
  created(){
    
  },
  mounted(){
    this.query=this.$route.query;
    if(this.query.id && this.query.onlyDetail){
      this.getSchoolWebModuleMessageByIdOneFunc(this.query.id);
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
    getSchoolWebModuleMessageByIdOneFunc(id){
      getSchoolWebModuleMessageById({
        messageId:id
      }).then(res=>{
        //console.log("wss",res.data.data);
        this.detailContentOne=res.data.data;
      })
    }
  }
}
</script>
<style lang="scss">
.search-container{
  width: 100%;
  min-width: 1200px;
  min-height: 313px;
  padding: 16px 0 18px;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  background-color: #ececec;
  .search-wrap{
    width: 1200px;
    min-height: 313px;
    height: auto;
    margin: 0 auto;
    background: #fff;
    border-radius: 4px;
    overflow: hidden;
    .search-content{
      width: 100%;
      padding: 20px;
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
    }
  }
}
.search-box{
  width:80%;
  margin:0 auto;
  border:1px solid #529D9D;
  height:36px;
  box-sizing: border-box;
  border-radius:4px;
  overflow: hidden;
  background:#fff;
  .search-input{
    float:left;
    width:88%;
    background:none;
    border: 0;
    padding:0 15px;
    height:34px;
    box-sizing: border-box;
    outline: none;
    color:#148d7f;
  }
  .search-input::-webkit-input-placeholder{
    color:#148d7f;
  }
  .search-icon{
    float:right;
    width:95px;
    height:34px;
    line-height:34px;
    text-align: center;
    background:#529D9D;
    cursor: pointer;
    i{
      font-size:20px;
      color:#fff;
    }
  }
}
.search-main{
  width: 100%;
  //padding:10px;
  height: auto;
  min-height: 469px;
 // padding-bottom: 66px;
  position: relative;
  box-sizing: border-box;
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
.file-line{
  margin-top:10px;
  margin-bottom:10px;
}
.new-detail{
  min-height:400px;
  overflow: hidden;
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