<template>
	<div class="restaurantRefundregister">
		<el-tabs type="border-card" v-model="activeName" style="min-height:89vh">
			<el-tab-pane :label="item.label" :name="item.name" v-for="item in paneList" :key="item.name">
				<component :is="activeName" ref="componentActive" :id="$route.query.id"></component>
			</el-tab-pane>
		</el-tabs>
	</div>
</template>
<script>
import batch from './components/batch'
import culturePlan from './components/culturePlan'
import helpRecord from './components/helpRecord'
import listenLevel from './components/listenLevel'
import listenRecord from './components/listenRecord'
import studySummary from './components/studySummary'

import _ from 'lodash'
import mixin from '@/mixins/windowResize'
export default {
	name: 'eatSettingIndex',
	data: function() {
		return {
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
				},
				{
					label: '学习总结',
					name: 'studySummary'
				},
				{
					label: '听课排名',
					name: 'listenLevel'
				}
			],
			activeName: 'batch'
		}
	},
	components: {
		batch,
		culturePlan,
		helpRecord,
		listenLevel,
		listenRecord,
		studySummary
	},
	name: 'batchAdd',
	mixins: [mixin],
	//获取渲染数据当数据加载完成后执行(生命周期中的钩子函数)
	created() {},
	methods: {}
}
</script>
<style scoped="scoped">
.restaurantRefundregister {
	padding: 12px 12px 0 12px;
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
