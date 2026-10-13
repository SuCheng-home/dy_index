<template>
  <div class="read_book_setting_wrap">
    <backtool>
      <el-button type="primary"  size="medium"  @click.native="saveReadClockInSet">保存</el-button>
    </backtool>
    <div>
      <el-form label-width="140px" class="demo-ruleForm">
        <el-form-item>
          <div class="top_title">提醒家长</div>
          <div class="check_box_wrap">
            <el-checkbox v-model="warnClockIn">打卡提醒（每天 20：00）</el-checkbox>
          </div>
          <div class="check_box_wrap">
            <el-checkbox v-model="warnWeekPlan">周计划制定提醒（每周日 20：00）</el-checkbox>
          </div>

          <div class="top_title">提醒老师</div>
          <div class="check_box_wrap">
            <el-checkbox v-model="warnLookClockIn">查看打卡情况（每天 13：00）</el-checkbox>
          </div>
          <div class="check_box_wrap">
            <el-checkbox v-model="warnLookWeekPlan">查看周计划（周一 13：00）</el-checkbox>
          </div>

          <div class="top_title">执行范围</div>
          <div class="check_box_wrap">
            <el-radio-group v-model="allSchool">
              <el-radio :label="1">全校</el-radio>
              <el-radio :label="0">按年级</el-radio>
            </el-radio-group>
          </div>
          <div class="check_box_wrap" v-show="allSchool === 0">
            <el-checkbox-group v-model="selectGrade">
              <el-checkbox :label="item.gradeName" :key="index" v-for="(item, index) in gradeList"></el-checkbox>
            </el-checkbox-group>
          </div>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
  import Backtool from '@/components/BackTool';
  import { getReadClockInSet, saveReadClockInSet, listGradeBySchoolType } from '@/api/systemSet/readPunchClockSet';

  export default {
    name: 'readPunchClockSetIndex',
    components: {
      Backtool
    },
    data() {
      return {
        warnClockIn: false,
        warnWeekPlan: false,
        warnLookClockIn: false,
        warnLookWeekPlan: false,
        allSchool: 1,
        selectGrade: [],
        gradeList: []
      };
    },
    created() {
      this.getReadClockInSet();
    },
    methods: {
      listGradeBySchoolType(type) {
        listGradeBySchoolType(type).then(res => {
          let data = res.data.data;
          if (res.data.code === 200) {
            data.forEach((item) => {
              this.gradeList.push({
                  checked: 0,
                  gradeLevel: item.level,
                  gradeName: item.name
              });
            });
          }
        }).catch();
      },
      getReadClockInSet() {
        getReadClockInSet().then(res => {
          let data = res.data.data;
          if (res.data.code === 200) {
            this.warnClockIn = !!data.warnClockIn;
            this.warnWeekPlan = !!data.warnWeekPlan;
            this.warnLookClockIn = !!data.warnLookClockIn;
            this.warnLookWeekPlan = !!data.warnLookWeekPlan;

            this.allSchool = data.allSchool;
            if (data.gradeList.length) {
              this.gradeList = data.gradeList;
              this.gradeList.forEach((item) => {
                if (item.checked === 1) {
                  this.selectGrade.push(item.gradeName);
                }
              });
            } else {
                let schoolType = this.$store.getters.schoolInfo.type;
                this.listGradeBySchoolType(schoolType);
            }
          }
        }).catch();
      },
      saveReadClockInSet() {
        this.gradeList.forEach((item) => {
          if (this.selectGrade.indexOf(item.gradeName) > -1) {
            item.checked = 1;
          } else {
            item.checked = 0;
          }
        });
        let query = {
          allSchool: this.allSchool,
          gradeListJson: this.allSchool ? '[]' : JSON.stringify(this.gradeList),
          warnClockIn: this.warnClockIn ? 1 : 0,
          warnWeekPlan: this.warnWeekPlan ? 1 : 0,
          warnLookClockIn: this.warnLookClockIn ? 1 : 0,
          warnLookWeekPlan: this.warnLookWeekPlan ? 1 : 0
        };
        saveReadClockInSet(query).then(res => {
          let data = res.data;
          if (data.code === 200) {
            this.$message({
              message: '设置成功！',
              type: 'success'
            });
            this.$router.back();
          }
        }).catch();
      }
    }
  };
</script>

<style lang="scss" scoped>
.demo-ruleForm{
  width: 810px;
  margin: 0 auto;
}
  .read_book_setting_wrap{
    padding:12px;
    .top_title{
      height: 30px;
      line-height: 30px;
      margin-top: 10px;
      font-size: 16px;
      font-weight: 700;
    }
    .check_box_wrap{
      margin-left: 30px;
    }
  }
</style>
