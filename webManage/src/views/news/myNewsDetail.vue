<template>
  <div class="columndetail-wrap">
    <el-row class="menu-row">
      <el-col :span="20">
        <div > 
          <el-button size="small" class="filter-item" @click="goBack()">返回
          </el-button>
        </div>
      </el-col>
    </el-row>
    <div class="org-main custom—scrollbar" :style="`height:${columnMax-70}px`" :messageList="messageList">
      <el-form ref="addServiceForm" label-width="150px" class="column-ruleForm custom—scrollbar">
        <div class="g-top-title">
          <h2>{{messageList.title}}</h2>
          <h4 class="h4" v-if="messageList.titleMark">{{messageList.titleMark}}</h4>
        </div>
        <div class="g-right-time">
          <span>{{messageList.createTime|filterTime}}</span>
        </div>
        <div class="columnedit-content" v-if="messageList.messageType==2">
          {{messageList.messageUrl}}
        </div>
        <div class="ueditor-wrapper" v-if="messageList.messageType!==2">
          <image-previewer tag="richtext" v-if="messageList.messageType!==2">
            <div class="columnedit-content" v-html="messageList.content" v-if="messageList.messageType!==2"></div>
          </image-previewer>
        </div>

        <div label="上传附件" style="margin-top:22px;" v-if="messageList.messageType!==2">
          <div class="file-list">
              <template v-if="messageList.fileJson&&messageList.fileJson.length!==0" v-for="(item,itemIndex) in messageList.fileJson">
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
              <template v-if="messageList.fileJson==null">无</template>
          </div>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
import mixins from '@/mixins/windowResize';
import {mapGetters} from 'vuex';
import ImagePreviewer from '@/components/ImagePreviewer/ImagePreviewer.vue';
import {getSchoolWebModuleMessageById} from '@/api/webManage';
export default{
  components:{
    ImagePreviewer
  },
  data(){
    return{
      id:this.$route.query.id,
      columnTypes: [{
          value: 1,
          label: "展示型"
      }, {
          value: 2,
          label: "列表型"
      }, {
          value: 3,
          label: "图片型"
      }, {
          value: 4,
          label: "url型"
      }],
      messageList:{},
      fileJson:[]
    }
  },
  created(){
     this.getSchoolWebModuleMessageByIdFunc();
  },
  mounted(){
   
  },
  computed:{
    ...mapGetters([
      'permission'
    ])
  },
  watch:{
    $route(to,from){
      if(to.query){
        this.messageId=to.query.messageId;
        this.getSchoolWebModuleMessageByIdFunc();
      }
    }
  },
  mixins:[mixins],
  filters:{
    filterTime(dateTime){
      return dateTime==undefined?'':dateTime.split(".")[0];
    }
  },
  methods:{
    getFileSuffix(fileName) {
        return fileName.replace(/.+\./, "").toLowerCase();
    },
    goBack(){
      this.$router.push({
        path:'myNewsList'
      })
    },
    getSchoolWebModuleMessageByIdFunc(){
      this.fileJson=[];
      getSchoolWebModuleMessageById({
        messageId:this.id
      }).then(res=>res.data)
      .then(data=>{
        if(data.code===200){
          if(data.data){
            data.data.fileJson=JSON.parse(data.data.fileJson);
            this.messageList=data.data;
          }
          
          
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.columndetail-wrap{
  .menu-row{
    border-bottom: 1px solid #e7eaec;
    box-sizing: border-box;
    padding-bottom:15px;
    padding-top:15px;
  }
  .menu-row .el-button{
    margin-left: 15px;
  }
  .org-main{
    width:100%;
    padding-bottom:30px;
    box-sizing: border-box;
  }
  .column-ruleForm{
    width:80%;
    padding-top:22px;
    margin:0 auto;
    .logo{
      float:left;
      display:block;
      height: 100px;
      max-width: 550px;
      margin-right:30px;
    }
    .logo_update{
      display: inline-block;
      line-height: 1;
      white-space: nowrap;
      cursor: pointer;
      background: #fff;
      border: 1px solid #c4c4c4;
      color: #1f2d3d;
      margin: 0;
      padding: 10px 15px;
      border-radius: 4px;
    }
  }
  .selectWidth{
    width:100%;
  }
  .ueditor-wrapper{
    width:100%;
  }
}
.file-list{
  padding:0px 30px 0;
}
</style>
<style>
.column-ruleForm .el-form-item__label{
  font-weight: bold;
  color: #666;
  line-height: 40px;
  font-size: 14px;
  position: relative;
  padding-right:20px;
}
.column-ruleForm .required .el-form-item__label:before{
  content:"*";
  font-size:17px;
  position: relative;
  top: 2px;
  display: inline-block;
  color: #f00;
  margin-right: 3px;
}
.columndetail-wrap .el-dialog{
  top:50px;
}
/* .columndetail-wrap .ueditor-wrapper{
  width:740px !important;
} */
</style>
