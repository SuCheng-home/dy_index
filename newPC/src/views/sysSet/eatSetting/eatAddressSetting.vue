<template>
	<div class="common_wrap">
		<div class="header">
			<el-row>
				<el-col :span="19">
					<el-button size="medium" @click="$router.back()">返回</el-button>
					<el-button size="medium" type="primary" @click="copyLastSetting">复制上学期设置</el-button>
					<!-- <el-button size="medium" type="primary" @click="resetDate">初始化</el-button> -->
					<el-button size="medium" type="primary" @click="$router.push('addNewEattingAddress')">新建</el-button>					
					<el-button size="medium" type="danger" @click="batchDeleteHandler">删除</el-button>
					<el-button size="medium" type="primary" @click="updateStuLearNumInfoList">刷新姓名学号</el-button>
					<el-button size="medium" type="primary" @click="$router.push('eatSettingclasslist')">班级统计</el-button>
					<a :href="exportUrl" target="_blank"><el-button size="medium" type="primary">导出</el-button></a>
					<a :href="exportUrlall" target="_blank"><el-button size="medium" type="primary">导出全部</el-button></a>
					<a href="https://cdnfile-10043692.file.myqcloud.com/misc/student_diet_import_tmpl2.xls" target="_blank"><el-button size="medium" type="primary">下载模板</el-button></a>
					<el-upload style="display:inline-block;" class="upload-import" name="file" :action="uploadPath" :data="uploadData" :show-file-list="false" :before-upload="beforeAvatarUpload" :on-success="handleAvatarSuccess">
						<el-button type="primary" size="medium">导入学生</el-button>
					</el-upload>
				</el-col>
				<el-col :span="5">
					<el-input size="medium" placeholder="请输入就餐地点" v-model="searchName" @keyup.enter.native="searchList">
						<el-button slot="append" icon="el-icon-search" size="medium" @click="searchList"></el-button>
					</el-input>
				</el-col>
			</el-row>
		</div>
		<el-table :data="dataList" :height="maxH - 55" style="width: 100%" border @selection-change="handleSelectionChange">
			<el-table-column type="selection" align="center"></el-table-column>
			<el-table-column label="就餐地点" align="center" show-overflow-tooltip>
				<template slot-scope="scope">
					<span>{{ scope.row.restaurantName }}</span>
				</template>
			</el-table-column>
			<el-table-column label="地点负责人" align="center">
				<template slot-scope="scope">
					<span>{{ scope.row.userJson ? getUserManage(scope.row.userJson) : '--' }}</span>
				</template>
			</el-table-column>
			<el-table-column label="类型" align="center">
				<template slot-scope="scope">
					<span>{{ scope.row.restaurantType === 1 ? '教师食堂' : '学生食堂' }}</span>
				</template>
			</el-table-column>
			<el-table-column label="就餐人数" align="center" prop="repastCount"></el-table-column>
			<el-table-column label="排序" align="center" prop="orderNo"></el-table-column>
			<el-table-column label="操作" align="center">
				<template slot-scope="scope">
					<el-button type="text" size="small" @click="toMaintainUser(scope.row.id, scope.row.restaurantType)">维护就餐人员</el-button>
					<el-button type="text" size="small" style="color: red" @click="deleteHandler(scope.row.id)" class="buttontextred">删除</el-button>
					<el-button type="text" size="small" @click="toEditPage(scope.row.id)">编辑</el-button>
					<el-button type="text" size="small" @click="handleDownload(scope.row.codeUrl)" v-if="scope.row.restaurantType === 1">下载二维码</el-button>
				</template>
			</el-table-column>
		</el-table>
		<address-book ref="addressBook" v-show="addressBookShow" v-model="stuAddressData" :config="stuConfigData" :isSchoolManager="true" @input="addNotEating"></address-book>
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
	</div>
</template>

