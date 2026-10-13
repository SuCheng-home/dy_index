<template>
    <div class="repair-index">
        <el-row style="padding-bottom: 10px">
            <el-col :span="24">
                <el-date-picker
                    size="medium"
                    type="daterange" class="mywidthdaterange"
                    range-separator="-"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    :editable="false"
                    :clearable="false"
                    v-model="duration"
                    @change="onGetList"
                ></el-date-picker>
                <template v-if="orderReasonList && orderReasonList.length !== 0">
                    <el-select @change="onGetList" style="width: 140px;" size="medium" v-model="orderReasonCode">
                        <el-option :value="''" label="全部事由类型"></el-option>
                        <el-option :value="item.code" :label="item.value" v-for="(item,indexa) in orderReasonList" :key="indexa"></el-option>
                    </el-select>
                </template>
                <el-select size="medium" class="resource-select" @change="onTypeChange" v-model="resourceTypeId"
                           placeholder="请选择资源类型">
                    <el-option v-if="isSchoolLeader" :value="0" label="全部资源类型"></el-option>
                    <el-option
                        v-for="( typeEntry, index ) in typeList"
                        :key="index"
                        :label="typeEntry.name"
                        :value="typeEntry.id">
                    </el-option>
                </el-select>
                <span v-show="resourceTypeId != 0">
                    <el-select @change="onGetList" size="medium" class="resource-select" v-model="resourceId"
                               placeholder="请选择资源">
                        <el-option :value="0" label="全部资源"></el-option>
                        <el-option
                            v-for="( resourcesEntry, index ) in resourcesList"
                            :key="index"
                            :label="resourcesEntry.name"
                            :value="resourcesEntry.id">
                        </el-option>
                    </el-select>
                </span>

                <a :href="exportUrl" target="_blank" download="examName" v-if="dataList.length">
                    <el-button type="primary" size="medium">导出</el-button>
                </a>
            </el-col>
        </el-row>

        <el-table
            border
            fit
            stripe
            highlight-current-row
            style="width: 100%"
            :height="maxH"
            :data="dataList"
        >
            <el-table-column align="center" label="预约人" prop="orderName" show-overflow-tooltip>
            </el-table-column>
            <el-table-column v-if="orderReasonList && orderReasonList.length !== 0" align="center" label="事由(用途)"
                             prop="orderReasonValue" show-overflow-tooltip>
            </el-table-column>
            <el-table-column v-if="serviceObjectList && serviceObjectList.length !== 0" align="center" label="服务对象"
                             prop="serviceObjectValue" show-overflow-tooltip>
            </el-table-column>
            <el-table-column align="center" label="使用内容(预约理由)" show-overflow-tooltip>
                <template slot-scope="scope">
                    {{ scope.row.orderResion || '--' }}
                </template>
            </el-table-column>
            <el-table-column align="center" label="开始时间" width="150px" show-overflow-tooltip>
                <template slot-scope="scope">
                    {{ scope.row.beginTime | filterDate }}
                </template>
            </el-table-column>
            <el-table-column align="center" label="结束时间" width="150px" show-overflow-tooltip>
                <template slot-scope="scope">
                    {{ scope.row.endTime | filterDate }}
                </template>
            </el-table-column>
            <el-table-column align="center" label="设备、设施使用情况" show-overflow-tooltip>
                <template slot-scope="scope">
                    {{ scope.row.feedbackMarks || '--' }}
                </template>
            </el-table-column>
            <el-table-column align="center" label="资源名称" prop="resourceName" show-overflow-tooltip>
            </el-table-column>
            <el-table-column align="center" label="资源类型" prop="resourceTypeName" show-overflow-tooltip>
            </el-table-column>
            <el-table-column align="center" label="状态" show-overflow-tooltip>
                <template slot-scope="scope">
                    {{ statusToText(scope.row.status)}}
                </template>
            </el-table-column>
            <el-table-column align="center" label="审批人" show-overflow-tooltip>
                <template slot-scope="scope">
                    {{ scope.row.examineName || '--' }}
                </template>
            </el-table-column>
            <el-table-column align="center" label="支持人" show-overflow-tooltip>
                <template slot-scope="scope">
                    {{ scope.row.appointerStr || '--' }}
                </template>
            </el-table-column>
            <el-table-column align="center" label="操作" show-overflow-tooltip>
                <template slot-scope="scope">
                    <el-button size="small" type="text" :disabled="scope.row.status != 0 && scope.row.status != 2"
                               @click.native="onClickCancel(scope.row.id)">取消预约
                    </el-button>
                </template>
            </el-table-column>
        </el-table>

        <el-pagination
            style="margin-top: 20px"
            layout="total, sizes, prev, pager, next, jumper"
            :current-page.sync="pagination.pageNo"
            :page-size.sync="pagination.pageSize"
            :page-sizes="pagination.pageSizes"
            :total="pagination.total"
            @size-change="onGetList"
            @current-change="getSchoolResourceOrderPageListFunc"
        ></el-pagination>

        <el-dialog title="取消预约" @close="isShowCancelDialog = false" :visible.sync="isShowCancelDialog" size="tiny"
                   append-to-body :modal-append-to-body='false'>
            <div>
                <el-form
                    :model="formData"
                    ref="form"
                    :rules="formRules"
                    label-width="80px"
                >
                    <el-form-item prop="cancelResion" label="取消原因">
                        <el-input
                            type="textarea"
                            :rows="3"
                            placeholder="请输入取消原因"
                            v-model="formData.cancelResion"
                        >
                        </el-input>
                    </el-form-item>
                </el-form>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="isShowCancelDialog = false">取消</el-button>
                <el-button type="primary" @click="cancelHandler">确定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import mixin from "@/mixins/windowResize";
    import {isShowByPermission} from "@/utils";
    import {getSchoolDicByCode} from '@/utils/utils';
    import moment from "moment";

    import baseMixin from '@/mixins/baseMixin';

    import {
        getSchoolResourceOrderPageList,
        getResourceTypeListForStatics,
        getResourceListForStatics,
        cancelOrderResourceByManager
    } from '@/api/resourceOrder';

    export default {
        name: "resourceOrderSummary",
        mixins: [mixin, baseMixin],
        filters: {
            filterDate(val) {
                return val ? moment(val).format("YYYY-MM-DD HH:mm") : "--";
            },
            
        },
        computed: {
            exportUrl() {
                return `${global.BasePath}structure/resource/exportResourceOrder?beginTime=${moment(this.duration[0]).format('YYYY-MM-DD')}&endTime=${moment(this.duration[1]).format('YYYY-MM-DD')}&orderReasonCode=${this.orderReasonCode}&resourceId=${this.resourceId}&resourceTypeId=${this.resourceTypeId}&token=${this.$store.getters.token}`
            }
        },
        data() {
            return {
                // 类型列表
                typeList: [],
                resourcesList: [],
                // 状态列表
                duration: [this.$moment().startOf('month'), new Date()],
                orderReasonList: [],
                serviceObjectList: [],
                isSchoolLeader: false,
                orderReasonCode: '',
                resourceTypeId: 0,
                resourceId: 0,
                dataList: [],

                isShowCancelDialog: false,
                cancelId: '',
                formData: {
                    cancelResion: ''
                },
                formRules: {
                    cancelResion: [
                        {required: true, message: '请填写取消原因', trigger: 'blur'}
                    ],
                }
            };
        },
        created() {
            Promise.all([
                getSchoolDicByCode('orderReasons')
                    .then(data => {
                        const pageData = data;
                        this.orderReasonList = pageData;
                    }),
                getSchoolDicByCode('serviceObjects')
                    .then(data => {
                        const pageData = data;
                        this.serviceObjectList = pageData;
                    }),
                new Promise(resolve => {
                    getResourceTypeListForStatics()
                        .then(res => res.data)
                        .then(data => {
                            const pageData = data.data;
                            this.isSchoolLeader = pageData.isSchoolLeader == 1;
                            this.typeList = pageData.resourceTypeList;
                            if (pageData.resourceTypeList.length !== 0) {
                                if (pageData.isSchoolLeader != 1) {
                                    this.resourceTypeId = pageData.resourceTypeList[0].id;
                                    this.typeChangeHandler(pageData.resourceTypeList[0].id)
                                        .then(() => {
                                            resolve();
                                        });
                                } else {
                                    resolve();
                                }
                            }
                        })
                })
                    .then(() => {
                        this.getSchoolResourceOrderPageListFunc();
                    })
            ]);
        },
        methods: {
            statusToText(status) {
                let textStr = '';
                switch (status) {
                    case '':
                    case -1:
                        textStr = '取消预约';
                        break;
                    case 0:
                        textStr = '待审核';
                        break;
                    case 1:
                        textStr = '使用中';
                        break;
                    case 2:
                        textStr = '未使用';
                        break;
                    case 3:
                        textStr = '同意预约';
                        break;
                    case 4:
                        textStr = '拒绝预约';
                        break;
                    case 5:
                        textStr = this.$store.getters.schoolInfo.id==7423?'预约成功':'预约中';
                        break;
                    case 6:
                        textStr = '已过期';
                        break;
                    case 7:
                        textStr = '使用结束';
                        break;
                    default:
                        break;
                }
                return textStr;
            },
            isShowByPermission,
            onTypeChange(typeId) {
                this.resourceId = 0;
                if (typeId != 0) {
                    this.typeChangeHandler(typeId)
                        .then(() => {
                            this.getSchoolResourceOrderPageListFunc();
                        });
                } else {
                    this.getSchoolResourceOrderPageListFunc();
                }
            },
            onGetList() {
                this.pagination.pageNo = 1;
                this.getSchoolResourceOrderPageListFunc();
            },
            onClickCancel(id) {
                this.formData.cancelResion = '';
                this.cancelId = id;
                this.isShowCancelDialog = true;
            },
            cancelHandler() {
                this.formData.cancelResion = this.formData.cancelResion.trim();
                this.$refs.form.validate(isValid => {
                    if (isValid) {
                        cancelOrderResourceByManager({
                            cancelResion: this.formData.cancelResion,
                            id: this.cancelId
                        })
                            .then(res => res.data)
                            .then(data => {
                                if (data.result) {
                                    this.$message.success('取消成功');
                                    this.getSchoolResourceOrderPageListFunc();
                                    this.isShowCancelDialog = false;
                                } else {
                                    this.$message.error(data.msg);
                                }
                            })
                    }
                })
            },
            getSchoolResourceOrderPageListFunc() {
                getSchoolResourceOrderPageList({
                    beginTime: moment(this.duration[0]).format('YYYY-MM-DD'),
                    endTime: moment(this.duration[1]).format('YYYY-MM-DD'),
                    orderReasonCode: this.orderReasonCode,
                    resourceId: this.resourceId,
                    resourceTypeId: this.resourceTypeId,
                    pageNo: this.pagination.pageNo,
                    pageSize: this.pagination.pageSize
                })
                    .then(res => res.data)
                    .then(data => {
                        this.dataList = data.data.dataList;
                        this.pagination.total = data.data.pagination.total;
                    })
            },
            typeChangeHandler(typeId) {
                return getResourceListForStatics({
                    resourceTypeId: typeId
                })
                    .then(res => res.data)
                    .then(data => {
                        if (data.result) {
                            this.resourcesList = data.data;
                        } else {
                            this.$message.error('error');
                        }
                    })
                    .catch(error => {
                        this.$message.error(error);
                    })
            },
        },
    };
</script>
<style lang="scss" scoped>
    .repair-index {
        padding:12px;

        .filter-wrapper {
            margin-bottom: 10px;
        }

        .el-table__body-wrapper {
            .delete-btn {
                color: #f56c6c;
            }
        }
    }
</style>
