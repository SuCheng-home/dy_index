<!--添加通知-->
<template>
	<div class="app-container calendar-list-container" id="studentAwardingActivityDetail">
		<backtool>
			<el-button type="primary" size="medium" v-if="isShowByPermission('/stuBeh/stuBehAdd')" @click="jumpToPage('activityAddEdit', { id })">编辑</el-button>
			<el-button type="primary" size="medium" v-if="isShowByPermission('/stuBeh/stuBehAdd')" v-show="ruleForm.classThCurr" @click="rePublish()">补发</el-button>
			<el-button type="danger" size="medium" v-if="isShowByPermission('/stuBeh/stuBehAdd')" @click="deleteHandler()">删除</el-button>
		</backtool>
		<div :class="['page-main', isStandalone ? 'page-main--scroller' : '']" :style="{ height: nobottommaxH + 'px' }" style="overflow: auto">
			<div style="width: 900px;padding-top:20px;margin: 0 auto;">
				<el-form label-width="210px" class="demo-ruleForm">
					<el-form-item label="考评标题">
						{{ ruleForm.title }}
					</el-form-item>
					<el-form-item label="活动时间">{{ ruleForm.startDate | trimTimeHour }}&nbsp;至&nbsp;{{ ruleForm.endDate | trimTimeHour }}</el-form-item>
					<el-form-item label="学生上报活动时间">{{ ruleForm.reportStartDate | trimTimeHour }}&nbsp;至&nbsp;{{ ruleForm.reportEndDate | trimTimeHour }}</el-form-item>
					<el-form-item label="班级评审时间">{{ ruleForm.classBehStartDate | trimTimeHour }}&nbsp;至&nbsp;{{ ruleForm.classBehEndDate | trimTimeHour }}</el-form-item>
					<el-form-item label="荣誉证书有效期">{{ ruleForm.sueStartDate }}&nbsp;至&nbsp;{{ ruleForm.sueEndDate }}</el-form-item>

					<el-form-item label="考评类型">
						{{ ruleForm.behType == 1 ? '班评' : '校评' }}
					</el-form-item>
					<el-form-item label="参加考评年级">
						<span v-for="classItem in ruleForm.classJson">{{ classItem.gradeName }}&nbsp;&nbsp;</span>
					</el-form-item>
					<el-form-item label="可申报奖项">
						<div class="award-item" v-for="(awardItem, index) in ruleForm.awardList">
							<span>{{ awardItem.name }}</span>
							&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
							<span>每班名额</span>
							&nbsp;&nbsp;
							<span>{{ awardItem.countLimit }}</span>
						</div>
					</el-form-item>
					<el-form-item label="申报荣誉获奖类别">
						<span v-for="honorTypeItem in detailInfo.honorTypeJson">{{ honorTypeItem.certType }}&nbsp;&nbsp;</span>
					</el-form-item>
					<el-form-item label="活动描述">
						{{ ruleForm.content }}
					</el-form-item>
					<el-form-item label="附件">
						<uploader pathPrefix="xueshengkaoping" module="xueshengkaoping" moduleCode="20211119" :multiple="true" :extList="['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'png', 'jpg', 'jpeg', 'bmp', 'gif']" v-model="files" disabled></uploader>
					</el-form-item>
					<div class="section">
						<div class="section-title">报名条件</div>
						<el-form-item label="" label-width="0" prop="condition">
							<div class="section-content">
								<div class="condition-item">
									<div class="condition-item__name">荣誉获奖总分</div>
								</div>
								<div class="condition-list-container">
									<div class="condition-item" v-for="(awardItem, awardIndex) in ruleForm.awardList">
										<div class="condition-item__name">{{ awardItem.name }}</div>
										&nbsp;&nbsp;&nbsp;&nbsp;
										<div class="condition-item__honor-list">
											<div>
												{{awardItem.maxScore}}&nbsp;&nbsp;≥&nbsp;&nbsp;总分&nbsp;&nbsp;≥&nbsp;&nbsp;
												{{ awardItem.honorTotalScore }}
											</div>
											<div v-for="(honorItem, honorIndex) in awardItem.honorList">
												<span style="margin-left:-26px;">且</span>
												{{honorItem.maxScore}}&nbsp;&nbsp;≥&nbsp;&nbsp; {{ honorItem.name }}&nbsp;&nbsp;≥&nbsp;&nbsp;
												{{ honorItem.score }}
											</div>
										</div>
									</div>
								</div>
							</div>
						</el-form-item>
					</div>

					<div class="section">
						<div class="section-title">评比项设置 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;计分方式：
							{{ruleForm.scoringFormula==1?"原始分":"标准分"}}</div>
						<el-form-item label="" label-width="0">
							<div class="section-content">
								<div>
									<div class="section-title__sub">荣誉获奖</div>
									<div>
										<div class="section-label">班评启用</div>
										<el-switch :value="true" disabled></el-switch>
										分值占比&nbsp;{{ ruleForm.classHonorScale }}&nbsp;%
									</div>
									<div v-show="ruleForm.behType == 2">
										<div class="section-label">校评启用</div>
										<el-switch :value="true" disabled></el-switch>
										<span>分值占比&nbsp;{{ ruleForm.schHonorScale }}&nbsp;%</span>
									</div>
								</div>
								<div>
									<div class="section-title__sub">教师评分</div>
									<div>
										<span class="section-label">班评启用</span>
										<el-switch disabled :value="ruleForm.classThCurr"></el-switch>
										<span v-show="ruleForm.classThCurr">
											分值占比&nbsp;{{ ruleForm.classThCurrScale }}&nbsp;%

											<div>
												<div class="section-label">学科</div>
												<div class="course-list">
													<span v-for="courseItem in detailInfo.thCurrJson">{{ courseItem.curriculumName }}&nbsp;&nbsp;</span>
												</div>
											</div>
											<div v-if="detailInfo.thCurrJson && detailInfo.thCurrJson.length !== 0">
												<div class="section-label">分/票</div>
												<div class="course-list">
													{{ detailInfo.thCurrJson[0].score }}
												</div>
												&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
												<span v-if="ruleForm.scoringFormula==2">最低得票率
															&nbsp;&nbsp;{{ ruleForm.thVoteRate }}&nbsp;%
											</span>
											</div>
											
										</span>
									</div>
									<div v-show="ruleForm.behType == 2 && ruleForm.classThCurr">
										<div class="section-label">校评启用</div>
										<el-switch :value="ruleForm.schThCurr" disabled></el-switch>
										<span v-show="ruleForm.schThCurr">分值占比&nbsp;{{ ruleForm.schThCurrScale }}&nbsp;%</span>
									</div>
								</div>
								<div>
									<div class="section-title__sub">学生投票</div>
									<div>
										<span class="section-label">班评启用</span>
										<el-switch disabled :value="ruleForm.classStuVote"></el-switch>
										<span v-show="ruleForm.classStuVote">
											分值占比&nbsp;{{ ruleForm.classStuVoteScale }}&nbsp;%

											<div>
												<div class="section-label">赞成票分值：</div>
												&nbsp;{{ ruleForm.stuVoteScore }}&nbsp;分/票 &nbsp;&nbsp;&nbsp;&nbsp;
												<span>反对票分值：-{{ ruleForm.stuVoteScore }}&nbsp;分/票</span>
												&nbsp;&nbsp;&nbsp;&nbsp;
												<span>弃权票分值：0&nbsp;分/票</span>
											</div>
											<div style="padding-left: 28px" v-if="ruleForm.scoringFormula==2">
												<div class="section-label">最低参与比例：</div>
												{{ruleForm.stVotepartRate}}&nbsp;%
												&nbsp;&nbsp;&nbsp;&nbsp;
												<div class="section-label">最低得票率：</div>
												{{ruleForm.stVoteRate}}&nbsp;%
												&nbsp;&nbsp;&nbsp;&nbsp;
											</div>
										</span>
									</div>
									<div v-show="ruleForm.behType == 2 && ruleForm.classStuVote">
										<div class="section-label">校评启用</div>
										<el-switch :value="ruleForm.schStuVote" disabled></el-switch>
										<span v-show="ruleForm.schStuVote">分值占比&nbsp;{{ ruleForm.schStuVoteScale }}&nbsp;%</span>
									</div>
								</div>
								<div v-show="ruleForm.behType == 2">
									<div class="section-title__sub">其他</div>
									<div>
										<div class="misc-list">
											<div class="" v-for="miscItem in ruleForm.miscList">
												<div class="section-label">评比项名称</div>
												{{ miscItem.behTypeName }}&nbsp;&nbsp;&nbsp;&nbsp;分值占比&nbsp;{{ miscItem.behTypeScale }}
											</div>
										</div>
									</div>
								</div>
							</div>
						</el-form-item>
					</div>
				</el-form>
			</div>
		</div>
		<el-dialog title="补发学科" :visible.sync="isShowRepublishDialog" size="tiny" width="600px" :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false">
			<div>
				<div class="dialog-content">
					<div class="course-list course-list--re">
						<span class="course-item" v-for="courseItem in detailInfo.thCurrJson">
							<el-checkbox disabled :value="true"></el-checkbox>
							{{ courseItem.curriculumName }}
						</span>
						<span class="course-item" v-for="courseItem in currList">
							<span class="course-item__curr-name">
								<el-checkbox v-model="courseItem.checked" :label="courseItem.name" :value="courseItem.courseId"></el-checkbox>
							</span>
						</span>
					</div>
				</div>
				<div class="footer clearfix">
					<div class="confirm-btn">
						<el-button size="small" type="default" @click="isShowRepublishDialog = false">取消</el-button>
						<el-button size="small" type="primary" @click="republishConfirm()">确定</el-button>
					</div>
				</div>
			</div>
		</el-dialog>
	</div>
