<template>
	<div class="campusCirclelistone">
		<el-tabs type="border-card" v-model="activeName" @tab-click="tabsfun()">
			<el-tab-pane label="按老师统计" name="one">
				<div style="padding: 10px">
					<el-row>
						<el-col :span="19">
							<el-button @click="$router.back()" type="default" size="medium">返回</el-button>
							<el-date-picker size="medium" :clearable="false" :editable="false" v-model="teacherTimeRange" @change="teacherTimeRangeChange" type="daterange" class="mywidthdaterange" range-separator="~" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
							<a target="_blank" :href="teacherExportUrl" download="导出结果" v-if="teacherDataList.length">
								<el-button type="primary" size="medium">导出</el-button>
							</a>
						</el-col>
						<el-col :span="5">
							<el-input placeholder="请输入老师姓名" v-model="searchTeacherName" class="input-with-select" size="medium">
								<el-button slot="append" @click="teacherAnalysisBySchoolId()" icon="el-icon-search"></el-button>
							</el-input>
						</el-col>
					</el-row>
				</div>
				<el-table stripe ref="multipleTable" border :data="teacherDataList" :height="maxH - 70" tooltip-effect="dark">
					<el-table-column prop="userName" align="center" label="姓名"></el-table-column>
					<el-table-column prop="departNames" align="center" label="部门" :show-overflow-tooltip="true"></el-table-column>
					<el-table-column prop="circleCount" align="center" label="参与圈子"></el-table-column>
					<el-table-column prop="messageCount" align="center" label="帖子数"></el-table-column>
					<el-table-column prop="digestCount" align="center" label="被加精数"></el-table-column>
					<el-table-column prop="isTopCount" align="center" label="被置顶数"></el-table-column>
					<el-table-column prop="fabulousCount" align="center" label="被点赞数"></el-table-column>
					<el-table-column prop="commentCount" align="center" label="被评论数"></el-table-column>
				</el-table>
				<div style="margin-top: 15px;">
					<el-pagination @size-change="handleSizeChangeTeacher" @current-change="handleCurrentChangeTeacher" :page-sizes="[10, 20, 30, 40]" :page-size="10" layout="total, sizes, prev, pager, next, jumper" :total="total1"></el-pagination>
				</div>
			</el-tab-pane>
			<el-tab-pane label="按学生统计" name="two">
				<div style="padding: 10px">
					<el-row>
						<el-col :span="19">
							<el-button @click="$router.back()" type="default" size="medium">返回</el-button>
							<el-date-picker  size="medium" :clearable="false" :editable="false" v-model="stuTimeRange" @change="stuTimeRangeChange" type="daterange" class="mywidthdaterange" range-separator="~" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
							<el-select v-model="gradeId" placeholder="请选择" size="medium" @change="gradeIdChange">
								<el-option label="全部年级" value="0"></el-option>
								<el-option v-for="item in gradeOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
							</el-select>
							<el-select v-model="classId" placeholder="请选择" size="medium" @change="stuAnalysisBySchoolId">
								<el-option label="全部班级" value="0"></el-option>
								<el-option v-for="item in classOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
							</el-select>
							<a target="_blank" :href="stuExportUrl" download="导出结果"  v-if="stuDataList.length">
								<el-button type="primary" size="medium">导出</el-button>
							</a>
						</el-col>
						<el-col :span="5">
							<el-input placeholder="请输入学生姓名" v-model="searchStuentName" class="input-with-select" size="medium">
								<el-button slot="append" @click="stuAnalysisBySchoolId()" icon="el-icon-search"></el-button>
							</el-input>
						</el-col>
					</el-row>
				</div>

				<el-table stripe ref="multipleTable" border :data="stuDataList" :height="maxH - 70" tooltip-effect="dark">
					<el-table-column prop="userName" align="center" label="姓名"></el-table-column>
					<el-table-column prop="departNames" align="center" label="班级"></el-table-column>
					<el-table-column prop="circleCount" align="center" label="参与圈子"></el-table-column>
					<el-table-column align="center" label="帖子数">
						<template slot-scope="scope">
							{{ scope.row.messageCount + '(' + scope.row.parentRemark + ')' }}
						</template>
					</el-table-column>
					<el-table-column prop="digestCount" align="center" label="被加精数"></el-table-column>
					<el-table-column prop="isTopCount" align="center" label="被置顶数"></el-table-column>
					<el-table-column prop="fabulousCount" align="center" label="被点赞数"></el-table-column>
					<el-table-column prop="commentCount" align="center" label="被评论数"></el-table-column>
				</el-table>
				<div style="margin-top: 15px;">
					<el-pagination @size-change="handleSizeChangeStu" @current-change="handleCurrentChangeStu" :page-sizes="[10, 20, 30, 40]" :page-size="10" layout="total, sizes, prev, pager, next, jumper" :total="total2"></el-pagination>
				</div>
			</el-tab-pane>
			<el-tab-pane label="活跃度统计" name="three">
				<div style="padding: 10px">
					<el-row>
						<el-col :span="19">
							<el-button @click="$router.back()" type="default" size="medium">返回</el-button>
							<el-date-picker  size="medium" :clearable="false" :editable="false" v-model="activeTimeRange" @change="activeTimeRangeChange" type="daterange" class="mywidthdaterange" range-separator="~" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
							<el-select v-model="selectType" placeholder="请选择" size="medium" @change="typeChange">
								<el-option label="全部用户类型" value="0"></el-option>
								<el-option label="学生" value="1"></el-option>
								<el-option label="老师" value="2"></el-option>
							</el-select>
							<el-select v-model="gradeId2" size="medium" placeholder="请选择" v-if="selectType == 1" @change="gradeId2Change">
								<el-option label="全部年级" value="0"></el-option>
								<el-option v-for="item in gradeOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
							</el-select>
							<el-select v-model="classId2" size="medium" placeholder="请选择" @change="activationAnalysis" v-if="selectType == 1">
								<el-option label="全部班级" value="0"></el-option>
								<el-option v-for="item in classOptions2" :key="item.value" :label="item.label" :value="item.value"></el-option>
							</el-select>
							<a target="_blank" :href="activeExportUrl" download="导出结果" v-if="activeDataList.length">
								<el-button type="primary" size="medium">导出</el-button>
							</a>
						</el-col>
						<el-col :span="5">
							<el-input placeholder="请输入姓名" v-model="searchActiveName" class="input-with-select" size="medium">
								<el-button slot="append" @click="activationAnalysis()" icon="el-icon-search"></el-button>
							</el-input>
						</el-col>
					</el-row>
				</div>

				<el-table stripe ref="multipleTable" border :data="activeDataList" :height="maxH - 70" tooltip-effect="dark">
					<el-table-column prop="userName" align="center" label="姓名"></el-table-column>
					<el-table-column prop="userName" align="center" label="身份">
						<template slot-scope="scope">
							{{ scope.row.type === 1 ? '学生' : '老师' }}
						</template>
					</el-table-column>
					<el-table-column prop="departNames" align="center" :show-overflow-tooltip="true" label="班级/部门"></el-table-column>
					<el-table-column prop="fabulousCount" align="center" label="点赞数"></el-table-column>
					<el-table-column prop="commentCount" align="center" label="评论数"></el-table-column>
				</el-table>
				<div style="margin-top: 15px;">
					<el-pagination @size-change="handleSizeChangeActive" @current-change="handleCurrentChangeActive" :page-sizes="[10, 20, 30, 40]" :page-size="10" layout="total, sizes, prev, pager, next, jumper" :total="total3"></el-pagination>
				</div>
			</el-tab-pane>
		</el-tabs>
	</div>
