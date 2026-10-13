<template>
	<div class="item_add_wrap">
		<div class="header">
			<el-button @click="goBack" size="medium">返回</el-button>
			<el-button type="primary" @click="saveItem" size="medium">保存</el-button>
		</div>
		<div class="item_add_box custom—scrollbar" :style="`height: ${nobottommaxH}px;`">
			<el-form ref="ruleForm" :rules="rules" label-width="140px" class="demo-ruleForm">
				<el-form-item label="考核员" prop="currentUser" v-if="!itemId">
					<el-select v-model="currentUser" multiple placeholder="请选择考核员" size="medium" style="width: 100%;">
						<el-option v-for="item in roleList" :key="item.id" :label="item.name" :value="item.id"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="月考核项" prop="roleItem">
					<div class="item_list">
						<el-button :class="`item_btn ${isCurrentBtn(item.id) ? 'primary' : ''}`" size="medium" v-for="(item, index) in btnList" @click="changeItem(item.id)" :key="index">{{ item.itemName }}</el-button>
					</div>
				</el-form-item>
			</el-form>
		</div>
	</div>
</template>

<script>
import mixins from '@/mixins/windowResize'
import AddressBook from '@/components/AddressBook/indexExpand'
import { getTestRole, getItemListBySchoolId, getItemListByUserId, insertItemAllot, editItemAllot } from '@/api/performance'

export default {
	name: 'itemAdd',
	components: {
		AddressBook
	},
	data() {
		return {
			currentUser: [],
			roleList: [],
			btnList: [],
			currentIdList: [],
			schoolId: this.$store.getters.schoolInfo.id,
			itemId: this.$route.query.userId || 0,
			userName: this.$route.query.userName || '',
			rules: {
				currentUser: {
					type: Array,
					default: () => {
						return [{ required: true, message: ' ' }]
					}
				},
				roleItem: [{ required: true }]
			}
		}
	},
	mixins: [mixins],
	created() {
		this.getItemListBySchoolId()
		if (this.itemId) {
			this.getItemListByUserId()
		} else {
			this.getTestRole()
		}
	},
	methods: {
		goBack() {
			this.$router.back()
		},
		getItemListBySchoolId() {
			getItemListBySchoolId()
				.then(res => res.data)
				.then(data => {
					if (data.code === 200 && data.result) {
						this.btnList = data.data
					}
				})
		},
		getTestRole() {
			getTestRole()
				.then(res => res.data)
				.then(data => {
					if (data.code === 200 && data.result) {
						this.roleList = data.data
					}
				})
		},
		// 详情
		getItemListByUserId() {
			getItemListByUserId({ userId: this.itemId, schoolId: this.schoolId })
				.then(res => {
					const data = res.data.data
					if (res.data.code === 200 && res.data.result) {
						this.currentUser = [this.itemId]
						this.roleList = [{ id: this.itemId, name: this.userName }]
						this.currentIdList = data.map(item => item.id)
					}
				})
				.catch()
		},
		changeItem(itemId) {
			if (this.currentIdList.indexOf(itemId) > -1) {
				this.currentIdList.splice(this.currentIdList.indexOf(itemId), 1)
			} else {
				this.currentIdList.push(itemId)
			}
		},
		isCurrentBtn(itemId) {
			return this.currentIdList.indexOf(itemId) > -1
		},
		getListName(list, itemId, label) {
			let strName = ''
			list.forEach(item => {
				if (item.id === itemId) {
					strName = item[label]
				}
			})
			return strName
		},
		saveItem() {
			if (!this.itemId && (!this.currentUser || !this.currentUser.length)) {
				this.$message({
					message: '请选择考核员！',
					type: 'warning'
				})
				return
			}
			if (!this.currentIdList || !this.currentIdList.length) {
				this.$message({
					message: '请选择月考核项！',
					type: 'warning'
				})
				return
			}

			let newArray = []
			this.currentUser.forEach(userItem => {
				this.currentIdList.forEach(item => {
					newArray.push({
						userId: userItem,
						userName: this.getListName(this.roleList, userItem, 'name'),
						schoolId: this.schoolId,
						itemId: item,
						itemName: this.getListName(this.btnList, item, 'itemName')
					})
				})
			})

			if (this.itemId) {
				this.editItemAllot(newArray)
			} else {
				this.insertItemAllot(newArray)
			}
		},
		insertItemAllot(query) {
			insertItemAllot(query)
				.then(res => {
					const data = res.data
					if (res.data.code === 200) {
						this.$message({
							message: '保存成功',
							type: 'success'
						})
						this.$router.back()
					} else {
						this.$message({
							message: data.msg,
							type: 'warning'
						})
					}
				})
				.catch()
		},
		editItemAllot(query) {
			editItemAllot(query)
				.then(res => {
					const data = res.data
					if (res.data.code === 200) {
						this.$message({
							message: '保存成功',
							type: 'success'
						})
						this.$router.back()
					} else {
						this.$message({
							message: data.msg,
							type: 'warning'
						})
					}
				})
				.catch()
		}
	}
}
</script>
<style>
.item_list .el-button:hover {
	color: #fff;
}
</style>
<style lang="scss" scoped>
@import '../../styles/style';

.item_add_wrap {
	padding: 12px;

	.header {
		padding-bottom: 10px;
		border-bottom: 1px solid #eee;
	}

	.item_add_box {
		padding: 20px;
	}

	.demo-ruleForm {
		width: 810px;
		margin: 0 auto;

		.item_list {
			padding: 10px;
			border: 1px solid #ccc;
			.item_btn {
				margin-right: 10px;
			}
		}
	}
}

.primary {
	background: #409eff !important;
	color: #fff !important;
}

.primary span {
	color: #fff !important;
}

.primary:hover {
	color: #fff !important;
}
</style>
