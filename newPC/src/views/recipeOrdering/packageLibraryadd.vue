<template>
<div class="packageLibraryadd"  >
     <div class="top"> 
         <el-button @click="$router.back()" type="default" size="medium">返回</el-button>
         <el-button type="primary" size="medium"    @click="insertMealSets('ruleForm')">保存</el-button>     
      </div>
     <div class="subject " :style="`height: ${nobottommaxH}px;`">
            <div class="body"> 
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
            <el-form-item label="套餐名称" prop="name">
                <el-input v-model.trim="ruleForm.name" auto-complete="off" placeholder="请输入套餐名称" :maxlength="20"></el-input>
            </el-form-item>
             <el-form-item label="套餐类型" prop="setType">
                <el-select v-model="ruleForm.setType" placeholder="请选择套餐类型">
                    <el-option label="早餐" value="1"  ></el-option>
                    <el-option label="午餐" value="2"  ></el-option>
                    <el-option label="晚餐" value="3"  ></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="套餐组成" prop="foodType">
                <el-radio-group v-model="ruleForm.foodType">
                    <el-radio label="1">菜品选择</el-radio>
                    <el-radio label="2">手动录入</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item  v-if="ruleForm.foodType==1">
                <div> <el-button type="primary" icon="el-icon-plus"  size="mini" plain @click="popfun()">选择菜品</el-button></div>
                <div class="ul">
                    <div class="li"    v-for="(item,index) in ruleForm.foodList" :key="item.foodId">
                        <img :src="item.pic" alt=""><span>{{item.name}}</span>
                        每份<el-input-number v-model="item.weight" :step="1" step-strictly size="mini"  placeholder="请输入每份克数" :min="10" :max="1000"></el-input-number>g 
                        <i class="el-icon-delete" @click="deletefun(index)"></i>
                    </div>
                </div>
                
            </el-form-item>
            <el-form-item  prop="content" v-if="ruleForm.foodType==2">
                    <el-input type="textarea"  :autosize="{ minRows: 4, maxRows: 8}" placeholder="请输入套餐组成" :maxlength="100" v-model="ruleForm.content"></el-input>
            </el-form-item>
       </el-form>       
            </div> 
     </div>
      <el-dialog title="选择菜品" :close-on-press-escape='false' :close-on-click-modal='false' :visible.sync="dialogVisible" width="800px" :lock-scroll="false" :modal-append-to-body='false'>
		 <div class="foot-top">        
        <el-col :span="18">
             <el-radio-group v-model="typeId">
              <el-radio-button :label="item.id" v-for="item in foodTypeList" :key="item.id">{{item.value}}</el-radio-button>
            </el-radio-group>
        </el-col>
        <el-col :span="6">
                <el-input size="medium"  placeholder="请输入菜品名称" v-model.trim="searchName">
                  <el-button size="medium" slot="append" icon="el-icon-search" ></el-button>
                </el-input>
        </el-col>
     </div>
     <div class="select-box">
       <div class="name" v-if="xuanzhonglist.length==0">菜品选中区</div>
       <div class="box"  v-for="(item,index) in xuanzhonglist" :key="index">
         <img :src="item.pic" alt="">{{item.name}}<i class="el-icon-close" @click="xuanzhonglistfun(item.foodId)"></i>
      </div>
     </div>
     <div class="food-box">
        <el-checkbox-group v-model="foodtypelist" @change="foodChange()">
          <el-checkbox  border v-for="item in foodlist" :key="item.id" :label="item.id" v-show="(item.typeId==typeId)&&indexoffun(item.name)">
            <img class="img" :src="item.pic" alt="">
            {{item.name}}
          </el-checkbox>
        </el-checkbox-group>
     </div>
			<span slot="footer" class="dialog-footer">
				<el-button  @click="dialogVisible=false">取 消</el-button>
				<el-button type="primary" @click="dialogVisiblefun()">确 定</el-button>
			</span>
		</el-dialog> 
