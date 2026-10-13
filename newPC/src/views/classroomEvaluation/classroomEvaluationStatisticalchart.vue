<template>
    <div id="classroomEvaluationStatisticalchart">
        <div class="header">
            <el-button  @click="$router.back()" type="default" size="medium">返回</el-button>
             <el-button type="primary" size="medium" @click="classroomEvaluationdetails()">查看明细</el-button>
        </div>
        <div class="main" :style="`height: ${nobottommaxH}px;`">
            <h1>{{stuName}}课堂评价</h1>
            <div class="chart-container">
                <div class="chart" id="buff-chart"></div>
            </div>
            <div class="chart-container">
                <div class="chart" id="penalty-chart"></div>
            </div>
        </div>
    </div>
</template>

<script>
    import echarts from 'echarts';
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
           color:['#409eff'],
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
        name: "classroomEvaluationStatisticalchart",
        data() {
            return {
                stuName: this.$route.query.stuName,
                query:this.$route.query
            }
        },
        mounted() {
            let mystuobjlist= JSON.parse(localStorage.getItem('mystuobjlist'));
            let namelistone=[];
            let namelisttwo=[];
            let numlistone=[];
            let numlisttwo=[];
            let max=0;
            for(let i=0;i<mystuobjlist.numlist.length;i++){
                if((mystuobjlist.numlist[i]-0)>max){
                    max=mystuobjlist.numlist[i]-0;
                }
            };
            max=max+1;
            for(let i=0;i<mystuobjlist.mybehaviorTypeList.length;i++){
                if(mystuobjlist.mybehaviorTypeList[i].type==0){
                    namelistone.push({name:mystuobjlist.mybehaviorTypeList[i].title,max:max});
                    numlistone.push(mystuobjlist.numlist[i]-0);
                }else{
                    namelisttwo.push({name:mystuobjlist.mybehaviorTypeList[i].title,max:max});
                    numlisttwo.push(mystuobjlist.numlist[i]-0)
                }
            };
            drawRadar('penalty-chart', {name: '减分项',indicator:namelisttwo,data: numlisttwo});
            drawRadar('buff-chart', {name: '加分项',indicator:namelistone,data: numlistone});
        },
        methods:{
             //评分详情
            classroomEvaluationdetails(){
                this.$router.push({
                                path: "classroomEvaluationdetails",  
                                query:  this.query  
                            });  
            }
        }
    }
</script>

<style scoped lang="scss">
    #classroomEvaluationStatisticalchart {
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
