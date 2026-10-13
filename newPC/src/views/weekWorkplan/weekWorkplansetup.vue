<template>
  <div class="guide_group_add_wrap">
    <div class="header">
      <el-button size="medium" @click.native="goBack">返回</el-button>
      <el-button type="primary" size="medium" @click="udapteReviewSettings()">保存</el-button>
    </div>

    <div class="guide_group_add_box" :style="`height: ${maxH}px;`">
      <el-form  ref="ruleForm" label-position="right" label-width="140px">
        <el-form-item label="审核" prop="guideName">
          <el-checkbox v-model="status">是否需要审核</el-checkbox>
        </el-form-item>
        <el-form-item v-if="status">
          <div slot="label"><span style="color: #f00;">*</span>审核人</div>
          <address-book v-model="addressData" :config="configData" ref="address"></address-book>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
  import mixins from '@/mixins/windowResize';
  import AddressBook from '@/components/AddressBook/indexExpand';
  import {queryReviewSetting,udapteReviewSetting} from '@/api/weekWorkplan';

  export default {
    name: 'guideGroupAdd',
    components: {
      AddressBook
    },
    data() {
      return {
        id:'',
        status:false,
        configData: {title: '请选择审核人', depart: {target: 'user', departType: 't', userTypes: '1'}},
        addressData: {}
      }
    },
    mixins: [mixins],
    created() {
        this.queryReviewSettings();
    },
    methods: {
      goBack() {
        this.$router.back();
      },
      queryReviewSettings() {
         queryReviewSetting().then(res => {
         this.status=(res.data.data.status==1);
         this.id=res.data.data.id;
         if(this.status){
               this.addressData = {
               userJson: JSON.parse(res.data.data.reviewUsers)
            }
         }
         }).catch(err => {});
      },
      udapteReviewSettings() {
            if ((!this.addressData.userJson || !this.addressData.userJson.length)&&this.status) {
              this.$message({
                message: '请选择检查员!',
                type: 'warning'
              });
              return;
            }
            let query = {
              reviewUsers: JSON.stringify(this.addressData.userJson),
              status: this.status?1:2,
              id: this.id
            };
            udapteReviewSetting(query).then(res => {
              if (res.data.code === 200 && res.data.result) {
                this.$message.success('保存成功');
                this.goBack();
              } else {
                this.$message.warning(res.data.msg);
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
