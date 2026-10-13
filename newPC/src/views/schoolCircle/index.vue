<template>
	<div>
		<div style="padding:12px 12px 10px 12px">
			<el-row>
				<el-col :span="19">
					<div v-show="!isShowByPermission('/schoolfellowCircle/manage')" style="width: 80px;height:30px"></div>
					<el-button type="primary" @click="goSchoolCircleAdd()" size="medium" v-show="isShowByPermission('/schoolfellowCircle/manage')">新建圈子</el-button>
					<el-button type="primary" @click="goSchoolCircleStatistics()" size="medium" v-show="isShowByPermission('/schoolfellowCircle/manage')">统计</el-button>
				</el-col>
				<el-col :span="5">
					<el-input placeholder="请输入主题" v-model="search" class="input-with-select" size="medium">
						<el-button slot="append" @click="searchIt()" icon="el-icon-search"></el-button>
					</el-input>
				</el-col>
			</el-row>
		</div>
		<div class="table" style="padding:0 12px;">
			<el-table :data="tableData" border :height="maxH" style="width: 100%">
				<el-table-column label="圈子主题" show-overflow-tooltip>
					<template slot-scope="scope">
						<span class="taskName" @click="goSchoolCircleDetail(scope.row.id)" style="color:#409eff;cursor: pointer;">{{ scope.row.title }}</span>
					</template>
				</el-table-column>
				<el-table-column label="发布范围" :show-overflow-tooltip="true">
					<template slot-scope="scope">
						<span>{{ scope.row.circleRange }}</span>
					</template>
				</el-table-column>
				<el-table-column label="是否需要审批">
					<template slot-scope="scope">
						<span>{{ scope.row.needAudit == 1 ? '是' : '否' }}</span>
					</template>
				</el-table-column>
				<el-table-column label="发布时间">
					<template slot-scope="scope">
						<span>{{ scope.row.createDate.slice(0, -5) }}</span>
					</template>
				</el-table-column>
				<el-table-column label="帖子数">
					<template slot-scope="scope">
						<span style="color:#409EFF;cursor:pointer" @click="goSchoolCircleInvitation(scope.row.id, 1)">{{ scope.row.messageCount }}</span>
					</template>
				</el-table-column>
				<el-table-column label="待审核数">
					<template slot-scope="scope">
						<span style="color:#409EFF;cursor:pointer" @click="goSchoolCircleInvitation(scope.row.id, 2)">{{ scope.row.waitAuditMessageCount }}</span>
					</template>
				</el-table-column>
				<el-table-column label="状态">
					<template slot-scope="scope">
						<el-tag  size="mini" type="info" key="" v-if="scope.row.state == 1" plain>草稿</el-tag>
						<el-tag  size="mini" type="success"  v-else plain>已发布</el-tag>
					</template>
				</el-table-column>
				<el-table-column label="操作">
					<template slot-scope="scope">
						<span v-if="isShowByPermission('/schoolfellowCircle/manage')">
							<el-button type="text" @click="goEdit(scope.row.id)">编辑</el-button>
							<el-button type="text" v-if="scope.row.state == 1" @click="publishCircleTopic(scope.row.id)">发布</el-button>
							<el-button type="text" @click="deleteCircleTopic(scope.row.id)" class="buttontextred">删除</el-button>
						</span>
						<span v-else>
							{{ '--' }}
						</span>
					</template>
				</el-table-column>
			</el-table>
			<div style="margin-top: 15px;">
				<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-sizes="[10, 20, 30, 40]" :page-size="10" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
			</div>
		</div>
	</div>
</template>
<script>
import { queryCircleTopicBySchoolId, deleteCircleTopic, publishCircleTopic } from '@/api/schoolCircle'
import { isShowByPermission } from '@/utils'

import mixin from '@/mixins/windowResize'

