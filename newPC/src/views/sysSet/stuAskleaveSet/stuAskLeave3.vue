<template>
  <div class="stu_leave3_wrap">
    <div class="header">
      <el-button size="medium" @click="goBack">返回</el-button>
      <el-button type="primary" size="medium" :loading="save_loading" @click.native="addAndUpdateStuAskleaveThreeInit">
        保存
      </el-button>
    </div>
    <div class="mainWrap" :style="`height:${nobottommaxH}px`">
      <el-form :model="ruleForm" ref="ruleForm" :rules="rules" label-width="140px" class="demo-ruleForm"
               style="width:810px;margin:10px auto;">

        <div class="big-title"><span class="mudule-info"><span class="color-block"></span>请假类型设置</span></div>
        <el-row>
          <el-col :span="24">
            <el-form-item label="请假类型" prop="checkedLeaveTypeList">
              <el-checkbox-group v-model="ruleForm.checkedLeaveTypeList">
                <el-checkbox v-for="item in leaveTypeList" :label="item.label" :key="item.key"
                             @change="leaveTypeChange"></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-show="isShowSickBox">
          <el-col :span="6">
            <el-form-item label="病假需要症状">
              <el-tooltip :content="ruleForm.sickType ? '请病假时需要选择症状' : '请病假时不需要选择症状' " placement="top">
                <el-switch v-model="ruleForm.sickType"></el-switch>
              </el-tooltip>
            </el-form-item>
          </el-col>
          <el-col :span="18">
            <el-form-item v-show="ruleForm.sickType" label-width="0" prop="sickTypeList">
              <el-checkbox-group v-model="ruleForm.sickTypeList">
                <el-checkbox v-for="item in symptomList" :label="item.value" :key="item.code"></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-col>
        </el-row>


        <div class="big-title">
          <span class="mudule-info"><span class="color-block"></span>免责声明</span>
          <el-switch v-model="ruleForm.hasDisclaimer"></el-switch>
        </div>
        <el-form-item label-width="0" v-show="ruleForm.hasDisclaimer">
          <el-input type="textarea" :rows="6" placeholder="请输入内容" maxlength="300" v-model.trim="ruleForm.content"></el-input>
        </el-form-item>

        <div>
          <div class="big-title"><span class="mudule-info"><span class="color-block"></span>提醒及推送</span></div>
          <el-row>
            <el-col :span="6">
              <el-form-item label="住校生请假推送">
                <el-tooltip :content="ruleForm.isSendLiveSchool?'需要推送':'不需要推送' " placement="top">
                  <el-switch v-model="ruleForm.isSendLiveSchool"></el-switch>
                </el-tooltip>
              </el-form-item>
            </el-col>
            <el-col :span="18">
              <el-form-item v-show="ruleForm.isSendLiveSchool" label=" " prop="sendLiveSchoolJsonData" label-width="0">
                <address-book v-model="ruleForm.sendLiveSchoolJsonData" :config="configData"></address-book>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="6">
              <el-form-item label="提醒任课老师">
                <el-tooltip :content="ruleForm.isSendTeacher?'需要提醒任课老师':'不需要提醒任课老师' " placement="top">
                  <el-switch v-model="ruleForm.isSendTeacher"></el-switch>
                </el-tooltip>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="6">
              <el-form-item label="其他人员">
                <el-tooltip :content="ruleForm.isSendOther?'需要推送':'不需要推送' " placement="top">
                  <el-switch v-model="ruleForm.isSendOther"></el-switch>
                </el-tooltip>
              </el-form-item>
            </el-col>
            <el-col :span="18">
              <el-form-item v-show="ruleForm.isSendOther" label=" " prop="sendOtherJsonData"
                            label-width="0">
                <address-book v-model="ruleForm.sendOtherJsonData" :config="configData"></address-book>
              </el-form-item>
            </el-col>
          </el-row>
        </div>

      </el-form>
    </div>
  </div>
