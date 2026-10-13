<template>
    <div class="schoolfoodbankeidt ">
        <div class="top">
          <el-button @click="$router.back()" type="default" size="medium">返回</el-button>
          <el-button type="primary" size="medium" @click="updateFoods('ruleForm')">保存</el-button>
        </div>
        <div class="subject" :style="`height: ${nobottommaxH}px;`">
            <div class="body">
             <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="140px" class="demo-ruleForm">
                <el-form-item label="名称" prop="name">
                    <el-input v-model="ruleForm.name" :maxlength="30"  placeholder="请输入名称"></el-input>
                </el-form-item>
                <el-form-item label="类型" prop="typeId">
                    <el-select v-model="ruleForm.typeId" placeholder="请选择类型">
                    <el-option  :value="item.id"  :label="item.value" v-for="item in foodTypeList" :key="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="烹饪方式" prop="methodId">
                    <el-select v-model="ruleForm.methodId" placeholder="请选择烹饪方式">
                     <el-option  :value="item.id"  :label="item.value" v-for="item in foodMethodList" :key="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="图片" class="pic">
                    <uploader pathPrefix="shipudingcan" useSysBucket module="shipudingcan" moduleCode="20201204" :multiple="false" v-model="piclist" :extList="['jpeg', 'jpg', 'bmp', 'gif', 'png']" showMode="cover" :showModeCover="true" showResult="image"></uploader>
                    <div class="img-b-box">点击更换图片</div>
                </el-form-item>
                <el-form-item label="食材构成" class="pic">
                    <i class="el-icon-circle-plus-outline" @click="popfun()"></i>
                    <div class="ul">
                        <div class="li" v-for="(item,index) in xuanzhonglist" :key="index">
                            <div class="name">{{item.materialName}}</div>
                            <el-input size="mini" v-model="item.percent" onKeypress="return(/[\d]/.test(String.fromCharCode(event.keyCode)))" placeholder="请输入"></el-input> %
                            <el-tooltip class="item" effect="dark" content="删除" placement="top">
                            <i class="el-icon-delete" @click="deletefun(index)"></i>
                            </el-tooltip>  
                        </div>
                    </div>
                </el-form-item>
                <el-form-item label="备注">
                    <el-input type="textarea" v-model="ruleForm.remark" :maxlength="100" ></el-input>
                </el-form-item>
                </el-form>
            </div>
         </div>   			
         <el-dialog title="选择食材" :close-on-press-escape='false' :close-on-click-modal='false' :visible.sync="dialogVisible" width="800px" :lock-scroll="false" :modal-append-to-body='false'>
		 <div class="foot-top">        
        <el-col :span="18">
            <el-select v-model="typeId" placeholder="请选择类型" size="medium">
                    <el-option  :value="item.id"  :label="item.value" v-for="item in materiallist" :key="item.id"></el-option>
                    </el-select>
        </el-col>
        <el-col :span="6">
                <el-input size="medium"  placeholder="请输入食材名称" v-model.trim="searchName">
                  <el-button size="medium" slot="append" icon="el-icon-search" ></el-button>
                </el-input>
        </el-col>
     </div>    
     <div class="food-box">
        <el-checkbox-group v-model="foodtypelist">
          <el-checkbox  border v-for="item in foodlist" :key="item.id" :label="item.id" v-show="(item.typeId==typeId||typeId==0)&&indexoffun(item.name)">
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
import { findDicsByCode,chooseMaterial,updateFood,foodDetails} from "@/api/dietaryManagement";
import mixin from "@/mixins/windowResize";
import Uploader from "@/components/Uploader/WebUploader";
import { mapGetters } from "vuex";
export default {
  components: { Uploader},
  data() {
    return {
      ruleForm: {
        id:this.$route.query.id,
        name: "", //	名称	string
        typeId: "", //	类型Id	number
        methodId: "", //	做法Id	number
        publicFood: "0", //	标识是否是公共食物，1代表是，0代表不是	number
        remark: "", //	备注	string
        methodName: "", //	做法名称	string
        schoolId: "", //	学校Id,为0时代表是系统食物	number
        typeName: "", //	类型名称	string
        pic: "", //	string
        materialJson: "" //	食材JSON	string
      },
      rules: {
        name: [
          { required: true, message: "请输入名称", trigger: "blur" },
          { min: 1, max: 10, message: "长度在 1 到 10 个字符", trigger: "blur" }
        ],
        typeId: [
          { required: true, message: "请选择类型区域", trigger: "change" }
        ],
        methodId: [
          { required: true, message: "请选择类烹饪方式", trigger: "change" }
        ]
      },
      foodTypeList: [],
      foodMethodList: [],
      piclist: [
        {
          fileUrl:
            "https://cdnfile-10043692.file.myqcloud.com/admin/images/shanshi/shiwu.png",
          fileName: "shiwu.png"
        }
      ],
      dialogVisible: false,
      materiallist:[],
      typeId:'0',
      searchName:'',
      foodlist:[],
      foodtypelist:[],
      xuanzhonglist:[]
    };
  },
  computed: { ...mapGetters(["schoolInfo"]) },
  created() {
    this.ruleForm.schoolId = this.schoolInfo.id;
    findDicsByCode("foodType")
      .then(res => {
        if (res.data.data.length > 0 && res.data.data) {
          this.foodTypeList = res.data.data;
        }
      })
      .catch();
    findDicsByCode("foodMethod")
      .then(res => {
        if (res.data.data.length > 0 && res.data.data) {
          this.foodMethodList = res.data.data;
        }
      })
      .catch();
      findDicsByCode("material")
      .then(res => {
         this.materiallist=[{id:'0',value:'全部食材类型'}]
        if (res.data.data.length > 0 && res.data.data) {
          let mydata=res.data.data;
          for(let i=0;i<mydata.length;i++){
               this.materiallist.push(mydata[i])
          };
        };
      })
      .catch();
      this.chooseMaterials();
      this.foodDetailss()
  },
  mixins: [mixin],
  methods: {
      //详情
      foodDetailss(){
       foodDetails(this.ruleForm.id).then(res => res.data).then(data => {
          if(data.code==200){
            let mydata=data.data;
            this.ruleForm.name=mydata.name;
            this.ruleForm.typeId=mydata.typeId;
            this.ruleForm.methodId=mydata.methodId;            
            if(mydata.remark){
               this.ruleForm.remark=mydata.remark;
            };
            this.piclist[0].fileUrl=mydata.pic;
            this.xuanzhonglist=mydata.materialList;
          }     
       })
     },
    //保存
    updateFoods(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if(this.xuanzhonglist.length==0){
                this.$message({type: 'error', message:'请选择食材!'});
                return;
            };
            let num=0
            for(let i=0;i<this.xuanzhonglist.length;i++){
                num+=(this.xuanzhonglist[i].percent-0)
                if(this.xuanzhonglist[i].percent==0){
                     this.$message({type: 'error', message:'食材占比不能为空为零!'});
                     return;
                };
            };
            if(Math.floor(num)>100){
              this.$message({type: 'error', message:'食材占比总和不能大于100!'});
                 return;
            };
            if(Math.floor(num)<100){
              this.$message({type: 'error', message:'食材占比总和不能小于100!'});
                  return;
            };
            this.ruleForm.materialJson=JSON.stringify(this.xuanzhonglist);
            this.ruleForm.pic=this.piclist[0].fileUrl;
            for(let i=0;i<this.foodTypeList.length;i++){
                if(this.foodTypeList[i].id==this.ruleForm.typeId){
                    this.ruleForm.typeName=this.foodTypeList[i].value;
                }
            };
            for(let i=0;i<this.foodMethodList.length;i++){
                if(this.foodMethodList[i].id==this.ruleForm.methodId){
                    this.ruleForm.methodName=this.foodMethodList[i].value
                }
            };
            let $this=this;
             updateFood(this.ruleForm)
              .then(res => {
                if (res.data.code === 200) {
                  $this.$message({
                    type: "success",
                    message: "操作成功!"
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
    //删除
    deletefun(index){
      this.$confirm('是否删除?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.xuanzhonglist.splice(index,1);
                }).catch(() => {
                });
        
    },
    //弹框
    popfun() {
      this.typeId = "0";
      this.dialogVisible = true;
      this.foodtypelist = [];
      this.searchName='';
    },    
     dialogVisiblefun(){
         let foodName='';  
         let mylist=[];
         for(let i=0;i<this.foodtypelist.length;i++){
             for(let j=0;j<this.foodlist.length;j++){
                 if(this.foodtypelist[i]==this.foodlist[j].id){
                     mylist.push({
                        materialId: this.foodlist[j].id,
                        materialName: this.foodlist[j].name,
                        percent: '50',
                        typeName:this.foodlist[j].typeName
                     })
                 }
             }
         };
         if(this.foodtypelist.length==0){
             this.$message({type: 'error', message:'请选择食材!'});
             return;
         };
          for(let i=0;i<mylist.length;i++){
             let is=true;
             for(let j=0;j<this.xuanzhonglist.length;j++){
               if(mylist[i].materialId==this.xuanzhonglist[j].materialId){
                 is=false;
               }
             };
             if(is){
                this.xuanzhonglist.push(mylist[i])
             }else{
               foodName+=mylist[i].materialName;
             }
          };
          if(foodName!=''){
            this.$message({type: 'error', message:foodName+'食材重复!'});
          };
          this.dialogVisible = false;
   },
   //搜索
   indexoffun(name){
     if(!this.searchName){
       return true;
     }else{
         return name.indexOf(this.searchName) != -1;
     };   
   },
     //获取所有食材
   chooseMaterials(){
         chooseMaterial('','0').then(res=>{                
                let mydata=res.data.data;
                this.foodlist=mydata;
            }).catch();
   }
  }
};
</script>
<style>
.schoolfoodbankeidt .upload-file-item img {
  width: 80px !important;
  height: 80px !important;
  margin: 0;
  border: 1px dashed #409EFF;
  box-sizing: border-box;
  margin: 0 !important;
}
.schoolfoodbankeidt .upload-block-container .upload-file-item {
  height: 80px;
}
.schoolfoodbankeidt .upload-file-item .file-name {
  display: none;
}
</style>
<style lang="scss" scoped>
.schoolfoodbankeidt {
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
      .ul{
          .li{
                        height: 40px;
          position: relative;
          padding-left: 170px;

              .el-input{
                  width: 150px;
              }
              .name{
              position: absolute;
              width: 160px;
              line-height: 40px;
              height: 40px;
              left:0;
              top:0;
              text-align: right;
          }
           .el-icon-delete{
                  line-height: 40px;
                  font-size: 20px;                  
                  margin-left: 50px;
                  color: #606266;
                  cursor:pointer;                  
               }
                .el-icon-delete:hover{
                    color:#F56C6C
                  }
          }
          
      }
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
