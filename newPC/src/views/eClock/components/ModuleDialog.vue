<template>
  <el-dialog title='选择模板' :visible.sync='dialogVisible' width='620px' class="module_out_box" :show-close='false'
             :close-on-click-modal='false' :before-close='handleClose'>
    <div class="module_name_box clearfix">
      <div :class="`module_name ${curJson.id ? '' : 'cur_name'}`" @click="changeModuleName({id: 0})">自定义</div>
      <div :class="`module_name ${curJson.id===item.id ? 'cur_name' : ''}`" :key="index" v-for="(item, index) in moduleList" @click="changeModuleName(item)" :title="item.title">{{item.title}}</div>
    </div>
    <span slot='footer' class='dialog-footer'>
      <el-button @click='handleClose'>取 消</el-button>
      <el-button type='primary' @click='handleSave'>确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { deepClone } from '@/utils'
import {getEcardTempList} from '@/api/eClock'

export default {
  name: 'module-dialog',
  props: {
    changeWord: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      dialogVisible: false,
      initModule: {
        id: 0,
        name: '自定义'
      },
      curJson: {},
      curModule: 0,
      moduleList: []
    }
  },
  created() {
    this.getEcardTempList();
    this.curJson = deepClone(this.initModule);
    this.$emit('get-module', this.curJson);
  },
  methods: {
    // 获取数据列表
    getEcardTempList() {
      getEcardTempList({title: ''}).then(res => res.data).then(data => {
        if (data.code === 200 && data.data) {
          this.moduleList = data.data;
        } else {
          this.$message({type: 'error', message: data.msg})
        }
      }).catch(() => {})
    },
    showDialog(row) {
      if (row) {
        this.curJson = deepClone(row)
      }
      this.dialogVisible = true
    },
    // 保存
    handleSave() {
      if (this.changeWord) {
        this.$confirm('切换模板将遗失当前内容，是否继续?', '切换模板', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$emit('get-module', this.curJson);
          this.handleClose();
        }).catch(() => {});
      } else {
        this.$emit('get-module', this.curJson);
        this.handleClose();
      }
    },
    handleClose() {
      this.dialogVisible = false;
    },
    changeModuleName(val) {
      this.curJson = val;
    }
  }
}
</script>

<style>
  .module_out_box .el-dialog__header{
    border-bottom: 1px solid #f8f8f8;
  }
  .module_out_box .el-dialog__body{
    padding: 15px 20px;
  }
</style>
<style lang='scss' scoped>
  @import "./../../../styles/style.scss";
  .module_out_box{
    .module_name_box{
      min-height: 150px;
      max-height: 400px;
      overflow-x: hidden;
      overflow-y: auto;
      .module_name{
        height: 36px;
        line-height: 36px;
        width: 120px;
        float: left;
        margin-right: 20px;
        margin-bottom: 20px;
        text-align: center;
        color: #8a8a8a;
        background-color: #fff;
        border: 1px solid #bfbfbf;
        overflow: hidden;
        cursor: pointer;
        border-radius: 5px;
      }
      .cur_name{
        color: #fff;
        background-color: #48A6FC;
        border: 1px solid #48A6FC;
      }
    }
  }
</style>
