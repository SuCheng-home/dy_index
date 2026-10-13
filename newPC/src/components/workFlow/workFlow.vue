<template>
    <div class="work_flow_box">
        <div class="flow_del_box">
            <div v-if="workFlowMsg.isBatchContent === 1">
                <div class="flow_del_title"><span style="color: #f00;">*</span>处理意见</div>
                <el-input type="textarea" :rows="3" placeholder="请输入意见" v-model="delText"></el-input>
            </div>

            <div v-if="nextStepList.length &&isLastDeal">
                <div class="flow_del_title"><span style="color: #f00;">*</span>指定下一环节</div>
                <el-radio-group v-model="nextStepRadio" @change="changeRadio">
                    <el-radio :label="item.id" :key="index" v-for="(item, index) in nextStepList">{{item.name}}
                    </el-radio>
                </el-radio-group>
            </div>

            <div v-if="nextStepList.length && stepDealSelected.deealSelectedType === 1 && !isEndStep && isLastDeal">
                <div class="flow_del_title"><span style="color: #f00;">*</span>指定下一环节处理人</div>
                 <el-checkbox :indeterminate="isIndeterminate" v-if="!canSelect"  :disabled="canSelect" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
                <el-checkbox-group v-model="checkDelMember" :disabled="canSelect" @change="handleCheckedCitiesChange">
                    <el-checkbox v-for="(item, index) in delMemberList" :label="item.id" :key="index">{{item.name}}
                    </el-checkbox>
                </el-checkbox-group>
            </div>
            <div
                v-else-if="nextStepList.length && stepDealSelected.deealSelectedType === 2 && !isEndStep && isLastDeal">
                <div class="flow_del_title"><span style="color: #f00;">*</span>指定下一环节处理人</div>
                <address-book v-model="addressData" :config="configData">添加组成员</address-book>
            </div>
        </div>
    </div>
</template>

