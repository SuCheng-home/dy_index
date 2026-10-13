<template>
    <div class="dormitoryInspectionindex">
        <div class="top">
            <el-button @click="$router.back()" type="default" size="medium">返回</el-button>
            <el-button  type="primary" @click="dormitoryInspectionadd()"  size="medium">添加检查组</el-button>
            <el-button  type="primary" @click="dormitoryInspectionitem()"  size="medium">检查项设置</el-button>
             <el-input class="search-input" style="width:20%;float: right;"  
                          placeholder="请输入检查组名称" icon="search" size="medium" @change="getGroupList()"
                          v-model.trim="listQuery.title">
                    <el-button slot="append" icon="el-icon-search" @click="getGroupList()"></el-button>
            </el-input>
        </div>
        <div class="main-wrap">
            <el-table stripe  :data="dataList" v-loading.body="listLoading" border style="width: 100%" :height="maxH">              
                 <el-table-column label="序号" align="center"  type="index" width="80"></el-table-column>
                <el-table-column align="center" label="检查组名称" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span  class="link-type"  @click="dormitoryInspectioninfo(scope.row.id)">{{scope.row.title}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="检查范围" show-overflow-tooltip>
                    <template slot-scope="scope">
                        {{ scope.row.checkScopeName }}
                        <!-- <span v-if="scope.row.checkType==1">宿舍</span>
                        <span v-else>住宿生</span> -->
                    </template>
                </el-table-column>
                <el-table-column align="center" label="评价方式" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span>{{scope.row.isStar==1?'打星':'打分'}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="操作" width="150">
                    <template slot-scope="scope">
                        <el-button size="small" type="text" @click="dormitoryInspectionedit(scope.row.id)">编辑</el-button>
                        <el-button size="small" type="text" @click="delGroup(scope.row.id)" class="buttontextred">删除</el-button>
                    </template>
                </el-table-column>

            </el-table>
            <div v-show="!listLoading" class="pagination-container">
                <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                               :current-page="listQuery.pageNo" :page-sizes="[10,20,30, 50]"
                               :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper"
                               :total="total">
                </el-pagination>
            </div>
        </div>
    </div>
</template>
<script>
    import mixin from '@/mixins/windowResize';
    import {getGroupList, delGroup} from '@/api/dormitoryInspection';
    export default {
        data() {
            return {
                listQuery: {
                    pageNo: 1,
                    pageSize: 20,
                    title:''
                },
                listLoading: false,
                dataList: [],
                total: null
            }
        },
        created() {
            this.getGroupList();
        },
        mixins: [mixin],
        methods: {  
            handleCurrentChange(val) {
                this.listQuery.pageNo = val;
                this.getGroupList();
            },
            handleSizeChange(val) {
                this.listQuery.pageSize = val;
                this.getGroupList();
            },
            dormitoryInspectionadd() {
                this.$router.push({
                    path: 'dormitoryInspectionadd',
                })
            },
            dormitoryInspectioninfo(id) {
                this.$router.push({
                    path: 'dormitoryInspectioninfo',
                     query: {
                        id: id
                    }
                })
            },
             dormitoryInspectionitem() {
                this.$router.push({
                    path: 'dormitoryInspectionitem',
                })
            },
            dormitoryInspectionedit(id) {
                this.$router.push({
                    path: 'dormitoryInspectionadd',
                    query: {
                        id: id
                    }
                })
            },
            delGroup(id) {
                let _this = this;
                this.$confirm('确认删除该检查组？', '提示', {
                    type: 'error'
                }).then(() => {
                    delGroup(id).then(res => {
                        let data = res.data;
                        if (data.code === 200) {
                            this.$message({
                                type: 'success',
                                message: '删除成功!'
                            });
                            this.getGroupList();
                        }
                    })
                })
                    .catch(() => {
                    });
            },
            getGroupList() {
                this.dataList = [];
                this.listLoading = true;
                getGroupList(this.listQuery).then(res => {
                    let data = res.data;
                    if (data.code === 200) {
                        this.dataList = data.data.dataList.map(i => {
                            i.checkScope = JSON.parse(i.checkScope || '[]');
                            i.checkScopeName = i.checkScope.map(item => item.dormName).join('，');
                            return i;
                        });
                        this.total = data.data.pagination.total;
                        this.listLoading = false;
                    }
                }).catch(() => {
                    this.listLoading = false;
                })
            }
        }
    }
</script>
<style scoped lang="scss">
.dormitoryInspectionindex {
    padding: 12px;
    .top{
        padding-bottom: 10px;
    }
    
}
</style>
