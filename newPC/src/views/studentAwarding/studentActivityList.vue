<template>
    <div id="noticeIndex" class="app-container calendar-list-container">
        <div class="filter-container">
            <el-row>
                <el-col :span="19">
                    <el-select v-model="classId" @change="getList" placeholder="请选择班级" size="medium">
                        <el-option v-for="item in allClassList" :key="item.id" :label="item.name" :value="item.id">
                        </el-option>
                    </el-select>
                </el-col>
                <el-col :span="5">
                    <el-input size="medium"
                              placeholder="活动名称" icon="el-icon-search" @keyup.enter.native="handleInputChange"
                              v-model="searchTitle">
                        <el-button slot="append" icon="el-icon-search" @click="handleInputChange"></el-button>
                    </el-input>
                </el-col>
            </el-row>
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
                    {{scope.row.classBehStartDate | trimTimeHour}}&nbsp;至&nbsp;{{scope.row.classBehEndDate | trimTimeHour}}
                </template>
            </el-table-column>
            <el-table-column align="center" label="参加考评人数" min-width="10%">
                <template slot-scope="scope">
                    <span>{{scope.row.totalCount}}</span>

                </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip align="center" label="已完成班评人数" min-width="10%">
                <template slot-scope="scope">
                    <span>{{scope.row.reportCount}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="是否上报至学校" min-width="10%">
                <template slot-scope="scope">
                    <div>
                        <span v-if="scope.row.stuBehActivityClass && scope.row.stuBehActivityClass.reportState == 2">已上报</span>
                        <span v-else-if="scope.row.stuBehActivityClass && scope.row.stuBehActivityClass.reportState == 4">被退回</span>
                        <span v-else>未上报</span>
                    </div>
                    <el-tooltip v-if="scope.row.stuBehActivityClass && scope.row.stuBehActivityClass.reportState == 4" class="item" effect="dark" placement="top">
                        <div slot="content" class="comment-extend-container">{{scope.row.stuBehActivityClass.batchContent}}</div>
                        <div class="comment-container">
                            {{scope.row.stuBehActivityClass.batchContent}}
                        </div>
                    </el-tooltip>
                </template>
            </el-table-column>


            <el-table-column align="center" label="操作" min-width="18%">
                <template slot-scope="scope">
                    <el-button  v-if="scope.row.stuBehActivityClass && scope.row.stuBehActivityClass.reportState == 2" size="small" type="text" @click="jumpToPage('studentShowList', {id: scope.row.id, classId, className, activityName: scope.row.title, isStartBeh: scope.row.stuBehActivityClass ? scope.row.stuBehActivityClass.isStartBeh : 1})">查看
                    </el-button>
                    <el-button v-else size="small" type="text" @click="jumpToPage('studentRollList', {id: scope.row.id, classId, className, activityName: scope.row.title, isStartBeh: scope.row.stuBehActivityClass ? scope.row.stuBehActivityClass.isStartBeh : 1})">班级评比
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
    import {mapGetters} from 'vuex';
    import baseMixin from '@/mixins/baseMixin';
    import mixin from '@/mixins/windowResize';
    import {
        getStuBehActivityListByClassId,
    } from '@/api/studentAwarding';
    import {getManageAndOtherDepart} from '@/api/homework';

    export default {
        name: 'studentAwardingStudentActivityList',

        mixins: [baseMixin, mixin],
        filters: {
            trimTime(datetime){
                return datetime ? datetime.slice(0, datetime.lastIndexOf('.')) : '--';
            },
            trimTimeHour(datetime){
                return datetime ? datetime.slice(0, datetime.lastIndexOf(':')) : '--';
            }
        },
        computed: {
            ...mapGetters([
                'userInfo'
            ]),
            className() {
                const obj = this.allClassList.find(item => item.classId == this.classId);
                return obj ? obj.className : '';
            }
        },
        activated() {
            this.init();
        },
        created() {
            this.init();
        },
        data() {
            return {
                searchTitle: '',
                classId: 0,
                allClassList: [],
                dataList: [],
            }
        },
        methods: {
            init() {
                getManageAndOtherDepart({
                    type: 4
                })
                    .then(res => res.data)
                    .then(data => {
                        this.allClassList = data.data;
                        if(data.data && data.data.length !== 0) {
                            this.classId = data.data[0].id;
                            this.getList();
                        }
                    })
            },
            getList() {
                getStuBehActivityListByClassId({
                    title: this.searchTitle,
                    classId: this.classId,
                    pageNo: this.pagination.pageNo,
                    pageSize: this.pagination.pageSize
                })
                    .then(res => res.data)
                    .then(data => {
                        this.dataList = data.data.dataList;
                        this.pagination.total = data.data.pagination.total;
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

<style scoped>
    .comment-container {
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        color: #F08080;
    }
</style>
