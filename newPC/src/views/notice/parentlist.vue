<!--通知阅读率统计-->
<template>
    <div id="noticeReadRate" class="app-container calendar-list-container">
        <div class="header-container">
            <el-row>
                <el-col :span="19">
                    <el-date-picker ref="date" size="medium" v-model="date" type="daterange" class="filter-item mywidthdaterange"
                                    :editable='false'
                                    :clearable='false' :picker-options="shortcutOptions" placeholder="选择时间范围"
                                    align="left"
                                    @change="getList"></el-date-picker>
                       <a :href="exportUrl" download="家长阅读率统计" target="_blank" v-if="list.length">
                        <el-button class="filter-item" type="primary" icon="upload" size="medium">导出</el-button>
                    </a>
                </el-col>
                <el-col :span="5">
                    <el-input size="medium"
                              placeholder="请输入创建人/标题" icon="el-icon-search" @keyup.enter.native="getList"
                              v-model="listQuery.searchTitle">
                        <el-button slot="append" icon="el-icon-search" @click="getList"></el-button>
                    </el-input>
                </el-col>
            </el-row>


        </div>
        <el-table stripe :key='tableKey' :data="list" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%" :height="`${maxH}px`">
            <el-table-column align="center" label="序号" width="65">
                <template slot-scope="scope">
                    <span>{{scope.$index+1}}</span>
                </template>
            </el-table-column>
            <el-table-column label="通知标题" show-overflow-tooltip>
                <template slot-scope="scope">
                    <span>{{scope.row.noticeTitle}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="发布时间">
                <template slot-scope="scope">
                    <span>{{scope.row.releaseDate.split('.')[0]}}</span>
                </template>
            </el-table-column>
            <el-table-column  align="center"  label="发布人" show-overflow-tooltip>
                <template slot-scope="scope">
                    <span>{{scope.row.createUser}}</span>
                </template>
            </el-table-column>
            
            <el-table-column align="center" label="落款部门">
                <template slot-scope="scope">
                    <span>{{scope.row.departName}}</span>
                </template>
            </el-table-column>
             <el-table-column align="center" label="爸爸阅读人数">
                <template slot-scope="scope">
                    <span>{{scope.row.baBaReadCount}}</span>
                </template>
            </el-table-column>
             <el-table-column align="center" label="妈妈阅读人数">
                <template slot-scope="scope">
                    <span>{{scope.row.maMaReadCount}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="总阅读人数">
                <template slot-scope="scope">
                    <span>{{scope.row.readCount}}</span>
                </template>
            </el-table-column>
        </el-table>
         <el-pagination
            class="pagination-container"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page.sync="listQuery.pageNo"
            :page-sizes="[10, 20, 30, 50]"
            :page-size="listQuery.pageSize"
            layout="total,sizes, prev, pager, next"
            :total="total">
        </el-pagination>
    </div>
</template>
<script>
    import moment from 'moment';
    import {getNoticeAndReadHistoryPage} from '@/api/notice';
    import {pickerOptions} from '@/utils';
    import mixin from '@/mixins/windowResize';
    import {mapGetters} from 'vuex';

    export default {
        data() {
            return {
                list: [],
                listLoading: false,
                date: [new Date(),new Date()],
                cutH: 170,
                listQuery: {
                    startDate: '',
                    endDate: '',
                    searchTitle: '',
                    pageNo: 1,
                    pageSize: 20,
                },
                tableKey: 3,
                shortcutOptions: {
                    shortcuts: pickerOptions
                },
                exportUrl: '',
                total:null
            }
        },
        computed: {
            ...mapGetters(['isStandalone'])
        },
        created() {
            this.date[0] = new Date(
                    moment()
                        .set('date', 1)
                        .valueOf()
                )
                this.getList();
           
        },
        mixins: [mixin],
        methods: {
             handleSizeChange(val) {
                this.listQuery.pageSize = val;
                this.getList();
            },
            handleCurrentChange(val) {
                this.listQuery.pageNo = val;
                this.getList();
            },
            getList() {
                this.listQuery.startDate = this.$moment(this.date[0]).format('YYYY-MM-DD');
                this.listQuery.endDate = this.$moment(this.date[1]).format('YYYY-MM-DD');
                this.exportUrl = `${global.BasePath}structure/notice/exportNoticeAndReadHistory?token=${this.$store.getters.token}&startDate=${this.listQuery.startDate}&endDate=${this.listQuery.endDate}&searchTitle=${this.listQuery.searchTitle}`;
                this.listLoading = true;
                return getNoticeAndReadHistoryPage(this.listQuery).then(res => {
                    let data = res.data.data;
                    this.total = data.pagination.total;
                    this.list = data.dataList;                   
                    this.listLoading = false;
                    
                
                }).catch(() => {
                    this.listLoading = false;
                });
            },
        }
    }
</script>
<style lang="scss" scoped>
    .header-container {
        padding-bottom: 10px;
    }

    .pagination-container {
        margin-top: 10px;
    }
</style>
