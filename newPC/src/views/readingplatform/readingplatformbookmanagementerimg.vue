<template>
    <div class="readingplatformbookmanagementerimg ">
        <div class="top">
          <el-button @click="$router.back()" type="default" size="medium">返回</el-button>
          <el-button type="primary" size="medium" :disabled="!allBookList.length" @click="downImg(1)">下载全部</el-button>
          <el-button type="primary" size="medium" :disabled="!checkList.length" @click="downImg(2)">下载选中的</el-button>
          <el-input class="search-input" style="width:20%;float: right;"
                          placeholder="书籍名称" icon="search" size="medium" 
                          v-model.trim="name">
                    <el-button slot="append" icon="el-icon-search" ></el-button>
            </el-input>   
        </div>
        <div class="subject" :style="`height: ${nobottommaxH}px;`">
             <el-checkbox-group v-model="checkList">
                <el-checkbox :label="item.bookQRCodeUrl" border :key="index" v-for="(item, index) in allBookList" v-show="hidefun(item.boolName)">
                    <img :src="item.bookQRCodeUrl" alt="">
                </el-checkbox>
            </el-checkbox-group>
         </div>   			
        
    </div>
</template>
<script>
import {getReadPlatBookList} from "@/api/readingplatform";
import mixin from "@/mixins/windowResize";
import JSZip from 'jszip';
    import FileSaver from "file-saver";
export default {
  data() {
    return {
       allBookList:[],
       checkList:[],
       name:""
    };
  },
  created() {
    getReadPlatBookList()
                    .then(res => res.data)
                    .then(data => {
                        for(let i=0;i< data.data.length;i++){
                            if(data.data[i].bookQRCodeUrl){
                              this.allBookList.push({bookQRCodeUrl:this.imgfun(data.data[i].bookQRCodeUrl),boolName:data.data[i].boolName})
                            }                            
                        }
                    });
  },
  mixins: [mixin],
  methods: {
      hidefun(title){
         return title.indexOf(this.name)!=-1
    },
     imgfun(url){         
          if(url[4]=='s'){
              return url;
          }else{
              return url.substring(0, 4) + 's:' + url.substring(4 + 1)
          }
     },
      //下载图片
            downImg(num) {
                let blogTitle = '书籍二维码';
                let zip = new JSZip();
                let imgs = zip.folder(blogTitle);
                let baseList = [];
                let arr = num==1?this.allBookList:this.checkList;
               
                for (let i = 0; i < arr.length; i++) {
                    let image = new Image();
                    // 解决跨域 Canvas 污染问题
                    image.setAttribute('crossOrigin', 'anonymous');
                    image.onload = function () {
                        let canvas = document.createElement('canvas');
                        canvas.width = image.width;
                        canvas.height = image.height;
                        let context = canvas.getContext('2d');
                        context.drawImage(image, 0, 0, image.width, image.height);
                        let url = canvas.toDataURL(); // 得到图片的base64编码数据
                        canvas.toDataURL('image/png');
                        baseList.push(url.substring(22));// 去掉base64编码前的 data:image/png;base64,
                        if (baseList.length === arr.length && baseList.length > 0) {
                            for (let k = 0; k < baseList.length; k++) {
                                imgs.file('书籍二维码' + (k + 1) + '.png', baseList[k], {base64: true})
                            }
                            zip.generateAsync({type: 'blob'}).then(function (content) {
                                FileSaver.saveAs(content, blogTitle + '.zip');
                            });
                        }
                    };
                    image.src = arr[i];
                }
            },
  } 
};
</script>
<style scoped>
 .readingplatformbookmanagementerimg .el-checkbox__input{
                position: absolute;
                left: 120px;
                top: 4px;
        }
   .readingplatformbookmanagementerimg .el-checkbox__label {
    padding-left: 6px;
}
</style>

<style lang="scss" scoped>
.readingplatformbookmanagementerimg {
  padding:12px;
  .top {
    border-bottom: 1px solid #e7eaec;
    padding-bottom: 10px;
  }
  .subject {
    padding-top: 20px;
    overflow: auto;
    img{
        width: 100px;
    }
    .el-checkbox{
            margin: 10px;
            height: 160px;
        }
  }
}
</style>
