<template>
    <div class="guide_group_list_wrap">
        <div class="header">
            <el-button size="medium" @click.native="goBack">返回</el-button>
            <el-button type="primary" size="medium" @click.native="saveGuideTime" :loading="loadConfirm">保存</el-button>
            <el-button type="primary" size="medium" @click.native="addNewRule">添加护导规则</el-button>
        </div>

        <div class="guide_rule_box" :style="`height: ${maxH - 1}px;`">
            <div class="guide_rule_list">
                <div class="guide_rule_item" :key="index" v-for="(item, index) in guideList">
                    <div class="guide_name">
                        <span>护导规则{{index + 1}}</span>
                        <i class="el-icon-close" @click="closeGuideLine(index)"></i>
                    </div>

                    <div class="guide_time_box">
                        <el-checkbox-group v-model="item.dayNoList" @change="changeCheckGroup">
                            <el-checkbox :label="1" :disabled="isDisabledDay(item.dayNoList, 1)">星期一</el-checkbox>
                            <el-checkbox :label="2" :disabled="isDisabledDay(item.dayNoList, 2)">星期二</el-checkbox>
                            <el-checkbox :label="3" :disabled="isDisabledDay(item.dayNoList, 3)">星期三</el-checkbox>
                            <el-checkbox :label="4" :disabled="isDisabledDay(item.dayNoList, 4)">星期四</el-checkbox>
                            <el-checkbox :label="5" :disabled="isDisabledDay(item.dayNoList, 5)">星期五</el-checkbox>
                            <el-checkbox :label="6" :disabled="isDisabledDay(item.dayNoList, 6)">星期六</el-checkbox>
                            <el-checkbox :label="7" :disabled="isDisabledDay(item.dayNoList, 7)">星期日</el-checkbox>
                        </el-checkbox-group>

                        <div class="time_line">
                            <div class="time_line_item" :key="timeIndex"
                                 v-for="(timeItem, timeIndex) in item.guideTimeList">
                                <span>第{{timeIndex + 1}}次</span>
                                <span>{{timeItem.startTime}}&nbsp;至&nbsp;{{timeItem.endTime}}</span>

                                <i class="el-icon-edit"
                                   @click="editGuideTime(index, timeIndex, timeItem.startTime, timeItem.endTime)"></i>
                                <i class="el-icon-close" @click="closeGuideTime(index, timeIndex)"></i>
                            </div>
                        </div>
                        <div class="guide_time_add_line">
                            <span>添加护导时间</span><i class="el-icon-plus" @click="addGuideTime(index)"></i>
                        </div>
                    </div>
                </div>
                <div class="no_data_msg" v-show="!guideList.length">暂无护导规则</div>
            </div>
        </div>

        <el-dialog title="护导时间" :visible.sync="isShowGuideTimeAddPage" width="600px" :close-on-press-escape='false'
                   :close-on-click-modal='false' :modal-append-to-body='false'>
            <el-form label-width="120px">
                <el-form-item label="护导时间">
                    <el-time-select v-model="timeRange[0]" range-separator="-" format="HH:mm" :clearable="false"
                                    :editable="false" style="width: 150px"
                                    @blur="onStartTimeBlur"
                                    start-placeholder="开始时间" end-placeholder="结束时间" placeholder="选择时间范围"
                                    :picker-options="{
                              start: '00:00',
                              step: '00:05',
                              end: '23:55'
                            }">>
                    </el-time-select>&nbsp;&nbsp;-&nbsp;&nbsp;
                    <el-time-select v-model="timeRange[1]" range-separator="-" format="HH:mm" :clearable="false"
                                    :editable="false" style="width: 150px"
                                    start-placeholder="开始时间" end-placeholder="结束时间" placeholder="选择时间范围"
                                    :picker-options="{
                              start: '00:00',
                              step: '00:05',
                              end: '23:55'
                            }">>
                    </el-time-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="isShowGuideTimeAddPage = false">取 消</el-button>
                <el-button type="primary" @click="addNewGuideTime" :loading="loadConfirm">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import mixins from '@/mixins/windowResize';
    import {getGroupGuideTimeList, addGuidTimeSet} from '@/api/systemSet/guide';

    export default {
        name: "guideTimeSet",
        data() {
            return {
                editGuideId: 0,
                isShowGuideTimeAddPage: false,
                loadConfirm: false,
                timeRange: ['09:00', '17:30'],
                guideList: [],
                guideIndex: 0,
                guideTimeIndex: -1,
                allSelectDayList: []
            }
        },
        mixins: [mixins],
        created() {
            this.getGroupGuideTimeList();
        },
        methods: {
            goBack() {
                this.$router.back();
            },
            onStartTimeBlur() {
                const time = this.$moment(`2020-01-01 ${this.timeRange[0]}:00`).add(10, 'minutes').format('HH:mm');
                console.log(time);
                this.$set(this.timeRange, 1, time);
            },
            // 选择操作
            isDisabledDay(itemList, itemIndex) {
                return itemList && (itemList.indexOf(itemIndex) === -1) && this.allSelectDayList.indexOf(itemIndex) > -1;
            },
            changeCheckGroup() {
                this.allSelectDayList = [];
                this.guideList.forEach((item) => {
                    if (item.dayNoList) {
                        this.allSelectDayList = this.allSelectDayList.concat(item.dayNoList);
                    }
                });
            },
            // 列表
            getGroupGuideTimeList() {
                getGroupGuideTimeList(this.$route.query.guideGroupId).then(res => {
                    const data = res.data;
                    if (data.code === 200) {
                        this.guideList = data.data;
                        data.data.forEach((item) => {
                            this.allSelectDayList = this.allSelectDayList.concat(item.dayNoList);
                        });
                    }
                }).catch(() => {
                });
            },
            // 添加护导规则
            addNewRule() {
                if (this.guideList.length >= 7 || this.allSelectDayList.length >= 7) {
                    this.$message({
                        message: '护导规则数已达限制!',
                        type: 'warning'
                    });
                    return;
                }

                let newRuleJson = {
                    dayNoList: [],
                    groupId: this.$route.query.guideGroupId,
                    guideTimeList: [],
                    ruleNo: this.guideList.length + 1
                };

                this.guideList.push(newRuleJson);
            },
            // 删除护导规则
            closeGuideLine(guideIndex) {
                if (this.guideList.length <= 1) {
                    this.$message({
                        message: '护导规则不能为空!',
                        type: 'warning'
                    });
                    return;
                }
                this.$confirm('是否删除该护导规则？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.guideList.splice(guideIndex, 1);
                }).catch(() => {
                });
            },
            // 护导时间增删改
            addGuideTime(guideIndex) {
                this.guideIndex = guideIndex;
                this.guideTimeIndex = -1;
                this.timeRange = ['09:00', '17:30'];
                this.isShowGuideTimeAddPage = true;
            },
            editGuideTime(guideIndex, timeIndex, start, end) {
                this.guideIndex = guideIndex;
                this.guideTimeIndex = timeIndex;
                this.timeRange = [start, end];
                this.isShowGuideTimeAddPage = true;
            },
            addNewGuideTime() {
                if (!this.timeRange || !this.timeRange.length) {
                    this.$message({
                        message: '请选择护导时间!',
                        type: 'warning'
                    });
                    return;
                }
                if (this.timeRange[0] >= this.timeRange[1]) {
                    this.$message({
                        message: '结束时间应大于开始时间!',
                        type: 'warning'
                    });
                    return;
                }

                if (this.loadConfirm) {
                    return;
                }
                this.loadConfirm = true;

                if (this.guideTimeIndex === -1) { //新增
                    const addTimeRule = this.guideList[this.guideIndex].guideTimeList;
                    if (addTimeRule.length && addTimeRule[addTimeRule.length - 1].endTime >= this.timeRange[0]) {
                        this.$message({
                            message: '护导开始时间应大于前一次结束时间!',
                            type: 'warning'
                        });
                    } else {
                        addTimeRule.push({
                            startTime: this.timeRange[0],
                            endTime: this.timeRange[1]
                        });
                        this.isShowGuideTimeAddPage = false;
                    }
                } else {
                    const addTimeRule = this.guideList[this.guideIndex].guideTimeList;

                    if (this.guideTimeIndex && (addTimeRule[this.guideTimeIndex - 1].endTime >= this.timeRange[0])) {
                        this.$message({
                            message: '护导开始时间应大于前一次结束时间!',
                            type: 'warning'
                        });
                    } else if (addTimeRule.length - 1 > this.guideTimeIndex && addTimeRule[this.guideTimeIndex + 1].startTime <= this.timeRange[1]) {
                        this.$message({
                            message: '护导结束时间应小于下一次开始时间!',
                            type: 'warning'
                        });
                    } else {
                        addTimeRule[this.guideTimeIndex].startTime = this.timeRange[0];
                        addTimeRule[this.guideTimeIndex].endTime = this.timeRange[1];
                        this.isShowGuideTimeAddPage = false;
                    }
                }
                this.loadConfirm = false;
            },
            closeGuideTime(guideIndex, timeIndex) {
                this.$confirm('是否删除该护导时间？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.guideList[guideIndex].guideTimeList.splice(timeIndex, 1);
                }).catch(() => {
                });
            },
            // 保存
            saveGuideTime() {
                if (!this.guideList.length) {
                    this.$message({
                        message: '请添加护导规则!',
                        type: 'warning'
                    });
                    return;
                }
                let canContinueStep = true;
                let canContinueWeek = true;
                let guideTimesList = [];
                this.guideList.forEach((item, index) => {
                    let dayTimeList = [];
                    if (!item.dayNoList.length) {
                        canContinueWeek = false;
                    } else if (!item.guideTimeList.length) {
                        canContinueStep = false;
                    } else {
                        item.guideTimeList.forEach((timeItem, timeIndex) => {
                            dayTimeList.push({
                                startTime: timeItem.startTime,
                                endTime: timeItem.endTime,
                                timeNum: timeIndex + 1
                            });
                        });
                    }
                    guideTimesList.push({
                        dayNoJson: item.dayNoList,
                        guideTimesJson: dayTimeList,
                        ruleNo: index + 1
                    })
                });
                if (!canContinueWeek) {
                    this.$message({
                        message: '请选择护导星期!',
                        type: 'warning'
                    });
                    return;
                }
                if (!canContinueStep) {
                    this.$message({
                        message: '请添加护导时间!',
                        type: 'warning'
                    });
                    return;
                }
                const query = {
                    groupId: this.$route.query.guideGroupId,
                    guideTimesJson: JSON.stringify(guideTimesList)
                };
                this.addGuidTimeSet(query);
            },
            addGuidTimeSet(query) {
                if (this.loadConfirm) {
                    return;
                }
                this.loadConfirm = true;
                addGuidTimeSet(query).then(res => {
                    const data = res.data;
                    if (data.code === 200) {
                        this.$message.success('保存成功');
                        this.$router.back();
                    } else {
                        this.$message.error(data.msg);
                    }
                    this.loadConfirm = false;
                }).catch(() => {
                });
            }
        }
    }
