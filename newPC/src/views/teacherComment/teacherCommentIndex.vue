<template>
    <div id="teacherCommentIndex" class="app-container calendar-list-container">
        <div class="filter-container">
            <el-row>
                <el-col :span="19">
                    <el-button type="primary" size="medium" @click="addEdit()">新增</el-button>
                    <el-button type="danger" size="medium" @click="batchDeleteHandler">删除</el-button>
                </el-col>
            </el-row>
        </div>
        <el-table stripe :data="dataList" border fit highlight-current-row
                  @select="selectionChangeHandler"
                  @select-all="selectionChangeHandler"
                  style="width: 100%" :height="maxH">
            <el-table-column align="center"
                             type="selection"
                             width="55">
            </el-table-column>
            <el-table-column width="150px" label="评语类型" show-overflow-tooltip prop="typeName">
            </el-table-column>
            <el-table-column align="center" label="评语内容" prop="content">
            </el-table-column>
            <el-table-column align="center" label="操作" width="150px">
                <template slot-scope="scope">
                    <el-button size="small" type="text"
                               @click.native="addEdit(scope.row)">编辑
                    </el-button>
                    <el-button size="small" type="text"
                               @click.native="batchDelete(scope.row.id)" class="buttontextred">删除
                    </el-button>
                </template>
            </el-table-column>

        </el-table>
        <div class="pagination-container">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                           :current-page.sync="pagination.pageNo" :page-sizes="[10,20,30, 50]"
                           :page-size="pagination.pageSize" layout="total, sizes, prev, pager, next, jumper"
                           :total="pagination.total">
            </el-pagination>
        </div>
        <el-dialog width="600px" :title="`${editId ? '编辑' : '新增'}规则`" :visible.sync="isShowAddEditDialog" custorm-class="dialog"
                   :close-on-press-escape="false"
                   :close-on-click-modal="false"
        >
            <div class="form">
                <el-form ref="form" :model="formData" :rules="formRule" label-width="80px">
                    <el-form-item label="评语类型" prop="type">
                        <el-select v-model="formData.type" placeholder="请选择">
                            <el-option v-for="item in typeList" :key="item.name" :label="item.name"
                                       :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="评语内容" prop="content">
                        <el-input @blur="formData.content = formData.content.trim()" type="textarea" :maxlength="200" :rows="4" v-model="formData.content" placeholder="评语内容(1-200个字符)"></el-input>
                    </el-form-item>
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button size="medium" @click="isShowAddEditDialog = false">取 消</el-button>
                <el-button size="medium" type="primary" @click="createAlbumConfirm">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import {
        queryTeacherComment,
        batchDeleteTeacherComment,
        insertTeacherComment,
        updateTeacherComment
    } from '@/api/teacherComment';
    import mixin from '@/mixins/windowResize';
    import baseMixin from '@/mixins/baseMixin';

    export default {
        name: 'teacherCommentIndex',
        mixins: [mixin, baseMixin],
        data() {
            return {
                dataList: [],

                formData: {
                    content: '',
                    type: 1
                },
                formRule: {
                    content: [
                        {required: true, message: '请填写评语内容', trigger: 'blur'}
                    ],
                    type: [
                        {required: true, message: '请选择评语类型', trigger: 'blur'}
                    ]
                },
                typeList: [{
                    name: '成绩评语',
                    value: 1,
                }],
                editId: null,
                isShowAddEditDialog: false
            }
        },
        created() {
            this.queryTeacherCommentFunc();
        },
        methods: {
            selectionChangeHandler(selection) {
                this.selected = selection;
            },
            addEdit(item = {}) {
                this.editId = item.id;
                this.isShowAddEditDialog = true;

                if(item.id) {
                    this.formData.content = item.content;
                    this.formData.type = item.type;
                } else {
                    this.formData.content = '';
                    if(this.typeList && this.typeList.length !== 0) {
                        this.formData.type = this.typeList[0].value;
                    } else {
                        this.formData.type = '';
                    }
                }
            },
            queryTeacherCommentFunc() {
                queryTeacherComment({
                    pageNo: this.pagination.pageNo,
                    pageSize: this.pagination.pageSize,
                    searchName: ''
                })
                    .then(res => res.data)
                    .then(data => {

                        this.dataList = data.data.dataList;
                        this.pagination.total = data.data.pagination.total;
                    })
            },
            handleSizeChange(val){
                this.pagination.pageNo = 1;
                this.pagination.pageSize = val;
                this.queryTeacherCommentFunc();
            },
            handleCurrentChange(val){
                this.pagination.pageNo = val;
                this.queryTeacherCommentFunc();
            },
            createAlbumConfirm() {
                this.$refs.form.validate(isValid => {
                    if(isValid) {
                        new Promise(resolve => {
                            const typeObj = this.typeList.find(item => item.value == this.formData.type);

                            const args = {
                                content: this.formData.content,
                                type: this.formData.type,
                                typeName: typeObj ? typeObj.name : ''
                            };
                            if(this.editId) {
                                args.id = this.editId;
                                updateTeacherComment(args)
                                    .then(res => res.data)
                                    .then(resolve)
                            } else {
                                insertTeacherComment(args)
                                    .then(res => res.data)
                                    .then(resolve)
                            }
                        })
                            .then(() => {
                                this.$message.success(`${this.editId ? '编辑' : '新增'}成功`);
                                this.isShowAddEditDialog = false;
                                this.queryTeacherCommentFunc();
                            })
                            .catch(error => {
                                this.$message.error(error);
                            });
                    }
                });
            },
            batchDeleteHandler() {
                if(!this.selected || this.selected.length == 0) {
                    this.$message.error('请选择要删除的评语');
                } else {
                    this.batchDelete(this.selected.map(item => item.id).join(','))
                        .then(() => {
                            this.selected = [];
                        });
                }
            },
            batchDelete(ids) {
                this.$confirm(`是否要删除${`${ids}`.includes(',') ? '选中的' : '该'}评语`,  '删除', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    return batchDeleteTeacherComment({
                        ids
                    })
                        .then(res => res.data)
                        .then(data => {
                            if(data.result) {
                                this.$message.success('删除成功');
                                this.queryTeacherCommentFunc();
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
