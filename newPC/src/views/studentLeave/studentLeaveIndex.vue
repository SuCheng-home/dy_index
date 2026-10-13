<template>
    <div class="leaveContent">
        <div class="header">
            <el-row>
                <el-col :span="20">
                    <el-date-picker v-model="daterange" type="daterange" class="right-line mywidthdaterange" size="medium"  range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" :clearable="false" @change="getList()"></el-date-picker>
                    <class-selector :isShowAll="false" @change="onClassChange"></class-selector>
                    <el-select v-model="leaveState" placeholder="请选择状态" size="medium" style="width: 150px;"
                               @change="getList">
                        <el-option label="全部状态" :value="0"></el-option>
                        <el-option label="未审批" :value="1"></el-option>
                        <el-option label="已审批" :value="2"></el-option>
                        <el-option label="销假" :value="3"></el-option>
                        <el-option label="不同意" :value="4"></el-option>
                        <el-option label="已撤回" :value="5"></el-option>
                    </el-select>
                    <el-button type="primary" size="medium" @click="addStudentLeave">新增</el-button>
                    <a class="export-btn" :href="exportUrl" download="导出结果" target="_blank" v-if="dataList.length">
                        <el-button size="medium" class="filter-item" type="primary" icon="upload">导出</el-button>
                    </a>
                </el-col>
                <el-col :span="4">
                    <el-input size="medium" v-model.trim="studentName" placeholder="请输入姓名姓名" @change="getList">
                        <el-button slot="append" icon="el-icon-search" size="medium" @click="getList"></el-button>
                    </el-input>
                </el-col>
            </el-row>
        </div>
        <div class="leaveList">
            <el-table stripe :data="dataList" border fit highlight-current-row style="width: 100%" :height="maxH">
                <el-table-column align="center" label="姓名" show-overflow-tooltip>
                    <template slot-scope="scope">
                        {{ scope.row.studentName || '--' }}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="性别" show-overflow-tooltip>
                    <template slot-scope="scope">
                        {{ scope.row.gender | filertGender }}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="班级" show-overflow-tooltip>
                    <template slot-scope="scope">
                        {{ scope.row.className || '--' }}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="类型" show-overflow-tooltip>
                    <template slot-scope="scope">
                        {{ scope.row.leaveTypeName || '--' }}
                    </template>
                </el-table-column>
                <el-table-column v-if="isSickTypeGroup == 1" align="center" label="疾病类型" show-overflow-tooltip>
                    <template slot-scope="scope">
                        {{ scope.row.sickTypeName || '--' }}
                    </template>
                </el-table-column>
                <el-table-column v-if="isSickType" align="center" label="疾病症状" show-overflow-tooltip>
                    <template slot-scope="scope">
                        {{ scope.row.symptomJson || '--' }}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="就医情况" show-overflow-tooltip>
                    <template slot-scope="scope">
                        {{ scope.row.medicalType || '--' }}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="就诊医院" show-overflow-tooltip>
                    <template slot-scope="scope">
                        {{ scope.row.hospital || '--' }}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="家长联系方式" show-overflow-tooltip>
                    <template slot-scope="scope">
                        {{ scope.row.mobile || '--' }}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="内容" show-overflow-tooltip>
                    <template slot-scope="scope">
					<span class="link-type" @click="productJump(scope.row.id)">
						{{ scope.row.content }}
					</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="开始日期" show-overflow-tooltip>
                    <template slot-scope="scope">
                        {{ scope.row.startDate + getWeekDay(scope.row.startDate) || '--' }} &nbsp;
                        {{ scope.row.isMorningName != '节次' ? scope.row.isMorningName : '' }}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="请假时长" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span v-if="scope.row.isClassHour == 0">{{ scope.row.leaveDateCount | filterLeaveDateCount }}天</span>
                        <span v-else>{{ scope.row.classHourCount }}节</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="审批人" show-overflow-tooltip>
                    <template slot-scope="scope">
                        {{scope.row.batchUserName || '--'}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="状态" show-overflow-tooltip>
                    <template slot-scope="scope">
                        {{['', '未审批', '已审批', '销假', '不同意', '已撤回'][scope.row.leaveState]}}
                    </template>
                </el-table-column>
                <el-table-column
                    label="操作"
                    align="center"
                    :resizable="false"
                >
                    <template slot-scope="scope">
                        <el-button type="text" v-if="scope.row.leaveType!=8&&scope.row.leaveType!=9&&scope.row.leaveType!=10" :disabled="(scope.row.isClassHour != 0 || scope.row.startDate < termInfo.startDate || scope.row.endDate > termInfo.endDate) || scope.row.leaveState == 5 || scope.row.leaveState == 4" @click="productJump(scope.row.id, true)">编辑</el-button>
                        <el-button type="text" @click="deleteFunc(scope.row.id)"  class="buttontextred">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination-container">
                <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.pageNo" :page-sizes="[10, 20, 30, 50]" :page-size.sync="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
            </div>
        </div>
    </div>
</template>

<script>
    import mixin from '@/mixins/windowResize'
    import baseMixin from '@/mixins/baseMixin'
    import moment from 'moment'
    import {mapGetters} from 'vuex';
    import ClassSelector from '@/components/ClassSelector/ClassSelector'
    import { studentleaveList, getStuAskleaveInitInfo, delStuAskleave } from '@/api/studentLeave'
    import {
        getCurrentSchoolTimeBySchoolId
    } from '@/api/wtManager';
    export default {
        name: 'student-leave-index.vue',
        data() {
            return {
                isSickTypeGroup: 0,
                isSickType: 0,
                daterange: [new Date(), new Date()],
                exportUrl: '',
                dataList: [],
                searchName: '',
                startDate: this.$route.query.startDate,
                endDate: this.$route.query.endDate,
                listQuery: {
                    pageNo: 1,
                    pageSize: 20,
                    startDate: '',
                    endDate: ''
                },
                total: 0,
                termInfo: {
                    endDate: '',
                    startDate: ''
                },
                leaveState: 0,
                classId: 0,
                studentName: ''
            }
        },

        filters: {
            filterLeaveDateCount(val) {
                if (String(val).indexOf('.') == -1) {
                    val += '.0'
                    return val
                } else return val
            },
            filertGender(val) {
                if (val !== null && val !== undefined && val !== '') {
                    return ['--', '男', '女'][val]
                } else {
                    return '--'
                }
            },
            filterDate(val) {
                return val ? moment(val).format('YYYY-MM-DD HH:mm:ss') : '--'
            }
        },
        components: {ClassSelector},
        mixins: [baseMixin, mixin],
        activated(){
            if(this.classId){
               this.userFireAnalysisFunc()
            }
          
        },
        created() {
            getStuAskleaveInitInfo({
                schoolId: this.schoolInfo.id
            })
                .then(res => res.data)
                .then(data => {
                    this.isSickTypeGroup = data.data.isSickTypeGroup
                    this.isSickType = data.data.symptomHav == 2
                })
            getCurrentSchoolTimeBySchoolId()
                .then(res => res.data)
                .then(data => {
                    this.termInfo = data.data;
                });
            if (this.startDate && this.endDate) {
                this.listQuery.startDate = this.startDate
                this.listQuery.endDate = this.endDate
                this.daterange[0] = this.listQuery.startDate
                this.daterange[1] = this.listQuery.endDate
            } else {
                this.daterange[0] = new Date(
                    moment()
                        .set('date', 1)
                        .valueOf()
                )
                this.listQuery.startDate = this.$moment(this.daterange[0]).format('YYYY-MM-DD') //时间
                this.listQuery.endDate = this.$moment(this.daterange[1]).format('YYYY-MM-DD')
            }
            this.userFireAnalysisFunc()
        },
        computed: {
            getWeekDay() {
                return function(val) {
                    let weekDay = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
                    return '(' + weekDay[new Date(val.replace(/\-/g, '/')).getDay()] + ')'
                }
            },
            ...mapGetters(['schoolInfo'])
        },
        methods: {
            onClassChange(classId) {
                this.classId = classId;
                this.getList();
            },
            getList() {
                this.listQuery.pageNo = 1
                this.userFireAnalysisFunc()
            },
            handleSizeChange(val) {
                this.listQuery.pageNo = 1
                this.listQuery.pageSize = val
                this.userFireAnalysisFunc()
            },
            handleCurrentChange(val) {
                this.listQuery.pageNo = val
                this.userFireAnalysisFunc()
            },
            // 获取数据列表
            userFireAnalysisFunc() {
                this.listQuery.startDate = this.$moment(this.daterange[0]).format('YYYY-MM-DD') //时间
                this.listQuery.endDate = this.$moment(this.daterange[1]).format('YYYY-MM-DD') //时间
                studentleaveList({
                    startDate: this.listQuery.startDate,
                    endDate: this.listQuery.endDate,
                    pageNo: this.listQuery.pageNo,
                    pageSize: this.listQuery.pageSize,
                    classId: this.classId,
                    leaveState: this.leaveState,
                    studentName: this.studentName
                })
                    .then(res => res.data)
                    .then(data => {
                        if (data.code === 200) {
                            let tableData = data.data
                            this.dataList = tableData.dataList
                            this.total = tableData.pagination.total
                            this.exportUrl = global.BasePath + 'structure/stuAskleave/exportStuAskleaveListByClassHead?startDate=' + this.listQuery.startDate + '&endDate=' + this.listQuery.endDate + '&classId=' + this.classId + '&leaveState' + this.leaveState + '&token=' + this.$store.getters.token
                        } else {
                            this.$message({
                                type: 'error',
                                message: data.msg
                            })
                        }
                    })
                    .catch(() => {})
            },
            productJump(id, isEdit) {
                this.$router.push({
                    path: 'studentLeaveDetail',
                    query: {
                        askId: id,
                        startDate: this.listQuery.startDate,
                        endDate: this.listQuery.endDate,
                        isEdit: isEdit ? 1 : 0
                    }
                })
            },
            // 跳转新增页面
            addStudentLeave() {
                this.$router.push({
                    path: 'studentLeaveAdd'
                })
            },
            deleteFunc(askId) {
                this.$confirm('是否确认删除?', '删除', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    delStuAskleave({askId})
                        .then(res => {
                            this.getList();
                            this.$message({
                                type: 'success',
                                message: '删除成功!'
                            });
                        }).catch();

                }).catch(() => {
                });
            }
        }
    }
</script>

<style lang="scss" scoped>
    .leaveContent {
        padding: 12px;
        box-sizing: border-box;

        .header {
            margin-bottom: 10px;
            font-size: 14px;

            .el-input {
                width: auto;
            }
        }
    }
</style>
