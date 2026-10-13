<!--添加通知-->
<template>
	<div class="app-container calendar-list-container" id="matchActivityDetail">
		<backtool>
			<el-button type="primary" size="medium" @click="submitHandler()">下一步</el-button>
		</backtool>
		<div :class="['page-main']" :style="{ height: nobottommaxH + 'px' }" style="overflow: auto">
			<div style="width: 810px;padding-top:20px;margin: 0 auto;">
				<div class="step-container">
					<el-steps :active="active" align-center>
						<el-step title="基础设置"></el-step>
						<el-step title="公开奖项设置" status="wait"></el-step>
					</el-steps>
				</div>
				<el-form :model="ruleForm" ref="ruleForm" label-width="210px" class="demo-ruleForm">
					<el-form-item label="活动标题" prop="title">
						{{ ruleForm.title }}
					</el-form-item>
					<el-form-item label="活动类别">
						{{ ruleForm.activityName }}
					</el-form-item>
					<el-form-item label="对象范围" prop="scopeJson">
						<range-list plain :departJson="ruleForm.scopeJson.departJson" :userJson="ruleForm.scopeJson.userJson"></range-list>
					</el-form-item>
					<el-form-item label="活动封面" prop="activityLogo">
						<image-previewer tag="richtext" viewclass="image_view" :images="pics">
							<ul>
								<li class="pic image_view" v-for="(picItem, index) in pics" :style="`background-image: url(${picItem.src})`" :key="index"></li>
							</ul>
						</image-previewer>
					</el-form-item>
					<el-form-item label="上报作品形式" prop="workType">
						{{ ['', '图片', '视频'][ruleForm.workType] }}
					</el-form-item>
					<el-form-item label="作品上报时间" prop="duration">{{ ruleForm.startReport | trimTimeMinute }} 至 {{ ruleForm.endReport | trimTimeMinute }}</el-form-item>
					<el-form-item label="作品上报数量限制" prop="reportNum">
						{{ ruleForm.reportNum }}
					</el-form-item>
					<el-form-item label="作品是否评比" prop="isCompare">
						{{ ruleForm.isCompare == 1 ? '是' : '否' }}
					</el-form-item>
					<el-form-item class="new-editor" label="活动说明" prop="remark">
						<image-previewer tag="richtext">
							<div class="content-container">
								<div class="content" v-html="ruleForm.remark"></div>
							</div>
						</image-previewer>
					</el-form-item>
					<el-form-item label="活动附件" v-if="files && files.length !== 0">
						<file-list plain :isShowTitle="false" :fileList="files"></file-list>
					</el-form-item>
				</el-form>
			</div>
		</div>
	</div>
</template>

<script>
import RangeList from '@/components/RangeList/RangeList'
import FileList from '@/components/FileList/FileList'
import Backtool from '@/components/BackTool'
import ImagePreviewer from '@/components/ImagePreviewer/ImagePreviewer'
import mixin from '@/mixins/windowResize'

import { getWonderfulActivityInfoById } from '@/api/matchActivity'

import { mapGetters } from 'vuex'

export default {
	components: {
		Backtool,
		ImagePreviewer,
		RangeList,
		FileList
	},
	computed: {
		...mapGetters(['userInfo'])
	},
	data() {
		return {
			id: this.$route.query.id,
			active: 1,
			pics: [],
			files: [],
			ruleForm: {
				title: '',
				activityCode: '',
				scopeJson: {},
				workType: 1,
				duration: [],
				reportNum: 0,
				isCompare: 1,
				remark: ''
			},
			typeList: []
		}
	},
	filters: {
		trimTimeMinute(datetime) {
			return datetime ? datetime.slice(0, datetime.lastIndexOf(':')) : '--'
		}
	},
	mixins: [mixin],
	mounted() {
		if (this.id) {
			getWonderfulActivityInfoById({ id: this.id })
				.then(res => res.data)
				.then(data => {
					console.log(data.data)
					data.data.duration = [data.data.startReport, data.data.endReport]
					data.data.scopeJson = JSON.parse(data.data.scopeJson)
					this.pics = [
						{
							src: data.data.activityLogo
						}
					]
					this.ruleForm = data.data
					this.files = JSON.parse(data.data.filesJson)
				})
		}
	},
	methods: {
		submitHandler() {
			this.$router.push({
				path: 'matchActivityDetail2',
				query: {
					id: this.id
				}
			})
		}
	}
}
</script>
<style lang="scss">
@import '../../styles/mixin';
#matchActivityDetail {
	.content-container {
		@include richtext;
	}
	.el-form-item {
		margin-bottom: 12px;
	}
	ul {
		list-style-type: none;
		margin: 0;
	}

	.image_view {
		width: 60px;
		height: 60px;
		background: no-repeat center center / cover;
		float: left;
		margin: 0 5px 5px 0;
	}
	.step-container {
		margin-bottom: 12px;
	}
}
</style>
