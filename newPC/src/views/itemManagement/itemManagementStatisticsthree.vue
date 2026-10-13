<template>
    <div class="itemManagementStatisticsthree">
        <el-tabs type="border-card"  v-model="activeName" @tab-click="tabsfun()">
            <el-tab-pane label="物品统计" name="six"></el-tab-pane>
            <el-tab-pane label="领用统计" name="one"></el-tab-pane>
            <el-tab-pane label="教师统计" name="two"></el-tab-pane>
            <el-tab-pane label="归还统计" name="three">
                  <div class="top">
                      <!-- <el-button  type="default" @click="$router.back()" size="medium">返回</el-button> -->
            <el-date-picker v-model="daterange" size="medium" type="daterange" class="mywidthdaterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" :clearable="false"  @change="giveBackGoodOrderAnalysisfun"></el-date-picker>
            <a class="export-btn" :href="exportUrl" download="导出" target="_blank" v-if="dataList.length">
                <el-button class="filter-item" type="primary" icon="upload" size="medium">导出</el-button>
            </a>
             <el-input class="search-input" style="width:20%;float: right;"
                          placeholder="物品名称" icon="search" size="medium" @change="giveBackGoodOrderAnalysisfun()"
                          v-model.trim="pagination.searchName">
                    <el-button slot="append" icon="el-icon-search" @click="giveBackGoodOrderAnalysisfun()"></el-button>
                </el-input>
        </div>
        <el-table stripe :data="dataList" border fit highlight-current-row  :height="maxH-60"> 
                <el-table-column label="物品名称" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span>{{scope.row.goodName}}</span>
                    </template>
                </el-table-column>
                <el-table-column  label="分类" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span >{{scope.row.goodTypeName}}</span>
                    </template>
                </el-table-column>
                <el-table-column  align="center" label="借出数量" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span class="link-type" @click="itemManagementStatisticsreturn(scope.row.goodId,0)">{{scope.row.orderCount}}</span>
                    </template>
                </el-table-column>
                <el-table-column  align="center" label="未归还数量" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span class="link-type" @click="itemManagementStatisticsreturn(scope.row.goodId,1)" v-if="scope.row.orderCount!=scope.row.giveBackCount">{{scope.row.orderCount-scope.row.giveBackCount}}</span>
                        <span v-else>0</span>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination-container">
                <el-pagination @size-change="giveBackGoodOrderAnalysisfun" @current-change="giveBackGoodOrderAnalysisfun"
                               :current-page.sync="pagination.pageNo" :page-sizes="[10, 20, 30, 50]"
                               :page-size.sync="pagination.pageSize" layout="total, sizes, prev, pager, next, jumper"
                               :total="pagination.total">
                </el-pagination>
            </div>
            </el-tab-pane>
            <el-tab-pane label="部门统计" name="four"></el-tab-pane>
            <el-tab-pane label="易耗品统计" name="five"></el-tab-pane>
        </el-tabs>       
    </div>
</template>
<script>
    import moment from "moment";
    import {giveBackGoodOrderAnalysis} from "@/api/itemManagement";
    import baseMixin from '@/mixins/baseMixin';
    import mixin from '@/mixins/windowResize';
    export default {
        name: "statisticsIndex",
        data() {
            return {
                daterange: [new Date(), new Date()],
                dataList: [],
                exportUrl: '',
                pagination:{
                    pageNo:1,
                    pageSize:20,
                    total:null,
                    searchName:'',
                    startDate:'',
                    endDate:''
                },
                activeName:"three"
            }
        },
        mixins: [baseMixin, mixin],
        created() {
            this.daterange= [this.$route.query.startDate,this.$route.query.endDate];
            this.giveBackGoodOrderAnalysisfun();
        },
        methods: {
            giveBackGoodOrderAnalysisfun() {
                this.pagination.startDate = moment(this.daterange[0]).format('YYYY-MM-DD');
                this.pagination.endDate = moment(this.daterange[1]).format('YYYY-MM-DD');
                this.exportUrl = `${global.BasePath}structure/good/downGiveBackGoodOrderAnalysis?endDate=${this.pagination.endDate}&startDate=${this.pagination.startDate}&searchName=${this.pagination.searchName}&token=${this.$store.getters.token}`;
                giveBackGoodOrderAnalysis(this.pagination)
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
            itemManagementStatisticsreturn(id,type){
                this.$router.push({
                    path: 'itemManagementStatisticsreturn',
                    query: {
                        startDate:moment(this.daterange[0]).format('YYYY-MM-DD'),
                        endDate:moment(this.daterange[1]).format('YYYY-MM-DD'),
                        id:id,
                        type:type
                      }
                   });
            }
        }
    }
</script>

<style lang="scss" scoped>
    .itemManagementStatisticsthree {
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
