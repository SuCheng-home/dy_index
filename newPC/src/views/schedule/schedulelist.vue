<template>
    <div class="page">
        <div class="page-header">
            <el-date-picker v-model="daterange" size="medium" type="daterange" class="mywidthdaterange" range-separator="-"
                            start-placeholder="开始日期" end-placeholder="结束日期" :clearable="false"
                            @change="handleSizeChange()"></el-date-picker>
            <el-select v-model="query.calPlace" style="width: 140px;" @change="handleSizeChange()" size="medium">
                <el-option label="全部日程" :value="0"></el-option>
                <el-option label="单位内" :value="1"></el-option>
                <el-option label="外出" :value="2"></el-option>
            </el-select>
            <a class="export-btn" :href="exportUrl" download="导出" target="_blank" v-if="dataList.length">
                <el-button class="filter-item" type="primary" icon="upload" size="medium">导出</el-button>
            </a>
        </div>
        <div class="page-main">
            <el-table stripe :data="dataList" border fit highlight-current-row style="width: 100%" :height="maxH">
                <el-table-column align="center" label="主题" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span>{{scope.row.calName}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="姓名" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span>{{scope.row.createUserName}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="时间" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span>{{scope.row.timeScope}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="地点" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span>{{scope.row.calPlaceName}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="事由" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span>{{scope.row.calContent}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="其他参与人" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span>{{scope.row.joinUser}}</span>
                    </template>
                </el-table-column>
                 <el-table-column align="center" label="已确认参与人" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span :key="index" v-for="(item,index) in scope.row.joinUserList" >{{item.userName}}&nbsp;</span>
                    </template>
                </el-table-column>
                <el-table-column v-if="isApproval" align="center" label="审批人" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span>{{scope.row.approveUserName || '--'}}</span>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination-container">
                <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                               :current-page.sync="query.pageNo" :page-sizes="[10, 20, 30, 50]"
                               :page-size.sync="query.pageSize" layout="total, sizes, prev, pager, next, jumper"
                               :total="total">
                </el-pagination>
            </div>
        </div>
    </div>
</template>

<script>
    import moment from "moment";
    import {calendarCount, getSchoolTimeAllList, getCalendarSet} from "@/api/schedule";
    import baseMixin from '@/mixins/baseMixin';
    import mixin from '@/mixins/windowResize';

    export default {
        name: "statisticsIndex",
        data() {
            return {
                daterange: ['', ''],
                dataList: [],
                total: null,
                query: {
                    startTime: "",
                    endTime: "",
                    pageNo: 1, //页数
                    pageSize: 20, //条数
                    calPlace: 0
                },
                exportUrl: '',
                isApproval: false
            }
        },
        mixins: [baseMixin, mixin],
        created() {
            getSchoolTimeAllList().then(res => {
                let data = res.data.data;
                for (let item of data) {
                    if (item.isCurrent == 1) {
                        if(item.startDate>(this.$moment(new Date()).format('YYYY-MM-DD')+"")){
                             this.daterange = [new Date(),item.startDate];
                            }else{
                              this.daterange = [item.startDate,new Date()];
                            }
                        this.calendarCounts();
                    }
                }
            }).catch(err => {
            });
            getCalendarSet()
                .then(res => res.data)
                .then(data => {
                    this.isApproval = data.data.calendarSet.needApprove == 1;
                })
        },
        methods: {
            //切换条数
            handleSizeChange() {
                this.query.pageNo = 1;
                this.calendarCounts();
            },
            //切换页数
            handleCurrentChange() {
                this.calendarCounts();
            },
            calendarCounts() {
                this.query.startTime = moment(this.daterange[0]).format('YYYY-MM-DD');
                this.query.endTime = moment(this.daterange[1]).format('YYYY-MM-DD');
                this.exportUrl = `${global.BasePath}structure/calendar/exportCalendarData?endTime=${this.query.endTime}&startTime=${this.query.startTime}&calPlace=${this.query.calPlace}&token=${this.$store.getters.token}`;
                calendarCount(this.query)
                    .then(res => res.data)
                    .then(data => {
                        this.total = data.data.pagination.total;
                        this.dataList = data.data.dataList;
                    })
            }
        }
    }
</script>

<style scoped>
    .page {
        padding:12px;
    }

    .page-header {
        padding-bottom: 10px;
    }
</style>
