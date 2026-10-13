<template>
    <div class="goodsWarehousinglist">
        <div class="top">
            <el-button  type="default" @click="$router.back()" size="medium">返回</el-button>
        </div>
        <el-table stripe :data="dataList" border fit highlight-current-row  :height="maxH">            			
                 
                <el-table-column align="center" label="分类" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span >{{scope.row.goodTypeName}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="名称" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span>{{scope.row.goodName}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="品牌" width="50px" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span >{{scope.row.goodBrand}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="型号"  width="70px" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span >{{scope.row.goodSpec}}</span>
                    </template>
                </el-table-column>    
                 <el-table-column align="center" label="价格"  width="50px" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span >{{scope.row.goodPrice?scope.row.goodPrice:''}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="入库数量" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span>{{scope.row.goodCount}}</span>
                    </template>
                </el-table-column>	 
                <el-table-column align="center"  label="总价" show-overflow-tooltip>
                    <template slot-scope="scope">                        
                        <span>{{scope.row.goodPrice?(Math.ceil((scope.row.goodPrice*scope.row.goodCount)*100)/100):''}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="入库人员" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span>{{scope.row.createUserName}}</span>
                    </template>
                </el-table-column>
                <el-table-column  align="center" label="入库时间" show-overflow-tooltip>
                    <template slot-scope="scope">
                         <span>{{scope.row.createDate?scope.row.createDate.slice(0,19):""}}</span>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination-container">
                <el-pagination @size-change="queryGoodStorageRecordByGoodId" @current-change="queryGoodStorageRecordByGoodId"
                               :current-page.sync="pagination.pageNo" :page-sizes="[10, 20, 30, 50]"
                               :page-size.sync="pagination.pageSize" layout="total, sizes, prev, pager, next, jumper"
                               :total="pagination.total">
                </el-pagination>
            </div>
           
    </div>
</template>
<script>
    import moment from "moment";
    import {queryGoodStorageRecordByGoodId} from "@/api/itemManagement";
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
                },
                typelist:[]
            }
        },
        mixins: [baseMixin, mixin],
        created() {
            this.queryGoodStorageRecordByGoodId();
        },
        methods: {
            queryGoodStorageRecordByGoodId() {
                queryGoodStorageRecordByGoodId(this.pagination)
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
    .goodsWarehousinglist {
        padding:12px;
        .top {
          padding-bottom: 10px;
       }
    }
</style>
