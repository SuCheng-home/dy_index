<template>
    <div class="app-container calendar-list-container">
        <backtool>
            <el-button type="primary" size="medium"  @click="addAndUpdateExtraWorkInit()">
                保存
            </el-button>
        </backtool>
        <div class="mainWrap" :style="`height:${nobottommaxH}px`">
            <el-form :model="ruleForm" ref="ruleForm" :rules="rules" label-width="140px" class="demo-ruleForm"   style="width:810px;margin:10px auto;">
                <el-form-item label="申请方式" class="is-required">
                    <el-radio-group  v-model="ruleForm.applyType">   
                        <el-radio :label="1">老师自己申请</el-radio>                    
                        <el-radio :label="2">部门主任申请</el-radio>                        
                        <!-- <el-radio :label="3">全部申请</el-radio> -->
                        <el-radio :label="4">加班申请员</el-radio>
                    </el-radio-group>
                </el-form-item>
                 <el-form-item label="审批方式" class="is-required">
                    <el-radio-group  v-model="ruleForm.onBatchType">   
                        <el-radio :label="1">角色审批</el-radio>                    
                        <el-radio :label="2">上级领导</el-radio>  
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="审批角色" class="is-required" v-if="ruleForm.onBatchType==1">
                    <el-radio-group  v-model="ruleForm.roleConstantId">   
                        <el-radio :label="100">加班申请审批人</el-radio>                    
                        <el-radio :label="198">分管领导</el-radio>  
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="是否按时长加审批">
                     <el-checkbox v-model="ruleForm.isTwBatch" :true-label="2" :false-label="1">是</el-checkbox>
                </el-form-item>
                 <el-form-item  label="触发条件"  v-if="ruleForm.isTwBatch==2" class="is-required">
                               <el-select v-model="ruleForm.twCondition">
                                   <el-option  label="大于" :value="1"></el-option>
                                   <el-option  label="大于等于" :value="2"></el-option>
                                </el-select>
                                 <el-select v-model="ruleForm.dayCount">
                                   <el-option  label="0.5天" :value="0.5"></el-option>
                                   <el-option  label="1天" :value="1"></el-option>
                                   <el-option  label="1.5天" :value="1.5"></el-option>
                                   <el-option  label="2天" :value="2"></el-option>
                                   <el-option  label="2.5天" :value="2.5"></el-option>
                                   <el-option  label="3天" :value="3"></el-option>
                                   <el-option  label="3.5天" :value="3.5"></el-option>
                                   <el-option  label="4天" :value="4"></el-option>
                                   <el-option  label="4.5天" :value="4.5"></el-option>
                                   <el-option  label="5天" :value="5"></el-option>
                                   <el-option  label="5.5天" :value="5.5"></el-option>
                                   <el-option  label="6天" :value="6"></el-option>
                                   <el-option  label="6.5天" :value="6.5"></el-option>
                                   <el-option  label="7天" :value="7"></el-option>
                                </el-select>                               
                            </el-form-item>
                  <el-form-item  v-if="ruleForm.isTwBatch==2" label="审核人" prop="twBatchUserJson" >
                                <address-book v-model="ruleForm.twBatchUserJson" :config="configData"></address-book>
                            </el-form-item>
                <el-form-item label="审批通过是否抄送">
                     <el-checkbox v-model="ruleForm.isTwRemind" :true-label="2" :false-label="1">是</el-checkbox>
                </el-form-item>
                <el-form-item v-if="ruleForm.isTwRemind==2"  label="抄送人员" prop="twRemindUserJson" >
                     <address-book v-model="ruleForm.twRemindUserJson" :config="twoconfigData"></address-book>
                </el-form-item>
                 <el-form-item label="提醒设置">
                      <el-checkbox-group v-model="ruleForm.reminType">
                       <el-checkbox :label="1">提醒加班人员</el-checkbox>                    
                        <el-checkbox :label="2">提醒申请人员</el-checkbox>  
                    </el-checkbox-group>
                    <!-- <el-radio-group  v-model="ruleForm.reminType">  
                        <el-checkbox :label="0">全部不提醒</el-checkbox>
                        <el-checkbox :label="1">提醒加班人员</el-checkbox>                    
                        <el-checkbox :label="2">提醒申请人员</el-checkbox>                        
                        <el-checkbox :label="3">全部提醒</el-checkbox>
                    </el-radio-group> -->
                </el-form-item>
                 
            </el-form>

        </div>
    </div>
