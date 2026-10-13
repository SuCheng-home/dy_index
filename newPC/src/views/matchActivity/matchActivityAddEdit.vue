<!--添加通知-->
<template>
	<div class="app-container calendar-list-container" id="evTeaAddEdit">
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
				<el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="140px" class="demo-ruleForm">
					<el-form-item label="活动标题" prop="title">
						<el-input v-model="ruleForm.title" placeholder="请输入主题" :maxlength="30"></el-input>
					</el-form-item>
					<el-form-item label="活动类别" prop="activityCode">
						<el-select v-model="ruleForm.activityCode">
							<el-option v-for="item in typeList" :value="item.code" :label="item.value"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="对象范围" prop="scopeJson">
						<address-book v-model="ruleForm.scopeJson" :config="configData" isSchoolManager></address-book>
					</el-form-item>
					<el-form-item label="活动封面" prop="activityLogo">
						<uploader pathPrefix="matchActivity" :multiple="false" :extList="['jpg', 'jpeg', 'bmp', 'png', 'gif']" v-model="activityLogo" showMode="image" showResult="image"></uploader>
					</el-form-item>
					<el-form-item label="上报作品形式" prop="workType">
						<template v-if="status == 0 || status == 1">
							<el-radio-group v-model="ruleForm.workType">
								<el-radio :label="1">图片</el-radio>
								<el-radio :label="2">视频</el-radio>
							</el-radio-group>
						</template>
						<template v-else>
							{{ ['', '图片', '视频'][ruleForm.workType] }}
						</template>
					</el-form-item>
					<el-form-item label="作品上报时间" prop="duration">
						<el-date-picker v-model="ruleForm.duration" type="datetimerange" format="yyyy-MM-dd HH:mm" value-format="yyyy-MM-dd HH:mm" range-separator="~" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
					</el-form-item>
					<el-form-item label="作品上报数量限制" prop="reportNum">
						<el-input-number step-strictly v-model="ruleForm.reportNum" :min="0" :max="5000" label="上报数量限制"></el-input-number>
						&nbsp;&nbsp;数量为0即不做限制
					</el-form-item>
					<el-form-item label="作品是否评比" prop="isCompare">
						<el-radio-group v-model="ruleForm.isCompare">
							<el-radio :label="1">是</el-radio>
							<el-radio :label="2">否</el-radio>
						</el-radio-group>
					</el-form-item>
					<el-form-item class="new-editor" label="活动说明" prop="remark">
						<br />
						<ueditor style="width: 740px;position: relative;right: 70px;" class="rich-editor new-editor" ref="ueditor" :defaultMes="ruleForm.remark" @editModel="richTextEditHandler"></ueditor>
					</el-form-item>
					<el-form-item label="活动附件">
						<uploader pathPrefix="jingcaihuodong" module="jingcaihuodong" moduleCode="20220120" :multiple="true" :extList="['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx']" v-model="files"></uploader>
					</el-form-item>
				</el-form>
			</div>
		</div>
	</div>
</template>

<script>
import AddressBook from '@/components/AddressBook/indexExpand'
import Backtool from '@/components/BackTool'
import Uploader from '@/components/Uploader/WebUploader'
import mixin from '@/mixins/windowResize'
import moment from 'moment'
import Ueditor from '@/components/Ueditor'
import { getSchoolDicByCode } from '@/utils/utils'

import { saveWonderfulActivityBasicInfo, getWonderfulActivityInfoById } from '@/api/matchActivity'

import { mapGetters } from 'vuex'

