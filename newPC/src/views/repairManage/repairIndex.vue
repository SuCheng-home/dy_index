<template>
    <div class="app-container calendar-list-container">
        <div>
            <el-row style="padding-bottom:10px">
                <el-col :span="19">
                    <el-date-picker  v-model="datetime" type="daterange" class="filter-item mywidthdaterange" :editable='false'
                                    size="medium"
                                    :clearable='false'  placeholder="选择时间范围"
                                    align="left" @change="handleInputChange"></el-date-picker>
                    <a :href="exportURL" download="导出结果" v-if="list.length">
                        <el-button size="medium" class="filter-item" type="primary" icon="upload">导出</el-button>
                    </a>
                </el-col>
                <el-col :span="5">
                    <el-input size="medium" placeholder="报修人姓名" icon="el-icon-search" v-model="listQuery.searchTitle"
                            @keyup.enter.native="handleInputChange">
                              <el-button size="medium" slot="append" icon="el-icon-search" @click="handleInputChange"></el-button>
                    </el-input>
                </el-col>
            </el-row>

        </div>

        <el-table stripe :key='tableKey' :data="list" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%" :height="maxH">
            <el-table-column align="left" label="报修内容" show-overflow-tooltip min-width="100">
                <template slot-scope="scope">
                    <span>{{scope.row.repairContent}}</span>
                </template>
            </el-table-column>
            <el-table-column align="left" label="报修地点" min-width="100" max-width="300" show-overflow-tooltip>
                <template slot-scope="scope">
                    <span>{{scope.row.repairPlace}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="报修人" min-width="100" max-width="160">
                <template slot-scope="scope">
                    <span class="repairDetail">{{scope.row.createUserName}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="报修类型" min-width="120" max-width="200" show-overflow-tooltip
                             prop="repairTypeName" :filtered-value="filterRepairTypeTag" :filter-multiple='false'
                             :filters="filterRepairType">
                <template slot-scope="scope">
                    <span>{{scope.row.repairTypeName}}</span>
                </template>
            </el-table-column>

            <el-table-column align="center" label="状态" width="120" prop="status" :filtered-value="filterTag"
                             :filter-multiple='false' :filters="filterState">
                <template slot-scope="scope">
                    <el-tag  size="mini" v-if="scope.row.status==0" type="danger">待处理</el-tag>
                    <el-tag  size="mini" v-if="scope.row.status==1" type="warning">已处理</el-tag>
                    <el-tag  size="mini" v-if="scope.row.status==2" type="success">已完成</el-tag>
                </template>
            </el-table-column>
            <el-table-column align="center" v-if="hasDicFlag" label="处理情况" width="180" show-overflow-tooltip>
              <template slot-scope="{row}">
                    {{row.dealDicName || '-'}}
              </template>
            </el-table-column>
            <el-table-column align="center" label="报修时间" width="180">
                <template slot-scope="scope">
                    <span>{{scope.row.createTime|formatTimeFilter}}</span>
                </template>
            </el-table-column>


            <el-table-column align="center" label="操作" width="160">
                <template slot-scope="scope">
                    <el-button size="small" type="text" @click="loadRepairDetail(scope.row.id)"
                               v-if="scope.row.status!==0">查看
                    </el-button>
                    <el-button size="small" type="text" @click="loadRepairDetail(scope.row.id)" v-else>处理</el-button>

                    <el-button size="small" type="text" @click="deleteRow(scope.$index, scope.row)" class="buttontextred">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div v-show="!listLoading" class="pagination-container">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                           :current-page.sync="listQuery.pageNo" :page-sizes="[10,20,30, 50]"
                           :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper"
                           :total="total">
            </el-pagination>
        </div>
    </div>
</template>

<script>
    import _ from 'lodash';
    import {getRepairList, delRepairList,getUserRepairList,getManagerRepairList, getRepairTypeAllList} from '@/api/repairManage';
    import {pickerOptions} from '@/utils';
    import mixin from '@/mixins/windowResize';
    import {getSchoolTimeAllList} from "@/api/schedule";
    import { getSchoolDicByCode } from '@/utils/utils';

    export default {
        data() {
            return {
                list: null,
                total: null,
                listLoading: false,
                datetime:[],
                listQuery: {
                    startDate: '',
                    endDate: '',
                    searchTitle: '',
                    pageNo: 1,
                    pageSize: 20,
                    repairTypeId: '',
                    status: 3,
                    userId:this.$store.getters.userInfo.id
                },
                tableKey: 10,
                shortcutOptions: {
                    shortcuts: pickerOptions
                },
                exportURL: '',
                filterState: [ //状态数据
                    {text: '待处理', value: '0'},
                    {text: '已处理', value: '1'},
                    {text: '已完成', value: '2'},
                ],
                filterTag: [],//筛选绑定值
                filterRepairType: [],//类型数据
                filterRepairTypeTag: [],//筛选绑定值
                hasDicFlag: false
            };
        },
        created() {
            this.initDic()
            getSchoolTimeAllList().then(res => {
                    let data =res.data.data;
                    for (let item of data) {
                        if (item.isCurrent == 1) {
                            if(item.startDate>(this.$moment(new Date()).format('YYYY-MM-DD')+"")){
                             this.datetime = [new Date(),item.startDate];
                            }else{
                              this.datetime = [item.startDate,new Date()];
                            }
                              
                            this.FilterGetAllRepairList();                          
                        };
                    }   
                       
                }).catch(err => {});
            getRepairTypeAllList(0).then(res => {
                let data = res.data.data;
                data.forEach((item) => {
                    let repairType = {};
                    repairType.text = item.repairTypeName;
                    repairType.value = item.id;
                    this.filterRepairType.push(repairType);
                })
            });
        },
        watch: {
            //状态过滤
            filterTag: function (val) {
                if (val[0] == "" || val[0] == undefined) {
                    this.listQuery.status = 3;
                } else {
                    this.listQuery.status = val[0];
                }
                this.FilterGetAllRepairList();
            },
            filterRepairTypeTag: function (val) {
                if (val[0] == "" || val[0] == undefined) {
                    this.listQuery.repairTypeId = '';
                } else {
                    this.listQuery.repairTypeId = val[0];
                }
                this.FilterGetAllRepairList();

            },
        },
        filters: {
            formatTimeFilter(date) {
                return date.split(".")[0];
            }
        },
        mixins: [mixin],

        methods: { //获取列表内容
            getList() {
                this.listLoading = true;
                getRepairList(this.listQuery).then(res => {
                    let data = res.data.data;
                    this.list = data.dataList;
                    this.total = data.pagination.total;
                    this.listLoading = false;
                });
                this.exportURL =
                    `${global.BasePath}structure/repair/exportRepair?startDate=${this.listQuery.startDate}&endDate=${this.listQuery.endDate}&userId=${this.listQuery.userId}&token=${this.$store.getters.token}`;
            },
            initDic(){
              getSchoolDicByCode('repairDeal').then(res=>{
                  this.hasDicFlag = res.length
              })
            },
            FilterGetAllRepairList() {//列表过滤
                this.listLoading = true;
                 this.listQuery.startDate = this.$moment(this.datetime[0]).format('YYYY-MM-DD');
                 this.listQuery.endDate = this.$moment(this.datetime[1]).format('YYYY-MM-DD');
                getManagerRepairList(this.listQuery).then(res =>{
                    let data = res.data.data;
                    this.list = data.dataList;
                    this.total = data.pagination.total;
                    this.listLoading = false;
                });
                // getUserRepairList(this.listQuery).then(res =>{
                //     let data = res.data.data;
                //     this.list = data.dataList;
                //     this.total = data.pagination.total;
                //     this.listLoading = false;
                // });
                // getAllRepairList(this.listQuery).then(res => {
                //     let data = res.data.data;
                //     this.list = data.dataList;
                //     this.total = data.pagination.total;
                //     this.listLoading = false;
                // });
                this.exportURL =
                    `${global.BasePath}structure/repair/exportRepair?startDate=${this.listQuery.startDate}&userId=${this.listQuery.userId}&endDate=${this.listQuery.endDate}&token=${this.$store.getters.token}`;
            },
            //日期过滤
            handleInputChange: _.debounce(
                function () {
                    let start = this.$moment(this.datetime[0]).format('YYYY-MM-DD');
                    let end = this.$moment(this.datetime[1]).format('YYYY-MM-DD');

                    if (this.datetime[0] != null && this.datetime[0] != null) {
                        this.listQuery.startDate = start;
                        this.listQuery.endDate = end;
                    } else {
                        this.listQuery.startDate = '';
                        this.listQuery.endDate = '';
                    }
                    this.FilterGetAllRepairList();
                },
                // 这是我们为用户停止输入等待的毫秒数
                500
            ),


            //当前页显示条目
            handleSizeChange(val) {
                this.listQuery.pageSize = val;
                this.FilterGetAllRepairList();
            },
            //当前页
            handleCurrentChange(val) {
                this.listQuery.pageNo = val;
                this.FilterGetAllRepairList();
            },
            //删除报修内容
            deleteRow(index, rows) {
                this.$confirm('是否确认要删除该报修记录？', '删除', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    delRepairList(rows.id).then(res => {

                        if (res.data.code === 200) {
                            this.$message.success(res.data.msg);
                            this.FilterGetAllRepairList();
                        } else {
                            this.$message.error(res.data.msg);
                        }
                    });
                });

            },

            formatJson(filterVal, jsonData) {
                return jsonData.map(v => filterVal.map(j => v[j]));
            },
            loadRepairDetail(id) { //加载处理页面
                this.$router.push({
                    path: 'updateDealRepair',
                    query: {
                        id
                    }
                });
            },
        }
    }
</script>

<style scoped="scoped">

    .searchButton {
        width: 200px;
        vertical-align: middle;
        margin-bottom: 10px;
        float: right;
    }

    .searchButton:after {
        content: "";
        display: block;
        clear: both;
    }

</style>
