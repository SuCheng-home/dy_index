<template>
	<div class="common_wrap">
		<div class="header">
			<el-row>
				<el-col :span="19">
					<el-button size="medium" @click="$router.back()">返回</el-button>
					<a :href="exportUrl" downLoad="青蓝同辉听课记录" v-if="isShowButton">
						<el-button size="medium" type="primary" v-if="dataList.length">导出</el-button>
					</a>
					<el-button size="medium" type="primary" @click="downAllFiles" v-if="isHasPic && isShowButton">下载</el-button>
				</el-col>
				<el-col :span="5" v-if="isShowButton">
					<el-input size="medium" placeholder="请输入上课人/听课人" v-model="searchName" @keyup.enter.native="searchList">
						<el-button slot="append" icon="el-icon-search" size="medium" @click="searchList"></el-button>
					</el-input>
				</el-col>
			</el-row>
		</div>
		<el-table :data="dataList" :height="maxH - 37" style="width: 100%" border>
			<el-table-column label="上课人" align="center" show-overflow-tooltip>
				<template slot-scope="scope">
					<span>{{ scope.row.type === 2 ? scope.row.masterName : scope.row.prenticeName }}</span>
				</template>
			</el-table-column>
			<el-table-column label="上课主题" align="center" prop="title" show-overflow-tooltip></el-table-column>
			<el-table-column label="听课人" align="center">
				<template slot-scope="scope">
					<!-- <span>{{ isShowButton ? scope.row.prenticeName : isMaster ? scope.row.masterName : scope.row.prenticeName }}</span> -->
					<span>{{ scope.row.type === 2 ? scope.row.prenticeName : scope.row.masterName }}</span>
				</template>
			</el-table-column>
			<el-table-column label="听课时间" align="center">
				<template slot-scope="scope">
					<span>{{ scope.row.classDate }}&nbsp;{{ scope.row.morningOrAfternoon === 1 ? '上午' : '下午' }}</span>
				</template>
			</el-table-column>
			<el-table-column label="听课评价" align="center" show-overflow-tooltip>
					<template slot-scope="scope">
						<span>{{ scope.row.evaluateName || '--' }}</span>
					</template>
			</el-table-column>
			<el-table-column label="听课印象" align="center" show-overflow-tooltip>
				<template slot-scope="scope">
					<span>{{ scope.row.listenRemark }}</span>
				</template>
			</el-table-column>
			<el-table-column label="图片" align="center">
				<template slot-scope="scope">
					<image-previewer class="link" v-if="scope.row.picJson && JSON.parse(scope.row.picJson).length" :images="getImageArr(scope.row.picJson)" tag="img" text="查看图片"></image-previewer>
					<span v-else>--</span>
				</template>
			</el-table-column>
		</el-table>
	</div>
</template>

<script>
import windowResize from '@/mixins/windowResize'
import baseMixin from '@/mixins/baseMixin'
import ImagePreviewer from '@/components/ImagePreviewer/ImagePreviewer.vue'

