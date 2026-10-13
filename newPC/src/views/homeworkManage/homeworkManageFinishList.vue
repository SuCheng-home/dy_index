<template>
    <div class="page">
        <div class="top">
            <el-row >
                        <el-col :span="19">
                            <el-button @click="$router.back()" type="default" size="medium">返回</el-button>
                        </el-col>
                        <el-col :span="5">
                          <el-input placeholder="按姓名搜索" v-model="stuName"  size="medium"
                      @keyup.enter.native="searchNameHandler">
                <el-button slot="append" icon="el-icon-search" @click="searchNameHandler"
                           :loading="searchLoading"></el-button>
            </el-input>
                        </el-col>
                    </el-row>

      </div>
        <div v-if="type === 0">
            <el-table
                    :data="dataList"
                    border
                    style="width: 100%"
                    :height="maxH"
            >
                <el-table-column
                        label="学生姓名"
                        show-overflow-tooltip
                        :resizable="false"
                        prop="studentName"
                >
                </el-table-column>
                <el-table-column
                        prop="className"
                        label="班级"
                        align="center"
                        :resizable="false"
                >
                </el-table-column>
            </el-table>
            <div class="pagination-container">
                <el-pagination
                        @size-change="sizeChangeHandler"
                        @current-change="currentChangeHandler"
                        :current-page.sync="pageNo"
                        :page-sizes="[10 , 20, 30, 50]"
                        :page-size="pageSize"
                        layout="total, sizes, prev, pager, next, jumper"
                        :page-count="pages"
                        :total="total"
                >
                </el-pagination>
            </div>
        </div>
        <div v-if="type === 1">
            <el-table
                    :data="dataList"
                    border
                    style="width: 100%"
                    :height="maxH"
            >
                <el-table-column
                        label="学生姓名"
                        show-overflow-tooltip
                        :resizable="false"
                >
                    <template slot-scope="scope">
                        <span v-if="statis==1">{{ scope.row.studentName }}</span>
                        <span v-else>
                            <router-link
                                    :to="{
                                        path: 'homeworkManageFinishDetail',
                                        query: {
                                            studentId: scope.row.studentId,
                                            homeworkId: homeworkId,
                                            submitTime: scope.row.submitTime,
                                            studentName: scope.row.studentName,
                                        evaluateType:scope.row.evaluateType
                                        }
                                    }"
                                    class="link-type" >
                                {{ scope.row.studentName }}
                            </router-link>
                        </span>
                    </template>
                </el-table-column>
                 <el-table-column
                        label="作业评价"
                        align="center"
                        :resizable="false"
                >
                <template slot-scope="scope">
                  <el-rate v-model="scope.row.evaluateType" disabled></el-rate>
                </template>
                </el-table-column>
                <el-table-column label="状态" align="center" :resizable="false">
                    <template slot-scope="scope">
                        <span v-if="scope.row.evaluateType">
                            <el-tag  size="mini" type="warning" v-if="scope.row.evaluateState==1">未批改</el-tag>
                            <el-tag  size="mini" v-else-if="scope.row.evaluateState==2">已批改</el-tag>
                            <el-tag  size="mini" type="warning" v-else-if="scope.row.evaluateState==3">未订正</el-tag>
                            <el-tag  size="mini" type="warning" v-else>未批改</el-tag>
                        </span>
                        <span v-else>--</span>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="className"
                        label="所在班级"
                        align="center"
                        :resizable="false"
                >
                </el-table-column>
                <el-table-column
                        label="完成时间"
                        align="center"
                        :resizable="false"
                >
                    <template slot-scope="scope">
                        <span>{{ scope.row.submitTime | formatTime }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="作业完成时长" align="center" :resizable="false">
                    <template slot-scope="scope">
                        <span>{{ scope.row.finishDur + '分钟' }}</span>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination-container">
                <el-pagination
                        @size-change="sizeChangeHandler"
                        @current-change="currentChangeHandler"
                        :current-page.sync="pageNo"
                        :page-sizes="[10 , 20, 30, 50]"
                        :page-size="pageSize"
                        layout="total, sizes, prev, pager, next, jumper"
                        :page-count="pages"
                        :total="total"
                >
                </el-pagination>
            </div>
        </div>
    </div>
</template>

<script>
    import windowResizeMixin from '@/mixins/windowResize';
    import BackTool from '@/components/BackTool';
    import {formatTime} from '@/filters'
    import {getFinishStuListByType} from '@/api/homework';

    export default {
        data: function () {
            return {
                searchLoading: false,
                stuName: '',
                pageSize: 20,
                pageNo: 1,
                pages: 1,
                dataList: [],
                total: 0,
                homeworkId: this.$route.query.homeworkId,
                departId:this.$route.query.departId?this.$route.query.departId:'',
                type: Number.parseInt(this.$route.query.type),
                statis:this.$route.query.statis?this.$route.query.statis:0
            }
        },
        components: {
            BackTool
        },
        created: function () {
            this.getFinishStuListByType()
                .then((res) => {
                    const data = res.data;
                    if (data.result) {
                        this.dataList = data.data.dataList;
                        this.total = data.data.pagination.total;
                        this.pages = data.data.pagination.pages;
                    } else {
                        this.$message.error('error');
                    }
                })
                .catch(() => {
                    this.$message.error('error');
                });
        },
        methods: {
            getFinishStuListByType() {
                return getFinishStuListByType({
                    departId:this.departId,
                    pageSize: this.pageSize,
                    pageNo: this.pageNo,
                    stuName: this.stuName,
                    homeworkId: this.homeworkId,
                    type: this.type
                },sessionStorage.getItem("homeworkschoolTimeId"));
            },
            searchNameHandler() {
                this.stuName = this.stuName.trim();
                this.searchLoading = true;
                this.pageNo = 1;
                this.getFinishStuListByType().then((res) => {
                    this.searchLoading = false;
                    this.dataList = res.data.data.dataList;
                    this.pages = res.data.data.pagination.pages;
                    this.total = res.data.data.pagination.total;
                }).catch(() => {
                    this.$message.error('error');
                    this.searchLoading = false;
                });
            },
            sizeChangeHandler(pageSize) {
                this.pageNo = 1;
                this.pageSize = pageSize;
                this.getFinishStuListByType()
                    .then((res) => {
                        const data = res.data;
                        if (data.result) {
                            this.dataList = data.data.dataList;
                            this.pages = data.data.pagination.pages;
                        } else {
                            this.$message.error('error');
                        }
                    })
                    .catch(() => {
                        this.$message.error('error');
                    });
            },
            currentChangeHandler(pageNo) {
                this.pageNo = pageNo;
                this.getFinishStuListByType()
                    .then((res) => {
                        const data = res.data;
                        if (data.result) {
                            this.dataList = data.data.dataList;
                        } else {
                            this.$message.error('error');
                        }
                    })
                    .catch(() => {
                        this.$message.error('error');
                    });
            },
        },
        filters: {formatTime},
        mixins: [windowResizeMixin]
    }
</script>

<style scoped>
    .page {
        padding:12px;
    }
    .top{
            padding-bottom: 10px;
        }
    .search-input {
        margin-left: 10px;
        width: 220px;
    }
</style>
