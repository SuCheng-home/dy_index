<template>
	<div class="common_wrap-carAttendance">
		<div class="header">
			<el-row>
				<el-col :span="19">
					<el-button size="medium" @click="$router.back()">返回</el-button>
					<el-select v-model="pagination.userType"  size="medium"  placeholder="请选择" @change="searchList">
						<el-option label="学生" :value="2"></el-option>
						<el-option label="老师" :value="1"></el-option>
					</el-select>
					<el-button size="medium" type="primary" @click="addIt">新增</el-button>
					<a target="_blank" :href="exportUrl" download="">
						<el-button type="primary" size="medium">导出</el-button>
					</a>
					<el-upload class="upload-import" :action="uploadFilePath" :data="uploadData" :show-file-list="false" accept=".xls,.xlsx" :before-upload="beforeFileUpload" :on-success="handleFileSuccess">
						<el-button type="primary" size="medium">导入</el-button>
					</el-upload>
					<a target="_blank" :href="pagination.userType==1?'https://cdnfile-10043692.cos.ap-shanghai.myqcloud.com/admin/xls/cardUserList.xls':'https://cdnfile-10043692.cos.ap-shanghai.myqcloud.com/admin/csv/cardUserListstu.xls'" download="">
						<el-button type="primary" size="medium">下载模板</el-button>
					</a>
				</el-col>
				<el-col :span="5">
					<el-input size="medium" placeholder="请输入教师姓名" v-model.trim="searchName" @keyup.enter.native="searchList">
						<el-button slot="append" icon="el-icon-search" size="medium" @click="searchList"></el-button>
					</el-input>
				</el-col>
			</el-row>
		</div>
		<el-table :data="dataList" :height="maxH - 64"  v-if="pagination.userType==2" style="width: 100%" border>
			<el-table-column  label="学号"  align="center"  show-overflow-tooltip>
				<template slot-scope="scope">
					<span>{{ scope.row.learnNum }}</span>
				</template>
			</el-table-column>
			<el-table-column :label="pagination.userType==1?'教师姓名':'学生姓名'"  align="center"  show-overflow-tooltip>
				<template slot-scope="scope">
					<span>{{ scope.row.userName }}</span>
				</template>
			</el-table-column>
			<el-table-column :label="pagination.userType==1?'部门':'班级'" align="center" prop="className">
				<template slot-scope="scope">
					<span>
						{{ scope.row.departName }}
					</span>
				</template>
			</el-table-column>
			<el-table-column label="车牌号" align="center">
				<template slot-scope="scope">
					<span>
						{{ scope.row.carNo }}
					</span>
				</template>
			</el-table-column>
            <el-table-column label="登记时间" align="center">
				<template slot-scope="scope">
					<span>
						{{ scope.row.createTime.slice(0,19) }}
					</span>
				</template>
			</el-table-column>
			<el-table-column width="140" label="操作" align="center">
				<template slot-scope="scope">
					<el-button type="text" size="small" @click="dialogFormVisiblefun(scope.row)">编辑</el-button>
					<el-button type="text" size="small" @click="delCarUserByUserId(scope.row.userId)" style="color: red" class="buttontextred">删除</el-button>
				</template>
			</el-table-column>
		</el-table>
			<el-table :data="dataList" :height="maxH - 64"  v-if="pagination.userType==1" style="width: 100%" border>
			<el-table-column :label="pagination.userType==1?'教师姓名':'学生姓名'"  align="center"  show-overflow-tooltip>
				<template slot-scope="scope">
					<span>{{ scope.row.userName }}</span>
				</template>
			</el-table-column>
			<el-table-column :label="pagination.userType==1?'部门':'班级'" align="center" prop="className">
				<template slot-scope="scope">
					<span>
						{{ scope.row.departName }}
					</span>
				</template>
			</el-table-column>
			<el-table-column label="手机号" v-if="pagination.userType==1" align="center">
				<template slot-scope="scope">
					<span>{{ scope.row.mobile }}</span>
				</template>
			</el-table-column>
			<el-table-column label="车牌号" align="center">
				<template slot-scope="scope">
					<span>
						{{ scope.row.carNoList }}
					</span>
				</template>
			</el-table-column>
            <el-table-column label="登记时间" align="center">
				<template slot-scope="scope">
					<span>
						{{ scope.row.createTime.slice(0,19) }}
					</span>
				</template>
			</el-table-column>
			<el-table-column width="140" label="操作" align="center">
				<template slot-scope="scope">
					<el-button type="text" size="small" @click="dialogFormVisiblefun(scope.row)">编辑</el-button>
					<el-button type="text" size="small" @click="delCarUserByUserId(scope.row.userId)" style="color: red" class="buttontextred">删除</el-button>
				</template>
			</el-table-column>
		</el-table>
		<div class="pagination-container">
			<el-pagination
				@size-change="sizeChangeHandler"
				@current-change="currentChangeHandler"
				:current-page.sync="pagination.pageNo"
				:page-sizes="[10, 20, 30, 50]"
				:page-size.sync="pagination.pageSize"
				layout="total, sizes, prev, pager, next, jumper"
				:page-count="pagination.pages"
				:total="pagination.total"
			></el-pagination>
		</div>
		<el-dialog :title="id?'编辑车辆登记':'新增车辆登记'" :visible.sync="dialogFormVisible">
			<el-form :model="query" :rules="rules" ref="dialogForm">
				<el-form-item v-if="!id" :label="pagination.userType==1?'教师:':'学生:'" prop="teacherJson" :label-width="formLabelWidth">
					<address-book v-model="query.teacherJson" :groupDisabled="true" :config="pagination.userType==1?configData:configDatatwo" @input="confirmChoose" :isSchoolManager="true"></address-book>
				</el-form-item>
					<el-form-item v-if="id" :label="pagination.userType==1?'教师:':'学生:'" :label-width="formLabelWidth">
					{{userName}}
					</el-form-item>
					<el-form-item label="车牌号:" v-if="pagination.userType==2" :label-width="formLabelWidth" prop="carNo">
					<el-input v-model.trim="query.carNo" placeholder="请输入车牌号"></el-input>
				</el-form-item>
				<el-form-item label="车牌号1:" v-if="pagination.userType==1" :label-width="formLabelWidth" prop="carNo">
					<el-input v-model.trim="query.carNo" placeholder="请输入车牌号"></el-input>
				</el-form-item>
				<el-form-item label="车牌号2:" v-if="pagination.userType==1" :label-width="formLabelWidth" >
					<el-input v-model.trim="query.carNo2" placeholder="请输入车牌号"></el-input>
				</el-form-item>
				<el-form-item label="车牌号3:" v-if="pagination.userType==1" :label-width="formLabelWidth">
					<el-input v-model.trim="query.carNo3" placeholder="请输入车牌号"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="dialogFormVisible = false">取 消</el-button>
				<el-button type="primary" @click="confirmAdd">确 定</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
