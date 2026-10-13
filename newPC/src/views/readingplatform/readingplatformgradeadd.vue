<template>
    <div class="readingplatformgradeadd ">
        <div class="top">
          <el-button @click="$router.back()" type="default" size="medium">返回</el-button>
          <el-button type="primary" size="medium" @click="insertFoods('ruleForm')">保存</el-button>
        </div>
        <div class="subject" :style="`height: ${nobottommaxH}px;`">
            <div class="body">
             <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="140px" class="demo-ruleForm">
                <el-form-item label="名称" prop="medalName">
                    <el-input v-model="ruleForm.medalName" size="medium" :maxlength="5"  placeholder="请输入名称"></el-input>
                </el-form-item>
                <el-form-item label="积分" prop="medalPoint">
                     <el-input-number size="medium" v-model="ruleForm.medalPoint" :precision="0" :step="1" :min="1" :max="10000" placeholder="请输入积分"></el-input-number>
                </el-form-item>
                <el-form-item label="图片" class="pic">
                    <uploader module="yuedupingtai" moduleCode="2017" pathPrefix="yuedupingtai" useSysBucket :multiple="false" v-model="piclist" :extList="['jpeg', 'jpg', 'bmp', 'gif', 'png']" showMode="cover" :showModeCover="true" showResult="image"></uploader>
                    <div class="img-b-box">点击更换图片</div>
                </el-form-item>
                </el-form>
            </div>
         </div>   			
        
    </div>
</template>
<script>
import {insertSchoolMedal} from "@/api/readingplatform";
import mixin from "@/mixins/windowResize";
import Uploader from "@/components/Uploader/WebUploader";
export default {
  components: { Uploader },
  data() {
    return {
      ruleForm: {
        medalLogo: "",   
        medalName: "",
        medalPoint: undefined
      },
      rules: {
        medalName: [
          { required: true, message: "请输入名称", trigger: "blur" },
        ],
        medalPoint: [
          { required: true, message: "请输入积分", trigger: "blur" },
        ],
      },
      piclist: [
        {
          fileUrl:
            "https://cdnfile-10043692.file.myqcloud.com/admin/images/read/logo.png",
          fileName: "shiwu.png"
        }
      ]
    };
  },
  created() {
  
  },
  mixins: [mixin],
  methods: {
    //保存
    insertFoods(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {         
            this.ruleForm.medalLogo=this.piclist[0].fileUrl;
            let $this=this;
             insertSchoolMedal(this.ruleForm)
              .then(res => {
                if (res.data.code === 200) {
                  $this.$message({
                    type: "success",
                    message: "新增成功!"
                  });
                  $this.$router.back();
                }else{
                  this.$message({type: 'error', message:res.data.msg});
                  return;
                }             
              }).catch();
          };
        });
    },
    
  }
};
</script>
<style>
.readingplatformgradeadd .upload-file-item img {
  width: 80px !important;
  height: 80px !important;
  margin: 0;
  border: 1px dashed #409EFF;
  box-sizing: border-box;
  margin: 0 !important;
}
.readingplatformgradeadd .upload-block-container .upload-file-item {
  height: 80px;
}
.readingplatformgradeadd .upload-file-item .file-name {
  display: none;
}
</style>
<style lang="scss" scoped>
.readingplatformgradeadd {
  padding:12px;
  * {
    box-sizing: border-box;
  }
   .food-box{
        height: 210px;
        overflow: auto;
        border-top: 1px #EBEEF5 solid;
        border-bottom: 1px #EBEEF5 solid;
        margin-top: 10px;
      .el-checkbox.is-bordered {
            padding: 5px 10px;
            height: 32px;
            margin: 5px;
        }
   }
   .foot-top{
    overflow: hidden;
   }
  .top {
    border-bottom: 1px solid #e7eaec;
    padding-bottom: 10px;
  }
  .subject {
    padding-top: 10px;
    overflow: auto;
    .body {
      width: 810px;
      margin: 0 auto;
      overflow: hidden;
      .el-select {
        width: 100%;
      }
      .img-b-box {
        position: absolute;
        bottom: 1px;
        left: 0px;
        width: 80px;
        text-align: center;
        color: #fff;
        height: 24px;
        line-height: 24px;
        background: rgba(0, 0, 0, 0.5);
      }
      .el-icon-circle-plus-outline {
        font-size: 20px;
        margin-left: 10px;
        color: #c0c4cc;
        cursor: pointer;
        line-height: 40px;
      }
      .el-icon-circle-plus-outline:hover {
        color: #409EFF;
      }
    }
  }
}
</style>
