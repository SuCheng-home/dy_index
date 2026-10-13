<template>
	<span>
		<template v-if="hasTolls">
			<el-button v-if="isbutton" class="filter-item" :type="mytype" size="medium" icon="plus" @click="dialogTableVisible = true"><slot></slot></el-button>
			<div v-else class="address-input" @click="dialogTableVisible = true">
				<div class="search-input clearfix">
					<span class="search-item" :key="item.id" v-for="item in chosedHeadRealyData">
						<img v-if="item.dataType === 'user'" :src="item.avatar" />
						<img v-if="item.dataType === 'depart'" :src="require('@/assets/images/depart.png')" />
						<img
							v-if="item.dataType === 'group'"
							:src="['', 'https://cdnfile-10043692.file.myqcloud.com/misc/address/address_teacher_group.jpg', 'https://cdnfile-10043692.file.myqcloud.com/misc/address/address_stu_group.jpg', 'https://cdnfile-10043692.file.myqcloud.com/misc/address/address_parent_group.jpg'][item.type]"
						/>
						<span class="search-item-des">{{ item.name }}</span>
					</span>
				</div>
				<span v-show="chosedHeadRealyData.length === 0" class="noda-info">{{ config.nodeTitle ? config.nodeTitle : '点击选择范围' }}</span>
				<i class="el-icon-plus"></i>
			</div>
		</template>
		<el-dialog id="address-dialog" :title="config.title ? config.title : '请选择操作范围'" :visible.sync="dialogTableVisible" :close-on-press-escape="false" :close-on-click-modal="false" :modal-append-to-body="false" append-to-body top="50px !important" @open="addressOpen">
			<div class="address-body">
				<div class="address-input el-table__body-wrapper">
					<div class="search-input clearfix">
						<span class="search-item" :key="item.id" v-for="item in chosedHeadData">
							<img v-if="item.dataType === 'user'" :src="item.avatar" />
							<img v-if="item.dataType === 'depart'" :src="require('@/assets/images/depart.png')" />
							<img
								v-if="item.dataType === 'group'"
								:src="['', 'https://cdnfile-10043692.file.myqcloud.com/misc/address/address_teacher_group.jpg', 'https://cdnfile-10043692.file.myqcloud.com/misc/address/address_stu_group.jpg', 'https://cdnfile-10043692.file.myqcloud.com/misc/address/address_parent_group.jpg'][item.type]"
							/>
							<span class="search-item-des">{{ item.name }}</span>
							<span class="search-item-del" @click="delCurrentHeaderData(item)"></span>
						</span>
					</div>
					<!-- <el-autocomplete class="inline-input" v-model="searchContent" :fetch-suggestions="querySearch" placeholder="请输入姓名或手机快速找人" :trigger-on-focus="false"></el-autocomplete> -->
					<el-input v-if="config.depart.target != 'depart'" class="inline-input" v-model="searchContent" placeholder="请输入姓名或手机快速找人" icon="search" @input="handleInputChange"></el-input>
				</div>
				<div class="search-result-box">
					<div class="search-result el-table__body-wrapper" v-show="searchContent.length > 0">
						<ul>
							<li v-if="searchData.length > 0" v-for="item in searchData" @click="searchChose(item)" class="">
								<img class="seacher-img" :src="item.avatar" />
								<span>{{ item.name }}</span>
							</li>
							<li v-if="searchData.length == 0" class=""><span>没有匹配的信息~</span></li>
						</ul>
					</div>
				</div>
				<el-tabs v-model="activeName">
					<el-tab-pane v-if="config.depart" label="组织架构" name="departTree">
						<div>
							<el-breadcrumb separator="/">
								<el-breadcrumb-item v-for="item in chosedOrgData" :key="item.id" @click.native="loadMenuData(item.id)">{{ item.name }}</el-breadcrumb-item>
							</el-breadcrumb>
							<div class="address-datalist">
								<ul class="address-box">
									<template v-if="activeDepartData.length > 0" v-for="item in activeDepartData">
										<li @click="liClickHandler(item)" v-if="checkShowOrg(item.dataType)">
											<div class="address-box-item" v-if="checkShowOrg(item.dataType)">
												<div class="address-list-title">
													<img v-if="item.dataType === 'depart'" class="address-data-img" :src="require('@/assets/images/depart.png')" />
													<img v-else class="address-data-img" :src="item.avatar" />
													<span v-if="item.dataType === 'depart'" class="link-type-gray" :class="{ 'link-type': item.hasChild == 1 }" @click.stop="loadNextDepart(item)">{{ item.name }}</span>
													<span v-else>{{ item.name }}</span>
												</div>
												<div class="address-list-bars">
													<el-checkbox @click.native.stop v-if="checkOrgCkeckBox(item)" :key="item.id" :disabled="item.disabled" :checked="item.checked" v-model="item.checked" @change="handleSelectionChange(item)"></el-checkbox>
												</div>
											</div>
										</li>
									</template>
									<template v-if="activeDepartData.length == 0">
										<li>
											<div class="address-box-item">
												<div class="address-list-title">
													<span>暂无数据！</span>
												</div>
											</div>
										</li>
									</template>
								</ul>
							</div>
							<div>
								<el-checkbox style="float:right;" v-if="!config.SingleChose" @change="handleOrgCheckAllChange">全选</el-checkbox>
							</div>
						</div>
					</el-tab-pane>
					<el-tab-pane v-if="config.group" label="常用组" name="group">
						<div>
							<el-button v-show="showGroupBackBtn" type="text" @click.native="loadInitGroup">&lt; 返回</el-button>
							<div class="address-datalist">
								<ul class="address-box">
									<li @click="liClickHandler(item)" v-for="item in groupData">
										<div class="address-box-item">
											<div class="address-list-title">
												<img
													v-if="item.dataType === 'group'"
													class="address-data-img"
													:src="['', 'https://cdnfile-10043692.file.myqcloud.com/misc/address/address_teacher_group.jpg', 'https://cdnfile-10043692.file.myqcloud.com/misc/address/address_stu_group.jpg', 'https://cdnfile-10043692.file.myqcloud.com/misc/address/address_parent_group.jpg'][item.type]"
												/>
												<img v-else class="address-data-img" :src="item.avatar" />
												<span :class="{ 'link-type': item.hasChild }" class="link-type-gray" @click.stop="loadGroupUsers(item)">{{ item.name }}</span>
											</div>
											<div class="address-list-bars" v-if="isShowGroupCheckbox(item)">
												<el-checkbox @click.native.stop :key="item.id" :disabled="item.disabled" v-model="item.checked" @change="handleSelectionChange(item)"></el-checkbox>
											</div>
										</div>
									</li>
								</ul>
							</div>
							<div>
								<el-checkbox style="float:right;" v-if="!config.SingleChose" @change="handleGroupCheckAllChange">全选</el-checkbox>
							</div>
						</div>
					</el-tab-pane>
				</el-tabs>
			</div>
			<div slot="footer" class="dialog-footer">
				<el-button size="medium" @click="dialogTableVisible = false">取 消</el-button>
				<el-button size="medium" type="primary" @click="choseAddressBtn">确 定</el-button>
			</div>
		</el-dialog>
	</span>
