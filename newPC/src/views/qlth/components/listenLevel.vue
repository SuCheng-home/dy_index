<template>
	<div class="common_wrap">
		<div class="header">
			<el-row>
				<el-col :span="19">
					<el-button size="medium" @click="$router.back()">返回</el-button>
					<el-select @change="batchClassRecordRankList" v-model="query.role" placeholder="请选择身份">
						<el-option label="师傅" value="1"></el-option>
						<el-option label="徒弟" value="2"></el-option>
					</el-select>
					<el-select @change="batchClassRecordRankList" v-model="query.month" placeholder="请选择月份">
						<el-option :label="item.label" :value="item.value" v-for="(item, index) in monthList" :key="index"></el-option>
					</el-select>
					<a :href="exportUrl" downLoad="青蓝同辉听课排名">
						<el-button size="medium" type="primary" v-if="dataList.length">导出</el-button>
					</a>
				</el-col>
				<el-col :span="5">
					<el-input size="medium" placeholder="请输入教师姓名" v-model="searchName" @keyup.enter.native="batchClassRecordRankList">
						<el-button slot="append" icon="el-icon-search" size="medium" @click="batchClassRecordRankList"></el-button>
					</el-input>
				</el-col>
			</el-row>
		</div>
		<el-table :data="dataList" :height="maxH - 37" style="width: 100%" border>
			<el-table-column label="教师姓名" align="center" width="350px" show-overflow-tooltip>
				<template slot-scope="scope">
					<span>{{ scope.row.createUserName }}</span>
				</template>
			</el-table-column>
			<el-table-column label="听课次数" align="center" prop="recordCount"></el-table-column>
		</el-table>
	</div>
</template>

<script>
import windowResize from '@/mixins/windowResize'
import baseMixin from '@/mixins/baseMixin'
import { batchClassRecordRankList, getCyanBlueBatchClassRecordMonthList } from '@/api/qlthSetting'
export default {
	name: 'commonList',
	props: {
		id: {
			type: String,
			default: ''
		}
	},
	data() {
		return {
			exportUrl: '',
			monthList: [],
			query: {
				role: '1',
				month: 0
			},

			searchName: '',

			dataList: []
		}
	},

	created() {
		this.getCyanBlueBatchClassRecordMonthList()
	},
	mixins: [windowResize, baseMixin],
	methods: {
		getCyanBlueBatchClassRecordMonthList() {
			getCyanBlueBatchClassRecordMonthList({
				batchId: this.id
			}).then(res => {
				this.monthList = res.data.data.map((v, index) => {
					return {
						value: index + 1,
						label: v
					}
				})
				this.monthList.unshift({
					value: 0,
					label: '全部月份'
				})
			})
			this.batchClassRecordRankList()
		},
		batchClassRecordRankList() {
			batchClassRecordRankList({
				batchId: this.id,
				classMonth: this.query.month === 0 ? '' : this.monthList[this.query.month].label,
				searchName: this.searchName,
				thType: this.query.role
			}).then(res => {
				this.dataList = res.data.data
				this.exportUrl = global.BasePath + `structure/cyanBlue/exportClassRecordRankData?classMonth=${this.query.month === 0 ? '' : this.monthList[this.query.month].label}&batchId=${this.id}&searchName=${this.searchName}&thType=${this.query.role}&token=${this.$store.getters.token}`
			})
		}
	}
}
</script>
<style lang="scss" scoped>
.common_wrap {
	.header {
		padding-bottom: 10px;
		overflow: hidden;
	}

	.pagination-container {
		margin-top: 10px;
	}
}
</style>
