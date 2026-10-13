<template>
    <div class="page">
        <div v-show="kind == 'file'">
            <div class="page-header">
                <el-select
                    size="medium"
                    placeholder="请选择"
                    value-key="id"
                    v-model="status"
                    @change="listApprovalByModelAndPageFunc()"
                >
                    <el-option label="全部状态" value="1,2,3,4,5,6"></el-option>
                    <el-option label="待审核" value="2"></el-option>
                    <el-option label="已审核" value="4,5,6"></el-option>
                </el-select>
                <el-input placeholder="资料名称/申请人" size="medium" v-model="searchTitle" class="search-input search-input--right"
                          @keyup.enter.native="searchNameHandler">
                    <el-button slot="append" icon="el-icon-search" @click="searchNameHandler"></el-button>
                </el-input>
            </div>
            <el-table stripe :data="dataList" border fit highlight-current-row
                      style="width: 100%" :height="nobottommaxH - 5">
                <el-table-column label="资料名称" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span class="link-type" @click="jumpToPage('printApplyDetail', {id: scope.row.id, kind, isReview: 1})">{{scope.row.name}}</span>
                    <span v-if="scope.row.isMaxLimit==2" class="red">超限</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" prop="useTypeName" label="用途类型">
                </el-table-column>
                <el-table-column align="center" label="申请人" prop="applyUserName">
                </el-table-column>
                 <!-- <el-table-column align="center" prop="officeName" label="办公室">
                    </el-table-column> -->
                <el-table-column label="申请印制份数" show-overflow-tooltip>
                    <template slot-scope="scope">
                        {{scope.row.copies}}({{['' , '单面', '双面'][scope.row.side]}})
                    </template>
                </el-table-column>
                <el-table-column align="center" label="使用时间">
                    <template slot-scope="scope">
                        {{scope.row.useDate}}&nbsp;&nbsp;{{['', '上午', '下午'][scope.row.morningOrAfternoon]}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="处理方式">
                    <template slot-scope="scope">
                        {{['', '自印', '委外'][scope.row.outsource]}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="状态">
                    <template slot-scope="scope">
                        <el-tag  size="mini">{{getStatusText(scope.row)}}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="费用(元)" prop="cost">
                </el-table-column>
            </el-table>
            <div>
                <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                               :current-page.sync="pagination.pageNo" :page-sizes="[10,20,30, 50]"
                               :page-size="pagination.pageSize" layout="total, sizes, prev, pager, next, jumper"
                               :total="pagination.total">
                </el-pagination>
            </div>
        </div>
        <div v-show="kind == 'material'">
            <div class="page-header">
                <el-select
                    size="medium"
                    placeholder="请选择"
                    value-key="id"
                    v-model="status"
                    @change="listApprovalByModelAndPageFunc()"
                >
                    <el-option label="全部状态" value="1,2,3,4,5,6"></el-option>
                    <el-option label="待审核" value="2"></el-option>
                    <el-option label="已审核" value="4,5,6"></el-option>
                </el-select>
                <el-input placeholder="申请名称/申请人" size="medium" v-model="searchTitle" class="search-input search-input--right"
                          @keyup.enter.native="searchNameHandler">
                    <el-button slot="append" icon="el-icon-search" @click="searchNameHandler"></el-button>
                </el-input>
            </div>
            <el-table stripe :data="dataList" border fit highlight-current-row
                      style="width: 100%" :height="nobottommaxH - 5">
                <el-table-column label="申请名称" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span class="link-type" @click="jumpToPage('printApplyDetail', {id: scope.row.id, kind, isReview: 1})">{{scope.row.name}}</span>
                     <span v-if="scope.row.isMaxLimit==2" class="red">超限</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" prop="useTypeName" label="用途类型">
                </el-table-column>
                <el-table-column align="center" label="申请人" prop="applyUserName">
                </el-table-column>
                 <el-table-column align="center" prop="officeName" label="办公室">
                    </el-table-column>
                <el-table-column align="center" label="申请时间" >
                    <template slot-scope="scope">
                        {{scope.row.createTime | trimTime}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="状态">
                    <template slot-scope="scope">
                        <el-tag  size="mini">{{scope.row.status | statusFilterMaterial}}</el-tag>
                    </template>
                </el-table-column>
            </el-table>
            <div>
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
    import {isShowByPermission} from '@/utils';

    import {
        listApprovalByModelAndPage
    } from '@/api/printApplication';
    import mixin from '@/mixins/windowResize';
    import baseMixin from '@/mixins/baseMixin';

    export default {
        name: "printApplyReviewList",
        mixins: [baseMixin, mixin],
        data() {
            return {
                kind: this.$route.query.kind || 'file',
                searchTitle: '',
                status: '1,2,3,4,5,6',
                dataList: []
            }
        },
        watch: {
            $route(newRoute) {
                this.pagination.pageNo = 1;
                this.pagination.pageSize = 10;
                this.kind = newRoute.query.kind || 'file';
                this.listApprovalByModelAndPageFunc();
            }
        },
        filters: {
            trimTime(datetime) {
                return datetime.slice(0, datetime.lastIndexOf('.'));
            },
            statusFilterMaterial(status) {
                return {
                    '-1': '已撤回',
                    1: '草稿',
                    2: '待审批',
                    3: '被驳回',
                    4: '已通过',
                    5: '已发放',
                    6: '已领取'
                }[status];
            },
        },
        created() {
            this.listApprovalByModelAndPageFunc();
        },
        methods: {
            isShowByPermission,
            getStatusText(item) {
                let text = '';
                if(item.status != 4) {
                    text = {
                        '-1': '已撤回',
                        1: '草稿',
                        2: '待审批',
                        3: '已驳回',
                        4: '已通过',
                        5: '已打印',
                        6: '已领取'
                    }[item.status];
                } else {
                    text = {
                        1: '已撤回',
                        2: '已通过',
                        3: '已通过',
                        null: '已通过'
                    }[item.state]
                }
                return text;

            },
            searchNameHandler() {
                this.pagination.pageNo = 1;
                this.listApprovalByModelAndPageFunc();
            },
            handleSizeChange(val){
                this.pagination.pageNo =1;
                this.pagination.pageSize = val;
                this.listApprovalByModelAndPageFunc();
            },
            handleCurrentChange(val){
                this.pagination.pageNo = val;
                this.listApprovalByModelAndPageFunc();
            },
            tabsfunc() {
                this.outsource = 0;
                this.pagination.pageNo = 1;
                this.searchName = '';
                if (this.kind === 'file') {
                    this.$router.replace({
                        path: "printApplyReviewList",
                        query: {
                            kind: 'file'
                        }
                    });
                } else if (this.kind === 'material') {
                    this.$router.replace({
                        path: "printApplyReviewList",
                        query: {
                            kind: 'material'
                        }
                    });
                }
            },
            listApprovalByModelAndPageFunc() {
                listApprovalByModelAndPage({
                    kind: this.kind === 'file' ? 1 : 2,
                    searchTitle: this.searchTitle,
                    status: this.status,
                    pageSize: this.pagination.pageSize,
                    pageNo: this.pagination.pageNo
                })
                    .then(res => res.data)
                    .then(data => {
                        this.dataList = data.data.dataList;
                        this.pagination.total = data.data.pagination.total;
                    })
            },

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
     .red{
        color:red;
    }
</style>
