<template>
	<div class="common_wrap">
		<div class="header">
			<el-row>
				<el-col :span="19">
					<el-button size="medium" @click="$router.back()">返回</el-button>
					<el-button size="medium" type="primary" v-if="dataList.length" @click="exportExcel('#helpTable', `青蓝同辉学习总结.xlsx`)">导出</el-button>
					<el-button size="medium" type="primary" @click="downAllFiles" v-if="isHasFile">下载</el-button>
					<el-button size="medium" type="primary" v-if="isManager" @click="publishNotReport">提醒未上报用户</el-button>
				</el-col>
				<!-- <el-col :span="5">
					<el-input size="medium" placeholder="请输入师傅/徒弟" v-model="searchName" @keyup.enter.native="searchList">
						<el-button slot="append" icon="el-icon-search" size="medium" @click="searchList"></el-button>
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
			<el-table-column label="学习总结" align="center">
				<template slot-scope="scope">
					<div v-if="scope.row.fileJson && JSON.parse(scope.row.fileJson).length">
						<file-list :fileList="JSON.parse(scope.row.fileJson)" :smallWidth="true" :isShowTitle="false"></file-list>
					</div>
					<span v-else>
						--
					</span>
				</template>
			</el-table-column>
		</el-table>
		<div style="display: none;" id="helpTable">
			<el-table :data="dataList" :height="maxH - 37" style="width: 100%" border>
				<el-table-column label="师傅" align="center" show-overflow-tooltip>
					<template slot-scope="scope">
						<span class="link">{{ scope.row.masterName }}</span>
					</template>
				</el-table-column>
				<el-table-column label="徒弟" align="center" prop="prenticeName"></el-table-column>
				<el-table-column label="上报时间" align="center">
					<template slot-scope="scope">
						<span>{{ scope.row.reportTime || '--' }}</span>
					</template>
				</el-table-column>
				<el-table-column label="学习总结" align="center">
					<template slot-scope="scope">
						<div v-if="scope.row.fileJson && JSON.parse(scope.row.fileJson).length">
							<file-list :fileList="JSON.parse(scope.row.fileJson)" :smallWidth="true" :isShowTitle="false"></file-list>
						</div>
						<span v-else>
							--
						</span>
					</template>
				</el-table-column>
			</el-table>
		</div>
	</div>
</template>

<script>
import windowResize from '@/mixins/windowResize'
import baseMixin from '@/mixins/baseMixin'
import { getCyanBlueBatchPlanRecordSumListByManager, publishNotReport, possessRole } from '@/api/qlthSetting'
import FileList from './FileList.vue'

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
				type: 3
			}).then(res => {
				this.$message.success('提醒未上报用户成功！')
			})
		},
		getCyanBlueBatchPlanRecordSumListByManager() {
			getCyanBlueBatchPlanRecordSumListByManager({
				batchId: this.id,
				type: 3
			}).then(res => {
				this.dataList = res.data.data
				this.isHasFile = this.dataList.some(v => v.fileList.length)
			})
		},
		searchList() {
			this.pagination.pageNo = 1
			this.queryListFunc()
		},
		sizeChangeHandler() {
			this.pagination.pageNo = 1
			this.queryListFunc()
		},
		currentChangeHandler() {
			this.getCyanBlueBatchPlanRecordSumListByManager()
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
