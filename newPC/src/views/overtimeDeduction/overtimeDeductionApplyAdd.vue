<template>
  <div class="overtime_apply_add_wrap">
    <div class="header">
      <el-button @click="goBack" size="medium">返回</el-button>
<!--      <el-button type="primary" @click="saveApply(1)" size="medium">存草稿</el-button>-->
      <el-button type="primary" @click="saveApply(2)" size="medium">发布</el-button>
    </div>
    <div class="overtime_apply_add_box" :style="`height: ${nobottommaxH}px;`">
      <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="140px" class="demo-ruleForm">
            <el-form-item label="加班老师" prop="addressData">
              <address-book v-model="ruleForm.addressData" :config="teacherConfigData"></address-book>
            </el-form-item>
            <el-form-item label="加班日期" prop="overtimeDate">
              <el-date-picker v-model="ruleForm.overtimeDate" type="date" placeholder="选择日期"
                              :clearable="false"></el-date-picker>
            </el-form-item>
            <el-form-item label="加班时长" prop="timeTypeValue">
              <el-radio-group v-model="ruleForm.timeTypeValue">
                <el-radio :label="1">按节次</el-radio>
                <el-radio :label="2">按天数</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="节次" prop="sectionValue" v-show="ruleForm.timeTypeValue === 1">
              <el-select v-model="ruleForm.sectionValue" placeholder="请选择节次">
                <el-option v-for="item in sectionList" :key="item.id" :label="item.name" :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="天数" prop="dayValue" v-show="ruleForm.timeTypeValue === 2">
              <el-select v-model="ruleForm.dayValue" placeholder="请选择天数">
                <el-option v-for="item in dayList" :key="item.id" :label="item.name" :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="发放数量" prop="leaveCount">
              <el-input-number v-model="ruleForm.leaveCount" controls-position="right" :step="1" :min="1"
                               :max="100"></el-input-number>
            </el-form-item>
            <el-form-item label="备注说明" prop="remark">
              <el-input type="textarea" v-model.trim="ruleForm.remark"></el-input>
            </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
  import mixins from '@/mixins/windowResize';
  import AddressBook from '@/components/AddressBook/indexExpand';
  import {
    insertOverTimeDeductionGrant,
    getOverTimeDeductionGrantById,
    updateOverTimeDeductionGrant
  } from '@/api/overtimeDeduction';

  export default {
    name: "overtimeDeductionApplyAdd",
    components: {
      AddressBook
    },
    data() {
      return {
        overtimeApplyId: 0,
        teacherConfigData: {
          title: '选择老师',
          depart: {target: 'user', departType: 't', userTypes: '1'},
          group: false
        },
        sectionList: [
          {
            id: '1',
            name: '1节'
          },
          {
            id: '2',
            name: '2节'
          },
          {
            id: '3',
            name: '3节'
          }
        ],
        dayList: [
          {
            id: '0.5',
            name: '0.5天'
          },
          {
            id: '1',
            name: '1天'
          },
          {
            id: '1.5',
            name: '1.5天'
          },
          {
            id: '2',
            name: '2天'
          },
          {
            id: '2.5',
            name: '2.5天'
          },
          {
            id: '3',
            name: '3天'
          }
        ],
        ruleForm: {
          addressData: {
            userJson: []
          },
          overtimeDate: '',
          timeTypeValue: 2,
          sectionValue: '1',
          dayValue: '0.5',
          leaveCount: 1,
          remark: ''
        },
        rules: {
          addressData: [
            {required: true}
          ],
          overtimeDate: [
            {required: true, message: '请选择加班日期！'}
          ],
          timeTypeValue: [
            {required: true, message: '请选择类型！'}
          ],
          sectionValue: [
            {required: true, message: '请选择节次！'}
          ],
          dayValue: [
            {required: true, message: '请选择天数！'}
          ],
          leaveCount: [
            {required: true, message: '请选择发放数量！'}
          ],
          remark: [
            {required: true, message: '请填写备注说明！'}
          ]
        }
      }
    },
    mixins: [mixins],
    created() {
      this.overtimeApplyId = this.$route.query.id || 0;
      if (this.overtimeApplyId) {
        this.getOverTimeDeductionGrantById();
      }
    },
    methods: {
      goBack() {
        this.$router.back();
      },
      saveApply(state) {
        this.$refs['ruleForm'].validate((valid) => {
          if (valid) {
            if (!this.ruleForm.addressData.userJson || !this.ruleForm.addressData.userJson.length) {
              this.$message({
                message: '请选择老师！',
                type: 'warning'
              });
              return;
            }

            let query = {
              days: this.ruleForm.timeTypeValue === 2 ? Number(this.ruleForm.dayValue) : 0,
              leaveCount: this.ruleForm.leaveCount,
              overTimeDate: this.getStrDate(this.ruleForm.overtimeDate),
              overTimeType: Number(this.ruleForm.timeTypeValue),
              remark: this.ruleForm.remark,
              sectionNo: this.ruleForm.timeTypeValue === 1 ? Number(this.ruleForm.sectionValue) : 0,
              state: state,
              teacherJson: JSON.stringify(this.ruleForm.addressData.userJson),
            };

            if (this.overtimeApplyId) {
              query.id = this.overtimeApplyId;
              this.updateOverTimeDeductionGrant(query);
            } else {
              this.insertOverTimeDeductionGrant(query);
            }
          }
        });
      },
      insertOverTimeDeductionGrant(query) {
        insertOverTimeDeductionGrant(query).then(res => {
          const data = res.data;
          if (res.data.code === 200) {
            const msgText = query.state === 2 ? '发布' : '保存';
            this.$message({
              message: msgText + '成功',
              type: 'success'
            });
            this.$router.back();
          } else {
            this.$message({
              message: data.msg,
              type: 'warning'
            });
          }
        }).catch();
      },
      updateOverTimeDeductionGrant(query) {
        updateOverTimeDeductionGrant(query).then(res => {
          const data = res.data;
          if (res.data.code === 200) {
            const msgText = query.state === 2 ? '发布' : '保存';
            this.$message({
              message: msgText + '成功',
              type: 'success'
            });
            this.$router.back();
          } else {
            this.$message({
              message: data.msg,
              type: 'warning'
            });
          }
        }).catch();
      },
      // 详情
      getOverTimeDeductionGrantById() {
        getOverTimeDeductionGrantById(this.overtimeApplyId).then(res => {
          const data = res.data.data;
          if (res.data.code === 200) {
            this.ruleForm = {
              overtimeDate: data.overTimeDate,
              timeTypeValue: data.overTimeType,
              sectionValue: data.sectionNo ? data.sectionNo.toString() : '1',
              dayValue: data.days ? data.days.toString() : '0.5',
              leaveCount: data.leaveCount,
              remark: data.remark,
              addressData: {
                userJson: []
              }
            };
            this.ruleForm.addressData.userJson = JSON.parse(data.teacherJson);
          }
        }).catch();
      },
      getStrDate(date) {
        let data = new Date(date);
        let strDate = data.getFullYear() + "-" + this.fillZero(data.getMonth() + 1) + "-" + this.fillZero(data.getDate());
        return strDate;
      },
      fillZero(n) {
        return n < 10 ? '0' + n : n;
      },
    }
  }
</script>

<style lang="scss" scoped>
  .overtime_apply_add_wrap {
    padding:12px;
    .header {
      padding-bottom: 10px;
      border-bottom: 1px solid #eee;
    }

    .overtime_apply_add_box {
      padding: 20px;
    }
    .demo-ruleForm{
      width:810px;
      margin:0 auto;
      .el-select,.el-input{
        width:100%;
      }
    }
  }
</style>
