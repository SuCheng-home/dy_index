<template>
  <div>
    <div class="piclist-wrap" v-loading.body="listLoading" v-if="!markSave&&picList&&picList.length!==0">
      <div class="photo-item" v-for="(picItem,index) in picList" :key="index">
        <a href="javascript:;" v-if="query.indexid==1&&picItem.messageType===1" @click="subjumpToIndexId('/webTwo/main/column/newdetail',query,picItem)">
          <div class="photo" style="background:#ccc;">
            <div class="photo-img" v-if="picItem.logoUrl" :style="{backgroundImage:`url(${picItem.logoUrl})`}"></div>
            <div class="photo-img" v-else style="backgroundImage:url(https://cdnfile-10043692.file.myqcloud.com/admin/images/elastic_school/web/pic_default.jpg)"></div>
          </div>
          <p>{{picItem.title}}</p>
        </a>
        <!--首页消息列表-->
        <a href="javascript:;" v-if="query.messageId&&query.id&&query.messageType&&query.moduleType==3" @click="firstMesTo('/webTwo/main/column/newdetail',query,picItem)">
          <div class="photo" style="background:#ccc;">
            <div class="photo-img" v-if="picItem.logoUrl" :style="{backgroundImage:`url(${picItem.logoUrl})`}"></div>
            <div class="photo-img" v-else style="backgroundImage:url(https://cdnfile-10043692.file.myqcloud.com/admin/images/elastic_school/web/pic_default.jpg)"></div>
          </div>
          <p>{{picItem.title}}</p>
        </a>
        <!---->
        <a href="javascript:;" v-if="!query.indexid&&picItem.messageType===1&&!query.moduleType" @click="subjumpTo('/webTwo/main/column/newdetail',query,picItem)">
          <div class="photo" style="background:#ccc;">
            <div class="photo-img" v-if="picItem.logoUrl" :style="{backgroundImage:`url(${picItem.logoUrl})`}"></div>
            <div class="photo-img" v-else style="backgroundImage:url(https://cdnfile-10043692.file.myqcloud.com/admin/images/elastic_school/web/pic_default.jpg)"></div>
          </div>
          <p>{{picItem.title}}</p>
        </a>
        <a :href="picItem.messageUrl" target="_blank" v-if="picItem.messageType===2&&!query.moduleType">
          <div class="photo" style="background:#ccc;">
            <div class="photo-img" v-if="picItem.logoUrl" :style="{backgroundImage:`url(${picItem.logoUrl})`}"></div>
            <div class="photo-img" v-else style="backgroundImage:url(https://cdnfile-10043692.file.myqcloud.com/admin/images/elastic_school/web/pic_default.jpg)"></div>
          </div>
          <p>{{picItem.title}}</p>
        </a>
      </div>
    </div>
    <div class="no-data" v-if="!markSave&&picList&&picList.length==0">
      <img src="http://cdn.weixiaojia.cn/mobile/images/nodata.png" alt="">
      <p>暂无数据</p>
    </div>
    <div class="piclist-wrap mark-wrap" v-loading.body="listLoading" v-if="markSave&&dataJson&&dataJson.length!==0">
      <div v-for="(dataItem,dataIndex) in dataJson" :key="dataIndex">
        <div class="picTitle">{{dataItem.mark}}</div>
        <div class="cleafix">
          <div class="photo-item" v-for="(picItem,picIndex) in dataItem.markList" :key="picIndex">
            <a href="javascript:;" v-if="query.indexid==1&&picItem.messageType===1" @click="subjumpToIndexId('/webTwo/main/column/newdetail',query,picItem)">
              <div class="photo" style="background:#ccc;">
                <div class="photo-img" v-if="picItem.logoUrl" :style="{backgroundImage:`url(${picItem.logoUrl})`}"></div>
                <div class="photo-img" v-else style="backgroundImage:url(https://cdnfile-10043692.file.myqcloud.com/admin/images/elastic_school/web/pic_default.jpg)"></div>
              </div>
              <p class="mark-p">{{picItem.title}}</p>
              <p class="mark-p" :title="picItem.titleMark">{{picItem.titleMark}}</p>
            </a>
            <!--首页消息列表-->
            <a href="javascript:;" v-if="query.messageId&&query.id&&query.messageType&&query.moduleType==3" @click="firstMesTo('/webTwo/main/column/newdetail',query,picItem)">
              <div class="photo" style="background:#ccc;">
                <div class="photo-img" v-if="picItem.logoUrl" :style="{backgroundImage:`url(${picItem.logoUrl})`}"></div>
                <div class="photo-img" v-else style="backgroundImage:url(https://cdnfile-10043692.file.myqcloud.com/admin/images/elastic_school/web/pic_default.jpg)"></div>
              </div>
              <p class="mark-p">{{picItem.title}}</p>
              <p class="mark-p" :title="picItem.titleMark">{{picItem.titleMark}}</p>
            </a>
            <!---->
            <a href="javascript:;" v-if="!query.indexid&&picItem.messageType===1&&!query.moduleType" @click="subjumpTo('/webTwo/main/column/newdetail',query,picItem)">
              <div class="photo" style="background:#ccc;">
                <div class="photo-img" v-if="picItem.logoUrl" :style="{backgroundImage:`url(${picItem.logoUrl})`}"></div>
                <div class="photo-img" v-else style="backgroundImage:url(https://cdnfile-10043692.file.myqcloud.com/admin/images/elastic_school/web/pic_default.jpg)"></div>
              </div>
              <p class="mark-p">{{picItem.title}}</p>
              <p class="mark-p" :title="picItem.titleMark">{{picItem.titleMark}}</p>
            </a>
            <a :href="picItem.messageUrl" target="_blank" v-if="picItem.messageType===2&&!query.moduleType">
              <div class="photo" style="background:#ccc;">
                <div class="photo-img" v-if="picItem.logoUrl" :style="{backgroundImage:`url(${picItem.logoUrl})`}"></div>
                <div class="photo-img" v-else style="backgroundImage:url(https://cdnfile-10043692.file.myqcloud.com/admin/images/elastic_school/web/pic_default.jpg)"></div>
              </div>
              <p class="mark-p">{{picItem.title}}</p>
              <p class="mark-p" :title="picItem.titleMark">{{picItem.titleMark}}</p>
            </a>
          </div>
        </div>
      </div>
      
    </div>
    <div class="no-data" v-if="markSave&&picList&&picList.length==0">
      <img src="http://cdn.weixiaojia.cn/mobile/images/nodata.png" alt="">
      <p>暂无数据</p>
    </div>
  </div>
