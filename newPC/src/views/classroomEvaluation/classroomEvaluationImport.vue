<template>
  <div class="classroomEvaluationImport" >
    <div class="header">
          <el-button  @click="$router.back()" type="default" size="medium">返回</el-button>
          <a :href="downLoadHref" target="_blank" download="examName"><el-button type="primary" size="medium">下载模版</el-button></a>   
          <el-upload class="upload-import" :disabled="(classlist.length==0)||(Festivalslist.length==0)||(Courslist.length==0)||(JSON.stringify(ruleForm.workStuJson) === '{}' ||ruleForm.workStuJson.userJson.length == 0)" :action="uploadPath" :data="uploadData" :show-file-list='false' accept=".xls,.xlsx" :before-upload="beforeAvatarUpload" :on-success="handleAvatarSuccess">
                <el-button type="primary" disabled v-if="(classlist.length==0)||(Festivalslist.length==0)||(Courslist.length==0)||(JSON.stringify(ruleForm.workStuJson) === '{}' ||ruleForm.workStuJson.userJson.length == 0)">信息不全无法导入</el-button>
                <el-button type="primary" size="medium" v-else>导入</el-button>
          </el-upload>
          
    </div>
    <div class="schoolWrap scrollStyle" :style="`height: ${nobottommaxH}px;`">   
       <div class="body">
         <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="140px" class="demo-ruleForm"  :height="innerBodyH"  v-loading="listLoading">
              <el-form-item label="评价日期" required>
                  <el-form-item prop="behDate">
                    <el-date-picker type="date" :clearable="false" :editable="false" placeholder="选择评价日期" v-model="ruleForm.behDate" style="width:100%;"></el-date-picker>
                  </el-form-item>
              </el-form-item>
              <el-form-item label="评价班级" prop="classId">
                <el-select v-model="ruleForm.classId" placeholder="请选择评价班级" @change="classchange()">
                  <el-option  v-for="item in classlist" :key="item.id" :label="item.name"  :value="item.id"></el-option>
                </el-select>
              </el-form-item>
            <el-form-item label="评价课程" prop="curriculumId">
                <el-select v-model="ruleForm.curriculumId" placeholder="请选择评价课程" @change="Courschange()">
                  <el-option v-for="item in Courslist" :key="item.id" :label="item.name"  :value="item.id" ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="评价老师" prop="workStuJson" >
                                <address-book v-model="ruleForm.workStuJson" :config="managerConfigData"></address-book>                  
              </el-form-item>
              <el-form-item label="评价节次" prop="sectionNo">
                <el-select v-model="ruleForm.sectionNo" placeholder="请选择评价节次">
                  <el-option v-for="item in Festivalslist" :key="item.id" :label="item.alias"  :value="item.id"></el-option>
                </el-select>
              </el-form-item>
            </el-form>
         
         </div>  
    </div>
     <el-dialog
  title="导入提示"
  :visible.sync="dialogVisible"
  size="tiny"
  >
  <span v-html="dataname"></span>
  <span slot="footer" class="dialog-footer">   
    <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
  </span>
</el-dialog>
  </div>
