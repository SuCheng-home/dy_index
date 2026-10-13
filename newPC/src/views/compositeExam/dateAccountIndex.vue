<template>
    <div class="page addTabSwitch">
        <div class="header">
            <el-date-picker
                v-model="date"
                type="date"
                size="medium"
                class="btnLeftLine"
                placeholder="请选择日期"
                :clearable="false"
                @change="dateChangeHandler"
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
            <!-- <el-button class="filter-item" v-waves type="primary" icon="upload" @click="handleprint">打印</el-button> -->
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
            <el-button
                type="primary"
                size="medium"
                @click="$router.push({ path: 'generalCheckNList' })"
            >检查
            </el-button
            >
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
            <el-table-column align="center" sortable label="总分排名" prop="ranking">
            </el-table-column>
        </el-table>

        <!--弹窗-->
        <el-dialog :title="titleMax" :visible.sync="dialogFormVisible">
            <div :dialogDate="dialogDate">
                <div class="diarow">
                    <div class="col-md-2">检查人:</div>
                    <div class="col-md-10">
                        {{ dialogDate.createUserName }}
                    </div>
                </div>
                <div class="diarow">
                    <div class="col-md-2">检查时间:</div>
                    <div class="col-md-10">
                        {{ dialogDate.createTime | trimTime }}
                    </div>
                </div>
                <div class="diarow" v-if="dialogDate.isStar === 1">
                    <div class="col-md-2">评分:</div>
                    <div class="col-md-10">
                        <span v-if="score && score.length === 0">0</span>
                        <!-- <i class="el-icon-star-on star-line" ></i> -->
                        <i
                            class="el-icon-star-on star-line"
                            v-else
                            v-for="(item, index) in score"
                            :key="index"
                        ></i>
                    </div>
                </div>
                <div class="diarow" v-if="dialogDate.isStar === 2">
                    <div class="col-md-2">评分:</div>
                    <div class="col-md-10">
                        <div
                            class="subrow"
                            v-for="(item, index) in dialogDate.scoreList"
                            :key="index"
                        >
                            <div class="subcol-md-2">{{ item.checkItemName }}</div>
                            <div class="subcol-md-10">{{ item.score }}</div>
                        </div>
                    </div>
                </div>
                <div class="diarow" v-if="dialogDate.teacherUserName">
                    <div class="col-md-2">是否到岗:</div>
                    <div class="col-md-10">
                        <div
                            v-for="(item, index) in dialogDate.nameAndIsWorkList"
                            :key="index"
                        >
                            <div class="col-md-2">{{ item.teacherName }}</div>
                            <div class="col-md-8">
                                {{ item.isWork == 1 ? "到岗" : "未到岗" }}
                            </div>
                        </div>
                    </div>
                </div>
                <div
                    class="diarow"
                    v-if="dialogDate.picList && dialogDate.picList.length !== 0"
                >
                    <div class="col-md-2">&nbsp;</div>
                    <div class="col-md-10">
                         <image-previewer tag="richtext">
                            <div class="imgBox" v-for="(item, index) in dialogDate.picList"  :key="index">
                                <img :src="`${item.picUrl}?imageMogr2/auto-orient`"/>
                            </div>
                         </image-previewer>
                        
                    </div>
                </div>
                <div class="diarow">
                    <div class="col-md-2">备注:</div>
                    <div class="col-md-10" v-if="dialogDate.batchContent">
                        {{ dialogDate.batchContent }}
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
        dateStatisticScore,
        dateDetailByDate,
    } from "@/api/compositeExam";
    import mixin from "@/mixins/windowResize";
    import ImagePreviewer from '@/components/ImagePreviewer/ImagePreviewer';
    export default {
         components: {
            ImagePreviewer,
        },
        data() {
            return {
                date: this.$moment().format("YYYY-MM-DD"),
                gardenSel: "", //选中年级
                gradeList: [],
                dutySel: "", //选中值班组
                dutyList: [],
                dateList: [], //表格主题数据
                listLoading: false,
                itemList: [],
                tableKey: 0,
                dialogFormVisible: false,
                dialogDate: {},
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
            this.findDutyListFunc();
        },
        mounted() {
        },
        filters: {
            trimTime(datetime) {
                return datetime ? datetime.slice(0, datetime.lastIndexOf(".")) : "";
            },
        },
        mixins: [mixin],
        methods: {
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
                            this.getDateListFunc();
                        }
                    });
            },
            showSendDialog(itemId, classId, className, itemName) {
                this.dialogFormVisible = true;
                dateDetailByDate({
                    checkTime: this.date,
                    classId: classId,
                    itemId: itemId,
                }).then((res) => {
                    this.dialogDate = res.data.data[0];
                    this.score = [];
                    if (this.dialogDate.isStar === 1) {
                        for (let i = 0; i < this.dialogDate.score; i++) {
                            this.score.push(i);
                        }
                    }

                    this.title1 = className;
                    this.title2 = itemName;
                    this.titleMax = this.title1 + " " + this.title2;
                });
            },
            getDateListFunc() {
                this.listLoading = true;
                if (this.date == "Invalid date" || this.date == "") {
                    this.$message({
                        type: "error",
                        message: "时间不能为空！",
                    });
                    return false;
                }
                dateStatisticScore({
                    checkDate: this.date,
                    gradeId: this.gardenSel,
                    seeType: 1,
                    dutyId: this.dutySel,
                })
                    .then((res) => {
                        let data = res.data.data;
                        let that = this;

                        this.dateList = data.countList;
                        this.itemList = data.itemList;
                        if (data.gradeList.length > 0) {
                        }
                        this.gradeList = [];
                        data.gradeList.forEach((item) => {
                            let hash = {};
                            hash.value = item.id;
                            hash.label = item.name;
                            this.gradeList.push(hash);
                        });
                        if (this.gardenSel === "") {
                            this.gardenSel = this.gradeList[0].value;
                        }
                        /*导出*/
                        this.exportURL = `${global.BasePath}structure/compositeStatistic/exportCompositeStatisticData?checkDate=${this.date}&gradeId=${this.gardenSel}&dutyId=${this.dutySel}&seeType=1&token=${this.$store.getters.token}`;
                        this.listLoading = false;
                    })
                    .catch(() => {
                        this.listLoading = false;
                    });
            },
            dateChangeHandler(value) {
                this.date = this.$moment(value).format("YYYY-MM-DD");
                this.getDateListFunc();
            },
            getDutyList(value) {
                this.dutySel = value;
                this.getDateListFunc();
            },
            getList(value) {
                this.gardenSel = value;
                this.getDateListFunc();
            },
        },
    };
</script>
<style lang="scss" scoped>
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
        word-break: break-all;
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
        line-height: 24px;
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

    .imgBox {
        float: left;
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
</style>
