<template>
    <div class=" calendar-list-container">
        <!-- <el-tabs type="border-card"  v-model="activeName" @tab-click="tabsfun()">
            <el-tab-pane label="操作日志" name="one"> -->
                 <div class="header">
            <el-row>
                <el-col :span="19">
                    <el-select class="filter-item btnLeftLine"  size="medium" v-model="listQuery.type" placeholder="请选择类型"  @change="typeChange">
                        <el-option v-for="item in typeList" :key="item.type" :label="item.value" :value="item.type"> </el-option>
                    </el-select>
                    <el-date-picker type="daterange" class="mywidthdaterange" v-model="daterange"  size="medium" @change="dateChangeHandler"></el-date-picker>
                    <a target="_blank" :href="exportUrl" download="导出">
                        <el-button type="primary" size="medium">导出</el-button>
                    </a>
                </el-col>
                <el-col :span="5">
                    <el-input placeholder="请输入姓名" icon="el-icon-search" class="search-input"  size="medium"
                              v-model.trim="listQuery.operationName" @keyup.enter.native="operationNameChange">
                        <el-button slot="append" icon="el-icon-search" @click="operationNameChange"></el-button>
                    </el-input>
                </el-col>
            </el-row>
        </div>
        <div>
            <el-table stripe :data="tableData" border v-loading.body="listLoading" :height="maxH">
                <el-table-column label="用户" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span>{{scope.row.operationName }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="部门">
                    <template slot-scope="scope">
                        <span>{{scope.row.departName }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="IP">
                    <template slot-scope="scope">
                        <span>{{scope.row.ip }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="业务名称">
                    <template slot-scope="scope">
                        <span>{{scope.row.businessName }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作类型">
                    <template slot-scope="scope">
                        <span v-if="scope.row.type==1">增加</span>
                        <span v-if="scope.row.type==2">删除</span>
                        <span v-if="scope.row.type==3">修改</span>
                        <span v-if="scope.row.type==4">登录</span>
                        <span v-if="scope.row.type==5">用户关注</span>
                        <span v-if="scope.row.type==6">登陆第三方</span>
                        <span v-if="scope.row.type==9">访问</span>
                        <span v-if="scope.row.type==11">导出</span>
                        <span v-if="scope.row.type==12">打印</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作内容" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span>{{scope.row.description }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作时间">
                    <template slot-scope="scope">
                        <span>{{scope.row.operationDate|filterDate}}</span>
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
            <!-- </el-tab-pane>
            <el-tab-pane label="档案日志" name="two"></el-tab-pane>
        </el-tabs> -->
       
    </div>
</template>
<script>
    import mixin from '@/mixins/windowResize';
    import debounce from 'lodash/debounce';
    import {recordByType} from '@/api/system';

    export default {
        data() {
            return {
                daterange: [new Date(), new Date()],
                activeName:'one',
                listQuery: {
                    begin_date: this.$moment(new Date()).format("YYYY-MM-DD"),
                    end_date: this.$moment(new Date()).format("YYYY-MM-DD"),
                    operationName: '',
                    pageNo: 1,
                    pageSize: 20,
                    type: 4
                },
                total: null,
                typeList: [{
                    type: 4,
                    value: '登录'
                }, {
                    type: 1,
                    value: '增加'
                }, {
                    type: 2,
                    value: '删除'
                }, {
                    type: 3,
                    value: '修改'
                }, {
                    type: 5,
                    value: '用户关注'
                }, {
                    type: 6,
                    value: '登录第三方'
                }, {
                    type: 9,
                    value: '访问'
                }, {
                    type: 11,
                    value: '导出'
                }, {
                    type: 12,
                    value: '打印'
                }],
                tableData: [],
                listLoading: false,
                listLook: true
            }
        },
        mixins: [mixin],
        computed: {
            exportUrl() {
                const prefix = global.command === 'production' ? 'https://www.zhxiaoyuan.cn/ucenter-web/' : 'https://www.weixiaojia.net/ucenter-web/';
                return `${prefix}sys/operation/exportOperationLog?begin_date=${this.listQuery.begin_date}&end_date=${this.listQuery.end_date}&operationName=${this.listQuery.operationName}&type=${this.listQuery.type}&token=${this.$store.getters.token}`
            }
        },
        created() {
            this.listLook = true;
            this.recordByTypeFunc(this.listLook);
        },
        mounted() {

        },
        filters: {
            filterDate(date) {
                return date == '' ? '' : date.slice(0, 19);
            }
        },
        methods: {
            tabsfun(){
               if(this.activeName=='two'){
                   this.$router.push({ path:'/main/sysManage/org/logList'})
               }
            },
            handleSizeChange(val) {
                if (this.listLook) {
                    this.listQuery.pageSize = val;
                    this.recordByTypeFunc(this.listLook);
                } else {
                    this.listQuery.pageSize = val;
                    this.recordByTypeFunc();
                }

            },
            handleCurrentChange(val) {
                if (this.listLook) {
                    this.listQuery.pageNo = val;
                    this.recordByTypeFunc(this.listLook);
                } else {
                    this.listQuery.pageNo = val;
                    this.recordByTypeFunc();
                }
            },
            recordByTypeFunc(listLook) {
                this.listLoading = true;
                recordByType({
                    begin_date: this.listQuery.begin_date,
                    end_date: this.listQuery.end_date,
                    operationName: this.listQuery.operationName,
                    pageNo: this.listQuery.pageNo,
                    pageSize: this.listQuery.pageSize,
                    type: this.listQuery.type
                }).then(res => res.data)
                    .then(data => {
                        if (data.code === 200) {
                            this.tableData = data.data.dataList;
                            this.total = data.data.pagination.total;
                            this.listLoading = false;
                        }
                    }).catch(() => {
                    this.listLoading = false;
                });
            },
            operationNameChange: debounce(
                function () {
                    this.recordByTypeFunc();
                },
                // 这是我们为用户停止输入等待的毫秒数
                500
            ),
            typeChange(val) {
                if (this.listLook) {
                    this.listQuery.type = val;
                    this.listQuery.pageNo = 1;
                    this.recordByTypeFunc(this.listLook);
                } else {
                    this.listQuery.type = val;
                    this.listQuery.pageNo = 1;
                    this.recordByTypeFunc();
                }
            },
            dateChangeHandler() {
                this.listQuery.begin_date = this.$moment(this.daterange[0]).format('YYYY-MM-DD');
                this.listQuery.end_date = this.$moment(this.daterange[1]).format('YYYY-MM-DD');
                this.recordByTypeFunc();
            }

        }
    }
</script>
<style lang="scss" scoped>
    .header {
        margin-bottom: 10px;
    }
    .calendar-list-container{
        padding: 12px;
    }
</style>
