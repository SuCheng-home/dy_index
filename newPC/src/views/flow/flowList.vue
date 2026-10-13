<!--用户已发送通知列表-->
<template>
    <div id="noticeIndex" class="app-container calendar-list-container">
        <back-tool>
            <el-button type="primary" size="medium"
                       @click="jumpToPage('flowAddEdit')">
                新增
            </el-button>
        </back-tool>
        <el-table stripe :data="list" border fit highlight-current-row
                  style="width: 100%" :height="nobottommaxH - 25">
            <el-table-column min-width="150px" label="流程名称" show-overflow-tooltip>
                <template slot-scope="scope">
                    <span class="link-type" @click="toEdit('flowAddEdit', {id: scope.row.id}, scope.row.type)">
                        {{scope.row.name}}
                    </span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="标识">
                <template slot-scope="scope">
                    <span>{{scope.row.type }}</span>
                </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip align="center" label="版本">
                <template slot-scope="scope">
                    <template>
                        <span>{{scope.row.version}}</span>
                    </template>
                </template>
            </el-table-column>
            <el-table-column align="center" label="创建日期">
                <template slot-scope="scope">
                    <span >{{scope.row.createTime | trimTime}}</span>
                </template>
            </el-table-column>

            <el-table-column align="center" label="操作">
                <template slot-scope="scope">
                    <el-button size="small" type="text" :disabled="scope.row.noticeState===2||scope.row.isSendOntime==2"
                               @click.native="toEdit('flowAddEdit', {id: scope.row.id}, scope.row.type)">编辑
                    </el-button>
                    <el-button size="small" type="text"
                               @click.native="delWorkFlowByIdFunc(scope.row.id)" class="buttontextred">删除
                    </el-button>
                </template>
            </el-table-column>

        </el-table>
    </div>
</template>

<script>
    import BackTool from '@/components/BackTool';
    import {getWorkFlowList, delWorkFlowById} from '@/api/flow';
    import mixin from '@/mixins/windowResize';

    export default {
        data() {
            return {
                list: [],
            }
        },
        components: {BackTool},
        created() {
            this.getList();
        },
        mixins: [mixin],
        filters: {
            trimTime(datetime) {
                return datetime.slice(0, datetime.lastIndexOf('.'));
            },
        },
        methods: {
            getList() {
                getWorkFlowList().then(res => {
                    this.list = res.data.data;
                }).catch(err => {
                });
            },
            delWorkFlowByIdFunc(workFlowId) {
                this.$confirm('是否删除该流程?', '删除', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    delWorkFlowById({
                        workFlowId
                    }).then(res => {
                        this.getList();
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                    }).catch();

                }).catch(() => {
                });

            },
            toEdit(path, query = {}, type) {
                sessionStorage.setItem('flowType', type);
                this.jumpToPage('flowAddEdit', query);
            },
            jumpToPage(path, query = {}) {
                this.$router.push({
                    path,
                    query
                })
            }
        }
    }
</script>
<style lang="scss">
    .pagination-container {
        margin-top: 10px;
    }
    .el-icon-paperclip {
        margin-right: 3px;
    }
</style>
