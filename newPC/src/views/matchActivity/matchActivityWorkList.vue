<template>
    <div id="matchActivityWorkList" class="app-container calendar-list-container">
        <div class="filter-container">
            <el-row>
                <el-col :span="19">
                    <div class="btns">
                        <el-button type="default" size="medium" @click="$router.back()">返回</el-button>
                        <el-button v-if="status == 4" :disabled="btnDisabled" type="primary" size="medium" @click="endActivityHandler">{{isCompare == 1 ? '发布得奖' : '结束活动'}}</el-button>
                    </div>
                </el-col>
                <el-col :span="5">
                    <el-input size="medium"
                              placeholder="请输入作品标题" icon="el-icon-search" @keyup.enter.native="handleFilter"
                              v-model="workTitle">
                        <el-button slot="append" icon="el-icon-search" @click="handleFilter"></el-button>
                    </el-input>
                </el-col>
            </el-row>
        </div>
        <el-table stripe :data="dataList" border fit highlight-current-row
                  style="width: 100%" :height="maxH">
            <el-table-column align="center" label="作品标题" show-overflow-tooltip>
                <template slot-scope="scope">
                    <span class="link-type" @click="showDetailHandler(scope.row)">
                        {{scope.row.workTitle}}
                    </span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="学生" show-overflow-tooltip>
                <template slot-scope="scope">
                    {{scope.row.userName}}-{{scope.row.className}}
                </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip align="center" label="上传时间">
                <template slot-scope="scope">
                    <template>
                        <span>{{scope.row.createTime | trimTime}}</span>
                    </template>
                </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip align="center" label="浏览量" prop="viewCount">

            </el-table-column>
            <el-table-column show-overflow-tooltip align="center" label="点赞数" prop="praiseCount">
            </el-table-column>
            <el-table-column v-if="isCompare == 1" show-overflow-tooltip align="center" label="投票数" prop="voteNum">
            </el-table-column>
            <el-table-column class-name="status-col" align="center" label="奖项" prop="rankName" v-if="isCompare == 1">
            </el-table-column>
            <el-table-column align="center" label="操作">
                <template slot-scope="scope">
                    <el-button size="small" type="text"
                               @click="showDetailHandler(scope.row)">查看
                    </el-button>
                </template>
            </el-table-column>

        </el-table>
        <div class="pagination-container">
            <el-pagination
                @size-change="sizeChangeHandler"
                @current-change="currentChangeHandler"
                :current-page.sync="pagination.pageNo"
                :page-sizes="[10 , 20, 30, 50]"
                :page-size="pagination.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="pagination.total"
            >
            </el-pagination>
        </div>
        <el-dialog title="作品详情" :visible.sync="isShowDetailDialog" size="tiny" width="600px"
                   :close-on-click-modal="false" :close-on-press-escape="false" @close="dialogCloseHanlder">
            <div class="dialog-form-container">
                <el-form>
                    <el-form-item label="作品标题"  label-width="100px">
                        {{currentWork.workTitle}}
                    </el-form-item>
                    <el-form-item label="介绍" label-width="100px">
                        {{currentWork.workRemark}}
                    </el-form-item>
                    <el-form-item v-if="workType == 1" label=" " label-width="100px">
                        <div class="pic-container" v-if="currentWork.files && currentWork.files.length !== 0">
                            <image-previewer tag="richtext" viewclass="image_view" :images="currentWork.files">
                                <ul>
                                    <li class="pic image_view" v-for="(picItem, index) in currentWork.files"
                                        :style="`background-image: url(${picItem.src})`"
                                        :key="index">
                                    </li>
                                </ul>
                            </image-previewer>
                        </div>

                    </el-form-item>
                    <el-form-item v-else-if="currentWork.files && currentWork.files[0]" label=" " label-width="100px">
                        <div>
                            <video id="video-container" :src="currentWork.files[0].url" class="video-container" controls="controls"></video>
                        </div>
                    </el-form-item>
                </el-form>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="isShowDetailDialog = false" size="medium">关 闭</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import ImagePreviewer from '@/components/ImagePreviewer/ImagePreviewer.vue';
    import debounce from 'lodash/debounce';
    import mixin from '@/mixins/windowResize';
    import baseMixin from '@/mixins/baseMixin';
    import {isShowByPermission} from '@/utils';
    import {
        getAllActivityWorkPageList,
        finishWonderfulActivityById,
        getWonderfulActivityInfoById
    } from '@/api/matchActivity';
    export default {
        data() {
            return {
                activityId: this.$route.query.activityId,
                status: this.$route.query.status,
                workType: -1,
                isCompare: -1,
                btnDisabled: false,
                isShowDetailDialog: false,
                dataList: [],
                workTitle: '',
                tableKey: 0,
                selected: [],
                currentWork: {
                }
            }
        },
        created() {
            getWonderfulActivityInfoById({id: this.activityId})
                .then(res => res.data)
                .then(data => {
                    console.log(data.data);
                    this.workType = data.data.workType;
                    this.isCompare = data.data.isCompare;
                    this.getList();
                });
        },
        components: {ImagePreviewer},
        mixins: [mixin, baseMixin],
        filters: {
            statusFilter(status) {
                const statusMap = {
                    published: 'success',
                    draft: 'gray',
                    deleted: 'danger'
                };
                return statusMap[status]
            },
            trimTime(datetime) {
                return datetime ? datetime.slice(0, datetime.lastIndexOf('.')) : '--';
            },
            trimTimeMinute(datetime) {
                return datetime ? datetime.slice(0, datetime.lastIndexOf(':')) : '--';
            }
        },
        methods: {
            isShowByPermission,
            showDetailHandler(item) {
                this.isShowDetailDialog = true;
                this.currentWork = item;
            },
            endActivityHandler() {
                this.$confirm(this.isCompare == 1 ? '发布后，奖项确定、投票结束，确定发布？' : '结束后，学生不可再上报作品，是否结束？', this.isCompare == 1 ? '发布' : '结束', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.btnDisabled = true;
                    finishWonderfulActivityById({
                        id: this.activityId
                    })
                        .then(res => res.data)
                        .then(data => {
                            if(data.result) {
                                this.$message.success(this.isCompare == 1 ? '发布成功' : '结束成功');
                                this.getList();
                            }
                        })
                });
            },
            getList() {
                getAllActivityWorkPageList({
                    pageNo: this.pagination.pageNo,
                    pageSize: this.pagination.pageSize,
                    workTitle: this.workTitle,
                    userId: 0,
                    activityId: this.activityId
                })
                    .then(res => res.data)
                    .then(data => {
                        data.data.dataList.forEach(item => {
                            let files = JSON.parse(item.filesJson);
                            console.log('files', files)
                            if(this.workType == 1) {
                                files = files.map(url => ({
                                    src: url
                                }));
                            }
                            item.files = files;
                        });
                        this.dataList = data.data.dataList;
                        this.pagination.total = data.data.pagination.total;
                    })
            },
            handleFilter: debounce(function () {
                this.pagination.pageNo = 1;
                this.getList();
            }, 500),
            sizeChangeHandler(pageSize) {
                this.pagination.pageSize = pageSize;
                this.pagination.pageNo = 1;
                this.getList();
            },
            currentChangeHandler(pageNo) {
                this.pagination.pageNo = pageNo;
                this.getList();            },
            jumpToPage(path, query = {}) {
                this.$router.push({
                    path,
                    query
                })
            },
            dialogCloseHanlder() {
                this.currentWork = {};
            }
        }
    }
</script>
<style lang="scss">
    @import "../../styles/mixin";
    #matchActivityWorkList {
        .pagination-container {
            margin-top: 10px;
        }
        .el-icon-paperclip {
            margin-right: 3px;
        }
        .filter-container {
            @include clearfix;
        }
        .btns {
            height: 36px;
        }
        .pic-container {
            ul {
                list-style-type: none;
                @include clearfix();
                .image_view {
                    @include backgroundCover(100px, 100px);
                    float: left;
                    margin: 0 10px 10px 0;
                }
            }
        }
        video {
            width: 100%;
            border: 1px solid #3e3e3e;
            box-sizing: border-box;
            height: 220px !important;
        }
        .dialog-form-container {
            padding-right: 20px;
        }
    }

</style>
