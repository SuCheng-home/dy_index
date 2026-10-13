<template>
    <div class="page">
        <el-tabs v-model="selectedPanel" type="border-card" @tab-click="tabClickHandler">
            <el-tab-pane label="系统" name="system">
                <div class="body" :style="`height:${nobottommaxH-10}px`">
                    <el-card class="box-card user-info-card box-card--left">
                    <div slot="header" class="box-card-header">
                        用户数
                    </div>
                    <div class="box-card-item">
                        <div class="box-card-item__head">用户数</div>
                        <div class="box-card-item__data">{{ pageData.countUser }}</div>
                    </div>
                    <div class="box-card-item">
                        <div class="box-card-item__head">关注数</div>
                        <div class="box-card-item__data">{{ pageData.countAttendUser }}</div>
                    </div>
                    <div class="box-card-item">
                        <div class="box-card-item__head">关注率</div>
                        <div class="box-card-item__data">{{ pageData.attentionRate }}%</div>
                    </div>
                </el-card>
                <el-card class="box-card access-info-card box-card--right">
                    <div slot="header" class="box-card-header">
                        访问数
                    </div>
                    <div class="box-card-item">
                        <div class="box-card-item__head">昨日访问量</div>
                        <div class="box-card-item__data">{{ pageData.yesterdayLoginTotal }}次</div>
                    </div>
                    <div class="box-card-item">
                        <div class="box-card-item__head">昨日访问人数</div>
                        <div class="box-card-item__data">{{ pageData.yesterdayLoginUsersTotal }}人</div>
                    </div>
                </el-card>
                <el-card class="box-card box-card--clear">
                    <div slot="header" class="box-card-header">
                        用户关注情况
                    </div>
                    <div class="chart-container chart-container--inline" id="noAttendTeacherChart">
                    </div>
                    <div class="chart-container chart-container--inline" id="noAttendStuChart">
                    </div>
                    <div class="chart-container chart-container--inline" id="weekChart"></div>
                </el-card>
                <el-card class="box-card module-info-box box-card--clear">
                    <div slot="header" class="box-card-header">
                        模块使用情况
                    </div>
                    <div class="chart-container chart-container--inline" id="moduleChart">
                    </div>
                    <div class="chart-container chart-container--inline">
                        <el-table
                                :data="moduleChartData"
                                stripe
                                style="width: 100%;"
                                height="400px"
                        >
                            <el-table-column label="模块名称" :resizable="false">
                                <template slot-scope="scope">
                                    {{ scope.row.name }}
                                </template>
                            </el-table-column>
                            <el-table-column label="使用量" :resizable="false">
                                <template slot-scope="scope">
                                    {{ scope.row.y }}
                                </template>
                            </el-table-column>
