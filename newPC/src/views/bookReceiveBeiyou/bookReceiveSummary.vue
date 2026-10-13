<template>
    <div class="stack-room-wrap">
        <el-tabs v-model="activeName" type="border-card" @tab-click="clickTab">
            <el-tab-pane label="图书领用" name="bookReceiveList">

            </el-tab-pane>
            <el-tab-pane label="领用记录" name="bookReceiveAllList">

            </el-tab-pane>
            <el-tab-pane label="汇总统计" name="bookReceiveSummary">
                <div class="header">
                    <el-row>
                        <el-col :span="19">
                            <el-date-picker
                                v-model="duration"
                                format="yyyy-MM-dd"
                                value-format="yyyy-MM-dd"
                                size="medium"
                                type="daterange" class="mywidthdaterange"
                                range-separator="-"
                                @change="getList"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期">
                            </el-date-picker>
                            <el-select v-model="typeId" size="medium" @change="getList" placeholder="请选择班级">
                                <el-option label="全部班级" value="0"></el-option>
                                <el-option
                                    v-for="item in typeList"
                                    :key="item.id"
                                    :label="item.typeName"
                                    :value="item.id"
                                >
                                </el-option>
                            </el-select>
                            <a :href="exportUrl" target="_blank" download="导出结果" v-if="dataList.length">
                                <el-button type="primary" size="medium">导出</el-button>
                            </a>
                        </el-col>
                    </el-row>
                </div>
                <el-table stripe :data="dataList" border :span-method="arraySpanMethod" :height="notbmaxH - 93" style="width: 100%" id="outTable">
                    <el-table-column align="center" prop="typeName" label="类型" show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column align="center" prop="receiveTypeName" label="持有人" show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column align="center" prop="count" label="总数量" show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column align="center" label="总金额（元）" show-overflow-tooltip>
                        <template slot-scope="scope">
                            {{scope.row.total / 100}}
                        </template>
                    </el-table-column>
                </el-table>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
    import moment from 'moment';
    import mixins from '@/mixins/windowResize';
    import baseMixin from '@/mixins/baseMixin';
    import ImagePreviewer from "@/components/ImagePreviewer/ImagePreviewer.vue";

    import {
        bookReceiveAnalysis,
        getManageBookType,
    } from '@/api/bookReceiveBeiyou';

    export default {
        name: "bookReceiveAllList",
        mixins: [mixins, baseMixin],
        components: {ImagePreviewer},
        data() {
            return {
                activeName: 'bookReceiveSummary',
                duration: [moment().startOf('month').format('YYYY-MM-DD'), moment().format('YYYY-MM-DD')],
                typeId: '0',
                searchName: '',
                typeList: [],
                dataList: []
            }
        },
        computed: {
            exportUrl() {
                return `${global.BasePath}structure/bookReceive/downBookReceiveAnalysis?endDate=${this.duration[1]}&startDate=${this.duration[0]}&typeId=${this.typeId}&token=${this.$store.getters.token}`
            }
        },
        mounted() {
            getManageBookType()
                .then(res => res.data)
                .then(data => {
                    this.typeList = data.data;
                });
            this.bookReceiveAnalysisFunc();
            
        },
        methods: {
            bookReceiveAnalysisFunc() {
                bookReceiveAnalysis({
                    startDate: this.duration[0],
                    endDate: this.duration[1],
                    typeId: this.typeId
                })
                    .then(res => res.data)
                    .then(data => {
                        const dataList = [];
                        data.data.forEach(item => {
                            dataList.push({
                                typeName: item.typeName,
                                receiveTypeName: '个人',
                                count: item.userReceiveCount,
                                total: item.userReceiveTotalPrice
                            });
                            dataList.push({
                                typeName: item.typeName,
                                receiveTypeName: '班级',
                                count: item.classReceiveCount,
                                total: item.classReceiveTotalPrice
                            });
                            dataList.push({
                                typeName: item.typeName,
                                receiveTypeName: '总计',
                                count: item.totalCount,
                                total: item.totalPrice
                            });
                        });
                        this.dataList = dataList;
                    });
            },
            // 点击tab
            clickTab() {
                this.$router.replace({path: this.activeName})

            },
            getList() {
                this.pagination.pageNo = 1;
                this.bookReceiveAnalysisFunc();
            },
            arraySpanMethod({ row, column, rowIndex, columnIndex }) {
                if(columnIndex === 0) {
                    if (rowIndex % 3 === 0) {
                        return {
                            rowspan: 3,
                            colspan: 1
                        };
                    } else {
                        return {
                            rowspan: 0,
                            colspan: 0
                        }
                    }
                }

            },
        }
    }
</script>

<style scoped>
    .stack-room-wrap {
        padding:12px;
    }


    .header {
        padding-bottom: 10px;
    }
</style>
