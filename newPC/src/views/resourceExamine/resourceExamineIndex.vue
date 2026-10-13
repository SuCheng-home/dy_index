<template>
    <div class="page">
        <div class="header">
            <el-row>
                <el-col :span="19">
                      <el-date-picker
                    size="medium"
                    type="daterange" class="mywidthdaterange"
                    range-separator="-"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    :editable="false"
                    :clearable="false"
                    v-model="duration"
                    @change="newresourceExamineListHandler"
                ></el-date-picker>
                 <el-select size="medium" class="resource-select" @change="newresourceExamineListHandler" v-model="typeId"
                           placeholder="请选择资源类型">
                    <el-option  :value="0" label="全部资源类型"></el-option>
                    <el-option
                        v-for="( typeEntry, index ) in typeList"
                        :key="index"
                        :label="typeEntry.name"
                        :value="typeEntry.id">
                    </el-option>
                </el-select>

                    <el-select   v-model="orderStatus"  placeholder="请选择"  @change="radioChangeHandler" size="medium">
                        <el-option  label="待审批" :value="0" ></el-option>
                        <el-option  label="已审批" :value="1" ></el-option>
                    </el-select>
                </el-col>
                <el-col :span="5">
                    <el-input placeholder="请输入内容" size="medium" v-model="searchTitle"
                              @keyup.enter.native="searchTitleHandler">
                        <el-button slot="append" icon="el-icon-search" @click="searchTitleHandler"
                                   :loading="isLoading"></el-button>
                    </el-input>
                </el-col>
            </el-row>

        </div>
        <el-table
            ref="multipleTable"
            :data="dataList"
            border
            style="width: 100%"
            :height="maxH"
            fit
        >
            <el-table-column
                type="expand"
            >
                <template slot-scope="scope">
                    <el-form inline label-position="right" class="table-expand" label-width="160px">
                        <el-form-item label="资源名称：">
                            {{ scope.row.resourceName }}
                        </el-form-item>
                        <el-form-item label="申请人：">
                            {{ scope.row.orderName }}
                        </el-form-item>
                        <br/>
                        <el-form-item label="预约时间：" class="whole-line">
                            {{ scope.row.beginTime | trimSeconds }} 到 {{ scope.row.endTime | trimSeconds }}
                        </el-form-item>
                        <el-form-item label="状态：">
                            {{ scope.row.status | statusToText }}
                        </el-form-item>
                        <br/>
                        <el-form-item v-if="scope.row.orderReasonValue" label="事由(用途)：">
                            {{ scope.row.orderReasonValue }}
                        </el-form-item>
                        <el-form-item v-if="scope.row.serviceObjectValue" label="服务对象：">
                            {{ scope.row.serviceObjectValue }}
                        </el-form-item>
                        <br/>
                        <el-form-item label="使用内容(预约理由)：" class="whole-line">
                            {{ scope.row.orderResion }}
                            <image-previewer tag="richtext">
                               <img :src="item.fileUrl||item.photoUrl" style="width:60px;height: 60px;margin-right: 10px;" alt="" :key="index" v-for="(item, index) in JSON.parse(scope.row.fileJson||'[]') ">
                         </image-previewer>   
                        </el-form-item>
                        <el-form-item v-if="scope.row.examineName !== null && scope.row.examineName !== ''" label="审批人："
                                      class="whole-line">
                            {{ scope.row.examineName }}
                        </el-form-item>
                        <el-form-item label="支持人："
                                      v-if="scope.row.sendAppointerJson && scope.row.sendAppointerJson !== '[]'">
                            {{ getAppointerNames(scope.row.sendAppointerJson) }}
                        </el-form-item>
                        <br/>
                        <el-form-item v-if="scope.row.examineOptions !== null && scope.row.examineOptions !==''"
                                      label="审批意见：" class="whole-line">
                            {{ scope.row.examineOptions }}
                        </el-form-item>
                        <el-form-item label="设施、设备使用情况：" class="whole-line"
                                      v-if="scope.row.haveFeedback == 2">
                            {{ scope.row.feedbackMarks }}
                        </el-form-item>
                    </el-form>
                </template>
            </el-table-column>
            <el-table-column
                label="资源名称"
                show-overflow-tooltip
                min-width="200px"
            >
                <template slot-scope="scope">
                    {{ scope.row.resourceName }}
                </template>
            </el-table-column>
            <el-table-column
                label="申请人"
                prop="orderName"
            >
            </el-table-column>
            <el-table-column
                label="	预约时间"
                width="300px"
            >
                <template slot-scope="scope">
                    {{ scope.row.beginTime | trimSeconds }} 到 {{ scope.row.endTime | trimSeconds }}
                </template>
            </el-table-column>
            <el-table-column
                label="	状态"
            >
                <template slot-scope="scope">
                    {{ scope.row.status | statusToText }}
                </template>
            </el-table-column>
            <el-table-column
                label="使用内容(预约理由)"
                show-overflow-tooltip
                min-width="200px"
                prop="orderResion"
            >
            </el-table-column>
            <el-table-column
                label="操作"
                align="center"
                width="200px"
                v-if="isShowByPermission('/resource/resourceExamine')"
            >
                <template slot-scope="scope">
                    <el-button size="small" v-if="orderStatus === 0" type="text"
                               @click="examineHandler(scope.row.id, scope.$index)"
                    >审核
                    </el-button>
                    <el-button size="small" type="text" @click="deleteHandler(scope.row.id)">删除
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="pagination-container">
            <el-pagination
                @size-change="sizeChangeHandler"
                @current-change="currentChangeHandler"
                :current-page.sync="pageNo"
                :page-sizes="[10 , 20, 30, 50]"
                :page-size="pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :page-count="pages"
                :total="total"
            >
            </el-pagination>
        </div>
        <el-dialog title="审核" @close="dialogCloseHandler" :visible.sync="dialogVisibility" size="tiny" append-to-body :modal-append-to-body='false'>
            <div>
                <el-form
                    :model="formData"
                    ref="form"
                    :rules="rules"
                    label-width="80px"
                >
                    <el-form-item prop="options" label="审批意见">
                        <el-input
                            type="textarea"
                            :rows="3"
                            placeholder="请输入审批意见"
                            @blur="trimHandler"
                            v-model="formData.options"
                        >
                        </el-input>
                    </el-form-item>
                    <el-form-item prop="appointer" label="支持人" v-if="data.isAppoint == 1 && data.isApplyAppoint == 1">
                        <address-book ref="addressBook" v-model="addressData" :config="addressConfig"></address-book>
                    </el-form-item>
                    <el-form-item prop="appointer" label="支持人" v-if="data.isAppoint == 1 && data.isApplyAppoint == 0 && data.appointer.length !== 0">
                        <el-checkbox-group v-model="formData.appointer">
                            <el-checkbox
                                v-for="(appointerEntry, index) in data.appointer"
                                :key="index"
                                :label="appointerEntry.id"
                            >
                                {{ appointerEntry.name }}
                            </el-checkbox>
                        </el-checkbox-group>
                    </el-form-item>
                </el-form>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="rejectHandler" :loading="loadingArr[0]">不通过</el-button>
                <el-button type="primary" @click="approveHandler" :loading="loadingArr[0]">通过</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import AddressBook from '@/components/AddressBook/indexExpand';
    import {isShowByPermission} from '@/utils';
    import windowResizeMixin from '@/mixins/windowResize';
    import ImagePreviewer from "@/components/ImagePreviewer/ImagePreviewer.vue";
    import {
        newresourceExamineList,
        deleteResourceOrder,
        noPassExamineOrder,
        passExamineResource,
        resourceOrderDetailInfo, getResourceTypeListForStatics,toOrderResource,
        getResourceListForStatics,
    } from '@/api/resourceOrder';
    export default {
        components: {AddressBook,ImagePreviewer},
        data: function () {
            const optionsValidator = (rule, value, callback) => {
                if (!this.isApprove) {
                    if (this.formData.options.trim() === '') {
                        callback(new Error('请填写审批意见'));
                    } else {
                        callback();
                    }
                } else {
                    callback();
                }
            };
            const appointerValidator = (rule, value, callback) => {
                if(this.data.isAppoint == 1 && this.data.isApplyAppoint == 0 && this.formData.appointer.length === 0) {
                    callback(new Error('请选择支持人'));
                } else if(this.data.isAppoint == 1 && this.data.isApplyAppoint == 1 && this.addressData.userJson.length === 0) {
                    callback(new Error('请选择支持人'));
                } else {
                    callback();

                }
            };
            return {
                 // 类型列表
                typeList: [],
                  typeId: 0,
                // 状态列表
                duration: [this.$moment().startOf('month'),this.$moment().add(7, 'days').format('YYYY-MM-DD')],
                isApprove: false,
                loadingArr: [false, false],
                dialogVisibility: false,
                isLoading: false,
                dateDay: this.$moment().format('YYYY-MM-DD'),
                orderStatus: 0,
                pageNo: 1,
                pageSize: 20,
                total: 0,
                pages: 0,
                searchTitle: '',
                dataList: [],
                addressConfig:{
                    title: '请选择发布范围',
                    depart: {target: 'user', departType: 't', userTypes: '1'},
                    group: true
                },
                addressData: {departJson: [], groupJson: [], userJson: []},
                formData: {
                    appointer: [],
                    isAppoint: 0,
                    options: '',
                    orderId: null,
                    appointerIdStr: '',
                    appointerJson: '',
                    isApplyAppoint: 0
                },
                data: {
                    resourceName: '',
                    beginTime: '',
                    endTime: '',
                    orderResion: '',
                    status: null,
                    examineOptions: '',
                    appointer: []
                },
                rules: {
                    options: [{
                        validator: optionsValidator,
                        trigger: '  '
                    }],
                    appointer: [{
                        validator: appointerValidator,
                        trigger: '  '
                    }]
                }
            }
        },
        mixins: [windowResizeMixin],
        methods: {
            isShowByPermission,
            trimHandler() {
                this.formData.options = this.formData.options.trim();
            },
            dialogCloseHandler() {
                this.formData = Object.assign({}, this.formData, {
                    appointer: [],
                    isAppoint: 0,
                    options: '',
                    orderId: null,
                    appointerIdStr: '',
                    appointerJson: ''
                });
            },
            examineCb(res) {
                const data = res.data;
                this.dialogVisibility = false;
                this.loadingArr = [false, false];
                if (data.result) {
                    const pageData = data.data;
                    const messageObj = {};
                    switch (pageData) {
                        case 'true':
                            messageObj.type = 'success';
                            messageObj.msg = '审批成功';
                            break;
                        case '':
                        case '-1' | -1:
                            messageObj.type = 'error';
                            messageObj.msg = '已被管理员取消';
                            break;
                        case '-2' | -2:
                            messageObj.type = 'error';
                            messageObj.msg = '审批权限被删除';
                            break;
                        case '3' | 3:
                        case '4' | 4:
                            messageObj.type = 'error';
                            messageObj.msg = '已被其他人审核';
                            break;
                        case '6' | 6:
                            messageObj.type = 'error';
                            messageObj.msg = '审核时间已过 预约失效';
                            break;
                    }
                    this.$message({
                        message: messageObj.msg,
                        type: messageObj.type
                    });
                    this.newresourceExamineListHandler();
                }
            },
            approveHandler() {
                this.isApprove = true;
                this.$refs.form.validate((valid) => {
                    if (valid) {
                        this.loadingArr[0] = true;
                        const queryObj = {};
                        queryObj.isAppoint = this.data.isAppoint == 1 ? 1 : 0;
                        let appointerIdStr = '';
                        let appointerJson = '[]';
                        if(queryObj.isAppoint == 1) {
                            appointerIdStr = this.data.isApplyAppoint == 1 ? this.addressData.userJson.map(({id}) => id).join(',') : this.formData.appointer.join(',');
                            appointerJson = this.data.isApplyAppoint == 1 ? JSON.stringify(this.addressData.userJson) : JSON.stringify(this.data.appointer
                                .filter(appointerEntry => {
                                    return this.formData.appointer.indexOf(appointerEntry.id) > -1
                                })
                            );
                        }
                        queryObj.appointerIdStr = appointerIdStr;
                        queryObj.appointerJson = appointerJson;
                        queryObj.options = this.formData.options;
                        queryObj.orderId = this.formData.orderId;
                        passExamineResource(queryObj)
                            .then(this.examineCb)
                            .catch(error => {
                            });
                    }
                });
            },
            rejectHandler() {
                this.isApprove = false;
                this.$refs.form.validate((valid) => {
                    if (valid) {
                        this.loadingArr[1] = true;
                        noPassExamineOrder({
                            options: this.formData.options,
                            orderId: this.formData.orderId
                        })
                            .then(this.examineCb)
                            .catch(error => {
                                
                            })
                    }
                });
            },
            examineHandler(orderId) {
                this.formData.orderId = orderId;
                resourceOrderDetailInfo({orderId})
                    .then(res => res.data)
                    .then(data => {
                        if (data.result) {
                            const dataPage = data.data;
                            this.data = Object.assign({}, this.data, dataPage);
                            if (dataPage.appointerJson !== null && dataPage.appointerJson !== '') {
                                this.data.appointer = JSON.parse(dataPage.appointerJson);
                            } else {
                                this.data.appointer = [];
                            }
                            if(dataPage.isApplyAppoint == 1 && dataPage.isAppoint == 1) {
                                this.addressData = {departJson: [], groupJson: [], userJson: JSON.parse(dataPage.sendAppointerJson)};
                            }
                            this.dialogVisibility = true;
                        } else {
                            this.$message.error(data.msg);
                        }
                    })
                    .catch(error => {
                        this.$message.error(error);
                    })
            },
            getAppointerNames(sendAppointerJson) {
                if (sendAppointerJson !== null) {
                    return JSON.parse(sendAppointerJson).map(dataEntry => dataEntry.name).join('，')
                } else {
                    return '';
                }
            },
            deleteHandler(ids) {
                this.$confirm('删除后资源预约将失效！是否确认要删除该预约？', '删除', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    deleteResourceOrder({
                        ids: String(ids)
                    })
                        .then(res => res.data)
                        .then(data => {
                            if (data.result) {
                                this.$message({
                                    message: '删除成功',
                                    type: 'success'
                                });
                                this.newresourceExamineListHandler();
                            } else {
                                this.$message.error(data.msg);
                            }
                        })
                        .catch(error => {
                            this.$message.error(error);
                        });
                }).catch(error => {
                });
            },
            jumpToPage(path, query) {
                if (query === undefined || query === null) {
                    query = {}
                }
                this.$router.push({
                    path,
                    query
                })
            },
            newresourceExamineListHandler() {
                newresourceExamineList({
                    startDate: moment(this.duration[0]).format('YYYY-MM-DD'),
                    endDate: moment(this.duration[1]).format('YYYY-MM-DD'),
                    orderStatus: this.orderStatus,
                    typeId: this.typeId,
                    pageNo: this.pageNo,
                    pageSize: this.pageSize,
                    searchTitle: this.searchTitle
                })
                    .then(res => res.data)
                    .then(data => {
                        if (data.result) {
                            let pageData = data.data;
                            if (pageData.dataList === null) {
                                pageData = {
                                    dataList: [],
                                    pagination: {
                                        endRow: 0,
                                        firstPage: 0,
                                        hasNextPage: false,
                                        hasPreviousPage: false,
                                        lastPage: 0,
                                        pageNo: 1,
                                        pageSize: 0,
                                        pages: 0,
                                        startRow: 0,
                                        total: 0
                                    }
                                }
                            }
                            this.isLoading = false;
                            this.dataList = pageData.dataList;
                            this.total = pageData.pagination.total;
                            this.pages = pageData.pagination.pages;
                        } else {
                            this.$message.error(data.msg);
                        }
                    })
                    .catch(error => {
                        // this.$message.error(error);
                    })
            },
            dateChangeHandler(dateDay) {
                this.dateDay = dateDay !== undefined ? dateDay : '';
                this.newresourceExamineListHandler();
            },
            searchTitleHandler() {
                this.searchTitle = this.searchTitle.trim();
                this.isLoading = true;
                this.newresourceExamineListHandler();
            },
            radioChangeHandler(orderStatus) {
                this.orderStatus = orderStatus;
                this.pageSize = 10;
                this.pageNo = 1;
                this.searchTitle = '';
                this.newresourceExamineListHandler();
            },
            sizeChangeHandler(pageSize) {
                this.pageSize = pageSize;
                this.pageNo = 1;
                this.newresourceExamineListHandler();
            },
            currentChangeHandler(pageNo) {
                this.pageNo = pageNo;
                this.newresourceExamineListHandler();
            },
        },
        created() {
            toOrderResource()
                .then(res => res.data)
                .then(data => {
                    if (data.result) {
                        const pageData = data.data;
                        this.typeList = pageData.typeList;
                    } else {
                        this.$message.error('error')
                    }
                })
                .catch(error => {
                    // this.$message.error(error);
                })
            this.newresourceExamineListHandler();
        },
        filters: {
            trimSeconds(value) {
                return value.slice(0, value.lastIndexOf(':'));
            },
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
                        textStr = '预约中';
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
            }
        }
    }
</script>

<style scoped>
    .page {
        padding:12px;
    }

    .header {
        margin-bottom: 10px;
    }

    .table-expand {
        font-size: 0;
    }

    .table-expand label {
        width: 90px;
        color: #99a9bf;
    }

    .table-expand .el-form-item {
        margin-right: 0;
        margin-bottom: 0;
        width: 100%;
    }

    .whole-line.el-form-item {
        width: 100%;
    }

    .el-tooltip__popper {
        max-width: 500px;
    }
</style>
