<template>
    <div class="app-container calendar-list-container" id="noticeAdd">
        <backtool>
            <el-button type="primary" size="medium" @click.native="onSave()">保存
            </el-button>
        </backtool>
        <div  :style="{'height':nobottommaxH+'px'}" style="overflow: auto">
            <div style="width: 810px;padding-top:20px;margin: 0 auto;">
               
                <el-form  label-width="140px" class="demo-ruleForm">
                    <el-form-item label="调课确认" class="is-required" >
                         <el-radio v-model="ruleForm.ackWay" :label="1">审核前确认</el-radio>
                         <el-radio v-model="ruleForm.ackWay" :label="2">审核后确认</el-radio>
                         <el-radio v-model="ruleForm.ackWay" :label="3">审核前确认无需审批</el-radio>
                    </el-form-item>
                    <el-form-item label="审核人设置" class="is-required" v-if="ruleForm.ackWay!=3">
                         <el-radio v-model="ruleForm.examineType" :label="0">教务处审核(默认)</el-radio>
                         <el-radio v-model="ruleForm.examineType" :label="1">按分组审核</el-radio>
                    </el-form-item>
                     <el-form-item label="审核分组" v-if="ruleForm.examineType==1&&ruleForm.ackWay!=3" class="is-required" >
                          <el-button type="primary"  size="mini" @click="examineGroupJsonfun()">添加分组</el-button>
                        <div class="box" v-for="(item, index) in ruleForm.examineGroupJson" :key="index">
                              <el-form-item label="请选择分组班级" class="is-required" >
                                <address-book v-model="item.groupClassJson" :config="leaderConfig"></address-book>
                            </el-form-item>
                            <el-form-item label="请选择分组审核人" class="is-required" >
                                <address-book v-model="item.examineTeacherJson" :config="dLeaderConfig"></address-book>
                            </el-form-item>
                             <el-form-item label="请选择方式安排" class="is-required" >
                                    <el-radio v-model="item.arrangeType" :label="0">由审核人安排</el-radio>
                                    <el-radio v-model="item.arrangeType " :label="1">由教务员安排</el-radio>
                                </el-form-item>
                            <el-form-item label="请选择分组教务员"  class="is-required"  v-if="item.arrangeType==1">
                                <address-book v-model="item.eduTeacherJson" :config="memeberConfig"></address-book>
                            </el-form-item>
                            <i class="el-icon-delete" @click="deletefun(index)"></i>
                        </div>
                    </el-form-item>   
                     <el-form-item label="抄送设置" >
                         <el-checkbox-group v-model="ruleForm.sendTypes">
                            <el-checkbox label="1">抄送班主任</el-checkbox>
                            <el-checkbox label="2">抄送年级主任</el-checkbox>
                        </el-checkbox-group>
                         <el-checkbox :true-label="2" :false-label="1" v-model="ruleForm.isRemindElse">抄送指定人员</el-checkbox>
                    </el-form-item> 
                      <el-form-item label="指定人员"  class="is-required"  v-if="ruleForm.isRemindElse==2">
                                 <address-book v-model="addressData" :config="configData" :isSchoolManager="true"></address-book>
                       </el-form-item>  
                        <el-form-item label="代课条设置" >
                            <el-radio v-model="ruleForm.isSubstitute" :label="1">不发送</el-radio>
                            <el-radio v-model="ruleForm.isSubstitute" :label="2">自动发送</el-radio>
                            <el-radio v-model="ruleForm.isSubstitute" :label="3">手动发送</el-radio>
                    </el-form-item>  
                    <el-form-item label="抵扣条类型" class="is-required" v-if="ruleForm.isSubstitute===2">
                        <el-select v-model="ruleForm.substituteId" placeholder="请选择抵扣条类型">
                                <el-option v-for="item in ticketTypeList" v-if="item.typeCode==1" :key="item.id" :label="item.deductionName" :value="item.id">
                                </el-option>
                            </el-select>
                    </el-form-item>             
                </el-form>
            </div>
        </div>
    </div>
