<!--用户已发送通知列表-->
<template>
    <div id="noticeIndex" class="app-container calendar-list-container">
        <div class="filter-container">
            <el-row>
                <el-col :span="19">
                    <el-button type="primary" @click="addEditFunc()" size="medium">新增</el-button>
                </el-col>
                <el-col :span="5">
                    <!--                    <el-input size="medium"-->
                    <!--                              placeholder="标题/发布人/发布时间" icon="el-icon-search" @keyup.enter.native="handleFilter"-->
                    <!--                              v-model="searchTitle">-->
                    <!--                        <el-button slot="append" icon="el-icon-search" @click="handleFilter"></el-button>-->
                    <!--                    </el-input>-->
                </el-col>
            </el-row>
        </div>
        <el-table stripe :data="list" border fit highlight-current-row
                  style="width: 100%" :height="nobottommaxH - 25">
            <el-table-column label="分组名称" show-overflow-tooltip>
                <template slot-scope="scope">
                    {{scope.row.groupName}}
                </template>
            </el-table-column>
            <el-table-column align="center" label="排序">
                <template slot-scope="scope">
                    <span>{{scope.row.groupNo }}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="操作">
                <template slot-scope="scope">
                    <el-button size="small" type="text"
                               @click="addEditFunc(scope.row)">编辑
                    </el-button>
                    <el-button size="small" type="text"
                               @click.native="deleteFunc(scope.row.id)" class="buttontextred">删除
                    </el-button>
                </template>
            </el-table-column>

        </el-table>
        <el-dialog title="分组" :visible.sync="isShowAddEditDialog" custom-class="dialog">
            <el-form :model="formData" ref="form" label-width="80px" :rules="formDataRules">
                <el-form-item label="分组名称" prop="groupName">
                    <el-input v-model.trim="formData.groupName" :maxlength="15" placeholder="分组名称（1-15个字符）"></el-input>
                </el-form-item>
                <el-form-item label="分组排序" prop="groupNo">
                    <el-input-number v-model.trim="formData.groupNo" :min="1" :max="1000"></el-input-number>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="isShowAddEditDialog = false">取 消</el-button>
                <el-button type="primary" @click="addEditConfirm">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import {
        editEnrollGroup,
        getSchoolEnrollGroupList,
        addEnrollGroup,
        delEnrollGroupById
    } from '@/api/schoolSignupHigh';
    import mixin from '@/mixins/windowResize';
    import baseMixin from '@/mixins/baseMixin';
    import debounce from 'lodash/debounce';
    import {isShowByPermission} from '@/utils';

    export default {
        name: 'signupGroupList',
        data() {
            return {
                list: [],
                cutH: 225,
                searchTitle: '',
                isShowAddEditDialog: false,
                formData: {
                    groupName: '',
                    groupNo: 1
                },
                formDataRules: {
                    groupName: [
                        {required: true, message: '请输入分组名称', trigger: 'blur'}
                    ],
                    groupNo: [
                        {required: true, message: '请输入分组排序', trigger: 'blur'}
                    ]
                },
                editItem: null
            }
        },
        created() {
            this.getList();
        },
        mixins: [mixin, baseMixin],
        filters: {

            trimTime(datetime) {
                return datetime ? datetime.slice(0, datetime.lastIndexOf('.')) : '--';
            }
        },
        methods: {
            isShowByPermission,
            getList() {
                getSchoolEnrollGroupList()
                    .then(res => res.data)
                    .then(data => {
                        this.list = data.data;
                    }).catch(err => {
                });
            },
            handleFilter: debounce(function () {
                this.pagination.pageNo = 1;
                this.getList();
            }, 500),
            addEditFunc(item = null) {
                this.editItem = item;
                if (item) {
                    this.formData = {
                        groupName: item.groupName,
                        groupNo: item.groupNo
                    };
                } else {
                    this.formData = {
                        groupName: '',
                        groupNo: 1
                    };
                }
                this.isShowAddEditDialog = true
            },
            addEditConfirm() {
                this.$refs.form.validate(isValid => {
                    if(isValid) {
                        const args = JSON.parse(JSON.stringify(this.formData));
                        new Promise(resolve => {
                            if(this.editItem) {
                                args.id = this.editItem.id;
                                editEnrollGroup(args)
                                    .then(res => res.data)
                                    .then(resolve)
                            } else {
                                addEnrollGroup(args)
                                    .then(res => res.data)
                                    .then(resolve)
                            }
                        })
                            .then(data => {
                                if(data.result) {
                                    this.$message.success(`${this.editItem ? '编辑' : '新增'}成功`);
                                }
                                this.isShowAddEditDialog = false;
                                this.getList();
                            })
                    }
                })


            },
            deleteFunc(groupId) {
                this.$confirm('是否确认删除?', '删除', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    delEnrollGroupById({groupId})
                        .then(res => {
                            this.getList();
                            this.$message({
                                type: 'success',
                                message: '删除成功!'
                            });
                        }).catch();

                }).catch(() => {
                });

            },
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
