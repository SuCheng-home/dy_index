<template>
	<div :class="['file-list', 'file-list--plain']">
		<span class="file-list__title" v-if="isShowTitle">附件</span>
		<div class="file_list_box" :style="`${fileList.length && !plain ? 'background-color: #f7fbfd;' : ''}`">
			<template v-for="fileItem in fileList">
				<div class="file_item" :key="fileItem.id">
					<div
						:class="{
							'file_item-img': true,
							'file_item-img-word': fileItem.fileName.toLowerCase().indexOf('.doc') !== -1 || fileItem.fileName.toLowerCase().indexOf('.docx') !== -1,
							'file_item-img-ppt': fileItem.fileName.toLowerCase().indexOf('.ppt') !== -1 || fileItem.fileName.toLowerCase().indexOf('.pptx') !== -1,
							'file_item-img-pdf': fileItem.fileName.toLowerCase().indexOf('.pdf') !== -1,
							'file_item-img-excel': fileItem.fileName.toLowerCase().indexOf('.xls') !== -1 || fileItem.fileName.toLowerCase().indexOf('.xlsx') !== -1,
							'file_item-img-zip': fileItem.fileName.toLowerCase().indexOf('.zip') !== -1 || fileItem.fileName.toLowerCase().indexOf('.rar') !== -1
						}"
					></div>
					<div class="file_item-des" :class="{ smallWidth: smallWidth }">
						<el-tooltip class="item" effect="dark" :content="fileItem.fileName" placement="top">
							<span>
								{{ fileItem.fileName }}
							</span>
						</el-tooltip>
					</div>

					<a :href="fileItem.accessUrl || fileItem.fileUrl" :download="fileItem.fileName" target="_blank" class="fileIcon">
						<i class="el-icon-download"></i>
					</a>
				</div>
			</template>
		</div>
	</div>
</template>

<script>
export default {
	name: 'FileList',
	props: {
		smallWidth: {
			type: Boolean,
			default: false
		},
		plain: {
			type: Boolean,
			default: false
		},
		fileList: {
			type: Array,
			default: function() {
				return []
			}
		},
		isShowTitle: {
			type: Boolean,
			default: false
		}
	}
}
</script>

<style scoped lang="scss">
// /deep/ .el-tooltip {
// 	overflow-x: hidden;
// 	text-overflow: ellipsis;
// }
.file-list {
	margin: 0 !important;
}
.file-list--plain {
	.fileIcon {
		line-height: 1em !important;
		color: #409eff !important;
		vertical-align: middle !important;
	}
}
.file_list_box {
	// padding: 10px;

	.file_item {
		& + .file_item {
			padding-top: 16px;
		}

		.file_item-img {
			height: 28px;
			width: 28px;
			margin-right: 20px;
			display: inline-block;
			vertical-align: middle;
			background-position: 50%;
			background-size: cover;
		}

		.file_item-img-word {
			background-image: url(https://cdnfile-10043692.file.myqcloud.com/admin/images/upload/word.png);
		}

		.file_item-img-ppt {
			background-image: url(https://cdnfile-10043692.file.myqcloud.com/admin/images/upload/ppt.png);
		}

		.file_item-img-pdf {
			background-image: url(https://cdnfile-10043692.file.myqcloud.com/admin/images/upload/pdf.png);
		}

		.file_item-img-excel {
			background-image: url(https://cdnfile-10043692.file.myqcloud.com/admin/images/upload/excle.png);
		}

		.file_item-img-zip {
			background-image: url(https://cdnfile-10043692.file.myqcloud.com/admin/images/upload/ZIP.png);
		}

		.file_item-img-txt {
			background-image: url(https://cdnfile-10043692.file.myqcloud.com/admin/images/upload/txt.png);
		}

		.file_item-des {
			padding-left: 4px;
			line-height: 30px;
			padding-right: 4px;
			margin-right: 20px;
			display: inline-block;
			vertical-align: middle;
			min-width: 16em;
			max-width: 44%;
			color: #676a6c;
			white-space: nowrap;
			overflow-x: hidden;
			text-overflow: ellipsis;
		}
		.smallWidth {
			min-width: 14em;
		}
		a {
			margin-left: 10px;
			color: #bbb;
			font-size: 20px;
			font-weight: bold;
		}

		.fileIcon {
			display: inline-block;
			line-height: 30px;
			vertical-align: top;
		}
	}
}
</style>
