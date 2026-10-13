<template>
    <div class="app-container ">
        <div class="filter-container">
            <el-col :span="19">
                <el-button type="primary" size="medium" @click="dietaryManagementadd()">新增食谱</el-button>
                <el-button type="primary" size="medium" @click="dietaryManagementexpertindex()">专家食谱</el-button>
                <el-button type="primary" size="medium" @click="foodbankindex()">菜品库</el-button>
                <el-button type="primary" size="medium" @click="downLoadHreffun()">导出选中食谱</el-button>                
                <el-button type="primary" size="medium" @click="dietaryManagementApproval()">审核人设置</el-button>
                <el-button type="danger" size="medium" @click="deleteSchoolMenuss()">删除</el-button>
            </el-col>
            <el-col :span="5">
                <el-input size="medium" placeholder="请输入食谱名称" v-model.trim="listQuery.searchName"
                          @change="handleFilter">
                    <el-button size="medium" slot="append" icon="el-icon-search" @click="handleFilter"></el-button>
                </el-input>
            </el-col>
        </div>
        <el-table stripe :data="dataList" :height="`${maxH}px`" border style="width: 100%"
                  @select="handleSelectionChange" @select-all="handleSelectionChange">
            <el-table-column type="selection" align="center" width="65px" :resizable="false"></el-table-column>
            <el-table-column label="标题" show-overflow-tooltip>
                <template slot-scope="scope">
                    <span class="link-type" @click="dietaryManagementdetails(scope.row.id)">{{scope.row.name}}</span>
                </template>
            </el-table-column>
            <el-table-column label="创建人" align="center" width="120">
                <template slot-scope="scope">
                    {{scope.row.createUserName}}
                </template>
            </el-table-column>
            <el-table-column label="展示时间" align="center">
                <template slot-scope="scope">
                    {{scope.row.weekMonday}}--{{scope.row.weekSunday}}
                </template>
            </el-table-column>
            <el-table-column label="状态" align="center" width="120">
                <template slot-scope="scope">
                    <el-tag  size="mini" v-if="scope.row.showMenu==0" type="info">未发布</el-tag>
                    <el-tag  size="mini" v-if="scope.row.showMenu==1" type="success">已发布</el-tag>
                    <el-tag  size="mini" v-if="scope.row.showMenu==2" type="warning">待审核</el-tag>
                    <el-tag  size="mini" v-if="scope.row.showMenu==3" type="danger">驳回</el-tag>
                </template>
            </el-table-column>
            <el-table-column label="操作" align="center" width="120">
                <template slot-scope="scope">
                    <el-button @click.native.prevent="dietaryManagementcopyadd(scope.row.id)" type="text" size="small">
                        复制
                    </el-button>
                    <el-button @click.native.prevent="deleteSchoolMenus(scope.row.id)" type="text" size="small" class="buttontextred">删除
                    </el-button>
                    <el-button @click.native.prevent="dietaryManagementeidt(scope.row.id)" type="text" size="small">编辑
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
            class="pagination-container"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page.sync="listQuery.pageNo"
            :page-sizes="[10, 20, 30, 50]"
            :page-size="listQuery.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
        </el-pagination>
    </div>
</template>
<script>
    import {querySchoolMenu, deleteSchoolMenu} from '@/api/dietaryManagement';
    import mixin from '@/mixins/windowResize';

    export default {
        data() {
            return {
                listQuery: {
                    pageNo: 1,
                    pageSize: 20,
                    searchName: ''
                },
                dataList: [],
                selected: [],
                total: null,
                menuIds: '',
                downLoadHref: '',
                urlLoading: true,
            }
        },
        created() {
            this.querySchoolMenus();
        },
        mixins: [mixin],
        methods: {
            //获取选中
            handleSelectionChange(val) {
                this.selected = val;
                this.menuIds = '';
                for (let i = 0; i < this.selected.length; i++) {
                    if (i < this.selected.length - 1) {
                        this.menuIds += this.selected[i].id + ',';
                    } else {
                        this.menuIds += this.selected[i].id;
                    }
                }
                ;
                if (this.selected.length == 0) {
                    this.urlLoading = true;
                } else {
                    this.urlLoading = false;
                }
                this.downLoadHref = global.BasePath + "structure/dietary/export?menuIds=" + this.menuIds + "&token=" + this.$store.getters.token;
            },
            //下载图片
            downLoadHreffun() {
                if (this.selected.length == 0) {
                    this.$message({type: 'error', message: '请选择需要导出的食谱!'});
                    return;
                }
                ;
                window.open(this.downLoadHref, '_blank')
            },
            //删除多条
            deleteSchoolMenuss() {
                if (this.selected.length == 0) {
                    this.$message({type: 'error', message: '请选择需要删除的食谱!'});
                    return;
                }
                ;
                this.$confirm('此操作将永久删除所选食谱, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    deleteSchoolMenu(this.menuIds).then(res => {
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                        this.querySchoolMenus();
                    }).catch();

                }).catch(() => {
                });
            },
            //删除单条
            deleteSchoolMenus(id) {
                this.$confirm('此操作将永久删除此食谱, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    deleteSchoolMenu(id).then(res => {
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                        this.querySchoolMenus();
                    }).catch();

                }).catch(() => {
                });
            },
            //获取列表          
            querySchoolMenus() {
                querySchoolMenu(this.listQuery)
                    .then(res => res.data)
                    .then(data => {
                        this.dataList = data.data.dataList;
                        this.total = data.data.pagination.total;
                    }).catch(err => {
                })
            },
            //搜索
            handleFilter() {
                this.listQuery.pageNo = 1;
                this.querySchoolMenus();
            },
            //切换码数          
            handleSizeChange(val) {
                this.listQuery.pageNo = 1;
                this.listQuery.pageSize = val;
                this.querySchoolMenus();
            },
            //切换页数
            handleCurrentChange(val) {
                this.listQuery.pageNo = val;
                this.querySchoolMenus();
            },
            //专家食谱
            dietaryManagementexpertindex() {
                this.$router.push({
                    path: "dietaryManagementexpertindex"
                });
            },
            //审核人设置
            dietaryManagementApproval() {
                this.$router.push({
                    path: "dietaryManagementApproval"
                });
            },
            //菜品库   
            foodbankindex() {
                this.$router.push({
                    path: "foodbankindex",
                    query: {mynum: 1}
                });
            },
            //新增   
            dietaryManagementadd() {
                this.$router.push({
                    path: "dietaryManagementadd"
                });
            },
            //详情   
            dietaryManagementdetails(id) {
                this.$router.push({
                    path: "dietaryManagementdetails",
                    query: {id: id}
                });
            },
            //编辑   
            dietaryManagementeidt(id) {
                this.$router.push({
                    path: "dietaryManagementeidt",
                    query: {id: id}
                });
            },
            //复制
            dietaryManagementcopyadd(id) {
                this.$router.push({
                    path: "dietaryManagementcopyadd",
                    query: {id: id}
                });
            },
        }
    }
</script>
<style lang="scss" scoped>
    .pagination-container {
        margin-top: 10px;
    }

    .filter-container {
        padding-bottom: 10px;
        overflow: hidden;
    }
</style>