</template>
<script>
import { init, queryByDepartId, packgeDepartArray, packgeHeaderArray, packageCheckedOrg, getChosedData, delCurrentHeaderData, retrievalUsers, queryByGroupId, getCommitAddressParams, getDepartIds } from '@/api/addressBox'
import mixin from '@/mixins/windowResize'
import $ from 'jquery'
import debounce from 'lodash/debounce'

export default {
	props: {
		value: {
			type: Object,
			default: function() {
				return {}
			}
		},
		config: {
			type: Object,
			default: function() {
				return {}
			}
		},
		isbutton: {
			type: Boolean,
			default: false
		},
		hasTolls: {
			type: Boolean,
			default: true
		},
		dataSuffix: {
			type: String,
			default: 'Json'
		},
		mytype: {
			type: String,
			default: 'primary'
		},
		isSchoolManager: {
			type: Boolean,
			default: false
		}
	},
	data() {
		return {
			activeName: this.config.depart ? 'departTree' : 'group',
			dialogTableVisible: false,
			searchContent: '',
			departData: [], //所有depart集合包含user
			activeDepartData: [], //当前选中的depart列表包含user
			departMenu: [], //部门menu
			groupData: [],
			groupMenu: [], //群组menu
			chosedOrgData: [{ name: '全部', id: -1000 }], //已选择的部门、用户、群组数据
			chosedHeadData: [], //头部选中的集合
			chosedHeadRealyData: [], //头部集合实际数据，在点击确定时赋值
			showGroupBackBtn: false, //控制显示加载群组返回按钮
			orgCheckAll: false,
			groupCheckAll: false,
			isIndeterminateOrg: true,
			cutH: 0,
			dragging: false,
			searchData: [], //检索结果
			seatchRootIds: '' //检索条件用的参数，用于记录搜索根目录下的部门id拼接
		}
	},
	watch: {
		value(val) {
			let arrayHeaderData = []
			this.chosedHeadRealyData = packgeHeaderArray({
				departArray: val[`depart${this.dataSuffix}`] || [],
				userArray: val[`user${this.dataSuffix}`] || [],
				groupArray: val[`group${this.dataSuffix}`] || []
			})
			this.chosedHeadData = this.chosedHeadRealyData
		}
	},
	mixins: [mixin],
	created() {
		this.initCreated()
	},
	mounted() {
		this.$nextTick(() => {
			let _this = this
			// $('#address-dialog .el-dialog').height(this.maxH );
			$('#address-dialog .address-box').height(this.maxH - 100 - 300)
			let iX = 0
			let iY = 0
			$('.el-dialog__header').mousedown(function(e) {
				_this.dragging = true
				iX = e.clientX - $('#address-dialog .el-dialog').position().left
				iY = e.clientY - $('#address-dialog .el-dialog').position().top
				return false
			})
			document.onmousemove = function(e) {
				if (_this.dragging) {
					var e = e || window.event
					var oX = e.clientX - iX
					var oY = e.clientY - iY
					if (oY > 0) {
						$('#address-dialog .el-dialog').css('cssText', 'left:' + oX + 'px !important;' + 'top:' + oY + 'px !important')
					} else {
						_this.dragging = false
					}
					return false
				}
			}
			$('#address-dialog .el-dialog__header').mouseup(function(e) {
				_this.dragging = false
			})
		})
	},
	methods: {
		initCreated() {
			//初始化cretead方法，用于在creared和open的时候调用
			const token = this.$store.getters.token
			if (this.config.group === true) {
				this.config.group = {
					groupTarget: 'all',
					groupScope: [1]
				}
			}
			init(this.isSchoolManager, token)
				.then(res => {
					const packgeData = packgeDepartArray(
						{
							departArray: res.data.data.departs,
							userArray: res.data.data.users
						},
						false,
						this.chosedHeadData,
						{ departType: this.config.depart.departType }
					)
					this.activeDepartData = packgeData
					if (this.config.group) {
						const groupScope = this.config.group.groupScope || [1, 3]
						res.data.data.groups = res.data.data.groups.filter(item => {
							return groupScope.includes(item.type)
						})
					}

					this.groupData = packgeDepartArray({ groupArray: res.data.data.groups }, false, this.chosedHeadData, { departType: this.config.depart.departType })
					this.chosedHeadData = this.chosedHeadRealyData

					if (this.value) {
						this.chosedHeadRealyData = packgeHeaderArray({
							departArray: this.value[`depart${this.dataSuffix}`] || [],
							userArray: this.value[`user${this.dataSuffix}`] || [],
							groupArray: this.value[`group${this.dataSuffix}`] || []
						})
						this.chosedHeadData = this.chosedHeadRealyData
					}

					this.chosedOrgData = [{ name: '全部', id: -1000 }]
					this.seatchRootIds = getDepartIds(this.activeDepartData)
				})
				.catch()
		},
		isShowGroupCheckbox(item) {
			return this.config.group && (this.config.group.groupTarget === 'all' || this.config.group.groupTarget === item.dataType)
		},
		loadNextDepart(row) {
			if (this.config.depart.target == 'depart' && row.hasChild == false) {
				//如果是选择部门且没有子部门
				return
			}
			const id = row.id
			const token = this.$store.getters.token
			queryByDepartId(id, this.config.depart.userTypes, token)
				.then(res => {
					const packgeData = packgeDepartArray(
						{
							departArray: res.data.data.departs,
							userArray: res.data.data.users
						},
						row.checked,
						this.chosedHeadData,
						{ departType: this.config.depart.departType }
					)
					this.activeDepartData = packgeData
					this.chosedOrgData.push({ name: row.name, id: row.id })
					this.$nextTick(function() {
						this.initTableChecked()
					})
				})
				.catch()
		},
		loadInitGroup() {
			//初始化群组信息
			const token = this.$store.getters.token
			init(this.isSchoolManager, token)
				.then(res => {
					if (this.config.group) {
						const groupScope = this.config.group.groupScope || [1, 3]
						res.data.data.groups = res.data.data.groups.filter(item => {
							return groupScope.includes(item.type)
						})
					}
					this.groupData = packgeDepartArray({ groupArray: res.data.data.groups }, false, this.chosedHeadData, { departType: this.config.depart.departType })
				})
				.catch()
			this.showGroupBackBtn = false
		},
		loadGroupUsers(row) {
			//加载群组用户
			if (row.dataType === 'user') return
			const token = this.$store.getters.token
			queryByGroupId(row.id, token)
				.then(res => {
					this.groupData = packgeDepartArray({ userArray: res.data.data.users }, row.checked, this.chosedHeadData, { departType: this.config.depart.departType })
				})
				.catch()
			this.showGroupBackBtn = true
		},
		loadMenuData(id) {
			this.chosedOrgData = packageCheckedOrg(this.chosedOrgData, id) //处理地址簿导航栏
			const token = this.$store.getters.token
			if (id === -1000) {
				init(this.isSchoolManager, token)
					.then(res => {
						const packgeData = packgeDepartArray(
							{
								departArray: res.data.data.departs,
								userArray: res.data.data.users
							},
							false,
							this.chosedHeadData,
							{ departType: this.config.depart.departType }
						)
						this.activeDepartData = packgeData
					})
					.catch()
			} else {
				queryByDepartId(id, this.config.depart.userTypes, token)
					.then(res => {
						//加载点击数据
						const packgeData = packgeDepartArray(
							{
								departArray: res.data.data.departs,
								userArray: res.data.data.users
							},
							false,
							this.chosedHeadData,
							{ departType: this.config.depart.departType }
						)
						this.activeDepartData = packgeData
					})
					.catch()
			}
		},
		liClickHandler(row) {
			if (this.config.depart.notCheckSchool) {
				return
			}
			if (!row.disabled) {
				row.checked = !row.checked
				this.handleSelectionChange(row)
			}
		},
		handleSelectionChange(row) {
			//列表checkbox点击事件
			if (row.checked) {
				this.chosedHeadData = getChosedData(this.chosedHeadData, row, this.config.SingleChose, this.config.depart.target)
				if (this.config.SingleChose) {
					this.activeDepartData.forEach(function(item) {
						item.checked = false
					})
					this.groupData.forEach(function(item) {
						item.checked = false
					})
					row.checked = true
				}
			} else {
				this.delCurrentHeaderData(row)
				row.checked = false
			}
		},
		delCurrentHeaderData(row) {
			//头部删除当前的选择项
			this.chosedHeadData = delCurrentHeaderData(this.chosedHeadData, row.id)
			let array = []
			this.activeDepartData.forEach(function(item) {
				if (item.id === row.id) {
					item.checked = !item.checked
				}
				array.push(item)
			})
			this.activeDepartData = array
		},
		initTableChecked() {
			//初始化列表中的checkedbox
		},
		choseAddressBtn() {
			//地址簿确定按钮
			this.dialogTableVisible = false
			let outAddress = getCommitAddressParams(this.chosedHeadData)
			if (!!this.dataSuffix && this.dataSuffix !== 'Json') {
				outAddress = {
					[`user${this.dataSuffix}`]: outAddress.userJson,
					[`depart${this.dataSuffix}`]: outAddress.departJson,
					[`group${this.dataSuffix}`]: outAddress.groupJson
				}
			}
			this.$emit('input', outAddress)
			this.$emit('confirm', outAddress)
		},
		handleOrgCheckAllChange(event) {
			let array = []
			let _this = this
			this.activeDepartData.forEach(item => {
				let ckeckResult = true
				if (this.config.depart.isIgnoreDepart) {
					if (((item.type == 1 || item.type == 2) && item.dataType === 'depart') || item.type == 5) {
						ckeckResult = false
					}
				}
				console.log('item', item)
				if (this.config.depart.isIgnoreGrade) {
					if (item.type == 3) {
						ckeckResult = false
					}
				}
				if (item.type == 5) {
					ckeckResult = !this.config.depart.notCheckSchool
				}
				if (ckeckResult && event && item.checked == false && item.type && (item.type != 5 || _this.config.depart.canCheckSchool)) {
					//如果全选按钮是选中且当前数据不是选中状态
					_this.chosedHeadData = getChosedData(_this.chosedHeadData, item, _this.config.SingleChose, _this.config.depart.target)
				}

				if (event == false && item.checked == true) {
					//如果全选按钮是选中且当前数据是选中状态，则删除
					_this.chosedHeadData = delCurrentHeaderData(_this.chosedHeadData, item.id)
				}

				item.checked = event //将当前数据的状态同全选复选框状态保持一致
				array.push(item)
			})
			this.activeDepartData = array
			this.isIndeterminateOrg = false
		},
		handleGroupCheckAllChange(event) {
			let array = []
			let _this = this
			this.groupData.forEach(function(item) {
				if (event && item.checked == false) {
					//如果全选按钮是选中且当前数据不是选中状态
					_this.chosedHeadData = getChosedData(_this.chosedHeadData, item, _this.config.SingleChose, _this.config.depart.target)
				}
				if (event == false && item.checked == true) {
					_this.chosedHeadData = delCurrentHeaderData(_this.chosedHeadData, item.id)
				}
				item.checked = event //将当前数据的状态同全选复选框状态保持一致
				array.push(item)
			})
			this.groupData = array
			this.isIndeterminateOrg = false
		},
		checkShowOrg(data) {
			//检查是否显示部门,用于控制部门和用户的显示，根据config.target参数来控制
			let ckeckResult = true
			if (this.config.depart.target == 'depart' && data == 'user') {
				ckeckResult = false
			}
			return ckeckResult
		},
		checkOrgCkeckBox(data) {
			//检查是否显示checkbox复选框
			let ckeckResult = true
			if (this.config.depart.target == 'user' && data.dataType == 'depart') {
				ckeckResult = false
			}
			if (this.config.depart.isIgnoreDepart) {
				if (((data.type == 1 || data.type == 2) && data.dataType === 'depart') || data.type == 5) {
					ckeckResult = false
				}
			}
			if (this.config.depart.isIgnoreGrade) {
				if (data.type == 3) {
					ckeckResult = false
				}
			}
			if (data.type == 5) {
				ckeckResult = !this.config.depart.notCheckSchool
			}

			return ckeckResult
		},
		handleInputChange: debounce(function(val) {
			const token = this.$store.getters.token
			let excludeUserIdsStr = ''
			this.chosedHeadData.forEach(function(item) {
				excludeUserIdsStr += item.id + ','
			})
			let queryList = {
				condition: this.searchContent.trim(),
				userTypes: this.config.depart.userTypes,
				token: token,
				excludeUserIdsStr: excludeUserIdsStr,
				departIds: this.seatchRootIds
			}
			if (this.seatchRootIds.length > 0) {
				retrievalUsers(queryList)
					.then(res => {
						const packgeData = packgeDepartArray({ userArray: res.data.data }, false, this.chosedHeadData, { departType: this.config.depart.departType })
						this.searchData = packgeData
					})
					.catch()
			}
		}, 500),
		searchChose(row) {
			//处理选择的数据
			this.chosedHeadData = getChosedData(this.chosedHeadData, row, this.config.SingleChose, this.config.depart.target)
			if (this.config.SingleChose) {
				this.activeDepartData.forEach(function(item) {
					item.checked = false
				})
				this.groupData.forEach(function(item) {
					item.checked = false
				})
				row.checked = true
			}

			//选择完成后列表数据的处理
			this.searchContent = ''
			this.searchData = []
		},
		addressOpen() {
			this.initCreated()
		},
		showAddress() {
			//此方法用于ref的调用，适用hasTolls为false的情况
			this.dialogTableVisible = true
		}
	}
}
</script>

