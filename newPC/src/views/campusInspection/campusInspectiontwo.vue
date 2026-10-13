<template>
    <div style="padding:10px">
        <div class="top">
            <el-button size="medium" type="primary" @click="goback()" v-if="isnum==1">返回</el-button>
             <el-date-picker v-model="dateRange" type="daterange" class="mywidthdaterange" range-separator="-" :clearable="false"
                                size="medium"   @change="spanclick(type)"
                                start-placeholder="开始日期" end-placeholder="结束日期">
           </el-date-picker>
        </div>
        <div class="subject" :style="'height:'+(maxH-20)+'px'">
            <div class="button-box">
                        <span @click="spanclick(1)" :class="{'spancolor' : type==1}"
                              v-if="isShowByPermission('/starGroup/starGroupManageclmmorstMan')">早自习</span>
                <span @click="spanclick(2)" :class="{'spancolor' : type==2}"
                      v-if="isShowByPermission('/starGroup/starGroupManageclmstMan')">课堂</span>
                <span @click="spanclick(3)" :class="{'spancolor' : type==3}"
                      v-if="isShowByPermission('/starGroup/starGroupManagehealthstMan')">卫生</span>
                <span @click="spanclick(4)" :class="{'spancolor' : type==4}"
                      v-if="isShowByPermission('/starGroup/starGroupManagemormeetstMan')">晨会</span>
                <span @click="spanclick(5)" :class="{'spancolor' : type==5}"
                      v-if="isShowByPermission('/starGroup/starGroupManagestmorexcstMan')">课间操</span>
                <span @click="spanclick(6)" :class="{'spancolor' : type==6}"
                      v-if="isShowByPermission('/starGroup/starGroupManageeyestMan')">眼操</span>
                <span @click="spanclick(7)" :class="{'spancolor' : type==7}"
                      v-if="isShowByPermission('/starGroup/starGroupManagelowcarbonstMan')">低碳</span>
                <span @click="spanclick(8)" :class="{'spancolor' : type==8}"
                      v-if="isShowByPermission('/starGroup/starGroupManageclassletstMan')">午餐</span>
                <span @click="spanclick(9)" :class="{'spancolor' : type==9}"
                      v-if="isShowByPermission('/starGroup/starGroupManageInsGroupStatisticalMan')">放学路队</span>
                <span @click="spanclick(10)" :class="{'spancolor' : type==10}"
                      v-if="isShowByPermission('/starGroup/starGroupManageLateattendAnceStMan')">迟到出勤</span>
                <span @click="spanclick(11)" :class="{'spancolor' : type==11}"
                      v-if="isShowByPermission('/starGroup/starGroupManageDressInstrumentStMan')">着装仪表</span>
                <span @click="spanclick(12)" :class="{'spancolor' : type==12}"
                      v-if="isShowByPermission('/starGroup/starGroupManageTeamIncludesStMan')">团队板报</span>
                <span @click="spanclick(13)" :class="{'spancolor' : type==13}"
                      v-if="isShowByPermission('/starGroup/starGroupManageResidentStudentsStMan')">住宿生</span>
                <span @click="spanclick(14)" :class="{'spancolor' : type==14}"
                      v-if="isShowByPermission('/starGroup/starGroupManageRewardsPunishmentsStMan')">奖惩</span>
                <span @click="spanclick(15)" :class="{'spancolor' : type==15}"
                      v-if="isShowByPermission('/starGroup/starGroupManageRecessStMan')">课间</span>
                <span @click="spanclick(17)" :class="{'spancolor' : type==17}"
                      v-if="isShowByPermission('/starGroup/starGroupManageclmlunchstMan')">写字</span>
                <span @click="spanclick(18)" :class="{'spancolor' : type==18}"
                      v-if="isShowByPermission('/starGroup/starGroupManageclmClearSchooolstMan')">清校</span>
            </div>
            <div class="list-box">
                <div class="Notime" v-if="dataList.length==0">当前检查项时间段内暂无数据</div>
                <div class="box" :key="indexs" v-for="(items,indexs) in dataList">
                    <h3>{{items.name}}</h3>
                    <ul>
                        <li :key="index" v-for="(item,index) in items.list">
                            <span :title="item.className">{{item.className}}</span>
                            <span>检查{{item.checkCount}}次</span>
                            <span>问题{{item.problemCount}}次</span>
                            <span>占比{{item.Percentage}}%</span>
                        </li>


                    </ul>
                </div>

            </div>
        </div>

    </div>
