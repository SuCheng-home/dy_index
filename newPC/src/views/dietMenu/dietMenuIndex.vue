<template>
    <div class="app-container">
        <div>
            <el-row style="padding-bottom:20px">
                <el-col :span="18">
                    <el-button class="filter-item" type="primary" icon="plus" @click="handleAddGroupMembers">
                        添加食谱
                    </el-button>
                    <el-button class="filter-item" type="primary">学校彩菜品库</el-button>
                    <el-button class="filter-item" type="primary" icon="upload" @click="handleExcelShow">导出食谱
                    </el-button>
                    <el-button class="filter-item" type="primary" icon="delete"
                               @click="handleDeleteGroupMembers">删除
                    </el-button>
                </el-col>
                <el-col :span="4">
                    <el-input placeholder="搜索" icon="el-icon-search" v-model="listQuery.query_name" @change="handleInputChange"
                              :on-icon-click="handleInputChange">
                    </el-input>
                </el-col>
            </el-row>
            <el-table stripe :default-sort="{prop: 'pageviews', order: 'descending'}" :data="list" v-loading.body="listLoading"
                      border fit highlight-current-row max-height="620" @selection-change="handleSelectionChange"
                      ref="mainTable">
                <el-table-column type="selection" width="55"></el-table-column>
                <el-table-column prop="avatar" align="center" label="头像" width="70">
                    <template slot-scope="scope">
                        <img :src="scope.row.avatar" alt="" style="height:30px">
                    </template>
                </el-table-column>
                <el-table-column show-overflow-tooltip label="姓名">
                    <template slot-scope="scope">
                        <span>{{scope.row.name}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="gender" align="center" label="性别">
                    <template slot-scope="scope">
                        <span>{{scope.row.gender|sexFilter}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="mobile" align="center" label="手机号">
                    <template slot-scope="scope">
                        <span>{{scope.row.mobile}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="schoolId" align="center" label="单位">
                    <template slot-scope="scope">
                        <span>{{scope.row.schoolId|placeFilter}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="status" align="center" label="关注状态">
                    <template slot-scope="scope">
                        <span :class="scope.row.status===4 || scope.row.status=== 2?'redColor':''">{{scope.row.status|statusFilter}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="left" label="操作" width="150">
                    <template slot-scope="scope">
                        <el-button icon="delete" size="small" type="danger" @click="handleDelete(scope.row)">
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div v-show="!listLoading" class="pagination-container">
                <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                               :current-page.sync="listQuery.pageNo" :page-sizes="[10, 20, 30, 50]"
                               :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper"
                               :total="total">
                </el-pagination>
            </div>
        </div>
        <el-dialog title="添加常用组" :visible.sync="AddGroupDialogVisible" size="large">
            <el-form :model="form">
                <el-form-item label="常用组名称" :label-width="formLabelWidth">
                    <el-input v-model="form.groupName" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="管理人" :label-width="formLabelWidth">
                    <el-input v-model="form.managerSelected" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="使用人" :label-width="formLabelWidth">
                    <el-input v-model="form.employeeSelected" auto-complete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="AddGroupDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="handleAddGroupSure">确 定</el-button>
            </div>
        </el-dialog>
        <el-dialog title="Excel导入成员" :visible.sync="ExcelDialogVisible" :close-on-press-escape="false"
                   :close-on-click-modal="false" size="large">
            <el-card class="box-card">
                <div slot="header" class="clearfix">
                    <span style="">说明:</span>

                </div>
                <div><span class="bold">1.导入顺序</span>：请先下载模板，编辑好模板保存为.csv文件，点击选择文件上传编辑好的.csv文件，点击批量导入即可。</div>
                <div><span class="bold">2.导入规则</span>：只有已经是系统中的用户才可以导入成功，匹配规则为优先匹配身份证号，其次匹配手机号，身份证号与手机号都不能匹配的用户将不能导入
                </div>
                <div><span class="bold">3.导入结果</span>：导入成功后会返回导入结果，用户可先下载导入失败的用户列表</div>
            </el-card>
            <el-button class="downLoadTemplate" type="primary" @click="handledDownload">下载模板</el-button>
            <transition name="fade">
                <el-upload v-show="uploadShow" ref="upload" class="upload-demo" drag
                           action="http://182.254.149.97:8088/wxcepClient1/group/importGroupMember" accept=".csv"
                           :on-success="handleUploadSuccess"
                           :before-upload="handleBeforeUpload"
                           :data="{'groupId':selectItem.id,'groupName':selectItem.name,'token':token}">
                    <i class="el-icon-upload"></i>
                    <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                    <div class="el-upload__tip" slot="tip">只能上传后缀为csv的excel文件</div>
                </el-upload>
            </transition>
            <div v-if="downloadMessage">{{downloadMessage}}
                <el-button v-if="isShowDownloadFailBtn" type="primary" @click="handleDownloadFail">下载失败名单</el-button>
            </div>
            <div slot="footer" class="dialog-footer">
            </div>
        </el-dialog>
    </div>
</template>
<script>
    import _ from 'lodash';
    import {
        getAllGroupList,
        getGroupMembersList,
        addGroup,
        addGroupMembers,
        deleteGroupMembers,
        deleteGroups,
        importGroupMember
    } from '@/api/group';
    import Cookies from 'js-cookie';

    const sexTypeMap = {
        1: '男',
        2: '女',
        0: '未知'
    };
    const statusTypeMap = {
        1: "已关注",
        4: "未关注",
        2: "已禁用"
    };
    let Time = null;
    export default {
        name: "group",
        data: function () {
            return {
                items: [],
                selectItem: {},
                selectIndex: 0,
                list: null,
                total: null,
                listLoading: true,
                listQuery: {
                    pageNo: 1,
                    pageSize: 20,
                    query_name: '',
                    filterVal: '其他',
                    group_id: ''
                },
                AddGroupDialogVisible: false,
                ExcelDialogVisible: false,
                form: {
                    groupName: '',
                    managerSelected: '',
                    employeeSelected: ''
                },
                formLabelWidth: '120px',
                multipleSelection: [],
                downloadMessage: '',
                isShowDownloadFailBtn: false,
                token: Cookies.get('Admin-Token'),
                download: null,
                uploadShow: true,
                options: [{
                    value: '其他',
                    label: '全部状态'
                }, {
                    value: 'yes',
                    label: '已关注'
                }, {
                    value: 'no',
                    label: '未关注'
                }, {
                    value: 'enable',
                    label: '已禁用'
                }]
            }
        },
        created() {
            this.getAllGroupList();
        },
        filters: {
            sexFilter(type) {
                return sexTypeMap[type]
            },
            placeFilter(type) {
                if (type === 0) {
                    return ""
                } else {
                    return type
                }
            },
            statusFilter(type) {
                return statusTypeMap[type]
            }
        },
        methods: {
            handleSelectChange() {
                this.getGroupMembersList()
            },
            handleDownloadFail() {
                require.ensure([], () => {
                    const {
                        export_json_to_excel
                    } = require('@/vendor/Export2Excel');
                    const tHeader = ['姓名', '手机', '失败原因'];
                    const filterVal = ['name', 'mobile', 'reason'];
                    const list = JSON.parse(this.download.errorUserStr);
                    const data = this.formatJson(filterVal, list);
                    export_json_to_excel(tHeader, data, '常用组用户导入失败列表');
                })
            },
            handleExcelShow() {
                this.ExcelDialogVisible = true;
                this.$refs.upload.clearFiles();
                this.downloadMessage = "";
                this.isShowDownloadFailBtn = false;
                this.download.errorUserStr = "";
                this.uploadShow = true;
            },
            handleBeforeUpload(file) {
                const FileExt = file.name.replace(/.+\./, "");
                if (FileExt !== "csv") {
                    this.$message({
                        type: 'warning',
                        message: '请上传csv后缀的Excel文件!'
                    });
                    return false;
                }
            },
            handleUploadSuccess(response) {
                // 上传失败
                if (response.code !== 200) {
                    this.$message({
                        type: 'warning',
                        message: '上传失败，请重试'
                    });
                    this.$refs.upload.clearFiles();
                } else {
                    this.uploadShow = false;
                    this.downloadMessage = "上传成功" + response.data.success + "条数据，上传失败" + response.data.fail + "条数据";
                    this.download = response.data;

                    if (response.data.fail > 0) {
                        this.isShowDownloadFailBtn = true
                    }
                    this.$message({
                        message: "上传成功" + response.data.success + "条数据，上传失败" + response.data.fail + "条数据",
                        type: 'info'
                    });
                }
                this.getGroupMembersList();

            },
            handledDownload() {
                require.ensure([], () => {
                    const {
                        export_json_to_excel
                    } = require('@/vendor/Export2Excel');
                    const tHeader = ['姓名(必填)', '手机(必填)'];
                    const data = ["", ""];
                    export_json_to_excel(tHeader, data, '常用组导入模板');
                })
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            handleAddGroupMembers() {
                const group_id = this.selectItem.id;
                addGroupMembers({
                    group_id: group_id,
                    userids: 'unknow'
                }).then(() => {
                    this.list.push({
                        age: 0,
                        avatar: "http://dummyimage.com/30x30",
                        gender: 2,
                        id: 10003348,
                        isDelete: 0,
                        landType: 0,
                        mobile: "12345678911",
                        name: "张三三",
                        schoolId: 0,
                        status: 1,
                        workAge: 0
                    });
                    this.total++;
                }).catch(function (error) {
                })
            },
            handleDeleteGroupMembers() {
                if (!this.multipleSelection.length) {
                    this.$message({
                        message: '请选择要删除的组成员',
                        type: 'warning'
                    });
                } else {
                    this.$confirm('确定要删除吗？', '提示', {
                        type: 'error'
                    }).then(() => {
                        const group_id = this.selectItem.id;
                        let userid = "";
                        this.multipleSelection.forEach(function (value) {
                            userid += value.id + ',';
                        });

                        deleteGroupMembers({
                            group_id: group_id,
                            userids: userid.substring(0, userid.length - 1)
                        }).then(res => {
                            if (res.data.code === 1001) {
                                this.$message({
                                    type: 'error',
                                    message: '不合法的参数!'
                                });
                            } else {
                                this.getGroupMembersList();
                                this.$message({
                                    type: 'success',
                                    message: '删除成功!'
                                });
                            }

                        }).catch(function (error) {
                        });

                    }).catch(() => {
                    });
                }
            },
            handleDelete(row) {
                this.$confirm('确定要删除吗？', '提示', {
                    type: 'error'
                }).then(() => {
                    const group_id = this.selectItem.id;
                    deleteGroupMembers({
                        group_id: group_id,
                        userids: row.id
                    }).then(res => {
                        if (res.data.code === 1001) {
                            this.$message({
                                type: 'error',
                                message: '不合法的参数!'
                            });
                        } else {
                            this.getGroupMembersList();
                            this.$message({
                                type: 'success',
                                message: '删除成功!'
                            });
                        }
                    }).catch(function () {
                    });

                }).catch(() => {
                });
            },
            handleDeleteGroup() {
                if (this.list.length) {
                    this.$message({
                        message: '常用组还有成员，不能删除！',
                        type: 'warning'
                    });
                } else {
                    this.$confirm('确定要删除吗？', '提示', {
                        type: 'error'
                    }).then(() => {
                        const group_id = this.selectItem.id;
                        deleteGroups({
                            group_id: group_id,
                        }).then(res => {
                            if (res.data.code === 1001) {
                                this.$message({
                                    type: 'error',
                                    message: '不合法的参数!'
                                });
                            } else {
                                this.getAllGroupList();
                                this.$message({
                                    type: 'success',
                                    message: '删除成功!'
                                });
                            }
                        }).catch(function (error) {
                        });

                    }).catch(() => {
                    });
                }
            },

            handleAddGroupSure() {
                this.AddGroupDialogVisible = false;
                /*employeeSelected 使用人id
                 * managerSelected 管理人id
                 * groupName 群组名称
                 */
                addGroup(this.form).then(res => {
                    if (res.data.code === 200) {
                        this.getAllGroupList();
                    }
                }).catch(function (error) {
                })
            },
            handleAddGroup() {
                this.form = {};
                this.AddGroupDialogVisible = true
            },
            handleEditGroup() {
                this.form.groupName = this.selectItem.name;
                this.AddGroupDialogVisible = true
            },
            handleInputChange: _.debounce(
                function () {
                    this.getGroupMembersList()
                },
                // 这是我们为用户停止输入等待的毫秒数
                500
            ),
            itemChange(index) {
                this.selectIndex = index;
                this.selectItem = this.items[this.selectIndex];
                this.listQuery.group_id = this.selectItem.id;
                this.getGroupMembersList()
            },
            getGroupMembersList() {
                this.listLoading = true;
                getGroupMembersList(this.listQuery).then(res => {
                    this.list = res.data.data.users;
                    this.total = res.data.data.pagination.total;
                    this.listLoading = false;

                }).catch(function (error) {
                });
            },
            getAllGroupList() {
                getAllGroupList().then(res => {
                    this.items = res.data.data;
                    this.selectIndex = 0;
                    this.selectItem = this.items[this.selectIndex];
                    this.listQuery.group_id = this.selectItem.id;
                    this.getGroupMembersList();
                }).catch(function (error) {
                })
            },
            handleSizeChange(val) {
                this.listQuery.pageSize = val;
                this.getGroupMembersList();
            },
            handleCurrentChange(val) {
                this.listQuery.pageNo = val;
                this.getGroupMembersList();
            },
            formatJson(filterVal, jsonData) {
                return jsonData.map(v => filterVal.map(j => v[j]))
            }
        }
    }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
    @import "../../../src/styles/mixin.scss";

    .left_bar {
        margin-bottom: 10px;
        padding: 5px 5px 5px 5px
    }

    .active {
        color: #20a0ff;
        background: #E5E9F2
    }

    .redColor {
        color: red
    }

    .el-icon-delete2,
    .el-icon-edit {
        font-size: 12px;
        float: right;
        line-height: 21px;
        padding-right: 5px;
    }

    .bold {
        font-weight: bold;
    }

    .downLoadTemplate {
        margin: 5px 0 5px 0;
    }

    .itemWrapper {
        height: 630px;
        margin-top: 20px;
        overflow-y: auto;
        @include scrollBar;
    }

    .fade-enter-active,
    .fade-leave-active {
        transition: opacity .3s;
    }

    .fade-enter,
    .fade-leave-active {
        opacity: 0;
    }
</style>
