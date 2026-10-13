<template>
    <div class="evaluate_list">
        <div class="header">
            <el-row>
                <el-col :span="2">
                    <el-button @click="goBack()">返回</el-button>
                </el-col>
                <el-col :span="20">
                    <el-select v-model="schoolName" placeholder="请选择学期" @change="changeSchool">
                        <el-option v-for="item in schoolYearList" :key="item.schoolTimeCode" :label="item.label" :value="item.schoolTimeName">
                        </el-option>
                    </el-select>
                </el-col>
                <el-col :span="2">
                    <a :href="exportUrl" download="导出" target="_blank"  v-if="dataList.length">
                        <el-button class="filter-item" type="primary" icon="upload">导出</el-button>
                    </a>
                </el-col>
            </el-row>
        </div>
        <div class="evaluate_table_box">
            <el-table stripe :data="dataList" border fit highlight-current-row style="width: 100%"
                      :height="maxH-40">
                <el-table-column align="center" label="姓名" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span class="user_name" @click="toStuInfo(scope.row.teacherId, scope.row.teacherName, scope.row.totalScore)">{{scope.row.teacherName}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="部门" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span>{{scope.row.departName}}</span>
                    </template>
                </el-table-column>

                <el-table-column :key="index" v-for="(item,index) in dimensionScoreList" align="center" :label="item.dimensionName">
                    <template slot-scope="scope">
                        {{getDimensionScore(scope.row.dimensionScoreList, item)}}
                    </template>
                </el-table-column>

                <el-table-column align="center" label="总分" prop="totalScore"></el-table-column>
                <el-table-column align="center" label="排名" prop="rankNo"></el-table-column>
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
    import mixins from '@/mixins/windowResize';
    import {getSchoolTimeList} from '@/api/record';
    import {getYoungTeacherDimensionListFromScore, getSchoolThDimScoreCollectPageList} from '@/api/youngTeacherDevelopment';

    export default {
        name: "evaluateCheckList",
        data() {
            return {
                schoolName: '',
                schoolTimeCode: '',
                schoolYearList: [],
                dataList: [],
                pagination: {
                    pageNo: 1,
                    pageSize: 20,
                    total: null
                },
                dimensionScoreList: [],
                exportUrl: ''
            }
        },
        mixins: [mixins],
        watch: {
            schoolTimeCode(code) {
                this.exportUrl = `${global.BasePath}structure/youngTeacher/exportThDimScoreCollectData?schoolTimeId=${code}&token=${this.$store.getters.token}`;
                this.getYoungTeacherDimensionListFromScore();
                this.getSchoolThDimScoreCollectPageList();
            }
        },
        created() {
            this.getSchoolTimeList();
        },
        methods: {
            goBack() {
                this.$router.back();
            },
            toStuInfo(teacherId, teacherName, totalScore) {
                this.$router.push({path: 'evaluateCheckStatistics', query: {teacherId: teacherId, teacherName: teacherName, totalScore: totalScore, schoolTimeId: this.schoolTimeCode}});
            },
            getDimensionScore(scoreList, item) {
                const scoreIndex = scoreList.map(item => item.dimensionId).indexOf(item.id);
                const itemScore = scoreList[scoreIndex].totalScore;
                if (itemScore || itemScore === 0) {
                    return itemScore;
                }
                return '-';
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
            getYoungTeacherDimensionListFromScore() {
                getYoungTeacherDimensionListFromScore(this.schoolTimeCode).then(res => {
                    const data = res.data.data;
                    if (res.data.code === 200) {
                        this.dimensionScoreList = data;
                    }
                }).catch();
            },
            getSchoolThDimScoreCollectPageList() {
                getSchoolThDimScoreCollectPageList({
                    pageNo: this.pagination.pageNo,
                    pageSize: this.pagination.pageSize,
                    schoolTimeId: this.schoolTimeCode
                }).then(res => {
                    const data = res.data.data;
                    if (res.data.code === 200) {
                        this.dataList = data.dataList;
                        // this.dimensionScoreList = data.dataList.map(item => item.dimensionScoreList);
                        this.pagination.total = data.pagination.total;
                    }
                }).catch();
            },
            changeSchool(val) {
                const self = this;
                this.schoolName = val;
                self.date = [];
                this.schoolYearList.forEach(function (item) {
                    if (item.schoolTimeName === val) {
                        self.schoolTimeCode = item.id;
                    }
                })
            },
            sizeChangeHandler() {
                this.getSchoolThDimScoreCollectPageList();
            },
            currentChangeHandler() {
                this.getSchoolThDimScoreCollectPageList();
            }
        }
    }
</script>

<style lang="scss" scoped>
    .evaluate_list{
        .header{
            padding:12px;
            border-bottom: 1px solid #eee;
        }
        .evaluate_table_box{
            margin: 20px;
            .user_name{
                color: #409eff;
                cursor: pointer;
            }
        }
    }
</style>
