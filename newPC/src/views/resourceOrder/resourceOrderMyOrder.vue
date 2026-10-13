<template>
    <div class="page myorder-page">
        <div class="header">
            <div :is="isStandalone ? 'BackTool' : 'div'">
                <el-button type="primary" size="medium" v-if="isShowByPermission('/resource/orderResource')"
                           @click="jumpToPage('resourceOrderAdd')">预约
                </el-button>
                <el-input class="search-input search-input--right"  size="medium"
                          placeholder="请输入内容" icon="el-icon-search" @keyup.enter.native="searchTitleHandler"
                          v-model.trim="searchTitle">
                    <el-button slot="append" icon="el-icon-search" @click="searchTitleHandler"></el-button>
                </el-input>

            </div>
        </div>
        <el-table
            ref="multipleTable"
            :data="dataList"
            border
            style="width: 100%"
            :height="maxH"
            fit
        >
            <el-table-column
                type="expand"
            >
                <template slot-scope="scope">
                    <el-form label-position="right" inline class="table-expand" label-width="160px">
                        <el-form-item label="资源名称：" class="whole-line">
                            {{ scope.row.resourceName }}
                        </el-form-item>
                        <el-form-item label="预约时间：" class="whole-line">
                            {{ scope.row.beginTime | trimSeconds }} 到 {{ scope.row.endTime | trimSeconds }}
                        </el-form-item>
                        <el-form-item label="状态：">
                            {{ statusToText(scope.row.status)}}
                        </el-form-item>
                        <br/>
                        <el-form-item v-if="scope.row.orderReasonValue" label="事由(用途)：">
                            {{ scope.row.orderReasonValue }}
                        </el-form-item>
                        <el-form-item v-if="scope.row.serviceObjectValue" label="服务对象：">
                            {{ scope.row.serviceObjectValue }}
                        </el-form-item>
                        <br/>
                        <el-form-item label="使用内容(预约理由)：" class="whole-line">
                            {{ scope.row.orderResion }}
                            <image-previewer tag="richtext">
                               <img :src="item.fileUrl||item.photoUrl" style="width:60px;height: 60px;margin-right: 10px;" alt="" :key="index" v-for="(item, index) in JSON.parse(scope.row.fileJson||'[]') ">
                         </image-previewer>   
                        </el-form-item>
                        <el-form-item label="审批人："
                                      v-if="scope.row.examineName !== null && scope.row.examineName !== ''">
                            {{ scope.row.examineName }}
                        </el-form-item>
                        <el-form-item label="支持人："
                                      v-if="scope.row.sendAppointerJson && scope.row.sendAppointerJson !== '[]'">
                            {{ getAppointerNames(scope.row.sendAppointerJson) }}
                        </el-form-item>
                        <br/>
                        <el-form-item label="审批意见：" class="whole-line"
                                      v-if="scope.row.examineOptions !== null && scope.row.examineOptions !== ''">
                            {{ scope.row.examineOptions }}
                        </el-form-item>
                        <el-form-item label="设施、设备使用情况：" class="whole-line"
                                      v-if="scope.row.haveFeedback == 2">
                            {{ scope.row.feedbackMarks }}
                        </el-form-item>
                    </el-form>
                </template>
            </el-table-column>
            <el-table-column
                label="资源名称"
                show-overflow-tooltip
                min-width="200px"
            >
                <template slot-scope="scope">
                    {{ scope.row.resourceName }}
                </template>
            </el-table-column>
            <el-table-column
                label="预约时间"
                align="center"
                width="300px"
            >
                <template slot-scope="scope">
                    <span>{{ scope.row.beginTime | trimSeconds }} 到 {{ scope.row.endTime | trimSeconds }}</span>
                </template>
            </el-table-column>
            <el-table-column
                label="状态"
                align="center"
                width="150px"
            >
                <template slot-scope="scope">
                    <span>{{ statusToText(scope.row.status)  }}</span>
                </template>
            </el-table-column>
            <el-table-column
                label="使用内容(预约理由)"
                show-overflow-tooltip
                align="center"
                min-width="200px"
                prop="orderResion"
            >
            </el-table-column>
            <el-table-column
                label="操作"
                align="center"
                width="200px"
                v-if="isShowByPermission('/resource/cancelOrderResource')"
            >
                <template slot-scope="scope">
                    <el-button size="small" type="text" :disabled="scope.row.status !== 5 && scope.row.status !== 3"
                               @click="cancelHandler(scope.row.isExamine, scope.row.id, scope.row.status)">取消预约
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
    import {mapGetters} from 'vuex';
    import BackTool from '@/components/BackTool';
     import ImagePreviewer from "@/components/ImagePreviewer/ImagePreviewer.vue";
    import {isShowByPermission} from '@/utils';
    import windowResizeMixin from '@/mixins/windowResize';
    import {resourceOrderList, cancelOrderResource} from '@/api/resourceOrder';

    export default {
        data: function () {
            return {
                searchLoading: false,
                searchTitle: '',
                pageSize: 20,
                pageNo: 1,
                pages: 1,
                dataList: [],
                total: 0
            }
        },
        mixins: [windowResizeMixin],
        components: {BackTool,ImagePreviewer},
        methods: {
              statusToText(status) {
                let textStr = '';
                switch (status) {
                    case '':
                    case -1:
                        textStr = '取消预约';
                        break;
                    case 0:
                        textStr = '待审核';
                        break;
                    case 1:
                        textStr = '使用中';
                        break;
                    case 2:
                        textStr = '未使用';
                        break;
                    case 3:
                        textStr = '同意预约';
                        break;
                    case 4:
                        textStr = '拒绝预约';
                        break;
                    case 5:
                        textStr = this.$store.getters.schoolInfo.id==7423?'预约成功':'预约中';
                        break;
                    case 6:
                        textStr = '已过期';
                        break;
                    case 7:
                        textStr = '使用结束';
                        break;
                    default:
                        break;
                }
                return textStr;
            },
            isShowByPermission,
            getAppointerNames(sendAppointerJson) {
                if (sendAppointerJson !== null) {
                    return JSON.parse(sendAppointerJson).map(dataEntry => dataEntry.name).join('，')
                } else {
                    return '';
                }
            },
            jumpToPage(path, query = {}) {
                this.$router.push({
                    path,
                    query
                })
            },
            resourceOrderListHandler() {
                return resourceOrderList({
                    pageSize: this.pageSize,
                    pageNo: this.pageNo,
                    searchTitle: this.searchTitle
                })
                    .then(res => res.data)
                    .then(data => {
                        this.searchLoading = false;
                        if (data.result) {
                            const pageData = data.data;
                            this.dataList = pageData.dataList;
                            this.total = pageData.pagination.total;
                            this.pages = pageData.pagination.pages;
                        } else {
                            this.$message.error('error');
                        }
                    })
                    .catch(error => {
                        this.searchLoading = false;
                        this.$message.error(error);
                    });
            },
            searchTitleHandler() {
                this.searchTitle = this.searchTitle.trim();
                this.searchLoading = true;
                this.pageNo = 1;
                this.resourceOrderListHandler();
            },
            sizeChangeHandler(pageSize) {
                this.pageSize = pageSize;
                this.pageNo = 1;
                this.resourceOrderListHandler();
            },
            currentChangeHandler(pageNo) {
                this.pageNo = pageNo;
                this.resourceOrderListHandler();
            },
            cancelHandler(isExamine, orderId, status) {
                if (status === 5 || status === 3) {
                    this.$confirm('是否确认要取消该预约？', '取消预约', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        cancelOrderResource({isExamine, orderId})
                            .then(res => {
                                const data = res.data;
                                if (data.result) {
                                    this.$message({
                                        message: '取消成功',
                                        type: 'success'
                                    });
                                    this.resourceOrderListHandler();
                                } else {
                                    this.$message.error('error');
                                }
                            }, error => {
                                this.$message.error(error);
                            })
                            .catch(error => {
                                this.$message.error(error);
                            });
                    })
                } else {
                    this.$message.error('非法操作！');
                }

            }
        },
        created() {
            this.resourceOrderListHandler();
        },
        computed: {
            ...mapGetters(['isStandalone'])
        },
        filters: {
            trimSeconds(value) {
                return value.slice(0, value.lastIndexOf(':'));
            },
          
        },
    }
</script>

<style scoped>
    .myorder-page {
        padding:12px;
    }
    .search-input--right {
        width: 240px!important;
        float: right;
    }
    .myorder-page .search-input {
        vertical-align: middle;
        margin-left: 10px;
        width: 220px;
    }

    .myorder-page .header {
        margin-bottom: 10px;
    }

    .myorder-page .table-expand {
        font-size: 0;
    }

    .myorder-page .table-expand label {
        width: 90px;
        color: #99a9bf;
    }

    .myorder-page .table-expand .el-form-item {
        margin-right: 0;
        margin-bottom: 0;
        width: 30%;
    }

    .myorder-page .whole-line.el-form-item {
        width: 100%;
    }

    .myorder-page .el-tooltip__popper {
        max-width: 500px;
        white-space: normal;
        word-wrap: break-word;
        word-break: break-all;
    }
</style>
