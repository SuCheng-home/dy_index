<template>
  <el-dialog title='日常调查' :visible.sync='dialogVisible' width='620px' class="subject_out_box" :show-close='false'
             :close-on-click-modal='false' :before-close='handleClose'>
    <div class="subject_wrap">
      <div class="subject_type_box">
        <el-radio-group v-model="subjectForm.type">
          <el-radio :label="5">问答</el-radio>
          <el-radio :label="1">单选</el-radio>
          <el-radio :label="2">多选</el-radio>
          <el-radio :label="11">上传图片</el-radio>
        </el-radio-group>
      </div>
      <div class="subject_box">
        <el-form :model="subjectForm" :rules="rules" ref="subjectForm" label-width="72px">
          <el-form-item label="题目" prop="title">
            <el-input v-model.trim="subjectForm.title" placeholder="请输入题目" :maxlength="100" show-word-limit></el-input>
          </el-form-item>
          <el-form-item label="选项列表" v-if="subjectForm.type===2 || subjectForm.type===1">
            <div class="option_line" :key="index" v-for="(item, index) in optionList">
              <el-input v-model.trim="item.text" :maxlength="100">
                <el-button slot="suffix" type="danger" size="mini" icon="el-icon-minus" circle @click="removeOption(index)"></el-button>
              </el-input>
            </div>
            <el-button type="primary" size="mini" @click="addOption" icon="el-icon-circle-plus-outline">增加选项</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <span slot='footer' class='dialog-footer'>
      <el-button @click='handleClose'>取 消</el-button>
      <el-button type='primary' @click='handleSave'>确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { deepClone } from '@/utils'
export default {
  name: 'subject-dialog',
  props: {
  },
  data() {
    return {
      dialogVisible: false,
      isEditDialog: false,
      initSubject: {
        type: 5,
        title: ''
      },
      optionList: [{text: ''}],
      subjectForm: {},
      rules: {
        title: [
          {required: true, message: "请输入题目", trigger: "blur"},
          {min: 1, max: 100, message: "长度在 1 到 100 个字符", trigger: "change"}
        ]
      }
    }
  },
  created() {
    this.subjectForm = deepClone(this.initSubject);
  },
  methods: {
    showDialog(row) {
      if (row) {
        this.isEditDialog = true;
        this.subjectForm = deepClone(row);
        if (this.subjectForm.type===2 || this.subjectForm.type===1) {
          this.optionList = this.subjectForm.optionList.map(i => {
            return {text: i}
          });
        }
      } else {
        this.isEditDialog = false;
      }
      this.dialogVisible = true
    },
    // 保存
    handleSave() {
      this.$refs.subjectForm.validate((isValid) => {
        if (isValid) {
          const optionText = this.optionList.map(i => i.text);
          if ((this.subjectForm.type===2 || this.subjectForm.type===1) && optionText.indexOf('')>-1) {
            this.$message.warning('请确保每个答案选项不为空');
            return;
          }
          const options = (this.subjectForm.type===2 || this.subjectForm.type===1) ? optionText : [];

          this.$emit('get-subject', {...this.subjectForm, ...{optionList: options}}, this.isEditDialog ? 2 : 1);
          this.handleClose();
        }
      });
    },
    handleClose() {
      this.dialogVisible = false;
      this.clearOptionData();
    },
    addOption() {
      this.optionList.push({text: ''});
    },
    removeOption(num) {
      if (this.optionList.length > 1) {
        this.optionList.splice(num, 1);
      } else {
        this.$message.warning('不能再删减了');
      }
    },
    clearOptionData() {
      this.subjectForm = deepClone(this.initSubject);
      this.optionList = [{text: ''}];
    }
  }
}
</script>

<style>
  .subject_out_box .el-dialog__header{
    border-bottom: 1px solid #f8f8f8;
  }
  .subject_out_box .el-dialog__body{
    padding: 15px 20px;
  }
</style>
<style lang='scss' scoped>
  @import "./../../../styles/style.scss";
  .subject_out_box{
    .subject_wrap{
      min-height: 150px;
      max-height: 400px;
      overflow-x: hidden;
      overflow-y: auto;
      /*padding-right: 10px;*/
      .subject_type_box{
        line-height: 30px;
        padding-left: 70px;
        margin-bottom: 20px;
      }
      .subject_box{
        .option_line{
          &+.option_line{
            margin-top: 10px;
          }
        }
      }
    }
  }
</style>
