<template>
    <div id="deyuAccountingPersonal">
        <div class="header">
            <el-button @click="$router.back()" type="default" size="medium">返回</el-button>
        </div>
        <div class="main" :style="`height: ${nobottommaxH}px;`">
            <!-- <h3>{{stuName}}课堂评价分析</h3>
            <div class="chart-container">
                <div class="chart" id="buff-chart"></div>
            </div>
            <div class="chart-container">
                 <div class="chart" id="penalty-chart"></div>
            </div> -->
            <div v-if="isshow" id="chartone"></div>
            <default-page Mes="暂无评价" v-else></default-page>
        </div>
    </div>
</template>
<script>
    import echarts from 'echarts';
    import DefaultPage from '@/components/DefaultPage';
    import {
        getBehEvalCurrStuRankByWeekOrMonth,
        getStuCount
    } from '@/api/classroomEvaluationtwo';

    function drawRadar(containerId, config) {
        const configObj = {
            title: {
                text: '',
            },
            tooltip: {},
            legend: {
                data: [""],
                top: '20%;'
            },
            grid: {
                top: '20%',
                left: '2%',
                right: '2%',
                bottom: '5%',
                containLabel: true
            },
            color: ['#409EFF'],
            radar: {
                radius: 120,
                name: {
                    textStyle: {
                        color: '#fff',
                        backgroundColor: '#999',
                        borderRadius: 3,
                        padding: [3, 5]
                    }
                },
                indicator: config.indicator
            },
            series: [{
                name: config.name,
                type: 'radar',
                // label: {
                //     show: true
                // },
                data: [
                    {
                        value: config.data,
                        name: config.name
                    }
                ]
            }]
        };
        echarts.init(document.getElementById(containerId)).setOption(configObj);
    }

    export default {
        name: "classroomEvaluationtwotwodetails",
        data() {
            return {
                stuName: this.$route.query.name,
                isshow: true
            }
        },
        components: {DefaultPage},
        mounted() {
            getStuCount(this.$route.query.schoolTimeId, this.$route.query.classId).then(res => {
                let num = res.data.data;
                getBehEvalCurrStuRankByWeekOrMonth(this.$route.query)
                    .then(res => res.data)
                    .then(data => {
                        let mydata = data.data;
                        this.isshow = mydata.rankList.length;
                        drawRadar('chartone', {
                            name: '排名',
                            indicator: mydata.currList.map(item => ({
                                name: item,
                                max: num
                            })),
                            data: mydata.rankList
                        });
                    })
            });

        }
    }
</script>

<style scoped lang="scss">
    #deyuAccountingPersonal {
        padding: 12px;
        box-sizing: border-box;
        font-size: 14px;
    }

    .header {
        padding-bottom: 10px;
        border-bottom: 1px solid #e7eaec;
    }

    .main {
        width: 810px;
        margin: 0 auto;

        h3 {
            text-align: center;
        }
    }

    .chart-container {
        position: relative;
        width: 405px;
        float: left;

        &:first-of-type {
            border-right: 1px solid #ccc;
        }

        .link-text {
            position: absolute;
            right: 10px;
        }
    }

    .chart {
        width: 400px;
        height: 400px;
        margin: 15px auto;
    }

    #chartone {
        width: 500px;
        height: 500px;
        margin: 15px auto;
    }
</style>
