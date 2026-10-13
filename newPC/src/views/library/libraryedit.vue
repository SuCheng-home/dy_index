<template>
    <div  class="libraryedit">
           <back-tool >
               <el-button size="medium" class="filter-item" type="primary" @click="addStudentLeave">保存</el-button>
           </back-tool>
           <div class="mainWrap" :style="`height:${nobottommaxH}px`">
               <div style="width: 810px; padding-top: 20px; margin: 0px auto;">
                   <el-form :model="ruleForm" ref="ruleForm" :rules="rules" label-width="100px" class="demo-ruleForm">    
                           <el-form-item label="封面" >
                                  <uploader  pathPrefix="shuku" module="shuku" moduleCode="202009082" :multiple="false" v-model="files" :extList="['jpeg', 'jpg', 'bmp', 'gif', 'png']" showMode="image" showResult="image"></uploader>
                            </el-form-item> 
                            <el-form-item label="附件">
                                  <uploader pathPrefix="shuku" module="shuku" moduleCode="202009082" :extList="allFileTypeList" v-model="fileJson" :multiple="false"></uploader>
                            </el-form-item>
                            <el-form-item label="书籍名称" prop="boolName">
                                <el-input v-model="ruleForm.boolName" placeholder="请输入书籍名称" maxlength="20" show-word-limit></el-input>
                            </el-form-item>  
                            <el-form-item label="书籍类别" prop="typeId" >
                                <el-select v-model="ruleForm.typeId">
                                    <el-option :label="item.value" :value="item.code" v-for="item in typeList" :key="item.code"></el-option>
                                </el-select>
                            </el-form-item>  
                             <el-form-item label="书籍内容" prop="content">
                                <el-input type="textarea" v-model="ruleForm.content" placeholder="请输入书籍内容" ></el-input>
                            </el-form-item>               
                            <el-form-item class="form-item--richtext" label="书籍介绍" prop="introduce">
                                <ueditor class="rich-editor new-editor"  ref="ueditor" :defaultMes="ruleForm.introduce"    @editModel="richTextEditHandler"></ueditor>
                            </el-form-item>  
                    </el-form>

               </div>
                        
           </div>
    </div>
</template>

<script>
import BackTool from "@/components/BackTool";
import Ueditor from "@/components/Ueditor";
import mixin from "@/mixins/windowResize";
import { updatePlayWordBook, findDicsByCode,getPlayWordBookById} from "@/api/library";
import Uploader from '@/components/Uploader/WebUploader';
export default {
  components: {
    BackTool,
    Uploader,
    Ueditor
  },
  data() {
    return {
      files:[],
      typeList: [], //类型
      fileJson: [],
      ruleForm: {
        typeId: "", //书籍类别
        addbookType: this.$route.query.num,
        boolName: "",
        content: "",
        coverUrl: "",
        fileJson: [],
        introduce: "",
        typeName: "",
        id:this.$route.query.id
      },
      allFileTypeList: ['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'pdf'],
      // 校验
      rules: {
        typeId: [{required: true,message: "请选择书籍类别", trigger: "change"} ],
        boolName: [{ required: true, message: "请输入书籍名称", trigger: "blur" }],
        content: [{ required: true, message: "请输入书籍内容", trigger: "blur" }],
        introduce: [{ required: true, message: "书籍介绍不能为空", trigger: "change" }]
      }
    };
  },
  mixins: [mixin],
  created() {
    this.findDicsByCodes();
    this.getPlayWordBookByIds();
  },
  methods: {
      //获取详情
      getPlayWordBookByIds(){
           getPlayWordBookById(this.ruleForm.id).then(res => {
                let data = res.data.data;
                this.ruleForm.typeId=data.typeId+'';
                this.ruleForm.boolName=data.boolName;
                this.ruleForm.content=data.content;
                this.ruleForm.introduce=data.introduce;
               this.$refs.ueditor.setContent(data.introduce);
                this.files = [ { fileName:data.coverUrl.split('/')[data.coverUrl.split('/').length-1], fileUrl: data.coverUrl }];
                if(data.playWordBookFileList.length>0){
                        this.fileJson=[{
                               fileName:data.playWordBookFileList[0].fileName,
                               fileUrl:data.playWordBookFileList[0].accessUrl
                            }]
                }
               
            });
      },  
    richTextEditHandler(content) {
      this.ruleForm.introduce = content;
    },

    //获取类型
    findDicsByCodes() {
      findDicsByCode().then(res => {
        let data = res.data.data;
        this.typeList = data;
        this.ruleForm.typeId = data[0].code;
      });
    },
   
    // 保存
    addStudentLeave() {
     if (this.files.length == 0) {
        this.$message.error("上传封面！");
        return false;
      };
      for(let i=0;i<this.typeList.length;i++){
          if(this.ruleForm.typeId==this.typeList[i].code){
              this.ruleForm.typeName=this.typeList[i].value;
          }
      };
      this.ruleForm.coverUrl = this.files[0].fileUrl;
      if(this.fileJson.length>0){
           this.ruleForm.fileJson=[{accessUrl:this.fileJson[0].fileUrl,fileName:this.fileJson[0].fileName}];
      };   
      this.ruleForm.introduce=this.$refs.ueditor.getContent();      
      this.$refs["ruleForm"].validate(valid => {
        if (valid) {
          this.$confirm("确认保存吗？", "提示").then(() => {
            updatePlayWordBook(this.ruleForm).then(res => {
                if (res.data.code === 200) {
                  this.$message({
                    type: "success",
                    message: "保存成功!"
                  });
                 this.$router.back();
                  
                } else {
                  this.$message({
                    type: "error",
                    message: res.data.msg
                  });
                }
              })
              .catch(function() {});
          });
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.libraryedit {
  padding:12px;
  box-sizing: border-box;
  .mainWrap {
    overflow: auto;
    padding: 20px 10px;
  }
  
  .el-select {
    width: 710px;
  }
}
</style>
