<template>
    <div class="app-container calendar-list-container">
        <div class="org-tree el-table__body-wrapper" v-bind:style="{  height: (maxH+90) + 'px' }">
            <el-input placeholder="输入关键字进行过滤" class="myinput" v-model="filterText" icon="el-icon-search"></el-input>
            <el-tree class="filter-tree"
                     :props="defaultProps"
                     :filter-node-method="filterNode"
                     ref="tree2"
                     node-key="id"
                     :expand-on-click-node='false' @node-click="orgNodeClick"
                     :data="data2" default-expand-all></el-tree>
        </div>
        <div class="org-panel" :style="{height: (maxH+90) + 'px' }">
            <div class="panel-box">
                <div class="panel-item school-box">
                    <div class="table-tools">
                        <el-row :gutter="10">
                            <el-col>
                                <div class="depart-title">{{Name}}<i v-if="listQuery.pId!=0" class="el-icon-edit"
                                                                     @click="editRepairress()"></i><i
                                        v-if="listQuery.pId!=0 && list.length<1" class="el-icon-delete"
                                        @click="deleteRepairAddress()"></i></div>
                            </el-col>
                        </el-row>
                        <el-row :gutter="10">
                            <div class="menu-tools">
                                <el-button v-if="!noback" type="default" size="medium" @click="$router.back()">返回</el-button>
                                <el-button class="filter-item" type="primary" size="medium" @click="addShow()">新增</el-button>
                                <el-button size="medium" class="filter-item" type="danger"
                                           @click="delRepairAddressSelected()">删除
                                </el-button>

                                <el-input size="medium" class="searchButton" align="right"  style="width:20%" placeholder="地点名称"
                                          v-model.trim="listQuery.searchTitle" icon="el-icon-search"
                                          @keyup.enter.native="handleInputChange">
                                    <el-button size="medium" slot="append" icon="el-icon-search" @click="handleInputChange"></el-button>
                                </el-input>
                            </div>

                        </el-row>

                    </div>
                    <div class="class-table">
                        <el-table stripe @select="selectionChangeHandler" @select-all="selectionChangeHandler" :key='tableKey'
                                  :data="list" v-loading.body="listLoading" border fit highlight-current-row
                                  style="width: 100%" :height="maxH-80">
                            <el-table-column type="selection" align="center" width="65">
                            </el-table-column>

                            <el-table-column align="left" label="报修地点" show-overflow-tooltip min-width="100">
                                <template slot-scope="scope">
                                    <span>{{scope.row.placeName}}</span>
                                </template>
                            </el-table-column>

                            <el-table-column align="center" label="创建时间" width="260">
                                <template slot-scope="scope">
                                    <span>{{scope.row.createTime|formatTimeFilter}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column align="center" label="操作" width="200">
                                <template slot-scope="scope">
                                    <el-button size="small" type="text"
                                               @click="editShow(scope.row.id,scope.row.placeName)">编辑
                                    </el-button>
                                    <el-button size="small" type="text" @click="delRepairAddress(scope.row.id)" class="buttontextred">删除
                                    </el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                        <div v-show="!listLoading" class="pagination-container">
                            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                                           :current-page.sync="listQuery.pageNo" :page-sizes="[10,20,30, 50]"
                                           :page-size="listQuery.pageSize"
                                           layout="total, sizes, prev, pager, next, jumper" :total="total">
                            </el-pagination>
                        </div>
                        <el-dialog title="新增报修地点" :visible.sync="dialogFormVisible" v-if="type==1">
                            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px"
                                     style="width:80%">
                                <el-form-item label="报修地点" prop="placeName">
                                    <el-input v-model.trim="ruleForm.placeName" :maxlength="30"></el-input>
                                </el-form-item>
                            </el-form>
                            <div slot="footer" class="dialog-footer">
                                <el-button @click="dialogFormVisible = false">取 消</el-button>
                                <el-button type="primary" @click="updateRepairAddress()">确 定</el-button>
                            </div>
                        </el-dialog>
                        <el-dialog title="编辑报修地点" :visible.sync="dialogFormVisible" v-if="type==2">
                            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px"
                                     style="width:80%">
                                <el-form-item label="报修地点" prop="placeName">
                                    <el-input v-model.trim="ruleForm.placeName" :maxlength="30"></el-input>
                                </el-form-item>
                            </el-form>
                            <div slot="footer" class="dialog-footer">
                                <el-button @click="dialogFormVisible = false">取 消</el-button>
                                <el-button type="primary" @click="updateRepairAddress()">确 定</el-button>
                            </div>
                        </el-dialog>
                    </div>
                </div>
            </div>
        </div>
    </div>

</template>
<script>
    import _ from 'lodash';
    import {
        addRepairPlace,
        updateRepairPlace,
        delRepairPlaceById,
        delRepairPlaceByIds,
        findRepairPlaceTreeList,
        findRepairPlaceListByModel
    } from '@/api/repairManage';
    import mixin from '@/mixins/windowResize';
    import BackTool from '@/components/BackTool';

    export default {
        watch: {
            filterText(val) {
                this.$refs.tree2.filter(val);
            }
        },
        data() {
            return {
                noback: this.$route.query.noback == 1,

                editadd: '',
                pId: 0,//请求pId
                Id: 0,//新增编辑的父亲的id
                mid: 0,
                filterText: '',//搜索 树结构
                data2: [],//树 数组
                sourceData: [],
                Name: '报修地点',
                defaultProps: {
                    children: 'children',
                    label: 'label'
                },
                list: null,
                total: null,
                listLoading: false,
                listQuery: {
                    pageNo: 1,
                    pageSize: 20,
                    searchTitle: '',
                    pId: 0,
                    Id: 0
                },
                tableKey: 10,
                selected: [],
                dialogFormVisible: false,// 用于显示弹出框
                ruleForm: {
                    placeName: '',
                },
                rules: {
                    placeName: [
                        {required: true, message: '请输入报修地点名称', trigger: 'blur'},
                        {max: 30, message: '长度在 30个字符以内', trigger: 'blur'}
                    ],
                },
                addressId: null,//编辑Id
                type: null,//区分是新增还是编辑
            };
        },
        components: {
            BackTool
        },

        created() {
            findRepairPlaceTreeList().then(res => {
                let data = res.data.data;
                let packageArray = [];
                this.sourceData = data;
                this.data2 = this.packageOrg(0, packageArray);
                this.getList();
            }).catch();
        },
        mixins: [mixin],
        filters: {
            formatTimeFilter(date) {
                return date.split(".")[0];
            }
        },
        methods: {
            findRepairPlaceTreelist() {
                findRepairPlaceTreeList().then(res => {
                    let data = res.data.data;
                    let packageArray = [];
                    this.sourceData = data;
                    let wid = this.Id;
                    this.data2 = this.packageOrg(0, packageArray);
                    this.Id = wid;
                }).catch();
            },
            deleteRepairAddress() {//删除父报修地点

                const vm = this;
                this.$confirm('是否确认要删除该报修地点？', '删除', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {

                    delRepairPlaceById(vm.Id).then(res => {
                        if (res.data.code === 200) {
                            this.$message.success("删除成功");
                            vm.listQuery.Id = vm.mid;
                            vm.listQuery.pId = 0;
                            vm.Name = '报修地点';
                            vm.Id = vm.mid;
                            vm.pId = 0;
                            vm.findRepairPlaceTreelist();
                            vm.getList();
                        } else {
                            this.$message.error(res.data.msg);
                        }

                    })
                }).catch(() => {
                });
            },
            orgNodeClick(data) {//点击树
                this.listQuery.Id = data.id;
                this.listQuery.pId = data.pId;
                this.Name = data.label;
                this.Id = data.id;
                this.pId = data.pId;
                this.getList();
                this.findRepairPlaceTreelist();
            },
            packageOrg(pId, packageArray) {//组装数据   
                const vm = this;
                let filterArray = this.sourceData.filter(function (item) {
                    return item.pId == pId;
                });
                filterArray.forEach(item => {
                    if (item.pId == 0 && vm.Id == 0) {
                        vm.listQuery.Id = item.id;
                        vm.Id = item.id;
                        vm.mid = item.id;
                    }
                    if (item.hasChild == 0) {
                        let childArray = [];
                        packageArray.push({
                            id: item.id,
                            pId: item.pId,
                            label: item.name,
                            children: vm.packageOrg(item.id, childArray)
                        });
                    } else {
                        packageArray.push({id: item.id, pId: item.pId, label: item.name});
                    }
                });
                return packageArray;
            },
            filterNode(value, data) {
                if (!value) return true;
                return data.label.indexOf(value) !== -1;
            },
            selectionChangeHandler(selection) {
                this.selected = selection;
            },
            //获取报修类型列表数据
            getList() {
                this.listLoading = true;
                findRepairPlaceListByModel(this.listQuery).then(res => {
                    let data = res.data.data;
                    this.list = data.dataList;
                    this.total = data.pagination.total;
                    this.listLoading = false;
                })
            },
            updateRepairAddress() {
                if (this.type == 1) {//新增
                    this.addRepairAddress();
                } else {
                    this.editRepairAddress();
                }
            },
            addShow() {//新增显示
                this.dialogFormVisible = true;
                this.type = 1;
                this.addressId = null;
                this.ruleForm.placeName = "";
            },
            editShow(id, name) {//报修显示
                this.dialogFormVisible = true;
                this.type = 2;
                this.addressId = id;
                this.ruleForm.placeName = name;
            },
            addRepairAddress() {//新增报修地点			       
                let _this = this;
                this.$refs.ruleForm.validate((valid) => {
                    if (valid) {
                        addRepairPlace(this.ruleForm.placeName, _this.Id).then(res => {
                            let data = res.data;
                            if (data.code === 200) {
                                this.$message.success("新增成功");
                                this.dialogFormVisible = false;
                                _this.getList();
                                _this.findRepairPlaceTreelist();
                                this.type = null;
                                this.ruleForm.placeName = "";
                            } else {
                                this.$message.warning(data.msg);
                                this.type = 1;
                            }
                            this.addressId = null;
                        })
                    }
                })
            },
            editRepairress() {//编辑父报修地点            
                this.dialogFormVisible = true;
                this.type = 2;
                this.addressId = this.Id;
                this.ruleForm.placeName = this.Name;

            },
            editRepairAddress() {//编辑报修地点
                let _this = this;
                let editQuery = {};
                editQuery.id = this.addressId;
                editQuery.placeName = this.ruleForm.placeName;

                this.$refs.ruleForm.validate((valid) => {
                    if (valid) {
                        updateRepairPlace(editQuery).then(res => {
                            let data = res.data;
                            if (data.code === 200) {
                                this.$message.success("修改成功");
                                this.type = null;
                                this.addressId = null;
                                this.dialogFormVisible = false;
                                _this.getList();
                                _this.findRepairPlaceTreelist();
                                if (editQuery.id == _this.Id) {
                                    _this.Name = _this.ruleForm.placeName;
                                }
                                this.ruleForm.placeName = "";
                            } else {
                                this.$message.warning(data.msg);
                            }
                        })
                    }
                });
            },

            //筛选
            handleInputChange: _.debounce(
                function (val) {
                    this.getList();
                },
                // 这是我们为用户停止输入等待的毫秒数
                300
            ),
            //当前页显示条目
            handleSizeChange(val) {
                this.listQuery.pageSize = val;
                this.getList();
            },
            //当前页
            handleCurrentChange(val) {
                this.listQuery.pageNo = val;
                this.getList();
            },
            //行内删除报修地点
            delRepairAddress(repairTypeIds) {
                const vm = this;
                this.$confirm('是否确认要删除该报修地点？', '删除', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {

                    delRepairPlaceById(repairTypeIds).then(res => {
                        if (res.data.code === 200) {
                            this.$message.success("删除成功");
                            vm.findRepairPlaceTreelist();
                            vm.getList();
                        } else {
                            this.$message.error(res.data.msg);
                        }

                    })
                }).catch(() => {
                });
            },
            //多选删除报修地点
            delRepairAddressSelected() {
                const vm = this;
                const delArr = [];
                if (this.selected.length > 0) {
                    this.$confirm('是否确认要删除选中的报修地点？', '删除', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        this.selected.forEach(item => {
                            delArr.push(item.id);
                        });
                        let repairAddressIds = delArr.join(",");
                        delRepairPlaceByIds(repairAddressIds).then(res => {
                            if (res.data.code === 200) {
                                this.$message.success("删除成功");
                                vm.findRepairPlaceTreelist();
                                vm.getList();
                                this.selected = [];
                            } else {
                                this.$message.error(res.data.msg);
                            }

                        })
                    }).catch(() => {
                    });

                } else {
                    this.$message.warning("请选择要删除的报修地点！");
                    this.listLoading = false;
                }
            },

        }

    }
