<template>
    <div class="campusCircle">
        <div class="top">
            <el-button @click="$router.back()" type="default" size="medium">返回</el-button>
            <el-select v-model="listQuery.isDigest" placeholder="请选择" size="medium" @change="onDigestChange()"
                       v-if="$route.query.status == 1">
                <el-option label="全部校园圈" :value="0"></el-option>
                <el-option label="加精" :value="1"></el-option>
            </el-select>
            <template v-if="listQuery.isDigest == 0" >
                <el-select v-model="selectType" placeholder="请选择" @change="typeChange">
                    <el-option label="全部用户类型" value="0"></el-option>
                    <el-option label="学生" value="1"></el-option>
                    <el-option label="老师" value="2"></el-option>
                </el-select>
                <el-select v-model="gradeId2" placeholder="请选择" v-if="selectType == 1" @change="gradeId2Change">
                    <el-option label="全部年级" value="0"></el-option>
                    <el-option v-for="item in gradeOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
                <el-select v-model="classId2" placeholder="请选择" @change="retrievaltime" v-if="selectType == 1">
                    <el-option label="全部班级" value="0"></el-option>
                    <el-option v-for="item in classOptions2" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
            </template>

            <el-button type="primary" size="medium" @click="print()">打印</el-button>
        </div>
        <div class="subject" :style="`height: ${nobottommaxH + 30}px;`" id="boxDiv">
            <!-- 圈子 -->
            <div cla ss="Box">
                <!-- 白色盒子 -->
                <div class="middle_content" ref="print">
                    <!-- 主体 -->
                    <div class="inner_content">
                        <!-- 主体头部 -->
                        <div class="top_content">
                            <img class="img"
                                 src="https://cdnfile-10043692.file.myqcloud.com/admin/images/campus_circle/circle.png"/>
                            <span v-html="strToHtml(title)"></span>
                        </div>
                        <div class="list">
                            <div class="noTime" v-if="contentList.length == 0">
                                暂无数据
                            </div>
                            <div v-else>
                                <div class="classCircleDetailsInfo" :key="indexs"
                                     v-for="(items, indexs) in contentList">
                                    <div class="top-box">
                                        <img class="top-name-img"
                                             :src="items.type == 1 ? items.stuAvatar : items.createAvatar" alt=""/>
                                        <div class="top-name-name">
                                            {{ items.type == 1 ? items.stuName : items.createName }}{{ items.type == 1 ?
                                            '(' + items.className + ')' : '' }}&nbsp;&nbsp;

                                            <el-tag size="mini" v-if="items.circleTypeId != 0">{{ items.circleTypeName
                                                }}
                                            </el-tag>
                                            &nbsp;&nbsp;
                                            <img v-if="items.isDigest == 1"
                                                 src="https://cdnfile-10043692.file.myqcloud.com/mobile/images/Presentation/best_flag.gif"
                                                 alt="" class="img-jing"/>
                                            <!-- 置顶图 -->
                                            <img v-if="items.isTop == 1"
                                                 src="../../assets/images/schoolCircle/topLogo.png" alt=""
                                                 style="width: 22px; height: 15px"/>
                                        </div>
                                        <div class="top-name-time">{{ items.createDate.slice(0, 19) }}</div>
                                        <span class="ispan" v-if="$route.query.status == 2">
											<i class="el-icon-circle-check"
                                               @click="approveSchoolCircles(2, items.id)"></i>
											<i class="el-icon-circle-close"
                                               @click="approveSchoolCircles(3, items.id)"></i>
										</span>
                                    </div>
                                    <div class="txt-box">

                                        <div v-html="strToHtml(items.content)"></div>
                                        <image-previewer tag="richtext" v-if="items.picJson">
											<span class="img" :key="index"
                                                  v-for="(item, index) in JSON.parse(items.picJson)">
												<img :src="item.picUrl"/>
											</span>
                                        </image-previewer>
                                        <div class="photo" @click="showVideo(items)" v-if="items.videoUrl.length && JSON.parse(items.videoUrl)[0].videoUrl != ''" :style="{backgroundImage: `url(${JSON.parse(items.videoUrl)[0].videoCover || 'https://cdnfile-10043692.file.myqcloud.com/admin/images/video-bg-default-2.png'})`}"></div>
                                    </div>
                                    <div class="partingLine">
                                        <div class="el-row">
                                            <div class="leftLine el-col el-col-16"></div>
                                            <div class="rightLine el-col el-col-8"></div>
                                        </div>
                                    </div>
                                    <div class="foot-box">
                                        <div class="i-box">点赞人数 &nbsp;{{ items.fabulousList.length }}&nbsp; &nbsp;
                                            &nbsp; &nbsp;评论人数 &nbsp;{{ items.commentList.length }}
                                        </div>
                                        <div class="foot-box-ul" v-if="items.commentList.length">
                                            <div class="foot-box-ul-li" :key="index"
                                                 v-for="(item, index) in items.commentList">
                                                <img :src="item.commentAvatar" alt=""/>
                                                <div class="foot-box-ul-li-name">
                                                    {{ item.commentUser }}{{ item.type == 1 ? '(' + item.departNames +
                                                    ')' : '' }}
                                                    <!-- <span v-if="item.type != 1">&nbsp;回复&nbsp;{{ item.receiveUser }}</span> -->
                                                    <span class="foot-box-ul-li-time">{{ item.commentDate.slice(0, -2) }}</span>
                                                </div>
                                                <div class="foot-box-ul-li-txt"
                                                     v-html="strToHtml(item.commentContent)"></div>
                                                <i @click="deleteComment(indexs, index, item.id)" class="el-icon-delete"
                                                   style="position: absolute;bottom: 20px;right:15px;color:red"></i>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="foot">{{ footName }}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <el-dialog title="视频" :visible.sync="isShowVideo" custom-class="video-dialog">
            <div>
                <video id="video-container" :src="videoUrl" class="video-container" controls="controls"></video>
            </div>
        </el-dialog>
    </div>
