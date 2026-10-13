<template>
    <div class="listen_class_wrap page">
        <div>
            <div style="margin-bottom: 10px">
               <term-grade-class-selector :isGradeShowAll="true" :isClassShow="false" :queryArgs="queryArgs"   @input="getStatistics()" ref="selector" v-model="obj" ></term-grade-class-selector>  
                <template v-if="listenTypeList && listenTypeList.length !== 0">
                    <el-select
                        v-model="recordTypeId"
                        size="medium"
                        placeholder="请选择"
                         @change="getStatistics()"
                    >
                        <el-option :key="0" label="全部上课类型" :value="0"></el-option>
                        <el-option
                            v-for="item in listenTypeList"
                            :key="item.id"
                            :label="item.value"
                            :value="item.id"
                        >
                        </el-option>
                    </el-select>
                </template>
                <!-- <el-button type="primary" size="medium" @click="getStatistics"
                >统计
                </el-button
                > -->
                <el-button
                    type="primary"
                    size="medium"
                    @click="exportExcel('#outTable', '被听课统计.xlsx')"
                >导出
                </el-button
                >
            </div>
            <div class="record_member_list clearfix">
                <el-table
                    stripe
                    :data="recordList"
                    border
                    :height="maxH"
                >
                    <el-table-column
                        prop="teacherName"
                        label="被听课教师"
                    ></el-table-column>
                    <el-table-column
                        prop="count"
                        label="被听课节次"
                    ></el-table-column>
                    <el-table-column
                        prop="times"
                        label="听课人次"
                    ></el-table-column>
                    <el-table-column
                        label="听课总评分"
                    >
                        <template slot-scope="scope">
                            {{scope.row.sumAppraiseScore.toFixed(2)}}
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="听课平均分"
                    >
                        <template slot-scope="scope">
                            {{scope.row.avgAppraiseScore.toFixed(2)}}
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <el-table
                stripe
                :data="recordList"
                border
                style="width: 98%; margin: 0 1%; display: none"
                max-height="440"
                id="outTable"
            >
                <el-table-column
                    prop="teacherName"
                    label="被听课教师"
                ></el-table-column>
                <el-table-column
                    prop="count"
                    label="被听课节次"
                ></el-table-column>
                <el-table-column
                    prop="times"
                    label="听课人次"
                ></el-table-column>
                <el-table-column
                    label="听课总评分"
                >
                    <template slot-scope="scope">
                        {{scope.row.sumAppraiseScore.toFixed(2)}}
                    </template>
                </el-table-column>
                <el-table-column
                    label="听课平均分"
                >
                    <template slot-scope="scope">
                        {{scope.row.avgAppraiseScore.toFixed(2)}}
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script>
    import Backtool from "@/components/BackTool";

    import mixins from "@/mixins/windowResize";
    import baseMixin from "@/mixins/baseMixin";
    import {getSchoolDicByCode} from "@/utils/utils";
    import {getClassRecordThStatisticalList} from "@/api/listenClass";
    import TermGradeClassSelector from "@/components/TermGradeClassSelector";
    export default {
        name: "listenClassTeacherStatistics",
        data() {
            return {
                recordList: [],
                activeName: "listenedAccounting",
                recordTypeId: 0,
                listenTypeList: [],
                 queryArgs: {
                    all: true, //所有班级年级
                    manager: true, //班主任
                    notlimit: true, //所有班级年级
                    submanager: true, //副班主任
                    teacher: true //普通所交
                },  
                obj: {
                    termId: "",
                    duration: ["", ""],
                    gradeId: "",
                    classId: ""
                },
            };
        },
        components: {
            Backtool,TermGradeClassSelector
        },
        mixins: [mixins, baseMixin],
        created() {
            // this.obj.duration = [
            //     this.getCurrentMonthDay(this.getDate(0)),
            //     this.getDate(0),
            // ]; // 列表日期
            this.getStatistics();
            getSchoolDicByCode("openClassType").then((list) => {
                this.listenTypeList = list;
            });
        },
        methods: {
            tabsfun() {
                if (this.activeName === "listenAccounting") {
                    this.$router.replace({
                        path: "statistics",
                    });
                } else if (this.activeName === "detailAccounting") {
                    this.$router.replace({
                        path: "detail",
                    });
                }
            },
            getCurrentMonthDay(date) {
                if (date) {
                    return date.substring(0, 8) + "01";
                }
                return "";
            },
            getStatistics() {
                let start = "";
                let end = "";
                if (this.obj.duration && this.obj.duration.length && this.obj.duration[0]) {
                    if (this.obj.duration[0] && this.obj.duration[0].length) {
                        start = this.obj.duration[0];
                        end = this.obj.duration[1];
                    } else {
                        start = this.getStrDate(this.obj.duration[0]);
                        end = this.getStrDate(this.obj.duration[1]);
                    }
                } else {
                    return;
                }

                let query = {
                    endDate: end,
                    startDate: start,
                    recordTypeId: this.recordTypeId,
                    gradeId:this.obj.gradeId
                };
                this.getClassRecordThStatisticalList(query);
            },
            getClassRecordThStatisticalList(query) {
                getClassRecordThStatisticalList(query)
                    .then((res) => {
                        const data = res.data;
                        if (res.data.code === 200) {
                            this.recordList = data.data;
                        } else {
                            this.$message({
                                message: data.msg,
                                type: "warning",
                            });
                        }
                    })
                    .catch();
            },
            getDate(n) {
                const data = new Date();
                data.setTime(data.getTime() + 3600 * 1000 * 24 * n);
                let localDateStr =
                    data.getFullYear() +
                    "-" +
                    this.fillZero(data.getMonth() + 1) +
                    "-" +
                    this.fillZero(data.getDate());
                return localDateStr;
            },
            getStrDate(data) {
                let strDate =
                    data.getFullYear() +
                    "-" +
                    this.fillZero(data.getMonth() + 1) +
                    "-" +
                    this.fillZero(data.getDate());
                return strDate;
            },
            fillZero(n) {
                return n < 10 ? "0" + n : n;
            },
        },
    };
</script>

<style>
    .listen_class_wrap .clearfix:after {
        visibility: hidden;
        display: block;
        font-size: 0;
        content: " ";
        clear: both;
        height: 0;
    }

    .listen_class_wrap .clearfix {
        zoom: 1;
    }
</style>
<style lang="scss" scoped>
    .page {
        padding: 10px;
    }

    .listen_class_wrap {
        .header {
            padding: 12px;
            border-bottom: 1px solid #eee;

            .statistics_title {
                display: flex;
                margin: 0;

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
                        background: #409eff;
                        border: 1px solid #409eff;
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

            .listen_date {
                margin-top: 10px;
                margin-right: 10px;
                margin-left: 80px;
            }
        }

        .record_member_list {

            .record_member_item {
                float: left;
                min-width: 135px;
                margin-top: 10px;
                margin-left: 30px;
                padding: 12px 12px;
                font-size: 18px;
                color: #333;
                background: #ddd;
                border-radius: 4px;

                .record_times {
                    float: right;
                    margin-left: 8px;
                    color: #999;
                }
            }

            .no_data_msg {
                text-align: center;
                color: #999;
            }
        }
    }
</style>
