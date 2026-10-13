<template>
  <div class="clock_module_add_wrap">
    <common-header show-back show-border>
      <el-button type="primary" size="medium" @click="saveModule">保存</el-button>
    </common-header>
    <div class="main_wrap custom—scrollbar" :style="{'height':nobottommaxH+'px'}">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="140px" class="demo-ruleForm">
        <el-form-item label="模板名称" prop="title">
          <el-input v-model.trim="ruleForm.title" placeholder="请输入名称" :maxlength="20" show-word-limit></el-input>
        </el-form-item>
        <el-form-item label="排序" prop="orderNum">
          <el-input-number v-model="ruleForm.orderNum" :step="1" :min="0" step-strictly></el-input-number>
        </el-form-item>
        <el-form-item label="介绍" prop="content">
          <el-input v-model.trim="ruleForm.content" type="textarea" :autosize="{ minRows: 3, maxRows: 5}"
                    placeholder="请填写内容介绍" :maxlength="200" show-word-limit></el-input>
        </el-form-item>
        <el-form-item label="每日提醒" prop="isRemind">
          <el-radio-group v-model="ruleForm.isRemind">
            <el-radio :label="1">不提醒</el-radio>
            <el-radio :label="2">提醒</el-radio>
          </el-radio-group>
          &nbsp;&nbsp;&nbsp;&nbsp;
          <el-select v-model="ruleForm.remindTime" size="small" placeholder="请选择提醒时间" v-if="ruleForm.isRemind===2">
            <el-option :label="item" :value="item" :key="index" v-for="(item, index) in timeList"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="允许补卡" prop="isMakeCard">
          <el-radio-group v-model="ruleForm.isMakeCard">
            <el-radio :label="2">是</el-radio>
            <el-radio :label="1">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="最终成果上传" prop="isAchievementis">
          <el-radio-group v-model="ruleForm.isAchievementis">
            <el-radio :label="2">是</el-radio>
            <el-radio :label="1">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <template v-if="ruleForm.isAchievementis === 2">
          <el-form-item label="成果内容" prop="finalList">
            <el-checkbox-group v-model="ruleForm.finalList">
              <el-checkbox label="文本"></el-checkbox>
              <el-checkbox label="图片"></el-checkbox>
              <el-checkbox label="视频"></el-checkbox>
              <el-checkbox label="语音"></el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="评分总分" prop="score">
            <el-input-number v-model="ruleForm.score" :step="1" :min="0" step-strictly></el-input-number>
            <span class="score_text">评分为“0”代表不需要评分评价</span>
          </el-form-item>
        </template>
      </el-form>
    </div>
  </div>
