<template>
    <div class="app-container calendar-list-container">
        <div class="menu-tools">
            <el-button v-if="!noback" type="default" size="medium" @click="$router.back()">返回</el-button>
            <el-button
                size="medium"
                class="filter-item"
                type="primary"
                @click="loadRepairAdd()"
            >新增类型
            </el-button>
            <el-button
                size="medium"
                class="filter-item"
                type="danger"
                @click="delRepairTypeSelected()"
            >删除类型
            </el-button>
            <el-button
                size="medium"
                class="filter-item"
                type="primary"
                @click="gotoReminderSettings"
            >提醒设置
            </el-button>

            <el-input
                size="medium"
                class="search-input search-input--right"
                style="width:20%!important"
                v-model="listQuery.searchTitle"
                placeholder="类型名称"
                @keyup.enter.native="handleInputChange"
            >
                <el-button
                    slot="append"
                    size="medium"
                    icon="el-icon-search"
                    @click="handleInputChange"
                ></el-button>
            </el-input>
        </div>

        <el-table
            stripe
            @select="selectionChangeHandler"
            @select-all="selectionChangeHandler"
            :key='tableKey'
            :data="list"
            v-loading.body="listLoading"
            border
            fit
            highlight-current-row
            style="width: 100%"
            :height="maxH"
        >
            <el-table-column
                type="selection"
                align="center"
                width="50"
            >
            </el-table-column>
            <el-table-column
                align="left"
                label="类型名称"
                show-overflow-tooltip
                min-width="120"
            >
                <template slot-scope="scope">
                    <span>{{scope.row.repairTypeName}}</span>
                </template>
            </el-table-column>
            <el-table-column
                align="left"
                label="类型分类"
                show-overflow-tooltip
                min-width="100"
            >
                <template slot-scope="scope">
                    <span v-if="scope.row.type==0">报修、资产</span>
                    <span v-if="scope.row.type==1">报修</span>
                    <span v-if="scope.row.type==2">资产</span>
                </template>
            </el-table-column>
            <el-table-column
                align="left"
                show-overflow-tooltip
                label="上级类型"
                min-width="140"
            >
                <template slot-scope="scope">
                    <span>{{scope.row.repairTypeName_parent}}</span>
                </template>
            </el-table-column>
            <el-table-column
                align="left"
                show-overflow-tooltip
                label="报修负责人"
                min-width="140"
            >
                <template slot-scope="scope">
                    <span>{{scope.row.managerUserNames}}</span>
                </template>
            </el-table-column>

            <el-table-column
                align="center"
                label="是否需要反馈"
                width="120"
            >
                <template slot-scope="scope">
                    <span v-if="scope.row.isFback==0"><i class="el-icon-circle-cross"></i></span>
                    <span v-if="scope.row.isFback==1"><i class="el-icon-circle-check"></i></span>
                </template>
            </el-table-column>
            <el-table-column
                align="center"
                label="排序号"
                prop="orderNo"
                width="120"
            >
            </el-table-column>
            <el-table-column
                align="center"
                label="创建时间"
                width="180"
            >
                <template slot-scope="scope">
                    <span>{{scope.row.createTime|formatTimeFilter}}</span>
                </template>
            </el-table-column>
            <el-table-column
                align="center"
                label="操作"
                width="120"
            >
                <template slot-scope="scope">
                    <el-button
                        size="small"
                        type="text"
                        @click="loadRepairEdit(scope.row.id)"
                        :disabled="scope.row.isDelete!=1"
                    >编辑
                    </el-button>
                    <el-button
                        size="small"
                        type="text"
                        @click="delRepairType(scope.row.id)"
                        :disabled="scope.row.isDelete!=1"
                    class="buttontextred">删除
                    </el-button>
                </template>
            </el-table-column>

        </el-table>
        <div
            v-show="!listLoading"
            class="pagination-container"
        >
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page.sync="listQuery.pageNo"
                :page-sizes="[10,20,30, 50]"
                :page-size="listQuery.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total"
            >
            </el-pagination>
        </div>
    </div>
