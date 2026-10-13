<template>
    <div class="checkDutyList">
        <div class="top">
            <el-button @click="$router.back()" type="default" size="medium">返回</el-button>
            <el-button  type="primary" @click="addCheckItem()"  size="medium">添加检查项</el-button>
             <el-input class="search-input" style="width:20%;float: right;"  
                          placeholder="请输入检查项名称" icon="search" size="medium" @change="getCheckItemListFunc()"
                          v-model.trim="listQuery.itemName">
                    <el-button slot="append" icon="el-icon-search" @click="getCheckItemListFunc()"></el-button>
            </el-input>
        </div>
        <div class="main-wrap">
            <el-table stripe :key='tableKey' :data="dataList" v-loading.body="listLoading" border style="width: 100%" :height="maxH">
                <el-table-column align="center" label="序号" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span>{{scope.row.orderNum}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="名称" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span>{{scope.row.itemName}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="课程" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span v-if="scope.row.sectionName">{{scope.row.sectionName}}</span>
                        <span v-else>无</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="评价方式" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span>{{scope.row.isStar==1?'打星':'打分'}}</span>
                    </template>
                </el-table-column>
                 <el-table-column align="center" label="考核分" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span>{{scope.row.totalScore||'--'}}</span>
                    </template>
                </el-table-column>、
                 <el-table-column align="center" label="加减分步长" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span v-if="scope.row.isStar==2">{{scope.row.scoreStep}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="描述" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span>{{scope.row.itemDesc}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="操作" width="150">
                    <template slot-scope="scope">
                        <el-button size="small" type="text" @click="editCheckDuty(scope.row.id)">编辑</el-button>
                        <el-button size="small" type="text" @click="delCheckDuty(scope.row.id)" class="buttontextred">删除</el-button>
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
    import {getCheckItemList, delItem} from '@/api/compositeExamSet';

    export default {
        data() {
            return {
                listQuery: {
                    pageNo: 1,
                    pageSize: 20,
                    itemName:''
                },
                tableKey: 0,
                listLoading: false,
                dataList: [],
                total: null,
                tabPosition:3,
            }
        },
        created() {
            this.getCheckItemListFunc();
        },
        mixins: [mixin],
        methods: {  
            handleCurrentChange(val) {
                this.listQuery.pageNo = val;
                this.getCheckItemListFunc();
            },
            handleSizeChange(val) {
                this.listQuery.pageSize = val;
                this.getCheckItemListFunc();
            },
            addCheckItem() {
                this.$router.push({
                    path: 'addCheckDuty',
                })
            },
            editCheckDuty(id) {
                this.$router.push({
                    path: 'editCheckDuty',
                    query: {
                        id: id
                    }
                })
            },
            delCheckDuty(id) {
                let _this = this;
                this.$confirm('确认删除该检查项？', '提示', {
                    type: 'error'
                }).then(() => {
                    delItem({
                        itemId: id
                    }).then(res => {
                        let data = res.data;
                        if (data.code === 200) {
                            this.$message({
                                type: 'success',
                                message: '删除成功!'
                            });
                            this.getCheckItemListFunc();
                        }
                    })
                })
                    .catch(() => {
                    });
            },
            getCheckItemListFunc() {
                this.dataList = [];
                this.listLoading = true;
                getCheckItemList(this.listQuery).then(res => {
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
.top {
      padding-bottom: 10px;
      border-bottom: 1px solid  #e7eaec;
    }
    .box-top{
    margin: 0 auto;
    width: 340px;
    padding: 10px 0;
}
    .clearfix:after {
        content: "";
        height: 0;
        display: block;
        clear: both;
        visibility: hidden;
    }

    .menu-tools {
        border-bottom: 1px solid #e7eaec;
        padding-bottom: 10px;
    }

    ul, li {
        list-style: none;
    }

    .checkDutyList {
        padding:12px;
    }
</style>