</template>
<script>

    import {
        querySchoolGrade, queryClassByGradeId,
        queryPcSchoolfellowCircle,
        deleteComment,
        auditSchoolfellowCircle,
        queryDigestSchoolfellowCircle
    } from '@/api/schoolCircle'
    import ImagePreviewer from '@/components/ImagePreviewer/ImagePreviewer.vue'
    import mixin from '@/mixins/windowResize'
    import {strToHtml} from '@/utils/utils'

    export default {
        data() {
            return {
                listQuery: {
                    topicId: this.$route.query.id,
                    status: this.$route.query.status,
                    pageNo: 1,
                    pageSize: 10,
                    isDigest: 0
                },
                scollY: '', //底部距离
                pullRefreshss: true, //是否下拉刷新
                lastPage: '', //总页数
                footName: '', //提示
                contentList: [],
                title: '',

                gradeId2: '0',
                classId2: '0',
                selectType: '0',
                gradeOptions: [],
                classOptions2: [],

                isShowVideo: false,
                videoUrl: '',
            }
        },
        mixins: [mixin],
        mounted: function () {
            window.addEventListener('scroll', this.scrollChange, true)
            this.querySchoolGrade()

        },
        components: {ImagePreviewer},
        created() {
            this.retrievaltime()
            // this.getSchoolCircleTopicInfoByIds()
        },
        methods: {
            strToHtml,
            showVideo(items) {
                this.isShowVideo = true;
                this.videoUrl = JSON.parse(items.videoUrl)[0].videoUrl;
            },
            onDigestChange() {
                this.gradeId2 = '0'
                this.classId2 = '0'
                this.selectType = '0'
                this.retrievaltime();
            },
            gradeId2Change() {
                this.classId2 = '0'
                this.classOption2 = []
                if (this.gradeId2 != 0) this.queryClassByGradeId()
                this.retrievaltime()
            },
            typeChange() {
                if (this.selectType != 1) {
                    this.gradeId2 = '0'
                    this.classId2 = '0'
                }
                this.retrievaltime()
            },
            // 年级列表
            querySchoolGrade() {
                querySchoolGrade().then(res => {
                    this.gradeOptions = res.data.data.map(v => {
                        return { label: v.name, value: v.id }
                    })
                })
            },
            // 班级列表
            queryClassByGradeId() {
                queryClassByGradeId(this.gradeId2).then(res => {
                    this.classOptions2 = res.data.data.map(v => {
                        return { label: v.name, value: v.id }
                    })
                })
            },
            campusCircledetails() {
                this.$router.push({
                    path: 'campusCircledetails',
                    query: {id: this.$route.query.id}
                })
            },
            deleteComment(indexs, index, id) {
                this.$confirm('确认要删除该评论吗?', '删除评论', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                    lockScroll: false
                })
                    .then(() => {
                        deleteComment({id: id}).then(res => {
                            if (res.data.code === 200) {
                                this.contentList[indexs].commentList.splice(index, 1)
                                this.$message.success('删除成功')
                            }
                        })
                    })
                    .catch(() => {
                    })
            },
            approveSchoolCircles(num, id) {
                this.$confirm('确认要' + (num == 2 ? '审核通过' : '审核不通过') + '吗？', num == 2 ? '通过' : '不通过', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                    lockScroll: false
                })
                    .then(() => {
                        auditSchoolfellowCircle({auditContent: '', auditState: num, id: id}).then(res => {
                            if (res.data.code === 200) {
                                this.$message.success('审批成功')
                                this.retrievaltime()
                            } else {
                                this.$message.error(res.data.msg)
                            }
                        })
                    })
                    .catch(() => {
                    })
            },
            //打印
            print() {
                this.$print(this.$refs.print)
            },
            //缓加载下拉加载ajax
            scrollChange: function () {
                let _this = this
                // 加页码数
                let clientHeight = document.documentElement.clientHeight || document.body.clientHeight // 设备/屏幕高度
                let scrollObj = document.getElementById('boxDiv') // 滚动区域
                let scrollTops = scrollObj.scrollTop // div 到头部的距离
                let scrollHeight = scrollObj.scrollHeight // 滚动条的总高度
                this.scollY = scrollTops + clientHeight - scrollHeight
                // 把下拉刷新置为false，防止多次请求
                if (this.scollY >= 0) {
                    if (this.listQuery.pageNo > this.lastPage - 1) {
                        this.footName = '已加载全部'
                        return false
                    }
                    if (!this.pullRefreshss) {
                        return false
                    }
                    this.footName = '正在加载'
                    this.listQuery.pageNo++
                    this.pullRefreshss = false
                    this.listQuery.isDigest === 0 ? this.queryPcSchoolfellowCircle() : this.queryDigestSchoolfellowCircle()
                } else {
                    // 其他时候把下拉刷新置为true
                    _this.pullRefreshss = true
                }
            },
            //检索
            retrievaltime(e) {
                this.listQuery.pageNo = 1
                this.listQuery.pageSize = 10
                this.contentList = []
                this.listQuery.isDigest === 0 ? this.queryPcSchoolfellowCircle() : this.queryDigestSchoolfellowCircle()
            },
            queryDigestSchoolfellowCircle() {
                queryDigestSchoolfellowCircle({
                    pageNo: this.listQuery.pageNo,
                    pageSize: this.listQuery.pageSize,
                    topicId: this.listQuery.topicId,
                    userId: this.$store.getters.userInfo.id
                }).then(res => {
                    let data = res.data.data
                    this.lastPage = data.pagination.pages
                    this.contentList = [...this.contentList, ...data.dataList]
                    this.title = this.contentList[0].topicName
                })
            },
            queryPcSchoolfellowCircle() {
                queryPcSchoolfellowCircle({
                    ...this.listQuery,
                    type: this.selectType,
                    classId: this.classId2,
                    gradeId: this.gradeId2
                }).then(res => {
                    let data = res.data.data
                    this.lastPage = data.pagination.pages
                    this.contentList = [...this.contentList, ...data.dataList]
                    this.title = this.contentList[0].topicName
                })
            }
        },
        beforeDestroy: function () {
            window.removeEventListener('scroll', this.scrollChange, true) //  离开页面清除（移除）滚轮滚动事件
        }
    }
