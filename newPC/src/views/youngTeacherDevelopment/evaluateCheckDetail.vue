<template>
    <div class="evaluate_info_wrap">
        <div class="header">
            <el-row>
                <el-col :span="2">
                    <el-button @click="goBack()">返回</el-button>
                </el-col>
                <el-col :span="22">
                    <el-select v-model="schoolName" placeholder="请选择学期" @change="changeSchool">
                        <el-option v-for="item in schoolYearList" :key="item.schoolTimeCode" :label="item.label" :value="item.schoolTimeName">
                        </el-option>
                    </el-select>
                    <el-select v-model="evaluateName" placeholder="请选择考评项" @change="changeEvaluate">
                        <el-option v-for="item in evaluateList" :key="item.id" :label="item.dimensionName" :value="item.id">
                        </el-option>
                    </el-select>
                </el-col>
            </el-row>
        </div>
        <div class="evaluate_table_box">
            <el-table stripe :data="dataList" border fit highlight-current-row style="width: 100%" :height="maxH">
                <el-table-column align="center" label="考评人" prop="teacherName"></el-table-column>
                <el-table-column align="center" label="考评时间" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span>{{scope.row.createTime | formatTimeMap}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="考评项目">
                    <template slot-scope="scope">
                        <span>{{scope.row.behTypeName}}（{{scope.row.type === '0' ? '加分项' : '减分项'}}）</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="得分" prop="stepScore"></el-table-column>
            </el-table>
            <div class="pagination-container" style="margin-top: 15px">
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
    import {getYoungTeacherDimensionListFromScore, getThDimensionTypeScorePageList} from '@/api/youngTeacherDevelopment';

    export default {
        name: "evaluateCheckDetail",
        data() {
            return {
                schoolName: '',
                schoolTimeCode: '',
                schoolYearList: [],
                dimensionId: '',
                evaluateName: '',
                evaluateList: [],
                pagination: {
                    pageNo: 1,
                    pageSize: 20,
                    total: null
                },
                dataList: [],
                isFirstLoad: true
            }
        },
        filters: {
            formatTimeMap(type) {
                if (type) {
                    return type.substring(0,19);
                }
                return '-';
            }
        },
        mixins: [mixins],
        watch: {
            schoolTimeCode() {
                this.getYoungTeacherDimensionListFromScore();
            },
            dimensionId(val) {
                this.getThDimensionTypeScorePageList();
            }
        },
        created() {
            this.getSchoolTimeList();
        },
        methods: {
            goBack() {
                this.$router.back();
            },
            getSchoolTimeList() {
                getSchoolTimeList().then(res => {
                    this.schoolYearList = res.data.data;
                    this.schoolTimeCode = parseInt(this.$route.query.schoolTimeId);
                    this.schoolName = this.schoolYearList[this.schoolYearList.map(item => item.id).indexOf(this.schoolTimeCode)].schoolTimeName;
                }).catch();
            },
            getYoungTeacherDimensionListFromScore() {
                getYoungTeacherDimensionListFromScore(this.schoolTimeCode).then(res => {
                    const data = res.data.data;
                    if (res.data.code === 200) {
                        if (data.length && this.isFirstLoad) {
                            this.evaluateList = data;
                            this.dimensionId = this.$route.query.id;
                            this.evaluateName = this.$route.query.name;
                        } else if (data.length) {
                            this.evaluateList = data;
                            this.dimensionId = data[0].id;
                            this.evaluateName = data[0].dimensionName;
                        } else {
                            this.dimensionId = '';
                            this.evaluateList = [];
                            this.evaluateName = '';
                        }
                    }
                }).catch();
            },
            getThDimensionTypeScorePageList() {
                getThDimensionTypeScorePageList({
                    dimensionId: this.dimensionId,
                    pageNo: this.pagination.pageNo,
                    pageSize: this.pagination.pageSize,
                    schoolTimeId: this.schoolTimeCode,
                    teacherId: this.$route.query.teacherId
                }).then(res => {
                    const data = res.data.data;
                    if (res.data.code === 200) {
                        this.dataList = data.dataList;
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
            changeEvaluate(val) {
                this.dimensionId = val;
            },
            sizeChangeHandler() {
                this.getThDimensionTypeScorePageList();
            },
            currentChangeHandler() {
                this.getThDimensionTypeScorePageList();
            }
        }
    }
</script>

<style lang="scss" scoped>
    .evaluate_info_wrap{
        .header{
            padding:12px;
            border-bottom: 1px solid #eee;
        }
        .evaluate_table_box{
            margin: 20px;
        }
    }
</style>
