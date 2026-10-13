<template>
    <div id="classCircle" class="classCircleDetails  calendar-list-container" >
        <div class="circle_top_wrap">
            <div class="circle_top clearfix">
              <span class="left_title">
                <span class="span-classname"> {{classname}}</span>
                <el-date-picker
                   size="medium"
                    v-model="daterange"
                    type="daterange" class="mywidthdaterange"
                    range-separator="-"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    @change="retrievaltime()"
                    :clearable="false"
                >
                </el-date-picker>
                 <el-button  type="primary" @click="tyleclick(0)" v-show="isshow" size="medium">全部类型</el-button>
                 <el-button type="primary"  @click="print()" size="medium">打印</el-button>
                <el-button class="filter-item" type="primary"  @click="loadAddClassCircle()" size="medium"  v-show="isCanAddCirrcle">发帖</el-button>
                </span>
            </div>
        </div>
        <!-- 圈子 -->
        <div class="Box"  id="boxDiv">
            <!-- 白色盒子 -->
            <div class="middle_content"  >
                <!-- 主体 -->
                <div class="inner_content" >
                    <!-- 主体头部 -->
                    <div class="top_content">
                        <img class="img" src="https://cdnfile-10043692.file.myqcloud.com/admin/images/campus_circle/circle.png">
                        <span>班级圈</span>
                         <div class="isMySend" @click="isDigestclicktwo()"  :class="{'color' : listQuery.isMySend==1}"><i class="fa fa-check-circle" aria-hidden="true"></i> 仅显示我的发帖</div>
                        <div class="isDigest" @click="isDigestclick()"  :class="{'color' : listQuery.isDigest==1}"><i class="fa fa-check-circle" aria-hidden="true"></i> 仅显示精华帖</div>
                    </div>
                    <div class="list">
                        <div class="noTime" v-if="contentList.length==0">
                            暂无数据
                        </div>
                        <div v-else>
                            <div class="classCircleDetailsInfo"  :key="indexs" v-for="(ergodic, indexs) in contentList">
                                <div class="el-icon-delete2">
                                    <i class="el-icon-circle-check" @click="approveClassCircles(1,ergodic.id)" v-if="ergodic.isApprove == 0" style="color:#409EFF"></i>
                                    <i class="el-icon-circle-close" @click="approveClassCircles(2,ergodic.id)" v-if="ergodic.isApprove == 0" style="color:#F56C6C"></i>
                                    <i class="fa fa-star-o" aria-hidden="true" style="color:#409EFF" v-if="((isisCanDigestCircles||Bresultone)&&(ergodic.isDigest==0))&&(ergodic.isApprove != 0)" @click="digestCircles(indexs,ergodic.id);" title="加精"></i>
                                    <i class="fa fa-trash-o ff deled" style="color:#F56C6C" v-show="(delshow||(ergodic.createUserId==userInfo.id))&&(ergodic.isApprove != 0)" title="删除" @click="delClassCircles(indexs,ergodic.id)"></i>
                                </div>
                                <div class="button" v-if="ergodic.optionId!=0"  @click="tyleclick(ergodic.optionId)">
                                    <el-button type="success" size="small">{{ergodic.optionName}}</el-button>
                                </div>
                                <!-- 发布人信息 -->
                                <div class="Publisher">
                                    <img class="img" :src='ergodic.createLogo'>
                                    <div class="header_name_time">
                                        <div class="header_name clearfix">
                                            <span class="name_icon">{{ergodic.createUser}}<img class="img-jing" v-if="ergodic.isDigest==1" src="https://cdnfile-10043692.file.myqcloud.com/mobile/images/Presentation/best_flag.gif" alt=""></span>
                                            <div class="header_time">{{ergodic.createDate|formatTimeFilter}}</div>
                                        </div>
                                    </div>
                                </div>
                                <!--内容展示框-->
                                <div class="Content">
                                    <image-previewer tag="richtext"> <div class="releaseDescription content-container" v-if="ergodic.description &&(ergodic.createType==1)" v-html="ergodic.description"></div></image-previewer>
                                    <div class="releaseContent content-container" v-if="(ergodic.createType==0)" v-html="ergodic.content"></div>
                                    <div class="picList" v-show="ergodic.circlePics && ergodic.circlePics.length > 0">
                                        <div class="imgs" v-if="ergodic.photoUrlArr && ergodic.photoUrlArr.length > 0">
                                            <image-previewer class="image-plate" :images="ergodic.photoUrlArr" tag="img" > </image-previewer>
                                        </div>
                                    </div>
                                    <div class="videoList" v-show="ergodic.circleVideo">
                                        <video v-if="ergodic.circleVideo!=null&&ergodic.circleVideo.videoUrl!=''" :src="ergodic.circleVideo.videoUrl" controls="controls" width="50%">
                                            您的浏览器不支持 video 标签。
                                        </video>
                                    </div>
                                     <div class="circleVoices" v-if="ergodic.circleVoices.length !== 0">
                                         <audio-recorder  :audios="ergodic.circleVoices"></audio-recorder>
                                     </div>

                                </div>
                                <!--分割线-->
                                <div class="partingLine">
                                    <el-row> <el-col class="leftLine" :span="16"></el-col><el-col class="rightLine" :span="8"></el-col></el-row>
                                </div>
                                <!--评论框-->
                                <el-form  :label-position="labelPosition"  v-show="(thComment==1) &&(ergodic.isApprove != 0)">
                                    <el-form-item >
                                        <el-input class="talkContent" type="textarea" resize="none" placeholder="请输入评论内容" :rows="4" :maxlength="300"  v-model.trim="ergodic.talkContent"></el-input>
                                    </el-form-item>
                                    <el-form-item>
                                        <el-button class="sendCommit" type="primary" @click="addComments(indexs)">发表评论</el-button>
                                    </el-form-item>
                                </el-form>
                                <!--评论展示-->
                                <div v-show="ergodic.isApprove != 0">
                                    <div>
                                        <el-row>
                                            <el-col :span="4">
                                                <span class="commitTitle">所有评论({{ergodic.circleCommentss.length}})</span>
                                            </el-col>
                                            <el-col :span="16" :title="ergodic.praisePeoples" class="peopleList" >
                                                <span class="praisePeople">{{ergodic.praisePeoples}}</span>
                                                <span class="praiseTip" v-show="ergodic.praisePeoples.length>0">等觉得很赞</span>
                                                <span class="praise">
                            <i class="fa fa-thumbs-up thumb-on thumb" @click="delClickPraise(indexs)" v-if="ergodic.displaythumb"></i>
                            <i class="fa fa-thumbs-o-up thumb-off thumb" @click="addClickPraise(indexs)" v-else></i>+<span class="thumb-count">{{ergodic.peoples.length}}</span>
                          </span>
                                            </el-col>
                                        </el-row>
                                    </div>
                                    <div>
                                        <el-row class="commentContent" :key="index" v-for="(comments,index) in ergodic.circleComments" @mouseover.native="mouseoverShow(index)" @mouseout.native="mouseoverHide(index)">
                                            <el-col :span="2" style="min-width:80px;">
                          <span class="headIcon">
                             <img :src="comments.commentLogo" alt="">
                          </span>
                                            </el-col>
                                            <el-col :span="20">
                                                <el-row>
                                                    <el-col :span="5" class="commentUserName">
                                                        {{comments.commentUser}}
                                                    </el-col>
                                                    <el-col :span="3" class="repeatOrDelete">
                              <span>
                                <i class="fa fa-trash-o ff deled" v-show="delshow==true&&mouseShow==index || comments.commentUserId==currId&&mouseShow==index" @click="delComments(comments.id,index,indexs)"></i>
                                <i class="fa fa-comment-o ff"  v-show="comments.commentUserId!=currId&&mouseShow==index" v-on:click="reply(2,comments.commentUserId,comments.commentUser,indexs)"  v-if="thComment==1"></i>
                              </span>
                                                    </el-col>
                                                    <el-col :span="16" class="commentTime">
                                                        <div class="commentTime">{{comments.commentTime|formatTimeFilter}}</div>
                                                    </el-col>
                                                </el-row>
                                                <el-row class="commentContentDetails">
                                                    <span class="repeat" v-if="comments.type==1">{{comments.commentContent}}</span>
                                                    <span class="repeat" v-else>回复&nbsp;{{comments.receiveUser}}:{{comments.commentContent}}</span>
                                                </el-row>
                                            </el-col>
                                        </el-row>
                                    </div>
                                    <div>
                                        <el-row v-show="ergodic.judge">
                                            <el-col :span="22" class="meComment moreComments"  @click.native="moreComments(indexs)" >
                                                <span>更多评论</span>
                                            </el-col>
                                        </el-row>
                                        <el-row  v-if="thComment==1">
                                            <el-col :span="12" class="meComment meCommentImg"  @click.native="focusTalkContent(indexs)" >
                                                <img  :src="require('@/assets/images/pinglun.png')" alt="" style="width:24px;height:24px;">
                                            </el-col>
                                            <el-col :span="12" class="meComment meCommentpen"  @click.native="focusTalkContent(indexs)" >
                                                <span>我要评论</span>
                                            </el-col>
                                        </el-row>
                                    </div>
                                </div>
                                <!--评论展示结束-->
                            </div>
                            <div class="foot">{{footName}}</div>
                        </div>

                    </div>
                </div>
            </div>
        </div>


        <!-- 打印 -->
        <div class="Box" style="display: none;">
            <!-- 白色盒子 -->
            <div class="middle_content"   ref="print">
                <!-- 主体 -->
                <div class="inner_content" >
                    <!-- 主体头部 -->
                    <div class="top_content">
                        <img class="img" src="https://cdnfile-10043692.file.myqcloud.com/admin/images/campus_circle/circle.png">
                        <span>班级圈</span>
                    </div>
                    <div class="list">
                        <div class="noTime" v-if="contentList.length==0">
                            暂无数据
                        </div>
                        <div v-else>
                            <div class="classCircleDetailsInfo"  :key="indexs" v-for="(ergodic, indexs) in contentList">
                                <div class="button" v-if="ergodic.optionId!=0"  @click="tyleclick(ergodic.optionId)">
                                    <el-button type="success" size="small">{{ergodic.optionName}}</el-button>
                                </div>
                                <!-- 发布人信息 -->
                                <div class="Publisher">
                                    <img class="img" :src='ergodic.createLogo'>
                                    <div class="header_name_time">
                                        <div class="header_name clearfix">
                                            <span class="name_icon">{{ergodic.createUser}}<img class="img-jing" v-if="ergodic.isDigest==1" src="https://cdnfile-10043692.file.myqcloud.com/mobile/images/Presentation/best_flag.gif" alt=""></span>
                                            <div class="header_time">{{ergodic.createDate|formatTimeFilter}}</div>
                                        </div>
                                    </div>
                                </div>
                                <!--内容展示框-->
                                <div class="Content">
                                    <image-previewer tag="richtext"> <div class="releaseDescription content-container" v-if="ergodic.description &&(ergodic.createType==1)" v-html="ergodic.description"></div></image-previewer>
                                    <div class="releaseContent content-container" v-if="(ergodic.createType==0)" v-html="ergodic.content"></div>
                                    <div class="picList" v-show="ergodic.circlePics && ergodic.circlePics.length > 0">
                                        <div class="imgs" v-if="ergodic.photoUrlArr && ergodic.photoUrlArr.length > 0">
                                            <image-previewer class="image-plate" :images="ergodic.photoUrlArr" tag="img" > </image-previewer>
                                        </div>
                                    </div>
                                    <div class="videoList" v-show="ergodic.circleVideo">
                                        <video v-if="ergodic.circleVideo!=null&&ergodic.circleVideo.videoUrl!=''" :src="ergodic.circleVideo.videoUrl" controls="controls" width="50%">
                                            您的浏览器不支持 video 标签。
                                        </video>
                                    </div>
                                </div>
                                <!--分割线-->
                                <div class="partingLine">
                                    <el-row> <el-col class="leftLine" :span="16"></el-col><el-col class="rightLine" :span="8"></el-col></el-row>
                                </div>
                                <!--评论展示-->
                                <div>
                                    <div>
                                        <el-row>
                                            <el-col :span="4">
                                                <span class="commitTitle">所有评论({{ergodic.circleCommentss.length}})</span>
                                            </el-col>
                                            <el-col :span="16" :title="ergodic.praisePeoples" class="peopleList" >
                                                <span class="praisePeople">{{ergodic.praisePeoples}}</span>
                                                <span class="praiseTip" v-show="ergodic.praisePeoples.length>0">等觉得很赞</span>
                                                <span class="praise">
                            <i class="fa fa-thumbs-up thumb-on thumb" @click="delClickPraise(indexs)" v-if="ergodic.displaythumb"></i>
                            <i class="fa fa-thumbs-o-up thumb-off thumb" @click="addClickPraise(indexs)" v-else></i>+<span class="thumb-count">{{ergodic.peoples.length}}</span>
                          </span>
                                            </el-col>
                                        </el-row>
                                    </div>
                                    <div>
                                        <el-row class="commentContent" :key="index" v-for="(comments,index) in ergodic.circleComments" @mouseover.native="mouseoverShow(index)" @mouseout.native="mouseoverHide(index)">
                                            <el-col :span="2" style="min-width:80px;">
                          <span class="headIcon">
                            <img :src="comments.commentLogo" alt="">
                          </span>
                                            </el-col>
                                            <el-col :span="20">
                                                <el-row>
                                                    <el-col :span="5" class="commentUserName">
                                                        {{comments.commentUser}}
                                                    </el-col>
                                                    <el-col :span="3" class="repeatOrDelete">
                              <span>
                                <i class="fa fa-trash-o ff deled" v-show="delshow==true&&mouseShow==index || comments.commentUserId==currId&&mouseShow==index" @click="delComments(comments.id,index,indexs)"></i>
                                <i class="fa fa-comment-o ff"  v-show="comments.commentUserId!=currId&&mouseShow==index" v-on:click="reply(2,comments.commentUserId,comments.commentUser,indexs)"></i>
                              </span>
                                                    </el-col>
                                                    <el-col :span="16" class="commentTime">
                                                        <div class="commentTime">{{comments.commentTime|formatTimeFilter}}</div>
                                                    </el-col>
                                                </el-row>
                                                <el-row class="commentContentDetails">
                                                    <span class="repeat" v-if="comments.type==1">{{comments.commentContent}}</span>
                                                    <span class="repeat" v-else>回复&nbsp;{{comments.receiveUser}}:{{comments.commentContent}}</span>
                                                </el-row>
                                            </el-col>
                                        </el-row>
                                    </div>

                                </div>
                                <!--评论展示结束-->
                            </div>
                            <div class="foot">{{footName}}</div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import BackTool from "@/components/BackTool";
    import {mapGetters} from 'vuex';
     import AudioRecorder from '@/components/AudioRecorder';
    import {
        getClassCircleInfo,isCanDigestCircle,
        addPraise,
        delPraise,
        addComment,
        delComment,
        getClassCircleList,
        delClassCircle,
        queryDepartById,isCanAddCirrcle,getClassCircleCommentSetInfo,possessRole,digestCircle,isManager,approveClassCircle
    } from "@/api/classCircle";
    import { formatTime, parseTime } from "@/utils";
    import { queryManager, queryRoleList } from "@/api/system";
    import mixin from "@/mixins/windowResize";
    import ImagePreviewer from "@/components/ImagePreviewer/ImagePreviewer.vue";
    import {getSchoolTimeAllList} from '@/api/classroomEvaluation';
    export default {
        name: "vue-scroll",
        computed: {
            ...mapGetters([
                'userInfo',
                'schoolInfo',
                'permission'
            ])
        },
        components: {
            ImagePreviewer,
            BackTool,
            AudioRecorder
        },
        data() {
            return {
                thComment:0,
                isCanAddCirrcle:false,//判断是否可创建
                isshow:false,//判断是否展示全部按钮
                listQuery: {
                    optionId:0,
                    classId: "",
                    pageNo: 1,
                    pageSize: 20,
                    searchTitle: "",
                    startTime:'',
                    endTime:'',
                    isDigest:0,
                    isMySend:0
                },
                endTime:'',
                startTime:'',
                pickerOptions: {
                    disabledDate(time) {
                        return time.getTime() > Date.now() - 8.64e6;
                    }
                },
                scollY: "", //底部距离
                pullRefreshss: true, //是否下拉刷新
                lastPage: "", //总页数
                footName:"",//提示
                labelPosition: "right",
                contentList:[], //渲染的数据
                classname: "", //班级
                delshow: false, //判断是否是班主任
                currId: null, //当前用户id
                currName: null, //当前用户姓名
                mouseShow: "ss", //是否显示删除或评论图标,如果直接定义为空进入页面后第一个会显示图标
                downLoadExamScoreAnalysisURL: '',
                classId:'',
                Bresult:false,
                Bresultone:false,
                isisCanDigestCircles:false,
                daterange: ['',''],
            };
        },
        created() {

            if(this.$route.query.paramJson){
                let paramJson = JSON.parse(this.$route.query.paramJson);
                // this.classname =paramJson.classname;
                this.listQuery.classId = paramJson.id;
                this.circleId = paramJson.id;
                this.classId = paramJson.id;
            }else{
                // this.classname =this.$route.query.classname;
                this.listQuery.classId = this.$route.query.id;
                this.circleId = this.$route.query.id;
                this.classId = this.$route.query.id;
            };
            this.currId = this.$store.getters.userInfo.id;
            this.currName = this.$store.getters.userInfo.name;
            //判断是不是班主任
			isManager(this.listQuery.classId,this.currId).then(res=>{
				this.Bresult= res.data.data.result;
			});
			//判断是不是班级圈管理员
			possessRole(this.currId).then(res=>{
				this.Bresultone= res.data.data.result;
			});
            //判断是否可评论
            getClassCircleCommentSetInfo().then(res=>{
                let data = res.data;
                this.thComment=data.data.thComment;
            });

            //学期列表
            getSchoolTimeAllList().then(res => res.data)
                .then(data => {
                    if (data.code === 200) {
                        data.data.forEach(item => {
                            if (item.isCurrent == 1) {
                                 if(item.startDate>(this.$moment(new Date()).format('YYYY-MM-DD')+"")){
                             this.daterange = [new Date(),item.startDate];
                            }else{
                              this.daterange = [item.startDate,new Date()];
                            }
                                this.getClassCircleInfoAndRefresh();
                            }
                        })
                    }
                })
            queryDepartById(this.circleId).then(res => {
                let data = res.data;
                if (data.code == 200) {
                    this.classname=data.data.name;
                }
            });
            queryRoleList(this.currId).then(res => {
                let data = res.data;
                if (data.code == 200) {
                    data.data.forEach((item, index) => {
                        if (item.constantId == 2 || item.constantId == 76 || item.constantId==9) {
                            this.delshow = true;
                        }
                    });
                }
            });
            if (!this.delshow) {
                this.queryManagerJudge();
            }
            isCanAddCirrcle(this.listQuery.classId).then(res=>{
                let data = res.data;
                this.isCanAddCirrcle=data.result;
            });
            this.isCanDigestCircles();
        },
        mixins: [mixin],
        // 时间
        filters: {
            formatTimeFilter(date) {
                return date.split(".")[0];
            }
        },
        mounted: function() {
            window.addEventListener("scroll", this.scrollChange, true);
        },
        methods: {
             approveClassCircles(num,id){
         this.$confirm("确认要"+(num==1?"审核通过":"审核不通过")+"吗？", num==1?"通过":"不通过", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        lockScroll: false
      })
        .then(() => {
          approveClassCircle(id,num).then(res => {
            if (res.data.code === 200) {
              this.$message.success("审批成功");
              this.retrievaltime();
            } else {
              this.$message.error(res.data.msg);
            }
          });
        })
        .catch(() => {});
    },
            //判断加精权限
            isCanDigestCircles(){
                   isCanDigestCircle(this.listQuery.classId).then(res => {
                    let data = res.data;
                    if(data.result){
                        this.isisCanDigestCircles=true
                    }
                });
            },
            //打印
            print() {
                this.$print(this.$refs.print)
            },
            mouseoverShow(index) {
                this.mouseShow = index;
            },
            mouseoverHide(index) {
                this.mouseShow = index + "ss";
            },
            queryManagerJudge() {
                //判断是否是班主任
                queryManager(this.classId).then(res => {
                    let data = res.data;
                    if (data.code == 200) {
                        if (data.data.id == this.currId) {
                            this.delshow = true;
                        } else {
                            this.delshow = false;
                        }
                    }
                });
            },
            //检索
            retrievaltime(){

                this.listQuery.pageNo= 1;
                this.listQuery.pageSize= 10;
                this.contentList=[];
                this. getClassCircleInfoAndRefresh();


            },
            isDigestclick(){
				if(this.listQuery.isDigest==0){
					this.listQuery.isDigest=1
				}else{
					this.listQuery.isDigest=0
                };
				this.listQuery.pageNo= 1;
                this.listQuery.pageSize= 10;
                this.contentList=[];
                this. getClassCircleInfoAndRefresh();

            },
             isDigestclicktwo(){
                if(this.listQuery.isMySend==0){
                    this.listQuery.isMySend=1
                }else{
                    this.listQuery.isMySend=0
                }
				this.listQuery.pageNo= 1;
                this.listQuery.pageSize= 10;
                this.contentList=[];
                this. getClassCircleInfoAndRefresh();

			},
            //点击
            tyleclick(num){
                this.listQuery.optionId=num;
                this.listQuery.pageNo=1;
                this.listQuery.pageSize=10;
                if(num!=0){
                    this.isshow=true;
                }else{
                    this.isshow=false;
                }
                this.getClassCircleInfoAndRefresh()

            },
            //获取数据
            getClassCircleInfoAndRefresh() {
                if(this.daterange[0]){
                   this.startTime = this.$moment(this.daterange[0]).format('YYYY-MM-DD'); //时间
                  this.endTime = this.$moment(this.daterange[1]).format('YYYY-MM-DD'); //时间
                }
                if(this.startTime){
                    this.listQuery.startTime=this.$moment(this.startTime).format('YYYY-MM-DD');
                }else{
                    this.listQuery.startTime='';
                };
                if(this.endTime){
                    this.listQuery.endTime=this.$moment(this.endTime).format('YYYY-MM-DD');
                }else{
                    this.listQuery.endTime='';
                };
                this.downLoadExamScoreAnalysisURL = global.BasePath + 'structure/classCircle/exportClassCircleToWord?classId=' + this.listQuery.classId + '&endTime=' + this.listQuery.endTime+ '&optionId=' + this.listQuery.optionId+ '&startTime=' + this.listQuery.startTime+'&isMySend='+this.listQuery.isMySend,'&isDigest='+this.listQuery.isDigest + '&token=' + this.$store.getters.token;
                getClassCircleList(this.listQuery).then(res => {
                    let data = res.data.data;
                    if (res.data.code == 200) {
                         data.dataList.forEach((item,index)=>{
                                if(item.circleVoices.length>0){
                                    let mystuTaskAudios =item.circleVoices.map(audioItem => audioItem.voiceUrl);
                                    item.circleVoices=mystuTaskAudios;
                                }
                            })
                        data.dataList.forEach((items, index) => {
                            //转换图片
                            if (items.circlePics != "" && items.circlePics.length > 0) {
                                items.photoUrlArr = items.circlePics.map(entry => ({
                                    src: entry.picUrl
                                }));
                            } else {
                                items.circlePics = [];
                            }
                            //点赞人字符串
                            items.displaythumb = false; //是否已经点赞
                            items.peoples = [];
                            items.circleFabulous.forEach((item, index) => {
                                items.peoples.push(item.fabulousUser);
                                if (item.fabulousUserId == this.currId) {
                                    items.displaythumb = true;
                                }
                            });
                            if (items.peoples.length != 0) {
                                items.praisePeoples = items.peoples.join(",");
                            } else {
                                items.praisePeoples = "";
                            }
                            //评论
                            items.talkContent = "";
                            items.type = 1;
                            items.commentUserId = "";
                            items.receiveUser = "";
                            items.judge = false;
                            items.circleCommentss = items.circleComments;
                            let arrlist = [];
                            if (items.circleComments.length > 5) {
                                for (let i = 0; i < 5; i++) {
                                    arrlist.push(items.circleComments[i]);
                                }
                                items.judge = true;
                                items.circleComments = arrlist;
                            }
                        });
                        this.lastPage = data.pagination.lastPage;

                        this.contentList = data.dataList;
                    }
                });
            },
            //加载发帖页面
            loadAddClassCircle() {
                this.$router.push({
                    path: "classCircleSend",
                    query: {
                        classId: this.classId
                    }
                });
            },
            //点赞
            addClickPraise(num) {
                let clickPraise = {};
                clickPraise.circleId = this.contentList[num].id;
                clickPraise.fabulousUser = this.currName;
                clickPraise.fabulousUserId = this.currId;
                clickPraise.likeType = 2;
                addPraise(clickPraise).then(res => {
                    let data = res.data;
                    if (data.code == 200) {
                        const obj = {
                            circleFabulous: [{fabulousUser: this.currName}, ...this.contentList[num].circleFabulous],
                            displaythumb: true,
                            praisePeoples: `${this.currName},${this.contentList[num].praisePeoples}`,
                            peoples: [0, ...this.contentList[num].peoples]
                        };
                        this.$set(this.contentList, num, Object.assign({}, this.contentList[num], obj));


                    }
                });
            },
            //取消点赞
            delClickPraise(num) {
                let deletePraise = {};
                deletePraise.circleId = this.contentList[num].id;
                deletePraise.fabulousUserId = this.currId;
                delPraise(deletePraise).then(res => {
                    let data = res.data;
                    if (data.code == 200) {
                        this.contentList[num].circleFabulous.splice(0, 1);
                        this.contentList[num].displaythumb = false; //是否已经点赞
                        this.contentList[num].peoples = [];
                        this.contentList[num].circleFabulous.forEach((item, index) => {
                            this.contentList[num].peoples.push(item.fabulousUser);
                        });
                        if (this.contentList[num].peoples.length != 0) {
                            this.contentList[num].praisePeoples = this.contentList[num].peoples.join(",");
                        } else {
                            this.contentList[num].praisePeoples = "";
                        };
                        let list=this.contentList;
                        this.contentList='';
                        this.contentList=list;
                    }
                });
            },
            //删除评论
            delComments(commentId, num, nums) {
                this.$confirm("是否确认要删除该条评论？", "删除", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                }).then(() => {
                    delComment(commentId).then(res => {
                        let data = res.data;
                        if (data.code == 200) {
                            this.contentList[nums].circleComments.splice(num, 1);
                            this.contentList[nums].circleCommentss.splice(num, 1);
                        }
                    });
                });
            },

            //新增评论
            addComments(num) {
                let CommentValue = {};
                CommentValue.circleId = this.contentList[num].id;
                CommentValue.commentContent = this.contentList[num].talkContent;
                CommentValue.commentUser = this.currName;
                CommentValue.commentUserId = this.currId;
                if (this.contentList[num].type == 2) {
                    CommentValue.type = 2;
                    CommentValue.receiveUser = this.contentList[num].receiveUser;
                    CommentValue.receiveUserId = this.contentList[num].commentUserId;
                } else {
                    CommentValue.type = 1;
                    CommentValue.receiveUser = "";
                    CommentValue.receiveUserId = 0;
                }
                if (!CommentValue.commentContent) {
                    this.$message({
                        type: "warning",
                        message: "评论或回复不能为空!"
                    });
                    return;
                }
                if(!CommentValue.commentUserId){
                 this.$vux.toast.show({
						text: "登录超时请从新登录",
						type:'warn'
					});
					return;
				};
                addComment(CommentValue).then(res => {
                    let data = res.data;
                    if (data.code == 200) {
                        this.contentList[num].talkContent = "";
                        this.contentList[num].type = 1;
                        this.commentUserId = 0;
                        this.receiveUser = "";
                        let talkContent = document.getElementsByClassName("talkContent")[num].getElementsByTagName("textarea")[0];
                        talkContent.setAttribute("placeholder", "请输入评论内容");
                        talkContent.value = "";
                        this.contentList[num].circleCommentss.push(data.data);
                        this.contentList[num].circleComments = this.contentList[num].circleCommentss;
                        this.contentList[num].judge = false;
                    }
                });
            },

            //评论
            focusTalkContent(num) {
                //聚焦评论框
                let talkContent = document.getElementsByClassName("talkContent")[num].getElementsByTagName("textarea")[0];
                talkContent.setAttribute("placeholder", "请输入评论内容");
                talkContent.focus();
            },

            //回复
            reply(type, id, name, num) {
                this.contentList[num].type = type;
                this.contentList[num].commentUserId = id;
                this.contentList[num].receiveUser = name;
                let talkContent = document.getElementsByClassName("talkContent")[num].getElementsByTagName("textarea")[0];
                talkContent.setAttribute("placeholder",( "回复 " + name + ":"));
                talkContent.focus();
            },
            //更多评论
            moreComments(num) {
                this.contentList[num].circleComments = this.contentList[num].circleCommentss;
                this.contentList[num].judge = false;
            },
            //删除班级圈
            delClassCircles(num, id) {
                this.$confirm("是否确认要删除该条班级圈？", "删除", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                }).then(() => {
                    delClassCircle(id).then(res => {
                        let data = res.data;
                        if (data.code == 200) {
                            this.contentList.splice(num, 1);
                            this.$message({
                                type: "success",
                                message: "删除成功!"
                            });
                        }
                    });
                });
            },
            //加精
			digestCircles(num,classCircleId){
                 this.$confirm("是否确认要加精该条班级圈？", "加精", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                }).then(() => {
                    digestCircle(classCircleId).then(res => {
                        let data = res.data;
                        if (data.code == 200) {
                            this.contentList[num].isDigest=1;
                            this.$message({
                                type: "success",
                                message: "加精成功!"
                            });
                        }
                    });
                });

			},
            //缓加载下拉加载ajax
            scrollChange: function() {
                let _this = this;
                // 加页码数
                let clientHeight = document.documentElement.clientHeight || document.body.clientHeight; // 设备/屏幕高度
                let scrollObj = document.getElementById("boxDiv"); // 滚动区域
                let scrollTops = scrollObj.scrollTop; // div 到头部的距离
                let scrollHeight = scrollObj.scrollHeight; // 滚动条的总高度
                this.scollY = scrollTops+clientHeight - scrollHeight;
                // 把下拉刷新置为false，防止多次请求
                if (this.scollY >= 0) {
                    if (this.listQuery.pageNo>(this.lastPage-1)) {
                        this.footName='已加载全部';
                        return false;
                    };
                    if (!this.pullRefreshss) {
                        return false;
                    };
                    this.footName='正在加载';
                    this.listQuery.pageNo++;
                    this.pullRefreshss=false;
                    if(this.startTime){
                        this.listQuery.startTime=this.$moment(this.startTime).format('YYYY-MM-DD');
                    }else{
                        this.listQuery.startTime='';
                    };
                    if(this.endTime){
                        this.listQuery.endTime=this.$moment(this.endTime).format('YYYY-MM-DD');
                    }else{
                        this.listQuery.endTime='';
                    };
                    getClassCircleList(this.listQuery).then(res => {
                        let data = res.data.data;
                        if (res.data.code == 200) {
                             data.dataList.forEach((item,index)=>{
                                if(item.circleVoices.length>0){
                                    let mystuTaskAudios =item.circleVoices.map(audioItem => audioItem.voiceUrl);
                                    item.circleVoices=mystuTaskAudios;
                                }
                            })
                            let contentList = data.dataList;
                            contentList.forEach((items, index) => {
                                //转换图片
                                if (items.circlePics != "" && items.circlePics.length > 0) {
                                    items.photoUrlArr = items.circlePics.map(entry => ({
                                        src: entry.picUrl
                                    }));
                                } else {
                                    items.circlePics = [];
                                }
                                //点赞人字符串
                                items.displaythumb = false; //是否已经点赞
                                items.peoples = [];
                                items.circleFabulous.forEach((item, index) => {
                                    items.peoples.push(item.fabulousUser);
                                    if (item.fabulousUserId == this.currId) {
                                        items.displaythumb = true;
                                    }
                                });
                                if (items.peoples.length != 0) {
                                    items.praisePeoples = items.peoples.join(",");
                                } else {
                                    items.praisePeoples = "";
                                }
                                //评论
                                items.talkContent = "";
                                items.type = 1;
                                items.commentUserId = "";
                                items.receiveUser = "";
                                items.judge = false;
                                items.circleCommentss = items.circleComments;
                                let arrlist = [];
                                if (items.circleComments.length > 5) {
                                    for (let i = 0; i < 5; i++) {
                                        arrlist.push(items.circleComments[i]);
                                    }
                                    items.judge = true;
                                    items.circleComments = arrlist;
                                }
                            });
                            for(let i=0;i<contentList.length;i++){
                                this.contentList.push(contentList[i]);
                            }
                            this.footName=' ';
                        }
                    });
                } else {
                    // 其他时候把下拉刷新置为true
                    _this.pullRefreshss = true;
                }
            }
        },
        beforeDestroy: function () {
            window.removeEventListener('scroll', this.scrollChange,true);   //  离开页面清除（移除）滚轮滚动事件
        }
    };
