<template>
    <div class="app-container calendar-list-container">
        <back-tool>
            <el-button class="filter-item" type="primary" @click="addEditRule()" size="medium">添加定时规则</el-button>
        </back-tool>
        <div>
            <div class="main-container">
                <div class="rule-card-list">
                    <el-card class="rule-card-item" v-for="(ruleItem, index) in dataList">
                        <i class="fa fa-edit" @click="addEditRule(index)"></i>
                        <i class="fa fa-trash" @click="deleteRule(ruleItem.id)"></i>
                        <div class="card-item__line">
                            <span>{{ruleItem.ruleType == 1 ? '每月' : '每周'}}&nbsp;{{ruleItem.ruleDay}}<span v-if="ruleItem.ruleType == 1">日</span></span>
                        </div>
                        <div class="card-item__line">发放范围：{{ruleItem.departsText}}<span v-if="ruleItem.departsText && ruleItem.teachersText">,</span>{{ruleItem.teachersText}}</div>
                        <div>
                            <el-table stripe :data="ruleItem.ruleSendDedutionList" border style="width: 100%;" :height="200">
                                <el-table-column label="抵扣条">
                                    <template slot-scope="scope">
                                        <span>{{scope.row.deductionName}}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column label="数量">
                                    <template slot-scope="scope">
                                        <span>{{scope.row.sendNum}}张</span>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </div>
                    </el-card>
                </div>
            </div>
        </div>
        <el-dialog title="发请假抵扣条" :visible.sync="isShowDistCancelTicketDialog" width="500px">
            <el-form :model="distForm" :rules="distFormRules" ref="distForm">
                <el-form-item prop="day" label-width="0px">
                    <el-select v-model="distForm.ruleType" style="width: 100px" size="medium" placeholder="请选择学期">
                        <el-option label="每月" :value="1"></el-option>
                        <el-option label="每周" :value="2"></el-option>
                    </el-select>
                    <template v-if="distForm.ruleType == 1">
                        <el-select v-model="distForm.selectedDate" style="width: 140px" size="medium"
                                   placeholder="请选择日期">
                            <el-option :label="`${i}日`" :value="i" v-for="i in 25"></el-option>
                        </el-select>
                    </template>
                    <template v-else>
                        <el-select v-model="distForm.selectedDay" style="width: 100px" size="medium"
                                   placeholder="请选择日期">
                            <el-option label="星期一" :value="1"></el-option>
                            <el-option label="星期二" :value="2"></el-option>
                            <el-option label="星期三" :value="3"></el-option>
                            <el-option label="星期四" :value="4"></el-option>
                            <el-option label="星期五" :value="5"></el-option>
                            <el-option label="星期六" :value="6"></el-option>
                            <el-option label="星期日" :value="7"></el-option>
                        </el-select>
                    </template>
                </el-form-item>
                <el-form-item prop="distAddressData" label="发放范围" label-width="80px">
                    <address-book v-model="distAddressData" :config="configData"></address-book>
                </el-form-item>
                <el-form-item prop="ticketTypeList">
                    <el-table stripe :data="ticketTypeList" border style="width: 100%;" :height="400">
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
				<el-button type="primary" @click="addEditRuleConfirm" size="medium">确 定</el-button>
			</span>
        </el-dialog>
    </div>
</template>

