<template>
    <div style="padding:10px">
        <div class="header">
            <el-row>
                <el-col :span="19">
                    <el-button v-if="(isStandalone && !noBack) || isShowBack" type="default" size="medium"
                               @click="$router.back()">返回
                    </el-button>
                    <el-date-picker size="medium" ref="date" class="filter-item" v-model="duration" type="daterange"
                                    format="yyyy-MM-dd"
                                    value-format="yyyy-MM-dd"
                                    :editable="false" :clearable="false" align="right" unlink-panels placeholder="选择时间范围"
                                    @change="getThAskListByDateFunc"></el-date-picker>
                    <el-select v-model="lt" multiple size="medium" placeholder="请选择请假类型" @change="currentChangeHandler(1)">
<!--                        <el-option label="全部" :value="-1">-->
<!--                        </el-option>-->
                        <el-option v-for="item in leaveTypeList" :label="item.leaveTypeName" :value="item.leaveTypeId">
                        </el-option>
                    </el-select>
                    <el-select v-model="ls" multiple size="medium" @change="getThAskListByDateFunc" placeholder="请选择请假状态">
<!--                        <el-option label="全部" value="0"></el-option>-->
                        <el-option label="草稿" value="1"></el-option>
                        <el-option label="进行中" value="2"></el-option>
                        <el-option label="退回" value="3"></el-option>
                        <el-option label="撤销" value="4"></el-option>
                        <el-option label="已完结" value="5"></el-option>
                    </el-select>
                    <a :href="exportUrl" target="_blank" download="请假列表" v-if="dataList.length">
                        <el-button type="primary" size="medium">导出</el-button>
                    </a>
                    <el-button type="primary" size="medium" @click="$router.push('createLeave')">请假</el-button>
                    <el-button v-if="isShowByPermission('/thAskLeaveFour/getThAskListByElse')" type="primary" size="medium" @click="$router.push({
                        path: 'createLeave',
                        query: { applyFor: 1 }
                    })">代请假</el-button>
                </el-col>
                <el-col :span="5">
                    <el-input placeholder="请输入姓名" icon="el-icon-search" size="medium" class="search-input"
                              v-model.trim="teacherName" @keyup.enter.native="handleFilter">
                        <el-button slot="append" icon="el-icon-search" @click="handleFilter"></el-button>
                    </el-input>
                </el-col>
            </el-row>

        </div>
        <div class="main-container">
            <el-table stripe :data="dataList" border style="width: 100%;" :height="maxH">
                <el-table-column label="姓名" prop="teacherName">
                    <template slot-scope="scope">
                        <router-link style="color: #409EFF;" :to="{ path: 'leaveDetail', query: { id: scope.row.id } }">
                            {{scope.row.teacherName}}
                        </router-link>
                    </template>

                </el-table-column>
                <el-table-column label="部门" prop="departName"></el-table-column>
                <el-table-column label="类型" prop="leaveTypeName"></el-table-column>
                <el-table-column label="内容" width="300">
                    <template slot-scope="scope">
                        {{ scope.row.content }}
                    </template>
                </el-table-column>
                <el-table-column label="开始时间" prop="startDate" width="250">
                    <template slot-scope="scope">
                        {{ scope.row.startTime.slice(0, -2) + getWeekDay(scope.row.startTime) }}
                    </template>
                </el-table-column>
                <el-table-column label="结束时间" prop="endDate" width="250">
                    <template slot-scope="scope">
                        {{ scope.row.endTime.slice(0, -2) + getWeekDay(scope.row.endTime) }}
                    </template>
                </el-table-column>
                <el-table-column label="请假时长">
                    <template slot-scope="scope">
                        {{ scope.row.timeLengthJson ? JSON.parse(scope.row.timeLengthJson).dateCountName : '' }}
                    </template>
                </el-table-column>
                <el-table-column label="审批人" show-overflow-tooltip width="200px" prop="batchUserNames">
                </el-table-column>
                <el-table-column label="状态" show-overflow-tooltip width="200px">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.leaveState == 1">草稿</el-tag>
                        <el-tag v-else-if="scope.row.leaveState == 2">进行中</el-tag>
                        <el-tag v-else-if="scope.row.leaveState == 3" type="danger">退回</el-tag>
                        <el-tag v-else-if="scope.row.leaveState == 4" type="danger">撤销</el-tag>
                        <el-tag v-else type="success">已完结</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="120">
                    <template slot-scope="scope">
                        <template v-if="scope.row.leaveState == 1 || scope.row.leaveState == 3">
                            <el-button type="text" size="small" @click="$router.push({
                                path: 'updateLeave',
                                query: { id: scope.row.id }
                            })">编辑</el-button>
                        </template>
                        <template v-if="isLeader || scope.row.leaveState == 1 || scope.row.leaveState == 3">
                            <el-button type="text" size="small" @click="deleteHandler(scope.row)">删除</el-button>
                        </template>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination-container">
                <el-pagination @size-change="sizeChangeHandler" @current-change="currentChangeHandler"
                               :current-page.sync="pagination.pageNo" :page-sizes="[10, 20, 30, 50]"
                               :page-size.sync="pagination.pageSize" layout="total, sizes, prev, pager, next, jumper"
                               :total="pagination.total"></el-pagination>
            </div>
        </div>
    </div>
