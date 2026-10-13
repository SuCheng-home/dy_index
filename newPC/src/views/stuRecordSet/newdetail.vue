<template>
	<div class="stuAskleave-list-detail">
		<el-row>
			<el-col :span="24">
				<el-button @click="$router.back()" size="medium">返回</el-button>
			</el-col>
		</el-row>
		<div class="detail-wrapper" :style="{ height: nobottommaxH - 10 + 'px' }">
			<el-form label-width="140px">
				<el-form-item label="请假人">{{ data.studentName || '--' }}</el-form-item>
                <el-form-item label="性别">{{ ['--', '男', '女'][data.gender] }}</el-form-item>
                <el-form-item label="手机号">{{ data.mobile || '--' }}</el-form-item>
                <el-form-item label="请假内容">{{ data.content || '--' }}</el-form-item>
                <el-form-item label="就读类型" v-if="isLiveRemind == 2">
                    {{ ['', '走读', '住宿'][data.liveType] }}
                </el-form-item>
				<el-form-item label="请假类型">
					<pre v-html="data.leaveTypeName || '--'"></pre>
				</el-form-item>
				<el-form-item label="家长联系方式">{{ data.mobile || '--' }}</el-form-item>
				<el-form-item v-if="isSickTypeGroup == 1" label="疾病类型">{{ data.sickTypeName || '--' }}</el-form-item>
				<el-form-item v-if="isSickType" label="疾病症状">{{ data.symptomJson || '--' }}</el-form-item>
				<el-form-item label="就医情况" v-if="data.medicalType">{{ data.medicalType }}</el-form-item>
				<el-form-item label="就诊医院" v-if="data.hospital">{{ data.hospital }}</el-form-item>
				<el-form-item label="开始时间">
					{{ data.startDate }}{{ getWeekDay(data.startDate) }}&nbsp;
					<span v-if="data.leaveType != 7">&nbsp;{{ data.isMorningName != '节次' ? data.isMorningName : '' }}</span>
				</el-form-item>
				<el-form-item label="请假时长" v-if="data.leaveType != 7">
					<span v-if="data.isClassHour == 0">{{ data.leaveDateCount }}天</span>
					<span v-else>{{ data.classHourCount }}节</span>
				</el-form-item>
				<el-form-item label="停伙情况" v-if="isShowStopFire && datelist.length">
					<div v-for="(items, indexs) in datelist" :key="indexs">
						{{ items.date }}
						<span v-if="items.state == 1">
							<span v-for="(item, index) in items.fireList" :key="index">
								<span v-if="item.mealType == 0">
									早餐停伙
								</span>
								<span v-if="item.mealType == 1">
									午餐停伙
								</span>
								<span v-if="item.mealType == 2">
									课间餐停伙
								</span>
								<span v-if="item.mealType == 3">
									晚餐停伙
								</span>
							</span>
						</span>
						<span v-if="items.state == 2">未停伙</span>
						<span v-if="items.state == 3">不供餐</span>
					</div>
				</el-form-item>
				<el-form-item label="请假附件" v-if="data.askPhotoList && data.askPhotoList.length">
					<image-previewer class="image-plate" :images="getViewPic(data.askPhotoList)" tag="img"></image-previewer>
				</el-form-item>
				<el-form-item label="审批意见" v-if="data.batchContent">{{ data.batchContent }}</el-form-item>
				<div v-if="data.isHer == 1 && data.leaveState == 3">
					<el-form-item label="销假时间">{{ data.herTime | filterDate }}</el-form-item>
					<el-form-item label="销假备注" v-if="data.herContent">{{ data.herContent }}</el-form-item>
					<el-form-item label="请假附件" v-if="data.askIsherPhotoList && data.askIsherPhotoList.length">
						<image-previewer class="image-plate" :images="getViewPic(data.askIsherPhotoList)" tag="img"></image-previewer>
					</el-form-item>
				</div>
			</el-form>
		</div>
	</div>
</template>

<script>
/* utils */
import mixin from '@/mixins/windowResize'
import { mapGetters } from 'vuex'
import moment from 'moment'

/* components */
import ImagePreviewer from '@/components/ImagePreviewer/ImagePreviewer.vue'

/* api */
import { getStuAskleaveInfo, getStuAskleaveInitInfo, getFireAnalysisByUserIdAndDateRange,isOpenModule } from '@/api/stuAskleave'

