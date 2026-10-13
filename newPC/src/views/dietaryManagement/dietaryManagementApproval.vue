<template>
<div class="dietaryManagementApproval"  >
    <div class="top"> 
        <el-button @click="$router.back()" type="default" size="medium">返回</el-button> 
        <el-button type="primary"  size="medium" @click="saveAuditUserSets()">保存</el-button>     
    </div>
    <div class="subject" :style="`height: ${nobottommaxH}px;`">
       <div class="ul">
         <div class="li">
           <div class="name">推送设置</div>
             <el-checkbox v-model="needPushTeacher">推送老师</el-checkbox>
         </div>
         <div class="li">
           <div class="name">审核设置</div>
             <el-checkbox v-model="needAudit">需要审核</el-checkbox>
         </div>
         <div class="li" v-if="needAudit">
           <div class="name"><span>*</span>审核人</div>
            <address-book v-model="auditUserStr" :config="configauditUserStr" ref="address"></address-book>
         </div>
       </div>
    </div>    
</div> 
</template>
<script>
import {menuAuditSet,saveAuditUserSet} from "@/api/dietaryManagement";
import AddressBook from '@/components/AddressBook/indexExpand';
import mixin from "@/mixins/windowResize";
import {mapGetters} from 'vuex';
export default {
  components: {
            AddressBook
        },
  data() {
    return {
     needAudit:false,
     needPushTeacher:false,
     configauditUserStr: {title: '请选择审核人', depart: {target: 'user', departType: 't', userTypes: '1'}},
     auditUserStr:{}
    };
  },
  mixins: [mixin],
  computed: {
     ...mapGetters(['schoolInfo'])
  },
  created() {
     this.menuAuditSets()
  },
  methods: {
   //获取详情
   menuAuditSets(){
      menuAuditSet().then(res => res.data).then(data => {
          if(data.code==200&&data.data){
            let mydata=data.data;
            if(mydata.needAudit==1){
              this.needAudit=true;
            };
            if(mydata.needPushTeacher==1){
              this.needPushTeacher=true;
            };
            let list=[];
            for(let i=0;i<mydata.auditUserList.length;i++){
               list.push({
                 id:mydata.auditUserList[i].userId,
                 name:mydata.auditUserList[i].userName,
                 avatar:mydata.auditUserList[i].userAvatar,
                 dataType:"user",
                 mobile:mydata.auditUserList[i].userMobile,
               })
            };
            this.auditUserStr = {
                    departJson: [],
                    userJson: list,
                    groupJson: []
                };
          }     
       })
   },
   //保存
   saveAuditUserSets(){
     let obj={
       auditUserStr:[],
       needAudit:this.needAudit?1:0,
       needPushTeacher:this.needPushTeacher?1:0,
       schoolId:this.schoolInfo.id
     };
     if(this.needAudit&&this.auditUserStr.userJson.length==0){
          this.$message({type: "error",message: "请选择审核人！"});
          return;  
     };
     let list=[]
     if(this.needAudit){
       for(let i=0;i<this.auditUserStr.userJson.length;i++){
         list.push({
            userAvatar:this.auditUserStr.userJson[i].avatar,//	用户头像	string	
            userId:this.auditUserStr.userJson[i].id,//	用户id	number	
            userMobile:this.auditUserStr.userJson[i].mobile,//	用户手机	string	
            userName:this.auditUserStr.userJson[i].name,//	用户名	string	
         })
       }
     };
     obj.auditUserStr=JSON.stringify(list);
     saveAuditUserSet(obj).then(res => res.data).then(data => {
                        if (data.code === 200) {
                            this.$message({
                                type: 'success',
                                message: '修改成功！'
                            });
                           this.$router.back();
                        } else {
                            this.$message.error(data.msg);
                        }
                    })
   }
  }
};
</script>
<style lang="scss" scoped>
.dietaryManagementApproval {
   padding:12px;
  .top {
    border-bottom: 1px solid #e7eaec;
    padding-bottom: 10px;
  }
  .subject {
    padding-top: 10px;
    overflow: auto;
    .ul{
      width: 810px;
      margin: 0 auto;
      .li{
        position: relative;
        padding: 15px 0 0 150px;
        height: 50px;        
        .name{
          position: absolute;
          top:15px;
          width: 140px;
          left:0;
          line-height: 20px;
          font-size: 14px;
          color: #606266;
          text-align: right;
          span{
            color: #f56c6c;
            margin-right: 4px;
          }
        }
      }
    }
  }
   
}
</style>