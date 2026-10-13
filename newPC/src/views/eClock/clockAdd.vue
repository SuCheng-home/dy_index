<template>
  <div class="clock_module_add_wrap">
    <common-header show-back show-border>
      <el-button type="primary" size="medium" @click="saveSubject(1)">保存</el-button>
      <el-button type="primary" size="medium" @click="saveSubject(2)">发布</el-button>
    </common-header>
    <div class="main_wrap custom—scrollbar" :style="{'height':nobottommaxH+'px'}">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="140px" class="demo-ruleForm">
        <el-form-item label="模板" v-if="!cardId">
          <div class="module_name_btn el-input el-input--suffix" @click="$refs.moduleBox.showDialog(moduleInfo)">
            <div class="el-input__inner">{{moduleName || '自定义'}}</div>
            <div class="el-input__suffix"><i class="el-input__icon el-icon-plus"></i></div>
          </div>
        </el-form-item>
        <el-form-item label="任务名称" prop="title">
          <el-input v-model.trim="ruleForm.title" placeholder="请输入名称" :maxlength="20" show-word-limit @change="watchWord"></el-input>
        </el-form-item>
        <el-form-item label="介绍" prop="content">
          <el-input v-model.trim="ruleForm.content" type="textarea" :autosize="{ minRows: 3, maxRows: 5}"
                    placeholder="请填写内容介绍" :maxlength="200" show-word-limit @change="watchWord"></el-input>
        </el-form-item>
        <el-form-item label="上传图片">
          <uploader pathPrefix="edaka" module="edaka" moduleCode="20220823" multiple v-model="photoList" :extList="['jpeg', 'jpg', 'bmp', 'gif', 'png']" showMode="image" showResult="image"></uploader>
        </el-form-item>
        <el-form-item label="附件">
          <uploader pathPrefix="edaka" module="edaka" moduleCode="20220823" :multiple="true" :extList="['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx']" v-model="fileList"></uploader>
        </el-form-item>
        <el-form-item label="日常调查">
          <el-button type="primary" size="mini" @click="dailyAdd">添加</el-button>
          <div>
            <subject-show :list="subjectList" @get-subject="getSubjectInfo" @edit-tip="editTip" @delete-tip="deleteTip" show-tool></subject-show>
          </div>
        </el-form-item>
        <el-form-item label="发布对象" prop="sendUserType">
          <el-select v-model="ruleForm.sendUserType" @change="changeUserType">
            <el-option label="学生" :value="2"></el-option>
            <el-option label="老师" :value="1" v-if="isShowByPermission('/ecard/ecardTempList')"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="对象范围" prop="scopeJson">
          <address-book v-model="ruleForm.scopeJson" :config="ruleForm.sendUserType===1 ? configDataT : configDataS"></address-book>
        </el-form-item>
        <el-form-item>
          <div slot="label"><span style="color:#F56C6C;">*</span>&nbsp;起止时间</div>
          <date-calendar :checkDate="checkDateList"></date-calendar>
        </el-form-item>
        <el-form-item label="每日提醒" prop="isRemind">
          <el-radio-group v-model="ruleForm.isRemind" @change="watchWord">
            <el-radio :label="1">不提醒</el-radio>
            <el-radio :label="2">提醒</el-radio>
          </el-radio-group>
          &nbsp;&nbsp;&nbsp;&nbsp;
          <el-select v-model="ruleForm.remindTime" size="small" placeholder="请选择提醒时间" v-if="ruleForm.isRemind===2">
            <el-option :label="item" :value="item" :key="index" v-for="(item, index) in timeList"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="允许补卡" prop="isMakeCard">
          <el-radio-group v-model="ruleForm.isMakeCard" @change="watchWord">
            <el-radio :label="2">是</el-radio>
            <el-radio :label="1">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="打卡评分" prop="isCardBatch">
          <el-radio-group v-model="ruleForm.isCardBatch" @change="watchWord">
            <el-radio :label="2">是</el-radio>
            <el-radio :label="1">否</el-radio>
          </el-radio-group>
          <el-checkbox v-model="isBatchShow" style="margin-left: 20px;" v-if="ruleForm.isCardBatch===2">打卡评分互相可见</el-checkbox>
        </el-form-item>
        <el-form-item label="评分总分" prop="cardScore" v-if="ruleForm.isCardBatch===2">
          <el-input-number v-model="ruleForm.cardScore" :step="1" :min="1" step-strictly></el-input-number>
        </el-form-item>
        <el-form-item label="最终成果上传" prop="isAchievementis">
          <el-radio-group v-model="ruleForm.isAchievementis" @change="watchWord">
            <el-radio :label="2">是</el-radio>
            <el-radio :label="1">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <template v-if="ruleForm.isAchievementis===2">
          <el-form-item>
            <div slot="label"><span style="color:#F56C6C;">*</span>&nbsp;上传时间</div>
            <el-date-picker v-model="dateRange" type="daterange" size="medium" range-separator="-" start-placeholder="开始日期"
                            end-placeholder="结束日期" :clearable="false" @change="changeDate"></el-date-picker>
          </el-form-item>
          <el-form-item label="成果内容" prop="finalList">
            <el-checkbox-group v-model="ruleForm.finalList" @change="watchWord">
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

    <module-dialog ref="moduleBox" @get-module="getModuleInfo" :change-word="changeWord"></module-dialog>
    <subject-dialog ref="subjectBox" @get-subject="getSubjectInfo"></subject-dialog>
  </div>
