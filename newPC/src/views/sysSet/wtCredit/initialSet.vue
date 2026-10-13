<template>
  <div class="initialSet" :style="{  height: (boxH) + 'px' }">
    <div class="el-row menu-tools">
      <el-button @click="$router.back()" type="default" size="medium">返回</el-button>
      <el-button type="primary" @click="saveHandler"  size="medium">保存</el-button>
    </div>
    <div class="main-wrap" :style="{  height: (boxH-110) + 'px' }">
      <div class="body">
        <div class="g-title required">积分卡分类设置<span style="font-size:10px;">(卡图片推荐360*240)</span></div>
        <div class="sort-wrap">
          <div class="item-wrap clearfix" v-for="(typeItem,typeIndex) in typeJsonArr" :key="typeIndex">
            <div class="default-cover">
              <uploader pathPrefix="wutongxinyong" module="wutongxinyong" moduleCode="20190426" :multiple="false" v-model="typeItem.files" :extList="['jpeg', 'jpg', 'bmp', 'gif', 'png']" showMode="image" showResult="image"></uploader>
            </div>
            <label class="item-label"><span>分类名称：</span>
              <el-input  placeholder="请输入分类名称" :maxlength="20" v-model.trim="typeItem.typeName">
              </el-input>
            </label>
            <label class="item-label"><span>对应积分：</span>
              <el-input  placeholder="请输入对应积分(1-3个字符)" v-model.trim="typeItem.point" type="number" pattern="[0-9]*" :maxlength="3" @keyup.native="proving(typeItem.point,typeIndex)">
              </el-input>
            </label>
            <span class="fa fa-close delete-btn" @click="delCardType(typeIndex)"></span>
            <el-checkbox v-model="typeItem.isApply">允许学生自主申领</el-checkbox>
          </div>
          <div class="add-wrap" @click="addCardType">
            新增积分卡分类
          </div>
        </div>
        <div style="display: none;">
          <div class="g-title required">商城兑换审核设置</div>
          <div class="check-wrap">
            <el-checkbox v-model="chargeClass" label="班主任审核" border class="check-item"></el-checkbox>
            <el-checkbox v-model="chooseAuditor" label="其他审核员审核" border class="check-item"></el-checkbox>
            <address-book class="check-people" v-model="managerUserJson" :config="configData" v-if="chooseAuditor"></address-book>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import AddressBook from '@/components/AddressBook/indexExpand';
