<template>
    <div class="read-statistics">
        <div>
            <div class="header">
                <el-row>
                    <el-col :span="19">
                        <term-grade-class-selector :queryArgs="queryArgs" @input="getPriodClassZoneCountDataListFunc" ref="selector" v-model="obj"></term-grade-class-selector>
                        <el-button
                            size="medium"
                            type="primary"
                            @click="jumpToPage('devideSectionAllClassDetail', {
                                        beginDate: obj.duration[0],
                                        endDate: obj.duration[1],
                                        classId: obj.classId,
                                        gradeId: obj.gradeId,
                                        termId: obj.termId
                                    })"
                        >查看明细
                        </el-button>
                    </el-col>
                </el-row>
            </div>
            <div :style="`height: ${notbmaxH - 28}px;`">
                <div class="chart" id="chart"></div>
            </div>
        </div>
    </div>
</template>
<script>
    import mixins from '@/mixins/windowResize';
    import baseMixin from '@/mixins/baseMixin';
    import echarts from 'echarts';
    import {
        getPriodClassZoneCountDataList,
    } from '@/api/devideSectionBeiyou';

    import {
        isShowByRole
    } from "@/utils";
    import TermGradeClassSelector from '@/components/TermGradeClassSelector'
    export default {

        data() {
            return {
                obj: {
                    termId: '',
                    duration: [],
                    gradeId: '',
                    classId: ''
                },
                queryArgs: {
                    all: true,
                    manager: false,
                    notlimit: true,
                    submanager: false,
                    teacher: false
                }
            }
        },
        mixins: [mixins, baseMixin],
        components: {TermGradeClassSelector},

        mounted() {
            if(!isShowByRole(20210705)) {
                this.queryArgs = {
                    all: false,
                    manager: false,
                    notlimit: false,
                    submanager: false,
                    teacher: true
                }
            }
        },
        methods: {
            getPriodClassZoneCountDataListFunc() {
                if(!this.obj.classId || !this.obj.gradeId) {
                    const args = {
                        xAxisData: [],
                        series: []
                    };
                    this.drawLineChart('chart', args);
                    return undefined;
                }
                getPriodClassZoneCountDataList({
                    beginDate: this.obj.duration[0],
                    endDate: this.obj.duration[1],
                    gradeId: this.obj.gradeId,
                    classId: this.obj.classId,
                    schoolTimeId: this.obj.termId
                })
                    .then(res => res.data)
                    .then(data => {
                        const series = [];
                        if(data.data && data.data.length !== 0) {
                            data.data[0].staticsList.forEach(item => {
                                series.push({
                                    name: item.zoneTypeName,
                                    type: 'line',
                                    data: []
                                })
                            })
                        }
                        const xAxisData = [];
                        data.data.forEach(item => {
                            xAxisData.push(item.zoneDate);
                            item.staticsList.forEach((item2, index) => {
                                series[index].data.push(item2.zoneCount);
                            })
                        });
                        const args = {
                            xAxisData,
                            series
                        };
                        this.drawLineChart('chart', args);
                    })
            },
            jumpToPage(path, query = {}) {
                this.$router.push({
                    path,
                    query
                })
            },
            drawLineChart(container, args) {
                const option = {
                    color: [
                        "#7CB5EC","#434348","#90ED7D","#F7A35C","#8085E9","#F15C80", "#e91e63", "#9c27b0"
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
                    dataZoom: {
                        zoomLock: true,
                        show: args.xAxisData.length > 7,
                        realtime: true,
                        start: 0,
                        end:  100 / args.xAxisData.length * 7 > 100 ? 100 : 100 / args.xAxisData.length * 7
                    },
                    xAxis: [
                        {
                            type: 'category',
                            boundaryGap: false,
                            data: args.xAxisData
                        }
                    ],
                    yAxis: {
                        name: '次数',
                        type: 'value',
                        minInterval: 1
                    },
                    series: args.series
                };
                if(document.getElementById(container)) {
                    const myChart = echarts.init(document.getElementById(container));
                    myChart.setOption(option, true);
                    myChart.on('click', (param) => {
                        this.jumpToPage('devideSectionClassAccounting', {
                            zoneTypeCode: args.zoneTypeCodeList[param.dataIndex],
                            beginDate: this.obj.duration[0],
                            endDate: this.obj.duration[1],
                            gradeId: this.obj.gradeId,
                            classId: this.obj.classId,
                            schoolTimeId: this.obj.termId
                        })
                    });
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
          border-bottom: 1px solid #e7eaec;
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
