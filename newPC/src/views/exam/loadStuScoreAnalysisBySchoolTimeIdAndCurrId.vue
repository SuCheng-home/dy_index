<template>
    <div class="app-container">
        <backtool></backtool>        
        <div class="score-map" :style="`height: ${nobottommaxH}px;`">          
            <div v-show="!showDefualtMes"><div id="chart"></div></div>
            <default-page Mes="暂无分析数据！" v-show="showDefualtMes"></default-page>
        </div>
    </div>
</template>
<script>
    import Backtool from '@/components/BackTool';
    import DefaultPage from '@/components/DefaultPage';
    import {stuScoreAnalysisBySchoolTimeIdAndCurrId} from '@/api/systemSet/exam';
    import mixin from '@/mixins/windowResize';

    // 引入 ECharts 主模块
    const echarts = require('echarts/lib/echarts');
    require('echarts/lib/chart/pie');
    require('echarts/lib/chart/bar');

    require('echarts/lib/chart/line');
    // 引入提示框和标题组件
    require('echarts/lib/component/tooltip');
    require('echarts/lib/component/title');
    import 'echarts/lib/component/legend';

    export default {
        components: {
            Backtool,
            DefaultPage
        },
        data() {
            return {
                avgValueArr: [],
                rankArr: [],
                valueArr: [],
                xCoordArr: [],
                showDefualtMes: false
            }
        },
        mixins: [mixin],
        created() {
            let classId = this.$route.query.classId;
            let currId = this.$route.query.currId;
            let schoolTimeId = this.$route.query.schoolTimeId;
            let stuId = this.$route.query.stuId;
            if (!classId && !currId && !schoolTimeId && !stuId) {
                return;
            }

            stuScoreAnalysisBySchoolTimeIdAndCurrId({
                classId: classId,
                currId: currId,
                schoolTimeId: schoolTimeId,
                stuId: stuId
            }).then(res => {
                let data = res.data.data;
                this.avgValueArr = data.avgValueArr;
                this.rankArr = data.rankArr;
                this.valueArr = data.valueArr;
                this.xCoordArr = data.xCoordArr;
                if (this.avgValueArr.length > 0) {
                    this.showDefualtMes = false;
                    this.initBar();
                } else {
                    this.showDefualtMes = true;
                }

            }).catch();
        },
        methods: {
            initBar() {
                this.chart = echarts.init(document.getElementById('chart'));
                this.chart.setOption(
                    {
                        title: {
                            text: '成绩段分布图',
                            x: 'center'
                        },
                        tooltip: {
                            trigger: 'axis'
                        },

                        legend: {
                            bottom: '0',
                            data: ['成绩', '排名', '平均分']
                        },
                        xAxis: [{
                            type: 'category',
                            data: this.xCoordArr
                        }],
                        yAxis: [{
                            type: 'value',
                            name: '成绩',
                            min: 0,
                            max: 150,
                            interval: 20,
                            axisLabel: {
                                formatter: '{value} 分'
                            }
                        },
                            {
                                type: 'value',
                                name: '排名',
                                min: 0,
                                max: 60,
                                interval: 5,
                                axisLabel: {
                                    formatter: '{value} 名'
                                }
                            }
                        ],
                        series: [{
                            name: '成绩',
                            type: 'line',
                            data: this.valueArr
                        },
                            {
                                name: '平均分',
                                type: 'line',
                                data: this.avgValueArr
                            },
                            {
                                name: '排名',
                                type: 'line',
                                yAxisIndex: 1,
                                data: this.rankArr
                            }

                        ]
                    })
            }
        }
    }
</script>
<style scoped>
    #chart {
        width: 100%;
        height: 600px;
        padding-top: 20px;
    }
</style>
