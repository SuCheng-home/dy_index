<template>
	<div class="restaurantRefundcharget">
		<div class="top">
			<el-button @click="$router.back()" size="medium">返回</el-button>
			<el-button type="primary" @click="saveChargeNotice(2)" size="medium">提交审核</el-button>
			<el-button type="primary" @click="thdialogVisible = true" v-if="thlist.length > 0" size="medium">缴费老师</el-button>
		</div>
		<div :style="'overflow: auto;padding-top:20px;height:' + nobottommaxH + 'px'">
			<div class="body">
				<el-form ref="query" :model="query" label-width="140px" :rules="rules" v-loading="loading">
					<el-form-item label="收费名称" prop="chargeName">
						<el-input v-model.trim="query.chargeName" placeholder="请输入收费名称(1~30)" :maxlength="30"></el-input>
					</el-form-item>
					<el-form-item label="收费类型" prop="typeId">
						<el-select v-model="query.typeId" placeholder="请选择收费类型" disabled>
							<el-option v-for="item in NoticeType" :label="item.value" :value="item.code" :key="item.code"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="截止时间" prop="deadlineTime">
						<el-date-picker v-model.trim="query.deadlineTime" :editable="false" type="date" placeholder="选择截止时间" :picker-options="pickerOptions"></el-date-picker>
					</el-form-item>
					<el-form-item label="审批人">
						<el-radio-group v-model="query.examineUser.id">
							<el-radio v-for="item in sprList" :label="item.id" :key="item.id">{{ item.name }}</el-radio>
						</el-radio-group>
					</el-form-item>
					<el-form-item label="落款">
						<div class="boxInput">
							<el-input v-model.trim="query.inscription" placeholder="请输入或选则落款部门(1~10)" :maxlength="10"></el-input>
							<div class="boederheid"></div>
						</div>
						<div class="box">
							<el-select v-model="query.inscription">
								<el-option v-for="item in departmentList" :label="item.name" :value="item.name" :key="item.name"></el-option>
							</el-select>
						</div>
					</el-form-item>
					<el-form-item class="form-item--richtext" prop="content" label="收费内容">
						<ueditor class="rich-editor new-editor" ref="ueditor" :defaultMes="query.content" @editModel="richTextEditHandler"></ueditor>
					</el-form-item>
				</el-form>
			</div>
		</div>
		<el-dialog title="新建提示内容" :visible.sync="dialogVisible">
			<div class="content-box" v-html="content"></div>
			<span slot="footer" class="dialog-footer">
				<el-button type="primary" @click="dialogVisible = false">确 定</el-button>
			</span>
		</el-dialog>
		<el-dialog title="缴费老师" :visible.sync="thdialogVisible" width="840px">
			<div class="thcontent-box">
				<div class="th-box" v-for="(item, index) in thlist" :key="index">
					<span class="name">姓名:</span>
					<span class="thname">{{ item.userName }}</span>
					<span class="name">金额:</span>
					<span class="num">{{ item.totalPrice }}</span>
				</div>
			</div>
			<span slot="footer" class="dialog-footer">
				<el-button type="primary" @click="thdialogVisible = false">确 定</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
