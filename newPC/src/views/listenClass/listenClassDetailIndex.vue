<template>
    <div class="listenClassDetailIndex">
        <div class="open_class_my_wrap">
            <div class="search_line_wrap">
                <template>
                    <el-select v-model="schoolName" size="medium" placeholder="请选择学期"
                               @change="changeSchoolTimeCode">
                        <el-option v-for="item in schoolYearList" :key="item.schoolTimeCode" :label="item.label"
                                   :value="item.schoolTimeName">
                        </el-option>
                    </el-select>
                </template>
                <a :href="exportURL" download="导出结果" v-if="myClassList.length" target="_blank">
                    <el-button class="filter-item" size="medium" type="primary">导出</el-button>
                </a>
            </div>
            <div class="open_class_my_list">
                <el-table stripe :data="myClassList" border style="width: 100%;" :height="notbmaxH - 75">
                    <el-table-column label="姓名" prop="listenUserName" show-overflow-tooltip
                                     width="200"></el-table-column>
                    <el-table-column label="学科" prop="subjectInfo" show-overflow-tooltip></el-table-column>
                    <el-table-column label="日期" prop="orderDate" show-overflow-tooltip></el-table-column>
                    <el-table-column label="年级" prop="gradeName" show-overflow-tooltip></el-table-column>
                    <el-table-column label="班级" prop="className" show-overflow-tooltip></el-table-column>
                    <el-table-column label="节次" prop="classNoName" show-overflow-tooltip></el-table-column>
                    <el-table-column label="听课课程" prop="subjectName" show-overflow-tooltip></el-table-column>
                    <el-table-column label="地点" prop="place" show-overflow-tooltip></el-table-column>
                    <el-table-column label="反馈" prop="statusName" show-overflow-tooltip></el-table-column>
                    <el-table-column label="检查时间" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <span>{{scope.row.checkTime | timeFilter}}</span>
                        </template>
                    </el-table-column>
                </el-table>
                <div class="pagination-container">
                    <el-pagination @size-change="sizeChangeHandler" @current-change="currentChangeHandler"
                                   :current-page.sync="pagination.pageNo" :page-sizes="[10, 20, 30, 50]"
                                   :page-size.sync="pagination.pageSize"
                                   layout="total, sizes, prev, pager, next, jumper"
                                   :total="pagination.total">
                    </el-pagination>
                </div>
            </div>
        </div>

    </div>
</template>

<script>
    import mixins from '@/mixins/windowResize';
    import BaseMixin from '@/mixins/baseMixin';
    import {getSchoolTimeList, getTeacherOrderDetail} from "@/api/teachingStudy/listenClassOrder";

    export default {
        name: 'listenClassDetailIndex',
        data() {
            return {
                myClassList: [],
                exportURL: '',
                schoolName: '',
                schoolTimeCode: '',
                schoolYearList: [],
            }
        },
        mixins: [mixins, BaseMixin],
        filters: {
            timeFilter(time) {
                return time ? time.substring(0, 16) : '';
            }
        },
        created() {
            this.getSchoolTimeList();
        },
        methods: {
            changeSchoolTimeCode(val) {
                this.pagination.pageNo = 1;
                const self = this;
                this.schoolName = val;
                this.schoolYearList.forEach(function (item) {
                    if (item.schoolTimeName === val) {
                        self.schoolTimeCode = item.id;
                    }
                });
                this.getTeacherOrderDetail();
            },
            getSchoolTimeList() {
                getSchoolTimeList().then(res => {
                    this.schoolYearList = res.data.data;
                    let self = this;
                    this.schoolYearList.forEach(function (item) {
                        if (item.isCurrent === 1) {
                            self.schoolName = item.schoolTimeName;
                            self.schoolTimeCode = item.id;
                            self.supplyDate = [item.startDate, self.getDate(0)]; // 列表日期
                            self.getTeacherOrderDetail();
                        }
                    });
                }).catch();
            },
            getTeacherOrderDetail() {
                this.exportURL = global.BasePath + 'structure/listenClassOrder/exportTeacherOrderDetail?schoolTimeId='
                    + this.schoolTimeCode + '&token=' + this.$store.getters.token;
                let query = {
                    pageNo: this.pagination.pageNo,
                    pageSize: this.pagination.pageSize,
                    schoolTimeId: this.schoolTimeCode
                };
                getTeacherOrderDetail(query).then(res => res.data).then(data => {
                    if (data.code === 200) {
                        this.myClassList = data.data.dataList;
                        this.pagination.total = data.data.pagination.total;
                    } else {
                        this.$message({
                            message: data.msg,
                            type: 'warning'
                        });
                    }
                }).catch(() => {
                });
            },
            sizeChangeHandler() {
                this.pagination.pageNo = 1;
                this.getTeacherOrderDetail();
            },
            currentChangeHandler() {
                this.getTeacherOrderDetail();
            }
        }
    }
</script>

<style lang="scss" scoped>
    .listenClassDetailIndex {
        padding: 12px;
    }

    .header {
        margin-bottom: 0;

        .statistics_title {
            display: flex;
            margin: 10px 0;

            .btn_group {
                flex: 1;
                text-align: center;

                .btn {
                    height: 40px;
                    line-height: 40px;
                    border: 1px solid #ccc;
                    border-left-width: 0;
                    color: #333;
                    cursor: pointer;
                }

                .btn_selected {
                    color: #fff;
                    background: #409EFF;
                    border: 1px solid #409EFF;
                }
            }

            .btn_group:first-child {
                .btn {
                    border-radius: 4px 0 0 4px;
                    border-left-width: 1px;
                }
            }

            .btn_group:last-child {
                .btn {
                    border-radius: 0 4px 4px 0;
                }
            }
        }
    }

    .open_class_my_wrap {
        .search_line_wrap {
            margin-bottom: 10px;
        }
    }
</style>
