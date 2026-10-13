<template>
    <div class="mental-education-contribution-index">
        <div class="mental-education-publicity-index">
            <el-row style="padding-bottom: 10px">
                <el-col :span="19">
                    <el-button @click="$router.back()" size="medium">返回</el-button>
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
                    <el-select style="width:200px" size="medium" v-model="form.departGroupId" placeholder="请选择部门分组"
                        @change="filterSearch()" v-if="form.isAddCreateType == 2">
                        <el-option label="全部部门分组" :value="0"></el-option>
                        <el-option v-for="item in groupList" :key="item.id" :label="item.groupName" :value="item.id">
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
                <el-table-column align="center" label="服务内容" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <el-button type="text" @click="handleClick(scope.row)"> {{ scope.row.title }}</el-button>

                    </template>
                </el-table-column>
                <el-table-column align="center" label="班级" show-overflow-tooltip>
                    <template slot-scope="scope">
                        {{ scope.row.className || "--" }}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="服务时间" show-overflow-tooltip>
                    <template slot-scope="scope">
                        {{ scope.row.acvitityTime || "--" }}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="参与人" show-overflow-tooltip>
                    <template slot-scope="scope">
                        {{ scope.row.participant || "--" }}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="服务时长(分钟)" show-overflow-tooltip>
                    <template slot-scope="scope">
                        {{ scope.row.timeLength || "--" }}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="状态" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <div v-if="scope.row.state === 1" style="color: #409EFF;">
                            待审批
                        </div>
                        <div v-else-if="scope.row.state === 2" style="color: #67C23A;">
                            通过
                        </div>
                        <div v-else-if="scope.row.state === 3" style="color: #F56C6C;">
                            驳回
                        </div>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="操作" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <el-button type="danger" size="mini" @click="handleDelete(scope.row)">删除</el-button>
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
import { isShowByPermission } from "@/utils";
import { mapGetters } from "vuex";
import {
    getSchoolTimeAllList,
    possessRole, getGradeByTermId, getClassByGradeId
} from "@/api/growthArchives";
import {
    getHeartVolunteerListStatic, getHeartVolunteerInit, getHeartVolunteerGroupList, getHeartVolunteerList, delHeartVolunteer
} from "@/api/homeSchool/mentalEducation/volunteer/index";
import mixin from '@/mixins/windowResize';
export default {
    name: "volunteerStatistics",
    components: {},
    computed: {
        ...mapGetters(["userInfo", "schoolInfo"])
    },
    mixins: [
        mixin
    ],
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
                isAddCreateType: 0,//	参与人员类型 3 家长 2 学生		
                departGroupId: 0,//	分组id	number	可不传
                classId: 0,//	班级id		
                gradeId: 0,//	年级id		
                schoolTimeId: '',//	学期id		
                title: '',//	学生姓名	
            },
            schoolTimeList: [],
            classList: [],
            myisclass: false,
            gradeList: [],
            groupList: []
        };
    },
    async created() {
        const { data } = await getHeartVolunteerInit({})
        this.form.isAddCreateType = data.data.isAddCreateType
        const { data: groupList } = await getHeartVolunteerGroupList({})
        this.groupList = groupList.data || []
        console.log('groupList', this.groupList)
        await this.getSchoolTimeAllListEvent()
    },
    mounted() {

    },
    methods: {
        isShowByPermission,
        // 
        handleDelete(row) {
            this.$confirm('确认删除该志愿服务吗？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                delHeartVolunteer({
                    volunteerId: row.id
                }).then(res => {
                    this.$message({
                        message: '删除成功',
                        type: 'success'
                    });
                    this.getContributionList();
                }).catch(err => {
                    this.$message({
                        message: err.message,
                        type: 'error'
                    });
                });
            })
        },
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
            this.exportUrl = `${global.BasePath}structure/heartEdu/exportHeartVolunteerList?&classId=${this.form.classId}&schoolTimeId=${this.form.schoolTimeId}&gradeId=${this.form.gradeId}&title=${this.form.title}&isAddCreateType=${this.form.isAddCreateType}&departGroupId=${this.form.departGroupId}&token=${this.$store.getters.token}`;
            getHeartVolunteerList({
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
                    if (this.form.isAddCreateType == 2) {
                        for (let item of dataList) {
                            item.className = item.heartVolunteerStList.map(item => item.className).join('、')
                            item.participant = item.heartVolunteerStList.map(item => item.studentName).join('、')
                        }
                    }
                    if (this.form.isAddCreateType == 3) {
                        for (let item of dataList) {
                            item.participant = item.heartVolunteerUserList.map(item => item.userName + (item.nick ? item.nick : '')).join('、')
                        }
                    }
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
        handleClick(row) {
            this.$router.push({
                path: '/main/homeSchool/mentalEducation/volunteer/volunteerListDetail',
                query: {
                    volunteerId: row.id
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
</style>