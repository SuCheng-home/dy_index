<template>
    <div class="page">
        <el-tabs v-model="activeName" type="border-card" @tab-click="clickTab">
            <el-tab-pane label="日期+班级统计" name="devideSectionAccounting">
            </el-tab-pane>
            <el-tab-pane label="日期+月+区域统计" name="devideSectionAccountingByMonth">
                <div class="read-statistics" :style="`height: ${notbmaxH - 50}px;`">
                    <div>
                        <div class="header">
                            <el-row>
                                <el-col :span="24">
                                    <el-select class="header-buttom" v-model="termId" size="medium" placeholder="请选择学期"
                                               @change="termChange">
                                        <el-option
                                            v-for="item in termList"
                                            :key="item.id"
                                            :label="item.schoolTimeName"
                                            :value="item.id"
                                        >
                                        </el-option>
                                    </el-select>
                                    <el-date-picker
                                        size="medium"
                                        value-format="yyyy-MM"
                                        v-model="duration"
                                        type="monthrange"
                                        align="right"
                                        unlink-panels
                                        range-separator="-"
                                        start-placeholder="开始月份"
                                        end-placeholder="结束月份"
                                        @change="getPriodMonthZoneCountDataListFunc"
                                        :picker-options="pickerOptions">
                                    </el-date-picker>
                                    <el-select size="medium" v-model="sectionIds" placeholder="请选择分区" multiple
                                               @change="getPriodMonthZoneCountDataListFunc">
                                        <el-option
                                            v-for="item in sectionTypeList"
                                            :key="item.code"
                                            :label="item.value"
                                            :value="item.code">
                                        </el-option>
                                    </el-select>
                                    <el-select class="header-buttom" v-model="classId" size="medium" placeholder="请选择"
                                               @change="getPriodMonthZoneCountDataListFunc">
                                        <el-option
                                            v-for="item in classList"
                                            :key="item.id"
                                            :label="item.name"
                                            :value="item.id"
                                        >
                                        </el-option>
                                    </el-select>
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
        </el-tabs>
    </div>

</template>
<script>
    import mixins from '@/mixins/windowResize';
    import baseMixin from '@/mixins/baseMixin';
    import echarts from 'echarts';
    import {
        getPriodMonthZoneCountDataList
    } from '@/api/devideSectionBeiyou';
    import {findSchoolDicsByCode} from '@/api/common/common';

    import moment from 'moment';
    import {
        termlist
    } from '@/api/readBookSet';
    import {
        queryDepartListTerm,
    } from '@/api/common/common';

    export default {

        data() {
            return {
                activeName: 'devideSectionAccountingByMonth',
                termList: [],
                currentTerm: null,
                termId: '',
                duration: [],
                sectionTypeList: [],
                sectionIds: [],
                classList: [],
                classId: 0
            }
        },
        computed: {
            pickerOptions() {
                return {
                    disabledDate: (time) => {
                        const timeText = moment(time).format('YYYY-MM');
                        return timeText > this.currentTerm.endDate.slice(0, 7) || timeText < this.currentTerm.startDate.slice(0, 7);
                    }
                }
            }
        },
        mixins: [mixins, baseMixin],
        mounted() {
            termlist()
                .then(res => res.data)
                .then(data => {
                    const pageData = data.data;
                    this.termList = pageData;
                    const currentTerm = pageData.find(item => item.isCurrent == 1);
                    this.currentTerm = currentTerm;
                    this.termId = currentTerm.id;
                    this.duration = [this.currentTerm.startDate.slice(0, 7), this.currentTerm.endDate.slice(0, 7)];
                    this.queryDepartListTermFunc();
                });
            findSchoolDicsByCode({
                dicCode: 'autonomyZoneTypes'
            })
                .then(res => res.data)
                .then(data => {
                    this.sectionTypeList = data.data;
                });
        },
        methods: {
            clickTab() {
                this.$router.replace({path: this.activeName})
            },
            termChange() {
                this.currentTerm = this.termList.find(item => item.id == this.termId);
                this.duration = [this.currentTerm.startDate.slice(0, 7), this.currentTerm.endDate.slice(0, 7)];
                this.queryDepartListTermFunc();
            },
            queryDepartListTermFunc() {
                return queryDepartListTerm({
                    currentTerm: this.currentTerm.isCurrent == 1,
                    termId: this.currentTerm.id,
                    all: true,
                    notlimit: true
                })
                    .then(res => res.data)
                    .then(data => {
                        const pageData = data.data || [];
                        pageData.unshift();
                        let classList = [{
                            id: 0,
                            name: '全部班级',
                            pid: 0
                        }];
                        pageData.forEach(gradeItem => {
                            classList = [...classList, ...gradeItem.childList];
                        });
                        this.classList = classList;
                        this.classId = 0;
                        this.getPriodMonthZoneCountDataListFunc();
                    })
            },
            getPriodMonthZoneCountDataListFunc() {
                const classObj = this.classList.find(item => item.id == this.classId);
                getPriodMonthZoneCountDataList({
                    beginDate: this.duration[0],
                    endDate: this.duration[1],
                    gradeId: classObj.pid,
                    classId: this.classId,
                    schoolTimeId: this.termId,
                    zoneTypeCode: this.sectionIds
                })
                    .then(res => res.data)
                    .then(data => {
                        const pageData = data.data;
                        const xAxisData = [], seriesData = [];
                        const zoneTypeCodeList = [];
                        pageData.forEach(item => {
                            xAxisData.push(item.zoneDate);
                            item.staticsList.forEach(staticsItem => {
                                const index = zoneTypeCodeList.indexOf(staticsItem.zoneTypeCode);
                                if (index === -1) {
                                    zoneTypeCodeList.push(staticsItem.zoneTypeCode);
                                    seriesData.push({
                                        name: staticsItem.zoneTypeName,
                                        type: 'line',
                                        data: [staticsItem.zoneCount]
                                    })
                                } else {
                                    seriesData[index].data.push(staticsItem.zoneCount);
                                }
                            })
                        });
                        this.drawLineChart('chart', {
                            xAxisData,
                            seriesData
                        });

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
                    title: {
                        text: ''
                    },
                    tooltip: {
                        trigger: 'axis'
                    },
                    legend: {
                        data: args.seriesData.map(item => item.name)
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true
                    },
                    xAxis: {
                        type: 'category',
                        boundaryGap: false,
                        data: args.xAxisData
                    },
                    yAxis: {
                        type: 'value'
                    },
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
    .page{
        padding:12px;
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
