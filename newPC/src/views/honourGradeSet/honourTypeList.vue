<template>
    <div class="honourGradeList padding">
        <el-tabs v-model="activeName" type="border-card" @tab-click="handleClick">
            <el-tab-pane label="证书级别" name="first"></el-tab-pane>
            <el-tab-pane label="证书类型" name="second">
                <div>
                    <div class="header">
                        <el-row>
                            <el-col :span="24">
                                <el-button type="primary" size="medium" @click="addOrganHandler">创建</el-button>
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
                            :height="maxH - 50"
                            style="width: 100%">
                            <el-table-column
                                label="证书类型" align="center" show-overflow-tooltip>
                                <template slot-scope="scope">{{ scope.row.typeName1 || '--' }}</template>
                            </el-table-column>
                            <el-table-column
                                label="别名" align="center" show-overflow-tooltip>
                                <template slot-scope="scope">{{ scope.row.typeName }}</template>
                            </el-table-column>
                            <el-table-column
                                prop="address"
                                align="center"
                                label="操作" width="220">
                                <template slot-scope="scope">
                                    <el-button size="small" type="text"
                                               @click="editOrganHandler(scope.row.id)">编辑
                                    </el-button>
                                    <el-button size="small" type="text"
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
            <el-tab-pane label="获奖等级" name="third"></el-tab-pane>
            <el-tab-pane label="证书名称" name="fourth"></el-tab-pane>
        </el-tabs>

        <el-dialog
            title="新增类型名称"
            :visible.sync="addOrganListDialog"
            width="40%">
            <el-form :model="addOrgan" :rules="addOrganRules" ref="addOrgan" label-width="100px" class="addOrganFrom">
                <el-form-item label="证书类型" prop="typeCode1">
                    <el-select v-model="addOrgan.typeCode1" size="medium">
                        <el-option :key="index" v-for="(item, index) in typeList" :label="item.value" :value="item.code"
                                   placeholder="请选择"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="别名" prop="typeName">
                    <el-input v-model.trim="addOrgan.typeName" maxlength="20" placeholder="类型名称（1-20个字符）"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
        <el-button @click="addOrganListDialog = false">取 消</el-button>
        <el-button type="primary" @click="addOrganSave">确 定</el-button>
      </span>
        </el-dialog>
        <el-dialog title="编辑类型名称" :visible.sync="editOrganListDialog" width="40%">
            <el-form :model="editOrgan" :rules="editOrganRules" ref="editOrgan" label-width="100px"
                     class="addOrganFrom">
                <el-form-item label="证书类型" prop="typeCode1">
                    <el-select v-model="editOrgan.typeCode1" size="medium">
                        <el-option :key="index" v-for="(item, index) in typeList" :label="item.value" :value="item.code"
                                   placeholder="请选择"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="类型名称" prop="typeName">
                    <el-input v-model.trim="editOrgan.typeName" maxlength="20" placeholder="类型名称（1-20个字符）"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
        <el-button @click="editOrganListDialog = false">取 消</el-button>
        <el-button type="primary" @click="editOrganSave">确 定</el-button>
      </span>
        </el-dialog>
    </div>
