<template>
    <div class="supply_class_wrap">
        <!-- <el-tabs type="border-card" v-model="activeName" @tab-click="tabsfun()">
            <el-tab-pane label="抵扣统计" name="one"></el-tab-pane>
            <el-tab-pane label="抵扣记录" name="two"> -->
                <div class="header">
                    <div class="header_line2">
                        <!-- <el-button @click="goBack" size="medium">返回</el-button> -->
                        <template>
                            <el-select size="medium" v-model="schoolName" placeholder="请选择学期" @change="changeSchool">
                                <el-option v-for="item in schoolYearList" :key="item.schoolTimeCode" :label="item.label"
                                           :value="item.schoolTimeName">
                                </el-option>
                            </el-select>
                        </template>
                        <el-select size="medium" v-model="departSelect" placeholder="请选择部门" @change="changeDepart">
                            <el-option v-for="item in departList" :key="item.value" :label="item.label"
                                       :value="item.value">
                            </el-option>
                        </el-select>
                        <el-date-picker size="medium" v-model="supplyDate" type="daterange" class="mywidthdaterange" :clearable="false"
                                        range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期">
                        </el-date-picker>
                    </div>
                </div>
                <div class="offset_table_wrap">
                    <el-table stripe :data="recordList" border style="width: 100%;" :height="maxH">
                        <el-table-column prop="teacherName" label="姓名"></el-table-column>
                        <el-table-column prop="departName" label="部门"></el-table-column>
                        <el-table-column label="抵扣月份">
                            <template slot-scope="scope">
                                <span>{{scope.row.monthNo || 0}}月</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="askTypeName" label="请假类型"></el-table-column>
                        <el-table-column label="请假时长">
                            <template slot-scope="scope">
                                <span>{{scope.row.askDays || 0}}天</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="抵扣张数">
                            <template slot-scope="scope">
                                <span>{{scope.row.payNum || 0}}张</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="操作时间">
                            <template slot-scope="scope">
                                <span>{{(scope.row.updateTime || scope.row.createTime) | formatTime}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column align="center" label="操作">
                            <template slot-scope="scope">
                                <el-button size="small" type="text" @click="rejectSupply(scope.row.id)">不同意</el-button>
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

                    <el-dialog title="驳回" :visible.sync="dialogFormVisible" width="750px" :close-on-press-escape='false'
                               :close-on-click-modal='false'>
                        <el-form label-width="100px">
                            <el-form-item label="驳回原因">
                                <el-input type="textarea" v-model.trim="disRemark"
                                          :autosize="{ minRows: 2, maxRows: 4}"></el-input>
                            </el-form-item>
                        </el-form>
                        <div slot="footer" class="dialog-footer">
                            <el-button type="primary" @click="saveRejectSupply()">确 定</el-button>
                        </div>
                    </el-dialog>
                </div>
            <!-- </el-tab-pane>
        </el-tabs> -->

    </div>
</template>

<script>
    import mixins from '@/mixins/windowResize';
    import {getSchoolTimeList} from '@/api/record';
    import {
        getSupplyWithholdRecordPageList,
        recallSupplyWithhold,
        getDepartListByUserId,
        queryDepartByType,
        possessRole
    } from '@/api/supplyClass';

    export default {
        name: "supplyClassOffsetRecord",
        data() {
            return {
                dialogFormVisible: false,
                pagination: {
                    pageNo: 1,
                    pageSize: 20,
                    total: null
                },
                schoolName: '',
                schoolTimeCode: '',
                schoolYearList: [],
                departSelect: null,
                departList: [],
                supplyDate: '',
                recordList: [],
                disRemark: '',
                rejectSupplyId: 0,
                activeName: 'two'
            }
        },
        mixins: [mixins],
        filters: {
            formatTime(date) {
                if (date) {
                    return date.substring(0, 19);
                }
                return '--';
            }
        },
        watch: {
            supplyDate(val) {
                if (val && val.length && val[0]) {
                    let start = '';
                    let end = '';
                    if (val[0] && val[0].length) {
                        start = val[0];
                        end = val[1];
                    } else {
                        start = this.getStrDate(val[0]);
                        end = this.getStrDate(val[1]);
                    }
                    this.getStatistics();
                }
            }
        },
        created() {
            this.getSchoolTimeList();
            let roleId = '7';
            possessRole(roleId).then(res => {
                if (res.data.code === 200 && res.data.data) {
                    if (!!res.data.data.result) {
                        this.queryDepartByType();
                    } else {
                        this.getDepartListByUserId();
                    }
                }
            }).catch(err => {
            });
        },
        methods: {
            goBack() {
                this.$router.back();
            },
            tabsfun() {
                if (this.activeName == 'one') {
                    this.$router.replace({path: 'offsetStatistics'});
                }

            },
            changeSchool(val) {
                const self = this;
                this.schoolName = val;
                self.date = [];
                this.schoolYearList.forEach(function (item) {
                    if (item.schoolTimeName === val) {
                        self.schoolTimeCode = item.id;
                        self.date.push(item.startDate);
                        self.date.push(item.endDate);
                        self.supplyDate = [item.startDate, item.endDate]; // 列表日期
                    }
                });
            },
            changeDepart() {
                this.getStatistics();
            },
            getSchoolTimeList() {
                getSchoolTimeList().then(res => {
                    this.schoolYearList = res.data.data;
                    const self = this;
                    this.schoolYearList.forEach(function (item) {
                        if (item.isCurrent === 1) {
                            self.schoolName = item.schoolTimeName;
                            self.schoolTimeCode = item.id;
                            self.supplyDate = [item.startDate, item.endDate]; // 列表日期
                        }
                    });
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
                        this.departSelect = self.departList[0].value || null;
                        this.getStatistics();
                    }
                }).catch();
            },
            // 教务处
            queryDepartByType() {
                let self = this;
                queryDepartByType().then(res => {
                    if (JSON.parse(JSON.stringify(res.data)).code === 200) {
                        self.departList.push({
                            label: '全部部门',
                            value: 0
                        });
                        JSON.parse(JSON.stringify(res.data)).data.forEach((item) => {
                            let query = {};
                            query.label = item.name;
                            query.value = item.id.toString();
                            self.departList.push(query);
                        });
                        this.departSelect = 0;
                        this.getStatistics();
                    }
                }).catch();
            },
            getStatistics() {
                let start = '';
                let end = '';
                if (this.supplyDate && this.supplyDate.length && this.supplyDate[0]) {
                    if (this.supplyDate[0] && this.supplyDate[0].length) {
                        start = this.supplyDate[0];
                        end = this.supplyDate[1];
                    } else {
                        start = this.getStrDate(this.supplyDate[0]);
                        end = this.getStrDate(this.supplyDate[1]);
                    }
                } else {
                    this.$message({
                        message: '请选择日期范围！',
                        type: 'warning'
                    });
                    return;
                }

                if (!this.schoolTimeCode) {
                    return;
                }
                if (!this.departSelect && this.departSelect !== 0) {
                    return;
                }
                let query = {
                    departId: parseInt(this.departSelect),
                    pageNo: this.pagination.pageNo,
                    pageSize: this.pagination.pageSize,
                    schoolTimeId: this.schoolTimeCode,
                    teacherName: '',
                    endDate: end,
                    startDate: start
                };
                this.getSupplyWithholdRecordPageList(query);
            },
            getSupplyWithholdRecordPageList(query) {
                getSupplyWithholdRecordPageList(query).then(res => {
                    const data = res.data;
                    if (res.data.code === 200) {
                        this.recordList = data.data.dataList;
                        this.pagination.total = data.data.pagination.total;
                    } else {
                        this.$message({
                            message: data.msg,
                            type: 'warning'
                        });
                    }
                }).catch();
            },
            rejectSupply(id) {
                this.rejectSupplyId = id;
                this.disRemark = '';
                this.dialogFormVisible = true;
            },
            saveRejectSupply() {
                if (!this.disRemark) {
                    this.$message({
                        message: '请输入驳回原因！',
                        type: 'warning'
                    });
                    return;
                }
                this.recallSupplyWithhold();
            },
            recallSupplyWithhold() {
                let query = {
                    disRemark: this.disRemark,
                    id: this.rejectSupplyId
                };
                recallSupplyWithhold(query).then(res => {
                    const data = res.data;
                    if (res.data.code === 200) {
                        this.$message({
                            message: '驳回成功！',
                            type: 'success'
                        });
                        this.getStatistics();
                        this.dialogFormVisible = false;
                    } else {
                        this.$message({
                            message: data.msg,
                            type: 'warning'
                        });
                    }
                }).catch();
            },
            getDate(n) {
                const data = new Date();
                data.setTime(data.getTime() + 3600 * 1000 * 24 * n);
                let localDateStr = data.getFullYear() + "-" + this.fillZero(data.getMonth() + 1) + "-" + this.fillZero(data.getDate());
                return localDateStr;
            },
            getStrDate(data) {
                let strDate = data.getFullYear() + "-" + this.fillZero(data.getMonth() + 1) + "-" + this.fillZero(data.getDate());
                return strDate;
            },
            fillZero(n) {
                return n < 10 ? '0' + n : n;
            },
            sizeChangeHandler() {
                this.getStatistics();
            },
            currentChangeHandler() {
                this.getStatistics();
            }
        }
    }
</script>

<style lang="scss" scoped>
    .supply_class_wrap {
        padding: 12px;

        .header {
            padding-bottom: 10px;

            .button_wrap {
                width: 60%;
                margin-left: 20%;
                overflow: hidden;

                span {
                    width: 50%;
                    line-height: 34px;
                    float: left;
                    text-align: center;
                    background: #fff;
                    border: 1px solid #bfcbd9;
                    cursor: pointer;
                }

                .tab_left {
                    border-radius: 4px 0 0 4px;
                }

                .tab_right {
                    border-radius: 0 4px 4px 0;
                }

                .tab_color {
                    color: #fff;
                    background-color: #409eff;
                    border-color: #409eff;
                    -webkit-box-shadow: -1px 0 0 0 #409eff;
                    box-shadow: -1px 0 0 0 #409eff;
                }
            }
        }
    }
</style>
