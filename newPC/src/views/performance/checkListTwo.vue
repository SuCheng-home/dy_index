<template>
	<div class="check_list_two_wrap">
		<div class="header">
			<el-row>
				<el-col :span="19">
					<el-button @click="goBack" size="medium">返回</el-button>
					<el-select size="medium" v-model="auditState" @change="searchIt()">
						<el-option v-for="(item, index) in auditStateList" :key="index" :label="item.label" :value="item.auditState"></el-option>
					</el-select>
					<el-button type="primary" size="medium" @click="completeReport" v-if="isShowByPermission('/performance/manage')">完成上报</el-button>
				</el-col>
				<el-col :span="5">
					<el-input placeholder="请输入考核员" v-model.trim="search" size="medium">
						<el-button slot="append" icon="el-icon-search" @click="searchIt()"></el-button>
					</el-input>
				</el-col>
			</el-row>
		</div>

		<el-table :data="tableData" border :height="maxH" style="width:100%">
			<el-table-column label="考核任务" width="180" show-overflow-tooltip>
				<template slot-scope="scope">
					<span>{{ scope.row.taskName }}</span>
				</template>
			</el-table-column>
			<el-table-column label="考核员">
				<template slot-scope="scope">
					<span>{{ scope.row.userName }}</span>
				</template>
			</el-table-column>
			<el-table-column label="考核项" show-overflow-tooltip>
				<template slot-scope="scope">
					<span>{{ scope.row.itemList | filterItemName }}</span>
				</template>
			</el-table-column>
<!--			<el-table-column label="被考核人员">-->
<!--				<template slot-scope="scope">-->
<!--					<span>{{ scope.row.userJson | filterName }}</span>-->
<!--				</template>-->
<!--			</el-table-column>-->
			<el-table-column label="审核员">
				<template slot-scope="scope">
					<span>{{ scope.row.auditUserName || '--' }}</span>
				</template>
			</el-table-column>
			<el-table-column label="上报时间">
				<template slot-scope="scope">
					<span>{{ scope.row.reportDate | filterDate }}</span>
				</template>
			</el-table-column>
			<el-table-column label="状态">
				<template slot-scope="scope">
					<el-tag  size="mini" type="info" v-if="scope.row.state === 1" plain>未上报</el-tag>
					<template v-else-if="scope.row.state === 2">
						<el-tag size="mini" type="warning" v-if="scope.row.auditState === 1" plain>待审核</el-tag>
						<el-tag size="mini" type="danger" v-else-if="scope.row.auditState === 2" plain>驳回</el-tag>
						<el-tag size="mini" type="success" v-else-if="scope.row.auditState === 3" plain>同意</el-tag>
					</template>
				</template>
			</el-table-column>
			<el-table-column label="操作" width="150">
				<template slot-scope="scope">
					<el-button v-if="scope.row.state === 1" type="text" @click="deleteTaskRelativeById(scope.row.id)" style="color:red" class="buttontextred">删除</el-button>
					<span v-else>--</span>
				</template>
			</el-table-column>
		</el-table>
		<div style="margin-top:20px">
			<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-sizes="[10, 20, 30, 40]" :page-size="10" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
		</div>
	</div>
</template>

<script>
  import { isShowByPermission } from "@/utils"
import { getReportByTaskId, deleteTaskRelativeById, finishTaskByTaskId } from '@/api/performance'
import BackTool from '@/components/BackTool/index.vue'
import mixin from '@/mixins/windowResize'

export default {
	components: {
		BackTool
	},
	data() {
		return {
			total: '',
			pageSize: 10,
			pageNo: 1,
			taskId: this.$route.query.taskId,
			taskName: this.$route.query.taskName,
			type: 'shanghai',
			auditState: 0,
			search: '',
			tableData: [],
			auditStateList: [
				{ label: '全部状态', auditState: 0 },
				{ label: '待审核', auditState: 1 },
				{ label: '驳回', auditState: 2 },
				{ label: '通过', auditState: 3 },
				{ label: '未上报', auditState: 4 }
			]
		}
	},
	mixins: [mixin],
	filters: {
		filterItemName(val) {
			if (val && val.length) {
				return val.map(i => i.itemName).toString();
			}
			return '--';
		},
		filterName(val) {
			if (val && JSON.parse(val).length) {
				return JSON.parse(val).map(i => i.name).toString();
			}
			return '--';
		},
		filterDate(date) {
			return date ? date.slice(0, 19) : '--';
		}
	},
	created() {
		this.getReportByTaskId()
	},
	methods: {
    isShowByPermission,
		goBack() {
			this.$router.back()
		},
		completeReport() {
			this.$confirm('确认完成上报吗?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {
				finishTaskByTaskId({ taskId: this.taskId }).then(res => {
					if (res.data.code === 200) {
						this.$message({type: 'success', message: '操作成功!'});
						this.$router.replace({path: 'testDetail', query: {id: this.taskId, taskName: this.taskName, publishState: 1}})
					} else {
						this.$message.error(res.data.msg);
					}
				})
			}).catch(() => {})
		},
		searchIt() {
			this.pageNo = 1;
			this.getReportByTaskId()
		},
		deleteTaskRelativeById(relativeId) {
			this.$confirm('此操作将永久删除该考核员, 是否继续?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {
				deleteTaskRelativeById({ relativeId: relativeId }).then(res => {
					if (res.data.code === 200) {
						this.$message({type: 'success', message: '删除成功!'});
						this.getReportByTaskId();
					} else {
						this.$message.error(res.data.msg);
					}
				})
			})
			.catch(() => {})
		},
		getReportByTaskId() {
			getReportByTaskId({
				taskId: this.taskId,
				auditState: this.auditState,
				searchName: this.search
			}).then(res => {
				const data = res.data.data;
				if (res.data.code === 200) {
					this.tableData = [...data.reportList || [], ...data.taskRelativeList || []]
				} else {
					this.tableData = [];
				}
			})
		},
		goCheck(data) {
			this.$router.push({
				path: 'check',
				query: {
					data: JSON.stringify(data)
				}
			})
		},
		goPerformanceReport() {
			this.$router.push('performanceReport')
		},
		//分页操作
		handleSizeChange(val) {
			this.pageSize = val;
			this.getReportByTaskId()
		},
		handleCurrentChange(val) {
			this.pageNo = val;
			this.getReportByTaskId()
		}
	}
}
</script>
<style lang="scss" scoped>
.check_list_two_wrap {
	padding: 12px;
	.header {
		margin-bottom: 10px;
	}
}
</style>
>
