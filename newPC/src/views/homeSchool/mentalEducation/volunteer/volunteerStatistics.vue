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
                    <el-select v-if="myisclass" style="width:200px" size="medium" v-model="form.gradeId"
                        placeholder="请选择年级" @change="getClassByGradeIds()">
                        <el-option label="全部年级" :value="0">
                        </el-option>
                        <el-option v-for="item in gradeList" :key="item.id" :label="item.name" :value="item.id">
                        </el-option>
                    </el-select>
                    <el-select size="medium" style="width:200px" v-model="form.classId" placeholder="请选择班级"
                        @change="filterSearch()" v-if="myisclass && form.gradeId">
                        <el-option label="全部班级" :value="0"></el-option>
                        <el-option v-for="item in classList" :key="item.id" :label="item.name" :value="item.id">
                        </el-option>
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
                    <el-button type="primary" size="medium" @click="gotoDetail">志愿明细</el-button>
                </el-col>

                <el-col :span="5">
                    <el-input class="search-input" icon="el-icon-search" size="medium" placeholder="请输入姓名" clearable
                        v-model.trim="form.title" @change="filterSearch">
                        <el-button slot="append" icon="el-icon-search" @click="filterSearch"></el-button>
                    </el-input>
                </el-col>
            </el-row>
            <el-table border fit stripe highlight-current-row style="width: 100%" :height="nobottommaxH - 25"
                :data="tabList" v-loading.body="tabLoading">
                <el-table-column align="center" label="学号" show-overflow-tooltip>
                    <template slot-scope="scope">
                        {{ scope.row.studentNo || "--" }}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="姓名" show-overflow-tooltip>
                    <template slot-scope="scope">
                        {{ scope.row.studentName || "--" }}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="班级" show-overflow-tooltip>
                    <template slot-scope="scope">
                        {{ scope.row.className || "--" }}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="志愿服务次数" show-overflow-tooltip>
                    <template slot-scope="scope">
                        {{ scope.row.volunteerCount || "--" }}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="服务时长(分钟)" show-overflow-tooltip>
                    <template slot-scope="scope">
                        {{ scope.row.timeLength || "--" }}
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
    possessRole, getGradeByTermId, getClassByGradeId
} from "@/api/growthArchives";
import {
    getHeartVolunteerListStatic, getHeartVolunteerInit
} from "@/api/homeSchool/mentalEducation/volunteer/index";

export default {
    name: "volunteerStatistics",
    components: {},
    computed: {
        ...mapGetters(["userInfo", "schoolInfo"])
    },
    mixins: [
        mixin
    ],
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
                isAddCreateType: 0,//	参与人员类型 3 家长 2 学生		
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
        const { data } = await getHeartVolunteerInit({})
        this.form.isAddCreateType = data.data.isAddCreateType
        await this.getSchoolTimeAllListEvent()
    },
    mounted() {

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
            this.exportUrl = `${global.BasePath}structure/heartEdu/exportHeartVolunteerListStatic?&classId=${this.form.classId}&schoolTimeId=${this.form.schoolTimeId}&gradeId=${this.form.gradeId}&title=${this.form.title}&isAddCreateType=${this.form.isAddCreateType}&token=${this.$store.getters.token}`;
            getHeartVolunteerListStatic({
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
        // 跳转详情页

        gotoDetail() {
            this.$router.push({
                path: '/main/homeSchool/mentalEducation/volunteer/volunteerList',

            })
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
</style>