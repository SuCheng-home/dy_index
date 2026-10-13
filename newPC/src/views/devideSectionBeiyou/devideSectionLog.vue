<template>
    <div class="read-statistics">
        <div class="header">
            <el-row>
                <el-col :span="19">
                    <term-grade-class-selector :queryArgs="queryArgs" ref="selector" v-model="obj"
                                               @input="getPriodClassStuZoneRecordPageListFunc()"></term-grade-class-selector>
                <el-select size="medium" v-model="gender" placeholder="请选择分区" @change="getPriodClassStuZoneRecordPageListFunc()">
                        <el-option :key="0" label="全部学生" :value="0"></el-option>
                        <el-option :key="1" label="男" :value="1"></el-option>
                        <el-option :key="2" label="女" :value="2"></el-option>
                    </el-select>
                    <a :href="exportUrl" target="_blank" download="导出结果" v-if="dataList.length">
                        <el-button type="primary" size="medium">导出</el-button>
                    </a>
                </el-col>
                <el-col :span="5">
                    <el-input size="medium" class="search-input" placeholder="请输入学生姓名" v-model.trim="searchName" @change="getList">
                        <el-button size="medium" slot="append" icon="el-icon-search" @click="getList"></el-button>
                    </el-input>
                </el-col>
            </el-row>
        </div>
        <el-table stripe :data="dataList" border :height="notbmaxH - 75" style="width: 100%" id="outTable">
            <el-table-column align="center" prop="stuName" label="姓名" show-overflow-tooltip>
            </el-table-column>
            <el-table-column align="center" label="性别" show-overflow-tooltip>
                <template slot-scope="scope">
                    {{scope.row.stuSex == 1 ? '男' : '女'}}
                </template>
            </el-table-column>
            <el-table-column align="center" label="所在班级" prop="className" show-overflow-tooltip>
            </el-table-column>
            <el-table-column align="center" label="班主任" prop="classHeaderName" show-overflow-tooltip>
            </el-table-column>
            <el-table-column align="center" label="所在分区" prop="zoneTypeName" show-overflow-tooltip>
            </el-table-column>
            <el-table-column align="center" label="选区日期(星期)" show-overflow-tooltip>
                <template slot-scope="scope">
                    {{scope.row.zoneDate}}&nbsp;&nbsp;{{scope.row.dayOfWeek}}
                </template>
            </el-table-column>
            <el-table-column align="center" label="进入分区时间" show-overflow-tooltip>
                <template slot-scope="scope">
                    {{scope.row.intoZoneTime | timeFilter}}
                </template>
            </el-table-column>
            <el-table-column align="center" label="离开分区时间" show-overflow-tooltip>
                <template slot-scope="scope">
                    {{scope.row.leaveZoneTime | timeFilter}}
                </template>
            </el-table-column>
            <el-table-column align="center" label="时长" show-overflow-tooltip>
                <template slot-scope="scope">
                    {{scope.row.duration}}
                </template>
            </el-table-column>
        </el-table>
        <div class="pagination-container">
            <el-pagination
                @size-change="getList" @current-change="getPriodClassStuZoneRecordPageListFunc"
                :current-page.sync="pagination.pageNo" :page-sizes="[10,20,30, 50]"
                :page-size.sync="pagination.pageSize" layout="total, sizes, prev, pager, next, jumper"
                :total="pagination.total">
            </el-pagination>
        </div>

    </div>
</template>
<script>
    import mixins from '@/mixins/windowResize';
    import baseMixin from '@/mixins/baseMixin';
    import {getPriodClassStuZoneRecordPageList} from '@/api/devideSectionBeiyou'
    import {
        isShowByRole
    } from "@/utils";
    import TermGradeClassSelector from '@/components/TermGradeClassSelector'

    export default {
        data() {
            return {
                gender: 0,
                obj: {
                    termId: '',
                    duration: [],
                    gradeId: '',
                    classId: ''
                },
                searchName: '',
                activeName: 'devideSectionLog',
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
        filters: {
            timeFilter(time) {
                return time ? time.slice(0, time.lastIndexOf(':')) : '';
            }
        },
        computed: {
            exportUrl() {
                return `${global.BasePath}structure/autonomyZone/exportStuZoneRecordXls?gender=${this.gender}&classId=${this.obj.classId}&gradeId=${this.obj.gradeId}&beginDate=${this.obj.duration[0]}&endDate=${this.obj.duration[1]}&schoolTimeId=${this.obj.termId}&searchName=${this.searchName}&token=${this.$store.getters.token}`;
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
            getList() {
                this.searchName = this.searchName.trim();
                this.pagination.pageNo = 1;
                this.getPriodClassStuZoneRecordPageListFunc();
            },
            getPriodClassStuZoneRecordPageListFunc() {
                if(!this.obj.classId || !this.obj.gradeId) {
                    this.dataList = [];
                    this.sectionList = [];
                    return undefined;
                }
                getPriodClassStuZoneRecordPageList({
                    gender: this.gender,
                    classId: this.obj.classId,
                    gradeId: this.obj.gradeId,
                    schoolTimeId: this.obj.termId,
                    beginDate: this.obj.duration[0],
                    endDate: this.obj.duration[1],
                    pageNo: this.pagination.pageNo,
                    pageSize: this.pagination.pageSize,
                    searchName: this.searchName
                })
                    .then(res => res.data)
                    .then(data => {
                        if (data.result) {
                            this.dataList = data.data.dataList;
                            this.pagination.total = data.data.pagination.total;
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
