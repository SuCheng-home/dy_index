<template>
	<div>
		<div style="padding:12px 12px 10px 12px">
			<el-row>
				<el-col :span="19">
					<el-button @click="$router.back()" size="medium">返回</el-button>
					<el-button type="primary" @click="editIt()" size="medium">修改绩效</el-button>
				</el-col>
				<el-col :span="5">
					<el-input placeholder="请输入教师姓名" v-model="listQuery.searchName" class="input-with-select"
						size="medium">
						<el-button slot="append" @click="searchIt()" icon="el-icon-search"></el-button>
					</el-input>
				</el-col>
			</el-row>
		</div>
		<div class="table" style="padding:0 12px;">
			<el-table :data="tableData" border :height="maxH" style="width: 100%">
				<el-table-column label="教师姓名" prop="userName"></el-table-column>
				<el-table-column label="部门" prop="departNames"></el-table-column>
				<el-table-column label="考核项" prop="itemName"></el-table-column>
				<el-table-column label="考核员" prop="createName"></el-table-column>
				<el-table-column label="原绩效">
					<template slot-scope="scope">
						<span v-if="scope.row.pointType === 1">{{ scope.row.point }}元</span>
						<span v-if="scope.row.pointType === 2">{{ scope.row.score }}*{{ scope.row.cashScore }}={{
							scope.row.point }}元</span>
					</template>
				</el-table-column>
				<el-table-column label="原备注" show-overflow-tooltip>
					<template slot-scope="scope">
						{{ scope.row.remark || '--' }}
					</template>
				</el-table-column>
				<el-table-column label="修改绩效">
					<template slot-scope="scope">
						<span v-if="scope.row.pointType === 1">{{ scope.row.updatePoint }}元</span>
						<span v-if="scope.row.pointType === 2">{{ scope.row.updateScore }}*{{ scope.row.cashScore }}={{
							scope.row.updatePoint }}元</span>
					</template>
				</el-table-column>
				<el-table-column label="修改备注" show-overflow-tooltip>
					<template slot-scope="scope">
						{{ scope.row.updateRemark || '--' }}
					</template>
				</el-table-column>
				<el-table-column label="通过时间">
					<template slot-scope="scope">
						<span v-if="scope.row.auditDate">{{ scope.row.auditDate.slice(0, -2) }}</span>
					</template>
				</el-table-column>
			</el-table>
			<div style="margin-top: 15px;">
				<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
					:page-sizes="[10, 20, 30, 40]" :page-size="listQuery.pageSize"
					layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
			</div>
		</div>
		<el-dialog title="修改绩效" :visible.sync="editDialogFormVisible">
			<el-form :model="editData" :rules="rules" ref="editForm" label-width="150px">
				<el-form-item label="教师:" prop="userId">
					<el-select v-model="editData.userId" placeholder="请选择" @change="userChange" filterable
						size="medium">
						<el-option v-for="item in userOptions" :key="item.value" :label="item.label"
							:value="item.value"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="考核项:" prop="itemId">
					<el-select v-model="editData.itemId" placeholder="请选择" @change="twoChange" filterable size="medium">
						<el-option v-for="item in testOptions" :key="item.value" :label="item.label"
							:value="item.value"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="原绩效:">
					<span v-if="editInfo === null">0元</span>
					<span v-else-if="editInfo !== null && !isDashPoint">{{ editData.point !== '' ? editData.point + '元'
						: '0元'
					}}</span>
					<span v-else-if="editInfo !== null && isDashPoint">{{ editData.score }}*{{ editData.cashScore }}={{
						(editData.score * editData.cashScore).toFixed(2) }}元
					</span>
				</el-form-item>
				<el-form-item label="修改绩效:" prop="updatePoint" v-if="editData.pointType === 1">
					<el-input placeholder="请输入" maxlength="9" v-model.trim="editData.updatePoint" size="medium"
						style="width: 218px"></el-input>
					&nbsp;元
				</el-form-item>
				<el-form-item label="修改绩效:" prop="updateScore" v-else>
					<el-input style="width: 80px" size="medium" placeholder="0" maxlength="9"
						v-model.trim="editData.updateScore"></el-input>
					<span>*{{ editData.cashScore }}={{ (editData.updateScore * editData.cashScore).toFixed(2) }}元</span>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="editDialogFormVisible = false" size="medium">关闭</el-button>
				<el-button type="primary" @click="submitRecords(2)" size="medium">提交</el-button>
			</div>
		</el-dialog>
	</div>
