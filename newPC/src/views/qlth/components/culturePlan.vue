<template>
	<div class="common_wrap">
		<div class="header">
			<el-row>
				<el-col :span="19">
					<el-button size="medium" @click="$router.back()">返回</el-button>
					<el-button size="medium" type="primary" v-if="dataList.length" @click="exportExcel('#planTable', `青蓝同辉培养计划.xlsx`)">导出</el-button>
					<el-button size="medium" type="primary" @click="downAllFiles" v-if="isHasFile">下载</el-button>

					<el-button v-if="isManager" size="medium" type="primary" @click="publishNotReport">提醒未上报用户</el-button>
				</el-col>
				<!-- <el-col :span="5">
					<el-input size="medium" placeholder="请输入师傅/徒弟" v-model="searchName" @keyup.enter.native="getCyanBlueBatchPlanRecordSumListByManager">
						<el-button slot="append" icon="el-icon-search" size="medium" @click="getCyanBlueBatchPlanRecordSumListByManager"></el-button>
					</el-input>
				</el-col> -->
			</el-row>
		</div>
		<el-table :data="dataList" :height="maxH - 37" style="width: 100%" border>
			<el-table-column label="师傅" align="center" show-overflow-tooltip>
				<template slot-scope="scope">
					<span>{{ scope.row.masterName }}</span>
				</template>
			</el-table-column>
			<el-table-column label="徒弟" align="center" prop="prenticeName"></el-table-column>
			<el-table-column label="上报时间" align="center">
				<template slot-scope="scope">
					<span>{{ scope.row.reportTime || '--' }}</span>
				</template>
			</el-table-column>
			<el-table-column label="培养计划" align="center">
				<template slot-scope="scope">
					<div v-if="scope.row.fileJson && JSON.parse(scope.row.fileJson).length">
						<file-list :fileList="JSON.parse(scope.row.fileJson)" :smallWidth="true" :isShowTitle="false"></file-list>
					</div>
					<div v-else>
						<span>--</span>
					</div>
				</template>
			</el-table-column>
		</el-table>
		<div style="display: none;" id="planTable">
			<el-table :data="dataList" :height="maxH - 37" style="width: 100%" border>
				<el-table-column label="师傅" align="center" show-overflow-tooltip>
					<template slot-scope="scope">
						<span class="link">{{ scope.row.masterName }}</span>
					</template>
				</el-table-column>
				<el-table-column label="徒弟" align="center" prop="prenticeName"></el-table-column>
				<el-table-column label="上报时间" align="center">
					<template slot-scope="scope">
						<span>{{ scope.row.reportTime }}</span>
					</template>
				</el-table-column>
				<el-table-column label="培养计划" align="center">
					<template slot-scope="scope">
						<div v-if="scope.row.fileJson && JSON.parse(scope.row.fileJson).length">
							<file-list :fileList="JSON.parse(scope.row.fileJson)" :isShowTitle="false"></file-list>
						</div>
						<!-- <div v-if="scope.row.fileJson && scope.row.fileJson.length">
							<span class="planfile link" @click="downAloneFiles(scope.row.fileJson)" v-for="(item, index) in JSON.parse(scope.row.fileJson)" :key="index + 'file'">{{ item.fileName }}&nbsp;</span>
						</div> -->
						<div v-else>
							<span>--</span>
						</div>
					</template>
				</el-table-column>
			</el-table>
		</div>
	</div>
</template>

<script>
import windowResize from '@/mixins/windowResize'
import FileList from './FileList.vue'

import baseMixin from '@/mixins/baseMixin'
import { getCyanBlueBatchPlanRecordSumListByManager, publishNotReport, possessRole } from '@/api/qlthSetting'
export default {
	name: 'commonList',
	props: {
		id: {
			type: String,
			default: ''
		}
	},
	data() {
		return {
			isManager: false,
			isHasFile: false,
			exportUrl: '',
			searchName: '',
			dataList: [],
			pagination: {
				pageSize: 10,
				pages: 1,
				total: 0
			}
		}
	},
	components: {
		FileList
	},
	created() {
		this.getCyanBlueBatchPlanRecordSumListByManager()
		this.possessRole()
	},
	mixins: [windowResize, baseMixin],
	methods: {
		possessRole() {
			possessRole(this.$store.getters.userInfo.id).then(res => {
				this.isManager = res.data.data.result
			})
		},
		downAllFiles() {
			let count = 0
			this.dataList.forEach(v => {
				v.fileJson &&
					v.fileJson.length &&
					JSON.parse(v.fileJson).forEach(fileItem => {
						const x = new window.XMLHttpRequest()
						x.open('GET', fileItem.accessUrl, true)
						x.responseType = 'blob' // 选择返回格式为blob
						x.onload = () => {
							const url = window.URL.createObjectURL(x.response) //将后端返回的blob文件读取出url

							console.log('blob====', x.response)
							console.log('url====', url)

							// url可以预览和下载

							const a = document.createElement('a')
							a.href = url
							a.download = fileItem.fileName
							a.click()
						}
						x.send()
					})
			})
		},
		downAloneFiles(val) {
			let count = 0
			JSON.parse(val).forEach(fileItem => {
				// var hiddenIFrameID = 'hiddenDownloader' + count++
				// var iframe = document.createElement('iframe')
				// iframe.id = hiddenIFrameID
				// iframe.style.display = 'none'
				// document.body.appendChild(iframe)
				// iframe.src = fileItem.accessUrl || fileItem.fileUrl //直接下载，不会弹出新的页面
				// document.body.appendChild(iframe) // 这一行必须，iframe挂在到dom树上才会发请求

				const x = new window.XMLHttpRequest()
				x.open('GET', fileItem.accessUrl, true)
				x.responseType = 'blob' // 选择返回格式为blob
				x.onload = () => {
					const url = window.URL.createObjectURL(x.response) //将后端返回的blob文件读取出url

					console.log('blob====', x.response)
					console.log('url====', url)

					// url可以预览和下载

					const a = document.createElement('a')
					a.href = url
					a.download = fileItem.fileName
					a.click()
				}
				x.send()
			})
		},
		publishNotReport() {
			publishNotReport({
				batchId: this.id,
				type: 1
			}).then(res => {
				this.$message.success('提醒未上报用户成功！')
			})
		},
		getCyanBlueBatchPlanRecordSumListByManager() {
			getCyanBlueBatchPlanRecordSumListByManager({
				batchId: this.id,
				type: 1
			}).then(res => {
				this.dataList = res.data.data
				this.isHasFile = this.dataList.some(v => v.fileList.length)
			})
		}
	}
}
</script>
<style lang="scss" scoped>
.common_wrap {
	.header {
		padding-bottom: 10px;
		overflow: hidden;
	}
	.planfile:hover {
		color: blue;
		cursor: pointer;
	}
	.pagination-container {
		margin-top: 10px;
	}
}
</style>
