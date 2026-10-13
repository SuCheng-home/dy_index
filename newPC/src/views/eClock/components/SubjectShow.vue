<template>
  <div class="subject_show_wrap">
    <div class="subject_show_box" :key="index" v-for="(item, index) in list">
      <div class="tip_title_box">
        <div class="tip_title">{{index+1}}.{{item.title}}</div>
        <div class="tip_tool" v-if="showTool">
          <i class="el-icon-edit" @click="editTip(index)"></i>
          &nbsp;
          <i class="el-icon-close" @click="deleteTip(index)"></i>
        </div>
      </div>
      <div class="tip_content">
        <div class="tip_input" v-if="item.type === 5">
          <el-input placeholder="请填写内容" disabled></el-input>
        </div>
        <div class="tip_radio" v-else-if="item.type === 1">
          <el-radio-group>
            <div class="radio_line_box" :key="radioIndex" v-for="(radioItem, radioIndex) in item.optionList">
              <el-radio :label="radioItem"></el-radio>
            </div>
          </el-radio-group>
        </div>
        <div class="tip_check" v-else-if="item.type === 2">
          <div :key="checkItem" v-for="checkItem in item.optionList">
            <el-checkbox disabled></el-checkbox>&nbsp;&nbsp;{{checkItem}}
          </div>
        </div>
        <div class="tip_upload" v-else-if="item.type === 11">
          <div class="upload_box">
            <i class="el-icon-plus"></i>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { deepClone } from '@/utils'
export default {
  name: 'subject-show',
  props: {
    list: {
      type: Array,
      default: []
    },
    showTool: {
      type: Boolean,
      default: false
    },
  },
  data() {
    return {
      dialogVisible: false,
    }
  },
  created() {
    this.subjectForm = deepClone(this.initSubject);
  },
  methods: {
    // 保存
    handleSave(val) {
      this.$emit('get-subject', val);
    },
    editTip(val) {
      this.$emit('edit-tip', val);
    },
    deleteTip(val) {
      this.$emit('delete-tip', val);
    }
  }
}
</script>

<style lang='scss' scoped>
  @import "./../../../styles/style.scss";
  .subject_show_wrap{
    background-color: #f8f8f8;
    border-radius: 5px;
    overflow: hidden;
    .subject_show_box{
      margin: 10px;
      .tip_title_box{
        display: flex;
        .tip_title{
          width: 570px;
        }
        .tip_tool{
          flex: 1;
          text-align: center;
          i{
            font-size: 15px;
            color: #409eff;
            cursor: pointer;
          }
          .el-icon-close{
            color: #F56C6C;
          }
        }
      }
      .tip_content{
        padding: 0 15px;
        .tip_input{

        }
        .tip_radio{
          .radio_line_box{
            line-height: 25px;
          }
        }
        .tip_check{
          line-height: 25px;
        }
        .tip_upload{
          .upload_box{
            position: relative;
            overflow: hidden;
            i{
              width: 80px;
              height: 80px;
              line-height: 80px;
              text-align: center;
              font-size: 38px;
              border: 1px dashed #d9d9d9;
              color: #8c939d;
              border-radius: 6px;
            }
          }
        }
      }
    }
  }
</style>
