<template>
    <div class="app-container calendar-list-container" :style="{ height: (maxH+90) + 'px' }">
        <div class="left-panel" :style="{  height: (maxH+90) + 'px' }">
            <el-tree ref="tree" :highlight-current="true" node-key="id" :data="typeList" :props="propsConfig"
                     @node-click="onNodeClick" :expand-on-click-node="false"></el-tree>
        </div>
        <div class="right-panel" :style="{ height: (maxH+90) + 'px' }">
            <div v-show="rightShowMode === 'table'">
                <back-tool>
                    <el-button v-if="canAdd" class="filter-item" type="primary" @click="typeAddEdit()" size="medium">
                        新增
                    </el-button>
                    <el-input size="medium"
                              placeholder="请输入类型名称" icon="el-icon-search" @keyup.enter.native="searchTitleHandler"
                              class="search-input"
                              v-model="searchName">
                        <el-button slot="append" icon="el-icon-search" @click="searchTitleHandler"></el-button>
                    </el-input>
                </back-tool>
                <el-table stripe :data="dataList" border fit highlight-current-row style="width: 100%"
                          :height="maxH - 20">
                    <el-table-column label="类型名称" prop="name">
                    </el-table-column>
                    <el-table-column label="上级分类" prop="pname">
                    </el-table-column>
                    <el-table-column label="审核方式" prop="approveTypeName">
                    </el-table-column>
                    <el-table-column label="创建时间">
                        <template slot-scope="scope">
                            {{scope.row.createTime | timeSuffixFilter}}
                        </template>
                    </el-table-column>
                    <el-table-column label="操作">
                        <template slot-scope="scope">
                            <el-button size="small" type="text" @click="typeAddEdit(scope.row)">编辑
                            </el-button>
                            <el-button size="small" type="text" @click="deleteHandler(scope.row.id)" class="buttontextred">删除
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <div class="pagination-container">
                    <el-pagination
                        @size-change="sizeChangeHandler" @current-change="pageChangeHandler"
                        :current-page.sync="pagination.pageNo" :page-sizes="[10,20,30, 50]"
                        :page-size.sync="pagination.pageSize" layout="total, sizes, prev, pager, next, jumper"
                        :total="pagination.total">
                    </el-pagination>
                </div>
            </div>
            <print-type-add-edit ref="printTypeAddEdit" :editItem="editItem" @addSuccess="onAddSuccess" :currentNodeData="currentNodeData"
                                 @back="rightShowMode = 'table'"
                                 v-show="rightShowMode === 'addEdit'"></print-type-add-edit>
        </div>
    </div>
</template>

