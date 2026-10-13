<template>
  <div class="file_list_box" :style="`${fileList.length ? 'background-color: #f7fbfd;' : ''}`">
    <template v-for="fileItem in fileList">
      <div class="file_item" :key="fileItem.id">
        <div :class="{
            'file_item-img': true,
            'file_item-img-word': fileItem.fileName.toLowerCase().indexOf('.doc') !== -1 || fileItem.fileName.toLowerCase().indexOf('.docx') !== -1,
            'file_item-img-ppt': fileItem.fileName.toLowerCase().indexOf('.ppt') !== -1  || fileItem.fileName.toLowerCase().indexOf('.pptx') !== -1,
            'file_item-img-pdf': fileItem.fileName.toLowerCase().indexOf('.pdf') !== -1,
            'file_item-img-excel': fileItem.fileName.toLowerCase().indexOf('.xls') !== -1  || fileItem.fileName.toLowerCase().indexOf('.xlsx') !== -1,
            'file_item-img-zip': fileItem.fileName.toLowerCase().indexOf('.zip') !== -1  || fileItem.fileName.toLowerCase().indexOf('.rar') !== -1
        }"></div>
        <div class="file_item-des">
          <a :download="fileItem.fileName" :href="fileItem.accessUrl || fileItem.fileUrl">
            {{fileItem.fileName}}
          </a>
          <a  class="fileIcon" @click="showPreview(fileItem.accessUrl || fileItem.fileUrl)">
            <i class="el-icon-view"></i>
            <span>预览</span>
          </a>
        </div>
      </div>
    </template>
    <el-dialog :visible.sync="previewVisible" width="70%" style="overflow: hidden;" class="showPreviewBox">
      <div class="custom—scrollbar" :style="`height:${filemaxH}px`" @scroll="scrollList" id="fileListBox">
        <div :key="index" v-for="(fileItem, index) in currentFileArr">
          <img width="100%" :src="fileItem" alt="">
        </div>
        <div class="hint-word" v-if="loadingHint">
            {{ loadingHint }}
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {loadppt} from '@/api/common/common';
import _ from 'lodash';
import windowResize from "@/mixins/windowResize";
export default {
  props: {
    fileList: {
      type: Array,
      default: function () {
        return []
      }
    }
  },
  mixins: [windowResize],      
  data(){
    return{
      previewVisible:false,
      currentFileArr: [],
      filePageCount:0,
      num:1,
      start: 1,
      host1: '',
      loadingHint: '',
    }
  },
  created(){

  },
  mounted(){

  },
  watch:{

  },
  methods:{
    scrollList(){
      var That = this;
      let element=document.getElementById("fileListBox");
      const scrollBottom = element.scrollHeight - element.offsetHeight - element.scrollTop;
      if ((scrollBottom==0)){
        if(this.start<this.filePageCount){
          
          this.renderPreview();
        }
        
        // this.loadFileFunc()
      }
      
    },
    showPreview(fileUrl){
      this.currentFileArr = [];
      if(fileUrl){
        const ext = fileUrl.slice(fileUrl.lastIndexOf('.') + 1).toLowerCase();
        this.isExcel = ext === 'xls' || ext === 'xlsx';
        if(this.isExcel){
          let previewUrl = fileUrl.replace(/(file|cossh|cos)(\.ap-shanghai)?.myqcloud.com/, 'preview.myqcloud.com');
          let excelUrl=`${previewUrl}?cmd=doc_preview&of=${this.isExcel ? 'html' : 'pic'}`;
          window.open(`${excelUrl}`,'_blank');
          return false;
          //this.loadFileFunc(fileUrl);
        }else{
         // this.num=1;
          this.loadFileFunc(fileUrl);
          this.previewVisible = true;
        }
        
      } 
    },
    loadFileFunc(fileUrl) {
      return loadppt({
          attachURL: fileUrl
      }).then(res => res.data.data).then(data => {
          this.currentFileArr = [];
          const requestUrl = data.url;
          this.filePageCount = data.pageCount;
          this.host1 = requestUrl.slice(0, -1);
          if (this.filePageCount <= 5) {
              this.num = this.filePageCount;
              for (var i = 1; i <= this.filePageCount; i++) {
                  this.currentFileArr.push(this.host1 + i);
              }
              this.loadingHint = '没有更多！';
          } else if (this.filePageCount > 5) {
              this.start=1;
              this.num = 5;
              this.renderPreview();
          }
      });
    },
    renderPreview: _.debounce(function() {
      const currentFileArr=[];
      for(let i=this.start;i<=this.num;i++){
        currentFileArr.push(this.host1 + i);
      }
      this.start = this.num+1;
      if(this.num<this.filePageCount){
        this.loadingHint = '加载中...';
        if(this.filePageCount-this.num>=5){
          this.num+=5;
        }else{
          
          this.num+=(this.filePageCount-this.num);
      
        }
        
      }else{
        this.loadingHint = '没有更多！';

      }
      
      this.currentFileArr = [...this.currentFileArr, ...currentFileArr];
    },300)
  }
}
</script>