</template>

<script>
import { isShowByPermission } from '@/utils'

import Uploader from '@/components/Uploader/WebUploader'

import baseMixin from '@/mixins/baseMixin'

import Backtool from '@/components/BackTool'
import mixin from '@/mixins/windowResize'

import { getStuBehActivity, delStuBehActivity, againStuBehActivity } from '@/api/studentAwarding'
import { queryCourseByGradeId } from '@/api/system'

import { mapGetters } from 'vuex'

export default {
	name: 'studentAwardingActivityDetail',
	components: {
		Backtool,
		Uploader
	},
	computed: {
		...mapGetters(['isStandalone', 'userInfo'])
	},
	filters: {
		trimTime(datetime) {
			return datetime ? datetime.slice(0, datetime.lastIndexOf('.')) : '--'
		},
		trimTimeHour(datetime) {
			return datetime ? datetime.slice(0, datetime.lastIndexOf(':')) : '--'
		}
	},
	data() {
		return {
			id: this.$route.query.id,
			isEdit: !!this.$route.query.id,
			allAwardList: [],
			allHonorList: [],
			files: [],
			detailInfo: {
				honorTypeJson: []
			},
			ruleForm: {
				honorTotalScore: 1,
				biaoti: '',
				huodongshijian: [],
				shangbaoshijian: [],
				pingshenshijian: [],
				kaopingleixing: 2,
				kaopingbanji: {},
				awardList: [],
				honorTypeList: [],
				content: '',
				classHonorScale: 1,
				classThCurrScale: 1,

				classThCurr: true,
				thCurrList: [],
				classStuVote: true,
				classStuVoteScale: 0,
				stuVoteScore: 3,

				schHonorScale: 1,
				schThCurrScale: 1,
				schThCurr: true,
				schStuVoteScale: 1,
				schStuVote: true,
				miscList: []
			},

			isShowRepublishDialog: false,
			currList: [],
			classJson: []
		}
	},
	mixins: [mixin, baseMixin],
	created() {
		this.initAll()
	},
	methods: {
		isShowByPermission,
		republishConfirm() {
			const thCurrJson = []
			this.currList.forEach(item => {
				if (item.checked) {
					thCurrJson.push({
						curriculumId: item.id,
						curriculumName: item.name,
						limitVoteCount: 1,
						score: this.detailInfo.thCurrJson[0].score
					})
				}
			})
			console.log('thCurrJson', thCurrJson)
			if (thCurrJson.length === 0) {
				this.$message.error('至少选择一个补发学科')
			} else {
				againStuBehActivity({
					id: this.id,
					thCurrJson
				})
					.then(res => res.data)
					.then(data => {
						if (data.result) {
							this.$message.success('补发成功')
							this.initAll()
							this.isShowRepublishDialog = false
						} else {
							this.$message.error(data.msg)
						}
					})
			}
		},
		initAll() {
			getStuBehActivity({
				activityId: this.id
			})
				.then(res => res.data)
				.then(data => {
					data.data.activityDuration = [data.data.startDate, data.data.endDate]
					data.data.reportDuration = [data.data.reportStartDate, data.data.reportEndDate]
					data.data.classBehDuration = [data.data.classBehStartDate, data.data.classBehEndDate]
					data.data.sueDuration = [data.data.sueStartDate, data.data.sueEndDate]
					data.data.classJson = JSON.parse(data.data.classJson)
					this.classJson = data.data.classJson
					const awardList = []
					JSON.parse(data.data.behProjectJson).forEach(item => {
						const obj = {
							code: item.applyAwardCode,
							countLimit: item.classLimitCount,
							name: item.applyAwardName,
							maxScore:'',
							honorList: []
						}
						item.conditList.forEach(conditItem => {
							if (conditItem.certTypeId == 0) {
								obj.honorTotalScore = conditItem.score
								obj.maxScore = conditItem.maxScore
							} else {
								obj.honorList.push({
									name: conditItem.certType,
									typeCode1: conditItem.certTypeId,
									score: conditItem.score,
									maxScore: conditItem.maxScore
								})
							}
						})
						awardList.push(obj)
					})
					console.log(awardList)
					this.detailInfo.honorTypeJson = JSON.parse(data.data.honorTypeJson)
					this.detailInfo.thCurrJson = JSON.parse(data.data.thCurrJson)
					data.data.honorTypeList = JSON.parse(data.data.honorTypeJson).map(item => item.certTypeId)
					data.data.awardList = awardList
					data.data.classThCurr = data.data.classThCurr == 1
					data.data.classStuVote = data.data.classStuVote == 1
					data.data.schStuVote = data.data.schStuVote == 1
					data.data.schThCurr = data.data.schThCurr == 1
					data.data.thCurrList = []
					if (data.data.behType == 2) {
						data.data.miscList = JSON.parse(data.data.elseBehJson)
					}

					this.files = JSON.parse(data.data.fileJson)
					this.state = data.data
					this.ruleForm = data.data
					this.initCurr()
				})
		},
		initCurr() {
			let currList = []
			const ids = []
			console.log('detailInfo.thCurrJson', this.detailInfo.thCurrJson)
			this.classJson.forEach(item => {
				queryCourseByGradeId(item.gradeId)
					.then(res => res.data)
					.then(data => {
						console.log(data)
						data.data.forEach(currItem => {
							const currObj = this.detailInfo.thCurrJson.find(thCurrItem => thCurrItem.curriculumId == currItem.id)
							if (!currObj && !ids.includes(currItem.id)) {
								ids.push(currItem.id)
								currList.push(
									Object.assign({}, currItem, {
										checked: false,
										limitVoteCount: 1,
										score: 1
									})
								)
							}
						})
					})
			})
			this.currList = currList
		},
		deleteHandler() {
			this.$confirm('确认删除该活动？', '删除', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {
				delStuBehActivity({
					activityId: this.id
				})
					.then(res => res.data)
					.then(data => {
						if (data.result) {
							this.$message.success('删除成功')
							setTimeout(() => {
								this.$router.back()
							}, 500)
						} else {
							this.$message.error(data, msg)
						}
					})
			})
		},
		rePublish() {
			this.initCurr()
			this.isShowRepublishDialog = true
		}
	}
}
</script>
<style scoped lang="scss">
.el-form-item {
	margin-bottom: 1px;
}
@import '../../styles/mixin';

