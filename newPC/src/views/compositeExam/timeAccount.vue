<template>
    <div class="page timeAccount">
        <div class="header">
            <el-date-picker
                v-model.trim="startdate"
                type="date"
                size="medium"
                class="btnLeftLine"
                :clearable="false"
                placeholder="请选择日期"
                @change="startChangeHandler"
            >
            </el-date-picker>
            <el-date-picker
                v-model.trim="enddate"
                type="date"
                size="medium"
                :clearable="false"
                class="btnLeftLine"
                placeholder="请选择结束日期"
                @change="endChangeHandler"
            >
            </el-date-picker>
            <el-select
                size="medium"
                class="filter-item btnLeftLine"
                v-model="dutySel"
                placeholder="请选择值班组"
                @change="getDutyList"
            >
                <el-option
                    v-for="item in dutyList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                >
                </el-option>
            </el-select>
            <el-select
                size="medium"
                class="filter-item btnLeftLine"
                v-model="gardenSel"
                placeholder="请选择年级"
                @change="getList"
            >
                <el-option label="全部年级" :value="0"></el-option>
                <el-option
                    v-for="item in gradeList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                >
                </el-option>
            </el-select>
            <a :href="exportURL" download="导出结果" target="_blank" v-if="dateList.length">
                <el-button
                    size="medium"
                    class="filter-item"
                    type="primary"
                    icon="upload"
                >导出
                </el-button
                >
            </a>
        </div>
        <div class="time-table">
            <el-table
                stripe
                :key="tableKey"
                :data="dateList"
                v-loading.body="listLoading"
                border
                fit
                highlight-current-row
                style="width: 100%"
                :height="nobottommaxH"
            >
                <el-table-column align="center" label="班级" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span>{{ scope.row.className }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    :key="index"
                    v-for="(item, index) in itemList"
                    align="center"
                    :label="item.itemName"
                >
                    <template slot-scope="scope">
                <span v-if="scope.row.scoreList[index].scoreStr === '--'"
                >--</span
                >
                        <span v-else>{{ scope.row.scoreList[index].scoreStr }}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="总计">
                    <template slot-scope="scope">
                <span style="color: green; font-weight: bold">{{
                  scope.row.totalScore
                }}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="总分排名" prop="ranking" sortable>
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>
<script>
    import {findDutyList, timeStatisticScore} from "@/api/compositeExam";
    import mixin from "@/mixins/windowResize";

    export default {
        data() {
            return {
                startdate: this.$moment().set("date", 1).valueOf(),
                enddate: this.$moment().format("YYYY-MM-DD"),
                gardenSel: "", //选中年级
                gradeList: [],
                dutySel: "", //选中值班组
                dutyList: [],
                dateList: [], //表格主题数据
                listLoading: false,
                itemList: [],
                tableKey: 0,
                dialogFormVisible: false,
                dialogDate: [],
                title1: "",
                title2: "",
                titleMax: "",
                formLabelWidth: "120px",
                score: [],
                exportURL: ""
            };
        },
        created() {
            this.gardenSel = 0;
            this.startdate = this.$moment(this.startdate).format("YYYY-MM-DD");
            // this.startdate=this.$moment().set('date', 1).valueOf().format('YYYY-MM-DD');
            this.getTimeListFunc();
        },
        mounted() {
            this.findDutyListFunc();
        },
        mixins: [mixin],
        methods: {
            jumpTo(path, query = {}) {
                this.$router.push({
                    path,
                    query,
                });
            },
            findDutyListFunc() {
                findDutyList()
                    .then((res) => res.data)
                    .then((data) => {
                        if (data.code === 200) {
                            this.dutyList = [];
                            data.data.forEach((item) => {
                                this.dutyList.push({
                                    value: item.id,
                                    label: item.dutyName,
                                });
                            });
                            this.dutySel = this.dutyList[0].value;
                        }
                    });
            },
            getTimeListFunc() {
                this.listLoading = true;
                if (this.startdate == "Invalid date" || this.startdate == "") {
                    this.$message({
                        type: "error",
                        message: "开始时间不能为空！",
                    });
                    return false;
                }
                if (this.enddate == "Invalid date" || this.enddate == "") {
                    this.$message({
                        type: "error",
                        message: "结束时间不能为空！",
                    });
                    return false;
                }
                if (
                    this.$moment(this.enddate).format("YYYY-MM-DD") <
                    this.$moment(this.startdate).format("YYYY-MM-DD")
                ) {
                    this.$message({
                        type: "error",
                        message: "开始时间不能大于结束时间！",
                    });
                    return false;
                }
                timeStatisticScore({
                    startTimeStr: this.startdate,
                    endTimeStr: this.enddate,
                    gradeId: this.gardenSel,
                    seeType: 3,
                    dutyId: this.dutySel,
                })
                    .then((res) => {
                        const data = res.data.data;
                        this.dateList = data.countList;
                        this.itemList = data.itemList;
                        this.gradeList = [];
                        data.gradeList.forEach((item) => {
                            this.gradeList.push({
                                value: item.id,
                                label: item.name,
                            });
                        });
                        if (this.startdate === "") {
                            this.startdate = data.qvParam.startTimeStr;
                        }
                        if (this.enddate === "") {
                            this.enddate = data.qvParam.endTimeStr;
                        }
                        if (this.gardenSel === "") {
                            this.gardenSel = this.gradeList[0].value;
                        }

                        /*导出*/
                        this.exportURL =
                            global.BasePath +
                            "structure/compositeStatistic/exportCompositeStatisticData?startTimeStr=" +
                            this.startdate +
                            "&endTimeStr=" +
                            this.enddate +
                            "&gradeId=" +
                            this.gardenSel +
                            "&dutyId=" +
                            this.dutySel +
                            "&seeType=3&token=" +
                            this.$store.getters.token;
                        this.listLoading = false;
                    })
                    .catch(() => {
                        this.listLoading = false;
                    });
            },
            startChangeHandler(value) {
                this.startdate = this.$moment(value).format("YYYY-MM-DD");
                this.getTimeListFunc();
            },
            endChangeHandler(value) {
                this.enddate = this.$moment(value).format("YYYY-MM-DD");
                this.getTimeListFunc();
            },
            getList(value) {
                //
                this.gardenSel = value;
                this.getTimeListFunc();
            },
            getDutyList(value) {
                this.dutySel = value;
                this.getTimeListFunc();
            },
        },
    };
</script>
<style scoped>
    .page {
        padding: 12px;
    }

    .header {
        margin-bottom: 10px;
    }

    

    .diarow {
        width: 100%;
        margin-bottom: 20px;
    }

    .diarow:after {
        content: "";
        height: 0;
        clear: both;
        visibility: hidden;
        display: block;
    }

    .diarow .col-md-2 {
        width: 20%;
        float: left;
    }

    .diarow .col-md-10 {
        width: 80%;
        float: left;
    }

    .subrow {
        margin-bottom: 10px;
    }

    .diarow .subcol-md-2 {
        width: 50%;
        float: left;
    }

    .diarow .subcol-md-10 {
        width: 50%;
        float: left;
    }

    .el-icon-star-on {
        display: inline-block;
    }

    .star-line {
        color: #ff8d1f;
        font-size: 18px;
        margin-right: 6px;
    }

    .imgBox {
        height: 70px;
        width: 70px;
        margin: 0 5px 5px 0;
    }

    .imgBox img {
        display: block;
        height: 70px;
        width: 70px;
        overflow: hidden;
    }

    .time-table {
        border: 1px solid #dfe6ec;
    }

    .el-table {
        overflow: auto;
    }

    .el-table::-webkit-scrollbar-thumb {
        background: #99a9bf;
        border-radius: 20px;
    }

    .el-table::-webkit-scrollbar {
        width: 6px;
    }

    .el-table::after {
        top: 0;
        right: 0;
        width: 0px;
        height: 100%;
    }
</style>
<style scoped>
    .timeAccount .el-table .cell,
    .timeAccount .el-table__footer-wrapper,
    .timeAccount .el-table__header-wrapper {
        overflow: visible !important;
    }

    .timeAccount .el-table__body-wrapper {
        overflow: visible !important;
    }
</style>
