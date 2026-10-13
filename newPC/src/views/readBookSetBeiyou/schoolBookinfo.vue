<!--添加通知-->
<template>
	<div class="app-container calendar-list-container" id="matchActivityDetail">
		<backtool>
			<el-button type="primary" size="medium" @click="schoolBookeidt()" v-if="num==0">编辑</el-button>
		</backtool>
		<div :class="['page-main']" :style="{ height: nobottommaxH + 'px' }" style="overflow: auto">
			<div style="width: 810px;padding-top:20px;margin: 0 auto;">
				
				<el-form :model="ruleForm" ref="ruleForm" label-width="210px" class="demo-ruleForm">
					<el-form-item label="书籍名称" prop="title">
						{{ ruleForm.boolName }}
					</el-form-item>
                    	<el-form-item label="书籍封面" prop="activityLogo">
						<image-previewer tag="richtext" viewclass="image_view" :images="[{src:ruleForm.coverUrl}]" >
							<ul>
								<li class="pic image_view"  :style="`background-image: url(${ruleForm.coverUrl})`"></li>
							</ul>
						</image-previewer>
					</el-form-item>
					<el-form-item label="书籍类型">
						{{ ruleForm.typeName }}
					</el-form-item>					
				
					<el-form-item label="附件" v-if="ruleForm.fileJson && ruleForm.fileJson.length !== 0">
						<file-list plain :isShowTitle="false" :fileList="ruleForm.fileJson"></file-list>
					</el-form-item>
				</el-form>
			</div>
		</div>
	</div>
</template>

<script>
import FileList from '@/components/FileList/FileList'
import Backtool from '@/components/BackTool'
import ImagePreviewer from '@/components/ImagePreviewer/ImagePreviewer'
import mixin from '@/mixins/windowResize'
import {getReadIndependBookSch} from '@/api/readBookBeiyou';
export default {
	components: {
		Backtool,
		ImagePreviewer,
		FileList
	},
	data() {
		return {
			id: this.$route.query.id,
			num: this.$route.query.num,
			pics: [],
			files: [],
			ruleForm: {
				boolName: '',	
                typeName:""	,
                coverUrl:"",
                fileJson:[]	
			}
		}
	},
	filters: {
		trimTimeMinute(datetime) {
			return datetime ? datetime.slice(0, datetime.lastIndexOf(':')) : '--'
		}
	},
	mixins: [mixin],
	mounted() {
		getReadIndependBookSch(this.id)
				.then(res => res.data)
				.then(data => {
                    data.data.fileJson= data.data.fileJson?JSON.parse( data.data.fileJson):[];
					this.ruleForm = data.data
				})
	},
	methods: {
		schoolBookeidt() {
			this.$router.push({
				path: 'schoolBookeidt',
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
		width: 70px;
		height: 100px;
		background: no-repeat center center / cover;
		float: left;
		margin: 0 5px 5px 0;
	}
	.step-container {
		margin-bottom: 12px;
	}
}
</style>