<script>
    import mixin from '@/mixins/windowResize';
    import baseMixin from '@/mixins/baseMixin';
    import BackTool from '@/components/BackTool';
    import PrintTypeAddEdit from './printTypeAddEdit';
    import {
        initPrintTypeRootNode,
        getTypeTree,
        getChildTypeList,
        delType,
        getBySchoolIdInit
    } from '@/api/printApplication';

    function getNodeChild(nodeList) {
        let childIdList = [];
        nodeList.forEach(item => {
            childIdList.push(item.id);
            if (item.children) {
                childIdList = [...childIdList, ...getNodeChild(item.children)]
            }
        });
        return childIdList;
    }

    export default {
        name: "typeSetting",
        mixins: [mixin, baseMixin],
        components: {BackTool, PrintTypeAddEdit},
        data() {
            return {
                propsConfig: {
                    label: 'name'
                },
                typeList: [],
                currentNodeData: {},
                childIds: '',
                rightShowMode: 'table',
                searchName: '',
                dataList: [],
                canAdd: true,
                editItem: null,
                consumableApply: false
            };
        },
        created() {
            getBySchoolIdInit()
                .then(res => res.data)
                .then(data => {
                    const pageData = data.data;
                    this.consumableApply = pageData.consumableApply == 1;
                    Promise.all([
                        initPrintTypeRootNode({
                            kind: 1
                        }),
                        initPrintTypeRootNode({
                            kind: 2
                        })
                    ])
                        .then(() => {
                            this.getTypeTreeData()
                                .then(() => {
                                    this.onNodeClick(this.typeList[0]);
                                });
                        });
                });

        },
        methods: {
            searchTitleHandler() {
                this.pagination.pageNo = 1;
                this.getChildTypeListFunc();
            },
            getTypeTreeData() {
                const funcArray = [getTypeTree({
                    kind: 1
                })
                    .then(res => res.data.data)];
                if(this.consumableApply) {
                    funcArray.push(getTypeTree({
                        kind: 2
                    })
                        .then(res => res.data.data))
                }

                return Promise.all(funcArray)
                    .then(([type1Data, type2Data]) => {
                        const typeList = [type1Data[0]];
                        if(this.consumableApply) {
                            typeList.push(type2Data[0])
                        }
                        this.typeList = typeList;
                    })
            },
            onNodeClick(nodeData, _, node) {
                if (node) {
                    this.canAdd = node.node.level < 4;
                } else {
                    this.canAdd = true;
                }
                this.rightShowMode = 'table';
                this.currentNodeData = nodeData;
                this.$refs.tree.setCurrentKey(this.currentNodeData.id);
                this.childIds = getNodeChild(nodeData.children).join(',');
                this.pagination.pageNo = 1;
                this.searchName = '';
                this.getChildTypeListFunc();
            },
            sizeChangeHandler() {
                this.pagination.pageNo = 1;
                this.getChildTypeListFunc();
            },
            pageChangeHandler() {
                this.getChildTypeListFunc();
            },
            getChildTypeListFunc() {
                getChildTypeList({
                    childIds: this.childIds,
                    kind: this.currentNodeData.kind,
                    pageNo: this.pagination.pageNo,
                    pageSize: this.pagination.pageSize,
                    pid: this.currentNodeData.id,
                    searchName: this.searchName
                })
                    .then(res => res.data)
                    .then(data => {
                        this.dataList = data.data.dataList;
                        this.pagination.total = data.data.pagination.total;
                    })
            },
            typeAddEdit(editItem) {
                this.editItem = editItem || null;
                this.rightShowMode = 'addEdit';
            },
            onAddSuccess() {
                this.rightShowMode = 'table';
                this.getTypeTreeData()
                    .then(() => {
                        this.currentNodeData = this.$refs.tree.getNode(this.currentNodeData.id).data;
                        this.childIds = getNodeChild(this.currentNodeData.children).join(',');
                        this.$refs.tree.setCurrentKey(this.currentNodeData.id);
                        this.$refs.printTypeAddEdit.clear();
                        this.getChildTypeListFunc();
                    });
            },
            deleteHandler(typeId) {
                delType({
                    typeId
                })
                    .then(res => res.data)
                    .then(data => {
                        if (data.result) {
                            this.$message.success('删除成功');
                            this.getTypeTreeData()
                                .then(() => {
                                    this.currentNodeData = this.$refs.tree.getNode(this.currentNodeData.id).data;
                                    this.childIds = getNodeChild(this.currentNodeData.children).join(',');
                                    this.$refs.tree.setCurrentKey(this.currentNodeData.id);
                                    this.getChildTypeListFunc();
                                });
                        } else {
                            this.$message.error(data.msg);
                        }
                    })
            }
        }
    }
</script>

<style scoped>
    .app-container {
        position: relative;
    }

    .left-panel {
        float: left;
        border: 1px solid #d1dbe5;
        border-right: 0;
        width: 204px;
        overflow-y: auto;
        position: absolute;
    }

    .right-panel {
        position: absolute;
        left: 220px;
        right: 10px;
        border: 1px solid #d1dbe5;
        box-sizing: border-box;
        padding-top: 10px;
        padding-left: 10px;
    }

    .search-input {
        vertical-align: middle;
        width: 220px;
        padding-right: 10px;
        float: right;
    }

    .pagination-container {
        margin-top: 10px;

    }
</style>
