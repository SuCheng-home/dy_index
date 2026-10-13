<!--添加通知-->
<template>
    <div class="app-container calendar-list-container" id="noticeAdd">
        <backtool>
            <template v-if="type=='add'">
                <el-button type="primary" size="medium" :loading="loading" @click.native="noticeSave(1,'add')">存草稿
                </el-button>
                <el-button type="primary" size="medium" :loading="loading" @click.native="noticeSave(3,'add')">手机预览
                </el-button>
                <el-button type="primary" size="medium" :loading="loading" @click.native="noticeSave(2,'add')">发通知
                </el-button>
            </template>
            <template v-if="type=='edit'">
                <el-button type="primary" size="medium" :loading="loading" @click.native="noticeSave(1,'edit')">存草稿
                </el-button>
                <el-button type="primary" size="medium" :loading="loading" @click.native="noticeSave(3,'edit')">手机预览
                </el-button>
                <el-button type="primary" size="medium" :loading="loading" @click.native="noticeSave(2,'edit')">发通知
                </el-button>
            </template>
        </backtool>
        <div :class="['page-main', isStandalone ? 'page-main--scroller' : '']" :style="{'height':nobottommaxH+'px'}"
             style="overflow: auto">
            <div style="width: 810px;padding-top:20px;margin: 0 auto;">
                <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="140px" class="demo-ruleForm">
                    <el-form-item label="通知标题" prop="title">
                        <el-input v-model="ruleForm.title"></el-input>
                    </el-form-item>
                    <el-form-item label="通知范围" prop="addressData">
                        <address-book v-model="ruleForm.addressData" :config="ruleForm.configData"></address-book>
                    </el-form-item>
                    <el-form-item label="通知封面" prop="imageUrl">
                        <chose-cover module="tongzhi" moduleCode="1201" :sourceCover="sourceCover"
                                     v-model="ruleForm.imageUrl"></chose-cover>
                    </el-form-item>
                    <el-form-item label="上传图片" v-if="pics.length>0">
                        <div class="notice-img">
                            <div class="img-item" :style="{backgroundImage:'url('+item.url+')'}" :key="item.picId"
                                 v-for="item in pics">
                                <span class="img-box-item-close" @click="delPic(item)"></span>
                            </div>
                            <div class="clear"></div>
                        </div>
                    </el-form-item>
                    <el-form-item label="附件">
                        <uploader :extList="allFileTypeList" v-model="files"
                                  :multiple="true" pathPrefix="tongzhi" module="tongzhi" moduleCode="1201"></uploader>
                    </el-form-item>
                    <el-form-item class="new-editor" label="通知内容" prop="noticeContent">
                        <br />
                        <ueditor style="width: 740px;position: relative;right: 70px;" class="rich-editor new-editor" ref="ueditor" :defaultMes="ruleForm.noticeContent"
                                 @editModel="richTextEditHandler">
                        </ueditor>
                    </el-form-item>
                    <el-form-item label="接收人确认方式" prop="isSign">
                        <!-- <el-col :span="2">
                            <el-switch on-text="" off-text="" v-model="ruleForm.isSign" :active-value="1" :inactive-value="0"></el-switch>
                        </el-col> -->
                         <el-radio-group v-model="ruleForm.isSign">
                            <el-radio :label="0">不需要</el-radio>
                            <el-radio :label="1">签字确认</el-radio>
                            <el-radio :label="2">阅读确认</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="落款部门" prop="inscribe">
                        <el-col :span="2">
                            <el-switch on-text="" off-text="" v-model="ruleForm.inscribe"></el-switch>
                        </el-col>
                        <el-col :span="6">
                            <el-select allow-create filterable v-show="ruleForm.inscribe" v-model.trim="departValue"
                                       placeholder="请选择">
                                <el-option v-for="item in departOptions" :key="item.value" :label="item.label"
                                           :value="item.value">
                                </el-option>
                            </el-select>
                        </el-col>
                    </el-form-item>
                    <el-form-item label="允许回复" prop="isAnswer">
                        <el-radio-group v-model="ruleForm.isAnswer">
                            <el-radio :label="'1'">不允许</el-radio>
                            <el-radio :label="'0'">允许回复，内容公开</el-radio>
                            <el-radio :label="'2'">允许回复，内容仅自己可见</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="对教师公开阅读情况">
                        <el-col :span="3">
                            <el-switch :active-value="1" :inactive-value="2" v-model="ruleForm.isOpenForTeacher"></el-switch>
                        </el-col>
                    </el-form-item>
                    <el-form-item label="定时发送" prop="setTime">
                        <el-col :span="3">
                            <el-switch on-text="" off-text="" v-model="ruleForm.setTime"></el-switch>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item prop="timing">
                                <el-date-picker v-show="ruleForm.setTime" type="datetime" placeholder="发送时间"
                                                format="yyyy-MM-dd HH:mm" :editable='false' :clearable='false'
                                                v-model="ruleForm.timing" style="width: 100%;"></el-date-picker>
                            </el-form-item>
                        </el-col>
                    </el-form-item>
                    <el-form-item label="过期时间" prop="overdueTime">
                        <el-date-picker type="datetime" placeholder="过期时间（不设置即长期有效）" format="yyyy-MM-dd HH:mm"
                                        :editable='false' v-model="ruleForm.overdueTime"
                                        style="width: 100%;"></el-date-picker>

                    </el-form-item>
                </el-form>
            </div>
        </div>
    </div>
