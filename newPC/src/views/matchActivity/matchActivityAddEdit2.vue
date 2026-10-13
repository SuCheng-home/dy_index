<!--添加通知-->
<template>
	<div class="app-container calendar-list-container" id="evTeaAddEdit">
		<div class="header">
			<el-button @click="$router.replace('matchActivityList')" type="default" size="medium">返回</el-button>
			<el-button type="default" size="medium" @click="$router.replace({ path: 'matchActivityAddEdit', query: { id } })">上一步</el-button>
			<el-button v-if="status == 0 || status == 1" type="primary" size="medium" @click="submitHandler(1)">保存为草稿</el-button>
			<el-button v-if="status == 0 || status == 1" type="primary" size="medium" @click="submitHandler(2)">发布</el-button>
			<el-button v-else type="primary" size="medium" @click="submitHandler()">保存</el-button>
		</div>
		<div :class="['page-main']" :style="{ height: nobottommaxH + 'px' }" style="overflow: auto">
			<div style="width: 810px;padding-top:20px;margin: 0 auto;">
				<div class="step-container">
					<el-steps :active="active" align-center>
						<el-step title="基础设置"></el-step>
						<el-step title="公开奖项设置"></el-step>
					</el-steps>
				</div>
				<el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="210px" class="demo-ruleForm">
					<div class="section-title">作品公开权限设置</div>
					<template v-if="isCompare == 1">
						<el-form-item label="作品得票数是否公开" prop="isOpenVotes">
							<el-radio-group v-model="ruleForm.isOpenVotes">
								<el-radio :label="1">是</el-radio>
								<el-radio :label="2">否</el-radio>
							</el-radio-group>
						</el-form-item>
						<el-form-item label="获奖作品是否公开" prop="isOpenWin">
							<el-radio-group v-model="ruleForm.isOpenWin">
								<el-radio :label="1">是</el-radio>
								<el-radio :label="2">否</el-radio>
							</el-radio-group>
						</el-form-item>
						<el-form-item v-if="ruleForm.isOpenWin == 1" label="获奖作品奖项是否公开" prop="isOpenPrize">
							<el-radio-group v-model="ruleForm.isOpenPrize">
								<el-radio :label="1">是</el-radio>
								<el-radio :label="2">否</el-radio>
							</el-radio-group>
						</el-form-item>
					</template>
					<template v-if="isCompare == 2">
						<el-form-item label="作品是否公开" prop="isOpenWork">
							<el-radio-group v-model="ruleForm.isOpenWork">
								<el-radio :label="1">是</el-radio>
								<el-radio :label="2">否</el-radio>
							</el-radio-group>
						</el-form-item>
					</template>
					<el-form-item v-if="isCompare == 1 || ruleForm.isOpenWork == 1" label="作品是否可点赞" prop="isPraise">
						<el-radio-group v-model="ruleForm.isPraise">
							<el-radio :label="1">是</el-radio>
							<el-radio :label="2">否</el-radio>
						</el-radio-group>
					</el-form-item>
					<el-form-item v-if="isCompare == 1 || ruleForm.isOpenWork == 1" label="作品是否可评论" prop="isComment">
						<el-radio-group v-model="ruleForm.isComment">
							<el-radio :label="1">是</el-radio>
							<el-radio :label="2">否</el-radio>
						</el-radio-group>
					</el-form-item>
					<template v-if="isCompare == 1">
						<div class="section-title">评比投票数设置</div>
						<el-form-item label="教师可投票数" prop="jiaoshipiao">
							<el-input-number step-strictly v-model="ruleForm.thVoteNum" :min="1" :max="5000"></el-input-number>
							&nbsp;&nbsp;&nbsp;&nbsp; 权重比
							<el-tooltip class="item" effect="dark" content="例：权重比为10，则投1票计数为10票。" placement="top">
								<i class="el-icon-question" />
							</el-tooltip>
							<el-input-number step-strictly v-model="ruleForm.thVoteWeight" :min="1" :max="5000"></el-input-number>
						</el-form-item>
						<el-form-item label="学生可投票数" prop="xueshengpiao">
							<el-input-number step-strictly v-model="ruleForm.stuVoteNum" :min="1" :max="5000"></el-input-number>
							&nbsp;&nbsp;&nbsp;&nbsp; 权重比
							<el-tooltip class="item" effect="dark" content="例：权重比为10，则投1票计数为10票。" placement="top">
								<i class="el-icon-question" />
							</el-tooltip>
							<el-input-number step-strictly v-model="ruleForm.stuVoteWeight" :min="1" :max="5000"></el-input-number>
						</el-form-item>
						<div class="section-title">评比奖项设置</div>
						<el-button type="primary" v-if="status != 5" size="medium" @click="awardAddEdit()">添加</el-button>
						<div>
							<el-table :data="awardList">
								<el-table-column label="奖项名称" align="center" prop="rankName" show-overflow-tooltip></el-table-column>
								<el-table-column label="得票排名" align="center" show-overflow-tooltip>
									<template slot-scope="scope">
										<template>
											<span>前{{ scope.row.voteNum }}名</span>
										</template>
									</template>
								</el-table-column>
								<el-table-column v-if="status != 5" label="操作" align="center" show-overflow-tooltip>
									<template slot-scope="scope">
										<el-button size="small" type="text" :disabled="scope.row.noticeState === 2 || scope.row.isSendOntime == 2" @click="awardAddEdit(scope.row, scope.$index)">编辑</el-button>
										<el-button size="small" type="text" @click.native="awardDelete(scope.$index)" class="buttontextred">删除</el-button>
									</template>
								</el-table-column>
							</el-table>
						</div>
					</template>
				</el-form>
			</div>
		</div>
		<el-dialog :title="`${isAwardEdit ? '编辑' : '添加'}奖项`" :visible.sync="isShowAwardDialog" size="tiny" width="500px" :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false">
			<el-form ref="awardForm" :model="awardForm" :rules="awardFormRule">
				<el-form-item label="奖项名称" label-width="100px" prop="rankName">
					<el-input v-model="awardForm.rankName" placeholder=" 请输入奖项名称" :maxlength="10"></el-input>
				</el-form-item>
				<el-form-item label="得票排名" label-width="100px" prop="voteNum">
					前&nbsp;&nbsp;
					<el-input-number step-strictly v-model="awardForm.voteNum" :min="1" :max="5000"></el-input-number>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="isShowAwardDialog = false" size="medium">取 消</el-button>
				<el-button type="primary" @click="awardAddEditConfirm()" size="medium">确 定</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
