<template>
    <div class="read-statistics">
        <div class="header">
            <el-row>
                <el-col :span="19">
                    <term-grade-class-selector :queryArgs="queryArgs" ref="selector" v-model="obj"
                                               @input="getPriodClassStuDurationDataListFunc()"></term-grade-class-selector>
                    <a :href="exportUrl" target="_blank" download="导出结果" v-if="dataList.length">
                        <el-button type="primary" size="medium">导出</el-button>
                    </a>
                </el-col>
            </el-row>
        </div>
        <el-table stripe :data="dataList" border :height="notbmaxH - 28" style="width: 100%" id="outTable">
            <el-table-column align="center" prop="stuName" label="姓名" show-overflow-tooltip>
            </el-table-column>
            <el-table-column align="center" label="性别" show-overflow-tooltip>
                <template slot-scope="scope">
                    {{scope.row.isSummary ? '' : (scope.row.stuSex == 1 ? '男' : '女')}}
                </template>
            </el-table-column>
            <el-table-column v-for="(item, index) in sectionList" :key="index" :label="item" prop="">
                <template slot-scope="scope">
                    {{scope.row.staticsList[index].duration ? scope.row.staticsList[index].duration : "0"}}
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>
<script>
    import mixins from '@/mixins/windowResize';
    import baseMixin from '@/mixins/baseMixin';
    import {getPriodClassStuDurationDataList} from '@/api/devideSectionBeiyou'
    import {
        isShowByRole
    } from "@/utils";
    import TermGradeClassSelector from '@/components/TermGradeClassSelector'

    export default {
        data() {
            return {
                obj: {
                    termId: '',
                    duration: [],
                    gradeId: '',
                    classId: ''
                },
                activeName: 'devideSectionDurationAccounting',
                dataList: [],
                sectionList: [],
                queryArgs: {
                    all: true,
                    manager: false,
                    notlimit: true,
                    submanager: false,
                    teacher: false
                }
            }
        },
        mixins: [mixins, baseMixin],
        components: {TermGradeClassSelector},
        computed: {
            exportUrl() {
                return `${global.BasePath}structure/autonomyZone/exportClassStuZoneDurationXls?classId=${this.obj.classId}&gradeId=${this.obj.gradeId}&beginDate=${this.obj.duration[0]}&endDate=${this.obj.duration[1]}&schoolTimeId=${this.obj.termId}&token=${this.$store.getters.token}`;
            }
        },
        mounted() {
            if(!isShowByRole(20210705)) {
                this.queryArgs = {
                    all: false,
                    manager: false,
                    notlimit: false,
                    submanager: false,
                    teacher: true
                }
            }

        },
        methods: {
            jumpToPage(path, query = {}) {
                this.$router.push({
                    path,
                    query
                })
            },
            getPriodClassStuDurationDataListFunc() {
                if(!this.obj.classId || !this.obj.gradeId) {
                    this.dataList = [];
                    this.sectionList = [];
                    return undefined;
                }
                getPriodClassStuDurationDataList({
                    classId: this.obj.classId,
                    gradeId: this.obj.gradeId,
                    schoolTimeId: this.obj.termId,
                    beginDate: this.obj.duration[0],
                    endDate: this.obj.duration[1]
                })
                    .then(res => res.data)
                    .then(data => {
                        if (data.result) {
                            const dataList = data.data.classStuZoneDataList;
                            if (data.data.classStuZoneDataList && data.data.classStuZoneDataList.length !== 0) {
                                this.sectionList = data.data.classStuZoneDataList[0].staticsList.map(item => item.zoneTypeName);
                            }
                            const staticsList = [];
                            data.data.allZoneDataList.forEach(item => {
                                staticsList.push({duration: item.duration});
                            });
                            dataList.push({
                                stuName: '总计',
                                isSummary: true,
                                staticsList
                            });
                            this.dataList = dataList;
                        } else {
                            this.$message.warning(data.msg);
                        }
                    })
            },
            // 点击搜索
            clickSearch() {
                this.getPriodClassStuDurationDataListFunc()
            },
            // 点击学生
            clickStudent(data) {
                if (!data.totalCount && data.totalCount === 0) {
                    this.$message.warning('还没有阅读数据哦！！！');
                    return undefined;
                }
                this.$router.push({
                    path: 'staticStudentDetail', query: {
                        term: this.term,
                        studentId: data.studentId,
                        month: this.month,
                        gradeId: this.grade
                    }
                })
            },

        },
    }
</script>
<style lang="scss" scoped>
    .read-statistics {
        padding: 12px;
    }

    .header {
        padding-bottom: 10px;
    }

    .header-buttom {
        margin-bottom: 10px;
    }

    .el-table th.gutter {
        display: table-cell !important;
    }
</style>
