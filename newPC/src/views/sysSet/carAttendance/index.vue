<template>
	<div class="carAttendance">
		<el-tabs type="border-card" v-model="activeName" style="min-height:87vh">
			<el-tab-pane :label="item.label" :name="item.name" v-for="item in paneList" :key="item.name">
				<component :is="activeName" ref="componentActive"></component>
			</el-tab-pane>
		</el-tabs>
	</div>
</template>
<script>
import carManage from './carManage'
import parkingManage from './parkingManage'

import _ from 'lodash'
import mixin from '@/mixins/windowResize'
export default {
	name: 'eatSettingIndex',
	data: function() {
		return {
			paneList: [
				{
					label: '车辆管理',
					name: 'carManage'
				},
				{
					label: '停车场管理',
					name: 'parkingManage'
				}
			],
			activeName: 'carManage'
		}
	},
	components: {
		carManage,
		parkingManage
	},
	name: 'carAttendanceIndex',
	mixins: [mixin],
	//获取渲染数据当数据加载完成后执行(生命周期中的钩子函数)
	created() {},
	methods: {}
}
</script>
<style scoped="scoped">
.carAttendance {
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
