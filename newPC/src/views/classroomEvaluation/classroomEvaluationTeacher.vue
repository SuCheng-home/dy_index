<template>
    <div class="classroomEvaluationTeacher">
        <div class="header">
            <el-select size="medium" v-model="schoolTimeCode" placeholder="请选择学期" @change="changeSchool()">
                <el-option v-for="item in schoolYearList" :key="item.id" :label="item.schoolTimeName"
                           :value="item.id"></el-option>
            </el-select>
            <el-date-picker
                size="medium"
                v-model="daterange"
                type="daterange" class="mywidthdaterange"
                range-separator="-"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                @change="timechange()"
                :clearable="false"
            >
            </el-date-picker>
            <el-select class="filter-item" size="medium" v-model="currId" placeholder="请选择科目"
                       @change="changecurr()">
                <el-option label="全部科目" :value="0"></el-option>
                <el-option v-for="item in Courselist" :key="item.id" :label="item.name"
                           :value="item.id"></el-option>
            </el-select>
            <el-button type="primary" size="medium" @click="exportExcel('#outTable', `课堂评价统计(老师).xlsx`)"
                         v-if="datalist.length>0">导出
            </el-button>
        </div>
        <div class="schoolWrap scrollStyle" id="outTable">
            <el-table :data="datalist" border stripe :height="nobottommaxH">
                <el-table-column sortable prop="teacherUserName" label="姓名" align="center"
                                 min-width="100"></el-table-column>
                <el-table-column sortable prop="departName" label="所在部门" align="center"
                                 min-width="100"></el-table-column>
                <el-table-column sortable prop="sectionNoCount" label="课时数" align="center"
                                 min-width="100"></el-table-column>
                <el-table-column sortable prop="totalCount" label="评价次数" align="center"
                                 min-width="100"></el-table-column>
                <el-table-column sortable prop="addCount" label="加分次数" align="center"
                                 min-width="100"></el-table-column>
                <el-table-column sortable prop="lessCount" label="扣分次数" align="center"
                                 min-width="100"></el-table-column>
            </el-table>
        </div>
    </div>
</template>
<script>
    import mixins from '@/mixins/windowResize';
    import baseMixin from '@/mixins/baseMixin';
    import {getSchoolTimeAllList, teacherBehaviorStuScore, queryCourseListTerm} from '@/api/classroomEvaluation';

    export default {
        data() {
            return {
                isCurrent: '0',
                schoolName: '',
                schoolTimeCode: '',
                classId: '',
                currId: '',
                schoolYearList: [],
                startDate: '',
                endDate: '',
                Courselist: [],
                datalist: [],
                daterange: ['', '']
            }
        },
        created() {
            //学期列表
            getSchoolTimeAllList().then(res => res.data)
                .then(data => {
                    if (data.code === 200) {
                        this.schoolYearList = data.data;
                        this.schoolYearList.forEach(item => {
                            if (item.isCurrent == 1) {
                                this.schoolName = item.schoolTimeName,
                                    this.schoolTimeCode = item.id;
                                this.startDate = item.startDate;
                                this.isCurrent = 1;
                                this.endDate = this.$moment().format('YYYY-MM-DD');
                                this.queryCourseListTerms();
                                this.daterange = [this.startDate, this.endDate];
                            }
                        })
                    }
                })
        },
        mixins: [mixins, baseMixin],
        methods: {
            //选择时间
            timechange() {
                this.dataList = [];
                this.classBehEvalCurrBehTypeStuScores();
            },
            //切换学期
            changeSchool() {
                let schoolItem = '';
                for (let i = 0; i < this.schoolYearList.length; i++) {
                    if (this.schoolYearList[i].id == this.schoolTimeCode) {
                        schoolItem = this.schoolYearList[i]
                    }
                }
                this.startDate = schoolItem.startDate;
                if (schoolItem.isCurrent == 1) {
                    this.endDate = this.$moment().format('YYYY-MM-DD');
                    this.isCurrent = 1;
                } else {
                    this.endDate = schoolItem.endDate;
                    this.isCurrent = 0;
                }
                this.queryCourseListTerms();
            },
            //切换科目
            changecurr() {
                this.classBehEvalCurrBehTypeStuScores();

            },
            //科目列表
            queryCourseListTerms() {
                this.currId = '';
                this.Courselist = [];
                let schoolItem = {};
                for (let i = 0; i < this.schoolYearList.length; i++) {
                    if (this.schoolYearList[i].id == this.schoolTimeCode) {
                        schoolItem = this.schoolYearList[i]
                    }
                }
                queryCourseListTerm({
                    classId: 0, currentTerm: schoolItem.isCurrent == 1, school: true, termId: this.schoolTimeCode
                }).then(res => res.data).then(data => {
                    if (data.code === 200) {
                        this.Courselist = data.data;
                        this.currId = 0;
                        this.dataList = [];
                        this.behaviorTypeList = [];
                        this.classBehEvalCurrBehTypeStuScores();
                    }
                })
            },
            //获取列表
            classBehEvalCurrBehTypeStuScores() {
                this.datalist = [];
                this.startDate = this.$moment(this.daterange[0]).format('YYYY-MM-DD'); //时间
                this.endDate = this.$moment(this.daterange[1]).format('YYYY-MM-DD'); //时间
                teacherBehaviorStuScore(this.currId, this.schoolTimeCode, this.startDate, this.endDate).then(res => res.data).then(data => {
                    if (data.code === 200) {
                        this.datalist = data.data.behaviorThList;
                    }
                })
            }

        }
    }
</script>
<style scoped>
    .el-range-editor--medium .el-range-separator {
        width: 30px;
    }
</style>
<style lang="scss" scoped>
    .classroomEvaluationTeacher {
        padding: 12px;
        box-sizing: border-box;
        font-size: 14px;

        .el-date-editor.el-input, .el-date-editor.el-input__inner {
            width: 240px;
        }

        .el-select {
            width: 175px;
        }

        .red {
            color: #f56c6c;
        }

        .green {
            color: #67c23a;
        }

        .header {
            padding-bottom: 10px;

        }

        .schoolWrap {
            overflow-x: hidden;
            overflow-y: auto;
            box-sizing: border-box;

            .title {
                line-height: 34px;
                height: 34px;

                .square {
                    display: inline-block;
                    width: 10px;
                    height: 10px;
                    background: #ACD6FF;
                    margin: 15px 8px 0 0;
                }
            }

            .text {
                padding-left: 18px;
                box-sizing: border-box;

                h3 {
                    font-size: 16px;
                }

            }
        }
    }
</style>