export default {
	components: {
		Backtool,
		Uploader,
		Ueditor,
		AddressBook
	},
	computed: {
		...mapGetters(['userInfo'])
	},
	data() {
		const scopeJsonValidator = (rule, value, callback) => {
			if (!this.ruleForm.scopeJson.departJson) {
				return callback(new Error('请选择对象范围！'))
			} else {
				callback()
			}
		}
		const activityLogoValidator = (rule, value, callback) => {
			if (this.activityLogo.length === 0) {
				return callback(new Error('请上传封面！'))
			} else {
				callback()
			}
		}
		return {
			id: this.$route.query.id,
			isEdit: !!this.$route.query.id,
			active: 1,
			activityLogo: [],
			files: [],
			status: 1,
			configData: {
				title: '选择范围',
				depart: { target: 'all', departType: 's', userTypes: '2' },
				group: false
			},
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
			rules: {
				title: [{ required: true, message: '请输入活动标题！', trigger: 'blur' }],
				activityCode: [{ required: true, message: '请选择活动类别！', trigger: 'blur' }],
				scopeJson: [{ required: true, validator: scopeJsonValidator }],
				activityLogo: [{ required: true, validator: activityLogoValidator }],
				workType: [
					{
						required: true,
						message: '请选择作品形式！',
						trigger: 'blur'
					}
				],
				duration: [
					{
						required: true,
						message: '请选择上报时间！',
						trigger: 'blur'
					}
				],
				reportNum: [
					{
						required: true,
						message: '请填写作品上报数量限制！',
						trigger: 'blur'
					}
				],
				isCompare: [
					{
						required: true,
						message: '请选择是否评比！',
						trigger: 'blur'
					}
				],
				remark: [
					{
						required: true,
						message: '请输入活动说明！',
						trigger: 'blur'
					}
				]
			},
			typeList: []
		}
	},
	mixins: [mixin],
	mounted() {
		getSchoolDicByCode('wonderfulActivityType').then(data => {
			this.typeList = data
			if (data.length !== 0 && !this.isEdit) {
				this.ruleForm.activityCode = data[0].code
			}
		})
		if (this.id) {
			getWonderfulActivityInfoById({ id: this.id })
				.then(res => res.data)
				.then(data => {
					console.log(data.data)
					data.data.duration = [data.data.startReport, data.data.endReport]
					data.data.scopeJson = JSON.parse(data.data.scopeJson)
					data.data.activityLogo = [
						{
							fileUrl: data.data.activityLogo
						}
					]
					this.ruleForm = data.data
					this.activityLogo = data.data.activityLogo
					this.files = JSON.parse(data.data.filesJson)
					this.status = data.data.status
				})
		}
	},
	methods: {
		richTextEditHandler(remark) {
			this.ruleForm.remark = remark
		},
		submitHandler() {
			this.$refs.ruleForm.validate(isValid => {
				if (isValid) {
					const args = {
						activityCode: this.ruleForm.activityCode,
						activityLogo: this.activityLogo[0].fileUrl,
						startReport: moment(this.ruleForm.duration[0]).format('YYYY-MM-DD HH:mm') + ':00',
						endReport: moment(this.ruleForm.duration[1]).format('YYYY-MM-DD HH:mm') + ':00',
						filesJson: JSON.stringify(this.files),
						isCompare: this.ruleForm.isCompare,
						remark: this.ruleForm.remark,
						reportNum: this.ruleForm.reportNum,
						scopeJson: JSON.stringify(this.ruleForm.scopeJson),
						status: 1,
						title: this.ruleForm.title,
						workType: this.ruleForm.workType
					}
					const activityObj = this.typeList.find(item => item.code == this.ruleForm.activityCode)
					if (activityObj) {
						args.activityName = activityObj.value
					}
					if (this.id) {
						args.id = this.id
						args.status = this.status
					}
					saveWonderfulActivityBasicInfo(args)
						.then(res => res.data)
						.then(data => {
							if (data.result) {
								this.$router.push({
									path: 'matchActivityAddEdit2',
									query: {
										id: data.data.id
									}
								})
							}
						})
				}
			})
		}
	}
}
</script>
<style scoped lang="scss">
@import '../../styles/mixin';
// /deep/ .el-step__title.is-process {
// 	color: #c0c4cc !important;
// }
// /deep/ .el-step__head.is-process {
// 	color: #c0c4cc !important;
// 	border-color: #c0c4cc !important;
// }
.step-container {
	margin-bottom: 22px;
}
</style>