</template>
<script>
import { queryVerifiedRecordByTaskId, getAllPerformance, insertRecord, getPerformanceTtemByTh } from '@/api/performance.js'
import mixin from '@/mixins/windowResize'

export default {
	data() {
		return {
			total: '',
			listQuery: {
				pageSize: 10,
				pageNo: 1,
				searchName: '',
				taskId: ''
			},
			tableData: [],
			editDialogFormVisible: false,
			editData: {
				userId: '',
				itemId: '',
				point: '',
				score: '',
				updatePoint: '',
				updateScore: '',
				cashScore: '',
				updateRemark: '',
				auditRemark: '',
				auditDate: '',
				auditUserId: '',
				haveRemark: 0,
				pointType: 1,
			},
			rules: {
				userId: [{ required: true, message: '请选择教师', trigger: 'blur' }],
				itemId: [{ required: true, message: '请选择考核项', trigger: 'blur' }],
				updatePoint: [{ required: true, message: '请输入修改绩效', trigger: 'blur' }],
				updateScore: [{ required: true, message: '请输入修改绩效', trigger: 'blur' }],
			},
			editInfo: null,
			isDashPoint: false,
			useDataList: [],
			userOptions: [],
			titleList: [],
			testOptions: [],
		}
	},
	created() {
		this.listQuery.taskId = this.$route.query.taskId;
		this.queryVerifiedRecordByTaskId()
	},
	mixins: [mixin],
	methods: {
		submitRecords(state) {
			this.$refs['editForm'].validate(async valid => {
				if (valid) {

					// 查找对应的用户信息
					const userInfo = this.useDataList.find(user => user.userId === this.editData.userId);
					// 查找对应的考核项信息
					const itemInfo = this.titleList.find(item => item.itemId === this.editData.itemId);
					console.log(userInfo, itemInfo)
					const { data } = await getPerformanceTtemByTh({
						taskId: this.$route.query.taskId,
						itemId: itemInfo.itemId,
						userId: this.editData.userId
					})
					if (!data.data) {
						this.$message({
							type: 'warning',
							message: '该教师未考核该项，请先考核后再修改'
						})
						return
					}

					// 构建请求参数
					const requestData = {
						assessDate: userInfo.assessDate ? userInfo.assessDate : '',
						updatePoint: this.isDashPoint ? (this.editData.updateScore * this.editData.cashScore).toFixed(2) : this.editData.updatePoint,
						updateRemark: '',
						classIds: userInfo.classIds,
						classNames: userInfo.classNames,
						currIds: userInfo.currIds,
						currNames: userInfo.currNames,
						departIds: userInfo.departIds,
						departNames: userInfo.departNames,
						haveRemark: 0,
						itemId: itemInfo.itemId,
						itemName: itemInfo ? itemInfo.itemName : '',
						orderNo: itemInfo.orderNo,
						point: this.editData.point || 0,
						relativeId: this.$route.query.taskId,
						remark: '',
						reportId: data.data,
						taskId: this.$route.query.taskId,
						taskName: userInfo.taskName ? userInfo.taskName : '',
						typeId: userInfo.typeId,
						typeName: userInfo.typeName ? userInfo.typeName : '',

						userId: this.editData.userId,
						userLoginName: userInfo.userLoginName ? userInfo.userLoginName : '',
						userName: userInfo ? userInfo.userName : '',
						state: state,
						score: this.editData.score || 0,
						pointType: itemInfo ? itemInfo.pointType : 1,
						updateScore: this.editData.updateScore || 0,
						cashScore: this.editData.cashScore || 0
					};

					insertRecord(requestData).then(res => {
						if (res.data.code === 200) {
							this.queryVerifiedRecordByTaskId();
							Object.entries(this.editData).forEach(([key, value]) => {
								this.editData[key] = ''
							});
							this.editDialogFormVisible = false;
							this.$message({
								type: 'success',
								message: '修改成功'
							})
						}
					}).catch(err => {
						console.error('提交失败:', err);
					});
				} else {
					console.log('error submit!!');
					return false
				}
			})
		},
		userChange(val) {
			this.editData.userId = val;
			// 当教师改变时，重置考核项
			this.editData.itemId = '';
			this.editInfo = null;
			this.isDashPoint = false;
			this.editData.cashScore = '';
			this.editData.point = '';
			this.editData.score = '';
			this.editData.updatePoint = '';
			this.editData.updateScore = '';
			this.editData.updateRemark = '';
			this.editData.pointType = 1;
		},
		twoChange(val) {
			this.editData.itemId = val;
			this.updateEditInfo();
		},
		updateEditInfo() {
			// 重置修改绩效字段
			this.editData.updatePoint = '';
			this.editData.updateScore = '';
			this.editData.updateRemark = '';
			this.editData.cashScore = '';
			if (this.editData.userId && this.editData.itemId) {
				// 查找对应的教师数据
				const userData = this.useDataList.find(user => user.userId === this.editData.userId);

				if (userData) {
					const itemData = this.titleList.find(item => item.itemId === this.editData.itemId);
					if (itemData) {
						const pointData = userData.pointList.find(point => point.itemId === this.editData.itemId);
						this.editData.pointType = itemData.pointType;
						this.editInfo = itemData;
						this.editData.haveRemark = itemData.haveRemark;
						this.isDashPoint = itemData.pointType === 2;
						console.log('userData', userData);
						console.log('itemData', itemData);
						console.log('pointData', pointData);
						if (pointData) {
							this.editData.score = pointData.score || 0;
							this.editData.cashScore = pointData.cashScore;
							this.editData.point = itemData.pointType === 1 ? pointData.point : pointData.score * pointData.cashScore;
						} else {
							this.editData.point = 0
							this.editData.score = itemData.score || 0;
							this.editData.cashScore = itemData.cashScore;
						}
					}
				}
			}
		},
		editIt() {
			// 重置编辑数据
			this.editData = {
				userId: '',
				itemId: '',
				point: '',
				score: '',
				updatePoint: '',
				updateScore: '',
				cashScore: '',
				updateRemark: '',
				auditRemark: '',
				auditDate: '',
				auditUserId: '',
				haveRemark: 0,
				pointType: 1,
			};
			this.editInfo = null;
			this.isDashPoint = false;

			getAllPerformance({
				pageSize: 1000,
				pageNo: 1,
				departId: 0,
				searchName: '',
				taskId: this.$route.query.taskId
			}).then(res => {
				if (res.data.code === 200 && res.data.data) {
					this.titleList = res.data.data.titleList || [];
					this.testOptions = this.titleList.map(v => {
						return {
							value: v.itemId,
							label: v.itemName
						}
					});
					this.useDataList = res.data.data.dataList || [];
					this.userOptions = this.useDataList.map(v => {
						return {
							value: v.userId,
							label: v.userName
						}
					});
					this.editDialogFormVisible = true;
				}
			})
		},
		queryVerifiedRecordByTaskId() {
			queryVerifiedRecordByTaskId({
				...this.listQuery
			}).then(res => {
				this.tableData = res.data.data.dataList;
				this.total = res.data.data.pagination.total
			})
		},
		handleSizeChange(val) {
			this.listQuery.pageNo = 1;
			this.listQuery.pageSize = val;
			this.queryVerifiedRecordByTaskId()
		},
		handleCurrentChange(val) {
			this.listQuery.pageNo = val;
			this.queryVerifiedRecordByTaskId()
		},
		searchIt() {
			this.listQuery.pageNo = 1;
			this.queryVerifiedRecordByTaskId()
		}
	}
}
</script>

<style scoped></style>
