<template>
    <div class="motionDataCollection">
      <!-- 输入框组 start -->
      <div class="filterWrapper">
        <div class="filer-item">
          <el-date-picker  size="medium"
            v-model="form.createDate"
            type="date"
            placeholder="选择日期"
            :picker-options="isDisabled"
            @change="getMotionDataCollection">
          </el-date-picker>
        </div>
        <div class="filer-item" v-if="isAllRole">
          <el-select  size="medium"
            v-model="form.grade"
            placeholder="请选择"
            @change="getSchoolClassByGradeId">
            <el-option
              v-for="item in grades"
              :key="item.value"
              :value="item.value"
              :label="item.label">
            </el-option>
          </el-select>
        </div>
        <div class="filer-item">
          <el-select  size="medium"
            v-model="form.className"
            placeholder="请选择"
            @change="getMotionDataCollection">
            <el-option
              v-for="item in classes"
              :key="item.value"
              :value="item.value"
              :label="item.label">
            </el-option>
          </el-select>
        </div>
        <div class="filer-item" v-if="$moment(form.createDate).format('YYYY-MM-DD') === endDate">
          <el-button type="primary" size="medium" :loading="remindLoading" @click="remindReport">提醒未上报学生</el-button>
        </div>
      </div>
      <!-- 输入框组 end -->
      <!-- 表格数据 start -->
      <div class="tabeWrapper">
        <el-table
          stripe
          border
          fit
          highlight-current-row
          style="width: 100%" :height="nobottommaxH"
          :data="dataList">
          <el-table-column label="学号" align="center" show-overflow-tooltip>
              <template slot-scope="scope">
                  <span>{{scope.row.stuNo}}</span>
              </template>
          </el-table-column>
          <el-table-column label="姓名" align="center" show-overflow-tooltip>
              <template slot-scope="scope">
                  <span>{{scope.row.stuName}}</span>
              </template>
          </el-table-column>
          <el-table-column label="班级" align="center" show-overflow-tooltip>
              <template slot-scope="scope">
                  <span>{{scope.row.className}}</span>
              </template>
          </el-table-column>
          <el-table-column label="一分钟跳绳（个）" align="center" show-overflow-tooltip>
              <template slot-scope="scope">
                  <span>{{scope.row.ropeSkipping}}</span>
              </template>
          </el-table-column>
          <el-table-column label="一分钟仰卧起坐（个）" align="center" show-overflow-tooltip>
              <template slot-scope="scope">
                  <span>{{scope.row.sitUps}}</span>
              </template>
          </el-table-column>
          <el-table-column label="立位体前屈" align="center" show-overflow-tooltip>
              <template slot-scope="scope">
                  <span>{{scope.row.flexion || '--'}}</span>
              </template>
          </el-table-column>
        </el-table>
        <!-- 表格数据 end -->
      </div>
    </div>
</template>

