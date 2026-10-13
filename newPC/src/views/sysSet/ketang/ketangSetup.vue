<template>
    <div class="ketangSetup">
        <div class="ketangSetup-header">
            <el-button @click="$router.back()" type="default" size="medium">返回</el-button>
            <el-button type="primary"   @click="Preservation('query')" size="medium">保存</el-button>
            <el-button type="primary" @click="ketangAssessment()" size="medium">评价项管理</el-button>
            <el-button type="primary" v-if="num==2" @click="ketanglist()" size="medium">学科评价项</el-button>
            <el-button type="primary"  @click="copywritingSettings()" size="medium">学生周报文案设置</el-button>
            <!-- <a href="https://cdnfile-10043692.file.myqcloud.com/app/%E5%BE%AE%E6%A0%A1%2B%E8%AF%BE%E5%A0%82%E8%AF%84%E4%BB%B7.exe" target="_blank" download="examName">
               <el-button type="primary" size="medium">下载32位客户端</el-button>
            </a> -->
            
            <!-- <a href="https://cdnfile-10043692.file.myqcloud.com/app/%E5%BE%AE%E6%A0%A1%2B%E8%AF%BE%E5%A0%82%E8%AF%84%E4%BB%B7V1.1%2064X.exe" target="_blank" download="examName"> -->
            <a href="https://cdnfile-10043692.file.myqcloud.com/app/%E5%BE%AE%E6%A0%A1%2B%E8%AF%BE%E5%A0%82%E8%AF%84%E4%BB%B7%E5%AE%89%E8%A3%85%E5%8C%85_X64%28V1.005%29.exe" target="_blank" download="examName"> 
               <el-button type="primary" size="medium">客户端下载</el-button>
            </a>
        </div>
        <div class="ketangSetup-main" :style="{height: `${containerHeight}px`}">
           <el-form :model="query" :rules="rules" ref="query" label-width="140px" class="demo-ruleForm">
                <el-form-item label="初始分数" prop="initScore">
                    <el-input-number  v-model="query.initScore" :min='0' :max='999' controls-position="right"></el-input-number>                   
                </el-form-item>
                  <el-form-item label="每天分数上限" prop="dayMaxScord">
                    <el-input-number v-model="query.dayMaxScord" :min='1' :max='999' controls-position="right"></el-input-number>                   
                </el-form-item>
                 <el-form-item label="考评项设置方式" >
                    <el-radio v-model="query.isCurr" label="1">所有学科相同</el-radio><el-radio v-model="query.isCurr" label="2">按学科设置</el-radio>                   
                </el-form-item>
                 <el-form-item label="按分组评价" >
                    <el-radio v-model="query.behGroupType" label="1">公共分组</el-radio>
                    <el-radio v-model="query.behGroupType" label="2">学科老师分组</el-radio>                   
                </el-form-item>
                <el-form-item label='其他评价项' >
                        <el-checkbox v-model="query.eleTypeMark">表扬增加其他</el-checkbox>   
                        <el-checkbox v-model="query.eleTypeMarkLess">批评增加其他</el-checkbox>              
                </el-form-item>    
                 <el-form-item label="提醒设置" >
                        <el-checkbox v-model="query.sendParentAdd" >表扬推送家长</el-checkbox> 
                        <el-checkbox v-model="query.sendParentLess">批评推送家长</el-checkbox>  
                        <el-checkbox v-model="query.sendRemindTh">每天08：00提醒老师</el-checkbox>               
                </el-form-item>               
                <el-form-item label="评价方式" >
                        <el-checkbox v-model="query.isTypeShow" :true-label="2" :false-label="1" disabled>按评价项</el-checkbox> 
                        <el-checkbox v-model="query.isStuNoShow" :true-label="2" :false-label="1">按学号</el-checkbox>  
                        <el-checkbox v-model="query.isSetShow" :true-label="2" :false-label="1">按座位</el-checkbox>  
                        <el-checkbox v-model="query.isGroupShow" :true-label="2" :false-label="1">按分组</el-checkbox>  
                        <el-checkbox v-model="query.isAttanceShow" :true-label="2" :false-label="1">考勤</el-checkbox>           
                </el-form-item>
                 <el-form-item label="报告推送设置" >
                        <el-checkbox v-model="query.isSendParent">给家长推送周报</el-checkbox> 
                        <el-checkbox v-model="query.isSendTh">给老师推送周报</el-checkbox>
                        <el-checkbox v-model="query.isSendManger">给管理人员推送周报</el-checkbox> 
                        <el-checkbox v-model="query.isClassHeader">给班主任推送周报</el-checkbox>                 
                </el-form-item>
                <el-form-item label="管理人员" prop="workStuJson" v-if="query.isSendManger">
                    <address-book v-model="query.workStuJson" :config="managerConfigData"></address-book>                  
                </el-form-item>
            
            </el-form>
           
        </div>
    </div>