</div> 
</template>
<script>
import { insertMealSet } from "@/api/recipeOrdering";
import {
  chooseSchoolFoodAndCount,
  findDicsByCode
} from "@/api/dietaryManagement";
import Uploader from "@/components/Uploader/WebUploader";
import mixin from "@/mixins/windowResize";
export default {
  components: { Uploader },
  data() {
    const imagesfun = (rule, value, callback) => {
      if (this.images.length) {
        return callback();
      } else {
        return callback(new Error("请上传图片"));
      }
    };
    return {
      images: [],
      ruleForm: {
        setPic: "",
        name: "",
        foodList: [],
        content: "",
        foodType: "1",
        setType: "1"
      },
      rules: {
        name: [{ required: true, message: "请输入套餐名称", trigger: "blur" }],
        images: [{ validator: imagesfun, trigger: "change", required: true }],
        setType: [
          { required: true, message: "请选择套餐类型", trigger: "change" }
        ],
        content: [
          { required: true, message: "请输入套餐组成", trigger: "blur" }
        ],
        resource: [
          { required: true, message: "请选择套餐组成", trigger: "change" }
        ]
      },
      foodtypelist: [],
      foodlist: [],
      xuanzhonglist: [],
      foodTypeList: [],
      typeId: "",
      dialogVisible: false
    };
  },
  mixins: [mixin],
  created() {
    this.chooseSchoolFoodAndCounts();
  },
  methods: {
      //保存
    insertMealSets(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {             
            if((this.ruleForm.foodList.length==0)&&(this.ruleForm.foodType==1)){
                this.$message({type: 'error', message:'请选择套餐组成!'});
                return;
            };
            this.ruleForm.content=this.ruleForm.content.trim();
             if((!this.ruleForm.content)&&(this.ruleForm.foodType==2)){
                this.$message({type: 'error', message:'请输入套餐组成!'});
                return;
            };
            this.ruleForm.setPic=this.images[0].fileUrl;
            if(this.ruleForm.foodType==1){
                this.ruleForm.content='';
            }else{
                this.ruleForm.foodList=[];
            }
           
            let $this=this;
             insertMealSet(this.ruleForm)
              .then(res => {
                if (res.data.code === 200) {
                  $this.$message({
                    type: "success",
                    message: "保存成功!"
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
    //获取菜品
    chooseSchoolFoodAndCounts() {
      chooseSchoolFoodAndCount("", "0")
        .then(res => {
          let mydata = res.data.data;
          this.foodlist = mydata;
        })
        .catch();
      findDicsByCode("foodType")
        .then(res => {
          this.foodTypeList = res.data.data;
          this.typeId = this.foodTypeList[0].id;
        })
        .catch();
    },
    deleteCover() {
      this.$refs.coverUploader.deleteItem(0);
    },
    //弹框
    popfun() {
      this.typeId = this.foodTypeList[0].id;
      this.dialogVisible = true;
      this.foodtypelist = [];
      this.xuanzhonglist = [];
    },
    //删除选中的菜品
    xuanzhonglistfun(id) {
      for (let i = 0; i < this.foodtypelist.length; i++) {
        if (this.foodtypelist[i] == id) {
          this.foodtypelist.splice(i, 1);
        }
      }
      this.foodChange();
    },
     //删除菜品
    deletefun(index) {
      this.ruleForm.foodList.splice(index, 1);
    },
    //弹框勾选
    foodChange() {
      this.xuanzhonglist = [];
      for (let i = 0; i < this.foodtypelist.length; i++) {
        for (let j = 0; j < this.foodlist.length; j++) {
          if (this.foodtypelist[i] == this.foodlist[j].id) {
            this.xuanzhonglist.push({
              foodId: this.foodlist[j].id,
              name: this.foodlist[j].name,
              pic: this.foodlist[j].pic,
              weight: 100
            });
          }
        }
      }
    },
    //搜索
    indexoffun(name) {
      if (!this.searchName) {
        return true;
      } else {
        return name.indexOf(this.searchName) != -1;
      }
    },
    //确定取消
    dialogVisiblefun() {
     
      let name = "";
      if (this.xuanzhonglist.length == 0) {
        this.$message({ type: "error", message: "请选择菜品!" });
        return;
      } else {
        for (let i = 0; i < this.xuanzhonglist.length; i++) {
          let is = true;
          for (let j = 0; j < this.ruleForm.foodList.length; j++) {
            if (
              this.xuanzhonglist[i].foodId == this.ruleForm.foodList[j].foodId
            ) {
              is = false;
            }
          }
          if (is) {
            this.ruleForm.foodList.push(this.xuanzhonglist[i]);
          } else {
            name += (this.xuanzhonglist[i].name+"；");
          }
        }
         this.dialogVisible = false;
        if (name) {
          this.$message({ type: "error", message: name + "菜品重复!" });
        }
      }
    }
  }
};
</script>
<style>
.packageLibraryadd .upload-block-container,
.packageLibraryadd .upload-file-item {
  height: 120px !important;
  width: 120px !important;
}
.packageLibraryadd .icon--block-del {
  display: none !important;
}
.packageLibraryadd .image-upload__delete {
  height: 40px;
  line-height: 40px;
  background-color: #409efe;
  color: #fff;
  text-align: center;
  position: absolute;
  bottom: 0;
  width: 100%;
  cursor: pointer;
}
.packageLibraryadd .upload-file-item img {
  width: 100% !important;
  height: 100% !important;
  border: 1px dashed #409eff;
  margin: 0 !important;
}
</style>
<style lang="scss" scoped>
.packageLibraryadd {
  padding:12px;
  .top {
    border-bottom: 1px solid #e7eaec;
    padding-bottom: 10px;
  }
  .foot-top {
    overflow: hidden;
  }
  .select-box {
    height: 50px;
    margin: 10px 0;
    border-top: 1px #ebeef5 solid;
    border-bottom: 1px #ebeef5 solid;
    padding: 5px;
    overflow: auto;
    .name {
      line-height: 38px;
      font-size: 20px;
      color: #c0c4cc;
    }
    .box {
      float: left;
      height: 38px;
      img {
        float: left;
        width: 30px;
        height: 30px;
      }
      line-height: 30px;
      font-size: 14px;
      border: 1px #ebeef5 solid;
      padding: 3px;
      border-radius: 3px;
      margin-right: 5px;
      i {
        font-size: 18px;
        cursor: pointer;
      }
      i:hover {
        color: #f56c6c;
      }
    }
  }
  .food-box {
    height: 181px;
    overflow: auto;
    border-bottom: 1px #ebeef5 solid;
    .img {
      width: 45px;
      height: 45px;
      left: 40px;
      position: absolute;
      top: 5px;
    }
    .el-checkbox.is-bordered {
      height: 80px;
      min-width: 130px;
      padding: 50px 10px 10px 10px;
      margin: 5px;
    }
  }
  .subject {
    padding-top: 10px;
    overflow: auto;
    .body {
      width: 810px;
      margin: 0 auto;
      .ul {
        padding: 5px 0;
      }
      .li {
        line-height: 40px;
        color: #606266;
        font-size: 14px;
        margin-bottom: 10px;
        background: #ecf5ff;
        padding: 5px;
        img {
          float: left;
          width: 40px;
          height: 40px;
        }
        i {
          float: right;
          color: #f56c6c;
          font-size: 18px;
          line-height: 40px;
          cursor: pointer;
        }
        span {
          float: left;
          width: 200px;
          margin: 0 10px;
        }
        .el-input-number--mini {
          width: 180px;
          margin: 0 10px;
        }
      }
      .el-select {
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