<script>
import windowResize from '@/mixins/windowResize'
import baseMixin from '@/mixins/baseMixin'
import AddressBook from '@/components/AddressBook/indexExpand'
import { queryRestaurantBySchoolId, deleteRestaurantByIds, initFireManage, copyTermRepastUser, getRestaurantQrCodeUrl,updateStuLearNumInfoList} from '@/api/eatSetting'
export default {
	name: 'multiList',
	data() {
		return {
			uploadPath: '',
			uploadData: '',
			exportUrl: '',
			exportUrlall:'',
			addressBookShow: false,
			searchName: '',
			dataList: [],
			typeList: { 1: '中小学' },
			multipleSelection: [],
			stuAddressData: [],
			stuConfigData: {
				title: '请选择学生',
				depart: {
					target: 'all',
					departType: 's',
					userTypes: '2'
					// notCheckSchool: true
				},
				group: true
				// SingleChose: true
			}
		}
	},
	components: {
		AddressBook
	},
	filters: {
		timeFilter(time) {
			return time ? time.substring(0, 19) : ''
		}
	},
	computed: {
		getUserManage() {
			return val => {
				let userManager = []
				JSON.parse(val).forEach(v => {
					userManager.push(v.name)
				})
				return userManager.join(',')
			}
		}
	},
	created() {
		this.queryListFunc()
		this.uploadPath = global.BasePath + 'structure/repastManagement/uploadRepastUser'
		this.uploadData = {
			token: this.$store.getters.token
		}
	},
	mounted() {},
	mixins: [windowResize, baseMixin],
	methods: {
		handleDownload(codeUrl) {
			const name = '食堂二维码'
			const url = 'https' + codeUrl.slice(4)
			console.log(url)
			const suffix = url.substring(url.lastIndexOf('.'), url.length)

			const x = new XMLHttpRequest()
			x.open('GET', url, true)
			x.responseType = 'blob'
			x.onload = function(e) {
				const url = window.URL.createObjectURL(x.response)
				const a = document.createElement('a')

				a.href = url
				a.download = name + suffix
				a.click()
			}
			x.send()
		},
		beforeAvatarUpload(file) {
			let suffix = file.name.split('.')[file.name.split('.').length - 1]
			if (suffix !== 'xls') {
				this.$message.error('上传的文件格式应为模板文件!')
				return false
			}
		},
		handleAvatarSuccess(res) {
			if (res) {
				this.$message({
					message: res,
					type: 'error',
					dangerouslyUseHTMLString: true
				})
				this.queryListFunc()
			} else {
				this.$message({
					message: '模板导入成功！',
					type: 'success'
				})
				this.queryListFunc()
			}
		},
		// 复制上学期
		copyLastSetting() {
			this.$confirm('确认要复制上学期就餐设置？', '复制', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning',
				lockScroll: false
			})
				.then(() => {
					copyTermRepastUser().then(() => {
						this.$message.success('复制上学期就餐设置成功！')
						this.queryListFunc()
					})
				})
				.catch(() => {
					this.$message.info('已取消操作！')
				})
			// this.$confirm('确认要复制上学期就餐设置？', '复制', {
			// 	confirmButtonText: '确定',
			// 	cancelButtonText: '取消',
			// 	type: 'warning',
			// 	lockScroll: false
			// }).then(() => {
			// 		copyTermRepastUser().then(() => {
			// 			this.$message.success('复制上学期就餐设置成功！')
			// 			this.queryListFunc()
			// 		})
			// 	}).catch(() => {
			// 		this.$message.info('已取消操作！')
			// 	})
		},
		updateStuLearNumInfoList() {
			this.$confirm('确认要刷新姓名学号？', '刷新', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning',
				lockScroll: false
			})
				.then(() => {
					updateStuLearNumInfoList().then(() => {
						this.$message.success('刷新姓名学号成功！')
						this.queryListFunc()
					})
				})
				.catch(() => {
					this.$message.info('已取消操作！')
				})
		},
		// 初始化
		resetDate() {
			this.$confirm('确认要初始化停伙日期吗？', '初始化', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning',
				lockScroll: false
			})
				.then(() => {
					initFireManage({}).then(() => {
						this.$message.success('初始化停伙日期成功！')
						this.queryListFunc()
					})
				})
				.catch(() => {
					this.$message.info('已取消操作！')
				})
		},
		addNotEating(e) {
			if (!e.departJson.length && !e.groupJson.length && !e.userJson.length) {
				this.$message({
					type: 'warning',
					message: '请选择要添加的不就餐人员'
				})
				this.$refs.addressBook.dialogTableVisible = true
				return
			}
		},
		toEditPage(id) {
			this.$router.push({
				path: 'addNewEattingAddress',
				query: {
					id: id
				}
			})
		},
		toMaintainUser(id, restaurantType) {
			if(id){
				this.$router.push({
				path: 'maintainEattingUser',
				query: {
					id: id,
					restaurantType: restaurantType
		 		}
			 })

			}
			
		},
		handleSelectionChange(val) {
			this.multipleSelection = val
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
		batchDeleteHandler() {
			if (!this.multipleSelection.length) {
				this.$message.error('请选择要删除的项')
			} else {
				this.deleteHandler(this.multipleSelection.map(({ id }) => id).join(','))
			}
		},
		deleteHandler(ids) {
			this.$confirm('确认要删除吗？', '删除', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning',
				lockScroll: false
			}).then(() => {
				deleteRestaurantByIds({
					restaurantIds: ids
				})
					.then(() => {
						this.$message.success('删除成功！')
						this.queryListFunc()
					})
					.catch(() => {
						this.$message.info('已取消操作！')
					})
			})
		},
		queryListFunc() {
			queryRestaurantBySchoolId({
				searchName: this.searchName || '',
				pageNo: this.pagination.pageNo,
				pageSize: this.pagination.pageSize
			}).then(res => {
				this.dataList = res.data.data.dataList
				this.pagination.total = res.data.data.pagination.total
				let restaurantIds = this.dataList.map(({ id }) => id).join(',')
				this.exportUrlall= global.BasePath + 'structure/repastManagement/batchDownRestaurantUserAll?token=' + this.$store.getters.token
				this.exportUrl = global.BasePath + 'structure/repastManagement/batchDownRestaurantUser?restaurantIds=' + restaurantIds + '&token=' + this.$store.getters.token
				this.dataList.forEach(v => {
					if (v.restaurantType === 1) {
						getRestaurantQrCodeUrl({ restaurantId: v.id }).then(res => {
							this.$set(v, 'codeUrl', res.data.data)
						})
					}
				})
			})
		}
	}
}
</script>
<style lang="scss" scoped>
.common_wrap {
	// padding: 12px;

	.header {
		padding-bottom: 10px;
		overflow: hidden;
	}

	.pagination-container {
		margin-top: 10px;
	}
}
</style>
