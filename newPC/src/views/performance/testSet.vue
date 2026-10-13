<template>
	<div style="padding:12px">
		<div style="margin-bottom:10px">
			<el-row>
				<el-col :span="19">
					<el-button type="primary" @click="openNew" size="medium">新建</el-button>
					<el-button type="primary" @click="toTestRule" size="medium" v-if="isManage">考核分配</el-button>
				</el-col>
				<el-col :span="5">
					<el-input placeholder="请输入考核项" v-model.trim="search" size="medium">
						<el-button slot="append" icon="el-icon-search" @click="searchIt()"></el-button>
					</el-input>
				</el-col>
			</el-row>
		</div>
		<el-table :data="tableData" border :height="maxH" style="width:100%">
			<el-table-column prop="itemName" label="考核项" width="180">
				<template slot-scope="scope">
					<span
						style="margin-left: 10px;overflow: hidden;
                text-overflow:ellipsis;
                white-space: nowrap;"
					>
						{{ scope.row.itemName }}
					</span>
				</template>
			</el-table-column>
			<el-table-column prop="orderNo" label="排序" width="180"></el-table-column>
			<el-table-column prop="typeName" width="180" label="考核类别"></el-table-column>
			<el-table-column  width="180" label="奖项类别">
					<template slot-scope="scope">
					<span>{{ scope.row.pointType == 1 ? '现金' : '现金分' }}</span>
				</template>
			</el-table-column>
			<el-table-column prop="itemName" label="备注" width="300">
				<template slot-scope="scope">
					<span>{{ scope.row.haveRemark == 1 ? '有' : '无' }}</span>
				</template>
			</el-table-column>
			<el-table-column prop="createName" label="创建人"></el-table-column>
			<el-table-column label="描述">
				<template slot-scope="scope">
					{{ scope.row.desContent || '--' }}
				</template>
			</el-table-column>
			<el-table-column label="操作">
				<template slot-scope="scope">
					<el-button type="text" size="medium" @click="openEditTest(scope.row)">编辑</el-button>
					<el-button type="text" style="color:red" size="medium" @click="deleteTest(scope.row)" class="buttontextred">删除</el-button>
				</template>
			</el-table-column>
		</el-table>
		<div style="margin-top: 15px;">
			<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-sizes="[10, 20, 30, 40]" :page-size="10" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
		</div>
		<!-- 新建考核项对话框 -->
		<el-dialog :title="title" :visible.sync="dialogFormVisible">
			<el-form :model="formData" :rules="rules" ref="ruleForm">
				<el-form-item label="考核项名称:" :label-width="formLabelWidth" prop="testName">
					<el-input v-model.trim="formData.testName" autocomplete="off" maxlength="20" show-word-limit placeholder="请输入"></el-input>
				</el-form-item>
				<el-form-item label="考核备注:" :label-width="formLabelWidth">
					<el-radio v-model="formData.haveRemark" label="0">无</el-radio>
					<el-radio v-model="formData.haveRemark" label="1">有</el-radio>
				</el-form-item>
				<el-form-item label="奖项类别:" :label-width="formLabelWidth">
					<el-select v-model="formData.pointType" placeholder="请选择" @change="changeState" size="medium">
						<el-option label="现金" :value="1"></el-option>
						<el-option label="现金分" :value="2"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="现金分值:" :label-width="formLabelWidth" prop="cashScore" v-if="formData.pointType === 2">
					<el-input style="width: 217px" v-model.trim="formData.cashScore" autocomplete="off" placeholder="请输入现金分值"></el-input>
					元/分
				</el-form-item>
				<el-form-item label="排序:" :label-width="formLabelWidth" prop="order">
					<el-input style="width: 217px" v-model.trim="formData.order" autocomplete="off" placeholder="请输入排序"></el-input>
				</el-form-item>
				<el-form-item label="描述:" :label-width="formLabelWidth">
					<el-input type="textarea" :rows="3" v-model.trim="formData.description" autocomplete="off" placeholder="请输入描述"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="dialogFormVisible = false">取 消</el-button>
				<el-button type="primary" @click="setAddTest">确 定</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
import { getTest, addTest, deleteTest, editTest } from '@/api/performance'
import { possessRole } from '@/api/common/common'
import mixin from '@/mixins/windowResize'

