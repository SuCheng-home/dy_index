<template>
    <div class="mental-education-consulting-index">
        <el-row style="padding-bottom: 10px">
            <el-col :span="19">
                <el-select v-model="form.schoolTimeId" placeholder="2025-2026学年第1学期" size="medium" clearable
                    @change="filterSearch">
                    <el-option label="全部学期" value="0"></el-option>
                    <el-option v-for="item in schoolTimeList" :key="item.id" :label="item.schoolTimeName"
                        :value="item.id"></el-option>

                </el-select>
                <el-select v-model="form.state" placeholder="全部采用状态" size="medium" clearable @change="filterSearch">
                    <el-option label="全部采用状态" value="0"></el-option>
                    <el-option label="待采用" value="1"></el-option>
                    <el-option label="已采用" value="2"></el-option>
                </el-select>
            </el-col>

            <el-col :span="5">
                <el-input class="search-input" icon="el-icon-search" size="medium" placeholder="请输入主题" clearable
                    v-model.trim="form.title" @change="filterSearch">
                    <el-button slot="append" icon="el-icon-search" @click="filterSearch"></el-button>
                </el-input>
            </el-col>
        </el-row>



        <el-table border fit stripe highlight-current-row style="width: 100%"    :height="nobottommaxH - 25"
            :data="tabList" v-loading.body="tabLoading">

            <el-table-column align="center" label="主题" show-overflow-tooltip>
                <template slot-scope="scope">
                    <span class="link-type" @click="gotoDetail(scope.row)">
                        {{ scope.row.title || "--" }}
                    </span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="投稿人" show-overflow-tooltip>
                <template slot-scope="scope">
                    {{ scope.row.createUserName || "--" }}
                </template>
            </el-table-column>
            <el-table-column align="center" label="班级" show-overflow-tooltip>
                <template slot-scope="scope">
                    {{ scope.row.className || "--" }}
                </template>
            </el-table-column>
            <el-table-column align="center" label="投稿时间" show-overflow-tooltip>
                <template slot-scope="scope">
                    {{ scope.row.createTime | filterDate }}
                </template>
            </el-table-column>
            <el-table-column align="center" label="状态" show-overflow-tooltip>
                <template slot-scope="scope">
                    <el-tag size="mini" type="info" v-if="scope.row.state == 1">待采用</el-tag>
                    <el-tag size="mini" type="success" v-else>已采用</el-tag>
                </template>
            </el-table-column>
            <el-table-column align="center" label="操作" v-if="isShowByPermission('/heartEdu/mangerInit')">
                <template slot-scope="scope">
                    <el-button class="delete-btn" size="small" type="text"
                        @click="handleDelete(scope.row)">删除</el-button>
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
import { isShowByPermission } from "@/utils";
import mixin from '@/mixins/windowResize';
import {
    getHeartEduDarkList, delHeartEduDark, getSchoolTimeAllList
} from "@/api/homeSchool/mentalEducation/contribution/index";

export default {
    name: "contribution",
    components: {},
    computed: {},
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
                schoolTimeId: "0",
                state: "0",
                title: ""
            },
            schoolTimeList: [],
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
            const { data } = await getSchoolTimeAllList()
            this.schoolTimeList = [...data.data];
        },
        // 获取投稿列表
        getContributionList() {
            getHeartEduDarkList({
                title: this.form.title,
                schoolTimeId: Number(this.form.schoolTimeId),
                state: Number(this.form.state),
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
        // 点击*删除*
        handleDelete(item) {
            this.$confirm("确认要删除吗？", "删除", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "error",
                lockScroll: false,
            })
                .then(() => {
                    let form = {
                        darkId: item.id,
                    };
                    delHeartEduDark(form)
                        .then((res) => {
                            let _res = res.data;
                            if (_res.code != 200) return Promise.reject(_res.msg);
                            else return _res.data;
                        })
                        .then((data) => {
                            this.$message({
                                message: "删除成功",
                                type: "success",
                            });
                            this.getContributionList();
                        })
                        .catch((msg) => {
                            console.log(msg);
                        });
                })
                .catch(() => { });
        },

        // 创建 / 编辑
        gotoForm(item) {
            const routeParams = {
                path: "contribution/form",
            };
            if (item) routeParams.query = { id: item.id };
            // this.$router.push(routeParams);
            this.$message({
                message: "跳转到编辑页面",
                type: "info",
            });
        },
        // 详情页
        gotoDetail(item) {
            this.$router.push({
                path: "contribution/detail",
                query: {
                    darkId: item.id,
                    title: item.title,
                },
            });

        },
    },
};
</script>
<style lang="scss" scoped>
.mental-education-consulting-index {
    padding: 12px;
    .el-date-editor {
        width: 220px;
    }

    .el-select {
        width: 180px;
    }

    .el-select-short {
        width: 120px;
    }

    .el-table__body-wrapper {
        .delete-btn {
            color: #f56c6c;
        }
    }
}
</style>
