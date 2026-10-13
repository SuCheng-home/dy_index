<template>
<div class="foodReservationlibraryadd"  >
     <div class="header"> 
         <el-button @click="$router.back()" type="default" size="medium">返回</el-button> 
         <el-button type="primary" size="medium" @click="createPastrys('ruleForm')">保存</el-button>     
      </div>
     <div class="body " :style="`height: ${nobottommaxH}px;`">
       <el-form label-width="140px" class="demo-ruleForm" :model="ruleForm" :rules="rules" ref="ruleForm">            
            <el-form-item label="图片" prop="images">              
              <div class="image-upload-container">
                  <div class="image-upload-container__inner">
                    <uploader ref="coverUploader" pathPrefix="questionnaire" :extList="['bmp', 'png', 'jpg', 'jpeg', 'gif']" showResult="image" showMode="button" v-model="images" :multiple="false"></uploader>
                    <div v-show="images.length !== 0" class="image-upload__delete" @click="deleteCover">删除图片</div>
                  </div>
                  <div class="cover-hint"><i class="el-icon-info"></i>规格建议:120*120</div>
              </div>
             </el-form-item>
            <el-form-item label="名称" prop="pastryName">
                <el-input v-model="ruleForm.pastryName" auto-complete="off" placeholder="请输入名称" :maxlength="10"></el-input>
            </el-form-item>
            <el-form-item label="价格（元）" prop="pastryPrice">
               <el-input-number v-model="ruleForm.pastryPrice" :precision="2" :step="0.01" step-strictly  placeholder="请输入价格" :min="0.01" :max="100"></el-input-number>
             </el-form-item>
             <el-form-item label="食品分类" prop="typeId">
                <el-select v-model="ruleForm.typeId" placeholder="请选择食品分类">
                <el-option :label="item.typeName" :value="item.id"  v-for="(item,index) in typelist" :key="index"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="备注">
                    <el-input type="textarea"  :autosize="{ minRows: 4, maxRows: 8}" placeholder="请输入备注（0~200字符）" :maxlength="200" v-model="ruleForm.pastryRemark"></el-input>
                </el-form-item>
       </el-form>       
     </div>
</div> 
</template>
<script>
import mixin from "@/mixins/windowResize";
import Uploader from "@/components/Uploader/WebUploader";
import { createPastry,getTypeListByUserId} from "@/api/foodReservation";
export default {
  components: {Uploader},
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
      typelist:[],
      ruleForm:{
        pastryUrl:'', 
        pastryName:'',
        pastryPrice:'',
        pastryRemark:'',
        shelfDate:'',
        shelfState:'0',
        typeId:'',
        typeName:'',
        pastryPrices:''
      },
      rules:{
        pastryName:[{required: true, message: '请输入名称', trigger: 'blur'}],
        pastryPrice:[{required: true, message: '请输入价格', trigger: 'blur'}],
        images:[{validator: imagesfun, trigger: 'change', required: true}],
        typeId:[{ required: true, message: '请选择食品分类', trigger: 'change' }]
      }
    };
  },
  mixins: [mixin],
  created() {
      this.getTypeListByUserIds();
  },
  methods: {
    deleteCover() {
      this.$refs.coverUploader.deleteItem(0);
    },
    getTypeListByUserIds(){
        getTypeListByUserId().then(res => res.data).then(data => {
           this.typelist=data.data;
           if(this.typelist.length){
                this.ruleForm.typeId=this.typelist[0].id;
           }
        })
    },
    //保存
    createPastrys(formName) {       
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.ruleForm.pastryUrl=this.images[0].fileUrl; 
            for(let i=0;i<this.typelist.length;i++){
                if(this.typelist[i].id==this.ruleForm.typeId){
                    this.ruleForm.typeName=this.typelist[i].typeName
                }
            }     
            this.ruleForm.pastryPrices=((this.ruleForm.pastryPrice*100)+'').split('.')[0];   
            createPastry(this.ruleForm) .then(res => res.data).then(data => {
                                    if(data.result) {
                                        this.$message({
                                            message: '添加成功！',
                                            type: 'success',
                                            duration: 1000
                                        });
                                        this.$router.back();
                }
            }).catch(() => {})           
          } 
        });
      },
  }
};
</script>
<style>
.foodReservationlibraryadd .upload-block-container,
.foodReservationlibraryadd .upload-file-item {
  height: 120px !important;
  width: 120px !important;  
}
.foodReservationlibraryadd .icon--block-del {
  display: none !important;
}
.foodReservationlibraryadd .image-upload__delete {
  height: 40px;
  line-height: 40px;
  background-color: #409efe;
  color: #fff;
  text-align: center;
  position: absolute;
  bottom: 0;
  width: 100%;
}
.foodReservationlibraryadd .upload-file-item img {
  width: 100% !important;
  height: 100% !important; 
  border: 1px dashed #409eff;
  margin: 0 !important;
}
</style>

<style lang="scss" scoped>
.foodReservationlibraryadd {
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
        width: 200px;
      }
      .el-select{
          width: 100%;
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