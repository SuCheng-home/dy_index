<template>
    <div class="read-statistics">
        <div class="header">
            <el-row>
                <el-col :span="19">
                    <term-grade-class-selector :queryArgs="queryArgs" ref="selector" v-model="obj"
                                               @input="getListData()"></term-grade-class-selector>
                    <el-button
                        class="header-buttom"
                        size="medium"
                        type="primary"
                        @click="exportExcel('#outTable', `阅读统计表.xlsx`)"
                    >导出
                    </el-button>
                    <a :href="exportUrl" target="_blank" download="examName">
                        <el-button type="primary" size="medium">导出明细</el-button>
                    </a>
                    <el-button
                        class="header-buttom"
                        size="medium"
                        type="primary"
                        @click="toBookAccounting()"
                    >书籍统计
                    </el-button>
                    <el-button
                        class="header-buttom"
                        size="medium"
                        type="primary"
                        @click="openPreview()"
                    >大屏统计
                    </el-button>
                </el-col>
                <el-col :span="5">
                    <el-input
                        placeholder="请输入学生姓名"
                        v-model.trim="studentName"
                        size="medium"
                        @keyup.enter.native="clickSearch"
                    >
                        <el-button
                            slot="append"
                            icon="el-icon-search"
                            @click="clickSearch"
                            :loading="searchLoading"
                        ></el-button>
                    </el-input>
                </el-col>
            </el-row>
        </div>
        <el-table stripe :data="statisticsList" border :height="maxH" style="width: 100%" id="outTable">
            <el-table-column align="center" prop="studentName" label="学生姓名" show-overflow-tooltip>
                <template slot-scope="scope">
                    <button type="button" class="el-button el-button--text el-button--small"
                            @click="jumpToPage('staticStudentDetail',
                                    {schoolTimeId: obj.termId, classId: obj.classId, startDate: obj.duration[0], endDate: obj.duration[1], studentId: scope.row.studentId
                                })">{{scope.row.studentName}}
                    </button>
                </template>
            </el-table-column>
            <el-table-column align="center" label="所在班级" show-overflow-tooltip>
                <template>
                    {{className}}
                </template>
            </el-table-column>
            <el-table-column v-for="(item, index) in wayList" :key="index" :label="item.wayTypeName" prop="">
                <template slot-scope="scope">
                    {{scope.row.strList[index] ? scope.row.strList[index] : "0"}}
                </template>
            </el-table-column>
            <el-table-column align="center" label="总数" prop="totalCount">
                <template slot-scope="scope">
                    <span v-if="scope.row.totalCount == 0">0</span>
                    <button v-else type="button" class="el-button el-button--text el-button--small"
                            @click="jumpToPage('staticCountDetailtwo',
                                    {studentName:scope.row.studentName,schoolTimeId: obj.termId, startDate: obj.duration[0], endDate: obj.duration[1], studentId: scope.row.studentId,classId:obj.classId,gradeId:obj.gradeId,batchId:0,totalCount:scope.row.totalCount
                                })">{{scope.row.totalCount}}
                    </button>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>
<script>
    import {mapGetters} from 'vuex';
    import mixins from '@/mixins/windowResize';
    import baseMixin from '@/mixins/baseMixin';
    import {getReadIndependStuStatisticalList} from '@/api/readBookBeiyou';

    import {isShowByPermission} from "@/utils";
    import TermGradeClassSelector from '@/components/TermGradeClassSelector'

    export default {
        data() {
            return {
                obj: {
                    termId: '',
                    duration: []
                },
                statisticsList: [],
                wayList: [],
                studentName: '',
                searchLoading: false,
                className: '',
                queryArgs: {
                    all: true,
                    manager: false,
                    notlimit: true,
                    submanager: false,
                    teacher: false
                },
            }
        },
        mixins: [mixins, baseMixin],
        components: {TermGradeClassSelector},
        computed: {
            exportUrl() {
                return `${global.BasePath}structure/readIndepend/exportReadIndependStuRecordList2?classId=${this.obj.classId}&gradeId=${this.obj.gradeId}&className=${this.className}&startDate=${this.obj.duration[0]}&endDate=${this.obj.duration[1]}&schoolTimeId=${this.obj.termId}&token=${this.$store.getters.token}`;
            },
            ...mapGetters(['schoolInfo'])
        },
        mounted() {

            if(!isShowByPermission('/readIndepend/thMamger')) {
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
            isShowByPermission,
            toBookAccounting() {
                window.sessionStorage.setItem('bookAccountingObj', JSON.stringify(this.obj));
                this.jumpToPage('bookAccounting');
            },
            openPreview() {
                window.open(`${location.href.split('#')[0]}#/readBookBeiyouDisplay?schoolId=${this.schoolInfo.id}&classId=${this.obj.classId}`, "newW", 'height=1080, width=1920, top=0, left=0, toolbar=no, menubar=no,' +
                    'scrollbars=no,resizable=no, location=no, status=no')
            },
            jumpToPage(path, query = {}) {
                this.$router.push({
                    path,
                    query
                })
            },
            getListData() {
                if(!this.obj.classId || !this.obj.gradeId) {
                    this.statisticsList = [];
                    this.wayList = [];
                    return undefined;
                }
                this.className = this.$refs.selector.getClassName();
                getReadIndependStuStatisticalList({
                    classId: this.obj.classId,
                    gradeId: this.obj.gradeId,
                    schoolTimeId: this.obj.termId,
                    startDate: this.obj.duration[0],
                    endDate: this.obj.duration[1],
                    studentName: this.studentName
                })
                    .then(res => res.data)
                    .then(data => {
                        if (data.result) {
                            this.statisticsList = data.data.stuList;
                            this.wayList = data.data.wayList
                        } else {
                            this.$message.warning(data.msg);
                        }
                    })
            },
            // 点击搜索
            clickSearch() {
                this.getListData()
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
    .header-buttom {
        margin-bottom: 10px;
    }

    .el-table th.gutter {
        display: table-cell !important;
    }
</style>