export default {
	mixins: [mixin],
	components: { ImagePreviewer },
	filters: {
		filterDate(val) {
			return val ? moment(val).format('YYYY-MM-DD HH:mm:ss') : '--'
		}
	},
	watch: {},
	computed: {
		...mapGetters(['userInfo', 'schoolInfo']),
		getWeekDay() {
			return function(val) {
				let weekDay = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
				return '(' + weekDay[new Date(val.replace(/\-/g, '/')).getDay()] + ')'
			}
		}
	},
	data() {
		return {
            isLiveRemind: 1,
			isSickTypeGroup: 0,
			isSickType: false,
			askId: this.$route.query.askId,
			data: {},
			datelist: [],
			isShowStopFire: false
		}
	},
	created() {
		this.getStuAskleaveInfo()
	},
	methods: {
		// 根据报修Id查询所有报修信息
		getStuAskleaveInfo() {
			getStuAskleaveInfo({
				askId: this.askId
			})
				.then(res => {
					let _res = res.data
					let data = res.data.data
					isOpenModule()
				.then(res => res.data)
				.then(newmydata => {
					if(newmydata.data.isOpen){
						getFireAnalysisByUserIdAndDateRange({ startDate: data.startDate, userId: data.studentId, endDate: data.endDate,myis:newmydata.data.isOpen})
						.then(res => {
							let mydata = res.data.data
							this.datelist = mydata
						})
						.catch()
					}
					
				})
				isOpenModule(1225)
				.then(res => res.data)
				.then(newmydata => {
					if(newmydata.data.isOpen){
						getFireAnalysisByUserIdAndDateRange({ startDate: data.startDate, userId: data.studentId, endDate: data.endDate,myis:false})
						.then(res => {
							let mydata = res.data.data
							this.datelist = mydata
						})
						.catch()
					}
					
				})
					
					if (_res.code != 200) {
						return Promise.reject(_res.msg)
					} else {
						return _res.data
					}
				})
				.then(data => {
					if (data) {
						this.data = { ...data }
						this.getStuAskleaveInitInfoFunc()
					}
				})
		},
		getStuAskleaveInitInfoFunc() {
			getStuAskleaveInitInfo({
				schoolId: this.schoolInfo.id
			})
				.then(res => res.data)
				.then(data => {
					this.isSickTypeGroup = data.data.isSickTypeGroup
                    this.isLiveRemind = data.data.isLiveRemind
					this.isSickType = data.data.symptomHav == 2
					this.isShowStopFire = data.data.showStopFire === 2
				})
		},
		// 格式化图片 json
		formatImgJson(imgJson) {
			return JSON.parse(imgJson || '[]').map(item => ({
				fileUrl: item.photoUrl
			}))
		},

		getViewPic(photoList) {
			if (photoList) {
				return photoList.map(item => ({ src: item.accessUrl }))
			}
			return []
		},
		getViewDealPic(photoList) {
			if (photoList) {
				return JSON.parse(photoList).map(item => ({ src: item }))
			}
			return []
		},
		getViewFbackPic(photoList) {
			if (photoList) {
				return photoList.map(item => ({ src: item.photoUrl }))
			}
			return []
		}
	}
}
</script>
<style lang="scss" scoped>
.stuAskleave-list-detail {
	padding: 12px;

	.el-col {
		border-bottom: 1px solid #e7eaec;
		padding-bottom: 10px;
		margin-bottom: 10px;
	}

	.el-form {
		width: 810px;
		margin: 0 auto;
		overflow: auto;

		.el-form-item {
			margin-bottom: 0;
		}

		/deep/ .el-form-item__label {
			color: #909399;
		}

		/deep/ .el-form-item__content {
			padding-left: 18px;
		}
	}

	pre {
		margin: 0;
		font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB, Microsoft YaHei, Arial, sans-serif;
		white-space: pre-wrap; /* css-3 */
		white-space: -moz-pre-wrap; /* Mozilla, since 1999 */
		white-space: -pre-wrap; /* Opera 4-6 */
		white-space: -o-pre-wrap; /* Opera 7 */
		word-wrap: break-word; /* Internet Explorer 5.5+ */
	}

	.detail-wrapper {
		overflow: auto;
		padding-bottom: 50px;
	}

	.detail-title {
		width: 810px;
		margin: 22px auto 14px;
		border-left: 4px solid #409eff;
		padding-left: 12px;
		height: 16px;
		line-height: 16px;
		font-size: 12px;
		color: #676a6c;
		font-weight: bold;

		.danger {
			color: #f56c6c;
		}
	}

	/deep/ .images {
		width: 80px;
		height: 80px;
		margin: 0 20px 20px 0;
	}

	.deal-item {
		border-radius: 3px;
		border: 1px solid #e7eaec;
		background: #fff;
		margin-bottom: 12px;
		padding: 4px 10px;
		line-height: 20px;

		.deal-status {
			margin-bottom: 10px;
			font-weight: 700;

			.unsolved {
				color: #f56c6c;
			}

			.solved {
				color: #67c23a;
			}
		}

		.previewer {
			padding: 0 12px;

			/deep/ .images {
				margin: 10px 10px 0 10px;
			}
		}

		.deal-info {
			text-align: right;
			font-size: 12px;
		}
	}
}
</style>
