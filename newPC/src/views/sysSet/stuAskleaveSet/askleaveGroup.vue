<template>
    <div class="app-container calendar-list-container">
        <backtool>
            <el-button type="primary" size="medium" @click.native="loadAskleaveGroupAddAndUpdatePage">新建</el-button>
        </backtool>
        <el-table stripe :key='askleaveGroupTable' :data="list" v-loading.body="listLoading" border fit highlight-current-row
                  style="width: 100%" :height="maxH">
            <el-table-column align="center" label="序号" width="65">
                <template slot-scope="scope">
                    <span>{{(listQuery.pageNo-1)*listQuery.pageSize+scope.$index+1}}</span>
                </template>
            </el-table-column>
            <el-table-column min-width="100px" label="分组名称" show-overflow-tooltip>
                <template slot-scope="scope">
                    <span>{{scope.row.title}}</span>
                </template>
            </el-table-column>
            <el-table-column min-width="100px" label="负责人员" show-overflow-tooltip>
                <template slot-scope="scope">
                    <span><template
                            v-for="item in JSON.parse( scope.row.insUserJson)">&nbsp;&nbsp;{{item.name}}</template></span>
                </template>
            </el-table-column>
            <el-table-column min-width="100px" label="负责班级" show-overflow-tooltip>
                <template slot-scope="scope">
                    <span><template
                            v-for="item in JSON.parse( scope.row.classJson)">&nbsp;&nbsp;{{item.name}}</template></span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="操作" width="150">
                <template slot-scope="scope">
                    <el-button size="small" type="text" @click.native="editAskleaveGroup(scope.row)">编辑</el-button>
                    <el-button size="small" type="text" @click.native="delAskleaveGroup(scope.row.id)" class="buttontextred">删除</el-button>
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
</template>
<script>
    import Backtool from '@/components/BackTool';
    import {getStuAskleaveGroupList, deleAskleaveGroup} from '@/api/systemSet/StuLeave2Set';
    import mixin from '@/mixins/windowResize';

    export default {
        components: {
            Backtool
        },
        data() {
            return {
                askleaveGroupTable: 'askleaveGroupTable',
                list: null,
                total: null,
                listLoading: false,
                listQuery: {
                    pageNo: 1,
                    pageSize: 20,
                    searchTitle: ''
                }
            }
        },
        created() {
            this.getList();
        },
        mixins: [mixin],
        methods: {
            getList() {
                this.listLoading = true;
                let params = new URLSearchParams();
                params.append('pageNo', this.listQuery.pageNo);
                params.append('pageSize', this.listQuery.pageSize);
                params.append('searchTitle', this.listQuery.searchTitle);
                getStuAskleaveGroupList(params).then(res => {
                    this.list = res.data.data.dataList;
                    this.total = res.data.data.pagination.total;
                    this.listLoading = false;
                }).catch();
            },
            handleSizeChange(val) {
                this.listQuery.pageSize = val;
                this.getList();
            },
            handleCurrentChange(val) {
                this.listQuery.pageNo = val;
                this.getList();
            },
            delAskleaveGroup(id) {
                this.$confirm('此操作将永久删除此记录, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    deleAskleaveGroup(id).then(res => {
                        this.getList();
                        this.$message({
                            type: 'success',
                            message: '删除成功!',
                            onClose: function () {

                            }
                        });
                    }).catch();

                }).catch(() => {
                });
            },
            editAskleaveGroup(item) {
                this.$router.push({path: 'askleaveGroupAddAndUpdate', query: {groupId: item.id}})
            },
            loadAskleaveGroupAddAndUpdatePage() {//加载创建和编辑页面
                this.$router.push({path: 'askleaveGroupAddAndUpdate'});
            }
        }
    }
</script>
