<template>
    <div class="overtime_apply_list">
        <div class="header">
            <div class="header_line2">
                <template>
                    <el-select v-model="schoolName" size="medium" placeholder="请选择学期" @change="changeSchool">
                        <el-option v-for="item in schoolYearList" :key="item.schoolTimeCode" :label="item.label"
                                   :value="item.schoolTimeName">
                        </el-option>
                    </el-select>
                </template>
                <template>
                    <el-select v-model="useType" size="medium" placeholder="请选类型" @change="getStatistics">
                        <el-option  label="全部类型" :value="-1"></el-option>
                        <el-option  label="加班条" :value="0"></el-option>
                        <el-option  label="抵扣条" :value="1"></el-option>
                    </el-select>
                </template>
                <el-button type="primary" @click="jumpToPage('applyAdd')" size="medium">发加班条</el-button>
                <el-button type="primary" @click="distCancelTicket" size="medium">发抵扣条</el-button>
                <el-button type="primary" @click="jumpToPage('leaveCancelTicketPeriodDist')" size="medium">定时发</el-button>
                <import-file :config="importConf" @success="handleSizeChange"></import-file>
            </div>
        </div>
        <div class="offset_table_wrap">
            <el-table stripe :data="dataList" border style="width: 100%;" :height="maxH">
                <el-table-column prop="teacherNames" label="发送范围" show-overflow-tooltip></el-table-column>
                <el-table-column label="发放数量">
                    <template slot-scope="scope">
                        <span v-if="scope.row.deductionsJson" class="link-type" @click="showDetail(scope.row)">{{scope.row.leaveCount}}张</span>
                        <span v-else>{{scope.row.leaveCount}}张</span>
                    </template>
                </el-table-column>
                <el-table-column label="发放时间">
                    <template slot-scope="scope">
                        <span>{{scope.row.createTime | trimTime}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="发放人">
                    <template slot-scope="scope">
                        <span>{{scope.row.createUserName}}</span>
                    </template>
                </el-table-column>
                 <el-table-column label="类型">
                    <template slot-scope="scope">
                        <el-tag  size="mini" v-if="scope.row.useType==0" >加班条</el-tag>
                        <el-tag  size="mini" v-if="scope.row.useType==1" type="success">抵扣条</el-tag>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination-container" style="margin-top: 15px;">
                <el-pagination @size-change="sizeChangeHandler" @current-change="currentChangeHandler"
                               :current-page.sync="pagination.pageNo" :page-sizes="[10, 20, 30, 50]"
                               :page-size.sync="pagination.pageSize"
                               layout="total, sizes, prev, pager, next, jumper"
                               :total="pagination.total">
                </el-pagination>
            </div>
        </div>
        <el-dialog title="发请假抵扣条" :visible.sync="isShowDistCancelTicketDialog" width="500px">
            <el-form :model="distForm" :rules="distFormRules" ref="distForm">
                <el-form-item prop="distAddressData" label="发放范围" label-width="80px">
                    <address-book v-model="distAddressData" :config="configData"></address-book>
                </el-form-item>
                <el-form-item prop="ticketTypeList">
                    <el-table stripe :data="ticketTypeList" border style="width: 100%;" :height="300">
                        <el-table-column label="抵扣条">
                            <template slot-scope="scope">
                                <span>{{scope.row.deductionName}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="数量">
                            <template slot-scope="scope">
                                <el-input-number style="width: 160px;" size="medium" v-model="scope.row.distCount"
                                                 :min='0' :max='999'></el-input-number>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
				<el-button @click="isShowDistCancelTicketDialog = false" size="medium">取 消</el-button>
				<el-button type="primary" @click="distCancelTicketConfirm" size="medium">确 定</el-button>
			</span>
        </el-dialog>
        <el-dialog title="发放数量" :visible.sync="isShowDetail" width="500px">
            <el-form ref="distForm">
                <el-form-item label="发放范围" label-width="80px">
                    {{detailData.teacherNames}}
                </el-form-item>
                <el-form-item prop="ticketTypeList">
                    <el-table stripe :data="detailData.deductions" border style="width: 100%;" :height="300">
                        <el-table-column label="抵扣条">
                            <template slot-scope="scope">
                                <span>{{scope.row.deductionName}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="数量">
                            <template slot-scope="scope">
                                <span>{{scope.row.sendNum}}</span>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
				<el-button @click="isShowDetail = false" size="medium">关 闭</el-button>
			</span>
        </el-dialog>
    </div>
</template>

<script>
    import mixins from '@/mixins/windowResize';
    import {getSchoolTimeList} from '@/api/record';
    import {findOverTimeDeductionGrantByPage} from '@/api/overtimeDeduction';
    import {
        getSchoolOvertimeDeductionTypeList,
        sendDeductionToTeachers
    } from '@/api/leaveCancelTicket';
    import AddressBook from '@/components/AddressBook/indexExpand';
    import ImportFile from '@/components/ImportFile'
    export default {
        name: "overtimeDeductionApplyList",
        data() {
            const distAddressDataValidator = (rule, value, callback) => {
                if(this.distAddressData.userJson.length === 0 && this.distAddressData.departJson.length === 0) {
                    callback(new Error('请选择发送范围'));
                } else {
                    callback();
                }
            };
            const ticketTypeListValidator = (rule, value, callback) => {
                if(this.ticketTypeList.every(item => item.distCount == 0)) {
                    callback(new Error('至少发送一张抵扣券'));
                } else {
                    callback();
                }
            };

            return {
                isShowDeleteDialog: false,
                deleteReason: '',
                deleteId: 0,
                pagination: {
                    pageNo: 1,
                    pageSize: 20,
                    total: null
                },
                schoolName: '',
                schoolTimeCode: '',
                schoolYearList: [],
                dataList: [],
                isShowDistCancelTicketDialog: false,
                ticketTypeList: [],
                configData: {title: '发送范围', depart: {notCheckSchool: true, target: 'user', departType: 't', userTypes: '1'}},
                distAddressData: {
                    userJson: [],
                    departJson: [],
                    groupJson: []
                },
                distForm: {},
                distFormRules: {
                    distAddressData: [
                        {required: true, validator: distAddressDataValidator}
                    ],
                    ticketTypeList: [{validator: ticketTypeListValidator}]
                },
                detailData: {
                    deductions: []
                },
                isShowDetail: false,
                useType:-1,
                 importConf: {
                    btnName: '导入抵扣条',
                    title: '批量导入抵扣条',
                    templateUrl: 'https://cdnfile-10043692.cos.ap-shanghai.myqcloud.com/admin/csv/dikoutiao.xls',
                    templateArgs: {},
                    uploadUrl: 'structure/overTimeDeduction/importDeductionToTeachers',
                    uploadArgs: {},
                    errUrl: 'structure/overTimeDeduction/downloadDeductionToTeachersResultXls',
                    lingjie:1,
                    name:'file'
                },
            }
        },
        components: {
            AddressBook,ImportFile
        },
        filters: {
            trimTime(datetime) {
                return datetime ? datetime.slice(0, datetime.lastIndexOf('.')) : '--';
            }
        },
        mixins: [mixins],
        watch: {
            schoolTimeCode() {
                this.getStatistics();
            }
        },
        created() {
            getSchoolOvertimeDeductionTypeList({
                deductionName: ''
            })
                .then(res => res.data)
                .then(data => {
                    const pageData = data.data;
                    pageData.forEach(item => {
                        item.distCount = 0;
                    });
                    this.ticketTypeList = pageData;
                });
            this.getSchoolTimeList();
        },
        methods: {
            showDetail(obj) {
                obj.deductions = JSON.parse(obj.deductionsJson);
                this.detailData = obj;
                this.isShowDetail = true;
            },
            distCancelTicket() {
                const ticketTypeList = JSON.parse(JSON.stringify(this.ticketTypeList));
                ticketTypeList.forEach(item => {
                    item.distCount = 0;
                });
                this.ticketTypeList = ticketTypeList;
                this.distAddressData = {
                    userJson: [],
                        departJson: [],
                        groupJson: []
                };
                this.isShowDistCancelTicketDialog = true;
            },
            distCancelTicketConfirm() {
                this.$refs.distForm.validate(isValid => {
                    if(isValid) {
                        const deductionsJson = [];
                        let leaveCount = 0;
                        this.ticketTypeList.forEach(item => {
                            if(item.distCount != 0) {
                                deductionsJson.push({
                                    deductionId: item.id,
                                    deductionName: item.deductionName,
                                    sendNum: item.distCount
                                });
                                leaveCount += item.distCount;
                            }
                        });
                        const args = {
                            deductionsJson: JSON.stringify(deductionsJson),
                            departsJson: JSON.stringify(this.distAddressData.departJson),
                            remark: '',
                            state: 2,
                            teacherJson: JSON.stringify(this.distAddressData.userJson),
                            leaveCount
                        };
                        sendDeductionToTeachers(args)
                            .then(res => res.data)
                            .then(data => {
                                if (data.result) {
                                    this.$message.success('发放成功');
                                    this.isShowDistCancelTicketDialog = false;
                                    this.getStatistics();
                                } else {
                                    this.$message.error(res.data.msg);
                                }
                            })
                    }
                })
            },
            jumpToPage(path, query = {}) {
                this.$router.push({
                    path,
                    query
                })
            },
            getSchoolTimeList() {
                getSchoolTimeList().then(res => {
                    this.schoolYearList = res.data.data;
                    const self = this;
                    this.schoolYearList.forEach(function (item) {
                        if (item.isCurrent === 1) {
                            self.schoolName = item.schoolTimeName;
                            self.schoolTimeCode = item.id;
                        }
                    });
                }).catch();
            },
            changeSchool(val) {
                const self = this;
                this.schoolName = val;
                this.schoolYearList.forEach(function (item) {
                    if (item.schoolTimeName === val) {
                        self.schoolTimeCode = item.id;
                    }
                });
            },
            getStatistics() {
                if (!this.schoolTimeCode) {
                    return;
                }
                let query = {
                    pageNo: this.pagination.pageNo,
                    pageSize: this.pagination.pageSize,
                    schoolTimeId: this.schoolTimeCode,
                    useType:this.useType
                };

                this.findOverTimeDeductionGrantByPage(query);
            },
            findOverTimeDeductionGrantByPage(query) {
                findOverTimeDeductionGrantByPage(query).then(res => {
                    let data = res.data.data;
                    if (res.data.code === 200) {
                        this.dataList = data.dataList;
                        this.pagination.total = data.pagination.total;
                    }
                }).catch(() => {
                });
            },
            sizeChangeHandler() {
                this.pagination.pageNo = 1;
                this.getStatistics();
            },
            handleSizeChange() {
                this.pagination.pageNo = 1;
                this.getStatistics();
            },
            currentChangeHandler() {
                this.getStatistics();
            }
        }
    }
</script>

<style lang="scss" scoped>
    .overtime_apply_list {
        padding: 12px;

        .header {
            overflow: hidden;
            margin-bottom: 10px;

            .statistics_title {
                display: flex;
                margin-bottom: 10px;

                .btn_group {
                    flex: 1;
                    text-align: center;

                    .btn {
                        height: 40px;
                        line-height: 40px;
                        border: 1px solid #ccc;
                        border-left-width: 0;
                        color: #333;
                        cursor: pointer;
                    }

                    .btn_selected {
                        color: #fff;
                        background: #409EFF;
                        border: 1px solid #409EFF;
                    }
                }

                .btn_group:first-child {
                    .btn {
                        border-radius: 4px 0 0 4px;
                        border-left-width: 1px;
                    }
                }

                .btn_group:last-child {
                    .btn {
                        border-radius: 0 4px 4px 0;
                    }
                }
            }
        }
    }
</style>
