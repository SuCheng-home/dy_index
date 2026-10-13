<template>
    <div class="app-container">
        <backtool>
           
            <el-select class="filter-item" v-model="courseId" title="考试科目" size="medium" placeholder="请选择" @change="handleSelect">
                <el-option v-for="item in currList" :key="item.curriculumId" :label="item.curriculumName"
                           :value="item.curriculumId"></el-option>
            </el-select>
             <a target="_blank" v-if="list.length" :href="downLoadExamScoreAnalysisURL" download="成绩分析">
                <el-button type="primary" icon="upload" size="medium">导出EXCEL</el-button>
            </a>
        </backtool>
        <div class="examScoreAnalysis-box"  :style="`height: ${nobottommaxH}px;`">
            <div class="title">{{curriculumName}}成绩分析</div>
            <div>
                <div class="score-table">
                    <table>
                        <tr>
                            <td>平均分</td>
                            <td>{{scoreAnalysis.avgScore}}</td>
                        </tr>
                        <tr>
                            <td>最高分</td>
                            <td>{{scoreAnalysis.maxScore}}</td>
                        </tr>
                        <tr>
                            <td>最低分</td>
                            <td>{{scoreAnalysis.minScore}}</td>
                        </tr>
                        <tr>
                            <td>优生率</td>
                            <td>{{scoreAnalysis.excellentRate}}</td>
                        </tr>
                        <tr>
                            <td>及格率</td>
                            <td>{{scoreAnalysis.passRate}}</td>
                        </tr>
                        <tr>
                            <td>低分率</td>
                            <td>{{scoreAnalysis.poorRate}}</td>
                        </tr>
                    </table>

                </div>
                <div class="score-map">
                    <div id="chart"></div>
                </div>
            </div>
            <br/>
            <div class="hr-detail"></div>
            <div class="title">{{curriculumName}}成绩详情</div>
            <el-table stripe :key='tableKey' :data="list" v-loading.body="listLoading" border fit highlight-current-row
                      style="width: 100%; margin-top:10px;" :height="300">
                <el-table-column label="学号" show-overflow-tooltip>
                    <template slot-scope="scope">
                        {{scope.row.learnNum}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="姓名">
                    <template slot-scope="scope">
                        <span>{{scope.row.stuName }}</span>
                    </template>
                </el-table-column>
                <el-table-column show-overflow-tooltip align="center" label="成绩">
                    <template slot-scope="scope">
                        <span>{{scope.row.score}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="班级排名">
                    <template slot-scope="scope">
                        <span>{{scope.row.classRank}}</span>
                    </template>
                </el-table-column>
            </el-table>

        </div>
    </div>
</template>
<script>
    import Backtool from '@/components/BackTool';
    import {examScoreAnalysis, examDetails} from '@/api/systemSet/exam';
    import mixin from '@/mixins/windowResize';
    // 引入 ECharts 主模块
    const echarts = require('echarts/lib/echarts');
    require('echarts/lib/chart/pie');
    require('echarts/lib/chart/line');
    // 引入提示框和标题组件
    require('echarts/lib/component/tooltip');
    require('echarts/lib/component/title');
    import 'echarts/lib/component/legend';

    export default {
        components: {
            Backtool
        },
        data() {
            return {
                curriculumName: '',
                currList: [],
                courseId: '',
                tableKey: 'examScoreAnalysis',
                list: null,
                listLoading: false,
                scoreAnalysis: {
                    avgScore: '--',//	平均分
                    excellentRate: '--',//	优生率
                    gradeRank: '--',//	年级排名
                    maxScore: '--',//最高分
                    minScore: '--',//最低分
                    passRate: '--',//及格率
                    poorRate: '--'//差分率
                },
                scoreStageList: [],
                seriesArray: [],
                legendArray: [],
                downLoadExamScoreAnalysisURL: ''
            }
        },
        mixins: [mixin],
        created() {
            let examId = this.$route.query.examId;
            if (!examId) {
                return;
            }
            examDetails(examId).then(res => {
                let data = res.data.data;

                this.currList = data.currList;
                this.courseId = this.currList[0].curriculumId;
                this.handleSelect(this.courseId);
            }).catch();
        },
        methods: {
            handleSelect(val) {
                if (val) {
                    let examId = this.$route.query.examId;

                    this.currList.forEach(item => {
                        if (val == item.curriculumId) {
                            this.curriculumName = item.curriculumName
                        }
                    });
                    var a = '';

                    if(a) {

                    }


                    examScoreAnalysis(examId, val).then(res => {
                        let data = res.data.data;
                        this.list = data.stuScoreList;
                        this.scoreAnalysis.avgScore = data.avgScore;
                        this.scoreAnalysis.excellentRate = data.excellentRate;
                        this.scoreAnalysis.maxScore = data.maxScore;
                        this.scoreAnalysis.minScore = data.minScore;
                        this.scoreAnalysis.passRate = data.passRate;
                        this.scoreAnalysis.poorRate = data.poorRate;
                        this.scoreStageList = data.scoreStageList;
                        this.downLoadExamScoreAnalysisURL = global.BasePath + 'structure/exam/downLoadExamScoreAnalysis?currId=' + val + '&examId=' + examId + '&token=' + this.$store.getters.token;
                        this.$nextTick(() => {
                            this.getPieData();
                            this.initBar();
                        });
                    }).catch();
                }
            },
            initBar() {
                this.chart = echarts.init(document.getElementById('chart'));
                let _this = this;
                this.chart.setOption(
                    {
                        title: {
                            text: _this.curriculumName + '成绩段分布图',
                            x: 'center'
                        },
                        tooltip: {
                            trigger: 'item',
                            formatter: "{a} <br/>{b} : {c}人 ({d}%)"
                        },
                        legend: {
                            bottom: '0px',
                            left: '0',
                            data: this.legendArray
                        },
                        series: [
                            {
                                name: '',
                                type: 'pie',
                                radius: '55%',
                                center: ['50%', '50%'],
                                data: this.seriesArray,
                                itemStyle: {
                                    emphasis: {
                                        shadowBlur: 10,
                                        shadowOffsetX: 0,
                                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                                    }
                                }
                            }
                        ]
                    })
            },
            getPieData() {
                let _this = this;
                _this.legendArray = [];
                _this.seriesArray = [];
                this.scoreStageList.forEach(function (item) {
                    _this.seriesArray.push({value: item.number, name: item.scoreState});
                    _this.legendArray.push(item.scoreState);
                });
            }
        }
    }
</script>
<style scoped>
.title{
    line-height: 20px;
    font-size: 16px;
    border-left: 4px solid #409eff;
    padding-left: 10px;
    margin-bottom: 10px;
}
    .examScoreAnalysis-box {
        padding-top: 10px;
        overflow: auto;
    }

    .hr-detail {
        clear: both;
    }

    .score-table {
        width: 400px;
        min-width: 400px;
        margin-top: 10px;
        float: left;
    }

    .score-map {
        width: 400px;
        float: left;
        margin-left: 20px;
        padding-left: 10px;
    }

    .score-table table tr {
        height: 40px;
        line-height: 40px;
    }

    .score-table table tr td {
        border: 1px solid #dfe6ec;
        width: 200px;
        padding-left: 10px;
    }

    #chart {
        width: 100%;
        min-height: 400px;
        margin-left: 300px;
    }
</style>
