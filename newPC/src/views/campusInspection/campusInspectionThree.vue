<template>
    <div style="padding:10px">
        <div class="top">
            <el-button size="medium" type="primary" @click="goback()" v-if="isnum==1">返回</el-button>

             <el-date-picker v-model="dateRange" type="daterange" class="mywidthdaterange" range-separator="-" :clearable="false"
                                size="medium"   @change="spanclick(type)"
                                start-placeholder="开始日期" end-placeholder="结束日期">
           </el-date-picker>
        </div>
        <div class="subject">
            <div class="button-box">
                        <span @click="spanclick(1)" :class="{'spancolor' : type==1}"
                              v-if="isShowByPermission('/starGroup/starGroupManageclmmorstMan')">早自习</span>
                <span @click="spanclick(2)" :class="{'spancolor' : type==2}"
                      v-if="isShowByPermission('/starGroup/starGroupManageclmstMan')">课堂</span>
                <span @click="spanclick(8)" :class="{'spancolor' : type==8}"
                      v-if="isShowByPermission('/starGroup/starGroupManageclassletstMan')">午餐</span>
                <span @click="spanclick(17)" :class="{'spancolor' : type==17}"
                      v-if="isShowByPermission('/starGroup/starGroupManageclmlunchstMan')">写字</span>
            </div>
            <div class="time-table">
                <el-table stripe :data="dataList" v-loading.body="listLoading" border fit highlight-current-row
                          style="width: 100%" :height="maxH-30">
                    <el-table-column align="center" label="序号" width="80" property="num"></el-table-column>
                    <el-table-column align="center" label="姓名" property="thUserName"></el-table-column>
                    <el-table-column align="center" label="被检查次数" property="checkCount"></el-table-column>
                    <el-table-column align="center" label="问题次数" property="problemCount"></el-table-column>
                    <el-table-column align="center" label="问题比例">
                        <template slot-scope="scope">
                            <span>{{scope.row.Percentage}}%</span>
                        </template>
                    </el-table-column>

                </el-table>
            </div>
            <div class="pagination-container">
                <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                               :current-page.sync="pageNo" :page-sizes="[10,20,30, 50]"
                               :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper"
                               :total="total">
                </el-pagination>
            </div>
        </div>

    </div>
</template>
<script>
    import {isShowByPermission} from '@/utils';
    //窗口大小调整
    import mixin from '@/mixins/windowResize';
    import moment from "moment";
    import {getThCheckCountRecordList} from "@/api/campusInspection";

    export default {
        data() {
            return {
                isnum: 0,
                listLoading: false,
                total: null,
                startDate: this.$moment().format("YYYY-MM-DD"), //开始时间
                endDate: this.$moment().format("YYYY-MM-DD"), //结束时间
                type: 1,
                pageSize: 20,
                pageNo: 1,
                dataList: [],
                activeName: 'three',
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
            this.getThCheckCountRecordLists();

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
                ;
                if (day >= 0 && day <= 9) {
                    day = "0" + day;
                }
                ;
                let tmp = year + '-' + month + '-' + day
                return tmp
            },

            //班级统计
            tabsfun() {
                if (this.activeName == 'two') {
                    this.$router.replace({
                        path: "campusInspectiontwo",
                        query: {
                            isnum: this.isnum
                        }
                    });
                } else if (this.activeName == 'one') {
                    this.$router.replace({
                        path: "campusInspectionone",
                        query: {
                            isnum: this.isnum
                        }
                    });

                }

            },
            //点击
            spanclick(type) {
                this.type = type;
                this.getThCheckCountRecordLists()
            },
            //获取详情
            getThCheckCountRecordLists() {
                this.startDate =this.$moment(this.dateRange[0]).format('YYYY-MM-DD'); //时间
                 this.endDate = this.$moment(this.dateRange[1]).format('YYYY-MM-DD'); //时间
                this.listLoading = true;
                 this.dataList=[];
                getThCheckCountRecordList(this.startDate, this.endDate, this.type, this.pageNo, this.pageSize).then(res => {
                    let data = res.data.data;
                    for (let i = 0; i < data.dataList.length; i++) {
                        data.dataList[i].Percentage = ((data.dataList[i].problemCount * 100) / data.dataList[i].checkCount).toFixed(2);
                        data.dataList[i].num = i + 1;
                    }
                    ;
                    this.dataList = data.dataList;
                    this.listLoading = false;
                    this.total = data.pagination.total;
                });
            },
            handleSizeChange(val) {
                this.pageSize = val;
                this.getThCheckCountRecordLists();
            },
            handleCurrentChange(val) {
                this.pageNo = val;
                this.getThCheckCountRecordLists();
            }
        }
    };
</script>
<style scoped>
    .top {
        padding-bottom: 10px;
    }

    .select {
        margin-top: 10px;
        padding-left: 100px;
    }

    .subject {
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
</style>