</template>

<script>
import {mapGetters} from 'vuex';
import {getSchoolWebModuleMessageList} from '@/api/firstPage';
export default {
  data(){
    return{
      query:null,
      listLoading: true,
      listQuery:{
        pageNo:1,
        pageSize:1000
      },
      picList:[],
      dataJson:{},
      markSave:false
    }
  },
  mounted(){
    //console.log("ss",this.$route.query);
    // this.query=this.$route.query;
    // if(this.query.id&&this.query.secondColumn){
    //   if(this.query.type==3){
    //     this.getSchoolWebModuleMessageListFunc();
    //   }
    // }else if(this.query.messageId&&this.query.messageType&&this.query.id&&this.query.moduleType==3){
    //   this.getSchoolWebModuleMessageListFunc();
    // }
  },
  watch:{
    '$route':{
      handler:function(to,from){
        if(to.query){
          this.query=to.query;
          if(this.query.id&&this.query.secondColumn){
            if(this.query.type==3){
              this.getSchoolWebModuleMessageListFunc();
            }
          }else if(this.query.messageId&&this.query.messageType&&this.query.id&&this.query.moduleType==3){
            this.getSchoolWebModuleMessageListFunc();
          }
        }
      },
      immediate: true
    }
  },
  methods:{
    //栏目消息列表跳转
    subjumpTo(url,parquery,query){
      //console.log("ss",parquery,query)
      this.$router.push({path:url,query:{parentsid:parquery.parentid,parentid:parquery.id,id:query.id,messageType:query.messageType,secondColumn:parquery.secondColumn,type:parquery.type}})
    },
    firstMesTo(url,parquery,query){
      this.$router.push({path:url,query:{id:parquery.id,columnName:parquery.columnName,moduleType:3,messageId:query.id,messageType:query.messageType}});
    },
    subjumpToIndexId(url,parquery,query){
      this.$router.push({path:url,query:{columnName:parquery.columnName,id:query.id,messageType:query.messageType,moduleOnly:parquery.id,type:parquery.type,secondColumn:parquery.secondColumn,indexid:parquery.indexid}})
    },
    getSchoolWebModuleMessageListFunc(){
      this.picList=[];
      this.listLoading = true;
      getSchoolWebModuleMessageList({
        pageNo:this.listQuery.pageNo,
        pageSize:this.listQuery.pageSize,
        moduleId:this.query.id
      })
      .then(res=>res.data)
      .then(res=>{
        //console.log(res.data.dataList);
        this.picList=res.data.dataList;
        let markData=[];
        let markJson={};
        this.dataJson = [];
        this.picList.forEach((item,index,arr)=>{
          if(item.mark&&item.mark!==''){
            this.markSave=true;
             if(markData.indexOf(item.mark)==-1){
                markData.push(item.mark);
                markJson[item.mark]=[];
                markJson[item.mark].push(item);
              }else{
                markJson[item.mark].push(item);
              }
          }else{
            this.markSave=false;
          }
         
        })
        if(markJson&&Object.keys(markJson)!==0){
          for(var a in markJson){
            var obj = {"mark": a,"markList":markJson[a]};
            this.dataJson.push(obj);
          }
        }
       
        //console.log(this.dataJson)
        this.listLoading = false;
      })
    },
  },
  computed:{
    ...mapGetters([
      
    ])
  }
}
</script>

