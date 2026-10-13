<template>
    <div class="honourGradeList padding">
        <el-tabs v-model="activeName" type="border-card" @tab-click="handleClick">
            <el-tab-pane label="证书级别" name="first"></el-tab-pane>
            <!-- <el-tab-pane label="证书类型" name="second"></el-tab-pane> -->
            <el-tab-pane label="获奖等级" name="third">
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
                            :height="maxH - 10"
                            style="width: 100%">
                            <el-table-column
                                label="获奖等级" align="center" show-overflow-tooltip>
                                <template slot-scope="scope">{{ scope.row.levelName }}</template>
                            </el-table-column>
                            <el-table-column
                                label="排序" align="center" show-overflow-tooltip>
                                <template slot-scope="scope">{{ scope.row.sortNo }}</template>
                            </el-table-column>
                            <el-table-column
                                label="创建人" align="center">
                                <template slot-scope="scope">{{ scope.row.createUserName }}</template>
                            </el-table-column>
                            <el-table-column prop="address" align="center" label="操作" width="220">
                                <template slot-scope="scope">
                                    <el-button size="small" type="text" @click="editOrganHandler(scope.row.id)">编辑</el-button>
                                    <el-button size="small" type="text" @click="delHander(scope.row.id)" class="buttontextred">删除</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                </div>
            </el-tab-pane>
            <el-tab-pane label="证书名称" name="fourth"></el-tab-pane>
        </el-tabs>


        <el-dialog title="新增获奖等级" :visible.sync="addOrganListDialog" width="40%">
            <el-form :model="addOrgan" :rules="addOrganRules" ref="addOrgan" label-width="100px" class="addOrganFrom">
                <el-form-item label="等级名称" prop="levelName">
                    <el-input v-model.trim="addOrgan.levelName" maxlength="20" placeholder="类型名称（1-20个字符）"></el-input>
                </el-form-item>
                <el-form-item label="排序" prop="sortNo">
                    <el-input-number v-model.trim="addOrgan.sortNo" step-strictly controls-position="right" :min="1" :max="99999" :step="1"></el-input-number>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
        <el-button @click="addOrganListDialog = false">取 消</el-button>
        <el-button type="primary" @click="addOrganSave">确 定</el-button>
      </span>
        </el-dialog>
        <el-dialog
            title="编辑获奖等级"
            :visible.sync="editOrganListDialog"
            width="40%">
            <el-form :model="editOrgan" :rules="editOrganRules" ref="editOrgan" label-width="100px"
                     class="addOrganFrom">
                <el-form-item label="等级名称" prop="levelName">
                    <el-input v-model.trim="editOrgan.levelName" maxlength="20" placeholder="类型名称（1-20个字符）"></el-input>
                </el-form-item>
                <el-form-item label="排序" prop="sortNo">
                    <el-input-number v-model.trim="editOrgan.sortNo" step-strictly controls-position="right" :min="1" :max="99999" :step="1"></el-input-number>
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
    import mixins from '@/mixins/windowResize';
    import {listBySchoolId, levelInsert, getLevelId, levelUpdate, deleteLevelById} from '@/api/honour/honourTypeSet';

    export default {
        data() {
            return {
                activeName: 'third',
                honourTable: [],
                addOrganListDialog: false,
                addOrgan: {
                    levelName: '',
                    sortNo:1
                },
                addOrganRules: {
                    levelName: [
                        {
                            required: true,
                            message: '请输入类型名称！',
                            trigger: 'blur'
                        }
                    ],
                    sortNo: [
                        {required: true, message: '请填写排序号', trigger: 'blur'}
                    ]
                },
                editOrgan: {
                    levelName: '',
                     sortNo:1
                },
                editOrganRules: {
                    levelName: [
                        {
                            required: true,
                            message: '请输入类型名称！',
                            trigger: 'blur'
                        }
                    ],
                     sortNo: [
                        {required: true, message: '请填写排序号', trigger: 'blur'}
                    ]
                },
                editOrganListDialog: false,
                editOrganId: ''
            }
        },
        created() {
            // document.title="荣誉类型列表";
            this.listBySchoolIdFunc();
        },
        mixins: [mixins],
        methods: {
            handleClick(val) {
                if (val.name === 'first') {
                    this.$router.replace({path: 'honourGradeList'});
                } else if (val.name === 'second') {
                    this.$router.replace({path: 'honourTypeList'});
                } else if(val.name === 'fourth') {
                    this.$router.replace({path: 'honourNameList'});
                }
            },
            editOrganHandler(id) {
                getLevelId({
                    id: id,
                }).then(res => res.data)
                    .then(data => {
                        if (data.code === 200) {
                            let organInfo = data.data;
                            this.editOrgan.levelName = organInfo.levelName;
                            this.editOrgan.sortNo = organInfo.sortNo;
                            this.editOrganId = organInfo.id;
                            this.editOrganListDialog = true;
                        }
                    })
            },
            editOrganSave() {
                this.$refs.editOrgan.validate((valid) => {
                    if (valid) {
                        levelUpdate({
                            id: this.editOrganId,
                            levelName: this.editOrgan.levelName,
                            sortNo:this.editOrgan.sortNo
                        }).then(res => res.data)
                            .then(data => {
                                if (data.code === 200) {
                                    this.$message({
                                        type: 'success',
                                        message: '编辑成功!'
                                    });
                                    this.editOrganListDialog = false;
                                    this.listBySchoolIdFunc();
                                } else {
                                    this.$message({
                                        type: 'error',
                                        message: data.msg
                                    });
                                }
                            })
                    }
                });
            },
            addOrganSave() {
                this.$refs.addOrgan.validate((valid) => {
                    if (valid) {
                        levelInsert({
                            levelName: this.addOrgan.levelName,
                            sortNo:this.addOrgan.sortNo
                        }).then(res => res.data)
                            .then(data => {
                                if (data.code === 200) {
                                    this.$message({
                                        type: 'success',
                                        message: '新建成功!'
                                    });
                                    this.addOrgan.levelName = '';
                                    this.addOrganListDialog = false;
                                    this.listBySchoolIdFunc();
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
            },
            delHander(id) {
                this.$confirm('您确认删除当前类型?', '提示', {
                    type: 'error'
                }).then(() => {
                    deleteLevelById({
                        id: id
                    }).then(res => {
                        let data = res.data;
                        if (data.code === 200 && data.result) {
                            this.$message({
                                type: 'success',
                                message: '删除成功!'
                            });
                            this.listBySchoolIdFunc();
                        } else {
                            this.$message({
                                type: 'error',
                                message: data.msg
                            });
                        }
                    })
                }).catch(() => {

                });
            },
            listBySchoolIdFunc() {
                listBySchoolId({}).then(res => res.data).then(data => {
                    if (data.code === 200 && data.result) {
                        this.honourTable = data.data;
                    }
                }).catch(() => {
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

