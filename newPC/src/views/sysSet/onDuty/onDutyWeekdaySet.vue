<template>
  <div class="duty_weekday_box">
    <div class="header">
      <el-row>
        <el-col :span="10">
          <el-button size="medium" @click="goBack">返回</el-button>
          <el-button type="primary" size="medium" @click="copyLastWeek" v-show="currentWeek > 1">复制上一周数据</el-button>
          <el-button type="primary" size="medium" @click="emptyCurrentWeek">清空本周数据</el-button>
        </el-col>
        <el-col :span="4">
          <div class="header_title">第{{currentWeek}}周</div>
        </el-col>
      </el-row>
    </div>
    <div class="weekday_list_box"  :style="{'height':nobottommaxH+'px'}" style="overflow: auto">
      <div class="table table-hover">
        <div class="thead">
          <div class="tr clearfix">
            <div class="th">&nbsp;</div>
            <div class="th">周日</div>
            <div class="th">周一</div>
            <div class="th">周二</div>
            <div class="th">周三</div>
            <div class="th">周四</div>
            <div class="th">周五</div>
            <div class="th">周六</div>
          </div>
        </div>
        <div class="tbody">
          <div class="tr clearfix">
            <div class="td first_td">值班负责人</div>
            <div class="td">
              <div class="chose_teacher">
                <address-book v-model="sundayManager" @input="addressChange(1, 7, sundayManager)"
                              :config="managerConfigData"></address-book>
              </div>
            </div>
            <div class="td">
              <div class="chose_teacher">
                <address-book v-model="mondayManager" @input="addressChange(1, 1, mondayManager)"
                              :config="managerConfigData"></address-book>
              </div>
            </div>
            <div class="td">
              <div class="chose_teacher">
                <address-book v-model="tuesdayManager" @input="addressChange(1, 2, tuesdayManager)"
                              :config="managerConfigData"></address-book>
              </div>
            </div>
            <div class="td">
              <div class="chose_teacher">
                <address-book v-model="wednesdayManager" @input="addressChange(1, 3, wednesdayManager)"
                              :config="managerConfigData"></address-book>
              </div>
            </div>
            <div class="td">
              <div class="chose_teacher">
                <address-book v-model="thursdayManager" @input="addressChange(1, 4, thursdayManager)"
                              :config="managerConfigData"></address-book>
              </div>
            </div>
            <div class="td">
              <div class="chose_teacher">
                <address-book v-model="fridayManager" @input="addressChange(1, 5, fridayManager)"
                              :config="managerConfigData"></address-book>
              </div>
            </div>
            <div class="td">
              <div class="chose_teacher">
                <address-book v-model="saturdayManager" @input="addressChange(1, 6, saturdayManager)"
                              :config="managerConfigData"></address-book>
              </div>
            </div>
          </div>
          <div class="tr clearfix">
            <div class="td first_td">值班老师</div>
            <div class="td">
              <div class="chose_teacher">
                <address-book v-model="sundayTeacher" @input="addressChange(2, 7, sundayTeacher)"
                              :config="teacherConfigData"></address-book>
              </div>
            </div>
            <div class="td">
              <div class="chose_teacher">
                <address-book v-model="mondayTeacher" @input="addressChange(2, 1, mondayTeacher)"
                              :config="teacherConfigData"></address-book>
              </div>
            </div>
            <div class="td">
              <div class="chose_teacher">
                <address-book v-model="tuesdayTeacher" @input="addressChange(2, 2, tuesdayTeacher)"
                              :config="teacherConfigData"></address-book>
              </div>
            </div>
            <div class="td">
              <div class="chose_teacher">
                <address-book v-model="wednesdayTeacher" @input="addressChange(2, 3, wednesdayTeacher)"
                              :config="teacherConfigData"></address-book>
              </div>
            </div>
            <div class="td">
              <div class="chose_teacher">
                <address-book v-model="thursdayTeacher" @input="addressChange(2, 4, thursdayTeacher)"
                              :config="teacherConfigData"></address-book>
              </div>
            </div>
            <div class="td">
              <div class="chose_teacher">
                <address-book v-model="fridayTeacher" @input="addressChange(2, 5, fridayTeacher)"
                              :config="teacherConfigData"></address-book>
              </div>
            </div>
            <div class="td">
              <div class="chose_teacher">
                <address-book v-model="saturdayTeacher" @input="addressChange(2, 6, saturdayTeacher)"
                              :config="teacherConfigData"></address-book>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import AddressBook from '@/components/AddressBook/indexExpand';
  import {
    getCampusManWeekInfo,
    copyLastCampusManWeek,
    delCampusManWeek,
    addAndUpdateWatch
  } from '@/api/systemSet/onDuty';
  import mixin from '@/mixins/windowResize';

  export default {
    components: {
      AddressBook
    },
    name: "onDutyWeekdaySet",
    data() {
      return {
        currentWeek: this.$route.query.week,
        managerConfigData: {
          title: '请选择值班负责人',
          nodeTitle: '请选择值班负责人',
          depart: {target: 'user', departType: 't', userTypes: '1'}
        },
        mondayManager: {},
        tuesdayManager: {},
        wednesdayManager: {},
        thursdayManager: {},
        fridayManager: {},
        saturdayManager: {},
        sundayManager: {},
        teacherConfigData: {
          title: '请选择值班老师',
          nodeTitle: '请选择值班老师',
          depart: {target: 'user', departType: 't', userTypes: '1'}
        },
        mondayTeacher: {},
        tuesdayTeacher: {},
        wednesdayTeacher: {},
        thursdayTeacher: {},
        fridayTeacher: {},
        saturdayTeacher: {},
        sundayTeacher: {},
      }
    },
    mixins:[mixin],
    created() {
      // init 获取本周的排班，复制或清空后重新执行
      this.getCampusManWeekInfo();
      // 修改提交后进行提示 （人员未修改，点击确认，是否提示）
    },
    methods: {
      goBack() {
        this.$router.back();
      },
      // 获取信息
      getCampusManWeekInfo() {
        getCampusManWeekInfo(parseInt(this.currentWeek)).then(res => {
          let data = res.data.data;
          if (res.data.code === 200) {
            this.mondayManager = {userJson: data.watchmanger.mondayTeacherUserList};
            this.tuesdayManager = {userJson: data.watchmanger.tuesdayTeacherUserList};
            this.wednesdayManager = {userJson: data.watchmanger.wednesdayTeacherUserList};
            this.thursdayManager = {userJson: data.watchmanger.thursdayTeacherUserList};
            this.fridayManager = {userJson: data.watchmanger.fridayTeacherUserList};
            this.saturdayManager = {userJson: data.watchmanger.saturdayTeacherUserList};
            this.sundayManager = {userJson: data.watchmanger.sunTeacherUserList};

            this.mondayTeacher = {userJson: data.watchTeacher.mondayTeacherUserList};
            this.tuesdayTeacher = {userJson: data.watchTeacher.tuesdayTeacherUserList};
            this.wednesdayTeacher = {userJson: data.watchTeacher.wednesdayTeacherUserList};
            this.thursdayTeacher = {userJson: data.watchTeacher.thursdayTeacherUserList};
            this.fridayTeacher = {userJson: data.watchTeacher.fridayTeacherUserList};
            this.saturdayTeacher = {userJson: data.watchTeacher.saturdayTeacherUserList};
            this.sundayTeacher = {userJson: data.watchTeacher.sunTeacherUserList};
          }
        }).catch()
      },
      // 复制上周数据
      copyLastWeek() {
        this.$confirm('此操作将复制上一周的数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.copyLastCampusManWeek();
        }).catch(() => {
        });
      },
      copyLastCampusManWeek() {
        copyLastCampusManWeek(parseInt(this.currentWeek)).then(res => {
          if (res.data.code === 200) {
            this.$message({
              type: 'success',
              message: '复制成功!'
            });
            this.getCampusManWeekInfo();
          } else {
            this.$message({
              type: "error",
              message: res.data.msg
            });
          }
        }).catch()
      },
      // 清空数据
      emptyCurrentWeek() {
        this.$confirm('此操作将清空本周值班数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.delCampusManWeek();
        }).catch(() => {
        });
      },
      delCampusManWeek() {
        delCampusManWeek(parseInt(this.currentWeek)).then(res => {
          if (res.data.code === 200) {
            this.$message({
              type: 'success',
              message: '清空成功!'
            });
            this.getCampusManWeekInfo();
          } else {
            this.$message({
              type: "error",
              message: res.data.msg
            });
          }
        }).catch()
      },
      // 新增修改数据
      addressChange(type, week, addressJson) {
        let query = {
          severalWeek: parseInt(this.currentWeek),
          teacherList: addressJson.userJson,
          teacherType: type,
          weekNumber: week
        };
        this.addAndUpdateWatch(query);
      },
      addAndUpdateWatch(query) {
        addAndUpdateWatch(query).then(res => {
          if (res.data.code === 200) {
            if (res.data.code === 200) {
              this.$message({
                type: 'success',
                message: '设置成功!'
              });
            } else {
              this.$message({
                type: "error",
                message: res.data.msg
              });
            }
          }
        }).catch()
      },
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../../styles/style";

  .duty_weekday_box {
     padding:12px;
    .header {
      padding-bottom: 10px;
      .header_title{
        text-align: center;
        font-size: 20px;
        font-weight: 700;
        line-height: 36px;
      }
    }

    .weekday_list_box {
      .table {
        .thead {
          border-right: 1px solid #DFE6EC;

          .tr {
            background: #EEF1F6;

            .th {
              float: left;
              width: 12.5%;
              height: 50px;
              line-height: 50px;
              text-align: center;
              font-size: 15px;
              font-weight: 700;
              color: #333;
              border-top: 1px solid #DFE6EC;
              border-left: 1px solid #DFE6EC;
            }
          }
        }

        .tbody {
          border-right: 1px solid #DFE6EC;
          border-bottom: 1px solid #DFE6EC;

          .tr {
            .td {
              float: left;
              width: 12.5%;
              height: 80px;
              padding: 5px;
              border-top: 1px solid #DFE6EC;
              border-left: 1px solid #DFE6EC;
            }

            .first_td {
              line-height: 80px;
              background: #EEF1F6;
              text-align: center;
            }
          }
        }
      }
    }
  }
</style>
