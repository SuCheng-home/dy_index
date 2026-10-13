<template>
    <div class="app-container">

        <div class="">
            <el-row style="padding-bottom:10px">
                <el-col :span="19">
                     <el-select size="medium" v-model="listQuery.schoolTimeId" placeholder="请选择学期" @change="handleInputChange()">
                <el-option v-for="item in schoolYearList" :key="item.id" :label="item.schoolTimeName"
                           :value="item.id"></el-option>
            </el-select>
                    <router-link :to="{ path: 'recipeAdd'}">
                        <el-button class="filter-item" size="medium" type="primary">新建</el-button>
                    </router-link>
                    <el-button class="filter-item" size="medium" type="danger" @click="handleMultDelete">删除</el-button>
                   
                </el-col>
                <el-col :span="5">
                     <el-input size="medium"  placeholder="搜索名称" v-model.trim="listQuery.searchTitle" @change="handleInputChange">
                        <el-button size="medium" slot="append" icon="el-icon-search" @click="handleInputChange"></el-button>
                    </el-input>
                    </el-col>
            </el-row>

            <el-table stripe :data="list" v-loading.body="listLoading" border fit highlight-current-row :height="maxH"
                      @selection-change="handleSelectionChange" ref="mainTable">
                <el-table-column type="selection" width="55"></el-table-column>
                <el-table-column prop="title" align="center" label="名称">
                    <template slot-scope="scope">
                        <span class="link-type" @click="showDetailDialog(scope.row)">{{scope.row.title}}</span>
                    </template>
                </el-table-column>
                <el-table-column show-overflow-tooltip label="类型">
                    <template slot-scope="scope">
                        <span>{{scope.row.recipeType | statusFilter}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="createUser" align="center" label="发布人">
                    <template slot-scope="scope">
                        <span>{{scope.row.updateUser ? scope.row.updateUser : scope.row.createUser}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="createDate" align="center" label="创建时间">
                    <template slot-scope="scope">
                        <span>{{scope.row.createDate|formatTime}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="status" align="center" label="状态">
                    <template slot-scope="scope">                        
                        <span v-if="scope.row.timed ==0">
                            <el-tag  size="mini" v-if="scope.row.isShow ==0" type="info">草稿</el-tag>
                            <el-tag  size="mini" v-if="scope.row.isShow ==1" type="success">已发布</el-tag>
                        </span>
                        <span v-else>
                            <el-tag  size="mini" v-if="scope.row.isShow ==0" type="info">草稿</el-tag>
                            <el-tag  size="mini" v-if="scope.row.isShow ==1&&((new Date().getTime()<new Date(scope.row.timeDate).getTime()))">发布中</el-tag>
                            <el-tag  size="mini" v-if="scope.row.isShow ==1&&((new Date().getTime()>new Date(scope.row.timeDate).getTime()))" type="success">已发布</el-tag>
                        </span>
                    </template>
                </el-table-column>
                <el-table-column align="left" label="操作" width="150">
                    <template slot-scope="scope">

                        <el-button :disabled="scope.row.isShow === 1" size="small" type="text"
                                   @click="handleEdit(scope.row)">编辑
                        </el-button>

                        <el-button size="small" type="text" @click="handleDelete(scope.row)" class="buttontextred">删除</el-button>
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
        </div>
    </div>
</template>

<script>
    import _ from 'lodash';
    import {recipeList, deleteRecipe} from '@/api/recipe';
    import {getSchoolTimeAllList} from '@/api/classroomEvaluation';
    import {formatTime} from '@/filters'
    import mixin from '@/mixins/windowResize'

    const recipeTypeMap = {
        1: "公共",
        2: "教师",
        3: "学生"
    };
    const statusMap = {
        0: "未发布",
        1: "已发布",
    };
    export default {
        name: "group",
        data: function () {
            return {
                list: null,
                total: null,
                listLoading: true,
                listQuery: {
                    pageNo: null,
                    pageSize: null,
                    searchTitle: '',
                    schoolTimeId:""
                },
                multipleSelection: [],
                activeRecipe: {
                    createUser: '',
                    createDate: '',
                    recipeType: '',
                    count: '',
                    attachList: [],
                    content: ''
                },
                schoolYearList:[]
            }
        },
        mixins: [mixin],
        created() {            
            localStorage.setItem("shipuimgnum", 0);//清除成长册缓存
            this.listQuery.pageNo = this.$store.state.app.recipePage.recipePageNo;
            this.listQuery.pageSize = this.$store.state.app.recipePage.recipePageSize;
            //学期列表
            getSchoolTimeAllList().then(res => res.data)
                .then(data => {
                    if (data.code === 200) {
                        this.schoolYearList=data.data;
                        data.data.forEach(item => {
                            if (item.isCurrent == 1) {                                
                                 this.listQuery.schoolTimeId = item.id;
                                this.getRecipeList();
                            }
                        })
                    }
                })
           
        },
        filters: {
            statusFilter(type) {
                return recipeTypeMap[type]
            },
            statusMap(type) {
                return statusMap[type]
            }
        },
        methods: {
            handleEdit(val) {
                this.$router.push({
                    path: 'recipeAdd',
                    query: {
                        recipeId: val.id
                    }
                });
            },
            showDetailDialog(val) {
                this.$router.push({
                    path: 'recipeDetail',
                    query: {
                        recipeId: val.id
                    }
                });

            },
            handleMultDelete() {
                if (!this.multipleSelection.length) {
                    this.$message({
                        message: '请选择要删除的食谱',
                        type: 'warning'
                    });
                } else {
                    this.$confirm('确定要删除吗？', '提示', {
                        type: 'error'
                    }).then(() => {
                        let arr = this.multipleSelection.map(obj => {
                            return obj.id
                        });
                        deleteRecipe(arr.toString()).then(res => {
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
            handleDelete(val) {
                this.$confirm('确定要删除吗？', '提示', {
                    type: 'error'
                }).then(() => {
                    deleteRecipe(val.id).then(res => {
                        if (res.data.code === 200) {
                            this.$message({
                                type: 'success',
                                message: '删除成功!'
                            });
                        }
                        this.getRecipeList();

                    }).catch(function () {
                    });
                }).catch(() => {
                });
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
                recipeList(this.listQuery).then(res => {
                    this.list = res.data.data.dataList;
                    if(this.list.length==0&&this.listQuery.pageNo!==1){
                        this.listQuery.pageNo--;
                        this.getRecipeList();
                    }
                    this.total = res.data.data.pagination.total;
                    this.listLoading = false;

                })
            },
            handleSizeChange(val) {
                this.listQuery.pageSize = val;
                this.$store.commit("RECIPE_PAGE_CHANGE", this.listQuery);
                this.getRecipeList();
            },
            handleCurrentChange(val) {
                this.listQuery.pageNo = val;
                this.$store.commit("RECIPE_PAGE_CHANGE", this.listQuery);
                this.getRecipeList();
            },
            htmlDecode(str) {
                let s = "";
                if (str.length === 0) {
                    return "";
                }
                s = str.replace(/&amp;/g, "&");
                s = s.replace(/&lt;/g, "<");
                s = s.replace(/&gt;/g, ">");
                s = s.replace(/&nbsp;/g, " ");
                s = s.replace(/&#39;/g, "\'");
                s = s.replace(/&quot;/g, "\"");
                s = s.replace(/<br>/g, "\n");
                return s;
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
