<template>
    <div class="activityAdd">
        <div class="el-row menu-tools">
            <el-button type="default" size="medium" @click="$router.back()">返回</el-button>
            <el-button type="primary" size="medium" :loading="save_loading" @click="insertActivity(0)">保存</el-button>
            <el-button type="primary" size="medium" :loading="save_loading" @click="insertActivity(1)">发布</el-button>
            <!-- <el-button type="primary" size="medium" :loading="save_loading"   @click="insertActivity(2)">预览</el-button> -->
        </div>
        <div class="main-wrap scrollBar" :style="{ 'height': nobottommaxH + 'px' }">
            <el-form :model="ruleForm" ref="ruleForm" label-width="140px" class="demo-ruleForm">
                <!-- <el-form-item label="活动类型" class="is-required">
          <el-radio-group v-model="ruleForm.activityType" @change="activityHandler">
            <el-radio :label="0">内部活动</el-radio>
            <el-radio :label="1">外部活动</el-radio>
          </el-radio-group>
        </el-form-item> -->
                <el-form-item label="活动主题" class="is-required">
                    <el-input v-model.trim="ruleForm.theme" placeholder="活动主题(1-50个字符)" :maxlength="50"></el-input>
                </el-form-item>
                <el-form-item label="活动地点" class="is-required">
                    <el-input v-model.trim="ruleForm.place" placeholder="活动地点(1-50个字符)" :maxlength="50"></el-input>
                </el-form-item>
                <div>
                    <el-form-item label="活动时间" class="is-required">
                        <el-date-picker v-model="ruleForm.startTime" format="yyyy-MM-dd HH:mm" size="medium"
                            :clearable="false" placeholder="开始时间≥当前时间" type="datetime">
                        </el-date-picker>
                        <span>—</span>
                        <el-date-picker v-model="ruleForm.endTime" format="yyyy-MM-dd HH:mm" size="medium"
                            :clearable="false" type="datetime" placeholder="结束时间>开始时间">
                        </el-date-picker>
                    </el-form-item>
                </div>
                <el-form-item label="发送范围" class="is-required" v-show="ruleForm.activityType == 0">
                    <address-book v-model="ruleForm.activityScopes" :config="activityScopeData"></address-book>
                </el-form-item>
                <!-- <el-form-item label="是否定时发送" class="is-required">
                    <el-radio v-model="ruleForm.isOntimeSend" :label="0">不定时</el-radio>
                    <el-radio v-model="ruleForm.isOntimeSend" :label="1">定时发送</el-radio>
                </el-form-item> -->
                <el-form-item label="发送时间" class="is-required" v-if="ruleForm.isOntimeSend">
                    <el-date-picker v-model="ruleForm.sendDate" format="yyyy-MM-dd HH:mm" size="medium"
                        :clearable="false" placeholder="≥当前时间" type="datetime">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="活动封面" class="activityLogo">
                    <uploader pathPrefix="huodong" module="huodong" moduleCode="1210" :multiple="false"
                        v-model="activityLogo" :extList="['jpeg', 'jpg', 'bmp', 'gif', 'png']" showMode="cover"
                        :showModeCover="true" showResult="image"></uploader>
                </el-form-item>

                <!-- <el-form-item label="需要签到" class="applyWrap clearfix">
                    <el-checkbox v-model="ruleForm.isSign" :disabled="ruleForm.activityType == 1"></el-checkbox>
                </el-form-item> -->
                <el-form-item label="签到时间" class="is-required">
                    <div>
                        <el-date-picker v-model="ruleForm.beginTime" size="medium" :clearable="false" type="datetime"
                            format="yyyy-MM-dd HH:mm" value-format="yyyy-MM-dd HH:mm" placeholder="签到开始时间">
                        </el-date-picker>
                        <span>—</span>
                        <el-date-picker v-model="ruleForm.bendTime" size="medium" :clearable="false" type="datetime"
                            format="yyyy-MM-dd HH:mm" value-format="yyyy-MM-dd HH:mm" placeholder="签到结束时间">
                        </el-date-picker>

                    </div>
                </el-form-item>
                <div v-show="ruleForm.isResearchFlag && ruleForm.isSign" class="rearchBox">
                    <el-form-item label="主题" class="is-required">
                        <el-input v-model.trim="ruleForm.topicJson.topicName" placeholder="活动主题(1-50个字符)"
                            :maxlength="50"></el-input>
                    </el-form-item>
                    <el-form-item label="选项" class="is-required">
                        <div v-for="(topItem, topIndex) in ruleForm.topicJson.topicOptionsJson" :key="topIndex"
                            class="topicTab">
                            <el-input v-model.trim="topItem.optionName" placeholder="请输入答案选项"
                                :maxlength="50"></el-input>
                            <i class="el-icon-delete addIsSignBtn" @click="delTopicHandler(topIndex)"></i>
                        </div>
                        <i class="el-icon-circle-plus-outline addIsSignBtn" @click="addTopicHandler()"></i>
                    </el-form-item>
                </div>

                <el-form-item label="附件">
                    <uploader pathPrefix="huodong" module="huodong" moduleCode="1210" :multiple="true"
                        :extList="allFileTypeList" v-model="fileJson"></uploader>
                </el-form-item>
                <el-form-item label="内容" class="is-required">
                    <br />
                    <div class="myaddress-box">
                        <ueditor class="rich-editor" style="width: 740px;position: relative;right: 70px;" ref="ueditor"
                            :defaultMes="ruleForm.describe" @editModel="richTextEditHandler"></ueditor>
                    </div>
                </el-form-item>
                <!-- <el-form-item label="需要报名" class="applyWrap clearfix" v-show="ruleForm.activityType == 0">
                    <el-checkbox v-model="ruleForm.isApply"></el-checkbox>
                    <div v-show="ruleForm.isApply" class="applyBox">
                        <span class="is-required">报名截止时间&nbsp;</span>
                        <el-date-picker v-model="ruleForm.applyEndTime" size="medium" :clearable="false" type="datetime"
                            format="yyyy-MM-dd HH:mm" placeholder="报名截止时间">
                        </el-date-picker>

                        <span>报名人数&nbsp;</span>
                        <el-input style="width:220px;" v-model.trim="ruleForm.applyCount" placeholder="不填为不限制"
                            :maxlength="8" @keyup.native="proving(ruleForm.applyCount)"></el-input>
                    </div>
                </el-form-item>
                <el-form-item label="落款部门" class="applyWrap clearfix">
                    <el-checkbox v-model="ruleForm.isInscribe" @change="isInscribeHandler"></el-checkbox>
                    <div v-show="ruleForm.isInscribe" class="applyBox">
                        <el-select class="selectWidth" v-model="ruleForm.departId" placeholder="请选择部门"
                            @change="changeDepart">
                            <el-option v-for="groupItem in groupList" :key="groupItem.id" :label="groupItem.name"
                                :value="groupItem.id">
                            </el-option>
                        </el-select>
                    </div>
                </el-form-item>
                <el-form-item width="200px" label="允许上传活动剪影" class="applyWrap clearfix"
                    v-show="ruleForm.activityType == 0">
                    <el-checkbox v-model="ruleForm.allowUploadPicFlag"></el-checkbox>
                </el-form-item> -->
            </el-form>
        </div>
    </div>
