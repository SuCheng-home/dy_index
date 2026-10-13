<template>
<div class="evaluateCumulativeoneeidt"  >
     <div class="header"> 
         <el-button @click="$router.back()" type="default" size="medium">返回</el-button> 
         <el-button type="primary" size="medium" @click="editAssessDimensions('ruleForm')">保存</el-button>       
      </div>
     <div class="body " :style="`height: ${nobottommaxH}px;`">
       <el-form label-width="160px" class="demo-ruleForm" :model="ruleForm" :rules="rules" ref="ruleForm">            
            <el-form-item label="图片" prop="images">              
              <div class="image-upload-container">
                  <div class="image-upload-container__inner">
                    <uploader ref="coverUploader" pathPrefix="questionnaire" :extList="['bmp', 'png', 'jpg', 'jpeg', 'gif']" showResult="image" showMode="button" v-model="images" :multiple="false"></uploader>
                    <div v-show="images.length !== 0" class="image-upload__delete" @click="deleteCover">删除图片</div>
                  </div>
                  <div class="cover-hint"><i class="el-icon-info"></i>规格建议:120*120</div>
              </div>
             </el-form-item>
             <el-form-item label="维度名称" prop="name">
                <el-input v-model="ruleForm.name" auto-complete="off" placeholder="请输入维度名称" :maxlength="20"></el-input>
             </el-form-item>
             <el-form-item label="分值" prop="score">
                <el-input-number v-model="ruleForm.score" :step="1" step-strictly  placeholder="请输入分值" :min="1" :max="100"></el-input-number>
             </el-form-item>
             <el-form-item label="排序" prop="orderNo">
               <el-input-number v-model="ruleForm.orderNo" :step="1" step-strictly  placeholder="请输入排序" :min="1" :max="100"></el-input-number>
             </el-form-item>
             <el-form-item label="提示语">
               <el-checkbox v-model="ruleForm.badRemind">表现欠佳提示语</el-checkbox>
               <el-checkbox v-model="ruleForm.goodRemind">表现优异提示语</el-checkbox>
             </el-form-item>
              <el-form-item label="表现欠佳提示语" v-if="ruleForm.badRemind" prop="badNotice">
                <el-input v-model="ruleForm.badNotice" auto-complete="off" placeholder="请输入表现欠佳提示语" :maxlength="30"></el-input>
             </el-form-item>
             <el-form-item label="表现优异提示语" v-if="ruleForm.goodRemind" prop="goodNotice">
                <el-input v-model="ruleForm.goodNotice" auto-complete="off" placeholder="请输入表现优异提示语" :maxlength="30"></el-input>
             </el-form-item>
             <el-form-item label="助力">
                <el-switch v-model="ruleForm.isCanHelp"></el-switch>
             </el-form-item>
             <div v-if="ruleForm.isCanHelp">
                  <el-form-item label="每天助力上限（次）" prop="dayHelpNum">
                    <el-input-number v-model="ruleForm.dayHelpNum" :step="1" step-strictly  placeholder="请输入每天助力上限（次）" :min="1" :max="100"></el-input-number>
                  </el-form-item>
             </div>
             <el-form-item label="助力人员及权限" prop="jurisdiction" v-if="ruleForm.isCanHelp">
               <div class="box">
                 <el-checkbox v-model="ruleForm.classStu">同学</el-checkbox>
                 <el-checkbox v-model="ruleForm.classStuone" v-if="ruleForm.classStu">加分</el-checkbox>
                 <el-checkbox v-model="ruleForm.classStutwo" v-if="ruleForm.classStu">扣分</el-checkbox>
               </div>
               <div class="box">
                 <el-checkbox v-model="ruleForm.stuSelf">学生（家长）</el-checkbox>
                 <el-checkbox v-model="ruleForm.stuSelfone" v-if="ruleForm.stuSelf">加分</el-checkbox>
                 <el-checkbox v-model="ruleForm.stuSelftwo" v-if="ruleForm.stuSelf">扣分</el-checkbox>
               </div>
               <div class="box">
                 <el-checkbox v-model="ruleForm.classTh">任课老师</el-checkbox>
                 <el-checkbox v-model="ruleForm.classThone" v-if="ruleForm.classTh">加分</el-checkbox>
                 <el-checkbox v-model="ruleForm.classThtwo" v-if="ruleForm.classTh">扣分</el-checkbox>
               </div>
               <div class="box">
                 <el-checkbox v-model="ruleForm.classHeader">班主任</el-checkbox>
                 <el-checkbox v-model="ruleForm.classHeaderone" v-if="ruleForm.classHeader">加分</el-checkbox>
                 <el-checkbox v-model="ruleForm.classHeadertwo" v-if="ruleForm.classHeader">扣分</el-checkbox>
               </div>
               <div class="box">
                 <el-checkbox v-model="ruleForm.otherTh">其它教工</el-checkbox>
                 <el-checkbox v-model="ruleForm.otherThone" v-if="ruleForm.otherTh">加分</el-checkbox>
                 <el-checkbox v-model="ruleForm.otherThtwo" v-if="ruleForm.otherTh">扣分</el-checkbox>
                 <address-book v-model="addressDataone" :config="configDataone" v-if="ruleForm.otherTh"></address-book>
               </div>
              <div class="box">
                 <el-checkbox v-model="ruleForm.leader">主管领导</el-checkbox>
                 <el-checkbox v-model="ruleForm.leaderone" v-if="ruleForm.leader">加分</el-checkbox>
                 <el-checkbox v-model="ruleForm.leadertwo" v-if="ruleForm.leader">扣分</el-checkbox>
                 <address-book v-model="addressDatatwo" :config="configDatatwo" v-if="ruleForm.leader"></address-book>
               </div>
              </el-form-item>
              <el-form-item label="备注">
                <el-input type="textarea" v-model="ruleForm.remarks" :autosize="{ minRows: 5, maxRows: 5}"></el-input>
              </el-form-item>
       </el-form>
     </div>
