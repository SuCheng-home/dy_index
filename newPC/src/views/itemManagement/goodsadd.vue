<template>
<div class="goodsadd"  >
     <div class="header">
         <el-button @click="$router.back()" type="default" size="medium">返回</el-button>
         <el-button type="primary" size="medium" @click="insertGoods('ruleForm')">保存</el-button>
      </div>
     <div class="body " :style="`height: ${nobottommaxH}px;`">
       <el-form label-width="170px" class="demo-ruleForm" :model="ruleForm" :rules="rules" ref="ruleForm">
            <el-form-item label="名称" prop="goodName">
                <el-input v-model.trim="ruleForm.goodName" auto-complete="off" placeholder="请输入名称" :maxlength="20"></el-input>
            </el-form-item>
             <el-form-item label="所属分类" prop="goodTypeId">
              <el-select v-model="ruleForm.goodTypeId" disabled>
               <el-option v-for="item in typelist" :key="item.id"  :label="item.typeName" :value="item.id"></el-option>
            </el-select>
            </el-form-item>
            <el-form-item label="图片" prop="images">             
              <div class="image-upload-container">
                  <div class="image-upload-container__inner">
                    <uploader ref="coverUploader" pathPrefix="wupinlingyong" module="wupinglingyong" moduleCode="2001" useSysBucket :extList="['bmp', 'png', 'jpg', 'jpeg', 'gif']" showResult="image" showMode="button" v-model="images" :multiple="false"></uploader>
                    <div v-show="images.length !== 0" class="image-upload__delete" @click="deleteCover">删除图片</div>
                  </div>
                  <div class="cover-hint"><i class="el-icon-info"></i>请上传图片</div>
              </div>
             </el-form-item>
            <el-form-item label="品牌">
                <el-input v-model.trim="ruleForm.goodBrand" auto-complete="off" placeholder="请输入品牌" :maxlength="20"></el-input>
            </el-form-item>
            <el-form-item label="规格">
                <el-input v-model.trim="ruleForm.goodSpec" auto-complete="off" placeholder="请输入规格" :maxlength="20"></el-input>
            </el-form-item>
            <el-form-item label="价格">
               <el-input-number v-model="ruleForm.goodPrice" :step="0.01" step-strictly  placeholder="请输入价格"  :precision="2" :min="0" :max="100000"></el-input-number>
             </el-form-item>
              <el-form-item label="单位">
              <el-select v-model="ruleForm.unitId">
               <el-option   v-for="item in unitlist" :key="item.id"  :label="item.value" :value="item.id"></el-option>
            </el-select>
            </el-form-item>
            <el-form-item label="物品属性">
                <el-checkbox v-model="ruleForm.easyConsumeGood">易耗物品</el-checkbox>
                <el-checkbox v-model="ruleForm.virtualGood">虚拟物品</el-checkbox>
                <el-checkbox v-model="ruleForm.needGiveBack">需要归还</el-checkbox>
                <el-checkbox v-model="ruleForm.isExamine">需要审批</el-checkbox>
            </el-form-item>
             <el-form-item label="审批人" prop="addressDataprop" v-if="ruleForm.isExamine">
                <address-book v-model="addressData" :config="configData"></address-book>
             </el-form-item>
             <el-form-item label="预警" v-if="!ruleForm.virtualGood">
                <el-checkbox v-model="ruleForm.warn">库存量预警</el-checkbox>&nbsp;&nbsp;
                <span v-if="ruleForm.warn">库存量低于&nbsp;&nbsp;
                   <el-input-number v-model="ruleForm.warnNum" :step="1" step-strictly  placeholder="请输入库存量"  :precision="0" :min="1" :max="9999"></el-input-number>
                   &nbsp;&nbsp;时预警提醒，提醒时间为每天08:50
                </span>
            </el-form-item>


       </el-form>
     </div>
