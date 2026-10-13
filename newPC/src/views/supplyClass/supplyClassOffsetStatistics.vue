<template>
    <div class="supply_class_wrap">
        <!-- <el-tabs type="border-card" v-model="activeName" @tab-click="tabsfun()">
            <el-tab-pane label="抵扣统计" name="one"> -->
                <div class="header">

                    <!-- <el-button @click="goBack" size="medium">返回</el-button> -->
                    <template>
                        <el-select size="medium" v-model="schoolName" placeholder="请选择学期" @change="changeSchool">
                            <el-option v-for="item in schoolYearList" :key="item.schoolTimeCode" :label="item.label"
                                       :value="item.schoolTimeName">
                            </el-option>
                        </el-select>
                    </template>
                    <el-select v-model=" departSelect" size="medium" placeholder="请选择部门" @change="changeDepart">
                        <el-option v-for="item in departList" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                </div>
                <div class="offset_table_wrap">
                    <el-table stripe :data="recordList" border style="width: 100%;" :height="maxH">
                        <el-table-column prop="teacherName" label="姓名"></el-table-column>
                        <el-table-column prop="departName" label="部门"></el-table-column>
                        <el-table-column label="代课条总数">
                            <template slot-scope="scope">
                                <span>{{scope.row.supplyCount || 0}}张</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="已抵扣张数">
                            <template slot-scope="scope">
                                <span>{{scope.row.payNum || 0}}张</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="抵扣时长">
                            <template slot-scope="scope">
                                <span>{{scope.row.askDays || 0}}天</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="剩余张数">
                            <template slot-scope="scope">
                                <span>{{scope.row.surplusCount || 0}}张</span>
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
                </div>
            <!-- </el-tab-pane>
            <el-tab-pane label="抵扣记录" name="two"></el-tab-pane>
        </el-tabs> -->

    </div>
</template>

<script>
    import mixins from '@/mixins/windowResize';
    import {getSchoolTimeList} from '@/api/record';
    import {
        getSupplyWithholdStaticsPageData,
        getDepartListByUserId,
        queryDepartByType,
        possessRole
    } from '@/api/supplyClass';

    export default {
        name: "supplyClassOffsetStatistics",
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
                departSelect: null,
                departList: [],
                recordList: [],
                activeName: 'one'
            }
        },
        mixins: [mixins],
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
                if (this.activeName == 'two') {
                    this.$router.replace({path: 'offsetRecord'});
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
                    }
                });
                this.getStatistics();
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
                };

                this.getSupplyWithholdStaticsPageData(query);
            },
            getSupplyWithholdStaticsPageData(query) {
                getSupplyWithholdStaticsPageData(query).then(res => {
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

            .header_line2 {
                margin-top: 10px;
            }
        }

        .offset_table_wrap {
            width: 98%;
            margin: 0 auto;
        }
    }
</style>
