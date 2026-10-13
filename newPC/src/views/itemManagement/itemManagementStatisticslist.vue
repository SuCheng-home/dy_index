<template>
    <div class="itemManagementStatisticslist">
        <div class="top">
            <el-button  type="default" @click="$router.back()" size="medium">返回</el-button>
            <el-date-picker v-model="daterange" size="medium" type="daterange" class="mywidthdaterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" :clearable="false"  @change="orderAnalysisByGoodIdGroupByUserIdfun"></el-date-picker>
            <a class="export-btn" :href="exportUrl" download="导出" target="_blank" v-if="dataList.length">
                <el-button class="filter-item" type="primary" icon="upload" size="medium">导出</el-button>
            </a>
        </div>
        <el-table stripe :data="dataList" border fit highlight-current-row  :height="maxH">  
                <el-table-column align="center" label="物品名称" show-overflow-tooltip>  
                    <template slot-scope="scope">
                        <span>{{scope.row.goodName}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="分类" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span >{{scope.row.goodTypeName}}</span>
                    </template>
                </el-table-column>    					           			
                <el-table-column align="center" label="申领人" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span class="link-type" @click="itemManagementStatisticslistlist(scope.row.createId)">{{scope.row.createUserName}}</span>
                    </template>
                </el-table-column>
                 <el-table-column align="center" label="领取总数" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span>{{scope.row.orderCount}}{{scope.row.unitName}}</span>
                    </template>
                </el-table-column>
               	 
            </el-table>
            <div class="pagination-container">
                <el-pagination @size-change="orderAnalysisByGoodIdGroupByUserIdfun" @current-change="orderAnalysisByGoodIdGroupByUserIdfun"
                               :current-page.sync="pagination.pageNo" :page-sizes="[10, 20, 30, 50]"
                               :page-size.sync="pagination.pageSize" layout="total, sizes, prev, pager, next, jumper"
                               :total="pagination.total">
                </el-pagination>
            </div>            
    </div>
</template>
<script>
    import moment from "moment";
    import {orderAnalysisByGoodIdGroupByUserId} from "@/api/itemManagement";
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
                    startDate:'',
                    endDate:'',
                    goodId:this.$route.query.id
                },
            }
        },
        mixins: [baseMixin, mixin],
        created() {
            this.daterange= [this.$route.query.startDate,this.$route.query.endDate];
            this.orderAnalysisByGoodIdGroupByUserIdfun();
        },
        methods: {
            orderAnalysisByGoodIdGroupByUserIdfun() {
                this.pagination.startDate = moment(this.daterange[0]).format('YYYY-MM-DD');
                this.pagination.endDate = moment(this.daterange[1]).format('YYYY-MM-DD');
                this.exportUrl = `${global.BasePath}structure/good/downOrderAnalysisByGoodIdGroupByUserId?endDate=${this.pagination.endDate}&startDate=${this.pagination.startDate}&goodId=${this.pagination.goodId}&token=${this.$store.getters.token}`;
                orderAnalysisByGoodIdGroupByUserId(this.pagination)
                    .then(res => res.data)
                    .then(data => {
                        this.pagination.total = data.data.pagination.total;
                        this.dataList = data.data.dataList;
                    })
            },
            itemManagementStatisticslistlist(userId){
                this.$router.push({
                    path: 'itemManagementStatisticslistlist',
                    query: {
                        startDate:moment(this.daterange[0]).format('YYYY-MM-DD'),
                        endDate:moment(this.daterange[1]).format('YYYY-MM-DD'),
                        userId:userId,
                        id:this.$route.query.id
                      }
                   });
            }
         
        }
    }
</script>

<style lang="scss" scoped>
    .itemManagementStatisticslist {
        padding:12px;
        .top {
          padding-bottom: 10px;
       }
    }
</style>
