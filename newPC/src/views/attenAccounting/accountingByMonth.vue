<template>
    <div class="page">
        <div class="header">
            <el-row>
                <el-col :span="20">
                    <!--                    <el-button @click="$router.back()" v-if="code==2" type="default" size="medium">返回</el-button>-->
<!--                                        <el-button type="primary" size="medium" @click.native="toAttendanceStatistics">考勤统计</el-button>-->
                    <el-radio-group size="medium" v-model="active" @change="onTabChange">
                        <el-radio-button label="date">当日统计</el-radio-button>
                        <el-radio-button label="month">当月统计</el-radio-button>
                    </el-radio-group>
                    <el-date-picker
                        size="medium"
                        @change="getData"
                        format="yyyy-MM"
                        value-format="yyyy-MM"
                        v-model="date"
                        align="right"
                        :clearable="false"
                        type="month"
                        placeholder="选择日期"
                    >
                    </el-date-picker>
                </el-col>

            </el-row>
        </div>
        <div class="clearfix main">
            <div>
                <div class="title">本月教师出勤</div>
                <div class="">
                    <div class="section section--atten">
                        <div class="section__title">
                            <i class="color-band"></i>考勤统计
                        </div>
                        <div class="chart" id="atten-chart"></div>
                    </div>
                    <div class="section section--leave">
                        <div class="section__title">
                            <i class="color-band"></i>请假统计
                        </div>
                        <div class="chart" id="leave-chart"></div>
                    </div>
                </div>
                <div class="">
                    <div class="section section--dikou">
                        <div class="section__title">
                            <i class="color-band"></i>抵扣统计
                        </div>
                        <div class="line">
                            <div class="data-item">
                                <div class="data-item__data">{{deductionData.totalCount}}</div>
                                <div class="data-item__text">抵扣发放(张)</div>
                            </div>
                            <div class="data-item" @click="jumpToPage('overtimeDeduction/statistics', {isShowBack: 1})">
                                <div class="data-item__data">{{deductionData.usedCount}}</div>
                                <div class="data-item__text">抵扣条使用(张)</div>
                            </div>
                            <div class="data-item">
                                <div class="data-item__data">{{deductionData.nowCanUseCount}}</div>
                                <div class="data-item__text">抵扣条剩余(张)</div>
                            </div>
                            <div class="data-item">
                                <div class="data-item__data">{{deductionData.overdueCount}}</div>
                                <div class="data-item__text">抵扣条过期(张)</div>
                            </div>
                        </div>
                        <div class="line">
                            <div class="data-item">
                                <div class="data-item__data">{{deductionData.leaveCount}}</div>
                                <div class="data-item__text">请假总人次(次)</div>
                            </div>
                            <div class="data-item">
                                <div class="data-item__data">{{deductionData.leaveUseNum}}</div>
                                <div class="data-item__text">使用抵扣条(次)</div>
                            </div>
                            <div class="data-item">
                                <div class="data-item__data">{{deductionData.leaveNotUseNum}}</div>
                                <div class="data-item__text">未使用抵扣条(次)</div>
                            </div>
                        </div>
                    </div>
                    <div class="section section--out">
                        <div class="section__title">
                            <i class="color-band"></i>外出
                        </div>
                        <div class="line">
                            <div class="data-item data-item--standalone" @click="toPage('outApplyStatistics/outApplyList')">
                                <div class="data-item__data">{{outCount}}
                                    <span class="data-item__data-text">人次</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="section section--extra">
                        <div class="section__title">
                            <i class="color-band"></i>加班
                        </div>
                        <div class="line">
                            <div class="data-item data-item--standalone" @click="toPage('extraWork/extraWorklistone')">
                                <div class="data-item__data">{{extraCount}}
                                    <span class="data-item__data-text">人次</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import {isShowByPermission} from '@/utils';
    import {
        attendanceAnalysis,
        getStatisticsTypeCount,
        getSchoolOvertimeDeductionStaticsByMonth,
        todayAttendanceAnalysis,
        getOutApplyCount,
        getExtraUserCountBySchoolIdAndDateRange,getGateInfoExceptionCount
    } from '@/api/schoolManage/teacherAttendanceStatistics';
    import moment from "moment";

    export default {
        name: "teacherAttendanceStatisticsIndex",
        data() {
            return {
                code: 0,
                active: 'month',
                date: moment().format('YYYY-MM'),
                outCount: 0,
                extraCount: 0,
                attenData: {},
                deductionData: {},
                leaveTypeList: []
            }
        },
        created() {
            this.getData();
            if ((this.$route.query.code) && (this.$route.query.code == 2)) {
                this.code = this.$route.query.code;
            }
        },
        methods: {
            drawBarChart(container, args) {
                const option = {
                    tooltip: {
                        trigger: 'axis',
                        formatter: function (params) {
                            const textMapping = ['异常外出','迟到', '缺勤', '早退', '缺卡', '正常出勤'];
                            let text = '';
                            text += `${textMapping[params[0].dataIndex]}${params[0].value}人次`
                            if (params[1].value !== 0) {
                                text += `<br />应出勤${params[1].value}人次`
                            }
                            return text;
                        }
                    },
                    legend: {
                        show: false
                    },
                    grid: {
                        left: '3%',
                        right: '14%',
                        bottom: '3%',
                        top: '2%',
                        containLabel: true
                    },
                    xAxis: {
                        type: 'value',
                        splitLine: {show: false},
                        axisLine: {show: false},
                        axisTick: {show: false},
                        axisLabel: {show: false}
                    },
                    yAxis: [{
                        type: 'category',
                        data: ['', '', '', '', '', ''],
                        axisLine: {show: false},
                        splitLine: {show: false},
                        axisTick: {show: false},
                        axisLabel: {show: false}
                    }, {
                        type: 'category',
                        data: ['', '', '', '', '', ''],
                        splitLine: {show: false},
                        axisLine: {show: false},
                        axisTick: {show: false},
                        axisLabel: {show: false}

                    }],
                    series: [
                        {
                            name: '',
                            type: 'bar',
                            label: {
                                show: true,
                                position: 'right',
                                color: '#000',
                                formatter: function (params) {
                                    if (params.value === 0) {
                                        return '';
                                    } else {
                                        return `应出勤${params.value}人次`;
                                    }
                                }
                            },
                            emphasis: {
                                focus: 'series'
                            },
                            data: args.seriesData1,
                            yAxisIndex: 1,
                            itemStyle: {
                                normal: {
                                    color: '#FFB980',
                                    barBorderRadius: [20, 20, 20, 20]
                                }
                            },
                            barWidth: '20',
                            barGap: '10',
                            barCategoryGap: '10'
                        },
                        {
                            name: '',
                            type: 'bar',
                            stack: 'total',
                            label: {
                                show: true,
                                position: 'right',
                                color: '#000',
                                formatter: function (params) {
                                    const textMapping = ['异常外出','迟到', '缺勤', '早退', '缺卡', '正常出勤'];
                                    return `${textMapping[params.dataIndex]}${params.value}人次`;
                                }
                            },
                            emphasis: {
                                focus: 'series'
                            },
                            barWidth: '20',
                            barGap: '10',
                            barCategoryGap: '10',
                            data: args.seriesData2,
                            itemStyle: {
                                normal: {
                                    color: function (params) {
                                        return [
                                            '#78DE8E',
                                            '#00D4DA',
                                            '#FFD659',
                                            '#FC7D7D',
                                            '#5AB1EF',
                                            '#00D4DA',
                                        ][params.dataIndex];
                                    },
                                    barBorderRadius: [20, 20, 20, 20]
                                }
                            }
                        },
                    ]
                };
                if (document.getElementById(container)) {
                    const myChart = echarts.init(document.getElementById(container));
                    myChart.setOption(option, true);
                    myChart.on('click', (param) => {
                        let type = 0;
                        if(param.dataIndex == 5) {
                            type = 3;
                        } else if(param.dataIndex == 4) {
                            type = 5;
                        } else if(param.dataIndex == 3) {
                            type = 2;
                        } else if(param.dataIndex == 2) {
                            type = 4;
                        } else {
                            type = 1;
                        }
                      if(param.dataIndex==0){
                        this.jumpToPage('abnormal', {
                            startDate: `${this.date}-01`,
                            endDate: moment(`${this.date}-01`).endOf('month').format('YYYY-MM-DD'),
                            type:2
                        })

                      }else{
                             this.jumpToPage('teacherAttendanceStatisticsRangeList', {
                            type,
                            startDate: `${this.date}-01`,
                            endDate: moment(`${this.date}-01`).endOf('month').format('YYYY-MM-DD')
                        })
                      }
                     
                    });
                }
            },
            drawPayPieChart(container, data, config) {
                let dataName = [];
                let total = 0;
                data.forEach((res) => {
                    dataName.push(res.name);
                    total += parseFloat(res.value);
                });
                let option = {
                    title: {
                        zlevel: 0,
                        rich: {
                            name: {
                                color: '#303133',
                                fontSize: 40,
                                fontWeight: 'bold',
                                lineHeight: 40,
                            },
                            value: {
                                color: '#909399',
                                lineHeight: 20
                            },
                        },
                        text: [
                            '{value|' + total + '}',
                            `{name|${config.totalText}}`,
                        ].join('\n'),
                        top: '96',
                        left: '138',
                        textAlign: 'center',
                        textStyle: {
                            rich: {
                                value: {
                                    color: '#303133',
                                    fontSize: 40,
                                    fontWeight: 'bold',
                                    lineHeight: 40,
                                },
                                name: {
                                    color: '#909399',
                                    lineHeight: 20
                                },
                            },
                        },
                    },
                    tooltip: { // 悬停指示
                        trigger: 'item',
                        formatter: "{b}: {c} ({d}%)"
                    },
                    legend: {
                        x: 'right',
                        y: 'top',
                        align: 'left',
                        data: dataName,
                        itemGap: 10,
                        padding: [50, 100, 80, 500],
                        top: 'top',
                        icon: 'circle',
                        formatter: function (name) {
                            const index = dataName.indexOf(name);
                            return `${name}   ${data[index].value}人次`;
                        }
                    },
                    series: [
                        {
                            name: '课程类型',
                            type: 'pie',
                            radius: ['50%', '80%'],
                            center: [140, '50%'],
                            stillShowZeroSum: false,
                            avoidLabelOverlap: false,
                            zlevel: 1,
                            label: {
                                normal: {
                                    padding: [100, 5, 5, 40],
                                    backgroundColor: '#fff',
                                    show: false,
                                    position: 'center',
                                    formatter: [
                                        '{value|{c}}',
                                        '{name|{b}}'
                                    ].join('\n'),
                                    rich: {
                                        value: {
                                            color: '#303133',
                                            fontSize: 40,
                                            fontWeight: 'bold',
                                            lineHeight: 40,
                                        },
                                        name: {
                                            color: '#909399',
                                            lineHeight: 20,
                                        },
                                    },
                                }
                            },
                            data: data
                        }
                    ],
                    color: ['#2EC7C9', '#D97A80', '#59B1F0', '#FFB780', '#FACB1B', '#B6A2DE']
                };
                if (document.getElementById(container)) {
                    const myChart = echarts.init(document.getElementById(container));
                    myChart.setOption(option, true);
                    myChart.on('click',  (param) => {
                        // console.log(this.leaveTypeList);
                        // console.log(this.leaveTypeList[param.dataIndex]);
                        if(isShowByPermission('/thAskLeaveFour/getStatisticsList')) {
                            this.jumpToPage('teacherLeave4/leaveTable', {
                                leaveType: this.leaveTypeList[param.dataIndex].leaveTypeId,
                                startDate: `${this.date}-01`,
                                endDate: moment(`${this.date}-01`).endOf('month').format('YYYY-MM-DD')
                            })
                        } else {
                            this.jumpToPage('teacherleave/teacherleavelist', {
                                leaveType: this.leaveTypeList[param.dataIndex].leaveTypeId,
                                startDate: `${this.date}-01`,
                                endDate: moment(`${this.date}-01`).endOf('month').format('YYYY-MM-DD')
                            })
                        }

                    });
                }
            },
            onTabChange() {
                if (this.active === 'date') {
                    this.jumpToPage('accountingByDate');
                }
            },
            jumpToPage(path, query = {}) {
                this.$router.push({
                    path,
                    query
                })
            },
            toPage(path) {
                const startDate = `${this.date}-01`;
                const endDate = moment(`${this.date}-01`).endOf('month').format('YYYY-MM-DD');
                this.jumpToPage(path, {startDate, endDate});
            },
            getData() {
                getGateInfoExceptionCount({
                    startDate: `${this.date}-01`,
                    endDate: moment(`${this.date}-01`).endOf('month').format('YYYY-MM-DD')
                })
                    .then(res => res.data)
                    .then(data => {
                        let newnum = data.data
                        attendanceAnalysis({
                    startDate: `${this.date}-01`,
                    endDate: moment(`${this.date}-01`).endOf('month').format('YYYY-MM-DD')
                })
                    .then(res => res.data)
                    .then(data => {
                        const pageData = data.data
                        this.attenData = pageData;
                        this.drawBarChart('atten-chart', {
                            seriesData1: [0, 0, 0, 0,0, pageData.totalCount],
                            seriesData2: [
                                newnum,
                                pageData.lateDay,
                                pageData.absentDay,
                                pageData.leaveEarlyDay,
                                pageData.exceptionDay,
                                pageData.attendDay,
                            ]
                        })
                    });
                    });
                
                getStatisticsTypeCount({
                    startDate: `${this.date}-01`,
                    endDate: moment(`${this.date}-01`).endOf('month').format('YYYY-MM-DD')
                })
                    .then(res => res.data)
                    .then(data => {
                        const pageData = data.data
                        this.leaveTypeList = pageData.typeListArray.filter(item => item.askCount != 0);
                        const seriesData = pageData.typeListArray.filter(item => item.askCount != 0).map(item => {
                            return {
                                value: item.askCount,
                                name: item.leaveTypeName
                            }
                        })
                        this.c1 = this.drawPayPieChart('leave-chart', seriesData, {
                            totalText: '请假总数'
                        });
                    });
                getSchoolOvertimeDeductionStaticsByMonth({
                    monthStr: this.date
                })
                    .then(res => res.data)
                    .then(data => {
                        this.deductionData = data.data;
                    })
                this.todayAttendanceAnalysis();
                this.getOutApplyCount();
                this.getExtraUserCountBySchoolIdAndDateRange();
            },
            todayAttendanceAnalysis() {
                todayAttendanceAnalysis({
                    date: this.date
                }).then(res => {
                    const data = res.data;
                    if (data.code === 200) {
                        this.todayAttendanceList = data.data;
                    }
                }).catch(() => {
                });
            },
            getOutApplyCount() {
                getOutApplyCount({
                    startDate: `${this.date}-01`,
                    endDate: moment(`${this.date}-01`).endOf('month').format('YYYY-MM-DD')
                })
                    .then(res => res.data)
                    .then(data => {
                        this.outCount = data.data;
                    })
            },
            getExtraUserCountBySchoolIdAndDateRange() {
                getExtraUserCountBySchoolIdAndDateRange({
                    startDate: `${this.date}-01`,
                    endDate: moment(`${this.date}-01`).endOf('month').format('YYYY-MM-DD')
                })
                    .then(res => res.data)
                    .then(data => {
                        this.extraCount = data.data;
                    })
            },
            toAttendanceStatistics() {
                this.$router.push({path: 'teacherAttendanceStatisticsList'});
            },
        }
    }
