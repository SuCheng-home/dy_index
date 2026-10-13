<template>
	<div class="app-container calendar-list-container" id="benifitsDetail">
		<backtool>
			<el-button type="primary" size="medium" @click.native="jumpToPage('benifitsAddEdit', { id })">编辑</el-button>
			<el-button type="primary" size="medium" :disabled="isLoading" :loading="isLoading" @click.native="releaseHandler" v-if="notExpriy && thWefareStatus === thWefareStatusEnum.thWefareStatus_NOT">发布</el-button>
			<address-book v-model="addressData" :config="configData" :isbutton="true" dataSuffix="List" v-if="notExpriy && thWefareStatus === thWefareStatusEnum.thWefareStatus_ALREADY">补发</address-book>
			<el-button type="primary" size="medium" @click.native="jumpToPage('benifitsReceiveAccounting', { id })" v-if="thWefareStatus === thWefareStatusEnum.thWefareStatus_ALREADY">查看领取统计</el-button>
		</backtool>
		<div :class="['page-main', isStandalone ? 'page-main--scroller' : '']" :style="`height: ${nobottommaxH}px;overflow: auto;`">
			<div class="ibox article" style="width:810px;margin:0 auto;">
				<div class="ibox-content" style="border-top-width: 0;">
					<div class="text-center article-title">
						<h1>{{ title }}</h1>
						<div class="sub-title">
							{{ createTime | trimTime }}
							<span v-if="!inscribe">{{ createUserName }}</span>
							<span class="departName" v-if="inscribe">{{ inscribe }}</span>
						</div>
						<div class="clear"></div>
					</div>
					<image-previewer tag="richtext">
						<div class="notice-content" v-html="content"></div>
					</image-previewer>
					<div class="row">
						<h2 style="color:#333333">福利登记截止时间</h2>
						<div>{{ expriyTime | trimTimeMinute }}</div>
					</div>
					<div class="row">
						<h2 style="color:#333333">
							福利物品
							<span v-if="!!maxVoteCount">（限选{{ maxVoteCount }}）</span>
						</h2>
						<div v-for="goodItem in goodsList">
							{{ goodItem.title }}
							<span v-if="goodItem.isSelected === 2">（必选）</span>
						</div>
					</div>
					<hr />
					<div class="row">
						<div class="col-lg-12">
							<h2 style="color:#333333">发放范围：</h2>
							<div class="social-feed-box">
								<div class="range-list">
									<template v-for="item in thScopeJson.departList">
										<div class="range-item">
											<span class="range-item-img" :style="{ backgroundImage: 'url(' + require('@/assets/images/depart.png') + ')' }" style="background-image: url(https://cdnfile-10043692.file.myqcloud.com/testimg/photo.jpg);"></span>
											<span class="range-item-des">{{ item.name }}</span>
										</div>
									</template>
									<template v-for="item in thScopeJson.groupList">
										<div class="range-item">
											<span class="range-item-img" :style="{ backgroundImage: 'url(' + require('@/assets/images/group.png') + ')' }" style="background-image: url(https://cdnfile-10043692.file.myqcloud.com/testimg/photo.jpg);"></span>
											<span class="range-item-des">{{ item.name }}</span>
										</div>
									</template>
									<template v-for="item in thScopeJson.userList">
										<div class="range-item">
											<span class="range-item-img" :style="{ backgroundImage: 'url(' + item.avatar + ')' }"></span>
											<span class="range-item-des">{{ item.name }}</span>
										</div>
									</template>
									<div class="clear"></div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import Backtool from '@/components/BackTool'
import ImagePreviewer from '@/components/ImagePreviewer/ImagePreviewer'
import AddressBook from '@/components/AddressBook/indexExpand'
import { thWefareStatusEnum } from './constants'

import moment from 'moment'

import { getThWelfare, againSendThWelfare, updateThWelfare } from '@/api/benifits'
import { mapGetters } from 'vuex'
import baseMixin from '@/mixins/baseMixin'
import mixin from '@/mixins/windowResize'

