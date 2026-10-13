<template>
    <div class="dic_list_wrap">
        <div class="header_btn_box">
            <el-row>
                <el-col :span="19">
                    <el-button type="primary" size="medium" @click.native="toDicAdd(0)">新建</el-button>
                    <el-button type="primary" size="medium" @click.native="toImportDic">导入字典</el-button>
                </el-col>
                <el-col :span="5">
                    <el-input placeholder="请输入字典值" icon="el-icon-search" size="medium" class="search-input"
                              v-model.trim="searchName" @keyup.enter.native="searchDicName">
                        <el-button slot="append" icon="el-icon-search" @click="searchDicName"></el-button>
                    </el-input>
                </el-col>
            </el-row>
        </div>
        <div class="dic_list_box">
            <el-table stripe :data="dicList" border fit highlight-current-row style="width: 100%" :height="maxH-20">
                <el-table-column align="center" label="字典编码" prop="code"></el-table-column>
                <el-table-column align="center" label="字典值" prop="value"></el-table-column>
                <el-table-column align="center" label="排序号" prop="sort"></el-table-column>
                <el-table-column align="center" label="描述" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span>{{scope.row.remark || '-'}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" fixed="right" label="操作">
                    <template slot-scope="scope">
                        <el-button size="small" type="text" @click.native="toDicAdd(scope.row.id)">编辑</el-button>
                        <el-button size="small" type="text" @click.native="toDelDic(scope.row.id)" class="buttontextred">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination-container">
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
    import {getDicDetailValuePageList, deleteDicValueById} from '@/api/systemSet/schoolDictionary';

    export default {
        name: "schoolDictionaryList",
        props: ['selectTreeCode'],
        data() {
            return {
                dictionaryCode: '',
                searchName: '',
                pagination: {
                    pageNo: 1,
                    pageSize: 20,
                    total: null
                },
                dicList: []
            }
        },
        mixins: [mixins],
        watch: {
            selectTreeCode(val) {
                this.dictionaryCode = val;
                this.pagination.pageNo = 1;
                this.getDicDetailValuePageList();
            }
        },
        created() {
            this.dictionaryCode = this.selectTreeCode;
            this.getDicDetailValuePageList();
        },
        methods: {
            toDicAdd(dicId) {
                if (!!dicId) {
                    this.$router.push({path: 'add', query: {dictionaryCode: this.dictionaryCode, dicId: dicId}});
                } else {
                    this.$router.push({path: 'add', query: {dictionaryCode: this.dictionaryCode}});
                }
            },
            toImportDic() {
                this.$router.push({path: 'import', query: {dictionaryCode: this.dictionaryCode}});
            },
            // 删除
            toDelDic(dicId) {
                this.$confirm('此操作将删除此字典数据, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    deleteDicValueById(dicId).then(res => {
                        const data = res.data;
                        if (data.code === 200) {
                            this.$message({
                                type: 'success',
                                message: '删除成功!'
                            });
                            this.getDicDetailValuePageList();
                        } else {
                            this.$message({
                                type: 'warning',
                                message: data.msg
                            });
                        }
                    }).catch();
                }).catch(() => {});
            },
            // 列表
            searchDicName() {
                this.pagination.pageNo = 1;
                this.getDicDetailValuePageList();
            },
            getDicDetailValuePageList() {
                let query = {
                    dictionaryCode: this.selectTreeCode,
                    pageNo: this.pagination.pageNo,
                    pageSize: this.pagination.pageSize,
                    searchName: this.searchName
                };
                getDicDetailValuePageList(query).then(res => {
                    const data = res.data.data;
                    if (res.data.code === 200) {
                        this.dicList = data.dataList;
                        this.pagination.total = data.pagination.total;
                    }
                })
            },
            sizeChangeHandler() {
                this.pagination.pageNo = 1;
                this.getDicDetailValuePageList();
            },
            currentChangeHandler() {
                this.getDicDetailValuePageList();
            }
        }
    }
</script>

<style lang="scss" scoped>
    .dic_list_wrap{
        .header_btn_box{
            padding-bottom: 10px;
        }
    }
</style>
