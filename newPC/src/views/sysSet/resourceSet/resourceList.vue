<template>
    <div class="page">
        <back-tool>
            <el-button  size="medium" type="primary" @click="jumpToPage('resourceAdd', {typeId: $route.query.typeId})"
                       :loading="false" v-if="isShowByPermission('/resource/addResources')">添加资源
            </el-button>
            <el-input placeholder="请输入内容"  size="medium" v-model="searchTitle" class="search-input"
                      @keyup.enter.native="searchTitleHandler">
                <el-button slot="append" icon="el-icon-search" @click="searchTitleHandler"
                           :loading="searchLoading"></el-button>
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
                    prop="resoureNo"
                    label="序号"
                    align="center"
                    show-overflow-tooltip
                    width="100px"
                    :resizable="false"
            >
            </el-table-column>
            <el-table-column
                    label="资源名称"
                    show-overflow-tooltip
                    min-width="300px"
                    prop="name"
                    :resizable="false"
            >
            </el-table-column>
            <el-table-column
                    label="	资源状态"
                    align="center"
                    width="350px"
                    :resizable="false"
            >
                <template slot-scope="scope">
                    <el-tag  size="mini" :type="scope.row.status | stateToType">{{ scope.row.status | stateToText }}</el-tag>
                </template>
            </el-table-column>
             <el-table-column
                    label="	二维码"
                    align="center"
                    width="100px"
                    :resizable="false"
            >
                <template slot-scope="scope">
                     <a :href="scope.row.qrCodeUrl"  target="_blank"  v-if="scope.row.qrCodeUrl">
                        <span class="link-type" >
                       点击查看
                    </span>
                   </a>
                </template>
            </el-table-column>

            <el-table-column
                    label="操作"
                    align="center"
                    width="350px"
                    :resizable="false"
            >
                <template slot-scope="scope">
                    <el-button size="small" type="text"
                               @click="jumpToPage('resourceEdit', { resourcesId: scope.row.id })"
                               v-if="isShowByPermission('/resource/editResources')"
                    >编辑
                    </el-button>
                    <el-button size="small" type="text" @click="deleteHandler(scope.row.id)"
                               v-if="isShowByPermission('/resource/deleteResources')"
                    >删除
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
    import {resourcesList, deleteResources} from '@/api/resourceOrder';
    import ImagePreviewer from '@/components/ImagePreviewer/ImagePreviewer.vue';
    export default {
        data: function () {
            return {
                searchLoading: false,
                dataList: [],
                pageNo: 1,
                pageSize: 20,
                searchTitle: '',
                pages: 1,
                total: 0,
                typeId: this.$route.query.typeId
            }
        },
        filters: {
            stateToType(status) {
                const typeArr = ['success', 'warning', 'danger'];
                return typeArr[status - 1];
            },
            stateToText(status) {
                const stateTextArr = ['可用', '维护中', '损坏'];
                return stateTextArr[status - 1];
            }
        },
        mixins: [windowResizeMixin],
        methods: {
            isShowByPermission,
            resourcesListHandler() {
                return resourcesList({
                    pageNo: this.pageNo,
                    pageSize: this.pageSize,
                    searchTitle: this.searchTitle,
                    typeId: this.typeId
                })
                    .then(res => res.data)
                    .then(data => {
                        this.searchLoading = false;
                        if (data.result) {
                            const pageData = data.data;
                            this.dataList = pageData.dataList;
                            this.pages = pageData.pagination.pages;
                            this.total = pageData.pagination.total;
                        }
                    })
                    .catch(error => {
                        this.searchLoading = false;
                        this.$message.error(error.msg);
                    });
            },
            searchTitleHandler() {
                this.searchTitle = this.searchTitle.trim();
                this.searchLoading = true;
                this.pageNo = 1;
                this.resourcesListHandler();
            },
            sizeChangeHandler(pageSize) {
                this.pageSize = pageSize;
                this.pageNo = 1;
                this.resourcesListHandler();
            },
            currentChangeHandler(pageNo) {
                this.pageNo = pageNo;
                this.resourcesListHandler();
            },
            deleteHandler(resourcesId) {
                this.$confirm('是否确认要删除该资源？', '删除', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    deleteResources({
                        resourcesId
                    }).then((res) => {
                            const data = res.data;
                            if (data.result) {
                                this.$message({
                                    message: '删除成功',
                                    type: 'success'
                                });
                                this.resourcesListHandler();
                            } else {
                                this.$message.error(error.msg);
                            }
                        }, (error) => {
                            this.$message.error(error.msg);
                        }
                    );
                })
            },
            jumpToPage(path, query) {
                if (query === null || query === undefined) {
                    query = {};
                }
                this.$router.push({
                    path,
                    query
                })
            }
        },
        created() {
            this.resourcesListHandler();
        },
        components: {
            BackTool,ImagePreviewer
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
        width: 20%;
        float: right;
    }
</style>
