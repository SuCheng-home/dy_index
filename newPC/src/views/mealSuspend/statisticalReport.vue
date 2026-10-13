<template>
	<div class="common_wrap">
		<div class="header">
			<el-row>
				<el-col :span="19">
					<el-select v-model="formData.schoolTimeId" placeholder="请选择" @change="queryListFunc" style="width:200px" size="medium">
						<el-option :label="item.schoolTimeName" :value="item.id" v-for="item in termList" :key="item.id"></el-option>
					</el-select>
					<el-select v-model="formData.fireType" placeholder="请选择" @change="fireTypeChange" style="width:100px" size="medium">
						<el-option label="学生" :value="2"></el-option>
						<el-option label="老师" :value="1"></el-option>
					</el-select>
					<el-select v-show="formData.fireType === 1" size="medium" v-model="departIds" @change="departIdsChange" multiple :filterable="true" collapse-tags clearable placeholder="请选择">
						<el-option label="全部部门" :value="0"></el-option>
						<el-option :label="item.name" :value="item.id" v-for="item in departList" :key="item.id"></el-option>
					</el-select>
					<el-date-picker @change="queryListFunc" size="medium" v-model="dateRange" type="daterange" class="mywidthdaterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
					<el-button size="medium"  v-show="formData.fireType === 2" type="primary" @click="updateStuLearNumInfoList">刷新姓名学号</el-button>
					<a :href="exportUrl" target="_blank" v-show="dataList.length">
						<el-button size="medium" type="primary">导出</el-button>
					</a>
				</el-col>
				<el-col :span="5">
					<el-input size="medium" placeholder="请输入姓名" v-model="searchName" @keyup.enter.native="queryListFunc">
						<el-button slot="append" icon="el-icon-search" size="medium" @click="queryListFunc"></el-button>
					</el-input>
				</el-col>
			</el-row>
			<!-- <el-row style="margin-bottom: 10px" v-show="formData.fireType === 1">
				<el-col :span="19">
					<el-date-picker v-model="dateRange" @change="queryListFunc" type="daterange" class="mywidthdaterange" range-separator="~" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
					<a :href="exportUrl" target="_blank" v-show="dataList.length">
						<el-button size="medium" type="primary">导出</el-button>
					</a>
				</el-col>
			</el-row> -->
		</div>
		<el-table :data="dataList" :height="maxH" style="width: 100%" border>
			  <el-table-column align="center" label="学号" v-if="formData.fireType==2" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span >{{scope.row.learnNum}}</span>
                    </template>
                </el-table-column>
			<el-table-column label="姓名" align="center" show-overflow-tooltip>
				<template slot-scope="scope">
					<span>{{ scope.row.userName }}</span>
				</template>
			</el-table-column>
			<el-table-column label="手机号码" align="center" v-if="formData.fireType == 1">
				<template slot-scope="scope">
					<span>{{ scope.row.mobile }}</span>
				</template>
			</el-table-column>
			<el-table-column :label="formData.fireType === 1 ? '部门' : '班级'" align="center">
				<template slot-scope="scope">
					<span>{{ scope.row.className || '--' }}</span>
				</template>
			</el-table-column>
			<el-table-column label="就餐地点" align="center">
				<template slot-scope="scope">
					<span>{{ scope.row.restaurantName }}</span>
				</template>
			</el-table-column>
			<el-table-column label="就餐开始日期" align="center">
				<template slot-scope="scope">
					<span>{{ scope.row.repastDate }}</span>
				</template>
			</el-table-column>
			<el-table-column label="就餐天数" align="center">
				<template slot-scope="scope">
					<span>{{ scope.row.repastDay }}</span>
				</template>
			</el-table-column>
			<el-table-column label="停伙次数" align="center">
				<template slot-scope="scope">
					<span class="link" @click="toPersonalMealsuspend(scope.row.userId)">{{ scope.row.fireCount }}</span>
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
	</div>
</template>

