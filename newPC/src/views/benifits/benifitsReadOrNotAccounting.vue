<template>
    <div class="benifitsReadOrNotAccounting">
        <el-tabs type="border-card" v-model="activeName" @tab-click="tabsfun()">
            <el-tab-pane label="物品消耗统计" name="one"></el-tab-pane>
            <el-tab-pane label="教师领取情况统计" name="two">
                <div class="header-line">
                    <el-row>
                        <el-col :span="19">
                            <el-button @click="$router.back()" type="default" size="medium">返回</el-button>
                            <a target="_blank" :href="exportUrl" download="导出结果"  v-if="dataList.length"> 
                                <el-button class="filter-item" type="primary" size="medium" icon="upload">导出</el-button>
                            </a>
                            <el-button type="primary" size="medium"
                                       :disabled="status === 0 || status === 2 || status === 3 || status === 4"
                                       @click.native="remindHandler">提醒
                            </el-button>
                            <el-select v-model="status" @change="getThWelfareActionListFunc" size="medium">
                                <el-option label="全部状态" :value="0"></el-option>
                                <el-option label="未读" :value="1"></el-option>
                                <el-option label="已读" :value="2"></el-option>
                                <el-option label="已登记" :value="3"></el-option>
                                <el-option label="已领取" :value="4"></el-option>
                                <el-option label="未登记" :value="5"></el-option>
                                <el-option label="未领取" :value="6"></el-option>
                            </el-select>
                        </el-col>
                        <el-col :span="5">
                            <el-input size="medium"
                                      placeholder="请输入姓名" icon="el-icon-search" @keyup.enter.native="searchHandler"
                                      v-model.trim="userName">
                                <el-button slot="append" icon="el-icon-search" @click="searchHandler"></el-button>
                            </el-input>
                        </el-col>
                    </el-row>


                </div>
                <el-table stripe :data="dataList" border fit highlight-current-row
                          style="width: 100%" :height="`${maxH - 60}px`">
                    <el-table-column width="200px" label="姓名" prop="userName">
                    </el-table-column>
                    <el-table-column width="200px" align="center" label="已选物品">
                        <template slot-scope="scope">
                            <span v-if="scope.row.userSelectedList.length !== 0">{{scope.row.userSelectedList.map(({goodsTile}) => goodsTile).join(',')}}</span>
                            <span v-else>--</span>
                        </template>
                    </el-table-column>
                    <el-table-column show-overflow-tooltip align="center" label="领取方式">
                        <template slot-scope="scope">
                            <span>{{scope.row.wayType | getWayText}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column show-overflow-tooltip align="center" label="配送信息">
                        <template slot-scope="scope">
                            <template v-if="scope.row.receiver">
                                <div>
                                    <span>{{scope.row.receiver}}</span>&nbsp;&nbsp;&nbsp;&nbsp;<span>{{scope.row.mobile}}</span>
                                </div>
                                <div>
                                    <span>{{scope.row.codeStreet}}</span>&nbsp;&nbsp;&nbsp;&nbsp;<span>{{scope.row.address}}</span>
                                </div>
                            </template>
                            <template v-else>
                                <span>--</span>
                            </template>
                        </template>
                    </el-table-column>
                    <el-table-column show-overflow-tooltip align="center" label="状态">
                        <template slot-scope="scope">
                            <el-tag  size="mini" v-if="scope.row.status === 3">{{scope.row.status | getStatusText}}</el-tag>
                            <el-tag  size="mini" v-else-if="scope.row.status === 4" type="success">{{scope.row.status |
                                getStatusText}}
                            </el-tag>
                            <el-tag  size="mini" v-else type="danger">{{scope.row.status | getStatusText}}</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column show-overflow-tooltip align="center" label="操作">
                        <template slot-scope="scope">
                            <el-button :disabled="scope.row.status !== 3" size="small" type="text"
                                       @click.native="sendHandler(scope.row)">已领取
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <div class="pagination-container">
                    <el-pagination @size-change="getThWelfareActionListFunc"
                                   @current-change="getThWelfareActionListFunc"
                                   :current-page.sync="pagination.pageNo" :page-sizes="[10,20,30, 50]"
                                   :page-size.sync="pagination.pageSize"
                                   layout="total, sizes, prev, pager, next, jumper"
                                   :total="pagination.total">
                    </el-pagination>
                </div>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
    import {wayTypeEnum} from './constants';
    import baseMixin from '@/mixins/baseMixin';
    import windowResize from '@/mixins/windowResize';

    import Backtool from '@/components/BackTool';

    import {
        getThWelfareActionList,
        updateThWelfareAction,
        remindThWelfareActionList
    } from '@/api/benifits';

    export default {
        name: "benifitsReadOrNot",
        data() {
            return {
                id: this.$route.query.id,
                isNotRead: this.$route.query.notRead == 1,
                status: 0,
                userName: '',
                dataList: [],
                activeName: 'two'
            }
        },
        mixins: [baseMixin, windowResize],
        components: {
            Backtool
        },
        computed: {
            exportUrl() {
                return `${global.BasePath}structure/thWelfare/exportThWelfareActionList?status=${this.status}&welfareId=${this.id}&token=${this.$store.getters.token}`
            }
        },
        created() {
            this.getThWelfareActionListFunc();
        },
        filters: {
            getWayText(wayType) {
                const mapping = {
                    [wayTypeEnum.zaixiao]: '在校领取',
                    [wayTypeEnum.daodian]: '到店自提',
                    [wayTypeEnum.wuliu]: '物流配送',
                };
                return mapping[wayType];
            },
            getStatusText(status) {
                return ['', '未读', '未登记', '已登记', '已领取'][status];
            }
        },
        methods: {
            tabsfun() {
                if (this.activeName == 'one') {
                    this.$router.replace({
                        path: "benifitsReceiveAccounting",
                        query: {id: this.id}
                    });
                }
            },
            getThWelfareActionListFunc() {
                getThWelfareActionList({
                    pageNo: this.pagination.pageNo,
                    pageSize: this.pagination.pageSize,
                    status: this.status,
                    userName: this.userName,
                    welfareId: this.id
                })
                    .then(res => res.data)
                    .then(data => {
                        this.dataList = data.data.dataList;
                        this.pagination.total = data.data.pagination.total;
                    })
            },
            searchHandler() {
                this.pagination.pageNo = 1;
                this.getThWelfareActionListFunc();
            },
            remindHandler() {
                remindThWelfareActionList({
                    status: this.status,
                    welfareId: this.id
                })
                    .then(res => res.data)
                    .then(data => {
                        if (data.result) {
                            this.$message({
                                message: '提醒成功！',
                                type: 'success'
                            });
                        }
                    });
            },
            sendHandler(item) {
                this.$confirm('是否将此记录修改为已领取?', '发放', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    updateThWelfareAction({
                        status: 4,
                        userId: item.userId,
                        userName: item.userName,
                        welfareId: item.welfareId
                    })
                        .then(res => res.data)
                        .then(data => {
                            if (data.result) {
                                this.$message({
                                    message: '修改成功！',
                                    type: 'success'
                                });
                                this.getThWelfareActionListFunc();
                            }
                        })
                });

            }
        }
    }
</script>

<style scoped>
    .benifitsReadOrNotAccounting {
        padding: 12px;
    }

    .header-line {
        padding-bottom: 10px;
    }

    .pagination-container {
        margin-top: 12px !important;
    }
</style>