</template>
<script>
  import mixin from '@/mixins/windowResize';
  import { deepClone } from '@/utils'
  import CommonHeader from './components/CommonHeader'
  import {addEcardTemp, getEcardTemp, updateEcardTemp} from '@/api/eClock'

  export default {
    name: 'clockModuleAdd',
    components: {CommonHeader},
    data() {
      return {
        moduleId: this.$route.query.moduleId,
        timeList: [
          '06:00', '06:15', '06:30', '06:45',
          '07:00', '07:15', '07:30', '07:45',
          '08:00', '08:15', '08:30', '08:45',
          '09:00', '09:15', '09:30', '09:45',
          '10:00', '10:15', '10:30', '10:45',
          '11:00', '11:15', '11:30', '11:45',
          '12:00', '12:15', '12:30', '12:45',
          '13:00', '13:15', '13:30', '13:45',
          '14:00', '14:15', '14:30', '14:45',
          '15:00', '15:15', '15:30', '15:45',
          '16:00', '16:15', '16:30', '16:45',
          '17:00', '17:15', '17:30', '17:45',
          '18:00', '18:15', '18:30', '18:45',
          '19:00', '19:15', '19:30', '19:45',
          '20:00'
        ],
        ruleForm: {
          title: '',
          orderNum: 0,
          content: '',
          isRemind: 1,
          remindTime: '',
          isMakeCard: 1,
          isAchievementis: 1,
          finalList: [],
          score: 5
        },
        rules: {
          title: [
            {required: true, message: "请输入名称", trigger: "blur"},
            {min: 1, max: 20, message: "长度在 1 到 20 个字符", trigger: "change"}
          ],
          orderNum: [
            {required: true, trigger: "blur"}
          ],
          content: [
            {required: true, message: "请填写内容介绍", trigger: "blur"},
            {min: 1, max: 200, message: "长度在 1 到 200 个字符", trigger: "change"}
          ],
          isRemind: [
            {required: true, trigger: "blur"}
          ],
          isMakeCard: [
            {required: true, trigger: "blur"}
          ],
          isAchievementis: [
            {required: true, trigger: "blur"}
          ],
          finalList: [
            {required: true, message: "请选择成果内容", trigger: "change"}
          ],
          score: [
            {required: true, trigger: "blur"}
          ]
        }
      }
    },
    created() {
      if (this.moduleId) {
        this.getEcardTemp();
      }
    },
    mixins: [mixin],
    methods: {
      getEcardTemp() {
        getEcardTemp({ecardTempId: this.moduleId}).then(res => res.data).then(data => {
          const infoData = data.data;
          if (data.code === 200) {
            this.ruleForm.title = infoData.title;
            this.ruleForm.orderNum = infoData.orderNum;
            this.ruleForm.content = infoData.content;
            this.ruleForm.isRemind = infoData.isRemind;
            this.ruleForm.remindTime = infoData.remindTime;
            this.ruleForm.isMakeCard = infoData.isMakeCard;
            this.ruleForm.isAchievementis = infoData.isAchievementis;
            if (infoData.isAchievementis === 2) {
              this.ruleForm.score = infoData.score;
              infoData.isPhoto===2 ? this.ruleForm.finalList.push('图片') : '';
              infoData.isText===2 ? this.ruleForm.finalList.push('文本') : '';
              infoData.isVideo===2 ? this.ruleForm.finalList.push('视频') : '';
              infoData.isVoice===2 ? this.ruleForm.finalList.push('语音') : '';
            }
          } else {
            this.$message({type: 'error', message: data.msg})
          }
        }).catch(() => {})
      },
      saveModule() {
        this.$refs.ruleForm.validate((isValid) => {
          if (isValid) {
            if (this.ruleForm.isRemind === 1) {
              this.ruleForm.remindTime = '';
            } else if (!this.ruleForm.remindTime) {
              this.$message.warning('请选择提醒时间');
              return;
            }
            let finalQuery = {
              isPhoto: 1,
              isText: 1,
              isVideo: 1,
              isVoice: 1,
            };
            if (this.ruleForm.isAchievementis === 2) {
              finalQuery = {
                isPhoto: this.ruleForm.finalList.indexOf('图片') > -1 ? 2 : 1,
                isText: this.ruleForm.finalList.indexOf('文本') > -1 ? 2 : 1,
                isVideo: this.ruleForm.finalList.indexOf('视频') > -1 ? 2 : 1,
                isVoice: this.ruleForm.finalList.indexOf('语音') > -1 ? 2 : 1,
              };
            } else {
              this.ruleForm.score = 0;
            }

            let ruleJson = deepClone(this.ruleForm);
            delete ruleJson.finalList;
            if (this.moduleId) {
              finalQuery.id = this.moduleId;
              this.updateEcardTemp({...ruleJson, ...finalQuery});
            } else {
              this.addEcardTemp({...ruleJson, ...finalQuery});
            }
          }
        })
      },
      addEcardTemp(query) {
        addEcardTemp(query).then(res => res.data).then(data => {
          if (data.code === 200) {
            this.$message({type: 'success', message: '新增成功!'});
            this.$router.back();
          } else {
            this.$message({type: 'error', message: data.msg})
          }
        }).catch();
      },
      updateEcardTemp(query) {
        updateEcardTemp(query).then(res => res.data).then(data => {
          if (data.code === 200) {
            this.$message({type: 'success', message: '保存成功!'});
            this.$router.back();
          } else {
            this.$message({type: 'error', message: data.msg})
          }
        }).catch();
      }
    }
  }
</script>
<style lang="scss" scoped>
  @import "./../../styles/style.scss";

  .clock_module_add_wrap {
    padding: 12px;
    box-sizing: border-box;

    .main_wrap {
      .demo-ruleForm {
        width: 810px;
        margin: 15px auto;

        .score_text {
          margin-left: 10px;
          color: #666;
        }
      }
    }
  }
</style>