</script>
<style>
 .classCircleDetails img{
    max-width: 100%;
}
</style>

<style scoped>

    .classCircleDetails .left_title .el-date-editor.el-input {
        width: 135px;
    }
    .circleVoices{
        height: 80px;
    }
   .classCircleDetails .el-button--medium{
            padding: 10px 15px;
    }
</style>

<style scoped lang="scss">
    @import "../../styles/mixin.scss";
    .button{
        float:right;
        margin-right: 30px;
        margin-top: 7px;

    }
    .img-jing{
        width: 26px;
    margin-left: 10px;
    }
    .classCircleDetails .el-button+.el-button {
        margin-left: 0px;
    }
    .classCircleDetails {
        position: fixed;
        top: 0;
        left: 0;
        z-index: 10;
        height: 100%;
        width: 100%;

    }
    .foot{
        text-align: center;
        padding-top: 10px;
        color: #666;
    }
    .noTime {
        text-align: center;
        color: #666;
        font-weight: 600;
        font-size: 30px;
        line-height: 200px;
    }
    .el-icon-delete2 {
        float: right;
        font-size: 28px;
        margin: 10px;
        color: #ccc;
    }
    .el-icon-delete2 i:hover {
        color: #20a0ff;
    }
    .Publisher {
        padding: 12px 15px 8px;
        overflow: hidden;
    }
    .header_name_time {
        float: left;
        margin-left: 12px;
        line-height: 32px;
        color: #333;
        font-size: 21px;

    }
    .name_icon {
        float: left;
        width: 100%;
    }
    .header_time {
        color: #999;
        font-size: 17px;
    }
    .Publisher .img {
        width: 80px;
        height: 80px;
        float: left;
        border: 2px solid #ccc;
        border-radius: 50%;
    }
    .top_content {
        height: 70px;
        line-height: 70px;
        padding-left: 5px;
        font-size: 25px;
        border-bottom: 2px solid #e8e8e8;
        position: relative;
    }
    .top_content .isDigest{
		position: absolute;
	    bottom:10px;
		right:15px;
		color:#666;
		font-size: 16px;
	}
     .top_content .isMySend	{
		position: absolute;
	    bottom:10px;
		right:200px;
		color:#666;
		font-size: 16px;
	}
	 .top_content .isDigest i{
		color:#ccc;
		font-size: 20px;
	}
	 .top_content .isDigest.color i{
		color:#04BE02
	}
     .top_content .isMySend i{
		color:#ccc;
		font-size: 20px;
	}
	 .top_content .isMySend.color i{
		color:#04BE02
	}
    .top_content .img {
        float: left;
        width: 38px;
        height: 38px;
        margin: 16px 25px;
    }
    .top_content span {
        float: left;
    }
    .middle_content {
        width: 865px;
        min-height: 646px;
        margin: 0 auto;
        background: rgba(255, 255, 255, 0.35);
        overflow: hidden;
    }
    .circle_top_wrap {
        width: 100%;
        height: 54px;
        position: fixed;
        top: 0px;
        left: 0;
        color: #fff;
        background: #303030;
        background: linear-gradient(#212121, #414141);
        z-index: 0;
    }
    .left_title {
        height:54px;
        line-height: 54px;
        font-size: 16px;
        width: 865px;
        display: block;
        margin: 0 auto;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        position: relative;
    }
    .span-classname {
        display: inline-block;
        width: 275px;
        font-size: 18px;
    }
    .Box {
        width: 100%;
        margin: 54px auto 0;
        background-image: url(https://cdnfile-10043692.file.myqcloud.com/admin/images/class/class_ring.jpg);
        background-size: 100% 100%;
        background-repeat: no-repeat;
        overflow-x: hidden;
        overflow-y: auto;
        height: 95%;
    }
    .inner_content {
        width: 833px;
        margin: 20px auto 44px;
        padding: 10px 10px 100px 10px;
        border: 1px solid rgba(0, 0, 0, 0.4);
        background: #fff;
        border-radius: 10px;
    }
    .fa {
        cursor: pointer;
    }
    .leftLine {
        height: 10px;
        background-color: #bbf6ce;
    }
    .rightLine {
        height: 10px;
        background-color: #ffb8b5;
    }
    .classCircleDetailsInfo {
        background: #fff;
        border-bottom: 2px dashed #ccc;
        padding-bottom: 30px;
        padding-top: 10px;
    }
    .classCircleDetailsInfo a {
        color: #3399ff;
    }
    .Content {
        /*主体内容展示设置*/
        min-height: 350px;
        padding: 0 20px 12px 112px;
    }
    .sendCommit {
        /*发送评论*/
        float: right;
    }
    .commitTitle {
        color: #787878;
        /*padding: 5px 24px;
                border-bottom: 3px solid #E36209;*/
    }
    .peopleList {
        /*点赞人title*/
        /*text-align:right;*/
        color: #00ccff;
    }
    .praisePeople {
        /*点赞人列表*/
        max-width: 70%;
        text-align: right;
        display: block;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        float: left;
    }
    .praiseTip {
        float: left;
    }
    .praise {
        /*点赞按钮位置*/
        margin-left: 15px;
        line-height: 21px;
    }
    .clickPraise {
        /*点赞按钮块设置*/
        float: right;
    }
    .thumb {
        /*手势颜色*/
        color: #e4370e;
    }
    .headIcon {
        /*评论头像*/
        display: block;
        width: 60px;
        height: 60px;
        border-radius: 50%;
        background: no-repeat center center / cover;
    }
    .headIcon img{
        width: 60px;
        height: 60px;
        border-radius: 50%;
    }
    .commentContent {
        /*评论内容*/
        border-top: 1px solid #e5e5e5;
        margin-top: 7px;
        padding: 10px;
        min-height: 75px;
    }
    .commentTime {
        /*评论时间*/
        font-size: 12px;
        color: #787878;
        float: right;
    }
    .commentUserName {
        /*评论人姓名设置*/
        color: #4873a9;
    }
    .commentTime {
        text-align: right;
    }
    .repeatOrDelete {
        /*评论或删除*/
        color: #787878;
    }
    .commentContentDetails {
        color: #787878;
        margin: 10px 0;
    }
    .meCommentImg {
        text-align: right;
    }
    .meComment {
        cursor: pointer;
        height: 24px;
        line-height: 24px;
        margin-top: 20px;
    }
    .meCommentpen > span {
        text-align: left;
        color: #787878;
    }
    .moreComments > span {
        margin-bottom: 20px;
        float: right;
        color: #04be02;
    }
    .talkContent {
        /*评论框位置*/
        margin-top: 20px;
    }
    .repeat {
        display: inline-block;
        width: 100%;
        word-wrap: break-word;
        overflow-wrap: break-word;
    }
    .Content ol li {
        list-style-type: decimal;
        margin-left: 40px;
    }
    .Content ul li {
        list-style-type: disc;
    }
    .Content table tr td {
        border: 1px solid #000 !important;
    }
    .Content table.noBorderTable td,
    table.noBorderTable th,
    table.noBorderTable caption {
        border: 1px dashed #ddd !important;
    }
    .Content table {
        margin-bottom: 10px;
        border-collapse: collapse;
        display: table;
    }
    td,
    th {
        padding: 5px 10px;
        border: 1px solid #ddd;
    }
    .Content img {
        max-width: 100%;
    }
    .deled {
        margin-right: 10px;
        margin-top: 2px;
    }
    ::-webkit-scrollbar {
        width: 6px;
        background-color: #f5f5f5;
    }
    ::-webkit-scrollbar-thumb {
        background-color: #999;
    }
    ::-webkit-scrollbar-track {
        background-color: #f5f5f5;
    }
</style>
<style scoped>
     .Content img {
        max-width: 100%;
    }
</style>
