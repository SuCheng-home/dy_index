<template>
	<div>
		<div style="padding:12px 12px 10px 12px;overflow: hidden;">
			<el-row>
				<el-col :span="19">
					<el-select v-model="state" placeholder="请选择" @change="stateChange" size="medium">
						<el-option label="全部回复状态" value="0"></el-option>
						<el-option label="未回复" value="1"></el-option>
						<el-option label="已回复" value="2"></el-option>
					</el-select>
				</el-col>
				<el-col :span="5">
					<el-input placeholder="请输入教师姓名" style="float:right;width:350px" v-model="searchName" class="input-with-select" size="medium">
						<el-button slot="append" @click="searchIt()" icon="el-icon-search"></el-button>
					</el-input>
				</el-col>
			</el-row>
		</div>
		<div class="tableArea" style="padding:0 12px">
			<el-table :data="tableData" border :height="maxH" style="width:100%">
				<el-table-column label="教师姓名">
					<template slot-scope="scope">
						<span class="link" @click="getTaskDetail(scope.row)">
							{{ scope.row.userName }}
						</span>
					</template>
				</el-table-column>
				<el-table-column label="部门">
					<template slot-scope="scope">
						<span style="margin-left: 10px">{{ scope.row.departNames }}</span>
					</template>
				</el-table-column>
				<el-table-column label="绩效">
					<template slot-scope="scope">
						<span style="margin-left: 10px">月考核：{{ scope.row.taskName }}</span>
					</template>
				</el-table-column>
				<el-table-column label="反馈">
					<template slot-scope="scope">
						<span style="margin-left: 10px">{{ scope.row.content }}</span>
					</template>
				</el-table-column>
				<el-table-column label="回复">
					<template slot-scope="scope">
						<span style="margin-left: 10px">{{ scope.row.replyContent || '--' }}</span>
					</template>
				</el-table-column>
				<el-table-column label="状态">
					<template slot-scope="scope">
						<el-tag  size="mini" type="warning" key=""  v-if="scope.row.state == 1" plain>未回复</el-tag>
						<el-tag  size="mini" type="success"  v-else plain>已回复</el-tag>
					</template>
				</el-table-column>
				<el-table-column label="操作">
					<template slot-scope="scope">
						<el-button type="text" @click="replayIt(scope.row)" v-if="scope.row.state == 1">回复</el-button>
						<el-button type="text" @click="deleteMessage(scope.row)" style="color:red" class="buttontextred">删除</el-button>
					</template>
				</el-table-column>
			</el-table>
		</div>
		<div style="position:absolute;bottom:30px;padding-left:15px">
			<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-sizes="[10, 20, 30, 40]" :page-size="10" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
		</div>
		<el-dialog title="绩效详情" :visible.sync="detailDialogVisible" width="40%" center>
			<el-table :data="taskDataList" border style="width:100%">
				<el-table-column label="考核项">
					<template slot-scope="scope">
						<span>
							{{ scope.row.itemName }}
						</span>
					</template>
				</el-table-column>
				<el-table-column label="金额">
					<template slot-scope="scope">
						<span>{{ scope.row.point }}</span>
					</template>
				</el-table-column>
				<el-table-column label="备注">
					<template slot-scope="scope">
						<span>{{ scope.row.remark || '--' }}</span>
					</template>
				</el-table-column>
			</el-table>
			<div class="title-wrap" v-if="showRemark">
				<div class="line"></div>
				<div class="titleName">考核备注</div>
			</div>
			<div class="items-wrap" v-if="showRemark">
				<div style="margin-bottom: 15px; color: #969799; font-size: 14px" :style="{ 'margin-top': index === 0 ? '10px' : '0' }" v-for="(item, index) in remarkList" :key="index + 'remark'">{{ item.taskName }}:&nbsp;&nbsp; {{ item.remark || '--' }}</div>
			</div>
		</el-dialog>
		<el-dialog title="回复" :visible.sync="replayDialogVisible" width="30%" center>
			<el-form ref="ruleForm" :model="formInline" :rules="rules" class="demo-form-inline">
				<el-form-item prop="replyContent">
					<el-input type="textarea" :rows="4" placeholder="请输入内容" v-model="formInline.replyContent"></el-input>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="replayDialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="confirmReplay">确 定</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
