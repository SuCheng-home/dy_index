<template>
    <div class="outApplyList">
        <div class="header-wrap">
            <div class="header header2">
                <el-row>
                    <el-button type="default" size="medium" @click="$router.back()" v-if="isShowBack">返回</el-button>
                    <el-date-picker style="width:250px"
                                    v-model="daterange"
                                    type="daterange" class="right-line mywidthdaterange"
                                    size="medium"
                                    range-separator="-"
                                    start-placeholder="开始日期"
                                    end-placeholder="结束日期"
                                    :clearable="false"
                                    @change="findDate()"
                    >
                    </el-date-picker>
                    <template>
                        <el-input class="search-input right-line" style="width:200px"
                                  placeholder="请输入外出地点" icon="search" maxlength="50" size="medium"
                                  @keyup.enter.native="handleAddress"
                                  v-model.trim="listQuery.searchAddress">
                        </el-input>
                    </template>
                    <template>
                        <el-input class="search-input right-line" style="width:200px"
                                  placeholder="申请人" icon="search" maxlength="30" size="medium"
                                  @keyup.enter.native="handleNameChange"
                                  v-model.trim="listQuery.searchName">
                        </el-input>
                    </template>
                    <el-button type="primary" size="medium" class="left-line right-line" @click="examHandler">检索
                    </el-button>
                    <!-- v-if="applyList&&applyList.length!==0" -->
                    <a :href="exportURL" download="导出结果" target="_blank" v-if="outApplyList.length">
                        <el-button class="filter-item" size="medium" type="primary">导出</el-button>
                    </a>
                    <el-button type="primary" size="medium" @click="jumpTo('outApplyAdd')">外出申请审批设置</el-button>
                </el-row>
            </div>
        </div>
        <el-table stripe :data="outApplyList" v-loading.body="listLoading" border fit highlight-current-row
                  style="width: 100%" :height="maxH">
            <el-table-column align="center" label="申请人" show-overflow-tooltip>
                <template slot-scope="scope">
                <span class="link-type" @click="jumpTo('outApplyDetail',{
                  id:scope.row.id
                })">{{scope.row.createName}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="所属部门" show-overflow-tooltip>
                <template slot-scope="scope">
                    <span>{{scope.row.departName}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="开始时间" show-overflow-tooltip>
                <template slot-scope="scope">
                    <span>{{scope.row.startDate}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="结束时间" show-overflow-tooltip>
                <template slot-scope="scope">
                    <span>{{scope.row.endDate}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="外出地点" show-overflow-tooltip>
                <template slot-scope="scope">
                    <span>{{scope.row.outAddress}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="外出事由" show-overflow-tooltip>
                <template slot-scope="scope">
                    <span>{{scope.row.content}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="共同外出人员" show-overflow-tooltip>
                <template slot-scope="scope">
                    <span v-for="(item,index) in scope.row.newUserList" :key="index"
                          v-if="scope.row.newUserList.length!==0">{{item.userName}}&nbsp;<span
                        v-if="scope.row.newUserList.length>1&&index<scope.row.newUserList.length-1">;</span>&nbsp;</span>
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
    import mixin from '@/mixins/windowResize';
    import {mapGetters} from 'vuex';
    import _ from 'lodash';
    import {queryOutApplyBySchoolId} from '@/api/outApplyStatistics';

    export default {
        data() {
            return {
                daterange: [new Date(), new Date()],
                listQuery: {
                    startDate: '',
                    endDate: '',
                    searchAddress: '',
                    searchName: '',
                    pageNo: 1,
                    pageSize: 20
                },
                exportURL: '',
                outApplyList: [],
                total: 0,
                listLoading: false,
                isShowBack: false
            }
        },
        created() {
            if (this.$route.query.startDate) {
                this.daterange = [this.$route.query.startDate, this.$route.query.endDate];
                this.listQuery.startDate = this.$route.query.startDate; //时间
                this.listQuery.endDate = this.$route.query.endDate; //时间
                this.isShowBack = true;

            } else if(this.$route.query.date) {
                this.daterange = [`${this.$route.query.date}-01`, moment(`${this.$route.query.date}-01`).endOf('month').format('YYYY-MM-DD')];
                this.listQuery.startDate = `${this.$route.query.date}-01`; //时间
                this.listQuery.endDate = moment(`${this.$route.query.date}-01`).endOf('month').format('YYYY-MM-DD'); //时间
                this.isShowBack = true;
            } else {
                this.daterange[0] = new Date(this.$moment().set('date', 1).valueOf());
                this.listQuery.startDate = this.$moment(this.daterange[0]).format('YYYY-MM-DD'); //时间
                this.listQuery.endDate = this.$moment(this.daterange[1]).format('YYYY-MM-DD');
            }

        },
        mounted() {
            this.queryOutApplyBySchoolIdFunc();
        },
        computed: {
            ...mapGetters([
                'userInfo'
            ])
        },
        mixins: [mixin],
        methods: {
            handleCurrentChange(val) {
                this.listQuery.pageNo = val;
                this.queryOutApplyBySchoolIdFunc();
            },
            handleSizeChange(val) {
                this.listQuery.pageNo = 1;
                this.listQuery.pageSize = val;
                this.queryOutApplyBySchoolIdFunc();
            },
            queryOutApplyBySchoolIdFunc() {
                this.listLoading = true;
                queryOutApplyBySchoolId({
                    pageNo: this.listQuery.pageNo,
                    pageSize: this.listQuery.pageSize,
                    startDate: this.listQuery.startDate,
                    endDate: this.listQuery.endDate,
                    searchName: this.listQuery.searchName,
                    searchAddress: this.listQuery.searchAddress
                }).then(res => res.data)
                    .then(data => {
                        if (data.code === 200) {
                            let outApplyData = data.data;
                            this.outApplyList = outApplyData.dataList;
                            this.outApplyList.forEach(item => {
                                let userItem = item.userList.filter(ele => ele.userId !== this.userInfo.id);
                                item.newUserList = userItem;
                            })
                            this.total = outApplyData.pagination.total;
                            /*导出*/
                            this.exportURL = global.BasePath + 'structure/outApply/downOutApplyBySchoolId?startDate=' + this.listQuery.startDate + '&endDate=' + this.listQuery.endDate + '&searchName=' + this.listQuery.searchName + '&searchAddress=' + this.listQuery.searchAddress + '&token=' + this.$store.getters.token;
                            this.listLoading = false;
                        }
                    }).catch(() => {
                    this.listLoading = false;
                })
            },
            examHandler: _.debounce(
                function () {
                    //检索
                    this.listQuery.pageNo = 1;
                    this.queryOutApplyBySchoolIdFunc();
                },
                500
            ),
            handleNameChange: _.debounce(
                function () {
                    //申请人搜索
                    this.listQuery.pageNo = 1;
                    this.queryOutApplyBySchoolIdFunc();
                },
                500
            ),
            handleAddress: _.debounce(
                function () {
                    //地点搜索
                    this.listQuery.pageNo = 1;
                    this.queryOutApplyBySchoolIdFunc();
                },
                500
            ),
            findDate() {
                this.listQuery.startDate = this.$moment(this.daterange[0]).format('YYYY-MM-DD'); //时间
                this.listQuery.endDate = this.$moment(this.daterange[1]).format('YYYY-MM-DD'); //时间
                this.listQuery.pageNo = 1;
                this.queryOutApplyBySchoolIdFunc();
            },
            jumpTo(path, query = {}) {
                this.$router.push({
                    path,
                    query
                })
            }
        }
    }
</script>
<style lang="scss" scoped>
    .outApplyList {
        padding: 12px;
        box-sizing: border-box;

        .header {
            margin-bottom: 10px;
            font-size: 14px;

            .el-input {
                width: auto;
            }

        }
    }
</style>

