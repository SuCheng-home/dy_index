<template>
	<div style="padding:15px">
		<div style="margin-bottom:10px">
			<el-row>
				<el-col :span="19">
					<el-button @click="$router.back()" size="medium">返回</el-button>
					<el-button type="primary" @click="openNew" size="medium">添加修改</el-button>
					<el-button type="primary" @click="submitIt" size="medium">提交至审核</el-button>
				</el-col>
				<el-col :span="5">
					<el-input placeholder="请输入教师姓名" v-model.trim="listQuery.searchName" size="medium">
						<el-button slot="append" icon="el-icon-search" @click="searchIt()"></el-button>
					</el-input>
				</el-col>
			</el-row>
		</div>
		<el-table :data="tableData" border :height="maxH-1" style="width:100%" @selection-change="handleSelectionChange">
			<el-table-column type="selection" :selectable="selectable" width="55"></el-table-column>
			<el-table-column prop="userName" label="教师姓名"></el-table-column>
			<el-table-column prop="departNames" label="部门"></el-table-column>
			<el-table-column prop="itemName" label="考核项"></el-table-column>
			<el-table-column label="原绩效">
				<template slot-scope="scope">
					<span v-if="scope.row.pointType === 1">{{ scope.row.point? scope.row.point+'元': '0元'}}</span>
					<span v-if="scope.row.pointType === 2">{{ scope.row.score }}*{{ scope.row.cashScore }}={{ scope.row.point  + '元'}}</span>
				</template>
			</el-table-column>
			<el-table-column label="原备注">
				<template slot-scope="scope">
					{{ scope.row.remark || '--' }}
				</template>
			</el-table-column>
			<el-table-column prop="updatePoint" label="修改绩效">
				<template slot-scope="scope">
					<span v-if="scope.row.pointType === 1">{{ scope.row.updatePoint? scope.row.updatePoint+'元': '0元' }}</span>
					<span v-if="scope.row.pointType === 2">{{ scope.row.updateScore }}*{{ scope.row.cashScore }}={{ scope.row.updatePoint + '元' }}</span>
				</template>
			</el-table-column>
			<el-table-column label="修改备注">
				<template slot-scope="scope">
					{{ scope.row.updateRemark || '--' }}
				</template>
			</el-table-column>
			<el-table-column prop="createDate" label="修改时间">
				<template slot-scope="scope">
					<span v-if="scope.row.createDate">{{ scope.row.createDate | formatTime }}</span>
				</template>
			</el-table-column>
			<el-table-column prop="desContent" label="状态">
				<template slot-scope="scope">
					<el-tag  size="mini" type="warning"  v-if="scope.row.state == 1">未提交</el-tag>
					<el-tag  size="mini" type="success"  v-if="scope.row.state == 2 && scope.row.auditState == 2">已通过</el-tag>
					<el-tag  size="mini" type="danger"  v-if="scope.row.state == 2 && scope.row.auditState == 3">未通过</el-tag>
					<el-tag  size="mini"  v-if="scope.row.state == 2 && scope.row.auditState == 1">未审核</el-tag>
				</template>
			</el-table-column>
			<el-table-column label="操作">
				<template slot-scope="scope">
					<el-button type="text" size="medium" v-if="scope.row.state == 1" @click="openEdit(scope.row)">编辑</el-button>
					<el-button v-if="scope.row.state == 1" type="text" style="color:red" size="medium" @click="deleteRecord(scope.row.id)" class="buttontextred">删除</el-button>
					<span v-else>--</span>
				</template>
			</el-table-column>
		</el-table>
		<div style="margin-top: 15px;">
			<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-sizes="[10, 20, 30, 40]" :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
		</div>
		<!-- 编辑考核项对话框 -->
		<el-dialog :title="editTitle" :visible.sync="editDialogFormVisible">
			<el-form :model="editData" :rules="rules" ref="editForm">
				<el-form-item label="教师:" :label-width="formLabelWidth" :required="true">
					<el-select v-model="editData.userId" placeholder="请选择" @change="userChange" filterable  :disabled="isEdit" size="medium">
						<el-option v-for="item in userOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="考核项:" :label-width="formLabelWidth" :required="true" >
					<el-select v-model="editData.itemId" placeholder="请选择" @change="testChange"  filterable :disabled="isEdit" size="medium">
						<el-option v-for="item in testOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="原绩效:" :label-width="formLabelWidth">
					<span v-if="editInfo === null">0元</span>
					<span v-else-if="editInfo !== null && !isDashPoint">{{ editData.point !== '' ? editData.point : '' }}</span>
					<span v-if="editData.userId && isDashPoint">{{ editData.score }}*{{ editData.cashScore }}={{ editData.point }}</span>
				</el-form-item>
				<el-form-item label="原备注:" :label-width="formLabelWidth" v-if="(editInfo && editInfo.haveRemark == 1) || editData.haveRemark == 1">
					{{ editData.remark }}
				</el-form-item>
				<el-form-item label="修改绩效:" :label-width="formLabelWidth" prop="updatePoint" v-if="!editData.cashScore">
					<el-input  placeholder="请输入" maxlength="9" v-model.trim="editData.updatePoint" size="medium"></el-input>
					&nbsp;元
				</el-form-item>
				<el-form-item label="修改绩效:" :label-width="formLabelWidth" prop="updateScore" v-else>
					<el-input style="width: 80px" size="medium" placeholder="0" maxlength="9" v-model.trim="editData.updateScore"></el-input>
					<span>*{{ editData.cashScore }}={{ (editData.updateScore * editData.cashScore).toFixed(2) }}元</span>
				</el-form-item>
				<el-form-item label="修改备注:" :label-width="formLabelWidth" v-if="(editInfo && editInfo.haveRemark == 1) || editData.haveRemark == 1">
					<el-input size="medium" type="textarea" :rows="3" placeholder="请输入内容" v-model="editData.updateRemark"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="submitRecords(1)" size="medium">保存</el-button>
				<el-button type="primary" @click="submitRecords(2)" size="medium">提交</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