</template>

<script>
  import mixin from '@/mixins/windowResize';
  import {isShowByPermission} from '@/utils';
  import { deepClone } from '@/utils'
  import CommonHeader from './components/CommonHeader'
  import ModuleDialog from './components/ModuleDialog'
  import SubjectDialog from './components/SubjectDialog'
  import SubjectShow from './components/SubjectShow'
  import DateCalendar from './components/DateCalendar'
  import Uploader from '@/components/Uploader/WebUploader';
  import AddressBook from "@/components/AddressBook/indexExpand";
  import {addEcard, getEcard, updateEcard} from '@/api/eClock'

  export default {
    name: 'clockAdd',
    components: {CommonHeader, ModuleDialog, SubjectDialog, SubjectShow, DateCalendar, Uploader, AddressBook},
    data() {
      const scopeJsonValidator = (rule, value, callback) => {
        if (this.ruleForm.sendUserType===2 && !this.ruleForm.scopeJson.departJson.length && !this.ruleForm.scopeJson.groupJson.length) {
          return callback(new Error('请选择班级！'));
        } else if (this.ruleForm.sendUserType===1 && !this.ruleForm.scopeJson.departJson.length && !this.ruleForm.scopeJson.userJson.length && !this.ruleForm.scopeJson.groupJson.length) {
          return callback(new Error('请选择人员！'));
        } else {
          callback();
        }
      };
      return {
        changeWord: false,
        cardId: this.$route.query.cardId,
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
        moduleInfo: {},
        moduleName: '自定义',
        ruleForm: {
          title: '',
          content: '',
          isRemind: 1,
          remindTime: '',
          sendUserType: 2,
          scopeJson: {departJson: [], userJson: [], groupJson: []},
          isMakeCard: 1,
          isCardBatch: 1,
          isAchievementis: 1,
          finalList: [],
          score: 5,
          cardScore: 0
        },
        isBatchShow: false,
        rules: {
          title: [
            {required: true, message: "请输入名称", trigger: "blur"},
            {min: 1, max: 20, message: "长度在 1 到 20 个字符", trigger: "change"}
          ],
          content: [
            {required: true, message: "请填写内容介绍", trigger: "blur"},
            {min: 1, max: 200, message: "长度在 1 到 200 个字符", trigger: "change"}
          ],
          scopeJson: [
            {required: true, validator: scopeJsonValidator, trigger: "blur"},
          ],
          isRemind: [
            {required: true, trigger: "blur"}
          ],
          isMakeCard: [
            {required: true, trigger: "blur"}
          ],
          cardScore: [
            {required: true, message: "请输入评分", trigger: "blur"}
          ],
          isAchievementis: [
            {required: true, trigger: "blur"}
          ],
          finalList: [
            {required: true, message: "请选择成果内容", trigger: "blur"}
          ],
          score: [
            {required: true, trigger: "blur"}
          ]
        },
        photoList: [],
        fileList: [],
        checkDateList: [],
        dateRange: [],
        configDataS: {
          title: '选择学生',
          depart: {target: 'depart', departType: 's', userTypes: '2', notCheckSchool: true, isIgnoreDepart: true, isIgnoreGrade: true},
          group: {
            groupTarget: 'all',
            groupScope: [2]
          }
        },
        configDataT: {
          title: '选择教师',
          depart: {target: 'all', departType: 't', userTypes: '1', notCheckSchool: true},
          group: true
        },
        subjectList: [],
        curChangeVal: 0
      }
    },
    created() {
      if (this.cardId) {
        this.getEcard();
      }
    },
    mixins: [mixin],
    methods: {
      isShowByPermission,
      getEcard() {
        getEcard({eCardId: this.cardId}).then(res => res.data).then(data => {
          const infoData = data.data;
          if (data.code === 200) {
            this.ruleForm.title = infoData.title;
            this.ruleForm.content = infoData.content;
            if (infoData.photoJson) {
              this.photoList = JSON.parse(infoData.photoJson);
            }
            if (infoData.fileJson) {
              this.fileList = JSON.parse(infoData.fileJson);
            }
            this.subjectList = this.getTopicJsonList(infoData.topicJson);
            this.ruleForm.sendUserType = infoData.sendUserType;
            if (infoData.sendUserType === 1) {
              this.ruleForm.scopeJson = JSON.parse(infoData.thScopeJson);
            } else {
              this.ruleForm.scopeJson = {departJson: JSON.parse(infoData.stuDepartJson), groupJson: JSON.parse(infoData.stuGrooupJson)};
            }
            this.checkDateList = JSON.parse(infoData.dateJson);
            this.ruleForm.isRemind = infoData.isRemind;
            this.ruleForm.remindTime = infoData.remindTime;
            this.ruleForm.isMakeCard = infoData.isMakeCard;
            this.ruleForm.isCardBatch = infoData.isCardBatch || 1;
            if (infoData.isCardBatch===2) {
              this.ruleForm.cardScore = infoData.cardScore;
              this.isBatchShow = infoData.isBatchShow===2;
            }
            this.ruleForm.isAchievementis = infoData.isAchievementis;
            if (infoData.isAchievementis === 2) {
              this.ruleForm.score = infoData.score;
              this.dateRange = [infoData.achuevStartDate, infoData.achuevEndDate];
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
      saveSubject(state) {
        this.$refs.ruleForm.validate((isValid) => {
          if (isValid) {
            if (!this.checkDateList || !this.checkDateList.length) {
              this.$message.warning('请选择起止时间');
              return;
            }
            if (this.ruleForm.isAchievementis === 2 && (!this.dateRange || !this.dateRange.length)) {
              this.$message.warning('请选择上传时间');
              return;
            }
            if (this.ruleForm.isRemind === 1) {
              this.ruleForm.remindTime = '';
            } else if (!this.ruleForm.remindTime) {
              this.$message.warning('请选择提醒时间');
              return;
            }
            if (this.ruleForm.isCardBatch!==2) {
              this.ruleForm.cardScore = 0;
              this.isBatchShow = false;
            }
            const allDateList = this.checkDateList.sort();
            const commonQuery = {
              dateJson: allDateList,
              endDate: allDateList[allDateList.length-1],
              startDate: allDateList[0],
              fileJson: this.fileList.length ? this.fileList : '',
              photoJson: this.photoList.length ? this.photoList : '',
              isVote: this.subjectList.length ? 2 : 1,
              isBatchShow: this.isBatchShow ? 2 : 1,
              state: state
            };
            let ruleJson = deepClone(this.ruleForm);
            delete ruleJson.finalList;

            if (this.ruleForm.sendUserType === 1) {
              commonQuery.stuDepartJson = '';
              commonQuery.stuGroupJson = '';
              commonQuery.thScopeJson = ruleJson.scopeJson;
            } else {
              commonQuery.thScopeJson = '';
              commonQuery.stuDepartJson = ruleJson.scopeJson.departJson || '';
              commonQuery.stuGroupJson = ruleJson.scopeJson.groupJson || '';
            }
            delete ruleJson.scopeJson;

            if (this.subjectList.length) {
              commonQuery.topicJson = this.getTopicList(this.subjectList);
            } else {
              commonQuery.topicJson = '';
            }

            let finalQuery = {
              isPhoto: 1,
              isText: 1,
              isVideo: 1,
              isVoice: 1,
              achuevStartDate: '',
              achuevEndDate: ''
            };
            if (this.ruleForm.isAchievementis === 2) {
              finalQuery = {
                isPhoto: this.ruleForm.finalList.indexOf('图片') > -1 ? 2 : 1,
                isText: this.ruleForm.finalList.indexOf('文本') > -1 ? 2 : 1,
                isVideo: this.ruleForm.finalList.indexOf('视频') > -1 ? 2 : 1,
                isVoice: this.ruleForm.finalList.indexOf('语音') > -1 ? 2 : 1,
                achuevStartDate: this.$moment(this.dateRange[0]).format('YYYY-MM-DD'),
                achuevEndDate: this.$moment(this.dateRange[1]).format('YYYY-MM-DD')
              };
            } else {
              ruleJson.score = 0;
            }

            if (this.cardId) {
              commonQuery.id = this.cardId;
              this.updateEcard({...commonQuery, ...ruleJson, ...finalQuery});
            } else {
              this.addEcard({...commonQuery, ...ruleJson, ...finalQuery});
            }

          }
        })
      },
      addEcard(query) {
        addEcard(query).then(res => res.data).then(data => {
          if (data.code === 200) {
            this.$message({type: 'success', message: '新增成功!'});
            this.$router.back();
          } else {
            this.$message({type: 'error', message: data.msg})
          }
        }).catch();
      },
      updateEcard(query) {
        updateEcard(query).then(res => res.data).then(data => {
          if (data.code === 200) {
            this.$message({type: 'success', message: '保存成功!'});
            this.$router.back();
          } else {
            this.$message({type: 'error', message: data.msg})
          }
        }).catch();
      },
      getTopicList(list) {
        let newList = [];
        list.forEach((item, index) => {
          newList.push({
            optionList: item.optionList.map((i, iIndex)=> {
              return {
                optionSeq: iIndex+1,
                optionTitle: i
              }
            }),
            topType: item.type,
            topicOrder: index+1,
            topicSeq: index+1,
            topicTitle: item.title
          })
        });
        return newList;
      },
      getTopicJsonList(listJson) {
        let newList = [];
        if (listJson) {
          JSON.parse(listJson).forEach((item) => {
            newList.push({
              optionList: item.optionList.map(i => {
                return i.optionTitle
              }),
              type: item.topType,
              title: item.topicTitle
            })
          });
        }
        return newList;
      },
      getModuleInfo(val) {
        this.moduleInfo = val;
        this.moduleName = val.title || '自定义';
        this.emptyTask();
        if (val.id) {
          // 模板
          this.drawModuleInfo(val);
        }
      },
      drawModuleInfo(val) {
        this.ruleForm = {
          title: val.title,
          content: val.content,
          sendUserType: 2,
          scopeJson: {departJson: [], userJson: [], groupJson: []},
          isRemind: val.isRemind,
          remindTime: val.remindTime,
          isMakeCard: val.isMakeCard,
          isCardBatch: val.isCardBatch || 1,
          isAchievementis: val.isAchievementis,
          finalList: [],
          score: val.score,
          cardScore: val.cardScore
        };
        val.isPhoto===2 ? this.ruleForm.finalList.push('图片') : '';
        val.isText===2 ? this.ruleForm.finalList.push('文本') : '';
        val.isVideo===2 ? this.ruleForm.finalList.push('视频') : '';
        val.isVoice===2 ? this.ruleForm.finalList.push('语音') : '';
      },
      emptyTask() {
        this.ruleForm = {
          title: '',
          content: '',
          isRemind: 1,
          remindTime: '',
          sendUserType: 2,
          scopeJson: {departJson: [], userJson: [], groupJson: []},
          isMakeCard: 1,
          isCardBatch: 1,
          isAchievementis: 1,
          finalList: [],
          score: 5,
          cardScore: 0
        };
        this.subjectList = [];
        this.changeWord = false;
        this.isBatchShow = false;
      },
      watchWord() {
        this.changeWord = true;
      },
      changeUserType() {
        this.watchWord();
        this.ruleForm.scopeJson = {departJson: [], userJson: [], groupJson: []};
      },
      getSubjectInfo(val, isEdit) {
        if (isEdit===2) {
          this.subjectList.splice(this.curChangeVal, 1, val);
        } else {
          this.subjectList.push(val);
        }
        // sessionStorage.setItem('subjectList', JSON.stringify(this.subjectList))
      },
      editTip(val) {
        this.curChangeVal = val;
        this.$refs.subjectBox.showDialog(this.subjectList[val]);
      },
      dailyAdd() {
        this.$refs.subjectBox.showDialog();
      },
      deleteTip(val) {
        this.subjectList.splice(val, 1);
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

        .module_name_btn{
          cursor: pointer;
        }
        .score_text {
          margin-left: 10px;
          color: #666;
        }

      }
    }
  }
</style>
