<template>
  <div class="integral_add_wrap">
    <div class="header">
      <el-button @click="$router.back()" type="default" size="medium">返回</el-button>
      <el-button type="primary" size="medium" @click="saveIntegral">保存</el-button>
    </div>
    <div class="integral_add_box" :style="`height: ${maxH}px;`">
      <div class="integral_name_box">
        <span>学年累计积分达到</span>
        <el-input-number v-model="integralNum" size="small" controls-position="right" :min="1" :max="9999" :step="1"></el-input-number>
        <span>可获得</span>
        <el-input v-model.trim="integralName" class="name_input" placeholder="请输入等级名称" size="small" maxlength="10"></el-input>
      </div>
      <div class="integral_check_box">
        <el-checkbox v-model="remindParent">提醒家长</el-checkbox>
      </div>
      <div class="integral_check_box">
        <el-checkbox v-model="remindManager">提醒积分管理员</el-checkbox>
      </div>
    </div>
  </div>
</template>

<script>
  import mixins from '@/mixins/windowResize';
  import {insertCreditPointLevel, updateCreditPointLevel} from '@/api/wtCredit';

  export default {
    name: 'integralAdd',
    data() {
      return {
        integralNum: 1,
        integralName: '',
        remindParent: false,
        remindManager: false
      }
    },
    mixins: [mixins],
    created() {
      if (this.$route.query.id) {
        this.integralNum = this.$route.query.levelPoint;
        this.integralName = this.$route.query.levelName;
        this.remindManager = !!this.$route.query.managerRemind;
        this.remindParent = !!this.$route.query.stuRemind;
      }
    },
    methods: {
      saveIntegral() {
        if (!this.integralNum) {
          this.$message.warning('请输入积分！');
          return;
        } else if (!this.integralName) {
          this.$message.warning('请输入等级名称！');
          return;
        }
        let query = {
          levelName: this.integralName,
          levelPoint: this.integralNum,
          managerRemind: this.remindManager ? 1 : 0,
          stuRemind: this.remindParent ? 1 : 0
        };
        if (this.$route.query.id) {
          query.id = this.$route.query.id;
          this.updateCreditPointLevel(query);
        } else {
          this.insertCreditPointLevel(query);
        }
      },
      insertCreditPointLevel(query) {
        insertCreditPointLevel(query).then(res => {
          const data = res.data;
          if (data.code === 200 && data.result) {
            this.$message.success('保存成功');
            this.$router.back();
          } else {
            this.$message.error(data.msg);
          }
        }).catch()
      },
      updateCreditPointLevel(query) {
        updateCreditPointLevel(query).then(res => {
          const data = res.data;
          if (data.code === 200 && data.result) {
            this.$message.success('保存成功');
            this.$router.back();
          } else {
            this.$message.error(data.msg);
          }
        }).catch()
      }
    }
  }
</script>

<style lang="scss" scoped>
  .integral_add_wrap {
    padding:12px;

    .header {
      padding-bottom: 10px;
      border-bottom: 1px solid #eee;
    }

    .integral_add_box {
      width: 810px;
      margin: 20px auto;
      overflow-x: hidden;
      overflow-y: auto;

      .integral_name_box{
        span{
          color: #666;
          font-size: 14px;
          margin: 0 5px;
        }
        .name_input{
          width: 200px;
        }
      }
      .integral_check_box{
        margin-top: 20px;
        margin-left: 5px;
      }
    }
  }
</style>
