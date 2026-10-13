<template>
    <div class="workingMeallistone">
        <div class="top">
            <el-button class="filter-item" type="primary" icon="upload" size="medium" @click="print()">打印
            </el-button>
            <el-button type="primary" size="medium" @click="exportExcel('#outTable', `当日汇总.xlsx`)"
                         v-if="dataList.length>0">导出
            </el-button>
        </div>
        <div class="body" :style="`height: ${nobottommaxH-55}px;`">
            <div ref="print" id="print">
                <div class="h-top" style="line-height: 60px;text-align: center;font-size: 20px;">
                    共 <span>{{dataList.length}}</span> 张申请单，今日需准备 <span>{{num}}</span> 份工作餐。
                </div>
                <table id="outTable" border="1" style="border-collapse: collapse;width: 100%;">
                    <thead>
                    <tr>
                        <th style=" text-align: left;padding:10px 5px;">申请人</th>
                        <th style=" text-align: left;padding:10px 5px;" v-if="isCater!=2">送餐地点</th>
                        <th style=" text-align: left;padding:10px 5px;">份数</th>
                        <th style=" text-align: left;padding:10px 5px;">餐标</th>
                        <th style=" text-align: left;padding:10px 5px;">送餐（取餐）时间</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="item in dataList">
                        <td style=" text-align: left;padding:10px 5px;">{{item.createUserName}}</td>
                        <td style=" text-align: left;padding:10px 5px;" v-if="isCater!=2">{{item.placeName}}
                        </td>
                        <td style=" text-align: left;padding:10px 5px;">{{item.applicationCount}}</td>
                        <td style=" text-align: left;padding:10px 5px;">{{item.meal}}元</td>
                        <td style=" text-align: left;padding:10px 5px;">
                            <span>{{item.sendTime?item.sendTime.slice(0,19):""}}</span>
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>

        </div>

    </div>
</template>
<script>
    import moment from "moment";
    import {getSarahListBySendDate, getSarahInit} from "@/api/workingMeal";
    import baseMixin from '@/mixins/baseMixin';
    import mixin from '@/mixins/windowResize';

    export default {
        name: "statisticsIndex",
        data() {
            return {
                daterange: [new Date(), new Date()],
                dataList: [],
                pagination: {
                    startDate: '',
                    endDate: '',
                    departId: 0
                },
                num: '',
                isCater: ''
            }
        },
        mixins: [baseMixin, mixin],
        created() {
            this.getSarahListBySendDates();
            getSarahInit()
                .then(res => {
                    let data = res.data.data;
                    if (data) {
                        this.isCater = data.isCater;
                    }
                })
                .catch(err => {
                });
        },
        methods: {
            print() {
                this.$print(this.$refs.print);
            },
            getSarahListBySendDates() {
                this.pagination.startDate = moment(this.daterange[0]).format('YYYY-MM-DD');
                this.pagination.endDate = moment(this.daterange[1]).format('YYYY-MM-DD');
                getSarahListBySendDate(this.pagination)
                    .then(res => res.data)
                    .then(data => {
                        this.dataList = data.data;
                        for (let i = 0; i < this.dataList.length; i++) {
                            this.num = (this.num - 0) + (this.dataList[i].applicationCount - 0)
                        }
                        this.num = Math.floor(this.num)
                    })
            },
        }
    }
</script>
<style scoped>
    .workingMeallistone td, .workingMeallistone th {
        padding: 10px;
        font-size: 14px;
        border: 1px solid #d0d0d0;
        padding-left: 10px;
        text-align: left;
    }
</style>
<style lang="scss" scoped>
    .workingMeallistone {
        padding: 12px;

        .top {
            padding-bottom: 10px;
            border-bottom: 1px solid #e7eaec;
        }

        .body {
            overflow: auto;
        }

    }
</style>
