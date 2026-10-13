<!--通知阅读率统计-->
<template>
    <div id="noticeReadRate" class="app-container calendar-list-container">
        <div class="header-container">
            <el-row>
                <el-col :span="19">
                    <el-button size="medium" type="default" @click="$router.back()" v-if="isStandalone">返回</el-button>
                    <el-date-picker ref="date" size="medium" v-model="date" type="daterange" class="filter-item mywidthdaterange"
                                    :editable='false'
                                    :clearable='false' :picker-options="shortcutOptions" placeholder="选择时间范围"
                                    align="left"
                                    @change="dateChange"></el-date-picker>
                    <!-- <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button> -->
                    <a :href="exportUrl" download="阅读率统计" target="_blank" v-if="list.length">
                        <el-button class="filter-item" type="primary" icon="upload" size="medium">导出</el-button>
                    </a>
                    <span v-if="!$store.getters.schoolInfo.accessDate||isMoreThanOneYearAgo($store.getters.schoolInfo.accessDate)" class="important-hint">超过一年的数据已归档</span>

                </el-col>
                <el-col :span="5">
                    <el-input size="medium"
                              placeholder="姓名" icon="el-icon-search" @keyup.enter.native="handleFilter"
                              v-model="listQuery.searchTitle">
                        <el-button slot="append" icon="el-icon-search" @click="handleFilter"></el-button>
                    </el-input>
                </el-col>
            </el-row>


        </div>
        <el-table stripe :key='tableKey' :data="list" v-loading.body="listLoading" border fit highlight-current-row
                  style="width: 100%" :height="`${nobottommaxH}px`">
            <el-table-column align="center" label="序号" width="65">
                <template slot-scope="scope">
                    <span>{{scope.$index+1}}</span>
                </template>
            </el-table-column>
            <el-table-column label="姓名" show-overflow-tooltip>
                <template slot-scope="scope">
                    <span>{{scope.row.name}}</span>
                </template>
            </el-table-column>
            <el-table-column label="所在部门" show-overflow-tooltip>
                <template slot-scope="scope">
                    <span>{{scope.row.departName}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="阅读率(%)">
                <template slot-scope="scope">
                    <span>{{scope.row.readRate }}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="收到通知数">
                <template slot-scope="scope">
                    <span>{{scope.row.allReceiveNum}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="已经阅读数">
                <template slot-scope="scope">
                    <span :class="{ 'link-type':scope.row.haveReadNum>0}" @click="loadnoticeUserReadList(scope.row,1)">{{scope.row.haveReadNum}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="未阅读数">
                <template slot-scope="scope">
                    <span v-bind:class="{ 'link-type':scope.row.noReadNum>0}"
                          @click="loadnoticeUserReadList(scope.row,0)">{{scope.row.noReadNum}}</span>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>
<script>
    import moment from 'moment';
    import {getNoticeReadRateList} from '@/api/notice';
    import {pickerOptions} from '@/utils';
    import mixin from '@/mixins/windowResize';
    import {mapGetters} from 'vuex';

    export default {
        data() {
            return {
                list: null,
                listLoading: false,
                date: [],
                cutH: 170,
                listQuery: {
                    startDate: '',
                    endDate: '',
                    searchTitle: ''
                },
                tableKey: 3,
                shortcutOptions: {
                    shortcuts: pickerOptions
                },
                exportUrl: '',
            }
        },
        computed: {
            ...mapGetters(['isStandalone'])
        },
        created() {

            this.getList()
                .then(() => {
                    this.getExportUrl(moment(this.listQuery.startDate).format('YYYY-MM-DD'), moment(this.listQuery.endDate).format('YYYY-MM-DD'));

                });
        },
        mixins: [mixin],
        methods: {
              isMoreThanOneYearAgo(dateString) {
                 if(dateString){
                        const date = moment(dateString);
                        const now = moment();
                        return date.isBefore(now.subtract(1, 'years'));
                 }                
            },
            getList() {
                this.listLoading = true;
                return getNoticeReadRateList(this.listQuery).then(res => {
                    let data = res.data.data;
                    this.list = data.dataList;
                    if((moment(data.startDate).format('YYYY-MM-DD')+"")>(moment(data.endDate).format('YYYY-MM-DD')+"")){
                       this.date = [moment(data.endDate).format('YYYY-MM-DD'),moment(data.startDate).format('YYYY-MM-DD')];
                        this.listQuery.startDate = data.endDate;
                        this.listQuery.endDate = data.startDate;
                    }else{
                       this.date = [moment(data.startDate).format('YYYY-MM-DD'), moment(data.endDate).format('YYYY-MM-DD')];
                        this.listQuery.startDate = data.startDate;
                        this.listQuery.endDate = data.endDate;
                    }
                    
                   
                    this.listLoading = false;
                }).catch(() => {
                    this.listLoading = false;
                });
            },
            handleFilter() {
                if (this.date) {
                    this.listQuery.startDate = this.$moment(this.date[0]).format('YYYY-MM-DD');
                    this.listQuery.endDate = this.$moment(this.date[1]).format('YYYY-MM-DD');
                } else {
                    this.listQuery.startDate = '';
                    this.listQuery.endDate = '';
                }
                this.getList();
            },
            loadnoticeUserReadList(row, type) {
                if (type === 1) {
                    this.$router.push({
                        path: 'noticeUserRead',
                        query: {
                            userId: row.userId,
                            isRead: 1,
                            startDate: this.listQuery.startDate,
                            endDate: this.listQuery.endDate
                        }
                    });
                } else {
                    this.$router.push({
                        path: 'noticeUserRead',
                        query: {
                            userId: row.userId,
                            isRead: 0,
                            startDate: this.listQuery.startDate,
                            endDate: this.listQuery.endDate
                        }
                    });
                }
            },
            dateChange(val) {
                this.date = [moment(val[0]).format('YYYY-MM-DD'), moment(val[1]).format('YYYY-MM-DD')];
                this.getExportUrl(moment(val[0]).format('YYYY-MM-DD'), moment(val[1]).format('YYYY-MM-DD'));
                this.handleFilter();
            },
            getExportUrl(beginTime, endTime) {
                this.exportUrl = `${global.BasePath}structure/notice/exportNoticeReadrate?token=${this.$store.getters.token}&beginTime=${beginTime}&endTime=${endTime}`;
            }
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
