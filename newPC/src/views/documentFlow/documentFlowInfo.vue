<template>
  <div class="doc_flow_info_wrap app-container">
    <div class="header">
      <el-button size="medium" @click="goBack">返回</el-button>
      <el-button type="primary" size="medium" v-if="(flowState === 1||flowState === 3)&&($store.getters.userInfo.id==flowInfo.createUserId)" @click="editDocFlow">编辑</el-button>
      <el-button type="primary" size="medium" v-show="isDealUser" @click="toStepPage">{{workFlowMsg.submitName}}</el-button>
      <el-button type="danger" size="medium" v-show="isDealUser&&workFlowMsg.isBack==1" @click="newconfirm" >{{workFlowMsg.backName}}</el-button>
      <el-button type="primary" size="medium" v-show="isDealUser&&workFlowMsg.isTransfer==1" @click="newconfirmtwo" >转办</el-button>
      <el-button type="primary" size="medium" v-if="$store.getters.userInfo.id==flowInfo.createUserId&&flowState === 2" @click="remindNowDealUserList">催办</el-button>
    </div>
    <el-dialog :title="workFlowMsg.backName" :visible.sync="dialogVisible" size="tiny" :close-on-press-escape='false' :close-on-click-modal='false' :modal-append-to-body='false' top="10%">
            <el-input type="textarea" :rows="3" placeholder="请输入意见" v-model="batchContent"></el-input>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="backDocumentFlowDeal">确定</el-button>
            </span>
        </el-dialog>
      <el-dialog title="转办" :visible.sync="dialogVisibletwo" size="tiny" :close-on-press-escape='false' :close-on-click-modal='false' :modal-append-to-body='false' top="10%">
              <el-form   label-width="100px">
                <el-form-item label="转办意见" class="is-required"  v-if="workFlowMsg.isBatchContent==1" >
                    <el-input type="textarea" :rows="3" placeholder="请输入意见" v-model="batchContenttwo"></el-input>
                </el-form-item>   
                 <el-form-item label="转办人员" class="is-required">
                    <address-book  v-model="addressData" :config="configData" ref="address"></address-book>
                </el-form-item>                  
            </el-form>
          
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisibletwo = false">取 消</el-button>
                <el-button type="primary" @click="backDocumentFlowDealtwo()">确定</el-button>
            </span>
        </el-dialog>
    <div class="flow_info_box" :style="`height: ${nobottommaxH-20}px;`">
      <div class="flow_info_left_box">
        <div class="flow_info_inner_box">
          <div class="title_box">
            <div class="header_mid_title">{{flowInfo.title}}</div>
            <div class="header_mid_time">{{flowInfo.comeDepartName || ''}}&nbsp;&nbsp;{{flowInfo.comeNum || ''}}&nbsp;&nbsp;{{flowInfo.comeDate || ''}}&nbsp;&nbsp;{{flowInfo.putNum || ''}}</div>
          </div>
          <image-previewer tag="richtext">
            <div v-html="flowInfo.content"></div>
              <div>
                                <img style="width: 100px!important;height: 100px;margin-right: 10px;"
                                     v-for="picItem in picjson"
                                     :src="picItem.fileUrl" :key="picItem.id"/>
                            </div>
          </image-previewer>

          <div v-show="fileJson && fileJson.length">
            <file-list :view="true" :fileList="fileJson"></file-list>
          </div>
        </div>
      </div>
      <div class="flow_time_line_box" v-if="newshow" v-show="isTimeLineLength">
        <work-time-line :operaId="flowId"  :state="workFlowMsg.type == 3 ? 5 : flowState"  @timeLineLength="getTimeLineLength"></work-time-line>
      </div>
    </div>
  </div>
</template>

