<template>
  <div class="peanutadd">
    <div class="header">
      <el-button size="medium" @click.native="$router.back()">返回</el-button>
      <el-button type="primary" size="medium" @click.native="addPanutGrant">保存</el-button>
    </div>

    <div class="guide_group_add_box" :style="`height: ${maxH}px;`">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-position="right" label-width="140px">
        <el-form-item label="事由" prop="content">
          <el-input  type="textarea" v-model.trim="ruleForm.content"   :rows="4" resize="none" :maxlength="100" placeholder="请输入事由"></el-input>
        </el-form-item>
        <el-form-item>
          <div slot="label"><span style="color: #f00;">*</span>发放范围</div>
          <address-book v-model="addressData" :config="configData" ref="address"></address-book>
        </el-form-item>
          <el-form-item label="发放金额" prop="num">
              <el-input-number v-model="ruleForm.num"  placeholder="请输入金额" :min="1" :max="10000" label="发放金额"></el-input-number>
            </el-form-item>   
      </el-form>
    </div>
  </div>
</template>

<script>
  import mixins from '@/mixins/windowResize';
  import AddressBook from '@/components/AddressBook/indexExpand';
  import {addPanutGrant}  from '@/api/peanut';
  export default {
    components: {
      AddressBook
    },
    data() {
      return {
        ruleForm: {
          content: '',
          num:undefined
        },
        listLoading:false,
        rules: {
          content: [
            {required: true, message: '请输入事由', trigger: 'blur'}
          ],
          num:[{ required: true, message: "请输入发放金额", trigger: "change" }],
        },
        configData: {title: '请选择发放范围', depart: {target: 'all', departType: 't', userTypes: '1'}},
        addressData: {departJson: [], groupJson: [], userJson: []}
      }
    },
    mixins: [mixins],
    methods: {
      addPanutGrant() {
        this.$refs.ruleForm.validate((valid) => {
          if (valid) {
            if ( !this.addressData.userJson.length&&!this.addressData.departJson.length) {
              this.$message({
                message: '请选择发放范围!',
                type: 'warning'
              });
              return;
            }
            let query = {
              userScope: {
                  departList:this.addressData.departJson,
                  userList:this.addressData.userJson
              },
              content: this.ruleForm.content,
              num:this.ruleForm.num,
              status:1
            };

            if (this.listLoading) {
              return;
            }
            this.listLoading = true;
             addPanutGrant(query).then(res => {
              if (res.data.code === 200 && res.data.result) {
                this.$message.success('发放成功');
                this.listLoading = false;
                this.$router.back();
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
  .peanutadd {
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
