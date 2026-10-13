<template>
	<div class="add-wrap app-container">
		<el-row style="padding-bottom:20px">
			<!--编辑-->
			<el-col>
				<div class="btn_hearder">
					<el-button class="detail-backBtn" size="medium" @click="$router.back()">返回</el-button>
					<el-button size="medium" class="filter-item" type="primary" :disabled="isButtonDisabled" :loading="isShowBtnLoading" @click="saveFormEdit()">保存</el-button>
				</div>
			</el-col>
		</el-row>
		<div :style="'height:' + maxH + 'px;overflow: auto;'">
			<div style="width:810px;padding-top:20px;margin: 0 auto;">
				<el-form ref="form" :model="query" label-width="140px" :rules="rules">
					<el-form-item label="师傅:" prop="masterJson">
						<address-book v-model="query.masterJson" :groupDisabled="true" :config="configData" :isSchoolManager="true"></address-book>
					</el-form-item>
					<el-form-item label="徒弟:" prop="prenticeJson">
						<address-book v-model="query.prenticeJson" :groupDisabled="true" :config="configData" :isSchoolManager="true"></address-book>
					</el-form-item>
				</el-form>
			</div>
		</div>
	</div>
</template>
<script>
import mixin from '@/mixins/windowResize'
import AddressBook from '@/components/AddressBook/indexExpand'
import { addMasterPrentice, getCyanBlueMasterPrenticeById, editMasterPrentice } from '@/api/qlthSetting'
export default {
	name: 'formAddOne',
	data: function() {
		const masterJsonValidator = (rule, value, callback) => {
			if (!this.query.masterJson.userJson || !this.query.masterJson.userJson.length) {
				callback(new Error('请选择师傅!'))
			} else {
				callback()
			}
		}
		const prenticeJsonValidator = (rule, value, callback) => {
			if (!this.query.prenticeJson.userJson || !this.query.prenticeJson.userJson.length) {
				callback(new Error('请选择徒弟!'))
			} else {
				callback()
			}
		}
		return {
			rules: {
				masterJson: [
					{
						required: true,
						validator: masterJsonValidator
					}
				],
				prenticeJson: [
					{
						required: true,
						validator: prenticeJsonValidator
					}
				]
			},

			query: {
				masterJson: [],
				prenticeJson: []
			},
			workStuJson: {},
			configData: {
				title: '选择用户',
				depart: {
					target: 'user',
					departType: 't',
					userTypes: '1',
					notCheckSchool: true
				},
				SingleChose: true,
				// group: {
				//   groupTarget: false, groupScope: [2]
				// }
				group: true
			},
			isButtonDisabled: false,
			isShowBtnLoading: false
		}
	},
	components: {
		AddressBook
	},
	mixins: [mixin],
	mounted() {
		this.$route.query.id && this.getCyanBlueMasterPrenticeById()
	},
	methods: {
		getCyanBlueMasterPrenticeById() {
			getCyanBlueMasterPrenticeById({ masterPrenticeId: this.$route.query.id }).then(res => {
				this.query.masterJson.userJson = JSON.parse(res.data.data.masterJson)
				this.query.prenticeJson.userJson = JSON.parse(res.data.data.prenticeJson)
			})
		},
		saveFormEdit() {
			//编辑草稿或提交发布
			this.$refs.form.validate(valid => {
				if (valid) {
					if (this.$route.query.id) {
						editMasterPrentice({
							masterJson: JSON.stringify(this.query.masterJson.userJson),
							prenticeJson: JSON.stringify(this.query.prenticeJson.userJson),
							masterPrenticeId: this.$route.query.id
						}).then(res => {
							if (res.data.code === 200) {
								this.$message.success('编辑成功')
								this.$router.back()
							}
						})
					} else {
						addMasterPrentice({
							masterJson: JSON.stringify(this.query.masterJson.userJson),
							prenticeJson: JSON.stringify(this.query.prenticeJson.userJson)
						}).then(res => {
							if (res.data.code === 200) {
								this.$message.success('添加成功')
								this.$router.back()
							}
						})
					}
				}
			})
		}
	},
	watch: {
		'query.masterJson': function() {
			this.$refs.form.validateField('masterJson')
		},
		'query.prenticeJson': function() {
			this.$refs.form.validateField('prenticeJson')
		}
	}
}
</script>
<style lang="scss">
.add-wrap {
	padding: 12px;
	.btn_hearder {
		padding-bottom: 12px;
		border-bottom: 1px solid #e7eaec;
	}
}
.form-item--richtext .el-form-item__content {
	line-height: inherit !important;
}
</style>
