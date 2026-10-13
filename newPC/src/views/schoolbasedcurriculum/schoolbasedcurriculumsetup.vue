<template>
  <div class="guide_group_add_wrap">
    <div class="header">
      <el-button size="medium" @click.native="goBack">返回</el-button>
      <el-button type="primary" size="medium" @click.native="addGuideGroup">保存</el-button>
    </div>

    <div class="guide_group_add_box" :style="`height: ${maxH}px;`">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-position="right" label-width="140px">
        <el-form-item>
            <div slot="label"><span style="color: #f00;">*</span>考勤推送开关</div>
            <el-checkbox v-model="ruleForm.sendDayAttend">开启学生考勤推送</el-checkbox>
        </el-form-item>
       <el-form-item v-if="ruleForm.sendDayAttend">
          <div slot="label"><span style="color: #f00;">*</span>推送接收人</div>
          <address-book v-model="addressData" :config="configData" ref="address"></address-book>
        </el-form-item>
        <el-form-item v-if="ruleForm.sendDayAttend">
          <div slot="label"><span style="color: #f00;">*</span>课程范围</div>
          <el-radio v-model="ruleForm.courseScopeType" :label="1">推送当前学期校本课程学生考勤情况</el-radio>
          <el-radio v-model="ruleForm.courseScopeType" :label="2">推送当前学年校本课程学生考勤情况</el-radio>
        </el-form-item>
        <el-form-item>
            <div slot="label"><span style="color: #f00;">*</span>提醒设置</div>
            <el-checkbox v-model="ruleForm.isRemindStuSK">提醒学生上课（16:30）</el-checkbox>
            <span style="color:red">注：提醒明天需要上课的学生</span>
        </el-form-item>
       
      </el-form>
    </div>
  </div>
</template>

<script>
  import mixins from '@/mixins/windowResize';
  import AddressBook from '@/components/AddressBook/indexExpand';
  import {saveSchoolCourseplatformSetInfo, getSchoolCourseplatformSetInfo} from '@/api/systemSet/schoolbasedcurriculum';

  export default {
    name: 'guideGroupAdd',
    components: {
      AddressBook
    },
    data() {
      return {
        listLoading: false,
        ruleForm: {
          guideName: '',
          sendDayAttend:false,
          courseScopeType:1,
          isRemindStuSK:false
        },
        configData: {title: '请选择检查员', depart: {target: 'user', departType: 't', userTypes: '1'}},
        addressData: {}
      }
    },
    mixins: [mixins],
    created() {
     this.getSchoolCourseplatformSetInfo();
    },
    methods: {
      goBack() {
        this.$router.back();
      },
      getSchoolCourseplatformSetInfo() {
        getSchoolCourseplatformSetInfo().then(res => {
          const data = res.data.data;
          if (res.data.result&&data.id) {
              this.ruleForm.sendDayAttend=data.sendDayAttend==1;
              this.ruleForm.isRemindStuSK=data.isRemindStuSK==1;
              this.ruleForm.courseScopeType=data.courseScopeType;
              this.addressData.userJson=JSON.parse(data.receiveUserJson);
          }
        })
      },
      addGuideGroup() {
        this.$refs.ruleForm.validate((valid) => {
          if (valid) {
            if ((!this.addressData.userJson || !this.addressData.userJson.length)&&this.ruleForm.sendDayAttend) {
              this.$message({
                message: '请选择推送接收人!',
                type: 'warning'
              });
              return;
            }
            let query = {
              receiveUserJson: JSON.stringify(this.addressData.userJson),
              sendDayAttend: this.ruleForm.sendDayAttend-0,
              courseScopeType: this.ruleForm.courseScopeType,
              isRemindStuSK:this.ruleForm.isRemindStuSK-0,
            };


            if (this.listLoading) {
              return;
            }
            this.listLoading = true;
            saveSchoolCourseplatformSetInfo(query).then(res => {
              if (res.data.code === 200 && res.data.result) {
                this.$message.success('保存成功');
                this.listLoading = false;
                this.goBack();
              } else {
                this.$message.warning(res.data.msg);
                this.listLoading = false;
              }
            })
          }
        })
      }
    }
  }
</script>

<style lang="scss" scoped="scoped">
  .guide_group_add_wrap {
    padding:12px;

    .header {
      padding-bottom: 10px;
      border-bottom: 1px solid #eee;
    }

    .guide_group_add_box {
      width: 810px;
      margin: 20px auto;
    }
  }
</style>
