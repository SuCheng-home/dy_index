<template>
    <div class="page">
        <div>
            <el-tabs v-model="activeName" type="border-card" @tab-click="clickTab">
                <el-tab-pane label="日期+班级统计" name="devideSectionAccounting">
                    <div class="read-statistics" :style="`height: ${notbmaxH - 50}px;`">
                        <div>
                            <div class="header">
                                <el-row>
                                    <el-col :span="19">
                                        <term-grade-class-selector @input="getAllZoneGenderCountDataListFunc"
                                                                   ref="selector" v-model="obj"
                                                                   isGradeShowAll></term-grade-class-selector>
                                    </el-col>
                                </el-row>
                            </div>
                            <div>
                                <div class="chart-container">
                                    <div class="chart" id="chart"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </el-tab-pane>
                <el-tab-pane label="日期+月+区域统计" name="devideSectionAccountingByMonth">
                </el-tab-pane>
            </el-tabs>
        </div>

    </div>

</template>
<script>
    import mixins from '@/mixins/windowResize';
    import baseMixin from '@/mixins/baseMixin';
    import echarts from 'echarts';
    import {
        getAllZoneGenderCountDataList
    } from '@/api/devideSectionBeiyou';

    import TermGradeClassSelector from '@/components/TermGradeClassSelector'

    export default {

        data() {
            return {
                activeName: 'devideSectionAccounting',
                obj: {
                    termId: '',
                    duration: [],
                    gradeId: '',
                    classId: ''
                }
            }
        },
        mixins: [mixins, baseMixin],
        components: {TermGradeClassSelector},

        mounted() {

        },
        methods: {
            clickTab() {
                this.$router.replace({path: this.activeName})

            },
            getAllZoneGenderCountDataListFunc() {
                getAllZoneGenderCountDataList({
                    beginDate: this.obj.duration[0],
                    endDate: this.obj.duration[1],
                    gradeId: this.obj.gradeId,
                    classId: this.obj.classId,
                    schoolTimeId: this.obj.termId
                })
                    .then(res => res.data)
                    .then(data => {
                        console.log('data', data)
                        const xAxisData = [],
                            seriesData1 = [],
                            seriesData2 = [],
                            zoneTypeCodeList = [];
                        data.data.forEach(item => {
                            xAxisData.push(item.zoneTypeName);
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
            jumpToPage(path, query = {}) {
                this.$router.push({
                    path,
                    query
                })
            },
            drawBarChart(container, args) {
                const option = {
                    color: [
                        "#7CB5EC", "#434348", "#90ED7D", "#F7A35C", "#8085E9", "#F15C80"
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
                            data: args.xAxisData,
                            axisLabel: {
                                interval: 0,//横轴信息全部显示
                                formatter: function (value) {
                                    return value.length > 6 ? value.slice(0, 6) + '...' : value;
                                }
                            }
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
                if (document.getElementById(container)) {
                    const myChart = echarts.init(document.getElementById(container));
                    myChart.setOption(option, true);
                    myChart.on('click', (param) => {
                        if(this.obj.gradeId==0){
                           this.jumpToPage('devideSectionClassAccounting', {
                            zoneTypeCode: args.zoneTypeCodeList[param.dataIndex],
                            beginDate: this.obj.duration[0],
                            endDate: this.obj.duration[1],
                            gradeId: this.obj.gradeId,
                            classId: this.obj.classId,
                            schoolTimeId: this.obj.termId
                        })
                        }else{
                            this.jumpToPage('newdevideSectionClassAccounting', {
                            zoneTypeCode: args.zoneTypeCodeList[param.dataIndex],
                            beginDate: this.obj.duration[0],
                            endDate: this.obj.duration[1],
                            gradeId: this.obj.gradeId,
                            classId: this.obj.classId,
                            schoolTimeId: this.obj.termId
                        }) 
                        }
                       
                    });
                }
            }

        },
    }
</script>
<style lang="scss" scoped>
    .page {
        padding: 12px;
    }

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
