<!--添加通知-->
<template>
    <div class="app-container calendar-list-container" id="noticeAdd">
        <div :style="{height: `${maxH + 5}px`}">
            <div class="top">
                <el-date-picker size="medium" ref="date"  v-model="duration" type="daterange" class="filter-item mywidthdaterange"
                                :editable="false"
                                :clearable='false' align="right" unlink-panels placeholder="选择时间范围"
                                @change="statisticsByUseTypeFunc()"></el-date-picker>
            </div>
            <div v-if="dataList.length !== 0">
                <div id="chart"></div>
            </div>
            <el-table stripe :data="tableDataList" border fit highlight-current-row
                      style="width: 100%">
                <el-table-column align="center" v-for="(dataItem, index) in dataList" :label="dataItem.useTypeName" :key="index">
                    <template slot-scope="scope">
                        <span class="link-type" @click="jumpToPage('printAccountingApplyRecord', {
                            startDate: $moment(duration[0]).format('YYYY-MM-DD'),
                            endDate: $moment(duration[1]).format('YYYY-MM-DD'),
                            useType: dataList[index].useType
                        })">{{scope.row[dataItem.useTypeName]}}</span>
                    </template>
                </el-table-column>
            </el-table>
            <default-page v-if="dataList.length === 0" Mes="暂无数据"></default-page>
        </div>
    </div>
</template>

<script>
    import DefaultPage from '@/components/DefaultPage';

    import echarts from 'echarts';
    import Backtool from '@/components/BackTool';
    import mixin from '@/mixins/windowResize';
    import baseMixin from '@/mixins/baseMixin';
    import {getSchoolTimeAllList} from '@/api/wtManager';

    import {
        statisticsByUseType
    } from '@/api/printApplication';

    import {mapGetters} from 'vuex';

    function drawPieChart(container, args) {
        const option = {
            title: {
                text: '按用途类型分类统计',
                left: 'center',
                top: '50px'
            },
            tooltip: {
                trigger: 'item',
                formatter: '{a} <br/>{b} : {d}%'
            },
            legend: {
                left: 'center',
                top: '100px',
                data: args.legend
            },
            series: [
                {
                    name: '用途',
                    type: 'pie',
                    radius: '60%',
                    center: ['50%', '60%'],
                    data: args.series,
                    emphasis: {
                        itemStyle: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
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

    export default {
        components: {
            Backtool,
            DefaultPage
        },
        computed: {
            ...mapGetters(['isStandalone', 'userInfo']),
        },
        data() {
            return {
                activeName: 'accountingByUsage',
                duration: [this.$moment().startOf('month'), new Date()],
                searchTitle: '',
                dataList: [],
                tableDataList: []
            };
        },
        mixins: [mixin, baseMixin],
        created() {
            getSchoolTimeAllList()
                .then(res => res.data)
                .then(data => {
                    const currentTerm = data.data.find(item => item.isCurrent == 1);
                    if(currentTerm) {
                         if(currentTerm.startDate>(this.$moment(new Date()).format('YYYY-MM-DD')+"")){
                             this.duration = [new Date(),currentTerm.startDate];
                            }else{
                              this.duration = [currentTerm.startDate,new Date()];
                            }
                    }
                    this.statisticsByUseTypeFunc(true);
                });
        },
        methods: {
            statisticsByUseTypeFunc(isInit = false) {
                statisticsByUseType({
                    startDate: this.$moment(this.duration[0]).format('YYYY-MM-DD'),
                    endDate: this.$moment(this.duration[1]).format('YYYY-MM-DD'),
                    kind: 2
                })
                    .then(res => res.data)
                    .then(data => {
                        this.dataList = data.data.dataList;
                        const legend = [];
                        const series = [];
                        data.data.array.forEach(item => {
                            legend.push(item.name);
                            series.push({value: item.y, name: item.name});
                        });
                        const tableDataObj = {};
                        data.data.dataList.forEach(item => {
                            tableDataObj[item.useTypeName] = item.allPapers;
                        });
                        this.tableDataList = [tableDataObj];
                        setTimeout(() => {
                            drawPieChart('chart', {
                                legend,
                                series
                            });
                        }, 500);
                    })
            }
        }
    }
</script>
<style scoped lang="scss">
 .top{
      padding-bottom: 10px;
      border-bottom: 1px solid #e7eaec;     
    }
    #chart {
        height: 500px;
    }
</style>
