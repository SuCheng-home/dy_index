<template>
    <div id="noticeIndex" class="app-container calendar-list-container">
        <div class="filter-container">
            <el-row>
                <el-col :span="19">
                    <el-button type="primary" @click="jumpToPage('activityAddEdit')" size="medium" v-if="isShowByPermission('/stuBeh/stuBehAdd')">新建活动</el-button>
                    <!--                    <el-button type="primary" @click="jumpToPage('activityListAll')" size="medium">全部活动</el-button>-->
                </el-col>
                <el-col :span="5">
                    <el-input size="medium"
                              placeholder="活动名称" icon="el-icon-search" @keyup.enter.native="getList"
                              v-model="searchTitle">
                        <el-button slot="append" icon="el-icon-search" @click="getList"></el-button>
                    </el-input>
                </el-col>
            </el-row>
        </div>
        <el-table ref="table" stripe :data="dataList" border fit highlight-current-row  style="width: 100%" :height="nobottommaxH - 40">
            <el-table-column align="center" label="考评标题" show-overflow-tooltip min-width="32%">
                <template slot-scope="scope">
                    <span class="link-type" @click="jumpToPage('activityDetail', {id: scope.row.id})">
                        {{scope.row.title}}
                    </span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="活动时间" min-width="20%">
                <template slot-scope="scope">
                    <span>{{scope.row.startDate | trimTimeHour }}&nbsp;至&nbsp;{{scope.row.endDate | trimTimeHour}}</span>
                </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip align="center" label="活动创建人" min-width="10%">
                <template slot-scope="scope">
                    <span>{{scope.row.createUserName}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="已上报班级/所有班级" min-width="10%">
                <template slot-scope="scope">
                    <span>{{scope.row.reportCount }}/{{scope.row.totalCount}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="活动状态" min-width="10%">
                <template slot-scope="scope">
                    <span v-if="scope.row.state == 1">草稿</span>
                    <template v-else>
                        <span v-if="currentDate < scope.row.startDate">未开始</span>
                        <span v-else-if="currentDate > scope.row.endDate">已结束</span>
                        <span v-else>进行中</span>
                    </template>
                </template>
            </el-table-column>

            <el-table-column align="center" label="操作" min-width="18%">
                <template slot-scope="scope">
                    <el-button size="small" type="text" v-if="isShowByPermission('/stuBeh/stuBehAdd')" @click="jumpToPage('schoolReviewerSetting', {id: scope.row.id})">校评委设置
                    </el-button>
                    <el-button size="small" type="text" v-if="isShowByPermission('/stuBeh/stuBehAdd')" @click="jumpToPage('activityAddEdit', {id: scope.row.id})">编辑
                    </el-button>
                    <el-button size="small" type="text" v-if="isShowByPermission('/stuBeh/stuBehAdd')" @click="deleteHandler(scope.row.id)" class="buttontextred">删除
                    </el-button>
                    <el-button size="small" type="text" v-if="isShowByPermission('/stuBeh/stuBehAdd')" @click="changeAnnouncement(scope.row.isShow != 2, scope.row.id)">{{scope.row.isShow == 2 ? '取消公示' : '开启公示'}}
                    </el-button>
                    <el-button size="small" type="text" @click="jumpToPage(scope.row.behType == 2 ? 'activityAllStudentListSchool' : 'activityAllStudentList', {id: scope.row.id})">查看申报学生
                    </el-button>
                    <el-button size="small" type="text" @click="jumpToPage('activityClassList', {id: scope.row.id})">班评管理
                    </el-button>
                    <el-button size="small" type="text" v-if="scope.row.behType == 2" @click="jumpToPage('activitySchoolStudentList', {id: scope.row.id})">校评管理
                    </el-button>
                    <el-button size="small" type="text" v-if="isShowByPermission('/stuBeh/stuBehAdd')" @click="updateTeacher(scope.row.id)">更新任课老师
                    </el-button>
                    <el-button size="small" type="text" v-if="isShowByPermission('/stuBeh/stuBehAdd')" @click="jumpToPage('activityAddEdit', {newid: scope.row.id})">复制
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
    import baseMixin from '@/mixins/baseMixin';
    import mixin from '@/mixins/windowResize';
    import moment from 'moment';
    import {isShowByPermission} from '@/utils';

    import {
        updateStuBehActivity,
        getStuBehActivityList,
        delStuBehActivity,
        updateStuBehActivityTeacher
    } from '@/api/studentAwarding';

    export default {
        name: 'studentAwardingActivityList',
        mixins: [baseMixin, mixin],
        filters: {
            trimTime(datetime){
                return datetime ? datetime.slice(0, datetime.lastIndexOf('.')) : '--';
            },
            trimTimeHour(datetime){
                return datetime ? datetime.slice(0, datetime.lastIndexOf(':')) : '--';
            }
        },
        data() {
            return {
                searchTitle: '',
                dataList: [],
                currentDate: moment().format('YYYY-MM-DD HH:mm')
            }
        },
        created() {
            this.getList();
        },
        activated() {
            this.getList();
        },
        methods: {
            isShowByPermission,
            sizeChangeHandler() {
                this.pagination.pageNo = 1;
                this.getList();
            },
            currentChangeHandler() {
                this.getList();
            },
            updateTeacher(activityId) {
                updateStuBehActivityTeacher({
                    activityId
                })
                    .then(res => res.data)
                    .then(data => {
                        if(data.result) {
                            this.$message.success('更新成功');
                        } else {
                            this.$message.error(data,msg)
                        }
                    })
            },
            getList() {
                getStuBehActivityList({
                    pageNo: this.pagination.pageNo,
                    pageSize: this.pagination.pageSize,
                    title: this.searchTitle
                })
                    .then(res => res.data)
                    .then(data => {
                        this.dataList = data.data.dataList;
                        this.pagination.total = data.data.pagination.total;
                    })
            },
            deleteHandler(id) {
                this.$confirm('确认删除该活动？', '删除', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    delStuBehActivity({
                        activityId: id
                    })
                        .then(res => res.data)
                        .then(data => {
                            if(data.result) {
                                this.$message.success('删除成功');
                                this.getList();
                            } else {
                                this.$message.error(data,msg)
                            }
                        })
                });
            },
            changeAnnouncement(isOn = true, id) {
                this.$confirm(`确认${isOn ? '公示上报结果' : '取消公示'}？`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let args = {
                        isShow: isOn ? 2 : 1,
                        id
                    };
                    updateStuBehActivity(args)
                        .then(res => res.data)
                        .then(data => {
                            if(data.result) {
                                this.$message.success(`${isOn ? '公示' : '取消'}成功`);
                                setTimeout(() => {
                                    this.getList();
                                }, 500);
                            }
                        })
                });
            }
        }
    }
</script>

<style scoped>

</style>
