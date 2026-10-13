<template>
  <div class="guide_group_add_wrap">
    <div class="header">
      <el-button size="medium" @click.native="goBack">返回</el-button>
      <el-button type="primary" size="medium" @click.native="addGuideGroup">保存</el-button>
    </div>

    <div class="guide_group_add_box" :style="`height: ${maxH}px;`">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-position="right" label-width="140px">
        <el-form-item>
            <div slot="label"><span style="color: #f00;">*</span>每月免费领取活动</div>
            <el-checkbox v-model="ruleForm.applyButton">开启</el-checkbox>
        </el-form-item>
        <el-form-item v-if="ruleForm.applyButton">
            <div slot="label"><span style="color: #f00;">*</span>免费领取时长</div>
             <el-input-number v-model="ruleForm.applyCallLen" controls-position="right" :precision="0" :min="0.1" :max="999" :step="1"></el-input-number>
        </el-form-item>
         <el-form-item>
            <div slot="label"><span style="color: #f00;">*</span>话费充值入口</div>
            <el-checkbox v-model="ruleForm.rechargeButton">开启</el-checkbox>
        </el-form-item>
        <el-form-item>
            <div slot="label"><span style="color: #f00;">*</span>话费扣款途径</div>
            <el-checkbox v-model="ruleForm.deductCardType">一卡通扣款</el-checkbox>
            <el-checkbox v-model="ruleForm.deductTelephoneType">校园电话扣款</el-checkbox>
        </el-form-item>
        <el-form-item>
            <div slot="label"><span style="color: #f00;">*</span>话机通话费率</div>
             <el-input-number v-model="ruleForm.deductCallRate" controls-position="right" :precision="2" :min="0.01" :max="99999" :step="0.1"></el-input-number>
            元/分钟
        </el-form-item>
        <el-form-item>
            <div slot="label"><span style="color: #f00;"></span>话费充值包配置</div>
             <el-input   type="textarea" :autosize="{ minRows: 10, maxRows: 10}"   v-model="ruleForm.rechargePackageJson" :max="500" placeholder="请输入话费充值包配置"></el-input>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
  import mixins from '@/mixins/windowResize';
  import {saveTelephoneSchool, getTelephoneSchool} from '@/api/campusphoneconfiguration';
  export default {
    data() {
      return {
        listLoading: false,
        ruleForm: {
            applyButton:false,//	按月领取开关:0关闭 1开启	number	
            applyCallLen:100,//	免费领取时长(分)	number	
            deductCallRate:0.2,//	费率：每分钟多少钱(分)	number	
            deductCardType:false,//	一卡通扣款：0关闭 1开启	number	
            deductTelephoneType:false,//校园电话扣款：0开启 1关闭	number	
            id:'',//	主键id	number	
            rechargeButton:false,//	充值开关：默认开启	number	0关闭 开启
            rechargePackageJson:'',//	充值包json数据	string
        },
      }
    },
    mixins: [mixins],
    created() {
     this.getTelephoneSchool();
    },
    methods: {
      goBack() {
        this.$router.back();
      },
      getTelephoneSchool() {
        getTelephoneSchool().then(res => {
          const data = res.data.data;
          if (res.data.result&&data.id) {
              this.ruleForm.applyButton=data.applyButton==1;
              this.ruleForm.deductCardType=data.deductCardType==1;
              this.ruleForm.deductTelephoneType=data.deductTelephoneType==1;
              this.ruleForm.rechargeButton=data.rechargeButton==1;
              this.ruleForm.applyCallLen=data.applyCallLen;
              this.ruleForm.deductCallRate=data.deductCallRate/100;
              this.ruleForm.id=data.id;
              this.ruleForm.rechargePackageJson=data.rechargePackageJson;
          }
        })
      },
      addGuideGroup() {
        this.$refs.ruleForm.validate((valid) => {
          if (valid) {
            if (this.listLoading) {
              return;
            }
            let myobj={
                 applyButton:this.ruleForm.applyButton-0,
                 deductCardType:this.ruleForm.deductCardType-0,
                 deductTelephoneType:this.ruleForm.deductTelephoneType-0,
                 rechargeButton:this.ruleForm.rechargeButton-0,
                 id:this.ruleForm.id,
                 deductCallRate:this.ruleForm.deductCallRate*100,
                 rechargePackageJson:this.ruleForm.rechargePackageJson,
                 applyCallLen:this.ruleForm.applyCallLen,
            }
            this.listLoading = true;
            saveTelephoneSchool(myobj).then(res => {
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
