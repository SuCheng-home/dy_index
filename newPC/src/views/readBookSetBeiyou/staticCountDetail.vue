<template>
    <div class="read-way">
        <div class="header">
            <el-row>
                <el-col :span="19">
                    <el-button size="medium" @click="goBack">返回</el-button>
                </el-col>
                <el-col :span="5">
                    <el-input
                        placeholder="请输入书籍名称"
                        v-model.trim="bookName"
                        size="medium"
                        @keyup.enter.native="clickSearch"
                    >
                        <el-button
                            slot="append"
                            icon="el-icon-search"
                            @click="clickSearch"
                        ></el-button>
                    </el-input>
                </el-col>
            </el-row>
        </div>
        <div>
            <el-table stripe :data="bookList" border :height="maxH - 60" style="width: 100%">
                <el-table-column align="center" prop="createTime" label="阅读时间" show-overflow-tooltip>
                    <template slot-scope="scope">
                        {{scope.row.createTime ? scope.row.createTime.slice(0, scope.row.createTime.lastIndexOf('.')) :
                        ''}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="阅读书籍" prop="bookName" show-overflow-tooltip>
                </el-table-column>
                <el-table-column align="center" label="书籍类型" prop="bookTypeName" show-overflow-tooltip>
                </el-table-column>
                <el-table-column align="center" label="阅读方式" prop="wayTypeName">
                </el-table-column>
                <el-table-column align="center" label="操作">
                    <template slot-scope="scope">
                        <button type="button" class="el-button el-button--text el-button--small"
                                @click="clickDel(scope.row)">删除
                        </button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination-container" style="margin-top: 15px;">
                <el-pagination @size-change="sizeChangeHandler" @current-change="currentChangeHandler"
                               :current-page.sync="pagination.pageNo" :page-sizes="[10, 20, 30, 50]"
                               :page-size.sync="pagination.pageSize" layout="total, sizes, prev, pager, next, jumper"
                               :total="pagination.total">
                </el-pagination>
            </div>
        </div>
    </div>
</template>
<script>
    import mixins from '@/mixins/windowResize';
    import {isShowByPermission} from "@/utils";
    import {
        getReadIndependStuRecordList,
        delReadIndependStuRecord
    } from '@/api/readBookBeiyou';

    export default {
        data() {
            return {
                bookName: '',
                bookList: [],
                schoolTimeId: this.$route.query.schoolTimeId,
                startDate: this.$route.query.startDate,
                endDate: this.$route.query.endDate,
                studentId: this.$route.query.studentId,

                pagination: {
                    pageNo: 1,
                    pageSize: 10,
                    total: 0,
                }
            }
        },
        mixins: [mixins],
        created() {
            this.getReadIndependStuRecordListFunc()
        },
        methods: {
            getReadIndependStuRecordListFunc() {
                getReadIndependStuRecordList({
                    'pageSize': this.pagination.pageSize,
                    'pageNo': this.pagination.pageNo,
                    'schoolTimeId': this.schoolTimeId,
                    'studentId': this.studentId,
                    'startDate': this.startDate,
                    'endDate': this.endDate,
                    'bookName': this.bookName
                }).then(res => {
                    if (res.data.code === 200 && res.data.result) {
                        this.bookList = res.data.data.dataList
                        this.pagination = res.data.data.pagination
                    } else {
                        this.$message.warning(res.data.msg);
                    }
                })
            },
            // 删除
            clickDel(data) {
                this.$confirm('确认删除该条阅读记录, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    delReadIndependStuRecord({
                        recordId: data.id
                    }).then(res => {
                        if (res.data.code === 200 && res.data.result) {
                            this.$message.success('删除成功');
                            this.getReadIndependStuRecordListFunc()
                        } else {
                            this.$message.warning(res.data.msg);
                        }
                    })
                }).catch(() => {
                });
            },
            // 搜索
            clickSearch() {
                this.pagination.pageNo = 1;
                this.getReadIndependStuRecordListFunc()
            },
            goBack() {
                this.$router.back()
            },
            sizeChangeHandler() {
                this.pagination.pageNo = 1;
                this.getReadIndependStuRecordListFunc();
            },
            currentChangeHandler() {
                this.getReadIndependStuRecordListFunc();
            }
        },
    }
</script>
<style lang="scss" scoped>
    .read-way {
        padding:12px;
    }

    .header {
        padding-bottom: 10px;
    }
</style>
