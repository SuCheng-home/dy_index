<template>
    <div class="activityMaterialList">
        <div class="header">
            <el-row>
                <el-col :span="19">
                    <el-button type="default" size="medium" @click="jumpTo('activityMyList')" v-if="fromType==0">返回
                    </el-button>
                    <el-button type="default" size="medium" @click="jumpTo2('activityDetail',{id:activityId})"
                               v-if="fromType==1">返回
                    </el-button>
                    <label id="file-upload-label" for="file-upload">上传资料</label>
                    <input type="file" ref="imgUpload" id="file-upload" accept="" @change="upload($event)"
                           style="display:none;">
                </el-col>
                <!-- <el-col :span="5">
                  <el-input class="search-input"
                            placeholder="搜索姓名" icon="search" size="medium" @keyup.enter.native="handleInputChange"
                            v-model.trim="listQuery.searchTitle">
                      <el-button slot="append" icon="el-icon-search" @click="handleInputChange"></el-button>
                  </el-input>
                </el-col> -->
            </el-row>
        </div>
        <div class="main-wrap">
            <el-table
                ref="multipleTable"
                :data="meetingUser"
                :height="maxH"
                v-loading="listLoading"
                border stripe
                style="width: 100%">
                <el-table-column
                    label="标题" show-overflow-tooltip>
                    <template slot-scope="scope">
            <span v-if="scope.row.type==0">
              <a class="link-type" :href="scope.row.accessUrl" download="filename">{{scope.row.title}}</a>
            </span>
                        <span v-else>
              <span v-if="scope.row.materialStatus==2">{{scope.row.title}}</span>
              <span v-else>问卷</span>
            </span>
                    </template>
                </el-table-column>
                <el-table-column
                    label="类型" align="center">
                    <template slot-scope="scope">
                        <span v-if="scope.row.type==0">活动资料</span>
                        <span v-else>活动问卷</span>
                    </template>
                </el-table-column>
                <el-table-column
                    label="状态" show-overflow-tooltip align="center">
                    <template slot-scope="scope">
            <span v-if="scope.row.type==0">
              <span v-if="scope.row.materialStatus==1">未发送</span>
              <span v-else>已发送</span>
            </span>
                        <span v-else>
              <span v-if="scope.row.materialStatus==1">未发布</span>
              <span v-else>已发布</span>
            </span>
                    </template>
                </el-table-column>
                <el-table-column
                    label="操作" show-overflow-tooltip align="center">
                    <template slot-scope="scope">
                        <div v-if="activityObject.activityType==0">
              <span v-if="activityObject.status!==0&&scope.row.materialStatus==1">
                <span v-if="scope.row.type==0">
                  <el-button size="small" type="text" @click="sendHandler(scope.row)">
                  发送
                  </el-button>
                </span>
                <span v-if="scope.row.type==1">
                  <el-button size="small" type="text">
                  发布
                  </el-button>
                </span>
              </span>
                            <span v-if="scope.row.type==0&&scope.row.materialStatus==1">
                <el-button size="small" type="text" @click="deleteHandler(scope.row.id)">
                  删除
                </el-button>
              </span>
                            <span v-if="scope.row.type==1&&scope.row.materialStatus==2">
                查看结果
              </span>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination
                class="pagination-container"
                v-show="!listLoading"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page.sync="listQuery.pageNo"
                :page-sizes="[10,20,30, 50]"
                :page-size="listQuery.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
            </el-pagination>
        </div>
        <el-dialog title="选择发送范围" :visible.sync="materialShowFlag" :close-on-click-modal="false">
            <div class="content-box">
                <el-checkbox v-model="sendQuery.isScope">全部人员</el-checkbox>
                <el-checkbox v-model="sendQuery.isApply" v-if="isApply">报名人员</el-checkbox>
                <el-checkbox v-model="sendQuery.isSign" v-if="isSign">签到人员</el-checkbox>
            </div>
            <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="sureMaterial">确 定</el-button>
        </span>
        </el-dialog>
    </div>
