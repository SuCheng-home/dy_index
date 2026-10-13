<template>
    <div class="repair-index">
        <el-row style="padding-bottom: 10px">
            <el-col :span="19">
                <el-date-picker
                    size="medium"
                    type="daterange" class="mywidthdaterange"
                    range-separator="-"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    value-format="yyyy-MM-dd"
                    :clearable="false"
                    v-model="form.daterange"
                    @change="handleDateRange"
                ></el-date-picker>
                 <el-select size="medium" v-model="pagination.userId" placeholder="请选择" @change="handleDateRange()">
                     <el-option  label="全部维修人员" :value="0"></el-option>
                <el-option v-for="item in newtypelist" :key="item.id" :label="item.name"
                           :value="item.id"></el-option>
            </el-select>
                <a :href="exportUrl" target="_blank" download="examName" v-if="tabList.length">
                    <el-button type="primary" size="medium">导出</el-button>
                </a>
            </el-col>
            <el-col :span="5">
                <el-input
                    class="search-input"
                    icon="el-icon-search"
                    size="medium"
                    placeholder="请输入报修人姓名或地点"
                    clearable
                    v-model.trim="form.repairCreateName"
                    @change="handleTitle"
                >
                    <el-button
                        slot="append"
                        icon="el-icon-search"
                        @click="handleTitle"
                    ></el-button>
                </el-input>
            </el-col>
        </el-row>

        <el-table
            border
            fit
            stripe
            highlight-current-row
            style="width: 100%"
            :height="maxH"
            :data="tabList"
            v-loading.body="tabLoading"
        >
            <el-table-column align="center" label="报修人" show-overflow-tooltip>
                <template slot-scope="scope">
          <span class="link-type" @click="gotoDetail(scope.row)">
            {{ scope.row.createUserName || "--" }}
          </span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="报修时间" show-overflow-tooltip>
                <template slot-scope="scope">
                    {{ scope.row.createTime | filterDate }}
                </template>
            </el-table-column>
            <el-table-column align="center" label="报修内容" show-overflow-tooltip>
                <template slot-scope="scope">
                    {{ scope.row.repairContent || "--" }}
                </template>
            </el-table-column>
            <el-table-column align="center" label="报修地点" show-overflow-tooltip>
                <template slot-scope="scope">
                    {{ scope.row.repairPlace || "--" }}
                </template>
            </el-table-column>
            <el-table-column
                align="center"
                label="报修类型"
                show-overflow-tooltip
                :filters="typeList"
                :filter-multiple="false"
                :filtered-value="handleRepairType"
            >
                <template slot-scope="scope">
                    {{ scope.row.repairTypeName || "--" }}
                </template>
            </el-table-column>
            <el-table-column
                align="center"
                label="状态"
                show-overflow-tooltip
                :filters="repairStatusList"
                :filter-multiple="false"
                :filtered-value="handleRepairStatus"
            >
                <template slot-scope="scope">
                    <el-tag  size="mini" type="danger"  v-if="scope.row.status == 0"
                    >待处理
                    </el-tag
                    >
                    <el-tag  size="mini" type="warning"  v-if="scope.row.status == 1"
                    >已处理
                    </el-tag
                    >
                    <el-tag  size="mini" type="success"  v-if="scope.row.status == 2"
                    >已完成
                    </el-tag
                    >
                </template>
            </el-table-column>
            <el-table-column align="center" label="维修人" show-overflow-tooltip>
                <template slot-scope="scope">
                    {{ scope.row.dealUserNames || "--" }}
                </template>
            </el-table-column>
            <el-table-column align="center" label="维修次数" show-overflow-tooltip>
                <template slot-scope="scope">
                    {{ scope.row.dealCount || "--" }}
                </template>
            </el-table-column>
        </el-table>

        <el-pagination
            style="margin-top: 20px"
            layout="total, sizes, prev, pager, next, jumper"
            :current-page.sync="pagination.pageNo"
            :page-size="pagination.pageSize"
            :page-sizes="pagination.pageSizes"
            :total="pagination.total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
        ></el-pagination>
    </div>
</template>

