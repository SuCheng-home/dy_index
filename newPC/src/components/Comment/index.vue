<template>
  <div class="board-container" v-show="showBox">
    <div class="board-container__inner">
<!--      :style="`background: url('${bgUrl}') center /contain no-repeat;`"-->
      <img :src="bgUrl" alt="" style="width: 100%">
          <vue-esign ref="esign" :width="width" :height="height" :isCrop="isCrop" :lineWidth="lineWidth" style="position: absolute;top: 0;left: 0;"
                     :lineColor="lineColor" :bgColor.sync="bgColor"/>
      <div class="confirm_btn_box" v-if="isShowSaveBtn">
        <i class="el-icon-check" @click="handleSave"></i>
      </div>
      <div class="confirm_btn_box close_btn" v-if="isShowSaveBtn">
        <i class="el-icon-close" @click="handleClose"></i>
      </div>
      <div class="confirm_btn_box replay_btn" v-if="isShowSaveBtn">
        <i class="el-icon-refresh-right" @click="handleReset"></i>
      </div>
      <div class="color_box" v-if="isShowSaveBtn">
        <div class="color_block" :style="`background-color: ${item};border:1px solid ${item===lineColor ? '#fff' : item};`" @click="changeColor(item)" :key="index" v-for="(item, index) in colorList"></div>
      </div>
    </div>
  </div>
</template>

<script>
  import vueEsign from 'vue-esign';
  import CosUploader from '@/utils/CosUploader';

  export default {
    components: {vueEsign},
    data() {
      return {
        showBox: false,
        bgUrl: '',
        lineWidth: 3,
        lineColor: '#f00',
        colorList: ['#fff', '#000', '#f00', '#0f0', '#00f', '#ff0'],
        bgColor: '',
        resultImg: '',
        isCrop: false,
        cos: null,
        isComplete: false,
        imgUrl: ''
      }
    },
    props: {
      value: {
        type: String,
        default: ''
      },
      width: {
        type: Number,
        default: 500
      },
      height: {
        type: Number,
        default: 1000
      },
      isShowSaveBtn: {
        type: Boolean,
        default: true
      },
      isShowResetBtn: {
        type: Boolean,
        default: false
      }
    },
    mounted() {
      this.cos = new CosUploader('sign', true, false);
    },
    methods: {
      changeColor(color) {
        if (color) {
          this.lineColor = color || '#000';
        }
      },
      showCommentBox(url) {
        if (url) {
          this.$refs.esign.reset();
          this.bgUrl = url;
          this.lineColor = '#f00';
          this.showBox = true;
        }
      },
      handleSave() {
        this.$confirm('是否保存当前批注', '提示', { type: 'warning' }).then(() => {
          this.showBox = false;
          this.$refs.esign.generate().then(base64 => {
            this.resultImg = base64;
            this.cos.uploadBase64(base64, 'imageMogr2/thumbnail/640x/').then(data => {
              this.$emit('success', `https://${data.Location}`, this.bgUrl);
            })
          }).catch(err => {})
        }).catch(() => {
          this.showBox = false;
        })
      },
      // 关闭
      handleClose() {
        this.$confirm('确认关闭吗', '提示', { type: 'warning' }).then(() => {
          this.$refs.esign.reset();
          this.showBox = false;
        });
      },
      // 重置
      handleReset() {
        this.$confirm('确认重置吗', '提示', { type: 'warning' }).then(() => {
          this.$refs.esign.reset();
        });
      }
    }
  }
</script>

<style lang="scss" scoped>
  .board-container{
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background-color: rgba(0,0,0,.3);
    z-index: 99;
    .board-container__inner {
      position: relative;
      width: 500px;
      height: 100%;
      margin: 0 auto;

      .confirm_btn_box{
        position: absolute;
        width: 30px;
        height: 30px;
        line-height: 32px;
        top: 10px;
        right: -35px;
        text-align: center;
        font-size: 22px;
        background-color: #fff;
        border-radius: 50%;
        box-shadow: 0 0 4px #efefef;
        cursor: pointer;
      }
      .close_btn{
        top: 55px;
      }
      .replay_btn{
        top: 100px;
      }

      .color_box{
        position: absolute;
        width: 20px;
        top: 145px;
        right: -30px;
        text-align: center;
        line-height: 40px;

        .color_block{
          width: 18px;
          height: 18px;
          cursor: pointer;

          &+.color_block{
            margin-top: 6px;
          }
        }
      }
    }
  }
</style>
