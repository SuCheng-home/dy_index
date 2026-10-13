<template>
    <div style="padding:12px">
        <div class="second-header-wrap">
            <el-button size="medium" @click="$router.back()" type="default">返回</el-button>
             <el-select size="medium" v-model="pagination.isSearch" @change="getList" placeholder="请选择">
                <el-option label="全部" :value="0"></el-option>
                <el-option label="未读" :value="1"></el-option>
                <el-option label="已读" :value="2"></el-option>
               </el-select>
            <el-button size="medium" @click="showQrCode" type="primary">二维码</el-button>
            <el-button type="primary" size="medium" @click="isImportDialogShow = true">导入</el-button>
             <a :href="exportURL()" download="导出" target="_blank" v-if="dataList.length">
                <el-button class="filter-item" type="primary" icon="upload" size="medium">导出</el-button>
            </a>
        </div>
        <div class="table-container">
            <el-table
                ref="messageTable"
                :data="dataList"
                class="messageTable custom—scrollbar"
                fit
                 :height="maxH"
                style="width: 100%"
                border
            >
                <el-table-column
                    v-for="(title, index) in titleList"
                    :label="title" align="center">
                    <template slot-scope="scope">
                        <span v-if="index == 0">{{scope.row.rosterKey}}</span>
                        <span v-else>{{scope.row.rosterValues[index - 1].fieldValue}}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    label="阅读状态" align="center" prop="state">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.isSearch == 2" type="success" size="mini" >已读</el-tag>
                        <el-tag v-if="scope.row.isSearch == 1" type="danger" size="mini">未读</el-tag>
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
        <el-dialog title="导入" :visible.sync="isImportDialogShow" :close-on-press-escape='false'
                   :close-on-click-modal='false' :modal-append-to-body='false' @open="onDialogOpen">
            <div class="bs-callout bs-callout-danger">
                <div class="title">导入说明：</div>
                <div>1.请先下载模板，严格根据模板的格式来录入数据。</div>
                <div>2.第一列为用户查询的标识列，请确保导入信息正确。</div>
                <div>3.第二列及以后为查询结果列。</div>
            </div>
            <div class="sns-btn-div">
                <el-upload class="upload-import" :action="uploadPath" :data="uploadData"
                           :show-file-list='false'
                           accept=".csv,.xls" :before-upload="beforeAvatarUpload"
                           :on-success="handleAvatarSuccess"
                           :on-error="handleAvatarErr" name="rosterFile">
                    <el-button type="primary" size="medium" :loading="importLoading">导入</el-button>
                </el-upload>
                <a :href="templateHref" target="_blank"
                   download="模板">
                    <el-button type="text">模板下载</el-button>
                </a>
                <div v-if="isUped">导入成功。共{{totalCount}}个，导入成功{{successTotal}}个</div>
            </div>

            <span slot="footer" class="dialog-footer">
            <el-button type="default" @click="isImportDialogShow = false" size="medium">关 闭</el-button>
          </span>
        </el-dialog>
    </div>
</template>

<script>
    import QRCode from 'qrcode';
   import mixins from '@/mixins/windowResize';
    import baseMixin from '@/mixins/baseMixin';
    import {getBatchStaterunEnrolInfoRosterPageList} from '@/api/infoSearch';
    export default {
        name: "infoSearchResultList",
        mixins: [baseMixin,mixins],
        data() {
            return {
                batchId: this.$route.query.batchId,
                batchName: this.$route.query.batchName,
                titleList: [],
                dataList: [],
                isShowQrCode: false,
                isImportDialogShow: false,
                templateHref: '',
                uploadData: {},
                uploadPath: '',
                successTotal: 0,
                totalCount: 0,
                importLoading: false,
                isUped: false,
                pagination:{
                    pageSize: 20,
                    pageNo:1,
                    pages: '',
                    total:'',
                    isSearch:0,
                    rosterKey:''
                }
            }
        },
           mounted() {
            this.getList();
            this.templateHref = global.BasePath + `structure/staterunEnrol/downloadImportRosterTemplateByBatchId?token=${this.$store.getters.token}&batchId=${this.batchId}`;
            this.uploadData = {token: this.$store.getters.token, batchId: this.batchId};
            this.uploadPath = global.BasePath + "structure/staterunEnrol/importEnrolInfoRosterDataByTemplate";
        },
        methods: {
            exportURL() {
                // const baseHref = global.command === 'production' ? 'https://www.zhxiaoyuan.cn/module-web/' : 'https://www.weixiaojia.net/module-web/';
                return `${global.BasePath}structure/staterunEnrol/exportBatchRosterList?isSearch=${this.pagination.isSearch}&rosterKey=${this.pagination.rosterKey}&batchId=${this.batchId}&token=${this.$store.getters.token}`;
            },
            beforeAvatarUpload(file) {
                let suffix = file.name.split(".")[file.name.split(".").length - 1];
                if (suffix != "csv" && suffix != "xls") {
                    this.$message.error("请上传模版文件!");
                } else {
                    this.importLoading = true;
                }
            },
            handleAvatarSuccess(res, file) {
                if (res.result) {
                    this.successTotal = res.data.successCount;
                    this.totalCount = res.data.totalCount;
                    this.importLoading = false;
                    this.isUped = true;
                    this.getList();
                } else {
                    this.importLoading = false;
                    this.$alert(res.msg, '提示', {
                        confirmButtonText: '确定'
                    });
                }
            },
            handleAvatarErr(err, file, fileList) {
            },
            onDialogOpen() {
                this.isUped = false;
            },
            getList() {
                getBatchStaterunEnrolInfoRosterPageList({
                    batchId: this.batchId,
                    pageNo: this.pagination.pageNo,
                    pageSize: this.pagination.pageSize,
                    isSearch:this.pagination.isSearch,
                    rosterKey: ''
                })
                    .then(res => res.data)
                    .then(data => {
                        const titleList = []
                        const dataList = data.data.dataList;
                        this.pagination.total = data.data.pagination.total;
                        if(dataList && dataList.length !== 0) {
                            dataList.forEach(item => {
                                item.rosterValues = JSON.parse(item.rosterValues);
                            })
                            titleList.push(dataList[0].rosterKeyName);
                            dataList[0].rosterValues.forEach(rosterItem => {
                                titleList.push(rosterItem.fieldName);
                            })
                        }
                        this.titleList = titleList;
                        this.dataList = dataList;
                    })
            },
            showQrCode() {
                const baseHref = window.location.href.indexOf('www.weixiaojia.net') !== -1 || window.location.href.indexOf('localhost') !== -1 ? 'https://www.weixiaojia.net/mobile/#/' : 'https://m.www.weixiaojia.cn/mobile/#/';

                QRCode.toDataURL(`${baseHref}primarySchoolSignup/infoSearch?batchId=${this.batchId}`)
                    .then(url => {
                        this.qrcodeUrl = url;
                        this.isShowQrCode = true;
                    })
                    .catch(err => {
                    });
            },
            currentChangeHandler() {
                this.getList();
            },
            sizeChangeHandler() {
                this.getList();
            },
            searchHandler() {
                this.getList();
            },
        }
    }
</script>

<style lang="scss" scoped>
    // @import "../../../styles/mixin.scss";

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
    .bs-callout {
        padding: 20px;
        margin: 20px 0;
        border: 1px solid #eee;
        border-left-width: 5px;
        border-radius: 3px;
    }

    .bs-callout-danger {
        border-left-color: #ce4844;
    }
    .sns-btn-div {
        height: 80px;
        padding-left: 20px;
        padding-top: 20px;
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

