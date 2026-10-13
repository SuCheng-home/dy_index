<template>
    <div class="app-container calendar-list-container">
        <div class="header">
            <el-row>
                <el-col :span="21">
                    <el-button @click="$router.back()" type="default" size="medium">返回</el-button>
                    <term-grade-class-selector :queryArgs="queryArgs" @input="getReadIndependBookStatisticalListFunc()" v-model="obj"></term-grade-class-selector>
                    <el-select
                        v-model="bookType"
                        placeholder="请选择"
                        size="medium"  style="width:120px"
                    >
                        <el-option label="全部书籍类型" :value="0"></el-option>
                        <el-option
                            v-for="item in bookTypeList"
                            :key="item.code"
                            :label="item.value"
                            :value="item.code"
                        ></el-option>
                    </el-select>
                    <el-button
                        class="header-buttom"
                        size="medium"
                        type="primary" 
                        @click="exportExcel('#outTable', `阅读统计表.xlsx`)"
                    >导出
                    </el-button>
                </el-col>
                <el-col :span="3">
                    <el-input
                        placeholder="请输入"
                        v-model.trim="bookName"
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
        <el-table v-loading="loading" stripe :data="statisticsList.filter(item => bookType == 0 || item.bookTypeId == bookType )" border :height="maxH " style="width: 100%" id="outTable">
            <el-table-column align="center" prop="bookName" label="书籍名称" show-overflow-tooltip>
                <template slot-scope="scope">
                     <button v-if="scope.row.totalCount" type="button" class="el-button el-button--text el-button--small"
                            @click="bookAccountingtwo(scope.row.bookId)">{{scope.row.bookName}}
                    </button>
                    <span v-else>{{scope.row.bookName}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="书籍类型" show-overflow-tooltip>
                <template slot-scope="scope">
                    <span>{{scope.row.bookTypeName}}</span>
                </template>
            </el-table-column>
            <el-table-column v-for="(item, index) in wayList" :key="index" :label="item.wayTypeName" prop="">
                <template slot-scope="scope">
                    {{scope.row.strList[index] ? scope.row.strList[index] : "0"}}
                </template>
            </el-table-column>
            <el-table-column align="center" label="总数" prop="totalCount">
                <template slot-scope="scope">
                    <template>
                        <span>{{scope.row.totalCount}}</span>
                    </template>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>
<script>
    import mixins from '@/mixins/windowResize';
    import baseMixin from '@/mixins/baseMixin';
    import {
        getReadIndependBookStatisticalList,
    } from '@/api/readBookBeiyou';
    import {
        findSchoolDicsByCode
    } from '@/api/common/common';
    import {isShowByPermission} from "@/utils";
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
                activeName: 'readStatistics',
                statisticsList: [],
                wayList: [],
                bookName: '',
                searchLoading: false,
                loading: true,
                queryArgs: {
                    all: true,
                    manager: false,
                    notlimit: true,
                    submanager: false,
                    teacher: false
                },
                bookTypeList: [],
                bookType: 0
            }
        },
        mixins: [mixins, baseMixin],
        components: {TermGradeClassSelector},
        mounted() {
            findSchoolDicsByCode({
                dicCode: 'readIndependBookType'
            })
                .then(res => res.data)
                .then(data => {
                    this.bookTypeList = data.data;
                });
            // 先请求权限在请求学期在请求年级之后再能去获取列表数据
            if(!isShowByPermission('/readIndepend/thMamger')) {
                this.queryArgs = {
                    all: false,
                    manager: false,
                    notlimit: false,
                    submanager: false,
                    teacher: true
                }
            }
            const objStr  = window.sessionStorage.getItem('bookAccountingObj');
            if(objStr) {
                window.sessionStorage.setItem('bookAccountingObj', '');
                const obj = JSON.parse(objStr);
                setTimeout(() => {
                    this.obj = obj;
                    this.getReadIndependBookStatisticalListFunc();
                }, 300);
            }

        },
        methods: {
            isShowByPermission,
            jumpToPage(path, query = {}) {
                this.$router.push({
                    path,
                    query
                })
            },
            bookAccountingtwo(bookId){
                this.$router.push({
                    path:'bookAccountingtwo',
                    query:{
                        classId: this.obj.classId,
                        gradeId: this.obj.gradeId,
                        startDate: this.obj.duration[0],
                        endDate: this.obj.duration[1],
                        schoolTimeId: this.obj.termId,
                        bookId:bookId
                    }
                })
            },
            getReadIndependBookStatisticalListFunc() {
                this.bookType = 0;
                if(!this.obj.classId || !this.obj.gradeId) {
                    this.statisticsList = [];
                    this.wayList = [];
                    return undefined;
                }
                getReadIndependBookStatisticalList({
                    classId: this.obj.classId,
                    gradeId: this.obj.gradeId,
                    startDate: this.obj.duration[0],
                    endDate: this.obj.duration[1],
                    schoolTimeId: this.obj.termId,
                    bookName: this.bookName,
                })
                    .then(res => res.data)
                    .then(data => {
                    if (data.result) {
                        this.loading = false;
                        this.statisticsList = data.data.bookList;
                        this.wayList = data.data.wayList
                    } else {
                        this.$message.warning(data.msg);
                    }
                })
            },
            // 点击tab
            clickTab() {
                if (this.activeName === 'readBookList') {
                    this.$router.replace({path: 'readBookList'})
                }
            },
            // 点击搜索
            clickSearch() {
                this.getReadIndependBookStatisticalListFunc()
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
