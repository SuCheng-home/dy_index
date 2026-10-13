<template>
    <div class="work_time_line_box">
        <div class="time_line_title">处理记录</div>
        <div class="time_line_box">
            <el-timeline>
                <el-timeline-item :timestamp="item.stepName" placement="top" type="primary" v-for="(item, index) in timeLineList" :key="index">
                    <div>{{item.batchContent}}</div>
                    <div class="step_content">{{item.dealUserName}}&nbsp;&nbsp;{{item.createTime | timeFilter}}</div>
                    <template v-for="sameItem in item.sameStepList">
                        <div style="margin-top: 10px;">
                            {{sameItem.batchContent}}
                        </div>
                        <div class="step_content">{{sameItem.dealUserName}}&nbsp;&nbsp;{{sameItem.createTime | timeFilter}}</div>
                    </template>
                </el-timeline-item>
               
                <el-timeline-item v-if="state !== 5&&(timeLineList[timeLineList.length-1].sameStepList?timeLineList[timeLineList.length-1].sameStepList[timeLineList[timeLineList.length-1].sameStepList.length-1].stepIdNo!=timeLineList[timeLineList.length-1].sameStepList[timeLineList[timeLineList.length-1].sameStepList.length-1].toStepIdNo:timeLineList[timeLineList.length-1].toStepIdNo!=timeLineList[timeLineList.length-1].stepIdNo)" :timestamp="timeLineList[timeLineList.length-1].sameStepList?timeLineList[timeLineList.length-1].sameStepList[timeLineList[timeLineList.length-1].sameStepList.length-1].toStepName:timeLineList[timeLineList.length-1].toStepName" placement="top" type="primary">
                   
                </el-timeline-item>
            </el-timeline>
            <div class="not-deal-user" style="margin-top: 10px;" v-if="notDealUserNameList && notDealUserNameList.length !== 0">
                未处理人：<span class="not-deal-user-name" v-for="userName in notDealUserNameList">{{userName}}</span>
            </div>
        </div>
    </div>
</template>

<script>
    import {getWorkFlowHisList} from '@/api/workflow';
    import {listUserByUserIds} from '@/api/common/common';

    export default {
        name: "workTimeLine",
        props: {
            operaId: {
                type: Number,
                default: 0
            },
            state: {
                type: Number,
                default: 0
            },
            workFlowType: {
                type: String,
                default: 'documentflow'
            }
        },
        data() {
            return {
                timeLineList: [],
                notDealUserNameList: ''
            }
        },
        filters: {
            timeFilter(time) {
                return time ? time.slice(0, 19) : '';
            }
        },
        mounted() {
            this.getWorkFlowHisList();
        },
        methods: {
            getWorkFlowHisList() {
                getWorkFlowHisList({
                    operatId: this.operaId,
                    workFlowType: this.workFlowType
                }).then(res => {
                    const data = res.data.data;
                    if (res.data.code === 200) {
                        let newRectList = [];
                        let newList = [];
                        data.forEach((item) => {
                            if (newRectList.indexOf(item.stepIdNo) > -1) {
                                if (!newList[newRectList.indexOf(item.stepIdNo)].sameStepList) {
                                    newList[newRectList.indexOf(item.stepIdNo)].sameStepList = [];
                                }
                                newList[newRectList.indexOf(item.stepIdNo)].sameStepList.push(item);
                            } else {
                                newRectList.push(item.stepIdNo);
                                newList.push(item);
                            }
                        });
                        if(data.length !== 0 && data[data.length - 1]) {
                            const lastNode = data[data.length - 1];
                            listUserByUserIds({
                                userIds: lastNode.toStepUserIds
                            })
                                .then(res => res.data)
                                .then(data => {
                                    try {
                                        if(data.data) {
                                            this.notDealUserNameList = data.data.map(item => item.name);
                                        }
                                    } catch(e) {
                                        console.error(e);
                                    }
                                })
                        }
                        this.timeLineList = newList;
                        if (this.state == 5) {
                            this.timeLineList.push({
                                stepName: '结束',
                                dealUserName: '',
                                createTime: '',
                                batchContent: '',
                                sameStepList:[]
                            })
                        }
                    }
                    console.log(this.timeLineList)
                    this.$emit('timeLineLength', this.timeLineList.length)
                }).catch();
            },
        }
    }
</script>

<style lang="scss" scoped>
    .work_time_line_box {
        .time_line_title {
            height: 20px;
            line-height: 20px;
            margin: 15px;
            text-align: center;
            font-size: 16px;
            font-weight: bold;
            color: #333;
        }

        .time_line_box {
            .step_content {
                margin-top: 5px;
                color: #909399;
                word-break: break-all;
            }
        }

        .not-deal-user-name {
            margin-right: 10px;
        }
        .not-deal-user {
            padding-left: 32px;
            font-size: 14px;
        }
    }
</style>
