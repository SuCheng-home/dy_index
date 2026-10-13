<template>
  <div class="auto_apply_set_wrap">
    <div class="header">
      <el-button @click="$router.back()" type="default" size="medium">返回</el-button>
      <el-button type="primary" @click="saveApplySet" size="medium">保存</el-button>
    </div>
    <div class="auto_apply_set_box" :style="`height: ${maxH}px;`">
      <div>
        <div class="code_title">
          <span>学生申报设置</span>
          <el-checkbox v-model="stuApplyRemind">提醒</el-checkbox>
        </div>
        <div class="code_list">
          <el-radio-group v-model="singleWeek">
            <el-radio label="1">单周</el-radio>
            <el-radio label="2">双周</el-radio>
          </el-radio-group>
          <br>
          <el-select v-model="stuApplyWeekDay" multiple placeholder="请选择" size="medium" class="week_select">
            <el-option v-for="item in weekList" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </div>
        <div class="code_list">
          <div class="check_min_title">
            <el-checkbox v-model="subjectApplyLimit"></el-checkbox><span>学科申领人数限制</span>
          </div>
          <div class="clearfix" v-show="subjectApplyLimit">
            <div class="course_item" :key="index" v-for="(item, index) in allCourseList">
              {{item.currName}}
              <el-input-number v-model="item.limitNo" class="num_input" size="mini" controls-position="right" :min="0" :max="99" :step="1"></el-input-number>
            </div>
          </div>
        </div>
      </div>
      <div v-if="stuApplyRemind">
        <div class="code_title">
          <span>提醒家长申报</span>
        </div>
        <div class="code_list">
          <div>
            <span>单周：</span>
            <el-select v-model="stuRemindSingle" multiple placeholder="请选择" size="medium" class="week_select">
              <el-option v-for="item in weekList" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </div>
          <div>
            <span>双周：</span>
            <el-select v-model="stuRemindDouble" multiple placeholder="请选择" size="medium" class="week_select">
              <el-option v-for="item in weekList" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </div>
        </div>
      </div>
      <div>
        <div class="code_title">
          <span>教师审核时间设置</span>
          <el-checkbox v-model="teacherExamineTime">提醒</el-checkbox>
        </div>
        <div class="code_list">
          <div>
            <span>单周：</span>
            <el-select v-model="teacherExamineTimeSingle" multiple placeholder="请选择" size="medium" class="week_select">
              <el-option v-for="item in weekList" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </div>
          <div>
            <span>双周：</span>
            <el-select v-model="teacherExamineTimeDouble" multiple placeholder="请选择" size="medium" class="week_select">
              <el-option v-for="item in weekList" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </div>
        </div>
      </div>
      <div v-if="teacherExamineTime">
        <div class="code_title">
          <span>提醒教师审核</span>
        </div>
        <div class="code_list">
          <div>
            <span>单周：</span>
            <el-select v-model="teacherRemindExamineSingle" multiple placeholder="请选择" size="medium" class="week_select">
              <el-option v-for="item in weekList" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </div>
          <div>
            <span>双周：</span>
            <el-select v-model="teacherRemindExamineDouble" multiple placeholder="请选择" size="medium" class="week_select">
              <el-option v-for="item in weekList" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </div>
        </div>
      </div>
      <div>
        <div class="code_title">
          <span>教师考核时间设置</span>
          <el-checkbox v-model="teacherCheckTime">提醒</el-checkbox>
        </div>
        <div class="code_list">
          <div>
            <span>单周：</span>
            <el-select v-model="teacherCheckTimeSingle" multiple placeholder="请选择" size="medium" class="week_select">
              <el-option v-for="item in weekList" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </div>
          <div>
            <span>双周：</span>
            <el-select v-model="teacherCheckTimeDouble" multiple placeholder="请选择" size="medium" class="week_select">
              <el-option v-for="item in weekList" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </div>
        </div>
      </div>
      <div v-if="teacherCheckTime">
        <div class="code_title">
          <span>提醒教师考核</span>
        </div>
        <div class="code_list">
          <div>
            <span>单周：</span>
            <el-select v-model="teacherRemindCheckSingle" multiple placeholder="请选择" size="medium" class="week_select">
              <el-option v-for="item in weekList" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </div>
          <div>
            <span>双周：</span>
            <el-select v-model="teacherRemindCheckDouble" multiple placeholder="请选择" size="medium" class="week_select">
              <el-option v-for="item in weekList" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import mixins from '@/mixins/windowResize';
  import {querySchoolAllCourse} from '@/api/common/common';
  import {getCreditPointRemindSet, saveCreditPointRemindSet} from '@/api/wtCredit';

  export default {
    name: "autoApplySet",
    data() {
      return {
        stuApplyRemind: false,
        teacherCheckTime: false,
        teacherExamineTime: false,
        subjectApplyLimit: false,
        allCourseList: [],
        singleWeek: '1',
        weekList: [
          {
            value: '1',
            label: '周一'
          },
          {
            value: '2',
            label: '周二'
          },
          {
            value: '3',
            label: '周三'
          },
          {
            value: '4',
            label: '周四'
          },
          {
            value: '5',
            label: '周五'
          },
          {
            value: '6',
            label: '周六'
          },
          {
            value: '7',
            label: '周日'
          }
         ],
        stuApplyWeekDay: [],
        stuRemindSingle: [],
        stuRemindDouble: [],
        teacherExamineTimeSingle: [],
        teacherExamineTimeDouble: [],
        teacherRemindExamineSingle: [],
        teacherRemindExamineDouble: [],
        teacherCheckTimeSingle: [],
        teacherCheckTimeDouble: [],
        teacherRemindCheckSingle: [],
        teacherRemindCheckDouble: []
      }
    },
    mixins: [mixins],
    created() {
      this.getCreditPointRemindSet();
    },
    methods: {
      querySchoolAllCourse() {
        querySchoolAllCourse({}).then(res => {
          const data = res.data.data;
          if (res.data.code === 200 && data) {
            this.allCourseList = [];
            data.forEach((item) => {
              this.allCourseList.push({
                currId: item.id,
                currName: item.name,
                limitNo: 6
              })
            })
          }
        }).catch()
      },
      getCreditPointRemindSet() {
        getCreditPointRemindSet().then(res => {
          const data = res.data.data;
          if (res.data.code === 200 && data) {
            this.stuApplyRemind = data.stuApplyRemind === 1;
            if (data.stuApplyDouble) {
              this.singleWeek = '2';
              this.stuApplyWeekDay = data.stuApplyDouble.split(',');
            } else {
              this.stuApplyWeekDay = data.stuApplySingle.split(',');
            }

            this.subjectApplyLimit = data.currLimit === 1;
            if (data.currLimit === 1) {
              this.allCourseList = data.currSetList
            } else {
              this.querySchoolAllCourse();
            }

            if (data.stuApplyRemind === 1) {
              this.stuRemindSingle = data.stuApplyRemindSingle ? data.stuApplyRemindSingle.split(',') : [];
              this.stuRemindDouble = data.stuApplyRemindDouble ? data.stuApplyRemindDouble.split(',') : [];
            }

            this.teacherCheckTime = data.teacherAssessRemind === 1;
            this.teacherCheckTimeSingle = data.teacherAssessSingle ? data.teacherAssessSingle.split(',') : [];
            this.teacherCheckTimeDouble = data.teacherAssessDouble ? data.teacherAssessDouble.split(',') : [];

            if (data.teacherAssessRemind === 1) {
              this.teacherRemindCheckSingle = data.teacherAssessRemindSingle ? data.teacherAssessRemindSingle.split(',') : [];
              this.teacherRemindCheckDouble = data.teacherAssessRemindDouble ? data.teacherAssessRemindDouble.split(',') : [];
            }

            this.teacherExamineTime = data.teacherAuditRemind === 1;
            this.teacherExamineTimeSingle = data.teacherAuditSingle ? data.teacherAuditSingle.split(',') : [];
            this.teacherExamineTimeDouble = data.teacherAuditDouble ? data.teacherAuditDouble.split(',') : [];

            if (data.teacherAuditRemind === 1) {
              this.teacherRemindExamineSingle = data.teacherAuditRemindSingle ? data.teacherAuditRemindSingle.split(',') : [];
              this.teacherRemindExamineDouble = data.teacherAuditRemindDouble ? data.teacherAuditRemindDouble.split(',') : [];
            }
          } else {
            this.querySchoolAllCourse();
          }
        }).catch()
      },
      saveApplySet() {
        if (this.checkArgs()) {
          let query = {
            currLimit: this.subjectApplyLimit ? 1 : 0,
            currSetList: this.subjectApplyLimit ? this.allCourseList : [],
            stuApplyRemind: this.stuApplyRemind ? 1 : 0,
            stuApplySingle: this.singleWeek === '1' ? this.stuApplyWeekDay.toString() : '',
            stuApplyDouble: this.singleWeek === '2' ? this.stuApplyWeekDay.toString() : '',
            stuApplyRemindSingle: this.stuApplyRemind ? this.stuRemindSingle.toString() : '',
            stuApplyRemindDouble: this.stuApplyRemind ? this.stuRemindDouble.toString() : '',
            teacherAssessRemind: this.teacherCheckTime ? 1 : 0,
            teacherAssessSingle: this.teacherCheckTimeSingle.toString(),
            teacherAssessDouble: this.teacherCheckTimeDouble.toString(),
            teacherAssessRemindSingle: this.teacherCheckTime ? this.teacherRemindCheckSingle.toString() : '',
            teacherAssessRemindDouble: this.teacherCheckTime ? this.teacherRemindCheckDouble.toString() : '',
            teacherAuditRemind: this.teacherExamineTime ? 1 : 0,
            teacherAuditSingle: this.teacherExamineTimeSingle.toString(),
            teacherAuditDouble: this.teacherExamineTimeDouble.toString(),
            teacherAuditRemindSingle: this.teacherExamineTime ? this.teacherRemindExamineSingle.toString() : '',
            teacherAuditRemindDouble: this.teacherExamineTime ? this.teacherRemindExamineDouble.toString() : ''
          };
          this.saveCreditPointRemindSet(query);
        }
      },
      saveCreditPointRemindSet(query) {
        saveCreditPointRemindSet(query).then(res => {
          const data = res.data;
          if (data.code === 200 && data.result) {
            this.$message.success('保存成功');
            this.$router.back();
          } else {
            this.$message.error(data.msg);
          }
        }).catch()
      },
      checkArgs() {
        if (!this.stuApplyWeekDay.length) {
          this.$message.warning('请将学生申报设置补充完整！');
          return false;
        } else if (this.subjectApplyLimit && !this.isAllCourseNumFill()) {
          this.$message.warning('请将学科申领人数限制补充完整！');
          return false;
        } else if (this.stuApplyRemind && !this.stuRemindSingle.length && !this.stuRemindDouble.length) {
          this.$message.warning('请将提醒家长申报补充完整！');
          return false;
        } else if (!this.teacherExamineTimeSingle.length && !this.teacherExamineTimeDouble.length) {
          this.$message.warning('请将教师审核时间设置补充完整！');
          return false;
        } else if (this.teacherExamineTime && !this.teacherRemindExamineSingle.length && !this.teacherRemindExamineDouble.length) {
          this.$message.warning('请将提醒教师审核补充完整！');
          return false;
        } else if (!this.teacherCheckTimeSingle.length && !this.teacherCheckTimeDouble.length) {
          this.$message.warning('请将教师考核时间设置补充完整！');
          return false;
        } else if (this.teacherCheckTime && !this.teacherRemindCheckSingle.length && !this.teacherRemindCheckDouble.length) {
          this.$message.warning('请将提醒教师考核补充完整！');
          return false;
        }
        return true;
      },
      isAllCourseNumFill() {
        let isFill = false;
        this.allCourseList.forEach((item) => {
          if (item.limitNo) {
            isFill = true
          }
        });
        return isFill;
      }
    }
  }
