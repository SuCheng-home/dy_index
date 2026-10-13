<template>
    <div class="lostPropertyDeclarationListReply">
        <div class="el-row">
            <back-tool style="border-bottom: 1px #ccc solid">
                <!--根据名称进行过滤形成一个新的数组进行渲染达到搜素的目的 v-model双向数据绑定实时更新搜索数据   当变化时触发函数进行过滤-->
                <el-input size="medium" placeholder="请输入查询姓名" class="search-input" v-model="getListQuery.searchName"
                          @change="handleInputChange" style='float: right; width: 20%;'>
                    <el-button size="medium" slot="append" icon="el-icon-search"></el-button>
                </el-input>
            </back-tool>
        </div>
        <div class="bd">
            <!--列表部分-->
            <el-table stripe ref="multipleTable" border :data="list" tooltip-effect="dark" :height="maxH">
                <el-table-column prop="title" align="left" label="回复人" width="160px">
                    <template slot-scope="scope">
                        <span>{{scope.row.replyUserName}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="title" align="left" label="回复内容" show-overflow-tooltip>
                    <template slot-scope="scope">

                        <span>{{scope.row.replyContext}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="title" align="center" label="回复图片" width="200px">
                    <template slot-scope="scope">
                        <span v-if="scope.row.replyPicList.length === 0">----</span>
                        <span v-else class="imgList">
							<div class="imgs">
								<image-previewer
                                        class="image-plate"
                                        :images="scope.row.replyPicList"
                                        tag="img"
                                        text="预览"
                                >
								</image-previewer>
							</div>
						</span>

                    </template>
                </el-table-column>
                <el-table-column prop="title" align="left" label="回复时间" width="200px">
                    <template slot-scope="scope">
                        <span>{{scope.row.replyTime|formatTimeFilter}}</span>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination-container">
                <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                               :current-page.sync="getListQuery.pageNo" :page-sizes="[10,20,30,40]"
                               :page-size="getListQuery.pageSize" layout="total, sizes, prev, pager, next, jumper"
                               :total="total">
                </el-pagination>
            </div>
        </div>
    </div>
</template>

<script>
    //返回按钮
    import BackTool from '@/components/BackTool';
    //lodash方法集合
    import debounce from 'lodash/debounce';
    //获取回复列表的方法
    import {pcReplyList} from '@/api/lostPropertyDeclaration';
    //引入监听发布时间方法将时间转换
    import {formatTime} from '@/utils';
    //窗口大小调整
    import mixin from '@/mixins/windowResize';
    //图片
    import ImagePreviewer from '@/components/ImagePreviewer/ImagePreviewer.vue';

    export default {
        name: 'lostPropertyDeclarationListReply',
        //引入文本框模块和返回模块
        components: {
            ImagePreviewer,
            BackTool
        },
        data: function () {
            return {
                getListQuery: {
                    id: this.$route.query.id,
                    pageNo: 1,
                    pageSize: 20,
                    searchName: ''
                },
                //获取的后台列表数据
                list: [], //存储数据
                total: null,
                replyPicList: [], //存储图片
                listImg: []
            }
        },
        //窗口大小调整
        mixins: [mixin],
        //过滤时间
        filters: {
            formatTimeFilter(date) {
                return date?date.slice(0,19):'';
            }
        },
        //钩子函数
        created() {
            this.pcReplyList()
        },
        methods: {
            //回复图片转换
            photoList(data) {
                if (data.length !== 0) {
                    let _this = this;
                    for (let item of data) {
                        let src = item.accessUrl;
                        let id = item.id;
                        let jsonImg = {
                            src: src,
                            id: id
                        };
                        _this.listImg.push(jsonImg)
                    }
                }
                return undefined;
            },

            //获取回复列表并进行转换
            pcReplyList() {
                let _this = this;
                _this.list = [];
                pcReplyList(this.getListQuery).then(res => {
                    let data = res.data.data;
                    _this.total = data.pagination.total;
                    for (let item of data.dataList) {
                        _this.photoList(item.replyPicList);
                        let replyContext = item.replyContext;
                        let replyTime = item.replyTime;
                        let replyUserName = item.replyUserName;
                        let replyPicList = _this.listImg;
                        let jsonObj = {
                            replyContext: replyContext,
                            replyTime: replyTime,
                            replyUserName: replyUserName,
                            replyPicList: replyPicList
                        };
                        _this.list.push(jsonObj);
                        _this.listImg = [];
                    }
                })
            },
            //分页
            handleSizeChange(val) {
                this.getListQuery.pageSize = val;
                this.pcReplyList()
            },
            handleCurrentChange(val) {
                this.getListQuery.pageNo = val;
                this.pcReplyList()
            },
            handleInputChange: debounce(
                function (val) {
                    this.getListQuery.searchName = val.trim();
                    this.pcReplyList()
                },
                // 这是我们为用户停止输入等待的毫秒数
                500
            ),
            //跳转启示详情
            goEnlightenment(id) {
                this.$router.push({
                    path: 'lostPropertyDeclarationDetails',
                    query: {
                        id: id
                    }
                })
            },
        }
    }
</script>

<style scoped>
    .lostPropertyDeclarationListReply {
        padding:12px;
    }
    .lostPropertyDeclarationListReply .imgList {
        color: #337ab7;
    }
     .img img {
        width: 80px;
        height: 80px;
        margin: 10px;
    }
</style>