</div> 
</template>
<script>
import mixin from "@/mixins/windowResize";
import AddressBook from "@/components/AddressBook/indexExpand";
import Uploader from "@/components/Uploader/WebUploader";
import {editAssessDimension,getAssessDimensionById} from '@/api/evaluateCumulative';
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
     const jurisdictionfun = (rule, value, callback) => {
                if (this.ruleForm.classHeader||this.ruleForm.classStu||this.ruleForm.classTh||this.ruleForm.otherTh||this.ruleForm.leader||this.ruleForm.stuSelf) {
                    return callback()
                } else {
                    return callback(new Error('请至少勾选一个助力人员及权限'));
                }
            };
    return {
      id: this.$route.query.id,
      addressDataone: {departJson:[],groupJson:[],userJson:[]},
      addressDatatwo: {departJson:[],groupJson:[],userJson:[]},
      configDataone: {
        title: "其它教工",
        depart: { target: "user", departType: "all", userTypes: "1" },
        group: false
      },
      configDatatwo: {
        title: "主管领导",
        depart: { target: "user", departType: "all", userTypes: "1" },
        group: false
      },
      images: [],
      ruleForm:{
        name:'',
        score:'',
        orderNo:'',
        badRemind:false,
        goodRemind:false,
        badNotice:'',
        goodNotice:'',
        isCanHelp:false,
        dayHelpNum:'',
        classStu:false,
        classStuone:false,
        classStutwo:false,
        stuSelf:false,
        stuSelfone:false,
        stuSelftwo:false,
        classTh:false,
        classThone:false,
        classThtwo:false,
        classHeader:false,  
        classHeaderone:false,
        classHeadertwo:false,
        otherTh:false,
        otherThone:false,
        otherThtwo:false,        
        leader:false,
        leaderone:false,
        leadertwo:false,
        remarks:'',
      },
      rules:{
        images:[{validator: imagesfun, trigger: 'change', required: true}],
        name:[{required: true, message: '请输入维度名称', trigger: 'blur'}],
        score:[{required: true, message: '请输入分值', trigger: 'blur'}],
        orderNo:[{required: true, message: '请输入排序', trigger: 'blur'}],
        badNotice:[{required: true, message: '请输入表现欠佳提示语', trigger: 'blur'}],
        goodNotice:[{required: true, message: '请输入表现优异提示语', trigger: 'blur'}],
        dayHelpNum:[{required: true, message: '请输入每天助力上限（次）', trigger: 'blur'}],
        jurisdiction:[{validator: jurisdictionfun, trigger: 'change', required: true}],
      }
    };
  },
  mixins: [mixin],
  created() {
    this.getAssessDimensionByIds();
  },
  methods: {
    //获取详情
    getAssessDimensionByIds(){
      getAssessDimensionById(this.id).then(res => {
           let mydata=res.data.data;
           this.ruleForm.name=mydata.name;
           this.ruleForm.orderNo=mydata.orderNo;
           this.ruleForm.score=mydata.score;
           this.ruleForm.remarks=mydata.remarks;
           this.images=[{fileUrl:mydata.logo}]
           if(mydata.badRemind==1){
             this.ruleForm.badRemind=true;
             this.ruleForm.badNotice=mydata.badNotice;
           }
           if(mydata.goodRemind==1){
             this.ruleForm.goodRemind=true;
             this.ruleForm.goodNotice=mydata.goodNotice;
           }
           if(mydata.isCanHelp==1){
             this.ruleForm.isCanHelp=true;
             this.ruleForm.dayHelpNum=mydata.dayHelpNum;
              if(mydata.classStu==1){
                this.ruleForm.classStu=true;
                if(mydata.classStuType==1){
                  this.ruleForm.classStuone=true;
                }
                if(mydata.classStuType==2){
                  this.ruleForm.classStutwo=true;
                }
                if(mydata.classStuType==12){
                  this.ruleForm.classStuone=true;
                  this.ruleForm.classStutwo=true;
                }
              }
              if(mydata.stuSelf==1){
                this.ruleForm.stuSelf=true;
                if(mydata.stuSelfType==1){
                  this.ruleForm.stuSelfone=true;
                }
                if(mydata.stuSelfType==2){
                  this.ruleForm.stuSelftwo=true;
                }
                if(mydata.stuSelfType==12){
                  this.ruleForm.stuSelfone=true;
                  this.ruleForm.stuSelftwo=true;
                }
              }
             if(mydata.classTh==1){
                this.ruleForm.classTh=true;
                if(mydata.classThType==1){
                  this.ruleForm.classThone=true;
                }
                if(mydata.classThType==2){
                  this.ruleForm.classThtwo=true;
                }
                if(mydata.classThType==12){
                  this.ruleForm.classThone=true;
                  this.ruleForm.classThtwo=true;
                }
             }
             if(mydata.classHeader==1){
                this.ruleForm.classHeader=true;
                if(mydata.classHeaderType==1){
                  this.ruleForm.classHeaderone=true;
                }
                if(mydata.classHeaderType==2){
                  this.ruleForm.classHeadertwo=true;
                }
                if(mydata.classHeaderType==12){
                  this.ruleForm.classHeaderone=true;
                  this.ruleForm.classHeadertwo=true;
                }
             }
             if(mydata.otherTh==1){
                this.ruleForm.otherTh=true;
                this.addressDataone.userJson=JSON.parse(mydata.otherThJson);
                if(mydata.otherThType==1){
                  this.ruleForm.otherThone=true;
                }
                if(mydata.otherThType==2){
                  this.ruleForm.otherThtwo=true;
                }
                if(mydata.otherThType==12){
                  this.ruleForm.otherThone=true;
                  this.ruleForm.otherThtwo=true;
                }
             }
             if(mydata.leader==1){
                this.ruleForm.leader=true;
                this.addressDatatwo.userJson=JSON.parse(mydata.leaderJson);
                if(mydata.leaderType==1){
                  this.ruleForm.leaderone=true;
                }
                if(mydata.leaderType==2){
                  this.ruleForm.leadertwo=true;
                }
                if(mydata.leaderType==12){
                  this.ruleForm.leaderone=true;
                  this.ruleForm.leadertwo=true;
                }
             }
           }
        }).catch();

    },
    deleteCover() {
      this.$refs.coverUploader.deleteItem(0);
    },
    //保存
    editAssessDimensions(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let obj={
               id: this.$route.query.id,
               badNotice:'',
               logo:this.images[0].fileUrl,
               badRemind:2,
               name:this.ruleForm.name,
               score:this.ruleForm.score,
               orderNo:this.ruleForm.orderNo,
               remarks:this.ruleForm.remarks,
               goodNotice:'',
               goodRemind:2,
               isCanHelp:2,
               dayHelpNum:0,
               classStu:2,
               classStuType:0,
               stuSelf:2,
               stuSelfType:0,
               classTh:2,
               classThType:0,
               classHeader:2,
               classHeaderType:0,
               otherTh:2,
               otherThIds:'',
               otherThJson:'',
               otherThNames:'',
               otherThType:0,
               leader:2,
               leaderIds:'',
               leaderJson:'',
               leaderNames:'',
               leaderType:0,
            };
            if(this.ruleForm.badRemind){
              obj.badRemind=1;
              obj.badNotice=this.ruleForm.badNotice;
            }
            if(this.ruleForm.goodRemind){
              obj.goodRemind=1;
              obj.goodNotice=this.ruleForm.goodNotice;
            }
            if(this.ruleForm.isCanHelp){
              obj.isCanHelp=1;
              obj.dayHelpNum=this.ruleForm.dayHelpNum;
              if(this.ruleForm.classStu){
                obj.classStu=1;
                obj.classStuType='';
                if(this.ruleForm.classStuone){
                  obj.classStuType=obj.classStuType+'1'
                }
                if(this.ruleForm.classStutwo){
                  obj.classStuType=obj.classStuType+'2'
                }
                if(!obj.classStuType){
                  this.$message.error('同学加分扣分至少勾选一个！');
                  return;
                }
              }
              if(this.ruleForm.stuSelf){
                obj.stuSelf=1;
                obj.stuSelfType='';
                if(this.ruleForm.stuSelfone){
                  obj.stuSelfType=obj.stuSelfType+'1'
                }
                if(this.ruleForm.stuSelftwo){
                  obj.stuSelfType=obj.stuSelfType+'2'
                }
                if(!obj.stuSelfType){
                  this.$message.error('学生（家长）加分扣分至少勾选一个！');
                  return;
                }
              }
              if(this.ruleForm.classTh){
                obj.classTh=1;
                obj.classThType='';
                if(this.ruleForm.classThone){
                  obj.classThType=obj.classThType+'1'
                }
                if(this.ruleForm.classThtwo){
                  obj.classThType=obj.classThType+'2'
                }
                 if(!obj.classThType){
                  this.$message.error('任课老师加分扣分至少勾选一个！');
                  return;
                }
              }
              if(this.ruleForm.classHeader){
                obj.classHeader=1;
                obj.classHeaderType='';
                if(this.ruleForm.classHeaderone){
                  obj.classHeaderType=obj.classHeaderType+'1'
                }
                if(this.ruleForm.classHeadertwo){
                  obj.classHeaderType=obj.classHeaderType+'2'
                }
                if(!obj.classHeaderType){
                  this.$message.error('班主任加分扣分至少勾选一个！');
                  return;
                }
              }
              if(this.ruleForm.otherTh){
                obj.otherTh=1;
                obj.otherThType='';
                if(this.ruleForm.otherThone){
                  obj.otherThType=obj.otherThType+'1'
                }
                if(this.ruleForm.otherThtwo){
                  obj.otherThType=obj.otherThType+'2'
                }
                if(!obj.otherThType){
                  this.$message.error('其它教工加分扣分至少勾选一个！');
                  return;
                }
                if(this.addressDataone.userJson.length==0){
                  this.$message.error('请选择其它教工！');
                  return;
                }else{
                  obj.otherThJson=JSON.stringify(this.addressDataone.userJson);
                  for(let i=0;i<this.addressDataone.userJson.length;i++){
                    if(i<this.addressDataone.userJson.length-1){
                      obj.otherThIds=obj.otherThIds+this.addressDataone.userJson[i].id+',';
                      obj.otherThNames=obj.otherThNames+this.addressDataone.userJson[i].name+',';
                    }else{
                      obj.otherThIds=obj.otherThIds+this.addressDataone.userJson[i].id;
                      obj.otherThNames=obj.otherThNames+this.addressDataone.userJson[i].name;
                    }                    
                  }
                }
              }
              if(this.ruleForm.leader){
                obj.leader=1;
                obj.leaderType='';
                if(this.ruleForm.leaderone){
                  obj.leaderType=obj.leaderType+'1'
                }
                if(this.ruleForm.leadertwo){
                  obj.leaderType=obj.leaderType+'2'
                }
                if(!obj.leaderType){
                  this.$message.error('主管领导加分扣分至少勾选一个！');
                  return;
                }
                if(this.addressDatatwo.userJson.length==0){
                  this.$message.error('请选择主管领导！');
                  return;
                }else{
                  obj.leaderJson=JSON.stringify(this.addressDatatwo.userJson);
                  for(let i=0;i<this.addressDataone.userJson.length;i++){
                    if(i<this.addressDatatwo.userJson.length-1){
                      obj.leaderIds=obj.leaderIds+this.addressDatatwo.userJson[i].id+',';
                      obj.leaderNames=obj.leaderNames+this.addressDatatwo.userJson[i].name+',';
                    }else{
                      obj.leaderIds=obj.leaderIds+this.addressDatatwo.userJson[i].id;
                      obj.leaderNames=obj.leaderNames+this.addressDatatwo.userJson[i].name;
                    }                    
                  }
                }
              }
            }
            editAssessDimension(obj) .then(res => res.data).then(data => {
                                    if(data.result) {
                                        this.$message({
                                            message: '编辑成功！',
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
.evaluateCumulativeoneeidt .upload-block-container,
.evaluateCumulativeoneeidt .upload-file-item {
  height: 120px !important;
  width: 120px !important;  
}
.evaluateCumulativeoneeidt .icon--block-del {
  display: none !important;
}
.evaluateCumulativeoneeidt .image-upload__delete {
  height: 40px;
  line-height: 40px;
  background-color: #409efe;
  color: #fff;
  text-align: center;
  position: absolute;
  bottom: 0;
  width: 100%;
}
.evaluateCumulativeoneeidt .upload-file-item img {
  width: 100% !important;
  height: 100% !important; 
  border: 1px dashed #409eff;
  margin: 0 !important;
}
</style>

<style lang="scss" scoped>
.evaluateCumulativeoneeidt {
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
      .el-checkbox{
        width: 110px;
      }
    }
  }
}
</style>