</template>

<script>
    import _ from "lodash";
    import {getRepairTypeList, delRepairTypeList} from "@/api/repairManage";
    import mixin from "@/mixins/windowResize";

    export default {
        data() {
            return {
                noback: this.$route.query.noback == 1,
                list: null,
                total: null,
                listLoading: false,
                listQuery: {
                    pageNo: 1,
                    pageSize: 20,
                    searchTitle: "",
                    type: 0,
                },
                tableKey: 10,
                selected: [],
            };
        },
        created() {
            this.getList();
        },
        mixins: [mixin],
        filters: {
            formatTimeFilter(date) {
                return date.split(".")[0];
            },
        },
        methods: {
            selectionChangeHandler(selection) {
                this.selected = selection;
            },
            //获取报修类型列表数据
            getList() {
                this.listLoading = true;
                getRepairTypeList(this.listQuery).then((res) => {
                    let data = res.data.data;
                    this.list = data.dataList;
                    this.total = data.pagination.total;
                    this.listLoading = false;
                });
            },
            //筛选
            handleInputChange: _.debounce(
                function () {
                    this.getList();
                },
                // 这是我们为用户停止输入等待的毫秒数
                500
            ),

            //当前页显示条目
            handleSizeChange(val) {
                this.listQuery.pageSize = val;
                this.getList();
            },
            //当前页
            handleCurrentChange(val) {
                this.listQuery.pageNo = val;
                this.getList();
            },
            loadRepairEdit(id) {
                //加载编辑页面
                this.$router.push({
                    path: "repairTypeEditIndex",
                    query: {
                        id: id,
                    },
                });
            },
            loadRepairAdd() {
                //加载新增页面
                this.$router.push({
                    path: "repairTypeAdd",
                    query: {},
                });
            },
            //行内删除报修类型
            delRepairType(repairTypeIds) {
                this.$confirm("是否确认要删除该报修类型？", "删除", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning",
                })
                    .then(() => {
                        delRepairTypeList(repairTypeIds).then((res) => {
                            if (res.data.code === 200) {
                                this.$message.success(res.data.msg);
                                this.getList();
                            } else {
                                this.$message.error(res.data.msg);
                            }
                        });
                    })
                    .catch(() => {
                    });
            },
            //多选删除报修类型
            delRepairTypeSelected() {
                const delArr = [];
                if (this.selected.length > 0) {
                    this.$confirm("是否确认要删除选中的报修类型？", "删除", {
                        confirmButtonText: "确定",
                        cancelButtonText: "取消",
                        type: "warning",
                    })
                        .then(() => {
                            this.selected.forEach((item) => {
                                delArr.push(item.id);
                            });
                            let repairTypeIds = delArr.join(",");
                            delRepairTypeList(repairTypeIds).then((res) => {
                                if (res.data.code === 200) {
                                    this.$message.success(res.data.msg);
                                    this.getList();
                                    this.selected = [];
                                } else {
                                    this.$message.error(res.data.msg);
                                }
                            });
                        })
                        .catch(() => {
                        });
                } else {
                    this.$message.warning("请选择要删除的报修类型！");
                    this.listLoading = false;
                }
            },

            gotoReminderSettings() {
                this.$router.push({
                    path: "reminderSettings",
                });
            },
        },
    };
</script>

<style scoped="scoped">
    .el-loading-mask {
        display: none;
    }

    .menu-tools {
        padding-bottom: 10px;
    }

    .searchButton {
        width: 200px;
        vertical-align: middle;
        margin-bottom: 10px;
        float: right;
    }

    .searchButton:after {
        content: "";
        display: block;
        clear: both;
    }

    .el-icon-circle-cross {
        color: #f08080;
    }

    .el-icon-circle-check {
        color: #90ee90;
    }
</style>
