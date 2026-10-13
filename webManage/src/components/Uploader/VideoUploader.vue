<template>
  <div class="img-box">
    <div class="uploadFile-ul" v-show="isShowResult && value.length !== 0">
      <div v-for="(item,index) in value" :key="index">
        <div class="uploadFile-li">
          <i class="del" title="删除" @click="deleteItem(index)"></i>
          <img src="../../assets/images/common/video-default-cover.png" alt="">
          <span>{{item.name || getFileName(item.url) }}</span>
        </div>
      </div>
    </div>
    <div v-show="multiple || value.length === 0">
      <div>
        <div v-show="isShowProgress && !isProgressOnBtn">
          {{`视频上传中${multiple ? '' : `：${progress}`}`}}
        </div>
        <label v-show="!isShowProgress || isProgressOnBtn" class="upload-btn">
          <span>{{isShowProgress && isProgressOnBtn ? `视频上传中${multiple ? '' : `：${progress}`}` : btnText}}</span>
          <input :disabled="isShowProgress" type="file" ref="imgUpload" :multiple="multiple" @change="upload" style="display:none;" size="small" :accept="accept">
        </label>
      </div>
    </div>
    <div class="clear"></div>
  </div>
</template>
<script>
  import TcVod from 'vod-js-sdk-v6';
  import {getSignature, deleteVod} from '@/api/common/common';

  export default {
    props: {
      value: {
        type: Array,
        default: function () {
          return []
        }
      },
      accept: {
        type: String,
        default: 'video/*'
      },
      multiple: {
        type: Boolean,
        default: false
      },
      extList: {
        type: Array,
        default: function() {
          return ['mp4']
        }
      },
      btnText: {
        type: String,
        default: '上传'
      },
      isShowResult: {
        type: Boolean,
        default: true
      },
      isProgressOnBtn: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        isShowProgress: false,
        progress: 0,
        tcVod: null
      }
    },
    mounted() {
      this.tcVod = new TcVod({
        getSignature: () => {
          return getSignature().then(function (response) {
            return response.data.data;
          })
        }
      });
    },
    methods: {
      getFileName(value) {
        const arr = value.split('/');
        return arr[arr.length - 1];
      },
      deleteItem(index) {
        deleteVod({
          fileId: this.value[index].serverFileId
        }).then(res => res.data).then(data => {
          if(data.result) {
            this.value.splice(index, 1);
            this.$emit('deleteVideo', {
              deleteIndex: index,
              value: this.value
            });
          }
        });
      },
      upload(e) {
        if(e.target.files && e.target.files.length !== 0) {
          let total = e.target.files.length;
          let currentNum = 0;
          let index = 0;
          let validFlag = true;
          const fileInfoList = [];
          while(index < e.target.files.length) {
            const file = e.target.files[index];
            const name = file.name;
            const ext = name.slice(name.lastIndexOf('.') + 1).toLowerCase();
            if(this.extList.includes(ext)) {
              fileInfoList.push({
                name,
                size: file.size,
                type: file.type,
                ext,
              });

            } else {
              validFlag = false;
              return false;
            }
            index ++ ;
          }
          if(!validFlag) {
            this.$message.error(`请上传后缀名为[${this.extList.join(',')}]的文件`);
            e.target.value = '';
            return false;
          }
          this.isShowProgress = true;

          index = 0;
          while(index < e.target.files.length) {
            const fileNo = index;
            const file = e.target.files[index];
            console.log(file);
            const uploader = this.tcVod.upload({
              mediaFile: file, // 媒体文件（视频或音频或图片），类型为 File
            });
            uploader.on('media_progress', (info) => {
              this.progress = `${info.percent * 100}%`;
            });
            uploader.done().then( (response) => {
              const fileObj = {
                fileId: response.fileId,
                serverFileId: response.fileId,
                videoId: response.fileId,
                id: response.fileId,
                url: response.video.url,
                fileUrl: response.video.url,
                videoUrl: response.video.url,
                size: fileInfoList[fileNo].size,
                name: fileInfoList[fileNo].name,
                type: fileInfoList[fileNo].type,
                extname: fileInfoList[fileNo].ext,
                filename: fileInfoList[fileNo].filename,
                index: fileInfoList[fileNo].index,
                fileInfo: {
                  fileId: response.fileId,
                  serverFileId: response.fileId,
                  id: response.fileId,
                  url: response.video.url,
                  ...fileInfoList[fileNo],
                }
              };

              this.value.push(fileObj);
              this.$emit('inputVideo', fileObj);

              currentNum ++;
              if(currentNum === total) {
                this.$emit('inputVideoAll');
                this.isShowProgress = false;
              }

            }).catch(function (err) {
              alert(err)
            });
            index ++;
          }

        }
      },
    }
  }
</script>
<style lang="scss">
  .img-box {
    /*padding: 1%;*/
  }

  .img-upload {
    width: 70px;
    height: 70px;
    display: block;
    float: left;
    margin: 0 1% 0 0;
    background-position: center center;
    background-size: cover;
    background-image: url(../../assets/images/common/upload_img.png);
  }

  .uploadFile-li {
    width: 80px;
    height: 105px;
    margin: 0 1% 0 0;
    display: block;
    float: left;
    background-position: center center;
    background-size: cover;
    position: relative;
    span {
      display: block;
      height: 25px;
      line-height: 25px;
      white-space: nowrap;
    }
  }

  .uploadFile-li img {
    display: block;
    width: 80px;
    height: 80px;
    overflow: hidden;
  }

  .clear {
    clear: both;
  }

  .uploadFile-ul {

  }

  .del {
    position: absolute;
    top: 0;
    right: 0;
    width: 24px;
    height: 24px;
    display: block;
    background-size: cover;
    background-position: center center;
    background-image: url(../../assets/images/common/wxcep_phone_close.png);
    cursor: pointer;
  }
  .upload-btn {
    padding: 10px 20px;
    font-size: 14px;
    border-radius: 4px;
    color: #fff;
    background-color: #1fc7cb;
    border-color: #1fc7cb;
    display: inline-block;
    line-height: 1;
    white-space: nowrap;
    cursor: pointer;
    -webkit-appearance: none;
    text-align: center;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    outline: 0;
    margin: 0;
    -webkit-transition: .1s;
    transition: .1s;
    font-weight: 500;
  }
</style>
