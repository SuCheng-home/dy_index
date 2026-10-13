<template>
    <div class="itemManagementStatisticsindex">
        <div class="top">
            <el-date-picker v-model="daterange" size="medium" type="daterange" class="mywidthdaterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" :clearable="false"  @change="queryOrderByUserIdfun"></el-date-picker>
        </div>
        <el-table stripe :data="dataList" border fit highlight-current-row  :height="maxH">            			
                <el-table-column align="center" label="申领人" show-overflow-tooltip width="120px">
                    <template slot-scope="scope">
                        <span class="link-type" @click="popfun(scope.row.orderDetailsList,scope.row.content)">{{scope.row.createUserName}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="所在部门" show-overflow-tooltip width="150px">
                    <template slot-scope="scope">
                        <span>{{scope.row.departName}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="申领时间" show-overflow-tooltip width="180px">
                    <template slot-scope="scope">
                        <span>{{scope.row.createDate?scope.row.createDate.slice(0,19):""}}</span>
                    </template>
                </el-table-column>
                <el-table-column  label="申领物品">
                    <template slot-scope="scope">
                        <span :key="index" v-for="(item, index) in scope.row.orderDetailsList">{{item.goodName}} ({{item.orderCount}}{{item.unitName}})；</span>
                    </template>
                </el-table-column>
                <el-table-column  label="申领理由" >
                    <template slot-scope="scope">
                        <span>{{scope.row.content}}</span>
                    </template>
                </el-table-column>
                 <el-table-column property="date" label="状态" align="center" width="120px">
                        <template slot-scope="scope">
                            <el-tag  size="mini"  v-if="scope.row.receiveState==3">已领取</el-tag>
                             <el-tag  size="mini" type="danger" v-if="scope.row.receiveState==1">未领取</el-tag>
                             <el-tag  size="mini" type="success" v-if="scope.row.receiveState==2">部分领取</el-tag>
                       </template>
                    </el-table-column>
                 <el-table-column label="操作" align="center" width="80px">
                    <template slot-scope="scope">
                        <el-button @click="deleteOrders(scope.row.id)" type="text" size="small" class="buttontextred">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination-container">
                <el-pagination @size-change="queryOrderByUserIdfun" @current-change="queryOrderByUserIdfun"
                               :current-page.sync="pagination.pageNo" :page-sizes="[10, 20, 30, 50]"
                               :page-size.sync="pagination.pageSize" layout="total, sizes, prev, pager, next, jumper"
                               :total="pagination.total">
                </el-pagination>
            </div>
            <el-dialog :title="'理由：'+content" :visible.sync="dialogTableVisible">
                <div style="    min-height: 300px;">
                  <el-table :data="orderDetailsList">
                    <el-table-column property="date" label="名称">
                        <template slot-scope="scope">
                        <span>{{scope.row.goodName}}</span>
                       </template>
                    </el-table-column>
                    <el-table-column property="date" label="数量">
                        <template slot-scope="scope">
                        <span>{{scope.row.orderCount}}{{scope.row.unitName}}</span>
                       </template>
                    </el-table-column>
                    <el-table-column property="date" label="状态">
                        <template slot-scope="scope">
                        <span v-if="scope.row.isDelete==1">
                            <span v-if="scope.row.examineState==1||scope.row.examineState==0">
                                <span v-if="scope.row.manageState==1">                                    
                                    <el-tag  size="mini" >已领取</el-tag>
                                </span>
                                <span v-if="scope.row.manageState==0">
                                    <el-tag  size="mini" type="warning" >未领取</el-tag>
                                </span>
                            </span>
                            <span v-else>
                                <span v-if="scope.row.examineState==2">
                                    <el-tag  size="mini" type="danger" >审批不通过</el-tag>
                                </span>
                                <span v-if="scope.row.examineState==3">                                    
                                    <el-tag  size="mini" type="info" >待审批</el-tag>
                                </span>
                            </span>
                        </span>
                        <span v-else>
                            <el-tag  size="mini" type="danger" >已删除</el-tag>
                        </span>
                       </template>
                    </el-table-column>
                </el-table>
                </div>
                
            </el-dialog>
    </div>
</template>
<script>
    import moment from "moment";
    import {queryOrderByUserId,deleteOrder} from "@/api/itemManagement";
    import baseMixin from '@/mixins/baseMixin';
    import mixin from '@/mixins/windowResize';
    export default {
        name: "statisticsIndex",
        data() {
            return {
                daterange: [new Date(), new Date()],
                dataList: [],
                exportUrl: null,
                newexportUrl:null,
                pagination:{
                    pageNo:1,
                    pageSize:20,
                    total:null,
                    searchName:'',
                    startDate:'',
                    endDate:''
                },
                orderDetailsList:[],
                dialogTableVisible:false,
                content:'',
                typelist:[]
            }
        },
        mixins: [baseMixin, mixin],
        created() {
            this.daterange[0] = new Date(moment().subtract(1, "months").valueOf());
            this.queryOrderByUserIdfun();
        },
        methods: {
             //删除
            deleteOrders(id) {
                this.$confirm("确定要删除吗？", "提示", {
                    type: "warning"
                }).then(() => {
                    deleteOrder(id)
                        .then(res => {
                            if (res.data.code === 200) {
                                this.$message({
                                    type: "success",
                                    message: "删除成功!"
                                });
                                this.queryOrderByUserIdfun()
                            }
                        })
                        .catch(err => {
                        });
                })
                    .catch(() => {
                    });

            },
            queryOrderByUserIdfun() {
                this.pagination.startDate = moment(this.daterange[0]).format('YYYY-MM-DD');
                this.pagination.endDate = moment(this.daterange[1]).format('YYYY-MM-DD');
                  queryOrderByUserId(this.pagination)
                    .then(res => res.data)
                    .then(data => {
                        this.pagination.total = data.data.pagination.total;
                        this.dataList = data.data.dataList;
                    })
            },
            itemManagementStatisticsone(){
                this.$router.push({
                    path: 'itemManagementStatisticsone',
                    query: {
                        startDate:moment(this.daterange[0]).format('YYYY-MM-DD'),
                        endDate:moment(this.daterange[1]).format('YYYY-MM-DD')
                    }
                });
            },
            popfun(list,content){
                this.orderDetailsList=list;
                this.dialogTableVisible=true;
                this.content=content;
            }
        }
    }
</script>

<style lang="scss" scoped>
    .itemManagementStatisticsindex {
        padding:12px;
        .top {
          padding-bottom: 10px;
       }
    }
</style>
