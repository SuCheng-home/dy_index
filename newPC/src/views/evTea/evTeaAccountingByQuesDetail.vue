<!--用户已发送通知列表-->
<template>
    <div id="noticeIndex" class="app-container calendar-list-container">
        <backtool>
        </backtool>
        <el-table stripe :data="dataList" border fit highlight-current-row
                  style="width: 100%" :height="maxH"
        >
            <el-table-column
                label="任课老师"
                align="center"
            >
                <template slot-scope="scope">
                    {{scope.row.tempTeacherName}}
                </template>
            </el-table-column>
            <el-table-column align="center" label="任教班级" prop="className">
            </el-table-column>
            <el-table-column align="center" label="任教科目" prop="tempCurrName">
            </el-table-column>
            <el-table-column align="center" label="投票数" prop="stuCount">
            </el-table-column>
            <el-table-column align="center" label="投票人数" prop="peopleCount">
            </el-table-column>
            <el-table-column show-overflow-tooltip align="center" :label="`选项${optionNum}`" v-for="(optionNum, optionIndex) in opionNumList">
                <template slot-scope="scope">
                    <span>{{scope.row.voteCountList[optionIndex]}}</span> /
                    <span>{{scope.row.voteCountList[optionIndex] == 0 ? '--' : `${(scope.row.voteCountList[optionIndex] / scope.row.stuCount * 100).toFixed(2)}%`}}</span>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
    import mixin from '@/mixins/windowResize';
    import baseMixin from '@/mixins/baseMixin';
    import {isShowByPermission} from '@/utils';
    import {
        getEvaluateCurrTopicStaticListByThId,
    } from '@/api/evTea';
    export default {
        data() {
            return {
                dataList: [],
                opionNumList: [],
                studentName: '',
                batchId: this.$route.query.batchId,
                teacherUserId: this.$route.query.teacherUserId,
                currentTopicItem: {},
                currentTopicDetail: [],
                isShowDetail: false
            }
        },
        created() {
            this.getList();
        },
        mixins: [mixin, baseMixin],
        filters: {
            trimTime(datetime) {
                return datetime ? datetime.slice(0, datetime.lastIndexOf('.')) : '--';
            }
        },
        methods: {
            isShowByPermission,
            getList() {
                getEvaluateCurrTopicStaticListByThId({
                    batchId: this.batchId,
                    teacherUserId: this.teacherUserId,
                })
                    .then(res => res.data)
                    .then(data => {
                        const pageData = data.data;
                        console.log(pageData)
                        this.opionNumList = pageData.opionNumList;
                        this.dataList = pageData.userList;
                    })
            },
            jumpToPage(path, query = {}) {
                this.$router.push({
                    path,
                    query
                })
            }
        }
    }
</script>
<style lang="scss">
    .pagination-container {
        margin-top: 10px;
    }
    .el-icon-paperclip {
        margin-right: 3px;
    }
    .text-btn {
        color: #409EFF;
        cursor: pointer;
    }
    .ques-detail {
        margin-bottom: 10px;
    }
</style>
