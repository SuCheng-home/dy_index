<template>
    <div class="dormitoryInspectionitem">
        <div class="top">
            <el-button @click="$router.back()" type="default" size="medium">返回</el-button>
            <el-button  type="primary" @click="dormitoryInspectionitemadd()"  size="medium">添加检查项</el-button>
             <el-input class="search-input" style="width:20%;float: right;"  
                          placeholder="请输入检查项名称" icon="search" size="medium" @change="getItemList()"
                          v-model.trim="listQuery.title">
                    <el-button slot="append" icon="el-icon-search" @click="getItemList()"></el-button>
            </el-input>
        </div>
        <div class="main-wrap">
            <el-table stripe  :data="dataList" v-loading.body="listLoading" border style="width: 100%" :height="maxH">
                <el-table-column align="center" label="序号" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span>{{scope.row.orderNum}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="检查项名称" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span  class="link-type"  @click="dormitoryInspectioniteminfo(scope.row.id)">{{scope.row.title}}</span>
                    </template>
                </el-table-column>
                
                <el-table-column align="center" label="评价方式" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span>{{scope.row.isStar==1?'打星':'打分'}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="评价对象" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span v-if="scope.row.checkType==1">宿舍</span>
                        <span v-else>床位（住宿生）</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="满分" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span>{{scope.row.totalScore}}</span>
                    </template>
                </el-table-column>
                 <el-table-column align="center" label="步长" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span>{{scope.row.scoreStep-0}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="操作" width="150">
                    <template slot-scope="scope">
                        <el-button size="small" type="text" @click="dormitoryInspectionitemedit(scope.row.id)">编辑</el-button>
                        <el-button size="small" type="text" @click="delItem(scope.row.id)" class="buttontextred">删除</el-button>
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
    import {getItemList, delItem} from '@/api/dormitoryInspection';
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
            this.getItemList();
        },
        mixins: [mixin],
        methods: {  
            handleCurrentChange(val) {
                this.listQuery.pageNo = val;
                this.getItemList();
            },
            handleSizeChange(val) {
                this.listQuery.pageSize = val;
                this.getItemList();
            },
            dormitoryInspectionitemadd() {
                this.$router.push({
                    path: 'dormitoryInspectionitemadd',
                })
            },
            dormitoryInspectioniteminfo(id) {
                this.$router.push({
                    path: 'dormitoryInspectioniteminfo',
                     query: {
                        id: id
                    }
                })
            },
            dormitoryInspectionitemedit(id) {
                this.$router.push({
                    path: 'dormitoryInspectionitemadd',
                    query: {
                        id: id
                    }
                })
            },
            delItem(id) {
                let _this = this;
                this.$confirm('确认删除该检查项？', '提示', {
                    type: 'error'
                }).then(() => {
                    delItem(id).then(res => {
                        let data = res.data;
                        if (data.code === 200) {
                            this.$message({
                                type: 'success',
                                message: '删除成功!'
                            });
                            this.getItemList();
                        }
                    })
                })
                    .catch(() => {
                    });
            },
            getItemList() {
                this.dataList = [];
                this.listLoading = true;
                getItemList(this.listQuery).then(res => {
                    let data = res.data;
                    if (data.code === 200) {
                        this.dataList = data.data.dataList;
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
.dormitoryInspectionitem {
   padding: 12px;
    .top{
        padding-bottom: 10px;
    }
}
</style>
