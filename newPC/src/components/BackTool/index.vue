<template>
  <div class="menu-tools" :style="`${showLine ? 'border-bottom: 1px solid #e7eaec;' : ''}`">
    <el-button @click="goBack" type="default" size="medium">返回</el-button>
    <slot></slot>
  </div>
</template>

<script>
  export default {
    props: {
      showLine: {
        type: Boolean,
        default: true
      }
    },
    methods: {
      goBack() {
        this.$router.back();
      }
    }
  }
</script>

<style scoped>
  .menu-tools {
    padding-bottom: 10px;
  }
</style>
