<template>
    <div class="listenClassStatisticsIndex">
        <div class="supply_class_order_wrap">
            <div class="search_line_wrap">
                <template>
                    <el-select v-model="schoolName" size="medium" placeholder="请选择学期"
                               @change="changeSchoolTimeCode">
                        <el-option v-for="item in schoolYearList" :key="item.schoolTimeCode" :label="item.label"
                                   :value="item.schoolTimeName">
                        </el-option>
                    </el-select>
                </template>
            </div>
            <div class="supply_class_order_list">
                <el-table stripe :data="schoolClassList" border style="width: 100%;"
                          :height="notbmaxH - 28">
                    <el-table-column label="姓名" prop="listenUserName" show-overflow-tooltip
                                     width="200"></el-table-column>
                    <el-table-column label="学科" prop="subjectInfo" show-overflow-tooltip></el-table-column>
                    <el-table-column :label="item" :key="index" v-for="(item, index) in listenMonthList">
                        <template slot-scope="scope">
                            <span>{{scope.row.eachMonNum[index]}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="totalNum" label="学期总计"></el-table-column>
                </el-table>
            </div>
        </div>
    </div>
</template>

<script>
    import mixins from '@/mixins/windowResize';
    import BaseMixin from '@/mixins/baseMixin';
    import {getSchoolTimeList, getTeacherMonOrderNum} from "@/api/teachingStudy/listenClassOrder";

    export default {
        name: 'listenClassStatisticsIndex',
        data() {
            return {
                schoolClassList: [],
                listenMonthList: [],
                schoolName: '',
                schoolTimeCode: '',
                schoolYearList: [],
            }
        },
        mixins: [mixins, BaseMixin],
        created() {
            this.getSchoolTimeList();
        },
        methods: {

            changeSchoolTimeCode(val) {
                const self = this;
                this.schoolName = val;
                this.schoolYearList.forEach(function (item) {
                    if (item.schoolTimeName === val) {
                        self.schoolTimeCode = item.id;
                    }
                });
                this.getTeacherMonOrderNum();
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
                            self.getTeacherMonOrderNum();
                        }
                    });
                }).catch();
            },
            getTeacherMonOrderNum() {
                getTeacherMonOrderNum(this.schoolTimeCode).then(res => res.data).then(data => {
                    if (data.code === 200) {
                        this.listenMonthList = data.data.columnList;
                        this.schoolClassList = data.data.orderUserList;
                    } else {
                        this.$message({
                            message: data.msg,
                            type: 'warning'
                        });
                    }
                }).catch(() => {
                });
            }
        }
    }
</script>

<style lang="scss" scoped>
    .listenClassStatisticsIndex {
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

    .supply_class_order_wrap {
        .search_line_wrap {
            margin-bottom: 10px;
        }
    }
</style>
