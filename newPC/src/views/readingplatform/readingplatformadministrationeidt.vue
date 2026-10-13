<template>
    <div class="readingplatformbasicsettings ">
        <div class="top">
          <el-button @click="$router.back()" type="default" size="medium">返回</el-button>
          <el-button type="primary" size="medium" @click="insertOrEditReadManageTeachers()">保存</el-button>
        </div>
        <div class="subject" :style="`height: ${nobottommaxH}px;`">
            <div class="body">
              <el-form :model="ruleForm"  ref="ruleForm" label-width="140px" class="demo-ruleForm">
                <el-form-item label="管理员 "> 
                    {{ruleForm.userName}}
                </el-form-item>
                 <el-form-item label="管理班级">
                     <el-checkbox-group v-model="checkList">
                    <el-checkbox :label="item.id" v-for="(item,index) in classlist" :key="index">{{item.name}}</el-checkbox>
                </el-checkbox-group>
                 </el-form-item>
                </el-form>
            </div>
         </div>   			
        
    </div>
</template>
<script>
import {insertOrEditReadManageTeacher,querySchoolClass,getManageTeacherById} from "@/api/readingplatform";
import mixin from "@/mixins/windowResize";
export default {
  data() {
    return {
      ruleForm: {
        classList:"",//	管理班级	array<object>
        id:this.$route.query.id,//	id,新增时传0	number	
        userAvatar:"",//	用户头像	string	
        userId:"",//	用户id	number	
        userMobile:"",//	用户手机	string	
        userName:"",//	用户名	string	        
      },
      classlist:[],
      checkList:[],
    };
  },
  created() {
  querySchoolClass().then(res=>res.data)
      .then(data=>{
        this.classlist=data.data;       
      })
       getManageTeacherById(this.$route.query.id).then(res=>res.data)
      .then(data=>{
        let mydata=data.data;
         this.ruleForm.userAvatar=mydata.userAvatar;
            this.ruleForm.userId=mydata.userId;
            this.ruleForm.userMobile=mydata.userMobile;
            this.ruleForm.userName=mydata.userName; 
            for(let i=0;i<mydata.classList.length;i++){
                this.checkList.push(mydata.classList[i].classId)
            }   
      })
  },
  mixins: [mixin],
  methods: {
    //保存
    insertOrEditReadManageTeachers(){
           if(!this.checkList.length){
                this.$message({type: 'error', message:'请选择管理班级!'});
                return;
            };
            let list=[];
            for(let i=0;i<this.checkList.length;i++){
                for(let j=0;j<this.classlist.length;j++){
                    if(this.checkList[i]==this.classlist[j].id){
                        list.push({
                            classId:this.classlist[j].id,
                            className:this.classlist[j].name
                        })
                    }
                }
            }
            this.ruleForm.classList=list ;
           
             insertOrEditReadManageTeacher(this.ruleForm)
              .then(res => {
                if (res.data.code === 200) {
                  this.$message({
                    type: "success",
                    message: "保存成功!"
                  });
                  this.$router.back();
                }else{
                  this.$message({type: 'error', message:res.data.msg});
                  return;
                }             
              }).catch();
    },
   
  }
};
</script>

<style lang="scss" scoped>
.readingplatformbasicsettings {
  padding:12px;
  .top {
    border-bottom: 1px solid #e7eaec;
    padding-bottom: 10px;
  }
  .subject {
    padding-top: 20px;
    overflow: auto;
    .body {
      width: 810px;
      margin: 0 auto;
     
    }
  }
}
</style>