export default {
	name: 'benifitsDetail',
	data() {
		return {
			thWefareStatusEnum,
			id: this.$route.query.id,
			configData: {
				title: '选择发放范围',
				depart: { target: 'all', departType: 't', userTypes: '1' },
				group: true,
				notCheckSchool: true
			},
			addressData: {},
			content: '',
			title: '',
			createTime: '',
			createUserName: '',
			inscribe: '',
			thScopeJson: '',
			maxVoteCount: 0,
			thWefareStatus: 0,
			goodsList: [],
			expriyTime: '',
			wayType: 0,
			isLoading: false,
			notExpriy: true
		}
	},
	watch: {
		addressData(addressData) {
			if (addressData.departList.length !== 0 || addressData.userList.length !== 0 || addressData.groupList.length !== 0) {
				againSendThWelfare({
					id: this.id,
					sendUserType: 1,
					stuDepartJson: {},
					thScopeJson: addressData
				})
					.then(res => res.data)
					.then(data => {
						if (data.result) {
							this.$message({
								message: '补发成功！',
								type: 'success'
							})
							this.getNoticeInfoFunc()
						}
					})
			} else {
				this.$message.error('请选择补发人员！')
			}
		}
	},
	created() {
		getThWelfare({
			welfareId: this.id
		})
			.then(res => res.data)
			.then(data => {
				const pageData = data.data
				this.content = pageData.content
				this.title = pageData.title
				this.createTime = pageData.createTime
				this.createUserName = pageData.createUserName
				this.inscribe = pageData.inscribe
				this.thScopeJson = JSON.parse(pageData.thScopeJson)
				this.thWefareStatus = pageData.thWefareStatus
				this.maxVoteCount = pageData.maxVoteCount
				this.expriyTime = pageData.expriyTime
				this.notExpriy = !pageData.expriyTime || moment(pageData.expriyTime).format('YYYY-MM-DD HH:mm') > moment().format('YYYY-MM-DD HH:mm')

				this.goodsList = pageData.goodsList
				this.wayType = pageData.wayType
			})
	},
	computed: {
		...mapGetters(['isStandalone'])
	},
	filters: {
		trimTime(datetime) {
			return datetime ? datetime.slice(0, datetime.lastIndexOf('.')) : '--'
		},
		trimTimeMinute(datetime) {
			return datetime ? datetime.slice(0, datetime.lastIndexOf(':')) : '--'
		}
	},
	mixins: [baseMixin, mixin],
	components: { Backtool, ImagePreviewer, AddressBook },
	methods: {
		releaseHandler() {
			this.$confirm('是否发布此福利?', '发布', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {
				this.isLoading = true
				const args = {
					expriyTime: this.expriyTime ? moment(this.expriyTime).format('YYYY-MM-DD HH:mm') : '',
					goodsList: this.goodsList,
					inscribe: this.inscribe,
					maxVoteCount: this.maxVoteCount || 0,
					sendTime: moment().format('YYYY-MM-DD'),
					sendUserType: 1,
					stuDepartJson: {},
					thScopeJson: this.thScopeJson,
					thWefareStatus: 2,
					title: this.title,
					wayType: this.wayType,
					id: this.id,
					content: this.content
				}
				updateThWelfare(args)
					.then(res => res.data)
					.then(data => {
						if (data.result) {
							this.$message({
								type: 'success',
								message: '发布成功！'
							})
							this.$router.back()
						} else {
							this.$message.error(data.msg)
							this.isLoading = false
						}
					})
					.catch(error => {
						this.$message.error(error)
						this.isLoading = false
					})
			})
		}
	}
}
</script>

<style lang="scss" scoped>
.article {
	font-family: '宋体' !important;
	width: 80%;
	margin: 0 auto;
	font-size: 15px;
	line-height: 26px;
	color: #5f5f5f;
	word-wrap: break-word;
	word-break: break-all;
}

.article h1 {
	font-size: 38px;
	color: rgb(47, 64, 80);
	line-height: 1.1em;
}

.article h2 {
	font-size: 16px;
	color: rgb(47, 64, 80);
	text-align: left;
}

.article hr {
	height: 1px;
	border: 0;
	border-top: 1px solid #d0d0d0;
}
.article-title {
	text-align: center;
}
.article p {
	font-size: 15px;
	line-height: 26px;
	color: #676a6c;
	word-wrap: break-word;
	word-break: break-all;
}

.sub-title {
	text-align: right;
	color: #676a6c;
}

.hasread-small {
	border: 1px solid #e7eaec;
	padding: 2px;
	border-radius: 2px;
	display: inline-block;
	padding-right: 4px;
}

.notice-content {
	min-height: 100px;
}

.has-img {
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
	margin-left: 4px;
	margin-top: 4px;
	margin-right: 20px;
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
	color: #676a6c;
	font-size: 13px;
}

.social-feed-box {
	border: 1px solid #e7eaec;
	background: #fff;
	margin-bottom: 15px;
}

.image {
	max-width: 50% !important;
}

.video {
	max-width: 50% !important;
}

.departName {
	padding: 2px 4px;
}

.img-item {
	width: 160px;
	height: 200px;
	float: left;
	margin-right: 10px;
	margin-top: 10px;
}
.page-main--scroller {
	overflow-y: auto;
	height: 600px;
	overflow-x: hidden;
}
.page-main--scroller::-webkit-scrollbar {
	width: 6px;
}
.page-main--scroller::-webkit-scrollbar-thumb {
	background: #99a9bf;
	border-radius: 20px;
}
.page-main--scroller::-webkit-scrollbar-track-piece {
	background: #d3dce6;
}
</style>
<style lang="scss">
#benifitsDetail {
	.notice-content a {
		color: #337ab7 !important;
		text-decoration: underline !important;
	}

	.notice-content img {
		display: block;
		max-width: 100%;
	}

	.notice-content ol,
	.notice-content ul {
		padding-left: 30px;
	}

	.notice-content td,
	.notice-content th {
		padding: 5px 10px;
		border: 1px solid #ddd;
	}

	.notice-content p {
		margin: 0 0 10px;
	}

	.notice-content table {
		border-collapse: collapse;
		border-spacing: 0;
		margin-bottom: 10px;
	}
}
</style>