<style scoped lang="scss">
/* 自定义滚动条 start */
.custom—scrollbar {
  overflow-x: hidden;
  overflow-y: scroll;
}

.custom—scrollbar::-webkit-scrollbar {
  width: 6px;
  background-color: rgba(255, 255, 255, 0.1);
}

.custom—scrollbar::-webkit-scrollbar-thumb {
  background-color: #999;
}

.custom—scrollbar::-webkit-scrollbar-track {
  background-color: rgba(255, 255, 255, 0.1);
}
  .file_list_box {
    padding: 10px;

    .file_item {
      & + .file_item{
        padding-top: 16px;
      }

      .file_item-img {
        height: 28px;
        width: 28px;
        margin-right:10px;
        display: inline-block;
        vertical-align: middle;
        background-position: 50%;
        background-size: cover;
      }

      .file_item-img-word {
        background-image: url(https://cdnfile-10043692.file.myqcloud.com/admin/images/upload/word.png);
      }

      .file_item-img-ppt {
        background-image: url(https://cdnfile-10043692.file.myqcloud.com/admin/images/upload/ppt.png);
      }

      .file_item-img-pdf {
        background-image: url(https://cdnfile-10043692.file.myqcloud.com/admin/images/upload/pdf.png);
      }

      .file_item-img-excel {
        background-image: url(https://cdnfile-10043692.file.myqcloud.com/admin/images/upload/excle.png);
      }

      .file_item-img-zip {
        background-image: url(https://cdnfile-10043692.file.myqcloud.com/admin/images/upload/ZIP.png);
      }

      .file_item-img-txt {
        background-image: url(https://cdnfile-10043692.file.myqcloud.com/admin/images/upload/txt.png);
      }

      .file_item-des {
        padding-left: 4px;
        line-height: 30px;
        padding-right: 4px;
        margin-right: 20px;
        font-size:14px;
        display: inline-block;
        vertical-align: middle;
        color: #676a6c;
        a{
          color: #676a6c;
          font-size:14px;
          font-weight: normal;
        }
        a:hover{
          color: #409EFF;
        }
      }

      .fileIcon{
        margin-left: 20px;
        color: #409EFF;
        display: inline-block;
        i,span{
          color:#409EFF
        }
        // display: inline-block;
        // line-height:30px;
        // vertical-align: top;
      }
    }
  }
  
  .custom—scrollbar{
    .hint-word {
        padding: 10px 0;
        text-align: center;
        font-size: 16px;
        background-color: #FDF8FE;
    }
  }
</style>
<style lang="scss">
.showPreviewBox .el-dialog{
  margin-top:3vh !important;
}
.showPreviewBox .el-dialog__body{
  padding:20px;
}
</style>
