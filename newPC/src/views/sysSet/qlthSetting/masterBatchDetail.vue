<template>
	<div class="detail-allCon">
		<el-button class="detail-backBtn" size="medium" @click="$router.back()">返回</el-button>
		<el-button class="detail-backBtn" size="medium" type="primary" @click="downAllFiles" v-if="!isCanDownload">批量下载</el-button>
		<div class="cutLineDetail"></div>

		<div class="detail-con">
			<div class="state-icon">
				<div class="success" v-if="$route.query.state === 3">
					已出师
				</div>
				<div class="noStart" v-if="$route.query.state === 1">
					未开始
				</div>
				<div class="hasStart" v-if="$route.query.state === 2">
					进行中
				</div>
			</div>
			<div class="detail-titleCon">
				<div class="detail-titleConLeft"></div>
				<div class="detail-titleConText">师徒详情</div>
			</div>
			<div class="detail-list">
				<div style="display:flex">
					<div class="detail-listCon detail-listCon1">
						<div class="detail-listConLeft">师：</div>
						<div>
							{{ $route.query.masterName }}
						</div>
					</div>
					<div class="detail-listCon detail-listCon1">
						<div class="detail-listConLeft">徒：</div>
						<div>{{ $route.query.prenticeName }}</div>
					</div>
				</div>
				<div class="detail-listCon">
					<div class="detail-listConLeft">批次：</div>
					<div>{{ batchDetail.name }}</div>
				</div>
				<div class="detail-listCon">
					<div class="detail-listConLeft">建立时间：</div>
					<div>{{ $route.query.createTime || '--' }}</div>
				</div>
				<div class="detail-listCon">
					<div class="detail-listConLeft">出师时间：</div>
					<div>{{ $route.query.finishTime || '--' }}</div>
				</div>
			</div>
			<div class="detail-titleCon">
				<div class="detail-titleConLeft"></div>
				<div class="detail-titleConText">培养计划</div>
			</div>
			<div class="detail-list">
				<div class="detail-listCon">
					<!-- <div class="detail-listConLeft">模板：</div> -->
					<div v-if="planFileJson && planFileJson.length" style="padding-left:20px">
						<!-- <div v-for="(item, index) in planFileJson" :key="index" style="display:flex; margin-bottom: 10px">
							<a :href="item.accessUrl" download="">
								<i class="el-icon-document" style="font-size:18px;margin-right: 5px"></i>
								{{ item.fileName }}
							</a>
						</div> -->
						<file-list :fileList="planFileJson" :isShowTitle="false"></file-list>
					</div>
					<div v-else>暂无培养计划</div>
				</div>
			</div>
			<div class="detail-titleCon">
				<div class="detail-titleConLeft"></div>
				<div class="detail-titleConText">听课记录</div>
			</div>
			<el-table :data="listenRecordList" :height="maxH" style="width: 100%" border>
				<!-- <el-table-column type="selection" align="center" width="55"></el-table-column> -->
				<el-table-column label="上课人" align="center" show-overflow-tooltip>
					<template slot-scope="scope">
						<span>{{ scope.row.type === 2 ? scope.row.masterName : scope.row.prenticeName }}</span>
					</template>
				</el-table-column>
				<el-table-column label="上课主题" align="center" prop="title"></el-table-column>
				<el-table-column label="听课人" align="center">
					<template slot-scope="scope">
						<span>{{ scope.row.type === 2 ? scope.row.prenticeName : scope.row.masterName }}</span>
					</template>
				</el-table-column>
				<el-table-column label="听课时间" align="center">
					<template slot-scope="scope">
						<span>{{ scope.row.classDate + ' ' + (scope.row.morningOrAfternoon === 1 ? '上午' : '下午') }}</span>
					</template>
				</el-table-column>
				<el-table-column label="听课评价" align="center" show-overflow-tooltip>
					<template slot-scope="scope">
						<span>{{ scope.row.evaluateName || '--' }}</span>
					</template>
			</el-table-column>
				<el-table-column label="听课印象" align="center" show-overflow-tooltip>
					<template slot-scope="scope">
						<span>{{ scope.row.listenRemark || '--' }}</span>
					</template>
				</el-table-column>
				<el-table-column label="图片" align="center">
					<template slot-scope="scope">
						<image-previewer class="link" v-if="scope.row.picJson && JSON.parse(scope.row.picJson).length" :images="getImageArr(scope.row.picJson)" tag="img" text="查看图片"></image-previewer>
						<span v-else>--</span>
					</template>
				</el-table-column>
			</el-table>
			<div class="detail-titleCon">
				<div class="detail-titleConLeft"></div>
				<div class="detail-titleConText">帮扶记录</div>
			</div>
			<div class="detail-list">
				<div class="detail-listCon">
					<!-- <div class="detail-listConLeft">模板：</div> -->
					<div v-if="recordFileJson && recordFileJson.length" style="padding-left:20px">
						<!-- <div v-for="(item, index) in recordFileJson" :key="index" style="display:flex; margin-bottom: 10px">
							<a :href="item.accessUrl" download="">
								<i class="el-icon-document" style="margin-right: 5px;font-size:18px"></i>
								{{ item.fileName }}
							</a>
						</div> -->
						<file-list :fileList="recordFileJson" :isShowTitle="false"></file-list>
					</div>
					<div v-else>暂无帮扶记录</div>
				</div>
			</div>
			<div class="detail-titleCon">
				<div class="detail-titleConLeft"></div>
				<div class="detail-titleConText">学习总结</div>
			</div>
			<div class="detail-list">
				<div class="detail-listCon">
					<!-- <div class="detail-listConLeft">模板：</div> -->
					<div v-if="sumFileJson && sumFileJson.length" style="padding-left:20px">
						<!-- <div v-for="(item, index) in sumFileJson" :key="index" style="display:flex; margin-bottom: 10px">
							<a :href="item.accessUrl" download="">
								<i class="el-icon-document" style="margin-right: 5px;font-size:18px"></i>
								{{ item.fileName }}
							</a>
						</div> -->
						<file-list :fileList="sumFileJson" :isShowTitle="false"></file-list>
					</div>
					<div v-else>暂无学习总结</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import _ from 'lodash'
