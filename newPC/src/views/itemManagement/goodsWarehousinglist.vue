<template>
    <div class="goodsWarehousinglist">
        <div class="top">
            <el-button  type="default" @click="$router.back()" size="medium">返回</el-button>
            <el-select v-model="pagination.goodTypeId" size="medium" @change="queryGoodStorageRecordfun">
                <el-option    label="全部分类" :value="0"></el-option>
               <el-option   v-for="item in typelist" :key="item.id"  :label="item.typeName" :value="item.id"></el-option>
            </el-select>
            <el-date-picker v-model="daterange" size="medium" type="daterange" class="mywidthdaterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" :clearable="false"  @change="queryGoodStorageRecordfun"></el-date-picker>
            <a class="export-btn" :href="exportUrl" download="导出" target="_blank" v-if="dataList.length">
                <el-button class="filter-item" type="primary" icon="upload" size="medium">导出</el-button>
            </a>  
            <el-input class="search-input" style="width:20%;float: right;"
                          placeholder="请输入物品名称" icon="search" size="medium" @change="queryGoodStorageRecordfun()"
                          v-model.trim="pagination.goodName">
                    <el-button slot="append" icon="el-icon-search" @click="queryGoodStorageRecordfun()"></el-button>
                </el-input>
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
                <el-pagination @size-change="queryGoodStorageRecordfun" @current-change="queryGoodStorageRecordfun"
                               :current-page.sync="pagination.pageNo" :page-sizes="[10, 20, 30, 50]"
                               :page-size.sync="pagination.pageSize" layout="total, sizes, prev, pager, next, jumper"
                               :total="pagination.total">
                </el-pagination>
            </div>
           
    </div>
</template>
<script>
    import moment from "moment";
    import {queryGoodStorageRecord,querySGoodType} from "@/api/itemManagement";
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
                    goodTypeId:0,
                    goodName:""
                },
                typelist:[]
            }
        },
        mixins: [baseMixin, mixin],
        created() {
            this.daterange[0] = new Date(moment().subtract(1, "months").valueOf());
            this.queryGoodStorageRecordfun();
            this.querySGoodTypes();
        },
        methods: {
            querySGoodTypes(){
                  querySGoodType()
                    .then(res => res.data)
                    .then(data => {
                        this.typelist=data.data;
                    })
            },
            queryGoodStorageRecordfun() {
                this.pagination.startDate = moment(this.daterange[0]).format('YYYY-MM-DD');
                this.pagination.endDate = moment(this.daterange[1]).format('YYYY-MM-DD');
                this.exportUrl = `${global.BasePath}structure/good/downGoodStorageRecord?endDate=${this.pagination.endDate}&startDate=${this.pagination.startDate}&goodTypeId=${this.pagination.goodTypeId}&goodName=${this.pagination.goodName}&token=${this.$store.getters.token}`;
                queryGoodStorageRecord(this.pagination)
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
