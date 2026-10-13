<template>
    <div class="goodsCollectlist">
        <div class="top">
            <el-button  type="default" @click="$router.back()" size="medium">返回</el-button>
               </div>
        <el-table stripe :data="dataList" border fit highlight-current-row  :height="maxH">            			
                 <el-table-column align="center" label="申领人" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span >{{scope.row.createUserName}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="申领时间" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span>{{scope.row.createDate?scope.row.createDate.slice(0,19):""}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="分类" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span >{{scope.row.goodTypeName}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="物品名称" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span>{{scope.row.goodName}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="物品价格" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span>{{scope.row.goodPrice?scope.row.goodPrice:''}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="领取数量" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span>{{scope.row.orderCount}}{{scope.row.unitName}}</span>
                    </template>
                </el-table-column>	 
                <el-table-column align="center"  label="总金额" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span>{{scope.row.goodPrice?(Math.ceil((scope.row.goodPrice*scope.row.orderCount)*100)/100):''}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="发放人" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span>{{scope.row.manageUserName}}</span>
                    </template>
                </el-table-column>
                <el-table-column  align="center" label="发放时间" show-overflow-tooltip>
                    <template slot-scope="scope">
                         <span>{{scope.row.manageDate?scope.row.manageDate.slice(0,19):""}}</span>
                    </template>
                </el-table-column>
                 <el-table-column  label="申领理由"  show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span>{{scope.row.content}}</span>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination-container">
                <el-pagination @size-change="queryGoodStatisticsDetails" @current-change="queryGoodStatisticsDetails"
                               :current-page.sync="pagination.pageNo" :page-sizes="[10, 20, 30, 50]"
                               :page-size.sync="pagination.pageSize" layout="total, sizes, prev, pager, next, jumper"
                               :total="pagination.total">
                </el-pagination>
            </div>
           
    </div>
</template>
<script>
    import moment from "moment";
    import {queryGoodStatisticsDetails} from "@/api/itemManagement";
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
                    goodId:this.$route.query.id,
                    searchType:2
                },
            }
        },
        mixins: [baseMixin, mixin],
        created() {
            this.queryGoodStatisticsDetails();
        },
        methods: {
            queryGoodStatisticsDetails() {
                 queryGoodStatisticsDetails(this.pagination)
                    .then(res => res.data)
                    .then(data => {
                        this.pagination.total = data.data.pagination.total;
                        this.dataList = data.data.dataList;
                    })
            }
        }
    }
</script>

<style lang="scss" scoped>
    .goodsCollectlist {
        padding:12px;
        .top {
          padding-bottom: 10px;
       }
    }
</style>
