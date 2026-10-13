<template>
    <div id="teacherCommentIndex" class="app-container calendar-list-container">
        <backtool>
            <el-button type="primary" size="medium" @click="addEdit()">添加考勤规则</el-button>
        </backtool>
        <el-table stripe :data="dataList" border fit highlight-current-row
                  style="width: 100%" :height="maxH">
            <el-table-column label="规则名称" show-overflow-tooltip prop="ruleName">
            </el-table-column>
            <el-table-column align="center" label="考勤时间">
                <template slot-scope="scope">
                    {{scope.row.beginTime}} - {{scope.row.endTime}}
                </template>
            </el-table-column>
            <el-table-column align="center" label="提醒家长">
                <template slot-scope="scope">
                    {{scope.row.remindParent == 2 ? '是' : '否'}}
                </template>
            </el-table-column>
            <el-table-column align="center" label="提醒班主任">
                <template slot-scope="scope">
                    {{scope.row.remindMaster == 2 ? '是' : '否'}}
                </template>
            </el-table-column>
            <el-table-column align="center" label="操作" width="150px">
                <template slot-scope="scope">
                    <el-button size="small" type="text"
                               @click.native="addEdit(scope.row)">编辑
                    </el-button>
                    <el-button size="small" type="text"
                               @click.native="deleteHandler(scope.row.id)" class="buttontextred">删除
                    </el-button>
                </template>
            </el-table-column>

        </el-table>
        <el-dialog width="600px" :title="`${editId ? '编辑' : '新增'}规则`" :visible.sync="isShowAddEditDialog"
                   custorm-class="dialog"
                   :close-on-press-escape="false"
                   :close-on-click-modal="false"
        >
            <div class="form">
                <el-form ref="form" :model="formData" :rules="formRule" label-width="100px">
                    <el-form-item label="规则名称" prop="ruleName">
                        <el-input @blur="formData.ruleName = formData.ruleName.trim()" :maxlength="10"
                                  v-model="formData.ruleName" placeholder="请输入规则名称(1-10个字符)"></el-input>
                    </el-form-item>
                    <el-form-item label="考勤时间" prop="duration">
                        <el-time-picker is-range v-model="formData.duration" range-separator="-" format="HH:mm"
                                            :editable="false" :clearable="false"
                                        start-placeholder="开始时间" end-placeholder="结束时间" placeholder="选择时间范围">
                        </el-time-picker>
                    </el-form-item>
                    <el-form-item label="提醒家长">
                        <el-switch v-model="formData.remindParent" :active-value="2" :inactive-value="1" on-text="是"
                                   off-text="否"></el-switch>
                    </el-form-item>
                    <el-form-item label="提醒班主任">
                        <el-switch v-model="formData.remindMaster" :active-value="2" :inactive-value="1" on-text="是"
                                   off-text="否"></el-switch>
                    </el-form-item>
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button size="medium" @click="isShowAddEditDialog = false">取 消</el-button>
                <el-button size="medium" type="primary" @click="addEditConfirm">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import moment from 'moment';
    import Backtool from '@/components/BackTool';

    import {
        delStuAttendanceRuleById,
        addStuAttendanceRule,
        editStuAttendanceRule,
        getSchoolStuAttendanceRuleList
    } from '@/api/studentAttendanceLiuhe';
    import mixin from '@/mixins/windowResize';

    export default {
        mixins: [mixin],
        components: {Backtool},
        data() {
            return {
                dataList: [],

                formData: {
                    ruleName: '',
                    duration: [new Date('2020-01-01 07:00:00'), new Date('2020-01-01 12:00:00')],
                    remindParent: 1,
                    remindMaster: 1
                },
                formRule: {
                    ruleName: [
                        {required: true, message: '请填写规则名称', trigger: 'blur'}
                    ],
                    duration: [
                        {required: true, message: '请选择考勤时间', trigger: 'blur'}
                    ]
                },

                editId: null,
                isShowAddEditDialog: false
            }
        },
        created() {
            this.getSchoolStuAttendanceRuleListFunc();
        },
        methods: {
            addEdit(item = {}) {
                this.editId = item.id;
                this.isShowAddEditDialog = true;

                if (item.id) {
                    this.formData = {
                        ruleName: item.ruleName,
                        remindParent: item.remindParent,
                        remindMaster: item.remindMaster,
                        duration: [new Date(`2020-01-01 ${item.beginTime}:00`), new Date(`2020-01-01 ${item.endTime}:00`)]
                    }
                } else {
                    this.formData = {
                        ruleName: '',
                        duration: [new Date('2020-01-01 07:00:00'), new Date('2020-01-01 12:00:00')],
                        remindParent: 1,
                        remindMaster: 1
                    };
                }
            },
            getSchoolStuAttendanceRuleListFunc() {
                getSchoolStuAttendanceRuleList({
                })
                    .then(res => res.data)
                    .then(data => {
                        this.dataList = data.data;
                    })
            },
            addEditConfirm() {
                this.$refs.form.validate(isValid => {
                    if (isValid) {
                        new Promise(resolve => {
                            const [beginTime, endTime] = this.formData.duration;
                            const args = {
                                beginTime: moment(beginTime).format('HH:mm'),
                                endTime: moment(endTime).format('HH:mm'),
                                remindMaster: this.formData.remindMaster,
                                remindParent: this.formData.remindParent,
                                ruleName: this.formData.ruleName
                            };
                            if (this.editId) {
                                args.id = this.editId;
                                editStuAttendanceRule(args)
                                    .then(res => res.data)
                                    .then(resolve)
                            } else {
                                addStuAttendanceRule(args)
                                    .then(res => res.data)
                                    .then(resolve)
                            }
                        })
                            .then((data) => {
                                if(data.result) {
                                    this.$message.success(`${this.editId ? '编辑' : '新增'}成功`);
                                    this.isShowAddEditDialog = false;
                                    this.getSchoolStuAttendanceRuleListFunc();
                                } else {
                                    this.$message.error(data.msg);
                                }

                            })
                            .catch(error => {
                                this.$message.error(error);
                            });
                    }
                });
            },
            deleteHandler(id) {
                this.$confirm(`是否要删除该规则`, '删除', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    return delStuAttendanceRuleById({
                        id
                    })
                        .then(res => res.data)
                        .then(data => {
                            if (data.result) {
                                this.$message.success('删除成功');
                                this.getSchoolStuAttendanceRuleListFunc();
                            } else {
                                this.$message.error(data.msg);
                            }
                        })
                });

            }
        }
    }
</script>

<style lang="scss">
    .pagination-container {
        margin-top: 10px;
    }

    .el-icon-paperclip {
        margin-right: 3px;
    }
</style>