<script>
    import workFlow from '@/mixins/workFlow';
    import AddressBook from '@/components/AddressBook/indexExpand';

    export default {
        name: "workFlow",
        props: {
            workFlowType: {
                type: String,
                default: 'documentflow'
            },
            operaId: {
                type: Number,
                default: 0
            },
            flowState: {
                type: Number,
                default: 1
            },
            flowInfo: {
                type: Object,
                default: function () {
                    return {}
                }
            },
            workFlowMsg: {
                type: Object,
                default: function () {
                    return {}
                }
            },
            appUserId() {
                this.getYesHisUser();
            }
        },
        data() {
            return {
                checkAll: false,
                isIndeterminate: true,
                isLastDeal: true,
                toDealList: [],
                canSelect: false,
                isEndStep: false,
                stepDealSelected: {},
                selectMemberList: [],
                checkDelMember: [],
                delMemberList: [],
                delText: '',
                nextStepRadio: null,
                nextStepList: [],
                addressData: {
                    userJson: []
                },
                configData: {title: '选择用户', depart: {target: 'user', departType: 't', userTypes: '1'}, group: true}
            }
        },
        components: {AddressBook},
        mixins: [workFlow],
        watch: {
            workFlowMsg() {
                console.log('22', this.workFlowMsg);

                new Promise(resolve => {
                    if (this.workFlowMsg.batchType === 2) {
                        this.getYesHisUser()
                            .then(resolve);
                    } else {
                        resolve();
                    }
                })
                    .then(() => {
                        this.stepByStepIdNo();
                    })

            },
            delText() {
                this.toSubmitWorkFlow();
            },
            checkDelMember() {
                this.toSubmitWorkFlow();
            },
            'addressData': {
                handler: function () {
                    this.toSubmitWorkFlow();
                },
                deep: true
            }
        },
        mounted() {
            console.log('11', this.workFlowMsg);

            new Promise(resolve => {
                if (this.workFlowMsg.batchType === 2) {
                    this.getYesHisUser()
                        .then(resolve);
                } else {
                    resolve();
                }
            })
                .then(() => {
                    this.stepByStepIdNo();
                })

        },
        methods: {
             handleCheckAllChange(val) {
                 let cityOptions=this.delMemberList.map(function (item) {
                        return item.id
                    })
                 this.checkDelMember = val ? cityOptions : [];
                 this.isIndeterminate = false;
                },
                handleCheckedCitiesChange(value) {
                    let checkedCount = value.length;
                    this.checkAll = checkedCount === this.delMemberList.length;
                    this.isIndeterminate = checkedCount > 0 && checkedCount < this.delMemberList.length;
                },
            // 查询下一流程
            stepByStepIdNo() {
                console.log('aa', this.workFlowMsg);
                if (this.workFlowMsg.stepIdNo) {
                    this.getStepByStepIdNo({
                        adjustClass: 0,
                        condit: '',
                        conditTw: '',
                        stepIdNo: this.workFlowMsg.stepIdNo,
                        transfer: this.workFlowMsg.transfer,
                        workFlowId: this.workFlowMsg.workFlowId
                    }).then(res => {
                        if (res.code === 200 && res.data.length) {
                            this.nextStepList = res.data;
                            this.nextStepRadio = res.data[0].id;
                            this.changeRadio();
                        }
                    });
                }

            },
            // 查询已经处理人id集合
            getYesHisUser() {
                return this.getYesHisUserList({
                    operatId: this.operaId,
                    stepIdNo: this.workFlowMsg.stepIdNo,
                    workFlowId: this.workFlowMsg.workFlowId
                }).then(res => {
                    this.getDealUserList(0, this.workFlowMsg.stepIdNo, this.workFlowMsg.workFlowId, this.operaId, this.appUserId, 2).then(res2 => {
                        const dealAllUserList = res2.data || [];

                        if (dealAllUserList.length && dealAllUserList.length > 1) {
                            let newList = [];
                            dealAllUserList.forEach((item) => {
                                if (res.data.indexOf(item.id) < 0) {
                                    newList.push(item)
                                }
                            });
                            if (newList.length > 1) {
                                this.isLastDeal = false;
                            }
                            this.toDealList = newList;
                            this.$emit('isLastDeal', newList);
                        }
                    })
                });
            },
            // 获取环节处理人
            getDealUsers() {
                this.getDealUserList(0, this.stepDealSelected.stepIdNo, this.workFlowMsg.workFlowId, this.operaId, this.appUserId, this.isLastDeal ? 1 : 2).then(res => {
                    if(res.data){
                        this.delMemberList = res.data;
                        this.checkDelMember = res.data.map(item => item.id);
                        this.checkAll=true;
                        this.isIndeterminate=false;
                    }
                   
                });
            },
            changeRadio() {
                if (this.nextStepList.map(item => item.id).indexOf(this.nextStepRadio) > -1) {
                    let radioIndex = this.nextStepList.map(item => item.id).indexOf(this.nextStepRadio);
                    this.stepDealSelected = this.nextStepList[radioIndex];
                    if (this.stepDealSelected.dealUserJson) {
                        let newDealJson = JSON.parse(this.stepDealSelected.dealUserJson);
                        this.canSelect = newDealJson.userSelectedType == 1;

                    }
                    this.isEndStep = !!(this.stepDealSelected.type === 3);
                    if (this.nextStepList[radioIndex].deealSelectedType === 1) {
                        this.getDealUsers();
                    }
                    this.toSubmitWorkFlow();
                }
            },
            toSubmitWorkFlow() {
                let query = {
                    batchContent: this.delText,
                    batchType: this.workFlowMsg.batchType,
                    fileJson: '',
                    operatId: this.operaId,
                    statusName: this.workFlowMsg.statusName,
                    stepIdNo: this.workFlowMsg.stepIdNo,
                    stepName: this.workFlowMsg.name,
                    stepStateName: this.workFlowMsg.statusName,
                    stepType: 1,
                    toStepIdNo: this.isLastDeal ? this.stepDealSelected.stepIdNo : this.workFlowMsg.stepIdNo,
                    toStepName: this.isLastDeal ? this.stepDealSelected.name : this.workFlowMsg.name,
                    workFlowId: this.workFlowMsg.workFlowId,
                    workFlowType: this.workFlowType,
                    isEndStep: this.isEndStep
                };

                if (this.stepDealSelected.deealSelectedType === 1) {
                    query.selectMemberList = this.getMemberList();
                    query.toStepUserIds = this.checkDelMember.toString();
                } else if (this.stepDealSelected.deealSelectedType === 2) {
                    query.selectMemberList = this.addressData.userJson;
                    query.toStepUserIds = this.addressData.userJson.map(item => item.id).toString() || '';
                }
                if (!this.isLastDeal) {
                    let newArray = [];
                    this.toDealList.forEach((item) => {
                        if (item.id !== this.$store.getters.userInfo.id) {
                            newArray.push(item.id)
                        }
                    });
                    query.toStepUserIds = newArray.toString();
                }

                this.$emit('workSubmit', query);
            },
            getMemberList() {
                let newArray = [];
                this.delMemberList.forEach((item) => {
                    if (this.checkDelMember.indexOf(item.id) > -1) {
                        newArray.push({
                            avatar: item.avatar,
                            id: item.id,
                            loginname: item.loginname,
                            mobile: item.mobile,
                            name: item.name,
                            type: item.type
                        })
                    }
                });
                return newArray;
            }
        }
    }
</script>

<style lang="scss" scoped>
    .work_flow_box {
        .flow_del_box {
            .flow_del_title {
                margin-top: 20px;
                margin-bottom: 10px;
                font-weight: 700;
            }
        }
    }
</style>
