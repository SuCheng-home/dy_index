<template>
    <div class="wtPointRank">
        <div class="header-wrap">
            <div class="header">
                <template v-if="wtManagerRole2">
                    <el-select v-model="schoolTimeCode" size="medium" style="width:150px" placeholder="请选择学期"
                               @change="changeSchool">
                        <el-option v-for="item in schoolYearList" :key="item.id" :label="`${item.year}学年`"
                                   :value="item.id">
                        </el-option>
                    </el-select>
                </template>
                <template v-if="!wtManagerRole2&&wtHeadMasterRole2">
                    <el-select v-model="schoolTimeCode" size="medium" style="width:150px" placeholder="请选择学期"
                               @change="changeSchool2">
                        <el-option v-for="item in schoolYearList" :key="item.id" :label="`${item.year}学年`"
                                   :value="item.id">
                        </el-option>
                    </el-select>
                </template>
                <el-date-picker
                    v-model.trim="startDate" size="medium"
                    type="date"
                    class="btnLeftLine"
                    :clearable="false"
                    placeholder="请选择日期"
                    @change="startChangeHandler"
                >
                </el-date-picker>
                <el-date-picker
                    v-model.trim="endDate" size="medium"
                    type="date"
                    class="btnLeftLine"
                    placeholder="请选择结束日期"
                    :clearable="false"
                    @change="endChangeHandler"
                >
                </el-date-picker>
                <!--梧桐信用管理员-->
                <template v-if="wtManagerRole2">
                    <el-select v-model="gradeCode" placeholder="请选择年级" size="medium" @change="changeGrade">
                        <el-option label="全部年级" :value="0"></el-option>
                        <el-option v-for="item in gradeList" :key="item.id" :label="item.name" :value="item.id">
                        </el-option>
                    </el-select>
                </template>
                <template v-if="!wtManagerRole2&&wtHeadMasterRole2">
                    <el-select v-model="gradeCode" placeholder="请选择年级" size="medium" @change="changeGrade2">
                        <el-option v-for="item in gradeList" :key="item.id" :label="item.name" :value="item.id">
                        </el-option>
                    </el-select>
                </template>
                <!--梧桐信用管理员-->
                <template v-if="wtManagerRole2">
                    <el-select v-model="classCode" placeholder="请选择班级" size="medium" @change="changeClass">
                        <el-option label="全部班级" :value="0"></el-option>
                        <el-option v-for="item in classList" :key="item.id" :label="item.name" :value="item.id">
                        </el-option>
                    </el-select>
                </template>
                <template v-if="!wtManagerRole2&&wtHeadMasterRole2">
                    <el-select v-model="classCode" placeholder="请选择班级" size="medium" @change="changeClass2">
                        <el-option v-for="item in classList" :key="item.id" :label="item.name" :value="item.id">
                        </el-option>
                    </el-select>
                </template>
                <!-- <template> -->
                    <!-- <el-input v-model.trim="searchName"
                              placeholder="请输入名称" @keyup.enter.native="handleInputChange"
                              size="medium"></el-input>
                </template>
                <el-button type="primary"   @click="examHandler" size="medium">检索</el-button> -->
                <a :href="exportURL" download="导出结果" target="_blank"
                   v-if="exchangeList&&exchangeList.length!==0">
                    <el-button class="filter-item" type="primary" size="medium">导出</el-button>
                </a>
                <el-input class="search-input" style="width:20%;float: right;margin: 0 10px;"  placeholder="请输入名称" icon="search" size="medium" @change="handleInputChange()"
                          v-model.trim="searchName">
                           <el-button slot="append" icon="el-icon-search" @click="examHandler()"></el-button>
            </el-input>
            </div>
        </div>
        <el-table stripe :data="exchangeList" v-loading.body="listLoading" border fit highlight-current-row
                  style="width: 100%" :height="maxH">
            <el-table-column min-width="300px" align="center" label="物品名称" show-overflow-tooltip>
                <template slot-scope="scope">
                    <span class="link-type" @click="productJump(scope.row.goodId)">{{scope.row.goodName}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="数量" show-overflow-tooltip>
                <template slot-scope="scope">
                    <span>{{scope.row.goodCount}}</span>
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
    import {
        possessRole,
        getSchoolYear,
        getCurrentSchoolTimeBySchoolId,
        querySchoolGrade,
        queryClassByGradeId,
        goodAnalysis,
        getClassAndGradeByManagerId,
        getDepartListByUserId
    } from '@/api/wtManager';
    import debounce from 'lodash/debounce';
    import mixin from '@/mixins/windowResize';
    import {mapGetters} from 'vuex';

    export default {
        data() {
            return {
                schoolName: '',
                schoolTimeCode: '',
                schoolYearList: [],
                gradeList: [],
                gradeName: '',
                gradeCode: 0,
                classList: [],
                className: '',
                listLoading: false,
                classCode: 0,
                pageNo: 1,
                pageSize: 20,
                searchName: '',
                exchangeList: [],
                startDate: '',
                endDate: '',
                total: null,
                exportURL: '',
                wtManagerRole2: false,
                wtHeadMasterRole2: false,
                exchangeFirst: true
            }
        },
        created() {
            this.exchangeFirst = true;
            //梧桐信用管理员
            this.possessRoleFunc1();
            // //获取年级列表
            // this.querySchoolGradeFunc();
        },
        mounted() {
        },
        computed: {
            ...mapGetters([
                'userInfo'
            ])
        },
        mixins: [mixin],
        methods: {
            possessRoleFunc1() {
                var managerRoleId2 = 273;
                possessRole(managerRoleId2).then(res => {
                    if (res.data.code === 200) {
                        var That = this;
                        this.wtManagerRole2 = res.data.data.result;
                        this.getSchoolTimeAllListFunc();
                        this.possessRoleFunc2();
                        /*梧桐信用管理员*/
                        if (this.wtManagerRole2) {
                            this.querySchoolGradeFunc();
                        }

                    }
                }).catch(err => {
                });
            },
            possessRoleFunc2() {
                var headMasterRoleId2 = 11;
                possessRole(headMasterRoleId2).then(res => {
                    if (res.data.code === 200) {
                        var That = this;
                        this.wtHeadMasterRole2 = res.data.data.result;
                        //获取年级列表
                        if (!this.wtManagerRole2 && this.wtHeadMasterRole2) {
                            this.getClassAndGradeByManagerIdFunc();
                        }
                    }
                }).catch(err => {
                });
            },
            getClassAndGradeByManagerIdFunc() {
                var That = this;
                this.gradeList = [];
                getClassAndGradeByManagerId({
                    managerId: this.userInfo.id
                }).then(res => res.data)
                    .then(data => {
                        if (data.code === 200 && data.data) {
                            let gradeBox = [];
                            data.data.forEach(item => {
                                gradeBox.push({
                                    id: item.gradeId,
                                    name: item.gradeName
                                });
                            });
                            gradeBox.forEach((item, index) => {
                                var flag = true;
                                this.gradeList.forEach((subItem, subIndex) => {
                                    if (item.id == subItem.id) {
                                        flag = false;
                                    }
                                });
                                if (flag) {
                                    this.gradeList.push({
                                        id: item.id,
                                        name: item.name
                                    })
                                }
                            });
                            this.gradeName = this.gradeList[0].name;
                            this.gradeCode = this.gradeList[0].id;
                            this.queryClassByGradeIdFunc2();
                        }
                    })
            },
            handleSizeChange(val) {
                this.pageSize = val;
                this.goodAnalysisFunc();
            },
            handleCurrentChange(val) {
                this.pageNo = val;
                this.goodAnalysisFunc();
            },
            productJump(goodId) {
                this.$router.push({
                    path: 'wtDetail',
                    query: {
                        goodId: goodId,
                        classId: this.classCode,
                        gradeId: this.gradeCode,
                        schoolYearId: this.schoolTimeCode,
                        startDate: this.startDate,
                        endDate: this.endDate
                    }
                })
            },
            examHandler() {
                this.pageNo = 1;
                if (this.startDate == '') {
                    this.$message({
                        type: 'error',
                        message: '开始时间不能为空！'
                    });
                    return false;
                }
                if (this.endDate == '') {
                    this.$message({
                        type: 'error',
                        message: '结束时间不能为空！'
                    });
                    return false;
                }
                if (this.startDate > this.endDate) {
                    this.$message({
                        type: 'error',
                        message: '开始时间要小于结束时间!'
                    });
                    return false;
                }
                //检索
                this.goodAnalysisFunc();
            },
            startChangeHandler(value) {
                this.startDate = this.$moment(value).format('YYYY-MM-DD');
                //this.startDate = value;
            },
            endChangeHandler(value) {
                this.endDate = this.$moment(value).format('YYYY-MM-DD');
                //this.endDate = value;
            },
            productSwitch() {
                this.$router.push({
                    path: 'wtExchange'
                })
            },
            goodAnalysisFunc() {
                goodAnalysis({
                    pageNo: this.pageNo,
                    pageSize: this.pageSize,
                    schoolYearId: this.schoolTimeCode,
                    schoolId: this.$store.getters.schoolInfo.id,
                    gradeId: this.gradeCode,
                    classId: this.classCode,
                    searchName: this.searchName,
                    startDate: this.startDate,
                    endDate: this.endDate
                }).then(res => res.data)
                    .then(data => {
                        if (data.code === 200) {
                            if (data.data) {
                                let exchangeData = data.data;
                                this.exchangeList = exchangeData.dataList;
                                this.total = exchangeData.pagination.total;
                                /*导出*/
                                this.exportURL = global.BasePath + 'structure/creditPoint/downGoodAnalysis?classId=' + this.classCode + '&gradeId=' + this.gradeCode + '&schoolId=' + this.$store.getters.schoolInfo.id + '&schoolYearId=' + this.schoolTimeCode + '&startDate=' + this.startDate + '&endDate=' + this.endDate + '&searchName=' + this.searchName + '&token=' + this.$store.getters.token;
                            }
                        }
                    })
            },
            querySchoolGradeFunc() {
                //年级
                querySchoolGrade({
                    isFilterNewGrade: true
                }).then(res => res.data)
                    .then(data => {
                        if (data.code === 200) {
                            this.gradeList = data.data;
                        }
                    })
            },
            queryClassByGradeIdFunc() {
                //班级
                queryClassByGradeId({
                    gradeId: this.gradeCode
                }).then(res => res.data)
                    .then(data => {
                        if (data.code === 200) {
                            this.classList = data.data;
                            //this.classCode=this.classList[0].id;
                        }
                    })
            },
            queryClassByGradeIdFunc2() {
                //班主任获取班级
                getDepartListByUserId({
                    pid: this.gradeCode,
                    type: 4
                }).then(res => res.data)
                    .then(data => {
                        if (data.code === 200) {
                            this.classList = data.data;
                            this.classCode = this.classList[0].id;
                            this.className = this.classList[0].name;
                            if (this.exchangeFirst && !this.wtManagerRole2 && this.wtHeadMasterRole2) {
                                this.goodAnalysisFunc();
                            }
                        }
                    })
            },
            getSchoolTimeAllListFunc() {
                getSchoolYear().then(res => res.data)
                    .then(data => {
                        if (data.data) {
                            this.schoolYearList = data.data;
                            this.getCurrentSchoolTimeBySchoolId();
                        }
                    });
            },
            getCurrentSchoolTimeBySchoolId() {
                getCurrentSchoolTimeBySchoolId().then(res => res.data).then(data => {
                    if (data.data) {
                        this.schoolTimeCode = data.data.schoolYearId;
                        this.startDate = data.data.startDate;
                        this.endDate = this.$moment().format("YYYY-MM-DD");
                        if (this.exchangeFirst && this.wtManagerRole2) {
                            this.goodAnalysisFunc();
                        }
                    }
                })
            },
            changeSchool(val) {
                this.schoolTimeCode = val;
                let schoolItem = this.schoolYearList.find(item => {
                    return item.id == val
                });
                this.startDate = schoolItem.startDate;
                if (schoolItem.isCurrent == 1) {
                    this.endDate = this.$moment().format("YYYY-MM-DD");
                } else {
                    this.endDate = schoolItem.endDate;
                }

                if (this.wtManagerRole2) {
                    this.gradeCode = 0;
                    this.classCode = 0;
                    this.searchName = '';
                    this.goodAnalysisFunc();
                }
                //this.searchName='';
            },
            changeSchool2(val) {
                this.schoolTimeCode = val;
                let schoolItem = this.schoolYearList.find(item => {
                    return item.id == val
                });
                this.startDate = schoolItem.startDate;
                if (schoolItem.isCurrent == 1) {
                    this.endDate = this.$moment().format("YYYY-MM-DD");
                } else {
                    this.endDate = schoolItem.endDate;
                }
                this.getClassAndGradeByManagerIdFunc();
            },
            changeGrade(val) {
                this.searchName = '';
                if (val == 0) {
                    this.gradeCode = 0;
                    this.classCode = 0;
                    this.classList = [];
                    this.goodAnalysisFunc();
                } else {
                    this.gradeCode = val;
                    this.classCode = 0;
                    this.queryClassByGradeIdFunc();
                    this.goodAnalysisFunc();
                }
            },
            changeGrade2(val) {
                this.searchName = '';
                this.gradeCode = val;
                this.queryClassByGradeIdFunc2();
            },
            changeClass(val) {
                this.searchName = '';
                if (val == 0) {
                    this.classCode = 0;
                    this.goodAnalysisFunc();
                } else {
                    this.classCode = val;
                    this.goodAnalysisFunc();
                }
            },
            changeClass2(val) {
                this.searchName = '';
                this.classCode = val;
                this.goodAnalysisFunc();
            },
            handleInputChange: debounce(function (val) {
                //this.searchName=val;
                this.pageNo = 1;
                this.goodAnalysisFunc();
            })
        }
    }
</script>
<style scoped>
    .wtPointRank .el-input--suffix .el-input__inner {
        padding-right: 18px !important;
    }
</style>
<style lang="scss" scoped>
    .wtPointRank {
        padding: 10px;
        box-sizing: border-box;
    }

    .header {
        margin-bottom: 10px;
        font-size: 14px;

        .el-input {
            width: 135px;
        }

        .el-select {
            width: 110px;
        }
    }

    .module-title {
        display: table;
        width: 100%;
        table-layout: fixed;
        border-collapse: separate;
        vertical-align: middle;

        .btn-group {
            display: table-cell;
            float: none;
            width: 1%;

            .btn {
                width: 100%;
                display: inline-block;
                padding: 6px 12px;
                margin-bottom: 0;
                font-size: 14px;
                font-weight: 400;
                line-height: 1.42857143;
                text-align: center;
                white-space: nowrap;
                vertical-align: middle;
                -ms-touch-action: manipulation;
                touch-action: manipulation;
                cursor: pointer;
                -webkit-user-select: none;
                -moz-user-select: none;
                -ms-user-select: none;
                user-select: none;
                background-image: none;
                border: 1px solid transparent;
                border-radius: 4px;
                color: #333;
                background-color: #fff;
                border-color: #606266;
            }

            .btn-selected {
                color: #fff;
                background-color: #409EFF;
                border-color: #409EFF;
            }
        }

        .btn-group:first-child .btn {
            border-top-right-radius: 0;
            border-bottom-right-radius: 0;
        }

        .btn-group:last-child .btn {
            border-top-left-radius: 0;
            border-bottom-left-radius: 0;
        }
    }
</style>
