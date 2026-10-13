<template>
    <div id="noticeIndex" class="app-container calendar-list-container">
        <backtool>
           <el-select v-model="gradeId" @change="getList" placeholder="请选择年级" size="medium">
                <el-option :key="0" label="全部年" :value="0">
                </el-option>
                <el-option v-for="item in allGradeList" :key="item.gradeId" :label="item.gradeName" :value="item.gradeId">
                </el-option>
            </el-select>
            <el-select @change="getList" v-model="reportState" placeholder="请选择上报状态" size="medium">
                <el-option label="全部上报状态" :value="0"></el-option>
                <el-option label="未上报" :value="1"></el-option>
                <el-option label="已上报" :value="2"></el-option>
                <el-option label="被退回" :value="4"></el-option>
            </el-select>
        </backtool>
        <el-table stripe :data="dataList" border fit highlight-current-row
                  style="width: 100%" :height="nobottommaxH - 25">
            <el-table-column align="center" label="班级" show-overflow-tooltip>
                <template slot-scope="scope">
                    {{scope.row.className}}
                </template>
            </el-table-column>
            <el-table-column align="center" label="上报学生数">
                <template slot-scope="scope">
                    <span>{{scope.row.reportCount}}</span>
                </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip align="center" label="上报时间">
                <template slot-scope="scope">
                    {{scope.row.createTime | trimTime}}
                </template>
            </el-table-column>
            <el-table-column align="center" label="上报人">
                <template slot-scope="scope">
                    <span>{{scope.row.createUserName}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="上报状态">
                <template slot-scope="scope">
                    <el-tag  size="mini" type="info" v-if="scope.row.reportState == 1">未上报</el-tag>
                    <el-tag  size="mini" type="success" v-else-if="scope.row.reportState == 2">已上报</el-tag>
                    <el-tag  size="mini" type="warning" v-else-if="scope.row.reportState == 4">被退回</el-tag>
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
                    <el-button size="small" type="text" @click="jumpToPage('activityClassStudentList', {id, classId: scope.row.classId, reportState: scope.row.reportState})">查看
                    </el-button>
                </template>
            </el-table-column>

        </el-table>

    </div>
</template>

<script>
    import baseMixin from '@/mixins/baseMixin';
    import mixin from '@/mixins/windowResize';
    import {
        getStuBehGradeListByUserId,
        getStuBehClassList
    } from '@/api/studentAwarding';
    export default {
        name: 'studentAwardingActivityClassList',
        mixins: [baseMixin, mixin],
        filters: {
            trimTime(datetime) {
                return datetime ? datetime.slice(0, datetime.lastIndexOf('.')) : '--';
            }
        },
        data() {
            return {
                id: this.$route.query.id,
                gradeId: 0,
                allGradeList: [],
                reportState: 0,
                dataList: []
            }
        },
        created() {
            getStuBehGradeListByUserId({
                activityId: this.id
            })
                .then(res => res.data)
                .then(data => {
                    this.allGradeList = data.data;
                });
            this.getList();
        },
        methods: {
            getList() {
                getStuBehClassList({
                    activityId: this.id,
                    gradeId: this.gradeId,
                    reportState: this.reportState
                })
                    .then(res => res.data)
                    .then(data => {
                        this.dataList = data.data;
                    })
            }
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
    .comment-extend-container {
        width: 200px;
    }
</style>
