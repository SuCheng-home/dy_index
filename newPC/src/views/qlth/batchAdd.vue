<template>
	<div class="add-allCon">
		<div class="header">
			<el-row>
				<el-col :span="19">
					<el-button size="medium" @click="$router.back()">返回</el-button>
					<el-button type="primary" size="medium" @click="saveIt()">保存</el-button>
				</el-col>
			</el-row>
		</div>
		<div class="add_wrap">
			<el-form :model="listQuery" :rules="rules" ref="ruleForm" label-width="150px" class="demo-ruleForm">
				<div class="type_title">
					<div class="line"></div>
					<span style="line-height: 25px;">批次名称</span>
				</div>
				<el-form-item label="批次名称" prop="name">
					<div v-if="!$route.query.id">
						<el-input placeholder="请输入批次名称" v-model="listQuery.name"></el-input>
					</div>
					<div v-else>
						<span>{{ listQuery.name }}</span>
					</div>
				</el-form-item>
				<div class="type_title">
					<div class="line"></div>
					<span style="line-height: 25px;">师徒人选</span>
				</div>
				<el-form-item label="师徒人选" prop="checkList">
					<div v-if="!$route.query.id">
						<el-checkbox v-model="isAllCheck" @change="isAllCheckChange">全选</el-checkbox>
						<el-checkbox-group v-model="checkList">
							<el-checkbox :label="item.masterName + '/' + item.prenticeName" v-for="(item, index) in prenticeList" :key="index"></el-checkbox>
						</el-checkbox-group>
					</div>
					<div v-else>
						<span style="margin-right: 10px;font-size: 14px; color: #606266" v-for="(item, index) in prenticeList" :key="index">{{ item.masterName + '/' + item.prenticeName }}</span>
					</div>
				</el-form-item>

				<div class="type_title">
					<div class="line"></div>
					<span style="line-height: 25px;">培养计划</span>
					<span style="font-size: 13px;font-weight: inherit;margin-left: 20px">培养计划由师傅填写并上传</span>
				</div>
				<el-form-item label="上报开始日期" prop="planStartDate">
					<el-date-picker v-model="listQuery.planStartDate" type="date" placeholder="选择日期"></el-date-picker>
				</el-form-item>
				<el-form-item label="上报结束日期" prop="planEndDate">
					<el-date-picker v-model="listQuery.planEndDate" type="date" placeholder="选择日期"></el-date-picker>
				</el-form-item>
				<el-form-item label="计划模板">
					<file-list v-if="!($route.query.batchState == 1) && $route.query.id" :fileList="planFileJson" :isShowTitle="false"></file-list>
					<uploader v-else pathPrefix="homework" showMode="cover" :extList="['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'pdf']" v-model="planFileJson" :multiple="true"></uploader>
				</el-form-item>

				<el-form-item label="备注">
					<el-input type="textarea" :rows="4" placeholder="请输入内容" v-model="listQuery.planRemark"></el-input>
				</el-form-item>
				<div class="type_title">
					<div class="line"></div>
					<span style="line-height: 25px;">帮扶记录</span>
					<span style="font-size: 13px;font-weight: inherit;margin-left: 20px">帮扶记录由师傅填写并上传</span>
				</div>
				<el-form-item label="上报开始日期" prop="recordStartDate">
					<el-date-picker v-model="listQuery.recordStartDate" type="date" placeholder="选择日期"></el-date-picker>
				</el-form-item>
				<el-form-item label="上报结束日期" prop="recordEndDate">
					<el-date-picker v-model="listQuery.recordEndDate" type="date" placeholder="选择日期"></el-date-picker>
				</el-form-item>
				<el-form-item label="记录模板">
					<file-list v-if="!($route.query.batchState == 1) && $route.query.id" :fileList="recordFileJson" :isShowTitle="false"></file-list>
					<uploader v-else pathPrefix="homework" showMode="cover" :extList="['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'pdf']" v-model="recordFileJson" :multiple="true"></uploader>
				</el-form-item>
				<el-form-item label="备注">
					<el-input type="textarea" :rows="4" placeholder="请输入内容" v-model="listQuery.recordRemark"></el-input>
				</el-form-item>
				<div class="type_title">
					<div class="line"></div>
					<span style="line-height: 25px;">学习总结</span>
					<span style="font-size: 13px;font-weight: inherit;margin-left: 20px">学习总结由徒弟填写并上传</span>
				</div>
				<el-form-item label="上报开始日期" prop="sumStartDate">
					<el-date-picker v-model="listQuery.sumStartDate" type="date" placeholder="选择日期"></el-date-picker>
				</el-form-item>
				<el-form-item label="上报结束日期" prop="sumEndDate">
					<el-date-picker v-model="listQuery.sumEndDate" type="date" placeholder="选择日期"></el-date-picker>
				</el-form-item>
				<el-form-item label="总结模板">
					<file-list v-if="!($route.query.batchState == 1) && $route.query.id" :fileList="sumFileJson" :isShowTitle="false"></file-list>
					<uploader v-else pathPrefix="homework" showMode="cover" :extList="['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'pdf']" v-model="sumFileJson" :multiple="true"></uploader>
				</el-form-item>
				<el-form-item label="备注">
					<el-input type="textarea" :rows="4" placeholder="请输入内容" v-model="listQuery.sumRemark"></el-input>
				</el-form-item>
			</el-form>
		</div>
	</div>