import { managerBatchClassRecordList, masterBatchClassRecordList, prenticeBatchClassRecordList } from '@/api/qlthSetting'
export default {
	name: 'commonList',
	props: {
		id: {
			type: String,
			default: ''
		},
		isMaster: {
			type: Boolean,
			default: false
		},
		isPrentice: {
			type: Boolean,
			default: false
		},
		isShowButton: {
			type: Boolean,
			default: true
		}
	},
	data() {
		return {
			exportUrl: '',
			isHasPic: false,
			searchName: '',
			dataList: [],
			pagination: {
				pageSize: 10,
				pages: 1,
				total: 0
			}
		}
	},
	computed: {
		getImageArr() {
			return function(val) {
				return JSON.parse(val).map(v => {
					return { src: v.accessUrl || v.picUrl || v.url }
				})
			}
		}
	},
	created() {
		this.isMaster ? this.masterBatchClassRecordList() : this.isPrentice ? this.prenticeBatchClassRecordList() : this.managerBatchClassRecordList()
	},
	mixins: [windowResize, baseMixin],
	components: {
		ImagePreviewer
	},
	methods: {
		downAllFiles() {
			let count = 0
			this.dataList.forEach(v => {
				v.picJson &&
					v.picJson.length &&
					JSON.parse(v.picJson).forEach((picItem,index) => {
						// const name = '帮扶记录图片'
						// const url = picItem.picUrl || picItem.url
						// const suffix = url.substring(url.lastIndexOf('.'), url.length)
						// const x = new XMLHttpRequest()
						// x.open('GET', url, true)
						// x.responseType = 'blob'
						// x.onload = function(e) {
						// 	const url = window.URL.createObjectURL(x.response)
						// 	const a = document.createElement('a')
						// 	a.href = url
						// 	a.download = name + suffix
						// 	a.click()
						// }
						// x.send()
						// var hiddenIFrameID = 'hiddenDownloader' + count++
						// var iframe = document.createElement('iframe')
						// iframe.id = hiddenIFrameID
						// iframe.style.display = 'none'

						// iframe.src = 'https' + picItem.accessUrl.slice(5) //直接下载，不会弹出新的页面
						var filename; //图片名称
      var filetype; //图片类型
      var path = picItem.accessUrl||picItem.picUrl||'';
      if (path.indexOf("/") > 0) {
        var file = path.substring(path.lastIndexOf("/") + 1, path.length);
        var fileArr = file.toLowerCase().split(".");
        filename = fileArr[0];
        filetype = fileArr[1];
      }
      var canvas = document.createElement("canvas");
      var img = document.createElement("img");
      img.onload = function (e) {
        canvas.width = img.width;
        canvas.height = img.height;
        var context = canvas.getContext("2d");
        context.drawImage(img, 0, 0, img.width, img.height);
        canvas.toBlob(blob => {
          var a = document.createElement("a");
          //a.href : blob:http://127.0.0.1:5500/fdd7df7a-c953-4a0f-a4ec-8bb9d09056d8
          a.href = window.URL.createObjectURL(blob);
          a.download = filename;
          a.click();
        }, `image/${filetype}`);
      };
      img.setAttribute("crossOrigin", "Anonymous");
      img.src = picItem.accessUrl||picItem.picUrl||'';
					})
			})
		},
		publishNotReport() {
			publishNotReport({
				batchId: this.id,
				type: 3
			}).then(res => {
				this.$message.success('提醒未上报用户成功！')
			})
		},
		managerBatchClassRecordList() {
			managerBatchClassRecordList({
				batchId: this.id,
				searchName: this.searchName
			}).then(res => {
				this.dataList = res.data.data
				this.isHasPic = this.dataList.some(v => v.picList.length)
				this.exportUrl = global.BasePath + `structure/cyanBlue/downloadClassRecordList?batchId=${this.id}&searchName=${this.searchName}&token=${this.$store.getters.token}`
			})
		},
		masterBatchClassRecordList() {
			masterBatchClassRecordList({
				batchId: this.id
			}).then(res => {
				this.dataList = res.data.data
				this.isHasPic = this.dataList.some(v => v.picList.length)
				// this.exportUrl = global.BasePath + `structure/cyanBlue/downloadClassRecordList?batchId=${this.id}&searchName=${this.searchName}&token=${this.$store.getters.token}`
			})
		},
		prenticeBatchClassRecordList() {
			prenticeBatchClassRecordList({
				batchId: this.id
			}).then(res => {
				this.dataList = res.data.data
				this.isHasPic = this.dataList.some(v => v.picList.length)
				// this.exportUrl = global.BasePath + `structure/cyanBlue/downloadClassRecordList?batchId=${this.id}&searchName=${this.searchName}&token=${this.$store.getters.token}`
			})
		},
		searchList() {
			this.pagination.pageNo = 1
			this.managerBatchClassRecordList()
		},
		sizeChangeHandler() {
			this.pagination.pageNo = 1
			this.managerBatchClassRecordList()
		}
	}
}
</script>
<style lang="scss" scoped>
.common_wrap {
	.header {
		padding-bottom: 10px;
		overflow: hidden;
	}
	.planfile:hover {
		color: blue;
		cursor: pointer;
	}
	.pagination-container {
		margin-top: 10px;
	}
}
</style>
