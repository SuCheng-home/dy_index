<template>
  <div class="defualt-box">
      <img class="defualt-img" :src="require('@/assets/images/defualt_page/defualt_img_bg.png')"/>
      <div class="defualt-title">{{Mes}}</div>
  </div>
</template>
<script >
export default {
  props:{
      Mes: {default: ''},
  }
}
</script>
<style lang="scss" scoped>
.defualt-box{
    padding-top: 20px;
}
.defualt-img{
    margin: 0 auto;
    display: block;
}
.defualt-title{
    text-align: center;
    font-family: "\5B8B\4F53" !important;
    width: 80%;
    margin: 0 auto;
    font-size: 15px;
    line-height: 26px;
    color: #676A6C;
    word-wrap: break-word;
    word-break: break-all;
}

</style>