<script>
  import workTimeLine from '@/components/workFlow/workTimeLine';
  import ImagePreviewer from '@/components/ImagePreviewer/ImagePreviewer.vue';
  import FileList from '@/components/FileList/FileList.vue';
  import mixins from '@/mixins/windowResize';
  import workFlow from '@/mixins/workFlow';
  import AddressBook from '@/components/AddressBook/indexExpand';
  import {getDocumentFlowById,remindNowDealUserList,backDocumentFlowDeal,newgetDealUserList,sendBackWorkFlow,dealWorkFlow} from '@/api/teachingStudy/documentFlow';

  export default {
    name: "documentFlowInfo",
    components: {
      workTimeLine,
      ImagePreviewer,
      FileList,
      AddressBook
    },
    data() {
      return {
        flowId: Number(this.$route.query.id),
        flowState: Number(this.$route.query.state),
        flowInfo: {
          content: ''
        },
        fileJson: [],
        workFlowMsg: {},
        isDealUser: false,
        isTimeLineLength: false,
        picjson:[],
        dialogVisible:false,
        batchContent:'',
        newshow:true,
        addressData: {userJson:[]},
        configData:{title: '转发人员', depart: {target: 'user', departType: 't', userTypes: '1',notCheckSchool: true}},
        batchContenttwo:"",
        dialogVisibletwo:false
      }
    },
    mixins: [mixins, workFlow],
    created() {
      this.getDocumentFlowById();
    },
    methods: {
       newconfirmtwo(){
          this.batchContenttwo=""
          this.dialogVisibletwo=true;
          this.addressData.userJson=[]
      },
      newconfirm(){
        if(this.workFlowMsg.isBatchContent==1){
          this.batchContent=""
          this.dialogVisible=true;
        }else{
           this.$confirm('是否'+this.workFlowMsg.backName+'?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
             this.backDocumentFlowDeal()
              });

        }
      },
      backDocumentFlowDealtwo(){
         if(this.workFlowMsg.isBatchContent==1&&!this.batchContenttwo){
            this.$message.error('请输入意见');
            return;
          }
           if(!this.addressData.userJson.length){
            this.$message.error('请选择转办人');
            return;
          }
         
          newgetDealUserList(this.workFlowMsg.stepIdNo,this.workFlowMsg.workFlowId,this.flowId,this.flowInfo.createUserId,1).then(res => { 
                   let userJson=[];
                   let mydata=res.data.data;
                   for(let i=0;i<this.addressData.userJson.length;i++){
                     this.addressData.userJson[i].addType=1
                     let is=true
                     for(let j=0;j<mydata.length;j++){
                       if(this.addressData.userJson[i].id==mydata[j].id){
                        is=false
                       }
                     }
                     if(is){
                       userJson.push(this.addressData.userJson[i])
                     }
                   }
                   let newobjtwo=[...mydata,...userJson]
                   let idlist=[]
                   let mylist=[]
                   for(let i=0;i<newobjtwo.length;i++){
                     if(newobjtwo[i].id!=this.$store.getters.userInfo.id){
                       idlist.push(newobjtwo[i].id)
                       mylist.push(newobjtwo[i])
                     }
                   }
                    if(!mylist.length){
                      this.$message.error('转办人不能仅选择自己');
                      return;
                    }
                     this.newshow=false
                    let query = {
                            batchType: this.workFlowMsg.batchType,
                            createUserId: this.flowInfo.createUserId,
                             batchContent:this.batchContenttwo,
                            isTransfer:1,
                            dealUserList:JSON.stringify(mylist),
                            documentFlow: JSON.stringify({
                                id: this.flowInfo.id,
                                title: this.flowInfo.title
                            }),
                            stepIdNo: this.workFlowMsg.stepIdNo,
                            toStepIdNo:  this.workFlowMsg.stepIdNo,
                            workFlowId: this.workFlowMsg.workFlowId
                        };
                    const args = {
                                    batchContent:this.batchContenttwo,
                                    batchType:this.workFlowMsg.batchType,
                                    fileJson: [],
                                    operatId: this.flowId,
                                    statusName: this.workFlowMsg.statusName,
                                    stepIdNo: this.workFlowMsg.stepIdNo,
                                    stepName: this.workFlowMsg.name,
                                    stepStateName: this.workFlowMsg.statusName,
                                    stepType: 1,
                                    toStepIdNo: this.workFlowMsg.stepIdNo,
                                    toStepName: this.workFlowMsg.name,
                                    toStepUserIds:idlist.join(','),
                                    workFlowId: this.workFlowMsg.workFlowId,
                                    workFlowType: 'documentflow',
                                    isTransfer:1,
                                };
                                this.submitWorkFlow(args)
                                    .then(res => res)
                                    .then(data => {
                                        if (data.result) {
                                           dealWorkFlow(query).then(res => {
                                              if (res.data.code === 200) {
                                                  this.$message({
                                                      type: 'success',
                                                      message:  '转办成功！'
                                                  });   
                                                      this.dialogVisibletwo=false;
                                                      this.newshow=true;
                                                      this.getDocumentFlowById(); 
                                              } else {
                                                  this.$message.error(res.data.msg);
                                              }
                                          }).catch();
                                          
                                        } else {
                                                this.$message.error(data.msg);
                                        }
                                    })                
                            });

      },
       backDocumentFlowDeal() {      
          if(this.workFlowMsg.isBatchContent==1&&!this.batchContent){
            this.$message.error('请输入意见');
            return;
          }
          this.newshow=false
          this.getStartStep(this.workFlowMsg.workFlowId).then(res => {
                let newobj = res.data;
                 newgetDealUserList(newobj.stepIdNo,this.workFlowMsg.workFlowId,this.flowId,this.flowInfo.createUserId).then(res => { 
                   let newobjtwo=res.data.data
                    const args = {
                                    batchContent:this.batchContent,
                                    fileJson: [],
                                    operatId: this.flowId,
                                    statusName: this.workFlowMsg.statusName,
                                    stepIdNo: this.workFlowMsg.stepIdNo,
                                    stepName: this.workFlowMsg.name,
                                    stepStateName: this.workFlowMsg.statusName,
                                    stepType: 1,
                                    toStepIdNo: newobj.stepIdNo,
                                    toStepName: newobj.name,
                                    toStepUserIds:newobjtwo.map(({id}) => id).join(','),
                                    workFlowId: this.workFlowMsg.workFlowId,
                                    workFlowType: 'documentflow'
                                };
                                sendBackWorkFlow(args)
                                    .then(res => res.data)
                                    .then(data => {
                                        if (data.result) {
                                            backDocumentFlowDeal({
                        createUserId: this.flowInfo.createUserId,
                        dealUserList: JSON.stringify(newobjtwo),
                        documentFlow: JSON.stringify({id: this.flowInfo.id,}),
                        stepIdNo: this.workFlowMsg.stepIdNo,
                        toStepIdNo: newobj.stepIdNo,
                        workFlowId: this.workFlowMsg.workFlowId,
                        batchContent:this.batchContent
                    }).then(res => {
                                if (res.data.code === 200) {
                                    this.$message({
                                        type: 'success',
                                        message: this.workFlowMsg.backName + '成功！'
                                    });   
                                    this.dialogVisible=false;
                                    this.newshow=true;
                                    this.getDocumentFlowById();                     
                                } else {
                                    this.$message.error(res.data.msg);
                                }
                            }).catch();
                                        } else {
                                                this.$message.error(data.msg);
                                        }
                                    })                
                            });
                            
                    }).catch(() => {
                    });
            },
      goBack() {
        this.$router.back();
      },
      toStepPage() {
        this.$router.push({path: 'stepIndex', query: {id: this.flowId, state: this.flowState}});
      },
      editDocFlow() {
        this.$router.push({path: 'add', query: {id: this.flowId}});
      },
      getTimeLineLength(length) {
        this.isTimeLineLength = !!length;
      },
      remindNowDealUserList() {
        this.$confirm('是否催办?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          remindNowDealUserList(this.flowId,this.workFlowMsg.stepIdNo,this.flowInfo.title).then(res => {
            if (res.data.code === 200) {
              this.$message({
                type: 'success',
                message: '催办成功!'
              });
            } else {
              this.$message.error(res.data.msg);
            }
          }).catch();
        }).catch(() => {
        });
      },
      getCurDealUserList(createUserId) {
        this.getWorkFlow('documentflow').then(r => {
          if (r.data.id) {
            if (this.flowState === 1) {
              this.getStartStep(r.data.id).then(res => {
                this.workFlowMsg = res.data;
                this.isDealUser = res.data.dealUser;
              });
            } else {
              this.getNowStep(createUserId, 0, this.flowId, r.data.id).then(res => {
                this.workFlowMsg = res.data;
                this.isDealUser = res.data.dealUser;
              });
            }
          }
        });
      },
      getDocumentFlowById() {
        getDocumentFlowById(this.flowId).then(res => {
          const data = res.data.data;
          if (res.data.code === 200 && data) {
            this.flowState = data.state;
            this.getCurDealUserList(data.createUserId);
            this.flowInfo = data;
            this.fileJson = data.fileJson ? JSON.parse(data.fileJson) : [];
            this.picjson = data.picjson ? JSON.parse(data.picjson) : [];
          } else {
            this.$message.error('该公文已删除');
            this.$router.back();
          }
        }).catch();
      }
    }
  }
</script>

<style scoped>
  .doc_flow_info_wrap img {
    max-width: 100%;
  }
</style>

<style lang="scss" scoped>
  @import '../../styles/mixin.scss';

  .doc_flow_info_wrap {
    .header {
      margin-bottom: 10px;
      padding-bottom: 10px;
      border-bottom: 1px solid #eee;
    }

    .flow_info_box {
      height: 100%;
      overflow-x: hidden;
      overflow-y: auto;
      position: relative;
      display: flex;
      @include scrollBar;
      @include richtext;

      .flow_info_left_box {
        flex: 1;
        border-right: 1px solid #eee;

        .flow_info_inner_box {
          width: 720px;
          margin: 0 auto;
          overflow: hidden;

          .title_box {
            text-align: center;
            margin-bottom: 15px;

            .header_mid_title {
              line-height: 50px;
              font-size: 20px;
              font-weight: 700;
              color: #333;
            }

            .header_mid_time {
              height: 20px;
              line-height: 20px;
              font-size: 16px;
              color: #909399;
            }
          }
        }
      }

      .flow_time_line_box {
        width: 300px;
        height: 100%;
        padding-right: 20px;
        padding-left: 10px;
        background: #f7fbfd;
      }
    }
  }
</style>
