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
                    <address-book v-model="addressData" :config="configUserData" ref="address"></address-book>
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
import {insertOrEditReadManageTeacher,querySchoolClass} from "@/api/readingplatform";
import mixin from "@/mixins/windowResize";
import AddressBook from '@/components/AddressBook/indexExpand';
export default {
    components: {
            AddressBook
        },
  data() {
    return {
      ruleForm: {
        classList:"",//	管理班级	array<object>
        id:0,//	id,新增时传0	number	
        userAvatar:"",//	用户头像	string	
        userId:"",//	用户id	number	
        userMobile:"",//	用户手机	string	
        userName:"",//	用户名	string	        
      },
      classlist:[],
      checkList:[],
      addressData: {userJson:[]},
      configUserData: {
                    title: '管理员',
                    depart: {target: 'user', departType: 't', userTypes: '1'},
                    SingleChose: true
                },
    };
  },
  created() {
  querySchoolClass().then(res=>res.data)
      .then(data=>{
        this.classlist=data.data;       
      })
  },
  mixins: [mixin],
  methods: {
    //保存
    insertOrEditReadManageTeachers(){
        if(!this.addressData.userJson.length){
                this.$message({type: 'error', message:'请选择管理员!'});
                return;
            };
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
            this.ruleForm.userAvatar=this.addressData.userJson[0].avatar;
            this.ruleForm.userId=this.addressData.userJson[0].id;
            this.ruleForm.userMobile=this.addressData.userJson[0].mobile;
            this.ruleForm.userName=this.addressData.userJson[0].name;
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
