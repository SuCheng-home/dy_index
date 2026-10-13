<!--通知的详情-->
<template>
    <div class="app-container calendar-list-container">
        <div class="menu-tools">
            <el-button @click="backHandler()" size="medium">返回</el-button>
            <template v-if="noticeState == 1&&(mynew!=1)">
                <el-button type="primary" @click="jumpToPage('noticeAdd', {id: noticeId})" size="medium">编辑</el-button>
                <el-button :loading="loading" :disabled="loading" @click="publishHandler()" type="primary" size="medium">发布</el-button>
            </template>
            <el-button type="primary" @click="notifyAll()" size="medium" v-if="noticeState == 2 && !isReceive && !isAll&&(mynew!=1)">提醒全部</el-button>
            <el-button type="primary" @click="repeatreminder()" size="medium" v-if="noticeState == 2 && !isReceive && !isAll&&(mynew!=1)">重复提醒</el-button>
            <address-book v-model="addressData" :config="configData" :isbutton="true"
                          v-if="!isReceive && !isAll && noticeState == 2&&(mynew!=1)">补发
            </address-book>
        </div>
        <div :class="['page-main', isStandalone ? 'page-main--scroller' : '']">
            <default-page v-if="(isDelete||isOver) && !isOwnCreate" Mes="无法查看，消息可能过期或被删除！"></default-page>
            <div v-else class="article-container">
                <div class="title">{{noticeTitle}}</div>
                <div class="sub-title">
                    {{releaseDate|trimTime}} <span v-if="!inscribe">{{releaseUserName}}</span>
                    <span class="departName" v-if="inscribe">{{departName}}</span>
                </div>
                <hr>
                <div>
                    <div class="content">
                        <image-previewer tag="richtext">
                            <div class="notice-content" :class="{'has-img':pics.length === 0}"
                                 v-html="noticeContent"></div>
                        </image-previewer>
                    </div>

                    <hr>
                    <div class="row" v-if="isFromSend">
                        <div class="col-lg-12">
                            <div class="section-title">
                                发布范围
                            </div>
                            <range-list :departJson="departJson" :groupJson="groupJson"
                                        :userJson="userJson"></range-list>
                        </div>
                    </div>
                    <div class="row" v-if="pics && pics.length !== 0">
                        <div class="col-lg-12">
                            <div class="section-title">
                                图片
                            </div>
                            <image-previewer tag="richtext" :images="pics" viewclass="pic-item">
                                <div class="pic-container">
                                    <div class="pic-item" :data-src="item.url || item"
                                         :style="{backgroundImage: `url(${item.url || item})`}"
                                         v-for="item in pics"></div>
                                </div>
                            </image-previewer>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-lg-12" v-if="files && files.length !== 0">
                            <div class="section-title">
                                附件
                            </div>
                            <file-list :isShowTitle="false" :fileList="files"></file-list>
                        </div>
                    </div>
                    <div class="info-container" v-if="(noticeState == 2&&isOwnCreate)||mynew==1">
                        <div class="col-lg-12">
                            <div>
                         <span class="list-link--finish">
                                <router-link
                                    v-if="Number.parseInt(noticeDetailobj.readCount) !== 0"
                                    :to="{path: 'noticeReadList', query: {isRead:1, id: this.$route.query.id,noticeState:noticeState,mynew:mynew}}">
                                    已读人数：{{ noticeDetailobj.readCount }}
                                </router-link>
                                <span v-else>已读人数：{{ noticeDetailobj.readCount }}</span>
                            </span>
                                <span class="list-link--unfinish">
                                <router-link
                                    v-if="Number.parseInt(notReadCount) !== 0"
                                    :to="{path: 'noticeReadList', query: {isRead:0, id: this.$route.query.id,noticeState:noticeState,isOwnCreate:isOwnCreate,mynew:mynew}}">
                                    未读人数：{{ notReadCount }}
                                </router-link>
                                <span v-else>未读人数：{{ notReadCount}}</span>
                            </span>
                                <span class="list-link--finish" @click="replyNumBtn()">
                                   <span> 回复：{{ noticeDetailobj.replyNum }}</span>
                               </span>
                              
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import RangeList from '@/components/RangeList/RangeList';
    import FileList from '@/components/FileList/FileList';
    import {strToHtml} from '@/utils/utils';
    import {getNoticeInfo, forwardNotice, updateNotice, remindAllUsers,getNoticeInfonew} from '@/api/notice';

    import DefaultPage from "@/components/DefaultPage";
    import AddressBook from '@/components/AddressBook/indexExpand';
    import ImagePreviewer from '@/components/ImagePreviewer/ImagePreviewer.vue';
    import {mapGetters} from 'vuex';
    import mixin from '@/mixins/windowResize';

    const DELETE_FLAG = {OK: 2, NO: 1};//1代表未删除，2代表已删除
    const OVER_FLAG = {OK: 1, NO: 0};//是否过期 0 未过期 1已过期
    export default {
        components: {
            RangeList,
            FileList,
            DefaultPage,
            ImagePreviewer,
            AddressBook
        },
        computed: {
            ...mapGetters(['isStandalone', 'userInfo'])
        },
        data() {
            return {
                loading: false,
                mynew:this.$route.query.mynew||0,
                configData: {
                    title: '选择通知范围',
                    depart: {target: 'all', departType: 'all', userTypes: '1,2'},
                    group: {
                        groupTarget: 'all',
                        groupScope: [1, 2]
                    }                },
                addressData: {},

                noticeId: this.$route.query.id,
                isFromSend: this.$route.query.fromSend == 1,
                noticeTitle: '',
                releaseUserName: '',
                releaseDate: '',
                noticeContent: '',
                departJson: [],
                groupJson: [],
                userJson: [],
                files: [],
                isDelete: false,
                isOver: false,
                inscribe: '',
                departName: '',
                pics: [],
                isOwnCreate: false,//是否是自己创建的通知，是则显示
                noticeState: 0,
                isReceive: this.$route.query.isReceive == 1,
                isAll: this.$route.query.isAll == 1,
                isAnswer: 1,//回复
                notReadCount: 0,
                isOpenForTeacher: 0,
                readCount: 0,
                replyNum: 0,
                isSign: 0,

                fromIndex: this.$route.query.fromIndex == 1,
                allInfoData: {},
                noticeDetailobj:{}
            }
        },
        watch: {
            addressData(addressData) {
                if (addressData.departJson.length !== 0 || addressData.userJson.length !== 0 || addressData.groupJson.length !== 0) {
                    forwardNotice({
                        fromArea: 2,
                        commonGroup: addressData,
                        noticeId: this.noticeId
                    })
                        .then(res => res.data)
                        .then(data => {
                            if (data.result) {
                                this.$message({
                                    message: '补发成功！',
                                    type: 'success'
                                });
                                this.getNoticeInfoFunc();
                            }
                        });
                } else {
                    this.$message.error('请选择补发人员！');
                }
            },
        },
        mixins: [mixin],
        filters: {
            trimTime(datetime) {
                return datetime ? datetime.slice(0, datetime.lastIndexOf('.')) : '--';
            }
        },
        created() {
            this.getNoticeInfoFunc();
        },
        methods: {
            notifyAll() {
                remindAllUsers({
                    noticeId: this.noticeId
                })
                    .then(res => res.data)
                    .then(data => {
                        if(data.result) {
                            this.$message.success('提醒成功');
                        }
                    })
            },
            getNoticeInfoFunc() {
                let submitRead = this.isReceive ? 1 : 0;
                if(this.mynew!=1){
                   getNoticeInfo(this.noticeId, submitRead).then(res => {
                    let data = res.data.data;
                    this.noticeDetailobj=data;
                    this.noticeTitle = data.noticeTitle;
                    this.noticeState = data.noticeState;
                    this.isAnswer = data.isAnswer;
                    this.notReadCount = data.notReadCount;
                    this.readCount = data.readCount;
                    this.replyNum = data.replyNum;
                    this.releaseUserName = data.releaseUserName;
                    this.releaseDate = data.releaseDate;
                    this.noticeContent = strToHtml(data.noticeContent);
                    this.departJson = data.departJson && data.departJson !== '' ? JSON.parse(data.departJson) : [];
                    this.groupJson = data.groupJson && data.groupJson !== '' ? JSON.parse(data.groupJson) : [];
                    this.userJson = data.userJson && data.userJson !== '' ? JSON.parse(data.userJson) : [];
                    if (!!data.fileJson) {
                        const files = [];
                        JSON.parse(data.fileJson).forEach((item) => {
                            files.push({
                                accessUrl: item.fileUrl,
                                createTime: null,
                                fileMime: item.fileName.slice(item.fileName.lastIndexOf('.') + 1),
                                fileName: item.fileName,
                                fileType: 0,
                                fileUrl: item.fileUrl,
                                id: item.id,
                                isDelete: 0,
                                originalFileName: item.fileName,
                                resourcePath: null,
                                updateTime: null
                            })
                        });
                        this.files = files;
                    } else {
                        this.files = data.files;
                    }
                    this.isDelete = data.isDelete === DELETE_FLAG.OK;
                    this.isOver = data.isOver === OVER_FLAG.OK;
                    this.inscribe = data.inscribe;
                    this.departName = data.departName;
                    if (data.pics) {
                        data.pics.forEach(item => item.src = item.url);
                    }
                    this.pics = data.pics;
                    this.isOwnCreate = data.createUserId == this.userInfo.id;
                    this.isOpenForTeacher = data.isOpenForTeacher;
                    this.isSign = data.isSign;

                    this.allInfoData = data;
                });
                }else{
                     getNoticeInfonew(this.noticeId, submitRead).then(res => {
                    let data = res.data.data;
                    this.noticeDetailobj=data;
                    this.noticeTitle = data.noticeTitle;
                    this.noticeState = data.noticeState;
                    this.isAnswer = data.isAnswer;
                    this.notReadCount = data.notReadCount;
                    this.readCount = data.readCount;
                    this.replyNum = data.replyNum;
                    this.releaseUserName = data.releaseUserName;
                    this.releaseDate = data.releaseDate;
                    this.noticeContent = strToHtml(data.noticeContent);
                    this.departJson = data.departJson && data.departJson !== '' ? JSON.parse(data.departJson) : [];
                    this.groupJson = data.groupJson && data.groupJson !== '' ? JSON.parse(data.groupJson) : [];
                    this.userJson = data.userJson && data.userJson !== '' ? JSON.parse(data.userJson) : [];
                    if (!!data.fileJson) {
                        const files = [];
                        JSON.parse(data.fileJson).forEach((item) => {
                            files.push({
                                accessUrl: item.fileUrl,
                                createTime: null,
                                fileMime: item.fileName.slice(item.fileName.lastIndexOf('.') + 1),
                                fileName: item.fileName,
                                fileType: 0,
                                fileUrl: item.fileUrl,
                                id: item.id,
                                isDelete: 0,
                                originalFileName: item.fileName,
                                resourcePath: null,
                                updateTime: null
                            })
                        });
                        this.files = files;
                    } else {
                        this.files = data.files;
                    }
                    this.isDelete = data.isDelete === DELETE_FLAG.OK;
                    this.isOver = data.isOver === OVER_FLAG.OK;
                    this.inscribe = data.inscribe;
                    this.departName = data.departName;
                    if (data.pics) {
                        data.pics.forEach(item => item.src = item.url);
                    }
                    this.pics = data.pics;
                    this.isOwnCreate = data.createUserId == this.userInfo.id;
                    this.isOpenForTeacher = data.isOpenForTeacher;
                    this.isSign = data.isSign;

                    this.allInfoData = data;
                });
                }
               
            },
            getFileSuffix(fileName) {
                return fileName.replace(/.+\./, "").toLowerCase();
            },
            jumpToPage(path, query = {}) {
                this.$router.push({
                    path,
                    query
                })
            },

            //回复跳转
            replyNumBtn() {
                let type = this.isOwnCreate ? 1 : 2;
                this.$router.push({path: 'noticeReply', query: {id: this.noticeId, type: type,mynew:this.$route.query.mynew||0}});
            },
            repeatreminder(){
                this.$router.push({path: 'repeatreminder', query: {id: this.noticeId,mynew:this.$route.query.mynew||0}});
            },
            btnLoadState(state) {
                this.loading = state;
            },
            backHandler() {
                if(this.$route.query.mynew){
                    this.$router.back();
                    return;
                }
                if (this.fromIndex) {
                    this.$router.replace('notieRecive')
                } else {
                    this.$router.back();
                }
            },
            publishHandler() {
                this.btnLoadState(true);
                const query = {
                    noticeTitle: this.noticeTitle,
                    releaseUserId: this.userInfo.id,
                    releaseUserName: this.userInfo.name,
                    noticeState: 2, //如果是发布则改为发布状态
                    createType: 0,
                    isReply: 1, //微信的会话开关
                    departJson: JSON.stringify(this.departJson), //部门json字符串
                    groupJson: JSON.stringify(this.groupJson), //群组json字符串
                    userJson: JSON.stringify(this.userJson), //用户json字符串
                    isAnswer: this.isAnswer, //是否允许
                    isSendOntime: this.allInfoData.isSendOntime, //是否定时发送
                    sendTime: this.$moment(this.allInfoData.sendTime).format('YYYY-MM-DD HH:mm'), //定时发送时间
                    logoURL: this.allInfoData.logoURL, //通知封面
                    inscribe: this.allInfoData.inscribe, //是否落款(1代表落款,0代表不落款)
                    departId: this.allInfoData.departId,
                    departName: this.allInfoData.departName,
                    fileCount: this.allInfoData.fileCount,
                    fileJson: this.allInfoData.fileJson,
                    picIds: this.allInfoData.picIds || [],
                    infaceType: 2, //接口类型
                    overdueTime: this.allInfoData.overdueTime,
                    sendType: this.allInfoData.sendType, //默认传1，按发布范围发送，后期会迭代选择2中方式
                    isOpenForTeacher: this.allInfoData.isOpenForTeacher,
                    id: this.noticeId,
                    noticeContent: this.allInfoData.noticeContent,
                    noticeType: 0,
                    isSign: this.isSign
                };
                updateNotice(query).then(res => {
                    let _this = this;
                    this.$message({
                        message: '操作成功！',
                        type: 'success',
                        duration: 1000,
                        onClose: () => {
                            this.btnLoadState(false);
                            this.$router.back();
                        }
                    });
                }).catch(err => {
                    this.btnLoadState(false);
                });

            }
        }
    }
</script>
<style lang="scss">
    @import "../../../src/styles/mixin.scss";

    @include articleDetailPageStyles;
    .menu-tools{
        padding-bottom:10px;
        border-bottom: 1px solid #e7eaec;
    }
    
        .list-link--finish a, .list-link--finish span {
            color: #409eff !important;
            margin-right: 70px;
             cursor:pointer  
        }

        .list-link--unfinish a, .list-link--unfinish span {
            color: #EF4F4F !important;
            margin-right: 70px;
             cursor:pointer  
        }
        .info-container {
            padding-top: 20px;
        }
</style>