<script>
    import moment from 'moment';
    import mixin from '@/mixins/windowResize';
    import { getUserPossessRole, getSchoolGrade, getSchoolClassByGradeId, getClassList, getMotionDataCollection, remindReport } from '@/api/motionDataCollection'

    export default {
      name: 'motionDataCollection',
      data() {
        return {
          // 日期选择器最大值
          isDisabled: {
            disabledDate(time) {
              return time.getTime() > Date.now()
            }
          },
          // 今日日期
          endDate: this.$moment().format('YYYY-MM-DD'),
          // 提醒中
          remindLoading: false,
          // 是否是运动数据管理员
          isAllRole: false,
          // 年级列表 { Array }
          grades: [],
          // 班级列表 { Array }
          classes: [],
          // 表格数据
          dataList: [
            /*
            { className: 'yiyiban', stuNo: 80, stuName: 'll', sitUps: '80', ropeSkipping: '80' , flexion: 'testtest' },*/
          ],
          form: {
            createDate: this.$moment().format('YYYY-MM-DD'),
            grade: '',
            className: ''
          }
        }
      },
      mixins: [mixin],
      created() {
        this.getUserPossessRole();
      },
      methods: {
        // 判断该用户是否为运动数据管理员
        getUserPossessRole() {
          getUserPossessRole()
            .then(res => res.data)
            .then(res => {
              if (res.code === 200) {
                let data = res.data;
                if (data.result) {
                  // 运动数据管理员
                  this.isAllRole = true;
                  this.getSchoolGrade();
                } else {
                  // 教师
                  this.isAllRole = false;
                  this.getClassList();
                }
              } else {
                this.$message.error(res.msg);
              }
            })
            .catch(err => {
              this.$message.error(res.msg);
            })
        },
        // 获取年级列表
        getSchoolGrade() {
          getSchoolGrade()
            .then(res => res.data)
            .then(res => {
              if (res.code === 200) {
                let data = res.data;
                this.grades = [];
                data.forEach(item => {
                  this.grades.push({
                    value: item.id,
                    label: item.name
                  })
                });
                this.form.grade = this.grades[0].value;
                this.getSchoolClassByGradeId(this.form.grade);
              } else {
                this.$message.error(res.msg);
              }
            })
            .catch(err => {
              this.$message.error(res.msg);
            })
        },
        // 根据年级获取班级列表
        getSchoolClassByGradeId(val) {
          getSchoolClassByGradeId({
            gradeId: val
          })
          .then(res => res.data)
          .then(res => {
              if (res.code === 200) {
                let data = res.data;
                this.classes = [];
                data.forEach(item => {
                  this.classes.push({
                    value: item.id,
                    label: item.name
                  })
                })
                this.form.className = this.classes[0].value;
                this.getMotionDataCollection();
              } else {
                this.$message.error(res.msg);
              }
          })
          .catch(err => {
            this.$message.error(res.msg);
          })
        },
        // 获取当前教师班级列表
        getClassList() {
          getClassList()
            .then(res => res.data)
            .then(res => {
              if (res.code === 200) {
                let data = res.data;
                this.classes = [];
                data.forEach(item => {
                  this.classes.push({
                    value: item.id,
                    label: item.name
                  })
                });
                this.form.className = this.classes[0].value;
                this.getMotionDataCollection();
              } else {
                this.$message.error(res.msg);
              }
            })
            .catch(err => {
              this.$message.error(res.msg);
            })
        },
        // 获取学员运动信息
        getMotionDataCollection() {
          if (!this.form.className || !this.form.createDate) {
            return;
          }
          getMotionDataCollection({
            classId: this.form.className,
            creatDate: this.$moment(this.form.createDate).format('YYYY-MM-DD')
          })
          .then(res => res.data)
          .then(res => {
              if (res.code === 200) {
                let data = res.data;
                data.forEach(item => {
                  if (item.state === 2) {
                    item.ropeSkipping = '--';
                    item.sitUps = '--';
                    item.flexion = '--';
                  }
                })
                this.dataList = [];
                this.dataList = this.dataList.concat(data);
              } else {
                this.$message.error(res.msg);
              }
          })
          .catch(err => {
            this.$message.error(res.msg);
          })
        },
        // 提醒上报
        remindReport() {
          this.remindLoading = true;
          if (!this.form.className) {
            this.remindLoading = false;
              this.$message.error('请选择班级');
              return;
          }
          remindReport({
            classId: this.form.className,
            creatDate: this.$moment(this.form.createDate).format('YYYY-MM-DD'),
          })
          .then(res => res.data)
          .then(res => {
            this.remindLoading = false;
            if (res.code == 200) {
              this.$message({
                  type: 'success',
                  message: '提醒成功'
              });
            } else {
              this.$message.error(res.msg);
            }
          })
          .catch(res => {
            this.remindLoading = false;
            this.$message.error(res.msg);
          })
        }
      }
    }
</script>
<style lang="scss" scoped>
  .motionDataCollection {
    padding:12px;
    .filterWrapper {
      padding-bottom: 10px;
      .filer-item {
        display: inline-block;
      }
    }
  }
</style>