</template>

<script>
    import {
        getThAskListByDate,
        getWorkFlow,
        delThAskLeaveFour,
        askLeaveCancelFireByUserIdAndDate
    } from '@/api/teacherLeave4'
    import { isShowByPermission } from "@/utils";
    import {possessRole} from '@/api/supplyClass';
    import {getThAskLeaveFourInit} from '@/api/systemSet/teacherLeave4Setting'
    import mixins from '@/mixins/windowResize'
    import BaseMixin from '@/mixins/baseMixin'
    import {mapGetters} from 'vuex'
    import {getSchoolYearDate} from '@/api/metting';
import { apply } from 'file-loader';

    export default {
        name: 'leaveTable',
        data() {
            return {
                ls: [],
                lt: [],
                duration: [this.$moment().startOf('month').format('YYYY-MM-DD'), this.$moment().format('YYYY-MM-DD')],
                dataList: [],
                leaveState: '0',
                workFlowId: '',
                showStopFire: 1,
                isShowBack: false,
                leaveTypeList: [],
                leaveType: this.$route.query.leaveType === undefined || this.$route.query.leaveType === null ? -1 : this.$route.query.leaveType,
                teacherName: this.$route.query.userName || '',
                isLeader: false
            }
        },
        computed: {
            ...mapGetters(['isStandalone']),
            exportUrl() {
                return `${global.BasePath}structure/thAskLeaveFour/exportThAskleaveList?startDate=${this.$moment(this.duration[0]).format('YYYY-MM-DD')}&endDate=${this.$moment(this.duration[1]).format('YYYY-MM-DD')}&leaveState=-1&token=${this.$store.getters.token}&teacherName=${this.teacherName}&leaveStateListStr=${this.ls.join(',')}&leaveTypeListStr=${this.lt.join(',')}`
            },
            noBack() {
                return window.sessionStorage.getItem('noBack') == 1
            },
            getWeekDay() {
                return function (val) {
                    if (val) {
                        let weekDay = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
                        return '(' + weekDay[new Date(val.slice(0, 10).replace(/\-/g, '/')).getDay()] + ')'
                    } else {
                        return ''
                    }
                }
            }
        },
        filters: {
            timeFilter(value) {
                return value.slice(0, value.lastIndexOf(':'))
            }
        },
        mixins: [BaseMixin, mixins],
        created() {
            if (this.$route.query.startDate) {
                this.duration = [this.$route.query.startDate, this.$route.query.endDate];
                this.isShowBack = true;
            } else if (this.$route.query.date) {
                this.daterange = [`${this.$route.query.date}-01`, moment(`${this.$route.query.date}-01`).endOf('month').format('YYYY-MM-DD')];
                this.isShowBack = true;
            }
              getSchoolYearDate({
                    schoolId: this.$store.getters.schoolInfo.id
                }).then(res => res.data)
                    .then(data => {
                        if (data.code === 200) {
                            const schoolDate = data.data;
                            if(schoolDate){
                               this.duration=[this.$moment().startOf('month').format('YYYY-MM-DD'),this.$moment(schoolDate.endDate).format('YYYY-MM-DD')]
                            }
                               getThAskLeaveFourInit()
                .then(res => res.data)
                .then(data => {
                    const pageData = data.data;
                    this.leaveTypeList = data.data.leaveTypeList;
                    this.showStopFire = pageData.showStopFire
                })
            getWorkFlow({
                workFlowType: 'askLeave'
            })
                .then(res => res.data)
                .then(data => {
                    this.workFlowId = data.data.id
                })
            this.getThAskListByDateFunc()
                        }
                    })
         
        },
        activated() {
            // 判断是否是 学校管理员 部门主任 校领导 部门副主任 客服 和 微研客服
			possessRole('2,8,275,280,191,10020').then(res => {
                this.isLeader = res.data.data.result
            })
               this.leaveType=this.$route.query.leaveType === undefined || this.$route.query.leaveType === null ? -1 : this.$route.query.leaveType
            this.teacherName=this.$route.query.userName || ''
            getThAskLeaveFourInit()
                .then(res => res.data)
                .then(data => {
                    const pageData = data.data;
                    this.leaveTypeList = data.data.leaveTypeList;
                    this.showStopFire = pageData.showStopFire
                })
            getWorkFlow({
                workFlowType: 'askLeave'
            })
                .then(res => res.data)
                .then(data => {
                    this.workFlowId = data.data.id
                })
            this.getThAskListByDateFunc()
        },
        methods: {
            //权限
            isShowByPermission,
            handleFilter() {
                this.pagination.pageNo = 1
                this.getThAskListByDateFunc()
            },
            sizeChangeHandler(pageSize) {
                this.pagination.pageNo = 1
                this.pagination.pageSize = pageSize
                this.getThAskListByDateFunc()
            },
            currentChangeHandler(pageNo) {
                this.pagination.pageNo = pageNo
                this.getThAskListByDateFunc()
            },
            getThAskListByDateFunc() {
                getThAskListByDate({
                    startDate: this.$moment(this.duration[0]).format('YYYY-MM-DD'),
                    endDate: this.$moment(this.duration[1]).format('YYYY-MM-DD'),
                    pageNo: this.pagination.pageNo,
                    pageSize: this.pagination.pageSize,
                    leaveStateListStr: this.ls.join(','),
                    leaveTypeListStr: this.lt.join(','),
                    teacherName: this.teacherName
                })
                    .then(res => res.data)
                    .then(data => {
                        this.dataList = data.data.dataList
                        this.pagination.total = data.data.pagination.total
                    })
            },
            deleteHandler(item) {
                this.$confirm('是否确认删除该请假？', '删除', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    delThAskLeaveFour({
                        workFlowId: this.workFlowId,
                        askId: item.id
                    })
                        .then(res => res.data)
                        .then(data => {
                            if (data.result) {
                                new Promise(resolve => {
                                    if (this.showStopFire == 2) {
                                        askLeaveCancelFireByUserIdAndDate({
                                            userId: item.teacherId,
                                            startDate: item.startDate,
                                            endDate: item.endDate
                                        })
                                            .then(res2 => res2.data)
                                            .then(data2 => {
                                                if (data2.result) {
                                                    resolve()
                                                }
                                            })
                                    } else {
                                        resolve()
                                    }
                                }).then(() => {
                                    this.$message.success('删除成功')
                                    this.getThAskListByDateFunc()
                                })
                            }
                        })
                })
            }
        }
    }
</script>

<style lang="scss" scoped>
    .main-container {
        margin-top: 10px;
    }

    .header {
        margin-bottom: 10px;
        font-size: 14px;

        .el-input {
            width: auto;
        }
    }
</style>