</script>

<style lang="scss" scoped>
    .guide_group_list_wrap {
        padding: 12px;

        .header {
            padding-bottom: 10px;
            border-bottom: 1px solid #eee;
        }

        .guide_rule_box {
            width: 820px;
            margin: 20px auto;
            overflow-x: hidden;
            overflow-y: auto;

            .guide_rule_list {
                padding-bottom: 20px;

                .guide_rule_item {
                    position: relative;
                    width: 800px;
                    margin: 20px auto;
                    border: 1px solid #eee;
                    background: #fcfcfc;
                    overflow: hidden;

                    .guide_name {
                        height: 20px;
                        line-height: 20px;
                        padding: 10px;
                        box-sizing: content-box;
                        border-bottom: 1px solid #eee;
                        font-size: 14px;
                        font-weight: bold;

                        i {
                            float: right;
                            margin: 4px;
                            font-size: 14px;
                            font-weight: bold;
                            color: #F56C6C;
                            cursor: pointer;
                        }
                    }

                    .guide_time_box {
                        padding: 10px 20px;
                        font-size: 14px;

                        .time_line {
                            padding: 5px 0;
                            overflow: hidden;

                            .time_line_item {
                                margin-top: 10px;
                                color: #666;

                                span {
                                    margin-right: 10px;
                                }

                                i {
                                    margin-right: 5px;
                                    font-size: 14px;
                                    font-weight: bold;
                                    color: #409eff;
                                    cursor: pointer;
                                }

                                .el-icon-close {
                                    color: #F56C6C;
                                }
                            }
                        }

                        .guide_time_add_line {
                            height: 40px;
                            line-height: 40px;

                            i {
                                cursor: pointer;
                            }

                            .el-icon-plus {
                                margin-left: 5px;
                                font-weight: bold;
                                color: #409eff;
                            }

                            .el-icon-delete {
                                color: #F56C6C;
                            }
                        }
                    }
                }

                .no_data_msg {
                    height: 40px;
                    line-height: 40px;
                    text-align: center;
                    color: #999;
                }
            }
        }
    }
</style>
