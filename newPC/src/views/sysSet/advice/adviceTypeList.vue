<template>
    <div class="advice_type_list_wrap">
        <div class="header">
            <el-row>
                <el-col :span="19">
                    <el-button @click="$router.back()" type="default" size="medium">返回</el-button>
                    <el-button type="primary" @click="toTypeAdd(0)"  size="medium">创建类型</el-button>
                </el-col>
                <el-col :span="5">
                    <el-input placeholder="类型名称" size="medium" v-model.trim="typeName" class="search-input"
                              @keyup.enter.native="getStatistics">
                        <el-button slot="append" icon="el-icon-search" @click="getStatistics" :loading="searchLoading"></el-button>
                    </el-input>
                </el-col>
            </el-row>
        </div>
        <div class="advice_table_wrap">
            <el-table stripe :data="dataList" border style="width: 100%;" :height="maxH">
                <el-table-column label="建议类型" prop="typeName" show-overflow-tooltip></el-table-column>
                <el-table-column label="创建人">
                    <template slot-scope="scope">
                        <span>{{scope.row.updateUserName || scope.row.createUserName}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="创建时间" width="220px">
                    <template slot-scope="scope">
                        <span>{{scope.row.createTime | formatTimeMap}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="负责人" prop="managerUserNames" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="操作">
                    <template slot-scope="scope">
                        <el-button size="small" type="text" @click.native="toTypeAdd(scope.row.id)">编辑</el-button>
                        <el-button size="small" type="text" @click.native="toDelType(scope.row.id)" class="buttontextred">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination-container" style="margin-top: 15px;">
                <el-pagination @size-change="sizeChangeHandler" @current-change="currentChangeHandler"
                               :current-page.sync="pagination.pageNo" :page-sizes="[10, 20, 30, 50]"
                               :page-size.sync="pagination.pageSize" layout="total, sizes, prev, pager, next, jumper"
                               :total="pagination.total">
                </el-pagination>
            </div>
        </div>
    </div>
</template>

<script>
    import mixins from '@/mixins/windowResize';
    import {getAdviceTypeList, batchDelAdviceType} from '@/api/systemSet/adviceSet';

    export default {
        name: "adviceTypeList",
        data() {
            return {
                searchLoading: false,
                pagination: {
                    pageNo: 1,
                    pageSize: 20,
                    total: null
                },
                typeName: '',
                dataList: [],
            }
        },
        filters: {
            formatTimeMap(type) {
                if (type) {
                    return type.substring(0,19);
                }
                return '-';
            }
        },
        mixins: [mixins],
        created() {
            this.getStatistics();
        },
        methods: {
            goBack() {
                this.$router.back();
            },
            toTypeAdd(id) {
                if (!id) {
                    this.$router.push({path: 'typeAdd'});
                } else {
                    this.$router.push({path: 'typeAdd', query: {id: id}});
                }
            },
            toDelType(id) {
                this.$confirm('此操作将删除此建议类型, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    batchDelAdviceType(id.toString()).then(res => {
                        if (res.data.code === 200) {
                            this.getStatistics();
                            this.$message({
                                type: 'success',
                                message: '删除成功!'
                            });
                        } else {
                            this.$message.error(res.data.msg);
                        }
                    }).catch();

                }).catch(() => {
                });
            },
            getStatistics() {
                let query = {
                    typeName: this.typeName,
                    pageNo: this.pagination.pageNo,
                    pageSize: this.pagination.pageSize
                };

                this.getAdviceTypeList(query);
            },
            getAdviceTypeList(query) {
                this.searchLoading = true;
                getAdviceTypeList(query).then(res => {
                    const data = res.data.data;
                    if (res.data.code === 200) {
                        this.dataList = data.dataList;
                        this.pagination.total = data.pagination.total;
                    } else {
                        this.$message({
                            message: data.msg,
                            type: 'warning'
                        });
                    }
                    this.searchLoading = false;
                }).catch(() => {
                    this.searchLoading = false;
                });
            },
            sizeChangeHandler() {
                this.pagination.pageNo = 1;
                this.getStatistics();
            },
            currentChangeHandler() {
                this.getStatistics();
            }
        }
    }
</script>

<style lang="scss" scoped>
    .advice_type_list_wrap{
         padding:12px;
        .header{
            padding-bottom: 10px;
        }
        .advice_table_wrap{
            .advice_content{
                color: #409eff;
                cursor: pointer;
            }
        }
    }
</style>
