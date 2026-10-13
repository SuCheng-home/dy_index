<template>
    <div class="app-container">

        <div class="">
            <el-row style="padding-bottom:10px">
                <el-col :span="19">
                    <el-select size="medium" v-model="listQuery.schoolTimeId" @change="handleInputChange()" placeholder="请选择学期">
                        <el-option   v-for="item in termList"  :key="item.id"  :label="item.schoolTimeName"   :value="item.id"></el-option>
                    </el-select>
                    <router-link :to="{ path: 'addOrEditHomework'}">
                        <el-button class="filter-item" type="primary" size="medium">布置作业</el-button>
                    </router-link>
                    <el-button class="filter-item" size="medium" type="primary" @click="$router.push({path:'homeworkStatis'})" v-if="isShowByPermission('/homework/homeworkStatics')">作业统计</el-button>
                    <el-button class="filter-item" type="danger" @click="handleMultDelete" size="medium">删除</el-button>
                </el-col>
                <el-col :span="5">
                     <el-input placeholder="搜索名称" size="medium" v-model="listQuery.searchTitle" class="search-input"     @change="handleInputChange">
                      <el-button slot="append" icon="el-icon-search" @click="handleInputChange" ></el-button>
                    </el-input>
                </el-col>
            </el-row>

            <el-table stripe :data="list" v-loading.body="listLoading" border fit highlight-current-row
                      @selection-change="handleSelectionChange" ref="mainTable" :height="maxH">
                <el-table-column type="selection" width="55" ></el-table-column>
                <el-table-column prop="title" label="名称"  width="150">
                    <template slot-scope="scope">
                        <router-link :to="{ path: 'homeworkDetail',query:{id:scope.row.id}}">
                            <span class="link-type">{{scope.row.title}}作业</span>
                        </router-link>
                    </template>
                </el-table-column>
                <el-table-column show-overflow-tooltip label="班级/学生">
                    <template slot-scope="scope">
                        <span>{{!scope.row.className? scope.row.stuNames:scope.row.className}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="releaseDateTime" align="center" width="130" label="发布时间">
                    <template slot-scope="scope">
                        <span>{{!scope.row.releaseDateTime ? "暂未发布" : scope.row.releaseDateTime|formatTimeMap}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="status" align="center" label="状态" width="80">
                    <template slot-scope="scope">
                        <el-tag  size="mini" :type="scope.row.homeworkState === 1?'gray':'success'">
                            {{scope.row.homeworkState|statusMap}}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="readCount" align="center" label="已读人数" width="80">
                    <template slot-scope="scope">
                        <span v-if="scope.row.readCount === 0">{{scope.row.readCount}}</span>
                        <span v-else class="link-type"
                              @click="jumpToList(scope.row.id, 0)">{{scope.row.readCount}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="unReadCount" align="center" label="未读人数" width="80">
                    <template slot-scope="scope">
                        <span v-if="scope.row.homeworkState !== 2">0</span>
                        <span v-else>
                              <span v-if="scope.row.unReadCount === 0">{{scope.row.unReadCount}}</span>
                        <span v-else class="link-type"
                              @click="jumpToList(scope.row.id, 2)">{{scope.row.unReadCount}}</span>
                        </span>

                    </template>
                </el-table-column>
                <el-table-column prop="finishCount" align="center" label="提交人数" width="80">
                    <template slot-scope="scope">
                        <span v-if="scope.row.finishCount === 0">{{scope.row.finishCount}}</span>
                        <span  v-else class="link-type">
                            <a
                              href="javascript:" @click="homeworkFinishHandle(scope.row,1)"
                                >
                                {{scope.row.finishCount}}
                            </a>
                        </span>
                    </template>
                </el-table-column>
                <el-table-column prop="unfinishCount" align="center" label="未提交人数" width="96">
                    <template slot-scope="scope">
                        <span>{{scope.row.unfinishCount}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="replyCount" align="center" label="回复条数" width="80">
                    <template slot-scope="scope">
                        <span v-if="scope.row.homeworkState === 1">{{scope.row.replyCount}}</span>
                        <span v-else class="link-type"
                              @click="jumpToList(scope.row.id, 1)">{{scope.row.replyCount}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="left" label="操作" width="100">
                    <template slot-scope="scope">
                        <router-link :to="{ path: 'addOrEditHomework',query:{id:scope.row.id,isCopy:false}}">
                            <el-button v-if="scope.row.homeworkState !== 2" size="small" type="text">编辑</el-button>
                        </router-link>

                        <router-link :to="{ path: 'addOrEditHomework',query:{id:scope.row.id,isCopy:true}}">
                            <el-button v-if="scope.row.homeworkState !== 1" size="small" type="text">复制</el-button>
                        </router-link>
                        <el-button  size="small" type="text"
                                   @click="handleDelete(scope.row)" class="buttontextred">删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>

            <div v-show="!listLoading" class="pagination-container">
                <el-pagination
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page.sync="listQuery.pageNo"
                        :page-sizes="[10,20,30, 50]"
                        :page-size="listQuery.pageSize"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="total"
                >
                </el-pagination>
            </div>
        </div>
    </div>
</template>

<script>
    import {getHomeworkList, delHomework,getHomeworkById,getSchoolTimeAllList} from '@/api/homework';
    import {isShowByPermission} from "@/utils";
    import mixin from '@/mixins/windowResize'

    const statusMap = {
        1: "草稿",
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
                sendClass:[],
                termList:[]
            }
        },
        mixins: [mixin],
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
            },
            formatTimeMap(type) {
                if (type.indexOf("-") === -1) {
                    return "暂未发布"
                } else {
                    return type.substring(0,10)
                }

            }
        },
        methods: {
            isShowByPermission,
            homeworkFinishHandle(homework,type){
                getHomeworkById({
                    homeworkId: homework.id
                },sessionStorage.getItem("homeworkschoolTimeId"))
                    .then(res => res.data)
                    .then(data => {
                        this.sendClass = data.data.departs;
                        if(homework.publishType===0&&homework.walkClassIds.length==0&&this.sendClass&&this.sendClass.length!==1){
                            this.$router.push({
                                path:'homeworkClassList',
                                query:{
                                    type: type,
                                    homeworkId: homework.id
                                }
                            })
                        }else{
                            this.$router.push({
                                path:'homeworkManageFinishList',
                                query:{
                                    type: type,
                                    homeworkId: homework.id
                                }
                            })
                        }
                    }).catch(()=>{
                        this.$message({
                            message: data.msg,
                            type: 'warning'
                        });
                    })
            },
            jumpToList(id, type) {
                this.$router.push({
                    path: 'homeworkManageReplyList',
                    query: {
                        homeworkId: id,
                        type
                    }
                });
            },
            // selectable(row) {
            //     // 判断复选框是否可选
            //     return row.homeworkState === 1;
            // },

            handleEdit(val) {
                this.$router.push({path: 'recipeAdd', query: val})
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
                        delHomework(arr.toString(),sessionStorage.getItem("homeworkschoolTimeId")).then(res => {
                            if (res.data.code === 200) {
                                this.$message({
                                    type: 'success',
                                    message: '删除成功!'
                                });
                            }
                            this.getHomeworkList();
                        })
                    }).catch(() => {
                    });
                }
            },
            handleDelete(val) {
                this.$confirm('确定要删除吗？', '提示', {
                    type: 'error'
                }).then(() => {
                    delHomework(val.id,sessionStorage.getItem("homeworkschoolTimeId")).then(res => {
                        if (res.data.code === 200) {
                            this.$message({
                                type: 'success',
                                message: '删除成功!'
                            });
                        }
                        this.getHomeworkList();
                    })
                }).catch(() => {
                });

            },
            handleSelectChange() {
                this.getHomeworkList()
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            handleInputChange(){
                  this.listQuery.searchTitle = this.listQuery.searchTitle.trim();
                    this.getHomeworkList();
            },
            getHomeworkList() {
                this.listLoading = true;
                sessionStorage.setItem("homeworkschoolTimeId", this.listQuery.schoolTimeId);
                getHomeworkList(this.listQuery).then(res => {
                    this.list = res.data.data.dataList;
                    this.total = res.data.data.pagination.total;
                    this.listLoading = false;
                })
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
<style lang="scss" scoped>
    .redColor {
        color: red;
    }
    .recipe_img_wrapper img {
        width: 200px;
    }
</style>
