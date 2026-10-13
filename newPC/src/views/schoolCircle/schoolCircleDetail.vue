<template>
	<div class="app-container calendar-list-container uploadDealRepair" style="width: 100%">
		<div class="header">
			<el-button class="detail-backBtn" size="medium" @click="$router.back()">返回</el-button>
			<el-button class="detail-backBtn" size="medium" type="primary" v-if="isShowByPermission('/schoolfellowCircle/manage')" @click="editCircleSetting">圈子类型设置</el-button>
			<el-button class="detail-backBtn" size="medium" type="primary" @click="goSchoolCircleStatistics">数据统计</el-button>
		</div>
		<div class="mainRepairContents" :style="{ height: `${nobottommaxH - 100}px` }">
			<div class="body">
				<el-form ref="ruleForm" :label-position="labelPosition" label-width="140px" class="formContent">
					<el-form-item label="圈子主题：">
						<div>{{ dataDetail.title }}</div>
					</el-form-item>
					<el-form-item label="主题封面：">
						<image-previewer tag="richtext">
							<div style="margin-top: 30px">
								<img :src="dataDetail.topicCover" alt="" style="width: 350px;height:180px" />
							</div>
						</image-previewer>
					</el-form-item>
					<el-form-item label="圈子图标：">
						<image-previewer tag="richtext">
							<div>
								<img :src="dataDetail.topicLogo" alt="" style="width: 50px;height:50px" />
							</div>
						</image-previewer>
					</el-form-item>

					<el-form-item label="发布范围：">
						<div>{{ dataDetail.circleRange }}</div>
					</el-form-item>
					<el-form-item label="圈子管理员：">
						<div>{{ dataDetail.circleManager }}</div>
					</el-form-item>

					<el-form-item label="是否需要审批：">
						<div>{{ dataDetail.needAudit == 1 ? '是' : '否' }}</div>
					</el-form-item>
					<!-- <el-form-item label="截止时间：">
						<div>{{ '2022-06-08 12:30:60' | formatTimeFilter }}</div>
					</el-form-item> -->
					<el-form-item label="圈子介绍：">
						<div v-html="dataDetail.content" style="margin-top: -12px"></div>
					</el-form-item>
				</el-form>
			</div>
		</div>
	</div>
</template>

<script>
import { getSchoolDicByCode } from '@/utils/utils'
import { getCircleTopicInfoById } from '@/api/schoolCircle'
import BackTool from '@/components/BackTool'
import Uploader from '@/components/Uploader/WebUploader'
import mixin from '@/mixins/windowResize'
import ImagePreviewer from '@/components/ImagePreviewer/ImagePreviewer.vue'
import { isShowByPermission } from '@/utils'

export default {
	data() {
		return {
			dataDetail: '',
			labelPosition: 'right',
			picList: ['https://gc600300-1301434616.cos.ap-nanjing.myqcloud.com/p1.jpg', 'https://gc600300-1301434616.cos.ap-nanjing.myqcloud.com/p1.jpg', 'https://gc600300-1301434616.cos.ap-nanjing.myqcloud.com/p1.jpg', 'https://gc600300-1301434616.cos.ap-nanjing.myqcloud.com/p1.jpg']
		}
	},
	created() {
		this.getCircleTopicInfoById()
	},
	mixins: [mixin],
	filters: {
		formatTimeFilter(date) {
			return date.split('.')[0]
		}
	},
	methods: {
		isShowByPermission,
		getCircleTopicInfoById() {
			getCircleTopicInfoById({ topicId: this.$route.query.id }).then(res => {
				this.dataDetail = res.data.data
				let circleManager = ''
				let range = ''
				JSON.parse(this.dataDetail.stuDepartJson.length ? this.dataDetail.stuDepartJson : '[]').forEach(stu => {
					range += stu.name + ','
				})
                if(this.dataDetail.stuGroupJson) {
                    JSON.parse(this.dataDetail.stuGroupJson.length ? this.dataDetail.stuGroupJson : '[]').forEach(stu => {
                        range += stu.name + ','
                    })
                }
				JSON.parse(this.dataDetail.teacherJson.length ? this.dataDetail.teacherJson : '[]').forEach(teacher => {
					range += teacher.name + ','
				})
				JSON.parse(this.dataDetail.teacherDepartJson.length ? this.dataDetail.teacherDepartJson : '[]').forEach(teacher => {
					range += teacher.name + ','
				})
				JSON.parse(this.dataDetail.manageUserJson).forEach(manager => {
					circleManager += manager.name + ','
				})
                JSON.parse(this.dataDetail.manageDepartJson).forEach(manager => {
                    circleManager += manager.name + ','
                })
                JSON.parse(this.dataDetail.manageGroupJson).forEach(manager => {
                    circleManager += manager.name + ','
                })
                if(this.dataDetail.teacherGroupJson) {
                    JSON.parse(this.dataDetail.teacherGroupJson.length ? this.dataDetail.teacherGroupJson : '[]').forEach(teacher => {
                        range += teacher.name + ','
                    })
                }
				range = range
					.slice(0, -1)
					.split(',')
					.join(',')
				circleManager = circleManager.slice(0, -1)
				this.$set(this.dataDetail, 'circleRange', range)
				this.$set(this.dataDetail, 'circleManager', circleManager)
			})
		},
		goback() {
			this.$router.back()
		},
		goSchoolCircleStatistics() {
			this.$router.push({
				path: 'schoolCircleStatistics',
				query: {
					id: this.$route.query.id
				}
			})
		},
		editCircleSetting() {
			this.$router.push({
				path: 'schoolCircleTypeAdd',
				query: {
					id: this.$route.query.id
				}
			})
		}
	},
	components: {
		ImagePreviewer,
		BackTool,
		Uploader
	}
}
</script>

