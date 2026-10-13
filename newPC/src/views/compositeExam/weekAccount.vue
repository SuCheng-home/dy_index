<template>
    <div class="page addTabSwitch2">
        <div class="header">
            <el-select
                size="medium"
                class="filter-item btnLeftLine"
                v-model="severalSel"
                placeholder="请选择周次"
                @change="severaList"
            >
                <el-option
                    v-for="item in severalList"
                    :key="item.week"
                    :label="'第' + item.week + '周'"
                    :value="item.week"
                >
                </el-option>
            </el-select>
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
            <!-- <el-button class="filter-item" type="primary" icon="upload" @click="handleprint">打印</el-button> -->
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
                    <el-button
                        v-else
                        type="text"
                        @click.native="
                  showSendDialog(
                    scope.row.scoreList[index].itemId,
                    scope.row.classId,
                    scope.row.className,
                    item.itemName
                  )
                "
                    >
                        {{ scope.row.scoreList[index].scoreStr }}
                    </el-button>
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

        <!--弹窗-->
        <el-dialog :title="titleMax" :visible.sync="dialogFormVisible">
            <div v-for="(itemDate, index) in dialogDate" :key="index">
                <div class="diarow" v-if="itemDate.isStar === 1">
                    <div class="col-md-2">{{ itemDate.weekName }}:</div>
                    <div class="col-md-10">
                        <span v-if="itemDate.score == 0">0</span>
                        <div v-else>
                            <i
                                class="el-icon-star-on star-line"
                                v-for="(item, index) in Math.ceil(itemDate.score)"
                                :key="index"
                            ></i>
                        </div>
                    </div>
                </div>
                <div class="diarow" v-if="itemDate.isStar === 2">
                    <div class="col-md-2">{{ itemDate.weekName }}:</div>
                    <div class="col-md-10">
                        <div
                            class="subrow"
                            v-for="(item, index) in itemDate.scoreList"
                            :key="index"
                        >
                            <div class="subcol-md-2">{{ item.checkItemName }}</div>
                            <div class="subcol-md-10">{{ item.score }}</div>
                        </div>
                    </div>
                </div>
                <div class="diarow">
                    <div class="col-md-2">备注:</div>
                    <div class="col-md-10" v-if="itemDate.batchContent">
                        {{ itemDate.batchContent }}
                    </div>
                    <div class="col-md-10" v-else>无</div>
                </div>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="dialogFormVisible = false"
                >确 定
                </el-button
                >
            </div>
        </el-dialog>
    </div>
</template>
<script>
    import {
        findDutyList,
        weekStatisticScore,
        weekDetailByDate,
    } from "@/api/compositeExam";
    import mixin from "@/mixins/windowResize";

    export default {
        data() {
            return {
                severalSel: "",
                severalList: [],
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
                exportURL: ""
            };
        },
        created() {
            this.gardenSel = 0;
            this.getWeekListFunc();
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
                            data.data.forEach(({id, dutyName}) => {
                                this.dutyList.push({
                                    value: id,
                                    label: dutyName,
                                });
                            });
                            this.dutySel = this.dutyList[0].value;
                        }
                    });
            },
            showSendDialog(itemId, classId, className, itemName) {
                this.dialogFormVisible = true;
                weekDetailByDate({
                    severalWeek: this.severalSel,
                    classId: classId,
                    itemId: itemId,
                }).then((res) => {
                    this.dialogDate = res.data.data;

                    this.dialogDate.forEach((item) => {
                        if (item.isStar === 1) {
                            for (let i = 0; i < item.score.length; i++) {
                                item.scoretotal = item.score.push(i);
                            }
                        }
                    });
                    this.title1 = className;
                    this.title2 = itemName;
                    this.titleMax = this.title1 + " " + this.title2;
                });
            },

            getWeekListFunc() {
                this.listLoading = true;
                weekStatisticScore({
                    severalWeek: this.severalSel,
                    gradeId: this.gardenSel,
                    seeType: 2,
                    dutyId: this.dutySel,
                })
                    .then((res) => {
                        let data = res.data.data;
                        this.dateList = data.countList;
                        this.itemList = data.itemList;

                        this.severalList = data.severalWeekList; //周次
                        if (this.severalSel === "") {
                            this.severalSel = data.qvParam.severalWeek==0?1:data.qvParam.severalWeek;
                        }
                        this.gradeList = [];
                        data.gradeList.forEach(({id, name}) => {
                            this.gradeList.push({
                                value: id,
                                label: name,
                            });
                        });
                        if (this.gardenSel === "") {
                            this.gardenSel = this.gradeList[0].value;
                        }
                        /*导出*/
                        this.exportURL = `${global.BasePath}structure/compositeStatistic/exportCompositeStatisticData?severalWeek=${this.severalSel}&gradeId=${this.gardenSel}&dutyId=${this.dutySel}&seeType=2&token=${this.$store.getters.token}`;
                        this.listLoading = false;
                    })
                    .catch(() => {
                        this.listLoading = false;
                    });
            },
            severaList(value) {
                this.severalSel = value;
                this.getWeekListFunc();
            },
            getList(value) {
                this.gardenSel = value;
                this.getWeekListFunc();
            },
            getDutyList(value) {
                this.dutySel = value;
                this.getWeekListFunc();
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
        word-break: break-all;
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
        line-height: 24px;
    }

    .diarow .col-md-10 {
        width: 80%;
        float: left;
        line-height: 24px;
    }

    .subrow {
        margin-bottom: 10px;
        word-break: break-all;
    }

    .subrow:after {
        content: "";
        height: 0;
        clear: both;
        visibility: hidden;
        display: block;
    }

    .diarow .subcol-md-2 {
        width: 50%;
        float: left;
    }

    .diarow .subcol-md-10 {
        width: 50%;
        float: left;
        line-height: 24px;
    }

    .el-icon-star-on {
        display: inline-block;
    }

    .star-line {
        color: #ff8d1f;
        font-size: 18px;
        margin-right: 6px;
    }

    .imgBox img {
        display: block;
        height: 70px;
        width: 70px;
        overflow: hidden;
    }
</style>
