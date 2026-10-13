<!--通知的详情-->
<template>
<div>
	<div v-if="isDelete==1" class="app-container calendar-list-container">
		<backtool>
            <el-button size="medium" v-if="isShow === 0" type="primary" @click="publish">发布</el-button>
        </backtool>
        <div :class="['page-main', isStandalone ? 'page-main--scroller' : '']">
            <div class="body" :style="`height: ${nobottommaxH}px;`">
                <div :class="['ibox', 'article']" style="width: 810px;padding-top:20px;margin: 0 auto;">
                <div class="ibox-content" style="border-top-width: 0;">
                    <div class="text-center article-title">
                        <h1>{{title}} </h1>
                        <div class="pull-right">
                            {{(updateUser === null||updateUser ==="" )? createUser : updateUser}}
                            <span v-if="isShow==1">
                                <span v-if="timed==1">
                                    <span v-if="$moment(new Date()).format('YYYY-MM-DD HH:mm:ss')>$moment(timeDate).format('YYYY-MM-DD HH:mm:ss')">
                                        {{publishDate| timeFilter}}
                                    </span>
                                    <span v-else>
                                        {{createDate| timeFilter}}
                                    </span>
                                </span>
                                <span v-if="timed==0">
                                    {{publishDate| timeFilter}}
                                </span>
                            </span>
                            <span v-if="isShow==0">
                                {{createDate| timeFilter}}
                            </span>
                        </div>
                        <div class="clear"></div>
                    </div>
                    <el-row>
                        <el-col :span="8">
                            <el-form>
                                <el-form-item label="类型：">
                                    {{recipeType|statusFilter}}
                                </el-form-item>
                            </el-form>
                        </el-col>
                        <el-col :span="8">
                            <el-form>
                                <el-form-item label="已读人数：">
                                    {{count}}
                                </el-form-item>
                            </el-form>
                        </el-col>
                        <el-col :span="8">
                            <el-form v-if="timeDate">
                                <el-form-item label="定时发送时间：">
                                    {{timeDate}}
                                </el-form-item>
                            </el-form>
                        </el-col>
                    </el-row>
                    <image-previewer v-if="isPc" tag="richtext">
                        <div class="notice-content" v-html="content">
                        </div>
                    </image-previewer>
                    <div v-else>
                        <div class="row">
                            <div class="col-lg-12">
                                <h2>图片：</h2>
                                <image-previewer tag="richtext">
                                    <div class="social-feed-box">
                                        <div class="file-list" v-if="attachList && attachList.length !== 0">
                                            <img class="image_view" style="width: 300px;height: 200px;margin-right: 10px;" v-for="item in attachList" :key="item" :src="item.attachUrl" />
                                        </div>
                                        <div v-else>
                                            <span>无</span>
                                        </div>
                                    </div>
                                </image-previewer>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-lg-12">
                                <h2>备注：</h2>
                                <div class="social-feed-box">
                                    <div class="file-list">
                                        <div v-if="content" class="notice-content" v-html="content"></div>
                                        <div v-else>无</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            </div>
        </div>

	</div>
	<default-page Mes="该食谱通知已被删除！" v-if="isDelete!==1&&showFalse"></default-page>
