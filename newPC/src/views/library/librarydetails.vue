<template>
    <div  class="librarydetails">
           <back-tool ></back-tool>
           <div class="mainWrap" :style="`height:${nobottommaxH}px`">
               <div style="width: 810px; padding-top: 20px; margin: 0px auto;">
                   <image-previewer tag="richtext">
                       <el-form :model="ruleForm" ref="ruleForm"  label-width="100px" class="demo-ruleForm">    
                           <el-form-item label="封面" >
                               <img class="img" :src="ruleForm.coverUrl" alt="">
                            </el-form-item> 
                            <el-form-item label="附件"  v-for="(item,index) in ruleForm.fileJson" :key="index">
                                <a :href="item.accessUrl" :download="item.fileName">{{item.fileName}}</a>
                            </el-form-item>
                            <el-form-item label="书籍名称" >
                                {{ruleForm.boolName}}
                            </el-form-item>  
                            <el-form-item label="书籍类别" >
                                {{ruleForm.typeName}}
                            </el-form-item>  
                             <el-form-item label="书籍内容">
                                {{ruleForm.content}}
                            </el-form-item>               
                            <el-form-item label="书籍介绍" >
                                <div v-html="ruleForm.introduce"></div>
                            </el-form-item>  
                    </el-form>
                    </image-previewer>
               </div>
                        
           </div>
    </div>
</template>

<script>
import BackTool from "@/components/BackTool";
import mixin from "@/mixins/windowResize";
import { getPlayWordBookById} from "@/api/library";
import ImagePreviewer from '@/components/ImagePreviewer/ImagePreviewer.vue';
export default {
  components: {
    BackTool,ImagePreviewer
  },
  data() {
    return {    
      ruleForm: {
        boolName: "",
        content: "",
        coverUrl: "",
        introduce: "",
        typeName: "",
        id:this.$route.query.id
      }   
    };
  },
  mixins: [mixin],
  created() {
    this.getPlayWordBookByIds();
  },
  methods: {
      //获取详情
      getPlayWordBookByIds(){
           getPlayWordBookById(this.ruleForm.id).then(res => {
                let data = res.data.data;
                this.ruleForm.boolName=data.boolName;
                this.ruleForm.content=data.content;
                this.ruleForm.introduce=data.introduce;
                this.ruleForm.coverUrl=data.coverUrl;
                this.ruleForm.typeName=data.typeName;
                this.ruleForm.fileJson=data.playWordBookFileList;               
            });
      },
       getFileSuffix(fileName) {
                return fileName.replace(/.+\./, "").toLowerCase();
            },
   
  }
};
</script>

<style lang="scss" scoped>
.librarydetails {
  padding:12px;
  box-sizing: border-box;
  .mainWrap {
    overflow: auto;
    padding: 20px 10px;
  }
  .img{
      width: 140px;
      height: 200px;
  }
  a{
      color:#409EFF;
  }
  img{
      max-width: 100%;
  }
}
</style>
