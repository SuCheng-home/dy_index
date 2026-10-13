<template>
    <div class="app-container calendar-list-container">
        <div class="header">
            <el-row>
                <el-col :span="19">
                    <el-button @click="$router.back()" type="default" size="medium">返回</el-button>
                    <term-grade-class-selector :queryArgs="queryArgs" ref="selector" v-model="obj"
                                               @input="getListData()"></term-grade-class-selector>
                    <a target="_blank" :href="exportUrl" download="导出结果" v-if="dataList.length">
                        <el-button class="filter-item" type="primary" size="medium" icon="upload">导出</el-button>
                    </a>
                    <el-button class="filter-item" type="primary" size="medium" @click="showCompare">对比统计</el-button>
                </el-col>
            </el-row>
        </div>
        <el-table stripe :data="dataList" border :height="notbmaxH" style="width: 100%" id="outTable" @selection-change="handleSelectionChange">
            <el-table-column
                type="selection"
                :selectable="selectable"
                width="55">
            </el-table-column>
            <el-table-column align="center" label="姓名" show-overflow-tooltip>
                <template slot-scope="scope">
                    <span v-if="scope.row.stuName !== '总计'" class="link" @click="showStuInfo(scope.row)">
                        {{scope.row.stuName}}
                    </span>
                    <span v-else>
                        {{scope.row.stuName}}
                    </span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="性别" show-overflow-tooltip>
                <template slot-scope="scope">
                    {{scope.row.isSummary ? '' : (scope.row.stuSex == 1 ? '男' : '女')}}
                </template>
            </el-table-column>
            <el-table-column align="center" v-for="(item, index) in sectionList" :key="index" :label="item" prop="">
                <template slot-scope="scope">
                    {{scope.row.staticsList[index].zoneCount ? scope.row.staticsList[index].zoneCount : "0"}}
                </template>
            </el-table-column>
        </el-table>
        <el-dialog title="选区统计" :visible.sync="isShowStuInfoDialog" size="tiny" width="80%"
                   :close-on-click-modal="false" :close-on-press-escape="false" :show-close="true">
            <div>
                <el-tabs v-model="activeName" type="border-card">
                    <el-tab-pane label="选区记录" name="log">
                        <el-table stripe :data="stuInfoDataList" border :height="notbmaxH - 300" style="width: 100%">
                            <el-table-column align="center" prop="stuName" label="姓名" show-overflow-tooltip>
                            </el-table-column>
                            <el-table-column align="center" label="性别" show-overflow-tooltip>
                                <template slot-scope="scope">
                                    {{scope.row.stuSex == 1 ? '男' : '女'}}
                                </template>
                            </el-table-column>
                            <el-table-column align="center" label="所在班级" prop="className" show-overflow-tooltip>
                            </el-table-column>
                            <el-table-column align="center" label="班主任" prop="classHeaderName" show-overflow-tooltip>
                            </el-table-column>
                            <el-table-column align="center" label="分区" prop="zoneTypeName" show-overflow-tooltip>
                            </el-table-column>
                            <el-table-column align="center" label="选区日期(星期)" show-overflow-tooltip>
                                <template slot-scope="scope">
                                    {{scope.row.zoneDate}}&nbsp;&nbsp;{{scope.row.dayOfWeek}}
                                </template>
                            </el-table-column>
                            <el-table-column align="center" label="进入分区时间" show-overflow-tooltip>
                                <template slot-scope="scope">
                                    {{scope.row.intoZoneTime | timeFilter}}
                                </template>
                            </el-table-column>
                            <el-table-column align="center" label="离开分区时间" show-overflow-tooltip>
                                <template slot-scope="scope">
                                    {{scope.row.leaveZoneTime | timeFilter}}
                                </template>
                            </el-table-column>
                            <el-table-column align="center" label="时长" show-overflow-tooltip>
                                <template slot-scope="scope">
                                    {{scope.row.duration}}
                                </template>
                            </el-table-column>
                        </el-table>
                        <div class="pagination-container">
                            <el-pagination
                                @size-change="getPriodClassStuZoneRecordPageListFunc"
                                @current-change="getPriodClassStuZoneRecordPageListFunc"
                                :current-page.sync="pagination.pageNo" :page-sizes="[10,20,30, 50]"
                                :page-size.sync="pagination.pageSize" layout="total, sizes, prev, pager, next, jumper"
                                :total="pagination.total">
                            </el-pagination>
                        </div>
                    </el-tab-pane>
                    <el-tab-pane label="选区统计" name="accounting">
                        <div class="chart" id="chart"></div>
                    </el-tab-pane>
                </el-tabs>
            </div>
        </el-dialog>
        <el-dialog title="对比统计" :visible.sync="isShowCompareDialog" size="tiny" width="80%"
                   :close-on-click-modal="false" :close-on-press-escape="false" :show-close="true">
            <div>
                <div class="chart2" id="chart2"></div>
                <el-table stripe :data="selectedStudentList" border style="width: 100%">
                    <el-table-column align="center" label="姓名" show-overflow-tooltip>
                        <template slot-scope="scope">
                            {{scope.row.stuName}}
                        </template>
                    </el-table-column>
                    <el-table-column align="center" v-for="(item, index) in sectionList" :key="index" :label="item" prop="">
                        <template slot-scope="scope">
                            {{scope.row.staticsList[index].zoneCount ? scope.row.staticsList[index].zoneCount : "0"}}
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </el-dialog>
    </div>
