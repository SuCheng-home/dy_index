<template>
    <div class="itemManagementStatisticsfive">
        <el-tabs type="border-card"  v-model="activeName" @tab-click="tabsfun()">
            <el-tab-pane label="物品统计" name="six"></el-tab-pane>
            <el-tab-pane label="领用统计" name="one"></el-tab-pane>
            <el-tab-pane label="教师统计" name="two"></el-tab-pane>
            <el-tab-pane label="归还统计" name="three"></el-tab-pane>
            <el-tab-pane label="部门统计" name="four"></el-tab-pane>
            <el-tab-pane label="易耗品统计" name="five">
                <div class="top">
                    <!-- <el-button  type="default" @click="$router.back()" size="medium">返回</el-button> -->
                    <el-date-picker v-model="daterange" size="medium" type="daterange" class="mywidthdaterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" :clearable="false"  @change="easyConsumeGoodAnalysisfun"></el-date-picker>
                   <el-button type="primary" size="medium"  @click="exportExcel('#outTable', `易耗品领用统计.xlsx`)"   v-if="dataList.length>0">导出</el-button>
                </div>
                <div class="subject" :style="`height: ${maxH-30}px;    overflow: auto;`">
                    <div id="myecharts"></div>
                </div>
                 <div  style="display: none;"   id="outTable" >
          <el-table border fit stripe   highlight-current-row style="width: 100%;" ref="print"  :data="dataList"  :span-method="objectSpanMethod">     
           <el-table-column  label="物品名称" >
                <template slot-scope="scope">
                    <span>{{scope.row.goodName}}</span>
                </template>
           </el-table-column>
           <el-table-column  label="数量" >
               <template slot-scope="scope">
                    <span>{{scope.row.orderCount}}</span>
                </template>
           </el-table-column>
    </el-table>
                
        </div> 
            </el-tab-pane>
        </el-tabs>       
    </div>
</template>
<script>
    import moment from "moment";
    import {easyConsumeGoodAnalysis} from "@/api/itemManagement";
    import baseMixin from '@/mixins/baseMixin';
    import mixin from '@/mixins/windowResize';
    import echarts from 'echarts';
    export default {
        name: "statisticsIndex",
        data() {
            return {
                daterange: [new Date(), new Date()],
                exportUrl: '',
                pagination:{
                    startDate:'',
                    endDate:''
                },
                dataList: [],
                activeName:"five",
                myecharts:null
            }
        },
        mixins: [baseMixin, mixin],
        created() {
            this.daterange= [this.$route.query.startDate,this.$route.query.endDate];
            this.easyConsumeGoodAnalysisfun();
        },
        methods: {
            easyConsumeGoodAnalysisfun() {
                this.pagination.startDate = moment(this.daterange[0]).format('YYYY-MM-DD');
                this.pagination.endDate = moment(this.daterange[1]).format('YYYY-MM-DD');
                easyConsumeGoodAnalysis(this.pagination)
                    .then(res => res.data)
                    .then(data => {
                        let mydata=data.data;
                        this.dataList=mydata;
                        let listname=[];
                        let listone=[];
                        for(let i=0;i<mydata.length;i++){
                          listname.push(mydata[i].goodName)
                          listone.push(mydata[i].orderCount-0)
                        }
                        this.myechartsfun(listname,listone)
                    })
            },
             //年级统计
            myechartsfun(listname,listone){
                this.myecharts = echarts.init( document.getElementById("myecharts"));
                this.myecharts.setOption({
                    title: {text: "易耗品领用统计",x: "center"},
                    grid: {left: "2%",right: "8%",bottom: "6%",containLabel: true},
                    color: ["#50E0BD"], //每个区域的颜色
                    tooltip: {trigger: "item",formatter: "{a} <br/>{b} : {c}"},
                    legend: {data: ["领用数量"],x: "center",y: "bottom"},
                    xAxis: {data:listname, name:'物品名称',},
                    yAxis : [{ name:'数量',type : 'value'},],        
                    series: [
                        { barMaxWidth: 60,name:'领用数量',type:'bar',data:listone, label: { normal: { show: true,position: "top"}}},
                    ]
                });
            },
            tabsfun(){
                if(this.activeName=='six'){
                    this.$router.replace({
                    path: 'itemManagementStatisticssix',
                    query: {
                        startDate:moment(this.daterange[0]).format('YYYY-MM-DD'),
                        endDate:moment(this.daterange[1]).format('YYYY-MM-DD')
                      }
                   });
                }
                if(this.activeName=='one'){
                    this.$router.replace({
                    path: 'itemManagementStatisticsone',
                    query: {
                        startDate:moment(this.daterange[0]).format('YYYY-MM-DD'),
                        endDate:moment(this.daterange[1]).format('YYYY-MM-DD')
                      }
                   });
                }
                if(this.activeName=='two'){
                    this.$router.replace({
                    path: 'itemManagementStatisticstwo',
                    query: {
                        startDate:moment(this.daterange[0]).format('YYYY-MM-DD'),
                        endDate:moment(this.daterange[1]).format('YYYY-MM-DD')
                      }
                   });
                }
                if(this.activeName=='three'){
                    this.$router.replace({
                    path: 'itemManagementStatisticsthree',
                    query: {
                        startDate:moment(this.daterange[0]).format('YYYY-MM-DD'),
                        endDate:moment(this.daterange[1]).format('YYYY-MM-DD')
                      }
                   });
                }
                if(this.activeName=='four'){
                    this.$router.replace({
                    path: 'itemManagementStatisticsfour',
                    query: {
                        startDate:moment(this.daterange[0]).format('YYYY-MM-DD'),
                        endDate:moment(this.daterange[1]).format('YYYY-MM-DD')
                      }
                   });
                }
                if(this.activeName=='five'){
                    this.$router.replace({
                    path: 'itemManagementStatisticsfive',
                    query: {
                        startDate:moment(this.daterange[0]).format('YYYY-MM-DD'),
                        endDate:moment(this.daterange[1]).format('YYYY-MM-DD')
                      }
                   });
                }
                
            }
        }
    }
</script>

<style lang="scss" scoped>
    .itemManagementStatisticsfive {
        padding: 12px;
        .top {
          padding-bottom: 10px;
          border-bottom: 1px solid #e7eaec;
          margin-bottom: 20px;
       }
        #myecharts{
            width:900px;
            height: 500px;
            margin: 0 auto;
       }
    }
</style>