<script>
    import mixin from '@/mixins/windowResize';
    import BackTool from '@/components/BackTool';
    import AddressBook from '@/components/AddressBook/indexExpand';
    import {
        getSchoolOvertimeDeductionTypeList,
        addDeductionOntimeRule,
        editDeductionOntimeRule,
        deleteDeductionOntimeRule,
        getSchoolDeductionOntimeRuleList
    } from '@/api/leaveCancelTicket';

    export default {
        name: "leaveCancelTicketPeriodDist",
        data() {
            const distAddressDataValidator = (rule, value, callback) => {
                if (this.distAddressData.userJson.length === 0 && this.distAddressData.departJson.length === 0) {
                    callback(new Error('请选择发送范围'));
                } else {
                    callback();
                }
            };
            const ticketTypeListValidator = (rule, value, callback) => {
                if (this.ticketTypeList.every(item => item.distCount == 0)) {
                    callback(new Error('至少发送一张抵扣券'));
                } else {
                    callback();
                }
            };
            return {
                isShowDistCancelTicketDialog: false,
                configData: {
                    title: '发送范围', depart: {notCheckSchool: true, target: 'user', departType: 't', userTypes: '1'}
                },
                distAddressData: {
                    userJson: [],
                    departJson: [],
                    groupJson: []
                },
                ticketTypeList: [],
                allTicketTypeList: [],
                distForm: {
                    ruleType: 1,
                    selectedDate: 1,
                    selectedDay: 1
                },
                distFormRules: {
                    distAddressData: [
                        {required: true, validator: distAddressDataValidator}
                    ],
                    ticketTypeList: [{validator: ticketTypeListValidator}]
                },
                editIndex: null,
                editId: null,
                dataList: []
            }
        },
        mixins: [mixin],
        components: {
            BackTool,
            AddressBook
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
                    this.allTicketTypeList = pageData;
                });
            this.getList();
        },
        methods: {
            getList() {
                getSchoolDeductionOntimeRuleList()
                    .then(res => res.data)
                    .then(data => {
                        data.data.forEach(item => {
                            item.departsText = item.departsJson ? JSON.parse(item.departsJson).map(depart => depart.name).join(',') : '';
                            item.teachersText = item.teachersJson ? JSON.parse(item.teachersJson).map(depart => depart.name).join(',') : '';
                        })
                        this.dataList = data.data;
                    })
            },
            deleteRule(id) {
                this.$confirm('是否确认删除该规则？', '删除', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    deleteDeductionOntimeRule({
                        id
                    }).then(res => {
                        if (res.data.result) {
                            this.$message.success('删除成功');
                            this.getList();
                        } else {
                            this.$message.error(res.data.msg);
                        }
                    });
                });
            },
            addEditRule(index = null) {
                if(index !== null) {
                    this.editIndex = index;
                    const obj = JSON.parse(JSON.stringify(this.dataList[index]));
                    this.distAddressData = {
                        userJson: obj.teachersJson ? JSON.parse(obj.teachersJson) : [],
                        departJson: obj.departsJson ? JSON.parse(obj.departsJson) : [],
                        groupJson: []
                    };
                    obj.ruleSendDedutionList.forEach(item => {
                        item.distCount = item.sendNum;
                    });
                    this.ticketTypeList = obj.ruleSendDedutionList;
                    console.log('obj', obj)
                    const distForm = {
                        ruleType: obj.ruleType,
                        selectedDate: obj.ruleType == 1 ? obj.ruleDay : 1,
                        selectedDay: obj.ruleType == 2 ? obj.ruleDay : 1,
                    };
                    this.editId = obj.id;
                    this.distForm = distForm;
                } else {
                    this.editId = null;
                    this.distAddressData = {
                        userJson: [],
                            departJson: [],
                            groupJson: []
                    };
                    this.distForm = {
                        ruleType: 1,
                        selectedDate:  1,
                        selectedDay: 1,
                    };
                    this.ticketTypeList = JSON.parse(JSON.stringify(this.allTicketTypeList));
                }
                this.isShowDistCancelTicketDialog = true;
            },
            addEditRuleConfirm() {
                this.$refs.distForm.validate(isValid => {
                    if (isValid) {
                        const ruleSendDedutionList = [];
                        let leaveCount = 0;
                        this.ticketTypeList.forEach(item => {
                            ruleSendDedutionList.push({
                                deductionId: item.deductionId || item.id,
                                deductionName: item.deductionName,
                                sendNum: item.distCount
                            });
                            leaveCount += item.distCount;
                        });
                        const args = {
                            ruleSendDedutionList,
                            departsJson: this.distAddressData.departJson,
                            state: 2,
                            teachersJson: this.distAddressData.userJson,
                            ruleType: this.distForm.ruleType,
                            ruleDay: this.distForm.ruleType == 1 ? this.distForm.selectedDate : this.distForm.selectedDay
                        };
                        console.log('args', args)
                        new Promise(resolve => {
                            if(this.editIndex !== null) {
                                args.id = this.editId;
                                editDeductionOntimeRule(args)
                                    .then(res => res.data)
                                    .then(resolve)
                            } else {
                                addDeductionOntimeRule(args)
                                    .then(res => res.data)
                                    .then(resolve)
                            }
                        })
                            .then(data => {
                                if(data.result) {
                                    this.$message.success(`${this.editIndex !== null ? '编辑' : '新增'}成功`);
                                    this.getList();
                                    this.isShowDistCancelTicketDialog = false;
                                } else {
                                    this.$message.error(res.data.msg);
                                }
                            })

                    }
                })
            }
        }
    }
</script>

<style scoped>
    .main-container {
        padding-top: 12px;
    }
    .rule-card-item {
        width: 31%;
        float: left;
        padding: 10px;
        box-sizing: border-box;
        position: relative;
        margin-right: 8px;
    }
    .card-item__line {
        margin-bottom: 10px;
    }
    .fa {
        cursor: pointer;
    }
    .fa-edit {
        position: absolute;
        right: 60px;
        top: 30px;
    }
    .fa-trash {
        position: absolute;
        right: 30px;
        top: 30px;
    }
    .fa-edit {
        color: #409EFF;
    }

    .fa-trash {
        color: #F08080;
    }
</style>