</template>
<script>
    import mixin from '@/mixins/windowResize';
    import _ from 'lodash';
    import moment from 'moment';
    import {mapGetters} from 'vuex';
    import {getWxCosFileSign} from '@/api/common/common';
    import {
        getActivityInfo,
        addActivityMaterialFile,
        getActivityMaterialPageList,
        delActivityMaterial,
        sendActivityMaterialFile
    } from '@/api/activity';

    export default {
        data() {
            return {
                activityId: this.$route.query.activityId,
                fromType: this.$route.query.fromType,
                listQuery: {
                    pageNo: 1,
                    pageSize: 20,
                    searchTitle: ''
                },
                statusList: [],
                total: 0,
                listLoading: false,
                meetingUser: [],
                allFileTypeList: ["doc", "docx", "xls", "xlsx", "ppt", "pptx", "pdf"],
                cos: null,
                bucket: '',// 存储桶名称，需修改
                region: 'ap-shanghai',
                addLoading: false,
                activityObject: {},
                materialShowFlag: false,
                sendQuery: {
                    id: 0,
                    isApply: 0,
                    isScope: 0,
                    isSign: 0,
                    materialStatus: 0,
                    type: 0,
                    voteId: 0
                },
                isApply: 0,
                isSign: 0
            }
        },
        computed: {
            ...mapGetters(['schoolInfo'])
        },
        created() {
            this.meetingUser = [];
            //详情
            this.getActivityInfoFunc();
        },
        mounted() {
            this.twoTypeFunc();
            getWxCosFileSign({
                sysBucket: 1
            })
                .then(res => res.data)
                .then(data => {
                    if (data.result) {
                        const pageData = JSON.parse(data.data);
                        this.bucket = pageData.bucketName;
                        //实例化COS对象
                       //实例化COS对象
                        if(this.bucket=='wxtestfile-1251008840'||this.bucket=='wxcepfile-1251008840'){
                            this.cos = new COS({
                            Domain:global.command === 'production' ?'cos.zhxiaoyuan.cn':'cos.weixiaojia.net',
                            // 必选参数
                            getAuthorization: function (options, callback) {
                                callback({
                                    TmpSecretId: pageData.credentials.tmpSecretId,// 你的固定密钥SecretId，需修改
                                    TmpSecretKey: pageData.credentials.tmpSecretKey,// 你的固定密钥SecretKey，需修改
                                    XCosSecurityToken: pageData.credentials.sessionToken,
                                    ExpiredTime: pageData.expiredTime
                                });
                            }
                        });
                        }else{
                            this.cos = new COS({
                            // 必选参数
                            getAuthorization: function (options, callback) {
                                callback({
                                    TmpSecretId: pageData.credentials.tmpSecretId,// 你的固定密钥SecretId，需修改
                                    TmpSecretKey: pageData.credentials.tmpSecretKey,// 你的固定密钥SecretKey，需修改
                                    XCosSecurityToken: pageData.credentials.sessionToken,
                                    ExpiredTime: pageData.expiredTime
                                });
                            }
                        });
                        }
                    } else {
                        this.$message.error(data.msg);
                    }
                })

        },
        mixins: [
            mixin
        ],
        filters: {
            filterTime(date) {
                return date ? date.slice(0, 19) : ''
            },
            filterStartTime(date) {
                return date ? date.slice(0, 16) : ''
            }
        },
        methods: {
            sureMaterial() {
                if ((!this.sendQuery.isScope && !this.sendQuery.isApply && !this.sendQuery.isSign)) {
                    this.$message({
                        message: '请选择人员!',
                        type: 'error'
                    });
                    return false;
                }
                sendActivityMaterialFile({
                    activityId: this.activityId,
                    id: this.sendQuery.id,
                    isScope: this.sendQuery.isScope ? 1 : 0,
                    isApply: this.sendQuery.isApply ? 1 : 0,
                    isSign: this.sendQuery.isSign ? 1 : 0,
                    materialStatus: this.sendQuery.materialStatus,
                    type: this.sendQuery.type
                }).then(res => res.data).then(data => {
                    if (data.code === 200) {
                        this.materialShowFlag = false;
                        this.$message({
                            message: '发送成功!',
                            type: 'success'
                        });
                        this.twoTypeFunc();
                    } else {
                        this.materialShowFlag = false;
                        this.$message({
                            message: `${data.msg}`,
                            type: 'error'
                        });
                    }
                }).catch(() => {
                    this.materialShowFlag = false;
                    this.$message({
                        message: `${data.msg}`,
                        type: 'error'
                    });
                });
            },
            sendHandler(row) {
                this.materialShowFlag = true;
                this.sendQuery.materialStatus = row.materialStatus;
                this.sendQuery.type = row.type;
                this.sendQuery.id = row.id;
            },
            deleteHandler(id) {
                //单个删除
                this.$confirm('您确认删除当前活动资料吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    delActivityMaterial({
                        materialId: id
                    }).then(res => res.data).then(data => {
                        if (data.code === 200) {
                            this.$message({
                                message: '删除成功!',
                                type: 'success'
                            });
                            this.twoTypeFunc();
                        }
                    }).catch(() => {
                    });
                }).catch(() => {

                });
            },
            getActivityInfoFunc() {
                getActivityInfo({
                    activityId: this.activityId
                }).then(res => res.data)
                    .then(data => {
                        if (data.code === 200 && data.data) {
                            const activityData = data.data;
                            this.activityObject = data.data
                            ;
                            this.isApply = this.activityObject.isApply;
                            this.isSign = this.activityObject.isSign;
                        }
                    })
            },
            upload(e) {
                const timestamp = new Date().valueOf();
                const file = this.$refs.imgUpload.files[0];
                const fileExt = file.name.replace(/.+\./, "").toLowerCase();   //正则表达式获取后缀
                const year = moment().format('YYYY');
                const Key = `/huodong/${year}/${timestamp}/${file.name}`;

                if (this.allFileTypeList.indexOf(fileExt) === -1) {
                    this.$message({
                        message: `请上传后缀名为[${this.allFileTypeList.join(', ')}]的文件`,
                        type: 'error'
                    });
                } else {
                    var loading = this.$loading({
                        lock: true,
                        text: 'Loading',
                        target: document.querySelector(".activityMaterialList"),
                        spinner: 'el-icon-loading',
                        background: 'rgba(255, 255, 255, 0.7)'
                    });
                    this.cos.putObject({
                        Bucket: this.bucket,
                        Region: this.region,
                        Key,
                        Body: file,
                        onTaskReady(taskId) {
                        }
                    }, (err, data) => {
                        if (err) {
                            this.$message.error(err.error)
                        } else {
                            this.cos.putObjectTagging({
                                Bucket: this.bucket, /* 必须 */
                                Region: this.region,     /* 存储桶所在地域，必须字段 */
                                Key, /* 存储在桶里的对象键（例如1.jpg，a/b/test.txt），必须字段 */
                                Tags: [
                                    {"Key": "year", "Value": year},
                                    {"Key": "school", "Value": this.schoolInfo.id},
                                    {"Key": "module", "Value": 'huodong'},
                                    {"Key": "modulecode", "Value": '1210'}
                                ],
                                // VersionId: 'MTg0NDUwOTMyODM1MDg2MTA1xxx' /* 对象版本 ID，非必须 */
                            }, (err, _1) => {
                                let fileUrl = `https://${data.Location}`;
                                addActivityMaterialFile({
                                    accessUrl: fileUrl,
                                    activityId: this.activityId,
                                    title: file.name,
                                    type: 0,
                                    materialStatus: 1
                                }).then(res => res.data).then(data => {
                                    if (data.code === 200) {
                                        loading.close();
                                        this.$message({
                                            message: '上传资料成功!',
                                            type: 'success'
                                        });
                                        this.twoTypeFunc();
                                    } else {
                                        loading.close();
                                    }
                                }).catch(() => {
                                    loading.close();
                                })
                            });

                        }
                    })
                }
            },
            twoTypeFunc() {
                this.listLoading = true;
                getActivityMaterialPageList({
                    activityId: this.activityId,
                    pageNo: this.listQuery.pageNo,
                    pageSize: this.listQuery.pageSize,
                    searchTitle: this.listQuery.searchTitle
                }).then(res => res.data).then(data => {
                    if (data.code === 200) {
                        this.listLoading = false;
                        let meetingData = data.data;
                        this.meetingUser = meetingData.dataList;
                        if (this.meetingUser.length == 0 && this.listQuery.pageNo !== 1) {
                            this.listQuery.pageNo--;
                            this.twoTypeFunc();
                        }
                        this.total = meetingData.pagination.total;
                    } else {
                        this.listLoading = false;
                    }
                }).catch(() => {
                    this.listLoading = false;
                })

            },

            jumpTo(path, query = {}) {
                this.$router.push({
                    path,
                    query
                })
            },
            jumpTo2(path, query = {}) {
                this.$router.replace({
                    path,
                    query
                });
                this.$router.back();
            },
            handleInputChange: _.debounce(
                function () {
                    this.listQuery.pageNo = 1;
                    this.twoTypeFunc();
                },
                // 这是我们为用户停止输入等待的毫秒数
                500
            ),
            handleSizeChange(val) {
                this.listQuery.pageNo = 1;
                this.listQuery.pageSize = val;
                this.twoTypeFunc();
            },
            handleCurrentChange(val) {
                this.listQuery.pageNo = val;
                this.twoTypeFunc();
            }
        }
    }
</script>
<style lang="scss" scoped>
    .activityMaterialList {
        padding: 12px;
        box-sizing: border-box;

        .header {
            margin-bottom: 10px;
        }

        .main-wrap {
            padding-top: 0 !important;

            .imgSize {
                width: 25px;
                height: 25px;
            }
        }
    }

    #file-upload-label {
        display: inline-block;
        line-height: 12px;
        white-space: nowrap;
        cursor: pointer;
        -webkit-appearance: none;
        text-align: center;
        box-sizing: border-box;
        outline: 0;
        transition: .1s;
        font-weight: 500;
        -moz-user-select: none;
        padding: 12px 20px;
        font-size: 14px;
        border-radius: 4px;
        color: #FFF;
        background-color: #409EFF;
        border-color: #409EFF;

        &:hover {
            background: #66b1ff;
            border-color: #66b1ff;
            color: #FFF;
        }
    }
</style>

<style scoped>
    .activityMaterialList .search-input {
        margin: 0;
    }
</style>
