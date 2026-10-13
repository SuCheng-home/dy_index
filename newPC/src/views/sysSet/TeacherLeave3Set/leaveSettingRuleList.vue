<template>
    <div class="page">
        <div class="header">
            <back-tool>
                <el-button size="medium" type="primary" @click="addRule">添加规则</el-button>
            </back-tool>
        </div>
        <div>
            <el-table
                :data="dataList"
                border
                style="width: 100%"
                :height="maxH"
            >
                <el-table-column
                    label="请假类型"
                    align="center"
                    prop="leaveTypeName"
                    :resizable="false"
                >
                </el-table-column>
                <el-table-column
                    label="规则"
                    align="center"
                    :resizable="false"
                >
                    <template slot-scope="scope">
                        <div>
                            请假限制：当月{{scope.row.monLimitCount == 0 ? '不限制' :
                            `${scope.row.monLimitCount}次`}}，当学期{{scope.row.schTimeLimitCount == 0 ? '不限制' :
                            `${scope.row.schTimeLimitCount}次`}}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                    label="添加时间"
                    align="center"
                    :resizable="false"
                >
                    <template slot-scope="scope">
                        <div>
                            {{scope.row.createTime | trimTime}}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                    label="操作"
                    align="center"
                    width="200px"
                    :resizable="false"
                >
                    <template slot-scope="scope">
                        <el-button
                            size="small"
                            type="text"
                            @click="deleteFunc(scope.row.leaveType)"
                        class="buttontextred">删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <el-dialog title="新增规则" :visible.sync="isShowSettingDialog" :close-on-press-escape='false'
                   :close-on-click-modal='false' :modal-append-to-body='false' width="500px">
            <el-form ref="form" :model="formData" :rules="rules" label-width="140px">
                <el-form-item label="请假类型" prop="leaveType">
                    <el-select v-model="formData.leaveType" placeholder="请选择">
                        <el-option v-for="item in leaveTypeList" :key="item.leaveTypeId" :label="item.leaveTypeName"
                                   :value="item.leaveTypeId">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="当月请假限制">
                    <el-select v-model="formData.monLimitCount" placeholder="请选择">
                        <el-option :key="0" label="不限制" :value="0">
                        </el-option>
                        <el-option v-for="num in 20" :key="num" :label="`${num}次`" :value="num">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="当学期请假限制" prop="limitCount">
                    <el-select v-model="formData.schTimeLimitCount" placeholder="请选择">
                        <el-option :key="0" label="不限制" :value="0">
                        </el-option>
                        <el-option v-for="num in 20" :key="num" :label="`${num}次`" :value="num">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="isShowSettingDialog = false" size="medium">取消</el-button>
                <el-button type="primary" @click="addRuleConfirm" size="medium">确定</el-button>
            </span>
        </el-dialog>
    </div>

</template>

<script>
    import windowResizeMixin from '@/mixins/windowResize';
    import {
        getTeacherAskleaveInitInfo,
        getTeacherAskleaveTypelimitList,
        addTeacherAskleaveTypelimit,
        delTeacherAskleaveTypelimit
    } from '@/api/systemSet/TeacherLeave3Set';
    import BackTool from '@/components/BackTool';


    export default {
        components: {
            BackTool
        },
        filters: {
            trimTime(datetime) {
                return datetime ? datetime.slice(0, datetime.lastIndexOf('.')) : '--';
            }
        },
        data: function () {
            const leaveTypeValidator = (rule, value, callback) => {
                if (this.formData.leaveType === '') {
                    callback(new Error('请选择请假类型'))
                } else {
                    callback();
                }
            }
            const limitCountValidator = (rule, value, callback) => {
                if (this.formData.schTimeLimitCount === 0 && this.formData.monLimitCount === 0) {
                    callback(new Error('至少设置一种限制'))
                } else if (this.formData.monLimitCount >= this.formData.schTimeLimitCount && this.formData.monLimitCount != 0 && this.formData.schTimeLimitCount != 0) {
                    callback(new Error('当学期限制次数必大于当月'));
                } else {
                    callback();
                }
            }
            return {
                dataList: [],
                searchLoading: false,
                formData: {
                    leaveType: '',
                    monLimitCount: 0,
                    schTimeLimitCount: 0,
                },
                isShowSettingDialog: false,
                leaveTypeList: [],
                rules: {
                    leaveType: [
                        {required: true, validator: leaveTypeValidator},
                    ],
                    limitCount: [{validator: limitCountValidator}],
                }
            }
        },
        mixins: [windowResizeMixin],
        methods: {
            getList() {
                getTeacherAskleaveTypelimitList()
                    .then(res => res.data)
                    .then(data => {
                        if (data.result) {
                            this.dataList = data.data;
                        }
                    })
            },
            deleteFunc(leaveType) {
                this.$confirm("是否确认删除", "删除", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                }).then(() => {
                    delTeacherAskleaveTypelimit({leaveType})
                        .then(res => res.data)
                        .then(data => {
                            if (data.result) {
                                this.$message({type: "success", message: "删除成功!"});
                                this.getList();
                            } else {
                                this.$message.error(data.msg);
                            }
                        });
                });
            },
            addRule() {
                this.formData = {
                    leaveType: this.leaveTypeList && this.leaveTypeList.length !== 0 ? this.leaveTypeList[0].leaveTypeId : '',
                    monLimitCount: 0,
                    schTimeLimitCount: 0,
                };
                this.isShowSettingDialog = true;
            },
            addRuleConfirm() {
                this.$refs.form.validate(isValid => {
                    if (isValid) {
                        const obj = this.leaveTypeList.find(item => item.leaveTypeId == this.formData.leaveType);
                        addTeacherAskleaveTypelimit({
                            monLimitCount: this.formData.monLimitCount,
                            schTimeLimitCount: this.formData.schTimeLimitCount,
                            leaveType: this.formData.leaveType,
                            leaveTypeName: obj.leaveTypeName
                        })
                            .then(res => res.data)
                            .then(data => {
                                if (data.result) {
                                    this.$message.success('添加成功');
                                    this.isShowSettingDialog = false;
                                    this.getList();
                                } else {
                                    this.$message.error(data.msg);
                                }
                            })
                    }
                })
            }
        },
        created() {
            getTeacherAskleaveInitInfo()
                .then(res => res.data)
                .then(data => {
                    console.log(data);
                    const pageData = data.data;
                    this.leaveTypeList = pageData.leaveTypeList;
                });
            this.getList();

        }
    }
</script>

<style scoped>
    .page {
        padding: 12px;
    }

    .search-input {
        margin-left: 10px;
        width: 220px;
    }

    .term-hint {
        width: 10px;
        height: 10px;
        float: right;
        margin-right: 10px;
        line-height: 37px;
        display: block;
        float: right;
        border-radius: 20px;
        margin: 10px;
    }

    .term-hint--current {
        background-color: #F00;
    }
</style>
