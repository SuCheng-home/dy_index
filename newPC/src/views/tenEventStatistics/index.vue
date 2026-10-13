<template>
    <div class="tenEventStaIndex">
        <div class="header-wrap">
            <div class="header">
                <template>
                    <el-select size="medium" v-model="schoolTimeCode" placeholder="请选择学期" @change="changeSchool" style="width: 195px;">
                        <el-option v-for="item in schoolYearList" :key="item.id" :label="item.schoolTimeName"
                                   :value="item.id">
                        </el-option>
                    </el-select>
                </template>
                <template>
                    <el-select size="medium" v-model="gradeCode" placeholder="请选择年级" @change="changeGrade">
                        <el-option label="全部年级" :value="0"></el-option>
                        <el-option v-for="item in gradeList" :key="item.id" :label="item.name" :value="item.id">
                        </el-option>
                    </el-select>
                </template>
                <template>
                    <el-select size="medium" v-model="classCode" placeholder="请选择班级" @change="changeClass">
                        <el-option label="全部班级" :value="0"></el-option>
                        <el-option v-for="item in classList" :key="item.id" :label="item.name" :value="item.id">
                        </el-option>
                    </el-select>
                </template>
                <template>
                    <el-select size="medium" v-model="thingsTypeId" placeholder="请选择类型" @change="changeThing">
                        <el-option label="全部类型" :value="0"></el-option>
                        <el-option v-for="item in thingsTypeList" :key="item.id" :label="item.thingName"
                                   :value="item.id">
                        </el-option>
                    </el-select>
                </template>
                <a :href="exportURL" download="导出结果" target="_blank" v-if="tenEventList&&tenEventList.length!==0">
                    <el-button class="filter-item" size="medium" type="primary">导出</el-button>
                </a>
                <template>
                    <el-input placeholder="请输入学生姓名" size="medium" v-model.trim="stuName" class="search-input search-input--right"
                              @change="handleInputChange">
                        <el-button slot="append" icon="el-icon-search" @click="handleInputChange"></el-button>
                    </el-input>
                    <!-- <el-input class="search-input"
                              placeholder="请输入学生姓名" icon="search" size="medium" @keyup.enter.native="handleInputChange"
                              v-model.trim="stuName">
                    </el-input> -->
                </template>
                <!-- <el-button type="primary" size="medium"   @click="examHandler">检索</el-button> -->
            </div>
        </div>
        <el-table stripe :data="tenEventList" v-loading.body="listLoading" border fit highlight-current-row
                  style="width: 100%" :height="maxH">
            <el-table-column align="center" label="学生姓名" show-overflow-tooltip>
                <template slot-scope="scope">
                    <span class="link-type"
                          @click="JumpTo('tenEventStaDetail',{id:scope.row.id})">{{scope.row.stuName}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="所在班级" show-overflow-tooltip>
                <template slot-scope="scope">
                    <span>{{scope.row.className}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="类型" show-overflow-tooltip>
                <template slot-scope="scope">
                    <span>{{scope.row.thingName}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="提交时间" show-overflow-tooltip>
                <template slot-scope="scope">
                    <span>{{scope.row.createTime|filterTime}}</span>
                </template>
            </el-table-column>
        </el-table>
        <div v-show="!listLoading" class="pagination-container">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                           :current-page.sync="pageNo" :page-sizes="[10,20,30, 50]"
                           :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper"
                           :total="total">
            </el-pagination>
        </div>
    </div>
</template>
<script>
    import mixin from '@/mixins/windowResize';
    import moment from 'moment';
    import {
        getSchoolTimeAllList,
        querySchoolGrade,
        queryClassByGradeId,
        findThingByGradeLevel,
        statisticThingsListByPage
    } from '@/api/tenEventStatistic';

    export default {
        data() {
            return {
                schoolTimeCode: '',
                schoolName: '',
                schoolYearList: [],
                gradeCode: 0,
                gradeName: '',
                gradeList: [],
                gradeLevel: null,
                className: '',
                classCode: 0,
                classList: [],
                thingsTypeId: 0,
                thingsTypeName: '',
                thingsTypeList: [],
                stuName: '',
                pageNo: 1,
                pageSize: 20,
                tenEventList: [],
                total: null,
                exportURL: '',
                listLoading: false,
                firstIn: false,
            }
        },
        created() {
            this.firstIn = true;
            this.getSchoolTimeAllListFunc();
            this.querySchoolGradeFunc();
        },
        mounted() {

        },
        mixins: [mixin],
        filters: {
            filterTime(date) {
                return date ? moment(new Date(Number(date))).format('YYYY-MM-DD HH:mm:ss') : ''
            }
        },
        methods: {
            examHandler() {
                this.pageNo = 1;
                this.statisticThingsListByPageFunc();
            },
            JumpTo(path, query = {}) {
                this.$router.push({
                    path,
                    query
                })
            },
            handleSizeChange(val) {
                this.pageSize = val;
                this.statisticThingsListByPageFunc();
            },
            handleCurrentChange(val) {
                this.pageNo = val;
                this.statisticThingsListByPageFunc();
            },
            changeThing(val) {
                this.stuName = '';
                this.pageNo = 1;
                if (val == 0) {
                    this.thingsTypeId = 0;
                } else {
                    this.thingsTypeId = val;
                }
                this.statisticThingsListByPageFunc();
            },
            statisticThingsListByPageFunc() {
                this.listLoading = true;
                statisticThingsListByPage({
                    classId: this.classCode,
                    gradeId: this.gradeCode,
                    pageNo: this.pageNo,
                    pageSize: this.pageSize,
                    schoolTimeId: this.schoolTimeCode,
                    stuName: this.stuName,
                    thingsTypeId: this.thingsTypeId
                }).then(res => res.data)
                    .then(data => {
                        if (data.code === 200) {
                            let tenEventData = data.data;
                            this.tenEventList = data.data.dataList;
                            this.total = tenEventData.pagination.total;
                            this.listLoading = false;
                            /*导出*/
                            this.exportURL = global.BasePath + 'structure/eachYearTenThings/exportStatisticThingsList?classId=' + this.classCode + '&gradeId=' + this.gradeCode + '&excelName=' + '导出结果' + '&fields=' + 'stuName,className,thingName,createTime' + '&titles=' + '学生姓名,所在班级,类型,提交时间' + '&thingsTypeId=' + this.thingsTypeId + '&schoolTimeId=' + this.schoolTimeCode + '&stuName=' + this.stuName + '&token=' + this.$store.getters.token;
                        }
                    }).catch(() => {
                    this.listLoading = false;
                })
            },
            handleInputChange() {
                this.pageNo = 1;
                this.statisticThingsListByPageFunc();
            },
            findThingByGradeLevelFunc() {
                findThingByGradeLevel({
                    gradeLevel: this.gradeLevel,
                    schoolTimeId: this.schoolTimeCode
                }).then(res => res.data)
                    .then(data => {
                        if (data.code === 200) {
                            this.thingsTypeList = data.data;
                        }
                    }).catch(() => {
                })
            },
            changeClass(val) {
                this.stuName = '';
                this.pageNo = 1;
                if (val == 0) {
                    this.classCode = 0;
                    this.thingsTypeId = 0;
                } else {
                    this.classCode = val;
                    this.thingsTypeId = 0;
                }
                this.statisticThingsListByPageFunc();
            },
            queryClassByGradeIdFunc() {
                //班级
                queryClassByGradeId({
                    gradeId: this.gradeCode
                }).then(res => res.data)
                    .then(data => {
                        if (data.code === 200) {
                            this.classList = data.data;
                        }
                    }).catch(() => {
                })
            },
            querySchoolGradeFunc() {
                querySchoolGrade({
                    isFilterNewGrade: true
                }).then(res => res.data)
                    .then(data => {
                        if (data.code === 200) {
                            this.gradeList = data.data;
                        }
                    }).catch(() => {
                })
            },
            changeGrade(val) {
                this.stuName = '';
                this.pageNo = 1;
                if (val == 0) {
                    this.gradeCode = 0;
                    this.classCode = 0;
                    this.thingsTypeId = 0;
                    this.classList = [];
                    this.gradeLevel = 0;
                    this.findThingByGradeLevelFunc();
                } else {
                    this.gradeCode = val;
                    let gradeItem = this.gradeList.find(item => this.gradeCode == item.id);
                    this.gradeLevel = gradeItem.order;
                    this.classCode = 0;
                    this.thingsTypeId = 0;
                    this.queryClassByGradeIdFunc();
                    this.findThingByGradeLevelFunc();
                }
                this.statisticThingsListByPageFunc();
            },
            getSchoolTimeAllListFunc() {
                getSchoolTimeAllList().then(res => res.data)
                    .then(data => {
                        this.schoolYearList = data.data;
                        this.schoolYearList.forEach((item) => {
                            if (item.isCurrent == 1) {
                                this.schoolName = item.schoolTimeName;
                                this.schoolTimeCode = item.id;
                                if (this.firstIn) {
                                    this.gradeLevel = 0;
                                    this.findThingByGradeLevelFunc();
                                    this.statisticThingsListByPageFunc();
                                }
                            }
                        });
                    }).catch(() => {
                })
            },
            changeSchool(val) {
                this.schoolTimeCode = val;
                this.gradeCode = 0;
                this.classCode = 0;
                this.thingsTypeId = 0;
                this.pageNo = 1;
                this.stuName = '';
                this.gradeLevel = 0;
                this.findThingByGradeLevelFunc();
                this.statisticThingsListByPageFunc();
            }
        }
    }
</script>
<style lang="scss" scoped>
    .tenEventStaIndex {
        padding:12px;
        box-sizing: border-box;

        .el-select {
            width: 135px;
        }

        .header {
            margin-bottom: 10px;
            //margin-top:10px;
            font-size: 14px;

            .el-input {
                width: auto;
            }
            .search-input {
                margin-left: 10px;
                float: right;
            }

        }
    }
</style>

