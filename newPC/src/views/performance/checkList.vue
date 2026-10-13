<template>
	<div class="check_list_wrap">
		<div class="header">
			<el-row>
				<el-col :span="19">
					<el-button @click="goBack" size="medium">返回</el-button>
					<el-select size="medium" v-model="status" @change="searchIt()">
						<el-option v-for="(item, index) in statusList" :key="index" :label="item.label" :value="item.status"></el-option>
					</el-select>
				</el-col>
				<el-col :span="5">
					<el-input placeholder="请输入考核员" v-model.trim="search" size="medium">
						<el-button slot="append" icon="el-icon-search" @click="searchIt()"></el-button>
					</el-input>
				</el-col>
			</el-row>
		</div>

		<el-table :data="tableData" border :height="maxH" style="width:100%">
			<el-table-column label="考核任务" show-overflow-tooltip>
				<template slot-scope="scope">
					<span>{{ scope.row.taskName }}</span>
				</template>
			</el-table-column>
			<el-table-column label="类型">
				<template slot-scope="scope">
					<span style="margin-left: 10px">{{ scope.row.typeName }}</span>
				</template>
			</el-table-column>
			<el-table-column label="考核时间">
				<template slot-scope="scope">
					<span style="margin-left: 10px">{{ scope.row.assessDate }}</span>
				</template>
			</el-table-column>
			<el-table-column label="考核员">
				<template slot-scope="scope">
					<span style="margin-left: 10px">{{ scope.row.userName }}</span>
				</template>
			</el-table-column>
			<el-table-column label="状态">
				<template slot-scope="scope">
					<el-tag  size="mini" type="success" key=""  v-if="scope.row.state === 2 && scope.row.auditState === 1" plain>已上报</el-tag>
					<el-tag  size="mini" type="info" v-if="scope.row.state === 1"  v-else plain>未上报</el-tag>
					<el-tag  size="mini" type="danger" v-if="scope.row.state === 2 && scope.row.auditState === 2"  v-else plain>驳回</el-tag>
					<el-tag  size="mini" type="success" v-if="scope.row.state === 2 && scope.row.auditState === 3"  v-else plain>同意</el-tag>
				</template>
			</el-table-column>
			<el-table-column label="操作">
				<template slot-scope="scope">
					<el-button v-if="scope.row.state === 2 && scope.row.auditState === 1" type="text" @click="goCheck(scope.row)">审核</el-button>
					<el-button v-else-if="scope.row.state === 2 && scope.row.auditState === 3" type="text" @click="goCheck(scope.row)">
						查看
					</el-button>
					<el-button v-else-if="scope.row.state === 2 && scope.row.auditState === 2" type="text" @click="goCheck(scope.row)">
						查看
					</el-button>
					<span v-else>--</span>
				</template>
			</el-table-column>
		</el-table>
		<div style="margin-top: 15px;">
			<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-sizes="[10, 20, 30, 40]" :page-size="10" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
		</div>
	</div>
</template>
<script>
import { gotestList } from '@/api/performance'
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
			data: {},
			type: 'shanghai',
			status: 0,
			search: '',
			tableData: [],
			statusList: [
				{ label: '全部状态', status: 0 },
				{ label: '未上报', status: 1 },
				{ label: '已上报', status: 2 },
				{
					label: '驳回',
					status: 3
				},
				{ label: '同意', status: 4 }
			]
		}
	},
	mixins: [mixin],
	created() {
		this.checkInfo = JSON.parse(sessionStorage.getItem('checkInfo'));
		this.gotestList()
	},
	methods: {
		goBack() {
			this.$router.back()
		},
		searchIt() {
			this.pageNo = 1;
			this.gotestList()
		},
		gotestList() {
			gotestList({
				pageSize: this.pageSize,
				pageNo: this.pageNo,
				taskId: this.taskId,
				status: this.status,
				searchName: this.search
			}).then(res => {
				this.tableData = res.data.data.dataList;
				this.total = res.data.data.pagination.total
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
		goWirte(data) {
			this.$router.push({
				path: 'writePerformance',
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
			this.gotestList()
		},
		handleCurrentChange(val) {
			this.pageNo = val;
			this.gotestList()
		}
	}
}
</script>

<style lang="scss" scoped>
.check_list_wrap {
	padding: 12px;
	.header {
		margin-bottom: 10px;
	}
}
</style>
>
