<template>
    <div class="mental-education-publicity-comment">
        <el-row style="
        padding-bottom: 10px;
      ">   
            <el-col :span="19">
                  <el-button @click="$router.back()" size="medium">返回</el-button>
                <el-select class="el-select-short" size="medium" placeholder="请选择" v-model="form.gradeId"
                    @change="gradeIdEvent">
                    <el-option label="全部年级" :value="0"></el-option>
                    <el-option v-for="item in gradeList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                </el-select>
                <el-select class="el-select-short" size="medium" placeholder="请选择" v-model="form.classId"
                    @change="filterSearch">
                    <el-option label="全部班级" :value="0"></el-option>
                    <el-option v-for="item in classList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                </el-select>
                <el-select class="el-select-short" size="medium" placeholder="请选择" v-model="form.isRead"
                    @change="filterSearch">
                    <el-option label="全部阅读状态" :value="0"></el-option>
                    <el-option label="未阅读" :value="1"></el-option>
                    <el-option label="已阅读" :value="2"></el-option>

                </el-select>
            </el-col>
            <el-col :span="5">
                <el-input class="search-input" icon="el-icon-search" size="medium" placeholder="请输入学生姓名" clearable
                    v-model.trim="form.studentName" @change="handleUserName">
                    <el-button slot="append" icon="el-icon-search" @click="handleUserName"></el-button>
                </el-input>
            </el-col>
        </el-row>

        <el-table border fit stripe highlight-current-row style="width: 100%" :height="maxH - 15 - 10" :data="tabList"
            v-loading.body="tabLoading">
            <el-table-column align="center" label="学生学号" show-overflow-tooltip>
                <template slot-scope="scope">
                    {{ scope.row.studentNo || "--" }}
                </template>
            </el-table-column>
            <el-table-column align="center" label="学生姓名" show-overflow-tooltip>
                <template slot-scope="scope">
                    {{ scope.row.studentName || "--" }}
                </template>
            </el-table-column>
            <el-table-column align="center" label="学生班级" show-overflow-tooltip>
                <template slot-scope="scope">
                    {{ scope.row.className || "--" }}
                </template>
            </el-table-column>
            <el-table-column align="center" label="是否阅读" show-overflow-tooltip>
                <template slot-scope="scope">
                    {{ scope.row.isRead === 1 ? "未阅读" : "已阅读" }}
                </template>
            </el-table-column>
            <el-table-column align="center" label="阅读记录" show-overflow-tooltip>
                <template slot-scope="scope">
                    {{recordEvent(scope.row.parentList) || "--" }}
                </template>
            </el-table-column>
        </el-table>

        <el-pagination style="margin-top: 20px" layout="total, sizes, prev, pager, next, jumper"
            :current-page.sync="pagination.pageNo" :page-size="pagination.pageSize" :page-sizes="pagination.pageSizes"
            :total="pagination.total" @size-change="handleSizeChange"
            @current-change="handleCurrentChange"></el-pagination>
    </div>
</template>

<script>
import mixin from "@/mixins/windowResize";
import TermGradeClassSelector from "@/components/TermGradeClassSelector";
    import {
        queryDepartListTerm
    } from '@/api/common/common';
import { getHeartEduNoticeReadUserStList } from "@/api/homeSchool/mentalEducation/popularization/detail";
export default {
    name: "mentalEducationPopularizationView",
    mixins: [mixin],
    components: { TermGradeClassSelector },
   computed: {
            classList() {
                const gradeObj = this.allGradeClassList.find(gradeItem => gradeItem.id == this.form.gradeId);
                return gradeObj ? gradeObj.childList : [];
            }
        },
    filters: {
        filterDate(val) {
            return val ? moment(val).format("YYYY-MM-DD HH:mm:ss") : "--";
        },
    },
    data() {
        return {
            // 通知id
            noticeId: this.$route.query.noticeId,
            // 是否正在加载数据 { Boolean }
            tabLoading: false,
            // 表格数据 { Array }
            tabList: [],
            // 分页
            pagination: {
                pageNo: 1,
                pageSize: 20,
                pageSizes: [10, 20, 30, 50],
                total: 0,
            },
            // 请求表单
            form: {
                studentName: "",
                classId: 0,
                gradeId: 0,
                isRead: 0
            },
             queryArgs: {
                    all: true, //所有班级年级
                    manager: false, //班主任
                    notlimit: true, //所有班级年级
                    submanager: false, //副班主任
                    teacher: false //普通所交
                },
                gradeList: [],
                allGradeClassList: []
        };
    },
    created() {
        this.getHeartEduNoticeReadUserStList();
        queryDepartListTerm(Object.assign({}, {
            currentTerm: true,
            termId: this.$route.query.schoolTimeId
        }, this.queryArgs))
            .then(res => res.data)
            .then(data => {
                console.log('queryDepartListTerm', data);
                const pageData = data.data || [];
                this.allGradeClassList = pageData || [];
                this.gradeList = pageData || [];
                  console.log('queryDepartListTerm2',  this.gradeList);
            })

    },
    methods: {
        gradeIdEvent() {
            this.form.classId = 0;
            this.filterSearch();
        },
        getHeartEduNoticeReadUserStList() {
            getHeartEduNoticeReadUserStList({
                noticeId: this.noticeId,
                studentName: this.form.studentName,
                pageNo: this.pagination.pageNo,
                pageSize: this.pagination.pageSize,
                classId: this.form.classId,
                gradeId: this.form.gradeId,
                isRead: this.form.isRead
            })
                .then((res) => {
                    let _res = res.data;
                    if (_res.code != 200) return Promise.reject(_res.msg);
                    else return _res.data;
                })
                .then((data) => {
                    let { dataList, pagination } = data;
                    this.tabList = [...dataList];
                    this.pagination.total = pagination.total;
                })
                .catch((msg) => {
                    this.$message({
                        message: msg,
                        type: "error",
                    });
                });
        },
        // 检索条件 改变
        filterSearch() {
            this.pagination.pageNo = 1;
            this.getHeartEduNoticeReadUserStList();
        },
        // 主题改变
        handleUserName() {
            this.filterSearch();
        },
        // 分页 - pageSize 改变
        handleSizeChange(pageSize) {
            this.pagination.pageSize = pageSize;
            this.getHeartEduNoticeReadUserStList();
        },
        // 分页 - currentPage 改变
        handleCurrentChange(pageNo) {
            this.pagination.pageNo = pageNo;
            this.getHeartEduNoticeReadUserStList();
        },
        recordEvent(val) {
            //        avatar	头像	string	
            // id		number	
            // isRead	状态1代表未读，2代表已读	number	
            // isRraise	是否点赞1未点赞，2，已经点赞	number	
            // nick	昵称	string	
            // noticeId	通知id	number	
            // raiseTime	点赞时间	string	
            // readTime	阅读时间	string	
            // studentId	学生id	number	
            // userId	用户id	number	
            // userName	用户姓名	string
            //val是数组 每个元素是一个对象 isRead是2代表已读返回该对象里面的 userName（readTime），用逗号拼接 最后一个不用逗号
            
            let str = "";
            val.forEach((item,index) => {
                if (item.isRead == 2) {
                    str += item.nick + "(" + item.readTime + ")";
                    if(index!=val.length-1){
                        str += ",";
                    }
                }
            })
            return str;
        }
    },
};
</script>
<style lang="scss" scoped>
.mental-education-publicity-comment {
    padding: 12px;

    .el-table__body-wrapper {
        .delete-btn {
            color: #f56c6c;
        }
    }
}
</style>
