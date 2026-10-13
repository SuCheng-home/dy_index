<template>
    <div class="honourGradeList padding">
        <el-tabs v-model="activeName" type="border-card" @tab-click="handleClick">
            <el-tab-pane label="证书级别" name="first">
                <div>
                    <div class="header">
                        <el-row>
                            <el-col :span="19">
                                <el-button type="primary" size="medium" @click="jumpPage('addHonourGrade')">新建</el-button>
                                <el-button type="danger" size="medium" @click="handleMultDelete">删除</el-button>
                                <el-button type="primary" size="medium" @click="remindSetHandler">提醒设置</el-button>
                            </el-col>
                            <el-col :span="5">
                                <el-input class="search-input"
                                          placeholder="请输入级别名称" icon="search" size="medium"
                                          v-model.trim="honorTypeName" @change="handleInputChange">
                                    <el-button slot="append" icon="el-icon-search" @click="handleInputChange"></el-button>
                                </el-input>
                            </el-col>
                        </el-row>
                    </div>
                    <div>
                        <el-table
                            ref="multipleTable"
                            :data="honourTable"
                            border
                            stripe
                            class="honourTable"
                            :height="maxH-50"
                            style="width: 100%"
                            @selection-change="handleSelectionChange">
                            <el-table-column
                                type="selection"
                                width="55" align="center">
                            </el-table-column>
                            <el-table-column
                                label="级别" align="center" show-overflow-tooltip>
                                <template slot-scope="scope">{{ scope.row.honorTypeName }}</template>
                            </el-table-column>
                            <el-table-column
                                prop="name"
                                label="权重" align="center">
                                <template slot-scope="scope">{{scope.row.typeBeliel}}</template>
                            </el-table-column>
                            <el-table-column
                                prop="address"
                                align="center"
                                label="操作" width="220">
                                <template slot-scope="scope">
                                    <el-button size="small" type="text"
                                               @click="jumpPage('organList',{honorTypeId:scope.row.id})">机构列表
                                    </el-button>
                                    <el-button size="small" type="text"
                                               @click="jumpPage('editHonourGrade',{honorTypeId:scope.row.id})">编辑
                                    </el-button>
                                    <el-button size="small" type="text" class="buttontextred"
                                               @click="delHander(scope.row.id)">删除
                                    </el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                        <div v-show="!listLoading" class="pagination-container">
                            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                                           :current-page.sync="pageNo" :page-sizes="[10,20,30, 50]"
                                           :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper"
                                           :total="total">
                            </el-pagination>
                        </div>
                    </div>
                </div>
            </el-tab-pane>
            <!-- <el-tab-pane label="证书类型" name="second"></el-tab-pane> -->
            <el-tab-pane label="获奖等级" name="third"></el-tab-pane>
            <el-tab-pane label="证书名称" name="fourth"></el-tab-pane>
        </el-tabs>


        <el-dialog
            title="提醒设置"
            :visible.sync="remindDialog"
            width="40%">
            <el-form :model="remindMode" ref="editOrgan" label-width="100px" class="addOrganFrom">
                <el-form-item label=" " prop="issueOrgan">
                    <el-checkbox v-model="remindMode.isRemind">需要消息提醒</el-checkbox>
                </el-form-item>
                <el-form-item label=" " prop="issueOrgan">
                    <el-checkbox v-model="remindMode.isRemindTh">是否抄送任课老师</el-checkbox>
                </el-form-item>
                <el-form-item label=" ">
                    <el-checkbox v-model="remindMode.addType">仅可选择证书名称中的证书</el-checkbox>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
        <el-button @click="remindDialog = false">取 消</el-button>
        <el-button type="primary" @click="remindSetSave">确 定</el-button>
      </span>
        </el-dialog>
    </div>
