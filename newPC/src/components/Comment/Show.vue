<template>
  <div class="comment_show_wrap">
    <div class="comment_show_box" :key="index" v-for="(item, index) in picList">
      <img :src="item.picUrl" class="comment_bg_pic">
      <img :src="item.markUrl" class="comment_bg_pic comment_mask_pic">
      <div class="close_btn_box" v-if="showClose">
        <i class="el-icon-close" @click="closePic(index)"></i>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
      }
    },
    props: {
      picList: {
        type: Array,
        default: []
      },
      showClose: {
        type: Boolean,
        default: false
      },
      closeDialog: {
        type: Boolean,
        default: false
      }
    },
    mounted() {
    },
    methods: {
      closePic(index) {
        if (this.closeDialog) {
          this.$confirm('确认删除当前图片', '提示', { type: 'warning' }).then(() => {
            this.$emit('delPic', index);
          }).catch(() => {})
        } else {
          this.$emit('delPic', index);
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  .comment_show_wrap{
    background-color: #fff;
    padding: 10px 15px;
    .comment_show_box {
      position: relative;
      width: 100%;
      border: 1px solid #efefef;
      overflow: hidden;
      border-radius: 5px;

      &+.comment_show_box{
        margin-top: 10px;
      }

      .comment_bg_pic{
        display: block;
        width: 100%;
      }

      .comment_mask_pic{
        position: absolute;
        top: 0;
        left: 0;
      }


      .close_btn_box{
        position: absolute;
        width: 25px;
        height: 25px;
        top: 5px;
        right: 5px;
        text-align: center;
        line-height: 25px;
        font-size: 16px;
        background-color: #fff;
        border-radius: 50%;
        box-shadow: 0 0 2px #efefef;
        cursor: pointer;
      }
    }
  }
</style>
