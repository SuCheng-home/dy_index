<!--添加通知-->
<template>
    <div class="app-container calendar-list-container" id="noticeAdd">
        <el-tabs @tab-click="tabsfunc" v-model="activeName" type="border-card">
            <el-tab-pane label="按用户统计" name="accountingByUser">
            </el-tab-pane>
            <el-tab-pane label="按纸张统计" name="accountingByPaper">
            </el-tab-pane>
            <el-tab-pane label="按用途类型统计" name="accountingByUsage">
                <div :style="{height: `${maxH + 14}px`}" class="center">
                    <div class="top">
                        <el-date-picker size="medium" ref="date"  v-model="duration" type="daterange" class="filter-item mywidthdaterange"
                                        :editable="false"
                                        :clearable='false' align="right" unlink-panels placeholder="选择时间范围"
                                        @change="statisticsByUseTypeFunc()"></el-date-picker>
                         <el-select
                                size="medium"
                                placeholder="请选择"
                                value-key="id" style="width:150px"
                                v-model="useType"
                                @change="statisticsByUseTypeFunc()"
                            >
                        <el-option label="全部分类" :value="0"></el-option>
                        <el-option :label="item.name"  v-for="(item,index) in applyTypeList" :key="index" :value="item.id"></el-option>
                    </el-select> 
                    </div>
                   <div class="bodychart">
                      <!-- 顶部卡片区 -->
                      <div class="card-row"  >
                        <div class="card-item" v-for="(item, index) in cardList" :key="index">
                          <div class="card-top">
                            <span class="card-label">{{ item.label }}</span>
                            <span class="card-count" v-if="item.count">{{ item.count }}</span>
                          </div>
                          <div class="card-price" :style="{color: item.color}">¥{{ item.price }}</div>
                        </div>
                      </div>
                      <!-- 图表区 -->
                      <div class="chart-row">
                        <div class="chart-box">
                          <div class="chart-title">按分类统计纸张用量（张）</div>
                          <div id="chartSheets" class="chart-canvas"></div>
                        </div>
                        <div class="chart-box">
                          <div class="chart-title">按分类统计纸张用量（元）</div>
                          <div id="chartMoney" class="chart-canvas"></div>
                        </div>
                      </div>
                    </div>

                    <!-- <default-page v-if="dataList.length === 0" Mes="暂无数据"></default-page> -->
                </div>
            </el-tab-pane>
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
    import {statisticsByUseType,getTypeTree,statisticsUseByUseType,findPriceList,statisticsUsezjByUseType} from '@/api/printApplication';
    import {mapGetters} from 'vuex';
    import {getDicByCode} from '@/utils/utils';
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
                cardList:[],
                useType:0,
                applyTypeList:[],
                kind:'file',
                typeListname:[]
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
                            this.typeListname = list.filter(({code}) => types.indexOf(`${code}`) != -1).map(item => item.value);
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
                        })
                });
             this.getTypeTreeData();
           
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
            tabsfunc() {
                if (this.activeName === 'accountingByUser') {
                    this.jumpToPage('printAccountingByUser');
                } else if (this.activeName === 'accountingByPaper') {
                    this.jumpToPage('printAccountingByPaper');
                }
            },

            statisticsByUseTypeFunc() {
                statisticsUsezjByUseType({
                    startDate: this.$moment(this.duration[0]).format('YYYY-MM-DD'),
                    endDate: this.$moment(this.duration[1]).format('YYYY-MM-DD'),
                    kind: 1,
                    useType:this.useType,
                    searchTitle:''
                })
                    .then(res => res.data)
                    .then(data => {
                        let paperInfo=data.data.paperInfo
                        this.cardList=[]
                        let typeList = [
                            '', 'A3', 'A4', 'B5', '16K', '32K', '8K'
                        ];
                        if(!paperInfo){
                                paperInfo={typeMap:{1:{},2:{},3:{},4:{},5:{},6:{}}}
                            }                       
                            Object.keys(paperInfo.typeMap).forEach(type => {
                                paperInfo[`${typeList[type]}S`] = paperInfo.typeMap[type].totalPaperSingle || 0;
                                paperInfo[`${typeList[type]}D`] = paperInfo.typeMap[type].totalPaperDouble || 0;
                                paperInfo[`${typeList[type]}Sn`] = paperInfo.typeMap[type].totalPriceSingle ? Math.round(paperInfo.typeMap[type].totalPriceSingle * 100) / 100 : 0;
                                paperInfo[`${typeList[type]}Dn`] = paperInfo.typeMap[type].totalPriceDouble ? Math.round(paperInfo.typeMap[type].totalPriceDouble * 100) / 100 : 0;
                            })
                        this.cardList.push({
                            label: '总费用', count: '', price: paperInfo.totalCost ? Math.round(paperInfo.totalCost * 100) / 100 : 0, color: '#36b2e6' 
                        })
                         for(let i=0;i<typeList.length;i++){
                           for(let j=0;j<this.typeListname.length;j++){
                                    if(typeList[i]==this.typeListname[j]){
                                        this.cardList.push({
                                            label:typeList[i]+'单', count:paperInfo[typeList[i]+'S'], price: paperInfo[typeList[i]+'Sn'], color: '#36b2e6'
                                         })
                                         this.cardList.push({
                                             label:typeList[i]+'双', count:paperInfo[typeList[i]+'D'], price: paperInfo[typeList[i]+'Dn'], color: '#36b2e6'  
                                        })
                                       
                                    }
                                }
                        }   
                      
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
                                item[`${typeList[type]}S`] = item.paperInfo.typeMap[type].totalPaperSingle || 0;
                                item[`${typeList[type]}D`] = item.paperInfo.typeMap[type].totalPaperDouble || 0;
                                item[`${typeList[type]}paperNum`] = item.paperInfo.typeMap[type].paperNum || 0;
                                item[`${typeList[type]}Sn`] = item.paperInfo.typeMap[type].totalPriceSingle ? Math.round(item.paperInfo.typeMap[type].totalPriceSingle * 100) / 100 : 0;
                                item[`${typeList[type]}Dn`] = item.paperInfo.typeMap[type].totalPriceDouble ? Math.round(item.paperInfo.typeMap[type].totalPriceDouble * 100) / 100 : 0;
                            })
                        });
                        this.dataList = data.data;
                        let obj={
                            namelist:[],
                            typenameonelist:[],
                            typenametwolist:[],
                            numonelist:[],
                            numtwolist:[]
                        }
                        for(let i=0;i<typeList.length;i++){
                           for(let j=0;j<this.typeListname.length;j++){
                                    if(typeList[i]==this.typeListname[j]){
                                        obj.typenameonelist.push(typeList[i])
                                        obj.typenametwolist.push(typeList[i]+'单')
                                        obj.typenametwolist.push(typeList[i]+'双')   
                                        obj.numonelist.push({name: typeList[i], type: 'bar', stack: 'total', data:[]}) 
                                        obj.numtwolist.push({name:typeList[i]+'单', type: 'bar', data:[]}) 
                                        obj.numtwolist.push({name:typeList[i]+'双', type: 'bar', data:[]})
                                    }
                                }
                        }      
                                 
                        for(let i=0;i<this.dataList.length;i++){
                          obj.namelist.push(this.dataList[i].typeName)                        
                           for(let j=0;j<obj.numonelist.length;j++){
                               obj.numonelist[j].data.push(this.dataList[i][obj.numonelist[j].name+'paperNum'])                              
                           }
                           for(let j=0;j<obj.numtwolist.length;j++){
                               if(j%2){
                                  obj.numtwolist[j].data.push(this.dataList[i][obj.numtwolist[j].name.slice(0, -1)+'Dn'])
                               }else{
                                  obj.numtwolist[j].data.push(this.dataList[i][obj.numtwolist[j].name.slice(0, -1)+'Sn'])
                               }                              
                           }
                        }  
                      
                        setTimeout(() => {
                             this.initCharts(obj);
                        }, 500);
                    })
            },
            initCharts(obj) {
              
                // 堆叠柱状图 - 按分类统计纸张用量（张）
                const sheetsEl = document.getElementById('chartSheets');
                if (sheetsEl) {
                    const sheetsChart = echarts.init(sheetsEl);
                    sheetsChart.setOption({
                        tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
                        legend: {
                            bottom: 0,
                            data: obj.typenameonelist,
                            textStyle: { fontSize: 12 }
                        },
                        grid: { left: '8%', right: '5%', top: '5%', bottom: '15%' },
                        xAxis: { type: 'category', data: obj.namelist },
                        yAxis: { type: 'value'},
                        color:['#409eff','#e6a23c','#67c23a','#9b59b6','#f39c12','#36b2e6','#8e44ad'],
                        series:obj.numonelist
                    });
                    window.addEventListener('resize', () => { sheetsChart.resize(); });
                }
                // 分组柱状图 - 按分类统计纸张用量（元）
                const moneyEl = document.getElementById('chartMoney');
                if (moneyEl) {
                    const moneyChart = echarts.init(moneyEl);
                    moneyChart.setOption({
                        tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
                        legend: {
                            bottom: 0,
                            data:obj.typenametwolist,
                            textStyle: { fontSize: 10 }
                        },
                        grid: { left: '8%', right: '5%', top: '5%', bottom: '18%' },
                        xAxis: { type: 'category', data: obj.namelist },
                        yAxis: { type: 'value'},
                        color:['#409eff','#e6a23c','#67c23a','#9b59b6','#f39c12','#36b2e6','#8e44ad'],
                        series:obj.numtwolist
                    });
                    window.addEventListener('resize', () => { moneyChart.resize(); });
                }
            }
        }
    }
