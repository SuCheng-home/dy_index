<template>
	<div class="restaurantRefundregister">
		<el-tabs type="border-card" v-model="activeName" style="min-height:89vh">
			<el-tab-pane :label="item.label" :name="item.name" v-for="item in paneList" :key="item.name">
				<!-- <component :is="activeName" ref="componentActive" id="10"></component> -->
				<batch :id="$route.query.id" v-show="activeName === 'batch'" :isShowButton="false"></batch>
				<div class="header" v-show="activeName === 'studySummary'">
					<el-row>
						<el-col :span="19">
							<el-button size="medium" @click="$router.back()">返回</el-button>
						</el-col>
					</el-row>
				</div>
				<div class="sameComp" v-show="activeName === 'studySummary'" style="padding-top: 50px">
					<div class="none_word" v-if="!timeIsEnd">当前日期不在上报开始日期至截止日期范围内，无法上报</div>
					<div class="sameComp_item" v-for="(item, index) in sumData" :key="index + 'sum'">
						<div class="sameComp_item_detail">
							<div class="sameComp_item_title">师傅:</div>
							<div class="sameComp_item_content">{{ item.masterName }}</div>
						</div>
						<div class="sameComp_item_detail">
							<div class="sameComp_item_title">学习总结:</div>
							<div class="sameComp_item_content">
								<uploader pathPrefix="qlth" @delete="fileDelete($event, item.id)" @input="fileChange($event, item.id)" :disabled="!timeIsEnd" :showMode="timeIsEnd ? 'cover' : 'none'" :extList="['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'pdf']" v-model="item.fileJson" :multiple="true"></uploader>
							</div>
						</div>
					</div>
				</div>
				<listen-record :id="$route.query.id" :isPrentice="true" :isShowButton="false" v-show="activeName === 'listenRecord'"></listen-record>
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
import { prenticeBatchSumList, getCyanBlueBatchById, updateCyanBluePlanOrRecordOrSum } from '@/api/qlthSetting'
export default {
	name: 'eatSettingIndex',
	data: function() {
		return {
			sumData: [],
			timeIsEnd: false,
			paneList: [
				{
					label: '批次',
					name: 'batch'
				},
				{
					label: '听课记录',
					name: 'listenRecord'
				},
				{
					label: '学习总结',
					name: 'studySummary'
				}
			],
			activeName: 'batch',
			batchDetail: ''
		}
	},
	components: {
		batch,
		listenRecord,
		uploader
	},
	mixins: [mixin],
	//获取渲染数据当数据加载完成后执行(生命周期中的钩子函数)
	created() {
		this.prenticeBatchSumList()
		this.getCyanBlueBatchById()
		this.$route.query.sumState !== 2 && this.paneList.splice(2, 1)
	},
	methods: {
		fileDelete(file, id) {
			let fileJson = file.value.length
				? JSON.stringify(
						file.value.map(v => {
							return {
								accessUrl: v.fileUrl || v.accessUrl,
								fileName: v.fileName
							}
						})
				  )
				: []
			this.updateCyanBluePlanOrRecordOrSum(fileJson, id, 2)
		},
		fileChange(file, id) {
			let fileJson = file.length
				? JSON.stringify(
						file.map(v => {
							return {
								accessUrl: v.fileUrl || v.accessUrl,
								fileName: v.fileName
							}
						})
				  )
				: []
			this.updateCyanBluePlanOrRecordOrSum(fileJson, id, 1)
		},
		updateCyanBluePlanOrRecordOrSum(fileJson, id, isDelte) {
			updateCyanBluePlanOrRecordOrSum({
				id: id,
				fileJson: fileJson
			}).then(res => {
				isDelte === 1 ? this.$message.success('上传成功！') : this.$message.success('删除成功！')
				this.prenticeBatchSumList()
			})
		},
		prenticeBatchSumList() {
			prenticeBatchSumList({
				batchId: this.$route.query.id
			}).then(res => {
				this.sumData = res.data.data
				res.data.data.forEach(v => {
					v.fileJson = v.fileJson ? JSON.parse(v.fileJson) : []
				})
			})
		},
		getCyanBlueBatchById() {
			getCyanBlueBatchById({ batchId: this.$route.query.id }).then(res => {
				this.batchDetail = res.data.data
				this.timeIsEnd = new Date(this.batchDetail.sumStartDate + ' 00:00:01').getTime() < new Date().getTime() && new Date(this.batchDetail.sumEndDate + ' 23:59:59').getTime() > new Date().getTime()
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
				.sameComp_item_content {
				}
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