.section-title {
	line-height: 20px;
	font-size: 16px;
	border-left: 4px solid #409eff;
	padding-left: 10px;
}

.award-item {
	margin-bottom: 10px;
}

.fa-trash {
	color: #f08080;
	cursor: pointer;
}

.condition-item {
	float: left;
	width: 50%;
	box-sizing: border-box;
	padding: 10px;
}

.condition-item__name {
	width: 6em;
	text-align: right;
}

.condition-item > * {
	display: inline-block;
	vertical-align: top;
}

.section {
	padding: 10px;
	margin-bottom: 22px;
	background-color: #f8fbff;
	width: 900px;
}

.section-title__sub {
	font-weight: bold;
}

.section-label {
	display: inline-block;
	width: 8em;
	margin-right: 5px;
	text-align: right;
}

.course-list {
	display: inline-block;
	vertical-align: top;
}

.condition-list-container {
	clear: both;
}

.confirm-btn {
	float: right;
}

.course-item-show {
	position: relative;
	font-size: 14px;
	margin-bottom: 20px;
	padding-left: 24px;
}
.course-item {
	position: relative;
	font-size: 14px;
	margin-bottom: 20px;
	margin-right: 20px;
}
.course-list {
	padding-left: 20px;
}
.dialog-content {
	padding-top: 10px;
	margin-bottom: 10px;
	box-sizing: border-box;
	max-height: 520px;
	overflow-y: auto;
}
</style>
<style lang="scss">
#studentAwardingActivityDetail {
	.el-form-item__label {
		color: #5f5f5f;
		font-weight: bold;
		font-size: 14px;
		padding-right: 30px;
	}
	.el-form-item__content {
		font-size: 14px;
		color: #333;
	}
}
</style>
