<template>
    <div class="activityDetail">
        <div class="el-row menu-tools">
            <el-button type="default" size="medium" @click="$router.back()">返回</el-button>
            <span v-if="activityList.status == 0">
                <el-button type="primary" size="medium"
                    @click="jumpTo('parentActivityEdit', { id: activityId })">编辑</el-button>
                <el-button type="primary" size="medium" :loading="save_loading"
                    @click="sendActivity(activityId)">发布活动</el-button>
            </span>
            <span v-if="activityList.status !== 0 && activityList.isSign == 1">
                <el-button type="primary" size="medium" @click="signUserShowhandler()">签到上墙</el-button>
            </span>
            <span v-if="activityList.status !== 0 && activityList.isSign == 1">
                <el-button type="primary" size="medium"
                    @click="jumpTo('parentSignUserList', { activityId: activityId, activityTitle: activityList.theme, signTimeId: 0, activityType: activityList.activityType })">签到详情</el-button>
            </span>

        </div>
        <div class="main-wrap scrollBar" :style="{ 'height': nobottommaxH + 'px' }">
            <el-form ref="ruleForm" label-width="140px" class="demo-ruleForm">
                <div class="title">{{ activityList.theme }}</div>
                <div class="meta-info">
                    <span>
                        <span v-if="activityList.isInscribe === 0">{{ activityList.createUserName }}</span>
                        <span v-else>{{ activityList.departName }}</span>
                    </span>
                    <span v-if="activityList.sendDate">
                        {{ activityList.sendDate | filterDate }}
                    </span>
                </div>
                <div class="big-title">
                    <span class="mudule-info">
                        <span class="color-block"></span>活动详情
                    </span>
                </div>

                <el-form-item label="活动时间">
                    <span>{{ activityList.startTime | filterDate2 }}</span>
                    <span>&nbsp;—&nbsp;</span>
                    <span>{{ activityList.endTime | filterDate2 }}</span>
                </el-form-item>
                <el-form-item label="活动地点">
                    {{ activityList.place }}
                </el-form-item>
                <el-form-item label="活动详情">
                    <div class="myaddress-box">
                        <image-previewer tag="richtext">
                            <div class="meeting-content" v-html="activityList.describe">
                            </div>
                        </image-previewer>
                    </div>
                </el-form-item>
                <div class="big-title">
                    <span class="mudule-info">
                        <span class="color-block"></span>活动管理详情
                    </span>
                </div>

                <el-form-item label="发布范围" v-if="activityList.activityType == 0">
                    <div class="range-list">
                        <template v-for="item in ruleForm.meetUserData.departJson">
                            <div class="range-item">
                                <span class="range-item-img"
                                    :style="{ backgroundImage: 'url(' + require('@/assets/images/depart.png') + ')' }"
                                    style="background-image: url(https://cdnfile-10043692.file.myqcloud.com/testimg/photo.jpg);"></span>
                                <span class="range-item-des">{{ item.name }}</span>
                            </div>
                        </template>
                        <template v-for="item in ruleForm.meetUserData.groupJson">
                            <div class="range-item">
                                <span class="range-item-img"
                                    :style="{ backgroundImage: 'url(' + require('@/assets/images/group.png') + ')' }"
                                    style="background-image: url(https://cdnfile-10043692.file.myqcloud.com/testimg/photo.jpg);"></span>
                                <span class="range-item-des">{{ item.name }}</span>
                            </div>
                        </template>
                        <template v-for="item in ruleForm.meetUserData.userJson">
                            <div class="range-item">
                                <span class="range-item-img"
                                    :style="{ backgroundImage: 'url(' + item.avatar + ')' }"></span>
                                <span class="range-item-des">{{ item.name }}</span>
                            </div>
                        </template>

                        <div class="clear"></div>
                    </div>
                </el-form-item>
                <div v-if="activityList.isSign == 1">
                    <el-form-item label="活动调查" v-if="activityList.isResearch == 2">
                        <div>{{ activityList.activityTopic.topicName }}</div>
                        <div v-for="(item, index) in activityList.activityTopic.topicOptionList" :key="index">
                            {{ item.optionName }}
                        </div>
                    </el-form-item>

                    <el-form-item label="签到时间">
                        <div v-for="(item, index) in activityList.signTimes" :key="index">
                            {{ item.beginTime | filterDate2 }}&nbsp;&nbsp;&nbsp;—&nbsp;&nbsp;&nbsp;{{ item.endTime |
                            filterDate2 }}
                        </div>
                    </el-form-item>
                    <el-form-item label="签到二维码">
                        <span class="add_de_ul_right_span" style="margin-top:10px;">
                            <img :src="activityList.signQrCode" />
                        </span>
                    </el-form-item>
                </div>

                <el-form-item label="附件" v-if="fileJson && fileJson.length !== 0">
                    <file-list :fileList="fileJson"></file-list>
                </el-form-item>
            </el-form>
            <div class="SilhouetteBox clearfix"
                v-if="activityList.status !== 0 && activityList.status !== 2 && activityList.allowUploadPic == 1">
                <div class="imgBox">
                    <img src="https://cdnfile-10043692.file.myqcloud.com/admin/images/activity/activitypic.png" alt="">
                </div>
                <div class="upimgBox">
                    <uploader pathPrefix="huodong" module="huodong" moduleCode="1210" multiple v-model="imgfiles"
                        :extList="['jpeg', 'jpg', 'bmp', 'gif', 'png']" showMode="image" showResult="image"
                        @outInput="imgInput" :deleteFlag="true" @outDelete="deleteImgInput"></uploader>
                </div>
            </div>
        </div>
      
    </div>
