<template>
    <div id="pushDataLog">
        <div class="main-panel">
            <div>
                <div class="main-panel__header">
                    <el-button type="default" @click="$router.back()" size="medium">返回</el-button>
                    <el-date-picker
                        size="medium"
                        type="daterange" class="mywidthdaterange"
                        range-separator="-"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        value-format="yyyy-MM-dd"
                        style="width: 240px;"
                        :clearable="false"
                            v-model="dateRange"
                        @change="getList"
                    ></el-date-picker>
                    <el-select size="medium" @change="getList()" v-model="eventType" placeholder="请选择"
                               style="width:120px">
                        <el-option value="USER,DEPART" label="用户,部门"></el-option>
                    </el-select>
                    <el-input style="width: 240px"
                              size="medium"
                                  placeholder="请输入操作对象名称" icon="el-icon-search" @keyup.enter.native="handleInputChange"
                              v-model.trim="serachContentVal">
                    </el-input>
                    <el-input style="width: 240px" class="search-input search-input--right"
                              size="medium"
                              placeholder="" icon="el-icon-search" @keyup.enter.native="handleInputChange"
                              v-model.trim="searchTitle">
                        <el-button slot="append" size="medium" icon="el-icon-search"
                                   @click="getList"></el-button>
                    </el-input>
                    <el-select size="medium" class="search-select" @change="searchSelectChange" v-model="searchMode" placeholder="请选择">
                        <el-option value="message" label="编号"></el-option>
                        <el-option value="app" label="应用"></el-option>
                    </el-select>
                </div>
            </div>
            <div>
                <el-table
                    :height="maxH"
                    :data="dataList"
                    style="width: 100%" border
                    @filter-change="filterChangeHandler"
                >
                    <el-table-column
                        label="编号"
                        prop="messageId"
                        align="center"
                    >
                    </el-table-column>
                    <el-table-column
                        label="对象"
                        align="center" show-overflow-tooltip
                    >
                        <template slot-scope="scope">
                            {{scope.row.eventType | eventTypeFilter }}
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="操作类型" show-overflow-tooltip
                        align="center"
                        column-key="operation"
                        :filters="[
                            { text: '新增', value: 'add' },
                            { text: '删除', value: 'delete' },
                            { text: '修改', value: 'update' },
                            { text: '用户账号', value: 'update_user_account' },
                            { text: '部门负责人', value: 'update_depart_manager' },
                            { text: '移动用户部门', value: 'move_user_depart' },
                            { text: '充值', value: 'recharge' },
                            { text: '挂失', value: 'reportLoss' },
                            { text: '解挂', value: 'relieveLoss' },
                            { text: '发卡', value: 'publishCard' },
                            { text: '换卡', value: 'replace' }
                        ]"
                        :filter-multiple="false"
                    >
                        <template slot-scope="scope">
                            {{scope.row.operationType | operationTypeFilter}}
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="内容"
                        align="center" show-overflow-tooltip
                        prop="eventType"
                    >
                        <template slot-scope="scope">
                            {{scope.row.content}}
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="时间"
                        align="center" show-overflow-tooltip
                    >
                        <template slot-scope="scope">
                            {{scope.row.createdTime | timeFilter}}
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="下发状态"
                        align="center" show-overflow-tooltip
                    >
                        <template slot-scope="scope">
                            {{scope.row.httpResultCode}}
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="学校"
                        align="center" show-overflow-tooltip
                    >
                        <template slot-scope="scope">
                            {{scope.row.schoolName}}
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="应用"
                        align="center" show-overflow-tooltip
                    >
                        <template slot-scope="scope">
                            {{scope.row.appName}}
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="处理结果"
                        align="center" show-overflow-tooltip
                        column-key="result"
                        :filters="[
                            { text: '成功', value: 1 },
                            { text: '失败', value: 2 },
                        ]"
                        :filter-multiple="false"
                    >
                        <template slot-scope="scope">
                            <span class="link" @click="showFailMsg(scope.row)" v-if="scope.row.result == 2">{{scope.row.result | resultFilter}}</span>
                            <span v-else>{{scope.row.result | resultFilter}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="操作内容" show-overflow-tooltip
                        align="center"
                    >
                        <template slot-scope="scope">
                            <el-button type="text" size="small" :disabled="scope.row.result == 1" @click="retryHandler(scope.row)">重试</el-button>
                            <el-button type="text" size="small" :disabled="scope.row.result == 1" @click="dealHandler(scope.row)">已处理</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <div class="pagination-container">
                    <el-pagination
                        @size-change="sizeChangeHandler"
                        @current-change="currentChangeHandler"
                        :current-page.sync="pagination.pageNo"
                        :page-sizes="[10, 20, 30, 50]"
                        :page-size.sync="pagination.pageSize"
                        layout="total, sizes, prev, pager, next, jumper"
                        :page-count="pagination.pages"
                        :total="pagination.total"
                    >
                    </el-pagination>
                </div>
            </div>
        </div>
        <el-dialog
            title="失败信息"
            :visible.sync="isShowDialog"
            :close-on-press-escape='false'
            width="600px"
            :lock-scroll="false"
            :close-on-click-modal='false'
            :modal-append-to-body='false'
        >
            <div>
                {{failMsg}}
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import moment from 'moment';
    import windowResize from '@/mixins/windowResize.js';
    import baseMixin from '@/mixins/baseMixin.js';

    import {
        pushRecordLogList,
        retryPush,
        updatePushtState
    } from '@/api/systemSet/org';
    import {mapGetters} from 'vuex';

    export default {
        mixins: [windowResize, baseMixin],
        data() {
            return {
                eventType: 'USER,DEPART',
                dataList: [],
                dateRange: [moment().startOf('month').format('YYYY-MM-DD'), moment().format('YYYY-MM-DD')],
                searchMode: 'message',
                searchTitle: '',
                serachContentVal: '',
                failMsg: '',
                isShowDialog: false,
                operationType: '',
                result: 2
            }
        },
        computed: {
            ...mapGetters(['schoolInfo'])
        },
        mounted() {
            this.pushRecordLogListFunc();
        },
        filters: {
            operationTypeFilter(value) {
                return {
                    add: '新增',
                    delete: '删除',
                    update: '修改',
                    move_user_depart: '移动用户部门',
                    update_depart_manager: '修改部门负责人',
                    update_user_account: '修改用户账号',
                    recharge: '充值',
                    reportLoss: '挂失',
                    relieveLoss: '解挂',
                    publishCard: '发卡',
                    replace: '换卡'

                }[value];
            },
            eventTypeFilter(value) {
                return {
                    USER: '用户',
                    DEPART: '部门',
                    FACE: '人脸',
                    CAMPUSCARD: '一卡通'
                }[value];
            },
            resultFilter(result) {
                return {
                    1: '成功',
                    2: '失败'
                }[result]
            },
            timeFilter(value) {
                return value.slice(0, value.lastIndexOf('.'));
            },

        },
        methods: {
            filterChangeHandler(filterObj) {
                if(filterObj.operation) {
                    this.operationType = filterObj.operation.length === 0 ? '' : filterObj.operation[0];
                }
                if(filterObj.result) {
                    this.result = filterObj.result.length === 0 ? 0: filterObj.result[0];

                }
                this.getList();
            },
            searchSelectChange() {
                this.searchTitle = '';
                this.serachContentVal = '';
                this.getList();
            },
            retryHandler(item) {
                retryPush({
                    id: item.id
                })
                    .then(res => res.data)
                    .then(data => {
                        if(data.result) {
                            this.$message.success('重试成功');
                            this.getList();
                        } else {
                            this.$message.error(data.msg);
                        }
                    })
            },
            dealHandler(item) {
                updatePushtState({
                    id: item.id
                })
                    .then(res => res.data)
                    .then(data => {
                        if(data.result) {
                            this.$message.success('处理成功');
                            this.getList();
                        } else {
                            this.$message.error(data.msg);
                        }
                    })
            },
            showFailMsg(item) {
                this.isShowDialog = true;
                this.failMsg = JSON.parse(item.httpResultBody).msg;
            },
            getList() {
                this.pushRecordLogListFunc();
            },
            pushRecordLogListFunc() {
                const args = {
                    eventType: this.eventType,
                    startDateTime: moment(this.dateRange[0]).format('YYYY-MM-DD'),
                    endDateTime: moment(this.dateRange[1]).format('YYYY-MM-DD'),
                    pageNo: this.pagination.pageNo,
                    pageSize: this.pagination.pageSize,
                    appName	: '',
                    httpResultCode: 0,
                    schoolName: this.schoolInfo.name,
                    messageId: '',
                    operationType: this.operationType,
                    result: this.result,
                    serachContentVal: this.serachContentVal
                };
                if(this.searchMode === 'message') {
                    args.messageId = this.searchTitle;
                } else if(this.searchMode === 'school') {
                    args.schoolName = this.schoolInfo.name;
                } else {
                    args.appName = this.searchTitle;
                }
                pushRecordLogList(args)
                    .then(res => res.data)
                    .then(data => {
                        const pageData = data.data;
                        this.pagination.total = pageData.pagination.total;
                        this.dataList = pageData.dataList;
                    })
            },
            handleInputChange() {
                this.selectedwordList = [];
                this.selectedCharIdList = [];
                this.pushRecordLogListFunc();
            },
            sizeChangeHandler() {
                this.pagination.pageNo = 1;
                this.pushRecordLogListFunc();
            },
            currentChangeHandler() {
                this.pushRecordLogListFunc();
            },
        }
    }
</script>

<style lang="scss" scoped>
    @import "../../../styles/mixin";

    #pushDataLog {
        height: 100%;
    }

    .group-container {
        height: 300px;
        overflow-y: auto;
        @include scrollBar;
        width: 260px;

    }

    .main-panel {
        padding: 12px;
    }

    .title {
        margin: 10px 0;
        border-left: 4px solid #409EFF;
        padding-left: 12px;
        height: 16px;
        line-height: 16px;
    }

    .group-item--title {
        width: 100px;
        height: 26px;
        margin-left: 20px;
        margin-top: 10px;
        display: block;
        color: #7B7B7B;
    }

    .group-item {
        height: 30px;
        text-align: left;
        line-height: 30px;
        display: block;
        padding: 0 30px;
        cursor: pointer;
        border-radius: 2px;
        position: relative;

        .fa {
            float: right;
            margin: 7px 0 0 10px;
            display: none;
        }

        &:hover {
            background-color: #ECECEC;

            .fa {
                display: block;
            }
        }

        &.group-item--active {
            background-color: #409EFF;
            color: #fff;

            .fa-edit {
                color: #fff;
            }
        }

        .fa-trash {
            color: #f08080;
        }

        .fa-edit {
            color: #409EFF;
        }
    }

    .char-list {
        padding-top: 12px;
    }

    .word-item {
        float: left;
        box-sizing: border-box;
        height: 80px;
        border: 2px solid #ddd;
        margin: 0 10px 10px 0;
        text-align: center;
        padding: 14px;
        font-size: 36px;
        cursor: pointer;
        position: relative;

        .fa-edit {
            position: absolute;
            font-size: 16px;
            right: 5px;
            top: 5px;
            color: #409EFF;
            display: none;
        }

        &:hover {
            .fa-edit {
                display: block;
            }
        }

        &.word-item--active {
            border: 2px solid #409EFF;
        }
    }

    .main-panel__header {
        padding-bottom: 10px;
        border-bottom: 1px solid #e4e7ed;
    }

    .char-container {
        width: 70px;
        height: 70px;
        font-size: 52px;
        margin: 0 auto;
        text-align: center;
        line-height: 80px;
        margin-bottom: 5px;
    }

    .form-item-container {
        width: 500px;
        margin: 0 auto;
        text-align: center;
        margin-bottom: 10px;
    }

    .dialog-value {
        display: inline-block;
        vertical-align: middle;
        width: 280px;
        text-align: left;
    }

    .uploader-container {
        width: 140px;
    }

    .dialog-label {
        display: inline-block;
        vertical-align: middle;
        width: 200px;
        text-align: right;
        margin-right: 10px;
    }

    .add-line {
        color: #409EFF;
        cursor: pointer;
    }

    .form-item-container--voice {
        & > * {
            vertical-align: top;
        }

        .fa-close {
            color: #f08080;
            margin-left: 10px;
        }
    }
    .link {
        color: #20a0ff;
        cursor: pointer;
    }
</style>
<style lang="scss">
    .dialog-form .is-current.is-focusable > .el-tree-node__content {
        background-color: #20a0ff !important;
        color: #fff !important;
    }
    #pushDataLog {
        .search-select {
            width:120px;
            float: right;
            margin-right: 5px;
        }
    }
    #pushDataLog .form-item-container--line {
        .upload-file-item {
            width: 80px;
            height: 80px;
        }

        .upload-file-item img {
            margin: 0;
        }

    }
</style>
