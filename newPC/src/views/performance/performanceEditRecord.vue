<template>
	<div style="padding:15px">
		<div style="margin-bottom:10px">
			<el-row>
				<el-col :span="19">
					<el-button @click="$router.back()" size="medium">返回</el-button>
					<el-button type="danger" @click="checkRecord(3)" size="medium">不通过</el-button>
					<el-button type="primary" @click="checkRecord(2)" size="medium">通过</el-button>
				</el-col>
				<el-col :span="5">
					<el-input placeholder="请输入教师姓名" v-model.trim="listQuery.searchName" size="medium">
						<el-button slot="append" icon="el-icon-search" @click="searchIt()"></el-button>
					</el-input>
				</el-col>
			</el-row>
		</div>
		<el-table :data="tableData" border :height="maxH" style="width:100%" @selection-change="handleSelectionChange">
			<el-table-column type="selection" :selectable="selectable" width="55"></el-table-column>
			<el-table-column prop="userName" label="教师姓名" width="180"></el-table-column>
			<el-table-column prop="departNames" label="部门" width="180"></el-table-column>
			<el-table-column prop="itemName" label="考核项"></el-table-column>
			<el-table-column label="原绩效">
				<template slot-scope="scope">
					<span v-if="scope.row.pointType === 1">{{ scope.row.point }}元</span>
					<span v-if="scope.row.pointType === 2">{{ scope.row.score }}*{{ scope.row.cashScore }}={{ scope.row.point }}元</span>
				</template>
			</el-table-column>
			<el-table-column label="原备注">
				<template slot-scope="scope">
					{{ scope.row.remark || '--' }}
				</template>
			</el-table-column>
			<el-table-column label="修改绩效">
				<template slot-scope="scope">
					<span v-if="scope.row.pointType === 1">{{ scope.row.updatePoint }}元</span>
					<span v-if="scope.row.pointType === 2">{{ scope.row.updateScore }}*{{ scope.row.cashScore }}={{ scope.row.updatePoint }}元</span>
				</template>
			</el-table-column>
			<el-table-column prop="updateRemark" label="修改备注">
				<template slot-scope="scope">
					{{ scope.row.updateRemark || '--' }}
				</template>
			</el-table-column>
			<el-table-column prop="submitDate" label="提交时间">
				<template slot-scope="scope">
					<span v-if="scope.row.submitDate">{{ scope.row.submitDate.slice(0, -2) }}</span>
				</template>
			</el-table-column>
			<el-table-column label="状态">
				<template slot-scope="scope">
					<el-tag  size="mini" type="success" v-if="scope.row.auditState == 2" >已通过</el-tag>
					<el-tag  size="mini" type="danger" v-if="scope.row.auditState == 3" >未通过</el-tag>
					<el-tag  size="mini" v-if="scope.row.auditState == 1" >未审核</el-tag>
				</template>
			</el-table-column>
		</el-table>
		<div style="margin-top: 15px;">
			<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-sizes="[10, 20, 30, 40]" :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
		</div>
	</div>
</template>

<script>
import { getTest, addTest, deleteTest, editTest, queryAuditRecordByReportId, auditRecord } from '@/api/performance'
import mixin from '@/mixins/windowResize'

export default {
	data() {
		return {
			ids: [],
			formLabelWidth: '120px',
			total: '',
			pageSize: 10,
			pageNo: 1,
			search: '',
			tableData: [],
			listQuery: {
				pageNo: 1,
				pageSize: 10,
				searchName: '',
				reportId: ''
			}
		}
	},
	mixins: [mixin],
	created() {
		this.listQuery.reportId = this.$route.query.id;
		this.queryAuditRecordByReportId()
	},
	methods: {
		checkRecord(state) {
			if (!this.ids.length) {
				this.$message({
					message: '请勾选数据！',
					type: 'warning'
				});
				return
			}
			this.$confirm('是否审批选择的修改记录?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {
				auditRecord({
					auditState: state,
					ids: this.ids.toString()
				}).then(res => {
					this.queryAuditRecordByReportId();
					this.$message({
						message: '审批成功！',
						type: 'success'
					})
				})
			}).catch(() => {})
		},
		queryAuditRecordByReportId() {
			queryAuditRecordByReportId({
				...this.listQuery
			}).then(res => {
				this.tableData = res.data.data.dataList;
				this.total = res.data.data.pagination.total
			})
		},
		// 控制表格复选框是否禁用
		selectable: function(row, index) {
			if (row.auditState == 1) {
				return true
			}
		},
		handleSelectionChange(val) {
			this.ids = [];
			val.forEach(v => {
				this.ids.push(v.id)
			})
		},

		toTestRule() {
			this.$router.push({ path: 'itemList' })
		},
		searchIt() {
			this.listQuery.pageNo = 1;
			this.queryAuditRecordByReportId()
		},
		//获取考核项
		getTest() {
			return getTest({
				pageSize: this.pageSize,
				pageNo: this.pageNo,
				searchName: this.search
			})
				.then(res => res.data)
				.then(data => {
					this.tableData = data.data.dataList;
					this.total = data.data.pagination.total
				})
		},
		//删除考核项
		deleteTest(args) {
			this.$confirm('此操作将永久删除该考核项, 是否继续?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			})
				.then(() => {
					deleteTest(args.id).then(res => {
						this.getTest();
						this.$message({
							type: 'success',
							message: '删除考核项成功!'
						})
					})
				})
				.catch(() => {})
		},
		//分页操作
		handleSizeChange(val) {
			this.listQuery.pageNo = 1;
			this.listQuery.pageSize = val;
			this.queryAuditRecordByReportId()
		},
		handleCurrentChange(val) {
			this.listQuery.pageNo = val;
			this.queryAuditRecordByReportId()
		}
	}
}
</script>

<style scoped></style>
