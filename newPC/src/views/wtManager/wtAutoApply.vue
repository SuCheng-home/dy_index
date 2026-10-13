<template>
    <div class="wtPointRank">
        <div class="header-wrap">
            <div class="header">
                <el-row>
                    <el-col :span="19">
                        <template v-if="wtManagerRole || wtHeadMasterRole">
                            <el-select v-model="schoolName" placeholder="请选择学期" @change="changeTeam" size="medium">
                                <el-option v-for="item in schoolYearList" :key="item.schoolTimeCode" :label="item.label"
                                           :value="item.schoolTimeName">
                                </el-option>
                            </el-select>
                        </template>
                        <el-select v-model="selectWeek" placeholder="请选择周次" @change="changeWeek" size="medium" class="mini_width">
                            <el-option v-for="item in weekList" :key="item.value" :label="item.label"
                                       :value="item.value">
                            </el-option>
                        </el-select>
                        <!--梧桐信用管理员-->
                        <template v-if="wtManagerRole">
                            <el-select v-model="gradeCode" size="medium" placeholder="请选择年级" @change="changeGrade" class="mini_width">
                                <el-option label="全部年级" :value="0"></el-option>
                                <el-option v-for="item in gradeList" :key="item.id" :label="item.name" :value="item.id">
                                </el-option>
                            </el-select>
                        </template>
                        <template v-if="!wtManagerRole&&wtHeadMasterRole">
                            <el-select v-model="gradeCode" size="medium" placeholder="请选择年级" @change="changeGrade2" class="mini_width">
                                <el-option v-for="item in gradeList" :key="item.id" :label="item.name" :value="item.id">
                                </el-option>
                            </el-select>
                        </template>
                        <!--梧桐信用管理员-->
                        <template v-if="wtManagerRole">
                            <el-select v-model="classCode" size="medium" placeholder="请选择班级" @change="changeClass" class="mini_width">
                                <el-option label="全部班级" :value="0"></el-option>
                                <el-option v-for="item in classList" :key="item.id" :label="item.name" :value="item.id">
                                </el-option>
                            </el-select>
                        </template>
                        <template v-if="!wtManagerRole&&wtHeadMasterRole">
                            <el-select v-model="classCode" size="medium" placeholder="请选择班级" @change="changeClass2" class="mini_width">
                                <el-option v-for="item in classList" :key="item.id" :label="item.name" :value="item.id">
                                </el-option>
                            </el-select>
                        </template>
                        <a :href="exportURL" download="导出结果" target="_blank" v-if="pointList&&pointList.length!==0">
                            <el-button class="filter-item" type="primary" size="medium">导出</el-button>
                        </a>
                    </el-col>
                    <el-col :span="5">
                        <el-input size="medium" placeholder="请输入学生姓名" icon="el-icon-search" @change="examHandler" v-model.trim="searchName">
                            <el-button size="medium"  slot="append" icon="el-icon-search" @click="examHandler"></el-button>
                        </el-input>
                    </el-col>
                </el-row>
            </div>
        </div>
        <el-table stripe :data="pointList" v-loading.body="listLoading" border fit highlight-current-row
                  style="width: 100%" :height="maxH">
            <el-table-column align="center" label="姓名" show-overflow-tooltip>
                <template slot-scope="scope">
                    <span>{{scope.row.stuName}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="班级" show-overflow-tooltip>
                <template slot-scope="scope">
                    <span>{{scope.row.className}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="类型名称" show-overflow-tooltip>
                <template slot-scope="scope">
                    <span>{{scope.row.typeName}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="科目" show-overflow-tooltip>
                <template slot-scope="scope">
                    <span>{{scope.row.currName}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="积分" show-overflow-tooltip>
                <template slot-scope="scope">
                    <span>{{scope.row.point}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="审核状态" show-overflow-tooltip>
                <template slot-scope="scope">
                    <span v-if="scope.row.auditState === 2">审核不通过</span>
                    <span v-else-if="scope.row.auditState === 1">审核通过</span>
                    <span v-else>未审核</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="审核老师" show-overflow-tooltip>
                <template slot-scope="scope">
                    <span>{{scope.row.auditName || '--'}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="审核留言" show-overflow-tooltip>
                <template slot-scope="scope">
                    <span>{{scope.row.auditContent || '--'}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="考核状态" show-overflow-tooltip>
                <template slot-scope="scope">
                    <span v-if="scope.row.assessState === 2">考核不通过</span>
                    <span v-else-if="scope.row.assessState === 1">考核通过</span>
                    <span v-else>未考核</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="考核老师" show-overflow-tooltip>
                <template slot-scope="scope">
                    <span>{{scope.row.assessName || '--'}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="考核留言" show-overflow-tooltip>
                <template slot-scope="scope">
                    <span>{{scope.row.assessContent || '--'}}</span>
                </template>
            </el-table-column>
        </el-table>
        <div v-show="!listLoading" class="pagination-container">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                           :current-page.sync="pageNo" :page-sizes="[10,20,30, 50]"
                           :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper"
                           :total="total">
            </el-pagination>
        </div>
    </div>
</template>
<script>
    import {
        possessRole,
        querySchoolGrade,
        queryClassByGradeId,
        queryApplyRecord,
        sendMsgToParent,
        getClassAndGradeByManagerId,
        getDepartListByUserId
    } from '@/api/wtManager';
    import {getSchoolTimeList} from '@/api/record';
    import {getSeveralWeekListBySchoolTImeId} from "@/api/readPunchClock";
    import mixin from '@/mixins/windowResize';
    import {mapGetters} from 'vuex';

    export default {
        data() {
            return {
                schoolName: '',
                schoolTimeCode: '',
                schoolYearList: [],
                selectWeek: null,
                weekList: [],
                gradeList: [],
                gradeName: '',
                gradeCode: 0,
                classList: [],
                className: '',
                classCode: 0,
                pageNo: 1,
                pageSize: 20,
                searchName: '',
                pointList: [],
                total: null,
                listLoading: false,
                exportURL: '',
                wtManagerRole: false,
                wtHeadMasterRole: false,
            }
        },
        created() {
            //获取学期列表
            this.possessRoleFunc1();
        },
        computed: {
            ...mapGetters([
                'userInfo'
            ])
        },
        mixins: [mixin],
        methods: {
            possessRoleFunc1() {
                let managerRoleId = 273;
                possessRole(managerRoleId).then(res => {
                    if (res.data.code === 200) {
                        this.wtManagerRole = res.data.data.result;
                        this.getSchoolTimeList();
                        this.possessRoleFunc2();
                        /*梧桐信用管理员*/
                        if (this.wtManagerRole) {
                            this.querySchoolGradeFunc();
                        }
                    }
                }).catch(err => {
                });
            },
            possessRoleFunc2() {
                let headMasterRoleId = 11;
                possessRole(headMasterRoleId).then(res => {
                    if (res.data.code === 200) {
                        this.wtHeadMasterRole = res.data.data.result;
                        //获取年级列表
                        if (!this.wtManagerRole && this.wtHeadMasterRole) {
                            this.getClassAndGradeByManagerIdFunc();
                        }
                    }
                }).catch(err => {
                });
            },
            getClassAndGradeByManagerIdFunc() {
                this.gradeList = [];
                getClassAndGradeByManagerId({
                    managerId: this.userInfo.id
                }).then(res => res.data)
                    .then(data => {
                        if (data.code === 200 && data.data) {
                            let gradeBox = [];
                            data.data.forEach(item => {
                                gradeBox.push({
                                    id: item.gradeId,
                                    name: item.gradeName
                                });
                            });
                            this.gradeList = gradeBox;
                            this.gradeName = this.gradeList[0].name;
                            this.gradeCode = this.gradeList[0].id;
                            this.queryClassByGradeIdFunc2();
                        }
                    })
            },
            clearNotice() {
                this.$confirm('确定要发送学年末积分清空消息给家长吗？', '提示', {
                    type: 'error'
                }).then(() => {
                    sendMsgToParent().then(res => res.data)
                        .then(data => {
                            if (data.code === 200) {
                                this.$message({
                                    type: 'success',
                                    message: '发送成功!'
                                });
                            }
                        })
                }).catch(function (error) {
                });

            },
            handleSizeChange(val) {
                this.pageSize = val;
                this.queryApplyRecordFunc();
            },
            handleCurrentChange(val) {
                this.pageNo = val;
                this.queryApplyRecordFunc();
            },
            examHandler() {
                this.pageNo = 1;
                this.queryApplyRecordFunc();
            },
            pointSwitch() {
                this.$router.push({
                    path: 'wtPointRank'
                })
            },
            queryApplyRecordFunc() {
                this.listLoading = true;
                queryApplyRecord({
                    pageNo: this.pageNo,
                    pageSize: this.pageSize,
                    schoolId: this.$store.getters.schoolInfo.id,
                    schoolTimeId: this.schoolTimeCode,
                    gradeId: this.gradeCode,
                    classId: this.classCode,
                    searchName: this.searchName,
                    week: this.selectWeek
                }).then(res => res.data).then(data => {
                    if (data.code === 200 && data.data) {
                        let pointData = data.data;
                        this.pointList = pointData.dataList;
                        this.total = pointData.pagination.total;
                        this.listLoading = false;
                        /*导出*/
                        this.exportURL = global.BasePath + 'structure/creditPoint/downApplyRecord?classId=' + this.classCode + '&gradeId=' + this.gradeCode + '&week=' + this.selectWeek + '&schoolId=' + this.$store.getters.schoolInfo.id + '&schoolTimeId=' + this.schoolTimeCode + '&searchName=' + this.searchName + '&token=' + this.$store.getters.token;
                    }
                }).catch(() => {
                    this.listLoading = false;
                });
            },
            querySchoolGradeFunc() {
                //年级
                querySchoolGrade({
                    isFilterNewGrade: true
                }).then(res => res.data)
                    .then(data => {
                        if (data.code === 200) {
                            this.gradeList = data.data;
                        }
                    })
            },
            queryClassByGradeIdFunc() {
                //班级
                queryClassByGradeId({
                    gradeId: this.gradeCode
                }).then(res => res.data)
                    .then(data => {
                        if (data.code === 200) {
                            this.classList = data.data;
                            //this.classCode=this.classList[0].id;
                        }
                    })
            },
            queryClassByGradeIdFunc2() {
                //班主任获取班级
                getDepartListByUserId({
                    pid: this.gradeCode,
                    type: 4
                }).then(res => res.data)
                    .then(data => {
                        if (data.code === 200) {
                            this.classList = data.data;
                            this.classCode = this.classList[0].id;
                            this.className = this.classList[0].name;
                            if (!this.wtManagerRole && this.wtHeadMasterRole) {
                                this.queryApplyRecordFunc();
                            }
                            //this.classCode=this.classList[0].id;
                        }
                    })
            },
            getSchoolTimeList() {
                getSchoolTimeList().then(res => {
                    this.schoolYearList = res.data.data;
                    const self = this;
                    this.schoolYearList.forEach((item) => {
                        if (item.isCurrent === 1) {
                            self.schoolName = item.schoolTimeName;
                            self.schoolTimeCode = item.id;
                            this.getSeveralWeekListBySchoolTImeId(item.id);
                        }
                    });
                }).catch();
            },
            changeTeam(val) {
                this.schoolName = val;
                this.schoolYearList.forEach((item) => {
                    if (item.schoolTimeName === val) {
                        this.schoolTimeCode = item.id;
                        this.getSeveralWeekListBySchoolTImeId(item.id);
                    }
                });
            },
            // 周次
            getSeveralWeekListBySchoolTImeId(schoolTimeId) {
                getSeveralWeekListBySchoolTImeId(schoolTimeId).then((res) => {
                    const data = res.data.data;
                    if (res.data.code === 200) {
                        this.weekList = data.map(item => {
                            return {
                                value: item.week,
                                label: '第' + item.week + '周'
                            }
                        });
                        if (data.map(item => item.nowWeek).indexOf(1) > -1) {
                            this.selectWeek = data[data.map(item => item.nowWeek).indexOf(1)].week;
                        } else {
                            this.selectWeek = data[0].week;
                        }
                        if (this.wtManagerRole) {
                            this.gradeCode = 0;
                            this.classCode = 0;
                            this.searchName = '';
                            this.queryApplyRecordFunc();
                        } else if (this.wtHeadMasterRole) {
                            this.gradeName = this.gradeList[0].name;
                            this.gradeCode = this.gradeList[0].id;
                            this.queryClassByGradeIdFunc2();
                        }
                    }
                }).catch(() => {
                });
            },
            changeWeek() {
                this.searchName = '';
                this.queryApplyRecordFunc();
            },
            changeGrade(val) {
                this.searchName = '';
                if (val == 0) {
                    this.gradeCode = 0;
                    this.classCode = 0;
                    this.classList = [];
                    this.queryApplyRecordFunc();
                } else {
                    this.gradeCode = val;
                    this.classCode = 0;
                    this.queryClassByGradeIdFunc();
                    this.queryApplyRecordFunc();
                }
            },
            changeGrade2(val) {
                this.searchName = '';
                this.gradeCode = val;
                this.queryClassByGradeIdFunc2();
            },
            changeClass(val) {
                this.searchName = '';
                if (val == 0) {
                    this.classCode = 0;
                    this.queryApplyRecordFunc();
                } else {
                    this.classCode = val;
                    this.queryApplyRecordFunc();
                }
            },
            changeClass2(val) {
                this.searchName = '';
                this.classCode = val;
                this.queryApplyRecordFunc();
            }
        }
    }
</script>
<style lang="scss" scoped>
    .wtPointRank {
        padding: 10px;
        box-sizing: border-box;
    }

    .header {
        font-size: 14px;
        margin-bottom: 10px;

        .mini_width {
            width: 150px;
        }
    }

    .upload-import {
        display: inline-block;
    }

    .module-title {
        display: table;
        width: 100%;
        table-layout: fixed;
        border-collapse: separate;
        vertical-align: middle;

        .btn-group {
            display: table-cell;
            float: none;
            width: 1%;

            .btn {
                width: 100%;
                display: inline-block;
                padding: 6px 12px;
                margin-bottom: 0;
                font-size: 14px;
                font-weight: 400;
                line-height: 1.42857143;
                text-align: center;
                white-space: nowrap;
                vertical-align: middle;
                -ms-touch-action: manipulation;
                touch-action: manipulation;
                cursor: pointer;
                -webkit-user-select: none;
                -moz-user-select: none;
                -ms-user-select: none;
                user-select: none;
                background-image: none;
                border: 1px solid transparent;
                border-radius: 4px;
                color: #333;
                background-color: #fff;
                border-color: #606266;
            }

            .btn-selected {
                color: #fff;
                background-color: #409EFF;
                border-color: #409EFF;
            }
        }

        .btn-group:first-child .btn {
            border-top-right-radius: 0;
            border-bottom-right-radius: 0;
        }

        .btn-group:last-child .btn {
            border-top-left-radius: 0;
            border-bottom-left-radius: 0;
        }
    }
</style>
