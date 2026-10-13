<template>
  <div class="guide_group_set_wrap">
    <div class="header">
      <el-button size="medium" @click="goBack">返回</el-button>
      <el-button type="primary" size="medium" @click="saveGuideSet">保存</el-button>
    </div>
    <div class="guide_group_set_box" :style="`height: ${maxH}px;`">
      <div class="code_title">
        <span>护导方式</span>
        <el-radio-group v-model="guideType">
          <el-radio label="0">护导签到</el-radio>
          <el-radio label="1">护导检查</el-radio>
        </el-radio-group>
      </div>

      <div class="code_title" style="display: flex;align-items: center;gap: 5px;">
        <span>护导提醒</span>
        <el-checkbox v-model="isRemind"></el-checkbox>
        <span v-show="isRemind">
          <el-radio-group v-model="remindType" style="margin-left: 10px;">
            <el-radio label="0">按次提醒</el-radio>
            <el-radio label="1">按天提醒</el-radio>
          </el-radio-group>
          <span v-show="remindType === '0'" style="margin-left: 10px;">
            <span>开始前</span>
            <el-select v-model="remindTime" placeholder="请选择" style="width: 70px;" size="mini">
              <el-option v-for="(item, index) in remindTimeList" :key="index" :label="item" :value="item"></el-option>
            </el-select>
            <span>分钟提醒</span>
          </span>
          <span v-show="remindType === '1'" style="margin-left: 10px;">
            <span>提醒时间</span>
            <el-time-select placeholder="选择时间" v-model="beginRemindTime" :picker-options="{
              start: '00:00',
              step: '00:05',
              end: '23:55'
            }" format="HH:mm" value-format="HH:mm" style="width: 100px;">
            </el-time-select>
          </span>
        </span>
      </div>

      <div v-show="guideType === '0'">
        <div class="code_title">
          <span>日清报告</span>
          <el-checkbox v-model="dayClearReport"></el-checkbox>
        </div>
        <div class="code_list" v-show="dayClearReport">
          <div class="send_teacher_box">
            <span class="week_name_title"><span style="color: #f00;">*</span>推送时间</span>
            <el-select v-model="dayClearReportTime" placeholder="请选择" >
            <el-option v-for="(item, index) in timelist" :key="index" :label="item.name" :value="item.id"></el-option>
          </el-select>
          </div>
          <div class="send_teacher_box">
            <span class="week_name_title"><span style="color: #f00;">*</span>总负责人</span>
            <address-book v-model="dayClearManagersData" :config="configData" ref="address" class="week_address"></address-book>
          </div>
        </div>

        <div class="code_title">
          <span>推送护导报告</span>
          <el-checkbox v-model="isPushReport"></el-checkbox>
        </div>
        <div class="code_list" v-show="isPushReport">
          <div class="send_teacher_box">
            <span class="week_name_title"><span style="color: #f00;">*</span>推送时间</span>
            <el-select v-model="sendReportTime" placeholder="请选择">
            <el-option v-for="(item, index) in timelist" :key="index" :label="item.name" :value="item.id"></el-option>
          </el-select>
          </div>
          <div class="send_teacher_box" :key="weekIndex" v-for="(weekItem, weekIndex) in weekRemindList">
            <span class="week_name_title">星期{{weekNameList[weekIndex]}}</span>
            <address-book v-model="weekItem.remindJson" :config="weekConfigData" ref="address" class="week_address"></address-book>
          </div>
        </div>
      </div>

      <div>
        <div class="code_title">
          <span>护导反馈</span>
          <el-checkbox v-model="isBackReport"></el-checkbox>
        </div>
        <div class="code_list" v-show="isBackReport">
          <div class="send_teacher_box">
            <span class="week_name_title">总负责人</span>
            <address-book v-model="totalLeaderData" :config="configData" ref="address" class="week_address"></address-book>
          </div>

          <div class="min_title_box">
            <el-checkbox v-model="isPushByDay" style="margin-right: 10px">按天推送（每天下午16: 30推送）</el-checkbox>
          </div>
          <div class="send_teacher_box" v-show="isPushByDay">
            <span class="week_name_title"><span style="color: #f00;">*</span>推送范围</span>
            <address-book v-model="dayAddressData" :config="weekConfigData" ref="address" class="week_address"></address-book>
          </div>

          <div class="min_title_box">
            <el-checkbox v-model="isPushByWeek" style="margin-right: 10px">按周推送（每周下午16 : 30推送)</el-checkbox>
          </div>
          <div v-show="isPushByWeek">
            <div class="send_teacher_box">
              <span class="week_name_title"><span style="color: #f00;">*</span>推送日期</span>
              <el-select v-model="pushDayNo" placeholder="请选择" style="width: 160px;margin-right: 545px" size="small">
                <el-option v-for="(item, index) in pushDayList" :key="index" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </div>
            <div class="send_teacher_box">
              <span class="week_name_title"><span style="color: #f00;">*</span>推送范围</span>
              <address-book v-model="weekAddressData" :config="weekConfigData" ref="address" class="week_address"></address-book>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import mixins from '@/mixins/windowResize';
  import AddressBook from '@/components/AddressBook/indexExpand';
  import {getSchoolGuideRemindSetInfo, addGuidRemindSet} from '@/api/systemSet/guide';

  export default {
    name: "guideGroupSet",
    components: {
      AddressBook
    },
    data() {
      return {
        listLoading: false,
        groupSetJson: {},
        guideType: '0',
        isRemind: false, // 护导提醒
        remindType: '0', // 提醒类型：0按次提醒，1按天提醒
        remindTime: 5,
        remindTimeList: [5, 10, 15],
        beginRemindTime:'07:10', // 按天开始提醒时间，默认7:10
        isPushReport: false, // 护导推送报告
        weekConfigData: {title: '请选择', depart: {target: 'all', departType: 't', userTypes: '1', notCheckSchool: true}, group: true},
        weekNameList: ['一', '二', '三', '四', '五', '六', '日'],
        timelist:[{id:1,name:'16:00'},{id:2,name:'16:30'},{id:3,name:'17:00'},{id:4,name:'17:30'},{id:5,name:'18:00'}],
        dayClearReportTime:2,
        sendReportTime:1,
        weekRemindList: [
          {
            weekId: 1,
            remindJson: {}
          },
          {
            weekId: 2,
            remindJson: {}
          },
          {
            weekId: 3,
            remindJson: {}
          },
          {
            weekId: 4,
            remindJson: {}
          },
          {
            weekId: 5,
            remindJson: {}
          },
            {
                weekId: 6,
                remindJson: {}
            },
            {
                weekId: 7,
                remindJson: {}
            }
        ],
        isBackReport: false, // 护导反馈
        configData: {title: '请选择', depart: {target: 'user', departType: 't', userTypes: '1'}},
        totalLeaderData: {userJson: []},
        isPushByDay: false, // 按天推送
        dayAddressData: {},
        isPushByWeek: false, // 按周推送
        pushDayNo: 1,
        pushDayList: [
          {
            value: 1,
            label: '星期一'
          },
          {
            value: 2,
            label: '星期二'
          },
          {
            value: 3,
            label: '星期三'
          },
          {
            value: 4,
            label: '星期四'
          },
          {
            value: 5,
            label: '星期五'
          },
            {
                value: 6,
                label: '星期六'
            },
            {
                value: 7,
                label: '星期日'
            }
        ],
        weekAddressData: {},
        dayClearReport: false,
        dayClearManagersData: {userJson: []},
      }
    },
    mixins: [mixins],
    created() {
      this.getSchoolGuideRemindSetInfo();
    },
    methods: {
      goBack() {
        this.$router.back();
      },
      getSchoolGuideRemindSetInfo() {
        getSchoolGuideRemindSetInfo().then(res => {
          const data = res.data.data;
          if (res.data.code === 200) {
            this.groupSetJson = data;
            this.guideType = data.guideType.toString();
            this.isRemind = data.isRemind === 2;
            this.remindType = data.remindType ? data.remindType.toString() : '0';
            if (data.remindTime && data.isRemind === 2) {
              this.remindTime = data.remindTime;
            }
            if (data.beginRemindTime && data.isRemind === 2) {
                this.beginRemindTime =data.beginRemindTime
             
            }
            this.dayClearReportTime=(data.dayClearReportTime!=0)?data.dayClearReportTime:2;
            this.sendReportTime=(data.sendReportTime!=0)?data.sendReportTime:1;
            if (data.guideType === 0) {
              this.dayClearReport = data.dayClearReport === 1;
              if (data.dayClearReport === 1) {
                this.dayClearManagersData = JSON.parse(data.dayClearManagers);
              }
              this.isPushReport = data.isSendReport === 1;

              // data.remindScopes
              const weekIdList = data.remindScopes.map(item => item.weekId);
              this.weekRemindList.forEach((item) => {
                if (weekIdList.indexOf(item.weekId) > -1) {
                  const scopeItem = data.remindScopes[weekIdList.indexOf(item.weekId)];
                  item.remindJson = {
                    userJson: scopeItem.sendUsers,
                    groupJson: scopeItem.sendGroups,
                    departJson: scopeItem.sendDeparts,
                  }
                }
              })
            }

            this.isBackReport = data.isFeedback === 1;
            if (this.isBackReport) {
              if (data.feedbackUsers) {
                this.totalLeaderData = {
                  userJson: JSON.parse(data.feedbackUsers) || []
                };
              }
              this.isPushByDay = data.isPushByDay === 1;
              if (data.isPushByDay === 1) {
                this.dayAddressData = JSON.parse(data.pushByDayScope) || [];
              }
              this.isPushByWeek = data.isPushByWeek === 1;
              if (data.isPushByWeek === 1) {
                this.weekAddressData = JSON.parse(data.pushByWeekScope) || [];
                this.pushDayNo = data.pushDayNo;
              }
            }
          }
        }).catch()
      },
      saveGuideSet() {
        // 护导反馈输入校验
        if (this.isBackReport) {
          if (this.isPushByDay && (!this.dayAddressData.userJson || !this.dayAddressData.userJson.length) && (!this.dayAddressData.departJson || !this.dayAddressData.departJson.length) && (!this.dayAddressData.groupJson || !this.dayAddressData.groupJson.length)) {
            this.$message({
              message: '请选择按天推送范围!',
              type: 'warning'
            });
            return;
          }
          if (this.isPushByWeek && (!this.weekAddressData.userJson || !this.weekAddressData.userJson.length) && (!this.weekAddressData.departJson || !this.weekAddressData.departJson.length) && (!this.weekAddressData.groupJson || !this.weekAddressData.groupJson.length)) {
            this.$message({
              message: '请选择按周推送范围!',
              type: 'warning'
            });
            return;
          }
        }
        if(this.isPushReport) {
            if(this.weekRemindList.every(item => (!item.remindJson.userJson || item.remindJson.userJson.length === 0) && (!item.remindJson.departJson || item.remindJson.departJson.length === 0) && (!item.remindJson.groupJson || item.remindJson.groupJson.length === 0)) ) {
                this.$message({
                    message: '请设置每日推送范围!',
                    type: 'warning'
                });
                return;
            }
        }
        if (this.guideType === '0' && this.dayClearReport && (!this.dayClearManagersData.userJson || !this.dayClearManagersData.userJson.length)) {
          this.$message({
            message: '请选择日清报告总负责人!',
            type: 'warning'
          });
          return;
        }

        let query = {
          dayClearManagers: (this.dayClearReport && this.guideType === '0') ? JSON.stringify(this.dayClearManagersData) : '',
          dayClearReport: (this.dayClearReport && this.guideType === '0') ? 1 : 0,
          feedbackUsers: (this.isBackReport && this.totalLeaderData.userJson && this.totalLeaderData.userJson.length) ? JSON.stringify(this.totalLeaderData.userJson) : '',
          guideType: Number(this.guideType),
          id: this.groupSetJson.id || 0,
          isFeedback: this.isBackReport ? 1 : 0,
          isPushByDay: (this.isBackReport && this.isPushByDay) ? 1 : 0,
          isPushByWeek: (this.isBackReport && this.isPushByWeek) ? 1 : 0,
          isRemind: this.isRemind ? 2 : 1,
          isSendReport: (this.isPushReport && this.guideType === '0') ? 1 : 2,
          pushByDayScope: (this.isBackReport && this.isPushByDay) ? JSON.stringify(this.dayAddressData) : '',
          pushByWeekScope: (this.isBackReport && this.isPushByWeek) ? JSON.stringify(this.weekAddressData) : '',
          pushDayNo: (this.isBackReport && this.isPushByWeek) ? Number(this.pushDayNo) : 0,
          remindScopesJson: (this.isPushReport && this.guideType === '0') ? this.getPushReportJson() : '',
          remindTime: this.isRemind ? this.remindTime : 0,
          remindType: this.isRemind ? Number(this.remindType) : 0,
          beginRemindTime: this.isRemind && this.remindType === '1' ? this.beginRemindTime : '',
          dayClearReportTime:this.dayClearReport==1?this.dayClearReportTime:0,
          sendReportTime:this.isPushReport==1?this.sendReportTime:0
        };

        this.addGuidRemindSet(query);
      },
      getPushReportJson() {
        if (this.weekRemindList.length) {
          let newScopeList = [];
          this.weekRemindList.forEach((item) => {
            if ((item.remindJson.departJson && item.remindJson.departJson.length) || item.remindJson.groupJson && item.remindJson.groupJson.length || item.remindJson.userJson && item.remindJson.userJson.length) {
              newScopeList.push({
                sendDepartJson: item.remindJson.departJson,
                sendGroupJson: item.remindJson.groupJson,
                sendUserJson: item.remindJson.userJson,
                weekId: item.weekId
              })
            }
          });
          if (newScopeList.length) {
            return JSON.stringify(newScopeList);
          }
          return '';
        }
        return '';
      },
      
      addGuidRemindSet(query) {
        if (this.listLoading) {
          return;
        }
        this.listLoading = true;
        addGuidRemindSet(query).then(res => {
          if (res.data.code === 200) {
            this.$message.success('保存成功');
            this.listLoading = false;
            this.goBack();
          } else {
            this.$message.warning(res.data.msg);
            this.listLoading = false;
          }
        }).catch()
      }
    }
  }
</script>

<style lang="scss" scoped>
  /*@import "../../../styles/style";*/

  .guide_group_set_wrap {
    padding:12px;

    .header {
      padding-bottom: 10px;
      border-bottom: 1px solid #eee;
    }

    .guide_group_set_box {
      width: 810px;
      margin: 20px auto;
      overflow-x: hidden;
      overflow-y: auto;

      .code_title {
        height: 20px;
        line-height: 20px;
        margin: 25px 15px 15px;
        padding-left: 8px;
        border-left: 3px solid #409eff;
        color: #333;
        font-size: 15px;
      }

      .code_list{
        .guide_total_msg{
          margin-left: 25px;
          color: #666;
          line-height: 36px;
          span{
            color: #F56C6C;
          }
        }
        .send_teacher_box{
          margin-top: 15px;
          display: flex;
          .week_name_title{
            height: 38px;
            line-height: 38px;
            color: #666;
            margin-left: 25px;
            width: 80px;
            font-size: 14px;
          }
          .week_address{
            width: 600px;
            margin-right: 105px;
          }
        }
        .min_title_box{
          margin-top: 15px;
          margin-left: 25px;
        }
      }
    }
  }
</style>