export default {
	data() {
		var validateOrder = (rule, value, callback) => {
			if (!this.formData.order) {
				callback(new Error('排序不能为空'))
			} else if (isNaN(this.formData.order - 0)) {
				callback(new Error('请输入正确的排序'))
			} else {
				callback()
			}
		}
		var validateCashPoints = (rule, value, callback) => {
			console.log(value)
			let index
			if (value) {
				index = (value + '').indexOf('.')
			}
			if (!value) {
				callback(new Error('现金分值不能为空!'))
			} else if (isNaN(value % 1)) {
				callback(new Error('请输入正确的现金分值!'))
			} else if (index !== -1 && index != value.length - 2) {
				callback(new Error('现金分值最多一位小数!'))
			} else {
				callback()
			}
		}
		return {
			isManage: true,
			formLabelWidth: '120px',
			title: '新建考核项',
			flag: true,
			total: '',
			pageSize: 10,
			pageNo: 1,
			formData: {
				cashScore: '',
				pointType: 1,
				testName: '',
				order: '',
				description: '',
				haveRemark: '0'
			},
			rules: {
				testName: { required: true, message: '请输入考核项名称', trigger: 'blur' },
				order: [{ required: true, validator: validateOrder, trigger: 'blur' }],
				cashScore: [{ required: true, validator: validateCashPoints, trigger: 'blur' }]
			},
			editId: '',
			dialogFormVisible: false,
			editDialogFormVisible: false,
			search: '',
			tableData: []
		}
	},
	mixins: [mixin],
	created() {
		this.getTest()
		this.possessRole()
	},
	watch: {
		'formData.cashScore': {
			handler: function() {
				console.log(this.$refs)
				this.$refs['ruleForm'] && this.$refs['ruleForm'].validateField('cashScore')
			},
			deep: true
		}
	},
	methods: {
		changeState(val) {
			if (val === 2) {
				this.formData.cashScore = ''
			}
		},
		possessRole() {
			possessRole(20211025).then(res => {
				this.isManage = res.data.data.result
			})
		},
		toTestRule() {
			this.$router.push({ path: 'itemList' })
		},
		openNew() {
			this.editId = ''
			this.formData.testName = ''
			this.formData.order = ''
			this.formData.description = ''
			this.formData.haveRemark = '0'
			this.formData.cashScore = ''
			this.formData.pointType = 1
			this.dialogFormVisible = true
		},
		searchIt() {
			this.pageNo = 1
			this.getTest()
		},
		//新建确认添加考核项
		setAddTest() {
			this.$refs['ruleForm'].validate(isTrue => {
				if (isTrue) {
					if (this.flag && !this.editId) {
						this.flag = false
						this.addTest()
						setTimeout(() => {
							this.flag = true
						}, 1000)
					} else {
						this.setEditTest()
					}
				}
			})
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
					this.tableData = data.data.dataList
					this.total = data.data.pagination.total
				})
		},
		//添加考核项
		addTest() {
			console.log('333')
			if (isNaN(this.formData.order - 0)) {
				this.$message({
					type: 'warning',
					message: '排序只能是数字'
				})
			} else if (this.formData.testName && this.formData.order) {
				addTest({
					desContent: this.formData.description,
					itemName: this.formData.testName,
					orderNo: this.formData.order - 0,
					haveRemark: this.formData.haveRemark,
					cashScore: this.formData.cashScore || 0,
					pointType: this.formData.pointType
				}).then(res => {
					this.$message({
						type: 'success',
						message: '新建成功!'
					})
					this.getTest()
					this.dialogFormVisible = false
				})
			} else {
				this.$message({
					type: 'warning',
					message: '输入框必填内容不能为空!'
				})
			}
		},
		//编辑考核项
		openEditTest(args) {
			this.title = '编辑考核项'
			this.dialogFormVisible = true
			this.editId = args.id
			this.formData.testName = args.itemName
			this.formData.order = args.orderNo
			this.formData.description = args.desContent
			this.formData.haveRemark = args.haveRemark + ''
			this.formData.cashScore = args.cashScore
			this.formData.pointType = args.pointType
		},
		//确认编辑考核项{
		setEditTest() {
			if (isNaN(this.formData.order - 0)) {
				this.$message({
					type: 'warning',
					message: '排序只能是数字'
				})
			} else if (this.formData.testName && this.formData.order) {
				editTest({
					itemName: this.formData.testName,
					id: this.editId,
					desContent: this.formData.description,
					orderNo: this.formData.order,
					haveRemark: this.formData.haveRemark,
					cashScore: this.formData.cashScore || 0,
					pointType: this.formData.pointType
				}).then(res => {
					this.$message({
						type: 'success',
						message: '修改成功!'
					})
					this.getTest()
					this.editId = ''
					this.dialogFormVisible = false
				})
			} else {
				this.$message({
					type: 'warning',
					message: '输入框必填内容不能为空'
				})
			}
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
						this.getTest()
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
			this.pageSize = val
			this.getTest()
		},
		handleCurrentChange(val) {
			this.pageNo = val
			this.getTest()
		}
	}
}
</script>

<style scoped></style>