</script>

<style scoped>
    .page {
        height: 100%;
        padding: 12px;
    }

    .header {
        padding-bottom: 10px;
        border-bottom: 1px solid #e7eaec;
        background: #fff;
    }

    .clearfix:after {
        content: "";
        display: block;
        font-size: 0;
        height: 0;
        clear: both;
        visibility: hidden;
    }

    .clearfix {
        zoom: 1;
    }

    .section {
        border: 1px solid rgba(221, 221, 221, 1);
        float: left;
        padding: 12px 5px;
        box-sizing: border-box;
    }

    .section--atten, .section--leave {
        width: 48.4%;
        height: 320px;
        margin-bottom: 30px;

    }

    .section--leave {
        margin-left: 3%;

    }

    .section--dikou {
        width: 68%;
        height: 320px;
        margin-right: 3%;
    }

    .section--out, .section--extra {
        width: 29%;
        height: 145px;
    }

    .section--out {
        margin-bottom: 30px;
    }

    #atten-chart {
        width: 100%;
        height: 230px;
        margin-top: 26px;
    }
    #leave-chart {
        width: 100%;
        height: 250px;
    }

    .section__title {
        text-align: center;
        font-weight: bold;
        color: #333;
        font-size: 20px;

    }

    .color-band {
        border-left: 3px solid rgba(47, 149, 255, 1);
        padding-left: 5px;
    }

</style>
<style lang="scss" scoped>
    .title {
        color: rgba(55, 96, 141, 1);
        font-size: 26px;
        font-weight: bold;
        text-align: center;
        width: 100%;
        margin-bottom: 20px;
    }
    .data-item {
        display: inline-block;
        text-align: center;
        width: 24.5%;
        height: 60px;
        margin-top: 36px;
        &:nth-child(1) {
            color: #2EC7C9;
        }
        &:nth-child(2) {
            color: #FFB980;
        }
        &:nth-child(3) {
            color: #5AB1EF;
        }
        &:nth-child(4) {
            color: #B6A2DE;
        }
        .data-item__data {
            font-size: 36px;
            margin-bottom: 5px;
        }
        .data-item__text {
            color: #5F5F5F;
        }
    }
    .data-item__data-text {
        font-size: 14px;
        color: #5F5F5F;
        margin-right: -10px;
    }
    .data-item.data-item--standalone {
        width: 100%;
        cursor: pointer;
    }
    .main {
        padding: 15px 0;
        min-width: 1000px;
        max-width: 1500px;
        margin: 0 auto;
    }
</style>
