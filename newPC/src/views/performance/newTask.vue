<template>
	<div>
		<div style="padding:12px 12px 10px 12px" class="tool">
			<back-tool>
				<el-button type="primary" @click="setNewTask(1)" size="medium">保存</el-button>
				<el-button type="primary" @click="setNewTask(2)" size="medium">发布</el-button>
			</back-tool>
		</div>

		<el-form :model="form" style="padding:0 12px;width:810px;margin:0 auto">
			<el-form-item class="newTask" label="考核任务:" :label-width="formLabelWidth" :required="true">
				<el-input size="medium" v-model.trim="name" autocomplete="off" maxlength="50" show-word-limit></el-input>
			</el-form-item>
			<el-form-item label="类型:" :label-width="formLabelWidth" :required="true">
				<el-radio v-model="testType" label="1">月考核</el-radio>
			</el-form-item>
			<el-form-item label="考核时间:" :label-width="formLabelWidth" :required="true">
				<el-date-picker value-format="yyyy年MM月" v-model="date" type="month" placeholder="选择月"></el-date-picker>
			</el-form-item>
			<el-form-item label="考核员:" class="newTask" :label-width="formLabelWidth" :required="true">
				<div style="position:relative;vertical-align:top;width:600px;border:1px solid #ccc;padding-left:10px;display: flex;flex-wrap: wrap;" class="newTask_testBtn">
					<el-button @click="selectIt(item)" style="margin:10px" :class="{ primary: item.ischeck }" size="medium" v-for="(item, index) in btnList" :key="index">{{ item.name }}</el-button>
				</div>
			</el-form-item>
		</el-form>
	</div>
</template>
<script>
import BackTool from '@/components/BackTool/index'
import { getTestRole, newTest } from '@/api/performance'

export default {
	components: {
		BackTool
	},
	data() {
		return {
			date: '',
			name: '',
			testType: '1',
			btnList: [],
			formLabelWidth: '120px'
		}
	},
	computed: {
		getAssessUserList() {
			let newArr = [];
			this.btnList.forEach(v => {
				if (v.ischeck) {
					let obj = {
						userId: v.id,
						userLoginName: v.loginName,
						userName: v.name
					};
					newArr.push(obj)
				}
			});
			return newArr
		}
	},
	created: function() {
		this.getTestRole()
	},
	methods: {
		//获取考核员列表
		getTestRole() {
			getTestRole().then(res => {
				this.btnList = res.data.data;
				this.btnList = this.btnList.map(v => {
					return {
						ischeck: false,
						name: v.name,
						id: v.id,
						loginName: v.loginname
					}
				})
			})
		},
		//按钮点击事件
		selectIt(item) {
			item.ischeck = !item.ischeck
		},
		//创建任务
		setNewTask(state) {
			if (!this.date || this.getAssessUserList.length == 0 || !this.name) {
				this.$message({message: '必填项不能为空', type: 'info'});
				return
			}
			newTest({
				assessDate: this.date,
				assessUserList: this.getAssessUserList,
				taskName: this.name,
				taskState: state,
				typeId: 1,
				typeName: '月考核'
			}).then(res => {
				if (res.data.code === 200) {
					if (state == 1) {
						this.$message({
							message: '任务保存成功',
							type: 'success'
						})
					} else {
						this.$message({
							message: '任务发布成功',
							type: 'success'
						})
					}
					this.$router.back()
				} else {
					this.$message.error(res.data.msg);
				}
			})
		}
	}
}
</script>

<style>
.newTask_testBtn .el-button:hover {
	color: #409eff !important;
}
.newTask_testBtn .el-button {
	margin-left: 10px !important;
}
</style>
<style scoped>
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

.newTask .address-input {
	width: 600px;
}

.newTask .el-input__inner {
	width: 600px;
}
</style>