<!--                            <el-table-column label="处理量" :resizable="false">-->
<!--                                <template slot-scope="scope">-->
<!--                                    {{ scope.row.yr }}-->
<!--                                </template>-->
<!--                            </el-table-column>-->
                        </el-table>
                    </div>
                </el-card>
                    
                </div>
                
            </el-tab-pane>
            <el-tab-pane label="应用" name="app">
                <div class="body" :style="`height:${nobottommaxH-10}px`">
                    <el-card class="box-card box-card--left">
                    <div slot="header" class="box-card-header">
                        一周请假曲线
                    </div>
                    <div class="chart-container ask-leave-chart" id="askLeaveChart"></div>
                </el-card>

                <el-card class="box-card box-card--right attend-container">
                    <div slot="header" class="box-card-header">
                        今日出勤情况
                    </div>
                    <el-table
                            stripe
                            :data="schoolLogData"
                            style="width: 100%"
                    >
                        <el-table-column label="" :resizable="false">
                            <template slot-scope="scope">
                                {{ scope.row.name }}
                            </template>
                        </el-table-column>
                        <el-table-column label="人数" :resizable="false">
                            <template slot-scope="scope">
                                {{ scope.row.workNum }}
                            </template>
                        </el-table-column>
                        <el-table-column label="到勤" :resizable="false">
                            <template slot-scope="scope">
                                {{ scope.row.arriveNum }}
                            </template>
                        </el-table-column>
                        <el-table-column label="请假" :resizable="false">
                            <template slot-scope="scope">
                                {{ scope.row.leaveNum }}
                            </template>
                        </el-table-column>
                    </el-table>
                </el-card>
                <el-card class="box-card box-card--right stop-diet-container">
                    <div slot="header" class="box-card-header">
                        今日停伙情况
                    </div>
                    <div>
                        <div>
                            
                            <!-- <span class="info-item">教师停伙：{{stopDietData.teaFireCount}}次</span> -->
                             <span class="info-item" v-if="stopDietData.stuBreakfastFireCount"
                                >学生早餐停伙：{{ stopDietData.stuBreakfastFireCount }}次</span
                                >
                                <span class="info-item" v-if="stopDietData.stuBreakFireCount"
                                >学生课间餐停伙：{{ stopDietData.stuBreakFireCount }}次</span
                                >
                                <span class="info-item"
                                >学生午餐停伙：{{ stopDietData.stuLunFireCount }}次</span
                                ><br />
                                <span class="info-item" v-if="stopDietData.stuSupperFireCount"
                                >学生晚餐停伙：{{ stopDietData.stuSupperFireCount }}次</span
                                >
                                <span class="info-item" v-if="stopDietData.teaBreakfastCount"
                                >教师早餐停伙：{{ stopDietData.teaBreakfastCount }}次</span
                                >
                                <span class="info-item"
                                >教师午餐停伙：{{ stopDietData.teaLunFireCount }}次</span
                                >
                                <span class="info-item" v-if="stopDietData.teaSupperFireCount"
                                >教师晚餐停伙：{{ stopDietData.teaSupperFireCount }}次</span
                                >
                        </div>

                    </div>
                </el-card>
                <el-card class="box-card box-card--right repair-container" v-if="!isKindergarten">
                    <div slot="header" class="box-card-header">
                        一周报修情况
                    </div>
                    <div>
                        <span class="info-item">共计<span class="word-green">{{ repairData.repairCount
                            }}次</span></span>
                        <span class="info-item">已处理<span class="word-green">{{ repairData.yesBatchCount
                            }}次</span></span>
                        <span class="info-item">未处理<span class="word-green">{{ repairData.notBatchCount
                            }}次</span></span>
                    </div>
                </el-card>
                <el-card class="box-card--clear box-card" v-if="!isKindergarten">
                    <div slot="header" class="box-card-header">
                        资源预约情况
                    </div>
                    <div class="table-container">
                        <el-table stripe class="chart-bar-table"
                                  :data="resourceOrderData"
                                  border
                                  style="width: 100%"
                        >
                            <el-table-column
                                    prop="resourceName"
                                    label="资源名称"
                                    show-overflow-tooltip
                                    fit
                                    min-width="200"
                                    :resizable="false"
                            >
                            </el-table-column>
                            <el-table-column label="时间(整点)" align="center">
                                <el-table-column
                                        label="7"
                                        width="80"
                                        align="center"
                                        :resizable="false"
                                >
                                    <template slot-scope="scope">
                                        <div class="chart-bar-container"
                                             v-if="scope.row.times.length !== 0"
                                        >
                                            <el-tooltip
                                                    v-for="(timeEntry, index) in scope.row.times"
                                                    class="item"
                                                    effect="dark"
                                                    :content="`使用人：${ timeEntry.userName }，预约理由：${ timeEntry.title !== '' ? timeEntry.title : '无' }，预约时间：${ timeEntry.starTime } 至 ${ timeEntry.endTime }${ timeEntry.state === 0 ? '，待审核' : '' }`"
                                                    placement="top"
                                                    :key="index"
                                            >
                                                <div
                                                        class="chart-bar"
                                                        :style="[calcBarStyle(timeEntry)]"
                                                ></div>
                                            </el-tooltip>
                                        </div>
                                    </template>
                                </el-table-column>
                                <el-table-column
                                        label="8"
                                        width="80"
                                        align="center"
                                        :resizable="false"
                                >
                                </el-table-column>
                                <el-table-column
                                        label="9"
                                        width="80"
                                        align="center"
                                        :resizable="false"
                                >
                                </el-table-column>
                                <el-table-column
                                        label="10"
                                        width="80"
                                        align="center"
                                        :resizable="false"
                                >
                                </el-table-column>
                                <el-table-column
                                        label="11"
                                        width="80"
                                        align="center"
                                        :resizable="false"
                                >
                                </el-table-column>
                                <el-table-column
                                        label="12"
                                        width="80"
                                        align="center"
                                        :resizable="false"
                                >
                                </el-table-column>
                                <el-table-column
                                        label="13"
                                        width="80"
                                        align="center"
                                        :resizable="false"
                                >
                                </el-table-column>
                                <el-table-column
                                        label="14"
                                        width="80"
                                        align="center"
                                        :resizable="false"
                                >
                                </el-table-column>
                                <el-table-column
                                        label="15"
                                        width="80"
                                        align="center"
                                        :resizable="false"
                                >
                                </el-table-column>
                                <el-table-column
                                        label="16"
                                        width="80"
                                        align="center"
                                        :resizable="false"
                                >
                                </el-table-column>
                                <el-table-column
                                        label="17"
                                        width="80"
                                        align="center"
                                        :resizable="false"
                                >
                                </el-table-column>
                                <el-table-column
                                        label="18"
                                        width="80"
                                        align="center"
                                        :resizable="false"
                                >
                                </el-table-column>
                                <el-table-column
                                        label="19"
                                        width="80"
                                        align="center"
                                        :resizable="false"
                                >
                                </el-table-column>
                            </el-table-column>
                        </el-table>
                    </div>
                </el-card>

                </div>

                
            </el-tab-pane>
        </el-tabs>

        <el-dialog title="未关注学生" :visible.sync="isShowNoAttendStu">
            <div>
                <el-collapse v-model="activeCollapseIndex">
                    <el-collapse-item :title="key" :name="index" :key="key"
                                      v-for="(classEntry, key, index) in studentData">
                        <ul class="students-list">
                            <li class="students-list__item" :key="index" v-for="(name, index) in classEntry">
                                {{ name }}
                            </li>
                        </ul>
                    </el-collapse-item>
                </el-collapse>
            </div>
        </el-dialog>
        <el-dialog title="未关注老师" :visible.sync="isShowNoAttendTeacher">
            <div>
                <ul class="teachers-list">
                    <li class="teachers-list__item" :key="index" v-for="(teacher, index) in teacherData">
                        {{ teacher.name }}
                    </li>
                </ul>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import {
        userIndex,
        getModuleEcharts,
        getModuleDataStatisticsInfo,
        getSchoolLog,
        noAttendUserList,
        fireCountAnalysis,
        getArriveStuCount,
        getCheckWorkUserCount
    } from '@/api/leaderSee';
    import {loadResOrder} from '@/api/resourceOrder';
    import echarts from 'echarts';
    import moment from "moment";
    import mixin from "@/mixins/windowResize";

    export default {
        data() {
            return {
                isKindergarten: false,

                time: this.$moment().format('YYYY-MM-DD'),
                activeCollapseIndex: [],
                selectedPanel: 'system',
                isShowNoAttendStu: false,
                isShowNoAttendTeacher: false,
                pageData: {
                    attendParent: 0,
                    attendTeacher: 0,
                    attentionRate: 0,
                    countAttendUser: 0,
                    countUser: 0,
                    loginTotal: 0,
                    loginUsersTotal: 0,
                    notAttendParent: 0,
                    notAttendTeacher: 0,
                    yesterdayLoginTotal: 0,
                    yesterdayLoginUsersTotal: 0,
                    zeroTime: 0,
                    oneTime: 0,
                    twoTime: 0,
                    threeTime: 0,
                    fourTime: 0,
                    fiveTime: 0,
                    sixTime: 0
                },
                moduleChartData: [],
                noAttendStuChart: null,
                noAttendTeacherChart: null,
                weekChart: null,
                moduleChart: null,
                askLeaveChart: null,
                schoolLogData: [],
                resourceOrderData: [],
                askLeaveData: {
                    dateList: [],
                    stuList: [],
                    teacherList: []
                },
                repairData: {
                    notBatchCount: 0,
                    repairCount: 0,
                    yesBatchCount: 0
                },
                durationTdWidth: 0,
                teacherData: [],
                studentData: {},
                stopDietData: {
                    stuBreakFireCount: 0,//	学生课间餐停伙次数	number	
                    stuBreakfastFireCount: 0,//	学生早餐停伙次数	number	
                    stuLunFireCount: 0,//	学生午餐停伙次数	number	
                    stuSupperFireCount: 0,//	学生晚餐停伙次数	number	
                    teaBreakfastCount: 0,//	教师早餐停伙数据	number	
                    teaLunFireCount: 0,//	教师午餐停伙次数	number	
                    teaSupperFireCount: 0//	教师晚餐停伙次数	number
                },
            };
        },
         mixins: [mixin],
        computed: {
            resourceName() {
                return this.resourceOrderData.map(dataEntry => dataEntry.resourceName);
            }
        },
        methods: {
            tabClickHandler(tab) {
                if (tab.name === 'app') {
                    getModuleDataStatisticsInfo()
                        .then(res => res.data)
                        .then(data => {
                            if (data.result) {
                                this.repairData = data.data.repair;
                                this.askLeaveData = data.data.askLeave;
                                this.$nextTick(() => {
                                    this.askLeaveChart = echarts.init(document.getElementById('askLeaveChart'));
                                    this.drawAskLeaveChart();
                                })
                            } else {
                            }
                        })
                        .catch(() => {
                        });
                    loadResOrder({
                        time: this.time
                    }).then(res => {
                        this.resourceOrderData = res.data.data;
                    }).catch(() => {
                    });
                }
            },

            showNoAttendStuDetail() {
                this.isShowNoAttendStu = true;
            },
            showNoAttendTeacherDetail() {
                this.isShowNoAttendTeacher = true;
            },
            getDuration(startDay, endDay) {
                const
                    endDayLimit = new Date(new Date(new Date(startDay).setHours(20)).setMinutes(0)).valueOf(),
                    startDayNumber = new Date(startDay).valueOf();
                let
                    endDayNumber = new Date(endDay).valueOf();
                endDayNumber = endDayNumber > endDayLimit ? endDayLimit : endDayNumber;
                const minutesDuration = parseInt((endDayNumber - startDayNumber) / (1000 * 60));
                const hours = parseInt(minutesDuration / 60);
                const minutes = parseInt(minutesDuration % 60);
                return hours + (parseFloat((minutes / 60).toFixed(2)));
            },
            calcBarStyle(timeEntry) {
                return {
                    left: (this.getDuration(`${this.time} 07:00:00`, timeEntry.startDay)) * 80 + 'px',
                    width: (this.getDuration(timeEntry.startDay, timeEntry.endDay) * 80) + 'px',
                    backgroundColor: timeEntry.state === 0 ? '#FF8F59' : '#337ab7'
                }
            },

            drawStuChart() {
                const chartOption = {
                    title: {
                        text: '学生关注率',
                        textStyle: {
                            fontSize: 14,
                            color: '#a3a3a3',

                            width: '100%'
                        },
                        x: 'center',
                        y: 'top',
                        textAlign: 'left',
                    },
                    tooltip: {
                        trigger: 'item',
                        formatter: "{a} <br/>{b} : {c} ({d}%)"
                    },

                    color: ['#2AB9CA', '#50E0BD'],//每个区域的颜色
                    series: [{
                        avoidLabelOverlap: true,
                        name: '用户关注情况',
                        type: 'pie',
                        radius: ['30%', '40%'],
                        center: ['50%', '50%'],//这个是圆环图在canvas中的位置 。第一个数字是左右。第二个是上下
                        startAngle: 180,
                        data: [
                            {value: this.pageData.attendParent, name: '关注'},
                            {value: this.pageData.notAttendParent, name: '未关注'}
                        ],
                        itemStyle: {
                            emphasis: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            },
                            normal: {
                                label: {
                                    show: true,
                                    formatter: '{b}\n{c}人\n{d}%',
                                    textStyle : {
                                        fontSize : 10
                                    }
                                }
                            },
                            labelLine: {
                                show: true
                            }
                        }
                    }]
                };
                this.noAttendStuChart.setOption(chartOption);
                this.noAttendStuChart.on('click', (param) => {
                    if (param.dataIndex === 1) {
                        this.showNoAttendStuDetail();
                    }
                });
            },
            drawTeacherChart() {
                const chartOption = {
                    title: {
                        text: '老师关注率',
                        textStyle: {
                            fontSize: 14,
                            color: '#a3a3a3',

                            width: '100%'
                        },
                        x: 'center',
                        y: 'top',
                        textAlign: 'left',
                    },
                    tooltip: {
                        trigger: 'item',
                        formatter: "{a} <br/>{b} : {c} ({d}%)"
                    },

                    color: ['#2AB9CA', '#50E0BD'],//每个区域的颜色
                    series: [{
                        name: '用户关注情况',
                        type: 'pie',
                        radius: ['30%', '40%'],
                        center: ['50%', '50%'],//这个是圆环图在canvas中的位置 。第一个数字是左右。第二个是上下
                        startAngle: 180,
                        data: [
                            {value: this.pageData.attendTeacher, name: '关注'},
                            {value: this.pageData.notAttendTeacher, name: '未关注'}
                        ],
                        itemStyle: {
                            emphasis: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            },
                            normal: {
                                label: {
                                    show: true,
                                    formatter: '{b}\n{c}人\n{d}%',
                                    textStyle : {
                                        fontSize : 10
                                    }
                                }
                            },
                            labelLine: {
                                show: true
                            }
                        }
                    }]
                };
                this.noAttendTeacherChart.setOption(chartOption);
                this.noAttendTeacherChart.on('click', (param) => {
                    // param.dataIndex 关注是0 未关注1
                    if (param.dataIndex === 1) {
                        this.showNoAttendTeacherDetail();
                    }
                });
            },
            drawWeekChart() {
                const chartOption = {
                    title: {
                        show: false,
                        text: '近7天用户关注情况',
                        x: 'center'
                    },
                    tooltip: {
                        trigger: 'axis'
                    },
                    legend: {
                        top: "top",
                        data: ['访问次数', "访问人数"],
                        left: '5%',
                        y2: '2%',//到底部的距离
                        textStyle: {
                            color: "#a3a3a3"
                        },
                        itemWidth: 10,
                        itemHeight: 10,
                        orient: 'horizontal'
                    },
                    grid: {
                        top: '15%',
                        left: '5%',
                        right: '5%',
                        bottom: '15%',
                        containLabel: true
                    },
                    calculable: true,
                    xAxis: {
                        show: true,
                        position: "bottom",
                        type: 'category',
                        data: [
                            this.pageData.zeroTime,
                            this.pageData.oneTime,
                            this.pageData.twoTime,
                            this.pageData.threeTime,
                            this.pageData.fourTime,
                            this.pageData.fiveTime,
                            this.pageData.sixTime
                        ],
                        axisTick: {
                            alignWithLabel: true,
                            show: true
                        },
                        axisLine: {
                            onZero: true,
                            lineStyle: {
                                color: "#a3a3a3"
                            }
                        },
                    },
                    yAxis: [
                        {
                            type: 'value',
                            axisLabel: {
                                formatter: '{value}'
                            },
                            axisTick: { //y轴的坐标样式
                                show: false
                            },
                            axisLine: {
                                show: false,
                                lineStyle: {
                                    color: "#a3a3a3"
                                }
                            }
                        }
                    ],
                    series: [
                        {
                            name: '访问次数',
                            type: 'line',
                            data: JSON.parse(this.pageData.loginTotal),
                            itemStyle: {
                                normal: {
                                    color: "#D280FE" //图标颜色
                                }
                            }
                        },
                        {
                            name: '访问人数',
                            type: 'line',
                            data: JSON.parse(this.pageData.loginUsersTotal),
                            itemStyle: {
                                normal: {
                                    color: "#2AB9CA" //图标颜色
                                }
                            }
                        }
                    ]
                };
                this.weekChart.setOption(chartOption);
            },
            drawModuleChart() {
                const chartOption = {
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                            type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                        }
                    },
                    legend: {
                        data: ['使用量'],
                        left: "5%",
                        itemWidth: 10,
                        itemHeight: 10
                    },
                    xAxis: {
                        data: this.moduleChartData.map(item => {
                            return item.name;
                        }),

                        axisLabel: {
                            interval: 0,
                            formatter: function (value, index) {
                                return `${value.slice(0, 2)}\n${value.slice(2)}`;
                            },
                        },
                        axisLine: {
                            show: false,
                            lineStyle: {
                                color: "#a3a3a3"
                            }
                        }
                    },

                    yAxis: {},
                    series: [{
                        name: '使用量',
                        type: 'bar',
                        data: this.moduleChartData.map(item => item.y),
                        itemStyle: {
                            normal: {
                                color: '#50E0BD'
                            }
                        }
                    }]
                };
                this.moduleChart.setOption(chartOption);
            },
            drawAskLeaveChart() {
                const chartOption = {
                    title: {
                        show: false,
                        text: '一周请假曲线',
                        x: 'center',
                    },
                    tooltip: {
                        trigger: 'axis',

                    },
                    legend: {
                        top: "top",
                        data: ['老师', "学生"],
                        left: '5%',
                        y2: '2%',//到底部的距离
                        textStyle: {
                            color: "#a3a3a3"
                        },
                        itemWidth: 10,
                        itemHeight: 10,
                        orient: 'horizontal'
                    },
                    grid: {
                        top: '15%',
                        left: '5%',
                        right: '5%',
                        bottom: '15%',
                        containLabel: true
                    },
                    calculable: true,
                    xAxis: {
                        show: true,
                        position: "bottom",
                        type: 'category',
                        data: this.askLeaveData.dateList,
                        axisTick: {
                            alignWithLabel: true,
                            show: true
                        },
                        axisLine: {
                            onZero: true,
                            lineStyle: {
                                color: "#a3a3a3"
                            }
                        },
                    },
                    yAxis: [
                        {
                            type: 'value',
                            axisLabel: {
                                formatter: '{value}'
                            },
                            axisTick: { //y轴的坐标样式
                                show: false
                            },
                            axisLine: {
                                show: false,
                                lineStyle: {
                                    color: "#a3a3a3"
                                }
                            }
                        }
                    ],
                    series: [
                        {
                            name: '老师',
                            type: 'line',
                            data: this.askLeaveData.teacherList,
                            itemStyle: {
                                normal: {
                                    color: "#D280FE" //图标颜色
                                }
                            }
                        },
                        {
                            name: '学生',
                            type: 'line',
                            data: this.askLeaveData.stuList,
                            itemStyle: {
                                normal: {
                                    color: "#2AB9CA" //图标颜色
                                }
                            }
                        }
                    ]
                };
                this.askLeaveChart.setOption(chartOption);
            },
        },
        mounted() {
            this.isKindergarten = window.sessionStorage.getItem('pc_login_type') === 'kindergarten';
        },
        created() {
            const {init: echartsInit} = echarts;
            userIndex()
                .then(res => res.data)
                .then(data => {
                    ({data: this.pageData} = data);
                    this.noAttendStuChart = echartsInit(document.getElementById('noAttendStuChart'));
                    this.drawStuChart();
                    this.noAttendTeacherChart = echartsInit(document.getElementById('noAttendTeacherChart'));
                    this.drawTeacherChart();
                    this.weekChart = echartsInit(document.getElementById('weekChart'));
                    this.drawWeekChart();
                });
            getModuleEcharts()
                .then(res => res.data)
                .then(data => {
                    if (data.result) {
                        ({data: this.moduleChartData} = data);
                        this.moduleChart = echartsInit(document.getElementById('moduleChart'));
                        this.drawModuleChart();
                    } else {
                    }
                })
                .catch(() => {
                });
            getSchoolLog()
                .then(res => res.data)
                .then(data => {
                    if (data.result) {
                        const schoolLogData = data.data;
                        this.schoolLogData = [{
                            name: '老师',
                            leaveNum: schoolLogData.teacherLeaveNum,
                            arriveNum: '--',
                            workNum: schoolLogData.teacherWorkNum
                        }, {
                            name: '学生',
                            leaveNum: schoolLogData.studentLeaveNum,
                            arriveNum: '--',
                            workNum: schoolLogData.studentWorkNum
                        }];
                        getArriveStuCount({
                            transferDate: moment().format('YYYY-MM-DD')
                        })
                            .then(res => res.data)
                            .then(data => {
                                this.schoolLogData[1].arriveNum = data.data;
                            });
                        getCheckWorkUserCount({
                            searchDate: moment().format('YYYY-MM-DD')
                        })
                            .then(res => res.data)
                            .then(data => {
                                this.schoolLogData[0].arriveNum = data.data;

                            });
                    }
                })
                .catch(() => {
                });



            noAttendUserList({
                userType: 1
            })
                .then(res => res.data)
                .then(data => {
                    this.teacherData = data.data;

                });
            noAttendUserList({
                userType: 2
            })
                .then(res => res.data)
                .then(data => {
                    this.studentData = data.data;

                });
            fireCountAnalysis()
                .then(res => res.data)
                .then(data => {
                    this.stopDietData = data.data;
                });
        },
    };
