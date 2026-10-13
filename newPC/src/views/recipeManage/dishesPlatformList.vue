<template>
    <div class="app-container">
        <el-row style="padding-bottom:10px">
            <el-col :span="19">
                <el-button class="filter-item" size="medium" @click="goBack">返回</el-button>
                <el-button class="filter-item" size="medium" type="primary" @click="showAddBox">添加菜品</el-button>
                <el-button class="filter-item" size="medium" type="primary" @click="toSchoolDiet">从系统库导入菜品</el-button>
                <el-button class="filter-item" size="medium" type="danger" @click="handleMultDelete">删除</el-button>
            </el-col>
            <el-col :span="5">
                <el-input size="medium" placeholder="请输入菜品名称" v-model.trim="listQuery.searchName"
                          @change="handleInputChange">
                    <el-button size="medium" slot="append" icon="el-icon-search" @click="handleInputChange"></el-button>
                </el-input>
            </el-col>
        </el-row>

        <el-table stripe :data="list" v-loading.body="listLoading" border fit highlight-current-row :height="maxH - 1"
                  @selection-change="handleSelectionChange" ref="mainTable">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column align="center" label="菜品">
                <template slot-scope="scope">
                    <span>{{scope.row.dietName}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="图片">
                <template slot-scope="scope">
            <span v-if="scope.row.dietLogo" class="link-type">
              <image-previewer :images="getViewPic(scope.row.dietLogo)" tag="img" text="预览"></image-previewer>
            </span>
                    <span v-else>--</span>
                </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip align="center" label="类型">
                <template slot-scope="scope">
                    <span>{{scope.row.dietTypeName}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="操作">
                <template slot-scope="scope">
                    <el-button size="small" type="text" :disabled="scope.row.isShow === 1"
                               @click="toAddDiet(scope.row)">编辑
                    </el-button>
                    <el-button size="small" type="text" @click="deleteDiet(scope.row.id)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <div v-show="!listLoading" class="pagination-container">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                           :current-page.sync="listQuery.pageNo" :page-sizes="[10,20,30, 50]"
                           :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper"
                           :total="total">
            </el-pagination>
        </div>

        <el-dialog title="添加菜品" :visible.sync="isShowAddBox" size="large">
            <el-form :model="recipeForm" :rules="rules" ref="recipeForm" label-width="80px">
                <el-form-item label="名称" prop="name">
                    <el-input v-model="recipeForm.name" :maxlength="30" placeholder="菜品名称（1-30个字符）"></el-input>
                </el-form-item>
                <el-form-item label="图片" class="pic" prop="picList">
                    <uploader :multiple="true" v-model="recipeForm.picList"
                              :extList="['jpeg', 'jpg', 'bmp', 'gif', 'png']"
                              showMode="cover" showResult="image" pathPrefix="shipuguanli" module="shipuguanli" moduleCode="1203" useSysBucket></uploader>
                </el-form-item>
                <el-form-item label="类型" prop="typeId">
                    <el-select v-model="recipeForm.typeId" placeholder="请选择类型">
                        <el-option :value="item.id" :label="item.value" v-for="item in foodTypeList"
                                   :key="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="描述" prop="remark">
                    <el-input type="textarea" v-model="recipeForm.remark" :maxlength="50"
                              placeholder="菜品描述（1-50个字符）"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="isShowAddBox = false">取 消</el-button>
                <el-button type="primary" @click.native="confirmRecipe">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import _ from 'lodash';
    import mixin from '@/mixins/windowResize';
    import ImagePreviewer from '@/components/ImagePreviewer/ImagePreviewer.vue';
    import Uploader from "@/components/Uploader/WebUploader";
    import {
        querySchoolDietListBySchoolId,
        insertSchoolDiet,
        updateSchoolDiet,
        deleteSchoolDiet
    } from '@/api/dishesPlatform';

    export default {
        name: "dishesPlatformList",
        components: {
            ImagePreviewer,
            Uploader
        },
        data() {
            return {
                dietId: '',
                loadConfirm: false,
                isShowAddBox: false,
                list: null,
                total: null,
                listLoading: true,
                listQuery: {
                    pageNo: 1,
                    pageSize: 20,
                    searchName: '',
                },
                multipleSelection: [],
                foodTypeList: [
                    {
                        id: 1,
                        value: '大荤'
                    },
                    {
                        id: 2,
                        value: '小荤'
                    },
                    {
                        id: 3,
                        value: '素菜'
                    },
                    {
                        id: 4,
                        value: '汤'
                    },
                    {
                        id: 5,
                        value: '水果'
                    },
                    {
                        id: 6,
                        value: '奶'
                    },
                    {
                        id: 7,
                        value: '杂粮'
                    },
                    {
                        id: 8,
                        value: '粥'
                    },
                    {
                        id: 9,
                        value: '主食'
                    },
                ],
                recipeForm: {
                    name: '',
                    picList: [],
                    typeId: 1,
                    remark: ''
                },
                rules: {
                    name: [
                        {required: true, message: "请输入菜品名称", trigger: "blur"},
                        {min: 1, max: 10, message: "长度在 1 到 10 个字符", trigger: "blur"}
                    ],
                    picList: [
                        {required: true, message: "请选择图片", trigger: "change"}
                    ],
                    typeId: [
                        {required: true, message: "请选择类型", trigger: "change"}
                    ],
                    remark: [
                        {required: true, message: "请输入菜品描述", trigger: "change"},
                        {min: 1, max: 50, message: "长度在 1 到 50 个字符", trigger: "blur"}
                    ]
                }
            }
        },
        mixins: [mixin],
        created() {
            this.getRecipeList();
        },
        methods: {
            goBack() {
                this.$router.back();
            },
            toSchoolDiet() {
                this.$router.push({path: 'schoolList'});
            },
            showAddBox() {
                this.dietId = '';
                this.recipeForm = {
                    name: '',
                    picList: [],
                    typeId: 1,
                    remark: ''
                };
                this.isShowAddBox = true;
            },
            toAddDiet(dietItem) {
                this.dietId = dietItem.id;
                this.recipeForm = {
                    name: dietItem.dietName,
                    picList: [{fileUrl: dietItem.dietLogo}],
                    typeId: dietItem.dietType,
                    remark: dietItem.dietDes
                };
                this.isShowAddBox = true;
            },
            deleteDiet(id) {
                this.$confirm('确定要删除吗？', '提示', {
                    type: 'warning'
                }).then(() => {
                    deleteSchoolDiet({dietIds: id}).then(res => {
                        if (res.data.code === 200) {
                            this.$message({
                                type: 'success',
                                message: '删除成功!'
                            });
                        }
                        this.getRecipeList();
                    }).catch(function (error) {
                    });
                }).catch(() => {
                });
            },
            confirmRecipe() {
                this.$refs['recipeForm'].validate((valid) => {
                    if (valid) {
                        let query = {
                            dietDes: this.recipeForm.remark,
                            dietLogo: this.recipeForm.picList[0].fileUrl,
                            dietName: this.recipeForm.name,
                            dietType: this.recipeForm.typeId,
                            dietTypeName: this.getTypeName(this.recipeForm.typeId)
                        };
                        if (this.dietId) {
                            query.id = this.dietId;
                            this.updateSchoolDiet(query);
                        } else {
                            this.insertSchoolDiet(query);
                        }
                    }
                });
            },
            getTypeName(typeId) {
                let typeName = '';
                this.foodTypeList.forEach((item) => {
                    if (item.id === typeId) {
                        typeName = item.value
                    }
                });
                return typeName;
            },
            insertSchoolDiet(query) {
                if (this.loadConfirm) {
                    return;
                }
                this.loadConfirm = true;
                insertSchoolDiet(query).then(res => {
                    const data = res.data;
                    if (data.code === 200) {
                        this.$message.success('保存成功');
                        this.getRecipeList();
                        this.isShowAddBox = false;
                    } else {
                        this.$message.error(data.msg);
                    }
                    this.loadConfirm = false;
                }).catch(() => {
                    this.loadConfirm = false;
                });
            },
            updateSchoolDiet(query) {
                if (this.loadConfirm) {
                    return;
                }
                this.loadConfirm = true;
                updateSchoolDiet(query).then(res => {
                    const data = res.data;
                    if (data.code === 200) {
                        this.$message.success('保存成功');
                        this.getRecipeList();
                        this.isShowAddBox = false;
                    } else {
                        this.$message.error(data.msg);
                    }
                    this.loadConfirm = false;
                }).catch(() => {
                    this.loadConfirm = false;
                });
            },
            handleMultDelete() {
                if (!this.multipleSelection.length) {
                    this.$message({
                        message: '请选择要删除的菜品',
                        type: 'warning'
                    });
                } else {
                    this.$confirm('确定要删除吗？', '提示', {
                        type: 'warning'
                    }).then(() => {
                        let arr = this.multipleSelection.map(obj => {
                            return obj.id
                        });
                        deleteSchoolDiet({dietIds: arr.toString()}).then(res => {
                            if (res.data.code === 200) {
                                this.$message({
                                    type: 'success',
                                    message: '删除成功!'
                                });
                            }
                            this.getRecipeList();
                        }).catch(function (error) {
                        });
                    }).catch(() => {
                    });
                }
            },
            handleSelectChange() {
                this.getRecipeList()
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            handleInputChange: _.throttle(
                function () {
                    this.getRecipeList()
                },
                1000
            ),
            getRecipeList() {
                this.listLoading = true;
                querySchoolDietListBySchoolId(this.listQuery).then(res => {
                    this.list = res.data.data.dataList;
                    if (this.list.length === 0 && this.listQuery.pageNo !== 1) {
                        this.listQuery.pageNo--;
                        this.getRecipeList();
                    }
                    this.total = res.data.data.pagination.total;
                    this.listLoading = false;

                })
            },
            handleSizeChange(val) {
                this.listQuery.pageSize = val;
                this.getRecipeList();
            },
            handleCurrentChange(val) {
                this.listQuery.pageNo = val;
                this.getRecipeList();
            },
            getViewPic(picUrl) {
                return [{'src': picUrl}];
            }
        }
    }
</script>
<style rel="stylesheet/scss" lang="scss">
    .redColor {
        color: red;
    }

    .recipe_img_wrapper img {
        width: 200px;
    }
</style>