import FileList from './FileList.vue'

// import uploader from '../uploader'
import { getCyanBlueBatchDetailByMasterPrentice } from '@/api/qlthSetting'
import ImagePreviewer from '@/components/ImagePreviewer/ImagePreviewer.vue'

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
			isCanDownload: false,
			listenRecordList: [],
			batchDetail: '',
			sumFileJson: [],
			planFileJson: [],
			recordFileJson: []
		}
	},
	components: {
		ImagePreviewer,
		FileList
	},
	computed: {
		master() {
			if (this.batchDetail) return this.batchDetail.masterPrenticeList.map(({ masterName }) => masterName).join(',')
		},
		prentice() {
			if (this.batchDetail) return this.batchDetail.masterPrenticeList.map(({ prenticeName }) => prenticeName).join(',')
		},

		getImageArr() {
			return function(val) {
				return JSON.parse(val).map(v => {
					return { src: v.accessUrl || v.picUrl || v.url }
				})
			}
		}
	},
	created() {
		this.getCyanBlueBatchDetailByMasterPrentice()
	},
	methods: {
		downAllFiles() {
			let count = 0
			this.sumFileJson &&
				this.sumFileJson.forEach(fileItem => {
					var hiddenIFrameID = 'hiddenDownloader' + count++
					var iframe = document.createElement('iframe')
					iframe.id = hiddenIFrameID
					iframe.style.display = 'none'
					document.body.appendChild(iframe)
					iframe.src = fileItem.accessUrl || fileItem.fileUrl //直接下载，不会弹出新的页面
					document.body.appendChild(iframe) // 这一行必须，iframe挂在到dom树上才会发请求
				})
			this.planFileJson &&
				this.planFileJson.forEach(fileItem => {
					var hiddenIFrameID = 'hiddenDownloader' + count++
					var iframe = document.createElement('iframe')
					iframe.id = hiddenIFrameID
					iframe.style.display = 'none'
					document.body.appendChild(iframe)
					iframe.src = fileItem.accessUrl || fileItem.fileUrl //直接下载，不会弹出新的页面
					document.body.appendChild(iframe) // 这一行必须，iframe挂在到dom树上才会发请求
				})
			this.recordFileJson &&
				this.recordFileJson.forEach(fileItem => {
					var hiddenIFrameID = 'hiddenDownloader' + count++
					var iframe = document.createElement('iframe')
					iframe.id = hiddenIFrameID
					iframe.style.display = 'none'
					document.body.appendChild(iframe)
					iframe.src = fileItem.accessUrl || fileItem.fileUrl //直接下载，不会弹出新的页面
					document.body.appendChild(iframe) // 这一行必须，iframe挂在到dom树上才会发请求
				})
		},
		getCyanBlueBatchDetailByMasterPrentice() {
			getCyanBlueBatchDetailByMasterPrentice({ batchId: this.$route.query.id, masterId: this.$route.query.masterId, prenticeId: this.$route.query.prenticeId }).then(res => {
				this.batchDetail = res.data.data.batch
				this.planFileJson = res.data.data.planRecordSumList[0].fileJson ? JSON.parse(res.data.data.planRecordSumList[0].fileJson) : []
				this.recordFileJson = res.data.data.planRecordSumList[1].fileJson ? JSON.parse(res.data.data.planRecordSumList[1].fileJson) : []
				this.sumFileJson = res.data.data.planRecordSumList[2].fileJson ? JSON.parse(res.data.data.planRecordSumList[2].fileJson) : []
				this.isCanDownload = !this.planFileJson.length && !this.recordFileJson.length && !this.sumFileJson.length
				this.listenRecordList = res.data.data.classRecordList
			})
		},
		//返回
		LinkToBack() {
			this.$router.back()
		}
	}
}
</script>

