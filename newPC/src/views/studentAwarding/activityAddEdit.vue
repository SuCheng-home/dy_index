<!--添加通知-->
<template>
	<div class="app-container calendar-list-container" id="activityAddEdit">
		<backtool>
			<el-button v-if="state == 1" type="primary" size="medium" @click="submitHandler(1)">保存</el-button>
			<el-button v-if="state == 1" type="primary" size="medium" @click="submitHandler(2)">发布</el-button>
			<el-button v-if="state == 2" type="primary" size="medium" @click="updateAfterSubmitHandler()">保存</el-button>
		</backtool>
		<div :class="['page-main', isStandalone ? 'page-main--scroller' : '']" :style="{ height: nobottommaxH + 'px' }" style="overflow: auto">
			<div style="width: 810px;padding-top:20px;margin: 0 auto;">
				<el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="140px" class="demo-ruleForm">
					<el-form-item v-if="state == 1" label="考评标题" prop="title">
						<el-input v-model="ruleForm.title" placeholder="请输入考评标题" :maxlength="50"></el-input>
					</el-form-item>
					<el-form-item v-else-if="state == 2" label="考评标题">
						{{ ruleForm.title }}
					</el-form-item>
					<el-form-item label="活动时间" prop="activityDuration">
						<el-date-picker v-model="ruleForm.activityDuration" type="datetimerange" format="yyyy-MM-dd HH:mm" value-format="yyyy-MM-dd HH:mm" range-separator="~" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
					</el-form-item>
					<el-form-item label="学生上报时间" prop="reportDuration">
						<el-date-picker v-model="ruleForm.reportDuration" type="datetimerange" format="yyyy-MM-dd HH:mm" value-format="yyyy-MM-dd HH:mm" range-separator="~" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
					</el-form-item>
					<el-form-item label="班级评审时间" prop="classBehDuration">
						<el-date-picker v-model="ruleForm.classBehDuration" type="datetimerange" format="yyyy-MM-dd HH:mm" value-format="yyyy-MM-dd HH:mm" range-separator="~" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
					</el-form-item>
					<el-form-item v-if="state == 1" label="荣誉证书有效期" prop="sueDuration">
						<el-date-picker v-model="ruleForm.sueDuration" type="daterange" range-separator="~" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
					</el-form-item>
					<el-form-item v-else label="荣誉证书有效期">{{ ruleForm.sueStartDate }}&nbsp;至&nbsp;{{ ruleForm.sueEndDate }}</el-form-item>
					<el-form-item v-if="state == 1" label="考评类型" prop="behType">
						<div style="margin-top: 10px;">
							<el-radio-group v-model="ruleForm.behType">
								<el-radio style="margin-bottom: 5px;" :label="1">学生申报->班级初审->班级评比->上报至学校 ->评审结束</el-radio>
								<el-radio :label="2">学生申报->班级初审->班级评比->上报至学校 ->学校评比->评审结束</el-radio>
							</el-radio-group>
						</div>
					</el-form-item>					
					<el-form-item v-else label="考评类型">
						{{ ruleForm.behType == 1 ? '班评' : '校评' }}
					</el-form-item>
					<el-form-item  label="单项素质奖" prop="behType">
						<div >
							<el-radio-group v-model="ruleForm.isDiathAward">
								<el-radio style="margin-bottom: 5px;" :label="1">开启</el-radio>
								<el-radio :label="2">关闭</el-radio>
							</el-radio-group>
						</div>
					</el-form-item>
					<el-form-item v-if="state == 1" label="参加考评年级" prop="classList">
						<el-select v-model="ruleForm.classList" multiple @change="queryCourseByGradeIdFunc">
							<el-option v-for="classItem in allGradeList" :value="classItem.id" :label="classItem.name"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item v-else label="参加考评年级">
						<span v-for="classItem in ruleForm.classJson">{{ classItem.gradeName }}&nbsp;&nbsp;</span>
					</el-form-item>
					<el-form-item label="可申报奖项" prop="award" v-if="state == 1">
						<div v-if="ruleForm.awardList.length < 3" class="add-btn-container" @click="addAwardItem()">
							<i class="el-icon-circle-plus-outline add-btn" title="添加"></i>
							<span style="margin-left: 8px;">添加</span>
						</div>

						<div class="award-item" v-for="(awardItem, index) in ruleForm.awardList">
							<span>奖项名称</span>
							&nbsp;&nbsp;
							<el-select v-model="awardItem.code" @change="awardChangeHandler(index, $event)">
								<el-option v-for="awardOptionItem in allAwardList" :value="awardOptionItem.code" :label="awardOptionItem.value"></el-option>
							</el-select>
							&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
							<span>每班名额</span>
							&nbsp;&nbsp;
							<el-input-number v-model="awardItem.countLimit" :min="1" :max="200" step-strictly label="每班名额" @blur="awardItem.countLimit = awardItem.countLimit || 1"></el-input-number>
							&nbsp;&nbsp;
							<i class="fa fa-trash" @click="deleteAwardItem(index)"></i>
						</div>
					</el-form-item>
					<el-form-item label="可申报奖项" v-else>
						<div class="award-item" v-for="(awardItem, index) in ruleForm.awardList">
							<span>奖项名称</span>
							&nbsp;&nbsp;
							<span>{{ awardItem.name }}</span>
							&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
							<span>每班名额</span>
							&nbsp;&nbsp;
							<span>{{ awardItem.countLimit }}</span>
						</div>
					</el-form-item>
					<el-form-item v-if="state == 1" label="申报荣誉获奖类别" prop="honorTypeList">
						<el-checkbox-group v-model="ruleForm.honorTypeList">
							<el-checkbox :label="honorItem.typeCode1" v-for="honorItem in allHonorTypeList">{{ honorItem.typeName }}</el-checkbox>
						</el-checkbox-group>
					</el-form-item>
					<el-form-item v-else label="申报荣誉获奖类别">
						<span v-for="honorTypeItem in detailInfo.honorTypeJson">{{ honorTypeItem.certType }}&nbsp;&nbsp;</span>
					</el-form-item>
					<el-form-item label="活动描述">
						<el-input type="textarea" v-model.trim="ruleForm.content" :maxlength="100" :rows="4" show-word-limit placeholder="请输入活动描述"></el-input>
					</el-form-item>
					<el-form-item label="附件">
						<uploader pathPrefix="xueshengkaoping" module="xueshengkaoping" moduleCode="20211119" :multiple="true" :extList="['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'png', 'jpg', 'jpeg', 'bmp', 'gif']" v-model="files"></uploader>
					</el-form-item>
					<div class="section">
						<div class="section-title">报名条件</div>
						<el-form-item label="" label-width="0" prop="condition">
							<div class="section-content">
								<div class="condition-list-container">
									<div class="condition-item" v-for="(awardItem, awardIndex) in ruleForm.awardList">
										<div class="condition-item__name">{{ awardItem.name }}</div>
										<div class="condition-item__honor-list">
											<div class="add-btn-container" @click="addHonorItem(awardItem.honorList,awardIndex)">
												<i class="el-icon-circle-plus-outline add-btn" title="添加"></i>
												<span style="margin-left: 8px;">添加</span>
											</div>
											<div>
												&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{awardItem.maxScore}}&nbsp;&nbsp;≥&nbsp;&nbsp;总分&nbsp;&nbsp;≥&nbsp;&nbsp;
												<el-input-number @change="numfun(awardItem.honorList,awardIndex)" @blur="awardItem.honorTotalScore = awardItem.honorTotalScore || 0" size="small" type="text" v-model="awardItem.honorTotalScore" :min="0" :max="200"></el-input-number>
											</div>
											<div v-for="(honorItem, honorIndex) in awardItem.honorList" style="padding-left: 20px;">
												<span style="margin-left:-18px;">且</span>
												<el-input-number @change="numfun(awardItem.honorList,awardIndex)" @blur="honorItem.maxScore = honorItem.maxScore || honorItem.score||1" size="small" type="text" v-model="honorItem.maxScore" :min="honorItem.score" :max="1000"></el-input-number>&nbsp;&nbsp;≥&nbsp;&nbsp;
												<el-select style="width: 100px" size="small" v-model="honorItem.typeCode1" @change="honorItemChangeHandler(awardItem.honorList, honorIndex, $event,awardIndex)">
													<el-option v-for="honorOptionItem in availableHonorList" :label="honorOptionItem.typeName" :value="honorOptionItem.typeCode1"></el-option>
												</el-select>
												&nbsp;&nbsp;≥&nbsp;&nbsp;
												<el-input-number @blur="honorItem.score = honorItem.score || 1" size="small" type="text" v-model="honorItem.score" :min="1" :max="200"></el-input-number>
												<i class="fa fa-trash" @click="deleteHonorItem(awardItem.honorList, honorIndex,awardIndex)"></i>
											</div>
										</div>
									</div>
								</div>
							</div>
						</el-form-item>
					</div>

					<div class="section" v-if="state == 1">
						<div class="section-title">评比项设置 
							&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;计分方式：
							 <el-radio v-model="ruleForm.scoringFormula" :label="1">原始分</el-radio>
                             <el-radio v-model="ruleForm.scoringFormula" :label="2">标准分</el-radio>
						</div>
						<el-form-item label="" label-width="0" prop="pingbixiang">
							<div class="section-content">
								<div>
									<div class="section-title__sub">荣誉获奖</div>
									<div>
										<div class="section-label">班评启用</div>
										<el-switch :value="true" disabled style="margin-right:20px"></el-switch>
										分值占比&nbsp;
										<el-input-number size="small" type="text" :step="1" v-model="ruleForm.classHonorScale" :min="1" :max="100" @blur="ruleForm.classHonorScale = ruleForm.classHonorScale || 1"></el-input-number>
										&nbsp;%
									</div>
									<div v-show="ruleForm.behType == 2">
										<div class="section-label">校评启用</div>
										<el-switch :value="true" disabled style="margin-right:20px"></el-switch>
										<span>
											分值占比&nbsp;
											<el-input-number size="small" type="text" :step="1" v-model="ruleForm.schHonorScale" :min="1" :max="100" @blur="ruleForm.schHonorScale = ruleForm.schHonorScale || 1"></el-input-number>
											&nbsp;%
										</span>
									</div>
								</div>
								<div>
									<div class="section-title__sub">教师评分</div>
									<div>
										<span class="section-label">班评启用</span>
										<el-switch v-model="ruleForm.classThCurr" style="margin-right:20px"></el-switch>
										<span v-show="ruleForm.classThCurr">
											分值占比&nbsp;
											<el-input-number size="small" type="text" v-model="ruleForm.classThCurrScale" :min="1" :max="100" @blur="ruleForm.classThCurrScale = ruleForm.classThCurrScale || 1"></el-input-number>
											&nbsp;%

											<div>
												<div class="section-label">学科</div>
												<div class="course-list">
													<span class="course-item__curr-name" v-for="courseItem in ruleForm.thCurrList">
														<el-checkbox v-model="courseItem.checked" :label="courseItem.name" :value="courseItem.courseId"></el-checkbox>
													</span>
												</div>
											</div>
											<div>
												<div class="section-label">分/票</div>
												<div class="course-list">
													<el-input-number size="small" type="text" v-model="ruleForm.currScore" :min="1" :max="100" @blur="ruleForm.currScore = ruleForm.currScore || 1"></el-input-number>
												</div>
												<div class="section-label" v-if="ruleForm.scoringFormula==2">最低得票率</div>
												<div class="course-list"  v-if="ruleForm.scoringFormula==2">
													<el-input-number size="small" type="text" v-model="ruleForm.thVoteRate" :min="1" :max="100" @blur="ruleForm.thVoteRate = ruleForm.thVoteRate || 1"></el-input-number>
												   &nbsp;%
												</div>
											</div>
										</span>
									</div>
									<div v-show="ruleForm.behType == 2 && ruleForm.classThCurr">
										<div class="section-label">校评启用</div>
										<el-switch v-model="ruleForm.schThCurr" style="margin-right:20px"></el-switch>
										<span v-show="ruleForm.schThCurr">
											分值占比&nbsp;
											<el-input-number size="small" type="text" :step="1" v-model="ruleForm.schThCurrScale" :min="1" :max="100" @blur="ruleForm.schThCurrScale = ruleForm.schThCurrScale || 1"></el-input-number>
											&nbsp;%
										</span>
									</div>
								</div>
								<div>
									<div class="section-title__sub">学生投票</div>
									<div>
										<span class="section-label">班评启用</span>
										<el-switch v-model="ruleForm.classStuVote" style="margin-right:20px"></el-switch>
										<span v-show="ruleForm.classStuVote">
											分值占比&nbsp;
											<el-input-number size="small" type="text" v-model="ruleForm.classStuVoteScale" :min="1" :max="100" @blur="ruleForm.classStuVoteScale = ruleForm.classStuVoteScale || 1"></el-input-number>
											&nbsp;%

											<div style="padding-left: 28px">
												<div class="section-label">赞成票分值：</div>
												<el-input-number size="small" type="text" v-model="ruleForm.stuVoteScore" :min="1" :max="100"></el-input-number>
												&nbsp;&nbsp;&nbsp;&nbsp;
												<span>反对票分值：-{{ ruleForm.stuVoteScore }}&nbsp;分/票</span>
												&nbsp;&nbsp;&nbsp;&nbsp;
												<span>弃权票分值：0&nbsp;分/票</span>
											</div>
											<div style="padding-left: 28px" v-if="ruleForm.scoringFormula==2">
												<div class="section-label">最低参与比例：</div>
												<el-input-number size="small" type="text" v-model="ruleForm.stVotepartRate" :min="1" :max="100"></el-input-number>&nbsp;%
												&nbsp;&nbsp;&nbsp;&nbsp;
												<div class="section-label">最低得票率：</div>
												<el-input-number size="small" type="text" v-model="ruleForm.stVoteRate" :min="1" :max="100"></el-input-number>&nbsp;%
												&nbsp;&nbsp;&nbsp;&nbsp;
											</div>
										</span>
									</div>
									<div v-show="ruleForm.behType == 2 && ruleForm.classStuVote">
										<div class="section-label">校评启用</div>
										<el-switch v-model="ruleForm.schStuVote" style="margin-right:20px"></el-switch>
										<span v-show="ruleForm.schStuVote">
											分值占比&nbsp;
											<el-input-number size="small" type="text" :step="1" v-model="ruleForm.schStuVoteScale" :min="1" :max="100" @blur="ruleForm.schStuVoteScale = ruleForm.schStuVoteScale || 1"></el-input-number>
											&nbsp;%
										</span>
									</div>
								</div>
								<div v-show="ruleForm.behType == 2">
									<div class="section-title__sub">其他</div>
									<div>
										<span class="section-label" v-if="ruleForm.miscList.length < 3">
											<el-button type="primary" size="small" @click="addMiscItem">添加</el-button>
										</span>
										<div class="misc-list">
											<div class="" v-for="(miscItem, index) in ruleForm.miscList">
												<div class="section-label">评比项名称</div>
												<el-input type="text" v-model="miscItem.behTypeName" style="width: 100px" size="small"></el-input>
												&nbsp;&nbsp;&nbsp;&nbsp;分值占比&nbsp;
												<el-input-number size="small" type="text" v-model="miscItem.behTypeScale" :min="1" :max="100" @blur="miscItem.behTypeScale = miscItem.behTypeScale || 1"></el-input-number>
												&nbsp;%
												<i class="fa fa-trash" @click="deleteMiscItem(index)"></i>
											</div>
										</div>
									</div>
								</div>
							</div>
						</el-form-item>
					</div>
					<div class="section" v-else>
						<div class="section-title">评比项设置
							&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;计分方式：
							{{ruleForm.scoringFormula==1?"原始分":"标准分"}}
						</div>
						<el-form-item label="" label-width="0">
							<div class="section-content">
								<div>
									<div class="section-title__sub">荣誉获奖</div>
									<div>
										<div class="section-label">班评启用</div>
										<el-switch :value="true" disabled style="margin-right:20px"></el-switch>
										分值占比&nbsp;{{ ruleForm.classHonorScale }}&nbsp;%
									</div>
									<div v-show="ruleForm.behType == 2">
										<div class="section-label">校评启用</div>
										<el-switch :value="true" disabled style="margin-right:20px"></el-switch>
										<span>分值占比&nbsp;{{ ruleForm.schHonorScale }}&nbsp;%</span>
									</div>
								</div>
								<div>
									<div class="section-title__sub">教师评分</div>
									<div>
										<span class="section-label">班评启用</span>
										<el-switch disabled :value="ruleForm.classThCurr" style="margin-right:20px"></el-switch>
										<span v-show="ruleForm.classThCurr">
											分值占比&nbsp;{{ ruleForm.classThCurrScale }}&nbsp;%
                                              <span v-if="ruleForm.scoringFormula==2">最低得票率
															&nbsp;&nbsp;{{ ruleForm.thVoteRate }}%
														</span>
											<div>
												<div class="section-label">学科</div>
												<div class="course-list">
													<div v-for="courseItem in detailInfo.thCurrJson">
														{{ courseItem.curriculumName }}&nbsp;&nbsp;&nbsp;&nbsp;
														<span>可投票数</span>
														&nbsp;{{ courseItem.limitVoteCount }}&nbsp;&nbsp;&nbsp;&nbsp;
														<span>分/票</span>
														&nbsp;{{ courseItem.score }}
														<span v-if="ruleForm.scoringFormula==2">最低得票率
															&nbsp;&nbsp;{{ ruleForm.thVoteRate }}%
														</span>
													</div>
												</div>
											</div>
										</span>
									</div>
									<div v-show="ruleForm.behType == 2 && ruleForm.classThCurr">
										<div class="section-label">校评启用</div>
										<el-switch :value="ruleForm.schThCurr" disabled style="margin-right:20px"></el-switch>
										<span v-show="ruleForm.schThCurr">分值占比&nbsp;{{ ruleForm.schThCurrScale }}&nbsp;%</span>
									</div>
								</div>
								<div>
									<div class="section-title__sub">学生投票</div>
									<div>
										<span class="section-label">班评启用</span>
										<el-switch disabled :value="ruleForm.classStuVote" style="margin-right:20px"></el-switch>
										<span v-show="ruleForm.classStuVote">
											分值占比&nbsp;{{ ruleForm.classStuVoteScale }}&nbsp;%

											<div style="padding-left: 28px">
												<div class="section-label" style="">赞成票分值：</div>
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
										<el-switch :value="ruleForm.schStuVote" disabled style="margin-right:20px"></el-switch>
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
	</div>