import windowResize from '@/mixins/windowResize'
import baseMixin from '@/mixins/baseMixin'
import AddressBook from '@/components/AddressBook/indexExpand'
import { getCarUserListPage, addCarUser, delCarUserByUserId ,updateCarUser,addUpdateCarUserList} from '@/api/carAttendance'
export default {
	name: 'carManage',
	data() {
		const teacherJsonValidator = (rule, value, callback) => {
			if (!this.query.teacherJson.userJson || !this.query.teacherJson.userJson.length) {
				if(this.pagination.userType==1){
                  callback(new Error('请选择老师'))
				}else{
                  callback(new Error('请选择学生'))
				}
				
			} else {
				callback()
			}
		}
		return {
			query: {
				carNo: '',
				carNo2:'',
				carNo3:'',
				teacherJson: {userJson:[]}
			},
			uploadFilePath: '',
			exportUrl: '',
			isAdd: '',
			formLabelWidth: '120px',
			dialogFormVisible: false,
			searchName: '',
			configData: {
				title: '选择老师',
				depart: {
					target: 'user',
					departType: 't',
					userTypes: '1',
					notCheckSchool: true
				},
				SingleChose: true,
				group: {
					groupTarget: 'all',
					groupScope: [1]
				}
				// group: true
			},
			configDatatwo: {
				title: '选择学生',
				depart: {
					target: 'user',
					departType: 's',
					userTypes: '2',
					notCheckSchool: true
				},
				SingleChose: true,
				group: {
					groupTarget: 'all',
					groupScope: [2]
				}
				// group: true
			},
			rules: {
				teacherJson: [
					{
						required: true,
						validator: teacherJsonValidator,
						trigger: 'blur'
					}
				],
				carNo: [{ required: true, message: '请填写车牌号', trigger: 'blur' }]
			},
			dataList: [],
			pagination: {
				pageNo: 1,
				pageSize: 10,
				total: 0,
				userType:2
			},
			uploadData: {
				token: this.$store.getters.token,
				userType:2
			},
			id:0,
			userName:"",
			userId:""
		}
	},
	filters: {
		timeFilter(time) {
			return time ? time.substring(0, 19) : ''
		}
	},
	components: {
		AddressBook
	},
	watch: {
		dialogFormVisible(val) {
			if (val) {
				this.$refs.dialogForm && this.$refs.dialogForm.clearValidate()
			} else {
				this.$nextTick(() => {
					this.query.teacherJson = ''
					this.query.carNo = ''
					this.query.carNo2 = ''
					this.query.carNo3 = ''
				})
			}
		}
	},
	created() {
		this.queryListFunc()
		this.uploadFilePath = global.BasePath + 'structure/car/uploadCarUserList'
	},
	mixins: [windowResize, baseMixin],
	methods: {
		dialogFormVisiblefun(obj){
			this.id=obj.id
			this.userName=obj.userName
			this.userId=obj.userId
			if(this.pagination.userType==2){
				this.query.carNo=obj.carNo
			}else{
				this.query.carNo=obj.carNoList.split(',')[0]
				this.query.carNo2=obj.carNoList.split(',')[1]||''
				this.query.carNo3=obj.carNoList.split(',')[2]||''
			}
			
			this.dialogFormVisible=true
		},
		handleFileSuccess(res) {
			if (res.code === 200 && !res.data) {
				this.$message({
					message: '模版导入成功！',
					type: 'success'
				})
				this.pagination.pageNo = 1
				this.queryListFunc()
			} else {
				this.$message({
					message: res.data,
					dangerouslyUseHTMLString: true,
					type: 'error',
					duration: 3 * 1000
				})
				this.pagination.pageNo = 1
				this.queryListFunc()
			}
		},
		beforeFileUpload(file) {
			let suffix = file.name.split('.')[file.name.split('.').length - 1]
			if (suffix !== 'xls' && suffix !== 'xlsx') {
				this.$message.error('请上传后缀为.xls,.xlsx的模版文件!')
				return false
			} else {
				this.listLoading = true
			}
		},

		confirmChoose() {
			this.$refs.dialogForm.validate('teacherJson')
		},
		//新建确认
		confirmAdd() {
			this.$refs.dialogForm.validate(valid => {				
				if (valid) {
					if(this.pagination.userType==2){
						if(!this.id){
						let userId = this.query.teacherJson.userJson[0].id
				        let userName = this.query.teacherJson.userJson[0].name
						addCarUser({ carNo: this.query.carNo, userId: userId, userName: userName,userType:this.pagination.userType }).then(res => {
							if(res.data.code==200){
								this.queryListFunc().then(res => {
								this.$message.success('新增成功!')
								this.query.teacherJson = ''
								this.query.carNo = ''
								this.query.carNo2 = ''
								this.query.carNo3 = ''
								this.dialogFormVisible = false
								this.id=0
							})
							}else{
                               this.$message.error(res.data.msg)
							}
							
				    	})
					}else{
						updateCarUser({id:this.id, carNo: this.query.carNo, userId: this.userId, userName: this.userName,userType:this.pagination.userType }).then(res => {
							if(res.data.code==200){
							this.queryListFunc().then(res => {
								this.$message.success('编辑成功!')
								this.query.teacherJson = ''
								this.query.carNo = ''
								this.query.carNo2 = ''
								this.query.carNo3 = ''
								this.dialogFormVisible = false
								this.id=0
							})
							}else{
                               this.$message.error(res.data.msg)
							}
							
				    	})
					}

					}else{
						if((this.query.carNo&&this.query.carNo2&&(this.query.carNo==this.query.carNo2))||((this.query.carNo&&this.query.carNo3)&&(this.query.carNo==this.query.carNo3))||((this.query.carNo2&&this.query.carNo3)&&(this.query.carNo2==this.query.carNo3))){
							 this.$message.error('绑定车牌号不能重复')
							 return
						}
						if(!this.id){
						let userId = this.query.teacherJson.userJson[0].id
				        let userName = this.query.teacherJson.userJson[0].name
						let carNoList=this.query.carNo
						if(this.query.carNo2){
                          carNoList+=(','+this.query.carNo2)
						}
						if(this.query.carNo3){
                          carNoList+=(','+this.query.carNo3)
						}
						addUpdateCarUserList({ carNoList: carNoList, userId: userId, userName: userName,userType:this.pagination.userType }).then(res => {
							if(res.data.code==200){
								this.queryListFunc().then(res => {
								this.$message.success('新增成功!')
								this.query.teacherJson = ''
								this.query.carNo = ''
								this.query.carNo2 = ''
								this.query.carNo3 = ''
								this.dialogFormVisible = false
								this.id=0
							})
							}else{
                               this.$message.error(res.data.msg)
							}
							
				    	})
					}else{
						let carNoList=this.query.carNo
						if(this.query.carNo2){
                          carNoList+=(','+this.query.carNo2)
						}
						if(this.query.carNo3){
                          carNoList+=(','+this.query.carNo3)
						}
						addUpdateCarUserList({id:this.id, carNoList: carNoList, userId: this.userId, userName: this.userName,userType:this.pagination.userType }).then(res => {
							if(res.data.code==200){
							this.queryListFunc().then(res => {
								this.$message.success('编辑成功!')
								this.query.teacherJson = ''
								this.query.carNo = ''
								this.query.carNo2 = ''
								this.query.carNo3 = ''
								this.dialogFormVisible = false
								this.id=0
							})
							}else{
                               this.$message.error(res.data.msg)
							}
							
				    	})
					}
					}
					
					
				}
			})
		},
		addIt() {
			this.dialogFormVisible = true
			this.isAdd = true
			this.id=0
		},
		searchList() {
			this.pagination.pageNo = 1
			this.queryListFunc()
		},
		sizeChangeHandler() {
			this.pagination.pageNo = 1
			this.queryListFunc()
		},
		currentChangeHandler() {
			this.queryListFunc()
		},
		delCarUserByUserId(id) {
			this.$confirm('确认要删除该车牌用户信息吗？', '删除', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning',
				lockScroll: false
			}).then(() => {
				delCarUserByUserId({
					userId: id
				}).then(() => {
					this.queryListFunc().then(res => {
						this.$message.success('删除成功!')
					})
				})
			})
		},
		queryListFunc() {
			this.uploadData.userType=this.pagination.userType
			return getCarUserListPage({userId:0,departId:0,userType:this.pagination.userType,pageNo: this.pagination.pageNo, pageSize: this.pagination.pageSize, userName: this.searchName }).then(res => {
				this.dataList = res.data.data.dataList
				this.pagination.total = res.data.data.pagination.total
				this.exportUrl = global.BasePath + 'structure/car/exportCarUserList?userName=' + this.searchName + '&token=' + this.$store.getters.token+'&departId=0&userType=' + this.pagination.userType
				return res
			})
		}
	}
}
</script>
<style>
.common_wrap-carAttendance .el-dialog {
	width: 700px !important;
}
</style>
<style lang="scss" scoped>
.upload-import {
	display: inline-block;
}
.common_wrap-carAttendance {
	padding: 12px;

	.header {
		padding-bottom: 10px;
		overflow: hidden;
	}

	.pagination-container {
		margin-top: 10px;
	}
}
</style>