</template>
<script>
    import echarts from 'echarts';
    import mixins from '@/mixins/windowResize';
    import baseMixin from '@/mixins/baseMixin';

    import {getPriodClassStuZoneCountData, getPriodClassStuZoneRecordPageList} from '@/api/devideSectionBeiyou'
    import {
        isShowByPermission,
        isShowByRole
    } from "@/utils";
    import TermGradeClassSelector from '@/components/TermGradeClassSelector'

    export default {
        data() {
            return {
                isShowStuInfoDialog: false,
                obj: {
                    termId: '',
                    duration: [],
                    gradeId: '',
                    classId: ''
                },
                dataList: [],
                sectionList: [],
                queryArgs: {
                    all: true,
                    manager: false,
                    notlimit: true,
                    submanager: false,
                    teacher: false
                },
                stuInfoDataList: [],
                currentStudent: {},
                activeName: 'log',
                selectedStudentList: [],
                isShowCompareDialog: false,
            }
        },
        mixins: [mixins, baseMixin],
        components: {TermGradeClassSelector},
        filters: {
            timeFilter(time) {
                return time ? time.slice(0, time.lastIndexOf(':')) : '';
            }
        },
        computed: {
            exportUrl() {
                return `${global.BasePath}structure/autonomyZone/exportClassStuZoneCountXls?beginDate=${this.obj.duration[0]}&endDate=${this.obj.duration[1]}&classId=${this.obj.classId}&gradeId=${this.obj.gradeId}&schoolTimeId=${this.obj.termId}&token=${this.$store.getters.token}`;
            }
        },
        mounted() {
            if (!isShowByRole(20210705)) {
                this.queryArgs = {
                    all: false,
                    manager: false,
                    notlimit: false,
                    submanager: false,
                    teacher: true
                }
            }
            this.obj = {
                termId: parseInt(this.$route.query.termId),
                duration: [this.$route.query.beginDate, this.$route.query.endDate],
                gradeId: parseInt(this.$route.query.gradeId),
                classId: parseInt(this.$route.query.classId)
            }
        },
        methods: {
            isShowByPermission,
            jumpToPage(path, query = {}) {
                this.$router.push({
                    path,
                    query
                })
            },
            selectable(val) {
                return !val.isSummary;
            },
            handleSelectionChange(val) {
                this.selectedStudentList = val;
            },
            showStuInfo(item) {
                this.isShowStuInfoDialog = true;
                this.currentStudent = item;
                this.getPriodClassStuZoneRecordPageListFunc();

            },
            showCompare() {
                if(this.selectedStudentList.length === 0) {
                    this.$message.error('至少选择一个学生');
                } else {
                    this.isShowCompareDialog = true;
                    const xAxisData = this.selectedStudentList[0].staticsList.map(item => item.zoneTypeName),
                        seriesData = this.selectedStudentList.map(item => ({
                            name: item.stuName,
                            type: 'bar',
                            emphasis: {
                                focus: 'series'
                            },
                            data: []
                        }));
                    this.selectedStudentList.forEach((studentItem, index) => {
                        studentItem.staticsList.forEach(statisticsItem => {
                            seriesData[index].data.push(statisticsItem.zoneCount);
                        })
                    });
                    setTimeout(() => {
                        this.drawCompareBarChart('chart2', {
                            xAxisData,
                            seriesData
                        })
                    }, 300);
                }

            },
            getPriodClassStuZoneRecordPageListFunc() {
                getPriodClassStuZoneRecordPageList({
                    classId: this.obj.classId,
                    gradeId: this.obj.gradeId,
                    schoolTimeId: this.obj.termId,
                    beginDate: this.obj.duration[0],
                    endDate: this.obj.duration[1],
                    pageNo: this.pagination.pageNo,
                    pageSize: 10,
                    searchName: '',
                    stuId: this.currentStudent.stuId
                })
                    .then(res => res.data)
                    .then(data => {
                        this.stuInfoDataList = data.data.dataList;
                        this.pagination.total = data.data.pagination.total;
                        const xAxisData = [], seriesData = [];
                        this.currentStudent.staticsList.forEach(statisticItem => {
                            xAxisData.push(statisticItem.zoneTypeName);
                            seriesData.push(statisticItem.zoneCount);
                        });

                        this.drawBarChart('chart', {
                            xAxisData,
                            seriesData
                        })
                    })
            },
            getListData() {
                if (!this.obj.classId || !this.obj.gradeId) {
                    this.dataList = [];
                    this.sectionList = [];
                    return undefined;
                }
                this.className = this.$refs.selector.getClassName();
                getPriodClassStuZoneCountData({
                    classId: this.obj.classId,
                    gradeId: this.obj.gradeId,
                    schoolTimeId: this.obj.termId,
                    beginDate: this.obj.duration[0],
                    endDate: this.obj.duration[1]
                })
                    .then(res => res.data)
                    .then(data => {
                        if (data.result) {
                            const dataList = data.data.classStuZoneDataList;
                            if (data.data.classStuZoneDataList && data.data.classStuZoneDataList.length !== 0) {
                                this.sectionList = data.data.classStuZoneDataList[0].staticsList.map(item => item.zoneTypeName);
                            }
                            const staticsList = [];
                            data.data.allZoneDataList.forEach(item => {
                                staticsList.push({zoneCount: item.zoneCount});
                            });
                            dataList.push({
                                stuName: '总计',
                                isSummary: true,
                                staticsList
                            });
                            this.dataList = dataList;

                        } else {
                            this.$message.warning(data.msg);
                        }
                    })
            },

            // 点击搜索
            clickSearch() {
                this.getListData()
            },
            // 点击学生
            clickStudent(data) {
                if (!data.totalCount && data.totalCount === 0) {
                    this.$message.warning('还没有阅读数据哦！！！');
                    return undefined;
                }
                this.$router.push({
                    path: 'staticStudentDetail', query: {
                        term: this.term,
                        studentId: data.studentId,
                        month: this.month,
                        gradeId: this.grade
                    }
                })
            },
            drawBarChart(container, args) {
                const option = {
                    color: [
                        "#3fb1e3",
                        "#6be6c1",
                        "#626c91",
                        "#a0a7e6",
                        "#c4ebad",
                        "#96dee8"
                    ],
                    axisLabel: {
                        interval: 0,
                        show: true,
                        formatter: function (value) {
                            return value.length > 4 ? value.slice(0, 4) + '...' : value;
                        }
                    },
                    xAxis: {
                        type: 'category',
                        data: args.xAxisData
                    },
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                            type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                        }
                    },
                    yAxis: {
                        minInterval: 1,
                        type: 'value'
                    },
                    series: [
                        {
                            data: args.seriesData,
                            type: 'bar',
                            label: {
                                normal: {
                                    show: true,
                                    position: 'top'
                                }
                            },
                        }
                    ]
                };
                if (document.getElementById(container)) {
                    const myChart = echarts.init(document.getElementById(container));
                    myChart.setOption(option, true);
                }
            },
            drawCompareBarChart(container, args) {
                const option = {
                    color: [
                        "#3fb1e3",
                        "#6be6c1",
                        "#626c91",
                        "#a0a7e6",
                        "#c4ebad",
                        "#96dee8"
                    ],
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'shadow'
                        }
                    },
                    axisLabel: {
                        interval: 0,
                        show: true,
                        formatter: function (value) {
                            return value.length > 4 ? value.slice(0, 4) + '...' : value;
                        }
                    },
                    legend: {
                        data: ['Forest', 'Steppe', 'Desert', 'Wetland']
                    },

                    xAxis: [
                        {
                            type: 'category',
                            axisTick: { show: false },
                            data: args.xAxisData
                        }
                    ],
                    yAxis: [
                        {
                            minInterval: 1,
                            type: 'value'
                        }
                    ],
                    series: args.seriesData
                };
                if (document.getElementById(container)) {
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

    #chart, #chart2 {
        height: 600px;
        width: 1100px;
        margin: 0 auto;
    }

</style>