import Backtool from '@/components/BackTool'
import mixin from '@/mixins/windowResize'
import { updateWonderfulActivityOtherInfo, getWonderfulActivityInfoById } from '@/api/matchActivity'

import { mapGetters } from 'vuex'

export default {
	components: {
		Backtool
	},
	computed: {
		...mapGetters(['userInfo'])
	},
	data() {
		const jiaoshipiaoValidator = (rule, value, callback) => {
			if (!this.ruleForm.thVoteNum) {
				return callback(new Error('请填写教师票数！'))
			} else if (!this.ruleForm.thVoteWeight) {
				return callback(new Error('请填写教师权重！'))
			} else {
				callback()
			}
		}

		const xueshengpiaoValidator = (rule, value, callback) => {
			if (!this.ruleForm.stuVoteNum) {
				return callback(new Error('请填写学生票数！'))
			} else if (!this.ruleForm.stuVoteWeight) {
				return callback(new Error('请填写学生权重！'))
			} else {
				callback()
			}
		}

		return {
			id: this.$route.query.id,
			active: 2,
			awardList: [],
			isAwardEdit: false,
			editAwardIndex: -1,

			status: 0,
			isCompare: -1,

			awardForm: {
				rankName: '',
				voteNum: 1
			},
			awardFormRule: {
				rankName: [{ required: true, message: '请输入奖项名称！', trigger: 'blur' }],
				voteNum: [{ required: true, message: '请输入得票排名！', trigger: 'blur' }]
			},
			isShowAwardDialog: false,
			ruleForm: {
				isOpenWin: 1,
				isOpenPrize: 1,
				isOpenVotes: 1,
				isPraise: 1,
				isComment: 1,
				thVoteNum: 1,
				thVoteWeight: 1,
				stuVoteNum: 1,
				stuVoteWeight: 1,
				isOpenWork: 1
			},
			rules: {
				isOpenWin: [{ required: true, message: '请选择获奖作品是否公开！', trigger: 'blur' }],
				isOpenPrize: [{ required: true, message: '请选择获奖作品奖项是否公开！', trigger: 'blur' }],
				isOpenVotes: [{ required: true, message: '请选择作品得票数是否公开！', trigger: 'blur' }],
				isOpenWork: [{ required: true, message: '请选择作品是否公开！', trigger: 'blur' }],
				isPraise: [{ required: true, message: '请选择作品是否可点赞！', trigger: 'blur' }],
				isComment: [
					{
						required: true,
						message: '请选择作品是否可评论！',
						trigger: 'blur'
					}
				],
				jiaoshipiao: [
					{
						required: true,
						validator: jiaoshipiaoValidator
					}
				],
				xueshengpiao: [
					{
						required: true,
						validator: xueshengpiaoValidator
					}
				]
			},
			typeList: []
		}
	},
	mixins: [mixin],
	mounted() {
		getWonderfulActivityInfoById({ id: this.id })
			.then(res => res.data)
			.then(data => {
				console.log(data.data)
				data.data.isOpenPrize = data.data.isOpenPrize || 1
				data.data.isOpenVotes = data.data.isOpenVotes || 1
				data.data.isOpenWin = data.data.isOpenWin || 1
				data.data.isPraise = data.data.isPraise || 1
				data.data.isComment = data.data.isComment || 1
				this.awardList = data.data.activityRankList.sort((item1, item2) => item1.voteNum - item2.voteNum)
				this.ruleForm = data.data
				this.isCompare = data.data.isCompare
				this.status = data.data.status
			})
	},
	methods: {
		awardDelete(index) {
			this.awardList.splice(index, 1)
		},
		awardAddEdit(awardItem = { rankName: '', voteNum: 1 }, index = -1) {
			this.awardForm = JSON.parse(JSON.stringify(awardItem))
			this.isAwardEdit = index !== -1
			this.editAwardIndex = index
			this.isShowAwardDialog = true
		},
		awardAddEditConfirm() {
			this.$refs.awardForm.validate(isValid => {
				if (isValid) {
					let error = ''
					if (this.isAwardEdit) {
						if (this.editAwardIndex > 0) {
							if (this.awardList[this.editAwardIndex - 1].voteNum >= this.awardForm.voteNum) {
								error = '后一个奖项排名必须大于前一个'
							}
						}
						if (this.editAwardIndex < this.awardList.length - 1) {
							if (this.awardList[this.editAwardIndex + 1].voteNum <= this.awardForm.voteNum) {
								error = '后一个奖项排名必须大于前一个'
							}
						}
					} else {
						if (this.awardList.length !== 0) {
							if (this.awardList[this.awardList.length - 1].voteNum >= this.awardForm.voteNum) {
								error = '后一个奖项排名必须大于前一个'
							}
						}
					}

					if (error) {
						this.$message.error(error)
					} else {
						if (!this.isAwardEdit) {
							this.awardList.push({
								rankName: this.awardForm.rankName,
								voteNum: this.awardForm.voteNum
							})
						} else {
							this.awardList[this.editAwardIndex].rankName = this.awardForm.rankName
							this.awardList[this.editAwardIndex].voteNum = this.awardForm.voteNum
						}
						this.isShowAwardDialog = false
					}
				}
			})
		},
		submitHandler(status) {
			this.$refs.ruleForm.validate(isValid => {
				if (isValid) {
					let args = {
						status: status || this.status,
						id: this.id
					}
					if (this.isCompare == 1) {
						if (this.awardList.length == 0) {
							this.$message.error('至少需要一个评比项')
							return undefined
						}
						args = Object.assign({}, args, {
							isComment: this.ruleForm.isComment,
							isOpenPrize: this.ruleForm.isOpenWin == 1 ? this.ruleForm.isOpenPrize : 2,
							isOpenVotes: this.ruleForm.isOpenVotes,
							isOpenWin: this.ruleForm.isOpenWin,
							isOpenWork: 2,
							isPraise: this.ruleForm.isPraise,
							stuVoteNum: this.ruleForm.stuVoteNum,
							stuVoteWeight: this.ruleForm.stuVoteWeight,
							thVoteNum: this.ruleForm.thVoteNum,
							thVoteWeight: this.ruleForm.thVoteWeight
						})
						const activityRankList = []
						this.awardList.forEach(item => {
							activityRankList.push({
								activityId: this.id,
								rankName: item.rankName,
								voteNum: item.voteNum
							})
						})
						args.activityRankList = activityRankList
					} else {
						args = Object.assign({}, args, {
							isComment: this.ruleForm.isOpenWork == 1 ? this.ruleForm.isComment : 2,
							isOpenPrize: 2,
							isOpenVotes: 2,
							isOpenWin: 2,
							isOpenWork: this.ruleForm.isOpenWork,
							isPraise: this.ruleForm.isOpenWork == 1 ? this.ruleForm.isPraise : 2
						})
					}

					updateWonderfulActivityOtherInfo(args)
						.then(res => res.data)
						.then(data => {
							if (data.result) {
								this.$message.success('操作成功')
								this.$router.replace({
									path: 'matchActivityList'
								})
							}
						})
				}
			})
		}
	}
}
</script>
<style></style>
<style scoped lang="scss">
@import '../../styles/mixin';
.section-title {
	line-height: 20px;
	font-size: 16px;
	border-left: 4px solid #353e47;
	padding-left: 10px;
	margin-bottom: 22px;
	margin-left: 20px;
}

.header {
	padding-bottom: 10px;
	border-bottom: 1px solid #e7eaec;
}
.step-container {
	margin-bottom: 22px;
}
</style>
