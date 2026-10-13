<template>
    <div class="page" id="printList">
        <div v-show="kind == 'file'">
            <div>
                <div class="page-header">
                    <el-date-picker v-model="daterange" size="medium" type="daterange" class="mywidthdaterange" range-separator="-"
                            start-placeholder="开始日期" end-placeholder="结束日期" :clearable="false"
                            @change="findPrintListFunc()"></el-date-picker>
                        <el-select
                                size="medium"
                                placeholder="请选择"
                                value-key="id" style="width:150px"
                                v-model="pagination.useType"
                                @change="findPrintListFunc()"
                            >
                        <el-option label="全部分类" :value="0"></el-option>
                        <el-option :label="item.name"  v-for="(item,index) in applyTypeList" :key="index" :value="item.id"></el-option>
                    </el-select> 
                            <el-select
                                size="medium"
                                placeholder="请选择"  style="width:150px"
                                value-key="id"
                                v-model="pagination.status"
                                @change="findPrintListFunc()"
                            >
                        <el-option label="全部状态" :value="0"></el-option>
                        <el-option label="未打印" :value="4"></el-option>
                        <el-option label="已打印" :value="56"></el-option>
                    </el-select>  
                    <el-select
                        size="medium"
                        placeholder="请选择"
                        value-key="id"  style="width:150px"
                        v-model="outsource"
                        @change="findPrintListFunc()"
                    >
                        <el-option label="全部处理方式" :value="0"></el-option>
                        <el-option label="自印" :value="1"></el-option>
                        <el-option label="委外" :value="2"></el-option>
                    </el-select>
                     <a class="export-btn" :href="exportUrl" download="导出" target="_blank" v-if="dataList.length">
                <el-button class="filter-item" type="primary" icon="upload" size="medium">导出</el-button>
            </a>
                    <el-input placeholder="资料名称/申请人" size="medium" v-model="searchName" class="search-input search-input--right"
                              @keyup.enter.native="searchNameHandler">
                        <el-button slot="append" icon="el-icon-search" @click="searchNameHandler"></el-button>
                    </el-input>
                </div>
                <el-table stripe :data="dataList" border fit highlight-current-row
                          style="width: 100%" :height="nobottommaxH - 5">
                    <el-table-column label="资料名称" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <span class="link-type" @click="jumpToPage('printApplyDetail', {id: scope.row.id, kind, isPrint: 1})">{{scope.row.name}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" prop="useTypeName" label="用途类型">
                    </el-table-column>
                    <el-table-column align="center" label="申请人" prop="applyUserName">
                    </el-table-column>
                     <!-- <el-table-column align="center" prop="officeName" label="办公室">
                    </el-table-column> -->
                    <el-table-column align="center" label="申请印制份数" show-overflow-tooltip>
                        <template slot-scope="scope">
                            {{scope.row.copies}}
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="纸张数">
                        <template slot-scope="scope">
                            {{scope.row.paperSizeName}}(单页：{{scope.row.paperSingle}}&nbsp;&nbsp;&nbsp;&nbsp;双页：{{scope.row.paperDouble}})
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="使用时间">
                        <template slot-scope="scope">
                            {{scope.row.useDate}}&nbsp;&nbsp;{{['', '上午', '下午'][scope.row.morningOrAfternoon]}}
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="处理方式">
                        <template slot-scope="scope">
                            {{['', '自印', '委外'][scope.row.outsource]}}
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="状态">
                        <template slot-scope="scope">
                            <el-tag  size="mini">{{getStatusText(scope.row)}}</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="费用(元)" prop="cost">
                    </el-table-column>
                </el-table>
                <div>
                    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                                   :current-page.sync="pagination.pageNo" :page-sizes="[10,20,30, 50]"
                                   :page-size="pagination.pageSize" layout="total, sizes, prev, pager, next, jumper"
                                   :total="pagination.total">
                    </el-pagination>
                </div>
            </div>
        </div>
        <div v-show="kind == 'material'">
            <div>                
                <div class="page-header">
                     <el-date-picker v-model="daterange" size="medium" type="daterange" class="mywidthdaterange" range-separator="-"
                            start-placeholder="开始日期" end-placeholder="结束日期" :clearable="false"
                            @change="findPrintListFunc()"></el-date-picker>
                    <el-input placeholder="申请名称/申请人" size="medium" v-model="searchName" class="search-input search-input--right"
                              @keyup.enter.native="searchNameHandler">
                        <el-button slot="append" icon="el-icon-search" @click="searchNameHandler"></el-button>
                    </el-input>
                </div>
                <el-table stripe :data="dataList" border fit highlight-current-row
                          style="width: 100%" :height="nobottommaxH - 5">
                    <el-table-column label="申请名称" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <span class="link-type" @click="jumpToPage('printApplyDetail', {id: scope.row.id, kind, isPrint: 1})">{{scope.row.name}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" prop="useTypeName" label="用途类型">
                    </el-table-column>
                    <el-table-column align="center" label="申请人" prop="applyUserName">
                    </el-table-column>
                     <el-table-column align="center" prop="officeName" label="办公室">
                    </el-table-column>
                    <el-table-column align="center" label="使用时间" >
                        <template slot-scope="scope">
                            {{scope.row.useDate}}&nbsp;&nbsp;{{['', '上午', '下午'][scope.row.morningOrAfternoon]}}
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="状态">
                        <template slot-scope="scope">
                            <el-tag  size="mini">{{scope.row.status | statusFilterMaterial}}</el-tag>
                        </template>
                    </el-table-column>
                </el-table>
                <div>
                    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                                   :current-page.sync="pagination.pageNo" :page-sizes="[10,20,30, 50]"
                                   :page-size="pagination.pageSize" layout="total, sizes, prev, pager, next, jumper"
                                   :total="pagination.total">
                    </el-pagination>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import {isShowByPermission} from '@/utils';
    import {getSchoolTimeAllList} from "@/api/schedule";
    import {
        getBySchoolIdInit,
        findPrintList,getTypeTree
    } from '@/api/printApplication';
    import mixin from '@/mixins/windowResize';
    import baseMixin from '@/mixins/baseMixin';

    export default {
        name: "printApply",
        mixins: [baseMixin, mixin],
        data() {
            return {
                kind: this.$route.query.kind || 'file',
                searchName: '',
                outsource: 0,
                dataList: [],
                daterange: [new Date(), new Date((new Date()).getTime()+7 * 24 * 60 * 60 * 1000)],
                exportUrl: '',
                pagination:{
                   pageNo:1, 
                   pageSize:10,
                   useType:0,
                   status:0
                },
                applyTypeList:[]
            }
        },
        watch: {
            $route(newRoute) {
                this.pagination.pageNo = 1;
                this.pagination.pageSize = 10;
                this.kind = newRoute.query.kind || 'file';
                this.findPrintListFunc();
            }
        },
        filters: {
            statusFilterMaterial(status) {
                return {
                    '-1': '已撤回',
                    1: '草稿',
                    2: '待审核',
                    3: '被驳回',
                    4: '未发放',
                    5: '已发放',
                    6: '已领取'
                }[status];
            }
        },
        created() {
             this.getTypeTreeData();
            getSchoolTimeAllList().then(res => {
                let data = res.data.data;
                for (let item of data) {
                    if (item.isCurrent == 1) {
                        if(item.startDate>(this.$moment(new Date()).format('YYYY-MM-DD')+"")){
                             this.daterange = [new Date(),item.startDate];
                            }else{
                              this.daterange = [item.startDate, new Date((new Date()).getTime()+7 * 24 * 60 * 60 * 1000)];
                            }
                      
                    }
                }
                 this.findPrintListFunc();
            }).catch(err => {
            });
            
        },
        methods: {
            getTypeTreeData() {
                return Promise.all([
                    getTypeTree({
                        kind: 1
                    })
                        .then(res => res.data.data),
                    getTypeTree({
                        kind: 2
                    })
                        .then(res => res.data.data)
                ])
                    .then(([type1Data, type2Data]) => {
                        if(this.kind === 'file' && (!type1Data || type1Data.length == 0 || type1Data[0].children.length == 0)) {
                            // this.$message.error('请设置印制申请用途类型')
                        } else if(this.kind !== 'file' && (!type2Data || type2Data.length == 0 || type2Data[0].children.length == 0)) {
                            // this.$message.error('请设置耗材申请用途类型')
                        } else {
                            this.applyTypeList = this.kind === 'file' ? type1Data[0].children : type2Data[0].children;
                        }
                    })
            },
            isShowByPermission,
            getStatusText(item) {
                let text = '';
                if(item.status != 4) {
                    text = {
                        '-1': '已撤回',
                        1: '草稿',
                        2: '待审批',
                        3: '被驳回',
                        4: '未打印',
                        5: '已打印',
                        6: '已领取'
                    }[item.status];
                } else {
                    text = {
                        1: '已撤回',
                        2: '未打印',
                        3: '未打印',
                        null: '未打印'
                    }[item.state]
                }
                return text;

            },
            searchNameHandler() {
                this.pagination.pageNo = 1;
                this.findPrintListFunc();
            },
            handleSizeChange(val){
                this.pagination.pageNo =1;
                this.pagination.pageSize = val;
                this.findPrintListFunc();
            },
            handleCurrentChange(val){
                this.pagination.pageNo = val;
                this.findPrintListFunc();
            },
            tabsfunc() {
                this.outsource = 0;
                this.pagination.pageNo = 1;
                this.searchName = '';
                if (this.kind === 'file') {
                    this.$router.replace({
                        path: "printList",
                        query: {
                            kind: 'file'
                        }
                    });
                } else if (this.kind === 'material') {
                    this.$router.replace({
                        path: "printList",
                        query: {
                            kind: 'material'
                        }
                    });
                }
            },
            findPrintListFunc() {
                let startDate = moment(this.daterange[0]).format('YYYY-MM-DD');
                let endDate = moment(this.daterange[1]).format('YYYY-MM-DD');
                this.exportUrl = `${global.BasePath}structure/printSeniorApply/exportPrintList?endDate=${endDate}&useType=${this.pagination.useType}&status=${this.pagination.status}&startDate=${startDate}&kind=${this.kind === 'file' ? 1 : 2}&searchName=${this.searchName}&outsource=${this.outsource}&token=${this.$store.getters.token}`;
                
                findPrintList({
                    kind: this.kind === 'file' ? 1 : 2,
                    pageNo: this.pagination.pageNo,
                    pageSize: this.pagination.pageSize,
                    searchName: this.searchName,
                    outsource: this.outsource,
                    endDate:endDate,
                    startDate:startDate,
                    useType:this.pagination.useType,
                    status:this.pagination.status,
                })
                    .then(res => res.data)
                    .then(data => {
                        this.dataList = data.data.dataList;
                        this.pagination.total = data.data.pagination.total;
                    })
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import "../../../styles/mixin";
    .page {
        padding: 12px;
    }
    .page-header {
        padding-bottom: 10px;
        @include clearfix;
    }
</style>
