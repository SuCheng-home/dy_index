<template>
    <div class="itemManagementStatisticssix">
        <el-tabs type="border-card"  v-model="activeName" @tab-click="tabsfun()">
            <el-tab-pane label="物品统计" name="six">
                    <div class="top">
             <el-select v-model="pagination.goodTypeId" size="medium" @change="queryGoodStatistics">
                <el-option    label="全部分类" :value="0"></el-option>
               <el-option   v-for="item in typelist" :key="item.id"  :label="item.typeName" :value="item.id"></el-option>
            </el-select>
             <el-input class="search-input" style="width:20%;float: right;"
                          placeholder="物品名称" icon="search" size="medium" @change="queryGoodStatistics()"
                          v-model.trim="pagination.goodName">
                    <el-button slot="append" icon="el-icon-search" @click="queryGoodStatistics()"></el-button>
                </el-input>
        </div>
        <el-table stripe :data="dataList" border fit highlight-current-row  :height="maxH-60">   
                <el-table-column align="center" label="物品logo" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <img class="img" :src="scope.row.goodUrl" alt="">
                    </template>
                </el-table-column>
                <el-table-column label="物品名称" show-overflow-tooltip>
                    <template slot-scope="scope">
                        {{scope.row.goodName}}
                       
                    </template>
                </el-table-column>
                <el-table-column align="center" label="分类" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span >{{scope.row.goodTypeName}}</span>
                    </template>
                </el-table-column>
                <el-table-column  align="center" label="入库总数" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span class="link-type" v-if="scope.row.goodInTotalCount" @click="itemManagementStatisticssixone(scope.row.id)">{{scope.row.goodInTotalCount}}</span>
                    </template>
                </el-table-column>
                <el-table-column  align="center" label="领用/借出总数" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span class="link-type" v-if="scope.row.orderCount" @click="itemManagementStatisticssixtwo(scope.row.id)">{{scope.row.orderCount}}</span>
                    </template>
                </el-table-column>
                <el-table-column  align="center" label="已归还" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span class="link-type" v-if="scope.row.giveBackCount" @click="itemManagementStatisticssixthree(scope.row.id)">{{scope.row.giveBackCount}}</span>
                    </template>
                </el-table-column>
                <el-table-column  align="center" label="未领取" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span class="link-type" v-if="scope.row.notBatchCount"  @click="itemManagementStatisticssixfour(scope.row.id)">{{scope.row.notBatchCount}}</span>
                    </template>
                </el-table-column>
                <el-table-column  align="center" label="当前库存" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span>{{scope.row.repertory}}</span>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination-container">
                <el-pagination @size-change="queryGoodStatistics" @current-change="queryGoodStatistics"
                               :current-page.sync="pagination.pageNo" :page-sizes="[10, 20, 30, 50]"
                               :page-size.sync="pagination.pageSize" layout="total, sizes, prev, pager, next, jumper"
                               :total="pagination.total">
                </el-pagination>
            </div>
            </el-tab-pane>
            <el-tab-pane label="领用统计" name="one"> </el-tab-pane>
            <el-tab-pane label="教师统计" name="two"></el-tab-pane>
            <el-tab-pane label="归还统计" name="three"></el-tab-pane>
            <el-tab-pane label="部门统计" name="four"></el-tab-pane>
            <el-tab-pane label="易耗品统计" name="five"></el-tab-pane>
        </el-tabs>       
    </div>
</template>
<script>
    import moment from "moment";
    import {queryGoodStatistics,querySGoodType} from "@/api/itemManagement";
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
                    goodName:'',
                    goodTypeId:0
                },
                activeName:"six",
                typelist:[]
            }
        },
        mixins: [baseMixin, mixin],
        created() {
            if(this.$route.query.startDate){
               this.daterange= [this.$route.query.startDate,this.$route.query.endDate];
            }
             querySGoodType()
                    .then(res => res.data)
                    .then(data => {
                        this.typelist=data.data;
                    })
            this.queryGoodStatistics();
        },
        methods: {
            queryGoodStatistics() {
               queryGoodStatistics(this.pagination)
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
            itemManagementStatisticssixone(id){
                this.$router.push({
                    path: 'itemManagementStatisticssixone',
                    query: {
                        id:id
                      }
                   });
            },
            itemManagementStatisticssixtwo(id){
                this.$router.push({
                    path: 'itemManagementStatisticssixtwo',
                    query: {
                        id:id
                      }
                   });
            },
            itemManagementStatisticssixthree(id){
                this.$router.push({
                    path: 'itemManagementStatisticssixthree',
                    query: {
                        id:id
                      }
                   });
            },
            itemManagementStatisticssixfour(id){
                this.$router.push({
                    path: 'itemManagementStatisticssixfour',
                    query: {
                        id:id
                      }
                   });
            },
        }
    }
</script>

<style lang="scss" scoped>
    .itemManagementStatisticssix {
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
