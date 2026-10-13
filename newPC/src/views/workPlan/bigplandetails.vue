<template>
    <div class="planAdd" style="padding:12px;">
        <backtool>
            <el-button type="primary" @click="print()" size="medium">打印</el-button>
        </backtool>
        <div class="subject" :style="`height: ${nobottommaxH}px;`">
            <div ref="print" class="print">
                <h3>{{ruleForm.title}}</h3>
                <div class="time">{{ruleForm.startDate}}至{{ruleForm.endDate}}</div>
                <div class="boxtable">
                    <table border="1" cellspacing="0" width="100%">
                        <tr>
                            <th>部门</th>
                            <th>序号</th>
                            <th style="width: 500px;">内容</th>
                            <th>责任人</th>
                        </tr>
                        <tr :key="index" v-for="(item,index) in dataList">
                            <td :rowspan="item.henum" v-if="item.name">{{item.name}}</td>
                            <td>{{item.num}}</td>
                            <td>{{item.content}}</td>
                            <td>{{item.people}}</td>
                        </tr>
                    </table>
                </div>
                <div class="remark" v-if="remark">
                    <div class="name">
                        备注：
                    </div>
                    <div class="center">
                        {{remark}}
                    </div>

                </div>
            </div>
        </div>

    </div>
</template>
<script>
    import mixin from '@/mixins/windowResize';
    import Backtool from '@/components/BackTool';
    import moment from "moment";
    import AddressBook from '@/components/AddressBook/indexExpand';
    import {
        getPublishedWorkPlan
    } from "@/api/workPlan";

    export default {
        name: "dataAnalysis",
        components: {
            AddressBook,
            Backtool
        },
        data() {

            return {
                ruleForm: {
                    id: this.$route.query.id,
                    startDate: "",
                    endDate: "",
                    title: ''
                },
                remark: '',
                dataList: [],//计划数组
            };
        },
        mixins: [mixin],
        created() {
            getPublishedWorkPlan(this.ruleForm.id)
                .then(res => {
                    let data = res.data.data;
                    this.ruleForm.startDate = data.startDate;
                    this.ruleForm.endDate = data.endDate;
                    this.remark = data.remark;
                    this.ruleForm.title = data.title;
                    let biglist = [];
                    let list = [];
                    let is = false;
                    for (let i = 0; i < data.workPlanModelList.length; i++) {
                        for (let j = 0; j < list.length; j++) {
                            if (data.workPlanModelList[i].departId == list[j].id) {
                                is = true;
                            }
                            ;
                        }
                        ;
                        if (!is) {
                            list.push({
                                id: data.workPlanModelList[i].departId,
                                name: data.workPlanModelList[i].departName
                            });
                        }
                        is = false;
                    }
                    ;
                    for (let j = 0; j < list.length; j++) {
                        let obj = {
                            name: list[j].name,
                            list: []
                        }
                        for (let i = 0; i < data.workPlanModelList.length; i++) {
                            if (data.workPlanModelList[i].departId == list[j].id) {
                                obj.list.push(data.workPlanModelList[i])
                            }
                            ;
                        }
                        ;
                        biglist.push(obj);
                    }
                    ;
                    for (let i = 0; i < biglist.length; i++) {
                        for (let j = 0; j < biglist[i].list.length; j++) {
                            if (j == 0) {
                                this.dataList.push({
                                    name: biglist[i].name,
                                    num: j + 1,
                                    content: biglist[i].list[j].planContent,
                                    people: biglist[i].list[j].dutyUserName,
                                    henum: biglist[i].list.length
                                })
                            } else {
                                this.dataList.push({
                                    num: j + 1,
                                    content: biglist[i].list[j].planContent,
                                    people: biglist[i].list[j].dutyUserName
                                })
                            }
                        }
                    }

                }).catch(err => {
            });

        },
        methods: {
            //打印
            print() {
                this.$print(this.$refs.print)
            },
        }
    };
</script>
<style scoped>
    .remark {
        width: 800px;
        margin: 20px auto;
    }

    .remark .name {
        width: 60px;
        float: left;
        font-weight: 600;
        font-size: 16px;
        color: #666;
    }

    .remark .center {
        width: 740px;
        float: left;
        font-size: 14px;
    }

    .subject {
        padding: 10px;
        overflow: auto;
    }

    .print {
        word-break: break-all;
        word-wrap: break-word;
        overflow: auto;
    }

    h3 {
        text-align: center;
        font-size: 26px;
        margin: 10px 0 0 0;
    }

    .time {
        text-align: right;
        padding-right: 30%;
        color: #999;
        line-height: 40px;
    }

    .boxtable {
        width: 800px;
        margin: 10px auto;
    }

    .boxtable th, .boxtable td {
        padding: 8px 5px;
        line-height: 20px;
        text-align: center;
        min-width: 100px;
    }
</style>