</template>
<script>
import mixin from '@/mixins/windowResize';
import { mapGetters } from 'vuex';
import AddressBook from '@/components/AddressBook/indexExpand';
import Ueditor from "@/components/Ueditor";
import Uploader from '@/components/Uploader/WebUploader';
import { getActivityInfo, queryDepartByUserId, editActivity } from '@/api/activity';
export default {
    name: 'kezhongyutanActivityEdit',
    components: {
        AddressBook,
        Ueditor,
        Uploader
    },
    data() {
        return {
            activityId: this.$route.query.id,
            save_loading: false,
            ruleForm: {
                isOntimeSend: 0,
                sendDate: '',
                activityType: 0,
                theme: '',
                place: '',
                startTime: new Date(),//单活动时间
                endTime: new Date(),
                activityScopes: {},
                activityScope: '',
                isApply: 0,
                applyEndTime: new Date(),
                applyCount: '',
                isSign: 0,//签到
                signTimeStr: [],
                beginTime: new Date(),
                bendTime: new Date(),
                notSendSign: 0,
                isResearch: 1,//活动调查 1否 2是
                isResearchFlag: false,
                activityLogo: '',
                topicJson: {
                    topicName: '',
                    topicOptionsJson: [
                        {
                            optionName: '',
                            optionNo: 1
                        },
                        {
                            optionName: '',
                            optionNo: 2
                        }
                    ]
                },
                topIndex: 2,
                isInscribe: 0,
                departId: 0,
                departName: '',
                allowUploadPicFlag: true,
                describe: '',
                schoolId: '',
                signQrCode: ''
            },
            //新增会议时间
            maxTime: '',
            littleDate: '',
            largeDate: '',
            groupList: [], //下拉框  落款部门
            activityScopeData: {
                title: '请选择发布范围',
                depart: { target: "depart", departType: "s", userTypes: "2" },
                group: false
            },
            activityLogo: [
                {
                    fileUrl: 'https://cdnfile-10043692.file.myqcloud.com/mobile/images/cover/activity.jpg',
                    fileName: 'activity_cover.jpg'
                },
            ],
            allFileTypeList: ['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'pdf'],
            fileJson: [],
            userid: ''
        }
    },
    created() {
        this.userid = this.$store.getters.userInfo.id;
        this.queryDepartByUserIdFunc(this.userid);
    },
    mounted() {
        this.ruleForm.signTimeStr = [];
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
            return date ? date.slice(0, 16) : '';
        }
    },
    methods: {
        proving(item) {
            item = item.replace(/[^\d]/g, '');
            this.ruleForm.applyCount = item;
        },
        isInscribeHandler(val) {
            this.ruleForm.isInscribe = val;
            if (this.ruleForm.isInscribe) {
                this.queryDepartByUserIdFunc(this.userid);
            }
        },
        getActivityInfoFunc() {
            getActivityInfo({
                activityId: this.activityId
            }).then(res => res.data)
                .then(data => {
                    if (data.code === 200) {
                        const activityData = data.data;
                        this.ruleForm.activityType = activityData.activityType;
                        this.ruleForm.theme = activityData.theme;
                        this.ruleForm.place = activityData.place;
                        this.ruleForm.startTime = activityData.startTime;
                        this.ruleForm.endTime = activityData.endTime;
                        if (activityData.departId) {
                            this.ruleForm.departId = Number(activityData.departId);
                            this.ruleForm.departName = activityData.departName;
                        }
                        if (activityData.activityScopes) {
                            this.ruleForm.activityScopes = JSON.parse(activityData.activityScopes);
                        } else if (activityData.users || activityData.groups || activityData.departs) {
                            this.ruleForm.activityScopes = {
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

                        this.ruleForm.isApply = activityData.isApply == 0 ? false : true;
                        this.ruleForm.applyEndTime = activityData.applyEndTime;
                        this.ruleForm.applyCount = activityData.applyCount == 0 ? '' : activityData.applyCount;
                        this.ruleForm.isSign = activityData.isSign == 1 ? true : false;
                        // this.ruleForm.signTimeStr = activityData.signTimes;
                         this.ruleForm.beginTime = activityData.signTimes[0].beginTime;
                        this.ruleForm.bendTime = activityData.signTimes[0].endTime;
                        this.ruleForm.notSendSign = activityData.notSendSign == 1 ? true : false;
                        this.ruleForm.isResearchFlag = activityData.isResearch == 2 ? true : false;
                        if (activityData.activityTopic) {
                            this.ruleForm.topicJson = activityData.activityTopic;
                            this.ruleForm.topicJson.topicOptionsJson = activityData.activityTopic.topicOptionList;
                        }
                        this.ruleForm.isInscribe = activityData.isInscribe == 1 ? true : false;

                        this.ruleForm.allowUploadPicFlag = activityData.allowUploadPic == 1 ? true : false;
                        this.ruleForm.describe = activityData.describe;
                        this.$refs.ueditor.setContent(activityData.describe);
                        this.fileJson = activityData.filesJson ? JSON.parse(activityData.filesJson) : [];
                        this.ruleForm.schoolId = activityData.schoolId;
                        if (activityData.signQrCode == null || activityData.signQrCode == '') {
                            this.ruleForm.signQrCode = '';
                        } else {
                            this.ruleForm.signQrCode = activityData.signQrCode;
                        }
                        this.ruleForm.isOntimeSend = activityData.isOntimeSend - 0;
                        if (this.ruleForm.isOntimeSend) {
                            this.ruleForm.sendDate = this.$moment(activityData.sendDate).format('YYYY-MM-DD HH:mm')
                        }
                    }
                })
        },
        fileNameUse(file) {
            return file.indexOf('?') !== -1 ? file.slice(0, file.indexOf('?')) : file;
        },
        activityHandler(val) {
            this.ruleForm.activityType = val;
            if (this.ruleForm.activityType == 1) {
                //
                this.ruleForm.isSign = true;
            }
        },
        changeDepart(val) {
            //切换部门
            this.ruleForm.departId = val;
            let departItem = this.groupList.find((item) => item.id == val);
            this.ruleForm.departName = departItem.name;
        },
        queryDepartByUserIdFunc(userid) {
            queryDepartByUserId({
                userId: userid,
                depType: 7
            }).then(res => res.data)
                .then(data => {
                    if (data.code === 200) {
                        this.groupList = data.data;
                        this.ruleForm.departId = this.groupList[0].id;
                        this.ruleForm.departName = this.groupList[0].name;
                    }
                }).catch(() => { })
        },
        addTopicHandler() {
            this.topIndex++;
            this.ruleForm.topicJson.topicOptionsJson.push({
                optionName: '',
                optionNo: this.topIndex
            })
        },
        delTopicHandler(index) {
            if (this.ruleForm.topicJson.topicOptionsJson.length <= 2) {
                this.$message({
                    type: "error",
                    message: "请至少填写两个选项！"
                });
                return false;
            } else {
                this.ruleForm.topicJson.topicOptionsJson.splice(index, 1);
            }
        },
       
        
        richTextEditHandler(content) {
            this.ruleForm.describe = content;
        },
        insertActivity(status) {
            if (this.ruleForm.theme == "") {
                this.$message({
                    type: "error",
                    message: "请输入活动主题！"
                });
                return false;
            }
            if (this.ruleForm.place == "") {
                this.$message({
                    type: "error",
                    message: "请输入活动地点！"
                });
                return false;
            }
            if (this.ruleForm.startTime == '') {
                this.$message({
                    type: "error",
                    message: "请输入活动开始时间！"
                });
                return false;
            }
            if (this.$moment(this.ruleForm.startTime).format('YYYY-MM-DD HH:mm') <= this.$moment(new Date()).format('YYYY-MM-DD HH:mm')) {
                this.$message({
                    type: "error",
                    message: "活动开始时间应大于当前时间！"
                });
                return false;
            }
            if (this.ruleForm.endTime == '') {
                this.$message({
                    type: "error",
                    message: "请输入活动结束时间！"
                });
                return false;
            }
            if (this.$moment(this.ruleForm.endTime).format('YYYY-MM-DD HH:mm') <= this.$moment(this.ruleForm.startTime).format('YYYY-MM-DD HH:mm')) {
                this.$message({
                    type: "error",
                    message: "活动结束时间应大于开始时间！"
                });
                return false;
            }
            if (this.ruleForm.activityType == 0) {
                if (Object.keys(this.ruleForm.activityScopes).length == 0) {
                    this.$message({
                        type: "error",
                        message: "请选择活动范围！"
                    });
                    return false;
                }
            }
            let sendDate = ''
            if (this.ruleForm.isOntimeSend) {
                if (!this.ruleForm.sendDate) {
                    this.$message({
                        type: "error",
                        message: "请选择发送时间！"
                    });
                    return false;
                }
                if (this.$moment(this.ruleForm.sendDate).format('YYYY-MM-DD HH:mm') <= this.$moment(new Date()).format('YYYY-MM-DD HH:mm')) {
                    this.$message({
                        type: "error",
                        message: "发送时间应大于当前时间！"
                    });
                    return false;
                }
                sendDate = this.$moment(this.ruleForm.sendDate).format('YYYY-MM-DD HH:mm') + ':00';
            }
            if (this.ruleForm.activityType == 0) {
                if (this.ruleForm.isApply) {
                    if (this.ruleForm.applyEndTime == '') {
                        this.$message({
                            type: "error",
                            message: "请输入报名截止时间！"
                        });
                        return false;
                    }
                    if (this.$moment(this.ruleForm.startTime).format('YYYY-MM-DD HH:mm') <= this.$moment(this.ruleForm.applyEndTime).format('YYYY-MM-DD HH:mm')) {
                        this.$message({
                            type: "error",
                            message: "报名截止时间应小于活动开始时间！"
                        });
                        return false;
                    }
                    if (this.$moment(this.ruleForm.applyEndTime).format('YYYY-MM-DD HH:mm') <= this.$moment(new Date()).format('YYYY-MM-DD HH:mm')) {
                        this.$message({
                            type: "error",
                            message: "报名截止时间应大于当前时间！"
                        });
                        return false;
                    }
                }
            }
          

            if (this.ruleForm.beginTime == null || this.ruleForm.beginTime == '') {
                this.$message({
                    type: "error",
                    message: "请设置活动签到开始时间！"
                });
                return false;
            }
            if (this.ruleForm.isResearchFlag) {
                if (this.ruleForm.topicJson.topicName == '') {
                    this.$message({
                        type: "error",
                        message: "请输入调查主题！"
                    });
                    return false;
                }
                const topTag = this.ruleForm.topicJson.topicOptionsJson ? this.ruleForm.topicJson.topicOptionsJson.every((item) => {
                    return item.optionName !== '';
                }) : false;
                if (!topTag) {
                    this.$message({
                        type: "error",
                        message: "请设置完整的选项！"
                    });
                    return false;
                }

            }

            if (this.ruleForm.describe == '') {
                this.$message({
                    type: "error",
                    message: "请输入活动介绍！"
                });
                return false;
            }


            this.ruleForm.startTime = this.$moment(this.ruleForm.startTime).format('YYYY-MM-DD HH:mm') + ":00";
            this.ruleForm.endTime = this.$moment(this.ruleForm.endTime).format('YYYY-MM-DD HH:mm') + ":00";
            if (this.ruleForm.isApply) {
                this.ruleForm.applyEndTime = this.$moment(this.ruleForm.applyEndTime).format('YYYY-MM-DD HH:mm') + ":00";
            }


            if (this.ruleForm.isResearchFlag && this.ruleForm.isSign) {
                this.ruleForm.topicJson.topicOptionsJson = this.ruleForm.topicJson.topicOptionsJson.map((item, index) => ({
                    optionName: item.optionName,
                    optionNo: index + 1
                }));
            }
            if (this.ruleForm.activityScopes) {
                this.ruleForm.activityScope = JSON.stringify(this.ruleForm.activityScopes);
            }
            this.ruleForm.describe = this.$refs.ueditor.getContent();
            this.ruleForm.activityLogo = this.activityLogo.map(item => item.fileUrl).toString();
            //活动类型 0单次活动 1常规例会
            if (this.ruleForm.activityType === 0) {
                if (!this.ruleForm.isApply) {
                    this.ruleForm.applyEndTime = '';
                    this.ruleForm.applyCount = 0;
                }
                if (!this.ruleForm.isSign) {
                    this.ruleForm.signTimeStr = [];
                    this.ruleForm.notSendSign = false;
                    this.ruleForm.isResearchFlag = false;
                    this.ruleForm.topicJson = {};
                }
                if (!this.ruleForm.isResearchFlag) {
                    this.ruleForm.topicJson = {};
                }
                if (!this.ruleForm.isInscribe) {
                    this.ruleForm.departId = 0;
                    this.ruleForm.departName = '';
                }
            } else {
                this.ruleForm.activityScope = '';
                this.ruleForm.isApply = false;
                this.ruleForm.applyEndTime = '';
                this.ruleForm.notSendSign = 0;
                this.ruleForm.applyCount = 0;
                this.ruleForm.allowUploadPicFlag = false;
                if (!this.ruleForm.isResearchFlag) {
                    this.ruleForm.topicJson = {};
                }
                if (!this.ruleForm.isInscribe) {
                    this.ruleForm.departId = 0;
                    this.ruleForm.departName = '';
                }
            }
            this.save_loading = true;
            editActivity({
                activityType: this.ruleForm.activityType,
                theme: this.ruleForm.theme,
                place: this.ruleForm.place,
                startTime: this.ruleForm.startTime,
                endTime: this.ruleForm.endTime,
                activityScopes: this.ruleForm.activityScope,
                activityLogo: this.ruleForm.activityLogo,
                isApply: this.ruleForm.isApply ? 1 : 0,
                applyEndTime: this.ruleForm.applyEndTime,
                applyCount: this.ruleForm.applyCount ? this.ruleForm.applyCount : 0,
                isSign: this.ruleForm.isSign ? 1 : 0,
                signTimeStr: JSON.stringify([{
                    beginTime: this.ruleForm.beginTime,
                    endTime: this.ruleForm.bendTime,
                    signNo: 1
                }]),
                notSendSign: this.ruleForm.notSendSign ? 1 : 0,
                isResearch: this.ruleForm.isResearchFlag ? 2 : 1,
                topicJson: this.ruleForm.topicJson ? JSON.stringify(this.ruleForm.topicJson) : this.ruleForm.topicJson,
                isInscribe: this.ruleForm.isInscribe ? 1 : 0,
                departId: this.ruleForm.departId,
                id: this.activityId,
                departName: this.ruleForm.departName,
                allowUploadPic: this.ruleForm.allowUploadPicFlag ? 1 : 0,
                describe: this.ruleForm.describe,
                filesJson: this.fileJson ? JSON.stringify(this.fileJson) : this.fileJson,
                schoolId: this.ruleForm.schoolId,
                signQrCode: this.ruleForm.signQrCode,
                status: status,
                isOntimeSend: this.ruleForm.isOntimeSend,
                sendDate: sendDate,
                moduleType: 2
            }).then(res => res.data)
                .then(data => {
                    if (data.code === 200 && data.result) {
                        if (status == 0) {
                            this.$message({
                                type: "success",
                                message: "保存成功!"
                            });
                        } else if (status == 1) {
                            this.$message({
                                type: "success",
                                message: "发布成功!"
                            });
                        } else if (status == 2) {
                            this.$message({
                                type: "success",
                                message: "保存成功!预览活动请到手机端查看!"
                            });
                        }
                        this.$router.push({
                            path: 'kezhongyutanList'
                        })
                    } else {
                        this.$message.error(data.msg);
                        this.save_loading = false;
                        if (!this.ruleForm.isResearchFlag) {
                            this.ruleForm.topicJson = {
                                topicName: '',
                                topicOptionsJson: [
                                    {
                                        optionName: '',
                                        optionNo: 1
                                    },
                                    {
                                        optionName: '',
                                        optionNo: 2
                                    }
                                ]
                            }
                        }
                    }
                }).catch(() => {
                    this.save_loading = false;
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

.applyWrap {
    .el-checkbox {
        float: left;
    }
}

.applyBox {
    float: left;

    span {
        display: inline-block;
        height: 36px;
        margin-right: 6px;
    }

    span.is-required:before {
        content: "*";
        color: #ff4949;
        margin-right: 4px;
    }
}

.activityAdd {
    padding: 12px;
    box-sizing: border-box;

    .menu-tools {
        border-bottom: 1px solid #e7eaec;
        padding-bottom: 10px;
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

            .addIsSignBtn {
                font-size: 20px;
                color: #409eff;
                cursor: pointer;
            }
        }

        .rearchBox {
            width: 658px;

            .el-input {
                width: 460px;
            }

            .topicTab {
                margin-bottom: 10px;
            }
        }

        .selectWidth {
            width: 358px;
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
            font-weight: bold;
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
</style>
<style lang="scss">
.activityAdd .el-form-item__content {
    padding-left: 10px;
}

.activityAdd .el-checkbox {
    margin-right: 20px;
}

.activityAdd {
    .activityLogo {
        .upload-file-item {
            width: 200px !important;

            img {
                width: 100% !important;
                min-height: 110px;
                margin: 0
            }

            .file-name {
                display: none;
            }
        }
    }
}
</style>
