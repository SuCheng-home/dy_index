<template>
    <div class="school_dictionary_wrap clearfix" id="schoolDictionaryBox">
        <div class="dictionary_tree custom—scrollbar" :style="{  height: (maxH+100) + 'px' }">
            <div class="add_type_btn">
                <el-button type="primary" size="small" @click.native="showTypeAddBox">新增类型</el-button>
            </div>
            <el-tree class="filter-tree"
                     :data="dictionaryList"
                     :props="defaultProps"
                     :filter-node-method="filterNode"
                     ref="tree2"
                     node-key="id"
                     :expand-on-click-node='false'
                     @node-click="dicNodeClick"
                     @node-contextmenu="rightNodeClick"
                     :default-expanded-keys="defaultExpandedArray">
                <span class="custom-tree-node" slot-scope="{ node, data }">
                    <div class="label_title" :title="node.label">{{node.label}}</div>
                    <div class="more_text_btn_long" v-if="!data.pId && data.id === checkedTreeId">
                      <el-button type="text" size="mini" @click="showEditType">编辑</el-button>
                      <el-button type="text" size="mini" @click="deleteSchoolDicType" class="buttontextred">删除</el-button>
                      <el-button type="text" size="mini" @click="showDictionaryBox">添加字典</el-button>
                    </div>
                    <div class="more_text_btn" v-else-if="!!data.pId && data.id === checkedTreeId">
                      <el-button type="text" size="mini" @click="showEditDic">编辑</el-button>
                      <el-button type="text" size="mini" @click="deleteSchoolDic" class="buttontextred">删除</el-button>
                    </div>
                </span>
            </el-tree>
        </div>
        <div class="dictionary_box custom—scrollbar" :style="{height: (maxH+100) + 'px' }">
            <router-view :select-tree-code="showTreeId"></router-view>
        </div>
        <!--新增/编辑类型-->
        <el-dialog :title="!dicTypeId ? '新增字典类型' : '编辑字典类型'" :visible.sync="isShowTypeAddDialog" width="720px"
                   :close-on-press-escape="false" :show-close="false" :close-on-click-modal="false">
            <div class="device_add_box">
                <el-form :model="dicTypeMsg" :rules="dicTypeRules" ref="dicTypeForm">
                    <el-form-item label="英文名称" prop="code" label-width="100px">
                        <el-input v-model.trim="dicTypeMsg.code" maxlength="30" placeholder="唯一，添加后不可修改" @input="enMakeOut" :disabled="!!dicTypeId"></el-input>
                    </el-form-item>
                    <el-form-item label="中文名称" prop="name" label-width="100px">
                        <el-input v-model.trim="dicTypeMsg.name" maxlength="20" placeholder="中文名称"></el-input>
                    </el-form-item>
                    <el-form-item label="字典描述" prop="remark" label-width="100px">
                        <el-input type="textarea" v-model.trim="dicTypeMsg.remark" maxlength="1000"></el-input>
                    </el-form-item>
                </el-form>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="cancelAddType">取 消</el-button>
                <el-button type="primary" :disabled="disabledType" @click="toAddType">确 定</el-button>
            </div>
        </el-dialog>
        <!--新增/编辑字典-->
        <el-dialog :title="!dictionaryId ? '新增字典' : '编辑字典'" :visible.sync="isShowDicAddDialog" width="720px"
                   :close-on-press-escape="false" :show-close="false" :close-on-click-modal="false">
            <div class="device_add_box">
                <el-form :model="dictionaryMsg" :rules="dictionaryRules" ref="dictionaryForm">
                    <el-form-item label="英文名称" prop="code" label-width="100px">
                        <el-input v-model.trim="dictionaryMsg.code" maxlength="30" placeholder="唯一，添加后不可修改" @input="dicEnMakeOut" :disabled="!!dictionaryId"></el-input>
                    </el-form-item>
                    <el-form-item label="中文名称" prop="name" label-width="100px">
                        <el-input v-model.trim="dictionaryMsg.name" maxlength="20" placeholder="中文名称"></el-input>
                    </el-form-item>
                    <el-form-item label="字典描述" prop="remark" label-width="100px">
                        <el-input type="textarea" v-model.trim="dictionaryMsg.remark" maxlength="1000"></el-input>
                    </el-form-item>
                </el-form>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="cancelAddDic">取 消</el-button>
                <el-button type="primary" :disabled="disabledDic" @click="toAddDictionary">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import mixins from '@/mixins/windowResize';
    import {loadSchoolDicTypeList, saveSchoolDicType, getSchoolDicTypeInfoByCode, deleteSchoolDicType, saveDicDetail, getDicDetailInfoByCode, deleteDicDetail} from '@/api/systemSet/schoolDictionary';

    export default {
        name: "schoolDictionaryIndex",
        data() {
            return {
                showTreeId: null,
                checkedTreeId: null,
                checkedTreeCode: null,
                defaultProps: { // 可以设置下一级的key值，及label的展示名称
                    children: 'children',
                    label: 'label'
                },
                defaultExpandedArray: [],
                dictionaryList: [],
                isShowTypeAddDialog: false, // 新增/编辑类型窗口
                disabledType: false,
                dicTypeId: 0,
                dicTypeMsg: {
                    code: '',
                    name: '',
                    remark: ''
                },
                dicTypeRules: {
                    code: [
                        {required: true, message: '请输入类型编码', trigger: 'blur'},
                        {min: 1, max: 30, message: '请输入 30 个以内有效字符', trigger: 'blur'}
                    ],
                    name: [
                        {required: true, message: '请输入类型名称', trigger: 'blur'},
                        {min: 1, max: 20, message: '请输入 20 个以内有效字符', trigger: 'blur'}
                    ]
                },
                isShowDicAddDialog: false, // 新增/编辑字典窗口
                disabledDic: false,
                dicTypeCode: null,
                dictionaryId: 0,
                dictionaryMsg: {
                    code: '',
                    name: '',
                    remark: ''
                },
                dictionaryRules: {
                    code: [
                        {required: true, message: '请输入字典编码', trigger: 'blur'},
                        {min: 1, max: 30, message: '请输入 30 个以内有效字符', trigger: 'blur'}
                    ],
                    name: [
                        {required: true, message: '请输入字典名称', trigger: 'blur'},
                        {min: 1, max: 20, message: '请输入 20 个以内有效字符', trigger: 'blur'}
                    ]
                }
            }
        },
        mixins: [mixins],
        created() {
            this.loadSchoolDicTypeList();
        },
        mounted() {
            let self = this;
            document.getElementById('schoolDictionaryBox').onclick = () => {
                self.clearTreeDom();
            };
        },
        methods: {
            // 左侧树形结构
            loadSchoolDicTypeList() {
                let self = this;
                loadSchoolDicTypeList().then(res => {
                    const data = res.data;
                    self.dictionaryList = [];
                    if (data.code === 200) {
                        data.data.forEach((item) => {
                            if (item.pId === 0) {
                                self.dictionaryList.push({
                                    id: item.id,
                                    pId: item.pId,
                                    label: item.name,
                                    code: item.code,
                                    children: []
                                });
                            } else {
                                self.dictionaryList.forEach((childItem) => {
                                    if (childItem.id === item.pId) {
                                        childItem.children.push({
                                            id: item.id,
                                            pId: item.pId,
                                            label: item.name,
                                            code: item.code
                                        });
                                    }
                                });
                            }
                        });
                        // 展示年级的课程，初始树结构传值到list页面
                        // this.showTreeId = 0;
                        if (!!this.dictionaryList.length) {
                            this.getTreeId(0);
                        }
                    }
                }).catch();
            },
            getTreeId(index) {
                if (!this.dictionaryList[index].children.length) {
                    this.getTreeId(index + 1);
                } else {
                    this.showTreeId = this.dictionaryList[index].children[0].code;
                    this.defaultExpandedArray.push(this.dictionaryList[index].children[0].id);
                }
            },
            dicNodeClick(data) {
                if (!!data.pId) {
                    this.showTreeId = data.code;
                    if (this.$route.path.indexOf('schoolDictionary/list') < 0) {
                        this.$router.push({path: 'list'});
                    }
                }
            },
            // 右击操作
            rightNodeClick(event, data, node, self) {
                this.checkedTreeId = data.id;
                this.checkedTreeCode = data.code;
                if (!data.pId) {
                    this.dicTypeCode = data.code;
                }
            },
            // 类型新增/编辑
            showTypeAddBox() { // 新增弹出
                this.dicTypeId = 0;
                this.dicTypeMsg = {
                    code: '',
                    name: '',
                    remark: ''
                };
                this.isShowTypeAddDialog = true;
            },
            showEditType() { // 编辑弹出
                this.isShowTypeAddDialog = true;
                this.getSchoolDicTypeInfoByCode();
            },
            cancelAddType() { // 取消按钮
                this.isShowTypeAddDialog = false;
            },
            enMakeOut() { // 英文、数字输入限制
                this.dicTypeMsg.code = this.dicTypeMsg.code.replace(/[^\w\.\/]/ig,'');
            },
            // 新增/编辑
            toAddType() {
                this.$refs['dicTypeForm'].validate((valid) => {
                    if (valid) {
                        let query = {
                            code: this.dicTypeMsg.code,
                            name: this.dicTypeMsg.name,
                            remark: this.dicTypeMsg.remark
                        };
                        let typeText = '新增';

                        if (!!this.dicTypeId) {
                            query.id = this.dicTypeId;
                            typeText = '修改';
                        }
                        this.saveSchoolDicType(query, typeText);
                        this.isShowTypeAddDialog = false;
                    } else {
                        return false;
                    }
                })
            },
            saveSchoolDicType(query, text) {
                this.disabledType = true;
                saveSchoolDicType(query).then(res => {
                    const data = res.data;
                    if (data.code === 200) {
                        this.$message({
                            type: 'success',
                            message: '类型' + text + '成功!'
                        });
                        this.loadSchoolDicTypeList();
                    } else {
                        this.$message({
                            type: 'warning',
                            message: data.msg
                        });
                    }
                    this.disabledType = false;
                }).catch((err) => {
                    this.disabledType = false;
                });
            },
            // 类型详情
            getSchoolDicTypeInfoByCode() {
                getSchoolDicTypeInfoByCode(this.checkedTreeCode).then(res => {
                    const data = res.data.data;
                    if (res.data.code === 200) {
                        this.dicTypeMsg = {
                            code: data.code,
                            name: data.name,
                            remark: data.remark
                        };
                        this.dicTypeId = data.id;
                    }
                }).catch();
            },
            // 删除字典类型
            deleteSchoolDicType() {
                this.$confirm('此操作将删除此字典类型, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    deleteSchoolDicType(this.checkedTreeCode).then(res => {
                        const data = res.data;
                        if (data.code === 200) {
                            this.$message({
                                type: 'success',
                                message: '删除成功!'
                            });
                            this.loadSchoolDicTypeList();
                        } else {
                            this.$message({
                                type: 'warning',
                                message: data.msg
                            });
                        }
                    }).catch();
                }).catch(() => {
                    this.clearTreeDom();
                });
            },
            clearTreeDom() {
                this.checkedTreeId = null;
                this.checkedTreeCode = null;
            },
            // 字典新增/编辑 -----------------------
            showDictionaryBox() { // 新增弹出
                this.dictionaryId = 0;
                this.dictionaryMsg = {
                    code: '',
                    name: '',
                    remark: ''
                };
                this.isShowDicAddDialog = true;
            },
            showEditDic() { // 编辑弹出
                this.isShowDicAddDialog = true;
                this.getDicDetailInfoByCode();
            },
            cancelAddDic() { // 取消按钮
                this.isShowDicAddDialog = false;
            },
            dicEnMakeOut() { // 英文、数字输入限制
                this.dictionaryMsg.code = this.dictionaryMsg.code.replace(/[^\w\.\/]/ig,'');
            },
            // 新增/编辑
            toAddDictionary() {
                this.$refs['dictionaryForm'].validate((valid) => {
                    if (valid) {
                        let query = {
                            code: this.dictionaryMsg.code,
                            name: this.dictionaryMsg.name,
                            remark: this.dictionaryMsg.remark,
                            typeCode: this.dicTypeCode
                        };
                        let typeText = '新增';

                        if (!!this.dictionaryId) {
                            query.id = this.dictionaryId;
                            typeText = '修改';
                        }
                        this.saveDicDetail(query, typeText);
                        this.isShowDicAddDialog = false;
                    } else {
                        return false;
                    }
                })
            },
            saveDicDetail(query, text) {
                this.disabledDic = true;
                saveDicDetail(query).then(res => {
                    const data = res.data;
                    if (data.code === 200) {
                        this.$message({
                            type: 'success',
                            message: '字典项' + text + '成功!'
                        });
                        this.loadSchoolDicTypeList();
                    } else {
                        this.$message({
                            type: 'warning',
                            message: data.msg
                        });
                    }
                    this.disabledDic = false;
                }).catch((err) => {
                    this.disabledDic = false;
                });
            },
            // 字典详情
            getDicDetailInfoByCode() {
                getDicDetailInfoByCode(this.checkedTreeCode).then(res => {
                    const data = res.data.data;
                    if (res.data.code === 200) {
                        this.dictionaryMsg = {
                            code: data.code,
                            name: data.name,
                            remark: data.remark
                        };
                        this.dictionaryId = data.id;
                        this.dicTypeCode = data.typeCode;
                    }
                }).catch();
            },
            // 删除字典
            deleteSchoolDic() {
                this.$confirm('此操作将删除此字典项, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    deleteDicDetail(this.checkedTreeCode).then(res => {
                        const data = res.data;
                        if (data.code === 200) {
                            this.$message({
                                type: 'success',
                                message: '删除成功!'
                            });
                            this.loadSchoolDicTypeList();
                        } else {
                            this.$message({
                                type: 'warning',
                                message: data.msg
                            });
                        }
                    }).catch();
                }).catch(() => {
                    this.clearTreeDom();
                });
            },
            filterNode(value, data) {
                // if (!value) {
                //     return true;
                // }
                // return data.label.indexOf(value.trim()) !== -1;
            }
        }
    }
</script>

<style scoped>
    .clearfix:after {
        content: "";
        display: block;
        font-size: 0;
        height: 0;
        clear: both;
        visibility: hidden;
    }

    .clearfix {
        zoom: 1;
    }
</style>
<style lang="scss" scoped>
    @import "../../../styles/style";

    .school_dictionary_wrap {
        position: relative;
        padding: 12px;

        .dictionary_tree {
            width: 230px;
            float: left;
            border: 1px solid #ddd;
            border-right-width: 0;

            .custom-tree-node{
                display: flex;
                width: 192px;
                .label_title{
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    flex: 1;
                    line-height: 28px;
                }
                .more_text_btn{
                    width: 70px;
                }
                .more_text_btn_long{
                    width: 115px;
                }
            }

            .add_type_btn{
                /*text-align: center;*/
                padding: 8px 15px;
                border-bottom: 1px solid #eee;
            }
        }

        .dictionary_box {
            float: left;
            border: 1px solid #ddd;
            padding: 10px;
            width: calc(100% - 230px)
        }
    }
</style>