<script>
import windowResize from '@/mixins/windowResize'
import baseMixin from '@/mixins/baseMixin'
import {updateStuLearNumInfoList} from '@/api/eatSetting'
import { queryDepartByTypes, statisticsForm, getRestaurantListBySchoolIdAndRestaurantType, getSchoolTimeAllList, cancelFireById } from '@/api/mealSuspend'
export default {
	name: 'commonList',
	data() {
		return {
			selectAll: false,
			departIds: [],
			eatingAddressUrl: '',
			exportUrl: '',
			titleList: '',
			formData: {
				fireType: 1,
				schoolTimeId: 0,
				mealType: 0
			},
			dateRange: [],
			restaurantIds: [],
			isAdd: '',
			formLabelWidth: '120px',
			dialogFormVisible: false,
			searchName: '',

			pagination: {
				pageNo: 1,
				pageSize: 10,
				total: 0,
				pages: 0
			},

			eattingAddressList: [],
			termList: [],
			departList: [],
			dataList: [
			],
			typeList: { 1: '中小学' },
			departIds2: ''
		}
	},
	filters: {
		timeFilter(time) {
			return time ? time.substring(0, 19) : ''
		}
	},
	watch: {
		dialogFormVisible(val) {
			if (val) {
				this.$refs.dialogForm && this.$refs.dialogForm.clearValidate()
			}
		}
	},
	created() {
		this.dateRange = [this.$moment().startOf('month'), new Date()]
		this.getSchoolTimeAllList()
	},
	mixins: [windowResize, baseMixin],
	methods: {
		updateStuLearNumInfoList() {
			this.$confirm('确认要刷新姓名学号？', '复制', {
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
		departIdsChange(val) {
			if (val.includes(0) && !this.departIds2.includes(0)) {
				this.departIds = this.departList.map(({ id }) => id)
				this.departIds.unshift(0)
				this.departIds2 = this.departIds
			} else if (val.includes(0) && this.departIds2.includes(0)) {
				let index = val.findIndex(v => v === 0)
				this.departIds.splice(index, 1)
				this.departIds2 = this.departIds
			} else if (!val.includes(0) && this.departIds2.includes(0)) {
				this.departIds = []
				this.departIds2 = this.departIds
			} else if (!val.includes(0) && !this.departIds2.includes(0)) {
				if (val.length === this.departList.length) {
					this.departIds.push(0)
					this.departIds2 = this.departIds
				}
			}
			this.queryListFunc()
		},
		toPersonalMealsuspend(userId) {
			this.$router.push({
				path: 'personalMealsuspend',
				query: {
					userId: userId,
					startDate: this.$moment(this.dateRange[0]).format('YYYY-MM-DD'),
					endDate: this.$moment(this.dateRange[1]).format('YYYY-MM-DD'),
					fireType: this.formData.fireType,
					schoolTimeId: this.formData.schoolTimeId
				}
			})
		},
		queryDepartByTypes() {
			return queryDepartByTypes({ types: '7' }).then(res => {
				this.departList = res.data.data.map(v => {
					return {
						id: v.id,
						name: v.name
					}
				})
				this.departIds = [this.departList[0].id]
				return res
			})
		},
		getSchoolTimeAllList() {
			getSchoolTimeAllList().then(res => {
				this.termList = res.data.data
				this.formData.schoolTimeId = res.data.data.find(v => v.isCurrent).id
				this.queryDepartByTypes().then(res => {
					this.queryListFunc()
				})
			})
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
		deleteHandler(id) {
			this.$confirm('确认要删除此条数据吗？', '删除', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning',
				lockScroll: false
			}).then(() => {
				cancelFireById({
					fireId: id
				}).then(() => {
					this.queryListFunc()
					this.$message.success('删除成功！')
				})
			})
		},
		queryListFunc() {
			let ids = this.departIds.join(',')
			if (!ids.length && this.formData.fireType == 1) {
				this.dataList = []
				return
			}
			let startDate = this.dateRange[0] ? this.$moment(this.dateRange[0]).format('YYYY-MM-DD') : ''
			let endDate = this.dateRange[1] ? this.$moment(this.dateRange[1]).format('YYYY-MM-DD') : ''
			statisticsForm({ ...this.formData, pageSize: this.pagination.pageSize, pageNo: this.pagination.pageNo, departIds: ids, startDate: startDate, endDate: endDate, searchName: this.searchName }).then(res => {
				this.dataList = res.data.data.dataList
				this.pagination.total = res.data.data.pagination.total
				this.pagination.pages = res.data.data.pagination.pages
				this.titleList = res.data.data.titleList
				this.exportUrl =
					global.BasePath +
					`structure/repastManagement/downFire?pageNo=${this.pagination.pageNo}&pageSize=${this.pagination.pageSize}&departIds=${ids}&endDate=${endDate}&fireType=${this.formData.fireType}&mealType=${this.formData.mealType}&schoolTimeId=${this.formData.schoolTimeId}&startDate=${startDate}&searchName=${this.searchName}&token=${this.$store.getters.token}`
			})
		},
		fireTypeChange(val) {
			if (val === 1) {
				this.departIds = [this.departList[0].id]
				this.queryListFunc()
			} else {
				this.departIds = []
				this.queryListFunc()
			}
		}
	}
}
</script>
<style lang="scss" scoped>
.common_wrap {
	padding: 12px;

	.header {
		padding-bottom: 10px;
		overflow: hidden;
		.rowSpan {
			font-size: 14px;
			margin-left: 10px;
			color: #606266;
		}
	}

	.pagination-container {
		margin-top: 10px;
	}
}
</style>
