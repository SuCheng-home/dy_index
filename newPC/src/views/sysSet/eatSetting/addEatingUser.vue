<template>
	<div class="addOrEditHomework app-container">
		<el-row style="padding-bottom:20px">
			<!--编辑-->
			<el-col>
				<div class="btn_hearder">
					<el-button class="detail-backBtn" size="medium" @click="$router.back()">返回</el-button>
					<el-button size="medium" class="filter-item" type="primary" :disabled="isButtonDisabled" :loading="isShowBtnLoading" @click="saveFormEdit()">
						保存
					</el-button>
				</div>
			</el-col>
		</el-row>
		<div :style="'height:' + maxH + 'px;overflow: auto;'">
			<div style="width:810px;padding-top:20px; margin: 0 auto;">
				<el-form ref="form" :model="query" label-width="140px" :rules="rules">
					<el-form-item label="就餐开始日期" prop="startDate">
						<el-date-picker v-model="query.startDate" type="date" placeholder="选择就餐开始日期"></el-date-picker>
					</el-form-item>
					<el-form-item label="就餐人员" prop="userRange">
						<address-book v-model="userRange" :groupDisabled="true" :config="$route.query.restaurantType == 1 ? teacherConfigData : stuConfigData" :isSchoolManager="true"></address-book>
					</el-form-item>
				</el-form>
			</div>
		</div>
	</div>
</template>
<script>
import Ueditor from '@/components/Ueditor'
import mixin from '@/mixins/windowResize'
import Uploader from '@/components/Uploader/WebUploader'
import AddressBook from '@/components/AddressBook/indexExpand'
import ImagePreviewer from '@/components/ImagePreviewer/ImagePreviewer'
import { addRepastUser } from '@/api/eatSetting'
export default {
	name: 'formAddOne',
	data: function() {
		const userRangeValidator = (rule, value, callback) => {
			if (this.userRange.userJson.length === 0 && this.userRange.departJson.length === 0) {
				callback(new Error('请添加就餐人员！'))
			} else {
				callback()
			}
		}
		return {
			rules: {
				startDate: [
					{
						required: true,
						message: '请选择就餐开始日期！',
						trigger: 'blur'
					}
				],
				userRange: [
					{
						required: true,
						validator: userRangeValidator,
						trigger: 'blur'
					}
				]
			},
			items: [],
			classTypeItems: [],
			files: [],
			videoJson: [],
			userRange: { departJson: [], groupJson: [], userJson: [] },
			query: {
				startDate: ''
			},
			workStuJson: {},
			// configData: {
			// 	title: '选择用户',
			// 	depart: {
			// 		target: 'user',
			// 		departType: 't',
			// 		userTypes: '1',
			// 		notCheckSchool: true
			// 	},
			// 	// group: {
			// 	//   groupTarget: false, groupScope: [2]
			// 	// }
			// 	group: true
			// },
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
			},
			teacherConfigData: {
				title: '请选择老师',
				depart: {
					target: 'all',
					departType: 't',
					userTypes: '1'
					// notCheckSchool: true
				},
				group: true
				// SingleChose: true
			},
			isButtonDisabled: false,
			isShowBtnLoading: false,
			iskm: true
		}
	},
	components: {
		Ueditor,
		AddressBook,
		ImagePreviewer,
		Uploader
	},
	mixins: [mixin],
	mounted() {},
	methods: {
		queryRestaurantBySchoolId() {
			queryRestaurantBySchoolId().then(res => {})
		},
		delPicHandler(index) {
			this.query.pics.splice(index, 1)
		},
		selectChange(val) {},
		classSelectChange(val) {
			this.query.departIdss = val
		},
		saveFormEdit(formName, key) {
			this.$refs['form'].validate(valid => {
				if (valid) {
					let departIds = this.userRange.departJson.map(({ id }) => id).join(',')
					let userIds = this.userRange.userJson.map(({ id }) => id).join(',')
					addRepastUser({
						repastDate: this.$moment(this.query.startDate).format('YYYY-MM-DD'),
						departIds: departIds,
						userIds: userIds,
						restaurantId: this.$route.query.id,
						isTeacher: this.$route.query.restaurantType == 1 ? 1 : 0
					}).then(res => {
						this.$message.success('添加成功！')
						this.$router.back()
					})
				}
			})
		}
	},
	watch: {
		'query.publishType': function(publishType) {
			if (publishType === '0') {
				this.$refs.form.validateField('workStuJson')
				this.query.workStuJson = {}
			} else {
				this.$refs.form.validateField('departIds')
			}
		},
		'query.workStuJson': function() {
			this.$refs.form.validateField('workStuJson')
		}
	}
}
</script>
<style lang="scss">
.addOrEditHomework {
	padding: 12px;
	.btn_hearder {
		padding-bottom: 12px;
		border-bottom: 1px solid #e7eaec;
	}
	ul {
		list-style-type: none;
		margin: 0;
	}

	.el-select {
		width: 100%;
	}
}

.form-item--richtext .el-form-item__content {
	line-height: inherit !important;
}

.moblie-content {
	padding: 20px 15px;
	font-size: 15px;
}

.pic-container li {
	width: 80px;
	height: 80px;
	background: no-repeat center center / cover;
	float: left;
	margin: 0 10px 10px 0;
}

.img-box-item-close {
	width: 24px;
	height: 24px;
	display: block;
	float: right;
	background-size: cover;
	background-position: center center;
	background-image: url(../../../assets/images/pic_del_icon.png);
}
</style>