</script>

<style scoped>
  .clearfix:after {
    content: "";
    display: block;
    font-size: 0;
    height: 0;
    clear: both;
    visibility: hidden;
  }
  .clearfix {
    zoom: 1;
  }
</style>
<style lang="scss" scoped>
  .auto_apply_set_wrap{
    padding:12px;
    .header {
      padding-bottom: 10px;
      border-bottom: 1px solid #eee;
    }
    .auto_apply_set_box{
      width: 810px;
      margin: 20px auto;
      overflow-x: hidden;
      overflow-y: auto;

      .code_title {
        height: 20px;
        line-height: 20px;
        margin: 25px 15px 10px 0;
        padding-left: 8px;
        border-left: 3px solid #409eff;
        color: #333;
        font-size: 15px;
        span{
          margin-right: 8px;
        }
      }
      .code_list{
        .week_select{
          width: 500px;
          margin-top: 8px;
        }
        span{
          color: #666;
          font-size: 14px;
        }
        .check_min_title{
          margin: 8px 0;
          span{
            margin-left: 8px;
          }
        }
        .course_item{
          float: left;
          min-width: 150px;
          margin: 8px 3px;
          font-size: 14px;
          color: #666;
          overflow: hidden;
          .num_input{
            width: 80px;
          }
        }
      }
    }
  }
</style>