<style lang="scss" scoped>
@import './../../styles/mixin.scss';

.address-input {
	border: 1px solid #bfcbd9;
	min-height: 40px;
	background-image: none;
	border-radius: 4px;
	max-height: 70px;
	overflow-y: auto;
	position: relative;
	padding-right: 20px;
}

.address-input .el-icon-plus {
	position: absolute;
	top: 10px;
	right: 5px;
	font-size: 20px;
	color: #909399;
}

.noda-info {
	color: #bfcbd9;
	padding-left: 10px;
	line-height: 34px;
	float: left;
}

.address-body {
	min-height: 400px;
	position: relative;
}

.el-dialog__body {
	border-top: 1px solid #bfcbd9;
}

.address-input input {
	border: 0px solid #bfcbd9 !important;
}

.el-dialog__body {
	padding-top: 10px !important;
}

.address-data-img {
	position: relative;
	top: 8px;
	width: 24px;
	max-height: 24px;
}

.search-input {
	padding-top: 2px;
}

.search-item {
	height: 25px;
	margin-left: 4px;
	margin-top: 2px;
	margin-right: 5px;
	line-height: 25px;
	display: inline-block;
	background-color: #eee;
	border-radius: 3px;
	padding-right: 4px;
	float: left;
	margin-bottom: 2px;
}