</div>
</template>
<script>
import mixin from "@/mixins/windowResize";
import AddressBook from "@/components/AddressBook/indexExpand";
import Uploader from "@/components/Uploader/WebUploader";
import { querySGoodType,listValue,insertGood} from "@/api/itemManagement";
export default {
  components: {
    AddressBook,
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
    const addressDatapropfun = (rule, value, callback) => {
                 if (this.addressData.userJson.length) {
                    return callback()
                }else{
                    return callback(new Error('请选择审批人'));
                }
            };
    return {
      addressData: {departJson:[],groupJson:[],userJson:[]},
      configData: {
        title: "审批人",
        depart: { target: "user", departType: "t", userTypes: "1" },
        group: false
      },
      images: [{
        fileUrl:"https://cdnfile-10043692.file.myqcloud.com/admin/images/itemManagement/moren.png"
      }],
      typelist:[],
      unitlist:[],
      ruleForm:{
         goodName:'',
         goodTypeId:this.$route.query.id-0,
         goodPrice:'',
         goodBrand:'',
         goodSpec:'',
         unitId:'',
         easyConsumeGood:false,
         needGiveBack:false,
         virtualGood:false,
         isExamine:false,
         warn:false,
         warnNum:1
      },
      rules:{
        goodName:[{required: true, message: '请输入名称', trigger: 'blur'}],
        goodTypeId:[{ required: true, message: '请选择所属分类', trigger: 'change' }],
        images:[{validator: imagesfun, trigger: 'change', required: true}],
        addressDataprop:[{validator: addressDatapropfun, trigger: 'change', required: true}]
      }
    };
  },
  mixins: [mixin],
  created() {
      this.querySGoodTypes();
      this.listValues();
  },
  methods: {
    deleteCover() {
      this.$refs.coverUploader.deleteItem(0);
    },
    querySGoodTypes(){
        querySGoodType().then(res => res.data).then(data => {
           this.typelist=data.data;
        })
    },
    listValues(){
        listValue().then(res => res.data).then(data => {
           this.unitlist=data.data.dataList;
           this.ruleForm.unitId=this.unitlist[0].id;
        })
    },
    //保存
    insertGoods() {
        this.$refs.ruleForm.validate((valid) => {
          if (valid) {
            if(this.ruleForm.virtualGood){
              this.ruleForm.warn=false;
            }
             let query={
              easyConsumeGood:this.ruleForm.easyConsumeGood?1:0,//	是否易耗物品，1代表是，0代表否	number
              goodBrand:this.ruleForm.goodBrand,//	商品品牌，可为空	string
              goodName:this.ruleForm.goodName,//	物品名称	string
              goodPrice:this.ruleForm.goodPrice,//	单价	string
              goodSpec:this.ruleForm.goodSpec,//	物品规格，可为空	string
              goodTypeId:this.ruleForm.goodTypeId,//	物品类型id	number
              goodTypeName:"",//	物品类型Id	string
              goodUrl:this.images[0].fileUrl,//	物品图片	string
              isExamine:this.ruleForm.isExamine==1?1:0,//	是否审批，默认为0不审批，审批为1	number
              needGiveBack:this.ruleForm.needGiveBack?1:0,//	是否需要归还，1代表需要，0不需要	number
              repertory:0,//	库存	number
              unitId:this.ruleForm.unitId,//	单位id	number
              unitName:"",//	单位名称	string
              userJson:this.addressData.userJson.length?JSON.stringify(this.addressData.userJson):"",//	审批人，地址薄	string
              virtualGood:this.ruleForm.virtualGood?1:0,//	是否虚拟物品，1代表是，0不是	number
              warn:this.ruleForm.warn?1:0,//	是否预警提醒，0不提醒，1提醒	number
              warnNum:this.ruleForm.warnNum//	预警数量	number
            }
            for(let i=0;i<this.typelist.length;i++){
                if(this.typelist[i].id==this.ruleForm.goodTypeId){
                    query.goodTypeName=this.typelist[i].typeName
                }
            }
            for(let i=0;i<this.unitlist.length;i++){
                if(this.unitlist[i].id==this.ruleForm.unitId){
                    query.unitName=this.unitlist[i].value
                }
            };

            if (((!this.addressData.userJson) || (!this.addressData.userJson.length))&&(this.ruleForm.isExamine)) {
              this.$message({
                message: '请选择审批人！',
                type: 'warning'
              });
              return;
         }
           insertGood(query).then(res => res.data).then(data => {
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
      },
  }
};
</script>
<style>
.goodsadd .upload-block-container,
.goodsadd .upload-file-item {
  height: 120px !important;
  width: 120px !important;
}
.goodsadd .icon--block-del {
  display: none !important;
}
.goodsadd .image-upload__delete {
  height: 40px;
  line-height: 40px;
  background-color: #409efe;
  color: #fff;
  text-align: center;
  position: absolute;
  bottom: 0;
  width: 100%;
}
.goodsadd .upload-file-item img {
  width: 100% !important;
  height: 100% !important;
  border: 1px dashed #409eff;
  margin: 0 !important;
}
</style>

<style lang="scss" scoped>
.goodsadd {
  padding: 12px;
  .header {
    padding-bottom: 10px;
    border-bottom: 1px solid #eee;
  }
  .body {
    overflow: auto;
    .demo-ruleForm {
      width: 810px;
      margin: 20px auto;
      .el-date-editor.el-input{
            width: 120px;
        }
        .el-select {
            width: 100%;
        }
      .input{
          padding-bottom: 10px;
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
