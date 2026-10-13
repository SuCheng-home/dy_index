<template>
    <div id="deyuAccountingPersonal">
        <div class="header">
            <el-button  @click="$router.back()" type="default" size="medium">返回</el-button>
        </div>
        <div class="main" :style="`height: ${nobottommaxH}px;`">
            <h1>{{stuName}}的德育评价分析</h1>
            <div class="chart-container">
                <template v-if="!isNoBuff">
                    <div class="link-text">
                        <router-link :to="{path: 'deyuAccountingPersonalDetail', query: {dimensionId, schoolTimeId, studentId, type: 0}}">查看详情</router-link>
                    </div>
                    <div class="chart" id="buff-chart">
                    </div>
                </template>
                <default-page Mes="暂无数据" v-else></default-page>
            </div>
            <div class="chart-container">
                <template v-if="!isNoPenalty">
                    <div class="link-text">
                        <router-link :to="{path: 'deyuAccountingPersonalDetail', query: {dimensionId, schoolTimeId, studentId, type: 1}}">查看详情</router-link>
                    </div>
                    <div class="chart" id="penalty-chart"></div>
                </template>
                <default-page Mes="暂无数据" v-else></default-page>
            </div>
        </div>
    </div>
</template>

<script>
    import echarts from 'echarts';
    import DefaultPage from '@/components/DefaultPage';
    import {
        getStuDimensionStaticsData
    } from '@/api/deyu';

    function drawRadar(containerId, config) {
        const configObj = {
            title: {
                text: '',
            },
            tooltip: {},
            legend: {
                data: [config.name],
                top: '20%;'
            },
            grid: {
                top: '20%',
                left: '2%',
                right: '2%',
                bottom: '5%',
                containLabel: true
            },

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
                name: '得分',
                type: 'radar',
                data : [
                    {
                        value : config.data,
                        name : '得分'
                    }
                ]
            }]
        };
        echarts.init(document.getElementById(containerId)).setOption(configObj);
    }

    export default {
        name: "deyuAccountingPersonal",
        data() {
            return {
                stuName: this.$route.query.stuName,
                studentId: this.$route.query.studentId,
                dimensionId: this.$route.query.dimensionId,
                schoolTimeId: this.$route.query.schoolTimeId,
                classId: this.$route.query.classId,
                isNoBuff: false,
                isNoPenalty: false
            }
        },
        components: {DefaultPage},
        mounted() {
            getStuDimensionStaticsData({
                studentId: this.studentId,
                schoolTimeId: this.schoolTimeId,
                type: 0,
                dimensionId: this.dimensionId
            })
                .then(res => res.data)
                .then(data => {
                    const pageData = data.data;
                    this.isNoBuff = pageData.xCoordArr.length === 0;
                    if(!this.isNoBuff) {
                        const max = Math.max(...pageData.valueArr);
                        for(let i=0;i<pageData.xCoordArr.length;i++){
                            if(pageData.xCoordArr[i]=='其它'||data.data[i]=='其他'){
                                pageData.xCoordArr[i]='其他（加）'
                            }
                        }
                        const indicator = pageData.xCoordArr.map(name => ({name, max}));
                        drawRadar('buff-chart', {
                            name: '加分项',
                            indicator,
                            data: pageData.valueArr
                        });
                    }
                });
            getStuDimensionStaticsData({
                studentId: this.studentId,
                schoolTimeId: this.schoolTimeId,
                type: 1,
                dimensionId: this.dimensionId
            })
                .then(res => res.data)
                .then(data => {
                    const pageData = data.data;
                    this.isNoPenalty = pageData.xCoordArr.length === 0;
                    if(!this.isNoPenalty) {
                        const max = Math.max(...pageData.valueArr);
                         for(let i=0;i<pageData.xCoordArr.length;i++){
                            if(pageData.xCoordArr[i]=='其它'||data.data[i]=='其他'){
                                pageData.xCoordArr[i]='其他（减）'
                            }
                        }
                        const indicator = pageData.xCoordArr.map(name => ({name, max}));
                        drawRadar('penalty-chart', {
                            name: '减分项',
                            indicator,
                            data: pageData.valueArr
                        });
                    }

                })
        }
    }
</script>

<style scoped lang="scss">
    #deyuAccountingPersonal {
        padding:12px;
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
        h1 {
            text-align:center;
        }
    }
    .chart-container {
        position: relative;
        width: 405px;
        float: left;
        &:first-of-type {
            border-right:1px solid #ccc;
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
</style>
<style scoped>
    #deyuAccountingPersonal a {
        color: #20a0ff !important;
        text-decoration: none !important;
    }
</style>