export default {
	name: 'schoolCircleIndex',
	data() {
		return {
			pageSize: 10,
			pageNo: 1,
			select: '',
			name: '',
			total: '',
			search: '',
			formInline: {
				user: '',
				region: ''
			},
			tableData: []
		}
	},
	 activated() {
          this.queryCircleTopicBySchoolId()
        },
	created() {
		this.queryCircleTopicBySchoolId()
	},
	mixins: [mixin],
	methods: {
		isShowByPermission,
		searchIt() {
			this.pageNo = 1
			this.queryCircleTopicBySchoolId()
		},
		goSchoolCircleAdd() {
			this.$router.push('schoolCircleAdd')
		},
		goSchoolCircleStatistics() {
			this.$router.push('allSchoolCircleStatistics')
		},
		goSchoolCircleInvitation(id, status) {
			this.$router.push({
				path: 'schoolCircleInvitation',
				query: {
					id: id,
					status: status
				}
			})
		},
		goCheckList(data) {
			this.$router.push({
				path: 'checkListTwo',
				query: data
			})
		},
		goDetail(data) {
			this.$router.push({
				path: 'testDetail',
				query: data
			})
		},
		//获取任务列表
		queryCircleTopicBySchoolId() {
			queryCircleTopicBySchoolId({
				pageSize: this.pageSize,
				pageNo: this.pageNo,
				searchName: this.search
			}).then(res => {
				this.tableData = res.data.data.dataList.map(v => {
					let range = ''
					JSON.parse(v.stuDepartJson.length ? v.stuDepartJson : '[]').forEach(stu => {
						range += stu.name + ','
					})
                    if(v.stuGroupJson) {
                        JSON.parse(v.stuGroupJson.length ? v.stuGroupJson : '[]').forEach(stu => {
                            range += stu.name + ','
                        })
                    }
					JSON.parse(v.teacherJson.length ? v.teacherJson : '[]').forEach(teacher => {
						range += teacher.name + ','
					})
					JSON.parse(v.teacherDepartJson.length ? v.teacherDepartJson : '[]').forEach(teacher => {
						range += teacher.name + ','
					})
                    if(v.teacherGroupJson) {
                        JSON.parse(v.teacherGroupJson.length ? v.teacherGroupJson : '[]').forEach(teacher => {
                            range += teacher.name + ','
                        })
                    }

					range = range
						.slice(0, -1)
						.split(',')
						.join(',')
					return Object.assign({}, v, { circleRange: range })
				})
				this.total = res.data.data.pagination.total
			})
		},
		//根据id删除任务
		deleteCircleTopic(id) {
			this.$confirm('确定删除圈子及全部数据？', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			})
				.then(() => {
					deleteCircleTopic({ topicId: id }).then(res => {
						this.queryCircleTopicBySchoolId()
						this.$message({
							type: 'success',
							message: '删除圈子成功!'
						})
					})
				})
				.catch(() => {})
		},
		//发布任务
		publishCircleTopic(id) {
			this.$confirm('是否确认发布该圈子?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			})
				.then(() => {
					publishCircleTopic({ topicId: id }).then(res => {
						this.queryCircleTopicBySchoolId()
						this.$message({
							type: 'success',
							message: '发布圈子成功!'
						})
					})
				})
				.catch(() => {
					this.$message({
						type: 'info',
						message: '已取消发布'
					})
				})
		},
		//去编辑页
		goEdit(id) {
			this.$router.push({
				path: 'schoolCircleAdd',
				query: {
					id: id
				}
			})
		},
		goSchoolCircleDetail(id) {
			this.$router.push({
				path: 'schoolCircleDetail',
				query: {
					id: id
				}
			})
		},
		handleSizeChange(val) {
			this.pageSize = val
			this.pageNo = 1
			this.queryCircleTopicBySchoolId()
		},
		handleCurrentChange(val) {
			this.pageNo = val
			this.queryCircleTopicBySchoolId()
		}
	}
}
</script>

<style scoped></style>
