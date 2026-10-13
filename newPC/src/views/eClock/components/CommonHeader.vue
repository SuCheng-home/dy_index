<template>
  <div :class="`common_menu_tools ${showBorder ? 'bottom_border' : ''}`">
    <el-row>
      <el-col :span="`${showSearch ? 19 : 24}`">
        <el-button @click="goBack" type="default" size="medium" v-if="showBack">返回</el-button>
        <slot></slot>
        &nbsp;
      </el-col>
      <el-col :span="5" v-if="showSearch">
        <el-input :placeholder="placeholder" v-model.trim="searchName" size="medium" @keyup.enter.native="headerSearch">
          <el-button slot="append" icon="el-icon-search" @click="headerSearch"></el-button>
        </el-input>
      </el-col>
    </el-row>
  </div>
</template>
<script>
  export default {
    name: 'common-header',
    props: {
      placeholder: {
        type: String,
        default: '请输入'
      },
      showBorder: {
        type: Boolean,
        default: false
      },
      showBack: {
        type: Boolean,
        default: false
      },
      showSearch: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        searchName: ''
      }
    },
    methods: {
      goBack() {
        this.$router.back();
      },
      headerSearch() {
        this.$emit('search', this.searchName);
      }
    }
  }
</script>
<style scoped>
  .common_menu_tools {
    padding-bottom: 10px;
  }
  .bottom_border{
    margin-bottom: 10px;
    border-bottom: 1px solid #e7eaec;
  }
</style>
