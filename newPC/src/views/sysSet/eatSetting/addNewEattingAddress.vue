<template>
	<div class="addOrEditHomework app-container">
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
			<div style="width:810px;padding-top:20px;    margin: 0 auto;">
				<el-form ref="form" :model="query" label-width="140px" :rules="rules">
					<el-form-item label="就餐地点" prop="restaurantName">
						<el-input v-model="query.restaurantName" placeholder="就餐地点（1-20个字符）"></el-input>
					</el-form-item>
					<el-form-item label="就餐人身份">
						<el-select @change="selectChange" v-model="query.restaurantType" placeholder="请选择就餐人身份">
							<el-option label="学生" :value="2"></el-option>
							<el-option label="老师" :value="1"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="排序">
						<el-input-number :step="1" step-strictly v-model="query.orderNo" controls-position="right"></el-input-number>
					</el-form-item>
					<el-form-item label="负责人" prop="userRange">
						<address-book v-model="userRange" :groupDisabled="true" :config="configData" :isSchoolManager="true"></address-book>
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
import { createRestaurant, queryRestaurantBySchoolId, getRestaurantDetailsById, updateRestaurant } from '@/api/eatSetting'
export default {
	name: 'formAddOne',
	data: function() {
		const departIdsValidator = (rule, value, callback) => {
			if (this.query.publishType === '0' && this.query.departIdss.length === 0) {
				callback(new Error('请选择班级'))
			} else {
				callback()
			}
		}
		const userRangeValidator = (rule, value, callback) => {
			if (this.userRange.userJson.length === 0) {
				callback(new Error('请选择负责人'))
			} else {
				callback()
			}
		}
		return {
			rules: {
				restaurantName: [
					{
						required: true,
						message: '请输入就餐地点',
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
				orderNo: 0,
				restaurantName: '',
				restaurantType: 1
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
				// group: {
				//   groupTarget: false, groupScope: [2]
				// }
				group: true
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
	mounted() {
		if (this.$route.query.id) {
			this.getRestaurantDetailsById()
		}
	},
	methods: {
		getRestaurantDetailsById() {
			getRestaurantDetailsById(this.$route.query.id).then(res => {
				this.query.orderNo = res.data.data.orderNo
				this.query.restaurantName = res.data.data.restaurantName
				this.query.restaurantType = res.data.data.restaurantType
				this.userRange.userJson = res.data.data.userList
			})
		},
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
					new Promise(r => {
						if (!this.$route.query.id) {
							createRestaurant({ ...this.query, userJson: JSON.stringify(this.userRange.userJson) }).then(res => {
								r()
							})
						} else {
							updateRestaurant({
								...this.query,
								userJson: JSON.stringify(this.userRange.userJson),
								id: this.$route.query.id
							}).then(res => {
								r()
							})
						}
					}).then(res => {
						this.$message.success(this.$route.query.id ? '修改成功！' : '添加成功！')
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