<style>
.mainRepairContents .el-form-item {
	margin-bottom: 5px;
}

.mainRepairContents label {
	font-weight: bolder;
}

.mainRepairContents .repairimgs .images {
	width: 100px;
	height: 100px;
	margin: 5px;
	display: inline-block;
}
</style>

<style scoped>
.header {
	padding-bottom: 12px;
	border-bottom: 1px solid #e7eaec;
}
.body {
	width: 810px;
	margin: 0 auto;
}
.body .picList {
	display: flex;
	flex-wrap: wrap;
}
.body .picList img {
	width: 100px;
	height: 100px;
	margin-right: 15px;
	margin-bottom: 15px;
}
.formStyle {
	margin: 0 0 15px 0;
	box-sizing: border-box;
	padding-left: 35px;
}

.groupBorder {
	border: 1px solid #e5e5e5;
}

.leftdotted {
	display: block;
	float: left;
	width: 15px;
}

.rightCotainer {
	display: block;
	float: right;
	width: 97%;
}

.rightCotainer > span {
	display: inline-block;
	width: 100%;
	font-weight: bolder;
	word-wrap: break-word;
	word-break: break-all;
	color: #48576a;
	font-size: 14px;
}

.remark {
	color: #999;
	font-size: 12px;
	padding-top: 0;
}

.fabackstate {
	display: block;
	width: 10px;
	height: 10px;
	border-radius: 5px;
	background-color: #ffbd4c;
	margin: 6px 10px 0 7px;
}

.dealstate {
	display: block;
	width: 10px;
	height: 10px;
	border-radius: 5px;
	background-color: #35b0fe;
	margin: 6px 10px 0 7px;
}

.card-padding {
	position: relative;
	margin: 15px 5px;
}

.card-padding:after {
	content: ' ';
	position: absolute;
	left: 0;
	bottom: 0;
	right: 0;
	height: 1px;
	border-bottom: 1px solid #e5e5e5;
	color: #e5e5e5;
	-webkit-transform-origin: 0 100%;
	transform-origin: 0 100%;
	-webkit-transform: scaleY(0.5);
	transform: scaleY(0.5);
}

.card-padding:last-child:after {
	height: 0 !important;
	border-bottom: none !important;
}

.mainRepairContents {
	padding-top: 20px;
	min-width: 100px;
	width: 100%;
	overflow: auto;
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

.dealcontent {
	border: 1px solid #9ea7b3;
	border-radius: 5px;
}

.dealcontent > p {
	padding: 0 15px;
	margin: 0;
}

.repairimgs .images {
	width: 100px;
	height: 100px;
	margin: 5px;
	display: inline-block;
}

.repairimgs span {
	display: inline-block;
	width: 100px;
	height: 100px;
	background: no-repeat center center / cover;
}

/*.dealresult {
        width: 80%;
    }*/
.dealresult.nodeal {
	/*未解决样式*/
	color: #ff9999;
	font-weight: bolder;
}

.dealresult.yesdeal {
	/*已完成样式*/
	color: #04be02;
	font-weight: bolder;
}

.imgfack.repairimgs {
	/*yjx min-height: 110px; */
}
</style>
<style scoped>
.uploadDealRepair .el-icon-view {
	display: none;
}
.uploadDealRepair .el-upload-list--picture-card .el-upload-list__item {
	width: 100px;
	height: 100px;
}
.uploadDealRepair .el-upload--picture-card {
	width: 100px;
	height: 100px;
	line-height: 100px;
}
.uploadDealRepair .el-progress-circle {
	width: 80px !important;
	height: 80px !important;
}
.uploadDealRepair .el-upload-list--picture-card .el-progress {
	width: 80px !important;
}
</style>