</template>

<script>
import uploader from './uploader'
import FileList from '@/components/FileList/FileList.vue'

import AddressBook from '@/components/AddressBook/indexExpand'
import { getCyanBlueMasterPrenticeByCondition, addBatch, editBatch, getCyanBlueBatchById } from '@/api/qlthSetting'
import { isShowByPermission } from '@/utils'

export default {
	data() {
		var validateCheckList = (rule, value, callback) => {
			if (!this.checkList.length) {
				callback(new Error('请勾选师徒人选！'))
			} else {
				callback()
			}
		}
		return {
			isAllCheck: false,
			checkList: [],
			prenticeList: [],
			files: [],
			rules: {
				name: [{ required: true, message: '请输入批次名称', trigger: 'blur' }],
				checkList: [{ required: true, validator: validateCheckList, trigger: 'change' }],
				planStartDate: [{ required: true, message: '请选择上报开始日期', trigger: 'blur' }],
				planEndDate: [{ required: true, message: '请选择上报结束日期', trigger: 'blur' }],
				recordStartDate: [{ required: true, message: '请选择上报开始日期', trigger: 'blur' }],
				recordEndDate: [{ required: true, message: '请选择上报结束日期', trigger: 'blur' }],
				sumStartDate: [{ required: true, message: '请选择上报开始日期', trigger: 'blur' }],
				sumEndDate: [{ required: true, message: '请选择上报结束日期', trigger: 'blur' }]
			},

			listQuery: {
				name: '',
				planStartDate: '',
				planEndDate: '',
				planRemark: '',
				recordStartDate: '',
				recordEndDate: '',
				recordRemark: '',
				sumStartDate: '',
				sumEndDate: '',
				sumRemark: ''
			},
			recordFileJson: [],
			planFileJson: [],
			sumFileJson: []
		}
	},
	components: {
		AddressBook,
		uploader,
		FileList
	},
	created() {
		if (this.$route.query.id) {
			this.getCyanBlueBatchById()
		} else {
			this.getCyanBlueMasterPrenticeByCondition()
		}
	},
	name: 'batchAdd',
	watch: {
		'listQuery.meetDate': {
			handler: function(newValue, oldValue) {
				if (!newValue) {
					this.dateRangeList = []
				}
			},
			deep: true
		},
		'listQuery.meetDateRange': {
			handler: function(newValue, oldValue) {
				this.$refs['ruleForm'].validateField('meetDateRange')
			},
			deep: true
		},
		checkList(val) {
			this.isAllCheck = val.length === this.prenticeList.length
		}
	},
	methods: {
		isShowByPermission,
		getCyanBlueBatchById() {
			getCyanBlueBatchById({ batchId: this.$route.query.id }).then(res => {
				Object.keys(this.listQuery).forEach(v => {
					this.listQuery[v] = res.data.data[v]
				})
				this.sumFileJson = res.data.data.sumFileJson ? JSON.parse(res.data.data.sumFileJson) : []
				this.planFileJson = res.data.data.planFileJson ? JSON.parse(res.data.data.planFileJson) : []
				this.recordFileJson = res.data.data.recordFileJson ? JSON.parse(res.data.data.recordFileJson) : []
				this.prenticeList = res.data.data.masterPrenticeList
				this.checkList = res.data.data.masterPrenticeList.map(v => {
					return v.masterName + '/' + v.prenticeName
				})
			})
		},
		isAllCheckChange(val) {
			if (val) {
				this.checkList = this.prenticeList.map(v => {
					return v.masterName + '/' + v.prenticeName
				})
			} else {
				this.checkList = []
			}
		},
		getCyanBlueMasterPrenticeByCondition() {
			return getCyanBlueMasterPrenticeByCondition().then(res => {
				this.prenticeList = [...this.prenticeList, ...res.data.data]
				return res
			})
		},
		saveIt() {
			this.$refs['ruleForm'].validate(valid => {
				if (valid) {
					let masterPrenticeIds = []
					this.checkList.forEach(v => {
						masterPrenticeIds.push(
							this.prenticeList.find(prenticeItem => {
								return prenticeItem.masterName + '/' + prenticeItem.prenticeName === v
							}).id
						)
					})
					let planError = new Date(this.listQuery.planStartDate).getTime() > new Date(this.listQuery.planEndDate).getTime()
					let recordError = new Date(this.listQuery.recordStartDate).getTime() > new Date(this.listQuery.recordEndDate).getTime()
					let sumError = new Date(this.listQuery.sumStartDate).getTime() > new Date(this.listQuery.sumEndDate).getTime()
					if (planError) {
						this.$message({
							type: 'warning',
							message: '培养计划上报开始时间不能大于结束时间!'
						})
						return
					}
					if (recordError) {
						this.$message({
							type: 'warning',
							message: '帮扶记录上报开始时间不能大于结束时间!'
						})
						return
					}
					if (sumError) {
						this.$message({
							type: 'warning',
							message: '学习总结上报开始时间不能大于结束时间!'
						})
						return
					}
					this.listQuery.planStartDate = this.$moment(this.listQuery.planStartDate).format('YYYY-MM-DD')
					this.listQuery.planEndDate = this.$moment(this.listQuery.planEndDate).format('YYYY-MM-DD')
					this.listQuery.recordStartDate = this.$moment(this.listQuery.recordStartDate).format('YYYY-MM-DD')
					this.listQuery.recordEndDate = this.$moment(this.listQuery.recordEndDate).format('YYYY-MM-DD')
					this.listQuery.sumStartDate = this.$moment(this.listQuery.sumStartDate).format('YYYY-MM-DD')
					this.listQuery.sumEndDate = this.$moment(this.listQuery.sumEndDate).format('YYYY-MM-DD')
					if (this.$route.query.id) {
						editBatch({
							id: this.$route.query.id,
							masterPrenticeIds: masterPrenticeIds,
							...this.listQuery,
							sumFileJson: this.sumFileJson.length ? JSON.stringify(this.sumFileJson) : '',
							planFileJson: this.planFileJson.length ? JSON.stringify(this.planFileJson) : '',
							recordFileJson: this.recordFileJson.length ? JSON.stringify(this.recordFileJson) : ''
						}).then(res => {
							this.$message({
								type: 'success',
								message: '修改成功!'
							})
							this.$router.back()
						})
					} else {
						addBatch({
							masterPrenticeIds: masterPrenticeIds,
							...this.listQuery,
							sumFileJson: this.sumFileJson.length
								? JSON.stringify(
										this.sumFileJson.map(v => {
											return { accessUrl: v.fileUrl, fileName: v.fileName }
										})
								  )
								: '',
							planFileJson: this.planFileJson.length
								? JSON.stringify(
										this.planFileJson.map(v => {
											return { accessUrl: v.fileUrl, fileName: v.fileName }
										})
								  )
								: '',
							recordFileJson: this.recordFileJson.length
								? JSON.stringify(
										this.recordFileJson.map(v => {
											return { accessUrl: v.fileUrl, fileName: v.fileName }
										})
								  )
								: ''
						}).then(res => {
							this.$message({
								type: 'success',
								message: '新增成功!'
							})
							this.$router.back()
						})
					}
				} else {
				}
			})
		}
	}
}
</script>

<style scoped lang="scss">
.add-allCon {
	padding-bottom: 80px;
	.header {
		padding: 10px;
		border-bottom: 1px solid #e7eaec;
	}
	.add_wrap {
		width: 810px;
		margin: 20px auto;
		.el-form-item {
			margin-bottom: 20px !important;
		}
		.type_title {
			margin-bottom: 20px;
			display: flex;
			align-items: center;
			font-size: 16px;
			font-weight: 600;
			line-height: 20px;
			height: 20px;

			.line {
				width: 3px;
				height: 20px;
				background: #409eff;
				margin-right: 15px;
			}
		}
	}
	.timeList {
		display: flex;
		flex-wrap: wrap;
		padding: 0 20px;
		.timeItem:nth-child(2n) {
			margin-right: 0 !important;
		}
		.isActive {
			background: #409eff;
			color: #fff;
		}
		.timeItem {
			cursor: pointer;
			padding: 0 15px;
			margin-right: 20px;
			margin-bottom: 20px;
			width: 230px;
			height: 35px;
			line-height: 35px;
			//  text-align: center;
			border: 1px solid #bfcbd9;
			border-radius: 5px;
		}
	}
}
</style>
