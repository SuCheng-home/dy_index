<template>
	<div class="detail-allCon">
		<el-button class="detail-backBtn" size="medium" @click="$router.back()">返回</el-button>
		<span v-if="isManager">
			<el-button class="detail-backBtn" size="medium" type="primary" @click="toAddPage" v-if="isShowButton">编辑</el-button>
			<el-button class="detail-backBtn" size="medium" @click="publishBatch(2)" type="primary" v-if="batchDetail.planState === 1 && isShowButton">培养计划上传通知</el-button>
			<el-button class="detail-backBtn" size="medium" @click="publishBatch(3)" type="primary" v-if="batchDetail.recordState === 1 && isShowButton">帮扶记录上传通知</el-button>
			<el-button class="detail-backBtn" size="medium" @click="publishBatch(4)" type="primary" v-if="batchDetail.sumState === 1 && isShowButton">学习总结上传通知</el-button>
		</span>

		<div class="cutLineDetail"></div>
		<div class="detail-con">
			<div class="detail-titleCon">
				<div class="detail-titleConLeft"></div>
				<div class="detail-titleConText">培养计划上传通知</div>
			</div>
			<div class="detail-list">
				<div class="detail-listCon">
					<div class="detail-listConLeft">批次：</div>
					<div>{{ batchDetail.name }}</div>
				</div>
				<div class="detail-listCon">
					<div class="detail-listConLeft">通知人员：</div>
					<div>{{ master }}</div>
				</div>
				<div class="detail-listCon">
					<div class="detail-listConLeft">上报开始日期：</div>
					<div>{{ batchDetail.planStartDate }}</div>
				</div>
				<div class="detail-listCon">
					<div class="detail-listConLeft">上报截止日期：</div>
					<div>{{ batchDetail.planEndDate }}</div>
				</div>
				<div class="detail-listCon">
					<div class="detail-listConLeft">备注：</div>
					<div>{{ batchDetail.planRemark || '--' }}</div>
				</div>
				<div class="detail-listCon">
					<div class="detail-listConLeft">模板：</div>
					<div v-if="planFileJson.length">
						<file-list :fileList="planFileJson" :isShowTitle="false"></file-list>
					</div>
					<div v-else>--</div>
				</div>
			</div>
			<div class="detail-titleCon">
				<div class="detail-titleConLeft"></div>
				<div class="detail-titleConText">帮扶记录上传通知</div>
			</div>
			<div class="detail-list">
				<div class="detail-listCon">
					<div class="detail-listConLeft">批次：</div>
					<div>{{ batchDetail.name }}</div>
				</div>
				<div class="detail-listCon">
					<div class="detail-listConLeft">通知人员：</div>
					<div>{{ master }}</div>
				</div>
				<div class="detail-listCon">
					<div class="detail-listConLeft">上报开始日期：</div>
					<div>{{ batchDetail.recordStartDate }}</div>
				</div>
				<div class="detail-listCon">
					<div class="detail-listConLeft">上报截止日期：</div>
					<div>{{ batchDetail.recordEndDate }}</div>
				</div>
				<div class="detail-listCon">
					<div class="detail-listConLeft">备注：</div>
					<div>{{ batchDetail.recordRemark || '--' }}</div>
				</div>
				<div class="detail-listCon">
					<div class="detail-listConLeft">模板：</div>
					<div v-if="recordFileJson.length">
						<!-- <div v-for="(item, index) in recordFileJson" :key="index" style="display:flex;margin-bottom: 10px">
							<a :href="item.accessUrl" download="" style="display: flex;align-items:center;">
								<div class="img_box" :class="`${getImgType(item.fileName)}-icon`" style="margin-right: 10px"></div>
								{{ item.fileName }}
							</a>
						</div> -->
						<file-list :fileList="recordFileJson" :isShowTitle="false"></file-list>
					</div>
					<div v-else>--</div>
				</div>
			</div>
			<div class="detail-titleCon">
				<div class="detail-titleConLeft"></div>
				<div class="detail-titleConText">学习总结上传通知</div>
			</div>
			<div class="detail-list">
				<div class="detail-listCon">
					<div class="detail-listConLeft">批次：</div>
					<div>{{ batchDetail.name }}</div>
				</div>
				<div class="detail-listCon">
					<div class="detail-listConLeft">通知人员：</div>
					<div>{{ prentice }}</div>
				</div>
				<div class="detail-listCon">
					<div class="detail-listConLeft">上报开始日期：</div>
					<div>{{ batchDetail.sumStartDate }}</div>
				</div>
				<div class="detail-listCon">
					<div class="detail-listConLeft">上报截止日期：</div>
					<div>{{ batchDetail.sumEndDate }}</div>
				</div>
				<div class="detail-listCon">
					<div class="detail-listConLeft">备注：</div>
					<div>{{ batchDetail.sumRemark || '--' }}</div>
				</div>
				<div class="detail-listCon">
					<div class="detail-listConLeft">模板：</div>
					<div v-if="sumFileJson.length">
						<!-- <div v-for="(item, index) in sumFileJson" :key="index" style="display:flex;margin-bottom: 10px">
							<a :href="item.accessUrl" download="" style="display: flex;align-items:center;">
								<div class="img_box" :class="`${getImgType(item.fileName)}-icon`" style="margin-right: 10px"></div>
								{{ item.fileName }}
							</a>
						</div> -->
						<file-list :fileList="sumFileJson" :isShowTitle="false"></file-list>
					</div>
					<div v-else>--</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import _ from 'lodash'