</script>
<style>
.myinput .el-input__inner{
    border:none;
    border-bottom:1px solid #C0C4CC;
}
</style>

<style scoped="scoped">
    .menu-tools {
        padding-bottom: 10px;
    }
    .depart-title .el-icon-edit {
        font-size: 20px;
        margin: 0 20px;
    }

    .depart-title .el-icon-delete {
        font-size: 20px;
    }

    .el-icon-delete:hover {
        font-size: 20px;
        color: red;
    }

    .el-icon-edit:hover {
        margin: 0 20px;
        font-size: 20px;
        color: #20a0ff;
    }

    .searchButton {
        width: 180px;
        vertical-align: middle;
        margin-bottom: 10px;
        float: right;
        margin-right: 10px
    }

    .app-container {
        width: 100%;
        position: relative;
    }

    .org-tree {
        width: 200px;
        overflow-y: auto;
        position: absolute;
        left: 15px;
        top: 15px;
    }

    .org-panel {
        position: absolute;
        left: 215px;
        right: 15px;
         overflow: hidden;
    }

    .panel-box {
        border: 1px solid #d1dbe5;
        height: 100%;
    }

    .depart-title {
        color: #9D9D9D;
        font-size: 24px;
        margin: 9px 0;
        line-height: 40px;
        height: 40px;
    }

    .tools-btn {
        height: 30px;
    }

    .first-row .el-button {
        position: relative;
        top: 20px;
    }

    .tools-btn .el-button {
        margin-left: 0 !important;
    }

    .org-avatar {
        width: 25px;
        height: 25px;
        position: relative;
        top: 4px;

    }

    .gender {
        font-weight: bolder;
        font-size: 16px;

    }

    .class-hr {
        border: 0;
        border-top: 1px solid #eee;
    }

    .table-tools {
        padding-left: 20px;
    }

    .class-table {
        padding: 0 10px;
    }

    .search-input {
        width: 200px;
        float: right;
        margin-right: 10px;
    }

    .first-import-btn {
        position: relative;
        top: 20px;
    }

    .pagination-container {
        margin-top: 10px;
    }

</style>
<style scoped>
.app-container{
    padding: 15px;
}

    .is-current > .el-tree-node__content:nth-child(1) {
        background-color: #EEF1F6;
    }

    .org-tree input {
        border: 0 solid #fff;
        border-bottom: 1px solid #d1dbe5;
        border-radius: 4px 0 0 0;
    }

    .org-tree .el-tree {
        border: 0 solid #fff;
    }

    .org-tree {
        border: 1px solid #d1dbe5;
        border-right: 0 solid #fff;
    }

    .depart-code {
        font-size: 14px;
    }

    .org-panel .el-table__body-wrapper {
        overflow-x: auto !important; /*会将横行滚动条去掉，但如果有固定列的需求，请在代码里放开*/
    }

    .org-panel .address-list-bars {
        position: relative;
        top: 10px;
    }
</style>
