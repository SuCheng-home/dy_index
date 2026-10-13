<template>
    <div class="page">
        <div class="page-header">
            <el-date-picker v-model="daterange" size="medium" type="daterange" class="mywidthdaterange" range-separator="-"  start-placeholder="开始日期" end-placeholder="结束日期" :clearable="false" @change="handleSizeChange()"></el-date-picker>
            <el-select v-model="query.groupId" style="width: 140px;" @change="handleSizeChange()" size="medium">
                <el-option :label="item.title" :value="item.id"  v-for="(item,index) in gangweiList" :key="index"></el-option>
            </el-select>
            <el-input  size="medium"  style="width:20%;float: right;" placeholder="请输入老师姓名" v-model.trim="query.teacherUserName" @change="handleSizeChange">
            <el-button slot="append" icon="el-icon-search" @click="handleSizeChange"></el-button>    
            </el-input>    
        </div>
        <div class="page-main">
            <el-table stripe :data="dataList" border fit highlight-current-row style="width: 100%" :height="maxH">
                 <el-table-column align="center" label="值班教师" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span>{{scope.row.teacherUserName}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="岗位名称" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span>{{scope.row.stationTitle}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="值班日期" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span>{{scope.row.watchDate}}（{{scope.row.weekNamer}}）</span>
                    </template>
                </el-table-column>               
                <el-table-column align="center" label="值班时段" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span>{{scope.row.startTime}}~{{scope.row.endTime}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center"  label="签到状态" width="100">
                <template slot-scope="scope">
                    
                    <el-tag  size="mini"  type="success" v-if="scope.row.isSign==2&&scope.row.signState==2">已签到</el-tag>
                    <el-tag  size="mini"  type="info" v-if="scope.row.isSign==2&&scope.row.signState==1">未签到</el-tag>
                    <el-tag  size="mini"   v-if="scope.row.isSign==1">无需签到</el-tag>
                </template>
            </el-table-column>
                 <el-table-column align="center" label="签到时间" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span>{{scope.row.signTime?scope.row.signTime.slice(0, 19):'----'}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="课时计算" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span>{{scope.row.classHourCount-0}}</span>
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
    import {getSchoolTimeAllList} from "@/api/schedule";
    import baseMixin from '@/mixins/baseMixin';
    import mixin from '@/mixins/windowResize';
    import {getWatchStationSignRecordList,getWatchGroupList} from '@/api/dutyArrangement';
    export default {
        name: "statisticsIndex",
        data() {
            return {
                daterange: [new Date(), new Date()],
                dataList: [],
                total: null,
                query: {
                    startDate: "",
                    endDate: "",
                    pageNo: 1, //页数
                    pageSize: 20, //条数
                    stationId: 0,
                    groupId: '',
                    teacherUserName:''
                },
                gangweiList:[]
            }
        },
        mixins: [baseMixin, mixin],
        created() {
             getWatchGroupList('')
                    .then(res => res.data)
                    .then(data => {
                        if (data.code === 200) {
                           this.gangweiList = data.data  
                           if(this.gangweiList.length){
                               this.query.groupId=this.gangweiList[0].id
                               getSchoolTimeAllList().then(res => {
                                let data = res.data.data;
                                for (let item of data) {
                                    if (item.isCurrent == 1) {
                                        this.daterange = [item.startDate,item.endDate];
                                        
                                    }
                                }
                                this.getWatchStationSignRecordList();
                            }).catch(err => {
                            });

                           }                        
                        }
                    })
            
        },
        methods: {
            handleSizeChange() {
                this.query.pageNo = 1;
                this.getWatchStationSignRecordList();
            },
            //切换页数
            handleCurrentChange() {
                this.getWatchStationSignRecordList();
            },
            getWatchStationSignRecordList() {
                this.query.startDate = moment(this.daterange[0]).format('YYYY-MM-DD');
                this.query.endDate = moment(this.daterange[1]).format('YYYY-MM-DD');
                getWatchStationSignRecordList(this.query)
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
