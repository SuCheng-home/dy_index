<template>
    <div class="mental-education-contribution-index">
        <div class="mental-education-publicity-index">
            <el-row style="padding-bottom: 10px">
                <el-col :span="19">
                    <el-select class="filter-item" style="width:200px" size="medium" v-model="form.schoolTimeId"
                        placeholder="请选择学期" @change="getGradeByTermIds()">
                        <el-option v-for="item in schoolTimelist" :key="item.id" :label="item.schoolTimeName"
                            :value="item.id"></el-option>
                    </el-select>

                    <el-select v-if="(!myisclass) && classList.length" style="width:200px" size="medium"
                        v-model="form.classId" placeholder="请选择班级" @change="filterSearch()">
                        <el-option v-for="item in classList" :key="item.departId" :label="item.clazzName"
                            :value="item.departId">
                        </el-option>
                    </el-select>
                    <a :href="exportUrl" v-if="tabList.length" target="_blank" download="examName">
                        <el-button type="primary" size="medium">导出</el-button>
                    </a>
                </el-col>

                <el-col :span="5">
                    <el-input class="search-input" icon="el-icon-search" size="medium" placeholder="请输入主题" clearable
                        v-model.trim="form.title" @change="filterSearch">
                        <el-button slot="append" icon="el-icon-search" @click="filterSearch"></el-button>
                    </el-input>
                </el-col>
            </el-row>
            <el-table border fit stripe highlight-current-row style="width: 100%" :height="nobottommaxH - 25"
                :data="tabList" v-loading.body="tabLoading">
                <el-table-column align="center" label="主题" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <el-button type="text" @click="toDetail(scope.row)">{{ scope.row.title || "--" }}</el-button>

                    </template>
                </el-table-column>
                 <el-table-column align="center" label="班级" show-overflow-tooltip>
                    <template slot-scope="scope">
                        {{ scope.row.className || "--" }}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="推荐人" show-overflow-tooltip>
                    <template slot-scope="scope">
                        {{ scope.row.createUserName || "--" }}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="推荐内容" show-overflow-tooltip>
                    <template slot-scope="scope">
                        {{ scope.row.content || "--" }}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="状态" show-overflow-tooltip>
                    <template slot-scope="scope">

                        <span v-if="scope.row.state == 1" class="state-1">待采纳</span>
                        <span v-else class="state-2">已采纳</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="操作" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <el-button type="primary" size="mini" @click="acceptVolunteer(scope.row)" v-if="scope.row.state == 1">采纳</el-button>

                        <el-button type="danger" size="mini" @click="deleteVolunteer(scope.row)">删除</el-button>

                    </template>
                </el-table-column>

            </el-table>

            <el-pagination style="margin-top: 20px" layout="total, sizes, prev, pager, next, jumper"
                :current-page.sync="pagination.pageNo" :page-size="pagination.pageSize"
                :page-sizes="pagination.pageSizes" :total="pagination.total" @size-change="handleSizeChange"
                @current-change="handleCurrentChange"></el-pagination>
        </div>

    </div>
</template>

<script>
import mixin from '@/mixins/windowResize';
import { isShowByPermission } from "@/utils";
import { mapGetters } from "vuex";
import {
    getSchoolTimeAllList,
    possessRole, getGradeByTermId, getClassByGradeId,

} from "@/api/growthArchives";
import {
    getHeartVolunteerDarkList, updateHeartVolunteerDark, delHeartVolunteerDark
} from "@/api/homeSchool/mentalEducation/volunteer/index";

