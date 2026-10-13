<template>
    <div class="itemManagementStatisticstwo">
        <el-tabs type="border-card"  v-model="activeName" @tab-click="tabsfun()">
            <el-tab-pane label="物品统计" name="six"></el-tab-pane>
            <el-tab-pane label="领用统计" name="one"></el-tab-pane>
            <el-tab-pane label="教师统计" name="two">
                  <div class="top">
                      <!-- <el-button  type="default" @click="$router.back()" size="medium">返回</el-button> -->
            <el-date-picker v-model="daterange" size="medium" type="daterange" class="mywidthdaterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" :clearable="false"  @change="orderAnalysisByUserfun"></el-date-picker>
            <a class="export-btn" :href="exportUrl" download="导出" target="_blank" v-if="dataList.length">
                <el-button class="filter-item" type="primary" icon="upload" size="medium">导出</el-button>
            </a>
            <a class="export-btn" :href="exportUrltwo" download="导出" target="_blank">
                <el-button class="filter-item" type="primary" icon="upload" size="medium">导出教师物品汇总</el-button>
            </a>
             <el-input class="search-input" style="width:20%;float: right;"
                          placeholder="申请人" icon="search" size="medium" @change="orderAnalysisByUserfun()"
                          v-model.trim="pagination.searchName">
                    <el-button slot="append" icon="el-icon-search" @click="orderAnalysisByUserfun()"></el-button>
                </el-input>
        </div>
        <el-table stripe :data="dataList" border fit highlight-current-row  :height="maxH-60">                   
                <el-table-column label="教师姓名" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span class="link-type" @click="itemManagementStatisticsteacher(scope.row.createId)">{{scope.row.createUserName}}</span>
                    </template>
                </el-table-column>
                <el-table-column  align="center" label="领用数量" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span>{{scope.row.orderCount}}</span>
                    </template>
                </el-table-column>
                <el-table-column  align="center" label="总金额" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span>{{scope.row.goodPrice}}</span>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination-container">
                <el-pagination @size-change="orderAnalysisByUserfun" @current-change="orderAnalysisByUserfun"
                               :current-page.sync="pagination.pageNo" :page-sizes="[10, 20, 30, 50]"
                               :page-size.sync="pagination.pageSize" layout="total, sizes, prev, pager, next, jumper"
                               :total="pagination.total">
                </el-pagination>
            </div>
            </el-tab-pane>
            <el-tab-pane label="归还统计" name="three"></el-tab-pane>
            <el-tab-pane label="部门统计" name="four"></el-tab-pane>
            <el-tab-pane label="易耗品统计" name="five"></el-tab-pane>
        </el-tabs>       
    </div>
</template>
<script>
    import moment from "moment";
    import {orderAnalysisByUser} from "@/api/itemManagement";
    import baseMixin from '@/mixins/baseMixin';
    import mixin from '@/mixins/windowResize';
    export default {
        name: "statisticsIndex",
        data() {
            return {
                daterange: [new Date(), new Date()],
                dataList: [],
                exportUrl: '',
                exportUrltwo:"",
                pagination:{
                    pageNo:1,
                    pageSize:20,
                    total:null,
                    searchName:'',
                    startDate:'',
                    endDate:''
                },
                activeName:"two"
            }
        },
        mixins: [baseMixin, mixin],
        created() {
            this.daterange= [this.$route.query.startDate,this.$route.query.endDate];
            this.orderAnalysisByUserfun();
        },
        methods: {
            orderAnalysisByUserfun() {
                this.pagination.startDate = moment(this.daterange[0]).format('YYYY-MM-DD');
                this.pagination.endDate = moment(this.daterange[1]).format('YYYY-MM-DD');
                this.exportUrl = `${global.BasePath}structure/good/downOrderAnalysisByUser?endDate=${this.pagination.endDate}&startDate=${this.pagination.startDate}&searchName=${this.pagination.searchName}&token=${this.$store.getters.token}`;
                this.exportUrltwo= `${global.BasePath}structure/good/downTeacherGoodAnalysis?endDate=${this.pagination.endDate}&startDate=${this.pagination.startDate}&searchName=${this.pagination.searchName}&token=${this.$store.getters.token}`;
                orderAnalysisByUser(this.pagination)
                    .then(res => res.data)
                    .then(data => {
                        this.pagination.total = data.data.pagination.total;
                        this.dataList = data.data.dataList;
                    })
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
                
            },
            itemManagementStatisticsteacher(id){
                this.$router.push({
                    path: 'itemManagementStatisticsteacher',
                    query: {
                        startDate:moment(this.daterange[0]).format('YYYY-MM-DD'),
                        endDate:moment(this.daterange[1]).format('YYYY-MM-DD'),
                        id:id
                      }
                   });

            }
        }
    }
</script>

<style lang="scss" scoped>
    .itemManagementStatisticstwo {
        padding: 12px;
        .top {
          padding-bottom: 10px;
       }
       .img{
           width: 20px;
           height: 20px;
       }
    }
</style>
