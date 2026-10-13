<template>
	<div class="page">
		<back-tool>
			<el-button v-if="canSave" class="filter-item" size="medium" type="primary" @click="finishHandler()">提交评价</el-button>
			<el-button v-else class="filter-item" size="medium" type="primary" @click="resetModufyHandler()">重新批改</el-button>
		</back-tool>
		<div class="article" :style="'height:' + nobottommaxH + 'px;overflow: auto;'">
			<div class="title">{{ studentName }}的作业</div>
			<div class="meta-info">
				<span>完成时间：{{ submitTime | formatTime }}（用时：{{ finishDur || 0 }}分钟）</span>
			</div>
			<!-- <image-previewer tag="richtext">
        <div class="content-container" v-html="textContent">
        </div>
      </image-previewer>
      <div class="pic-container" v-if="stuTaskPics !== null && stuTaskPics.length !== 0">
        <h2>图片：</h2>
        <image-previewer tag="richtext" viewclass="image_view" :images="images">
          <ul>
            <li class="pic image_view" v-for="(picItem, index) in stuTaskPics"
                :style="`background-image: url(${picItem.picUrl})`"
                :key="index">
            </li>
          </ul>
        </image-previewer>
      </div>
      <div style="overflow: auto;">
        <audio-recorder v-if="stuTaskAudios.length !== 0" :audios="stuTaskAudios"
                        :onlyPlayAudio="true"></audio-recorder>
      </div>
      <div class="row" v-if="taskVideoList && taskVideoList.length">
        <div class="col-lg-12">
          <h2>视频：</h2>
          <div class="social-feed-box">
            <file-list :fileList="taskVideoList"></file-list>
          </div>
        </div>
      </div>
      <div class="row" v-if="filesJson && filesJson.length !== 0">
        <div class="col-lg-12">
          <h2>附件：</h2>
          <div class="social-feed-box">
            <file-list :fileList="filesJson"></file-list>
          </div>
        </div>
      </div>
      <div class="row" v-if="audiosList && audiosList.length !== 0">
        <div class="col-lg-12">
          <h2>语音：</h2>
          <div class="social-feed-box">
            <audio :src="item" v-for="(item, index) in audiosList" controls></audio>
          </div>
        </div>
      </div> -->
			<div v-if="canSave">
				<h2>作业评价：</h2>
				<p>
					评价:
					<el-rate v-model="query.starNum"></el-rate>
				</p>
				<p>
					老师评语:
					<el-input type="textarea" v-model="query.evaluateRemark" placeholder="请输入老师评语"></el-input>
				</p>
				<uploader style="height: 90px;margin-bottom: 25px;" :extList="['bmp', 'png', 'jpg', 'jpeg']" buttonMode="image" v-model="query.evaluatePicJson" pathPrefix="zuoye" module="zuoye" moduleCode="202" :multiple="true"></uploader>
				<div><el-checkbox v-model="isRevised">需要订正</el-checkbox></div>
			</div>
			<div v-else>
				<h2>作业评价：</h2>
				<p>
					评价:
					<el-rate v-model="evaluateType" disabled></el-rate>
				</p>
				<p>老师评语:{{ evaluateRemark }}</p>
				<audio class="audio" :src="item" controls="controls" v-for="(item, index) in evaluateAudioList" :key="index"></audio>
				<p v-if="query.evaluatePicJson.length">老师批改图片:</p>
				<image-previewer tag="richtext">
					<div class="evaluatePic_wrap" v-if="query.evaluatePicJson.length">
						<div class="evaluatePic_item" v-for="(item, index) in query.evaluatePicJson">
							<img :src="item.fileUrl" alt="" />
						</div>
					</div>
				</image-previewer>
			</div>
			<h2 v-if="stuTaskRecordList.length">作业记录：</h2>
			<div class="all_record_box">
				<div class="task_record_box" v-for="(recordItem, index) in stuTaskRecordList" :key="index">
					<div style="color: #333;">作业完成时间：{{ recordItem.finishDur }}分钟</div>
					<div v-html="recordItem.textContent"></div>
					<div class="pic-container" v-if="recordItem.picsJson && JSON.parse(recordItem.picsJson).length">
						<image-previewer tag="richtext">
							<div class="pic" v-for="(picEntry, index) in JSON.parse(recordItem.picsJson)" :key="index">
								<img :src="picEntry.picUrl" alt="" style="width:100%;height:100%" />
							</div>
						</image-previewer>
					</div>
					<div class="work_video_box" v-if="recordItem.videosJson && recordItem.videosJson.length">
						<div class="video_box" v-for="(item, index) in JSON.parse(recordItem.videosJson)" :key="index">
							<video :src="item.videoUrl || item.fileUrl" controls></video>
						</div>
					</div>
					<div v-if="recordItem.audiosJson && recordItem.audiosJson.length">
						<audio class="audio" :src="item" controls="controls" v-for="(item, index) in JSON.parse(recordItem.audiosJson)" :key="index"></audio>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import AudioRecorder from '@/components/AudioRecorder'
