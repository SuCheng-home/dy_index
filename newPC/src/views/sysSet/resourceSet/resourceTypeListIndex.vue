<template>
    <div class="page">
        <back-tool>
            <el-button size="medium" v-if="isShowByPermission('/resource/addResourceType')" type="primary"
                       @click="jumpToPage('resourceTypeAdd')" :loading="false">添加资源类型
            </el-button>
             <el-button size="medium"  type="primary" v-if="isShowByPermission('/parentResource/getParentResourceList')"
                       @click="jumpToPage('parentResourceslist')" :loading="false">家长资源管理
            </el-button>


            <el-input size="medium" class="search-input search-input--right" v-model="searchTitle"
                      placeholder="搜索资源类型"
                      @keyup.enter.native="searchTitleHandler">
                <el-button slot="append" icon="el-icon-search" @click="searchTitleHandler"></el-button>
            </el-input>
        </back-tool>
        <el-table
                ref="multipleTable"
                :data="dataList"
                border
                style="width: 100%"
                :height="maxH"
                fit
        >
            <el-table-column
                    label="	序号"
                    align="center"
                    width="60px"
                    prop="typeNo"
                    :resizable="false"
            >
            </el-table-column>
            <el-table-column
                    label="资源类型"
                    show-overflow-tooltip
                    min-width="230px"
                    :resizable="false"
            >
                <template slot-scope="scope">
                    <router-link class="link-type" :to="{ path: 'resourceList', query: { typeId: scope.row.id } }">
                        {{ scope.row.name }}
                    </router-link>
                </template>
            </el-table-column>
            <el-table-column
                    prop="createUser"
                    label="审批人"
                    width="200px"
                    show-overflow-tooltip
                    :resizable="false"
            >
                <template slot-scope="scope">
                    <span>{{ usersName[scope.$index] }}</span>
                </template>
            </el-table-column>
            <el-table-column
                    label="开始前提醒"
                    width="200px"
                    :resizable="false"
            >
                <template slot-scope="scope">
                    <i class="el-icon-circle-cross"
                       v-if="scope.row.remindTime === null || scope.row.remindTime === ''"></i>
                    <i class="el-icon-circle-check" v-else></i>
                    <span>{{ scope.row.remindTime | remindTimeToText }}</span>
                </template>
            </el-table-column>
            <el-table-column
                    label="结束前提醒"
                    width="200px"
                    :resizable="false"
            >
                <template slot-scope="scope">
                    <i class="el-icon-circle-cross" v-if="scope.row.isEndRemind === 0"></i>
                    <i class="el-icon-circle-check" v-else></i>
                    <span>{{ scope.row.endRemindTime | endRemindTimeToText }}</span>
                </template>
            </el-table-column>
            <el-table-column
                    label="操作"
                    align="center"
                    width="200px"
                    :resizable="false"
            >
                <template slot-scope="scope">
                    <el-button size="small" type="text" @click="jumpToPage('resourceList', { typeId: scope.row.id })"
                    >资源管理
                    </el-button>
                    <el-button size="small" type="text"
                               @click="jumpToPage('resourceTypeEdit', { typeId: scope.row.id })"
                    >编辑
                    </el-button>
                    <el-button size="small" type="text" @click="deleteHandler(scope.row.id)" class="buttontextred">删除
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="pagination-container">
            <el-pagination
                    @size-change="sizeChangeHandler"
                    @current-change="currentChangeHandler"
                    :current-page.sync="pageNo"
                    :page-sizes="[10 , 20, 30, 50]"
                    :page-size="pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :page-count="pages"
                    :total="total"
            >
            </el-pagination>
        </div>
    </div>
</template>

<script>
    import {isShowByPermission} from "@/utils";
    import windowResizeMixin from '@/mixins/windowResize';
    import BackTool from '@/components/BackTool';
    import {resourceTypeList, deleteResourceType} from '@/api/resourceOrder';

    export default {
        data: function () {
            return {
                dataList: [],
                pageNo: 1,
                pageSize: 20,
                searchTitle: '',
                pages: 1,
                total: 0,
                searchLoading: false
            }
        },
        computed: {
            usersName() {
                return this.dataList.map(entry => {
                    if (entry.users) {
                        return entry.users.map(user => user.name).join(',');
                    } else {
                        return '--';
                    }
                });
            }
        },
        mixins: [windowResizeMixin],
        methods: {
            isShowByPermission,
            resourceTypeListHandler() {
                return resourceTypeList({
                    pageNo: this.pageNo,
                    pageSize: this.pageSize,
                    searchTitle: this.searchTitle
                })
                    .then(res => res.data)
                    .then(data => {
                        this.searchLoading = false;
                        this.dataList = data.data.dataList;
                        this.pages = data.data.pagination.pages;
                        this.total = data.data.pagination.total;
                        return data;
                    }).catch(() => {
                        this.searchLoading = false;
                        this.$message.error('error');
                    });
            },
            jumpToPage(path, query) {
                if (query === undefined || query === null) {
                    query = {}
                }
                this.$router.push({
                    path,
                    query
                })
            },
            deleteHandler(id) {
                this.$confirm('是否确定要删除该资源类型？', '删除', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                })
                    .then(() => {
                        deleteResourceType({typeId: id})
                            .then((res) => {
                                    const data = res.data;
                                    if (data.result) {
                                        this.$message({
                                            message: '删除成功',
                                            type: 'success'
                                        });
                                        this.resourceTypeListHandler();
                                    } else {
                                        this.$message.error('error');
                                    }
                                }
                            )
                            .catch(() => {
                                this.$message.error('error');
                            });
                    })
                    .catch(() => {
                    });
            },
            searchTitleHandler() {
                this.searchLoading = true;
                this.pageNo = 1;
                this.resourceTypeListHandler();
            },
            sizeChangeHandler(pageSize) {
                this.pageSize = pageSize;
                this.pageNo = 1;
                this.resourceTypeListHandler();
            },
            currentChangeHandler(pageNo) {
                this.pageNo = pageNo;
                this.resourceTypeListHandler();
            },
        },
        created() {
            this.resourceTypeListHandler();
        },
        filters: {
            valueToText(value) {
                return value === 1 ? '是' : '否';
            },
            endRemindTimeToText(endRemindTime) {
                let textStr = '';
                switch (endRemindTime) {
                    case null:
                    case '':
                    case '-1':
                        textStr = '不提醒';
                        break;
                    case '0':
                        textStr = '提前5分钟';
                        break;
                    case '1':
                        textStr = '提前10分钟';
                        break;
                    case '2':
                        textStr = '提前15分钟';
                        break;
                    case '3':
                        textStr = '提前30分钟';
                        break;
                    default:
                        break;
                }
                return textStr;
            },
            remindTimeToText(remindTime) {
                let textStr = '';
                switch (remindTime) {
                    case null:
                    case '':
                    case '-1':
                        textStr = '不提醒';
                        break;
                    case '0':
                        textStr = '提前半小时';
                        break;
                    case '1':
                        textStr = '提前1小时';
                        break;
                    case '2':
                        textStr = '提前2小时';
                        break;
                    case '3':
                        textStr = '提前3小时';
                        break;
                    default:
                        break;
                }
                return textStr;
            }
        },
        components: {
            BackTool
        }
    }
</script>

<style scoped>
    .page {
        padding:12px;
    }

    .search-input {
        vertical-align: middle;
        margin-left: 10px;
        width: 20%  !important;
    }

    .el-icon-circle-cross {
        color: #f08080;
    }

    .el-icon-circle-check {
        color: #90EE90
    }
</style>
