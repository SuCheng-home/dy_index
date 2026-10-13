<!--添加通知-->
<template>
	<div class="app-container calendar-list-container" id="matchActivityDetail2">
		<div class="header">
			<el-button @click="$router.replace('matchActivityList')" type="default" size="medium">返回</el-button>
			<el-button type="default" size="medium" @click="$router.back()">上一步</el-button>
		</div>
		<div :class="['page-main']" :style="{ height: nobottommaxH + 'px' }" style="overflow: auto">
			<div style="width: 810px;padding-top:20px;margin: 0 auto;">
				<div class="step-container">
					<el-steps :active="active" align-center>
						<el-step title="基础设置"></el-step>
						<el-step title="公开奖项设置"></el-step>
					</el-steps>
				</div>
				<el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="240px" class="demo-ruleForm">
					<div class="section-title">作品公开权限设置</div>
					<template v-if="isCompare == 1">
						<el-form-item label="作品得票数是否公开" prop="isOpenVotes">
							{{ ruleForm.isOpenVotes == 1 ? '是' : '否' }}
						</el-form-item>
						<el-form-item label="获奖作品是否公开" prop="isOpenWin">
							{{ ruleForm.isOpenWin == 1 ? '是' : '否' }}
						</el-form-item>
						<el-form-item v-if="ruleForm.isOpenWin == 1" label="获奖作品奖项是否公开" prop="isOpenPrize">
							{{ ruleForm.isOpenPrize == 1 ? '是' : '否' }}
						</el-form-item>
					</template>
					<template v-if="isCompare == 2">
						<el-form-item label="作品是否公开" prop="isOpenWork">
							{{ ruleForm.isOpenWork == 1 ? '是' : '否' }}
						</el-form-item>
					</template>
					<el-form-item v-if="isCompare == 1 || ruleForm.isOpenWork == 1" label="作品是否可点赞" prop="isPraise">
						{{ ruleForm.isPraise == 1 ? '是' : '否' }}
					</el-form-item>
					<el-form-item v-if="isCompare == 1 || ruleForm.isOpenWork == 1" label="作品是否可评论" prop="isComment">
						{{ ruleForm.isComment == 1 ? '是' : '否' }}
					</el-form-item>
					<template v-if="isCompare == 1">
						<div class="section-title">评比投票数设置</div>
						<el-form-item label="教师可投票数" prop="jiaoshipiao">
							{{ ruleForm.thVoteNum }}
							&nbsp;&nbsp;&nbsp;&nbsp; 权重比
							<el-tooltip class="item" effect="dark" content="例：权重比为10，则投1票计数为10票。" placement="top">
								<i class="el-icon-question" />
							</el-tooltip>
							{{ ruleForm.thVoteWeight }}
						</el-form-item>
						<el-form-item label="学生可投票数" prop="xueshengpiao">
							{{ ruleForm.stuVoteNum }}
							&nbsp;&nbsp;&nbsp;&nbsp; 权重比
							<el-tooltip class="item" effect="dark" content="例：权重比为10，则投1票计数为10票。" placement="top">
								<i class="el-icon-question" />
							</el-tooltip>
							{{ ruleForm.stuVoteWeight }}
						</el-form-item>
						<div class="section-title">评比奖项设置</div>
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
							</el-table>
						</div>
					</template>
				</el-form>
			</div>
		</div>
	</div>
</template>

<script>
import Backtool from '@/components/BackTool'
import mixin from '@/mixins/windowResize'
import { getWonderfulActivityInfoById } from '@/api/matchActivity'

import { mapGetters } from 'vuex'

export default {
	components: {
		Backtool
	},
	computed: {
		...mapGetters(['userInfo'])
	},
	data() {
		return {
			id: this.$route.query.id,
			active: 2,

			isCompare: -1,
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
			})
	},
	methods: {}
}
</script>
<style scoped lang="scss">
@import '../../styles/mixin';

.section-title {
	line-height: 20px;
	font-size: 16px;
	border-left: 4px solid #409EFF;
	padding-left: 10px;
	margin-bottom: 22px;
	margin-left: 20px;
}

.header {
	padding-bottom: 10px;
	border-bottom: 1px solid #e7eaec;
}
.step-container {
	margin-bottom: 12px;
}
</style>
<style lang="scss">
@import '../../styles/mixin';
#matchActivityDetail2 {
	.el-form-item {
		margin-bottom: 12px;
	}
}
</style>
