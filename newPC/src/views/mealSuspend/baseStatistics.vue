<template>
	<div class="common_wrap">
		<div class="header">
			<el-row>
				<el-col>
					<el-select v-model="formData.schoolTimeId" size="medium" placeholder="请选择" @change="queryListFunc" style="width:200px">
						<el-option :label="item.schoolTimeName" :value="item.id" v-for="item in termList" :key="item.id"></el-option>
					</el-select>
					<el-select v-model="formData.fireType" size="medium" placeholder="请选择" style="width:100px" @change="fireTypeChange">
						<el-option label="学生" :value="2"></el-option>
						<el-option label="老师" :value="1"></el-option>
					</el-select>

					<el-select v-model="restaurantIds" size="medium" multiple :filterable="true" collapse-tags placeholder="请选择或输入就餐地点" @clear="queryListFunc" @change="restaurantIdsChange">
						<el-option label="全部就餐地点" :value="0"></el-option>
						<el-option :label="item.name" :value="item.id" v-for="item in eattingAddressList" :key="item.id"></el-option>
					</el-select>

					<el-select v-model="formData.mealType" size="medium" placeholder="请选择" @change="queryListFunc" style="width:100px">
						<el-option :label="mealTypeList.label" :value="mealTypeList.value"></el-option>
						<el-option label="早餐" v-if="formData.fireType==2" :value="0"></el-option>
						<el-option label="午餐" :value="1"></el-option>
						<el-option label="晚餐" :value="3"></el-option>
						
					</el-select>

					<el-date-picker v-model="dateRange" size="medium" :clearable="false" @change="queryListFunc" type="daterange" class="mywidthdaterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
					<a :href="eatingAddressUrl" target="_blank" v-if="eattingAddressList.length">
						<el-button size="medium" type="primary">按就餐点导出</el-button>
					</a>
					<a :href="detailUrl" target="_blank" v-show="dataList.length">
						<el-button size="medium" type="primary">导出明细</el-button>
					</a>
					<el-button size="medium" type="primary" @click="cancelFireByIds()" v-if="isShowByPermission('/repastManagement/delRepastManagementUser')">批量删除</el-button>
					<el-input class="search-input" style="width:15%;float: right;margin: 0 10px;"  placeholder="请输入姓名" icon="search" size="medium" @change="queryListFunc()"
                          v-model.trim="formData.userName">
                           <el-button slot="append" icon="el-icon-search" @click="queryListFunc()"></el-button>
            </el-input>
				</el-col>
			</el-row>
		</div>
		<h5>{{ titleList }}</h5>
		<el-table :data="dataList" :height="maxH - 50" style="width: 100%" border   @select="selectionChangeHandler"
                            @select-all="selectionChangeHandler">
							   <el-table-column type="selection" width="55" ></el-table-column>
			<el-table-column label="姓名" align="center" width="350px" show-overflow-tooltip>
				<template slot-scope="scope">
					<span>{{ scope.row.userName }}</span>
				</template>
			</el-table-column>
			<el-table-column label="手机号码" align="center" prop="className" v-if="formData.fireType == 1">
				<template slot-scope="scope">
					<span>{{ scope.row.mobile || '--' }}</span>
				</template>
			</el-table-column>
			<el-table-column label="就餐地点" align="center">
				<template slot-scope="scope">
					<span>{{ scope.row.restaurantName }}</span>
				</template>
			</el-table-column>
			<el-table-column label="停伙日期" align="center">
				<template slot-scope="scope">
					<span>
						{{ scope.row.fireDate }}
					</span>
				</template>
			</el-table-column>
			<el-table-column label="类型" align="center">
				<template slot-scope="scope">
					<span v-if="scope.row.mealType==0">早餐</span>
                    <span v-if="scope.row.mealType==1">午餐</span>
                    <span v-if="scope.row.mealType==2">课间餐</span>
                    <span v-if="scope.row.mealType==3">晚餐</span>
				</template>
			</el-table-column>
			<el-table-column label="备注" align="center">
				<template slot-scope="scope">
					<span>{{ scope.row.remark || '--' }}</span>
				</template>
			</el-table-column>
			<el-table-column align="center" label="停伙方式" >
                     <template slot-scope="scope">
                         <el-tag  size="mini" v-if="scope.row.operateType == 1">代停伙</el-tag>
                        <el-tag  size="mini"  type="success" v-if="scope.row.operateType == 0">自己申请</el-tag>
                     </template>
                 </el-table-column>
			<el-table-column width="140" label="操作" align="center">
				<template slot-scope="scope">
					<el-button type="text" size="small" style="color: red" @click="deleteHandler(scope.row.id)" class="buttontextred">删除</el-button>
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
import {isShowByPermission} from '@/utils';
import windowResize from '@/mixins/windowResize'
import baseMixin from '@/mixins/baseMixin'
import { getBaseStatistics, getRestaurantListBySchoolIdAndRestaurantType, getSchoolTimeAllList, cancelFireById,cancelFireByIds} from '@/api/mealSuspend'
export default {
	name: 'commonList',
	data() {
		return {
			eatingAddressUrl: '',
			detailUrl: '',
			titleList: '',
			formData: {
				fireType: 1,
				schoolTimeId: 0,
				mealType: 0,
				userName:""
			},
			dateRange: [],
			restaurantIds: [],
			isAdd: '',
			formLabelWidth: '120px',
			dialogFormVisible: false,
			searchName: '',
			pickOptions: {
				disabledDate(time) {
					return time.getTime() <= Date.now() - 60 * 60 * 24 * 1000
				}
			},
			pagination: {
				pageNo: 1,
				pageSize: 10,
				total: 0,
				pages: 0
			},

			eattingAddressList: [],
			termList: [],
			dataList: [],
			typeList: { 1: '中小学' },
			restaurantIds2: '',
			selected:[],
		}
	},
	computed: {
		mealTypeList() {
			return this.formData.fireType === 1 ? { value: 0, label: '早餐' } : { value: 2, label: '课间餐' }
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
		isShowByPermission,
		cancelFireByIds() {
                if(this.selected.length === 0) {
                    this.$message.error('请选择要删除的停伙');
                } else {
                    this.$confirm('删除停伙无法恢复，确认要批量删除停伙吗?', '批量删除停伙', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        cancelFireByIds(this.selected.map(item => item.id))
                            .then(res => res.data)
                            .then(data => {
                                if (data.result) {
                                    this.$message.success('批量删除停伙成功');
									this.selected=[];
                                    this.queryListFunc()
                                }
                            })
                    });
                }
            },
              selectionChangeHandler(selection) {
                this.selected = selection;
            },
		restaurantIdsChange(val) {
			if (val.includes(0) && !this.restaurantIds2.includes(0)) {
				this.restaurantIds = this.eattingAddressList.map(({ id }) => id)
				this.restaurantIds.unshift(0)
				this.restaurantIds2 = this.restaurantIds
			} else if (val.includes(0) && this.restaurantIds2.includes(0)) {
				let index = val.findIndex(v => v === 0)
				this.restaurantIds.splice(index, 1)
				this.restaurantIds2 = this.restaurantIds
			} else if (!val.includes(0) && this.restaurantIds2.includes(0)) {
				this.restaurantIds = []
				this.restaurantIds2 = this.restaurantIds
			} else if (!val.includes(0) && !this.restaurantIds2.includes(0)) {
				if (val.length === this.eattingAddressList.length) {
					this.restaurantIds.push(0)
					this.restaurantIds2 = this.restaurantIds
				}
			}
			this.queryListFunc()
		},
		getSchoolTimeAllList() {
			getSchoolTimeAllList().then(res => {
				this.termList = res.data.data
				this.formData.schoolTimeId = res.data.data.find(v => v.isCurrent).id
				this.getRestaurantListBySchoolIdAndRestaurantType()
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
			let ids = this.restaurantIds.join(',')
			if (!ids.length) {
				this.dataList = []
				return
			}
			let startDate = this.dateRange[0] ? this.$moment(this.dateRange[0]).format('YYYY-MM-DD') : ''
			let endDate = this.dateRange[1] ? this.$moment(this.dateRange[1]).format('YYYY-MM-DD') : ''
			getBaseStatistics({ ...this.formData, pageSize: this.pagination.pageSize, pageNo: this.pagination.pageNo, restaurantIds: ids, startDate: startDate, endDate: endDate }).then(res => {
				this.dataList = res.data.data.dataList
				this.pagination.total = res.data.data.pagination.total
				this.pagination.pages = res.data.data.pagination.pages
				this.titleList = res.data.data.titleList
				this.eatingAddressUrl = global.BasePath + `structure/repastManagement/downRestaurantFire?endDate=${endDate}&fireType=${this.formData.fireType}&mealType=${this.formData.mealType}&schoolTimeId=${this.formData.schoolTimeId}&startDate=${startDate}&token=${this.$store.getters.token}`
				this.detailUrl =
					global.BasePath + `structure/repastManagement/downStatisticsFire?restaurantIds=${ids}&endDate=${endDate}&fireType=${this.formData.fireType}&mealType=${this.formData.mealType}&schoolTimeId=0&startDate=${startDate}&token=${this.$store.getters.token}`
			})
		},
		fireTypeChange() {
			this.formData.mealType = this.mealTypeList.value
			this.getRestaurantListBySchoolIdAndRestaurantType().then(res => {
				this.queryListFunc()
			})
		},
		getRestaurantListBySchoolIdAndRestaurantType() {
			return getRestaurantListBySchoolIdAndRestaurantType({ fireType: this.formData.fireType }).then(res => {
				this.eattingAddressList = res.data.data.map(v => {
					return {
						id: v.id,
						name: v.restaurantName
					}
				})
				this.restaurantIds = [this.eattingAddressList[0].id]
				this.queryListFunc()
				return res
			})
		}
	}
}
</script>
<style lang="scss" scoped>
.common_wrap {
	padding: 12px;

	.header {
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
