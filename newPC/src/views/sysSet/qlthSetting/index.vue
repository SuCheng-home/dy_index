<template>
	<div class="common_wrap">
		<div class="header">
			<el-row>
				<el-col :span="19">
					<el-select v-model="state" size="medium" placeholder="请选择" @change="queryListFunc">
						<el-option v-for="item in stateList" :key="item.value" :label="item.label" :value="item.value"></el-option>
					</el-select>
					<el-select v-model="batchState" size="medium" placeholder="请选择" @change="queryListFunc">
						<el-option label="全部进度" value="0"></el-option>
						<el-option label="草稿" value="1"></el-option>
						<el-option label="培养计划" value="2"></el-option>
						<el-option label="帮扶记录" value="3"></el-option>
						<el-option label="学习总结" value="4"></el-option>
					</el-select>
					<el-button size="medium" type="primary" @click="toAddPage">新增</el-button>

					<el-button type="primary" size="medium" @click="$router.push('qlthSettingImportPage')">导入</el-button>
					<a target="_blank" :href="exportUrl" download="">
						<el-button type="primary" size="medium">导出</el-button>
					</a>
					<!-- <el-button type="primary" size="medium">老师统计</el-button> -->
					<!-- <el-button size="medium" type="danger" @click="batchDeleteHandler">删除</el-button> -->
				</el-col>
				<el-col :span="5">
					<el-input size="medium" placeholder="请输入师傅/徒弟姓名/批次名称" v-model="searchName" @keyup.enter.native="searchList">
						<el-button slot="append" icon="el-icon-search" size="medium" @click="searchList"></el-button>
					</el-input>
				</el-col>
			</el-row>
		</div>
		<el-table :data="dataList" :height="maxH" style="width: 100%" border>
			<!-- <el-table-column type="selection" align="center" width="55"></el-table-column> -->
			<el-table-column label="师傅姓名" align="center" show-overflow-tooltip>
				<template slot-scope="scope">
					<span @click="toMasterDetail(scope.row)" class="link" v-if="scope.row.batchId">{{ scope.row.masterName }}</span>
					<span v-else>{{ scope.row.masterName }}</span>
				</template>
			</el-table-column>
			<el-table-column label="徒弟姓名" align="center" prop="prenticeName"></el-table-column>
			<el-table-column label="批次" align="center">
				<template slot-scope="scope">
					<div v-if="scope.row.batchName" v-html="scope.row.batchName"></div>
					<span v-else>--</span>
				</template>
			</el-table-column>
			<el-table-column label="进度" align="center">
				<template slot-scope="scope">
					<span v-if="scope.row.batchState === 0">
						--
					</span>
					<span v-if="scope.row.batchState === 1">
						草稿
					</span>
					<span v-if="scope.row.batchState === 2">
						培养计划
					</span>
					<span v-if="scope.row.batchState === 3">
						帮扶记录
					</span>
					<span v-if="scope.row.batchState === 4">
						学习总结
					</span>
				</template>
			</el-table-column>

			<el-table-column label="建立时间" align="center">
				<template slot-scope="scope">
					<span>{{ scope.row.createTime }}</span>
				</template>
			</el-table-column>
			<el-table-column label="出师时间" align="center">
				<template slot-scope="scope">
					<span>{{ scope.row.finishTime || '--' }}</span>
				</template>
			</el-table-column>
			<el-table-column label="状态" align="center">
				<template slot-scope="scope">
					<span>
						<el-tag  size="mini" type="info" v-if="scope.row.state === 1" >未开始</el-tag>
						<el-tag  size="mini" type="primary" v-else-if="scope.row.state === 2" >进行中</el-tag>
						<el-tag  size="mini" type="success" v-else-if="scope.row.state === 3" >已出师</el-tag>
					</span>
				</template>
			</el-table-column>
			<el-table-column width="140" label="操作" align="center">
				<template slot-scope="scope">
					<div v-if="scope.row.batchState === 0">
						<el-button type="text" size="small" @click="toEditPage(scope.row.id)">编辑</el-button>
						<el-button type="text" size="small" @click="delMasterPrenticeByIds(scope.row.id)" style="color:red" class="buttontextred">删除</el-button>
					</div>
					<el-button type="text" size="small" v-else-if="scope.row.state === 2" @click="finishLearnById(scope.row.id)">出师</el-button>
					<el-button type="text" size="small" v-else>--</el-button>
				</template>
			</el-table-column>
		</el-table>
		<div class="pagination-container">
			<el-pagination
				@size-change="sizeChangeHandler"
				@current-change="currentChangeHandler"
				:current-page.sync="pagination.pageNo"
				:page-sizes="[10, 20, 30, 50]"
				:page-size.sync="pagination.pageSize"
				layout="total, sizes, prev, pager, next, jumper"
				:page-count="pagination.pages"
				:total="pagination.total"
			></el-pagination>
		</div>
	</div>
