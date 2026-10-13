<template>
  <div class="guide_group_add_wrap">
    <div class="header">
      <el-button size="medium" @click.native="goBack">返回</el-button>
      <el-button type="primary" size="medium" @click.native="addPrintSeniorOffice">保存</el-button>
    </div>

    <div class="guide_group_add_box" :style="`height: ${maxH}px;`">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-position="right" label-width="140px">
        <el-form-item label="办公室名称" prop="name">
          <el-input v-model.trim="ruleForm.name" :maxlength="30" placeholder="请输入办公室名称"></el-input>
        </el-form-item>
        <el-form-item>
          <div slot="label"><span style="color: #f00;">*</span>办公室成员</div>
          <address-book v-model="addressData" :config="configData" ref="address"></address-book>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
  import mixins from '@/mixins/windowResize';
  import AddressBook from '@/components/AddressBook/indexExpand';
  import {addPrintSeniorOffice,updatePrintSeniorOffice,getPrintSeniorOffice}  from '@/api/printApplication';

  export default {
    name: 'guideGroupAdd',
    components: {
      AddressBook
    },
    data() {
      return {
        id: this.$route.query.id || 0,
        ruleForm: {
          name: ''
        },
        listLoading:false,
        rules: {
          name: [
            {required: true, message: '请输入办公室名称', trigger: 'blur'}
          ]
        },
        configData: {title: '请选择办公室成员', depart: {target: 'user', departType: 't', userTypes: '1'}},
        addressData: {}
      }
    },
    mixins: [mixins],
    created() {
      if (this.id) {
        this.getPrintSeniorOffice();
      }
    },
    methods: {
      goBack() {
        this.$router.back();
      },
      getPrintSeniorOffice() {
        getPrintSeniorOffice(this.id).then(res => {
          const data = res.data.data;
          if (res.data.code === 200) {
            this.ruleForm.name = data.name;
            this.addressData = {
              userJson: JSON.parse(data.userJson) || []
            }
          }
        })
      },
      addPrintSeniorOffice() {
        this.$refs.ruleForm.validate((valid) => {
          if (valid) {
            if (!this.addressData.userJson || !this.addressData.userJson.length) {
              this.$message({
                message: '请选择办公室成员!',
                type: 'warning'
              });
              return;
            }
            let query = {
              userJson: this.addressData.userJson,
              name: this.ruleForm.name,
            };

            if (this.listLoading) {
              return;
            }
            this.listLoading = true;
            if(this.id){
                query.id=this.id;
                 updatePrintSeniorOffice(query).then(res => {
              if (res.data.code === 200 && res.data.result) {
                this.$message.success('编辑成功');
                this.listLoading = false;
                this.goBack();
              } else {
                this.$message.warning(res.data.msg);
                this.listLoading = false;
              }
            })
            }else{
               addPrintSeniorOffice(query).then(res => {
              if (res.data.code === 200 && res.data.result) {
                this.$message.success('新增成功');
                this.listLoading = false;
                this.goBack();
              } else {
                this.$message.warning(res.data.msg);
                this.listLoading = false;
              }
            })
            }
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
