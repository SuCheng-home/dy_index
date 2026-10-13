<template>
    <div class="dataTotal addTabSwitch">
        <div class="botton" v-if="isStandalone">
            <span class="tab-left tabcolor">数据汇总</span>
            <span @click="jumpPage('batchImport')">批量导入</span>
            <span @click="jumpPage('itemEnter')">按项录入</span>
            <span class="tab-right" @click="jumpPage('studentEnter')">按学生录入</span>
        </div>
        <div class="header">
            <el-row>
                <el-col :span="19">
                    <template>
                        <el-select size="medium" v-model="schoolYearCode" placeholder="请选择学年"
                                   @change="changeSchoolYear">
                            <el-option v-for="item in schoolYearList" :key="item.id" :label="item.year"
                                       :value="item.id">
                            </el-option>
                        </el-select>
                    </template>
                    <template>
                        <el-select size="medium" v-model="classCode" placeholder="请选择班级" @change="changeClass">
                            <el-option v-for="item in classList" :key="item.classId" :label="item.className"
                                       :value="item.classId">
                            </el-option>
                        </el-select>
                    </template>
                </el-col>
                <el-col :span="5">
                    <el-input size="medium" v-model.trim="searchTitle" placeholder="姓名/学号/学籍号"
                              @change="handleInputChange">
                        <el-button slot="append" icon="el-icon-search" size="medium"
                                   @click="handleInputChange"></el-button>
                    </el-input>
                </el-col>
            </el-row>
        </div>
        <div>
            <el-table border stripe :data="fitnessTable" :height="isStandalone?(maxH-56):maxH" style="width: 100%">
                <el-table-column
                    prop="date"
                    label="姓名" align="center">
                    <template slot-scope="scope">
                        <span class="link-type"
                              @click="jumpPage('fitnessDetail',{id:scope.row.id,schoolId:scope.row.schoolId,studentId:scope.row.studentId,classId:scope.row.classId,schoolYear:scope.row.schoolYear})">{{scope.row.name}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" :key="index" v-for="(item,index) in typeStand" :label="changeVal(item)"
                                 show-overflow-tooltip>
                    <template slot-scope="scope">
                        {{getProjectItem(scope.row.projectList, item).projectScore}}
                        <!-- {{scope.row.projectList[item] ? (scope.row.projectList[item].projectScore || '--') : '--'}} -->
                    </template>
                </el-table-column>
                <el-table-column
                    prop="date"
                    label="标准分" align="center">
                    <template slot-scope="scope">
                        {{scope.row.standardScore}}
                    </template>
                </el-table-column>
                <el-table-column
                    prop="date"
                    label="附加分" align="center">
                    <template slot-scope="scope">
                        {{scope.row.additionalScore}}
                    </template>
                </el-table-column>
                <el-table-column
                    prop="date"
                    label="总分" align="center">
                    <template slot-scope="scope">
                        {{scope.row.totalScore}}
                    </template>
                </el-table-column>
                <el-table-column
                    prop="date"
                    label="总分等级" align="center">
                    <template slot-scope="scope">
                        {{scope.row.totalLevel}}
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

    </div>
</template>
<script>
    import {
        getSchoolYear,
        getCurrentSchoolTimeBySchoolId,
        getClassListBySchoolYear,
        getFitnessTestList,
        getParentByChildId,
        getLevelByGradeId
    } from '@/api/physicalHeadlth/index';
    import _ from 'lodash';
    import {mapGetters} from 'vuex';
    import mixins from '@/mixins/windowResize';

    export default {
        data() {
            return {
                schoolYearName: '',
                schoolYearCode: '',
                schoolYearList: [],
                classCode: '',
                className: '',
                classList: [],
                pageNo: 1,
                pageSize: 20,
                currentYear: '',
                searchTitle: '',
                fitnessTable: [],
                total: null,
                listLoading: false,
                columnList: [],
                subId: '',
                level: '',
                typeStand: [],
                classId: this.$route.query.classId ? this.$route.query.classId : '',
                schoolYear: this.$route.query.schoolYear ? this.$route.query.schoolYear : ''
            }
        },
        created() {
            //获取学年
            this.getSchoolYearFunc();
        },
        computed: {
            ...mapGetters(['isStandalone'])
        },
        methods: {
            getProjectItem(list, type) {
                return list.find(({projectType}) => projectType == type) || {projectScore: '--'};
            },
            jumpPage(path, query = {}) {
                this.$router.push({
                    path,
                    query
                })
            },
            handleCurrentChange(val) {
                this.pageNo = val;
                this.getFitnessTestListFunc();
            },
            handleSizeChange(val) {
                this.pageSize = val;
                this.pageNo = 1;
                this.getFitnessTestListFunc();
            },
            changeVal(item) {
                var text = '';
                switch (item) {
                    case 1:
                        text = '体重指数';
                        break;
                    case 2:
                        text = '肺活量';
                        break;
                    case 3:
                        text = "50米跑";
                        break;
                    case 4:
                        text = "坐位体前屈";
                        break;
                    case 5:
                        text = "1分钟仰卧起坐";
                        break;
                    case 6:
                        text = "50米*8往返跑";
                        break;
                    case 7:
                        text = "一分钟跳绳";
                        break;
                    default:
                        break;
                }
                return text;
            },
            handleInputChange() {
                this.pageNo = 1;
                this.getFitnessTestListFunc();
            },
            getFitnessTestListFunc() {
                this.listLoading = true;
                if (this.classCode && this.schoolYearName) {
                    getFitnessTestList({
                        schoolYear: this.schoolYearName,
                        classId: this.classCode,
                        searchTitle: this.searchTitle,
                        pageNo: this.pageNo,
                        pageSize: this.pageSize
                    }).then(res => res.data)
                        .then(data => {
                            if (data.code === 200) {
                                let fitnessData = data.data;
                                this.fitnessTable = fitnessData.scorelist.dataList;

                                // this.fitnessTable.forEach((fitItem) => {
                                //   const proObj = {};
                                //   fitItem.projectList = fitItem.projectList.forEach((projectItem) => {
                                //      proObj[projectItem.projectType] = projectItem
                                //   });
                                //   fitItem.projectList = proObj;
                                // });
                                // this.columnList=fitnessData.columnList;
                                if (this.fitnessTable.length == 0 && this.pageNo > 1) {
                                    this.pageNo--;
                                    this.getFitnessTestListFunc();
                                }
                                this.total = fitnessData.scorelist.pagination.total;
                                this.listLoading = false;
                            }
                        }).catch(() => {
                        this.listLoading = false;
                    })
                }
            },
            getClassListBySchoolYearFunc() {
                getClassListBySchoolYear({
                    schoolYear: this.schoolYearName
                }).then(res => res.data)
                    .then(data => {
                        if (data.code === 200) {
                            if (data.data && data.data.length !== 0) {
                                let classData = data.data;
                                this.classList = classData;
                                if (this.classId) {
                                    this.classCode = this.classId;
                                    let classCurrData = this.classList.find((item) => this.classCode == item.classId);
                                    this.className = classCurrData.className;
                                } else {
                                    this.classCode = classData[0].classId;
                                    this.className = classData[0].className;
                                }
                                this.getParentByChildIdFunc();
                            } else {
                                this.classList = [];
                                this.classCode = '';
                                this.className = '';
                                this.fitnessTable = [];
                            }
                        }
                    }).catch(() => {
                })
            },
            getParentByChildIdFunc() {
                getParentByChildId({
                    childId: this.classCode
                }).then(res => res.data)
                    .then(data => {
                        if (data.code === 200) {
                            this.subId = data.data.id;
                            getLevelByGradeId({
                                gradeId: this.subId
                            }).then(res => res.data)
                                .then(data => {
                                    if (data.code === 200) {
                                        this.level = data.data.level;
                                        if (this.level >= 1 && this.level < 3) {
                                            this.typeStand = [1, 2, 3, 4, 7];
                                        }
                                        if (this.level >= 3 && this.level < 5) {
                                            this.typeStand = [1, 2, 3, 4, 5, 7];
                                        }
                                        if (this.level >= 5 && this.level <= 6) {
                                            this.typeStand = [1, 2, 3, 4, 5, 6, 7];
                                        }
                                        this.getFitnessTestListFunc();
                                    }
                                })
                        }
                    })
            },
            getSchoolYearFunc() {
                getSchoolYear().then(res => res.data)
                    .then(data => {
                        if (data.code === 200) {
                            this.schoolYearList = data.data;
                            getCurrentSchoolTimeBySchoolId().then(res => {
                                let data = res.data;
                                if (data.code === 200) {
                                    let currentYearData = data.data;
                                    this.currentYear = currentYearData.schoolYear;
                                    if (this.schoolYear) {
                                        this.schoolYearName = this.schoolYear;
                                        let newYearItem = this.schoolYearList.find(item => this.schoolYearName == item.year)
                                        this.schoolYearCode = newYearItem.id;
                                    } else {
                                        this.schoolYearList.forEach(item => {
                                            if (item.year == this.currentYear) {
                                                this.schoolYearName = item.year;
                                                this.schoolYearCode = item.id;
                                            }
                                        })
                                    }

                                    this.getClassListBySchoolYearFunc();
                                }
                            })

                        }
                    }).catch(() => {
                })
            },
            changeSchoolYear(val) {
                this.searchTitle = '';
                this.schoolYearCode = val;
                let schoolYearItem = this.schoolYearList.find(item => {
                    return item.id == val;
                });
                this.schoolYearName = schoolYearItem.year;
                this.classId = '';
                this.getClassListBySchoolYearFunc();
            },
            changeClass(val) {
                this.searchTitle = '';
                this.classCode = val;
                this.getParentByChildIdFunc();
            }
        },
        mixins: [mixins]
    }
</script>
<style lang="scss" scoped>
    .addTabSwitch .botton {
        width: 80%;
        overflow: hidden;
        margin: 0 auto 10px;
    }

    .addTabSwitch .botton span {
        width: 25%;
        line-height: 34px;
        font-size: 16px;
        float: left;
        text-align: center;
        background: #fff;
        border: 1px solid #bfcbd9;
        box-sizing: border-box;
        cursor: pointer;
    }

    .addTabSwitch .botton .tabcolor {
        color: #fff;
        background-color: #20a0ff;
        border-color: #20a0ff;
        -webkit-box-shadow: -1px 0 0 0 #20a0ff;
        box-shadow: -1px 0 0 0 #20a0ff;
    }

    .addTabSwitch .botton .tab-right {
        border-radius: 0 4px 4px 0;
    }

    .addTabSwitch .botton .tab-left {
        border-radius: 4px 0 0 4px;
    }

    .dataTotal {
        padding:12px;
        box-sizing: border-box;
        font-size: 14px;

        .header {
            margin-bottom: 10px;

          

        }

        .pagination-container {
            margin-top: 20px;
        }
    }

    .link-type, .link-type:focus {
        color: #337ab7;
        cursor: pointer;
    }
</style>