</template>

<script>
import Backtool from '@/components/BackTool'
import Uploader from '@/components/Uploader/WebUploader'
import mixin from '@/mixins/windowResize'
import moment from 'moment'
import { findSchoolDicsByCode } from '@/api/common/common'
import { querySchoolGrade, queryCourseByGradeId } from '@/api/system'
import { addStuBehActivity, updateStuBehActivity, getStuBehActivity } from '@/api/studentAwarding'
import { getDicByCode, formatToDate } from '@/utils/utils'

import { findSchoolHonorTypeCertList } from '@/api/honour/honourGradeSet'

import { mapGetters } from 'vuex'

export default {
	name: 'studentAwardingActivityAddEdit',
	components: {
		Backtool,
		Uploader
	},
	computed: {
		...mapGetters(['isStandalone', 'userInfo']),
		availableHonorList() {
			return this.allHonorTypeList.filter(item => {
				return this.ruleForm.honorTypeList.includes(item.typeCode1)
			})
		}
	},
	data() {
		const activityDurationValidator = (rule, value, callback) => {
			if (!this.ruleForm.activityDuration || this.ruleForm.activityDuration.length === 0) {
				callback(new Error('请选择活动时间'))
			} else {
				callback()
			}
		}
		const reportDurationValidator = (rule, value, callback) => {
			if (!this.ruleForm.reportDuration || this.ruleForm.reportDuration.length === 0) {
				callback(new Error('请选择上报时间'))
			} else if (this.ruleForm.activityDuration && this.ruleForm.activityDuration.length === 2) {
				const startTime = moment(this.ruleForm.activityDuration[0])
				const endTime = moment(this.ruleForm.activityDuration[1])
				if (moment(this.ruleForm.reportDuration[0]).isBefore(startTime) || moment(this.ruleForm.reportDuration[1]).isAfter(endTime)) {
					callback(new Error('上报时间应在活动时间内'))
				} else {
					callback()
				}
			} else {
				callback()
			}
		}
		const classBehDurationValidator = (rule, value, callback) => {
			let error = null
			if (!this.ruleForm.classBehDuration || this.ruleForm.classBehDuration.length === 0) {
				error = new Error('请选择评审时间')
			}
			if (!error && this.ruleForm.activityDuration && this.ruleForm.activityDuration.length === 2) {
				const startTime = moment(this.ruleForm.activityDuration[0])
				const endTime = moment(this.ruleForm.activityDuration[1])
				if (moment(this.ruleForm.classBehDuration[0]).isBefore(startTime) || moment(this.ruleForm.classBehDuration[1]).isAfter(endTime)) {
					error = new Error('评审时间应在活动时间内')
				}
			}
			if (!error && this.ruleForm.reportDuration && this.ruleForm.reportDuration.length === 2) {
				if (moment(this.ruleForm.classBehDuration[0]).isBefore(moment(this.ruleForm.reportDuration[0]))) {
					error = new Error('评审时间应大于上报时间')
				}
			}
			if (error) {
				callback(error)
			} else {
				callback()
			}
		}
		const sueDurationValidator = (rule, value, callback) => {
			let error = null
			if (!this.ruleForm.sueDuration || this.ruleForm.sueDuration.length === 0) {
				error = new Error('请选择荣誉证书有效期')
			}
			if (error) {
				callback(error)
			} else {
				callback()
			}
		}
		const classListValidator = (rule, value, callback) => {
			if (!this.ruleForm.classList || this.ruleForm.classList.length === 0) {
				callback(new Error('请选择考评年级'))
			} else {
				callback()
			}
		}
		const awardValidator = (rule, value, callback) => {
			if (!this.ruleForm.awardList || this.ruleForm.awardList.length === 0) {
				callback(new Error('请添加可申报奖项'))
			} else {
				let isValid = true
				const awardIds = this.ruleForm.awardList.map(item => item.code)
				awardIds.forEach((id, index) => {
					if (awardIds.includes(id, index + 1)) {
						isValid = false
					}
				})
				if (isValid) {
					callback()
				} else {
					callback('不能重复添加奖项')
				}
			}
		}
		const honorTypeListValidator = (rule, value, callback) => {
			if (!this.ruleForm.honorTypeList || this.ruleForm.honorTypeList.length === 0) {
				callback(new Error('请选择可申报荣誉获奖类别'))
			} else {
				callback()
			}
		}
		const conditionValidator = (rule, value, callback) => {
			let error = ''

			this.ruleForm.awardList.forEach(awardItem => {
				if (!error) {
					const ids = awardItem.honorList.map(item => item.typeCode1)
					ids.forEach((id, index) => {
						if (!id) {
							error = '请选择报名条件'
						} else {
							if (ids.includes(id, index + 1)) {
								error = '不能重复添加条件'
							}
						}
					})
				}
			})
			if (!error) {
				callback()
			} else {
				callback(new Error(error))
			}
		}

		const pingbixiangValidator = (rule, value, callback) => {
			if (this.ruleForm.classThCurr && this.ruleForm.thCurrList) {
				if (!this.ruleForm.thCurrList.some(item => item.checked)) {
					callback(new Error('至少选择一项学科'))
				}
			}
			let sum = 0
			sum = this.ruleForm.classHonorScale
			if (this.ruleForm.classThCurr) {
				sum += this.ruleForm.classThCurrScale
			}
			if (this.ruleForm.classStuVote) {
				sum += this.ruleForm.classStuVoteScale
			}

			if (sum == 100) {
				if (this.ruleForm.behType == 1) {
					callback()
				} else {
					let sum2 = this.ruleForm.schHonorScale
					if (this.ruleForm.classThCurr && this.ruleForm.schThCurr) {
						sum2 += this.ruleForm.schThCurrScale
					}
					if (this.ruleForm.classStuVote && this.ruleForm.schStuVote) {
						sum2 += this.ruleForm.schStuVoteScale
					}
					this.ruleForm.miscList.forEach(item => {
						sum2 += Number.parseInt(item.behTypeScale)
					})
					if (sum2 == 100) {
						callback()
					} else {
						callback(new Error('各项比例总和必须是100%'))
					}
				}
			} else {
				callback(new Error('各项比例总和必须是100%'))
			}
		}

		return {
			id: this.$route.query.id,
			isEdit: !!this.$route.query.id,
			allAwardList: [],
			allHonorTypeList: [],
			allGradeList: [],
			files: [],
			state: 1,
			detailInfo: {},
			ruleForm: {
				title: '',
				activityDuration: [],
				reportDuration: [],
				classBehDuration: [],
				sueDuration: [],
				behType: 1,
				classList: [],
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

				rongyuhuojiangOnSchool: false,
				schHonorScale: 1,
				schThCurrScale: 1,
				schThCurr: false,
				schStuVoteScale: 1,
				schStuVote: false,
				miscList: [],

				currScore: 1,
				scoringFormula:1,
				stVoteRate:1,
				stVotepartRate:1,
				thVoteRate:1,
				isDiathAward:1
			},
			rules: {
				title: [{ required: true, message: '请输入活动标题！', trigger: 'blur' }],
				activityDuration: [
					{
						required: true,
						validator: activityDurationValidator
					}
				],
				reportDuration: [
					{
						required: true,
						validator: reportDurationValidator
					}
				],
				classBehDuration: [
					{
						required: true,
						validator: classBehDurationValidator
					}
				],
				sueDuration: [
					{
						required: true,
						validator: sueDurationValidator
					}
				],
				behType: [
					{
						required: true
					}
				],
				classList: [
					{
						required: true,
						validator: classListValidator
					}
				],
				award: [
					{
						required: true,
						validator: awardValidator
					}
				],
				honorTypeList: [
					{
						required: true,
						validator: honorTypeListValidator
					}
				],
				condition: [
					{
						validator: conditionValidator
					}
				],
				pingbixiang: [
					{
						validator: pingbixiangValidator
					}
				]
			}
		}
	},
	mixins: [mixin],
	mounted() {
		if(this.$route.query.newid){
				getStuBehActivity({
				activityId: this.$route.query.newid
			})
				.then(res => res.data)
				.then(data => {
					data.data.activityDuration = [data.data.startDate, data.data.endDate]
					data.data.reportDuration = [data.data.reportStartDate, data.data.reportEndDate]
					data.data.classBehDuration = [data.data.classBehStartDate, data.data.classBehEndDate]
					data.data.sueDuration = [data.data.sueStartDate, data.data.sueEndDate]
					data.data.classJson = JSON.parse(data.data.classJson)
					data.data.classList = data.data.classJson.map(item => item.gradeId)

					const awardList = []
					JSON.parse(data.data.behProjectJson).forEach(item => {
						const obj = {
							code: item.applyAwardCode,
							countLimit: item.classLimitCount,
							name: item.applyAwardName,
							honorList: [],
							maxScore:''
						}
						item.conditList.forEach(conditItem => {
							if (conditItem.certTypeId == 0) {
								obj.honorTotalScore = conditItem.score
								obj.maxScore = conditItem.maxScore||200
							} else {
								obj.honorList.push({
									name: conditItem.certType,
									typeCode1: conditItem.certTypeId,
									score: conditItem.score,
									maxScore:conditItem.maxScore||200
								})
							}
						})
						awardList.push(obj)
					})
					data.data.honorTypeList = JSON.parse(data.data.honorTypeJson).map(item => item.certTypeId)
					data.data.awardList = awardList
					data.data.classThCurr = data.data.classThCurr == 1
					data.data.classStuVote = data.data.classStuVote == 1
					data.data.schStuVote = data.data.schStuVote == 1
					data.data.schThCurr = data.data.schThCurr == 1
					data.data.thCurrList = []
					if (data.data.behType == 2) {
						data.data.miscList = JSON.parse(data.data.elseBehJson)
					} else {
						data.data.miscList = []
					}
					this.detailInfo.honorTypeJson = JSON.parse(data.data.honorTypeJson)
					this.detailInfo.thCurrJson = JSON.parse(data.data.thCurrJson)
					this.files = JSON.parse(data.data.fileJson)
					// this.state = data.data.state
					if (data.data.thCurrJson) {
						const thCurrJson = JSON.parse(data.data.thCurrJson)
						if (thCurrJson && thCurrJson.length !== 0) {
							data.data.currScore = thCurrJson[0].score
						}
					}
					this.ruleForm = data.data
					setTimeout(() => {
						this.$refs.ruleForm.validate()
					}, 500)

					this.queryCourseByGradeIdFunc(JSON.parse(data.data.thCurrJson))
				})

		}
		if (this.isEdit) {
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
					data.data.classList = data.data.classJson.map(item => item.gradeId)

					const awardList = []
					JSON.parse(data.data.behProjectJson).forEach(item => {
						const obj = {
							code: item.applyAwardCode,
							countLimit: item.classLimitCount,
							name: item.applyAwardName,
							honorList: [],
							maxScore:''
						}
						item.conditList.forEach(conditItem => {
							if (conditItem.certTypeId == 0) {
								obj.honorTotalScore = conditItem.score
								obj.maxScore = conditItem.maxScore||200
							} else {
								obj.honorList.push({
									name: conditItem.certType,
									typeCode1: conditItem.certTypeId,
									score: conditItem.score,
									maxScore:conditItem.maxScore||200
								})
							}
						})
						awardList.push(obj)
					})
					data.data.honorTypeList = JSON.parse(data.data.honorTypeJson).map(item => item.certTypeId)
					data.data.awardList = awardList
					data.data.classThCurr = data.data.classThCurr == 1
					data.data.classStuVote = data.data.classStuVote == 1
					data.data.schStuVote = data.data.schStuVote == 1
					data.data.schThCurr = data.data.schThCurr == 1
					data.data.thCurrList = []
					if (data.data.behType == 2) {
						data.data.miscList = JSON.parse(data.data.elseBehJson)
					} else {
						data.data.miscList = []
					}
					this.detailInfo.honorTypeJson = JSON.parse(data.data.honorTypeJson)
					this.detailInfo.thCurrJson = JSON.parse(data.data.thCurrJson)
					this.files = JSON.parse(data.data.fileJson)
					this.state = data.data.state
					if (data.data.thCurrJson) {
						const thCurrJson = JSON.parse(data.data.thCurrJson)
						if (thCurrJson && thCurrJson.length !== 0) {
							data.data.currScore = thCurrJson[0].score
						}
					}
					this.ruleForm = data.data
					setTimeout(() => {
						this.$refs.ruleForm.validate()
					}, 500)

					this.queryCourseByGradeIdFunc(JSON.parse(data.data.thCurrJson))
				})
		}
		querySchoolGrade()
			.then(res => res.data)
			.then(data => {
				this.allGradeList = data.data
			})
		findSchoolHonorTypeCertList()
			.then(res => res.data)
			.then(data => {
				this.allHonorTypeList = data.data
			})
		getDicByCode('studentAward').then(allAwardList => {
			this.allAwardList = [...this.allAwardList, ...allAwardList]
		})
		findSchoolDicsByCode({
			dicCode: 'studentAward'
		})
			.then(res => res.data)
			.then(data => {
				this.allAwardList = [...this.allAwardList, ...data.data]
			})
	},
	methods: {
		deleteMiscItem(index) {
			this.ruleForm.miscList.splice(index, 1)
		},
		updateAfterSubmitHandler() {
			this.$refs.ruleForm.validate(isValid => {
				if (isValid) {
					const [startDate, endDate] = this.ruleForm.activityDuration
					const [startReportDate, endReportDate] = this.ruleForm.reportDuration
					const [classBehStartDate, classBehEndDate] = this.ruleForm.classBehDuration
					const behProjectJson = []
					this.ruleForm.awardList.forEach(item => {
						const pushObj = {
							applyAwardCode: item.code,
							classLimitCount: item.countLimit,
							applyAwardName: item.name,
							conditList: []
						}
						item.honorList.forEach(honorItem => {
							pushObj.conditList.push({
								certType: honorItem.name,
								certTypeId: honorItem.typeCode1,
								score: honorItem.score,
								maxScore:honorItem.maxScore
							})
						})
						pushObj.conditList.push({
							certType: '',
							certTypeId: 0,
							score: item.honorTotalScore,
							maxScore:item.maxScore
						})
						behProjectJson.push(pushObj)
					})
					let args = {
						startDate: `${formatToDate(startDate, 'minute')}:00`,
						endDate: `${formatToDate(endDate, 'minute')}:00`,
						reportStartDate: `${formatToDate(startReportDate, 'minute')}:00`,
						reportEndDate: `${formatToDate(endReportDate, 'minute')}:00`,
						classBehStartDate: `${formatToDate(classBehStartDate, 'minute')}:00`,
						classBehEndDate: `${formatToDate(classBehEndDate, 'minute')}:00`,
						content: this.ruleForm.content,
						fileJson: this.files,
						update: 2,
						behProjectJson,
						id: this.id,
						isDiathAward:this.ruleForm.isDiathAward,
					}
					updateStuBehActivity(args)
						.then(res => res.data)
						.then(data => {
							if (data.result) {
								this.$message.success(`编辑成功`)
								setTimeout(() => {
									this.$router.back()
								}, 500)
							}
						})
				}
			})
		},
		submitHandler(state) {
			this.$refs.ruleForm.validate(isValid => {
				if (isValid) {
					const [startDate, endDate] = this.ruleForm.activityDuration
					const [startReportDate, endReportDate] = this.ruleForm.reportDuration
					const [sueStartDate, sueEndDate] = this.ruleForm.sueDuration
					const [classBehStartDate, classBehEndDate] = this.ruleForm.classBehDuration
					const classJson = []
					this.ruleForm.classList.forEach(id => {
						const gradeObj = this.allGradeList.find(gradeItem => id == gradeItem.id)
						if (gradeObj)
							[
								classJson.push({
									gradeId: gradeObj.id,
									gradeName: gradeObj.name,
									gradeOrder: gradeObj.order
								})
							]
					})
					const behProjectJson = []
					this.ruleForm.awardList.forEach(item => {
						const pushObj = {
							applyAwardCode: item.code,
							classLimitCount: item.countLimit,
							applyAwardName: item.name,
							conditList: []
						}
						item.honorList.forEach(honorItem => {
							pushObj.conditList.push({
								certType: honorItem.name,
								certTypeId: honorItem.typeCode1,
								score: honorItem.score,
								maxScore: honorItem.maxScore
							})
						})
						pushObj.conditList.push({
							certType: '',
							certTypeId: 0,
							score: item.honorTotalScore,
							maxScore: item.maxScore
						})
						behProjectJson.push(pushObj)
					})
					const honorTypeJson = []
					this.ruleForm.honorTypeList.forEach(code => {
						const obj = this.allHonorTypeList.find(item => item.typeCode1 == code)
						if (obj) {
							honorTypeJson.push({
								certTypeId: obj.typeCode1,
								certType: obj.typeName
							})
						}
					})
					const thCurrJson = []
					if (this.ruleForm.classThCurr) {
						this.ruleForm.thCurrList.forEach(item => {
							if (item.checked) {
								thCurrJson.push({
									curriculumId: item.id,
									curriculumName: item.name,
									limitVoteCount: item.limitVoteCount,
									score: this.ruleForm.currScore
								})
							}
						})
					}
					let args = {
						title: this.ruleForm.title,
						startDate: `${formatToDate(startDate, 'minute')}:00`,
						endDate: `${formatToDate(endDate, 'minute')}:00`,
						reportStartDate: `${formatToDate(startReportDate, 'minute')}:00`,
						reportEndDate: `${formatToDate(endReportDate, 'minute')}:00`,
						sueEndDate: formatToDate(sueEndDate),
						sueStartDate: formatToDate(sueStartDate),
						classBehStartDate: `${formatToDate(classBehStartDate, 'minute')}:00`,
						classBehEndDate: `${formatToDate(classBehEndDate, 'minute')}:00`,
						behType: this.ruleForm.behType,
						classJson,
						behProjectJson,
						honorTypeJson,
						content: this.ruleForm.content,
						fileJson: this.files,
						classHonor: 1,
						classHonorScale: this.ruleForm.classHonorScale,
						classThCurr: this.ruleForm.classThCurr ? 1 : 2,
						classThCurrScale: this.ruleForm.classThCurr ? this.ruleForm.classThCurrScale : 0,
						thCurrJson,
						classStuVote: this.ruleForm.classStuVote ? 1 : 2,
						classStuVoteScale: this.ruleForm.classStuVote ? this.ruleForm.classStuVoteScale : 0,
						stuVoteScore: this.ruleForm.stuVoteScore,
						scoringFormula:this.ruleForm.scoringFormula,
						stVoteRate:this.ruleForm.stVoteRate,
						stVotepartRate:this.ruleForm.stVotepartRate,
						thVoteRate:this.ruleForm.thVoteRate,
						isDiathAward:this.ruleForm.isDiathAward,
						state
					}
					if (this.ruleForm.behType == 2) {
						const elseBehJson = []
						this.ruleForm.miscList.forEach(item => {
							elseBehJson.push({
								behTypeName: item.behTypeName,
								behTypeScale: item.behTypeScale
							})
						})
						args = Object.assign({}, args, {
							schHonor: 1,
							schHonorScale: this.ruleForm.schHonorScale,
							schThCurr: this.ruleForm.schThCurr ? 1 : 2,
							schThCurrScale: this.ruleForm.schThCurr ? this.ruleForm.schThCurrScale : 0,
							schStuVote: this.ruleForm.schStuVote ? 1 : 2,
							schStuVoteScale: this.ruleForm.schStuVote ? this.ruleForm.schStuVoteScale : 0,
							elseBehJson
						})
					} else {
						args = Object.assign({}, args, {
							schHonor: 2,
							schHonorScale: 0,
							schThCurr: 2,
							schThCurrScale: 0,
							schStuVote: 2,
							schStuVoteScale: 0,
							elseBehJson: []
						})
					}
					if (this.isEdit) {
						args.id = this.id
						args.updateType = this.state == 1 ? 1 : 2
					}
					new Promise(resolve => {
						if (this.isEdit) {
							updateStuBehActivity(args)
								.then(res => res.data)
								.then(resolve)
						} else {
							addStuBehActivity(args)
								.then(res => res.data)
								.then(resolve)
						}
					}).then(data => {
						if (data.result) {
							this.$message.success(`${this.isEdit ? '编辑' : state == 1 ? '保存' : '发布'}成功`)
							setTimeout(() => {
								this.$router.back()
							}, 500)
						}
					})
				}
			})
		},
		awardChangeHandler(index, code) {
			const awardObj = JSON.parse(JSON.stringify(this.allAwardList.find(item => item.code == code)))
			this.ruleForm.awardList = [
				...this.ruleForm.awardList.slice(0, index),
				{
					code: awardObj.code,
					name: awardObj.value,
					countLimit: 1,
					honorTotalScore: 0,
					honorList: []
				},
				...this.ruleForm.awardList.slice(index + 1)
			]
		},
		deleteAwardItem(index) {
			this.ruleForm.awardList = [...this.ruleForm.awardList.slice(0, index), ...this.ruleForm.awardList.slice(index + 1)]
		},
		addAwardItem() {
			if (this.allAwardList && this.allAwardList.length !== 0) {
				const awardObj = JSON.parse(JSON.stringify(this.allAwardList[0]))
				this.ruleForm.awardList = [
					...this.ruleForm.awardList,
					{
						code: awardObj.code,
						name: awardObj.value,
						countLimit: 1,
						honorTotalScore: 0,
						honorList: []
					}
				]
			}
		},
		honorItemChangeHandler(honorList, index, typeCode1,num) {
			const honorObj = JSON.parse(JSON.stringify(this.allHonorTypeList.find(item => item.typeCode1 == typeCode1)))
			this.$set(honorList, index, {
				typeCode1: honorObj.typeCode1,
				name: honorObj.typeName,
				score: 1,
				maxScore:2
			})
			this.numfun(honorList,num)
		},
		addHonorItem(honorList,num) {
			if (this.allHonorTypeList && this.allHonorTypeList.length !== 0) {
				honorList.push({
					typeCode1: '',
					name: '',
					score: 1,
					maxScore:2
				})
			}
			this.numfun(honorList,num)
		},
		addMiscItem() {
			this.ruleForm.miscList.push({
				behTypeName: '',
				behTypeScale: 1
			})
		},
		deleteHonorItem(honorList, index,num) {
			honorList.splice(index, 1)
			this.numfun(honorList,num)
		},
		numfun(honorList,index){
			let  num=0
			for(let i=0;i<honorList.length;i++){
				num+=(honorList[i].maxScore-0)
			}
			num=Math.floor(num)
			if(num<this.ruleForm.awardList[index].honorTotalScore){
				this.ruleForm.awardList[index].honorTotalScore=""
			}
			this.ruleForm.awardList[index].maxScore=num
		},
		queryCourseByGradeIdFunc(currList = []) {
			this.ruleForm.thCurrList = []

			const ids = []
			this.ruleForm.classList.forEach(gradeId => {
				queryCourseByGradeId(gradeId)
					.then(res => res.data)
					.then(data => {
						const thCurrList = []
						data.data.forEach(item => {
							if (!ids.includes(item.id)) {
								ids.push(item.id)
								const currObj = currList.find(currItem => currItem.curriculumId == item.id)
								if (currObj) {
									thCurrList.push(
										Object.assign({}, item, {
											checked: true,
											limitVoteCount: currObj.limitVoteCount,
											score: currObj.score
										})
									)
								} else {
									thCurrList.push(
										Object.assign({}, item, {
											checked: false,
											limitVoteCount: 1,
											score: 1
										})
									)
								}
							}
						})
						this.ruleForm.thCurrList = [...this.ruleForm.thCurrList, ...thCurrList]
					})
			})
		}
	}
}
</script>
<style scoped lang="scss">
@import '../../styles/mixin';
.el-input-number--small{
	width: 105px;
}
.el-form-item {
	margin-bottom: 10px;
}
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
	box-sizing: border-box;
	padding: 10px;
	width: 50%;
	display: inline-block;
	vertical-align: top;
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
.course-list .course-item > * {
	display: inline-block;
}
.course-item__curr-name {
	width: 9em;
	margin-right: 10px;
}

.condition-list-container {
	clear: both;
}

.condition-list-container .condition-item {
}

.add-btn {
	font-size: 20px;
	position: relative;
	top: 3px;
}
.add-btn-container {
	color: #409eff;
	cursor: pointer;
}
</style>
<style lang="scss">
#activityAddEdit {
	.el-date-editor .el-range-separator {
		padding: 0;
	}
	.el-form-item:last-of-type {
		margin-bottom: 0 !important;
	}
}
</style>