<style lang="scss" scoped>
.batchDetail {
	width: 800px;
	margin: 20px auto;
	color: #666;
	font-size: 14px;
	.mb-20 {
		margin-bottom: 20px;
	}
	.title {
		font-weight: bold;
	}
	.batchDetail-relation {
		display: flex;
	}
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
	position: relative;
}
.state-icon {
	position: absolute;
	right: -100px;

	.success {
		border-radius: 5px;
		width: 80px;
		height: 40px;
		text-align: center;
		line-height: 40px;
		color: #67c23a;
		background: #f0f9eb;
		border: 1px solid #c2e7b0;
		font-size: 20px;
	}
	.noStart {
		border-radius: 5px;
		width: 80px;
		height: 40px;
		text-align: center;
		line-height: 40px;
		color: #e6a23c;
		background: #fdf6ec;
		border: 1px solid #f5dab1;
		font-size: 20px;
	}
	.hasStart {
		border-radius: 5px;
		width: 80px;
		height: 40px;
		text-align: center;
		line-height: 40px;
		color: #409eff;
		background: 1px solid #647a94;
		border: 1px solid #b3d8ff;
		font-size: 20px;
	}
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
	margin: 10px 0;
}
.detail-listCon {
	display: flex;
	min-width: 500px;
	margin: 0 0 24px 0;
	color: #666;
	font-size: 14px;
}
.detail-listCon1 {
	min-width: 200px;
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
	padding: 15px;
	padding-bottom: 20px;
}
.detail-stepsFirst {
	width: 350px;
}
.detail-stepsCon .detail-stepsDate {
	color: #909399;
}
</style>
