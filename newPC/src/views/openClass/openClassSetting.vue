<template>
    <div class="school_dictionary_wrap clearfix" id="schoolDictionaryBox">
        <div class="dictionary_tree custom—scrollbar" :style="{  height: (maxH+100) + 'px' }">
            <div class="tree-title">
                <span class="title-wrapper">
                  <span class="icon"></span>
                  <span class="text">听课评价项</span>
                </span>
                        <span>
                  <el-button
                      type="primary"
                      size="mini"
                      @click="addEditItem(1)"
                  >新增类型</el-button>
                </span>
            </div>
            <el-tree class="filter-tree"
                     :data="allData"
                     :props="defaultProps"
                     ref="tree"
                     node-key="id"
                     :expand-on-click-node='false'
                     @node-click="nodeClickHandler"
                     :default-expanded-keys="defaultExpandedArray">
                <span class="custom-tree-node" slot-scope="{ node, data }">
                    <div class="more_text_btn_long">
                        <span>{{data.name}}</span>
                        <span class="opt-btn-container">
                            <i class="opt-btn el-icon-delete" @click.stop="deleteHandler(data.id, true)"></i>
                            <i class="opt-btn el-icon-edit" @click="addEditItem(1, data)"></i>
                        </span>
                    </div>
                </span>
            </el-tree>
        </div>
        <div class="dictionary_box custom—scrollbar" :style="{width: (maxW - 268) + 'px',height: (maxH+100) + 'px' }">
            <div class="dic_list_wrap">
                <div class="header_btn_box">
                    <el-row>
                        <el-col :span="19">
                            <el-button type="primary" size="medium" @click.native="addEditItem(2)" :disabled="!currentNode">新增二级指标</el-button>
                        </el-col>

                    </el-row>
                </div>
                <div class="dic_list_box">
                    <el-table stripe :data="level2List" border fit highlight-current-row style="width: 100%"
                              :height="maxH-20">
                        <el-table-column align="center" label="二级指标" prop="name"></el-table-column>
                        <el-table-column align="center" label="评价星级数" prop="starNum"></el-table-column>
                        <el-table-column align="center" label="排序" prop="orderNum"></el-table-column>
                        <el-table-column align="center" label="操作">
                            <template slot-scope="scope">
                                <el-button size="small" type="text" @click.native="addEditItem(2, scope.row)">编辑
                                </el-button>
                                <el-button size="small" type="text" @click.native="deleteHandler(scope.row.id)" class="buttontextred">删除
                                </el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </div>
        </div>
        <el-dialog :title="`${editId ? '编辑' : '新建'}${addEditType == 1 ? '一级' : '二级'}指标`" :visible.sync="isShowItemDialog" size="tiny" width="600px"
                   :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false">
            <el-form :model="formData" ref="form" :rules="rules" label-width="140px">
                <el-form-item label="名称" prop="name">
                    <el-input v-model.trim="formData.name" :maxlength="40" placeholder="名称（1-40个字符）"></el-input>
                </el-form-item>
                <el-form-item label="评价星级数" v-if="addEditType == 2" prop="starNum">
                    <el-input-number step-strictly v-model.trim="formData.starNum" :min="1" :max="10"></el-input-number>
                </el-form-item>
                <el-form-item label="排序" prop="orderNum">
                    <el-input-number step-strictly v-model.trim="formData.orderNum" :min="1" :max="1000"></el-input-number>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button size="medium" @click="isShowItemDialog = false">取 消</el-button>
                <el-button size="medium" type="primary" @click="addEditItemConfirm">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import mixins from '@/mixins/windowResize';
    import {
        insertAppraiseSet,
        queryAppraiseList,
        deleteAppraiseSetById,
        updateAppraiseSet
    } from '@/api/teachingStudy/openClass';

    export default {
        name: "openClassSetting",
        props: ['selectTreeCode'],
        data() {
            return {
                defaultProps: { // 可以设置下一级的key值，及label的展示名称
                    children: 'children',
                    label: 'label'
                },
                currentNode: null,
                defaultExpandedArray: [],
                allData: [],
                level1List: [],
                editId: null,
                addEditType: 1,
                formData: {
                    name: '',
                    orderNum: 1,
                    starNum: 1
                },
                rules: {
                    name: [
                        {required: true, message: '请输入名称'}
                    ],
                    orderNum: [
                        {required: true, message: '请输入排序号！'}
                    ],
                    starNum: [
                        {required: true, message: '请输入星级数！'}
                    ]
                },
                isShowItemDialog: false
            }
        },
        mixins: [mixins],
        created() {
            this.getList();
        },
        computed: {
            level2List() {
                if(this.currentNode) {
                    return this.allData.find(item => item.id == this.currentNode.id).appraiseList;
                } else {
                    return [];
                }
            }
        },
        methods: {
            nodeClickHandler(item) {
                this.currentNode = item;
            },
            addEditItem(addEditType, editItem = null) {
                this.isShowItemDialog = true;
                this.addEditType = addEditType;
                if(editItem) {
                    this.editId = editItem.id;
                    this.formData = {
                        name: editItem.name,
                        orderNum: editItem.orderNum,
                        starNum: editItem.starNum
                    };
                } else {
                    this.editId = null;
                    this.formData = {
                        name: '',
                        orderNum: 1,
                        starNum: 1
                    };
                }


            },
            addEditItemConfirm() {
                this.$refs.form.validate(isValid => {
                    if(isValid) {
                        const args = {
                            name: this.formData.name,
                            orderNum: this.formData.orderNum,
                            starNum: this.formData.starNum,
                            type: this.addEditType,
                            pId: this.addEditType == 1 ? 0 : this.currentNode.id
                        };
                        new Promise(resolve => {
                            if(this.editId) {
                                args.id = this.editId;
                                updateAppraiseSet(args)
                                    .then(res => res.data)
                                    .then(resolve)
                            } else {
                                insertAppraiseSet(args)
                                    .then(res => res.data)
                                    .then(resolve)
                            }
                        })
                            .then(data => {
                                this.isShowItemDialog = false;
                                this.$message.success(`${this.editId ? '编辑' : '新增'}成功`);
                                this.getList();
                            })

                    }
                })
            },
            // 列表
            getList() {
                queryAppraiseList()
                    .then(res => res.data)
                    .then(data => {
                        const pageData = data.data;
                        console.log('pageData', pageData)
                        this.allData = pageData;
                    })
            },
            deleteHandler(id, isClearCurrent = false) {
                this.$confirm(`确定删除该评价项吗？`, '删除', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    deleteAppraiseSetById({
                        id
                    })
                        .then(res => res.data)
                        .then(data => {
                            if(data.result) {
                                this.$message({
                                    type: 'success',
                                    message: '删除成功！',
                                });
                                if(isClearCurrent) {
                                    this.currentNode = null;
                                }
                                this.getList();
                            }
                        })
                }).catch(() => {
                });
            },

        }
    }