.search-item > img {
	float: left;
	width: 25px;
	height: 25px;
	margin-right: 3px;
}

.search-item-del {
	display: block;
	float: right;
	width: 13px;
	height: 13px;
	margin-top: 6px;
	margin-left: 4px;
	background: url(../../assets/images/close.png) left top no-repeat;
	cursor: pointer;
}

.search-item-del:hover {
	background-position: 0px -13px;
}

.address-box {
	height: 300px;
	overflow-y: auto;
	-webkit-padding-start: 0px;
	@include scrollBar;
	border-left: 1px solid #dfe6ec;
	border-right: 1px solid #dfe6ec;
	border-bottom: 1px solid #dfe6ec;
	border-top: 1px solid #dfe6ec;
}

.search-result ul {
	-webkit-padding-start: 0px;
	padding-left: 0px;
}

.search-result ul img {
	position: relative;
	top: 6px;
}

.address-box li {
	height: 45px;
}

.address-box li,
.search-result li {
	list-style: none;
	border-bottom: 1px solid #dfe6ec;
	padding: 2px 10px;
}

.address-box li:hover,
.search-result li:hover {
	background-color: #eef1f6;
}

.address-box-item {
	// display: flex;
	position: relative;
}

.address-list-title {
	// flex: 1;
	display: inline-block;
}