</div>
</template>
<script>
	import {strToHtml} from '@/utils';
    import ImagePreviewer from '@/components/ImagePreviewer/ImagePreviewer.vue';
    import DefaultPage from "@/components/DefaultPage";
    import { recipeDetails, updateOrPublishRecipe } from '@/api/recipe';
    import {mapGetters} from 'vuex';
    import mixin from "@/mixins/windowResize";
	const recipeTypeMap = {
		1: "公共",
		2: "教师",
		3: "学生"
	};
	export default {
        components: {
            ImagePreviewer,
            DefaultPage
        },
		data() {
			return {
                title: '',
				createUser: '',
                createDate: '',
				updateUser: '',
				updateDate: '',
                recipeType: 1,
				count: 0,
				content: '',
                attachList: [],
                isPc: 1,
                isDelete: 0,
                isShow: 1,
                recipeWeek: null,
                weekMonday: '',
                weekSunday: '',
                timed:'0',
                timeDate:'',
                showFalse:false,
                publishDate:""
			}
        },
        mixins: [mixin],
		filters: {
			statusFilter(type) {
				return recipeTypeMap[type]
			},
            timeFilter(time) {
			    return time?time.slice(0,19):'';
            }
		},
		created() {
            const vm = this;
            recipeDetails({
                recipeId: this.$route.query.recipeId,
                submitRead: 0
            })
                .then(({data}) => {
                    if(data.result) {
                        this.showFalse=true;
                        this.isDelete=data.data.isDelete;
                        this.timed = data.data.timed;
                        this.title = data.data.title;
                        this.id = data.data.id;
                        this.recipeType = data.data.recipeType;
                        this.content = strToHtml(data.data.content);
                        this.count = data.data.count;
                        this.createUser = data.data.createUser;
                        this.createDate = data.data.createDate;
                        this.updateUser = data.data.updateUser;
                        this.publishDate=data.data.publishDate;
                        this.updateDate = data.data.updateDate;
                        this.isPc = data.data.isPc;
                        this.attachList = data.data.attachList;
                        this.isShow = data.data.isShow;
                        this.recipeWeek = data.data.recipeWeek;
                        this.weekMonday = data.data.weekMonday;
                        this.weekSunday = data.data.weekSunday; 
                        if(data.data.timed==1){
                          this.timeDate=data.data.timeDate.slice(0,19);
                        };
                    }
                })
                .catch(function () {
                    this.showFalse=true;
                });
		},
        computed: {
            ...mapGetters(['isStandalone'])
        },
        methods: {
            publish() {
                if(this.timed==1){
                    if(!(new Date().getTime()<new Date(this.timeDate).getTime())){
                        this.$message({type: 'warning',message: '发送时间要大于当前时间,请编辑再发布！'});
                        return
                    }
                };                  
                updateOrPublishRecipe({
                    attachListJson: JSON.stringify(this.attachList),
                    content: this.content,
                    id: this.id,
                    isPc: this.isPc,
                    isShow: 1,
                    recipeType: this.recipeType,
                    recipeWeek: this.recipeWeek,
                    title: this.title,
                    timed:this.timed,
                    timeDate:this.timeDate
                })
                    .then(res => res.data)
                    .then(data => {
                        if(data.result) {
                            this.$message({
                                message: '发布成功！',
                                type: 'success',
                                duration: 1000,
                                onClose: () => {
                                    this.$router.back();
                                }
                            })
                        }
                    })
            }
        }
	}
</script>
<style lang="scss">
	@import "../../styles/mixin";
	.article {
		@include richtext();
		font-family: "宋体",serif !important;
		width: 80%;
		margin: 0 auto;
		font-size: 15px;
		line-height: 26px;
		color: #676A6C;
		word-wrap: break-word;
		word-break: break-all;
	}
	
	.article h1 {
		font-size: 28px;
        color: #303133;
        text-align: center;
	}
      .body{
        overflow: auto;
    }
	
	.article h2 {
		font-size: 16px;
        color: #303133;
        text-align: center;
	}
	
	.article hr {
		height: 1px;
		border: 0;
		border-top: 1px solid #d0d0d0;
	}
	
	.article p {
		font-size: 15px;
		line-height: 26px;
		color: #676A6C;
		word-wrap: break-word;
		word-break: break-all;
	}
	
	.pull-right {
		float: right;
		font-size: 13px;
		color: #676A6C
	}
	
	.hasread-small {
		border: 1px solid #e7eaec;
		padding: 2px 4px 2px 2px;
		border-radius: 2px;
		display: inline-block;
	}
	
	.notice-content {
		min-height: 250px;
	}
	
	.clear {
		clear: both;
	}
	
	.file-list,
	.range-list {
		margin: 10px;
	}
	
	.article .social-feed-box:last-child {
		margin-bottom: 0;
		border-bottom: 1px solid rgb(231, 234, 236);
	}
	
	.range-item {
		height: 30px;
		display: block;
		float: left;
		border: 1px solid #e7eaec;
		margin-left: 4px;
		margin-top: 4px;
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
		color: #676A6C;
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
	
	.image {
		max-width: 50% !important;
	}
	
	.video {
		max-width: 50% !important;
	}
</style>
