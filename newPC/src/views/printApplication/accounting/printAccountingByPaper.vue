<!--添加通知-->
<template>
    <div class="app-container calendar-list-container" id="noticeAdd">
        <el-tabs @tab-click="tabsfunc" v-model="activeName" type="border-card">
            <el-tab-pane label="按用户统计" name="accountingByUser">
            </el-tab-pane>
            <el-tab-pane label="按纸张统计" name="accountingByPaper">
                <div class="center" :style="{height: `${maxH + 14}px`}">
                    <div class="top">
                        <el-date-picker size="medium" ref="date"  v-model="duration" type="daterange" class="filter-item mywidthdaterange"
                                        :editable="false"
                                        :clearable='false' align="right" unlink-panels placeholder="选择时间范围"
                                        @change="statisticsByPaperSizeFunc()"></el-date-picker>
                            <el-select
                                size="medium"
                                placeholder="请选择"
                                value-key="id" style="width:150px"
                                v-model="useType"
                                @change="statisticsByPaperSizeFunc()"
                            >
                        <el-option label="全部分类" :value="0"></el-option>
                        <el-option :label="item.name"  v-for="(item,index) in applyTypeList" :key="index" :value="item.id"></el-option>
                    </el-select> 
                    </div>
                    <div v-if="dataList.length !== 0">
                        <div id="chart"></div>
                    </div>
                   <el-table stripe :data="newdataList" border fit highlight-current-row
                              style="width: 100%" >
                        <el-table-column align="center" label="分类名称" prop="typeName">
                        </el-table-column>
                        <el-table-column align="center" label="A3" v-if="typeList.indexOf('A3') != -1">
                            <el-table-column align="center" label="单页" prop="A3S">
                            </el-table-column>
                            <el-table-column align="center" label="双页" prop="A3D">
                            </el-table-column>
                        </el-table-column>
                        <el-table-column align="center" label="A4" v-if="typeList.indexOf('A4') != -1">
                            <el-table-column align="center" label="单页" prop="A4S">
                            </el-table-column>
                            <el-table-column align="center" label="双页" prop="A4D">
                            </el-table-column>
                        </el-table-column>
                        <el-table-column align="center" label="B5" v-if="typeList.indexOf('B5') != -1">
                            <el-table-column align="center" label="单页" prop="B5S">
                            </el-table-column>
                            <el-table-column align="center" label="双页" prop="B5D">
                            </el-table-column>
                        </el-table-column>
                        <el-table-column align="center" label="16K" v-if="typeList.indexOf('16K') != -1">
                            <el-table-column align="center" label="单页" prop="16KS">
                            </el-table-column>
                            <el-table-column align="center" label="双页" prop="16KD">
                            </el-table-column>
                        </el-table-column>
                        <el-table-column align="center" label="32K" v-if="typeList.indexOf('32K') != -1">
                            <el-table-column align="center" label="单页" prop="32KS">
                            </el-table-column>
                            <el-table-column align="center" label="双页" prop="32KD">
                            </el-table-column>
                        </el-table-column>
                        <el-table-column align="center" label="8K" v-if="typeList.indexOf('8K') != -1">
                            <el-table-column align="center" label="单页" prop="8KS">
                            </el-table-column>
                            <el-table-column align="center" label="双页" prop="8KD">
                            </el-table-column>
                        </el-table-column>
                        <el-table-column align="center" label="总张数" prop="totalNum">
                             <template slot-scope="scope">
                                {{scope.row.paperInfo?scope.row.paperInfo.totalNum:0}}
                            </template>
                        </el-table-column>
                        <el-table-column align="center" label="总金额(元)" prop="totalCost">
                               <template slot-scope="scope">
                                {{scope.row.paperInfo?scope.row.paperInfo.totalCost:0}}
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </el-tab-pane>
            <el-tab-pane label="按用途类型统计" name="accountingByUsage"></el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
    import DefaultPage from '@/components/DefaultPage';
    import echarts from 'echarts';
    import Backtool from '@/components/BackTool';
    import mixin from '@/mixins/windowResize';
    import baseMixin from '@/mixins/baseMixin';
    import {getSchoolTimeAllList} from '@/api/wtManager';
    import {statisticsByPaperSize,getTypeTree,statisticsUseByUseType,findPriceList} from '@/api/printApplication';
    import {getDicByCode} from '@/utils/utils';
    import {mapGetters} from 'vuex';
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
                activeName: 'accountingByPaper',
                duration: [this.$moment().startOf('month'), new Date()],
                searchTitle: '',
                dataList: [],
                 useType:0,
                applyTypeList:[],
                kind:'file',
                newdataList:[],
                 typeList: [],
            };
        },
        mixins: [mixin, baseMixin],
        created() {
               getDicByCode('printSeniorApplyPaperSizeType')
                .then(list => {
                    findPriceList()
                        .then(res => res.data)
                        .then(data => {
                            const types = data.data.map(({type}) => `${type}`);
                            this.typeList = list.filter(({code}) => types.indexOf(`${code}`) != -1).map(item => item.value);
                        })
                });
            this.getTypeTreeData();
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
                    this.statisticsByPaperSizeFunc();
                });
        },
        methods: {
              getTypeTreeData() {
                return Promise.all([
                    getTypeTree({
                        kind: 1
                    })
                        .then(res => res.data.data),
                    getTypeTree({
                        kind: 2
                    })
                        .then(res => res.data.data)
                ])
                    .then(([type1Data, type2Data]) => {
                        if(this.kind === 'file' && (!type1Data || type1Data.length == 0 || type1Data[0].children.length == 0)) {
                            // this.$message.error('请设置印制申请用途类型')
                        } else if(this.kind !== 'file' && (!type2Data || type2Data.length == 0 || type2Data[0].children.length == 0)) {
                            // this.$message.error('请设置耗材申请用途类型')
                        } else {
                            this.applyTypeList = this.kind === 'file' ? type1Data[0].children : type2Data[0].children;
                        }
                    })
            },
            drawBarChart(container, args) {
                const colorList = ['#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de', '#3ba272', '#fc8452', '#9a60b4', '#ea7ccc', '#48b8d0'];
                const option = {
                    xAxis: {
                        type: 'category',
                        data: args.xAxis
                    },
                    yAxis: {
                        name:'张数',
                        type: 'value'
                    },
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                            type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                        },
                        formatter: (params) => {
                            const index = params[0].dataIndex;
                            return `${params[0].name}:${params[0].value}张`
                        }
                    },
                    series: [{
                        name: '张数',
                        data: args.series,
                        type: 'bar',
                        itemStyle: {
                            color: (params) => {
                                return colorList[params.dataIndex % colorList.length];
                            }
                        },
                        label: {
                            show: true,
                            formatter: (params) => {
                                const index = params.dataIndex;
                                return `${params.name}:${params.value}张`
                            }
                        },
                    }]
                };
                if(document.getElementById(container)) {
                    const myChart = echarts.init(document.getElementById(container));
                    myChart.setOption(option, true);
                    myChart.on('click', (param) => {
                        // console.log(param,this.dataList,param.dataIndex)
                        this.jumpToPage('printAccountingByPaperDetail', {
                            pageSizeType: this.dataList[param.dataIndex].paperSizeType,
                            startDate: this.$moment(this.duration[0]).format('YYYY-MM-DD'),
                            endDate: this.$moment(this.duration[1]).format('YYYY-MM-DD'),
                            useType:this.useType
                        })
                    });
                }
            },
            tabsfunc() {
                if (this.activeName === 'accountingByUser') {
                    this.jumpToPage('printAccountingByUser');
                } else if (this.activeName === 'accountingByUsage') {
                    this.jumpToPage('printAccountingByUsage');
                }
            },

            statisticsByPaperSizeFunc() {
                statisticsByPaperSize({
                    startDate: this.$moment(this.duration[0]).format('YYYY-MM-DD'),
                    endDate: this.$moment(this.duration[1]).format('YYYY-MM-DD'),
                    kind: 1,
                    useType:this.useType
                })
                    .then(res => res.data)
                    .then(data => {
                        const xAxis = [];
                        const series = [];
                        this.dataList = [];
                        data.data.forEach(item => {
                            xAxis.push(item.paperSizeName+'单');
                            series.push(item.totalPaperSingle);
                             xAxis.push(item.paperSizeName+'双');
                            series.push(item.totalPaperDouble);
                            this.dataList.push(item)
                            this.dataList.push(item)
                        });
                        setTimeout(() => {
                            this.drawBarChart('chart', {
                                xAxis,
                                series
                            });
                        }, 500);
                    })

               statisticsUseByUseType({
                    startDate: this.$moment(this.duration[0]).format('YYYY-MM-DD'),
                    endDate: this.$moment(this.duration[1]).format('YYYY-MM-DD'),
                    kind: 1,
                    useType:this.useType,
                    searchTitle:''
                })
                    .then(res => res.data)
                    .then(data => {
                         const typeList = [
                            '', 'A3', 'A4', 'B5', '16K', '32K', '8K'
                        ];
                        data.data.forEach(item => {
                            if(!item.paperInfo){
                                item.paperInfo={typeMap:{1:{},2:{},3:{},4:{},5:{},6:{}}}
                            }                       
                            Object.keys(item.paperInfo.typeMap).forEach(type => {
                                item[`${typeList[type]}S`] = item.paperInfo.typeMap[type].totalPaperSingle ? Math.round(item.paperInfo.typeMap[type].totalPaperSingle * 100) / 100 : 0;
                                item[`${typeList[type]}D`] = item.paperInfo.typeMap[type].totalPaperDouble ? Math.round(item.paperInfo.typeMap[type].totalPaperDouble * 100) / 100 : 0;

                            })
                        });
                        this.newdataList = data.data;
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
    .center{
        overflow: auto;
    }
</style>
