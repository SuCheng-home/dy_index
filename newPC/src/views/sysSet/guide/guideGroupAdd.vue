<template>
  <div class="guide_group_add_wrap">
    <div class="header">
      <el-button size="medium" @click.native="goBack">返回</el-button>
      <el-button type="primary" size="medium" @click.native="addGuideGroup">保存</el-button>
    </div>

    <div class="guide_group_add_box" :style="`height: ${maxH}px;`">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-position="right" label-width="140px">
        <el-form-item label="护导组名称" prop="guideName">
          <el-input v-model.trim="ruleForm.guideName" :maxlength="20" placeholder="请输入组名称(1-20个字符)"></el-input>
        </el-form-item>
        <el-form-item>
          <div slot="label"><span style="color: #f00;">*</span>检查员</div>
          <address-book v-model="addressData" :config="configData" ref="address"></address-book>
        </el-form-item>
        <el-form-item label="提醒设置" >
           <el-checkbox v-model="ruleForm.isSendReport" :true-label="1" :false-label="2">开启提醒</el-checkbox>
        </el-form-item>
         <el-form-item label="提醒时间" class="is-required" v-if="ruleForm.isSendReport==1">
           <el-select v-model="ruleForm.sendReportTime" placeholder="请选择">
            <el-option v-for="(item, index) in timelist" :key="index" :label="item.name" :value="item.name"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="ruleForm.isSendReport==1">
          <div slot="label"><span style="color: #f00;">*</span>提醒人员</div>
          <address-book v-model="addressDatatwo" :config="configDatatwo" ref="address"></address-book>
        </el-form-item>
        <el-form-item label="节假日护导" >
           <el-checkbox v-model="ruleForm.holidayGuid" :true-label="1" :false-label="0">开启节假日护导</el-checkbox>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
  import mixins from '@/mixins/windowResize';
  import AddressBook from '@/components/AddressBook/indexExpand';
  import {addGuideGroup, getGuideGroupInfoById} from '@/api/systemSet/guide';

  export default {
    name: 'guideGroupAdd',
    components: {
      AddressBook
    },
    data() {
      return {
        listLoading: false,
        guideGroupId: this.$route.query.guideGroupId || 0,
        ruleForm: {
          guideName: '',
          isSendReport:2,
          sendReportTime:'16:00',
          holidayGuid:0
        },
        timelist:[{id:1,name:'16:00'},{id:2,name:'16:30'},{id:3,name:'17:00'},{id:4,name:'17:30'},{id:5,name:'18:00'}],
        rules: {
          guideName: [
            {required: true, message: '请输入护导组名称', trigger: 'blur'},
            {min: 1, max: 20, message: '长度在 1 到 20 个字符！', trigger: 'blur'}
          ]
        },
        configData: {title: '请选择检查员', depart: {target: 'user', departType: 't', userTypes: '1'}},
        addressData: {},
        configDatatwo: {title: '请选择提醒人员', depart: {target: 'user', departType: 't', userTypes: '1'}},
        addressDatatwo: {}
      }
    },
    mixins: [mixins],
    created() {
      if (this.guideGroupId) {
        this.getGuideGroupInfoById();
      }
    },
    methods: {
      goBack() {
        this.$router.back();
      },
      getGuideGroupInfoById() {
        getGuideGroupInfoById(this.guideGroupId).then(res => {
          const data = res.data.data;
          if (res.data.code === 200) {
            this.ruleForm.guideName = data.groupName;
            this.ruleForm.holidayGuid = data.holidayGuid||0;
            this.ruleForm.isSendReport = data.isSendReport||2;
            this.ruleForm.sendReportTime = data.sendReportTime||'16:00';
            this.addressData = {
              userJson: JSON.parse(data.checkerJson) || []
            }
             this.addressDatatwo = {
              userJson: JSON.parse(data.reportUserJson) || []
            }
          }
        })
      },
      addGuideGroup() {
        this.$refs.ruleForm.validate((valid) => {
          if (valid) {
            if (!this.addressData.userJson || !this.addressData.userJson.length) {
              this.$message({
                message: '请选择检查员!',
                type: 'warning'
              });
              return;
            }
             if ((!this.addressData.userJson || !this.addressData.userJson.length)&&(this.ruleForm.isSendReport==1)) {
              this.$message({
                message: '请选择提醒人员!',
                type: 'warning'
              });
              return;
            }
            let query = {
              checkerJson: JSON.stringify(this.addressData.userJson),
              groupName: this.ruleForm.guideName,
              isSendReport: this.ruleForm.isSendReport,
              reportUserJson: JSON.stringify(this.ruleForm.isSendReport==1?this.addressDatatwo.userJson:[]),
              sendReportTime: this.ruleForm.sendReportTime,
              holidayGuid: this.ruleForm.holidayGuid,
              id: this.guideGroupId
            };


            if (this.listLoading) {
              return;
            }
            this.listLoading = true;
            addGuideGroup(query).then(res => {
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
