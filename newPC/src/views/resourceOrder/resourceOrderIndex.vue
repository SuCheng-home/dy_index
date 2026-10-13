<template>
    <div class="page">
        <div class="header">
            <el-button type="primary" size="medium" v-if="isShowByPermission('/resource/orderResource')"
                       @click="jumpToPage('resourceOrderAdd')">预约
            </el-button>
            <el-button type="primary" size="medium" @click="jumpToPage('resourceOrderTodayDetail', { time: time })">当日明细
            </el-button>
            <el-button type="primary" size="medium"  v-if="isStandalone" @click="jumpToPage('resourceOrderMyOrder')">我的预约</el-button>
            <el-date-picker
                type="date"
                v-model="time"
                placeholder="选择日期"
                @change="dateChangeHandler" size="medium"
            >
            </el-date-picker>
        </div>
        <div class="table-container">

            <el-table stripe class="chart-bar-table"
                      :data="dataList"
                      border
                      style="width: 100%"
                      :height="nobottommaxH"
            >
                <el-table-column
                    prop="resourceName"
                    label="资源名称"
                    show-overflow-tooltip
                    fit
                    min-width="120"
                    :resizable="false"
                >
                </el-table-column>
                <el-table-column label="时间(整点)" align="center">
                    <el-table-column
                        label="7"
                        width="60"
                        align="center"
                        :resizable="false"
                    >
                        <template slot-scope="scope">
                            <div class="chart-bar-container"
                                 v-if="scope.row.times.length !== 0"
                            >
                                <el-tooltip
                                    v-for="(timeEntry, index) in scope.row.times"
                                    class="item"
                                    effect="dark"
                                    :content="`使用人：${ timeEntry.userName }，使用内容(预约理由)：${ timeEntry.title !== '' ? timeEntry.title : '无' }，预约时间：${ timeEntry.starTime } 至 ${ timeEntry.endTime }${ timeEntry.state === 0 ? '，待审核' : '' }`"
                                    placement="top"
                                    :key="index"
                                >
                                    <div
                                        class="chart-bar"
                                        :style="[calcBarStyle(timeEntry)]"
                                    ></div>
                                </el-tooltip>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="8"
                        width="60"
                        align="center"
                        :resizable="false"
                    >
                    </el-table-column>
                    <el-table-column
                        label="9"
                        width="60"
                        align="center"
                        :resizable="false"
                    >
                    </el-table-column>
                    <el-table-column
                        label="10"
                        width="60"
                        align="center"
                        :resizable="false"
                    >
                    </el-table-column>
                    <el-table-column
                        label="11"
                        width="60"
                        align="center"
                        :resizable="false"
                    >
                    </el-table-column>
                    <el-table-column
                        label="12"
                        width="60"
                        align="center"
                        :resizable="false"
                    >
                    </el-table-column>
                    <el-table-column
                        label="13"
                        width="60"
                        align="center"
                        :resizable="false"
                    >
                    </el-table-column>
                    <el-table-column
                        label="14"
                        width="60"
                        align="center"
                        :resizable="false"
                    >
                    </el-table-column>
                    <el-table-column
                        label="15"
                        width="60"
                        align="center"
                        :resizable="false"
                    >
                    </el-table-column>
                    <el-table-column
                        label="16"
                        width="60"
                        align="center"
                        :resizable="false"
                    >
                    </el-table-column>
                    <el-table-column
                        label="17"
                        width="60"
                        align="center"
                        :resizable="false"
                    >
                    </el-table-column>
                    <el-table-column
                        label="18"
                        width="60"
                        align="center"
                        :resizable="false"
                    >
                    </el-table-column>
                    <el-table-column
                        label="19"
                        width="60"
                        align="center"
                        :resizable="false"
                    >
                    </el-table-column>
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script>
    import {mapGetters} from 'vuex';
    import {isShowByPermission} from '@/utils';
    import windowResizeMixin from '@/mixins/windowResize';
    import {loadResOrder} from '@/api/resourceOrder';

    export default {
        data: function () {
            return {
                time: this.$moment().format('YYYY-MM-DD'),
                dataList: []
            }
        },
        mixins: [windowResizeMixin],
        methods: {
            isShowByPermission,
            jumpToPage(path, query = {}) {
                this.$router.push({
                    path,
                    query
                })
            },
            loadDataHandler(time) {
                loadResOrder({
                    time
                }).then(res => {
                    this.dataList = res.data.data;
                })
            },
            dateChangeHandler(value) {
                this.time = this.$moment(value).format('YYYY-MM-DD');
                this.loadDataHandler(this.time);
            },
            getDuration(startDay, endDay) {
                const
                    endDayLimit = this.$moment(startDay).hours(20).minutes(0).valueOf(),
                    startDayNumber = this.$moment(startDay).valueOf();
                let
                    endDayNumber = this.$moment(endDay).valueOf();
                endDayNumber = endDayNumber > endDayLimit ? endDayLimit : endDayNumber;
                const minutesDuration = parseInt((endDayNumber - startDayNumber) / (1000 * 60));
                const hours = parseInt(minutesDuration / 60);
                const minutes = parseInt(minutesDuration % 60);
                return hours + (parseFloat((minutes / 60).toFixed(2)));
            },
            calcBarStyle(timeEntry) {
                return {
                    left: `${(this.getDuration(`${this.time} 07:00:00`, timeEntry.startDay)) * 60 - 1}px`,
                    width: `${this.getDuration(timeEntry.startDay, timeEntry.endDay) * 60}px`,
                    backgroundColor: timeEntry.state === 0 ? '#FF8F59' : '#337ab7'
                }
            }
        },
        computed: {
            resourceName() {
                return this.dataList.map(dataEntry => dataEntry.resourceName);
            },
            ...mapGetters(['isStandalone'])
        },
        created() {
            this.loadDataHandler(this.time);
        },
    }
</script>

<style scoped>
    .page {
        padding:12px;
    }

    .header {
        margin-bottom: 10px;
    }

    .table-container {
        position: relative;
    }

    .chart-bar-container {
        position: absolute;
        height: 10px;
        width: 1050px;
        top: 15px;
        left: 0;
        overflow: hidden;
    }
    .el-button+.el-button {
        margin-left: 0;
    }

    .chart-bar {
        z-index: 1000;
        position: absolute;
        height: 10px;
    }
</style>