</template>
<script>
import mixin from '@/mixins/windowResize'
import { stuAnalysisBySchoolId, teacherAnalysisBySchoolId, querySchoolGrade, queryClassByGradeId, activationAnalysis } from '@/api/schoolCircle'
export default {
	data() {
		return {
			selectType: '0',
			teacherTimeRange: [],
			stuTimeRange: [],
			activeTimeRange: [],
			searchStuentName: '',
			searchTeacherName: '',
			searchActiveName: '',
			pageSize1: 10,
			pageSize2: 10,
			pageSize3: 10,
			pageNo1: 1,
			pageNo2: 1,
			pageNo3: 1,
			gradeId: '0',
			classId: '0',
			gradeId2: '0',
			classId2: '0',
			teacherDataList: [],
			stuDataList: [],
			activeDataList: [],
			activeName: 'one',
			id: this.$route.query.id||'',
			namelist: ['帖子总数', '精华贴'],
			stuNumlist: [{ list: [] }],
			numlist: [{ list: [] }],
			gradeOptions: [],
			classOptions: [],
			classOptions2: [],
			total1: 0,
			total2: 0,
			total3: 0
		}
	},
	mixins: [mixin],
	computed: {
		teacherExportUrl() {
			return `${global.BasePath}structure/schoolfellowCircle/downTeacherAnalysisBySchoolId?endDate=${this.$moment(this.teacherTimeRange[1]).format('YYYY-MM-DD')}&searchName=${this.searchTeacherName}&startDate=${this.$moment(this.teacherTimeRange[0]).format('YYYY-MM-DD')}&topicId=${this.id}&token=${this.$store.getters.token}`
		},
		stuExportUrl() {
			return `${global.BasePath}structure/schoolfellowCircle/downStuAnalysisBySchoolId?classId=${this.classId || 0}&endDate=${this.$moment(this.stuTimeRange[1]).format('YYYY-MM-DD')}&gradeId=${this.gradeId || 0}&searchName=${this.searchStuentName}&startDate=${this.$moment(this.stuTimeRange[0]).format('YYYY-MM-DD')}&topicId=${this.id}&token=${this.$store.getters.token}`
		},
		activeExportUrl() {
			return `${global.BasePath}structure/schoolfellowCircle/downActivationAnalysis?type=${this.selectType}&classId=${this.classId2 || 0}&endDate=${this.$moment(this.activeTimeRange[1]).format('YYYY-MM-DD')}&gradeId=${this.gradeId2 || 0}&searchName=${this.searchActiveName}&startDate=${this.$moment(this.activeTimeRange[0]).format('YYYY-MM-DD')}&topicId=${this.id}&token=${this.$store.getters.token}`
		}
	},
	mounted() {
		this.teacherTimeRange = [
			this.$moment()
				.startOf('month')
				.format('YYYY-MM-DD'),
			this.$moment().format('YYYY-MM-DD')
		]
		this.stuTimeRange = [
			this.$moment()
				.startOf('month')
				.format('YYYY-MM-DD'),
			this.$moment().format('YYYY-MM-DD')
		]
		this.activeTimeRange = [
			this.$moment()
				.startOf('month')
				.format('YYYY-MM-DD'),
			this.$moment().format('YYYY-MM-DD')
		]
		this.querySchoolGrade()
		this.stuAnalysisBySchoolId()
		this.teacherAnalysisBySchoolId()
		this.activationAnalysis()
	},
	watch: {
		gradeId(val) {},
		gradeId2(val) {}
	},
	methods: {
		gradeIdChange() {
			this.classId = '0'
			this.classOptions = []
			if (this.gradeId != 0) this.queryClassByGradeId(1)
			this.stuAnalysisBySchoolId()
		},
		gradeId2Change() {
			this.classId2 = '0'
			this.classOption2 = []
			if (this.gradeId2 != 0) this.queryClassByGradeId(2)
			this.activationAnalysis()
		},
		typeChange() {
			if (this.selectType == 2) {
				this.gradeId2 = '0'
				this.classId2 = '0'
			}
			this.activationAnalysis()
		},
		// 年级列表
		querySchoolGrade() {
			querySchoolGrade().then(res => {
				this.gradeOptions = res.data.data.map(v => {
					return { label: v.name, value: v.id }
				})
			})
		},
		// 班级列表
		queryClassByGradeId(type) {
			if (type === 1) {
				queryClassByGradeId(this.gradeId).then(res => {
					this.classOptions = res.data.data.map(v => {
						return { label: v.name, value: v.id }
					})
				})
			} else {
				queryClassByGradeId(this.gradeId2).then(res => {
					this.classOptions2 = res.data.data.map(v => {
						return { label: v.name, value: v.id }
					})
				})
			}
		},
		teacherTimeRangeChange() {
			this.teacherAnalysisBySchoolId()
		},
		stuTimeRangeChange() {
			this.stuAnalysisBySchoolId()
		},
		activeTimeRangeChange() {
			this.activationAnalysis()
		},
		stuAnalysisBySchoolId() {
			stuAnalysisBySchoolId({
				startDate: this.$moment(this.stuTimeRange[0]).format('YYYY-MM-DD'),
				endDate: this.$moment(this.stuTimeRange[1]).format('YYYY-MM-DD'),
				pageNo: this.pageNo2,
				pageSize: this.pageSize2,
				searchName: this.searchStuentName,
				classId: this.classId || 0,
				gradeId: this.gradeId || 0
			}).then(res => {
				this.stuDataList = res.data.data.dataList
				this.total2 = res.data.data.pagination.total
			})
		},
		teacherAnalysisBySchoolId() {
			teacherAnalysisBySchoolId({
				startDate: this.$moment(this.teacherTimeRange[0]).format('YYYY-MM-DD'),
				endDate: this.$moment(this.teacherTimeRange[1]).format('YYYY-MM-DD'),
				pageNo: this.pageNo1,
				pageSize: this.pageSize1,
				searchName: this.searchTeacherName
			}).then(res => {
				this.teacherDataList = res.data.data.dataList
				this.total1 = res.data.data.pagination.total
			})
		},
		activationAnalysis() {
			activationAnalysis({
				startDate: this.$moment(this.activeTimeRange[0]).format('YYYY-MM-DD'),
				endDate: this.$moment(this.activeTimeRange[1]).format('YYYY-MM-DD'),
				pageNo: this.pageNo3,
				pageSize: this.pageSize3,
				searchName: this.searchActiveName,
				classId: this.classId2 || 0,
				gradeId: this.gradeId2 || 0,
				type: this.selectType
			}).then(res => {
				this.activeDataList = res.data.data.dataList
				this.total3 = res.data.data.pagination.total
			})
		},
		handleSizeChangeTeacher(val) {
			this.pageSize1 = val
			this.pageNo1 = 1
			this.teacherAnalysisBySchoolId()
		},
		handleCurrentChangeTeacher(val) {
			this.pageNo1 = val
			this.teacherAnalysisBySchoolId()
		},
		handleSizeChangeStu(val) {
			this.pageSize2 = val
			this.pageNo2 = 1
			this.stuAnalysisBySchoolId()
		},
		handleCurrentChangeStu(val) {
			this.pageNo2 = val
			this.stuAnalysisBySchoolId()
		},
		handleSizeChangeActive(val) {
			this.pageSize3 = val
			this.pageNo3 = 1
			this.activationAnalysis()
		},
		handleCurrentChangeActive(val) {
			this.pageNo3 = val
			this.activationAnalysis()
		},
		tabsfun() {
			// if (this.activeName == 'two') {
			// 	this.$router.replace({
			// 		path: 'campusCirclelisttwo',
			// 		query: { id: this.id }
			// 	})
			// }
		}
	}
}
</script>
<style lang="scss" scoped>
.campusCirclelistone {
	padding: 12px;
	.top {
		border-bottom: 1px solid #e7eaec;
		padding-bottom: 10px;
	}
	.title {
		line-height: 20px;
		font-size: 16px;
		border-left: 3px solid #409eff;
		padding-left: 10px;
		margin: 15px 0;
		color: #606266;
	}
}
</style>
