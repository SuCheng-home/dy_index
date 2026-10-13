<template>
    <div class="app-container calendar-list-container">
        <div class="filter-container">
             <el-row>
        <el-col :span="19">
          <el-button type="primary" @click.native="jumpToPage('benifitsAddEdit')" size="medium">发福利</el-button>
        </el-col>
        <el-col :span="5">
         <el-input  size="medium"
                      placeholder="请输入福利名称" v-model.trim="title"
                      @keyup.enter.native="searchHandler"
            >
                <el-button slot="append" icon="el-icon-search" @click="searchHandler"></el-button>
            </el-input>
        </el-col>
      </el-row>
            
            
        </div>
        <el-table stripe :data="dataList" border fit highlight-current-row
                  style="width: 100%" :height="`${maxH}px`">
            <el-table-column label="福利名称" show-overflow-tooltip>
                <template slot-scope="scope">
                    <span class="link-type" @click="jumpToPage('benifitsDetail', {id: scope.row.id})">{{scope.row.title}}</span>
                </template>
            </el-table-column>
            <el-table-column width="160px" align="center" label="发布时间">
                <template slot-scope="scope">
                    <span v-if="scope.row.sendTime">{{scope.row.sendTime|trimTime }}</span>
                    <span v-else>--</span>
                </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip align="center" label="发布人">
                <template slot-scope="scope">
                    <template v-if="scope.row.inscribe">
                        <span>{{scope.row.inscribe}}</span>
                    </template>
                    <template v-else>
                        <span>{{scope.row.createUserName}}</span>
                    </template>
                </template>
            </el-table-column>
            <el-table-column width="140px" align="center" label="登记截止时间">
                <template slot-scope="scope">
                    <span v-if="scope.row.expriyTime">{{scope.row.expriyTime|trimTimeMinute }}</span>
                    <span v-else>--</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="领取方式">
                <template slot-scope="scope">
                    <span>{{scope.row.wayType | getWayType}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" width="80px" label="已读" show-overflow-tooltip>
                <template slot-scope="scope">
                    <span>{{scope.row.userCount - scope.row.notReadCount}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" width="80px" label="未读" show-overflow-tooltip>
                <template slot-scope="scope">
                    <span>{{scope.row.notReadCount}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" width="80px" label="状态" show-overflow-tooltip>
                <template slot-scope="scope">
                    <el-tag  size="mini" :type="scope.row.stateTagType">{{scope.row.stateText }}</el-tag>
                </template>
            </el-table-column>
            <el-table-column align="center" label="操作" width="120">
                <template slot-scope="scope">
                    <el-button size="small" type="text"
                               @click.native="jumpToPage('benifitsAddEdit', {id: scope.row.id})">编辑
                    </el-button>
                    <el-button size="small" type="text" :disabled="scope.row.thWefareStatus === thWefareStatusEnum.thWefareStatus_ALREADY"
                               @click.native="deleteHandler(scope.row.id)" class="buttontextred">删除
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="pagination-container">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                           :current-page.sync="pagination.pageNo" :page-sizes="[10,20,30, 50]"
                           :page-size.sync="pagination.pageSize" layout="total, sizes, prev, pager, next, jumper"
                           :total="pagination.total">
            </el-pagination>
        </div>
    </div>
</template>

<script>
    import moment from 'moment';
    import baseMixin from "@/mixins/baseMixin";
    import windowResize from '@/mixins/windowResize';
    import {
        getThWelfareList,
        delThWelfare
    } from '@/api/benifits';
    import {thWefareStatusEnum, wayTypeEnum} from './constants';

    export default {
        name: "benifitsList",
        data() {
            return {
                thWefareStatusEnum,
                title: '',
                dataList: []
            }
        },
        mixins: [baseMixin, windowResize],
        filters: {
            trimTime(time) {
                return time.slice(0, time.lastIndexOf('.'));
            },
            trimTimeMinute(time) {
                return time.slice(0, time.lastIndexOf(':'));
            },
            getWayType(type) {
                const wayTypeMapping = {
                    [wayTypeEnum.daodian]: '到店领取',
                    [wayTypeEnum.wuliu]: '物流配送',
                    [wayTypeEnum.zaixiao]: '在校领取'
                };
                return wayTypeMapping[type];
            }
        },
        created() {
            this.getThWelfareListFunc()
        },
        methods: {
            searchHandler() {
                this.pagination.pageNo = 1;
                this.getThWelfareListFunc();
            },
            handleSizeChange() {
                this.getThWelfareListFunc();
            },
            handleCurrentChange() {
                this.getThWelfareListFunc();
            },
            getThWelfareListFunc() {
                getThWelfareList({
                    pageNo: this.pagination.pageNo,
                    pageSize: this.pagination.pageSize,
                    title: this.title
                })
                    .then(res => res.data)
                    .then(data => {
                        data.data.dataList.forEach(item => {
                            if(item.thWefareStatus === thWefareStatusEnum.thWefareStatus_NOT) {
                                item.stateText = '草稿';
                                item.stateTagType = '';
                            } else if(
                                item.thWefareStatus === thWefareStatusEnum.thWefareStatus_ALREADY
                            ) {
                                if(moment(item.expriyTime).format('YYYY-MM-DD HH:mm') < moment().format('YYYY-MM-DD HH:mm')) {
                                    item.stateText = '已截止';
                                    item.stateTagType = 'danger';

                                } else {
                                    item.stateText = '已发布';
                                    item.stateTagType = 'success';

                                }
                            }
                        });
                        this.pagination.total = data.data.pagination.total;
                        this.dataList = data.data.dataList;
                    })
            },
            deleteHandler(id) {
                this.$confirm('是否删除此福利', '删除', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    delThWelfare({
                        welfareId: id
                    })
                        .then(res => res.data)
                        .then(data => {
                            if(data.result) {
                                this.$message({
                                    type: 'success',
                                    message: '删除成功!'
                                });
                                this.getThWelfareListFunc();
                            }
                        })
                });

            }
        },
    }
</script>

<style lang="scss" scoped>
    .btn-all-delete {
        margin-left: 10px;
    }
    .pagination-container {
        margin-top: 1px;
    }
    .filter-container{
        padding-bottom: 10px !important;
    }
</style>
