<template>
    <div class="itemManagementStatisticslistlist">
        <div class="top">
            <el-button  type="default" @click="$router.back()" size="medium">返回</el-button>
            <el-date-picker v-model="daterange" size="medium" type="daterange" class="mywidthdaterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" :clearable="false"  @change="orderByGoodIdAndUserIdfun"></el-date-picker>
            <a class="export-btn" :href="exportUrl" download="导出" target="_blank" v-if="dataList.length">
                <el-button class="filter-item" type="primary" icon="upload" size="medium">导出</el-button>
            </a>
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
                        <span>{{scope.row.goodPrice? (Math.ceil((scope.row.goodPrice*scope.row.orderCount)*100)/100):''}}</span>
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
                  <el-table-column  label="申领理由" >
                    <template slot-scope="scope">
                        <span>{{scope.row.content}}</span>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination-container">
                <el-pagination @size-change="orderByGoodIdAndUserIdfun" @current-change="orderByGoodIdAndUserIdfun"
                               :current-page.sync="pagination.pageNo" :page-sizes="[10, 20, 30, 50]"
                               :page-size.sync="pagination.pageSize" layout="total, sizes, prev, pager, next, jumper"
                               :total="pagination.total">
                </el-pagination>
            </div>            
    </div>
</template>
<script>
    import moment from "moment";
    import {orderByGoodIdAndUserId} from "@/api/itemManagement";
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
                    endDate:'',
                    userId:this.$route.query.userId,
                    goodId:this.$route.query.id,
                },
            }
        },
        mixins: [baseMixin, mixin],
        created() {
            this.daterange= [this.$route.query.startDate,this.$route.query.endDate];
            this.orderByGoodIdAndUserIdfun();
        },
        methods: {
            orderByGoodIdAndUserIdfun() {
                this.pagination.startDate = moment(this.daterange[0]).format('YYYY-MM-DD');
                this.pagination.endDate = moment(this.daterange[1]).format('YYYY-MM-DD');
                this.exportUrl = `${global.BasePath}structure/good/downOrderByGoodIdAndUserId?endDate=${this.pagination.endDate}&goodId=${this.pagination.goodId}&startDate=${this.pagination.startDate}&userId=${this.pagination.userId}&searchName=${this.pagination.searchName}&token=${this.$store.getters.token}`;
                orderByGoodIdAndUserId(this.pagination)
                    .then(res => res.data)
                    .then(data => {
                        this.pagination.total = data.data.pagination.total;
                        this.dataList = data.data.dataList;
                    })
            },
         
        }
    }
</script>

<style lang="scss" scoped>
    .itemManagementStatisticslistlist {
        padding:12px;
        .top {
          padding-bottom: 10px;
       }
    }
</style>