</template>
<script>
    import {findDicsByCode} from '@/api/common/common';
    import mixins from '@/mixins/windowResize';
    import {
        schoolHonorTypeCertList,
        addSchoolHonorTypeCert,
        getSchoolHonorTypeId,
        updateSchoolHonorTypeCert,
        delSchoolHonorTypeCert
    } from '@/api/honour/honourTypeSet';

    export default {
        data() {
            return {
                activeName: 'second',
                typeList: [],
                pageNo: 1,
                pageSize: 10,
                honourTable: [],
                total: null,
                listLoading: false,
                addOrganListDialog: false,
                addOrgan: {
                    typeName: '',
                    typeCode1: '',
                    typeName1: ''
                },
                addOrganRules: {
                    typeCode1: [
                        {
                            required: true,
                            message: '请选择类型!'
                        }
                    ],
                    typeName: [
                        {
                            required: true,
                            message: '请输入类型名称！',
                            trigger: 'blur'
                        }
                    ]
                },
                editOrgan: {
                    id: 0,
                    typeName: '',
                    typeCode1: '',
                    typeName1: ''
                },
                editOrganRules: {
                    typeCode1: [
                        {
                            required: true,
                            message: '请选择类型!'
                        }
                    ],
                    typeName: [
                        {
                            required: true,
                            message: '请输入类型名称！',
                            trigger: 'blur'
                        }
                    ]
                },
                editOrganListDialog: false,
                editOrganId: ''
            }
        },
        created() {
            this.getDicLevelList();
            this.schoolHonorTypeCertListFunc();
        },
        mixins: [mixins],
        methods: {
            handleClick(val) {
                if (val.name === 'first') {
                    this.$router.replace({path: 'honourGradeList'});
                } else if (val.name === 'third') {
                    this.$router.replace({path: 'honourLevelList'});
                } else if(val.name === 'fourth') {
                    this.$router.replace({path: 'honourNameList'});
                }
            },
            getDicLevelList() {
                findDicsByCode({dicCode: 'schoolhonortype'}).then(res => res.data).then(data => {
                    if (data.code === 200 && data.result && data.data) {
                        this.typeList = data.data;
                    }
                }).catch(error => {
                });
            },
            editOrganHandler(id) {
                getSchoolHonorTypeId({
                    typeId: id,
                }).then(res => res.data)
                    .then(data => {
                        if (data.code === 200) {
                            this.editOrgan.typeName = data.data.typeName;
                            this.editOrgan.typeCode1 = data.data.typeCode1 || '';
                            this.editOrgan.typeName1 = data.data.typeName1;
                            this.editOrgan.id = data.data.id;
                            this.editOrganListDialog = true;
                        }
                    })
            },
            editOrganSave() {
                this.$refs.editOrgan.validate((valid) => {
                    if (valid) {
                        this.editOrgan.typeName1 = this.typeList[this.typeList.map(item => item.code).indexOf(this.editOrgan.typeCode1)].value || '';
                        updateSchoolHonorTypeCert(this.editOrgan).then(res => res.data).then(data => {
                            if (data.code === 200) {
                                this.$message({
                                    type: 'success',
                                    message: '编辑成功!'
                                });
                                this.editOrganListDialog = false;
                                this.schoolHonorTypeCertListFunc();
                            } else {
                                this.$message({
                                    type: 'error',
                                    message: data.msg
                                });
                            }
                        })
                    } else {
                        return false;
                    }
                });
            },
            addOrganSave() {
                this.$refs.addOrgan.validate((valid) => {
                    if (valid) {
                        this.addOrgan.typeName1 = this.typeList[this.typeList.map(item => item.code).indexOf(this.addOrgan.typeCode1)].value || '';

                        addSchoolHonorTypeCert(this.addOrgan).then(res => res.data).then(data => {
                            if (data.code === 200) {
                                this.$message({
                                    type: 'success',
                                    message: '新建成功!'
                                });
                                this.addOrgan.typeName = '';
                                this.addOrganListDialog = false;
                                this.schoolHonorTypeCertListFunc();
                            } else {
                                this.$message({
                                    type: 'error',
                                    message: data.msg
                                });
                            }
                        })
                    }
                })
            },
            addOrganHandler() {
                this.addOrganListDialog = true;
                this.addOrgan.typeCode1 = this.typeList[0].code || '';
            },
            delHander(id) {
                this.$confirm('如果有该类型关联的证书名称，将导致相应证书无法添加，您是否确认删除当前类型?', '提示', {
                    type: 'error'
                }).then(() => {
                    delSchoolHonorTypeCert({
                        typeIds: id
                    }).then(res => {
                        let data = res.data;
                        if (data.code === 200) {
                            this.$message({
                                type: 'success',
                                message: '删除成功!'
                            });
                            this.schoolHonorTypeCertListFunc();
                        }
                    })
                }).catch(() => {
                });
            },
            handleCurrentChange(val) {
                this.pageNo = val;
                this.schoolHonorTypeCertListFunc();
            },
            handleSizeChange(val) {
                this.pageSize = val;
                this.pageNo = 1;
                this.schoolHonorTypeCertListFunc();
            },
            schoolHonorTypeCertListFunc() {
                this.listLoading = true;
                schoolHonorTypeCertList({
                    pageNo: this.pageNo,
                    pageSize: this.pageSize
                }).then(res => res.data)
                    .then(data => {
                        if (data.code === 200) {
                            let honourData = data.data;
                            this.honourTable = honourData.schoolHonorTypeCertList;
                            if (this.honourTable.length == 0 && this.pageNo > 1) {
                                this.pageNo--;
                                this.schoolHonorTypeCertListFunc();
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
    }

</style>
<style lang="scss">
    @import "../../styles/mixin";
</style>