</template>
<script>
    import {isShowByPermission} from '@/utils';
    //窗口大小调整
    import mixin from '@/mixins/windowResize';
    import moment from "moment";
    import {getClassCheckCountRecordList} from "@/api/campusInspection";

    export default {
        data() {
            return {
                isnum: 0,
                startDate: this.$moment().format("YYYY-MM-DD"), //开始时间
                endDate: this.$moment().format("YYYY-MM-DD"), //结束时间
                type: 1,
                dataList: [],
                dateRange: [this.$moment(new Date()).format('YYYY-MM') + '-01', new Date()],
            };
        },
        mixins: [mixin],
        mounted() {
            this.isnum = window.sessionStorage.getItem('isnum');
            let date = new Date();
            let gapMonth = date.getMonth()
            let gapMonthFirstDay = new Date(date.getFullYear(), gapMonth, 1);
            this.startDate = this.format_date(gapMonthFirstDay);
            this.isswitch();
            this.getClassCheckCountRecordLists()
        },
        methods: {
            //判断展示第一条
            isswitch() {
                let list = ['/starGroup/starGroupManageclmmorstMan',
                    '/starGroup/starGroupManageclmstMan',
                    '/starGroup/starGroupManagehealthstMan',
                    '/starGroup/starGroupManagemormeetstMan',
                    '/starGroup/starGroupManagestmorexcstMan',
                    '/starGroup/starGroupManageeyestMan',
                    '/starGroup/starGroupManagelowcarbonstMan',
                    '/starGroup/starGroupManageclassletstMan',
                    '/starGroup/starGroupManageInsGroupStatisticalMan',
                    '/starGroup/starGroupManageLateattendAnceStMan',
                    '/starGroup/starGroupManageDressInstrumentStMan',
                    '/starGroup/starGroupManageTeamIncludesStMan',
                    '/starGroup/starGroupManageResidentStudentsStMan',
                    '/starGroup/starGroupManageRewardsPunishmentsStMan',
                    '/starGroup/starGroupManageRecessStMan',
                    '/dining/getDiningListStMan',
                    '/starGroup/starGroupManageclmlunchstMan',
                    '/starGroup/starGroupManageclmClearSchooolstMan',
                    '/insGuard/insGroupListStatisticalMan',
                    '/pew/getStatisticalPewRecordListByDateMan',
                    '/exercise/exerciseGroupSetStatisticalMan',
                    '/basedCurr/getBasedCurrRecordStatisticalMan',
                    '/appointCheck/toGroupStatisticsPageMan',
                ];
                for (let i = 0; i < list.length; i++) {
                    if (this.isShowByPermission(list[i])) {
                        this.type = i + 1;
                        return;
                    }

                }
            },
            //返回
            goback() {
                this.$router.back();
            },
            //权限
            isShowByPermission,
            //时间转换格式
            format_date(DateFor) {
                let year = DateFor.getFullYear()
                let month = DateFor.getMonth() + 1
                let day = DateFor.getDate()
                if (month >= 1 && month <= 9) {
                    month = "0" + month;
                }
                if (day >= 0 && day <= 9) {
                    day = "0" + day;
                }
                let tmp = year + '-' + month + '-' + day
                return tmp
            },
            //点击
            spanclick(type) {
                this.type = type;
                this.getClassCheckCountRecordLists()
            },
            //获取详情
            getClassCheckCountRecordLists() {
                 this.dataList=[];
                 this.startDate =this.$moment(this.dateRange[0]).format('YYYY-MM-DD'); //时间
                 this.endDate = this.$moment(this.dateRange[1]).format('YYYY-MM-DD'); //时间
                getClassCheckCountRecordList(this.startDate, this.endDate, this.type).then(res => {
                    let data = res.data.data;
                    let list = [];
                    this.dataList = [];
                    let myis = false;
                    for (let i = 0; i < data.length; i++) {
                        for (let j = 0; j < list.length; j++) {
                            if (data[i].gradeId == list[j].id) {
                                myis = true;
                            }
                        }
                        if (!myis) {
                            list.push({id: data[i].gradeId, name: data[i].gradeName});
                        }
                        myis = false;
                    }
                    for (let j = 0; j < list.length; j++) {
                        let obj = {
                            name: list[j].name,
                            list: []
                        }
                        for (let i = 0; i < data.length; i++) {
                            if (data[i].gradeId == list[j].id) {
                                data[i].Percentage = ((data[i].problemCount * 100) / data[i].checkCount).toFixed(2);
                                obj.list.push(data[i])
                            }
                        }
                        this.dataList.push(obj);
                    }
                });
            }

        }
    };
