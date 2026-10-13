<template>
    <div id="noticeIndex" class="app-container calendar-list-container">
        <div class="filter-container">
            <el-input class="search-input search-input--right"
                      size="medium"
                      placeholder="活动名称" icon="el-icon-search" @keyup.enter.native="handleInputChange"
                      v-model.trim="searchTitle">
                <el-button slot="append" icon="el-icon-search" @click="handleInputChange"></el-button>
            </el-input>
        </div>
        <el-table ref="table" stripe :data="dataList" border fit highlight-current-row
                  style="width: 100%" :height="nobottommaxH - 35">
            <el-table-column align="center" label="考评标题" show-overflow-tooltip min-width="32%">
                <template slot-scope="scope">
                    <span >
                        {{scope.row.title}}
                    </span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="班级评审时间" min-width="20%">
                <template slot-scope="scope">
                    <span>{{scope.row.classBehStartDate | trimTimeHour}}&nbsp;至&nbsp;{{scope.row.classBehEndDate | trimTimeHour}}</span>
                </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip align="center" label="负责班级数" min-width="10%">
                <template slot-scope="scope">
                    <span>{{scope.row.totalCount}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="已完成班评数" min-width="10%">
                <template slot-scope="scope">
                    <span>{{scope.row.reportCount}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="活动状态" min-width="10%">
                <template slot-scope="scope">
                    <span v-if="scope.row.state == 1">草稿</span>
                    <template v-else>
                        <span v-if="currentDate < scope.row.startDate">未开始</span>
                        <span v-else-if="currentDate > scope.row.classBehEndDate">已结束</span>
                        <span v-else>进行中</span>
                    </template>
                </template>
            </el-table-column>

            <el-table-column align="center" label="操作" min-width="18%">
                <template slot-scope="scope">
                    <el-button v-if="currentDate > scope.row.classBehEndDate || (scope.row.stuBehActivityClass && scope.row.stuBehActivityClass.reportState == 2)" size="small" type="text" @click="jumpToPage('teacherClassList', {id: scope.row.id, classId, activityName: scope.row.title, isDetailOnly: 1})">查看
                    </el-button>
                    <el-button v-else size="small" type="text" @click="jumpToPage('teacherClassList', {id: scope.row.id, classId, activityName: scope.row.title})">评比管理
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
                :total="pagination.total"
            >
            </el-pagination>
        </div>
    </div>
</template>

<script>
    import moment from 'moment';

    import baseMixin from '@/mixins/baseMixin';
    import mixin from '@/mixins/windowResize';
    import {
        getStuBehActivityListByTh
    } from '@/api/studentAwarding';

    export default {
        name: 'studentAwardingTeacherActivityList',

        mixins: [baseMixin, mixin],
        filters: {
            trimTime(datetime){
                return datetime ? datetime.slice(0, datetime.lastIndexOf('.')) : '--';
            },
            trimTimeHour(datetime){
                return datetime ? datetime.slice(0, datetime.lastIndexOf(':')) : '--';
            }
        },
        activated() {
            this.getList();
        },
        created() {
            this.getList();
        },
        data() {
            return {
                searchTitle: '',
                classId: 0,
                allClassList: [],
                dataList: [],
                currentDate: moment().format('YYYY-MM-DD HH:mm')
            }
        },
        methods: {
            getList() {
                getStuBehActivityListByTh({
                    pageNo: this.pagination.pageNo,
                    pageSize: this.pagination.pageSize,
                    title: this.searchTitle
                })
                    .then(res => res.data)
                    .then(data => {
                        this.pagination.total = data.data.pagination.total;
                        this.dataList = data.data.dataList;
                    })
            },
            handleInputChange() {
                this.getList();
            },
            sizeChangeHandler() {
                this.pagination.pageNo = 1;
                this.getList();
            },
            currentChangeHandler() {
                this.getList();
            },
        }
    }
</script>

<style scoped lang="scss">
    @import "../../styles/mixin";
    .filter-container {
        @include clearfix;
    }
</style>
