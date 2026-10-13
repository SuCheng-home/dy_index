<!--通知的详情-->
<template>
    <div class="app-container calendar-list-container">
        <div class="menu-tools">
            <el-button @click="$router.back()" size="medium">返回</el-button>
           <!-- <el-button type="primary" @click="releaseTemplateadd()" size="medium">编辑</el-button> -->
        </div>
        <div :class="['page-main', isStandalone ? 'page-main--scroller' : '']">
            <div class="article-container">
                <div class="title">{{ruleForm.title}}</div>
                <div class="sub-title">
                    {{ruleForm.pushTime}}
                    <span class="departName" v-if="ruleForm.adress">{{ruleForm.adress}}</span>
                </div>
                <hr>
                <div>
                    <div class="content">
                        <image-previewer tag="richtext">
                            <div class="notice-content" 
                                 v-html="ruleForm.content"></div>
                        </image-previewer>
                    </div>

                    <hr>
                    <!-- <div class="row" v-if="ruleForm.departJson.length||ruleForm.userJson.length">
                        <div class="col-lg-12">
                            <div class="section-title">
                                发布范围
                            </div>
                            <range-list :departJson="ruleForm.departJson" :groupJson="[]"
                                        :userJson="ruleForm.userJson"></range-list>
                        </div>
                    </div> -->
                    <div class="row" v-if="ruleForm.photoJson && ruleForm.photoJson.length !== 0">
                        <div class="col-lg-12">
                            <div class="section-title">
                                图片
                            </div>
                            <image-previewer tag="richtext"  viewclass="pic-item">
                                <div class="pic-container" >
                                    <img  class="imgcontainer" v-for="(items,indexs) in ruleForm.photoJson" :key="indexs" :src="items.fileUrl"/>
                                </div>
                            </image-previewer>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-lg-12" v-if="ruleForm.fileJson && ruleForm.fileJson.length !== 0">
                            <div class="section-title">
                                附件
                            </div>
                            <file-list :isShowTitle="false" :fileList="ruleForm.fileJson"></file-list>
                        </div>
                    </div>
                    <div class="info-container" v-if="ruleForm.status==2" >
                        <div class="col-lg-12">
                            <div>
                            <span  v-if="isReadCount==1">
                                <span>已读人数：{{ ruleForm.readCount }}</span>
                            </span>  &nbsp;&nbsp;                          
                                <span class="list-link--finish" v-if="isReply==1" @click="releaseTemplatereply()">
                                   <span> 回复：{{ ruleForm.replyCount }}</span>
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
    import {getMsg,getMsgInit} from '@/api/releaseTemplate';
    import ImagePreviewer from '@/components/ImagePreviewer/ImagePreviewer.vue';
    import {mapGetters} from 'vuex';
    import mixin from '@/mixins/windowResize';
    export default {
        components: {
            RangeList,
            FileList,
            ImagePreviewer,
        },
        computed: {
            ...mapGetters(['isStandalone', 'userInfo'])
        },
        data() {
            return {
                ruleForm: {   
                    addressData: {},
                    logoUrl: 'https://cdnfile-10043692.cos.ap-shanghai.myqcloud.com/admin/images/notice/notice-cover1.png',
                    pushTime:"",//	活动时间	string	
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
                    photoJson:[],
                    readCount:0,
                    replyCount:0
                },
                isReadCount:2,//
                isReply:2,//
                isReplyFile:2,//
                isReplyText:2,//
            }
        },
       
        mixins: [mixin],
        filters: {
            trimTime(datetime) {
                return datetime ? datetime.slice(0, datetime.lastIndexOf('.')) : '--';
            }
        },
        created() {
            getMsgInit(this.$route.query.newmoduleCode)
                    .then(data => {
                        this.isReadCount=data.data.data.isReadCount
                        this.isReply=data.data.data.isReply
                        this.isReplyFile=data.data.data.isReplyFile
                        this.isReplyText=data.data.data.isReplyText
                    })
            getMsg(this.$route.query.id).then(res => {
                    let data = res.data.data;
                    this.ruleForm.addressData = {
                        departJson: JSON.parse(data.departJson),
                        userJson: JSON.parse(data.userJson)
                    };
                    this.ruleForm.readCount = data.readCount;
                    this.ruleForm.replyCount = data.replyCount;
                    this.ruleForm.title = data.title;
                    this.ruleForm.logoUrl = data.logoUrl;
                    this.ruleForm.content = data.content;
                    this.ruleForm.pushTime = data.pushTime == null ? '' : data.pushTime.slice(0,16);
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
        methods: {
           releaseTemplateadd() {
                this.$router.push({
                    path: "releaseTemplateadd",
                    query:this.$route.query
                });
            },
            releaseTemplatereply() {
                this.$router.push({
                    path: "releaseTemplatereply",
                    query:this.$route.query
                });
            },
        }
    }
</script>
<style lang="scss">
    @import "../../../src/styles/mixin.scss";
    .imgcontainer{
        float:left;
        width:80px;
        height:80px;
        margin:5px;
    }
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
