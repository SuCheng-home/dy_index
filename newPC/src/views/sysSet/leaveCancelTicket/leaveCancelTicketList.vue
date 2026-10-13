<template>
    <div class="app-container calendar-list-container">
        <back-tool>
            <el-button class="filter-item" type="primary" @click="jumpToPage('leaveCancelTicketAddEdit')" size="medium">添加抵扣条</el-button>
            <el-button class="filter-item" type="primary" @click="setIntro()" size="medium">抵扣规则说明设置</el-button>
            <el-input style="width:20%;float: right;" size="medium" v-model="listQuery.deductionName"
                      placeholder="抵扣条名称"
                      @change="handleInputChange">
                <el-button slot="append" icon="el-icon-search" @click="handleInputChange"></el-button>
            </el-input>
        </back-tool>
        <el-table stripe
                  :data="dataList" border fit highlight-current-row style="width: 100%"
                  :height="maxH">
            <el-table-column align="center" label="抵扣条">
                <template slot-scope="scope">
                    <span>{{scope.row.deductionName}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="抵扣条类型" prop="typeName">
            </el-table-column>
            <el-table-column align="center" label="抵扣请假类型" prop="leaveNames">
            </el-table-column>
            <el-table-column align="center" label="有效期" show-overflow-tooltip>
                <template slot-scope="scope">
                    {{['', '当月', '本学期','不限制'][scope.row.validityTime]}}
                </template>
            </el-table-column>
            <el-table-column align="center" label="创建时间">
                <template slot-scope="scope">
                    {{scope.row.createTime | trimTime}}
                </template>
            </el-table-column>
            <el-table-column align="center" label="操作">
                <template slot-scope="scope">
                    <el-button size="small" type="text" @click="jumpToPage('leaveCancelTicketAddEdit', {id: scope.row.id})">编辑</el-button>
                    <el-button size="small" type="text" @click="deleteFunc(scope.row.id)" class="buttontextred">删除</el-button>
                </template>
            </el-table-column>

        </el-table>

        <el-dialog title="抵扣规则说明设置" :visible.sync="isShowIntroSettingDialog" width="500px">
            <el-form :model="formData" :rules="rules" ref="form">
                <el-form-item prop="remark" label="规则说明" label-width="80px">
                    <el-input type="textarea" v-model="formData.remark" :rows="4"
                              placeholder="请填写内容"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
				<el-button @click="isShowIntroSettingDialog = false" size="medium">取 消</el-button>
				<el-button type="primary" @click="setIntroConfirm" size="medium">确 定</el-button>
			</span>
        </el-dialog>
    </div>
</template>

<script>
    import _ from 'lodash';
    import {
        getSchoolOvertimeDeductionTypeList,
        deleteOvertimeDeductionTypeById,
        getSchoolOvertimeDeductionRuleRemark,
        saveSchoolOvertimeDeductionRuleRemark
    } from '@/api/leaveCancelTicket';
    import mixin from '@/mixins/windowResize';
    import BackTool from '@/components/BackTool';

    export default {
        data() {
            return {
                dataList: [],
                total: 0,
                listQuery: {
                    deductionName: '',
                },
                isShowIntroSettingDialog: false,
                formData: {
                    remark: ''
                },
                rules: {
                    remark: [
                        { required: true, message: "请输入规则说明", trigger: "blur"}
                    ],
                },
            };
        },
        filters: {
            trimTime(datetime) {
                return datetime ? datetime.slice(0, datetime.lastIndexOf('.')) : '--';
            }
        },
        components: {
            BackTool
        },
        created() {
            this.getList();
        },
        mixins: [mixin],
        methods: {
            getList() {
                this.listQuery.deductionName = this.listQuery.deductionName.trim();
                getSchoolOvertimeDeductionTypeList(this.listQuery).then(res => {
                    this.dataList = res.data.data;
                })
            },
            handleInputChange: _.debounce(
                function() {
                    this.getList();
                },
                1000
            ),
            handleSizeChange(val) {
                this.listQuery.pageSize = val;
                this.getList();
            },
            handleCurrentChange(val) {
                this.listQuery.pageNo = val;
                this.getList();
            },
            jumpToPage(path, query) {
                if (query === null || query === undefined) {
                    query = {};
                }
                this.$router.push({
                    path,
                    query
                })
            },
            setIntro() {
                getSchoolOvertimeDeductionRuleRemark()
                    .then(res => res.data)
                    .then(data => {
                        this.formData = {
                            remark: data.data.remark
                        };
                        this.isShowIntroSettingDialog = true;
                    })

            },
            setIntroConfirm() {
                this.$refs.form.validate(isValid => {
                    if(isValid) {
                        saveSchoolOvertimeDeductionRuleRemark({
                            remark: this.formData.remark
                        })
                            .then(res => res.data)
                            .then(data => {
                                if (data.result) {
                                    this.$message.success('设置成功');
                                    this.isShowIntroSettingDialog = false;
                                    this.getList();
                                } else {
                                    this.$message.error(res.data.msg);
                                }
                            })

                    }
                })
            },
            deleteFunc(id) {
                this.$confirm('该抵扣条的定时发放将同步失效，确认删除？', '删除', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    deleteOvertimeDeductionTypeById({
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
            }
        }

    }
</script>

<style scoped="scoped">
    .el-loading-mask {
        display: none;
    }

    .searchButton {
        width: 200px;
        vertical-align: middle;
        margin-bottom: 10px;
        float: right;
    }

    .searchButton:after {
        content: "";
        display: block;
        clear: both;
    }

    .el-icon-circle-cross {
        color: #f08080;
    }

    .el-icon-circle-check {
        color: #90EE90
    }

    .imgsize {
        width: 25px;
        height: 25px;
    }

    .ebody {
        max-height: 600px;
        overflow: auto;
    }

    ::-webkit-scrollbar {
        width: 6px;
        background-color: #F5F5F5;
    }

    ::-webkit-scrollbar-thumb {
        background-color: #999;
    }

    ::-webkit-scrollbar-track {
        background-color: #F5F5F5;
    }
</style>