</template>
<script>
import mixin from '@/mixins/windowResize';
import { mapGetters } from 'vuex';
import { isShowByPermission } from "@/utils";
import AddressBook from '@/components/AddressBook/indexExpand';
import Ueditor from "@/components/Ueditor";
import ImagePreviewer from '@/components/ImagePreviewer/ImagePreviewer';
import FileList from '@/components/FileList/FileList.vue';
import Uploader from '@/components/Uploader/WebUploader';
import { getActivityInfo, publishBeginAskNotice, getActivitySignTimeList, reissueActivity
    , sendActivityById, getActivityInteractAllPicList, addInteractPics, deleteInteractPic } 
    from '@/api/activity';
export default {
    name: 'kezhongyutanActivityDetail',
    components: {
        AddressBook,
        Ueditor,
        Uploader,
        ImagePreviewer,
        FileList
    },
    data() {
        return {
            activityId: this.$route.query.id,
            save_loading: false,
            ruleForm: {
                meetUserData: {},
                meetingScopes: '',
                weekIds: '',
                weekNames: '',
                signQrCode: ''
            },
            allFileTypeList: ['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'pdf'],
            fileJson: [],
            activityList: {},
            
            statusList: [],
            signUserShow: {
                signTimeId: 0
            },
            activityScopeData: {
                title: '选择发放范围',
                depart: { target: 'all', departType: 'all', userTypes: '1,3' },
                group: true,
                notCheckSchool: true
            },
            activityLogo: [
                {
                    fileUrl: 'https://cdnfile-10043692.file.myqcloud.com/mobile/images/cover/activity.jpg',
                    fileName: 'activity_cover.jpg'
                },
            ],
            addressData: {},
            imgfiles: [],
            interactPicsJson: [{
                picUrl: '',
                activityId: ''
            }],
            picList: []
        }
    },
    watch: {
        addressData(addressData) {
            if (addressData.departList.length !== 0 || addressData.userList.length !== 0 || addressData.groupList.length !== 0) {
                const addressNextData = {
                    userJson: [],
                    groupJson: [],
                    departJson: []
                };
                addressNextData.userJson = addressData.userList;
                addressNextData.groupJson = addressData.groupList;
                addressNextData.departJson = addressData.departList;
                const activityLogo = this.activityLogo.map(item => item.fileUrl).toString();
                reissueActivity({
                    activityLogo: activityLogo,
                    activityScopes: JSON.stringify(addressNextData),
                    id: this.activityList.id,
                    theme: this.activityList.theme,
                }).then(res => res.data)
                    .then(data => {
                        if (data.code === 200) {
                            this.$message({
                                type: "success",
                                message: "补发活动成功!"
                            });
                            this.getActivityInfoFunc();
                        } else {
                            this.$message({
                                type: "error",
                                message: "补发活动失败!请稍后重试!谢谢!"
                            });
                        }
                    }).catch(() => {
                        this.$message({
                            message: `${data.msg}`,
                            type: 'error'
                        });
                    })
            }
        }
    },
    created() {
    },
    mounted() {
        this.getActivityInfoFunc();
    },
    mixins: [mixin],
    computed: {
        ...mapGetters([
            'userInfo'
        ])
    },
    filters: {
        filterDate(date) {
            return date ? date.slice(0, 19) : '';
        },
        filterDate2(date) {
            return date ? date.slice(0, 16) : '';
        },
        filterDate3(date) {
            return date ? date.slice(0, 10) : '';
        }
    },
    methods: {
        deleteImgInput(val) {
            let itemImg = this.imgfiles.find((item, index) => index == val.deleteIndex);
            let picItem = this.picList.find(item => item.picUrl == itemImg.fileUrl);
            this.imgfiles.splice(val.deleteIndex, 1);
            deleteInteractPic({
                interactPicId: picItem.id
            }).then(res => res.data)
                .then(data => {
                    if (data.code === 200) {
                        this.$message({
                            message: "操作成功！",
                            type: 'success'
                        });
                        //this.getActivityInteractAllPicListFunc();
                    }
                }).catch(() => {
                    this.$message({
                        message: `${data.msg}`,
                        type: 'error'
                    });
                })
        },
        imgInput(val) {
            this.interactPicsJson[0].activityId = this.activityId;
            this.interactPicsJson[0].picUrl = val[0].fileUrl;
            this.interactPicsJson[0].moduleCode = 1210;
            addInteractPics({
                interactPicsJson: JSON.stringify(this.interactPicsJson)
            }).then(res => res.data)
                .then(data => {
                    if (data.code === 200) {
                        this.$message({
                            message: "操作成功！",
                            type: 'success'
                        });
                        this.getActivityInteractAllPicListFunc();
                    }
                })
        },
        goResource(activityId) {
            this.$router.push({
                path: '/main/generalLogistics/resourceOrder/resourceOrderAdd',
                query: {
                    activityId: activityId
                }
            })
        },
        sendActivity(activityId) {
            if (this.$moment(this.activityList.startTime).format('YYYY-MM-DD HH:mm') <= this.$moment(new Date()).format('YYYY-MM-DD HH:mm')) {
                this.$message({
                    type: "error",
                    message: "活动开始时间应大于当前时间！"
                });
                return false;
            }
            sendActivityById({
                activityId: activityId
            }).then(res => res.data)
                .then(data => {
                    if (data.code === 200) {
                        this.$message({
                            message: "发布成功！",
                            type: 'success'
                        });
                         this.$router.push({
                            path: 'parentList'
                        })
                    }
                }).catch(() => {
                    this.$message({
                        message: `${data.msg}`,
                        type: 'error'
                    });
                })
        },
        sureSignUser() {
            window.open("/app/#/main/schoolManage/activity/interactUserListActSignShow?activityId=" + this.activityId + '&signTimeId=' + this.signUserShow.signTimeId + '&activityType=' + this.activityList.activityType + '&token=' + this.$store.getters.token, "_blank");
        },
        signUserShowhandler() {
           
            this.getActivitySignTimeListFunc();
        },
        getActivitySignTimeListFunc() {
            getActivitySignTimeList({
                activityId: this.activityId
            }).then(res => res.data)
                .then(data => {
                    if (data.code === 200) {
                        this.statusList = data.data;
                        this.signUserShow.signTimeId = this.statusList[0].id;
                        this.sureSignUser()
                    }
                }).catch(() => {
                    this.$message({
                        message: `${data.msg}`,
                        type: 'error'
                    });
                })
        },
        postFunc(activityId, maxId) {
            window.open("/app/#/main/schoolManage/activity/interactUserList?activityId=" + activityId + '&maxId=' + maxId + '&token=' + this.$store.getters.token, "_blank");
        },
        beginAskFunc(activityId) {
            publishBeginAskNotice({
                activityId: activityId
            }).then(res => res.data)
                .then(data => {
                    if (data.code === 200) {
                        this.$message({
                            message: "互动提醒成功！如需现场互动请到手机端点击互动按钮！",
                            type: 'success'
                        });
                    }
                }).catch(() => {
                    this.$message({
                        message: `${data.msg}`,
                        type: 'error'
                    });
                })
        },
        isShowByPermission,
        jumpTo(path, query = {}) {
            this.$router.push({
                path,
                query
            })
        },
        //处理图片名
        fileNameUse(file) {
            return file.indexOf('?') !== -1 ? file.slice(0, file.indexOf('?')) : file;
        },
        getActivityInteractAllPicListFunc() {
            this.imgfiles = [];
            getActivityInteractAllPicList({
                activityId: this.activityId,
                moduleCode: 1210
            }).then(res => res.data)
                .then(data => {
                    if (data.code === 200 && data.data) {
                        const picData = data.data;
                        this.picList = picData;
                        for (var i = 0; i < picData.length; i++) {
                            let fileName = this.fileNameUse(picData[i].picUrl).replace(/.+\//, "");
                            this.imgfiles.push({
                                fileName: fileName,
                                fileUrl: picData[i].picUrl
                            })
                        }
                    }
                })
        },
        getActivityInfoFunc() {
            getActivityInfo({
                activityId: this.activityId
            }).then(res => res.data)
                .then(data => {
                    if (data.code === 200) {
                        const activityData = data.data;
                        this.activityList = data.data;
                        if (activityData.activityScopes) {
                            this.ruleForm.meetUserData = JSON.parse(activityData.activityScopes);
                        } else if (activityData.users || activityData.groups || activityData.departs) {
                            this.ruleForm.meetUserData = {
                                departJson: activityData.departs,
                                groupJson: activityData.groups,
                                userJson: activityData.users
                            }
                        }

                        if (activityData.activityLogo) {
                            let fileName = this.fileNameUse(activityData.activityLogo).replace(/.+\//, "");
                            this.activityLogo = [{
                                fileName: fileName,
                                fileUrl: activityData.activityLogo
                            }];
                        } else {
                            this.activityLogo = this.activityLogo;
                        }
                        this.fileJson = activityData.filesJson ? JSON.parse(activityData.filesJson) : [];
                        if (activityData.allowUploadPic == 1 && activityData.status !== 0 && activityData.status !== 2) {
                            this.getActivityInteractAllPicListFunc();
                        }
                    }
                })
        }
    }
}
</script>
<style lang="scss" scoped>
.scrollBar {
    overflow-x: hidden;
    overflow-y: auto;

    &::-webkit-scrollbar-track-piece {
        background: #d3dce6;
    }

    &::-webkit-scrollbar {
        width: 6px;
    }

    &::-webkit-scrollbar-thumb {
        background: #99a9bf;
        border-radius: 20px;
    }
}

.clearfix:after {
    content: "";
    height: 0;
    display: block;
    clear: both;
    visibility: hidden;
}

.el-form-item.is-required .el-form-item__label:before {
    content: "*";
    color: #ff4949;
    margin-right: 4px;
}

.activityDetail {
    padding: 12px;
    color: #333;
    box-sizing: border-box;

    .menu-tools {
        border-bottom: 1px solid #e7eaec;
        padding-bottom: 10px;
        position: relative;

        .HTitle {
            display: block;
            position: absolute;
            left: 50%;
            width: 100px;
            height: 24px;
            font-weight: bold;
            font-size: 18px;
            margin-left: -25px;
            margin-top: -12px;
            top: 50%;
        }
    }

    .main-wrap {
        width: 100%;
        padding-top: 20px;
        padding-bottom: 10px;
        box-sizing: border-box;

        .title {
            line-height: 1.2em;
            font-size: 26px;
            text-align: center;
            color: rgb(47, 64, 80);
            margin: 20px 0;
        }

        .meta-info {
            font-size: 13px;
            text-align: center;
            margin-bottom: 20px;

            span {
                margin-left: 10px;
            }
        }

        .demo-ruleForm {
            width: 810px;
            box-sizing: border-box;
            margin: 0 auto;
        }

        .file {
            position: relative;
            display: inline-block;
            background: #fff;
            border: 1px dashed #ccc;
            color: #fff;
            text-decoration: none;
            text-indent: 0;
            width: 50px;
            height: 50px;
            font-size: 30px;
            text-align: center;
            font-weight: blode;
            cursor: pointer;
            color: #000;
            padding-top: 3px;
            margin-top: 10px;
        }

        .for-box {
            min-width: 100px;
            width: auto;
            height: 70px;
            float: left;
            margin-bottom: 10px;
            margin-top: 10px;

            .upload-img {
                width: 50px;
                height: 50px;
                vertical-align: middle;
            }

            .file_del {
                text-decoration: none;
                color: #337ab7;
            }

            .file-name {
                display: block;
                width: 100px;
                line-height: 20px;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
            }
        }
    }
}

.big-title {
    margin-bottom: 6px;

    .mudule-info {
        height: 40px;
        font-size: 15px;
        font-weight: 700;
        line-height: 40px;
        color: #676a6c;
        margin-left: 50px;

        .color-block {
            width: 4px;
            display: inline-block;
            margin-right: 12px;
            vertical-align: middle;
            margin-top: -3px;
            height: 16px;
            background: #409EFF;
        }
    }
}

.file-list,
.range-list {
    //margin: 10px;
    margin: 0 !important;
}

.range-item {
    height: 30px;
    display: block;
    float: left;
    margin-left: 4px;
    margin-top: 4px;
    margin-right: 10px;
    border: 1px solid #e7eaec;
}

.range-item-img {
    height: 28px;
    width: 28px;
    display: block;
    float: left;
    background-position: center center;
    background-size: cover;
}

.range-item-des {
    padding-left: 4px;
    line-height: 30px;
    padding-right: 4px;
    color: #676a6c;
    float: left;
    font-size: 13px;
}

.social-feed-box {
    border: 1px solid #e7eaec;
    background: #fff;
    margin-bottom: 15px;
}

.file-item-img {
    height: 28px;
    width: 28px;
    display: block;
    float: left;
    background-position: center center;
    background-size: cover;
}

.file-item {
    height: 30px;
    display: block;
    // border-bottom: 1px solid #e7eaec;
    margin-left: 4px;
    margin-top: 6px;
}

.file-item-des {
    padding-left: 4px;
    line-height: 30px;
    padding-right: 4px;
}

.content-box {
    color: #333;

    .time-range-item-rangedes {
        color: #ADADAD;
    }
}

#file-upload-label {
    display: inline-block;
    line-height: 1;
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
    margin: 0 10px;
    color: #FFF;
    background-color: #409EFF;
    border-color: #409EFF;
    position: relative;

    &:hover {
        background: #66b1ff;
        border-color: #66b1ff;
        color: #FFF;
    }
}

.SilhouetteBox {
    width: 810px;
    margin: 0 auto;

    .imgBox {
        width: 160px;
        padding-right: 12px;
        box-sizing: border-box;
        float: left;

        img {
            width: 40px;
            float: right;
            height: 40px;
            display: block;
            max-width: 100%;
        }
    }

    .upimgBox {
        float: left;
        width: 70%;
    }
}
</style>
<style lang="scss">
.activityDetail .el-form-item__content {
    padding-left: 10px;
}

.activityDetail .el-form-item__label {
    font-weight: 700;
    color: #666;
    padding-right: 20px;
}

.meeting-content {
    p {
        padding: 0;
        margin: 0;
    }

    .file-item {
        margin-bottom: 10px;
    }
}

.meeting-content ol,
.meeting-content ul {
    padding-left: 30px;
}

.meeting-content td,
.meeting-content th {
    padding: 5px 10px;
    border: 1px solid #DDD;
}

.meeting-content p {
    margin: 0 0 10px;
}

.meeting-content img {
    display: block;
    max-width: 100%;
    height: auto;
}

.activityDetail .el-radio {
    margin-bottom: 14px;
}

.activityScopesBox .el-button {
    padding: 10px 20px !important;
}

.activityDetail .el-form-item {
    margin-bottom: 10px;
}
</style>