</template>

<script>
    import {getSchoolBehaviorInstallNew,addSchoolBehaviorInstall,updateSchoolBehaviorInstall} from  '@/api/ketang';
    import AddressBook from '@/components/AddressBook/indexExpand';
    export default {
        name: "ketangSetup",
        data() {
             const workStuJsonValidator = (rule, value, callback) => {                               
                if (this.query.isSendManger&&(JSON.stringify(this.query.workStuJson) === '{}' || this.query.workStuJson.userJson.length === 0)) {
                    callback(new Error('请选择管理人员'));
                }else {
                    callback();
                }
             };
            return {
              containerHeight:'',
              managerConfigData: {title: '请选择管理人员', depart: {target: 'user', departType: 't', userTypes: '1'}},
              query: {  
                    initScore:'',//初始分数 
                    dayMaxScord:'',//每日上限 
                    sendParentAdd:false,
                    sendParentLess:false,
                    isSendManger:false,
                    isSendParent:false,
                    isSendTh:false,
                    isCurr:'1',
                    reportDepartJson:[],//管理员周报部门 json字符串
                    reportGroupJson:[],//管理员周报群组 json字符串
                    reportUserJson:[],//管理员周报用户 json字符串
                    workStuJson: {},
                    eleTypeMark:false,
                    eleTypeMarkLess:false,
                    id:'',
                    sendRemindTh:false,
                    isClassHeader:false,
                    behGroupType:'1',
                    isTypeShow:2,
                    isStuNoShow:1,
                    isSetShow:1,
                    isGroupShow:1,
                    isAttanceShow:1
                },
              rules: {                   
                    initScore: [{
                        required: true,
                        message: '请输入初始分数',
                        trigger: 'change'
                    }],
                    dayMaxScord:[{
                        required: true,
                        message: '请输入每天分数上限',
                        trigger: 'change'
                    }],
                    workStuJson: [{
                        required: true,
                        validator: workStuJsonValidator
                    }]
                  
                },
            }
        },
         components: {
            AddressBook
        },
        created() {
          this.getSchoolBehaviorInstallNew()
        },
        mounted() {
            this.containerHeight = window.innerHeight - 200;
        },
        methods: {
            getSchoolBehaviorInstallNew(){
                getSchoolBehaviorInstallNew()
                .then(res => res.data)
                .then(data => {
                   if(data.data!=null){
                        if(data.data.reportUserJson!=''){
                      this.query.workStuJson.userJson=JSON.parse(data.data.reportUserJson);
                    }      
                    this.query.isTypeShow=data.data.isTypeShow;   
                    this.query.isStuNoShow=data.data.isStuNoShow;        
                    this.query.isSetShow=data.data.isSetShow; 
                    this.query.isGroupShow=data.data.isGroupShow; 
                    this.query.isAttanceShow=data.data.isAttanceShow; 
                   this.query.dayMaxScord=data.data.dayMaxScord;
                   this.query.initScore=data.data.initScore;
                   this.query.id=data.data.id;     
                   this.query.behGroupType=data.data.behGroupType+'';               
                   this.query.isCurr=data.data.isCurr+'';
                   this.num=data.data.isCurr;
                   if(data.data.sendParentAdd==1){
                      this.query.sendParentAdd=true;
                   };
                    if(data.data.sendParentLess==1){
                      this.query.sendParentLess=true;
                   };
                   if(data.data.sendRemindTh==1){
                       this.query.sendRemindTh=true;
                   }
                    if(data.data.isSendManger==2){
                      this.query.isSendManger=true;
                   };
                    if(data.data.isSendTh==2){
                      this.query.isSendTh=true;
                   };
                    if(data.data.isSendParent==2){
                      this.query.isSendParent=true;
                   };   
                    if(data.data.isClassHeader==2){
                      this.query.isClassHeader=true;
                   };                 
                   if(data.data.eleTypeMark==2){
                       this.query.eleTypeMark=true;
                   }
                   if(data.data.eleTypeMarkLess==2){
                       this.query.eleTypeMarkLess=true;
                   }

                   }                   
                });

            },
            //保存
            Preservation(formName) {              
                this.$refs[formName].validate((valid) => {
                if (valid) {
                    if(!this.query.isSendManger){
                       this.query.workStuJson.userJson=[]
                    };
                     let obj={
                            initScore:this.query.initScore,//初始分数 
                            dayMaxScord:this.query.dayMaxScord,//每日上限 
                            behGroupType:this.query.behGroupType,
                            sendParentAdd:2,
                            sendParentLess:2,
                            sendRemindTh:2,
                            isSendManger:1,
                            isSendParent:1,
                            isClassHeader:1,
                            isSendTh:1,
                            eleTypeMark:1,
                            eleTypeMarkLess:1,
                            isCurr:this.query.isCurr,
                            reportDepartJson:[],//管理员周报部门 json字符串
                            reportGroupJson:[],//管理员周报群组 json字符串
                            reportUserJson:this.query.workStuJson.userJson,//管理员周报用户 json字符串
                            isTypeShow:this.query.isTypeShow,
                            isStuNoShow:this.query.isStuNoShow,
                            isSetShow:this.query.isSetShow,
                            isGroupShow:this.query.isGroupShow,
                            isAttanceShow:this.query.isAttanceShow,
                        };              
                        if(this.query.sendParentAdd==true){
                            obj.sendParentAdd=1;
                        };
                        if(this.query.sendParentLess==true){
                            obj.sendParentLess=1;
                        };
                        if(this.query.sendRemindTh){
                            obj.sendRemindTh=1
                        }
                         if(this.query.eleTypeMark==true){
                            obj.eleTypeMark=2;
                        };
                        if(this.query.eleTypeMarkLess==true){
                            obj.eleTypeMarkLess=2;
                        };
                        if(this.query.isSendManger==true){
                            obj.isSendManger=2;
                        };
                        if(this.query.isSendTh==true){
                           obj.isSendTh=2;
                        };
                        if(this.query.isSendParent==true){
                            obj.isSendParent=2;
                        };  
                        if(this.query.isClassHeader==true){
                            obj.isClassHeader=2;
                        };                       
                        if(this.query.id==''){
                        //新增
                          addSchoolBehaviorInstall(obj).then(res => {
                            if (res.data.code === 200) {
                                this.$message({
                                    type: 'success',
                                    message:'新增成功！'
                                });
                                this.num=obj.isCurr;
                                this.getSchoolBehaviorInstallNew()
                            }
                          }).catch(function () {})
                        }else{
                          obj.id=this.query.id;
                          //编辑
                           updateSchoolBehaviorInstall(obj).then(res => {
                            if (res.data.code === 200) {
                                this.$message({
                                    type: 'success',
                                    message:'编辑成功！'
                                });
                                this.num=obj.isCurr;
                                this.getSchoolBehaviorInstallNew()
                            }
                          }).catch(function () {})
                        }
                      
                 } 
                });
            },
             //考核项设置
            ketangAssessment(){
                this.$router.push({
                        path: "ketangAssessment",  
                        query: { isCurr:1 }    
                });
            },
            ketanglist(){
                this.$router.push({
                        path: "ketanglist",  
                        query: { isCurr:1 }    
                });
            },
            copywritingSettings(){
                this.$router.push({
                        path: "copywritingSettings",  
                        query: { moduleType:2 }    
                });
            },
        }
    }
</script>

<style lang="scss" scoped>
  .ketangSetup{
    padding:12px;
}
.ketangSetup-main {
    border-top: 1px #eee solid;
    margin-top: 10px;
    overflow: auto;
    .demo-ruleForm{
        width: 810px;
        margin: 20px auto;
    }
    .el-input{
    width: 100%;
    }
}
</style>
