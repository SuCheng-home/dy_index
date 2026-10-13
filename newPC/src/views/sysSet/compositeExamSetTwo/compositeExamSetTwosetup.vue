<template>
  <div class="guide_group_add_wrap">
    <div class="header">
      <el-button size="medium" @click.native="goBack">返回</el-button>
      <el-button type="primary" size="medium" @click.native="addAndUpdateComplexInit">保存</el-button>
    </div>

    <div class="guide_group_add_box" :style="`height: ${maxH}px;`">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-position="right" label-width="140px">
        <el-form-item label="" prop="guideName">
             <el-checkbox
              :true-label="2"
              :false-label="1"
              v-model="isPush"
              >开启全局推送</el-checkbox
            >
        <span style="color:red"> (为避免重复提醒，全局推送和按巡查组推送人员不要设置一样)</span>
        </el-form-item>
        <el-form-item v-if="isPush==2">
          <div slot="label"><span style="color: #f00;">*</span>提醒名单</div>
          <address-book v-model="addressData" :config="configData" ref="address"></address-book>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
  import mixins from '@/mixins/windowResize';
  import AddressBook from '@/components/AddressBook/indexExpand';
  import {addAndUpdateComplexInit, getComplexInit} from '@/api/compositeExamSetTwo';

  export default {
    name: 'guideGroupAdd',
    components: {
      AddressBook
    },
    data() {
      return {
        listLoading: false,
        isPush:1,
        configData: {title: '请选择提醒名单', depart: {target: 'user', departType: 't', userTypes: '1'}},
        addressData: {userJson:[]}
      }
    },
    mixins: [mixins],
    created() {
       this.getComplexInit();
    },
    methods: {
      goBack() {
        this.$router.back();
      },
      getComplexInit() {
        getComplexInit().then(res => {
          if (res.data.code === 200&&res.data.data) {
            this.isPush = res.data.data.isPush;
            this.addressData = {
              userJson: JSON.parse(res.data.data.pushUsers) || []
            }
          }
        })
      },
      addAndUpdateComplexInit() {
       if (!this.addressData.userJson || !this.addressData.userJson.length) {
              this.$message({
                message: '请选择提醒名单!',
                type: 'warning'
              });
              return;
            }
            let query = {
              pushUsers: this.isPush==2?this.addressData.userJson:[],
              isPush: this.isPush
            };


            if (this.listLoading) {
              return;
            }
            this.listLoading = true;
            addAndUpdateComplexInit(query).then(res => {
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