import Uploader from '@/components/Uploader/WebUploader';
import {saveCreditPointInitSet,getCreditPointInitSet} from '@/api/wtCredit';
import mixin from '@/mixins/windowResize';
export default{
  components: {
    AddressBook,
    Uploader
  },
  data(){
    return{
      UploadPath:global.BasePath+ 'common/addImageUp',////图片上传路径
      typeJsonArr:[],
      configData: { title: '其他审核员', depart: { target: 'user',departType:'t',userTypes:'1'}},
      managerUserJson:{},
      userJson:[],
      chargeClass:false,
      chooseAuditor:false
    }
  },
  created(){
    this.getCreditPointInitSetFunc();
  },
  mounted(){
  },
  mixins:[mixin],
  methods:{
    //处理图片名
    fileNameUse(file){
      return file.indexOf('?') !== -1 ?file.slice(0, file.indexOf('?')) : file;
    },
    proving(item,index){
      item=item.replace(/[^\.\d]/g,'');
      item=item.replace('.','');
      this.typeJsonArr.forEach((typeItem,itemIndex) => {
        if(itemIndex==index){
          typeItem.point=item;
        }
      });
    },
    handleCoverSuccess(res,file,fileList,typeItem){
      typeItem.typeLogo=res.data.url;
    },
    handleBeforeCover(file){
      if (['image/jpeg', 'image/bmp', 'image/gif', 'image/png'].indexOf(file.type) === -1) {
          this.$message.error('上传图片仅支持.jpg .jpeg .gif .png .bmp图片格式！');
          return false;
      }
      // if (file.size / 1024 / 1024 >= 2) {
      //     this.$message.error('上传图片大小不能超过 2MB!');
      //     return false;
      // }
      return true;
    },
    getCreditPointInitSetFunc(){
      getCreditPointInitSet().then(res=>res.data)
      .then(data=>{
        if(data.code===200){
          let cardList=data.data;

          if (cardList.typeList.length) {
            cardList.typeList.forEach((item) => {
              item.isApply = item.canApply === 1;
              if(item.typeLogo){
                let fileName=this.fileNameUse(item.typeLogo).replace(/.+\//, "");
                item.files=[];
                item.files.push({
                  fileName:fileName,
                  fileUrl:item.typeLogo
                })
              }
            })
          }
          this.typeJsonArr=cardList.typeList;
          this.chargeClass=cardList.chargeClass==1?true:false;
          this.chooseAuditor=cardList.chooseAuditor==1?true:false;
          this.managerUserJson= {
              departJson: [],
              userJson: cardList.userList,
              groupJson: []
          };
        }
      })
    },
    saveHandler(){
      let flag=true;
      if(this.typeJsonArr && !this.typeJsonArr.length){
        this.$message({
          type:'error',
          message:'新增积分卡分类不能为空！'
        });
        return false;
      }
      for(let i=0;i<this.typeJsonArr.length;i++){
        if(this.typeJsonArr[i].point=='' || this.typeJsonArr[i].typeName==''){
          this.$message({
            type:'error',
            message:'分类名称和对应积分不能为空！'
          });
          flag=false;
          return false;
        }
        if(this.typeJsonArr[i].point==0){
          this.$message({
            type:'error',
            message:'对应积分不能为0！'
          });
          flag=false;
          return false;
        }
        if(this.typeJsonArr[i].files.length==0){
          this.$message({
            type:'error',
            message:'图片不能为空，请上传图片！'
          });
          flag=false;
          return false;
        }
      }
      for(let i=0;i<this.typeJsonArr.length;i++){
        if(this.typeJsonArr[i].point.length>3){
          this.$message({
            type:'error',
            message:'所需积分不能超过3个字段！'
          });
          flag=false;
          return false;
        }
      }
      if(!this.chargeClass&&!this.chooseAuditor){
        this.$message({
          type:'error',
          message:'审核员设置不能为空！'
        });
        return false;
      }
      if(this.chooseAuditor){
        if((this.managerUserJson.userJson&&this.managerUserJson.userJson.length>0)||(this.managerUserJson.departJson&&this.managerUserJson.departJson.length>0)||(this.managerUserJson.groupJson&&this.managerUserJson.groupJson.length>0)){
          //
        }else{
          this.$message({
            type:'error',
            message:'请选择审核员!'
          });
          return false;
        }
      }
      if(flag){
        this.userJson=[];
        if(this.chooseAuditor==0){
          this.managerUserJson={};
        }
        if(this.managerUserJson&&this.managerUserJson.userJson&&this.managerUserJson.userJson.length!==0){
          this.userJson=this.managerUserJson.userJson;
        }else{
          this.userJson=[];
        }
        this.typeJsonArr.forEach((typeItem)=>{
          typeItem.canApply=typeItem.isApply ? 1 : 0;
          typeItem.typeLogo=typeItem.files.map(item=>item.fileUrl).toString();
        });
        saveCreditPointInitSet({
          chargeClass:this.chargeClass?1:0,
          chooseAuditor:this.chooseAuditor?1:0,
          typeJson:JSON.stringify(this.typeJsonArr),
          userJson:JSON.stringify(this.userJson)
        }).then(res=>res.data)
        .then(data=>{
          if(data.code===200){
            this.$message({
              type: 'success',
              message: '初始化设置成功！'
            });
            this.$router.push({
              path: 'wtCreditIndex'
            });
          }
        })
      }
    },
    addCardType(){
      this.typeJsonArr.push({
        id: 0,
        isApply: false,
        point: '',
        typeName: '',
        typeLogo: '',
        files: []
      })
    },
    delCardType(index){
      this.typeJsonArr.splice(index,1);
    },
    goback(){
      this.$router.push({
        path:'wtCreditIndex'
      })
    }
  }
}
</script>
<style lang="scss" scoped>

  .initialSet{
    padding:12px;
    box-sizing: border-box;
  }
  .body{
    width: 810px;
    margin: 0 auto;
  }
  .menu-tools {
    border-bottom: 1px solid #e7eaec;
    padding-bottom: 10px;
  }
  .main-wrap{
    padding-top:20px;
    overflow-x:hidden;
    overflow-y: auto;
    .sort-wrap{
      width:95%;
      // max-height:483px;
      position: relative;
      border: 1px solid #ccc;
      padding: 10px;
      box-sizing: border-box;
      margin:20px 0 20px 20px;
      .item-wrap{
        border: 1px solid #ccc;
        padding:10px;
        margin-bottom:10px;
        .item-label{
          margin-right:10px;
          line-height: 50px;
        }
        span{
          color:#48576a;
          font-size:14px;
        }
        .delete-btn{
          font-size: 16px;
          color: #f08080;
          cursor: pointer;
        }
      }
      .add-wrap{
        border: 1px solid #ccc;
        padding: 10px;
        color:#48576a;
        font-size:14px;
        width:160px;
        text-align: center;
        color:#333;
        cursor: pointer;
      }
    }
    .check-wrap{
      margin-left:20px;
      label{
        display: block;
        width: 60%;
        margin-left:0;
      }
      .check-item{
        display:block;
        margin-bottom:10px;
      }
      .el-checkbox.is-bordered+.el-checkbox.is-bordered{
        margin-left:0;
      }
    }
  }
  .g-title{
    position: relative;
    font-size: 16px;
    color: #48576a;
    margin-bottom:20px;
  }
  .g-title.required:before {
      content: "*";
      color: #ff4949;
      margin-right: 4px;
  }
.main-wrap::-webkit-scrollbar-thumb {
  background: #99a9bf;
  border-radius: 20px;
}
.main-wrap::-webkit-scrollbar {
  width: 6px;
}
.main-wrap::after {
  top: 0;
  right: 0;
  width: 0px;
  height: 100%;
}
.default-cover{
  float: left;
  margin-right:10px;
  position: relative;
}
.defaultCoverBox{
  width:128px;
  height:50px;
  overflow: hidden;
  position: relative;
}
.cover-uploader .avatar-uploader-icon{
  font-size: 18px;
  color: #8c939d;
  width: 128px;
  height: 50px;
  line-height:50px;
  text-align: center;
  border: 1px solid #d0d0d0;
  box-sizing: border-box;
  cursor: pointer;
  position: relative;
  border-radius:4px;
  overflow: hidden;
}
.cover-uploader .avatar-uploader-icon:before{
  color:#ccc;
  left:10px;
}
.cover-uploader .avatar-uploader-icon:hover{
  border: 1px solid #409EFF;
}
.cover-img{
  display: block;
  width:128px;
  height:50px;
  border-radius:4px;
  overflow: hidden;
  background-size: 100% 100%;
}
.mask-cover-img{
  position: absolute;
  left: 0;
  bottom: 0;
  color: white;
  line-height: 25px;
  font-size: 12px;
  position: absolute;
  width:100%;
  // height: 16px;
  line-height: 16px;
  background-color: rgba(0,0,0,.5);
  text-align: center;
  transition: all .5s;
  transform: translate(0,100%);
}
.defaultCoverBox:hover .mask-cover-img{
  transform: translate(0,0);
}
</style>
<style scoped>
.initialSet .el-input,.initialSet  .el-input__inner{
  width:auto;
}
.check-wrap .el-checkbox+.el-checkbox{
  margin-left:0;
}
.check-people{
  display:block;
  width:60%;
  /* margin-left:20px; */
}
input[type=number] {
-moz-appearance:textfield;
}
input[type=number]::-webkit-inner-spin-button,
input[type=number]::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
}
.initialSet #address-dialog .el-dialog{
  height:auto !important;
}
</style>
