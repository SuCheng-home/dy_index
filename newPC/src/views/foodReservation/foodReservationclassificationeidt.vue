<template>
<div class="foodReservationclassificationeidt"  >
     <div class="header"> 
         <el-button @click="$router.back()" type="default" size="medium">返回</el-button> 
         <el-button type="primary" size="medium" @click="editPastryTypes('ruleForm')">保存</el-button>     
      </div>
     <div class="body " :style="`height: ${nobottommaxH}px;`">
       <el-form label-width="170px" class="demo-ruleForm" :model="ruleForm" :rules="rules" ref="ruleForm">            
            <el-form-item label="图片" prop="images">              
              <div class="image-upload-container">
                  <div class="image-upload-container__inner">
                    <uploader ref="coverUploader" pathPrefix="questionnaire" :extList="['bmp', 'png', 'jpg', 'jpeg', 'gif']" showResult="image" showMode="button" v-model="images" :multiple="false"></uploader>
                    <div v-show="images.length !== 0" class="image-upload__delete" @click="deleteCover">删除图片</div>
                  </div>
                  <div class="cover-hint"><i class="el-icon-info"></i>规格建议:120*120</div>
              </div>
             </el-form-item>
            <el-form-item label="分类名称" prop="typeName">
                <el-input v-model="ruleForm.typeName" auto-complete="off" placeholder="请输入分类名称" :maxlength="10"></el-input>
            </el-form-item>
            <el-form-item label="排序" prop="typeOrder">
               <el-input-number v-model="ruleForm.typeOrder" :step="1" step-strictly  placeholder="请输入排序" :min="1" :max="100"></el-input-number>
             </el-form-item>
             <el-form-item label="负责人" prop="addressDataprop">
                <address-book v-model="addressData" :config="configData"></address-book>
             </el-form-item>
             <el-form-item label="支付方式" prop="typePayWay">
                    <el-radio-group v-model="ruleForm.typePayWay">
                        <el-radio :label="2">线下支付</el-radio>
                        <el-radio :label="1">线上支付</el-radio>                   
                    </el-radio-group>
            </el-form-item>
             <el-form-item label="柜台代码" prop="barCode" v-if="ruleForm.typePayWay==1">
                <el-select v-model="ruleForm.barCode" placeholder="请选择柜台代码">
                <el-option :label="item.posId" :value="item.posId"  v-for="(item,index) in typelist" :key="index"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="每项食品每日预订上限" prop="maxCount">
               <el-input-number v-model="ruleForm.maxCount" :step="1" step-strictly  placeholder="请输入排序" :min="1" :max="1000"></el-input-number>
             </el-form-item>
             <el-form-item label="预订规则" prop="typePayWay">                      
                  <div class="input">1、运营时间：每天至&nbsp;&nbsp;<el-time-select  :clearable="false" :editable="false" v-model="ruleForm.startDate" :picker-options="{ start: '05:00', step: '00:05', end: '24:00',maxTime:ruleForm.endDate }"></el-time-select>&nbsp;&nbsp;至&nbsp;&nbsp;<el-time-select  :clearable="false" :editable="false" v-model="ruleForm.endDate" :picker-options="{start: '05:00', step: '00:05', end: '24:00',minTime: ruleForm.startDate }"></el-time-select></div>
                  <div class="input">2、最多可预订&nbsp;&nbsp;<el-input-number v-model="ruleForm.mostDay" :step="1" step-strictly  placeholder="请输入天数" :min="1" :max="31"></el-input-number>&nbsp;&nbsp;天内的食品</div>
                  <div class="input">3、每天&nbsp;&nbsp;<el-time-select  :clearable="false" :editable="false" v-model="ruleForm.afterDate" :picker-options="{ start: '05:00', step: '00:05', end: '24:00',maxTime:ruleForm.endDate,minTime: ruleForm.startDate}"></el-time-select> &nbsp;&nbsp;前可预订（取消）&nbsp;&nbsp; <el-input-number v-model="ruleForm.afterDay" :step="1" step-strictly  :min="0" :max="ruleForm.mostDay-1"  placeholder="请输入天数"></el-input-number>&nbsp;&nbsp;天后的食品(0代表包含今天)</div>
            </el-form-item>
       </el-form>       
     </div>
