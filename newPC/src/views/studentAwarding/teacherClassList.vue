<template>
    <div id="noticeIndex" class="app-container calendar-list-container">
        <backtool>
        </backtool>
        <div class="filter-container">
            评优活动：{{activityName}}
        </div>
        <el-table stripe :data="dataList" border fit highlight-current-row
                  style="width: 100%" :height="nobottommaxH - 35">
            <el-table-column align="center" label="年级" show-overflow-tooltip>
                <template slot-scope="scope">
                    <span >
                        {{scope.row.gradeName}}
                    </span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="班级">
                <template slot-scope="scope">
                    <span>{{scope.row.className}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="班主任通知时间">
                <template slot-scope="scope">
                    <span>{{scope.row.remindTime | trimTime}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="参加评比人数">
                <template slot-scope="scope">
                    <span>{{scope.row.totalCount}}</span>

                </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip align="center" label="未评人数">
                <template slot-scope="scope">
                    <span>{{scope.row.totalCount - scope.row.reportCount}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="负责科目">
                <template slot-scope="scope">
                    <span>{{scope.row.curriculumName}}</span>
                </template>
            </el-table-column>

            <el-table-column align="center" label="是否上报至班主任">
                <template slot-scope="scope">
                    <span>{{['否', '否', '是', '', '被退回'][scope.row.reportState]}}</span>
                    <el-tooltip v-if="scope.row.reportState == 4" class="item" effect="dark" placement="top">
                        <div slot="content" class="comment-extend-container">{{scope.row.batchContent}}</div>
                        <div class="comment-container">
                            {{scope.row.batchContent}}
                        </div>
                    </el-tooltip>
                </template>
            </el-table-column>
            <el-table-column align="center" label="操作">
                <template slot-scope="scope">
                    <el-button v-if="!isDetailOnly && (scope.row.reportState == 0 || scope.row.reportState == 1 || scope.row.reportState == 4)" size="small" type="text" @click="jumpToPage('teacherRollList', {id: scope.row.activityId, curriculumId: scope.row.curriculumId, className: scope.row.className, classId: scope.row.classId, activityName, isStartBeh: scope.row.stuBehActivityClass ? scope.row.stuBehActivityClass.isStartBeh : 1})">评比
                    </el-button>
                    <el-button v-else-if="scope.row.reportState == 2 || scope.row.reportState == 4" size="small" type="text" @click="jumpToPage('teacherShowList', {id: scope.row.activityId, curriculumId: scope.row.curriculumId, className: scope.row.className, classId: scope.row.classId, activityName, isStartBeh: scope.row.stuBehActivityClass ? scope.row.stuBehActivityClass.isStartBeh : 1})">查看
                    </el-button>
                </template>
            </el-table-column>

        </el-table>
    </div>
</template>

<script>
    import baseMixin from '@/mixins/baseMixin';
    import mixin from '@/mixins/windowResize';
    import {getStuBehClassCurrListByTh} from '@/api/studentAwarding';

    export default {
        name: 'studentAwardingTeacherClassList',

        mixins: [baseMixin, mixin],
        filters: {
            trimTime(datetime){
                return datetime ? datetime.slice(0, datetime.lastIndexOf('.')) : '--';
            }
        },
        created() {
            this.getList();
        },

        data() {
            return {
                isDetailOnly: this.$route.query.isDetailOnly == 1,
                id: this.$route.query.id,
                activityName: this.$route.query.activityName,

                searchTitle: '',
                allClassList: [],
                state: 0,
                dataList: []
            }
        },
        methods: {
            getList() {
                getStuBehClassCurrListByTh({
                    activityId: this.id
                })
                    .then(res => res.data)
                    .then(data => {
                        this.dataList = data.data;
                    })
            },
            handleInputChange() {
                this.getList();
            },
            pushMessageFunc() {
                // 您还有未审核的学生申请，请先审核！
                this.$confirm('是否推送消息至任课老师？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {

                });
            }
        }
    }
</script>

<style scoped>
    .filter-container {
        padding-top: 10px;
        font-size: 20px;
        padding-bottom: 14px;
    }
    .comment-container {
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        color: #F08080;
    }
    .comment-extend-container {
        width: 200px;
    }
</style>
