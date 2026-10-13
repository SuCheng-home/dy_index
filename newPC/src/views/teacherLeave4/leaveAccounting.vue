<template>
    <div style="padding:10px">
        <div>
            <el-button v-if="isStandalone && !noBack" type="default" size="medium" @click="$router.back()">返回
            </el-button>
            <el-date-picker size="medium" ref="date"  v-model="duration" type="daterange" class="filter-item mywidthdaterange"
                            :editable="false"
                            format="yyyy-MM-dd"
                            value-format="yyyy-MM-dd"
                            :clearable='false' align="right" unlink-panels placeholder="选择时间范围"
                            @change="getStatisticsListFunc">
            </el-date-picker>
             <el-select v-model="pagination.classOperatType"  size="medium" placeholder="请选择" @change="getStatisticsListFunc()">
                       <el-option label="全部用户类型" :value="0"></el-option>
                       <el-option label="班主任类型" :value="23"></el-option>
             </el-select>
            <a :href="exportUrl" target="_blank" download="统计列表" v-if="dataList.length">
                <el-button type="primary" size="medium">导出</el-button>
            </a>
             <el-button size="medium" class="filter-item" type="primary" @click="leaveBoardindex()">请假看板</el-button>
        </div>
        <div class="main-container">
            <el-table stripe :data="dataList" border style="width: 100%;" :height="maxH">
                <el-table-column label="姓名">
                    <template slot-scope="scope">
                        <span class="link-type"
                              @click="jumpToPage('leaveTable', {startDate: duration[0], endDate: duration[1], userName: scope.row.teacherName})">{{scope.row.teacherName}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="部门" prop="departName">
                </el-table-column>
                <el-table-column label="请假总时长" prop="timeLengthNameTotal">
                </el-table-column>
                <el-table-column label="请假次数(次)" prop="leaveTotalCount">
                </el-table-column>
                <el-table-column v-for="(title, titleIndex) in titleList" :label="title">
                    <template slot-scope="scope">
                        {{scope.row.leaveTypeTimeList[titleIndex] || '----'}}
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination-container">
                <el-pagination @size-change="sizeChangeHandler" @current-change="currentChangeHandler"
                               :current-page.sync="pagination.pageNo" :page-sizes="[10, 20, 30, 50]"
                               :page-size.sync="pagination.pageSize" layout="total, sizes, prev, pager, next, jumper"
                               :total="pagination.total">
                </el-pagination>
            </div>
        </div>

    </div>

</template>

<script>
    import {getStatisticsList} from '@/api/teacherLeave4';
    import mixins from '@/mixins/windowResize';
    import BaseMixin from '@/mixins/baseMixin';
    import {mapGetters} from 'vuex';

    export default {
        name: "leaveAccounting",
        data() {
            return {
                duration: [this.$moment().startOf('month').format('YYYY-MM-DD'), moment().format('YYYY-MM-DD')],
                dataList: [],
                titleList: [],
                pagination:{
                  pageNo:1,
                  pageSize:20,
                  classOperatType:0
                }
            }
        },
        computed: {
            ...mapGetters(['isStandalone']),
            exportUrl() {
                return `${global.BasePath}structure/thAskLeaveFour/exportThAskleaveStatisticalList?startDate=${this.$moment(this.duration[0]).format('YYYY-MM-DD')}&classOperatType=${this.pagination.classOperatType}&endDate=${this.$moment(this.duration[1]).format('YYYY-MM-DD')}&token=${this.$store.getters.token}`;
            },
            noBack() {
                return window.sessionStorage.getItem('noBack') == 1;
            }
        },
        mixins: [BaseMixin, mixins],
        created() {
            if (this.$route.query.code === 'noBack') {
                window.sessionStorage.setItem('noBack', 1);
            }
            if (this.$route.query.code === 'back') {
                window.sessionStorage.setItem('noBack', 2);
            }
            this.getStatisticsListFunc();
        },
        methods: {
              leaveBoardindex(){
                const prefixUrl = global.command === 'production' ? 'https://www.zhxiaoyuan.cn/app/#' : 'http://www.weixiaojia.net/app/#/';
                window.open(`${prefixUrl}leaveBoardindex`, "_blank");
            },
            jumpToPage(path, query = {}) {
                this.$router.push({
                    path,
                    query
                })
            },
            sizeChangeHandler(pageSize) {
                this.pagination.pageNo = 1;
                this.pagination.pageSize = pageSize;
                this.getStatisticsListFunc();

            },
            currentChangeHandler(pageNo) {
                this.pagination.pageNo = pageNo;
                this.getStatisticsListFunc();
            },
            getStatisticsListFunc() {
                getStatisticsList({
                    startDate: this.$moment(this.duration[0]).format('YYYY-MM-DD'),
                    endDate: this.$moment(this.duration[1]).format('YYYY-MM-DD'),
                    pageNo: this.pagination.pageNo,
                    pageSize: this.pagination.pageSize,
                    classOperatType:this.pagination.classOperatType
                })
                    .then(res => res.data)
                    .then(data => {
                        this.dataList = data.data.dataList;
                        this.titleList = data.data.titleList;
                        this.pagination.total = data.data.pagination.total;
                    });

            }
        }
    }
</script>

<style lang="scss" scoped>
    .main-container {
        margin-top: 10px;
    }
</style>
