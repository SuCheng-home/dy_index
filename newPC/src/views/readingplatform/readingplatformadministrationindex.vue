<template>
    <div class="readingplatformadministrationindex">
        <div class="header">
            <el-row>
                <el-col :span="19">
                    <el-button @click="$router.back()" type="default" size="medium">返回</el-button>
                    <el-button type="primary" size="medium" @click="jumpTo('readingplatformadministrationadd')">添加管理者</el-button>
                    <el-button type="danger" size="medium"   @click="deleteMoreHandler">删除</el-button>
                </el-col>
                <el-col :span="5">
                    <el-input class="search-input"
                              placeholder="请输入搜索姓名" icon="search" size="medium" @keyup.enter.native="handleInputChange"
                              v-model.trim="listQuery.searchName">
                        <el-button slot="append" icon="el-icon-search" @click="handleInputChange"></el-button>
                    </el-input>
                </el-col>
            </el-row>
        </div>
            <el-table
                ref="multipleTable"
                :data="dataList"
                :height="maxH"
                border stripe
                style="width: 100%"
                @selection-change="handleSelectionChange">
                <el-table-column align="center" type="selection" width="55" ></el-table-column>                			
                <el-table-column  label="姓名" show-overflow-tooltip width="100">
                    <template slot-scope="scope">{{ scope.row.userName }}</template>
                </el-table-column>
                <el-table-column align="center" label="联系方式"  width="180">
                    <template slot-scope="scope">{{ scope.row.userMobile }}</template>
                </el-table-column>
                <el-table-column align="center"  label="管理班级" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span v-for="(item,index) in scope.row.classList" :key="index">
                            {{item.className}}；
                        </span>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="160" align="center">
                    <template slot-scope="scope">
                        <div>
                            <el-button size="small" type="text" @click="jumpTo('readingplatformadministrationeidt',{id:scope.row.id})"
                                      >
                                编辑
                            </el-button>
                            <el-button size="small" type="text" @click="deleteHandler(scope.row.id)">
                                删除
                            </el-button>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination
                class="pagination-container"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page.sync="listQuery.pageNo"
                :page-sizes="[10,20,30, 50]"
                :page-size="listQuery.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
            </el-pagination>
    </div>
</template>
<script>
    import mixin from '@/mixins/windowResize';
    import {queryManagerTeacherBySchoolId, deleteManageTeacher} from '@/api/readingplatform';
    export default {
        data() {
            return {
                dataList: [],
                listQuery: {
                    pageNo: 1,
                    pageSize: 20,
                    searchName: ''
                },
                total: null,
                multipleSelection: []
            }
        },
        created() {
            this.getSchoolActivityPageListFunc();
        },
        mixins: [
            mixin
        ],
        methods: {
            jumpTo(path, query = {}) {
                this.$router.push({
                    path,
                    query
                })
            },
            deleteMoreHandler() {
                //多个删除
                if (this.multipleSelection && this.multipleSelection.length) {
                    this.$confirm('是否删除？', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        let arr = this.multipleSelection.map(obj => {
                            return obj.id
                        });
                        this.delMettingFunc(arr.toString());
                    }).catch(() => {
                        this.$message({
                            type: 'info',
                            message: '已取消删除'
                        });
                    });
                } else {
                    this.$message({
                        message: '请选择要删除的!',
                        type: 'warning'
                    });
                }
            },
            deleteHandler(id) {
                //单个删除
                this.$confirm('是否删除？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.delMettingFunc(id);
                }).catch(() => {

                });
            },
            delMettingFunc(id) {
                deleteManageTeacher(id).then(res => res.data).then(data => {
                    if (data.code === 200) {
                        this.$message({
                            message: '删除成功',
                            type: 'success'
                        });
                        this.getSchoolActivityPageListFunc();
                    }
                }).catch(() => {
                });
            },
            handleSizeChange(val) {
                this.listQuery.pageNo = 1;
                this.listQuery.pageSize = val;
                this.getSchoolActivityPageListFunc();
            },
            handleCurrentChange(val) {
                this.listQuery.pageNo = val;
                this.getSchoolActivityPageListFunc();
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            getSchoolActivityPageListFunc() {
                queryManagerTeacherBySchoolId(this.listQuery).then(res => res.data).then(data => {
                    if (data.code === 200) {
                        let activityData = data.data;
                        this.dataList = activityData.dataList;
                        if (this.dataList.length == 0 && this.listQuery.pageNo !== 1) {
                            this.listQuery.pageNo--;
                            this.getSchoolActivityPageListFunc();
                        }
                        this.total = activityData.pagination.total;
                    } else {
                    }
                }).catch(() => {
                })
            }
        }
    }
</script>
<style lang="scss" scoped>
    .readingplatformadministrationindex {
        padding:12px;
        box-sizing: border-box;

        .header {
            margin-bottom: 10px;
        }

    }
</style>
