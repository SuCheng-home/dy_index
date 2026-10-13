<template>
	<div class="item_list">
		<div class="header">
			<el-button @click="goBack" size="medium">返回</el-button>
			<el-button type="primary" @click="toAddItem" size="medium">新建</el-button>
		</div>
		<div class="offset_table_wrap">
			<el-table stripe :data="dataList" border style="width: 100%;" :height="nobottommaxH">
				<el-table-column label="考核员" width="220px">
					<template slot-scope="scope">
						<span>{{ scope.row.userName }}</span>
					</template>
				</el-table-column>
				<el-table-column label="考核项">
					<template slot-scope="scope">
						<span>月考核：{{ scope.row.itemName }}</span>
					</template>
				</el-table-column>
				<el-table-column align="center" label="操作" width="220px">
					<template slot-scope="scope">
						<el-button size="small" type="text" @click="toEditItem(scope.row)">编辑</el-button>
						<el-button size="small" type="text" @click="deleteItem(scope.row.userId)" class="buttontextred">删除</el-button>
					</template>
				</el-table-column>
			</el-table>
		</div>
	</div>
</template>

<script>
import mixins from '@/mixins/windowResize'
import { queryItemAllot, deleteItemAllot } from '@/api/performance'

export default {
	name: 'itemList',
	data() {
		return {
			schoolId: this.$store.getters.schoolInfo.id,
			dataList: []
		}
	},
	mixins: [mixins],
	created() {
		this.queryItemAllot()
	},
	methods: {
		goBack() {
			this.$router.back()
		},
		toAddItem() {
			this.$router.push({ path: 'itemAdd' })
		},
		toEditItem(userItem) {
			this.$router.push({ path: 'itemAdd', query: { userId: userItem.userId, userName: userItem.userName } })
		},
		queryItemAllot() {
			queryItemAllot({ schoolId: this.schoolId })
				.then(res => {
					if (res.data.code === 200 && res.data.result) {
						this.dataList = res.data.data
					}
				})
				.catch()
		},
		deleteItem(userId) {
			this.$confirm('确认删除当前考核分配吗？', '删除', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {
				deleteItemAllot({
					userId: userId,
					schoolId: this.schoolId
				})
					.then(res => res.data)
					.then(data => {
						if (data.result) {
							this.$message({
								message: '删除成功',
								type: 'success'
							})
							this.queryItemAllot()
						} else {
							this.$message.error(data.msg)
						}
					})
			})
		}
	}
}
</script>

<style lang="scss" scoped>
.item_list {
	padding: 12px;

	.header {
		overflow: hidden;
		margin-bottom: 10px;
	}
}
</style>
