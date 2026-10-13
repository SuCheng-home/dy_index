<template>
    <div class="app-container">
        <div class="filter-container">
            <el-row>
                <el-col :span="7">
                    <el-date-picker :editable="false" class="filter-item" style="width:100%" id="searchDate"
                                    v-model="searchDate" type="daterange" class="mywidthdaterange" :picker-options="pickerOptions"
                                    placeholder="选择时间范围" align="right" size=""
                                    @change="handleDatePickerChange(searchDate)">
                    </el-date-picker>
                </el-col>
                <el-col :span="4" :offset="1">
                    <el-button class="filter-item" type="primary" icon="upload" @click="handleUpload">导出
                    </el-button>
                </el-col>
                <el-col :span="4" :offset="6">
                    <el-input style="width: 100%;" class="filter-item" icon="el-icon-search" v-model="listQuery.searchTitle"
                              placeholder="报修人姓名" @change="handleInputChange"
                              :on-icon-click="handleInputSearch"></el-input>
                </el-col>
            </el-row>
        </div>
        <el-table stripe :data="list" v-loading.body="listLoading" border fit highlight-current-row max-height="670">
            <el-table-column align="center" label="报修人" width="100">
                <template slot-scope="scope">
                    <span>{{scope.row.createUserName}}</span>
                </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip label="报修时间">
                <template slot-scope="scope">
                    <span>{{scope.row.createTime|dataTime}}</span>
                </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip align="center" label="报修内容">
                <template slot-scope="scope">
                    <span>{{scope.row.repairContent}}</span>
                </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip align="center" label="报修地点">
                <template slot-scope="scope">
                    <span>{{scope.row.repairPlace}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="报修类型">
                <template slot-scope="scope">
                    <span>{{scope.row.repairTypeId}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="状态">
                <template slot-scope="scope">
                    <span>{{scope.row.status}}</span>
                </template>
            </el-table-column>
            <el-table-column align="left" label="操作" width="150">
                <template slot-scope="scope">
                    <el-button icon="delete" size="small" type="danger" @click="handleDelete(scope.row)">
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>
<script>
    import _ from 'lodash';
    import {getRepairManageList} from '@/api/schoolManage/repair';
    import {parseTime} from '@/utils';

    export default {
        name: "repair",
        data: function () {
            return {
                pickerOptions: {
                    shortcuts: [{
                        text: '最近一周',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '最近一个月',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '最近三个月',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                            picker.$emit('pick', [start, end]);
                        }
                    }]
                },
                searchDate: [],
                list: null,
                listLoading: false,
                listQuery: {
                    startDate: "",
                    endDate: "",
                    searchTitle: "",
                    pageNo: 1,
                    pageSize: 20
                },
            }
        },
        computed: {},
        filters: {
            dataTime(val) {
                return val.substring(0, 16);
            }
        },
        created() {
            this.listLoading = true;
            getRepairManageList(this.listQuery).then(res => {
                this.list = res.data.data.dataList;
                this.listLoading = false
            }).catch(function (error) {
            })
        },
        methods: {
            handleInputChange: _.debounce(
                function () {
                    getRepairManageList(this.listQuery).then(res => {
                        this.list = res.data.data.dataList;
                        this.listLoading = false
                    }).catch(function (error) {
                    })
                },
                // 这是我们为用户停止输入等待的毫秒数
                700
            ),
            handleInputSearch() {
                getRepairManageList(this.listQuery).then(res => {
                    this.list = res.data.data.dataList;
                    this.listLoading = false
                }).catch(function (error) {
                })
            },
            handleDatePickerChange(searchDate) {
                this.listQuery.startDate = parseTime(searchDate[0], "{y}-{m}-{d}");
                this.listQuery.endDate = parseTime(searchDate[1], "{y}-{m}-{d}");
                getRepairManageList(this.listQuery).then(res => {

                }).catch(function (error) {
                })
            },
            handleDelete() {

            },
            handleUpload() {
                require.ensure([], () => {
                    const {export_json_to_excel} = require('@/vendor/Export2Excel');
                    const tHeader = ['报修人', '报修时间', '报修内容', '报修地点', '报修类型', '状态', '处理结果', '反馈内容'];
                    const filterVal = ['createLoginName', 'createTime', 'repairContent', 'repairPlace', 'repairTypeName', 'status', 'dealContent', 'fbackContent'];
                    const list = this.list;
                    const data = this.formatJson(filterVal, list);
                    export_json_to_excel(tHeader, data, '维修导出列表');
                })
            },
            formatJson(filterVal, jsonData) {
                return jsonData.map(v => filterVal.map(j => v[j]))
            }

        }
    }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>

</style>