import windowResizeMixin from '@/mixins/windowResize'
import BackTool from '@/components/BackTool'
import FileList from '@/components/FileList/FileList.vue'
import ImagePreviewer from '@/components/ImagePreviewer/ImagePreviewer.vue'
import Uploader from '@/components/Uploader/WebUploader2'
import { formatTime } from '@/filters'
import { getStuWorkInfo, updateStuHomeWorkEvaluate } from '@/api/homework'
export default {
	data: function() {
		return {
			stuTaskRecordList: [],
			homeworkId: this.$route.query.homeworkId,
			studentId: this.$route.query.studentId,
			stuTaskAudios: [],
			stuTaskPics: [],
			filesJson: [],
			taskVideoList: [],
			audiosList: [],
			images: [],
			finishDur: 0,
			textContent: '',
			studentName: this.$route.query.studentName,
			submitTime: this.$route.query.submitTime,
			canSave: true,
			starNum: 0,
			evaluateType: 0,
			isRevised: false,
			evaluateState: 0,
			query: {
				evaluateRemark: '',
				starNum: 1,
				id: 0,
				isRevised: 0,
				evaluateAudioJson: '',
				stuId: this.$route.query.studentId,
				stuWorkId: '',
				workId: this.$route.query.homeworkId,
				evaluatePicJson: []
			},
			evaluateRemark: '',
			evaluateAudioList: []
		}
	},
	created() {
		this.getStuWorkInfos()
	},
	mixins: [windowResizeMixin],
	components: {
		BackTool,
		ImagePreviewer,
		AudioRecorder,
		FileList,
		Uploader
	},
	filters: { formatTime },
	methods: {
		resetModufyHandler() {
			let self = this
			this.$confirm('确定重新批改吗？', '提示', { type: 'warning' })
				.then(() => {
					self.canSave = true
					// self.starNum = 0;
					// self.query.starNum = 1;
					// self.query.evaluateRemark = '';
				})
				.catch(() => {})
		},
		getStuWorkInfos() {
			getStuWorkInfo(
				{
					studentId: this.studentId,
					homeworkId: this.homeworkId
				},
				sessionStorage.getItem('homeworkschoolTimeId')
			)
				.then(res => res.data)
				.then(data => {
					if (data.result) {
						const pageData = data.data
						this.evaluateState = pageData.evaluateState
						if (pageData.evaluateState > 1) {
							this.canSave = false
						}
						this.query.stuWorkId = pageData.id
						this.query.evaluateRemark = pageData.evaluateRemark
						this.query.starNum = pageData.evaluateType

						this.evaluateRemark = pageData.evaluateRemark
						this.evaluateType = pageData.evaluateType
						if (pageData.stuTaskRecordList.length) {
							this.stuTaskRecordList = pageData.stuTaskRecordList
							this.query.id = pageData.stuTaskRecordList[pageData.stuTaskRecordList.length - 1].id
							this.isRevised = pageData.stuTaskRecordList[pageData.stuTaskRecordList.length - 1].isRevised === 1
						}
						this.finishDur = pageData.finishDur
						;({ stuTaskPics: this.stuTaskPics, textContent: this.textContent } = pageData)
						this.images = this.stuTaskPics.map(picItem => ({ src: picItem.picUrl }))
						this.stuTaskAudios = pageData.stuTaskAudios.map(audioItem => audioItem.audioUrl)
						if (pageData.evaluateAudioJson) {
							this.evaluateAudioList = JSON.parse(pageData.evaluateAudioJson)
						}
						if (pageData.filesJson) {
							pageData.filesJson = JSON.parse(pageData.filesJson)
							this.filesJson = pageData.filesJson
						}
						if (pageData.taskVideoJson) {
							this.taskVideoList = JSON.parse(pageData.taskVideoJson)
							this.taskVideoList.forEach(v => {
								if (v.videoUrl) {
									v = Object.assign({}, v, { fileUrl: v.videoUrl })
								}
							})
						}
						if (pageData.audiosJson) {
							this.audiosList = JSON.parse(pageData.audiosJson)
						}
						if (pageData.evaluatePicJson) {
							this.query.evaluatePicJson = JSON.parse(pageData.evaluatePicJson)
							this.query.evaluatePicJson.forEach(v => {
								if (v.picUrl || v.maxPic) {
									this.$set(v, 'fileUrl', v.picUrl || v.maxPic)
								}
							})
						}
					}
				})
		},

		finishHandler() {
			this.query.isRevised = this.isRevised ? 1 : 0

			updateStuHomeWorkEvaluate(this.query, sessionStorage.getItem('homeworkschoolTimeId'))
				.then(res => {
					this.$message({
						type: 'success',
						message: '提交成功！'
					})
					this.starNum = this.query.starNum
					this.getStuWorkInfos()
				})
				.catch(() => {})
		}
	}
}
</script>