</template>

<script>
import windowResize from '@/mixins/windowResize'
import baseMixin from '@/mixins/baseMixin'
import { delMasterPrenticeByIds, queryCyanBlueMasterPrentice, finishLearnById } from '@/api/qlthSetting'
export default {
	name: 'qlthSettingIndex',
	data() {
		return {
			exportUrl: '',
			batchState: '0',
			stateList: [
				{
					value: 0,
					label: '全部状态'
				},
				{
					value: 1,
					label: '未开始'
				},
				{
					value: 2,
					label: '进行中'
				},
				{
					value: 3,
					label: '已出师'
				}
			],
			state: 0,
			uploadPath: '',
			uploadData: '',
			searchName: '',
			dataList: [],
			typeList: { 1: '中小学' },
			multipleSelection: []
		}
	},
	filters: {
		timeFilter(time) {
			return time ? time.substring(0, 19) : ''
		}
	},
	created() {
		this.queryListFunc()
	},
	activated() {
		this.queryListFunc()
	},
	mixins: [windowResize, baseMixin],
	methods: {
		toMasterDetail(data) {
			this.$router.push({
				path: 'masterBatchDetail',
				query: {
					id: data.batchId,
					finishTime: data.finishTime,
					createTime: data.createTime,
					masterId: data.masterId,
					prenticeId: data.prenticeId,
					masterName: data.masterName,
					prenticeName: data.prenticeName,
					state: data.state
				}
			})
		},
		finishLearnById(id) {
			this.$confirm('确认要对选中的师徒进行出师吗？', '出师', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning',
				lockScroll: false
			}).then(() => {
				finishLearnById({
					id: id
				})
					.then(() => {
						this.$message.success('出师成功！')
						this.queryListFunc()
					})
					.catch(() => {
						this.$message.info('已取消操作！')
					})
			})
		},
		delMasterPrenticeByIds(ids) {
			this.$confirm('确认要删除选中的师徒关系吗？', '删除', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning',
				lockScroll: false
			}).then(() => {
				delMasterPrenticeByIds({
					idStr: ids
				})
					.then(() => {
						this.$message.success('删除成功！')
						this.queryListFunc()
					})
					.catch(() => {
						this.$message.info('已取消操作！')
					})
			})
		},
		toAddPage() {
			this.$router.push('qlthSettingAdd')
		},

		beforeAvatarUpload(file) {
			let suffix = file.name.split('.')[file.name.split('.').length - 1]
			if (suffix !== 'xls') {
				this.$message.error('上传的文件格式应为模板文件!')
				return false
			}
		},
		toInfoPage(id) {
			this.$router.push({ path: 'batchDetail', query: { id: id } })
		},
		toEditPage(id) {
			this.$router.push({ path: 'qlthSettingAdd', query: { id: id } })
		},
		handleSelectionChange(val) {
			this.multipleSelection = val
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
			this.queryListFunc()
		},
		batchDeleteHandler() {
			if (!this.multipleSelection.length) {
				this.$message.error('请选择要删除的项')
			} else {
				this.delMasterPrenticeByIds(this.multipleSelection.map(({ id }) => id).join(','))
			}
		},

		queryListFunc() {
			queryCyanBlueMasterPrentice({
				searchName: this.searchName,
				pageNo: this.pagination.pageNo,
				pageSize: this.pagination.pageSize,
				state: this.state,
				batchState: this.batchState
			}).then(data => {
				this.dataList = data.data.data.dataList
				this.pagination.total = data.data.data.pagination.total
				this.exportUrl = global.BasePath + 'structure/cyanBlue/downCyanBlueMasterPrentice?batchState=' + this.batchState + '&searchName=' + this.searchName + '&state=' + this.state + '&token=' + this.$store.getters.token
			})
		}
	}
}
</script>
<style lang="scss" scoped>
.common_wrap {
	padding: 12px;

	.header {
		padding-bottom: 10px;
		overflow: hidden;
	}

	.pagination-container {
		margin-top: 10px;
	}
}
</style>