</script>
<style scoped>
    ul, li {
        list-style: none;
    }

    .top {
        border-bottom: 1px solid #e7eaec;
        padding-bottom: 10px;
    }

    .select {
        margin-top: 10px;
        padding-left: 100px;
    }

    .subject {
        padding: 10px;
        overflow: auto;
    }

    .top .botton {
        width: 80%;
        margin-right: 10%;
        overflow: hidden;
        float: right;
    }

    .botton span {
        width: 33%;
        line-height: 34px;
        float: left;
        text-align: center;
        background: #fff;
        border: 1px solid #bfcbd9;
        cursor: pointer;
    }

    .botton .tabcolor {
        color: #fff;
        background-color: #20a0ff;
        border-color: #20a0ff;
        -webkit-box-shadow: -1px 0 0 0 #20a0ff;
        box-shadow: -1px 0 0 0 #20a0ff;
    }

    .tab-right {
        border-radius: 0 4px 4px 0;
    }

    .tab-left {
        border-radius: 4px 0 0 4px;
    }

    .time-box {
        width: 80%;
        margin-top: 10px;
        margin-left: 10%;
        float: left;
    }

    .button-box span {
        display: inline-block;
        line-height: 1;
        white-space: nowrap;
        cursor: pointer;
        background: #fff;
        border: 1px solid #bfcbd9;
        border-color: #c4c4c4;
        color: #1f2d3d;
        -webkit-appearance: none;
        text-align: center;
        box-sizing: border-box;
        outline: none;
        margin: 0;
        -moz-user-select: none;
        -webkit-user-select: none;
        -ms-user-select: none;
        padding: 10px 15px;
        font-size: 14px;
        border-radius: 4px;
        margin-bottom: 5px;
    }

    .button-box span:hover {
        color: #1d90e6;
        border-color: #1d90e6;
        outline: none;
    }

    .button-box span.spancolor {
        color: #fff;
        background-color: #20a0ff;
        border-color: #20a0ff;
    }

    .button-box {
        height: 82px;
    }

    .list-box {
        overflow: hidden;
    }

    .list-box .box {
        width: 32%;
        height: 320px;
        margin: 10px 0.5%;
        float: left;
        padding: 5px 10px;
        box-sizing: border-box;
        box-shadow: 5px 5px 15px #ddd;
        border: 1px solid #e8e8e8;
        border-radius: 5px;
        position: relative;
        cursor: pointer;

    }

    .list-box .box h3 {
        font-size: 18px;
        font-weight: 600;
        text-align: center;
        border-bottom: 2px solid #ccc;
        line-height: 40px;
        color: #555;
        margin: 0;
    }

    .list-box .box ul {
        height: 240px;
        overflow: auto;
        padding: 0;
    }

    .list-box .box ul li {
        padding: 8px 0;
        color: rgb(44, 62, 80);
        font-size: 13px;
        overflow: auto;


    }

    .list-box .box ul li span {
        width: 25%;
        float: left;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .Notime {
        text-align: center;
        font-size: 30px;
        line-height: 100px;
        color: #666;
        width: 100%;
    }
</style>
