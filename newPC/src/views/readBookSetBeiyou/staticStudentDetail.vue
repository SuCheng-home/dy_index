<template>
    <div class="read-way">
        <div class="header">
            <el-button size="medium" @click="goBack">返回</el-button>
        </div>
        <div class="chart-container">
            <div class="title">阅读喜好</div>
            <div class="chart" id="chart"></div>
        </div>
        <div class="chart-container">
            <div class="title">阅读方式</div>
            <div class="chart" id="chart--way"></div>
        </div>

    </div>
</template>
<script>
    import echarts from 'echarts';
    import {
        getReadIndependStuBookTypeStatisticalList,
        getReadIndependStuWayTypeStatisticalList
    } from '@/api/readBookBeiyou';

    export default {
        data() {
            return {
                classId: this.$route.query.classId,
                endDate: this.$route.query.endDate,
                schoolTimeId: this.$route.query.schoolTimeId,
                startDate: this.$route.query.startDate,
                studentId: this.$route.query.studentId,

            };
        },
        mounted() {
            this.getReadIndependStuBookTypeStatisticalListFunc();
            this.getReadIndependStuWayTypeStatisticalListFunc();
        },
        methods: {
            getReadIndependStuBookTypeStatisticalListFunc() {
                getReadIndependStuBookTypeStatisticalList({
                    classId: this.classId,
                    endDate: this.endDate,
                    startDate: this.startDate,
                    studentId: this.studentId,
                    schoolTimeId: this.schoolTimeId,

                }).then(res => {
                    if (res.data.code === 200 && res.data.result) {
                        this.drawRadar(res.data.data)
                    } else {
                        this.$message.warning(res.data.msg);
                    }
                })
            },
            getReadIndependStuWayTypeStatisticalListFunc() {
                getReadIndependStuWayTypeStatisticalList({
                    classId: this.classId,
                    endDate: this.endDate,
                    startDate: this.startDate,
                    studentId: this.studentId,
                    schoolTimeId: this.schoolTimeId,

                }).then(res => {
                    if (res.data.code === 200 && res.data.result) {
                        this.drawRadarWay(res.data.data)
                    } else {
                        this.$message.warning(res.data.msg);
                    }
                })
            },
            drawRadar(data) {
                let  seriesData=[];
                let maxNum=0;
                let indicatorData=[];
                for(let i=0;i<data.length;i++){
                    seriesData.push(data[i].totalCount);
                    if(maxNum<(data[i].totalCount-0)){
                        maxNum=data[i].totalCount-0;
                    }
                }
                for(let i=0;i<data.length;i++){
                    indicatorData.push({
                        name:data[i].bookTypeName,
                        max:maxNum
                    });
                }
                // const seriesData = data.map(item => item.totalCount)
                // const maxNum = seriesData.sort((m, n) => n - m) //从大到小排序
                // const indicatorData = data.map(item => {
                //     return {name: item.bookTypeName, max: maxNum[0]}
                // })
                const configObj = {
                    color: ['#56A3F1'],
                    legend: {
                        data: ['阅读次数'],
                        bottom: '0',
                        icon: 'rect'
                    },

                    radar: {
                        indicator: indicatorData,
                    },
                    series: [
                        {
                            name: '阅读次数',
                            type: 'radar',
                            data: [
                                {
                                    value: seriesData,
                                    name: '阅读次数',
                                    label: {
                                        show: true,
                                        formatter: function(params) {
                                            return params.value;
                                        }
                                        ,
                                        distance: 2
                                    },
                                },
                            ],

                        },
                    ],
                };
                const myEcharts = echarts.init(document.getElementById('chart'))
                myEcharts.setOption(configObj);
                window.onresize = myEcharts.resize;
                window.addEventListener("resize", function () {
                    if (myEcharts) {
                        myEcharts.resize();
                    }
                });
            },
            drawRadarWay(data) {
                // const seriesData = data.map(item => item.totalCount)
                // const maxNum = seriesData.sort((m, n) => n - m) //从大到小排序
                // const indicatorData = data.map(item => {
                //     return {name: item.wayTypeName, max: maxNum[0]}
                // });
                 let  seriesData=[];
                let maxNum=0;
                let indicatorData=[];
                for(let i=0;i<data.length;i++){
                    seriesData.push(data[i].totalCount);
                    if(maxNum<(data[i].totalCount-0)){
                        maxNum=data[i].totalCount-0;
                    }
                }
                for(let i=0;i<data.length;i++){
                    indicatorData.push({
                        name:data[i].wayTypeName,
                        max:maxNum
                    });
                }
                const configObj = {
                    color: ['#56A3F1'],
                    legend: {
                        data: ['阅读方式'],
                        bottom: '0',
                        icon: 'rect'
                    },
                    radar: {
                        indicator: indicatorData,
                    },
                    series: [
                        {
                            name: '阅读方式',
                            type: 'radar',
                            data: [
                                {
                                    value: seriesData,
                                    name: '阅读方式',
                                    label: {
                                        show: true,
                                        formatter: function(params) {
                                            return params.value;
                                        },
                                        distance: 1
                                    },
                                },
                            ],
                        },
                    ],
                };
                const myEcharts = echarts.init(document.getElementById('chart--way'))
                myEcharts.setOption(configObj);
                window.onresize = myEcharts.resize;
                window.addEventListener("resize", function () {
                    if (myEcharts) {
                        myEcharts.resize();
                    }
                });
            },
            goBack() {
                this.$router.back();
            },
        },
    };
</script>
<style lang="scss" scoped>
    .read-way {
        padding:12px;
    }

    .header {
        padding-bottom: 10px;
    }

    .chart-container {
        width: 48%;
        height: 600px;
        margin: 15px auto;
        float: left;
    }
    .chart {
        width: 100%;
        height: 600px;
    }
</style>