<script>
    /* utils */
    import mixin from "@/mixins/windowResize";
    import {isShowByPermission} from "@/utils";
    import moment from "moment";

    /* components */

    /* api */
    import {
        getRepairTypeAllList,
        repairListAll,getDealUserList
    } from "@/api/repairManage";
    import {getCurrentSchoolTimeBySchoolId} from '@/api/common/schoolTime';

    export default {
        name: "mentalEducationPopularizationIndex",
        mixins: [mixin],
        components: {},
        computed: {},
        filters: {
            filterDate(val) {
                return val ? moment(val).format("YYYY-MM-DD HH:mm:ss") : "--";
            },
        },
        watch: {
            handleRepairType: function (val) {
                if (!val[0]) this.form.repairTypeId = 0;
                else this.form.repairTypeId = val[0];
                this.filterSearch();
            },
            handleRepairStatus: function (val) {
                if (val[0] != 0 && !val[0]) this.form.status = -1;
                else this.form.status = val[0];
                this.filterSearch();
            },
        },
        data() {
            return {
                exportUrl: "",
                // 类型列表
                typeList: [],
                // 状态列表
                repairStatusList: [
                    {text: "待处理", value: 0},
                    {text: "已处理", value: 1},
                    {text: "已完成", value: 2},
                ],
                handleRepairType: [],
                handleRepairStatus: [],
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
                    userId:0
                },
                // 请求表单
                form: {
                    type: 0,
                    daterange: ["", ""],
                    repairCreateName: "",
                    repairTypeId: 0,
                    status: -1,
                },
                newtypelist:[]
            };
        },
        created() {
            this.getCurrentSchoolTimeBySchoolId();
            this.getRepairTypeAllList();
            this.getDealUserList();
        },
        methods: {
            getDealUserList(){
                  getDealUserList().then(res => {
                    let data =res.data.data;
                    this.newtypelist=data
                       
                }).catch(err => {});

            },
            isShowByPermission,
            // 获取当前学期
            getCurrentSchoolTimeBySchoolId() {
                getCurrentSchoolTimeBySchoolId({
                    type: this.form.type,
                })
                    .then((res) => {
                        let _res = res.data;
                        if (_res.code != 200) return Promise.reject(_res.msg);
                        else return _res.data;
                    })
                    .then((data) => {
                        if (data) {
                            this.form.daterange = [
                                this.$moment(data.startDate).format("YYYY-MM-DD"),
                                this.$moment(data.endDate).format("YYYY-MM-DD"),
                            ];
                            this.repairListAll();
                        }
                    })
                    .catch((msg) => {
                        this.$message({
                            message: msg,
                            type: "error",
                        });
                    });
            },
            // 根据标题，学校id查询科普通知列表
            getRepairTypeAllList() {
                getRepairTypeAllList(this.form.type)
                    .then((res) => {
                        let _res = res.data;
                        if (_res.code != 200) return Promise.reject(_res.msg);
                        else return _res.data;
                    })
                    .then((data) => {
                        if (Array.isArray(data) && data.length) {
                            this.typeList = data.map((item) => ({
                                text: item.repairTypeName,
                                value: item.id,
                            }));
                        }
                    })
                    .catch((msg) => {
                        this.$message({
                            message: msg,
                            type: "error",
                        });
                    });
            },
            // 报修处理检索列表
            repairListAll() {
                let startDate = this.form.daterange[0] || "";
                let endDate = this.form.daterange[1] || "";
                repairListAll({
                    startDate,
                    endDate,
                    repairCreateName: this.form.repairCreateName,
                    repairTypeId: this.form.repairTypeId,
                    status: this.form.status,
                    pageNo: this.pagination.pageNo,
                    pageSize: this.pagination.pageSize,
                    userId:this.pagination.userId,
                })
                    .then((res) => {
                        let _res = res.data;
                        if (_res.code != 200) return Promise.reject(_res.msg);
                        else return _res.data;
                    })
                    .then((data) => {
                        if (data) {
                            let {repairList, pagination} = data;
                            this.tabList = [...repairList];
                            this.pagination.total = pagination.total;
                        }
                        this.exportUrl = `${global.BasePath}structure/repair/exportRepairListAll?repairTypeId=${this.form.repairTypeId}&userId=${this.pagination.userId}&repairCreateName=${this.form.repairCreateName}&status=${this.form.status}&startDate=${startDate}&endDate=${endDate}&token=${this.$store.getters.token}`;
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
                this.repairListAll();
            },
            // 日期范围改变
            handleDateRange() {
                this.filterSearch();
            },
            // 主题改变
            handleTitle() {
                this.filterSearch();
            },
            // 分页 - pageSize 改变
            handleSizeChange(pageSize) {
                this.pagination.pageSize = pageSize;
                this.repairListAll();
            },
            // 分页 - currentPage 改变
            handleCurrentChange(pageNo) {
                this.pagination.pageNo = pageNo;
                this.repairListAll();
            },
            gotoDetail(item) {
                this.$router.push({
                    path: "repairAccountingDetail",
                    query: {
                        repairId: item.id,
                    },
                });
            },
        },
    };
</script>
<style lang="scss" scoped>
    .repair-index {
        padding:12px;

        .filter-wrapper {
            margin-bottom: 10px;
        }

        .el-table__body-wrapper {
            .delete-btn {
                color: #f56c6c;
            }
        }
    }
</style>