</template>
<script>
    import {isShowByRole} from '@/utils';

    import mixins from '@/mixins/windowResize';
    import _ from 'lodash';
    import {
        schoolHonorTypeList,
        delSchoolHonorType,
        schoolHonorRemindSet,
        honorRemindSetPage
    } from '@/api/honour/honourGradeSet';

    const IsRemind = {OK: 1, NO: 0}//0:不需要 1:需要
    const IsRemindTh = {OK: 1, NO: 2}//	1:抄送 2:不抄送
    export default {
        data() {
            return {
                activeName: 'first',
                pageNo: 1,
                pageSize: 10,
                honorTypeName: '',
                honourTable: [],
                total: null,
                listLoading: false,
                multipleSelection: [],
                remindDialog: false,
                remindMode: {
                    id: null,
                    isRemind: null,
                    isRemindTh: null,
                    addType: null
                }
            }
        },
        created() {

            // document.title="荣誉级别列表";
            this.schoolHonorTypeListFunc();
            this.honorRemindSetPageFunc();//提醒设置信息
            if(!isShowByRole(33) && !isShowByRole(2)) {
                this.$router.replace('honourNameList');
            }
        },
        mixins: [mixins],
        methods: {
            handleClick(val) {
                if (val.name === 'second') {
                    this.$router.replace({path: 'honourTypeList'});
                } else if (val.name === 'third') {
                    this.$router.replace({path: 'honourLevelList'});
                } else if(val.name === 'fourth') {
                    this.$router.replace({path: 'honourNameList'});
                }
            },
            honorRemindSetPageFunc() {
                honorRemindSetPage().then(res => res.data)
                    .then(data => {
                        if (data.code === 200) {
                            let dataList = data.data;
                            this.remindMode.id = dataList.id;
                            this.remindMode.isRemind = dataList.isRemind == 1;
                            this.remindMode.isRemindTh = dataList.isRemindTh == 1;
                            this.remindMode.addType = dataList.addType == 2;
                        }
                    })
            },
            remindSetSave() {
                schoolHonorRemindSet({
                    id: this.remindMode.id ? this.remindMode.id : 0,
                    isRemind: this.remindMode.isRemind ? IsRemind.OK : IsRemind.NO,
                    isRemindTh: this.remindMode.isRemindTh ? IsRemindTh.OK : IsRemindTh.NO,
                    addType: this.remindMode.addType ? 2 : 1
                }).then(res => res.data)
                    .then(data => {
                        if (data.code === 200) {
                            this.$message({
                                type: 'success',
                                message: '设置成功!'
                            });
                            this.remindDialog = false;
                            this.honorRemindSetPageFunc();
                        }
                    })
            },
            remindSetHandler() {
                this.remindDialog = true;
            },
            handleMultDelete() {
                if (!this.multipleSelection.length) {
                    this.$message({
                        message: '请选择要删除的级别!',
                        type: 'warning'
                    });
                } else {
                    this.$confirm('您确认删除当前级别?', '提示', {
                        type: 'error'
                    }).then(() => {
                        let arr = this.multipleSelection.map(obj => {
                            return obj.id
                        });
                        delSchoolHonorType({
                            honorTypeIds: arr.toString()
                        }).then(res => {
                            let data = res.data;
                            if (data.code === 200) {
                                this.$message({
                                    type: 'success',
                                    message: '删除成功!'
                                });
                                this.schoolHonorTypeListFunc();
                            }
                        })
                    }).catch(() => {

                    });
                }
            },
            delHander(id) {
                this.$confirm('如果有该级别关联的证书名称，将导致相应证书无法添加，您是否确认删除当前级别?', '提示', {
                    type: 'error'
                }).then(() => {
                    delSchoolHonorType({
                        honorTypeIds: id
                    }).then(res => {
                        let data = res.data;
                        if (data.code === 200) {
                            this.$message({
                                type: 'success',
                                message: '删除成功!'
                            });
                            this.schoolHonorTypeListFunc();
                        }
                    })
                }).catch(() => {

                });
            },
            jumpPage(path, query = {}) {
                this.$router.push({
                    path,
                    query
                })
            },
            handleInputChange: _.debounce(function (val) {
                this.schoolHonorTypeListFunc();
            }, 500),
            handleCurrentChange(val) {
                this.pageNo = val;
                this.schoolHonorTypeListFunc();
            },
            handleSizeChange(val) {
                this.pageSize = val;
                this.pageNo = 1;
                this.schoolHonorTypeListFunc();
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            schoolHonorTypeListFunc() {
                this.listLoading = true;
                schoolHonorTypeList({
                    pageNo: this.pageNo,
                    pageSize: this.pageSize,
                    honorTypeName: this.honorTypeName
                }).then(res => res.data)
                    .then(data => {
                        if (data.code === 200) {
                            let honourData = data.data;
                            this.honourTable = honourData.dataList;
                            if (this.honourTable.length == 0 && this.pageNo > 1) {
                                this.pageNo--;
                                this.schoolHonorTypeListFunc();
                            }
                            this.total = honourData.pagination.total;
                            this.listLoading = false
                        }
                    }).catch(() => {
                    this.listLoading = false;
                })
            }
        }
    }
</script>
<style lang="scss" scoped>

    .padding {
        padding:12px;
        box-sizing: border-box;
    }

    .honourGradeList {
        .header {
            padding-bottom: 10px;
        }
    }

    .addOrganFrom {
        width: 80%;

        .el-form-item {
            margin-bottom: 10px;
        }
    }
</style>
<style lang="scss">
    @import "../../styles/mixin";
</style>

