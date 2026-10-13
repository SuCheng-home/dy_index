<template>
	<div class="reportSet">
		<div style="padding:12px 12px 10px 12px;">
			<back-tool>
				<el-button type="primary" @click="goNext()" size="medium">保存</el-button>
			</back-tool>
		</div>
		<div class="setMain" style="padding:12px ;">
			<el-form status-icon style="margin:0 auto;width:810px" label-width="100px">
				<el-form-item label="考核项" :required="true">
					<div style="position:relative;vertical-align:top;display:inline-block;width:720px;border:1px solid #ccc;">
						<el-button @click="selectIt(item)" :disabled="!!item.used" style="margin:10px" :class="{ primary: item.ischeck }" size="medium" v-for="(item, index) in btnList" :key="index">{{ item.itemName }}</el-button>
					</div>
				</el-form-item>
				<el-form-item label="被考核人员">
					<address-book v-model="addressData" :config="configData"></address-book>
				</el-form-item>
				<el-form-item label="审核员" :required="true">
					<el-select size="medium" v-model="auditUserId" placeholder="请选择" @change="changeAudit">
						<el-option v-for="item in auditList" :key="item.id" :label="item.name" :value="item.id">
						</el-option>
					</el-select>
				</el-form-item>
			</el-form>
		</div>
	</div>
</template>

<script>
import { getAuditRole, reportPerformance, getItemListByRelativeIdAndUserId } from '@/api/performance'
import BackTool from '@/components/BackTool/index'
import AddressBook from '@/components/AddressBook/indexExpand'

export default {
	components: {
		BackTool,
		AddressBook
	},
	data() {
		return {
			configData: {
				title: '发布范围',
				depart: { target: 'all', departType: 't', userTypes: '1,3' },
				group: false //常用组
			},
			addressData: {
				userJson: [],
				departJson: []
			},
			taskRelativeId: this.$route.query.taskRelativeId,
			taskInfo: {},
			auditUserId: '',
			auditUserName: '',
			auditList: [],
			btnList: []
		}
	},
	created() {
		this.taskInfo = JSON.parse(sessionStorage.getItem('taskInfo')) || {};
		this.getItemListByRelativeIdAndUserId();
		this.getAuditRole();
	},
	computed: {
		getCheckData() {
			return this.btnList.filter(v => {
					return v.ischeck
				}).map(item => {
					return {
						itemId: item.id,
						itemName: item.itemName,
						orderNo: item.orderNo,
						relativeId: this.taskInfo.id,
						taskId: this.taskInfo.taskId,
						typeId: this.taskInfo.typeId,
						typeName: this.taskInfo.typeName,
						haveRemark: item.haveRemark,
						pointType: item.pointType,
						cashScore: item.cashScore
					}
				})
		}
	},
	methods: {
		changeAudit(val) {
			this.auditUserName = this.auditList[this.auditList.map(i=>i.id).indexOf(val)].name;
		},
		getAuditRole() {
			getAuditRole().then(res => res.data).then(data => {
				this.auditList = data.data
			})
		},
		getItemListByRelativeIdAndUserId() {
			getItemListByRelativeIdAndUserId({
				relativeId: this.$route.query.taskRelativeId
			}).then(res => res.data).then(data => {
				let result = data.data;
				this.btnList = result.map(v => {
					return {
						itemName: v.itemName,
						orderNo: v.orderNo,
						ischeck: false,
						id: v.id,
						haveRemark: v.haveRemark,
						pointType: v.pointType,
						cashScore: v.cashScore,
						used: v.used
					}
				})
			})
		},
		selectIt(item) {
			if (!item.used) {
				item.ischeck = !item.ischeck
			}
		},
		goNext() {
			if (!this.getCheckData.length) {
				this.$message({
					message: '考核项不能为空',
					type: 'warning'
				});
				return;
			}
			// if (!this.addressData.departJson.length && !this.addressData.userJson.length) {
			// 	this.$message({
			// 		message: '请选择被考核人员',
			// 		type: 'warning'
			// 	});
			// 	return
			// }
			if (!this.auditUserId) {
				this.$message({
					message: '请选择审核员',
					type: 'warning'
				});
				return
			}
			let query = {
				assessDate: this.taskInfo.assessDate,
				auditUserId: this.auditUserId,
				auditUserName: this.auditUserName,
				departJson: this.addressData.departJson.length ? JSON.stringify(this.addressData.departJson) : '',
				itemList: this.getCheckData,
				relativeId: this.taskRelativeId,
				taskId: this.taskInfo.taskId,
				taskName: this.taskInfo.taskName,
				typeId: this.taskInfo.typeId,
				typeName: this.taskInfo.typeName,
				userJson: this.addressData.userJson.length ? JSON.stringify(this.addressData.userJson) : ''
			};
			console.log(query);
			reportPerformance(query).then(res => {
				if (res.data.code === 200) {
					this.$message({
						message: '保存成功',
						type: 'success'
					});
					this.$router.back()
				} else {
					this.$message.error(res.data.msg);
				}
				// this.$router.replace({
				// 	path: 'writePerformance',
				// 	query: {
				// 		taskId: this.$route.query.taskId,
				// 		taskRelativeId: this.$route.query.taskRelativeId,
				// 		isEditTest: true
				// 	}
				// })
			})
		}
	}
}
</script>
<style scoped>
.primary {
	background: #409eff !important;
	color: #fff;
}

.primary span {
	color: #fff !important;
}

.primary:hover {
	color: #fff !important;
}
</style>
