<template>
    <div id="teacherCommentIndex" class="app-container calendar-list-container">
        <div class="filter-container">
            <el-date-picker ref="date" size="medium" v-model="duration" type="daterange" class="mywidthdaterange" @change="getList"
                            :editable='false'
                            :clearable='false' placeholder="选择时间范围"
                            align="left"></el-date-picker>
            <grade-class-selector @change="gradeClassChange" @init="gradeClassChange"></grade-class-selector>
            <a target="_blank" :href="exportUrl" download="导出结果" v-if="dataList.length">
                <el-button class="filter-item" type="primary" size="medium" icon="upload">导出</el-button>
            </a>
            <el-input class="search-input search-input--right" size="medium" placeholder="请输入学生姓名"
                      v-model.trim="userName" @input="getList">
                <el-button slot="append" icon="el-icon-search" @click="getList"></el-button>
            </el-input>
        </div>
        <el-table stripe :data="dataList" border fit highlight-current-row
                  style="width: 100%" :height="maxH">
            <el-table-column label="学生姓名" align="center" show-overflow-tooltip prop="userName">
            </el-table-column>
            <el-table-column align="center" label="所在班级" prop="className">
            </el-table-column>
            <el-table-column align="center" label="考勤规则" prop="ruleName">
            </el-table-column>
            <el-table-column align="center" label="考勤时间">
                <template slot-scope="scope">
                    {{scope.row.attendanceTime | timeSuffixFilter}}
                </template>
            </el-table-column>
        </el-table>
        <div class="pagination-container">
            <el-pagination @size-change="getList" @current-change="getPriodStuAttendanceRecordPageListFunc"
                           :current-page.sync="pagination.pageNo" :page-sizes="[10, 20, 30, 50]"
                           :page-size.sync="pagination.pageSize" layout="total, sizes, prev, pager, next, jumper"
                           :total="pagination.total">
            </el-pagination>
        </div>
    </div>
</template>

<script>
    import moment from 'moment';
    import GradeClassSelector from '@/components/GradeClassSelector';

    import {
        getPriodStuAttendanceRecordPageList
    } from '@/api/studentAttendanceLiuhe';
    import mixin from '@/mixins/windowResize';
    import baseMixin from '@/mixins/baseMixin';

    export default {
        mixins: [mixin, baseMixin],
        components: {GradeClassSelector},
        data() {
            return {
                duration: [new Date(), new Date()],
                dataList: [],
                userName: '',
                gradeId: '',
                classId: ''
            }
        },
        computed: {
            exportUrl() {
                return `${global.BasePath}structure/stuAttendance/exportStuAttendanceRecordListXls?beginDate=${this.$moment(this.duration[0]).format('YYYY-MM-DD')}&endDate=${this.$moment(this.duration[1]).format('YYYY-MM-DD')}&classId=${this.classId}&gradeId=${this.gradeId}&userName=${this.userName}&token=${this.$store.getters.token}`;
            }
        },
        created() {
            // this.getPriodStuAttendanceRecordPageListFunc();
        },
        methods: {
            gradeClassChange({gradeId, classId}) {
                this.pagination.pageNo = 1;
                this.gradeId = gradeId;
                this.classId = classId;
                this.getPriodStuAttendanceRecordPageListFunc();
            },
            addEdit(item = {}) {
                this.editId = item.id;
                this.isShowAddEditDialog = true;

                if (item.id) {
                    this.formData.content = item.content;
                    this.formData.type = item.type;
                } else {
                    this.formData.content = '';
                    if (this.typeList && this.typeList.length !== 0) {
                        this.formData.type = this.typeList[0].value;
                    } else {
                        this.formData.type = '';
                    }
                }
            },
            getList() {
                this.pagination.pageNo = 1;
                this.getPriodStuAttendanceRecordPageListFunc();
            },
            getPriodStuAttendanceRecordPageListFunc() {
                const [beginDate, endDate] = this.duration;

                getPriodStuAttendanceRecordPageList({
                    pageNo: this.pagination.pageNo,
                    pageSize: this.pagination.pageSize,
                    userName: this.userName,
                    gradeId: this.gradeId,
                    classId: this.classId,
                    beginDate: moment(beginDate).format('YYYY-MM-DD'),
                    endDate: moment(endDate).format('YYYY-MM-DD')
                })
                    .then(res => res.data)
                    .then(data => {
                        this.dataList = data.data.dataList;
                        this.pagination.total = data.data.pagination.total;
                    })
            },
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
</style>
