<template>
<div class="homeVisitadd"  v-loading="loading">
     <div class="header"> 
         <el-button @click="$router.back()" type="default" size="medium">返回</el-button> 
         <el-button type="primary" size="medium" @click="addHomeVisitRecord()">保存</el-button>  
      </div>
     <div class="body " :style="`height: ${nobottommaxH}px;`">
        <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="140px" class="demo-ruleForm">
            <el-form-item label="学生姓名" class="is-required">
                 <span v-if="id"> {{ruleForm.stuName}}</span>
              <address-book v-else v-model="stuAddressData" :config="stuConfigData"   :isSchoolManager="true"></address-book>
            </el-form-item>
            <el-form-item  v-if="isShowFiled('1001')" label="家访老师" class="is-required">
               <span v-if="id"> {{ruleForm.visitTeacher}}</span>
              <address-book v-else v-model="AddressData" :config="ConfigData"  :isSchoolManager="true"></address-book>
            </el-form-item>
             <el-form-item v-if="isShowFiled('1002')" label="家访时间" prop="visitTime">
                  <el-date-picker v-model="ruleForm.visitTime" type="date" placeholder="请选择家访时间" :clearable="false"></el-date-picker>
             </el-form-item>
             <el-form-item v-if="isShowFiled('1003')"  label="家访地点" prop="visitSite">
                     <el-input v-model.trim="ruleForm.visitSite"  placeholder="请输入家访地点" :maxlength="50"></el-input>
             </el-form-item>
               <el-form-item v-if="isShowFiled('1004')"  label="家访内容" prop="visitContent">
                   <el-checkbox-group v-model="ruleForm.visitContent">
                    <el-checkbox   v-for="item in contentList" :key="item.id" :label="item.code" :name="item.code">{{item.value}}</el-checkbox>
                    <el-checkbox   label="-1" name="-1">其他</el-checkbox>
              </el-checkbox-group>
             </el-form-item>
             <el-form-item v-if="isShowOtherText()&&isShowFiled('1004')"  label="其他内容" prop="otherContent">
                     <el-input v-model.trim="ruleForm.otherContent"  placeholder="请输入其他内容" :maxlength="50"></el-input>
             </el-form-item>
             <!-- <el-form-item label="家访方式" prop="visitTypeId">
                      <el-radio-group v-model="ruleForm.visitTypeId">
                        <el-radio v-for="item in unitlistone" :key="item.id" :label="item.code" :name="item.code">{{item.value}}</el-radio>
                    </el-radio-group>
             </el-form-item>
             <el-form-item label="入户时间" v-if="ruleForm.visitTypeId=='1001'" prop="entryTimeId">
                     <el-date-picker v-model="ruleForm.entryTimeId" type="datetime" placeholder="请选择入户时间" :clearable="false"></el-date-picker>
             </el-form-item>            
              <el-form-item label="家庭地址" v-if="ruleForm.visitTypeId=='1001'" prop="homeAddress">
                     <el-input v-model.trim="ruleForm.homeAddress"  placeholder="请输入家庭地址" :maxlength="50"></el-input>
             </el-form-item>
              <el-form-item label="不能入户原因" v-if="ruleForm.visitTypeId&&ruleForm.visitTypeId!='1001'" prop="enEntryCode">
                    <el-select v-model="ruleForm.enEntryCode" placeholder="请选择不能入户原因">
                        <el-option  v-for="item in reasonList"  :key="item.value" :label="item.value" :value="item.code"></el-option>
                        <el-option   label="其他" value="-1"></el-option>
                    </el-select>
             </el-form-item>
              <el-form-item v-if="ruleForm.enEntryCode==-1"  label="其他原因" prop="otherReason">
                   <el-input v-model.trim="ruleForm.otherReason"  placeholder="请输入其他原因" :maxlength="50"></el-input>
             </el-form-item>
             <el-form-item label="联系方式"  prop="contactInfo">
                     <el-input v-model.trim="ruleForm.contactInfo"  placeholder="请输入联系方式" :maxlength="50"></el-input>
             </el-form-item> -->
              <el-form-item v-if="isShowFiled('1005')"  label="家访效果" prop="visitEffect">
                   <el-input  type="textarea" :rows="3" v-model.trim="ruleForm.visitEffect"  placeholder="请输入家访效果" :maxlength="200"></el-input>
             </el-form-item>
             <el-form-item v-if="isShowFiled('1007')"  label="家长意见">
                   <el-input  type="textarea" :rows="3" v-model.trim="ruleForm.parentOpinion"  placeholder="请输入家长意见" :maxlength="200"></el-input>
             </el-form-item>
             <el-form-item v-if="isShowFiled('1006')" class="is-required"  label="家访图片">
                   <uploader  pathPrefix="jiafang" module="jiafang" multiple
                              moduleCode="20210406" photoUrl="picUrl"  v-model="ruleForm.visitPics"
                              :extList="['jpeg', 'jpg', 'bmp', 'gif', 'png']"  showMode="image" showResult="image" :lineList="false"></uploader>                
             </el-form-item>
             <el-form-item v-if="isShowFiled('1008')" class="is-required"  label="家访表图片">
                  <uploader  pathPrefix="jiafang" module="jiafang" multiple
                              moduleCode="20210406"  v-model="ruleForm.visitTablePics"
                              :extList="['jpeg', 'jpg', 'bmp', 'gif', 'png']" 
                               showMode="image" showResult="image" :lineList="false"></uploader>        
             </el-form-item>
             
            
      </el-form>
     </div>
