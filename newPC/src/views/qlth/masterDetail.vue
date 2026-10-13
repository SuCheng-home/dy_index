<template>
	<div class="restaurantRefundregister">
		<el-tabs type="border-card" v-model="activeName" style="min-height:89vh">
			<el-tab-pane :label="item.label" :name="item.name" v-for="item in paneList" :key="item.name">
				<!-- <component :is="activeName" ref="componentActive" id="10"></component> -->
				<batch :id="$route.query.id" v-show="activeName === 'batch'" :isShowButton="false"></batch>
				<div class="header" v-show="activeName === 'culturePlan'">
					<el-row>
						<el-col :span="19">
							<el-button size="medium" @click="$router.back()">返回</el-button>
						</el-col>
					</el-row>
				</div>
				<div class="sameComp" v-show="activeName === 'culturePlan'" style="padding-top: 50px">
					<div class="none_word" v-if="!planIsEnd">当前日期不在上报开始日期至截止日期范围内，无法上报</div>
					<div class="sameComp_item" v-for="(item, index) in planData" :key="index + 'planitem'">
						<div class="sameComp_item_detail">
							<div class="sameComp_item_title">徒弟:</div>
							<div class="sameComp_item_content">{{ item.prenticeName }}</div>
						</div>
						<div class="sameComp_item_detail">
							<div class="sameComp_item_title">培养计划:</div>
							<div class="sameComp_item_content">
								<uploader
									pathPrefix="qlth"
									:disabled="!planIsEnd"
									@delete="planFileDelete($event, item.id)"
									@input="planFileChange($event, item.id)"
									:showMode="planIsEnd ? 'cover' : 'none'"
									:extList="['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'pdf']"
									v-model="item.fileJson"
									:multiple="true"
								></uploader>
							</div>
						</div>
					</div>
				</div>
				<div class="header" v-show="activeName === 'helpRecord'">
					<el-row>
						<el-col :span="19">
							<el-button size="medium" @click="$router.back()">返回</el-button>
						</el-col>
					</el-row>
				</div>
				<div class="sameComp" v-show="activeName === 'helpRecord'">
					<div class="none_word" v-if="!helpIsEnd">当前日期不在上报开始日期至截止日期范围内，无法上报</div>
					<div class="sameComp_item" v-for="(item, index) in helpData" :key="index + 'planitem'" style="padding-top: 50px">
						<div class="sameComp_item_detail">
							<div class="sameComp_item_title">徒弟:</div>
							<div class="sameComp_item_content">{{ item.prenticeName }}</div>
						</div>
						<div class="sameComp_item_detail">
							<div class="sameComp_item_title">帮扶记录:</div>
							<div class="sameComp_item_content">
								<uploader
									pathPrefix="qlth"
									:disabled="!helpIsEnd"
									@delete="helpFileDelete($event, item.id)"
									@input="helpFileChange($event, item.id)"
									:showMode="helpIsEnd ? 'cover' : 'none'"
									:extList="['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'pdf']"
									v-model="item.fileJson"
									:multiple="true"
								></uploader>
							</div>
						</div>
					</div>
				</div>
				<listen-record :id="$route.query.id" v-show="activeName === 'listenRecord'" :isShowButton="false" :isMaster="true"></listen-record>
			</el-tab-pane>
		</el-tabs>
	</div>