</template>
<script>
  import mixin from '@/mixins/windowResize';
  import AddressBook from '@/components/AddressBook/indexExpand';
  import {getStuAskLeaveThreeInit, addAndUpdateStuAskleaveThreeInit} from '@/api/systemSet/StuLeave3Set';
  import {findDicsByCode} from '@/api/system';

  export default {
    name: 'stuAskLeave3',
    components: {
      AddressBook
    },
    data() {
      return {
        save_loading: false,
        isShowSickBox: false,
        leaveTypeList: [{label: '事假', key: 0}, {label: '病假', key: 1}, {label: '其他', key: 4}],
        ruleForm: {
          checkedLeaveTypeList: [], //请假类型
          hasDisclaimer: false,
          content: '',
          sendLiveSchoolJsonData: {userJson: []}, //住校人员
          sendOtherJsonData: {userJson: []}, //其他人员
          isSendLiveSchool: false, //是否住校人员
          isSendOther: false, //是否其他人员
          isSendTeacher: false,//提醒任课老师
          sickType: false,//是否需要症状
          sickTypeList: [],//选中
        },
        rules: {
          checkedLeaveTypeList: [
            {type: 'array', required: true, message: '请至少选择一个请假类型！', trigger: 'change'}
          ]
        },
        configData: {title: '审批人', depart: {target: 'user', departType: 't', userTypes: '1'}},
        symptomList: [],
      }
    },
    created() {
      findDicsByCode('stusymptom').then(res => {
        this.symptomList = res.data.data;
      }).catch();

      this.getStuAskLeaveThreeInit();
    },
    mixins: [mixin],
    methods: {
      goBack() {
        this.$router.back();
      },
      getStuAskLeaveThreeInit() {
        getStuAskLeaveThreeInit().then(res => {
          let data = res.data.data;
          if (res.data.code === 200 && data) {

            this.ruleForm.checkedLeaveTypeList = this.getCheckedTypeList(JSON.parse(data.leaveTypeJson));

            this.leaveTypeChange();
            this.ruleForm.sickType = Number(data.isSickTypeGroup) === 1;
            if (this.ruleForm.sickType) {
              this.ruleForm.sickTypeList = this.getSickTypeList(JSON.parse(data.sickTypeJson));
            }


            this.ruleForm.content = data.mark;
            this.ruleForm.hasDisclaimer = !!data.mark;

            this.ruleForm.isSendLiveSchool = data.isSendStay === 1;
            if (this.ruleForm.isSendLiveSchool) {
              this.ruleForm.sendLiveSchoolJsonData = {userJson: JSON.parse(data.sendStayUserJson)};
            }
            this.ruleForm.isSendTeacher = data.isSendTeacher === 1;
            this.ruleForm.isSendOther = data.isSendElse === 1;
            if (this.ruleForm.isSendOther) {
              this.ruleForm.sendOtherJsonData = {userJson: JSON.parse(data.sendElseUserJson)};
            }
          }
        }).catch();
      },
      addAndUpdateStuAskleaveThreeInit() {
        this.$refs['ruleForm'].validate((valid) => {
          if (valid) {
            if (this.isShowSickBox && this.ruleForm.sickType && !this.ruleForm.sickTypeList.length) {
              this.$message({
                message: '请选择病假症状！',
                type: 'warning'
              });
              return;
            }
            if (this.ruleForm.hasDisclaimer && !this.ruleForm.content) {
              this.$message({
                message: '请输入免责声明！',
                type: 'warning'
              });
              return;
            }
            if (this.ruleForm.isSendLiveSchool && !this.ruleForm.sendLiveSchoolJsonData.userJson.length) {
              this.$message({
                message: '请选择推送人员！',
                type: 'warning'
              });
              return;
            }
            if (this.ruleForm.isSendOther && !this.ruleForm.sendOtherJsonData.userJson.length) {
              this.$message({
                message: '请选择其他人员！',
                type: 'warning'
              });
              return;
            }

            let query = {
              isSendElse: this.ruleForm.isSendOther ? 1 : 2,
              isSendStay: this.ruleForm.isSendLiveSchool ? 1 : 2,
              isSendTeacher: this.ruleForm.isSendTeacher ? 1 : 2,
              isSickTypeGroup: this.ruleForm.sickType ? 1 : 2,
              mark: this.ruleForm.hasDisclaimer ? this.ruleForm.content : '',
              leaveTypeJson: JSON.stringify(this.getLeaveTypeJson()), // 请假类型
              sendElseUserJson: this.ruleForm.isSendOther ? JSON.stringify(this.ruleForm.sendOtherJsonData.userJson) : '', // 推送其它
              sendStayUserJson: this.ruleForm.isSendLiveSchool ? JSON.stringify(this.ruleForm.sendLiveSchoolJsonData.userJson) : '', // 推送住宿生
              sickTypeJson: this.ruleForm.sickType ? JSON.stringify(this.getSymptomJson()) : '', // 疾病类型
            };

            this.addAndUpdateStuAskleaveThree(query);
          }
        });
      },
      addAndUpdateStuAskleaveThree(query) {
        this.save_loading = true;
        addAndUpdateStuAskleaveThreeInit(query).then(res => {
          let data = res.data;
          if (data.code === 200) {
            this.$message({
              message: '保存成功！',
              type: 'success'
            });
            this.$router.back();
          } else {
            this.$message({
              message: data.msg,
              type: 'error'
            });
          }
          this.save_loading = false;
        }).catch();
      },
      getCheckedTypeList(list) {
        let array = [];
        if (list) {
          list.forEach((item) => {
            array.push(item.label)
          });
        }

        return array;
      },
      getSickTypeList(list) {
        let array = [];
        if (list) {
          list.forEach((item) => {
            array.push(item.value);
          });
        }
        return array;
      },
      getLeaveTypeJson() {
        let array = [];
        this.leaveTypeList.forEach((item) => {
          if (this.ruleForm.checkedLeaveTypeList.indexOf(item.label) > -1) {
            array.push(item);
          }
        });
        return array;
      },
      getSymptomJson() {
        let array = [];
        this.symptomList.forEach((item) => {
          if (this.ruleForm.sickTypeList.indexOf(item.value) > -1) {
            array.push(item);
          }
        });
        return array;
      },
      leaveTypeChange() {
        this.isShowSickBox = (this.ruleForm.checkedLeaveTypeList.indexOf("病假") > -1);
      }
    }
  }
</script>

<style lang="scss" scoped>
  .stu_leave3_wrap {
    padding:12px;
   .el-form{
        width: 810px;
       margin: 0 auto;
    }
    .header {
      
      padding-bottom: 10px;
      border-bottom: 1px solid #eee;
    }

    .big-title {
      margin-bottom: 6px;
    }

    .big-title .mudule-info {
      height: 40px;
      font-size: 15px;
      font-weight: 700;
      line-height: 40px;
      color: #676a6c;
    }

    .big-title .mudule-info .color-block {
      width: 4px;
      display: inline-block;
      margin-right: 12px;
      vertical-align: middle;
      margin-top: 12px;
      height: 16px;
      background: #409EFF;
    }

    .color-block {
      float: left;
      width: 10px;
      height: 10px;
      background-color: #ACD6FF;
      margin: 15px 8px 0 0;
    }

    .form-title {
      padding-left: 30px;
      margin-bottom: 10px;
    }

    .mainWrap {
      overflow-x: hidden;
      overflow-y: auto;
    }
  }
</style>
