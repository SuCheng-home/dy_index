<template>
	<div class="restaurantRefundregister">
		<el-tabs type="border-card" v-model="activeName" @tab-click="tabsfun()" >
			<el-tab-pane :label="item.label" :name="item.name" v-for="item in paneList" :key="item.name">
				<component :is="activeName" ref="componentActive"></component>
			</el-tab-pane>
		</el-tabs>
	</div>
</template>
<script>
import moment from 'moment'
import { queryRepastUserFireAnalysis, queryDepartByType } from '@/api/restaurantRefund'
import studentNotEatSetting from './studentNotEatSetting'
import teacherNotEatSetting from './teacherNotEatSetting'
import eatAddressSetting from './eatAddressSetting'
import stopgangsettings from './stopgangsettings'

import _ from 'lodash'
import mixin from '@/mixins/windowResize'
export default {
	name: 'eatSettingIndex',
	components: {
		studentNotEatSetting,
		teacherNotEatSetting,
		eatAddressSetting,
		stopgangsettings
	},
	activated() {
		switch (this.activeName) {
			case 'eatAddressSetting':
				this.$refs.componentActive[1].queryListFunc()
				break
		}
	},
	data: function() {
		return {
			paneList: [
				{
					label: '停伙时间设置',
					name: 'stopgangsettings'
				},
				{
					label: '就餐地点设置',
					name: 'eatAddressSetting'
				},
				{
					label: '学生不就餐设置',
					name: 'studentNotEatSetting'
				},
				{
					label: '老师不就餐设置',
					name: 'teacherNotEatSetting'
				}
			],
			activeName: 'stopgangsettings'
		}
	},
	mixins: [mixin],
	//获取渲染数据当数据加载完成后执行(生命周期中的钩子函数)
	created() {},
	methods: {}
}
</script>
<style scoped="scoped">
.restaurantRefundregister {
	padding: 12px;
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
