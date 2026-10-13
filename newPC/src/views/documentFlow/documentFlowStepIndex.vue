<template>
    <div class="doc_flow_info_wrap app-container">
        <div class="header">
            <el-button size="medium" @click="goBack">返回</el-button>
            <el-button type="primary" size="medium" @click="toSubmit" v-if="workFlowMsg.isSubmit === 1">
                {{workFlowMsg.submitName}}
            </el-button>
        </div>
        <div class="flow_info_box" :style="`height: ${maxH - 1}px;`">
            <div class="flow_info_left_box">
                <div class="flow_info_inner_box">
                    <work-flow :appUserId="appUserId" :workFlowMsg="workFlowMsg" :operaId="flowId" :flowInfo="flowInfo"
                               :flowState="flowState" @workSubmit="getWorkQuery" @isAutoUpdate="getIsAutoUpdate"
                               @isLastDeal="getIsLastDeal"></work-flow>
                </div>
            </div>
            <div class="flow_time_line_box" v-show="isTimeLineLength">
                <work-time-line :operaId="flowId" :state="flowState"
                                @timeLineLength="getTimeLineLength"></work-time-line>
            </div>
        </div>
    </div>
</template>

<script>
    import mixins from '@/mixins/windowResize';
    import workFlowFunc from '@/mixins/workFlow';
    import workFlow from '@/components/workFlow/workFlow';
    import workTimeLine from '@/components/workFlow/workTimeLine';
    import {getDocumentFlowById, dealWorkFlow} from '@/api/teachingStudy/documentFlow';

    export default {
        name: "documentFlowStepIndex",
        components: {
            workFlow,
            workTimeLine
        },
        data() {
            return {
                isLastDeal: true,
                newDealList: [],
                flowState: Number(this.$route.query.state),
                workFlowMsg: {},
                flowId: Number(this.$route.query.id),
                flowInfo: {},
                fileJson: [],
                workFlowJson: {},
                dealUserJson: {},
                isTimeLineLength: false,
                appUserId: ''
            }
        },
        mixins: [mixins, workFlowFunc],
        created() {
            this.getDocumentFlowById();
        },
        methods: {
            goBack() {
                this.$router.back();
            },
            getTimeLineLength(length) {
                this.isTimeLineLength = !!length;
            },
            getCurDealUserList(createUserId) {
                this.getWorkFlow('documentflow').then(r => {
                    if (r.data.id) {
                        if (this.flowState === 1) {
                            this.getStartStep(r.data.id).then(res => {
                                this.workFlowMsg = res.data;
                                // this.transferType = res.data.transfer;
                            });
                        } else {
                            this.getNowStep(createUserId, 0, this.flowId, r.data.id).then(res => {
                                this.workFlowMsg = res.data;
                            });
                        }
                    }
                });
            },
            toSubmit() {
                if (this.flowState !== 1 && !this.workFlowJson.batchContent && this.workFlowMsg.isBatchContent==1&& this.workFlowMsg.type!=3) {
                    this.$message({
                        type: 'error',
                        message: '请输入意见'
                    });
                    return;
                }
                if (this.isLastDeal && !this.workFlowJson.isEndStep && (!this.workFlowJson.selectMemberList || !this.workFlowJson.selectMemberList.length)&& this.workFlowMsg.type!=3) {
                    this.$message({
                        type: 'error',
                        message: '请选择下一环节处理人'
                    });
                    return;
                }
                this.submitWorkFlow(this.workFlowJson).then(res => {
                    if (res.code === 200) {
                        let query = {
                             batchContent:this.workFlowJson.batchContent,
                            batchType: this.workFlowMsg.batchType,
                            createUserId: this.flowInfo.createUserId,
                            dealUserList: this.isLastDeal ? JSON.stringify(this.workFlowJson.selectMemberList) : JSON.stringify(this.newDealList),
                            documentFlow: JSON.stringify({
                                id: this.flowInfo.id,
                                title: this.flowInfo.title
                            }),
                            stepIdNo: this.workFlowJson.stepIdNo,
                            toStepIdNo: this.isLastDeal ? this.workFlowJson.toStepIdNo : this.workFlowJson.stepIdNo,
                            workFlowId: this.workFlowJson.workFlowId
                        };
                        this.dealWorkFlow(query);
                    } else {
                        this.$message({
                            type: 'error',
                            message: res.msg
                        });
                    }
                }).catch();
            },
            getIsAutoUpdate(isAuto) {
                if (isAuto) {
                    this.toSubmit();
                }
            },
            getWorkQuery(msg) {
                this.workFlowJson = msg;
            },
            getIsLastDeal(msg) {
                   this.newDealList=[]
                    for(let i=0;i<msg.length;i++){
                        if(msg[i].id!=this.$store.getters.userInfo.id){
                             this.newDealList.push(msg[i])
                        }
                    }
                if (this.newDealList.length) {
                    this.isLastDeal = false;
                  
                }
            },
            getDocumentFlowById() {
                getDocumentFlowById(this.flowId).then(res => {
                    const data = res.data.data;
                    if (res.data.code === 200 && data) {
                        this.appUserId = data.createUserId;
                        this.flowState = data.state;
                        this.getCurDealUserList(data.createUserId);
                        this.flowInfo = data;
                    } else {
                        // this.$message.error('该公文已删除');
                        this.$router.back();
                    }
                }).catch();
            },
            dealWorkFlow(query) {
                dealWorkFlow(query).then(res => {
                    if (res.data.code === 200) {
                        this.$message({
                            type: 'success',
                            message: this.workFlowMsg.submitName + '成功！'
                        });
                        this.$router.replace({path: 'info', query: {id: this.flowId, state: 2}});
                    } else {
                        this.$message.error(res.data.msg);
                        this.$router.back();
                    }
                }).catch();
            }
        }
    }
</script>

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
                }
            }

            .flow_time_line_box {
                width: 260px;
                height: 100%;
                padding-right: 20px;
                padding-left: 10px;
                background: #f7fbfd;
            }
        }
    }
</style>