</template>
<script>
    import mixin from '@/mixins/windowResize';
    import Backtool from '@/components/BackTool';
    import AddressBook from '@/components/AddressBook/indexExpand';
    import {addAndUpdateExtraWorkInit,getExtraWorkInit} from '@/api/extraWork';
    export default {
        components: {
            AddressBook,
            Backtool
        },
        watch: {
             'ruleForm.twBatchUserJson': {
                handler: function (val, oldVal) {
                    this.$refs.ruleForm.validateField('twBatchUserJson');
                },
                deep: true
            },
            'ruleForm.twRemindUserJson': {
                handler: function (val, oldVal) {
                    this.$refs.ruleForm.validateField('twRemindUserJson');
                },
                deep: true
            },
        },
        data() {
            var validateAddress = (rule, value, callback) => {
                if ((value.userJson == undefined || value.userJson.length == 0) && this.ruleForm.isTwBatch==2) {
                    callback(new Error('请选择审核人员！'));
                } else {
                    callback();
                }
            };
            var twovalidateAddress = (rule, value, callback) => {
                if ((value.userJson == undefined || value.userJson.length == 0) && this.ruleForm.isTwRemind==2) {
                    callback(new Error('请选择抄送人员！'));
                } else {
                    callback();
                }
            };
            
            return {
                ruleForm: {
                    applyType:1,//	申请方式 1自己申请 2 部门申请 3 两者	number	
                    dayCount:0.5,//	天数	string	
                    isTwBatch:1,//	是否加审 1否 2 加审	number	
                    isTwRemind:1,//	加审后是否抄送 1不抄送，2 抄送	number	
                    reminType:[],//	提醒类型1 提醒加班人员，2 提醒申请人员 3 两者	number	
                    roleConstantId:100,//	角色code	number	
                    roleName:"",//	角色名称		
                    twBatchUserJson:{userJson: []},//二审审批人员json	string	
                    twCondition:1,//	1大于 2大于等于	number	
                    twRemindUserJson:{userJson: []},//加审后抄送人员json	string
                    onBatchType:1
                },
                rules: {
                    twBatchUserJson: [
                        {required: true,validator: validateAddress, trigger: 'change'}
                    ],
                    twRemindUserJson: [
                        {required: true,validator: twovalidateAddress, trigger: 'change'}
                    ],
                }, 
                configData: {title: '审核人员', depart: {target: 'user', departType: 't', userTypes: '1'}},
                twoconfigData: {title: '抄送人员', depart: {target: 'user', departType: 't', userTypes: '1'}},
            }
        },
        created() {          
            getExtraWorkInit().then(res => {
                let data = res.data.data;               
                // this.ruleForm=data;
                this.ruleForm.applyType=data.applyType
                this.ruleForm.dayCount=data.dayCount-0
                this.ruleForm.isTwBatch=data.isTwBatch
                this.ruleForm.isTwRemind=data.isTwRemind
                if(data.reminType==0){
                    this.ruleForm.reminType=[]
                }
                if(data.reminType==1){
                    this.ruleForm.reminType=[1]
                }
                 if(data.reminType==2){
                    this.ruleForm.reminType=[2]
                }
                  if(data.reminType==3){
                    this.ruleForm.reminType=[1,2]
                }
                 this.ruleForm.roleConstantId=data.roleConstantId?data.roleConstantId:100
                 this.ruleForm.onBatchType=data.onBatchType?data.onBatchType:1
                 this.ruleForm.twCondition=data.twCondition
                 this.ruleForm.twRemindUserJson.userJson=JSON.parse(data.twRemindUserJson||'[]');
                 this.ruleForm.twBatchUserJson.userJson=JSON.parse(data.twBatchUserJson||'[]');
            }).catch();
        },
        mixins: [mixin],
        methods: {
            addAndUpdateExtraWorkInit() {
                this.$refs['ruleForm'].validate((valid) => {
                    if (valid) {
                        this.ruleForm.roleName=this.ruleForm.roleConstantId==100?"加班申请审批人":"分管领导"
                        let myobj={
                            applyType:this.ruleForm.applyType,
                            dayCount:this.ruleForm.dayCount,
                            isTwBatch:this.ruleForm.isTwBatch,
                            isTwRemind:this.ruleForm.isTwRemind,
                            reminType:this.ruleForm.reminType.length==0?0:this.ruleForm.reminType.length==2?3:this.ruleForm.reminType[0],                           
                            onBatchType:this.ruleForm.onBatchType,
                            twCondition:this.ruleForm.twCondition,
                            twBatchUserJson:this.ruleForm.isTwBatch==2?this.ruleForm.twBatchUserJson.userJson:[],
                            twRemindUserJson:this.ruleForm.isTwRemind==2?this.ruleForm.twRemindUserJson.userJson:[],
                        }
                        if(this.ruleForm.onBatchType==1){
                            myobj.roleConstantId=this.ruleForm.roleConstantId                           
                            myobj.roleName=this.ruleForm.roleName
                        }
                        addAndUpdateExtraWorkInit(myobj).then(res => {
                            this.$message({
                                message: '保存成功！',
                                type: 'success'
                            });
                        }).catch();
                    }
                });
            },
        }
    }
</script>
<style scoped>
.mainWrap{
    width: 810px;
    margin: 0 auto;
}
</style>
