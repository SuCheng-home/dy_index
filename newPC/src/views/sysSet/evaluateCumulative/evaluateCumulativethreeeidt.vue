<template>
<div class="evaluateCumulativethreeeidt">
     <div class="header"> 
         <el-button @click="$router.back()" type="default" size="medium">返回</el-button> 
         <el-button type="primary" size="medium" @click="editAssessMedals('ruleForm')">保存</el-button>     
      </div>
     <div class="body " :style="`height: ${nobottommaxH}px;`">
       <el-form label-width="160px" class="demo-ruleForm" :model="ruleForm" :rules="rules" ref="ruleForm">            
            <el-form-item label="图片" prop="images">              
              <div class="image-upload-container">
                  <div class="image-upload-container__inner">
                    <uploader ref="coverUploader" pathPrefix="questionnaire" :extList="['bmp', 'png', 'jpg', 'jpeg', 'gif']" showResult="image" showMode="button" v-model="images" :multiple="false"></uploader>
                    <div v-show="images.length !== 0" class="image-upload__delete" @click="deleteCover">删除图片</div>
                  </div>
                  <div class="cover-hint"><i class="el-icon-info"></i>规格建议:100*200</div>
              </div>
             </el-form-item>
             <el-form-item label="称号名称" prop="name">
                <el-input v-model="ruleForm.name" auto-complete="off" placeholder="请输入称号名称" :maxlength="20"></el-input>
             </el-form-item>            
             <el-form-item label="排序" prop="orderNo">
               <el-input-number v-model="ruleForm.orderNo" :step="1" step-strictly  placeholder="请输入排序" :min="1" :max="100"></el-input-number>
             </el-form-item>  
             <el-form-item label="所需花朵" prop="flowerNum">
                <el-input-number v-model="ruleForm.flowerNum" :step="1" step-strictly  placeholder="请输入所需花朵" :min="0" :max="10000"></el-input-number>
             </el-form-item>           
       </el-form>       
     </div>
</div> 
</template>
<script>
import mixin from "@/mixins/windowResize";
import Uploader from "@/components/Uploader/WebUploader";
import {editAssessMedal,getAssessMedalInfoById} from "@/api/evaluateCumulative";
export default {
  components: {
    Uploader
  },
  data() {
     const imagesfun = (rule, value, callback) => {
                if (this.images.length) {
                    return callback()
                } else {
                    return callback(new Error('请上传图片'));
                }
            };
    return {     
      images: [],
      ruleForm:{
        name:'',
        flowerNum:'',
        orderNo:''
      },
      id: this.$route.query.id,
      rules:{
        images:[{validator: imagesfun, trigger: 'change', required: true}],
        name:[{required: true, message: '请输入称号名称', trigger: 'blur'}],
        flowerNum:[{required: true, message: '请输入分值', trigger: 'blur'}],
        orderNo:[{required: true, message: '请输入排序', trigger: 'blur'}],
      }
    };
  },
  mixins: [mixin],
  created() {
    this.getAssessMedalInfoByIds();
  },
  methods: {    
    getAssessMedalInfoByIds(){
      getAssessMedalInfoById(this.id).then(res => {
           let mydata=res.data.data;
           this.ruleForm.name=mydata.name;
           this.ruleForm.orderNo=mydata.orderNo;
           this.ruleForm.flowerNum=mydata.flowerNum;
           this.images=[{fileUrl:mydata.logo}];           
        }).catch();
    },
    deleteCover() {
      this.$refs.coverUploader.deleteItem(0);
    },
    //保存
    editAssessMedals(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let obj={
               logo:this.images[0].fileUrl,
               name:this.ruleForm.name,
               flowerNum:this.ruleForm.flowerNum,
               orderNo:this.ruleForm.orderNo,
               id:this.id
            };
            editAssessMedal(obj) .then(res => res.data).then(data => {
                                    if(data.result) {
                                        this.$message({
                                            message: '新增成功！',
                                            type: 'success',
                                            duration: 1000
                                        });
                                        this.$router.back();
                                    }
                                }).catch(() => {})
           
          } 
        });
      }
  }
};
</script>
<style>
.evaluateCumulativethreeeidt .upload-block-container,
.evaluateCumulativethreeeidt .upload-file-item {
  height: 100px !important;
  width: 200px !important;  
}
.evaluateCumulativethreeeidt .icon--block-del {
  display: none !important;
}
.evaluateCumulativethreeeidt .image-upload__delete {
  height: 40px;
  line-height: 40px;
  background-color: #409efe;
  color: #fff;
  text-align: center;
  position: absolute;
  bottom: 0;
  width: 100%;
}
.evaluateCumulativethreeeidt .upload-file-item img {
  width: 100% !important;
  height: 100% !important; 
  border: 1px dashed #409eff;
  margin: 0 !important;
}
</style>

<style lang="scss" scoped>
.evaluateCumulativethreeeidt {
  padding:12px;
  .header {
    padding-bottom: 10px;
    border-bottom: 1px solid #eee;
  }
  .body {
    overflow: auto;
    .demo-ruleForm {
      width: 810px;
      margin: 20px auto;
      .el-input-number{
        width: 400px;
      }
      .image-upload-container {
        display: inline-block;
        vertical-align: top;
        .image-upload-container__inner {
          position: relative;
        }
        .cover-hint {
          position: relative;
          margin-top: 5px;
          font-size: 12px;
          i {
            margin-right: 5px;
          }
        }
      }
    }
  }
}
</style>