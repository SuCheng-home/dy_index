<template>
    <div class="overtime_apply_list">
        <div class="header">
            <div class="header_line2">
                <el-button @click="$router.back()" type="default" size="medium">返回</el-button>
                <el-select v-model="schoolName" size="medium" placeholder="请选择学期" @change="changeSchool">
                    <el-option v-for="item in schoolYearList" :key="item.schoolTimeCode" :label="item.label"
                               :value="item.schoolTimeName">
                    </el-option>
                </el-select>
                <el-select v-model="departSelect" size="medium" placeholder="请选择部门" @change="changeDepart">
                    <el-option v-for="item in departList" :key="item.value" :label="item.label"
                               :value="item.value">
                    </el-option>
                </el-select>
                <el-date-picker v-model="dateRange" size="medium" type="daterange" class="mywidthdaterange" :clearable="false"
                                placeholder="选择日期范围" :picker-options="overtimeDateOptions"
                                @change="getStatistics"></el-date-picker>
                <a :href="exportUrl" download="导出结果" target="_blank" v-if="dataList.length">
                    <el-button type="primary" size="medium" icon="upload">导出</el-button>
                </a>
            </div>
        </div>
        <div class="offset_table_wrap">
            <el-table stripe :data="dataList" border style="width: 100%;" :height="maxH">
                <el-table-column prop="createUserName" label="老师姓名"></el-table-column>
                <el-table-column prop="departName" label="部门"></el-table-column>

                <el-table-column label="请假类型">
                    <template slot-scope="scope">
                        <span>{{scope.row.leaveTypeName}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="请假时长">
                    <template slot-scope="scope">
                        <span>{{scope.row.totalDeductionDaysAndSectionNo  || ''}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="抵扣张数">
                    <template slot-scope="scope">
                        <span>{{scope.row.deductionSheetNum || 0}}张</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作时间" width="200px">
                    <template slot-scope="scope">
                        <span>{{(scope.row.updateTime || scope.row.createTime) | formatTimeMap}}</span>
                    </template>
                </el-table-column>
                <!--                <el-table-column align="center" label="操作">-->
                <!--                    <template slot-scope="scope">-->
                <!--                        <el-button size="small" type="text" @click="rejectApply(scope.row.id)">不同意</el-button>-->
                <!--                    </template>-->
                <!--                </el-table-column>-->
            </el-table>
            <div class="pagination-container" style="margin-top: 15px;">
                <el-pagination @size-change="sizeChangeHandler" @current-change="currentChangeHandler"
                               :current-page.sync="pagination.pageNo" :page-sizes="[10, 20, 30, 50]"
                               :page-size.sync="pagination.pageSize"
                               layout="total, sizes, prev, pager, next, jumper"
                               :total="pagination.total">
                </el-pagination>
            </div>
        </div>
        <el-dialog title="驳回" :visible.sync="isShowRejectDialog" size="tiny" :close-on-press-escape='false'
                   :close-on-click-modal='false' :modal-append-to-body='false'>
            <div>
                <el-input type="textarea" :rows="3" placeholder="请输入驳回原因" v-model.trim="rejectReason"
                          :maxlength="50"></el-input>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button type="default" @click="cancelClickHandler">取消</el-button>
                <el-button type="primary" @click="confirmClickHandler">确定</el-button>
            </div>
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
        findOverTimeDeductionDeductionListByPagePC,
        rejectOverTimeDeductionDeduction
    } from '@/api/overtimeDeduction';

    export default {
        name: "overtimeDeductionRecord",
        data() {
            return {
                isShowRejectDialog: false,
                rejectReason: '',
                rejectId: 0,
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
                dateRange: [],
                dataList: [],
                overtimeDateOptions: {
                    disabledDate(time) {
                        return (time.getTime() > new Date('2020-08-31')) || (time.getTime() < new Date('2019-09-01'));
                    }
                }
            }
        },
        filters: {
            formatTimeMap(type) {
                if (type) {
                    return type.substring(0, 19);
                }
                return '-';
            },
            monthNum(num) {
                if (num) {
                    return parseInt(num.substr(5, 2));
                }
                return '-';
            }
        },
        computed: {
            exportUrl() {
                return `${global.BasePath}structure/overTimeDeductionDeduction/exportOverTimeDeductionDeductionList?departId=${this.departSelect}&token=${this.$store.getters.token}&schoolTimeId=${this.schoolTimeCode}`
            }
        },
        watch: {
            schoolTimeCode() {
                this.getStatistics();
            }
        },
        mixins: [mixins],
        created() {
            if(this.$route.query.startDate) {
                this.dateRange = [this.$route.query.startDate, this.$route.query.endDate];
                this.schoolName = this.$route.query.schoolTimeName;
                this.schoolTimeCode = this.$route.query.schoolTimeCode;
            }

            this.getSchoolTimeList();
            if (this.isShowByPermission('/deductionDeduction/isDepartManager')) { // 教务处
                this.queryDepartByType();
            } else {
                this.getDepartListByUserId();
            }
        },
        methods: {
            isShowByPermission,
            rejectApply(id) {
                this.rejectId = id;
                this.rejectReason = '';
                this.isShowRejectDialog = true;
            },
            cancelClickHandler() {
                this.isShowRejectDialog = false;
            },
            confirmClickHandler() {
                if (!this.rejectReason) {
                    this.$message({
                        message: '请输入驳回原因',
                        type: 'warning'
                    });
                    return;
                }
                let query = {
                    id: this.rejectId,
                    rejectReason: this.rejectReason,
                };
                this.rejectOverTimeDeductionDeduction(query);
            },
            getSchoolTimeList() {
                getSchoolTimeList().then(res => {
                    this.schoolYearList = res.data.data;
                    const self = this;
                    this.schoolYearList.forEach(function (item) {
                        if (item.isCurrent === 1) {
                            if(!self.dateRange[0]) {
                                self.schoolName = item.schoolTimeName;
                                self.schoolTimeCode = item.id;
                                self.dateRange = [item.startDate, self.getDate(0)]; // 列表日期
                            }
                            self.overtimeDateOptions = {
                                disabledDate(time) {
                                    return (time.getTime() > new Date(item.endDate)) || (time.getTime() < new Date(item.startDate));
                                }
                            }
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
                        self.dateRange = [item.startDate, item.endDate]; // 列表日期
                        self.overtimeDateOptions = {
                            disabledDate(time) {
                                return (time.getTime() > new Date(item.endDate)) || (time.getTime() < new Date(item.startDate));
                            }
                        }
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
                if (!this.dateRange.length) {
                    return;
                }
                let query = {
                    departId: this.departSelect,
                    pageNo: this.pagination.pageNo,
                    pageSize: this.pagination.pageSize,
                    schoolTimeId: this.schoolTimeCode,
                    startDate: this.getStrDate(this.dateRange[0]),
                    endDate: this.getStrDate(this.dateRange[1])
                };

                this.findOverTimeDeductionDeductionListByPagePC(query);
            },
            findOverTimeDeductionDeductionListByPagePC(query) {
                findOverTimeDeductionDeductionListByPagePC(query).then(res => {
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
            rejectOverTimeDeductionDeduction(query) {
                rejectOverTimeDeductionDeduction(query).then(res => {
                    const data = res.data.data;
                    if (res.data.code === 200) {
                        this.$message({
                            type: 'success',
                            message: '驳回成功！'
                        });
                        this.pagination.pageNo = 1;
                        this.getStatistics();
                        this.isShowRejectDialog = false;
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
            getDate(n) {
                const data = new Date();
                data.setTime(data.getTime() + 3600 * 1000 * 24 * n);
                let localDateStr = data.getFullYear() + "-" + this.fillZero(data.getMonth() + 1) + "-" + this.fillZero(data.getDate());
                return localDateStr;
            },
            getStrDate(oldDate) {
                let data = new Date(oldDate);
                let strDate = data.getFullYear() + "-" + this.fillZero(data.getMonth() + 1) + "-" + this.fillZero(data.getDate());
                return strDate;
            },
            fillZero(n) {
                return n < 10 ? '0' + n : n;
            },
        }
    }
</script>

<style lang="scss" scoped>
    .overtime_apply_list {
        padding: 12px;

        .header {
            overflow: hidden;
            margin-bottom: 10px;

            .statistics_title {
                display: flex;
                margin-bottom: 10px;

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
        }
    }
</style>
