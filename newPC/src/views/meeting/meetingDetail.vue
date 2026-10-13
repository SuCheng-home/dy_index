<template>
    <div class="meetingDetail">
        <div class="el-row menu-tools">
            <el-button type="default" size="medium" @click="$router.back()">返回</el-button>
            <template v-if="meetList.status!==0">
                <el-button type="primary" size="medium"  
                           @click="jumpTo('meetingUser',{id:meetList.id,meetingType:meetList.meetingType})">签到人员
                </el-button>
                <el-button type="primary" size="medium"  
                           @click="jumpTo('meetingNoUser',{id:meetList.id,meetingType:meetList.meetingType,isCanAskLeav:meetList.isCanAskLeav})">
                    未签到人员
                </el-button>
                <a :href="exportURL" download="导出结果" target="_blank" >
                    <el-button size="medium" type="primary">导出签到</el-button>
                </a>
                <el-button type="primary" size="medium"  
                           @click="toSignWall({id:meetList.id,meetingType:meetList.meetingType})">签到上墙
                </el-button>
            </template>
        </div>
        <div class="main-wrap scrollBar" :style="{'height':nobottommaxH+'px'}">
            <el-form ref="ruleForm" label-width="140px" class="demo-ruleForm form--display">
                <el-form-item label="会议类型">
                    {{meetList.meetingType==1?"常规例会":"单次会议"}}
                </el-form-item>
                <el-form-item label="会议主题">
                    {{meetList.theme}}
                </el-form-item>
                <div>
                    <el-form-item label="创建人" v-if="meetList.status==0">
                        {{meetList.createUserName}}
                    </el-form-item>
                    <el-form-item label="发布人" v-else>
                        <span v-if="meetList.updateUserName">{{meetList.updateUserName}}</span>
                        <span v-else>{{meetList.createUserName}}</span>
                    </el-form-item>
                </div>
                <el-form-item label="创建时间">
                    {{meetList.createTime|filterDate}}
                </el-form-item>
                <el-form-item label="会议地点">
                    {{meetList.place}}
                </el-form-item>
                <el-form-item label="是否允许请假">
                    {{meetList.isCanAskLeav==1?"允许":"不允许"}}
                </el-form-item>
                <!--是否允许请假-->
                <el-form-item label="请假审批人" v-if="meetList.isCanAskLeav==1">
                    <div class="range-list">
                        <div v-for="item in ruleForm.leavExamData.userJson" :key="item.id">
                            <div class="range-item">
                  <span class="range-item-img"
                        :style="{backgroundImage:'url('+item.avatar+')'}"></span>
                                <span class="range-item-des">{{item.name}}</span>
                            </div>
                        </div>

                        <div class="clear"></div>
                    </div>
                </el-form-item>
                <!--单次会议-->
                <div v-if="meetList.meetingType==0">
                    <el-form-item label="会议时间">
                        <span>{{meetList.startTime|filterDate2}}</span>
                        <span>&nbsp;—&nbsp;</span>
                        <span>{{meetList.endTime|filterDate2}}</span>
                    </el-form-item>
                </div>
                <!--常规例会-->
                <div v-if="meetList.meetingType==1">
                    <el-form-item label="会议周次">
                        {{meetList.weekNames}}
                    </el-form-item>
                    <el-form-item label="会议时间">
                        <span>{{meetList.beginTime}}</span>
                        <span>—</span>
                        <span>{{meetList.finishTime}}</span>
                    </el-form-item>
                    <el-form-item label="执行时间">
                        <span>{{meetList.startTime|filterDate3}}</span>
                        <span>—</span>
                        <span>{{meetList.endTime|filterDate3}}</span>
                    </el-form-item>
                </div>
                <div v-if="meetList.isSignLimit==1">
                    <el-form-item label="签到时间">
                        <span>{{meetList.bSignTime}}</span>
                        <span>—</span>
                        <span>{{meetList.eSignTime}}</span>
                    </el-form-item>
                </div>
                <el-form-item label="参会人员">
                    <div class="range-list">
                        <template v-for="item in ruleForm.meetUserData.departJson">
                            <div class="range-item">
                  <span class="range-item-img"
                        :style="{backgroundImage:'url('+require('@/assets/images/depart.png')+')'}"
                        style="background-image: url(https://cdnfile-10043692.file.myqcloud.com/testimg/photo.jpg);"></span>
                                <span class="range-item-des">{{item.name}}</span>
                            </div>
                        </template>
                        <template v-for="item in ruleForm.meetUserData.groupJson">
                            <div class="range-item">
                  <span class="range-item-img"
                        :style="{backgroundImage:'url('+require('@/assets/images/group.png')+')'}"
                        style="background-image: url(https://cdnfile-10043692.file.myqcloud.com/testimg/photo.jpg);"></span>
                                <span class="range-item-des">{{item.name}}</span>
                            </div>
                        </template>
                        <template v-for="item in ruleForm.meetUserData.userJson">
                            <div class="range-item">
                  <span class="range-item-img"
                        :style="{backgroundImage:'url('+item.avatar+')'}"></span>
                                <span class="range-item-des">{{item.name}}</span>
                            </div>
                        </template>

                        <div class="clear"></div>
                    </div>
                    <!-- <address-book  v-model="ruleForm.meetUserData" :config="meetUserConfigData" ></address-book> -->
                </el-form-item>
                 <el-form-item label="发送提醒">
                     {{meetList.isRemind==1?'发送':'不发送'}}
                </el-form-item>
                <div v-if="meetList.signType==1">
                    <el-form-item label="签到二维码">
                        <span class="add_de_ul_right_span" style="margin-top:10px;" v-if="meetList.signQrCode">
                        <img :src="meetList.signQrCode"/>
                        </span>
                        <span class="add_de_ul_right_span" style="margin-top:10px;" v-if="meetList.abcSignQrCode">
                        <img :src="meetList.abcSignQrCode"/>
                        </span>
                    </el-form-item>
                    <el-form-item label="签到地点" v-if="meetList.isAddressLimit==2">
                       {{meetList.address}} 半径 {{meetList.rangeVal}} 米内
                       
                    </el-form-item>
                </div>
                <div v-if="meetList.signType==2">
                    <el-form-item label="人脸识别设备">
                        <div class="equipmentBox">
                            <div class="for-box" v-for="(item,index) in saveDeviceList" :key="index">
                                <img
                                    src="https://cdnfile-10043692.file.myqcloud.com/admin/images/systemSetup/scancodeEquipment.png"
                                    class="upload-img">
                                <span class="file-name" title="">{{item.equipmentName}}</span>
                            </div>
                        </div>
                    </el-form-item>
                </div>
                <el-form-item label="会议详情">
                    <div class="myaddress-box">
                        <image-previewer tag="richtext">
                            <div class="meeting-content" v-html="meetList.describe">
                            </div>
                        </image-previewer>
                    </div>
                </el-form-item>
                <el-form-item label="附件" v-if="fileJson&&fileJson.length!==0">
                    <file-list :fileList="fileJson" :isShowTitle="false"></file-list>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>