import Ueditor from '@/components/Ueditor'
import { queryChargeNoticeList, saveChargeNotice, queryChargeNoticeType } from '@/api/campusFees'
import { getTeacherPayFees } from '@/api/restaurantRefund'
import mixin from '@/mixins/windowResize'
export default {
	name: 'restaurantRefundcharget',
	//引入返回模块
	components: { Ueditor },
	data: function() {
		return {
			pickerOptions: {
				//设置默认大于今天
				disabledDate(time) {
					return time.getTime() < Date.now() - 8.64e7
				}
			},
			rules: {
				chargeName: [
					{
						required: true,
						message: '请输入收费名称',
						trigger: 'blur'
					}
				],
				content: [
					{
						required: true,
						message: '请输入收费内容！',
						trigger: 'blur'
					}
				],
				typeId: [{ required: true, message: '请选择收费类型', trigger: 'change' }],
				deadlineTime: [{ required: true, message: '请选择截止时间', trigger: 'blur' }]
			},
			query: {
				pageNo: 1, //页数
				pageSize: 20, //条数
				searchVal: '',
				chargeName: '', //	收费名称	string
				deadlineTime: '', //	截止时间	string
				id: 0, //	主键id	number	新增传参为0
				inscription: '', //	落款	string
				money: '', //	收费金额	number
				payUserType: 1, //	收费方式	number	0所有人收费金额相同 1所有人收费金额不完全相同
				content: '', //	收费内容	string
				type: '1',
				payUserListName: '', //	交费名单	string
				payUserListUrl: '', //	交费名单	string
				examineUser: { id: '', name: '', loginname: '' }, //	审批人	string	数据格式{"id":10003338,"name":"曹冰","loginname":"caobing"}
				membersInformation: {}, //	交费人群	string	数据格式 {"departs":[{"id":"944","name":"总校高二（1）班"}],"users":[],"groups":[]}
				fileJson: [],
				membersInformations: {},
				typeId: '',
				typeName: '',
				chargeType: 2,
				teachers: ''
			},
			departmentList: [], //下拉框  落款部门
			sprList: [],
			NoticeType: [],
			is: true,
			dialogVisible: false,
			content: '',
			loading: false,
			thdialogVisible: false,
			thlist: []
		}
	},
	mixins: [mixin],
	created() {
		queryChargeNoticeType().then(res => {
			let data = res.data.data
			this.NoticeType = data
			for (let i = 0; i < data.length; i++) {
				if (data[i].value == '伙食费') {
					this.query.typeId = data[i].code
				}
			}
		})
		queryChargeNoticeList(this.query).then(res => {
			let data = res.data.data
			this.departmentList = data.inscriptionList
			this.sprList = data.sprList
			this.query.examineUser.id = data.sprList[0].id
		})
		//获取收费老师
		getTeacherPayFees(this.$route.query).then(res => {
			let data = res.data.data
			this.thlist = data
		})
	},
	methods: {
		uploadFileHandler(data) {
			this.query.fileJson = data
		},
		deleteFileHandler() {
			// videoUrl 置空
			this.query.fileJson = []
		},
		richTextEditHandler(content) {
			this.query.content = content
		},
		//保存
		saveChargeNotice(num) {
			if (this.thlist.length == 0) {
				this.$message({
					type: 'warning',
					message: '当前时间段暂无缴费老师！'
				})
				return
			}
			let list = []
			for (let i = 0; i < this.thlist.length; i++) {
				list.push({ id: this.thlist[i].userId, name: this.thlist[i].userName, money: this.thlist[i].totalPrice })
			}
			this.query.teachers = JSON.stringify(list)
			let $this = this
			this.query.type = num
			this.query.content = this.$refs.ueditor.getContent()
			if (this.query.deadlineTime) {
				this.query.deadlineTime = this.$moment(this.query.deadlineTime).format('YYYY-MM-DD') //时间
			} else {
				this.query.deadlineTime = ''
			}
			for (let i = 0; i < this.sprList.length; i++) {
				if (this.query.examineUser.id == this.sprList[i].id) {
					this.query.examineUser.name = this.sprList[i].name
					this.query.examineUser.loginname = this.sprList[i].loginname
				}
			}
			this.query.membersInformations = JSON.stringify(this.query.membersInformations)
			this.query.examineUser = JSON.stringify(this.query.examineUser)
			this.$refs['query'].validate(valid => {
				if (valid) {
					this.loading = true
					for (let i = 0; i < this.NoticeType.length; i++) {
						if (this.NoticeType[i].code == this.query.typeId) {
							this.query.typeName = this.NoticeType[i].value
						}
					}
					if (this.is) {
						this.is = false
						saveChargeNotice(this.query)
							.then(res => {
								this.loading = false
								this.is = true
								if (res.data.code === 200) {
									this.$message({
										type: 'success',
										message: '操作成功!'
									})
									this.$router.back()
								}
								if (res.data.code === 1005) {
									this.dialogVisible = true
									this.content = res.data.msg
								}
							})
							.catch(function() {
								$this.loading = false
								$this.is = true
							})
					}
				}
				this.query.examineUser = JSON.parse(this.query.examineUser) //将json字符串转换成json对象
			})
		}
	}
}
</script>
<style scoped="scoped">
.el-radio-group {
	margin-top: 15px;
}
.el-radio {
	margin-bottom: 10px;
}
.thcontent-box {
	overflow: hidden;
}
.th-box {
	width: 200px;
	float: left;
	font-size: 14px;
}
.body {
	width: 810px;
	margin: 0 auto;
}
.th-box .name {
	display: inline-block;
	width: 36px;
	color: #666;
	margin-right: 5px;
	font-weight: 600;
	text-align: right;
}
.thname {
	color: #222;
}
.num {
	color: #67c23a;
}
.top {
	border-bottom: 1px #eee solid;
	padding-bottom: 10px;
}
.el-select {
	width: 100%;
}
.restaurantRefundcharget {
	padding: 12px;
}

.restaurantRefundcharget .el-textarea__inner,
.restaurantRefundcharget .el-input {
	width: 100%;
}

.restaurantRefundcharget .box {
	width: 100%;
	position: absolute;
	left: 0;
	top: 0;
}

.restaurantRefundcharget .box .el-select {
	width: 100%;
}
.restaurantRefundcharget .el-form-item__content {
	line-height: 36px;
	position: relative;
	font-size: 14px;
	width: 700px;
}
.restaurantRefundcharget .myaddress-box {
	width: 100%;
}
.restaurantRefundcharget .boxInput {
	width: 90%;
	position: absolute;
	left: 0;
	top: 0;
	z-index: 999;
	border-right: none;
}

.restaurantRefundcharget .boxInput .el-input {
	width: 100%;
}

.restaurantRefundcharget .boederheid {
	width: 30px;
	position: absolute;
	right: -25px;
	top: 1px;
	z-index: 1000;
	background: #fff;
	height: 34px;
}
</style>
