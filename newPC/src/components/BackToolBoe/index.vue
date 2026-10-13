<template>
  <div class="menu-tools">
    <el-button @click="goback">返回</el-button>
    <slot></slot>
  </div>
</template>
<script>
    export default {
        methods: {
            goback() {
                this.$router.back();
            }
        }
    }
</script>
<style scoped>
  .menu-tools {
    border-bottom: 1px solid #e7eaec;
    padding-bottom: 10px;
  }
</style>