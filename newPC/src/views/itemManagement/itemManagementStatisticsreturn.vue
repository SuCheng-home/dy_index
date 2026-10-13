<template>
    <div class="itemManagementStatisticsreturn">
        <div class="top">
            <el-button  type="default" @click="$router.back()" size="medium">返回</el-button>
            <el-date-picker v-model="daterange" size="medium" type="daterange" class="mywidthdaterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" :clearable="false"  @change="queryGiveBackGoodOrderfun"></el-date-picker>
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
                 <el-table-column align="center" label="借出数量" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span>{{scope.row.orderCount}}{{scope.row.unitName}}</span>
                    </template>
                </el-table-column>                
                <el-table-column align="center" label="申领时间" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span>{{scope.row.createDate?scope.row.createDate.slice(0,19):""}}</span>
                    </template>
                </el-table-column>  	
                <el-table-column label="申请理由" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span >{{scope.row.content}}</span>
                    </template>
                </el-table-column>   
                <el-table-column align="center" label="领用人" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span>{{scope.row.createUserName}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="归还数量" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span>{{scope.row.giveBackCount}}{{scope.row.unitName}}</span>
                    </template>
                </el-table-column>
                <el-table-column  align="center" label="归还时间" show-overflow-tooltip>
                    <template slot-scope="scope">
                         <span>{{scope.row.giveBackDate?scope.row.giveBackDate.slice(0,19):""}}</span>
                    </template>
                </el-table-column>
                 <el-table-column align="center" label="操作"  show-overflow-tooltip >
                <template slot-scope="scope">
                    <el-button type="text" size="small" @click="itemManagementStatisticsreturninfo(scope.row.id)">查看明细</el-button>
                </template>
            </el-table-column>
            </el-table>
            <div class="pagination-container">
                <el-pagination @size-change="queryGiveBackGoodOrderfun" @current-change="queryGiveBackGoodOrderfun"
                               :current-page.sync="pagination.pageNo" :page-sizes="[10, 20, 30, 50]"
                               :page-size.sync="pagination.pageSize" layout="total, sizes, prev, pager, next, jumper"
                               :total="pagination.total">
                </el-pagination>
            </div>            
    </div>
</template>
<script>
    import moment from "moment";
    import {queryGiveBackGoodOrder} from "@/api/itemManagement";
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
                    goodId:this.$route.query.id,
                    type:this.$route.query.type,
                },
            }
        },
        mixins: [baseMixin, mixin],
        created() {
            this.daterange= [this.$route.query.startDate,this.$route.query.endDate];
            this.queryGiveBackGoodOrderfun();
        },
        methods: {
            queryGiveBackGoodOrderfun() {
                this.pagination.startDate = moment(this.daterange[0]).format('YYYY-MM-DD');
                this.pagination.endDate = moment(this.daterange[1]).format('YYYY-MM-DD');
                this.exportUrl = `${global.BasePath}structure/good/downGiveBackGoodOrder?endDate=${this.pagination.endDate}&type=${this.pagination.type}&startDate=${this.pagination.startDate}&goodId=${this.pagination.goodId}&searchName=${this.pagination.searchName}&token=${this.$store.getters.token}`;
                queryGiveBackGoodOrder(this.pagination)
                    .then(res => res.data)
                    .then(data => {
                        this.pagination.total = data.data.pagination.total;
                        this.dataList = data.data.dataList;
                    })
            },
            itemManagementStatisticsreturninfo(id){
                 this.$router.push({
                    path: 'itemManagementStatisticsreturninfo',
                    query: {
                        id:id
                      }
                   });
            }
         
        }
    }
</script>

<style lang="scss" scoped>
    .itemManagementStatisticsreturn {
        padding:12px;
        .top {
          padding-bottom: 10px;
       }
    }
</style>
