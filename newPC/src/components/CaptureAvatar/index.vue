<template>
	<div>
		<capture-dialog :avatar-size="1" ref="captureDialog" v-bind="$attrs" :save-handler="handleSave" @close="$emit('close')"></capture-dialog>
		<face-uploader v-show="false" pathPrefix="faceManage" ref="faceUploader" @input="inputFace" :showMode="'image'" :showResult="'image'" :extList="['png', 'jpg']" v-model="facePic"></face-uploader>
	</div>
</template>

<script>
import CaptureDialog from './CaptureDialog'
import FaceUploader from '@/components/Uploader/WebUploader3'
export default {
	name: 'capture-avatar',
	components: {
		CaptureDialog,
		FaceUploader
	},
	data() {
		return {
			facePic: []
		}
	},
	created() {},
	methods: {
		showDialog() {
			this.$refs.captureDialog.showDialog()
		},
		async handleSave(data) {
			return this.$refs.faceUploader
				.upload(data.captureFile)
				.then()
				.catch(err => {
					this.$message({
						message: '拍摄失败!',
						type: 'success'
					})
					throw new Error('拍摄失败')
				})
		},
		// 上传成功
		inputFace(val) {
			this.$emit('inputface', val)
			this.facePic = []
		}
	}
}
</script>

<style lang="scss" scoped></style>