import { queryAssessRecordByReportId, insertRecord, deleteRecord, submitRecord, editRecord, getItemByReportId, getUserByReportId, getUserItemByTaskIdAndUserIdAndItemId } from '@/api/performance'
import mixin from '@/mixins/windowResize'

export default {
	data() {
		var validatePoint = (rule, value, callback) => {
			const reg = /(^-?(?:\d+|\d{1,3}(?:,\d{3})+)(?:\.\d{1,2})?$)/;
			if (!reg.test(value) || value > 99999) {
				callback(new Error('请输入正确的绩效金额!'))
			} else {
				callback()
			}
		};
		var validateScore = (rule, value, callback) => {
			const reg = /(^-?(?:\d+|\d{1,3}(?:,\d{3})+)(?:\.\d{1})?$)/;
			if (!reg.test(value) || value > 99999) {
				callback(new Error('请输入正确的绩效金额!'))
			} else {
				callback()
			}
		};
		return {
			isEdit: false,
			useDataList: '',
			ids: [],
			editInfo: '',
			teacherOptions: [],
			testOptions: [],
			editTitle: '添加修改',
			formLabelWidth: '120px',
			flag: true,
			total: '',
			pageSize: 10,
			pageNo: 1,
			formData: {
				testName: '',
				order: '',
				description: '',
				isHasRemark: '1'
			},
			rules: {
				updatePoint: [{ validator: validatePoint, trigger: 'blur' }],
				updateScore: [{ validator: validateScore, trigger: 'blur' }]
			},
			editData: {
				itemId: '',
				userId: '',
				remark: '',
				point: '',
				haveRemark: '',
				updatePoint: '',
				updateRemark: '',
				cashScore: '',
				score: '',
				updateScore: '',
				pointType: ''
			},
			editId: '',
			dialogFormVisible: false,
			editDialogFormVisible: false,
			search: '',
			tableData: [],
			listQuery: {
				pageNo: 1,
				pageSize: 10,
				searchName: '',
				reportId: this.$route.query.reportId,
				haveRemark: ''
			}
		}
	},
	computed: {
		isDashPoint() {
			let arr = this.testOptions.find(v => {
				return v.value === this.editData.itemId
			});
			console.log(arr, 'arr');
			if (arr) {
				return arr.pointType === 2
			} else {
				return false
			}
		}
	},
	mixins: [mixin],
	watch: {
		editDialogFormVisible(val) {
			!val && (this.isEdit = false)
		}
	},
	filters: {
		formatTime(val) {
			return val.slice(0, -2)
		}
	},
	created() {
		this.getItemByReportId();
		this.getUserByReportId();
		this.queryAssessRecordByReportId()
	},
	methods: {
		// 删除绩效记录
		deleteRecord(id) {
			this.$confirm('此操作将删除改记录, 是否继续?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			})
				.then(() => {
					deleteRecord({
						id: id
					}).then(res => {
						this.queryAssessRecordByReportId();
						this.$message({
							type: 'success',
							message: '删除成功!'
						})
					})
				})
				.catch(() => {})
		},
		queryAssessRecordByReportId() {
			queryAssessRecordByReportId({
				...this.listQuery
			}).then(res => {
				this.total = res.data.data.pagination.total;
				this.tableData = res.data.data.dataList
			})
		},
		submitRecords(state) {
			if ((this.editInfo === null && this.editData.updatePoint === '' && this.editData.updateRemark === '') || (this.editInfo === !null && this.editData.updatePoint === '' && this.editData.updateRemark === '')) {
				this.$message({
					type: 'warning',
					message: '请填写修改内容!'
				});
				return
			}
			this.$refs['editForm'].validate(valid => {
				if (valid) {
					let selectData = this.useDataList.find(v => {
						return this.editData.userId == v.userId
					});
					let itemName = this.testOptions.find(v => {
						return v.value == this.editData.itemId
					}).label;
					let haveRemark = this.testOptions.find(v => {
						return v.value == this.editData.itemId
					}).haveRemark;
					let orderNo = this.testOptions.find(v => {
						return v.value == this.editData.itemId
					}).orderNo;

					if (this.editId) {
						editRecord({
							id: this.editId,
							state: state,
							updatePoint: this.editData.pointType === 2 ? (this.editData.updateScore * this.editData.cashScore).toFixed(2) : this.editData.updatePoint,
							updateRemark: this.editData.updateRemark,
							updateScore: this.editData.updateScore
						}).then(res => {
							this.queryAssessRecordByReportId();
							Object.entries(this.editData).forEach(([key, value]) => {
								this.editData[key] = ''
							});
							this.editInfo = '';
							this.editId = '';
							this.editDialogFormVisible = false;
							this.isEdit = false;
							this.$message({
								type: 'success',
								message: '修改成功'
							})
						})
					} else {
						insertRecord({
							assessDate: selectData.assessDate,
							updatePoint: this.editData.pointType === 2 ? (this.editData.updateScore * this.editData.cashScore).toFixed(2) : this.editData.updatePoint,
							updateRemark: this.editData.updateRemark,
							classIds: selectData.classIds,
							classNames: selectData.classNames,
							currIds: selectData.currIds,
							currNames: selectData.currNames,
							departIds: selectData.departIds,
							departNames: selectData.departNames,
							haveRemark: haveRemark,
							itemId: this.editData.itemId,
							itemName: itemName,
							orderNo: orderNo,
							point: this.editInfo ? this.editInfo.point : 0,
							relativeId: this.$route.query.taskRelativeId,
							remark: this.editInfo ? this.editInfo.remark : '',
							reportId: this.$route.query.reportId,
							taskId: selectData.taskId,
							taskName: selectData.taskName,
							typeId: selectData.typeId,
							typeName: selectData.typeName,
							userId: this.editData.userId,
							userLoginName: selectData.userLoginName,
							userName: selectData.userName,
							state: state,
							score: this.editData.score || 0,
							pointType: this.editData.pointType || 1,
							updateScore: this.editData.updateScore || 0,
							cashScore: this.editData.cashScore || 0
						}).then(res => {
							this.queryAssessRecordByReportId();
							Object.entries(this.editData).forEach(([key, value]) => {
								this.editData[key] = ''
							});
							this.editDialogFormVisible = false;
							this.isEdit = false;
							this.$message({
								type: 'success',
								message: '新增成功'
							})
						})
					}
				} else {
					console.log('error submit!!');
					return false
				}
			})
		},
		cancelEdit() {
			Object.entries(this.editData).forEach(([key, value]) => {
				this.editData[key] = ''
			});
			this.isEdit = false;
			this.editDialogFormVisible = false
		},
		openNew() {
			this.editId = '';
			Object.entries(this.editData).forEach(([key, value]) => {
				this.editData[key] = ''
			});
			this.editDialogFormVisible = true
		},
		// 教师下拉框绑定值变化触发
		userChange(val) {
			if (this.editData.itemId) {
				getUserItemByTaskIdAndUserIdAndItemId({
					...this.editData,
					taskId: this.$route.query.taskId
				}).then(res => {
					this.editInfo = res.data.data;
					if (this.editInfo) {
						this.editData.point = res.data.data.point;
						this.editData.remark = res.data.data.remark;
						this.editData.score = res.data.data.score;
						this.editData.cashScore = res.data.data.cashScore;
						this.editData.pointType = res.data.data.pointType
					}
				})
			}
		},
		// 考核项下拉框绑定值发生变化触发
		testChange(val) {
			console.log(val);
			this.editData.haveRemark = this.testOptions.find(v => {
				console.log(v.itemId);
				return v.value == val
			}).haveRemark;
			if (this.editData.userId) {
				getUserItemByTaskIdAndUserIdAndItemId({
					...this.editData,
					taskId: this.$route.query.taskId
				}).then(res => {
					this.editInfo = res.data.data;
					if (this.editInfo) {
						this.editData.point = res.data.data.point;
						this.editData.remark = res.data.data.remark;
						this.editData.score = res.data.data.score;
						this.editData.cashScore = res.data.data.cashScore;
						this.editData.pointType = res.data.data.pointType
					}
				})
			}
		},
		// 获取关连考核项信息
		getItemByReportId() {
			getItemByReportId({
				reportId: this.$route.query.reportId
			}).then(res => {
				this.testOptions = res.data.data.map(v => {
					return {
						value: v.itemId,
						label: v.itemName,
						haveRemark: v.haveRemark,
						orderNo: v.orderNo,
						pointType: v.pointType
					}
				})
			})
		},
		// 获取关联人员信息
		getUserByReportId() {
			getUserByReportId({
				reportId: this.$route.query.reportId
			}).then(res => {
				this.useDataList = res.data.data;
				this.userOptions = res.data.data.map(v => {
					return {
						value: v.userId,
						label: v.userName
					}
				})
			})
		},
		// 控制表格复选框是否禁用
		selectable: function(row, index) {
			if (row.state == 1) {
				return true
			}
		},
		handleSelectionChange(val) {
			console.log(val);
			this.ids = [];
			val.forEach(v => {
				this.ids.push(v.id)
			})
		},
		submitIt() {
			if (this.ids.length == 0) {
				this.$message({
					type: 'warning',
					message: '请勾选数据!'
				});
				return
			}
			this.$confirm('是否提交至审核?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			})
				.then(() => {
					submitRecord({
						ids: this.ids.toString()
					}).then(res => {
						this.$message({
							type: 'success',
							message: '提交成功!'
						});
						this.queryAssessRecordByReportId()
					})
				})
				.catch(() => {
					this.$message({
						type: 'info',
						message: '已取消操作'
					})
				})
		},
		searchIt() {
			this.listQuery.pageNo = 1;
			this.queryAssessRecordByReportId()
		},
		//编辑考核项
		openEdit(args) {
			this.isEdit = true;
			this.editDialogFormVisible = true;
			this.editId = args.id;
			this.editInfo = args;
			this.editData.remark = args.remark;
			this.editData.point = args.point;
			this.editData.updatePoint = args.updatePoint;
			this.editData.updateRemark = args.updateRemark;
			this.editData.updateScore = args.updateScore;
			this.editData.cashScore = args.cashScore;
			this.editData.pointType = args.pointType;
			this.editData.score = args.score;
			this.editData.userId = args.userId;
			this.editData.itemId = args.itemId
		},
		//分页操作
		handleSizeChange(val) {
			this.listQuery.pageNo = 1;
			this.listQuery.pageSize = val;
			this.queryAssessRecordByReportId()
		},
		handleCurrentChange(val) {
			this.listQuery.pageNo = val;
			this.queryAssessRecordByReportId()
		}
	}
}
</script>

<style lang="scss" scoped>
/deep/ .el-dialog {
	width: 600px;
}
.el-select,.el-input,.el-textarea{
	width: 90%;
}
</style>
