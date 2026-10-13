<template>
  <div class="duty_index_box">
    <div class="header">
      <el-button size="medium" @click="goBack">返回</el-button>
      <el-button type="primary" size="medium" @click="toWeekSet">值班设置</el-button>
      <el-button type="primary" size="medium" @click="printHandler">打印</el-button>
    </div>
    <div :style="{'height':nobottommaxH+'px'}" style="overflow: auto">
            <div class="code_box" ref="print">
      <div class="code_title">进出校登记二维码</div>
      <div class="code_list clearfix">
        <div class="code_block">
          <img :src="QRCodeJson.enterCode" class="code_img" alt="校内人员登记二维码">
          <div class="code_text">校内人员登记二维码</div>
        </div>
        <div class="code_block">
          <img :src="QRCodeJson.outCode" class="code_img" alt="校外人员登记二维码">
          <div class="code_text">校外人员登记二维码</div>
        </div>
      </div>
      <div class="code_title">值班签到二维码</div>
      <div class="code_list clearfix">
        <div class="code_block">
          <img :src="QRCodeJson.dutyCode" class="code_img" alt="值班签到二维码">
          <div class="code_text">值班签到二维码</div>
        </div>
      </div>
    </div>
    </div>

  </div>
</template>

<script>
  import QRCode from 'qrcode';
  import {getWatchSchoolQrCode} from '@/api/systemSet/onDuty';
  import mixin from '@/mixins/windowResize';

  export default {
    name: "onDutyIndex",
    data() {
      return {
        QRCodeJson: {
          enterCode: '',
          outCode: '',
          dutyCode: ''
        }
      }
    },
    created() {
      this.getWatchSchoolQrCode();
    },
     mixins:[mixin],
    methods: {
      goBack() {
        this.$router.back();
      },
      toWeekSet() {
        this.$router.push({path: 'weekSet'});
      },
      printHandler() {
        this.$print(this.$refs.print);
      },
      getWatchSchoolQrCode() {
        getWatchSchoolQrCode().then(res => {
          if (res.data.code === 200) {
            this.getSignInCode(res.data.data.signInQrCode);
            this.getSignOutCode(res.data.data.signOutQrCode);
            this.getDutyCode(res.data.data.callQrCode);
          }
        }).catch()
      },
      getSignInCode(codeUrl) {
        QRCode.toDataURL(codeUrl).then(url => {
          this.QRCodeJson.enterCode = url;
        }).catch(err => {
        });
      },
      getSignOutCode(codeUrl) {
        QRCode.toDataURL(codeUrl).then(url => {
          this.QRCodeJson.outCode = url;
        }).catch(err => {
        });
      },
      getDutyCode(codeUrl) {
        QRCode.toDataURL(codeUrl).then(url => {
          this.QRCodeJson.dutyCode = url;
        }).catch(err => {
        });
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../../styles/style";
  .duty_index_box {
     padding:12px;
    .header {
      padding-bottom: 10px;
      border-bottom: 1px solid #eee;
    }
  }

  .code_box {
    padding: 20px;
  }

  .code_title {
    height: 20px;
    line-height: 20px;
    margin: 15px;
    padding-left: 8px;
    border-left: 4px solid #409eff;
    color: #333;
  }

  .code_block {
    float: left;
    text-align: center;
    margin-top: 10px;
    margin-left: 30px;

  }

  .code_img {
    display: block;
    width: 140px;
    height: 140px;
  }

  .code_text {
    height: 30px;
    line-height: 30px;
    font-size: 14px;
    color: #666;
  }
</style>