</template>
<script>
import batch from './components/batch'
import uploader from './uploader'
import listenRecord from './components/listenRecord'
import _ from 'lodash'
import mixin from '@/mixins/windowResize'
import { getCyanBlueBatchById, getCyanBluePlanOrRecordListByMaster, updateCyanBluePlanOrRecordOrSum } from '@/api/qlthSetting'
export default {
	name: 'eatSettingIndex',
	data: function() {
		return {
			batchDetail: '',
			planIsEnd: false,
			helpIsEnd: false,
			planFileJson: [],
			developFileJson: [],
			paneList: [
				{
					label: '批次',
					name: 'batch'
				},
				{
					label: '培养计划',
					name: 'culturePlan'
				},

				{
					label: '帮扶记录',
					name: 'helpRecord'
				},

				{
					label: '听课记录',
					name: 'listenRecord'
				}
			],
			activeName: 'batch',
			planData: '',
			helpData: ''
		}
	},
	components: {
		batch,
		listenRecord,
		uploader
	},
	mixins: [mixin],
	created() {
		this.getCyanBluePlanOrRecordListByMaster(1)
		this.getCyanBluePlanOrRecordListByMaster(2)
		this.getCyanBlueBatchById()
		this.$route.query.planState !== 2 && this.$route.query.recordState == 2 ? this.paneList.splice(1, 1) : ''
		this.$route.query.planState == 2 && this.$route.query.recordState !== 2 ? this.paneList.splice(2, 1) : ''
	},
	methods: {
		getCyanBlueBatchById() {
			getCyanBlueBatchById({ batchId: this.$route.query.id }).then(res => {
				this.batchDetail = res.data.data
				this.planIsEnd = new Date(this.batchDetail.planStartDate + ' 00:00:01').getTime() < new Date().getTime() && new Date(this.batchDetail.planEndDate + ' 23:59:59').getTime() > new Date().getTime()
				this.helpIsEnd = new Date(this.batchDetail.recordStartDate + ' 00:00:01').getTime() < new Date().getTime() && new Date(this.batchDetail.recordEndDate + ' 23:59:59').getTime() > new Date().getTime()
				console.log(this.helpIsEnd)
			})
		},
		planFileChange(file, id) {
			console.log('planFileChange')
			let fileJson = JSON.stringify(
				file.map(v => {
					return {
						accessUrl: v.fileUrl || v.accessUrl,
						fileName: v.fileName
					}
				})
			)
			this.updateCyanBluePlanOrRecordOrSum(fileJson, id, 1, 1)
		},
		planFileDelete(file, id) {
			let fileJson = JSON.stringify(
				file.value.map(v => {
					return {
						accessUrl: v.fileUrl || v.accessUrl,
						fileName: v.fileName
					}
				})
			)
			this.updateCyanBluePlanOrRecordOrSum(fileJson, id, 1, 2)
		},
		helpFileChange(file, id) {
			let fileJson = JSON.stringify(
				file.map(v => {
					return {
						accessUrl: v.fileUrl || v.accessUrl,
						fileName: v.fileName
					}
				})
			)
			this.updateCyanBluePlanOrRecordOrSum(fileJson, id, 2, 1)
		},
		helpFileDelete(file, id) {
			let fileJson = JSON.stringify(
				file.value.map(v => {
					return {
						accessUrl: v.fileUrl || v.accessUrl,
						fileName: v.fileName
					}
				})
			)
			this.updateCyanBluePlanOrRecordOrSum(fileJson, id, 2, 2)
		},
		getCyanBluePlanOrRecordListByMaster(type) {
			getCyanBluePlanOrRecordListByMaster({
				batchId: this.$route.query.id,
				type: type
			}).then(res => {
				switch (type) {
					case 1:
						this.planData = res.data.data
						res.data.data.forEach(v => {
							v.fileJson = v.fileJson && v.fileJson.length ? JSON.parse(v.fileJson) : []
						})
						break
					case 2:
						this.helpData = res.data.data
						res.data.data.forEach(v => {
							v.fileJson = v.fileJson && v.fileJson.length ? JSON.parse(v.fileJson) : []
						})
						break
				}
			})
		},
		updateCyanBluePlanOrRecordOrSum(fileJson, id, type, isDelete) {
			updateCyanBluePlanOrRecordOrSum({
				id: id,
				fileJson: fileJson
			}).then(res => {
				isDelete === 1 ? this.$message.success('上传成功！') : this.$message.success('删除成功！')
				this.getCyanBluePlanOrRecordListByMaster(type)
			})
		}
	}
}
</script>
<style scoped="scoped" lang="scss">
.header {
	padding-bottom: 10px;
	overflow: hidden;
	border-bottom: 1px solid #dcdfe6;
}
.restaurantRefundregister {
	padding: 12px 12px 0 12px;
}
.sameComp {
	margin: 0 auto;
	width: 800px;
	.none_word {
		margin: 20px 0 50px 0;
		font-size: 16px;
		font-weight: bold;
		text-align: center;
	}
	.sameComp_item {
		margin-bottom: 10px;
		.sameComp_item_detail {
			display: flex;
			margin-bottom: 20px;
			.sameComp_item_title {
				width: 100px;
				text-align: right;
				font-weight: bold;
				color: #666;
				margin-right: 20px;
			}
			.sameComp_item_content {
				flex: 1;
			}
		}
	}
}
.el-select {
	width: 100px;
}
.top {
	padding-bottom: 10px;
	overflow: hidden;
}
.top-top {
	margin-bottom: 10px;
	overflow: hidden;
}
.button {
	box-sizing: border-box;
	width: 50%;
	text-align: center;
	float: left;
	height: 36px;
	line-height: 36px;
	border: 1px solid #dcdfe6;
	color: #606266;
	cursor: pointer;
}
.button-box {
	border-radius: 5px;
	overflow: hidden;
}
.color {
	color: #fff;
	background: #409eff;
	border: 1px #409eff solid;
}
</style>
