<template>
    <div class="page">
        <div class="filter-container">
            <el-row>
                <el-col :span="19">
                    <school-year-selector @change="getVoteListByUserIdsFunc"></school-year-selector>
                </el-col>
                <el-col :span="5">
                </el-col>
            </el-row>
        </div>
        <div>

            <el-table
                :data="dataList"
                border
                style="width: 100%"
                :height="notbmaxH - 60"
            >
                <el-table-column
                    label="标题"
                    show-overflow-tooltip
                    :resizable="false"
                >
                    <template slot-scope="scope">
                        <router-link v-if="scope.row.isVote === 1" class="link-type" :to="{ path: 'questionnaireUserPersonalDetail', query: { voteId: scope.row.id, userId: scope.row.userId } }">
                            <span v-if="scope.row.sendUserType !== 1">({{scope.row.userName}})</span>{{ scope.row.voteTitle }}
                        </router-link>
                        <router-link v-else class="link-type" :to="{ path: 'questionnaire', query: { id: scope.row.id, userId: scope.row.userId } }">
                            <span v-if="scope.row.sendUserType !== 1">({{scope.row.userName}})</span>{{ scope.row.voteTitle }}
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
                    width="180px"
                    :resizable="false"
                >
                    <template slot-scope="scope">
                        {{ scope.row.expriyDate | trimTime }}
                    </template>
                </el-table-column>
                <el-table-column
                    label="落款"
                    align="center"
                    width="180px"
                    :resizable="false"
                >
                    <template slot-scope="scope">
                        {{ scope.row.inscribe ? scope.row.inscribe : scope.row.createUserName }}
                    </template>
                </el-table-column>
                <el-table-column
                    label="发布时间"
                    align="center"
                    width="180px"
                    :resizable="false"
                >
                    <template slot-scope="scope">
                        <span v-if="scope.row.voteStatus === 1">--</span>
                        <span v-else-if="scope.row.onTime == 2">
                                {{scope.row.onSendTimeFormated}}
                            </span>
                        <span v-else>
                                {{scope.row.sendTime.slice(0, scope.row.sendTime.indexOf('.'))}}
                            </span>
                    </template>
                </el-table-column>
                <el-table-column
                    label="状态"
                    align="center"
                    width="150px"
                    :resizable="false"
                >
                    <template slot-scope="scope">
                        <el-tag  size="mini" type="danger" v-if="scope.row.isEnd">
                            已结束
                        </el-tag>
                        <el-tag  size="mini" type="primary" v-else-if="scope.row.isVote === 1">
                            已完成
                        </el-tag>
                        <el-tag  size="mini" type="primary" v-else>
                            进行中
                        </el-tag>
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
    import SchoolYearSelector from '@/components/SchoolYearSelector';
    import baseMixin from '@/mixins/baseMixin';
    import {getVoteListByUserIds} from '@/api/questionnaire';
    import windowResizeMixin from '@/mixins/windowResize';
    import moment from 'moment';

    const stateMapping = {
        draft: 1,
        active: 2,
        inactive: 3
    };
    export default {
        name: "questionnairePersonalList",
        mixins: [windowResizeMixin, baseMixin],
        data: function () {
            return {
                searchTitle: '',
                activeIndex: 0,
                loadingState: {
                    search: false
                },
                selectedDatalist: [],
                dataList: [],
                activeName:'one'
            }
        },
        components: {SchoolYearSelector},
        created() {
            this.getVoteListByUserIdsFunc();
        },
        methods: {
            getVoteListByUserIdsFunc() {
                getVoteListByUserIds({
                    pageNo: this.pagination.pageNo,
                    pageSize: this.pagination.pageSize
                })
                    .then(res => res.data)
                    .then(data => {
                        const current = moment().format('YYYY-MM-DD HH:mm');
                        data.data.dataList.forEach(item => {
                            item.onSendTimeFormated = item.onTime == 2 ? item.onSendTime.slice(0, item.onSendTime.indexOf('.')) : '';
                            item.isEnd = current > item.expriyDate;
                        });
                        const pageData = data.data;
                        this.pagination.total = pageData.pagination.total;
                        this.dataList = pageData.dataList;
                    })
            },
            currentChangeHandler(pageNo) {
                this.pagination.pageNo = pageNo;
                this.getVoteListByUserIdsFunc();
            },
            sizeChangeHandler(pageSize) {
                this.pagination.pageSize = pageSize;
                this.pagination.pageNo = 1;
                this.getVoteListByUserIdsFunc();
            },
            changeTab(activeIndex) {
                this.activeIndex = activeIndex;
            }

        },
        filters: {
            trimTime(datetime) {
                return datetime ? datetime.slice(0, datetime.lastIndexOf('.')) : '';
            }
        }
    }
</script>

<style scoped lang="scss">
    .page-header {
        padding-bottom: 10px;
    }
    .page {
        padding: 12px;
    }
    .header {
        padding-bottom: 10px;
    }

    .filter-container {
        width: 100%;
        top: 20px;
        right: 0;
    }
    .search-input {
        vertical-align: middle;
        margin-left: 10px;
        width: 220px;
    }
</style>