</template>

<script>
    import Ueditor from '@/components/Ueditor';
    import Backtool from '@/components/BackTool';
    import Uploader from '@/components/Uploader/WebUploader';
    import AddressBook from '@/components/AddressBook/indexExpand';
    import {addNotice, updateNotice, getNoticeInfo,lastLogoUrl} from '@/api/notice';
    import {queryDepartByUserId} from '@/api/system';
    import {getDropDownList} from '@/utils/utils';
    import ChoseCover from '@/components/ChoseCover';
    import mixin from '@/mixins/windowResize';

    import {mapGetters} from 'vuex';

    const IS_SEBDOINTIME = {OK: 1, NO: 0};//是否定时发送(1为需要，0不需要)
    const INSCRIBE = {OK: 1, NO: 0};//是否落款(1代表落款,0代表不落款)
    export default {
        components: {
            Ueditor,
            AddressBook,
            Backtool,
            ChoseCover,
            Uploader
        },
        computed: {
            ...mapGetters(['isStandalone', 'userInfo'])
        },
        watch: {
            'ruleForm.addressData': {
                handler: function () {
                    this.$refs.ruleForm.validateField('addressData');
                },
                deep: true
            },
            'ruleForm.noticeContent': {
                handler: function () {
                    this.$refs.ruleForm.validateField('noticeContent');
                },
                deep: true
            }
        },
        data() {
            const checkTitle = (rule, value, callback) => {
                if (value.trim().length === 0) {
                    return callback(new Error('通知标题不能为空！'));
                } else {
                    if (value.length > 40) {
                        return callback(new Error('长度在 1 到 40 个字符！'));
                    } else {
                        callback();
                    }
                }
            };
            const checkAddressData = (rule, value, callback) => {
                if ((value.userJson && value.userJson.length > 0) || (value.departJson && value.departJson.length > 0) || (value.groupJson && value.groupJson.length > 0)) {
                    callback();
                } else {
                    return callback(new Error('通知范围不能为空！'));
                }
            };
            const checkOverdueTime = (rule, value, callback) => {
                if (value) {
                    //过期时间应大于当前时间
                    let currentDate = this.$moment().format('YYYY-MM-DD HH:mm');
                    let chosedDate = this.$moment(value).format('YYYY-MM-DD HH:mm');
                    if (this.$moment(chosedDate).isSameOrBefore(currentDate)) {
                        return callback(new Error('过期时间应大于当前时间！'));
                    } else {
                        if (this.ruleForm.setTime) {//如果是定时则要大于定时时间
                            let timing = this.$moment(this.ruleForm.timing).format('YYYY-MM-DD HH:mm');
                            if (this.$moment(chosedDate).isSameOrBefore(timing)) {
                                return callback(new Error('过期时间应大于定时时间！'));
                            } else {
                                callback();
                            }
                        } else {
                            callback();
                        }
                    }
                } else {
                    this.ruleForm.overdueTime = '';
                    callback();
                }
            };
            const checkTiming = (rule, value, callback) => {
                if (this.ruleForm.setTime) {
                    let currentDate = this.$moment().format('YYYY-MM-DD HH:mm');
                    let chosedDate = this.$moment(value).format('YYYY-MM-DD HH:mm');
                    if (this.$moment(chosedDate).isSameOrBefore(currentDate)) {
                        return callback(new Error('定时时间应大于当前时间！'));
                    } else {
                        callback();
                    }
                } else {
                    callback();
                }
            };
            const inscribeValidator = (rule, vlaue, callback) => {
                if (this.ruleForm.inscribe && this.departValue === '') {
                    callback(new Error('落款部门不能为空！'));
                } else {
                    callback();
                }
            };
            return {
                loading: false,
                noticeId: '',
                copyId: this.$route.query.copyId,
                type: 'add',
                ruleForm: {
                    title: '',
                    timing: this.$moment().add(30, 'm').format('YYYY-MM-DD HH:mm'),
                    isAnswer: '1',
                    inscribe: false,
                    setTime: false,
                    configData: {
                        title: '发布范围',
                        depart: {target: 'all', departType: 'all', userTypes: '1,2'},
                        group: {
                            groupTarget: 'all',
                            groupScope: [1, 2]
                        }
                    },
                    addressData: {},
                    imageUrl: 'https://cdnfile-10043692.cos.ap-shanghai.myqcloud.com/admin/images/notice/notice-cover1.png',
                    noticeContent: '',
                    overdueTime: '',
                    isOpenForTeacher: 1,
                    isSign: 0
                },
                rules: {
                    title: [
                        {required: true, validator: checkTitle, trigger: 'blur'}
                    ],
                    addressData: [
                        {required: true, validator: checkAddressData, trigger: 'blur'}
                    ],
                    imageUrl: [
                        {required: true, message: '请选择图片', trigger: 'blur'}
                    ],
                    isAnswer: [
                        {required: true, message: '请选择回复类型', trigger: 'blur'}
                    ],
                    noticeContent: [
                        {required: true, message: '通知内容不能为空', trigger: 'change'}
                    ],
                    overdueTime: [
                        {validator: checkOverdueTime, trigger: 'blur'}
                    ],
                    timing: [
                        {validator: checkTiming, trigger: 'blur'}
                    ],
                    inscribe: [{
                        required: true, trigger: 'blur', validator: inscribeValidator
                    }],
                    isSign: [{
                        required: true, trigger: 'blur'
                    }]
                },
                departOptions: [],
                departValue: '',
                sourceCover: [
                    'https://cdnfile-10043692.cos.ap-shanghai.myqcloud.com/admin/images/notice/notice-cover1.png',
                    'https://wxtestpb-10048617.image.myqcloud.com/d778ba5a-614e-4197-8dc9-8be961ce6d96?imageView2/q/100/w/800',
                    'https://wxtestpb-10048617.image.myqcloud.com/1343c173-06e8-40b7-97c4-d6c15df5eafc?imageView2/q/100/w/800',
                    'https://wxtestpb-10048617.image.myqcloud.com/ccbe0322-2879-496e-9980-39a926b6a15e?imageView2/q/100/w/800'
                ],
                pics: [],
                allFileTypeList: ['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'pdf', 'zip', 'rar'],
                files: []
            };
        },
        mixins: [mixin],
        created() {
            let id = this.$route.query.id;
            let userid = this.$store.getters.userInfo.id;
            queryDepartByUserId(userid, 7).then(res => {
                this.departOptions = getDropDownList(res.data.data, {label: "name", value: "id"});
                if (this.departOptions.length > 0 && id === undefined && !this.copyId) {
                    this.departValue = this.departOptions[0].value;
                }
            }).catch(err => {
            });
            if (id) {//如果是编辑
                this.noticeId = id;
                this.type = "edit";
                this.getNoticeDetail();
            } else if(this.copyId) {
                this.noticeId = this.copyId;
                this.type = 'add';
                this.getNoticeDetail();
            }else{
                 lastLogoUrl().then(res => {
                    let data = res.data.data;
                    if(data){
                        this.ruleForm.imageUrl=data;
                    }                   
                }).catch();
            }
        },
        methods: {
            resetForm(formName) {
                this.$refs[formName].resetFields();
            },
            getAddressData(data) {
                this.ruleForm.addressData = data;
            },
            noticeSave(code, type) {//添加通知
                const selectedDepartObject = this.departOptions.find(item => item.value === this.departValue);
                this.ruleForm.noticeContent = this.$refs.ueditor.getContent();
                this.$refs['ruleForm'].validate(valid => {
                    if (valid) {
                        this.btnLoadState(true);
                        let departId = null, departName = null;
                        if (this.ruleForm.inscribe) {
                            departId = selectedDepartObject === undefined ? 0 : this.departValue;
                            departName = selectedDepartObject === undefined ? this.departValue : selectedDepartObject.label;
                        } else {
                            departId = 0;
                            departName = '';
                        }
                        let picIdArray = [];
                        this.pics.forEach(function (item) {
                            picIdArray.push({ fileUrl: item.url,fileName:"",fileId:"",url:item.url});
                        });
                        let picIds = picIdArray.length?JSON.stringify(picIdArray):""; //图片id
                        const query = {
                            noticeTitle: this.ruleForm.title,
                            releaseUserId: this.userInfo.id,
                            releaseUserName: this.userInfo.name,
                            noticeState: code == 2 ? 2 : 1, //如果是发布则改为发布状态
                            createType: 0,
                            isReply: 1, //微信的会话开关
                            departJson: JSON.stringify(this.ruleForm.addressData.departJson), //部门json字符串
                            groupJson: JSON.stringify(this.ruleForm.addressData.groupJson), //群组json字符串
                            userJson: JSON.stringify(this.ruleForm.addressData.userJson), //用户json字符串
                            isAnswer: this.ruleForm.isAnswer, //是否允许
                            isSendOntime: this.ruleForm.setTime ? IS_SEBDOINTIME.OK : IS_SEBDOINTIME.NO, //是否定时发送
                            sendTime: this.ruleForm.setTime ? this.$moment(this.ruleForm.timing).format('YYYY-MM-DD HH:mm') : this.$moment().format('YYYY-MM-DD HH:mm'), //定时发送时间
                            logoURL: this.ruleForm.imageUrl, //通知封面
                            inscribe: this.ruleForm.inscribe ? INSCRIBE.OK : INSCRIBE.NO, //是否落款(1代表落款,0代表不落款)
                            departId: departId,
                            departName: departName,
                            fileCount: this.files.length,
                            fileJson: JSON.stringify(this.files),
                            picIds: picIds,
                            infaceType: code, //接口类型
                            overdueTime: this.ruleForm.overdueTime == '' ? '' : this.$moment(this.ruleForm.overdueTime).format('YYYY-MM-DD HH:mm'),
                            sendType: 1, //默认传1，按发布范围发送，后期会迭代选择2中方式
                            isOpenForTeacher: this.ruleForm.isOpenForTeacher,
                            isSign: this.ruleForm.isSign
                        };

                        new Promise(resolve => {
                            if(code == 2) {
                                const h = this.$createElement;
                                const depart = this.ruleForm.addressData.departJson.map(item => item.name).join('、');
                                const group = this.ruleForm.addressData.groupJson.map(item => item.name).join('、');
                                const user = this.ruleForm.addressData.userJson.map(item => item.name).join('、');

                                this.$msgbox({
                                    title: '发布',
                                    message: h('div', null, [
                                        h('h3', null, '该通知将发布到以下范围 '),
                                        h('p', null, depart),
                                        h('p', null, user),
                                        h('p', null, group)
                                    ]),
                                    showCancelButton: true,
                                    confirmButtonText: '确定',
                                    cancelButtonText: '取消',
                                }).then(action => {
                                    resolve();
                                }).catch(() => {
                                    this.loading = false;
                                });
                            } else {
                                resolve();
                            }
                        })
                            .then(() => {
                                if (type === 'add') {
                                    query.noticeContent = this.ruleForm.noticeContent;
                                    addNotice(query).then(res => {
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
                                } else {
                                    query.noticeContent = this.$refs.ueditor.getContent();
                                    query.noticeType = 0;
                                    query.id = this.noticeId ? this.noticeId : '';
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
                            });
                    }
                });
            },
            btnLoadState(state) {
                this.loading = state;
            },
            richTextEditHandler(content) {
                this.ruleForm.noticeContent = content;
            },
            getNoticeDetail() {
                getNoticeInfo(this.noticeId, 0).then(res => {
                    let data = res.data.data;
                    this.ruleForm.title = data.noticeTitle;
                    this.ruleForm.imageUrl = data.logoURL;
                    this.ruleForm.reply = data.isReply.toString();
                    this.ruleForm.isAnswer = data.isAnswer.toString();
                    this.ruleForm.setTime = data.isSendOntime === IS_SEBDOINTIME.OK;
                    this.ruleForm.timing = data.sendTime;
                    this.ruleForm.inscribe = data.inscribe == INSCRIBE.OK;
                    this.departValue = data.departId === 0 ? data.departName : data.departId;
                    this.ruleForm.noticeContent = data.noticeContent;
                    this.$refs.ueditor.setContent(data.noticeContent);
                    this.ruleForm.overdueTime = data.overdueTime == null ? '' : data.overdueTime;
                    this.ruleForm.addressData = {
                        departJson: JSON.parse(data.departJson),
                        userJson: JSON.parse(data.userJson),
                        groupJson: JSON.parse(data.groupJson)
                    };
                    this.ruleForm.isOpenForTeacher = data.isOpenForTeacher;
                    this.ruleForm.isSign = data.isSign;
                    if (data.fileJson) {
                        const files = JSON.parse(data.fileJson);
                        files.forEach(item => {
                            item.url = item.fileUrl;
                            item.fileInfo = {
                                name: item.fileName
                            }
                        });
                        this.files = files;
                    }
                    data.pics.forEach((item) => {
                        this.pics.push({id: item.picId, url: item.url});
                    });
                }).catch();
            },
            delPic(item) {
                this.pics = this.pics.filter(function (currentItem) {
                    return currentItem.id != item.id;
                });
            }
        }
    }
</script>
<style scoped>
    .el-message-box__message{
        max-height: 720px;
        overflow: hidden auto;
    }
</style>
<style scoped>
    .img-item {
        width: 160px;
        height: 200px;
        float: left;
        margin-right: 10px;
        margin-top: 10px;
        background-position: center center;
        background-size: cover;
        position: relative;
        border: 1px solid #d0d0d0;
    }


    .img-box-item-close {
        width: 36px;
        height: 36px;
        display: block;
        float: right;
        background-size: cover;
        background-position: center center;
        background-image: url(https://cdnfile-10043692.file.myqcloud.com/vuewxcep/common_img/wxcep_phone_close.png);
        cursor: pointer;
    }
</style>
