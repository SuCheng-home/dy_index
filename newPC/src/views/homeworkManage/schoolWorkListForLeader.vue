<template>
    <div class="app-container">

        <div class="">
            <el-row style="padding-bottom:20px">
                <el-col :span="19">
                     <el-select size="medium" v-model="listQuery.schoolTimeId" @change="handleInputChange()" placeholder="请选择学期">
                        <el-option   v-for="item in termList"  :key="item.id"  :label="item.schoolTimeName"   :value="item.id"></el-option>
                    </el-select>
                    <router-link :to="{ path: 'addOrEditHomework'}">
                        <el-button class="filter-item" type="primary" icon="plus">布置作业</el-button>
                    </router-link>
                    <el-button class="filter-item" type="primary" icon="delete" @click="handleMultDelete">删除
                    </el-button>
                </el-col>
                <el-col :span="5">
                    <el-input placeholder="搜索名称" icon="el-icon-search" v-model="listQuery.searchTitle"
                              @change="handleInputChange" :on-icon-click="handleInputChange">
                    </el-input>
                </el-col>
            </el-row>

            <el-table stripe :default-sort="{prop: 'pageviews', order: 'descending'}" :data="list" v-loading.body="listLoading"
                      border fit highlight-current-row max-height="620" @selection-change="handleSelectionChange"
                      ref="mainTable">
                <el-table-column type="selection" width="55" :selectable="selectable"></el-table-column>
                <el-table-column prop="title" align="center" label="名称">
                    <template slot-scope="scope">
                        <router-link :to="{ path: 'homeworkDetail',query:{id:scope.row.id}}">
                            <span class="link-type">{{scope.row.title}}</span>
                        </router-link>
                    </template>
                </el-table-column>
                <el-table-column show-overflow-tooltip label="班级">
                    <template slot-scope="scope">
                        <span>{{scope.row.className}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="releaseDateTime" align="center" label="发布时间">
                    <template slot-scope="scope">
                        <span>{{scope.row.releaseDateTime|formatTime}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="status" align="center" label="状态">
                    <template slot-scope="scope">
                        <el-tag  size="mini" :type="scope.row.homeworkState === 1?'success':'gray'">
                            {{scope.row.homeworkState|statusMap}}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column align="left" label="操作" width="150">
                    <template slot-scope="scope">
                        <router-link :to="{ path: 'addOrEditHomework',query:{id:scope.row.id}}">
                            <el-button v-if="scope.row.homeworkState === 1" size="small" type="text">编辑</el-button>
                        </router-link>
                        <el-button v-if="scope.row.homeworkState === 1" size="small" type="text"
                                   @click="handleDelete(scope.row)">删除
                        </el-button>
                        <el-button v-if="scope.row.homeworkState === 2" size="small" type="text"
                                   @click="handleDelete(scope.row)">复制
                        </el-button>
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
    import {getHomeworkList, delHomework,getSchoolTimeAllList} from '@/api/homework';
    import {formatTime} from '@/filters'

    const statusMap = {
        1: "未发布",
        2: "已发布",
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
                recipeDefialVisible: false,
                activeRecipe: {
                    createUser: '',
                    createDate: '',
                    recipeType: '',
                    count: '',
                    attachList: [],
                    content: ''
                },
                 termList:[]
            }
        },
        created() {
            this.listQuery.pageNo = this.$store.state.app.homework.pageNo;
            this.listQuery.pageSize = this.$store.state.app.homework.pageSize;
            getSchoolTimeAllList()
                .then(res => res.data)
                .then(data => {
                    this.termList = data.data;
                    if (data.data.length !== 0) {
                        this.listQuery.schoolTimeId = data.data.find(item => item.isCurrent === 1).id;
                        this.getHomeworkList();
                    }
                });
        },
        filters: {
            statusMap(type) {
                return statusMap[type]
            }
        },
        methods: {
            selectable(row) {
                // 判断复选框是否可选
                return row.homeworkState === 1;
            },

            handleEdit(val) {
                this.$router.push({path: 'recipeAdd', query: val});
            },
            handleMultDelete() {
                if (!this.multipleSelection.length) {
                    this.$message({
                        message: '请选择要删除的作业',
                        type: 'warning'
                    });
                } else {
                    this.$confirm('确定要删除吗？', '提示', {
                        type: 'error'
                    }).then(() => {
                        let arr = this.multipleSelection.map(obj => {
                            return obj.id
                        });
                        delHomework(arr.toString(),sessionStorage.getItem("homeworkschoolTimeId")).then(() => {
                            this.getHomeworkList();
                            this.$message({
                                type: 'success',
                                message: '删除成功!'
                            });

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
                    delHomework(val.id,sessionStorage.getItem("homeworkschoolTimeId")).then(() => {
                        this.getHomeworkList();
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });

                    }).catch(function (error) {
                    });

                }).catch(() => {
                });

            },
            handleSelectChange() {
                this.getHomeworkList()
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            handleInputChange: _.debounce(
                function () {
                    this.getHomeworkList()
                },
                // 这是我们为用户停止输入等待的毫秒数
                1000
            ),
            getHomeworkList() {
                this.listLoading = true;
                sessionStorage.setItem("homeworkschoolTimeId", this.listQuery.schoolTimeId);
                getHomeworkList(this.listQuery).then(res => {
                    this.list = res.data.data.dataList;
                    this.total = res.data.data.pagination.total;
                    this.listLoading = false;
                }).catch(function (error) {
                });
            },
            handleSizeChange(val) {
                this.listQuery.pageSize = val;
                this.$store.commit("HOMEWORK_PAGE_CHANGE", this.listQuery);
                this.getHomeworkList();
            },
            handleCurrentChange(val) {
                this.listQuery.pageNo = val;
                this.$store.commit("HOMEWORK_PAGE_CHANGE", this.listQuery);
                this.getHomeworkList();
            }
        }
    }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
    .redColor {
        color: red;
    }

    .recipe_img_wrapper img {
        width: 200px;
    }
</style>