export default {
    name: "volunteerStatistics",
    components: {},
    mixins: [
        mixin
    ],
    computed: {
        ...mapGetters(["userInfo", "schoolInfo"])
    },
    filters: {
        filterDate(val) {
            return val ? moment(val).format("YYYY-MM-DD HH:mm:ss") : "--";
        },
    },
    data() {
        return {
            exportUrl: '',
            // 是否正在加载数据 { Boolean }
            tabLoading: false,
            // 表格数据 { Array }
            tabList: [],
            // 分页
            pagination: {
                pageNo: 1,
                pageSize: 10,
                pageSizes: [10, 20, 30, 50],
                total: 20,
            },
            // 请求表单
            form: {
                classId: 0,//	班级id		
                gradeId: 0,//	年级id		
                state: 0,//		
                schoolTimeId: '',//	学期id		
                title: '',//	学生姓名	
            },
            schoolTimeList: [],
            classList: [],
            myisclass: false,
            gradeList: []
        };
    },
    async created() {

        await this.getSchoolTimeAllListEvent()
    },
    mounted() {
        this.getContributionList();
    },
    methods: {
        isShowByPermission,
        // 查询学校所有学期列表
        async getSchoolTimeAllListEvent() {
            getSchoolTimeAllList()
                .then(res => {
                    for (let item of res.data.data) {
                        if (item.isCurrent == 1) {
                            this.form.schoolTimeId = item.id;
                        }
                    }
                    this.schoolTimelist = res.data.data;
                    //拿全部年级班级
                    possessRole('2').then(res => {
                        this.myisclass = res.data.data.result;
                        this.getGradeByTermIds();
                    });
                })
                .catch(err => { });
        },
        // 获取志愿服务列表统计
        getContributionList() {
            this.exportUrl = `${global.BasePath}structure/heartEdu/exportHeartVolunteerDarkList?&classId=${this.form.classId}&schoolTimeId=${this.form.schoolTimeId}&gradeId=${this.form.gradeId}&title=${this.form.title}&state=${this.form.state}&token=${this.$store.getters.token}`;
            getHeartVolunteerDarkList({
                ...this.form,
                pageNo: this.pagination.pageNo,
                pageSize: this.pagination.pageSize,
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
        //获取年级
        getGradeByTermIds() {
            if (this.myisclass) {
                getGradeByTermId(this.schoolInfo.id, this.form.schoolTimeId).then(res => res.data).then(data => {
                    this.gradeList = data.data;
                    this.getClassByGradeIds();
                });
            }

        },
        //获取班级
        getClassByGradeIds() {
            this.form.classId = 0
            if (this.form.gradeId != 0) {
                getClassByGradeId(this.schoolInfo.id, this.form.schoolTimeId, this.form.gradeId).then(res => res.data).then(data => {
                    this.classList = data.data;

                });
            } else {
                this.classList = []
            }
            this.filterSearch();

        },
        //采纳志愿服务
        acceptVolunteer(row) {
            // 确认采纳
            this.$confirm('确认采纳该志愿服务吗？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                updateHeartVolunteerDark({
                    id: row.id,
                    state: 2,
                }).then(data => {
                    this.$message({
                        message: "采纳成功",
                        type: "success",
                    });
                    this.getContributionList();
                }).catch(msg => {
                    this.$message({
                        message: msg,
                        type: "error",
                    });
                });
            })
        },
        //删除志愿服务
        deleteVolunteer(row) {
            // 确认采纳
            this.$confirm('确认删除该志愿服务吗？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                delHeartVolunteerDark({
                    darkId: row.id
                }).then(data => {
                    this.$message({
                        message: "删除成功",
                        type: "success",
                    });
                    this.getContributionList();
                })
            })
        },
        // 跳转详情页
        toDetail(row) {
            this.$router.push({
                path: '/main/homeSchool/mentalEducation/volunteer/volunteerRecommendationDetail',
                query: {
                    darkId: row.id,
                }
            })
        },
        // 检索条件 改变
        filterSearch() {
            this.pagination.pageNo = 1;
            this.getContributionList();
        },

        // 分页 - pageSize 改变
        handleSizeChange(pageSize) {
            this.pagination.pageSize = pageSize;
            this.getContributionList();
        },
        // 分页 - currentPage 改变
        handleCurrentChange(pageNo) {
            this.pagination.pageNo = pageNo;
            this.getContributionList();
        },



    },
};
</script>
<style lang="scss" scoped>
.mental-education-contribution-index {
    padding: 12px;

    .mental-education-publicity-index {
        .filter-wrapper {
            margin-bottom: 10px;
        }

        .el-table__body-wrapper {
            .delete-btn {
                color: #f56c6c;
            }
        }
    }
}

.state-1 {
    color: #409eff;
}

.state-2 {
    color: #67c23a;
}
</style>