<template>
    <div class="overtime_apply_list">
        <div class="header">
            <el-button type="default" size="medium" @click="$router.back()" v-if="isShowBack">返回</el-button>
            <el-select v-model="schoolName" size="medium" placeholder="请选择学期" @change="changeSchool">
                <el-option v-for="item in schoolYearList" :key="item.schoolTimeCode" :label="item.label"
                           :value="item.schoolTimeName">
                </el-option>
            </el-select>
            <el-select v-model="departSelect" size="medium" placeholder="请选择部门" @change="changeDepart">
                <el-option v-for="item in departList" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
            </el-select>
            <el-select v-model="monthStr" size="medium" placeholder="请选择月份" @change="changeDepart">
                <el-option :key="-1" label="全部月份" :value="``">
                </el-option>
                <el-option v-for="item in monthList" :key="item" :label="`${item.text}`" :value="`${item.value}`">
                </el-option>
            </el-select>
            <a :href="exportUrl" download="导出结果" target="_blank"  v-if="dataList.length">
                <el-button type="primary" size="medium" icon="upload">导出</el-button>
            </a>
            <el-button type="primary" size="medium" @click="toRecord">抵扣明细</el-button>
            <el-input placeholder="教师姓名" v-model="teacherName" size="medium" class="search-input search-input--right"
                      @keyup.enter.native="searchTitleHandler">
                <el-button slot="append" icon="el-icon-search" @click="searchTitleHandler"></el-button>
            </el-input>
        </div>
        <el-table stripe :data="dataList" border style="width: 100%;" :height="maxH">
            <el-table-column prop="teacherName" label="老师姓名" show-overflow-tooltip></el-table-column>
            <el-table-column prop="departName" label="部门"></el-table-column>

            <el-table-column label="请假总时长">
                <template slot-scope="scope">
                    <span>{{scope.row.leaveStrInfo}}</span>
                </template>
            </el-table-column>
            <el-table-column label="请假总次数">
                <template slot-scope="scope">
                    <span>{{scope.row.leaveCount || 0}}次</span>
                </template>
            </el-table-column>
            <el-table-column label="抵扣时长">
                <template slot-scope="scope">
                    <span>{{scope.row.deductionStrInfo || 0}}</span>
                </template>
            </el-table-column>
            <el-table-column label="抵扣条已获得">
                <template slot-scope="scope">
                    <span class="link-type" @click="getTeacherTypeDeductionStaticsListFunc(1, scope.row.teacherId)">{{scope.row.totalCount || 0}}张</span>
                </template>
            </el-table-column>
            <el-table-column label="抵扣条已使用">
                <template slot-scope="scope">
                    <span class="link-type" @click="getTeacherTypeDeductionStaticsListFunc(2, scope.row.teacherId)">{{scope.row.usedCount||0}}张</span>
                </template>
            </el-table-column>
            <el-table-column label="抵扣条已过期">
                <template slot-scope="scope">
                    <span class="link-type" @click="getTeacherTypeDeductionStaticsListFunc(3, scope.row.teacherId)">{{scope.row.overdueCount || 0}}张</span>
                </template>
            </el-table-column>
            <el-table-column label="当前可用">
                <template slot-scope="scope">
                    <span class="link-type" @click="getTeacherTypeDeductionStaticsListFunc(4, scope.row.teacherId)">{{scope.row.nowCanUseCount||0}}张</span>
                </template>
            </el-table-column>
            <el-table-column label="当前可抵扣">
                <template slot-scope="scope">
                    <span>{{scope.row.nowCanUseStrInfo}}</span>
                </template>
            </el-table-column>
        </el-table>
        <div class="pagination-container" style="margin-top: 15px;">
            <el-pagination @size-change="sizeChangeHandler" @current-change="currentChangeHandler"
                           :current-page.sync="pagination.pageNo" :page-sizes="[10, 20, 30, 50]"
                           :page-size.sync="pagination.pageSize"
                           layout="total, sizes, prev, pager, next, jumper"
                           :total="pagination.total">
            </el-pagination>
        </div>
        <el-dialog :title="dataType==1?'抵扣条已获得':dataType==2?'抵扣条已使用':dataType==3?'抵扣条已过期':'当前可用'" :visible.sync="isShowDetail" width="500px">
            <el-form ref="distForm">
                <el-form-item prop="ticketTypeList">
                    <el-table stripe :data="detailData" border style="width: 100%;" :height="300">
                        <el-table-column label="抵扣条">
                            <template slot-scope="scope">
                                <span>{{scope.row.deductionName}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="数量">
                            <template slot-scope="scope">
                                <span>{{scope.row.totalCount}}</span>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
				<el-button @click="isShowDetail = false" size="medium">关 闭</el-button>
			</span>
        </el-dialog>
    </div>
</template>

<script>
    import mixins from '@/mixins/windowResize';
    import {isShowByPermission} from '@/utils';
    import {getSchoolTimeList} from '@/api/record';
    import {
        getDepartListByUserId,
        queryDepartByType,
    } from '@/api/overtimeDeduction';
    import {
        getDeductionStatisticPageList,
        getTeacherTypeDeductionStaticsList
    } from '@/api/leaveCancelTicket';


    export default {
        name: "overtimeDeductionStatistics",
        data() {
            return {
                pagination: {
                    pageNo: 1,
                    pageSize: 20,
                    total: null
                },
                schoolName: '',
                schoolTimeCode: '',
                schoolYearList: [],
                departSelect: 0,
                departList: [
                    {
                        label: '全部部门',
                        value: 0
                    }
                ],
                dataList: [],
                exportUrl: null,
                teacherName: this.$route.query.userName || '',
                isShowDetail: false,
                detailData: [],
                monthStr: '',
                isShowBack: this.$route.query.isShowBack == 1,
                dataType:''
            }
        },
        mixins: [mixins],
        watch: {
            schoolTimeCode() {
                this.getStatistics();
            }
        },
        created() {
            this.getSchoolTimeList();
            if (this.isShowByPermission('/deductionDeduction/isDepartManager')) { // 教务处
                this.queryDepartByType();
            } else {
                this.getDepartListByUserId();
            }
        },
        computed: {
            monthList() {
                let list = [];
                const termObj = this.schoolYearList.find(item => item.schoolTimeName == this.schoolName);
                console.log(termObj)
                if(termObj) {
                    const startYear = parseInt(termObj.startDate.split('-')[0]);
                    const endYear = parseInt(termObj.endDate.split('-')[0]);
                    const startMonth = parseInt(termObj.startDate.split('-')[1]);
                    const endMonth = parseInt(termObj.endDate.split('-')[1]);
                    if(startYear != endYear) {
                        for(let i = startMonth; i <= 12;i++) {
                            const dateStr = i < 10 ? `0${i}` : `${i}`;
                            list.push({
                                value: i,
                                text: `${startYear}年${i}月`,
                                date: `${startYear}-${dateStr}`
                            });
                        }
                        for(let i = 1; i <= endMonth;i++) {
                            const dateStr = i < 10 ? `0${i}` : `${i}`;
                            list.push({
                                value: i,
                                text: `${endYear}年${i}月`,
                                date: `${startYear}-${dateStr}`
                            });
                        }
                    } else {
                        for(let i = startMonth; i <= endMonth;i++) {
                            const dateStr = i < 10 ? `0${i}` : `${i}`;
                            list.push({
                                value: i,
                                text: `${startYear}年${i}月`,
                                date: `${startYear}-${dateStr}`
                            });
                        }
                    }


                }
                return list;
            }
        },
        methods: {
            isShowByPermission,
            jumpToPage(path, query = {}) {
                this.$router.push({
                    path,
                    query
                })
            },
            toRecord() {
                if(this.monthStr) {
                    const date = this.monthList.find(item => item.value == this.monthStr).date;
                    const schoolYearObj = this.schoolYearList.find(item => item.schoolTimeName == this.schoolName);
                    this.jumpToPage('record', {
                        startDate: `${date}-01`,
                        endDate: moment(`${date}-01`).endOf('month').format('YYYY-MM-DD'),
                        schoolTimeCode: schoolYearObj.id,
                        schoolTimeName: schoolYearObj.schoolTimeName
                    });
                } else {
                    const schoolYearObj = this.schoolYearList.find(item => item.schoolTimeName == this.schoolName);
                    this.jumpToPage('record', {
                        startDate: schoolYearObj.startDate,
                        endDate: schoolYearObj.endDate,
                        schoolTimeCode: schoolYearObj.id,
                        schoolTimeName: schoolYearObj.schoolTimeName
                    });
                }

            },
            getSchoolTimeList() {
                getSchoolTimeList().then(res => {
                    this.schoolYearList = res.data.data;
                    const self = this;
                    this.schoolYearList.forEach(function (item) {
                        if (item.isCurrent === 1) {
                            self.schoolName = item.schoolTimeName;
                            self.schoolTimeCode = item.id;
                        }
                    });
                }).catch();
            },
            changeSchool(val) {
                const self = this;
                this.schoolName = val;
                this.schoolYearList.forEach(function (item) {
                    if (item.schoolTimeName === val) {
                        self.schoolTimeCode = item.id;
                    }
                });
            },
            // 教务处
            queryDepartByType() {
                let self = this;
                queryDepartByType().then(res => {
                    if (JSON.parse(JSON.stringify(res.data)).code === 200) {
                        JSON.parse(JSON.stringify(res.data)).data.forEach((item) => {
                            let query = {};
                            query.label = item.name;
                            query.value = item.id.toString();
                            self.departList.push(query);
                        });
                    }
                }).catch();
            },
            // 部门主任
            getDepartListByUserId() {
                let self = this;
                getDepartListByUserId().then(res => {
                    if (JSON.parse(JSON.stringify(res.data)).code === 200) {
                        JSON.parse(JSON.stringify(res.data)).data.forEach((item) => {
                            let query = {};
                            query.label = item.name;
                            query.value = item.id.toString();
                            self.departList.push(query);
                        });
                    }
                }).catch();
            },
            changeDepart() {
                this.getStatistics();
            },
            getStatistics() {
                if (!this.schoolTimeCode) {
                    return;
                }
                let query = {
                    departId: this.departSelect,
                    pageNo: this.pagination.pageNo,
                    pageSize: this.pagination.pageSize,
                    schoolTimeId: this.schoolTimeCode,
                    teacherName: this.teacherName
                };

                this.getList(query);
            },
            getList(query) {
                this.exportUrl = `${global.BasePath}structure/overTimeDeduction/exportDeductionStatisticList?token=${this.$store.getters.token}&departId=${query.departId}&schoolTimeId=${query.schoolTimeId}&teacherName=${this.teacherName}&monthStr=${this.monthStr}`;
                getDeductionStatisticPageList({
                    ...query,
                    monthStr: this.monthStr
                }).then(res => {
                    const data = res.data.data;
                    if (res.data.code === 200) {
                        this.dataList = data.dataList;
                        this.pagination.total = data.pagination.total;
                    } else {
                        this.$message({
                            message: data.msg,
                            type: 'warning'
                        });
                    }
                }).catch();
            },
            sizeChangeHandler() {
                this.pagination.pageNo = 1;
                this.getStatistics();
            },
            currentChangeHandler() {
                this.getStatistics();
            },
            searchTitleHandler() {
                this.pagination.pageNo = 1;
                this.getStatistics();
            },
            getTeacherTypeDeductionStaticsListFunc(dataType, teacherId) {
                this.dataType=dataType
                getTeacherTypeDeductionStaticsList({
                    dataType,
                    schoolTimeId: this.schoolTimeCode,
                    teacherId
                })
                    .then(res => res.data)
                    .then(data => {
                        this.isShowDetail = true;
                        this.detailData = data.data;
                    })
            }
        }
    }
</script>

<style lang="scss" scoped>
    .overtime_apply_list {
        padding: 12px;

        .header {
            overflow: hidden;
            padding-bottom: 10px;

            .statistics_title {
                display: flex;
                margin: 10px 0;

                .btn_group {
                    flex: 1;
                    text-align: center;

                    .btn {
                        height: 40px;
                        line-height: 40px;
                        border: 1px solid #ccc;
                        border-left-width: 0;
                        color: #333;
                        cursor: pointer;
                    }

                    .btn_selected {
                        color: #fff;
                        background: #409EFF;
                        border: 1px solid #409EFF;
                    }
                }

                .btn_group:first-child {
                    .btn {
                        border-radius: 4px 0 0 4px;
                        border-left-width: 1px;
                    }
                }

                .btn_group:last-child {
                    .btn {
                        border-radius: 0 4px 4px 0;
                    }
                }
            }

            .header_line2 {
                width: 98%;
                margin: 10px auto;


            }
        }

        .offset_table_wrap {
            width: 98%;
            margin: 0 auto;
        }
    }
</style>