</template>

<script>
    import Backtool from '@/components/BackTool';
    import AddressBook from '@/components/AddressBook/indexExpand';
    import mixin from '@/mixins/windowResize';
    import {saveSchoolSupplyAdjustClassSetInfo,getSchoolSupplyAdjustClassSetInfo} from '@/api/supplyClass';
    import {getSchoolOvertimeDeductionTypeList} from '@/api/leaveCancelTicket';
    export default {
        name: "teachingGroupAddEdit",
        mixins: [mixin],
        components: {Backtool, AddressBook},
        data() {          
            return {
                ruleForm: {
                    examineGroupJson:[],
                    examineType:0,
                    sendTypes:[],
                    isRemindElse:1,
                    ackWay:1,
                    isSubstitute:1,
                    substituteId:''
                },
                configData: {title: '选择人员', depart: {target: 'user', departType: 't', userTypes: '1', notCheckSchool: true}},               
                addressData: {
                },
                leaderConfig: {
                    title: '班级',
                    depart: {target: 'depart', departType: 's', userTypes: '1', notCheckSchool: true},
                    group: false
                },
                dLeaderConfig: {
                    title: '审核人',
                    depart: {target: 'user', departType: 't', userTypes: '1', notCheckSchool: true},
                    group: false
                },
                memeberConfig: {
                    title: '教务员',
                    depart: {target: 'user', departType: 't', userTypes: '1', notCheckSchool: true},
                    group: false
                },
                ticketTypeList:[]               
            }
        },
        mounted() {
              getSchoolOvertimeDeductionTypeList({
                deductionName: ''
            })
                .then(res => res.data)
                .then(data => {
                    const pageData = data.data;
                    this.ticketTypeList = pageData;
                });
            getSchoolSupplyAdjustClassSetInfo().then(res => {
                    const data = res.data.data;
                    if (data.id) {
                        for(let i=0;i<data.examineGroupList.length;i++){
                        
                          this.ruleForm.examineGroupJson.push(
                          {arrangeType:data.examineGroupList[i].arrangeType-0,
                          eduTeacherJson:{departJson: [], groupJson: [], userJson:JSON.parse(data.examineGroupList[i].eduTeacherJson)},
                          examineTeacherJson:{departJson: [], groupJson: [], userJson: JSON.parse(data.examineGroupList[i].examineTeacherJson)},
                          groupClassJson:{departJson:JSON.parse(data.examineGroupList[i].groupClassJson), groupJson: [], userJson: []}
                         } )
                        }
                        if(data.elseUserJson){
                            this.addressData={userJson:JSON.parse(data.elseUserJson)}
                        }
                      this.ruleForm.examineType=data.examineType;
                       this.ruleForm.ackWay=data.ackWay;
                        this.ruleForm.isRemindElse=data.isRemindElse;
                        this.ruleForm.substituteId=data.substituteId||'';
                        this.ruleForm.isSubstitute=data.isSubstitute||1;
                      this.ruleForm.sendTypes=data.sendTypes?data.sendTypes.split(','):[];
                    }
                }).then(() => {
                }).catch();
        },
        methods: {
             deletefun(index) {
                this.ruleForm.examineGroupJson.splice(index, 1);
            },
            examineGroupJsonfun(){
             this.ruleForm.examineGroupJson.push({
                 arrangeType:0,
                 eduTeacherJson:{departJson: [], groupJson: [], userJson: []},
                 examineTeacherJson:{departJson: [], groupJson: [], userJson: []},
                 groupClassJson:{departJson: [], groupJson: [], userJson: []}
             })
            },
            onSave() {
                let examineGroupJson=[]
                if(this.ruleForm.examineType==1&&this.ruleForm.ackWay!=3){ 
                       if(this.ruleForm.examineGroupJson.length==0){
                            this.$message({
                                        message: '请添加审核分组！',
                                        type: 'warning'
                                    });
                            return;
                        }
                        for(let i=0;i<this.ruleForm.examineGroupJson.length;i++){
                              if(this.ruleForm.examineGroupJson[i].groupClassJson.departJson.length==0){
                               this.$message({
                                        message: '请选择第'+(i+1)+'分组班级！',
                                        type: 'warning'
                                    });
                                   return;
                              }
                               if(this.ruleForm.examineGroupJson[i].examineTeacherJson.userJson.length==0){
                               this.$message({
                                        message: '请选择第'+(i+1)+'分组审核老师！',
                                        type: 'warning'
                                    });
                                   return;
                              }
                               if(this.ruleForm.examineGroupJson[i].eduTeacherJson.userJson.length==0&&this.ruleForm.examineGroupJson[i].arrangeType==1){
                               this.$message({
                                        message: '请选择第'+(i+1)+'分组教务员！',
                                        type: 'warning'
                                    });
                                   return;
                              }
                        }
                        for(let i=0;i<this.ruleForm.examineGroupJson.length;i++){                             
                            if(this.ruleForm.examineGroupJson[i].eduTeacherJson.userJson.length==0&&this.ruleForm.examineGroupJson[i].arrangeType==0){
                                this.ruleForm.examineGroupJson[i].eduTeacherJson.userJson=[]
                            }
                            examineGroupJson.push({
                                arrangeType:this.ruleForm.examineGroupJson[i].arrangeType,
                                eduTeacherJson:this.ruleForm.examineGroupJson[i].eduTeacherJson.userJson,
                                examineTeacherJson:this.ruleForm.examineGroupJson[i].examineTeacherJson.userJson,
                                groupClassJson:this.ruleForm.examineGroupJson[i].groupClassJson.departJson
                            })
                        }

                }else{
                    examineGroupJson=[]
                }  
                if(this.ruleForm.isRemindElse==2){
                    if(!this.addressData.userJson||this.addressData.userJson.length==0){
                        this.$message({
                                        message: '请选择指定人员！',
                                        type: 'warning'
                                    });
                        return
                    }
                }
                if(this.ruleForm.isSubstitute==2&&!this.ruleForm.substituteId){
                   this.$message({
                                        message: '请选择抵扣条类型！',
                                        type: 'warning'
                                    });
                        return
                }
                
              let substituteName=""
              for(let i=0;i<this.ticketTypeList.length;i++){
                  if(this.ticketTypeList[i].id==this.ruleForm.substituteId){
                      substituteName=this.ticketTypeList[i].deductionName
                  }
              }
              saveSchoolSupplyAdjustClassSetInfo({
                            sendTypes: this.ruleForm.sendTypes.join(','),
                            examineGroupJson:JSON.stringify(examineGroupJson),
                             examineType:this.ruleForm.examineType,
                             isRemindElse:this.ruleForm.isRemindElse,
                             isSubstitute:this.ruleForm.isSubstitute,
                             substituteId:this.ruleForm.substituteId||0,
                             substituteName:substituteName,
                             ackWay:this.ruleForm.ackWay,
                             elseUserJson:JSON.stringify(this.ruleForm.isRemindElse==2?this.addressData.userJson:[])
                        }).then(res => {
                            if (res.data.code === 200) {
                                this.$message({
                                    type: 'success',
                                    message: '保存成功!'
                                });
                                this.$router.back();
                            } else {
                                this.$message({
                                    type: 'error',
                                    message: res.data.msg
                                });
                            }
                        }).catch(function () {
                        })
            }
        }
    }
</script>

<style scoped>
.el-form-item .el-form-item{
        margin-bottom: 12px;
}
.box{
    background: #efefef;
    padding: 10px;
    border-radius: 10px;
    margin: 10px;
    position: relative;
    padding-right: 60px;
}
 .el-icon-delete{
    line-height: 40px;
    font-size: 20px;
    float: right;
    margin-right: 10px;
    color: #606266;
    cursor: pointer;
    position: absolute;
    right: 0px;
    top: 10px;    
     color:#F56C6C;            
               }
</style>
