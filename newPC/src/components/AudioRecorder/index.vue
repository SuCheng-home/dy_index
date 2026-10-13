<template>
  <div>
    <div class="weui_uploader" v-if="!onlyPlayAudio">
      <div class="weui_uploader_bd">
        <div id="content_video"></div>
        <ul class="weui_uploader_files" v-show="status === 2 || status === 0">
          <li id="voice-play" @click="playVoice()"
              :class="['weui_uploader_file', 'circle-voice', !isPlaying ? 'gray': ''] "></li>
        </ul>
      </div>
      <div style="display: none;">
        <audio id="audio" controls></audio>
      </div>
    </div>
    <div class="audio_play_box" v-else>
      <audio :src="audios[0]" controls></audio>
    </div>
  </div>
</template>

<script>
  export default {
    data: function () {
      return {
        status: 0, // 0 没开始录音  1 已开始录音 2 已有录音
        isPlaying: false,
        playIndex: 0,
        voiceArray: []
      }
    },
    methods: {
      playVoice() {
        const vm = this;
        this.isPlaying = !this.isPlaying;
        const playArray = this.voiceArray.length !== 0 ? this.voiceArray : this.audios;
        if (this.isPlaying) {
          this.playIndex = 0;
          if (this.voiceArray.length !== 0) {
            vm.$wechat.playVoice({
              localId: this.voiceArray[0]
            });

            vm.$wechat.onVoicePlayEnd({
              complete: function () {
                this.playIndex += 1;
                if (this.playIndex < this.voiceArray.length) {
                  vm.$wechat.playVoice({
                    localId: this.voiceArray[this.playIndex]
                  });
                } else {
                  this.playIndex = 0;
                  vm.isPlaying = false;
                }
              }
            });
          } else {
            const audio = document.getElementById('audio');
            audio.src = this.audios[0];
            this.playIndex = 1;
            audio.load();
            audio.play();
            audio.addEventListener('ended', () => {
              if (this.playIndex < this.audios.length) {
                audio.src = this.audios[this.playIndex++];
                audio.load();
                audio.play();
              } else {
                vm.isPlaying = false;
              }
            }, false);
          }
        } else {
          if (this.voiceArray.length !== 0) {
            vm.$wechat.stopVoice({
              localId: this.voiceArray[this.playIndex]
            });
          } else {
            const audio = document.getElementById('audio');
            audio.src = '';
          }
        }

      }
    },
    props: {
      audios: {
        type: Array,
        required: true
      },
      onlyPlayAudio: {
        type: Boolean,
        default: false
      }
    }
  }
</script>

<style scoped>
  .audio_play_box {
    margin-bottom: 10px;
    overflow: hidden;
  }

  .audio_play_box audio {
    display: block;
    width: 90%;
    height: 36px;
    margin: 0 auto;
  }

  .gray {
    -webkit-filter: grayscale(100%);
    -moz-filter: grayscale(100%);
    -ms-filter: grayscale(100%);
    -o-filter: grayscale(100%);
    filter: grayscale(100%);
    filter: gray;
  }

  .weui_uploader_file.circle-voice {
    background-image: url(../../assets/images/voice_icon.png);
  }

  .weui_uploader_file {
    float: left;
    margin-right: 9px;
    margin-bottom: 9px;
    width: 79px;
    height: 79px;
    background: no-repeat center center / cover;
  }

  ul {
    padding: 0;
    margin: 0;
    list-style-type: none;
  }
</style>
