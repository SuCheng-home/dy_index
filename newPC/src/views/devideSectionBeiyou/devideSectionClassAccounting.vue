<template>
    <div class="read-statistics">
        <backtool></backtool>
        <div>
            <div :style="`height: ${notbmaxH + 20}px;`">
                <div class="chart" id="chart"></div>
            </div>
        </div>
    </div>
</template>
<script>
    import Backtool from '@/components/BackTool';
    import mixins from '@/mixins/windowResize';
    import baseMixin from '@/mixins/baseMixin';
    import echarts from 'echarts';
    import {
        getZoneClassGenderCountDataList
    } from '@/api/devideSectionBeiyou';

    import {isShowByPermission} from "@/utils";
    export default {
        data() {
            return {
                beginDate: this.$route.query.beginDate,
                endDate: this.$route.query.endDate,
                gradeId: this.$route.query.gradeId,
                classId: this.$route.query.classId,
                schoolTimeId: this.$route.query.schoolTimeId,
                zoneTypeCode: this.$route.query.zoneTypeCode,
            }
        },
        mixins: [mixins, baseMixin],
        components: {Backtool},

        mounted() {
            getZoneClassGenderCountDataList({
                beginDate: this.beginDate,
                endDate: this.endDate,
                gradeId: this.gradeId,
                classId: this.classId,
                schoolTimeId: this.schoolTimeId,
                zoneTypeCode: this.zoneTypeCode
            })
                .then(res => res.data)
                .then(data => {
                    const xAxisData = [],
                        seriesData1 = [],
                        seriesData2 = [],
                        zoneTypeCodeList = [];
                    data.data.forEach(item => {
                        xAxisData.push(item.className);
                        seriesData1.push(item.boyCount);
                        seriesData2.push(item.girlCount);
                        zoneTypeCodeList.push(item.zoneTypeCode);
                    });
                    const args = {
                        xAxisData,
                        seriesData1,
                        seriesName1: '男',
                        seriesName2: '女',
                        seriesData2,
                        zoneTypeCodeList
                    };
                    this.drawBarChart('chart', args);
                })
        },
        methods: {
            isShowByPermission,
            jumpToPage(path, query = {}) {
                this.$router.push({
                    path,
                    query
                })
            },
            // 点击tab
            clickTab() {
                this.$router.replace({path: this.activeName})

            },
            drawBarChart(container, args) {
                const option = {
                    color: [
                        "#7CB5EC","#434348","#90ED7D","#F7A35C","#8085E9","#F15C80"
                    ],
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                            type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                        }
                    },
                    legend: {
                        data: [args.seriesName1, args.seriesName2],
                        bottom: 10
                    },
                    calculable: true,
                    xAxis: [
                        {
                            type: 'category',
                            data: args.xAxisData
                        }
                    ],
                    yAxis: {
                        type: 'value',
                        name: '次数',
                        minInterval: 1
                    },
                    series: [
                        {
                            name: args.seriesName1,
                            type: 'bar',
                            data: args.seriesData1,
                            label: {
                                normal: {
                                    show: true,
                                    position: 'top',
                                    formatter: (obj) => {
                                        if(obj.value === 0) {
                                            return '0(0%)';
                                        } else {
                                            return `${obj.value}(${(100 * obj.value / (args.seriesData1[obj.dataIndex] + args.seriesData2[obj.dataIndex])).toFixed(2)}%)`
                                        }
                                    }
                                }
                            }
                        },
                        {
                            name: args.seriesName2,
                            type: 'bar',
                            data: args.seriesData2,
                            label: {
                                normal: {
                                    show: true,
                                    position: 'top',
                                    formatter: (obj) => {
                                        if(obj.value === 0) {
                                            return '0(0%)';
                                        } else {
                                            return `${obj.value}(${(100 * obj.value / (args.seriesData1[obj.dataIndex] + args.seriesData2[obj.dataIndex])).toFixed(2)}%)`
                                        }
                                    }
                                }
                            }
                        }
                    ]
                };
                if(document.getElementById(container)) {
                    const myChart = echarts.init(document.getElementById(container));
                    myChart.setOption(option, true);
                }
            }

        },
    }
</script>
<style lang="scss" scoped>
    .read-statistics {
        padding: 12px;
    }

    .header {
        padding-bottom: 10px;
    }

    .header-buttom {
        margin-bottom: 10px;
    }

    .el-table th.gutter {
        display: table-cell !important;
    }
    #chart {
        height: 600px;
    }
</style>
