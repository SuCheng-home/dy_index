<template>
  <div>
  <div class="piclist-wrap" v-loading.body="listLoading" v-if="picList&&picList.length!==0">
    <div class="photo-item" v-for="(picItem,index) in picList" :key="index">
      <a href="javascript:;" v-if="picItem.messageType===1" @click="subjumpTo('/webOne/main/column/newdetail',query,picItem)">
        <div class="photo" style="background:#ccc;">
          <div class="photo-img" v-if="picItem.logoUrl" :style="{backgroundImage:`url(${picItem.logoUrl})`}"></div>
          <div class="photo-img" v-else :style="{backgroundImage:`url(https://cdnfile-10043692.file.myqcloud.com/admin/images/elastic_school/web/pic_default.jpg)`}"></div>
          <!-- <img v-if="picItem.logoUrl" :src="picItem.logoUrl">
          <img v-else src="https://cdnfile-10043692.file.myqcloud.com/admin/images/elastic_school/web/pic_default.jpg"> -->
        </div>
        <p>{{picItem.title}}</p>
      </a>
      <a :href="picItem.messageUrl" target="_blank" v-if="picItem.messageType===2">
        <div class="photo" style="background:#ccc;">
          <div class="photo-img" v-if="picItem.logoUrl" :style="{backgroundImage:`url(${picItem.logoUrl})`}"></div>
          <div class="photo-img" v-else :style="{backgroundImage:`url(https://cdnfile-10043692.file.myqcloud.com/admin/images/elastic_school/web/pic_default.jpg)`}"></div>
        </div>
        <p>{{picItem.title}}</p>
      </a>
    </div>
    <!-- <div class="photo-item">
      <a href="">
        <div class="photo" style="background:#ccc;">
          <img src="">
        </div>
        <p>旺旺</p>
      </a>
    </div> -->
  </div>
  <div class="no-data" v-if="picList==''">
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
      picList:null
    }
  },
  mounted(){
    //console.log("ss",this.$route.query);
    
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
      this.$router.push({path:url,query:{parentsid:parquery.parentid,parentid:parquery.id,id:query.id,messageType:query.messageType}})
    },
    getSchoolWebModuleMessageListFunc(){
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
  padding-top:20px;
  @include clearfix;
  .photo-item{
    float:left;
    width:186px;
    padding:0 6px 0 0px;
    &>a{
      color:#333;
      display:block;
      .photo{
        width:180px;
        height:260px;
        overflow: hidden;
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
      // color:$golbal-color;
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
</style>