</script>
<style scoped lang="scss">
    .ispan {
        position: absolute;
        right: 10px;
        top: 10px;
        font-size: 24px;
        color: #409eff;

        .el-icon-circle-close {
            color: #f56c6c;
        }
    }

    .foot-box-ul-li-time {
        float: right;
        font-size: 12px;
    }

    .foot-box-ul-li {
        border-bottom: 1px solid #f2f6fc;
        padding: 5px;
        position: relative;
        padding-left: 40px;
    }

    .foot-box-ul-li-txt {
        font-size: 13px;
        min-height: 30px;
        color: #909399;
        padding-top: 5px;
    }

    .foot-box-ul-li img {
        width: 30px;
        height: 30px;
        border-radius: 50%;
        position: absolute;
        top: 5px;
        left: 5px;
    }

    .foot-box-ul-li-name {
        font-size: 13px;
        line-height: 30px;
        color: #606266;
    }

    .i-box {
        line-height: 36px;
        font-size: 13px;
        color: #409eff;
    }

    .txt-box {
        padding: 20px 0;
        font-size: 13px;
        color: #606266;
        min-height: 200px;
    }

    .leftLine {
        height: 10px;
        background-color: #bbf6ce;
    }

    .rightLine {
        height: 10px;
        background-color: #ffb8b5;
    }

    .img img {
        width: 80px;
        height: 80px;
        margin: 10px 10px 10px 0;
    }

    .top-name-name {
        font-size: 14px;
        line-height: 30px;
        color: #606266;
    }

    .top-name-time {
        font-size: 13px;
        color: #909399;
    }

    .top-name-img {
        position: absolute;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        left: 3px;
        top: 12px;
    }

    .campusCircle {
        padding-top: 15px;
    }

    .top {
        padding-bottom: 10px;
        padding: 0 0 10px 15px;
    }

    .subject {
        overflow: auto;
        background-image: url('https://cdnfile-10043692.file.myqcloud.com/admin/images/campus_circle/campus_bg.jpg');
        background-size: 100% 100%;
        background-repeat: no-repeat;
        overflow-x: hidden;
        overflow-y: auto;
    }

    .middle_content {
        width: 810px;
        min-height: 646px;
        margin: 0 auto;
        background: rgba(255, 255, 255, 0.35);
        overflow: hidden;
    }

    .inner_content {
        width: 778px;
        margin: 20px auto 44px;
        padding: 10px 10px 100px 10px;
        border: 1px solid #dcdfe6;
        background: #fff;
        border-radius: 10px;
    }

    .top_content {
        height: 70px;
        line-height: 70px;
        padding-left: 5px;
        font-size: 25px;
        border-bottom: 2px solid #e4e7ed;
        position: relative;
        color: #303133;
    }

    .top_content .img {
        float: left;
        width: 50px;
        height: 50px;
        margin: 10px 15px 10px 0;
    }

    .top_content span {
        float: left;
    }

    .noTime {
        text-align: center;
        color: #606266;
        font-size: 18px;
        line-height: 200px;
    }

    .classCircleDetailsInfo {
        background: #fff;
        border-bottom: 2px dashed #ebeef5;
        padding-bottom: 30px;
        padding-top: 10px;
        min-height: 200px;
        padding-left: 55px;
        position: relative;
    }

    .foot {
        text-align: center;
        padding-top: 10px;
        color: #666;
    }
    .photo {
        width: 80px;
        height: 80px;
        margin: 10px 10px 10px 0;
        background: no-repeat center center / contain;
    }
</style>
