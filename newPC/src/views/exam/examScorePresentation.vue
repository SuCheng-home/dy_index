<template>
    <div class="app-container examScorePresentation">
         <div class="top">   
             <el-row>
                <el-col :span="19">
                     <el-button @click="$router.back()" type="default" size="medium">返回</el-button> 
                     <el-select class="filter-item" v-model="listQuery.schoolTimeId" size="medium" placeholder="请选择"
                       @change="changeclassSchool">
                <el-option v-for="item in schoolTimeList" :key="item.id" :label="item.schoolTimeName"
                           :value="item.id"></el-option>
            </el-select>
            <el-select class="filter-item" size="medium" v-model="listQuery.classId" placeholder="请选择" @change="changeclass">
                <el-option v-for="item in classList" :key="item.classId" :label="item.className"
                           :value="item.classId"></el-option>
            </el-select>
                </el-col>
                <el-col :span="5">
                  <el-input size="medium" class="search-input" placeholder="请输入学生姓名" v-model.trim="listQuery.searchName" @change="handleFilter">
                        <el-button size="medium" slot="append" icon="el-icon-search" @click="handleFilter"></el-button>
                    </el-input>
                 </el-col>
            </el-row>               
        </div>
        <el-table stripe :data="list" border  ref="table"  style="width: 100%" :height="maxH">
            <el-table-column align="left" fixed width="150" label="姓名">
                <template slot-scope="scope">
                    <span class="link-type" @click="studentId(scope.row.schoolTimeId,scope.row.stuId)">{{scope.row.stuName }}</span>
                </template>
            </el-table-column>
            <el-table-column label="学号" fixed width="150" show-overflow-tooltip>
                <template slot-scope="scope">
                    {{scope.row.learnNum}}
                </template>
            </el-table-column>
            <el-table-column v-if="examList.length>4" width="250px"  :key="index" v-for="(item,index) in examList"
                             align="center" :label="item.name">
                <template slot-scope="scope">
                    期末:{{scope.row.objectList[index].lastScore}};期中:{{scope.row.objectList[index].midScore}};平时:{{scope.row.objectList[index].usuallyAvg}};
                </template>
            </el-table-column>
            <el-table-column v-if="0<examList.length<4" min-width="250px" :key="index" v-for="(item,index) in examList"
                             align="center" :label="item.name">
                <template slot-scope="scope">
                    期末:{{scope.row.objectList[index].lastScore}};期中:{{scope.row.objectList[index].midScore}};平时:{{scope.row.objectList[index].usuallyAvg}};
                </template>
            </el-table-column>
            <el-table-column v-if="examList.length === 0" label="暂无考试成绩">
            </el-table-column>
            <el-table-column label="评语" fixed="right" width="150" show-overflow-tooltip>
                <template slot-scope="scope">
                    <el-tag v-if="!scope.row.comment" type="danger">未评价</el-tag>
                    <span v-if="scope.row.comment">{{scope.row.comment}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" fixed="right" label="操作" width="100">
                <template slot-scope="scope">
                    <el-button size="small" type="text"
                               @click.native="teacherEvaluation(scope.row.schoolTimeId,scope.row.stuId)">评语
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <div v-show="!listLoading" class="pagination-container">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                           :current-page.sync="listQuery.pageNo" :page-sizes="[10,20,30, 50]"
                           :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper"
                           :total="total">
            </el-pagination>
        </div>
    </div>
</template>
<script>
    import Backtool from '@/components/BackTool';
    //查询学校所有学期列表    获得所教班级
    import {getSchoolTimeAllList, queryClassGrade, queryAllClassCourse, querySchoolClass} from '@/api/system';
    import {getClassAndGradeByManagerId} from '@/api/wtManager';
    import {
        getStuScoreBySchoolTimeIdAndCurrId,
        classStuScoreAnalysisBySchoolTimeId,
        getclassCurrBySchoolTimeId,
        getCurrentSchoolTimeBySchoolId,
        possessRole
    } from '@/api/systemSet/exam';
    import mixin from '@/mixins/windowResize';
    import {mapGetters} from 'vuex';

    export default {
        components: {
            Backtool
        },
        data() {
            return {
                JudgmentDepartment: false,
                examList: [],
                tableKey: 'examScoreCollect',
                list: null,
                total: 0,
                listLoading: false,
                schoolTimeList: [],
                classId: '',
                classList: [],
                courseId: '',
                courseList: [],
                exportURL: '',
                listQuery: {
                    pageNo: 1,
                    pageSize: 20,
                    searchName: '',
                    schoolTimeId: '',//学期id
                    classId: '',//班级id
                },
                timer:null
            }
        },
        computed:{
            ...mapGetters([
            'userInfo'
            ])
        },
        mounted(){
            this.$nextTick(()=>{
                this.timer=setTimeout(()=> {
                this.$refs.table.doLayout()
                },300) 
            })
        },
        beforeDestroy(){
          clearTimeout(this.timer);
        },
        created() {
            let createId = this.$route.query.createId;
            let _this = this;
            getSchoolTimeAllList().then(res => {
                _this.schoolTimeList = res.data.data;
                getCurrentSchoolTimeBySchoolId().then(res => {
                    let data = res.data.data;
                    _this.listQuery.schoolTimeId = data.id;
                    possessRole(7,29).then(res => {
                        _this.JudgmentDepartment = res.data.data.result;
                        if (_this.JudgmentDepartment) {
                            querySchoolClass().then(res => {
                                let data = res.data.data;
                                _this.classList = [];
                                data.forEach(item => {
                                    _this.classList.push({classId: item.id, className: item.name});
                                });
                                _this.listQuery.classId = data.length > 0 ? data[0].id : '';
                                getclassCurrBySchoolTimeId(_this.listQuery).then(res => {
                                    _this.listLoading = true;
                                    _this.examList = res.data.data;
                                    classStuScoreAnalysisBySchoolTimeId(_this.listQuery).then(res => {
                                        let data = res.data.data;
                                        _this.list = data.dataList;
                                        _this.total = data.pagination.total;
                                        if (_this.total > 0) {
                                            _this.listLoading = false;
                                        }
                                        _this.$nextTick(()=>{
                                        _this.timer=setTimeout(()=> {
                                       _this.$refs.table.doLayout()
                                        },300) 
                                    })

                                    }).catch(err => {
                                    });
                                }).catch();

                            }).catch();

                        } else {
                            getClassAndGradeByManagerId({managerId:this.$store.getters.userInfo.id}).then(res => {
                                let data = res.data.data;
                                _this.classList = data;
                                _this.listQuery.classId = data.length > 0 ? data[0].classId : '';
                                getclassCurrBySchoolTimeId(_this.listQuery).then(res => {
                                    _this.listLoading = true;
                                    _this.examList = res.data.data;
                                    classStuScoreAnalysisBySchoolTimeId(_this.listQuery).then(res => {
                                        let data = res.data.data;
                                        _this.list = data.dataList;
                                        _this.total = data.pagination.total;
                                        if (_this.total > 0) {
                                            _this.listLoading = false;
                                        }
                                        _this.$nextTick(()=>{
                                            _this.timer=setTimeout(()=> {
                                            _this.$refs.table.doLayout()
                                            },300) 
                                        })

                                    }).catch(err => {
                                    });
                                }).catch();

                            }).catch();
                        }
                    });
                }).catch(err => {
                });

            }).catch();


        },
        mixins: [mixin],
        methods: {
            handleFilter() {
                if (this.listQuery.searchName.length > 0) {
                    if (this.listQuery.searchName.trim().length > 0) {
                        this.listQuery.pageNo = 1;
                        this.listQuery.searchName = this.listQuery.searchName.trim();
                        this.classStuScoreAnalysisBySchoolTimeId();
                    }
                } else {
                    this.listQuery.pageNo = 1;
                    this.classStuScoreAnalysisBySchoolTimeId();
                }
            },
            handleSizeChange(val) {
                this.listQuery.pageSize = val;
                this.classStuScoreAnalysisBySchoolTimeId();

            },
            handleCurrentChange(val) {
                this.listQuery.pageNo = val;
                this.classStuScoreAnalysisBySchoolTimeId();
            },
            changeclass(val) {
                if (val && this.listQuery.schoolTimeId) {
                    this.listQuery.classId = val;
                    this.classStuScoreAnalysisBySchoolTimeId();
                }
            },
            changeclassSchool(val) {
                if (val && this.listQuery.classId) {
                    this.listQuery.schoolTimeId = val;
                    this.classStuScoreAnalysisBySchoolTimeId();
                }

            },
            classStuScoreAnalysisBySchoolTimeId() {
                let _this = this;
                getSchoolTimeAllList().then(res => {
                    _this.schoolTimeList = res.data.data;
                    if (_this.JudgmentDepartment) {
                        querySchoolClass().then(res => {
                            let data = res.data.data;
                            _this.classList = [];
                            data.forEach(item => {
                                _this.classList.push({classId: item.id, className: item.name});
                            });
                            getclassCurrBySchoolTimeId(_this.listQuery).then(res => {
                                _this.listLoading = true;
                                _this.examList = res.data.data;
                                classStuScoreAnalysisBySchoolTimeId(_this.listQuery).then(res => {
                                    let data = res.data.data;
                                    _this.list = data.dataList;
                                    _this.total = data.pagination.total;
                                    if (_this.total > 0) {
                                        _this.listLoading = false;
                                    }
                                    _this.$nextTick(()=>{
                                        _this.timer=setTimeout(()=> {
                                       _this.$refs.table.doLayout()
                                        },300) 
                                    })
                                }).catch(err => {
                                });
                            }).catch();

                        }).catch();

                    } else {
                        getClassAndGradeByManagerId({managerId:this.$store.getters.userInfo.id}).then(res => {
                            _this.classList = res.data.data;
                            getclassCurrBySchoolTimeId(_this.listQuery).then(res => {
                                _this.listLoading = true;
                                _this.examList = res.data.data;
                                classStuScoreAnalysisBySchoolTimeId(_this.listQuery).then(res => {
                                    let data = res.data.data;
                                    _this.list = data.dataList;
                                    _this.total = data.pagination.total;
                                    if (_this.total > 0) {
                                        _this.listLoading = false;
                                    }
                                    _this.$nextTick(()=>{
                                        _this.timer=setTimeout(()=> {
                                       _this.$refs.table.doLayout()
                                        },300) 
                                    })

                                }).catch(err => {
                                });
                            }).catch();

                        }).catch();
                    }
                }).catch();
            },

            studentId(schoolTimeId, stuId) {
                this.$router.push({path: 'studentDetails', query: {stuId: stuId, schoolTimeId: schoolTimeId}});
            },
            teacherEvaluation(schoolTimeId, stuId) {
                this.$router.push({path: 'teacherEvaluation', query: {stuId: stuId, schoolTimeId: schoolTimeId}});
            },
        }
    }
</script>

<style scoped>
    .examScorePresentation .el-table__body-wrapper {
        overflow: auto !important;
    }
    .examScorePresentation .top {
        padding-bottom: 10px;
    }
</style>