import uploader from '../uploader'
import FileList from '@/components/FileList/FileList.vue'

import { getCyanBlueBatchById, publishBatch, possessRole } from '@/api/qlthSetting'
export default {
	props: {
		id: {
			type: String,
			default: ''
		},
		isShowButton: {
			type: Boolean,
			default: true
		}
	},
	data() {
		return {
			batchDetail: '',
			sumFileJson: [],
			planFileJson: [],
			recordFileJson: [],
			isManager: false
		}
	},
	components: {
		uploader,
		FileList
	},
	computed: {
		master() {
			if (this.batchDetail) return this.batchDetail.masterPrenticeList.map(({ masterName }) => masterName).join(',')
		},
		prentice() {
			if (this.batchDetail) return this.batchDetail.masterPrenticeList.map(({ prenticeName }) => prenticeName).join(',')
		}
	},
	created() {
		this.getCyanBlueBatchById()
		this.possessRole()
	},
	methods: {
		possessRole() {
			possessRole(this.$store.getters.userInfo.id).then(res => {
				this.isManager = res.data.data.result
			})
		},
		getImgType(url) {
			const videoTypes = ['mp4', '3gp', 'rmvb', 'rm', 'mov', 'avi', 'flv', 'mpeg', 'wmv']
			const picTypes = ['png', 'bmp', 'jpg', 'jpeg', 'gif']
			url = url || ''
			// 图片等返回url，其他的返回对应的文件类型的图标和类型
			const fileExt = url.replace(/.+\./, '').toLowerCase() //正则表达式获取后缀
			let cover = ''
			if (videoTypes.indexOf(fileExt) > -1) {
				cover = 'mp4'
			} else if (picTypes.indexOf(fileExt) > -1) {
				cover = 'pic'
			} else {
				cover = fileExt
			}
			console.log(cover)
			return cover // 返回文件类型对应的图片class
		},
		publishBatch(type) {
			let msgText = ''
			switch (type) {
				case 2:
					msgText = '确认发布培养计划上传通知吗？'
					break
				case 3:
					msgText = '确认发布帮扶记录上传通知吗？'
					break
				case 4:
					msgText = '确认发布学习总结上传通知吗？'
					break
			}
			this.$confirm(msgText, '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			})
				.then(() => {
					publishBatch({ batchId: this.$route.query.id, type: type }).then(res => {
						this.getCyanBlueBatchById()
						this.$message.success('发布成功！')
					})
				})
				.catch(() => {
					this.$message({
						type: 'info',
						message: '已取消操作！'
					})
				})
		},
		toAddPage() {
			this.$router.push({ path: 'batchAdd', query: { id: this.$route.query.id } })
		},
		getCyanBlueBatchById() {
			getCyanBlueBatchById({ batchId: this.$route.query.id }).then(res => {
				this.batchDetail = res.data.data
				this.sumFileJson = res.data.data.sumFileJson ? JSON.parse(res.data.data.sumFileJson) : []
				this.planFileJson = res.data.data.planFileJson ? JSON.parse(res.data.data.planFileJson) : []
				this.recordFileJson = res.data.data.recordFileJson ? JSON.parse(res.data.data.recordFileJson) : []
				console.log(this.planFileJson)
			})
		},
		//返回
		LinkToBack() {
			this.$router.back()
		}
	}
}
</script>

<style scoped>
.img_box {
	width: 24px;
	height: 24px;
	margin: 1px;
	background: url('https://cdnfile-10043692.file.myqcloud.com/file-icons.png') no-repeat;
	background-position: 0 -86px;
	background-size: 68px 680px;
}
.ppt-icon {
	background-position: 0 0;
}

.pptx-icon {
	background-position: 0 0;
}

.mp4-icon {
	background-position: 0 -43px;
}

.zip-icon {
	background-position: 0 -129px;
}

.rar-icon {
	background-position: 0 -129px;
}

.pic-icon {
	background-position: 0 -258.5px;
}

.doc-icon {
	background-position: 0 -301.5px;
}

.docx-icon {
	background-position: 0 -301.5px;
}

.xls-icon {
	background-position: 0 -344.5px;
}

.xlsx-icon {
	background-position: 0 -344.5px;
}

.pdf-icon {
	background-position: 0 -387.5px;
}

.txt-icon {
	background-position: 0 -430.5px;
}

.mp3-icon {
	background-position: 0 -474px;
}
.cutLineDetail {
	width: 100%;
	height: 1px;
	background: #dcdfe6;
	margin: 10px 0;
}
.detail-con {
	margin: 20px auto;
	width: 800px;
}
.detail-titleCon {
	display: flex;
	margin-top: 20px;
	height: 40px;
	align-items: center;
	background: #f7f7f7;
}
.detail-titleConLeft {
	width: 3px;
	height: 20px;
	background: #409eff;
	margin-right: 10px;
}
.detail-titleConText {
	line-height: 20px;
	font-size: 16px;
	font-weight: 600;
}
.detail-list {
	width: 300px;
	margin: 10px 0;
}
.detail-listCon {
	display: flex;
	min-width: 700px;
	margin: 24px 0;
	color: #666;
	font-size: 14px;
}
.detail-listCon .file-name:hover {
	text-decoration: underline;
	cursor: pointer;
	color: blue;
}
.detail-listConLeft {
	width: 100px;
	font-weight: bold;
	text-align: right;
	margin-right: 15px;
}
.detail-leftText {
	color: #666;
	margin: 10px 0 20px 10px;
}
.detail-stepsCon {
	background: #f2f6fa;
	margin-top: 20px;
	padding-bottom: 10px;
}
.detail-stepsTop {
	display: flex;
	justify-content: space-between;
}
.detail-stepsTop div {
	color: #666;
	margin: 10px;
}
.detail-stepsBottom {
	color: #666;
	margin: 0 0 10px 10px;
}
.detail-allCon {
	background: #fff;
	height: auto;
	padding-bottom: 20px;
}
.detail-stepsFirst {
	width: 350px;
}
.detail-stepsCon .detail-stepsDate {
	color: #909399;
}
</style>