</div> 
</template>
<script>
import mixin from "@/mixins/windowResize";
import AddressBook from "@/components/AddressBook/indexExpand";
import Uploader from "@/components/Uploader/WebUploader";
import { editPastryType,querySchoolChargeRelationList,getPastryTypeById} from "@/api/foodReservation";
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
                } else {
                    return callback(new Error('请上选择负责人'));
                }
            };
    return {
      addressData: {departJson:[],groupJson:[],userJson:[]},
      configData: {
        title: "负责人",
        depart: { target: "user", departType: "all", userTypes: "1" },
        group: false
      },
      images: [],
      typelist:[],
      ruleForm:{
        afterDate:'12:00',
        afterDay:0,
        barCode:'',
        typePayWay:2,
        endDate:'12:30',
        startDate:'08:00',
        maxCount:0,  
        mostDay:0,
        typeName:'',
        typeOrder:1,
        typeUrl:'',
        userJSON:'' ,
        id: this.$route.query.id 
      },
      rules:{
        images:[{validator: imagesfun, trigger: 'change', required: true}],
        typePayWay:[{ required: true, message: '请选择支付方式', trigger: 'change' }],
        maxCount:[{required: true, message: '请输入每项食品每日预订上限', trigger: 'blur'}],
        typeName:[{required: true, message: '请输入类型名称', trigger: 'blur'}],        
        typeOrder:[{required: true, message: '请输入排序', trigger: 'blur'}],
        addressDataprop:[{validator: addressDatapropfun, trigger: 'change', required: true}],
        barCode:[{ required: true, message: '请选择柜台代码', trigger: 'change' }]
      }
    };
  },
  mixins: [mixin],
  created() {
      this.querySchoolChargeRelationLists();
      this.getPastryTypeByIds();
  },
  methods: {
    deleteCover() {
      this.$refs.coverUploader.deleteItem(0);
    },
    querySchoolChargeRelationLists(){
        querySchoolChargeRelationList().then(res => res.data).then(data => {
           this.typelist=data.data;
        })
    },
    getPastryTypeByIds(){
        getPastryTypeById(this.ruleForm.id).then(res => res.data).then(data => {       
           let mydata=data.data;
           this.images=[{fileUrl:mydata.typeUrl}];
           this.ruleForm.afterDate=mydata.afterDate;
           this.ruleForm.afterDay=mydata.afterDay;
           this.ruleForm.barCode=mydata.barCode;
           this.ruleForm.typePayWay=mydata.typePayWay;
           this.ruleForm.endDate=mydata.endDate;
           this.ruleForm.startDate=mydata.startDate;
           this.ruleForm.maxCount=mydata.maxCount;
           this.ruleForm.mostDay=mydata.mostDay;
           this.ruleForm.typeName=mydata.typeName;
           this.ruleForm.typeOrder=mydata.typeOrder;
           let list=[];
           for(let i=0;i<mydata.userList.length;i++){
               list.push({
                   avatar:mydata.userList[i].userAvatar,//	用户头像	string	
                   id:mydata.userList[i].userId,//	用户id	number	
                   loginname:mydata.userList[i].userLoginName,//	用户loginname	string	
                   name:mydata.userList[i].userName,//	用户名字	string
                })
            };
           this.$set( this.addressData, "userJson", list);
        })
    },
    //保存
    editPastryTypes(formName) {
         if((!this.ruleForm.afterDay&&this.ruleForm.afterDay!==0)||(!this.ruleForm.mostDay&&this.ruleForm.mostDay!==0)){
                this.$message.error('预订规则2中的天数和预订规则3中的天数不能为空!');
                return;
            }
            if((this.ruleForm.afterDay>this.ruleForm.mostDay)||(this.ruleForm.afterDay==this.ruleForm.mostDay)){
                this.$message.error('预订规则3中的天数需要小于预订规则2中的天数!');
                return;
            }
            if((this.ruleForm.afterDate>this.ruleForm.endDate)||(this.ruleForm.afterDate<this.ruleForm.startDate)){
                this.$message.error('预订规则3中的时间可选范围为预订规则1的时间范围!');
                   return;
            }
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.ruleForm.typeUrl=this.images[0].fileUrl;
            let list=[];
            for(let i=0;i<this.addressData.userJson.length;i++){
                list.push({
                    userAvatar:this.addressData.userJson[i].avatar,//	用户头像	string	
                    userId:this.addressData.userJson[i].id,//	用户id	number	
                    userLoginName:this.addressData.userJson[i].loginname,//	用户loginname	string	
                    userName:this.addressData.userJson[i].name,//	用户名字	string
                })
            };           
            this.ruleForm.userJSON=JSON.stringify(list);
            editPastryType(this.ruleForm) .then(res => res.data).then(data => {
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
.foodReservationclassificationeidt .upload-block-container,
.foodReservationclassificationeidt .upload-file-item {
  height: 120px !important;
  width: 120px !important;  
}
.foodReservationclassificationeidt .icon--block-del {
  display: none !important;
}
.foodReservationclassificationeidt .image-upload__delete {
  height: 40px;
  line-height: 40px;
  background-color: #409efe;
  color: #fff;
  text-align: center;
  position: absolute;
  bottom: 0;
  width: 100%;
}
.foodReservationclassificationeidt .upload-file-item img {
  width: 100% !important;
  height: 100% !important; 
  border: 1px dashed #409eff;
  margin: 0 !important;
}
</style>

<style lang="scss" scoped>
.foodReservationclassificationeidt {
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
        width: 140px;
      }
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