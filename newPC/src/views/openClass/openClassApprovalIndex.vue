<template>
    <div style="padding:12px">
        <div class="open_class_approval_wrap">
            <el-table stripe :data="approvalClassList" border style="width: 100%;" :height="notbmaxH - 28">
                <el-table-column label="时间" show-overflow-tooltip width="240">
                    <template slot-scope="scope">
                        <span style="color: #409eff;cursor:pointer;" @click="toApprovalInfo(scope.row.id)">{{scope.row.listenDate}}&nbsp;{{scope.row.listenWeek}}&nbsp;{{scope.row.classNoName}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="主讲人">
                    <template slot-scope="scope">
                        <span>{{scope.row.teacherName}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="公开课级别">
                    <template slot-scope="scope">
                        <span>{{scope.row.levelName}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="公开课类型" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span>{{scope.row.openClassType || '--'}}</span>
                    </template>
                </el-table-column>
                 <el-table-column label="上课班级" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span>{{scope.row.className}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="上课地点" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span>{{scope.row.place}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="学科">
                    <template slot-scope="scope">
                        <span>{{scope.row.subjectName}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="状态">
                    <template slot-scope="scope">
                        <el-tag  size="mini"  type="info" v-if="scope.row.state===1">草稿</el-tag>
                        <el-tag  size="mini"  type="warning" v-else-if="scope.row.state===2">待审核</el-tag>
                        <el-tag  size="mini"  type="danger" v-else-if="scope.row.state===3">驳回</el-tag>
                        <el-tag  size="mini"  type="success" v-else-if="scope.row.state===4">已发布</el-tag>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination-container">
                <el-pagination @size-change="sizeChangeHandler" @current-change="currentChangeHandler"
                               :current-page.sync="pagination.pageNo" :page-sizes="[10, 20, 30, 50]"
                               :page-size.sync="pagination.pageSize"
                               layout="total, sizes, prev, pager, next, jumper"
                               :total="pagination.total">
                </el-pagination>
            </div>
        </div>
    </div>
</template>

<script>
    import mixins from '@/mixins/windowResize';
    import BaseMixin from '@/mixins/baseMixin';
    import {getSPRegisterList} from "@/api/teachingStudy/openClass";

    export default {
        name: 'openClassApprovalIndex',
        data() {
            return {
                approvalClassList: [],
                searchName: '',
                pagination: {
                    pageNo: 1,
                    pageSize: 20,
                    total: ''
                },
            }
        },
        mixins: [mixins, BaseMixin],
        created() {
            this.getSPRegisterList();
        },
        methods: {
            toApprovalInfo(id) {
                this.$router.push({path: 'approvalInfo', query: {id: id, isApproval: 1}});
            },
            getSPRegisterList() {
                let query = {
                    pageNo: this.pagination.pageNo,
                    pageSize: this.pagination.pageSize,
                    teacherName: this.searchName
                };
                getSPRegisterList(query).then(res => res.data).then(data => {
                    if (data.code === 200) {
                        this.approvalClassList = data.data.dataList;
                        this.pagination.total = data.data.pagination.total;
                    } else {
                        this.$message({
                            message: data.msg,
                            type: 'warning'
                        });
                    }
                }).catch(() => {
                });
            },
            sizeChangeHandler() {
                this.pagination.pageNo = 1;
                this.getSPRegisterList();
            },
            currentChangeHandler() {
                this.getSPRegisterList();
            }
        }
    }
</script>

<style lang="scss" scoped>
    .header {
        margin-bottom: 0;

        .statistics_title {
            display: flex;
            margin: 10px 0;

            .btn_group {
                flex: 1;
                text-align: center;

                .btn {
                    height: 40px;
                    line-height: 40px;
                    border: 1px solid #ccc;
                    border-left-width: 0;
                    color: #333;
                    cursor: pointer;
                }

                .btn_selected {
                    color: #fff;
                    background: #409EFF;
                    border: 1px solid #409EFF;
                }
            }

            .btn_group:first-child {
                .btn {
                    border-radius: 4px 0 0 4px;
                    border-left-width: 1px;
                }
            }

            .btn_group:last-child {
                .btn {
                    border-radius: 0 4px 4px 0;
                }
            }
        }
    }

</style>