<style lang="scss" scoped>
@import '../../styles/mixin.scss';

.audio {
	width: 480px;
	height: 30px;
	line-height: 30px;
}
.all_record_box {
	.task_record_box {
		margin-bottom: 10px;
		padding: 10px;
		background-color: #f8f8f8;
		border-radius: 8px;

		.pic-container {
			.pic {
				float: left;
				width: 200px;
				height: 200px;
				margin: 30px;
				background-size: 100% 100%;
			}
			&:after {
				content: '';
				display: table;
				clear: both;
			}
		}
		.work_video_box {
			.video_box {
				width: 480px;
				height: 270px;
				margin: 5px auto;
				overflow: hidden;
				video {
					width: 100%;
					height: 100%;
				}
			}
		}
	}
}

@include globalstyle();
.page {
	padding: 12px;
}

.title {
	line-height: 1.2em;
	font-size: 38px;
	color: rgb(47, 64, 80);
	margin: 20px 0;
	text-align: center;
}

.meta-info {
	font-size: 13px;
	text-align: right;

	span {
		margin-right: 60px;
	}
}

.article {
	width: 810px;
	margin: 0 auto;
	font-family: '宋体', serif;
	font-size: 15px;
	line-height: 26px;
	color: #676a6c;
	word-wrap: break-word;
	word-break: break-all;

	h2 {
		font-size: 16px;
		color: rgb(47, 64, 80);
		text-align: left !important;
	}

	.content-container {
		max-height: 400px;
		overflow: auto;
		@include richtext();
	}

	.pic-container {
		ul {
			@include clearfix();

			li {
				@include backgroundCover(100px, 100px);
				float: left;
				margin: 0 10px 10px 0;
			}
		}
	}
	.evaluatePic_wrap {
		display: flex;
		.evaluatePic_item {
			width: 200px;
			height: 200px;
			margin-right: 15px;
			img {
				width: 100%;
				height: 100%;
			}
		}
	}
}
</style>
