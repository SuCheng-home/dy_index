<template>
    <div class="page">
        <div class="page-header">
            <school-year-selector @change="searchTitleHandler"></school-year-selector>
            <el-input placeholder="标题名称" v-model="searchTitle" size="medium" class="search-input search-input--right"
                      @keyup.enter.native="searchTitleHandler">
                <el-button slot="append" icon="el-icon-search" @click="searchTitleHandler"
                           :loading="loadingState.search"></el-button>
            </el-input>
        </div>
        <div>
            <el-table
                :data="dataList"
                border
                style="width: 100%"
                :height="notbmaxH - 75"
            >
                <el-table-column
                    label="标题"
                    show-overflow-tooltip
                    :resizable="false"
                    fixed
                    min-width="200"
                >
                    <template slot-scope="scope">
                        <router-link class="link-type"
                                     :to="{ path: 'questionnaireDetail', query: { id: scope.row.id, isArea: 1 } }">
                            {{ scope.row.voteTitle }}
                        </router-link>
                    </template>
                </el-table-column>
                 <el-table-column
                        label="问卷类型"
                        align="center"
                        width="120"
                        :resizable="false"
                    >
                        <template slot-scope="scope">
                                <el-tag  size="mini" v-if="scope.row.sendUserType==1" type="warning">老师</el-tag>
                                <el-tag  size="mini" v-else type="primary">学生</el-tag>
                        </template>
                    </el-table-column>
                <el-table-column
                    label="截止时间"
                    align="center"
                    width="180"
                    :resizable="false"
                >
                    <template slot-scope="scope">
                        {{ scope.row.expriyDate | trimTime }}
                    </template>
                </el-table-column>
                <el-table-column
                    label="落款"
                    align="center"
                    width="180"
                    :resizable="false"
                >
                    <template slot-scope="scope">
                        {{ scope.row.inscribe || scope.row.createUserName }}
                    </template>
                </el-table-column>
                <el-table-column
                    label="创建时间"
                    align="center"
                    width="180"
                    :resizable="false"
                >
                    <template slot-scope="scope">
                        {{ scope.row.createTime.slice(0, scope.row.createTime.indexOf('.')) }}
                    </template>
                </el-table-column>
                <el-table-column
                    label="发布时间"
                    align="center"
                    width="180"
                    :resizable="false"
                >
                    <template slot-scope="scope">
                        {{ scope.row.voteStatus === 1 ? '--' : scope.row.sendTime.slice(0,
                        scope.row.sendTime.indexOf('.')) }}
                    </template>
                </el-table-column>
                <!--                <el-table-column-->
                <!--                    label="状态"-->
                <!--                    align="center"-->
                <!--                    width="150"-->
                <!--                    :resizable="false"-->
                <!--                >-->
                <!--                    <template slot-scope="scope">-->
                <!--                        <el-tag  size="mini" type="primary" v-if="scope.row.voteStatus === 2">-->
                <!--                            已发布-->
                <!--                        </el-tag>-->
                <!--                        <el-tag  size="mini" type="danger" v-else>-->
                <!--                            未发布-->
                <!--                        </el-tag>-->
                <!--                    </template>-->
                <!--                </el-table-column>-->
                <el-table-column
                    label="操作"
                    align="center"
                    width="200"
                    fixed="right"
                    :resizable="false"
                >
                    <template slot-scope="scope">
<!--                        <el-button-->
<!--                            size="small"-->
<!--                            type="text"-->
<!--                            @click="jumpToPage('questionnaireCopy', {id: scope.row.id})"-->
<!--                        >复制-->
<!--                        </el-button>-->
                        <!--                        <el-button-->
                        <!--                            size="small"-->
                        <!--                            type="text"-->
                        <!--                            @click="jumpToPage('questionnaireEdit', {id: scope.row.id})"-->
                        <!--                            :disabled="scope.row.voteStatus !== 1"-->
                        <!--                        >编辑-->
                        <!--                        </el-button>-->
