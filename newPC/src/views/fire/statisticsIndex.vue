<template>
    <div class="page">
        <div class="page-header">
            <el-date-picker
                v-model="daterange" size="medium"
                type="daterange" class="mywidthdaterange"
                range-separator="-"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :clearable="false"  @change="userFireAnalysisFunc"
            >
            </el-date-picker>
            <el-select v-model="fireType" style="width: 100px;"  size="medium" @change="userFireAnalysisFunc">
                <el-option label="老师" :value="1"></el-option>
                <el-option label="学生" :value="2"></el-option>
            </el-select>
            <!-- <el-button @click="userFireAnalysisFunc" type="primary" size="medium">统计</el-button> -->
            <a class="export-btn" :href="exportUrl" download="导出" target="_blank" v-if="dataList.length">
                <el-button class="filter-item" type="primary" icon="upload" size="medium">导出</el-button>
            </a>
             <a class="export-btn" :href="exportUrltwo" download="导出" target="_blank" v-if="dataList.length">
                <el-button class="filter-item" type="primary" icon="upload" size="medium">导出全部</el-button>
            </a>
             <el-input class="search-input" style="width:20%;float: right;"  placeholder="请输入姓名" icon="search" size="medium" @change="userFireAnalysisFunc()"
                          v-model.trim="searchName">
                          <el-button slot="append" icon="el-icon-search" @click="userFireAnalysisFunc()"></el-button>
            </el-input>
        </div>
        <div class="page-main">
            <el-table stripe :data="dataList" border fit highlight-current-row style="width: 100%" v-if="fireType==1"
                      :height="maxH">
                <el-table-column align="center" label="姓名" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span>{{scope.row.userName}}</span>
                    </template>
                </el-table-column>               
                <el-table-column align="center" label="部门/班级" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span>{{scope.row.className}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" key="col2" v-if="(fireType === 1 && isShowBreakfast)" label="早餐停伙次数">
                    <template slot-scope="scope">
                        <span>{{scope.row.breakfastCount}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" key="col3" label="午餐停伙次数" v-if="(fireType === 1 && teacherLunch)">
                    <template slot-scope="scope">
                        <span>{{scope.row.lunchCount}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" key="col4" v-if="(fireType === 1 && isShowSupper)" label="晚餐停伙次数">
                    <template slot-scope="scope">
                        <span>{{scope.row.supperCount}}</span>
                    </template>
                </el-table-column>
            </el-table>
            <el-table stripe :data="dataList" border fit highlight-current-row style="width: 100%" v-if="fireType==2"
                      :height="maxH">
                       <el-table-column align="center" label="学号" show-overflow-tooltip >
                    <template slot-scope="scope">
                        <span>{{scope.row.stuNo}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="姓名" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span>{{scope.row.userName}}</span>
                    </template>
                </el-table-column>               
                <el-table-column align="center" label="部门/班级" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span>{{scope.row.className}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" key="col1" v-if="breakMeal" label="课间餐停伙次数">
                    <template slot-scope="scope">
                        <span>{{scope.row.breakCount}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" key="col2" v-if="(fireType === 2 && stuBreakfast)" label="早餐停伙次数">
                    <template slot-scope="scope">
                        <span>{{scope.row.breakfastCount}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" key="col3" label="午餐停伙次数" v-if="(fireType === 2 && lunch)">
                    <template slot-scope="scope">
                        <span>{{scope.row.lunchCount}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" key="col4" v-if="(fireType === 2 && stuSupper)" label="晚餐停伙次数">
                    <template slot-scope="scope">
                        <span>{{scope.row.supperCount}}</span>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination-container">
                <el-pagination @size-change="userFireAnalysisFunc" @current-change="userFireAnalysisFunc"
                               :current-page.sync="pagination.pageNo" :page-sizes="[10, 20, 30, 50]"
                               :page-size.sync="pagination.pageSize" layout="total, sizes, prev, pager, next, jumper"
                               :total="pagination.total">
                </el-pagination>
            </div>
        </div>
    </div>
</template>

<script>
    import moment from "moment";
    import {userFireAnalysis, getFireSet} from "@/api/fire";
    import baseMixin from '@/mixins/baseMixin';
    import mixin from '@/mixins/windowResize';

    export default {
        name: "statisticsIndex",
        data() {
            return {
                daterange: [new Date(), new Date()],
                fireType: 1,
                searchName: '',
                dataList: [],
                exportUrl: '',
                exportUrltwo:'',
                isShowBreakfast: false,
                isShowSupper: false,
                breakMeal:false,
                stuSupper:false,
                stuBreakfast:false,
                lunch:false,
                teacherLunch:false
            }
        },
        mixins: [baseMixin, mixin],
        created() {
            this.daterange[0] = new Date(moment().set('date', 1).valueOf());
            this.userFireAnalysisFunc();
            getFireSet().then(res => {
                let data = res.data.data;
                this.isShowBreakfast = data.breakfast == 1;
                this.isShowSupper = data.supper == 1;
                this.breakMeal=data.breakMeal==1;
                this.stuSupper=data.stuSupper==1;
                this.stuBreakfast=data.stuBreakfast==1;
                this.lunch=data.lunch==1;
                this.teacherLunch=data.teacherLunch==1;
            }).catch();
        },
        methods: {
            userFireAnalysisFunc() {
                const startDate = moment(this.daterange[0]).format('YYYY-MM-DD');
                const endDate = moment(this.daterange[1]).format('YYYY-MM-DD');
                this.exportUrl = `${global.BasePath}structure/fire/downUserFireAnalysisByFireTypeAndDateRangeGroupByUserId?endDate=${endDate}&fireType=${this.fireType}&startDate=${startDate}&searchName=${this.searchName}&token=${this.$store.getters.token}`;
                this.exportUrltwo = `${global.BasePath}structure/fire/downUserFireAnalysisByFireTypeAndDateRangeGroupByUserId?endDate=${endDate}&fireType=${this.fireType}&startDate=${startDate}&downType=1&searchName=${this.searchName}&token=${this.$store.getters.token}`;
                userFireAnalysis({
                    startDate,
                    endDate,
                    fireType: this.fireType,
                    pageNo: this.pagination.pageNo,
                    pageSize: this.pagination.pageSize,
                    searchName: this.searchName
                })
                    .then(res => res.data)
                    .then(data => {
                        this.pagination.total = data.data.pagination.total;
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