</script>

<style lang="scss" scoped>
    @import '../../styles/mixin';

    .page {
        padding: 12px;
    }

    .box-card {
        text-align: left;
        margin-bottom: 10px;
        &.box-card--left, &.box-card--right {
            width: 49%;
        }
        &.box-card--left {
            float: left;
        }
        &.box-card--right {
            float: right;
        }

        .box-card-header {
            font-size: 14px;
            line-height: 0;
            font-weight: 600;
            color: rgb(103, 106, 108);
        }
        $item: box-card-item;
        .#{$item} {
            color: rgb(103, 106, 108);
            @include setInlineBlockMiddle(30%);
            .#{$item}__head {
                font-weight: 600;
                margin-top: 5px;
                font-size: 16px;
                margin-bottom: 10px;
            }
            .#{$item}__data {
                line-height: 1.1;
                font-size: 30px;
                font-weight: 100;
            }
        }
    }

    .box-card--clear {
        clear: both;
    }

    .chart-container {
        background-color: #fff;
        width: 100%;
        height: 250px;
    }

    .chart-container--inline {
        @include setInlineBlockMiddle(22%, 2%);
        &#weekChart {
            width: 40%;
        }
    }

    .two-col-container, .module-info-box .chart-container--inline {
        @include setInlineBlockMiddle(47%, 2%);
        height: 400px;
        .title {
            text-align: center;
            padding: 5px 0;
        }
    }

    .ask-leave-chart {
        display: inline-block;
        width: 100%
    }

    .table-container {
        position: relative;
    }

    .chart-bar-container {
        position: absolute;
        height: 10px;
        width: 1050px;
        top: 15px;
        left: 0;
        overflow: hidden;
    }

    .chart-bar {
        z-index: 1000;
        position: absolute;
        height: 10px;
    }

    ul {
        padding: 0;
        margin: 0;
        list-style-type: none;
    }

    .color-bar {
        position: absolute;
        content: '';
        left: 7px;
        display: inline-block;
        width: 5px;
        height: 20px;
        background-color: #09BB07;
        border-radius: 3px;
    }

    .teachers-list, .students-list {
        display: flex;
        flex-flow: row;
        flex-wrap: wrap;
        background-color: #ffffff;
    }

    .teachers-list__item, .students-list__item {
        display: inline-block;
        vertical-align: middle;
        padding: 5px;
        box-sizing: border-box;
        text-align: center;
        width: 60px;
        font-size: 12px;
        border: 1px solid #dddddd;
        border-radius: 30px;
        margin: 0 13px 8px 0;
    }

    .dialog-card {
        margin-bottom: 10px;
    }

    .attend-container {
        height: 200px;
    }
    .stop-diet-container {
        height: 123px;
    }

    .repair-container {
        height: 122px;
    }
    .info-item {
        margin-right: 30px;
    }
    .body{
        overflow: auto;
    }
</style>