</script>
<style scoped lang="scss">
.center{
        overflow: auto;
    }
 .top{
      padding-bottom: 10px;
      border-bottom: 1px solid #e7eaec;     
    }
    #chart {
        height: 500px;
    }
    .bodychart {
        padding: 15px 0;
    }
    .card-row {
        display: flex;
        flex-wrap: wrap;
        gap: 12px;
        margin-bottom: 20px;
    }
    .card-item {
        flex: 0 0 calc(20% - 12px);
        min-width: 140px;
        border: 1px solid #e0e0e0;
        border-radius: 4px;
        padding: 12px 15px;
        box-sizing: border-box;
    }
    .card-top {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 8px;
        font-size: 13px;
        color: #666;
    }
    .card-label {
        font-weight: 500;
        color: #333;
    }
    .card-count {
        color: #999;
        font-size: 12px;
    }
    .card-price {
        font-size: 20px;
        font-weight: bold;
    }
    .chart-row {
        display: flex;
        gap: 20px;
        width: 100%;
    }
    .chart-box {
        flex: 1;
        min-width: 0;
    }
    .chart-title {
        font-size: 14px;
        color: #333;
        font-weight: 500;
        margin-bottom: 10px;
    }
    .chart-canvas {
        width: 100%;
        height: 350px;
    }
</style>
