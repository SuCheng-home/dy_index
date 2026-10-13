<template>
	<div class="add-wrap app-container">
		<el-row style="padding-bottom:20px">
			<!--编辑-->
			<el-col>
				<div class="btn_hearder">
					<el-button class="detail-backBtn" size="medium" @click="$router.back()">返回</el-button>
				</div>
			</el-col>
		</el-row>
		<div class="explain-wrap">
			<div>说明:</div>
			<div style="padding-left: 20px;margin-top: 15px">
				<div>1.请先下载模板，严格根据模板的格式来录入数据；</div>
				<br />
				<div>2.师傅姓名、徒弟姓名为必填字段；</div>
				<br />
				<div>3.在执行批量导入操作后，会跳转到结果页面。如有失败结果，可下载之后修改再次导入。</div>
			</div>
			<div class="line"></div>
			<div class="down-wrap">
				<div class="excel">
					<a target="_blank" :href="downloadUrl" download="学生导入模版下载">
						<img src="https://cdnfile-10043692.cos.ap-shanghai.myqcloud.com/admin/images/excel-logo.png" alt="" />
						<span>下载模板</span>
					</a>
				</div>
				<el-upload style="display:inline-block;margin-top:20px" class="upload-import" name="file" :action="uploadPath" :data="uploadData" :show-file-list="false" :before-upload="beforeAvatarUpload" :on-success="handleAvatarSuccess">
					<el-button type="primary" size="medium">选择文件</el-button>
				</el-upload>
			</div>
		</div>
	</div>
</template>
<script>
import mixin from '@/mixins/windowResize'
import AddressBook from '@/components/AddressBook/indexExpand'
export default {
	name: 'formAddOne',
	data: function() {
		return {
			uploadPath: '',
			uploadData: '',
			downloadUrl: ''
		}
	},
	components: {
		AddressBook
	},
	mixins: [mixin],
	mounted() {
		this.uploadPath = global.BasePath + 'structure/cyanBlue/importMasterPrentice'
		this.uploadData = {
			token: this.$store.getters.token
		}
		this.downloadUrl = 'http://cdnfile-10043692.cos.ap-shanghai.myqcloud.com/admin/csv/师徒名单.csv'
	},
	methods: {
		handleAvatarSuccess(res) {
			if (res.code === 200) {
				this.$message({
					message: '模板导入成功！',
					type: 'success'
				})
				this.$router.back()
			} else {
				this.$message({
					message: res.msg,
					type: 'error',
					dangerouslyUseHTMLString: true
				})
			}
		},
		beforeAvatarUpload(file) {
			let suffix = file.name.split('.')[file.name.split('.').length - 1]
			if (suffix !== 'csv') {
				this.$message.error('上传的文件格式应为模板文件!')
				return false
			}
		}
	},
	watch: {}
}
</script>
<style lang="scss" scoped>
.add-wrap {
	padding: 12px;
	.btn_hearder {
		padding-bottom: 12px;
		border-bottom: 1px solid #e7eaec;
	}
	.explain-wrap {
		font-size: 18px;
		color: #555;
		padding: 20px;
		.line {
			margin-top: 30px;
			height: 1px;
			background: #ccc;
		}
		.down-wrap {
			padding: 30px;
			.excel {
				width: 80px;
				display: flex;
				flex-direction: column;
				align-items: center;
				img {
					width: 80px;
					height: 80px;
					margin-bottom: 10px;
				}
				span {
					cursor: pointer;
				}
				span:hover {
					text-decoration: underline;
					color: #000;
				}
			}
		}
	}
}
</style>