</script>

<style lang="scss" scoped>
    .school_dictionary_wrap {
        position: relative;
        padding: 12px;

        .dictionary_tree {
            width: 230px;
            float: left;
            border: 1px solid #ddd;
            border-right-width: 0;

            .custom-tree-node {
                display: flex;

                .label_title {
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    flex: 1;
                    line-height: 28px;
                }

                .more_text_btn {
                    width: 70px;
                }

                .more_text_btn_long {
                    width: 190px;
                }
            }

            .add_type_btn {
                /*text-align: center;*/
                padding: 8px 15px;
                border-bottom: 1px solid #eee;
            }
        }

        .dictionary_box {
            float: left;
            border: 1px solid #ddd;
            padding: 10px;
        }
    }

    .dic_list_wrap {
        .header_btn_box {
            padding-bottom: 10px;
        }
    }
    .custom-tree-node:hover {
        .opt-btn {
            display: block;
        }
    }
    .opt-btn-container {
        .opt-btn {
            display: none;
        }
    }
    .opt-btn {
        float: right;
        color: #409EFF;
        cursor: pointer;
        &.el-icon-delete {
            margin-left: 5px;
        }
    }
    .school_dictionary_wrap {
        flex: 0 0 240px;
        border-right: 1px solid #e4e7ed;
        height: 100%;
        overflow-x: hidden;
        overflow-y: auto;
        .tree-title {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 7px 15px;
        }

        /deep/ .el-tree-node__content {
            height: 32px;

            .custom-tree-node {
                flex: 1;
                display: flex;
                align-items: center;
                justify-content: space-between;
                font-size: 14px;
                padding-right: 15px;
                .text-wrapper {
                    flex: 1;
                    display: flex;
                    align-items: center;
                    i {
                        flex: 0 0 14px;
                    }
                    .text {
                        flex: 0 0 180px;
                        width: 180px;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                        vertical-align: middle;
                    }
                }
                .custom-tree-handle-wrapper {
                    display: none;
                    font-size: 16px;
                }

                &:hover {
                    .text {
                        flex: 0 0 130px;
                        width: 130px;
                    }
                    &.first-node {
                        .text {
                            flex: 0 0 100px;
                            width: 100px;
                        }
                    }
                    .custom-tree-handle-wrapper {
                        display: block;
                    }
                }
            }
        }
    }
</style>
