<template>
	<div class="reportSet">
		<div style="padding:12px 12px 10px 12px">
			<back-tool>
				<div style="display:inline-block">
					<el-button type="primary" @click="goNext()" size="medium" v-if="!(datalist.state == 2 && datalist.auditState == 2)">保存并下一步</el-button>
				</div>
			</back-tool>
		</div>
		<div class="setMain" style="padding:12px;">
			<el-form :model="ruleForm" status-icon style="margin:0 auto;width:950px" ref="ruleForm" label-width="100px" class="demo-ruleForm">
				<el-form-item label="考核项" :required="true">
					<div style="position:relative;vertical-align:top;display:inline-block;width:620px;border:1px solid #ccc; padding-bottom:40px">
						<el-button @click="selectIt(item)" style="margin:10px" :class="{ primary: item.ischeck }" size="medium" v-for="(item, index) in btnList" :key="index">{{ item.itemName }}</el-button>
						<!--            <el-button type="primary" style="position:absolute;right:15px;bottom:8px;" @click="openDialog" plain>新建考核项-->
						<!--            </el-button>-->
					</div>
				</el-form-item>
				<el-form-item label="被考核人员">
					<address-book v-model="ruleForm.addressData" :config="ruleForm.configData" v-if="!(datalist.state == 2 && datalist.auditState == 2)"></address-book>
					<span v-for="(item, index) in ruleForm.addressData.departJson" v-if="ruleForm.addressData.departJson" style="color:#409EFF;font-size:16px">
						{{ item.name }}
					</span>
					<span v-for="(item, index) in ruleForm.addressData.userJson" v-if="ruleForm.addressData.userJson" style="color:#409EFF;font-size:16px" v-else :key="index">
						{{ item.name }}
					</span>
				</el-form-item>
			</el-form>
		</div>
		<!-- 新建考核项弹框 -->
		<el-dialog title="新建考核项" :visible.sync="dialogFormVisible">
			<el-form :model="form">
				<el-form-item label="考核项名称:" :label-width="formLabelWidth" show-word-limit maxlength="20" :required="true">
					<el-input v-model="formData.testName" autocomplete="off" placeholder="请输入"></el-input>
				</el-form-item>
				<el-form-item label="排序:" :label-width="formLabelWidth" :required="true">
					<el-input v-model="formData.order" autocomplete="off" placeholder="请输入"></el-input>
				</el-form-item>
				<el-form-item label="描述:" :label-width="formLabelWidth">
					<el-input v-model="formData.description" autocomplete="off" placeholder="请输入描述"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="dialogFormVisible = false">取 消</el-button>
				<el-button type="primary" @click="addTest()">确 定</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
import { getItemListByUserId, addTest, saveAndNextAgain, getAppearInfo } from '@/api/performance'
import BackTool from '@/components/BackTool/index'
import AddressBook from '@/components/AddressBook/indexExpand'

export default {
	components: {
		BackTool,
		AddressBook
	},
	methods: {
		openDialog() {
			this.dialogFormVisible = true
			this.formData.description = ''
			this.formData.testName = ''
			this.formData.order = ''
		},
		addTest() {
			if (!this.formData.testName || !this.formData.order) {
				this.$message({
					message: '输入框内的值不能为空',
					type: 'warning'
				})
				return
			}
			addTest({
				desContent: this.formData.description,
				itemName: this.formData.testName,
				orderNo: this.formData.order - 0
			}).then(res => {
				this.getItemListByUserId()
				this.dialogFormVisible = false
			})
		},
		selectIt(item) {
			if (this.datalist.state == 2 && this.datalist.auditState == 2) {
				return
			}
			item.ischeck = !item.ischeck
		},
		goNext() {
			if (this.getCheckData.length == 0) {
				this.$message({
					message: '考核项不能为空',
					type: 'warning'
				})
				return
			}
			// if (JSON.stringify(this.ruleForm.addressData) == '{}') {
			// 	this.$message({
			// 		message: '用户或部门不能为空',
			// 		type: 'warning'
			// 	})
			// 	return
			// }
			saveAndNextAgain({
				assessDate: this.datalist.assessDate,
				departJson: this.ruleForm.addressData.departJson && JSON.stringify(this.ruleForm.addressData.departJson) != '[]' ? JSON.stringify(this.ruleForm.addressData.departJson) : '',
				id: this.datalist.id,
				relativeItemList: this.getCheckData,
				taskId: this.datalist.taskId,
				taskName: this.datalist.taskName,
				typeId: this.datalist.typeId,
				typeName: this.datalist.typeName,
				userJson: this.ruleForm.addressData.userJson && JSON.stringify(this.ruleForm.addressData.userJson) != '[]' ? JSON.stringify(this.ruleForm.addressData.userJson) : ''
			}).then(res => {
				this.$router.push({
					path: 'writePerformance',
					query: {
						taskId: this.$route.query.taskId,
						taskRelativeId: this.$route.query.taskRelativeId,
						isEditTest: true
					}
				})
			})
		},

		getItemListByUserId() {
			return getItemListByUserId({ schoolId: this.$store.getters.schoolInfo.id, userId: this.$route.query.userId })
				.then(res => res.data)
				.then(data => {
					let result = data.data
					this.btnList = result.map(v => {
						return {
							itemName: v.itemName,
							orderNo: v.orderNo,
							ischeck: false,
							haveRemark: v.haveRemark,
							id: v.id,
							pointType: v.pointType,
							cashScore: v.cashScore
						}
					})
					//保留替换先前保存的状态
					this.titleList.forEach(item => {
						this.btnList.forEach(v => {
							if (v.id == item.itemId) {
								v.ischeck = true
							}
						})
					})
				})
		},
		getAppearInfo() {
			getAppearInfo({
				taskRelativeId: this.$route.query.taskRelativeId
			}).then(res => {
				this.datalist = res.data.data
				this.titleList = this.datalist.relativeItemList
				this.ruleForm.addressData.userJson = this.datalist.userJson ? JSON.parse(this.datalist.userJson) : ''
				this.ruleForm.addressData.departJson = this.datalist.departJson ? JSON.parse(this.datalist.departJson) : ''
				this.getItemListByUserId()
			})
		}
	},

	computed: {
		//拼接相关参数
		getCheckData() {
			return this.btnList
				.filter(v => {
					return v.ischeck
				})
				.map(item => {
					return {
						itemId: item.id,
						itemName: item.itemName,
						orderNo: item.orderNo,
						relativeId: this.datalist.id,
						taskId: this.datalist.taskId,
						typeId: this.datalist.typeId,
						typeName: this.datalist.typeName,
						haveRemark: item.haveRemark,
						pointType: item.pointType,
						cashScore: item.cashScore
					}
				})
		}
	},
	created() {
		this.getAppearInfo()
	},
	data() {
		return {
			titleList: '',
			datalist: '',
			search: '',
			formLabelWidth: '120px',
			formData: {
				testName: '',
				order: '',
				description: ''
			},
			dialogFormVisible: false,
			ruleForm: {
				configData: {
					title: '发布范围',
					depart: { target: 'all', departType: 't', userTypes: '1,3' },
					group: false //常用组
				},
				addressData: {}
			},
			idArr: [],
			btnList: []
		}
	}
}
</script>
<style scoped>
/deep/ .reportSet .address-input {
	width: 600px !important;
}

/deep/ .menu-tools {
	border-bottom: none !important;
}

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