</div> 
</template>
<script>
import mixin from "@/mixins/windowResize";
import moment from "moment";
import AddressBook from "@/components/AddressBook/indexExpand";
import { findSchoolDicsByCodeStructure } from '@/api/common/common'
import { listValue,addHomeVisitRecord,getHomeVisitInit,getHomeVisitRecord,updateHomeVisitRecord} from "@/api/homeVisit";
import Uploader from '@/components/Uploader/WebUploader';
import Ueditor from "@/components/Ueditor";
export default {
  components: { AddressBook, Ueditor,Uploader },
  data() {
    return {
      stuConfigData: {
          title: '请选择学生',
          SingleChose: true,
          depart: {target: 'user', departType: 's', userTypes: '2', notCheckSchool: true},
          group: false
        },
      stuAddressData: { departJson: [], groupJson: [], userJson: [] },
       ConfigData: {
          title: '请选择老师',
          SingleChose: true,
          depart: {target: 'user', departType: 't', userTypes: '1', notCheckSchool: true},
          group: false
        },
       AddressData: { departJson: [], groupJson: [], userJson: [] },
      ruleForm: {
        addType:2,//	创建方式1 全部家访 2 自主家访	number	
        stuId:'',//	学生ID	number
        visitTeacher:'',//	家访教师	string
        receiptState:2,//	回执状态 1未回执(未上报) 2已回执(已上报)	number	
        visitState:2,//	家访状态 1未家访 2已家访	number	
        visitTime:'',//	家访时间	string	
        visitSite:'',//	家访地点	string
        visitContent:[],//	家访内容JSON	string
        otherContent:"",//自加的
        otherReason:"",//自加的
        visitType:'',//	家访方式	string	
        visitTypeId:'',//	家访方式code	string	
        visitTypeSort:'',//	家访方式排序号	number
        homeAddress:'',//	家庭住址	string
        contactInfo:'',//	联系方式	string
        enEntryCode:"",
        enEntryReason:"",
        entryTimeId:'',//	入户时间ID	number	       	
        parentOpinion:'',//	家长意见	string	        	
        visitEffect:'',//	家访效果	string	
        visitPics:[],//	家访照片	string	      
        visitTablePics:[],//	家访表照片	string	       
      },
      id: this.$route.query.id,
      rules: {
         visitTime: [
          { required: true, message: "请选择家访时间", trigger: "change" }
        ],
        contactInfo:[
          { required: true, message: "请输入联系方式", trigger: "blur" }
        ],
        visitEffect:[
          { required: true, message: "请输入家访效果", trigger: "blur" }
        ],
        enEntryCode: [
          { required: true, message: "请选择不能入户原因", trigger: "change" }
        ],
        otherReason:[
          { required: true, message: "请输入其他不能入户原因", trigger: "blur" }
        ],
        entryTimeId: [
          { required: true, message: "请选择入户时间", trigger: "change" }
        ],
        visitTypeId: [
          { required: true, message: "请选择家访方式", trigger: "change" }
        ],
        homeAddress:[
          { required: true, message: "请输入家庭住址", trigger: "blur" }
        ],
        visitSite: [
          { required: true, message: "请输入地点名称", trigger: "blur" }
        ],
        otherContent:[
          { required: true, message: "请输入其他内容", trigger: "blur" }
        ],
        visitContent: [
          {
            type: "array",
            required: true,
            message: "请至少选择一个家访内容",
            trigger: "change"
          }
        ],
        
      },
      visitFields:'',
      contentList:[],
      unitlistone:[],
      reasonList:[]
    };
  },
  mixins: [mixin],
  created() {
      if(this.id){
        getHomeVisitRecord(this.$route.query.id)
        .then(res => res.data)
        .then(data => {
          let mydata = data.data;
          let visitContent=[]
          mydata.visitContent=JSON.parse(mydata.visitContent)
          mydata.visitTablePics=JSON.parse(mydata.visitTablePics)
          mydata.visitPics=JSON.parse(mydata.visitPics)
          for(let i=0;i<mydata.visitContent.length;i++){
              visitContent.push(mydata.visitContent[i].code)
              if(mydata.visitContent[i].code==-1||mydata.visitContent[i].code=='-1'){
                mydata.otherContent=mydata.visitContent[i].value
              }
          }
           mydata.visitContent=visitContent
           
          this.ruleForm = mydata;
        });
      }
      findSchoolDicsByCodeStructure({
          dicCode: 'enableEntryReason'
        }).then((res) => {
          const data = res.data.data;
          if (res.data.code === 200) {
            this.reasonList = data
          }
        })
    listValue("homeVisitType")
        .then(res => res.data)
        .then(data => {
          this.unitlistone = data.data.dataList;
        });
     findSchoolDicsByCodeStructure({
                    dicCode: 'homeVisityContent'
                }).then((res) => {
                    const data = res.data.data;
                    if (res.data.code === 200) {
                        this.contentList = data
                    }
                })
    getHomeVisitInit().then(res => res.data).then(data => {
            if(data.result&&data.data) {
                this.visitFields=data.data.visitFields
            }
            }).catch(() => {})
  },
  methods: {
    isShowFiled(num) {
        return this.visitFields.indexOf(num) > -1;
    },
    isShowOtherText(){
      return JSON.stringify(this.ruleForm.visitContent).indexOf('-1') > -1
    },
    getContentList() {
                let newList = [];
                this.contentList.forEach((item) => {
                    if (JSON.stringify(this.ruleForm.visitContent).indexOf(item.code) > -1) {
                        newList.push(item);
                    }
                });
                if (JSON.stringify(this.ruleForm.visitContent).indexOf('-1') > -1 || JSON.stringify(this.ruleForm.visitContent).indexOf(-1) > -1) {
                    newList.push({
                        value: this.ruleForm.otherContent || '其他',
                        code: '-1'
                    });
                }
                return newList.length ? newList : [];
    },
    addHomeVisitRecord() {  
        if(this.stuAddressData.userJson.length==0&&!this.id){
             this.$message({
                message: '请选择学生！',
                type: 'warning'
              });
            return;
        }
        if(this.AddressData.userJson.length==0&&!this.id){
             this.$message({
                message: '请选择家访老师！',
                type: 'warning'
              });
            return;
        }
        if(this.ruleForm.visitPics.length==0&&this.isShowFiled('1006')){
             this.$message({
                message: '请上传家访照片！',
                type: 'warning'
              });
            return;
        }
        if(this.ruleForm.visitTablePics.length==0&&this.isShowFiled('1008')){
             this.$message({
                message: '请上传家访表照片！',
                type: 'warning'
              });
            return;
        }
      this.$refs.ruleForm.validate(valid => {     
          if(this.ruleForm.visitTime){
            this.ruleForm.visitTime=moment(this.ruleForm.visitTime).format('YYYY-MM-DD')
          }
          if(this.ruleForm.entryTimeId){
            this.ruleForm.entryTimeId=moment(this.ruleForm.entryTimeId).format('YYYY-MM-DD HH:mm')
          }
          let enEntryReason=''
          let entryTimeId=""
          if(this.ruleForm.visitType!='1001'){
              if(this.ruleForm.enEntryCode=='-1'){
                  enEntryReason=this.ruleForm.otherReason
              }else{
                  for(let i=0;i<this.reasonList.length;i++){
                      if(this.ruleForm.enEntryCode==this.reasonList[i].code){
                          enEntryReason=this.reasonList[i].value
                      }
                  }
              }
          }else{
              entryTimeId=this.ruleForm.entryTimeId
          }
          let visitType=""
          let visitTypeSort=""
          for(let i=0;i<this.unitlistone.length;i++){
              if(this.unitlistone[i].code==this.ruleForm.visitTypeId){
                 visitType=this.unitlistone[i].value
                 visitTypeSort=this.unitlistone[i].sort
              }
          }
          let query={
                addType:this.ruleForm.addType,//	创建方式1 全部家访 2 自主家访	number	
                contactInfo:this.ruleForm.contactInfo,//	联系方式	string	
                enEntryCode:this.ruleForm.enEntryCode,//	不能入户原因字典code	string	
                enEntryReason:enEntryReason,//	不能入户原因	string	
                entryTime:entryTimeId,//	入户时间	string	
                homeAddress:this.ruleForm.homeAddress,//	家庭住址	string	
                parentOpinion:this.ruleForm.parentOpinion,//	家长意见	string	
                receiptState:this.ruleForm.receiptState,//	回执状态 1未回执(未上报) 2已回执(已上报)	number	
                visitPics:this.ruleForm.visitPics,//	家访照片	string	
                visitSite:this.ruleForm.visitSite,//	家访地点	string	
                visitState:this.ruleForm.visitState,//	家访状态 1未家访 2已家访	number	
                visitTablePics:this.ruleForm.visitTablePics,//	家访表照片	string	
                visitTime:this.ruleForm.visitTime,//	家访时间	string	
                visitEffect:this.ruleForm.visitEffect,//	家访效果	string
                stuId:this.id?this.ruleForm.stuId:this.stuAddressData.userJson[0].id,//	学生ID	number	
                visitTeacher:this.id?this.ruleForm.visitTeacher:this.AddressData.userJson[0].name,//	学	家访教师	string	
                visitContent:this.getContentList(),//	家访内容JSON	string	
                visitType:visitType||'入户',	//家访方式	string	
                visitTypeId:this.ruleForm.visitTypeId||'1001',	//家访方式code	string	
                visitTypeSort:visitTypeSort||'1',		
          }  
           if(valid) {
              if(this.id){
            query.id=this.id
             updateHomeVisitRecord(query).then(res => res.data).then(data => {
                                    if(data.result) {
                                        this.$message({
                                            message: '编辑成功！',
                                            type: 'success',
                                            duration: 1000
                                        });
                                        this.$router.back();
                }
            }).catch(() => {})
          }else{
               addHomeVisitRecord(query).then(res => res.data).then(data => {
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

           }
         
         
      })
    }
  }
};
</script>
<style lang="scss" scoped>
.homeVisitadd {
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
      .ul{
        .li{
          i{
            font-size: 22px;
            margin: 5px;
            color: #F56C6C;
          }
        }
      }
    }
  }
}
</style>