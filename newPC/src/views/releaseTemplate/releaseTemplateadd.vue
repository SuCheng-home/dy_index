<!--添加通知-->
<template>
    <div class="app-container calendar-list-container" id="noticeAdd">
        <backtool>
           <el-button type="primary" size="medium" v-if="ruleForm.status==1" :loading="loading" @click.native="noticeSave(1)">保存草稿</el-button>
           <el-button type="primary" size="medium" :loading="loading" @click.native="noticeSave(2)">发布</el-button>
        </backtool>
        <div :class="['page-main', isStandalone ? 'page-main--scroller' : '']" :style="{'height':nobottommaxH+'px'}"
             style="overflow: auto">
            <div style="width: 810px;padding-top:20px;margin: 0 auto;">
                <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="140px" class="demo-ruleForm">
                    <el-form-item label="活动主题" prop="title">
                        <el-input v-model="ruleForm.title"  placeholder="请输入主题"></el-input>
                    </el-form-item>
                     <el-form-item label="活动封面" prop="logoUrl">
                        <chose-cover module="fazhidaketang" moduleCode="1201" :sourceCover="sourceCover" v-model="ruleForm.logoUrl"></chose-cover>
                    </el-form-item>
                     <el-form-item label="活动地点" prop="adress" v-if="formData.isAdress==1">
                        <el-input v-model="ruleForm.adress"  placeholder="请输入地点"></el-input>
                    </el-form-item>
                    <el-form-item label="活动时间" prop="activityTime" v-if="formData.isTime==1">
                        <el-date-picker type="datetime" placeholder="请选择活动时间" format="yyyy-MM-dd HH:mm"  :editable='false' v-model="ruleForm.activityTime"  style="width: 100%;"></el-date-picker>
                   </el-form-item>
                   
                    <el-form-item label="活动参与人" prop="addressData" v-if="formData.scopeLimit==2&&ruleForm.status==1">
                        <address-book v-model="ruleForm.addressData" :config="configData"></address-book>
                    </el-form-item> 
                    <el-form-item label="活动参与人" prop="addressData" v-if="formData.scopeLimit==2&&ruleForm.status==2">
                       <range-list :departJson="ruleForm.addressData.departJson" :groupJson="[]"
                                        :userJson="ruleForm.addressData.userJson"></range-list>
                    </el-form-item>                    
                    <el-form-item class="new-editor" label="活动内容" prop="content">
                        <br />
                        <ueditor style="width: 740px;position: relative;right: 70px;" class="rich-editor new-editor" ref="ueditor" :defaultMes="ruleForm.content"
                                 @editModel="richTextEditHandler">
                        </ueditor>
                    </el-form-item>
                     <el-form-item label="活动附件"  v-if="formData.isFile==1">
                        <uploader :extList="allFileTypeList" v-model="ruleForm.fileJson" :multiple="true" pathPrefix="fabuyingyong" module="fabuyingyong" :moduleCode="moduleCode"></uploader>
                    </el-form-item>
                     <el-form-item label="活动图片"  v-if="formData.isFile==1">
                        <uploader pathPrefix="fabuyingyong" module="fabuyingyong" :moduleCode="moduleCode" multiple v-model="ruleForm.photoJson"
                          :extList="['jpeg', 'jpg', 'bmp', 'gif', 'png']" showMode="image"
                          showResult="image"></uploader>
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
    import {addMsg, updateMsg, getMsg,getMsgInit} from '@/api/releaseTemplate';
    import ChoseCover from '@/components/ChoseCover';
    import mixin from '@/mixins/windowResize';
    import {mapGetters} from 'vuex';
    import RangeList from '@/components/RangeList/RangeList';
    export default {
        components: {
            Ueditor,
            AddressBook,
            Backtool,
            ChoseCover,
            Uploader,
            RangeList
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
            'ruleForm.content': {
                handler: function () {
                    this.$refs.ruleForm.validateField('content');
                },
                deep: true
            }
        },
        data() {
            const checkTitle = (rule, value, callback) => {
                if (value.trim().length === 0) {
                    return callback(new Error('活动主题不能为空！'));
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
                    return callback(new Error('活动参与人不能为空！'));
                }
            };
            return {
                loading: false,
                id: '',
                 formData: {
                    title:'',//	标题	
                    moduleCode:'',//	模块名称	number
                    scopeLimit:1,//	发布范围限制 1 默认 2 自主选择	number	
                    scopePh:2,//	发布家长 1有 2无	number	
                    scopeSch:2,//	发布全校 1有 2无	number	
                    scopeSt:2,//	发布学生 1有 2无	number	
                    scopeTh:2,//	发布老师 1有 2无	number
                    isTitle:1,//	标题 1 有 2无	number
                    isCover:1,//	封面 1 有 2无	number                    	
                    isContent:1,//	内容 1有 2无	number	
                    isAdress:2,//	地点 1 有 2无	number
                    isFile:2,//	附件材料 1 有 2无	number	
                    isReadCount:2,//	阅读量 1有 2无	number
                    isScope:1,//	发布范围 1 有 2无	number	
                    isTime:2,//	时间 1 有 2无	number	 
                    isReply:2,//	回复 1有 2无	number	
                    isReplyFile:2,//	回复附件 1有 2无	number	
                    isReplyText:2,//	回复文本 1 有 2无	number                        	
                },
                 configData: {
                        title: '活动参与人',
                        depart: {target: 'all', departType: 'all', userTypes: '1,2'},
                        group: false,
                        notCheckSchool: false
                },
                ruleForm: {   
                    addressData: {},
                    logoUrl: 'https://cdnfile-10043692.cos.ap-shanghai.myqcloud.com/admin/images/notice/notice-cover2.png',
                    activityTime:"",//	活动时间	string	
                    adress:"",//	地点	string	
                    content:"",//	内容	string	
                    createType:1,//	创建类型 1pc 2手机端	number	                    
                    fileJson:[],//	附件json	string	
                    moduleCode:"",//	模块code	number	
                    moduleName:"",//	模块名称	string	
                    scopeLimit:1,//	发布范围限制 1 默认 2 自主选择	number	
                    status:1,//	状态，1草稿，2已发布	number	
                    title:"",//	标题	string	
                    userJson:[],//	用户地址簿	string
                    departJson:[],//	部门地址簿	string
                    photoJson:[]	
                },
                rules: {
                    title: [
                        {required: true, validator: checkTitle, trigger: 'blur'}
                    ],
                    addressData: [
                        {required: true, validator: checkAddressData, trigger: 'blur'}
                    ],
                    logoUrl: [
                        {required: true, message: '请选择图片', trigger: 'blur'}
                    ],
                    adress: [
                        {required: true, message: '请输入地点', trigger: 'blur'}
                    ],
                    activityTime: [
                        {required: true, message: '请选择时间', trigger: 'blur'}
                    ],
                    content: [
                        {required: true, message: '内容不能为空', trigger: 'change'}
                    ]
                },
                sourceCover: [
                    'https://cdnfile-10043692.cos.ap-shanghai.myqcloud.com/admin/images/notice/notice-cover2.png',
                    'https://cdnfile-10043692.cos.ap-shanghai.myqcloud.com/admin/images/notice/notice-cover3.png',
                    'https://cdnfile-10043692.cos.ap-shanghai.myqcloud.com/admin/images/notice/notice-cover1.png',
                    'https://cdnfile-10043692.cos.ap-shanghai.myqcloud.com/admin/images/notice/notice-cover4.png',
                ],
                allFileTypeList: ['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'pdf', 'zip', 'rar'],
            };
        },
        mixins: [mixin],
        created() {
            let id = this.$route.query.id;
            let userid = this.$store.getters.userInfo.id;
            getMsgInit(this.$route.query.newmoduleCode)
                    .then(data => {
                        this.formData = data.data.data;
                        this.ruleForm.scopeLimit=this.formData.scopeLimit
                        this.ruleForm.moduleCode=this.formData.moduleCode
                        this.ruleForm.moduleName=this.formData.title 
                        if(this.formData.scopeSt==1&&this.formData.scopeTh==2){
                          this.configData.depart.userTypes='2'
                          this.configData.depart.departType='s'
                        }
                        if(this.formData.scopeSt==2&&this.formData.scopeTh==1){
                          this.configData.depart.userTypes='1'
                          this.configData.depart.departType='t'
                        }
                    })
            if (id) {//如果是编辑
                this.id = id;
                this.getMsg();
            }
        },
        methods: {
            noticeSave(status) {
                this.ruleForm.content = this.$refs.ueditor.getContent();
                this.$refs['ruleForm'].validate(valid => {
                    if (valid) {  
                                       
                        const query = {
                            activityTime:this.formData.isTime==1?moment(this.ruleForm.activityTime).format("YYYY-MM-DD HH:mm:ss"):"",//	活动时间	string	
                            adress:this.ruleForm.adress,//	地点	string	
                            content:this.ruleForm.content,//	内容	string	
                            createType:this.ruleForm.createType,//	创建类型 1pc 2手机端	number	                    
                            fileJson:this.ruleForm.fileJson,//	附件json	string	
                            moduleCode:this.ruleForm.moduleCode,//	模块code	number	
                            moduleName:this.ruleForm.moduleName,//	模块名称	string	
                            scopeLimit:this.ruleForm.scopeLimit,//	发布范围限制 1 默认 2 自主选择	number	
                            status:status,//	状态，1草稿，2已发布	number	
                            title:this.ruleForm.title,//	标题	string	
                            userJson:this.ruleForm.addressData.userJson,//	用户地址簿	string
                            departJson:this.ruleForm.addressData.departJson,//	部门地址簿	string
                            logoUrl:this.ruleForm.logoUrl,
                            photoJson:this.ruleForm.photoJson
                        };                       
                        if(!this.id){                            
                            addMsg(query).then(res => {
                                        this.$message({
                                            message: '新增成功！',
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
                        }else{
                            query.id=this.id
                             updateMsg(query).then(res => {
                                        this.$message({
                                            message: '编辑成功！',
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
                });
            },
            btnLoadState(state) {
                this.loading = state;
            },
            richTextEditHandler(content) {
                this.ruleForm.content = content;
            },
            getMsg() {
                getMsg(this.id).then(res => {
                    let data = res.data.data;
                    this.ruleForm.addressData = {
                        departJson: JSON.parse(data.departJson),
                        userJson: JSON.parse(data.userJson)
                    };
                    this.ruleForm.title = data.title;
                    this.ruleForm.logoUrl = data.logoUrl;
                    this.ruleForm.content = data.content;
                    this.$refs.ueditor.setContent(data.content);
                    this.ruleForm.activityTime = data.activityTime == null ? '' : data.activityTime;
                    this.ruleForm.createType = data.createType;
                    this.ruleForm.fileJson =  JSON.parse(data.fileJson);
                    this.ruleForm.moduleCode = data.moduleCode;
                    this.ruleForm.moduleName = data.moduleName;
                    this.ruleForm.scopeLimit = data.scopeLimit;
                    this.ruleForm.status = data.status;
                    this.ruleForm.adress = data.adress;
                    this.ruleForm.photoJson = JSON.parse(data.photoJson)
                }).catch();
            },
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