.address-list-bars {
	width: 20px;
	float: right;
	display: inline-block;
}

.search-result {
	min-height: 35px;
	max-height: 130px;
	border: 1px solid #e5e5e5;
	margin-left: auto;
	margin-right: auto;
	overflow-y: auto;
	background-color: white;
	opacity: 1;
	position: relative;
	left: 0;
	top: 0;
	z-index: 99999999;
}

.search-result img {
	width: 23px;
}

.search-result li span {
	margin-left: 10px;
}

.search-result-box {
	position: absolute;
	width: 100%;
}

#address-dialog .inline-input {
	width: 220px;
}

.link-type-gray {
	cursor: pointer;
}

.seacher-img {
	width: 24px;
	height: 24px;
}
</style>
<style>
#address-dialog .el-dialog__header {
	cursor: move;
}

#address-dialog .el-checkbox {
	line-height: 40px;
}

#address-dialog .inline-input input {
	border: 0px solid #d1dbe5;
	border-radius: 4px 0px 0px 0px;
	padding-left: 30px;
	padding-right: 0px;
}

#address-dialog .inline-input .el-input__icon {
	left: 0px !important;
}

#address-dialog .el-dialog {
	/* position: absolute; */
	margin: 0 auto;
	max-height: 700px;
}

#address-dialog .el-dialog__body {
	padding: 5px 20px;
}
</style>