import { queryMessageBySchoolId, getTaskDetail, replyMessage, deleteMessage } from '@/api/performance'
import mixin from '@/mixins/windowResize'

export default {
	data() {
		return {
			state: '0',
			pageNo: 1,
			pageSize: 10,
			total: '',
			formInline: {
				replyContent: ''
			},
			rules: {
				replyContent: [{ required: true, message: '请输入回复', trigger: 'blur' }]
			},
			searchName: '',
			tableData: [],
			detailDialogVisible: false,
			taskDataList: [],
			replayDialogVisible: false,
			id: '',
			showRemark: true
		}
	},
	created() {
		this.queryMessageBySchoolId()
	},
	watch: {
		replayDialogVisible(val) {
			if (val) {
				this.$refs['ruleForm'].clearValidate('replyContent')
			}
		}
	},
	mixins: [mixin],
	methods: {
		deleteMessage(item) {
			this.$confirm('此操作将永久删除该反馈留言, 是否继续?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			})
				.then(() => {
					deleteMessage({ messageId: item.id }).then(res => {
						this.queryMessageBySchoolId()
						this.$message({
							type: 'success',
							message: '删除成功!'
						})
					})
				})
				.catch(() => {})
		},
		// 确认回复
		confirmReplay() {
			this.$refs['ruleForm'].validate(valid => {
				if (valid) {
					replyMessage({
						replyContent: this.formInline.replyContent,
						id: this.id
					}).then(res => {
						this.$message.success('回复成功')
						this.replyContent = ''
						this.queryMessageBySchoolId()
						this.replayDialogVisible = false
					})
				} else {
				}
			})
		},
		searchIt() {
			this.pageNo = 1
			this.queryMessageBySchoolId()
		},
		stateChange() {
			this.queryMessageBySchoolId()
		},
		replayIt(item) {
			this.id = item.id
			this.formInline.replyContent = item.replyContent
			this.replayDialogVisible = true
		},
		//获取任务列表
		queryMessageBySchoolId() {
			queryMessageBySchoolId({
				pageNo: this.pageNo,
				pageSize: this.pageSize,
				searchName: this.searchName,
				state: this.state
			}).then(res => {
				this.tableData = res.data.data.dataList
				this.total = res.data.data.pagination.total
			})
		},

		getTaskDetail(item) {
			getTaskDetail({ taskId: item.taskId, userId: item.userId }).then(res => {
				this.taskDataList = res.data.data.itemList
				this.remarkList = res.data.data.relativeUserList
				let totalPoint = 0
				this.taskDataList.forEach(v => {
					totalPoint += v.point * 100
				})
				totalPoint ? (totalPoint = totalPoint / 100) : ''
				this.taskDataList.push({
					itemName: '合计',
					point: totalPoint
				})
				this.showRemark = this.remarkList.some(v => {
					return v.remark
				})
				this.detailDialogVisible = true
			})
		},
		//分页操作
		handleSizeChange(val) {
			this.pageSize = val
			this.pageNo = 1
			this.queryMessageBySchoolId()
		},
		handleCurrentChange(val) {
			this.pageNo = val
			this.queryMessageBySchoolId()
		}
	}
}
</script>

<style lang="scss" scoped>
.title-wrap {
	display: flex;
	margin-top: 15px;
	align-items: center;
	.line {
		width: 3px;
		height: 20px;
		background: #409eff;
		margin-right: 7px;
	}
	.titleName {
		font-weight: bold;
	}
}
.items-wrap {
	padding-top: 5px;
}
</style>