<!--                        <el-button size="small" type="text" @click="deleteHandler(scope.$index, scope.row)">删除-->
<!--                        </el-button>-->
                        <el-button
                            :disabled="scope.row.voteStatus !== 2"
                            size="small"
                            type="text"
                            @click="jumpToPage('questionnaireResult', {voteId: scope.row.id, sendUserType: scope.row.sendUserType, isArea: 1})"
                        >问卷统计
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination-container">
                <el-pagination
                    @size-change="sizeChangeHandler"
                    @current-change="currentChangeHandler"
                    :current-page.sync="pagination.pageNo"
                    :page-sizes="[10 , 20, 30, 50]"
                    :page-size="pagination.pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :page-count="pagination.pages"
                    :total="pagination.total"
                >
                </el-pagination>
            </div>
        </div>
    </div>
</template>

<script>
    import BackTool from '@/components/BackTool';
    import SchoolYearSelector from '@/components/SchoolYearSelector';
    import baseMixin from '@/mixins/baseMixin';
    import {getVoteTwoList, delVoteTwoById} from '@/api/questionnaire';
    import windowResizeMixin from '@/mixins/windowResize';

    const stateMapping = {
        draft: 1,
        active: 2,
        inactive: 3
    };
    export default {
        name: "questionnaireListFromBoe",
        mixins: [windowResizeMixin, baseMixin],
        data: function () {
            return {
                searchTitle: '',
                loadingState: {
                    search: false
                },
                selectedDatalist: [],
                dataList: [],
                activeName: 'three'
            }
        },
        created() {
            this.getVoteTwoListFunc();
        },
        components: {BackTool, SchoolYearSelector},
        methods: {
            tabsfun() {
                if (this.activeName == 'two') {
                    this.$router.push({
                        path: "questionnaireList"
                    });
                } else if (this.activeName == 'one') {
                    this.$router.push({
                        path: "questionnairePersonalList"
                    });
                }

            },
            getVoteTwoListFunc() {
                getVoteTwoList({
                    voteTitle: this.searchTitle,
                    pageNo: this.pagination.pageNo,
                    pageSize: this.pagination.pageSize,
                    searchType: 1
                })
                    .then(res => res.data)
                    .then(data => {
                        const pageData = data.data;
                        this.pagination.total = pageData.pagination.total;
                        this.dataList = pageData.dataList;
                    })
            },
            deleteHandler(index, questionItem) {
                this.$confirm('是否确定要删除该问卷', '删除', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    delVoteTwoById({
                        voteId: questionItem.id
                    })
                        .then(res => res.data)
                        .then(data => {
                            if (data.result) {
                                const _this = this;
                                this.$message({
                                    message: '删除成功！',
                                    type: 'success',
                                    duration: 1000,
                                    onClose: function () {
                                        _this.getVoteTwoListFunc();
                                    }
                                });
                            }
                        })
                }).catch(() => {
                });
            },
            searchTitleHandler() {
                this.searchTitle = this.searchTitle.trim();
                this.pagination.pageNo = 1;
                this.getVoteTwoListFunc();
            },
            currentChangeHandler(pageNo) {
                this.pagination.pageNo = pageNo;
                this.getVoteTwoListFunc();
            },
            sizeChangeHandler(pageSize) {
                this.pagination.pageSize = pageSize;
                this.pagination.pageNo = 1;
                this.getVoteTwoListFunc();
            },

        },
        filters: {
            trimTime(datetime) {
                return datetime ? datetime.slice(0, datetime.lastIndexOf('.')) : '';
            }
        }
    }
</script>
<style scoped>
    .questionnaireList .el-table__fixed-right:before, .questionnaireList .el-table__fixed:before {
        display: none;
    }
</style>

<style scoped lang="scss">
    @import "../../styles/mixin";

    .page {
        padding: 12px;
    }

    .page-header {
        padding-bottom: 10px;
        @include clearfix;
    }

    .search-input {
        vertical-align: middle;
    }

    .filter-container {
        width: 100%;
        text-align: center;
        top: 20px;
        right: 0;
    }

</style>