</template>
<script>
import mixins from '@/mixins/windowResize';
import {listTimeByWeekDayByDate,getSchoolBehaviorStuListInfoType,classBehEvalCurrBehTypeStuScore,getsectionNoList,querySchoolClass,queryCourseByClassIds,queryTeacherByClassIdAndCourseId} from '@/api/classroomEvaluation';
import AddressBook from '@/components/AddressBook/indexExpand';
export default {
  data(){
      const workStuJsonValidator = (rule, value, callback) => {                               
                if ((JSON.stringify(this.ruleForm.workStuJson) === '{}' || this.ruleForm.workStuJson.userJson.length === 0)) {
                    callback(new Error('请选择评价老师'));
                }else {
                    callback();
                }
             };
    return{
       ruleForm: {
         behDate:this.$moment().format('YYYY-MM-DD'),	
         classId:'',//	班级id	number	
         createUserId:'',//老师id	number	
         createUserName:'',//老师姓名	string	
         curriculumId:'',//科目id	number	
         curriculumName:'',//科目名称	string	
         sectionNo:'',//	节次
         workStuJson: {}
        },
        rules: {         
          classId: [ { required: true, message: '请选择评价班级', trigger: 'change' }],
          curriculumId: [{ required: true, message: '请选择评价课程', trigger: 'change' }],
          sectionNo: [{ required: true, message: '请选择评价节次', trigger: 'change' }],
          behDate: [ { type: 'date', required: true, message: '请选择评价日期', trigger: 'change' }],
          workStuJson: [{ required: true,validator: workStuJsonValidator}]        
        },
        managerConfigData: {title: '请选择评价老师', depart: {target: 'user', departType: 't', userTypes: '1'},SingleChose: true},        
        downLoadHref: "https://cdnfile-10043692.file.myqcloud.com/admin/images/systemSetup/behavior_stu_list.xls", //下载模板
        uploadPath: global.homeworkfetch+ "structure/schoolBehavior/uploadBehaviorExcel",//导入
        uploadData: {  
          behDate:'',	
          classId:'',//	班级id	number	
          createUserId:'',//老师id	number	
          createUserName:'',//老师姓名	string	
          curriculumId:'',//科目id	number	
          curriculumName:'',//科目名称	string	
          isMorning:'',//	是否上午	
          sectionNo:'',//	节次 
          token: this.$store.getters.token
        },//导入传参
        Festivalslist:[],
        classlist:[],
        Courslist:[],
        listLoading: false,
         dialogVisible:false,
         dataname:''
    }
  },
   components: {
            AddressBook
        },
  created(){   
    //获取节次
  listTimeByWeekDayByDate({
        isBeh:2,
        customize:10,
        secrchDate:moment().format("YYYY-MM-DD")
      }).then(res=>res.data)
      .then(data=>{
        if(data.code===200){
          this.Festivalslist=data.data
          if(this.Festivalslist.length>0){
             this.ruleForm.sectionNo=this.Festivalslist[0].id
          }
          
        } 
      });
      //获取班级
      querySchoolClass().then(res=>res.data)
      .then(data=>{
        this.classlist=data.data;
        if(data.data.length>0){
           this.ruleForm.classId=data.data[0].id;
           this.queryCourseByClassIdss();
        }else{
          this.ruleForm.classId='';
          this.ruleForm.curriculumId='';
          this.classlist=[];
          this.ruleForm.workStuJson={};
          this.Courslist=[]
        }

       
      })
  },
  mixins:[mixins],
  methods:{ 
     //导入
    handleAvatarSuccess(res) {
      if (!res.data.length || res.data.length == 0) {
        this.$message({
          message: "模版导入成功！",
          type: "success"
        });
        this.listLoading = false;
      } else {
       this.dataname=res.data;
      this.dialogVisible=true;
       this.listLoading = false;
      }
    },
    beforeAvatarUpload(file) {
     this.listLoading = true;
     this.ruleForm.behDate = this.$moment(this.ruleForm.behDate).format("YYYY-MM-DD"); //时间
     this.uploadData.behDate=this.ruleForm.behDate;
     this.uploadData.classId=this.ruleForm.classId;
     this.uploadData.createUserId= this.ruleForm.workStuJson.userJson[0].id;
     this.uploadData.createUserName=this.ruleForm.workStuJson.userJson[0].name;
     this.uploadData.curriculumId=this.ruleForm.curriculumId;
      for(let i=0;i<this.Festivalslist.length;i++){      
       if(this.ruleForm.sectionNo==this.Festivalslist[i].id){
         this.uploadData.isMorning=this.Festivalslist[i].type;
         this.uploadData.sectionNo=this.Festivalslist[i].nodeNum;
         this.uploadData.morningName=this.Festivalslist[i].alias;
         this.uploadData.nodeNumber=this.Festivalslist[i].nodeNumber;
       } 
     };
     for(let i=0;i<this.Courslist.length;i++){      
       if(this.ruleForm.curriculumId==this.Courslist[i].id){
          this.uploadData.curriculumName=this.Courslist[i].name;
       } 
     };
     let suffix = file.name.split(".")[file.name.split(".").length - 1];
      if (suffix !== "xls" && suffix !== "xlsx") {
        this.listLoading = false;
        this.$message.error("请上传后缀为.xls,.xlsx的模版文件!");
        return false;
      } else {
        
      }
    },
    //获取科目   
   queryCourseByClassIdss(){
      queryCourseByClassIds(this.ruleForm.classId).then(res=>res.data)
      .then(data=>{
        this.Courslist=data.data;
        if(data.data.length>0){
           this.ruleForm.curriculumId=data.data[0].id;
           this.queryTeacherByClassIdAndCourseIds();
        }else{
          this.ruleForm.curriculumId='';
          this.ruleForm.workStuJson={};
          this.Courslist=[]
        }
       
      })
   },
   //获取老师
   queryTeacherByClassIdAndCourseIds(){
     queryTeacherByClassIdAndCourseId(this.ruleForm.classId,this.ruleForm.curriculumId).then(res=>res.data)
      .then(data=>{
          this.ruleForm.workStuJson={};
          this.ruleForm.workStuJson.userJson=[
              {"name":data.data[0].name,"id":data.data[0].id,"avatar":data.data[0].avatar}
          ]
      })
   },
   //切换班级
   classchange(){
      this.queryCourseByClassIdss();
   },
   //切换科目
   Courschange(){
      this.queryTeacherByClassIdAndCourseIds();
   },
  }
}
</script>
<style lang="scss" scoped>
.classroomEvaluationImport{
  padding:12px;
  box-sizing: border-box;
  font-size:14px;  
  .header{
    padding-bottom:10px;
    border-bottom:1px solid  #e7eaec;   
  }
  .upload-import {
  display: inline-block;
}
.schoolWrap{
  padding:20px;
  overflow: auto;
  .body{
    width: 810px;
    margin: 0 auto;
  }
  .el-select {
    width: 100%;
}
}
}
</style>