<style lang="scss" scoped>
@import '../../../../styles/mixin.scss';
.piclist-wrap{
  padding: 0 25px;
  padding-top:20px;
  @include clearfix;
  .photo-item{
    float:left;
    width:116px;
    padding:0 0px;
    margin-bottom:10px;
    &>a{
      color:#333;
      display:block;
      .photo{
        width:94px;
        height:132px;
        overflow: hidden;
        margin:0 auto;
        .photo-img{
          display:block;
          width:100%;
          max-width:100%;
          height:100%;
          background-position: center center;
          background-size:cover;
        }
      }
      &>p{
        text-align: center;
        padding:10px 0;
      }
    }
    &>a:hover{
      // color:#006442;
    }
  }
}
.no-data{
  text-align: center;
  padding:80px 0 20px 0;
  &>img{
    width:auto;
    display:block;
    max-width:100%;
    margin:0 auto;
  }
  &>p{
    font-size:14px;
    color:#000;
  }
}
.picTitle{
  height: 60px;
  line-height: 60px;
  color: #136786;
  font-size: 20px;
  background: url(https://cdnfile-10043692.file.myqcloud.com/web/images/template2/web_add_pic1.png) left bottom no-repeat;
  font-family: '黑体';
  font-weight: bold;
  padding-left: 4px;
  margin-bottom:20px;
}
.cleafix:after{
  content:'';
  display: block;
  height:0;
  clear: both;
  visibility: hidden;
}
.mark-p{
  line-height:20px;
  padding:0 4px !important;
  margin-top:4px;
  white-space: nowrap;
  box-sizing: border-box;
  overflow: hidden;
  text-overflow: ellipsis;
}
.mark-wrap{
  background:#fff url(https://cdnfile-10043692.file.myqcloud.com/web/images/template2/teacherBg.jpg) center bottom no-repeat;
  padding-bottom:140px;
}
</style>