<script>
    import mixin from '@/mixins/windowResize';
    import {mapGetters} from 'vuex';
    import AddressBook from '@/components/AddressBook/indexExpand';
    import Ueditor from "@/components/Ueditor";
    import ImagePreviewer from '@/components/ImagePreviewer/ImagePreviewer';
    import FileList from '@/components/FileList/FileList.vue';
    import Uploader from '@/components/Uploader/WebUploader';
    import {getMeetingInfo} from '@/api/metting';

    export default {
        components: {
            AddressBook,
            Ueditor,
            Uploader,
            ImagePreviewer,
            FileList
        },
        data() {
            return {
                id: this.$route.query.id,
                save_loading: false,
                ruleForm: {
                    theme: '',
                    place: '',
                    meetingType: 0,//会议类型 0单次会议 1常规例会
                    isCanAskLeav: 0,//是否允许请假 0不允许 1允许
                    leavExamData: {
                        userJson: []
                    },
                    leavExamJson: "",
                    leavExamIds: '',
                    startTime: new Date(),//单会议时间
                    endTime: new Date(),
                    weeks: [],//常规
                    beginTime: '',
                    finishTime: '',
                    startTime2: '',
                    endTime2: '',
                    isSignLimit: false,//签到时间限制 0不限制 1限制
                    bSignTime: '',//签到开始时间
                    eSignTime: '',
                    signType: 1,//会议签到方式 1扫码签到 2人脸识别
                    equipmentIds: '',
                    equipmentJson: '',
                    describe: '',
                    meetUserData: {},
                    meetingScopes: '',
                    weekIds: '',
                    weekNames: '',
                    signQrCode: '',
                     address: '',
                    rangeVal: 500,
                    addressDesc: '',
                    lng: 116.404,
                    lat: 39.915,
                    isAddressLimit:0,
                    isRemind:2
                },
                leaveConfigData: {
                    title: '请选择请假审批人员',
                    depart: {target: "user", departType: "t", userTypes: "1"},
                    group: false
                },
                meetUserConfigData: {
                    title: '请选择参会人员',
                    depart: {target: 'all', departType: 't', userTypes: '1'},
                    group: true
                },
                weekList: [
                    {code: 1, value: "周一"},
                    {code: 2, value: "周二"},
                    {code: 3, value: "周三"},
                    {code: 4, value: "周四"},
                    {code: 5, value: "周五"},
                    {code: 6, value: "周六"},
                    {code: 7, value: "周日"}
                ],
                schoolYearList: [],
                dialogVisible: false,
                deviceId: '',
                deviceList: [],
                saveDeviceList: [],
                allFileTypeList: ['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'pdf'],
                fileJson: [],
                meetList: [],
                exportURL: ''
            }
        },
        created() {
        },
        mounted() {
            this.getMeetingInfoFunc();
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
            jumpTo(path, query = {}) {
                this.$router.push({
                    path,
                    query
                })
            },
            toSignWall({id, meetingType}) {
                window.open(`/app/#/main/schoolManage/meeting/meetingSignUp?id=${id}&meetingType=${meetingType}`, "_blank");
            },
            getMeetingInfoFunc() {
                getMeetingInfo({
                    meetingId: this.id
                }).then(res => res.data)
                    .then(data => {
                        if (data.code === 200) {
                            const meetDetail = data.data;
                            this.meetList = data.data;
                            if (meetDetail.leavExamJson) {
                                this.ruleForm.leavExamData.userJson = JSON.parse(meetDetail.leavExamJson)
                            }
                            this.saveDeviceList = meetDetail.equipmentJson ? JSON.parse(meetDetail.equipmentJson) : '';
                            if (meetDetail.meetingScopes) {
                                this.ruleForm.meetUserData = JSON.parse(meetDetail.meetingScopes);
                            } else if (meetDetail.users || meetDetail.groups || meetDetail.departs) {
                                this.ruleForm.meetUserData = {
                                    departJson: meetDetail.departs,
                                    groupJson: meetDetail.groups,
                                    userJson: meetDetail.users
                                }
                            }
                            this.fileJson = meetDetail.filesJson ? JSON.parse(meetDetail.filesJson) : [];
                            this.exportURL = global.BasePath + 'structure/meeting/downloadXls?meetingId=' + this.meetList.id + '&meetingTitle=' + this.meetList.theme + '&meetingType=' + this.meetList.meetingType + '&token=' + this.$store.getters.token;
                            
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

    .meetingDetail {
        padding:12px;
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
        border-bottom: 1px solid #e7eaec;
        margin-left: 4px;
        margin-top: 4px;
    }

    .file-item-des {
        padding-left: 4px;
        line-height: 30px;
        padding-right: 4px;
    }
</style>
<style lang="scss">
    .meetingDetail .el-form-item__content {
        padding-left: 10px;
    }

    .meetingDetail .el-form-item__label {
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

    .meetingDetail ol, .meetingDetail ul {
        padding-left: 30px;
    }

    .meetingDetail td, .meetingDetail th {
        padding: 5px 10px;
        border: 1px solid #DDD;
    }

    .meetingDetail p {
        margin: 0 0 10px;
    }

    .meetingDetail img {
       max-width: 250px;
    height: auto;
    margin-right: 50px;
    }
</style>
