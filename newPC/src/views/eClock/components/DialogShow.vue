<template>
  <div class="dialog_out_wrap" v-show="show">
    <div class="inner_draw_box">
      <comment-show :pic-list="picList"></comment-show>
      <div class="close_btn_box">
        <i class="el-icon-close" @click="closeBox"></i>
      </div>
    </div>
  </div>
</template>

<script>
  import CommentShow from "@/components/Comment/Show"

  export default {
    name: "dialog-show",
    components: {CommentShow},
    props: {
      show: {
        type: Boolean,
        default: false
      },
      picList: {
        type: Array,
        default: []
      }
    },
    data() {
      return {
      }
    },
    methods: {
      closeBox() {
        this.$emit('close')
      }
    }
  }
</script>

<style lang="scss" scoped>
  .dialog_out_wrap{
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background-color: rgba(0,0,0,.3);
    z-index: 99;

    .inner_draw_box{
      position: relative;
      width: 500px;
      height: 100%;
      margin: 0 auto;
      .close_btn_box{
        position: absolute;
        width: 34px;
        height: 34px;
        top: 10px;
        right: 15px;
        text-align: center;
        line-height: 40px;
        background-color: #fff;
        border-radius: 50%;
        box-shadow: 0 0 4px #efefef;
        cursor: pointer;
      }
    }

  }
</style>
