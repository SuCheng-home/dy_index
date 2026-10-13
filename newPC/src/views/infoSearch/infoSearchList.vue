<template>
    <div id="schoolSignupNoticeList">
        <div class="second-header-wrap">
            <el-button type="primary" @click="jumpToPage('infoSearchAdd')" size="medium">新增查询批次</el-button>
        </div>
        <div class="table-container">
            <el-table
             :height="maxH"
                ref="messageTable"
                :data="dataList"
                class="messageTable custom—scrollbar"
                fit
                style="width: 100%"
                border
            >
                <el-table-column
                    label="批次名称" align="center">
                    <template slot-scope="scope">
                        <span class="link-type" @click="jumpToPage('infoSearchResultList', {batchId: scope.row.id, batchName: scope.row.batchName})">{{scope.row.batchName}}</span>
                    </template>
                </el-table-column>
                <el-table-column
                        label="导入数量" align="center" show-overflow-tooltip width="120">
                    <template slot-scope="scope">
                        {{scope.row.importCount}}
                    </template>
                </el-table-column>
                 <el-table-column
                        label="阅读数量" align="center" show-overflow-tooltip width="120">
                    <template slot-scope="scope">
                        {{scope.row.searchCount}}
                    </template>
                </el-table-column>
                <el-table-column
                    label="操作人" align="center" show-overflow-tooltip prop="createUser">
                </el-table-column>
                <el-table-column
                    label="导入时间" align="center">
                    <template slot-scope="scope">
                        <span>{{scope.row.createTime | timeSuffixFilter}}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    label="操作" align="center">
                    <template slot-scope="scope">
                        <el-button size="small" type="text" @click.native="showQrCode(scope.row)">
                            二维码
                        </el-button>
                        <el-button size="small" type="text" @click.native="deleteFunc(scope.row)" class="buttontextred">
                            删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="pagination-container">
            <el-pagination
                @size-change="sizeChangeHandler"
                @current-change="currentChangeHandler"
                :current-page.sync="pagination.pageNo"
                :page-sizes="[10 , 20, 30, 50]"
                :page-size.sync="pagination.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :page-count="pagination.pages"
                :total="pagination.total"
            >
            </el-pagination>
        </div>
        <el-dialog :close-on-click-modal='false' title="二维码" :visible.sync="isShowQrCode" width="400px">
            <div style="text-align: center;">
                <img :src="qrcodeUrl" class="qrcode" />
                <div class="batch-name">{{batchName}}</div>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button size="medium" @click="isShowQrCode=false">关 闭</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import QRCode from 'qrcode'
    import {
        getSchoolStaterunEnrolInfoBatchPageList,
        deleteStaterunEnrolInfoBatchById
    } from '@/api/infoSearch';
    import baseMixin from '@/mixins/baseMixin';
    import mixins from '@/mixins/windowResize';
    import {mapGetters} from 'vuex';

    export default {
        name: "ReviewOffline",
        data() {
            return {
                batchName: '',
                dataList: [],
                searchVal: '',
                isShowQrCode: false,
                qrcodeUrl: ''
            }
        },
        computed: {
            ...mapGetters(['userInfo', 'permission'])
        },
        created() {
            this.getList();

        },
        mixins: [baseMixin,mixins],
        methods: {
            currentChangeHandler() {
                this.getList();
            },
            sizeChangeHandler() {
                this.getList();
            },
            searchHandler() {
                this.getList();
            },
            getList() {
                getSchoolStaterunEnrolInfoBatchPageList({
                    batchName: '',
                    pageNo: this.pagination.pageNo,
                    pageSize: this.pagination.pageSize
                })
                    .then(res => res.data)
                    .then(data => {
                        this.dataList = data.data.dataList;
                        this.pagination.total = data.data.pagination.total;
                    })
            },
            deleteFunc({id}) {
                this.$confirm('是否删除该批次?', '删除', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    deleteStaterunEnrolInfoBatchById({
                        id
                    })
                        .then(res => res.data)
                        .then(data => {
                            if (data.result) {
                                this.$message({
                                    type: 'success',
                                    message: '删除成功！'
                                });
                                this.getList();
                            } else {
                                this.$message.error(data.msg);
                            }
                        })
                });
            },
            showQrCode(obj) {
                this.batchName = obj.batchName;
                const baseHref = window.location.href.indexOf('www.weixiaojia.net') !== -1 || window.location.href.indexOf('localhost') !== -1 ? 'https://www.weixiaojia.net/mobile/#/' : 'https://m.www.weixiaojia.cn/mobile/#/';

                QRCode.toDataURL(`${baseHref}primarySchoolSignup/infoSearch?batchId=${obj.id}`)
                    .then(url => {
                        this.qrcodeUrl = url;
                        this.isShowQrCode = true;
                    })
                    .catch(err => {
                    });
            }
        }
    }
</script>

<style lang="scss" scoped>
    // @import "../../../styles/mixin.scss";
   #schoolSignupNoticeList{
       padding: 12px;
   }
    .second-header-wrap {
        padding-bottom: 10px;
        background-color: #fff;
        z-index: 1000;
    }
    .main-wrap {
        width: 100%;
        margin-top: 229px;
    }

    .main-container {
        width: 1320px;
        padding: 30px 10px;
        margin: 0 auto;
        min-height: 560px;
    }

    .custom—scrollbar {
        overflow-x: hidden;
        overflow-y: auto;
    }

    .custom—scrollbar::-webkit-scrollbar {
        width: 6px;
        background-color: rgba(255, 255, 255, 0.1);
    }

    .custom—scrollbar::-webkit-scrollbar-thumb {
        background-color: #999;
    }

    .custom—scrollbar::-webkit-scrollbar-track {
        background-color: rgba(255, 255, 255, 0.1);
    }
    .link-type,
    .link-type:focus {
        color: #409EFF;
        cursor: pointer;

        &:hover {
            color: rgb(32, 160, 255);
        }
    }
    .qrcode {
        width: 200px;
        height: 200px;
    }
    .batch-name {
        font-size: 18px;
        font-weight: bold;
    }
</style>
<style>
    #schoolSignupNoticeList a {
        color: #409EFF;
        text-decoration: none;
    }
    .addExamBox .el-radio__label{
        display: inline-block;
        min-width:42px;
    }
</style>

