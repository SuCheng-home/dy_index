<template>
    <div class="page">
        <div>
            <backtool>
                <el-date-picker size="medium" ref="date"  v-model="duration" type="daterange" class="filter-item mywidthdaterange"
                                :editable="false"
                                :clearable='false' align="right" unlink-panels placeholder="选择时间范围"
                                @change="statisticsByUseTypeFunc()"></el-date-picker>
                <el-select
                    size="medium"
                    placeholder="请选择"
                    value-key="id"
                    v-model="useType"
                    @change="searchTitleHandler()"
                >
                    <el-option v-for="(typeItem,indexa) in typeList" :label="typeItem.useTypeName":key="indexa" :value="`${typeItem.useType}`"></el-option>
                </el-select>
                <el-input placeholder="申请名称/申请人" size="medium" v-model="searchTitle"
                          class="search-input search-input--right"
                          @keyup.enter.native="searchTitleHandler">
                    <el-button slot="append" icon="el-icon-search" @click="searchTitleHandler"></el-button>
                </el-input>
            </backtool>
            <el-table stripe :data="dataList" border fit highlight-current-row
                      style="width: 100%" :height="maxH">
                <el-table-column label="申请名称" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span class="link-type"
                              @click="jumpToPage('printApplyDetail', {id: scope.row.id, kind: 'material'})">{{scope.row.name}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" prop="useTypeName" label="用途类型">
                </el-table-column>
                <el-table-column align="center" label="申请人" prop="applyUserName">
                </el-table-column>
                 <el-table-column align="center" prop="officeName" label="办公室">
                    </el-table-column>
                <el-table-column align="center" label="申请数量" prop="copies">
                </el-table-column>
                <el-table-column align="center" label="发放数量" prop="totalPapers">
                </el-table-column>
            </el-table>
            <div class="pagination-container">
                <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                               :current-page.sync="pagination.pageNo" :page-sizes="[10,20,30, 50]"
                               :page-size="pagination.pageSize" layout="total, sizes, prev, pager, next, jumper"
                               :total="pagination.total">
                </el-pagination>
            </div>
        </div>
    </div>
</template>

<script>
    import Backtool from '@/components/BackTool';

    import {
        statisticsByUseType,
        findHaoCaiListByType
    } from '@/api/printApplication';
    import mixin from '@/mixins/windowResize';
    import baseMixin from '@/mixins/baseMixin';

    export default {
        name: "printApply",
        mixins: [baseMixin, mixin],
        components: {Backtool},
        data() {
            return {
                useType: `${this.$route.query.useType}`,
                duration: [this.$route.query.startDate, this.$route.query.endDate],
                searchTitle: '',
                outsource: 0,
                typeList: [],
                dataList: []
            }
        },
        filters: {
            statusFilter(status) {
                return {
                    '-1': '撤回',
                    1: '草稿',
                    2: '待审核',
                    3: '驳回',
                    4: '未打印',
                    5: '未领取',
                    6: '领取'
                }[status];
            },
            statusFilterMaterial(status) {
                return {
                    '-1': '撤回',
                    1: '草稿',
                    2: '待审核',
                    3: '驳回',
                    4: '未发放',
                    5: '未领取',
                    6: '领取'
                }[status];
            }
        },
        created() {
            this.statisticsByUseTypeFunc();
        },
        methods: {
            searchTitleHandler() {
                this.pagination.pageNo = 1;
                this.findHaoCaiListByTypeFunc();
            },
            handleSizeChange(val){
                this.pagination.pageNo =1;
                this.pagination.pageSize = val;
                this.findHaoCaiListByTypeFunc();
            },
            handleCurrentChange(val){
                this.pagination.pageNo = val;
                this.findHaoCaiListByTypeFunc();
            },
            statisticsByUseTypeFunc() {
                statisticsByUseType({
                    startDate: this.$moment(this.duration[0]).format('YYYY-MM-DD'),
                    endDate: this.$moment(this.duration[1]).format('YYYY-MM-DD'),
                    kind: 2
                })
                    .then(res => res.data)
                    .then(data => {
                        const pageData = data.data;
                        this.typeList = pageData.dataList;
                        if(this.typeList.length !== 0) {
                            if(!this.typeList.find(item => item.useType == this.useType)) {
                                this.useType = `${this.typeList[0].useType}`;
                            }
                            this.findHaoCaiListByTypeFunc();
                        } else {
                            this.useType = '';
                            this.dataList = [];
                            this.pagination.total = 0;
                        }

                    });

            },
            findHaoCaiListByTypeFunc() {
                findHaoCaiListByType({
                    startDate: this.$moment(this.duration[0]).format('YYYY-MM-DD'),
                    endDate: this.$moment(this.duration[1]).format('YYYY-MM-DD'),
                    kind: 2,
                    useType: this.useType,
                    searchTitle: this.searchTitle,
                    pageNo: this.pagination.pageNo,
                    pageSize: this.pagination.pageSize
                })
                    .then(res => res.data)
                    .then(data => {
                        this.dataList = data.data.dataList;
                        this.pagination.total = data.data.pagination.total;
                    })
            }
        }
    }
</script>

<style lang="scss" scoped>
    .page {
        padding: 12px;
    }

    .page-header {
        padding-bottom: 10px;
    }
    .pagination-container {
        margin-top: 10px;
    }
</style>
